# services/xr-labs — DEPRECATED (retired 2026-07-14, XR-5)

This standalone XR service is **not part of the running platform** and is kept
only for git archaeology. Its compose block was removed; nothing builds, runs,
or imports from this directory.

## What replaced it

| concern | owner today |
|---|---|
| Experiences, sessions, ratings, XP | `services/api-core/app/api/v1/endpoints/xr.py` (`/api/v1/xr/*`) |
| Schema (`xr_experiences`, `xr_sessions`, assets, projects, templates) | `eureka/ops/db/22_xr_labs.sql` |
| Scene graph contract (builder ↔ viewer) | `apps/web/src/lib/xr/scene-serializer.ts` |
| Session tracking for built-in portals | `apps/web/src/lib/xr/use-xr-session.ts` |
| Asset files | `services/file-storage` (glTF magic-byte validated; public read for `xr-assets/`) |
| UI | `apps/web/src/app/dashboard/xr-labs/*` (hub, viewer, scene builder, solar-system / molecules / anatomy portals) |

## Why it was retired

- Zero consumers: nothing in the frontend or any service called it. The
  frontend's old `:3005/api/xr` target never existed at all.
- Superseded: every endpoint it defined is served by api-core against the same
  tables, with auth, tenancy (org-stamped sessions), and XP wired in.
- Internally inconsistent: it shipped Node/Express sources (`package.json`,
  `src/app.ts`) while its compose block ran `uvicorn main:app` — the two halves
  never agreed on what the service even was.
- Its own `schema.sql` duplicated (and drifted from) the canonical ops SQL.

Register: closes the XR slice of P2-1 (services with zero consumers) and P2-3
(facade services). See `docs/XR_LABS_BUILD_PROMPT.md` (G8).

**Do not build on this directory.** Extend api-core's `xr.py` instead.
