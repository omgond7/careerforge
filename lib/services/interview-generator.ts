import { db } from '@/lib/db';
import { ai, MODEL } from '@/lib/ai-provider';
import { logUsage } from '@/lib/api-helpers';

export async function performInterviewGenerate(backgroundJobId: string, payload: any) {
  const { userId, type, company, role, jobId, numQuestions = 5 } = payload;

  const profile = await db.userProfile.findUnique({
    where: { userId },
    include: { skills: { include: { skill: true } }, experience: true },
  });

  const job = jobId ? await db.jobAnalysis.findFirst({ where: { id: jobId, userId } }) : null;

  // Normalize interview type casing to match uppercase Prisma enum
  const intType = type ? type.toUpperCase() : 'MIXED';

  const aiResponse = await ai.complete([
    {
      role: 'system',
      content: `Generate ${numQuestions} interview questions for a ${intType} interview.
      Return JSON: { questions: [{ id: string, question: string, type: string, hint: string, sampleAnswer: string }] }`,
    },
    {
      role: 'user',
      content: `Role: ${role ?? 'Software Engineer'} at ${company ?? 'a tech company'}. Skills: ${profile?.skills.map((s: any) => s.skill.name).join(', ') ?? 'not specified'}. Job context: ${job ? job.jobTitle : 'general'}`,
    },
  ], {
    responseFormat: { type: 'json_object' },
    maxTokens: 2000,
  });

  await logUsage(userId, 'interview_prep', aiResponse.usage?.totalTokens, MODEL);

  let generated: any = {};
  try {
    generated = JSON.parse(aiResponse.content ?? '{ "questions": [] }');
  } catch {
    generated = { questions: [] };
  }

  const session = await db.interviewSession.create({
    data: {
      userId,
      jobId,
      type: intType as any,
      company,
      role,
      questions: generated.questions || [],
    },
  });

  return { interviewSessionId: session.id };
}
