'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import {
  ApiError,
  EquilibriumResult,
  PoeExplainResult,
  PoeObserveResult,
  PoePredictResult,
  PoeStart,
  SimulationCatalogue,
  TitrationResult,
  explainPoe,
  getSimulations,
  observePoe,
  predictPoe,
  startPoe,
} from '@/lib/api';
import { Simulator } from '@/components';
import type { SeriesPoint, SimulatorScenario } from '@/components';
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

// One predict, observe, explain activity.
//
// Three rules are enforced here rather than merely respected:
//
//   1. The prediction comes first. start returns no simulation data at all, and
//      this page renders the Simulator in its predict phase, where the chart is
//      never mounted. The result arrives with the response to predict and not
//      one moment earlier.
//
//   2. The ticket is carried through every step. It is the only thing that
//      tells the server a prediction was recorded, so every response's ticket
//      replaces the one held here. Dropping it strands the learner mid attempt.
//
//   3. No correct answer is shown before the learner answers. The API does not
//      send one, and there is no reveal control anywhere in this flow.
//
// When the server refuses a step with 409 it explains the ordering problem in
// the learner's own terms. That message is shown as written, because it is more
// useful than anything this page could say in its place.

type Step = 'predict' | 'observe' | 'explain' | 'done';

const STEP_LABELS: Array<{ key: Step; label: string }> = [
  { key: 'predict', label: 'Predict' },
  { key: 'observe', label: 'Observe' },
  { key: 'explain', label: 'Explain' },
  { key: 'done', label: 'Done' },
];

function isOrderingRefusal(err: unknown): boolean {
  return err instanceof ApiError && err.status === 409;
}

// Show the number the server sent, with float noise trimmed. Very small
// magnitudes keep their exponent rather than collapsing to zero on screen.
function formatNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return 'not a number';
  }
  const magnitude = Math.abs(value);
  if (magnitude !== 0 && (magnitude < 0.001 || magnitude >= 100000)) {
    return value.toExponential(3);
  }
  return String(Math.round(value * 1e6) / 1e6);
}

