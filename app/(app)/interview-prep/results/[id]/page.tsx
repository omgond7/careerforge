'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Share2, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';
import { mockInterviewResult } from '@/lib/mock-data';
import { MatchScoreCard, MetricCard } from '@/components/cards';

export default function MockInterviewResults({ params }: { params: { id: string } }) {
  const result = mockInterviewResult;

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
          <h1 className="text-4xl font-bold text-foreground mb-2">{result.type} Interview</h1>
          <p className="text-xl text-muted-foreground">{new Date(result.date).toLocaleDateString()}</p>
        </div>

        {/* Score Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MatchScoreCard
            title="Overall Score"
            score={result.score}
            subtitle={`Percentile: ${result.percentile}%`}
            size="lg"
          />
          <MetricCard
            title="Difficulty"
            value={result.difficulty}
            subtitle="Interview level"
            icon={<TrendingUp className="h-5 w-5 text-primary" />}
          />
          <MetricCard
            title="Duration"
            value={`${result.duration}m`}
            subtitle="Time taken"
            icon={<TrendingUp className="h-5 w-5 text-primary" />}
          />
        </div>

        {/* Detailed Breakdown */}
        <div className="bg-card border border-border rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Performance Breakdown</h2>
          <div className="space-y-6">
            {Object.entries(result.breakdown).map(([key, value]) => (
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

        {/* Question Details */}
        <div className="bg-card border border-border rounded-lg p-8 mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Question</h2>
          <p className="text-foreground leading-relaxed mb-6">{result.question}</p>
        </div>

        {/* Feedback */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Strengths */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              Strengths
            </h3>
            <ul className="space-y-2">
              {result.feedback.map((item, idx) => (
                <li key={idx} className="flex gap-2 items-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              Areas to Improve
            </h3>
            <ul className="space-y-2">
              {result.improvements.map((item, idx) => (
                <li key={idx} className="flex gap-2 items-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-amber-600 mt-1.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

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
