import { createHash } from 'crypto';
import { redis } from './redis';
import { logger } from './logger';

/**
 * Generates a SHA-256 hash of a clean, normalized version of the input text.
 */
export function generateSHA256Hash(text: string): string {
  const normalized = text.trim().replace(/\s+/g, ' ');
  return createHash('sha256').update(normalized).digest('hex');
}

/**
 * Generates a cache key for job analysis.
 */
export function getJobAnalysisCacheKey(userId: string, jobDescription: string): string {
  const hash = generateSHA256Hash(jobDescription);
  return `job_analysis:${userId}:${hash}`;
}

/**
 * Safely get a cached value from Redis. If Redis fails, it logs the failure and returns null.
 */
export async function safeGetCache(key: string): Promise<string | null> {
  try {
    return await redis.get(key);
  } catch (error) {
    logger.error('Redis cache read failed (safeGetCache)', { 
      key, 
      error: error instanceof Error ? error.message : String(error) 
    });
    return null;
  }
}

/**
 * Safely set a cache value in Redis with a TTL.
 * Prevents unbounded key growth by enforcing a mandatory TTL (default 3600 seconds / 1 hour).
 */
export async function safeSetCache(key: string, value: string, ttlSeconds = 3600): Promise<boolean> {
  try {
    // Enforce a sensible max TTL to prevent keys from living forever in case of mistakes
    const finalTtl = Math.min(ttlSeconds, 86400 * 7); // Max TTL 7 days
    await redis.setex(key, finalTtl, value);
    return true;
  } catch (error) {
    logger.error('Redis cache write failed (safeSetCache)', { 
      key, 
      error: error instanceof Error ? error.message : String(error) 
    });
    return false;
  }
}
