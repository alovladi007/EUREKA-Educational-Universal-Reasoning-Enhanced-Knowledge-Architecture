"use client";
/**
 * EUREKA - Learning Analytics
 *
 * Two measured universes, clearly separated:
 *
 *  1. Test prep — the per-exam attempt aggregates every QBank/practice
 *     surface records through POST /me/progress, plus server-side chapter
 *     reads and the NCLEX dosage engine's graded attempts. This is where
 *     nearly all real activity lives, and it now leads the page.
 *  2. Skill-graph practice — attempts on items linked to the Phase 4.2
 *     skill graph (/analytics/me/*). Attempts on unlinked items (MCAT
 *     server bank, dosage engine) are *deliberately* absent from its
 *     per-skill aggregates and are counted in section 1 instead.
 *
 * Every number is a count of recorded attempts, reads, or reviews.
 * Nothing here is predicted, estimated, or modeled.
 */

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Brain,
  Target,
  TrendingUp,
  TrendingDown,
  Award,
  ArrowUpDown,
  ArrowRight,
  BookOpen,
  Layers,
  Syringe,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Server shapes (matching the actual response models — see
// app/schemas/exam.py AttemptLogResponse and services/analytics.py to_dict)
// ---------------------------------------------------------------------------

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
  learning: number;
  mature: number;
  reviews_today: number;
}

interface DosageStats {
  answered: number;
  correct: number;
}

interface SkillRow {
  skill_id?: string;
  framework?: string;
  code: string;
  name?: string;
  attempts: number;
  correct?: number;
  /** 0–100, not 0–1. */
  correct_pct?: number;
  median_time_ms?: number | null;
  /** 0–1, null when no mastery record exists yet. */
  mastery?: number | null;
}

interface StrengthsWeaknesses {
  strongest?: SkillRow[];
  weakest?: SkillRow[];
}

interface AttemptRow {
  id: string;
  item_id?: string;
  is_correct?: boolean;
  time_taken_ms?: number | null;
  source?: string;
  created_at?: string;
}

interface MockRow {
  id: string;
  blueprint_id?: string;
  status?: string;
  score_scaled?: number | null;
  started_at?: string;
  completed_at?: string | null;
}

type SortKey = "code" | "mastery" | "attempts" | "correct_pct";
type SortDir = "asc" | "desc";

