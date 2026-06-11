import { db } from '@/lib/db';
import { ai, MODEL } from '@/lib/ai-provider';
import { logUsage } from '@/lib/api-helpers';

export async function performAtsScore(backgroundJobId: string, payload: any) {
  const { userId, resumeId, jobDescription } = payload;

  const resume = await db.resume.findFirst({ where: { id: resumeId, userId } });
  if (!resume) throw new Error('Resume not found');

  const prompt = jobDescription
    ? `Score this resume against this job description (0-100 ATS score) and list missing keywords. Job: ${jobDescription.slice(0, 1000)}\n\nResume: ${JSON.stringify(resume.contentJson).slice(0, 3000)}`
    : `Score this resume for general ATS compatibility (0-100) and list missing keywords. Resume: ${JSON.stringify(resume.contentJson).slice(0, 3000)}`;

  const aiResponse = await ai.complete([
    {
      role: 'system',
      content: 'You are an ATS expert. Return JSON: { score: number, missingKeywords: string[], suggestions: string[] }',
    },
    { role: 'user', content: prompt },
  ], {
    responseFormat: { type: 'json_object' },
    maxTokens: 500,
  });

  await logUsage(userId, 'ats_score', aiResponse.usage?.totalTokens, MODEL);

  let result;
  try {
    result = JSON.parse(aiResponse.content ?? '{"score": 60, "missingKeywords": [], "suggestions": []}');
  } catch {
    result = { score: 60, missingKeywords: [], suggestions: [] };
  }

  await db.resume.update({ where: { id: resumeId }, data: { atsScore: result.score } });

  return result;
}
