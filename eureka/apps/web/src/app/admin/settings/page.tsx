"use client";

/**
 * Organization settings — profile, contact, address, and compliance posture.
 * Loads the caller's org (via /users/me → /organizations/{id}) and PATCHes it.
 */

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api } from "@/lib/eureka-api";

type Org = {
  id: string;
  name: string;
  slug: string;
  tier: string;
  email: string | null;
  phone: string | null;
  website: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string;
  ferpa_compliant: boolean;
  coppa_compliant: boolean;
  hipaa_compliant: boolean;
  is_active: boolean;
  is_verified: boolean;
};

// Editable text fields: [key, label, placeholder]
const TEXT_FIELDS: [keyof Org, string, string][] = [
  ["name", "Organization name", "Acme University"],
  ["email", "Contact email", "admin@acme.edu"],
  ["phone", "Phone", "+1 555 123 4567"],
  ["website", "Website", "https://acme.edu"],
  ["address_line1", "Address line 1", ""],
  ["address_line2", "Address line 2", ""],
  ["city", "City", ""],
  ["state", "State / Province", ""],
  ["postal_code", "Postal code", ""],
  ["country", "Country (2-letter)", "US"],
];

const COMPLIANCE: [keyof Org, string, string][] = [
  ["ferpa_compliant", "FERPA", "US student education records"],
  ["coppa_compliant", "COPPA", "Children under 13"],
  ["hipaa_compliant", "HIPAA", "Protected health information"],
];

export default function OrgSettingsPage() {
  const [org, setOrg] = useState<Org | null>(null);
  const [form, setForm] = useState<Partial<Org>>({});
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const me = await api<{ org_id: string }>("/users/me");
        const o = await api<Org>(`/organizations/${me.org_id}`);
        setOrg(o);
        setForm(o);
      } catch (e) {
        setError(String((e as Error).message));
      }
    })();
  }, []);

  function set<K extends keyof Org>(key: K, value: Org[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function save() {
    if (!org) return;
    if (!String(form.name || "").trim()) {
      setError("Organization name is required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const patch: Record<string, unknown> = {};
      for (const [key] of TEXT_FIELDS) {
        const raw = form[key];
        const v = typeof raw === "string" ? raw.trim() : raw;
        // Empty text → null (clears the field); avoids sending "" for URL/email.
        patch[key] = v === "" ? null : v;
      }
      for (const [key] of COMPLIANCE) patch[key] = Boolean(form[key]);
      const updated = await api<Org>(`/organizations/${org.id}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
      setOrg(updated);
      setForm(updated);
      setSaved(true);
    } catch (e) {
      setError(String((e as Error).message));
    } finally {
      setSaving(false);
    }
  }

  if (!org && !error) {
    return <p className="text-slate-500 text-sm">Loading organization…</p>;
  }

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold mb-1">Organization settings</h1>
        <p className="text-slate-600">
          Your organization profile, contact details, and compliance posture.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {saved && (
        <Alert>
          <AlertTitle>Saved</AlertTitle>
          <AlertDescription>Organization settings updated.</AlertDescription>
        </Alert>
      )}

      {org && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Identity</CardTitle>
              <CardDescription>
                Slug and tier are managed by platform administrators.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-3 text-sm">
              <span>
                Slug <code className="text-slate-600">{org.slug}</code>
              </span>
              <Badge variant="outline">tier: {org.tier}</Badge>
              <Badge variant={org.is_verified ? "secondary" : "outline"}>
                {org.is_verified ? "verified" : "unverified"}
              </Badge>
              <Badge variant={org.is_active ? "secondary" : "destructive"}>
                {org.is_active ? "active" : "inactive"}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile & contact</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {TEXT_FIELDS.map(([key, label, ph]) => (
                <div key={key}>
                  <Label>{label}</Label>
                  <Input
                    value={(form[key] as string) ?? ""}
                    onChange={(e) => set(key, e.target.value as Org[typeof key])}
                    placeholder={ph}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Compliance</CardTitle>
              <CardDescription>
                Declare the frameworks this organization operates under.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {COMPLIANCE.map(([key, label, desc]) => (
                <label key={key} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={Boolean(form[key])}
                    onChange={(e) => set(key, e.target.checked as Org[typeof key])}
                    className="h-4 w-4"
                  />
                  <span>
                    <span className="font-medium">{label}</span>
                    <span className="ml-2 text-xs text-slate-500">{desc}</span>
                  </span>
                </label>
              ))}
            </CardContent>
          </Card>

          <div className="flex items-center gap-3">
            <Button onClick={save} disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </>
      )}
    </>
  );
}
