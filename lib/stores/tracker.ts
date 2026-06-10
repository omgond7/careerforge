import { create } from 'zustand';

export type ApplicationStatus = 'applied' | 'screen' | 'interview' | 'offer' | 'rejected';

export interface Application {
  id: string;
  jobTitle: string;
  company: string;
  status: ApplicationStatus;
  appliedDate: string;
  matchScore?: number;
  notes?: string;
}

interface TrackerState {
  applications: Application[];
  addApplication: (app: Omit<Application, 'id'>) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  removeApplication: (id: string) => void;
  getApplicationsByStatus: (status: ApplicationStatus) => Application[];
}

export const useTrackerStore = create<TrackerState>((set, get) => ({
  applications: [
    {
      id: '1',
      jobTitle: 'UI Engineer',
      company: 'Meta',
      status: 'screen',
      appliedDate: '2024-10-15',
      matchScore: 82,
    },
  ],
  
  addApplication: (app: Omit<Application, 'id'>) => {
    set((state) => ({
      applications: [
        ...state.applications,
        { ...app, id: Date.now().toString() },
      ],
    }));
  },
  
  updateApplication: (id: string, updates: Partial<Application>) => {
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === id ? { ...app, ...updates } : app
      ),
    }));
  },
  
  removeApplication: (id: string) => {
    set((state) => ({
      applications: state.applications.filter((app) => app.id !== id),
    }));
  },
  
  getApplicationsByStatus: (status: ApplicationStatus) => {
    return get().applications.filter((app) => app.status === status);
  },
}));
