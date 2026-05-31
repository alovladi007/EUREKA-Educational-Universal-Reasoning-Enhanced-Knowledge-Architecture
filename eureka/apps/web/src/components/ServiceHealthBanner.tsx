'use client';

/**
 * Service-health banner (P1.4).
 *
 * Listens for the `eureka:service-degraded` CustomEvent fired by the
 * api-client when test-prep (:8200) / medical-school (:8030) / analytics
 * are unreachable or reject our token, and shows a single dismissible
 * notice. Without this, those services degrading produced a silently
 * blank dashboard indistinguishable from "no data yet."
 *
 * Behavior:
 *   - Collapses multiple degraded services into one banner.
 *   - Distinguishes 'offline' (service down) from 'auth' (running but
 *     rejected the token) since the remedy differs.
 *   - Dismissible per session; re-appears on a fresh degrade event after
 *     dismissal only if a NEW service degrades.
 */

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import {
  SERVICE_DEGRADED_EVENT,
  serviceLabel,
  type ServiceDegradedDetail,
  type DegradableService,
} from '@/lib/service-health';

export default function ServiceHealthBanner() {
  // Map of degraded service → kind. Using a map de-dups repeat events.
  const [degraded, setDegraded] = React.useState<
    Record<string, 'offline' | 'auth'>
  >({});
  const [dismissed, setDismissed] = React.useState(false);

  React.useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<ServiceDegradedDetail>).detail;
      if (!detail?.service) return;
      setDegraded((prev) => {
        if (prev[detail.service] === detail.kind) return prev; // no change
        // A genuinely new degrade un-dismisses the banner.
        setDismissed(false);
        return { ...prev, [detail.service]: detail.kind };
      });
    };
    window.addEventListener(SERVICE_DEGRADED_EVENT, handler);
    return () => window.removeEventListener(SERVICE_DEGRADED_EVENT, handler);
  }, []);

  const services = Object.keys(degraded) as DegradableService[];
  if (dismissed || services.length === 0) return null;

  const anyAuth = Object.values(degraded).includes('auth');
  const labels = services.map(serviceLabel).join(', ');

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-start gap-3 border-b border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/30 px-4 py-2.5 text-sm text-amber-900 dark:text-amber-100"
    >
      <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
      <div className="flex-1 min-w-0">
        <span className="font-medium">{labels}</span>{' '}
        {anyAuth
          ? 'is running but couldn’t authenticate your session, so some data may be missing.'
          : 'appears to be offline, so some data may be missing or out of date.'}{' '}
        <span className="text-amber-700/80 dark:text-amber-300/80">
          The rest of the app still works.
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss service status notice"
        className="flex-shrink-0 rounded p-0.5 hover:bg-amber-100 dark:hover:bg-amber-900/50"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
