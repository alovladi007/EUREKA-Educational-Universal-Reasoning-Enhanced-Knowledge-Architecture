'use client';

/**
 * The course page, for every exam.
 *
 * The "Read Lessons" tab was a list of sections you clicked into one at a
 * time. That is how an exam is ADMINISTERED, not how anyone studies a
 * course. This page is organised the way a prep course is: units down the
 * side, the chapter's text in the middle, and the things you want in view
 * while you read on the right.
 *
 * Three zones on a wide screen:
 *   rail      the unit's chapters, always visible, with what you have read
 *   book      the chapter's long-form content - the widest zone, because it
 *             is the actual material
 *   companion sticky beside the book: the media slot, then this chapter's
 *             key takeaways and exam tips, so they stay in view rather than
 *             sitting at the bottom where nobody scrolls to them
 *
 * The unit axis comes from `exam-study-axis.ts`. For nine of the ten exams
 * the units are the curriculum's own sections; for MCAT they are the seven
 * subjects students actually study on. Either way every chapter in the rail
 * is a chapter that exists.
 *
 * On the media slot, stated plainly because it matters: only CISSP has
 * recorded video today. The slot renders the real player the moment a
 * chapter carries a URL, and says so when none does, rather than showing a
 * dead player or a stock clip.
 */

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { useTheme } from 'next-themes';
import 'katex/dist/katex.min.css';
import {
  ArrowLeft, BookOpen, Check, ChevronRight, Circle, Clock, FlaskConical,
  GraduationCap, Lightbulb, ListChecks, PlayCircle, Video,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LessonVideoPlayer } from '@/components/test-prep/LessonVideoPlayer';
import { LessonQuiz } from '@/components/test-prep/cissp/LessonQuiz';
import { darkVariant } from '@/components/ui/markdown';
import {
  getStudyAxis, countChapters, axisNoun,
  assertAxisCoverage, type StudyUnit,
} from '@/lib/exam-study-axis';
import { getCurriculum } from '@/lib/exam-curriculum';
import { getExamConfig } from '@/lib/exam-config';
import { getExamSurfaces } from '@/lib/exam-surfaces';
import { loadExamCourse, type CoursePack } from '@/lib/exam-course-loader';
import { loadReadChapters, toggleChapterRead } from '@/lib/chapter-reads';
import type { TopicLesson } from '@/lib/cissp-course-data';

