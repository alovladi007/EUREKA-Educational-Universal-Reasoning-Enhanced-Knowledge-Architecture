/**
 * useXrSession — session tracking for built-in XR portals (XR-4).
 *
 * The solar-system / molecules / anatomy portals are Next.js routes, not glTF
 * scenes, but their runs should count exactly like every other experience:
 * a real xr_sessions row, elapsed-derived completion, optional rating, XP.
 * The portal's xr_experiences row stores its internal route in scene_url;
 * this hook resolves that row by route, starts a session on mount, and ends
 * it honestly on unmount/page-leave. endWithRating lets the portal offer the
 * same star dialog the experience viewer has.
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/eureka-api';

type ExperienceRow = {
  id: string;
  duration_minutes: number;
  scene_file_url: string;
};

export function useXrSession(route: string) {
  const sessionIdRef = useRef<string | null>(null);
  const startedAtRef = useRef<number>(0);
  const durationRef = useRef<number>(15);
  const endedRef = useRef(false);
  const [tracked, setTracked] = useState(false);
  const [recorded, setRecorded] = useState(false);

  const completion = () => {
    if (!startedAtRef.current) return 0;
    const elapsedMin = (Date.now() - startedAtRef.current) / 60000;
    return Math.max(
      1,
      Math.min(100, Math.round((elapsedMin / Math.max(1, durationRef.current)) * 100)),
    );
  };

  const endSilently = async () => {
    if (!sessionIdRef.current || endedRef.current) return;
    endedRef.current = true;
    try {
      await api(`/xr/sessions/${sessionIdRef.current}/end`, {
        method: 'POST',
        keepalive: true,
        body: JSON.stringify({ completion_percentage: completion(), user_rating: null }),
      });
    } catch {
      // Best effort on leave.
    }
  };

  const endWithRating = async (rating: number | null): Promise<number | null> => {
    if (!sessionIdRef.current || endedRef.current) return null;
    endedRef.current = true;
    try {
      const res = await api<{ xp_awarded?: number }>(
        `/xr/sessions/${sessionIdRef.current}/end`,
        {
          method: 'POST',
          body: JSON.stringify({ completion_percentage: completion(), user_rating: rating }),
        },
      );
      setRecorded(true);
      return res.xp_awarded ?? 0;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api<{ experiences: ExperienceRow[] }>('/xr/experiences');
        const exp = (data.experiences ?? []).find((e) => e.scene_file_url === route);
        if (!exp || cancelled) return; // portal not registered — run untracked
        durationRef.current = exp.duration_minutes || 15;
        const s = await api<{ session: { id: string } }>('/xr/sessions/start', {
          method: 'POST',
          body: JSON.stringify({ experience_id: exp.id, device_type: 'web_browser' }),
        });
        if (!cancelled) {
          sessionIdRef.current = s.session.id;
          startedAtRef.current = Date.now();
          setTracked(true);
        }
      } catch {
        // Signed out or API down — the portal still works, just untracked.
      }
    })();
    const onBeforeUnload = () => {
      void endSilently();
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      cancelled = true;
      window.removeEventListener('beforeunload', onBeforeUnload);
      void endSilently();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route]);

  return { tracked, recorded, completion, endWithRating };
}
