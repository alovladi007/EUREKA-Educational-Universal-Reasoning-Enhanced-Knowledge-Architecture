"""Curriculum & Proof Extension, Wave C: formal verification (Section 4.1).

The Section 10 acceptance criterion is that a formal-track proof is accepted only
when a kernel verifies it, and a deliberately broken proof is rejected. Because
CI has no Lean toolchain, the accept/reject routing is proven against a stub
kernel that models the accept/reject decision (a real Lean run is exercised too,
but only when a toolchain is present). The honest default -- no toolchain -- is
proven to never pass and to route to review instead.
"""

from __future__ import annotations

import shutil

import pytest

from app.domains.grading import formal
from app.domains.grading.formal import (
    FormalVerdict,
    LeanVerifier,
    UnavailableFormalVerifier,
    grade_formal_proof,
)


class _StubKernel:
    """A deterministic stand-in for a proof-assistant kernel, for tests only.

    It models the decision a real kernel makes: a proof verifies iff it states a
    theorem and contains no `sorry` placeholder. It is never shipped as a grader;
    production uses a real Lean kernel or the unavailable verifier.
    """

    async def verify(self, proof: str, *, prelude: str = "") -> FormalVerdict:
        ok = "theorem" in proof and "sorry" not in proof
        return FormalVerdict(
            verified=ok,
            available=True,
            backend="stub-kernel",
            detail="accepted" if ok else "kernel rejected the proof: contains sorry",
        )


async def test_unavailable_verifier_never_passes_and_is_pending(monkeypatch):
    verdict = await UnavailableFormalVerifier().verify("theorem t : True := trivial")
    assert verdict.verified is False and verdict.available is False

    # With no toolchain a formal proof is pending review, not failed: confidence
    # 0.0 signals "route to a human", and it is not correct. Pin the unavailable
    # verifier so the assertion holds regardless of AXIOM_FORMAL_VERIFIER in the
    # environment (a Lean-configured container would otherwise verify it).
    monkeypatch.setattr(formal, "get_formal_verifier", lambda: UnavailableFormalVerifier())
    outcome = await grade_formal_proof("theorem t : True := trivial")
    assert outcome.grader == "formal"
    assert outcome.is_correct is False
    assert outcome.confidence == 0.0


async def test_formal_item_accepts_only_kernel_verified(monkeypatch):
    monkeypatch.setattr(formal, "get_formal_verifier", lambda: _StubKernel())

    verified = await grade_formal_proof("theorem add_comm_ex : 1 + 1 = 2 := by decide")
    assert verified.is_correct is True
    assert verified.grader == "formal" and verified.confidence == 1.0

    broken = await grade_formal_proof("theorem add_comm_ex : 1 + 1 = 2 := by sorry")
    assert broken.is_correct is False
    # A checked failure is a confident (not pending) result.
    assert broken.grader == "formal" and broken.confidence == 1.0


@pytest.mark.skipif(shutil.which("lean") is None, reason="no Lean toolchain installed")
async def test_real_lean_accepts_and_rejects():
    # A real Lean elaboration is slow (tens of seconds cold); give it generous
    # headroom so it is not tipped over by load when run in the full suite.
    verifier = LeanVerifier("lean", timeout_seconds=120.0)
    good = await verifier.verify("theorem t : True := trivial")
    assert good.verified is True
    bad = await verifier.verify("theorem t : False := trivial")
    assert bad.verified is False and bad.available is True
