"""The lesson arc, as a type.

Binding, from axiom_teaching_model.md section 3. Every lesson has the same six
parts and the compliance checker rejects a lesson missing any of them:

  objective       what the learner will be able to do
  build_on        one line connecting to the prerequisite node, because new
                  knowledge attaches to old or attaches to nothing
  core_idea       the concept, concrete before abstract
  worked_example  one complete model of the skill
  try_it          a retrieval question the learner answers before revealing
                  the answer (the loader renders the answer click to reveal)
  pitfall         the misconception most likely to bite, named

Reading fluency is not learning. The try_it plus the item bank plus spaced
review is where learning happens, and the arc exists to push the learner there.
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Lesson:
    node: str
    objective: str
    build_on: str
    core_idea: str
    worked_example: str
    try_it_prompt: str
    try_it_answer: str
    pitfall: str
    # Optional link into the misconception library. When set it must be a code
    # that exists, and the compliance checker enforces that.
    misconception: str | None = None
    # Chemical facts this lesson asserts, in a form that can be re-derived from
    # structure. The compliance checker fails the build when one does not hold.
    #
    # Empty is legal, because a lesson about laboratory safety or about what a
    # reaction mechanism means has no structural claim to make. It is not legal
    # for an organic lesson that states a configuration, a formula, an isomer
    # relationship or an integration ratio: those go here as well as in the
    # prose, and a test enforces that for ORG nodes.
    claims: tuple = ()

    def parts(self) -> dict[str, str]:
        return {
            "objective": self.objective,
            "build_on": self.build_on,
            "core_idea": self.core_idea,
            "worked_example": self.worked_example,
            "try_it_prompt": self.try_it_prompt,
            "try_it_answer": self.try_it_answer,
            "pitfall": self.pitfall,
        }

    def missing_parts(self) -> list[str]:
        return [name for name, text in self.parts().items() if not str(text).strip()]
