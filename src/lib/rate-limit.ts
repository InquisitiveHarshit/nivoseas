import { NextResponse } from "next/server";

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory token bucket / sliding window cache per IP
const ipCache = new Map<string, RateLimitRecord>();

// Clean up stale entries every 5 minutes to prevent memory leak
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of ipCache.entries()) {
      if (now > record.resetTime) {
        ipCache.delete(ip);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
  limit?: number; // Maximum requests allowed in window (default: 60)
  windowMs?: number; // Window size in milliseconds (default: 60000 = 1 minute)
}

/**
 * Apply rate limiting to an incoming Next.js Request.
 * Returns null if allowed, or a 429 NextResponse if limit is exceeded.
 */
export function checkRateLimit(
  request: Request,
  options: RateLimitOptions = {}
): { response: NextResponse | null; remaining: number; resetTime: number } {
  const limit = options.limit ?? 60;
  const windowMs = options.windowMs ?? 60 * 1000;

  // Extract client IP address from standard headers
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = (forwardedFor ? forwardedFor.split(",")[0].trim() : realIp) || "127.0.0.1";

  const now = Date.now();
  const record = ipCache.get(ip);

  if (!record || now > record.resetTime) {
    // New window
    ipCache.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      response: null,
      remaining: limit - 1,
      resetTime: Math.ceil((now + windowMs) / 1000),
    };
  }

  // Inside existing window
  if (record.count >= limit) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    const response = NextResponse.json(
      {
        success: false,
        error: "Too many requests. Please slow down and try again.",
        retryAfterSeconds: retryAfter,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(record.resetTime / 1000)),
        },
      }
    );
    return { response, remaining: 0, resetTime: Math.ceil(record.resetTime / 1000) };
  }

  record.count += 1;
  return {
    response: null,
    remaining: limit - record.count,
    resetTime: Math.ceil(record.resetTime / 1000),
  };
}

