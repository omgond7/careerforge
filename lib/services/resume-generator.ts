import { db } from '@/lib/db';
import { ai, MODEL } from '@/lib/ai-provider';
import { logUsage } from '@/lib/api-helpers';

export async function performResumeGenerate(backgroundJobId: string, payload: any) {
  const { userId, jobId, resumeId } = payload;

  const [job, resume, profile] = await Promise.all([
    db.jobAnalysis.findFirst({ where: { id: jobId, userId }, include: { gaps: true } }),
    resumeId ? db.resume.findFirst({ where: { id: resumeId, userId } }) :
      db.resume.findFirst({ where: { userId, isPrimary: true } }),
    db.userProfile.findUnique({
      where: { userId },
      include: { skills: { include: { skill: true } }, experience: true, projects: true, education: true, certifications: true },
    }),
  ]);

  if (!job) throw new Error('Job not found');
  if (!profile) throw new Error('Profile not found');

  const profileSummary = JSON.stringify(profile).slice(0, 4000);
  const jobSummary = JSON.stringify({ title: job.jobTitle, company: job.company, parsedDetails: job.parsedDetails, gaps: job.gaps }).slice(0, 2000);
  const currentResume = resume ? JSON.stringify(resume.contentJson).slice(0, 3000) : '{}';

  const systemPrompt = `You are a professional resume writer and career expert. Generate three resume variations.
  Return JSON with structure: { resume1: {...resumeContent}, resume2: {...resumeContent}, resume3: {...resumeContent} }
  Each resume has: { personalInfo, summary, experience, education, skills, projects, certifications }
  
  Resume 1 (FACTUAL): Strictly factual, re-ordered and re-worded to match job keywords. NEVER add skills not in profile.
  Resume 2 (GAP_ENHANCED): Factual content PLUS highlights near-term upskilling (mark with [In Progress] or [Scheduled]).
  Resume 3 (IDEAL_BLUEPRINT): Target state — what the candidate would look like if fully qualified. Add [Target] marker.`;

  const aiResponse = await ai.complete([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Profile: ${profileSummary}\n\nJob: ${jobSummary}\n\nCurrent resume: ${currentResume}` },
  ], {
    responseFormat: { type: 'json_object' },
    maxTokens: 4000,
  });

  await logUsage(userId, 'resume_generate', aiResponse.usage?.totalTokens, MODEL);

  const generated = JSON.parse(aiResponse.content ?? '{}');

  // Store generated versions
  const baseResume = resume ?? await db.resume.findFirst({ where: { userId }, orderBy: { createdAt: 'desc' } });
  
  let versionsData = null;
  if (baseResume && generated.resume1) {
    const maxVersion = await db.resumeVersion.aggregate({ where: { resumeId: baseResume.id }, _max: { versionNumber: true } });
    const nextVersion = (maxVersion._max.versionNumber ?? 0) + 1;

    await db.resumeVersion.createMany({
      data: [
        { resumeId: baseResume.id, versionNumber: nextVersion, versionType: 'FACTUAL', contentJson: generated.resume1, generatedForJobId: jobId },
        { resumeId: baseResume.id, versionNumber: nextVersion + 1, versionType: 'GAP_ENHANCED', contentJson: generated.resume2, generatedForJobId: jobId },
        { resumeId: baseResume.id, versionNumber: nextVersion + 2, versionType: 'IDEAL_BLUEPRINT', contentJson: generated.resume3, generatedForJobId: jobId },
      ],
    });
    
    versionsData = {
      resume1: { title: 'Best Possible Current', type: 'FACTUAL', content: generated.resume1 },
      resume2: { title: 'Gap-Enhanced', type: 'GAP_ENHANCED', content: generated.resume2 },
      resume3: { title: 'Ideal Candidate Blueprint', type: 'IDEAL_BLUEPRINT', content: generated.resume3 },
    };
  }

  return { versions: versionsData };
}
