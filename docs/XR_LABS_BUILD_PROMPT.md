# XR Labs — Build Prompt (fix gaps, enhance, make fully functional)

Authored 2026-07-14 from a line-level audit of every XR surface in the repo.
This is the execution contract for the dedicated XR Labs session(s). Work the
waves in order; each wave ends verified-live, committed, and pushed.

---

## 0. Mission

Make XR Labs a **complete, honest, closed-loop product**: a learner can browse
real experiences, run them in the browser (WebXR optional, never required),
have their session/completion/rating recorded and feed XP; an author can build
a scene, save it, re-open it, publish it, and **actually see that scene** when
launched; assets can be uploaded, not just hotlinked; and the two advertised
"coming soon" portals exist for real. No fake counters, no dead microservice
copy, no publish-to-nothing.

---

## 1. Verified current state (evidence, not vibes)

### What already works
- **api-core owns XR** at `/api/v1/xr/*`
  ([xr.py](../eureka/services/api-core/app/api/v1/endpoints/xr.py), 419 lines,
  deliberate `text()` SQL against tables from
  [ops/db/22_xr_labs.sql](../eureka/ops/db/22_xr_labs.sql)):
  experiences list/get (public), session start/end (auth, owner-scoped),
  scene templates, asset search, asset use-count, scene-project create/update,
  and publish-project→experience.
- **Hub page** `/dashboard/xr-labs`
  ([page.tsx](../eureka/apps/web/src/app/dashboard/xr-labs/page.tsx), 421
  lines) — real data (experiences from `/xr/experiences`, XR-tagged resources,
  study-set collections). Sidebar canonically links here; the old `(dashboard)`
  route-group tree is redirects only.
- **Experience viewer** `/dashboard/xr-labs/experience/[id]`
  ([page.tsx](../eureka/apps/web/src/app/dashboard/xr-labs/experience/%5Bid%5D/page.tsx),
  458 lines) — three.js desktop preview + WebXR VR/AR launch + session
  tracking wired through the shared `api()` client.
- **Scene builder** `/dashboard/xr-labs/scene-builder`
  ([page.tsx](../eureka/apps/web/src/app/dashboard/xr-labs/scene-builder/page.tsx),
  1101 lines) — OrbitControls + TransformControls editor, template health-gate,
  asset panel, save (POST/PUT), publish dialog.
- **Solar System Explorer** `/dashboard/xr-labs/solar-system` (2287 lines +
  real moon-texture data) — genuine, self-contained three.js portal.
- **Seed data live in `eureka` DB**: 4 published experiences (3 with external
  demo glTF URLs), 3 scene templates, 6 assets in 6 categories, 1 saved
  project, 1 session row.

### The defects and gaps (numbered — referenced by the waves)

