'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  Calculator,
  ChevronDown,
  ChevronRight,
  FileText,
  FlaskConical,
  GraduationCap,
  Layers,
} from 'lucide-react';
import {
  CurriculumCourse,
  CurriculumNode,
  CurriculumNodes,
  CurriculumUnit,
  getCurriculumNodes,
} from '@/lib/api';
import {
  MasteryIndex,
  NodeMasteryRecord,
  getMasteryMap,
} from '@/lib/analyticsApi';
import {
  EmptyState,
  ErrorPanel,
  LoadingPanel,
  Page,
  PageHeader,
  Pill,
  Stat,
  errorMessage,
} from '@/app/_ui/shell';
import { MasteryRing } from '@/app/_ui/mastery-ring';

// The Learn page is a map. It does not teach and it does not grade: lessons,
// items, hints and simulations all live behind a node, never on this surface.
//
// Three levels, always, with the middle one collapsible:
//
//   Course   General Chemistry I                    Year 1 semester 1
//     Unit   3. Composition of Substances and Solutions
//       Node 3.4  Empirical and molecular formulas
//
// The program is 312 nodes. Collapsing units by default is the only reason
// that number is legible at all, so the default state is: courses listed, the
// first course open, its first unit open, everything else closed to one row.

// -------------------------------------------------------------------------
// Mastery
// -------------------------------------------------------------------------

// The mastery index is fetched from GET /analytics/mastery alongside the
// tree. It is keyed by node code, and a node the learner has never attempted
// has no entry at all, which is a different fact from an entry with zero
// attempts. The server derives the state (ready, in_progress, needs_review,
// mastered) in one place from attempts and a recency-weighted accuracy, so
// this page renders the claim rather than recomputing it.
//
// On a fresh account the index is empty and four of the seven states stay
// unreachable: "In progress", "Mastered", "Needs review" and "Has misses"
// all require a record. Every node then reads "Ready" or "Not yet
// available", which is the honest zero state, not a bug. "Has misses"
// additionally needs an open-miss count the mastery endpoint does not report
// yet, so that chip stays unreachable even once records exist.

// Whether a prerequisite can be evaluated at all.
//
// The IA doc defines Locked as "at least one prerequisite is below the
// mastery threshold". The mastery endpoint exists now, but gating stays off,
// because "not yet attempted" is not the same fact as "below threshold" and
// treating it as one would lock almost the whole program: the graph chains
// nodes within a unit and units within a course, so exactly one node (the
// very first) has no prerequisites, and a fresh account would see one
// openable row. A map of the whole program with one openable row is not a
// map.
//
// Both branches below are live and typechecked: set this to true once there
// is a product decision on how an unattempted prerequisite should gate, and
// the Locked chip, the "Unlocks after" sentence and the suppressed entry all
// switch on for the whole page at once.
const PREREQUISITES_ARE_EVALUATED: boolean = false;

// -------------------------------------------------------------------------
// Node state
// -------------------------------------------------------------------------

type NodeState =
  | 'unavailable'
  | 'locked'
  | 'ready'
  | 'in-progress'
  | 'mastered'
  | 'needs-review'
  | 'has-misses';

// Every chip carries text. Colour is never the only carrier of state, which
// is a WCAG 2.1 AA requirement and not a preference.
const STATE_LABEL: Record<NodeState, string> = {
  unavailable: 'Not yet available',
  locked: 'Locked',
  ready: 'Ready',
  'in-progress': 'In progress',
  mastered: 'Mastered',
  'needs-review': 'Needs review',
  'has-misses': 'Has misses',
};

const STATE_TONE: Record<
  NodeState,
  'green' | 'red' | 'amber' | 'neutral' | 'brand'
> = {
  unavailable: 'neutral',
  locked: 'neutral',
  ready: 'brand',
  'in-progress': 'amber',
  mastered: 'green',
  'needs-review': 'amber',
  'has-misses': 'red',
};

// The order the filter row offers them: the two highest value actions first
// once they can happen, then the ordinary progression.
const FILTER_STATES: NodeState[] = [
  'has-misses',
  'needs-review',
  'ready',
  'in-progress',
  'mastered',
  'locked',
  'unavailable',
];

// Which of a node's prerequisites are not yet mastered.
//
// Only consulted when PREREQUISITES_ARE_EVALUATED is on. It is also what the
// "Unlocks after" sentence names, so the chip and the sentence can never
// disagree about which prerequisites are doing the blocking.
function blockingPrerequisites(
  node: CurriculumNode,
  mastery: MasteryIndex,
): string[] {
  return node.prerequisites.filter((code) => {
    const record = mastery[code];
    return !record || record.state !== 'mastered';
  });
}

