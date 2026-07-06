'use client';

import { useEffect, useState } from 'react';
import {
  fetchMe,
  getToken,
  proctoringDetail,
  proctoringReview,
  type ProctoringDetail,
  type ProctoringSummary,
} from '@/lib/api';
import { AppShell } from '@/components/AppShell';
import { ErrorPanel, SignInScreen } from '@/components/PageShell';

// Teacher review of flagged proctoring sessions. Each row shows the anomaly
// score (a signal, not a verdict) and expands to the integrity-event timeline.
// The reviewer decides; the platform never accuses.

type Gate = 'checking' | 'signed-out' | 'unauthorized' | 'ready' | 'error';

const REVIEWER_ROLES = new Set(['teacher', 'author', 'org_admin', 'super_admin']);

function formatWhen(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function ScorePill({ score }: { score: number }) {
  const tone =
    score >= 6
      ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${tone}`}>
      anomaly {score}
    </span>
  );
}

export default function ProctoringPage() {
  const [gate, setGate] = useState<Gate>('checking');
  const [gateError, setGateError] = useState('');
  const [sessions, setSessions] = useState<ProctoringSummary[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [detail, setDetail] = useState<ProctoringDetail | null>(null);
  const [detailBusy, setDetailBusy] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      setGate('signed-out');
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const me = await fetchMe();
        if (cancelled) {
          return;
        }
        if (!me.roles.some((r) => REVIEWER_ROLES.has(r))) {
          setGate('unauthorized');
          return;
        }
        const result = await proctoringReview();
        if (!cancelled) {
          setSessions(result.sessions);
          setGate('ready');
        }
      } catch (err) {
        if (!cancelled) {
          setGateError(err instanceof Error ? err.message : 'Failed to load.');
          setGate('error');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function toggle(id: string) {
    if (openId === id) {
      setOpenId(null);
      setDetail(null);
      return;
    }
    setOpenId(id);
    setDetail(null);
    setDetailBusy(true);
    try {
      setDetail(await proctoringDetail(id));
    } catch {
      setDetail(null);
    } finally {
      setDetailBusy(false);
    }
  }

  if (gate === 'checking') {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading proctoring review.</p>
      </main>
    );
  }
  if (gate === 'signed-out') {
    return <SignInScreen />;
  }

  return (
    <AppShell>
      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-xl font-semibold text-foreground">Proctoring review</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Flagged exam sessions, highest anomaly first. The score routes your
          attention; it is not an accusation. Open a session to see its integrity
          timeline, then decide.
        </p>

        {gate === 'unauthorized' && (
          <div className="mt-8 rounded-lg border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">
              Proctoring review is for teachers and administrators.
            </p>
          </div>
        )}
        {gate === 'error' && (
          <div className="mt-8">
            <ErrorPanel message={gateError} />
          </div>
        )}

        {gate === 'ready' && (
          <div className="mt-8">
            {sessions.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No flagged sessions. When a proctored exam accumulates integrity
                  signals past the threshold, it appears here.
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {sessions.map((s) => (
                  <li key={s.session_id} className="rounded-lg border border-border bg-card">
                    <button
                      type="button"
                      onClick={() => void toggle(s.session_id)}
                      aria-expanded={openId === s.session_id}
                      className="flex w-full items-center justify-between gap-3 p-4 text-left focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <ScorePill score={s.anomaly_score} />
                          <span className="text-xs text-muted-foreground">
                            {s.event_count} events
                          </span>
                          <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                            {s.status}
                          </span>
                        </div>
                        <p className="mt-1 font-mono text-xs text-muted-foreground">
                          user {s.user_id.slice(0, 8)} - {formatWhen(s.started_at)}
                        </p>
                      </div>
                      <span className="text-sm text-brand-600 dark:text-brand-300">
                        {openId === s.session_id ? 'Hide' : 'Review'}
                      </span>
                    </button>

                    {openId === s.session_id && (
                      <div className="border-t border-border p-4">
                        {detailBusy && (
                          <p className="text-sm text-muted-foreground">Loading timeline.</p>
                        )}
                        {detail && detail.session_id === s.session_id && (
                          <ol className="space-y-1.5">
                            {detail.events.length === 0 ? (
                              <li className="text-sm text-muted-foreground">
                                No integrity events recorded.
                              </li>
                            ) : (
                              detail.events.map((e, i) => (
                                <li
                                  key={i}
                                  className="flex flex-wrap items-center gap-2 text-sm"
                                >
                                  <span className="font-mono text-xs text-muted-foreground">
                                    {formatWhen(e.occurred_at)}
                                  </span>
                                  <span className="font-medium text-card-foreground">
                                    {e.kind}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    (weight {e.weight})
                                  </span>
                                  {e.detail && (
                                    <span className="text-xs text-muted-foreground">
                                      - {e.detail}
                                    </span>
                                  )}
                                </li>
                              ))
                            )}
                          </ol>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>
    </AppShell>
  );
}
