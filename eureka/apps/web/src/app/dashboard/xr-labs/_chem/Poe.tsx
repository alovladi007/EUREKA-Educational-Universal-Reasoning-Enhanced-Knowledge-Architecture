'use client';

/**
 * Predict, observe, explain -- the loop that makes a lab ask something.
 *
 * Before this, both labs could be operated for fifteen minutes without ever
 * committing to an answer. OCTET's own lesson type says it plainly: reading
 * fluency is not learning. A viewer you cannot be wrong in front of is a
 * viewer, not an instrument.
 *
 * Two rules here are structural rather than stylistic, and both are lifted
 * from chem_core.prediction, which enforces them server side:
 *
 *   A prediction cannot be revised after observing. A prediction you can
 *   change once you have seen the answer is not a prediction, so the radio
 *   group is disabled the moment the simulation runs, and the original choice
 *   stays visible whether it was right or not.
 *
 *   Explain cannot be reached before observe. Explaining something you have
 *   not seen is guessing, so the explain step does not render until the
 *   observation has been recorded.
 *
 * A wrong prediction keys a named misconception from OCTET's library rather
 * than producing a bare "incorrect", so the outcome can route somewhere.
 *
 * The free-text reflection is stored and never scored. This platform has no
 * reviewed rubric for free-text chemistry explanation, and pretending to
 * grade one would be inventing a score.
 */

import { useCallback, useState } from 'react';
import { AlertTriangle, Check, Lock, X } from 'lucide-react';

import type { PoeItem, PoeOption, PoePhase } from './contentTypes';
import { PanelTitle } from './ui';

export interface PoeOutcome {
  itemId: string;
  node: string;
  predictionCorrect: boolean;
  predictionChoice: string;
  explanationCorrect: boolean;
  explanationChoice: string;
  /** Misconception codes the learner's wrong choices keyed, if any. */
  misconceptions: string[];
  reflection: string;
}

function OptionRow({
  option,
  selected,
  locked,
  isKey,
  revealed,
  onSelect,
  name,
}: {
  option: PoeOption;
  selected: boolean;
  locked: boolean;
  isKey: boolean;
  revealed: boolean;
  onSelect: () => void;
  name: string;
}) {
  // Colour only after the answer is revealed. Before that a selected option is
  // a commitment, not a claim about correctness.
  const tone = !revealed
    ? selected
      ? 'border-sky-400 bg-sky-500/15'
      : 'border-white/10 bg-white/5 hover:bg-white/10'
    : isKey
      ? 'border-emerald-400/60 bg-emerald-500/15'
      : selected
        ? 'border-rose-400/60 bg-rose-500/15'
        : 'border-white/10 bg-white/5 opacity-60';

  return (
    <label
      className={`flex cursor-pointer items-start gap-2.5 rounded-lg border p-2.5 transition-colors ${tone} ${
        locked ? 'cursor-default' : ''
      }`}
    >
      <input
        type="radio"
        name={name}
        checked={selected}
        disabled={locked}
        onChange={onSelect}
        className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-sky-400"
      />
      <span className="flex-1 text-xs leading-relaxed text-white/85">
        {option.text}
      </span>
      {revealed && isKey && (
        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
      )}
      {revealed && selected && !isKey && (
        <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-400" />
      )}
    </label>
  );
}

