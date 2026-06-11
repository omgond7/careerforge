import { create } from 'zustand';

export type ApplicationStatus = 'applied' | 'screen' | 'interview' | 'offer' | 'rejected' | 'wishlist';

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
  isLoading: boolean;
  fetchApplications: () => Promise<void>;
  addApplication: (app: Omit<Application, 'id'>) => Promise<void>;
  updateApplication: (id: string, updates: Partial<Application>) => Promise<void>;
  removeApplication: (id: string) => Promise<void>;
  getApplicationsByStatus: (status: ApplicationStatus) => Application[];
}

export const useTrackerStore = create<TrackerState>((set, get) => ({
  applications: [],
  isLoading: false,

  fetchApplications: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/applications');
      if (res.ok) {
        const { data } = await res.json();
        // Normalize status to lowercase
        const normalized = data.map((a: any) => ({ ...a, status: a.status.toLowerCase() }));
        set({ applications: normalized, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  addApplication: async (app) => {
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...app, status: app.status.toUpperCase() }),
      });
      if (res.ok) {
        const { data } = await res.json();
        set((state) => ({ 
          applications: [...state.applications, { ...data, status: data.status.toLowerCase() }] 
        }));
      }
    } catch {}
  },

  updateApplication: async (id, updates) => {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updates, ...(updates.status && { status: updates.status.toUpperCase() }) }),
      });
      if (res.ok) {
        const { data } = await res.json();
        set((state) => ({
          applications: state.applications.map((a) => 
            a.id === id ? { ...a, ...data, status: data.status.toLowerCase() } : a
          ),
        }));
      }
    } catch {}
  },

  removeApplication: async (id) => {
    try {
      const res = await fetch(`/api/applications/${id}`, { method: 'DELETE' });
      if (res.ok) {
        set((state) => ({ 
          applications: state.applications.filter((a) => a.id !== id) 
        }));
      }
    } catch {}
  },

  getApplicationsByStatus: (status) => get().applications.filter((a) => a.status === status),
}));
