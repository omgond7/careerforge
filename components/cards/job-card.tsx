'use client';

import React from 'react';
import { MapPin, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface JobCardProps {
  company: string;
  logo?: string;
  title: string;
  location?: string;
  salaryRange?: {
    min: number;
    max: number;
  };
  matchScore?: number;
  matchLevel?: 'Highly Aligned' | 'Missing: Team Lead exp';
  skills?: string[];
  description?: string;
  onAnalyze?: () => void;
  onViewDetails?: () => void;
  className?: string;
}

export function JobCard({
  company,
  logo,
  title,
  location,
  salaryRange,
  matchScore,
  matchLevel,
  skills = [],
  description,
  onAnalyze,
  onViewDetails,
  className = '',
}: JobCardProps) {
  return (
    <div className={`rounded-lg border border-border bg-card p-6 ${className}`}>
      <div className="flex items-start gap-4">
        {logo && <img src={logo} alt={company} className="h-12 w-12 rounded" />}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{company}</p>
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            </div>
            {matchScore !== undefined && (
              <div className="flex flex-col items-end gap-1">
                <Badge variant="default" className="font-bold">
                  {matchScore}% Match
                </Badge>
                {matchLevel && (
                  <span className="text-xs font-medium text-muted-foreground">{matchLevel}</span>
                )}
              </div>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            {location && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {location}
              </div>
            )}
            {salaryRange && (
              <div className="text-sm font-medium text-foreground">
                ${salaryRange.min}k - ${salaryRange.max}k
              </div>
            )}
          </div>

          {description && <p className="mt-3 text-sm text-muted-foreground">{description}</p>}

          {skills.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {skills.slice(0, 3).map((skill, idx) => (
                <Badge key={idx} variant="secondary">
                  {skill}
                </Badge>
              ))}
              {skills.length > 3 && (
                <Badge variant="outline">+{skills.length - 3} more</Badge>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex gap-2 border-t border-border pt-4">
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="flex-1 rounded-lg border border-border bg-transparent px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            View Details
          </button>
        )}
        {onAnalyze && (
          <button
            onClick={onAnalyze}
            className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Zap className="mr-2 inline-block h-4 w-4" />
            Analyze with AI
          </button>
        )}
      </div>
    </div>
  );
}
