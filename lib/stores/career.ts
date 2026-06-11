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
  roadmaps: any[];
  isLoading: boolean;
  fetchProfile: () => Promise<void>;
  fetchRoadmaps: () => Promise<void>;
  setTargetRole: (role: TargetRole | null) => void;
}

export const useCareerStore = create<CareerState>((set) => ({
  careerTwin: null,
  targetRole: null,
  roadmaps: [],
  isLoading: false,

  fetchProfile: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/user/me');
      if (res.ok) {
        const { data } = await res.json();
        
        // Map database schema models to frontend page properties safely
        const mappedTwin: CareerTwin = {
          id: data.profile?.id || data.id,
          name: data.name || 'Candidate',
          title: data.profile?.headline || data.profile?.targetRole || 'Professional Title',
          company: data.profile?.experience?.[0]?.company || data.profile?.targetCompany || 'Self-Employed',
          profileCompleteness: data.profile?.profileCompleteness || 0,
          topSkills: data.profile?.skills?.slice(0, 5).map((s: any) => s.skill.name) || [],
          experience: data.profile?.experienceYears || 0,
          knowledgeGraph: {
            skills: data.profile?.skills?.map((s: any) => s.skill.name) || [],
            projects: data.profile?.projects?.map((p: any) => p.name) || [],
            companies: Array.from(new Set(data.profile?.experience?.map((e: any) => e.company) || [])) as string[],
          }
        };

        const mappedTargetRole: TargetRole | null = data.profile?.targetRole ? {
          id: 'target-role-id',
          title: data.profile.targetRole,
          company: data.profile.targetCompany || 'Dream Company',
          matchScore: 75,
          currentMatch: 75,
          targetMatch: 90,
          estimatedTime: '6 Months',
          gapAnalysis: {
            skillGaps: [],
            experienceGap: 0,
            requiredProjects: [],
          }
        } : null;

        set({ careerTwin: mappedTwin, targetRole: mappedTargetRole, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  fetchRoadmaps: async () => {
    try {
      const res = await fetch('/api/roadmap');
      if (res.ok) {
        const { data } = await res.json();
        set({ roadmaps: data });
      }
    } catch {}
  },

  setTargetRole: (role) => set({ targetRole: role }),
}));
