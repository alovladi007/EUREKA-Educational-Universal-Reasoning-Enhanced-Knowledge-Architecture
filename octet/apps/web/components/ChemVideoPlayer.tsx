'use client';

/**
 * The lesson video player.
 *
 * Same chrome as the prep test reader's player - a dark stage, a centre play
 * button, a control bar with play/pause, a scrub track, elapsed and total
 * time, speed, captions and fullscreen - driving an animated chemistry scene
 * instead of a media file. See chem-scenes.tsx for why the scene is computed
 * rather than recorded.
 *
 * The timeline is driven by requestAnimationFrame off a wall-clock delta, not
 * by counting frames. Counting frames makes playback speed depend on the
 * display refresh rate, so the same 34 second animation runs at 34 seconds on
 * a 60 Hz panel and 17 on a 120 Hz one. The delta is also clamped: when a tab
 * is backgrounded rAF stops firing and the first frame back carries a delta of
 * however many seconds elapsed, which would jump the animation to the end.
 */

import {
  Maximize,
  Pause,
  Play,
  RotateCcw,
  Settings,
  Subtitles,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SCENES } from '@/components/chem-scenes';

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

function fmt(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export default function ChemVideoPlayer({
  scene,
  title,
  seconds,
  summary,
}: {
  scene: string;
  title: string;
  seconds: number;
  summary: string;
}) {
  const def = SCENES[scene];
  const wrapRef = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(0); // normalised 0..1
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [speedOpen, setSpeedOpen] = useState(false);
  const [captions, setCaptions] = useState(true);
  const [started, setStarted] = useState(false);

  // The animation loop. `speed` is read through a ref so changing it does not
  // tear down and restart the loop mid-playback, which would drop a frame and
  // visibly stutter.
  const speedRef = useRef(speed);
  speedRef.current = speed;
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) {
      lastRef.current = null;
      return;
    }
    const step = (now: number) => {
      if (lastRef.current === null) lastRef.current = now;
      // Clamp the delta. A backgrounded tab stops firing rAF and returns with
      // a delta of seconds, which without this jumps straight to the end.
      const dt = Math.min(0.1, (now - lastRef.current) / 1000);
      lastRef.current = now;
      setT((prev) => {
        const next = prev + (dt * speedRef.current) / seconds;
        if (next >= 1) {
          setPlaying(false);
          return 1;
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, seconds]);

  const toggle = useCallback(() => {
    setStarted(true);
    setPlaying((p) => {
      // Pressing play at the end restarts rather than doing nothing, which is
      // what every media player does and what people expect.
      if (!p && t >= 1) setT(0);
      return !p;
    });
  }, [t]);

  const restart = useCallback(() => {
    setT(0);
    setPlaying(true);
    setStarted(true);
  }, []);

  const fullscreen = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void el.requestFullscreen?.().catch(() => {});
  }, []);

  if (!def) {
    // A scene id in the lesson data with no scene behind it. Say so rather
    // than render an empty stage; the depth gate also fails on this, so it
    // should never reach a learner.
    return (
      <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
        This lesson names an animation ({scene}) that is not built yet.
      </div>
    );
  }

  const { caption, svg } = def.frame(Math.min(1, Math.max(0, t)));
  const elapsed = t * seconds;

  return (
    <div
      ref={wrapRef}
      className="overflow-hidden rounded-xl border border-border bg-slate-950"
    >
      {/* stage */}
      <div className="relative">
        <svg
          viewBox={def.viewBox}
          className="block w-full"
          style={{ aspectRatio: '620 / 300' }}
          role="img"
          aria-label={summary}
        >
          {/* Scenes carry their own stage colours - see chem-scenes.tsx. */}
          {svg}
        </svg>

        {!started && (
          <button
            type="button"
            onClick={toggle}
            className="absolute inset-0 flex items-center justify-center bg-slate-950/45 transition-colors hover:bg-slate-950/30"
            aria-label={`Play ${title}`}
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-lg">
              <Play className="ml-1 h-7 w-7 text-slate-900" fill="currentColor" />
            </span>
          </button>
        )}

        {captions && started && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent px-4 pb-3 pt-8">
            <p className="mx-auto max-w-[46rem] text-center text-[13.5px] leading-snug text-slate-100">
              {caption}
            </p>
          </div>
        )}
      </div>

      {/* control bar */}
      <div className="border-t border-white/10 px-3 py-2">
        <input
          type="range"
          min={0}
          max={1000}
          value={Math.round(t * 1000)}
          onChange={(e) => {
            setStarted(true);
            setT(Number(e.target.value) / 1000);
          }}
          aria-label="Seek"
          className="h-1 w-full cursor-pointer appearance-none rounded bg-white/20 accent-brand-500"
        />
        <div className="mt-2 flex items-center gap-2 text-slate-200">
          <button
            type="button"
            onClick={toggle}
            className="rounded p-1 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-brand-500"
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </button>
          <button
            type="button"
            onClick={restart}
            className="rounded p-1 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-brand-500"
            aria-label="Restart"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <span className="font-mono text-xs tabular-nums text-slate-300">
            {fmt(elapsed)} / {fmt(seconds)}
          </span>

          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCaptions((c) => !c)}
              className={`rounded p-1 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                captions ? 'text-brand-400' : 'text-slate-400'
              }`}
              aria-label="Toggle captions"
              aria-pressed={captions}
            >
              <Subtitles className="h-4 w-4" />
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setSpeedOpen((o) => !o)}
                className="flex items-center gap-1 rounded px-1.5 py-1 text-xs hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-brand-500"
                aria-label="Playback speed"
                aria-expanded={speedOpen}
              >
                <Settings className="h-4 w-4" />
                <span className="tabular-nums">{speed}×</span>
              </button>
              {speedOpen && (
                <ul className="absolute bottom-full right-0 z-10 mb-1 min-w-[4.5rem] overflow-hidden rounded-lg border border-white/15 bg-slate-900 py-1 shadow-xl">
                  {SPEEDS.map((s) => (
                    <li key={s}>
                      <button
                        type="button"
                        onClick={() => {
                          setSpeed(s);
                          setSpeedOpen(false);
                        }}
                        className={`block w-full px-3 py-1 text-left text-xs hover:bg-white/10 ${
                          s === speed ? 'text-brand-400' : 'text-slate-200'
                        }`}
                      >
                        {s}×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              type="button"
              onClick={fullscreen}
              className="rounded p-1 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-label="Fullscreen"
            >
              <Maximize className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
