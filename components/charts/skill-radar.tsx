'use client';

import React from 'react';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from 'recharts';

interface SkillData {
  category: string;
  value: number;
  fullMark: number;
}

interface SkillRadarProps {
  data: SkillData[];
  title?: string;
  height?: number;
  className?: string;
}

export function SkillRadar({
  data,
  title,
  height = 300,
  className = '',
}: SkillRadarProps) {
  return (
    <div className={`rounded-lg border border-border bg-card p-6 ${className}`}>
      {title && <h3 className="mb-6 text-lg font-semibold text-foreground">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <PolarGrid stroke="currentColor" className="text-muted" />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fontSize: 12 }}
            className="text-muted-foreground"
          />
          <Radar
            name="Proficiency"
            dataKey="value"
            stroke="rgb(var(--color-primary))"
            fill="rgb(var(--color-primary))"
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
