import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { dbConnect } from '@/lib/db'
import { User } from '@/models/User'
import { hashPassword, verifyPassword } from '@/lib/password'
import { ApiError } from '@/lib/api-error'
import { withErrorHandling, requireAuth, OPTIONS as corsOptions } from '@/lib/route-handler'
import { rateLimit } from '@/lib/rate-limit'

export { corsOptions as OPTIONS }

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
}).strict()

export const POST = withErrorHandling(async (request: NextRequest) => {
  const auth = requireAuth(request)
  rateLimit(`change-password:${auth.sub}`, 5, 15 * 60_000)

  const parsed = changePasswordSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) throw new ApiError('Invalid password change request', 400)

  await dbConnect()
  const user = await User.findById(auth.sub)
  if (!user) throw new ApiError('User not found', 404)
  if (!(await verifyPassword(parsed.data.currentPassword, user.passwordHash))) {
    throw new ApiError('Current password is incorrect', 400)
  }

  user.passwordHash = await hashPassword(parsed.data.newPassword)
  user.mustChangePassword = false
  user.accountStatus = 'active'
  await user.save()

  return NextResponse.json({
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      mustChangePassword: user.mustChangePassword,
    },
  })
})
