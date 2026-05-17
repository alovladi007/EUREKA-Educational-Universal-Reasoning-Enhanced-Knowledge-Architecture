"use client";

/**
 * Phase 10 — Marketplace listing detail.
 *
 * Reads the public listing by slug, then resolves a price quote
 * (with optional coupon code) before exposing the "Enroll" button
 * which hits POST /marketplace/checkout. Stub-mode confirmation flow
 * is supported when the server returns is_stub=true.
 */

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EurekaNav } from "@/components/eureka-nav";
import { api, formatPrice } from "@/lib/eureka-api";

type Listing = {
  id: string;
  course_id: string;
  slug: string;
  headline: string;
  summary_md: string | null;
  hero_image_url: string | null;
  promo_video_url: string | null;
  tags: string[];
  target_skill_codes: string[];
  level: string | null;
  language: string;
  estimated_hours: number | null;
  enrolled_count: number;
  review_count: number;
  avg_rating: number | null;
  rank_score: number;
};

type PriceQuote = {
  course_id: string;
  currency: string;
  list_price_cents: number;
  sale_price_cents: number | null;
  effective_price_cents: number;
  coupon_code: string | null;
  coupon_discount_cents: number;
  final_price_cents: number;
  instructor_net_cents: number;
  platform_fee_cents: number;
  is_free: boolean;
  notes: string[];
};

type Review = {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  verified_purchase: boolean;
  created_at: string;
};

export default function ListingDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params?.slug;

  const [listing, setListing] = useState<Listing | null>(null);
  const [quote, setQuote] = useState<PriceQuote | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [coupon, setCoupon] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [checkoutMsg, setCheckoutMsg] = useState<string | null>(null);

  // load listing
  useEffect(() => {
    if (!slug) return;
    api<Listing>(`/listings/${slug}`, { auth: false })
      .then(setListing)
      .catch((e) => setError(String(e.detail || e.message)));
  }, [slug]);

  // load quote + reviews once we know the course_id
  useEffect(() => {
    if (!listing) return;
    const q = coupon ? `?coupon_code=${encodeURIComponent(coupon)}` : "";
    api<PriceQuote>(`/courses/${listing.course_id}/price-quote${q}`)
      .then(setQuote)
      .catch((e) => setError(String(e.detail || e.message)));
    api<Review[]>(`/courses/${listing.course_id}/reviews`, { auth: false })
      .then(setReviews)
      .catch(() => setReviews([]));
  }, [listing, coupon]);

  async function startCheckout() {
    if (!listing) return;
    setBusy(true);
    setCheckoutMsg(null);
    try {
      const r = await api<{
        purchase_id: string;
        checkout_url: string | null;
        is_free: boolean;
        is_stub: boolean;
      }>(`/marketplace/checkout`, {
        method: "POST",
        body: JSON.stringify({
          course_id: listing.course_id,
          coupon_code: coupon || undefined,
          success_url: window.location.href,
          cancel_url: window.location.href,
        }),
      });
      if (r.is_free) {
        setCheckoutMsg("Enrolled — this listing is free.");
      } else if (r.is_stub) {
        // Stub mode: hit the dev confirm endpoint directly
        await api(`/marketplace/checkout/${r.purchase_id}/confirm`, {
          method: "POST",
        });
        setCheckoutMsg("Stub checkout confirmed.");
      } else if (r.checkout_url) {
        window.location.href = r.checkout_url;
        return;
      }
    } catch (e) {
      // pydantic.ApiError has a `detail` field
      const msg =
        (e as { detail?: unknown; message?: string }).detail ||
        (e as { message?: string }).message ||
        String(e);
      setCheckoutMsg(`Checkout failed: ${String(msg)}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <EurekaNav />
      <main className="max-w-5xl mx-auto p-6 space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Failed to load</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {listing === null && !error && <p>Loading…</p>}
        {listing && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              {listing.hero_image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={listing.hero_image_url}
                  alt=""
                  className="rounded-md w-full aspect-video object-cover bg-slate-100"
                />
              )}
              <h1 className="text-3xl font-bold">{listing.headline}</h1>
              <div className="flex flex-wrap gap-2">
                {listing.level && <Badge variant="secondary">{listing.level}</Badge>}
                <Badge variant="outline">{listing.language.toUpperCase()}</Badge>
                {listing.estimated_hours && (
                  <Badge variant="outline">
                    {Number(listing.estimated_hours).toFixed(1)} hrs
                  </Badge>
                )}
                {listing.tags.map((t) => (
                  <Badge key={t} variant="outline">
                    {t}
                  </Badge>
                ))}
              </div>
              {listing.summary_md && (
                <p className="whitespace-pre-line text-slate-700">
                  {listing.summary_md}
                </p>
              )}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Reviews ({reviews.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {reviews.length === 0 && (
                    <p className="text-slate-500 text-sm">No reviews yet.</p>
                  )}
                  {reviews.slice(0, 5).map((r) => (
                    <div
                      key={r.id}
                      className="border-b last:border-0 pb-3 last:pb-0"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">★ {r.rating}</span>
                        {r.verified_purchase && (
                          <Badge variant="outline" className="text-[10px]">
                            verified
                          </Badge>
                        )}
                        {r.title && <span className="font-medium">{r.title}</span>}
                      </div>
                      {r.body && (
                        <p className="text-sm text-slate-600 mt-1">{r.body}</p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <aside className="space-y-4">
              <Card className="sticky top-20">
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-bold">
                        {quote?.is_free || quote?.final_price_cents === 0
                          ? "Free"
                          : formatPrice(
                              quote?.final_price_cents ??
                                listing.avg_rating ??
                                0,
                              quote?.currency || "USD",
                            )}
                      </span>
                      {quote &&
                        quote.list_price_cents > quote.final_price_cents &&
                        quote.final_price_cents > 0 && (
                          <span className="text-sm text-slate-400 line-through">
                            {formatPrice(quote.list_price_cents, quote.currency)}
                          </span>
                        )}
                    </div>
                    {quote && quote.coupon_discount_cents > 0 && (
                      <p className="text-xs text-green-700 mt-1">
                        Coupon {quote.coupon_code} saved{" "}
                        {formatPrice(quote.coupon_discount_cents, quote.currency)}.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium uppercase text-slate-500">
                      Coupon code
                    </label>
                    <Input
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="e.g. SAVE25"
                    />
                  </div>

                  <Button
                    className="w-full"
                    disabled={busy}
                    onClick={startCheckout}
                  >
                    {busy
                      ? "Working…"
                      : quote?.final_price_cents === 0
                        ? "Enrol — free"
                        : "Enrol"}
                  </Button>

                  {checkoutMsg && (
                    <p className="text-sm text-slate-600">{checkoutMsg}</p>
                  )}

                  {quote && quote.notes.length > 0 && (
                    <ul className="text-xs text-slate-500 space-y-1">
                      {quote.notes.map((n, i) => (
                        <li key={i}>· {n}</li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              <div className="text-xs text-slate-500 space-y-1">
                <p>{listing.enrolled_count} learners enrolled</p>
                {listing.avg_rating !== null && (
                  <p>
                    ★ {Number(listing.avg_rating).toFixed(1)} ({listing.review_count}{" "}
                    reviews)
                  </p>
                )}
              </div>
            </aside>
          </div>
        )}
      </main>
    </>
  );
}
