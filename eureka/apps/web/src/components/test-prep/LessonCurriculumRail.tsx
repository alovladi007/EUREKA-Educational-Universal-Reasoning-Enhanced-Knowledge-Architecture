"use client";

/**
 * LessonCurriculumRail — the ABP-style course outline that sits beside the
 * video player while you're inside a lesson. Lists modules (sections) and
 * their lessons, highlights the current one, and lets you jump between
 * lessons without leaving the player. Driven by the lessons already loaded
 * in the Video Lessons tab — no extra fetch.
 */

import { BookOpen, PlayCircle, Circle, CheckCircle2 } from "lucide-react";

type LessonLike = { id?: string; title?: string; duration_seconds?: number };
type Progress = { completed?: number; total_lessons?: number; completion_percent?: number } | null;

function fmtDur(s?: number): string {
  if (!s || s <= 0) return "Video";
  const m = Math.floor(s / 60);
  const sec = Math.round(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
}

// Section keys can be raw slugs (e.g. "security_risk"). Leave already-readable
// names (with spaces or capitals) alone; prettify snake/kebab slugs.
function humanize(s: string): string {
  if (!s) return "Module";
  if (/\s/.test(s) || /[A-Z]/.test(s)) return s;
  return s.replace(/[_-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function LessonCurriculumRail({
  lessons,
  activeId,
  onSelect,
  progress,
  completedIds,
  title = "Course outline",
}: {
  lessons: Record<string, LessonLike[]>;
  activeId?: string;
  onSelect: (lesson: LessonLike) => void;
  progress?: Progress;
  /** Lesson ids the learner has completed — shown with a green check. */
  completedIds?: Set<string>;
  title?: string;
}) {
  const sections = Object.entries(lessons).filter(([, ls]) => Array.isArray(ls) && ls.length > 0);
  const total = sections.reduce((n, [, ls]) => n + ls.length, 0);
  const pct = Math.max(0, Math.min(100, progress?.completion_percent ?? 0));
  const hasProgress = !!progress && (progress.total_lessons ?? 0) > 0;

  return (
    <aside className="hidden w-72 shrink-0 lg:block">
      <div className="sticky top-2 overflow-hidden rounded-xl border">
        <div className="border-b p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <BookOpen className="h-4 w-4 text-primary" /> {title}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {total} video lesson{total === 1 ? "" : "s"} · {sections.length} module{sections.length === 1 ? "" : "s"}
          </div>
          {hasProgress && (
            <>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">
                {progress?.completed ?? 0}/{progress?.total_lessons ?? 0} complete
              </div>
            </>
          )}
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-2">
          {sections.map(([name, ls]) => (
            <div key={name} className="mb-2">
              <div className="px-2 py-1.5">
                <div className="text-xs font-semibold">{humanize(name)}</div>
                <div className="text-[11px] text-muted-foreground">{ls.length} lesson{ls.length === 1 ? "" : "s"}</div>
              </div>
              <ul className="space-y-0.5">
                {ls.map((l, i) => {
                  const active = !!l.id && l.id === activeId;
                  const done = !!l.id && !!completedIds?.has(l.id);
                  return (
                    <li key={l.id || i}>
                      <button
                        onClick={() => onSelect(l)}
                        className={`flex w-full items-start gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors ${
                          active ? "bg-primary/10 text-primary ring-1 ring-primary/30" : "hover:bg-muted"
                        }`}
                      >
                        <span className="mt-0.5">
                          {active ? <PlayCircle className="h-4 w-4 text-primary" />
                            : done ? <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            : <Circle className="h-4 w-4 text-muted-foreground/40" />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className={`block truncate ${active ? "font-semibold" : ""}`}>{l.title}</span>
                          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <PlayCircle className="h-3 w-3" /> {fmtDur(l.duration_seconds)}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
