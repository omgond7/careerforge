import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  
  login: async (email: string, password: string) => {
    set({ isLoading: true });
    // Mock login - in production, call your API
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockUser: User = {
      id: '1',
      email,
      name: email.split('@')[0],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    };
    set({ user: mockUser, isAuthenticated: true, isLoading: false });
  },
  
  signup: async (email: string, password: string, name: string) => {
    set({ isLoading: true });
    // Mock signup
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockUser: User = {
      id: '1',
      email,
      name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    };
    set({ user: mockUser, isAuthenticated: true, isLoading: false });
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
  
  setUser: (user: User | null) => {
    set({ user, isAuthenticated: !!user });
  },
}));
