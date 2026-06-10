'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { interviewSessionData } from '@/lib/mock-data';
import { ArrowRight, TrendingUp, Calendar, Clock, Award } from 'lucide-react';
import { MetricCard, MatchScoreCard } from '@/components/cards';

export default function InterviewSessionHistory() {
  const averageScore = Math.round(
    interviewSessionData.reduce((sum, session) => sum + session.score, 0) / interviewSessionData.length
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Interview Session History</h1>
          <p className="text-muted-foreground">Review all your interview practice sessions and progress.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Sessions"
            value={interviewSessionData.length}
            subtitle="Practice interviews completed"
            icon={<Award className="h-5 w-5 text-primary" />}
          />
          <MatchScoreCard
            title="Average Score"
            score={averageScore}
            size="sm"
          />
          <MetricCard
            title="Total Hours"
            value={(interviewSessionData.reduce((sum, s) => sum + s.duration, 0) / 60).toFixed(1)}
            subtitle="Practice time invested"
            icon={<Clock className="h-5 w-5 text-primary" />}
          />
          <MetricCard
            title="Improvement"
            value="+12%"
            subtitle="Last month"
            icon={<TrendingUp className="h-5 w-5 text-primary" />}
          />
        </div>

        {/* Sessions List */}
        <div className="space-y-4">
          {interviewSessionData.map((session) => (
            <Link
              key={session.id}
              href={`/interview-prep/session/${session.id}`}
              className="block"
            >
              <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{session.type}</h3>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          session.difficulty === 'Hard'
                            ? 'bg-destructive/10 text-destructive'
                            : session.difficulty === 'Medium'
                            ? 'bg-amber-500/10 text-amber-600'
                            : 'bg-primary/10 text-primary'
                        }`}
                      >
                        {session.difficulty}
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-3">{session.company}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {session.topics.map((topic) => (
                        <span
                          key={topic}
                          className="px-2.5 py-1 bg-muted rounded text-xs font-medium text-foreground"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      {new Date(session.date).toLocaleDateString()} • {session.duration} minutes
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{session.score}</p>
                      <p className="text-sm text-muted-foreground">Score</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>

                {/* Feedback snippet */}
                <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground line-clamp-2">{session.feedback}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold text-foreground mb-2">Ready for Another Practice Session?</h3>
          <p className="text-muted-foreground mb-6">
            Take another mock interview to practice and improve your skills.
          </p>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/interview-prep">
              Start New Session
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
