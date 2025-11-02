import axios from 'axios';

// Create a dedicated axios instance for the Notebook service
const notebookClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NOTEBOOK_URL || 'http://localhost:8120',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
notebookClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const notebookAPI = {
  // Projects
  projects: {
    getAll: (params?: Record<string, any>) =>
      notebookClient.get('/api/projects', { params }),
    getOne: (id: number) =>
      notebookClient.get(`/api/projects/${id}`),
    create: (data: any) =>
      notebookClient.post('/api/projects', data),
    update: (id: number, data: any) =>
      notebookClient.put(`/api/projects/${id}`, data),
    delete: (id: number) =>
      notebookClient.delete(`/api/projects/${id}`),
    getStats: (id: number) =>
      notebookClient.get(`/api/projects/${id}/stats`),
  },

  // Tasks
  tasks: {
    getAll: (params?: Record<string, any>) =>
      notebookClient.get('/api/tasks', { params }),
    getOne: (id: number) =>
      notebookClient.get(`/api/tasks/${id}`),
    create: (data: any) =>
      notebookClient.post('/api/tasks', data),
    update: (id: number, data: any) =>
      notebookClient.put(`/api/tasks/${id}`, data),
    delete: (id: number) =>
      notebookClient.delete(`/api/tasks/${id}`),
    addComment: (id: number, content: string) =>
      notebookClient.post(`/api/tasks/${id}/comments`, { content }),
    getComments: (id: number) =>
      notebookClient.get(`/api/tasks/${id}/comments`),
    getFiles: (id: number) =>
      notebookClient.get(`/api/tasks/${id}/files`),
  },

  // Files
  files: {
    uploadToTask: (taskId: number, file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return notebookClient.post(`/api/files/upload/task/${taskId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    uploadToProject: (projectId: number, file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return notebookClient.post(`/api/files/upload/project/${projectId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    download: (id: number) =>
      notebookClient.get(`/api/files/${id}/download`, { responseType: 'blob' }),
    delete: (id: number) =>
      notebookClient.delete(`/api/files/${id}`),
  },

  // Payments
  payments: {
    getAll: (params?: Record<string, any>) =>
      notebookClient.get('/api/payments', { params }),
    createPayment: (data: any) =>
      notebookClient.post('/api/payments/create', data),
    getHistory: () =>
      notebookClient.get('/api/payments/history'),
    getStats: () =>
      notebookClient.get('/api/payments/stats'),
  },

  // Search
  search: (query: string) =>
    notebookClient.get('/api/search', { params: { q: query } }),

  // Notifications
  notifications: {
    getAll: () =>
      notebookClient.get('/api/notifications'),
    markAsRead: (id: number) =>
      notebookClient.put(`/api/notifications/${id}/read`),
    markAllAsRead: () =>
      notebookClient.put('/api/notifications/read-all'),
    getStats: () =>
      notebookClient.get('/api/notifications/stats'),
  },

  // Dashboard
  dashboard: {
    getStats: () =>
      notebookClient.get('/api/dashboard/stats'),
  },
};
