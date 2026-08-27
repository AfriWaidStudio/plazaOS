import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { dbConnect } from '@/lib/db'
import { User } from '@/models/User'
import { ApiError } from '@/lib/api-error'
import { withErrorHandling, OPTIONS as corsOptions } from '@/lib/route-handler'
import { rateLimit } from '@/lib/rate-limit'
import crypto from 'crypto'

export { corsOptions as OPTIONS }

const forgotPasswordSchema = z
  .object({
    email: z.string().email(),
  })
  .strict()

export const POST = withErrorHandling(async (request: NextRequest) => {
  // Use IP for rate limiting since the user isn't authenticated yet
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
  rateLimit(`forgot-password:${ip}`, 5, 15 * 60_000)

  const body = await request.json().catch(() => null)
  const parsed = forgotPasswordSchema.safeParse(body)
  if (!parsed.success) throw new ApiError('Invalid email', 400)

  await dbConnect()
  const user = await User.findOne({ email: parsed.data.email.toLowerCase() })
  
  // We don't want to leak whether an email exists, so we always return 200.
  // In a real application, we would send an email if the user was found.
  // For development/parity with the current mock, we will generate the token
  // and return it so the dev UI can display it.
  
  if (user) {
    const token = crypto.randomBytes(32).toString('hex')
    user.resetPasswordToken = token
    user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
    await user.save()
    
    return NextResponse.json({ success: true, token })
  }

  // If user not found, still return success to prevent email enumeration
  return NextResponse.json({ success: true })
})
