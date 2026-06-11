import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { apiSuccess, apiError, parseBody, rateLimit, RATE_LIMITS, getClientIP } from '@/lib/api-helpers';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { sendVerificationEmail } from '@/lib/email';

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export async function POST(req: NextRequest) {
  const ip = getClientIP(req);
  const { allowed } = await rateLimit(`register:${ip}`, RATE_LIMITS.IP_AUTH);
  if (!allowed) {
    return apiError('Too many registration attempts. Please try again in an hour.', 429);
  }

  const parsed = await parseBody(req, schema);
  if (parsed.error) return parsed.error;

  const { name, email, password } = parsed.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return apiError('Email already registered', 409);

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await db.user.create({
    data: {
      name,
      email,
      passwordHash,
      profile: { create: {} },
      notificationPrefs: { create: {} },
      securitySettings: { create: {} },
    },
  });

  // Centralized audit logging
  const { logAuditRequest } = await import('@/lib/audit-logger');
  await logAuditRequest(req, {
    userId: user.id,
    action: 'REGISTRATION',
    entityType: 'USER',
    entityId: user.id,
    metadata: { email: user.email, name: user.name },
  });

  // Create email verification token
  const token = randomUUID();
  await db.emailVerification.create({
    data: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  // Send verification email via nodemailer
  try {
    await sendVerificationEmail(user.email, token);
  } catch (err) {
    console.error('Failed to send verification email:', err);
  }

  return apiSuccess({ message: 'Account created. Check your email to verify.' }, 201);
}
