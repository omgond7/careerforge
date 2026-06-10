'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { JobCard } from '@/components/cards';
import { ArrowLeft, Bookmark, Search } from 'lucide-react';
import { jobAnalysisHistory } from '@/lib/mock-data';

export default function SavedJobsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter jobs to simulate "saved" jobs (e.g. Stripe and Vercel)
  const savedJobs = jobAnalysisHistory.filter(job => 
    job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Back Button */}
      <Button asChild variant="ghost" size="sm">
        <Link href="/job-intelligence">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Job Intelligence
        </Link>
      </Button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
            <Bookmark className="w-8 h-8 text-primary" />
            Saved Jobs
          </h1>
          <p className="text-lg text-muted-foreground mt-1">
            Bookmarked positions you are tracking or preparing to apply for.
          </p>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter saved jobs by title or company..."
          className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Job Cards Grid */}
      {savedJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedJobs.map((job) => (
            <JobCard
              key={job.id}
              title={job.jobTitle}
              company={job.company}
              location={job.location}
              salaryRange={{
                min: parseInt(job.salary.split('-')[0].replace(/[^0-9]/g, '')),
                max: parseInt(job.salary.split('-')[1].replace(/[^0-9]/g, '')),
              }}
              matchScore={job.matchScore}
              matchLevel="Highly Aligned"
              skills={job.keyGaps}
              onAnalyze={() => alert('Launching deep AI gap evaluation...')}
              onViewDetails={() => alert(`Redirecting to details for analysis #${job.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card border border-border rounded-lg p-6">
          <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
          <h3 className="text-lg font-semibold text-foreground">No saved jobs found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
            Go back to search and click the bookmark icon on jobs to track them here.
          </p>
          <Button asChild className="mt-4">
            <Link href="/job-intelligence">Explore Jobs</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
