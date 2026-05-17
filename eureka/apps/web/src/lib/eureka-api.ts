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

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("access_token");
}

export async function api<T = unknown>(
  path: string,
  init: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const { auth = true, headers, ...rest } = init;
  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };
  if (auth) {
    const tok = getToken();
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
