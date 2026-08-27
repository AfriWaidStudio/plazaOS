import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { dbConnect } from '@/lib/db'
import { MaintenanceRequest } from '@/models/MaintenanceRequest'
import { User } from '@/models/User'
import { ApiError } from '@/lib/api-error'
import { sendEmail } from '@/lib/email'
import { withErrorHandling, requireRole, OPTIONS as corsOptions } from '@/lib/route-handler'

export { corsOptions as OPTIONS }

const commentSchema = z.object({ content: z.string().min(1) }).strict()

export const POST = withErrorHandling(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const auth = requireRole(request, 'tenant')
  const { id } = await params
  
  const body = await request.json().catch(() => null)
  const parsed = commentSchema.safeParse(body)
  if (!parsed.success) throw new ApiError('Comment content is required', 400)

  await dbConnect()
  
  const tenant = await User.findById(auth.sub)
  if (!tenant) throw new ApiError('Tenant not found', 404)

  const doc = await MaintenanceRequest.findOne({ _id: id, tenantId: auth.sub })
  if (!doc) throw new ApiError('Maintenance request not found', 404)

  doc.comments.push({
    authorId: tenant._id as any,
    authorName: tenant.name,
    role: 'tenant',
    content: parsed.data.content,
  })

  await doc.save()

  // Notify admin
  sendEmail({
    to: process.env.ADMIN_EMAIL || 'admin@plaza.test',
    subject: `New Comment on Maintenance Request: ${doc.title}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Message from Tenant</h2>
        <p>Tenant <strong>${tenant.name}</strong> has commented on their maintenance request: <strong>${doc.title}</strong></p>
        <div style="background-color: #f3f4f6; padding: 12px; border-radius: 6px; font-style: italic; margin: 16px 0;">
          "${parsed.data.content}"
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://plaza-os-kappa.vercel.app'}/admin/maintenance/${doc._id}" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 16px;">View Ticket in PlazaOS</a>
      </div>
    `
  }).catch(console.error)

  const newComment = doc.comments[doc.comments.length - 1]
  return NextResponse.json(newComment)
})
