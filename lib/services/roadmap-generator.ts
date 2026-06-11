import { db } from '@/lib/db';
import { ai, MODEL } from '@/lib/ai-provider';
import { logUsage } from '@/lib/api-helpers';

export async function performRoadmapGenerate(backgroundJobId: string, payload: any) {
  const { userId, targetRoleTitle, targetCompany, jobId } = payload;

  const [profile, job] = await Promise.all([
    db.userProfile.findUnique({
      where: { userId },
      include: { skills: { include: { skill: true } }, experience: true },
    }),
    jobId ? db.jobAnalysis.findFirst({ where: { id: jobId, userId }, include: { gaps: true } }) : null,
  ]);

  const profileSummary = profile ? `Skills: ${profile.skills.map((s: any) => s.skill.name).join(', ')}` : 'No profile';
  const gapSummary = job ? `Gaps: ${job.gaps.map((g: any) => g.skillName).join(', ')}` : '';

  const aiResponse = await ai.complete([
    {
      role: 'system',
      content: `Generate a career roadmap. Return JSON: {
        targetMatchPct: number, currentMatchPct: number, estimatedTimeMonths: number,
        steps: [{ stepNumber: number, title: string, description: string, category: string, resources: [{title, url, type}], targetDate: "YYYY-MM-DD" }]
      }. Steps should be concrete, actionable, ordered by priority.`,
    },
    { role: 'user', content: `Target: ${targetRoleTitle} at ${targetCompany ?? 'any company'}. ${profileSummary}. ${gapSummary}` },
  ], {
    responseFormat: { type: 'json_object' },
    maxTokens: 2000,
  });

  await logUsage(userId, 'roadmap_generate', aiResponse.usage?.totalTokens, MODEL);
  
  const generated = JSON.parse(aiResponse.content ?? '{}');

  const stepsData = (generated.steps ?? []).map((step: any) => ({
    stepNumber: Number(step.stepNumber),
    title: step.title,
    description: step.description || null,
    category: step.category || 'General',
    resources: step.resources || [],
    status: 'pending',
    targetDate: step.targetDate ? new Date(step.targetDate) : null,
  }));

  const roadmap = await db.careerRoadmap.create({
    data: {
      userId,
      targetRoleTitle,
      targetCompany,
      targetMatchPct: generated.targetMatchPct ?? 100,
      currentMatchPct: generated.currentMatchPct ?? 50,
      estimatedTimeMonths: generated.estimatedTimeMonths ?? 6,
      steps: { createMany: { data: stepsData } },
    },
  });

  return { careerRoadmapId: roadmap.id };
}
