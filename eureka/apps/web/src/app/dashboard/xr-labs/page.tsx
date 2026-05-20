"use client";

/**
 * XR Labs landing — Phase 17 user collections (kind="study_set") +
 * an honest pointer at the separate XR microservice. No mock simulations,
 * no fake stats. The 3D scene-builder and experience runner live under
 * /dashboard/xr-labs/scene-builder and /dashboard/xr-labs/experience/[id]
 * and are left untouched.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/eureka-api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Collection = {
  id: string;
  kind: string;
  title: string;
  tags: string[];
  item_count: number;
  created_at: string;
  updated_at: string;
};

function formatWhen(iso: string): string {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function XRLabsPage() {
  const [sets, setSets] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function loadSets() {
    setLoading(true);
    const rows = await api<Collection[]>(
      "/me/collections?kind=study_set",
    ).catch(() => [] as Collection[]);
    setSets(rows);
    setLoading(false);
  }

  useEffect(() => {
    void loadSets();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    setCreating(true);
    setError(null);
    try {
      await api<Collection>("/me/collections", {
        method: "POST",
        body: JSON.stringify({ kind: "study_set", title: t }),
      });
      setTitle("");
      await loadSets();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create study set",
      );
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">XR Labs</h1>
        <p className="text-slate-600 mt-1">
          Organise virtual-lab notes and study sets for your XR sessions.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>About XR labs</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-700 space-y-2">
          <p>
            EUREKA&apos;s XR labs run as a separate microservice (
            <code className="bg-slate-100 px-1 py-0.5 rounded">
              services/xr-labs/
            </code>
            ). The web UI here lets you organise virtual-lab notes and study
            sets. The full 3D scene-builder + experience runner live at{" "}
            <Link
              href="/dashboard/xr-labs/scene-builder"
              className="text-amber-700 underline"
            >
              /dashboard/xr-labs/scene-builder
            </Link>{" "}
            and{" "}
            <code className="bg-slate-100 px-1 py-0.5 rounded">
              /dashboard/xr-labs/experience/[id]
            </code>{" "}
            — those subroutes already exist; leave them in place.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>New study set</CardTitle>
          <CardDescription>
            Group your XR session notes, observations, and follow-ups.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleCreate}
            className="flex flex-col sm:flex-row gap-2"
          >
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Organic chemistry — VR titration walkthroughs"
              className="flex-1"
              disabled={creating}
            />
            <Button type="submit" disabled={creating || !title.trim()}>
              {creating ? "Creating…" : "Create study set"}
            </Button>
          </form>
          {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
        </CardContent>
      </Card>

      {loading ? (
        <p className="text-slate-500 text-sm">Loading…</p>
      ) : sets.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-slate-500 text-sm">
            No study sets yet. Create one above.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sets.map((c) => (
            <Card key={c.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{c.title}</CardTitle>
                <CardDescription>
                  {c.item_count} item{c.item_count === 1 ? "" : "s"} · updated{" "}
                  {formatWhen(c.updated_at)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {c.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {c.tags.map((t) => (
                      <Badge key={t} variant="secondary">
                        {t}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
