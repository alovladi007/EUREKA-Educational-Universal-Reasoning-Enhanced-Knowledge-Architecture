"use client";
/**
 * EUREKA - Learning Path
 *
 * Two layers, in honesty order:
 *  1. "Where you are" — measured test-prep activity (/me/progress/overview,
 *     SRS due counts). Real recorded work; this is the actionable part.
 *  2. The Phase 4.5 skill-graph recommender + Phase 12.3 study plan
 *     generator. When the recommender has no mastery signal for this user
 *     it returns the same base score for everything — that cold-start
 *     state is labeled as such instead of dressed up as personalization.
 */

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/eureka-api";
import { EXAM_CONFIGS } from "@/lib/exam-config";
import { getStudyAxis, countChapters } from "@/lib/exam-study-axis";
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

interface ExamOverviewRow {
  exam_type: string;
  topics_attempted: number;
  total_attempts: number;
  total_correct: number;
  accuracy: number;
  average_mastery: number;
  chapters_read: number;
  last_seen_at?: string | null;
}

interface SrsStats {
  total_cards: number;
  due_now: number;
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

function examName(key: string): string {
  return EXAM_CONFIGS[key]?.name ?? key.replace(/_/g, " ");
}

function chapterTotal(key: string): number {
  try {
    return countChapters(getStudyAxis(key));
  } catch {
    return 0;
  }
}

export default function LearningPathPage() {
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [skills, setSkills] = useState<SkillMastery[]>([]);
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [overview, setOverview] = useState<ExamOverviewRow[]>([]);
  const [srs, setSrs] = useState<SrsStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // generate form
  const [genFramework, setGenFramework] = useState<string>("ABET");
  // /me/study-plan StudyPlanGenerateRequest requires {tier, framework,
  // target_date} — `tier` was missing before, causing a 422. Defaulting
  // to "undergraduate" which is the right pairing for ABET.
  const [genTier, setGenTier] = useState<string>("undergraduate");
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
    let overviewOk: ExamOverviewRow[] = [];
    let srsOk: SrsStats | null = null;
    try {
      const o = await api<unknown>("/me/progress/overview");
      overviewOk = Array.isArray(o) ? (o as ExamOverviewRow[]) : [];
    } catch {
      overviewOk = [];
    }
    try {
      const s = await api<unknown>("/me/srs/stats");
      srsOk = s && typeof s === "object" ? (s as SrsStats) : null;
    } catch {
      srsOk = null;
    }
    setRecs(recsOk);
    setSkills(skillsOk);
    setPlan(planOk);
    setOverview(overviewOk);
    setSrs(srsOk);
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
          tier: genTier,
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
  const safeOverview = Array.isArray(overview) ? overview : [];
  // Cold start: every recommendation carries the recommender's identical
  // base score — nothing has been differentiated by mastery signal yet.
  const coldStart =
    topRecs.length >= 2 &&
    topRecs.every((r) => typeof r.score === "number") &&
    new Set(topRecs.map((r) => (r.score as number).toFixed(3))).size === 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Learning Path</h1>
        <p className="text-muted-foreground">
          Your measured progress first, then the skill-graph recommender and
          study plan generator.
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
          {/* Where you are — measured */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Where you are — measured
              </CardTitle>
              <CardDescription>
                Recorded attempts and chapter reads per exam. Continue where
                the numbers say you actually are.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {srs && srs.due_now > 0 && (
                <div className="flex items-center justify-between rounded-md border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 p-3 text-sm">
                  <span>
                    <span className="font-medium">{srs.due_now}</span> flashcard
                    {srs.due_now === 1 ? "" : "s"} due for review — spaced
                    repetition works only if you clear the queue.
                  </span>
                  <Link
                    href="/dashboard/srs"
                    className="text-primary inline-flex items-center gap-1 hover:underline text-xs font-medium shrink-0 ml-3"
                  >
                    Review <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
              {safeOverview.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No recorded test-prep activity yet. Open a course or QBank
                  under Test Prep — this section fills in from your first
                  answered question or chapter read.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {safeOverview.map((r) => {
                    const total = chapterTotal(r.exam_type);
                    const slug = r.exam_type.toLowerCase();
                    return (
                      <div
                        key={r.exam_type}
                        className="rounded-md border p-3 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-sm leading-tight">
                            {examName(r.exam_type)}
                          </p>
                          {r.total_attempts > 0 && (
                            <Badge variant="secondary" className="text-[10px]">
                              {Math.round(r.accuracy * 100)}% correct
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {r.total_attempts} attempt
                          {r.total_attempts === 1 ? "" : "s"} across{" "}
                          {r.topics_attempted} topic
                          {r.topics_attempted === 1 ? "" : "s"}
                          {" · "}
                          {total > 0
                            ? `${r.chapters_read}/${total} chapters read`
                            : `${r.chapters_read} chapters read`}
                        </p>
                        <div className="flex gap-3">
                          <Link
                            href={`/dashboard/test-prep/${slug}/study`}
                            className="text-xs text-primary inline-flex items-center gap-1 hover:underline"
                          >
                            Continue course <ArrowRight className="w-3 h-3" />
                          </Link>
                          <Link
                            href={`/dashboard/test-prep/analytics?exam=${encodeURIComponent(r.exam_type)}`}
                            className="text-xs text-primary inline-flex items-center gap-1 hover:underline"
                          >
                            Analytics <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

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
              {coldStart && (
                <Alert className="mb-4">
                  <AlertTitle>Not personalized yet</AlertTitle>
                  <AlertDescription>
                    Every recommendation below carries the recommender&apos;s
                    identical base score ({topRecs[0]?.score?.toFixed(2)}) —
                    it has no mastery data for you, so this is the default
                    skill-graph ordering, not a ranking of what you need.
                    It differentiates once you practice skill-linked items
                    (Assessments → Practice) or take a diagnostic.
                  </AlertDescription>
                </Alert>
              )}
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-medium mb-1 block">
                          Tier
                        </label>
                        <select
                          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                          value={genTier}
                          onChange={(e) => setGenTier(e.target.value)}
                        >
                          <option value="high_school">High school</option>
                          <option value="undergraduate">Undergraduate</option>
                          <option value="graduate">Graduate</option>
                          <option value="medical">Medical</option>
                          <option value="test_prep">Test prep</option>
                        </select>
                      </div>
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
                            <option key={f} value={f}>{f}</option>
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
