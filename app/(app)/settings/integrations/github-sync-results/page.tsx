'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, Star, GitBranch, TrendingUp } from 'lucide-react';
import { Github } from '@/components/icons';
import { syncResultsData } from '@/lib/mock-data';
import { MetricCard } from '@/components/cards';

export default function GitHubSyncResults() {
  const github = syncResultsData.github;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link href="/settings/integrations">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-foreground/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">GitHub Sync Successful</h1>
          <p className="text-muted-foreground">Your GitHub profile has been connected and data imported.</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Projects Imported"
            value={github.projectsImported}
            subtitle={`${github.projectsUpdated} updated`}
            icon={<Github className="h-5 w-5 text-primary" />}
          />
          <MetricCard
            title="Total Stars"
            value={github.totalStars}
            subtitle="Across all projects"
            icon={<Star className="h-5 w-5 text-primary" />}
          />
          <MetricCard
            title="Total Contributions"
            value={github.contributions.total.toLocaleString()}
            subtitle={`${github.contributions.thisYear} this year`}
            icon={<GitBranch className="h-5 w-5 text-primary" />}
          />
          <MetricCard
            title="This Month"
            value={github.contributions.thisMonth}
            subtitle="Contributions"
            icon={<TrendingUp className="h-5 w-5 text-primary" />}
          />
        </div>

        {/* Top Projects */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-6">Top Projects</h2>
          <div className="space-y-4">
            {github.projects.map((project) => (
              <div key={project.name} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                <div>
                  <h3 className="font-medium text-foreground">{project.name}</h3>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                  <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="inline-block px-2 py-1 bg-muted rounded">{project.language}</span>
                    <span>⭐ {project.stars} stars</span>
                    <span>🔀 {project.forks} forks</span>
                  </div>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  Updated {new Date(project.updated).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Languages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Top Languages</h2>
            <div className="space-y-4">
              {github.topLanguages.map((lang) => (
                <div key={lang.name}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-foreground">{lang.name}</p>
                    <p className="text-sm text-muted-foreground">{lang.percentage}%</p>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${lang.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{lang.projects} projects</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sync Details */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Sync Details</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Synced At</span>
                <span className="text-sm font-medium text-foreground">
                  {new Date(github.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="text-sm font-medium text-primary inline-flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Success
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Last Update</span>
                <span className="text-sm font-medium text-foreground">2 hours ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Next Steps</h2>
          <ul className="space-y-3">
            <li className="flex gap-3 items-start">
              <span className="inline-block w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Connect LinkedIn</p>
                <p className="text-xs text-muted-foreground">Import work experience and endorsements</p>
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <span className="inline-block w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Analyze Target Role</p>
                <p className="text-xs text-muted-foreground">Get personalized insights for your dream job</p>
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <span className="inline-block w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Start Learning Path</p>
                <p className="text-xs text-muted-foreground">Close skill gaps with recommended courses</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/settings/integrations">
              Manage Integrations
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-border">
            <Link href="/dashboard">
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
