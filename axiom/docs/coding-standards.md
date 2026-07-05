# AXIOM Coding Standards

These are the standards every change to AXIOM follows. They apply to human and AI contributors equally. They exist to keep the codebase honest, safe, and easy to extend as modules move from scaffold to done.

## Typed, tested, documented

- **Typed.** All Python is type-annotated and passes the type checker. All frontend code is TypeScript with strict settings. Public functions and module boundaries carry explicit types.
- **Tested.** New behavior ships with tests. Grading, mastery, and adaptive logic in particular are covered by unit tests, because they are the parts a user trusts to be correct. A change that cannot be tested is a signal that the boundary is wrong.
- **Documented.** Public modules and non-obvious logic carry docstrings or comments that explain intent and safety-critical decisions, not just mechanics. User-facing copy is documented where behavior is not self-evident.

## Pydantic v2 as the source of truth

- Data shapes are defined once, as Pydantic v2 models, and reused for request and response schemas, settings, and internal contracts.
- Do not hand-maintain a second copy of a shape in an ad hoc dict or a loose TypedDict when a Pydantic model already defines it. The model is the source of truth; other layers derive from it.

## Alembic for every schema change

- Every change to the database schema has an Alembic migration. No exceptions, no out-of-band DDL.
- Migrations are reviewed like code. `alembic upgrade head` on a fresh database must produce the current schema. ORM models and migrations are kept convergent per object, not by blind autogenerate.

## An ADR per significant decision

- Any decision that shapes architecture, a cross-module contract, a security boundary, or a model choice gets an Architecture Decision Record under `docs/adr/`, numbered in sequence.
- An ADR states Context, Decision, and Consequences, and lists Alternatives considered where they clarify the choice. When a later decision changes an earlier one, add a new ADR and note the supersession rather than silently editing history.

## ASCII-only punctuation in generated docs and copy

- Documentation and product copy generated for AXIOM use ASCII punctuation only: plain hyphen `-`, period, comma, parentheses, and colon.
- No em dashes, no en dashes, no ellipsis characters, no smart or curly quotes. This is a hard acceptance criterion, checked before a doc is considered done.

## Metadata lists only languages actually used

- Project metadata (package classifiers, language tags, manifests, and similar) lists only the languages AXIOM actually uses: Python and TypeScript, plus SQL for the database. Low-level systems languages are not part of the stack and are not listed anywhere in metadata.

## Honest status calibration

- Status is reported honestly. A module is `done` only when it is implemented and tested to the level its phase requires. `scaffold` means a placeholder, and `planned` means not built.
- Never describe a planned module as done in a README, a status file, a commit message, or product copy. `docs/STATUS.md` is the single calibrated source and is updated at the close of every phase.

## AI features labeled and human-overridable

- Every AI-produced output (copilot suggestions, tutoring hints, any generated content or score influenced by a model) is clearly labeled as AI-produced in the interface.
- Every AI feature is human-overridable. A teacher or the learner can override, correct, or dismiss an AI output, and mastery and grading decisions that a model influences carry the evidence trail that lets a human inspect and reverse them (see ADR 0002, ADR 0003, and ADR 0004).

## Safety in grading

- User-supplied math is never passed to `eval` or `exec`. Parsing is restricted (see `packages/math_core`), and evaluation runs under a wall-clock timeout inside sandboxed workers. Safety-critical code paths are documented as such and covered by tests.
