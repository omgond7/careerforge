'use client';

import React from 'react';
import { Mail, MapPin } from 'lucide-react';
import { Linkedin } from '@/components/icons';

interface ExperienceItem {
  company: string;
  role: string;
  date: string;
  description?: string;
  achievements?: string[];
}

interface ResumePreviewProps {
  name: string;
  title?: string;
  email?: string;
  location?: string;
  linkedinUrl?: string;
  summary?: string;
  experience?: ExperienceItem[];
  skills?: string[];
  className?: string;
}

export function ResumePreview({
  name,
  title,
  email,
  location,
  linkedinUrl,
  summary,
  experience = [],
  skills = [],
  className = '',
}: ResumePreviewProps) {
  return (
    <div className={`rounded-lg border border-border bg-white p-8 text-black dark:bg-card dark:text-foreground ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-300 pb-6 dark:border-border">
        <h1 className="text-4xl font-bold">{name}</h1>
        {title && <p className="mt-1 text-lg text-gray-600 dark:text-muted-foreground">{title}</p>}

        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
          {email && (
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              {email}
            </div>
          )}
          {location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {location}
            </div>
          )}
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-blue-600 dark:text-blue-400"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mt-6">
          <h2 className="text-lg font-bold uppercase tracking-wide">Professional Summary</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-muted-foreground">
            {summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-bold uppercase tracking-wide">Experience</h2>
          <div className="mt-3 space-y-4">
            {experience.map((item, idx) => (
              <div key={idx}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-foreground">{item.company}</h3>
                    <p className="text-sm font-semibold text-gray-700 dark:text-muted-foreground">
                      {item.role}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-gray-600 dark:text-muted-foreground">
                    {item.date}
                  </span>
                </div>
                {item.description && (
                  <p className="mt-2 text-sm text-gray-700 dark:text-muted-foreground">
                    {item.description}
                  </p>
                )}
                {item.achievements && item.achievements.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {item.achievements.map((achievement, aidx) => (
                      <li key={aidx} className="text-xs text-gray-600 dark:text-muted-foreground">
                        • {achievement}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-bold uppercase tracking-wide">Skills</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-800 dark:bg-muted dark:text-muted-foreground"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
