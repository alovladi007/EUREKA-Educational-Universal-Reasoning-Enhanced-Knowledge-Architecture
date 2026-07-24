'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  GradeResult,
  Hint,
  TemplateSummary,
  Variant,
  getHint,
  getNextItem,
  getTemplates,
  submitAnswer,
} from '@/lib/api';
import {
  Card,
  EmptyState,
  ErrorPanel,
  LoadingPanel,
  Page,
  Pill,
  SectionTitle,
  errorMessage,
} from '@/app/_ui/shell';

// The practice surface.
//
// Two rules from the teaching model are enforced on this page, not merely
// respected by it:
//
//   1. Hints unlock one rung at a time. Rung 2 cannot be requested until rung 1
//      has been shown, so the request never names a rung above what the learner
//      has actually unlocked. The API refuses out of order requests as well,
//      but the client must not be the thing that tries.
//
//   2. No correct answer is displayed anywhere on this page. The submit
//      endpoint does not return one, and nothing here reconstructs, guesses at
//      or hints toward the key. Feedback is the grader's own detail string,
//      which names the belief behind a wrong answer without stating the answer.

const MAX_RUNGS = 3;

export default function PracticePage() {
  const [templates, setTemplates] = useState<TemplateSummary[] | null>(null);
  const [selected, setSelected] = useState<string>('');
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [templateError, setTemplateError] = useState<string | null>(null);

  const [variant, setVariant] = useState<Variant | null>(null);
  const [count, setCount] = useState(0);
  const [loadingItem, setLoadingItem] = useState(false);
  const [itemError, setItemError] = useState<string | null>(null);

  const [answer, setAnswer] = useState('');
  const [hints, setHints] = useState<Hint[]>([]);
  const [hintError, setHintError] = useState<string | null>(null);
  const [loadingHint, setLoadingHint] = useState(false);

  const [result, setResult] = useState<GradeResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await getTemplates();
        if (!cancelled) {
          setTemplates(list.templates);
        }
      } catch (err) {
        if (!cancelled) {
          setTemplateError(errorMessage(err));
        }
      } finally {
        if (!cancelled) {
          setLoadingTemplates(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Clear everything that belongs to the previous item.
  const resetItemState = useCallback(() => {
    setAnswer('');
    setHints([]);
    setHintError(null);
    setResult(null);
    setSubmitError(null);
    setItemError(null);
  }, []);

  const loadItem = useCallback(
    async (templateId: string, attemptCount: number) => {
      resetItemState();
      setLoadingItem(true);
      setVariant(null);
      try {
        const served = await getNextItem(templateId, attemptCount);
        setVariant(served);
      } catch (err) {
        setItemError(errorMessage(err));
      } finally {
        setLoadingItem(false);
      }
    },
    [resetItemState],
  );

  function chooseTemplate(templateId: string) {
    setSelected(templateId);
    setCount(0);
    if (templateId) {
      void loadItem(templateId, 0);
    } else {
      setVariant(null);
      resetItemState();
    }
  }

  function nextVariant() {
    if (!selected) {
      return;
    }
    const next = count + 1;
    setCount(next);
    void loadItem(selected, next);
  }

  // The hint ladder. nextRung is always exactly one above what has been shown,
  // and unlocked is set to the same value, so a request is never made for a
  // rung the learner has not reached.
  const shownRungs = hints.length;
  const nextRung = shownRungs + 1;
  const laddersLeft = nextRung <= MAX_RUNGS;

  async function requestHint() {
    if (!variant || !laddersLeft) {
      return;
    }
    setLoadingHint(true);
    setHintError(null);
    try {
      const hint = await getHint(variant.template_id, nextRung, nextRung);
      setHints((prev) => [...prev, hint]);
    } catch (err) {
      setHintError(errorMessage(err));
    } finally {
      setLoadingHint(false);
    }
  }

  async function submit() {
    if (!variant || !answer.trim()) {
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const graded = await submitAnswer(
        variant.template_id,
        variant.seed,
        answer,
      );
      setResult(graded);
    } catch (err) {
      setSubmitError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  const choices = variant?.meta?.choices ?? [];
  const isMultipleChoice = variant?.grader === 'mc';

  return (
    <Page>
      <h1 className="mb-1 text-2xl font-bold tracking-tight">Practice</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Every item is generated and its answer key is independently verified
        before it is served.
      </p>

      <section className="mb-8">
        <SectionTitle>Choose a template</SectionTitle>
        {loadingTemplates && <LoadingPanel label="Loading templates." />}
        {!loadingTemplates && templateError && (
          <ErrorPanel message={templateError} />
        )}
        {!loadingTemplates &&
          !templateError &&
          (!templates || templates.length === 0) && (
            <EmptyState
              title="No templates registered"
              detail="The API returned an empty template list, so there is nothing to practice."
            />
          )}
        {!loadingTemplates && !templateError && templates && templates.length > 0 && (
          <Card>
            <label
              htmlFor="template"
              className="mb-2 block text-sm font-medium text-card-foreground"
            >
              Template
            </label>
            <select
              id="template"
              value={selected}
              onChange={(e) => chooseTemplate(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">Pick one of {templates.length}</option>
              {templates.map((t) => (
                <option key={t.template_id} value={t.template_id}>
                  {t.template_id} ({t.node}, {t.grader})
                </option>
              ))}
            </select>
          </Card>
        )}
      </section>

      {selected && (
        <section>
          <SectionTitle>Item</SectionTitle>

          {loadingItem && <LoadingPanel label="Serving an item." />}
          {!loadingItem && itemError && <ErrorPanel message={itemError} />}

          {!loadingItem && !itemError && variant && (
            <div className="space-y-4">
              <Card>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Pill tone="neutral">{variant.node}</Pill>
                  <Pill tone="neutral">grader: {variant.grader}</Pill>
                  <span className="font-mono text-xs text-muted-foreground">
                    seed {variant.seed}
                  </span>
                  {variant.verified_by && (
                    <Pill tone="green">
                      key verified by {variant.verified_by}
                    </Pill>
                  )}
                </div>

                <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-card-foreground">
                  {variant.prompt}
                </p>

                <div className="mt-5">
                  {isMultipleChoice ? (
                    choices.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        This item is multiple choice but carried no options, so
                        there is nothing to select.
                      </p>
                    ) : (
                      <fieldset>
                        <legend className="sr-only">Select an option</legend>
                        <div className="space-y-2">
                          {choices.map((choice) => (
                            <label
                              key={choice.index}
                              className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 text-sm transition-colors hover:border-brand-500"
                            >
                              <input
                                type="radio"
                                name="choice"
                                value={String(choice.index)}
                                checked={answer === String(choice.index)}
                                onChange={(e) => setAnswer(e.target.value)}
                                className="mt-0.5 h-4 w-4 accent-brand-600"
                              />
                              <span className="text-card-foreground">
                                {choice.text}
                              </span>
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    )
                  ) : (
                    <div>
                      <label
                        htmlFor="answer"
                        className="mb-2 block text-sm font-medium text-card-foreground"
                      >
                        Your answer
                      </label>
                      <input
                        id="answer"
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            void submit();
                          }
                        }}
                        autoComplete="off"
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  )}
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => void submit()}
                    disabled={submitting || !answer.trim()}
                    className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                  >
                    {submitting ? 'Submitting' : 'Submit'}
                  </button>

                  <button
                    type="button"
                    onClick={() => void requestHint()}
                    disabled={loadingHint || !laddersLeft}
                    className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand-500 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {laddersLeft
                      ? `Hint (rung ${nextRung} of ${MAX_RUNGS})`
                      : 'All hints shown'}
                  </button>

                  <button
                    type="button"
                    onClick={nextVariant}
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    Next variant
                  </button>
                </div>

                {submitError && (
                  <p className="mt-3 text-sm text-red-700 dark:text-red-300">
                    {submitError}
                  </p>
                )}
              </Card>

              {(hints.length > 0 || hintError) && (
                <Card>
                  <SectionTitle>Hints</SectionTitle>
                  <ol className="space-y-3">
                    {hints.map((hint) => (
                      <li key={hint.rung} className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                          {hint.rung}
                        </span>
                        <p className="text-sm leading-relaxed text-card-foreground">
                          {hint.text}
                        </p>
                      </li>
                    ))}
                  </ol>
                  {hintError && (
                    <p className="mt-3 text-sm text-red-700 dark:text-red-300">
                      {hintError}
                    </p>
                  )}
                  {laddersLeft && hints.length > 0 && (
                    <p className="mt-3 text-xs text-muted-foreground">
                      Try again with this before asking for the next rung.
                    </p>
                  )}
                </Card>
              )}

              {result && <ResultCard result={result} />}
            </div>
          )}
        </section>
      )}
    </Page>
  );
}

// The graded result. Note what is absent: there is no correct answer here,
// because the submit endpoint does not return one and this page must not
// invent one. graded false is shown as its own state, because a submission
// that could not be parsed is a different thing from one that was wrong.
function ResultCard({ result }: { result: GradeResult }) {
  const tone = !result.graded ? 'amber' : result.is_correct ? 'green' : 'red';
  const label = !result.graded
    ? 'Could not be read'
    : result.is_correct
      ? 'Correct'
      : 'Not correct';

  const failed = result.milestones.find((m) => m.ok === false);

  return (
    <Card>
      <div className="flex flex-wrap items-center gap-3">
        <Pill tone={tone}>{label}</Pill>
        <span className="text-sm text-muted-foreground">
          score {result.score.toFixed(2)}
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          {result.grader}
        </span>
      </div>

      {result.detail && (
        <p className="mt-3 text-[15px] leading-relaxed text-card-foreground">
          {result.detail}
        </p>
      )}

      {result.misconception && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-300">
            Named misconception
          </p>
          <p className="mt-1 font-mono text-sm text-amber-900 dark:text-amber-200">
            {result.misconception}
          </p>
        </div>
      )}

      {failed && (
        <div className="mt-4 rounded-lg border border-border p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            First step that went wrong
          </p>
          <p className="mt-1 text-sm text-card-foreground">
            {String(failed.step || failed.detail || 'See the detail above.')}
          </p>
        </div>
      )}
    </Card>
  );
}
