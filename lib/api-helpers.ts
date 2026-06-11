import { auth } from '@/auth';
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { ZodSchema } from 'zod';

export async function getAuthUser() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return session.user;
}

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ success: false, error: message, details }, { status });
}

// Wrap handlers to automatically check authentication, forwarding any route context params as a 3rd parameter.
export function requireAuth(
  handler: (req: NextRequest, user: { id: string }, context?: any) => Promise<NextResponse>
) {
  return async (req: NextRequest, context?: any) => {
    const user = await getAuthUser();
    if (!user) return apiError('Unauthorized', 401);
    if (!(user as any).emailVerified) return apiError('Email verification required', 403);
    return handler(req, user as { id: string }, context);
  };
}

export async function parseBody<T>(
  req: NextRequest, 
  schema: ZodSchema<T>
): Promise<{ data: T; error: null } | { data: null; error: NextResponse }> {
  try {
    const body = await req.json();
    const result = schema.safeParse(body);
    if (!result.success) {
      return { data: null, error: apiError('Validation failed', 422, result.error.flatten()) };
    }
    return { data: result.data, error: null };
  } catch {
    return { data: null, error: apiError('Invalid JSON body', 400) };
  }
}

// Rate limiter — uses Redis sliding window (imported from rate-limiter.ts)
export { rateLimit, getClientIP, checkDailyAILimit, incrementDailyAIUsage, detectAbuse, RATE_LIMITS } from './rate-limiter';

// Log AI usage
export async function logUsage(userId: string, feature: string, tokens?: number, model?: string) {
  await db.apiUsage.create({ data: { userId, feature, tokens, model } }).catch(() => {});
}
