"""What EUREKA actually does, as the helper's only source of truth.

WHY A HAND-WRITTEN REGISTRY AND NOT A CRAWL

The helper's whole job is to answer "how do I ...?" before someone emails an
administrator. The failure mode that makes such a helper worse than useless is
confidently describing a feature that does not exist - the user hunts for a
button that was never built, then emails the administrator anyway, having lost
ten minutes and some trust.

So the helper answers ONLY from this file. Every entry names a route that
exists in apps/web/src/app, and the tasks under it describe things the platform
can really do. Nothing here is inferred from a route name: a directory called
`futures/` tells you a page exists, not what it is for.

WHEN A MODULE CHANGES

Update the entry. `tests/test_help_registry.py` checks that every `route` here
corresponds to a real page directory, so a renamed or deleted route fails the
build rather than sending users somewhere that 404s. It cannot check that the
prose is still true - that part is on whoever changes the module.

WHAT IS DELIBERATELY ABSENT

Anything about billing amounts, refunds, account deletion, or another user's
data. Those are decisions, not instructions, and the helper escalates them to a
human instead of guessing at policy.
"""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(frozen=True)
class HelpTopic:
    """One module, and the things people actually need to do inside it."""

    key: str
    title: str
    route: str
    # One sentence a person would recognise, not a feature list.
    summary: str
    # "How do I ...?" phrasings, used for matching and shown as suggestions.
    tasks: tuple[str, ...] = ()
    # Extra words that should match this topic but do not appear above.
    keywords: tuple[str, ...] = ()
    # True when reaching it needs a role most learners do not have.
    restricted: bool = False


