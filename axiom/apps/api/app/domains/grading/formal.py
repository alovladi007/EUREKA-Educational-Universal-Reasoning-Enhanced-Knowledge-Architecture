"""Formal verification of proofs (Curriculum & Proof Extension, Section 4.1).

A formal-track item is graded by a proof-assistant kernel, not by AI or by a
human: if the proof type-checks, it is correct, deterministically and with no
judgment in the loop. This module is the swappable seam for that, mirroring the
identity, reasoning, and email provider patterns:

  - LeanVerifier shells out to a Lean 4 toolchain in a resource-limited
    subprocess. When the toolchain is present and the kernel accepts the proof,
    the verdict is a trustworthy pass.
  - UnavailableFormalVerifier is the honest default: with no toolchain
    configured it never returns a pass, so a formal proof is routed to manual
    review rather than being auto-graded on a guess. This matches the
    extension's stance that formal verification is an opt-in track with real
    setup cost, not the default for every proof course.

Honesty properties:
  - A pass is only ever returned by a real kernel. No heuristic stands in for
    verification (that is exactly the mistake the extension warns against).
  - available() reflects reality; a formal item whose proof cannot be
    machine-checked is marked pending and sent to the review queue, never
    silently failed or silently passed.

Sandbox note: the subprocess runs in a fresh temporary directory with a
wall-clock timeout and, where the platform supports it, CPU and address-space
rlimits. Production should additionally isolate it (a dedicated container or a
jailed worker); the interface does not change when it does.
"""

from __future__ import annotations

import asyncio
import shutil
import tempfile
from dataclasses import dataclass
from functools import lru_cache
from typing import Protocol

from app.core.config import get_settings
from app.domains.grading.service import GradeOutcome


@dataclass
class FormalVerdict:
    """The outcome of attempting to verify a formal proof.

    verified is True only when a real kernel accepted the proof. available is
    False when no toolchain could run (so the item must go to manual review).
    """

    verified: bool
    available: bool
    backend: str
    detail: str


class FormalVerifier(Protocol):
    async def verify(self, proof: str, *, prelude: str = "") -> FormalVerdict: ...


class UnavailableFormalVerifier:
    """The default: no formal toolchain configured, so nothing is verified.

    It never returns a pass. A formal proof graded through it is pending and is
    routed to the human review queue, which is the honest behavior when the
    platform cannot machine-check the argument.
    """

    async def verify(self, proof: str, *, prelude: str = "") -> FormalVerdict:
        return FormalVerdict(
            verified=False,
            available=False,
            backend="none",
            detail=(
                "No formal proof toolchain is configured. This proof was not "
                "machine-verified and is queued for manual review."
            ),
        )


def _set_limits(cpu_seconds: int, address_bytes: int):
    """Return a preexec_fn that caps CPU and memory, or None if unsupported."""
    try:
        import resource
    except ImportError:
        return None

    def _apply() -> None:
        try:
            resource.setrlimit(resource.RLIMIT_CPU, (cpu_seconds, cpu_seconds))
            resource.setrlimit(resource.RLIMIT_AS, (address_bytes, address_bytes))
        except (ValueError, OSError):
            # Best effort: if a limit cannot be set, the wall-clock timeout still
            # bounds the run.
            pass

    return _apply


