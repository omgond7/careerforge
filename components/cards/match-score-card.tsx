'use client';

import React from 'react';

interface MatchScoreCardProps {
  title: string;
  score: number;
  description?: string;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function MatchScoreCard({
  title,
  score,
  description,
  subtitle,
  size = 'md',
  className = '',
}: MatchScoreCardProps) {
  const sizeConfig = {
    sm: { circle: 'h-20 w-20', text: 'text-2xl' },
    md: { circle: 'h-32 w-32', text: 'text-5xl' },
    lg: { circle: 'h-40 w-40', text: 'text-6xl' },
  };

  const config = sizeConfig[size];
  const circumference = 2 * Math.PI * (size === 'sm' ? 32 : size === 'md' ? 51 : 63);
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={`rounded-lg border border-border bg-card p-8 ${className}`}>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      
      <div className="mt-6 flex flex-col items-center gap-4">
        <div className="relative">
          <svg className={`${config.circle} -rotate-90 transform`}>
            <circle
              cx="50%"
              cy="50%"
              r={size === 'sm' ? '32' : size === 'md' ? '51' : '63'}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-muted"
            />
            <circle
              cx="50%"
              cy="50%"
              r={size === 'sm' ? '32' : size === 'md' ? '51' : '63'}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="text-primary transition-all duration-300"
            />
          </svg>
          <div className={`${config.circle} absolute inset-0 flex items-center justify-center`}>
            <div className="text-center">
              <p className={`${config.text} font-bold text-foreground`}>{score}%</p>
            </div>
          </div>
        </div>

        {subtitle && <p className="text-sm font-medium text-muted-foreground">{subtitle}</p>}
        {description && <p className="mt-2 max-w-xs text-center text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}
