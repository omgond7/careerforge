import { db } from '@/lib/db';
import { ai, MODEL } from '@/lib/ai-provider';
import { logUsage } from '@/lib/api-helpers';

export async function performInterviewEvaluate(backgroundJobId: string, payload: any) {
  const { userId, interviewSessionId, answers } = payload;

  const session = await db.interviewSession.findFirst({ where: { id: interviewSessionId, userId } });
  if (!session) throw new Error('Session not found');

  const questions = (session.questions as any[]) ?? [];
  const enriched = questions.map((q: any) => ({
    ...q,
    userAnswer: answers?.find((a: any) => a.questionId === q.id)?.answer ?? '',
  }));

  const aiResponse = await ai.complete([
    {
      role: 'system',
      content: `Evaluate interview answers. Return JSON: { overallScore: number, feedback: string, questions: [{ id, score: number, feedback: string, betterAnswer: string }] }`,
    },
    { role: 'user', content: JSON.stringify(enriched).slice(0, 6000) },
  ], {
    responseFormat: { type: 'json_object' },
    maxTokens: 2000,
  });

  await logUsage(userId, 'interview_eval', aiResponse.usage?.totalTokens, MODEL);

  let evaluation: any = {};
  try {
    evaluation = JSON.parse(aiResponse.content ?? '{}');
  } catch {
    evaluation = { overallScore: 0, feedback: 'Failed to parse evaluation response', questions: [] };
  }

  const updated = await db.interviewSession.update({
    where: { id: interviewSessionId },
    data: {
      score: evaluation.overallScore ?? 0,
      feedback: evaluation,
      questions: enriched,
      completedAt: new Date(),
      durationMins: Math.round((Date.now() - session.createdAt.getTime()) / 60000),
    },
  });

  return { interviewSessionId: updated.id };
}
