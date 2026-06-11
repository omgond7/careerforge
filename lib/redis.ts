import { Redis } from 'ioredis';

const globalForRedis = globalThis as unknown as { redis: Redis | undefined };

const redisUrl = process.env.REDIS_URL;

export const redis =
  globalForRedis.redis ??
  (() => {
    if (!redisUrl) {
      console.warn('⚠️ REDIS_URL is not set. Falling back to localhost Redis or mock client.');
    }
    try {
      return new Redis(redisUrl || 'redis://localhost:6379', {
        maxRetriesPerRequest: 3,
        lazyConnect: true,
      });
    } catch (err) {
      console.error('⚠️ Failed to initialize Redis client. Using mock Redis.', err);
      // Fallback dummy redis client to avoid crashing the app
      return {
        get: async () => null,
        set: async () => 'OK',
        del: async () => 0,
        incr: async () => 1,
        expire: async () => true,
        defineCommand: () => {},
        status: 'ready',
        on: () => {},
        off: () => {},
        once: () => {},
        quit: async () => 'OK',
        disconnect: () => {},
      } as any;
    }
  })();

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;
