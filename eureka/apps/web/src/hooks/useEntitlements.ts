'use client';

/**
 * Test-prep entitlements (WS5).
 *
 * Client mirror of GET /me/entitlements + the product catalogue. This gate
 * is UX ONLY — the server enforces access on gated endpoints via
 * has_exam_access (402 when absent). Fail-closed: while loading or on
 * error, `has()` returns false so paid features never flash open.
 */

import { useCallback, useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';

export interface EntitlementRow {
  exam_code: string;
  sku: string;
  status: string;
  source: string;
  expires_at: string | null;
}

export interface ProductRow {
  sku: string;
  exam_code: string;
  name: string;
  description: string;
  price_cents: number;
  currency: string;
  interval: string;
  access_days: number | null;
}

export function useEntitlements() {
  const [entitlements, setEntitlements] = useState<EntitlementRow[]>([]);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const [ents, prods] = await Promise.all([
        apiClient.get('/me/entitlements'),
        apiClient.get('/billing/test-prep/products'),
      ]);
      setEntitlements(ents?.data ?? []);
      setProducts(prods?.data ?? []);
    } catch {
      // Fail closed: no entitlements on error. Products may still be empty;
      // the paywall card shows its own honest unavailable state.
      setEntitlements([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const has = useCallback(
    (examCode: string) =>
      entitlements.some(
        (e) =>
          e.exam_code === examCode &&
          e.status === 'active' &&
          (!e.expires_at || new Date(e.expires_at) > new Date()),
      ),
    [entitlements],
  );

  const productFor = useCallback(
    (examCode: string) => products.find((p) => p.exam_code === examCode) ?? null,
    [products],
  );

  return { entitlements, products, loading, has, productFor, refresh };
}
