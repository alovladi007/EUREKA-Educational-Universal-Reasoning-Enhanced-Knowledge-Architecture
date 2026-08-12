'use client';

import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronRight,
  Circle,
  Clock,
  ListChecks,
  Video,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  fetchGraph,
  fetchLesson,
  getToken,
  type GraphNode,
  type Lesson,
  type LessonStep,
} from '@/lib/api';
import { ErrorPanel, SignInScreen } from '@/components/PageShell';
import { AppShell } from '@/components/AppShell';
import LessonProse from '@/components/LessonProse';
import LessonVideoPlayer from '@/components/LessonVideoPlayer';
import { Card, LoadingPanel, Tag } from '@/components/ui';
import { groupCurriculum } from '@/lib/curriculum-groups';

// The chapter reader, built to the prep test course page
// (eureka .../dashboard/test-prep/[exam]/study): rail of this subject's
// chapters on the left, the book in the middle, the companion on the right.
//
//   rail       the subject's chapters with read state, always in view
//   book       the reading - numbered sections and callouts - ending in
//              Mark chapter read and Next
//   companion  sticky beside the book: the video slot, the section list,
//              practice. The things you want in view while reading.
//
// WHY THIS REPLACED THE SPLIT PANE
//
// Learn used to render the lesson inline beside the skill tree as an <ol> of
// steps, each headed by its step KIND. That produced "1. reading / 2. reading
// / 5. example / 12. pitfall" down the page: the teaching apparatus set as the
// headings, with the author's actual section titles demoted underneath in
// small type. The apparatus is real - the kinds drive ordering and the
// authoring gate - but it is metadata, and a reader should see chapters.
//
// So the kinds do structural work here instead of typographic work. A
// `reading` step opens a numbered section and its title IS the heading; an
// `example`, `pitfall` or `check` becomes a callout attached to the section it
// follows, which is where the author put it. Nothing is dropped and nothing is
// labelled "reading".
//
// Read state is localStorage, same as the prep test course page: a chapter is
// "read" because you said so, not because a scroll listener guessed.

const READ_KEY = 'axiom:chapters-read';

// Reading speed for the time estimate. 200 wpm is the conventional figure for
// technical prose; it is an estimate and the label says "min", not a promise.
const WORDS_PER_MINUTE = 200;

