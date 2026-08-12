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

Chapters 4 and 5 of ORG1 and chapter 3 of ORG2 carry the requested lettered
parts. The curriculum emits `part` on each node and `parts` on the unit. The
Learn page does not read either, so the parts are invisible.

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

## Order of work

1. Templates for the 30 nodes in the seven blocked chapters, so every unit can
   supply practice again. This is the regression and it goes first.
2. The exams line, so it stops claiming assembly it cannot do.
3. Learn sub-part rendering.
4. Templates for the remaining untemplated nodes, as a standing programme
   rather than a task: 200 nodes is many sessions of work.
