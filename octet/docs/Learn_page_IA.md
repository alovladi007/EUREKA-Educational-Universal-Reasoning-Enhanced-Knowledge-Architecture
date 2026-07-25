# OCTET Learn page: information architecture

The curriculum was one problem. The page is the other. This document
specifies what the Learn surface renders and, as importantly, what it stops
rendering.

## What was wrong

1. One year of general chemistry was presented as three courses (Chemical
   Foundations, General Chemistry 1, General Chemistry 2). No registrar,
   syllabus or textbook is organized that way, so an instructor could not map
   a course onto it and a student could not tell where they were.
2. Sixty nodes rendered as one flat list. There were no units, no numbering,
   and no way to collapse anything, so the page had no shape at any zoom
   level.
3. Prerequisites rendered as prose ("Builds on: C.CF.DIMANAL, C.CF.SAFETY").
   A learner cannot act on a raw node id, and a graph rendered as sentences
   is a graph nobody can read.
4. Authoring metadata leaked into the learner view. The tags `triangle` and
   `lab adjacent` are instructions to content authors. They mean nothing to a
   student and they made every card look like it carried a warning.
5. Nothing showed state. Every node looked identical whether it was locked,
   available, in progress or mastered, which is the single most important
   thing an adaptive platform has to communicate.

## The hierarchy

Three levels, always, with the middle level collapsible:

    Course      GEN1 General Chemistry I          Year 1 semester 1
      Unit      3. Composition of Substances and Solutions
        Node    3.4  Empirical and molecular formulas

Numbering is positional and generated (unit index within course, node index
within unit). Node ids such as `GEN1.EMPIRICAL` remain the stable key for
links, items and lesson files, and are never displayed by default. They
appear in an instructor or author view only.

Default state of the page: courses listed, the learner's current course
expanded, that course's current unit expanded, every other unit collapsed to
a single row showing its title, node count and mastery ring.

## Node card

Each node row carries four things and nothing else:

- number and title
- a state chip (see below)
- a mastery bar for anything beyond locked
- an icon row, at most two icons, each with a tooltip

State chips, one per node, mutually exclusive:

| Chip           | Meaning                                                     |
|----------------|-------------------------------------------------------------|
| Locked         | at least one prerequisite is below the mastery threshold     |
| Ready          | prerequisites met, no attempts yet                           |
| In progress    | attempted, mastery below threshold                           |
| Mastered       | mastery at or above threshold                                |
| Needs review   | mastered previously, due for spaced review                   |
| Has misses     | open entries in the missed questions queue for this node     |

Locked is the only state that suppresses entry. Everything else is
clickable, because the teaching model does not hide content, it sequences it.

Icons replace the leaked text tags. `lab adjacent` becomes a small flask icon
with the tooltip "includes laboratory safety and technique". Johnstone
triangle eligibility is never shown as a tag at all; it shows up as a
"macroscopic, particulate, symbolic" view toggle inside the lesson, which is
where it is actually useful.

## Prerequisites

Remove the prose line. Replace with two affordances:

1. On a locked node, a single sentence naming only the blocking
   prerequisites by title, each one a link: "Unlocks after Molarity and
   Reaction stoichiometry."
2. A prerequisite graph view per unit, opened from the unit header. The
   program is a 312 node DAG and it is genuinely useful to look at, but it
   belongs behind a control, not inlined as sentences on every card.

Never render a raw node id to a learner in either affordance.

## Course and unit headers

Course header: title, semester label, overall mastery percentage, node count,
and a continue button that jumps to whatever the adaptive picker would serve
next, with the picker's plain language rationale beneath it ("you missed two
questions on limiting reactant, so we are practicing that first").

Unit header: number, title, mastery ring, node count, and the textbook
chapter mapping ("Ch 3") shown to instructors, hidden from students by
default. The chapter mapping is what makes syllabus alignment possible during
adoption conversations, so it needs to be visible in the instructor view and
exportable.

## Controls the page needs

- Search across node titles and descriptions.
- Filter by state, with "needs review" and "has misses" as one tap filters,
  since those two are the highest value actions on the page.
- A progress summary that reports mastered node count over total, not
  attempts made or time spent.
- Instructor mode: pin a subset of nodes as the assigned syllabus, which
  collapses everything else and drives the gradebook export.

## Accessibility requirements

These are not polish. Under the ADA Title II rule the WCAG 2.1 AA deadline
for essentially all public universities is April 26, 2027, and procurement
reviewers increasingly ask vendors to demonstrate the specific interactive
question types faculty assign rather than the platform shell. The Learn page
is the easiest surface in OCTET to get right, so it should be exemplary.

- Semantic headings: h1 page, h2 course, h3 unit. Node rows are a list, not a
  grid of divs.
- Every collapse control is a real button with aria-expanded.
- State is never communicated by colour alone. Each chip carries text.
- Mastery rings carry an accessible text equivalent ("7 of 9 mastered").
- Full keyboard traversal: course, unit, node, with no keyboard trap in the
  prerequisite graph view, and a text list alternative to the graph.
- Focus order matches visual order, and the continue button is reachable
  without traversing every node.

## Out of scope for this page

The Learn page is a map. It does not teach and it does not grade. Lessons,
items, hints, simulations and the review queue all live behind a node, not on
this surface. Resist adding them here.
