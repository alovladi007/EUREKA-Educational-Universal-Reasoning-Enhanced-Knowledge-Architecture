'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Chemical structure editor backed by Ketcher.
 *
 * Ketcher is SSR unsafe, so the standalone struct service and the React editor
 * are both pulled in with dynamic imports inside an effect.
 *
 * If either import fails the component does not leave the learner staring at an
 * empty box. It falls back to a plain SMILES text field and says why.
 */

export interface SketcherProps {
  onChange: (smiles: string) => void;
  initialSmiles?: string;
}

type SketcherMode = 'loading' | 'editor' | 'fallback';

const SYNC_DEBOUNCE_MS = 400;

export default function Sketcher({ onChange, initialSmiles }: SketcherProps) {
  const [mode, setMode] = useState<SketcherMode>('loading');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [currentSmiles, setCurrentSmiles] = useState<string>(initialSmiles ?? '');
  const [manualSmiles, setManualSmiles] = useState<string>(initialSmiles ?? '');
  const [notice, setNotice] = useState<string | null>(null);

  const [EditorComponent, setEditorComponent] = useState<any>(null);
  const [structServiceProvider, setStructServiceProvider] = useState<any>(null);

  const ketcherRef = useRef<any>(null);
  const subscriptionRef = useRef<any>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  // Held in a ref so the change subscription never captures a stale callback
  // and never has to be torn down when the parent re-renders.
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // Neither package may be evaluated on the server, and neither ships
        // type declarations this project can rely on.
        // @ts-ignore
        const standalone: any = await import('ketcher-standalone');
        // @ts-ignore
        const reactBindings: any = await import('ketcher-react');

        try {
          // @ts-ignore
          await import('ketcher-react/dist/index.css');
        } catch (err) {
          // The editor still works unstyled, so a missing stylesheet is not
          // worth dropping to the fallback for.
        }

        if (cancelled) return;

        const Provider =
          standalone?.StandaloneStructServiceProvider ??
          standalone?.default?.StandaloneStructServiceProvider;
        const Editor = reactBindings?.Editor ?? reactBindings?.default?.Editor;

        if (typeof Provider !== 'function' || !Editor) {
          throw new Error(
            'Ketcher loaded but did not expose StandaloneStructServiceProvider and Editor.',
          );
        }

        setStructServiceProvider(new Provider());
        // Stored through an updater so React does not treat the component as a
        // state setter function.
        setEditorComponent(() => Editor);
        setMode('editor');
      } catch (err) {
        if (cancelled) return;
        setLoadError(err instanceof Error ? err.message : String(err));
        setMode('fallback');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      const ketcher = ketcherRef.current;
      const subscriber = subscriptionRef.current;
      if (ketcher && subscriber) {
        try {
          ketcher.editor.unsubscribe('change', subscriber);
        } catch (err) {
          // The editor was already torn down.
        }
      }
      ketcherRef.current = null;
      subscriptionRef.current = null;
    };
  }, []);

  const readSmiles = useCallback(async (): Promise<string | null> => {
    const ketcher = ketcherRef.current;
    if (!ketcher || typeof ketcher.getSmiles !== 'function') return null;
    try {
      const smiles = await ketcher.getSmiles();
      return typeof smiles === 'string' ? smiles : '';
    } catch (err) {
      return null;
    }
  }, []);

  const scheduleSync = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const smiles = await readSmiles();
      if (!mountedRef.current || smiles === null) return;
      setCurrentSmiles(smiles);
      onChangeRef.current(smiles);
    }, SYNC_DEBOUNCE_MS);
  }, [readSmiles]);

  const handleKetcherInit = useCallback(
    (ketcher: any) => {
      ketcherRef.current = ketcher;

      if (initialSmiles) {
        try {
          const result = ketcher.setMolecule(initialSmiles);
          if (result && typeof result.catch === 'function') {
            result.catch(() => {
              if (mountedRef.current) {
                setNotice(
                  'The starting structure could not be loaded into the editor. The canvas begins empty.',
                );
              }
            });
          }
        } catch (err) {
          setNotice(
            'The starting structure could not be loaded into the editor. The canvas begins empty.',
          );
        }
      }

      try {
        subscriptionRef.current = ketcher.editor.subscribe('change', () => {
          scheduleSync();
        });
      } catch (err) {
        setNotice(
          'Live structure updates are unavailable in this build. Use the button below to submit the structure.',
        );
      }
    },
    [initialSmiles, scheduleSync],
  );

  const handleUseStructure = useCallback(async () => {
    if (mode === 'fallback') {
      const value = manualSmiles.trim();
      setCurrentSmiles(value);
      onChangeRef.current(value);
      return;
    }

    const smiles = await readSmiles();
    if (smiles === null) {
      setNotice('The structure could not be read from the editor. Try again.');
      return;
    }
    setNotice(null);
    setCurrentSmiles(smiles);
    onChangeRef.current(smiles);
  }, [manualSmiles, mode, readSmiles]);

  return (
    <section
      className="w-full rounded-lg border border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      aria-label="Chemical structure editor"
    >
      <header className="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
        <h2 className="text-sm font-semibold">Draw the structure</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Build the molecule, then submit it. The structure you draw is what gets
          graded.
        </p>
      </header>

      <div className="p-4">
        {mode === 'loading' && (
          <div
            className="flex h-[28rem] items-center justify-center rounded-md border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-950"
            role="status"
          >
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Loading the structure editor.
            </p>
          </div>
        )}

        {mode === 'editor' && EditorComponent && structServiceProvider && (
          <div className="h-[28rem] w-full overflow-hidden rounded-md border border-slate-200 dark:border-slate-700">
            <EditorComponent
              staticResourcesUrl=""
              structServiceProvider={structServiceProvider}
              errorHandler={(message: string) => {
                setNotice(String(message));
              }}
              onInit={handleKetcherInit}
            />
          </div>
        )}

        {mode === 'fallback' && (
          <div className="rounded-md border border-amber-400 bg-amber-50 p-4 dark:border-amber-500/60 dark:bg-amber-950/30">
            <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
              The drawing editor could not be loaded, so it has been replaced
              with a text field.
            </p>
            <p className="mt-1 text-sm text-amber-800 dark:text-amber-200/90">
              Type the structure as SMILES instead. Reported reason:{' '}
              {loadError || 'unknown'}.
            </p>

            <label
              htmlFor="octet-sketcher-fallback"
              className="mt-4 block text-xs font-medium text-amber-900 dark:text-amber-200"
            >
              SMILES
            </label>
            <input
              id="octet-sketcher-fallback"
              type="text"
              value={manualSmiles}
              onChange={(event) => setManualSmiles(event.target.value)}
              spellCheck={false}
              autoComplete="off"
              placeholder="For example CCO"
              className="mt-1 w-full rounded-md border border-amber-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-amber-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
        )}

        {notice && (
          <p
            className="mt-3 text-xs text-amber-700 dark:text-amber-300"
            role="status"
          >
            {notice}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Current structure
            </p>
            <code className="mt-0.5 block max-w-full overflow-x-auto whitespace-pre rounded bg-slate-100 px-2 py-1 font-mono text-xs text-slate-800 dark:bg-slate-800 dark:text-slate-100">
              {currentSmiles || 'nothing drawn yet'}
            </code>
          </div>

          <button
            type="button"
            onClick={handleUseStructure}
            disabled={mode === 'loading'}
            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-slate-900"
          >
            Use this structure
          </button>
        </div>
      </div>
    </section>
  );
}
