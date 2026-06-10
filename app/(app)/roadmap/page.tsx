'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function RoadmapPage() {
  const roadmap = [
    {
      week: 'Week 1',
      status: 'in-progress',
      title: 'Master GraphQL',
      description: 'Learn advanced GraphQL concepts, subscriptions, and performance optimization.',
      resources: [
        'Advanced GraphQL Course (Frontend Masters)',
        'Apollo Client Documentation',
      ],
      hours: 10,
    },
    {
      week: 'Week 2',
      status: 'not-started',
      title: 'Real-time Dashboard Project',
      description: 'Build a GraphQL-powered data visualization dashboard using React and Recharts.',
      resources: [
        'Build GraphQL subscription-based chart updates',
        'Implement real-time data refresh',
      ],
      hours: 20,
    },
    {
      week: 'Week 3-4',
      status: 'not-started',
      title: 'AWS Fundamentals',
      description: 'Master AWS services essential for senior roles.',
      resources: [
        'Cloud Practitioner Certification Study',
        'S3 & CloudFront deployment setup',
      ],
      hours: 12,
    },
    {
      week: 'Week 5-6',
      status: 'not-started',
      title: 'Docker & Container Orchestration',
      description: 'Understand containerization and Kubernetes basics.',
      resources: [
        'Docker fundamentals course',
        'Kubernetes basic patterns',
      ],
      hours: 15,
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Career Roadmap</h1>
        <p className="text-lg text-muted-foreground">
          Your personalized learning and development path to reach your target role
        </p>
      </div>

      {/* Progress Overview */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Overall Progress</p>
            <p className="text-4xl font-bold text-foreground">Week 1 of 6</p>
          </div>
          <div className="flex-1 max-w-md">
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
                style={{ width: '17%' }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">17% complete</p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-6">
        {roadmap.map((milestone, index) => (
          <div key={index} className="relative">
            {/* Timeline connector */}
            {index < roadmap.length - 1 && (
              <div className="absolute left-7 top-24 bottom-0 w-0.5 bg-border" />
            )}

            <div className="relative flex gap-6">
              {/* Timeline dot */}
              <div className="flex-shrink-0">
                {milestone.status === 'in-progress' ? (
                  <div className="w-14 h-14 rounded-full bg-primary/20 border-4 border-primary flex items-center justify-center relative z-10">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  </div>
                ) : milestone.status === 'completed' ? (
                  <div className="w-14 h-14 rounded-full bg-primary/20 border-4 border-primary flex items-center justify-center z-10">
                    <CheckCircle2 className="w-7 h-7 text-primary" />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-full bg-muted/30 border-4 border-border flex items-center justify-center z-10">
                    <Circle className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-8">
                <div
                  className={`p-6 rounded-lg border transition-colors ${
                    milestone.status === 'in-progress'
                      ? 'bg-primary/5 border-primary/30'
                      : milestone.status === 'completed'
                        ? 'bg-primary/5 border-primary/30'
                        : 'bg-card border-border'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        {milestone.week}
                      </p>
                      <h3 className="text-2xl font-bold text-foreground">{milestone.title}</h3>
                    </div>
                    {milestone.status === 'in-progress' && (
                      <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                        In Progress
                      </span>
                    )}
                  </div>

                  <p className="text-muted-foreground mb-4">{milestone.description}</p>

                  <div className="mb-4">
                    <p className="text-sm font-semibold text-foreground mb-2">Learning Resources</p>
                    <ul className="space-y-1">
                      {milestone.resources.map((resource) => (
                        <li key={resource} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                          {resource}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <span className="text-xs font-semibold text-muted-foreground">
                      {milestone.hours} hours estimated
                    </span>
                    {milestone.status === 'in-progress' && (
                      <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                        <Link href="#">Continue Learning</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-8">
        <h3 className="text-2xl font-bold text-foreground mb-4">Ready to level up?</h3>
        <p className="text-muted-foreground mb-6">
          Your personalized roadmap is designed to get you match-ready for your target role. Start with Week 1 to begin your journey.
        </p>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2">
          <Link href="/career-twin">
            View Career Twin
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
