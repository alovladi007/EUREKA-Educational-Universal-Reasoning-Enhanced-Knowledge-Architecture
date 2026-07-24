'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

/**
 * 3D molecule viewer backed by 3Dmol.js.
 *
 * 3Dmol touches window and WebGL on import, so the library is pulled in with a
 * dynamic import inside an effect and never runs during server rendering.
 *
 * A SMILES string carries connectivity, not coordinates. When only SMILES is
 * supplied this component says so and renders nothing in 3D, rather than
 * inventing a geometry the learner might read as real.
 */

export type MolStyle = 'stick' | 'sphere' | 'ball-and-stick';

export interface MolViewerProps {
  smiles?: string;
  sdf?: string;
  name?: string;
  style?: MolStyle;
}

/** The part of the state that only the loading lifecycle can change. */
type LoadState = 'idle' | 'loading' | 'ready' | 'error';
type ViewerStatus = LoadState | 'no-coordinates' | 'empty';

const STYLE_OPTIONS: Array<{ value: MolStyle; label: string }> = [
  { value: 'stick', label: 'Stick' },
  { value: 'ball-and-stick', label: 'Ball and stick' },
  { value: 'sphere', label: 'Space filling' },
];

function styleSpec(style: MolStyle): Record<string, unknown> {
  if (style === 'stick') return { stick: { radius: 0.15 } };
  if (style === 'sphere') return { sphere: {} };
  return { stick: { radius: 0.12 }, sphere: { scale: 0.28 } };
}

