/**
 * SAT course content for the "Read Lessons" tab of the exam-prep app.
 * Reflects the current digital SAT: Reading & Writing + Math.
 * 19 topics. Original teaching content only (no real SAT questions or
 * copyrighted passages).
 */

import type { TopicLesson, LessonSection } from '@/lib/cissp-course-data';
// TopicLesson = { topicId: string; title: string; domainWeight: string; overview: string; sections: LessonSection[]; keyTakeaways?: string[] }
// LessonSection = { id: string; title: string; content: string; examTip?: string; importantNote?: string }

export const SAT_COURSE: Record<string, TopicLesson> = {

rw_central_ideas: {
  topicId: 'rw_central_ideas',
  title: `Central Ideas & Details`,
  domainWeight: 'Reading and Writing',
  overview: `Central Ideas and Details questions ask you to identify the main point of a short passage or to locate a specific supporting detail. On the digital SAT these are Information and Ideas questions, and each passage is only 25-150 words, so precision matters more than speed. Your job is to distinguish the one controlling idea from the details that merely support, illustrate, or qualify it.`,
  sections: [
    {
      id: 'ci-main-idea-vs-detail',
      title: `1. Main Idea vs. Supporting Detail`,
      content: `The central idea is the single claim the whole passage exists to make. Every other sentence either sets it up, supports it, or extends it. To find it, ask: "If the author could keep only one sentence, which one carries the meaning of the rest?"

Consider this short passage: "Urban rooftop gardens were once dismissed as decorative novelties. Recent studies, however, show they lower building cooling costs, capture stormwater, and provide habitat for pollinators. Some cities now offer tax credits to encourage their installation."

The central idea is that rooftop gardens are now valued for practical environmental benefits, not just decoration. The list of benefits (cooling, stormwater, pollinators) and the tax-credit sentence are details that support that shift.

A common trap answer restates a single detail as if it were the main idea. For example, "Rooftop gardens capture stormwater" is true and appears in the text, but it is only one item in a list — too narrow to be the central idea. The correct answer must cover the scope of the whole passage: the reevaluation of rooftop gardens from ornamental to practical.

When the choices are close, test each one against the first and last sentences, which usually frame the author's point. Reject any option that is (1) too narrow, (2) too broad and unsupported, or (3) about a detail the passage merely mentions in passing.`,
      examTip: `Read the answer choices as claims about scope. The right one should be provable using the whole passage, not just one clause.`,
    },
    {
      id: 'ci-locating-details',
      title: `2. Locating a Stated Detail`,
      content: `Detail questions ask what the passage directly says, not what you can infer. The answer is stated in the text — often paraphrased in the choices. Your task is to match meaning, not exact words.

Suppose a passage states: "The species migrates at night, using the Earth's magnetic field to orient itself, and rests in dense foliage by day." A question asks how the species navigates. The text explicitly says it uses "the Earth's magnetic field." The correct choice will paraphrase that — perhaps "by sensing magnetic cues" — even though those exact words never appear.

Watch for choices that combine true information incorrectly. If a choice said "the species migrates at night by resting in foliage," it stitches together two real details into a false claim. On the SAT, a wrong answer is often built from real words arranged to say something the passage never states.

Strategy: underline the phrase in the passage that answers the question before you look at the choices. Then find the choice that means the same thing. This prevents you from being pulled toward an answer that merely sounds familiar.`,
      importantNote: `Detail questions have a textual anchor. If you cannot point to the exact sentence that proves your answer, you have probably drifted into inference — reread.`,
    },
    {
      id: 'ci-summary-strategy',
      title: `3. Building a One-Sentence Summary`,
      content: `A reliable habit for central-idea questions is to summarize the passage in your own words before reading the choices. This prevents the choices from steering your interpretation.

Use a simple template: "This passage is mainly about [topic] and the point is that [claim]." For a passage describing a scientist who challenged an accepted theory and gathered evidence that eventually won acceptance, your summary might be: "This is about a scientist whose rejected idea was later proven correct." Now scan the choices for the one that matches your summary.

The value of pre-summarizing is that it turns a four-way comparison into a simple matching task. You are no longer asking "which of these could be right?" — a question with several plausible answers — but "which one matches what I already decided?"

If you cannot summarize the passage, that is a signal to reread rather than guess. Usually one transition word (however, therefore, but, in contrast) marks the pivot where the author states the real point. Anchor your summary to that pivot.`,
      examTip: `Cover the answer choices with your hand, summarize, then reveal. This one habit sharply reduces trap-answer errors.`,
    },
  ],
  keyTakeaways: [
    `The central idea covers the whole passage; details cover only part of it.`,
    `Trap answers are often true details presented as if they were the main point.`,
    `Detail questions are answered directly in the text — find the sentence that proves it.`,
    `Wrong choices frequently mix real information into a false statement.`,
    `Summarize in your own words before reading the choices.`,
  ],
},

rw_inferences: {
  topicId: 'rw_inferences',
  title: `Inferences & Implicit Meaning`,
  domainWeight: 'Reading and Writing',
  overview: `Inference questions ask you to draw a logical conclusion that the passage implies but does not state outright. On the digital SAT these often appear as "which choice most logically completes the text?" with a blank at the end. The answer must be forced by the evidence — a good SAT inference is a small, safe step, never a creative leap.`,
  sections: [
    {
      id: 'inf-safe-step',
      title: `1. The "Smallest Safe Step" Principle`,
      content: `An SAT inference is a conclusion that must be true given the passage — not one that could be true. Test-takers lose points by choosing the most interesting or dramatic option instead of the most tightly supported one.

Consider: "The new alloy retained its strength at temperatures that caused conventional steel to warp. Engineers therefore recommended it for the engine components exposed to the greatest heat." What can we infer? Only something modest: the alloy performs better than steel under high heat. We cannot infer that the alloy is cheaper, lighter, or superior in every way — the passage says nothing about those properties.

Frame every inference choice with the test: "Does the passage guarantee this?" If a choice requires an assumption the text never provides, eliminate it. The correct answer usually paraphrases evidence already present and adds only the minimum logical connection.

Beware of comparative and absolute language in the choices. Words like "always," "never," "only," "most," and "the primary reason" raise the bar for proof. A choice saying the alloy is "the only material suitable for engines" overreaches; a choice saying it "withstands heat better than conventional steel" stays within bounds.`,
      examTip: `Prefer the boring, cautious answer. The correct SAT inference rarely surprises you.`,
    },
    {
      id: 'inf-completion-blanks',
      title: `2. Logical Completion Questions`,
      content: `Many inference items give a paragraph ending in a blank and ask which choice "most logically completes the text." Treat the blank as a conclusion that must follow from the sentences before it.

First, identify the logical relationship the passage sets up. Watch the final transition: a "therefore" signals a consequence, a "however" or "yet" signals a contrast or exception, and a "because" signals a cause.

Example: "Researchers assumed the cave paintings were made by adults. But measurements of the handprints alongside the images matched the proportions of children. This suggests that ____."

The evidence (child-sized handprints) contradicts the assumption (adults made the art). The blank must resolve that tension, so a logical completion is: "children may have participated in creating the paintings." A choice like "the paintings are older than previously believed" introduces a new idea about age that the handprint evidence does not support, so it fails.

Method: state in your own words what the evidence proves, then match a choice to that statement. Do not let a fluent, confident-sounding sentence distract you if it draws on information the passage never mentioned.`,
      importantNote: `The blank is not asking for new information — it asks for the conclusion the given evidence already points to.`,
    },
    {
      id: 'inf-eliminating-traps',
      title: `3. Eliminating Overreach and Half-Right Traps`,
      content: `Wrong inference choices come in predictable flavors, and recognizing them speeds elimination.

Overreach: the choice goes further than the evidence allows. If a passage shows a treatment reduced symptoms in one study, "the treatment cures the disease" overreaches.

Reversal: the choice states the opposite of what the passage implies, often by dropping or misplacing a negative. These are easy to miss when you read quickly.

Half-right: the choice begins accurately, then adds an unsupported clause. "The alloy resists heat, which makes it the cheapest option available" is half true — the heat resistance is supported, the cost claim is not. On the SAT, half-right equals fully wrong.

Out of scope: the choice introduces a topic (cost, history, popularity) the passage never raised. Even a reasonable real-world claim is wrong if the passage does not support it.

Discipline: read every word of each choice. A single unsupported word — "always," "cheapest," "first," "only" — can invalidate an otherwise attractive answer. When two choices remain, pick the one that claims less.`,
      examTip: `When stuck between two answers, choose the weaker, more qualified claim — it is easier to prove.`,
    },
  ],
  keyTakeaways: [
    `An SAT inference must be true, not merely plausible.`,
    `Prefer cautious, minimally worded conclusions over dramatic ones.`,
    `For completion blanks, identify the logical relationship (cause, contrast, consequence) first.`,
    `Absolute words ("always," "only," "cheapest") usually mark overreach.`,
    `Half-right answers — accurate start, unsupported finish — are fully wrong.`,
  ],
},

rw_command_evidence: {
  topicId: 'rw_command_evidence',
  title: `Command of Evidence`,
  domainWeight: 'Reading and Writing',
  overview: `Command of Evidence questions test whether you can find the information that supports, strengthens, weakens, or illustrates a claim. On the digital SAT these come in two forms: textual evidence (which quotation best supports a point) and quantitative evidence (which data from a table or graph supports a conclusion). Both reward tight logical matching between a claim and the evidence for it.`,
  sections: [
    {
      id: 'ce-textual-support',
      title: `1. Textual Evidence`,
      content: `A textual evidence question states a claim — often a student's hypothesis or a researcher's conclusion — and asks which quotation would best support it. The correct choice must connect directly and specifically to the claim, not merely relate to the same topic.

Suppose a passage argues: "A student concludes that the poet's later work grew more optimistic." You are asked which finding, if true, would support this. A supporting choice must show a change over time toward optimism — for example, "the poet's final collection replaced the bleak imagery of earlier poems with images of dawn and renewal." A choice about the poet's popularity or writing schedule is topically related but proves nothing about optimism.

The key is to match the exact terms of the claim. If the claim is about change over time, your evidence must show change over time. If the claim is about a cause, your evidence must link cause and effect. Evidence that merely mentions the subject is a trap.

Restate the claim as a checklist before scanning choices: What must the evidence show? Optimism? Increasing? In later work? Only the choice that satisfies every element of the claim is correct.`,
      examTip: `Convert the claim into a precise "must show X" statement, then test each quotation against it.`,
    },
    {
      id: 'ce-quantitative',
      title: `2. Quantitative Evidence (Tables & Graphs)`,
      content: `Quantitative evidence questions pair a short passage with a table or graph and ask which data point supports a given claim. These require careful reading of axis labels, units, and headers — the trap answers usually misread the graph.

Steps that prevent errors:
- Read the title, axis labels, and units first. Know what each number represents before looking at values.
- Restate the claim precisely: which variable, which direction, which group.
- Find the specific data that matches. If the claim says Group A exceeded Group B in 2020, locate both values for 2020 and confirm the comparison.

Example: a graph shows recycling rates rising from 20% in 2010 to 45% in 2020 for City X, while City Y held near 30%. A claim states "City X's recycling program produced faster gains than City Y's." Supporting evidence: City X rose 25 percentage points while City Y barely changed. A trap choice might cite City Y's higher starting value — true from the graph but irrelevant to a claim about the rate of gain.

Common mistakes: confusing rows with columns, ignoring units (percent versus count), and choosing a true statement that does not support the specific claim. A data point can be accurate and still be wrong for the question.`,
      importantNote: `A correct data value that does not support the claim is a wrong answer. Accuracy and relevance are separate tests — both must pass.`,
    },
    {
      id: 'ce-strengthen-weaken',
      title: `3. Strengthen vs. Weaken`,
      content: `Some evidence questions ask what would strengthen or weaken an argument. To answer, first identify the argument's conclusion and the assumption connecting its evidence to that conclusion.

To strengthen, choose the fact that makes the conclusion more likely — often by confirming the underlying assumption or ruling out an alternative explanation. To weaken, choose the fact that undermines the assumption or offers a competing cause.

Example argument: "Sales rose after the store changed its lighting, so the new lighting caused the increase." The hidden assumption is that nothing else changed. A weakening fact: "the store also cut prices during the same period" — this introduces an alternative cause. A strengthening fact: "a nearly identical store that changed only its lighting saw the same sales increase" — this isolates lighting as the cause.

Notice that both operations target the link between evidence and conclusion, not the evidence itself. Do not pick a choice that merely repeats what the argument already assumes; that adds nothing. The best answer changes how confident we can be in the conclusion.`,
      examTip: `Find the unstated assumption first. Strengtheners protect it; weakeners attack it.`,
    },
  ],
  keyTakeaways: [
    `Evidence must match the specific terms of the claim, not just the topic.`,
    `For graphs, read titles, axes, and units before values.`,
    `A true data point that does not support the claim is still wrong.`,
    `To strengthen or weaken, target the assumption linking evidence to conclusion.`,
    `Restate the claim as a "must show X" checklist before scanning choices.`,
  ],
},

rw_words_context: {
  topicId: 'rw_words_context',
  title: `Words in Context`,
  domainWeight: 'Reading and Writing',
  overview: `Words in Context questions ask you to choose the word or phrase that best fits a blank, or to determine what a word means as it is used in the passage. On the digital SAT these are among the most common Reading and Writing items. Success depends on using the surrounding context to predict meaning before you consider the choices — vocabulary alone is not enough.`,
  sections: [
    {
      id: 'wc-predict-first',
      title: `1. Predict Before You Choose`,
      content: `The most powerful strategy for these questions is to cover the choices, read the sentence, and predict your own word for the blank. Context — the clauses around the blank — almost always tells you the meaning you need.

Example: "Although the committee expected the proposal to spark debate, the members' reaction was surprisingly ____; no one raised a single objection." The words "Although" and "no one raised a single objection" tell you the reaction was calm and agreeable — the opposite of debate. Your prediction might be "unanimous" or "muted." Now match: a choice like "uniform" or "placid" fits; "contentious" contradicts the context.

Prediction works because it converts a vocabulary test into a matching task. Instead of judging four sophisticated words in isolation, you ask which choice comes closest to a meaning you already derived from evidence.

Key signals to read for: contrast words (although, however, despite) tell you the blank opposes an earlier idea; continuation words (moreover, indeed, and) tell you the blank echoes it; cause words (because, since, so) tell you the blank explains or results from something.`,
      examTip: `Write or think of your own word first. If a choice matches your prediction, it is almost always correct.`,
    },
    {
      id: 'wc-second-meanings',
      title: `2. Secondary Meanings of Common Words`,
      content: `The SAT loves familiar words used in less familiar senses. A question about a "common" word is often a trap if you assume its everyday meaning.

Take "qualify." Everyday, it means "to be eligible." But in "The author qualified her earlier claim," it means "to limit or soften." Or "novel": usually a book, but as an adjective it means "new or original." Or "sound," which can mean "valid" or "reliable" ("a sound argument"), not just a noise.

When the obvious meaning of a word does not fit the sentence, ask whether a secondary meaning does. Plug the meaning back into the sentence to confirm: "The evidence was sound" — does "valid/reliable" make sense? Yes. Does "noise" make sense? No.

The lesson: never choose a word because it is the most sophisticated or because its primary meaning is familiar. Choose the meaning that the sentence actually requires. On the digital SAT, the tested word is defined by its context, so a simple word in an unusual role is fair game and frequently the point of the question.`,
      importantNote: `Plug your chosen meaning back into the sentence and read it aloud in your head. If it sounds off, reconsider a secondary sense of the word.`,
    },
    {
      id: 'wc-connotation-tone',
      title: `3. Connotation and Register`,
      content: `Two words can share a rough definition but differ in connotation — the positive, negative, or neutral feeling they carry. The SAT often includes choices that are close in denotation but wrong in tone.

Consider a passage praising a scientist's careful method. A blank calling the work "____" might offer "meticulous," "fussy," and "obsessive." All three describe great attention to detail, but only "meticulous" carries the positive connotation the admiring context requires. "Fussy" and "obsessive" are negative and clash with praise.

Also attend to register — the level of formality. A scholarly passage will not use slang; a plain-spoken one will not suddenly adopt ornate diction. If three choices are formal and neutral and one is casual or loaded, the odd one out is often wrong.

Method: after narrowing to two choices that both fit the definition, decide whether the passage's tone is positive, negative, or neutral, then pick the word whose connotation matches. This tiebreaker resolves most of the hardest words-in-context questions, where every remaining choice is technically a synonym but only one fits the author's attitude.`,
      examTip: `When two choices mean nearly the same thing, let the passage's tone (positive/negative/neutral) break the tie.`,
    },
  ],
  keyTakeaways: [
    `Predict your own word from context before reading the choices.`,
    `Contrast, continuation, and cause words tell you the meaning the blank needs.`,
    `Common words are often tested in their secondary meanings.`,
    `Plug your answer back into the sentence to confirm it fits.`,
    `Use connotation and register to break ties between near-synonyms.`,
  ],
},

rw_text_structure: {
  topicId: 'rw_text_structure',
  title: `Text Structure & Purpose`,
  domainWeight: 'Reading and Writing',
  overview: `Text Structure and Purpose questions ask why an author wrote a passage or a particular sentence, or how the passage is organized. On the digital SAT these fall under Craft and Structure. They test whether you can see the function of text — its job — rather than just its content. The correct answer describes what a part does, not merely what it says.`,
  sections: [
    {
      id: 'ts-overall-purpose',
      title: `1. Identifying the Author's Purpose`,
      content: `Purpose questions ask for the author's main goal: to describe, to argue, to explain, to compare, to challenge a view, to propose a solution. The answer is a verb phrase describing the passage's function.

To find it, ask: "What is this author trying to do to me, the reader?" If the passage lays out evidence and reaches a judgment, the purpose is to argue or persuade. If it walks through a process neutrally, the purpose is to explain or describe. If it presents one view and then a rival view, the purpose is to compare or contrast.

Example: a passage notes that a popular remedy lacks scientific support, cites failed trials, and concludes it should not be recommended. The purpose is "to argue against the use of a popular remedy," not "to describe a remedy." The presence of a judgment and supporting evidence marks argument, not neutral description.

Trap answers often describe a real feature of the passage that is not its main purpose. A passage might include a definition, but if the definition serves a larger argument, "to define a term" is too narrow. Choose the option that captures the whole passage's job.`,
      examTip: `Purpose answers are verbs: describe, argue, explain, compare, refute, propose. Match the verb to what the passage actually does.`,
    },
    {
      id: 'ts-sentence-function',
      title: `2. Function of a Specific Sentence`,
      content: `Some questions ask what a particular underlined sentence "mainly does" in the passage. Here you analyze the sentence's role in the surrounding argument, not just its meaning.

Common functions include: introducing a claim, providing an example, raising an objection, conceding a point, offering a counterexample, drawing a conclusion, or providing a transition. Read the sentences before and after the target to see how it connects.

Example: A passage argues that remote work boosts productivity. Then a sentence says, "Critics counter that remote work erodes team cohesion." What does this sentence do? It introduces an opposing viewpoint — a counterargument — which the author will likely address next. It does not support the main claim; it complicates it.

Watch the logical connectors. A sentence beginning "For instance" provides an example. One beginning "However" or "Yet" signals a contrast or objection. One beginning "Thus" or "Therefore" states a conclusion. These words reveal function directly.

The correct answer describes the sentence's job in the passage's logic. Reject choices that accurately summarize what the sentence says but misidentify its role.`,
      importantNote: `Function is about the sentence's job, not its content. "It gives an example" and "it raises an objection" describe roles, not summaries.`,
    },
    {
      id: 'ts-organization',
      title: `3. Overall Organization`,
      content: `Organization questions ask how a passage is structured as a whole. Recognizing a few common patterns lets you answer quickly.

Frequent structures:
- Problem then solution: a difficulty is described, then a remedy proposed.
- Claim then evidence: a thesis is stated, then supported with examples or data.
- Chronological: events unfold in time order.
- Compare and contrast: two subjects are set against each other.
- General to specific: a broad idea narrows to a particular case (or the reverse).
- Cause and effect: a condition and its consequences are traced.

Example: a passage opens by noting that a city faced worsening traffic, then describes a congestion-pricing plan, then reports the drop in traffic afterward. That is a problem-solution structure with a result. A choice describing it as "a comparison of two cities" would be wrong — there is only one city and a sequence of stages.

To answer, map the passage into two or three beats — what does the first part do, then the next — and match that arc to a choice. Do not be distracted by a choice that describes only one part of the passage accurately while ignoring the rest.`,
      examTip: `Sketch the passage as a two- or three-step arc (setup then shift then payoff), then find the choice that matches all the steps.`,
    },
  ],
  keyTakeaways: [
    `Purpose answers are verb phrases describing what the passage does.`,
    `A judgment plus supporting evidence signals argument, not description.`,
    `Sentence-function questions ask for a role (example, objection, conclusion), not a summary.`,
    `Logical connectors (for instance, however, therefore) reveal function.`,
    `Learn common structures: problem-solution, claim-evidence, compare-contrast, chronological.`,
  ],
},

rw_cross_text: {
  topicId: 'rw_cross_text',
  title: `Cross-Text Connections`,
  domainWeight: 'Reading and Writing',
  overview: `Cross-Text Connections questions present two short passages by different authors on a related topic and ask how they relate. On the digital SAT you must determine each author's position and then how the second author would respond to, agree with, or challenge the first. These are among the harder Craft and Structure items because they require holding two viewpoints in mind at once.`,
  sections: [
    {
      id: 'ct-two-positions',
      title: `1. Pinning Down Each Author's Position`,
      content: `Before comparing two texts, state each author's main claim in a single phrase. Confusion in cross-text questions almost always comes from blurring the two positions together.

Read Text 1 and summarize: "Author 1 believes ____." Then read Text 2 and summarize: "Author 2 believes ____." Keep the summaries parallel so the relationship becomes visible.

Example: Text 1 argues that a newly discovered manuscript is genuine because its ink and paper match the claimed period. Text 2 argues the manuscript is a forgery because its handwriting uses letter forms that did not exist until a century later. Summaries: Author 1 = authentic (material evidence); Author 2 = forged (handwriting evidence).

Now the relationship is clear: the authors disagree about authenticity, and each rests on a different type of evidence. Many questions turn on exactly this — not just that they disagree, but why and on what grounds.

Be careful to capture not only the claim but the reasoning. Two authors can reach the same conclusion for different reasons, or opposite conclusions from the same fact. The question often targets that nuance.`,
      examTip: `Write a one-line summary for each author before reading the question. Keep them parallel so the relationship stands out.`,
    },
    {
      id: 'ct-relationship-types',
      title: `2. Types of Relationships`,
      content: `Cross-text questions usually ask how the second author would respond to the first, or how their views relate. The relationship falls into a few categories:

- Direct disagreement: Author 2 rejects Author 1's conclusion.
- Qualified agreement: Author 2 agrees but adds a limitation or condition.
- Different emphasis: both accept the facts but stress different aspects.
- Providing a counterexample: Author 2 offers a case that undercuts Author 1's generalization.
- Extending: Author 2 accepts Author 1's point and builds further on it.

The most common question stem is "How would the author of Text 2 most likely respond to [a specific claim] in Text 1?" To answer, locate Text 2's position on that exact claim — not the general topic. Author 2 may agree with part of Text 1 and disagree with another part, so the response depends on which claim the question names.

Example: if Text 1 claims a policy will cut costs and Text 2 argues the policy will cut costs but harm service quality, then Author 2's response to the cost claim is agreement, while the response to the overall policy is qualified. Match the choice to the precise claim referenced in the stem.`,
      importantNote: `Answer for the specific claim named in the question, not for the authors' overall disagreement. They may agree on one point and clash on another.`,
    },
    {
      id: 'ct-avoiding-mixups',
      title: `3. Avoiding Attribution Errors`,
      content: `The signature trap in cross-text questions is attributing a view to the wrong author — assigning Text 1's opinion to Author 2 or vice versa. Under time pressure this is surprisingly easy.

Guard against it by labeling every claim as you read. Some students mark T1 and T2 in the margin (or mentally) beside each position. When you reach the choices, confirm that each described view belongs to the author the choice assigns it to.

Consider a choice that says "The author of Text 2 would agree with Text 1 that the method is unreliable." Before accepting it, verify two things: (1) does Text 2 actually agree, and (2) did Text 1 actually call the method unreliable? If Text 1 never made that claim, the choice fails regardless of Text 2's view.

Another trap is a choice that describes a plausible academic disagreement that neither author actually holds. It sounds like the kind of thing scholars argue about, but it is not grounded in these two texts. Reject any choice you cannot tie to specific statements in the passages.

Discipline: for each answer choice, point to the exact sentence in each text that justifies it. If you cannot, the choice is wrong.`,
      examTip: `Label each position with its author as you read. For every choice, verify the view is correctly attributed before judging whether it is true.`,
    },
  ],
  keyTakeaways: [
    `Summarize each author's claim and reasoning separately before comparing.`,
    `Relationships include disagreement, qualified agreement, counterexample, and extension.`,
    `Answer for the specific claim the question names, not the general topic.`,
    `The main trap is attributing a view to the wrong author — label as you read.`,
    `Reject any choice you cannot anchor to a specific sentence in each text.`,
  ],
},

rw_rhetoric: {
  topicId: 'rw_rhetoric',
  title: `Rhetorical Analysis`,
  domainWeight: 'Reading and Writing',
  overview: `Rhetorical analysis on the digital SAT centers on how authors use word choice, structure, and technique to achieve their goals, and on completing arguments logically. These questions overlap with Craft and Structure and Expression of Ideas. The skill is seeing language as a set of deliberate choices — each word and each move serves the author's purpose.`,
  sections: [
    {
      id: 'rh-word-choice-effect',
      title: `1. The Effect of Word Choice`,
      content: `Authors choose words to shape a reader's impression. Rhetorical questions ask what effect a specific word choice creates. To answer, consider the connotation and imagery of the word and what attitude it conveys.

Example: describing a river, one author writes it "crept" through the valley; another writes it "surged." "Crept" suggests slowness and stealth, perhaps menace or patience; "surged" suggests power and speed. If a question asks what "crept" conveys, the answer is a sense of slow, quiet movement — not raw force.

The technique is to swap in a neutral synonym and notice what changes. Replace "crept" with "moved": the sentence loses its slow, secretive feeling. That lost quality is the effect the original word produced. This subtraction test isolates exactly what the word contributes.

Watch for loaded verbs and adjectives — they carry the author's attitude most directly. A politician "conceded" versus "admitted" versus "confessed" a point: each escalates the sense of reluctance or fault. On the SAT, the correct answer names the specific impression the chosen word creates in that context, not a generic definition.`,
      examTip: `Replace the tested word with a plain synonym. Whatever feeling disappears is the rhetorical effect the original word created.`,
    },
    {
      id: 'rh-argument-completion',
      title: `2. Completing an Argument`,
      content: `Some rhetorical questions ask which choice best completes an argument, illustrates a point, or provides an appropriate example. These reward logical fit over eloquence.

Suppose a passage argues that small design changes can have large effects, then says "For example, ____." The blank needs a case where a minor change produced a major result. A choice describing "a one-word change to a warning label that cut accidents in half" fits perfectly. A choice describing "a complete redesign of a factory floor" does not — that is a large change, contradicting the "small change" point.

The method: identify precisely what the argument needs the example to demonstrate, then check each choice against that requirement. The best illustration matches every element of the claim. If the claim specifies "small change, large effect," both halves must appear in the example.

Beware examples that are true and interesting but illustrate a slightly different point. On the SAT, an example that supports a nearby idea rather than the exact claim in question is a common trap. The example must fit the specific logical slot the passage opens.`,
      importantNote: `An illustration must match every element of the claim it supports. If the claim has two parts, both must appear in the example.`,
    },
    {
      id: 'rh-transitions-logic',
      title: `3. Transitions and Logical Flow`,
      content: `Transition questions ask which word or phrase best connects two sentences. The right transition names the exact logical relationship between the ideas — contrast, cause, addition, example, or sequence.

First, ignore the choices and determine the relationship yourself. Read the two sentences and ask: does the second contrast with the first (however, nevertheless), continue it (moreover, furthermore), result from it (therefore, consequently), or exemplify it (for instance)?

Example: "The bridge was designed to last a century. ____, it collapsed within twenty years." The second sentence contradicts the expectation set by the first, so a contrast transition — "However" or "Nevertheless" — is needed. "Therefore" would wrongly signal a consequence, and "For example" makes no sense.

A frequent error is choosing a transition that sounds sophisticated but names the wrong relationship. "Consequently" and "nevertheless" are both formal, but they mean opposite things. Match the meaning, not the tone.

Also watch for transitions that are redundant or unnecessary. If two sentences simply continue the same thought, a heavy contrast word breaks the logic. Decide what relationship truly exists, then pick the transition that names it precisely.`,
      examTip: `Determine the logical relationship between the two sentences before looking at the choices, then pick the transition that names exactly that relationship.`,
    },
  ],
  keyTakeaways: [
    `Word choice conveys attitude; use the synonym-swap test to find its effect.`,
    `A good illustration matches every element of the claim it supports.`,
    `For transitions, determine the logical relationship before reading the choices.`,
    `Sophisticated transitions can name the wrong relationship — match meaning, not tone.`,
    `Rhetorical questions treat language as deliberate choices serving the author's purpose.`,
  ],
},

rw_conventions: {
  topicId: 'rw_conventions',
  title: `Standard English Conventions`,
  domainWeight: 'Reading and Writing',
  overview: `Standard English Conventions questions test grammar, punctuation, and sentence structure. On the digital SAT these are a large share of the Reading and Writing section and are among the most learnable — the rules are finite and the same handful appears repeatedly. Master boundaries between sentences, punctuation with clauses, subject-verb agreement, pronouns, and modifiers, and you can answer these quickly and confidently.`,
  sections: [
    {
      id: 'cv-sentence-boundaries',
      title: `1. Sentence Boundaries and Joining Clauses`,
      content: `Many convention questions turn on how to join or separate two clauses. First identify whether each side of the punctuation is an independent clause (a complete sentence) or not.

Two independent clauses cannot be joined by a comma alone — that is a comma splice, always wrong on the SAT. To join them correctly you may use:
- A period: "The lab closed early. Researchers finished at home."
- A semicolon: "The lab closed early; researchers finished at home."
- A comma plus a coordinating conjunction (FANBOYS: for, and, nor, but, or, yet, so): "The lab closed early, so researchers finished at home."
- A colon or dash, when the second clause explains the first.

If one part is a dependent clause (begins with because, although, when, since, if), a comma is often correct or no punctuation is needed: "Because the lab closed early, researchers finished at home."

The reliable test: check whether the words on each side of the punctuation could stand alone as sentences. If both can, you need a period, semicolon, or comma-plus-conjunction — never a bare comma. If only one can, a comma or nothing is likely right.

Example error: "The experiment succeeded, the team celebrated." Both clauses are complete, joined by only a comma — a splice. Fix it with a semicolon or "and."`,
      examTip: `Cover each side of the punctuation. If both sides are complete sentences, a lone comma is wrong every time.`,
    },
    {
      id: 'cv-subject-verb-pronoun',
      title: `2. Subject-Verb Agreement and Pronouns`,
      content: `Subject-verb agreement means a singular subject takes a singular verb and a plural subject takes a plural verb. The SAT hides the subject behind intervening words to make agreement harder to see.

Example: "The box of samples (is/are) on the counter." The subject is "box" (singular), not "samples," so the verb is "is." Mentally delete the prepositional phrase "of samples" to expose the true subject.

Watch for these patterns:
- Prepositional phrases between subject and verb: ignore them.
- Collective nouns (team, committee, jury) are usually singular: "The committee is meeting."
- "Each," "every," "either," "neither," and "one" are singular: "Each of the runners was ready."

Pronoun agreement follows the same logic: a pronoun must match its antecedent in number. "A student should bring their notebook" mismatches singular "student" with plural "their" in formal usage; the SAT typically wants "his or her notebook" or a plural subject ("Students should bring their notebooks").

Also check pronoun clarity: "his," "her," "it," and "they" must clearly refer to one noun. If a pronoun could point to two different nouns, the sentence is ambiguous and needs revision.`,
      importantNote: `Find the true subject by crossing out prepositional phrases and other words between the subject and its verb.`,
    },
    {
      id: 'cv-punctuation-modifiers',
      title: `3. Punctuation and Modifiers`,
      content: `Several convention questions test specific punctuation marks. Learn their core jobs:

- Commas set off nonessential information: "The report, which ran late, was thorough." The clause between commas can be removed without breaking the sentence.
- No commas around essential information: "The report that she wrote won an award." "That she wrote" identifies which report, so no commas.
- Colons introduce a list or explanation and require a complete sentence before them: "She packed three items: a map, water, and a compass." A colon after "packed" (an incomplete idea) would be wrong.
- Dashes work like colons or paired commas and can add emphasis.
- Apostrophes show possession (the dog's leash) or contractions (it's = it is). Note "its" (possessive) has no apostrophe.

Modifiers must sit next to what they modify. A misplaced or dangling modifier creates illogical meaning: "Running to catch the bus, the backpack fell off her shoulder." As written, the backpack is running. The fix names the actual runner: "Running to catch the bus, she felt the backpack fall off her shoulder."

To catch dangling modifiers, check that the noun right after an opening modifier phrase is the thing performing that action.`,
      examTip: `After an introductory "-ing" or "-ed" phrase, the very next noun must be the one doing the action. If it is not, the modifier dangles.`,
    },
  ],
  keyTakeaways: [
    `Two complete sentences need a period, semicolon, or comma-plus-conjunction — never a lone comma.`,
    `Find the true subject by deleting prepositional phrases before checking the verb.`,
    `"Each," "every," and collective nouns usually take singular verbs.`,
    `Commas set off nonessential info; essential info takes no commas.`,
    `A colon needs a complete sentence before it.`,
    `The noun after an opening modifier must be the one performing the action.`,
  ],
},

rw_expression: {
  topicId: 'rw_expression',
  title: `Expression of Ideas`,
  domainWeight: 'Reading and Writing',
  overview: `Expression of Ideas questions test effective communication: choosing transitions that fit the logic, and synthesizing notes to accomplish a stated goal. On the digital SAT, "rhetorical synthesis" questions give you a bulleted set of facts and ask which sentence best achieves a specific purpose. These reward reading the goal carefully and selecting only the information that serves it.`,
  sections: [
    {
      id: 'ex-rhetorical-synthesis',
      title: `1. Rhetorical Synthesis from Notes`,
      content: `Rhetorical synthesis questions present a student's research notes as bullet points, then ask which choice best accomplishes a specific goal — for example, "to emphasize a similarity between the two methods" or "to introduce the study to an audience unfamiliar with it."

The goal in the question is everything. Read it first and underline the key requirement. If the goal is to emphasize a similarity, the correct sentence must state something the two things share. A sentence that is accurate and well written but highlights a difference fails the goal.

Method:
- Read the goal and restate what the sentence must do.
- Scan the notes for the facts relevant to that goal.
- Choose the option that uses those facts to accomplish exactly the stated purpose.

Example: notes describe two bridges, each 100 years old, one steel and one stone. Goal: "emphasize a shared feature." A correct choice: "Both the steel bridge and the stone bridge have stood for a century." A tempting wrong choice contrasts their materials — true, well written, but it emphasizes difference, not similarity.

The most common error is choosing the most fluent sentence rather than the one that meets the goal. Grammar and style are not being tested here; purpose is.`,
      examTip: `Underline the goal and treat it as a rule. The right answer accomplishes exactly that goal, even if another choice reads more smoothly.`,
    },
    {
      id: 'ex-transitions-logic',
      title: `2. Transitions in Context`,
      content: `Expression of Ideas transition questions, like their rhetorical cousins, ask which connector best links ideas. The approach is the same: determine the relationship yourself before reading choices.

Classify the relationship into a category and recall a matching transition:
- Contrast: however, in contrast, nevertheless, on the other hand.
- Addition: moreover, furthermore, in addition, also.
- Cause/effect: therefore, thus, consequently, as a result.
- Example: for example, for instance, specifically.
- Sequence: first, next, then, finally.
- Concession: admittedly, granted, of course (then a pivot).

Example: "The prototype passed every stress test. ____, engineers delayed the launch to run additional safety checks." The second sentence adds a surprising further action despite success, so a contrast or concession transition fits: "Nevertheless" or "Even so." "Therefore" would wrongly suggest the delay followed logically from passing the tests.

A useful check: after choosing a transition, reread both sentences with it in place. If the logic feels smooth and the relationship makes sense, you are likely right. If the transition forces you to reinterpret the sentences, it is wrong.`,
      importantNote: `Every category of transition has several members with the same meaning. First pick the category, then any member of it will do.`,
    },
    {
      id: 'ex-relevance-conciseness',
      title: `3. Relevance and Serving the Goal`,
      content: `A recurring theme in Expression of Ideas is relevance: keeping only what serves the writer's purpose. Even factually correct information is a wrong answer if it does not advance the specific goal.

Suppose the goal is "to present the main finding of the study to a general audience." The correct sentence states the finding plainly, without jargon or side details. A choice packed with technical terms fails the "general audience" requirement; a choice about the researchers' funding fails because it is not the finding.

Two habits sharpen these answers:
- Match the audience. A general audience needs plain language; a specialist audience can handle technical terms. The goal tells you which.
- Match the scope. If the goal asks for one finding, do not choose a sentence that lists several unrelated facts.

Example: goal is "introduce the invention to readers who have never heard of it." The best choice defines what the invention is and does in accessible terms. A choice giving detailed performance statistics assumes prior knowledge and fails the introduction goal.

The unifying rule across Expression of Ideas: identify the precise job the sentence must do, then choose the option that does that job and only that job — no more, no less.`,
      examTip: `A true, well-written sentence is still wrong if it does not serve the stated goal. Relevance to the goal beats accuracy and style.`,
    },
  ],
  keyTakeaways: [
    `In synthesis questions, the stated goal is the rule — read it first and obey it exactly.`,
    `Grammar and fluency are not tested here; purpose is.`,
    `For transitions, choose the logical category first, then any matching connector.`,
    `Match the sentence to the audience (general vs. specialist) the goal names.`,
    `A correct but irrelevant sentence is a wrong answer.`,
  ],
},

math_linear_eq: {
  topicId: 'math_linear_eq',
  title: `Linear Equations & Inequalities`,
  domainWeight: 'Math',
  overview: `Linear equations and inequalities in one variable are foundational to the digital SAT's Algebra domain. You will solve equations, work with inequalities, and translate word problems into linear models. Mastery means isolating a variable cleanly, handling the sign rule for inequalities, and knowing when an equation has one solution, no solution, or infinitely many.`,
  sections: [
    {
      id: 'le-solving-one-variable',
      title: `1. Solving Linear Equations in One Variable`,
      content: `To solve a linear equation, isolate the variable using inverse operations, keeping the equation balanced by doing the same thing to both sides.

Example: Solve 3(x - 4) = 2x + 5.
- Distribute: 3x - 12 = 2x + 5.
- Subtract 2x from both sides: x - 12 = 5.
- Add 12 to both sides: x = 17.
- Check: 3(17 - 4) = 3(13) = 39 and 2(17) + 5 = 39. It matches.

When fractions appear, clear them first by multiplying every term by the common denominator. Solve (x/2) + (x/3) = 5 by multiplying through by 6: 3x + 2x = 30, so 5x = 30 and x = 6.

Special cases the SAT tests directly:
- No solution: variables cancel and leave a false statement, like 2x + 3 = 2x + 7, which reduces to 3 = 7 (never true). No value of x works.
- Infinitely many solutions: variables cancel and leave a true statement, like 2x + 6 = 2(x + 3), which reduces to 6 = 6 (always true). Every x works.

Recognizing these two cases quickly saves time. If, after simplifying, the variable disappears, check whether the leftover equation is true (infinite solutions) or false (no solution).`,
      examTip: `Always do the same operation to both sides. When the variable cancels out, a true leftover means infinite solutions and a false leftover means no solution.`,
    },
    {
      id: 'le-inequalities',
      title: `2. Solving Linear Inequalities`,
      content: `Inequalities are solved almost exactly like equations, with one critical rule: when you multiply or divide both sides by a negative number, you must flip the inequality sign.

Example: Solve -2x + 6 > 14.
- Subtract 6: -2x > 8.
- Divide by -2 and flip the sign: x < -4.
- Check with a test value like x = -5: -2(-5) + 6 = 16 > 14. True. And x = 0 gives 6 > 14, false — confirming x must be less than -4.

Compound inequalities express a range. Solve 3 < 2x + 1 < 9 by operating on all three parts at once:
- Subtract 1 from each part: 2 < 2x < 8.
- Divide each part by 2: 1 < x < 4.
So x lies strictly between 1 and 4.

On the SAT, inequality word problems often ask for a maximum or minimum value. If a budget allows spending at most \$50 and each item costs \$4 with a \$6 fee, then 4n + 6 <= 50 gives 4n <= 44, so n <= 11. The most items you can buy is 11. The phrase "at most" becomes <=, and "at least" becomes >=.`,
      importantNote: `The single most common inequality error is forgetting to flip the sign when multiplying or dividing by a negative. Always double-check with a test value.`,
    },
    {
      id: 'le-word-problems',
      title: `3. Translating Word Problems`,
      content: `Many linear questions are dressed as scenarios. The skill is turning words into an equation by defining a variable and translating each phrase.

Common translations:
- "is," "equals," "will be" become the equals sign.
- "per," "each" indicate a rate multiplied by a quantity.
- "more than," "increased by" mean addition; "less than," "fewer" mean subtraction (mind the order: "5 less than x" is x - 5).
- A one-time charge is a constant; a repeating charge is a rate times a variable.

Example: A gym charges a \$25 sign-up fee plus \$15 per month. Write the total cost C after m months. The fee is a constant and the monthly charge is a rate: C = 15m + 25. To find how many months give a total of \$130, set 15m + 25 = 130, so 15m = 105 and m = 7.

Example: The sum of three consecutive integers is 72. Let the first be n, so the others are n + 1 and n + 2. Then n + (n + 1) + (n + 2) = 72, giving 3n + 3 = 72, so 3n = 69 and n = 23. The integers are 23, 24, and 25.

The reliable process: define the variable in words, write the equation phrase by phrase, solve, then reread the question to answer exactly what it asks — sometimes it wants a different quantity than the variable you solved for.`,
      examTip: `Reread the final question after solving. The SAT often asks for a value derived from the variable (like x + 2) rather than the variable itself.`,
    },
  ],
  keyTakeaways: [
    `Isolate the variable with inverse operations, keeping both sides balanced.`,
    `Clear fractions by multiplying every term by the common denominator.`,
    `Variable cancels to a true statement means infinite solutions; to a false statement means no solution.`,
    `Flip the inequality sign when multiplying or dividing by a negative.`,
    `Translate word problems phrase by phrase, then reread to answer the exact question asked.`,
  ],
},

math_linear_func: {
  topicId: 'math_linear_func',
  title: `Linear Functions`,
  domainWeight: 'Math',
  overview: `Linear functions describe constant rates of change and appear throughout the digital SAT — in graphs, tables, word problems, and function notation. The core object is y = mx + b, where m is the slope (rate of change) and b is the y-intercept (starting value). You must move fluently among a function's equation, graph, table, and verbal description.`,
  sections: [
    {
      id: 'lf-slope-intercept',
      title: `1. Slope and the Slope-Intercept Form`,
      content: `The slope-intercept form y = mx + b is the most useful way to write a linear function. Here m is the slope and b is the y-intercept, the value of y when x = 0.

Slope measures rate of change: m = (change in y)/(change in x) = (y2 - y1)/(x2 - x1). Given two points (2, 5) and (6, 13), the slope is (13 - 5)/(6 - 2) = 8/4 = 2. A slope of 2 means y increases by 2 for every 1 increase in x.

To write the equation of a line through (2, 5) with slope 2: start with y = 2x + b, substitute the point to find b: 5 = 2(2) + b, so b = 1. The equation is y = 2x + 1.

Interpret slope and intercept in context. If a phone plan costs C = 0.10t + 20 where t is minutes, the slope 0.10 means each extra minute costs \$0.10, and the intercept 20 means the base charge is \$20 even at zero minutes.

Sign of slope: positive slope rises left to right, negative slope falls, zero slope is a horizontal line, and an undefined slope is a vertical line (not a function). Recognizing slope sign from a graph is a quick way to eliminate answer choices.`,
      examTip: `In any real-world linear model, the slope is the "per-unit" rate and the y-intercept is the starting or fixed value. Questions frequently ask you to interpret one of these.`,
    },
    {
      id: 'lf-representations',
      title: `2. Moving Between Representations`,
      content: `The SAT constantly asks you to translate a linear function among its four forms: equation, graph, table, and words. Being fluent in all four is essential.

From a table: find the slope by dividing the change in y by the change in x between rows, confirming it is constant. For the table (x: 0, 1, 2) and (y: 4, 7, 10), y rises by 3 each time x rises by 1, so slope = 3 and the intercept (y at x = 0) is 4, giving y = 3x + 4.

From a graph: read the y-intercept where the line crosses the y-axis, then count rise over run between two clear grid points to get the slope.

From words to equation: identify the starting amount (intercept) and the rate (slope). "A tank holds 50 liters and drains 2 liters per minute" becomes V = 50 - 2t: intercept 50, slope -2 (negative because the volume decreases).

Function notation: f(x) = 3x + 4 means the same as y = 3x + 4. To evaluate f(5), substitute: f(5) = 3(5) + 4 = 19. To solve f(x) = 19, set 3x + 4 = 19, giving x = 5. Reading notation correctly — value in, value out — prevents many errors.`,
      importantNote: `A constant rate of change is the signature of a linear function. If a table's differences are not constant, the relationship is not linear.`,
    },
    {
      id: 'lf-parallel-perpendicular',
      title: `3. Parallel and Perpendicular Lines`,
      content: `Two lines' slopes reveal how they relate geometrically.

Parallel lines have equal slopes and never meet. The line parallel to y = 3x + 1 through the point (0, 7) is y = 3x + 7 — same slope 3, different intercept.

Perpendicular lines have slopes that are negative reciprocals: if one slope is m, the other is -1/m, and their product is -1. A line perpendicular to y = 2x + 5 has slope -1/2. Through the point (4, 3), it is y = -(1/2)x + b; substituting gives 3 = -(1/2)(4) + b = -2 + b, so b = 5 and the line is y = -(1/2)x + 5.

To test perpendicularity, multiply the slopes: 2 times -1/2 equals -1, confirming they are perpendicular.

The SAT also uses standard form Ax + By = C. To find its slope, solve for y: from 2x + 3y = 6, subtract 2x to get 3y = -2x + 6, then divide by 3: y = -(2/3)x + 2. The slope is -2/3. Converting to slope-intercept form is the reliable way to compare lines given in standard form.

Watch for the special cases: horizontal lines (slope 0) are perpendicular to vertical lines (undefined slope), a pairing the negative-reciprocal rule cannot express directly.`,
      examTip: `Perpendicular slopes multiply to -1. To compare lines given in standard form, always convert to y = mx + b first so the slopes are visible.`,
    },
  ],
  keyTakeaways: [
    `Slope m = (change in y)/(change in x); the y-intercept b is the value when x = 0.`,
    `In context, slope is the per-unit rate and intercept is the fixed starting value.`,
    `Translate freely among equation, graph, table, and words — constant rate signals linearity.`,
    `Parallel lines share slopes; perpendicular slopes are negative reciprocals (product -1).`,
    `Convert standard form Ax + By = C to y = mx + b to read the slope.`,
  ],
},

math_systems: {
  topicId: 'math_systems',
  title: `Systems of Equations`,
  domainWeight: 'Math',
  overview: `A system of equations is two or more equations sharing the same variables; a solution satisfies all of them simultaneously and corresponds to the point where their graphs intersect. The digital SAT tests substitution, elimination, and interpreting systems in context, including recognizing when a system has one solution, no solution, or infinitely many.`,
  sections: [
    {
      id: 'sy-substitution',
      title: `1. Solving by Substitution`,
      content: `Substitution works best when one variable is already isolated or easy to isolate. Solve one equation for a variable, then substitute that expression into the other equation.

Example: Solve the system
y = 2x + 1
3x + y = 16
Since y is already isolated in the first equation, substitute 2x + 1 for y in the second: 3x + (2x + 1) = 16. Combine: 5x + 1 = 16, so 5x = 15 and x = 3. Then y = 2(3) + 1 = 7. The solution is (3, 7).

Always find both variables and check the pair in both original equations: 3(3) + 7 = 16 confirms it.

If no variable is isolated, isolate the easiest one first. For x - 2y = 4 and 3x + y = 5, solve the first for x: x = 2y + 4. Substitute into the second: 3(2y + 4) + y = 5, so 6y + 12 + y = 5, giving 7y = -7 and y = -1. Then x = 2(-1) + 4 = 2. The solution is (2, -1).

Substitution is reliable but can produce messy fractions when coefficients are large. In that case, elimination is often faster.`,
      examTip: `Substitution shines when one equation already has a variable alone (like y = ...). Solve for that variable, plug in, then back-substitute to get the other.`,
    },
    {
      id: 'sy-elimination',
      title: `2. Solving by Elimination`,
      content: `Elimination adds or subtracts the equations to cancel one variable. It works best when coefficients line up or can be matched by multiplying.

Example: Solve
2x + 3y = 12
2x - y = 4
The x-coefficients match, so subtract the second from the first: (2x + 3y) - (2x - y) = 12 - 4, giving 4y = 8, so y = 2. Substitute into 2x - y = 4: 2x - 2 = 4, so 2x = 6 and x = 3. Solution: (3, 2).

When coefficients do not match, scale an equation first. For 3x + 2y = 16 and 5x + 3y = 26, multiply the first by 3 and the second by 2 to make the y-terms match: 9x + 6y = 48 and 10x + 6y = 52. Subtract: (10x - 9x) = 52 - 48, so x = 4. Then 3(4) + 2y = 16 gives 2y = 4 and y = 2. Solution: (4, 2).

A common SAT shortcut: sometimes the question asks for a combination like x + y or 2x + 2y rather than each variable. Adding the two equations may give that combination directly, saving steps. Read the question before fully solving.`,
      importantNote: `To eliminate a variable, its coefficients must be equal or opposite. Multiply one or both equations by a constant to create a matching pair.`,
    },
    {
      id: 'sy-number-solutions',
      title: `3. Number of Solutions and Context`,
      content: `A system of two linear equations has exactly one solution when the lines have different slopes (they cross once), no solution when the lines are parallel (same slope, different intercept — never meet), and infinitely many solutions when the equations describe the same line (same slope and intercept).

To determine the case without graphing, write both in y = mx + b form and compare:
- Different slopes: one solution.
- Same slope, different intercept: no solution.
- Same slope, same intercept: infinitely many.

Example: For what value of c does 4x + 2y = 10 and 2x + y = c have infinitely many solutions? Rewrite the first as 2x + y = 5 (dividing by 2). The two equations are identical only if c = 5. For any other c, the lines are parallel and there is no solution.

In context, the solution to a system is where two conditions are met at once. If one plan costs C = 30 + 0.10m and another C = 20 + 0.15m, setting them equal (30 + 0.10m = 20 + 0.15m) finds the number of minutes where the plans cost the same: 10 = 0.05m, so m = 200 minutes. Below 200 minutes one plan is cheaper; above it, the other. The intersection point is the break-even value the question usually seeks.`,
      examTip: `Put both equations in y = mx + b form. Same slope and same intercept means infinite solutions; same slope but different intercept means no solution.`,
    },
  ],
  keyTakeaways: [
    `A solution satisfies every equation and is the graphs' intersection point.`,
    `Use substitution when a variable is already isolated; use elimination to cancel a matched variable.`,
    `Scale equations so a variable's coefficients match, then add or subtract.`,
    `Different slopes give one solution; parallel lines give none; identical lines give infinitely many.`,
    `Read the question — sometimes you need only a combination like x + y, found directly.`,
  ],
},

math_quadratic: {
  topicId: 'math_quadratic',
  title: `Quadratic Equations & Functions`,
  domainWeight: 'Math',
  overview: `Quadratic equations take the form ax^2 + bx + c = 0, and their graphs are parabolas. On the digital SAT's Advanced Math domain you must solve quadratics by factoring, the quadratic formula, and completing the square, and interpret features of the parabola — vertex, axis of symmetry, zeros, and direction of opening. Choosing the right method for each problem is a major time-saver.`,
  sections: [
    {
      id: 'qd-factoring',
      title: `1. Solving by Factoring`,
      content: `Factoring is the fastest method when a quadratic factors nicely. The idea rests on the zero-product property: if a product equals zero, at least one factor is zero.

Example: Solve x^2 + 5x + 6 = 0. Find two numbers that multiply to 6 (the constant) and add to 5 (the middle coefficient): 2 and 3. So x^2 + 5x + 6 = (x + 2)(x + 3) = 0. Setting each factor to zero gives x = -2 or x = -3.

For x^2 - 7x + 12 = 0, find two numbers multiplying to 12 and adding to -7: they are -3 and -4. So (x - 3)(x - 4) = 0, giving x = 3 or x = 4.

Special patterns speed factoring:
- Difference of squares: x^2 - 9 = (x - 3)(x + 3), so x = 3 or x = -3.
- Perfect square trinomial: x^2 + 6x + 9 = (x + 3)^2, giving a double root x = -3.

When the leading coefficient is not 1, either factor by grouping or first check whether a common factor divides out. For 2x^2 + 8x + 6 = 0, divide by 2: x^2 + 4x + 3 = 0, then factor to (x + 1)(x + 3) = 0, so x = -1 or x = -3.`,
      examTip: `Factoring is fastest, so try it first. Look for two numbers that multiply to the constant term and add to the middle coefficient.`,
    },
    {
      id: 'qd-formula',
      title: `2. The Quadratic Formula and the Discriminant`,
      content: `When a quadratic does not factor cleanly, use the quadratic formula. For ax^2 + bx + c = 0, the solutions are x = (-b plus or minus sqrt(b^2 - 4ac))/(2a).

Example: Solve x^2 - 4x + 1 = 0. Here a = 1, b = -4, c = 1. The discriminant b^2 - 4ac = 16 - 4 = 12. So x = (4 plus or minus sqrt(12))/2 = (4 plus or minus 2sqrt(3))/2 = 2 plus or minus sqrt(3). The two solutions are 2 + sqrt(3) and 2 - sqrt(3).

The discriminant b^2 - 4ac alone tells you the number of real solutions:
- Positive discriminant: two distinct real solutions (parabola crosses the x-axis twice).
- Zero discriminant: exactly one real solution, a double root (parabola touches the x-axis at its vertex).
- Negative discriminant: no real solutions (parabola never crosses the x-axis).

The SAT often asks about the number of solutions without needing the actual values. For x^2 + 3x + 5 = 0, the discriminant is 9 - 20 = -11 < 0, so there are no real solutions. This lets you answer such questions with a single subtraction.`,
      importantNote: `The discriminant b^2 - 4ac reveals the number of real solutions: positive gives two, zero gives one, negative gives none — no need to fully solve.`,
    },
    {
      id: 'qd-vertex-graph',
      title: `3. The Parabola: Vertex and Key Features`,
      content: `The graph of y = ax^2 + bx + c is a parabola. It opens upward if a > 0 (with a minimum) and downward if a < 0 (with a maximum). Reading its features from the equation is a frequent SAT task.

Vertex form y = a(x - h)^2 + k puts the vertex at (h, k). For example, y = 2(x - 3)^2 - 5 has its vertex at (3, -5) and opens upward, so its minimum value is -5, reached at x = 3.

From standard form, the axis of symmetry (and the x-coordinate of the vertex) is x = -b/(2a). For y = x^2 - 6x + 8, that is x = 6/2 = 3. Substitute back to find the y-coordinate: y = 9 - 18 + 8 = -1, so the vertex is (3, -1).

The zeros (x-intercepts) are where y = 0. Factored form y = a(x - r1)(x - r2) shows the zeros directly as r1 and r2. For y = (x - 2)(x - 6), the zeros are x = 2 and x = 6, and the axis of symmetry lies exactly between them at x = 4.

Each form of a quadratic reveals different information at a glance: vertex form shows the vertex, factored form shows the zeros, and standard form shows the y-intercept c (the value when x = 0). Choose the form that exposes what the question asks for.`,
      examTip: `Match the form to the question: vertex form for the max/min, factored form for the zeros, standard form for the y-intercept. The axis of symmetry is x = -b/(2a).`,
    },
  ],
  keyTakeaways: [
    `Try factoring first; use the zero-product property to read off the solutions.`,
    `Use the quadratic formula x = (-b plus or minus sqrt(b^2 - 4ac))/(2a) when factoring fails.`,
    `The discriminant b^2 - 4ac gives the number of real solutions (2, 1, or 0).`,
    `A parabola opens up when a > 0 (minimum) and down when a < 0 (maximum).`,
    `Vertex form shows the vertex, factored form shows the zeros, standard form shows the y-intercept.`,
  ],
},

math_polynomial: {
  topicId: 'math_polynomial',
  title: `Polynomial & Rational Expressions`,
  domainWeight: 'Math',
  overview: `This Advanced Math topic covers operating on polynomials, factoring higher-degree expressions, and simplifying rational (fraction) expressions. On the digital SAT you will multiply and factor polynomials, connect factors to zeros, and simplify or combine algebraic fractions while watching for values that make a denominator zero.`,
  sections: [
    {
      id: 'pl-operations',
      title: `1. Multiplying and Factoring Polynomials`,
      content: `Multiplying polynomials means distributing every term of one factor across every term of the other, then combining like terms.

Example: Expand (x + 3)(x - 5). Distribute: x*x + x*(-5) + 3*x + 3*(-5) = x^2 - 5x + 3x - 15 = x^2 - 2x - 15.

For a squared binomial, remember (a + b)^2 = a^2 + 2ab + b^2 and (a - b)^2 = a^2 - 2ab + b^2. So (x + 4)^2 = x^2 + 8x + 16. A frequent error is forgetting the middle term and writing x^2 + 16 — always include the 2ab term.

Factoring reverses multiplication. First pull out any greatest common factor: 6x^3 + 9x^2 = 3x^2(2x + 3). Then factor what remains if possible.

Recognize key patterns:
- Difference of squares: a^2 - b^2 = (a - b)(a + b), so x^2 - 25 = (x - 5)(x + 5).
- Difference of cubes: a^3 - b^3 = (a - b)(a^2 + ab + b^2).
- Sum of cubes: a^3 + b^3 = (a + b)(a^2 - ab + b^2).

For a quadratic trinomial with leading coefficient 1, find two numbers that multiply to the constant and add to the middle term, exactly as in factoring quadratics. These skills let you rewrite expressions into the factored form the SAT often requires.`,
      examTip: `Always factor out the greatest common factor first — it simplifies everything that follows and prevents you from missing a shared factor.`,
    },
    {
      id: 'pl-zeros-factors',
      title: `2. Connecting Factors, Zeros, and Graphs`,
      content: `A powerful idea unifies much of Advanced Math: the factors of a polynomial reveal its zeros, and the zeros are where its graph crosses the x-axis.

If (x - r) is a factor of a polynomial p(x), then p(r) = 0, and r is a zero. Conversely, if p(r) = 0, then (x - r) is a factor. This is the Factor Theorem, and the SAT tests it directly.

Example: If p(x) = x^3 - 4x, factor to find the zeros. Pull out x: p(x) = x(x^2 - 4) = x(x - 2)(x + 2). The zeros are x = 0, x = 2, and x = -2 — exactly where the graph crosses the x-axis.

The remainder connection: dividing p(x) by (x - r) leaves a remainder of p(r). So if a question says p(x) divided by (x - 3) has remainder 0, then (x - 3) is a factor and p(3) = 0.

Multiplicity affects the graph: a factor like (x - 2)^2 gives a zero where the graph touches the x-axis and turns around rather than crossing it. A single factor (x - 2) gives a straightforward crossing.

Given a graph with x-intercepts at -1, 2, and 4, you can reconstruct a possible polynomial as p(x) = a(x + 1)(x - 2)(x - 4). This factor-zero-graph triangle is one of the most tested ideas in Advanced Math.`,
      importantNote: `Factor, zero, and x-intercept are three views of the same thing: (x - r) is a factor exactly when r is a zero exactly when the graph crosses the x-axis at r.`,
    },
    {
      id: 'pl-rational',
      title: `3. Simplifying Rational Expressions`,
      content: `A rational expression is a ratio of polynomials. To simplify one, factor the numerator and denominator, then cancel common factors.

Example: Simplify (x^2 - 9)/(x^2 + 4x + 3). Factor both: numerator = (x - 3)(x + 3), denominator = (x + 1)(x + 3). Cancel the common (x + 3): the result is (x - 3)/(x + 1), valid for x not equal to -3 (where the original was undefined) and x not equal to -1.

To add or subtract rational expressions, find a common denominator, just as with numeric fractions. For 1/x + 1/(x + 1), the common denominator is x(x + 1): rewrite as (x + 1)/(x(x + 1)) + x/(x(x + 1)) = (2x + 1)/(x(x + 1)).

To multiply, multiply numerators and denominators, then simplify. To divide, multiply by the reciprocal: (a/b) divided by (c/d) = (a/b)(d/c).

Always note excluded values — any x that makes an original denominator zero is not allowed. In (x^2 - 9)/(x^2 + 4x + 3), the denominator is zero at x = -1 and x = -3, so those values are excluded even though x = -3 cancels during simplification. The SAT sometimes asks specifically which values are undefined, so identify them from the original denominator before simplifying.`,
      examTip: `Factor everything before canceling, and identify excluded values from the original denominators — a value that makes a denominator zero is undefined even if it cancels.`,
    },
  ],
  keyTakeaways: [
    `Distribute fully when multiplying; remember (a + b)^2 = a^2 + 2ab + b^2.`,
    `Factor out the greatest common factor first, then apply patterns like difference of squares.`,
    `(x - r) is a factor exactly when r is a zero and an x-intercept (Factor Theorem).`,
    `Simplify rational expressions by factoring and canceling common factors.`,
    `Excluded values come from the original denominators, even factors that cancel.`,
  ],
},

math_exponents: {
  topicId: 'math_exponents',
  title: `Exponents & Radicals`,
  domainWeight: 'Math',
  overview: `Exponents and radicals appear across the digital SAT, from simplifying expressions to modeling exponential growth. You must apply the exponent rules confidently, interpret negative and fractional exponents, and connect radicals to fractional powers. These rules are compact and, once memorized, make many problems fast.`,
  sections: [
    {
      id: 'ex-rules',
      title: `1. The Exponent Rules`,
      content: `The exponent rules govern how powers combine. Memorize them; they reappear constantly.

- Product rule: x^a * x^b = x^(a+b). So x^3 * x^4 = x^7.
- Quotient rule: x^a / x^b = x^(a-b). So x^7 / x^2 = x^5.
- Power rule: (x^a)^b = x^(ab). So (x^3)^2 = x^6.
- Power of a product: (xy)^a = x^a * y^a. So (2x)^3 = 8x^3.
- Zero exponent: x^0 = 1 for any nonzero x.

Negative exponents mean reciprocals: x^(-n) = 1/(x^n). So 2^(-3) = 1/8, and x^(-2) = 1/(x^2). To move a factor between numerator and denominator, flip the sign of its exponent: 1/(x^(-3)) = x^3.

Example: Simplify (x^5 * x^(-2))/(x^4). Combine the numerator with the product rule: x^(5 + (-2)) = x^3. Then apply the quotient rule: x^3 / x^4 = x^(3-4) = x^(-1) = 1/x.

A frequent trap: the rules apply to like bases only. You cannot combine x^3 * y^2 into a single power because the bases differ. And addition is not multiplication — x^3 + x^3 = 2x^3, not x^6. Keep the operations straight: multiply powers of the same base by adding exponents, but add like terms by counting them.`,
      examTip: `The product, quotient, and power rules apply only when bases match. When in doubt, expand a small case (like x^3 = x*x*x) to check your work.`,
    },
    {
      id: 'ex-fractional',
      title: `2. Fractional Exponents and Radicals`,
      content: `A fractional exponent is a radical in disguise. The rule is x^(1/n) = the nth root of x, and x^(m/n) = the nth root of x^m = (nth root of x)^m.

Examples:
- x^(1/2) = sqrt(x). So 9^(1/2) = sqrt(9) = 3.
- x^(1/3) = the cube root of x. So 8^(1/3) = 2, since 2^3 = 8.
- x^(2/3) = (cube root of x)^2. So 27^(2/3) = (cube root of 27)^2 = 3^2 = 9.

Converting between radical and exponent form lets you apply the exponent rules to radicals. To simplify sqrt(x) * sqrt(x) * sqrt(x), rewrite as x^(1/2) * x^(1/2) * x^(1/2) = x^(3/2), which is x*sqrt(x).

Simplifying square roots: factor out perfect squares. sqrt(72) = sqrt(36 * 2) = sqrt(36) * sqrt(2) = 6*sqrt(2). Look for the largest perfect-square factor to simplify in one step.

Rationalizing a denominator removes a radical from the bottom: 1/sqrt(2) = (1/sqrt(2)) * (sqrt(2)/sqrt(2)) = sqrt(2)/2. The SAT accepts either form on most items, but recognizing equivalent forms helps you match answer choices that look different but are equal.`,
      importantNote: `Rewrite radicals as fractional exponents to unlock all the exponent rules. sqrt(x) is x^(1/2); the cube root of x is x^(1/3).`,
    },
    {
      id: 'ex-exponential-growth',
      title: `3. Exponential Growth and Decay`,
      content: `Exponential models describe quantities that multiply by a constant factor over equal intervals — unlike linear models, which add a constant. The form is y = a * b^x, where a is the starting value and b is the growth (or decay) factor.

If b > 1, the quantity grows; if 0 < b < 1, it decays. A population that starts at 500 and doubles each year is P = 500 * 2^t. After 3 years, P = 500 * 2^3 = 4000.

Percent change fits this form. Growth of r percent per period means b = 1 + r/100; decay of r percent means b = 1 - r/100. A \$1000 investment growing 5% yearly is A = 1000 * (1.05)^t. A car worth \$20000 losing 15% of its value each year is V = 20000 * (0.85)^t.

Distinguish linear from exponential: linear adds the same amount each step (constant difference), exponential multiplies by the same factor each step (constant ratio). If a table's values increase by a constant ratio — say each is 3 times the previous — the model is exponential, not linear.

The SAT often asks you to identify the growth factor or interpret it. In y = 200 * (1.08)^t, the base 1.08 means the quantity increases by 8% each period, and the 200 is the initial amount. Reading these two numbers correctly answers most exponential-model questions.`,
      examTip: `Exponential models multiply by a constant factor each period. A growth rate of r percent gives base (1 + r/100); a decay rate gives base (1 - r/100).`,
    },
  ],
  keyTakeaways: [
    `Multiply same-base powers by adding exponents; divide by subtracting; raise a power to a power by multiplying.`,
    `A negative exponent means a reciprocal: x^(-n) = 1/(x^n).`,
    `Fractional exponents are radicals: x^(m/n) is the nth root of x^m.`,
    `Simplify square roots by factoring out the largest perfect square.`,
    `Exponential models y = a*b^x multiply by factor b each step; growth of r% gives b = 1 + r/100.`,
  ],
},

math_ratios: {
  topicId: 'math_ratios',
  title: `Ratios, Proportions & Percents`,
  domainWeight: 'Math',
  overview: `Ratios, proportions, and percents form the core of the digital SAT's Problem-Solving and Data Analysis domain, and they appear in many word problems. You will set up proportions, work with unit rates, compute percent change, and reason about percentages of quantities. These problems are common and reward a clear, organized setup over clever tricks.`,
  sections: [
    {
      id: 'rt-ratios-proportions',
      title: `1. Ratios and Proportions`,
      content: `A ratio compares two quantities; a proportion states that two ratios are equal. Setting up and solving proportions by cross-multiplying handles a huge fraction of SAT rate problems.

Example: A recipe uses 3 cups of flour for every 2 cups of sugar. How much flour for 8 cups of sugar? Set up the proportion 3/2 = x/8. Cross-multiply: 2x = 24, so x = 12 cups of flour. Keep the same quantities on top and bottom (flour over sugar on both sides) to avoid errors.

Ratios can split a total. If a class of 30 has boys to girls in a 2:3 ratio, the total ratio parts are 2 + 3 = 5. Each part is 30/5 = 6 students, so there are 2*6 = 12 boys and 3*6 = 18 girls. This "add the parts, divide the total" method solves any part-to-part-to-whole ratio.

Unit rates express a ratio as "per one." If a car travels 150 miles on 5 gallons, its rate is 150/5 = 30 miles per gallon. Unit rates make comparison easy: to compare two deals, reduce each to a per-unit price.

Scaling and similar figures also use proportions. If two triangles are similar with a scale factor of 3, every corresponding length is multiplied by 3, and areas by 3^2 = 9.`,
      examTip: `Set up proportions with matching units in the same position (top and bottom) on both sides, then cross-multiply. This alignment prevents most setup errors.`,
    },
    {
      id: 'rt-percents',
      title: `2. Percent Basics and Percent Change`,
      content: `Percent means "per hundred," so 25% = 25/100 = 0.25. Three core operations cover most percent questions.

Finding a percent of a number: multiply. 30% of 80 is 0.30 * 80 = 24.

Finding what percent one number is of another: divide and convert. 18 is what percent of 72? Compute 18/72 = 0.25 = 25%.

Percent change: use (new - old)/old, then convert to a percent. If a price rises from \$40 to \$50, the change is (50 - 40)/40 = 10/40 = 0.25 = a 25% increase. If it falls from \$50 to \$40, the change is (40 - 50)/50 = -10/50 = -0.20 = a 20% decrease. Notice the two are not equal because the base (denominator) differs — a critical point the SAT tests.

Percent increase and decrease as multipliers: increasing by 20% multiplies by 1.20; decreasing by 20% multiplies by 0.80. To increase \$200 by 15%, compute 200 * 1.15 = 230. This multiplier method is faster than finding the change and adding it.

Successive percent changes do not simply add. A 10% increase followed by a 10% decrease gives 1.10 * 0.90 = 0.99, a net 1% decrease — not zero. Multiply the factors in sequence.`,
      importantNote: `Percent change always divides by the original (old) value. A rise from 40 to 50 and a fall from 50 to 40 are different percentages because the base differs.`,
    },
    {
      id: 'rt-applications',
      title: `3. Rates, Units, and Mixtures`,
      content: `Many SAT word problems combine rates with unit conversions. Organizing the work prevents mistakes.

Rate problems use distance = rate * time (or work = rate * time). If a train travels at 60 miles per hour for 2.5 hours, it covers 60 * 2.5 = 150 miles. To find time, rearrange: time = distance/rate.

Unit conversion uses ratios that equal 1. To convert 90 minutes to hours, multiply by (1 hour)/(60 minutes): 90 * (1/60) = 1.5 hours. To convert a speed of 30 meters per second to meters per minute, multiply by (60 seconds)/(1 minute): 30 * 60 = 1800 meters per minute. Set up conversions so unwanted units cancel.

Density and per-unit reasoning: if a solution is 12 grams of salt per 100 milliliters, then 250 milliliters contains (12/100) * 250 = 30 grams. Treat the concentration as a rate and multiply.

Mixture and average-rate problems require care. If you drive 60 miles at 30 mph and 60 miles at 60 mph, the average speed is not 45 mph. Total distance is 120 miles; total time is 2 + 1 = 3 hours; average speed is 120/3 = 40 mph. Always compute total distance over total time rather than averaging the rates directly.`,
      examTip: `For average speed, divide total distance by total time — never average the two speeds. Set up unit conversions so the units you do not want cancel out.`,
    },
  ],
  keyTakeaways: [
    `Solve proportions by cross-multiplying with matching units aligned on both sides.`,
    `Split a total by a ratio: add the parts, divide the total, then multiply each part.`,
    `Percent change is (new - old)/old; the base is always the original value.`,
    `Increase by r% multiplies by (1 + r/100); successive changes multiply, they do not add.`,
    `Average speed is total distance over total time, not the average of the speeds.`,
  ],
},

math_geometry: {
  topicId: 'math_geometry',
  title: `Geometry & Trigonometry`,
  domainWeight: 'Math',
  overview: `The digital SAT's Geometry and Trigonometry domain covers area and volume, angles, triangles (including the Pythagorean theorem and special right triangles), circles, and right-triangle trigonometry. Formulas are provided on the reference sheet, but knowing when and how to apply them — and recognizing special triangles — is what earns points quickly.`,
  sections: [
    {
      id: 'gm-triangles-pythagorean',
      title: `1. Triangles and the Pythagorean Theorem`,
      content: `Triangles are the most tested geometric figures. Two facts anchor most problems: the angles of a triangle sum to 180 degrees, and in a right triangle the Pythagorean theorem holds: a^2 + b^2 = c^2, where c is the hypotenuse.

Example: A right triangle has legs 6 and 8. The hypotenuse is sqrt(6^2 + 8^2) = sqrt(36 + 64) = sqrt(100) = 10. This is the 3-4-5 triangle scaled by 2.

Memorize the common Pythagorean triples so you can skip the arithmetic: 3-4-5, 5-12-13, 8-15-17, and their multiples (like 6-8-10). Spotting a triple instantly gives the third side.

Two special right triangles appear constantly:
- 45-45-90: the legs are equal, and the hypotenuse is a leg times sqrt(2). If each leg is 5, the hypotenuse is 5*sqrt(2).
- 30-60-90: the sides are in ratio 1 : sqrt(3) : 2 (short leg, long leg, hypotenuse). If the short leg (opposite 30 degrees) is 4, the long leg is 4*sqrt(3) and the hypotenuse is 8.

Similar triangles have equal angles and proportional sides. If two triangles are similar with corresponding sides 4 and 6, all corresponding sides are in the ratio 4:6 = 2:3, and their areas are in ratio (2/3)^2 = 4/9. Similarity turns many geometry problems into proportions.`,
      examTip: `Memorize the triples (3-4-5, 5-12-13) and the special right triangles (45-45-90 and 30-60-90). Recognizing them instantly gives a side length without computation.`,
    },
    {
      id: 'gm-circles-area-volume',
      title: `2. Circles, Area, and Volume`,
      content: `Area and volume formulas (mostly on the reference sheet) solve a wide range of questions; the skill is applying the right one.

Circles: circumference C = 2*pi*r and area A = pi*r^2. A circle with radius 5 has circumference 10*pi and area 25*pi. An arc length is a fraction of the circumference set by its central angle: a 90-degree arc is 90/360 = 1/4 of the circle, so its length is (1/4)(2*pi*r). A sector's area is the same fraction of the circle's area.

Common area formulas: rectangle A = length * width, triangle A = (1/2)*base*height, and for a circle A = pi*r^2. For a triangle with base 10 and height 6, the area is (1/2)(10)(6) = 30.

Volume: a rectangular box is length * width * height; a cylinder is pi*r^2*h (base area times height). A cylinder with radius 3 and height 10 has volume pi*(3^2)*10 = 90*pi. A cube of side 4 has volume 4^3 = 64.

Watch units and dimensions. Doubling a linear dimension multiplies area by 2^2 = 4 and volume by 2^3 = 8. If a question scales a figure, apply the square of the scale factor to areas and the cube to volumes. Reading whether the question wants a length, an area, or a volume tells you which power of the scale factor to use.`,
      importantNote: `Arc length and sector area are fractions of the whole circle set by (central angle)/360. Scaling a figure changes areas by the square and volumes by the cube of the scale factor.`,
    },
    {
      id: 'gm-trigonometry',
      title: `3. Right-Triangle Trigonometry`,
      content: `Trigonometry on the SAT centers on the ratios of a right triangle's sides, remembered by SOH-CAH-TOA:
- sin(angle) = opposite/hypotenuse
- cos(angle) = adjacent/hypotenuse
- tan(angle) = opposite/adjacent

Example: In a right triangle, the angle A has opposite side 3, adjacent side 4, and hypotenuse 5. Then sin(A) = 3/5, cos(A) = 4/5, and tan(A) = 3/4. To find an unknown side when you know an angle and one side, set up the matching ratio and solve.

A key relationship the SAT tests: the sine of an angle equals the cosine of its complement. In a right triangle, the two non-right angles sum to 90 degrees, so sin(x) = cos(90 - x). If sin(A) = 3/5 and A + B = 90 degrees, then cos(B) = 3/5 as well. This co-function identity appears in questions that give sin of one angle and ask for cos of the other.

Angles can be measured in radians as well as degrees; pi radians = 180 degrees. To convert, multiply degrees by pi/180 or radians by 180/pi. So 60 degrees = 60 * pi/180 = pi/3 radians.

For these problems, label the sides relative to the angle in question (opposite, adjacent, hypotenuse) before choosing the ratio. Mislabeling opposite and adjacent is the most common trig error, so orient yourself to the specific angle first.`,
      examTip: `Use SOH-CAH-TOA, and remember sin(x) = cos(90 - x). Label opposite, adjacent, and hypotenuse relative to the angle in question before picking a ratio.`,
    },
  ],
  keyTakeaways: [
    `Triangle angles sum to 180 degrees; the Pythagorean theorem is a^2 + b^2 = c^2.`,
    `Know the triples (3-4-5, 5-12-13) and special triangles (45-45-90, 30-60-90).`,
    `Circumference is 2*pi*r, area is pi*r^2; arcs and sectors are fractions set by angle/360.`,
    `Scaling changes area by the square and volume by the cube of the scale factor.`,
    `Use SOH-CAH-TOA and the identity sin(x) = cos(90 - x).`,
  ],
},

math_statistics: {
  topicId: 'math_statistics',
  title: `Statistics & Probability`,
  domainWeight: 'Math',
  overview: `The digital SAT's Problem-Solving and Data Analysis domain includes measures of center and spread, reading data from tables and graphs, probability, and interpreting studies. These questions reward careful reading of what the data show and clear reasoning about likelihood. Many can be solved by counting and organizing rather than heavy computation.`,
  sections: [
    {
      id: 'st-center-spread',
      title: `1. Mean, Median, Mode, and Spread`,
      content: `Measures of center summarize a data set in one number.

The mean (average) is the sum divided by the count. For the values 4, 6, 8, 10, 12, the mean is 40/5 = 8. If a question gives the mean and the count, you can recover the sum: mean times count equals total. A class of 20 students with a mean score of 75 has a total of 20 * 75 = 1500 points.

The median is the middle value when the data are ordered. For 3, 7, 9, 12, 20, the median is 9. With an even count, average the two middle values.

The mode is the most frequent value.

Spread describes how varied the data are. The range is the maximum minus the minimum. Standard deviation measures how far values typically fall from the mean; the SAT rarely asks you to compute it but does ask you to compare two data sets — the set whose values cluster tightly around the mean has the smaller standard deviation.

Effect of outliers: the mean is pulled toward extreme values, but the median resists them. If a data set of typical salaries includes one very high salary, the mean rises sharply while the median barely moves. This is why the median is often the better measure of a "typical" value for skewed data. The SAT frequently asks how adding or removing a value changes the mean versus the median.`,
      examTip: `Outliers pull the mean but barely affect the median. If a set is skewed by extreme values, the median better represents a typical value.`,
    },
    {
      id: 'st-reading-data',
      title: `2. Reading Tables, Graphs, and Two-Way Tables`,
      content: `Data-analysis questions require careful reading of tables and graphs. Slow down to read labels, units, and headings before computing.

Two-way tables classify data by two categories. Suppose a table shows students by grade (9th, 10th) and lunch choice (hot, cold). To find the probability a randomly chosen student is a 10th grader who chose hot lunch, divide that cell's count by the grand total. To find the probability a student chose hot lunch given they are in 10th grade (a conditional probability), divide the 10th-grade-hot cell by the 10th-grade row total — the condition changes the denominator.

Percentages from tables: "what percent of hot-lunch students are 9th graders?" divides the 9th-grade-hot cell by the total hot-lunch count. Identify the correct denominator by reading which group the question restricts to.

Line and bar graphs: read values off the axes, and note the scale — a gridline might represent 5 units, not 1. For rate-of-change questions, the steepest segment shows the fastest change.

Scatterplots show the relationship between two variables. A line of best fit models the trend; its slope is the predicted change in y per unit of x. You may be asked to use the line to predict a value or to judge whether the association is positive, negative, or nonexistent.`,
      importantNote: `Conditional probability ("given that...") changes the denominator to the size of the condition group, not the grand total. Read carefully to find the right denominator.`,
    },
    {
      id: 'st-probability',
      title: `3. Probability and Study Design`,
      content: `Probability is the number of favorable outcomes divided by the total number of equally likely outcomes, a value between 0 and 1.

Example: A bag holds 3 red and 5 blue marbles. The probability of drawing red is 3/(3 + 5) = 3/8. The probability of not red (blue) is 5/8, and the two complementary probabilities sum to 1.

For "and" with independent events, multiply. The probability of flipping two heads in a row is (1/2)(1/2) = 1/4. For "or" with mutually exclusive events, add: the probability of rolling a 1 or a 2 on a die is 1/6 + 1/6 = 2/6 = 1/3.

Expected value weights each outcome by its probability. If a game pays \$10 with probability 0.2 and \$0 otherwise, the expected payout is 10 * 0.2 = \$2.

Study design questions test whether conclusions are valid:
- Random sampling from a population lets you generalize results to that population; a biased or self-selected sample does not.
- Random assignment of subjects to treatment and control groups is what allows a cause-and-effect conclusion. Without random assignment, you can claim only an association, not causation.

A common SAT conclusion: an observational study (no random assignment) can show that two things are correlated but cannot prove one causes the other. Only a randomized experiment supports a causal claim. Knowing this distinction answers many "which conclusion is appropriate?" questions.`,
      examTip: `Random sampling supports generalizing to a population; random assignment supports cause-and-effect. Without random assignment, you can claim only association, not causation.`,
    },
  ],
  keyTakeaways: [
    `Mean = sum/count; recover the sum as mean times count when needed.`,
    `Outliers pull the mean but leave the median nearly unchanged.`,
    `Conditional probability restricts the denominator to the condition group.`,
    `Multiply probabilities for independent "and" events; add for mutually exclusive "or" events.`,
    `Random sampling allows generalization; only random assignment supports a causal claim.`,
  ],
},

math_advanced: {
  topicId: 'math_advanced',
  title: `Advanced Math Topics`,
  domainWeight: 'Math',
  overview: `The Advanced Math domain also includes nonlinear function behavior, function notation and transformations, and modeling with less common function types. These higher-difficulty items reward understanding how functions behave and transform, and how to read and manipulate function notation. This topic ties together skills from quadratics, polynomials, and exponentials into flexible problem solving.`,
  sections: [
    {
      id: 'am-function-notation',
      title: `1. Function Notation and Composition`,
      content: `Function notation f(x) names a rule that turns an input into an output. Reading it correctly is the first step in most Advanced Math problems.

To evaluate a function, substitute the input for x everywhere. If f(x) = x^2 - 3x + 2, then f(4) = 16 - 12 + 2 = 6. To solve f(x) = 6, set x^2 - 3x + 2 = 6, which becomes x^2 - 3x - 4 = 0, factoring to (x - 4)(x + 1) = 0, so x = 4 or x = -1.

Reading values from a graph: f(3) is the y-value where x = 3. Solving f(x) = 0 means finding the x-intercepts. A question asking "for how many values of x does f(x) = 2" is asking how many times the horizontal line y = 2 crosses the graph.

Composition applies one function to the output of another. If f(x) = 2x + 1 and g(x) = x^2, then f(g(3)) means first compute g(3) = 9, then f(9) = 2(9) + 1 = 19. Work from the inside out. Note that f(g(x)) and g(f(x)) usually differ: g(f(3)) = g(7) = 49, not 19.

The SAT also uses tables of values for f and g. To find f(g(2)) from tables, look up g(2), then feed that result into the f table. Careful, inside-out reading of composed functions prevents the most common mistakes here.`,
      examTip: `For composition f(g(x)), always work inside out: evaluate the inner function first, then apply the outer one. Order matters — f(g(x)) is usually not g(f(x)).`,
    },
    {
      id: 'am-transformations',
      title: `2. Graph Transformations`,
      content: `Transformations shift, stretch, or flip a graph in predictable ways. Knowing them lets you match equations to graphs quickly.

Starting from y = f(x):
- Vertical shift: f(x) + k moves the graph up by k (down if k is negative). y = x^2 + 3 is the parabola y = x^2 raised 3 units.
- Horizontal shift: f(x - h) moves the graph right by h (left if h is negative). Note the sign flips: f(x - 2) shifts right 2, and f(x + 2) shifts left 2. This counterintuitive rule is a frequent trap.
- Vertical stretch or compression: a*f(x) stretches away from the x-axis if a > 1 and compresses if 0 < a < 1.
- Reflection: -f(x) flips the graph over the x-axis; f(-x) flips it over the y-axis.

Example: The graph of y = (x - 3)^2 + 4 is the basic parabola y = x^2 shifted right 3 and up 4, so its vertex is at (3, 4). Reading the transformation directly gives the vertex without any calculation.

Combining transformations: y = -2(x + 1)^2 takes y = x^2, shifts it left 1, stretches it by 2, and reflects it downward, producing a downward parabola with vertex at (-1, 0). Apply the transformations in the order they act on x (inside the function first) to track the final graph.`,
      importantNote: `Horizontal shifts move opposite the sign: f(x - h) shifts right by h. This reversed direction is one of the most commonly missed transformation rules.`,
    },
    {
      id: 'am-nonlinear-models',
      title: `3. Interpreting Nonlinear Models`,
      content: `Advanced questions ask you to interpret nonlinear functions in context and to recognize which function type fits a situation.

Distinguishing model types by behavior:
- Linear: constant rate of change (adds the same amount each step).
- Quadratic: rate of change itself changes at a constant rate; graph is a parabola with one turning point. Good for projectile height, area versus a dimension, or any single-peak scenario.
- Exponential: multiplies by a constant factor each step; grows or decays ever faster. Good for populations, compound interest, and radioactive decay.

Interpreting parameters in context is a core skill. For a projectile height h = -16t^2 + 48t + 5, the constant 5 is the initial height, and the vertex gives the maximum height. The vertex is at t = -b/(2a) = -48/(2*(-16)) = 1.5 seconds; the maximum height is h(1.5) = -16(2.25) + 48(1.5) + 5 = -36 + 72 + 5 = 41.

The zeros of the model often carry meaning: for the projectile, solving h = 0 finds when it hits the ground. The y-intercept usually gives a starting value, and the vertex of a quadratic gives a maximum or minimum — the highest point, largest area, or lowest cost, depending on the scenario.

When a table is given, check whether successive values differ by a constant amount (linear), a constant second difference (quadratic), or a constant ratio (exponential). That test identifies the model type, which the SAT often asks you to choose.`,
      examTip: `Identify the model type by how values change: constant difference is linear, constant ratio is exponential. In a quadratic model, the vertex is the maximum or minimum the question usually wants.`,
    },
  ],
  keyTakeaways: [
    `Evaluate f(a) by substituting a for every x; work composition inside out.`,
    `f(x) + k shifts vertically; f(x - h) shifts right by h (opposite the sign).`,
    `-f(x) reflects over the x-axis; f(-x) reflects over the y-axis.`,
    `Linear adds a constant, exponential multiplies by a constant, quadratic has one turning point.`,
    `In a quadratic model, the vertex gives the maximum or minimum value in context.`,
  ],
},

};

export function getSATCourseContent(topicId: string): TopicLesson | null {
  return SAT_COURSE[topicId] ?? null;
}

export function hasSATCourseContent(topicId: string): boolean {
  return topicId in SAT_COURSE;
}
