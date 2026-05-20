"use client";

/**
 * Dashboard Admin — org-wide ops surface.
 *
 * Wired to the real api-core (via @/lib/eureka-api):
 *   GET /admin/statistics      → { statistics, tier_stats }
 *   GET /admin/audit?limit=20  → recent audit events
 *
 * Replaces the old defunct :8009 microservice page. No hardcoded
 * "15234 total_users" mock.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api, formatDate } from "@/lib/eureka-api";
import {
  Shield, Users, Activity, BookOpen, Server, AlertCircle, ArrowRight,
} from "lucide-react";

type Stats = {
  total_users?: number;
  active_users?: number;
  total_courses?: number;
  system_uptime?: number | string;
};

type TierRow = {
  name?: string;
  users?: number;
  courses?: number;
  status?: string;
};

type AdminStatistics = {
  statistics?: Stats;
  tier_stats?: TierRow[];
};

type AuditEvent = {
  id?: string;
  actor_user_id?: string | null;
  event_name?: string;
  severity?: string;
  created_at?: string;
  extra?: unknown;
};

function toText(x: unknown): string {
  if (x == null) return "";
  if (typeof x === "string") return x;
  try { return JSON.stringify(x); } catch { return String(x); }
}

function fmt(n: number | string | undefined): string {
  if (n === undefined || n === null || n === "") return "—";
  if (typeof n === "number") {
    if (!Number.isFinite(n)) return "—";
    return n.toLocaleString();
  }
  return String(n);
}

function StatusBadge({ status }: { status?: string }) {
  const s = (status || "").toLowerCase();
  const tone =
    s === "operational" || s === "ok" ? "default" :
    s === "degraded" ? "secondary" :
    s === "down" || s === "error" ? "destructive" :
    "outline";
  return <Badge variant={tone as never}>{s || "unknown"}</Badge>;
}

function SeverityBadge({ severity }: { severity?: string }) {
  const s = (severity || "").toLowerCase();
  const tone =
    s === "critical" || s === "high" ? "destructive" :
    s === "warn" || s === "warning" || s === "medium" ? "secondary" :
    s === "info" || s === "low" ? "default" :
    "outline";
  return <Badge variant={tone as never}>{s || "—"}</Badge>;
}

const OTHER_SHELLS: { href: string; title: string; subtitle: string }[] = [
  { href: "/admin", title: "/admin", subtitle: "Phase 14 ops" },
  { href: "/admin/cohorts", title: "/admin/cohorts", subtitle: "Phase 9" },
  { href: "/admin/jobs", title: "/admin/jobs", subtitle: "Phase 14.2" },
  { href: "/admin/audit", title: "/admin/audit", subtitle: "Phase 13.5" },
  { href: "/institutions", title: "/institutions", subtitle: "Phase 15" },
  { href: "/institutions/graduate-programs", title: "/institutions/graduate-programs", subtitle: "Phase 16.1" },
];

export default function DashboardAdminPage() {
  const [stats, setStats] = useState<AdminStatistics | null>(null);
  const [audit, setAudit] = useState<AuditEvent[]>([]);
  const [statsErr, setStatsErr] = useState<string | null>(null);
  const [auditErr, setAuditErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [s, a] = await Promise.all([
        api<AdminStatistics>("/admin/statistics").catch((e) => {
          setStatsErr(toText((e as Error).message));
          return null;
        }),
        api<AuditEvent[]>("/admin/audit?limit=20").catch((e) => {
          setAuditErr(toText((e as Error).message));
          return [] as AuditEvent[];
        }),
      ]);
      setStats(s);
      setAudit(Array.isArray(a) ? a : []);
      setLoading(false);
    })();
  }, []);

  const counters = stats?.statistics ?? {};
  const tierRows = Array.isArray(stats?.tier_stats) ? stats!.tier_stats! : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-bold">
          <Shield className="h-7 w-7 text-primary" />
          Admin
        </h1>
        <p className="text-muted-foreground mt-1">
          Org-wide ops. Wired to real{" "}
          <span className="font-mono text-xs">/admin/*</span> endpoints.
        </p>
      </div>

      {statsErr && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Could not load /admin/statistics</AlertTitle>
          <AlertDescription>{statsErr}</AlertDescription>
        </Alert>
      )}

      {/* Counter cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total users</p>
              <p className="text-3xl font-bold">{loading ? "—" : fmt(counters.total_users)}</p>
            </div>
            <Users className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active users</p>
              <p className="text-3xl font-bold">{loading ? "—" : fmt(counters.active_users)}</p>
            </div>
            <Activity className="h-8 w-8 text-emerald-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total courses</p>
              <p className="text-3xl font-bold">{loading ? "—" : fmt(counters.total_courses)}</p>
            </div>
            <BookOpen className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">System uptime</p>
              <p className="text-3xl font-bold">
                {loading
                  ? "—"
                  : counters.system_uptime !== undefined
                  ? `${counters.system_uptime}${typeof counters.system_uptime === "number" ? "%" : ""}`
                  : "—"}
              </p>
            </div>
            <Server className="h-8 w-8 text-purple-500" />
          </CardContent>
        </Card>
      </div>

      {/* Per-tier stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Per-tier stats</CardTitle>
          <CardDescription>
            From <span className="font-mono text-xs">/admin/statistics.tier_stats</span>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : tierRows.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tier stats returned.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground border-b">
                  <tr>
                    <th className="py-2 pr-3 font-medium">Tier</th>
                    <th className="py-2 pr-3 font-medium">Users</th>
                    <th className="py-2 pr-3 font-medium">Courses</th>
                    <th className="py-2 pr-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tierRows.map((row, i) => (
                    <tr key={(row.name || "") + i} className="border-b last:border-0">
                      <td className="py-2 pr-3 font-medium">{toText(row.name) || "—"}</td>
                      <td className="py-2 pr-3 tabular-nums">{fmt(row.users)}</td>
                      <td className="py-2 pr-3 tabular-nums">{fmt(row.courses)}</td>
                      <td className="py-2 pr-3">
                        <StatusBadge status={row.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent audit events */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent audit events</CardTitle>
          <CardDescription>
            From <span className="font-mono text-xs">/admin/audit?limit=20</span>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {auditErr && (
            <Alert variant="destructive" className="mb-3">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Could not load /admin/audit</AlertTitle>
              <AlertDescription>{auditErr}</AlertDescription>
            </Alert>
          )}
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : audit.length === 0 ? (
            <p className="text-sm text-muted-foreground">No audit events.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground border-b">
                  <tr>
                    <th className="py-2 pr-3 font-medium">When</th>
                    <th className="py-2 pr-3 font-medium">Event</th>
                    <th className="py-2 pr-3 font-medium">Severity</th>
                    <th className="py-2 pr-3 font-medium">Actor</th>
                  </tr>
                </thead>
                <tbody>
                  {audit.map((ev, i) => (
                    <tr key={ev.id || i} className="border-b last:border-0">
                      <td className="py-2 pr-3 text-xs text-muted-foreground">
                        {formatDate(ev.created_at)}
                      </td>
                      <td className="py-2 pr-3 font-mono text-xs">
                        {toText(ev.event_name) || "—"}
                      </td>
                      <td className="py-2 pr-3">
                        <SeverityBadge severity={ev.severity} />
                      </td>
                      <td className="py-2 pr-3 font-mono text-xs">
                        {ev.actor_user_id ? ev.actor_user_id.slice(0, 8) + "…" : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Other admin shells */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Other admin shells</CardTitle>
          <CardDescription>
            Each shell is wired to its own Phase&apos;s endpoints.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
          {OTHER_SHELLS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="rounded-md border bg-card p-3 hover:bg-accent flex items-center justify-between"
            >
              <div className="min-w-0">
                <div className="font-mono text-xs truncate">{s.title}</div>
                <div className="text-xs text-muted-foreground">{s.subtitle}</div>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
