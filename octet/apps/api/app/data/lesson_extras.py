"""Lecture-note depth on top of the six part arc.

The arc in lesson_types.py is the pedagogy and it does not change. It is also
short by design: objective, build_on, core_idea, worked_example, try_it,
pitfall is roughly 400 words, which teaches one idea and does not carry a
chapter.

A chapter needs the things a textbook chapter has - numbered sections of real
prose, figures with captions, data tables, a callout where a rule has an edge
case, and a short list of what to take away. Those live here, hang off the same
node code, and are optional. A node with no extras still renders: it shows the
arc and says so. That is the same shape the prep test readers use, where a
lesson carries `sections`, `keyExamTips` and `keyTakeaways` beside its body.

Three rules this file inherits from the platform and does not get to bend.

  1. No invented data. A table of pKa values carries real pKa values or it does
     not ship. Every figure is generated from the structure it claims to draw.
  2. Structural assertions are claims. If a reading section states a formula, a
     configuration or an isomer relationship, that assertion belongs in the
     lesson's `claims` tuple where RDKit re-derives it, exactly as the arc's
     prose already must.
  3. No answer key reaches the client before submission. There is deliberately
     no quiz field here. Check-your-understanding questions come from the item
     templates through the practice endpoints, which grade on the server.

Figures are referenced by stem, not by path. `bonding-orbital-overlap` resolves
to /figures/octet/bonding-orbital-overlap-light.svg and -dark.svg, and the
depth gate fails when either file is missing. That is the same theme-pair
convention the FE EE figures use, and it exists because a single figure drawn
in black ink disappears on a dark ground.
"""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(frozen=True)
class Figure:
    """A generated diagram, present in both themes.

    `stem` is the filename stem under /figures/octet/. The generator script
    writes {stem}-light.svg and {stem}-dark.svg from one drawing function, so
    the two can never drift apart in content.
    """

    stem: str
    caption: str
    alt: str


@dataclass(frozen=True)
class Table:
    """A data table.

    Held as structured rows rather than a markdown string so the depth gate can
    count columns, and so a future consumer that is not a web page - an export,
    a print sheet - does not have to parse pipes.

    `source` names where the numbers come from and is required when the table
    carries measured quantities. A table of bond lengths without a source is a
    table of invented data wearing a lab coat.
    """

    caption: str
    columns: tuple[str, ...]
    rows: tuple[tuple[str, ...], ...]
    source: str = ""
    note: str = ""


@dataclass(frozen=True)
class ReadingSection:
    """One numbered section of the chapter.

    `body` is markdown with KaTeX between $ delimiters, the same dialect the
    prep test readers render. It is prose: a section that is a bare list of
    bullet points is a summary, and the depth gate counts words to say so.
    """

    id: str
    heading: str
    body: str
    figure: Figure | None = None
    table: Table | None = None
    # A callout. Used where a rule has a boundary the prose would otherwise
    # bury: "this holds for kinetic control only", "the exception is fluorine".
    important: str = ""


@dataclass(frozen=True)
class VideoLesson:
    """The video lesson for a node.

    `slug` resolves to /videos/octet/{slug}.mp4 in the web app's public
    directory, which is the same convention the prep test videos use. The
    videos are produced separately and uploaded; declaring the slug here is
    what reserves the slot, and the player renders its full chrome over a
    "not uploaded yet" poster until the file exists.

    That ordering is deliberate. The alternative - only declaring a video once
    its file lands - means the reader's layout changes shape on upload day and
    nobody can count what is outstanding. Declaring first makes the gap a
    number: scripts/check_octet_videos.py reports declared against present.
    """

    slug: str
    title: str
    # Runtime in seconds, once known. 0 until the file is in hand; the player
    # reads the real duration off the media element anyway, so this is for
    # planning rather than display.
    seconds: int = 0
    # What the video covers. Shown beside the player, and the description for
    # anyone who cannot watch it.
    summary: str = ""


