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
  resumes: any[];
  activeResume: any | null;
  resume: ResumeSection; // Keep for backward-compatibility with components expecting this structure
  atsScore: number;
  missingKeywords: string[];
  isLoading: boolean;
  fetchResumes: () => Promise<void>;
  uploadResume: (file: File) => Promise<any>;
  getAtsScore: (resumeId: string, jobDescription?: string) => Promise<void>;
  updateResume: (updates: Partial<ResumeSection>) => void;
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

export const useResumeStore = create<ResumeState>((set, get) => ({
  resumes: [],
  activeResume: null,
  resume: defaultResume,
  atsScore: 78,
  missingKeywords: ['React Native', 'CI/CD Pipelines', 'Agile Leadership'],
  isLoading: false,

  fetchResumes: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/resume');
      if (res.ok) {
        const { data } = await res.json();
        const active = data.find((r: any) => r.isPrimary) ?? data[0];
        set({ 
          resumes: data, 
          activeResume: active, 
          resume: active ? (active.contentJson as ResumeSection) : defaultResume,
          atsScore: active?.atsScore ?? 78,
          isLoading: false 
        });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  uploadResume: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/resume/upload', { method: 'POST', body: formData });
    if (!res.ok) throw new Error('Upload failed');
    const { data } = await res.json();
    set((state) => ({ 
      resumes: [data, ...state.resumes], 
      activeResume: data,
      resume: data.contentJson as ResumeSection
    }));
    return data;
  },

  getAtsScore: async (resumeId: string, jobDescription?: string) => {
    try {
      const res = await fetch(`/api/resume/${resumeId}/ats-score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription }),
      });
      if (res.ok) {
        const { data } = await res.json();
        set({ atsScore: data.score, missingKeywords: data.missingKeywords });
      }
    } catch {}
  },

  updateResume: (updates) => set((state) => ({ 
    resume: { ...state.resume, ...updates },
    activeResume: state.activeResume ? { 
      ...state.activeResume, 
      contentJson: { ...(state.activeResume.contentJson as ResumeSection), ...updates } 
    } : null
  })),

  setAtsScore: (score) => set({ atsScore: score }),
  setMissingKeywords: (keywords) => set({ missingKeywords: keywords }),
}));
