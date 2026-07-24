"use client";

/**
 * Small, safe Markdown renderer for user-authored content (community
 * threads/posts). Uses react-markdown + remark-gfm (tables, strikethrough,
 * task lists, autolinks) + remark-math/rehype-katex ($inline$ and $$block$$
 * LaTeX). react-markdown does NOT render raw HTML by default, so user input
 * can't inject markup — safe for untrusted content. Links open in a new tab
 * with noopener.
 */

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

export function Markdown({ children, className = "" }: { children: string; className?: string }) {
  return (
    <div className={`prose prose-sm dark:prose-invert max-w-none break-words ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
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
