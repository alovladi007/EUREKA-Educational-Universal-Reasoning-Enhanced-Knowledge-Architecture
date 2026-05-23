"use client";

/**
 * Phase 22.4 — Cookie consent banner (GDPR-compliant pattern).
 *
 * Three buckets: necessary (always on), preferences, analytics.
 * Choice persists in localStorage under `eureka_cookie_consent_v1`.
 * Other code reads consent via `getConsent()` before firing analytics
 * or non-essential third-party scripts.
 *
 * GDPR/CCPA design notes:
 * - "Necessary" cookies (auth session, CSRF) don't require consent
 *   under GDPR Art. 6(1)(f).
 * - "Preferences" + "Analytics" need explicit opt-in (GDPR).
 * - "Reject all" must be as prominent as "Accept all" (CNIL guidance).
 * - User must be able to change their mind (footer link → re-opens
 *   this banner). Wired via window event `eureka:open-cookie-prefs`.
 */

import { useEffect, useState } from "react";
import Link from "next/link";

type ConsentState = {
  version: 1;
  necessary: true;
  preferences: boolean;
  analytics: boolean;
  decided_at: string; // ISO timestamp
};

const KEY = "eureka_cookie_consent_v1";

export function getConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ConsentState;
  } catch {
    return null;
  }
}

function saveConsent(c: Omit<ConsentState, "version" | "necessary" | "decided_at">) {
  if (typeof window === "undefined") return;
  const full: ConsentState = {
    version: 1,
    necessary: true,
    preferences: c.preferences,
    analytics: c.analytics,
    decided_at: new Date().toISOString(),
  };
  window.localStorage.setItem(KEY, JSON.stringify(full));
  window.dispatchEvent(new CustomEvent("eureka:consent-changed", { detail: full }));
}

export function CookieConsentBanner() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"banner" | "details">("banner");
  const [pref, setPref] = useState(false);
  const [anly, setAnly] = useState(false);

  useEffect(() => {
    const existing = getConsent();
    if (!existing) {
      setOpen(true);
    } else {
      setPref(existing.preferences);
      setAnly(existing.analytics);
    }
    const handler = () => {
      const cur = getConsent();
      if (cur) {
        setPref(cur.preferences);
        setAnly(cur.analytics);
      }
      setMode("details");
      setOpen(true);
    };
    window.addEventListener("eureka:open-cookie-prefs", handler);
    return () => window.removeEventListener("eureka:open-cookie-prefs", handler);
  }, []);

  if (!open) return null;

  const acceptAll = () => {
    saveConsent({ preferences: true, analytics: true });
    setOpen(false);
  };
  const rejectAll = () => {
    saveConsent({ preferences: false, analytics: false });
    setOpen(false);
  };
  const saveSelection = () => {
    saveConsent({ preferences: pref, analytics: anly });
    setOpen(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background shadow-lg">
      <div className="mx-auto max-w-5xl p-4 sm:p-6">
        {mode === "banner" ? (
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h3 className="font-semibold text-sm">Cookies & privacy</h3>
              <p className="text-xs text-muted-foreground mt-1">
                We use strictly-necessary cookies to keep you signed in and
                protect your account. With your permission we&apos;d also like to
                use preferences + analytics cookies to improve the product.
                See our{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  privacy policy
                </Link>
                .
              </p>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <button
                onClick={rejectAll}
                className="px-3 py-1.5 rounded-md border text-sm font-medium hover:bg-muted"
              >
                Reject all
              </button>
              <button
                onClick={() => setMode("details")}
                className="px-3 py-1.5 rounded-md border text-sm font-medium hover:bg-muted"
              >
                Customize
              </button>
              <button
                onClick={acceptAll}
                className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
              >
                Accept all
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold text-base">Cookie preferences</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <label className="flex items-start gap-3 p-2 rounded-md bg-muted/50">
                <input type="checkbox" checked disabled className="mt-1" />
                <div>
                  <div className="font-medium">Necessary <span className="text-xs text-muted-foreground">(always on)</span></div>
                  <p className="text-xs text-muted-foreground">
                    Authentication, session, CSRF protection. Without these the
                    platform doesn&apos;t work. No legal opt-out required.
                  </p>
                </div>
              </label>
              <label className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/30 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pref}
                  onChange={(e) => setPref(e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium">Preferences</div>
                  <p className="text-xs text-muted-foreground">
                    Remembers your sidebar collapse state, theme, last-visited
                    tier, etc. Pure UX convenience.
                  </p>
                </div>
              </label>
              <label className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/30 cursor-pointer">
                <input
                  type="checkbox"
                  checked={anly}
                  onChange={(e) => setAnly(e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium">Analytics</div>
                  <p className="text-xs text-muted-foreground">
                    Anonymous product analytics (PostHog OSS, self-hosted). We
                    use this to find broken flows and prioritize features.
                  </p>
                </div>
              </label>
            </div>
            <div className="flex flex-wrap gap-2 justify-end">
              <button
                onClick={rejectAll}
                className="px-3 py-1.5 rounded-md border text-sm font-medium hover:bg-muted"
              >
                Reject all
              </button>
              <button
                onClick={saveSelection}
                className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
              >
                Save selection
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Footer link that re-opens the banner. Mount anywhere you want a
 * "Manage cookies" link.
 */
export function CookiePrefsButton() {
  return (
    <button
      onClick={() => window.dispatchEvent(new CustomEvent("eureka:open-cookie-prefs"))}
      className="text-xs text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
    >
      Manage cookies
    </button>
  );
}
