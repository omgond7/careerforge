'use client';

import React from 'react';
import { Mic, MessageSquare, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface InterviewCardProps {
  title: string;
  company: string;
  type: 'voice' | 'text' | 'live';
  description?: string;
  topic?: string;
  difficulty?: string;
  estimatedTime?: number;
  onStart?: () => void;
  className?: string;
}

export function InterviewCard({
  title,
  company,
  type,
  description,
  topic,
  difficulty,
  estimatedTime,
  onStart,
  className = '',
}: InterviewCardProps) {
  const typeConfig = {
    voice: {
      icon: Mic,
      label: 'Voice Interview',
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    },
    text: {
      icon: MessageSquare,
      label: 'Text Chat',
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    },
    live: {
      icon: Zap,
      label: 'Live Coding',
      color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    },
  };

  const config = typeConfig[type];
  const TypeIcon = config.icon;

  const difficultyConfig = {
    easy: 'text-green-600 dark:text-green-400',
    medium: 'text-amber-600 dark:text-amber-400',
    hard: 'text-red-600 dark:text-red-400',
  };

  return (
    <div className={`rounded-lg border border-border bg-card p-6 ${className}`}>
      <div className="flex items-start gap-4">
        <div className={`rounded-lg ${config.color} p-3`}>
          <TypeIcon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{company}</p>

          {description && (
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Badge className={`${config.color} font-medium`}>{config.label}</Badge>

            {topic && (
              <Badge variant="outline" className="text-xs">
                {topic}
              </Badge>
            )}

            {difficulty && (
              <span className={`text-xs font-medium ${difficultyConfig[difficulty as keyof typeof difficultyConfig] || 'text-muted-foreground'}`}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </span>
            )}

            {estimatedTime && (
              <span className="text-xs text-muted-foreground">
                ~{estimatedTime} min
              </span>
            )}
          </div>
        </div>
      </div>

      {onStart && (
        <button
          onClick={onStart}
          className="mt-4 w-full rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90"
        >
          Start Interview
        </button>
      )}
    </div>
  );
}
