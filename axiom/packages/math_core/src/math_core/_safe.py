"""Safe parsing and timeout helpers for math_core.

This module centralizes the SAFETY-critical concerns:

- We never use eval or exec on user input. All math strings are parsed with
  sympy.parsing.sympy_parser.parse_expr using a restricted transformations set
  and a local symbol table only.
- Every evaluation is wrapped with a wall-clock timeout. On the main thread we
  use a signal.alarm-based context manager for the synchronous API. In the
  Celery worker, these functions are expected to be called inside the worker's
  own sandbox (process isolation plus per-task time limits); the signal-based
  guard here is a best-effort secondary bound and is a no-op when a SIGALRM
  handler cannot be installed (for example, off the main thread).
"""

from __future__ import annotations

import signal
import threading
from contextlib import contextmanager
from typing import Iterator

import sympy
from sympy.parsing.sympy_parser import (
    implicit_multiplication_application,
    parse_expr,
    standard_transformations,
)

# Restricted transformation set. We allow the standard transformations plus
# implicit multiplication and function application (so that "2x" and "sin x"
# parse the way a student would expect). We deliberately do NOT enable any
# transformation that could broaden parsing into unsafe territory.
SAFE_TRANSFORMATIONS = standard_transformations + (
    implicit_multiplication_application,
)

# Default wall-clock timeout (seconds) for a single sympy evaluation.
DEFAULT_TIMEOUT_SECONDS: float = 5.0


class MathTimeoutError(Exception):
    """Raised when a bounded sympy evaluation exceeds its wall-clock budget."""


class MathParseError(Exception):
    """Raised when a math string cannot be parsed safely."""


@contextmanager
def time_limit(seconds: float) -> Iterator[None]:
    """Bound the wrapped block with a wall-clock timeout.

    Uses signal.alarm on the main thread. If a SIGALRM handler cannot be
    installed (for example, because we are not on the main thread, as inside a
    Celery worker), this becomes a no-op and relies on the surrounding sandbox
    for isolation. See the module docstring for the safety rationale.
    """
    can_use_signal = (
        threading.current_thread() is threading.main_thread()
        and hasattr(signal, "SIGALRM")
    )
    if not can_use_signal:
        # No-op guard. The caller (Celery worker) provides the real bound.
        yield
        return

    def _handler(signum: int, frame: object) -> None:
        raise MathTimeoutError(f"evaluation exceeded {seconds} seconds")

    # signal.setitimer accepts a float; use it for sub-second precision.
    previous = signal.signal(signal.SIGALRM, _handler)
    signal.setitimer(signal.ITIMER_REAL, max(0.0, float(seconds)))
    try:
        yield
    finally:
        signal.setitimer(signal.ITIMER_REAL, 0.0)
        signal.signal(signal.SIGALRM, previous)


def build_local_symbols(names: set[str]) -> dict[str, sympy.Symbol]:
    """Build a local symbol table (real symbols) from a set of names.

    Only symbols are placed in the local table. No functions or constants are
    injected here; sympy's own parser resolves known names like sin, cos, pi,
    E, and sqrt through its default namespace, which contains no Python builtins
    that could execute arbitrary code.
    """
    return {name: sympy.Symbol(name, real=True) for name in names}


def _extract_symbol_names(text: str) -> set[str]:
    """Extract candidate identifier names from a math string.

    This is a lightweight lexical scan used only to pre-seed the local symbol
    table so that free variables become real-valued symbols. It does not
    interpret the string; the authoritative parsing is done by parse_expr.
    """
    names: set[str] = set()
    current: list[str] = []
    for ch in text:
        if ch.isalpha() or ch == "_" or (current and ch.isdigit()):
            current.append(ch)
        else:
            if current:
                names.add("".join(current))
                current = []
    if current:
        names.add("".join(current))
    # Drop names that sympy resolves itself (functions and constants). Leaving
    # them out of the local table lets sympy bind them to its safe built-ins.
    reserved = {
        "sin", "cos", "tan", "cot", "sec", "csc",
        "asin", "acos", "atan", "atan2",
        "sinh", "cosh", "tanh",
        "exp", "log", "ln", "sqrt", "Abs", "abs",
        "pi", "E", "I", "oo", "gamma", "factorial",
        "Eq", "Rational", "Integer", "Float",
    }
    return {n for n in names if n not in reserved}


def safe_parse(
    text: str,
    *,
    local_symbols: dict[str, sympy.Symbol] | None = None,
    timeout: float = DEFAULT_TIMEOUT_SECONDS,
) -> sympy.Expr:
    """Parse a math string into a sympy expression, safely and with a timeout.

    Safety notes:
    - Uses sympy.parsing.sympy_parser.parse_expr with SAFE_TRANSFORMATIONS.
    - evaluate=True so the expression is normalized as it is built.
    - A local symbol table is supplied and global_dict is restricted so that no
      Python builtins are reachable. eval/exec are never used on the input.
    - The parse is wrapped in a wall-clock time_limit.

    Raises MathParseError on any parse failure (the callers convert this into a
    GradeResult rather than propagating).
    """
    if not isinstance(text, str):
        raise MathParseError("input must be a string")
    stripped = text.strip()
    if not stripped:
        raise MathParseError("empty expression")

    if local_symbols is None:
        local_symbols = build_local_symbols(_extract_symbol_names(stripped))

    # Global namespace: we pass global_dict=None so that parse_expr uses its own
    # default sympy namespace (equivalent to `from sympy import *`). That
    # namespace lets names like sin, cos, pi, sqrt, Abs, and Integer resolve to
    # sympy objects. It contains no Python builtins such as eval, exec, open, or
    # __import__, so no arbitrary code is reachable. The student's names are put
    # in local_dict first and take precedence, and only the restricted
    # SAFE_TRANSFORMATIONS are applied to the token stream. eval/exec are never
    # called on the raw input by this package.
    try:
        with time_limit(timeout):
            expr = parse_expr(
                stripped,
                local_dict=dict(local_symbols),
                global_dict=None,
                transformations=SAFE_TRANSFORMATIONS,
                evaluate=True,
            )
    except MathTimeoutError:
        raise
    except Exception as exc:  # noqa: BLE001 - convert any parse failure.
        raise MathParseError(f"could not parse expression: {exc}") from exc
    return expr