class LeanVerifier:
    """Verify a proof with a Lean 4 toolchain in a resource-limited subprocess.

    The proof text (optionally preceded by an author prelude of imports and
    definitions) is written to a temp file and checked by `lean <file>`. A zero
    exit code with no error output is a kernel-accepted proof. Anything else is
    a rejection with the kernel's message. If the binary is not on PATH, the
    verdict is marked unavailable so the item is reviewed, not failed.
    """

    def __init__(self, binary: str, timeout_seconds: float):
        self._binary = binary
        self._timeout = timeout_seconds

    def available(self) -> bool:
        return shutil.which(self._binary) is not None

    async def verify(self, proof: str, *, prelude: str = "") -> FormalVerdict:
        if not self.available():
            return FormalVerdict(
                verified=False,
                available=False,
                backend="lean",
                detail=(
                    f"Lean toolchain '{self._binary}' was not found on PATH. "
                    "The proof is queued for manual review."
                ),
            )

        source = f"{prelude}\n{proof}\n" if prelude else f"{proof}\n"
        with tempfile.TemporaryDirectory(prefix="axiom-lean-") as workdir:
            path = f"{workdir}/Proof.lean"
            with open(path, "w", encoding="utf-8") as handle:
                handle.write(source)
            cpu = max(1, int(self._timeout))
            try:
                proc = await asyncio.create_subprocess_exec(
                    self._binary,
                    path,
                    cwd=workdir,
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE,
                    preexec_fn=_set_limits(cpu, 2 * 1024 * 1024 * 1024),
                )
            except (OSError, ValueError) as exc:
                return FormalVerdict(
                    verified=False,
                    available=False,
                    backend="lean",
                    detail=f"could not start the Lean toolchain: {exc}",
                )
            try:
                stdout, stderr = await asyncio.wait_for(
                    proc.communicate(), timeout=self._timeout
                )
            except TimeoutError:
                proc.kill()
                await proc.wait()
                return FormalVerdict(
                    verified=False,
                    available=True,
                    backend="lean",
                    detail=f"verification timed out after {self._timeout:.0f}s",
                )

        message = (stderr or stdout or b"").decode("utf-8", "replace").strip()
        if proc.returncode == 0 and not message:
            return FormalVerdict(
                verified=True,
                available=True,
                backend="lean",
                detail="kernel accepted the proof",
            )
        return FormalVerdict(
            verified=False,
            available=True,
            backend="lean",
            detail=f"kernel rejected the proof: {message[:400]}" if message
            else "kernel rejected the proof",
        )


@lru_cache
def get_formal_verifier() -> FormalVerifier:
    """Return the configured formal verifier (cached, argument-free).

    Defaults to the unavailable verifier so a fresh install never claims to
    verify proofs it cannot. Set AXIOM_FORMAL_VERIFIER=lean to enable the Lean
    backend once a toolchain is installed.
    """
    settings = get_settings()
    if settings.formal_verifier == "lean":
        return LeanVerifier(settings.lean_binary, settings.formal_timeout_seconds)
    return UnavailableFormalVerifier()


async def grade_formal_proof(
    proof: str, meta: dict | None = None, explanation: str = ""
) -> GradeOutcome:
    """Grade a formal-track proof through the configured verifier.

    A kernel-accepted proof is a full-credit, fully trusted pass (confidence
    1.0). A kernel-rejected proof is a confident fail. A proof that could not be
    machine-checked (no toolchain) is returned with confidence 0.0 so the caller
    routes it to manual review rather than lowering mastery on a non-result.
    """
    meta = meta or {}
    verifier = get_formal_verifier()
    verdict = await verifier.verify(proof or "", prelude=str(meta.get("prelude", "")))

    if verdict.verified:
        return GradeOutcome(
            is_correct=True,
            score=1.0,
            grader="formal",
            confidence=1.0,
            detail=f"[{verdict.backend}] {verdict.detail}",
            correct_display="",
            explanation=explanation,
        )
    if verdict.available:
        return GradeOutcome(
            is_correct=False,
            score=0.0,
            grader="formal",
            confidence=1.0,
            detail=f"[{verdict.backend}] {verdict.detail}",
            correct_display="",
            explanation=explanation,
        )
    # Not machine-checkable: pending manual review (confidence 0.0 signals this).
    return GradeOutcome(
        is_correct=False,
        score=0.0,
        grader="formal",
        confidence=0.0,
        detail=verdict.detail,
        correct_display="",
        explanation=explanation,
    )
