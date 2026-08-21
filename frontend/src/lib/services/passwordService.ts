import { api } from '../api'
import type { AuthUser } from '../../context/AuthContext'

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}

export interface ChangePasswordResponse {
  user?: AuthUser
}

export interface ForgotPasswordResponse {
  message: string
  devToken?: string
}

export const passwordService = {
  async changePassword(payload: ChangePasswordPayload): Promise<ChangePasswordResponse | undefined> {
    return await api.post<ChangePasswordResponse | undefined>('/auth/change-password', payload)
  },

  async requestReset(email: string): Promise<ForgotPasswordResponse> {
    return await api.post<ForgotPasswordResponse>('/auth/forgot-password', { email })
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await api.post('/auth/reset-password', { token, newPassword })
  },
}
