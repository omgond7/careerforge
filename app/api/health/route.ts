import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { redis } from '@/lib/redis';

export async function GET() {
  const start = Date.now();
  const checks: Record<string, 'ok' | 'error'> = {};

  try {
    await db.$queryRaw`SELECT 1`;
    checks.database = 'ok';
  } catch {
    checks.database = 'error';
  }

  try {
    await redis.ping();
    checks.redis = 'ok';
  } catch {
    checks.redis = 'error';
  }

  const healthy = Object.values(checks).every(v => v === 'ok');

  return NextResponse.json(
    { status: healthy ? 'healthy' : 'degraded', checks, responseTime: `${Date.now() - start}ms`, timestamp: new Date().toISOString() },
    { status: healthy ? 200 : 503 }
  );
}
