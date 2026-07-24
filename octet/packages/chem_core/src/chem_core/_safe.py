"""In-process guards for grading work.

RDKit and SymPy on adversarial input are denial of service vectors. The build
prompt makes sandboxing a launch blocker. Defence is two layers:

1. This module: a signal based wall clock limit and input size caps that run
   inside the worker process.
2. app/domains/grading/sandbox.py: a process pool with a parent side timeout
   that can kill and rebuild a wedged worker.

Layer 1 alone is not sufficient (a C extension can ignore signals), which is
why layer 2 exists. Layer 1 catches the common case cheaply.
"""

from __future__ import annotations

import signal
from contextlib import contextmanager
from typing import Iterator

# Input caps. A legitimate chemistry submission is small. Anything larger is
# either a mistake or an attack, and both are answered the same way.
MAX_INPUT_CHARS = 4000
MAX_FORMULA_TERMS = 64
MAX_EQUATION_SPECIES = 24
MAX_ELEMENT_COUNT = 10_000


class GradingTimeout(Exception):
    """Raised when a grader exceeds its wall clock budget."""


class InputTooLarge(Exception):
    """Raised when a submission exceeds a documented size cap."""


@contextmanager
def time_limit(seconds: float) -> Iterator[None]:
    """Wall clock limit using SIGALRM.

    No-op on platforms without SIGALRM or when called off the main thread,
    where setitimer is not available. The process pool timeout in the sandbox
    module remains the backstop in those cases.
    """
    if not hasattr(signal, "SIGALRM"):
        yield
        return

    def _handler(signum, frame):  # pragma: no cover - timing dependent
        raise GradingTimeout(f"grading exceeded {seconds}s")

    try:
        previous = signal.signal(signal.SIGALRM, _handler)
        signal.setitimer(signal.ITIMER_REAL, seconds)
    except (ValueError, OSError):
        # Not on the main thread. Rely on the process pool timeout.
        yield
        return
    try:
        yield
    finally:
        signal.setitimer(signal.ITIMER_REAL, 0)
        signal.signal(signal.SIGALRM, previous)


def check_size(text: str, *, cap: int = MAX_INPUT_CHARS) -> str:
    """Reject oversized input before any parser touches it."""
    if text is None:
        raise InputTooLarge("empty submission")
    if len(text) > cap:
        raise InputTooLarge(f"submission exceeds {cap} characters")
    return text
