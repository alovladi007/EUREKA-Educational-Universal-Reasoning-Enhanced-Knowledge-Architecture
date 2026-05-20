"use client";

/**
 * Phase 19.1 — Course detail page.
 *
 * Previously every "View" click from /dashboard/courses 404'd because
 * this route didn't exist. Now wired to GET /courses/{id} + POST
 * /courses/{id}/enroll (Phase 4 enrollments) — all real.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api, ApiError, formatDate } from "@/lib/eureka-api";
import { ArrowLeft, BookOpen, GraduationCap, Calendar, Tag, User, CheckCircle2 } from "lucide-react";

type Course = {
  id: string;
  org_id: string;
  title: string;
  code: string | null;
  description: string | null;
  tier: string | null;
  instructor_id: string | null;
  syllabus: string | null;
  learning_objectives: string[] | null;
  standards: string[] | null;
  subject: string | null;
  level: string | null;
  credits: number | null;
  is_published: boolean;
  is_archived: boolean;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string | null;
  enrollment_count: number | null;
};

export default function CourseDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id as string | undefined;

  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const c = await api<Course>(`/courses/${id}`);
        setCourse(c);
      } catch (e) {
        setError(String((e as Error).message));
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function enroll() {
    if (!id) return;
    setEnrolling(true);
    try {
      await api(`/courses/${id}/enroll`, { method: "POST" });
      setEnrolled(true);
    } catch (e) {
      const msg = e instanceof ApiError ? `${e.status} — ${JSON.stringify(e.detail)}` : (e as Error).message;
      alert(msg);
    } finally {
      setEnrolling(false);
    }
  }

  if (loading) {
    return <p className="text-muted-foreground">Loading…</p>;
  }

  if (error || !course) {
    return (
      <div className="space-y-3 max-w-2xl">
        <Link href="/dashboard/courses" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" /> All courses
        </Link>
        <Alert variant="destructive">
          <AlertTitle>Course not found</AlertTitle>
          <AlertDescription>{error || "No course matched that id."}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Link href="/dashboard/courses" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
        <ArrowLeft className="h-3.5 w-3.5" /> All courses
      </Link>

      <div>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-bold">
              <BookOpen className="h-7 w-7 text-primary" />
              {course.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-muted-foreground">
              {course.code && <span className="font-mono text-xs">{course.code}</span>}
              {course.tier && <Badge variant="outline">{course.tier}</Badge>}
              {course.level && <Badge variant="secondary">{course.level}</Badge>}
              {course.subject && <span>· {course.subject}</span>}
              {course.is_published && <Badge>Published</Badge>}
              {course.is_archived && <Badge variant="destructive">Archived</Badge>}
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button onClick={enroll} disabled={enrolling || enrolled}>
              {enrolled ? (
                <><CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Enrolled</>
              ) : enrolling ? "Enrolling…" : "Enroll"}
            </Button>
            <Link href="/dashboard/tutor">
              <Button variant="outline">Ask the AI tutor</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardDescription>Credits</CardDescription>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="text-2xl font-bold tabular-nums">{course.credits ?? "—"}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardDescription>Enrolled</CardDescription>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="text-2xl font-bold tabular-nums">{course.enrollment_count ?? "—"}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardDescription>Starts</CardDescription>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="text-base">{course.start_date ? formatDate(course.start_date) : "—"}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardDescription>Ends</CardDescription>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="text-base">{course.end_date ? formatDate(course.end_date) : "—"}</CardContent>
        </Card>
      </div>

      {course.description && (
        <Card>
          <CardHeader><CardTitle className="text-base">Description</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{course.description}</p>
          </CardContent>
        </Card>
      )}

      {course.learning_objectives && course.learning_objectives.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Learning objectives</CardTitle>
            <CardDescription>{course.learning_objectives.length} objective{course.learning_objectives.length === 1 ? "" : "s"}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1.5 text-sm">
              {course.learning_objectives.map((o, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {course.standards && course.standards.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" />
              Standards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {course.standards.map((s) => (
                <Badge key={s} variant="secondary" className="text-[10px] font-mono">{s}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {course.syllabus && (
        <Card>
          <CardHeader><CardTitle className="text-base">Syllabus</CardTitle></CardHeader>
          <CardContent>
            <pre className="text-xs whitespace-pre-wrap font-sans">{course.syllabus}</pre>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <dt className="text-muted-foreground">Created</dt>
            <dd>{formatDate(course.created_at)}</dd>
            <dt className="text-muted-foreground">Updated</dt>
            <dd>{course.updated_at ? formatDate(course.updated_at) : "—"}</dd>
            <dt className="text-muted-foreground">Instructor</dt>
            <dd className="font-mono text-[11px]">{course.instructor_id?.slice(0, 8) ?? "—"}</dd>
            <dt className="text-muted-foreground">Org</dt>
            <dd className="font-mono text-[11px]">{course.org_id.slice(0, 8)}</dd>
            <dt className="text-muted-foreground">ID</dt>
            <dd className="font-mono text-[11px]">{course.id}</dd>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
