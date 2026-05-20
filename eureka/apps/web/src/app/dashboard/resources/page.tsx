"use client";
/**
 * EUREKA - Resources Page
 * Phase 18 curated catalog — fully wired to /api/v1/resources.
 * No mock data, no localStorage, no hardcoded categories.
 */

import { useCallback, useEffect, useState } from "react";
import {
  Video,
  FileText,
  BookOpen,
  Book,
  Wrench,
  GraduationCap,
  Database,
  Globe,
  FileCode,
  Link2,
  ThumbsUp,
  Trash2,
  Plus,
  Search,
  Award,
  ExternalLink,
} from "lucide-react";
import { api } from "@/lib/eureka-api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type ResourceKind =
  | "video"
  | "article"
  | "book"
  | "paper"
  | "tutorial"
  | "documentation"
  | "course"
  | "tool"
  | "dataset"
  | "other";

interface Resource {
  id: string;
  org_id?: string;
  created_by?: string;
  title: string;
  kind: ResourceKind;
  url?: string | null;
  description_md?: string | null;
  skill_code?: string | null;
  tier?: string | null;
  tags: string[];
  is_public?: boolean;
  upvote_count: number;
  sme_endorsed?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface Me {
  id?: string;
  email?: string;
  [k: string]: unknown;
}

const KIND_OPTIONS: ResourceKind[] = [
  "video",
  "article",
  "book",
  "paper",
  "tutorial",
  "documentation",
  "course",
  "tool",
  "dataset",
  "other",
];

const TIER_OPTIONS = ["intro", "core", "advanced", "expert"];

function kindIcon(kind: ResourceKind) {
  const cls = "w-5 h-5";
  switch (kind) {
    case "video":
      return <Video className={cls} />;
    case "article":
      return <FileText className={cls} />;
    case "book":
      return <Book className={cls} />;
    case "paper":
      return <FileCode className={cls} />;
    case "tutorial":
      return <BookOpen className={cls} />;
    case "documentation":
      return <Globe className={cls} />;
    case "course":
      return <GraduationCap className={cls} />;
    case "tool":
      return <Wrench className={cls} />;
    case "dataset":
      return <Database className={cls} />;
    default:
      return <Link2 className={cls} />;
  }
}

export default function ResourcesPage() {
  const [rows, setRows] = useState<Resource[]>([]);
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // filters
  const [filterKind, setFilterKind] = useState<string>("");
  const [filterTier, setFilterTier] = useState<string>("");
  const [filterSkill, setFilterSkill] = useState<string>("");
  const [query, setQuery] = useState<string>("");

  // add form
  const [showAdd, setShowAdd] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formKind, setFormKind] = useState<ResourceKind>("article");
  const [formUrl, setFormUrl] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formSkill, setFormSkill] = useState("");
  const [formTier, setFormTier] = useState("");
  const [formTags, setFormTags] = useState("");
  const [formPublic, setFormPublic] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadResources = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filterTier) params.set("tier", filterTier);
      if (filterKind) params.set("kind", filterKind);
      if (filterSkill) params.set("skill_code", filterSkill);
      if (query) params.set("q", query);
      params.set("limit", "100");
      const data = await api<unknown>(`/resources?${params.toString()}`);
      const list = Array.isArray(data) ? (data as Resource[]) : [];
      setRows(list);
    } catch (e) {
      setRows([]);
      setError(String((e as Error).message));
    } finally {
      setLoading(false);
    }
  }, [filterKind, filterTier, filterSkill, query]);

  useEffect(() => {
    (async () => {
      try {
        const u = await api<Me>("/users/me");
        setMe(u || null);
      } catch {
        setMe(null);
      }
    })();
  }, []);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  const handleUpvote = async (r: Resource) => {
    try {
      const updated = await api<Resource>(`/resources/${r.id}/upvote`, {
        method: "POST",
      });
      setRows((prev) => prev.map((x) => (x.id === r.id ? updated : x)));
    } catch (e) {
      setError(String((e as Error).message));
    }
  };

  const handleUnvote = async (r: Resource) => {
    try {
      const updated = await api<Resource>(`/resources/${r.id}/upvote`, {
        method: "DELETE",
      });
      setRows((prev) => prev.map((x) => (x.id === r.id ? updated : x)));
    } catch (e) {
      setError(String((e as Error).message));
    }
  };

  const handleRemove = async (r: Resource) => {
    try {
      await api<void>(`/resources/${r.id}`, { method: "DELETE" });
      setRows((prev) => prev.filter((x) => x.id !== r.id));
    } catch (e) {
      setError(String((e as Error).message));
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const tagList = formTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const created = await api<Resource>("/resources", {
        method: "POST",
        body: JSON.stringify({
          title: formTitle,
          kind: formKind,
          url: formUrl || undefined,
          description_md: formDesc || undefined,
          skill_code: formSkill || undefined,
          tier: formTier || undefined,
          tags: tagList,
          is_public: formPublic,
        }),
      });
      setRows((prev) => [created, ...prev]);
      setShowAdd(false);
      setFormTitle("");
      setFormUrl("");
      setFormDesc("");
      setFormSkill("");
      setFormTier("");
      setFormTags("");
      setFormPublic(false);
      setFormKind("article");
    } catch (err) {
      setError(String((err as Error).message));
    } finally {
      setSubmitting(false);
    }
  };

  const safeRows = Array.isArray(rows) ? rows : [];
  const myId = me?.id;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Learning Resources</h1>
        <p className="text-muted-foreground">
          Real curated catalog — wired to /api/v1/resources
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filter row */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Kind
              </label>
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={filterKind}
                onChange={(e) => setFilterKind(e.target.value)}
              >
                <option value="">All kinds</option>
                {KIND_OPTIONS.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Tier
              </label>
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value)}
              >
                <option value="">All tiers</option>
                {TIER_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Skill code
              </label>
              <Input
                placeholder="e.g. CALC1.LIMITS"
                value={filterSkill}
                onChange={(e) => setFilterSkill(e.target.value)}
              />
            </div>
            <div className="md:col-span-1">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Title or body"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Button
                type="button"
                className="w-full gap-2"
                onClick={() => setShowAdd((v) => !v)}
              >
                <Plus className="w-4 h-4" />
                {showAdd ? "Cancel" : "Add resource"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add resource form */}
      {showAdd && (
        <Card>
          <CardHeader>
            <CardTitle>New resource</CardTitle>
            <CardDescription>
              POST /resources — creates inside your org by default.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  placeholder="Title *"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                />
                <select
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={formKind}
                  onChange={(e) =>
                    setFormKind(e.target.value as ResourceKind)
                  }
                >
                  {KIND_OPTIONS.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                type="url"
                placeholder="URL (https://…)"
                value={formUrl}
                onChange={(e) => setFormUrl(e.target.value)}
              />
              <Textarea
                placeholder="Description (markdown supported)"
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  placeholder="skill_code (e.g. CALC1.LIMITS)"
                  value={formSkill}
                  onChange={(e) => setFormSkill(e.target.value)}
                />
                <select
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={formTier}
                  onChange={(e) => setFormTier(e.target.value)}
                >
                  <option value="">No tier</option>
                  {TIER_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <Input
                  placeholder="Tags (comma separated)"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={formPublic}
                  onChange={(e) => setFormPublic(e.target.checked)}
                />
                Make public (visible across all orgs)
              </label>
              <div className="flex gap-2">
                <Button type="submit" disabled={submitting} isLoading={submitting}>
                  Save resource
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowAdd(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Resource grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
        </div>
      ) : safeRows.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium mb-1">No resources found</h3>
            <p className="text-sm text-muted-foreground">
              Adjust filters above, or add the first one.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {safeRows.map((r) => {
            const tags = Array.isArray(r.tags) ? r.tags : [];
            const canRemove = !!myId && r.created_by === myId;
            return (
              <Card key={r.id} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-md bg-primary/10 text-primary">
                        {kindIcon(r.kind)}
                      </div>
                      <Badge variant="outline" className="text-[10px]">
                        {r.kind}
                      </Badge>
                      {r.tier && (
                        <Badge variant="secondary" className="text-[10px]">
                          {r.tier}
                        </Badge>
                      )}
                    </div>
                    {r.sme_endorsed && (
                      <Badge className="bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-100 gap-1">
                        <Award className="w-3 h-3" /> SME
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-base leading-snug mt-2">
                    {r.url ? (
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline inline-flex items-center gap-1"
                      >
                        {r.title}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      r.title
                    )}
                  </CardTitle>
                  {r.skill_code && (
                    <CardDescription className="text-xs">
                      Skill: {r.skill_code}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-3">
                  {r.description_md && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {r.description_md}
                    </p>
                  )}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 text-[10px] bg-muted text-muted-foreground rounded"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-auto pt-3 border-t">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => handleUpvote(r)}
                        title="Upvote"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{r.upvote_count ?? 0}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUnvote(r)}
                        title="Remove your upvote"
                      >
                        unvote
                      </Button>
                    </div>
                    {canRemove && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive gap-1"
                        onClick={() => handleRemove(r)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        remove
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center pt-4">
        Public resources are visible across orgs; private ones only inside yours.
      </p>
    </div>
  );
}
