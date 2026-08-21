import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { dbConnect } from '@/lib/db'
import { User } from '@/models/User'
import { PasswordResetToken } from '@/models/PasswordResetToken'
import { hashPassword } from '@/lib/password'
import { hashResetToken } from '@/lib/password-reset'
import { ApiError } from '@/lib/api-error'
import { withErrorHandling, OPTIONS as corsOptions } from '@/lib/route-handler'
import { rateLimit, clientIp } from '@/lib/rate-limit'

export { corsOptions as OPTIONS }

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(8),
}).strict()

export const POST = withErrorHandling(async (request: NextRequest) => {
  rateLimit(`reset-password:${clientIp(request)}`, 10, 15 * 60_000)
  const parsed = resetPasswordSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) throw new ApiError('Invalid password reset request', 400)

  await dbConnect()
  const resetToken = await PasswordResetToken.findOneAndDelete({
    tokenHash: hashResetToken(parsed.data.token),
    expiresAt: { $gt: new Date() },
  })
  if (!resetToken) throw new ApiError('This reset link is invalid or expired', 400)

  const user = await User.findById(resetToken.userId)
  if (!user) throw new ApiError('This reset link is invalid or expired', 400)

  user.passwordHash = await hashPassword(parsed.data.newPassword)
  user.mustChangePassword = false
  user.accountStatus = 'active'
  await user.save()

  return NextResponse.json({ success: true })
})
