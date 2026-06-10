'use client';

import { useCareerStore } from '@/lib/stores/career';
import { Button } from '@/components/ui/button';
import { ArrowRight, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import {
  MatchScoreCard,
  InsightCard,
  MetricCard,
} from '@/components/cards';
import { GapTable } from '@/components/table';

export default function GapAnalysisPage() {
  const { targetRole } = useCareerStore();

  if (!targetRole) {
    return <div className="p-8">No target role data</div>;
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Gap Analysis</h1>
          <p className="text-lg text-muted-foreground">
            Career Twin › {targetRole.title} › Gap Analysis
          </p>
        </div>
      </div>

      {/* Match Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MatchScoreCard
          title="Current Match"
          score={targetRole.currentMatch}
          size="lg"
        />

        <MetricCard
          title="Potential Increase"
          value="+8%"
          subtitle="To target 75%"
          icon={<TrendingUp className="h-5 w-5 text-primary" />}
        />

        <div className="rounded-lg border border-border bg-card p-8 flex flex-col justify-center">
          <p className="text-sm text-muted-foreground mb-2">Target Match</p>
          <p className="text-4xl font-bold text-primary mb-4">{targetRole.targetMatch}%</p>
          <p className="text-sm text-muted-foreground">
            You need 2 more years of backend experience to comfortably meet the requirements for this role.
          </p>
        </div>
      </div>

      {/* Gap Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Critical Skill Gaps */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-6 h-6 text-destructive" />
            <h3 className="text-lg font-semibold text-foreground">Critical Skill Gaps</h3>
          </div>
          <div className="space-y-3">
            {targetRole.gapAnalysis?.skillGaps.map((skill) => (
              <div
                key={skill}
                className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/20"
              >
                <span className="text-sm font-medium text-foreground">{skill}</span>
                <span className="text-xs text-destructive font-semibold">REQUIRED</span>
              </div>
            ))}
          </div>
        </div>

        {/* Experience Gap */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-6 h-6 text-amber-600" />
            <h3 className="text-lg font-semibold text-foreground">Experience Gap</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Required</p>
              <p className="text-2xl font-bold text-foreground">
                {targetRole.gapAnalysis?.experienceGap}-7 years
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Your Experience</p>
              <p className="text-2xl font-bold text-primary">4 years</p>
            </div>
            <div className="text-xs text-muted-foreground">
              Focus on backend context and advanced system design patterns
            </div>
          </div>
        </div>

        {/* Required Projects */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle2 className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Required Projects</h3>
          </div>
          <div className="space-y-3">
            {targetRole.gapAnalysis?.requiredProjects.map((project) => (
              <div
                key={project}
                className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20"
              >
                <span className="text-sm font-medium text-foreground">{project}</span>
                <span className="text-xs text-primary font-semibold">0/1</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Breakdown Table */}
      <GapTable
        title="Detailed Breakdown"
        rows={[
          {
            type: 'Skill',
            requirement: 'GraphQL (Advanced)',
            yourStatus: 'Beginner (1 project)',
            severity: 'high',
            actionPlan: 'In Progress',
          },
          {
            type: 'Experience',
            requirement: 'Backend Context',
            yourStatus: 'Frontend Only',
            severity: 'medium',
            actionPlan: 'Not Started',
          },
          {
            type: 'Skill',
            requirement: 'AWS / Deployment',
            yourStatus: 'Vercel/Netlify mostly',
            severity: 'high',
            actionPlan: 'Planned',
          },
        ]}
      />

      {/* Remediation Timeline */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Remediation Timeline</h3>
        <div className="space-y-4">
          {[
            {
              objective: 'GraphQL Mastery',
              duration: '2 months',
              color: 'bg-primary',
              month: 'Month 1',
            },
            {
              objective: 'AWS Certification',
              duration: '1 month',
              color: 'bg-accent',
              month: 'Month 2',
            },
            {
              objective: 'Backend Project Lead',
              duration: '3 months',
              color: 'bg-amber-600',
              month: 'Month 3',
            },
          ].map((item, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-foreground">{item.objective}</span>
                <span className="text-xs text-muted-foreground">{item.duration}</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.color} rounded-full`}
                  style={{ width: `${(idx + 1) * 25}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex gap-4">
        <Button asChild className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/career-twin">
            View Learning Roadmap
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
        <Button asChild variant="outline" className="flex-1">
          <Link href="/resume-studio">
            Optimize Resume
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
