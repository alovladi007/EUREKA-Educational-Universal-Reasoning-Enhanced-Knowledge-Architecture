"use client";

/**
 * Notebook page — Phase 17 user collections (kind="notebook").
 * No mock projects, no notebookAPI/socket-client. Just the real
 * /me/collections endpoint, with a tiny create form.
 *
 * The subroutes under /dashboard/notebook/ (projects, tasks, search,
 * payments, …) are left in place untouched.
 */

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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Collection = {
  id: string;
  kind: string;
  title: string;
  description_md: string | null;
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

export default function NotebookPage() {
  const [items, setItems] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function loadCollections() {
    setLoading(true);
    const rows = await api<Collection[]>(
      "/me/collections?kind=notebook",
    ).catch(() => [] as Collection[]);
    setItems(rows);
    setLoading(false);
  }

  useEffect(() => {
    void loadCollections();
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
        body: JSON.stringify({ kind: "notebook", title: t }),
      });
      setTitle("");
      await loadCollections();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create notebook",
      );
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Notebook</h1>
        <p className="text-slate-600 mt-1">
          Your personal notebooks — backed by the Phase 17 collections API.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>New notebook</CardTitle>
          <CardDescription>
            Give it a title; you can add notes later.
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
              placeholder="e.g. MCAT biochemistry review"
              className="flex-1"
              disabled={creating}
            />
            <Button type="submit" disabled={creating || !title.trim()}>
              {creating ? "Creating…" : "Create notebook"}
            </Button>
          </form>
          {error && (
            <p className="text-xs text-red-600 mt-2">{error}</p>
          )}
        </CardContent>
      </Card>

      {loading ? (
        <p className="text-slate-500 text-sm">Loading…</p>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-slate-500 text-sm">
            You don&apos;t have any notebooks yet. Create one above to get
            started.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((c) => (
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
