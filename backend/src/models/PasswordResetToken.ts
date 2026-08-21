import { Schema, model, models, type InferSchemaType } from 'mongoose'

const passwordResetTokenSchema = new Schema(
  {
    tokenHash: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
)

passwordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export type PasswordResetTokenDoc = InferSchemaType<typeof passwordResetTokenSchema>
export const PasswordResetToken = models.PasswordResetToken ?? model('PasswordResetToken', passwordResetTokenSchema)