@dataclass(frozen=True)
class LessonExtras:
    """Everything a chapter has that a single lesson does not."""

    node: str
    # A one paragraph opening, before section 1. The prep test readers call
    # this the lead and it does the job an abstract does: says what the chapter
    # is about so the reader can decide to read it.
    lead: str = ""
    sections: tuple[ReadingSection, ...] = ()
    key_takeaways: tuple[str, ...] = ()
    # Where the topic shows up on the MCAT and what form it takes there.
    # Empty for nodes that are taught because the chemistry needs them rather
    # than because the exam asks for them, which is a real category.
    exam_tips: tuple[str, ...] = ()
    video: VideoLesson | None = None
    # Further reading, as (label, href). External links only where the target
    # is stable and free; a paywalled reference is not a resource.
    further: tuple[tuple[str, str], ...] = field(default_factory=tuple)

    def word_count(self) -> int:
        """Words of actual prose, which is what the depth gate measures.

        Counts the lead and the section bodies. Deliberately excludes headings,
        captions, table cells and takeaways: those are real content but they
        are cheap to produce in bulk, and a word count that includes them can
        be inflated without writing anything. Measure the expensive thing.
        """
        words = len(self.lead.split())
        for section in self.sections:
            words += len(section.body.split())
        return words

    def reading_minutes(self, arc_words: int = 0) -> int:
        """Time to actually study the whole chapter page, at 200 wpm prose.

        The old version counted only lead + section bodies, which produced
        the same '7 min' on every chapter because the word floor makes the
        prose lengths similar - a uniform number that read as hardcoded and
        undersold the page. This version counts what the reader renders:

          - the six-part arc (passed in as arc_words, since the arc lives
            on the Lesson, not here), lead, section bodies, callouts,
            takeaways and exam tips, all at 200 words per minute;
          - tables at 5 seconds per row plus the caption at reading speed,
            because scanning a data row is slower than reading its words;
          - figures at 40 seconds each - the standard study-time estimate
            for a diagram the text argues from, not decoration glanced at.

        Rounded up; floored at 1 for any non-empty chapter.
        """
        words = arc_words + self.word_count()
        for section in self.sections:
            words += len(section.important.split())
            if section.table is not None:
                words += len(section.table.caption.split())
        words += sum(len(t.split()) for t in self.key_takeaways)
        words += sum(len(t.split()) for t in self.exam_tips)
        if words == 0 and not self.figures():
            return 0
        seconds = words * 60 / 200
        seconds += sum(len(s.table.rows) for s in self.sections
                       if s.table is not None) * 5
        seconds += len(self.figures()) * 40
        return max(1, -(-int(seconds) // 60))

    def figures(self) -> list[Figure]:
        return [s.figure for s in self.sections if s.figure is not None]

    def tables(self) -> list[Table]:
        return [s.table for s in self.sections if s.table is not None]


def as_payload(extras: LessonExtras | None, arc_words: int = 0) -> dict | None:
    """Serialise for the lessons endpoint. None stays None.

    arc_words is the word count of the six-part arc lesson the reader
    renders above these extras; passing it makes reading_minutes cover
    the whole page rather than the extras alone."""
    if extras is None:
        return None
    return {
        "lead": extras.lead,
        "sections": [
            {
                "id": s.id,
                "heading": s.heading,
                "body": s.body,
                "figure": (
                    None
                    if s.figure is None
                    else {
                        "stem": s.figure.stem,
                        "caption": s.figure.caption,
                        "alt": s.figure.alt,
                    }
                ),
                "table": (
                    None
                    if s.table is None
                    else {
                        "caption": s.table.caption,
                        "columns": list(s.table.columns),
                        "rows": [list(r) for r in s.table.rows],
                        "source": s.table.source,
                        "note": s.table.note,
                    }
                ),
                "important": s.important,
            }
            for s in extras.sections
        ],
        "key_takeaways": list(extras.key_takeaways),
        "exam_tips": list(extras.exam_tips),
        "video": (
            None
            if extras.video is None
            else {
                "slug": extras.video.slug,
                "title": extras.video.title,
                "seconds": extras.video.seconds,
                "summary": extras.video.summary,
            }
        ),
        "further": [{"label": a, "href": b} for a, b in extras.further],
        "reading_minutes": extras.reading_minutes(arc_words=arc_words),
        "word_count": extras.word_count(),
    }