/** Accent classes, written out so Tailwind's scanner keeps them. */
const ACCENT: Record<string, { dot: string; soft: string; text: string }> = {
  emerald: { dot: 'bg-emerald-500', soft: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400' },
  teal: { dot: 'bg-teal-500', soft: 'bg-teal-500/10', text: 'text-teal-600 dark:text-teal-400' },
  sky: { dot: 'bg-sky-500', soft: 'bg-sky-500/10', text: 'text-sky-600 dark:text-sky-400' },
  amber: { dot: 'bg-amber-500', soft: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400' },
  indigo: { dot: 'bg-indigo-500', soft: 'bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400' },
  violet: { dot: 'bg-violet-500', soft: 'bg-violet-500/10', text: 'text-violet-600 dark:text-violet-400' },
  rose: { dot: 'bg-rose-500', soft: 'bg-rose-500/10', text: 'text-rose-600 dark:text-rose-400' },
  slate: { dot: 'bg-slate-500', soft: 'bg-slate-500/10', text: 'text-slate-600 dark:text-slate-400' },
};
const accentOf = (key: string) => ACCENT[key] ?? ACCENT.slate;

/**
 * Markdown renderers for the book column.
 *
 * The lesson bodies use GFM tables and blockquotes heavily, and unstyled
 * tables are unreadable, so this keeps the reader's own typography rather
 * than borrowing the generic `prose` styling.
 *
 * Figures follow the same convention the Electronic Devices course
 * established: an ordinary markdown image whose ALT TEXT IS THE CAPTION,
 * with a matched `.dark.svg` sibling. An <img> cannot inherit page CSS, so
 * the swap happens here, using the same darkVariant rule the shared
 * renderer uses rather than a second copy of it.
 */
const mdBase = {
  h2: (p: any) => <h2 className="text-xl font-bold mt-8 mb-3 first:mt-0" {...p} />,
  h3: (p: any) => <h3 className="text-base font-semibold mt-6 mb-2" {...p} />,
  h4: (p: any) => <h4 className="text-sm font-semibold mt-4 mb-1.5" {...p} />,
  p: (p: any) => <p className="text-[15px] leading-7 my-3 text-foreground/90" {...p} />,
  ul: (p: any) => <ul className="my-3 space-y-1.5 list-disc pl-5 text-[15px] leading-7" {...p} />,
  ol: (p: any) => <ol className="my-3 space-y-1.5 list-decimal pl-5 text-[15px] leading-7" {...p} />,
  li: (p: any) => <li className="text-foreground/90" {...p} />,
  strong: (p: any) => <strong className="font-semibold text-foreground" {...p} />,
  hr: () => <hr className="my-6 border-border" />,
  blockquote: (p: any) => (
    <blockquote
      className="my-4 border-l-4 border-primary/50 bg-primary/5 rounded-r-lg px-4 py-3 text-[15px] leading-7"
      {...p}
    />
  ),
  table: (p: any) => (
    <div className="my-4 overflow-x-auto rounded-lg border">
      <table className="w-full text-sm" {...p} />
    </div>
  ),
  thead: (p: any) => <thead className="bg-muted/60" {...p} />,
  th: (p: any) => <th className="px-3 py-2 text-left font-semibold border-b" {...p} />,
  td: (p: any) => <td className="px-3 py-2 border-b border-border/50 align-top" {...p} />,
  code: (p: any) => (
    <code className="rounded bg-muted px-1.5 py-0.5 text-[13px] font-mono" {...p} />
  ),
};

/** The renderer map, with figures resolved for the active theme. */
function makeMd(isDark: boolean) {
  return {
    ...mdBase,
    img: ({ node, src, alt, ...props }: any) => {
      const resolved = typeof src === 'string' && isDark ? darkVariant(src) : src;
      return (
        // <span>, not <figure>: react-markdown puts images inside a <p>, and
        // a <figure> there is invalid HTML that React re-parents at
        // hydration - which shows up as a hydration mismatch.
        <span className="my-6 block">
          <img
            {...props}
            src={resolved}
            alt={alt ?? ''}
            loading="lazy"
            className="mx-auto block h-auto max-w-full rounded-lg border bg-background"
          />
          {alt ? (
            <span className="mt-2 block text-center text-xs text-muted-foreground">
              {alt}
            </span>
          ) : null}
        </span>
      );
    },
  };
}

interface Chapter {
  id: string;
  title: string;
  summary: string;
  readTimeMin?: number;
}

interface UnitVideo {
  id: string;
  title: string;
  description: string;
  video_url: string;
  duration_seconds: number;
  section: string;
}

/**
 * Videos that belong to a unit.
 *
 * CISSP is the only exam with recorded video today - 21 rendered
 * animations - and they are indexed by domain rather than by chapter, so
 * they attach to the unit rather than to a single chapter. That is the
 * honest granularity: claiming a chapter-level video when the file covers
 * a whole domain would misdescribe what plays.
 */
async function loadUnitVideos(exam: string, unitName: string): Promise<UnitVideo[]> {
  if (exam !== 'CISSP') return [];
  try {
    const m = await import('@/lib/cissp-video-lessons');
    return m.CISSP_VIDEO_LESSONS.filter((v) => v.section === unitName);
  } catch {
    return [];
  }
}

function mmss(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function ExamStudyPage() {
  const params = useParams();
  const slug = String(params.exam ?? '').toLowerCase();
  const exam = slug.toUpperCase();

  const config = getExamConfig(exam);
  const surfaces = getExamSurfaces(exam);
  const axis = React.useMemo(() => getStudyAxis(exam), [exam]);

  const [pack, setPack] = React.useState<CoursePack | null>(null);
  const [unitId, setUnitId] = React.useState<string | null>(null);
  const [topicId, setTopicId] = React.useState<string | null>(null);
  const [read, setRead] = React.useState<Set<string>>(new Set());
  const [videos, setVideos] = React.useState<UnitVideo[]>([]);
  const [videoIdx, setVideoIdx] = React.useState(0);

  // next-themes resolves on the client only. Render the light figure on the
  // server pass and swap after mount, so SSR and first client render agree.
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const md = React.useMemo(
    () => makeMd(mounted && resolvedTheme === 'dark'),
    [mounted, resolvedTheme],
  );

  // Chapter metadata comes from the curriculum, so titles and read times
  // never drift from the syllabus the rest of the app shows.
  const chapters = React.useMemo(() => {
    const flat = new Map<string, Chapter>();
    for (const section of getCurriculum(exam)) {
      for (const t of section.topics) {
        flat.set(t.id, {
          id: t.id, title: t.title, summary: t.summary, readTimeMin: t.readTimeMin,
        });
      }
    }
    return flat;
  }, [exam]);

  // Switching exams resets what is open: a chapter id from another exam
  // would render an empty book.
  React.useEffect(() => {
    setPack(null);
    setUnitId(null);
    setTopicId(null);
    void loadExamCourse(exam).then(setPack);
    // Server-backed (2026-08): loadReadChapters returns the server set,
    // merging any local-only ids up first, and falls back to localStorage
    // when api-core is unreachable. Course progress follows the account,
    // not the browser.
    let live = true;
    void loadReadChapters(exam).then(({ ids }) => { if (live) setRead(ids); });
    if (process.env.NODE_ENV !== 'production') {
      const gaps = assertAxisCoverage(exam);
      if (gaps.missing.length || gaps.duplicated.length || gaps.unknown.length) {
        // A content bug, not a crash: say it loudly in dev, carry on.
        console.warn(`[study-axis:${exam}] coverage problem`, gaps);
      }
    }
    return () => { live = false; };
  }, [exam]);

  const unit: StudyUnit | undefined =
    axis.find((u) => u.id === unitId) ?? axis[0];
  const lesson: TopicLesson | null = topicId && pack ? pack.get(topicId) : null;
  const chapter = topicId ? chapters.get(topicId) : undefined;

  const unitName = unit?.name ?? '';
  React.useEffect(() => {
    setVideoIdx(0);
    if (!unitName) return;
    let live = true;
    void loadUnitVideos(exam, unitName).then((v) => { if (live) setVideos(v); });
    return () => { live = false; };
  }, [exam, unitName]);

  const markRead = (id: string) => {
    setRead((prev) => {
      const nowRead = !prev.has(id);
      // Optimistic localStorage write + server write-through; the helper
      // owns both. Server truth heals any missed write on the next load.
      return toggleChapterRead(exam, id, nowRead);
    });
  };

  const unitProgress = (u: StudyUnit) => ({
    done: u.topicIds.filter((t) => read.has(t)).length,
    total: u.topicIds.length,
  });
  const overall = React.useMemo(() => {
    const total = countChapters(axis);
    const done = axis.reduce(
      (n, u) => n + u.topicIds.filter((t) => read.has(t)).length, 0,
    );
    return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
  }, [axis, read]);

  // No curriculum for this exam: say that, rather than rendering an empty
  // rail that looks broken.
  if (!unit || axis.length === 0) {
    return (
      <div className="p-4 sm:p-6" data-testid="exam-study">
        <Card className="p-8 text-center max-w-lg mx-auto">
          <BookOpen className="h-8 w-8 mx-auto text-muted-foreground/40 mb-3" />
          <h1 className="text-lg font-bold">No course for {config.shortName} yet</h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            This exam has no syllabus in the curriculum, so there is nothing
            to read here. Its question bank and flashcards, where they exist,
            are on the exam home page.
          </p>
          <Link href={`/dashboard/test-prep/${slug}`} className="inline-block mt-4">
            <Button variant="outline" size="sm" className="gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" /> {config.shortName} home
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Aids shown in the companion column - real fields off the lesson.
  const examTips = (lesson?.sections ?? [])
    .map((s) => s.examTip)
    .filter((t): t is string => Boolean(t));
  const quizCount = (lesson?.sections ?? []).reduce(
    (n, s) => n + (s.quiz?.length ?? 0), 0,
  );
  const chemistryUnit =
    exam === 'MCAT' &&
    (unit.id === 'general_chemistry' || unit.id === 'organic_chemistry');

  return (
    <div className="p-4 sm:p-6 space-y-4" data-testid="exam-study">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold">{config.shortName} course</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {axisNoun(exam, axis)}, {overall.total} chapters.{' '}
            {exam === 'MCAT'
              ? 'Organised the way you study, not the way the exam is administered.'
              : 'Every chapter in the rail has its written material behind it.'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Chapters read</p>
            <p className="font-semibold">
              {overall.done}/{overall.total}
            </p>
          </div>
          <div className="w-28">
            <Progress value={overall.pct} className="h-2" />
          </div>
          <Link href={`/dashboard/test-prep/${slug}`}>
            <Button variant="outline" size="sm" className="gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" /> {config.shortName} home
            </Button>
          </Link>
        </div>
      </div>

      {/* Unit pills - the only nav on narrow screens, a quick switch on wide */}
      <div className="flex gap-2 overflow-x-auto pb-1" data-testid="study-unit-pills">
        {axis.map((u) => {
          const { done, total } = unitProgress(u);
          const on = u.id === unit.id;
          return (
            <button
              key={u.id}
              type="button"
              onClick={() => { setUnitId(u.id); setTopicId(null); }}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-sm transition flex items-center gap-2 ${
                on ? 'border-primary bg-primary/10 font-medium' : 'hover:border-primary/50'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${accentOf(u.accent).dot}`} />
              {u.name}
              <span className="text-[11px] text-muted-foreground">
                {done}/{total}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[250px_1fr]">
        {/* ── Rail: this unit's chapters ────────────────────────── */}
        <aside className="hidden lg:block">
          <div className="sticky top-4 space-y-3">
            <Card className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className={`h-2.5 w-2.5 rounded-full ${accentOf(unit.accent).dot}`} />
                <h2 className="font-semibold text-sm">{unit.name}</h2>
                {unit.kind === 'skill' && (
                  <Badge variant="outline" className="text-[10px]">skill</Badge>
                )}
              </div>
              {unit.blurb && (
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {unit.blurb}
                </p>
              )}
              {unit.examShare && (
                <p className="text-[11px] text-muted-foreground mt-1.5">
                  {unit.examShare}
                </p>
              )}
            </Card>

            <Card className="p-2 max-h-[62vh] overflow-y-auto">
              <ul className="space-y-0.5">
                {unit.topicIds.map((id, i) => {
                  const c = chapters.get(id);
                  const on = id === topicId;
                  const done = read.has(id);
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        onClick={() => setTopicId(id)}
                        data-testid={`study-chapter-${id}`}
                        className={`w-full text-left rounded-lg px-2.5 py-2 text-sm transition flex gap-2 items-start ${
                          on ? 'bg-primary/10 border border-primary/40' : 'hover:bg-muted'
                        }`}
                      >
                        {done ? (
                          <Check className="h-3.5 w-3.5 mt-0.5 shrink-0 text-green-600" />
                        ) : (
                          <Circle className="h-3.5 w-3.5 mt-0.5 shrink-0 text-muted-foreground/50" />
                        )}
                        <span className="min-w-0">
                          <span className="block truncate font-medium">
                            {i + 1}. {c?.title ?? id}
                          </span>
                          {c?.readTimeMin && (
                            <span className="text-[11px] text-muted-foreground">
                              {c.readTimeMin} min read
                            </span>
                          )}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </div>
        </aside>

        {/* ── Main: chapter list, or book + companion ───────────── */}
        {!topicId ? (
          <Card className="p-5" data-testid="study-unit-overview">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-bold">{unit.name}</h2>
                {unit.blurb && (
                  <p className="text-sm text-muted-foreground mt-0.5">{unit.blurb}</p>
                )}
                {!unit.blurb && unit.examShare && (
                  <p className="text-sm text-muted-foreground mt-0.5">{unit.examShare}</p>
                )}
              </div>
              <Badge variant="secondary" className="shrink-0">
                {unit.topicIds.length} chapters
              </Badge>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {unit.topicIds.map((id, i) => {
                const c = chapters.get(id);
                const has = pack?.has(id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTopicId(id)}
                    className="text-left rounded-xl border p-3 hover:border-primary hover:bg-primary/5 transition"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold ${accentOf(unit.accent).text}`}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="font-medium text-sm">{c?.title ?? id}</span>
                      {read.has(id) && <Check className="h-3.5 w-3.5 text-green-600" />}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {c?.summary}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
                      {c?.readTimeMin && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {c.readTimeMin} min
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {has ? 'Full chapter' : 'Summary only'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_320px] min-w-0">
            {/* Book */}
            <Card className="p-5 sm:p-7 min-w-0" data-testid="study-book">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge className={`${accentOf(unit.accent).soft} ${accentOf(unit.accent).text} border-0`}>
                  {unit.name}
                </Badge>
                {/* The exam weight is stated once, by the rail, from the
                    config. It used to be repeated here from each lesson's
                    own domainWeight string, which drifted: FE EE's rail said
                    "8 questions on the exam" while the badge beside it said
                    "7-11%", and inside one section different chapters
                    claimed "4-6%" and "5%". Two sources for one number is
                    how that happens, so there is now one. */}
                {unit.examShare && (
                  <Badge variant="outline" className="text-[11px]">
                    {unit.examShare}
                  </Badge>
                )}
                {chapter?.readTimeMin && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {chapter.readTimeMin} min
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold tracking-tight">
                {lesson?.title ?? chapter?.title}
              </h2>
              {lesson?.overview && (
                <p className="text-[15px] leading-7 text-muted-foreground mt-2">
                  {lesson.overview}
                </p>
              )}

              {!lesson ? (
                <div className="mt-6 rounded-xl border border-dashed p-6 text-center">
                  <BookOpen className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
                  <p className="text-sm font-medium">This chapter has no written content yet</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                    {chapter?.summary}
                  </p>
                </div>
              ) : (
                <div className="mt-6 space-y-8">
                  {lesson.sections.map((s, i) => (
                    <section key={s.id} id={s.id} className="scroll-mt-4">
                      <div className="flex items-baseline gap-2 pb-2 mb-1 border-b">
                        <span className="text-xs font-bold text-muted-foreground">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <h3 className="text-lg font-bold">{s.title}</h3>
                      </div>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                        components={md}
                      >
                        {s.content}
                      </ReactMarkdown>
                      {s.importantNote && (
                        <div className="my-4 rounded-lg border-l-4 border-amber-500 bg-amber-500/10 px-4 py-3 text-sm">
                          <span className="font-semibold">Note. </span>
                          {s.importantNote}
                        </div>
                      )}
                      {/* The companion column counts these; they have to be
                          here for that count to be true. */}
                      {s.quiz && s.quiz.length > 0 && (
                        <div className="mt-5">
                          <LessonQuiz
                            variant="book"
                            questions={s.quiz}
                            title={`Check your understanding — ${s.title}`}
                          />
                        </div>
                      )}
                    </section>
                  ))}
                </div>
              )}

              <div className="mt-8 pt-4 border-t flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  variant={read.has(topicId) ? 'secondary' : 'default'}
                  onClick={() => markRead(topicId)}
                  className="gap-1.5"
                  data-testid="study-mark-read"
                >
                  <Check className="h-3.5 w-3.5" />
                  {read.has(topicId) ? 'Marked as read' : 'Mark chapter read'}
                </Button>
                {(() => {
                  const idx = unit.topicIds.indexOf(topicId);
                  const next = unit.topicIds[idx + 1];
                  return next ? (
                    <Button size="sm" variant="outline" className="gap-1.5"
                      onClick={() => { setTopicId(next); window.scrollTo({ top: 0 }); }}>
                      Next: {chapters.get(next)?.title} <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  ) : null;
                })()}
                <Button size="sm" variant="ghost" onClick={() => setTopicId(null)}>
                  All {unit.name} chapters
                </Button>
              </div>
            </Card>

            {/* Companion: media slot + what's actually in this chapter */}
            <div className="min-w-0">
              <div className="2xl:sticky 2xl:top-4 grid gap-3 sm:grid-cols-2 2xl:grid-cols-1">
                <Card className="overflow-hidden" data-testid="study-media">
                  {/* Three cases, in order of how specific the video is:
                      a video attached to this chapter, videos recorded for
                      this unit, or nothing - and nothing says so. */}
                  {(lesson as unknown as { video_url?: string })?.video_url ? (
                    <LessonVideoPlayer
                      videoUrl={(lesson as unknown as { video_url?: string }).video_url}
                      title={lesson?.title ?? ''}
                    />
                  ) : videos.length > 0 ? (
                    <div>
                      <LessonVideoPlayer
                        videoUrl={videos[videoIdx].video_url}
                        title={videos[videoIdx].title}
                      />
                      <div className="p-3 border-t">
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          {videos[videoIdx].description}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-2">
                          Recorded for {unit.name}, not for this chapter
                          specifically &mdash;{' '}
                          {videos.length === 1
                            ? 'the one video in this unit.'
                            : `video ${videoIdx + 1} of ${videos.length} in this unit.`}
                        </p>
                        {videos.length > 1 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {videos.map((v, i) => (
                              <button
                                key={v.id}
                                type="button"
                                onClick={() => setVideoIdx(i)}
                                title={v.title}
                                className={`rounded border px-1.5 py-0.5 text-[10px] font-mono transition ${
                                  i === videoIdx
                                    ? 'border-primary bg-primary/10'
                                    : 'hover:border-primary/50 text-muted-foreground'
                                }`}
                              >
                                {i + 1} &middot; {mmss(v.duration_seconds)}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Video className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-semibold">Video lesson</p>
                      </div>
                      <div className="rounded-lg bg-muted/50 border border-dashed p-4 text-center">
                        <PlayCircle className="h-7 w-7 mx-auto text-muted-foreground/40 mb-1.5" />
                        <p className="text-xs font-medium">Not recorded yet</p>
                        <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                          No {config.shortName} video covers this material yet.
                          The player is wired and will appear here the moment
                          one is recorded &mdash; we would rather show this
                          than a stock clip.
                        </p>
                      </div>
                    </div>
                  )}
                </Card>

                {lesson?.keyTakeaways && lesson.keyTakeaways.length > 0 && (
                  <Card className="p-4" data-testid="study-takeaways">
                    <div className="flex items-center gap-2 mb-2">
                      <ListChecks className="h-4 w-4 text-primary" />
                      <p className="text-sm font-semibold">Key takeaways</p>
                    </div>
                    <ul className="space-y-1.5">
                      {lesson.keyTakeaways.map((k, i) => (
                        <li key={i} className="text-xs leading-relaxed flex gap-2">
                          <span className="text-primary mt-0.5">&bull;</span>
                          <span className="text-foreground/85">{k}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}

                {examTips.length > 0 && (
                  <Card className="p-4" data-testid="study-exam-tips">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-4 w-4 text-amber-500" />
                      <p className="text-sm font-semibold">
                        Exam tips ({examTips.length})
                      </p>
                    </div>
                    <ul className="space-y-2">
                      {examTips.map((t, i) => (
                        <li key={i} className="text-xs leading-relaxed text-foreground/85">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}

                <Card className="p-4">
                  <p className="text-sm font-semibold mb-2">Practise this chapter</p>
                  <div className="space-y-1.5">
                    {quizCount > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {quizCount} check-your-understanding{' '}
                        {quizCount === 1 ? 'question sits' : 'questions sit'} at
                        the end of the section{quizCount === 1 ? '' : 's'} that
                        cover them.
                      </p>
                    )}
                    {surfaces.qbankSize > 0 && (
                      <Link
                        href={
                          exam === 'MCAT'
                            ? `/dashboard/test-prep/${slug}/qbank`
                            : `/dashboard/test-prep/${slug}?tab=qbank`
                        }
                        className="block"
                      >
                        <Button size="sm" variant="outline" className="w-full gap-1.5">
                          <BookOpen className="h-3.5 w-3.5" /> Question bank
                        </Button>
                      </Link>
                    )}
                    {chemistryUnit && (
                      <Link href={`/dashboard/test-prep/${slug}/chemistry`} className="block">
                        <Button size="sm" variant="secondary" className="w-full gap-1.5">
                          <FlaskConical className="h-3.5 w-3.5" /> Generated chemistry
                        </Button>
                      </Link>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
