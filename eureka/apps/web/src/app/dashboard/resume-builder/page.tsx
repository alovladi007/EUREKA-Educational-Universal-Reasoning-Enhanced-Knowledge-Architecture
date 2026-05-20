"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api, formatDate } from "@/lib/eureka-api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type ResumeListItem = {
  id: string;
  title?: string | null;
  updated_at?: string | null;
  [k: string]: unknown;
};

export default function ResumeBuilderPage() {
  const router = useRouter();
  const [resumes, setResumes] = useState<ResumeListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const r = await api<ResumeListItem[]>("/resumes");
      setResumes(Array.isArray(r) ? r : []);
    } catch (e) {
      setError(String((e as Error).message));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createNew() {
    setCreating(true);
    setError(null);
    try {
      const created = await api<ResumeListItem>("/resumes", {
        method: "POST",
        body: JSON.stringify({ title: "Untitled resume" }),
      });
      if (created?.id) {
        router.push(`/dashboard/resume-builder/${created.id}`);
      } else {
        await load();
      }
    } catch (e) {
      setError(String((e as Error).message));
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Resume builder</h1>
          <p className="text-muted-foreground">
            Draft, edit, and export your resumes.
          </p>
        </div>
        <button
          type="button"
          onClick={createNew}
          disabled={creating}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {creating ? "Creating…" : "New resume"}
        </button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : resumes.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-sm text-muted-foreground text-center">
            No resumes yet. Click "New resume" to create one.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {resumes.map((r) => (
            <Card key={r.id}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {r.title?.trim() || "Untitled resume"}
                </CardTitle>
                <CardDescription>
                  Updated {formatDate(r.updated_at)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href={`/dashboard/resume-builder/${r.id}`}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Open
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
