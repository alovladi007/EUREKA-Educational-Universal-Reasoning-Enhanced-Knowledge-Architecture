# The in-app helper

Built 2026-08-12. A Help button on every dashboard page that answers "how do
I ...?" from what the platform actually does, and hands anything else to a
human.

## The design rule

**Answer from what EUREKA actually has, or escalate. There is no third branch.**

A support helper that improvises is worse than no helper. It describes a button
that was never built, the person hunts for it, fails, and opens a ticket
anyway — later, and with less trust than they started with. So the helper is
given exactly two sources of grounding and nothing else — the team's published
KB articles, and a registry of the modules that exist — and a weak match is
treated as no match.

## What it is made of

| Piece | Where |
|---|---|
| The registry: 18 modules, their routes, and what people do in them | `services/api-core/app/services/help_registry.py` |
| Matching and the refusal rules | `services/api-core/app/services/help_service.py` |
| Endpoints | `services/api-core/app/api/v1/endpoints/help.py` |
| Escalation | **the existing `support_tickets` queue** (gtm.py) — no new storage |
| Answer content | **the published KB** (`kb_articles`) + the module registry |
| The widget | `apps/web/src/components/help/HelpWidget.tsx`, mounted in `app/dashboard/layout.tsx` |
| Registry tests | `services/api-core/tests/test_help_registry.py` |

    POST /api/v1/help/ask         question -> answer or hand-off
    GET  /api/v1/help/topics      the module registry, for suggestions
    POST /api/v1/help/escalate    opens a SupportTicket in the existing queue

There are no admin endpoints here on purpose: `/me/tickets`,
`/tickets/{id}/reply` and `/admin/tickets/{id}` already exist and are better.

## Three things it refuses to do

1. **Guess.** No match means it says so and offers a human. Verified: "asdkjhasd
   qwe zzz" and "it is broken" both match nothing and escalate.
2. **Decide.** Refunds, cancellations, account deletion, another user's data,
   security incidents — these are decisions, not instructions. They escalate
   even when a topic would have matched, because a helper that invents a refund
   policy has made a promise the platform must then keep or publicly break.
3. **Claim to be AI when it is not.** Same rule as AXIOM's tutor: the reply says
   "Assembled from this platform's own help material, not written by AI" unless
   a model actually wrote it.

A policy question still escalates, but shows the published answer first where
one exists. Stating "refunds are available within 7 days" is a fact the KB is
allowed to make; deciding one person's refund is not. Only `is_published`
articles are ever read — a draft is something the team has not agreed to say
yet, and quoting one publishes it by accident.

## It owns no storage and no queue

The first version of this created a `help_requests` table and its own admin
endpoints. That was a duplicate, and it was caught before it shipped: EUREKA
already has support tickets (`/me/tickets`, `/tickets/{id}/reply`,
`/admin/tickets/{id}`, with status, priority, category, assignment and a
threaded conversation) and a published knowledge base (`/kb`).

Two queues means half the questions land where nobody is looking, and the "we
answer within one business day" promise on the Help Center only covers one of
them. So the helper is a front door, not a system:

- **answers** come from the KB articles the team writes, plus the module
  registry for "where is X" questions the KB does not cover
- **escalation** opens a real `SupportTicket` in the existing queue, with the
  page they were on and what the helper tried before giving up attached, so
  triage does not start from a bare sentence

The table, its migration and its SQL were reverted; the migration was
downgraded on the live database.

**How the failure was made:** I grepped `app/api/v1/__init__.py` for "support"
and "ticket", found nothing, and concluded no ticket system existed. It is all
inside the `gtm` router, so neither word ever appeared. Listing the routes
would have found it in one command; searching for a word I expected did not.

## The Help Center content it depends on

All 11 KB articles found on 2026-08-12 were test fixtures written into the real
database by a test run — random hex slugs (`refund-0813`, `howto-36ca`),
created in a burst on 2026-05-17, one with a body of literally `x`. That is why
the Help Center listed "Refund Policy" five times.

One was published and stated a 30-day refund window. The real policy is 7 days.
That was a live, wrong, public promise, and the kind of thing this helper's
escalation rules exist to avoid it ever *adding* to. The 11 are deleted (backed
up to `ops/db/backups/`) and replaced with one accurate Refund Policy article.

## Keeping it honest

`tests/test_help_registry.py` fails the build if a registry route stops
existing — a helper whose links 404 is worse than no helper. It cannot check
that a description is still true; that is on whoever changes the module.

Two bugs the tests caught during the build, both worth recording:

- The matcher scored a listed task at 0.75 per overlapping word, below the
  threshold for short questions. "where do I see my progress" and "where are
  the practice questions" both fell through to escalation — the safe direction,
  but useless. The task list is literally the set of "how do I ...?" sentences
  people type, so it is now the highest-weighted signal (1.25).
- The route checker reported `/launch/axiom` and `/launch/octet` as missing.
  They are real; they are served by `launch/[vertical]`. The **checker** was
  wrong, and would have had someone "fix" two correct registry entries.

## Verified live

18/18 registry routes resolve. 8/8 sample questions match the right module.
Gibberish and vague questions escalate rather than guess. "How do refunds work"
returns the published 7-day article, links `/help/refund-policy`, and still
escalates because the decision is a person's. Escalation opened ticket
`6e0f813f`, which appears in `/me/tickets` as an open **billing** ticket — the
existing queue, not a private one.

## Not built

- No search over lesson *content* — the helper is about using the platform, not
  about the subjects. Subject questions belong to the AI Tutor.
- No email or notification on escalation beyond whatever the existing ticket
  system already sends.
- The KB itself is thin: one article at the time of writing, because the 11
  that were there were test fixtures and were removed. The helper is only ever
  as good as what the team has written.
