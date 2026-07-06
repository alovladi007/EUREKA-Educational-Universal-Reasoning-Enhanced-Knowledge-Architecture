'use client';

import { useEffect, useState } from 'react';
import {
  ApiError,
  fetchGradingReview,
  getToken,
  overrideGrade,
  type FreeResponseGradeRow,
} from '@/lib/api';
import { ErrorPanel, SignInScreen } from '@/components/PageShell';
import { AppShell } from '@/components/AppShell';

// The teacher grading-review surface. AI grades a free-response answer, but the
// AI score is never final: a teacher reviews each one here and can override it.
// The review call is teacher-gated, so a 403 renders a friendly "teachers and
// admins" panel rather than an error. Each row carries an inline override
// control that records a new grade of record.

type LoadState =
  | 'checking'
  | 'signed-out'
  | 'loading'
  | 'ready'
  | 'forbidden'
  | 'error';

function isForbidden(err: unknown): boolean {
  return err instanceof ApiError && err.status === 403;
}

// Per-row draft state for the override control.
interface OverrideDraft {
  score: string;
  isCorrect: boolean;
  note: string;
}

export default function GradingReviewPage() {
  const [state, setState] = useState<LoadState>('checking');
  const [errorMessage, setErrorMessage] = useState('');
  const [rows, setRows] = useState<FreeResponseGradeRow[]>([]);

  // Per-response override draft, busy flag, error, and success confirmation.
  const [drafts, setDrafts] = useState<Record<string, OverrideDraft>>({});
  const [busy, setBusy] = useState<Record<string, boolean>>({});
  const [rowError, setRowError] = useState<Record<string, string>>({});
  const [confirmation, setConfirmation] = useState<Record<string, string>>({});

  // Seed a draft from the current grade of record for a row.
  function draftFor(row: FreeResponseGradeRow): OverrideDraft {
    const existing = drafts[row.response_id];
    if (existing) {
      return existing;
    }
    const currentScore = row.overridden ? row.override_score : row.ai_score;
    return {
      score: currentScore === null ? '' : String(currentScore),
      isCorrect: row.overridden
        ? (row.override_score ?? 0) > 0
        : row.ai_is_correct,
      note: row.override_note || '',
    };
  }

  function updateDraft(id: string, patch: Partial<OverrideDraft>) {
    setDrafts((prev) => {
      const base =
        prev[id] ??
        draftFor(rows.find((r) => r.response_id === id) as FreeResponseGradeRow);
      return { ...prev, [id]: { ...base, ...patch } };
    });
  }

  useEffect(() => {
    if (!getToken()) {
      setState('signed-out');
      return;
    }
    setState('loading');
    let cancelled = false;
    (async () => {
      try {
        const res = await fetchGradingReview();
        if (cancelled) {
          return;
        }
        setRows(res.items);
        setState('ready');
      } catch (err) {
        if (cancelled) {
          return;
        }
        if (isForbidden(err)) {
          setState('forbidden');
          return;
        }
        setErrorMessage(
          err instanceof Error
            ? err.message
            : 'Failed to load the grading review.',
        );
        setState('error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function saveOverride(row: FreeResponseGradeRow) {
    const id = row.response_id;
    const draft = draftFor(row);
    const score = Number(draft.score);
    setRowError((prev) => ({ ...prev, [id]: '' }));
    setConfirmation((prev) => ({ ...prev, [id]: '' }));
    if (!Number.isFinite(score)) {
      setRowError((prev) => ({ ...prev, [id]: 'Enter a numeric score.' }));
      return;
    }
    setBusy((prev) => ({ ...prev, [id]: true }));
    try {
      const result = await overrideGrade(id, {
        score,
        is_correct: draft.isCorrect,
        note: draft.note.trim(),
      });
      // Reflect the new grade of record in the row.
      setRows((prev) =>
        prev.map((r) =>
          r.response_id === id
            ? {
                ...r,
                overridden: true,
                override_score: result.score,
                override_note: result.note,
              }
            : r,
        ),
      );
      setConfirmation((prev) => ({
        ...prev,
        [id]: `Saved. Overrode AI score ${result.overrode_ai_score}.`,
      }));
    } catch (err) {
      if (isForbidden(err)) {
        setState('forbidden');
        return;
      }
      setRowError((prev) => ({
        ...prev,
        [id]:
          err instanceof Error ? err.message : 'Failed to save the override.',
      }));
    } finally {
      setBusy((prev) => ({ ...prev, [id]: false }));
    }
  }

  if (state === 'checking') {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading AXIOM.</p>
      </main>
    );
  }

  if (state === 'signed-out') {
    return <SignInScreen />;
  }

  return (
    <AppShell>
      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-xl font-semibold text-foreground">
          Grading review
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          AI-graded free responses. The AI score is a suggestion, not a final
          grade - review each one and override it where needed.
        </p>

        {state === 'loading' && (
          <p className="mt-8 text-sm text-muted-foreground">
            Loading the grading review.
          </p>
        )}

        {state === 'forbidden' && (
          <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-6 dark:border-amber-900 dark:bg-amber-950">
            <h2 className="mb-1 text-base font-semibold text-amber-800 dark:text-amber-200">
              Grading review is available to teachers and admins
            </h2>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Your account does not have access to grading review, so there is
              nothing to show here.
            </p>
          </div>
        )}

        {state === 'error' && (
          <div className="mt-8">
            <ErrorPanel message={errorMessage} />
          </div>
        )}

        {state === 'ready' && (
          <>
            {rows.length === 0 ? (
              <div className="mt-8 rounded-lg border border-dashed border-border p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No AI-graded free responses to review yet.
                </p>
              </div>
            ) : (
              <ul className="mt-8 space-y-5">
                {rows.map((row) => {
                  const draft = draftFor(row);
                  const id = row.response_id;
                  const isBusy = busy[id];
                  const err = rowError[id];
                  const ok = confirmation[id];
                  return (
                    <li
                      key={id}
                      className="rounded-lg border border-border bg-card p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-card-foreground">
                            {row.student}
                          </p>
                          <p className="mt-0.5 whitespace-pre-wrap text-sm text-muted-foreground">
                            {row.prompt}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                            AI-graded
                          </span>
                          {row.overridden && (
                            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              Overridden
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 rounded-lg border border-border bg-background p-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Student response
                        </p>
                        <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-card-foreground">
                          {row.answer}
                        </p>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          AI score{' '}
                          <span className="font-medium text-card-foreground">
                            {row.ai_score}
                          </span>{' '}
                          ({row.ai_is_correct ? 'correct' : 'incorrect'})
                        </span>
                        <span>
                          confidence{' '}
                          <span className="font-medium text-card-foreground">
                            {row.confidence === null
                              ? 'n/a'
                              : row.confidence.toFixed(2)}
                          </span>
                        </span>
                        <span>
                          grade of record{' '}
                          <span className="font-medium text-card-foreground">
                            {row.overridden
                              ? row.override_score === null
                                ? '-'
                                : row.override_score
                              : row.ai_score}
                          </span>
                        </span>
                      </div>

                      <div className="mt-4 border-t border-border pt-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Teacher override
                        </p>
                        <div className="mt-2 flex flex-wrap items-end gap-4">
                          <div>
                            <label
                              htmlFor={`score-${id}`}
                              className="mb-1 block text-xs font-medium text-card-foreground"
                            >
                              Score
                            </label>
                            <input
                              id={`score-${id}`}
                              type="number"
                              step="0.01"
                              value={draft.score}
                              onChange={(e) =>
                                updateDraft(id, { score: e.target.value })
                              }
                              className="w-28 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                          </div>
                          <label className="flex items-center gap-2 pb-2 text-sm text-card-foreground">
                            <input
                              type="checkbox"
                              checked={draft.isCorrect}
                              onChange={(e) =>
                                updateDraft(id, {
                                  isCorrect: e.target.checked,
                                })
                              }
                            />
                            Mark correct
                          </label>
                        </div>
                        <div className="mt-3">
                          <label
                            htmlFor={`note-${id}`}
                            className="mb-1 block text-xs font-medium text-card-foreground"
                          >
                            Note (optional)
                          </label>
                          <textarea
                            id={`note-${id}`}
                            value={draft.note}
                            rows={2}
                            onChange={(e) =>
                              updateDraft(id, { note: e.target.value })
                            }
                            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
                            placeholder="Why you adjusted this grade"
                          />
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={() => void saveOverride(row)}
                            disabled={isBusy}
                            className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isBusy ? 'Saving.' : 'Save override'}
                          </button>
                          {ok && (
                            <span
                              className="text-sm text-emerald-700 dark:text-emerald-300"
                              aria-live="polite"
                            >
                              {ok}
                            </span>
                          )}
                          {err && (
                            <span className="text-sm text-red-700 dark:text-red-300">
                              {err}
                            </span>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}
      </main>
    </AppShell>
  );
}
