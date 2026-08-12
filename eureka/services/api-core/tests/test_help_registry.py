"""The helper must not send anyone to a page that does not exist.

The registry is prose, and prose goes stale silently. This cannot check that
a description is still true - only a human reading the module can - but it CAN
check the part that breaks most often and most visibly: a route that was
renamed or deleted while the help text kept pointing at it.

A helper whose links 404 is worse than no helper. It costs the reader a click,
their trust, and then an email to the administrator anyway.
"""

from __future__ import annotations

from pathlib import Path

import pytest

from app.services import help_service as hs
from app.services.help_registry import ESCALATE_ALWAYS, TOPICS

# services/api-core/tests/ -> repo/eureka/apps/web/src/app
_APP_DIR = Path(__file__).resolve().parents[3] / "apps" / "web" / "src" / "app"


def _resolve(base: Path, parts: list[str]) -> bool:
    """Walk a path, allowing a dynamic segment to stand in for a literal one.

    /launch/axiom is served by launch/[vertical]. A literal check reported
    that real route as missing, which would have had someone "fixing" a
    registry entry that was correct all along.
    """
    here = base
    for part in parts:
        step = here / part
        if step.is_dir():
            here = step
            continue
        dynamic = [d for d in here.glob("[[]*[]]") if d.is_dir()] if here.is_dir() else []
        if not dynamic:
            return False
        here = dynamic[0]
    return here.is_dir()


def _route_exists(route: str) -> bool:
    """True when the route resolves to a page directory in the Next app.

    Next's route groups - directories in (parentheses) - do not appear in the
    URL, so a route can live one level deeper than its path suggests. Both
    forms are accepted.
    """
    parts = [p for p in route.strip("/").split("/") if p]
    if not parts:
        return _APP_DIR.exists()

    if _resolve(_APP_DIR, parts):
        return True

    # Try each route group at the top level: /dashboard/x -> (dashboard)/x
    for group in _APP_DIR.glob("(*)"):
        if _resolve(group, parts):
            return True
        # /dashboard/test-prep -> (dashboard)/test-prep
        if len(parts) > 1 and _resolve(group, parts[1:]):
            return True
    return False


@pytest.mark.skipif(not _APP_DIR.exists(), reason="web app not present in this checkout")
@pytest.mark.parametrize("topic", TOPICS, ids=lambda t: t.key)
def test_every_topic_route_exists(topic) -> None:
    assert _route_exists(topic.route), (
        f"help topic {topic.key!r} points at {topic.route!r}, which is not a "
        f"page in apps/web/src/app. Fix the registry or the route - a helper "
        f"whose links 404 is worse than no helper."
    )


def test_topic_keys_are_unique() -> None:
    keys = [t.key for t in TOPICS]
    assert len(keys) == len(set(keys)), "duplicate help topic keys"


def test_a_plain_question_matches_something() -> None:
    """The matcher has to actually match. A too-strict threshold escalates
    everything, which looks like working software and helps nobody."""
    for question, expected in [
        ("How do I change my password?", "account"),
        ("where are the practice questions", "test-prep"),
        ("what should I study next", "learning-path"),
        ("how do I open the mathematics module", "mathematics"),
    ]:
        matches = hs.match_topics(question)
        assert matches, f"no match for {question!r}"
        assert expected in [m.topic.key for m in matches], (
            f"{question!r} matched {[m.topic.key for m in matches]}, "
            f"expected {expected} among them"
        )


def test_gibberish_does_not_match() -> None:
    """A weak match must be treated as no match. Escalating is the correct
    answer when the evidence is thin."""
    assert hs.match_topics("asdkjhasd qwe zzz") == []
    assert hs.match_topics("") == []


@pytest.mark.parametrize(
    "question",
    [
        "I want a refund",
        "please delete my account",
        "I was charged twice this month",
        "can you show me another student's grades",
        "my account was hacked",
    ],
)
def test_policy_questions_always_escalate(question: str) -> None:
    """These are decisions, not instructions. The helper must not answer them
    even if it could match a topic - inventing a refund policy makes a promise
    the platform then has to keep or publicly break."""
    assert hs.must_escalate(question) is not None


def test_escalate_phrases_are_lowercase() -> None:
    """must_escalate lowercases the question, so an uppercase phrase here
    would silently never match."""
    for group in ESCALATE_ALWAYS:
        for phrase in group:
            assert phrase == phrase.lower(), f"{phrase!r} must be lowercase"


def test_grounding_is_the_only_source() -> None:
    """Every passage handed to the reasoning core comes from a matched topic.

    This is what stops the helper describing features that do not exist: it is
    given nothing else to describe.
    """
    matches = hs.match_topics("where are the practice questions")
    passages = hs.grounding_passages(matches)
    assert passages
    titles = {m.topic.title for m in matches}
    for p in passages:
        assert any(t in p["source"] for t in titles)
