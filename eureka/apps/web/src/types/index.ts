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
