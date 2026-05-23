# EUREKA — Mobile + Offline (Phase 25)

> **Phase 25 deliverable.** Detailed implementation plan for the
> React Native shell at `eureka/apps/mobile/`, plus offline-sync UI,
> push notifications, and store submission.

## Current state

`eureka/apps/mobile/` is README-only — no `package.json`, no source.
The Phase 12 backend has the server-side work done:

- **Phase 12.2** — `notification_devices` + `push_notifications` tables
  + dispatch service that fans out per active device. Honors APNs / FCM
  / WebPush when an env key is set, otherwise queues for dev.
- **Phase 12.4** — `offline_bundles` table + ETag-based pack endpoint
  (200 on first call, 304 on `If-None-Match` match — etag is sha256
  of the canonical JSON payload of the learner's weakest-skill items).
  Replay endpoint records offline-captured attempts for later reconciliation.

What's missing is purely client-side.

## Recommended stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **React Native via Expo Router** | Shared knowledge with the Next.js web app; Expo handles native modules without ejecting; Expo Router gives file-based routing similar to Next |
| Auth | localStorage-equivalent via `expo-secure-store` | Phase 3.3 JWT bearer pattern works unchanged |
| Networking | `fetch` (Phase 19 wrapper) | Drop the existing `eureka-api.ts` wrapper in unchanged — same `Bearer` auth, same retry-on-401, same dev-auto-login pattern |
| State | Zustand (matches web) | Local state on top of server state |
| Server state | TanStack Query | Caching + offline-first |
| Offline DB | `expo-sqlite` | Local SQLite for attempt buffer + bundle storage |
| Push | `expo-notifications` | APNs + FCM via Expo's relay (cheaper than rolling your own) |
| UI components | `@gluestack-ui/themed` or `react-native-paper` | Match the look + feel of shadcn/ui where possible |

## Sessions

### 25.1 — Bootstrap (~1 week)

```
cd eureka/apps/mobile
npx create-expo-app@latest . --template tabs
yarn add zustand @tanstack/react-query expo-secure-store expo-sqlite
yarn add expo-notifications expo-router @gluestack-ui/themed
```

Wire the auth flow:
1. `/auth/login` screen — same POST `/api/v1/auth/login`, stash access_token in SecureStore
2. `/(tabs)/index.tsx` — Dashboard equivalent
3. `lib/api.ts` — port `eureka/apps/web/src/lib/eureka-api.ts`, swap `localStorage` for `expo-secure-store`, swap `window.location.replace` for `router.replace`

Deliverable: app boots, signs in, hits `GET /me/dashboard`, renders the 4 counter cards.

### 25.2 — Core surfaces (~2 weeks)

Mirror the web app's most-used surfaces:

| Screen | API |
|---|---|
| Dashboard | `GET /me/dashboard` (Phase 17) |
| Practice | `GET /item-banks`, `POST /attempts` (Phase 5/7) |
| AI Tutor | `POST /agent/sessions`, `POST /agent/sessions/{id}/turn` (Phase 6) — stream tokens via SSE |
| Learner profile | `GET /learner-profile/me` (Phase 4.1) |
| Transcript | `GET /transcript/me` (Phase 4.3) |
| Settings | `GET /settings/*` parity |

Defer: marketplace (complex purchase flow), institutions admin (admin-only).

### 25.3 — Offline mode (~2 weeks)

The hardest piece. Pattern:

1. **Bundle pull on launch** — `GET /me/offline-bundle?If-None-Match=<last_etag>`.
   - On 200: store the JSON payload in expo-sqlite under a `bundles` table; record the new etag.
   - On 304: keep using the local copy.
2. **Practice while offline** — local SQLite tracks attempts in a
   `pending_attempts` table.
3. **Sync on reconnect** — `POST /me/offline-bundle/replay` with the
   pending attempts; on 200, mark them synced; on conflict (e.g. item
   was deleted server-side), drop with a user-visible toast.
4. **Conflict resolution UI** — when an item was modified server-side
   while the user attempted it offline, surface a "this question
   changed — your answer was recorded but the explanation may differ"
   banner.

### 25.4 — Push notifications (~1 week)

1. On first launch: `expo-notifications.getExpoPushTokenAsync()` →
   `POST /me/devices` with `{platform: 'apns'|'fcm', token: '<expo-push-token>'}`.
2. Server side (Phase 12.2): when an event fires that should notify a user
   (streak milestone, new assigned program, live session starting), the
   dispatch service POSTs to `https://exp.host/--/api/v2/push/send` with
   the device tokens.
3. Local handler: tap notification → deep-link via Expo Router to the
   relevant screen (`/practice?session=<id>`, `/dashboard/training`, etc.).

### 25.5 — Store submission (~3 weeks)

App Store + Play Store. Each has its own song-and-dance:

| Store | Required artefacts | Lead time |
|---|---|---|
| **App Store** | $99/yr Apple Developer Program, App Store Connect listing, screenshots in 6.7"/6.5"/5.5"/12.9" sizes, privacy policy URL, age rating questionnaire, export compliance, IDFA disclosure | 2 weeks from submission to review |
| **Play Store** | $25 one-time Google Play Console, target API 34, data-safety questionnaire (lots of FERPA/COPPA disclosure), screenshots, privacy policy URL | 3–7 days review |

Submission checklist lives at `docs/store-submission-checklist.md`
(to be authored in Phase 25.5).

## Pre-launch testing

- **TestFlight** (Apple) — 90-day expiring internal builds, up to 10,000 testers
- **Google Play internal testing** — instant distribution to email-allowlist testers
- Recommend: 50–100 testers (beta cohort from Phase 26.7), 4 weeks of iteration

## Push notification provider decision

| Option | $/month | Pros | Cons |
|---|---|---|---|
| Expo Push (free) | $0 | Simple, no per-message cost | Expo dependency |
| AWS SNS direct | ~$50 @ 100k notifs/mo | Full control, multi-region | More plumbing |
| OneSignal | $0 free tier up to 10k MAU | Slick analytics, web push too | Vendor lock-in |
| Self-hosted (FCM + APNs) | $0 + dev time | No vendor | Higher op load |

Start with Expo Push. Migrate to AWS SNS or self-hosted once monthly
notification volume crosses ~1M/mo (Expo's "Production" tier is $99/mo
at that point).

## Total timeline

| Week | Phase |
|---|---|
| 1 | 25.1 bootstrap |
| 2–3 | 25.2 core surfaces (dashboard + practice + tutor) |
| 4–5 | 25.2 finish + 25.3 offline-mode start |
| 6–7 | 25.3 finish + 25.4 push |
| 8–10 | 25.5 store submission + iteration on TestFlight feedback |
| 11–12 | Public release |

**Hard dep**: Phase 20 (deployment) must be done first — the mobile app
needs a stable prod backend URL.
