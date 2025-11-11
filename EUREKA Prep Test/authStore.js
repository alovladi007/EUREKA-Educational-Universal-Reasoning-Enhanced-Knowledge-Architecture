import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Configure axios defaults
axios.defaults.baseURL = `${API_URL}/api/v1`;

// Add auth token to requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiration
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post('/auth/refresh', {
            refresh_token: refreshToken
          });
          
          const { access_token, refresh_token: newRefreshToken } = response.data;
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', newRefreshToken);
          
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // Login
      login: async (username, password) => {
        set({ loading: true, error: null });
        try {
          const formData = new FormData();
          formData.append('username', username);
          formData.append('password', password);
          
          const response = await axios.post('/auth/login', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          
          const { access_token, refresh_token } = response.data;
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', refresh_token);
          
          // Get user info
          const userResponse = await axios.get('/auth/me');
          
          set({
            user: userResponse.data,
            isAuthenticated: true,
            loading: false,
            error: null
          });
          
          toast.success('Login successful!');
          return true;
        } catch (error) {
          const errorMessage = error.response?.data?.detail || 'Login failed';
          set({ loading: false, error: errorMessage });
          toast.error(errorMessage);
          return false;
        }
      },

      // Register
      register: async (userData) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post('/auth/register', userData);
          
          const { access_token, refresh_token } = response.data;
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', refresh_token);
          
          // Get user info
          const userResponse = await axios.get('/auth/me');
          
          set({
            user: userResponse.data,
            isAuthenticated: true,
            loading: false,
            error: null
          });
          
          toast.success('Registration successful! Welcome to EUREKA!');
          return true;
        } catch (error) {
          const errorMessage = error.response?.data?.detail || 'Registration failed';
          set({ loading: false, error: errorMessage });
          toast.error(errorMessage);
          return false;
        }
      },

      // Logout
      logout: async () => {
        try {
          await axios.post('/auth/logout');
        } catch (error) {
          // Continue with logout even if server request fails
        }
        
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        
        set({
          user: null,
          isAuthenticated: false,
          error: null
        });
        
        toast.success('Logged out successfully');
      },

      // Check authentication
      checkAuth: async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
          set({ isAuthenticated: false, loading: false });
          return;
        }

        set({ loading: true });
        try {
          const response = await axios.get('/auth/me');
          set({
            user: response.data,
            isAuthenticated: true,
            loading: false
          });
        } catch (error) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          set({
            user: null,
            isAuthenticated: false,
            loading: false
          });
        }
      },

      // Update user profile
      updateProfile: async (profileData) => {
        try {
          const response = await axios.put('/users/profile', profileData);
          set({ user: response.data });
          toast.success('Profile updated successfully');
          return true;
        } catch (error) {
          toast.error('Failed to update profile');
          return false;
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

// Check authentication on app load
useAuthStore.getState().checkAuth();

export { useAuthStore, axios };
