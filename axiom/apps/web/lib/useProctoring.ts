'use client';

import { useEffect, useRef, useState } from 'react';
import {
  proctoringEnd,
  proctoringEvent,
  proctoringStart,
  type ProctoringPolicy,
} from '@/lib/api';

// A client hook that runs a proctoring session for the duration it is enabled.
// It reports the browser-observable integrity signals (tab hidden, window blur,
// copy/paste/cut, context menu) and, when the policy asks, blocks copy/paste and
// the context menu. It is non-invasive by design: no webcam, no screen capture.
//
// True OS-level lockdown (blocking Alt-Tab, other apps) is not possible from a
// web page; what a browser can honestly do is observe focus changes and clipboard
// actions and record them for a human to review. The anomaly score lives on the
// server; this hook only feeds it.

export interface UseProctoringResult {
  sessionId: string | null;
  anomalyScore: number;
  flagged: boolean;
  active: boolean;
}

// Do not send the same signal more than once per this window, so a burst of
// blur/focus toggles does not flood the event log.
const THROTTLE_MS = 1500;

export function useProctoring(options: {
  enabled: boolean;
  assessmentId?: string | null;
  attemptId?: string | null;
  policy?: ProctoringPolicy;
}): UseProctoringResult {
  const { enabled, assessmentId, attemptId, policy } = options;
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [anomalyScore, setAnomalyScore] = useState(0);
  const [flagged, setFlagged] = useState(false);

  const sessionRef = useRef<string | null>(null);
  const lastSent = useRef<Record<string, number>>({});

  useEffect(() => {
    if (!enabled) {
      return;
    }
    let cancelled = false;

    // Serialize the (usually short) policy for a stable dependency without
    // re-running on every render.
    (async () => {
      try {
        const started = await proctoringStart({
          assessment_id: assessmentId ?? null,
          attempt_id: attemptId ?? null,
          policy,
        });
        if (cancelled) {
          // Started but the component is gone: end it so it does not dangle.
          void proctoringEnd(started.session_id).catch(() => {});
          return;
        }
        sessionRef.current = started.session_id;
        setSessionId(started.session_id);
      } catch {
        // If proctoring cannot start, the exam still proceeds; we simply do not
        // record integrity events.
      }
    })();

    function report(kind: string, detail = '') {
      const id = sessionRef.current;
      if (!id) {
        return;
      }
      const now = Date.now();
      if (now - (lastSent.current[kind] ?? 0) < THROTTLE_MS) {
        return;
      }
      lastSent.current[kind] = now;
      void proctoringEvent(id, kind, detail)
        .then((r) => {
          setAnomalyScore(r.anomaly_score);
          setFlagged(r.flagged);
        })
        .catch(() => {});
    }

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        report('visibility_hidden', 'tab hidden or switched away');
      }
    };
    const onBlur = () => report('window_blur', 'window lost focus');
    const onCopy = (e: ClipboardEvent) => {
      if (policy?.block_copy) {
        e.preventDefault();
      }
      report('copy');
    };
    const onPaste = (e: ClipboardEvent) => {
      if (policy?.block_paste) {
        e.preventDefault();
      }
      report('paste');
    };
    const onContextMenu = (e: MouseEvent) => {
      if (policy?.block_context_menu) {
        e.preventDefault();
      }
      report('context_menu');
    };

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('blur', onBlur);
    document.addEventListener('copy', onCopy);
    document.addEventListener('paste', onPaste);
    document.addEventListener('contextmenu', onContextMenu);

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('copy', onCopy);
      document.removeEventListener('paste', onPaste);
      document.removeEventListener('contextmenu', onContextMenu);
      const id = sessionRef.current;
      if (id) {
        void proctoringEnd(id).catch(() => {});
        sessionRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, assessmentId, attemptId]);

  return { sessionId, anomalyScore, flagged, active: sessionId !== null };
}
