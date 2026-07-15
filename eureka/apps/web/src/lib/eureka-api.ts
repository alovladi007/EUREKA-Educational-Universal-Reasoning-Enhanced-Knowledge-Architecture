/**
 * Tiny client-side helper used by every Phase 9–14 page.
 * Reads access_token from localStorage and prepends the API URL/prefix.
 */

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
export const API_PREFIX =
  process.env.NEXT_PUBLIC_API_PREFIX || "/api/v1";

export class ApiError extends Error {
  status: number;
  detail: unknown;
  constructor(status: number, detail: unknown, message?: string) {
    super(message || `HTTP ${status}`);
    this.status = status;
    this.detail = detail;
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("access_token");
}

/**
 * Decode-only check (no signature verify — the server does that). Returns
 * true when the token is malformed or `exp` is past (with 30s skew).
 * Used to pre-emptively drop stale tokens before they cause a 401.
 */
function jwtIsExpiredOrInvalid(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
    const payload = JSON.parse(atob(padded)) as { exp?: number };
    if (typeof payload.exp !== "number") return true;
    const nowSec = Math.floor(Date.now() / 1000);
    return payload.exp - 30 <= nowSec;
  } catch {
    return true;
  }
}

/**
 * Dev-mode convenience: when no `access_token` is in localStorage, silently
 * log in with the seeded admin and stash the result so every Phase 9-15 page
 * "just works" without a login prompt. Disabled by setting
 * `NEXT_PUBLIC_DEV_AUTO_LOGIN=0` in the env, or by stashing your own token in
 * localStorage before page load.
 */
const DEV_AUTO_LOGIN_EMAIL = "you@eureka.example.com";
const DEV_AUTO_LOGIN_PW = "EurekaAdmin!2026";
// P1.3a: hard-gate to non-production. Previously on by default in EVERY
// build (only NEXT_PUBLIC_DEV_AUTO_LOGIN=0 disabled it), so a production
// bundle would silently self-login as the seeded admin on any 401 — a
// real auth-bypass. NODE_ENV is inlined at build time, so `next build`
// (NODE_ENV=production) hard-disables this regardless of the public env
// var; the explicit opt-out still works in dev/test.
const DEV_AUTO_LOGIN_ENABLED =
  process.env.NODE_ENV !== "production" &&
  process.env.NEXT_PUBLIC_DEV_AUTO_LOGIN !== "0";

// Share the in-flight dev-login promise GLOBALLY (across both this fetch
// wrapper and the axios apiClient in src/lib/api-client.ts). Without
// this, two clients firing in parallel each kick off their own
// POST /auth/login and you get double-logins on every page load.
declare global {
  interface Window {
    __eurekaDevLoginPromise?: Promise<string | null> | null;
  }
}

export async function devAutoLogin(): Promise<string | null> {
  if (!DEV_AUTO_LOGIN_ENABLED || typeof window === "undefined") return null;
  // Only one in-flight login request at a time, shared across all clients.
  if (window.__eurekaDevLoginPromise) return window.__eurekaDevLoginPromise;
  window.__eurekaDevLoginPromise = (async () => {
    try {
      const r = await fetch(`${API_URL}${API_PREFIX}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: DEV_AUTO_LOGIN_EMAIL,
          password: DEV_AUTO_LOGIN_PW,
        }),
      });
      if (!r.ok) return null;
      const body = await r.json();
      const tok = body?.access_token as string | undefined;
      if (tok) {
        window.localStorage.setItem("access_token", tok);
        return tok;
      }
    } catch {
      /* network failure — fall through */
    } finally {
      // Allow retry on next call if this one failed.
      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.__eurekaDevLoginPromise = null;
        }
      }, 1500);
    }
    return null;
  })();
  return window.__eurekaDevLoginPromise;
}

export async function api<T = unknown>(
  path: string,
  init: RequestInit & { auth?: boolean; _retry?: boolean } = {},
): Promise<T> {
  const { auth = true, headers, _retry = false, ...rest } = init;
  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };
  if (auth) {
    let tok = getToken();
    // Stale-token check: if the cached JWT is already expired (or
    // malformed), drop it + force a fresh dev auto-login. Prevents the
    // 401-noise-then-recover pattern on page load.
    if (tok && jwtIsExpiredOrInvalid(tok)) {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("access_token");
      }
      tok = null;
    }
    // No token at all → fetch one silently with the seeded dev admin.
    if (!tok) tok = await devAutoLogin();
    if (tok) finalHeaders["Authorization"] = `Bearer ${tok}`;
  }
  const r = await fetch(`${API_URL}${API_PREFIX}${path}`, {
    ...rest,
    headers: finalHeaders,
  });
  if (r.status === 204) return undefined as unknown as T;
  let body: unknown;
  try {
    body = await r.json();
  } catch {
    body = await r.text();
  }
  if (!r.ok) {
    // 401: dev-auto-login is enabled? Clear stale token, try once more.
    if (r.status === 401 && auth && !_retry && typeof window !== "undefined") {
      window.localStorage.removeItem("access_token");
      window.localStorage.removeItem("accessToken");
      const fresh = await devAutoLogin();
      if (fresh) {
        return api(path, { ...init, _retry: true });
      }
      // Auto-login is off or failed → fall back to redirect.
      const here = window.location.pathname + window.location.search;
      if (!here.startsWith("/auth/login")) {
        window.location.replace(`/auth/login?next=${encodeURIComponent(here)}`);
        return new Promise<never>(() => {}) as unknown as T;
      }
    }
    const detail =
      (typeof body === "object" && body && "detail" in body && (body as { detail: unknown }).detail) ||
      body;
    throw new ApiError(r.status, detail, `${r.status} on ${path}`);
  }
  return body as T;
}

export function formatPrice(cents: number, currency = "USD"): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(cents / 100);
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}
