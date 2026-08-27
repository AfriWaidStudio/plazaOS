import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { dbConnect } from '@/lib/db'
import { User } from '@/models/User'
import { hashPassword } from '@/lib/password'
import { ApiError } from '@/lib/api-error'
import { withErrorHandling, OPTIONS as corsOptions } from '@/lib/route-handler'
import { rateLimit } from '@/lib/rate-limit'

export { corsOptions as OPTIONS }

export const GET = withErrorHandling(async (request: NextRequest) => {
  const token = request.nextUrl.searchParams.get('token')
  if (!token) throw new ApiError('Token is required', 400)

  await dbConnect()
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() },
  })

  if (!user) {
    throw new ApiError('Invalid or expired token', 400)
  }

  return NextResponse.json({ valid: true })
})

const resetPasswordSchema = z
  .object({
    token: z.string(),
    newPassword: z.string().min(8),
  })
  .strict()

export const POST = withErrorHandling(async (request: NextRequest) => {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
  rateLimit(`reset-password:${ip}`, 5, 15 * 60_000)

  const body = await request.json().catch(() => null)
  const parsed = resetPasswordSchema.safeParse(body)
  if (!parsed.success) throw new ApiError('Password must be at least 8 characters', 400)

  await dbConnect()
  const user = await User.findOne({
    resetPasswordToken: parsed.data.token,
    resetPasswordExpires: { $gt: new Date() },
  })

  if (!user) {
    throw new ApiError('Invalid or expired token', 400)
  }

  user.passwordHash = await hashPassword(parsed.data.newPassword)
  user.resetPasswordToken = undefined
  user.resetPasswordExpires = undefined
  user.mustChangePassword = false
  user.accountStatus = 'active'
  await user.save()

  return NextResponse.json({ success: true })
})
