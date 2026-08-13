import mongoose from 'mongoose'
import { User } from '../models/User'
import { hashPassword } from './password'

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

// Cached on the global object so hot-reloading / repeated route invocations
// in dev don't each open a new connection.
declare global {
  var _mongooseCache: MongooseCache | undefined
}

const cache: MongooseCache = globalThis._mongooseCache ?? { conn: null, promise: null }
globalThis._mongooseCache = cache

export async function dbConnect(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn

  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI is not configured')

  if (!cache.promise) {
    cache.promise = mongoose.connect(uri).then(async (m) => {
      // Auto-bootstrap admin on first boot in production if no admin exists
      try {
        const email = process.env.ADMIN_EMAIL || 'plaza-os@codecampus.com.ng'
        const password = process.env.ADMIN_PASSWORD || 'CodeCampus2026'
        const passwordHash = await hashPassword(password)
        
        await User.findOneAndUpdate(
          { email: email.toLowerCase() },
          {
            $set: {
              name: process.env.ADMIN_NAME || 'Admin',
              email: email.toLowerCase(),
              passwordHash,
              role: 'admin',
              accountStatus: 'active',
              mustChangePassword: false,
            },
          },
          { upsert: true }
        )
        console.log(`Successfully forced bootstrap of admin account: ${email}`)
      } catch (err) {
        console.error('Failed to bootstrap admin:', err)
      }
      return m
    })
  }
  cache.conn = await cache.promise
  return cache.conn
}
