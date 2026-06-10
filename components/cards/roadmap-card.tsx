'use client';

import React from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RoadmapTaskProps {
  icon?: React.ReactNode;
  label: string;
  description?: string;
  href?: string;
}

interface RoadmapCardProps {
  week: number;
  title: string;
  status: 'completed' | 'in-progress' | 'not-started';
  estimatedHours?: number;
  skills?: string[];
  gap?: string;
  tasks?: RoadmapTaskProps[];
  resources?: string[];
  onViewDetails?: () => void;
  onStartLearning?: () => void;
  className?: string;
}

export function RoadmapCard({
  week,
  title,
  status,
  estimatedHours,
  skills = [],
  gap,
  tasks = [],
  resources = [],
  onViewDetails,
  onStartLearning,
  className = '',
}: RoadmapCardProps) {
  const statusConfig = {
    completed: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950/30' },
    'in-progress': { icon: Circle, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
    'not-started': { icon: Circle, color: 'text-muted-foreground', bg: 'bg-muted' },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div className={`rounded-lg border border-border ${config.bg} p-6 ${className}`}>
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 ${config.color}`}>
          <StatusIcon className="h-6 w-6" />
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Week {week}: {title}
              </h3>
              {gap && (
                <p className="mt-1 text-sm font-medium text-muted-foreground">
                  Gap: {gap}
                </p>
              )}
            </div>
            <Badge variant={status === 'completed' ? 'default' : 'secondary'} className="uppercase">
              {status === 'in-progress' ? 'IN PROGRESS' : status === 'completed' ? 'COMPLETED' : 'NOT STARTED'}
            </Badge>
          </div>

          {estimatedHours && (
            <div className="mt-3 flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {estimatedHours} hours
            </div>
          )}

          {resources.length > 0 && (
            <div className="mt-4 border-t border-border/50 pt-4">
              <p className="text-sm font-medium text-foreground">Resources</p>
              <ul className="mt-2 space-y-1">
                {resources.map((resource, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground">
                    • {resource}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tasks.length > 0 && (
            <div className="mt-4 border-t border-border/50 pt-4">
              <p className="text-sm font-medium text-foreground">Tasks</p>
              <ul className="mt-2 space-y-1">
                {tasks.map((task, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground">
                    • {task.label}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {skills.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {(onViewDetails || onStartLearning) && (
        <div className="mt-4 flex gap-2 border-t border-border/50 pt-4">
          {onViewDetails && (
            <button
              onClick={onViewDetails}
              className="flex-1 rounded-lg border border-border bg-transparent px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              View Brief
            </button>
          )}
          {onStartLearning && (
            <button
              onClick={onStartLearning}
              className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Continue Learning
            </button>
          )}
        </div>
      )}
    </div>
  );
}
