"use client";

/**
 * VideoLessonTabs — the ABP-style tab panel that sits BELOW the video player
 * in a Test Prep video lesson: Overview / Resources / Notes / Q&A / Transcript.
 *
 * Real lesson data (description, key concepts, official reference notes) is
 * wired in. Personal notes persist to localStorage per lesson. Where a lesson
 * genuinely has no data yet (downloadable resources, a transcript, discussion),
 * we show an honest empty state rather than fabricated content.
 */

import { useEffect, useState } from "react";
import {
  Info, Folder, StickyNote, MessageSquare, FileText, Download,
  ExternalLink, CheckCircle2, Save,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

type LessonResource = { title?: string; name?: string; type?: string; url?: string; size?: string };
type TranscriptCue = { t?: string; time?: string; text: string };
type Lesson = {
  id?: string;
  title?: string;
  description?: string;
  section?: string;
  domain?: number;
  duration_seconds?: number;
  key_concepts?: string[];
  official_notes?: string;
  objectives?: string[];
  resources?: LessonResource[];
  transcript?: TranscriptCue[];
};

const TABS = [
  { id: "overview", label: "Overview", icon: Info },
  { id: "resources", label: "Resources", icon: Folder },
  { id: "notes", label: "Notes", icon: StickyNote },
  { id: "qa", label: "Q&A", icon: MessageSquare },
  { id: "transcript", label: "Transcript", icon: FileText },
] as const;
type TabId = (typeof TABS)[number]["id"];

export function VideoLessonTabs({ lesson }: { lesson: Lesson }) {
  const [tab, setTab] = useState<TabId>("overview");
  return (
    <div>
      <div className="flex gap-1 overflow-x-auto border-b">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                active ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" /> {t.label}
            </button>
          );
        })}
      </div>

      <div className="pt-5">
        {tab === "overview" && <Overview lesson={lesson} />}
        {tab === "resources" && <Resources lesson={lesson} />}
        {tab === "notes" && <Notes lesson={lesson} />}
        {tab === "qa" && <Qa />}
        {tab === "transcript" && <Transcript lesson={lesson} />}
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, body }: { icon: typeof Info; title: string; body: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-10 text-center">
      <Icon className="h-8 w-8 text-muted-foreground/50" />
      <p className="mt-3 text-sm font-medium">{title}</p>
      <p className="mt-1 max-w-sm px-6 text-xs text-muted-foreground">{body}</p>
    </div>
  );
}

// ── Overview ─────────────────────────────────────────────────────────────────

function Overview({ lesson }: { lesson: Lesson }) {
  const objectives = Array.isArray(lesson.objectives) ? lesson.objectives : [];
  const concepts = Array.isArray(lesson.key_concepts) ? lesson.key_concepts : [];
  return (
    <div className="space-y-6">
      {objectives.length > 0 && (
        <section>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Learning objectives</h3>
          <ul className="space-y-2">
            {objectives.map((o, i) => (
              <li key={i} className="flex gap-2 text-sm"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>{o}</span></li>
            ))}
          </ul>
        </section>
      )}
      {lesson.description && (
        <section>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">About this lesson</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{lesson.description}</p>
        </section>
      )}
      {concepts.length > 0 && (
        <section>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Key concepts</h3>
          <div className="flex flex-wrap gap-1.5">
            {concepts.map((c, i) => <Badge key={i} variant="secondary">{c}</Badge>)}
          </div>
        </section>
      )}
      {!lesson.description && objectives.length === 0 && concepts.length === 0 && (
        <EmptyState icon={Info} title="No overview yet" body="An overview for this lesson will appear here once it's authored." />
      )}
    </div>
  );
}

// ── Resources ────────────────────────────────────────────────────────────────

