'use client';

/**
 * The platform helper, inside OCTET.
 *
 * Same helper, same registry, same support queue as EUREKA - see lib/help.ts
 * for why it calls across rather than growing a second one here. This file is
 * only the OCTET dress: brand colours, the module's own Card idiom.
 *
 * WHAT IT IS NOT FOR
 *
 * Chemistry questions. Those belong to the chapters and to Practice, which
 * grades on the server. This answers "how do I use this thing" - where the
 * 3D labs are, where practice is, how to get back to EUREKA - and hands
 * anything else to a person.
 */

import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, ExternalLink, HelpCircle, Send, X } from 'lucide-react';
import {
  askHelp,
  escalateHelp,
  resolveHelpHref,
  type HelpAnswer,
} from '@/lib/help';

type Phase = 'idle' | 'asking' | 'answered' | 'sending' | 'sent' | 'error';

const SUGGESTIONS = [
  'Where are the 3D labs?',
  'Where do I practise a specific topic?',
  'How do I change my password?',
  'How do I get back to EUREKA?',
];

export default function HelpWidget() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [answer, setAnswer] = useState<HelpAnswer | null>(null);
  const [reference, setReference] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const path = typeof window !== 'undefined' ? window.location.pathname : undefined;

  const ask = async (q: string) => {
    const text = q.trim();
    if (!text) return;
    setQuestion(text);
    setPhase('asking');
    setError('');
    try {
      setAnswer(await askHelp(text, path));
      setPhase('answered');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The helper could not be reached.');
      setPhase('error');
    }
  };

  const escalate = async () => {
    setPhase('sending');
    try {
      const result = await escalateHelp({
        question,
        page_path: path,
        topic_keys: answer?.topics ?? [],
        reason: answer?.escalate_reason === 'policy' ? 'policy' : 'no_match',
      });
      setReference(result.reference);
      setPhase('sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not open a ticket.');
      setPhase('error');
    }
  };

  const reset = () => {
    setQuestion('');
    setAnswer(null);
    setReference('');
    setError('');
    setPhase('idle');
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="octet-help-panel"
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-brand-600 px-4 py-3 text-sm font-medium text-white shadow-lg transition hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
      >
        <HelpCircle className="h-4 w-4" />
        Help
      </button>

      {open && (
        <div
          id="octet-help-panel"
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
                Using OCTET and EUREKA. For chemistry itself, read the chapter.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close help"
              className="rounded p-1 text-muted-foreground transition hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
            {phase === 'idle' && (
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
                        className="w-full rounded-lg border border-border px-3 py-2 text-left text-[13px] text-card-foreground transition hover:border-brand-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                      >
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {phase === 'asking' && (
              <p className="text-sm text-muted-foreground">Looking that up.</p>
            )}

            {(phase === 'answered' || phase === 'sending') && answer && (
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
                        <a
                          href={resolveHelpHref(l.href)}
                          className="inline-flex items-center gap-1.5 rounded text-[13px] font-medium text-brand-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-brand-400"
                        >
                          {l.label}
                          <ExternalLink className="h-3 w-3" />
                          {l.restricted && (
                            <span className="text-[11px] font-normal text-muted-foreground">
                              (needs a teacher or admin role)
                            </span>
                          )}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}

                <p className="text-[11px] text-muted-foreground">
                  {answer.ai_generated
                    ? "Written by AI from this platform's own help material — check anything important."
                    : "Assembled from this platform's own help material, not written by AI."}
                </p>

                <button
                  type="button"
                  onClick={escalate}
                  disabled={phase === 'sending'}
                  className="w-full rounded-lg border border-border px-3 py-2 text-[13px] font-medium text-card-foreground transition hover:border-brand-500 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  {phase === 'sending'
                    ? 'Opening a ticket…'
                    : answer.should_escalate
                      ? 'Send this to a person'
                      : 'This did not help — ask a person'}
                </button>
              </div>
            )}

            {phase === 'sent' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <p className="text-sm font-medium">Support ticket opened</p>
                </div>
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  Your reference is{' '}
                  <span className="font-mono font-medium text-card-foreground">
                    {reference}
                  </span>
                  . Support answers within one business day.
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="rounded text-[13px] font-medium text-brand-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-brand-400"
                >
                  Ask something else
                </button>
              </div>
            )}

            {phase === 'error' && (
              <div className="space-y-2">
                <p className="text-[13px] text-red-600 dark:text-red-400">{error}</p>
                <button
                  type="button"
                  onClick={reset}
                  className="rounded text-[13px] font-medium text-brand-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-brand-400"
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
            <label className="sr-only" htmlFor="octet-help-question">
              Your question
            </label>
            <textarea
              id="octet-help-question"
              ref={inputRef}
              rows={1}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  ask(question);
                }
              }}
              placeholder="Ask anything about using the platform"
              className="min-h-[2.5rem] flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2 text-[13px] text-foreground placeholder:text-muted-foreground focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
            <button
              type="submit"
              disabled={!question.trim() || phase === 'asking'}
              aria-label="Ask"
              className="rounded-lg bg-brand-600 p-2.5 text-white transition hover:bg-brand-700 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
