'use client';

/**
 * MCAT study environment - subject syllabus, book, and media side by side.
 *
 * The old "Read Lessons" tab was a list of four AAMC sections you clicked
 * into one at a time, which is how the exam is ADMINISTERED but not how
 * anyone studies. This page is organised the way a prep course is: seven
 * subjects, each with its chapters, and a persistent syllabus rail so you
 * always know where you are in the whole course.
 *
 * Three zones on a wide screen:
 *   rail      the seven subjects and their chapters, always visible
 *   book      the chapter's long-form content - the widest zone, because
 *             it is the actual material
 *   companion sticky beside the book: the media slot, then this chapter's
 *             key takeaways and exam tips, so they stay in view while you
 *             read rather than sitting at the bottom
 *
 * On the media slot, stated plainly because it matters: MCAT has no video
 * lessons yet - not one file exists. The slot is built (it renders the
 * real player the moment a chapter carries a URL, the same player the
 * CISSP lessons use) but today it says so instead of showing a dead player
 * or a stock clip. The reading is the content; the panel points at what is
 * actually there.
 */

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
import { MCAT_SUBJECTS, assertSubjectCoverage, type McatSubject } from '@/lib/mcat-subjects';
import { getCurriculum } from '@/lib/exam-curriculum';
import { loadExamCourse, type CoursePack } from '@/lib/exam-course-loader';
import type { TopicLesson } from '@/lib/mcat-course-data';

const EXAM = 'MCAT';
const STORAGE_KEY = 'mcat_study_read_chapters';

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

/** Markdown renderers - the lesson bodies use GFM tables and blockquotes
 *  heavily, and unstyled tables are unreadable. */
