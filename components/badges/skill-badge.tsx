'use client';

import React from 'react';
import { X, Plus } from 'lucide-react';

interface SkillBadgeProps {
  label: string;
  proficiency?: number;
  removable?: boolean;
  onRemove?: () => void;
  addable?: boolean;
  onAdd?: () => void;
  variant?: 'default' | 'outline' | 'secondary' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function SkillBadge({
  label,
  proficiency,
  removable = false,
  onRemove,
  addable = false,
  onAdd,
  variant = 'default',
  size = 'md',
  className = '',
}: SkillBadgeProps) {
  const sizeConfig = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const variantConfig = {
    default: 'bg-primary text-primary-foreground',
    outline: 'border border-border bg-transparent text-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    success: 'bg-green-100/20 text-green-700 dark:text-green-400',
  };

  return (
    <div className={`inline-flex items-center gap-2 rounded-full ${variantConfig[variant]} ${sizeConfig[size]} ${className}`}>
      <span className="font-medium">{label}</span>

      {proficiency !== undefined && (
        <span className="ml-1 font-semibold">{proficiency}%</span>
      )}

      {removable && (
        <button
          onClick={onRemove}
          className="ml-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
        >
          <X className="h-3 w-3" />
        </button>
      )}

      {addable && (
        <button
          onClick={onAdd}
          className="ml-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
        >
          <Plus className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
