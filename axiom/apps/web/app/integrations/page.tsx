'use client';

import { useEffect, useState } from 'react';
import {
  AXIOM_API_URL,
  fetchMe,
  getToken,
  oneRosterSync,
  registerLtiPlatform,
  type LtiPlatformInput,
} from '@/lib/api';
import { AppShell } from '@/components/AppShell';
import { ErrorPanel, SignInScreen } from '@/components/PageShell';

// Admin surface for the LTI 1.3 and OneRoster integrations. It shows the tool's
// LTI endpoints to register in an LMS, a platform-registration form, and a
// OneRoster sync box. The heavy lifting is the backend protocol; this page just
// configures and triggers it.

type Gate = 'checking' | 'signed-out' | 'unauthorized' | 'ready' | 'error';

const ADMIN_ROLES = new Set(['org_admin', 'super_admin']);

const LTI_BASE = `${AXIOM_API_URL}/api/v1/integrations/lti`;

const SAMPLE_ROSTER = `{
  "users": [
    {"sourcedId": "u1", "email": "t@school.edu", "givenName": "Grace",
     "familyName": "Hopper", "role": "teacher"}
  ],
  "enrollments": [
    {"userSourcedId": "u1", "classSourcedId": "MATH-101", "role": "teacher"}
  ]
}`;

function UrlRow({ label, url }: { label: string; url: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <code className="break-all rounded bg-muted px-2 py-1 text-xs text-foreground">
        {url}
      </code>
    </div>
  );
}

export default function IntegrationsPage() {
  const [gate, setGate] = useState<Gate>('checking');
  const [gateError, setGateError] = useState('');

  const [platform, setPlatform] = useState<LtiPlatformInput>({
    issuer: '',
    client_id: '',
    auth_login_url: '',
    auth_token_url: '',
    public_key_pem: '',
  });
  const [platformMsg, setPlatformMsg] = useState('');
  const [platformBusy, setPlatformBusy] = useState(false);

  const [rosterText, setRosterText] = useState(SAMPLE_ROSTER);
  const [rosterMsg, setRosterMsg] = useState('');
  const [rosterBusy, setRosterBusy] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      setGate('signed-out');
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const me = await fetchMe();
        if (cancelled) {
          return;
        }
        setGate(me.roles.some((r) => ADMIN_ROLES.has(r)) ? 'ready' : 'unauthorized');
      } catch (err) {
        if (!cancelled) {
          setGateError(err instanceof Error ? err.message : 'Failed to load.');
          setGate('error');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function savePlatform() {
    setPlatformBusy(true);
    setPlatformMsg('');
    try {
      const result = await registerLtiPlatform(platform);
      setPlatformMsg(`Saved platform ${result.issuer}.`);
    } catch (err) {
      setPlatformMsg(err instanceof Error ? err.message : 'Failed to save.');
    } finally {
      setPlatformBusy(false);
    }
  }

  async function syncRoster() {
    setRosterBusy(true);
    setRosterMsg('');
    let parsed: unknown;
    try {
      parsed = JSON.parse(rosterText);
    } catch {
      setRosterMsg('The roster is not valid JSON.');
      setRosterBusy(false);
      return;
    }
    try {
      const result = await oneRosterSync(parsed);
      setRosterMsg(
        `Synced ${result.users_synced} users and ${result.enrollments_synced} enrollments.`,
      );
    } catch (err) {
      setRosterMsg(err instanceof Error ? err.message : 'Failed to sync.');
    } finally {
      setRosterBusy(false);
    }
  }

  if (gate === 'checking') {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading integrations.</p>
      </main>
    );
  }
  if (gate === 'signed-out') {
    return <SignInScreen />;
  }

  const field = (
    key: keyof LtiPlatformInput,
    label: string,
    placeholder: string,
  ) => (
    <div>
      <label className="mb-1 block text-xs font-medium text-card-foreground">{label}</label>
      <input
        type="text"
        value={(platform[key] as string) ?? ''}
        onChange={(e) => setPlatform({ ...platform, [key]: e.target.value })}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
      />
    </div>
  );

  return (
    <AppShell>
      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-xl font-semibold text-foreground">Integrations</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Connect AXIOM to an LMS with LTI 1.3 and to an SIS with OneRoster.
        </p>

        {gate === 'unauthorized' && (
          <div className="mt-8 rounded-lg border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">
              Integrations are configured by administrators.
            </p>
          </div>
        )}
        {gate === 'error' && (
          <div className="mt-8">
            <ErrorPanel message={gateError} />
          </div>
        )}

        {gate === 'ready' && (
          <div className="mt-8 space-y-8">
            <section className="rounded-lg border border-border bg-card p-5">
              <h2 className="text-base font-semibold text-card-foreground">
                LTI 1.3 tool endpoints
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Register these in your LMS when you add AXIOM as an external tool.
              </p>
              <div className="mt-3 space-y-2">
                <UrlRow label="OIDC login initiation URL" url={`${LTI_BASE}/login`} />
                <UrlRow label="Redirect (launch) URL" url={`${LTI_BASE}/launch`} />
                <UrlRow label="Public JWKS URL" url={`${LTI_BASE}/jwks`} />
              </div>
            </section>

            <section className="rounded-lg border border-border bg-card p-5">
              <h2 className="text-base font-semibold text-card-foreground">
                Register a platform (LMS)
              </h2>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {field('issuer', 'Issuer (iss)', 'https://canvas.instructure.com')}
                {field('client_id', 'Client ID', 'the tool client id from the LMS')}
                {field('auth_login_url', 'Platform auth (login) URL', 'https://.../api/lti/authorize_redirect')}
                {field('auth_token_url', 'Platform token URL', 'https://.../login/oauth2/token')}
                {field('jwks_url', 'Platform JWKS URL (optional)', 'https://.../api/lti/security/jwks')}
              </div>
              <div className="mt-3">
                <label className="mb-1 block text-xs font-medium text-card-foreground">
                  Pinned public key PEM (optional; used when there is no JWKS URL)
                </label>
                <textarea
                  value={platform.public_key_pem ?? ''}
                  rows={3}
                  onChange={(e) => setPlatform({ ...platform, public_key_pem: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="-----BEGIN PUBLIC KEY-----"
                />
              </div>
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => void savePlatform()}
                  disabled={platformBusy || !platform.issuer || !platform.client_id}
                  className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-60"
                >
                  {platformBusy ? 'Saving.' : 'Save platform'}
                </button>
                {platformMsg && (
                  <span className="text-sm text-muted-foreground">{platformMsg}</span>
                )}
              </div>
            </section>

            <section className="rounded-lg border border-border bg-card p-5">
              <h2 className="text-base font-semibold text-card-foreground">
                OneRoster sync
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Paste a normalized OneRoster payload of users and enrollments.
                Rosters stay authoritative in the SIS; this upserts them here.
              </p>
              <textarea
                value={rosterText}
                rows={10}
                onChange={(e) => setRosterText(e.target.value)}
                className="mt-3 w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => void syncRoster()}
                  disabled={rosterBusy}
                  className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-60"
                >
                  {rosterBusy ? 'Syncing.' : 'Sync roster'}
                </button>
                {rosterMsg && <span className="text-sm text-muted-foreground">{rosterMsg}</span>}
              </div>
            </section>
          </div>
        )}
      </main>
    </AppShell>
  );
}
