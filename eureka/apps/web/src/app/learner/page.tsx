'use client';

/**
 * Single learner UI shell (Phase 4 Session 4.5, 2026-05).
 *
 * One page, four sections: profile, tier enrolments, recommendations,
 * skill mastery. Pulls from the api-core endpoints landed in Sessions
 * 4.1–4.4. Designed as the home screen the rest of the apps/web routes
 * eventually fold into.
 *
 * Auth: reads access_token from localStorage (set by the existing login
 * flow under (auth)/login). If missing, redirects to /auth/login.
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { EurekaNav } from '@/components/eureka-nav';
import { EngagementBanner } from '@/components/engagement-banner';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX || '/api/v1';

interface Profile {
  user_id: string;
  primary_language: string;
  goals: string[];
  interests: string[];
  knowledge_state: Record<string, { mastery: number; attempts: number; bloom?: string }>;
}

interface TierEnrollment {
  id: string;
  tier: string;
  tier_context: Record<string, unknown>;
  status: string;
  progress_pct: string;
  started_at: string | null;
  completed_at: string | null;
}

interface Recommendation {
  skill_id: string;
  framework: string;
  code: string;
  name: string;
  tier: string;
  score: number;
  reason: {
    notes: string[];
    active_tier_fit: number;
    prereq_readiness: number;
    mastery_gap: number;
    goal_alignment: number;
  };
}

interface MasteryEntry {
  skill_id: string;
  mastery: string;
  attempts: number;
  measured_at_bloom: string | null;
}

async function fetchJSON<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${API_URL}${API_PREFIX}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText} on ${path}`);
  }
  return res.json();
}

export default function LearnerDashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [enrollments, setEnrollments] = useState<TierEnrollment[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [mastery, setMastery] = useState<MasteryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function ensure() {
      if (typeof window === 'undefined') return;
      let t = localStorage.getItem('access_token') || localStorage.getItem('accessToken');
      if (!t) {
        // Dev convenience: auto-login with seeded admin so the learner page
        // works without a manual sign-in step.
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
          const apiPrefix = process.env.NEXT_PUBLIC_API_PREFIX || '/api/v1';
          const r = await fetch(`${apiUrl}${apiPrefix}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: 'you@eureka.example.com',
              password: 'EurekaAdmin!2026',
            }),
          });
          if (r.ok) {
            const b = await r.json();
            if (b?.access_token) {
              localStorage.setItem('access_token', b.access_token);
              t = b.access_token;
            }
          }
        } catch {/* fall through */}
      }
      if (!t) {
        router.push('/auth/login');
        return;
      }
      setToken(t);
    }
    ensure();
  }, [router]);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    (async () => {
      try {
        const [prof, enrs, recs, mast] = await Promise.all([
          fetchJSON<Profile>('/learner-profile/me', token),
          fetchJSON<TierEnrollment[]>('/tier-enrollments/me', token),
          fetchJSON<Recommendation[]>('/recommendations/me?limit=8', token),
          fetchJSON<MasteryEntry[]>('/skills/me/mastery', token),
        ]);
        if (cancelled) return;
        setProfile(prof);
        setEnrollments(enrs);
        setRecommendations(recs);
        setMastery(mast);
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (!token) return null;
  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <p className="text-muted-foreground">Loading your dashboard…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <Alert variant="destructive">
          <AlertTitle>Couldn&apos;t load your dashboard</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <EurekaNav />
      <div className="container mx-auto p-6 space-y-6">
        <header>
          <h1 className="text-3xl font-bold">Your learner spine</h1>
          <p className="text-muted-foreground mt-1">
            One identity, every tier — Phase 4 in action.
          </p>
        </header>

        <EngagementBanner />

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Preferences, languages, and goals — the recommender uses this.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm">
            <span className="font-medium">Primary language:</span>{' '}
            {profile?.primary_language || 'en-US'}
          </div>
          {profile?.goals && profile.goals.length > 0 && (
            <div>
              <div className="text-sm font-medium mb-1">Goals</div>
              <div className="flex flex-wrap gap-1">
                {profile.goals.map((g) => (
                  <Badge key={g} variant="secondary">
                    {g}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {profile?.interests && profile.interests.length > 0 && (
            <div>
              <div className="text-sm font-medium mb-1">Interests</div>
              <div className="flex flex-wrap gap-1">
                {profile.interests.map((i) => (
                  <Badge key={i} variant="outline">
                    {i}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tier enrolments */}
      <Card>
        <CardHeader>
          <CardTitle>Tier enrolments</CardTitle>
          <CardDescription>
            Every tier you&apos;re in right now. Multiple at once is the point —
            you can do HS + USMLE + FE simultaneously.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {enrollments.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No enrolments yet. Pick a tier to get started.
            </p>
          ) : (
            <div className="grid gap-3">
              {enrollments.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between border rounded-md p-3"
                >
                  <div>
                    <div className="font-medium">
                      {e.tier}
                      {e.tier_context.exam ? ` — ${String(e.tier_context.exam)}` : ''}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {Object.entries(e.tier_context)
                        .filter(([k]) => k !== 'exam')
                        .map(([k, v]) => `${k}: ${String(v)}`)
                        .join(' · ') || '—'}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        e.status === 'active'
                          ? 'default'
                          : e.status === 'completed'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {e.status}
                    </Badge>
                    <div className="w-24">
                      <Progress value={Number(e.progress_pct)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>What to work on next</CardTitle>
          <CardDescription>
            Cross-tier recommendations from the skill graph + your active enrolments + goals.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recommendations.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No recommendations yet — enrol in a tier or set a goal.
            </p>
          ) : (
            <div className="space-y-3">
              {recommendations.map((r) => (
                <div key={r.skill_id} className="border rounded-md p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline">{r.framework}</Badge>
                        <span className="font-mono text-xs text-muted-foreground">
                          {r.code}
                        </span>
                        <Badge variant="secondary">{r.tier}</Badge>
                      </div>
                      <div className="mt-1 font-medium">{r.name}</div>
                      {r.reason.notes.length > 0 && (
                        <ul className="mt-2 text-xs text-muted-foreground list-disc pl-5">
                          {r.reason.notes.map((n, i) => (
                            <li key={i}>{n}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-2xl font-bold text-primary">
                        {(r.score * 100).toFixed(0)}
                      </div>
                      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                        score
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mastery */}
      <Card>
        <CardHeader>
          <CardTitle>Skill mastery</CardTitle>
          <CardDescription>
            Where you are on every skill you&apos;ve practised. ≥ 85% counts as
            mastered and shows up on your transcript.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mastery.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No mastery data yet. The tutor and assessments will populate
              this as you practice.
            </p>
          ) : (
            <div className="space-y-2">
              {mastery.slice(0, 12).map((m) => (
                <div key={m.skill_id} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0 font-mono text-xs truncate">
                    {m.skill_id.slice(0, 8)}…
                  </div>
                  <div className="w-32">
                    <Progress value={Number(m.mastery) * 100} />
                  </div>
                  <div className="w-12 text-right text-xs tabular-nums">
                    {(Number(m.mastery) * 100).toFixed(0)}%
                  </div>
                  <div className="w-12 text-right text-xs text-muted-foreground">
                    {m.attempts}×
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button asChild variant="outline">
          <a href="/transcript">View signed transcript →</a>
        </Button>
      </div>
    </div>
    </>
  );
}
