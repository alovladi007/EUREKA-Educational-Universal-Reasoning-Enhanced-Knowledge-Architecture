"""Layer one of the grading sandbox: the in-process guards.

These had no test file. _safe.py was exercised only indirectly, through the
HOSTILE payload list in test_graders.py, which drives check_size into four
parsers. That covers the size caps by accident of routing. It never names
GradingTimeout, time_limit or InputTooLarge, so the wall clock limit, the
handler restoration and the off-main-thread no-op were all unasserted.

The distinction matters because the two layers fail differently. Layer one is
a Python signal handler and can only interrupt the interpreter between
bytecode instructions, so a C extension spinning inside RDKit ignores it
completely. That is not a defect, it is why layer two exists. What layer one
must do is catch the common case cheaply and, just as importantly, leave the
process exactly as it found it: a leaked itimer or a clobbered SIGALRM handler
would arm a timeout that fires during unrelated work later.
"""

from __future__ import annotations

import signal
import threading
import time

import pytest

from chem_core._safe import (
    MAX_INPUT_CHARS,
    GradingTimeout,
    InputTooLarge,
    check_size,
    time_limit,
)

# Long enough that a working timer always beats it, short enough that a broken
# one fails the test in a second rather than hanging the suite. A bare
# `while True` here would turn any regression into an infinite run.
SPIN_BUDGET_S = 2.0


def _spin(deadline: float) -> None:
    """Busy loop in pure Python until the deadline, then give up."""
    while time.monotonic() < deadline:
        pass


class TestTimeLimit:
    def test_pure_python_spin_is_interrupted(self):
        started = time.monotonic()
        with pytest.raises(GradingTimeout):
            with time_limit(0.05):
                _spin(started + SPIN_BUDGET_S)
        # If the alarm had not fired we would have spun the whole budget.
        assert time.monotonic() - started < SPIN_BUDGET_S

    def test_the_message_names_the_budget(self):
        with pytest.raises(GradingTimeout, match="0.05"):
            with time_limit(0.05):
                _spin(time.monotonic() + SPIN_BUDGET_S)

    def test_a_body_that_finishes_is_left_alone(self):
        with time_limit(5.0):
            result = sum(range(1000))
        assert result == 499500

    def test_the_timer_is_disarmed_on_the_way_out(self):
        """A leaked itimer would fire later, during unrelated grading."""
        with time_limit(0.05):
            pass
        remaining, _interval = signal.getitimer(signal.ITIMER_REAL)
        assert remaining == 0.0
        # And prove it by outliving the budget with no alarm.
        time.sleep(0.15)

    def test_the_previous_handler_is_restored(self):
        sentinel = signal.getsignal(signal.SIGALRM)
        with time_limit(5.0):
            inside = signal.getsignal(signal.SIGALRM)
        assert inside is not sentinel, "the limit did not install its handler"
        assert signal.getsignal(signal.SIGALRM) is sentinel

    def test_cleanup_survives_an_unrelated_exception(self):
        """The finally block has to run even when the grader itself blows up."""
        sentinel = signal.getsignal(signal.SIGALRM)
        with pytest.raises(ValueError):
            with time_limit(5.0):
                raise ValueError("grader exploded")
        assert signal.getsignal(signal.SIGALRM) is sentinel
        assert signal.getitimer(signal.ITIMER_REAL)[0] == 0.0

    def test_off_the_main_thread_it_degrades_to_a_no_op(self):
        """setitimer is main-thread only. The pool timeout is the backstop.

        The contract is that it yields rather than raising, so grading still
        happens off the main thread; it just runs unguarded by layer one.
        """
        outcome: list[str] = []

        def worker():
            try:
                with time_limit(0.01):
                    time.sleep(0.05)
                outcome.append("ran unguarded")
            except GradingTimeout:  # pragma: no cover - would be a regression
                outcome.append("raised GradingTimeout")
            except Exception as exc:  # pragma: no cover - would be a regression
                outcome.append(f"raised {type(exc).__name__}")

        t = threading.Thread(target=worker)
        t.start()
        t.join(timeout=5.0)
        assert not t.is_alive()
        assert outcome == ["ran unguarded"]


class TestCheckSize:
    def test_accepts_and_returns_normal_input(self):
        assert check_size("CH3CH2OH") == "CH3CH2OH"

    def test_accepts_exactly_the_cap(self):
        text = "H" * MAX_INPUT_CHARS
        assert check_size(text) == text

    def test_rejects_one_character_past_the_cap(self):
        with pytest.raises(InputTooLarge):
            check_size("H" * (MAX_INPUT_CHARS + 1))

    def test_rejects_none(self):
        """None is a caller bug, not a big submission, but it must not crash."""
        with pytest.raises(InputTooLarge):
            check_size(None)  # type: ignore[arg-type]

    def test_honours_a_tighter_caller_cap(self):
        assert check_size("HCl", cap=3) == "HCl"
        with pytest.raises(InputTooLarge):
            check_size("HCl2", cap=3)

    def test_the_message_names_the_cap_that_was_hit(self):
        with pytest.raises(InputTooLarge, match="64"):
            check_size("x" * 65, cap=64)
