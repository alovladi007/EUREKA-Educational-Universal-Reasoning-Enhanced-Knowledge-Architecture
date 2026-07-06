'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  authoringCreateItem,
  authoringDeleteItem,
  authoringGenerateSolution,
  authoringItems,
  authoringNodes,
  authoringPreviewGrade,
  authoringUpdateItem,
  authoringVerifySolution,
  fetchMe,
  getToken,
  type AuthoredItem,
  type AuthoringNode,
  type ItemDraft,
  type PreviewGradeResult,
  type SolutionCheck,
} from '@/lib/api';
import { AppShell } from '@/components/AppShell';
import { ErrorPanel, SignInScreen } from '@/components/PageShell';
import { RichMath } from '@/components/Math';

// The Content Studio: author and edit items in the bank, with a live math
// preview of the prompt and a Test grade panel that runs the real grader on a
// sample answer (the same grade() the practice flow uses). Gated to teaching
// roles; a student who reaches this page sees a not-authorized notice.

type Gate = 'checking' | 'signed-out' | 'unauthorized' | 'ready' | 'error';

const AUTHOR_ROLES = new Set([
  'teacher',
  'author',
  'org_admin',
  'super_admin',
]);

const KINDS: { value: string; label: string; help: string }[] = [
  { value: 'mcq_single', label: 'Multiple choice (single)', help: 'Index of the correct option (0-based), e.g. 2.' },
  { value: 'mcq_multi', label: 'Multiple choice (multiple)', help: 'JSON array of correct option indices, e.g. [0, 2].' },
  { value: 'true_false', label: 'True / False', help: 'true or false.' },
  { value: 'short_text', label: 'Short text', help: 'Accepted answers separated by a pipe |, e.g. distributive|distributive property.' },
  { value: 'numeric', label: 'Numeric', help: 'The numeric answer, e.g. 3.5 or 3/4.' },
  { value: 'math_expression', label: 'Math expression', help: 'The answer expression; use ^ for powers, e.g. x^2 - 1.' },
  { value: 'equation', label: 'Equation', help: 'The answer equation, e.g. y = 2x + 3.' },
  { value: 'plot_points', label: 'Plot points', help: 'JSON list of [x, y] pairs, e.g. [[1,5],[2,7]].' },
  { value: 'plot_function', label: 'Plot a function', help: 'The function; use ^ for powers, e.g. x^2 - 4.' },
  { value: 'draw_line', label: 'Draw a line', help: 'The line equation, e.g. y = 2x - 1.' },
  { value: 'show_work', label: 'Show your work (step credit)', help: 'The final answer, e.g. 4. Add step milestones below.' },
];

const MCQ_KINDS = new Set(['mcq_single', 'mcq_multi']);

interface DraftState {
  id: string | null;
  node: string;
  kind: string;
  prompt: string;
  options: string[];
  correct: string;
  explanation: string;
  difficulty: number;
  milestonesText: string;
  workedText: string;
}

function blankDraft(node: string): DraftState {
  return {
    id: null,
    node,
    kind: 'math_expression',
    prompt: '',
    options: ['', ''],
    correct: '',
    explanation: '',
    difficulty: 0.5,
    milestonesText: '',
    workedText: '',
  };
}

function metaList(meta: Record<string, unknown> | null, key: string): string[] {
  if (meta && Array.isArray(meta[key])) {
    return (meta[key] as unknown[]).map((x) => String(x));
  }
  return [];
}

function draftFromItem(item: AuthoredItem, nodeCode: string): DraftState {
  return {
    id: item.id,
    node: nodeCode,
    kind: item.kind,
    prompt: item.prompt,
    options: item.options ?? ['', ''],
    correct: item.correct,
    explanation: item.explanation,
    difficulty: item.difficulty,
    milestonesText: metaList(item.meta, 'milestones').join('\n'),
    workedText: metaList(item.meta, 'worked_solution').join('\n'),
  };
}

