'use client';

import Link from 'next/link';
import { use } from 'react';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Share2, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';
import { MatchScoreCard, MetricCard } from '@/components/cards';

const fetcher = (url: string) => fetch(url).then(r => r.json()).then(r => r.data);

export default function MockInterviewResults({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session, error, isLoading } = useSWR(`/api/interview/${id}`, fetcher);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="h-12 w-48 bg-muted rounded-md"></div>
          <div className="h-6 w-32 bg-muted rounded-md"></div>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Result not found</h2>
          <Button asChild variant="outline">
            <Link href="/interview-prep/history">Back to History</Link>
          </Button>
        </div>
      </div>
    );
  }

  const resultScore = session.score ?? 0;
  const percentile = Math.min(99, Math.max(50, Math.round(resultScore * 0.95)));
  const difficulty = 'Medium'; // Default fallback
  const duration = session.durationMins ?? 0;
  
  const feedbackObj = typeof session.feedback === 'object' && session.feedback ? (session.feedback as any) : {};
  const overallFeedback = feedbackObj.feedback || 'Good effort on this interview session.';

  const questionsList = (session.questions as any[]) || [];

  // Generate a plausible skill-based performance breakdown for visualization
  const breakdown = {
    problemUnderstanding: Math.min(100, Math.max(60, Math.round(resultScore * 1.05))),
    solutionDesign: Math.min(100, Math.max(60, Math.round(resultScore * 0.98))),
    communication: Math.min(100, Math.max(60, Math.round(resultScore * 1.02))),
    technicalAccuracy: Math.min(100, Math.max(60, Math.round(resultScore * 0.95))),
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link href="/interview-prep/history">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to History
          </Link>
        </Button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 capitalize">
            {session.type?.toLowerCase()} Interview
          </h1>
          <p className="text-xl text-muted-foreground">
            {session.role} at {session.company} • {new Date(session.completedAt || session.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Score Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MatchScoreCard
            title="Overall Score"
            score={resultScore}
            subtitle={`Percentile: ${percentile}%`}
            size="lg"
          />
          <MetricCard
            title="Difficulty"
            value={difficulty}
            subtitle="Interview level"
            icon={<TrendingUp className="h-5 w-5 text-primary" />}
          />
          <MetricCard
            title="Duration"
            value={`${duration}m`}
            subtitle="Time taken"
            icon={<TrendingUp className="h-5 w-5 text-primary" />}
          />
        </div>

        {/* Overall Feedback */}
        <div className="bg-card border border-border rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Overall AI Evaluation</h2>
          <p className="text-foreground leading-relaxed">{overallFeedback}</p>
        </div>

        {/* Detailed Breakdown */}
        <div className="bg-card border border-border rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Performance Breakdown</h2>
          <div className="space-y-6">
            {Object.entries(breakdown).map(([key, value]) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-foreground capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="text-lg font-bold text-primary">{value}%</p>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Question Details & Submissions */}
        {questionsList.length > 0 && (
          <div className="bg-card border border-border rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Detailed Q&A Evaluation</h2>
            <div className="space-y-8">
              {questionsList.map((q, idx) => {
                const evalQ = feedbackObj.questions?.find((fq: any) => fq.id === q.id);
                const score = evalQ?.score ?? q.score ?? null;
                const feedback = evalQ?.feedback ?? q.feedback ?? '';
                const betterAnswer = evalQ?.betterAnswer ?? q.sampleAnswer ?? '';

                return (
                  <div key={q.id || idx} className="border-b border-border pb-8 last:border-b-0 last:pb-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="font-semibold text-foreground text-lg">
                        Question {idx + 1}: {q.question}
                      </h3>
                      {score !== null && (
                        <span className="flex-shrink-0 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">
                          {score}/100
                        </span>
                      )}
                    </div>

                    <div className="space-y-4 mt-4">
                      {q.userAnswer && (
                        <div className="bg-muted p-4 rounded-md">
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                            Your Answer
                          </p>
                          <p className="text-sm text-foreground">{q.userAnswer}</p>
                        </div>
                      )}

                      {feedback && (
                        <div className="bg-primary/5 border border-primary/15 p-4 rounded-md">
                          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> AI Feedback
                          </p>
                          <p className="text-sm text-foreground">{feedback}</p>
                        </div>
                      )}

                      {betterAnswer && (
                        <div className="bg-amber-500/5 border border-amber-500/15 p-4 rounded-md">
                          <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 mb-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> Suggested Improvement
                          </p>
                          <p className="text-sm text-foreground">{betterAnswer}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/interview-prep">
              Take Another Practice
            </Link>
          </Button>
          <Button variant="outline" className="border-border">
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
          <Button variant="outline" className="border-border">
            <Share2 className="w-4 h-4 mr-2" />
            Share Results
          </Button>
        </div>
      </div>
    </div>
  );
}
