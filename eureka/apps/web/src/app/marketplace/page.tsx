"use client";

/**
 * Phase 10.3 — Marketplace browse.
 *
 * Pulls /api/v1/marketplace/courses (the rank-ordered public feed) and
 * lays it out as a search-friendly grid. Each card links into
 * /marketplace/[slug] for full detail + checkout.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EurekaNav } from "@/components/eureka-nav";
import { api, formatPrice } from "@/lib/eureka-api";

type RankedListing = {
  listing: {
    id: string;
    slug: string;
    headline: string;
    summary_md: string | null;
    hero_image_url: string | null;
    tags: string[];
    target_skill_codes: string[];
    level: string | null;
    avg_rating: number | null;
    review_count: number;
    enrolled_count: number;
    rank_score: number;
  };
  instructor_display_name: string;
  list_price_cents: number;
  final_price_cents: number;
  currency: string;
};

export default function MarketplacePage() {
  const [rows, setRows] = useState<RankedListing[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    const params = new URLSearchParams({ limit: "30" });
    if (q.trim().length >= 2) params.set("q", q.trim());
    api<RankedListing[]>(`/marketplace/courses?${params.toString()}`, { auth: false })
      .then(setRows)
      .catch((e) => setError(String(e.detail || e.message)));
  }, [q]);

  return (
    <>
      <EurekaNav />
      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Marketplace</h1>
          <p className="text-slate-600">
            Instructor-led courses, ranked by recent sales, ratings, and completion.
          </p>
        </div>

        <Input
          placeholder="Search the marketplace…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-md"
        />

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Failed to load</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {rows === null && !error && <p className="text-slate-500">Loading…</p>}

        {rows && rows.length === 0 && (
          <p className="text-slate-500">No listings yet.</p>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rows?.map((row) => (
            <Link
              key={row.listing.id}
              href={`/marketplace/${row.listing.slug}`}
              className="block"
            >
              <Card className="h-full hover:shadow-md transition-shadow">
                {row.listing.hero_image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={row.listing.hero_image_url}
                    alt=""
                    className="rounded-t-md w-full aspect-video object-cover bg-slate-100"
                  />
                )}
                <CardHeader>
                  <CardTitle className="text-base line-clamp-2">
                    {row.listing.headline}
                  </CardTitle>
                  <p className="text-xs text-slate-500">
                    by {row.instructor_display_name}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-semibold">
                      {row.final_price_cents === 0
                        ? "Free"
                        : formatPrice(row.final_price_cents, row.currency)}
                    </span>
                    {row.final_price_cents !== 0 &&
                      row.list_price_cents > row.final_price_cents && (
                        <span className="text-sm text-slate-400 line-through">
                          {formatPrice(row.list_price_cents, row.currency)}
                        </span>
                      )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {row.listing.level && (
                      <Badge variant="secondary">{row.listing.level}</Badge>
                    )}
                    {row.listing.tags.slice(0, 3).map((t) => (
                      <Badge key={t} variant="outline">
                        {t}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-xs text-slate-500 flex gap-3">
                    {row.listing.avg_rating !== null && (
                      <span>
                        ★ {Number(row.listing.avg_rating).toFixed(1)} (
                        {row.listing.review_count})
                      </span>
                    )}
                    <span>{row.listing.enrolled_count} enrolled</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
