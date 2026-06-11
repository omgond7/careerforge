'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Filter, Sparkles, TrendingUp } from 'lucide-react';
import { JobCard } from '@/components/cards';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';

const fetcher = (url: string) => fetch(url).then(r => r.json()).then(r => r.data);

const parseSalaryRange = (salaryStr: string | null | undefined) => {
  if (!salaryStr) return undefined;
  try {
    const parts = salaryStr.split('-');
    if (parts.length === 2) {
      const minVal = parseInt(parts[0].replace(/[^0-9]/g, ''));
      const maxVal = parseInt(parts[1].replace(/[^0-9]/g, ''));
      if (!isNaN(minVal) && !isNaN(maxVal)) {
        return { min: minVal, max: maxVal };
      }
    }
  } catch {}
  return undefined;
};

export default function JobIntelligencePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('Senior Product Designer');
  const [location, setLocation] = useState('Remote');
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data: jobsResponse, isLoading, mutate } = useSWR('/api/jobs', fetcher);
  const jobs = jobsResponse?.jobs || [];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Job Intelligence</h1>
        <p className="text-lg text-muted-foreground">
          Find and analyze job opportunities tailored to your career twin.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Senior Product Designer"
                className="w-full pl-12 pr-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="relative">
              <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Remote"
                className="w-full pl-12 pr-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Search
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['Remote Only', 'Salary Range', 'Experience Level', 'Date Posted'].map((filter) => (
            <button
              key={filter}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors whitespace-nowrap"
            >
              <Filter className="w-4 h-4" />
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Results Info */}
      <div className="text-sm text-muted-foreground">
        Showing {jobs.length} matches based on your Twin
      </div>

      {/* Job Cards */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading opportunities...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No jobs analyzed yet. Add some to get started!</div>
        ) : (
          jobs.map((job: any) => (
            <JobCard
              key={job.id}
              title={job.jobTitle}
              company={job.company}
              location={job.location || 'Unknown'}
              salaryRange={parseSalaryRange(job.salary)}
              matchScore={job.matchScore || 0}
              matchLevel={job.matchLevel || undefined}
              skills={(job.parsedDetails as any)?.requiredSkills || []}
              onAnalyze={() => router.push(`/job-intelligence/${job.id}`)}
              onViewDetails={() => router.push(`/job-intelligence/${job.id}`)}
            />
          ))
        )}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" className="px-8">
          Load More Jobs
        </Button>
      </div>
    </div>
  );
}