function loadRead(): Set<string> {
  try {
    const raw = window.localStorage.getItem(READ_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

/** A numbered section of the book, with the callouts the author put in it. */
interface BookSectionData {
  id: string;
  heading: string;
  body: string;
  callouts: LessonStep[];
}

/**
 * Fold the flat step list into sections.
 *
 * `reading` opens a section; everything else attaches to the open one. A
 * lesson that somehow opens with a non-reading step gets an untitled leading
 * section rather than losing those steps.
 */
function toSections(steps: LessonStep[]): BookSectionData[] {
  const out: BookSectionData[] = [];
  for (const step of [...steps].sort((a, b) => a.position - b.position)) {
    if (step.kind === 'reading' || out.length === 0) {
      out.push({
        id: `s${step.position}`,
        heading: step.title,
        body: step.kind === 'reading' ? step.body : '',
        callouts: step.kind === 'reading' ? [] : [step],
      });
      continue;
    }
    out[out.length - 1].callouts.push(step);
  }
  return out;
}

const CALLOUT: Record<
  string,
  { label: string; wrap: string; head: string }
> = {
  example: {
    label: 'Worked example',
    wrap: 'border-brand-500 bg-brand-500/5',
    head: 'text-brand-700 dark:text-brand-300',
  },
  pitfall: {
    label: 'Common pitfall',
    wrap: 'border-amber-500 bg-amber-500/10',
    head: 'text-amber-700 dark:text-amber-400',
  },
  check: {
    label: 'Check yourself',
    wrap: 'border-emerald-500 bg-emerald-500/10',
    head: 'text-emerald-700 dark:text-emerald-400',
  },
};

export default function ChapterPage() {
  const params = useParams<{ node: string }>();
  const router = useRouter();
  const raw = params?.node;
  const nodeCode = decodeURIComponent(Array.isArray(raw) ? raw[0] : raw || '');

  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [read, setRead] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSignedIn(getToken() !== null);
    setRead(loadRead());
  }, []);

  useEffect(() => {
    if (signedIn !== true || !nodeCode) {
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError('');
    setLesson(null);
    (async () => {
      try {
        const result = await fetchLesson(nodeCode);
        if (!cancelled) {
          setLesson(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Failed to load this chapter.',
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [nodeCode, signedIn]);

  useEffect(() => {
    if (signedIn !== true) {
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const graph = await fetchGraph();
        if (!cancelled) {
          setNodes(graph.nodes);
        }
      } catch {
        // The rail stays empty and the title falls back to the code. The
        // chapter itself does not depend on the graph.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [signedIn]);

  const here = nodes.find((n) => n.code === nodeCode) ?? null;

  // The rail is this node's own subject section, in curriculum order.
  // Whole-course entry points are claimed by CODE in lib/curriculum-groups.ts.
  // The API's `kind` is the pedagogy taxonomy (concept / computational_skill /
  // proof_technique) and has no "overview" value, so reading it here labelled
  // nothing.
  const { sectionLabel, siblings, overviewCodes } = useMemo(() => {
    const sections = groupCurriculum(nodes);
    for (const s of sections) {
      const all = [...s.overviews, ...s.skills];
      if (all.some((n) => n.code === nodeCode)) {
        return {
          sectionLabel: s.group.label,
          siblings: all,
          overviewCodes: new Set(s.overviews.map((n) => n.code)),
        };
      }
    }
    return {
      sectionLabel: '',
      siblings: [] as GraphNode[],
      overviewCodes: new Set<string>(),
    };
  }, [nodes, nodeCode]);

  const readHere = siblings.filter((n) => read.has(n.code)).length;
  const idx = siblings.findIndex((n) => n.code === nodeCode);
  const next = idx >= 0 ? siblings[idx + 1] : undefined;

  const sections = useMemo(
    () => (lesson ? toSections(lesson.steps) : []),
    [lesson],
  );
  const words = useMemo(
    () =>
      (lesson?.steps ?? []).reduce(
        (sum, s) => sum + (s.body ? s.body.split(/\s+/).filter(Boolean).length : 0),
        0,
      ),
    [lesson],
  );
  const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));

  const markRead = () => {
    setRead((prev) => {
      const nextSet = new Set(prev);
      if (nextSet.has(nodeCode)) {
        nextSet.delete(nodeCode);
      } else {
        nextSet.add(nodeCode);
      }
      try {
        window.localStorage.setItem(READ_KEY, JSON.stringify([...nextSet]));
      } catch {
        // Private browsing, or a full quota. Not worth failing the page for.
      }
      return nextSet;
    });
  };

  const goNext = () => {
    if (!next) {
      return;
    }
    router.push(`/learn/${encodeURIComponent(next.code)}`);
    // AppShell scrolls #main-content, not the window - it is the element
    // carrying overflow-y-auto. window.scrollTo here did nothing at all, so
    // the next chapter opened halfway down the previous one's page position.
    document.getElementById('main-content')?.scrollTo({ top: 0 });
  };

  if (signedIn === null) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading AXIOM.</p>
      </main>
    );
  }

  if (!signedIn) {
    return <SignInScreen />;
  }

  return (
    <AppShell>
      <main className="mx-auto max-w-[100rem] px-4 py-8 sm:px-6">
        {/* Header strip: where you are, and this subject's read count. */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/learn"
            className="inline-flex items-center gap-1.5 rounded text-sm text-muted-foreground transition-colors hover:text-foreground hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All chapters
          </Link>
          {siblings.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Chapters read</p>
                <p className="text-sm font-semibold tabular-nums text-foreground">
                  {readHere}/{siblings.length}
                </p>
              </div>
              <div className="h-2 w-28 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-brand-500 transition-all"
                  style={{
                    width: `${Math.round((readHere / siblings.length) * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {loading && <LoadingPanel label="Loading the chapter." />}
        {!loading && error && <ErrorPanel message={error} />}

        {!loading && !error && lesson && (
          <div className="grid gap-4 lg:grid-cols-[250px_minmax(0,1fr)]">
            {/* ── Rail: this subject's chapters ───────────────────── */}
            <aside className="hidden lg:block">
              <div className="sticky top-4 space-y-3">
                <Card className="p-3">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-brand-500" />
                    <h2 className="text-sm font-semibold text-foreground">
                      {sectionLabel || 'This subject'}
                    </h2>
                  </div>
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    {siblings.length} chapter
                    {siblings.length === 1 ? '' : 's'}, every one with a full
                    written course behind it.
                  </p>
                </Card>

                <Card className="max-h-[62vh] overflow-y-auto p-2">
                  <ul className="space-y-0.5">
                    {siblings.map((n, i) => {
                      const on = n.code === nodeCode;
                      const done = read.has(n.code);
                      return (
                        <li key={n.id}>
                          <Link
                            href={`/learn/${encodeURIComponent(n.code)}`}
                            aria-current={on ? 'page' : undefined}
                            className={`flex w-full items-start gap-2 rounded-lg px-2.5 py-2 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                              on
                                ? 'border border-brand-500/40 bg-brand-500/10'
                                : 'hover:bg-muted'
                            }`}
                          >
                            {done ? (
                              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                            ) : (
                              <Circle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
                            )}
                            <span className="min-w-0">
                              <span className="block truncate font-medium text-foreground">
                                {i + 1}. {n.title}
                              </span>
                              {overviewCodes.has(n.code) && (
                                <span className="text-[11px] text-muted-foreground">
                                  course overview
                                </span>
                              )}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </Card>
              </div>
            </aside>

            {/* ── Book + companion ────────────────────────────────── */}
            <div className="grid min-w-0 gap-4 2xl:grid-cols-[minmax(0,1fr)_320px]">
              {/* Book */}
              <Card className="min-w-0 p-5 sm:p-7">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  {sectionLabel && (
                    <span className="rounded-md bg-brand-500/10 px-2 py-0.5 text-xs font-medium text-brand-600 dark:text-brand-400">
                      {sectionLabel}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" /> {minutes} min
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <BookOpen className="h-3 w-3" /> {sections.length} section
                    {sections.length === 1 ? '' : 's'}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {nodeCode}
                  </span>
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  {lesson.title || here?.title || nodeCode}
                </h1>
                {lesson.summary && (
                  <p className="mt-2 text-[15px] leading-7 text-muted-foreground">
                    {lesson.summary}
                  </p>
                )}

                {sections.length === 0 ? (
                  <p className="mt-6 text-sm text-muted-foreground">
                    This chapter has not been written yet.
                  </p>
                ) : (
                  <div className="mt-7 space-y-9">
                    {sections.map((section, i) => (
                      <BookSection
                        key={section.id}
                        index={i + 1}
                        section={section}
                      />
                    ))}
                  </div>
                )}

                {/* Footer: progress and forward motion. */}
                <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                  <button
                    type="button"
                    onClick={markRead}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                      read.has(nodeCode)
                        ? 'bg-muted text-muted-foreground hover:text-foreground'
                        : 'bg-brand-600 text-white hover:bg-brand-700'
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" />
                    {read.has(nodeCode)
                      ? 'Marked as read'
                      : 'Mark chapter read'}
                  </button>
                  {next && (
                    <button
                      type="button"
                      onClick={goNext}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                    >
                      Next: {next.title}
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <Link
                    href="/learn"
                    className="ml-auto rounded text-xs text-muted-foreground hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  >
                    All {sectionLabel || 'chapters'}
                  </Link>
                </div>
              </Card>

              {/* Companion */}
              <aside className="space-y-4 2xl:sticky 2xl:top-4 2xl:self-start">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Video className="h-4 w-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold text-foreground">
                      Video lesson
                    </h2>
                  </div>
                  <LessonVideoPlayer
                    src={`/videos/axiom/${encodeURIComponent(nodeCode)}.mp4`}
                    title={lesson.title || nodeCode}
                  />
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    The player is wired to{' '}
                    <code className="font-mono text-[11px]">
                      /videos/axiom/{nodeCode}.mp4
                    </code>{' '}
                    and shows this poster until that file exists. We would
                    rather show it than a stock clip.
                  </p>
                </div>

                {sections.length > 0 && (
                  <Card className="p-4">
                    <div className="mb-2.5 flex items-center gap-2">
                      <ListChecks className="h-4 w-4 text-muted-foreground" />
                      <h2 className="text-sm font-semibold text-foreground">
                        In this chapter
                      </h2>
                    </div>
                    <ol className="space-y-1.5">
                      {sections.map((s, i) => (
                        <li key={s.id} className="flex gap-2 text-[13px]">
                          <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <a
                            href={`#${s.id}`}
                            className="min-w-0 rounded leading-snug text-muted-foreground transition-colors hover:text-foreground hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                          >
                            {s.heading}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </Card>
                )}

                <Card className="p-4">
                  <h2 className="text-sm font-semibold text-foreground">
                    Now practise it
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Questions on this node are served and graded on the server,
                    so the answer key never reaches this page.
                  </p>
                  <Link
                    href={`/practice?node=${encodeURIComponent(nodeCode)}`}
                    className="mt-2.5 inline-flex items-center justify-center rounded-lg bg-brand-600 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  >
                    Practise this node
                  </Link>
                </Card>

                {here && (
                  <Card className="p-4">
                    <h2 className="text-sm font-semibold text-foreground">
                      Where this sits
                    </h2>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <Tag tone="brand">tier {here.tier}</Tag>
                      {here.track && <Tag tone="brand">{here.track}</Tag>}
                      <Tag>{here.kind}</Tag>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      Tier is the ladder position the path planner orders by;
                      the track separates the compute and prove routes through
                      the same material.
                    </p>
                  </Card>
                )}
              </aside>
            </div>
          </div>
        )}
      </main>
    </AppShell>
  );
}

// ---------------------------------------------------------------------------
// book pieces
// ---------------------------------------------------------------------------

/** The prep test section header: 01-style marker, underlined. */
function SectionHeader({ index, title }: { index: number; title: string }) {
  return (
    <div className="mb-3 flex items-baseline gap-2 border-b border-border pb-2">
      <span className="font-mono text-xs font-bold tabular-nums text-muted-foreground">
        {String(index).padStart(2, '0')}
      </span>
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
    </div>
  );
}

function BookSection({
  index,
  section,
}: {
  index: number;
  section: BookSectionData;
}) {
  return (
    <section id={section.id} className="scroll-mt-4">
      <SectionHeader index={index} title={section.heading} />
      {section.body && <LessonProse body={section.body} />}
      {section.callouts.map((c) => (
        <Callout key={c.position} step={c} />
      ))}
    </section>
  );
}

/**
 * An example, pitfall or check, in the reader's callout dress.
 *
 * The step's own title is the heading; the kind picks the colour and the small
 * label above it. That label is a callout convention - the reader needs to
 * know a worked example is a worked example - and it is not the same thing as
 * setting the raw kind string as the section heading, which is what this page
 * used to do.
 */
function Callout({ step }: { step: LessonStep }) {
  const dress = CALLOUT[step.kind] ?? {
    label: step.kind,
    wrap: 'border-border bg-muted/40',
    head: 'text-muted-foreground',
  };
  return (
    <div className={`my-5 rounded-xl border-l-4 px-4 py-4 ${dress.wrap}`}>
      <p
        className={`mb-1 text-[11px] font-semibold uppercase tracking-wide ${dress.head}`}
      >
        {dress.label}
      </p>
      <h3 className="mb-2 text-[15px] font-semibold text-foreground">
        {step.title}
      </h3>
      <LessonProse body={step.body} />
    </div>
  );
}
