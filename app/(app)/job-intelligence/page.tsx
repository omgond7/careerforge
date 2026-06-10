'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Filter, Sparkles, TrendingUp } from 'lucide-react';
import { JobCard } from '@/components/cards';

const mockJobs = [
  {
    id: 1,
    title: 'Senior Product Designer',
    company: 'Acme Corp',
    location: 'Remote (US)',
    salary: '$140k - $180k',
    match: 98,
    status: 'Highly Aligned' as const,
    skills: ['Figma', 'Design Systems', 'UX Research'],
  },
  {
    id: 2,
    title: 'Lead UX Designer',
    company: 'TechFlow',
    location: 'Hybrid (SF)',
    salary: '$160k - $200k',
    match: 85,
    status: 'Missing: Team Lead exp' as const,
    skills: ['Design Leadership', 'User Research', 'Management'],
  },
];

export default function JobIntelligencePage() {
  const [searchTerm, setSearchTerm] = useState('Senior Product Designer');
  const [location, setLocation] = useState('Remote');
  const [expanded, setExpanded] = useState<number | null>(null);

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
        Showing 24 matches based on your Twin
      </div>

      {/* Job Cards */}
      <div className="space-y-4">
        {mockJobs.map((job) => (
          <JobCard
            key={job.id}
            title={job.title}
            company={job.company}
            location={job.location}
            salaryRange={{
              min: parseInt(job.salary.split('$')[1].split('k')[0]),
              max: parseInt(job.salary.split('$')[2].split('k')[0]),
            }}
            matchScore={job.match}
            matchLevel={job.status}
            skills={job.skills}
            onAnalyze={() => alert('Analyzing with AI...')}
            onViewDetails={() => setExpanded(expanded === job.id ? null : job.id)}
          />
        ))}
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
