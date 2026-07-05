# AXIOM web (@axiom/web)

Phase 0 frontend for AXIOM, the mathematics vertical of the EUREKA platform.

AXIOM is Adaptive eXpert Instruction and Outcome Measurement. This app is the
signed-in dashboard. It reuses EUREKA's authentication: it reads the JWT that
EUREKA's web app stores in localStorage under the key `access_token` and sends
it to the AXIOM API as an `Authorization: Bearer <token>` header.

If there is no token, the app shows a "Sign in through EUREKA to continue"
screen with a link to the EUREKA login page. If a token exists, it loads the
signed-in user and the dashboard summary and renders a grid of module cards.
Modules that are not built yet are labeled "Planned", so the empty state stays
honest - no faked data.

## Stack

- Next.js 14 (App Router)
- React 18
- TypeScript (strict)
- Tailwind CSS
- Playwright for end-to-end tests

## Environment variables

Copy `.env.local.example` to `.env.local` and adjust as needed.

- `NEXT_PUBLIC_AXIOM_API_URL` - base URL of the AXIOM API.
  Default `http://localhost:8400`.
- `NEXT_PUBLIC_EUREKA_LOGIN_URL` - EUREKA login page used by the signed-out
  screen. Default `http://localhost:4040/auth/login`.

## API contract

The app calls these AXIOM API endpoints with the Bearer token:

- `GET /health` returns `{ status, service, version }`.
- `GET /api/v1/me` returns the signed-in user.
- `GET /api/v1/dashboard/summary` returns the user, the module list, and the
  mastery summary (null in Phase 0).

## Commands

Install dependencies:

```
npm install
```

Run the dev server on port 4100:

```
npm run dev
```

Then open http://localhost:4100.

Type-check:

```
npm run typecheck
```

Lint:

```
npm run lint
```

Production build and start:

```
npm run build
npm run start
```

Run end-to-end tests (Playwright stubs the API, so no backend is required):

```
npm run test:e2e
```

## Docker

Build and run the container (serves on port 4100):

```
docker build -t axiom-web .
docker run -p 4100:4100 axiom-web
```
