"use client";

/**
 * Phase 19 — XR Labs (real-data version).
 *
 * Previously the page called a defunct xr-labs microservice and fell back
 * to hardcoded "Solar System Explorer / Human Anatomy VR / Chemistry Lab"
 * cards. Those mocks are GONE.
 *
 * Real data:
 *   /resources?q=xr            VR/AR resources from the catalog (Phase 18)
 *   /me/collections?kind=study_set  user's XR study sets (Phase 17)
 * Plus rich pre-existing subroutes at /dashboard/xr-labs/{scene-builder,experience}
 * remain available — they run against the separate services/xr-labs/
 * Node microservice when it's up; the cards below link to them as-is.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api, formatDate } from "@/lib/eureka-api";
import {
  Glasses,
  Box,
  Layers,
  Plus,
  ExternalLink,
  Wrench,
  Orbit,
  Atom,
  Activity,
  Sparkles,
} from "lucide-react";
import toast from 'react-hot-toast';

type Resource = {
  id: string;
  title: string;
  kind: string;
  url: string | null;
  description_md: string | null;
  tier: string | null;
  tags: string[];
  upvote_count: number;
  sme_endorsed: boolean;
  created_at: string;
};

type Collection = {
  id: string;
  kind: string;
  title: string;
  description_md: string | null;
  tags: string[];
  item_count: number;
  updated_at: string;
};

type XRExperience = {
  id: string;
  title: string;
  description: string;
  experience_type: string;
  difficulty_level: string;
  duration_minutes: number;
  tags: string[];
  total_sessions: number;
  avg_rating: number | null;
};

export default function XRLabsPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [experiences, setExperiences] = useState<XRExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [busy, setBusy] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const [res, cols, exps] = await Promise.all([
        api<Resource[]>("/resources?tag=xr").catch(() => [] as Resource[]),
        api<Collection[]>("/me/collections?kind=study_set").catch(() => [] as Collection[]),
        api<{ experiences: XRExperience[] }>("/xr/experiences").catch(() => ({ experiences: [] })),
      ]);
      setResources(Array.isArray(res) ? res : []);
      setCollections(Array.isArray(cols) ? cols : []);
      setExperiences(Array.isArray(exps?.experiences) ? exps.experiences : []);
      setError(null);
    } catch (e) {
      setError(String((e as Error).message));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  async function createStudySet(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setBusy(true);
    try {
      await api("/me/collections", {
        method: "POST",
        body: JSON.stringify({ kind: "study_set", title: newTitle.trim(), tags: ["xr"] }),
      });
      setNewTitle("");
      await refresh();
    } catch (e) {
      toast.error(String((e as Error).message));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-bold">
          <Glasses className="h-7 w-7 text-primary" />
          XR Labs
        </h1>
        <p className="text-muted-foreground mt-1">
          Virtual reality + augmented reality study sets and resources. Real EUREKA
          data, no hardcoded simulations. Real-time XR experiences run via the
          separate <span className="font-mono text-xs">services/xr-labs/</span> Node
          microservice (the subroutes below).
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* ───────────── Built-in portals ─────────────
          Self-contained Three.js / R3F experiences we ship in-shell — no
          external scene service or external assets. The first one is the
          Solar System Explorer (Phase 19+ extension); Organic Chemistry
          and Anatomy 3D are next on the roadmap (cards below link to
          coming-soon placeholders for now).
      */}
      <div>
        <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Built-in portals
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/dashboard/xr-labs/solar-system">
            <Card className="h-full hover:border-primary/40 transition-colors cursor-pointer bg-gradient-to-br from-indigo-950/50 via-purple-950/30 to-transparent border-primary/20">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Orbit className="h-5 w-5 text-amber-400" />
                  Solar System Explorer
                </CardTitle>
                <CardDescription>
                  Real-time orbital mechanics for all 8 planets + Moon,
                  with click-for-facts on every body. Inspired by NASA Eyes
                  but built from scratch — no external assets.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-[10px]">
                    Astronomy
                  </Badge>
                  <Badge variant="secondary" className="text-[10px]">
                    Three.js
                  </Badge>
                  <Badge variant="secondary" className="text-[10px]">
                    Interactive
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Card className="h-full opacity-70">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Atom className="h-5 w-5 text-emerald-500" />
                Organic Chemistry 3D
              </CardTitle>
              <CardDescription>
                Interactive 3D molecules — rotate, measure bond angles, see
                hybridization. Coming up next in this build pass.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="text-[10px]">
                Coming next
              </Badge>
            </CardContent>
          </Card>
          <Card className="h-full opacity-70">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-5 w-5 text-rose-500" />
                Anatomy 3D
              </CardTitle>
              <CardDescription>
                Layer-by-layer human anatomy walkthrough (skeletal →
                muscular → nervous → vascular). Wired to the medical tier.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="text-[10px]">
                Planned
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ───────────── XR Experiences (real, from api-core /xr) ─────────────
          Live experiences served by api-core (/api/v1/xr/experiences). Each
          card opens the WebXR viewer (/dashboard/xr-labs/experience/<id>),
          which tracks a session and loads the scene's glTF model.
      */}
      <div>
        <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
          <Box className="h-4 w-4 text-primary" />
          Experiences ({experiences.length})
        </h2>
        {loading && <p className="text-muted-foreground text-sm">Loading…</p>}
        {!loading && experiences.length === 0 && (
          <p className="text-muted-foreground text-sm">
            No XR experiences published yet.
          </p>
        )}
        {experiences.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {experiences.map((x) => (
              <Link key={x.id} href={`/dashboard/xr-labs/experience/${x.id}`}>
                <Card className="h-full hover:border-primary/40 transition-colors cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Glasses className="h-4 w-4 text-primary" />
                      {x.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {x.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center gap-1 text-[10px]">
                      <Badge variant="secondary">{x.experience_type}</Badge>
                      <Badge variant="outline">{x.difficulty_level}</Badge>
                      <Badge variant="outline">{x.duration_minutes} min</Badge>
                      {typeof x.avg_rating === "number" && (
                        <span className="text-muted-foreground ml-1">
                          {x.avg_rating.toFixed(1)} ★
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ───────────── Authoring tools ───────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/dashboard/xr-labs/scene-builder">
          <Card className="h-full hover:border-primary/40 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Wrench className="h-5 w-5 text-primary" />
                Scene builder
              </CardTitle>
              <CardDescription>
                Drag-and-drop 3D environment editor (runs in-browser, no
                Quest/Vive required). Auto-saves scene graphs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground inline-flex items-center gap-1">
                Open <ExternalLink className="h-3 w-3" />
              </div>
            </CardContent>
          </Card>
        </Link>
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Box className="h-5 w-5 text-primary" />
              Experience runner
            </CardTitle>
            <CardDescription>
              Open an experience by ID at{" "}
              <span className="font-mono text-[11px]">
                /dashboard/xr-labs/experience/&lt;id&gt;
              </span>
              . WebXR works in any modern browser; Quest/Vive/Index for the
              full immersive mode.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Pick one from <span className="font-medium text-foreground">Experiences</span>{" "}
              above, or open any experience by ID directly.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            My XR study sets ({collections.length})
          </CardTitle>
          <CardDescription>
            Collections of items/notes for XR-based learning. Wired to{" "}
            <span className="font-mono text-[11px]">/me/collections?kind=study_set</span>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={createStudySet} className="flex gap-2 mb-3">
            <Input
              placeholder="New study set title (e.g. 'Cardiac anatomy walkthrough')"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <Button type="submit" disabled={busy || !newTitle.trim()}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Create
            </Button>
          </form>
          {loading && <p className="text-muted-foreground text-sm">Loading…</p>}
          {!loading && collections.length === 0 && (
            <p className="text-muted-foreground text-sm">
              No XR study sets yet. Create one above to get started.
            </p>
          )}
          {collections.length > 0 && (
            <ul className="divide-y">
              {collections.map((c) => (
                <li key={c.id} className="py-2 flex justify-between items-center text-sm">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{c.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {c.item_count} item{c.item_count === 1 ? "" : "s"} ·
                      updated {formatDate(c.updated_at)}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 shrink-0">
                    {(c.tags ?? []).slice(0, 3).map((t) => (
                      <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">XR resources ({resources.length})</CardTitle>
          <CardDescription>
            Curated resources tagged with "xr" / "vr" / "ar". Wired to{" "}
            <span className="font-mono text-[11px]">/resources?tag=xr</span>. Add new
            entries from{" "}
            <Link href="/dashboard/resources" className="text-primary hover:underline">
              /dashboard/resources
            </Link>
            .
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!loading && resources.length === 0 && (
            <p className="text-muted-foreground text-sm">
              No XR resources in the catalog yet. Go to{" "}
              <Link href="/dashboard/resources" className="text-primary hover:underline">
                Resources
              </Link>{" "}
              and add one with the <code className="font-mono text-[11px]">xr</code> tag.
            </p>
          )}
          {resources.length > 0 && (
            <ul className="divide-y">
              {resources.map((r) => (
                <li key={r.id} className="py-2 flex justify-between gap-3 items-start">
                  <div className="min-w-0">
                    <div className="font-medium">
                      {r.url ? (
                        <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {r.title}
                        </a>
                      ) : r.title}
                    </div>
                    {r.description_md && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {r.description_md}
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground shrink-0 flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">{r.kind}</Badge>
                    <span>{r.upvote_count} ★</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
