import mongoose from "mongoose";

/** Cached connection — reused across hot-reloads in Next.js dev & serverless */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global._mongooseCache ?? { conn: null, promise: null };
global._mongooseCache = cached;

export async function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes("<YOUR-CLUSTER>")) {
    throw new Error(
      "MONGODB_URI is not configured.\n" +
      "Open .env.local and replace <YOUR-CLUSTER> with your Atlas cluster host.\n" +
      "Format: mongodb+srv://website:nivoseasdbforadmin@cluster0.xxxxx.mongodb.net/nivoseas?retryWrites=true&w=majority"
    );
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}