export function PoePanel({
  item,
  /** Called when the learner commits a prediction, so the scene can run. */
  onObserve,
  /** Called once the whole loop is finished, with what happened. */
  onComplete,
  /** Rendered between observe and explain: the result the learner is reading. */
  observation,
}: {
  item: PoeItem;
  onObserve: () => void;
  onComplete: (outcome: PoeOutcome) => void;
  observation?: React.ReactNode;
}) {
  const [phase, setPhase] = useState<PoePhase>('predict');
  const [prediction, setPrediction] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [reflection, setReflection] = useState('');

  const predictionLocked = phase !== 'predict';
  const predictionRevealed = phase === 'explain' || phase === 'done';
  const explanationRevealed = phase === 'done';

  const commitPrediction = useCallback(() => {
    if (!prediction) return;
    setPhase('observe');
    onObserve();
  }, [prediction, onObserve]);

  const commitObservation = useCallback(() => {
    setPhase('explain');
  }, []);

  const commitExplanation = useCallback(() => {
    if (!explanation || !prediction) return;
    setPhase('done');
    const predictionCorrect = prediction === item.predictKey;
    const explanationCorrect = explanation === item.explainKey;
    const misconceptions: string[] = [];
    if (!predictionCorrect) {
      const m = item.predictOptions.find((o) => o.id === prediction)?.misconception;
      if (m) misconceptions.push(m);
    }
    if (!explanationCorrect) {
      const m = item.explainOptions.find((o) => o.id === explanation)?.misconception;
      if (m) misconceptions.push(m);
    }
    onComplete({
      itemId: item.id,
      node: item.node,
      predictionCorrect,
      predictionChoice: prediction,
      explanationCorrect,
      explanationChoice: explanation,
      misconceptions,
      reflection,
    });
  }, [explanation, prediction, item, reflection, onComplete]);

  const chosenPredict = item.predictOptions.find((o) => o.id === prediction);
  const chosenExplain = item.explainOptions.find((o) => o.id === explanation);

  return (
    <div className="space-y-3">
      {/* Phase indicator. The order is the teaching, so it is visible. */}
      <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider">
        {(['predict', 'observe', 'explain'] as const).map((p, i) => {
          const done =
            (p === 'predict' && phase !== 'predict') ||
            (p === 'observe' && (phase === 'explain' || phase === 'done')) ||
            (p === 'explain' && phase === 'done');
          const active = phase === p;
          return (
            <span key={p} className="flex items-center gap-1">
              {i > 0 && <span className="text-white/20">-</span>}
              <span
                className={
                  active
                    ? 'text-sky-300'
                    : done
                      ? 'text-emerald-400/70'
                      : 'text-white/25'
                }
              >
                {p}
              </span>
            </span>
          );
        })}
      </div>

      {/* ---- Predict ---- */}
      <div className="rounded-lg border border-white/10 bg-white/5 p-3">
        <div className="mb-2 flex items-center gap-1.5">
          <PanelTitle>Predict</PanelTitle>
          {predictionLocked && <Lock className="mb-2 h-3 w-3 text-white/30" />}
        </div>
        <p className="mb-2.5 text-xs leading-relaxed text-white/80">
          {item.predictPrompt}
        </p>
        <div className="space-y-1.5">
          {item.predictOptions.map((o) => (
            <OptionRow
              key={o.id}
              option={o}
              name={`${item.id}-predict`}
              selected={prediction === o.id}
              locked={predictionLocked}
              isKey={o.id === item.predictKey}
              revealed={predictionRevealed}
              onSelect={() => setPrediction(o.id)}
            />
          ))}
        </div>

        {phase === 'predict' && (
          <button
            type="button"
            onClick={commitPrediction}
            disabled={!prediction}
            className="mt-3 w-full rounded-lg bg-sky-500 px-3 py-2 text-xs font-semibold transition-colors hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Commit and run it
          </button>
        )}

        {predictionLocked && (
          <p className="mt-2 text-[10px] text-white/40">
            Locked. A prediction you can change after seeing the answer is not a
            prediction.
          </p>
        )}

        {predictionRevealed && chosenPredict && (
          <p
            className={`mt-2 text-[11px] leading-relaxed ${
              prediction === item.predictKey ? 'text-emerald-300' : 'text-amber-300'
            }`}
          >
            {chosenPredict.feedback ||
              (prediction === item.predictKey
                ? 'Correct.'
                : 'Not what happens.')}
          </p>
        )}
      </div>

      {/* ---- Observe ---- */}
      {phase !== 'predict' && (
        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
          <PanelTitle>Observe</PanelTitle>
          <p className="mb-2 text-xs leading-relaxed text-white/80">
            {item.observePrompt}
          </p>
          {observation}
          {phase === 'observe' && (
            <button
              type="button"
              onClick={commitObservation}
              className="mt-3 w-full rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold transition-colors hover:bg-white/20"
            >
              I have read the result
            </button>
          )}
          <p className="mt-2 text-[10px] text-white/40">
            This step is not scored. Recording an observation is not a test.
          </p>
        </div>
      )}

      {/* ---- Explain ---- */}
      {(phase === 'explain' || phase === 'done') && (
        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
          <PanelTitle>Explain</PanelTitle>
          <p className="mb-2.5 text-xs leading-relaxed text-white/80">
            {item.explainPrompt}
          </p>
          <div className="space-y-1.5">
            {item.explainOptions.map((o) => (
              <OptionRow
                key={o.id}
                option={o}
                name={`${item.id}-explain`}
                selected={explanation === o.id}
                locked={phase === 'done'}
                isKey={o.id === item.explainKey}
                revealed={explanationRevealed}
                onSelect={() => setExplanation(o.id)}
              />
            ))}
          </div>

          {item.reflectionPrompt && (
            <div className="mt-3">
              <label className="mb-1 block text-[11px] text-white/60">
                {item.reflectionPrompt}
              </label>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                disabled={phase === 'done'}
                rows={3}
                className="w-full rounded-lg border border-white/10 bg-black/40 p-2 text-xs text-white placeholder:text-white/25 focus:border-sky-400 focus:outline-none disabled:opacity-60"
                placeholder="Optional. Stored, never scored."
              />
            </div>
          )}

          {phase === 'explain' && (
            <button
              type="button"
              onClick={commitExplanation}
              disabled={!explanation}
              className="mt-3 w-full rounded-lg bg-sky-500 px-3 py-2 text-xs font-semibold transition-colors hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Submit explanation
            </button>
          )}

          {explanationRevealed && chosenExplain && (
            <p
              className={`mt-2 text-[11px] leading-relaxed ${
                explanation === item.explainKey ? 'text-emerald-300' : 'text-amber-300'
              }`}
            >
              {chosenExplain.feedback ||
                (explanation === item.explainKey
                  ? 'Correct.'
                  : 'That is not the mechanism.')}
            </p>
          )}
        </div>
      )}

      {/* ---- Misconception routing ---- */}
      {phase === 'done' && (
        <MisconceptionNote
          codes={[
            ...(prediction !== item.predictKey
              ? [item.predictOptions.find((o) => o.id === prediction)?.misconception]
              : []),
            ...(explanation !== item.explainKey
              ? [item.explainOptions.find((o) => o.id === explanation)?.misconception]
              : []),
          ].filter(Boolean) as string[]}
        />
      )}

      {/* Provenance for the answer key.
          The verdict text names the outcome the simulation produced, which for
          these items is the answer in as many words: one of them reads
          "simulated equivalence pH is 8.728, which is above7" against a
          question whose options are below 7, exactly 7 and above 7. So the
          detail waits until the prediction is locked. Saying that the key was
          checked is safe at any point; saying what the check found is not. */}
      <p className="text-[10px] leading-relaxed text-white/35">
        {!item.keyVerified
          ? 'This item is authored rather than exported from a simulation, so its answer key was not mechanically checked. '
          : predictionLocked
            ? `Answer key checked against the simulation at build time: ${item.keyVerdict}.`
            : 'This item is bound to a simulation, and its answer key was checked against that simulation at build time. What the check found is hidden until you commit.'}
        {!item.keyVerified && item.keyVerdict}
      </p>
    </div>
  );
}

function MisconceptionNote({ codes }: { codes: string[] }) {
  if (!codes.length) return null;
  return (
    <div className="rounded-lg border border-amber-400/30 bg-amber-950/30 p-3">
      <div className="mb-1 flex items-center gap-1.5">
        <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-300">
          Worth revisiting
        </span>
      </div>
      <p className="text-[11px] leading-relaxed text-amber-200/80">
        Your answer matched a known misconception rather than being a random
        miss. That is more useful than a bare mark, because it says which idea
        to go back to.
      </p>
      <div className="mt-2 flex flex-wrap gap-1">
        {codes.map((c) => (
          <span
            key={c}
            className="rounded bg-amber-500/20 px-1.5 py-0.5 font-mono text-[10px] text-amber-200 ring-1 ring-amber-400/30"
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}