// The one place that decides what state a node is in. One state per node,
// mutually exclusive, highest priority first.
function nodeState(node: CurriculumNode, mastery: MasteryIndex): NodeState {
  // A node with no lesson behind it cannot be in any of the other states, and
  // it must never look ready and then open to nothing.
  if (!node.authored) {
    return 'unavailable';
  }
  const record = mastery[node.code];
  if (record) {
    if (record.state === 'mastered') {
      return 'mastered';
    }
    if (record.state === 'needs_review') {
      return 'needs-review';
    }
    if (record.state === 'in_progress') {
      return 'in-progress';
    }
    // record.state is 'ready': a row exists but holds no attempts, which is
    // the same fact as no row at all. Fall through.
  }
  if (
    PREREQUISITES_ARE_EVALUATED &&
    blockingPrerequisites(node, mastery).length > 0
  ) {
    return 'locked';
  }
  // The lesson exists and nothing measured stands in front of it. That is what
  // Ready asserts, and it is true.
  return 'ready';
}

// The states that cannot currently occur, named once so the empty state can
// say why a filter found nothing instead of implying the program simply has
// no such node. Which states those are depends on whether any mastery has
// been recorded yet.
function unreachableStates(masteryEmpty: boolean): string {
  if (masteryEmpty) {
    return PREREQUISITES_ARE_EVALUATED
      ? 'in progress, mastered, needs review or has misses'
      : 'locked, in progress, mastered, needs review or has misses';
  }
  return PREREQUISITES_ARE_EVALUATED ? 'has misses' : 'locked or has misses';
}

// Locked is the only state that suppresses entry, because the teaching model
// sequences content rather than hiding it. Unauthored is not a lock, it is an
// absence, and it suppresses entry for the different reason that there is
// nothing on the other side of the link.
function isEnterable(state: NodeState): boolean {
  return state !== 'locked' && state !== 'unavailable';
}

// -------------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------------

// Ids from the API are safe enough, but aria-controls has to resolve, so any
// character that could not appear in an id is replaced rather than trusted.
function domId(prefix: string, raw: string): string {
  return `${prefix}-${raw.replace(/[^A-Za-z0-9_-]/g, '-')}`;
}

function plural(count: number, one: string, many: string): string {
  return count === 1 ? one : many;
}

interface NodeView {
  node: CurriculumNode;
  state: NodeState;
}

interface UnitView {
  unit: CurriculumUnit;
  nodes: NodeView[];
  // How many nodes the unit holds in total, before any search or filter.
  total: number;
  mastered: number;
}

interface CourseView {
  course: CurriculumCourse;
  units: UnitView[];
  // Totals for the whole course, before any search or filter.
  nodeTotal: number;
  unitTotal: number;
  mastered: number;
}

// -------------------------------------------------------------------------
// Page
// -------------------------------------------------------------------------

