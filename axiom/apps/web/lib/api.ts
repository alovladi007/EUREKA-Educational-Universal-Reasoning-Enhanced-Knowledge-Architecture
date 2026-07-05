// Typed fetch wrapper for the AXIOM API.
//
// AXIOM reuses EUREKA's auth. EUREKA's web app stores its JWT in
// localStorage under the key "access_token". We read that same token here
// and send it as an Authorization: Bearer header on every request.

export const AXIOM_API_URL =
  process.env.NEXT_PUBLIC_AXIOM_API_URL || 'http://localhost:8400';

export const EUREKA_LOGIN_URL =
  process.env.NEXT_PUBLIC_EUREKA_LOGIN_URL || 'http://localhost:4040/auth/login';

// The localStorage key that EUREKA's web app writes the JWT to.
export const TOKEN_STORAGE_KEY = 'access_token';

// A module descriptor as returned by the dashboard summary. "available"
// modules are wired up, "planned" modules are shown but not yet built.
export interface Module {
  key: string;
  name: string;
  status: 'available' | 'planned';
  description: string;
}

// The signed-in user as returned by GET /api/v1/me.
export interface Me {
  id: string;
  email: string;
  display_name: string;
  roles: string[];
  tenant_id: string;
}

// The dashboard payload returned by GET /api/v1/dashboard/summary.
export interface DashboardSummary {
  user: {
    id: string;
    email: string;
    display_name: string;
    roles: string[];
  };
  modules: Module[];
  mastery_summary: null;
}

// The shape returned by GET /health.
export interface HealthResponse {
  status: string;
  service: string;
  version: string;
}

// A typed error thrown for any non-2xx response. Callers can inspect the
// status to distinguish auth failures (401/403) from other errors.
export class ApiError extends Error {
  readonly status: number;
  readonly body: string;

  constructor(status: number, message: string, body: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

// Read the EUREKA JWT from localStorage. Returns null on the server (where
// there is no localStorage) or when no token has been stored.
export function getToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    return window.localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

// Perform an authenticated GET against the AXIOM API and parse the JSON
// body as T. Throws ApiError on any non-2xx response.
export async function apiGet<T>(path: string): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = `${AXIOM_API_URL}${path}`;
  let res: Response;
  try {
    res = await fetch(url, { headers, cache: 'no-store' });
  } catch (err) {
    // Network-level failure (server down, CORS, DNS, etc.).
    const message = err instanceof Error ? err.message : 'network error';
    throw new ApiError(0, `Request to ${path} failed: ${message}`, '');
  }

  if (!res.ok) {
    let body = '';
    try {
      body = await res.text();
    } catch {
      body = '';
    }
    throw new ApiError(
      res.status,
      `Request to ${path} returned ${res.status}`,
      body,
    );
  }

  return (await res.json()) as T;
}

// Convenience helpers for the three endpoints the dashboard uses.
export function fetchMe(): Promise<Me> {
  return apiGet<Me>('/api/v1/me');
}

export function fetchDashboardSummary(): Promise<DashboardSummary> {
  return apiGet<DashboardSummary>('/api/v1/dashboard/summary');
}

export function fetchHealth(): Promise<HealthResponse> {
  return apiGet<HealthResponse>('/health');
}
