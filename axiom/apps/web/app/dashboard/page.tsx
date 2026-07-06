'use client';

import { useEffect, useState } from 'react';
import {
  EUREKA_LOGIN_URL,
  fetchDashboardSummary,
  fetchHealth,
  fetchMe,
  fetchUnreadCount,
  getToken,
  type DashboardSummary,
  type Me,
} from '@/lib/api';
import Link from 'next/link';
import { ModuleCard } from '@/components/ModuleCard';
import { StatusPill, type ApiHealthState } from '@/components/StatusPill';
import { AppShell } from '@/components/AppShell';

// Static tiles for the Phase 2 pages that are not part of the API module list.
// Each links directly to its route, matching the ModuleCard visual style.
const EXPLORE_TILES: { href: string; name: string; description: string }[] = [
  {
    href: '/assessments',
    name: 'Assessments',
    description:
      'The assessments assigned to you. Start one while it is open and take it here.',
  },
  {
    href: '/review',
    name: 'Review mistakes',
    description:
      'Revisit your recent incorrect answers with the correct answer and an explanation.',
  },
  {
    href: '/copilot',
    name: 'Copilot',
    description:
      'An AI-assisted tutor grounded in your lessons. Every reply shows its sources.',
  },
  {
    href: '/achievements',
    name: 'Achievements',
    description:
      'Your XP, level, streak, earned badges, and the leaderboard.',
  },
  {
    href: '/cat',
    name: 'Adaptive test',
    description:
      'A short test that adapts to your answers to estimate your ability.',
  },
  {
    href: '/grading-review',
    name: 'Grading review',
    description:
      'Review AI-graded free responses and override the grade. For teachers and admins.',
  },
];

// A dedicated tile for the notifications inbox. It renders like an ExploreTile
// but shows the live unread count as a badge when there is one to show.
function NotificationsTile({ unreadCount }: { unreadCount: number }) {
  return (
    <Link
      href="/notifications"
      className="flex flex-col rounded-lg border border-border bg-card p-5 transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
    >
      <div className="mb-2 flex items-center gap-2">
        <h3 className="text-base font-semibold text-card-foreground">
          Notifications
        </h3>
        {unreadCount > 0 && (
          <span className="inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-brand-600 px-1.5 py-0.5 text-xs font-medium text-white">
            {unreadCount}
          </span>
        )}
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Assignments, grades, badges, and system messages. Your unread inbox.
      </p>
      <span className="mt-3 text-sm font-medium text-brand-600 dark:text-brand-300">
        {unreadCount > 0
          ? `Open Notifications (${unreadCount} unread)`
          : 'Open Notifications'}
      </span>
    </Link>
  );
}

function ExploreTile({
  href,
  name,
  description,
}: {
  href: string;
  name: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col rounded-lg border border-border bg-card p-5 transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
    >
      <h3 className="mb-2 text-base font-semibold text-card-foreground">
        {name}
      </h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      <span className="mt-3 text-sm font-medium text-brand-600 dark:text-brand-300">
        Open {name}
      </span>
    </Link>
  );
}

// The dashboard is the whole app for Phase 0. It:
//   1. checks for the EUREKA token in localStorage
//   2. if absent, shows a "Sign in through EUREKA" screen
//   3. if present, loads /me and /dashboard/summary and renders the modules
//   4. polls /health for a live API status pill

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

export default function DashboardPage() {
  const [state, setState] = useState<LoadState>('checking');
  const [health, setHealth] = useState<ApiHealthState>('checking');
  const [me, setMe] = useState<Me | null>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Load /me and /dashboard/summary once we know a token exists.
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setState('signed-out');
      return;
    }

    setState('loading');
    let cancelled = false;

    (async () => {
      try {
        const [meResult, summaryResult] = await Promise.all([
          fetchMe(),
          fetchDashboardSummary(),
        ]);
        if (cancelled) {
          return;
        }
        setMe(meResult);
        setSummary(summaryResult);
        setState('ready');
      } catch (err) {
        if (cancelled) {
          return;
        }
        const message =
          err instanceof Error ? err.message : 'Failed to load dashboard.';
        setErrorMessage(message);
        setState('error');
      }
    })();

    // Load the unread notification count for the Notifications tile. This is
    // best-effort: a failure here must not affect the dashboard, so it is kept
    // separate and its errors are swallowed.
    (async () => {
      try {
        const result = await fetchUnreadCount();
        if (!cancelled) {
          setUnreadCount(result.count);
        }
      } catch {
        // Ignore; the tile just shows no badge.
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

  const greetingName = me?.display_name || summary?.user.display_name || '';

  return (
    <AppShell>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              {greetingName
                ? `Welcome back, ${greetingName}.`
                : 'Welcome back.'}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              This is your AXIOM workspace. Modules will light up as they become
              available.
            </p>
          </div>
          <StatusPill state={health} />
        </div>

        {state === 'loading' && (
          <p className="text-sm text-muted-foreground">
            Loading your dashboard.
          </p>
        )}

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

        {state === 'ready' && summary && (
          <>
            <section>
              <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Modules
              </h2>
              {summary.modules.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No modules yet. Check back soon.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {summary.modules.map((module) => (
                    <ModuleCard key={module.key} module={module} />
                  ))}
                </div>
              )}
            </section>

            <section className="mt-10">
              <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Explore
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <NotificationsTile unreadCount={unreadCount} />
                {EXPLORE_TILES.map((tile) => (
                  <ExploreTile
                    key={tile.href}
                    href={tile.href}
                    name={tile.name}
                    description={tile.description}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </AppShell>
  );
}
