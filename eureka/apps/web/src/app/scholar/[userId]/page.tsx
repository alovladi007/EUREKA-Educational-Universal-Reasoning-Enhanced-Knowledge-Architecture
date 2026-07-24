"use client";

/**
 * Public scholarly profile (R-4). No auth — exists only while the scholar
 * has at least one public research workspace (opt-in, revocable).
 * Metrics honesty: on-platform activity only; no external citation counts.
 */

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { EurekaNav } from "@/components/eureka-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX || "/api/v1";

type PublicWs = {
  id: string; title: string; kind: string; status: string;
  tags: string[]; reference_count: number; draft_count: number;
};
type Profile = {
  user_id: string; name: string; member_since: number | null;
  public_workspaces: PublicWs[]; total_references: number; metrics_note: string;
};

export default function ScholarProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "notfound">("loading");

  useEffect(() => {
    if (!userId) return;
    fetch(`${API_BASE}${API_PREFIX}/public/scholar/${userId}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((p) => { setProfile(p); setState("ok"); })
      .catch(() => setState("notfound"));
  }, [userId]);

  return (
    <>
      <EurekaNav />
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {state === "loading" && <p className="text-muted-foreground">Loading…</p>}
        {state === "notfound" && (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              No public scholar profile here. Profiles appear when a researcher
              makes at least one workspace public — and disappear when they
              make them private again.
            </CardContent>
          </Card>
        )}
        {state === "ok" && profile && (
          <>
            <div>
              <h1 className="flex items-center gap-2 text-3xl font-bold">
                <GraduationCap className="h-7 w-7 text-primary" /> {profile.name}
              </h1>
              <p className="text-muted-foreground mt-1">
                {profile.member_since ? `Researcher on EUREKA since ${profile.member_since} · ` : ""}
                {profile.public_workspaces.length} public workspace
                {profile.public_workspaces.length === 1 ? "" : "s"} ·{" "}
                {profile.total_references} reference{profile.total_references === 1 ? "" : "s"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{profile.metrics_note}</p>
            </div>
            <div className="space-y-3">
              {profile.public_workspaces.map((w) => (
                <Card key={w.id}>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2 flex-wrap">
                      {w.title}
                      <Badge variant="outline" className="text-[10px]">{w.kind}</Badge>
                      <Badge variant="secondary" className="text-[10px]">{w.status}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground flex items-center gap-3 flex-wrap">
                    <span>{w.reference_count} reference{w.reference_count === 1 ? "" : "s"}</span>
                    <span>{w.draft_count} draft{w.draft_count === 1 ? "" : "s"}</span>
                    {w.tags.map((t) => (
                      <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
    </>
  );
}
