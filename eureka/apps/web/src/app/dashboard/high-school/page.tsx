"use client";

/**
 * /dashboard/high-school — Overview tab of the HS module.
 *
 * Previously a single mega-page; refactored into Overview + 4 sub-routes
 * (Courses / Enrollment / Skills / Resources) — see ./layout.tsx. Mirrors
 * /dashboard/undergraduate/page.tsx shape.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api } from "@/lib/eureka-api";
import {
  School,
  BookOpen,
  Sparkles,
  Folder,
  Target,
  ArrowRight,
  Layers,
} from "lucide-react";

const TIER = "high_school";
const TITLE = "High School";
const FRAMEWORKS = ["ngss", "ccss", "ap"];

type TierEnrollment = {
  id: string;
  tier: string;
  tier_context: {
    framework?: string;
    grade_level?: string;
    school?: string;
  } & Record<string, unknown>;
  status: string;
  target_completion_at: string | null;
  progress_pct?: string | number;
};

type CoursePage = { items?: unknown[]; total?: number };

export default function HighSchoolOverview() {
  const [enrolment, setEnrolment] = useState<TierEnrollment | null>(null);
  const [counts, setCounts] = useState({
    courses: 0,
    skills: 0,
    resources: 0,
    recs: 0,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [es, cs, ms, rsx, rs] = await Promise.all([
          api<TierEnrollment[]>("/tier-enrollments/me").catch(() => []),
          api<CoursePage | unknown[]>(
            `/courses/?limit=50&tier=${TIER}&is_published=true`,
          ).catch(() => ({ items: [] })),
          api<unknown[]>("/analytics/me/skills").catch(() => []),
          api<unknown[]>(`/resources?tier=${TIER}&limit=50`).catch(() => []),
          api<{ framework?: string }[]>("/recommendations/me").catch(() => []),
        ]);
        const active = (Array.isArray(es) ? es : []).find(
          (e) =>
            e.tier === TIER &&
            e.status !== "withdrawn" &&
            e.status !== "archived",
        );
        setEnrolment(active ?? null);
        const courseCount = Array.isArray(cs)
          ? cs.length
          : Array.isArray((cs as CoursePage)?.items)
            ? ((cs as CoursePage).items as unknown[]).length
            : 0;
        const recList = Array.isArray(rs) ? rs : [];
        setCounts({
          courses: courseCount,
          skills: Array.isArray(ms) ? ms.length : 0,
          resources: Array.isArray(rsx) ? rsx.length : 0,
          recs: recList.filter(
            (r) =>
              !r.framework ||
              FRAMEWORKS.includes(String(r.framework).toLowerCase()),
          ).length,
        });
      } catch (e) {
        setError(String((e as Error)?.message ?? e));
      }
    })();
  }, []);

  const ctx = enrolment?.tier_context ?? {};
  const framework = typeof ctx.framework === "string" ? ctx.framework : null;
  const grade = typeof ctx.grade_level === "string" ? ctx.grade_level : null;
  const school = typeof ctx.school === "string" ? ctx.school : null;
  const target = enrolment?.target_completion_at
    ? new Date(enrolment.target_completion_at).toLocaleDateString()
    : null;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent">
        <CardContent className="flex items-start justify-between gap-4 pt-6 flex-wrap">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-blue-500/10 p-3">
              <School className="h-8 w-8 text-blue-600" />
            </div>
            <div className="min-w-0">
              <h1 className="mb-1 text-3xl font-bold">{TITLE}</h1>
              <p className="text-muted-foreground">
                Your high-school work — NGSS / CCSS / AP courses, tier
                enrolment, skill mastery, and resources. Tabs above let you
                drill in.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {FRAMEWORKS.map((f) => (
                  <Badge key={f} variant="secondary" className="uppercase">
                    {f}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert>
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Enrolment summary hero */}
      {enrolment && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="min-w-0">
                <CardTitle className="text-base flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  Active enrolment
                </CardTitle>
                {/* Not <CardDescription>: it renders a <p>, and the <Badge>
                    below renders a <div> — a div inside a p is invalid HTML
                    (validateDOMNesting warning). Use a div with the same
                    muted-description styling instead. */}
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  {framework && (
                    <Badge variant="outline" className="uppercase">
                      {framework}
                    </Badge>
                  )}
                  {grade && (
                    <span className="font-medium text-foreground">
                      Grade {grade}
                    </span>
                  )}
                  {school && <span>· {school}</span>}
                  <span className="capitalize">{enrolment.status}</span>
                  {target && <span>· graduating {target}</span>}
                </div>
              </div>
              <Link href="/dashboard/high-school/enrollment">
                <Button variant="outline" size="sm">
                  Open enrolment <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Stats grid — each card links into its sub-tab */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Link href="/dashboard/high-school/courses">
          <Card className="h-full hover:border-primary/40 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Courses</p>
                  <p className="text-2xl font-bold">{counts.courses}</p>
                </div>
                <BookOpen className="h-6 w-6 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/high-school/enrollment">
          <Card className="h-full hover:border-primary/40 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Enrolment</p>
                  <p className="text-2xl font-bold">{enrolment ? 1 : 0}</p>
                </div>
                <Layers className="h-6 w-6 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/high-school/skills">
          <Card className="h-full hover:border-primary/40 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Skills</p>
                  <p className="text-2xl font-bold">{counts.skills}</p>
                </div>
                <Target className="h-6 w-6 text-orange-500" />
              </div>
              {counts.recs > 0 && (
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> {counts.recs} recs
                </p>
              )}
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/high-school/resources">
          <Card className="h-full hover:border-primary/40 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Resources</p>
                  <p className="text-2xl font-bold">{counts.resources}</p>
                </div>
                <Folder className="h-6 w-6 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Keep going */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Keep going</CardTitle>
          <CardDescription>
            Common next steps from the rest of the EUREKA dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link href="/dashboard/tutor">
            <Button variant="outline">Ask the AI tutor</Button>
          </Link>
          <Link href="/dashboard/assessments">
            <Button variant="outline">Practice a question</Button>
          </Link>
          <Link href="/dashboard/learning-path">
            <Button variant="outline">Open learning path</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
