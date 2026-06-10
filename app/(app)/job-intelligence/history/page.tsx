'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search, Filter, MoreVertical } from 'lucide-react';
import { jobAnalysisHistory } from '@/lib/mock-data';
import { MatchScoreCard, MetricCard } from '@/components/cards';
import { useState } from 'react';

export default function JobAnalysisHistory() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'this-month' | 'this-quarter'>('all');
  
  const filteredHistory = selectedFilter === 'all' ? jobAnalysisHistory : jobAnalysisHistory.slice(0, 2);
  const averageMatch = Math.round(jobAnalysisHistory.reduce((sum, job) => sum + job.matchScore, 0) / jobAnalysisHistory.length);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Analysis History</h1>
          <p className="text-muted-foreground">View all your job analysis records and insights.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Total Analyses"
            value={jobAnalysisHistory.length}
            subtitle={`${jobAnalysisHistory.filter(j => new Date(j.analysisDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length} this month`}
          />
          <MetricCard
            title="Average Match Score"
            value={`${averageMatch}%`}
            subtitle="Across all analyzed roles"
          />
          <MetricCard
            title="Key Gaps Identified"
            value={jobAnalysisHistory.reduce((acc, job) => acc + job.keyGaps.length, 0)}
            subtitle="Across all analyses"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search job titles, companies..."
              className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'this-month', 'this-quarter'] as const).map((filter) => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter(filter)}
                className="capitalize"
              >
                {filter.replace('-', ' ')}
              </Button>
            ))}
          </div>
        </div>

        {/* Analysis List */}
        <div className="space-y-4">
          {filteredHistory.map((analysis) => (
            <Link
              key={analysis.id}
              href={`/job-intelligence/${analysis.id}`}
              className="block"
            >
              <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-1">{analysis.jobTitle}</h3>
                    <p className="text-muted-foreground mb-3">
                      {analysis.company} • {analysis.location}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {analysis.keyGaps.map((gap) => (
                        <span
                          key={gap}
                          className="px-2.5 py-1 bg-destructive/10 text-destructive rounded text-xs font-medium"
                        >
                          {gap}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Analyzed on {new Date(analysis.analysisDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{analysis.matchScore}%</p>
                      <p className="text-sm text-muted-foreground">Match</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredHistory.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No analyses found for this period.</p>
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/job-intelligence">Analyze a Job</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
