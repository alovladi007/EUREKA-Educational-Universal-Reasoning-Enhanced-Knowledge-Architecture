import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL + '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/me', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// Project endpoints
export const projectAPI = {
  getAll: (params) => api.get('/projects', { params }),
  getOne: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  getStats: (id) => api.get(`/projects/${id}/stats`),
};

// Task endpoints
export const taskAPI = {
  getAll: (params) => api.get('/tasks', { params }),
  getOne: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
  addComment: (id, data) => api.post(`/tasks/${id}/comments`, data),
};

// File endpoints
export const fileAPI = {
  uploadToTask: (taskId, formData) => 
    api.post(`/files/upload/task/${taskId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  uploadToProject: (projectId, formData) => 
    api.post(`/files/upload/project/${projectId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getOne: (id) => api.get(`/files/${id}`),
  download: (id) => api.get(`/files/${id}/download`, { responseType: 'blob' }),
  delete: (id) => api.delete(`/files/${id}`),
  getByTask: (taskId) => api.get(`/files/task/${taskId}`),
  getByProject: (projectId) => api.get(`/files/project/${projectId}`),
};

// Payment endpoints
export const paymentAPI = {
  createIntent: (data) => api.post('/payments/create-payment-intent', data),
  getHistory: (params) => api.get('/payments/history', { params }),
  getOne: (id) => api.get(`/payments/${id}`),
  getStats: () => api.get('/payments/stats/overview'),
};

// Search endpoints
export const searchAPI = {
  search: (params) => api.get('/search', { params }),
  advancedSearch: (data) => api.post('/search/advanced', data),
  suggestions: (params) => api.get('/search/suggestions', { params }),
};

// Notification endpoints
export const notificationAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
  getStats: () => api.get('/notifications/stats'),
};

// Dashboard endpoints
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

export default api;
