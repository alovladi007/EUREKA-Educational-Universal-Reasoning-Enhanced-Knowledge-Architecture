"use client";

/**
 * Phase 13.2 — Webhook subscriptions.
 * signing_secret is shown once at create-time, same as API keys.
 */

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api, formatDate } from "@/lib/eureka-api";

type Webhook = {
  id: string;
  name: string;
  url: string;
  subscribed_events: string[];
  is_active: boolean;
  last_success_at: string | null;
  last_failure_at: string | null;
  consecutive_failures: number;
  created_at: string;
};

type CreatedWebhook = Webhook & { signing_secret: string };

export default function WebhooksPage() {
  const [rows, setRows] = useState<Webhook[]>([]);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [events, setEvents] = useState("*");
  const [created, setCreated] = useState<CreatedWebhook | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function reload() {
    try {
      setRows(await api<Webhook[]>("/me/webhooks"));
    } catch (e) {
      setError(String((e as Error).message));
    }
  }
  useEffect(() => {
    reload();
  }, []);

  async function create() {
    setBusy(true);
    setError(null);
    try {
      const body = {
        name: name || "Untitled webhook",
        url,
        subscribed_events: events
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      const w = await api<CreatedWebhook>("/me/webhooks", {
        method: "POST",
        body: JSON.stringify(body),
      });
      setCreated(w);
      setName("");
      setUrl("");
      await reload();
    } catch (e) {
      setError(String((e as Error).message));
    } finally {
      setBusy(false);
    }
  }

  async function toggle(w: Webhook) {
    try {
      await api(`/me/webhooks/${w.id}?is_active=${!w.is_active}`, {
        method: "PATCH",
      });
      await reload();
    } catch (e) {
      setError(String((e as Error).message));
    }
  }

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold mb-1">Webhooks</h1>
        <p className="text-slate-600">
          HMAC-SHA256 signed POSTs to your URL. Use <code>*</code> to subscribe to every event.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {created && (
        <Alert>
          <AlertTitle>Webhook created — copy the signing secret now</AlertTitle>
          <AlertDescription>
            <code className="block mt-2 p-3 bg-slate-900 text-amber-200 rounded-md font-mono text-xs break-all">
              {created.signing_secret}
            </code>
            <Button
              size="sm"
              variant="outline"
              className="mt-2"
              onClick={() => navigator.clipboard.writeText(created.signing_secret)}
            >
              Copy
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="mt-2 ml-2"
              onClick={() => setCreated(null)}
            >
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Create a webhook</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>URL</Label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your.app/eureka-events"
            />
          </div>
          <div>
            <Label>Events (comma-separated, or *)</Label>
            <Input value={events} onChange={(e) => setEvents(e.target.value)} />
          </div>
          <Button onClick={create} disabled={busy || !url}>
            Create
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Active webhooks</CardTitle>
          <CardDescription>
            {rows.filter((r) => r.is_active).length} active of {rows.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rows.length === 0 && (
            <p className="text-slate-500 text-sm">No webhooks yet.</p>
          )}
          <ul className="divide-y">
            {rows.map((w) => (
              <li key={w.id} className="py-3 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{w.name}</span>
                    <Badge variant={w.is_active ? "default" : "outline"}>
                      {w.is_active ? "active" : "paused"}
                    </Badge>
                    {w.consecutive_failures > 0 && (
                      <Badge variant="destructive">
                        {w.consecutive_failures} fails
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 font-mono">{w.url}</div>
                  <div className="text-xs text-slate-500">
                    events: {w.subscribed_events.join(", ")} · last success{" "}
                    {formatDate(w.last_success_at)}
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => toggle(w)}>
                  {w.is_active ? "Pause" : "Resume"}
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </>
  );
}
