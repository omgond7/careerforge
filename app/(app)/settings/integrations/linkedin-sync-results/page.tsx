'use client';

import Link from 'next/link';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, Users, Award, TrendingUp, Loader2 } from 'lucide-react';
import { Linkedin } from '@/components/icons';
import { MetricCard } from '@/components/cards';

const fetcher = (url: string) => fetch(url).then(r => r.json()).then(r => r.data);

export default function LinkedInSyncResults() {
  const { data: linkedinSync, error, isLoading } = useSWR('/api/integrations/linkedin/status', fetcher);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !linkedinSync || !linkedinSync.connected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 text-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">LinkedIn integration not sync'd</h2>
          <p className="text-muted-foreground mb-4">Please connect and sync your LinkedIn account first.</p>
          <Button asChild>
            <Link href="/settings/integrations">Manage Integrations</Link>
          </Button>
        </div>
      </div>
    );
  }

  const connectionsCount = linkedinSync.connectionsCount ?? 0;
  const endorsements = linkedinSync.endorsements ?? 0;
  const recommendations = linkedinSync.recommendations ?? 0;
  const lastSyncedAt = linkedinSync.lastSyncedAt ? new Date(linkedinSync.lastSyncedAt) : new Date();

  const experiences = linkedinSync.experiences || [];
  const skills = linkedinSync.skills || [];

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
          <div className="w-16 h-16 bg-[#0A66C2]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-[#0A66C2]" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">LinkedIn Sync Successful</h1>
          <p className="text-muted-foreground">Your LinkedIn profile data and professional experience have been connected.</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Connections"
            value={connectionsCount}
            subtitle="Professional network"
            icon={<Users className="h-5 w-5 text-primary" />}
          />
          <MetricCard
            title="Endorsements"
            value={endorsements}
            subtitle="Skill endorsements"
            icon={<Award className="h-5 w-5 text-primary" />}
          />
          <MetricCard
            title="Recommendations"
            value={recommendations}
            subtitle="Professional references"
            icon={<TrendingUp className="h-5 w-5 text-primary" />}
          />
          <div className="bg-card border border-border rounded-lg p-6 flex items-center justify-center">
            <div className="text-center">
              <Linkedin className="w-6 h-6 text-[#0A66C2] mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">Profile</p>
              <p className="text-xs text-muted-foreground">Active Connection</p>
            </div>
          </div>
        </div>

        {/* Work Experience */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-6 font-bold">Work Experience</h2>
          {experiences.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No experiences imported.</p>
          ) : (
            <div className="space-y-4">
              {experiences.map((exp: any, idx: number) => (
                <div key={idx} className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">{exp.title}</h3>
                      <p className="text-sm text-muted-foreground">{exp.company}</p>
                    </div>
                    {exp.current && (
                      <span className="px-2.5 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{exp.duration}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6 font-bold">Top Skills</h2>
            {skills.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No skills imported.</p>
            ) : (
              <div className="space-y-4">
                {skills.map((skillItem: any) => (
                  <div key={skillItem.name} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-foreground">{skillItem.name}</p>
                      <p className="text-xs text-muted-foreground">{skillItem.count} endorsements</p>
                    </div>
                    {skillItem.endorsed && (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sync Details */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6 font-bold">Sync Details</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Synced At</span>
                <span className="text-sm font-medium text-foreground">
                  {lastSyncedAt.toLocaleString()}
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
                <span className="text-sm text-muted-foreground">Auto-sync</span>
                <span className="text-sm font-medium text-foreground">Enabled</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ready to Continue */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 font-bold font-semibold">Ready to Continue?</h2>
          <p className="text-sm text-muted-foreground">
            Your LinkedIn profile is successfully connected. You can use your imported skills and career background to scan jobs and evaluate resume match indicators.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/job-intelligence">
              Find Matching Roles
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
