import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  rateLimit,
  getClientIP,
  checkDailyAILimit,
  incrementDailyAIUsage,
  detectAbuse,
  RATE_LIMITS,
  clearMemoryRateLimits,
} from '@/lib/rate-limiter';
import { redis } from '@/lib/redis';

// Mock Redis client methods
vi.mock('@/lib/redis', () => {
  return {
    redis: {
      zremrangebyscore: vi.fn(),
      zcard: vi.fn(),
      zrange: vi.fn(),
      zadd: vi.fn(),
      expire: vi.fn(),
      get: vi.fn(),
      incr: vi.fn(),
    },
  };
});

describe('Rate Limiter Utilities', () => {
  beforeEach(() => {
    clearMemoryRateLimits();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T12:00:00Z'));
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  describe('rateLimit', () => {
    const config = { limit: 5, window: 60 };

    it('should allow request when within limit', async () => {
      (redis.zremrangebyscore as any).mockResolvedValue(0);
      (redis.zcard as any).mockResolvedValue(2); // 2 existing requests, limit is 5
      (redis.zadd as any).mockResolvedValue(1);
      (redis.expire as any).mockResolvedValue(1);
      (redis.zcard as any).mockResolvedValue(3); // 3 total now

      const result = await rateLimit('test-key', config);

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(2); // limit 5 - 3 = 2
      expect(result.limit).toBe(5);
      expect(redis.zadd).toHaveBeenCalled();
      expect(redis.expire).toHaveBeenCalledWith('test-key', 60);
    });

    it('should block request when limit exceeded', async () => {
      (redis.zremrangebyscore as any).mockResolvedValue(0);
      (redis.zcard as any).mockResolvedValue(5); // At limit
      // Mock zrange to return an oldest timestamp for reset calculation
      const oldestTime = Date.now() - 30000; // 30s ago
      (redis.zrange as any).mockResolvedValue([`${oldestTime}-random`, oldestTime.toString()]);

      const result = await rateLimit('test-key', config);

      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
      expect(result.limit).toBe(5);
      expect(result.reset).toBe(oldestTime + 60000); // oldest + window
      expect(redis.zadd).not.toHaveBeenCalled();
    });

    it('should calculate fallback reset time if zrange is empty when limit exceeded', async () => {
        (redis.zremrangebyscore as any).mockResolvedValue(0);
        (redis.zcard as any).mockResolvedValue(5);
        (redis.zrange as any).mockResolvedValue([]); // Empty array simulating missing oldest entry somehow

        const result = await rateLimit('test-key', config);

        expect(result.allowed).toBe(false);
        expect(result.reset).toBe(Date.now() + 60000); // now + window fallback
    });

    it('should degrade gracefully using in-memory rate limiting when Redis throws an error', async () => {
      (redis.zremrangebyscore as any).mockRejectedValue(new Error('Redis connection lost'));

      // Call it 5 times: should allow first 5 and then block the 6th
      for (let i = 0; i < 5; i++) {
        const result = await rateLimit('test-key-resilient', config);
        expect(result.allowed).toBe(true);
        expect(result.remaining).toBe(4 - i);
      }

      const blockedResult = await rateLimit('test-key-resilient', config);
      expect(blockedResult.allowed).toBe(false);
      expect(blockedResult.remaining).toBe(0);
    });
  });

  describe('getClientIP', () => {
    it('should return x-forwarded-for if present', () => {
      const req = new Request('http://localhost', {
        headers: {
          'x-forwarded-for': '203.0.113.195, 198.51.100.1',
        },
      });
      expect(getClientIP(req)).toBe('203.0.113.195');
    });

    it('should return x-real-ip if forwarded is missing', () => {
      const req = new Request('http://localhost', {
        headers: {
          'x-real-ip': '198.51.100.2',
        },
      });
      expect(getClientIP(req)).toBe('198.51.100.2');
    });

    it('should return unknown if neither header is present', () => {
      const req = new Request('http://localhost');
      expect(getClientIP(req)).toBe('unknown');
    });
  });

  describe('checkDailyAILimit', () => {
    it('should allow if current usage is below limit (FREE)', async () => {
      (redis.get as any).mockResolvedValue('10'); // Limit is DAILY_AI_FREE (50)
      const result = await checkDailyAILimit('user1', 'FREE');
      
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(RATE_LIMITS.DAILY_AI_FREE - 10);
      expect(redis.get).toHaveBeenCalledWith(`daily_ai:user1:2024-01-01`);
    });

    it('should block if current usage exceeds limit (PRO)', async () => {
      (redis.get as any).mockResolvedValue('500'); // At limit for PRO (500)
      const result = await checkDailyAILimit('user1', 'PRO');
      
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should degrade gracefully using in-memory limits when Redis throws error', async () => {
      (redis.get as any).mockRejectedValue(new Error('Redis error'));
      (redis.incr as any).mockRejectedValue(new Error('Redis error'));
      
      // Let's increment usage and verify limit is enforced in memory
      for (let i = 0; i < RATE_LIMITS.DAILY_AI_FREE; i++) {
        const result = await checkDailyAILimit('user-resilient', 'FREE');
        expect(result.allowed).toBe(true);
        expect(result.remaining).toBe(RATE_LIMITS.DAILY_AI_FREE - i);
        await incrementDailyAIUsage('user-resilient');
      }

      const blockedResult = await checkDailyAILimit('user-resilient', 'FREE');
      expect(blockedResult.allowed).toBe(false);
      expect(blockedResult.remaining).toBe(0);
    });
  });

  describe('incrementDailyAIUsage', () => {
    it('should increment usage and set expiry', async () => {
      (redis.incr as any).mockResolvedValue(1);
      (redis.expire as any).mockResolvedValue(1);
      
      await incrementDailyAIUsage('user1');
      
      expect(redis.incr).toHaveBeenCalledWith(`daily_ai:user1:2024-01-01`);
      expect(redis.expire).toHaveBeenCalledWith(`daily_ai:user1:2024-01-01`, 86400);
    });

    it('should handle redis errors gracefully', async () => {
      (redis.incr as any).mockRejectedValue(new Error('Redis err'));
      await expect(incrementDailyAIUsage('user1')).resolves.toBeUndefined(); // Should catch error
    });
  });

  describe('detectAbuse', () => {
    it('should block if too many requests in short time', async () => {
      // Return an array of 20 elements simulating rapid requests
      (redis.zrange as any).mockResolvedValue(new Array(20).fill('request'));
      
      const result = await detectAbuse('ip1', 'login');
      
      expect(result.blocked).toBe(true);
      expect(result.reason).toBe('Too many requests in short time');
    });

    it('should not block if normal usage', async () => {
      (redis.zrange as any).mockResolvedValue(['req1', 'req2']);
      (redis.zadd as any).mockResolvedValue(1);
      (redis.expire as any).mockResolvedValue(1);
      
      const result = await detectAbuse('ip1', 'login');
      
      expect(result.blocked).toBe(false);
      expect(redis.zadd).toHaveBeenCalled();
    });

    it('should handle redis errors gracefully and block if abuse threshold exceeded in memory', async () => {
      (redis.zrange as any).mockRejectedValue(new Error('Redis err'));
      
      // Request 20 times to trigger abuse blocking
      for (let i = 0; i < 20; i++) {
        const result = await detectAbuse('ip-resilient', 'login');
        expect(result.blocked).toBe(false);
      }

      const blockedResult = await detectAbuse('ip-resilient', 'login');
      expect(blockedResult.blocked).toBe(true);
      expect(blockedResult.reason).toBe('Too many requests in short time');
    });
  });
});
