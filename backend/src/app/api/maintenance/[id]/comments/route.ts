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
  const auth = requireRole(request, 'admin')
  const { id } = await params
  
  const body = await request.json().catch(() => null)
  const parsed = commentSchema.safeParse(body)
  if (!parsed.success) throw new ApiError('Comment content is required', 400)

  await dbConnect()
  
  const admin = await User.findById(auth.sub)
  if (!admin) throw new ApiError('Admin not found', 404)

  const doc = await MaintenanceRequest.findById(id)
  if (!doc) throw new ApiError('Maintenance request not found', 404)

  doc.comments.push({
    authorId: admin._id as any,
    authorName: admin.name,
    role: 'admin',
    content: parsed.data.content,
  })

  await doc.save()

  const tenant = await User.findById(doc.tenantId)
  if (tenant) {
    sendEmail({
      to: tenant.email,
      subject: `New Comment on Maintenance Request: ${doc.title}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Message from Management</h2>
          <p>An admin has commented on your maintenance request: <strong>${doc.title}</strong></p>
          <div style="background-color: #f3f4f6; padding: 12px; border-radius: 6px; font-style: italic; margin: 16px 0;">
            "${parsed.data.content}"
          </div>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://plaza-os-kappa.vercel.app'}/tenant/maintenance/${doc._id}" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 16px;">View Ticket</a>
        </div>
      `
    }).catch(console.error)
  }

  // Return the newly added comment (the last one in the array)
  const newComment = doc.comments[doc.comments.length - 1]
  return NextResponse.json(newComment)
})
