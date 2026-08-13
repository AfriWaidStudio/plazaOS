import { api } from '../../../lib/api'
import type { Reminder, ReminderStatus, ReminderTarget, ReminderType } from '../data/types'

export type ReminderSortField = 'scheduledFor' | 'title' | 'status'
export type SortDirection = 'asc' | 'desc'

export interface GetRemindersParams {
  search?: string
  status?: 'all' | ReminderStatus
  type?: 'all' | ReminderType
  sortBy?: ReminderSortField
  sortDir?: SortDirection
  page?: number
  pageSize?: number
}

export interface GetRemindersResult {
  data: Reminder[]
  total: number
  page: number
  pageSize: number
}





// Mirrors GET /reminders's own in-memory filter/sort/paginate logic — used
// only as a DEV-mode fallback (see getReminders()) when the backend isn't
// reachable.
/**
 * The only function that reads/searches/filters/sorts/paginates the
 * reminders collection — every other file gets reminders through this.
 * Calls `GET /reminders?search=&status=&type=&sortBy=&sortDir=&page=&pageSize=`;
 * falls back to the mock dataset in dev if the backend isn't reachable.
 */
export async function getReminders(params: GetRemindersParams = {}): Promise<GetRemindersResult> {
  const { search = '', status = 'all', type = 'all', sortBy = 'scheduledFor', sortDir = 'asc', page = 1, pageSize = 20 } = params
  const query = new URLSearchParams()
  if (search) query.set('search', search)
  if (status !== 'all') query.set('status', status)
  if (type !== 'all') query.set('type', type)
  query.set('sortBy', sortBy)
  query.set('sortDir', sortDir)
  query.set('page', String(page))
  query.set('pageSize', String(pageSize))

  return await api.get(`/reminders?${query.toString()}`)
}

/** `GET /reminders/:reminderId`. */
export async function getReminder(reminderId: string): Promise<Reminder | undefined> {
  return await api.get(`/reminders/${reminderId}`)
}

export interface AddReminderInput {
  title: string
  message: string
  scheduledFor: string
  target: ReminderTarget
  tenantId?: string
  groupTenantIds?: string[]
}

/** `POST /reminders` — always creates a `type: 'manual'` reminder server-side. */
export async function addReminder(input: AddReminderInput): Promise<Reminder> {
  const result = await api.post<{ success: boolean; id: string; targetLabel: string }>('/reminders', input)
    return {
      id: result.id,
      title: input.title,
      message: input.message,
      scheduledFor: input.scheduledFor,
      type: 'manual',
      target: input.target,
      status: 'scheduled',
      targetLabel: result.targetLabel,
    }`,
      title: input.title,
      message: input.message,
      scheduledFor: input.scheduledFor,
      type: 'manual',
      target: input.target,
      status: 'scheduled',
      targetLabel:
        input.target === 'everyone' ? 'All tenants' : input.target === 'group' ? `${input.groupTenantIds?.length ?? 0} tenants` : 'Tenant',
    }
    mockReminders.push(newReminder)
    return newReminder
  }
}

