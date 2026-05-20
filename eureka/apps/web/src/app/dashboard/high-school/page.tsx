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
import { School } from "lucide-react";

type LearnerProfile = {
  user_id: string;
  primary_tier: string | null;
  goals: string[];
  knowledge_state: Record<string, number>;
};
type TierEnrollment = {
  id: string;
  user_id: string;
  tier: string;
  framework: string | null;
  target_date: string | null;
  status: string;
  created_at: string;
};
type Recommendation = {
  id?: string;
  title?: string;
  reason?: string;
  skill_code?: string;
  framework?: string;
  score?: number;
} & Record<string, unknown>;
type SkillMastery = {
  skill_code: string;
  mastery: number;
  attempts: number;
  correct_rate?: number;
  p50_time_ms?: number;
};

const TIER = "high_school";
const TITLE = "High School";
const SUBHEAD =
  "Real-time view of your high school tier — courses, recommendations, and skill mastery, all driven by the live API.";
const FRAMEWORKS = ["CCSS", "NGSS", "AP"];

export default function Page() {
  const [, setProfile] = useState<LearnerProfile | null>(null);
  const [enrollments, setEnrollments] = useState<TierEnrollment[]>([]);
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [skills, setSkills] = useState<SkillMastery[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [p, es, rs, ms] = await Promise.all([
          api<LearnerProfile>("/learner-profile/me").catch(() => null),
          api<TierEnrollment[]>("/tier-enrollments/me").catch(() => []),
          api<Recommendation[]>("/recommendations/me").catch(() => []),
          api<SkillMastery[]>("/analytics/me/skills").catch(() => []),
        ]);
        setProfile(p);
        setEnrollments((es ?? []).filter((e) => e.tier === TIER));
        setRecs(rs ?? []);
        setSkills(ms ?? []);
      } catch (e) {
        setError(String((e as Error).message));
      }
    })();
  }, []);

  const topSkills = [...skills].sort((a, b) => b.mastery - a.mastery).slice(0, 5);
  const bottomSkills = [...skills].sort((a, b) => a.mastery - b.mastery).slice(0, 5);

  return (
    <div className="container mx-auto max-w-5xl space-y-6 p-6">
      <header className="flex items-center gap-3">
        <School className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">{TITLE}</h1>
          <p className="text-sm text-muted-foreground">{SUBHEAD}</p>
        </div>
      </header>

      {error && (
        <Alert>
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Your enrollments in this tier</CardTitle>
          <CardDescription>
            Frameworks tracked here: {FRAMEWORKS.join(", ")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {enrollments.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              You are not enrolled in this tier yet.{" "}
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
                  <div>
                    <div className="font-medium">
                      {e.framework ?? "General"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Status: {e.status}
                      {e.target_date ? ` • Target ${e.target_date}` : ""}
                    </div>
                  </div>
                  <Badge variant="secondary">{e.tier}</Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top recommendations</CardTitle>
          <CardDescription>
            Personalized next steps from the recommender service.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recs.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No recommendations yet. Practice a few questions and they will
              show up here.
            </p>
          ) : (
            <ul className="space-y-2">
              {recs.slice(0, 6).map((r, i) => (
                <li
                  key={r.id ?? `${r.skill_code ?? "rec"}-${i}`}
                  className="flex items-start justify-between gap-3 rounded-md border p-3"
                >
                  <div className="min-w-0">
                    <div className="font-medium">
                      {r.title ?? r.skill_code ?? "Untitled"}
                    </div>
                    {r.reason && (
                      <div className="text-xs text-muted-foreground">
                        {r.reason}
                      </div>
                    )}
                  </div>
                  <Badge variant="outline">
                    {r.framework ?? r.skill_code ?? "rec"}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skill mastery snapshot</CardTitle>
          <CardDescription>
            Top 5 strongest and 5 weakest skills, from your live analytics.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
              Strongest
            </h3>
            {topSkills.length === 0 ? (
              <p className="text-sm text-muted-foreground">No data yet.</p>
            ) : (
              <ul className="space-y-2">
                {topSkills.map((s) => (
                  <li key={`top-${s.skill_code}`}>
                    <div className="flex justify-between text-xs">
                      <span className="font-medium">{s.skill_code}</span>
                      <span className="text-muted-foreground">
                        {Math.round(s.mastery * 100)}%
                      </span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{
                          width: `${Math.round(s.mastery * 100)}%`,
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
              Needs work
            </h3>
            {bottomSkills.length === 0 ? (
              <p className="text-sm text-muted-foreground">No data yet.</p>
            ) : (
              <ul className="space-y-2">
                {bottomSkills.map((s) => (
                  <li key={`bot-${s.skill_code}`}>
                    <div className="flex justify-between text-xs">
                      <span className="font-medium">{s.skill_code}</span>
                      <span className="text-muted-foreground">
                        {Math.round(s.mastery * 100)}%
                      </span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-amber-500"
                        style={{
                          width: `${Math.round(s.mastery * 100)}%`,
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Keep going</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm">
          <Link href="/dashboard/tutor" className="text-primary underline">
            Ask the AI tutor about a topic →
          </Link>
          <Link
            href="/dashboard/assessments"
            className="text-primary underline"
          >
            Practice a question now →
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
