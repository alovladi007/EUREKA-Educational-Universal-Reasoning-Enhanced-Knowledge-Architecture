// API Types
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  display_name?: string;
  role: 'super_admin' | 'org_admin' | 'teacher' | 'student' | 'parent';
  org_id: string;
  avatar_url?: string;
  phone?: string;
  bio?: string;
  location?: string;
  date_of_birth?: string;
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
  /** ISO timestamp of the user's most recent successful login, when surfaced
   *  by api-core. Optional because not all endpoints include it. */
  last_login_at?: string | null;
}

/** AI tutor chat-message wire shape — produced by api-core's /tutor endpoint
 *  and consumed by the /dashboard/tutor page. Kept here so the page doesn't
 *  re-declare a local type. */
export interface TutorMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  /** ISO timestamp. The api-core canonical field; both server-rendered
   *  messages and locally-instantiated ones use this. */
  timestamp: string;
  /** Alias retained for callers that still read `created_at`. */
  created_at?: string;
  /** Optional list of source IDs referenced when role === 'assistant'. */
  sources?: string[];
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  tier: string;
  email?: string;
  phone?: string;
  website?: string;
  is_active: boolean;
  is_verified: boolean;
}

export interface Course {
  id: string;
  org_id: string;
  title: string;
  code?: string;
  description?: string;
  tier: string;
  instructor_id?: string;
  subject?: string;
  level?: string;
  credits?: number;
  is_published: boolean;
  is_archived: boolean;
  start_date?: string;
  end_date?: string;
  created_at: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  status: string;
  progress_percent: number;
  mastery_level: number;
  enrolled_at: string;
  completed_at?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  points: number;
  tier: string;
  category: string;
  requirements: Record<string, any>;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  org_id: string;
  date_of_birth?: string;
  parent_email?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface ApiError {
  detail: string;
}

// ── SRS (Spaced-Repetition flashcards, P1-4) ──────────────────────
// Mirrors the api-core SrsCardOut / SrsStats Pydantic schemas. The
// SRS endpoints live under /api/v1/me/srs/* and use the SM-2 algorithm
// for scheduling (see services/api-core/app/models/srs_card.py).

export interface SrsCard {
  id: string;
  user_id: string;
  deck: string;
  front: string;
  back: string;
  tags: Record<string, unknown> | null;
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  next_review: string;       // ISO timestamp
  last_review: string | null;
  total_reviews: number;
  total_correct: number;
  created_at: string;
  updated_at: string;
}

export interface SrsStats {
  deck: string | null;
  total_cards: number;
  due_now: number;
  learning: number;          // repetitions < 2
  mature: number;            // interval_days ≥ 21
  reviews_today: number;
  average_ease: number;
}
