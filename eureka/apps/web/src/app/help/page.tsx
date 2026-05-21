"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { EurekaNav } from "@/components/eureka-nav";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { api } from "@/lib/eureka-api";
import { Search, BookOpen, LifeBuoy, MessageSquare } from "lucide-react";

type KbArticle = {
  id: string;
  slug: string;
  title: string;
  summary?: string | null;
  body_md?: string;
  category?: string | null;
  view_count?: number;
  helpful_count?: number;
  not_helpful_count?: number;
  updated_at?: string;
};

export default function HelpCenterPage() {
  const [articles, setArticles] = useState<KbArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await api<KbArticle[]>("/kb?limit=50", { auth: false }).catch(
        () => [] as KbArticle[],
      );
      if (!mounted) return;
      setArticles(Array.isArray(data) ? data : []);
      setLoading(false);
    })().catch((e: unknown) => {
      if (!mounted) return;
      setError(e instanceof Error ? e.message : "Failed to load help articles");
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return articles;
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        (a.summary && a.summary.toLowerCase().includes(q)) ||
        (a.category && a.category.toLowerCase().includes(q)),
    );
  }, [articles, query]);

  return (
    <>
      <EurekaNav />
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <LifeBuoy className="w-7 h-7 text-blue-600" />
            Help Center
          </h1>
          <p className="text-slate-600 mt-2 max-w-2xl">
            Search the knowledge base for setup, billing, exam prep, and
            platform questions. Every article is written by the EUREKA team and
            updated as features ship.
          </p>
        </header>

        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search articles by title, summary, or category…"
                className="pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <p className="text-sm text-slate-500">Loading articles…</p>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <p className="font-medium text-slate-700">
                {articles.length === 0
                  ? "No knowledge base articles published yet."
                  : "No articles match that search."}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                {articles.length === 0
                  ? "Check back soon — content is being added per phase."
                  : "Try a different keyword, or contact support below."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((a) => (
              <Link key={a.id} href={`/help/${a.slug}`}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      {a.category && (
                        <Badge variant="secondary" className="text-xs">
                          {a.category}
                        </Badge>
                      )}
                      {typeof a.view_count === "number" && (
                        <span className="text-xs text-slate-500">
                          {a.view_count.toLocaleString()} views
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-base leading-snug">
                      {a.title}
                    </CardTitle>
                    {a.summary && (
                      <CardDescription className="line-clamp-3">
                        {a.summary}
                      </CardDescription>
                    )}
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <Card className="bg-slate-50 border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Still stuck?
            </CardTitle>
            <CardDescription>
              We answer support tickets within one business day.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Link href="/settings/support">
              <Button>Open a support ticket</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline">Contact us</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
