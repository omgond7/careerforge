import { redis } from './redis';
import { logger } from './logger';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  reset: number;
  limit: number;
}

export interface RateLimitConfig {
  limit: number;
  window: number; // seconds
}

// In-memory fallback caches for Redis outages
const memoryRateLimitCache = new Map<string, number[]>();
const memoryDailyLimitCache = new Map<string, { count: number; expiresAt: number }>();
const memoryAbuseCache = new Map<string, number[]>();

/**
 * Utility function to clear the local in-memory fallback caches.
 * Extremely useful for isolated unit testing.
 */
export function clearMemoryRateLimits(): void {
  memoryRateLimitCache.clear();
  memoryDailyLimitCache.clear();
  memoryAbuseCache.clear();
}

// Memory rate limiter fallback
function rateLimitMemoryFallback(key: string, limit: number, window: number): RateLimitResult {
  const now = Date.now();
  const windowStart = now - window * 1000;
  
  let timestamps = memoryRateLimitCache.get(key) || [];
  // Prune expired timestamps
  timestamps = timestamps.filter(t => t > windowStart);
  
  if (timestamps.length >= limit) {
    const oldest = timestamps[0] || now;
    const reset = oldest + window * 1000;
    memoryRateLimitCache.set(key, timestamps);
    return {
      allowed: false,
      remaining: 0,
      reset,
      limit,
    };
  }
  
  timestamps.push(now);
  memoryRateLimitCache.set(key, timestamps);
  
  return {
    allowed: true,
    remaining: Math.max(0, limit - timestamps.length),
    reset: now + window * 1000,
    limit,
  };
}

// Memory daily AI limit fallback
function checkDailyAILimitMemoryFallback(userId: string, limit: number): { allowed: boolean; remaining: number; reset: number } {
  const today = new Date().toISOString().split('T')[0];
  const key = `daily_ai:${userId}:${today}`;
  const now = Date.now();
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const reset = tomorrow.getTime();
  
  let entry = memoryDailyLimitCache.get(key);
  if (!entry || now > entry.expiresAt) {
    entry = { count: 0, expiresAt: reset };
    memoryDailyLimitCache.set(key, entry);
  }
  
  if (entry.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      reset,
    };
  }
  
  return {
    allowed: true,
    remaining: limit - entry.count,
    reset,
  };
}

function incrementDailyAIUsageMemoryFallback(userId: string) {
  const today = new Date().toISOString().split('T')[0];
  const key = `daily_ai:${userId}:${today}`;
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const reset = tomorrow.getTime();
  
  let entry = memoryDailyLimitCache.get(key);
  if (!entry) {
    entry = { count: 0, expiresAt: reset };
  }
  entry.count += 1;
  memoryDailyLimitCache.set(key, entry);
}

// Memory abuse detection fallback
function detectAbuseMemoryFallback(identifier: string, action: string): { blocked: boolean; reason?: string } {
  const key = `abuse:${identifier}:${action}`;
  const now = Date.now();
  const windowStart = now - 3600 * 1000; // 1 hour window
  
  let timestamps = memoryAbuseCache.get(key) || [];
  timestamps = timestamps.filter(t => t > windowStart);
  
  if (timestamps.length >= 20) {
    memoryAbuseCache.set(key, timestamps);
    return {
      blocked: true,
      reason: 'Too many requests in short time',
    };
  }
  
  timestamps.push(now);
  memoryAbuseCache.set(key, timestamps);
  return { blocked: false };
}

