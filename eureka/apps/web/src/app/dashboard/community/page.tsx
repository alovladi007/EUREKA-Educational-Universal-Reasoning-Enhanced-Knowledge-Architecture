"use client";

/**
 * Community page — wired to the Phase 17 activity feed.
 * No localStorage forum, no seeded discussions. Just the real
 * org-wide public activity stream and the current user's recent activity.
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

type ActivityEvent = {
  id: string;
  user_id: string;
  org_id: string;
  kind: string;
  summary: string;
  created_at: string;
  payload: Record<string, unknown>;
  is_public: boolean;
};

function formatWhen(iso: string): string {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function CommunityPage() {
  const [orgFeed, setOrgFeed] = useState<ActivityEvent[]>([]);
  const [myFeed, setMyFeed] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const [org, mine] = await Promise.all([
        api<ActivityEvent[]>("/community/feed?limit=50").catch(
          () => [] as ActivityEvent[],
        ),
        api<ActivityEvent[]>("/me/activity?limit=10").catch(
          () => [] as ActivityEvent[],
        ),
      ]);
      if (cancelled) return;
      setOrgFeed(org);
      setMyFeed(mine);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Community</h1>
        <p className="text-slate-600 mt-1">
          The live activity feed for your organisation. No mock posts — every
          row here came from a real action recorded against the API.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Org feed (public activity)</CardTitle>
            <CardDescription>
              Recent public events from members of your organisation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-slate-500 text-sm">Loading…</p>
            ) : orgFeed.length === 0 ? (
              <p className="text-slate-500 text-sm">
                Nothing in the feed yet. Be the first by completing a question,
                mastering a skill, or creating a collection.
              </p>
            ) : (
              <ul className="space-y-3">
                {orgFeed.map((e) => (
                  <li
                    key={e.id}
                    className="flex items-start gap-3 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0"
                  >
                    <Badge variant="secondary" className="shrink-0">
                      {e.kind}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-800">{e.summary}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {formatWhen(e.created_at)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My recent activity</CardTitle>
            <CardDescription>Your last 10 events.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-slate-500 text-sm">Loading…</p>
            ) : myFeed.length === 0 ? (
              <p className="text-slate-500 text-sm">
                Nothing in the feed yet. Be the first by completing a question,
                mastering a skill, or creating a collection.
              </p>
            ) : (
              <ul className="space-y-3">
                {myFeed.map((e) => (
                  <li
                    key={e.id}
                    className="flex items-start gap-3 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0"
                  >
                    <Badge variant="outline" className="shrink-0">
                      {e.kind}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-800">{e.summary}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {formatWhen(e.created_at)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <p className="text-xs text-slate-400 mt-6">
        To post a public activity, record an event via{" "}
        <code className="bg-slate-100 px-1 py-0.5 rounded">
          POST /me/activity
        </code>{" "}
        with <code className="bg-slate-100 px-1 py-0.5 rounded">is_public: true</code>.
      </p>
    </div>
  );
}
