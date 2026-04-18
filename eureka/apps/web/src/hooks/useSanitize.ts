"use client";

/**
 * Basic input sanitization for resume content.
 * Strips HTML tags and dangerous patterns to prevent XSS.
 * In production, use DOMPurify for comprehensive sanitization.
 */

const HTML_TAG_RE = /<[^>]*>/g;
const SCRIPT_RE = /javascript:|on\w+\s*=/gi;
const ENTITY_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function sanitizeText(input: string): string {
  if (!input) return input;
  // Remove HTML tags
  let clean = input.replace(HTML_TAG_RE, "");
  // Remove javascript: and event handlers
  clean = clean.replace(SCRIPT_RE, "");
  return clean.trim();
}

export function escapeHtml(input: string): string {
  return input.replace(/[&<>"']/g, (char) => ENTITY_MAP[char] || char);
}

/**
 * Sanitize all string fields in an object recursively.
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const result = { ...obj };
  for (const [key, value] of Object.entries(result)) {
    if (typeof value === "string") {
      (result as Record<string, unknown>)[key] = sanitizeText(value);
    } else if (Array.isArray(value)) {
      (result as Record<string, unknown>)[key] = value.map((item) =>
        typeof item === "string"
          ? sanitizeText(item)
          : typeof item === "object" && item !== null
          ? sanitizeObject(item as Record<string, unknown>)
          : item
      );
    } else if (typeof value === "object" && value !== null) {
      (result as Record<string, unknown>)[key] = sanitizeObject(value as Record<string, unknown>);
    }
  }
  return result;
}
