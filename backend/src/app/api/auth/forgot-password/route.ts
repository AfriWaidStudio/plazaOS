import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { dbConnect } from '@/lib/db'
import { User } from '@/models/User'
import { issueResetToken } from '@/lib/password-reset'
import { sendEmail } from '@/lib/email'
import { ApiError } from '@/lib/api-error'
import { withErrorHandling, OPTIONS as corsOptions } from '@/lib/route-handler'
import { rateLimit, clientIp } from '@/lib/rate-limit'

export { corsOptions as OPTIONS }

const forgotPasswordSchema = z.object({ email: z.string().email() }).strict()

export const POST = withErrorHandling(async (request: NextRequest) => {
  rateLimit(`forgot-password:${clientIp(request)}`, 5, 15 * 60_000)
  const parsed = forgotPasswordSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) throw new ApiError('Enter a valid email address', 400)

  await dbConnect()
  const user = await User.findOne({ email: parsed.data.email.toLowerCase() })
  let devToken: string | undefined
  if (user) {
    devToken = await issueResetToken(user._id.toString())
    const resetUrl = `${process.env.FRONTEND_URL ?? 'http://localhost:5173'}/reset-password?token=${devToken}`
    await sendEmail({
      to: user.email,
      subject: 'Reset your Plaza OS password',
      html: `<p>Reset your Plaza OS password within 30 minutes:</p><p><a href="${resetUrl}">Reset password</a></p>`,
    })
  }

  return NextResponse.json({
    message: 'If an account exists for that address, we have sent a password reset link.',
    ...(process.env.NODE_ENV !== 'production' && devToken ? { devToken } : {}),
  })
})
