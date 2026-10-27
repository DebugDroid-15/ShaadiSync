/**
 * Rate Limiting & Abuse Prevention Engine
 * In-memory sliding window rate limiter designed for public endpoints:
 * - /invite/[token] RSVP submissions
 * - Check-in scanner gate endpoints
 * - Auth sign-in / registration brute force protection
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup stale entries every 5 minutes to prevent memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      record.timestamps = record.timestamps.filter((t) => now - t < 60000);
      if (record.timestamps.length === 0) {
        rateLimitStore.delete(key);
      }
    }
  }, 300000);
}

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export interface RateLimitResult {
  isAllowed: boolean;
  remaining: number;
  resetMs: number;
}

/**
 * Check if a client/token identifier is within rate limits.
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = { maxRequests: 20, windowMs: 60000 }
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - config.windowMs;

  let record = rateLimitStore.get(identifier);
  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(identifier, record);
  }

  // Remove timestamps outside the sliding window
  record.timestamps = record.timestamps.filter((t) => t > windowStart);

  if (record.timestamps.length >= config.maxRequests) {
    const oldest = record.timestamps[0];
    const resetMs = Math.max(0, oldest + config.windowMs - now);
    return {
      isAllowed: false,
      remaining: 0,
      resetMs,
    };
  }

  record.timestamps.push(now);
  return {
    isAllowed: true,
    remaining: config.maxRequests - record.timestamps.length,
    resetMs: config.windowMs,
  };
}

/**
 * Reset rate limit for a specific identifier (e.g. for testing or verified recaptcha).
 */
export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
}

