'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  icon?: React.ReactNode;
  className?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  className = '',
}: MetricCardProps) {
  return (
    <div className={`rounded-lg border border-border bg-card p-6 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {icon && <div className="ml-4 flex-shrink-0">{icon}</div>}
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-1">
          {trend.direction === 'up' ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          <span
            className={`text-sm font-medium ${
              trend.direction === 'up' ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {trend.direction === 'up' ? '+' : '-'}
            {Math.abs(trend.value)}%
          </span>
        </div>
      )}
    </div>
  );
}
