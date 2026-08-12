/**
 * Client for EUREKA's in-app helper, called from inside AXIOM.
 *
 * WHY IT TALKS TO EUREKA AND NOT TO AXIOM'S OWN API
 *
 * There is one helper for the whole platform, and one support queue behind it.
 * A learner stuck in the mathematics module has the same questions as anyone
 * else ("where are my notes", "how do I change my password") and their
 * escalation has to land in the same place a EUREKA one does - otherwise
 * support is watching two queues and the second one is the one nobody checks.
 *
 * So this is a cross-origin call to api-core. That needs AXIOM's origin in
 * api-core's CORS_ORIGINS; without it the preflight is refused and the Help
 * button is dead on arrival, which is exactly how it shipped the first time.
 *
 * The token is the same EUREKA JWT the SSO handoff put in localStorage, so
 * api-core authenticates it without any extra plumbing.
 */

import { getToken } from '@/lib/api';

export const EUREKA_API_URL =
  process.env.NEXT_PUBLIC_EUREKA_API_URL || 'http://localhost:8000';

export const EUREKA_WEB_URL =
  process.env.NEXT_PUBLIC_EUREKA_WEB_URL || 'http://localhost:4040';

export interface HelpLink {
  label: string;
  href: string;
  restricted: boolean;
}

export interface HelpAnswer {
  handled: boolean;
  answer: string;
  links: HelpLink[];
  topics?: string[];
  kb_slugs?: string[];
  /** True only when a language model actually wrote the text. */
  ai_generated: boolean;
  provider: string;
  should_escalate: boolean;
  escalate_reason: string;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const token = getToken();
  const res = await fetch(`${EUREKA_API_URL}/api/v1${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(
      res.status === 401
        ? 'Your session has expired. Sign in again to use the helper.'
        : `The helper is not reachable right now (${res.status}).`,
    );
  }
  return (await res.json()) as T;
}

export function askHelp(question: string, pagePath?: string): Promise<HelpAnswer> {
  return post<HelpAnswer>('/help/ask', {
    question,
    page_path: pagePath ? `AXIOM ${pagePath}` : 'AXIOM',
  });
}

export function escalateHelp(input: {
  question: string;
  page_path?: string;
  topic_keys?: string[];
  reason?: string;
}): Promise<{ ticket_id: string; reference: string; message: string }> {
  return post('/help/escalate', {
    question: input.question,
    // Prefixed so whoever picks the ticket up knows which app they were in
    // without having to ask. A bare "/learn/DM03" is ambiguous across three
    // apps that all have a /learn.
    page_path: input.page_path ? `AXIOM ${input.page_path}` : 'AXIOM',
    topic_keys: input.topic_keys ?? [],
    reason: input.reason ?? 'no_match',
  });
}

/**
 * A help link, made absolute when it points back at EUREKA.
 *
 * The registry stores EUREKA-relative routes like `/dashboard/settings`. Inside
 * AXIOM those would resolve against localhost:4100 and 404, so anything that
 * is not an AXIOM route is rewritten to the EUREKA origin.
 */
export function resolveHelpHref(href: string): string {
  if (/^https?:\/\//.test(href)) return href;
  if (href.startsWith('/learn') || href.startsWith('/practice')) return href;
  return `${EUREKA_WEB_URL}${href}`;
}