| # | severity | finding | evidence |
|---|----------|---------|----------|
| G1 | **P0** | **The authoring loop is broken at the last step.** Publishing a scene-builder project creates an experience with `scene_url=''`; the viewer only knows how to load a glTF from `scene_file_url`, so every published scene renders as an empty void. Admitted in code: "the viewer renders an empty lit scene until a renderer that consumes scene_data is wired." | xr.py:374-379; viewer page.tsx:127 |
| G2 | **P0** | **Saved projects are unrecoverable.** There is no `GET /xr/scene-builder/projects` (list or by-id) on the backend and no "My projects / Open" UI in the builder. Save works; re-opening after leaving the page is impossible. Refresh = work gone from reach (row exists in DB, unreachable from UI). No DELETE either. | xr.py (grep: zero GET project routes); scene-builder page.tsx:527 |
| G3 | P1 | **Session data is largely fiction.** Desktop preview (the mode everyone actually uses) never starts a session — only VR/AR launches do. On VR end, completion is hardcoded `100` and rating hardcoded `5`. AR starts a session and never ends it. `avg_rating` on experiences is never recomputed from any rating. No "my session history" endpoint or UI. | viewer page.tsx:140-160, 236-244, 254-280; xr.py:146-189 |
| G4 | P1 | **No XP/engagement integration.** Completing an XR session awards nothing; `XP_RULES` has no XR source. Engagement engine (`record_activity`) is one import away. | api-core app/services/engagement.py:35-43 |
| G5 | P1 | **Asset library is hotlinks only.** All 6 assets point at `modelviewer.dev` (external host — offline/dev-privacy liability). No upload path, although the file-storage service with magic-byte validation already exists (P2-15 closed). glTF/GLB signatures are not yet in its allow-list. | xr_3d_assets rows; file-storage app/api/v1/files.py |
| G6 | P1 | **Two advertised portals are placeholder cards.** "Organic Chemistry 3D — coming up next" and "Anatomy 3D — planned" ship as disabled cards on the hub. Ship them or drop them; a "coming next" card from a June build is a broken promise. | hub page.tsx:186-219 |
| G7 | P2 | **Stale/false copy on the hub.** Header says experiences "run via the separate `services/xr-labs/` Node microservice" — false since Phase 19; they run via api-core. Same claim repeated in the subroute blurb. | hub page.tsx:130-135 |
| G8 | P2 | **Zombie Node microservice.** Root `services/xr-labs/` (Express+TS, own schema.sql, own analysis doc) is profile-gated in compose, not running, and fully superseded by api-core `/xr`. Its stats endpoint was already zeroed for honesty. Per register P2-1: integrate-or-delete — decide and execute. | services/xr-labs/; docker-compose.yml:680-699 |
| G9 | P2 | **Builder is capability-thin and type-unsafe.** Only 3 primitives (box/sphere/cylinder); `// @ts-nocheck` at the top; mixes raw `fetch`+`localStorage` with the shared `api()` client; publish dialog promises "Meta Quest, HTC Vive" availability it can't know. | scene-builder page.tsx:1, 335-341, 423-426, 1082 |
| G10 | P2 | **Viewer robustness.** `GLTFLoader.load()` has no error/empty-URL handling (bad URL = silent black void, no message); no fallback environment; `supported_devices` is hardcoded server-side so the AR button logic is decorative. | viewer page.tsx:122-129, 214-216; xr.py:50 |
| G11 | P3 | Experiences/sessions carry no `org_id` (P2-8 pattern). Catalog rows are global-by-design (like item_bank) — fine — but session rows are learner data: self-scoped today, org-stamp them for staff dashboards later. | xr_sessions columns |
| G12 | P3 | Duplicate route trees still exist (`(dashboard)/xr-labs/*` redirects). Harmless, but the redirect stubs carry a TODO to audit divergence — close it out. | (dashboard)/xr-labs/* |

---

## 2. Ground rules (unchanged program invariants)

- **Honesty over polish**: no fake counters, no "available on Quest/Vive"
  claims for scenes that are JSON primitives, no placeholder cards presented
  as products. If a thing is schematic (Anatomy 3D), label it schematic.
- **Every wave ends live-verified** (curl + in-app browser against the running
  stack), committed with trailer
  `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`, and pushed to
  `main`. Never force-push.
- **Schema changes**: `xr_*` tables have no alembic. Extend
  `eureka/ops/db/22_xr_labs.sql` (canonical DDL) **and** apply live via
  idempotent `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` through psql at deploy
  time. Never a destructive change.
- **Tenancy**: follow the P2-8 pattern (owner always; staff same-org via
  org_id stamped from the JWT; NULL = owner-only). Sessions get org_id (G11);
  the public catalog stays public.
- **Frontend**: use the shared `api()` client everywhere (it attaches the
  token); no new `localStorage.getItem('access_token')` call sites. New pages
  must pass `tsc` — no new `@ts-nocheck`.
- After frontend waves: rebuild `eureka-web`; after backend waves: restart
  (bind-mounted) then rebuild `eureka-api-core` at ship time.

---

## 3. Build waves

### XR-1 — Close the authoring loop (G1 + G2) — the reason this prompt exists
1. **Backend** (xr.py):
   - `GET /xr/scene-builder/projects` — caller's projects (id, name, category,
     updated_at, is_public), newest first.
   - `GET /xr/scene-builder/projects/{id}` — owner-scoped, returns full
     `scene_data`.
   - `DELETE /xr/scene-builder/projects/{id}` — owner-scoped.
   - Publish carries the scene across: add `scene_data jsonb` (and
     `source_project_id uuid`) to `xr_experiences` (DDL rule above); publish
     copies the project's scene_data; `_map_experience` returns it.
2. **Viewer**: a `renderSceneData(scene, sceneData)` path — when
   `scene_file_url` is empty but `scene_data` present, reconstruct the scene
   graph the builder writes (primitives: type/position/rotation/scale/color;
   asset refs: load their glTF URLs; lights; ground). Shared module so builder
   and viewer can't drift: `src/lib/xr/scene-serializer.ts` (types + render).
3. **Builder**: "My projects" panel (list/open/delete via the new endpoints);
   loading restores objects through the shared serializer.

**Accept when (live)**: build a 3-object scene → Save → hard-reload → Open from
My Projects (objects intact) → Publish → hub shows it → launching it renders
the actual objects, not a void. Cross-user check: another token cannot GET/
DELETE the project (403/404).

### XR-2 — Real sessions, ratings, XP (G3 + G4 + G11)
1. Desktop preview counts: start a session on viewer mount (device
   `web_browser`), end on unmount/`beforeunload` with real elapsed-derived
   completion (`min(100, elapsed/duration)`), no fabricated 100%.
2. Rating comes from the user: small end-of-session dialog (1–5 stars,
   skippable). Remove hardcoded `user_rating: 5`.
3. `POST /xr/sessions/{id}/end` recomputes the experience's `avg_rating`
   (mean of non-null session ratings) and stamps session `org_id` from the JWT
   (column via DDL rule).
4. `GET /xr/me/sessions` (history w/ experience titles) + "Recently explored"
   strip on the hub.
5. XP: add `xr_session_completed: 25` to `XP_RULES`; `end_session` calls
   `record_activity(...)` when completion ≥ 50%. End AR sessions properly
   (G3's leak).

**Accept when**: finish a session with rating 4 → experience `avg_rating`
reflects it; `/me/engagement` XP rises by 25 exactly once per session;
history shows the run; org_id present on new session rows.

### XR-3 — Asset upload pipeline (G5)
1. file-storage: add GLB magic (`glTF` bytes 0-3) + `.gltf` JSON allow-list
   entries; category `xr-asset`.
2. `POST /xr/asset-library/assets` (auth): register an uploaded file (name,
   category, file_url from file-storage, format, thumbnail optional).
3. Builder asset panel: Upload button → file-storage → register → appears in
   panel and is placeable. Keep the 6 modelviewer.dev samples but badge them
   "external sample".

**Accept when**: upload a real .glb through the UI → place it in a scene →
save → publish → viewer renders it. A .exe renamed .glb is rejected (magic
check), verified live.

### XR-4 — Ship the promised portals (G6)
1. **Organic Chemistry 3D** `/dashboard/xr-labs/molecules`: self-contained
   three.js ball-and-stick viewer from internal coordinate data (≥8 molecules:
   methane, ethane, ethene, ethyne, ethanol, acetic acid, benzene, caffeine),
   click-for-facts (hybridization, bond angles, polarity), rotate/zoom — same
   craft bar as solar-system, zero external assets.
2. **Anatomy 3D** `/dashboard/xr-labs/anatomy`: layered schematic body
   (skeletal → organs → circulatory toggles) from procedural/primitive
   geometry, click-for-facts per structure. Label prominently: *schematic,
   not anatomically exact*.
3. Register both as `xr_experiences` rows whose scene_url is the internal
   route (viewer redirects to internal routes instead of GLTF-loading them),
   so sessions/ratings/XP flow identically. Hub "Built-in portals" cards all
   become live links.

**Accept when**: both portals interactive in the in-app browser; sessions
recorded; no external network fetches (verify via network log); no
"coming soon" cards remain.

### XR-5 — Topology + honesty cleanup (G7 + G8 + G9 + G10 + G12)
1. Retire `services/xr-labs/` Node service: delete its compose block, mark the
   directory `DEPRECATED.md` (points to api-core xr.py + 22_xr_labs.sql as the
   owners), update Gap Register rows P2-1/P2-3 (xr slice) and this doc.
2. Fix hub copy (G7): experiences run via api-core — say so.
3. Builder hygiene (G9): remove `@ts-nocheck` (type the three.js usage),
   replace raw fetch+localStorage with `api()`, add cone/torus/plane/text
   primitives, fix the publish-dialog device claims to match reality.
4. Viewer robustness (G10): loader error → visible toast + fallback grid
   environment; `supported_devices` derived from what the experience actually
   is (internal portal vs glTF vs scene_data).
5. Delete the `(dashboard)/xr-labs` redirect stubs' stale TODOs after a quick
   divergence check (G12).

**Accept when**: `tsc` + `next build` clean; hub copy truthful; compose up
works with the xr-labs block gone; register updated.

### XR-6 — Ship: verify, rebuild, document
1. Full-loop live run in the in-app browser as a real learner token: hub →
   portal → experience → session+rating → XP visible on dashboard → builder →
   save/reopen → upload asset → publish → view published scene.
2. `tsc`, `next build`, targeted pytest for xr endpoints (new file
   `eureka/services/api-core/tests/integration/test_xr.py` — happy paths +
   ownership 403s).
3. Rebuild images: `docker compose build web api-core` (+ file-storage if
   touched), force-recreate, re-smoke.
4. Update `docs/EUREKA_GAP_REGISTER.md` (P2-1/P2-3 xr slices, note G-numbers
   closed) and this file's status column. Commit + push each wave separately.

---

## 4. Live verification protocol (used by every wave)

```bash
# tokens: mint HS256 (secret eureka_dev_secret_key_change_in_production,
# claims sub/role/org_id/type=access/exp) for a real student + a second user
curl -s localhost:8000/api/v1/xr/experiences | jq '.experiences | length'
# session lifecycle
curl -s -X POST localhost:8000/api/v1/xr/sessions/start -H "Authorization: Bearer $T" \
  -H 'Content-Type: application/json' -d '{"experience_id":"<id>","device_type":"web_browser"}'
curl -s -X POST localhost:8000/api/v1/xr/sessions/<sid>/end -H "Authorization: Bearer $T" \
  -H 'Content-Type: application/json' -d '{"completion_percentage":80,"user_rating":4}'
# ownership: second token must 404/403 on the first user's project/session ops
```
Browser: inject token into `localStorage.access_token` at `localhost:4040`,
walk the loop, check `read_console_messages` for zero errors and the network
log for no unexpected external hosts.

---

## 5. Status

| wave | scope | status |
|------|-------|--------|
| XR-1 | authoring loop (G1, G2) | DONE 2026-07-14 — project list/get/delete endpoints (owner-scoped, cross-user 404 verified); publish copies scene_data + source_project_id; shared serializer `src/lib/xr/scene-serializer.ts`; viewer renders scene graphs (verified in browser: published scene shows its objects); builder My Projects open/delete + template restore actually instantiates objects now; bonus: three-r169 TransformControls gizmo restored via getHelper() (drag-manipulation had been silently dead) |
| XR-2 | sessions/ratings/XP (G3, G4, G11) | DONE 2026-07-14 — desktop viewing starts a real session (was VR-only); completion is elapsed-derived (browser session recorded 9%, honest); rating comes from a user dialog (verified 4★ click → DB row); end is idempotent (re-end keeps original values, no double XP); avg_rating recomputed from actual session ratings (4.00/cnt 2 live); +25 XP via engagement engine on ≥50% completion (verified +35 incl. streak bonus, awarded once); org_id stamped on sessions; GET /xr/me/sessions + hub "Recently explored" strip verified in browser; VR/AR reuse the page session (AR leak closed, hardcoded 100%/5★ removed) |
| XR-3 | asset uploads (G5) | DONE 2026-07-14 — file-storage allows .glb/.gltf with glTF magic-byte validation (MZ-executable and junk-renamed-.glb both rejected live); public read route serves ONLY xr-assets/ glTF files (traversal + foreign-extension 404, authed routes still gated) because GLTFLoader can't send a bearer; POST /xr/asset-library/assets registers uploads (auto "Uploads" category); builder gained an Upload button, honest model count (fake "10,000+ models" copy removed), and "external sample" badges on modelviewer.dev hotlinks. E2E verified: real 2.8MB Astronaut GLB uploaded → publicly served byte-perfect → registered → placed in a builder scene in-browser |
| XR-4 | molecules + anatomy portals (G6) | DONE 2026-07-14 — both "coming soon" cards are now real, self-contained three.js portals. Molecules: 10 molecules (methane→caffeine) with real coordinate data, bond-order rendering (1/2/3 rods), click-for-facts per atom (element + hybridization), geometry/polarity per molecule, labeled "idealized geometries". Anatomy: 23 structures across 3 toggleable layers (skeletal/organs/circulatory), click-for-facts, prominently labeled "schematic — not anatomically exact"; verified live: hiding skeletal drops 23→13 structures, Heart selection shows its facts. Both registered as xr_experiences whose scene_url is an internal route; new shared `useXrSession` hook gives them the same session/rating/XP contract (verified: session auto-started on load, auto-ended on leave); viewer redirects internal-route experiences instead of GLTF-loading them; hub cards live + portal duplicates filtered from the Experiences grid. Network log: zero external hosts |
| XR-5 | topology + honesty (G7–G10, G12) | pending |
| XR-6 | verify + rebuild + register | pending |
