'use client';

/**
 * Security+ Performance-Based Question (PBQ) runner.
 *
 * Renders interactive, simulation-style items — the drag/assign and ordering
 * tasks that appear on the real SY0-701 exam, which plain multiple-choice
 * items can't represent. Two interaction types are supported:
 *   - categorize: drag each token into the correct drop zone (with a
 *                 click-to-assign fallback for touch / keyboard).
 *   - order:      arrange steps into the correct sequence (drag to reorder,
 *                 or use the up/down arrows).
 *
 * Self-contained: uses only the shared UI primitives + the PBQ data module.
 */

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Lightbulb,
  Puzzle,
} from 'lucide-react';
import {
  SECURITY_PLUS_PBQS,
  type PBQ,
  type CategorizePBQ,
  type OrderPBQ,
} from '@/lib/security-plus-pbq-data';

// Fisher–Yates; only ever called client-side (in an effect), so no SSR mismatch.
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─────────────────────────────────────────────────────────────────────────
// Categorize (drag tokens into drop zones)
// ─────────────────────────────────────────────────────────────────────────
function CategorizeRunner({ pbq }: { pbq: CategorizePBQ }) {
  const emptyPlacement = () =>
    Object.fromEntries(pbq.tokens.map((t) => [t.id, null as string | null]));
  const [placement, setPlacement] = useState<Record<string, string | null>>(emptyPlacement);
  const [selected, setSelected] = useState<string | null>(null); // click-to-assign
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCat, setOverCat] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const reset = () => {
    setPlacement(emptyPlacement());
    setSelected(null);
    setChecked(false);
  };

  const assign = (tokenId: string, catId: string | null) => {
    if (checked) return;
    setPlacement((p) => ({ ...p, [tokenId]: catId }));
    setSelected(null);
  };

  const tokenById = (id: string) => pbq.tokens.find((t) => t.id === id)!;
  const pool = pbq.tokens.filter((t) => placement[t.id] === null);
  const placedCount = pbq.tokens.length - pool.length;
  const score = pbq.tokens.filter((t) => placement[t.id] === t.answer).length;

  const tokenChip = (tokenId: string, placedCatId: string | null) => {
    const t = tokenById(tokenId);
    const isSelected = selected === tokenId;
    let verdict: 'none' | 'right' | 'wrong' = 'none';
    if (checked && placedCatId !== null) verdict = placedCatId === t.answer ? 'right' : 'wrong';
    return (
      <button
        key={tokenId}
        type="button"
        draggable={!checked}
        onDragStart={() => setDragId(tokenId)}
        onDragEnd={() => setDragId(null)}
        onClick={() => {
          if (checked) return;
          if (placedCatId !== null) assign(tokenId, null); // click a placed token → back to pool
          else setSelected(isSelected ? null : tokenId);
        }}
        className={[
          'group flex items-center gap-2 rounded-lg border-2 px-3 py-2 text-left text-sm transition-all',
          checked ? 'cursor-default' : 'cursor-grab active:cursor-grabbing',
          verdict === 'right'
            ? 'border-green-500 bg-green-50 dark:bg-green-950/30'
            : verdict === 'wrong'
              ? 'border-red-500 bg-red-50 dark:bg-red-950/30'
              : isSelected
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 ring-2 ring-indigo-300'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-indigo-400',
        ].join(' ')}
      >
        {!checked && <GripVertical className="h-4 w-4 shrink-0 text-gray-400" />}
        {verdict === 'right' && <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />}
        {verdict === 'wrong' && <XCircle className="h-4 w-4 shrink-0 text-red-600" />}
        <span>{t.label}</span>
      </button>
    );
  };

  return (
    <div className="space-y-4">
      {/* Unassigned pool */}
      <div
        onDragOver={(e) => { if (!checked) e.preventDefault(); }}
        onDrop={() => dragId && assign(dragId, null)}
        className="rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-3"
      >
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Items ({pool.length} left) — {selected ? 'now click a category' : 'drag or tap an item, then a category'}
        </p>
        <div className="flex flex-wrap gap-2">
          {pool.length === 0 ? (
            <span className="text-xs text-muted-foreground italic">All items placed.</span>
          ) : (
            pool.map((t) => tokenChip(t.id, null))
          )}
        </div>
      </div>

      {/* Category drop zones */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {pbq.categories.map((cat) => {
          const items = pbq.tokens.filter((t) => placement[t.id] === cat.id);
          return (
            <div
              key={cat.id}
              onDragOver={(e) => { if (!checked) { e.preventDefault(); setOverCat(cat.id); } }}
              onDragLeave={() => setOverCat((c) => (c === cat.id ? null : c))}
              onDrop={() => { if (dragId) assign(dragId, cat.id); setOverCat(null); }}
              onClick={() => { if (selected) assign(selected, cat.id); }}
              className={[
                'min-h-[92px] rounded-xl border-2 p-3 transition-colors',
                overCat === cat.id
                  ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/30'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900/40',
                selected ? 'cursor-pointer hover:border-indigo-400' : '',
              ].join(' ')}
            >
              <p className="mb-2 text-sm font-bold text-gray-800 dark:text-gray-200">{cat.label}</p>
              <div className="flex flex-wrap gap-2">
                {items.map((t) => tokenChip(t.id, cat.id))}
              </div>
            </div>
          );
        })}
      </div>

      <PBQFooter
        canCheck={placedCount === pbq.tokens.length}
        checked={checked}
        score={score}
        total={pbq.tokens.length}
        onCheck={() => setChecked(true)}
        onReset={reset}
        explanation={pbq.explanation}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Order (arrange steps into sequence)
// ─────────────────────────────────────────────────────────────────────────
function OrderRunner({ pbq }: { pbq: OrderPBQ }) {
  const [order, setOrder] = useState<string[]>(pbq.items.map((i) => i.id));
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  // Shuffle after mount only (avoids SSR/hydration mismatch).
  useEffect(() => {
    setOrder(shuffle(pbq.items.map((i) => i.id)));
    setChecked(false);
  }, [pbq.id]);

  const reset = () => { setOrder(shuffle(pbq.items.map((i) => i.id))); setChecked(false); };

  const move = (from: number, to: number) => {
    if (checked || to < 0 || to >= order.length) return;
    setOrder((o) => {
      const n = [...o];
      const [x] = n.splice(from, 1);
      n.splice(to, 0, x);
      return n;
    });
  };

  const labelOf = (id: string) => pbq.items.find((i) => i.id === id)!.label;
  const correctCount = order.filter((id, i) => id === pbq.answer[i]).length;

  return (
    <div className="space-y-4">
      <ol className="space-y-2">
        {order.map((id, i) => {
          const right = checked && pbq.answer[i] === id;
          const wrong = checked && pbq.answer[i] !== id;
          return (
            <li
              key={id}
              draggable={!checked}
              onDragStart={() => setDragIdx(i)}
              onDragEnd={() => setDragIdx(null)}
              onDragOver={(e) => { if (!checked) e.preventDefault(); }}
              onDrop={() => { if (dragIdx !== null) move(dragIdx, i); setDragIdx(null); }}
              className={[
                'flex items-center gap-3 rounded-lg border-2 px-3 py-2.5 transition-all',
                checked ? 'cursor-default' : 'cursor-grab active:cursor-grabbing',
                right
                  ? 'border-green-500 bg-green-50 dark:bg-green-950/30'
                  : wrong
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/30'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-indigo-400',
              ].join(' ')}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                {i + 1}
              </span>
              {!checked && <GripVertical className="h-4 w-4 shrink-0 text-gray-400" />}
              {right && <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />}
              {wrong && <XCircle className="h-4 w-4 shrink-0 text-red-600" />}
              <span className="flex-1 text-sm">{labelOf(id)}</span>
              {!checked && (
                <span className="flex shrink-0 flex-col">
                  <button type="button" aria-label="Move up" onClick={() => move(i, i - 1)} disabled={i === 0}
                    className="text-gray-400 hover:text-indigo-600 disabled:opacity-30">
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button type="button" aria-label="Move down" onClick={() => move(i, i + 1)} disabled={i === order.length - 1}
                    className="text-gray-400 hover:text-indigo-600 disabled:opacity-30">
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </span>
              )}
            </li>
          );
        })}
      </ol>

      <PBQFooter
        canCheck
        checked={checked}
        score={correctCount}
        total={pbq.answer.length}
        onCheck={() => setChecked(true)}
        onReset={reset}
        explanation={pbq.explanation}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Shared footer: Check / Reset + score + explanation
// ─────────────────────────────────────────────────────────────────────────
function PBQFooter({
  canCheck, checked, score, total, onCheck, onReset, explanation,
}: {
  canCheck: boolean; checked: boolean; score: number; total: number;
  onCheck: () => void; onReset: () => void; explanation: string;
}) {
  const perfect = score === total;
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        {!checked ? (
          <Button onClick={onCheck} disabled={!canCheck} className="gap-2">
            <CheckCircle2 className="h-4 w-4" /> Check answer
          </Button>
        ) : (
          <Badge
            className={perfect
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-sm px-3 py-1'
              : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 text-sm px-3 py-1'}
          >
            {perfect ? 'Correct!' : 'Review'} — {score}/{total} placed correctly
          </Badge>
        )}
        <Button variant="outline" onClick={onReset} className="gap-2">
          <RotateCcw className="h-4 w-4" /> Reset
        </Button>
      </div>
      {checked && (
        <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-950/20 p-4">
          <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-blue-900 dark:text-blue-200">
            <Lightbulb className="h-4 w-4" /> Explanation
          </div>
          <p className="text-sm leading-relaxed text-blue-900/90 dark:text-blue-100/90">{explanation}</p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Tab: PBQ picker + active runner
// ─────────────────────────────────────────────────────────────────────────
export function SecurityPlusPBQTab() {
  const pbqs: PBQ[] = SECURITY_PLUS_PBQS;
  const [activeIdx, setActiveIdx] = useState(0);
  const pbq = pbqs[activeIdx];

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white">
        <div className="flex items-center gap-2">
          <Puzzle className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Performance-Based Questions</h2>
        </div>
        <p className="mt-1 text-sm text-indigo-100">
          Interactive drag-and-drop simulations, like the PBQs on the real SY0-701 exam.
          Place every item, then check your answer.
        </p>
      </div>

      {/* PBQ selector */}
      <div className="flex flex-wrap gap-2">
        {pbqs.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setActiveIdx(i)}
            className={[
              'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
              i === activeIdx
                ? 'border-indigo-500 bg-indigo-600 text-white'
                : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:border-indigo-400',
            ].join(' ')}
          >
            {i + 1}. {p.title}
          </button>
        ))}
      </div>

      {/* Active PBQ */}
      <Card className="p-6">
        <div className="mb-4">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="text-xs">{pbq.domainName}</Badge>
            <Badge variant="outline" className="text-xs capitalize">{pbq.type === 'order' ? 'Ordering' : 'Drag & drop'}</Badge>
          </div>
          <h3 className="text-lg font-bold">{pbq.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{pbq.scenario}</p>
          <p className="mt-2 text-sm font-medium text-indigo-700 dark:text-indigo-300">{pbq.instructions}</p>
        </div>

        {pbq.type === 'categorize'
          ? <CategorizeRunner key={pbq.id} pbq={pbq} />
          : <OrderRunner key={pbq.id} pbq={pbq} />}
      </Card>
    </div>
  );
}

export default SecurityPlusPBQTab;
