'use client';

/**
 * Cross-browser fullscreen for a player wrapper.
 *
 * The WRAPPER (not the <video>) goes fullscreen so the custom chrome —
 * scrub bar, speed menu, captions toggle — survives the transition; calling
 * requestFullscreen on the media element hands control to the browser's own
 * UI and every custom control disappears.
 *
 * Coverage, in order of preference:
 *   1. the standard Fullscreen API,
 *   2. the webkit-prefixed variant (older Safari on macOS / iPadOS),
 *   3. on iPhone Safari — which has NO element fullscreen at all — the
 *      native video fullscreen (webkitEnterFullscreen) as a last resort.
 *      Chrome is lost there, but it is the only fullscreen iOS offers.
 *
 * State comes from the fullscreenchange events rather than being toggled
 * optimistically, so Esc / system exits keep the icon truthful.
 */

import { RefObject, useCallback, useEffect, useState } from 'react';

type FsElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};
type FsDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
};
type FsVideo = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void;
};

function activeFullscreenElement(): Element | null {
  const d = document as FsDocument;
  return d.fullscreenElement ?? d.webkitFullscreenElement ?? null;
}

export function useFullscreen(
  wrapRef: RefObject<HTMLElement | null>,
  videoRef?: RefObject<HTMLVideoElement | null>,
) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const sync = () => {
      const fs = activeFullscreenElement();
      const el = wrapRef.current;
      setIsFullscreen(Boolean(fs && el && (fs === el || el.contains(fs))));
    };
    document.addEventListener('fullscreenchange', sync);
    document.addEventListener('webkitfullscreenchange', sync);
    return () => {
      document.removeEventListener('fullscreenchange', sync);
      document.removeEventListener('webkitfullscreenchange', sync);
    };
  }, [wrapRef]);

  const toggle = useCallback(() => {
    const el = wrapRef.current as FsElement | null;
    if (!el) return;
    const d = document as FsDocument;
    if (activeFullscreenElement()) {
      if (d.exitFullscreen) void d.exitFullscreen().catch(() => {});
      else void d.webkitExitFullscreen?.();
      return;
    }
    if (el.requestFullscreen) {
      void el.requestFullscreen().catch(() => {});
    } else if (el.webkitRequestFullscreen) {
      void el.webkitRequestFullscreen();
    } else {
      (videoRef?.current as FsVideo | null | undefined)?.webkitEnterFullscreen?.();
    }
  }, [wrapRef, videoRef]);

  return { isFullscreen, toggle };
}
