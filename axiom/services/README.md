# services

AXIOM runs as a modular monolith in Phase 0: the FastAPI app in apps/api hosts
the domains that are live today (identity and dashboard). This directory holds
one placeholder per planned service so the repository layout matches the build
spec and the future extraction into microservices-lite is a mechanical move,
not a redesign. Each domain already has a bounded module under
apps/api/app/domains, so splitting a service out means lifting that module into
its own deployable behind the same API contract.

Do not treat an empty service directory as a working service. See docs/STATUS.md
for the honest, per-module state.
