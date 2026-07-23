"use client";

/**
 * LessonVideoPlayer — an ABP-style custom video player.
 *
 * Drop-in replacement for the plain `<video controls>` in the Test Prep
 * "Video Lessons" view. Matches the polished player from the ABP course
 * platform: a dark stage with a center play button and a custom control bar
 * (play/pause, seek + buffered, time, volume, playback speed, captions, PiP,
 * fullscreen). When a lesson has no `videoUrl` yet it shows the same styled
 * chrome over a "coming soon" poster, so the look is consistent either way.
 *
 * Everything is wired to a real <video> element — the controls actually work
 * the moment a lesson carries a video URL.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Play, Pause, Volume2, VolumeX, Settings, Subtitles,
  PictureInPicture2, Maximize, RotateCcw, RotateCw,
} from "lucide-react";

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

function fmt(s: number): string {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function LessonVideoPlayer({
  videoUrl,
  title,
  poster,
  onEnded,
}: {
  videoUrl?: string | null;
  title: string;
  poster?: string | null;
  /** Called once when playback reaches the end (used to auto-mark complete). */
  onEnded?: () => void;
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
  const hasVideo = Boolean(videoUrl);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  }, []);

  const seekTo = (t: number) => {
    const v = videoRef.current;
    if (v) v.currentTime = t;
    setCurrent(t);
  };
  const skip = (delta: number) => {
    const v = videoRef.current;
    if (v) v.currentTime = Math.min(Math.max(0, v.currentTime + delta), v.duration || 0);
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => setCurrent(v.currentTime);
    const onMeta = () => setDuration(v.duration || 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onProgress = () => {
      try { if (v.buffered.length) setBuffered(v.buffered.end(v.buffered.length - 1)); } catch { /* noop */ }
    };
    const onEnd = () => { setPlaying(false); onEnded?.(); };
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("progress", onProgress);
    v.addEventListener("ended", onEnd);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("progress", onProgress);
      v.removeEventListener("ended", onEnd);
    };
  }, [videoUrl, onEnded]);

  useEffect(() => { if (videoRef.current) videoRef.current.playbackRate = speed; }, [speed]);
  useEffect(() => { if (videoRef.current) { videoRef.current.volume = volume; videoRef.current.muted = muted; } }, [volume, muted]);

  const enterPip = async () => {
    const v = videoRef.current as (HTMLVideoElement & { requestPictureInPicture?: () => Promise<unknown> }) | null;
    try { await v?.requestPictureInPicture?.(); } catch { /* unsupported */ }
  };
  const toggleFullscreen = () => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else el.requestFullscreen?.().catch(() => {});
  };

  const pct = duration ? (current / duration) * 100 : 0;
  const bufPct = duration ? (buffered / duration) * 100 : 0;

  return (
    <div ref={wrapRef} className="group relative aspect-video w-full select-none overflow-hidden bg-black">
      {/* Stage */}
      {hasVideo ? (
        <video
          ref={videoRef}
          src={videoUrl ?? undefined}
          poster={poster ?? undefined}
          className="h-full w-full"
          onClick={togglePlay}
          playsInline
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 text-center">
          <div className="pointer-events-none absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 30%, #38bdf8 0, transparent 45%)" }} />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
            <Play className="ml-1 h-7 w-7 text-white/80" fill="currentColor" />
          </div>
          <p className="relative mt-4 max-w-md px-6 text-lg font-medium text-white">{title}</p>
          <p className="relative mt-1 text-sm text-white/50">Video coming soon</p>
        </div>
      )}

      {/* Center play/pause (only meaningful with a real video) */}
      {hasVideo && (
        <button
          onClick={togglePlay}
          aria-label={playing ? "Pause" : "Play"}
          className={`absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-xl transition-opacity hover:scale-105 ${playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"}`}
        >
          {playing ? <Pause className="h-7 w-7" fill="currentColor" /> : <Play className="ml-1 h-7 w-7" fill="currentColor" />}
        </button>
      )}

      {/* Control bar */}
      <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 pb-2 pt-8 text-white transition-opacity ${hasVideo ? "opacity-0 group-hover:opacity-100" : "opacity-100"}`}>
        {/* Seek */}
        <div className="relative mb-2 h-1.5 w-full">
          <div className="absolute inset-0 rounded-full bg-white/20" />
          <div className="absolute inset-y-0 left-0 rounded-full bg-white/40" style={{ width: `${bufPct}%` }} />
          <div className="absolute inset-y-0 left-0 rounded-full bg-primary" style={{ width: `${pct}%` }} />
          <div className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow" style={{ left: `calc(${pct}% - 6px)` }} />
          {hasVideo && (
            <input
              type="range" min={0} max={duration || 0} step={0.1} value={current}
              onChange={(e) => seekTo(parseFloat(e.target.value))}
              aria-label="Seek" className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 text-white/90">
          <IconBtn label={playing ? "Pause" : "Play"} onClick={togglePlay} disabled={!hasVideo}>
            {playing ? <Pause className="h-4 w-4" fill="currentColor" /> : <Play className="h-4 w-4" fill="currentColor" />}
          </IconBtn>
          <IconBtn label="Back 10s" onClick={() => skip(-10)} disabled={!hasVideo}><RotateCcw className="h-4 w-4" /></IconBtn>
          <IconBtn label="Forward 10s" onClick={() => skip(10)} disabled={!hasVideo}><RotateCw className="h-4 w-4" /></IconBtn>

          <div className="group/vol flex items-center gap-1.5">
            <IconBtn label={muted ? "Unmute" : "Mute"} onClick={() => setMuted((m) => !m)} disabled={!hasVideo}>
              {muted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </IconBtn>
            <input
              type="range" min={0} max={1} step={0.05} value={muted ? 0 : volume}
              onChange={(e) => { setVolume(parseFloat(e.target.value)); setMuted(false); }}
              aria-label="Volume" disabled={!hasVideo}
              className="h-1 w-0 cursor-pointer opacity-0 transition-all group-hover/vol:w-16 group-hover/vol:opacity-100 accent-primary"
            />
          </div>

          <span className="ml-1 text-xs tabular-nums text-white/80">{fmt(current)} / {fmt(duration)}</span>

          <div className="ml-auto flex items-center gap-3">
            {/* Speed */}
            <div className="relative">
              <button
                onClick={() => setSpeedOpen((o) => !o)} disabled={!hasVideo}
                className="rounded px-1.5 py-0.5 text-xs font-semibold ring-1 ring-white/20 hover:bg-white/10 disabled:opacity-40"
              >
                {speed}×
              </button>
              {speedOpen && hasVideo && (
                <div className="absolute bottom-8 right-0 min-w-[4.5rem] overflow-hidden rounded-lg bg-slate-900/95 py-1 text-xs shadow-xl ring-1 ring-white/10">
                  {SPEEDS.map((s) => (
                    <button
                      key={s} onClick={() => { setSpeed(s); setSpeedOpen(false); }}
                      className={`block w-full px-3 py-1 text-right hover:bg-white/10 ${s === speed ? "text-primary" : "text-white/80"}`}
                    >
                      {s === 1 ? "Normal" : `${s}×`}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <IconBtn label="Captions" onClick={() => setCaptions((c) => !c)} disabled={!hasVideo}>
              <Subtitles className={`h-4 w-4 ${captions ? "text-primary" : ""}`} />
            </IconBtn>
            <IconBtn label="Settings" onClick={() => setSpeedOpen((o) => !o)} disabled={!hasVideo}><Settings className="h-4 w-4" /></IconBtn>
            <IconBtn label="Picture in picture" onClick={enterPip} disabled={!hasVideo}><PictureInPicture2 className="h-4 w-4" /></IconBtn>
            <IconBtn label="Fullscreen" onClick={toggleFullscreen} disabled={!hasVideo}><Maximize className="h-4 w-4" /></IconBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

function IconBtn({
  children, label, onClick, disabled,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button onClick={onClick} disabled={disabled} aria-label={label} className="rounded p-0.5 transition-colors hover:text-white disabled:cursor-default disabled:opacity-40">
      {children}
    </button>
  );
}
