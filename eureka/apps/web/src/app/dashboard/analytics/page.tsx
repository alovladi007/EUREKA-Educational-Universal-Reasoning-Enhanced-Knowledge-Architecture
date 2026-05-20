"use client";

import { useEffect, useState } from "react";
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

type SkillRow = {
  skill_code: string;
  mastery: number;
  attempts: number;
  correct_rate: number;
  p50_time_ms?: number | null;
};

type StrengthsWeaknesses = {
  // /analytics/me/strengths-weaknesses returns "strongest" + "weakest"
  // (Phase 7.3 contract). Keep aliases for older agent-written code.
  strongest: SkillRow[];
  weakest: SkillRow[];
};

type SortKey = "skill_code" | "mastery" | "attempts" | "correct_rate";

function Bar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded">
      <div
        className="h-2 bg-primary rounded"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function AnalyticsPage() {
  const [skills, setSkills] = useState<SkillRow[]>([]);
  const [sw, setSw] = useState<StrengthsWeaknesses | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("mastery");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    (async () => {
      try {
        const [s, w] = await Promise.all([
          api<SkillRow[]>("/analytics/me/skills"),
          api<StrengthsWeaknesses>("/analytics/me/strengths-weaknesses"),
        ]);
        setSkills(Array.isArray(s) ? s : []);
        setSw(w ?? { strongest: [], weakest: [] });
      } catch (e) {
        setError(String((e as Error).message));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalSkills = skills.length;
  const avgMastery =
    totalSkills > 0
      ? (
          (skills.reduce((s, r) => s + (r.mastery ?? 0), 0) / totalSkills) *
          100
        ).toFixed(1)
      : "0.0";
  const totalAttempts = skills.reduce((s, r) => s + (r.attempts ?? 0), 0);

  function toggleSort(k: SortKey) {
    if (k === sortKey) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(k);
      setSortDir(k === "skill_code" ? "asc" : "desc");
    }
  }

  const sortedSkills = [...skills].sort((a, b) => {
    const av = a[sortKey] as number | string;
    const bv = b[sortKey] as number | string;
    if (av == null) return 1;
    if (bv == null) return -1;
    if (typeof av === "string" && typeof bv === "string") {
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    }
    return sortDir === "asc"
      ? (av as number) - (bv as number)
      : (bv as number) - (av as number);
  });

  const strengths = (sw?.strongest ?? []).slice(0, 5);
  const weaknesses = (sw?.weakest ?? []).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          Mastery, strengths, and weaknesses across the skills you've practiced.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Failed to load analytics</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Skills tracked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSkills}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Average mastery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgMastery}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total attempts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalAttempts.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Strengths</CardTitle>
            <CardDescription>Your top 5 skills</CardDescription>
          </CardHeader>
          <CardContent>
            {strengths.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No strength data yet.
              </p>
            ) : (
              <div className="space-y-3">
                {strengths.map((s) => (
                  <div key={s.skill_code} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{s.skill_code}</span>
                      <Badge variant="outline">
                        {((s.mastery ?? 0) * 100).toFixed(0)}%
                      </Badge>
                    </div>
                    <Bar value={s.mastery ?? 0} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weaknesses</CardTitle>
            <CardDescription>Your bottom 5 skills</CardDescription>
          </CardHeader>
          <CardContent>
            {weaknesses.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No weakness data yet.
              </p>
            ) : (
              <div className="space-y-3">
                {weaknesses.map((s) => (
                  <div key={s.skill_code} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{s.skill_code}</span>
                      <Badge variant="outline">
                        {((s.mastery ?? 0) * 100).toFixed(0)}%
                      </Badge>
                    </div>
                    <Bar value={s.mastery ?? 0} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All skills</CardTitle>
          <CardDescription>
            Click any header to sort.
            {loading && " Loading…"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedSkills.length === 0 && !loading ? (
            <p className="text-sm text-muted-foreground">
              No skill data available.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase text-muted-foreground">
                    <th
                      className="py-2 px-3 cursor-pointer"
                      onClick={() => toggleSort("skill_code")}
                    >
                      Skill
                    </th>
                    <th
                      className="py-2 px-3 cursor-pointer"
                      onClick={() => toggleSort("mastery")}
                    >
                      Mastery
                    </th>
                    <th
                      className="py-2 px-3 cursor-pointer"
                      onClick={() => toggleSort("attempts")}
                    >
                      Attempts
                    </th>
                    <th
                      className="py-2 px-3 cursor-pointer"
                      onClick={() => toggleSort("correct_rate")}
                    >
                      Correct rate
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedSkills.map((s) => (
                    <tr key={s.skill_code} className="border-b last:border-b-0">
                      <td className="py-2 px-3 font-mono text-xs">
                        {s.skill_code}
                      </td>
                      <td className="py-2 px-3">
                        {((s.mastery ?? 0) * 100).toFixed(1)}%
                      </td>
                      <td className="py-2 px-3">{s.attempts ?? 0}</td>
                      <td className="py-2 px-3">
                        {((s.correct_rate ?? 0) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
