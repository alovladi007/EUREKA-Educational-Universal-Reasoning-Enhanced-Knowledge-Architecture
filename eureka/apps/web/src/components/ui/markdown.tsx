"use client";

/**
 * Small, safe Markdown renderer for user-authored content (community
 * threads/posts). Uses react-markdown + remark-gfm (tables, strikethrough,
 * task lists, autolinks). react-markdown does NOT render raw HTML by default,
 * so user input can't inject markup — safe for untrusted content. Links open
 * in a new tab with noopener.
 *
 * (LaTeX math is intentionally not wired here; the copy that once advertised
 * it has been corrected to match what actually renders.)
 */

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Markdown({ children, className = "" }: { children: string; className?: string }) {
  return (
    <div className={`prose prose-sm dark:prose-invert max-w-none break-words ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ node, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
