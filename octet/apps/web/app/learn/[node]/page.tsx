'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Lesson, getCurriculumNodes, getLesson } from '@/lib/api';
import {
  Card,
  ErrorPanel,
  HeaderLink,
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

  return (
    <Page
      nav={
        <>
          <HeaderLink href="/learn">Learn</HeaderLink>
          <HeaderLink href="/practice">Practice</HeaderLink>
          <HeaderLink href="/path">Path</HeaderLink>
        </>
      }
    >
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
        </article>
      )}
    </Page>
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
