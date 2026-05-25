/**
 * LSAT course content (current post-Aug-2024 format).
 * 25 topics covering Logical Reasoning (17) + Reading Comprehension (8).
 *
 * Format reminder:
 *   - 2× LR (≈25 questions each) + 1× RC (≈27 questions). No Logic Games.
 *
 * All content authored from public LSAC descriptions of question types
 * (https://www.lsac.org/lsat/prepare/types-lsat-questions). Worked-example
 * stimuli are ORIGINAL — no disclosed PrepTest items are reproduced verbatim.
 *
 * Topic IDs match `lsat-frequency.ts` exactly.
 */

import type { QuizQuestion } from '@/components/test-prep/cissp/LessonQuiz';

export interface LessonSection {
  id: string;
  title: string;
  content: string;
  examTip?: string;
  importantNote?: string;
  quiz?: QuizQuestion[];
}

export interface TopicLesson {
  topicId: string;
  title: string;
  domainWeight: string;
  overview: string;
  sections: LessonSection[];
  keyTakeaways?: string[];
}

export const LSAT_COURSE: Record<string, TopicLesson> = {

// ═══════════════════════════════════════════════════════════════
// LOGICAL REASONING (LR) — 2 sections × ~25 questions
// ═══════════════════════════════════════════════════════════════

lr_strengthen: {
  topicId: 'lr_strengthen',
  title: `Strengthen Questions`,
  domainWeight: 'Logical Reasoning · ~12% of LR section · Tier: Very High',
  overview: `Strengthen questions ask you to identify the answer choice that, if true, would most support the argument's conclusion. You don't need to prove the conclusion — you only need to make it more likely. Strengthen is one of the three highest-frequency LR types (alongside Weaken and Necessary Assumption) and you should expect 5–6 of them on a scored LR section.`,
  sections: [
    {
      id: 'lr-str-definition',
      title: `1. What a Strengthen Question Is`,
      content: `A Strengthen question presents a short argument (premises + conclusion) and then asks which of five answer choices, **if true**, would most support, justify, or bolster that conclusion.

## 1.1 Standard Question Stems

Recognise a Strengthen prompt by stems like:

- "Which one of the following, if true, **most strengthens** the argument?"
- "Which one of the following, if true, provides the **most support** for the argument's conclusion?"
- "Which of the following, if assumed, would most **help to justify** the reasoning above?"
- "The argument's conclusion would be most strongly supported if which one of the following were true?"

The phrase **"if true"** is the giveaway: you are allowed to bring in new information from the answer choices. Contrast this with Inference / Must Be True questions, where you may NOT bring in outside facts.

## 1.2 Goal

Move the conclusion from "plausible" to "more plausible." You are not asked to prove the conclusion beyond doubt — only to make it MORE likely. A correct Strengthen answer can be a partial boost; it doesn't have to be a knockout.

## 1.3 How Strengthen Differs From Sufficient Assumption

- **Strengthen**: make the conclusion more likely (any degree of support is OK).
- **Sufficient Assumption**: guarantee the conclusion (the gap must be fully bridged).

A Sufficient Assumption answer is always a valid Strengthen answer — but most Strengthen answers are NOT Sufficient Assumptions.`,
      examTip: `Always isolate the conclusion before you look at the choices. If you can't articulate the conclusion in your own words, you will not be able to evaluate which answer supports it. Underline the conclusion indicator words (thus, therefore, so, hence, clearly, must, should).`,
    },
    {
      id: 'lr-str-method',
      title: `2. How to Attack a Strengthen Question`,
      content: `Use a consistent five-step method:

## Step 1 — Read the Stem First
Confirm it really is a Strengthen prompt. Many test-takers misread "strengthen" as "weaken" under time pressure.

## Step 2 — Identify the Conclusion
The conclusion is what the argument is trying to convince you of. Premise words: *because, since, given that, after all*. Conclusion words: *therefore, thus, so, hence, clearly, must, the author concludes*.

## Step 3 — Identify the Argument Gap
What unstated assumption connects the premise to the conclusion? In a Strengthen, you usually want an answer that **confirms** that assumption or **rules out an alternative explanation**.

## Step 4 — Predict (Optional, But Powerful)
Before reading the choices, predict in plain English what the right answer must do. Even a vague prediction filters out 2–3 trap answers immediately.

## Step 5 — Evaluate Each Choice
Ask: "Does this make the conclusion more likely, less likely, or no effect?" Eliminate "no effect" choices first — they are the largest pool of wrong answers.

## Mini Worked Example

> **Stimulus**: City planners argue that adding bike lanes to Main Street will reduce traffic congestion. They cite a study showing that downtown commuters who already bike to work spend 30% less time in transit than those who drive.
>
> **Conclusion**: Bike lanes on Main Street will reduce traffic congestion.
>
> **Gap**: The stimulus assumes that adding bike lanes will *cause* more people to switch from driving to biking, not just that current bikers are faster.

A correct Strengthen here would say something like: *"In comparable cities, the introduction of dedicated bike lanes led to a 15% increase in bicycle commuters."* That answer ties new infrastructure to a behavioral shift — exactly the bridge the argument needs.`,
      importantNote: `Predicting an answer in plain English is the single highest-leverage habit on Strengthen questions. Test-takers who skip the prediction step almost always over-spend on attractive wrong answers.`,
    },
    {
      id: 'lr-str-traps',
      title: `3. Common Trap Answers on Strengthen`,
      content: `Wrong answers on Strengthen fall into a small number of patterns. Learn them and they become almost free points.

## 3.1 The Reverse Trap (Weakens Instead of Strengthens)
The answer affects the argument but in the wrong direction. Under time pressure, many test-takers see "this is relevant" and forget to check the direction.

## 3.2 Out of Scope
The answer is true and feels related, but the topic is a side issue that doesn't bear on the actual conclusion. Example: stimulus is about whether bike lanes reduce traffic; trap answer is about the cost of building bike lanes.

## 3.3 Half-Right / Half-Wrong
The first clause sounds great; the second clause adds a qualifier that neutralises the support. Read the entire answer.

## 3.4 Too Specific or Too Narrow
The answer supports only one premise, not the conclusion. Example: stimulus argues Main Street will benefit from bike lanes; trap answer says one specific Main Street block already has good cycling conditions.

## 3.5 The Restatement
The answer just repeats a premise in different words. Repeating evidence does not provide new support.

## 3.6 The Causal Reversal
On causal stimuli, a trap answer reverses cause and effect, which weakens (or at best leaves unchanged) rather than strengthens.

## 3.7 Comparative Confusion
If the conclusion is comparative ("X is better than Y"), a strengthen must support the comparison. An answer that only describes X's virtues — without addressing Y — usually does not strengthen.`,
      quiz: [
        {
          question: `An argument concludes that a new municipal recycling program will reduce landfill waste by 20% within one year, based on a pilot study showing high resident participation. Which answer would most STRENGTHEN this conclusion?`,
          options: [
            `The pilot study covered only residents who had previously volunteered for environmental programs.`,
            `Other cities with similar participation rates have seen comparable reductions in landfill waste.`,
            `The recycling facility has the capacity to process double the projected volume.`,
            `Residents who participate in recycling programs also tend to compost organic waste.`,
            `The municipal budget for waste management has increased by 15% this year.`,
          ],
          correctIndex: 1,
          explanation: `Choice B directly supports the causal link between high participation and a 20% reduction by providing an analogous case where the same input produced the same output. (A) WEAKENS the argument by suggesting the pilot was unrepresentative. (C) is about capacity, not about whether the reduction will happen. (D) and (E) are out of scope.`,
        },
        {
          question: `Which of the following is the MOST RELIABLE method for identifying a Strengthen question stem?`,
          options: [
            `Look for the words "must be true" or "follows logically."`,
            `Look for the words "if true" or "most support" combined with the author's conclusion.`,
            `Look for two speakers expressing disagreement.`,
            `Look for a bolded portion of the stimulus.`,
            `Look for a percentage or statistic in the stimulus.`,
          ],
          correctIndex: 1,
          explanation: `Strengthen stems characteristically invite outside information ("if true") and ask you to support the author's conclusion. (A) is Inference / Must Be True. (C) is Point at Issue. (D) is Role. (E) is irrelevant to question type.`,
        },
      ],
    },
    {
      id: 'lr-str-worked',
      title: `4. Worked Example — Full Stimulus`,
      content: `## Stimulus

> Editorial: Our city should require all new commercial buildings to install solar panels on their roofs. A recent municipal report shows that buildings with rooftop solar generate, on average, 40% of their own electricity needs. Mandating solar installation would therefore substantially reduce the city's reliance on fossil-fuel-generated electricity.

## Step 1 — Identify the Conclusion
"Mandating solar installation would substantially reduce the city's reliance on fossil-fuel-generated electricity."

## Step 2 — Identify the Premise
Buildings with rooftop solar already generate ~40% of their own electricity needs.

## Step 3 — Identify the Gap
The premise is about buildings that *already have* solar. The conclusion is about what would happen if installation were *mandated*. Two big gaps:

1. **Selection bias**: Buildings that voluntarily installed solar may have been chosen for sites with excellent sun exposure. New, mandated installations may not perform as well.
2. **Marginal vs. average**: Even if mandated buildings averaged 40% self-generation, that says nothing about *total* city electricity demand reduction unless we know what share of city electricity comes from these buildings.

## Step 4 — Predict
The correct answer should rule out the selection-bias alternative or quantify the share of city demand that commercial buildings represent.

## Step 5 — Evaluate Choices

| Choice | Effect |
|---|---|
| (A) Half of current solar buildings receive state tax credits. | Out of scope — doesn't affect whether new buildings would generate similar amounts. |
| (B) The city's commercial buildings consume 60% of all municipal electricity. | **STRENGTHENS** — connects the per-building figure to the citywide claim. |
| (C) Residential solar adoption has tripled in five years. | Out of scope — argument is about commercial buildings. |
| (D) Solar panels last on average 25 years before needing replacement. | Out of scope — durability, not generation. |
| (E) Some commercial buildings have rooftops unsuited for solar. | WEAKENS — undermines the mandate's reach. |

**Answer: (B).** It bridges the gap by establishing that commercial buildings are a large enough share of city consumption that a 40% self-generation rate would meaningfully reduce fossil-fuel demand.`,
    },
    {
      id: 'lr-str-drill',
      title: `5. Drill Prompts`,
      content: `Practice these on a timed clock (1:20 per question is target pace for LR).

## Drill 1
> A nutrition columnist argues that drinking two liters of water per day improves cognitive performance, citing a study in which adults who drank two liters scored 8% higher on memory tests than adults who drank less than one liter.

Predict: which kind of answer would strengthen this? (Hint: rule out reverse causation and ensure the two groups are comparable.)

## Drill 2
> A historian claims that the invention of the printing press was the single most important driver of the European Reformation, because pamphlets criticising the Catholic Church spread far faster after 1450 than before.

Predict: what alternative explanation must a strengthen answer rule out? (Hint: political conditions, literacy rates, other concurrent technologies.)

## Drill 3
> A school board argues that switching from a 5-day to a 4-day school week will improve student test scores, citing a neighbouring district that made the switch and saw scores rise by 4 points.

Predict: what would a strengthen answer say about the neighbouring district's other policy changes?

## Drill 4
> A startup founder argues that her company's productivity software will reduce employee burnout, because a pilot at one client showed a 25% drop in overtime hours.

Predict: what would a strengthen answer establish about the link between overtime hours and burnout?

## Drill 5
> An advertisement claims that a new running shoe reduces knee injuries, citing testimonials from professional marathoners who switched to the shoe.

Predict: what would a strengthen answer rule out? (Hint: self-selection bias and the difference between elite and amateur runners.)

## How To Use These
For each drill, write your prediction in one sentence before you imagine answer choices. The act of writing forces you to articulate the gap — exactly the skill the test rewards.`,
    },
  ],
  keyTakeaways: [
    `Strengthen stems use "if true" — you ARE allowed to bring in outside information.`,
    `Always identify the conclusion first; many test-takers strengthen the premise by mistake.`,
    `Predict in plain English what the right answer must do before scanning choices.`,
    `The most common trap is the reverse — an answer that weakens the conclusion.`,
    `Eliminate "no effect" choices first; they outnumber every other trap type.`,
    `Strengthen answers can be partial — they don't need to prove the conclusion, only support it.`,
    `On causal stimuli, ruling out alternative causes is a powerful strengthen pattern.`,
    `On comparative conclusions, the answer must address both sides of the comparison.`,
  ],
},

lr_weaken: {
  topicId: 'lr_weaken',
  title: `Weaken Questions`,
  domainWeight: 'Logical Reasoning · ~10% of LR section · Tier: Very High',
  overview: `Weaken questions are the mirror image of Strengthen: you must identify the answer that, if true, would most undermine the argument's conclusion. Like Strengthen, you do not need to disprove the conclusion outright — only to make it less likely. Expect 4–6 Weaken questions on a scored LR section.`,
  sections: [
    {
      id: 'lr-wkn-definition',
      title: `1. What a Weaken Question Is`,
      content: `A Weaken question presents an argument and asks which answer, **if true**, would most call the conclusion into question.

## Standard Question Stems
- "Which of the following, if true, most **weakens** / **undermines** the argument?"
- "Which of the following, if true, most **calls into question** the conclusion?"
- "Which of the following, if true, would most **seriously challenge** the author's reasoning?"
- "Each of the following, if true, weakens the argument EXCEPT…"  (this is the EXCEPT variant — be careful)

## The "If True" Allowance
As with Strengthen, "if true" means you may accept new information from an answer choice. You do NOT have to verify it against the stimulus.

## What Counts As Weakening
- Showing an alternative cause produced the observed effect
- Showing the data sample is biased / unrepresentative
- Showing the premise is consistent with the conclusion being false
- Pointing out an unaddressed counter-example

## What Does NOT Count As Weakening
- Attacking the source (ad hominem) without addressing the argument
- Restating a premise
- Bringing up an irrelevant downside (e.g., cost when the argument is about effectiveness)`,
      examTip: `On a causal stimulus, the strongest weakener is almost always an answer that supplies an alternative cause for the observed correlation. Train your eye to spot causal language ("X caused Y," "because of X, Y happened") because it signals what the weakener will look like.`,
    },
    {
      id: 'lr-wkn-method',
      title: `2. How to Attack a Weaken Question`,
      content: `## Step 1 — Confirm the Question Type
Stem must contain weaken / undermine / call into question / cast doubt.

## Step 2 — Find the Conclusion
The conclusion is what you are trying to make less likely. Don't waste effort on the premises — they are assumed true.

## Step 3 — Find the Gap or Assumption
Every LSAT argument has a logical gap. The weakener attacks the gap by showing the assumption is unreliable.

## Step 4 — Predict in Plain Language
"The right answer probably says: even though X happened, X wasn't caused by Y — something else caused it."

## Step 5 — Evaluate Choices

Eliminate in two passes:
- **Pass 1**: kill obvious "no effect" and "strengthen" answers.
- **Pass 2**: among remaining choices, ask which one's effect is strongest.

## Weakening Patterns By Argument Type

| Stimulus Pattern | Weakener Pattern |
|---|---|
| **Causal**: X caused Y | Alternative cause Z also produces Y |
| **Survey / Sample**: results from group A apply to group B | Group A was unrepresentative of group B |
| **Plan / Proposal**: doing X will achieve Y | A side effect or precondition prevents Y |
| **Analogy**: A is like B, so B will behave like A | A relevant difference exists between A and B |
| **Prediction**: trend will continue | New factor will disrupt the trend |
| **Statistical**: rate / percentage comparison | Absolute numbers (or rate vs. count) differ |`,
      importantNote: `EXCEPT-form Weaken questions ("each of the following weakens the argument EXCEPT") flip your job. Four of the five choices DO weaken; you pick the one that doesn't (it either strengthens or has no effect). Slow down on EXCEPT — many test-takers misread it.`,
    },
    {
      id: 'lr-wkn-traps',
      title: `3. Common Trap Answers on Weaken`,
      content: `## 3.1 The Reverse Trap (Strengthens Instead)
Same trap as on Strengthen, mirror image: relevant but wrong direction.

## 3.2 Irrelevant Comparison
A trap answer offers a comparison the argument never made. If the argument is about whether plan A will work, an answer comparing plan A to plan B doesn't necessarily weaken plan A.

## 3.3 Out of Scope
The trap mentions a related topic but not the conclusion's actual claim.

## 3.4 Confirms a Premise
The answer reinforces a premise the argument already takes for granted. Doesn't weaken because the premise wasn't in dispute.

## 3.5 Attacks the Wrong Conclusion
On stimuli with intermediate conclusions, a trap weakens a sub-conclusion but not the main one.

## 3.6 "Could Be" vs. "Would Be"
Wishy-washy answers ("might affect the outcome") are usually weaker than declarative ones ("does cause the same outcome"). Prefer the stronger answer when both are otherwise equivalent.

## 3.7 The Hidden Cost Trap
If the argument is about effectiveness, an answer about cost is usually out of scope (unless the argument explicitly justifies the conclusion based on cost).`,
      quiz: [
        {
          question: `Researchers conclude that consuming green tea reduces the risk of heart disease, based on a 10-year study of 5,000 adults in which regular green tea drinkers had 25% lower rates of cardiovascular events than non-drinkers. Which answer would most WEAKEN this conclusion?`,
          options: [
            `Green tea contains antioxidants that have been shown to reduce inflammation.`,
            `Regular green tea drinkers in the study also exercised more frequently and ate more vegetables than non-drinkers.`,
            `Some participants drank black tea in addition to green tea.`,
            `The study used self-reported tea consumption rather than objective measurements.`,
            `Cardiovascular events were defined to include both heart attacks and strokes.`,
          ],
          correctIndex: 1,
          explanation: `Choice B introduces a CLASSIC alternative cause: exercise and diet are well-known cardioprotective factors. If green tea drinkers also exercised more and ate better, the observed 25% reduction may be due to those factors, not the tea. (A) strengthens. (C) is out of scope. (D) raises a methodological concern but doesn't supply an alternative cause that explains the correlation. (E) is a definitional clarification.`,
        },
        {
          question: `Identify the question type:
"Each of the following, if true, casts doubt on the argument EXCEPT…"`,
          options: [
            `Strengthen`,
            `Weaken (EXCEPT variant) — four choices weaken, one does not`,
            `Necessary Assumption`,
            `Inference`,
            `Role`,
          ],
          correctIndex: 1,
          explanation: `"Casts doubt EXCEPT" inverts the task: four of five choices DO weaken; the credited answer is the one that doesn't (it either strengthens or has no effect on the conclusion).`,
        },
      ],
    },
    {
      id: 'lr-wkn-worked',
      title: `4. Worked Example — Causal Stimulus`,
      content: `## Stimulus
> A regional health board argues that drinking sugary soda causes weight gain in teenagers, based on a survey showing that teens who drank sugary soda at least once a day weighed, on average, 12 pounds more than teens who never drank sugary soda.

## Step 1 — Conclusion
Sugary soda *causes* weight gain in teenagers.

## Step 2 — Premise
Correlation between soda consumption and higher average weight.

## Step 3 — Gap
The argument moves from correlation to causation. Classic alternatives:
- **Reverse causation**: heavier teens crave more sugar (effect → cause, not cause → effect)
- **Common cause**: low family income leads to both higher soda consumption and other dietary patterns associated with weight gain
- **Selection bias**: the survey populations differ in other relevant ways

## Step 4 — Predict
The right answer will offer an alternative explanation for the 12-pound gap.

## Step 5 — Evaluate

| Choice | Effect |
|---|---|
| (A) Teens who drink sugary soda daily also eat more fast food than teens who don't. | **WEAKENS** — supplies a common-cause alternative (overall poor dietary habits). |
| (B) Adults who drink sugary soda also tend to weigh more. | Out of scope — argument is about teens. |
| (C) Some sugary sodas contain more sugar than others. | Out of scope — doesn't address the causal claim. |
| (D) Teens who never drank sugary soda were more likely to play organised sports. | **ALSO WEAKENS** — alternative cause (physical activity). |
| (E) The survey was conducted in a single school district. | Methodological concern but doesn't supply an alternative cause — weaker than A or D. |

This is a tough case where two answers (A and D) both weaken. Compare: which is the **stronger** alternative cause for the specific 12-pound gap? Sports participation (D) is well established to affect body composition; fast food (A) is plausible but less direct. On the LSAT, both could be defensible — but the credited answer would typically be the one that most directly accounts for the observed weight difference. Trust the test's diction: "more likely to play organised sports" is more specific and more weight-relevant than "eat more fast food." **Answer: (D)** in this construction.`,
    },
    {
      id: 'lr-wkn-drill',
      title: `5. Drill Prompts`,
      content: `## Drill 1
> An economist argues that lowering the corporate tax rate will increase wages, citing data from countries that lowered taxes and saw wages rise.

Predict the weakener. (Hint: confounding variables, reverse causation, sample selection.)

## Drill 2
> A school principal argues that a new uniform policy improved student behaviour, because suspensions dropped 15% in the year the policy was introduced.

Predict the weakener. (Hint: other concurrent policies, regression to the mean, demographic shifts.)

## Drill 3
> A doctor argues that patients who get more sleep have lower blood pressure, because in her clinic the average BP of sleep-tracked patients is 8 mmHg lower than non-tracked.

Predict the weakener. (Hint: self-selection of patients into the sleep-tracking group.)

## Drill 4
> A nonprofit claims that its tutoring programme raises reading scores, because participants score higher than non-participants on standardised tests.

Predict the weakener.

## Drill 5
> A city council argues that a curfew reduced juvenile crime by 30%.

Predict the weakener. (Hint: was there a change in reporting, enforcement, or another concurrent policy?)`,
    },
  ],
  keyTakeaways: [
    `Weakeners need not disprove the conclusion — just make it less likely.`,
    `On causal stimuli, the strongest weakeners supply an alternative cause.`,
    `EXCEPT-form weaken questions invert the task — read the stem twice.`,
    `Cost-versus-effectiveness mismatch is a perennial trap.`,
    `Confirming a premise does not weaken the argument.`,
    `Survey / sample stimuli are weakened by showing the sample is unrepresentative.`,
    `Analogy stimuli are weakened by pointing out a disanalogy.`,
    `Plan / proposal stimuli are weakened by side effects that prevent the goal.`,
  ],
},

lr_necessary_assumption: {
  topicId: 'lr_necessary_assumption',
  title: `Necessary Assumption Questions`,
  domainWeight: 'Logical Reasoning · ~10% of LR section · Tier: Very High',
  overview: `A Necessary Assumption question asks you to identify a premise the argument MUST rely on — something that, if false, would cause the argument to fall apart. The defining test is the **Negation Test**: negate the answer, and ask whether the argument now collapses. The correct answer collapses the argument when negated; wrong answers don't.`,
  sections: [
    {
      id: 'lr-na-definition',
      title: `1. What a Necessary Assumption Is`,
      content: `An "assumption" on the LSAT means an unstated premise the author depends on. "Necessary" means the argument cannot succeed without it.

## Standard Stems
- "Which of the following is an assumption **required** by the argument?"
- "The argument **depends on** which of the following assumptions?"
- "Which is an assumption the argument **must** make?"
- "The argument requires the assumption that…"

## Necessary vs. Sufficient — The Single Most Important Distinction
- **Necessary Assumption**: the argument *needs* this to be true. (Weaker.)
- **Sufficient Assumption**: this *alone guarantees* the conclusion. (Stronger.)

A Necessary Assumption is something the argument **can't survive without**. A Sufficient Assumption is something that, if added, **completes** the argument. Most Necessary Assumptions are NOT sufficient; most Sufficient Assumptions are NOT necessary.

## The Negation Test (The Single Most Useful LSAT Technique)
For each answer choice:
1. Negate the choice (flip "is" → "is not", "all" → "not all", etc.).
2. Ask: does the argument still work?
3. If the negated answer **destroys** the argument → that's the credited answer.
4. If the negated answer leaves the argument intact → wrong answer.

Apply the negation only to the candidate answers you can't eliminate quickly. Don't waste it on obvious losers.`,
      examTip: `The Negation Test is non-negotiable on hard NA questions. Practice negating sentences until it is automatic. Common negations: "all" → "not all"; "some" → "no"; "must" → "need not"; "is" → "is not"; "will" → "might not"; "cannot" → "can".`,
    },
    {
      id: 'lr-na-method',
      title: `2. How to Attack a Necessary Assumption Question`,
      content: `## Step 1 — Confirm Question Type
Stem says "required," "depends on," "must assume," or "presupposes."

## Step 2 — Identify Premise & Conclusion
Standard LR routine.

## Step 3 — Find the Gap
What does the argument leap over without saying? Most NA answers fill that gap minimally — just enough to make the argument viable.

## Step 4 — Look For Defender vs. Supporter Patterns

NA answers usually fall into one of two patterns:

- **Defender** — eliminates an objection that would otherwise sink the argument. Phrased like: "X does not happen / nothing prevents Y / no relevant counter-example exists."
- **Supporter** — supplies a connecting link between two ideas in the argument. Phrased like: "If X, then Y."

## Step 5 — Apply the Negation Test
Negate the leading candidate and test whether the argument survives.

## The Weakness Principle
Necessary Assumptions are typically **weaker** statements than Sufficient Assumptions. If two choices both look right, the **weaker** one is usually the NA answer because the argument only requires the minimum.

Example: argument concludes "the bridge will collapse soon."
- Strong: "The bridge has structural damage in every load-bearing column."
- Weak: "The bridge has at least some structural damage."

The weaker statement is more likely the NA — the argument only requires *some* damage to support its claim.`,
      importantNote: `If the negation of a candidate answer leaves the argument equally strong, that answer is NOT necessary — eliminate it. Many trap answers are nice-to-have facts that the argument doesn't actually depend on.`,
    },
    {
      id: 'lr-na-traps',
      title: `3. Common Trap Answers`,
      content: `## 3.1 Too Strong
A trap answer asserts more than the argument needs. "All X are Y" when the argument only requires "some X are Y." Apply negation: if the strong claim's negation doesn't break the argument, eliminate.

## 3.2 Sufficient Assumption Disguised
A trap answer would *guarantee* the conclusion — strong enough to be a Sufficient Assumption — but the argument doesn't actually require it. Test by asking: "Could the argument still work even if this answer were partially false?" If yes, it's not NA.

## 3.3 Out of Scope
The trap is true but not on topic.

## 3.4 Reverses the Direction
The argument uses A → B; trap answer says B → A.

## 3.5 Cites the Conclusion
Trap restates the conclusion or a premise (circular).

## 3.6 The "Some / Any" Switch
The answer changes "some" to "any" or vice versa, changing the logical weight.

## 3.7 The Comparative Trap
The argument is about a single subject; the trap answer makes a comparative claim that the argument never needed.`,
      quiz: [
        {
          question: `Argument: "The new vaccine should be approved. In trials, it reduced infection rates by 80% with no serious side effects." Which is an ASSUMPTION REQUIRED by this argument?`,
          options: [
            `The vaccine works equally well in all age groups.`,
            `The vaccine is the most effective treatment ever developed.`,
            `An 80% reduction in infection rate is meaningful for approval decisions.`,
            `No other vaccine has achieved an 80% reduction.`,
            `The trial population is identical to the general population.`,
          ],
          correctIndex: 2,
          explanation: `Negate (C): "An 80% reduction is NOT meaningful for approval decisions." → The argument collapses, because there'd be no reason from these data to approve. (A) is too strong — the argument doesn't require equal effectiveness across all groups, just enough to justify approval. (B) is too strong. (D) is irrelevant. (E) is too strong — substantial similarity is enough.`,
        },
        {
          question: `An argument claims a city's economy will grow because business permits rose 12% last quarter. Which is a NECESSARY ASSUMPTION?`,
          options: [
            `Every business that received a permit will succeed.`,
            `A rise in business permits is correlated with at least some economic growth.`,
            `Business permits are the leading indicator of economic activity.`,
            `Business permit growth always causes economic growth.`,
            `The city government cannot revoke business permits.`,
          ],
          correctIndex: 1,
          explanation: `Negate (B): "A rise in permits is NOT correlated with any economic growth." → Argument collapses. (A), (C), and (D) are all too strong — the argument only needs SOME relationship between permits and growth. (E) is out of scope.`,
        },
        {
          question: `Apply the Negation Test. The argument is: "The library should extend its hours because students need more study space." A candidate answer: "Students would use the library during the extended hours." Negated: "Students would NOT use the library during the extended hours." Which is true?`,
          options: [
            `The negation strengthens the argument.`,
            `The negation has no effect — the answer is not necessary.`,
            `The negation destroys the argument — the answer IS necessary.`,
            `The negation is itself a strengthen answer.`,
            `Negation cannot be applied to this kind of statement.`,
          ],
          correctIndex: 2,
          explanation: `If students wouldn't use the extended hours, extending the hours fails to give them more study space, and the argument breaks. The candidate IS a necessary assumption.`,
        },
      ],
    },
    {
      id: 'lr-na-worked',
      title: `4. Worked Example`,
      content: `## Stimulus
> Critic: The mayor's plan to fund the new arts centre by increasing property taxes is misguided. The arts centre will generate insufficient revenue to justify the tax increase.

## Conclusion
The plan is misguided (because revenue will be insufficient).

## Gap
The critic assumes that **the criterion for justifying a tax increase is the revenue the funded project will generate**. But many public projects (parks, schools, public art) are funded by taxes despite not generating direct revenue, because they provide non-monetary benefits.

## Predicted NA
Something like: "A tax increase is only justified if the project it funds generates sufficient revenue." Or, weaker: "Non-monetary benefits do not, on their own, justify the tax increase."

## Negation Test on Likely Candidates

- Candidate: "The arts centre will provide no non-monetary benefits to the community."
  - Negation: "The arts centre will provide some non-monetary benefits."
  - Effect on argument: This does NOT destroy the argument — the critic could still argue that benefits don't outweigh costs. So this is too strong; not necessary.

- Candidate: "Non-monetary benefits, on their own, are insufficient to justify the tax increase."
  - Negation: "Non-monetary benefits, on their own, ARE sufficient to justify the tax increase."
  - Effect on argument: This destroys the critic's argument — if non-monetary benefits suffice, the revenue shortfall is irrelevant. **This IS necessary.**

The weaker formulation passes the negation test; the stronger one is too strong.`,
    },
    {
      id: 'lr-na-drill',
      title: `5. Drill Prompts`,
      content: `Apply the negation test to each candidate. If negating the candidate breaks the argument, it's necessary.

## Drill 1
> "Switching to electric vehicles will reduce a country's carbon emissions because EVs produce zero tailpipe emissions."
Candidate NA: "The electricity that powers EVs is not produced entirely from carbon-emitting sources."

## Drill 2
> "Mandating bike helmets will reduce serious cycling injuries because helmets prevent skull fractures."
Candidate NA: "Skull fractures account for at least some serious cycling injuries."

## Drill 3
> "Hiring a content marketing manager will increase the company's web traffic because content marketing drives organic search rankings."
Candidate NA: "The company is not currently doing more effective marketing that would be displaced by content marketing."

## Drill 4
> "Banning single-use plastic bags will reduce ocean pollution because plastic bags are a major source of marine debris."
Candidate NA: "People who currently use single-use plastic bags will not switch to alternatives that are equally polluting."

## Drill 5
> "Closing public schools on snow days improves student safety because students don't have to travel in dangerous conditions."
Candidate NA: "Some students travel to school in dangerous conditions when school is open on snowy days."`,
    },
  ],
  keyTakeaways: [
    `A Necessary Assumption is a premise the argument MUST rely on; negating it breaks the argument.`,
    `The Negation Test is the gold-standard verification technique.`,
    `Necessary Assumption answers are typically WEAKER than Sufficient Assumption answers.`,
    `Watch for Defender (eliminates objection) and Supporter (bridges premise to conclusion) patterns.`,
    `Eliminate "too strong" answers first — strong claims rarely meet the negation test.`,
    `If the negation leaves the argument equally valid, the answer is NOT necessary.`,
    `Do not confuse Necessary Assumption with Sufficient Assumption — they test opposite directions.`,
    `Most argument gaps are filled by a minimal connecting statement, not a sweeping one.`,
  ],
},

lr_inference: {
  topicId: 'lr_inference',
  title: `Inference / Must Be True Questions`,
  domainWeight: 'Logical Reasoning · ~10% of LR section · Tier: Very High',
  overview: `Inference questions ask what conclusion follows from the stimulus. Unlike Strengthen / Weaken, you may NOT bring in outside information. The credited answer must be supported by the facts given. The classic version is "Must Be True"; softer variants ask for "Most Strongly Supported." Both rules apply: stay strictly inside the stimulus.`,
  sections: [
    {
      id: 'lr-inf-definition',
      title: `1. What an Inference Question Is`,
      content: `## Standard Stems
- "If the statements above are true, which one of the following **must also be true**?"
- "Which of the following is **most strongly supported** by the information above?"
- "The statements above, if true, **most support** which of the following conclusions?"

The two flavours differ in strictness:
- **Must Be True**: the answer must follow with logical certainty from the stimulus.
- **Most Strongly Supported**: the answer must be the most reasonable conclusion the stimulus warrants — high probability, not certainty.

## What You Are NOT Allowed To Do
- Bring in real-world knowledge ("everyone knows that…")
- Assume additional facts not in the stimulus
- Make causal leaps without textual support
- Treat a correlation as a causation

## What You ARE Allowed To Do
- Combine two statements that share a term (chain inferences)
- Apply contrapositives of conditional statements
- Apply simple set logic ("all A are B" + "all B are C" → "all A are C")
- Use the literal meaning of words and quantifiers

## The Key Mindset
You are looking for the **safest, smallest** inference. The trap is always to pick an answer that "sounds right" but goes one step beyond what the stimulus actually says.`,
      examTip: `Inference answers are weak. If an answer choice is full of strong language — "always," "never," "must," "only" — it's usually wrong. The correct answer often uses hedged language: "some," "at least one," "could be," "may not be."`,
    },
    {
      id: 'lr-inf-method',
      title: `2. How to Attack an Inference Question`,
      content: `## Step 1 — Read the Stimulus Carefully
On Inference, the stimulus is the entire puzzle. Slow your read by 10%; reread any sentence that contains a quantifier (all, some, none, most) or a conditional (if, only, unless, when, whenever).

## Step 2 — Identify Logical Links

- **Conditional chains**: A → B → C lets you infer A → C and ¬C → ¬A.
- **Quantified statements**: "All ducks are birds" + "Some ducks are loud" → "Some birds are loud."
- **Either / or**: "Either X or Y" + "Not X" → "Y."

## Step 3 — Avoid Predicting (Mostly)
On Inference, predicting is hard because the test can validly infer many things. Use process of elimination instead — but keep a mental note of the safest, smallest inferences your reading produced.

## Step 4 — Evaluate Each Choice
For each, ask: "Does this follow from the stimulus, or am I bringing in outside knowledge?" If you have to think hard about whether it's true, it probably doesn't follow.

## Step 5 — Pick the Safest Answer
Among the choices that seem supported, the safest answer wins. Strong language is a tell that an answer goes too far.

## Conditional Logic Cheat Sheet

| Statement | Symbol | Contrapositive |
|---|---|---|
| If A then B | A → B | ¬B → ¬A |
| A only if B | A → B | ¬B → ¬A |
| All A are B | A → B | ¬B → ¬A |
| No A are B | A → ¬B | B → ¬A |
| A unless B | ¬B → A | ¬A → B |
| Only A are B | B → A | ¬A → ¬B |

Memorise these. The LSAT plays language games to test whether you can convert each form into the canonical conditional.`,
      importantNote: `"Only" is the most-tested word on conditional inference. "A only if B" means A → B (B is necessary for A). "Only A are B" means B → A (A is necessary for B). Mis-translating "only" loses easy points.`,
    },
    {
      id: 'lr-inf-traps',
      title: `3. Common Trap Answers`,
      content: `## 3.1 Too Strong
The most common trap: an answer that goes one step beyond the stimulus. Stimulus says "some students," trap says "most students." Stimulus says "may," trap says "must."

## 3.2 Real-World Knowledge
The answer is true in the real world but not derivable from the stimulus. The LSAT only cares about what the stimulus supports.

## 3.3 Reversed Conditional
Stimulus says A → B; trap says B → A. (Or stimulus says "all A are B"; trap says "all B are A.")

## 3.4 Negated Conditional Without Contraposition
Stimulus says A → B; trap says ¬A → ¬B (forgetting that the contrapositive is ¬B → ¬A, not ¬A → ¬B).

## 3.5 Out of Scope
The answer is on a topic the stimulus didn't address.

## 3.6 Quantifier Shift
Stimulus says "some lawyers"; trap says "all lawyers" or "every lawyer." Watch for shifts from "some" to "most" and from "most" to "all."

## 3.7 Half Right
The answer's first clause is supported but the second clause adds an unsupported claim.

## 3.8 Half-True / Half-Unstated
The answer combines a stimulus fact with an unstated assumption (e.g., a causal claim built on a correlation).`,
      quiz: [
        {
          question: `Stimulus: "Every law student at Greenwood University must complete a legal ethics course. Some law students at Greenwood University choose to specialise in environmental law." Which MUST be true?`,
          options: [
            `Most law students at Greenwood specialise in environmental law.`,
            `Some Greenwood law students who specialise in environmental law have completed a legal ethics course.`,
            `Greenwood requires all environmental law specialists to take additional courses.`,
            `Environmental law specialists at Greenwood are required to complete the legal ethics course earlier than other students.`,
            `Students who do not specialise in environmental law are not required to take a legal ethics course.`,
          ],
          correctIndex: 1,
          explanation: `The two facts: (i) ALL law students must take ethics; (ii) SOME law students specialise in environmental law. Therefore SOME environmental specialists must have taken ethics. (A) too strong. (C) and (D) bring in outside info. (E) contradicts (i).`,
        },
        {
          question: `Stimulus: "If a movie has a budget over $100 million, it is marketed internationally. Every movie marketed internationally has subtitles in at least three languages." Which MUST be true of a movie with a budget over $100 million?`,
          options: [
            `It has subtitles in exactly three languages.`,
            `It has subtitles in at least three languages.`,
            `It is the most expensive movie of its release year.`,
            `It is marketed only internationally, not domestically.`,
            `If it has subtitles in only two languages, it is not marketed internationally.`,
          ],
          correctIndex: 1,
          explanation: `Chain: Budget>$100M → Marketed Int'l → Subtitles in ≥3 languages. So a >$100M movie has subtitles in ≥3 languages. (A) says exactly — too strong (the stimulus says at least). (C), (D) out of scope. (E) is a valid contrapositive but not phrased as required for the question (which asks about >$100M movies specifically).`,
        },
      ],
    },
    {
      id: 'lr-inf-worked',
      title: `4. Worked Example with Conditional Chain`,
      content: `## Stimulus
> All employees who receive bonuses meet their quarterly targets. Employees who exceed sales projections by 20% always receive bonuses. Maria exceeded her sales projection by 25% this quarter.

## Translate to Conditionals
- Bonus → Met Quarterly Target  (call this rule 1)
- Exceeded 20% → Bonus  (rule 2)
- Maria: Exceeded 25%

## Chain
Exceeded 25% qualifies as "Exceeded 20%" (25 > 20), so Maria triggers rule 2: she received a bonus.
With Bonus → Met Quarterly Target (rule 1), Maria met her quarterly target.

## Evaluate Answer Choices

- **Maria met her quarterly target.** ✓ Directly chains from the rules. Safest, smallest inference.
- **Maria is the top sales employee of the quarter.** ✗ Out of scope.
- **All employees who exceed projections by 20% meet their quarterly targets.** ✓ Also valid by chaining rules 2 and 1, but more general than the question asks.
- **Maria's bonus was the largest in her department.** ✗ Out of scope.
- **Employees who do not meet their quarterly targets cannot exceed projections by 20%.** ✓ Valid contrapositive chain: ¬Target → ¬Bonus → ¬Exceeded 20%. (However this would be phrased as the contrapositive of rule 1 + 2.)

A well-built question gives only ONE answer that is fully supported with no extras. The most common credited answer here would be the most specific to Maria: "Maria met her quarterly target."`,
    },
    {
      id: 'lr-inf-drill',
      title: `5. Drill Prompts`,
      content: `For each stimulus, write down the safest, smallest inference. Then check your inference against the rules.

## Drill 1
> "Every applicant who scored above 165 on the LSAT was admitted. Some applicants who scored above 165 also had GPAs above 3.8."
Inference target: combine the two statements.

## Drill 2
> "If a country has a balanced budget, it has at least one tax surplus year. No country with a tax deficit in every year has a balanced budget."
Translate to conditionals and chain.

## Drill 3
> "All paintings in the museum's main hall are signed. Some signed paintings in the museum are forgeries."
What can you and CAN'T you infer?

## Drill 4
> "If you visit New York in spring, you will see the cherry blossoms. Only people who buy tickets visit New York."
Chain.

## Drill 5
> "Most professional pianists practise more than four hours daily. No one who practises less than two hours daily is a professional pianist."
What is the safest inference about a pianist who practises three hours daily?`,
    },
  ],
  keyTakeaways: [
    `Inference answers must be supported BY the stimulus — no outside knowledge allowed.`,
    `"Must Be True" requires logical certainty; "Most Strongly Supported" allows high probability.`,
    `Use conditional chains, contrapositives, and quantifier rules to combine statements.`,
    `Pick the safest, smallest answer — strong language usually flags a wrong choice.`,
    `"Only" is the most-tested conditional word; memorise its translation rules.`,
    `Beware reversed conditionals and negated conditionals without contraposition.`,
    `Quantifier shifts (some → most, most → all) are classic traps.`,
    `When two answers both look defensible, the weaker one usually wins.`,
  ],
},

lr_flaw: {
  topicId: 'lr_flaw',
  title: `Flaw Questions`,
  domainWeight: 'Logical Reasoning · ~10% of LR section · Tier: Very High',
  overview: `Flaw questions ask you to identify what is wrong with the argument's reasoning. Unlike Weaken, you don't need new information — you must describe an existing structural problem in the argument. The LSAT recycles a small set of named flaws (correlation/causation, ad hominem, sampling, etc.). Memorising them turns Flaw into one of the most rewarding LR types.`,
  sections: [
    {
      id: 'lr-flaw-definition',
      title: `1. What a Flaw Question Is`,
      content: `## Standard Stems
- "The argument is most **vulnerable to criticism** on the grounds that…"
- "The argument's reasoning is **flawed** because…"
- "Which of the following most accurately describes a **flaw** in the argument?"
- "The reasoning above is **questionable** because the argument…"

## Goal
Identify the structural mistake the argument makes. The credited answer will name or describe a recognisable flaw.

## What's the Difference Between Flaw and Weaken?
- **Weaken**: bring in outside info to undermine the conclusion.
- **Flaw**: describe what's wrong with the argument's reasoning AS IT STANDS.

Flaw answers tend to be abstract; Weaken answers tend to be specific.

## Why Flaw Is High-Leverage
The LSAT recycles ~15 named flaws. Once you can recognise each one, your prediction is almost the answer.`,
      examTip: `Don't fall in love with the most "negative-sounding" answer choice. Flaw answers are descriptive ("the argument confuses correlation with causation") not denunciatory ("the argument is wrong because the data are unreliable"). The right answer NAMES the flaw — neutrally and accurately.`,
    },
    {
      id: 'lr-flaw-types',
      title: `2. The Named Flaws You Must Recognise`,
      content: `## 2.1 Correlation vs. Causation
Argument observes a correlation and concludes one variable caused the other. Almost always a flaw.
- *Example*: "Students who eat breakfast score higher on tests, so eating breakfast causes better test scores." → Reverse causation, common cause, selection.

## 2.2 Sampling / Unrepresentative Sample
Argument generalises from a sample that doesn't represent the broader population.
- *Example*: "I surveyed 50 lawyers at a corporate-law firm; 80% support tort reform. Therefore most lawyers support tort reform."

## 2.3 Ad Hominem
Argument attacks the speaker, not the argument.
- *Example*: "Senator Jones's tax proposal can't be sound — he's a known opportunist."

## 2.4 Equivocation (Term Shift)
Argument uses a key word in two different senses.
- *Example*: "A 'right' is something the government must protect. Healthcare is a 'right.' Therefore the government must provide healthcare." (The first 'right' is a legal entitlement; the second is a moral claim.)

## 2.5 Necessary vs. Sufficient Confusion
Argument treats a necessary condition as sufficient (or vice versa).
- *Example*: "To pass the exam, students must study. Maria studied, so she will pass." → Studying is necessary, not sufficient.

## 2.6 Straw Man
Argument misrepresents an opponent's position, then attacks the misrepresentation.

## 2.7 Appeal to Authority
Argument cites an authority who is not an expert in the relevant field.

## 2.8 Appeal to Popularity / Tradition
"Most people believe X" or "We've always done X" therefore X is correct.

## 2.9 Circular Reasoning
The conclusion is restated as a premise.

## 2.10 False Dichotomy
Argument presents only two options when others exist.

## 2.11 Whole vs. Part / Composition-Division
- Composition: assumes what is true of parts is true of the whole.
- Division: assumes what is true of the whole is true of every part.

## 2.12 Survey / Self-Selection Bias
Survey respondents are not representative of the target population.

## 2.13 Percent vs. Number Confusion
Argument confuses rates / percentages with absolute counts.

## 2.14 Ad Ignorantiam (Appeal to Ignorance)
Lack of evidence against X is treated as evidence for X.

## 2.15 Hasty Generalisation
A single example or small set of examples is used to generalise about a population.

## 2.16 Conditional Reasoning Errors
- **Mistaken Negation**: A → B used to conclude ¬A → ¬B.
- **Mistaken Reversal**: A → B used to conclude B → A.

These two are heavily tested.`,
      importantNote: `Conditional flaws (Mistaken Reversal and Mistaken Negation) appear on virtually every LR section. They are often disguised in everyday language — "If you study, you will pass. Maria didn't study, so she won't pass" is Mistaken Negation. Train your eye to spot them.`,
    },
    {
      id: 'lr-flaw-method',
      title: `3. Method`,
      content: `## Step 1 — Confirm Flaw Question
Stem mentions "vulnerable to criticism," "flawed," "questionable," etc.

## Step 2 — Find the Conclusion
Required for every LR.

## Step 3 — Diagnose the Flaw in Plain English
"The argument is treating correlation as causation," "the argument is generalising from a single example," "the argument is reversing the conditional," etc. Match the diagnosis to a named flaw.

## Step 4 — Match to an Answer
LSAT often phrases flaws in abstract language. "Confuses an effect for a cause" = reversal of causation. "Takes for granted that what is true of one is true of the whole" = composition fallacy.

## Step 5 — Verify by Re-Reading
Read the matched answer choice while looking at the stimulus. Make sure the abstract language really describes what the stimulus did.`,
    },
    {
      id: 'lr-flaw-traps',
      title: `4. Common Trap Answers`,
      content: `## 4.1 Describes a Flaw the Argument Doesn't Make
A common, real-world flaw that didn't occur in this argument.

## 4.2 Uses Familiar Logical Vocabulary Wrongly
"Appeal to authority" sounds tempting, but if no authority was cited, it's wrong.

## 4.3 Half Right
First clause matches; second clause adds an unstated detail.

## 4.4 Too Specific
Describes a quirky aspect that isn't actually the structural problem.

## 4.5 Confuses Two Named Flaws
E.g., calls something an equivocation when it's actually a necessary-sufficient confusion. Re-read both definitions if you're unsure.

## 4.6 Mis-Names Conditional Flaws
The LSAT loves to dangle "mistaken reversal" and "mistaken negation" as alternative answers when the actual flaw is the other one.`,
      quiz: [
        {
          question: `"Studies show that people who own pets live longer than those who don't. Therefore, owning a pet causes longevity." What flaw does this commit?`,
          options: [
            `Appeal to authority`,
            `Circular reasoning`,
            `Confuses correlation with causation`,
            `Equivocation`,
            `Hasty generalisation`,
          ],
          correctIndex: 2,
          explanation: `Pet ownership and longevity are correlated; the argument concludes one CAUSES the other without ruling out reverse causation (healthier people are more likely to own pets) or a common cause (income / lifestyle).`,
        },
        {
          question: `"If you exercise daily, you will improve your cardiovascular health. Joe doesn't exercise daily; therefore his cardiovascular health will not improve." What flaw does this commit?`,
          options: [
            `Mistaken reversal`,
            `Mistaken negation`,
            `Composition fallacy`,
            `Appeal to popularity`,
            `False dichotomy`,
          ],
          correctIndex: 1,
          explanation: `Daily Exercise → Improved Heart Health. The argument concludes ¬Daily Exercise → ¬Improved Heart Health (Mistaken Negation). Joe could improve his cardio health some other way.`,
        },
        {
          question: `"Famed novelist Bart Reyes endorses the proposed environmental regulation; therefore the regulation must be sound." What flaw does this commit?`,
          options: [
            `Ad hominem`,
            `Inappropriate appeal to authority`,
            `Straw man`,
            `Circular reasoning`,
            `Mistaken reversal`,
          ],
          correctIndex: 1,
          explanation: `Bart Reyes is a novelist, not an expert in environmental policy. Citing him as authority on regulation is an inappropriate appeal to authority.`,
        },
      ],
    },
    {
      id: 'lr-flaw-worked',
      title: `5. Worked Example`,
      content: `## Stimulus
> A recent study found that towns with more libraries per capita have lower unemployment rates. The mayor of Springfield concludes that building more libraries will reduce Springfield's unemployment rate.

## Diagnose
The stimulus observes a CORRELATION (more libraries ↔ lower unemployment) and the mayor draws a CAUSAL conclusion (libraries cause low unemployment). Classic correlation vs. causation flaw.

Could be: reverse causation (wealthier towns have both more libraries and lower unemployment), common cause (high tax base → both), or selection.

## Match Answer

- (A) "Treats a generalisation about a town's libraries as if it applied to its school system." — No school system mentioned.
- (B) "Concludes that one factor caused another based solely on a correlation between them." — Bullseye.
- (C) "Relies on an authority not qualified to speak on the issue." — No authority cited.
- (D) "Generalises from an unrepresentative sample." — Possible, but the bigger flaw is the leap from correlation to causation.
- (E) "Takes for granted that what is true of one is true of all." — Composition fallacy, not what's happening here.

**Answer: (B).**`,
    },
    {
      id: 'lr-flaw-drill',
      title: `6. Drill Prompts`,
      content: `For each stimulus, name the flaw in plain English (e.g., "mistaken reversal," "appeal to popularity").

## Drill 1
> "Most people believe global warming is a hoax. Therefore, global warming is a hoax."

## Drill 2
> "The CEO of Acme Corp says the new product is safe. Therefore, the new product is safe."

## Drill 3
> "Cara studied for three hours and passed the exam. Therefore, anyone who studies for three hours will pass the exam."

## Drill 4
> "Every member of the chess club is a strong chess player. Therefore, the chess club, as a whole, is the strongest chess team in the region."

## Drill 5
> "If a movie is rated PG-13, it's appropriate for teenagers. The new film is not rated PG-13, so it must not be appropriate for teenagers."

## Drill 6
> "We must choose between cutting the arts budget and cutting the athletics budget. Cutting athletics would harm school spirit, so we must cut the arts."`,
    },
  ],
  keyTakeaways: [
    `Flaw questions ask what's WRONG with the argument's reasoning, not what new info undermines it.`,
    `Memorise the ~15 named flaws — they recycle on every test.`,
    `Correlation vs. causation is by far the most common flaw.`,
    `Conditional flaws (Mistaken Reversal, Mistaken Negation) appear constantly.`,
    `Necessary vs. Sufficient confusion is the second-most common pattern.`,
    `Don't be tempted by familiar flaw names if the argument doesn't actually make that flaw.`,
    `Diagnose in plain English first, then match to abstract LSAT language.`,
    `Composition / division flaws are easy to miss — watch for whole-vs-part shifts.`,
  ],
},

lr_principle: {
  topicId: 'lr_principle',
  title: `Principle Questions (Apply / Strengthen / Identify)`,
  domainWeight: 'Logical Reasoning · ~7% of LR section · Tier: High',
  overview: `Principle questions involve a broad rule (a principle) and a specific situation. They come in three flavours: (1) Apply — given a principle, which scenario follows it? (2) Strengthen — which principle best justifies the argument? (3) Identify — which principle is illustrated by the argument? All three reward the same skill: matching an abstract rule to a concrete case.`,
  sections: [
    {
      id: 'lr-prn-definition',
      title: `1. The Three Flavours`,
      content: `## Apply (Principle → Case)
Stem: "Which one of the following judgments most closely conforms to the principle above?"
You are given a principle; you must find the answer choice that obeys it.

## Strengthen / Justify (Case → Principle)
Stem: "Which one of the following principles, if valid, most helps to justify the reasoning?"
You are given an argument; you must find the principle that supports it.

## Identify
Stem: "Which one of the following principles is best illustrated by the passage?"
You are given a case; you must extract the rule that the case follows.

## What Makes Principle Questions Distinctive
- A principle is typically a **conditional** ("If X, then Y is justified" or "When X applies, one should Y").
- The case is a specific instance of X, and the answer must connect the X-conditions of the principle to the case.`,
      examTip: `Translate every principle into a conditional. "Anyone who violates a posted rule should be subject to discipline" becomes "Violated Posted Rule → Subject to Discipline." Then ask whether the case fits the antecedent or the consequent.`,
    },
    {
      id: 'lr-prn-method',
      title: `2. Method`,
      content: `## Apply Method
1. Read the principle and convert to conditional form.
2. For each answer choice, check whether the case satisfies the antecedent.
3. If antecedent is met, check whether the action / judgement matches the consequent.
4. Reject any answer where the case fails to fit the antecedent, or where the action contradicts the consequent.

## Strengthen Method
1. Read the argument and find the conclusion (what's being justified).
2. Look for the gap: under what general rule would the premises support the conclusion?
3. Pick the answer that supplies that rule.
4. The right principle is broad enough to cover the case but not too broad to be obviously false.

## Identify Method
1. Read the argument and abstract the structure.
2. State the implicit rule in plain language.
3. Pick the answer that captures that rule.

## Watch For Scope
A principle is wrong if it covers situations outside the case, or fails to cover the case itself. The right answer matches the scope precisely.`,
      importantNote: `Principle answers must MATCH the case exactly. A principle that is too narrow (excludes the case) or too broad (covers other unrelated cases unnecessarily) is usually wrong on Strengthen-Principle. On Apply-Principle, the case must satisfy the principle's antecedent AND match its consequent.`,
    },
    {
      id: 'lr-prn-traps',
      title: `3. Common Traps`,
      content: `## 3.1 Antecedent Mismatch
The case does not satisfy the principle's antecedent. The principle says "If X is rare, then…"; the case is about something common.

## 3.2 Consequent Mismatch
The case meets the antecedent but the answer's action contradicts the principle's consequent.

## 3.3 Direction Reversal
On Apply questions, the trap reverses the conditional: the principle is "If X, then Y is permissible," and the trap says "Y was done, therefore X was satisfied."

## 3.4 Over-Generalisation
The principle is broader than what the case requires. On Strengthen-Principle, an answer that helps but extends far beyond the case is often the trap.

## 3.5 Under-Generalisation
The principle is narrower than the case requires. The argument depended on a broader claim than the answer provides.`,
      quiz: [
        {
          question: `Principle: "A public official should resign only if she has knowingly broken a law." Which judgement CONFORMS to this principle?`,
          options: [
            `Senator Park resigned after being criticised for an unpopular vote.`,
            `Mayor Lin resigned after knowingly accepting an illegal campaign contribution.`,
            `Governor Reyes refused to resign even though she had knowingly violated state ethics laws.`,
            `Councillor Diaz resigned after an opponent accused her of misconduct, despite no evidence of wrongdoing.`,
            `Treasurer Adams resigned because her party demanded it.`,
          ],
          correctIndex: 1,
          explanation: `The principle says resignation is appropriate ONLY IF the official knowingly broke a law. Mayor Lin knowingly accepted an illegal contribution and resigned — matches both the antecedent (knowingly broke a law) and the consequent (resigned). (A), (D), (E) involve resignation without lawbreaking, which violates the "only if" condition. (C) is a case where the official should have resigned per the principle but didn't — the principle doesn't say she MUST resign, so this isn't a violation, but it doesn't illustrate conforming behaviour either.`,
        },
      ],
    },
    {
      id: 'lr-prn-worked',
      title: `4. Worked Example — Strengthen-Principle`,
      content: `## Stimulus
> A city government is debating whether to require restaurants to post calorie counts on menus. Public health advocates argue the requirement is justified because diners often underestimate the calorie content of restaurant meals.

## Conclusion
The calorie-posting requirement is justified.

## Gap
The advocates' premise is about diner misperception. The conclusion is that the requirement is **justified** — a normative claim. We need a principle that takes misperception and produces justified government action.

## Predicted Principle
"When consumers systematically misjudge a product's properties, the government is justified in requiring disclosure."

## Match
- (A) "Government regulation is justified only when health is at risk." — Possibly applicable, but doesn't directly turn misperception into justification.
- (B) "When consumers cannot easily learn relevant information about a product, the government may justifiably require disclosure of that information." — **Strong match.** Connects diner misperception (cannot easily learn) to justified disclosure requirement.
- (C) "Restaurants should be required to provide nutritional information when customers request it." — Weaker; the principle should justify *mandated posting*, not request-based disclosure.
- (D) "Government regulation of menus is justified only when an industry refuses to self-regulate." — Out of scope (industry behaviour wasn't mentioned).
- (E) "Diners should educate themselves about restaurant food before ordering." — Opposite direction; this would weaken the argument.

**Answer: (B).**`,
    },
    {
      id: 'lr-prn-drill',
      title: `5. Drill Prompts`,
      content: `## Drill 1 (Apply)
> Principle: "A business should only adopt a new policy if the policy clearly benefits both employees and customers."
> Which scenario conforms?

## Drill 2 (Strengthen)
> Argument: "The teacher's decision to allow open-book exams is justified because students will retain information longer when they focus on application rather than memorisation."
> Predict a principle that justifies this.

## Drill 3 (Identify)
> Argument: "The committee declined to admit any applicant who had not personally interviewed with the board, regardless of their credentials."
> What implicit rule is illustrated?

## Drill 4 (Apply)
> Principle: "An athlete should be suspended only when there is clear evidence she intentionally cheated."
> Which judgement violates this principle?

## Drill 5 (Strengthen)
> Argument: "The court should set aside the verdict because the jury was not informed of a key witness's bias."
> Predict the principle.`,
    },
  ],
  keyTakeaways: [
    `Principle questions match a general rule to a specific case.`,
    `Translate every principle into a conditional before matching.`,
    `Apply-Principle requires the case to satisfy the antecedent AND meet the consequent.`,
    `Strengthen-Principle picks the broad rule that justifies the argument.`,
    `Identify-Principle extracts the implicit rule from the case.`,
    `Watch scope — principles too narrow exclude the case; too broad cover unrelated cases.`,
    `"Only if" introduces necessary conditions; mistranslating it is a top trap.`,
    `Direction reversal is the most common Apply-Principle trap.`,
  ],
},

lr_main_point: {
  topicId: 'lr_main_point',
  title: `Main Point / Main Conclusion Questions`,
  domainWeight: 'Logical Reasoning · ~6% of LR section · Tier: High',
  overview: `Main Point questions ask you to identify the author's primary conclusion. Sounds easy, but LSAT stimuli often layer a subsidiary conclusion (sub-conclusion) before the main one, and many trap answers describe the sub-conclusion instead. Mastery comes from the "but / however / therefore" test and from learning to ignore distracting opposing views.`,
  sections: [
    {
      id: 'lr-mp-definition',
      title: `1. What a Main Point Question Asks`,
      content: `## Standard Stems
- "Which of the following most accurately expresses the **main point** / **main conclusion** of the argument?"
- "Which of the following most accurately states the **conclusion** drawn by the author?"
- "The author's argument is structured to lead to which of the following as its main conclusion?"

## Anatomy of an LSAT Argument
A typical Main Point stimulus has:
1. Background or context
2. Opposing view (often introduced as "Some claim…")
3. Author's response, including a sub-conclusion
4. Main conclusion (often introduced by "therefore," "thus," "so," "the real reason," or marked by a pivot word like "however")

## The Key Trick: Sub-Conclusion vs. Main Conclusion
A sub-conclusion is supported by a premise but in turn supports the main conclusion. The main conclusion is supported by everything else but supports nothing in the argument.

## The "Therefore" Test
Read the argument's pieces in candidate order: "X, therefore Y." If swapping the order to "Y, therefore X" sounds wrong, then Y is the main conclusion.`,
      examTip: `Locate transition words: "however," "but," "yet," "nevertheless," "in fact." These almost always precede the author's actual position — and often precede the main conclusion. When you see an opposing view, the author's response is the conclusion.`,
    },
    {
      id: 'lr-mp-method',
      title: `2. Method`,
      content: `## Step 1 — Read the Stimulus
Resist the temptation to "skim" Main Point stimuli. The structure (which sentence supports which) is everything.

## Step 2 — Map the Structure
Label each sentence: Background (B), Opposing View (O), Premise (P), Sub-Conclusion (SC), Main Conclusion (MC).

## Step 3 — Apply the "Therefore" Test
- Premise + Sub-Conclusion + Main Conclusion: "Because P, therefore SC, therefore MC."
- If you swap SC and MC, the logic breaks: "Because P, therefore MC, therefore SC" — wrong order.

## Step 4 — Eliminate
- Eliminate any answer that paraphrases a premise.
- Eliminate any answer that paraphrases the opposing view (especially if it sounds negative — "X is wrong about Y").
- Eliminate any answer that is a sub-conclusion (still has something supporting something else above it).

## Step 5 — Pick the Author's Voice
The main conclusion is what the author is arguing for, not what the author is rebutting.`,
      importantNote: `The opposing view trap is the most common. The stimulus says "Critics claim X. But in fact, Y." Test-takers sometimes pick an answer that paraphrases X — but X is the OPPOSING view, not the author's conclusion. The conclusion is always Y.`,
    },
    {
      id: 'lr-mp-traps',
      title: `3. Common Traps`,
      content: `## 3.1 Opposing View
The answer paraphrases what the author is rebutting.

## 3.2 Sub-Conclusion
The answer paraphrases a sub-conclusion (something supported by a premise but in turn supporting the main conclusion).

## 3.3 Premise Restatement
The answer restates one of the premises.

## 3.4 Too Strong
The answer goes beyond what the author actually argues.

## 3.5 Half-Right
First clause matches the main conclusion; second adds an unsupported claim.

## 3.6 Wrong Subject
The answer is about a related but distinct topic.

## 3.7 Reversed Causal Direction
On causal stimuli, the trap reverses cause and effect.`,
      quiz: [
        {
          question: `Stimulus: "Critics claim the city's new bike lanes have made traffic congestion worse. But traffic surveys show that average commute times have actually decreased by 3% since the lanes were installed. The critics are wrong: the bike lanes have improved, not worsened, downtown traffic flow." What is the MAIN CONCLUSION?`,
          options: [
            `The city's new bike lanes have made traffic congestion worse.`,
            `Traffic surveys show average commute times decreased by 3%.`,
            `The critics' claim is based on insufficient data.`,
            `The bike lanes have improved, not worsened, downtown traffic flow.`,
            `Critics should review the traffic survey data.`,
          ],
          correctIndex: 3,
          explanation: `(A) is the opposing view. (B) is a premise. (C) is unsupported by the stimulus. (E) is out of scope. (D) is the author's actual conclusion.`,
        },
      ],
    },
    {
      id: 'lr-mp-worked',
      title: `4. Worked Example`,
      content: `## Stimulus
> Many economists argue that government stimulus spending is the most effective way to combat recessions. However, a careful look at the data tells a different story. Countries that pursued aggressive monetary policy — lowering interest rates and expanding the money supply — recovered from the 2008 recession 18 months faster, on average, than countries that emphasised fiscal stimulus. The data suggest that monetary policy, not fiscal stimulus, is the more effective recession-fighting tool.

## Map the Structure
- Sentence 1: Opposing view ("Many economists argue…")
- Sentence 2: Pivot ("However…")
- Sentence 3: Premise (data about monetary policy)
- Sentence 4: Main conclusion ("Monetary policy, not fiscal stimulus, is the more effective recession-fighting tool.")

## Match
- (A) Government stimulus spending is the most effective recession-fighting tool. — Opposing view; eliminate.
- (B) Monetary policy is more effective than fiscal stimulus at fighting recessions. — Matches the main conclusion.
- (C) Countries that pursued aggressive monetary policy recovered 18 months faster. — Premise; eliminate.
- (D) Economists are usually wrong about recessions. — Too strong, not stated.
- (E) The 2008 recession was caused by inadequate monetary policy. — Out of scope.

**Answer: (B).**`,
    },
    {
      id: 'lr-mp-drill',
      title: `5. Drill Prompts`,
      content: `For each stimulus, identify the main conclusion in one sentence.

## Drill 1
> "Some people say teenagers should not be allowed to drive at night. They argue that night driving requires experience teenagers lack. But research shows that teen accidents at night are no more frequent per mile than adult accidents at night. The proposed restriction is therefore unwarranted."

## Drill 2
> "Investors often assume that high-frequency trading destabilises the stock market. Yet markets with the heaviest HFT activity show LOWER price volatility than markets with light HFT activity. HFT, then, stabilises rather than destabilises prices."

## Drill 3
> "Editorialists frequently claim that universities are admitting fewer humanities majors. The actual data show that humanities admissions have held steady for ten years; what has changed is the share of students who DECLARE a humanities major after admission. The decline, in other words, is not a decline in admissions but a decline in declaration rates."

## Drill 4
> "A common view holds that legal regulation slows technological innovation. But the most heavily regulated industry of the past decade — biotechnology — has produced more patented inventions per year than any unregulated industry. Regulation, when properly designed, can stimulate rather than retard innovation."

## Drill 5
> "Many parents worry that screen time harms their children's reading skills. The evidence shows, however, that children who use educational apps for 30 minutes a day score HIGHER on reading tests than children who do not. Properly chosen screen time can support, rather than impair, literacy."`,
    },
  ],
  keyTakeaways: [
    `Main Point asks for the author's primary conclusion, not the opposing view or a sub-conclusion.`,
    `Transition words ("however," "but," "yet") usually mark the author's pivot to their conclusion.`,
    `Apply the "therefore" test: the main conclusion is what everything else supports.`,
    `The opposing view trap is the most common — it sounds plausible but it's what the author is REBUTTING.`,
    `A sub-conclusion is supported by a premise but in turn supports the main conclusion.`,
    `Eliminate premise restatements first — they are always wrong on Main Point.`,
    `Watch causal stimuli: the conclusion is usually a causal claim, not the data.`,
    `The right answer should sound like the author's voice, not a paraphrase of a critic.`,
  ],
},

lr_role: {
  topicId: 'lr_role',
  title: `Role / Function in Argument Questions`,
  domainWeight: 'Logical Reasoning · ~5% of LR section · Tier: Medium',
  overview: `Role questions identify the function of a specific statement in the argument — usually a bolded sentence or a sentence the stem quotes directly. Each statement plays one of a small set of roles: premise, main conclusion, sub-conclusion, opposing view, evidence cited and rejected, background, etc. The technique: locate the statement and ask what it does for the argument.`,
  sections: [
    {
      id: 'lr-role-definition',
      title: `1. What a Role Question Asks`,
      content: `## Standard Stems
- "The claim that [bolded sentence] plays which of the following **roles** in the argument?"
- "The statement that X **functions** in the argument as…"
- "The portion in **boldface** functions primarily to…"

## The Five Possible Roles
1. **Main Conclusion** — the ultimate point of the argument.
2. **Sub-Conclusion** — an intermediate conclusion that supports the main conclusion.
3. **Premise / Evidence** — supports a conclusion.
4. **Opposing View** — a position the author is rebutting.
5. **Background / Context** — sets up the discussion without supporting or opposing.

## Two-Bolded Variants
Some Role questions bold TWO statements. You must classify both. The answer has the form "the first is X; the second is Y."

## Skill: Argument Mapping
Same as Main Point: map every sentence to one of the five roles. The bolded sentence's role is exactly what you label it during mapping.`,
      examTip: `On two-bolded questions, classify each bolded statement INDEPENDENTLY first, then check the answer that matches BOTH classifications. Many test-takers correctly identify one bolded statement and pick an answer that mislabels the other.`,
    },
    {
      id: 'lr-role-method',
      title: `2. Method`,
      content: `## Step 1 — Read the Stimulus
Pay attention to transition words and to which sentences support which.

## Step 2 — Map Every Sentence
Use abbreviations: B (background), O (opposing), P (premise), SC (sub-conclusion), MC (main conclusion).

## Step 3 — Locate the Bolded Statement
Identify which role label you gave it.

## Step 4 — Translate to LSAT Vocabulary
LSAT answers use abstract phrasing. Build a translation dictionary:

- "Stated as an assumption / accepted premise" → Premise
- "Cited as evidence" → Premise
- "Intermediate conclusion" → Sub-Conclusion
- "Main conclusion the argument seeks to establish" → MC
- "Position the author argues against" → Opposing view
- "Background / context / set-up" → Background

## Step 5 — Verify
Re-read the stimulus while looking at the answer. If the abstract description doesn't fit the function in context, eliminate.`,
      importantNote: `A sentence can be a premise for the main conclusion AND a conclusion supported by sub-premises. That's a sub-conclusion. Many test-takers mislabel sub-conclusions as either premise (because they support MC) or main conclusion (because they're supported). Sub-conclusions do BOTH — they're a hybrid.`,
    },
    {
      id: 'lr-role-traps',
      title: `3. Common Traps`,
      content: `## 3.1 Premise vs. Sub-Conclusion Confusion
Trap labels a sub-conclusion as a premise (or vice versa).

## 3.2 MC vs. SC Confusion
On Main Point-style stimuli, trap labels the sub-conclusion as the main conclusion.

## 3.3 Opposing View Mislabel
The bolded statement is the author's response, but the trap labels it as the opposing view (or vice versa).

## 3.4 Half-Right Two-Bolded Answer
On two-bolded questions, one part of the answer is right and the other is wrong.

## 3.5 Tone Mismatch
The trap describes a sentence as supporting the conclusion when in fact the author cites it only to reject it.`,
      quiz: [
        {
          question: `Stimulus: "Many readers assume that classical music sales have collapsed in the digital age. **However, classical music sales have remained surprisingly steady over the past decade.** Streaming services have introduced classical music to new audiences, and physical sales in this genre have only modestly declined. The dire predictions about classical music's commercial demise were unfounded." The boldface portion plays which role?`,
          options: [
            `It is a premise supporting the main conclusion.`,
            `It is the opposing view that the author rejects.`,
            `It is the main conclusion of the argument.`,
            `It is background information.`,
            `It is a sub-conclusion that the rest of the argument supports.`,
          ],
          correctIndex: 4,
          explanation: `The bolded statement summarises the data trend. The streaming and physical-sales premises SUPPORT it. It in turn supports the main conclusion ("dire predictions were unfounded"). That makes it a sub-conclusion. (A) is wrong because the bolded line is supported by other premises, not a premise itself. (C) is wrong — the final sentence is the main conclusion. (B) is wrong — it's the author's view, not the opposing view.`,
        },
      ],
    },
    {
      id: 'lr-role-worked',
      title: `4. Worked Example — Two-Bolded`,
      content: `## Stimulus
> Some economists argue that **raising the minimum wage causes unemployment among low-skilled workers**. They cite studies from the 1980s showing modest job losses after wage increases. However, more recent studies controlling for regional variation find no statistically significant effect on employment. **Raising the minimum wage, in fact, has little to no measurable impact on overall employment levels.**

## Map
- Sentence 1 (first bolded): Opposing economists' view.
- Sentence 2: Premise CITED by the opposing view.
- Sentence 3: Author's counter-evidence.
- Sentence 4 (second bolded): Author's main conclusion.

## Match
The first bolded is the opposing view; the second is the author's main conclusion. Look for an answer that matches both.

- (A) The first is the main conclusion; the second is a premise. — Wrong (reverses).
- (B) The first is a position the argument seeks to refute; the second is the main conclusion. — Bullseye.
- (C) The first is background; the second is a sub-conclusion. — Wrong on both counts.
- (D) The first is a premise; the second is a sub-conclusion. — Wrong on both.
- (E) Both are sub-conclusions. — Wrong.

**Answer: (B).**`,
    },
    {
      id: 'lr-role-drill',
      title: `5. Drill Prompts`,
      content: `For each stimulus, classify the bolded statement.

## Drill 1
> "**Universal pre-kindergarten programmes consistently produce long-term academic gains.** Such gains have been measured in reading, math, and graduation rates. Investing in pre-K is therefore one of the highest-return education policies available."

## Drill 2
> "Some city planners argue that more bike lanes will improve traffic. Empirical data, however, do not support this claim. **Traffic congestion has increased in every city that has expanded bike lanes beyond 5% of road area.** Bike lanes, beyond a moderate level, may actually worsen traffic."

## Drill 3
> "It has long been said that **chess prodigies plateau in their twenties**. Yet recent grandmaster careers, with steady gains into players' thirties, refute this conventional wisdom. The plateau hypothesis no longer holds."

## Drill 4
> "Critics of remote work claim it harms productivity. Studies of remote employees during 2020–2023 show, on the contrary, that **measured productivity rose by 8% on average**. Remote work, properly managed, can outperform office arrangements."`,
    },
  ],
  keyTakeaways: [
    `Role questions ask the function of a specific statement in the argument.`,
    `The five possible roles: premise, sub-conclusion, main conclusion, opposing view, background.`,
    `A sub-conclusion is BOTH supported by premises AND supports the main conclusion.`,
    `On two-bolded variants, classify each statement independently.`,
    `Watch for the opposing-view trap: bolded statements often introduce the view being REBUTTED.`,
    `Translate LSAT abstract vocabulary into plain-English role labels.`,
    `Transition words ("however," "but," "in fact") mark the author's pivot to their conclusion.`,
    `If a statement supports nothing and is supported by nothing, it's background.`,
  ],
},

lr_resolve_paradox: {
  topicId: 'lr_resolve_paradox',
  title: `Resolve the Paradox Questions`,
  domainWeight: 'Logical Reasoning · ~5% of LR section · Tier: Medium',
  overview: `Resolve questions present two seemingly contradictory facts and ask which answer would explain how both can be true. The correct answer is the missing piece that reconciles the apparent contradiction. Unlike Strengthen or Weaken, there's no conclusion being defended — only a puzzle to solve.`,
  sections: [
    {
      id: 'lr-rp-definition',
      title: `1. What a Resolve Question Asks`,
      content: `## Standard Stems
- "Which of the following, if true, most helps to **resolve** the apparent paradox / discrepancy?"
- "Which of the following, if true, most helps to **explain** the seemingly conflicting findings?"
- "Each of the following helps to resolve the paradox EXCEPT…"

## Structure of the Stimulus
- Fact A (often surprising)
- Fact B (also surprising, and seemingly inconsistent with A)
- No explicit conclusion — just the puzzle.

## What the Right Answer Does
- Reveals a hidden variable that lets both facts coexist.
- Often takes the form: "Even though A, [hidden factor] explains B."

## The Trap to Avoid
On Resolve questions, the trap is often an answer that supports ONE of the two facts but contradicts the other. The right answer must make BOTH facts simultaneously plausible.`,
      examTip: `Articulate the paradox in your own words before scanning answers. "Fact A says X is supposed to lead to Y, but Fact B shows it didn't / led to the opposite." Once you've stated the paradox precisely, the right answer often jumps off the page.`,
    },
    {
      id: 'lr-rp-method',
      title: `2. Method`,
      content: `## Step 1 — Identify Both Facts
List Fact A and Fact B. Underline the words that make them seem contradictory.

## Step 2 — State the Tension
Write (or think) the paradox in one sentence: "How can A and B both be true?"

## Step 3 — Brainstorm Resolutions
- A hidden third variable affects B but not A.
- The two facts measure different populations / times / contexts.
- An offsetting factor cancels what would otherwise have been an expected effect.
- The mechanism of A is different from what was assumed.

## Step 4 — Match
Find the answer that makes BOTH facts consistent.

## Step 5 — Reject Selective Answers
Reject any answer that confirms one fact but worsens the other.`,
      importantNote: `EXCEPT-form Resolve questions ("each helps to resolve EXCEPT") reverse the task. Four choices DO resolve; the credited answer is the one that does NOT — either it makes the paradox worse or it has no effect.`,
    },
    {
      id: 'lr-rp-traps',
      title: `3. Common Traps`,
      content: `## 3.1 Resolves One Side Only
The answer confirms Fact A but does nothing about Fact B (or worsens it).

## 3.2 Makes the Paradox Worse
The answer is in the wrong direction.

## 3.3 Out of Scope
The answer addresses a related but distinct topic.

## 3.4 Reverses Causation
The answer flips the causal direction of one of the facts.

## 3.5 Half-Right Reasoning
The first clause helps; the second clause is contradictory or irrelevant.`,
      quiz: [
        {
          question: `Stimulus: "Studies show that countries with stricter gun control laws have lower rates of firearm homicide than countries with looser laws. Yet within the United States, individual states with stricter gun control laws do not have measurably lower rates of firearm homicide than states with looser laws." Which would BEST resolve this apparent discrepancy?`,
          options: [
            `Federal law in the United States preempts state gun control measures.`,
            `Firearms can be easily transported across U.S. state borders, while international borders are more controlled.`,
            `Gun control laws are more strictly enforced abroad than in the United States.`,
            `The studies on international gun control used outdated data.`,
            `Firearm ownership rates are higher in countries with looser gun laws.`,
          ],
          correctIndex: 1,
          explanation: `If guns can cross state borders freely, individual state restrictions are undermined — explaining why state-level differences don't manifest in homicide rates the way country-level differences do. This makes both facts (international: laws work; intrastate: laws appear not to work) simultaneously plausible. (A), (C) are partial. (D) undermines one fact rather than reconciling. (E) is consistent with both but doesn't explain the within-US null finding.`,
        },
      ],
    },
    {
      id: 'lr-rp-worked',
      title: `4. Worked Example`,
      content: `## Stimulus
> A new flu vaccine reduces infection rates by 70% in clinical trials. Yet during the past flu season, hospitals reported a SIGNIFICANT INCREASE in flu admissions compared to the previous season, even though most patients had received the vaccine.

## State the Paradox
"How can a vaccine that reduces infection by 70% coexist with a rise in flu admissions?"

## Possible Resolutions
- Population: more people are tested / report symptoms.
- The flu strain mutated; vaccine targeted last year's strain.
- Vaccination is selective: only at-risk populations received it.
- Underlying flu prevalence soared; even with 70% reduction, absolute infections rose.

## Match
- (A) "Hospitals expanded flu testing programmes this season, capturing milder cases." → Resolves: more diagnosis, not more disease.
- (B) "The vaccine was distributed only after most cases of the season had occurred." → Resolves: temporal mismatch.
- (C) "Vaccinated patients had lower hospitalisation rates than unvaccinated patients within the same season." → This addresses the population mix but doesn't fully explain the overall rise.
- (D) "Last year's flu strain was milder than this year's." → Resolves: this year's flu was inherently worse, so even 70% reduction couldn't offset higher prevalence.
- (E) "Most patients reported they had been vaccinated." → Doesn't resolve.

Several answers could resolve. A real LSAT question would isolate one. Among these, (D) most cleanly resolves: vaccine works on its own terms, but a more virulent strain explains the rise.`,
    },
    {
      id: 'lr-rp-drill',
      title: `5. Drill Prompts`,
      content: `Predict a resolution for each.

## Drill 1
> "Despite a sharp rise in coffee bean prices, coffee shops have not raised retail prices."

## Drill 2
> "Online tutoring platforms claim higher student satisfaction than in-person tutoring, yet students who switch from online to in-person rarely switch back."

## Drill 3
> "Cities that built more bike lanes saw fewer cyclist injuries, yet the total number of cyclist injuries in the country rose."

## Drill 4
> "A new diet drug reduced average body weight by 8% in trials, but participants who took the drug for two years gained more weight than they lost."

## Drill 5
> "Sleep researchers say humans need 7-9 hours of sleep; yet survey data show most adults who sleep 6 hours daily report no health complaints."`,
    },
  ],
  keyTakeaways: [
    `Resolve questions present two seemingly contradictory facts and ask for a reconciliation.`,
    `The right answer makes BOTH facts simultaneously plausible.`,
    `Common resolution patterns: hidden variable, population mismatch, temporal shift, mechanism mismatch.`,
    `State the paradox in plain English before scanning answers.`,
    `Reject answers that confirm one fact but contradict the other.`,
    `EXCEPT-form questions invert the task.`,
    `Causal direction reversal is a common trap.`,
    `On surprising-statistic stimuli, look for selection bias as the resolution.`,
  ],
},

lr_method: {
  topicId: 'lr_method',
  title: `Method of Reasoning Questions`,
  domainWeight: 'Logical Reasoning · ~5% of LR section · Tier: Medium',
  overview: `Method of Reasoning questions ask HOW the argument proceeds — what technique the author uses to argue, not whether the argument is right or wrong. Common methods: analogy, generalisation, elimination of alternatives, appeal to authority, counterexample. You're describing the argument's logical structure.`,
  sections: [
    {
      id: 'lr-mor-definition',
      title: `1. What a Method Question Asks`,
      content: `## Standard Stems
- "Which of the following most accurately describes the **method of reasoning** used in the argument?"
- "The argument **proceeds by**…"
- "Which of the following best **describes the argumentative strategy** employed?"

## Common Methods

1. **Analogy / Comparison**: argues by comparing to a similar case.
2. **Generalisation from Sample**: extrapolates from cases to a broader claim.
3. **Counterexample**: shows a generalisation fails by producing one case where it doesn't hold.
4. **Elimination of Alternatives**: rules out competing explanations to support a chosen one.
5. **Appeal to Authority**: cites an expert.
6. **Appeal to Principle**: invokes a general rule and applies it.
7. **Causal Inference**: argues from correlation or evidence to a cause.
8. **Conditional Reasoning**: applies a conditional rule.
9. **Reductio ad Absurdum**: assumes opponent's position and derives a contradiction.

## What Method ≠ Flaw
Method describes the technique. Flaw critiques it. The same argument might be reasonably described by Method ("argues from analogy") and faulted by Flaw ("the analogy is misleading because the cases differ in a key respect").`,
      examTip: `Method answers are usually written in abstract language. Build a mental dictionary: "draws a conclusion based on the testimony of an expert" = appeal to authority; "infers a general claim from particular instances" = generalisation; "infers a cause from a correlation" = causal inference.`,
    },
    {
      id: 'lr-mor-method',
      title: `2. Method`,
      content: `## Step 1 — Read the Stimulus
Note the structure: what evidence is offered, and how does it tie to the conclusion?

## Step 2 — Categorise the Approach
- Does the argument compare two cases? → Analogy
- Does it generalise from cases? → Generalisation
- Does it cite an authority? → Authority
- Does it apply a rule to a case? → Principle Application
- Does it eliminate alternatives? → Process of Elimination
- Does it derive a contradiction from an assumption? → Reductio

## Step 3 — Match
The credited answer will describe the technique in abstract terms. Verify the description matches the structure.`,
    },
    {
      id: 'lr-mor-traps',
      title: `3. Common Traps`,
      content: `## 3.1 Describes a Different Argument
The trap answer describes a method the argument did NOT use.

## 3.2 Half-Right
First clause describes the actual method; second clause adds an element the argument doesn't have.

## 3.3 Confuses Method With Flaw
Answer describes a flaw; question asks for method.

## 3.4 Generalisation vs. Application Confusion
Generalisation goes from cases to a general claim. Application goes from a general claim to a case. They are opposite directions — easy to mix up.

## 3.5 Causal vs. Correlational Confusion
The argument may merely observe a correlation; trap describes it as inferring causation (or vice versa).`,
      quiz: [
        {
          question: `Stimulus: "The proposed merger between AlphaCorp and BetaCorp will harm consumers. We know this because the FTC has approved similar mergers in the past, and within five years those mergers led to higher prices and fewer choices for consumers." The argument PROCEEDS BY:`,
          options: [
            `Citing an authority to support the conclusion.`,
            `Drawing an analogy between past and proposed mergers.`,
            `Eliminating alternative causes of consumer harm.`,
            `Applying a general principle of merger law.`,
            `Refuting an opposing view through counterexample.`,
          ],
          correctIndex: 1,
          explanation: `The argument compares the proposed merger to past similar mergers — that's reasoning by analogy. (A) is wrong: the FTC's approval is just part of the comparison set, not cited as authority on outcomes. (C), (D), (E) don't describe what the argument actually does.`,
        },
      ],
    },
    {
      id: 'lr-mor-worked',
      title: `4. Worked Example`,
      content: `## Stimulus
> Critics of the new dietary supplement claim it causes liver damage. But this cannot be the cause: studies of supplement users show no increase in liver enzyme levels compared to non-users, and laboratory analyses confirm the supplement contains no compounds known to be hepatotoxic.

## Map
- Claim being refuted: supplement causes liver damage.
- Author's strategy: rule out the proposed cause by (a) showing no correlation with liver-damage markers, and (b) showing no plausible mechanism.

## Match
- (A) Cites two pieces of evidence to undermine a causal claim. → Yes.
- (B) Argues by analogy. → No.
- (C) Appeals to authority. → No.
- (D) Applies a general principle. → No.
- (E) Demonstrates an alternative cause. → The argument doesn't propose an alternative; it just refutes.

**Answer: (A).**`,
    },
    {
      id: 'lr-mor-drill',
      title: `5. Drill Prompts`,
      content: `Name the method each argument uses.

## Drill 1
> "Senator Chen argues that the proposed bill will harm small businesses. But Chen is a corporate lawyer who has lobbied against small-business reform for years. We should give her position little weight."

## Drill 2
> "Every president since 1980 who lost the popular vote also lost re-election. The current president lost the popular vote; she will likely lose re-election."

## Drill 3
> "If we believed the critics' argument, we would conclude that all fiction misleads its readers. But fiction has clearly enriched human understanding for centuries. The critics' position is therefore untenable."

## Drill 4
> "The proposed treatment cannot be effective. Out of seven possible mechanisms by which it could work, six have been shown to fail in clinical trials, and the seventh has been ruled out by recent biochemical research."

## Drill 5
> "Schools should ban smartphones. Several studies show smartphone use during class correlates with lower grades. A pilot programme that confiscated phones during class hours saw average GPAs rise 0.3 points."`,
    },
  ],
  keyTakeaways: [
    `Method questions ask HOW the argument argues, not whether it is correct.`,
    `Memorise the common methods: analogy, generalisation, authority, principle, elimination, reductio.`,
    `Don't confuse Method with Flaw — Method is descriptive, Flaw is critical.`,
    `Generalisation goes from cases to a rule; Application goes from a rule to a case.`,
    `Causal inference is method, not flaw (unless the question asks about the flaw).`,
    `LSAT phrases methods in abstract language — build a translation dictionary.`,
    `Half-right answers add a structural element the argument doesn't have.`,
    `When in doubt, paraphrase the argument's structure in plain English first.`,
  ],
},

lr_sufficient_assumption: {
  topicId: 'lr_sufficient_assumption',
  title: `Sufficient Assumption Questions`,
  domainWeight: 'Logical Reasoning · ~5% of LR section · Tier: Medium',
  overview: `Sufficient Assumption (SA) asks for an assumption that, if added, would GUARANTEE the conclusion. Unlike Necessary Assumption (a premise the argument needs), SA is a premise that — together with the existing premises — makes the conclusion logically follow. SA questions are pure conditional logic puzzles.`,
  sections: [
    {
      id: 'lr-sa-definition',
      title: `1. What an SA Question Asks`,
      content: `## Standard Stems
- "Which of the following, if **assumed**, allows the conclusion to be properly **drawn** / **inferred**?"
- "The conclusion **follows logically** if which of the following is assumed?"
- "Which of the following, if added as a premise, **most logically completes** the argument?"

## Key Phrases
"Allows the conclusion to be properly drawn" = SA stem.
"Logically completes the argument" = SA stem.

## SA vs. NA — The Critical Distinction
- **NA**: the argument cannot survive WITHOUT this assumption. (Necessary.) Often weaker.
- **SA**: if this assumption is true, the conclusion is GUARANTEED. (Sufficient.) Often stronger.

## Why SA Questions Are Mostly About Conditionals
The credited SA answer is almost always a conditional statement that bridges a gap in the argument. The argument typically has the form: Premise → ??? → Conclusion. The SA fills in the ???.`,
      examTip: `Diagram every SA stimulus with arrow notation. Translate premises and conclusion into conditional form (A → B). Then look for the bridging conditional in the answer choices. The right answer will close the gap between the last premise and the conclusion.`,
    },
    {
      id: 'lr-sa-method',
      title: `2. Method`,
      content: `## Step 1 — Translate to Conditionals
Premise 1: A → B
Premise 2: B → C
Conclusion: A → D

## Step 2 — Identify the Gap
We have A → C and need A → D. Missing link: C → D.

## Step 3 — Find the Answer That Supplies the Missing Link
The SA answer will state C → D (or its contrapositive).

## Step 4 — Verify
Plug the SA back into the argument. Does the conclusion now follow with certainty? If yes, you have it.

## The Bridging Pattern
SA almost always supplies a connecting conditional. If the argument has unconnected terms in the premise and conclusion, the SA bridges them.

## Special Cases
- If the argument has a quantifier (e.g., "most"), the SA often involves a categorical statement.
- If the conclusion is causal, the SA may rule out alternative causes (similar to Strengthen, but more decisive).`,
      importantNote: `SA answers are typically STRONG ("All X are Y," "X always leads to Y"). Don't reject an answer just because it sounds extreme. On NA questions, strong answers are usually wrong; on SA, strong answers are usually right.`,
    },
    {
      id: 'lr-sa-traps',
      title: `3. Common Traps`,
      content: `## 3.1 Necessary But Not Sufficient
A trap answer is needed but doesn't, on its own, guarantee the conclusion.

## 3.2 Reverses the Conditional
Argument has A → B, conclusion B → C. Trap supplies C → B instead of B → C.

## 3.3 Out of Scope
The answer uses terms not present in the argument.

## 3.4 Too Narrow
The bridge connects two specific subcases but doesn't cover the full conclusion.

## 3.5 Extra Element
The answer includes the right bridge PLUS an additional unrelated claim.`,
      quiz: [
        {
          question: `Argument: "All certified accountants must complete ethics training. Maria completed her ethics training; therefore, she is a certified accountant." The conclusion FOLLOWS LOGICALLY if which is assumed?`,
          options: [
            `Anyone who completes ethics training is a certified accountant.`,
            `Only certified accountants need ethics training.`,
            `Maria is not a certified accountant.`,
            `Some ethics training participants are certified accountants.`,
            `Ethics training is required for many professions.`,
          ],
          correctIndex: 0,
          explanation: `The argument has: Certified → Ethics. Maria completed Ethics. The conclusion (Maria is Certified) requires the reverse direction: Ethics → Certified. Choice (A) supplies exactly that conditional. (B) is the original direction. (D) is too weak. (C), (E) are irrelevant.`,
        },
        {
          question: `Argument: "Plants that don't receive enough sunlight die. The fern in the corner died; therefore, it did not receive enough sunlight." What SA would make this work?`,
          options: [
            `If a plant dies, it did not receive enough sunlight.`,
            `All ferns require sunlight.`,
            `Plants that receive sunlight do not die.`,
            `Some ferns can survive in low light.`,
            `The corner of the room receives sunlight.`,
          ],
          correctIndex: 0,
          explanation: `Argument: ¬Sunlight → Die. Fern died (Die). Conclusion: ¬Sunlight. The argument requires Die → ¬Sunlight. Choice (A) supplies this. (B), (D), (E) are out of scope. (C) is the contrapositive of the premise, but it's already implied by the premise, doesn't justify the conclusion.`,
        },
      ],
    },
    {
      id: 'lr-sa-worked',
      title: `4. Worked Example`,
      content: `## Stimulus
> Any movie that wins the Best Picture Oscar is widely seen. Films widely seen by critics often become cultural touchstones. The latest Spielberg film won Best Picture. Therefore, it will become a cultural touchstone.

## Translate
- Premise 1: Best Picture → Widely Seen (by general audience)
- Premise 2: Widely Seen by Critics → Cultural Touchstone (often)
- Premise 3: Spielberg's film won Best Picture.
- Conclusion: Spielberg's film will become a cultural touchstone.

## Identify the Gap
Premise 1's "widely seen" is by audience; Premise 2's "widely seen" is by critics. The terms don't match.

Also, Premise 2 says "often" — not "always" — so even if the terms aligned, the conclusion isn't guaranteed.

## Predicted SA
"Any movie widely seen by audiences is also widely seen by critics, AND any movie widely seen by critics becomes a cultural touchstone."

## Match
- (A) Best Picture winners are always cultural touchstones. → Directly supplies the bridge.
- (B) Critics watch all Best Picture winners. → Partial; doesn't get to cultural touchstone.
- (C) Spielberg films are usually cultural touchstones. → Doesn't fix the gap.
- (D) Films widely seen by audiences are always widely seen by critics. → Half-bridge.
- (E) Cultural touchstones win Best Picture. → Reverse direction.

**Answer: (A).** It bridges Best Picture directly to cultural touchstone, sidestepping the two-step chain.`,
    },
    {
      id: 'lr-sa-drill',
      title: `5. Drill Prompts`,
      content: `## Drill 1
> "All veterans receive healthcare benefits. Jin receives healthcare benefits, so Jin is a veteran."

## Drill 2
> "If a company is publicly traded, its financial records are public. Tech Corp's records are not public, so Tech Corp is not publicly traded."

## Drill 3
> "Most employees who work overtime are eligible for a bonus. Marcus worked overtime, so he is eligible for a bonus."

## Drill 4
> "Books that win the Pulitzer are bestsellers. Bestsellers are widely reviewed. The new novel won the Pulitzer, so it will be widely reviewed."

## Drill 5
> "Cities with marathons receive significant tourism revenue. Springfield receives significant tourism revenue, so Springfield must have a marathon."`,
    },
  ],
  keyTakeaways: [
    `SA asks for an assumption that GUARANTEES the conclusion (sufficient).`,
    `NA asks for an assumption the argument REQUIRES (necessary). They are different.`,
    `SA answers are typically conditional statements that bridge a gap.`,
    `Strong language (always, all, every) is common in SA answers — don't reject for that reason.`,
    `Diagram every SA stimulus with arrow notation.`,
    `The bridging conditional connects unconnected terms in the premises and conclusion.`,
    `Reverse-direction answers are the most common trap.`,
    `If the argument uses "most" or "often" but concludes universally, the SA must convert the partial to universal.`,
  ],
},

lr_parallel: {
  topicId: 'lr_parallel',
  title: `Parallel Reasoning Questions`,
  domainWeight: 'Logical Reasoning · ~4% of LR section · Tier: Medium',
  overview: `Parallel questions ask you to match the LOGICAL STRUCTURE of the stimulus with one of five answer choices. The structure means the abstract pattern of premises and conclusion — not the subject matter. The right answer talks about a completely different topic but has the SAME argument shape.`,
  sections: [
    {
      id: 'lr-par-definition',
      title: `1. What a Parallel Question Asks`,
      content: `## Standard Stems
- "Which of the following arguments has reasoning **most similar** to that of the argument above?"
- "Which of the following is **most parallel in reasoning** to the argument?"
- "The reasoning in which of the following arguments is **structurally similar** to the reasoning in the argument above?"

## What "Parallel" Means
Same:
- Number and type of premises
- Conditional / quantifier structure
- Direction of inference
- Whether the conclusion is a particular case or a generalisation

Different:
- Subject matter (always different — that's the puzzle)

## Conditional Parallels Are Heavily Tested
The most common parallel question is a conditional chain. Stimulus says A → B → C; conclusion A → C. Right answer has the same chain in different terms.

## Particular vs. Universal
- Particular conclusion: "Maria will pass."
- Universal conclusion: "All students will pass."
The right answer's conclusion must match the type of the stimulus's conclusion.`,
      examTip: `Abstract the stimulus to symbols before scanning answer choices. "All A are B; X is A; therefore X is B." Once you have the symbolic form, the parallel answer pops out — it shares the symbols.`,
    },
    {
      id: 'lr-par-method',
      title: `2. Method`,
      content: `## Step 1 — Identify the Conclusion Type
Particular ("X is Y") or universal ("All X are Y")? Conditional or categorical? Strong or hedged?

## Step 2 — Abstract the Argument
Replace specific terms with letters. The argument now has a logical shape.

## Step 3 — Match Each Answer Choice
For each, abstract it to letters. Does it match the stimulus's shape?

## Step 4 — Match Quantifiers Exactly
"Most" vs. "all" vs. "some" matter. A parallel answer must preserve the same quantifier.

## Step 5 — Match Direction
A → B is not parallel to B → A.

## Two Common Patterns

**Pattern 1: Conditional chain**
- All A are B. All B are C. Therefore all A are C.

**Pattern 2: Conditional with case**
- All A are B. X is A. Therefore X is B.

**Pattern 3: Contrapositive application**
- All A are B. X is not B. Therefore X is not A.

**Pattern 4: Universal denial**
- No A are B. X is A. Therefore X is not B.

Memorise these — they appear constantly.`,
      importantNote: `If the stimulus is FLAWED, the parallel answer must contain the SAME flaw. That's Parallel Flaw — a separate but related question type. On Parallel Reasoning (without "flaw" in the stem), assume the stimulus is valid and find a valid parallel.`,
    },
    {
      id: 'lr-par-traps',
      title: `3. Common Traps`,
      content: `## 3.1 Same Subject Matter
A trap matches the stimulus's topic, fooling careless test-takers. Always abstract.

## 3.2 Different Quantifier
"All" vs. "most" vs. "some."

## 3.3 Wrong Direction
A → B vs. B → A.

## 3.4 Conclusion Type Mismatch
Universal conclusion in the stimulus, particular conclusion in the answer (or vice versa).

## 3.5 Extra Premise
The answer has one more (or fewer) premise than the stimulus.

## 3.6 Different Logical Operators
"And" vs. "or" can change everything.`,
      quiz: [
        {
          question: `Stimulus: "All professional dancers are physically fit. Anyone who is physically fit can climb three flights of stairs without difficulty. Therefore, all professional dancers can climb three flights of stairs without difficulty." Which is MOST PARALLEL?`,
          options: [
            `All accountants understand basic mathematics. All people who understand basic mathematics can balance a checkbook. Therefore, all accountants can balance a checkbook.`,
            `Most professional dancers exercise daily. Anyone who exercises daily is physically fit. Therefore, most professional dancers are physically fit.`,
            `All marathon runners are physically fit. James is a marathon runner. Therefore, James can climb three flights of stairs without difficulty.`,
            `Some professional dancers are over 40 years old. People over 40 are usually less flexible. Therefore, some professional dancers are less flexible.`,
            `Anyone who can climb three flights of stairs is physically fit. Maria is physically fit. Therefore, Maria can climb three flights of stairs.`,
          ],
          correctIndex: 0,
          explanation: `Stimulus: All A → B; All B → C; therefore All A → C. Choice (A) matches: All Accountants → Math; All Math → Checkbook; therefore All Accountants → Checkbook. Identical structure. (B) introduces "most" — wrong quantifier. (C) introduces a particular case (James) — wrong conclusion type. (D) uses "some" and "usually" — wrong. (E) reverses direction.`,
        },
      ],
    },
    {
      id: 'lr-par-worked',
      title: `4. Worked Example`,
      content: `## Stimulus
> If a restaurant is rated four stars or higher, it must have at least one Michelin-starred chef. The new bistro on Elm Street has no Michelin-starred chef. Therefore, the new bistro cannot be rated four stars or higher.

## Abstract
- Premise 1: 4-Star → Michelin Chef  (A → B)
- Premise 2: Bistro: ¬Michelin Chef  (¬B for specific case)
- Conclusion: Bistro: ¬4-Star  (¬A for specific case)

## Pattern
Contrapositive applied to specific case: A → B; ¬B; therefore ¬A.

## Match
Look for an answer with: conditional → contrapositive applied to a specific case.

- (A) "If a car is electric, it has a rechargeable battery. The Mercedes on the lot has a rechargeable battery. Therefore, it's electric." → Wrong direction (B → A error).
- (B) "If a movie is rated R, it contains adult content. The new film does not contain adult content. Therefore, the new film is not rated R." → Same pattern: A → B, ¬B, ¬A. Bullseye.
- (C) "All electric cars have rechargeable batteries. Some hybrids have rechargeable batteries. Therefore, some hybrids are electric." → Wrong logical structure.
- (D) "If a film wins Best Picture, it grosses over $50 million. The new film grossed $40 million. Therefore, it cannot have been a Best Picture nominee." → Conclusion is about "nominee," not winner — extra step.
- (E) "All four-star restaurants have a Michelin chef. The new bistro has a chef. Therefore, the bistro is a four-star restaurant." → Wrong direction.

**Answer: (B).**`,
    },
    {
      id: 'lr-par-drill',
      title: `5. Drill Prompts`,
      content: `Abstract each stimulus, then find a structurally identical argument.

## Drill 1
> "Every member of the soccer team has signed the code of conduct. Mia is on the soccer team, so Mia has signed the code of conduct."

## Drill 2
> "Most lawyers have law degrees. Some people with law degrees are politicians. Therefore, some lawyers may be politicians."

## Drill 3
> "If it rains, the picnic will be cancelled. The picnic was held; therefore it did not rain."

## Drill 4
> "All professional musicians read music. Some professional musicians compose original works. Therefore, some music readers compose original works."

## Drill 5
> "No vegetarians eat beef. Carlos eats beef regularly. Therefore, Carlos is not a vegetarian."`,
    },
  ],
  keyTakeaways: [
    `Parallel asks for the same LOGICAL STRUCTURE in different subject matter.`,
    `Abstract the stimulus to symbols (A, B, C) before scanning answers.`,
    `Match quantifiers (all, most, some) exactly.`,
    `Match direction (A → B vs. B → A) exactly.`,
    `Match conclusion type (particular vs. universal) exactly.`,
    `Contrapositive applied to a case is a heavily tested pattern.`,
    `If the stimulus is valid, the parallel must be valid; if flawed, see Parallel Flaw.`,
    `Same-topic answers are bait — always abstract.`,
  ],
},

lr_parallel_flaw: {
  topicId: 'lr_parallel_flaw',
  title: `Parallel Flaw Questions`,
  domainWeight: 'Logical Reasoning · ~3% of LR section · Tier: Low',
  overview: `Parallel Flaw is Parallel Reasoning with a twist: the stimulus contains a flaw, and the right answer contains the SAME flaw. The skill is to identify the flaw, then find the answer that commits it. Mistaken Reversal and Mistaken Negation are the most-tested flaws in this category.`,
  sections: [
    {
      id: 'lr-pf-definition',
      title: `1. What a Parallel Flaw Question Asks`,
      content: `## Standard Stems
- "The reasoning in the argument above is **flawed** in a manner most similar to which of the following?"
- "Which of the following arguments is **flawed in the same way** as the argument above?"
- "The argument's reasoning is **vulnerable to the same criticism** as which of the following?"

## What to Match
- The flaw (must be the SAME named flaw)
- The conditional / quantifier structure (must match abstractly)
- The conclusion type (particular vs. universal)

## What to IGNORE
- Subject matter
- Specific terms

## Most-Tested Flaws in Parallel Flaw
1. **Mistaken Reversal**: A → B used to conclude B → A.
2. **Mistaken Negation**: A → B used to conclude ¬A → ¬B.
3. **Necessary vs. Sufficient confusion**
4. **Composition / Division**: assumes whole shares parts' properties.
5. **Quantifier shift**: "some" → "all" or "all" → "some."`,
      examTip: `Identify the flaw FIRST, before scanning answers. Once you know it's Mistaken Reversal, sweep the choices for answers that also commit Mistaken Reversal. Don't get lost in the surface details.`,
    },
    {
      id: 'lr-pf-method',
      title: `2. Method`,
      content: `## Step 1 — Diagnose the Flaw
What flaw does the stimulus commit? Name it (Mistaken Reversal, Mistaken Negation, etc.).

## Step 2 — Confirm via Abstraction
Translate the stimulus to symbols. The structure should make the flaw visible.

## Step 3 — Search for the Same Flaw
Each answer choice will be either valid or commit a flaw. The right answer commits the SAME flaw.

## Step 4 — Verify Structure Matches
Same flaw + same conclusion type + matching quantifiers.`,
    },
    {
      id: 'lr-pf-traps',
      title: `3. Common Traps`,
      content: `## 3.1 Different Flaw
The answer commits a flaw, but a different one. (Mistaken Reversal in the stimulus, ad hominem in the answer.)

## 3.2 Same Surface, Different Structure
The answer's topic is similar but the abstract pattern differs.

## 3.3 Valid Argument
The answer is logically sound (no flaw). Eliminate.

## 3.4 Conclusion Type Mismatch
Stimulus's conclusion is universal; answer's conclusion is particular.`,
      quiz: [
        {
          question: `Stimulus (FLAWED): "If a movie wins the Oscar for Best Picture, it grosses over $100 million. The new film grossed over $100 million; therefore it won Best Picture." Which commits the SAME flaw?`,
          options: [
            `If you study, you'll pass the exam. You passed the exam, so you must have studied.`,
            `If you study, you'll pass the exam. You didn't study, so you won't pass.`,
            `If you study, you'll pass the exam. You studied, so you'll pass.`,
            `Most students who pass studied. You studied, so you'll pass.`,
            `Some students who study fail. You studied, so you might fail.`,
          ],
          correctIndex: 0,
          explanation: `Stimulus: A → B; B; therefore A. That's Mistaken Reversal. (A) commits the same: Study → Pass; Pass; therefore Study (B → A). (B) is Mistaken Negation. (C) is valid. (D) and (E) use different structures.`,
        },
      ],
    },
    {
      id: 'lr-pf-worked',
      title: `4. Worked Example`,
      content: `## Stimulus
> "Anyone who graduates from medical school is qualified to practise medicine. Dr. Patel did not graduate from medical school. Therefore, Dr. Patel is not qualified to practise medicine."

## Diagnose
- Premise: Grad → Qualified  (A → B)
- Premise: ¬Grad  (¬A)
- Conclusion: ¬Qualified  (¬B)

This is Mistaken Negation: A → B, ¬A, therefore ¬B. (Dr. Patel could be qualified through another pathway.)

## Match
- (A) "If a flight is delayed, passengers are notified. The flight was on time; therefore passengers were not notified." → A → B; ¬A; ¬B. Mistaken Negation. Match.
- (B) "If a recipe calls for sugar, it's a dessert. This recipe calls for sugar; therefore it's a dessert." → Valid (modus ponens).
- (C) "All trees lose leaves in autumn. This plant lost leaves; therefore it's a tree." → Mistaken Reversal.
- (D) "Some senators are lawyers. Some lawyers are former judges. Therefore some senators are former judges." → Different flaw (transitive error with "some").
- (E) "If you finish your homework, you can watch TV. You can watch TV; therefore you finished your homework." → Mistaken Reversal.

**Answer: (A).**`,
    },
    {
      id: 'lr-pf-drill',
      title: `5. Drill Prompts`,
      content: `Identify the flaw in each stimulus, then write a parallel argument with the same flaw.

## Drill 1
> "All accountants are detail-oriented. Mia is detail-oriented. Therefore Mia is an accountant."

## Drill 2
> "If you have a fever, you should rest. You don't have a fever. Therefore you shouldn't rest."

## Drill 3
> "All Olympic gold medalists are extremely talented. Some extremely talented people are coaches. Therefore, some Olympic gold medalists are coaches."

## Drill 4
> "Every member of the orchestra plays an instrument. The orchestra has 80 members. Therefore, the orchestra is the best in the city."

## Drill 5
> "Anyone who drinks coffee daily is at risk of caffeine dependence. Liam doesn't drink coffee daily. Therefore Liam is not at risk."`,
    },
  ],
  keyTakeaways: [
    `Parallel Flaw asks for the same flaw, not just the same structure.`,
    `Mistaken Reversal and Mistaken Negation are the most-tested flaws.`,
    `Diagnose the flaw first, then search.`,
    `Valid answers are wrong on Parallel Flaw — the answer must commit a flaw.`,
    `Match conclusion type (particular / universal) in addition to the flaw.`,
    `Quantifier mismatches change the flaw — match exactly.`,
    `Composition / division flaws are easy to miss — watch whole / part wording.`,
    `Same-topic answers are bait; always abstract.`,
  ],
},

lr_point_at_issue: {
  topicId: 'lr_point_at_issue',
  title: `Point at Issue / Disagreement Questions`,
  domainWeight: 'Logical Reasoning · ~3% of LR section · Tier: Low',
  overview: `Point at Issue questions show two speakers and ask what they DISAGREE about. The right answer is a statement that both speakers have a clear position on AND where their positions are opposite. Sounds simple, but the LSAT often presents speakers whose disagreement is partial or implicit.`,
  sections: [
    {
      id: 'lr-pi-definition',
      title: `1. What a Point at Issue Question Asks`,
      content: `## Standard Stems
- "The dialogue **most strongly supports** the conclusion that Speaker 1 and Speaker 2 **disagree** about which of the following?"
- "Speaker 1 and Speaker 2 **disagree over whether**…"
- "The speakers are **committed to disagreeing** about which of the following?"

## What "Disagree" Means
The right answer is a statement such that:
- Speaker 1 has a clear position on it.
- Speaker 2 has a clear position on it.
- Their positions are opposite (one says X is true; the other says X is false).

## The Common Trap
Many test-takers pick a statement that ONE speaker has a clear position on and the OTHER doesn't mention. That's not a disagreement — it's just one speaker's view. The right answer requires opposition.

## Point at Issue vs. Point of Agreement
Some questions ask what the speakers AGREE on. Same skill, opposite output.`,
      examTip: `Use the "Yes/No test." For each answer choice, ask: "Would Speaker 1 say YES or NO to this statement? Would Speaker 2 say YES or NO?" The credited answer is the only one where the two responses are OPPOSITE.`,
    },
    {
      id: 'lr-pi-method',
      title: `2. Method`,
      content: `## Step 1 — Identify Each Speaker's Position
Underline the conclusion or main claim each speaker makes.

## Step 2 — Note Areas of Overlap
If two topics arise, the disagreement is likely on the overlap.

## Step 3 — Apply the Yes/No Test
For each candidate answer, ask whether each speaker would assent or dissent. The credited answer gives opposite responses.

## Step 4 — Eliminate One-Sided Answers
If only one speaker addresses the answer's topic, it's not a disagreement.`,
      importantNote: `Speakers can disagree on a SUB-CLAIM without disagreeing on the conclusion. The right answer might be a hidden premise both speakers take a stand on. Don't restrict yourself to the speakers' explicit conclusions.`,
    },
    {
      id: 'lr-pi-traps',
      title: `3. Common Traps`,
      content: `## 3.1 One Speaker Doesn't Address
Trap answer mentions a topic only one speaker discussed.

## 3.2 Both Speakers Agree
Trap answer is something they actually agree on.

## 3.3 Inferred From One But Not the Other
You can infer the position of one speaker but the other speaker's position is undetermined.

## 3.4 Direction Misread
Both speakers have positions, but the answer's wording reverses one of them.`,
      quiz: [
        {
          question: `Speaker 1: "The city should build a new stadium downtown. It will boost local businesses and create thousands of jobs." Speaker 2: "Building a stadium will benefit some businesses, but the construction will displace several historic neighbourhoods. The cost is too high." The speakers DISAGREE about whether:`,
          options: [
            `The stadium will benefit local businesses.`,
            `The stadium should be built downtown.`,
            `Historic neighbourhoods are important to preserve.`,
            `The stadium will create thousands of jobs.`,
            `Construction projects often displace neighbourhoods.`,
          ],
          correctIndex: 1,
          explanation: `Speaker 1 says: "Build it." Speaker 2 says: "Cost too high" — i.e., don't build it. They have OPPOSITE positions on whether to build. (A) Both agree it'll help some businesses. (C) Speaker 1 didn't take a position. (D) Speaker 1 says it will; Speaker 2 didn't dispute. (E) Speaker 2 implies; Speaker 1 didn't address.`,
        },
      ],
    },
    {
      id: 'lr-pi-worked',
      title: `4. Worked Example`,
      content: `## Stimulus
> Lin: Standardised tests should be eliminated from college admissions. They favour wealthier students who can afford expensive test preparation.
> Park: Standardised tests should remain a key part of admissions. Test scores are the only objective measure that compares applicants from different schools.

## Identify Positions
Lin: Eliminate standardised tests.
Park: Keep them.

## Find the Disagreement
The most obvious disagreement: should standardised tests be used in college admissions? Lin says no; Park says yes.

## Match
- (A) Standardised tests favour wealthier students. → Lin says yes; Park didn't address. Not a disagreement.
- (B) Standardised tests should remain in college admissions. → Lin: no; Park: yes. Bullseye.
- (C) Test prep is expensive. → Lin implies yes; Park didn't address.
- (D) Different schools grade applicants differently. → Park implies yes; Lin didn't address.
- (E) Wealthy students are advantaged in college admissions. → Lin implies yes; Park didn't address.

**Answer: (B).**`,
    },
    {
      id: 'lr-pi-drill',
      title: `5. Drill Prompts`,
      content: `For each dialogue, identify what the speakers explicitly disagree about.

## Drill 1
> Ari: "Remote work increases productivity."
> Beth: "Remote work might increase productivity for some, but it harms team cohesion."

## Drill 2
> Cara: "All schools should teach computer programming."
> Dax: "Schools should prioritise reading and math over programming."

## Drill 3
> Eli: "Vegan diets are healthier than omnivorous diets."
> Fae: "Both vegan and omnivorous diets can be healthy when balanced."

## Drill 4
> Gus: "We should raise the minimum wage to $20/hour."
> Hana: "Raising the minimum wage to $20 will cause layoffs."

## Drill 5
> Ila: "Public transit should be free."
> Jay: "Free transit would overwhelm the system; we need fare reform, not abolition."`,
    },
  ],
  keyTakeaways: [
    `Point at Issue asks what the speakers EXPLICITLY disagree about.`,
    `Use the Yes/No test: only opposite responses qualify.`,
    `Eliminate answers only one speaker addresses.`,
    `Disagreement can be on a premise, not just the conclusion.`,
    `Point of Agreement is the inverse — both speakers say Yes (or both say No).`,
    `Watch for partial overlap where speakers agree on part and disagree on part.`,
    `Speakers may infer opposite positions without stating them — that still counts.`,
    `Eliminate answers that go beyond what either speaker has committed to.`,
  ],
},

lr_eval_argument: {
  topicId: 'lr_eval_argument',
  title: `Argument Evaluation Questions`,
  domainWeight: 'Logical Reasoning · ~2% of LR section · Tier: Low',
  overview: `Argument Evaluation questions ask what information would help DETERMINE whether the argument is sound. The right answer is a question whose answer (yes/no) would either strengthen or weaken the argument materially. Think of it as: which piece of evidence would let us judge the argument?`,
  sections: [
    {
      id: 'lr-ea-definition',
      title: `1. What an Evaluation Question Asks`,
      content: `## Standard Stems
- "It would be most **useful to determine** which of the following in **evaluating** the argument above?"
- "**Knowing** which of the following would be most **helpful in evaluating** the argument?"
- "The reliability of the argument's conclusion most depends on the answer to which of the following?"

## What the Right Answer Looks Like
The right answer is typically a yes/no question. The argument's strength changes depending on the answer:
- If yes → argument is stronger
- If no → argument is weaker
(Or vice versa.)

## The Two-Answer Test
For each candidate question:
1. Imagine the answer is "yes." Does the argument get stronger or weaker?
2. Imagine the answer is "no." Does the argument shift in the OPPOSITE direction?
3. If both yes and no produce meaningful shifts, the question is useful for evaluation.

If the answer doesn't matter either way, the question is irrelevant.`,
      examTip: `Apply the Two-Answer Test religiously. If imagining "yes" doesn't change the argument's strength much, or imagining "no" leaves the argument the same, the question is not useful and the answer is wrong.`,
    },
    {
      id: 'lr-ea-method',
      title: `2. Method`,
      content: `## Step 1 — Identify the Conclusion and Gap
Same as Weaken / Strengthen.

## Step 2 — Brainstorm What Would Help Evaluate
What information, if you had it, would tell you whether the conclusion is supported?

## Step 3 — Apply the Two-Answer Test
For each candidate, imagine both "yes" and "no" answers.

## Step 4 — Pick the Question With the Biggest Swing
The credited answer's two possible answers produce maximally opposite effects on the argument.`,
    },
    {
      id: 'lr-ea-traps',
      title: `3. Common Traps`,
      content: `## 3.1 Always Strengthens or Always Weakens
The question's answer (yes or no) always pushes in the same direction — that doesn't help "evaluate."

## 3.2 Out of Scope
The question's topic isn't relevant to the conclusion.

## 3.3 Already Established
The argument already tells you the answer to this question, so asking it isn't useful.

## 3.4 Half-Useful
The answer matters in one direction (e.g., yes weakens) but is neutral in the other.`,
      quiz: [
        {
          question: `Argument: "City sales tax revenue rose 12% last quarter. The local economy must be improving." It would be MOST USEFUL to determine which of the following in evaluating the argument?`,
          options: [
            `Whether the city government raised the sales tax rate during the quarter.`,
            `Whether other cities saw similar increases.`,
            `Whether the city's population has grown over the past year.`,
            `Whether sales tax revenue rose every quarter last year.`,
            `Whether the local economy includes tourism.`,
          ],
          correctIndex: 0,
          explanation: `(A) — if the sales tax rate was raised, the revenue jump might reflect the higher rate, not improved economic activity. Knowing yes/no produces opposite effects on the conclusion: yes → argument weakens; no → argument is somewhat stronger. (B), (C), (D), (E) are partial or irrelevant.`,
        },
      ],
    },
    {
      id: 'lr-ea-worked',
      title: `4. Worked Example`,
      content: `## Stimulus
> A new study found that people who eat fish twice a week have lower rates of heart disease. The researchers conclude that fish consumption protects against heart disease.

## Conclusion & Gap
Conclusion: Fish consumption causes lower heart disease.
Gap: The study shows correlation; the conclusion is causal. We need to rule out alternative causes.

## Predicted Useful Question
"Do people who eat fish twice a week have other lifestyle differences from those who eat less fish?"

## Match
- (A) Whether people who eat fish twice a week also exercise more than non-fish-eaters. → Yes: weakens (alternative cause); no: strengthens.
- (B) Whether fish contains omega-3 fatty acids. → Mostly background — most people know this; doesn't change the evaluation much.
- (C) Whether the study was conducted by independent researchers. → Methodological, partial.
- (D) Whether fish consumption is rising in the population. → Trend, not relevant to causation.
- (E) Whether heart disease is more common in fish-eating regions. → Could weaken either way.

(A) is the most useful question because its yes/no answer dramatically swings the argument's strength.`,
    },
    {
      id: 'lr-ea-drill',
      title: `5. Drill Prompts`,
      content: `For each argument, propose the most useful question for evaluation.

## Drill 1
> "Patients who use the new sleep app report better mood. The app must improve mood."

## Drill 2
> "Schools that switched to year-round calendars saw higher test scores. Year-round calendars improve learning."

## Drill 3
> "Companies that offer wellness programmes have lower healthcare costs. Wellness programmes reduce costs."

## Drill 4
> "States with stricter seat belt laws have fewer traffic fatalities. Strict seat belt laws save lives."

## Drill 5
> "Customers who use the new website checkout process complete purchases 20% faster. The new process is more efficient."`,
    },
  ],
  keyTakeaways: [
    `Evaluation asks which question would help decide if the argument is sound.`,
    `Apply the Two-Answer Test: yes vs. no must produce opposite effects.`,
    `If the answer always strengthens or always weakens, it's not useful for evaluation.`,
    `Treat Evaluation as a "branching" Strengthen / Weaken question.`,
    `Causal stimuli are common; the useful question often probes alternative causes.`,
    `Eliminate questions whose answers are already established by the stimulus.`,
    `The biggest swing wins.`,
    `Out-of-scope questions are eliminated immediately.`,
  ],
},

lr_complete: {
  topicId: 'lr_complete',
  title: `Complete the Argument Questions`,
  domainWeight: 'Logical Reasoning · ~2% of LR section · Tier: Low',
  overview: `Complete the Argument questions present an argument with a missing piece — usually a missing conclusion or a missing connecting premise — and ask which answer best fills the gap. The right answer flows naturally from the premises and matches the argument's tone, scope, and direction.`,
  sections: [
    {
      id: 'lr-cmp-definition',
      title: `1. What a Complete Question Asks`,
      content: `## Standard Stems
- "Which of the following most logically **completes** the argument?"
- "Which of the following provides the most **logical conclusion** to the argument?"
- "Which of the following, if true, most logically **completes** the argument's conclusion?"

## What's Missing
Usually one of:
- The conclusion (the argument has all premises but no conclusion)
- A connecting premise (a key bridge)
- A final supporting fact

## Tell from Context
The stimulus often ends with "Therefore, _____" or "Because _____" — the blank tells you what kind of statement is missing.

## What the Right Answer Looks Like
- Flows naturally from the premises
- Matches the argument's scope (not too strong, not too weak)
- Stays within the topic of the premises`,
      examTip: `"Therefore _____" tells you to complete with a CONCLUSION. "Because _____" tells you to complete with a PREMISE. Read the connecting word carefully — it dictates what kind of answer to pick.`,
    },
    {
      id: 'lr-cmp-method',
      title: `2. Method`,
      content: `## Step 1 — Identify What's Missing
Conclusion or premise? Use the blank's connecting word.

## Step 2 — Predict in Plain Language
What does the argument's flow point toward?

## Step 3 — Match Scope
Don't go beyond what the premises support. The right answer is the natural endpoint.

## Step 4 — Eliminate
Out-of-scope, too strong, opposite-direction, restatement-of-premise.`,
    },
    {
      id: 'lr-cmp-traps',
      title: `3. Common Traps`,
      content: `## 3.1 Too Strong
The answer extrapolates beyond what the premises license.

## 3.2 Out of Scope
The answer brings up a side topic.

## 3.3 Restates a Premise
The answer is just one of the premises rephrased.

## 3.4 Contradicts the Argument
The answer is in the opposite direction.

## 3.5 Wrong Direction (Cause / Effect Reversal)
Argument leads up to "X caused Y"; trap says "Y caused X."`,
      quiz: [
        {
          question: `Stimulus: "When the city implemented the new traffic light timing, average commute times dropped 8%. Neighbouring cities that did not change their timing saw no change. The data suggest that _____" Which best completes the argument?`,
          options: [
            `the city should immediately invest in autonomous vehicles.`,
            `the new traffic light timing reduced average commute times in the city.`,
            `every city should adopt the same traffic light timing.`,
            `traffic light timing is the most important factor in commute times.`,
            `commute times are stable in cities that don't adjust their traffic lights.`,
          ],
          correctIndex: 1,
          explanation: `The premises support a direct causal link between the timing change and the commute time drop — but only for this city, not all cities. (A) is out of scope. (C) and (D) are too strong. (E) restates the neighbouring-cities observation but isn't the central inference.`,
        },
      ],
    },
    {
      id: 'lr-cmp-worked',
      title: `4. Worked Example`,
      content: `## Stimulus
> The new restaurant has the freshest ingredients in town. Its prices are reasonable. Its location is convenient. Critics have given it consistently positive reviews. It is therefore likely that _____

## Predicted Completion
A reasonable conclusion that flows from the four premises.

## Match
- (A) The restaurant will be the most successful in the city. → Too strong.
- (B) The restaurant will attract a substantial customer base. → Reasonable, well-scoped.
- (C) Other restaurants will close as a result. → Out of scope.
- (D) Critics will continue to give positive reviews. → Possible but doesn't capture the broader implication.
- (E) The restaurant's chef will win awards. → Out of scope.

**Answer: (B).**`,
    },
    {
      id: 'lr-cmp-drill',
      title: `5. Drill Prompts`,
      content: `Predict the natural completion.

## Drill 1
> "Sales of electric vehicles have tripled in the past five years. Battery costs have fallen sharply. New charging stations are opening across the country. Therefore, _____"

## Drill 2
> "The proposed bill would raise corporate taxes by 5%. It would also fund new infrastructure. Public support is at 65%. Therefore, _____"

## Drill 3
> "Students who attended the after-school tutoring programme improved their math grades. The programme was free and conveniently located. Most parents reported satisfaction. Therefore, _____"

## Drill 4
> "Cybersecurity attacks have increased 40% this year. Companies are spending more on defence. New regulations require disclosure. Because _____, organisations are reassessing their security."

## Drill 5
> "Researchers found that adults who walk daily have lower depression rates. Walking is free and requires no special equipment. Therefore, _____"`,
    },
  ],
  keyTakeaways: [
    `Complete asks for the missing piece — conclusion or premise.`,
    `The connecting word (therefore / because) tells you what kind of answer.`,
    `Match scope — don't extrapolate beyond what the premises support.`,
    `Eliminate restatements of existing premises.`,
    `Reasonable conclusions flow naturally from the evidence.`,
    `Too-strong language is a frequent trap.`,
    `Out-of-scope answers introduce side topics.`,
    `The right answer is the natural endpoint, not a sweeping claim.`,
  ],
},

lr_necessary_sufficient: {
  topicId: 'lr_necessary_sufficient',
  title: `Conditional / Necessary-Sufficient Questions`,
  domainWeight: 'Logical Reasoning · ~1% of LR section · Tier: Minimal',
  overview: `Pure conditional reasoning questions test your ability to manipulate "if-then" statements. They appear directly (rare standalone) and embedded in other types (very common). Master the contrapositive, the difference between necessary and sufficient conditions, and the "only if" and "unless" translations.`,
  sections: [
    {
      id: 'lr-ns-definition',
      title: `1. The Conditional`,
      content: `## Form
"If A, then B" → A → B.
A is the sufficient condition (its occurrence is enough to guarantee B).
B is the necessary condition (B must occur for A to occur).

## Contrapositive
A → B is logically equivalent to ¬B → ¬A.
Negate and reverse.

## Translations to Memorise

| English | Conditional |
|---|---|
| If A, then B | A → B |
| A only if B | A → B  (B is necessary) |
| Only if B, A | A → B |
| All A are B | A → B |
| Every A is B | A → B |
| A requires B | A → B |
| A unless B | ¬B → A  (and ¬A → B) |
| No A are B | A → ¬B |
| Only A are B | B → A  (A is necessary for B) |
| A iff B (if and only if) | A ↔ B  (bidirectional) |

## Mistakes to Avoid
- **Mistaken Reversal**: from A → B conclude B → A.
- **Mistaken Negation**: from A → B conclude ¬A → ¬B.
- Mis-translating "only" (Only A are B does NOT mean A → B).`,
      examTip: `"Only" introduces a NECESSARY condition. "A only if B" means B is necessary for A — so A → B. "Only A are B" means A is necessary for B — so B → A. These two "only" forms point in opposite directions; do not conflate them.`,
    },
    {
      id: 'lr-ns-method',
      title: `2. Manipulating Conditionals`,
      content: `## Chain Multiple Conditionals
A → B and B → C give A → C.

## Take Contrapositives
A → B equals ¬B → ¬A. Always check both directions.

## Combine With Quantifiers
"Most A are B" and "All B are C" → "Most A are C." But "Some A are B" and "All B are C" → "Some A are C."

## Apply to Specific Cases
Given A → B and "X is A," you can infer "X is B."
Given A → B and "X is not B," you can infer "X is not A" (contrapositive).
You CANNOT infer "X is A" from "X is B" (Mistaken Reversal).
You CANNOT infer "X is not B" from "X is not A" (Mistaken Negation).`,
    },
    {
      id: 'lr-ns-traps',
      title: `3. Common Traps`,
      content: `## 3.1 Mistaken Reversal
A → B used as B → A.

## 3.2 Mistaken Negation
A → B used as ¬A → ¬B.

## 3.3 "Only" Misread
"A only if B" misread as "Only B is A."

## 3.4 "Unless" Misread
"A unless B" should be translated as ¬B → A (or equivalently A → B in some forms). Mistranslating loses points.

## 3.5 Quantifier-Conditional Confusion
"Some A are B" does NOT mean A → B; "Most A are B" does NOT mean A → B universally.`,
      quiz: [
        {
          question: `Translate to conditional form: "The team will win the championship only if the captain plays in every game."`,
          options: [
            `Captain Plays → Team Wins.`,
            `Team Wins → Captain Plays.`,
            `¬Captain Plays → ¬Team Wins.`,
            `Both B and C.`,
            `None of the above.`,
          ],
          correctIndex: 3,
          explanation: `"Only if" introduces a necessary condition for the team's winning. Win → Captain Plays. The contrapositive is ¬Captain Plays → ¬Win. So both (B) and (C) are correct.`,
        },
        {
          question: `"All paintings in the gallery are insured. Some insured items are antiques." What CAN be inferred?`,
          options: [
            `All paintings in the gallery are antiques.`,
            `Some paintings in the gallery are antiques.`,
            `Some antiques are paintings in the gallery.`,
            `Some paintings might be antiques, but it's not certain.`,
            `No paintings are antiques.`,
          ],
          correctIndex: 3,
          explanation: `Painting → Insured. Some Insured are Antique. We cannot conclude any painting is an antique — the "some insured" might be antiques that are not paintings. (A) too strong. (B) and (C) not justified. (E) too strong.`,
        },
      ],
    },
    {
      id: 'lr-ns-worked',
      title: `4. Worked Example`,
      content: `## Stimulus
> Anyone who attends the conference must register in advance. Maria did not register in advance. Therefore, Maria did not attend the conference.

## Translate
- Conditional: Attend → Register.
- Contrapositive: ¬Register → ¬Attend.
- Given: Maria ¬Register.
- Conclusion (valid): Maria ¬Attend. ✓

This is a valid contrapositive application — not a flaw.

Now contrast with a trap:
> "Anyone who attends the conference must register in advance. Maria registered in advance. Therefore, Maria attended the conference."

This is Mistaken Reversal: Attend → Register; Register; therefore Attend. (Maria could have registered but not attended.)`,
    },
    {
      id: 'lr-ns-drill',
      title: `5. Drill Prompts`,
      content: `Translate to conditional form, then identify any inference errors.

## Drill 1
> "Students who pass the entrance exam will be admitted. Students who don't study don't pass the exam. Therefore, students who don't study won't be admitted."

## Drill 2
> "All cars on this lot are electric. Some electric cars cost over $50,000. Therefore, some cars on this lot cost over $50,000."

## Drill 3
> "Only senior employees can attend the management retreat. Maya is not a senior employee. Therefore, Maya cannot attend the retreat."

## Drill 4
> "Unless you bring a permission slip, you cannot go on the field trip. James went on the field trip. Therefore, James brought a permission slip."

## Drill 5
> "All certified electricians know circuit-breaker codes. Sam knows circuit-breaker codes. Therefore, Sam is a certified electrician."`,
    },
  ],
  keyTakeaways: [
    `Master "only," "only if," "unless," and "no" translations.`,
    `The contrapositive of A → B is ¬B → ¬A — negate AND reverse.`,
    `Mistaken Reversal: A → B → B → A. Wrong.`,
    `Mistaken Negation: A → B → ¬A → ¬B. Wrong.`,
    `"A only if B" means B is necessary, so A → B.`,
    `"Only A are B" means A is necessary for B, so B → A.`,
    `"Unless B, A" means ¬B → A.`,
    `Chain multiple conditionals only if the linking term matches.`,
  ],
},

// ═══════════════════════════════════════════════════════════════
// READING COMPREHENSION (RC) — 1 section × ~27 questions
// 4 passages per section (3 single + 1 comparative pair)
// ═══════════════════════════════════════════════════════════════

rc_detail: {
  topicId: 'rc_detail',
  title: `Specific Reference / Detail Questions`,
  domainWeight: `Reading Comprehension · ~25% of RC section · Tier: Very High`,
  overview: `Specific Reference (a.k.a. Detail) questions ask what the passage explicitly says about a particular topic, person, event, or claim. The correct answer is almost always a paraphrase of one or two specific sentences in the passage. These are the highest-frequency RC question type — expect 6–8 per scored RC section — and they reward careful re-reading over memory.`,
  sections: [
    {
      id: 'rc-det-definition',
      title: `1. What a Detail Question Is`,
      content: `A Detail question targets information the passage **states directly**, not information you have to infer. The answer is in the text, usually within one or two sentences, and the correct choice is a close paraphrase of those sentences.

## 1.1 Why They Are High-Frequency

Roughly a quarter of RC questions on a typical exam are pure Detail. Test-makers use them as anchors — they test whether you can locate and accurately paraphrase what the author said, which is the foundation for every other RC skill.

## 1.2 What They Are NOT

- Not Inference: you should never have to add a step of reasoning.
- Not Main Point: they test a narrow fact, not the overall thesis.
- Not Function: they test what the passage says, not why the author said it.

## 1.3 Why Test-Takers Miss Them

Most wrong answers on Detail questions are missed because the student trusted memory instead of re-reading. The passage said X with one important qualifier; the student remembers it as X without the qualifier; the trap answer drops the qualifier; the student picks it.`,
      examTip: `Always go back to the passage. Do not rely on memory. A 10-second re-read of the relevant sentence will save you a wrong answer almost every time.`,
    },
    {
      id: 'rc-det-stems',
      title: `2. Question Stem Patterns`,
      content: `Recognise Detail stems by their direct, fact-seeking phrasing:

- "According to the passage, ..."
- "The passage states that ..."
- "The author indicates which one of the following ...?"
- "The passage explicitly mentions ..."
- "Which one of the following does the passage identify as ...?"

Compare with Inference stems, which use softer phrasing like "the passage suggests," "the author would most likely agree," or "it can be inferred."

## 2.1 The "According to" Tell

The phrase "according to the passage" is the single strongest signal that you are dealing with a Detail question. Treat it as a directive to find the exact sentence(s) in the passage that mention the topic in the stem.

## 2.2 Line References

Some Detail questions include line references (e.g., "the experiment described in lines 12-15"). Always read 2-3 lines before AND after the cited range — the context often disambiguates the correct answer.`,
      importantNote: `If the stem uses "according to the passage," your job is to locate, not to reason. Resist the urge to choose the most "interesting" answer; choose the one closest in wording to the passage.`,
    },
    {
      id: 'rc-det-traps',
      title: `3. Common Trap Answers`,
      content: `Detail trap answers cluster around five patterns:

## 3.1 Dropped Qualifier
The passage said "some researchers" or "in certain cases." The wrong answer drops the qualifier and makes the claim universal. Always check for hedge words.

## 3.2 Swapped Subject
The passage said scientists believe X. The wrong answer says critics believe X. The information exists in the passage but is attributed to the wrong party.

## 3.3 Half-Right / Half-Wrong
The first half of the answer matches the passage. The second half adds an extra claim the passage never made. Read every word of every choice.

## 3.4 Mentioned-but-Wrong
The answer uses words from the passage, but in a combination the author never asserted. Familiar vocabulary is a trap, not a guide.

## 3.5 Out-of-Scope Specific
The answer is a plausible-sounding fact the passage never addresses. If you cannot point to a sentence supporting it, it is wrong — even if it sounds reasonable.`,
      quiz: [
        {
          question: `A Detail question stem reads: "According to the passage, the museum curator's primary objection to the proposed exhibit was that ..." Which approach is MOST reliable?`,
          options: [
            `Pick the answer that sounds most consistent with the author's overall tone.`,
            `Pick the answer that summarises the passage's main point.`,
            `Locate the sentence(s) where the curator's objection is stated and choose the closest paraphrase.`,
            `Pick the longest answer, since detail answers are usually thorough.`,
            `Pick the answer that introduces a new consideration not in the passage.`,
          ],
          correctIndex: 2,
          explanation: `Detail questions reward locating the relevant sentence and matching its content. Tone (A) and main point (B) are different question types. Length (D) is irrelevant. (E) describes an Application or Inference trap, not a Detail answer.`,
        },
        {
          question: `A passage states: "Most marine biologists agree that overfishing has accelerated the decline of cod populations, although a small minority attribute the decline primarily to changing ocean temperatures." Which answer is a TRAP?`,
          options: [
            `Most marine biologists believe overfishing has accelerated cod decline.`,
            `Some marine biologists attribute cod decline primarily to ocean temperatures.`,
            `All marine biologists believe overfishing is the primary cause of cod decline.`,
            `There is disagreement among marine biologists about the primary cause of cod decline.`,
            `Cod populations have been declining.`,
          ],
          correctIndex: 2,
          explanation: `(C) drops the qualifier "most" and replaces it with "all," contradicting the passage. (A), (B), (D), and (E) are all directly supported.`,
        },
      ],
    },
    {
      id: 'rc-det-worked',
      title: `4. Worked Example — Original Passage`,
      content: `## Passage (ORIGINAL, not from any disclosed PrepTest)

> When the Pemberton Museum acquired a previously unattributed 17th-century still life last year, its conservation team faced an unusual decision. X-ray imaging revealed a second, earlier painting beneath the visible surface — a portrait whose composition suggested it was the work of a different, possibly more historically significant artist. Conservators traditionally treat the visible surface as the primary work, but a vocal minority of art historians argued that the underlying portrait, if exposed, could shed light on a poorly documented regional school of portraiture. The museum's curator, Dr. Elena Vargas, ultimately recommended preserving the visible still life intact. She acknowledged that exposing the portrait might yield modest scholarly gains, but argued that the still life itself had market provenance and public-display value that an unverified portrait could not match. Critics of Vargas's decision noted that her position aligned with the museum's commercial interest in maintaining a saleable inventory.

## Question 1
According to the passage, Dr. Vargas's primary justification for preserving the visible still life was that:

(A) Exposing the underlying portrait would yield no scholarly value.
(B) The still life has market provenance and public-display value that the portrait lacks.
(C) The underlying portrait was definitively not the work of a more significant artist.
(D) The museum's commercial interests required preserving the visible surface.
(E) Conservators traditionally treat the visible surface as the primary work.

## Step-by-step
- (A) is too strong — Vargas acknowledged "modest scholarly gains," not zero gains.
- **(B) matches** — the passage says she argued the still life "had market provenance and public-display value that an unverified portrait could not match."
- (C) is unsupported — the passage never says the portrait is definitively not a major artist's work.
- (D) is the **critics'** view, not Vargas's stated justification — swapped-subject trap.
- (E) is a general conservator principle, not Vargas's specific argument.

**Answer: (B).**

## Question 2
According to the passage, the underlying painting was:

(A) A still life from the same period.
(B) A portrait that may belong to a poorly documented regional school.
(C) Definitively the work of a more historically significant artist.
(D) Damaged beyond conservation.
(E) Already displayed in another wing of the museum.

**Answer: (B).** The passage says the underlying work is a portrait whose composition "suggested" it was by a different, possibly more significant artist — exactly the hedge in (B). (C) drops "possibly" and overstates.`,
    },
  ],
  keyTakeaways: [
    `Detail questions test what the passage STATES, not what it implies.`,
    `Always re-read the relevant sentences — never trust memory under time pressure.`,
    `"According to the passage" is the strongest stem signal for Detail.`,
    `Watch for dropped qualifiers (some, most, certain) — the most common trap.`,
    `Watch for swapped subjects — view A attributed to person B instead of person A.`,
    `Familiar vocabulary in an answer choice is a trap, not a guide.`,
    `Detail is the highest-frequency RC type — 6 to 8 per scored section.`,
    `If you cannot point to a sentence supporting an answer, eliminate it.`,
  ],
},

rc_inference: {
  topicId: 'rc_inference',
  title: `Inference Questions (RC)`,
  domainWeight: `Reading Comprehension · ~20% of RC · Tier: Very High`,
  overview: `RC Inference questions ask what MUST be true based on the passage, even though the passage never states it directly. Unlike Detail, the correct answer is not in the text verbatim — it is a small logical step away. The correct answer must be fully supported by the passage; it cannot rely on outside knowledge or assumption.`,
  sections: [
    {
      id: 'rc-inf-definition',
      title: `1. What an RC Inference Question Is`,
      content: `An RC Inference question gives you a stem like "the passage suggests" or "it can be inferred from the passage that" and asks for a claim that follows from what the passage said — even if the passage never said it in those words.

## 1.1 The "One Small Step" Rule

The correct answer to an RC Inference is usually just **one short logical step** beyond an explicit statement in the passage. If you need a chain of three or four assumptions to reach the answer, it is almost certainly wrong.

## 1.2 RC Inference vs. LR Inference

The standards are similar (must be true given the passage / stimulus), but RC Inference questions:

- Reference a longer body of text (a full passage, not a paragraph).
- Often target a specific paragraph or line range.
- Are more tolerant of paraphrase distance than LR Inference.

## 1.3 RC Inference vs. RC Detail

- **Detail** = the passage SAYS this.
- **Inference** = the passage IMPLIES this (one step away).`,
      examTip: `If a tempting answer feels like it requires you to fill in two or more unstated premises, it is probably wrong. Test-makers reward conservative inferences.`,
    },
    {
      id: 'rc-inf-stems',
      title: `2. Question Stem Patterns`,
      content: `Standard Inference stems:

- "It can be inferred from the passage that ..."
- "The passage most strongly suggests that ..."
- "The author would most likely agree with which one of the following statements?"
- "Which one of the following is most strongly implied by the passage?"
- "Based on the passage, it is most likely that ..."

## 2.1 Distinguishing Inference from Detail

- Detail uses: "states," "indicates," "according to."
- Inference uses: "suggests," "implies," "most likely," "can be inferred."

## 2.2 The "Most Likely Agree" Variant

When the stem asks what the author would most likely agree with, treat the question as a hybrid of Inference and Attitude — the answer must be consistent both with the passage's claims and with the author's tone.`,
      importantNote: `RC Inference does NOT mean "guess." It means "logically derive from what the passage says, with no outside facts and no leaps."`,
    },
    {
      id: 'rc-inf-traps',
      title: `3. Common Trap Answers`,
      content: `## 3.1 The Outside-Knowledge Trap
The answer is true in the real world but not supported by the passage. Common-sense facts are not allowed unless the passage establishes them.

## 3.2 The Too-Strong Trap
The passage supports a hedged claim ("some scientists believe") but the answer makes it absolute ("all scientists believe").

## 3.3 The Half-Right / Half-Wrong Trap
The first clause is supported; the second adds an unsupported claim. Read every word.

## 3.4 The Reversal
The answer reverses what the passage actually supports — e.g., the passage says X increased Y, the answer says Y increased X.

## 3.5 The Out-of-Scope Inference
The topic is plausible and feels related, but the passage never addresses the specific claim. If you cannot point to evidence, eliminate.`,
      quiz: [
        {
          question: `A passage states: "Although early 20th-century historiography treated the industrial revolution as a single, monolithic transformation, recent scholarship has emphasised regional variation in timing, technology, and labour organisation." Which inference is MOST supported?`,
          options: [
            `Early 20th-century historians ignored regional variation entirely.`,
            `Recent scholars reject the concept of an industrial revolution.`,
            `The industrial revolution did not occur at the same pace in every region.`,
            `Labour organisation was the primary driver of regional variation.`,
            `Regional variation was unknown to historians until recently.`,
          ],
          correctIndex: 2,
          explanation: `(C) is one step from the passage's claim that recent scholarship emphasises variation in "timing." (A) overstates — "treated as monolithic" does not mean "ignored entirely." (B) misreads. (D) and (E) are unsupported.`,
        },
        {
          question: `The passage says: "Coral reefs subjected to repeated bleaching events show reduced recovery rates, although some species exhibit increased thermal tolerance after multiple exposures." It can be inferred that:`,
          options: [
            `All coral species become more tolerant after bleaching.`,
            `Bleaching events are entirely beneficial in the long run.`,
            `At least some coral species respond differently to repeated bleaching than others.`,
            `Coral reefs will fully recover if bleaching continues.`,
            `Thermal tolerance is the only factor in coral survival.`,
          ],
          correctIndex: 2,
          explanation: `If "some species" exhibit increased tolerance, while reefs overall show reduced recovery, the species respond differently — (C) is the small step. (A) and (D) overstate. (B) reverses the meaning. (E) is outside scope.`,
        },
      ],
    },
    {
      id: 'rc-inf-worked',
      title: `4. Worked Example — Original Passage`,
      content: `## Passage (ORIGINAL)

> The historiography of medieval guilds has shifted markedly in the past three decades. Where earlier scholars characterised guilds as restrictive monopolies that hindered economic development, contemporary economic historians argue that guilds also served productive functions: they provided quality assurance to consumers, training for apprentices, and risk-pooling for members. Some revisionists have gone further, claiming that guilds were in fact essential to the emergence of pre-industrial commercial networks. Critics of the revisionist view caution that the productive functions of guilds did not negate their anticompetitive effects, which in many cities and trades remained substantial through the early modern period.

## Question
It can be most reasonably inferred from the passage that the author:

(A) Agrees with revisionists that guilds were essential to pre-industrial commerce.
(B) Believes guilds had both productive and anticompetitive effects.
(C) Rejects all earlier scholarship on guilds as inaccurate.
(D) Considers the revisionist view definitively proven.
(E) Thinks medieval guilds were primarily harmful institutions.

## Step-by-step
- The author presents BOTH the revisionist productive-function view AND the critics' anticompetitive caution, with neutral phrasing ("critics of the revisionist view caution that..."). The author does not endorse one side.
- **(B) matches**: the author acknowledges productive functions AND notes substantial anticompetitive effects.
- (A) and (D) overstate the author's endorsement of revisionists.
- (C) overstates: the author says earlier scholars characterised guilds restrictively, not that they were "inaccurate."
- (E) is the earlier view, not the author's view.

**Answer: (B).**`,
    },
  ],
  keyTakeaways: [
    `The correct RC Inference is usually one small step from an explicit statement.`,
    `Never use outside-world knowledge unless the passage establishes it.`,
    `"Suggests," "implies," "most likely" — these stem words signal Inference.`,
    `Watch for the too-strong trap: passage hedges, answer absolutes.`,
    `Half-right / half-wrong answers add an unsupported second clause.`,
    `Treat "author would most likely agree" as Inference + Attitude combined.`,
    `If you need three assumptions to reach the answer, it is wrong.`,
    `RC Inference is the second-most-frequent RC type — 5 to 6 per section.`,
  ],
},

rc_function: {
  topicId: 'rc_function',
  title: `Function / Purpose / Role Questions`,
  domainWeight: `Reading Comprehension · ~15% of RC · Tier: High`,
  overview: `Function questions ask WHY the author included a particular sentence, paragraph, or example — not what it says, but what role it plays in the argument. They test your grasp of the passage's structure and your ability to distinguish between, e.g., evidence, counterexample, concession, and conclusion. Expect 3-4 per scored RC section.`,
  sections: [
    {
      id: 'rc-fn-definition',
      title: `1. What a Function Question Is`,
      content: `A Function question asks the rhetorical purpose of a specific element of the passage — a sentence, paragraph, quotation, or example.

## 1.1 Common Element Targets

- A specific sentence ("The author's mention of the 1972 census serves primarily to ...")
- A paragraph ("The second paragraph functions primarily to ...")
- A quotation or example ("The reference to Thompson's experiment serves to ...")
- A concession or qualification

## 1.2 The Key Question

Always ask: "Why did the author put this here?" The answer is usually one of:

- Support a claim (evidence, example, illustration)
- Introduce a counterargument or opposing view
- Concede a point before refuting it
- Define a term
- Provide background or context
- Anticipate an objection
- Reach the main conclusion
- Transition between sections`,
      examTip: `Function answers are about rhetorical role, not factual content. The right answer often contains words like "illustrate," "support," "concede," "introduce," "contrast," "anticipate" — not the topic itself.`,
    },
    {
      id: 'rc-fn-stems',
      title: `2. Question Stem Patterns`,
      content: `Standard Function stems:

- "The author's primary purpose in mentioning X is to ..."
- "The second paragraph serves primarily to ..."
- "The reference to Y functions to ..."
- "The author includes the discussion of Z in order to ..."

## 2.1 Whole-Passage vs. Local Function

- **Whole-passage Function** asks the role of an entire paragraph in the passage. Read 2-3 surrounding sentences.
- **Local Function** asks the role of a specific sentence. Read the sentences immediately before and after.

## 2.2 Active Verbs

Correct Function answers use active rhetorical verbs:

- illustrate / exemplify
- support / strengthen
- concede / acknowledge
- contrast / distinguish
- introduce / define
- refute / challenge
- summarise / restate`,
    },
    {
      id: 'rc-fn-traps',
      title: `3. Common Trap Answers`,
      content: `## 3.1 The Content Restatement
The answer accurately describes WHAT the cited element says rather than WHY it is there. Function asks "why," not "what."

## 3.2 Wrong Direction
The element supports the main thesis; the trap says it undermines (or vice versa). Always check whether the element pushes for or against the author's overall position.

## 3.3 Out-of-Scope Function
The answer describes a rhetorical role the passage never plays — e.g., "to refute a counterexample" when no counterexample is in the passage.

## 3.4 Too Broad
The answer describes a Function the WHOLE PASSAGE plays, not the specific element in question.

## 3.5 Too Narrow
The answer cites a sub-purpose of the element while missing its larger rhetorical role. Pick the BEST function, not just A function.`,
    },
    {
      id: 'rc-fn-worked',
      title: `4. Worked Example — Original Passage`,
      content: `## Passage (ORIGINAL — short)

> Marine biologists have long debated whether dolphin pod size correlates with prey availability. Recent observational studies in the North Atlantic suggest that pods are largest in waters with the highest density of small schooling fish. (Sentence A: It is worth noting, however, that pods in the Mediterranean — where prey density is comparably high — remain notably smaller.) This discrepancy has led some researchers to propose that social and genetic factors, not just prey availability, drive pod-size variation.

## Question
Sentence A (about Mediterranean pods) functions primarily to:

(A) Provide additional evidence for the prey-density hypothesis.
(B) Define what counts as a small schooling fish.
(C) Introduce a counterexample that complicates the prey-density hypothesis.
(D) Summarise the main conclusion of the passage.
(E) Reject the role of social factors in pod-size variation.

## Step-by-step
- Sentence A is a "however" clause — it contrasts with the prior claim that prey density predicts pod size.
- The Mediterranean has high prey density but small pods — that complicates the prey-density story.
- **(C) matches**: it is a counterexample that complicates the hypothesis.
- (A) is the WRONG DIRECTION — it actually undermines the hypothesis.
- (B) is restatement of definitional content, not function.
- (D) overstates — this is one observation, not the conclusion.
- (E) reverses; the passage USES this discrepancy to motivate social factors, not reject them.

**Answer: (C).**`,
      quiz: [
        {
          question: `In a passage about urban planning, the author cites a 2018 case study of Helsinki's bike-share program. The case study showed mixed results. The author's purpose in including this case study is MOST LIKELY to:`,
          options: [
            `Define what a bike-share program is.`,
            `Provide a real-world example that illustrates the complexity of the author's broader claim.`,
            `Prove the author's thesis beyond doubt.`,
            `Refute all previous urban planning research.`,
            `Introduce a new topic unrelated to the main argument.`,
          ],
          correctIndex: 1,
          explanation: `Case studies typically illustrate or complicate a broader claim. (B) captures this rhetorical role. (A) is definition-content. (C) overstates ("beyond doubt"). (D) is too sweeping. (E) contradicts the role of a relevant case study.`,
        },
        {
          question: `Which words are HALLMARKS of a correct Function answer?`,
          options: [
            `"According to," "states," "indicates."`,
            `"Illustrate," "support," "concede," "introduce."`,
            `"Always," "never," "only."`,
            `"Possibly," "might," "could."`,
            `"Compute," "calculate," "measure."`,
          ],
          correctIndex: 1,
          explanation: `Function answers use active rhetorical verbs describing why an element is included. (A) is Detail. (C) is too-strong language. (D) is hedging, common in Inference. (E) is irrelevant.`,
        },
      ],
      importantNote: `Function is about rhetorical ROLE, not content. The right answer almost never echoes the topic — it names the move.`,
    },
  ],
  keyTakeaways: [
    `Function asks WHY an element is in the passage, not what it says.`,
    `Active rhetorical verbs (illustrate, support, concede) signal correct answers.`,
    `Check direction: does the element support or undermine the main claim?`,
    `Watch for content-restatement traps that paraphrase rather than name the role.`,
    `Read 2-3 sentences before and after a locally-cited element.`,
    `For paragraph-Function questions, ask how the paragraph advances the passage.`,
    `Pick the BEST function — not just A function — when answers compete.`,
    `Function questions are 3-4 per scored RC section.`,
  ],
},

rc_main_point: {
  topicId: 'rc_main_point',
  title: `Main Point / Main Idea (RC)`,
  domainWeight: `Reading Comprehension · ~10% of RC · Tier: High`,
  overview: `RC Main Point questions ask for the central thesis of the entire passage. Unlike LR Main Point, the answer must capture the WHOLE passage — not just one paragraph or one position discussed within it. Expect 2-3 per scored RC section, almost always one per passage.`,
  sections: [
    {
      id: 'rc-mp-definition',
      title: `1. What a Main Point Question Is`,
      content: `A Main Point question asks for the single sentence (among five choices) that best expresses the central message of the passage.

## 1.1 The Whole-Passage Standard

The correct answer must:

- Cover the central claim of EVERY paragraph (not just one).
- Reflect the author's view (not a competing view discussed in the passage).
- Match the scope of the passage — not too broad, not too narrow.

## 1.2 Tone Match

If the author is critical, the main point answer will reflect critique. If the author is descriptive, the answer will be neutral. Tone matters — see Attitude topic.

## 1.3 "About" vs. "Claims"

Pay attention to whether the answer describes what the passage IS ABOUT (topic) versus what it CLAIMS (thesis). Main Point answers must capture the CLAIM, not just the topic.`,
      examTip: `Read the first and last sentences of every paragraph after finishing the passage. The thesis is usually in the first or last paragraph; the supporting structure is in the middle paragraphs.`,
    },
    {
      id: 'rc-mp-stems',
      title: `2. Question Stem Patterns`,
      content: `Standard Main Point stems:

- "Which one of the following most accurately expresses the main point of the passage?"
- "The central thesis of the passage is that ..."
- "Which one of the following best summarises the passage's main idea?"
- "The primary purpose of the passage is to ..."

## 2.1 "Main Point" vs. "Primary Purpose"

- **Main Point** = WHAT the author claims.
- **Primary Purpose** = WHY the author wrote the passage (to describe, argue, refute, etc.).

Both are whole-passage questions, but Primary Purpose answers often start with infinitives ("to argue," "to describe," "to evaluate").`,
    },
    {
      id: 'rc-mp-traps',
      title: `3. Common Trap Answers`,
      content: `## 3.1 Too Narrow
The answer captures only one paragraph or one section of the passage.

## 3.2 Too Broad
The answer describes a topic vastly larger than the passage covers.

## 3.3 Off-Tone
The author is critical; the answer is neutral or laudatory (or vice versa).

## 3.4 Competing View
The answer captures a view DISCUSSED in the passage but rejected by the author.

## 3.5 Detail-as-Thesis
The answer states a specific detail or example accurately but mistakes it for the main thesis.`,
    },
    {
      id: 'rc-mp-worked',
      title: `4. Worked Example — Original Passage`,
      content: `## Passage (ORIGINAL — abbreviated)

> Twentieth-century historians of cartography often treated the medieval mappa mundi as a primitive precursor to modern maps, judging it by its geographical inaccuracy. More recent scholarship has rejected this approach, arguing that mappae mundi were never intended as navigational tools; rather, they served theological and pedagogical functions, encoding scriptural narratives and moral hierarchies in spatial form. To evaluate a mappa mundi by the criteria of post-Enlightenment cartography, contemporary historians argue, is to misunderstand the object entirely.

## Question
Which one of the following most accurately expresses the main point?

(A) Medieval mappae mundi were geographically inaccurate by modern standards.
(B) Recent historians of cartography have argued that mappae mundi should be understood on their own theological and pedagogical terms, not judged by modern cartographic criteria.
(C) Twentieth-century historians made many errors in interpreting medieval maps.
(D) Theological narratives were the primary content of all medieval art.
(E) Modern cartography is more accurate than medieval cartography.

## Step-by-step
- (A) is a detail, not the thesis.
- **(B) captures the WHOLE passage**: old view rejected, new view explained, criteria mismatch noted.
- (C) is too broad — the passage targets a specific interpretive error, not "many errors."
- (D) overgeneralises beyond the passage's scope.
- (E) is true but not the point — the passage rejects evaluating mappae mundi by that comparison.

**Answer: (B).**`,
    },
  ],
  keyTakeaways: [
    `Main Point must cover the WHOLE passage, not just one section.`,
    `The answer must reflect the AUTHOR's view, not a competing view in the text.`,
    `Tone must match — if author is critical, the answer reflects critique.`,
    `Watch for too-narrow traps that capture only one paragraph.`,
    `Watch for detail-as-thesis traps that elevate one fact.`,
    `Primary Purpose answers start with infinitives ("to argue," "to describe").`,
    `Almost every RC passage has one Main Point question.`,
    `Main Point and Primary Purpose are sibling question types.`,
  ],
},

rc_comparative: {
  topicId: 'rc_comparative',
  title: `Comparative Passage Questions`,
  domainWeight: `Reading Comprehension · ~10% of RC · Tier: High`,
  overview: `One of the four RC passages on every test is a comparative set: two shorter passages (A and B) on a related topic, followed by ~6 questions that ask you to compare them. Comparative questions test whether you can identify points of agreement, disagreement, methodological differences, and shared concerns between two authors. Expect 5-7 comparative questions per scored RC section.`,
  sections: [
    {
      id: 'rc-comp-definition',
      title: `1. What Comparative Passages Are`,
      content: `Every scored LSAT RC section contains exactly ONE comparative passage set: two shorter passages (called Passage A and Passage B) on a related topic, typically authored from different perspectives.

## 1.1 Why Comparative Sets Exist

Comparative reading tests the same skills as single-passage reading PLUS the ability to integrate two viewpoints. Real-world legal and academic reading constantly involves synthesising multiple sources.

## 1.2 Standard Structures

Comparative passages usually share ONE topic and differ along ONE axis:

- Same topic, different methodologies
- Same topic, different evaluative stances (one favourable, one critical)
- Same topic, different scope (one general, one case-specific)
- Same topic, different historical periods
- Same topic, complementary rather than opposed`,
      examTip: `Before answering any questions, write a 5-word summary of EACH passage's main point in the margin. Comparative questions hinge on knowing exactly what each author claims.`,
    },
    {
      id: 'rc-comp-stems',
      title: `2. Question Stem Patterns`,
      content: `Comparative-specific stems:

- "Both passages are primarily concerned with ..."
- "Which one of the following is discussed in both passages?"
- "The author of Passage A would most likely respond to Passage B by ..."
- "The relationship between the two passages is most accurately described as ..."
- "On which of the following would the two authors most likely agree?"
- "A central difference between the two passages is that ..."

## 2.1 The Five Comparative Sub-Types

1. **Both/Either** — what both passages share, or what either passage states.
2. **Agreement** — claims both authors would endorse.
3. **Disagreement** — claims the authors would split on.
4. **Response** — how one author would react to the other's claim.
5. **Relationship** — the overall rhetorical relation (challenge, extension, parallel, qualification).`,
      importantNote: `Author-to-author response questions require you to apply Passage A's framework to a specific Passage B claim — or vice versa. The correct answer must be supported by what Passage A actually says, not what you guess A might say.`,
    },
    {
      id: 'rc-comp-traps',
      title: `3. Common Trap Answers`,
      content: `## 3.1 The Half-Match
The answer matches one passage but not the other. For "both passages" or "agreement" questions, both must support the claim.

## 3.2 The Topic-Match-Only
Both passages discuss the topic, but only one makes the claim in the answer.

## 3.3 The Wrong-Direction Response
The answer says Author A would agree with Author B on a point where they actually disagree (or vice versa).

## 3.4 The Outside Framework
The answer imports a framework neither passage uses. Stay inside the two-passage universe.

## 3.5 The Reverse Attribution
The view in the answer is real, but it belongs to the OTHER passage's author.`,
      quiz: [
        {
          question: `Passage A argues that early intervention in pre-school literacy programmes produces lasting gains. Passage B argues that early intervention produces only short-term gains that fade by middle school. The relationship between the passages is BEST described as:`,
          options: [
            `Passage B extends Passage A's argument.`,
            `Passage B challenges Passage A's central claim about the durability of gains.`,
            `Both passages reach the same conclusion through different methods.`,
            `Passage A summarises Passage B's research.`,
            `The two passages discuss unrelated topics.`,
            ],
          correctIndex: 1,
          explanation: `(B) captures the disagreement: A says gains are lasting; B says they fade. (A), (C), (D), (E) misdescribe the contrast.`,
        },
        {
          question: `The author of a Passage A on climate-policy economics would MOST LIKELY respond to Passage B's claim that "carbon taxes inevitably harm low-income households" by:`,
          options: [
            `Conceding that Passage B is entirely correct.`,
            `Pointing out that rebate-based carbon-tax designs can offset distributional harms.`,
            `Arguing that climate policy is unimportant.`,
            `Switching topics to international trade.`,
            `Demanding more data from Passage B.`,
          ],
          correctIndex: 1,
          explanation: `A reasoned response stays in scope and engages B's specific claim. (B) addresses the distributional concern with a policy nuance — a typical correct-response pattern. The others either concede everything, ignore the topic, or refuse to engage.`,
        },
      ],
    },
    {
      id: 'rc-comp-worked',
      title: `4. Worked Example — Original Comparative Pair`,
      content: `## Passage A (ORIGINAL)

> Recent restoration projects on coastal salt marshes have prioritised reintroducing native cordgrass to stabilise sediment and protect shorelines from erosion. Long-term monitoring shows that restored cordgrass beds reduce shoreline retreat by up to 60% during storm events, suggesting that native-vegetation strategies are both ecologically appropriate and economically efficient.

## Passage B (ORIGINAL)

> While native-vegetation restoration on salt marshes has produced impressive short-term results, critics caution that monitoring intervals — typically 5 to 10 years — are too brief to capture longer cycles of sea-level rise and saltwater intrusion. The same cordgrass beds that perform well over a decade may collapse as inundation patterns shift, potentially leaving restored marshes more vulnerable than engineered alternatives such as living shorelines combining vegetation with hard structures.

## Question
The relationship between Passage A and Passage B is best described as:

(A) Passage B refutes Passage A's data.
(B) Passage B questions the long-term durability of the approach Passage A endorses.
(C) The two passages reach contradictory conclusions about a different topic.
(D) Passage A summarises Passage B's findings.
(E) The two passages agree on every major point.

## Step-by-step
- A endorses native-vegetation restoration based on short-term data.
- B accepts the short-term success but raises a longer-timescale concern.
- **(B) matches**: B questions durability, not the short-term data itself.
- (A) is too strong — B doesn't refute the data, it questions extrapolation.
- (C) is wrong direction; the topic is the same.
- (D) reverses the relationship.
- (E) ignores the disagreement.

**Answer: (B).**`,
    },
  ],
  keyTakeaways: [
    `Every scored RC section has exactly one comparative pair (Passages A and B).`,
    `5-7 questions per pair, testing agreement, disagreement, and relationship.`,
    `Always summarise each passage's main point in 5 words before answering.`,
    `For "both passages" questions, both must support the claim — not just one.`,
    `Author-to-author response questions stay tied to what each author actually says.`,
    `Watch for reverse-attribution traps that swap A's view for B's view.`,
    `Relationship questions test the overall rhetorical move (challenge, extend, qualify).`,
    `Comparative passages usually differ along one clear axis.`,
  ],
},

rc_structure: {
  topicId: 'rc_structure',
  title: `Structure / Organization`,
  domainWeight: `Reading Comprehension · ~8% of RC · Tier: Medium`,
  overview: `Structure questions ask how the passage is organised — the sequence of moves the author makes. Unlike Main Point (what the author claims) or Function (why a specific element is included), Structure asks about the overall rhetorical scaffolding. Expect 2-3 per scored RC section.`,
  sections: [
    {
      id: 'rc-str-definition',
      title: `1. What a Structure Question Is`,
      content: `A Structure question describes the passage in terms of its rhetorical moves — e.g., "introduces a problem, surveys prior solutions, proposes a new solution, anticipates objections."

## 1.1 Common Structural Patterns

- Problem / solution
- Old view / new view
- Thesis / supporting evidence / counterargument / response
- Historical narrative / contemporary application
- Compare two competing theories / evaluate / endorse one
- Description / interpretation / implications

## 1.2 The "Map" Habit

Strong RC readers mentally map each paragraph's role. After reading paragraph 2, ask: "Is this evidence, counterargument, concession, transition, or new claim?"`,
      examTip: `Sketch a 1-line label for each paragraph in the margin. Even a single word ("background," "thesis," "objection," "response") makes structure questions almost automatic.`,
    },
    {
      id: 'rc-str-stems',
      title: `2. Question Stem Patterns`,
      content: `Standard Structure stems:

- "Which one of the following most accurately describes the organisation of the passage?"
- "The passage proceeds by ..."
- "Which one of the following best describes the structure of the passage?"
- "The passage is organised primarily in order to ..."

## 2.1 Look for Sequenced Verbs

Correct Structure answers usually contain a SEQUENCE of verbs:

- "introduces ... presents evidence for ... considers an objection ... responds to it"
- "describes ... compares ... evaluates ... endorses"
- "states a position ... considers an alternative ... rejects it"

If the answer is a single verb, it is probably Main Point or Function, not Structure.`,
    },
    {
      id: 'rc-str-traps',
      title: `3. Common Trap Answers`,
      content: `## 3.1 Wrong Sequence
All the moves listed appear in the passage but in the wrong order.

## 3.2 Missing Move
The answer omits a major paragraph (e.g., describes a 4-paragraph passage as a 3-move sequence).

## 3.3 Extra Move
The answer includes a move the passage never makes — e.g., "refutes" when the passage merely "describes."

## 3.4 Wrong Verb Strength
The author "discusses" but the answer says "endorses"; the author "considers" but the answer says "rejects." Verb strength matters.

## 3.5 Wrong Object
The structural verbs are right, but the THINGS being introduced, evaluated, or rejected are mislabeled.`,
    },
    {
      id: 'rc-str-worked',
      title: `4. Worked Example — Original Passage`,
      content: `## Passage (ORIGINAL — abbreviated)

> [P1] Until the 1990s, ecologists generally believed that biodiversity in tropical forests was driven primarily by climate stability over geological time. [P2] More recent fieldwork has shown that local microhabitat variation — soil chemistry, water-table depth, canopy gaps — explains a significant portion of species turnover within otherwise climatically uniform regions. [P3] Some climate-focused ecologists counter that microhabitat variation is itself a downstream product of long-term climate stability, but this objection assumes a causal direction that the data do not yet support. [P4] What emerges is a multifactorial picture: tropical biodiversity is shaped by climate AND microhabitat together, and isolating the contribution of either factor remains a central methodological challenge.

## Question
The passage proceeds by:

(A) Presenting a thesis, providing supporting evidence, and concluding with a policy recommendation.
(B) Describing an older view, presenting a newer view, considering an objection to the newer view, and reaching a synthesised conclusion.
(C) Comparing two regions of the tropics and contrasting their biodiversity.
(D) Defining a term, illustrating it with examples, and listing its applications.
(E) Refuting a single dominant theory and proposing an unrelated alternative.

## Step-by-step
- P1 = older climate-stability view.
- P2 = newer microhabitat-variation view.
- P3 = objection from the older camp, partially answered.
- P4 = synthesis.
- **(B) matches** the four moves in order.
- (A) misses the objection and ends with a "policy recommendation" that is not in the passage.
- (C) misdescribes — the passage is not regional comparison.
- (D) is structural mismatch.
- (E) overstates ("refutes ... unrelated alternative") and ignores the synthesis.

**Answer: (B).**`,
      importantNote: `When two answers share most moves but differ on one verb (e.g., "refutes" vs. "qualifies"), check the passage's actual treatment carefully — that one verb is usually the deciding factor.`,
    },
  ],
  keyTakeaways: [
    `Structure asks about the SEQUENCE of rhetorical moves.`,
    `Sketch a one-word label for each paragraph as you read.`,
    `Correct Structure answers list verbs in the order they appear.`,
    `Watch for wrong-sequence traps that scramble the order.`,
    `Verb strength matters: "discusses" is not "endorses."`,
    `Missing-move and extra-move traps are common.`,
    `Structure is 2-3 questions per scored section.`,
    `Single-verb answers are usually Main Point or Function, not Structure.`,
  ],
},

rc_application: {
  topicId: 'rc_application',
  title: `Application / Extrapolation`,
  domainWeight: `Reading Comprehension · ~7% of RC · Tier: Medium`,
  overview: `Application questions ask you to apply the passage's framework, principle, or method to a NEW scenario that is not in the passage. They test whether you understood the author's underlying logic well enough to use it. Expect 2-3 per scored RC section.`,
  sections: [
    {
      id: 'rc-app-definition',
      title: `1. What an Application Question Is`,
      content: `An Application question presents a scenario or example NOT discussed in the passage and asks which choice the author or the passage's framework would most likely endorse, predict, or apply.

## 1.1 Two Common Sub-Types

- **Principle Application**: which scenario is most consistent with the principle the passage describes?
- **Author Application**: how would the author respond to / categorise this new case?

## 1.2 The Two-Step Logic

1. Identify the passage's general principle or framework in your own words.
2. Test each answer choice against that principle.`,
      examTip: `Write the passage's core principle in one sentence in the margin before reading the choices. Apply that principle mechanically to each option.`,
    },
    {
      id: 'rc-app-stems',
      title: `2. Question Stem Patterns`,
      content: `Standard Application stems:

- "The principle described in the passage is most clearly illustrated by which one of the following?"
- "Based on the passage, the author would most likely consider which one of the following an example of ...?"
- "The author's argument would apply most strongly to which one of the following situations?"
- "Which one of the following scenarios is most consistent with the framework presented in the passage?"

## 2.1 Distinguishing Application from Inference

- **Inference** = what does the passage IMPLY about its own topic?
- **Application** = how does the passage's logic apply to a NEW topic?

Application requires you to leave the passage's specific subject matter behind and use only its general framework.`,
    },
    {
      id: 'rc-app-traps',
      title: `3. Common Trap Answers`,
      content: `## 3.1 Topic-Match
The answer is about the SAME topic as the passage but does not actually fit the principle. Stay focused on the principle, not the subject matter.

## 3.2 Partial Fit
The answer matches part of the principle but violates another part. Check ALL the conditions of the principle.

## 3.3 Opposite Application
The answer is a case the principle would REJECT or refute, not endorse.

## 3.4 Outside Framework
The answer uses a different evaluation framework that is similar-sounding but not the passage's framework.

## 3.5 Too Specific
The answer adds details that the principle does not require, narrowing the application unnecessarily.`,
      quiz: [
        {
          question: `A passage establishes the principle: "Public investments that produce diffuse, long-term benefits are most justified when private markets systematically underinvest in them." Which scenario is MOST consistent with this principle?`,
          options: [
            `A government subsidy for a profitable luxury-goods manufacturer.`,
            `A government-funded basic-research programme whose findings will be freely available to all firms.`,
            `A tax break for individual homeowners.`,
            `A short-term emergency grant to a single struggling company.`,
            `A government investment in a venture expected to produce concentrated, immediate private returns.`,
          ],
          correctIndex: 1,
          explanation: `Basic research produces diffuse long-term benefits and is systematically underinvested by private firms (because they cannot capture the returns). (B) matches every condition. (A), (C), (D), (E) violate at least one condition.`,
        },
        {
          question: `The principle "Restrictions on speech are justified only when the speech in question presents a clear and imminent danger" would MOST justify which of the following?`,
          options: [
            `A ban on all political speech.`,
            `A restriction on directly inciting a riot already underway.`,
            `A penalty for criticising a public official.`,
            `A prohibition on offensive but non-threatening speech.`,
            `A ban on speech the listener finds disagreeable.`,
          ],
          correctIndex: 1,
          explanation: `Inciting an active riot is the canonical clear-and-imminent-danger case. (B) fits the principle. (A), (C), (D), (E) lack imminent danger.`,
        },
      ],
    },
    {
      id: 'rc-app-worked',
      title: `4. Worked Example — Original Passage`,
      content: `## Passage (ORIGINAL — abbreviated)

> Linguistic anthropologists studying language shift have proposed that minority languages are most likely to be transmitted to the next generation when three conditions hold: (1) the language is regularly spoken in domestic settings; (2) it is used in at least one institutional context — school, religious practice, or community media — outside the home; and (3) speakers perceive the language as conferring social or economic value, not merely cultural sentiment. When all three conditions are absent, even community-wide affection for the language is rarely sufficient to prevent shift to a dominant language within two generations.

## Question
Based on the passage, which of the following minority-language communities would be MOST likely to successfully transmit the language to the next generation?

(A) A community where the language is spoken at home but in no institutional context, and is widely regarded as having no economic value.
(B) A community where the language is spoken in religious services but not at home, and is regarded as a cultural artifact.
(C) A community where the language is spoken at home, taught in local schools, and perceived as offering economic advantage in regional employment.
(D) A community where speakers express strong affection for the language but rarely speak it.
(E) A community where the language is heard in community media but no longer spoken by anyone.

## Step-by-step
- The principle: all THREE conditions (home + institutional + perceived value) must hold.
- (A) misses 2 of 3.
- (B) misses home use and value perception.
- **(C) hits all three** — domestic, institutional (school), and perceived economic value.
- (D) misses two conditions.
- (E) misses domestic use entirely.

**Answer: (C).**`,
    },
  ],
  keyTakeaways: [
    `Application asks you to use the passage's logic on a NEW scenario.`,
    `Step 1: write the principle in one sentence. Step 2: test each answer.`,
    `Check ALL conditions of a principle — partial-fit traps are frequent.`,
    `Topic-match traps lure you with same-subject answers that miss the principle.`,
    `Opposite-application traps describe cases the principle would reject.`,
    `Stay inside the passage's framework — do not import outside ideas.`,
    `Application is 2-3 questions per scored RC section.`,
    `If a principle has three conditions, the correct answer must satisfy all three.`,
  ],
},

rc_attitude: {
  topicId: 'rc_attitude',
  title: `Author's Attitude / Tone`,
  domainWeight: `Reading Comprehension · ~5% of RC · Tier: Medium`,
  overview: `Attitude questions ask about the author's stance toward the passage's subject — approving, skeptical, neutral, cautiously optimistic, etc. They test your sensitivity to evaluative language and tone markers. Expect 1-2 per scored RC section.`,
  sections: [
    {
      id: 'rc-att-definition',
      title: `1. What an Attitude Question Is`,
      content: `An Attitude question asks for the author's stance toward the subject of the passage — or toward a specific position or person discussed within it.

## 1.1 The Attitude Spectrum

Common attitudes, from most positive to most negative:

- Enthusiastic endorsement
- Qualified approval / cautious endorsement
- Neutral description
- Cautious skepticism
- Critical / disapproving
- Dismissive / hostile (rare on the LSAT)

## 1.2 Tone Markers

Watch for evaluative words:

- POSITIVE: "important," "significant," "compelling," "promising," "valuable," "successful."
- NEGATIVE: "flawed," "unconvincing," "misguided," "questionable," "problematic."
- HEDGED: "however," "nevertheless," "although," "while ... still."

## 1.3 The Hedged Default

Most LSAT authors are CAUTIOUSLY positive or CAUTIOUSLY negative — almost never extreme. Extreme attitudes ("enthusiastic," "hostile") are usually wrong answers.`,
      examTip: `If two answers are similar in direction but differ in intensity (e.g., "approving" vs. "enthusiastic"), the milder answer is almost always correct.`,
    },
    {
      id: 'rc-att-stems',
      title: `2. Question Stem Patterns`,
      content: `Standard Attitude stems:

- "The author's attitude toward X is most accurately described as ..."
- "The passage suggests that the author regards X as ..."
- "Which one of the following best describes the author's stance on X?"
- "The author's tone in discussing X is most accurately characterised as ..."

## 2.1 Target Matters

The stem will name a specific target — the subject of the passage, a specific theory, a specific person, or a specific approach. Make sure your answer is about THAT target, not the passage's overall tone.`,
      importantNote: `An author can have one attitude toward Theory A and a different attitude toward Theory B within the same passage. Always check WHICH target the stem names.`,
    },
    {
      id: 'rc-att-traps',
      title: `3. Common Trap Answers`,
      content: `## 3.1 Too Extreme
"Enthusiastic," "hostile," "absolute conviction" — almost always wrong. LSAT authors are reserved.

## 3.2 Wrong Direction
The author is cautiously positive; the answer says cautiously negative.

## 3.3 Wrong Target
The attitude is described accurately, but it applies to a different element of the passage.

## 3.4 Inconsistency
The first descriptor matches but the qualifier reverses the attitude — e.g., "approving but pessimistic." Read the entire answer.

## 3.5 Off-Tone
The author is engaged and serious; the answer says "indifferent" or "amused." Match the energy of the passage.`,
    },
    {
      id: 'rc-att-worked',
      title: `4. Worked Example — Original Passage`,
      content: `## Passage (ORIGINAL — abbreviated)

> The growing literature on algorithmic decision-making in criminal sentencing has produced findings that deserve serious attention. Proponents argue that statistical risk-assessment tools reduce judicial inconsistency and can, in principle, surface biases that human decision-makers fail to notice. The available evidence offers some support for these claims, but it is preliminary: the relevant studies cover short follow-up periods and a limited range of jurisdictions. Stronger conclusions about the long-term effects of algorithmic sentencing await broader, longer-running data.

## Question
The author's attitude toward statistical risk-assessment tools in sentencing is best described as:

(A) Enthusiastic endorsement.
(B) Cautious openness to the tools, with reservations grounded in limited evidence.
(C) Dismissive skepticism.
(D) Indifference.
(E) Confident rejection.

## Step-by-step
- The author calls the literature "deserving serious attention" and notes evidence "offers some support" — positive direction.
- BUT the author also notes the evidence is "preliminary" and demands "broader, longer-running data" — hedged.
- **(B) matches**: cautious openness with reservations.
- (A) is too strong.
- (C), (E) are wrong direction.
- (D) ignores the engagement signaled by "deserve serious attention."

**Answer: (B).**`,
    },
  ],
  keyTakeaways: [
    `Most LSAT authors are CAUTIOUSLY positive or cautiously negative — never extreme.`,
    `Watch for tone markers: "important," "promising," "flawed," "questionable."`,
    `"Enthusiastic" and "hostile" answers are almost always wrong.`,
    `Make sure the attitude applies to the TARGET named in the stem.`,
    `When two answers share direction, the milder one is usually correct.`,
    `Hedge words (however, although, while) signal qualified attitudes.`,
    `Attitude is 1-2 questions per scored RC section.`,
    `An author can hold different attitudes toward different elements in the same passage.`,
  ],
},

}; // end LSAT_COURSE

export function hasLsatCourseContent(topicId: string): boolean {
  return topicId in LSAT_COURSE;
}

export function getLsatCourseContent(topicId: string): TopicLesson | null {
  return LSAT_COURSE[topicId] ?? null;
}

