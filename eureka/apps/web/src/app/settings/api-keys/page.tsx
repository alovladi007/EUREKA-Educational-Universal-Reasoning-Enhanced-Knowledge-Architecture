"use client";

/**
 * Phase 13.1 — API key management.
 * Mint, list, revoke. The presented_token is shown ONCE at create-time.
 */

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api, formatDate } from "@/lib/eureka-api";

type ApiKey = {
  id: string;
  key_id: string;
  name: string;
  description: string | null;
  scopes: string[];
  rate_limit_per_min: number;
  status: string;
  last_used_at: string | null;
  expires_at: string | null;
  created_at: string;
};

type MintedKey = ApiKey & { presented_token: string };

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [name, setName] = useState("");
  const [scopes, setScopes] = useState("read:profile");
  const [rateLimit, setRateLimit] = useState(60);
  const [minted, setMinted] = useState<MintedKey | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function reload() {
    try {
      const rows = await api<ApiKey[]>("/me/api-keys");
      setKeys(rows);
    } catch (e) {
      setError(String((e as Error).message));
    }
  }

  useEffect(() => {
    reload();
  }, []);

  async function mint() {
    setBusy(true);
    setError(null);
    try {
      const body = {
        name: name || "Untitled key",
        scopes: scopes
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        rate_limit_per_min: rateLimit,
      };
      const k = await api<MintedKey>("/me/api-keys", {
        method: "POST",
        body: JSON.stringify(body),
      });
      setMinted(k);
      setName("");
      await reload();
    } catch (e) {
      setError(String((e as Error).message));
    } finally {
      setBusy(false);
    }
  }

  async function revoke(k: ApiKey) {
    if (!confirm(`Revoke "${k.name}"? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await api(`/me/api-keys/${k.id}/revoke`, { method: "POST" });
      await reload();
    } catch (e) {
      setError(String((e as Error).message));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold mb-1">API keys</h1>
        <p className="text-slate-600">
          Use these to call EUREKA programmatically. Secrets are shown once — copy it now.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {minted && (
        <Alert>
          <AlertTitle>New key created — copy the secret now</AlertTitle>
          <AlertDescription className="font-mono text-xs break-all">
            <code className="block mt-2 p-3 bg-slate-900 text-amber-200 rounded-md">
              {minted.presented_token}
            </code>
            <Button
              size="sm"
              variant="outline"
              className="mt-2"
              onClick={() => {
                navigator.clipboard.writeText(minted.presented_token);
              }}
            >
              Copy to clipboard
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="mt-2 ml-2"
              onClick={() => setMinted(null)}
            >
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Mint a new key</CardTitle>
          <CardDescription>
            Scopes are space- or comma-separated, e.g. <code>read:profile, read:attempts</code>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label htmlFor="key-name">Name</Label>
            <Input
              id="key-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My laptop"
            />
          </div>
          <div>
            <Label htmlFor="key-scopes">Scopes</Label>
            <Input
              id="key-scopes"
              value={scopes}
              onChange={(e) => setScopes(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="key-rate">Rate limit (per minute)</Label>
            <Input
              id="key-rate"
              type="number"
              min={0}
              max={10000}
              value={rateLimit}
              onChange={(e) => setRateLimit(parseInt(e.target.value || "0", 10))}
            />
          </div>
          <Button onClick={mint} disabled={busy}>
            Mint key
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your keys</CardTitle>
        </CardHeader>
        <CardContent>
          {keys.length === 0 && (
            <p className="text-slate-500 text-sm">No keys yet.</p>
          )}
          <ul className="divide-y">
            {keys.map((k) => (
              <li key={k.id} className="py-3 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{k.name}</span>
                    <Badge variant={k.status === "active" ? "default" : "outline"}>
                      {k.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    {k.key_id}
                  </div>
                  <div className="text-xs text-slate-500">
                    scopes: {k.scopes.join(", ") || "—"} · {k.rate_limit_per_min}/min
                    · last used {formatDate(k.last_used_at)}
                  </div>
                </div>
                {k.status === "active" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => revoke(k)}
                    disabled={busy}
                  >
                    Revoke
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </>
  );
}
