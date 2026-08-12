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
| Escalation storage | `help_requests` (`ops/db/26_help_requests.sql`, migration `help_requests_001`) |
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

## Escalation goes somewhere real

A row in `help_requests`, with a short reference the person can quote, the page
they were on, and which topics the helper matched before giving up. An
administrator sees the queue and resolves it; a learner asking for the queue
gets a 403.

The unanswered questions are the product feedback. `topic_keys` records what
was matched, so a cluster that all matched the same topic means that topic's
help text is **wrong**, while a cluster matching nothing means it is
**missing**.

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
