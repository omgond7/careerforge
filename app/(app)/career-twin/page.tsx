'use client';

import { useAuthStore } from '@/lib/stores/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  BarChart3,
  Award,
  Target,
  ArrowRight,
  MapPin,
} from 'lucide-react';
import { SkillRadar, KnowledgeGraph } from '@/components/charts';
import { RoadmapCard, InsightCard } from '@/components/cards';
import { SkillBadge } from '@/components/badges';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json()).then(r => r.data);

export default function CareerTwinPage() {
  const { user } = useAuthStore();
  const { data: profile, isLoading } = useSWR('/api/user/profile', fetcher);

  const careerTwin = profile ? {
    id: profile.id,
    name: user?.name || 'Candidate',
    title: profile.headline || profile.targetRole || 'Professional Title',
    company: profile.experience?.[0]?.company || profile.targetCompany || 'Self-Employed',
    profileCompleteness: profile.profileCompleteness || 0,
    topSkills: profile.skills?.slice(0, 5).map((s: any) => s.skill?.name || s.skillId) || [],
    experience: profile.experienceYears || 0,
  } : null;

  const targetRole = profile?.targetRole ? {
    title: profile.targetRole,
    company: profile.targetCompany || 'Dream Company',
    currentMatch: 75,
    targetMatch: 90,
  } : null;

  const verifiedSkills: { skill: string; proficiency: number; source: string }[] = profile?.skills?.map((s: any) => ({
    skill: s.skill?.name || s.skillId,
    proficiency: s.level === 'EXPERT' ? 95 : s.level === 'ADVANCED' ? 85 : s.level === 'INTERMEDIATE' ? 70 : 50,
    source: s.source || 'Manual',
  })) || [];

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading Career Twin...</div>;
  }

  if (!careerTwin) {
    return <div className="p-8 text-center text-muted-foreground">No career twin data found. Create a profile to start.</div>;
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Digital Career Twin</h1>
          <p className="text-lg text-muted-foreground">
            A comprehensive map of your professional DNA.
          </p>
        </div>
      </div>

      {/* Twin Profile Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-card border border-border rounded-lg p-6">
          <div className="text-center mb-6">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${careerTwin.name}`}
              alt={careerTwin.name}
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold text-foreground">{careerTwin.name}</h2>
            <p className="text-lg text-primary font-semibold mb-1">{careerTwin.title}</p>
            <p className="text-muted-foreground">{careerTwin.company}</p>
          </div>

          <div className="space-y-4 border-t border-border pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Profile Completeness</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${careerTwin.profileCompleteness}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-foreground">
                  {careerTwin.profileCompleteness}%
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Top Skills</p>
              <div className="flex flex-wrap gap-2">
                {careerTwin.topSkills.map((skill: string) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Experience</p>
              <p className="text-2xl font-bold text-foreground">{careerTwin.experience} years</p>
            </div>
          </div>
        </div>

        {/* Knowledge Graph Preview */}
        <div className="md:col-span-2 bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Knowledge Graph
          </h3>
          <div className="bg-muted/30 rounded-lg p-8 min-h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full border-4 border-primary bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">Me</span>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Interactive knowledge graph visualization would render here with your skills,
                projects, and professional connections.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Skills & Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Competency Radar */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Competency Radar
          </h3>
          <div className="aspect-square rounded-lg bg-muted/30 flex items-center justify-center">
            <div className="text-center">
              <svg className="w-32 h-32 mx-auto mb-4" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="1" className="text-muted" />
                <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="1" className="text-muted" />
                <circle cx="100" cy="100" r="30" fill="none" stroke="currentColor" strokeWidth="1" className="text-muted" />
                
                <line x1="100" y1="10" x2="100" y2="190" stroke="currentColor" strokeWidth="1" className="text-muted" />
                <line x1="10" y1="100" x2="190" y2="100" stroke="currentColor" strokeWidth="1" className="text-muted" />
                <line x1="135.5" y1="35.5" x2="64.5" y2="164.5" stroke="currentColor" strokeWidth="1" className="text-muted" />
                <line x1="64.5" y1="35.5" x2="135.5" y2="164.5" stroke="currentColor" strokeWidth="1" className="text-muted" />
              </svg>
              <p className="text-xs text-muted-foreground">Frontend · DevOps · Backend · Database</p>
            </div>
          </div>
        </div>

        {/* Verified Skills */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Verified Skills</h3>
          <div className="space-y-4">
            {verifiedSkills.map(({ skill, proficiency, source }) => (
              <div key={skill}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-foreground">{skill}</span>
                  <span className="text-xs text-muted-foreground">{source}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${proficiency}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Career Progression */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Milestone Roadmap
        </h3>
        {[
          {
            week: 1,
            status: 'in-progress' as const,
            milestone: 'Master GraphQL',
            description: 'Address primary skill gap identified in job description parsing.',
            resources: ['Advanced GraphQL Course (Frontend Masters)', 'Apollo Client Documentation Study'],
            hours: 10,
          },
          {
            week: 2,
            status: 'not-started' as const,
            milestone: 'Real-time Dashboard Project',
            description: 'Project Gap: Demonstrate practical application of GraphQL subscriptions.',
            resources: ['Task: Build a GraphQL-powered data visualization dashboard using React and Recharts.'],
            hours: 20,
          },
          {
            week: 3,
            status: 'not-started' as const,
            milestone: 'AWS Fundamentals',
            description: 'Experience Gap: Basic infrastructure knowledge required for Senior roles.',
            resources: ['Cloud Practitioner cert study', 'Setup CloudFront S3 deployment pipeline'],
            hours: 12,
          },
        ].map(({ week, status, milestone, description, resources, hours }) => (
          <RoadmapCard
            key={week}
            week={week}
            title={milestone}
            status={status}
            estimatedHours={hours}
            gap={description}
            resources={resources}
            onStartLearning={() => window.location.href = '/career-twin/roadmap'}
          />
        ))}
      </div>

      {/* CTA */}
      {targetRole && (
        <div className="bg-gradient-to-r from-primary to-accent rounded-lg p-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <MapPin className="w-6 h-6" />
            <h3 className="text-xl font-bold">Target Role: {targetRole.title}</h3>
          </div>
          <p className="mb-6 text-white/80">
            Your career twin analysis shows you&apos;re {targetRole.currentMatch}% aligned with this role. 
            Complete your learning roadmap to reach {targetRole.targetMatch}%.
          </p>
          <div className="flex gap-3">
            <Button asChild className="bg-white text-primary hover:bg-white/90">
              <Link href="/gap-analysis">View Gap Analysis</Link>
            </Button>
            <Button
              asChild
              className="border-white/30 text-white hover:bg-white/10"
            >
              <Link href="/career-twin/roadmap">Continue Learning</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
