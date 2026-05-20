"use client";

import Link from "next/link";
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

type Recommendation = {
  skill_code?: string;
  title?: string;
  reason?: string;
  [k: string]: unknown;
};

type MasteryRow = {
  skill_code: string;
  mastery: number;
};

export default function LearningPathPage() {
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [mastery, setMastery] = useState<MasteryRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [r, m] = await Promise.all([
          api<Recommendation[]>("/recommendations/me"),
          api<MasteryRow[]>("/skills/me/mastery"),
        ]);
        setRecs(Array.isArray(r) ? r : []);
        setMastery(Array.isArray(m) ? m : []);
      } catch (e) {
        setError(String((e as Error).message));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const top = recs.slice(0, 10);
  const mastered = mastery
    .filter((m) => (m.mastery ?? 0) >= 0.8)
    .sort((a, b) => (b.mastery ?? 0) - (a.mastery ?? 0));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">What to study next</h1>
        <p className="text-muted-foreground">
          Personalized recommendations based on your current mastery.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Failed to load recommendations</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4">
        {loading && top.length === 0 ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : top.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-sm text-muted-foreground text-center">
              No recommendations yet. Practice a few skills and check back.
            </CardContent>
          </Card>
        ) : (
          top.map((r, i) => {
            const skill = r.skill_code ?? "";
            return (
              <Card key={`${skill}-${i}`}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {r.title ?? r.skill_code ?? "Untitled"}
                  </CardTitle>
                  {r.reason && (
                    <CardDescription>{r.reason}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="text-xs font-mono text-muted-foreground">
                    {skill}
                  </div>
                  <Link
                    href={`/dashboard/assessments?skill=${encodeURIComponent(skill)}`}
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    Practice
                  </Link>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recently mastered</CardTitle>
          <CardDescription>Skills above 80% mastery</CardDescription>
        </CardHeader>
        <CardContent>
          {mastered.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nothing mastered yet — keep practicing.
            </p>
          ) : (
            <ul className="space-y-2">
              {mastered.slice(0, 10).map((m) => (
                <li
                  key={m.skill_code}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="font-mono text-xs">{m.skill_code}</span>
                  <Badge variant="secondary">
                    {((m.mastery ?? 0) * 100).toFixed(0)}%
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
