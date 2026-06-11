import { NextRequest } from 'next/server';
import { requireAuth, apiSuccess, apiError } from '@/lib/api-helpers';
import { db } from '@/lib/db';

export const POST = requireAuth(async (req, user) => {
  const body = await req.json().catch(() => ({}));
  const { targetRole, experienceLevel } = body;
  
  if (!targetRole) return apiError('targetRole is required', 400);

  // Safely parse experience level into integer for database years compliance
  const expYears = experienceLevel ? parseInt(String(experienceLevel), 10) : null;
  const cleanExpYears = isNaN(expYears as number) ? null : expYears;

  await db.userProfile.upsert({
    where: { userId: user.id },
    create: { 
      userId: user.id, 
      targetRole, 
      experienceYears: cleanExpYears 
    },
    update: { 
      targetRole, 
      experienceYears: cleanExpYears 
    },
  });

  await db.user.update({ 
    where: { id: user.id }, 
    data: { onboardingStep: 'IMPORT_WIZARD' } 
  });

  return apiSuccess({ next: 'import-wizard' });
});
