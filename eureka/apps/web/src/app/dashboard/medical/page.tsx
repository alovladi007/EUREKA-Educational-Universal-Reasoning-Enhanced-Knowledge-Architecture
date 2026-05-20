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
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/eureka-api";
import {
  Stethoscope,
  BookOpen,
  Sparkles,
  MessageSquare,
  Folder,
  Search,
  GraduationCap,
  Target,
} from "lucide-react";

const TIER = "medical";
const TITLE = "Medical Education";
const FRAMEWORKS = ["usmle", "usmle_step_1", "mbe"];

type TierEnrollment = {
  id: string;
  tier: string;
  framework: string | null;
  target_date: string | null;
  status: string;
  created_at: string;
};
type Course = {
  id: string;
  title: string;
  description?: string | null;
  tier?: string | null;
  level?: string | null;
  instructor_id?: string | null;
  created_at?: string;
};
type CoursePage = {
  items?: Course[];
  total?: number;
  page?: number;
  pages?: number;
};
type Recommendation = {
  skill_id?: string;
  framework?: string;
  code?: string;
  name?: string;
  tier?: string;
  score?: number;
  reason?: unknown;
};
type SkillMastery = {
  skill_code: string;
  mastery: number;
  attempts?: number;
  correct_rate?: number;
};
type Thread = {
  id: string;
  title?: string;
  body?: string;
  author_id?: string;
  tier?: string | null;
  created_at?: string;
  reply_count?: number;
};
type Resource = {
  id: string;
  title?: string;
  url?: string | null;
  description?: string | null;
  tier?: string | null;
  kind?: string | null;
};

function renderReason(reason: unknown): string {
  if (typeof reason === "string") return reason;
  if (!reason || typeof reason !== "object") return "";
  const obj = reason as Record<string, unknown>;
  const notes = obj.notes;
  if (Array.isArray(notes) && notes.length > 0)
    return (notes as unknown[]).join(" · ");
  const ent = Object.entries(obj)
    .filter(([, v]) => typeof v === "number" && (v as number) > 0)
    .map(([k, v]) => `${k.replace(/_/g, " ")}: ${(v as number).toFixed(2)}`);
  return ent.length > 0 ? ent.join(" · ") : "";
}

