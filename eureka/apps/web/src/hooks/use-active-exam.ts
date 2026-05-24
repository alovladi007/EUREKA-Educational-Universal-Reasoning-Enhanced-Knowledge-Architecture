/**
 * useActiveExam — the single source of truth for "which exam is the user
 * currently working on" across the test-prep module.
 *
 * Resolution order:
 *   1. URL query param `?exam=PATENT_BAR` (per-page, wins over everything)
 *   2. localStorage key `eureka-active-exam` (persists across navigation)
 *   3. Default 'GRE' (preserves legacy behavior on first visit)
 *
 * Use this everywhere instead of hardcoded exam types. When the user picks
 * an exam in the layout selector (or any page's selector), `setActiveExam`
 * writes to localStorage and pushes the new value into the URL so deep
 * links also stay consistent.
 *
 * Hydration-safe: server renders default; client overrides from storage
 * inside useEffect, so React #418/#423 doesn't fire.
 */

'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { EXAM_CONFIGS, getExamConfig, type ExamTypeConfig } from '@/lib/exam-config';

const STORAGE_KEY = 'eureka-active-exam';
const DEFAULT_EXAM = 'GRE';
const EXAM_EVENT = 'eureka:active-exam-changed';

/** All valid exam IDs the platform supports. */
const VALID_EXAMS = new Set(Object.keys(EXAM_CONFIGS));

function normalizeExam(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const up = raw.toUpperCase();
  return VALID_EXAMS.has(up) ? up : null;
}

/** Read URL ?exam= without using useSearchParams. Avoids forcing Suspense
 * boundaries on every page that consumes this hook (Next.js 14 requirement
 * when useSearchParams() is reached during static generation).
 */
function readExamFromLocation(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const params = new URLSearchParams(window.location.search);
    return normalizeExam(params.get('exam'));
  } catch {
    return null;
  }
}

export function useActiveExam(): {
  examType: string;
  examConfig: ExamTypeConfig;
  setActiveExam: (next: string) => void;
  isHydrated: boolean;
} {
  const router = useRouter();
  const pathname = usePathname();

  // Start with a deterministic default so server and first-client render match.
  // Client-side useEffect below upgrades from URL + localStorage.
  const [examType, setExamType] = useState<string>(DEFAULT_EXAM);
  const [isHydrated, setIsHydrated] = useState(false);

  // Resolve from URL/storage on mount and on path change.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const fromUrl = readExamFromLocation();
    if (fromUrl) {
      setExamType(fromUrl);
      try { localStorage.setItem(STORAGE_KEY, fromUrl); } catch { /* quota / private mode */ }
    } else {
      try {
        const fromStorage = normalizeExam(localStorage.getItem(STORAGE_KEY));
        if (fromStorage) setExamType(fromStorage);
      } catch { /* private mode */ }
    }
    setIsHydrated(true);
  }, [pathname]);

  // Cross-component sync: when any other consumer updates the active exam,
  // every mounted useActiveExam() instance picks up the change instantly.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      const valid = normalizeExam(detail);
      if (valid) setExamType(valid);
    };
    window.addEventListener(EXAM_EVENT, onChange as EventListener);
    return () => window.removeEventListener(EXAM_EVENT, onChange as EventListener);
  }, []);

  const setActiveExam = useCallback(
    (next: string) => {
      const valid = normalizeExam(next);
      if (!valid) return;
      setExamType(valid);
      try { localStorage.setItem(STORAGE_KEY, valid); } catch { /* ignore */ }
      // Notify any other mounted instances synchronously.
      try {
        window.dispatchEvent(new CustomEvent<string>(EXAM_EVENT, { detail: valid }));
      } catch { /* dispatch failure is harmless */ }
      // Push into URL so refresh/share/back retains state. Replace, not push,
      // so the back button isn't cluttered with selector clicks.
      const params = new URLSearchParams(window.location.search);
      params.set('exam', valid);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname],
  );

  return {
    examType,
    examConfig: getExamConfig(examType),
    setActiveExam,
    isHydrated,
  };
}

/** Helper for non-React code or read-only usage outside hooks. */
export function readActiveExamFromStorage(): string {
  if (typeof window === 'undefined') return DEFAULT_EXAM;
  try {
    const v = normalizeExam(localStorage.getItem(STORAGE_KEY));
    return v || DEFAULT_EXAM;
  } catch {
    return DEFAULT_EXAM;
  }
}
