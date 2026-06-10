import { create } from 'zustand';

export interface ResumeSection {
  personalInfo: {
    fullName: string;
    email: string;
    phone?: string;
    location?: string;
    linkedinUrl?: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    company: string;
    role: string;
    startDate: string;
    endDate?: string;
    description: string;
    accomplishments: string[];
  }>;
  skills: Array<{
    category: string;
    items: string[];
  }>;
  education?: Array<{
    school: string;
    degree: string;
    field: string;
    year: string;
  }>;
}

interface ResumeState {
  resume: ResumeSection;
  atsScore: number;
  missingKeywords: string[];
  updateResume: (resume: Partial<ResumeSection>) => void;
  setAtsScore: (score: number) => void;
  setMissingKeywords: (keywords: string[]) => void;
}

const defaultResume: ResumeSection = {
  personalInfo: {
    fullName: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedinUrl: 'linkedin.com/in/janedoe',
  },
  summary: 'Experienced Frontend Engineer specializing in React and modern web architecture. Proven track record of delivering scalable enterprise applications and improving performance metrics.',
  experience: [
    {
      id: '1',
      company: 'TechNova Solutions',
      role: 'Frontend Developer',
      startDate: '2020',
      endDate: 'Present',
      description: 'Spearheaded the migration from Vue 2 to React, reducing technical debt.',
      accomplishments: [
        'Reduced application load time by 30%',
        'Implemented automated testing reducing production bugs by 15%',
      ],
    },
  ],
  skills: [
    {
      category: 'Frontend',
      items: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
    },
    {
      category: 'Backend',
      items: ['Node.js', 'GraphQL', 'PostgreSQL'],
    },
  ],
};

export const useResumeStore = create<ResumeState>((set) => ({
  resume: defaultResume,
  atsScore: 78,
  missingKeywords: ['React Native', 'CI/CD Pipelines', 'Agile Leadership'],
  
  updateResume: (updates: Partial<ResumeSection>) =>
    set((state) => ({
      resume: { ...state.resume, ...updates },
    })),
  
  setAtsScore: (score: number) => set({ atsScore: score }),
  
  setMissingKeywords: (keywords: string[]) =>
    set({ missingKeywords: keywords }),
}));
