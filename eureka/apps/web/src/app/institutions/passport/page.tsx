"use client";

/**
 * Skill Passport — EUREKA's L&D differentiator.
 *
 * Every other corporate learning platform reports course *completion*. This
 * reports demonstrated *competence that stays fresh*: for every worker, how
 * many skills they can currently prove, which proofs are about to lapse, and
 * which have already lapsed and need re-verifying. All from real graded
 * mastery + the spaced-repetition scheduler — no invented numbers.
 */

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api, API_URL, API_PREFIX, getToken } from "@/lib/eureka-api";
import { BadgeCheck, Clock, AlertTriangle, CircleDashed, Minus, Download, ChevronRight } from "lucide-react";

type Worker = {
  user_id: string;
  name: string;
  email: string | null;
  team_label: string | null;
  role_label: string | null;
  partnership_name: string | null;
  n_skills: number;
  avg_mastery: number | null;
  verified: number;
  expiring: number;
  lapsed: number;
  below: number;
  unverified: number;
};
type Roster = {
  generated_at: string;
  threshold: number;
  due_soon_days: number;
  n_workers: number;
  totals: { verified: number; expiring: number; lapsed: number; below: number; unverified: number };
  workers: Worker[];
};

const BUCKETS = [
  { key: "verified", label: "Verified", icon: BadgeCheck, bar: "bg-emerald-500", text: "text-emerald-700", chip: "bg-emerald-50 text-emerald-700 border-emerald-200", hint: "can demonstrate now" },
  { key: "expiring", label: "Expiring soon", icon: Clock, bar: "bg-amber-500", text: "text-amber-700", chip: "bg-amber-50 text-amber-700 border-amber-200", hint: "re-verify before it lapses" },
  { key: "lapsed", label: "Lapsed", icon: AlertTriangle, bar: "bg-red-500", text: "text-red-700", chip: "bg-red-50 text-red-700 border-red-200", hint: "was competent — proof expired" },
  { key: "below", label: "Below target", icon: Minus, bar: "bg-slate-400", text: "text-slate-600", chip: "bg-slate-100 text-slate-600 border-slate-200", hint: "not yet at threshold" },
  { key: "unverified", label: "Unverified", icon: CircleDashed, bar: "bg-slate-200", text: "text-slate-500", chip: "bg-slate-50 text-slate-500 border-slate-200", hint: "no graded attempt yet" },
] as const;

