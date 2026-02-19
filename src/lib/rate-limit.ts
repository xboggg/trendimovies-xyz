// Simple in-memory rate limiter
// For production, use Redis-based solution like Upstash

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  limit: number;      // Max requests
  windowMs: number;   // Time window in milliseconds
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
}

export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const key = identifier;

  let entry = rateLimitStore.get(key);

  // If no entry or window expired, create new entry
  if (!entry || entry.resetTime < now) {
    entry = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(key, entry);
    return {
      success: true,
      remaining: config.limit - 1,
      resetTime: entry.resetTime,
    };
  }

  // Increment count
  entry.count++;

  // Check if over limit
  if (entry.count > config.limit) {
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  return {
    success: true,
    remaining: config.limit - entry.count,
    resetTime: entry.resetTime,
  };
}

// Helper to get client IP
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  return "unknown";
}

// Pre-configured rate limiters
export const rateLimiters = {
  // Login: 5 attempts per 15 minutes
  login: (ip: string) => rateLimit(`login:${ip}`, { limit: 5, windowMs: 15 * 60 * 1000 }),

  // Register: 3 attempts per hour
  register: (ip: string) => rateLimit(`register:${ip}`, { limit: 3, windowMs: 60 * 60 * 1000 }),

  // API general: 100 requests per minute
  api: (ip: string) => rateLimit(`api:${ip}`, { limit: 100, windowMs: 60 * 1000 }),

  // News fetch: 10 per hour (expensive AI operation)
  newsFetch: (ip: string) => rateLimit(`news-fetch:${ip}`, { limit: 10, windowMs: 60 * 60 * 1000 }),

  // Comments: 10 per minute
  comments: (ip: string) => rateLimit(`comments:${ip}`, { limit: 10, windowMs: 60 * 1000 }),

  // Votes: 30 per minute
  votes: (ip: string) => rateLimit(`votes:${ip}`, { limit: 30, windowMs: 60 * 1000 }),
};