export default function SimulationActivityPage() {
  const params = useParams<{ item: string }>();
  const raw = params?.item;
  const itemId = decodeURIComponent(Array.isArray(raw) ? raw[0] : raw || '');

  const [attempt, setAttempt] = useState(0);

  const [catalogue, setCatalogue] = useState<SimulationCatalogue | null>(null);
  const [start, setStart] = useState<PoeStart | null>(null);
  const [ticket, setTicket] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [ordering, setOrdering] = useState<string | null>(null);

  const [reasoning, setReasoning] = useState('');
  const [predictResult, setPredictResult] = useState<PoePredictResult | null>(
    null,
  );
  const [predicting, setPredicting] = useState(false);
  const [predictError, setPredictError] = useState<string | null>(null);

  const [reading, setReading] = useState<number | null>(null);
  const [observation, setObservation] = useState('');
  const [observeResult, setObserveResult] = useState<PoeObserveResult | null>(
    null,
  );
  const [observing, setObserving] = useState(false);
  const [observeError, setObserveError] = useState<string | null>(null);

  const [explainChoice, setExplainChoice] = useState('');
  const [reflection, setReflection] = useState('');
  const [explainResult, setExplainResult] = useState<PoeExplainResult | null>(
    null,
  );
  const [explaining, setExplaining] = useState(false);
  const [explainError, setExplainError] = useState<string | null>(null);

  // The catalogue supplies the scenario kind, which decides how the result is
  // rendered. start supplies the ticket, the prompt and the options, and
  // deliberately supplies nothing about the result.
  useEffect(() => {
    if (!itemId) {
      setLoadError('No activity was named in the address.');
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    (async () => {
      try {
        const [catalogueResult, startResult] = await Promise.all([
          getSimulations(),
          startPoe(itemId),
        ]);
        if (!cancelled) {
          setCatalogue(catalogueResult);
          setStart(startResult);
          setTicket(startResult.ticket);
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(errorMessage(err));
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
  }, [itemId, attempt]);

  const restart = useCallback(() => {
    setStart(null);
    setTicket('');
    setOrdering(null);
    setReasoning('');
    setPredictResult(null);
    setPredictError(null);
    setReading(null);
    setObservation('');
    setObserveResult(null);
    setObserveError(null);
    setExplainChoice('');
    setReflection('');
    setExplainResult(null);
    setExplainError(null);
    setAttempt((value) => value + 1);
  }, []);

  const step: Step = explainResult
    ? 'done'
    : observeResult
      ? 'explain'
      : predictResult
        ? 'observe'
        : 'predict';

  const scenario =
    catalogue?.scenarios.find(
      (candidate) => candidate.id === start?.scenario,
    ) ?? null;
  const kind: SimulatorScenario | null = scenario ? scenario.kind : null;

  const simulation = predictResult?.simulation ?? null;
  const titration: TitrationResult | null =
    simulation && simulation.kind === 'titration' ? simulation : null;
  const equilibrium: EquilibriumResult | null =
    simulation && simulation.kind === 'equilibrium' ? simulation : null;

  const series: SeriesPoint[] = titration
    ? titration.curve.map((point) => ({ x: point.volume_mL, y: point.pH }))
    : [];

  async function handlePredict(submission: {
    choice: string | null;
    reasoning: string;
  }) {
    if (!ticket || !submission.choice) {
      return;
    }
    setPredicting(true);
    setPredictError(null);
    setOrdering(null);
    try {
      const result = await predictPoe(ticket, submission.choice);
      // The new ticket carries the recorded prediction. Keeping the old one
      // would lose the only proof the server has that a prediction was made.
      setTicket(result.ticket);
      setPredictResult(result);
      setReasoning(submission.reasoning);
    } catch (err) {
      if (isOrderingRefusal(err)) {
        setOrdering(errorMessage(err));
      } else {
        setPredictError(errorMessage(err));
      }
    } finally {
      setPredicting(false);
    }
  }

  async function submitObservation() {
    if (!ticket || !observation.trim()) {
      return;
    }
    setObserving(true);
    setObserveError(null);
    setOrdering(null);
    try {
      const result = await observePoe(ticket, observation.trim());
      setTicket(result.ticket);
      setObserveResult(result);
    } catch (err) {
      if (isOrderingRefusal(err)) {
        setOrdering(errorMessage(err));
      } else {
        setObserveError(errorMessage(err));
      }
    } finally {
      setObserving(false);
    }
  }

  async function submitExplanation() {
    if (!ticket || !explainChoice) {
      return;
    }
    setExplaining(true);
    setExplainError(null);
    setOrdering(null);
    try {
      const result = await explainPoe(ticket, explainChoice, reflection.trim());
      setTicket(result.ticket);
      setExplainResult(result);
    } catch (err) {
      if (isOrderingRefusal(err)) {
        setOrdering(errorMessage(err));
      } else {
        setExplainError(errorMessage(err));
      }
    } finally {
      setExplaining(false);
    }
  }

  return (
    <Page>
      <Link
        href="/simulations"
        className="text-sm text-muted-foreground hover:underline"
      >
        Back to all simulations
      </Link>

      <h1 className="mb-1 mt-3 text-2xl font-bold tracking-tight">
        {start?.scenario_title || itemId}
      </h1>
      <p className="mb-6 font-mono text-xs text-muted-foreground">{itemId}</p>

      {loading && <LoadingPanel label="Opening the activity." />}
      {!loading && loadError && <ErrorPanel message={loadError} />}

      {!loading && !loadError && start && (
        <div className="space-y-6">
          <Card>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Pill tone="neutral">{start.node}</Pill>
              {kind ? (
                <Pill tone="brand">{kind}</Pill>
              ) : (
                <Pill tone="amber">scenario kind unknown</Pill>
              )}
              <span className="font-mono text-xs text-muted-foreground">
                {start.scenario}
              </span>
            </div>

            <p className="text-[15px] leading-relaxed text-card-foreground">
              {start.scenario_description}
            </p>

            <ol className="mt-4 flex flex-wrap items-center gap-2">
              {STEP_LABELS.map((entry) => (
                <li key={entry.key}>
                  <Pill tone={entry.key === step ? 'brand' : 'neutral'}>
                    {entry.label}
                  </Pill>
                </li>
              ))}
            </ol>

            <p className="mt-4 border-t border-border pt-4 text-sm text-muted-foreground">
              This attempt is carried by a ticket the server issued when the
              activity opened. Every step sends it back, which is how the server
              knows a prediction was recorded. Leaving this page drops the
              ticket, and the activity would have to start again from the
              prediction.
            </p>
          </Card>

          {ordering && (
            <Card className="border-amber-400 dark:border-amber-600">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-300">
                The server refused that step
              </p>
              <p className="text-[15px] leading-relaxed text-card-foreground">
                {ordering}
              </p>
              <button
                type="button"
                onClick={restart}
                className="mt-4 inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                Start this activity again
              </button>
            </Card>
          )}

          {step === 'predict' && !kind && (
            <EmptyState
              title="This activity names a scenario the catalogue does not list"
              detail="Without the scenario the page cannot say whether the result is a titration curve or an equilibrium shift, so it does not guess. Nothing is rendered in its place."
            />
          )}

          {/* Predict. The Simulator is given an empty series and no labels,
              because there is no simulation data on this page yet. */}
          {step === 'predict' && kind && (
            <>
              <Simulator
                scenario={kind}
                series={[]}
                xLabel=""
                yLabel=""
                phase="predict"
                options={start.options}
                predictPrompt={start.prompt}
                onPredict={handlePredict}
              />
              {predicting && (
                <LoadingPanel label="Recording your prediction." />
              )}
              {predictError && <ErrorPanel message={predictError} />}
            </>
          )}

          {predictResult && (
            <PredictionCard result={predictResult} reasoning={reasoning} />
          )}

          {step !== 'predict' && titration && kind && (
            <>
              <Simulator
                scenario={kind}
                series={series}
                xLabel={titration.x_label}
                yLabel={titration.y_label}
                phase="observed"
                onObserve={(value) => setReading(value)}
              />
              <TitrationFacts result={titration} />
            </>
          )}

          {step !== 'predict' && equilibrium && (
            <EquilibriumTable result={equilibrium} />
          )}

          {step === 'observe' && predictResult && (
            <Card>
              <SectionTitle>Observe</SectionTitle>
              <p className="text-[15px] leading-relaxed text-card-foreground">
                {predictResult.observe_prompt}
              </p>

              {reading !== null && titration && (
                <p className="mt-3 rounded-lg border border-border p-3 text-sm text-card-foreground">
                  You read {titration.y_label} = {formatNumber(reading)} at the
                  point you selected on the curve. Write down what you saw in
                  your own words below.
                </p>
              )}

              <label
                htmlFor="observation"
                className="mb-2 mt-4 block text-sm font-medium text-card-foreground"
              >
                What you saw
              </label>
              <textarea
                id="observation"
                value={observation}
                onChange={(event) => setObservation(event.target.value)}
                rows={4}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
              />

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => void submitObservation()}
                  disabled={observing || !observation.trim()}
                  className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                >
                  {observing ? 'Recording' : 'Record my observation'}
                </button>
                <span className="text-sm text-muted-foreground">
                  This step is not scored.
                </span>
              </div>

              {observeError && (
                <p className="mt-3 text-sm text-red-700 dark:text-red-300">
                  {observeError}
                </p>
              )}
            </Card>
          )}

          {observeResult && (
            <Card>
              <SectionTitle>Observation recorded</SectionTitle>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Pill tone="neutral">not graded</Pill>
              </div>
              <p className="text-[15px] leading-relaxed text-card-foreground">
                {observeResult.note}
              </p>
              {observation.trim() && (
                <p className="mt-3 whitespace-pre-wrap rounded-lg border border-border p-3 text-sm text-card-foreground">
                  {observation.trim()}
                </p>
              )}
            </Card>
          )}

          {step === 'explain' && observeResult && (
            <Card>
              <SectionTitle>Explain</SectionTitle>
              <p className="text-[15px] leading-relaxed text-card-foreground">
                {observeResult.prompt}
              </p>

              {observeResult.options.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">
                  This step returned no options, so there is nothing to select.
                </p>
              ) : (
                <fieldset className="mt-4">
                  <legend className="sr-only">Select a mechanism</legend>
                  <div className="space-y-2">
                    {observeResult.options.map((option) => (
                      <label
                        key={option.id}
                        className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 text-sm transition-colors hover:border-brand-500"
                      >
                        <input
                          type="radio"
                          name="explain-choice"
                          value={option.id}
                          checked={explainChoice === option.id}
                          onChange={(event) =>
                            setExplainChoice(event.target.value)
                          }
                          className="mt-0.5 h-4 w-4 accent-brand-600"
                        />
                        <span className="text-card-foreground">
                          {option.text}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              <label
                htmlFor="reflection"
                className="mb-2 mt-5 block text-sm font-medium text-card-foreground"
              >
                {observeResult.reflection_prompt}
              </label>
              <textarea
                id="reflection"
                value={reflection}
                onChange={(event) => setReflection(event.target.value)}
                rows={4}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
              />

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => void submitExplanation()}
                  disabled={explaining || !explainChoice}
                  className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                >
                  {explaining ? 'Submitting' : 'Submit my explanation'}
                </button>
                <span className="text-sm text-muted-foreground">
                  The selection is graded. The writing is not.
                </span>
              </div>

              {explainError && (
                <p className="mt-3 text-sm text-red-700 dark:text-red-300">
                  {explainError}
                </p>
              )}
            </Card>
          )}

          {explainResult && (
            <ExplanationCard result={explainResult} reflection={reflection} />
          )}

          {step === 'done' && (
            <button
              type="button"
              onClick={restart}
              className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              Run this activity again
            </button>
          )}
        </div>
      )}
    </Page>
  );
}

// The graded prediction. This is the first moment correctness is on screen, and
// it only appears because the learner has already committed.
function PredictionCard({
  result,
  reasoning,
}: {
  result: PoePredictResult;
  reasoning: string;
}) {
  return (
    <Card>
      <SectionTitle>Your prediction</SectionTitle>

      <div className="flex flex-wrap items-center gap-3">
        <Pill tone={result.is_correct ? 'green' : 'red'}>
          {result.is_correct ? 'Correct' : 'Not correct'}
        </Pill>
        <span className="text-sm text-muted-foreground">
          score {result.score.toFixed(2)}
        </span>
        {result.verified_by && (
          <Pill tone="green">key verified by {result.verified_by}</Pill>
        )}
      </div>

      {result.detail && (
        <p className="mt-3 text-[15px] leading-relaxed text-card-foreground">
          {result.detail}
        </p>
      )}

      {result.misconception && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-300">
            Named misconception identified
          </p>
          <p className="mt-1 font-mono text-sm text-amber-900 dark:text-amber-200">
            {result.misconception}
          </p>
        </div>
      )}

      {reasoning && (
        <div className="mt-4 border-t border-border pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            The reasoning you wrote
          </p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-card-foreground">
            {reasoning}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            This is kept on this page for you to compare against. It is not sent
            to the server and it is not scored.
          </p>
        </div>
      )}
    </Card>
  );
}

// The facts that came back with the curve. Every one of them is a field of the
// response, not a reading taken off the picture.
function TitrationFacts({ result }: { result: TitrationResult }) {
  const landmarks = Object.entries(result.landmarks);

  return (
    <Card>
      <SectionTitle>What was simulated</SectionTitle>
      <p className="text-[15px] leading-relaxed text-card-foreground">
        {result.description}
      </p>

      <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Analyte
          </dt>
          <dd className="mt-0.5 text-sm text-card-foreground">
            {result.analyte}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Titrant
          </dt>
          <dd className="mt-0.5 text-sm text-card-foreground">
            {result.titrant}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            pKa
          </dt>
          <dd className="mt-0.5 text-sm text-card-foreground">
            {result.pka === null
              ? 'No pKa applies. The analyte is treated as a strong acid.'
              : formatNumber(result.pka)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Points on the curve
          </dt>
          <dd className="mt-0.5 text-sm tabular-nums text-card-foreground">
            {result.curve.length}
          </dd>
        </div>
      </dl>

      {landmarks.length > 0 && (
        <div className="mt-4 border-t border-border pt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Landmarks
          </p>
          <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {landmarks.map(([name, value]) => (
              <div key={name} className="flex justify-between gap-4">
                <dt className="font-mono text-xs text-muted-foreground">
                  {name}
                </dt>
                <dd className="text-sm tabular-nums text-card-foreground">
                  {formatNumber(value)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {result.source && (
        <p className="mt-4 border-t border-border pt-4 text-sm text-muted-foreground">
          Source for the equilibrium constant used: {result.source}
        </p>
      )}
    </Card>
  );
}

// An equilibrium result carries no curve, so none is drawn. The concentrations
// are shown as a table because that is the shape the data actually has, and
// inventing points to plot would be inventing data.
function EquilibriumTable({ result }: { result: EquilibriumResult }) {
  const species = Array.from(
    new Set([
      ...Object.keys(result.before),
      ...Object.keys(result.stressed),
      ...Object.keys(result.after),
    ]),
  );
  const stressEntries = Object.entries(result.stress);

  return (
    <Card>
      <SectionTitle>What the simulation did</SectionTitle>
      <p className="text-[15px] leading-relaxed text-card-foreground">
        {result.description}
      </p>
      <p className="mt-3 text-sm text-muted-foreground">
        This scenario has no curve to plot. It is a single shift from one
        equilibrium position to another, so the concentrations are given as
        numbers rather than as a line through points that were never computed.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Pill tone="brand">shift: {result.direction}</Pill>
        <span className="font-mono text-xs text-muted-foreground">
          {result.label}
        </span>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[28rem] text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2 pr-4 font-medium text-muted-foreground">
                Species
              </th>
              <th className="py-2 pr-4 font-medium text-muted-foreground">
                Before
              </th>
              <th className="py-2 pr-4 font-medium text-muted-foreground">
                Stressed
              </th>
              <th className="py-2 font-medium text-muted-foreground">After</th>
            </tr>
          </thead>
          <tbody>
            {species.map((name) => (
              <tr key={name} className="border-b border-border last:border-0">
                <td className="py-2 pr-4 font-mono text-xs text-card-foreground">
                  {name}
                </td>
                <td className="py-2 pr-4 tabular-nums text-card-foreground">
                  {name in result.before
                    ? formatNumber(result.before[name])
                    : 'no value'}
                </td>
                <td className="py-2 pr-4 tabular-nums text-card-foreground">
                  {name in result.stressed
                    ? formatNumber(result.stressed[name])
                    : 'no value'}
                </td>
                <td className="py-2 tabular-nums text-card-foreground">
                  {name in result.after
                    ? formatNumber(result.after[name])
                    : 'no value'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Concentrations are in the units the engine works in, mol/L.
      </p>

      <dl className="mt-5 grid gap-x-6 gap-y-3 border-t border-border pt-4 sm:grid-cols-3">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Q before
          </dt>
          <dd className="mt-0.5 text-sm tabular-nums text-card-foreground">
            {formatNumber(result.q_before)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            K
          </dt>
          <dd className="mt-0.5 text-sm tabular-nums text-card-foreground">
            {formatNumber(result.k)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Q after
          </dt>
          <dd className="mt-0.5 text-sm tabular-nums text-card-foreground">
            {formatNumber(result.q_after)}
          </dd>
        </div>
      </dl>

      <p className="mt-3 text-sm text-muted-foreground">
        Q is the reaction quotient computed from the concentrations in the table
        above. K is the equilibrium constant the engine was given. Compare the
        two numbers yourself before reading the direction off the badge.
      </p>

      <div className="mt-4 border-t border-border pt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Stress applied
        </p>
        {stressEntries.length === 0 ? (
          <p className="mt-1 text-sm text-card-foreground">
            No concentration was changed. The stress record came back empty.
          </p>
        ) : (
          <ul className="mt-1 space-y-1 text-sm text-card-foreground">
            {stressEntries.map(([name, value]) => (
              <li key={name} className="tabular-nums">
                <span className="font-mono text-xs">{name}</span>{' '}
                {formatNumber(value)}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-2 text-sm text-muted-foreground">
          Extent of the shift: {formatNumber(result.extent)}.
        </p>
      </div>

      {result.source && (
        <p className="mt-4 border-t border-border pt-4 text-sm text-muted-foreground">
          Source for the equilibrium constant used: {result.source}
        </p>
      )}
    </Card>
  );
}

// The graded explanation. The selection is scored, the writing is not, and the
// server says so in its own words rather than this page asserting it.
function ExplanationCard({
  result,
  reflection,
}: {
  result: PoeExplainResult;
  reflection: string;
}) {
  return (
    <Card>
      <SectionTitle>Your explanation</SectionTitle>

      <div className="flex flex-wrap items-center gap-3">
        <Pill tone={result.is_correct ? 'green' : 'red'}>
          {result.is_correct ? 'Correct' : 'Not correct'}
        </Pill>
        <span className="text-sm text-muted-foreground">
          score {result.score.toFixed(2)}
        </span>
        <span className="text-sm text-muted-foreground">
          {result.prediction_was_correct
            ? 'Your prediction for this activity was correct.'
            : 'Your prediction for this activity was not correct.'}
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
            Named misconception identified
          </p>
          <p className="mt-1 font-mono text-sm text-amber-900 dark:text-amber-200">
            {result.misconception}
          </p>
        </div>
      )}

      <div className="mt-4 border-t border-border pt-4">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Pill tone="neutral">
            {result.reflection.recorded
              ? 'reflection recorded'
              : 'no reflection written'}
          </Pill>
          <Pill tone="neutral">not graded</Pill>
        </div>
        <p className="text-sm text-muted-foreground">{result.reflection.note}</p>
        {reflection.trim() && (
          <p className="mt-3 whitespace-pre-wrap rounded-lg border border-border p-3 text-sm text-card-foreground">
            {reflection.trim()}
          </p>
        )}
      </div>
    </Card>
  );
}
