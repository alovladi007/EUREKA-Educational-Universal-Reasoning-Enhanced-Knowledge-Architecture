"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { api, formatDate } from "@/lib/eureka-api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type ItemBank = {
  id?: string;
  slug?: string;
  name?: string;
  item_count?: number;
  [k: string]: unknown;
};

type Blueprint = {
  id?: string;
  slug?: string;
  name?: string;
  framework?: string;
  exam_seconds?: number;
  [k: string]: unknown;
};

type Attempt = {
  id?: string;
  created_at?: string;
  started_at?: string;
  blueprint_id?: string;
  blueprint_slug?: string;
  blueprint?: { slug?: string } | null;
  status?: string;
  score_scaled?: number | null;
  scaled_score?: string | number | null;
  [k: string]: unknown;
};

function asArray<T>(v: unknown): T[] {
  if (Array.isArray(v)) return v as T[];
  if (v && typeof v === "object" && Array.isArray((v as { items?: T[] }).items)) {
    return (v as { items: T[] }).items;
  }
  return [];
}

export default function AssessmentsPage() {
  const router = useRouter();
  const [banks, setBanks] = useState<ItemBank[]>([]);
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // blueprint_id → slug, so the attempts table can label rows (the
  // MockAttemptResponse payload carries blueprint_id, not the slug).
  const slugByBpId = useMemo(() => {
    const m: Record<string, string> = {};
    for (const bp of blueprints) {
      if (bp.id && bp.slug) m[String(bp.id)] = bp.slug;
    }
    return m;
  }, [blueprints]);

  useEffect(() => {
    (async () => {
      try {
        const [b, p, a] = await Promise.all([
          api<unknown>("/item-banks"),
          api<unknown>("/exam-blueprints"),
          api<unknown>("/mock-attempts/me"),
        ]);
        setBanks(asArray<ItemBank>(b));
        setBlueprints(asArray<Blueprint>(p));
        setAttempts(asArray<Attempt>(a));
      } catch (e) {
        setError(String((e as Error).message));
      }
    })();
  }, []);

  const [startingSlug, setStartingSlug] = useState<string | null>(null);

  const startMock = async (slug?: string) => {
    if (!slug || startingSlug) return;
    setStartingSlug(slug);
    setToast("Starting mock…");
    try {
      // POST /mock-attempts?blueprint_slug=… generates a fresh adaptive item
      // set and returns the attempt, then jump straight into the runner.
      const attempt = await api<{ id?: string }>(
        `/mock-attempts?blueprint_slug=${encodeURIComponent(slug)}`,
        { method: "POST" },
      );
      if (attempt.id) {
        router.push(`/dashboard/assessments/mock/${attempt.id}`);
        return;
      }
      // No id came back (shouldn't happen) — refresh the list as a fallback.
      const a = await api<unknown>("/mock-attempts/me");
      setAttempts(asArray<Attempt>(a));
      setToast("Mock created. See “Recent attempts” below.");
    } catch (e) {
      setToast(`Could not start the mock: ${(e as Error).message}`);
      setStartingSlug(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Assessments</h1>
        <p className="text-muted-foreground">
          Question banks, mock exams, and your recent attempts.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Failed to load assessments</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {toast && (
        <Alert>
          <AlertTitle>Heads up</AlertTitle>
          <AlertDescription>{toast}</AlertDescription>
        </Alert>
      )}

      <section>
        <h2 className="text-xl font-semibold mb-3">Question banks</h2>
        {banks.length === 0 ? (
          <p className="text-sm text-muted-foreground">No banks available.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {banks.map((bank, i) => (
              <Card key={(bank.id ?? bank.slug ?? i).toString()}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {bank.name ?? bank.slug ?? "Untitled bank"}
                  </CardTitle>
                  <CardDescription className="font-mono text-xs">
                    {bank.slug ?? ""}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {typeof bank.item_count === "number" && (
                    <Badge variant="outline">{bank.item_count} items</Badge>
                  )}
                  <div>
                    <Link
                      href="/dashboard/tutor"
                      className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                      Open in tutor
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Mock exams</h2>
        {blueprints.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No mock exams configured.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {blueprints.map((bp, i) => (
              <Card key={(bp.id ?? bp.slug ?? i).toString()}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {bp.name ?? bp.slug ?? "Untitled blueprint"}
                  </CardTitle>
                  <CardDescription>
                    {bp.framework ? `${bp.framework} · ` : ""}
                    {typeof bp.exam_seconds === "number"
                      ? `${Math.round(bp.exam_seconds / 60)} min`
                      : "—"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <button
                    type="button"
                    onClick={() => startMock(bp.slug)}
                    disabled={!bp.slug || startingSlug !== null}
                    className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {startingSlug === bp.slug ? "Starting…" : "Start mock"}
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Recent attempts</h2>
        <Card>
          <CardContent className="pt-6">
            {attempts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No attempts yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs uppercase text-muted-foreground">
                      <th className="py-2 px-3">Started</th>
                      <th className="py-2 px-3">Blueprint</th>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3">Score</th>
                      <th className="py-2 px-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {attempts.map((a, i) => {
                      const bpSlug =
                        a.blueprint_slug ??
                        a.blueprint?.slug ??
                        (a.blueprint_id
                          ? slugByBpId[String(a.blueprint_id)]
                          : undefined) ??
                        "—";
                      const score =
                        a.scaled_score ??
                        (typeof a.score_scaled === "number"
                          ? a.score_scaled
                          : undefined);
                      const inProgress = a.status === "in_progress";
                      return (
                        <tr
                          key={(a.id ?? i).toString()}
                          className="border-b last:border-b-0"
                        >
                          <td className="py-2 px-3">
                            {formatDate(a.started_at ?? a.created_at)}
                          </td>
                          <td className="py-2 px-3 font-mono text-xs">
                            {bpSlug}
                          </td>
                          <td className="py-2 px-3">
                            {a.status ? (
                              <Badge variant="outline">{a.status}</Badge>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="py-2 px-3">
                            {score != null ? score : "—"}
                          </td>
                          <td className="py-2 px-3 text-right">
                            {a.id ? (
                              <Link
                                href={`/dashboard/assessments/mock/${a.id}`}
                                className="text-primary underline whitespace-nowrap"
                              >
                                {inProgress ? "Resume →" : "Review →"}
                              </Link>
                            ) : null}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