TOPICS: tuple[HelpTopic, ...] = (
    HelpTopic(
        key="getting-started",
        title="Getting started",
        route="/dashboard",
        summary=(
            "The dashboard is the front door. It shows the modules your account "
            "can reach and where you left off."
        ),
        tasks=(
            "Where do I start?",
            "What can I use on this account?",
            "Why can I not see a module in the sidebar?",
        ),
        keywords=("home", "begin", "new", "first", "sidebar", "menu", "navigate"),
    ),
    HelpTopic(
        key="test-prep",
        title="Test Prep",
        route="/dashboard/test-prep",
        summary=(
            "Exam preparation with lessons, question banks, flashcards, timed "
            "mock exams and analytics. Patent Bar, LSAT, MCAT, GRE, GMAT, SAT, "
            "FE/PE and more."
        ),
        tasks=(
            "How do I switch to a different exam?",
            "Where are the practice questions?",
            "How do I take a full timed exam?",
            "Where do I see which topics I am weakest on?",
            "How do I use flashcards and spaced repetition?",
        ),
        keywords=(
            "exam", "qbank", "question", "questions", "practice", "practise",
            "question bank", "flashcard", "mock", "patent bar",
            "lsat", "mcat", "gre", "gmat", "sat", "mpep", "timed", "score",
        ),
    ),
    HelpTopic(
        key="mathematics",
        title="Mathematics (AXIOM)",
        route="/launch/axiom",
        summary=(
            "The mathematics platform: written chapters from pre-algebra to "
            "graduate topics, practice graded on the server, and a mastery "
            "estimate per skill. It opens in its own app and signs you in "
            "automatically."
        ),
        tasks=(
            "How do I open the mathematics module?",
            "Why does a chapter say 'reading only'?",
            "Where do I practise a specific topic?",
            "Why did it sign me out?",
        ),
        keywords=("axiom", "maths", "math", "algebra", "calculus", "proof", "chapter"),
    ),
    HelpTopic(
        key="chemistry",
        title="Chemistry (OCTET)",
        route="/launch/octet",
        summary=(
            "The chemistry platform: chapters, practice, 3D molecule labs and "
            "simulations. It opens in its own app and signs you in "
            "automatically."
        ),
        tasks=(
            "How do I open the chemistry module?",
            "Where are the 3D labs?",
        ),
        keywords=("octet", "chem", "molecule", "lab", "periodic", "reaction"),
    ),
    HelpTopic(
        key="courses",
        title="My Courses",
        route="/dashboard/courses",
        summary="The courses you are enrolled in, and your progress through them.",
        tasks=(
            "Where are my courses?",
            "How do I enrol in a course?",
            "Why does a course I expected not appear?",
        ),
        keywords=("enrol", "enroll", "enrolment", "class", "module", "progress"),
    ),
    HelpTopic(
        key="learning-path",
        title="Learning Path",
        route="/dashboard/learning-path",
        summary=(
            "A recommended order of study built from what you have already "
            "shown you know."
        ),
        tasks=("What should I study next?", "Why is this recommended?"),
        keywords=("path", "next", "plan", "recommend", "order", "roadmap"),
    ),
    HelpTopic(
        key="assessments",
        title="Assessments",
        route="/dashboard/assessments",
        summary="Assessments assigned to you, and the ones you have completed.",
        tasks=(
            "Where is the assessment my teacher assigned?",
            "How do I see my result?",
            "The assessment window closed - what now?",
        ),
        keywords=("assignment", "due", "submit", "grade", "result", "deadline"),
    ),
    HelpTopic(
        key="analytics",
        title="Analytics",
        route="/dashboard/analytics",
        summary=(
            "What your recorded attempts say about your progress. Every figure "
            "comes from your own answers; there are no cohort percentiles."
        ),
        tasks=(
            "Where do I see my progress?",
            "Why is a figure blank or showing a dash?",
        ),
        keywords=("progress", "stats", "score", "chart", "report", "percentile"),
    ),
    HelpTopic(
        key="tutor",
        title="AI Tutor",
        route="/dashboard/tutor",
        summary=(
            "An AI-assisted tutor grounded in your own course material. Every "
            "reply shows the sources it used, and it tells you when a reply was "
            "composed from your lessons rather than written by a model."
        ),
        tasks=(
            "How do I ask the tutor a question?",
            "Why did the tutor not give me the answer?",
            "Can I trust what the tutor says?",
        ),
        keywords=("ai", "copilot", "chat", "hint", "explain", "ask"),
    ),
    HelpTopic(
        key="notebook",
        title="Notebook",
        route="/dashboard/notebook",
        summary="Your notes and saved work.",
        tasks=("Where are my notes?", "How do I save a note?"),
        keywords=("note", "notes", "save", "write", "journal"),
    ),
    HelpTopic(
        key="srs",
        title="Spaced repetition",
        route="/dashboard/srs",
        summary=(
            "Review scheduled by how well you knew something, not by how long "
            "ago you saw it."
        ),
        tasks=("What is due for review?", "How does the schedule decide?"),
        keywords=("review", "repetition", "flashcard", "due", "sm-2", "recall"),
    ),
    HelpTopic(
        key="resume",
        title="Resume Builder",
        route="/dashboard/resume-builder",
        summary="Build and export a resume from your record on the platform.",
        tasks=("How do I export my resume?", "How do I edit a section?"),
        keywords=("cv", "resume", "export", "pdf", "download", "job"),
    ),
    HelpTopic(
        key="xr-labs",
        title="3D & XR Labs",
        route="/dashboard/xr-labs",
        summary="Interactive 3D scenes and simulations that run in the browser.",
        tasks=("How do I open a lab?", "The lab will not load - what do I check?"),
        keywords=("3d", "xr", "vr", "simulation", "webgl", "scene", "lab"),
    ),
    HelpTopic(
        key="community",
        title="Community and study groups",
        route="/dashboard/community",
        summary="Discussions, and study groups you can join or start.",
        tasks=("How do I join a study group?", "How do I start a discussion?"),
        keywords=("forum", "group", "discussion", "peer", "post", "social"),
    ),
    HelpTopic(
        key="account",
        title="Account and settings",
        route="/dashboard/settings",
        summary=(
            "Your profile, password, notification preferences and accessibility "
            "options."
        ),
        tasks=(
            "How do I change my password?",
            "How do I update my email or profile?",
            "How do I turn notifications off?",
            "Where are the accessibility options?",
        ),
        keywords=(
            "password", "email", "profile", "login", "sign in", "notification",
            "accessibility", "font", "contrast", "preferences",
        ),
    ),
    HelpTopic(
        key="teacher",
        title="Teacher Tools",
        route="/dashboard/teacher",
        summary=(
            "Build and assign assessments, and read results per learner and per "
            "question."
        ),
        tasks=(
            "How do I assign an assessment?",
            "Where do I see how my class did?",
        ),
        keywords=("teacher", "class", "assign", "students", "gradebook", "marking"),
        restricted=True,
    ),
    HelpTopic(
        key="institutions",
        title="Partner Portal",
        route="/institutions",
        summary="Seats, programmes and partnership administration for an organisation.",
        tasks=("How do I add seats?", "How do I invite people from my organisation?"),
        keywords=("seat", "licence", "license", "organisation", "organization", "partner", "invite"),
        restricted=True,
    ),
    HelpTopic(
        key="admin",
        title="Admin console",
        route="/admin",
        summary="Platform administration: users, roles and org configuration.",
        tasks=("How do I change someone's role?", "Where do I manage users?"),
        keywords=("admin", "role", "permission", "user management", "console"),
        restricted=True,
    ),
)


# Questions the helper must NOT attempt, because the answer is a decision
# rather than an instruction. Matching one of these escalates immediately.
#
# Getting this wrong in the confident direction is expensive: a helper that
# invents a refund policy has made a promise the platform then has to keep or
# publicly break.
ESCALATE_ALWAYS: tuple[tuple[str, ...], ...] = (
    ("refund", "money back", "chargeback"),
    ("cancel my subscription", "cancel subscription", "stop billing"),
    ("delete my account", "close my account", "erase my data"),
    ("charged twice", "wrong charge", "billing error", "double charged"),
    ("someone else", "another student", "other user's"),
    ("gdpr", "data request", "right to be forgotten"),
    ("hacked", "compromised", "unauthorised access", "unauthorized access"),
)


def topic_by_key(key: str) -> HelpTopic | None:
    return next((t for t in TOPICS if t.key == key), None)
