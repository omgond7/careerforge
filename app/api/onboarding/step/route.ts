import { NextRequest } from 'next/server';
import { requireAuth, apiSuccess, apiError } from '@/lib/api-helpers';
import { db } from '@/lib/db';

export const PATCH = requireAuth(async (req, user) => {
  const body = await req.json().catch(() => ({}));
  const { step } = body;

  const validSteps = ['SELECT_ROLE', 'IMPORT_WIZARD', 'ASSESS_SKILLS', 'COMPLETE'];
  const stepUpper = step ? String(step).toUpperCase() : '';

  if (!validSteps.includes(stepUpper)) {
    return apiError(`Invalid step: must be one of ${validSteps.join(', ')}`, 400);
  }

  const updated = await db.user.update({
    where: { id: user.id },
    data: {
      onboardingStep: stepUpper as any,
      ...(stepUpper === 'COMPLETE' && { onboardingDone: true }),
    },
  });

  return apiSuccess({ step: updated.onboardingStep, done: updated.onboardingDone });
});
