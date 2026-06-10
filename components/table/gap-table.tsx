'use client';

import React from 'react';
import { AlertCircle, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface GapTableRow {
  type: string;
  requirement: string;
  yourStatus: string;
  severity: 'high' | 'medium' | 'low';
  actionPlan: string;
}

interface GapTableProps {
  rows: GapTableRow[];
  title?: string;
  className?: string;
}

export function GapTable({
  rows,
  title,
  className = '',
}: GapTableProps) {
  const severityConfig = {
    high: {
      icon: AlertCircle,
      color: 'text-red-600 dark:text-red-400',
      badge: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      label: 'HIGH',
    },
    medium: {
      icon: AlertTriangle,
      color: 'text-amber-600 dark:text-amber-400',
      badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
      label: 'MEDIUM',
    },
    low: {
      icon: AlertTriangle,
      color: 'text-green-600 dark:text-green-400',
      badge: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      label: 'LOW',
    },
  };

  return (
    <div className={`rounded-lg border border-border bg-card ${className}`}>
      {title && (
        <div className="border-b border-border px-6 py-4">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted">
              <th className="px-6 py-3 text-left font-semibold text-foreground">Type</th>
              <th className="px-6 py-3 text-left font-semibold text-foreground">Requirement</th>
              <th className="px-6 py-3 text-left font-semibold text-foreground">Your Status</th>
              <th className="px-6 py-3 text-left font-semibold text-foreground">Severity</th>
              <th className="px-6 py-3 text-left font-semibold text-foreground">Action Plan</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const config = severityConfig[row.severity];
              const SeverityIcon = config.icon;

              return (
                <tr
                  key={idx}
                  className="border-b border-border last:border-b-0 hover:bg-muted/50"
                >
                  <td className="px-6 py-4 text-foreground">{row.type}</td>
                  <td className="px-6 py-4 text-foreground">{row.requirement}</td>
                  <td className="px-6 py-4 text-muted-foreground">{row.yourStatus}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <SeverityIcon className={`h-4 w-4 ${config.color}`} />
                      <Badge className={`${config.badge} text-xs font-semibold`}>
                        {config.label}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{row.actionPlan}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
