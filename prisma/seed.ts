import { SkillLevel, OnboardingStep } from '../lib/generated/prisma/client';
import bcrypt from 'bcryptjs';
import { db } from '../lib/db';

async function main() {
  console.log('🌱 Seeding database...');

  // Demo user
  const seedPassword = process.env.SEED_USER_PASSWORD || 'CareerForgeSecureSeed2026!';
  const passwordHash = await bcrypt.hash(seedPassword, 12);
  const user = await db.user.upsert({
    where: { email: 'demo@careerforge.ai' },
    update: {},
    create: {
      email: 'demo@careerforge.ai',
      name: 'Sarah Chen',
      passwordHash,
      emailVerified: new Date(),
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      onboardingDone: true,
      onboardingStep: OnboardingStep.COMPLETE,
      profile: {
        create: {
          headline: 'Senior Frontend Engineer',
          bio: 'Passionate about building scalable web applications.',
          location: 'San Francisco, CA',
          experienceYears: 8,
          targetRole: 'Staff Engineer',
          profileCompleteness: 85,
          experience: {
            createMany: {
              data: [
                { company: 'TechNova Solutions', role: 'Senior Frontend Engineer', startDate: new Date('2022-01-01'), isCurrent: true, skills: ['React', 'TypeScript', 'Next.js'] },
                { company: 'StartupXYZ', role: 'Frontend Developer', startDate: new Date('2019-06-01'), endDate: new Date('2021-12-31'), skills: ['React', 'JavaScript'] },
              ],
            },
          },
          education: {
            create: { institution: 'UC Berkeley', degree: 'BS', field: 'Computer Science', startYear: 2015, endYear: 2019 },
          },
        },
      },
      notificationPrefs: { create: {} },
      securitySettings: { create: {} },
    },
  });

  // Seed skills
  const skillList = [
    { name: 'React', category: 'Frontend' },
    { name: 'TypeScript', category: 'Language' },
    { name: 'Next.js', category: 'Framework' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'PostgreSQL', category: 'Database' },
    { name: 'GraphQL', category: 'API' },
    { name: 'AWS', category: 'Cloud' },
    { name: 'Docker', category: 'DevOps' },
    { name: 'Python', category: 'Language' },
    { name: 'System Design', category: 'Architecture' },
  ];

  for (const s of skillList) {
    await db.skill.upsert({ where: { name: s.name }, create: s, update: {} });
  }

  // Assign skills to demo user
  const profile = await db.userProfile.findUnique({ where: { userId: user.id } });
  if (profile) {
    const skills = await db.skill.findMany({ where: { name: { in: ['React', 'TypeScript', 'Next.js', 'Node.js'] } } });
    for (const skill of skills) {
      await db.userSkill.upsert({
        where: { userProfileId_skillId: { userProfileId: profile.id, skillId: skill.id } },
        create: { userProfileId: profile.id, skillId: skill.id, level: SkillLevel.ADVANCED, source: 'resume' },
        update: {},
      });
    }
  }

  // Sample notifications
  await db.notification.createMany({
    data: [
      { userId: user.id, type: 'JOB_ALERT', title: 'New Match Found', body: 'A Staff Engineer role at Stripe matches 91% of your profile.', actionUrl: '/job-intelligence' },
      { userId: user.id, type: 'SKILL_SUGGESTION', title: 'Skill Gap Alert', body: 'GraphQL appears in 8 of your target job descriptions.', actionUrl: '/career-twin' },
    ],
  });

  console.log(`✅ Seed complete. Demo user: demo@careerforge.ai / ${seedPassword}`);
}

main().catch(console.error).finally(() => db.$disconnect());
