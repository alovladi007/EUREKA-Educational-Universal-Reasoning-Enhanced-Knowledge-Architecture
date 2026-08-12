"use client";

/**
 * The in-app helper: a Help button on every dashboard page.
 *
 * WHAT IT IS FOR
 *
 * Answering "how do I ...?" before someone emails an administrator. It knows
 * what the platform actually does - the backend answers from a registry of
 * real modules and routes - and it says so plainly when it does not know,
 * rather than guessing. A wrong confident answer costs more than no answer:
 * the person follows it, it fails, and they email the administrator anyway,
 * later and more annoyed.
 *
 * THREE OUTCOMES, ALL VISIBLE
 *
 *   answered      the reply plus the pages it points at
 *   escalate      it does not know, or must not decide (billing, account
 *                 removal, security) - one button sends it to a human
 *   sent          a reference number the person can quote
 *
 * The "Ask a person instead" button is present even on an answered question,
 * because whether the answer worked is the reader's call, not the helper's.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HelpCircle, X, Send, ExternalLink, CheckCircle2 } from "lucide-react";
import { askHelp, escalateHelp, type HelpAnswer } from "@/lib/help";

type Phase = "idle" | "asking" | "answered" | "sending" | "sent" | "error";

const SUGGESTIONS = [
  "How do I change my password?",
  "Where are the practice questions?",
  "What should I study next?",
  "How do I open the mathematics module?",
];

export default function HelpWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [answer, setAnswer] = useState<HelpAnswer | null>(null);
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Escape closes, which is the one keyboard behaviour people try first.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const ask = async (q: string) => {
    const text = q.trim();
    if (!text) return;
    setQuestion(text);
    setPhase("asking");
    setError("");
    try {
      const result = await askHelp(text, pathname || undefined);
      setAnswer(result);
      setPhase("answered");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "The helper could not be reached.",
      );
      setPhase("error");
    }
  };

  const escalate = async () => {
    setPhase("sending");
    try {
      const result = await escalateHelp({
        question,
        page_path: pathname || undefined,
        topic_keys: answer?.topics ?? [],
        reason: answer?.escalate_reason === "policy" ? "policy" : "no_match",
      });
      setReference(result.reference);
      setPhase("sent");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not send this to an administrator.",
      );
      setPhase("error");
    }
  };

  const reset = () => {
    setQuestion("");
    setAnswer(null);
    setReference("");
    setError("");
    setPhase("idle");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="help-panel"
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-lg transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <HelpCircle className="h-4 w-4" />
        Help
      </button>

      {open && (
        <div
          id="help-panel"
          role="dialog"
          aria-label="Help"
          className="fixed bottom-24 right-6 z-40 flex max-h-[70vh] w-[min(26rem,calc(100vw-3rem))] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-card-foreground">
                How can I help?
              </p>
              <p className="text-xs text-muted-foreground">
                I answer from what this platform can actually do.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close help"
              className="rounded p-1 text-muted-foreground transition hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
            {phase === "idle" && (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  Try one of these, or type your own question.
                </p>
                <ul className="space-y-1.5">
                  {SUGGESTIONS.map((s) => (
                    <li key={s}>
                      <button
                        type="button"
                        onClick={() => ask(s)}
                        className="w-full rounded-lg border border-border px-3 py-2 text-left text-[13px] text-card-foreground transition hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {phase === "asking" && (
              <p className="text-sm text-muted-foreground">Looking that up.</p>
            )}

            {(phase === "answered" || phase === "sending") && answer && (
              <div className="space-y-3">
                <p className="text-[13px] font-medium text-card-foreground">
                  {question}
                </p>
                <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-muted-foreground">
                  {answer.answer}
                </p>

                {answer.links.length > 0 && (
                  <ul className="space-y-1.5">
                    {answer.links.map((l) => (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          onClick={() => setOpen(false)}
                          className="inline-flex items-center gap-1.5 rounded text-[13px] font-medium text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          {l.label}
                          <ExternalLink className="h-3 w-3" />
                          {l.restricted && (
                            <span className="text-[11px] font-normal text-muted-foreground">
                              (needs a teacher or admin role)
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}

                {/* The same honesty rule as the tutor: only claim a model
                    wrote this when one did. */}
                <p className="text-[11px] text-muted-foreground">
                  {answer.ai_generated
                    ? "Written by AI from this platform's own help material — check anything important."
                    : "Assembled from this platform's own help material, not written by AI."}
                </p>

                <button
                  type="button"
                  onClick={escalate}
                  disabled={phase === "sending"}
                  className="w-full rounded-lg border border-border px-3 py-2 text-[13px] font-medium text-card-foreground transition hover:border-primary disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {phase === "sending"
                    ? "Sending…"
                    : answer.should_escalate
                      ? "Send this to an administrator"
                      : "This did not help — ask a person"}
                </button>
              </div>
            )}

            {phase === "sent" && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <p className="text-sm font-medium">Sent to an administrator</p>
                </div>
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  Your reference is{" "}
                  <span className="font-mono font-medium text-card-foreground">
                    {reference}
                  </span>
                  . Quote it if you follow this up.
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="rounded text-[13px] font-medium text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Ask something else
                </button>
              </div>
            )}

            {phase === "error" && (
              <div className="space-y-2">
                <p className="text-[13px] text-red-600 dark:text-red-400">{error}</p>
                <button
                  type="button"
                  onClick={reset}
                  className="rounded text-[13px] font-medium text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Start again
                </button>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(question);
            }}
            className="flex items-end gap-2 border-t border-border px-3 py-3"
          >
            <label className="sr-only" htmlFor="help-question">
              Your question
            </label>
            <textarea
              id="help-question"
              ref={inputRef}
              rows={1}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  ask(question);
                }
              }}
              placeholder="Ask anything about using EUREKA"
              className="min-h-[2.5rem] flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2 text-[13px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              type="submit"
              disabled={!question.trim() || phase === "asking"}
              aria-label="Ask"
              className="rounded-lg bg-primary p-2.5 text-primary-foreground transition hover:brightness-110 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
