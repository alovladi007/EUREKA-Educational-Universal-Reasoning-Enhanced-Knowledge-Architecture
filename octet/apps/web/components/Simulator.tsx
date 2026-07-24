'use client';

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';

/**
 * Predict, observe, explain simulator.
 *
 * The binding rule of this component: while the phase is predict, the curve is
 * not rendered at all. It is not hidden with CSS and it is not blurred. The SVG
 * is never mounted, so there is nothing to reveal in the DOM. A learner who has
 * seen the answer cannot make a prediction, and a prediction that follows the
 * result teaches nothing.
 *
 * The chart is plain inline SVG. No chart library is used.
 */

export interface SeriesPoint {
  x: number;
  y: number;
}

export type SimulatorScenario = 'titration' | 'equilibrium';
export type SimulatorPhase = 'predict' | 'running' | 'observed';

/** One selectable prediction. The id is what the server grades. */
export interface PredictionOption {
  id: string;
  text: string;
}

export interface PredictionSubmission {
  /** The graded commitment. Null only when the item offered no options. */
  choice: string | null;
  /** Free text reasoning. Recorded, never scored. */
  reasoning: string;
}

export interface SimulatorProps {
  scenario: SimulatorScenario;
  series: SeriesPoint[];
  xLabel: string;
  yLabel: string;
  phase: SimulatorPhase;
  /**
   * Selectable outcomes. When supplied, the graded prediction is a choice from
   * this list and the free text field becomes optional reasoning.
   *
   * The split is deliberate. A selection can be graded deterministically
   * against what the simulation actually does, and free text cannot be, because
   * this platform has no reviewed rubric for grading a written chemistry
   * explanation. Scoring the prose would mean inventing a judgement.
   */
  options?: PredictionOption[];
  /** Question shown above the options, from the item rather than this file. */
  predictPrompt?: string;
  onPredict?: (submission: PredictionSubmission) => void;
  onObserve?: (value: number) => void;
}

const VIEW_W = 720;
const VIEW_H = 400;
const MARGIN = { top: 24, right: 28, bottom: 56, left: 72 };
const PLOT_W = VIEW_W - MARGIN.left - MARGIN.right;
const PLOT_H = VIEW_H - MARGIN.top - MARGIN.bottom;

const SCENARIO_COPY: Record<
  SimulatorScenario,
  { title: string; predictPrompt: string }
> = {
  titration: {
    title: 'Titration simulator',
    predictPrompt:
      'Before the curve appears, describe the shape you expect. Where does the measured quantity change fastest, and what value do you expect at the equivalence point? Give your reasoning, not just a number.',
  },
  equilibrium: {
    title: 'Equilibrium simulator',
    predictPrompt:
      'Before the curve appears, predict what the disturbance does. Which way does the position of equilibrium move, what happens to each concentration, and why?',
  },
};

const PHASE_STEPS: Array<{ key: SimulatorPhase; label: string }> = [
  { key: 'predict', label: 'Predict' },
  { key: 'running', label: 'Run' },
  { key: 'observed', label: 'Observe' },
];

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return '';
  const abs = Math.abs(value);
  if (abs !== 0 && (abs < 0.001 || abs >= 100000)) return value.toExponential(2);
  return String(Math.round(value * 1000) / 1000);
}

/** Tick values on a 1, 2, 5 times power of ten progression. */
function niceTicks(min: number, max: number, target: number): number[] {
  if (!Number.isFinite(min) || !Number.isFinite(max) || min === max) return [min];
  const rawStep = (max - min) / Math.max(1, target);
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const normalised = rawStep / magnitude;
  const step =
    (normalised <= 1 ? 1 : normalised <= 2 ? 2 : normalised <= 5 ? 5 : 10) *
    magnitude;

  const ticks: number[] = [];
  const first = Math.ceil(min / step) * step;
  for (let value = first; value <= max + step * 1e-9; value += step) {
    ticks.push(Number(value.toPrecision(12)));
    if (ticks.length > 24) break;
  }
  return ticks;
}

