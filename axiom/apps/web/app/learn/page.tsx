'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  fetchGraph,
  fetchLesson,
  getToken,
  type GraphNode,
  type Lesson,
} from '@/lib/api';
import {
  ErrorPanel,
  HeaderLink,
  PageHeader,
  SignInScreen,
} from '@/components/PageShell';

// The Learn page lists the skill-graph nodes in the order the API returns
// them. Selecting a node loads its lesson and shows the ordered steps, plus a
// button to practice the skill.

type LoadState = 'checking' | 'signed-out' | 'loading' | 'ready' | 'error';

export default function LearnPage() {
  const [state, setState] = useState<LoadState>('checking');
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [lessonState, setLessonState] = useState<
    'idle' | 'loading' | 'ready' | 'error'
  >('idle');
  const [lessonError, setLessonError] = useState('');

  useEffect(() => {
    if (!getToken()) {
      setState('signed-out');
      return;
    }
    setState('loading');
    let cancelled = false;
    (async () => {
      try {
        const graph = await fetchGraph();
        if (cancelled) {
          return;
        }
        setNodes(graph.nodes);
        setState('ready');
      } catch (err) {
        if (cancelled) {
          return;
        }
        setErrorMessage(
          err instanceof Error ? err.message : 'Failed to load the curriculum.',
        );
        setState('error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function openLesson(code: string) {
    setSelectedCode(code);
    setLesson(null);
    setLessonState('loading');
    setLessonError('');
    try {
      const result = await fetchLesson(code);
      setLesson(result);
      setLessonState('ready');
    } catch (err) {
      setLessonError(
        err instanceof Error ? err.message : 'Failed to load this lesson.',
      );
      setLessonState('error');
    }
  }

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

  return (
    <div className="min-h-screen">
      <PageHeader>
        <HeaderLink href="/dashboard">Dashboard</HeaderLink>
        <HeaderLink href="/practice">Practice</HeaderLink>
        <HeaderLink href="/assessments">Assessments</HeaderLink>
        <HeaderLink href="/mastery">Mastery</HeaderLink>
        <HeaderLink href="/review">Review</HeaderLink>
        <HeaderLink href="/copilot">Copilot</HeaderLink>
        <HeaderLink href="/cat">Adaptive Test</HeaderLink>
        <HeaderLink href="/achievements">Achievements</HeaderLink>
        <HeaderLink href="/analytics">Analytics</HeaderLink>
        <HeaderLink href="/grading-review">Grading</HeaderLink>
      </PageHeader>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-xl font-semibold text-foreground">Learn</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse the skills in the curriculum. Select a skill to read its
          lesson, then practice it.
        </p>

        {state === 'loading' && (
          <p className="mt-8 text-sm text-muted-foreground">
            Loading the curriculum.
          </p>
        )}

        {state === 'error' && (
          <div className="mt-8">
            <ErrorPanel message={errorMessage} />
          </div>
        )}

        {state === 'ready' && (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[18rem_1fr]">
            <section aria-label="Skills">
              <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Skills
              </h2>
              {nodes.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No skills have been published yet.
                </p>
              ) : (
                <ul className="space-y-2">
                  {nodes.map((node) => {
                    const active = node.code === selectedCode;
                    return (
                      <li key={node.id}>
                        <button
                          type="button"
                          onClick={() => openLesson(node.code)}
                          aria-current={active ? 'true' : undefined}
                          className={`w-full rounded-lg border p-3 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                            active
                              ? 'border-brand-500 bg-brand-50 dark:bg-brand-950'
                              : 'border-border bg-card hover:border-brand-300'
                          }`}
                        >
                          <span className="block text-sm font-semibold text-card-foreground">
                            {node.title}
                          </span>
                          <span className="mt-0.5 block font-mono text-xs text-muted-foreground">
                            {node.code}
                          </span>
                          {node.description && (
                            <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                              {node.description}
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            <section aria-label="Lesson" aria-live="polite">
              {selectedCode === null && (
                <div className="rounded-lg border border-dashed border-border p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    Select a skill on the left to read its lesson.
                  </p>
                </div>
              )}

              {lessonState === 'loading' && (
                <p className="text-sm text-muted-foreground">
                  Loading the lesson.
                </p>
              )}

              {lessonState === 'error' && <ErrorPanel message={lessonError} />}

              {lessonState === 'ready' && lesson && (
                <article className="rounded-lg border border-border bg-card p-6">
                  <h2 className="text-lg font-semibold text-card-foreground">
                    {lesson.title}
                  </h2>
                  {lesson.summary && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {lesson.summary}
                    </p>
                  )}

                  {lesson.steps.length === 0 ? (
                    <p className="mt-6 text-sm text-muted-foreground">
                      This lesson has no steps yet.
                    </p>
                  ) : (
                    <ol className="mt-6 space-y-5">
                      {lesson.steps.map((step) => (
                        <li
                          key={step.position}
                          className="border-l-2 border-brand-200 pl-4 dark:border-brand-800"
                        >
                          <div className="flex items-baseline gap-2">
                            <span className="text-xs font-medium uppercase tracking-wide text-brand-600 dark:text-brand-300">
                              {step.kind}
                            </span>
                          </div>
                          <h3 className="mt-1 text-sm font-semibold text-card-foreground">
                            {step.title}
                          </h3>
                          <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                            {step.body}
                          </p>
                        </li>
                      ))}
                    </ol>
                  )}

                  {selectedCode && (
                    <div className="mt-6">
                      <Link
                        href={`/practice?node=${encodeURIComponent(selectedCode)}`}
                        className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                      >
                        Practice this skill
                      </Link>
                    </div>
                  )}
                </article>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
