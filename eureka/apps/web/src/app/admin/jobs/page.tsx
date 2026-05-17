"use client";

/**
 * Phase 14.2 — Background jobs dashboard.
 */

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api, formatDate } from "@/lib/eureka-api";

type Stats = {
  queued: number;
  running: number;
  succeeded: number;
  failed: number;
  dead: number;
  kinds_registered: string[];
};

type Job = {
  id: string;
  kind: string;
  status: string;
  attempt_n: number;
  priority: number;
  dedupe_key: string | null;
  queued_at: string;
  started_at: string | null;
  finished_at: string | null;
  last_error: string | null;
};

const STATUS_COLOR: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  queued: "outline",
  running: "default",
  succeeded: "secondary",
  failed: "destructive",
  dead: "destructive",
};

export default function JobsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function reload() {
    try {
      const [s, j] = await Promise.all([
        api<Stats>("/admin/jobs/stats"),
        api<Job[]>("/admin/jobs?limit=50"),
      ]);
      setStats(s);
      setJobs(j);
    } catch (e) {
      setError(String((e as Error).message));
    }
  }

  useEffect(() => {
    reload();
    const t = setInterval(reload, 5000);
    return () => clearInterval(t);
  }, []);

  async function runOne() {
    setBusy(true);
    try {
      await api(`/admin/jobs/run-once`, { method: "POST" });
      await reload();
    } catch (e) {
      setError(String((e as Error).message));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold mb-1">Background jobs</h1>
        <p className="text-slate-600">
          Pull-based queue. Auto-refreshes every 5 seconds.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {(["queued", "running", "succeeded", "failed", "dead"] as const).map((s) => (
            <Card key={s}>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold">
                  {stats[s]}
                </div>
                <div className="text-xs uppercase font-medium text-slate-500">
                  {s}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Registered handlers</CardTitle>
          <CardDescription>
            These are the job kinds the worker will actually execute.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {stats?.kinds_registered.map((k) => (
            <Badge key={k} variant="outline">
              {k}
            </Badge>
          ))}
          <Button
            size="sm"
            variant="secondary"
            className="ml-auto"
            onClick={runOne}
            disabled={busy}
          >
            Run one queued job
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent jobs</CardTitle>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 && (
            <p className="text-slate-500 text-sm">Queue is empty.</p>
          )}
          <ul className="divide-y">
            {jobs.map((j) => (
              <li key={j.id} className="py-2 flex items-center gap-3">
                <Badge variant={STATUS_COLOR[j.status] || "outline"}>
                  {j.status}
                </Badge>
                <code className="text-xs">{j.kind}</code>
                <span className="text-xs text-slate-500">
                  attempt {j.attempt_n} · queued {formatDate(j.queued_at)}
                </span>
                {j.last_error && (
                  <span className="ml-auto text-xs text-red-600 truncate max-w-[260px]">
                    {j.last_error}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </>
  );
}
