'use client';

import { create } from 'zustand';
import { User } from '@/lib/types';
import { login as apiLogin, register as apiRegister } from '@/lib/api';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserBalance: (balance: number) => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,
  login: async (username: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const user = await apiLogin({ username, password });
      set({ user, loading: false });
    } catch (error) {
      set({ error: 'Login failed. Please check your credentials.', loading: false });
    }
  },
  register: async (username: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const user = await apiRegister({ username, password });
      set({ user, loading: false });
    } catch (error) {
      set({ error: 'Registration failed. Please try again.', loading: false });
    }
  },
  logout: () => set({ user: null, error: null }),
  updateUserBalance: (balance: number) => 
    set((state) => ({
      user: state.user ? { ...state.user, wallet: balance } : null
    })),
}));