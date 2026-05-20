"use client";
/**
 * EUREKA - Learning Path
 * Wired to Phase 4.5 recommender (/recommendations/me) and
 * Phase 12.3 study plan generator (/me/study-plan).
 */

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/eureka-api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Target,
  Trophy,
  CheckCircle2,
  CalendarDays,
  ArrowRight,
} from "lucide-react";

interface Recommendation {
  skill_id?: string;
  framework?: string;
  code: string;
  name?: string;
  tier?: string;
  score?: number;
  reason?: Record<string, unknown> | null;
}

interface SkillMastery {
  skill_code: string;
  mastery: number;
  attempts: number;
}

interface StudyPlanWeek {
  week_index: number;
  recommended_skill_codes?: string[];
  recommended_item_ids?: string[];
  is_diagnostic?: boolean;
  is_mock?: boolean;
}

interface StudyPlan {
  id?: string;
  framework?: string;
  weeks?: StudyPlanWeek[];
  target_date?: string;
  status?: string;
}

const FRAMEWORK_OPTIONS = [
  "ABET",
  "USMLE_Step_1",
  "FE_Electrical",
  "AP",
  "NGSS",
  "MBE",
];

/**
 * Safe collapser for the `reason` object — recommender returns an object of
 * numeric component scores. Renders the non-zero numeric entries inline.
 */
function reasonToString(reason: unknown): string {
  if (!reason || typeof reason !== "object") return "";
  return Object.entries(reason as Record<string, unknown>)
    .filter(([, v]) => typeof v === "number" && (v as number) > 0)
    .map(
      ([k, v]) =>
        `${k.replace(/_/g, " ")}: ${(v as number).toFixed(2)}`,
    )
    .join(" · ");
}

function todayPlus(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function LearningPathPage() {
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [skills, setSkills] = useState<SkillMastery[]>([]);
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // generate form
  const [genFramework, setGenFramework] = useState<string>("ABET");
  const [genDate, setGenDate] = useState<string>(todayPlus(56));
  const [generating, setGenerating] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    let recsOk: Recommendation[] = [];
    let skillsOk: SkillMastery[] = [];
    let planOk: StudyPlan | null = null;
    try {
      const r = await api<unknown>("/recommendations/me");
      recsOk = Array.isArray(r) ? (r as Recommendation[]) : [];
    } catch {
      recsOk = [];
    }
    try {
      const s = await api<unknown>("/skills/me/mastery");
      skillsOk = Array.isArray(s) ? (s as SkillMastery[]) : [];
    } catch {
      skillsOk = [];
    }
    try {
      const p = await api<unknown>("/me/study-plan");
      planOk = p && typeof p === "object" ? (p as StudyPlan) : null;
    } catch {
      planOk = null;
    }
    setRecs(recsOk);
    setSkills(skillsOk);
    setPlan(planOk);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setError(null);
    try {
      const created = await api<StudyPlan>("/me/study-plan", {
        method: "POST",
        body: JSON.stringify({
          framework: genFramework,
          target_date: genDate,
        }),
      });
      setPlan(created || null);
    } catch (err) {
      setError(String((err as Error).message));
    } finally {
      setGenerating(false);
    }
  };

  const safeRecs = Array.isArray(recs) ? recs : [];
  const safeSkills = Array.isArray(skills) ? skills : [];
  const topRecs = safeRecs.slice(0, 10);
  const mastered = safeSkills.filter((s) => (s.mastery ?? 0) >= 0.8);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Learning Path</h1>
        <p className="text-muted-foreground">
          Wired to Phase 4.5 recommender + Phase 12.3 study plan generator
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
          {/* Top recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" /> Top recommendations
              </CardTitle>
              <CardDescription>
                Top-{topRecs.length} skills the recommender suggests for you
                right now.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {topRecs.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No recommendations yet. Take a diagnostic to seed your
                  recommender state.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {topRecs.map((r, i) => {
                    const reasonStr = reasonToString(r.reason);
                    return (
                      <div
                        key={`${r.code}-${i}`}
                        className="rounded-md border p-3 flex flex-col gap-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-sm leading-tight">
                              {r.name || r.code}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {r.code}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            {typeof r.score === "number" && (
                              <Badge variant="default" className="text-[10px]">
                                {r.score.toFixed(2)}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {r.framework && (
                            <Badge variant="outline" className="text-[10px]">
                              {r.framework}
                            </Badge>
                          )}
                          {r.tier && (
                            <Badge variant="secondary" className="text-[10px]">
                              {r.tier}
                            </Badge>
                          )}
                        </div>
                        {reasonStr && (
                          <p className="text-[11px] text-muted-foreground">
                            {reasonStr}
                          </p>
                        )}
                        <Link
                          href={`/dashboard/assessments?skill=${encodeURIComponent(
                            r.code,
                          )}`}
                          className="text-xs text-primary inline-flex items-center gap-1 hover:underline mt-1"
                        >
                          Practice <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recently mastered */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" /> Recently
                  mastered
                </CardTitle>
                <CardDescription>
                  Skills where your mastery is greater than or equal to 0.8.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {mastered.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Nothing mastered yet — practice to push mastery above 0.8.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {mastered.map((s) => (
                      <li
                        key={s.skill_code}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          {s.skill_code}
                        </span>
                        <Badge variant="secondary">
                          {Math.round((s.mastery ?? 0) * 100)}%
                        </Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* Study plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5" /> Study plan
                </CardTitle>
                <CardDescription>
                  GET /me/study-plan · POST /me/study-plan to regenerate.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {plan && Array.isArray(plan.weeks) && plan.weeks.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2 text-xs">
                      {plan.framework && (
                        <Badge variant="outline">{plan.framework}</Badge>
                      )}
                      <Badge variant="secondary">
                        {plan.weeks.length} weeks
                      </Badge>
                      {plan.status && (
                        <Badge variant="default">{plan.status}</Badge>
                      )}
                      {plan.target_date && (
                        <Badge variant="outline">
                          target {plan.target_date}
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-2 max-h-80 overflow-auto pr-1">
                      {plan.weeks.map((w) => {
                        const codes = Array.isArray(w.recommended_skill_codes)
                          ? w.recommended_skill_codes
                          : [];
                        return (
                          <div
                            key={w.week_index}
                            className="rounded-md border p-2 text-xs"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">
                                Week {w.week_index + 1}
                              </span>
                              <div className="flex gap-1">
                                {w.is_diagnostic && (
                                  <Badge
                                    variant="outline"
                                    className="text-[9px]"
                                  >
                                    diagnostic
                                  </Badge>
                                )}
                                {w.is_mock && (
                                  <Badge
                                    variant="secondary"
                                    className="text-[9px]"
                                  >
                                    mock
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-muted-foreground">
                              {codes.length > 0
                                ? codes.join(", ")
                                : "(no skills assigned)"}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleGenerate} className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      No active plan yet. Generate one below.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium mb-1 block">
                          Framework
                        </label>
                        <select
                          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                          value={genFramework}
                          onChange={(e) => setGenFramework(e.target.value)}
                        >
                          {FRAMEWORK_OPTIONS.map((f) => (
                            <option key={f} value={f}>
                              {f}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1 block">
                          Target date
                        </label>
                        <Input
                          type="date"
                          value={genDate}
                          onChange={(e) => setGenDate(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={generating}
                      isLoading={generating}
                    >
                      Generate study plan
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
