"use client";

/**
 * Enterprise identity — SSO (OIDC) and LTI 1.3 platform configuration.
 * Org admins register their IdP / LMS here; the endpoints are org-scoped.
 */

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api, formatDate, API_URL, API_PREFIX } from "@/lib/eureka-api";

type SsoConfig = {
  id: string;
  name: string;
  protocol: string;
  issuer: string | null;
  discovery_url: string | null;
  client_id: string | null;
  default_role: string;
  just_in_time_provisioning: boolean;
  is_active: boolean;
  created_at: string;
};

type LtiPlatform = {
  id: string;
  issuer: string;
  client_id: string;
  deployment_id: string;
  auth_login_url: string;
  auth_token_url: string;
  jwks_url: string;
  is_active: boolean;
};

const PROTOCOLS = [
  { value: "oidc", label: "OIDC (OpenID Connect)" },
  { value: "saml", label: "SAML 2.0" },
  { value: "google_workspace", label: "Google Workspace" },
];
const ROLES = ["student", "teacher", "org_admin", "parent", "researcher"];

const BASE = `${API_URL}${API_PREFIX}`;

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-28 shrink-0 text-slate-500">{label}</span>
      <code className="min-w-0 flex-1 truncate rounded bg-slate-100 px-2 py-1">{value}</code>
      <button
        type="button"
        className="shrink-0 text-primary-600 hover:underline"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
          } catch {
            /* clipboard blocked */
          }
        }}
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

