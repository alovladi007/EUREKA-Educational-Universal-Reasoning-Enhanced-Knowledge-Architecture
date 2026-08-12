"use client";

/**
 * One help centre article.
 *
 * WHY THIS DID NOT EXIST
 *
 * The Help Center list has always linked to `/help/{slug}`, and this route was
 * never built, so every article card 404'd. It went unnoticed because the only
 * articles in the database were test fixtures nobody wanted to open. The
 * moment one real article existed, the gap was obvious.
 *
 * Reading an article increments its view count server-side (GET /kb/{slug}),
 * which is also what makes the "N views" on the list mean anything.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { EurekaNav } from "@/components/eureka-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/eureka-api";
import { ArrowLeft, LifeBuoy, ThumbsDown, ThumbsUp } from "lucide-react";

type KbArticle = {
  id: string;
  slug: string;
  title: string;
  summary?: string | null;
  body_md?: string;
  category?: string | null;
  view_count?: number;
  updated_at?: string;
};

type Load = "loading" | "ready" | "missing" | "error";

export default function HelpArticlePage() {
  const params = useParams<{ slug: string }>();
  const raw = params?.slug;
  const slug = decodeURIComponent(Array.isArray(raw) ? raw[0] : raw || "");

  const [state, setState] = useState<Load>("loading");
  const [article, setArticle] = useState<KbArticle | null>(null);
  const [voted, setVoted] = useState<"helpful" | "not_helpful" | null>(null);

  useEffect(() => {
    if (!slug) {
      setState("missing");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const data = await api<KbArticle>(`/kb/${encodeURIComponent(slug)}`, {
          auth: false,
        });
        if (cancelled) return;
        setArticle(data);
        setState("ready");
      } catch (err) {
        if (cancelled) return;
        // A 404 from the API means the article is gone or was never
        // published. That is a different thing from the API being down, and
        // the reader is told which.
        const missing = err instanceof Error && /404|not found/i.test(err.message);
        setState(missing ? "missing" : "error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const vote = async (kind: "helpful" | "not_helpful") => {
    setVoted(kind);
    try {
      await api(`/kb/${encodeURIComponent(slug)}/feedback`, {
        method: "POST",
        body: JSON.stringify({ helpful: kind === "helpful" }),
        auth: false,
      });
    } catch {
      // The vote is a nicety. Losing it must not interrupt the reading.
    }
  };

  return (
    <>
      <EurekaNav />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Link
          href="/help"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900 dark:hover:text-slate-100"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Help Center
        </Link>

        {state === "loading" && (
          <p className="text-sm text-slate-500">Loading this article…</p>
        )}

        {state === "missing" && (
          <Card>
            <CardContent className="py-10 text-center">
              <h1 className="text-lg font-semibold">
                We have not written this one yet
              </h1>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                There is no published help article at{" "}
                <span className="font-mono">{slug}</span>. It may have been
                renamed or unpublished.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <Button asChild variant="outline">
                  <Link href="/help">Browse the Help Center</Link>
                </Button>
                <Button asChild>
                  <Link href="/settings/support">Open a support ticket</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {state === "error" && (
          <Card>
            <CardContent className="py-10 text-center">
              <h1 className="text-lg font-semibold">
                The help centre could not be reached
              </h1>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                This is a connection problem rather than a missing article.
                Reload in a moment, or open a ticket if it persists.
              </p>
              <div className="mt-5 flex justify-center">
                <Button asChild variant="outline">
                  <Link href="/help">Back to the Help Center</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {state === "ready" && article && (
          <article>
            <header className="mb-6">
              {article.category && (
                <Badge variant="secondary" className="mb-2">
                  {article.category}
                </Badge>
              )}
              <h1 className="text-3xl font-bold tracking-tight">
                {article.title}
              </h1>
              {article.summary && (
                <p className="mt-2 text-slate-600 dark:text-slate-300">
                  {article.summary}
                </p>
              )}
            </header>

            {/* The body is authored markdown from the team, not user input. */}
            <div className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-semibold prose-h2:text-xl prose-h2:mt-8">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {article.body_md || ""}
              </ReactMarkdown>
            </div>

            <div className="mt-10 border-t border-slate-200 pt-6 dark:border-slate-800">
              <p className="text-sm font-medium">Was this helpful?</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Button
                  variant={voted === "helpful" ? "default" : "outline"}
                  size="sm"
                  onClick={() => vote("helpful")}
                  disabled={voted !== null}
                >
                  <ThumbsUp className="mr-1.5 h-3.5 w-3.5" />
                  Yes
                </Button>
                <Button
                  variant={voted === "not_helpful" ? "default" : "outline"}
                  size="sm"
                  onClick={() => vote("not_helpful")}
                  disabled={voted !== null}
                >
                  <ThumbsDown className="mr-1.5 h-3.5 w-3.5" />
                  No
                </Button>
                {voted && (
                  <span className="text-sm text-slate-500">
                    Thanks — that tells us what to rewrite.
                  </span>
                )}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
                <LifeBuoy className="h-4 w-4 text-slate-400" />
                <span className="text-slate-500">Still stuck?</span>
                <Link
                  href="/settings/support"
                  className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  Open a support ticket
                </Link>
                <span className="text-slate-400">
                  — answered within one business day.
                </span>
              </div>
            </div>
          </article>
        )}
      </main>
    </>
  );
}
