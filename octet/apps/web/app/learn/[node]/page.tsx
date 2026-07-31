'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Lesson,
  TriangleView as TriangleViewData,
  getCurriculumNodes,
  getLesson,
  getTriangle,
} from '@/lib/api';
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

// The lesson reader. It renders the six part arc in teaching order:
//
//   1 objective        what you will be able to do
//   2 build_on         the idea this attaches to
//   3 core_idea        the thing itself
//   4 worked_example   it done once, in full
//   5 try_it           your turn
//   6 pitfall          the error people actually make
//
// The order is the pedagogy, so it is fixed here rather than driven by the
// payload.

export default function LessonPage() {
  const params = useParams<{ node: string }>();
  const raw = params?.node;
  const nodeCode = decodeURIComponent(
    Array.isArray(raw) ? raw[0] : raw || '',
  );

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [title, setTitle] = useState<string>('');
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
        if (!cancelled) {
          setLesson(found);
        }
      } catch (err) {
        if (!cancelled) {
          setError(errorMessage(err));
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
  }, [nodeCode]);

  // The lesson payload carries the node code but not its title, so the title
  // comes from the graph. A failure here is not worth an error screen: the
  // page falls back to the code, which is still accurate.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await getCurriculumNodes();
        const match = result.nodes.find((n) => n.code === nodeCode);
        if (!cancelled && match) {
          setTitle(match.title);
        }
      } catch {
        // Leave the title empty and show the code instead.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [nodeCode]);

  // The triangle view, only where the lesson says one exists. Most nodes have
  // none, and the section simply does not render; nothing is invented to fill
  // the space.
  //
  // This used to fire for every node and swallow the 404, which meant a doomed
  // request and a console error on almost every lesson opened. The lesson
  // payload now reports whether a view is actually authored, so the request is
  // only made when it can succeed.
  const hasTriangle = lesson?.has_triangle_view ?? false;

  // The 3D lab on EUREKA built for this node, if one is. Most nodes have none
  // and this stays null, which renders nothing at all. It is computed from the
  // node code and the triangle flag rather than fetched, because the coverage
  // is a property of what the labs were built to show.
  const labLink = labLinkForLesson(nodeCode, hasTriangle);

  useEffect(() => {
    let cancelled = false;
    setTriangle(null);
    if (!nodeCode || !hasTriangle) {
      return;
    }
    (async () => {
      try {
        const result = await getTriangle(nodeCode);
        if (!cancelled) {
          setTriangle(result);
        }
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
        className="text-sm text-muted-foreground hover:underline"
      >
        Back to all lessons
      </Link>

      <h1 className="mb-1 mt-3 text-2xl font-bold tracking-tight">
        {title || nodeCode}
      </h1>
      <p className="mb-8 font-mono text-xs text-muted-foreground">{nodeCode}</p>

      {loading && <LoadingPanel label="Loading the lesson." />}
      {!loading && error && <ErrorPanel message={error} />}

      {!loading && !error && lesson && (
        <article className="space-y-6">
          <ArcPart index={1} label="Objective" body={lesson.objective} />
          <ArcPart index={2} label="Build on" body={lesson.build_on} />
          <ArcPart index={3} label="Core idea" body={lesson.core_idea} />

          {triangle && <Triangle view={triangle} />}

          <ArcPart
            index={4}
            label="Worked example"
            body={lesson.worked_example}
          />
          <TryIt prompt={lesson.try_it.prompt} answer={lesson.try_it.answer} />
          <ArcPart index={6} label="Pitfall" body={lesson.pitfall} />

          {lesson.misconception && (
            <Card>
              <div className="flex flex-wrap items-center gap-2">
                <Pill tone="amber">named misconception</Pill>
                <span className="font-mono text-xs text-muted-foreground">
                  {lesson.misconception}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                This lesson targets a belief the misconception library names,
                which is where a wrong answer on this topic routes.
              </p>
            </Card>
          )}

          {labLink && <LabCard link={labLink} />}
        </article>
      )}
    </Page>
  );
}

// The matching 3D lab on EUREKA, at the end of the arc because it is what to
// do next rather than part of the reading.
//
// The link ran one way until now. The labs are built against these node codes
// and link back to this page, while the lesson offered no route out to the
// model of the thing it had described. A learner on ORG1.CHAIR could read
// about a ring inversion and had nowhere to run one.
//
// Nothing renders for a node no lab covers, which is most of them. An empty
// state here would advertise a lab that has nothing for the node.
function LabCard({ link }: { link: LabLink }) {
  return (
    <a
      href={link.href}
      className="block rounded-xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Pill tone="brand">3D lab</Pill>
        <span className="text-sm font-semibold text-card-foreground">
          {LAB_NAMES[link.lab]}, {modeLabel(link)} mode
        </span>
      </div>
      <p className="mt-2 text-[15px] leading-relaxed text-card-foreground">
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
//
// The component takes the three panels. connector and pitfall are rendered
// here instead, because the component has no slot for them and they are the
// two fields that carry the teaching: the connector names the one thing that
// is identical across all three levels, and the pitfall names the specific
// level confusion learners fall into on this topic.
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
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </h2>
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
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Try it
        </h2>
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
