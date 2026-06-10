'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, Clock, BookOpen, Code, Target, TrendingUp } from 'lucide-react';
import { roadmapMilestoneDetail } from '@/lib/mock-data';
import { MetricCard, RoadmapCard } from '@/components/cards';

export default function RoadmapMilestoneDetail() {
  const milestone = roadmapMilestoneDetail;
  const progressPercentage = Math.round(
    (milestone.completedTasks.length / (milestone.completedTasks.length + milestone.remainingTasks.length)) * 100
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link href="/career-twin/roadmap">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Roadmap
          </Link>
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">{milestone.title}</h1>
          <p className="text-lg text-muted-foreground">Week {milestone.week} of Your Career Twin Roadmap</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6 flex flex-col justify-center">
            <p className="text-sm text-muted-foreground mb-2">Progress</p>
            <p className="text-3xl font-bold text-primary mb-2">{progressPercentage}%</p>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${progressPercentage}%` }} />
            </div>
          </div>

          <MetricCard
            title="Time Invested"
            value={`${milestone.actualHours}h`}
            subtitle={`of ${milestone.estimatedHours}h estimated`}
            icon={<Clock className="h-5 w-5 text-primary" />}
          />

          <MetricCard
            title="Resources"
            value={milestone.resources.length}
            subtitle="Available materials"
            icon={<BookOpen className="h-5 w-5 text-primary" />}
          />

          <MetricCard
            title="Tasks"
            value={milestone.completedTasks.length + milestone.remainingTasks.length}
            subtitle="Total in milestone"
            icon={<CheckCircle2 className="h-5 w-5 text-primary" />}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Overview</h3>
            <p className="text-muted-foreground text-sm mb-4">{milestone.description}</p>
            <h4 className="font-semibold text-foreground text-sm mb-3">Learning Objectives</h4>
            <ul className="space-y-2">
              {milestone.learningObjectives.map((obj, idx) => (
                <li key={idx} className="flex gap-2 items-start text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span className="text-foreground">{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Timeline</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Start Date</span>
                <span className="font-medium text-foreground">
                  {new Date(milestone.startDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Est. Completion</span>
                <span className="font-medium text-foreground">
                  {new Date(milestone.estimatedEndDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground">Status</span>
                <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                  In Progress
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-6">Resources</h3>
          <div className="space-y-4">
            {milestone.resources.map((resource, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  {resource.type === 'course' ? (
                    <BookOpen className="w-5 h-5 text-primary" />
                  ) : resource.type === 'documentation' ? (
                    <Code className="w-5 h-5 text-primary" />
                  ) : (
                    <Target className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{resource.title}</p>
                  <p className="text-sm text-muted-foreground">{resource.platform}</p>
                  {resource.description && (
                    <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">Duration: {resource.duration}</p>
                </div>
                <Button variant="outline" size="sm" className="border-border flex-shrink-0">
                  Open
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              Completed ({milestone.completedTasks.length})
            </h3>
            <ul className="space-y-2">
              {milestone.completedTasks.map((task, idx) => (
                <li key={idx} className="flex gap-2 items-start text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-foreground font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground">Completed {new Date(task.date).toLocaleDateString()}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Remaining ({milestone.remainingTasks.length})</h3>
            <ul className="space-y-2">
              {milestone.remainingTasks.map((task, idx) => (
                <li key={idx} className="flex gap-2 items-start text-sm">
                  <span className="w-4 h-4 rounded-full border-2 border-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-foreground">{task.title}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Continue Learning
          </Button>
          <Button variant="outline" className="border-border">
            Mark Milestone Complete
          </Button>
          <Button variant="outline" className="border-border">
            View Progress Chart
          </Button>
        </div>
      </div>
    </div>
  );
}
