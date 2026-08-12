'use client';

import {
  Activity,
  BookOpen,
  Brain,
  ClipboardList,
  Compass,
  FlaskConical,
  GraduationCap,
  LineChart,
  ListChecks,
  Map as MapIcon,
  MessageSquare,
  Radio,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trophy,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  fetchDueReviews,
  fetchGamification,
  fetchGraph,
  fetchHealth,
  fetchLearningPath,
  fetchMastery,
  fetchMe,
  fetchMistakes,
  fetchUnreadCount,
  getToken,
  type Me,
  type PathNode,
} from '@/lib/api';
import { StatusPill, type ApiHealthState } from '@/components/StatusPill';
import { AppShell } from '@/components/AppShell';
import { SignInScreen } from '@/components/PageShell';
import {
  Band,
  Card,
  Entry,
  LoadingPanel,
  PageHeading,
  Stat,
  Tag,
} from '@/components/ui';

// The dashboard, built to the prep test module's own shape
// (eureka/apps/web/src/components/test-prep/ExamDashboard.tsx):
//
//   resume hero  -> where to pick up, and why that one
//   stat tiles   -> four figures, mono and tabular
//   entry grid   -> the surfaces, saying what each is FOR
//   evidence     -> what the recorded attempts actually say
//
// WHAT THIS REPLACED
//
// A flat directory of thirteen identical cards, every one stamped "Available"
// and captioned "Open X". Thirteen equal-weight tiles is a phone book, not a
// dashboard: nothing says where to go next, and a badge that reads Available
// on every card carries no information at all - an accent on everything
// accents nothing.
//
// EVERY FIGURE HERE IS MEASURED.
//
// There are no percentiles, no predicted scores and no cohort comparisons,
// because there is no cohort. Where a figure has no data behind it the tile
// shows an em dash and says why, rather than a zero - a zero claims a
// measurement was taken and came back empty, which is a different and usually
// false statement.

type LoadState = 'checking' | 'signed-out' | 'loading' | 'ready';

interface Snapshot {
  chapters: number | null;
  next: PathNode | null;
  practised: number | null;
  due: number | null;
  streak: number | null;
  mistakes: number | null;
  unread: number;
}

const EMPTY: Snapshot = {
  chapters: null,
  next: null,
  practised: null,
  due: null,
  streak: null,
  mistakes: null,
  unread: 0,
};

