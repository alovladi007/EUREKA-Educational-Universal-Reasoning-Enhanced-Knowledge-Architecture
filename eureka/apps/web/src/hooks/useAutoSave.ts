"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useResumeStore } from "@/stores/resume";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

/**
 * Auto-save hook that debounces saves and provides status indication.
 * Saves to localStorage via Zustand persist (automatic) and optionally to backend.
 */
export function useAutoSave(intervalMs: number = 30000) {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const doc = useResumeStore((s) => s.activeDocument());
  const prevDataRef = useRef<string>("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const save = useCallback(async () => {
    if (!doc) return;

    const currentData = JSON.stringify(doc.data);
    if (currentData === prevDataRef.current) return; // No changes

    setStatus("saving");

    try {
      // Zustand persist already saves to localStorage on every change.
      // This hook adds a visible "Saving..." indicator and could sync to backend.

      // TODO: When backend is connected, sync here:
      // await apiUpdateResume(doc.id, { data: doc.data, template_id: doc.templateId });

      prevDataRef.current = currentData;
      setLastSavedAt(new Date());
      setStatus("saved");

      // Reset to idle after 3 seconds
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  }, [doc]);

  // Auto-save on interval
  useEffect(() => {
    if (!doc) return;

    timerRef.current = setInterval(save, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [doc, intervalMs, save]);

  // Save on blur (user switches tab/window)
  useEffect(() => {
    const handleBlur = () => save();
    window.addEventListener("blur", save);
    return () => window.removeEventListener("blur", handleBlur);
  }, [save]);

  // Initialize prev data
  useEffect(() => {
    if (doc) {
      prevDataRef.current = JSON.stringify(doc.data);
    }
  }, [doc?.id]);

  return { status, lastSavedAt, saveNow: save };
}
