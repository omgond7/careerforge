import { db } from '@/lib/db';
import { ai, MODEL } from '@/lib/ai-provider';
import { logUsage } from '@/lib/api-helpers';
import { getJobAnalysisCacheKey, safeGetCache, safeSetCache } from '@/lib/cache-utils';

export async function performJobAnalysis(backgroundJobId: string, payload: any) {
  const { userId, company, jobTitle, jobDescription, jobUrl } = payload;
  
  // Cache check logic - not needed to return HTTP response directly, but useful to skip processing
  const cacheKey = getJobAnalysisCacheKey(userId, jobDescription);
  const cached = await safeGetCache(cacheKey);
  if (cached) {
    // Just reuse cached response instead of parsing
    return JSON.parse(cached);
  }

  // Get user profile for match calculation
  const profile = await db.userProfile.findUnique({
    where: { userId },
    include: { skills: { include: { skill: true } }, experience: true },
  });

  const profileSummary = profile
    ? `Skills: ${profile.skills.map((s: any) => s.skill.name).join(', ')}. Experience: ${profile.experience.map((e: any) => `${e.role} at ${e.company}`).join(', ')}`
    : 'No profile found';

  const aiResponse = await ai.complete([
    {
      role: 'system',
      content: `You are a job analysis expert. Analyze the job description and compare with the candidate profile.
      Return JSON: {
        parsedDetails: { requiredSkills: string[], preferredSkills: string[], experienceYears: number, atsKeywords: string[], responsibilities: string[], seniority: string },
        matchScore: number (0-100),
        matchLevel: "HIGHLY_ALIGNED"|"GOOD_MATCH"|"PARTIAL_MATCH"|"WEAK_MATCH",
        matchBreakdown: { technicalSkills: number, experience: number, softSkills: number, compensation: number },
        gaps: [{ skillName: string, gapType: "SKILL"|"PROJECT"|"EXPERIENCE"|"KEYWORD", priority: "HIGH"|"MEDIUM"|"LOW", requiredDetail: string, currentDetail: string, suggestion: string }],
        authenticityScore: { legitimate: boolean, confidence: number, details: string },
        salary: string|null
      }`,
    },
    {
      role: 'user',
      content: `Candidate: ${profileSummary}\n\nJob Title: ${jobTitle}\nCompany: ${company}\nJD: ${jobDescription.slice(0, 4000)}`,
    },
  ], {
    responseFormat: { type: 'json_object' },
    maxTokens: 2000,
  });

  await logUsage(userId, 'job_analyze', aiResponse.usage?.totalTokens, MODEL);

  const analysis = JSON.parse(aiResponse.content ?? '{}');

  // Save to DB
  const jobAnalysis = await db.jobAnalysis.create({
    data: {
      userId,
      jobTitle,
      company,
      jobDescription,
      jobUrl,
      matchScore: analysis.matchScore,
      matchLevel: analysis.matchLevel,
      matchBreakdown: analysis.matchBreakdown,
      parsedDetails: analysis.parsedDetails,
      authenticityScore: analysis.authenticityScore,
      salary: analysis.salary,
      gaps: { 
        createMany: { 
          data: (analysis.gaps ?? []).map((g: any) => ({ 
            gapType: g.gapType, 
            skillName: g.skillName, 
            priority: g.priority, 
            requiredDetail: g.requiredDetail, 
            currentDetail: g.currentDetail, 
            suggestion: g.suggestion 
          })) 
        } 
      },
    },
    include: { gaps: true },
  });

  await safeSetCache(cacheKey, JSON.stringify(jobAnalysis), 3600);

  return { jobAnalysisId: jobAnalysis.id };
}
