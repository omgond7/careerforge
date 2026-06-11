import { NextRequest } from 'next/server';
import { getAuthUser, apiSuccess, apiError } from '@/lib/api-helpers';
import { db } from '@/lib/db';
import { encrypt } from '@/lib/encryption';

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return apiError('Unauthorized', 401);

  const body = await req.json().catch(() => ({}));
  const { accessToken, username } = body;
  if (!accessToken || !username) {
    return apiError('accessToken and username are required', 400);
  }

  // Fetch GitHub data with required User-Agent header
  const requestHeaders = {
    Authorization: `Bearer ${accessToken}`,
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'CareerForge-AI-Copilot',
  };

  let reposRes, userRes;
  try {
    [reposRes, userRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}/repos?per_page=50&sort=updated`, {
        headers: requestHeaders,
      }),
      fetch(`https://api.github.com/user`, {
        headers: requestHeaders,
      }),
    ]);
  } catch (fetchError: any) {
    console.error('GitHub API connection failed:', fetchError);
    return apiError('Failed to establish connection to GitHub APIs', 502);
  }

  if (!reposRes.ok) {
    console.error('GitHub Repos Response Error:', reposRes.status, await reposRes.text());
    return apiError('Failed to fetch GitHub repositories data', 502);
  }
  if (!userRes.ok) {
    console.error('GitHub User Response Error:', userRes.status, await userRes.text());
    return apiError('Failed to fetch GitHub user account profile', 502);
  }

  const repos = await reposRes.json();
  const githubUser = await userRes.json();

  // Calculate top languages
  const langMap = new Map<string, number>();
  for (const repo of repos) {
    if (repo.language) {
      langMap.set(repo.language, (langMap.get(repo.language) ?? 0) + 1);
    }
  }
  const totalLangCount = Array.from(langMap.values()).reduce((a, b) => a + b, 0);
  const topLanguages = Array.from(langMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ 
      name, 
      percentage: totalLangCount > 0 ? Math.round((count / totalLangCount) * 100) : 0, 
      projects: count 
    }));

  const totalStars = repos.reduce((sum: number, r: any) => sum + (r.stargazers_count ?? 0), 0);

  const syncData = await db.githubSync.upsert({
    where: { userId: user.id! },
    create: { 
      userId: user.id!, 
      githubUsername: username, 
      accessToken: encrypt(accessToken), 
      projectsImported: repos.length, 
      totalStars, 
      topLanguages, 
      lastSyncedAt: new Date(), 
      rawData: { repos: repos.slice(0, 20), user: githubUser } 
    },
    update: { 
      githubUsername: username, 
      accessToken: encrypt(accessToken), 
      projectsImported: repos.length, 
      totalStars, 
      topLanguages, 
      lastSyncedAt: new Date(), 
      rawData: { repos: repos.slice(0, 20), user: githubUser } 
    },
  });

  // Sync projects to profile
  const profile = await db.userProfile.findUnique({ where: { userId: user.id! } });
  if (profile) {
    for (const repo of repos.slice(0, 15)) {
      if (!repo.private && repo.description) {
        await db.project.upsert({
          where: { id: `github-${repo.id}` },
          create: {
            id: `github-${repo.id}`,
            userProfileId: profile.id,
            name: repo.name,
            description: repo.description,
            githubUrl: repo.html_url,
            techStack: repo.language ? [repo.language] : [],
            stars: repo.stargazers_count,
            forks: repo.forks_count,
          },
          update: { stars: repo.stargazers_count, forks: repo.forks_count },
        });
      }
    }

    // Add languages as skills
    for (const lang of topLanguages) {
      const skill = await db.skill.upsert({
        where: { name: lang.name },
        create: { name: lang.name, category: 'Programming Language' },
        update: {},
      });
      await db.userSkill.upsert({
        where: { userProfileId_skillId: { userProfileId: profile.id, skillId: skill.id } },
        create: { userProfileId: profile.id, skillId: skill.id, level: 'INTERMEDIATE', source: 'github' },
        update: { source: 'github' },
      });
    }
  }

  const { accessToken: _, ...safeSync } = syncData;
  return apiSuccess(safeSync);
}
