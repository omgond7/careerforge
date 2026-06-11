import { create } from 'zustand';
import { signIn, signOut } from 'next-auth/react';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: string;
  subscriptionTier?: string;
  onboardingDone?: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,

  fetchMe: async () => {
    try {
      const res = await fetch('/api/user/me');
      if (!res.ok) return;
      const { data } = await res.json();
      set({ 
        user: { 
          id: data.id, 
          email: data.email, 
          name: data.name, 
          avatar: data.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
          role: data.role
        }, 
        isAuthenticated: true 
      });
    } catch {}
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        throw new Error(result.error);
      }
      
      const res = await fetch('/api/user/me');
      if (res.ok) {
        const { data } = await res.json();
        set({ 
          user: { 
            id: data.id, 
            email: data.email, 
            name: data.name, 
            avatar: data.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
            role: data.role
          }, 
          isAuthenticated: true 
        });
      }
    } catch (err: any) {
      set({ isLoading: false });
      throw err;
    }
    set({ isLoading: false });
  },

  signup: async (email, password, name) => {
    set({ isLoading: true });
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    if (!res.ok) {
      const err = await res.json();
      set({ isLoading: false });
      throw new Error(err.error ?? 'Signup failed');
    }
    set({ isLoading: false });
  },

  logout: async () => {
    await signOut({ redirect: true, callbackUrl: '/login' });
    set({ user: null, isAuthenticated: false });
  },

  setUser: (user) => set({ user, isAuthenticated: !!user }),
}));
