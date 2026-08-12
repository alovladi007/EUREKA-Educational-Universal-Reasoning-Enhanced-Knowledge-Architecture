# The in-app helper

Built 2026-08-12. A Help button on every dashboard page that answers "how do
I ...?" from what the platform actually does, and hands anything else to a
human.

## The design rule

**Answer from the registry, or escalate. There is no third branch.**

A support helper that improvises is worse than no helper. It describes a button
that was never built, the person hunts for it, fails, and emails the
administrator anyway — later, and with less trust than they started with. So
the helper is given exactly one source of grounding
(`app/services/help_registry.py`) and nothing else, and a weak match is treated
as no match.

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

    POST /api/v1/help/ask                     question -> answer or hand-off
    GET  /api/v1/help/topics                  the registry, for suggestions
    POST /api/v1/help/escalate                record it for an administrator
    GET  /api/v1/help/requests                the queue (admin only)
    POST /api/v1/help/requests/{id}/resolve   close one (admin only)

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

18/18 routes resolve. 8/8 sample questions match the right module. Gibberish and
vague questions escalate. Policy questions escalate. A learner escalated a
refund question, got reference `a8d34582`, was refused the admin queue with 403;
an administrator saw it, resolved it, and the open count went to zero.

## Not built

- No search over lesson *content* — the helper is about using the platform, not
  about the subjects. Subject questions belong to the AI Tutor.
- No email or notification on escalation. The row is the record; wiring it to
  the existing notification machinery is the obvious next step.
- No admin UI for the queue yet — the endpoints are there and enforced, but an
  administrator currently reads them through the API.
