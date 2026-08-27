import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { dbConnect } from '@/lib/db'
import { MaintenanceRequest } from '@/models/MaintenanceRequest'
import { User } from '@/models/User'
import { ApiError } from '@/lib/api-error'
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
    comments: doc.comments?.map((c: any) => ({
      id: c._id.toString(),
      authorId: c.authorId.toString(),
      authorName: c.authorName,
      role: c.role,
      content: c.content,
      createdAt: c.createdAt.toISOString(),
    })) || [],
  }
}

export const GET = withErrorHandling(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  requireRole(request, 'admin')
  const { id } = await params
  await dbConnect()
  const doc = await MaintenanceRequest.findById(id).catch(() => null)
  if (!doc) throw new ApiError('Maintenance request not found', 404)
  return NextResponse.json(toPublicRequest(doc))
})

// Status/priority transitions are admin-only by construction here — tenants
// only have `GET`/`POST` on their own requests (`/tenant/maintenance`), never
// a PATCH — see BACKEND_BUILD_PLAN.md §5.
const updateMaintenanceSchema = z
  .object({
    status: z.enum(['open', 'in_progress', 'resolved']).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    notes: z.string().optional(),
    resolvedAt: z.string().nullable().optional(),
  })
  .strict()
  .refine((body) => Object.keys(body).length > 0, { message: 'No fields to update' })

export const PATCH = withErrorHandling(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  requireRole(request, 'admin')
  const { id } = await params
  const body = await request.json().catch(() => null)
  const parsed = updateMaintenanceSchema.safeParse(body)
  if (!parsed.success) throw new ApiError('Invalid maintenance update', 400)

  await dbConnect()
  const doc = await MaintenanceRequest.findById(id).catch(() => null)
  if (!doc) throw new ApiError('Maintenance request not found', 404)

  const hasChanges = parsed.data.status !== undefined || parsed.data.priority !== undefined;
  if (parsed.data.status !== undefined) doc.status = parsed.data.status
  if (parsed.data.priority !== undefined) doc.priority = parsed.data.priority
  if (parsed.data.notes !== undefined) doc.notes = parsed.data.notes
  if (parsed.data.resolvedAt !== undefined) {
    doc.resolvedAt = parsed.data.resolvedAt
  } else if (doc.status === 'resolved' && !doc.resolvedAt) {
    doc.resolvedAt = new Date().toISOString().slice(0, 10)
  }
  await doc.save()

  if (hasChanges) {
    const tenant = await User.findById(doc.tenantId).catch(() => null)
    if (tenant) {
      const { sendEmail } = await import('@/lib/email')
      sendEmail({
        to: tenant.email,
        subject: `Update on Maintenance Request: ${doc.title}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Ticket Updated</h2>
            <p>Your maintenance request <strong>${doc.title}</strong> has been updated.</p>
            <p><strong>New Status:</strong> ${doc.status}</p>
            <p><strong>Priority:</strong> ${doc.priority}</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://plaza-os-kappa.vercel.app'}/tenant/maintenance/${doc._id}" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 16px;">View Ticket in PlazaOS</a>
          </div>
        `
      }).catch(console.error)
    }
  }

  return NextResponse.json(toPublicRequest(doc))
})
