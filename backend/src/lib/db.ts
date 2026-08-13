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
        const adminCount = await User.countDocuments({ role: 'admin' })
        if (adminCount === 0 && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
          const passwordHash = await hashPassword(process.env.ADMIN_PASSWORD)
          await User.create({
            name: process.env.ADMIN_NAME || 'Admin',
            email: process.env.ADMIN_EMAIL.toLowerCase(),
            passwordHash,
            role: 'admin',
            accountStatus: 'active',
            mustChangePassword: false,
          })
          console.log('Successfully bootstrapped default admin account.')
        }
      } catch (err) {
        console.error('Failed to bootstrap admin:', err)
      }
      return m
    })
  }
  cache.conn = await cache.promise
  return cache.conn
}
