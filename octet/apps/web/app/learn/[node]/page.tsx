'use client';

import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronRight,
  Circle,
  Clock,
  GraduationCap,
  Lightbulb,
  ListChecks,
  Video,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  CurriculumNode,
  Lesson,
  LessonSection,
  LessonTable,
  TriangleView as TriangleViewData,
  getCurriculumNodes,
  getLesson,
  getTriangle,
} from '@/lib/api';
import LessonVideoPlayer from '@/components/LessonVideoPlayer';
import LessonProse from '@/components/LessonProse';
import TriangleView from '@/components/TriangleView';
import {
  LAB_NAMES,
  type LabLink,
  labLinkForLesson,
  modeLabel,
} from '@/lib/xrLabs';
import {
  Card,
  ErrorPanel,
  LoadingPanel,
  Page,
  Pill,
  errorMessage,
} from '@/app/_ui/shell';

// The chapter reader, built to the prep test course page
// (eureka .../[exam]/study): rail of this chapter's material on the left, the
// book in the middle, the companion column on the right.
//
//   rail       the unit's chapters with read state, always in view
//   book       the reading - numbered sections, figures, tables, callouts -
//              ending in Mark chapter read and Next
//   companion  sticky beside the book: the video slot, key takeaways, exam
//              tips, practice. The things you want in view while reading.
//
// THE SIX PART ARC IS DATA, NOT LAYOUT. Every node carries the arc and the
// compliance checker enforces that. What the contract does not require is six
// stacked cards under every chapter, which is what this page used to render
// and what made it read as an instrument panel rather than a course. Where a
// written chapter exists, the arc folds into the book: the worked example
// becomes the closing section, the try-it keeps its click-to-reveal card
// (that interaction IS the pedagogy and stays), the pitfall becomes the final
// callout, and the remaining parts sit behind a disclosure. Where no chapter
// exists yet, the arc is the content and renders in full.
//
// Read state is localStorage, same as the prep test course page: a chapter is
// "read" because you said so, not because a scroll listener guessed.

const READ_KEY = 'octet:chapters-read';

