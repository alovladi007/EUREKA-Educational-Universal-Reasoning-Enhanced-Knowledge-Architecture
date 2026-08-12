'use client';

import {
  BookOpen,
  ChevronLeft,
  Clock,
  GraduationCap,
  Lightbulb,
  ListChecks,
  Video,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
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
import ChemVideoPlayer from '@/components/ChemVideoPlayer';
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

// The chapter reader.
//
// Two things are on this page and they are not the same thing.
//
// The SIX PART ARC is the pedagogy and it is fixed, in this order, for every
// node in the program: objective, build_on, core_idea, worked_example, try_it,
// pitfall. It is short on purpose. It teaches one idea and pushes the learner
// at a retrieval question.
//
// The CHAPTER is the reading around it - numbered sections of prose, figures,
// data tables, an animated explainer, takeaways, exam tips. It is optional,
// authored per node, and where it exists it comes first, because a reader
// wants the explanation before the drill.
//
// A node with no chapter renders the arc alone and says so. That is the honest
// degraded state, and it is what most of the 325 nodes currently show.
//
// There is deliberately no quiz on this page. Graded questions come from the
// item templates through Practice, which grades on the server. Rendering a
// question here would mean shipping its answer key to the browser.

export default function LessonPage() {
  const params = useParams<{ node: string }>();
  const raw = params?.node;
  const nodeCode = decodeURIComponent(
    Array.isArray(raw) ? raw[0] : raw || '',
  );

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [nodes, setNodes] = useState<CurriculumNode[]>([]);
  const [triangle, setTriangle] = useState<TriangleViewData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!nodeCode) {
      setError('No node was named in the address.');
      setLoading(false);
      return;
    }
    let cancelled = false;
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

  // The graph, for the title and for the chapter rail. A failure here is not
  // worth an error screen: the page falls back to the node code, which is
  // still accurate, and the rail simply does not render.
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

  // Siblings: every node in the same unit, in curriculum order. This is the
  // chapter, and it is what the rail lists.
  const siblings = useMemo(
    () => (here ? nodes.filter((n) => n.unit === here.unit) : []),
    [nodes, here],
  );

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

  return (
    <Page>
      <Link
        href="/learn"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:underline"
      >
        <ChevronLeft className="h-4 w-4" />
        All chapters
      </Link>

      <header className="mb-6 mt-3">
        {here && (
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {here.course} · {here.unit_title ?? here.unit}
          </p>
        )}
        <h1 className="text-[26px] font-bold leading-tight tracking-tight">
          {title || nodeCode}
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="font-mono">{nodeCode}</span>
          {extras && (
            <>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {extras.reading_minutes} min read
              </span>
              <span className="inline-flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5" />
                {extras.sections.length} section
                {extras.sections.length === 1 ? '' : 's'}
              </span>
            </>
          )}
        </div>
      </header>

      {loading && <LoadingPanel label="Loading the chapter." />}
      {!loading && error && <ErrorPanel message={error} />}

      {!loading && !error && lesson && (
        <div className="grid gap-8 xl:grid-cols-[13rem_minmax(0,1fr)_19rem]">
          <ChapterRail
            siblings={siblings}
            current={nodeCode}
            sections={extras?.sections ?? []}
          />

          <article className="min-w-0">
            {extras ? (
              <>
                {/* The lead goes through the prose renderer, not into a bare
                    <p>. It is authored in the same dialect as the sections and
                    routinely contains inline maths; rendering it as plain text
                    printed a literal "$s$" on screen. */}
                {extras.lead && (
                  <div className="mb-8 border-l-2 border-brand-500 pl-4 [&_p]:text-[17px]">
                    <LessonProse body={extras.lead} />
                  </div>
                )}
                {extras.sections.map((section, i) => (
                  <Section key={section.id} index={i + 1} section={section} />
                ))}
              </>
            ) : (
              <NoChapterYet />
            )}

            <div className="mt-10 border-t border-border pt-8">
              <h2 className="mb-1 text-lg font-semibold">
                The six part arc
              </h2>
              <p className="mb-5 text-sm text-muted-foreground">
                Every node in the program carries these six, in this order.
                Reading fluency is not learning; part five is where it starts.
              </p>

              <div className="space-y-5">
                <ArcPart index={1} label="Objective" body={lesson.objective} />
                <ArcPart index={2} label="Build on" body={lesson.build_on} />
                <ArcPart index={3} label="Core idea" body={lesson.core_idea} />

                {triangle && <Triangle view={triangle} />}

                <ArcPart
                  index={4}
                  label="Worked example"
                  body={lesson.worked_example}
                />
                <TryIt
                  prompt={lesson.try_it.prompt}
                  answer={lesson.try_it.answer}
                />
                <ArcPart index={6} label="Pitfall" body={lesson.pitfall} />
              </div>
            </div>

            <PracticeCta node={nodeCode} />
          </article>

          <aside className="space-y-5 xl:sticky xl:top-6 xl:self-start">
            {extras?.video && (
              <section>
                <div className="mb-2 flex items-center gap-2">
                  <Video className="h-4 w-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold">Video lesson</h2>
                </div>
                <ChemVideoPlayer
                  scene={extras.video.scene}
                  title={extras.video.title}
                  seconds={extras.video.seconds}
                  summary={extras.video.summary}
                />
                <p className="mt-2 text-[13px] font-medium text-card-foreground">
                  {extras.video.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Drawn from the geometry, in your browser, every frame — not a
                  recording. Scrub it to stop on the frame that carries the
                  idea.
                </p>
              </section>
            )}

            {extras && extras.key_takeaways.length > 0 && (
              <Card>
                <div className="mb-3 flex items-center gap-2">
                  <ListChecks className="h-4 w-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold">Key takeaways</h2>
                </div>
                <ul className="space-y-2.5">
                  {extras.key_takeaways.map((k, i) => (
                    <li key={i} className="flex gap-2 text-[13.5px] leading-relaxed">
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                      <span className="text-card-foreground">{k}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {extras && extras.exam_tips.length > 0 && (
              <Card className="border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/10">
                <div className="mb-3 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <h2 className="text-sm font-semibold">
                    Exam tips ({extras.exam_tips.length})
                  </h2>
                </div>
                <ul className="space-y-2.5">
                  {extras.exam_tips.map((t, i) => (
                    <li key={i} className="flex gap-2 text-[13.5px] leading-relaxed">
                      <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                      <span className="text-card-foreground">{t}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {lesson.misconception && (
              <Card>
                <div className="flex flex-wrap items-center gap-2">
                  <Pill tone="amber">named misconception</Pill>
                  <span className="font-mono text-xs text-muted-foreground">
                    {lesson.misconception}
                  </span>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  This lesson targets a belief the misconception library names,
                  which is where a wrong answer on this topic routes.
                </p>
              </Card>
            )}

            {labLink && <LabCard link={labLink} />}
          </aside>
        </div>
      )}
    </Page>
  );
}

// ---------------------------------------------------------------------------
// the rail
// ---------------------------------------------------------------------------

/**
 * The chapter contents.
 *
 * Two lists: the sections of this reading, and the other nodes in the same
 * chapter. Sub-parts are shown where the curriculum carries them, which is
 * the point of having asked for chapters with lettered parts in the first
 * place.
 */
function ChapterRail({
  siblings,
  current,
  sections,
}: {
  siblings: CurriculumNode[];
  current: string;
  sections: LessonSection[];
}) {
  if (sections.length === 0 && siblings.length === 0) return null;

  // Group the siblings by their sub-part letter. Nodes with no part fall into
  // a single unlabelled group, which is most chapters.
  const groups: { part: string | null; nodes: CurriculumNode[] }[] = [];
  for (const n of siblings) {
    const part = (n as CurriculumNode & { part?: string | null }).part ?? null;
    const last = groups[groups.length - 1];
    if (last && last.part === part) last.nodes.push(n);
    else groups.push({ part, nodes: [n] });
  }

  return (
    <nav className="hidden xl:block xl:sticky xl:top-6 xl:self-start" aria-label="Chapter contents">
      {sections.length > 0 && (
        <>
          <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            In this reading
          </h2>
          <ol className="mb-6 space-y-1.5 border-l border-border">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="-ml-px block border-l-2 border-transparent pl-3 text-[13px] leading-snug text-muted-foreground transition-colors hover:border-brand-500 hover:text-foreground"
                >
                  <span className="tabular-nums">{i + 1}.</span> {s.heading}
                </a>
              </li>
            ))}
          </ol>
        </>
      )}

      {siblings.length > 0 && (
        <>
          <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            This chapter
          </h2>
          <div className="space-y-3 border-l border-border">
            {groups.map((g, gi) => (
              <div key={gi}>
                {g.part && (
                  <p className="mb-1 pl-3 text-[11px] font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
                    Part {g.part}
                  </p>
                )}
                <ul className="space-y-1">
                  {g.nodes.map((n) => (
                    <li key={n.code}>
                      <Link
                        href={`/learn/${encodeURIComponent(n.code)}`}
                        aria-current={n.code === current ? 'page' : undefined}
                        className={`-ml-px block border-l-2 pl-3 text-[13px] leading-snug transition-colors ${
                          n.code === current
                            ? 'border-brand-500 font-medium text-foreground'
                            : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
                        }`}
                      >
                        {n.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}
    </nav>
  );
}

// ---------------------------------------------------------------------------
// chapter body
// ---------------------------------------------------------------------------

function Section({
  index,
  section,
}: {
  index: number;
  section: LessonSection;
}) {
  return (
    <section id={section.id} className="mb-10 scroll-mt-6">
      <h2 className="mb-3 text-[19px] font-semibold leading-snug tracking-tight">
        <span className="mr-2 text-muted-foreground tabular-nums">{index}.</span>
        {section.heading}
      </h2>

      <LessonProse body={section.body} />

      {section.figure && <FigureBlock figure={section.figure} />}
      {section.table && <TableBlock table={section.table} />}

      {section.important && (
        <div className="mt-5 rounded-lg border-l-[3px] border-amber-500 bg-amber-50/60 px-4 py-3 dark:bg-amber-950/15">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
            Watch this
          </p>
          <p className="text-[14.5px] leading-relaxed text-card-foreground">
            {section.important}
          </p>
        </div>
      )}
    </section>
  );
}

/**
 * A figure, in the theme the reader is actually in.
 *
 * The two SVGs are generated from one drawing function, so they cannot differ
 * in content - only in ink. Which one to show is decided from the media query
 * rather than a Tailwind dark: variant, because this app's dark mode lives in
 * globals.css as a prefers-color-scheme block over the CSS variables, and
 * darkMode is configured as 'class' with nothing setting the class. A dark:
 * variant here would never fire.
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
    <figure className="my-6">
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
    <figure className="my-6">
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full border-collapse text-[13.5px]">
          <caption className="border-b border-border bg-muted/40 px-4 py-2 text-left text-[13px] font-medium text-card-foreground">
            {table.caption}
          </caption>
          <thead>
            <tr className="border-b border-border bg-muted/20">
              {table.columns.map((c) => (
                <th
                  key={c}
                  scope="col"
                  className="px-4 py-2 text-left text-[12px] font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, i) => (
              <tr
                key={i}
                className="border-b border-border/60 last:border-0 hover:bg-muted/20"
              >
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={`px-4 py-2 text-card-foreground ${
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
      {(table.source || table.note) && (
        <figcaption className="mt-2 space-y-0.5 text-xs leading-relaxed text-muted-foreground">
          {table.note && <p>{table.note}</p>}
          {table.source && <p>Source: {table.source}</p>}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * What a node without a chapter shows.
 *
 * It says what is and is not there. The alternative - rendering empty section
 * headings, or quietly showing only the arc as though that were the whole
 * design - would misreport the state of the course.
 */
function NoChapterYet() {
  return (
    <Card className="mb-2">
      <h2 className="text-sm font-semibold">No chapter written for this node yet</h2>
      <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">
        This node has its six part arc, below, which is the teaching. It does
        not yet have the reading around it: the numbered sections, figures and
        data tables that the authored chapters carry. That is an authoring gap
        and it is being worked through chapter by chapter.
      </p>
    </Card>
  );
}

function PracticeCta({ node }: { node: string }) {
  return (
    <div className="mt-10 rounded-xl border border-border bg-muted/30 p-5">
      <h2 className="text-sm font-semibold">Now practise it</h2>
      <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">
        Questions on this node are generated and graded on the server, so the
        answer key never reaches this page. That is also why there is no quiz
        here to peek at.
      </p>
      <Link
        href={`/practice?node=${encodeURIComponent(node)}`}
        className="mt-3 inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
      >
        Practise this node
      </Link>
    </div>
  );
}

// ---------------------------------------------------------------------------
// the arc
// ---------------------------------------------------------------------------

function LabCard({ link }: { link: LabLink }) {
  return (
    <a
      href={link.href}
      className="block rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Pill tone="brand">3D lab</Pill>
        <span className="text-[13px] font-semibold text-card-foreground">
          {LAB_NAMES[link.lab]}, {modeLabel(link)} mode
        </span>
      </div>
      <p className="mt-2 text-[13.5px] leading-relaxed text-card-foreground">
        {link.blurb}
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        Opens on EUREKA. What you turn there is a model of this node, not a
        measurement of it.
      </p>
    </a>
  );
}

// Johnstone's three levels, placed immediately after the core idea because
// that is where they do their work. The failure this addresses is a course
// moving between levels without saying so, which cannot be fixed by putting
// the three levels on a separate page the learner visits later.
function Triangle({ view }: { view: TriangleViewData }) {
  return (
    <section className="space-y-3" aria-label="The same idea at three levels">
      <TriangleView
        nodeTitle={view.title}
        macroscopic={{ caption: view.macroscopic }}
        particulate={{ caption: view.particulate }}
        symbolic={{ caption: view.symbolic, equation: view.katex }}
      />

      <Card>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          What is the same in all three
        </h3>
        <p className="mt-1 text-[15px] leading-relaxed text-card-foreground">
          {view.connector}
        </p>
      </Card>

      <Card>
        <div className="flex flex-wrap items-center gap-2">
          <Pill tone="amber">level confusion</Pill>
        </div>
        <p className="mt-2 text-[15px] leading-relaxed text-card-foreground">
          {view.pitfall}
        </p>
      </Card>

      {view.caption && (
        <p className="text-xs text-muted-foreground">{view.caption}</p>
      )}
    </section>
  );
}

function ArcPart({
  index,
  label,
  body,
}: {
  index: number;
  label: string;
  body: string;
}) {
  return (
    <Card>
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
          {index}
        </span>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </h3>
      </div>
      <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-card-foreground">
        {body}
      </p>
    </Card>
  );
}

// Part five of the arc.
//
// BINDING RULE: the answer is not on screen when this loads. The learner must
// press "Show answer" to see it. The answer is not rendered and then hidden
// with CSS either, because that would put it in the page source where it can
// be read without attempting anything. It is only added to the document once
// the learner asks for it.
function TryIt({ prompt, answer }: { prompt: string; answer: string }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <Card className="border-brand-500">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">
          5
        </span>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Try it
        </h3>
      </div>
      <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-card-foreground">
        {prompt}
      </p>

      <div className="mt-4 border-t border-border pt-4">
        {!revealed ? (
          <>
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            >
              Show answer
            </button>
            <p className="mt-2 text-xs text-muted-foreground">
              Work it out first. Checking your own attempt against the answer is
              what makes this part do anything.
            </p>
          </>
        ) : (
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Answer
            </p>
            <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-card-foreground">
              {answer}
            </p>
            <button
              type="button"
              onClick={() => setRevealed(false)}
              className="mt-3 text-sm text-muted-foreground hover:underline"
            >
              Hide answer
            </button>
          </div>
        )}
      </div>
    </Card>
  );
}