const md = {
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

interface Chapter {
  id: string;
  title: string;
  summary: string;
  readTimeMin?: number;
}

export default function McatStudyPage() {
  const params = useParams();
  const router = useRouter();
  const exam = ((params.exam as string) || '').toUpperCase();

  React.useEffect(() => {
    if (exam && exam !== EXAM) {
      router.replace(`/dashboard/test-prep/${params.exam}`);
    }
  }, [exam, params.exam, router]);

  const [pack, setPack] = React.useState<CoursePack | null>(null);
  const [subjectId, setSubjectId] = React.useState<string>(MCAT_SUBJECTS[0].id);
  const [topicId, setTopicId] = React.useState<string | null>(null);
  const [read, setRead] = React.useState<Set<string>>(new Set());

  // Chapter metadata comes from the curriculum, so titles and read times
  // never drift from the syllabus the rest of the app shows.
  const chapters = React.useMemo(() => {
    const flat = new Map<string, Chapter>();
    for (const section of getCurriculum(EXAM)) {
      for (const t of section.topics) {
        flat.set(t.id, {
          id: t.id, title: t.title, summary: t.summary, readTimeMin: t.readTimeMin,
        });
      }
    }
    return flat;
  }, []);

  React.useEffect(() => {
    void loadExamCourse(EXAM).then(setPack);
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setRead(new Set(JSON.parse(saved)));
    } catch {
      /* first visit, or storage unavailable */
    }
    if (process.env.NODE_ENV !== 'production') {
      const gaps = assertSubjectCoverage();
      if (gaps.missing.length || gaps.duplicated.length || gaps.unknown.length) {
        // A content bug, not a crash: say it loudly in dev, carry on.
        console.warn('[mcat-subjects] coverage problem', gaps);
      }
    }
  }, []);

  const subject = MCAT_SUBJECTS.find((s) => s.id === subjectId) ?? MCAT_SUBJECTS[0];
  const lesson: TopicLesson | null = topicId && pack ? pack.get(topicId) : null;
  const chapter = topicId ? chapters.get(topicId) : undefined;

  const markRead = (id: string) => {
    setRead((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        /* non-fatal */
      }
      return next;
    });
  };

  const subjectProgress = (s: McatSubject) => {
    const done = s.topicIds.filter((t) => read.has(t)).length;
    return { done, total: s.topicIds.length };
  };
  const overall = React.useMemo(() => {
    const total = MCAT_SUBJECTS.reduce((n, s) => n + s.topicIds.length, 0);
    const done = MCAT_SUBJECTS.reduce(
      (n, s) => n + s.topicIds.filter((t) => read.has(t)).length, 0,
    );
    return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
  }, [read]);

  if (exam !== EXAM) return null;

  // Aids shown in the companion column - real fields off the lesson.
  const examTips = (lesson?.sections ?? [])
    .map((s) => s.examTip)
    .filter((t): t is string => Boolean(t));
  const quizCount = (lesson?.sections ?? []).reduce(
    (n, s) => n + (s.quiz?.length ?? 0), 0,
  );

  return (
    <div className="p-4 sm:p-6 space-y-4" data-testid="mcat-study">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold">MCAT course</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Seven subjects, {overall.total} chapters. Organised the way you
            study, not the way the exam is administered.
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
          <Link href={`/dashboard/test-prep/${String(params.exam).toLowerCase()}`}>
            <Button variant="outline" size="sm" className="gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Subject pills - the only nav on narrow screens, a quick switch on wide */}
      <div className="flex gap-2 overflow-x-auto pb-1" data-testid="mcat-subject-pills">
        {MCAT_SUBJECTS.map((s) => {
          const { done, total } = subjectProgress(s);
          const on = s.id === subject.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => { setSubjectId(s.id); setTopicId(null); }}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-sm transition flex items-center gap-2 ${
                on ? 'border-primary bg-primary/10 font-medium' : 'hover:border-primary/50'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${ACCENT[s.accent].dot}`} />
              {s.name}
              <span className="text-[11px] text-muted-foreground">
                {done}/{total}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[250px_1fr]">
        {/* ── Rail: this subject's chapters ─────────────────────── */}
        <aside className="hidden lg:block">
          <div className="sticky top-4 space-y-3">
            <Card className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className={`h-2.5 w-2.5 rounded-full ${ACCENT[subject.accent].dot}`} />
                <h2 className="font-semibold text-sm">{subject.name}</h2>
                {subject.kind === 'skill' && (
                  <Badge variant="outline" className="text-[10px]">skill</Badge>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {subject.blurb}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1.5">
                {subject.examShare}
              </p>
            </Card>

            <Card className="p-2 max-h-[62vh] overflow-y-auto">
              <ul className="space-y-0.5">
                {subject.topicIds.map((id, i) => {
                  const c = chapters.get(id);
                  const on = id === topicId;
                  const done = read.has(id);
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        onClick={() => setTopicId(id)}
                        data-testid={`mcat-chapter-${id}`}
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
          <Card className="p-5" data-testid="mcat-subject-overview">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-bold">{subject.name}</h2>
                <p className="text-sm text-muted-foreground mt-0.5">{subject.blurb}</p>
              </div>
              <Badge variant="secondary" className="shrink-0">
                {subject.topicIds.length} chapters
              </Badge>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {subject.topicIds.map((id, i) => {
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
                      <span className={`text-xs font-bold ${ACCENT[subject.accent].text}`}>
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
            <Card className="p-5 sm:p-7 min-w-0" data-testid="mcat-book">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge className={`${ACCENT[subject.accent].soft} ${ACCENT[subject.accent].text} border-0`}>
                  {subject.name}
                </Badge>
                {lesson?.domainWeight && (
                  <Badge variant="outline" className="text-[11px]">
                    {lesson.domainWeight} of section
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
                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={md}>
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
                            title={`Check your understanding \u2014 ${s.title}`}
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
                  data-testid="mcat-mark-read"
                >
                  <Check className="h-3.5 w-3.5" />
                  {read.has(topicId) ? 'Marked as read' : 'Mark chapter read'}
                </Button>
                {(() => {
                  const idx = subject.topicIds.indexOf(topicId);
                  const next = subject.topicIds[idx + 1];
                  return next ? (
                    <Button size="sm" variant="outline" className="gap-1.5"
                      onClick={() => { setTopicId(next); window.scrollTo({ top: 0 }); }}>
                      Next: {chapters.get(next)?.title} <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  ) : null;
                })()}
                <Button size="sm" variant="ghost" onClick={() => setTopicId(null)}>
                  All {subject.name} chapters
                </Button>
              </div>
            </Card>

            {/* Companion: media slot + what's actually in this chapter */}
            <div className="min-w-0">
              <div className="2xl:sticky 2xl:top-4 grid gap-3 sm:grid-cols-2 2xl:grid-cols-1">
                <Card className="overflow-hidden" data-testid="mcat-media">
                  {/* The player is wired and real; it renders the moment a
                      chapter carries a video_url. None do yet. */}
                  {(lesson as unknown as { video_url?: string })?.video_url ? (
                    <LessonVideoPlayer
                      videoUrl={(lesson as unknown as { video_url?: string }).video_url}
                      title={lesson?.title ?? ''}
                    />
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
                          No MCAT chapter has a video yet. The player is wired
                          and will appear here the moment one does &mdash; we
                          would rather show this than a stock clip.
                        </p>
                      </div>
                    </div>
                  )}
                </Card>

                {lesson?.keyTakeaways && lesson.keyTakeaways.length > 0 && (
                  <Card className="p-4" data-testid="mcat-takeaways">
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
                  <Card className="p-4" data-testid="mcat-exam-tips">
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
                    <Link
                      href={`/dashboard/test-prep/${String(params.exam).toLowerCase()}`}
                      className="block"
                    >
                      <Button size="sm" variant="outline" className="w-full gap-1.5">
                        <BookOpen className="h-3.5 w-3.5" /> QBank
                      </Button>
                    </Link>
                    {(subject.id === 'general_chemistry' ||
                      subject.id === 'organic_chemistry') && (
                      <Link
                        href={`/dashboard/test-prep/${String(params.exam).toLowerCase()}/chemistry`}
                        className="block"
                      >
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
