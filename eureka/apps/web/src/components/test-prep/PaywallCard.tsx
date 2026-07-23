'use client';

/**
 * Upgrade card shown wherever paid test-prep content is gated (WS5).
 *
 * Not an error state and not fake data: it names the real product, the real
 * price (from the products table), and starts a REAL Stripe Checkout
 * session (test mode until live keys are configured). When billing is not
 * configured server-side (503), it says so honestly instead of pretending.
 */

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Loader2, CreditCard } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import type { ProductRow } from '@/hooks/useEntitlements';

export function PaywallCard({
  product,
  feature,
  examSlug,
}: {
  product: ProductRow | null;
  feature: string;
  examSlug: string;
}) {
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const startCheckout = async () => {
    if (!product) return;
    setBusy(true);
    setNotice(null);
    try {
      const base = window.location.origin;
      const res = await apiClient.post('/billing/test-prep/checkout', {
        sku: product.sku,
        success_url: `${base}/dashboard/test-prep/${examSlug}?checkout=success`,
        cancel_url: `${base}/dashboard/test-prep/${examSlug}?checkout=cancel`,
      });
      const url = res?.data?.checkout_url;
      if (url) window.location.href = url;
      else setNotice('Checkout could not be started.');
    } catch (e: any) {
      const detail = e?.response?.data?.detail;
      setNotice(
        e?.response?.status === 503
          ? typeof detail === 'string'
            ? detail
            : 'Billing is not configured on this server yet.'
          : `Checkout failed: ${typeof detail === 'string' ? detail : e?.message ?? 'unknown error'}`,
      );
    } finally {
      setBusy(false);
    }
  };

  const price = product ? (product.price_cents / 100).toLocaleString('en-US', {
    style: 'currency', currency: product.currency.toUpperCase(),
  }) : null;

  return (
    <Card className="space-y-3 border-primary/40 bg-primary/5 p-5 text-sm">
      <p className="flex items-center gap-2 font-semibold">
        <Lock className="h-4 w-4 text-primary" /> {feature} is part of Full Access
      </p>
      {product ? (
        <>
          <p className="text-muted-foreground">{product.description}</p>
          <Button className="gap-2" onClick={startCheckout} disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
            Upgrade — {price}{product.interval === 'monthly' ? '/mo' : ' one-time'}
          </Button>
        </>
      ) : (
        <p className="text-muted-foreground">
          Product information is unavailable right now — the catalogue could not be loaded.
        </p>
      )}
      {notice && (
        <p className="rounded-md border border-amber-500/40 bg-amber-500/10 p-2 text-xs text-amber-700 dark:text-amber-400">
          {notice}
        </p>
      )}
    </Card>
  );
}