export default function MolViewer({
  smiles,
  sdf,
  name,
  style = 'ball-and-stick',
}: MolViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<any>(null);

  const [representation, setRepresentation] = useState<MolStyle>(style);
  const [spinning, setSpinning] = useState(false);
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Bumped once a model is loaded so the style and spin effects re-apply
  // against the new viewer instance.
  const [modelTick, setModelTick] = useState(0);

  // Whether coordinates exist at all is a fact about the props, so it is
  // derived during render rather than set from an effect. Effects do not run on
  // the server, and a viewer that renders an empty box until hydration would be
  // exactly the silent blank this component is meant to avoid.
  const status: ViewerStatus = !sdf
    ? smiles
      ? 'no-coordinates'
      : 'empty'
    : loadState;

  useEffect(() => {
    setRepresentation(style);
  }, [style]);

  useEffect(() => {
    if (!sdf) {
      viewerRef.current = null;
      setLoadState('idle');
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    setLoadState('loading');
    setErrorMessage(null);

    (async () => {
      try {
        // 3Dmol does not ship type declarations in every published build, and
        // it must not be evaluated on the server.
        // @ts-ignore
        const imported = await import('3dmol');
        if (cancelled) return;

        const lib: any = (imported as any)?.default ?? imported;
        if (!lib || typeof lib.createViewer !== 'function') {
          throw new Error('3Dmol loaded but exposed no createViewer function.');
        }

        container.innerHTML = '';
        const viewer = lib.createViewer(container, {
          backgroundColor: 'transparent',
        });
        viewer.addModel(sdf, 'sdf');
        viewer.setStyle({}, styleSpec(representation));
        viewer.zoomTo();
        viewer.render();

        if (cancelled) {
          try {
            viewer.clear();
          } catch (err) {
            // The viewer was torn down mid load. Nothing further to release.
          }
          return;
        }

        viewerRef.current = viewer;
        setLoadState('ready');
        setModelTick((tick) => tick + 1);
      } catch (err) {
        if (cancelled) return;
        viewerRef.current = null;
        setErrorMessage(err instanceof Error ? err.message : String(err));
        setLoadState('error');
      }
    })();

    return () => {
      cancelled = true;
      const viewer = viewerRef.current;
      viewerRef.current = null;
      if (viewer) {
        try {
          viewer.spin(false);
          viewer.clear();
        } catch (err) {
          // Already released by the library. Safe to ignore.
        }
      }
      container.innerHTML = '';
    };
    // representation is applied by its own effect, so it is deliberately not a
    // dependency here. Rebuilding the whole viewer on a style change would drop
    // the camera the learner set.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sdf]);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || status !== 'ready') return;
    try {
      viewer.setStyle({}, styleSpec(representation));
      viewer.render();
    } catch (err) {
      // A style change on a released viewer is not worth failing the panel for.
    }
  }, [representation, status, modelTick]);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || status !== 'ready') return;
    try {
      viewer.spin(spinning ? 'y' : false);
    } catch (err) {
      // Older builds without spin support simply stay still.
    }
    return () => {
      try {
        viewerRef.current?.spin(false);
      } catch (err) {
        // Nothing to stop.
      }
    };
  }, [spinning, status, modelTick]);

  const resetView = useCallback(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    try {
      viewer.zoomTo();
      viewer.render();
    } catch (err) {
      // Ignore a reset on a viewer that is no longer live.
    }
  }, []);

  const showCanvas = Boolean(sdf) && status !== 'error';
  const controlsDisabled = status !== 'ready';

  return (
    <section
      className="w-full rounded-lg border border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      aria-label={name ? `3D viewer for ${name}` : '3D molecule viewer'}
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-700">
        <div>
          <h2 className="text-sm font-semibold">{name || 'Molecule'}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Drag to rotate. Scroll to zoom.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div
            className="inline-flex overflow-hidden rounded-md border border-slate-300 dark:border-slate-600"
            role="group"
            aria-label="Representation"
          >
            {STYLE_OPTIONS.map((option) => {
              const active = representation === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setRepresentation(option.value)}
                  disabled={controlsDisabled}
                  aria-pressed={active}
                  className={[
                    'px-2.5 py-1 text-xs font-medium transition',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    active
                      ? 'bg-brand-600 text-white'
                      : 'bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700',
                  ].join(' ')}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setSpinning((value) => !value)}
            disabled={controlsDisabled}
            aria-pressed={spinning}
            aria-label={spinning ? 'Stop spinning the model' : 'Spin the model'}
            className={[
              'rounded-md border px-2.5 py-1 text-xs font-medium transition',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
              'disabled:cursor-not-allowed disabled:opacity-50',
              spinning
                ? 'border-brand-600 bg-brand-600 text-white'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700',
            ].join(' ')}
          >
            {spinning ? 'Stop spin' : 'Spin'}
          </button>

          <button
            type="button"
            onClick={resetView}
            disabled={controlsDisabled}
            aria-label="Reset the camera to fit the molecule"
            className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Reset view
          </button>
        </div>
      </header>

      <div className="p-4">
        {showCanvas && (
          <div className="relative h-[22rem] w-full overflow-hidden rounded-md border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-950">
            <div ref={containerRef} className="absolute inset-0" />
            {(status === 'loading' || status === 'idle') && (
              <p
                className="absolute inset-0 flex items-center justify-center text-sm text-slate-500 dark:text-slate-400"
                role="status"
              >
                Loading the 3D viewer.
              </p>
            )}
          </div>
        )}

        {status === 'no-coordinates' && (
          <div className="rounded-md border border-dashed border-amber-400 bg-amber-50 p-6 dark:border-amber-500/60 dark:bg-amber-950/30">
            <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
              No 3D coordinates were supplied for this molecule.
            </p>
            <p className="mt-2 text-sm text-amber-800 dark:text-amber-200/90">
              A SMILES string records which atoms are bonded to which, not where
              they sit in space. Rendering a shape from it here would be a guess
              presented as data, so nothing is drawn. Pass an SDF block with
              coordinates to see the structure in 3D.
            </p>
            <p className="mt-3 text-xs font-medium text-amber-900 dark:text-amber-200">
              SMILES supplied
            </p>
            <code className="mt-1 block overflow-x-auto rounded bg-amber-100 px-2 py-1 font-mono text-xs text-amber-900 dark:bg-amber-900/40 dark:text-amber-100">
              {smiles}
            </code>
          </div>
        )}

        {status === 'empty' && (
          <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-6 text-center dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              No structure was supplied.
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              The viewer renders once the page passes an SDF block.
            </p>
          </div>
        )}

        {status === 'error' && (
          <div
            className="rounded-md border border-red-300 bg-red-50 p-6 dark:border-red-700 dark:bg-red-950/40"
            role="alert"
          >
            <p className="text-sm font-medium text-red-900 dark:text-red-200">
              The 3D viewer could not be loaded.
            </p>
            <p className="mt-1 text-sm text-red-800 dark:text-red-200/90">
              Nothing is rendered rather than showing an empty box. Reported
              reason: {errorMessage || 'unknown'}.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
