import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && originalRequest) {
          try {
            const refreshToken = this.getRefreshToken();
            if (refreshToken) {
              const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                refreshToken,
              });

              this.setTokens(data.accessToken, data.refreshToken);
              
              originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            this.clearTokens();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  private clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  // Authentication
  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    orgId: string;
  }) {
    const response = await this.client.post('/auth/register', data);
    if (response.data.accessToken) {
      this.setTokens(response.data.accessToken, response.data.refreshToken);
    }
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password });
    if (response.data.accessToken) {
      this.setTokens(response.data.accessToken, response.data.refreshToken);
    }
    return response.data;
  }

  async logout() {
    try {
      await this.client.post('/auth/logout');
    } finally {
      this.clearTokens();
    }
  }

  async getCurrentUser() {
    const response = await this.client.get('/auth/me');
    return response.data;
  }

  // QBank
  async getQBankItems(params?: {
    page?: number;
    limit?: number;
    category?: string;
    difficulty_min?: number;
    difficulty_max?: number;
  }) {
    const response = await this.client.get('/qbank/items', { params });
    return response.data;
  }

  async startPracticeSession(data: {
    mode: 'tutor' | 'timed' | 'test';
    item_count: number;
    category?: string;
    difficulty_min?: number;
    difficulty_max?: number;
    unused_only?: boolean;
  }) {
    const response = await this.client.post('/qbank/practice/start', data);
    return response.data;
  }

  async submitAnswer(sessionId: string, data: {
    item_id: string;
    answer: string;
    time_spent_seconds: number;
  }) {
    const response = await this.client.post(`/qbank/practice/${sessionId}/answer`, data);
    return response.data;
  }

  async submitPracticeSession(sessionId: string, answers: any[]) {
    const response = await this.client.post(`/qbank/practice/${sessionId}/submit`, {
      answers,
    });
    return response.data;
  }

  async getQBankPerformance() {
    const response = await this.client.get('/qbank/performance/by-topic');
    return response.data;
  }

  async getQBankStatistics() {
    const response = await this.client.get('/qbank/performance/statistics');
    return response.data;
  }

  async getWeakAreas() {
    const response = await this.client.get('/qbank/performance/weak-areas');
    return response.data;
  }

  // Clinical Cases
  async getCases(params?: {
    page?: number;
    limit?: number;
    complexity?: string;
    specialty?: string;
    search?: string;
  }) {
    const response = await this.client.get('/cases', { params });
    return response.data;
  }

  async getCase(id: string) {
    const response = await this.client.get(`/cases/${id}`);
    return response.data;
  }

  async startCaseSession(caseId: string) {
    const response = await this.client.post('/cases/sessions/start', { caseId });
    return response.data;
  }

  async getMyCaseSessions(status?: string) {
    const response = await this.client.get('/cases/sessions/my', {
      params: { status },
    });
    return response.data;
  }

  async getCaseSession(sessionId: string) {
    const response = await this.client.get(`/cases/sessions/${sessionId}`);
    return response.data;
  }

  async takeAction(sessionId: string, data: {
    actionType: string;
    actionId: string;
    notes?: string;
  }) {
    const response = await this.client.post(`/cases/sessions/${sessionId}/actions`, data);
    return response.data;
  }

  async submitDiagnosis(sessionId: string, data: {
    primaryDiagnosis: string;
    differentialDiagnoses: string[];
    confidence: number;
    reasoning?: string;
  }) {
    const response = await this.client.post(`/cases/sessions/${sessionId}/diagnosis`, data);
    return response.data;
  }

  async submitManagement(sessionId: string, data: {
    managementActions: string[];
    rationale?: string;
  }) {
    const response = await this.client.post(`/cases/sessions/${sessionId}/management`, data);
    return response.data;
  }

  async completeCaseSession(sessionId: string) {
    const response = await this.client.post(`/cases/sessions/${sessionId}/complete`);
    return response.data;
  }

  async getCasePerformance() {
    const response = await this.client.get('/cases/performance/mine');
    return response.data;
  }

  // AI Tutor
  async createConversation(data: {
    title?: string;
    courseId?: string;
    contextType?: string;
    contextId?: string;
  }) {
    const response = await this.client.post('/ai-tutor/conversations', data);
    return response.data;
  }

  async getConversations(params?: {
    limit?: number;
    page?: number;
  }) {
    const response = await this.client.get('/ai-tutor/conversations', { params });
    return response.data;
  }

  async getConversation(id: string) {
    const response = await this.client.get(`/ai-tutor/conversations/${id}`);
    return response.data;
  }

  async getConversationMessages(id: string, params?: {
    limit?: number;
    page?: number;
  }) {
    const response = await this.client.get(`/ai-tutor/conversations/${id}/messages`, {
      params,
    });
    return response.data;
  }

  async sendMessage(data: {
    conversationId: string;
    message: string;
  }) {
    const response = await this.client.post('/ai-tutor/messages', data);
    return response.data;
  }
}

export const apiClient = new ApiClient();
