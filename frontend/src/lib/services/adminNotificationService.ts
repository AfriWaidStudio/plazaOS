import { api } from '../api'

export type AdminNotificationType = 'payment' | 'maintenance' | 'announcement' | 'reminder'

export interface AdminNotificationItem {
  id: string
  type: AdminNotificationType
  title: string
  body?: string
  date: string
  read: boolean
}

export const adminNotificationService = {
  async list(): Promise<AdminNotificationItem[]> {
      return await api.get('/admin/notifications')
  },

  async markRead(id: string) {
      return await api.post(`/admin/notifications/${id}/read`)
  },

  async markAllRead() {
      return await api.post('/admin/notifications/mark-all-read')
  },
}
