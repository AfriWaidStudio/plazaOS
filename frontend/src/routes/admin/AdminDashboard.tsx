import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, StatusBadge, Text } from '../../components'
import { PageHeader } from './components/PageHeader'
import { api } from '../../lib/api'
import type { CalendarEvent, Payment, PaymentStatus } from './data/types'

interface DashboardStats {
  totalUnits: number
  occupiedUnits: number
  vacantUnits: number
  activeTenants: number
  overdueTenants: number
  openMaintenanceCount: number
  recentPayments: Payment[]
  upcomingEvents: CalendarEvent[]
}

const paymentStatusLabel: Record<PaymentStatus, string> = {
  paid: 'Paid',
  pending: 'Pending',
  failed: 'Failed',
}

const paymentStatusVariant: Record<PaymentStatus, 'success' | 'warning' | 'danger'> = {
  paid: 'success',
  pending: 'warning',
  failed: 'danger',
}

// Summary stats are computed client-side from the existing list endpoints
// (each fetched with a large pageSize, per §4's small-dataset allowance)
// rather than a dedicated summary endpoint.
export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)
    api.get<DashboardStats>('/admin/dashboard-stats')
      .then((data) => {
        if (!cancelled) setStats(data)
      })
    .catch((err: unknown) => {
      if (!cancelled) {
        console.error('Dashboard data fetch failed:', err)
        setError('Failed to load dashboard data.')
      }
    })
    .finally(() => {
      if (!cancelled) {
        setIsLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (isLoading || !stats) {
    return (
      <div>
        <PageHeader title="Dashboard" description="Plaza overview at a glance." />
        <Card className="mt-4">
          <Text variant="body">Loading dashboard data...</Text>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <PageHeader title="Dashboard" description="Plaza overview at a glance." />
        <Card className="mt-4">
          <Text variant="body" className="text-danger">{error}</Text>
        </Card>
      </div>
    )
  }

  return (

    <div>
      <PageHeader title="Dashboard" description="Plaza overview at a glance." />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <Text variant="caption" className="text-slate-500">
            Units
          </Text>
          <Text variant="display" className="mt-1 text-slate-900">
            {stats.totalUnits}
          </Text>
          <Text variant="bodySmall" className="mt-1 text-slate-500">
            {stats.occupiedUnits} occupied · {stats.vacantUnits} vacant
          </Text>
        </Card>
        <Card>
          <Text variant="caption" className="text-slate-500">
            Active tenants
          </Text>
          <Text variant="display" className="mt-1 text-slate-900">
            {stats.activeTenants}
          </Text>
          <Text variant="bodySmall" className="mt-1 text-slate-500">
            total
          </Text>
        </Card>
        <Card>
          <Text variant="caption" className="text-slate-500">
            Rent overdue
          </Text>
          <Text variant="display" className="mt-1 text-danger">
            {stats.overdueTenants}
          </Text>
          <Text variant="bodySmall" className="mt-1 text-slate-500">
            tenant{stats.overdueTenants === 1 ? '' : 's'} behind on rent
          </Text>
        </Card>
        <Card>
          <Text variant="caption" className="text-slate-500">
            Open tickets
          </Text>
          <Text variant="display" className="mt-1 text-slate-900">
            {stats.openMaintenanceCount}
          </Text>
          <Text variant="bodySmall" className="mt-1 text-slate-500">
            ticket{stats.openMaintenanceCount === 1 ? '' : 's'} awaiting action
          </Text>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <Text variant="h3">Recent payments</Text>
            <Link to="/admin/payments" className="text-[13px] font-medium text-primary hover:text-primary-light">
              View all
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {stats.recentPayments.map((payment) => (
              <Link
                key={payment.id}
                to={`/admin/payments/${payment.id}`}
                className="flex items-center justify-between rounded-button px-2 py-2 hover:bg-slate-200/40"
              >
                <div>
                  <Text variant="body" className="text-slate-900">
                    {payment.tenantName}
                  </Text>
                  <Text variant="caption" className="text-slate-500">
                    {payment.unitNumber} · {payment.date}
                  </Text>
                </div>
                <StatusBadge variant={paymentStatusVariant[payment.status]} label={paymentStatusLabel[payment.status]} />
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <Text variant="h3">Upcoming calendar</Text>
            <Link to="/admin/calendar" className="text-[13px] font-medium text-primary hover:text-primary-light">
              View calendar
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {stats.upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between px-2 py-2">
                <div>
                  <Text variant="body" className="text-slate-900">
                    {event.title}
                  </Text>
                  {event.relatedLabel ? (
                    <Text variant="caption" className="text-slate-500">
                      {event.relatedLabel}
                    </Text>
                  ) : null}
                </div>
                <Text variant="bodySmall" className="text-slate-500">
                  {event.date}
                </Text>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