export default function IntegrationsPage() {
  const [sso, setSso] = useState<SsoConfig[]>([]);
  const [lti, setLti] = useState<LtiPlatform[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [ssoForm, setSsoForm] = useState({
    name: "",
    protocol: "oidc",
    issuer: "",
    discovery_url: "",
    client_id: "",
    client_secret: "",
    default_role: "student",
    just_in_time_provisioning: true,
  });
  const [ltiForm, setLtiForm] = useState({
    issuer: "",
    client_id: "",
    deployment_id: "",
    auth_login_url: "",
    auth_token_url: "",
    jwks_url: "",
    auth_token_aud: "",
  });

  const reload = useCallback(async () => {
    setError(null);
    try {
      const [s, l] = await Promise.all([
        api<SsoConfig[]>("/sso/configs"),
        api<LtiPlatform[]>("/lti/platforms"),
      ]);
      setSso(s);
      setLti(l);
    } catch (e) {
      setError(String((e as Error).message));
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  async function createSso() {
    if (ssoForm.name.trim().length < 2) {
      setError("SSO connection needs a name.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const body: Record<string, unknown> = {
        name: ssoForm.name.trim(),
        protocol: ssoForm.protocol,
        default_role: ssoForm.default_role,
        just_in_time_provisioning: ssoForm.just_in_time_provisioning,
      };
      for (const k of ["issuer", "discovery_url", "client_id", "client_secret"] as const) {
        if (ssoForm[k].trim()) body[k] = ssoForm[k].trim();
      }
      await api("/sso/configs", { method: "POST", body: JSON.stringify(body) });
      setSsoForm({
        name: "",
        protocol: "oidc",
        issuer: "",
        discovery_url: "",
        client_id: "",
        client_secret: "",
        default_role: "student",
        just_in_time_provisioning: true,
      });
      await reload();
    } catch (e) {
      setError(String((e as Error).message));
    } finally {
      setBusy(false);
    }
  }

  async function createLti() {
    const required = ["issuer", "client_id", "deployment_id", "auth_login_url", "auth_token_url", "jwks_url"] as const;
    if (required.some((k) => !ltiForm[k].trim())) {
      setError("All LTI platform fields except audience are required.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const body: Record<string, unknown> = {};
      for (const k of [...required, "auth_token_aud"] as const) {
        if (ltiForm[k].trim()) body[k] = ltiForm[k].trim();
      }
      await api("/lti/platforms", { method: "POST", body: JSON.stringify(body) });
      setLtiForm({
        issuer: "",
        client_id: "",
        deployment_id: "",
        auth_login_url: "",
        auth_token_url: "",
        jwks_url: "",
        auth_token_aud: "",
      });
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
        <h1 className="text-3xl font-bold mb-1">SSO &amp; LTI</h1>
        <p className="text-slate-600">
          Connect your identity provider (single sign-on) and your LMS (LTI 1.3).
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* ─── SSO ─────────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Single sign-on (OIDC)</CardTitle>
          <CardDescription>
            OIDC is live today; SAML / Google Workspace can be registered ahead of enablement.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Connection name</Label>
              <Input
                value={ssoForm.name}
                onChange={(e) => setSsoForm({ ...ssoForm, name: e.target.value })}
                placeholder="Okta — Faculty"
              />
            </div>
            <div>
              <Label>Protocol</Label>
              <select
                value={ssoForm.protocol}
                onChange={(e) => setSsoForm({ ...ssoForm, protocol: e.target.value })}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {PROTOCOLS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Issuer</Label>
              <Input
                value={ssoForm.issuer}
                onChange={(e) => setSsoForm({ ...ssoForm, issuer: e.target.value })}
                placeholder="https://idp.example.com"
              />
            </div>
            <div>
              <Label>Discovery URL</Label>
              <Input
                value={ssoForm.discovery_url}
                onChange={(e) => setSsoForm({ ...ssoForm, discovery_url: e.target.value })}
                placeholder="https://idp.example.com/.well-known/openid-configuration"
              />
            </div>
            <div>
              <Label>Client ID</Label>
              <Input
                value={ssoForm.client_id}
                onChange={(e) => setSsoForm({ ...ssoForm, client_id: e.target.value })}
              />
            </div>
            <div>
              <Label>Client secret</Label>
              <Input
                type="password"
                value={ssoForm.client_secret}
                onChange={(e) => setSsoForm({ ...ssoForm, client_secret: e.target.value })}
                placeholder="Stored encrypted"
              />
            </div>
            <div>
              <Label>Default role for new users</Label>
              <select
                value={ssoForm.default_role}
                onChange={(e) => setSsoForm({ ...ssoForm, default_role: e.target.value })}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2 pt-6 text-sm">
              <input
                type="checkbox"
                checked={ssoForm.just_in_time_provisioning}
                onChange={(e) =>
                  setSsoForm({ ...ssoForm, just_in_time_provisioning: e.target.checked })
                }
                className="h-4 w-4"
              />
              Just-in-time provisioning (create users on first login)
            </label>
          </div>
          <Button onClick={createSso} disabled={busy}>
            Add SSO connection
          </Button>

          <div className="divide-y border-t pt-2">
            {sso.length === 0 && (
              <p className="py-3 text-sm text-slate-500">No SSO connections yet.</p>
            )}
            {sso.map((c) => (
              <div key={c.id} className="py-3 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{c.name}</span>
                  <Badge variant="outline">{c.protocol}</Badge>
                  <Badge variant={c.is_active ? "secondary" : "destructive"}>
                    {c.is_active ? "active" : "disabled"}
                  </Badge>
                  <span className="text-xs text-slate-500">
                    default role {c.default_role} · added {formatDate(c.created_at)}
                  </span>
                </div>
                <CopyRow label="Login URL" value={`${BASE}/sso/${c.id}/authorize`} />
                <CopyRow label="Callback URL" value={`${BASE}/sso/${c.id}/callback`} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ─── LTI 1.3 ──────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">LTI 1.3 platforms</CardTitle>
          <CardDescription>
            Register an LMS (Canvas, Moodle, Blackboard…) so it can launch EUREKA tools.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CopyRow label="Tool JWKS URL" value={`${BASE}/lti/.well-known/jwks.json`} />
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                ["issuer", "Issuer", "https://canvas.instructure.com"],
                ["client_id", "Client ID", ""],
                ["deployment_id", "Deployment ID", ""],
                ["auth_login_url", "Auth login URL", ""],
                ["auth_token_url", "Auth token URL", ""],
                ["jwks_url", "Platform JWKS URL", ""],
                ["auth_token_aud", "Token audience (optional)", ""],
              ] as [keyof typeof ltiForm, string, string][]
            ).map(([key, label, ph]) => (
              <div key={key}>
                <Label>{label}</Label>
                <Input
                  value={ltiForm[key]}
                  onChange={(e) => setLtiForm({ ...ltiForm, [key]: e.target.value })}
                  placeholder={ph}
                />
              </div>
            ))}
          </div>
          <Button onClick={createLti} disabled={busy}>
            Register platform
          </Button>

          <div className="divide-y border-t pt-2">
            {lti.length === 0 && (
              <p className="py-3 text-sm text-slate-500">No LTI platforms yet.</p>
            )}
            {lti.map((p) => (
              <div key={p.id} className="py-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">{p.issuer}</span>
                  <Badge variant={p.is_active ? "secondary" : "destructive"}>
                    {p.is_active ? "active" : "disabled"}
                  </Badge>
                </div>
                <div className="text-xs text-slate-500">
                  client {p.client_id} · deployment {p.deployment_id}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