function Resources({ lesson }: { lesson: Lesson }) {
  const resources = Array.isArray(lesson.resources) ? lesson.resources : [];
  if (resources.length === 0) {
    return <EmptyState icon={Folder} title="No downloadable resources yet" body="Slides, worksheets, and reference PDFs for this lesson will appear here when added." />;
  }
  return (
    <div className="space-y-2">
      {resources.map((r, i) => {
        const external = r.type === "link" || (r.url && /^https?:/.test(r.url));
        const Action = external ? ExternalLink : Download;
        return (
          <a
            key={i}
            href={r.url || undefined}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><FileText className="h-4 w-4" /></span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{r.title || r.name || "Resource"}</div>
              <div className="text-xs text-muted-foreground">{[r.type, r.size].filter(Boolean).join(" · ") || "Resource"}</div>
            </div>
            <Action className="h-4 w-4 text-muted-foreground" />
          </a>
        );
      })}
    </div>
  );
}

// ── Notes (real: official reference + personal notes in localStorage) ────────

function Notes({ lesson }: { lesson: Lesson }) {
  const key = lesson.id ? `lesson-note:${lesson.id}` : null;
  const [val, setVal] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!key || typeof window === "undefined") return;
    try { setVal(window.localStorage.getItem(key) || ""); } catch { /* ignore */ }
    setSaved(false);
  }, [key]);

  const save = () => {
    if (!key || typeof window === "undefined") return;
    try { window.localStorage.setItem(key, val); setSaved(true); } catch { /* ignore */ }
  };

  return (
    <div className="space-y-5">
      {lesson.official_notes && (
        <section>
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold"><FileText className="h-4 w-4 text-primary" /> Lesson reference notes</h3>
          <div className="whitespace-pre-wrap rounded-lg bg-muted/50 p-4 text-sm">{lesson.official_notes}</div>
        </section>
      )}
      <section>
        <h3 className="mb-2 text-sm font-semibold">Your notes</h3>
        <Textarea
          value={val}
          onChange={(e) => { setVal(e.target.value); setSaved(false); }}
          rows={5}
          placeholder="Jot down your own notes for this lesson…"
        />
        <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
          <span>{saved ? "Saved on this device" : "Kept on this device"}</span>
          <Button size="sm" variant="outline" className="gap-1" onClick={save} disabled={!key}>
            <Save className="h-3.5 w-3.5" /> Save
          </Button>
        </div>
      </section>
    </div>
  );
}

// ── Q&A (UI ready; discussion backend not wired for lessons yet) ─────────────

function Qa() {
  const [q, setQ] = useState("");
  const [posted, setPosted] = useState<{ text: string }[]>([]);
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask a question about this lesson…" />
        <Button
          className="shrink-0 gap-1"
          disabled={!q.trim()}
          onClick={() => { setPosted((p) => [{ text: q.trim() }, ...p]); setQ(""); }}
        >
          <MessageSquare className="h-4 w-4" /> Post
        </Button>
      </div>
      {posted.map((p, i) => (
        <div key={i} className="rounded-lg border p-3">
          <div className="text-sm">{p.text}</div>
          <div className="mt-1 text-xs text-muted-foreground">You · just now · not shared yet</div>
        </div>
      ))}
      {posted.length === 0 && (
        <EmptyState icon={MessageSquare} title="No questions yet" body="Ask a question about this lesson. Shared discussion with instructors and peers is coming soon." />
      )}
    </div>
  );
}

// ── Transcript ───────────────────────────────────────────────────────────────

function Transcript({ lesson }: { lesson: Lesson }) {
  const cues = Array.isArray(lesson.transcript) ? lesson.transcript : [];
  if (cues.length === 0) {
    return <EmptyState icon={FileText} title="No transcript yet" body="A timestamped transcript will appear here once this video has captions." />;
  }
  return (
    <div className="space-y-1">
      {cues.map((c, i) => (
        <div key={i} className="flex gap-3 rounded-md px-2 py-1.5 text-sm hover:bg-muted">
          {(c.t || c.time) && <span className="shrink-0 font-mono text-xs text-primary">{c.t || c.time}</span>}
          <span className="text-muted-foreground">{c.text}</span>
        </div>
      ))}
    </div>
  );
}
