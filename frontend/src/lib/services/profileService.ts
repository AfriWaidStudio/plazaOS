import { api } from '../api'

export interface Profile {
  id: string
  name: string
  email: string
  phone?: string
  unit?: string
  leaseStart?: string
  leaseEnd?: string
  monthlyRent?: number
}

export interface UpdateProfileInput {
  name?: string
  phone?: string
}

export const profileService = {
  async get(): Promise<Profile> {
    return await api.get(`/tenant/profile`)
  },

  async update(payload: { name: string; phone?: string }): Promise<Profile> {
    return await api.patch(`/tenant/profile`, payload)
  },
}
