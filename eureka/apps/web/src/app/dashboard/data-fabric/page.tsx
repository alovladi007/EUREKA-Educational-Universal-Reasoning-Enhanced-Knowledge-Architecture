"use client";

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

type ApiKey = { id?: string; name?: string };
type WebhookEndpoint = { id?: string; url?: string; topics?: string[]; is_active?: boolean };
type OauthApp = { id?: string; name?: string };
type WebhookDelivery = {
  id?: string;
  event?: string | null;
  status?: string | null;
  last_status_code?: number | null;
  attempt_n?: number | null;
  queued_at?: string | null;
  delivered_at?: string | null;
};

export default function DataFabricPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([]);
  const [oauthApps, setOauthApps] = useState<OauthApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDeliveries, setOpenDeliveries] = useState<string | null>(null);
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([]);
  const [deliveriesLoading, setDeliveriesLoading] = useState(false);

  async function toggleDeliveries(webhookId: string) {
    if (openDeliveries === webhookId) {
      setOpenDeliveries(null);
      return;
    }
    setOpenDeliveries(webhookId);
    setDeliveriesLoading(true);
    try {
      const rows = await api<WebhookDelivery[]>(`/me/webhooks/${webhookId}/deliveries`);
      setDeliveries(Array.isArray(rows) ? rows : []);
    } catch {
      setDeliveries([]);
    } finally {
      setDeliveriesLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [keys, hooks, apps] = await Promise.all([
        api<ApiKey[]>("/me/api-keys").catch(() => [] as ApiKey[]),
        api<WebhookEndpoint[]>("/me/webhooks").catch(
          () => [] as WebhookEndpoint[],
        ),
        api<OauthApp[]>("/me/oauth-apps").catch(() => [] as OauthApp[]),
      ]);
      if (cancelled) return;
      setApiKeys(Array.isArray(keys) ? keys : []);
      setWebhooks(Array.isArray(hooks) ? hooks : []);
      setOauthApps(Array.isArray(apps) ? apps : []);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          Data Fabric — Platform integrations
        </h1>
        <p className="text-muted-foreground">
          Every integration row IS a data pipe. API keys move data out via
          REST, webhooks push events to your systems, and OAuth apps let
          third-party tools read learner data on behalf of users.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Wired to <code>/api/v1/me/api-keys</code>,{" "}
          <code>/api/v1/me/webhooks</code>, and{" "}
          <code>/api/v1/me/oauth-apps</code> (Phase 13 platform integrations).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardDescription>API keys</CardDescription>
            <CardTitle>{loading ? "…" : apiKeys.length}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Personal-access keys minted for your account.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Webhooks</CardDescription>
            <CardTitle>{loading ? "…" : webhooks.length}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            HTTPS endpoints that receive signed event deliveries.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>OAuth apps</CardDescription>
            <CardTitle>{loading ? "…" : oauthApps.length}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Third-party apps registered against your tenant.
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Manage API keys</CardTitle>
            <CardDescription>
              Mint, rotate, and revoke personal-access tokens.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/settings/api-keys"
              className="text-sm underline text-primary"
            >
              Open settings / API keys →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manage webhooks</CardTitle>
            <CardDescription>
              Subscribe to event topics and inspect delivery history.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/settings/webhooks"
              className="text-sm underline text-primary"
            >
              Open settings / webhooks →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Audit log</CardTitle>
            <CardDescription>
              Every integration call is logged to the org audit stream.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/admin/audit"
              className="text-sm underline text-primary"
            >
              Open admin / audit →
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Webhook health</CardTitle>
          <CardDescription>
            Your webhook endpoints with their recent delivery history, from{" "}
            <code>/me/webhooks/{"{id}"}/deliveries</code>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : webhooks.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No webhook endpoints registered. Create one under settings /
              webhooks to receive signed event deliveries.
            </p>
          ) : (
            <ul className="space-y-2 text-sm">
              {webhooks.map((w, i) => (
                <li key={w.id ?? i} className="border rounded-md p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs truncate max-w-[320px]">{w.url ?? "(no url)"}</span>
                    {w.is_active === false && <Badge variant="outline">inactive</Badge>}
                    {w.id && (
                      <button
                        onClick={() => toggleDeliveries(w.id!)}
                        className="ml-auto text-xs underline text-primary"
                      >
                        {openDeliveries === w.id ? "Hide deliveries" : "View deliveries"}
                      </button>
                    )}
                  </div>
                  {openDeliveries === w.id && (
                    <div className="mt-2 border-t pt-2">
                      {deliveriesLoading ? (
                        <p className="text-xs text-muted-foreground">Loading deliveries…</p>
                      ) : deliveries.length === 0 ? (
                        <p className="text-xs text-muted-foreground">
                          No deliveries yet for this endpoint.
                        </p>
                      ) : (
                        <ul className="space-y-1 text-xs font-mono">
                          {deliveries.slice(0, 10).map((d, j) => (
                            <li key={d.id ?? j} className="flex flex-wrap items-center gap-2">
                              <Badge
                                variant={d.status === "delivered" ? "default" : "outline"}
                                className="text-[10px]"
                              >
                                {d.status ?? "?"}
                              </Badge>
                              <span>{d.event ?? "event"}</span>
                              {typeof d.last_status_code === "number" && (
                                <span className="text-muted-foreground">HTTP {d.last_status_code}</span>
                              )}
                              {typeof d.attempt_n === "number" && d.attempt_n > 1 && (
                                <span className="text-muted-foreground">attempt {d.attempt_n}</span>
                              )}
                              <span className="text-muted-foreground ml-auto">
                                {d.queued_at ? new Date(d.queued_at).toLocaleString() : ""}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current state</CardTitle>
          <CardDescription>
            Live summary of what your account is currently wired to.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{apiKeys.length} key(s)</Badge>
            <Badge variant="outline">{webhooks.length} webhook(s)</Badge>
            <Badge variant="outline">{oauthApps.length} OAuth app(s)</Badge>
            {!loading &&
              apiKeys.length === 0 &&
              webhooks.length === 0 &&
              oauthApps.length === 0 && (
                <span className="text-xs text-muted-foreground">
                  No integrations yet — start by minting an API key.
                </span>
              )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
