"use client";

/**
 * Dashboard Pedagogy — explains how EUREKA actually teaches.
 *
 * Wired to the real api-core (via @/lib/eureka-api):
 *   GET /skills?limit=100  → first 100 skills from the Phase 4.2 skill graph
 *
 * Replaces the old defunct :8040 microservice page. No mock "active models"
 * stats, no fabricated learner counts.
 */

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api } from "@/lib/eureka-api";
import {
  BookOpen, Network, Layers, GitBranch, AlertCircle, ExternalLink,
} from "lucide-react";

type Skill = {
  id: string;
  framework?: string;
  code?: string;
  name?: string;
  bloom_level?: string | null;
  description?: string | null;
};

function toText(x: unknown): string {
  if (x == null) return "";
  if (typeof x === "string") return x;
  try { return JSON.stringify(x); } catch { return String(x); }
}

const GITHUB_BASE = "https://github.com/alovladi007/EUREKA/blob/main";

type GraphStats = {
  skills?: number;
  prerequisites?: number;
  frameworks?: number;
  cross_framework_edges?: number;
};

export default function DashboardPedagogyPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [graphStats, setGraphStats] = useState<GraphStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [body, stats] = await Promise.all([
          api<Skill[]>("/skills?limit=100").catch(() => [] as Skill[]),
          api<GraphStats>("/skills/graph/stats").catch(() => null),
        ]);
        setSkills(Array.isArray(body) ? body : []);
        setGraphStats(stats);
      } catch (e) {
        setErr(toText((e as Error).message));
        setSkills([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const frameworks = Array.from(
    new Set(skills.map((s) => s.framework).filter(Boolean) as string[]),
  );
  const blooms = Array.from(
    new Set(skills.map((s) => s.bloom_level).filter(Boolean) as string[]),
  );

  const frameworkCounts = frameworks
    .map((fw) => ({
      framework: fw,
      count: skills.filter((s) => s.framework === fw).length,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-bold">
          <BookOpen className="h-7 w-7 text-primary" />
          Pedagogy
        </h1>
        <p className="text-muted-foreground mt-1">
          How EUREKA actually teaches — driven by the real Phase 4.2 skill graph + Phase 6 tutor system.
        </p>
      </div>

      {err && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Could not load skill graph</AlertTitle>
          <AlertDescription>{err}</AlertDescription>
        </Alert>
      )}

      {/* Counter cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total skills</p>
              <p className="text-3xl font-bold">{loading ? "—" : skills.length}</p>
            </div>
            <Network className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Frameworks</p>
              <p className="text-3xl font-bold">{loading ? "—" : frameworks.length}</p>
            </div>
            <Layers className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Bloom levels covered</p>
              <p className="text-3xl font-bold">{loading ? "—" : blooms.length}</p>
            </div>
            <Layers className="h-8 w-8 text-emerald-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Prerequisite edges</p>
              <p className="text-3xl font-bold">
                {loading ? "—" : (graphStats?.prerequisites ?? 0)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {loading
                  ? " "
                  : `${graphStats?.cross_framework_edges ?? 0} cross-framework · live from the skill graph`}
              </p>
            </div>
            <GitBranch className="h-8 w-8 text-purple-500" />
          </CardContent>
        </Card>
      </div>

      {/* Learning model */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Learning model</CardTitle>
          <CardDescription>
            The actual design decisions behind EUREKA&apos;s instructional system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 text-sm list-decimal pl-5">
            <li>
              <span className="font-medium">Phase 4.2 skill graph</span> — 8 frameworks
              (CCSS, NGSS, AP, ABET, USMLE Step 1, MBE, FE Electrical+Civil, MBA Core)
              with directed prereq edges and cross-tier links.
            </li>
            <li>
              <span className="font-medium">Phase 7.2 IRT 2-PL calibration</span> —
              difficulty + discrimination per item, learned from real attempt logs.
            </li>
            <li>
              <span className="font-medium">Phase 7.5 FSRS-lite spaced repetition</span> —
              4-state rating model.
            </li>
            <li>
              <span className="font-medium">Phase 6 Socratic hint-ladder</span> — Claude
              tool-use loop with auto-escalating hints.
            </li>
            <li>
              <span className="font-medium">Phase 4.5 mastery-based recommendations</span> —
              5-signal scorer.
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* Live skill graph */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Live skill graph (top 40)</CardTitle>
          <CardDescription>
            Sampled live from <span className="font-mono text-xs">/skills?limit=100</span>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : skills.length === 0 ? (
            <p className="text-sm text-muted-foreground">No skills returned by the API.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 40).map((s) => (
                <Badge key={s.id} variant="outline" className="font-mono text-[11px]">
                  {(s.framework || "?") + ": " + (s.code || s.id.slice(0, 6))}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Framework breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Framework breakdown</CardTitle>
          <CardDescription>Count of skills per framework in this sample.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : frameworkCounts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No frameworks to display.</p>
          ) : (
            <ul className="divide-y text-sm">
              {frameworkCounts.map((row) => (
                <li
                  key={row.framework}
                  className="py-2 flex items-center justify-between"
                >
                  <span className="font-medium">{row.framework}</span>
                  <span className="tabular-nums text-muted-foreground">{row.count}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* References */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">References</CardTitle>
          <CardDescription>
            Anchor docs — the source of truth for every claim on this page.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-2 text-sm">
          <a
            href={`${GITHUB_BASE}/docs/ARCHITECTURE.md`}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border bg-card p-3 hover:bg-accent flex items-center justify-between"
          >
            <span className="font-mono text-xs">docs/ARCHITECTURE.md</span>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
          </a>
          <a
            href={`${GITHUB_BASE}/docs/STATUS.md`}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border bg-card p-3 hover:bg-accent flex items-center justify-between"
          >
            <span className="font-mono text-xs">docs/STATUS.md</span>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
