/**
 * Auth Store (Zustand)
 * 
 * Manages authentication state across the application
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
import { apiClient } from '@/lib/api-client';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => {
        set({ 
          user, 
          isAuthenticated: !!user 
        });
      },

      login: async (email, password) => {
        try {
          set({ isLoading: true });
          
          const response = await apiClient.login({ email, password });
          
          set({ 
            user: response.user,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data) => {
        try {
          set({ isLoading: true });
          
          const response = await apiClient.register(data);
          
          set({ 
            user: response.user,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await apiClient.logout();
        } finally {
          set({ 
            user: null,
            isAuthenticated: false
          });
        }
      },

      refreshUser: async () => {
        try {
          const user = await apiClient.getCurrentUser();
          set({ user, isAuthenticated: true });
        } catch (error) {
          set({ user: null, isAuthenticated: false });
          throw error;
        }
      },

      checkAuth: async () => {
        try {
          const user = await apiClient.getCurrentUser();
          set({ user, isAuthenticated: true });
          return true;
        } catch (error) {
          set({ user: null, isAuthenticated: false });
          return false;
        }
      },
    }),
    {
      name: 'eureka-auth',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);
