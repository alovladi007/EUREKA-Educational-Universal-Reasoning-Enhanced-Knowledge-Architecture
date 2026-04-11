'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft,
  BookMarked,
  List,
  Search,
  ExternalLink,
  BookmarkPlus,
  Trash2,
  Info,
  Copy,
  ShieldAlert,
} from 'lucide-react';
import { MPEP_CHAPTER_LIST, eMpepChapterUrl, eMpepIndexUrl, eMpepSearchUrl } from '@/lib/mpep-chapters';
import { apiClient } from '@/lib/api-client';

const EXAM = 'PATENT_BAR';

type Tab = 'toc' | 'bookmarks' | 'search';

export default function MpepWorkbenchPage() {
  const params = useParams();
  const router = useRouter();
  const exam = ((params.exam as string) || '').toUpperCase();
  const [tab, setTab] = useState<Tab>('toc');
  /** Official eMPEP URL (cannot be embedded — USPTO sends frame-blocking headers). */
  const [mpepUrl, setMpepUrl] = useState(eMpepIndexUrl());
  const [autoOpenOnSelect, setAutoOpenOnSelect] = useState(true);
  const [tocFilter, setTocFilter] = useState('');
  const [searchQ, setSearchQ] = useState('');
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [bmTitle, setBmTitle] = useState('');
  const [bmUrl, setBmUrl] = useState('');
  const [bmChapter, setBmChapter] = useState('');
  const loadBookmarks = useCallback(async () => {
    try {
      const res = await apiClient.getMpepBookmarks();
      setBookmarks(res?.bookmarks ?? []);
    } catch {
      setBookmarks([]);
    }
  }, []);

  useEffect(() => {
    if (exam !== EXAM) {
      router.replace(`/dashboard/test-prep/${params.exam}`);
      return;
    }
    loadBookmarks();
  }, [exam, params.exam, router, loadBookmarks]);

  if (exam !== EXAM) {
    return null;
  }

  const filteredToc = MPEP_CHAPTER_LIST.filter(
    (ch) =>
      !tocFilter.trim() ||
      ch.title.toLowerCase().includes(tocFilter.toLowerCase()) ||
      ch.num.includes(tocFilter)
  );

  const openOfficialMpep = useCallback((url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  const openChapter = (num: string) => {
    const url = eMpepChapterUrl(num);
    setMpepUrl(url);
    setBmUrl(url);
    setBmChapter(num);
    setBmTitle(`MPEP Chapter ${num}`);
    if (autoOpenOnSelect) {
      openOfficialMpep(url);
    }
  };

  const addBookmark = async () => {
    if (!bmUrl.trim()) return;
    await apiClient.createMpepBookmark({
      title: bmTitle.trim() || 'MPEP bookmark',
      url: bmUrl.trim(),
      chapter: bmChapter || undefined,
    });
    setBmTitle('');
    setBmUrl('');
    setBmChapter('');
    loadBookmarks();
  };

  const removeBookmark = async (id: string) => {
    await apiClient.deleteMpepBookmark(id);
    loadBookmarks();
  };

  const openSearchInMpep = () => {
    if (!searchQ.trim()) return;
    const u = eMpepSearchUrl(searchQ);
    setMpepUrl(u);
    openOfficialMpep(u);
  };

  const copyCurrentUrl = async () => {
    try {
      await navigator.clipboard.writeText(mpepUrl);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="flex flex-col gap-3 min-h-[calc(100vh-6rem)]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/test-prep/${String(params.exam).toLowerCase()}`}
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" /> Hub
          </Link>
          <Link href={`/dashboard/test-prep/${String(params.exam).toLowerCase()}/command-center`}>
            <Button variant="outline" size="sm">
              Analytics
            </Button>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-mono text-[10px]">
            eMPEP R-01.2024 practice shell
          </Badge>
          <Button variant="outline" size="sm" className="gap-1" onClick={() => openOfficialMpep(mpepUrl)}>
            <ExternalLink className="h-3.5 w-3.5" /> Open eMPEP
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-amber-200/80 bg-amber-50/60 dark:bg-amber-950/25 text-sm p-3 flex flex-wrap gap-2 items-start">
        <ShieldAlert className="h-4 w-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
        <p className="text-muted-foreground flex-1 min-w-[200px]">
          <strong className="text-foreground">USPTO does not allow other sites to embed eMPEP in an iframe</strong> (browser shows
          &quot;refused to connect&quot;). This workbench keeps TOC, bookmarks, and your target URL here; use{' '}
          <strong className="text-foreground">Open official eMPEP</strong> to read the live manual in a new tab — same as side-by-side
          prep with the real exam. Use <kbd className="px-1 rounded bg-muted text-xs">Ctrl/Cmd+F</kbd> in that tab to search.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(280px,340px)_1fr] gap-3 flex-1 min-h-[560px]">
        <Card className="flex flex-col overflow-hidden p-0">
          <div className="flex border-b">
            {(
              [
                ['toc', 'TOC', List],
                ['bookmarks', 'Marks', BookMarked],
                ['search', 'Search', Search],
              ] as const
            ).map(([id, label, Icon]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
                  tab === id ? 'bg-muted border-b-2 border-primary' : 'text-muted-foreground hover:bg-muted/50'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>

          <div className="p-3 flex-1 overflow-y-auto max-h-[70vh]">
            {tab === 'toc' && (
              <div className="space-y-2">
                <Input placeholder="Filter chapters…" value={tocFilter} onChange={(e) => setTocFilter(e.target.value)} className="h-9" />
                <label className="flex items-center gap-2 text-[11px] text-muted-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoOpenOnSelect}
                    onChange={(e) => setAutoOpenOnSelect(e.target.checked)}
                    className="rounded border"
                  />
                  Open eMPEP in a new tab when I pick a chapter
                </label>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    const url = eMpepIndexUrl();
                    setMpepUrl(url);
                    setBmUrl(url);
                    setBmTitle('MPEP index');
                    setBmChapter('');
                    if (autoOpenOnSelect) openOfficialMpep(url);
                  }}
                >
                  Load index URL &amp; open
                </Button>
                <div className="space-y-1">
                  {filteredToc.map((ch) => (
                    <button
                      key={ch.num}
                      type="button"
                      onClick={() => openChapter(ch.num)}
                      className="w-full text-left rounded-md px-2 py-1.5 text-xs hover:bg-accent flex justify-between gap-2"
                    >
                      <span className="font-mono text-muted-foreground w-10 shrink-0">{ch.num}</span>
                      <span className="flex-1 leading-snug">{ch.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {tab === 'bookmarks' && (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  Bookmark the <strong className="text-foreground">current target URL</strong> (updates when you pick a chapter). Edit
                  title if you want.
                </p>
                <Input placeholder="Title" value={bmTitle} onChange={(e) => setBmTitle(e.target.value)} className="h-9" />
                <Input placeholder="URL" value={bmUrl} onChange={(e) => setBmUrl(e.target.value)} className="h-9 text-xs font-mono" />
                <Input placeholder="Chapter # (optional)" value={bmChapter} onChange={(e) => setBmChapter(e.target.value)} className="h-9" />
                <Button size="sm" className="w-full gap-2" onClick={addBookmark}>
                  <BookmarkPlus className="h-4 w-4" /> Save bookmark
                </Button>
                <div className="border-t pt-2 space-y-1">
                  {bookmarks.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No saved bookmarks yet.</p>
                  ) : (
                    bookmarks.map((b) => (
                      <div key={b.id} className="flex items-start gap-2 rounded-md border p-2 text-xs">
                        <button
                          type="button"
                          className="flex-1 text-left hover:underline"
                          onClick={() => {
                            setMpepUrl(b.url);
                            setBmUrl(b.url);
                            setBmChapter(b.chapter || '');
                            if (autoOpenOnSelect) openOfficialMpep(b.url);
                          }}
                        >
                          <span className="font-medium block">{b.title}</span>
                          {b.chapter && <span className="text-muted-foreground">Ch. {b.chapter}</span>}
                        </button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => removeBookmark(b.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {tab === 'search' && (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  Runs a search URL on the official eMPEP site (opens in a new tab). You can also filter the chapter list with the button
                  below.
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Keywords (e.g. obviousness, 102, PCT)"
                    value={searchQ}
                    onChange={(e) => setSearchQ(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && openSearchInMpep()}
                    className="h-9"
                  />
                  <Button size="sm" onClick={openSearchInMpep}>
                    Go
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => {
                    setTocFilter(searchQ);
                    setTab('toc');
                  }}
                >
                  <Search className="h-3.5 w-3.5" /> Filter TOC with this text
                </Button>
              </div>
            )}
          </div>
        </Card>

        <div className="relative rounded-lg border bg-muted/20 overflow-hidden flex flex-col min-h-[480px]">
          <div className="p-6 flex flex-col flex-1 justify-center gap-6">
            <div className="space-y-2">
              <p className="text-sm font-medium">Official eMPEP (new tab)</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your current navigation target is below. This mirrors how you&apos;ll use the real exam: reference panel on one screen,
                USPTO reader in another.
              </p>
            </div>
            <div className="rounded-md border bg-background p-3 font-mono text-[11px] break-all leading-relaxed text-muted-foreground">
              {mpepUrl}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="lg" className="gap-2" onClick={() => openOfficialMpep(mpepUrl)}>
                <ExternalLink className="h-4 w-4" />
                Open official eMPEP
              </Button>
              <Button variant="outline" size="lg" className="gap-2" onClick={copyCurrentUrl}>
                <Copy className="h-4 w-4" />
                Copy URL
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              <Info className="h-3.5 w-3.5 inline mr-1 align-text-bottom" />
              Tip: tile this browser window with the eMPEP tab, or use a second monitor — same workflow many candidates use for practice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
