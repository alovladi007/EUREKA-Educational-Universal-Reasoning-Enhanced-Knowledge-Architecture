"use client";

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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api } from "@/lib/eureka-api";
import { AxiomMathCard } from "@/components/dashboard/axiom-math-card";
import {
  Activity,
  Trophy,
  FolderOpen,
  GraduationCap,
  Flame,
  Brain,
  Target,
  Compass,
  CalendarClock,
} from "lucide-react";

type DashboardSummary = {
  activity_count_7d?: number;
  achievement_count?: number;
  collection_count?: number;
  enrollment_count?: number;
  next_due_milestone_title?: string | null;
  next_due_milestone_at?: string | null;
  recent_activity?: Array<{
    id: string;
    kind: string;
    summary: string;
    created_at: string;
  }>;
};
type Engagement = {
  streak_days?: number;
  level?: number;
  xp_total?: number;
  longest_streak_days?: number;
} | null;
type TierEnrollment = {
  id: string;
  tier: string;
  framework: string | null;
  target_date: string | null;
  status: string;
  created_at: string;
};

function relTime(iso: string): string {
  try {
    const t = new Date(iso).getTime();
    if (!t) return iso;
    const diff = Date.now() - t;
    const sec = Math.floor(diff / 1000);
    if (sec < 60) return `${sec}s ago`;
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h ago`;
    const d = Math.floor(hr / 24);
    if (d < 30) return `${d}d ago`;
    return new Date(iso).toLocaleDateString();
  } catch {
    return iso;
  }
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary>({});
  const [engagement, setEngagement] = useState<Engagement>(null);
  const [enrollments, setEnrollments] = useState<TierEnrollment[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [s, e, es] = await Promise.all([
          api<DashboardSummary>("/me/dashboard").catch(() => ({} as DashboardSummary)),
          api<Engagement>("/me/engagement").catch(() => null),
          api<TierEnrollment[]>("/tier-enrollments/me").catch(() => []),
        ]);
        setSummary(s ?? {});
        setEngagement(e ?? null);
        setEnrollments(Array.isArray(es) ? es : []);
      } catch (err) {
        setError(String((err as Error)?.message ?? err));
      }
    })();
  }, []);

  const recent = Array.isArray(summary.recent_activity)
    ? summary.recent_activity
    : [];
  const streak = engagement?.streak_days ?? null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Live snapshot of your activity, enrollments, and next milestones —
          straight from the EUREKA API.
        </p>
      </div>

      <AxiomMathCard />

      {error && (
        <Alert>
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Counter grid (5 cards) */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activity (7d)</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.activity_count_7d ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.achievement_count ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">earned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collections</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.collection_count ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">curated sets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrollments</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.enrollment_count ?? enrollments.length ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">active tiers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Streak</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {streak == null ? "—" : `${streak}d`}
            </div>
            <p className="text-xs text-muted-foreground">
              {engagement?.longest_streak_days != null
                ? `longest ${engagement.longest_streak_days}d`
                : "consecutive days"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Tier enrollments */}
        <Card>
          <CardHeader>
            <CardTitle>Your tier enrollments</CardTitle>
            <CardDescription>
              Live from <code>/tier-enrollments/me</code>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {enrollments.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No enrollments yet.{" "}
                <Link href="/learner" className="text-primary underline">
                  Enroll →
                </Link>
              </p>
            ) : (
              <ul className="space-y-2">
                {enrollments.map((e) => (
                  <li
                    key={e.id}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{e.tier}</Badge>
                        <span className="text-sm font-medium">
                          {e.framework ?? "General"}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        Status: {e.status}
                        {e.target_date ? ` • Target ${e.target_date}` : ""}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Next graduate milestone */}
        {summary.next_due_milestone_title && (
          <Card>
            <CardHeader>
              <CardTitle>Next graduate milestone</CardTitle>
              <CardDescription>From your graduate program plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CalendarClock className="mt-0.5 h-5 w-5 text-primary" />
                <div className="min-w-0">
                  <div className="font-medium">
                    {summary.next_due_milestone_title}
                  </div>
                  {summary.next_due_milestone_at && (
                    <div className="text-xs text-muted-foreground">
                      Due {new Date(summary.next_due_milestone_at).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
              <Link
                href="/dashboard/graduate"
                className="text-sm text-primary underline"
              >
                Open graduate plan →
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
          <CardDescription>Your latest events on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No recent activity yet. Practice a question or start a course to
              see events here.
            </p>
          ) : (
            <ul className="space-y-3">
              {recent.map((a) => (
                <li key={a.id} className="flex items-start gap-3">
                  <Badge variant="outline" className="text-xs">
                    {a.kind}
                  </Badge>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm">{a.summary}</div>
                    <div className="text-xs text-muted-foreground">
                      {relTime(a.created_at)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Quick links */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/dashboard/tutor">
          <Card className="h-full cursor-pointer border-2 transition-shadow hover:border-primary hover:shadow-lg">
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="rounded-lg bg-blue-50 p-3">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold">AI Tutor</div>
                <p className="text-xs text-muted-foreground">
                  Chat with the tutor for personalized help
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/assessments">
          <Card className="h-full cursor-pointer border-2 transition-shadow hover:border-primary hover:shadow-lg">
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="rounded-lg bg-orange-50 p-3">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <div className="font-semibold">Practice</div>
                <p className="text-xs text-muted-foreground">
                  Adaptive quizzes and tests
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/learning-path">
          <Card className="h-full cursor-pointer border-2 transition-shadow hover:border-primary hover:shadow-lg">
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="rounded-lg bg-pink-50 p-3">
                <Compass className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <div className="font-semibold">Learning Path</div>
                <p className="text-xs text-muted-foreground">
                  Adaptive recommendations for you
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
