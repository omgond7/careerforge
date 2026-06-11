'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle, TrendingUp, Target, Briefcase } from 'lucide-react';
import { MatchScoreCard } from '@/components/cards';
import { use } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json()).then(r => r.data);

export default function JobAnalysisDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const { data: job, isLoading } = useSWR(`/api/jobs/${id}`, fetcher);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        Loading job analysis...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        Job analysis not found.
      </div>
    );
  }

  const requirements = (job.parsedDetails as any)?.requirements || (job.parsedDetails as any)?.preferredSkills || [];
  const skills = (job.parsedDetails as any)?.requiredSkills || [];
  const gaps = job.gaps?.map((g: any) => ({
    skill: g.skillName,
    required: g.requiredDetail || 'Required',
    current: g.currentDetail || 'Missing',
    priority: g.priority || 'medium'
  })) || [];
  const similarRoles = (job.parsedDetails as any)?.similarRoles || [];
  const matchBreakdown = ((job.matchBreakdown as any) || {
    technicalSkills: 80,
    experience: 70,
    softSkills: 75,
    compensation: 85,
  }) as Record<string, number>;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link href="/job-intelligence/history">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to History
          </Link>
        </Button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">{job.jobTitle}</h1>
          <p className="text-xl text-muted-foreground mb-4">{job.company} • {job.location || 'Unknown'}</p>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span>Posted: {job.postedDate ? new Date(job.postedDate).toLocaleDateString() : 'N/A'}</span>
            <span>Analyzed: {job.analysisDate ? new Date(job.analysisDate).toLocaleDateString() : new Date(job.createdAt).toLocaleDateString()}</span>
            <span className="text-primary font-medium">{job.salary || 'Salary not provided'}</span>
          </div>
        </div>

        {/* Match Score and Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MatchScoreCard
            title="Match Score"
            score={job.matchScore || 0}
            subtitle={job.matchLevel || 'Analyzing'}
            size="lg"
            className="md:col-span-2"
          />

          <div className="bg-card border border-border rounded-lg p-6 flex flex-col justify-center">
            <p className="text-sm text-muted-foreground mb-2">Job Posted</p>
            <p className="text-2xl font-bold text-foreground">
              {job.postedDate ? new Date(job.postedDate).toLocaleDateString() : 'N/A'}
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 flex flex-col justify-center">
            <p className="text-sm text-muted-foreground mb-2">Remote</p>
            <p className="text-2xl font-bold text-foreground">{job.remote ? 'Yes' : 'No'}</p>
          </div>
        </div>

        {/* Match Breakdown */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-6">Match Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Object.entries(matchBreakdown).map(([key, value]) => (
              <div key={key}>
                <p className="text-sm font-medium text-foreground capitalize mb-2">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${value}%` }}
                  />
                </div>
                <p className="text-sm font-bold text-foreground mt-2">{value}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Requirements
            </h3>
            {requirements.length === 0 ? (
              <p className="text-sm text-muted-foreground">No specific requirements listed.</p>
            ) : (
              <ul className="space-y-3">
                {requirements.map((req: string, idx: number) => (
                  <li key={idx} className="flex gap-3 items-start">
                    <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{req}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              Required Skills
            </h3>
            {skills.length === 0 ? (
              <p className="text-sm text-muted-foreground">No specific required skills listed.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill: string) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Skill Gaps */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-primary" />
            Skill Gaps
          </h3>
          {gaps.length === 0 ? (
            <p className="text-sm text-muted-foreground">No skill gaps identified! You match perfectly.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Skill</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Required</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Your Level</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {gaps.map((gap: any) => (
                    <tr key={gap.skill} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-foreground">{gap.skill}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{gap.required}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{gap.current}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            gap.priority === 'high'
                              ? 'bg-destructive/10 text-destructive'
                              : 'bg-amber-500/10 text-amber-600'
                          }`}
                        >
                          {gap.priority.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Similar Roles */}
        {similarRoles.length > 0 && (
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Similar Roles
            </h3>
            <div className="space-y-3">
              {similarRoles.map((role: any) => (
                <div key={role.title} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{role.title}</p>
                    <p className="text-sm text-muted-foreground">{role.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">{role.match}%</p>
                    <p className="text-xs text-muted-foreground">Match</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Start Learning Path
          </Button>
          <Button variant="outline" className="border-border">
            Compare with Other Roles
          </Button>
          <Button variant="outline" className="border-border">
            Download Analysis
          </Button>
        </div>
      </div>
    </div>
  );
}
