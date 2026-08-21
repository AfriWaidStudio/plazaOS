import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { dbConnect } from '@/lib/db'
import { MaintenanceRequest } from '@/models/MaintenanceRequest'
import { User } from '@/models/User'
import { ApiError } from '@/lib/api-error'
import { escapeRegex, parsePageParams } from '@/lib/list-query'
import { withErrorHandling, requireRole, OPTIONS as corsOptions } from '@/lib/route-handler'

export { corsOptions as OPTIONS }

function toPublicRequest(doc: any) {
  return {
    id: doc._id.toString(),
    tenantId: doc.tenantId.toString(),
    tenantName: doc.tenantName,
    unitId: doc.unitId ? doc.unitId.toString() : undefined,
    unitNumber: doc.unitNumber,
    title: doc.title,
    description: doc.description,
    status: doc.status,
    priority: doc.priority,
    images: (doc.images ?? []).map((image: { url: string }) => image.url),
    notes: doc.notes ?? '',
    createdAt: doc.createdAt.toISOString().slice(0, 10),
    resolvedAt: doc.resolvedAt ?? null,
  }
}

const SORT_FIELDS = ['createdAt', 'priority', 'status'] as const

// Admin-wide view across every tenant's requests — separate from
// `GET /tenant/maintenance`, which is scoped to the authenticated tenant's
// own requests only.
export const GET = withErrorHandling(async (request: NextRequest) => {
  requireRole(request, 'admin')
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')?.trim() ?? ''
  const status = searchParams.get('status')
  const priority = searchParams.get('priority')
  const sortBy = searchParams.get('sortBy') ?? 'createdAt'
  const sortDir = searchParams.get('sortDir') === 'desc' ? -1 : 1
  const { page, pageSize } = parsePageParams(searchParams)

  if (!SORT_FIELDS.includes(sortBy as (typeof SORT_FIELDS)[number])) throw new ApiError(`Invalid sortBy: ${sortBy}`, 400)

  await dbConnect()
  const filter: Record<string, unknown> = {}
  if (search) {
    const regex = { $regex: escapeRegex(search), $options: 'i' }
    filter.$or = [{ title: regex }, { tenantName: regex }]
  }
  if (status && status !== 'all') filter.status = status
  if (priority && priority !== 'all') filter.priority = priority

  const [docs, total] = await Promise.all([
    MaintenanceRequest.find(filter)
      .sort({ [sortBy]: sortDir })
      .skip((page - 1) * pageSize)
      .limit(pageSize),
    MaintenanceRequest.countDocuments(filter),
  ])

  return NextResponse.json({ data: docs.map(toPublicRequest), total, page, pageSize })
})

const createMaintenanceSchema = z.object({
  tenantId: z.string().min(1),
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  priority: z.enum(['low', 'medium', 'high']).optional(),
}).strict()

export const POST = withErrorHandling(async (request: NextRequest) => {
  requireRole(request, 'admin')
  const parsed = createMaintenanceSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) throw new ApiError('Tenant, title, and description are required', 400)

  await dbConnect()
  const tenant = await User.findOne({ _id: parsed.data.tenantId, role: 'tenant' }).catch(() => null)
  if (!tenant) throw new ApiError('Tenant not found', 404)

  const doc = await MaintenanceRequest.create({
    tenantId: tenant._id,
    tenantName: tenant.name,
    unitId: tenant.unitId,
    unitNumber: tenant.unitNumber ?? 'unassigned',
    title: parsed.data.title,
    description: parsed.data.description,
    priority: parsed.data.priority ?? 'medium',
  })

  return NextResponse.json(toPublicRequest(doc), { status: 201 })
})
