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
  /** Set true once the persisted state from localStorage has been merged into the store.
   * Consumers that render auth-dependent UI MUST gate on this to avoid SSR hydration
   * mismatches (React error #418 / #423). See useAuthHasHydrated() helper. */
  _hasHydrated: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setHasHydrated: (v: boolean) => void;
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
      _hasHydrated: false,

      setHasHydrated: (v) => set({ _hasHydrated: v }),

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
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Mark as hydrated AFTER persisted state is applied. Components gate on
        // _hasHydrated so server (no localStorage) and client (with localStorage)
        // render the same initial UI, avoiding React #418/#423 hydration errors.
        state?.setHasHydrated(true);
      },
    }
  )
);

/**
 * Returns true once the persisted auth state has been merged from localStorage.
 * Use this to gate auth-dependent rendering and avoid SSR hydration mismatches.
 *
 * Example:
 *   const hydrated = useAuthHasHydrated();
 *   const user = useAuthStore((s) => s.user);
 *   if (!hydrated) return null; // or a skeleton
 *   // safe to render user-dependent UI
 */
export const useAuthHasHydrated = () => useAuthStore((s) => s._hasHydrated);
