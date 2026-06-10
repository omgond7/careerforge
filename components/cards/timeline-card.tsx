'use client';

import React from 'react';

interface TimelineTaskProps {
  label: string;
  duration: string;
  color?: string;
  completed?: boolean;
}

interface TimelineCardProps {
  objective: string;
  month?: number;
  tasks: TimelineTaskProps[];
  className?: string;
}

export function TimelineCard({
  objective,
  month,
  tasks,
  className = '',
}: TimelineCardProps) {
  return (
    <div className={`rounded-lg border border-border bg-card p-6 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-foreground">{objective}</h3>
        {month && (
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            Month {month}
          </span>
        )}
      </div>

      <div className="space-y-3">
        {tasks.map((task, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div
              className={`h-3 w-full rounded-full ${
                task.color || 'bg-primary'
              }`}
              style={{
                opacity: task.completed ? 0.5 : 1,
              }}
            />
            <span className="whitespace-nowrap text-xs font-medium text-muted-foreground">
              {task.duration}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
