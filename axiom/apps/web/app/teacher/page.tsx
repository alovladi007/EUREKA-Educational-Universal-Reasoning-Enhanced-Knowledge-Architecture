'use client';

import { useEffect, useState } from 'react';
import {
  ApiError,
  assignToAllStudents,
  createAssessment,
  fetchAssessmentResults,
  fetchGraph,
  fetchMyAssessments,
  getToken,
  type AssessmentResults,
  type AssessmentSummary,
  type GraphNode,
} from '@/lib/api';
import {
  ErrorPanel,
  HeaderLink,
  PageHeader,
  SignInScreen,
} from '@/components/PageShell';

// The teacher console. Every teacher-only call can return 403 for a student;
// when that happens we show a clear "Teacher role required" message rather than
// surfacing a raw error. Teachers can create assessments from graph nodes,
// assign them to all students, and view results.

type LoadState =
  | 'checking'
  | 'signed-out'
  | 'loading'
  | 'ready'
  | 'forbidden'
  | 'error';

function isForbidden(err: unknown): boolean {
  return err instanceof ApiError && err.status === 403;
}

function formatWhen(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString();
}

export default function TeacherPage() {
  const [state, setState] = useState<LoadState>('checking');
  const [errorMessage, setErrorMessage] = useState('');

  const [assessments, setAssessments] = useState<AssessmentSummary[]>([]);
  const [nodes, setNodes] = useState<GraphNode[]>([]);

  // Create form state.
  const [title, setTitle] = useState('');
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [itemCount, setItemCount] = useState(5);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState('');

  // Per-assessment action state.
  const [assignNote, setAssignNote] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, AssessmentResults>>({});
  const [resultsError, setResultsError] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<Record<string, boolean>>({});

  async function loadAll() {
    setState('loading');
    setErrorMessage('');
    try {
      // The assessments call is teacher-gated, so run it first to detect 403.
      const [mine, graph] = await Promise.all([
        fetchMyAssessments(),
        fetchGraph(),
      ]);
      setAssessments(mine);
      setNodes(graph.nodes);
      setState('ready');
    } catch (err) {
      if (isForbidden(err)) {
        setState('forbidden');
        return;
      }
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to load the console.',
      );
      setState('error');
    }
  }

  useEffect(() => {
    if (!getToken()) {
      setState('signed-out');
      return;
    }
    void loadAll();
  }, []);

  function toggleCode(code: string) {
    setSelectedCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  }

  async function submitCreate(event: React.FormEvent) {
    event.preventDefault();
    setFormError('');
    if (title.trim() === '') {
      setFormError('Give the assessment a title.');
      return;
    }
    if (selectedCodes.length === 0) {
      setFormError('Select at least one skill.');
      return;
    }
    if (!Number.isFinite(itemCount) || itemCount < 1) {
      setFormError('The number of items must be at least 1.');
      return;
    }
    setCreating(true);
    try {
      await createAssessment({
        title: title.trim(),
        node_ids: selectedCodes,
        item_count: Math.floor(itemCount),
      });
      setTitle('');
      setSelectedCodes([]);
      setItemCount(5);
      const mine = await fetchMyAssessments();
      setAssessments(mine);
    } catch (err) {
      if (isForbidden(err)) {
        setState('forbidden');
        return;
      }
      setFormError(
        err instanceof Error ? err.message : 'Failed to create the assessment.',
      );
    } finally {
      setCreating(false);
    }
  }

  async function assign(id: string) {
    setBusy((prev) => ({ ...prev, [id]: true }));
    setAssignNote((prev) => ({ ...prev, [id]: '' }));
    try {
      const res = await assignToAllStudents(id);
      setAssignNote((prev) => ({
        ...prev,
        [id]: `Assigned to ${res.assigned} student${
          res.assigned === 1 ? '' : 's'
        }.`,
      }));
    } catch (err) {
      if (isForbidden(err)) {
        setState('forbidden');
        return;
      }
      setAssignNote((prev) => ({
        ...prev,
        [id]: err instanceof Error ? err.message : 'Failed to assign.',
      }));
    } finally {
      setBusy((prev) => ({ ...prev, [id]: false }));
    }
  }

  async function viewResults(id: string) {
    setBusy((prev) => ({ ...prev, [id]: true }));
    setResultsError((prev) => ({ ...prev, [id]: '' }));
    try {
      const res = await fetchAssessmentResults(id);
      setResults((prev) => ({ ...prev, [id]: res }));
    } catch (err) {
      if (isForbidden(err)) {
        setState('forbidden');
        return;
      }
      setResultsError((prev) => ({
        ...prev,
        [id]:
          err instanceof Error ? err.message : 'Failed to load the results.',
      }));
    } finally {
      setBusy((prev) => ({ ...prev, [id]: false }));
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
        <HeaderLink href="/mastery">Mastery</HeaderLink>
        <HeaderLink href="/copilot">Copilot</HeaderLink>
        <HeaderLink href="/cat">Adaptive Test</HeaderLink>
        <HeaderLink href="/achievements">Achievements</HeaderLink>
        <HeaderLink href="/analytics">Analytics</HeaderLink>
        <HeaderLink href="/grading-review">Grading</HeaderLink>
      </PageHeader>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-xl font-semibold text-foreground">
          Teacher console
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create assessments from the skill graph, assign them, and review
          results.
        </p>

        {state === 'loading' && (
          <p className="mt-8 text-sm text-muted-foreground">
            Loading the console.
          </p>
        )}

        {state === 'forbidden' && (
          <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-6 dark:border-amber-900 dark:bg-amber-950">
            <h2 className="mb-1 text-base font-semibold text-amber-800 dark:text-amber-200">
              Teacher role required
            </h2>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              This console is available to teachers. Your account does not have
              the teacher role, so there is nothing to show here.
            </p>
          </div>
        )}

        {state === 'error' && (
          <div className="mt-8">
            <ErrorPanel message={errorMessage} />
          </div>
        )}

        {state === 'ready' && (
          <div className="mt-8 space-y-10">
            <section aria-label="Create an assessment">
              <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                New assessment
              </h2>
              <form
                onSubmit={submitCreate}
                className="rounded-lg border border-border bg-card p-5"
              >
                <div className="mb-4">
                  <label
                    htmlFor="assessment-title"
                    className="mb-1 block text-sm font-medium text-card-foreground"
                  >
                    Title
                  </label>
                  <input
                    id="assessment-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="For example, Linear equations check"
                  />
                </div>

                <fieldset className="mb-4">
                  <legend className="mb-1 block text-sm font-medium text-card-foreground">
                    Skills
                  </legend>
                  {nodes.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No skills are available to include yet.
                    </p>
                  ) : (
                    <div className="max-h-56 space-y-1 overflow-y-auto rounded-lg border border-border bg-background p-2">
                      {nodes.map((node) => (
                        <label
                          key={node.id}
                          className="flex cursor-pointer items-start gap-2 rounded p-1.5 text-sm hover:bg-muted"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCodes.includes(node.code)}
                            onChange={() => toggleCode(node.code)}
                            className="mt-0.5"
                          />
                          <span>
                            <span className="font-medium text-card-foreground">
                              {node.title}
                            </span>{' '}
                            <span className="font-mono text-xs text-muted-foreground">
                              {node.code}
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </fieldset>

                <div className="mb-4">
                  <label
                    htmlFor="item-count"
                    className="mb-1 block text-sm font-medium text-card-foreground"
                  >
                    Number of items
                  </label>
                  <input
                    id="item-count"
                    type="number"
                    min={1}
                    value={itemCount}
                    onChange={(e) => setItemCount(Number(e.target.value))}
                    className="w-28 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                {formError && (
                  <p className="mb-3 text-sm text-red-700 dark:text-red-300">
                    {formError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={creating}
                  className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {creating ? 'Creating.' : 'Create assessment'}
                </button>
              </form>
            </section>

            <section aria-label="My assessments">
              <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                My assessments
              </h2>
              {assessments.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  You have not created any assessments yet.
                </p>
              ) : (
                <ul className="space-y-4">
                  {assessments.map((assessment) => {
                    const isBusy = busy[assessment.id];
                    const note = assignNote[assessment.id];
                    const res = results[assessment.id];
                    const resErr = resultsError[assessment.id];
                    return (
                      <li
                        key={assessment.id}
                        className="rounded-lg border border-border bg-card p-5"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="text-sm font-semibold text-card-foreground">
                              {assessment.title}
                            </h3>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {assessment.kind} - created{' '}
                              {formatWhen(assessment.created_at)}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => assign(assessment.id)}
                              disabled={isBusy}
                              className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-60"
                            >
                              Assign to all students
                            </button>
                            <button
                              type="button"
                              onClick={() => viewResults(assessment.id)}
                              disabled={isBusy}
                              className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-60"
                            >
                              View results
                            </button>
                          </div>
                        </div>

                        {note && (
                          <p className="mt-3 text-sm text-muted-foreground">
                            {note}
                          </p>
                        )}

                        {resErr && (
                          <p className="mt-3 text-sm text-red-700 dark:text-red-300">
                            {resErr}
                          </p>
                        )}

                        {res && (
                          <div className="mt-4 overflow-x-auto">
                            {res.results.length === 0 ? (
                              <p className="text-sm text-muted-foreground">
                                No students are assigned yet.
                              </p>
                            ) : (
                              <table className="w-full text-left text-sm">
                                <thead>
                                  <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                                    <th className="py-2 pr-4 font-medium">
                                      Student
                                    </th>
                                    <th className="py-2 pr-4 font-medium">
                                      Answered
                                    </th>
                                    <th className="py-2 pr-4 font-medium">
                                      Correct
                                    </th>
                                    <th className="py-2 pr-4 font-medium">
                                      Score
                                    </th>
                                    <th className="py-2 font-medium">Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {res.results.map((row, index) => (
                                    <tr
                                      key={`${row.display_name}-${index}`}
                                      className="border-b border-border last:border-0"
                                    >
                                      <td className="py-2 pr-4 text-card-foreground">
                                        {row.display_name}
                                      </td>
                                      <td className="py-2 pr-4 text-muted-foreground">
                                        {row.answered}
                                      </td>
                                      <td className="py-2 pr-4 text-muted-foreground">
                                        {row.correct}
                                      </td>
                                      <td className="py-2 pr-4 text-muted-foreground">
                                        {row.score === null
                                          ? '-'
                                          : `${Math.round(row.score * 100)}%`}
                                      </td>
                                      <td className="py-2 capitalize text-muted-foreground">
                                        {row.status}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            )}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
