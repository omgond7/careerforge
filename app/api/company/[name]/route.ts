import { NextRequest } from 'next/server';
import { getAuthUser, apiSuccess, apiError, logUsage, rateLimit, RATE_LIMITS, checkDailyAILimit, incrementDailyAIUsage } from '@/lib/api-helpers';
import { db } from '@/lib/db';
import { ai, MODEL } from '@/lib/ai-provider';

export async function GET(
  req: NextRequest, 
  { params }: { params: Promise<{ name: string }> }
) {
  const user = await getAuthUser();
  if (!user) return apiError('Unauthorized', 401);

  // Check daily AI limit
  const dailyLimit = await checkDailyAILimit(user.id!, (user as any).subscriptionTier || 'FREE');
  if (!dailyLimit.allowed) {
    return apiError('Daily AI limit exceeded. Upgrade to Pro for more.', 429);
  }

  // Rate limit
  try {
    const { allowed } = await rateLimit(`company:${user.id!}`, RATE_LIMITS.USER_AI);
    if (!allowed) return apiError('Rate limit exceeded. Try again later.', 429);
  } catch (rlError) {
    console.error('Redis Rate Limiting Error:', rlError);
  }

  const resolvedParams = await params;
  const companyName = decodeURIComponent(resolvedParams.name);

  // Cache check
  try {
    const cached = await db.companyCache.findUnique({ where: { companyName } });
    if (cached && cached.expiresAt > new Date()) return apiSuccess(cached.data);
  } catch (dbError) {
    console.error('Database Company Cache fetch failed:', dbError);
  }

  let aiResponse;
  try {
    aiResponse = await ai.complete([
      {
        role: 'system',
        content: `You are a company research analyst. Return JSON: {
          description: string,
          founded: string,
          headquarters: string,
          size: string,
          techStack: string[],
          products: string[],
          culture: { values: string[], workStyle: string, benefits: string[] },
          interviewProcess: { stages: string[], avgDuration: string, difficulty: string, tips: string[] },
          salaryRange: { engineer: string, senior: string, staff: string },
          glassdoorRating: number|null,
          recentNews: [{ title: string, summary: string, date: string }]
        }`,
      },
      { role: 'user', content: `Research this company: ${companyName}` },
    ], {
      responseFormat: { type: 'json_object' },
      maxTokens: 2000,
    });
  } catch (error: any) {
    console.error('Company research AI call failed:', error);
    return apiError('Company research service currently unavailable', 503);
  }

  await logUsage(user.id!, 'company_research', aiResponse.usage?.totalTokens, MODEL);
  await incrementDailyAIUsage(user.id!);
  
  let data: any = {};
  try {
    data = JSON.parse(aiResponse.content ?? '{}');
  } catch (parseError) {
    console.error('Failed to parse company research JSON:', parseError);
    return apiError('Failed to parse AI output', 422);
  }

  // Cache for 7 days
  try {
    await db.companyCache.upsert({
      where: { companyName },
      create: { companyName, data, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
      update: { data, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), cachedAt: new Date() },
    });
  } catch (dbUpsertError) {
    console.error('Database Company Cache upsert failed:', dbUpsertError);
  }

  return apiSuccess(data);
}
