'use client';

import { useEffect, useState } from 'react';
import {
  fetchGamification,
  fetchLeaderboard,
  getToken,
  type Badge,
  type GamificationProfile,
  type LeaderboardEntry,
} from '@/lib/api';
import { ErrorPanel, HeaderLink, SignInScreen } from '@/components/PageShell';
import { AppShell } from '@/components/AppShell';
import { ProgressBar } from '@/components/ProgressBar';

// The achievements view. It shows the learner's XP total, level, and current
// streak, a grid of earned badges, and the top-10 leaderboard. XP-to-next-level
// is derived from the level threshold convention (level * 100) as a progress
// bar so the number stays honest - everything comes from the API.

type LoadState = 'checking' | 'signed-out' | 'loading' | 'ready' | 'error';

function formatWhen(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString();
}

export default function AchievementsPage() {
  const [state, setState] = useState<LoadState>('checking');
  const [profile, setProfile] = useState<GamificationProfile | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!getToken()) {
      setState('signed-out');
      return;
    }
    setState('loading');
    let cancelled = false;
    (async () => {
      try {
        const [me, board] = await Promise.all([
          fetchGamification(),
          fetchLeaderboard(),
        ]);
        if (cancelled) {
          return;
        }
        setProfile(me);
        setLeaderboard(board.leaderboard);
        setState('ready');
      } catch (err) {
        if (cancelled) {
          return;
        }
        setErrorMessage(
          err instanceof Error
            ? err.message
            : 'Failed to load your achievements.',
        );
        setState('error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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

  // Next-level threshold is level * 100 XP; progress within the level is the
  // remaining XP after whole hundreds, as a fraction in [0, 1].
  const level = profile?.level ?? 0;
  const xpTotal = profile?.xp_total ?? 0;
  const nextThreshold = level * 100;
  const withinLevel = ((xpTotal % 100) + 100) % 100;
  const levelFraction = withinLevel / 100;
  const badges: Badge[] = profile?.badges ?? [];
  const topTen = leaderboard.slice(0, 10);

  return (
    <AppShell>
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-xl font-semibold text-foreground">Achievements</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your experience points, level, streak, and the badges you have
          earned. See how you compare on the leaderboard.
        </p>

        {state === 'loading' && (
          <p className="mt-8 text-sm text-muted-foreground">
            Loading your achievements.
          </p>
        )}

        {state === 'error' && (
          <div className="mt-8">
            <ErrorPanel message={errorMessage} />
          </div>
        )}

        {state === 'ready' && profile && (
          <div className="mt-8 space-y-10">
            <section aria-label="Your progress">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-border bg-card p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Total XP
                  </p>
                  <p className="mt-1 text-2xl font-bold text-card-foreground">
                    {xpTotal}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Level
                  </p>
                  <p className="mt-1 text-2xl font-bold text-card-foreground">
                    {level}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Streak
                  </p>
                  <p className="mt-1 text-2xl font-bold text-card-foreground">
                    {profile.streak_days}{' '}
                    <span className="text-sm font-medium text-muted-foreground">
                      {profile.streak_days === 1 ? 'day' : 'days'}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-border bg-card p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm font-medium text-card-foreground">
                    Progress to level {level + 1}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {withinLevel} / 100 XP
                  </span>
                </div>
                <div className="mt-2">
                  <ProgressBar
                    value={levelFraction}
                    label={`Progress to level ${level + 1}`}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Next level threshold: {nextThreshold} XP.
                </p>
              </div>
            </section>

            <section aria-label="Your badges">
              <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Badges
              </h2>
              {badges.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    You have not earned any badges yet. Keep practicing to
                    unlock your first one.
                  </p>
                  <div className="mt-4">
                    <HeaderLink href="/practice">Go to practice</HeaderLink>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {badges.map((badge) => (
                    <div
                      key={badge.code}
                      className="rounded-lg border border-border bg-card p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-sm font-semibold text-card-foreground">
                          {badge.name}
                        </h3>
                        <span className="shrink-0 rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-900 dark:text-brand-200">
                          Earned
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {badge.description}
                      </p>
                      <p className="mt-3 text-xs text-muted-foreground">
                        Awarded {formatWhen(badge.awarded_at)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section aria-label="Leaderboard">
              <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Leaderboard
              </h2>
              {topTen.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  The leaderboard is empty. Be the first to earn XP.
                </p>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-border bg-card">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                        <th className="px-4 py-2 font-medium">Rank</th>
                        <th className="px-4 py-2 font-medium">Learner</th>
                        <th className="px-4 py-2 font-medium">Level</th>
                        <th className="px-4 py-2 font-medium">XP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topTen.map((entry, index) => (
                        <tr
                          key={entry.user_id}
                          className="border-b border-border last:border-0"
                        >
                          <td className="px-4 py-2 text-muted-foreground">
                            {index + 1}
                          </td>
                          <td className="px-4 py-2 text-card-foreground">
                            {entry.name}
                          </td>
                          <td className="px-4 py-2 text-muted-foreground">
                            {entry.level}
                          </td>
                          <td className="px-4 py-2 text-muted-foreground">
                            {entry.xp_total}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </AppShell>
  );
}
