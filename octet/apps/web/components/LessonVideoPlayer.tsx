'use client';

/**
 * The lesson video player.
 *
 * Ported from the prep test player (eureka/apps/web/src/components/test-prep/
 * LessonVideoPlayer.tsx) so a learner moving between the two modules gets the
 * same controls in the same places: dark stage, centre play button, seek with
 * a buffered track, back/forward ten, volume, elapsed, speed, captions,
 * picture-in-picture and fullscreen.
 *
 * IT PLAYS A FILE. That is the point.
 *
 * An earlier version of this drove a computed SVG animation instead of a media
 * file. That was the wrong call: the videos are being produced separately and
 * uploaded, so the slot has to be a real <video> pointing at a real asset.
 * This component takes `src` and plays it.
 *
 * WHEN THERE IS NO FILE YET
 *
 * `src` is null and the same chrome renders over a poster that says the video
 * is not up yet, which is the honest state and the one most nodes are in. The
 * controls disable rather than disappear, so the panel does not change shape
 * the day a file lands next to it.
 *
 * WHERE THE FILES GO
 *
 *   apps/web/public/videos/octet/{slug}.mp4
 *
 * The lesson data names the slug; nothing has to be rewired when a file
 * appears. Drop the mp4 in, rebuild the web image, and the poster is replaced
 * by the video. `scripts/check_octet_videos.py` lists which slugs are declared
 * and which of those have a file, so the gap is always countable.
 */

import {
  Maximize,
  Pause,
  PictureInPicture2,
  Play,
  RotateCcw,
  RotateCw,
  Settings,
  Subtitles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

function fmt(s: number): string {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
}

function IconBtn({
  label,
  onClick,
  disabled,
  active,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`rounded p-1 transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 disabled:opacity-40 ${
        active ? 'text-brand-400' : ''
      }`}
    >
      {children}
    </button>
  );
}

