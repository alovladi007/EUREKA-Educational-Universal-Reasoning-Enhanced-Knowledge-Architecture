"""Copilot: an AI-assisted math tutor grounded in the AXIOM curriculum.

Every copilot response is explicitly AI-assisted, carries the sources it was
grounded in, and is meant to be teacher-overridable. Reasoning sits behind a
swappable provider (ADR 0001) with a deterministic mock fallback so AXIOM runs
end to end without the live EUREKA reasoning core.
"""
