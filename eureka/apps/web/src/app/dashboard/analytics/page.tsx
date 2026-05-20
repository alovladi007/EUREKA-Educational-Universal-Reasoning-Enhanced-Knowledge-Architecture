"use client";
/**
 * EUREKA - Learning Analytics
 * Real performance data wired to /analytics/me/* and /attempts/me.
 * No localStorage, no EXAM_KEYS, no client-side history aggregation.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
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
import {
  Brain,
  Target,
  TrendingUp,
  TrendingDown,
  Award,
  ArrowUpDown,
} from "lucide-react";

interface SkillRow {
  skill_code: string;
  mastery: number;
  attempts: number;
  correct_rate?: number;
  p50_time_ms?: number;
}

interface StrengthsWeaknesses {
  strongest?: SkillRow[];
  weakest?: SkillRow[];
}

interface AttemptRow {
  id: string;
  item_id?: string;
  correct?: boolean;
  time_ms?: number;
  created_at?: string;
  skill_code?: string;
}

interface MockRow {
  id: string;
  blueprint_id?: string;
  status?: string;
  score_scaled?: number | null;
  started_at?: string;
  completed_at?: string | null;
}

type SortKey = "skill_code" | "mastery" | "attempts" | "correct_rate";
type SortDir = "asc" | "desc";

function fmtPct(v: number | undefined): string {
  if (typeof v !== "number") return "—";
  return `${Math.round(v * 100)}%`;
}

function fmtDate(iso?: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function MasteryBar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(1, value ?? 0));
  const w = Math.round(pct * 100);
  const color =
    pct >= 0.8
      ? "bg-green-500"
      : pct >= 0.5
        ? "bg-amber-500"
        : "bg-red-500";
  return (
    <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
      <div
        className={`h-full ${color} transition-all`}
        style={{ width: `${w}%` }}
      />
    </div>
  );
}

export default function AnalyticsPage() {
  const [skills, setSkills] = useState<SkillRow[]>([]);
  const [sw, setSw] = useState<StrengthsWeaknesses>({});
  const [attempts, setAttempts] = useState<AttemptRow[]>([]);
  const [mocks, setMocks] = useState<MockRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [sortKey, setSortKey] = useState<SortKey>("mastery");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    let s: SkillRow[] = [];
    let strengthsWeaknesses: StrengthsWeaknesses = {};
    let att: AttemptRow[] = [];
    let mk: MockRow[] = [];
    try {
      const r = await api<unknown>("/analytics/me/skills");
      s = Array.isArray(r) ? (r as SkillRow[]) : [];
    } catch (e) {
      s = [];
      setError(String((e as Error).message));
    }
    try {
      const r = await api<unknown>("/analytics/me/strengths-weaknesses");
      strengthsWeaknesses =
        r && typeof r === "object" ? (r as StrengthsWeaknesses) : {};
    } catch {
      strengthsWeaknesses = {};
    }
    try {
      const r = await api<unknown>("/attempts/me?limit=50");
      att = Array.isArray(r) ? (r as AttemptRow[]) : [];
    } catch {
      att = [];
    }
    try {
      const r = await api<unknown>("/mock-attempts/me?limit=10");
      mk = Array.isArray(r) ? (r as MockRow[]) : [];
    } catch {
      mk = [];
    }
    setSkills(s);
    setSw(strengthsWeaknesses);
    setAttempts(att);
    setMocks(mk);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const safeSkills = Array.isArray(skills) ? skills : [];
  const safeAttempts = Array.isArray(attempts) ? attempts : [];
  const safeMocks = Array.isArray(mocks) ? mocks : [];
  const strongest = Array.isArray(sw.strongest) ? sw.strongest : [];
  const weakest = Array.isArray(sw.weakest) ? sw.weakest : [];

  const totalSkills = safeSkills.length;
  const avgMastery =
    totalSkills > 0
      ? safeSkills.reduce((acc, s) => acc + (s.mastery ?? 0), 0) / totalSkills
      : 0;
  const totalAttempts = safeSkills.reduce(
    (acc, s) => acc + (s.attempts ?? 0),
    0,
  );
  const mockCount = safeMocks.length;

  const toggleSort = (k: SortKey) => {
    if (k === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(k);
      setSortDir(k === "skill_code" ? "asc" : "desc");
    }
  };

  const sortedSkills = useMemo(() => {
    const copy = [...safeSkills];
    copy.sort((a, b) => {
      const av = (a as Record<string, unknown>)[sortKey];
      const bv = (b as Record<string, unknown>)[sortKey];
      if (typeof av === "string" && typeof bv === "string") {
        return sortDir === "asc"
          ? av.localeCompare(bv)
          : bv.localeCompare(av);
      }
      const an = typeof av === "number" ? av : 0;
      const bn = typeof bv === "number" ? bv : 0;
      return sortDir === "asc" ? an - bn : bn - an;
    });
    return copy;
  }, [safeSkills, sortKey, sortDir]);

  const SortableTh = ({
    label,
    k,
  }: {
    label: string;
    k: SortKey;
  }) => (
    <th
      className="text-left py-2 px-2 cursor-pointer select-none hover:bg-muted/50"
      onClick={() => toggleSort(k)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <ArrowUpDown className="w-3 h-3 opacity-50" />
        {sortKey === k && (
          <span className="text-[10px] text-muted-foreground">
            {sortDir === "asc" ? "▲" : "▼"}
          </span>
        )}
      </span>
    </th>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Learning Analytics</h1>
        <p className="text-muted-foreground">
          Real performance data wired to /analytics/me/* and /attempts/me
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
        </div>
      )}

      {!loading && (
        <>
          {/* Counters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Skills tracked
                </CardTitle>
                <Brain className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSkills}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg mastery
                </CardTitle>
                <Award className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(avgMastery * 100)}%
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total attempts
                </CardTitle>
                <Target className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAttempts}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Mock exams taken
                </CardTitle>
                <Award className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockCount}</div>
              </CardContent>
            </Card>
          </div>

          {/* Strengths / weaknesses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" /> Top 5 strongest
                </CardTitle>
                <CardDescription>
                  From /analytics/me/strengths-weaknesses · strongest
                </CardDescription>
              </CardHeader>
              <CardContent>
                {strongest.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Practice some skills to see strengths.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {strongest.slice(0, 5).map((s) => (
                      <li key={s.skill_code} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{s.skill_code}</span>
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            {fmtPct(s.mastery)}
                          </Badge>
                        </div>
                        <MasteryBar value={s.mastery} />
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center gap-2">
                  <TrendingDown className="w-5 h-5" /> Bottom 5 weakest
                </CardTitle>
                <CardDescription>
                  From /analytics/me/strengths-weaknesses · weakest
                </CardDescription>
              </CardHeader>
              <CardContent>
                {weakest.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No weak spots detected yet.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {weakest.slice(0, 5).map((s) => (
                      <li key={s.skill_code} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{s.skill_code}</span>
                          <Badge variant="destructive">
                            {fmtPct(s.mastery)}
                          </Badge>
                        </div>
                        <MasteryBar value={s.mastery} />
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          {/* All skills sortable table */}
          <Card>
            <CardHeader>
              <CardTitle>All skills</CardTitle>
              <CardDescription>
                Sortable table from /analytics/me/skills — click a header to
                sort.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sortedSkills.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No skill rows yet.
                </p>
              ) : (
                <div className="overflow-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b text-xs text-muted-foreground">
                      <tr>
                        <SortableTh label="code" k="skill_code" />
                        <SortableTh label="mastery" k="mastery" />
                        <SortableTh label="attempts" k="attempts" />
                        <SortableTh label="correct_rate" k="correct_rate" />
                      </tr>
                    </thead>
                    <tbody>
                      {sortedSkills.map((s) => (
                        <tr key={s.skill_code} className="border-b">
                          <td className="py-2 px-2 font-mono text-xs">
                            {s.skill_code}
                          </td>
                          <td className="py-2 px-2 min-w-[160px]">
                            <div className="flex items-center gap-2">
                              <span className="text-xs w-10">
                                {fmtPct(s.mastery)}
                              </span>
                              <div className="flex-1">
                                <MasteryBar value={s.mastery} />
                              </div>
                            </div>
                          </td>
                          <td className="py-2 px-2">{s.attempts ?? 0}</td>
                          <td className="py-2 px-2">
                            {typeof s.correct_rate === "number"
                              ? fmtPct(s.correct_rate)
                              : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent attempts */}
          <Card>
            <CardHeader>
              <CardTitle>Recent attempts</CardTitle>
              <CardDescription>
                Last 50 from /attempts/me
              </CardDescription>
            </CardHeader>
            <CardContent>
              {safeAttempts.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No attempts recorded yet.
                </p>
              ) : (
                <div className="overflow-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b text-xs text-muted-foreground">
                      <tr>
                        <th className="text-left py-2 px-2">created_at</th>
                        <th className="text-left py-2 px-2">item_id</th>
                        <th className="text-left py-2 px-2">correct</th>
                        <th className="text-left py-2 px-2">time_ms</th>
                      </tr>
                    </thead>
                    <tbody>
                      {safeAttempts.map((a) => (
                        <tr key={a.id} className="border-b">
                          <td className="py-2 px-2 text-xs">
                            {fmtDate(a.created_at)}
                          </td>
                          <td className="py-2 px-2 font-mono text-xs">
                            {(a.item_id ?? "").slice(0, 8) || "—"}
                          </td>
                          <td className="py-2 px-2">
                            {a.correct ? (
                              <span className="text-green-600">✓</span>
                            ) : (
                              <span className="text-red-600">✗</span>
                            )}
                          </td>
                          <td className="py-2 px-2 text-xs">
                            {typeof a.time_ms === "number" ? a.time_ms : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mock exam history */}
          <Card>
            <CardHeader>
              <CardTitle>Mock exam history</CardTitle>
              <CardDescription>
                Last 10 from /mock-attempts/me
              </CardDescription>
            </CardHeader>
            <CardContent>
              {safeMocks.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No mock exam attempts yet.
                </p>
              ) : (
                <div className="overflow-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b text-xs text-muted-foreground">
                      <tr>
                        <th className="text-left py-2 px-2">started_at</th>
                        <th className="text-left py-2 px-2">status</th>
                        <th className="text-left py-2 px-2">score_scaled</th>
                      </tr>
                    </thead>
                    <tbody>
                      {safeMocks.map((m) => (
                        <tr key={m.id} className="border-b">
                          <td className="py-2 px-2 text-xs">
                            {fmtDate(m.started_at)}
                          </td>
                          <td className="py-2 px-2">
                            <Badge variant="outline" className="text-[10px]">
                              {m.status || "—"}
                            </Badge>
                          </td>
                          <td className="py-2 px-2">
                            {typeof m.score_scaled === "number"
                              ? m.score_scaled
                              : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
