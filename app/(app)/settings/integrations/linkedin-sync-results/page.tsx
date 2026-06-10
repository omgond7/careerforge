'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, Users, Award, TrendingUp } from 'lucide-react';
import { Linkedin } from '@/components/icons';
import { syncResultsData } from '@/lib/mock-data';
import { MetricCard } from '@/components/cards';

export default function LinkedInSyncResults() {
  const linkedin = syncResultsData.linkedin;

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
          <p className="text-muted-foreground">Your LinkedIn profile has been connected and data imported.</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Connections"
            value={linkedin.connectionsCount}
            subtitle="Professional network"
            icon={<Users className="h-5 w-5 text-primary" />}
          />
          <MetricCard
            title="Endorsements"
            value={linkedin.endorsements}
            subtitle="Skill endorsements"
            icon={<Award className="h-5 w-5 text-primary" />}
          />
          <MetricCard
            title="Recommendations"
            value={linkedin.recommendations}
            subtitle="Professional references"
            icon={<TrendingUp className="h-5 w-5 text-primary" />}
          />
          <div className="bg-card border border-border rounded-lg p-6 flex items-center justify-center">
            <div className="text-center">
              <Linkedin className="w-6 h-6 text-[#0A66C2] mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">Profile</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </div>
        </div>

        {/* Work Experience */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-6">Work Experience</h2>
          <div className="space-y-4">
            {linkedin.experiences.map((exp, idx) => (
              <div key={idx} className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-foreground">{exp.title}</h3>
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
        </div>

        {/* Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Top Skills</h2>
            <div className="space-y-4">
              {linkedin.skills.map((skill) => (
                <div key={skill.name} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">{skill.name}</p>
                    <p className="text-xs text-muted-foreground">{skill.count} endorsements</p>
                  </div>
                  {skill.endorsed && (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {linkedin.recentActivity.map((activity, idx) => (
                <div key={idx} className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-foreground capitalize">
                      {activity.type === 'post' ? '📝 Post' : '📰 Article'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">{activity.engagement} engagements</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sync Details */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Sync Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="py-2">
              <p className="text-sm text-muted-foreground mb-1">Synced At</p>
              <p className="text-sm font-medium text-foreground">
                {new Date(linkedin.timestamp).toLocaleString()}
              </p>
            </div>
            <div className="py-2">
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <p className="text-sm font-medium text-primary inline-flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Success
              </p>
            </div>
            <div className="py-2">
              <p className="text-sm text-muted-foreground mb-1">Auto-sync</p>
              <p className="text-sm font-medium text-foreground">Enabled</p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Ready to Continue?</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Your LinkedIn profile is now synced. Use your imported experience and skills to get personalized job recommendations.
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
