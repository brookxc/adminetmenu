import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

// Improved caching mechanism with connection timeout
const cached = global.mongoose || { conn: null, promise: null }
global.mongoose = cached

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      connectTimeoutMS: 10000, // 10 seconds
      serverSelectionTimeoutMS: 10000, // 10 seconds
    }

    cached.promise = mongoose.connect(MONGODB_URI!, opts)
  }

  try {
    cached.conn = await cached.promise
    return cached.conn
  } catch (e) {
    cached.promise = null
    throw e
  }
}
