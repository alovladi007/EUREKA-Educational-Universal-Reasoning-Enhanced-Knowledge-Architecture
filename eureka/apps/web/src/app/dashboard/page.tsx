"use client";

/**
 * Phase 17 — Dashboard home, rebuilt on real APIs.
 *
 * Single GET /me/dashboard powers the four counters + recent activity.
 * Counters: 7-day activity, achievements, collections, tier enrollments.
 * Plus next-due graduate milestone and most-recent activity rows. No
 * more hardcoded "Advanced Calculus 67%" mocks.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api, formatDate } from "@/lib/eureka-api";
import {
  Activity, Trophy, FolderKanban, GraduationCap, Target, BookOpen,
  Sparkles, FileText, Clock,
} from "lucide-react";

type ActivityRow = {
  id: string;
  kind: string;
  summary: string;
  ref_table: string | null;
  ref_id: string | null;
  created_at: string;
};

type DashboardSummary = {
  user_id: string;
  org_id: string;
  activity_count_7d: number;
  achievement_count: number;
  collection_count: number;
  enrollment_count: number;
  next_due_milestone_title: string | null;
  next_due_milestone_at: string | null;
  recent_activity: ActivityRow[];
};

const KIND_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  attempt_completed: Target,
  mock_completed: FileText,
  skill_mastered: Sparkles,
  course_enrolled: BookOpen,
  course_completed: BookOpen,
  note_created: FolderKanban,
  collection_created: FolderKanban,
  collection_item_added: FolderKanban,
  community_posted: Activity,
  community_replied: Activity,
  achievement_earned: Trophy,
  streak_milestone: Sparkles,
  tutor_session: Sparkles,
  resource_bookmarked: BookOpen,
  profile_updated: Activity,
  system: Activity,
};

export default function DashboardHomePage() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const d = await api<DashboardSummary>("/me/dashboard");
        setData(d);
      } catch (e) {
        setError(String((e as Error).message));
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-slate-600 mt-1">
          Live snapshot of your learning. Everything below is fetched from the
          API — no mock data.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Could not load dashboard</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <CounterCard
          icon={Activity}
          label="Activity (last 7d)"
          value={data?.activity_count_7d ?? "—"}
          href="/dashboard/community"
        />
        <CounterCard
          icon={Trophy}
          label="Achievements"
          value={data?.achievement_count ?? "—"}
          href="/learner"
        />
        <CounterCard
          icon={FolderKanban}
          label="Collections"
          value={data?.collection_count ?? "—"}
          href="/dashboard/notebook"
        />
        <CounterCard
          icon={GraduationCap}
          label="Tier enrollments"
          value={data?.enrollment_count ?? "—"}
          href="/learner"
        />
      </div>

      {data?.next_due_milestone_title && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-600" /> Next graduate milestone
            </CardTitle>
            <CardDescription>
              {data.next_due_milestone_title}
              {data.next_due_milestone_at && (
                <> · due {formatDate(data.next_due_milestone_at)}</>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/graduate" className="text-sm text-primary hover:underline">
              Open my graduate work →
            </Link>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent activity</CardTitle>
          <CardDescription>
            Your last 7 days. Comes from <span className="font-mono text-[11px]">/me/activity</span>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data === null && !error && <p className="text-slate-500 text-sm">Loading…</p>}
          {data && data.recent_activity.length === 0 && (
            <p className="text-slate-500 text-sm">
              No activity yet. Try a question on{" "}
              <Link href="/dashboard/assessments" className="text-primary hover:underline">Assessments</Link>{" "}
              or start a session with the{" "}
              <Link href="/dashboard/tutor" className="text-primary hover:underline">AI Tutor</Link>.
            </p>
          )}
          {data && data.recent_activity.length > 0 && (
            <ul className="divide-y">
              {data.recent_activity.map((e) => {
                const Icon = KIND_ICON[e.kind] ?? Activity;
                return (
                  <li key={e.id} className="py-3 flex items-start gap-3">
                    <div className="rounded-md bg-slate-100 p-2">
                      <Icon className="h-4 w-4 text-slate-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-slate-900 truncate">{e.summary}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        <Badge variant="outline" className="mr-2 text-[10px]">
                          {e.kind.replace(/_/g, " ")}
                        </Badge>
                        {formatDate(e.created_at)}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <QuickLink href="/dashboard/tutor" icon={Sparkles} label="Open AI Tutor" hint="Phase 6 Claude agent with RAG" />
        <QuickLink href="/dashboard/assessments" icon={Target} label="Practice questions" hint="Phase 5 item bank + hybrid search" />
        <QuickLink href="/dashboard/learning-path" icon={GraduationCap} label="What to study next" hint="Phase 4.5 recommender" />
      </div>
    </div>
  );
}

function CounterCard({
  icon: Icon, label, value, href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="hover:border-primary/40 transition-colors h-full">
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <CardDescription>{label}</CardDescription>
          <Icon className="h-4 w-4 text-slate-400" />
        </CardHeader>
        <CardContent className="text-3xl font-bold tabular-nums">{value}</CardContent>
      </Card>
    </Link>
  );
}

function QuickLink({
  href, icon: Icon, label, hint,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  hint: string;
}) {
  return (
    <Link href={href}>
      <Card className="hover:border-primary/40 transition-colors h-full">
        <CardContent className="p-4 flex items-start gap-3">
          <Icon className="h-5 w-5 text-primary mt-0.5" />
          <div className="min-w-0">
            <div className="font-medium">{label}</div>
            <div className="text-xs text-slate-500 mt-0.5">{hint}</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
