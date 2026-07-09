'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  fetchAccommodations,
  getToken,
  updateAccommodations,
  type Accommodations,
} from '@/lib/api';

// Applies the learner's accessibility accommodations app-wide (Build prompt
// Section 13). High-contrast and reduced-motion are toggled as classes on the
// document root, so any page can style against them; text-to-speech exposes a
// speak() helper the practice UI uses to read a prompt aloud via the Web Speech
// API. The accommodations load once on mount and re-apply whenever they change,
// including mid-assessment, so a change takes effect immediately.

const DEFAULTS: Accommodations = {
  extra_time_multiplier: 1.0,
  text_to_speech: false,
  high_contrast: false,
  reduced_motion: false,
};

function applyToRoot(acc: Accommodations): void {
  if (typeof document === 'undefined') {
    return;
  }
  const root = document.documentElement;
  root.classList.toggle('high-contrast', acc.high_contrast);
  root.classList.toggle('reduce-motion', acc.reduced_motion);
}

// Read a string aloud via the browser's speech synthesis. A no-op when the API
// is unavailable, so callers never need to feature-detect.
export function speak(text: string): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }
  const synth = window.speechSynthesis;
  synth.cancel();
  synth.speak(new SpeechSynthesisUtterance(text));
}

export function useAccommodations() {
  const [acc, setAcc] = useState<Accommodations>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const result = await fetchAccommodations();
        if (!cancelled) {
          setAcc(result);
          applyToRoot(result);
        }
      } catch {
        // Accessibility settings are best-effort; a failure leaves defaults.
      } finally {
        if (!cancelled) {
          setLoaded(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const update = useCallback(async (patch: Partial<Accommodations>) => {
    const next = await updateAccommodations(patch);
    setAcc(next);
    applyToRoot(next);
    return next;
  }, []);

  return { accommodations: acc, loaded, update };
}
