'use client';

import React, { useMemo } from 'react';
import katex from 'katex';
// mhchem extends KaTeX with the \ce command, so it must be imported after it.
import 'katex/contrib/mhchem';
import 'katex/dist/katex.min.css';

/**
 * Johnstone triangle view.
 *
 * The three panels are three descriptions of one event: what the learner sees,
 * what the particles are doing, and what chemists write down. Learners who hold
 * these apart is the failure this view exists to prevent, so the link between
 * them is stated rather than implied.
 *
 * When an asset is not supplied the panel says so. No stand in image is
 * invented, because a wrong particle diagram teaches a wrong particle model.
 */

export interface TriangleMacroscopic {
  caption: string;
  asset?: string;
}

export interface TriangleParticulate {
  caption: string;
  asset?: string;
}

export interface TriangleSymbolic {
  caption: string;
  /** A KaTeX string. mhchem markup such as \ce{2H2 + O2 -> 2H2O} is supported. */
  equation: string;
}

export interface TriangleViewProps {
  macroscopic: TriangleMacroscopic;
  particulate: TriangleParticulate;
  symbolic: TriangleSymbolic;
  nodeTitle: string;
}

const PANEL_BASE =
  'flex min-w-0 flex-1 flex-col rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900';

function Connector() {
  return (
    <div
      aria-hidden="true"
      className="flex items-center justify-center py-1 text-slate-400 md:py-0 dark:text-slate-500"
    >
      <svg
        viewBox="0 0 40 12"
        className="h-3 w-8 rotate-90 md:rotate-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 6h32" />
        <path d="M8 2.5 4 6l4 3.5" />
        <path d="M32 2.5 36 6l-4 3.5" />
      </svg>
    </div>
  );
}

interface AssetPanelProps {
  label: string;
  index: number;
  caption: string;
  asset?: string;
  assetKind: string;
}

function AssetPanel({ label, index, caption, asset, assetKind }: AssetPanelProps) {
  return (
    <section className={PANEL_BASE} aria-label={label}>
      <header className="mb-3 flex items-center gap-2">
        <span
          aria-hidden="true"
          className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-800 dark:bg-brand-900 dark:text-brand-100"
        >
          {index}
        </span>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {label}
        </h3>
      </header>

      <div className="flex flex-1 items-center justify-center">
        {asset ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={asset}
            alt={caption}
            className="max-h-56 w-full rounded-md object-contain"
          />
        ) : (
          <div className="flex h-40 w-full flex-col items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-center dark:border-slate-600 dark:bg-slate-950">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
              The {assetKind} is not supplied yet.
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Nothing is drawn in its place, because an invented diagram would
              teach an invented model.
            </p>
          </div>
        )}
      </div>

      <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">{caption}</p>
    </section>
  );
}

export default function TriangleView({
  macroscopic,
  particulate,
  symbolic,
  nodeTitle,
}: TriangleViewProps) {
  const equationHtml = useMemo(() => {
    const source = symbolic?.equation;
    if (!source) return null;
    try {
      return katex.renderToString(source, {
        throwOnError: false,
        displayMode: true,
        output: 'html',
        strict: false,
      });
    } catch (err) {
      return null;
    }
  }, [symbolic?.equation]);

  return (
    <section
      className="w-full text-slate-900 dark:text-slate-100"
      aria-label={`Three views of ${nodeTitle}`}
    >
      <header className="mb-3">
        <h2 className="text-lg font-semibold">{nodeTitle}</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          These are three views of one thing, not three separate topics. The
          bench observation, the particle picture and the written equation all
          describe the same event. Chemistry gets hard when they come apart, so
          read across all three before moving on.
        </p>
      </header>

      <div className="flex flex-col md:flex-row md:items-stretch md:gap-2">
        <AssetPanel
          label="What you see"
          index={1}
          caption={macroscopic?.caption ?? ''}
          asset={macroscopic?.asset}
          assetKind="macroscopic image"
        />

        <Connector />

        <AssetPanel
          label="What the particles do"
          index={2}
          caption={particulate?.caption ?? ''}
          asset={particulate?.asset}
          assetKind="particulate diagram"
        />

        <Connector />

        <section className={PANEL_BASE} aria-label="What we write">
          <header className="mb-3 flex items-center gap-2">
            <span
              aria-hidden="true"
              className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-800 dark:bg-brand-900 dark:text-brand-100"
            >
              3
            </span>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              What we write
            </h3>
          </header>

          <div className="flex flex-1 items-center justify-center">
            {equationHtml ? (
              <div
                className="w-full overflow-x-auto px-1 py-2 text-center"
                dangerouslySetInnerHTML={{ __html: equationHtml }}
              />
            ) : symbolic?.equation ? (
              <div className="w-full rounded-md border border-dashed border-amber-400 bg-amber-50 p-3 text-center dark:border-amber-500/60 dark:bg-amber-950/30">
                <p className="text-xs font-medium text-amber-900 dark:text-amber-200">
                  The equation could not be typeset. It is shown as written.
                </p>
                <code className="mt-2 block overflow-x-auto font-mono text-xs text-amber-900 dark:text-amber-100">
                  {symbolic.equation}
                </code>
              </div>
            ) : (
              <div className="flex h-40 w-full flex-col items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-center dark:border-slate-600 dark:bg-slate-950">
                <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  No equation is supplied yet.
                </p>
              </div>
            )}
          </div>

          <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
            {symbolic?.caption ?? ''}
          </p>
        </section>
      </div>
    </section>
  );
}
