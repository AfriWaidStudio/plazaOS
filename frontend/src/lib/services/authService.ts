import { api } from '../api'

export const authService = {
  async setPassword(newPassword: string): Promise<{ success: boolean }> {
      return await api.post('/auth/set-password', { newPassword })
  },
}
