import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, apiSuccess, apiError, logUsage, rateLimit, RATE_LIMITS, checkDailyAILimit, incrementDailyAIUsage } from '@/lib/api-helpers';
import { db } from '@/lib/db';
import { ai, MODEL } from '@/lib/ai-provider';
import { s3, S3_BUCKET, S3_PUBLIC_URL } from '@/lib/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return apiError('Unauthorized', 401);

  // Check daily AI limit
  const dailyLimit = await checkDailyAILimit(user.id!, (user as any).subscriptionTier || 'FREE');
  if (!dailyLimit.allowed) {
    return apiError('Daily AI limit exceeded. Upgrade to Pro for more.', 429);
  }

  // Rate limit
  try {
    const { allowed } = await rateLimit(`resume_upload:${user.id!}`, RATE_LIMITS.USER_AI);
    if (!allowed) return apiError('Rate limit exceeded. Try again later.', 429);
  } catch (rlError) {
    console.error('Redis Rate Limiting Error:', rlError);
  }

  const formData = await req.formData().catch(() => null);
  if (!formData) return apiError('Invalid form data', 400);

  const file = formData.get('file') as File | null;
  if (!file) return apiError('No file uploaded', 400);

  const allowedMimeTypes = [
    'application/pdf', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  if (!allowedMimeTypes.includes(file.type)) {
    return apiError('Only PDF and DOCX files are supported', 400);
  }

  const MAX_UPLOAD_SIZE = 10 * 1024 * 1024; // 10 MB
  if (file.size > MAX_UPLOAD_SIZE) {
    return apiError('File size exceeds the 10 MB limit', 400);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileKey = `resumes/${user.id!}/${randomUUID()}-${file.name}`;

  // Upload to S3
  try {
    await s3.send(new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: fileKey,
      Body: buffer,
      ContentType: file.type,
    }));
  } catch (s3Error: any) {
    console.error('S3 Upload Failed:', s3Error);
    return apiError('Failed to store file in object storage', 500);
  }

  const uploadedFileUrl = `${S3_PUBLIC_URL}/${fileKey}`;

  // Extract text
  let rawText = '';
  try {
    if (file.type === 'application/pdf') {
      const pdfParseModule = await import('pdf-parse');
      const pdfParse = (pdfParseModule as any).default ?? pdfParseModule;
      const parsed = await pdfParse(buffer);
      rawText = parsed.text;
    } else {
      const mammoth = await import('mammoth');
      const result = await mammoth.extractRawText({ buffer });
      rawText = result.value;
    }
  } catch (parseError: any) {
    console.error('File Text Extraction Failed:', parseError);
    return apiError('Failed to extract text from the document', 422);
  }

  if (!rawText || rawText.trim().length === 0) {
    return apiError('Uploaded resume is empty or not readable', 422);
  }

  // Parse with AI
  let contentJson: any = {};
  let aiResponse;
  try {
    aiResponse = await ai.complete([
      {
        role: 'system',
        content: `You are a professional resume parser. Extract structured data from resume text. 
        Return a JSON object with these fields:
        {
          personalInfo: { fullName, email, phone, location, linkedinUrl, githubUrl, websiteUrl },
          summary: string,
          experience: [{ company, role, location, startDate (YYYY-MM), endDate (YYYY-MM or "Present"), description, accomplishments: string[] }],
          education: [{ institution, degree, field, startYear, endYear, gpa }],
          skills: [{ name, category }],
          projects: [{ name, description, techStack: string[], githubUrl, liveUrl }],
          certifications: [{ name, provider, issueDate (YYYY-MM), expiryDate }]
        }
        Be accurate and do not hallucinate. Only include what is in the text.`,
      },
      { role: 'user', content: `Parse this resume:\n\n${rawText.slice(0, 8000)}` },
    ], {
      responseFormat: { type: 'json_object' },
      maxTokens: 2000,
    });

    await logUsage(user.id!, 'resume_parse', aiResponse.usage?.totalTokens, MODEL);
    await incrementDailyAIUsage(user.id!);
    contentJson = JSON.parse(aiResponse.content ?? '{}');
  } catch (aiError: any) {
    console.error('AI Parsing Failed:', aiError);
    contentJson = { rawText }; // Fallback to raw text
  }

  // Create resume in DB
  const resume = await db.resume.create({
    data: {
      userId: user.id!,
      name: file.name.replace(/\.[^/.]+$/, ''),
      contentJson,
      rawText,
      uploadedFileUrl,
      versions: {
        create: {
          versionNumber: 1,
          versionType: 'MANUAL',
          contentJson,
        },
      },
    },
    include: { versions: true },
  });

  // Update user profile with extracted skills/experiences
  const profile = await db.userProfile.findUnique({ where: { userId: user.id! } });
  if (profile && contentJson.skills && Array.isArray(contentJson.skills)) {
    for (const skillData of contentJson.skills) {
      if (skillData && skillData.name) {
        const skill = await db.skill.upsert({
          where: { name: skillData.name },
          create: { name: skillData.name, category: skillData.category ?? 'General' },
          update: {},
        });
        await db.userSkill.upsert({
          where: { userProfileId_skillId: { userProfileId: profile.id, skillId: skill.id } },
          create: { userProfileId: profile.id, skillId: skill.id, level: 'INTERMEDIATE', source: 'resume' },
          update: { source: 'resume' },
        });
      }
    }
  }

  const { logAuditRequest } = await import('@/lib/audit-logger');
  await logAuditRequest(req, {
    userId: user.id!,
    action: 'RESUME_UPLOAD',
    entityType: 'RESUME',
    entityId: resume.id,
    metadata: { fileName: file.name },
  });

  return apiSuccess(resume, 201);
}
