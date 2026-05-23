"use client";

/**
 * /dashboard/high-school/resources — resources + community threads for the
 * HS tier. Parallel to /dashboard/undergraduate/resources.
 */

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
import { Folder, MessageSquare } from "lucide-react";

const TIER = "high_school";

type Resource = {
  id: string;
  title?: string;
  url?: string | null;
  description_md?: string | null;
  description?: string | null;
  tier?: string | null;
  kind?: string | null;
  tags?: string[];
  skill_code?: string | null;
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

export default function HighSchoolResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [rs, ts] = await Promise.all([
          api<Resource[]>(`/resources?tier=${TIER}&limit=50`).catch(() => []),
          api<Thread[]>(`/community/threads?tier=${TIER}&limit=20`).catch(
            () => [],
          ),
        ]);
        setResources(Array.isArray(rs) ? rs : []);
        setThreads(Array.isArray(ts) ? ts : []);
      } catch (e) {
        setError(String((e as Error)?.message ?? e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Folder className="h-6 w-6 text-primary" />
          Resources
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Helpful materials and discussions tagged for the high-school tier.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Could not load</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && <p className="text-muted-foreground">Loading…</p>}

      {!loading && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Resources ({resources.length})
              </CardTitle>
              <CardDescription>
                Live from{" "}
                <code className="font-mono">/resources?tier={TIER}</code>.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {resources.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No resources tagged for this tier yet.
                </p>
              ) : (
                <ul className="space-y-2">
                  {resources.map((r) => {
                    const desc = r.description_md ?? r.description ?? null;
                    return (
                      <li key={r.id} className="rounded-md border p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="font-medium">
                              {r.url ? (
                                <a
                                  href={r.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  {r.title ?? r.url}
                                </a>
                              ) : (
                                (r.title ?? "Untitled")
                              )}
                            </div>
                            {desc && (
                              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                                {desc}
                              </p>
                            )}
                            {Array.isArray(r.tags) && r.tags.length > 0 && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {r.tags.slice(0, 6).map((t) => (
                                  <span
                                    key={t}
                                    className="text-[10px] uppercase tracking-wide text-muted-foreground"
                                  >
                                    #{t}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          {r.kind && (
                            <Badge variant="outline" className="text-xs">
                              {r.kind}
                            </Badge>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Discussions ({threads.length})
              </CardTitle>
              <CardDescription>
                Live from{" "}
                <code className="font-mono">
                  /community/threads?tier={TIER}
                </code>
                .
              </CardDescription>
            </CardHeader>
            <CardContent>
              {threads.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No discussions yet. Be the first to start one over at{" "}
                  <Link
                    href="/dashboard/community"
                    className="text-primary hover:underline"
                  >
                    Community
                  </Link>
                  .
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
        </>
      )}
    </div>
  );
}