export default function MedicalPage() {
  const [enrollments, setEnrollments] = useState<TierEnrollment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [skills, setSkills] = useState<SkillMastery[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [es, cs, rs, ms, ts, rsx] = await Promise.all([
          api<TierEnrollment[]>("/tier-enrollments/me").catch(() => []),
          api<CoursePage | Course[]>(`/courses/?limit=50&tier=${TIER}`).catch(
            () => ({ items: [] }),
          ),
          api<Recommendation[]>("/recommendations/me").catch(() => []),
          api<SkillMastery[]>("/analytics/me/skills").catch(() => []),
          api<Thread[]>(`/community/threads?tier=${TIER}&limit=10`).catch(
            () => [],
          ),
          api<Resource[]>(`/resources?tier=${TIER}&limit=10`).catch(() => []),
        ]);
        setEnrollments(
          (Array.isArray(es) ? es : []).filter((e) => e.tier === TIER),
        );
        const items = Array.isArray(cs)
          ? (cs as Course[])
          : Array.isArray((cs as CoursePage)?.items)
            ? ((cs as CoursePage).items as Course[])
            : [];
        setCourses(items);
        const recList = Array.isArray(rs) ? rs : [];
        setRecs(
          recList.filter(
            (r) =>
              !r.framework ||
              FRAMEWORKS.includes(String(r.framework).toLowerCase()),
          ),
        );
        setSkills(Array.isArray(ms) ? ms : []);
        setThreads(Array.isArray(ts) ? ts : []);
        setResources(Array.isArray(rsx) ? rsx : []);
      } catch (e) {
        setError(String((e as Error)?.message ?? e));
      }
    })();
  }, []);

  const filteredCourses = courses.filter((c) =>
    search.trim().length === 0
      ? true
      : (c.title ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (c.description ?? "").toLowerCase().includes(search.toLowerCase()),
  );
  const topSkills = [...skills].sort((a, b) => b.mastery - a.mastery).slice(0, 5);
  const bottomSkills = [...skills]
    .sort((a, b) => a.mastery - b.mastery)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <Card className="border-rose-500/20 bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent">
        <CardContent className="flex items-start justify-between gap-4 pt-6">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-rose-500/10 p-3">
              <Stethoscope className="h-8 w-8 text-rose-600" />
            </div>
            <div>
              <h1 className="mb-1 text-3xl font-bold">{TITLE}</h1>
              <p className="text-muted-foreground">
                Real-time view of your medical tier — live courses,
                recommendations, skill mastery, discussions, and resources from
                the EUREKA API.
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

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Courses</p>
                <p className="text-2xl font-bold">{courses.length}</p>
              </div>
              <BookOpen className="h-6 w-6 text-rose-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Enrollments</p>
                <p className="text-2xl font-bold">{enrollments.length}</p>
              </div>
              <GraduationCap className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Recommendations</p>
                <p className="text-2xl font-bold">{recs.length}</p>
              </div>
              <Sparkles className="h-6 w-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Skills tracked</p>
                <p className="text-2xl font-bold">{skills.length}</p>
              </div>
              <Target className="h-6 w-6 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enrollments */}
      <Card>
        <CardHeader>
          <CardTitle>Your enrollments in this tier</CardTitle>
          <CardDescription>
            Live from <code>/tier-enrollments/me</code>
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
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{e.tier}</Badge>
                      <span className="font-medium">
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

      {/* Courses */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>Courses</CardTitle>
              <CardDescription>
                Live from <code>/courses?tier={TIER}</code>
              </CardDescription>
            </div>
            <div className="relative w-64 max-w-full">
              <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search courses…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredCourses.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No courses found for this tier yet.
            </p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {filteredCourses.map((c) => (
                <div
                  key={c.id}
                  className="rounded-md border p-3 transition-colors hover:bg-accent"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold">{c.title}</h4>
                    {c.level && (
                      <Badge variant="outline" className="text-xs">
                        {c.level}
                      </Badge>
                    )}
                  </div>
                  {c.description && (
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {c.description}
                    </p>
                  )}
                  <div className="mt-2">
                    <Link
                      href={`/dashboard/courses/${c.id}`}
                      className="text-xs text-primary underline"
                    >
                      Open course →
                    </Link>
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
          <CardTitle>Top recommendations</CardTitle>
          <CardDescription>
            From <code>/recommendations/me</code> filtered to{" "}
            {FRAMEWORKS.join(", ")}
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
              {recs.slice(0, 8).map((r, i) => (
                <li
                  key={`${r.skill_id ?? r.code ?? "rec"}-${i}`}
                  className="flex items-start justify-between gap-3 rounded-md border p-3"
                >
                  <div className="min-w-0">
                    <div className="font-medium">
                      {r.name ?? r.code ?? r.skill_id ?? "Untitled"}
                    </div>
                    {r.reason !== undefined && (
                      <div className="text-xs text-muted-foreground">
                        {renderReason(r.reason)}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {typeof r.score === "number" && (
                      <span className="text-xs text-muted-foreground">
                        {r.score.toFixed(2)}
                      </span>
                    )}
                    <Badge variant="outline" className="uppercase">
                      {r.framework ?? "rec"}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Skill mastery */}
      <Card>
        <CardHeader>
          <CardTitle>Skill mastery snapshot</CardTitle>
          <CardDescription>
            From <code>/analytics/me/skills</code>
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
                {topSkills.map((s) => {
                  const pct = Math.round((s.mastery ?? 0) * 100);
                  return (
                    <li key={`top-${s.skill_code}`}>
                      <div className="flex justify-between text-xs">
                        <span className="font-medium">{s.skill_code}</span>
                        <span className="text-muted-foreground">{pct}%</span>
                      </div>
                      <div className="mt-1 h-2 rounded bg-secondary">
                        <div
                          className="h-full rounded bg-emerald-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
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
                {bottomSkills.map((s) => {
                  const pct = Math.round((s.mastery ?? 0) * 100);
                  return (
                    <li key={`bot-${s.skill_code}`}>
                      <div className="flex justify-between text-xs">
                        <span className="font-medium">{s.skill_code}</span>
                        <span className="text-muted-foreground">{pct}%</span>
                      </div>
                      <div className="mt-1 h-2 rounded bg-secondary">
                        <div
                          className="h-full rounded bg-amber-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Community + Resources */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" /> Discussions on this tier
            </CardTitle>
            <CardDescription>
              Live from <code>/community/threads?tier={TIER}</code>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {threads.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No discussions yet. Be the first to start one.
              </p>
            ) : (
              <ul className="space-y-2">
                {threads.map((t) => (
                  <li
                    key={t.id}
                    className="rounded-md border p-3 hover:bg-accent"
                  >
                    <Link
                      href={`/dashboard/community/${t.id}`}
                      className="block"
                    >
                      <div className="font-medium">
                        {t.title ?? "Untitled thread"}
                      </div>
                      {t.body && (
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                          {t.body}
                        </p>
                      )}
                      <div className="mt-1 text-xs text-muted-foreground">
                        {typeof t.reply_count === "number"
                          ? `${t.reply_count} replies`
                          : "Open thread"}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Folder className="h-5 w-5" /> Resources
            </CardTitle>
            <CardDescription>
              Live from <code>/resources?tier={TIER}</code>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {resources.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No resources tagged for this tier yet.
              </p>
            ) : (
              <ul className="space-y-2">
                {resources.map((r) => (
                  <li key={r.id} className="rounded-md border p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-medium">
                          {r.url ? (
                            <a
                              href={r.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary underline"
                            >
                              {r.title ?? r.url}
                            </a>
                          ) : (
                            r.title ?? "Untitled"
                          )}
                        </div>
                        {r.description && (
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                            {r.description}
                          </p>
                        )}
                      </div>
                      {r.kind && (
                        <Badge variant="outline" className="text-xs">
                          {r.kind}
                        </Badge>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Specialized medical modules — the rich pre-existing subroutes */}
      <Card>
        <CardHeader>
          <CardTitle>Specialized medical modules</CardTitle>
          <CardDescription>
            Each is a self-contained module under{" "}
            <span className="font-mono text-xs">/dashboard/medical/*</span>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { href: "/dashboard/medical/qbank", title: "USMLE QBank", hint: "Practice questions with IRT difficulty + detailed explanations." },
              { href: "/dashboard/medical/qbank/analytics", title: "QBank Analytics", hint: "Performance breakdown by system, skill, and time-on-question." },
              { href: "/dashboard/medical/cases", title: "Clinical Cases", hint: "Multi-step cases — history, exam, labs, differential, plan." },
              { href: "/dashboard/medical/osce", title: "OSCE Stations", hint: "Scripted patient encounters with rubric-graded performance." },
              { href: "/dashboard/medical/anatomy", title: "3D Anatomy", hint: "Browse systems, organs, regional anatomy with labels." },
              { href: "/dashboard/medical/ai-tutor", title: "Medical AI Tutor", hint: "Phase 6 Claude agent with clinical-reasoning system prompt." },
              { href: "/dashboard/medical/ml-demos", title: "ML Demos", hint: "In-browser demos of medical AI models (imaging, NLP, etc.)." },
              { href: "/dashboard/medical/content-studio", title: "Content Studio", hint: "Author + edit USMLE-style items with AI variant generation." },
            ].map((m) => (
              <Link key={m.href} href={m.href}>
                <Card className="h-full hover:border-primary/40 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="font-semibold">{m.title}</div>
                    <p className="text-xs text-muted-foreground mt-1">{m.hint}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Keep going */}
      <Card>
        <CardHeader>
          <CardTitle>Keep going</CardTitle>
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