function fmtPct01(v: number | null | undefined): string {
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

function MasteryBar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(1, value ?? 0));
  const w = Math.round(pct * 100);
  const color =
    pct >= 0.8 ? "bg-green-500" : pct >= 0.5 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
      <div className={`h-full ${color} transition-all`} style={{ width: `${w}%` }} />
    </div>
  );
}

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<ExamOverviewRow[]>([]);
  const [srs, setSrs] = useState<SrsStats | null>(null);
  const [dosage, setDosage] = useState<DosageStats | null>(null);
  const [skills, setSkills] = useState<SkillRow[]>([]);
  const [sw, setSw] = useState<StrengthsWeaknesses>({});
  const [attempts, setAttempts] = useState<AttemptRow[]>([]);
  const [mocks, setMocks] = useState<MockRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [sortKey, setSortKey] = useState<SortKey>("attempts");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    const results = await Promise.allSettled([
      api<unknown>("/me/progress/overview"),
      api<unknown>("/me/srs/stats"),
      api<unknown>("/nclex/dosage/stats"),
      api<unknown>("/analytics/me/skills"),
      api<unknown>("/analytics/me/strengths-weaknesses"),
      api<unknown>("/attempts/me?limit=50"),
      api<unknown>("/mock-attempts/me?limit=10"),
    ]);
    const [ovr, srsR, dosR, skR, swR, attR, mkR] = results;

    setOverview(
      ovr.status === "fulfilled" && Array.isArray(ovr.value)
        ? (ovr.value as ExamOverviewRow[])
        : [],
    );
    if (ovr.status === "rejected") {
      setError(String((ovr.reason as Error)?.message ?? ovr.reason));
    }
    setSrs(
      srsR.status === "fulfilled" && srsR.value && typeof srsR.value === "object"
        ? (srsR.value as SrsStats)
        : null,
    );
    setDosage(
      dosR.status === "fulfilled" && dosR.value && typeof dosR.value === "object"
        ? (dosR.value as DosageStats)
        : null,
    );
    setSkills(
      skR.status === "fulfilled" && Array.isArray(skR.value)
        ? (skR.value as SkillRow[])
        : [],
    );
    setSw(
      swR.status === "fulfilled" && swR.value && typeof swR.value === "object"
        ? (swR.value as StrengthsWeaknesses)
        : {},
    );
    setAttempts(
      attR.status === "fulfilled" && Array.isArray(attR.value)
        ? (attR.value as AttemptRow[])
        : [],
    );
    setMocks(
      mkR.status === "fulfilled" && Array.isArray(mkR.value)
        ? (mkR.value as MockRow[])
        : [],
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const safeOverview = Array.isArray(overview) ? overview : [];
  const safeSkills = Array.isArray(skills) ? skills : [];
  const safeAttempts = Array.isArray(attempts) ? attempts : [];
  const safeMocks = Array.isArray(mocks) ? mocks : [];
  const strongest = Array.isArray(sw.strongest) ? sw.strongest : [];
  const weakest = Array.isArray(sw.weakest) ? sw.weakest : [];

  // --- Test-prep aggregates (measured) ---
  const tpAttempts = safeOverview.reduce((a, r) => a + r.total_attempts, 0);
  const tpCorrect = safeOverview.reduce((a, r) => a + r.total_correct, 0);
  const tpAccuracy = tpAttempts > 0 ? tpCorrect / tpAttempts : null;
  const tpChapters = safeOverview.reduce((a, r) => a + r.chapters_read, 0);

  // --- Skill-graph aggregates ---
  const totalSkills = safeSkills.length;
  const masteryRows = safeSkills.filter((s) => typeof s.mastery === "number");
  const avgMastery =
    masteryRows.length > 0
      ? masteryRows.reduce((acc, s) => acc + (s.mastery as number), 0) /
        masteryRows.length
      : null;
  const skillLinkedAttempts = safeSkills.reduce(
    (acc, s) => acc + (s.attempts ?? 0),
    0,
  );
  const mockCount = safeMocks.length;

  const toggleSort = (k: SortKey) => {
    if (k === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(k);
      setSortDir(k === "code" ? "asc" : "desc");
    }
  };

  const sortedSkills = useMemo(() => {
    const copy = [...safeSkills];
    copy.sort((a, b) => {
      const av = (a as unknown as Record<string, unknown>)[sortKey];
      const bv = (b as unknown as Record<string, unknown>)[sortKey];
      if (typeof av === "string" && typeof bv === "string") {
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      const an = typeof av === "number" ? av : -1;
      const bn = typeof bv === "number" ? bv : -1;
      return sortDir === "asc" ? an - bn : bn - an;
    });
    return copy;
  }, [safeSkills, sortKey, sortDir]);

  const SortableTh = ({ label, k }: { label: string; k: SortKey }) => (
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

  const CounterCard = ({
    title,
    value,
    icon,
    sub,
  }: {
    title: string;
    value: string;
    icon: React.ReactNode;
    sub?: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Learning Analytics</h1>
        <p className="text-muted-foreground">
          Measured activity only — every number is a count of recorded
          attempts, chapter reads, or reviews.
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
          {/* Cross-platform counters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <CounterCard
              title="Test-prep attempts"
              value={String(tpAttempts)}
              icon={<Target className="w-4 h-4 text-muted-foreground" />}
              sub={`across ${safeOverview.length} exam${safeOverview.length === 1 ? "" : "s"}`}
            />
            <CounterCard
              title="Test-prep accuracy"
              value={tpAccuracy === null ? "—" : fmtPct01(tpAccuracy)}
              icon={<Award className="w-4 h-4 text-muted-foreground" />}
              sub={
                tpAccuracy === null
                  ? "no attempts yet"
                  : `${tpCorrect} of ${tpAttempts} correct`
              }
            />
            <CounterCard
              title="Chapters read"
              value={String(tpChapters)}
              icon={<BookOpen className="w-4 h-4 text-muted-foreground" />}
              sub="server-tracked course reading"
            />
            <CounterCard
              title="SRS cards due"
              value={srs ? String(srs.due_now) : "—"}
              icon={<Layers className="w-4 h-4 text-muted-foreground" />}
              sub={srs ? `${srs.total_cards} cards total` : "unavailable"}
            />
          </div>

          {/* Test prep by exam */}
          <Card>
            <CardHeader>
              <CardTitle>Test prep — by exam</CardTitle>
              <CardDescription>
                Aggregated from every answered question your practice surfaces
                record (POST /me/progress) plus server-side chapter reads.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {safeOverview.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No test-prep activity recorded yet. Open a course or QBank
                  under Test Prep — numbers appear after your first answered
                  question or chapter read.
                </p>
              ) : (
                <div className="overflow-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b text-xs text-muted-foreground">
                      <tr>
                        <th className="text-left py-2 px-2">exam</th>
                        <th className="text-left py-2 px-2">attempts</th>
                        <th className="text-left py-2 px-2">accuracy</th>
                        <th className="text-left py-2 px-2">avg mastery</th>
                        <th className="text-left py-2 px-2">chapters read</th>
                        <th className="text-left py-2 px-2">last activity</th>
                        <th className="text-left py-2 px-2" />
                      </tr>
                    </thead>
                    <tbody>
                      {safeOverview.map((r) => {
                        const total = chapterTotal(r.exam_type);
                        return (
                          <tr key={r.exam_type} className="border-b">
                            <td className="py-2 px-2 font-medium">
                              {examName(r.exam_type)}
                            </td>
                            <td className="py-2 px-2">
                              {r.total_attempts}
                              <span className="text-xs text-muted-foreground">
                                {" "}
                                / {r.topics_attempted} topic
                                {r.topics_attempted === 1 ? "" : "s"}
                              </span>
                            </td>
                            <td className="py-2 px-2">
                              {r.total_attempts > 0
                                ? fmtPct01(r.accuracy)
                                : "—"}
                            </td>
                            <td className="py-2 px-2 min-w-[140px]">
                              {r.total_attempts > 0 ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-xs w-10">
                                    {fmtPct01(r.average_mastery)}
                                  </span>
                                  <div className="flex-1">
                                    <MasteryBar value={r.average_mastery} />
                                  </div>
                                </div>
                              ) : (
                                "—"
                              )}
                            </td>
                            <td className="py-2 px-2">
                              {total > 0
                                ? `${r.chapters_read}/${total}`
                                : r.chapters_read}
                            </td>
                            <td className="py-2 px-2 text-xs">
                              {fmtDate(r.last_seen_at)}
                            </td>
                            <td className="py-2 px-2">
                              <Link
                                href={`/dashboard/test-prep/analytics?exam=${encodeURIComponent(r.exam_type)}`}
                                className="text-xs text-primary inline-flex items-center gap-1 hover:underline"
                              >
                                Details <ArrowRight className="w-3 h-3" />
                              </Link>
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

          {/* Dosage engine + SRS detail */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {dosage && dosage.answered > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Syringe className="w-5 h-5" /> NCLEX dosage engine
                  </CardTitle>
                  <CardDescription>
                    Server-generated med-math, graded server-side.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-2xl font-bold">
                    {dosage.correct}/{dosage.answered}
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                      correct (
                      {Math.round((dosage.correct / dosage.answered) * 100)}%)
                    </span>
                  </p>
                  <Link
                    href="/dashboard/test-prep/nclex_rn/dosage"
                    className="text-xs text-primary inline-flex items-center gap-1 hover:underline"
                  >
                    Open Dosage Mastery <ArrowRight className="w-3 h-3" />
                  </Link>
                </CardContent>
              </Card>
            )}
            {srs && srs.total_cards > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="w-5 h-5" /> Spaced repetition
                  </CardTitle>
                  <CardDescription>
                    Your SM-2 deck state right now.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Badge variant={srs.due_now > 0 ? "destructive" : "secondary"}>
                      {srs.due_now} due now
                    </Badge>
                    <Badge variant="outline">{srs.learning} learning</Badge>
                    <Badge variant="outline">{srs.mature} mature</Badge>
                    <Badge variant="outline">
                      {srs.reviews_today} reviewed today
                    </Badge>
                  </div>
                  <Link
                    href="/dashboard/srs"
                    className="text-xs text-primary inline-flex items-center gap-1 hover:underline"
                  >
                    Review now <ArrowRight className="w-3 h-3" />
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* ---- Skill-graph practice ---- */}
          <div>
            <h2 className="text-xl font-semibold">Skill-graph practice</h2>
            <p className="text-sm text-muted-foreground">
              Attempts on items linked to the Phase 4.2 skill graph
              (Assessments · Practice). Test-prep QBank work is counted above,
              not here.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <CounterCard
              title="Skills tracked"
              value={String(totalSkills)}
              icon={<Brain className="w-4 h-4 text-muted-foreground" />}
            />
            <CounterCard
              title="Avg mastery"
              value={avgMastery === null ? "—" : fmtPct01(avgMastery)}
              icon={<Award className="w-4 h-4 text-muted-foreground" />}
              sub={
                avgMastery === null
                  ? "no mastery records yet"
                  : `over ${masteryRows.length} skill${masteryRows.length === 1 ? "" : "s"}`
              }
            />
            <CounterCard
              title="Skill-linked attempts"
              value={String(skillLinkedAttempts)}
              icon={<Target className="w-4 h-4 text-muted-foreground" />}
            />
            <CounterCard
              title="Mock exams taken"
              value={String(mockCount)}
              icon={<Award className="w-4 h-4 text-muted-foreground" />}
            />
          </div>

          {totalSkills === 0 && safeAttempts.length > 0 && (
            <Alert>
              <AlertTitle>Why is this section empty?</AlertTitle>
              <AlertDescription>
                Your {safeAttempts.length} recent attempt
                {safeAttempts.length === 1 ? " is" : "s are"} on items that
                aren&apos;t linked to the skill graph (for example the MCAT
                server bank or the NCLEX dosage engine), so no per-skill
                mastery has started here. They still count in the test-prep
                section above.
              </AlertDescription>
            </Alert>
          )}

          {/* Strengths / weaknesses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" /> Top 5 strongest
                </CardTitle>
                <CardDescription>
                  Skill-graph skills with ≥3 attempts, ranked by correct rate.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {strongest.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Practice skill-linked items to see strengths.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {strongest.slice(0, 5).map((s) => (
                      <li key={s.code} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">
                            {s.name || s.code}
                          </span>
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            {typeof s.correct_pct === "number"
                              ? `${Math.round(s.correct_pct)}%`
                              : "—"}
                          </Badge>
                        </div>
                        {typeof s.mastery === "number" && (
                          <MasteryBar value={s.mastery} />
                        )}
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
                  Skill-graph skills with ≥3 attempts, lowest correct rate.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {weakest.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No weak spots detected yet (needs ≥3 attempts per skill).
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {weakest.slice(0, 5).map((s) => (
                      <li key={s.code} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">
                            {s.name || s.code}
                          </span>
                          <Badge variant="destructive">
                            {typeof s.correct_pct === "number"
                              ? `${Math.round(s.correct_pct)}%`
                              : "—"}
                          </Badge>
                        </div>
                        {typeof s.mastery === "number" && (
                          <MasteryBar value={s.mastery} />
                        )}
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
                Per-skill aggregates from /analytics/me/skills — click a
                header to sort.
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
                        <SortableTh label="code" k="code" />
                        <SortableTh label="mastery" k="mastery" />
                        <SortableTh label="attempts" k="attempts" />
                        <SortableTh label="correct rate" k="correct_pct" />
                      </tr>
                    </thead>
                    <tbody>
                      {sortedSkills.map((s) => (
                        <tr key={s.code} className="border-b">
                          <td className="py-2 px-2 font-mono text-xs">
                            {s.code}
                          </td>
                          <td className="py-2 px-2 min-w-[160px]">
                            {typeof s.mastery === "number" ? (
                              <div className="flex items-center gap-2">
                                <span className="text-xs w-10">
                                  {fmtPct01(s.mastery)}
                                </span>
                                <div className="flex-1">
                                  <MasteryBar value={s.mastery} />
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                —
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-2">{s.attempts ?? 0}</td>
                          <td className="py-2 px-2">
                            {typeof s.correct_pct === "number"
                              ? `${Math.round(s.correct_pct)}%`
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
                Last 50 individually logged attempts (server item banks:
                skill-graph practice, MCAT server bank, dosage engine).
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
                        <th className="text-left py-2 px-2">when</th>
                        <th className="text-left py-2 px-2">source</th>
                        <th className="text-left py-2 px-2">item</th>
                        <th className="text-left py-2 px-2">correct</th>
                        <th className="text-left py-2 px-2">time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {safeAttempts.map((a) => (
                        <tr key={a.id} className="border-b">
                          <td className="py-2 px-2 text-xs">
                            {fmtDate(a.created_at)}
                          </td>
                          <td className="py-2 px-2">
                            <Badge variant="outline" className="text-[10px]">
                              {a.source || "practice"}
                            </Badge>
                          </td>
                          <td className="py-2 px-2 font-mono text-xs">
                            {(a.item_id ?? "").slice(0, 8) || "—"}
                          </td>
                          <td className="py-2 px-2">
                            {a.is_correct ? (
                              <span className="text-green-600">✓</span>
                            ) : (
                              <span className="text-red-600">✗</span>
                            )}
                          </td>
                          <td className="py-2 px-2 text-xs">
                            {typeof a.time_taken_ms === "number"
                              ? `${(a.time_taken_ms / 1000).toFixed(1)}s`
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

          {/* Mock exam history */}
          <Card>
            <CardHeader>
              <CardTitle>Mock exam history</CardTitle>
              <CardDescription>Last 10 from /mock-attempts/me</CardDescription>
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
