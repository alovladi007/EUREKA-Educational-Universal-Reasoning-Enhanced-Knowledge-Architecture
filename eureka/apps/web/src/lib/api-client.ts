/**
 * EUREKA API Client
 * 
 * Handles all API requests with authentication and error handling
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import type {
  User, Organization, Course, Enrollment, Badge,
  LoginRequest, RegisterRequest, AuthResponse,
  SrsCard, SrsStats,
} from '@/types';

// P0.3: api-core's host port is 8000 (docker-compose `8000:8000`), and
// both eureka-api.ts and next.config.js already default to :8000. This
// axios client was the lone outlier defaulting to :8009 (nothing listens
// there), so with NEXT_PUBLIC_API_URL unset the axios client and the
// fetch wrapper pointed at different ports. Unified on :8000.
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX || '/api/v1';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_URL}${API_PREFIX}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor — add auth token PROACTIVELY.
    // If there's no token in localStorage, or the cached token is expired,
    // kick off dev auto-login BEFORE sending the request so the first call
    // doesn't 401. Stale tokens (from a previous session where JWT_SECRET
    // rotated, or simply expired) would otherwise produce a 401 noise
    // even though the response interceptor's retry would recover.
    this.client.interceptors.request.use(
      async (config) => {
        let token = this.getToken();
        // Stale-token check: decode the JWT exp claim. If absent or
        // already past, treat as no-token and trigger dev auto-login.
        if (token && this.jwtIsExpiredOrInvalid(token)) {
          if (typeof window !== 'undefined') {
            window.localStorage.removeItem('access_token');
          }
          token = null;
        }
        if (!token) {
          const fresh = await this.devAutoLogin();
          if (fresh) token = fresh;
        }
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor — handle token refresh + dev auto-login
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          // 1. Try refresh_token if we have one (normal session refresh)
          try {
            const refreshToken = this.getRefreshToken();
            if (refreshToken) {
              const response = await axios.post(
                `${API_URL}${API_PREFIX}/auth/refresh`,
                { refresh_token: refreshToken }
              );
              const { access_token } = response.data;
              this.setToken(access_token);
              originalRequest.headers.Authorization = `Bearer ${access_token}`;
              return this.client(originalRequest);
            }
          } catch {
            /* fall through to dev auto-login */
          }

          // 2. Dev auto-login fallback — same pattern as eureka-api.ts's
          //    `devAutoLogin()`. Without this, a stale or missing token in
          //    localStorage never recovers and every page does a hard
          //    redirect to /auth/login.
          const fresh = await this.devAutoLogin();
          if (fresh) {
            this.setToken(fresh);
            originalRequest.headers.Authorization = `Bearer ${fresh}`;
            return this.client(originalRequest);
          }

          // 3. Last resort: clear + redirect (only if dev auto-login is off)
          this.clearTokens();
          if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth/login')) {
            const here = window.location.pathname + window.location.search;
            window.location.href = `/auth/login?next=${encodeURIComponent(here)}`;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Token management
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  }

  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refresh_token');
  }

  setToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
  }

  // -----------------------------------------------------------------
  // Dev auto-login — delegates to the SAME shared promise that
  // eureka-api.ts uses, so this axios client + that fetch wrapper
  // don't both fire POST /auth/login in parallel on first page load.
  // Disabled by setting NEXT_PUBLIC_DEV_AUTO_LOGIN=0.
  // -----------------------------------------------------------------
  private async devAutoLogin(): Promise<string | null> {
    // Lazy import keeps the module graph simple (no top-level cycle).
    const { devAutoLogin } = await import('./eureka-api');
    return devAutoLogin();
  }

  /**
   * Decode the JWT payload (NOT verify the signature — server still does
   * that). Returns true when the token is malformed OR `exp` is in the
   * past (with a 30s clock-skew buffer so we never use a token that's
   * about to expire mid-flight). Used to pre-emptively trigger
   * devAutoLogin in the request interceptor before we 401.
   */
  private jwtIsExpiredOrInvalid(token: string): boolean {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return true;
      // base64url → base64
      const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4)));
      const exp = payload?.exp;
      if (typeof exp !== 'number') return true;
      const nowSec = Math.floor(Date.now() / 1000);
      return exp - 30 <= nowSec;
    } catch {
      return true;
    }
  }

  setRefreshToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('refresh_token', token);
    }
  }

  clearTokens() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  // ==================== Generic HTTP Methods ====================

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<any> {
    return this.client.get<T>(url, config);
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<any> {
    return this.client.post<T>(url, data, config);
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<any> {
    return this.client.put<T>(url, data, config);
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<any> {
    return this.client.patch<T>(url, data, config);
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<any> {
    return this.client.delete<T>(url, config);
  }

  // ==================== Auth ====================

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/login', data);
    this.setToken(response.data.access_token);
    this.setRefreshToken(response.data.refresh_token);
    return response.data;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/register', data);
    this.setToken(response.data.access_token);
    this.setRefreshToken(response.data.refresh_token);
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await this.client.post('/auth/logout');
    } finally {
      this.clearTokens();
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.client.get<User>('/auth/me');
    return response.data;
  }

  async refreshAccessToken(refreshToken: string): Promise<{ access_token: string }> {
    const response = await this.client.post('/auth/refresh', { refresh_token: refreshToken });
    this.setToken(response.data.access_token);
    return response.data;
  }

  // ==================== Users ====================

  async getMyProfile(): Promise<User> {
    const response = await this.client.get<User>('/users/me');
    return response.data;
  }

  async updateMyProfile(data: Partial<User>): Promise<User> {
    const response = await this.client.patch<User>('/users/me', data);
    return response.data;
  }

  async getMyEnrollments(): Promise<Enrollment[]> {
    const response = await this.client.get<Enrollment[]>('/users/me/enrollments');
    return response.data;
  }

  // ==================== User Settings ====================
  // Persisted in users.preferences JSONB on the api-core User row. The
  // backend treats the payload as opaque so we can add new sections client-
  // side (study-mode prefs, integrations, etc.) without a backend deploy.

  async getMySettings(): Promise<Record<string, unknown>> {
    const response = await this.client.get<Record<string, unknown>>('/users/me/settings');
    return response.data || {};
  }

  async updateMySettings(
    patch: Partial<Record<string, unknown>>,
  ): Promise<Record<string, unknown>> {
    const response = await this.client.patch<Record<string, unknown>>('/users/me/settings', patch);
    return response.data || {};
  }

  // ==================== User Progress (P0-5) ====================
  // Cross-exam per-topic mastery tracking. Backend stores one row per
  // (user, exam_type, topic_id); upserts run via POST /me/progress
  // after every answered question. Used by the per-exam Analytics pages
  // and the Study Plan recommendation engine.

  async getUserProgress(examType: string): Promise<Array<{
    id: string;
    user_id: string;
    exam_type: string;
    topic_id: string;
    attempts: number;
    correct: number;
    avg_seconds: number;
    mastery_level: number;
    last_seen_at: string;
    created_at: string;
  }>> {
    const response = await this.client.get('/me/progress', {
      params: { exam_type: examType },
    });
    return response.data || [];
  }

  async recordProgress(payload: {
    exam_type: string;
    topic_id: string;
    is_correct: boolean;
    seconds?: number;
  }): Promise<{
    id: string;
    user_id: string;
    exam_type: string;
    topic_id: string;
    attempts: number;
    correct: number;
    avg_seconds: number;
    mastery_level: number;
    last_seen_at: string;
    created_at: string;
  }> {
    const response = await this.client.post('/me/progress', payload);
    return response.data;
  }

  // ==================== SRS (Spaced-Repetition flashcards, P1-4) ====================
  // Backed by the api-core srs_cards table + SM-2 algorithm. Each card
  // carries its own ease_factor / interval / repetitions / next_review
  // state; the /review endpoint applies the canonical SM-2 update.

  async listSrsCards(params?: { deck?: string; limit?: number; offset?: number }): Promise<{
    cards: SrsCard[];
    total: number;
  }> {
    const response = await this.client.get('/me/srs/cards', { params });
    return response.data;
  }

  async listDueSrsCards(params?: { deck?: string; limit?: number }): Promise<{
    cards: SrsCard[];
    total: number;
  }> {
    const response = await this.client.get('/me/srs/cards/due', { params });
    return response.data;
  }

  async getSrsStats(deck?: string): Promise<SrsStats> {
    const response = await this.client.get('/me/srs/stats', {
      params: deck ? { deck } : undefined,
    });
    return response.data;
  }

  async createSrsCard(payload: {
    deck?: string;
    front: string;
    back: string;
    tags?: Record<string, unknown>;
  }): Promise<SrsCard> {
    const response = await this.client.post('/me/srs/cards', payload);
    return response.data;
  }

  async updateSrsCard(cardId: string, payload: {
    front?: string;
    back?: string;
    deck?: string;
    tags?: Record<string, unknown>;
  }): Promise<SrsCard> {
    const response = await this.client.patch(`/me/srs/cards/${cardId}`, payload);
    return response.data;
  }

  async deleteSrsCard(cardId: string): Promise<void> {
    await this.client.delete(`/me/srs/cards/${cardId}`);
  }

  /**
   * Grade a card review. `quality` is the SM-2 scale (0-5):
   *   0 — total blackout / wrong answer
   *   3 — correct but required serious effort  (≥3 = "pass")
   *   4 — correct with hesitation
   *   5 — perfect recall
   * Simple-UI mapping: Again=0, Hard=3, Good=4, Easy=5.
   * Returns the post-update card so the client can refresh next_review.
   */
  async reviewSrsCard(cardId: string, quality: 0 | 1 | 2 | 3 | 4 | 5): Promise<SrsCard> {
    const response = await this.client.post(`/me/srs/cards/${cardId}/review`, { quality });
    return response.data;
  }

  async getProgressSummary(examType: string): Promise<{
    exam_type: string;
    total_topics: number;
    topics_attempted: number;
    total_attempts: number;
    total_correct: number;
    accuracy: number;
    average_mastery: number;
    average_seconds_per_question: number;
    weakest_topics: Array<{
      id: string;
      topic_id: string;
      attempts: number;
      correct: number;
      mastery_level: number;
      avg_seconds: number;
    }>;
  }> {
    const response = await this.client.get('/me/progress/summary', {
      params: { exam_type: examType },
    });
    return response.data;
  }

  // ==================== Organizations ====================

  async getOrganizations(params?: { 
    skip?: number; 
    limit?: number; 
    tier?: string;
    is_active?: boolean;
    search?: string;
  }): Promise<{ items: Organization[]; total: number }> {
    const response = await this.client.get('/organizations', { params });
    return response.data;
  }

  async getOrganization(id: string): Promise<Organization> {
    const response = await this.client.get<Organization>(`/organizations/${id}`);
    return response.data;
  }

  // ==================== Courses ====================

  async getCourses(params?: {
    skip?: number;
    limit?: number;
    tier?: string;
    is_published?: boolean;
    is_archived?: boolean;
    instructor_id?: string;
    subject?: string;
    search?: string;
  }): Promise<{ items: Course[]; total: number }> {
    const response = await this.client.get('/courses', { params });
    return response.data;
  }

  async getCourse(id: string): Promise<Course> {
    const response = await this.client.get<Course>(`/courses/${id}`);
    return response.data;
  }

  async createCourse(data: Partial<Course>): Promise<Course> {
    const response = await this.client.post<Course>('/courses', data);
    return response.data;
  }

  async updateCourse(id: string, data: Partial<Course>): Promise<Course> {
    const response = await this.client.patch<Course>(`/courses/${id}`, data);
    return response.data;
  }

  async publishCourse(id: string): Promise<Course> {
    const response = await this.client.post<Course>(`/courses/${id}/publish`);
    return response.data;
  }

  async unpublishCourse(id: string): Promise<Course> {
    const response = await this.client.post<Course>(`/courses/${id}/unpublish`);
    return response.data;
  }

  async deleteCourse(id: string): Promise<void> {
    await this.client.delete(`/courses/${id}`);
  }

  // ==================== Enrollments ====================

  async enrollInCourse(courseId: string, userId?: string): Promise<Enrollment> {
    const response = await this.client.post<Enrollment>(
      `/courses/${courseId}/enroll`,
      userId ? { user_id: userId } : undefined
    );
    return response.data;
  }

  async getCourseEnrollments(courseId: string, params?: {
    skip?: number;
    limit?: number;
    status?: string;
  }): Promise<{ items: Enrollment[]; total: number }> {
    const response = await this.client.get(`/courses/${courseId}/enrollments`, { params });
    return response.data;
  }

  async updateEnrollment(
    courseId: string, 
    userId: string, 
    data: Partial<Enrollment>
  ): Promise<Enrollment> {
    const response = await this.client.patch<Enrollment>(
      `/courses/${courseId}/enrollments/${userId}`,
      data
    );
    return response.data;
  }

  async unenrollFromCourse(courseId: string, userId: string): Promise<void> {
    await this.client.delete(`/courses/${courseId}/enrollments/${userId}`);
  }

  // ==================== Badges (High School Tier) ====================

  async getBadges(params?: {
    skip?: number;
    limit?: number;
    category?: string;
  }): Promise<{ items: Badge[]; total: number }> {
    const response = await this.client.get('/tier-hs/badges', { params });
    return response.data;
  }

  async getUserBadges(userId: string): Promise<Badge[]> {
    const response = await this.client.get(`/tier-hs/users/${userId}/badges`);
    return response.data;
  }

  async getMyBadges(): Promise<Badge[]> {
    const response = await this.client.get('/tier-hs/me/badges');
    return response.data;
  }

  // ==================== Medical School Service (NestJS) ====================

  private medicalSchoolClient!: AxiosInstance;
  private medicalWarned = false;

  private getMedicalClient(): AxiosInstance {
    if (!this.medicalSchoolClient) {
      this.medicalSchoolClient = axios.create({
        baseURL: process.env.NEXT_PUBLIC_MEDICAL_SCHOOL_URL || 'http://localhost:8030',
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000,
      });

      this.medicalSchoolClient.interceptors.request.use(
        (config) => {
          const token = this.getToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        },
        (error) => Promise.reject(error),
      );

      // Same graceful-degrade as test-prep — see getTestPrepClient().
      this.medicalSchoolClient.interceptors.response.use(
        (r) => r,
        (error) => {
          const offline =
            error?.code === 'ERR_NETWORK' ||
            error?.code === 'ECONNREFUSED' ||
            error?.code === 'ECONNABORTED' ||
            !error?.response;
          if (offline) {
            if (!this.medicalWarned) {
              this.medicalWarned = true;
              // eslint-disable-next-line no-console
              console.info(
                '[apiClient] medical-school microservice (:8030) is unreachable — ' +
                'returning empty results. To start it: ' +
                '`docker compose --profile full up -d medical-school`',
              );
            }
            return Promise.resolve({
              data: {},
              status: 0,
              statusText: 'medical-school service unavailable',
              headers: {},
              config: error?.config,
            });
          }
          return Promise.reject(error);
        },
      );
    }
    return this.medicalSchoolClient;
  }

  // QBank Items API
  async getQBankItems(params?: {
    page?: number;
    limit?: number;
    type?: string;
    difficulty?: string;
    tags?: string;
  }): Promise<any> {
    const response = await this.getMedicalClient().get('/api/v1/items', { params });
    return response.data;
  }

  async getQBankItem(id: string): Promise<any> {
    const response = await this.getMedicalClient().get(`/api/v1/items/${id}`);
    return response.data;
  }

  async getQBankAnalytics(id: string): Promise<any> {
    const response = await this.getMedicalClient().get(`/api/v1/items/${id}/analytics`);
    return response.data;
  }

  async getPopularTags(): Promise<string[]> {
    const response = await this.getMedicalClient().get('/api/v1/items/tags/popular');
    return response.data;
  }

  // AI Tutor API
  async createAITutorConversation(data: {
    course_id?: string;
    title?: string;
    context_type?: string;
    context_id?: string;
  }): Promise<any> {
    const response = await this.getMedicalClient().post('/api/v1/ai-tutor/conversations', data);
    return response.data;
  }

  async getAITutorConversations(courseId?: string): Promise<any[]> {
    const response = await this.getMedicalClient().get('/api/v1/ai-tutor/conversations', {
      params: courseId ? { course_id: courseId } : undefined,
    });
    return response.data;
  }

  async getAITutorConversation(id: string): Promise<any> {
    const response = await this.getMedicalClient().get(`/api/v1/ai-tutor/conversations/${id}`);
    return response.data;
  }

  async getAITutorMessages(conversationId: string): Promise<any[]> {
    const response = await this.getMedicalClient().get(`/api/v1/ai-tutor/conversations/${conversationId}/messages`);
    return response.data;
  }

  async sendAITutorMessage(data: {
    conversation_id: string;
    message: string;
  }): Promise<any> {
    const response = await this.getMedicalClient().post('/api/v1/ai-tutor/messages', data);
    return response.data;
  }

  async regenerateAITutorMessage(data: {
    conversation_id: string;
    message_id: string;
  }): Promise<any> {
    const response = await this.getMedicalClient().post('/api/v1/ai-tutor/messages/regenerate', data);
    return response.data;
  }

  async archiveAITutorConversation(id: string): Promise<void> {
    await this.getMedicalClient().post(`/api/v1/ai-tutor/conversations/${id}/archive`);
  }

  async deleteAITutorConversation(id: string): Promise<void> {
    await this.getMedicalClient().delete(`/api/v1/ai-tutor/conversations/${id}`);
  }

  async getAITutorStats(conversationId: string): Promise<any> {
    const response = await this.getMedicalClient().get(`/api/v1/ai-tutor/conversations/${conversationId}/stats`);
    return response.data;
  }

  // Legacy aliases for backward compatibility
  async getUSMLEQuestions(params?: any): Promise<any[]> {
    const response = await this.getQBankItems(params);
    return response.items || [];
  }

  async getUSMLEQuestion(id: string): Promise<any> {
    return this.getQBankItem(id);
  }

  async getUSMLEStatistics(): Promise<any> {
    // Return mock stats for now - can be enhanced with real analytics
    return {
      total_questions_attempted: 0,
      correct_answers: 0,
      accuracy_rate: 0,
      average_time_per_question: 0,
    };
  }

  async getClinicalCases(params?: any): Promise<any[]> {
    // Clinical cases are a subset of items with type 'clinical_vignette'
    const response = await this.getQBankItems({ ...params, type: 'clinical_vignette' });
    return response.items || [];
  }

  async getClinicalCase(id: string): Promise<any> {
    return this.getQBankItem(id);
  }

  // QBank Practice Sessions
  async startPracticeSession(data: {
    mode: 'tutor' | 'timed' | 'test';
    item_count: number;
    category?: string;
    difficulty?: string;
    unused_only?: boolean;
  }): Promise<any> {
    const response = await this.getMedicalClient().post('/api/v1/items/sessions/start', data);
    return response.data;
  }

  async submitAnswer(sessionId: string, answer: {
    item_id: string;
    answer: string;
    time_spent_seconds: number;
  }): Promise<any> {
    const response = await this.getMedicalClient().post(`/api/v1/items/sessions/${sessionId}/answer`, answer);
    return response.data;
  }

  async submitPracticeSession(sessionId: string, answers: any[]): Promise<any> {
    const response = await this.getMedicalClient().post(`/api/v1/items/sessions/${sessionId}/submit`, { answers });
    return response.data;
  }

  async getPracticeSessionResults(sessionId: string): Promise<any> {
    const response = await this.getMedicalClient().get(`/api/v1/items/sessions/${sessionId}/results`);
    return response.data;
  }

  // ==================== Test Prep Service (FastAPI) ====================

  private testPrepClient!: AxiosInstance;

  // Cache the "microservice is down" warning so we only log it once
  // per session (instead of per-request firehose).
  private testPrepWarned = false;

  private getTestPrepClient(): AxiosInstance {
    if (!this.testPrepClient) {
      this.testPrepClient = axios.create({
        baseURL: process.env.NEXT_PUBLIC_TEST_PREP_URL || 'http://localhost:8200',
        headers: { 'Content-Type': 'application/json' },
        // Cap requests at 5s — the legacy services/test-prep microservice
        // on :8200 may not be running. Without a timeout the page sits in
        // a pending-network state for 30s+.
        timeout: 5000,
      });

      // Auth token (same shape as the main apiClient).
      this.testPrepClient.interceptors.request.use(
        (config) => {
          const token = this.getToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        },
        (error) => Promise.reject(error),
      );

      // Graceful-degrade response interceptor: when the legacy test-prep
      // microservice on :8200 isn't running (almost always in dev — it's
      // behind --profile full), or when it CAN'T authenticate us (it has
      // its own SECRET_KEY ≠ api-core's JWT_SECRET, and looks up users by
      // username not UUID — see P1-2 follow-up for the proper auth
      // bridge), return an empty-shaped response instead of a thrown
      // error that spams the console + alerts the user. Logs one warning
      // per session so debuggers still see it.
      this.testPrepClient.interceptors.response.use(
        (r) => r,
        (error) => {
          const status = error?.response?.status;
          const offline =
            error?.code === 'ERR_NETWORK' ||
            error?.code === 'ECONNREFUSED' ||
            error?.code === 'ECONNABORTED' ||
            !error?.response;
          // 401/403 = service responded but can't authenticate the api-core
          // JWT (different SECRET_KEY + username-vs-UUID mismatch). Treat
          // like offline for UI purposes so the page renders empty-state
          // rather than firehosing console errors.
          const unauthenticated = status === 401 || status === 403;
          if (offline || unauthenticated) {
            if (!this.testPrepWarned) {
              this.testPrepWarned = true;
              const reason = offline
                ? 'unreachable — to start it: `docker compose --profile full up -d test-prep`'
                : `returned ${status} (auth bridge not yet wired between api-core and test-prep; see P1-2)`;
              // eslint-disable-next-line no-console
              console.info(
                `[apiClient] test-prep microservice (:8200) ${reason}. Returning empty results.`,
              );
            }
            const url = error?.config?.url || '';
            // Best-effort shape match per endpoint so callers can `?.` chain.
            let data: any = {};
            if (url.includes('/history')) data = { history: [], total: 0 };
            else if (url.includes('/sessions')) data = null;
            else if (url.includes('/analytics/comprehensive')) data = { metrics: null, insights: [], trends: [], topic_mastery: [] };
            else if (url.includes('/analytics/insights')) data = { insights: [] };
            else if (url.includes('/analytics/predictions')) data = { predicted_score: null, confidence: null, factors: [] };
            else if (url.includes('/analytics/trends')) data = { trends: [] };
            else if (url.includes('/analytics/topic-mastery')) data = { topics: [] };
            else if (url.includes('/analytics/peer-comparison')) data = { percentile: null, peer_avg: null, your_avg: null };
            else if (url.includes('/analytics/performance-trends')) data = { trends: [] };
            else if (url.includes('/analytics/recent-activity')) data = { activities: [] };
            else if (url.includes('/analytics/readiness')) data = { score: null, level: null, breakdown: {} };
            else if (url.includes('/analytics/user-stats') || url.includes('/stats')) data = { stats: null };
            else if (url.includes('/analytics/recommendations')) data = { recommendations: [] };
            // Resolve instead of reject — page UIs treat empty as "nothing yet"
            return Promise.resolve({
              data,
              status: 0,
              statusText: offline ? 'test-prep service unavailable' : 'test-prep auth not bridged',
              headers: {},
              config: error?.config,
            });
          }
          return Promise.reject(error);
        },
      );
    }
    return this.testPrepClient;
  }

  // Adaptive Learning API
  async getNextAdaptiveQuestion(params: {
    exam_type?: string;
    subject?: string;
    topic?: string;
  }): Promise<any> {
    const response = await this.getTestPrepClient().post('/api/v1/adaptive/next-question', params);
    return response.data;
  }

  async submitAdaptiveAnswer(data: {
    question_id: string;
    user_answer: any;
    time_spent_seconds: number;
    hint_used?: boolean;
    confidence_level?: number;
  }): Promise<any> {
    const response = await this.getTestPrepClient().post('/api/v1/adaptive/submit-answer', data);
    return response.data;
  }

  async getAdaptiveLearningPath(examType: string): Promise<any> {
    const response = await this.getTestPrepClient().get('/api/v1/adaptive/learning-path', {
      params: { exam_type: examType }
    });
    return response.data;
  }

  // Questions API
  async getTestPrepQuestions(params?: {
    exam_type?: string;
    subject?: string;
    topic?: string;
    difficulty?: string;
    per_page?: number;
    page?: number;
  }): Promise<any> {
    const response = await this.getTestPrepClient().get('/api/v1/questions', { params });
    return response.data;
  }

  async getTestPrepQuestion(id: string): Promise<any> {
    const response = await this.getTestPrepClient().get(`/api/v1/questions/${id}`);
    return response.data;
  }

  // Exams API
  async generateExam(params: {
    exam_type: string;
    question_count: number;
    sections?: string[];
  }): Promise<any> {
    const response = await this.getTestPrepClient().post('/api/v1/exams/generate', params);
    return response.data;
  }

  async submitExam(examId: string, answers: any[]): Promise<any> {
    const response = await this.getTestPrepClient().post(`/api/v1/exams/${examId}/submit`, { answers });
    return response.data;
  }

  async getExamResults(examId: string): Promise<any> {
    const response = await this.getTestPrepClient().get(`/api/v1/exams/${examId}/results`);
    return response.data;
  }

  // Analytics API
  async getTestPrepAnalytics(params?: {
    exam_type?: string;
    time_range?: string;
  }): Promise<any> {
    const response = await this.getTestPrepClient().get('/api/v1/analytics/performance', { params });
    return response.data;
  }

  async getTopicPerformance(examType?: string): Promise<any> {
    const response = await this.getTestPrepClient().get('/api/v1/analytics/topics', {
      params: examType ? { exam_type: examType } : undefined
    });
    return response.data;
  }

  async getStudyPlan(examType?: string): Promise<any> {
    const response = await this.getTestPrepClient().get('/api/v1/analytics/study-plan', {
      params: examType ? { exam_type: examType } : undefined
    });
    return response.data;
  }

  // Test-prep microservice user-progress + achievements stubs.
  // Renamed from getUserProgress() to avoid colliding with the canonical
  // api-core implementation above (P0-5). The test-prep service hosts its
  // own per-question_attempts table that's distinct from the api-core
  // user_progress topic-level rollup.
  async getTestPrepUserProgress(): Promise<any> {
    const response = await this.getTestPrepClient().get('/api/v1/users/me/progress');
    return response.data;
  }

  async getUserAchievements(): Promise<any> {
    const response = await this.getTestPrepClient().get('/api/v1/users/me/achievements');
    return response.data;
  }

  async getUserStats(): Promise<any> {
    const response = await this.getTestPrepClient().get('/api/v1/users/me/stats');
    return response.data;
  }

  // ==================== Enhanced Adaptive Testing API ====================

  /**
   * Start a new adaptive testing session with IRT-based question selection
   */
  async startAdaptiveSession(data: {
    user_id: string;
    exam_type: string;
    section?: string;
    target_questions?: number;
  }): Promise<any> {
    const response = await this.getTestPrepClient().post('/api/v1/adaptive/session/start', data);
    return response.data;
  }

  /**
   * Submit response to a question in an adaptive session
   */
  async submitAdaptiveResponse(data: {
    session_id: string;
    question_id: string;
    answer_index: number;
    time_spent: number;
  }): Promise<any> {
    const response = await this.getTestPrepClient().post('/api/v1/adaptive/session/submit', data);
    return response.data;
  }

  /**
   * Get current status of adaptive session including ability estimate
   */
  async getAdaptiveSessionStatus(sessionId: string): Promise<any> {
    const response = await this.getTestPrepClient().get(`/api/v1/adaptive/session/${sessionId}/status`);
    return response.data;
  }

  /**
   * End an adaptive session
   */
  async endAdaptiveSession(sessionId: string): Promise<void> {
    await this.getTestPrepClient().post(`/api/v1/adaptive/session/${sessionId}/end`);
  }

  // ==================== Enhanced Analytics API ====================

  /**
   * Get comprehensive analytics including metrics, predictions, insights, trends, and recommendations
   */
  async getComprehensiveAnalytics(examType: string): Promise<any> {
    const response = await this.getTestPrepClient().get('/api/v1/analytics/comprehensive', {
      params: { exam_type: examType }
    });
    return response.data;
  }

  /**
   * Get multi-factor readiness score breakdown
   */
  async getReadinessScore(): Promise<any> {
    const response = await this.getTestPrepClient().get('/api/v1/analytics/readiness');
    return response.data;
  }

  /**
   * Get actionable insights about performance
   */
  async getInsights(examType: string): Promise<any> {
    const response = await this.getTestPrepClient().get('/api/v1/analytics/insights', {
      params: { exam_type: examType }
    });
    return response.data;
  }

  /**
   * Get predictions about future performance
   */
  async getPredictions(examType: string): Promise<any> {
    const response = await this.getTestPrepClient().get('/api/v1/analytics/predictions', {
      params: { exam_type: examType }
    });
    return response.data;
  }

  /**
   * Get performance trends with statistical analysis
   */
  async getTrends(examType: string): Promise<any> {
    const response = await this.getTestPrepClient().get('/api/v1/analytics/trends', {
      params: { exam_type: examType }
    });
    return response.data;
  }

  /**
   * Compare performance to peers
   */
  async getPeerComparison(examType: string): Promise<any> {
    const response = await this.getTestPrepClient().get('/api/v1/analytics/peer-comparison', {
      params: { exam_type: examType }
    });
    return response.data;
  }

  /**
   * Get personalized study recommendations
   */
  async getRecommendations(examType: string): Promise<any> {
    const response = await this.getTestPrepClient().get('/api/v1/analytics/recommendations', {
      params: { exam_type: examType }
    });
    return response.data;
  }

  /**
   * Get detailed mastery breakdown by topic
   */
  async getTopicMastery(examType: string): Promise<any> {
    const response = await this.getTestPrepClient().get('/api/v1/analytics/topic-mastery', {
      params: { exam_type: examType }
    });
    return response.data;
  }

  /**
   * Get recent user activity from analytics
   */
  async getRecentActivity(): Promise<any> {
    const response = await this.getTestPrepClient().get('/api/v1/analytics/recent-activity');
    return response.data;
  }

  /**
   * Get performance trends over a time period
   */
  async getPerformanceTrends(days: number = 7): Promise<any> {
    const response = await this.getTestPrepClient().get('/api/v1/analytics/performance-trends', {
      params: { days }
    });
    return response.data;
  }

  /**
   * Get user statistics summary
   */
  async getAnalyticsUserStats(): Promise<any> {
    const response = await this.getTestPrepClient().get('/api/v1/analytics/user-stats');
    return response.data;
  }

  // ==================== AI Study Planner API ====================

  /**
   * Generate personalized study plan using AI
   */
  async generateStudyPlan(data: {
    exam_type: string;
    target_date: string;
    target_score: number;
    current_score: number;
    weak_areas: string[];
    available_hours: number;
  }): Promise<any> {
    const response = await this.getTestPrepClient().post('/api/v1/study-planner/generate', data);
    return response.data;
  }

  /**
   * Get weekly plan details
   */
  async getWeeklyPlan(planId: string, week: number): Promise<any> {
    const response = await this.getTestPrepClient().get(`/api/v1/study-planner/plan/${planId}/week/${week}`);
    return response.data;
  }

  /**
   * Adjust study plan based on progress
   */
  async adjustStudyPlan(planId: string, adjustments: {
    new_target_date?: string;
    new_target_score?: number;
    new_available_hours?: number;
    completed_topics?: string[];
  }): Promise<any> {
    const response = await this.getTestPrepClient().post(`/api/v1/study-planner/plan/${planId}/adjust`, adjustments);
    return response.data;
  }

  /**
   * Get study recommendations for user
   */
  async getStudyRecommendations(userId: string): Promise<any> {
    const response = await this.getTestPrepClient().get('/api/v1/study-planner/recommendations', {
      params: { user_id: userId }
    });
    return response.data;
  }

  /**
   * Get adaptive study plan (legacy endpoint)
   */
  async getAdaptiveStudyPlan(examType: string): Promise<any> {
    const response = await this.getTestPrepClient().get('/api/v1/study-planner/adaptive', {
      params: { exam_type: examType }
    });
    return response.data;
  }

  // ==================== AI Content Generation API ====================

  /**
   * Generate AI-powered questions
   */
  async generateAIQuestions(data: {
    exam: string;
    topic: string;
    difficulty: string;
    count?: number;
  }): Promise<any> {
    const response = await this.getTestPrepClient().post('/api/v1/ai/generate/questions', data);
    return response.data;
  }

  /**
   * Get AI-generated explanation for a question
   */
  async getAIExplanation(data: {
    question: string;
    choices: string[];
    correct_answer: number;
    user_answer: number;
    topic: string;
  }): Promise<any> {
    const response = await this.getTestPrepClient().post('/api/v1/ai/explain', data);
    return response.data;
  }

  /**
   * Analyze performance using AI
   */
  async analyzePerformance(data: {
    user_id: string;
    exam_type: string;
    responses: any[];
  }): Promise<any> {
    const response = await this.getTestPrepClient().post('/api/v1/ai/analyze/performance', data);
    return response.data;
  }

  /**
   * Get AI capabilities and configuration
   */
  async getAICapabilities(): Promise<any> {
    const response = await this.getTestPrepClient().get('/api/v1/ai/capabilities');
    return response.data;
  }

  /**
   * Generate AI study plan (alternative endpoint)
   */
  async generateAIStudyPlan(data: {
    exam_type: string;
    target_date: string;
    target_score: number;
    current_score: number;
    weak_areas: string[];
    available_hours: number;
  }): Promise<any> {
    const response = await this.getTestPrepClient().post('/api/v1/ai/study-plan', data);
    return response.data;
  }

  // ==================== File Storage Service ====================

  private fileStorageClient!: AxiosInstance;

  private getFileStorageClient(): AxiosInstance {
    if (!this.fileStorageClient) {
      this.fileStorageClient = axios.create({
        baseURL: process.env.NEXT_PUBLIC_FILE_STORAGE_URL || 'http://localhost:8300',
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Add auth token interceptor
      this.fileStorageClient.interceptors.request.use(
        (config) => {
          const token = this.getToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        },
        (error) => Promise.reject(error)
      );
    }
    return this.fileStorageClient;
  }

  /**
   * Upload a file
   */
  async uploadFile(file: File, metadata?: {
    category?: string;
    tags?: string[];
    isPublic?: boolean;
  }): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }
    const response = await this.getFileStorageClient().post('/api/v1/files/upload', formData);
    return response.data;
  }

  /**
   * Get file by ID
   */
  async getFile(fileId: string): Promise<any> {
    const response = await this.getFileStorageClient().get(`/api/v1/files/${fileId}`);
    return response.data;
  }

  /**
   * Download file
   */
  async downloadFile(fileId: string): Promise<Blob> {
    const response = await this.getFileStorageClient().get(`/api/v1/files/${fileId}/download`, {
      responseType: 'blob'
    });
    return response.data;
  }

  /**
   * List user files
   */
  async listUserFiles(params?: {
    category?: string;
    skip?: number;
    limit?: number;
  }): Promise<any> {
    const response = await this.getFileStorageClient().get('/api/v1/files', { params });
    return response.data;
  }

  /**
   * Delete file
   */
  async deleteFile(fileId: string): Promise<void> {
    await this.getFileStorageClient().delete(`/api/v1/files/${fileId}`);
  }

  /**
   * Generate presigned URL for direct upload
   */
  async getPresignedUploadUrl(filename: string, contentType: string): Promise<any> {
    const response = await this.getFileStorageClient().post('/api/v1/files/presigned-url', {
      filename,
      contentType
    });
    return response.data;
  }

  // ==================== Notebook Service ====================

  private notebookClient!: AxiosInstance;

  private getNotebookClient(): AxiosInstance {
    if (!this.notebookClient) {
      this.notebookClient = axios.create({
        baseURL: process.env.NEXT_PUBLIC_NOTEBOOK_URL || 'http://localhost:8120',
        headers: { 'Content-Type': 'application/json' },
      });

      this.notebookClient.interceptors.request.use(
        (config) => {
          const token = this.getToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        },
        (error) => Promise.reject(error)
      );
    }
    return this.notebookClient;
  }

  /**
   * Get all notebooks for current user
   */
  async getNotebooks(): Promise<any> {
    const response = await this.getNotebookClient().get('/api/notebooks');
    return response.data;
  }

  /**
   * Get notebook by ID
   */
  async getNotebook(id: string): Promise<any> {
    const response = await this.getNotebookClient().get(`/api/notebooks/${id}`);
    return response.data;
  }

  /**
   * Create new notebook
   */
  async createNotebook(data: {
    title: string;
    description?: string;
    type?: string;
  }): Promise<any> {
    const response = await this.getNotebookClient().post('/api/notebooks', data);
    return response.data;
  }

  /**
   * Update notebook
   */
  async updateNotebook(id: string, data: any): Promise<any> {
    const response = await this.getNotebookClient().put(`/api/notebooks/${id}`, data);
    return response.data;
  }

  /**
   * Delete notebook
   */
  async deleteNotebook(id: string): Promise<void> {
    await this.getNotebookClient().delete(`/api/notebooks/${id}`);
  }

  /**
   * Execute notebook cell
   */
  async executeNotebookCell(notebookId: string, cellId: string, code: string): Promise<any> {
    const response = await this.getNotebookClient().post(`/api/notebooks/${notebookId}/cells/${cellId}/execute`, {
      code
    });
    return response.data;
  }

  // ==================== Analytics Service ====================

  private analyticsClient!: AxiosInstance;

  private getAnalyticsClient(): AxiosInstance {
    if (!this.analyticsClient) {
      this.analyticsClient = axios.create({
        baseURL: process.env.NEXT_PUBLIC_ANALYTICS_URL || 'http://localhost:8005',
        headers: { 'Content-Type': 'application/json' },
      });

      this.analyticsClient.interceptors.request.use(
        (config) => {
          const token = this.getToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        },
        (error) => Promise.reject(error)
      );
    }
    return this.analyticsClient;
  }

  /**
   * Get user analytics dashboard data
   */
  async getUserAnalytics(timeRange?: string): Promise<any> {
    const response = await this.getAnalyticsClient().get('/api/v1/analytics/user', {
      params: { time_range: timeRange }
    });
    return response.data;
  }

  /**
   * Get learning insights
   */
  async getLearningInsights(): Promise<any> {
    const response = await this.getAnalyticsClient().get('/api/v1/analytics/insights');
    return response.data;
  }

  /**
   * Track event
   */
  async trackEvent(event: {
    eventType: string;
    eventData: any;
    timestamp?: string;
  }): Promise<void> {
    await this.getAnalyticsClient().post('/api/v1/analytics/events', event);
  }

  // ==================== Video Lessons API ====================

  async getLessons(examType: string, sectionId?: string): Promise<any> {
    const params: any = { exam_type: examType };
    if (sectionId) params.section_id = sectionId;
    const response = await this.getTestPrepClient().get('/api/v1/lessons', { params });
    return response.data;
  }

  async getLesson(lessonId: string): Promise<any> {
    const response = await this.getTestPrepClient().get(`/api/v1/lessons/${lessonId}`);
    return response.data;
  }

  async getLessonProgress(examType: string, userId?: string): Promise<any> {
    const params: any = { exam_type: examType };
    if (userId) params.user_id = userId;
    const response = await this.getTestPrepClient().get(`/api/v1/lessons/progress/${examType}`, { params });
    return response.data;
  }

  async updateLessonProgress(data: { lesson_id: string; position_seconds: number; duration_seconds: number }): Promise<any> {
    const response = await this.getTestPrepClient().post('/api/v1/lessons/progress', data);
    return response.data;
  }

  async seedLessons(lessons: any[]): Promise<any> {
    const response = await this.getTestPrepClient().post('/api/v1/lessons/seed', { lessons });
    return response.data;
  }

  // ==================== Notes API ====================

  async getNotes(examType: string, params?: { section_id?: string; lesson_id?: string; pinned_only?: boolean }): Promise<any> {
    const response = await this.getTestPrepClient().get('/api/v1/notes', {
      params: { exam_type: examType, ...params }
    });
    return response.data;
  }

  async createNote(data: { exam_type: string; content: string; title?: string; lesson_id?: string; section_id?: string; topic?: string; color_label?: string; video_timestamp_seconds?: number }): Promise<any> {
    const response = await this.getTestPrepClient().post('/api/v1/notes', data);
    return response.data;
  }

  async updateNote(noteId: string, data: any): Promise<any> {
    const response = await this.getTestPrepClient().put(`/api/v1/notes/${noteId}`, data);
    return response.data;
  }

  async deleteNote(noteId: string): Promise<void> {
    await this.getTestPrepClient().delete(`/api/v1/notes/${noteId}`);
  }

  // ==================== QBank API ====================

  async createQBankSession(data: {
    exam_type: string;
    mode?: string;
    section_ids?: string[];
    topics?: string[];
    difficulty?: string;
    question_count?: number;
    time_limit_seconds?: number;
    patent_filters?: {
      aia_era?: string;
      content_types?: string[];
      question_formats?: string[];
      trap_types?: string[];
    };
  }): Promise<any> {
    // CISSP uses dedicated endpoints that match the actual PostgreSQL schema
    const prefix = data.exam_type === 'CISSP' ? '/api/v1/qbank/cissp' : '/api/v1/qbank';
    const response = await this.getTestPrepClient().post(`${prefix}/sessions`, data);
    return response.data;
  }

  // Store the exam type for routing subsequent calls
  private _lastSessionExamType: string = '';

  async getQBankSession(sessionId: string): Promise<any> {
    const response = await this.getTestPrepClient().get(`/api/v1/qbank/sessions/${sessionId}`);
    return response.data;
  }

  async getQBankQuestion(sessionId: string, index: number): Promise<any> {
    // Try CISSP endpoint first, fall back to generic
    try {
      const response = await this.getTestPrepClient().get(`/api/v1/qbank/cissp/sessions/${sessionId}/question/${index}`);
      return response.data;
    } catch {
      const response = await this.getTestPrepClient().get(`/api/v1/qbank/sessions/${sessionId}/question/${index}`);
      return response.data;
    }
  }

  async submitQBankAnswer(sessionId: string, data: { question_id: string | number; answer_index: number; time_spent_seconds?: number; flagged?: boolean }): Promise<any> {
    // Try CISSP endpoint first, fall back to generic
    try {
      const response = await this.getTestPrepClient().post(`/api/v1/qbank/cissp/sessions/${sessionId}/answer`, data);
      return response.data;
    } catch {
      const response = await this.getTestPrepClient().post(`/api/v1/qbank/sessions/${sessionId}/answer`, data);
      return response.data;
    }
  }

  async completeQBankSession(sessionId: string): Promise<any> {
    try {
      const response = await this.getTestPrepClient().post(`/api/v1/qbank/cissp/sessions/${sessionId}/complete`);
      return response.data;
    } catch {
      const response = await this.getTestPrepClient().post(`/api/v1/qbank/sessions/${sessionId}/complete`);
      return response.data;
    }
  }

  async getQBankHistory(examType: string): Promise<any> {
    const response = await this.getTestPrepClient().get('/api/v1/qbank/history', {
      params: { exam_type: examType }
    });
    return response.data;
  }

  async getQBankStats(examType: string): Promise<any> {
    // CISSP uses dedicated stats endpoint
    if (examType === 'CISSP') {
      const response = await this.getTestPrepClient().get('/api/v1/qbank/cissp/stats');
      return response.data;
    }
    const response = await this.getTestPrepClient().get('/api/v1/qbank/stats', {
      params: { exam_type: examType }
    });
    return response.data;
  }

  // ==================== Patent Bar (MPEP analytics & bookmarks) ====================

  /**
   * Patent Bar Command Center analytics.
   *
   * Prefers the api-core auth-protected endpoint (P1-3,
   * `/api/v1/me/patent-bar/analytics`) which reads from user_progress
   * and works without the test-prep microservice. Falls back to the
   * test-prep `/api/v1/patent-bar/analytics?user_id=…` endpoint when
   * api-core returns nothing useful — test-prep has richer per-question
   * detail (MPEP chapter, statute, trap_type buckets) that api-core
   * can't compute from rolled-up progress data.
   */
  async getPatentBarAnalytics(userId?: string): Promise<any> {
    // 1) Try api-core (auth-protected).
    try {
      const r = await this.client.get('/api/v1/me/patent-bar/analytics');
      const data = r.data || {};
      // Only short-circuit if api-core actually has data. Otherwise fall
      // through to test-prep for the richer buckets.
      if ((data.weakness_by_topic?.length ?? 0) > 0 || (data.total_answered ?? 0) > 0) {
        return data;
      }
    } catch {
      // api-core unreachable or 4xx — fall through.
    }
    // 2) Fall back to test-prep (no auth bridge — see task #51).
    const response = await this.getTestPrepClient().get('/api/v1/patent-bar/analytics', {
      params: { user_id: userId || 'demo_user' },
    });
    return response.data;
  }

  async getMpepBookmarks(userId?: string): Promise<any> {
    const response = await this.getTestPrepClient().get('/api/v1/patent-bar/bookmarks', {
      params: { user_id: userId || 'demo_user' },
    });
    return response.data;
  }

  async createMpepBookmark(data: {
    title: string;
    url: string;
    chapter?: string;
    notes?: string;
    sort_order?: number;
    user_id?: string;
  }): Promise<any> {
    const response = await this.getTestPrepClient().post('/api/v1/patent-bar/bookmarks', data);
    return response.data;
  }

  async deleteMpepBookmark(bookmarkId: string, userId?: string): Promise<any> {
    const response = await this.getTestPrepClient().delete('/api/v1/patent-bar/bookmarks/' + bookmarkId, {
      params: { user_id: userId || 'demo_user' },
    });
    return response.data;
  }

  async createFlashcardsFromMisses(limit?: number, userId?: string): Promise<any> {
    const response = await this.getTestPrepClient().post('/api/v1/patent-bar/flashcards/from-misses', {
      user_id: userId || 'demo_user',
      limit: limit ?? 25,
    });
    return response.data;
  }

  /**
   * Patent Bar review queue. Same provider preference as analytics
   * above — api-core (P1-3) first, test-prep fallback. api-core's
   * version returns weak topics from user_progress; test-prep's
   * returns SRS flashcards anchored to missed questions.
   */
  async getPatentBarReviewQueue(limit?: number, userId?: string): Promise<any> {
    try {
      const r = await this.client.get('/api/v1/me/patent-bar/review-queue', {
        params: { limit: limit ?? 30 },
      });
      const data = r.data || {};
      if ((data.cards?.length ?? 0) > 0) {
        return data;
      }
    } catch {
      // fall through
    }
    const response = await this.getTestPrepClient().get('/api/v1/patent-bar/review-queue', {
      params: { user_id: userId || 'demo_user', limit: limit ?? 30 },
    });
    return response.data;
  }

  async getPatentLiveOfficeHours(): Promise<{
    exam_type: string;
    scheduling_connected: boolean;
    slots: Array<{
      id: string;
      label: string;
      cadence: string;
      time_local: string;
      topic_focus: string;
      duration_min: number;
      join_url: string | null;
      next_occurrence_at: string | null;
    }>;
  }> {
    const response = await this.getTestPrepClient().get('/api/v1/patent-bar/live/office-hours');
    return response.data;
  }

  async getPatentLiveCohorts(): Promise<{
    exam_type: string;
    cohorts: Array<{
      id: string;
      name: string;
      description: string;
      weeks_planned: number;
      start_window: string;
      capacity_planned: number | null;
      enrolled_count: number;
      enrollment_open: boolean;
    }>;
  }> {
    const response = await this.getTestPrepClient().get('/api/v1/patent-bar/live/cohorts');
    return response.data;
  }

  // ==================== Patent Bar — cohort, chat, study groups ====================

  async upsertPatentCommunityProfile(data: {
    exam_type?: string;
    user_id: string;
    display_name: string;
    avatar_url?: string | null;
    tagline?: string | null;
  }): Promise<{ status: string; id: string }> {
    const response = await this.getTestPrepClient().post('/api/v1/patent-bar/community/profile', data);
    return response.data;
  }

  async getPatentCommunityRoster(examType?: string): Promise<{
    exam_type: string;
    learners: Array<{
      user_id: string;
      display_name: string;
      avatar_url: string | null;
      tagline: string | null;
      updated_at: string | null;
    }>;
  }> {
    const response = await this.getTestPrepClient().get('/api/v1/patent-bar/community/roster', {
      params: { exam_type: examType || 'PATENT_BAR' },
    });
    return response.data;
  }

  async getPatentCommunityMessages(params: {
    exam_type?: string;
    group_id?: string | null;
    limit?: number;
  }): Promise<{ exam_type: string; group_id: string | null; messages: Array<{
    id: string;
    user_id: string;
    display_name: string | null;
    body: string;
    created_at: string | null;
  }> }> {
    const response = await this.getTestPrepClient().get('/api/v1/patent-bar/community/messages', {
      params: {
        exam_type: params.exam_type || 'PATENT_BAR',
        group_id: params.group_id || undefined,
        limit: params.limit ?? 80,
      },
    });
    return response.data;
  }

  async postPatentCommunityMessage(data: {
    exam_type?: string;
    user_id: string;
    display_name?: string;
    body: string;
    group_id?: string | null;
  }): Promise<{ id: string; status: string }> {
    const response = await this.getTestPrepClient().post('/api/v1/patent-bar/community/messages', data);
    return response.data;
  }

  async getPatentStudyGroups(examType?: string, userId?: string): Promise<{
    exam_type: string;
    groups: Array<{
      id: string;
      name: string;
      description: string | null;
      created_by: string;
      created_at: string | null;
      member_count: number;
      is_member: boolean;
    }>;
  }> {
    const response = await this.getTestPrepClient().get('/api/v1/patent-bar/community/groups', {
      params: { exam_type: examType || 'PATENT_BAR', user_id: userId },
    });
    return response.data;
  }

  async createPatentStudyGroup(data: {
    exam_type?: string;
    name: string;
    description?: string;
    created_by: string;
  }): Promise<{ id: string; status: string }> {
    const response = await this.getTestPrepClient().post('/api/v1/patent-bar/community/groups', data);
    return response.data;
  }

  async joinPatentStudyGroup(groupId: string, userId: string): Promise<{ status: string }> {
    const response = await this.getTestPrepClient().post(
      `/api/v1/patent-bar/community/groups/${groupId}/join`,
      { user_id: userId }
    );
    return response.data;
  }

  // ==================== Flashcards API ====================

  async getFlashcards(examType: string, sectionId?: string): Promise<any> {
    const params: any = { exam_type: examType };
    if (sectionId) params.section_id = sectionId;
    const response = await this.getTestPrepClient().get('/api/v1/flashcards', { params });
    return response.data;
  }

  async getDueFlashcards(examType: string, limit?: number): Promise<any> {
    const params: any = { exam_type: examType };
    if (limit) params.limit = limit;
    const response = await this.getTestPrepClient().get('/api/v1/flashcards/due', { params });
    return response.data;
  }

  async reviewFlashcard(data: { flashcard_id: string; rating: number }): Promise<any> {
    const response = await this.getTestPrepClient().post('/api/v1/flashcards/review', data);
    return response.data;
  }

  async getFlashcardStats(examType: string): Promise<any> {
    const response = await this.getTestPrepClient().get('/api/v1/flashcards/stats', {
      params: { exam_type: examType }
    });
    return response.data;
  }

  async createFlashcard(data: { exam_type: string; front: string; back: string; section_id?: string; topic?: string; hint?: string; difficulty?: string }): Promise<any> {
    const response = await this.getTestPrepClient().post('/api/v1/flashcards', data);
    return response.data;
  }

  async deleteFlashcard(cardId: string): Promise<void> {
    await this.getTestPrepClient().delete(`/api/v1/flashcards/${cardId}`);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
