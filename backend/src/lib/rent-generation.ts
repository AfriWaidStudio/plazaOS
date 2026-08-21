import { ClientSession } from 'mongoose'
import { RentCharge } from '@/models/RentCharge'
import { Lease } from '@/models/Lease'

/**
 * Calculates the next rent period and due date based on the lease details
 * and a given reference date (usually today).
 */
export function calculateNextRentPeriod(leaseStart: string, rentDueDay: number, referenceDate: Date = new Date()): { period: string; dueDate: string } {
  // If the lease starts in the future, the first period is the lease start month.
  // Otherwise, generate for the current or upcoming month.
  const start = new Date(leaseStart)
  const isFutureLease = start.getTime() > referenceDate.getTime()
  
  const targetDate = isFutureLease ? start : referenceDate
  
  let targetYear = targetDate.getUTCFullYear()
  let targetMonth = targetDate.getUTCMonth() + 1 // 1-12
  
  // Format period as YYYY-MM
  const period = `${targetYear}-${targetMonth.toString().padStart(2, '0')}`
  
  // Due date is YYYY-MM-DD using the lease's rentDueDay
  const dueDate = `${targetYear}-${targetMonth.toString().padStart(2, '0')}-${rentDueDay.toString().padStart(2, '0')}`
  
  return { period, dueDate }
}

/**
 * Sweeps all active leases and automatically creates a RentCharge for the
 * current/upcoming month if one doesn't exist yet.
 * Returns the number of charges created.
 */
export async function sweepUpcomingRentCharges(): Promise<{ created: number }> {
  let createdCount = 0
  
  // Find all active leases
  const activeLeases = await Lease.find({ status: 'active' })
  
  for (const lease of activeLeases) {
    const { period, dueDate } = calculateNextRentPeriod(lease.startDate, lease.rentDueDay)
    
    // Ensure we don't generate rent past the lease end date
    if (lease.endDate && dueDate > lease.endDate) {
      continue
    }

    try {
      // Create if it doesn't exist for this specific tenant + period (handled by unique index)
      const existing = await RentCharge.findOne({ tenantId: lease.tenantId, period })
      if (!existing) {
        await RentCharge.create([{
          tenantId: lease.tenantId,
          unitId: lease.unitId,
          leaseId: lease._id,
          period,
          amount: lease.rentAmount,
          dueDate,
          // Set to due immediately if dueDate is today or past, otherwise upcoming
          status: new Date(dueDate) <= new Date() ? 'due' : 'upcoming'
        }])
        createdCount++
      }
    } catch (err) {
      // If unique constraint fires concurrently, ignore
      console.error(`Failed to generate rent charge for lease ${lease._id}:`, err)
    }
  }
  
  return { created: createdCount }
}