export default function LearnPage() {
  const [data, setData] = useState<CurriculumNodes | null>(null);
  const [mastery, setMastery] = useState<MasteryIndex>({});
  const [masteryFailed, setMasteryFailed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState('');
  const [stateFilter, setStateFilter] = useState<NodeState | 'all'>('all');
  const [instructorView, setInstructorView] = useState(false);

  // Expansion is stored as overrides, not as the whole open set, so the
  // default (first course, first unit) needs no seeding pass once data lands
  // and a search can open everything without destroying what the learner
  // chose.
  const [courseOverride, setCourseOverride] = useState<Record<string, boolean>>(
    {},
  );
  const [unitOverride, setUnitOverride] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Mastery is an overlay on the map, not the map. If it cannot be
        // loaded the tree still renders, with the failure stated rather than
        // mistaken for a learner who simply has no attempts.
        const [result, masteryMap] = await Promise.all([
          getCurriculumNodes(),
          getMasteryMap().catch(() => null),
        ]);
        if (!cancelled) {
          setData(result);
          if (masteryMap) {
            setMastery(masteryMap.nodes);
          } else {
            setMasteryFailed(true);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(errorMessage(err));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Every node's state, computed once. Node rows, the filter and the counts
  // all read from here so they cannot disagree.
  const states = useMemo(() => {
    const map = new Map<string, NodeState>();
    for (const node of data?.nodes ?? []) {
      map.set(node.code, nodeState(node, mastery));
    }
    return map;
  }, [data, mastery]);

  // Prerequisites arrive as codes. A learner is never shown a code, so every
  // one of them has to be resolved to a title before it can be rendered.
  const byCode = useMemo(() => {
    const map = new Map<string, CurriculumNode>();
    for (const node of data?.nodes ?? []) {
      map.set(node.code, node);
    }
    return map;
  }, [data]);

  const needle = query.trim().toLowerCase();
  const filterActive = needle !== '' || stateFilter !== 'all';

  const views = useMemo<CourseView[]>(() => {
    const out: CourseView[] = [];
    for (const course of data?.courses ?? []) {
      const units: UnitView[] = [];
      let nodeTotal = 0;
      let mastered = 0;

      for (const unit of course.units ?? []) {
        const all = unit.nodes ?? [];
        nodeTotal += all.length;

        let unitMastered = 0;
        const kept: NodeView[] = [];
        for (const node of all) {
          const state = states.get(node.code) ?? nodeState(node, mastery);
          if (state === 'mastered') {
            unitMastered += 1;
          }
          const matchesText =
            needle === '' ||
            node.title.toLowerCase().includes(needle) ||
            node.description.toLowerCase().includes(needle);
          const matchesState = stateFilter === 'all' || state === stateFilter;
          if (matchesText && matchesState) {
            kept.push({ node, state });
          }
        }
        mastered += unitMastered;

        if (kept.length > 0 || !filterActive) {
          units.push({
            unit,
            nodes: kept,
            total: all.length,
            mastered: unitMastered,
          });
        }
      }

      if (units.length > 0 || !filterActive) {
        out.push({
          course,
          units,
          nodeTotal,
          unitTotal: (course.units ?? []).length,
          mastered,
        });
      }
    }
    return out;
  }, [data, states, mastery, needle, stateFilter, filterActive]);

  const totalNodes = data?.nodes.length ?? 0;
  const totalMastered = useMemo(() => {
    let n = 0;
    states.forEach((state) => {
      if (state === 'mastered') {
        n += 1;
      }
    });
    return n;
  }, [states]);
  const totalAuthored = useMemo(
    () => (data?.nodes ?? []).filter((n) => n.authored).length,
    [data],
  );
  const shownNodes = views.reduce(
    (sum, view) => sum + view.units.reduce((s, u) => s + u.nodes.length, 0),
    0,
  );

  // The sentence under the mastered counter, chosen to state what is actually
  // known: a failed fetch is not the same fact as an account with no
  // attempts, and neither is a recorded count.
  const masteryEmpty = Object.keys(mastery).length === 0;

  // Program shape, before any search or filter. These are properties of the
  // curriculum rather than of what is currently on screen, so a filtered view
  // still reports the whole program - a stat row that moved with the search
  // box would be reporting the search box.
  const totalCourses = data?.courses.length ?? 0;
  const totalUnits = useMemo(
    () => (data?.courses ?? []).reduce((n, c) => n + c.units.length, 0),
    [data],
  );
  const totalChapters = useMemo(
    () => (data?.nodes ?? []).filter((n) => n.has_chapter).length,
    [data],
  );
  const masteryNote = masteryFailed
    ? 'The mastery record could not be loaded, so nothing is counted and every authored node reads Ready.'
    : masteryEmpty
      ? 'No practice attempts are recorded yet, so this counts nothing rather than estimating.'
      : 'Counted from your graded practice attempts.';

  // Changing what is being searched or filtered resets expansion, so a unit
  // the learner closed earlier cannot swallow a result they just asked for.
  function changeQuery(value: string) {
    setQuery(value);
    setCourseOverride({});
    setUnitOverride({});
  }

  function changeFilter(value: NodeState | 'all') {
    setStateFilter(value);
    setCourseOverride({});
    setUnitOverride({});
  }

  function courseOpen(course: CurriculumCourse, index: number): boolean {
    const chosen = courseOverride[course.id];
    if (chosen !== undefined) {
      return chosen;
    }
    return filterActive ? true : index === 0;
  }

  function unitOpen(
    unit: CurriculumUnit,
    unitIndex: number,
    courseIndex: number,
  ): boolean {
    const chosen = unitOverride[unit.id];
    if (chosen !== undefined) {
      return chosen;
    }
    if (filterActive) {
      return true;
    }
    return courseIndex === 0 && unitIndex === 0;
  }

  return (
    <Page>
      <PageHeader
        title="Learn"
        lead={
          totalNodes
            ? `${totalCourses} courses, ${totalUnits} chapters, ${totalNodes} nodes. Open a chapter to read it.`
            : 'The whole program, by course and chapter.'
        }
      />

      {/* The record for this surface. `authored` and `has_chapter` are
          different numbers and are shown as such: every node carries the six
          part arc, far fewer carry the reading around it, and reporting only
          the larger one would overstate the course by a factor of forty. */}
      {!loading && !error && totalNodes > 0 && (
        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat
            icon={<BookOpen className="h-3.5 w-3.5" />}
            label="Full chapters"
            value={`${totalChapters}/${totalNodes}`}
            hint="the rest carry the six part arc"
          />
          <Stat
            icon={<Layers className="h-3.5 w-3.5" />}
            label="Chapters"
            value={String(totalUnits)}
            hint={`across ${totalCourses} courses`}
          />
          <Stat
            icon={<FileText className="h-3.5 w-3.5" />}
            label="Lessons written"
            value={`${totalAuthored}/${totalNodes}`}
            hint={totalAuthored === totalNodes ? 'every node' : 'the map is larger than the content'}
          />
          <Stat
            icon={<GraduationCap className="h-3.5 w-3.5" />}
            label="Mastered"
            value={masteryEmpty ? '\u2014' : `${totalMastered}/${totalNodes}`}
            hint={masteryEmpty ? 'no graded attempts yet' : 'from graded attempts'}
          />
        </div>
      )}

      {loading && <LoadingPanel label="Loading the curriculum." />}
      {!loading && error && <ErrorPanel message={error} />}

      {!loading && !error && totalNodes === 0 && (
        <EmptyState
          title="No nodes to show"
          detail="The curriculum endpoint returned an empty program. Nothing is being shown in its place."
        />
      )}

      {!loading && !error && totalNodes > 0 && (
        <>
          <Controls
            query={query}
            onQuery={changeQuery}
            stateFilter={stateFilter}
            onFilter={changeFilter}
            instructorView={instructorView}
            onInstructorView={setInstructorView}
            totalNodes={totalNodes}
            totalMastered={totalMastered}
            totalAuthored={totalAuthored}
            masteryNote={masteryNote}
            filterActive={filterActive}
            shownNodes={shownNodes}
          />

          {views.length === 0 ? (
            <EmptyState
              title="Nothing matches"
              detail={
                masteryEmpty
                  ? `No node in the program matches that search and state. No practice attempts are recorded yet, so no node can read as ${unreachableStates(true)}.`
                  : `No node in the program matches that search and state. Prerequisite locks and open misses are not reported yet, so no node can read as ${unreachableStates(false)}.`
              }
            />
          ) : (
            <div className="mt-8 space-y-8">
              {views.map((view, courseIndex) => (
                <CourseSection
                  key={view.course.id}
                  view={view}
                  open={courseOpen(view.course, courseIndex)}
                  onToggle={() =>
                    setCourseOverride((prev) => ({
                      ...prev,
                      [view.course.id]: !courseOpen(view.course, courseIndex),
                    }))
                  }
                  isUnitOpen={(unit, unitIndex) =>
                    unitOpen(unit, unitIndex, courseIndex)
                  }
                  onToggleUnit={(unit, unitIndex) =>
                    setUnitOverride((prev) => ({
                      ...prev,
                      [unit.id]: !unitOpen(unit, unitIndex, courseIndex),
                    }))
                  }
                  byCode={byCode}
                  mastery={mastery}
                  instructorView={instructorView}
                  filterActive={filterActive}
                />
              ))}
            </div>
          )}
        </>
      )}
    </Page>
  );
}

// -------------------------------------------------------------------------
// Controls
// -------------------------------------------------------------------------

function Controls({
  query,
  onQuery,
  stateFilter,
  onFilter,
  instructorView,
  onInstructorView,
  totalNodes,
  totalMastered,
  totalAuthored,
  masteryNote,
  filterActive,
  shownNodes,
}: {
  query: string;
  onQuery: (value: string) => void;
  stateFilter: NodeState | 'all';
  onFilter: (value: NodeState | 'all') => void;
  instructorView: boolean;
  onInstructorView: (value: boolean) => void;
  totalNodes: number;
  totalMastered: number;
  totalAuthored: number;
  masteryNote: string;
  filterActive: boolean;
  shownNodes: number;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full sm:max-w-sm">
          <label
            htmlFor="learn-search"
            className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          >
            Search nodes
          </label>
          <input
            id="learn-search"
            type="search"
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            placeholder="Search titles and descriptions"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="text-sm sm:text-right">
          <p className="font-semibold tabular-nums text-card-foreground">
            {totalMastered} of {totalNodes} nodes mastered
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {masteryNote} {totalAuthored} of {totalNodes}{' '}
            {plural(totalNodes, 'node has', 'nodes have')} a lesson written.
            {PREREQUISITES_ARE_EVALUATED
              ? ''
              : ' Prerequisite gating is off, so nothing reads as locked.'}
          </p>
        </div>
      </div>

      <fieldset className="mt-4 border-t border-border pt-4">
        <legend className="sr-only">Filter nodes by state</legend>
        <p
          aria-hidden="true"
          className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
        >
          Filter by state
        </p>
        <div className="flex flex-wrap gap-2">
          <FilterButton
            label="All states"
            pressed={stateFilter === 'all'}
            onClick={() => onFilter('all')}
          />
          {FILTER_STATES.map((state) => (
            <FilterButton
              key={state}
              label={STATE_LABEL[state]}
              pressed={stateFilter === state}
              onClick={() => onFilter(state)}
            />
          ))}
        </div>
      </fieldset>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <div className="flex items-center gap-2">
          <input
            id="instructor-view"
            type="checkbox"
            checked={instructorView}
            onChange={(event) => onInstructorView(event.target.checked)}
            className="h-4 w-4 rounded border-border text-brand-600 focus:ring-2 focus:ring-brand-500"
          />
          <label htmlFor="instructor-view" className="text-sm">
            Instructor view
          </label>
          <span className="text-xs text-muted-foreground">
            adds textbook chapter mapping and node ids
          </span>
        </div>

        {filterActive && (
          <p aria-live="polite" className="text-sm text-muted-foreground">
            {shownNodes} {plural(shownNodes, 'node matches', 'nodes match')}
          </p>
        )}
      </div>
    </div>
  );
}

function FilterButton({
  label,
  pressed,
  onClick,
}: {
  label: string;
  pressed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={[
        'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
        pressed
          ? 'border-brand-600 bg-brand-600 text-white'
          : 'border-border bg-background text-muted-foreground hover:text-foreground',
      ].join(' ')}
    >
      {label}
    </button>
  );
}

// -------------------------------------------------------------------------
// Course
// -------------------------------------------------------------------------

function CourseSection({
  view,
  open,
  onToggle,
  isUnitOpen,
  onToggleUnit,
  byCode,
  mastery,
  instructorView,
  filterActive,
}: {
  view: CourseView;
  open: boolean;
  onToggle: () => void;
  isUnitOpen: (unit: CurriculumUnit, unitIndex: number) => boolean;
  onToggleUnit: (unit: CurriculumUnit, unitIndex: number) => void;
  byCode: Map<string, CurriculumNode>;
  mastery: MasteryIndex;
  instructorView: boolean;
  filterActive: boolean;
}) {
  const { course } = view;
  const buttonId = domId('course-button', course.id);
  const panelId = domId('course-panel', course.id);
  const noteId = domId('course-continue-note', course.id);

  return (
    <section className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold">
            <button
              type="button"
              id={buttonId}
              aria-expanded={open}
              aria-controls={panelId}
              onClick={onToggle}
              className="flex items-center gap-2 rounded-md text-left text-card-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              {open ? (
                <ChevronDown aria-hidden="true" className="h-5 w-5 shrink-0" />
              ) : (
                <ChevronRight aria-hidden="true" className="h-5 w-5 shrink-0" />
              )}
              <span>{course.title}</span>
            </button>
          </h2>
          <p className="mt-1 pl-7 text-sm text-muted-foreground">
            {course.semester}
          </p>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 pl-7 text-sm text-muted-foreground">
            <span className="tabular-nums">
              {view.unitTotal} {plural(view.unitTotal, 'unit', 'units')}
            </span>
            <span className="tabular-nums">
              {view.nodeTotal} {plural(view.nodeTotal, 'node', 'nodes')}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MasteryRing
                mastered={view.mastered}
                total={view.nodeTotal}
                size={22}
              />
              <span className="tabular-nums">
                {view.mastered} of {view.nodeTotal} mastered
              </span>
            </span>
          </p>
        </div>

        {/* The IA asks for a continue button driven by the adaptive picker.
            No picker is wired to this page, so the control is present and
            disabled with the reason stated. Rendering a recommendation this
            page cannot compute would be inventing one. */}
        <div className="shrink-0 sm:text-right">
          <button
            type="button"
            disabled
            aria-describedby={noteId}
            className="cursor-not-allowed rounded-lg border border-border bg-muted px-4 py-2 text-sm font-medium text-muted-foreground"
          >
            Continue
          </button>
          <p
            id={noteId}
            className="mt-1 max-w-[16rem] text-xs text-muted-foreground"
          >
            Continue needs the adaptive picker, which is not connected to this
            page yet.
          </p>
        </div>
      </div>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!open}
        className="border-t border-border px-5 pb-5"
      >
        {view.units.length === 0 ? (
          <p className="py-4 text-sm text-muted-foreground">
            This course has no units.
          </p>
        ) : (
          <div
            className={
              filterActive
                ? 'space-y-3 pt-4'
                : 'grid gap-3 pt-4 md:grid-cols-2 xl:grid-cols-3'
            }
          >
            {view.units.map((unitView, unitIndex) => (
              <UnitSection
                key={unitView.unit.id}
                view={unitView}
                open={isUnitOpen(unitView.unit, unitIndex)}
                onToggle={() => onToggleUnit(unitView.unit, unitIndex)}
                byCode={byCode}
                mastery={mastery}
                instructorView={instructorView}
                filterActive={filterActive}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// -------------------------------------------------------------------------
// Unit
// -------------------------------------------------------------------------

function UnitSection({
  view,
  open,
  onToggle,
  byCode,
  mastery,
  instructorView,
  filterActive,
}: {
  view: UnitView;
  open: boolean;
  onToggle: () => void;
  byCode: Map<string, CurriculumNode>;
  mastery: MasteryIndex;
  instructorView: boolean;
  filterActive: boolean;
}) {
  const { unit } = view;
  const buttonId = domId('unit-button', unit.id);
  const panelId = domId('unit-panel', unit.id);

  // How much of this chapter is written, which is the fact a learner most
  // wants before opening it. `withChapter` counts nodes carrying the reading -
  // sections, figures, tables - and is a much smaller number than the nodes
  // carrying a lesson. They are reported separately rather than summed.
  const withChapter = view.nodes.filter((n) => n.node.has_chapter).length;
  const parts = unit.parts ?? [];

  // Opening a chapter means opening its first enterable node. A node with no
  // lesson behind it must never be the landing target, so the fallback walks
  // to the first authored one and only then to the first node at all.
  const landing =
    view.nodes.find((n) => n.node.has_chapter) ??
    view.nodes.find((n) => n.node.authored) ??
    view.nodes[0];
  const openHref = landing
    ? `/learn/${encodeURIComponent(landing.node.code)}`
    : '/learn';

  return (
    <div
      className={`flex flex-col rounded-xl border bg-card p-4 shadow-sm transition-colors ${
        withChapter > 0
          ? 'border-brand-500/60 hover:border-brand-500'
          : 'border-border hover:border-border/80'
      }`}
    >
      {filterActive ? (
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-start gap-2 rounded-md text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          {open ? (
            <ChevronDown aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          )}
          <h3 className="min-w-0 flex-1 text-sm font-semibold leading-snug text-card-foreground">
            <span className="mr-1.5 tabular-nums text-muted-foreground">
              {unit.index}.
            </span>
            {unit.title}
          </h3>
          <MasteryRing mastered={view.mastered} total={view.total} size={20} />
        </button>
      ) : (
        <Link
          href={openHref}
          className="flex w-full items-start gap-2 rounded-md text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <h3 className="min-w-0 flex-1 text-sm font-semibold leading-snug text-card-foreground">
            <span className="mr-1.5 tabular-nums text-muted-foreground">
              {unit.index}.
            </span>
            {unit.title}
          </h3>
          <MasteryRing mastered={view.mastered} total={view.total} size={20} />
        </Link>
      )}

      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        {withChapter > 0 && (
          <span className="rounded bg-brand-500/12 px-1.5 py-0.5 text-[11px] font-medium text-brand-700 dark:text-brand-300">
            {withChapter} full {plural(withChapter, 'chapter', 'chapters')}
          </span>
        )}
        {/* The lettered sub-parts, where the chapter has them. Summarised as a
            range on the card and listed in full when it is opened. */}
        {parts.length > 0 && (
          <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
            parts {parts[0].part}&ndash;{parts[parts.length - 1].part}
          </span>
        )}
        <span className="font-mono text-[11px] text-muted-foreground">
          {filterActive
            ? `${view.nodes.length}/${view.total} nodes`
            : `${view.total} ${plural(view.total, 'node', 'nodes')}`}
        </span>
        {/* The textbook chapter mapping is what makes a syllabus conversation
            possible in an adoption call, and noise for a student. Instructor
            view only. */}
        {instructorView && unit.chapters && (
          <Pill tone="neutral">{unit.chapters}</Pill>
        )}
      </div>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!filterActive || !open}
        className="mt-3 border-t border-border pt-3"
      >
        {view.nodes.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            This chapter has no nodes to show.
          </p>
        ) : (
          <div className="space-y-3">
            {groupByPart(view.nodes).map((group, gi) => (
              <div key={gi}>
                {/* The lettered sub-parts of a chapter. These were requested
                    when the organic courses were rechaptered, they have been
                    in curriculum.json ever since, and until now nothing
                    rendered them - so a chapter with six parts looked exactly
                    like a chapter with none. */}
                {group.part && (
                  <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
                    Part {group.part}
                  </h4>
                )}
                <ul className="space-y-2">
                  {group.nodes.map((nodeView) => (
                    <li key={nodeView.node.code}>
                      <NodeRow
                        node={nodeView.node}
                        state={nodeView.state}
                        byCode={byCode}
                        mastery={mastery}
                        instructorView={instructorView}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Split a unit's nodes into runs of consecutive nodes sharing a sub-part.
 *
 * Runs, not a keyed group-by, because curriculum order is the teaching order
 * and a group-by would silently reorder a chapter whose parts were not
 * contiguous. If a part ever appears twice it will render twice, which is
 * visible and therefore fixable, rather than being merged into one block that
 * hides the error.
 */
function groupByPart(
  nodes: NodeView[],
): { part: string | null; nodes: NodeView[] }[] {
  const out: { part: string | null; nodes: NodeView[] }[] = [];
  for (const nv of nodes) {
    const part = nv.node.part ?? null;
    const last = out[out.length - 1];
    if (last && last.part === part) last.nodes.push(nv);
    else out.push({ part, nodes: [nv] });
  }
  return out;
}

// -------------------------------------------------------------------------
// Node
// -------------------------------------------------------------------------

// A node row carries four things and nothing else: number and title, one
// state chip, a mastery bar for anything that is not locked, and an icon row
// of at most two icons. The description, the prerequisite list and the
// authoring tags are all deliberately absent. A locked node adds the one
// sentence that says what unlocks it, which is the only way a lock is
// actionable rather than a dead end.
function NodeRow({
  node,
  state,
  byCode,
  mastery,
  instructorView,
}: {
  node: CurriculumNode;
  state: NodeState;
  byCode: Map<string, CurriculumNode>;
  mastery: MasteryIndex;
  instructorView: boolean;
}) {
  const enterable = isEnterable(state);
  const record = mastery[node.code];

  const body = (
    <>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="min-w-0 flex-1 text-[15px] font-medium text-card-foreground">
          <span className="mr-2 tabular-nums text-muted-foreground">
            {node.number}
          </span>
          {node.title}
        </span>
        {/* A node with lecture-note depth around its arc. Distinct from
            "authored", which every node is: this says the chapter - sections,
            figures, tables, an explainer - has been written. 7 of 325 so far,
            so the badge marks the exception rather than the rule, which is the
            honest way round. */}
        {node.has_chapter && (
          <Pill tone="brand">
            <BookOpen aria-hidden="true" className="mr-1 inline h-3 w-3" />
            full chapter
          </Pill>
        )}
        <Pill tone={STATE_TONE[state]}>{STATE_LABEL[state]}</Pill>
        <NodeIcons node={node} />
      </div>

      {state !== 'locked' && state !== 'unavailable' && (
        <MasteryBar record={record} />
      )}

      {state === 'locked' && (
        <UnlockSentence
          codes={blockingPrerequisites(node, mastery)}
          byCode={byCode}
        />
      )}

      {/* Node ids are the stable key for links, lesson files and items. They
          are never shown to a learner and appear here only when the instructor
          view is on, where they are what an author needs to find the file. */}
      {instructorView && (
        <p className="mt-2 font-mono text-xs text-muted-foreground">
          {node.code}
        </p>
      )}
    </>
  );

  if (!enterable) {
    return (
      <div
        className={[
          'rounded-xl border bg-background p-4',
          state === 'unavailable'
            ? 'border-dashed border-border'
            : 'border-border',
        ].join(' ')}
      >
        {body}
      </div>
    );
  }

  return (
    <Link
      href={`/learn/${encodeURIComponent(node.code)}`}
      className="block rounded-xl border border-border bg-background p-4 transition-colors hover:border-brand-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
    >
      {body}
    </Link>
  );
}

// At most two icons, each with a tooltip and a text equivalent. These replace
// the authoring tags that used to be printed as words. Johnstone triangle
// eligibility is not among them: it is an instruction to a content author, it
// means nothing to a student, and it surfaces inside the lesson as a view
// toggle where it is actually useful.
function NodeIcons({ node }: { node: CurriculumNode }) {
  const computational = node.kind === 'computational';
  if (!node.lab_adjacent && !computational) {
    return null;
  }
  return (
    <span className="flex shrink-0 items-center gap-2 text-muted-foreground">
      {node.lab_adjacent && (
        <span
          title="includes laboratory safety and technique"
          className="inline-flex items-center"
        >
          <FlaskConical aria-hidden="true" className="h-4 w-4" />
          <span className="sr-only">
            includes laboratory safety and technique
          </span>
        </span>
      )}
      {computational && (
        <span
          title="calculation practice"
          className="inline-flex items-center"
        >
          <Calculator aria-hidden="true" className="h-4 w-4" />
          <span className="sr-only">calculation practice</span>
        </span>
      )}
    </span>
  );
}

// The bar is decoration and the sentence beside it is the content. It draws
// the figure the server computed: a recency-weighted accuracy over this
// node's graded attempts, which is recent accuracy and not a completion
// percentage, so the sentence names it as accuracy. With no record the bar
// is empty and says so, rather than drawing a zero that reads like a
// measured result.
function MasteryBar({ record }: { record: NodeMasteryRecord | undefined }) {
  const attempted = record !== undefined && record.attempts > 0;
  const fraction = attempted
    ? Math.min(Math.max(record.accuracy_ewma, 0), 1)
    : 0;
  const percent = Math.round(fraction * 100);
  return (
    <div className="mt-3 flex items-center gap-2">
      <span
        aria-hidden="true"
        className="h-1.5 w-32 overflow-hidden rounded-full bg-muted"
      >
        <span
          className="block h-full rounded-full bg-brand-500"
          style={{ width: `${percent}%` }}
        />
      </span>
      <span className="text-xs text-muted-foreground">
        {attempted
          ? `${percent} percent recent accuracy over ${record.attempts} ${
              record.attempts === 1 ? 'attempt' : 'attempts'
            }`
          : 'Mastery not recorded yet'}
      </span>
    </div>
  );
}

// One sentence naming the blocking prerequisites by title, each a link.
//
// This replaces the old prose line, which printed raw node ids. A learner
// cannot act on an id, and a graph rendered as sentences on every card is a
// graph nobody reads. A prerequisite with no lesson written yet is named but
// not linked, because linking it would lead nowhere.
function UnlockSentence({
  codes,
  byCode,
}: {
  codes: string[];
  byCode: Map<string, CurriculumNode>;
}) {
  const known: CurriculumNode[] = [];
  for (const code of codes) {
    const found = byCode.get(code);
    if (found) {
      known.push(found);
    }
  }

  if (known.length === 0) {
    return (
      <p className="mt-3 text-sm text-muted-foreground">
        Unlocks after an earlier node in the program.
      </p>
    );
  }

  const parts: React.ReactNode[] = [];
  known.forEach((prereq, index) => {
    if (index > 0) {
      parts.push(
        <span key={`sep-${prereq.code}`}>
          {index === known.length - 1 ? ' and ' : ', '}
        </span>,
      );
    }
    parts.push(
      prereq.authored ? (
        <Link
          key={prereq.code}
          href={`/learn/${encodeURIComponent(prereq.code)}`}
          className="font-medium text-brand-700 underline underline-offset-2 hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-brand-300"
        >
          {prereq.title}
        </Link>
      ) : (
        <span key={prereq.code} className="font-medium">
          {prereq.title}
        </span>
      ),
    );
  });

  return (
    <p className="mt-3 text-sm text-muted-foreground">
      Unlocks after {parts}.
    </p>
  );
}
