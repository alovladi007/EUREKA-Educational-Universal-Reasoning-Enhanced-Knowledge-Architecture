"""Match a question to what the platform can do, and know when to give up.

THE DESIGN RULE

Answer from the registry or escalate. There is no third branch where the
helper improvises. A support helper that guesses is worse than no helper: the
person follows the guess, it does not work, and they contact an administrator
anyway - later, and more annoyed.

So matching is deliberately conservative. A weak match is treated as no match,
because "I am not sure, here is a human" is a better answer than a confident
wrong one, and it is the answer this file prefers whenever the evidence is
thin.

WHERE THE PROSE COMES FROM

The registry supplies the facts. The reasoning core (the same one AXIOM's tutor
uses) turns the matched entries into a reply addressed to the question, and
reports honestly whether a model wrote it. With no model configured the reply
is composed from the registry text, which is still accurate - just flatter.
Either way the helper cannot state a capability the registry does not contain,
because the registry is the only grounding it is given.
"""

from __future__ import annotations

import re
from dataclasses import dataclass

from app.services.help_registry import ESCALATE_ALWAYS, TOPICS, HelpTopic

# A topic must clear this to be offered at all. Tuned so that a question naming
# a module ("where is my resume") matches, and a vague one ("it is broken")
# does not.
_MIN_SCORE = 2.0

# Words that carry no topic signal. Kept short on purpose: an aggressive stop
# list starts eating the words that actually discriminate ("path", "review").
_STOP = frozenset(
    """a an the my me i you it is are was do does did how what where when why can
    could would should to of in on for with and or not no yes please help need
    want get got give show tell find see use using there this that these those
    am be been if then than so but at from by about into out up down""".split()
)


def _words(text: str) -> list[str]:
    return [w for w in re.findall(r"[a-z0-9']+", (text or "").lower()) if w not in _STOP]


@dataclass
class Match:
    topic: HelpTopic
    score: float
    matched_task: str | None


@dataclass
class HelpAnswer:
    handled: bool
    text: str
    matches: list[Match]
    escalate: bool
    escalate_reason: str


def _score(topic: HelpTopic, words: list[str], raw: str) -> tuple[float, str | None]:
    """How well a topic answers this question, and the closest listed task.

    Phrase hits on a keyword count double a bare word hit, because a keyword
    like "question bank" appearing intact is much stronger evidence than the
    word "question" turning up somewhere.
    """
    score = 0.0
    haystack = " ".join(words)

    for kw in topic.keywords:
        if " " in kw:
            if kw in raw:
                score += 2.0
        elif kw in words:
            score += 1.0

    title_words = set(_words(topic.title))
    score += 1.5 * len(title_words & set(words))

    best_task, best_overlap = None, 0
    for task in topic.tasks:
        overlap = len(set(_words(task)) & set(words))
        if overlap > best_overlap:
            best_task, best_overlap = task, overlap
    # Weighted highest of the three signals. The task list is literally the
    # set of "how do I ...?" sentences people type, so overlap with one is
    # much stronger evidence than a loose keyword hit. At 0.75 this scored
    # below the threshold for short questions - "where do I see my progress"
    # and "where are the practice questions" both fell through to escalation,
    # which is the safe direction but useless.
    score += 1.25 * best_overlap

    # A question naming the route outright is unambiguous.
    if topic.route.strip("/").split("/")[-1] in haystack:
        score += 2.0

    return score, best_task


def must_escalate(question: str) -> str | None:
    """A reason to hand straight to a human, or None."""
    q = (question or "").lower()
    for group in ESCALATE_ALWAYS:
        for phrase in group:
            if phrase in q:
                return (
                    "This one needs a person: it involves billing, account "
                    "removal, another user's data, or account security, and "
                    "those are decisions rather than instructions."
                )
    return None


def match_topics(question: str, limit: int = 3) -> list[Match]:
    words = _words(question)
    raw = (question or "").lower()
    if not words:
        return []
    scored = []
    for topic in TOPICS:
        score, task = _score(topic, words, raw)
        if score >= _MIN_SCORE:
            scored.append(Match(topic=topic, score=score, matched_task=task))
    scored.sort(key=lambda m: m.score, reverse=True)
    return scored[:limit]


def compose_fallback(question: str, matches: list[Match]) -> str:
    """The answer when no model is available. Accurate, just flatter."""
    if not matches:
        return (
            "I could not match that to a part of the platform I know about. "
            "Send it to an administrator and they will pick it up."
        )
    lines = []
    for m in matches:
        line = f"{m.topic.title} ({m.topic.route}) — {m.topic.summary}"
        if m.topic.restricted:
            line += " This area needs a teacher or administrator role."
        lines.append(line)
    head = (
        "That sounds like it lives here:"
        if len(lines) == 1
        else "That could be any of these:"
    )
    return head + "\n\n" + "\n\n".join(lines)


def grounding_passages(matches: list[Match]) -> list[dict]:
    """The matched registry entries, as passages for the reasoning core.

    This is the ONLY grounding the helper is given, which is what stops it
    describing features that do not exist: it has nothing else to describe.
    """
    out = []
    for m in matches:
        tasks = " ".join(f"- {t}" for t in m.topic.tasks)
        out.append(
            {
                "source": f"{m.topic.title} ({m.topic.route})",
                "kind": "help",
                "text": (
                    f"{m.topic.summary} Route: {m.topic.route}. "
                    + (
                        "Requires a teacher or administrator role. "
                        if m.topic.restricted
                        else ""
                    )
                    + (f"Things people do here: {tasks}" if tasks else "")
                ),
            }
        )
    return out


NO_MATCH_TEXT = (
    "I could not match that to a part of the platform I know about, so I do "
    "not want to guess. Send it to an administrator and they will pick it up."
)
