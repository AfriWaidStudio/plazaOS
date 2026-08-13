import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { dbConnect } from '@/lib/db'
import { MaintenanceRequest } from '@/models/MaintenanceRequest'
import { ApiError } from '@/lib/api-error'
import { sendEmail } from '@/lib/email'
import { User } from '@/models/User'
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

  if (parsed.data.status !== undefined && parsed.data.status !== doc.status) {
    const oldStatus = doc.status
    doc.status = parsed.data.status
    
    // Dispatch email notification to tenant
    if (doc.status === 'resolved' || doc.status === 'in_progress') {
      const tenant = await User.findById(doc.tenantId).catch(() => null)
      if (tenant && tenant.email) {
        const action = doc.status === 'resolved' ? 'resolved' : 'is now in progress'
        sendEmail({
          to: tenant.email,
          subject: `Maintenance Request Update: ${doc.title}`,
          html: `
            <p>Hello ${tenant.name},</p>
            <p>Your maintenance request "<strong>${doc.title}</strong>" ${action}.</p>
            <p><strong>Status:</strong> ${doc.status}</p>
            ${doc.notes ? `<p><strong>Admin Notes:</strong> ${doc.notes}</p>` : ''}
            <p>Thank you,<br/>Plaza Management</p>
          `
        }).catch(err => console.error('Failed to send maintenance email', err))
      }
    }
  }

  if (parsed.data.priority !== undefined) doc.priority = parsed.data.priority
  if (parsed.data.notes !== undefined) doc.notes = parsed.data.notes
  if (parsed.data.resolvedAt !== undefined) {
    doc.resolvedAt = parsed.data.resolvedAt
  } else if (doc.status === 'resolved' && !doc.resolvedAt) {
    doc.resolvedAt = new Date().toISOString().slice(0, 10)
  }
  await doc.save()

  return NextResponse.json(toPublicRequest(doc))
})
