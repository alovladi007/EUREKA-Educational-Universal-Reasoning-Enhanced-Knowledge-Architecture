"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
import { Input } from "@/components/ui/input";

type Course = {
  id: string;
  title?: string;
  description?: string | null;
  tier?: string | null;
  level?: string | null;
  [k: string]: unknown;
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const r = await api<{ items: Course[]; total: number }>(
          "/courses/?limit=50",
        );
        setCourses(Array.isArray(r?.items) ? r.items : []);
      } catch (e) {
        setError(String((e as Error).message));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter((c) =>
      (c.title ?? "").toLowerCase().includes(q),
    );
  }, [courses, query]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Courses</h1>
        <p className="text-muted-foreground">
          Browse the full course catalog.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Failed to load courses</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="max-w-md">
        <Input
          type="search"
          placeholder="Search by title…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading courses…</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {courses.length === 0
            ? "No courses available."
            : "No courses match your search."}
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <Card key={c.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">
                  {c.title ?? "Untitled course"}
                </CardTitle>
                {c.description && (
                  <CardDescription className="line-clamp-3">
                    {c.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="mt-auto space-y-3">
                <div className="flex flex-wrap gap-2">
                  {c.tier && <Badge variant="outline">{c.tier}</Badge>}
                  {c.level && <Badge variant="secondary">{c.level}</Badge>}
                </div>
                <Link
                  href={`/dashboard/courses/${c.id}`}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  View
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
