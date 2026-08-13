import 'dotenv/config'
import mongoose from 'mongoose'
import { dbConnect } from '../src/lib/db'
import { processReminders } from '../src/lib/process-reminders'
import { createAutomaticRentReminders } from '../src/lib/auto-rent-reminders'

async function runCron() {
  console.log('Starting scheduled cron job...')
  try {
    await dbConnect()
    
    // Auto-create reminders for newly due/overdue rent charges
    const { created } = await createAutomaticRentReminders()
    console.log(`Auto-created ${created} new rent reminders.`)
    
    // Process all scheduled reminders (send notifications and emails)
    const result = await processReminders()
    console.log(`Cron job completed. Sent: ${result.sent}, Failed: ${result.failed}`)
  } catch (error) {
    console.error('Error during cron job execution:', error)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
  }
}

runCron()
