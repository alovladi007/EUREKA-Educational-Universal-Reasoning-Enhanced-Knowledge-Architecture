"use client";

/**
 * /dashboard/high-school/courses — HS-tier course catalog with search.
 *
 * Note: in the current demo org (tier=undergraduate), course-create
 * enforces course.tier == org.tier, so the HS catalog is intentionally
 * empty here. The empty state is honest, not a bug.
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api } from "@/lib/eureka-api";
import { BookOpen, Search } from "lucide-react";

const TIER = "high_school";

type Course = {
  id: string;
  title: string;
  code?: string | null;
  description?: string | null;
  tier?: string | null;
  level?: string | null;
  subject?: string | null;
  credits?: number | null;
};

type CoursePage = { items?: Course[]; total?: number };

export default function HighSchoolCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const cs = await api<CoursePage | Course[]>(
          `/courses/?limit=50&tier=${TIER}&is_published=true`,
        );
        const items = Array.isArray(cs)
          ? cs
          : Array.isArray(cs?.items)
            ? (cs.items as Course[])
            : [];
        setCourses(items);
      } catch (e) {
        setError(String((e as Error)?.message ?? e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter(
      (c) =>
        (c.title ?? "").toLowerCase().includes(q) ||
        (c.code ?? "").toLowerCase().includes(q) ||
        (c.description ?? "").toLowerCase().includes(q) ||
        (c.subject ?? "").toLowerCase().includes(q),
    );
  }, [courses, search]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          Courses
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Published high-school courses (NGSS / CCSS / AP) available in your
          organization. Live from{" "}
          <code className="font-mono">/courses?tier={TIER}</code>.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Could not load courses</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by title, code, subject…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>

      {loading && <p className="text-muted-foreground">Loading…</p>}

      {!loading && filtered.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center space-y-2">
            <p className="text-base">
              {courses.length === 0
                ? "No published courses for the high-school tier yet."
                : "No courses match your search."}
            </p>
            {courses.length === 0 && (
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                If your organization is configured for the high-school tier,
                your admin authors courses at{" "}
                <Link
                  href="/dashboard/teacher"
                  className="text-primary hover:underline"
                >
                  Teacher Tools
                </Link>
                . Course tier must match your org tier — that&apos;s a platform
                constraint, not a bug.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid gap-3 md:grid-cols-2">
          {filtered.map((c) => (
            <Link key={c.id} href={`/dashboard/courses/${c.id}`}>
              <Card className="h-full hover:border-primary/40 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <CardTitle className="text-base">{c.title}</CardTitle>
                      <CardDescription className="flex flex-wrap items-center gap-2 mt-1">
                        {c.code && (
                          <Badge variant="outline" className="text-xs">
                            {c.code}
                          </Badge>
                        )}
                        {c.subject && (
                          <span className="text-xs capitalize">
                            {c.subject.replace(/_/g, " ")}
                          </span>
                        )}
                        {c.level && (
                          <span className="text-xs">· {c.level}</span>
                        )}
                        {typeof c.credits === "number" && (
                          <span className="text-xs">· {c.credits} cr</span>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                {c.description && (
                  <CardContent>
                    <p className="text-xs text-muted-foreground line-clamp-3">
                      {c.description}
                    </p>
                  </CardContent>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
