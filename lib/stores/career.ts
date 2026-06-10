import { create } from 'zustand';

export interface CareerTwin {
  id: string;
  name: string;
  title: string;
  company: string;
  profileCompleteness: number;
  topSkills: string[];
  experience: number; // years
  knowledgeGraph?: {
    skills: string[];
    projects: string[];
    companies: string[];
  };
}

export interface TargetRole {
  id: string;
  title: string;
  company: string;
  matchScore: number;
  currentMatch: number;
  targetMatch: number;
  estimatedTime: string;
  gapAnalysis?: {
    skillGaps: string[];
    experienceGap: number;
    requiredProjects: string[];
  };
}

interface CareerState {
  careerTwin: CareerTwin | null;
  targetRole: TargetRole | null;
  setCareerTwin: (twin: CareerTwin | null) => void;
  setTargetRole: (role: TargetRole | null) => void;
}

export const useCareerStore = create<CareerState>((set) => ({
  careerTwin: {
    id: '1',
    name: 'Sarah Chen',
    title: 'Senior Frontend Engineer',
    company: 'TechNova Solutions',
    profileCompleteness: 82,
    topSkills: ['React', 'TypeScript', 'Node.js'],
    experience: 8,
    knowledgeGraph: {
      skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS'],
      projects: ['Project A', 'Project B'],
      companies: ['TechNova Solutions', 'Company X'],
    },
  },
  
  targetRole: {
    id: '1',
    title: 'Senior Frontend Engineer',
    company: 'Stripe',
    matchScore: 67,
    currentMatch: 67,
    targetMatch: 75,
    estimatedTime: '10 Hours',
    gapAnalysis: {
      skillGaps: ['GraphQL', 'AWS', 'Docker'],
      experienceGap: 2,
      requiredProjects: ['E-commerce platform', 'Large-scale state management'],
    },
  },
  
  setCareerTwin: (twin: CareerTwin | null) => set({ careerTwin: twin }),
  setTargetRole: (role: TargetRole | null) => set({ targetRole: role }),
}));