export default function SkillPassportRoster() {
  const [threshold, setThreshold] = useState(0.7);
  const [data, setData] = useState<Roster | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await api<Roster>(`/institutions/passport?threshold=${threshold}&due_soon_days=14`));
    } catch (e) {
      setError(String((e as Error).message));
    } finally {
      setLoading(false);
    }
  }, [threshold]);

  useEffect(() => { load(); }, [load]);

  async function exportCsv() {
    const res = await fetch(`${API_URL}${API_PREFIX}/institutions/passport/export.csv?threshold=${threshold}`, {
      headers: { Authorization: `Bearer ${getToken() ?? ""}` },
    });
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "skill-passport-roster.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const totals = data?.totals;

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-7 w-7 text-amber-600" />
            <h1 className="text-3xl font-bold">Skill Passport</h1>
            <Badge variant="outline" className="uppercase text-[10px] tracking-wide">Proof of skill</Badge>
          </div>
          <p className="mt-1 max-w-2xl text-slate-600">
            Not who <em>finished a course</em> — who can <strong>demonstrate the skill right now</strong>, and
            whose proof is about to lapse. Built from graded mastery and the spaced-repetition scheduler.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500">Mastery bar</label>
          <select
            value={threshold}
            onChange={(e) => setThreshold(parseFloat(e.target.value))}
            className="h-9 rounded-md border border-slate-300 bg-white px-2 text-sm"
            aria-label="Mastery threshold"
          >
            {[0.6, 0.7, 0.8, 0.9].map((t) => (
              <option key={t} value={t}>{Math.round(t * 100)}%</option>
            ))}
          </select>
          <Button variant="outline" size="sm" onClick={exportCsv} className="gap-1">
            <Download className="h-4 w-4" /> CSV
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Org-wide competence totals */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {BUCKETS.map((b) => {
          const v = totals ? (totals as Record<string, number>)[b.key] : 0;
          const Icon = b.icon;
          return (
            <Card key={b.key}>
              <CardContent className="pt-5">
                <div className="flex items-center justify-between">
                  <Icon className={`h-4 w-4 ${b.text}`} />
                  <span className="text-2xl font-bold">{v}</span>
                </div>
                <div className="mt-1 text-xs font-medium">{b.label}</div>
                <div className="text-[11px] text-slate-500">{b.hint}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Workforce</CardTitle>
            {data && (
              <CardDescription>
                {data.n_workers} active seat{data.n_workers === 1 ? "" : "s"} · threshold {Math.round(data.threshold * 100)}% ·
                lapses/expiries surfaced first
              </CardDescription>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading && <p className="text-sm text-slate-500">Loading…</p>}
          {!loading && data && data.workers.length === 0 && (
            <div className="text-sm text-slate-600 space-y-1">
              <p>No active seats yet. Assign workers to a partnership, and their skill passports build automatically as they practice and get graded.</p>
            </div>
          )}
          <ul className="divide-y">
            {data?.workers.map((w) => (
              <li key={w.user_id}>
                <Link
                  href={`/institutions/passport/${w.user_id}`}
                  className="group grid grid-cols-1 items-center gap-3 py-3 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1.4fr)_auto]"
                >
                  {/* Identity */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium group-hover:underline">{w.name}</span>
                      {w.role_label && <Badge variant="secondary">{w.role_label}</Badge>}
                      {w.team_label && <span className="text-xs text-slate-500">{w.team_label}</span>}
                    </div>
                    <div className="text-xs text-slate-500">
                      {w.n_skills} skill{w.n_skills === 1 ? "" : "s"} tracked
                      {w.avg_mastery != null && <> · avg mastery {Math.round(w.avg_mastery * 100)}%</>}
                    </div>
                  </div>

                  {/* Competence bar */}
                  <div className="min-w-0">
                    <CompetenceBar w={w} />
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px]">
                      {w.lapsed > 0 && <span className="text-red-600">{w.lapsed} lapsed</span>}
                      {w.expiring > 0 && <span className="text-amber-600">{w.expiring} expiring</span>}
                      {w.verified > 0 && <span className="text-emerald-700">{w.verified} verified</span>}
                      {w.below > 0 && <span className="text-slate-500">{w.below} below</span>}
                      {w.unverified > 0 && <span className="text-slate-400">{w.unverified} unverified</span>}
                    </div>
                  </div>

                  <ChevronRight className="hidden h-4 w-4 text-slate-400 group-hover:text-amber-700 md:block" />
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <p className="text-xs text-slate-400">
        Mastery comes from graded practice (BKT/IRT). “Fresh vs lapsed” is driven by each skill’s
        spaced-repetition review date — a competency is <em>lapsed</em> once its scheduled review passes without
        re-demonstration. No completion percentages, no seat-time.
      </p>
    </div>
  );
}

function CompetenceBar({ w }: { w: Worker }) {
  const total = Math.max(1, w.verified + w.expiring + w.lapsed + w.below + w.unverified);
  const segs = [
    { n: w.verified, cls: "bg-emerald-500" },
    { n: w.expiring, cls: "bg-amber-500" },
    { n: w.lapsed, cls: "bg-red-500" },
    { n: w.below, cls: "bg-slate-400" },
    { n: w.unverified, cls: "bg-slate-200" },
  ];
  return (
    <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100" role="img" aria-label="competence breakdown">
      {segs.map((s, i) =>
        s.n > 0 ? <div key={i} className={s.cls} style={{ width: `${(s.n / total) * 100}%` }} /> : null,
      )}
    </div>
  );
}
