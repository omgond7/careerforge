'use client';

import React from 'react';
import { AlertCircle, Check } from 'lucide-react';

interface ATSScoreCardProps {
  score: number;
  maxScore?: number;
  missingKeywords?: string[];
  onOptimize?: () => void;
  className?: string;
}

export function ATSScoreCard({
  score,
  maxScore = 100,
  missingKeywords = [],
  onOptimize,
  className = '',
}: ATSScoreCardProps) {
  const percentage = (score / maxScore) * 100;

  return (
    <div className={`rounded-lg border border-border bg-card p-6 ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">ATS Score</h3>
          <p className="mt-1 text-sm text-muted-foreground">Score updates in real-time as you optimize.</p>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-4xl font-bold text-foreground">{score}</span>
            <span className="text-sm text-muted-foreground">/{maxScore}</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {missingKeywords.length > 0 && (
        <div className="mt-6 border-t border-border pt-4">
          <h4 className="flex items-center gap-2 font-medium text-foreground">
            <AlertCircle className="h-4 w-4 text-red-500" />
            Missing Keywords
          </h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {missingKeywords.map((keyword, idx) => (
              <span
                key={idx}
                className="rounded-full bg-red-100/20 px-3 py-1 text-sm font-medium text-red-600 dark:text-red-400"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {onOptimize && (
        <button
          onClick={onOptimize}
          className="mt-4 w-full rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90"
        >
          Optimize for ATS
        </button>
      )}
    </div>
  );
}