export default function DashboardPage() {
  const [state, setState] = useState<LoadState>('checking');
  const [me, setMe] = useState<Me | null>(null);
  const [health, setHealth] = useState<ApiHealthState>('checking');
  const [snap, setSnap] = useState<Snapshot>(EMPTY);

  useEffect(() => {
    if (!getToken()) {
      setState('signed-out');
      return;
    }
    setState('loading');
    let cancelled = false;

    (async () => {
      // Each figure is fetched independently and allowed to fail on its own.
      // One endpoint being down should cost that one tile, not the dashboard:
      // a Promise.all here would blank the whole page over a single 404.
      const settle = async <T,>(p: Promise<T>): Promise<T | null> => {
        try {
          return await p;
        } catch {
          return null;
        }
      };

      const [meRes, healthRes, graph, path, mastery, due, mistakes, unread] =
        await Promise.all([
          settle(fetchMe()),
          settle(fetchHealth()),
          settle(fetchGraph()),
          settle(fetchLearningPath()),
          settle(fetchMastery()),
          settle(fetchDueReviews()),
          settle(fetchMistakes()),
          settle(fetchUnreadCount()),
        ]);
      if (cancelled) {
        return;
      }

      setMe(meRes);
      setHealth(healthRes ? 'healthy' : 'unreachable');

      const recommended =
        path && path.recommended_node_id
          ? (path.plan.find((n) => n.node_id === path.recommended_node_id) ??
            null)
          : (path?.plan.find((n) => n.status === 'available') ?? null);

      // Gamification is fetched separately because a brand-new account has no
      // profile row and the endpoint is allowed to 404 for that.
      const game = await settle(fetchGamification());

      setSnap({
        chapters: graph ? graph.nodes.length : null,
        next: recommended,
        practised: mastery ? mastery.states.length : null,
        due: due ? due.reviews.length : null,
        streak: game ? game.streak_days : null,
        mistakes: mistakes ? mistakes.items.length : null,
        unread: unread ? unread.count : 0,
      });
      setState('ready');
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

  const greeting = me?.display_name?.split(' ')[0] ?? '';
  const isTeacher = (me?.roles ?? []).some((r) =>
    ['teacher', 'admin', 'org_admin'].includes(r),
  );

  return (
    <AppShell>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <PageHeading
          title={greeting ? `Welcome back, ${greeting}.` : 'Welcome back.'}
          lead="Your AXIOM workspace: the mathematics ladder, practice that is graded on the server, and what the recorded attempts actually say you know."
          right={<StatusPill state={health} />}
        />

        {state === 'loading' && <LoadingPanel label="Loading your workspace." />}

        {state === 'ready' && (
          <div className="space-y-6">
            <ResumeHero next={snap.next} />

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <Stat
                icon={<BookOpen className="h-3.5 w-3.5" />}
                label="Chapters"
                value={snap.chapters === null ? '—' : String(snap.chapters)}
                hint={
                  snap.chapters === null
                    ? 'The curriculum did not answer.'
                    : 'Every one carries a full written course.'
                }
              />
              <Stat
                icon={<Brain className="h-3.5 w-3.5" />}
                label="Skills practised"
                value={
                  snap.practised === null || snap.practised === 0
                    ? '—'
                    : String(snap.practised)
                }
                hint={
                  snap.practised
                    ? 'Skills with at least one graded attempt.'
                    : 'No graded attempts recorded yet.'
                }
              />
              <Stat
                icon={<RotateCcw className="h-3.5 w-3.5" />}
                label="Due for review"
                // Em dash rather than 0, matching the other activity figures
                // here and the OCTET dashboard: a zero reads as a measured
                // quantity, and "no reviews have ever been scheduled" is a
                // different statement from "the queue ran and is empty today".
                value={snap.due === null || snap.due === 0 ? '—' : String(snap.due)}
                hint={
                  snap.due
                    ? 'Scheduled by SM-2, not by how long ago you saw it.'
                    : 'Nothing is scheduled. Review fills as you practise.'
                }
              />
              <Stat
                icon={<Activity className="h-3.5 w-3.5" />}
                label="Streak"
                value={
                  snap.streak === null || snap.streak === 0
                    ? '—'
                    : `${snap.streak}d`
                }
                hint={
                  snap.streak
                    ? 'Consecutive days with recorded activity.'
                    : 'No activity recorded yet.'
                }
              />
            </div>

            <Band title="Study">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Entry
                  href="/learn"
                  icon={<BookOpen className="h-4 w-4" />}
                  title="Learn"
                  body="Every chapter as a full written course: numbered sections with the mathematics set inline, worked examples, the misconceptions this topic really produces, and a self-test."
                  foot={
                    <Tag tone="brand">
                      {snap.chapters === null
                        ? 'chapters'
                        : `${snap.chapters} chapters`}
                    </Tag>
                  }
                  accent
                />
                <Entry
                  href="/practice"
                  icon={<FlaskConical className="h-4 w-4" />}
                  title="Practice"
                  body="One question at a time, generated per learner and graded on the server by CAS, with a hint ladder that runs before the answer rather than instead of it."
                  foot={
                    <Tag>
                      {snap.practised
                        ? `${snap.practised} skills touched`
                        : 'not started'}
                    </Tag>
                  }
                />
                <Entry
                  href="/review"
                  icon={<RotateCcw className="h-4 w-4" />}
                  title="Review"
                  body="Spaced repetition over what you actually got wrong, scheduled by SM-2 rather than by when you last felt like it."
                  foot={
                    <Tag>{snap.due ? `${snap.due} due` : 'nothing due'}</Tag>
                  }
                />
                <Entry
                  href="/mastery"
                  icon={<Brain className="h-4 w-4" />}
                  title="Mastery"
                  body="An estimate per skill with the evidence behind every change, so a number you disagree with can be argued with rather than just read."
                  foot={
                    <Tag>
                      {snap.practised ? 'has evidence' : 'needs attempts'}
                    </Tag>
                  }
                />
                <Entry
                  href="/map"
                  icon={<MapIcon className="h-4 w-4" />}
                  title="Curriculum map"
                  body="The whole skill graph laid out by prerequisite depth, so you can see what a topic stands on before you start it."
                  foot={<Tag>open</Tag>}
                />
                <Entry
                  href="/path"
                  icon={<Compass className="h-4 w-4" />}
                  title="Path"
                  body="Pre-algebra through the proof-based core in prerequisite order. Locked skills open as you master what they depend on."
                  foot={
                    <Tag>
                      {snap.next ? `next: ${snap.next.code}` : 'open'}
                    </Tag>
                  }
                />
              </div>
            </Band>

            <Band title="Assess and engage">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Entry
                  href="/cat"
                  icon={<Radio className="h-4 w-4" />}
                  title="Adaptive test"
                  body="A short test that picks each item from your current estimate, so it converges on your level instead of walking a fixed list."
                  foot={<Tag>open</Tag>}
                />
                <Entry
                  href="/assessments"
                  icon={<ClipboardList className="h-4 w-4" />}
                  title="Assessments"
                  body="Teacher-authored papers assigned to you. Start one while its window is open and take it here."
                  foot={<Tag>assigned to you</Tag>}
                />
                <Entry
                  href="/copilot"
                  icon={<MessageSquare className="h-4 w-4" />}
                  title="Copilot"
                  body="A tutor grounded in your own lessons. Every reply carries its sources, and it will not hand over a proof you are being asked to write."
                  foot={<Tag>open</Tag>}
                />
                <Entry
                  href="/tutor"
                  icon={<Sparkles className="h-4 w-4" />}
                  title="Live tutoring"
                  body="A shared whiteboard, chat and pushed problems in real time. Text and drawing are live; there is no video."
                  foot={<Tag>open</Tag>}
                />
                <Entry
                  href="/achievements"
                  icon={<Trophy className="h-4 w-4" />}
                  title="Achievements"
                  body="XP, level, streak and badges, plus an opt-in leaderboard shown under an alias rather than your name."
                  foot={
                    <Tag>{snap.streak ? `${snap.streak}d streak` : 'no streak yet'}</Tag>
                  }
                />
                <Entry
                  href="/notifications"
                  icon={<ListChecks className="h-4 w-4" />}
                  title="Notifications"
                  body="Assignments, grades, badges and system messages, newest first."
                  foot={
                    snap.unread > 0 ? (
                      <Tag tone="brand">{snap.unread} unread</Tag>
                    ) : (
                      <Tag>nothing unread</Tag>
                    )
                  }
                />
              </div>
            </Band>

            {isTeacher && (
              <Band title="Teaching">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <Entry
                    href="/teacher"
                    icon={<GraduationCap className="h-4 w-4" />}
                    title="Teacher console"
                    body="Build assessments from the skill graph, assign them, and read the results per learner and per item."
                    foot={<Tag>teacher</Tag>}
                  />
                  <Entry
                    href="/studio"
                    icon={<FlaskConical className="h-4 w-4" />}
                    title="Content Studio"
                    body="Author and edit items. The prompt renders its mathematics live and Test runs the real grader before anything is served."
                    foot={<Tag>teacher</Tag>}
                  />
                  <Entry
                    href="/analytics"
                    icon={<LineChart className="h-4 w-4" />}
                    title="Analytics"
                    body="Item analysis, standards mastery and growth, from graded attempts only. No percentiles: there is no cohort."
                    foot={<Tag>teacher</Tag>}
                  />
                  <Entry
                    href="/grading-review"
                    icon={<ListChecks className="h-4 w-4" />}
                    title="Grading review"
                    body="AI-scored free responses queued for a human. The AI score is a suggestion and the override is the grade of record."
                    foot={<Tag>teacher</Tag>}
                  />
                  <Entry
                    href="/proctoring"
                    icon={<ShieldCheck className="h-4 w-4" />}
                    title="Proctoring review"
                    body="Flagged sessions, highest anomaly first. The score routes attention; it is not an accusation."
                    foot={<Tag>teacher</Tag>}
                  />
                  <Entry
                    href="/integrations"
                    icon={<Compass className="h-4 w-4" />}
                    title="Integrations"
                    body="LTI 1.3 to an LMS and OneRoster to an SIS, with the keys and endpoints this deployment actually exposes."
                    foot={<Tag>admin</Tag>}
                  />
                </div>
              </Band>
            )}

            <div className="grid gap-3 lg:grid-cols-2">
              <Card className="p-4">
                <h2 className="text-sm font-semibold text-foreground">
                  What to fix next
                </h2>
                {snap.mistakes ? (
                  <>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {snap.mistakes} recorded incorrect answer
                      {snap.mistakes === 1 ? '' : 's'}, each with the correct
                      answer and why it is correct.
                    </p>
                    <Link
                      href="/review"
                      className="mt-2.5 inline-flex items-center justify-center rounded-lg bg-brand-600 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                    >
                      Open review
                    </Link>
                  </>
                ) : (
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Nothing recorded yet. Answer a few questions and this fills
                    with the skills you actually missed, rather than a guess
                    about which ones are hard.
                  </p>
                )}
              </Card>

              <Card className="p-4">
                <h2 className="text-sm font-semibold text-foreground">
                  How these numbers are made
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Every figure on this page is this account&apos;s own recorded
                  attempts. There are no percentiles, because there is no cohort
                  to compare against, and none will be shown until there is. A
                  figure with nothing behind it reads as an em dash rather than
                  a zero.
                </p>
              </Card>
            </div>
          </div>
        )}
      </main>
    </AppShell>
  );
}

/**
 * Where to pick up, and why that one.
 *
 * The reason string comes from the path planner ("recommended next --
 * available: no prerequisites"), so the hero explains its own choice instead
 * of asserting one. With no plan it says so rather than inventing a start.
 */
function ResumeHero({ next }: { next: PathNode | null }) {
  if (!next) {
    return (
      <Card className="p-5">
        <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400">
          <GraduationCap className="h-4 w-4" />
          <span className="text-[11px] font-semibold uppercase tracking-wide">
            Start here
          </span>
        </div>
        <p className="mt-1.5 text-lg font-semibold text-foreground">
          The path planner has not returned a next skill.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse the chapters and pick one — the recommendation appears once
          the planner can reach the graph.
        </p>
        <Link
          href="/learn"
          className="mt-3 inline-flex items-center justify-center rounded-lg border border-border px-3.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-brand-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          All chapters
        </Link>
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400">
            <GraduationCap className="h-4 w-4" />
            <span className="text-[11px] font-semibold uppercase tracking-wide">
              Start here
            </span>
          </div>
          <p className="mt-1.5 text-lg font-semibold text-foreground">
            {next.title}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            <span className="font-mono text-xs">{next.code}</span>
            {next.reason ? ` · ${next.reason}` : ''}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Link
            href={`/learn/${encodeURIComponent(next.code)}`}
            className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            Read the chapter
          </Link>
          <Link
            href={`/practice?node=${encodeURIComponent(next.code)}`}
            className="inline-flex items-center justify-center rounded-lg border border-border px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            Practise it
          </Link>
        </div>
      </div>
    </Card>
  );
}