export default function Simulator({
  scenario,
  series,
  xLabel,
  yLabel,
  phase,
  options,
  predictPrompt,
  onPredict,
  onObserve,
}: SimulatorProps) {
  const copy = SCENARIO_COPY[scenario] ?? SCENARIO_COPY.titration;
  const predictionFieldId = useId();
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [prediction, setPrediction] = useState('');
  const [choice, setChoice] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const points = useMemo(() => {
    if (!Array.isArray(series)) return [];
    return series
      .filter(
        (point) =>
          point !== null &&
          point !== undefined &&
          Number.isFinite(Number(point.x)) &&
          Number.isFinite(Number(point.y)),
      )
      .map((point) => ({ x: Number(point.x), y: Number(point.y) }))
      .sort((a, b) => a.x - b.x);
  }, [series]);

  const droppedCount = (Array.isArray(series) ? series.length : 0) - points.length;

  const chart = useMemo(() => {
    if (points.length === 0) return null;

    const xs = points.map((point) => point.x);
    const ys = points.map((point) => point.y);
    let xMin = Math.min(...xs);
    let xMax = Math.max(...xs);
    let yMin = Math.min(...ys);
    let yMax = Math.max(...ys);

    if (xMin === xMax) {
      xMin -= 0.5;
      xMax += 0.5;
    }
    if (yMin === yMax) {
      yMin -= 0.5;
      yMax += 0.5;
    } else {
      const pad = (yMax - yMin) * 0.08;
      yMin -= pad;
      yMax += pad;
    }

    const toX = (value: number) =>
      MARGIN.left + ((value - xMin) / (xMax - xMin)) * PLOT_W;
    const toY = (value: number) =>
      MARGIN.top + PLOT_H - ((value - yMin) / (yMax - yMin)) * PLOT_H;

    const path = points
      .map(
        (point, index) =>
          `${index === 0 ? 'M' : 'L'}${toX(point.x).toFixed(2)},${toY(point.y).toFixed(2)}`,
      )
      .join(' ');

    return {
      toX,
      toY,
      path,
      xTicks: niceTicks(xMin, xMax, 5),
      yTicks: niceTicks(yMin, yMax, 5),
    };
  }, [points]);

  // A new phase or a new data set invalidates any reading the learner took.
  useEffect(() => {
    setSelectedIndex(null);
  }, [phase, points]);

  const selectedPoint =
    selectedIndex !== null && selectedIndex >= 0 && selectedIndex < points.length
      ? points[selectedIndex]
      : null;

  function handleChartClick(event: React.MouseEvent<SVGSVGElement>) {
    if (phase !== 'observed' || !chart || points.length === 0) return;
    const svg = svgRef.current;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    if (rect.width === 0) return;

    // The viewBox keeps its aspect ratio, so one scale factor converts a screen
    // position back into viewBox units.
    const scale = VIEW_W / rect.width;
    const clickX = (event.clientX - rect.left) * scale;

    let bestIndex = 0;
    let bestDistance = Number.POSITIVE_INFINITY;
    points.forEach((point, index) => {
      const distance = Math.abs(chart.toX(point.x) - clickX);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    });
    setSelectedIndex(bestIndex);
  }

  const hasOptions = Boolean(options && options.length > 0);
  // With options present the choice is the commitment and the prose is
  // optional. Without them the prose is all there is, so it is required.
  const canSubmitPrediction = hasOptions
    ? Boolean(choice)
    : Boolean(prediction.trim());

  function handlePredictionSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmitPrediction || !onPredict) return;
    onPredict({ choice: hasOptions ? choice : null, reasoning: prediction.trim() });
  }

  const chartLabel = `Line chart of ${yLabel} against ${xLabel}. ${points.length} data points.`;

  return (
    <section
      className="w-full rounded-lg border border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      aria-label={copy.title}
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-700">
        <h2 className="text-sm font-semibold">{copy.title}</h2>
        <ol className="flex items-center gap-1.5 text-xs" aria-label="Progress">
          {PHASE_STEPS.map((step) => {
            const active = step.key === phase;
            return (
              <li key={step.key}>
                <span
                  aria-current={active ? 'step' : undefined}
                  className={[
                    'rounded-full px-2.5 py-1 font-medium',
                    active
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
                  ].join(' ')}
                >
                  {step.label}
                </span>
              </li>
            );
          })}
        </ol>
      </header>

      <div className="p-4">
        {phase === 'predict' ? (
          <div>
            <div className="rounded-md border border-brand-300 bg-brand-50 p-4 dark:border-brand-700 dark:bg-brand-900/30">
              <p className="text-sm font-semibold text-brand-900 dark:text-brand-100">
                The curve is not on this page yet, on purpose.
              </p>
              <p className="mt-1 text-sm text-brand-900/90 dark:text-brand-100/90">
                Commit to a prediction first. Comparing what you expected with
                what happened is where the learning is, and that comparison is
                only possible if the prediction comes first.
              </p>
            </div>

            <form className="mt-4" onSubmit={handlePredictionSubmit}>
              {hasOptions && (
                <fieldset className="mb-4">
                  <legend className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    Your prediction
                  </legend>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    {predictPrompt ?? copy.predictPrompt}
                  </p>
                  <div className="mt-2 space-y-2">
                    {options!.map((option) => (
                      <label
                        key={option.id}
                        className="flex cursor-pointer items-start gap-3 rounded-md border border-slate-300 p-3 text-sm transition hover:border-brand-500 dark:border-slate-600"
                      >
                        <input
                          type="radio"
                          name={`${predictionFieldId}-choice`}
                          value={option.id}
                          checked={choice === option.id}
                          onChange={() => setChoice(option.id)}
                          className="mt-0.5"
                        />
                        <span className="text-slate-800 dark:text-slate-200">
                          {option.text}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              <label
                htmlFor={predictionFieldId}
                className="block text-sm font-medium text-slate-800 dark:text-slate-200"
              >
                {hasOptions ? 'Your reasoning (optional)' : 'Your prediction'}
              </label>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {hasOptions
                  ? 'Say why you chose that. This is recorded for you to look back on and is not scored.'
                  : predictPrompt ?? copy.predictPrompt}
              </p>
              <textarea
                id={predictionFieldId}
                value={prediction}
                onChange={(event) => setPrediction(event.target.value)}
                rows={5}
                className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
                placeholder="I expect the curve to do this, because"
              />

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={!canSubmitPrediction || !onPredict}
                  className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-slate-900"
                >
                  Record my prediction
                </button>
                {!onPredict && (
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    No prediction handler is wired to this simulator yet, so the
                    prediction cannot be recorded.
                  </span>
                )}
              </div>
            </form>
          </div>
        ) : (
          <div>
            {points.length === 0 ? (
              <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-950">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  The simulation returned no data points.
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Nothing is plotted rather than drawing an empty set of axes
                  that looks like a result.
                </p>
              </div>
            ) : (
              <>
                {phase === 'running' && (
                  <p
                    className="mb-2 text-xs font-medium text-brand-700 dark:text-brand-300"
                    role="status"
                  >
                    Running. Watch the shape against what you predicted.
                  </p>
                )}

                <svg
                  ref={svgRef}
                  viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
                  className={[
                    'h-auto w-full rounded-md border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950',
                    phase === 'observed' ? 'cursor-crosshair' : '',
                  ].join(' ')}
                  role="img"
                  aria-label={chartLabel}
                  onClick={handleChartClick}
                >
                  {/* Axes and ticks */}
                  <g
                    className="text-slate-400 dark:text-slate-500"
                    stroke="currentColor"
                    strokeWidth="1"
                  >
                    <line
                      x1={MARGIN.left}
                      y1={MARGIN.top + PLOT_H}
                      x2={MARGIN.left + PLOT_W}
                      y2={MARGIN.top + PLOT_H}
                    />
                    <line
                      x1={MARGIN.left}
                      y1={MARGIN.top}
                      x2={MARGIN.left}
                      y2={MARGIN.top + PLOT_H}
                    />
                  </g>

                  {chart?.xTicks.map((tick) => {
                    const x = chart.toX(tick);
                    if (x < MARGIN.left - 1 || x > MARGIN.left + PLOT_W + 1) {
                      return null;
                    }
                    return (
                      <g key={`x-${tick}`}>
                        <line
                          x1={x}
                          y1={MARGIN.top + PLOT_H}
                          x2={x}
                          y2={MARGIN.top + PLOT_H + 6}
                          className="text-slate-400 dark:text-slate-500"
                          stroke="currentColor"
                          strokeWidth="1"
                        />
                        <line
                          x1={x}
                          y1={MARGIN.top}
                          x2={x}
                          y2={MARGIN.top + PLOT_H}
                          className="text-slate-200 dark:text-slate-800"
                          stroke="currentColor"
                          strokeWidth="1"
                        />
                        <text
                          x={x}
                          y={MARGIN.top + PLOT_H + 20}
                          textAnchor="middle"
                          className="fill-slate-600 text-[12px] dark:fill-slate-400"
                        >
                          {formatNumber(tick)}
                        </text>
                      </g>
                    );
                  })}

                  {chart?.yTicks.map((tick) => {
                    const y = chart.toY(tick);
                    if (y < MARGIN.top - 1 || y > MARGIN.top + PLOT_H + 1) {
                      return null;
                    }
                    return (
                      <g key={`y-${tick}`}>
                        <line
                          x1={MARGIN.left - 6}
                          y1={y}
                          x2={MARGIN.left}
                          y2={y}
                          className="text-slate-400 dark:text-slate-500"
                          stroke="currentColor"
                          strokeWidth="1"
                        />
                        <line
                          x1={MARGIN.left}
                          y1={y}
                          x2={MARGIN.left + PLOT_W}
                          y2={y}
                          className="text-slate-200 dark:text-slate-800"
                          stroke="currentColor"
                          strokeWidth="1"
                        />
                        <text
                          x={MARGIN.left - 10}
                          y={y + 4}
                          textAnchor="end"
                          className="fill-slate-600 text-[12px] dark:fill-slate-400"
                        >
                          {formatNumber(tick)}
                        </text>
                      </g>
                    );
                  })}

                  {/* Axis labels */}
                  <text
                    x={MARGIN.left + PLOT_W / 2}
                    y={VIEW_H - 12}
                    textAnchor="middle"
                    className="fill-slate-700 text-[13px] font-medium dark:fill-slate-300"
                  >
                    {xLabel}
                  </text>
                  <text
                    x={16}
                    y={MARGIN.top + PLOT_H / 2}
                    textAnchor="middle"
                    transform={`rotate(-90 16 ${MARGIN.top + PLOT_H / 2})`}
                    className="fill-slate-700 text-[13px] font-medium dark:fill-slate-300"
                  >
                    {yLabel}
                  </text>

                  {/* The series */}
                  {chart && (
                    <path
                      d={chart.path}
                      fill="none"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-brand-600 dark:text-brand-400"
                      stroke="currentColor"
                    />
                  )}

                  {/* Reading taken by the learner */}
                  {chart && selectedPoint && (
                    <g>
                      <line
                        x1={MARGIN.left}
                        y1={chart.toY(selectedPoint.y)}
                        x2={chart.toX(selectedPoint.x)}
                        y2={chart.toY(selectedPoint.y)}
                        strokeDasharray="4 3"
                        strokeWidth="1.5"
                        className="text-amber-500"
                        stroke="currentColor"
                      />
                      <line
                        x1={chart.toX(selectedPoint.x)}
                        y1={chart.toY(selectedPoint.y)}
                        x2={chart.toX(selectedPoint.x)}
                        y2={MARGIN.top + PLOT_H}
                        strokeDasharray="4 3"
                        strokeWidth="1.5"
                        className="text-amber-500"
                        stroke="currentColor"
                      />
                      <circle
                        cx={chart.toX(selectedPoint.x)}
                        cy={chart.toY(selectedPoint.y)}
                        r="5"
                        className="fill-amber-500"
                        stroke="white"
                        strokeWidth="1.5"
                      />
                    </g>
                  )}
                </svg>

                {phase === 'observed' && (
                  <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      Take a reading
                    </p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      Click the curve to pick a point, or use the slider, then
                      submit the value you read off.
                    </p>

                    <div className="mt-3 flex flex-wrap items-end gap-4">
                      <div className="min-w-[14rem] flex-1">
                        <label
                          htmlFor={`${predictionFieldId}-reading`}
                          className="block text-xs font-medium text-slate-600 dark:text-slate-400"
                        >
                          Point on the curve
                        </label>
                        <input
                          id={`${predictionFieldId}-reading`}
                          type="range"
                          min={0}
                          max={Math.max(0, points.length - 1)}
                          step={1}
                          value={selectedIndex ?? 0}
                          onChange={(event) =>
                            setSelectedIndex(Number(event.target.value))
                          }
                          className="mt-2 w-full accent-brand-600"
                          aria-label="Select a point on the curve"
                          aria-valuetext={
                            selectedPoint
                              ? `${xLabel} ${formatNumber(selectedPoint.x)}, ${yLabel} ${formatNumber(selectedPoint.y)}`
                              : 'no point selected'
                          }
                        />
                      </div>

                      <p className="text-sm tabular-nums text-slate-800 dark:text-slate-200">
                        {selectedPoint ? (
                          <>
                            <span className="font-medium">{xLabel}:</span>{' '}
                            {formatNumber(selectedPoint.x)}
                            <span className="mx-2 text-slate-300 dark:text-slate-600">
                              |
                            </span>
                            <span className="font-medium">{yLabel}:</span>{' '}
                            {formatNumber(selectedPoint.y)}
                          </>
                        ) : (
                          <span className="text-slate-500 dark:text-slate-400">
                            No point selected yet.
                          </span>
                        )}
                      </p>

                      <button
                        type="button"
                        onClick={() => {
                          if (selectedPoint && onObserve) {
                            onObserve(selectedPoint.y);
                          }
                        }}
                        disabled={!selectedPoint || !onObserve}
                        className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-slate-900"
                      >
                        Submit this reading
                      </button>
                    </div>

                    {!onObserve && (
                      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        No observation handler is wired to this simulator yet, so
                        a reading cannot be submitted.
                      </p>
                    )}
                  </div>
                )}
              </>
            )}

            {droppedCount > 0 && (
              <p className="mt-3 text-xs text-amber-700 dark:text-amber-300">
                {droppedCount} supplied{' '}
                {droppedCount === 1 ? 'point was' : 'points were'} not numeric
                and {droppedCount === 1 ? 'is' : 'are'} not plotted.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
