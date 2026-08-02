"use client";

/**
 * Small, safe Markdown renderer for user-authored content (community
 * threads/posts) and for course lessons. Uses react-markdown + remark-gfm
 * (tables, strikethrough, task lists, autolinks) + remark-math/rehype-katex
 * ($inline$ and $$block$$ LaTeX). react-markdown does NOT render raw HTML by
 * default, so user input can't inject markup — safe for untrusted content.
 * Links open in a new tab with noopener.
 *
 * FIGURES. Course lessons carry generated figures, written as ordinary
 * markdown images whose alt text is the caption:
 *
 *     ![Mobility peaks where the two mechanisms cross.](/courses/…/x.svg)
 *
 * The `img` override below does three things with that:
 *
 *  1. Swaps in a `.dark.svg` sibling under the dark theme. Figures are
 *     generated as a matched light/dark pair rather than being colour-flipped,
 *     because a flipped chart is not a legible chart — each mode has its own
 *     validated hue steps and ink. An <img> can't inherit page CSS, so the
 *     swap has to happen here.
 *  2. Promotes the alt text to a visible caption, so the figure is described
 *     for every reader rather than only for screen readers.
 *  3. Wraps in <span>, not <figure>. react-markdown puts images inside a <p>,
 *     and <figure> inside <p> is invalid HTML that React re-parents at
 *     hydration, which produced a hydration mismatch. Spans set to display:block
 *     give the same layout and nest legally.
 */

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import "katex/dist/katex.min.css";

/** `/a/b.svg` -> `/a/b.dark.svg`; anything that is not an .svg is left alone. */
function darkVariant(src: string): string {
  return src.endsWith(".svg") && !src.endsWith(".dark.svg")
    ? `${src.slice(0, -4)}.dark.svg`
    : src;
}

export function Markdown({ children, className = "" }: { children: string; className?: string }) {
  const { resolvedTheme } = useTheme();
  // next-themes resolves on the client only. Render the light source on the
  // server pass and swap after mount, so SSR and first client render agree.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div className={`prose prose-sm dark:prose-invert max-w-none break-words ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          a: ({ node, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          ),
          img: ({ node, src, alt, ...props }) => {
            const resolved = typeof src === "string" && isDark ? darkVariant(src) : src;
            return (
              <span className="my-5 block">
                <img
                  {...props}
                  src={resolved as string}
                  alt={alt ?? ""}
                  loading="lazy"
                  className="mx-auto block h-auto max-w-full"
                />
                {alt ? (
                  <span className="mt-2 block text-center text-xs text-muted-foreground">
                    {alt}
                  </span>
                ) : null}
              </span>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