export default function LessonVideoPlayer({
  src,
  title,
  poster,
  captionsSrc,
}: {
  /** /videos/octet/{slug}.mp4, or null when the file is not uploaded yet. */
  src: string | null;
  title: string;
  poster?: string | null;
  /** A WebVTT track, when one has been produced alongside the video. */
  captionsSrc?: string | null;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [speedOpen, setSpeedOpen] = useState(false);
  const [captions, setCaptions] = useState(false);
  const hasVideo = Boolean(src);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) void v.play().catch(() => {});
    else v.pause();
  }, []);

  const seekTo = (t: number) => {
    const v = videoRef.current;
    if (v) v.currentTime = t;
    setCurrent(t);
  };

  const skip = (delta: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.min(Math.max(0, v.currentTime + delta), v.duration || 0);
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => setCurrent(v.currentTime);
    const onMeta = () => setDuration(v.duration || 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onProgress = () => {
      try {
        if (v.buffered.length) setBuffered(v.buffered.end(v.buffered.length - 1));
      } catch {
        /* buffered can throw before metadata */
      }
    };
    const onEnd = () => setPlaying(false);
    v.addEventListener('timeupdate', onTime);
    v.addEventListener('loadedmetadata', onMeta);
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    v.addEventListener('progress', onProgress);
    v.addEventListener('ended', onEnd);
    return () => {
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('loadedmetadata', onMeta);
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('progress', onProgress);
      v.removeEventListener('ended', onEnd);
    };
  }, [src]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = speed;
  }, [speed]);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.volume = volume;
    videoRef.current.muted = muted;
  }, [volume, muted]);

  const enterPip = async () => {
    const v = videoRef.current as
      | (HTMLVideoElement & { requestPictureInPicture?: () => Promise<unknown> })
      | null;
    try {
      await v?.requestPictureInPicture?.();
    } catch {
      /* unsupported */
    }
  };

  const toggleFullscreen = () => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    else void el.requestFullscreen?.().catch(() => {});
  };

  const pct = duration ? (current / duration) * 100 : 0;
  const bufPct = duration ? (buffered / duration) * 100 : 0;

  return (
    <div
      ref={wrapRef}
      className="group relative aspect-video w-full select-none overflow-hidden rounded-xl bg-black"
    >
      {hasVideo ? (
        <video
          ref={videoRef}
          src={src ?? undefined}
          poster={poster ?? undefined}
          className="h-full w-full"
          onClick={togglePlay}
          playsInline
          crossOrigin="anonymous"
        >
          {captionsSrc && (
            <track
              kind="captions"
              src={captionsSrc}
              srcLang="en"
              label="English"
              default={captions}
            />
          )}
        </video>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 text-center">
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(circle at 30% 30%, #0ea5e9 0, transparent 45%)',
            }}
          />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
            <Play className="ml-1 h-7 w-7 text-white/80" fill="currentColor" />
          </div>
          <p className="relative mt-4 max-w-md px-6 text-lg font-medium text-white">
            {title}
          </p>
          <p className="relative mt-1 text-sm text-white/50">
            Video not uploaded yet
          </p>
        </div>
      )}

      {hasVideo && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? 'Pause' : 'Play'}
          className={`absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-600/90 text-white shadow-xl transition-opacity hover:scale-105 ${
            playing ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
          }`}
        >
          {playing ? (
            <Pause className="h-7 w-7" fill="currentColor" />
          ) : (
            <Play className="ml-1 h-7 w-7" fill="currentColor" />
          )}
        </button>
      )}

      <div
        className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 pb-2 pt-8 text-white transition-opacity ${
          hasVideo ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
        }`}
      >
        <div className="relative mb-2 h-1.5 w-full">
          <div className="absolute inset-0 rounded-full bg-white/20" />
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-white/40"
            style={{ width: `${bufPct}%` }}
          />
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-brand-500"
            style={{ width: `${pct}%` }}
          />
          <div
            className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow"
            style={{ left: `calc(${pct}% - 6px)` }}
          />
          {hasVideo && (
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={current}
              onChange={(e) => seekTo(parseFloat(e.target.value))}
              aria-label="Seek"
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          )}
        </div>

        <div className="flex items-center gap-3 text-white/90">
          <IconBtn
            label={playing ? 'Pause' : 'Play'}
            onClick={togglePlay}
            disabled={!hasVideo}
          >
            {playing ? (
              <Pause className="h-4 w-4" fill="currentColor" />
            ) : (
              <Play className="h-4 w-4" fill="currentColor" />
            )}
          </IconBtn>
          <IconBtn label="Back 10s" onClick={() => skip(-10)} disabled={!hasVideo}>
            <RotateCcw className="h-4 w-4" />
          </IconBtn>
          <IconBtn label="Forward 10s" onClick={() => skip(10)} disabled={!hasVideo}>
            <RotateCw className="h-4 w-4" />
          </IconBtn>

          <div className="group/vol flex items-center gap-1.5">
            <IconBtn
              label={muted ? 'Unmute' : 'Mute'}
              onClick={() => setMuted((m) => !m)}
              disabled={!hasVideo}
            >
              {muted || volume === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </IconBtn>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                setMuted(false);
              }}
              aria-label="Volume"
              disabled={!hasVideo}
              className="h-1 w-0 cursor-pointer accent-brand-500 opacity-0 transition-all group-hover/vol:w-16 group-hover/vol:opacity-100"
            />
          </div>

          <span className="ml-1 text-xs tabular-nums text-white/80">
            {fmt(current)} / {fmt(duration)}
          </span>

          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setSpeedOpen((o) => !o)}
                disabled={!hasVideo}
                aria-label="Playback speed"
                className="flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-semibold ring-1 ring-white/20 hover:bg-white/10 disabled:opacity-40"
              >
                <Settings className="h-3.5 w-3.5" />
                {speed}×
              </button>
              {speedOpen && hasVideo && (
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
            <IconBtn
              label="Captions"
              onClick={() => setCaptions((c) => !c)}
              disabled={!hasVideo || !captionsSrc}
              active={captions}
            >
              <Subtitles className="h-4 w-4" />
            </IconBtn>
            <IconBtn
              label="Picture in picture"
              onClick={() => void enterPip()}
              disabled={!hasVideo}
            >
              <PictureInPicture2 className="h-4 w-4" />
            </IconBtn>
            <IconBtn label="Fullscreen" onClick={toggleFullscreen} disabled={!hasVideo}>
              <Maximize className="h-4 w-4" />
            </IconBtn>
          </div>
        </div>
      </div>
    </div>
  );
}
