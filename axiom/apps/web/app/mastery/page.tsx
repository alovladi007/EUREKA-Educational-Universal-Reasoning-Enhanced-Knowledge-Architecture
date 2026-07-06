'use client';

import { useEffect, useState } from 'react';
import {
  fetchEvidence,
  fetchMastery,
  getToken,
  type EvidenceEvent,
  type MasteryStateRow,
} from '@/lib/api';
import { ErrorPanel, HeaderLink, SignInScreen } from '@/components/PageShell';
import { AppShell } from '@/components/AppShell';
import { ProgressBar, toPercent } from '@/components/ProgressBar';

// The explainable-mastery view. It lists each mastered node as a labeled
// progress bar. Selecting a row loads the evidence timeline behind the number,
// so the mastery estimate is auditable rather than opaque.

type LoadState = 'checking' | 'signed-out' | 'loading' | 'ready' | 'error';

function formatWhen(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString();
}

export default function MasteryPage() {
  const [state, setState] = useState<LoadState>('checking');
  const [states, setStates] = useState<MasteryStateRow[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [events, setEvents] = useState<EvidenceEvent[]>([]);
  const [evidenceState, setEvidenceState] = useState<
    'idle' | 'loading' | 'ready' | 'error'
  >('idle');
  const [evidenceError, setEvidenceError] = useState('');

  useEffect(() => {
    if (!getToken()) {
      setState('signed-out');
      return;
    }
    setState('loading');
    let cancelled = false;
    (async () => {
      try {
        const result = await fetchMastery();
        if (cancelled) {
          return;
        }
        setStates(result.states);
        setState('ready');
      } catch (err) {
        if (cancelled) {
          return;
        }
        setErrorMessage(
          err instanceof Error ? err.message : 'Failed to load your mastery.',
        );
        setState('error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function openEvidence(code: string) {
    if (selectedCode === code) {
      // Toggle closed on a second click.
      setSelectedCode(null);
      setEvidenceState('idle');
      return;
    }
    setSelectedCode(code);
    setEvents([]);
    setEvidenceState('loading');
    setEvidenceError('');
    try {
      const result = await fetchEvidence(code);
      setEvents(result.events);
      setEvidenceState('ready');
    } catch (err) {
      setEvidenceError(
        err instanceof Error ? err.message : 'Failed to load the evidence.',
      );
      setEvidenceState('error');
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
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-xl font-semibold text-foreground">Mastery</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your estimated command of each skill. Select a skill to see the
          evidence behind the estimate.
        </p>

        {state === 'loading' && (
          <p className="mt-8 text-sm text-muted-foreground">
            Loading your mastery.
          </p>
        )}

        {state === 'error' && (
          <div className="mt-8">
            <ErrorPanel message={errorMessage} />
          </div>
        )}

        {state === 'ready' && (
          <>
            {states.length === 0 ? (
              <div className="mt-8 rounded-lg border border-dashed border-border p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  You have no mastery yet. Start practicing to build it.
                </p>
                <div className="mt-4">
                  <HeaderLink href="/practice">Go to practice</HeaderLink>
                </div>
              </div>
            ) : (
              <ul className="mt-8 space-y-3">
                {states.map((row) => {
                  const open = row.code === selectedCode;
                  return (
                    <li
                      key={row.node_id}
                      className="rounded-lg border border-border bg-card"
                    >
                      <button
                        type="button"
                        onClick={() => openEvidence(row.code)}
                        aria-expanded={open}
                        className="w-full rounded-lg p-4 text-left focus:outline-none focus:ring-2 focus:ring-brand-500"
                      >
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="text-sm font-semibold text-card-foreground">
                            {row.title}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {toPercent(row.p_known)}%{' '}
                            <span className="capitalize">({row.level})</span>
                          </span>
                        </div>
                        <div className="mt-2">
                          <ProgressBar
                            value={row.p_known}
                            label={`Mastery of ${row.title}`}
                          />
                        </div>
                        <span className="mt-2 block font-mono text-xs text-muted-foreground">
                          {row.code}
                        </span>
                      </button>

                      {open && (
                        <div
                          className="border-t border-border p-4"
                          aria-live="polite"
                        >
                          {evidenceState === 'loading' && (
                            <p className="text-sm text-muted-foreground">
                              Loading the evidence.
                            </p>
                          )}
                          {evidenceState === 'error' && (
                            <ErrorPanel message={evidenceError} />
                          )}
                          {evidenceState === 'ready' &&
                            (events.length === 0 ? (
                              <p className="text-sm text-muted-foreground">
                                No recorded evidence for this skill yet.
                              </p>
                            ) : (
                              <ol className="space-y-2">
                                {events.map((event, index) => (
                                  <li
                                    key={`${event.created_at}-${index}`}
                                    className="flex flex-wrap items-center gap-2 text-sm"
                                  >
                                    <span
                                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                        event.correct
                                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                          : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                                      }`}
                                    >
                                      {event.correct ? 'Correct' : 'Incorrect'}
                                    </span>
                                    <span className="text-muted-foreground">
                                      {toPercent(event.p_known_before)}% to{' '}
                                      {toPercent(event.p_known_after)}%
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {formatWhen(event.created_at)}
                                    </span>
                                  </li>
                                ))}
                              </ol>
                            ))}
                        </div>
                      )}
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
