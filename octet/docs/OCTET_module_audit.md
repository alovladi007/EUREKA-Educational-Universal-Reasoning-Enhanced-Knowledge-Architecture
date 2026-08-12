# OCTET module audit

Every surface walked against the running stack, not read. Method is the one
used on the prep tests: enumerate what a page claims, find the thing that
would have to be true for the claim to hold, and check it.

Audited 2026-08-11 against octet-api on :8500 and octet-web on :4200, with a
real bearer token so authenticated routes actually answer.

## Summary

Ten surfaces. Nothing is a dead link and nothing calls an endpoint that does
not exist, which is better than the prep tests started. The problems are of a
different kind: one regression I introduced, one number that overstates, and a
large content gap the platform reports honestly but which the rechaptering
made visible in seven places.

| Surface | Backing data | Verdict |
|---|---|---|
| Dashboard | analytics/overview, exams, coverage | REAL, one overstated line |
| Learn | curriculum/nodes, lessons | REAL. Sub-parts not rendered |
| Practice | practice/catalogue, next, submit, hint | REAL. **7 of 46 units cannot supply** |
| Review | review-queue, srs/queue, srs/stats | REAL |
| Exams | exams, exams/attempts | REAL |
| Analytics | analytics/overview, analytics/mastery | REAL |
| Path | path | REAL |
| Planner | planner | REAL, needs a target date |
| Explore | molecules, periodic-table, triangle | REAL. 60 molecules, 44 triangle nodes |
| Simulations | simulations, simulations/poe/* | REAL |

## 1. The practice regression, introduced by the rechaptering

**Seven of forty-six units can supply no practice items at all.**

    ORG1-U5   Addition Reactions of Alkenes             6/6 nodes untemplated
    ORG1-U7   Cyclic Compounds                          4/4
    ORG1-U8   Noncovalent Intermolecular Interactions   6/6
    ORG2-U2   Ethers, Epoxides, Glycols and Sulfides    4/4
    ORG2-U3   Spectroscopy                              5/5
    ORG2-U14  Carbohydrates                             2/2
    ORG2-U15  Aromatic Heterocycles and Nucleic Acids   3/3

This is mine, and the mechanism is worth stating because it is not obvious.
Practice supply is a UNIT level property: a unit can serve items when at least
one of its nodes carries an item template. Only 125 of 325 nodes carry one, and
that was true before the rechaptering too. The old organic courses had ten
units each, coarse enough that every unit happened to contain at least one
templated node, so every unit could supply and the gate passed. Splitting into
nine and seventeen chapters isolated thirty nodes into seven chapters that
contain no templated node at all.

So the content gap is old. The seven blocked chapters are new, and they are a
direct consequence of a change I made.

**Correction to an earlier report.** I described this as "the 13 new nodes have
lessons but no item templates". That was true and badly incomplete. The real
figure is 200 of 325 nodes without a template program wide, and 30 nodes across
the seven chapters that are now unreachable for practice.

Fix: author templates for those 30 nodes. Each needs a generator, a grader
already in chem_core, a three rung hint ladder, and misconception keyed
distractors where the grader is multiple choice, then a 12 seed sweep with the
independent verifier. Templates are the expensive artifact in this platform and
that is the correct order of magnitude for the work.

## 2. The dashboard line that overstates

    39 of 39 listed exams are available to start now.

The exams endpoint does return 39. "Available to start now" is doing work the
data does not support: it reports that the catalogue lists them, not that each
one can assemble a full paper from templated nodes. Given only 125 nodes carry
templates, an exam drawing on the other 200 cannot fill itself.

This is the same class of defect as a prep test tile claiming a question bank
that is not there, and it should say what it means: how many are listed, and
separately how many can actually be assembled.

## 3. Learn sub-parts are in the data and not on the page

**FIXED 2026-08-11.** Chapters 4 and 5 of ORG1 and chapter 3 of ORG2 carry the
requested lettered parts.

The diagnosis in the original entry was wrong in one detail and it matters,
because it pointed at the wrong file. `part` and `parts` were in
curriculum.json, but they were never loaded: `Node` and `Unit` in
app/data/curriculum.py had no such fields, so `_load()` read the JSON and threw
those two keys away. The Learn page could not render what the API never sent.

Fixed at the loader (`Node.part`, `Unit.parts`), emitted by `node_row` and the
unit serialiser, and rendered by `groupByPart` in the Learn page and by the
chapter rail in the reader. The grouping is by consecutive run rather than a
keyed group-by, so a chapter whose parts were somehow non-contiguous renders
them twice and visibly, rather than being silently reordered into one block.

## 0. The design target, corrected twice

Recording this because the same mistake was made twice and the cost was real.

The instruction was to rebuild OCTET's surfaces to look like **the Patent Bar
prep test**. Both earlier attempts worked from an assumption about what that
meant instead of opening the module and reading it.

What the Patent Bar module actually is, having now read it:

    eureka/apps/web/src/components/test-prep/ExamDashboard.tsx
        resume hero -> four stat tiles -> entry grid -> evidence panels
        Card p-3.5, mono tabular values, group-hover:border-primary,
        em dash and a reason where there is no data

    eureka/apps/web/src/app/dashboard/test-prep/[exam]/page.tsx
        ONE page, a tab bar rather than a sidebar
        bg-muted p-1 rounded-lg, active tab bg-background shadow-sm
        Video Lessons | Flashcards | My Notes | QBank | MPEP | Full Exam |
        Analytics, with per-exam tabs appended

    .../[exam]/study
        the course reader: syllabus rail beside the text, media slot in the rail

Two specific corrections:

1. **The video slot takes uploaded files.** The videos are produced separately.
   An earlier version drove the panel with a computed SVG animation, which is a
   different product decision made without being asked for. Now a real <video>,
   see section 5.
2. **It is the whole module, not one page.** The dashboard is rebuilt. The nine
   other surfaces are not, and the sidebar is still a sidebar - matching the
   Patent Bar properly means collapsing it into a tab bar, which is an
   architecture change to every route.

## 3b. The chapter reader (added 2026-08-11)

The Learn surface was a map with no reading behind it: opening a node gave the
six part arc, about 400 words, and nothing else. That is the teaching, and it
is deliberately short, but it is not a chapter.

Built to the same shape as the prep test readers:

| Piece | Where it comes from |
|---|---|
| Numbered sections of prose | `app/data/extras_*.py`, KaTeX inline |
| Figures | generated in both themes by `scripts/gen_org1_ch1_figures.py` |
| Data tables | structured rows, every measured table carrying a source |
| Animated explainer + player | `components/chem-scenes.tsx`, computed per frame |
| Key takeaways, exam tips | authored per node |
| Chapter rail with sub-parts | curriculum, via the fix above |

Two constraints held. There is **no quiz on the page**: graded questions come
from the item templates through Practice, which grades server-side, and
rendering one here would ship its answer key to the browser. And the coverage
is reported as what it is - `has_chapter` is a separate field from `authored`,
because 7 nodes of 325 carry a chapter and 325 carry a lesson, and conflating
those two numbers would overstate the course by a factor of forty.

A node without a chapter says so, in those words, rather than rendering empty
section headings.

## 4. What is genuinely solid

Worth recording, because an audit that only lists faults misleads.

- No dead links, and every frontend call resolves to a real route.
- 325 of 325 nodes carry a lesson in the full six part arc.
- Coverage is stated honestly on the dashboard and per node on Learn: the map
  is deliberately larger than the content and says so, rather than hiding
  unauthored nodes or pretending they are ready.
- The Learn page refuses to fake state it does not have. "Continue needs the
  adaptive picker, which is not connected to this page yet" is exactly the
  right sentence to ship.
- Mastery is computed from graded attempts only. Three attempts and one correct
  reads as 33 percent, which is arithmetically honest on a tiny sample rather
  than a padded number.
- The review queue, SRS stats, path, planner, molecules, periodic table and
  triangle endpoints all return real data.

## 5. Video slots (added 2026-08-11)

Declared in the lesson data as a slug, resolved to
`/videos/octet/{slug}.mp4`, and served straight out of the web app's public
directory - the same convention the prep test videos use.

Slots are declared BEFORE the file exists, deliberately. The player renders its
full chrome over a "Video not uploaded yet" poster and disables rather than
hides the controls, so the panel does not change shape on upload day, and the
outstanding work stays a number instead of a feeling.

    python3 scripts/check_octet_videos.py

lists declared against present and prints the exact filenames wanted. It exits
0 with files missing, because a missing video is a normal state; it fails only
on two nodes claiming one slug, or a file in the directory that no lesson
references - which means a filename typo.

One bug worth recording, because the shape of it recurs. A slug always produces
a URL string, so `Boolean(src)` was always true and the poster branch never
ran: a learner saw a black rectangle with working-looking controls over a 404.
"Does this node declare a video" and "is there a file at that URL" are
different questions and only the first is answerable from props. The media
element's own error event answers the second.

## 6. Surface conversion — COMPLETE 2026-08-12

All ten surfaces now carry the module language (PageHeader, Stat, Entry, Band
from app/_ui/shell.tsx): Dashboard and Learn rebuilt in full, the chapter
reader rebuilt to the prep test /study layout, and Practice, Review, Exams,
Analytics, Path, Planner, Explore and Simulations converted - headers, stat
tiles on Analytics, Entry cards on Explore. Verified live across all eight in
one sweep, no console errors.

On the shell: kept as sidebar routes, deliberately. The prep test module
itself has 17 real routes and its tab bar is secondary (tabs only render once
one is chosen; content was moved OUT of tabs into /study to remove
duplication), so OCTET's routes are already the shape that module arrived at.

## 7. Request timeouts (added 2026-08-12)

Every API call from the web app now carries a 30 second deadline. Found the
hard way: a learner pressed "Start session" while a container was restarting
under the page, the fetch hung, and the button stayed on "Starting" forever
with no error - fetch has no default timeout. The deadline turns a hang into
an error message the page renders. The start flow is verified end to end by
driving the real UI: select three units, press start, land in the player with
an item on screen.

## Order of work

1. ~~Templates for the 30 nodes in the seven blocked chapters~~ **DONE.**
   46 of 46 units can supply practice again.
2. ~~The exams line~~ **RESOLVED, verified 2026-08-12.** The server computes
   `available` per exam from actual item coverage and the page marks
   unassemblable exams unavailable rather than hiding them. With practice
   supply repaired, the live endpoint reports 46 listed / 46 available, so
   the number is currently honest by measurement rather than by wording.
3. ~~Learn sub-part rendering~~ **DONE**, see section 3 above.
4. Templates for the remaining untemplated nodes, as a standing programme
   rather than a task: 200 nodes is many sessions of work.
5. Chapters for the remaining 318 nodes, likewise a programme. 7 are written.
   `scripts/check_octet_depth.py` is the gate and the progress number; it
   counts prose only, and it fails the build on a figure missing in either
   theme, a video naming a scene that does not exist, a ragged table, an
   unsourced table of numbers, or an unbalanced `$`.

## Measuring the chapter programme

    python3 scripts/check_octet_depth.py

Reports chapters, sections, prose words, figures, tables and explainers, and
lists every chapter still under the 1,200 word standard with the shortfall.

The word count deliberately excludes headings, captions, table cells and
takeaways. Those are real content, but they are cheap to produce in bulk, and a
progress number that includes them can be moved without writing anything. This
one measures only the expensive thing, which is the reason to trust it - and it
exists because the equivalent FE EE number was overstated once by counting
whole source blocks instead of prose.
