'use client';

import React from 'react';
import { Calendar, Phone, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ApplicationCardProps {
  company: string;
  position: string;
  logo?: string;
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected';
  appliedDate?: string;
  nextAction?: string;
  nextActionDate?: string;
  matchScore?: number;
  onUpdateStatus?: () => void;
  onViewDetails?: () => void;
  className?: string;
}

export function ApplicationCard({
  company,
  position,
  logo,
  status,
  appliedDate,
  nextAction,
  nextActionDate,
  matchScore,
  onUpdateStatus,
  onViewDetails,
  className = '',
}: ApplicationCardProps) {
  const statusConfig = {
    applied: { label: 'Applied', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    screening: { label: 'Screening', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
    interview: { label: 'Interview', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' },
    offer: { label: 'Offer', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
  };

  const config = statusConfig[status];

  return (
    <div className={`rounded-lg border border-border bg-card p-4 ${className}`}>
      <div className="flex items-start gap-4">
        {logo && <img src={logo} alt={company} className="h-10 w-10 rounded" />}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{company}</p>
              <h4 className="font-semibold text-foreground">{position}</h4>
            </div>
            <Badge className={`${config.color} font-medium`}>{config.label}</Badge>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-4">
            {appliedDate && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Applied: {appliedDate}
              </div>
            )}
            {matchScore !== undefined && (
              <div className="text-xs font-medium text-foreground">{matchScore}% Match</div>
            )}
          </div>

          {nextAction && (
            <div className="mt-2 flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs font-medium text-foreground">{nextAction}</p>
                {nextActionDate && (
                  <p className="text-xs text-muted-foreground">{nextActionDate}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {(onUpdateStatus || onViewDetails) && (
        <div className="mt-4 flex gap-2 border-t border-border pt-4">
          {onViewDetails && (
            <button
              onClick={onViewDetails}
              className="flex-1 rounded-lg border border-border bg-transparent px-3 py-2 text-xs font-medium text-foreground hover:bg-muted"
            >
              <FileText className="mr-1 inline-block h-3 w-3" />
              View Details
            </button>
          )}
          {onUpdateStatus && (
            <button
              onClick={onUpdateStatus}
              className="flex-1 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            >
              Update Status
            </button>
          )}
        </div>
      )}
    </div>
  );
}
