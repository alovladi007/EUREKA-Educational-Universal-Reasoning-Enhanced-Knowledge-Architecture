/**
 * Service-health signal (P1.4).
 *
 * The api-client degrades gracefully when the test-prep (:8200) or
 * medical-school (:8030) microservices are unreachable or can't
 * authenticate — it resolves an empty-shaped payload so pages render a
 * "nothing yet" state instead of throwing. The problem: that empty
 * state is indistinguishable from "you genuinely have no data," so a
 * user whose service is just *down* sees a silently-blank dashboard
 * with no explanation.
 *
 * This module is the bridge between the (non-React) axios interceptors
 * and a React banner. The interceptor calls `markServiceDegraded(...)`;
 * a `<ServiceHealthBanner/>` mounted in the dashboard layout listens for
 * the browser CustomEvent and surfaces a dismissible notice. Plain
 * CustomEvent (not a store) keeps this dependency-free and SSR-safe.
 */

export type DegradableService = 'test-prep' | 'medical-school' | 'analytics';

export interface ServiceDegradedDetail {
  service: DegradableService;
  /** 'offline' = unreachable; 'auth' = responded but rejected our token. */
  kind: 'offline' | 'auth';
}

export const SERVICE_DEGRADED_EVENT = 'eureka:service-degraded';

/**
 * Fire-and-forget: announce that a backend degraded. No-op on the server.
 * De-duplication (so we don't spam the banner) is the listener's job —
 * here we just emit.
 */
export function markServiceDegraded(
  service: DegradableService,
  kind: 'offline' | 'auth',
): void {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(
      new CustomEvent<ServiceDegradedDetail>(SERVICE_DEGRADED_EVENT, {
        detail: { service, kind },
      }),
    );
  } catch {
    /* CustomEvent unavailable (very old env) — silently skip. */
  }
}

/** Human-readable label for a degraded service, used by the banner. */
export function serviceLabel(service: DegradableService): string {
  switch (service) {
    case 'test-prep':
      return 'Test Prep';
    case 'medical-school':
      return 'Medical School';
    case 'analytics':
      return 'Analytics';
    default:
      return service;
  }
}
