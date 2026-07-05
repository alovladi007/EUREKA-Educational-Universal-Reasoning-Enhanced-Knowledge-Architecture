"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/lib/eureka-api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Wire shapes mirror api-core exam.py:
//   GET  /mock-attempts/{id}          → MockAttemptResponse
//   GET  /mock-attempts/{id}/items    → list[dict] (correct_index/explanation
//                                        only present once status == submitted)
//   POST /mock-attempts/{id}/answer   → { item_id, correct, answered_at }
//   POST /mock-attempts/{id}/submit   → MockAttemptResponse (scored)
type MockItem = {
  item_id: string;
  position: number;
  kind: string;
  content: { stem?: string; options?: string[]; correct_index?: number };
  answer_index: number | null;
  is_correct: boolean | null;
  explanation: string | null;
  flagged: boolean;
};

type Attempt = {
  id: string;
  status: string; // in_progress | submitted | expired
  blueprint_id?: string;
  started_at?: string;
  submitted_at?: string | null;
  deadline_at?: string;
  correct_count?: number | null;
  answered_count?: number | null;
  scaled_score?: string | number | null;
  predicted_pass?: boolean | null;
  pass_probability?: string | number | null;
};

function pct(v: unknown): string {
  const n = typeof v === "string" ? parseFloat(v) : typeof v === "number" ? v : NaN;
  return Number.isFinite(n) ? `${Math.round(n * 100)}%` : "—";
}

