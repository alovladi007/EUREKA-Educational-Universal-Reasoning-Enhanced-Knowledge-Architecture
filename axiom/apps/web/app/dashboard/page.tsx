'use client';

import { useEffect, useState } from 'react';
import {
  EUREKA_LOGIN_URL,
  fetchGamification,
  fetchHealth,
  fetchMastery,
  fetchMe,
  fetchUnreadCount,
  getToken,
  type GamificationProfile,
  type Me,
} from '@/lib/api';
import { StatusPill, type ApiHealthState } from '@/components/StatusPill';
import { AppShell } from '@/components/AppShell';

// The dashboard is the landing view inside the sidebar shell. Navigation lives
// entirely in the left sidebar (AppShell), so the dashboard does NOT repeat the
// module list. It shows a welcome, the live API status, and an at-a-glance view
// of the learner's own progress (level, streak, skills tracked, unread).

type LoadState = 'checking' | 'signed-out' | 'loading' | 'ready' | 'error';

function Wordmark() {
  return (
    <div className="flex flex-col">
      <span className="text-2xl font-bold tracking-tight text-foreground">
        AXIOM
      </span>
      <span className="text-xs text-muted-foreground">
        Adaptive eXpert Instruction and Outcome Measurement
      </span>
    </div>
  );
}

function SignInScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mb-6 flex justify-center">
          <Wordmark />
        </div>
        <h1 className="mb-2 text-lg font-semibold text-card-foreground">
          Sign in through EUREKA to continue
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          AXIOM uses your EUREKA account. Sign in on EUREKA and you will be
          returned here with access to the mathematics workspace.
        </p>
        <a
          href={EUREKA_LOGIN_URL}
          className="inline-flex w-full items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          Sign in with EUREKA
        </a>
      </div>
    </main>
  );
}

// A single at-a-glance metric. Informational only (no navigation), so it does
// not duplicate the sidebar.
function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex flex-col rounded-lg border border-border bg-card p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
      {sub && <p className="mt-0.5 text-sm text-muted-foreground">{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const [state, setState] = useState<LoadState>('checking');
  const [health, setHealth] = useState<ApiHealthState>('checking');
  const [me, setMe] = useState<Me | null>(null);
  const [profile, setProfile] = useState<GamificationProfile | null>(null);
  const [skills, setSkills] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setState('signed-out');
      return;
    }

    setState('loading');
    let cancelled = false;

    // The signed-in user is the only load-critical call; if it fails the
    // dashboard shows an error. The progress stats below are best-effort.
    (async () => {
      try {
        const meResult = await fetchMe();
        if (cancelled) {
          return;
        }
        setMe(meResult);
        setState('ready');
      } catch (err) {
        if (cancelled) {
          return;
        }
        setErrorMessage(
          err instanceof Error ? err.message : 'Failed to load dashboard.',
        );
        setState('error');
      }
    })();

    // Best-effort at-a-glance stats. Each failure is swallowed so a missing or
    // empty metric never breaks the dashboard.
    (async () => {
      try {
        const gp = await fetchGamification();
        if (!cancelled) setProfile(gp);
      } catch {
        // Ignore.
      }
    })();
    (async () => {
      try {
        const mastery = await fetchMastery();
        if (!cancelled) setSkills(mastery.states.length);
      } catch {
        // Ignore.
      }
    })();
    (async () => {
      try {
        const result = await fetchUnreadCount();
        if (!cancelled) setUnreadCount(result.count);
      } catch {
        // Ignore.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Poll /health for the live status pill. Runs only when signed in.
  useEffect(() => {
    if (state === 'checking' || state === 'signed-out') {
      return;
    }
    let cancelled = false;
    const probe = async () => {
      try {
        const result = await fetchHealth();
        if (!cancelled) {
          setHealth(result.status === 'ok' ? 'healthy' : 'unreachable');
        }
      } catch {
        if (!cancelled) {
          setHealth('unreachable');
        }
      }
    };
    probe();
    const interval = setInterval(probe, 15000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [state]);

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

  const greetingName = me?.display_name || '';

  return (
    <AppShell>
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              {greetingName ? `Welcome back, ${greetingName}.` : 'Welcome back.'}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Your AXIOM workspace. Pick a module from the sidebar to get going.
            </p>
          </div>
          <StatusPill state={health} />
        </div>

        {state === 'error' && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
            <h2 className="mb-1 text-base font-semibold text-red-800 dark:text-red-200">
              We could not load your dashboard
            </h2>
            <p className="text-sm text-red-700 dark:text-red-300">
              {errorMessage}
            </p>
            <p className="mt-3 text-sm text-red-700 dark:text-red-300">
              Check that the AXIOM API is running, then reload this page.
            </p>
          </div>
        )}

        {state === 'ready' && (
          <section>
            <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
              At a glance
            </h2>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard
                label="Level"
                value={profile ? `Level ${profile.level}` : '-'}
                sub={profile ? `${profile.xp_total} XP total` : 'Start practicing'}
              />
              <StatCard
                label="Streak"
                value={profile ? `${profile.streak_days}` : '0'}
                sub={
                  profile && profile.streak_days === 1
                    ? 'day in a row'
                    : 'days in a row'
                }
              />
              <StatCard
                label="Skills tracked"
                value={`${skills}`}
                sub="in your mastery map"
              />
              <StatCard
                label="Unread"
                value={`${unreadCount}`}
                sub={unreadCount === 1 ? 'notification' : 'notifications'}
              />
            </div>
          </section>
        )}
      </main>
    </AppShell>
  );
}
