import { NextRequest } from 'next/server';
import { getAuthUser, apiSuccess, apiError } from '@/lib/api-helpers';
import { db } from '@/lib/db';
import { encrypt } from '@/lib/encryption';

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return apiError('Unauthorized', 401);

  const body = await req.json().catch(() => ({}));
  const { accessToken, linkedinProfileUrl } = body;
  if (!accessToken || !linkedinProfileUrl) {
    return apiError('accessToken and linkedinProfileUrl are required', 400);
  }

  const simulatedExperiences = [
    { title: 'Senior Full Stack Engineer', company: 'Stripe', duration: '2022 - Present', current: true },
    { title: 'Software Engineer II', company: 'GitHub', duration: '2020 - 2022', current: false },
  ];

  const simulatedSkills = [
    { name: 'TypeScript', count: 18, endorsed: true },
    { name: 'React', count: 24, endorsed: true },
    { name: 'Node.js', count: 15, endorsed: false },
    { name: 'GraphQL', count: 12, endorsed: true },
  ];

  // Store raw data in JSON field — LinkedinSync has no first-class experiences column
  const sync = await db.linkedinSync.upsert({
    where: { userId: user.id! },
    create: {
      userId: user.id!,
      linkedinProfileUrl,
      accessToken: encrypt(accessToken),
      lastSyncedAt: new Date(),
      connectionsCount: 412,
      endorsementsCount: 69,
      recommendationsCount: 5,
      rawData: {
        experiences: simulatedExperiences,
        skills: simulatedSkills,
        endorsements: 69,
        recommendations: 5,
      },
    },
    update: {
      linkedinProfileUrl,
      accessToken: encrypt(accessToken),
      lastSyncedAt: new Date(),
      connectionsCount: 412,
      endorsementsCount: 69,
      recommendationsCount: 5,
      rawData: {
        experiences: simulatedExperiences,
        skills: simulatedSkills,
        endorsements: 69,
        recommendations: 5,
      },
    },
  });

  // Sync experience and skills to main profile
  const profile = await db.userProfile.findUnique({ where: { userId: user.id! } });
  if (profile) {
    // Clean old experiences first to avoid duplicates
    await db.experience.deleteMany({ where: { userProfileId: profile.id } });

    for (const exp of simulatedExperiences) {
      await db.experience.create({
        data: {
          userProfileId: profile.id,
          // Experience schema uses `role`, not `title`
          role: exp.title,
          company: exp.company,
          startDate: new Date(exp.current ? '2022-01-01' : '2020-01-01'),
          endDate: exp.current ? null : new Date('2021-12-31'),
          isCurrent: exp.current,
          description: `Worked as ${exp.title} at ${exp.company}.`,
        },
      });
    }

    for (const skillItem of simulatedSkills) {
      const dbSkill = await db.skill.upsert({
        where: { name: skillItem.name },
        create: { name: skillItem.name, category: 'Core Competency' },
        update: {},
      });

      await db.userSkill.upsert({
        where: { userProfileId_skillId: { userProfileId: profile.id, skillId: dbSkill.id } },
        create: { userProfileId: profile.id, skillId: dbSkill.id, level: 'ADVANCED', source: 'linkedin' },
        update: { source: 'linkedin' },
      });
    }
  }

  const { accessToken: _, ...safeSync } = sync;
  return apiSuccess(safeSync);
}
