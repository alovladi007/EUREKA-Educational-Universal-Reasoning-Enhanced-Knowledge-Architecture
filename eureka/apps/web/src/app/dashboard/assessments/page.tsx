"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
  blueprint_slug?: string;
  blueprint?: { slug?: string } | null;
  status?: string;
  score_scaled?: number | null;
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
  const [banks, setBanks] = useState<ItemBank[]>([]);
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

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
                    onClick={() =>
                      setToast(
                        `TODO: start mock ${bp.slug ?? bp.name ?? "blueprint"}`,
                      )
                    }
                    className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent"
                  >
                    Start mock
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
                      <th className="py-2 px-3">Created</th>
                      <th className="py-2 px-3">Blueprint</th>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attempts.map((a, i) => {
                      const bpSlug =
                        a.blueprint_slug ??
                        a.blueprint?.slug ??
                        "—";
                      return (
                        <tr
                          key={(a.id ?? i).toString()}
                          className="border-b last:border-b-0"
                        >
                          <td className="py-2 px-3">
                            {formatDate(a.created_at)}
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
                            {typeof a.score_scaled === "number"
                              ? a.score_scaled
                              : "—"}
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
