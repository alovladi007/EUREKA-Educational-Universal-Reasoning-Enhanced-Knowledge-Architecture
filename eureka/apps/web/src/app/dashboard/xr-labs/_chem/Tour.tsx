'use client';

/**
 * The guided tour, and keyboard control of the 3D view.
 *
 * Both exist for the same reason: a learner who does not already know what to
 * look at gets nothing from a free-orbit camera. The tour tells them what the
 * mode is for and what to try; the keyboard controls mean the scene can be
 * operated at all without a mouse, which the labs previously could not be.
 *
 * The camera keys are announced in a live region rather than only being
 * available, because a control nobody can discover is not accessible either.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, HelpCircle, X } from 'lucide-react';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

export interface TourStep {
  title: string;
  body: string;
  /** Optional concrete thing to try, phrased as an instruction. */
  tryIt?: string;
}

export function TourOverlay({
  steps,
  storageKey,
}: {
  steps: TourStep[];
  /** Per-mode key, so finishing one tour does not silence the others. */
  storageKey: string;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [seen, setSeen] = useState(true);

  // Show automatically the first time a learner opens a mode, then never
  // again unless they ask. Anything more insistent is an obstacle.
  useEffect(() => {
    try {
      const done = window.localStorage.getItem(`xr-tour:${storageKey}`);
      setSeen(Boolean(done));
      if (!done) {
        setOpen(true);
        setIndex(0);
      }
    } catch {
      // Private mode or storage disabled: just do not auto-open.
      setSeen(true);
    }
  }, [storageKey]);

  const finish = useCallback(() => {
    setOpen(false);
    try {
      window.localStorage.setItem(`xr-tour:${storageKey}`, '1');
    } catch {
      // Nothing to do; the tour simply reappears next time.
    }
    setSeen(true);
  }, [storageKey]);

  if (!steps.length) return null;

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          setIndex(0);
          setOpen(true);
        }}
        className="pointer-events-auto flex items-center gap-1.5 rounded-md border border-white/10 bg-black/50 px-2.5 py-1.5 text-[11px] text-white/70 backdrop-blur-md transition-colors hover:bg-white/15 hover:text-white"
        title="What is this mode for?"
      >
        <HelpCircle className="h-3.5 w-3.5" />
        {seen ? 'Guide' : 'Start here'}
      </button>
    );
  }

  const step = steps[Math.min(index, steps.length - 1)];
  const last = index >= steps.length - 1;

  return (
    <div
      role="dialog"
      aria-label="Mode guide"
      className="pointer-events-auto w-80 rounded-lg border border-sky-400/30 bg-slate-950/95 p-4 shadow-xl backdrop-blur-md"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-sky-400">
            Step {index + 1} of {steps.length}
          </div>
          <h3 className="text-sm font-bold leading-tight">{step.title}</h3>
        </div>
        <button
          type="button"
          onClick={finish}
          aria-label="Close guide"
          className="rounded p-1 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <p className="text-xs leading-relaxed text-white/80">{step.body}</p>

      {step.tryIt && (
        <p className="mt-2 rounded border-l-2 border-sky-400/50 bg-sky-950/30 py-1.5 pl-2.5 pr-2 text-[11px] leading-relaxed text-sky-100">
          Try it: {step.tryIt}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="flex items-center gap-1 rounded px-2 py-1 text-[11px] text-white/60 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30"
        >
          <ChevronLeft className="h-3 w-3" />
          Back
        </button>
        <div className="flex gap-1">
          {steps.map((_, i) => (
            <span
              key={i}
              className={`h-1 w-1 rounded-full ${i === index ? 'bg-sky-400' : 'bg-white/20'}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => (last ? finish() : setIndex((i) => i + 1))}
          className="flex items-center gap-1 rounded bg-sky-500 px-2.5 py-1 text-[11px] font-semibold transition-colors hover:bg-sky-400"
        >
          {last ? 'Done' : 'Next'}
          {!last && <ChevronRight className="h-3 w-3" />}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Keyboard control
// ---------------------------------------------------------------------------

/**
 * Make the 3D view operable from the keyboard.
 *
 * OrbitControls is mouse and touch only, so before this the canvas was a dead
 * region for anyone not using a pointer -- in a platform that has an
 * accommodations track, which made it the wrong kind of inconsistency.
 *
 * Arrow keys orbit, +/- dolly, 0 resets. The handler only fires while the
 * canvas wrapper has focus, so it cannot steal arrow keys from the panels.
 */
export function useKeyboardOrbit(
  controlsRef: React.MutableRefObject<OrbitControlsImpl | null>,
  enabled = true,
) {
  const [announcement, setAnnounce] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const say = useCallback((msg: string) => {
    setAnnounce(msg);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAnnounce(''), 1200);
  }, []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!enabled) return;
      const c = controlsRef.current;
      if (!c) return;
      const STEP = 0.18;
      const ZOOM = 1.15;
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          // rotateLeft is not public API in every build; nudge the azimuth by
          // moving the camera around the target instead.
          orbit(c, -STEP, 0);
          say('rotated left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          orbit(c, STEP, 0);
          say('rotated right');
          break;
        case 'ArrowUp':
          e.preventDefault();
          orbit(c, 0, -STEP);
          say('rotated up');
          break;
        case 'ArrowDown':
          e.preventDefault();
          orbit(c, 0, STEP);
          say('rotated down');
          break;
        case '+':
        case '=':
          e.preventDefault();
          dolly(c, 1 / ZOOM);
          say('zoomed in');
          break;
        case '-':
        case '_':
          e.preventDefault();
          dolly(c, ZOOM);
          say('zoomed out');
          break;
        case '0':
          e.preventDefault();
          c.reset();
          say('view reset');
          break;
        default:
          break;
      }
    },
    [controlsRef, enabled, say],
  );

  return { onKeyDown, announcement };
}

/** Move the camera around its target by the given spherical deltas. */
function orbit(c: OrbitControlsImpl, dTheta: number, dPhi: number) {
  const cam = c.object;
  const target = c.target;
  const offset = cam.position.clone().sub(target);
  const radius = offset.length();
  let theta = Math.atan2(offset.x, offset.z);
  let phi = Math.acos(Math.max(-1, Math.min(1, offset.y / radius)));
  theta += dTheta;
  phi = Math.max(0.08, Math.min(Math.PI - 0.08, phi + dPhi));
  offset.set(
    radius * Math.sin(phi) * Math.sin(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.cos(theta),
  );
  cam.position.copy(target).add(offset);
  cam.lookAt(target);
  c.update();
}

function dolly(c: OrbitControlsImpl, factor: number) {
  const cam = c.object;
  const target = c.target;
  const offset = cam.position.clone().sub(target);
  const len = offset.length() * factor;
  const min = (c as unknown as { minDistance?: number }).minDistance ?? 0.5;
  const max = (c as unknown as { maxDistance?: number }).maxDistance ?? 500;
  offset.setLength(Math.max(min, Math.min(max, len)));
  cam.position.copy(target).add(offset);
  c.update();
}

/** The visible hint plus the live region the key handler announces into. */
export function KeyboardHint({ announcement }: { announcement: string }) {
  return (
    <>
      <div className="pointer-events-none rounded-md border border-white/10 bg-black/50 px-3 py-2 text-[11px] text-white/50 backdrop-blur-md">
        drag or arrow keys to rotate, scroll or +/- to zoom, 0 to reset
      </div>
      <span aria-live="polite" className="sr-only">
        {announcement}
      </span>
    </>
  );
}