// Rate limiter using Redis sliding window
export async function rateLimit(
  key: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const { limit, window } = config;
  const now = Date.now();
  const windowStart = now - window * 1000;

  try {
    // Remove old entries outside the window
    await redis.zremrangebyscore(key, 0, windowStart);

    // Count current requests
    const current = await redis.zcard(key);

    if (current >= limit) {
      // Get the oldest request time to calculate reset time
      const oldest = await redis.zrange(key, 0, 0, 'WITHSCORES');
      const reset = oldest.length > 1 ? parseInt(oldest[1]) + window * 1000 : now + window * 1000;
      
      return {
        allowed: false,
        remaining: 0,
        reset,
        limit,
      };
    }

    // Add current request
    await redis.zadd(key, now, `${now}-${Math.random()}`);
    
    // Set expiry on the key
    await redis.expire(key, window);

    // Get remaining
    const newCount = await redis.zcard(key);
    const remaining = Math.max(0, limit - newCount);

    return {
      allowed: true,
      remaining,
      reset: now + window * 1000,
      limit,
    };
  } catch (error) {
    logger.error('Redis sliding window rate limiting failure. Degrading gracefully to in-memory fallback.', {
      key,
      error: error instanceof Error ? error.message : String(error),
    });
    return rateLimitMemoryFallback(key, limit, window);
  }
}

// Pre-configured rate limits
export const RATE_LIMITS = {
  // Per-IP limits
  IP_GENERAL: { limit: 100, window: 60 }, // 100 requests per minute
  IP_AUTH: { limit: 5, window: 3600 }, // 5 requests per hour
  
  // Per-user limits
  USER_GENERAL: { limit: 50, window: 60 }, // 50 requests per minute
  USER_AI: { limit: 10, window: 60 }, // 10 AI requests per minute
  
  // Daily AI limits (will be checked separately)
  DAILY_AI_FREE: 50,
  DAILY_AI_PRO: 500,
} as const;

// Get client IP from request
export function getClientIP(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

// Check daily AI usage limit
export async function checkDailyAILimit(
  userId: string,
  subscriptionTier: 'FREE' | 'PRO' | 'TEAM' = 'FREE'
): Promise<{ allowed: boolean; remaining: number; reset: number }> {
  const limit = subscriptionTier === 'FREE' ? RATE_LIMITS.DAILY_AI_FREE : RATE_LIMITS.DAILY_AI_PRO;
  const today = new Date().toISOString().split('T')[0];
  const key = `daily_ai:${userId}:${today}`;
  
  try {
    const current = parseInt((await redis.get(key)) || '0', 10);
    
    if (current >= limit) {
      // Reset at midnight
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      return {
        allowed: false,
        remaining: 0,
        reset: tomorrow.getTime(),
      };
    }
    
    const remaining = limit - current;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    return {
      allowed: true,
      remaining,
      reset: tomorrow.getTime(),
    };
  } catch (error) {
    logger.error('Redis daily AI limit check failure. Degrading gracefully to in-memory fallback.', {
      userId,
      error: error instanceof Error ? error.message : String(error),
    });
    return checkDailyAILimitMemoryFallback(userId, limit);
  }
}

// Increment daily AI usage
export async function incrementDailyAIUsage(userId: string): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  const key = `daily_ai:${userId}:${today}`;
  
  try {
    await redis.incr(key);
    await redis.expire(key, 86400); // 24 hours
  } catch (error) {
    logger.error('Redis daily AI usage increment failure. Falling back to in-memory tracking.', {
      userId,
      error: error instanceof Error ? error.message : String(error),
    });
    incrementDailyAIUsageMemoryFallback(userId);
  }
}

// Abuse detection - check for suspicious patterns
export async function detectAbuse(
  identifier: string,
  action: string
): Promise<{ blocked: boolean; reason?: string }> {
  const key = `abuse:${identifier}:${action}`;
  
  try {
    // Check for rapid successive requests
    const recent = await redis.zrange(key, -10, -1, 'WITHSCORES');
    
    if (recent.length >= 20) {
      // Too many requests in short time
      return {
        blocked: true,
        reason: 'Too many requests in short time',
      };
    }
    
    // Add current request
    await redis.zadd(key, Date.now(), `${Date.now()}`);
    await redis.expire(key, 3600); // 1 hour
    
    return { blocked: false };
  } catch (error) {
    logger.error('Redis abuse detection failure. Degrading gracefully to in-memory fallback.', {
      identifier,
      action,
      error: error instanceof Error ? error.message : String(error),
    });
    return detectAbuseMemoryFallback(identifier, action);
  }
}
