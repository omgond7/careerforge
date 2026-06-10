'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle, TrendingUp, Target, Briefcase } from 'lucide-react';
import { jobAnalysisDetail } from '@/lib/mock-data';
import { MatchScoreCard } from '@/components/cards';

export default function JobAnalysisDetail({ params }: { params: { id: string } }) {
  const job = jobAnalysisDetail;

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
          <p className="text-xl text-muted-foreground mb-4">{job.company} • {job.location}</p>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span>Posted: {new Date(job.postedDate).toLocaleDateString()}</span>
            <span>Analyzed: {new Date(job.analysisDate).toLocaleDateString()}</span>
            <span className="text-primary font-medium">{job.salary}</span>
          </div>
        </div>

        {/* Match Score and Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MatchScoreCard
            title="Match Score"
            score={job.matchScore}
            subtitle={job.matchLevel}
            size="lg"
            className="md:col-span-2"
          />

          <div className="bg-card border border-border rounded-lg p-6 flex flex-col justify-center">
            <p className="text-sm text-muted-foreground mb-2">Job Posted</p>
            <p className="text-2xl font-bold text-foreground">{new Date(job.postedDate).toLocaleDateString()}</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 flex flex-col justify-center">
            <p className="text-sm text-muted-foreground mb-2">Remote</p>
            <p className="text-2xl font-bold text-foreground">{job.remote ? 'No' : 'Yes'}</p>
          </div>
        </div>

        {/* Match Breakdown */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-6">Match Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Object.entries(job.matchBreakdown).map(([key, value]) => (
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
            <ul className="space-y-3">
              {job.requirements.map((req, idx) => (
                <li key={idx} className="flex gap-3 items-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              Required Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Skill Gaps */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-primary" />
            Skill Gaps
          </h3>
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
                {job.gaps.map((gap) => (
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
        </div>

        {/* Similar Roles */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Similar Roles
          </h3>
          <div className="space-y-3">
            {job.similarRoles.map((role) => (
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
