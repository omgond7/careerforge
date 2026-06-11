import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateSHA256Hash, getJobAnalysisCacheKey, safeGetCache, safeSetCache } from '@/lib/cache-utils';
import { redis } from '@/lib/redis';

// Mock Redis client
vi.mock('@/lib/redis', () => {
  return {
    redis: {
      get: vi.fn(),
      setex: vi.fn(),
    },
  };
});

describe('Cache Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateSHA256Hash', () => {
    it('should generate valid SHA-256 hex hash from string', () => {
      const hash = generateSHA256Hash('  some   sample text ');
      // Should normalize string to: 'some sample text'
      const expectedHash = '1333090b9ac0bfeb0506dc24ef26cbc8bade664401cca9df682b8d8060f4d5c1';
      expect(hash).toBe(expectedHash);
    });
  });

  describe('getJobAnalysisCacheKey', () => {
    it('should format clean key namespace with user id and hashed description', () => {
      const key = getJobAnalysisCacheKey('user_123', 'job desc');
      expect(key).toContain('job_analysis:user_123:');
      expect(key.length).toBe(13 + 8 + 1 + 64); // job_analysis: + user_123 + : + 64 hex characters
    });
  });

  describe('safeGetCache', () => {
    it('should return value from Redis if read is successful', async () => {
      (redis.get as any).mockResolvedValue('cached_data');
      const val = await safeGetCache('key1');
      expect(val).toBe('cached_data');
      expect(redis.get).toHaveBeenCalledWith('key1');
    });

    it('should catch Redis errors, log them, and return null instead of throwing', async () => {
      (redis.get as any).mockRejectedValue(new Error('Redis connection lost'));
      const val = await safeGetCache('key1');
      expect(val).toBeNull();
    });
  });

  describe('safeSetCache', () => {
    it('should set value with TTL in Redis successfully', async () => {
      (redis.setex as any).mockResolvedValue('OK');
      const success = await safeSetCache('key1', 'value1', 500);
      expect(success).toBe(true);
      expect(redis.setex).toHaveBeenCalledWith('key1', 500, 'value1');
    });

    it('should cap TTL at maximum 7 days', async () => {
      (redis.setex as any).mockResolvedValue('OK');
      const success = await safeSetCache('key1', 'value1', 9999999);
      expect(success).toBe(true);
      expect(redis.setex).toHaveBeenCalledWith('key1', 86400 * 7, 'value1');
    });

    it('should catch Redis set errors, log them, and return false instead of throwing', async () => {
      (redis.setex as any).mockRejectedValue(new Error('Redis set failed'));
      const success = await safeSetCache('key1', 'value1');
      expect(success).toBe(false);
    });
  });
});
