import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import { Unit } from '@/models/Unit'
import { User } from '@/models/User'
import { MaintenanceRequest } from '@/models/MaintenanceRequest'
import { Payment } from '@/models/Payment'
import { CalendarEvent } from '@/models/CalendarEvent'
import { RentCharge } from '@/models/RentCharge'
import { Lease } from '@/models/Lease'
import { Reminder } from '@/models/Reminder'
import { withErrorHandling, requireRole, OPTIONS as corsOptions } from '@/lib/route-handler'

export { corsOptions as OPTIONS }

export const GET = withErrorHandling(async (request: NextRequest) => {
  requireRole(request, 'admin')

  await dbConnect()

  // Execute all aggregations in parallel
  const [
    units,
    tenants,
    openMaintenanceCount,
    recentPaymentsRaw,
    events,
    charges,
    leases,
    reminders
  ] = await Promise.all([
    Unit.find({}, { status: 1 }),
    User.find({ role: 'tenant' }, { status: 1 }),
    MaintenanceRequest.countDocuments({ status: 'open' }),
    Payment.find({})
      .sort({ date: -1 })
      .limit(4)
      .lean(),
    CalendarEvent.find({}).lean(),
    RentCharge.find({ status: { $ne: 'paid' } }).lean(),
    Lease.find({ status: 'active' }).lean(),
    Reminder.find({ status: 'scheduled' }).lean(),
  ])

  // Derive unit stats
  const totalUnits = units.length
  const occupiedUnits = units.filter((u) => u.status === 'occupied').length
  const vacantUnits = units.filter((u) => u.status === 'vacant').length

  // Derive tenant stats
  const activeTenants = tenants.filter((t) => t.status === 'active').length
  // Find overdue tenants based on charges
  const overdueTenantIds = new Set(charges.filter(c => c.status === 'overdue').map(c => c.tenantId.toString()))
  const overdueTenants = overdueTenantIds.size

  // We need to fetch tenant/unit names for recent payments and calendar events
  const allUnitIds = new Set([
    ...recentPaymentsRaw.map(p => p.unitId?.toString()),
    ...charges.map(c => c.unitId?.toString()),
    ...leases.map(l => l.unitId?.toString())
  ].filter(Boolean))

  const allTenantIds = new Set([
    ...recentPaymentsRaw.map(p => p.tenantId?.toString()),
    ...charges.map(c => c.tenantId?.toString()),
    ...leases.map(l => l.tenantId?.toString())
  ].filter(Boolean))

  const [populatedUnits, populatedTenants] = await Promise.all([
    Unit.find({ _id: { $in: Array.from(allUnitIds) } }, { unitNumber: 1 }).lean(),
    User.find({ _id: { $in: Array.from(allTenantIds) } }, { name: 1 }).lean()
  ])

  const unitMap = new Map(populatedUnits.map(u => [u._id.toString(), u.unitNumber]))
  const tenantMap = new Map(populatedTenants.map(t => [t._id.toString(), t.name]))

  // Map recent payments
  const recentPayments = recentPaymentsRaw.map(payment => ({
    id: payment._id.toString(),
    tenantName: tenantMap.get(payment.tenantId?.toString()) || 'Unknown Tenant',
    unitNumber: payment.unitNumber || unitMap.get(payment.unitId?.toString()) || 'Unknown Unit',
    amount: payment.amount,
    method: payment.method,
    status: payment.status,
    date: payment.date,
  }))

  // Assemble upcoming calendar events (same logic as GET /calendar)
  let items = [
    ...events.map((doc) => ({
      id: doc._id.toString(),
      title: doc.title,
      type: doc.type,
      date: doc.date,
      relatedLabel: doc.relatedLabel,
    })),
    ...charges.map((doc) => {
      const tenantName = tenantMap.get(doc.tenantId.toString())
      return {
        id: `rent-charge:${doc._id}`,
        title: tenantName ? `Rent due — ${tenantName}` : 'Rent due',
        type: 'rent_due',
        date: doc.dueDate,
        relatedLabel: unitMap.get(doc.unitId.toString()),
      }
    }),
    ...leases.map((doc) => {
      const tenantName = tenantMap.get(doc.tenantId.toString())
      return {
        id: `lease:${doc._id}`,
        title: tenantName ? `${tenantName} lease renewal` : 'Lease renewal',
        type: 'lease_renewal',
        date: doc.endDate,
        relatedLabel: unitMap.get(doc.unitId.toString()),
      }
    }),
    ...reminders.map((doc) => ({
      id: `reminder:${doc._id}`,
      title: doc.title,
      type: 'reminder',
      date: doc.scheduledFor,
      relatedLabel: doc.targetLabel,
    })),
  ]

  // Sort and take top 4 upcoming
  items.sort((a, b) => a.date.localeCompare(b.date))
  const upcomingEvents = items.slice(0, 4)

  return NextResponse.json({
    totalUnits,
    occupiedUnits,
    vacantUnits,
    activeTenants,
    overdueTenants,
    openMaintenanceCount,
    recentPayments,
    upcomingEvents
  })
})