function loadRead(): Set<string> {
  try {
    const raw = window.localStorage.getItem(READ_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

export default function LessonPage() {
  const params = useParams<{ node: string }>();
  const router = useRouter();
  const raw = params?.node;
  const nodeCode = decodeURIComponent(Array.isArray(raw) ? raw[0] : raw || '');

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [nodes, setNodes] = useState<CurriculumNode[]>([]);
  const [triangle, setTriangle] = useState<TriangleViewData | null>(null);
  const [read, setRead] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setRead(loadRead());
  }, []);

  useEffect(() => {
    if (!nodeCode) {
      setError('No node was named in the address.');
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const found = await getLesson(nodeCode);
        if (!cancelled) setLesson(found);
      } catch (err) {
        if (!cancelled) setError(errorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [nodeCode]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await getCurriculumNodes();
        if (!cancelled) setNodes(result.nodes);
      } catch {
        // Title falls back to the code; the rail stays empty.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const here = nodes.find((n) => n.code === nodeCode) ?? null;
  const title = here?.title ?? '';
  const siblings = useMemo(
    () => (here ? nodes.filter((n) => n.unit === here.unit) : []),
    [nodes, here],
  );
  const courseNodes = useMemo(
    () => (here ? nodes.filter((n) => n.course === here.course) : []),
    [nodes, here],
  );
  const courseRead = courseNodes.filter((n) => read.has(n.code)).length;

  const idx = siblings.findIndex((n) => n.code === nodeCode);
  const next = idx >= 0 ? siblings[idx + 1] : undefined;

  const hasTriangle = lesson?.has_triangle_view ?? false;
  const labLink = labLinkForLesson(nodeCode, hasTriangle);
  const extras = lesson?.extras ?? null;

  useEffect(() => {
    let cancelled = false;
    setTriangle(null);
    if (!nodeCode || !hasTriangle) return;
    (async () => {
      try {
        const result = await getTriangle(nodeCode);
        if (!cancelled) setTriangle(result);
      } catch {
        // The lesson said a view exists and fetching it failed anyway. The
        // section stays hidden rather than showing a broken panel.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [nodeCode, hasTriangle]);

  const markRead = () => {
    setRead((prev) => {
      const nextSet = new Set(prev);
      nextSet.has(nodeCode) ? nextSet.delete(nodeCode) : nextSet.add(nodeCode);
      try {
        window.localStorage.setItem(READ_KEY, JSON.stringify([...nextSet]));
      } catch {
        /* non-fatal */
      }
      return nextSet;
    });
  };

  const goNext = () => {
    if (!next) return;
    router.push(`/learn/${encodeURIComponent(next.code)}`);
    window.scrollTo({ top: 0 });
  };

  const sectionCount = extras?.sections.length ?? 0;

  return (
    <Page>
      {/* Header strip: where you are, and the course's read count */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/learn"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All chapters
        </Link>
        {here && courseNodes.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Chapters read</p>
              <p className="text-sm font-semibold tabular-nums">
                {courseRead}/{courseNodes.length}
              </p>
            </div>
            <div className="h-2 w-28 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-brand-500 transition-all"
                style={{
                  width: `${courseNodes.length ? Math.round((courseRead / courseNodes.length) * 100) : 0}%`,
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
          {/* ── Rail: this unit's chapters ─────────────────────────── */}
          <aside className="hidden lg:block">
            <div className="sticky top-4 space-y-3">
              <Card className="p-3">
                <div className="mb-1 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-brand-500" />
                  <h2 className="text-sm font-semibold">
                    {here?.unit_title ?? 'This chapter'}
                  </h2>
                </div>
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  {here?.course} ·{' '}
                  {siblings.filter((n) => n.has_chapter).length} of{' '}
                  {siblings.length} with written material
                </p>
              </Card>

              <Card className="max-h-[62vh] overflow-y-auto p-2">
                <ul className="space-y-0.5">
                  {siblings.map((n, i) => {
                    const on = n.code === nodeCode;
                    const done = read.has(n.code);
                    const prev = siblings[i - 1];
                    const newPart = n.part && n.part !== (prev?.part ?? null);
                    return (
                      <li key={n.code}>
                        {newPart && (
                          <p className="mb-0.5 mt-2 px-2.5 text-[10px] font-semibold uppercase tracking-wide text-brand-600 first:mt-0 dark:text-brand-400">
                            Part {n.part}
                          </p>
                        )}
                        <Link
                          href={`/learn/${encodeURIComponent(n.code)}`}
                          aria-current={on ? 'page' : undefined}
                          className={`flex w-full items-start gap-2 rounded-lg px-2.5 py-2 text-sm transition ${
                            on
                              ? 'border border-brand-500/40 bg-brand-500/10'
                              : 'hover:bg-muted'
                          }`}
                        >
                          {done ? (
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600" />
                          ) : (
                            <Circle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
                          )}
                          <span className="min-w-0">
                            <span className="block truncate font-medium">
                              {i + 1}. {n.title}
                            </span>
                            {n.has_chapter && (
                              <span className="text-[11px] text-muted-foreground">
                                full chapter
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

          {/* ── Book + companion ───────────────────────────────────── */}
          <div className="grid min-w-0 gap-4 2xl:grid-cols-[minmax(0,1fr)_320px]">
            {/* Book. The card fills its grid column; the inner wrapper caps
                the text at a reading measure (~46rem, what the old 1024px
                shell cap produced) now that the shell no longer constrains
                page width. */}
            <Card className="min-w-0 p-5 sm:p-7">
              <div className="max-w-[46rem]">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-brand-500/10 px-2 py-0.5 text-xs font-medium text-brand-600 dark:text-brand-400">
                  {here?.unit_title ?? here?.unit ?? ''}
                </span>
                {extras ? (
                  <>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" /> {extras.reading_minutes} min
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <BookOpen className="h-3 w-3" /> {sectionCount} section
                      {sectionCount === 1 ? '' : 's'}
                    </span>
                  </>
                ) : (
                  <span
                    className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                    title="The full written chapter for this node is still being authored."
                  >
                    summary only
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                {title || nodeCode}
              </h1>
              {extras?.lead && (
                <div className="mt-2 text-muted-foreground [&_p]:text-[15px] [&_p]:leading-7">
                  <LessonProse body={extras.lead} />
                </div>
              )}
              {!extras && (
                <p className="mt-2 whitespace-pre-wrap text-[15px] leading-7 text-muted-foreground">
                  {lesson.objective}
                </p>
              )}

              {extras ? (
                <div className="mt-6 space-y-8">
                  {extras.sections.map((section, i) => (
                    <BookSection
                      key={section.id}
                      index={i + 1}
                      section={section}
                    />
                  ))}

                  {/* The arc's worked example closes the reading as its own
                      numbered section: it is real content, done once in
                      full, and it belongs in the book rather than in an
                      apparatus below it. */}
                  <section id="worked-example" className="scroll-mt-4">
                    <SectionHeader
                      index={sectionCount + 1}
                      title="Worked example"
                    />
                    <p className="my-3 whitespace-pre-wrap text-[15px] leading-7 text-foreground/90">
                      {lesson.worked_example}
                    </p>
                  </section>

                  <TryIt
                    prompt={lesson.try_it.prompt}
                    answer={lesson.try_it.answer}
                  />

                  <Note text={lesson.pitfall} label="Pitfall" />

                  {/* The rest of the arc, and the Johnstone triangle where
                      one exists. Real pedagogy, kept - but behind a
                      disclosure, because stacked open under every chapter it
                      walled the page. */}
                  <details className="group rounded-xl border border-border">
                    <summary className="cursor-pointer select-none rounded-xl px-4 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground [&::-webkit-details-marker]:hidden">
                      <ChevronRight className="mr-1.5 inline h-3.5 w-3.5 transition-transform group-open:rotate-90" />
                      The teaching arc — objective, build-on, core idea
                      {triangle ? ', and the same idea at three levels' : ''}
                    </summary>
                    <div className="space-y-4 border-t border-border px-4 py-4">
                      <ArcLine label="Objective" body={lesson.objective} />
                      <ArcLine label="Build on" body={lesson.build_on} />
                      <ArcLine label="Core idea" body={lesson.core_idea} />
                      {triangle && <Triangle view={triangle} />}
                    </div>
                  </details>
                </div>
              ) : (
                /* No written chapter yet: the arc is the content, read as
                    prose. The objective is the lead, the build-on and core
                    idea are the body with no apparatus labels over them, and
                    the triangle sits behind the same disclosure a chapter
                    node uses. */
                <div className="mt-6 space-y-6">
                  <div className="space-y-4">
                    <p className="whitespace-pre-wrap text-[15px] leading-7 text-foreground/90">
                      {lesson.build_on}
                    </p>
                    <p className="whitespace-pre-wrap text-[15px] leading-7 text-foreground/90">
                      {lesson.core_idea}
                    </p>
                  </div>

                  <section className="scroll-mt-4">
                    <div className="mb-1 border-b border-border pb-2">
                      <h3 className="text-lg font-bold">Worked example</h3>
                    </div>
                    <p className="my-3 whitespace-pre-wrap text-[15px] leading-7 text-foreground/90">
                      {lesson.worked_example}
                    </p>
                  </section>

                  <TryIt
                    prompt={lesson.try_it.prompt}
                    answer={lesson.try_it.answer}
                  />
                  <Note text={lesson.pitfall} label="Pitfall" />

                  {triangle && (
                    <details className="group rounded-xl border border-border">
                      <summary className="cursor-pointer select-none rounded-xl px-4 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground [&::-webkit-details-marker]:hidden">
                        <ChevronRight className="mr-1.5 inline h-3.5 w-3.5 transition-transform group-open:rotate-90" />
                        The same idea at three levels
                      </summary>
                      <div className="border-t border-border px-4 py-4">
                        <Triangle view={triangle} />
                      </div>
                    </details>
                  )}
                </div>
              )}

              {/* Footer: progress and forward motion */}
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
                  {read.has(nodeCode) ? 'Marked as read' : 'Mark chapter read'}
                </button>
                {next && (
                  <button
                    type="button"
                    onClick={goNext}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2 text-sm font-medium transition-colors hover:border-brand-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  >
                    Next: {next.title}
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                )}
                <Link
                  href="/learn"
                  className="ml-auto text-xs text-muted-foreground hover:underline"
                >
                  All {here?.unit_title ?? ''} chapters
                </Link>
              </div>
              </div>
            </Card>

            {/* Companion */}
            <aside className="space-y-4 2xl:sticky 2xl:top-4 2xl:self-start">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Video className="h-4 w-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold">Video lesson</h2>
                </div>
                {extras?.video ? (
                  <>
                    <LessonVideoPlayer
                      src={`/videos/octet/${extras.video.slug}.mp4`}
                      title={extras.video.title}
                    />
                    <p className="mt-2 text-[13px] font-medium">
                      {extras.video.title}
                    </p>
                    {extras.video.summary && (
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {extras.video.summary}
                      </p>
                    )}
                  </>
                ) : (
                  <Card className="p-4">
                    <p className="text-sm font-medium">Not recorded yet</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      No OCTET video covers this chapter yet. The player is
                      wired and will appear here the moment one is uploaded —
                      we would rather show this than a stock clip.
                    </p>
                  </Card>
                )}
              </div>

              {extras && extras.key_takeaways.length > 0 && (
                <Card className="p-4">
                  <div className="mb-2.5 flex items-center gap-2">
                    <ListChecks className="h-4 w-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold">Key takeaways</h2>
                  </div>
                  <ul className="space-y-2">
                    {extras.key_takeaways.map((k, i) => (
                      <li
                        key={i}
                        className="flex gap-2 text-[13px] leading-relaxed"
                      >
                        <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                        <span>{k}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {extras && extras.exam_tips.length > 0 && (
                <Card className="border-amber-500/40 p-4">
                  <div className="mb-2.5 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <h2 className="text-sm font-semibold">
                      Exam tips ({extras.exam_tips.length})
                    </h2>
                  </div>
                  <ul className="space-y-2.5">
                    {extras.exam_tips.map((t, i) => (
                      <li
                        key={i}
                        className="flex gap-2 text-[13px] leading-relaxed"
                      >
                        <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              <Card className="p-4">
                <h2 className="text-sm font-semibold">Now practise it</h2>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Questions on this node are generated and graded on the
                  server, so the answer key never reaches this page.
                </p>
                <Link
                  href={`/practice?node=${encodeURIComponent(nodeCode)}`}
                  className="mt-2.5 inline-flex items-center justify-center rounded-lg bg-brand-600 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  Practise this node
                </Link>
              </Card>

              {lesson.misconception && (
                <Card className="p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Pill tone="amber">named misconception</Pill>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {lesson.misconception}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    This lesson targets a belief the misconception library
                    names, which is where a wrong answer on this topic routes.
                  </p>
                </Card>
              )}

              {labLink && <LabCard link={labLink} />}
            </aside>
          </div>
        </div>
      )}
    </Page>
  );
}

// ---------------------------------------------------------------------------
// book pieces
// ---------------------------------------------------------------------------

/** The prep test section header: 01-style marker, underlined. */
function SectionHeader({ index, title }: { index: number; title: string }) {
  return (
    <div className="mb-1 flex items-baseline gap-2 border-b border-border pb-2">
      <span className="text-xs font-bold text-muted-foreground">
        {String(index).padStart(2, '0')}
      </span>
      <h3 className="text-lg font-bold">{title}</h3>
    </div>
  );
}

function BookSection({
  index,
  section,
}: {
  index: number;
  section: LessonSection;
}) {
  return (
    <section id={section.id} className="scroll-mt-4">
      <SectionHeader index={index} title={section.heading} />
      <div className="[&_p]:text-[15px] [&_p]:leading-7 [&_p]:text-foreground/90">
        <LessonProse body={section.body} />
      </div>
      {section.figure && <FigureBlock figure={section.figure} />}
      {section.table && <TableBlock table={section.table} />}
      {section.important && <Note text={section.important} />}
    </section>
  );
}

/** The amber callout, in the prep test reader's own dress. */
function Note({ text, label = 'Note' }: { text: string; label?: string }) {
  return (
    <div className="my-4 rounded-lg border-l-4 border-amber-500 bg-amber-500/10 px-4 py-3 text-sm leading-relaxed">
      <span className="font-semibold">{label}. </span>
      {text}
    </div>
  );
}

/** One arc part inside the disclosure, compact. */
function ArcLine({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
        {body}
      </p>
    </div>
  );
}

/**
 * A figure, in the theme the reader is actually in.
 *
 * Which file to show is decided from the media query rather than a Tailwind
 * dark: variant, because this app's dark mode lives in globals.css as a
 * prefers-color-scheme block over the CSS variables and nothing sets a class.
 */
function FigureBlock({
  figure,
}: {
  figure: { stem: string; caption: string; alt: string };
}) {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setDark(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setDark(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <figure className="my-5">
      <div className="overflow-x-auto rounded-xl border border-border bg-card p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/figures/octet/${figure.stem}-${dark ? 'dark' : 'light'}.svg`}
          alt={figure.alt}
          className="mx-auto block w-full max-w-[42rem]"
        />
      </div>
      <figcaption className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
        {figure.caption}
      </figcaption>
    </figure>
  );
}

function TableBlock({ table }: { table: LessonTable }) {
  return (
    <figure className="my-5">
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <caption className="border-b border-border bg-muted/60 px-3 py-2 text-left text-[13px] font-medium">
            {table.caption}
          </caption>
          <thead className="bg-muted/60">
            <tr>
              {table.columns.map((c) => (
                <th
                  key={c}
                  scope="col"
                  className="border-b border-border px-3 py-2 text-left font-semibold"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={`border-b border-border/50 px-3 py-2 align-top ${
                      j === 0 ? 'font-medium' : 'tabular-nums'
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(table.note || table.source) && (
        <figcaption className="mt-2 space-y-0.5 text-xs leading-relaxed text-muted-foreground">
          {table.note && <p>{table.note}</p>}
          {table.source && <p>Source: {table.source}</p>}
        </figcaption>
      )}
    </figure>
  );
}

// Part five of the arc, in the book because the retrieval attempt IS the
// pedagogy.
//
// BINDING RULE: the answer is not on screen when this loads, and it is not
// rendered-then-hidden with CSS either, because that would put it in the page
// source where it can be read without attempting anything. It is only added
// to the document once the learner asks for it.
function TryIt({ prompt, answer }: { prompt: string; answer: string }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="rounded-xl border-l-4 border-brand-500 bg-brand-500/5 px-4 py-4">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
        Try it
      </p>
      <p className="whitespace-pre-wrap text-[15px] leading-7 text-foreground/90">
        {prompt}
      </p>
      <div className="mt-3 border-t border-border/60 pt-3">
        {!revealed ? (
          <>
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              Show answer
            </button>
            <p className="mt-2 text-xs text-muted-foreground">
              Work it out first. Checking your own attempt against the answer
              is what makes this part do anything.
            </p>
          </>
        ) : (
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Answer
            </p>
            <p className="whitespace-pre-wrap text-[15px] leading-7 text-foreground/90">
              {answer}
            </p>
            <button
              type="button"
              onClick={() => setRevealed(false)}
              className="mt-2 text-sm text-muted-foreground hover:underline"
            >
              Hide answer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// companion pieces
// ---------------------------------------------------------------------------

function LabCard({ link }: { link: LabLink }) {
  return (
    <a
      href={link.href}
      className="block rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-brand-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Pill tone="brand">3D lab</Pill>
        <span className="text-[13px] font-semibold">
          {LAB_NAMES[link.lab]}, {modeLabel(link)} mode
        </span>
      </div>
      <p className="mt-2 text-[13px] leading-relaxed">{link.blurb}</p>
      <p className="mt-2 text-xs text-muted-foreground">
        Opens on EUREKA. What you turn there is a model of this node, not a
        measurement of it.
      </p>
    </a>
  );
}

// Johnstone's three levels. Inside the arc disclosure for chapter nodes, and
// inline after the core idea for arc-only nodes, which is where it does its
// work.
function Triangle({ view }: { view: TriangleViewData }) {
  return (
    <section className="space-y-3" aria-label="The same idea at three levels">
      <TriangleView
        nodeTitle={view.title}
        macroscopic={{ caption: view.macroscopic }}
        particulate={{ caption: view.particulate }}
        symbolic={{ caption: view.symbolic, equation: view.katex }}
      />
      <Card className="p-3.5">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          What is the same in all three
        </h3>
        <p className="mt-1 text-sm leading-relaxed">{view.connector}</p>
      </Card>
      <Note text={view.pitfall} label="Level confusion" />
      {view.caption && (
        <p className="text-xs text-muted-foreground">{view.caption}</p>
      )}
    </section>
  );
}
