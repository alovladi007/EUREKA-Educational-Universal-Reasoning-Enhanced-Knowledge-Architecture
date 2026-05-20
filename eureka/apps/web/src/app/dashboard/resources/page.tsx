"use client";

/**
 * Resources page — Phase 17 user collections (kind="reading_list") plus
 * hardcoded links to the real in-repo documentation. No fake "Resource"
 * objects with rating/downloads/thumbnail.
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

const OFFICIAL_DOCS: { label: string; href: string }[] = [
  {
    label: "STATUS.md",
    href: "https://github.com/alovladi007/EUREKA-Educational-Universal-Reasoning-Enhanced-Knowledge-Architecture/blob/main/docs/STATUS.md",
  },
  {
    label: "ROADMAP.md",
    href: "https://github.com/alovladi007/EUREKA-Educational-Universal-Reasoning-Enhanced-Knowledge-Architecture/blob/main/docs/ROADMAP.md",
  },
  {
    label: "ARCHITECTURE.md",
    href: "https://github.com/alovladi007/EUREKA-Educational-Universal-Reasoning-Enhanced-Knowledge-Architecture/blob/main/docs/ARCHITECTURE.md",
  },
  {
    label: "SECURITY.md",
    href: "https://github.com/alovladi007/EUREKA-Educational-Universal-Reasoning-Enhanced-Knowledge-Architecture/blob/main/docs/SECURITY.md",
  },
  {
    label: "README.md",
    href: "https://github.com/alovladi007/EUREKA-Educational-Universal-Reasoning-Enhanced-Knowledge-Architecture/blob/main/README.md",
  },
];

function formatWhen(iso: string): string {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function ResourcesPage() {
  const [lists, setLists] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function loadLists() {
    setLoading(true);
    const rows = await api<Collection[]>(
      "/me/collections?kind=reading_list",
    ).catch(() => [] as Collection[]);
    setLists(rows);
    setLoading(false);
  }

  useEffect(() => {
    void loadLists();
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
        body: JSON.stringify({ kind: "reading_list", title: t }),
      });
      setTitle("");
      await loadLists();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create reading list",
      );
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Resources</h1>
        <p className="text-slate-600 mt-1">
          Curate your own reading lists, and jump to the official EUREKA docs.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>New reading list</CardTitle>
          <CardDescription>
            Reading lists group external links you want to revisit.
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
              placeholder="e.g. Patent bar prep — official sources"
              className="flex-1"
              disabled={creating}
            />
            <Button type="submit" disabled={creating || !title.trim()}>
              {creating ? "Creating…" : "Create reading list"}
            </Button>
          </form>
          {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
        </CardContent>
      </Card>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-3">
          Your reading lists
        </h2>
        {loading ? (
          <p className="text-slate-500 text-sm">Loading…</p>
        ) : lists.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-slate-500 text-sm">
              No reading lists yet. Create one above.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lists.map((c) => (
              <Card key={c.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{c.title}</CardTitle>
                  <CardDescription>
                    {c.item_count} item{c.item_count === 1 ? "" : "s"} ·
                    updated {formatWhen(c.updated_at)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(c.tags?.length ?? 0) > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {(c.tags ?? []).map((t) => (
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

      <Card>
        <CardHeader>
          <CardTitle>Browse: official docs</CardTitle>
          <CardDescription>
            The canonical EUREKA documentation, straight from the monorepo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {OFFICIAL_DOCS.map((d) => (
              <li key={d.href}>
                <Link
                  href={d.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-3 py-2 rounded-md border border-slate-200 hover:bg-slate-50 text-sm text-slate-800"
                >
                  {d.label}
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
