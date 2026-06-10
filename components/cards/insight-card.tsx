'use client';

import React from 'react';
import { AlertCircle, Lightbulb } from 'lucide-react';

interface InsightCardProps {
  title: string;
  description: string;
  type?: 'insight' | 'warning' | 'tip';
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function InsightCard({
  title,
  description,
  type = 'insight',
  actionLabel,
  onAction,
  icon,
  className = '',
}: InsightCardProps) {
  const bgColor = {
    insight: 'bg-blue-50 dark:bg-blue-950/30',
    warning: 'bg-red-50 dark:bg-red-950/30',
    tip: 'bg-amber-50 dark:bg-amber-950/30',
  };

  const borderColor = {
    insight: 'border-blue-200 dark:border-blue-800',
    warning: 'border-red-200 dark:border-red-800',
    tip: 'border-amber-200 dark:border-amber-800',
  };

  const iconColor = {
    insight: 'text-blue-600 dark:text-blue-400',
    warning: 'text-red-600 dark:text-red-400',
    tip: 'text-amber-600 dark:text-amber-400',
  };

  return (
    <div
      className={`rounded-lg border ${borderColor[type]} ${bgColor[type]} p-4 ${className}`}
    >
      <div className="flex gap-3">
        <div className={`mt-0.5 flex-shrink-0 ${iconColor[type]}`}>
          {icon || (type === 'warning' ? <AlertCircle className="h-5 w-5" /> : <Lightbulb className="h-5 w-5" />)}
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-foreground">{title}</h4>
          <p className="mt-1 text-sm text-foreground/80">{description}</p>
          {actionLabel && (
            <button
              onClick={onAction}
              className="mt-3 inline-flex text-sm font-medium text-primary hover:underline"
            >
              {actionLabel} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