function fmtClock(ms: number): string {
  if (ms <= 0) return "0:00";
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = String(m).padStart(h > 0 ? 2 : 1, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export default function MockRunnerPage() {
  const params = useParams<{ attemptId: string }>();
  const attemptId = params?.attemptId;
  const router = useRouter();

  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [items, setItems] = useState<MockItem[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [now, setNow] = useState(0);

  // Per-question stopwatch so /answer can record time_taken_ms.
  const shownAtRef = useRef<number>(0);

  const load = useCallback(async () => {
    if (!attemptId) return;
    try {
      const [a, its] = await Promise.all([
        api<Attempt>(`/mock-attempts/${attemptId}`),
        api<MockItem[]>(`/mock-attempts/${attemptId}/items`),
      ]);
      setAttempt(a);
      const list = Array.isArray(its) ? [...its].sort((x, y) => x.position - y.position) : [];
      setItems(list);
      // Hydrate any answers/flags already persisted server-side.
      const ans: Record<string, number> = {};
      const flg: Record<string, boolean> = {};
      for (const it of list) {
        if (typeof it.answer_index === "number") ans[it.item_id] = it.answer_index;
        if (it.flagged) flg[it.item_id] = true;
      }
      setAnswers(ans);
      setFlags(flg);
    } catch (e) {
      setError(String((e as Error).message));
    } finally {
      setLoading(false);
    }
  }, [attemptId]);

  useEffect(() => {
    void load();
  }, [load]);

  // 1s tick for the countdown (only while in progress).
  const inProgress = attempt?.status === "in_progress";
  useEffect(() => {
    if (!inProgress) return;
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [inProgress]);

  // Reset the per-question stopwatch whenever the visible question changes.
  useEffect(() => {
    shownAtRef.current = Date.now();
  }, [current]);

  const deadlineMs = attempt?.deadline_at ? Date.parse(attempt.deadline_at + "Z") : NaN;
  const remaining = Number.isFinite(deadlineMs) && now ? deadlineMs - now : NaN;

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

  const submit = useCallback(async () => {
    if (!attemptId || submitting) return;
    setSubmitting(true);
    try {
      await api(`/mock-attempts/${attemptId}/submit`, { method: "POST" });
      await load(); // reloads with status=submitted → answers + explanations revealed
      setCurrent(0);
    } catch (e) {
      setError(String((e as Error).message));
    } finally {
      setSubmitting(false);
    }
  }, [attemptId, submitting, load]);

  // Auto-submit once the clock runs out.
  useEffect(() => {
    if (inProgress && Number.isFinite(remaining) && remaining <= 0 && !submitting) {
      void submit();
    }
  }, [inProgress, remaining, submitting, submit]);

  const choose = useCallback(
    async (item: MockItem, idx: number) => {
      if (!attemptId || attempt?.status !== "in_progress") return;
      const prev = answers[item.item_id];
      setAnswers((a) => ({ ...a, [item.item_id]: idx }));
      const elapsed = Math.max(0, Date.now() - (shownAtRef.current || Date.now()));
      try {
        await api(`/mock-attempts/${attemptId}/answer`, {
          method: "POST",
          body: JSON.stringify({
            item_id: item.item_id,
            answer_index: idx,
            time_taken_ms: elapsed,
            flagged: !!flags[item.item_id],
          }),
        });
      } catch (e) {
        // Roll back the optimistic selection if the server rejects it
        // (e.g. the attempt expired between render and click).
        setAnswers((a) => {
          const copy = { ...a };
          if (prev === undefined) delete copy[item.item_id];
          else copy[item.item_id] = prev;
          return copy;
        });
        setError(String((e as Error).message));
      }
    },
    [attemptId, attempt?.status, answers, flags],
  );

  const toggleFlag = useCallback(
    async (item: MockItem) => {
      if (attempt?.status !== "in_progress") return;
      const next = !flags[item.item_id];
      setFlags((f) => ({ ...f, [item.item_id]: next }));
      // Persist the flag alongside the current answer (if any).
      try {
        await api(`/mock-attempts/${attemptId}/answer`, {
          method: "POST",
          body: JSON.stringify({
            item_id: item.item_id,
            answer_index: answers[item.item_id] ?? null,
            flagged: next,
          }),
        });
      } catch {
        /* flag is cosmetic; ignore persistence errors */
      }
    },
    [attempt?.status, attemptId, answers, flags],
  );

  if (loading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">Loading mock exam…</div>
    );
  }

  if (error && !attempt) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertTitle>Could not load this attempt</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Link
          href="/dashboard/assessments"
          className="mt-4 inline-block text-sm underline"
        >
          ← Back to assessments
        </Link>
      </div>
    );
  }

  const submitted = attempt?.status === "submitted";

  // ── Results view ──────────────────────────────────────────────────
  if (submitted) {
    const total = items.length;
    const correct = attempt?.correct_count ?? 0;
    const answered = attempt?.answered_count ?? 0;
    return (
      <div className="max-w-3xl mx-auto space-y-6 p-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Mock results</h1>
            <p className="text-sm text-muted-foreground">
              Adaptive scoring via IRT (θ). Review every item below.
            </p>
          </div>
          <Link
            href="/dashboard/assessments"
            className="text-sm underline whitespace-nowrap"
          >
            ← Assessments
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              Scaled score:{" "}
              <span className="text-3xl font-bold tabular-nums">
                {attempt?.scaled_score ?? "—"}
              </span>
              {attempt?.predicted_pass != null && (
                <Badge
                  variant={attempt.predicted_pass ? "default" : "destructive"}
                >
                  {attempt.predicted_pass ? "Predicted PASS" : "Predicted FAIL"}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {correct}/{answered} correct ({answered}/{total} answered) ·
              pass probability {pct(attempt?.pass_probability)}
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="space-y-4">
          {items.map((it, i) => {
            const chosen = it.answer_index;
            const key = it.content?.correct_index;
            return (
              <Card key={it.item_id}>
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-medium">
                      <span className="text-muted-foreground mr-2">
                        Q{i + 1}.
                      </span>
                      {it.content?.stem}
                    </p>
                    <Badge
                      variant={
                        it.is_correct
                          ? "default"
                          : chosen == null
                            ? "outline"
                            : "destructive"
                      }
                      className="whitespace-nowrap"
                    >
                      {it.is_correct
                        ? "Correct"
                        : chosen == null
                          ? "Skipped"
                          : "Incorrect"}
                    </Badge>
                  </div>
                  <ul className="space-y-1.5">
                    {(it.content?.options ?? []).map((opt, oi) => {
                      const isKey = key === oi;
                      const isChosen = chosen === oi;
                      return (
                        <li
                          key={oi}
                          className={[
                            "rounded-md border px-3 py-2 text-sm",
                            isKey
                              ? "border-green-500 bg-green-50 dark:bg-green-950/40"
                              : isChosen
                                ? "border-red-500 bg-red-50 dark:bg-red-950/40"
                                : "border-transparent",
                          ].join(" ")}
                        >
                          <span className="font-mono text-xs text-muted-foreground mr-2">
                            {String.fromCharCode(65 + oi)}
                          </span>
                          {opt}
                          {isKey && (
                            <span className="ml-2 text-xs font-semibold text-green-700 dark:text-green-400">
                              ✓ correct
                            </span>
                          )}
                          {isChosen && !isKey && (
                            <span className="ml-2 text-xs font-semibold text-red-700 dark:text-red-400">
                              your answer
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                  {it.explanation && (
                    <div className="rounded-md bg-muted/50 px-3 py-2 text-sm">
                      <span className="font-semibold">Explanation. </span>
                      {it.explanation}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Runner view (in progress / expired) ──────────────────────────
  const item = items[current];
  const expired = attempt?.status === "expired" ||
    (Number.isFinite(remaining) && remaining <= 0);

  return (
    <div className="max-w-3xl mx-auto space-y-4 p-1">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-10 -mx-1 bg-background/95 backdrop-blur px-1 py-3 border-b flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold">Mock exam</h1>
          <p className="text-xs text-muted-foreground">
            {answeredCount}/{items.length} answered
          </p>
        </div>
        <div className="flex items-center gap-3">
          {Number.isFinite(remaining) && (
            <div
              className={[
                "rounded-md px-3 py-1.5 text-sm font-mono tabular-nums",
                remaining < 60_000
                  ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200"
                  : "bg-muted",
              ].join(" ")}
              title="Time remaining"
            >
              ⏱ {fmtClock(remaining)}
            </div>
          )}
          <button
            type="button"
            onClick={() => void submit()}
            disabled={submitting}
            className="inline-flex items-center rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Submitting…" : "Submit exam"}
          </button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {expired && (
        <Alert variant="destructive">
          <AlertTitle>Time is up</AlertTitle>
          <AlertDescription>
            The window closed — submitting your answered items for scoring.
          </AlertDescription>
        </Alert>
      )}

      {/* Question palette */}
      <div className="flex flex-wrap gap-1.5">
        {items.map((it, i) => {
          const done = answers[it.item_id] !== undefined;
          const flagged = flags[it.item_id];
          return (
            <button
              key={it.item_id}
              type="button"
              onClick={() => setCurrent(i)}
              className={[
                "h-8 w-8 rounded text-xs font-medium border relative",
                i === current
                  ? "ring-2 ring-primary"
                  : "",
                done
                  ? "bg-primary/15 border-primary/40"
                  : "bg-background border-input",
              ].join(" ")}
              title={
                (done ? "Answered" : "Unanswered") +
                (flagged ? " · flagged" : "")
              }
            >
              {i + 1}
              {flagged && (
                <span className="absolute -top-1 -right-1 text-[10px]">🚩</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Current question */}
      {item && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <p className="font-medium">
                <span className="text-muted-foreground mr-2">
                  Q{current + 1} of {items.length}.
                </span>
                {item.content?.stem}
              </p>
              <button
                type="button"
                onClick={() => void toggleFlag(item)}
                className={[
                  "shrink-0 rounded-md border px-2 py-1 text-xs",
                  flags[item.item_id]
                    ? "border-amber-500 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200"
                    : "border-input",
                ].join(" ")}
              >
                {flags[item.item_id] ? "🚩 Flagged" : "Flag"}
              </button>
            </div>

            <div className="space-y-2">
              {(item.content?.options ?? []).map((opt, oi) => {
                const selected = answers[item.item_id] === oi;
                return (
                  <button
                    key={oi}
                    type="button"
                    disabled={expired}
                    onClick={() => void choose(item, oi)}
                    className={[
                      "w-full text-left rounded-md border px-3 py-2.5 text-sm transition-colors",
                      selected
                        ? "border-primary bg-primary/10"
                        : "border-input hover:bg-accent",
                      expired ? "opacity-60 cursor-not-allowed" : "",
                    ].join(" ")}
                  >
                    <span className="font-mono text-xs text-muted-foreground mr-2">
                      {String.fromCharCode(65 + oi)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                disabled={current === 0}
                className="rounded-md border border-input px-3 py-1.5 text-sm disabled:opacity-40"
              >
                ← Previous
              </button>
              <button
                type="button"
                onClick={() =>
                  setCurrent((c) => Math.min(items.length - 1, c + 1))
                }
                disabled={current === items.length - 1}
                className="rounded-md border border-input px-3 py-1.5 text-sm disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      <button
        type="button"
        onClick={() => router.push("/dashboard/assessments")}
        className="text-sm text-muted-foreground underline"
      >
        Save &amp; exit (your answers are saved automatically)
      </button>
    </div>
  );
}
