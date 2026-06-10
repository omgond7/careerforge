'use client';

import { useCareerStore } from '@/lib/stores/career';
import { Button } from '@/components/ui/button';
import { Mic2, MessageSquare, TrendingUp, BookOpen, Zap } from 'lucide-react';
import Link from 'next/link';
import { InterviewCard, MatchScoreCard, MetricCard } from '@/components/cards';

export default function InterviewPrepPage() {
  const { targetRole } = useCareerStore();

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Interview Prep</h1>
        <p className="text-lg text-muted-foreground">
          Practice with AI trained on actual {targetRole?.company} interview formats
        </p>
      </div>

      {/* Prep Readiness */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Prep Readiness</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { skill: 'Technical Concepts', score: 65 },
            { skill: 'Behavioral (STAR)', score: 40 },
            { skill: 'System Design', score: 20 },
            { skill: 'Live Coding', score: 85 },
          ].map(({ skill, score }) => (
            <MatchScoreCard
              key={skill}
              title={skill}
              score={score}
              size="sm"
            />
          ))}
        </div>
      </div>

      {/* Interview Simulation */}
      <div className="bg-gradient-to-br from-primary to-accent rounded-lg p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-6 h-6" />
          <h3 className="text-2xl font-bold">Start Stripe Loop Simulation</h3>
        </div>
        <p className="mb-6 text-white/80">
          Practice with an AI trained on actual Stripe interview formats. Get real-time feedback on your technical communication and code quality.
        </p>
        <div className="flex gap-3">
          <Button className="bg-white text-primary hover:bg-white/90 flex items-center gap-2">
            <Mic2 className="w-4 h-4" />
            Voice Interview
          </Button>
          <Button className="border-white/30 text-white hover:bg-white/10 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Text Chat
          </Button>
        </div>
      </div>

      {/* Learning Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company Intel */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Stripe Intel
          </h4>
          <div className="space-y-3">
            {[
              {
                title: 'Core Values Focus',
                items: ['Users First', 'Rigorous Thinking', 'Move with Urgency'],
              },
              {
                title: 'Technical Focus',
                items: ['API-First Design', 'Real-time Processing', 'Trust and Amplification'],
              },
            ].map(({ title, items }) => (
              <div key={title}>
                <p className="font-medium text-foreground mb-2">{title}</p>
                <ul className="space-y-1">
                  {items.map((item) => (
                    <li
                      key={item}
                      className="text-sm text-muted-foreground flex items-center gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Interview History */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h4 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Recent Feedback Report
          </h4>
          <div className="space-y-4">
            {[
              { category: 'Communication', score: 82 },
              { category: 'Technical', score: 74 },
              { category: 'Problem Solving', score: 68 },
            ].map(({ category, score }) => (
              <MetricCard
                key={category}
                title={category}
                value={`${score}%`}
              />
            ))}
          </div>
          <Button asChild className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="#">View Full Report</Link>
          </Button>
        </div>
      </div>

      {/* Topic Guides */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Interview Topics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            'Technical & System Design',
            'Behavioral (STAR)',
            'Live Coding',
            'API Design',
            'Database Architecture',
            'React Performance',
          ].map((topic) => (
            <Link
              key={topic}
              href="#"
              className="p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <p className="font-medium text-foreground mb-2">{topic}</p>
              <p className="text-xs text-muted-foreground">5 study materials</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
