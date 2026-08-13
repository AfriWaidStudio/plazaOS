import { api } from '../../../lib/api'
import type { AccountStatus, RentStatus, Tenant } from '../data/types'

export type TenantSortField = 'name' | 'unitNumber' | 'leaseEnd' | 'rentStatus'
export type SortDirection = 'asc' | 'desc'

export interface GetTenantsParams {
  search?: string
  rentStatus?: 'all' | RentStatus
  accountStatus?: 'all' | AccountStatus
  sortBy?: TenantSortField
  sortDir?: SortDirection
  page?: number
  pageSize?: number
}

export interface GetTenantsResult {
  data: Tenant[]
  total: number
  page: number
  pageSize: number
}



// Mirrors GET /tenants's own in-memory filter/sort/paginate logic — used only
// as a DEV-mode fallback (see getTenants()) when the backend isn't reachable.
/**
 * The only function that reads/searches/filters/sorts/paginates the tenants
 * collection — every other file gets tenants through this. Calls
 * `GET /tenants?search=&rentStatus=&accountStatus=&sortBy=&sortDir=&page=&pageSize=`;
 * falls back to the mock dataset in dev if the backend isn't reachable.
 */
export async function getTenants(params: GetTenantsParams = {}): Promise<GetTenantsResult> {
  const {
    search = '',
    rentStatus = 'all',
    accountStatus = 'all',
    sortBy = 'name',
    sortDir = 'asc',
    page = 1,
    pageSize = 20,
  } = params
  const query = new URLSearchParams()
  if (search) query.set('search', search)
  if (rentStatus !== 'all') query.set('rentStatus', rentStatus)
  if (accountStatus !== 'all') query.set('accountStatus', accountStatus)
  query.set('sortBy', sortBy)
  query.set('sortDir', sortDir)
  query.set('page', String(page))
  query.set('pageSize', String(pageSize))

  return await api.get(`/tenants?${query.toString()}`)
}

/** `GET /tenants/:tenantId`. */
export async function getTenant(tenantId: string): Promise<Tenant | undefined> {
  return await api.get(`/tenants/${tenantId}`)
}

export interface AddTenantInput {
  name: string
  email: string
  phone: string
  unitId: string
  unitNumber: string
  leaseStart: string
  leaseEnd: string
  monthlyRent: number
}

export interface AddTenantResult {
  tenant: Tenant
  tempPassword: string
}

/**
 * `POST /tenants` — creates the tenant, assigns the unit, and creates the
 * lease atomically server-side (see backend/src/app/api/tenants/route.ts);
 * this never needs a separate `updateUnit()` call afterward.
 */
export async function addTenant(input: AddTenantInput): Promise<AddTenantResult> {
  const result = await api.post<{ success: boolean; id: string; tempPassword: string }>('/tenants', input)
  return {
    tenant: {
      id: result.id,
      name: input.name,
      email: input.email,
      phone: input.phone,
      unitId: input.unitId,
      unitNumber: input.unitNumber,
      leaseStart: input.leaseStart,
      leaseEnd: input.leaseEnd,
      monthlyRent: input.monthlyRent,
      rentStatus: 'due',
      status: 'active',
      accountStatus: 'temporary',
      mustChangePassword: true,
    },
    tempPassword: result.tempPassword,
  }
}

// `rentStatus` is intentionally NOT part of this input — the backend derives
// it read-only from the tenant's real RentCharge state, and only a settled
// Payment (POST /payments) can ever change it. See
// backend/src/app/api/tenants/[id]/route.ts's PATCH handler.
export interface UpdateTenantInput {
  leaseEnd?: string
  monthlyRent?: number
  accountStatus?: AccountStatus
  mustChangePassword?: boolean
}

/** `PATCH /tenants/:tenantId`. */
export async function updateTenant(tenantId: string, updates: UpdateTenantInput): Promise<Tenant | undefined> {
  return await api.patch(`/tenants/${tenantId}`, updates)
}

export interface ResetPasswordResult {
  email: string
  tempPassword: string
}

/** `POST /tenants/:tenantId/reset-password` — the new temp password is server-generated. */
export async function resetTenantPassword(tenantId: string): Promise<ResetPasswordResult> {
  const result = await api.post<{ success: boolean; email: string; tempPassword: string }>(
      `/tenants/${tenantId}/reset-password`,
    )
  return { email: result.email, tempPassword: result.tempPassword }
}

const TEMP_PASSWORD_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789' // omits 0/O/1/l/I to avoid ambiguity

/** DEV-only fallback generator — the real backend always generates/hashes this server-side. */
export function generateTempPassword(length = 8): string {
  let password = ''
  for (let i = 0; i < length; i += 1) {
    password += TEMP_PASSWORD_CHARS[Math.floor(Math.random() * TEMP_PASSWORD_CHARS.length)]
  }
  return password
}

