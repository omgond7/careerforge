import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, apiError, logUsage, rateLimit, RATE_LIMITS, checkDailyAILimit, incrementDailyAIUsage } from '@/lib/api-helpers';
import { db } from '@/lib/db';
import { ai, MODEL } from '@/lib/ai-provider';

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return apiError('Unauthorized', 401);

  // Check daily AI limit
  const dailyLimit = await checkDailyAILimit(user.id!, (user as any).subscriptionTier || 'FREE');
  if (!dailyLimit.allowed) {
    return apiError('Daily AI limit exceeded. Upgrade to Pro for more.', 429);
  }

  // Rate limit: 20 copilot messages per hour
  try {
    const { allowed } = await rateLimit(`copilot:${user.id!}`, RATE_LIMITS.USER_AI);
    if (!allowed) return apiError('Rate limit exceeded. Try again later.', 429);
  } catch (rlError) {
    console.error('Redis Rate Limiting Error:', rlError);
    // Proceed if Redis fails to ensure high availability
  }

  const body = await req.json().catch(() => ({}));
  const { messages } = body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return apiError('messages array is required', 400);
  }

  // Prevent prompt injection by filtering and sanitizing messages
  const sanitizedMessages = messages
    .filter((msg: any) => msg && (msg.role === 'user' || msg.role === 'assistant'))
    .map((msg: any) => ({
      role: msg.role,
      content: String(msg.content || '').slice(0, 4000), // Enforce string and max length
    }));

  if (sanitizedMessages.length === 0) {
    return apiError('Valid user or assistant messages are required', 400);
  }

  // Load profile context
  const [profile, recentJobs, applications] = await Promise.all([
    db.userProfile.findUnique({
      where: { userId: user.id! },
      include: { skills: { include: { skill: true } }, experience: true },
    }),
    db.jobAnalysis.findMany({ where: { userId: user.id! }, orderBy: { createdAt: 'desc' }, take: 3 }),
    db.application.findMany({ where: { userId: user.id! }, orderBy: { lastUpdated: 'desc' }, take: 5 }),
  ]);

  const systemContext = `You are CareerForge Copilot, an expert AI career advisor. You have access to the user's career data.
  
  User Profile:
  - Skills: ${profile?.skills.map(s => s.skill.name).join(', ') ?? 'not set'}
  - Experience: ${profile?.experience.map(e => `${e.role} at ${e.company}`).join(', ') ?? 'not set'}
  - Target Role: ${profile?.targetRole ?? 'not set'}
  
  Recent Jobs Analyzed: ${recentJobs.map(j => `${j.jobTitle} at ${j.company} (match: ${j.matchScore}%)`).join(', ') || 'none'}
  
  Active Applications: ${applications.length}
  
  Provide personalized, actionable career advice. Be specific, data-driven, and encouraging.`;

  // Streaming response
  let aiStream;
  try {
    aiStream = ai.stream([
      { role: 'system', content: systemContext },
      ...sanitizedMessages.slice(-10), // Keep last 10 messages for context
    ], {
      maxTokens: 1000,
    });
  } catch (apiErrorVal: any) {
    console.error('AI stream creation failed:', apiErrorVal);
    return apiError('AI chat assistant is currently unavailable', 503);
  }

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      let totalTokens = 0;
      try {
        for await (const chunk of aiStream) {
          if (chunk.content) controller.enqueue(encoder.encode(chunk.content));
          if (chunk.usage) totalTokens = chunk.usage.totalTokens;
          if (chunk.done) break;
        }
      } catch (streamError) {
        console.error('Error during chat stream:', streamError);
      } finally {
        controller.close();
        if (totalTokens > 0) {
          logUsage(user.id!, 'copilot', totalTokens, MODEL).catch(() => {});
          incrementDailyAIUsage(user.id!).catch(() => {});
        }
      }
    },
  });

  return new NextResponse(readable, {
    headers: { 
      'Content-Type': 'text/plain; charset=utf-8', 
      'X-Content-Type-Options': 'nosniff' 
    },
  });
}
