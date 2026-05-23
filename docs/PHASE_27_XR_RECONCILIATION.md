# Phase 27 — XR microservice reconciliation

> **Phase 27 deliverable.** Documented decision on how to resolve the
> mismatch between the Three.js frontends and the actual XR backend.

## The mismatch

| Component | Implementation | Port | Path style |
|---|---|---|---|
| `/dashboard/xr-labs/scene-builder/page.tsx` | Three.js editor in the browser | calls `:3005/api/xr/*` | RESTful Node-style |
| `/dashboard/xr-labs/experience/[id]/page.tsx` | Three.js viewer + WebXR | calls `:3005/api/xr/*` | RESTful Node-style |
| `services/xr-labs/` | **Python FastAPI** | actually listens on `:8070` | `/api/v1/experiences/*` style |

The frontend Three.js editor was authored against a Node prototype on
`:3005` (probably an early-Phase-2 XR microservice that never landed
in this repo). The actual deployed service is a Python FastAPI app on
`:8070` with completely different endpoint shapes. They don't match —
even if both are running, the Three.js editor can't talk to the Python
service.

Surfaced during Phase 19. The Phase 19 microservice-down gate
correctly shows a clean "start the XR microservice" page when `:3005`
is unreachable — which it always is, because no service serves that.

## Three options

### Option A — Port the frontend to match the Python service (recommended)

**Effort**: 1–2 weeks. **Cost**: low. **Risk**: low.

1. Audit `services/xr-labs/app/api/` for the real Python endpoints
   (probably `/api/v1/experiences`, `/api/v1/scenes`, `/api/v1/assets`).
2. Update `eureka/apps/web/src/app/dashboard/xr-labs/scene-builder/page.tsx`:
   - Change `API_BASE_URL` from `http://localhost:3005/api/xr` to
     `http://localhost:8070/api/v1` (in dev) or the deployed URL
   - Map old endpoints to new:
     - `GET /api/xr/asset-library/search` → `GET /api/v1/assets?q=...`
     - `GET /api/xr/scene-builder/templates` → `GET /api/v1/scenes/templates`
     - `POST /api/xr/scenes` → `POST /api/v1/scenes`
3. Same for `experience/[id]/page.tsx`: `/api/xr/experiences/{id}` →
   `/api/v1/experiences/{id}`.
4. Update Phase 19 microservice-health-gate to check the right URL.

**Why this is the right call**:
- The Python service is the deployed reality (it builds + runs + exists
  in `docker-compose --profile full`)
- The Node frontend Three.js code is good and works — it's just pointed
  at the wrong URL
- Smallest surface area to change

### Option B — Reimplement the Python service in Node to match the frontend

**Effort**: 4–8 weeks. **Cost**: high. **Risk**: medium.

Rewrite `services/xr-labs/` in Node (Express or Fastify) with the
endpoint shapes the Three.js editor expects. Keep all the existing
features.

**Why probably not**:
- Throws away a working Python service
- The Python service shares code with `shared/` (event bus, service
  client, JWT verifier) which would need to be ported
- Doesn't add functionality

### Option C — Run BOTH services side by side with a Node shim

**Effort**: 1 week. **Cost**: medium operational. **Risk**: low.

Add a thin Node proxy on `:3005` that translates the legacy Node-style
calls into the new Python-style calls and forwards to `:8070`.

**Why probably not**:
- More services to deploy + monitor
- Translation layer is one more thing to break
- The proxy IS just doing what option A does in code

## Recommended action

**Pick Option A.** Concrete steps:

```bash
# 1. Inspect the real Python endpoints
docker compose --profile full up -d xr-labs
curl -s http://localhost:8070/docs | head -100
# OR
ls services/xr-labs/app/api/

# 2. Map the endpoints (one-off table in eureka/apps/web/docs/xr-endpoint-map.md)

# 3. Edit the 2 frontend pages
$EDITOR eureka/apps/web/src/app/dashboard/xr-labs/scene-builder/page.tsx
$EDITOR eureka/apps/web/src/app/dashboard/xr-labs/experience/[id]/page.tsx

# 4. Update the Phase 19 microservice-down gate URLs

# 5. Smoke-test:
#    - start xr-labs container
#    - load /dashboard/xr-labs/scene-builder
#    - confirm assets + templates load
#    - drag-drop a glTF, save scene
#    - confirm scene appears at /dashboard/xr-labs/experience/<new id>

# 6. Re-run the Phase 19 graceful-degradation case (kill xr-labs):
#    - the page should still show the friendly "start the microservice" gate
```

## Also worth considering

While reconciling, take the opportunity to:

- **Move XR assets to S3/MinIO** rather than persistent volume (Phase 20
  already uses S3; xr-labs has `xr_simulations` volume in docker-compose)
- **Wire the WebXR session attempt-log** that Phase 19 noted is missing:
  when a learner finishes a scene, POST an `attempt_logs` row (Phase 7.2
  shape) so XR sessions feed into IRT calibration + analytics like any
  practice question. This closes the loop from "VR demo gallery" to
  "graded VR module."
- **Tag XR experiences with `skill_code`** so the Phase 4.5 recommender
  surfaces them as a real option when a learner is weak in a skill.

## Timeline

| Day | Work |
|---|---|
| 1 | Audit Python endpoints, write the endpoint-map doc |
| 2 | Port scene-builder/page.tsx |
| 3 | Port experience/[id]/page.tsx |
| 4 | Update Phase 19 health-gate URLs + add e2e test |
| 5 | Smoke-test against running xr-labs container |
| 6–7 | Polish + ship the WebXR → attempt_log integration |
| 8 | Tag XR experiences with skill_code (DB migration + admin UI) |
| 9 | Verify recommender surfaces XR experiences for relevant skills |
| 10 | Done — merge + close Phase 27 |
