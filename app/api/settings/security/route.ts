import { NextRequest } from 'next/server';
import { requireAuth, apiSuccess, apiError, parseBody } from '@/lib/api-helpers';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

export const GET = requireAuth(async (req, user) => {
  const settings = await db.securitySettings.upsert({
    where: { userId: user.id },
    create: { userId: user.id },
    update: {},
  });
  return apiSuccess({ 
    twoFactorEnabled: settings.twoFactorEnabled, 
    loginNotifications: settings.loginNotifications 
  });
});

const securitySchema = z.object({
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8, 'New password must be at least 8 characters long').max(100).optional(),
  twoFactorEnabled: z.boolean().optional(),
  loginNotifications: z.boolean().optional(),
});

export const PATCH = requireAuth(async (req, user) => {
  const parsed = await parseBody(req, securitySchema);
  if (parsed.error) return parsed.error;

  const { currentPassword, newPassword, twoFactorEnabled, loginNotifications } = parsed.data;

  if (newPassword) {
    if (!currentPassword) return apiError('Current password is required to set a new password', 400);
    const dbUser = await db.user.findUnique({ where: { id: user.id } });
    if (!dbUser?.passwordHash) return apiError('No password set', 400);
    const valid = await bcrypt.compare(currentPassword, dbUser.passwordHash);
    if (!valid) return apiError('Current password incorrect', 400);
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await db.user.update({ where: { id: user.id }, data: { passwordHash } });
  }

  const settings = await db.securitySettings.upsert({
    where: { userId: user.id },
    create: { 
      userId: user.id, 
      twoFactorEnabled: twoFactorEnabled ?? false, 
      loginNotifications: loginNotifications ?? true 
    },
    update: { 
      ...(twoFactorEnabled !== undefined && { twoFactorEnabled }), 
      ...(loginNotifications !== undefined && { loginNotifications }) 
    },
  });

  return apiSuccess({
    twoFactorEnabled: settings.twoFactorEnabled,
    loginNotifications: settings.loginNotifications,
  });
});
