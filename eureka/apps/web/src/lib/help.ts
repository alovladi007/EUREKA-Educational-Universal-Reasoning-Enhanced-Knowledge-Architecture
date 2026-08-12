/**
 * Client for the in-app helper (api-core /api/v1/help/*).
 *
 * The helper answers from a registry of what the platform really does, or
 * hands the question to an administrator. There is no third branch, which is
 * why `handled` and `should_escalate` are both on the response: the first says
 * whether it recognised the question, the second whether it thinks a human is
 * needed. A reader can always escalate anyway.
 */

import { api } from "@/lib/api";

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
  /** True only when a language model actually wrote the text. */
  ai_generated: boolean;
  provider: string;
  should_escalate: boolean;
  escalate_reason: string;
}

export interface HelpTopic {
  key: string;
  title: string;
  route: string;
  summary: string;
  tasks: string[];
  restricted: boolean;
}

export async function askHelp(
  question: string,
  pagePath?: string,
): Promise<HelpAnswer> {
  const { data } = await api.post<HelpAnswer>("/help/ask", {
    question,
    page_path: pagePath ?? null,
  });
  return data;
}

export async function escalateHelp(input: {
  question: string;
  page_path?: string;
  topic_keys?: string[];
  reason?: string;
}): Promise<{ id: string; reference: string; message: string }> {
  const { data } = await api.post("/help/escalate", {
    question: input.question,
    page_path: input.page_path ?? null,
    topic_keys: input.topic_keys ?? [],
    reason: input.reason ?? "no_match",
  });
  return data;
}

export async function fetchHelpTopics(): Promise<HelpTopic[]> {
  const { data } = await api.get<{ topics: HelpTopic[] }>("/help/topics");
  return data.topics;
}

export interface HelpRequestRow {
  id: string;
  reference: string;
  question: string;
  page_path: string | null;
  topic_keys: string[];
  reason: string;
  status: string;
  resolution: string | null;
  created_at: string | null;
}

/** The escalation queue. Administrators only; the API enforces it. */
export async function fetchHelpRequests(
  status = "open",
): Promise<HelpRequestRow[]> {
  const { data } = await api.get<{ requests: HelpRequestRow[] }>(
    `/help/requests?status=${encodeURIComponent(status)}`,
  );
  return data.requests;
}

export async function resolveHelpRequest(
  id: string,
  resolution: string,
): Promise<void> {
  await api.post(`/help/requests/${id}/resolve`, { resolution });
}
