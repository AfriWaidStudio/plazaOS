import { createHash, randomBytes } from 'node:crypto'
import { PasswordResetToken } from '@/models/PasswordResetToken'

const RESET_TOKEN_TTL_MS = 30 * 60 * 1000

export function hashResetToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export async function issueResetToken(userId: string): Promise<string> {
  const token = randomBytes(32).toString('hex')
  await PasswordResetToken.deleteMany({ userId })
  await PasswordResetToken.create({
    tokenHash: hashResetToken(token),
    userId,
    expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
  })
  return token
}
