import { api } from '../api'

export type NotificationType = 'payment' | 'maintenance' | 'announcement' | 'appointment'

export interface NotificationItem {
  id: string
  type: NotificationType
  title: string
  body?: string
  date: string
  read: boolean
}

export const notificationService = {
  async list(): Promise<NotificationItem[]> {
    
  },

  async markRead(id: string) {
    
  },

  async markAllRead() {
    
  },
}