export default function StudioPage() {
  const [gate, setGate] = useState<Gate>('checking');
  const [gateError, setGateError] = useState('');

  const [nodes, setNodes] = useState<AuthoringNode[]>([]);
  const [items, setItems] = useState<AuthoredItem[]>([]);
  const [filterNode, setFilterNode] = useState('');
  const [listError, setListError] = useState('');

  const [draft, setDraft] = useState<DraftState | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const [sample, setSample] = useState('');
  const [preview, setPreview] = useState<PreviewGradeResult | null>(null);
  const [previewError, setPreviewError] = useState('');
  const [previewing, setPreviewing] = useState(false);

  // Worked-solution authoring: an equation to generate steps from, the last
  // verification result, and a busy flag shared by generate and verify.
  const [genEquation, setGenEquation] = useState('');
  const [solution, setSolution] = useState<SolutionCheck | null>(null);
  const [solutionBusy, setSolutionBusy] = useState(false);

  // Map node id -> code so an item (which carries node_id) can be shown and
  // edited by code.
  const nodeCodeById = useMemo(() => {
    const map = new Map<string, string>();
    nodes.forEach((n) => map.set(n.id, n.code));
    return map;
  }, [nodes]);

  useEffect(() => {
    if (!getToken()) {
      setGate('signed-out');
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const me = await fetchMe();
        if (cancelled) {
          return;
        }
        const authorized = me.roles.some((r) => AUTHOR_ROLES.has(r));
        if (!authorized) {
          setGate('unauthorized');
          return;
        }
        const nodeResult = await authoringNodes();
        if (cancelled) {
          return;
        }
        setNodes(nodeResult.nodes);
        const itemResult = await authoringItems();
        if (cancelled) {
          return;
        }
        setItems(itemResult.items);
        setGate('ready');
      } catch (err) {
        if (cancelled) {
          return;
        }
        setGateError(err instanceof Error ? err.message : 'Failed to load the studio.');
        setGate('error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function reloadItems(node: string) {
    setListError('');
    try {
      const result = await authoringItems(node || undefined);
      setItems(result.items);
    } catch (err) {
      setListError(err instanceof Error ? err.message : 'Failed to load items.');
    }
  }

  function buildDraftPayload(state: DraftState): ItemDraft {
    const isMcq = MCQ_KINDS.has(state.kind);
    const meta: Record<string, unknown> = {};
    if (state.kind === 'show_work') {
      meta.milestones = state.milestonesText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
    }
    const workedLines = state.workedText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    if (workedLines.length > 0) {
      meta.worked_solution = workedLines;
    }
    return {
      node: state.node,
      kind: state.kind,
      prompt: state.prompt,
      correct: state.correct,
      options: isMcq ? state.options.map((o) => o.trim()).filter(Boolean) : null,
      explanation: state.explanation,
      difficulty: state.difficulty,
      tolerance: null,
      meta: Object.keys(meta).length > 0 ? meta : null,
    };
  }

  async function save() {
    if (!draft) {
      return;
    }
    if (!draft.node || !draft.prompt.trim()) {
      setSaveError('A node and a prompt are required.');
      return;
    }
    setSaving(true);
    setSaveError('');
    try {
      const payload = buildDraftPayload(draft);
      if (draft.id) {
        await authoringUpdateItem(draft.id, payload);
      } else {
        await authoringCreateItem(payload);
      }
      await reloadItems(filterNode);
      setDraft(null);
      setPreview(null);
      setSample('');
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save the item.');
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    try {
      await authoringDeleteItem(id);
      await reloadItems(filterNode);
      if (draft?.id === id) {
        setDraft(null);
      }
    } catch (err) {
      setListError(err instanceof Error ? err.message : 'Failed to delete the item.');
    }
  }

  async function verifyWorked() {
    if (!draft) {
      return;
    }
    const lines = draft.workedText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    if (lines.length === 0) {
      return;
    }
    setSolutionBusy(true);
    setSolution(null);
    try {
      setSolution(await authoringVerifySolution(lines));
    } catch {
      setSolution({ ok: false, detail: 'Failed to verify the solution.' });
    } finally {
      setSolutionBusy(false);
    }
  }

  async function generateWorked() {
    if (!draft || !genEquation.trim()) {
      return;
    }
    setSolutionBusy(true);
    setSolution(null);
    try {
      const res = await authoringGenerateSolution(genEquation.trim());
      if (res.ok) {
        setDraft({ ...draft, workedText: res.steps.join('\n') });
        setSolution({
          ok: true,
          steps: res.steps.map((s) => ({ text: s, verified: true, detail: '' })),
        });
      } else {
        setSolution({ ok: false, detail: res.detail });
      }
    } catch {
      setSolution({ ok: false, detail: 'Failed to generate the solution.' });
    } finally {
      setSolutionBusy(false);
    }
  }

  async function testGrade() {
    if (!draft) {
      return;
    }
    setPreviewing(true);
    setPreviewError('');
    setPreview(null);
    try {
      const payload = buildDraftPayload(draft);
      const result = await authoringPreviewGrade({
        kind: payload.kind,
        correct: payload.correct,
        sample_answer: sample,
        options: payload.options,
        tolerance: payload.tolerance,
        explanation: payload.explanation,
        meta: payload.meta,
      });
      setPreview(result);
    } catch (err) {
      setPreviewError(err instanceof Error ? err.message : 'Failed to test the grade.');
    } finally {
      setPreviewing(false);
    }
  }

  if (gate === 'checking') {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading the Content Studio.</p>
      </main>
    );
  }
  if (gate === 'signed-out') {
    return <SignInScreen />;
  }

  const kindHelp = KINDS.find((k) => k.value === draft?.kind)?.help ?? '';

  return (
    <AppShell>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-xl font-semibold text-foreground">Content Studio</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Author and edit items. The prompt renders math live, and Test grade
          runs the real grader on a sample answer before you save.
        </p>

        {gate === 'unauthorized' && (
          <div className="mt-8 rounded-lg border border-border bg-card p-6">
            <h2 className="text-base font-semibold text-card-foreground">
              Authoring is for teachers and authors
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your account does not have an authoring role. Ask an administrator
              for the teacher or author role to use the Content Studio.
            </p>
          </div>
        )}

        {gate === 'error' && (
          <div className="mt-8">
            <ErrorPanel message={gateError} />
          </div>
        )}

        {gate === 'ready' && (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.2fr]">
            {/* Item list */}
            <section aria-label="Items">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Items
                </h2>
                <button
                  type="button"
                  onClick={() => setDraft(blankDraft(filterNode || nodes[0]?.code || ''))}
                  className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  New item
                </button>
              </div>

              <label htmlFor="filter-node" className="sr-only">
                Filter by node
              </label>
              <select
                id="filter-node"
                value={filterNode}
                onChange={(e) => {
                  setFilterNode(e.target.value);
                  void reloadItems(e.target.value);
                }}
                className="mb-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">All nodes</option>
                {nodes.map((n) => (
                  <option key={n.id} value={n.code}>
                    {n.code} - {n.title}
                  </option>
                ))}
              </select>

              {listError && (
                <p className="mb-2 text-sm text-red-700 dark:text-red-300">{listError}</p>
              )}

              {items.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No items yet for this filter. Create one with New item.
                </p>
              ) : (
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="rounded-lg border border-border bg-card p-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                            {item.kind}
                          </span>
                          <p className="mt-1 line-clamp-2 text-sm text-card-foreground">
                            {item.prompt}
                          </p>
                        </div>
                        <div className="flex shrink-0 gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              setDraft(
                                draftFromItem(
                                  item,
                                  nodeCodeById.get(item.node_id) ?? '',
                                ),
                              )
                            }
                            className="rounded border border-border px-2 py-1 text-xs text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-brand-500"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => void remove(item.id)}
                            className="rounded border border-border px-2 py-1 text-xs text-red-700 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Editor */}
            <section aria-label="Editor">
              {draft === null ? (
                <div className="rounded-lg border border-dashed border-border p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    Select an item to edit, or create a new one.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 rounded-lg border border-border bg-card p-5">
                  <h2 className="text-base font-semibold text-card-foreground">
                    {draft.id ? 'Edit item' : 'New item'}
                  </h2>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-card-foreground">
                        Node
                      </label>
                      <select
                        value={draft.node}
                        onChange={(e) => setDraft({ ...draft, node: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
                      >
                        <option value="">Select a node</option>
                        {nodes.map((n) => (
                          <option key={n.id} value={n.code}>
                            {n.code} - {n.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-card-foreground">
                        Kind
                      </label>
                      <select
                        value={draft.kind}
                        onChange={(e) => setDraft({ ...draft, kind: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
                      >
                        {KINDS.map((k) => (
                          <option key={k.value} value={k.value}>
                            {k.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-card-foreground">
                      Prompt
                    </label>
                    <p className="mb-1 text-xs text-muted-foreground">
                      Wrap math in $...$ for inline or $$...$$ for a block. It
                      renders live below.
                    </p>
                    <textarea
                      value={draft.prompt}
                      rows={3}
                      onChange={(e) => setDraft({ ...draft, prompt: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="Solve for x: $2x + 3 = 11$."
                    />
                    {draft.prompt.trim() && (
                      <div className="mt-2 rounded-lg border border-border bg-background p-3 text-sm text-card-foreground">
                        <RichMath text={draft.prompt} />
                      </div>
                    )}
                  </div>

                  {MCQ_KINDS.has(draft.kind) && (
                    <div>
                      <label className="mb-1 block text-sm font-medium text-card-foreground">
                        Options
                      </label>
                      <div className="space-y-2">
                        {draft.options.map((opt, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="w-6 text-xs text-muted-foreground">
                              {i}
                            </span>
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => {
                                const next = [...draft.options];
                                next[i] = e.target.value;
                                setDraft({ ...draft, options: next });
                              }}
                              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
                              placeholder={`Option ${i}`}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setDraft({
                                  ...draft,
                                  options: draft.options.filter((_, j) => j !== i),
                                })
                              }
                              className="rounded border border-border px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => setDraft({ ...draft, options: [...draft.options, ''] })}
                        className="mt-2 rounded border border-border px-2 py-1 text-xs text-foreground hover:bg-muted"
                      >
                        Add option
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="mb-1 block text-sm font-medium text-card-foreground">
                      Answer key
                    </label>
                    <p className="mb-1 text-xs text-muted-foreground">{kindHelp}</p>
                    <input
                      type="text"
                      value={draft.correct}
                      onChange={(e) => setDraft({ ...draft, correct: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="Answer key"
                    />
                  </div>

                  {draft.kind === 'show_work' && (
                    <div>
                      <label className="mb-1 block text-sm font-medium text-card-foreground">
                        Step milestones (one per line)
                      </label>
                      <textarea
                        value={draft.milestonesText}
                        rows={3}
                        onChange={(e) => setDraft({ ...draft, milestonesText: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
                        placeholder={'2*x = 8\nx = 4'}
                      />
                    </div>
                  )}

                  {/* Worked solution (DeltaMath-style), verified against the CAS */}
                  <div className="rounded-lg border border-border bg-background p-3">
                    <p className="text-sm font-medium text-card-foreground">
                      Worked solution
                    </p>
                    <p className="mb-2 text-xs text-muted-foreground">
                      One step per line. Verify checks each step follows from the
                      previous one; shown to the student after they answer.
                    </p>
                    <textarea
                      value={draft.workedText}
                      rows={3}
                      onChange={(e) => setDraft({ ...draft, workedText: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder={'2*x + 3 = 11\n2*x = 8\nx = 4'}
                    />
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => void verifyWorked()}
                        disabled={solutionBusy}
                        className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-60"
                      >
                        Verify
                      </button>
                      <input
                        type="text"
                        value={genEquation}
                        onChange={(e) => setGenEquation(e.target.value)}
                        placeholder="Equation to solve, e.g. 2x + 3 = 11"
                        className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                      <button
                        type="button"
                        onClick={() => void generateWorked()}
                        disabled={solutionBusy}
                        className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-60"
                      >
                        Generate
                      </button>
                    </div>
                    {solution && (
                      <div className="mt-2 text-xs">
                        <span
                          className={
                            solution.ok
                              ? 'font-semibold text-emerald-700 dark:text-emerald-300'
                              : 'font-semibold text-red-700 dark:text-red-300'
                          }
                        >
                          {solution.ok ? 'Verified' : 'Not verified'}
                        </span>{' '}
                        {solution.detail && (
                          <span className="text-muted-foreground">{solution.detail}</span>
                        )}
                        {solution.steps && solution.steps.length > 0 && (
                          <ul className="mt-1 space-y-0.5">
                            {solution.steps.map((s, i) => (
                              <li key={i} className="font-mono text-muted-foreground">
                                {s.verified ? 'ok ' : 'x  '}
                                {s.text}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-card-foreground">
                        Explanation
                      </label>
                      <textarea
                        value={draft.explanation}
                        rows={2}
                        onChange={(e) => setDraft({ ...draft, explanation: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-card-foreground">
                        Difficulty (0 to 1)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={1}
                        step={0.05}
                        value={draft.difficulty}
                        onChange={(e) =>
                          setDraft({ ...draft, difficulty: Number(e.target.value) })
                        }
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  {/* Test grade */}
                  <div className="rounded-lg border border-border bg-background p-3">
                    <p className="text-sm font-medium text-card-foreground">Test grade</p>
                    <p className="mb-2 text-xs text-muted-foreground">
                      Enter a sample answer and run the real grader.
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={sample}
                        onChange={(e) => setSample(e.target.value)}
                        className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
                        placeholder="Sample answer"
                      />
                      <button
                        type="button"
                        onClick={() => void testGrade()}
                        disabled={previewing}
                        className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-60"
                      >
                        {previewing ? 'Grading.' : 'Test grade'}
                      </button>
                    </div>
                    {previewError && (
                      <p className="mt-2 text-sm text-red-700 dark:text-red-300">
                        {previewError}
                      </p>
                    )}
                    {preview && (
                      <div className="mt-2 text-sm">
                        <span
                          className={
                            preview.is_correct
                              ? 'font-semibold text-emerald-700 dark:text-emerald-300'
                              : 'font-semibold text-red-700 dark:text-red-300'
                          }
                        >
                          {preview.is_correct ? 'Correct' : 'Incorrect'}
                        </span>{' '}
                        <span className="text-muted-foreground">
                          (score {preview.score}, grader {preview.grader}) - {preview.detail}
                        </span>
                      </div>
                    )}
                  </div>

                  {saveError && (
                    <p className="text-sm text-red-700 dark:text-red-300">{saveError}</p>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => void save()}
                      disabled={saving}
                      className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-60"
                    >
                      {saving ? 'Saving.' : draft.id ? 'Save changes' : 'Create item'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDraft(null);
                        setPreview(null);
                        setSaveError('');
                      }}
                      className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </AppShell>
  );
}
