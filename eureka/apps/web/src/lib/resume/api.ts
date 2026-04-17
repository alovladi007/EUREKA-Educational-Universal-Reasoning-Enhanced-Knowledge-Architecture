/**
 * Resume API client methods.
 * Communicates with the FastAPI backend for resume CRUD, sharing, and versioning.
 */

const _url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const _prefix = process.env.NEXT_PUBLIC_API_PREFIX || "/api/v1";
const API_BASE = `${_url}${_prefix}`;

function getHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || `API error: ${res.status}`);
  }
  return res.json();
}

// ── Resume CRUD ──────────────────────────────────────────────

export async function apiCreateResume(data: {
  title: string;
  template_id?: string;
  data?: Record<string, unknown>;
}) {
  const res = await fetch(`${API_BASE}/resumes`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function apiListResumes() {
  const res = await fetch(`${API_BASE}/resumes`, { headers: getHeaders() });
  return handleResponse<Array<Record<string, unknown>>>(res);
}

export async function apiGetResume(id: string) {
  const res = await fetch(`${API_BASE}/resumes/${id}`, { headers: getHeaders() });
  return handleResponse(res);
}

export async function apiUpdateResume(id: string, data: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/resumes/${id}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function apiDeleteResume(id: string) {
  const res = await fetch(`${API_BASE}/resumes/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete resume");
}

export async function apiDuplicateResume(id: string) {
  const res = await fetch(`${API_BASE}/resumes/${id}/duplicate`, {
    method: "POST",
    headers: getHeaders(),
  });
  return handleResponse(res);
}

// ── Sharing ──────────────────────────────────────────────────

export async function apiUpdateShare(id: string, data: { is_public: boolean; slug?: string }) {
  const res = await fetch(`${API_BASE}/resumes/${id}/share`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function apiGetPublicResume(slug: string) {
  const res = await fetch(`${API_BASE}/resumes/shared/${slug}`);
  return handleResponse(res);
}

// ── Versions ─────────────────────────────────────────────────

export async function apiCreateVersion(resumeId: string, data: { label?: string; data: Record<string, unknown> }) {
  const res = await fetch(`${API_BASE}/resumes/${resumeId}/versions`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function apiListVersions(resumeId: string) {
  const res = await fetch(`${API_BASE}/resumes/${resumeId}/versions`, { headers: getHeaders() });
  return handleResponse<Array<Record<string, unknown>>>(res);
}

// ── AI (placeholder for Phase 5 backend integration) ─────────

export async function apiGenerateSummary(data: { title: string; years: string; experience?: unknown[]; target_role?: string }) {
  const res = await fetch(`${API_BASE}/resumes/ai/generate-summary`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<{ variants: string[] }>(res);
}

export async function apiImproveBullet(data: { bullet: string; context?: string }) {
  const res = await fetch(`${API_BASE}/resumes/ai/improve-bullet`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<{ improved: string[] }>(res);
}

export async function apiATSScore(data: { resume_data: Record<string, unknown>; job_description?: string }) {
  const res = await fetch(`${API_BASE}/resumes/ai/ats-score`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function apiGenerateBullets(data: { action?: string; bullet?: string; title?: string; company?: string; context?: string }) {
  const res = await fetch(`${API_BASE}/resumes/ai/generate-bullets`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<{ bullets: string[] }>(res);
}

export async function apiTailorResume(data: { resume_data: Record<string, unknown>; job_description: string }) {
  const res = await fetch(`${API_BASE}/resumes/ai/tailor`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function apiSuggestSkills(data: { title: string; experience?: unknown[]; education?: unknown[] }) {
  const res = await fetch(`${API_BASE}/resumes/ai/suggest-skills`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<{ suggested_skills: Array<{ skill: string; category: string; relevance: string }> }>(res);
}

export async function apiCheckTone(data: { text: string }) {
  const res = await fetch(`${API_BASE}/resumes/ai/check-tone`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<{ issues: Array<{ original: string; suggestion: string; reason: string }>; tone_score: number }>(res);
}

// ── Export endpoints ─────────────────────────────────────────

export async function apiExportPDF(data: { resume_id: string; template_id?: string; paper_size?: string }) {
  const res = await fetch(`${API_BASE}/exports/pdf`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<{ job_id: string; status: string }>(res);
}

export async function apiExportStatus(jobId: string) {
  const res = await fetch(`${API_BASE}/exports/status/${jobId}`, { headers: getHeaders() });
  return handleResponse<{ job_id: string; status: string; file_url?: string }>(res);
}

export async function apiListTemplates() {
  const res = await fetch(`${API_BASE}/exports/templates`);
  return handleResponse<Array<{ id: string; name: string; description: string; best_for: string }>>(res);
}

