"use client";

/**
 * A single worker's Skill Passport — every tracked skill with its demonstrated
 * mastery, when it was last verified, and how fresh that proof still is.
 * Actionable items (lapsed, then expiring, then below target) come first.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api } from "@/lib/eureka-api";
import { ArrowLeft, BadgeCheck, Clock, AlertTriangle, CircleDashed, Minus } from "lucide-react";

type Skill = {
  code: string;
  name: string;
  framework: string;
  tier: string | null;
  bloom: string | null;
  mastery: number;
  attempts: number;
  last_practiced_at: string | null;
  next_review_at: string | null;
  bucket: "verified" | "expiring" | "lapsed" | "below" | "unverified";
  freshness: number | null;
  fresh_basis: string;
  days_since: number | null;
  days_until_due: number | null;
};
type Passport = {
  threshold: number;
  worker: {
    user_id: string;
    name: string;
    email: string | null;
    team_label: string | null;
    role_label: string | null;
    partnership_name: string | null;
  };
  summary: { verified: number; expiring: number; lapsed: number; below: number; unverified: number };
  n_skills: number;
  avg_mastery: number | null;
  skills: Skill[];
};

const BUCKET_META: Record<Skill["bucket"], { label: string; icon: typeof BadgeCheck; text: string; chip: string; bar: string }> = {
  lapsed: { label: "Lapsed", icon: AlertTriangle, text: "text-red-700", chip: "border-red-200 bg-red-50 text-red-700", bar: "bg-red-500" },
  expiring: { label: "Expiring soon", icon: Clock, text: "text-amber-700", chip: "border-amber-200 bg-amber-50 text-amber-700", bar: "bg-amber-500" },
  below: { label: "Below target", icon: Minus, text: "text-slate-600", chip: "border-slate-200 bg-slate-100 text-slate-600", bar: "bg-slate-400" },
  verified: { label: "Verified", icon: BadgeCheck, text: "text-emerald-700", chip: "border-emerald-200 bg-emerald-50 text-emerald-700", bar: "bg-emerald-500" },
  unverified: { label: "Unverified", icon: CircleDashed, text: "text-slate-500", chip: "border-slate-200 bg-slate-50 text-slate-500", bar: "bg-slate-300" },
};

function ago(days: number | null): string {
  if (days == null) return "never verified";
  if (days === 0) return "verified today";
  if (days === 1) return "verified yesterday";
  if (days < 30) return `verified ${days}d ago`;
  if (days < 365) return `verified ${Math.round(days / 30)}mo ago`;
  return `verified ${Math.round(days / 365)}y ago`;
}
function dueLabel(s: Skill): string | null {
  if (s.days_until_due == null) return null;
  if (s.days_until_due < 0) return `overdue by ${Math.abs(s.days_until_due)}d`;
  if (s.days_until_due === 0) return "review due today";
  return `review in ${s.days_until_due}d`;
}

export default function WorkerPassport() {
  const params = useParams<{ id: string }>();
  const id = params?.id as string;
  const [data, setData] = useState<Passport | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    api<Passport>(`/institutions/passport/${id}?threshold=0.7&due_soon_days=14`)
      .then(setData)
      .catch((e) => setError(String((e as Error).message)));
  }, [id]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  if (!data) return <p className="text-slate-500">Loading…</p>;

  const w = data.worker;
  const initials = w.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="max-w-4xl space-y-6">
      <Link href="/institutions/passport" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-amber-700">
        <ArrowLeft className="h-4 w-4" /> All passports
      </Link>

      {/* Passport header */}
      <Card className="overflow-hidden">
        <div className="flex items-center gap-4 border-b bg-gradient-to-r from-amber-50 to-white p-6">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-amber-600 text-xl font-bold text-white">
            {initials || "?"}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{w.name}</h1>
              <BadgeCheck className="h-5 w-5 text-amber-600" />
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-600">
              {w.role_label && <Badge variant="secondary">{w.role_label}</Badge>}
              {w.team_label && <span>{w.team_label}</span>}
              {w.partnership_name && <span className="text-slate-400">· {w.partnership_name}</span>}
            </div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-3xl font-bold leading-none">
              {data.avg_mastery != null ? `${Math.round(data.avg_mastery * 100)}%` : "—"}
            </div>
            <div className="text-[10px] uppercase tracking-wide text-slate-500">avg mastery</div>
          </div>
        </div>
        <CardContent className="grid grid-cols-2 gap-3 p-4 md:grid-cols-5">
          {(["verified", "expiring", "lapsed", "below", "unverified"] as const).map((k) => {
            const m = BUCKET_META[k];
            const Icon = m.icon;
            return (
              <div key={k} className="rounded-lg border p-3 text-center">
                <Icon className={`mx-auto h-4 w-4 ${m.text}`} />
                <div className="mt-1 text-2xl font-bold">{data.summary[k]}</div>
                <div className="text-[11px] text-slate-500">{m.label}</div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Skills — actionable first */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Demonstrated skills</CardTitle>
        </CardHeader>
        <CardContent>
          {data.skills.length === 0 && (
            <p className="text-sm text-slate-600">
              No graded skills yet. This worker’s passport fills in as they complete graded practice.
            </p>
          )}
          <ul className="space-y-2">
            {data.skills.map((s) => {
              const m = BUCKET_META[s.bucket];
              const due = dueLabel(s);
              return (
                <li key={s.code} className="rounded-lg border p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${m.chip}`}>
                      <m.icon className="h-3 w-3" /> {m.label}
                    </span>
                    <span className="font-medium">{s.name}</span>
                    <Badge variant="outline" className="uppercase text-[10px]">{s.framework}</Badge>
                    {s.bloom && <span className="text-[11px] text-slate-400">Bloom: {s.bloom}</span>}
                    <span className="ml-auto text-sm font-semibold">{Math.round(s.mastery * 100)}%</span>
                  </div>

                  {/* Mastery bar */}
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className={m.bar} style={{ width: `${Math.round(s.mastery * 100)}%`, height: "100%" }} />
                  </div>

                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-500">
                    <span>{ago(s.days_since)}</span>
                    {due && (
                      <span className={s.days_until_due != null && s.days_until_due < 0 ? "text-red-600" : s.bucket === "expiring" ? "text-amber-600" : ""}>
                        · {due}
                      </span>
                    )}
                    <span>· {s.attempts} attempt{s.attempts === 1 ? "" : "s"}</span>
                    {s.fresh_basis === "recency" && <span className="text-slate-400">· freshness approx. (no SRS schedule)</span>}
                  </div>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>

      <p className="text-xs text-slate-400">
        A skill is <strong>verified</strong> when demonstrated mastery is at or above the {Math.round(data.threshold * 100)}% bar
        and its spaced-repetition review isn’t yet due; <strong>lapsed</strong> once that review date passes without
        re-demonstration. This is proof of current competence — not course completion.
      </p>
    </div>
  );
}
