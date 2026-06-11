import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Redis utility', () => {
  beforeEach(() => {
    vi.resetModules();
    delete process.env.REDIS_URL;
    // Clear the global reference so it re-initializes
    (globalThis as any).redis = undefined;
  });

  it('should fallback to mock client if ioredis constructor throws', async () => {
    // Mock ioredis to throw an error
    vi.doMock('ioredis', () => {
      return {
        Redis: class {
          constructor() {
            throw new Error('Redis connection failed');
          }
        }
      };
    });

    // Suppress console.error and console.warn for the test output
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Import redis dynamically so it uses the mocked ioredis
    const mod = await import('@/lib/redis');
    const redis = mod.redis;

    expect(warnSpy).toHaveBeenCalledWith('⚠️ REDIS_URL is not set. Falling back to localhost Redis or mock client.');
    expect(errSpy).toHaveBeenCalled();
    
    // Test the mock client methods to ensure high coverage of the fallback block
    expect(await redis.get('key')).toBeNull();
    expect(await redis.set('key', 'val')).toBe('OK');
    expect(await redis.del('key')).toBe(0);
    expect(await redis.incr('key')).toBe(1);
    expect(await redis.expire('key', 10)).toBe(true);
    expect(await redis.quit()).toBe('OK');
    
    // These should not throw
    redis.defineCommand('cmd', { lua: '' });
    expect(redis.status).toBe('ready');
    redis.on('error', () => {});
    redis.off('error', () => {});
    redis.once('ready', () => {});
    redis.disconnect();

    warnSpy.mockRestore();
    errSpy.mockRestore();
  });
});
