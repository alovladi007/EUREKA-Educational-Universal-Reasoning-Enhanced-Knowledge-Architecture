/**
 * LSAT Question Bank — original questions for the current LSAT format
 * (post Aug 2024: 2× Logical Reasoning + 1× Reading Comprehension, no Logic Games).
 *
 * All stimuli are ORIGINAL — no disclosed PrepTest content is reproduced.
 * AI-generated. Requires SME review.
 */

export interface LSATQuestion {
  id: string;
  topicId: number;     // 0 = Logical Reasoning, 1 = Reading Comprehension
  subtopic: string;    // matches an id from lsat-frequency.ts
  difficulty: number;  // 1 = easy, 2 = medium, 3 = hard
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const TOPIC_ID_MAP: Record<number, string> = {
  0: 'logical_reasoning',
  1: 'reading_comprehension',
};

export function getLSATTopicSectionId(numericId: number): string {
  return TOPIC_ID_MAP[numericId] ?? 'logical_reasoning';
}

export const LSAT_QUESTIONS: LSATQuestion[] = [
  // ============================================================
  // TOPIC 0 — LOGICAL REASONING (140 questions)
  // ============================================================

  // --- lr_strengthen (17) ---
  {
    id: 'lsat_t0_001',
    topicId: 0,
    subtopic: 'lr_strengthen',
    difficulty: 1,
    question: `A city council member argues that installing protected bike lanes on Main Street will reduce the rate of cycling injuries downtown, because in three nearby cities that installed protected lanes, cycling injuries dropped by an average of 30 percent within two years.

Which of the following, if true, most strengthens the council member's argument?`,
    options: [
      `The three nearby cities had previously launched public-awareness campaigns about cyclist safety.`,
      `Downtown Main Street has traffic patterns and cyclist volumes very similar to the corresponding streets in the three comparison cities.`,
      `Protected bike lanes have been shown to increase the number of cyclists overall.`,
      `Most cycling injuries downtown occur on streets other than Main Street.`,
      `The cost of installing protected bike lanes has fallen significantly over the past five years.`,
    ],
    correct: 1,
    explanation: `Strengthen by analogy: the argument relies on the comparison cities being relevantly similar. (B) confirms that similarity, closing the gap. (A) introduces an alternate cause for the 30 percent drop, which actually weakens. (C) is irrelevant or could even cut against the conclusion (more riders, more exposure). (D) is out of scope. (E) addresses cost, not injury rates.`,
  },
  {
    id: 'lsat_t0_002',
    topicId: 0,
    subtopic: 'lr_strengthen',
    difficulty: 1,
    question: `Nutritionist: People who drink at least two cups of green tea per day report fewer afternoon energy crashes than people who drink none. Therefore, drinking green tea helps prevent afternoon energy crashes.

Which one of the following, if true, most strengthens the nutritionist's argument?`,
    options: [
      `Green tea contains compounds known to moderate the release of caffeine into the bloodstream.`,
      `People who drink green tea are also more likely to eat balanced lunches.`,
      `Black tea drinkers also report fewer energy crashes than non-tea drinkers.`,
      `Some energy crashes are caused by poor sleep rather than diet.`,
      `Green tea is widely available in most supermarkets.`,
    ],
    correct: 0,
    explanation: `Correct answer supplies a causal mechanism connecting green tea to steadier energy. (B) introduces a confounding cause (better lunches) — that weakens. (C) is irrelevant: another beverage doing the same thing does not strengthen the green-tea-specific claim. (D) is out of scope. (E) is irrelevant to causation.`,
  },
  {
    id: 'lsat_t0_003',
    topicId: 0,
    subtopic: 'lr_strengthen',
    difficulty: 2,
    question: `Editor: Our magazine's online articles that include at least one infographic receive, on average, 40 percent more shares on social media than articles without infographics. We should therefore require every online article to include at least one infographic, in order to increase total shares.

Which of the following, if true, most strengthens the editor's recommendation?`,
    options: [
      `Articles that already contained infographics tended to be about visually rich subjects such as travel and food.`,
      `In a controlled pilot, articles randomly assigned to receive an added infographic outperformed matched articles without one by a similar margin.`,
      `The magazine's print edition has seen a decline in subscriptions over the past three years.`,
      `Some readers find infographics distracting when they appear mid-article.`,
      `Producing high-quality infographics requires additional staff time.`,
    ],
    correct: 1,
    explanation: `(B) is a controlled comparison that rules out the obvious confound — namely, that visually rich topics both invite infographics and earn more shares anyway. (A) actually weakens by surfacing that confound. (C) is irrelevant (print). (D) and (E) raise costs but do not bear on whether adding infographics causes more shares.`,
  },
  {
    id: 'lsat_t0_004',
    topicId: 0,
    subtopic: 'lr_strengthen',
    difficulty: 2,
    question: `Historian: The decline of the Western Roman Empire's coinage purity in the third century was a major cause of the empire's economic instability, since merchants increasingly refused to accept debased coins at face value, disrupting trade.

Which one of the following, if true, most strengthens the historian's argument?`,
    options: [
      `Coinage purity in the Eastern Empire also declined during the third century.`,
      `Surviving merchant ledgers from the period show a sharp rise in barter transactions tracking the timing of major debasements.`,
      `The Roman state continued to demand tax payments in coin throughout the third century.`,
      `Some emperors briefly restored coinage purity but were quickly overthrown.`,
      `Modern historians disagree about the exact silver content of third-century coins.`,
    ],
    correct: 1,
    explanation: `(B) supplies the missing causal link: merchant behavior shifted in step with debasements. (A) is irrelevant — the conclusion concerns the West. (C) and (D) are tangential. (E) is a methodological aside that neither strengthens nor weakens.`,
  },
  {
    id: 'lsat_t0_005',
    topicId: 0,
    subtopic: 'lr_strengthen',
    difficulty: 2,
    question: `A pharmaceutical executive claims that her company's new migraine drug is more effective than the leading competitor because in the company's recent trial, 70 percent of patients reported relief within two hours, compared with 55 percent for the competitor.

Which of the following, if true, most strengthens the executive's claim?`,
    options: [
      `The trial was conducted by an independent research organization that randomized patients between the two drugs.`,
      `The company has had a strong year of overall revenue growth.`,
      `Some patients in the trial reported mild nausea as a side effect.`,
      `The competitor's drug has been on the market for over a decade.`,
      `Migraine severity varies considerably across patients.`,
    ],
    correct: 0,
    explanation: `(A) defuses the obvious bias worry (a company's own trial of its own drug) and supports apples-to-apples comparison. (B) is irrelevant. (C) is a tangential side-effect note. (D) is irrelevant. (E) actually nudges toward weakening, since variability without controls invites confounding.`,
  },
  {
    id: 'lsat_t0_006',
    topicId: 0,
    subtopic: 'lr_strengthen',
    difficulty: 1,
    question: `Conservationist: Reintroducing beavers to a watershed increases the abundance of native amphibians, because the dams beavers build create slow-moving pools that amphibians require for breeding.

Which one of the following, if true, most strengthens the conservationist's argument?`,
    options: [
      `Beavers also create habitat for some waterfowl species.`,
      `In watersheds where beavers were reintroduced, amphibian populations rose substantially within five years, while populations in similar watersheds without reintroduction did not change.`,
      `Some amphibian species are listed as threatened.`,
      `Beavers are native to most North American watersheds.`,
      `Amphibians are sensitive to water pollution.`,
    ],
    correct: 1,
    explanation: `(B) is a strong before/after comparison with a control. (A) is off-topic (waterfowl). (C), (D), and (E) provide context but no causal evidence linking beaver reintroduction to amphibian gains.`,
  },
  {
    id: 'lsat_t0_007',
    topicId: 0,
    subtopic: 'lr_strengthen',
    difficulty: 3,
    question: `Economist: A higher minimum wage does not reduce overall employment in low-wage industries, because in cities that have raised their minimum wage in the past five years, total employment in restaurants and retail has continued to grow at roughly the national rate.

Which of the following, if true, most strengthens the economist's argument?`,
    options: [
      `Cities that raised their minimum wage tended to be experiencing especially strong economic growth at the time of the increase.`,
      `Restaurants in those cities did not reduce employee hours in the months following the wage increase.`,
      `Detailed payroll studies controlling for local economic conditions show employment in low-wage industries grew at the same rate in cities that raised the wage as in matched cities that did not.`,
      `Some economists believe minimum wage research is methodologically difficult.`,
      `Many workers in low-wage industries receive tips in addition to wages.`,
    ],
    correct: 2,
    explanation: `(C) controls for the most damaging confound — that the cities raising the wage were already booming — by matching them with similar cities. (A) is the confound itself and weakens. (B) addresses hours, a side-issue. (D) is a hedge. (E) is irrelevant.`,
  },
  {
    id: 'lsat_t0_008',
    topicId: 0,
    subtopic: 'lr_strengthen',
    difficulty: 2,
    question: `Critic: This new film must be excellent, because it has received favorable reviews from three of the four major national film critics.

Which one of the following, if true, most strengthens the critic's reasoning?`,
    options: [
      `The four major national film critics rarely agree with one another.`,
      `The fourth critic explained that her negative review reflected a personal dislike of the director, not the film's quality.`,
      `Two of the three favorable reviews were syndicated to many smaller publications.`,
      `The film recouped its production budget within its opening weekend.`,
      `Online viewer ratings for the film are mixed.`,
    ],
    correct: 1,
    explanation: `If the lone dissenter is biased on grounds unrelated to film quality, the underlying signal from the other three becomes stronger. (A) cuts both ways but mostly weakens — if they rarely agree, three agreeing is unusual, yet this does not directly bolster the inference about quality. (C) speaks to reach, not quality. (D) confuses box-office with quality. (E) weakens.`,
  },
  {
    id: 'lsat_t0_009',
    topicId: 0,
    subtopic: 'lr_strengthen',
    difficulty: 2,
    question: `Researcher: A diet rich in leafy greens slows age-related cognitive decline. In a multi-year study, adults over 60 who ate at least one serving of leafy greens per day scored significantly higher on cognitive tests than peers who ate fewer than one serving per week.

Which of the following, if true, most strengthens the researcher's argument?`,
    options: [
      `Leafy greens are widely recommended by dietitians.`,
      `When researchers statistically controlled for education, exercise, and other dietary factors, the cognitive difference between the two groups remained large.`,
      `Some participants ate more than one serving per day.`,
      `Cognitive tests vary in their sensitivity to age-related decline.`,
      `Other studies have examined fruits and cognition.`,
    ],
    correct: 1,
    explanation: `(B) removes the leading alternative explanations — confounding by education, exercise, or other diet — and the effect survives. The rest are filler or methodological asides that do not bear on causation.`,
  },
  {
    id: 'lsat_t0_010',
    topicId: 0,
    subtopic: 'lr_strengthen',
    difficulty: 2,
    question: `City planner: Building a new pedestrian bridge over the river will increase foot traffic to the historic district, because shops there have struggled since the only nearby crossing was closed for repairs last year.

Which of the following, if true, most strengthens the planner's argument?`,
    options: [
      `Shops in the historic district reported a 30 percent drop in foot traffic in the month after the old crossing closed, with no other significant changes in the area at that time.`,
      `The historic district contains several restaurants in addition to shops.`,
      `Pedestrian bridges in other cities are popular tourist attractions.`,
      `The proposed bridge would be wider than the closed crossing.`,
      `Some residents have proposed naming the bridge after a local figure.`,
    ],
    correct: 0,
    explanation: `(A) ties the closure causally to the traffic drop with strong timing evidence, supporting the inference that restoring a crossing will reverse it. (B), (C), (D), and (E) are tangential.`,
  },
  {
    id: 'lsat_t0_011',
    topicId: 0,
    subtopic: 'lr_strengthen',
    difficulty: 1,
    question: `Coach: Our team's free-throw percentage has improved dramatically since we hired the new shooting coach last fall. Therefore, the new shooting coach is responsible for the improvement.

Which one of the following, if true, most strengthens the coach's argument?`,
    options: [
      `The team's free-throw percentage was steady for three years prior to the new coach's arrival.`,
      `The team has won more games this season than last.`,
      `Several players have publicly praised the new coach.`,
      `The previous shooting coach retired voluntarily.`,
      `Free-throw percentage tends to vary across the league.`,
    ],
    correct: 0,
    explanation: `(A) rules out a pre-existing trend — making the post-hire jump more attributable to the coach. (B) is broader team success, not specifically free throws. (C) is praise, not evidence of causation. (D) and (E) are background.`,
  },
  {
    id: 'lsat_t0_012',
    topicId: 0,
    subtopic: 'lr_strengthen',
    difficulty: 2,
    question: `Astronomer: The newly discovered exoplanet must be capable of supporting liquid water, because it orbits its star at a distance within the star's habitable zone.

Which of the following, if true, most strengthens the astronomer's argument?`,
    options: [
      `Spectroscopic data suggest the planet has a substantial atmosphere with surface pressure high enough to permit liquid water.`,
      `The star is similar in mass to the Sun.`,
      `The planet was discovered using the transit method.`,
      `Other planets have been found in the same star system.`,
      `The habitable zone of a star shifts slowly over geological time.`,
    ],
    correct: 0,
    explanation: `Being in the habitable zone is necessary, not sufficient — without an atmosphere, water would not be stable as a liquid. (A) supplies the missing piece. (B) and (C) are background. (D) is irrelevant. (E) is a complication that does not strengthen.`,
  },
  {
    id: 'lsat_t0_013',
    topicId: 0,
    subtopic: 'lr_strengthen',
    difficulty: 2,
    question: `Public health official: Mandating helmet use for cyclists in our city would reduce serious head injuries. Studies in three comparable cities found that helmet mandates reduced the rate of serious cycling head injuries by at least 25 percent.

Which one of the following, if true, most strengthens the official's argument?`,
    options: [
      `Helmet ownership in this city is currently low and comparable to pre-mandate levels in the three studied cities.`,
      `Some cyclists in this city already wear helmets voluntarily.`,
      `Bicycles in this city are sold in many shops.`,
      `Helmets in the studies were standard commercial models, not specialized racing helmets.`,
      `The three studied cities are in different countries.`,
    ],
    correct: 0,
    explanation: `(A) confirms a parallel starting condition, so the mandate has comparable headroom to work. (B) actually weakens — if many already wear helmets, the mandate's marginal effect shrinks. (D) is descriptive but does not strengthen the comparability case. (C) and (E) are irrelevant or weakly relevant.`,
  },
  {
    id: 'lsat_t0_014',
    topicId: 0,
    subtopic: 'lr_strengthen',
    difficulty: 3,
    question: `Music historian: Beethoven's late string quartets were primarily an expression of his philosophical, rather than personal, preoccupations. Although his hearing loss had become severe by the time he composed them, the works show no thematic engagement with deafness or isolation.

Which of the following, if true, most strengthens the historian's argument?`,
    options: [
      `Beethoven's late string quartets are widely admired today.`,
      `In letters from the same period, Beethoven described his quartets as attempts to render abstract metaphysical ideas in sound.`,
      `Beethoven composed several other works during the same period.`,
      `Some scholars argue that all of Beethoven's late works reflect his deafness.`,
      `Beethoven received income from the patrons who commissioned the quartets.`,
    ],
    correct: 1,
    explanation: `(B) directly aligns the composer's own stated intent with the historian's interpretation. (A) is reception, not authorial intent. (C) is irrelevant. (D) is a counter-position, which weakens. (E) is unrelated to subject matter.`,
  },
  {
    id: 'lsat_t0_015',
    topicId: 0,
    subtopic: 'lr_strengthen',
    difficulty: 2,
    question: `Manager: Our customer service center should adopt the new ticketing software. Two of our competitors that adopted it last year reported faster average response times within six months.

Which one of the following, if true, most strengthens the manager's argument?`,
    options: [
      `The two competitors had ticketing volumes and staffing levels comparable to ours.`,
      `The new software comes in several tiered pricing plans.`,
      `Some employees are skeptical of changing systems.`,
      `Customer satisfaction is influenced by many factors.`,
      `The new software has a modern user interface.`,
    ],
    correct: 0,
    explanation: `(A) shores up the analogy. (B) is pricing, not effectiveness. (C) weakens by raising adoption friction. (D) is a hedge. (E) is aesthetic.`,
  },
  {
    id: 'lsat_t0_016',
    topicId: 0,
    subtopic: 'lr_strengthen',
    difficulty: 2,
    question: `Biologist: Birds that feed at backyard feeders develop more diverse gut microbiomes than birds of the same species that do not. The supplemental feeding therefore enhances microbiome diversity.

Which of the following, if true, most strengthens the biologist's argument?`,
    options: [
      `Birds that visit feeders also consume natural food sources.`,
      `When researchers experimentally placed feeders in random subsets of woodland sites, birds in feeder sites developed more diverse microbiomes within a single season.`,
      `Microbiome diversity is associated with bird health.`,
      `Backyard birdwatching is increasingly popular.`,
      `Some feeder foods contain seeds not native to the region.`,
    ],
    correct: 1,
    explanation: `(B) is randomized intervention evidence — the cleanest support for the causal claim. (A) actually complicates the picture. (C) is true but addresses consequences, not the causal mechanism. (D) is irrelevant. (E) could weaken (non-native seeds may have other effects).`,
  },
  {
    id: 'lsat_t0_017',
    topicId: 0,
    subtopic: 'lr_strengthen',
    difficulty: 3,
    question: `Philosopher: Moral progress within a society is best measured not by changes in stated values but by changes in how the society treats those with the least power. Even societies that loudly proclaim equality may, on this measure, regress.

Which of the following, if true, most strengthens the philosopher's argument?`,
    options: [
      `Most societies have written constitutions affirming the equality of citizens.`,
      `Studies of historical reform movements show that proclaimed values frequently fail to predict changes in conditions for marginalized groups, while concrete protections for those groups strongly predict broader social improvements.`,
      `Defining "least power" is contested among political theorists.`,
      `Many societies celebrate annual holidays commemorating equality.`,
      `Some philosophers argue moral progress cannot be measured at all.`,
    ],
    correct: 1,
    explanation: `(B) is direct empirical support: stated values poorly predict change; treatment of the marginalized does. (A) and (D) are surface signals — the very kind the philosopher distrusts. (C) is a definitional caveat. (E) is a counterposition that weakens.`,
  },

  // --- lr_weaken (14) ---
  {
    id: 'lsat_t0_018',
    topicId: 0,
    subtopic: 'lr_weaken',
    difficulty: 1,
    question: `Doctor: Patients who exercise at least three times a week have lower rates of cardiovascular disease than patients who do not. Exercise must therefore prevent cardiovascular disease.

Which of the following, if true, most weakens the doctor's argument?`,
    options: [
      `Patients who exercise frequently also tend to follow healthier diets overall.`,
      `Cardiovascular disease has a strong genetic component.`,
      `Some forms of exercise are safer than others.`,
      `Many gyms have seen increased membership over the past decade.`,
      `Cardiovascular disease can develop slowly over many years.`,
    ],
    correct: 0,
    explanation: `(A) provides an alternative cause (diet) that may explain the correlation, weakening the causal inference. (B) and (E) are background. (C) is a safety remark. (D) is irrelevant.`,
  },
  {
    id: 'lsat_t0_019',
    topicId: 0,
    subtopic: 'lr_weaken',
    difficulty: 1,
    question: `Retail manager: Sales of our chocolate bars rose sharply after we redesigned the wrapper. The new wrapper must be responsible for the sales increase.

Which one of the following, if true, most weakens the manager's argument?`,
    options: [
      `The wrapper redesign was inexpensive.`,
      `A nationwide advertising campaign for the chocolate bars ran during the same period.`,
      `Some customers preferred the previous wrapper.`,
      `The store sells many other candy products.`,
      `Sales of competing chocolate bars fell slightly.`,
    ],
    correct: 1,
    explanation: `(B) introduces an alternative cause that plausibly explains the spike. (A) is about cost. (C) is mild preference data. (D) is irrelevant. (E) is consistent with either explanation.`,
  },
  {
    id: 'lsat_t0_020',
    topicId: 0,
    subtopic: 'lr_weaken',
    difficulty: 2,
    question: `Critic: Television viewing causes children to perform worse in school. A recent survey found that children who watch more than three hours of television per day have lower grades than children who watch less.

Which of the following, if true, most weakens the critic's argument?`,
    options: [
      `Many children watch educational programming.`,
      `Children with learning difficulties or unstable home environments are more likely to watch large amounts of television, independent of grades.`,
      `Schools encourage children to read in addition to watching television.`,
      `Television sets are common in households across income levels.`,
      `Some children watch television only on weekends.`,
    ],
    correct: 1,
    explanation: `(B) is the classic reverse-causation/confound move: an underlying factor drives both heavy TV and low grades. (A), (C), (D), and (E) are tangential.`,
  },
  {
    id: 'lsat_t0_021',
    topicId: 0,
    subtopic: 'lr_weaken',
    difficulty: 2,
    question: `Politician: We must build more highways. Traffic congestion has worsened every year for the past decade in our state, even though we have not expanded highway capacity.

Which of the following, if true, most weakens the politician's argument?`,
    options: [
      `Studies in comparable states show that adding highway capacity tends to be followed by increases in driving that fully consume the new capacity within a few years.`,
      `Public transit ridership has remained roughly steady.`,
      `Highway construction creates short-term jobs.`,
      `Some highways in the state are over forty years old.`,
      `The state has experienced moderate population growth.`,
    ],
    correct: 0,
    explanation: `(A) is "induced demand": new capacity invites more driving, undoing the relief. (B), (D), and (E) are background. (C) is a side-benefit, not a counter.`,
  },
  {
    id: 'lsat_t0_022',
    topicId: 0,
    subtopic: 'lr_weaken',
    difficulty: 2,
    question: `Marketing director: We should reduce our investment in print advertising and shift those funds online. Our online ads generate twice as many clicks per dollar as our print ads generate readers.

Which one of the following, if true, most weakens the marketing director's argument?`,
    options: [
      `Online ads are easier to update than print ads.`,
      `Most clicks on online ads do not result in purchases, while print readers are several times more likely than online clickers to become paying customers.`,
      `Print advertising rates have risen modestly over the last five years.`,
      `Some employees prefer to work in digital design.`,
      `Online ad platforms provide detailed analytics dashboards.`,
    ],
    correct: 1,
    explanation: `(B) shows clicks-per-dollar is the wrong metric — conversion matters. (A), (D), (E) are tangential. (C) supports the shift, weakening the wrong way.`,
  },
  {
    id: 'lsat_t0_023',
    topicId: 0,
    subtopic: 'lr_weaken',
    difficulty: 2,
    question: `Researcher: Drinking coffee increases longevity, because in a large study, adults who drank three or more cups per day had a 15 percent lower mortality rate over ten years than non-coffee drinkers.

Which of the following, if true, most weakens the researcher's argument?`,
    options: [
      `Many participants drank their coffee with sugar.`,
      `Participants who chose to drink coffee were significantly less likely to smoke and had higher average household incomes than non-coffee drinkers.`,
      `The study was conducted in a single country.`,
      `Coffee contains compounds besides caffeine.`,
      `Some participants drank decaf.`,
    ],
    correct: 1,
    explanation: `(B) supplies powerful confounders — both protective. Without controlling for them, the longevity gap may have nothing to do with coffee. (A), (C), (D), and (E) are tangential.`,
  },
  {
    id: 'lsat_t0_024',
    topicId: 0,
    subtopic: 'lr_weaken',
    difficulty: 2,
    question: `Editor: Our newspaper's switch to a paywall last year caused our subscription revenue to rise by 18 percent. We should now make the paywall stricter to drive revenue even higher.

Which one of the following, if true, most weakens the editor's recommendation?`,
    options: [
      `Other newspapers have implemented paywalls.`,
      `The paywall was launched on the same day a major regional competitor abruptly shut down, sending many of its former readers to seek paid subscriptions.`,
      `Some subscribers occasionally complain about the paywall.`,
      `Print subscription revenue has held steady.`,
      `The newspaper's website was redesigned last year.`,
    ],
    correct: 1,
    explanation: `(B) provides an alternative cause for the revenue jump that has nothing to do with the paywall design itself. (E) is a candidate alternative but vague. (A), (C), (D) are weak.`,
  },
  {
    id: 'lsat_t0_025',
    topicId: 0,
    subtopic: 'lr_weaken',
    difficulty: 3,
    question: `Sociologist: Cities with more public parks have lower crime rates. Therefore, building more public parks would reduce crime.

Which of the following, if true, most weakens the sociologist's argument?`,
    options: [
      `Cities with more public parks also tend to have higher municipal budgets, more police officers per capita, and more after-school programs.`,
      `Some public parks are larger than others.`,
      `Crime rates have fallen nationally over the past two decades.`,
      `Most residents support the construction of new parks.`,
      `Parks attract visitors from outside the city.`,
    ],
    correct: 0,
    explanation: `(A) is the textbook confounding bundle — wealth and services may drive both park provision and lower crime. The other options are tangential.`,
  },
  {
    id: 'lsat_t0_026',
    topicId: 0,
    subtopic: 'lr_weaken',
    difficulty: 2,
    question: `Recruiter: Applicants who include a hand-written cover letter are more likely to receive an offer than those who submit only a typed letter. Therefore, candidates should submit hand-written cover letters.

Which one of the following, if true, most weakens the recruiter's recommendation?`,
    options: [
      `Hand-written cover letters take longer to write than typed letters.`,
      `Applicants who submit hand-written cover letters are overwhelmingly applying for highly specialized positions in which most candidates are already top performers, and where almost everyone who applies receives an offer.`,
      `Some employers do not accept hand-written documents.`,
      `Pens and stationery are widely available.`,
      `Hand-written letters can be difficult to file digitally.`,
    ],
    correct: 1,
    explanation: `(B) shows the correlation is driven by selection effects — the pool itself, not the format, explains offers. (A), (C), (D), (E) are weak.`,
  },
  {
    id: 'lsat_t0_027',
    topicId: 0,
    subtopic: 'lr_weaken',
    difficulty: 2,
    question: `Engineer: The new bridge design must be safer than the old one, because in computer simulations the new design withstood loads 40 percent higher than the old design's rated capacity.

Which of the following, if true, most weakens the engineer's argument?`,
    options: [
      `The simulations modeled only static loads, not the dynamic and resonant loads that account for nearly all real-world bridge failures.`,
      `The new design is slightly more expensive to build.`,
      `Computer simulations are widely used in modern engineering.`,
      `The old design has been in service for over thirty years.`,
      `The bridge will be inspected annually after construction.`,
    ],
    correct: 0,
    explanation: `(A) reveals that the strongest test left out the most relevant failure mode — the simulation is not informative for actual safety. The others are tangential.`,
  },
  {
    id: 'lsat_t0_028',
    topicId: 0,
    subtopic: 'lr_weaken',
    difficulty: 2,
    question: `Restaurant owner: Customers who order our signature dish tend to leave higher tips than other customers. Therefore, training the kitchen to push the signature dish on every table would raise the restaurant's average tip percentage.

Which of the following, if true, most weakens the owner's argument?`,
    options: [
      `Servers occasionally forget to mention the signature dish.`,
      `Customers who order the signature dish are predominantly regulars who are generous tippers regardless of what they order.`,
      `The signature dish takes longer to prepare than most menu items.`,
      `Some kitchens specialize in only a few dishes.`,
      `Tipping norms vary by region.`,
    ],
    correct: 1,
    explanation: `(B) shows the correlation is driven by who orders, not what they order — pushing the dish on new tables would not transfer the tipping behavior. The others are tangential.`,
  },
  {
    id: 'lsat_t0_029',
    topicId: 0,
    subtopic: 'lr_weaken',
    difficulty: 3,
    question: `Education researcher: Smaller class sizes improve student outcomes. In a recent study, schools with average class sizes below 20 showed higher standardized test scores than schools with average class sizes above 30.

Which one of the following, if true, most weakens the researcher's argument?`,
    options: [
      `The schools with smaller average class sizes were located almost exclusively in wealthier districts with substantially greater per-pupil funding and more experienced teachers.`,
      `Test scores fluctuate from year to year.`,
      `Some teachers prefer smaller classes.`,
      `Standardized testing has been controversial.`,
      `The study measured only mathematics scores.`,
    ],
    correct: 0,
    explanation: `(A) supplies a thick bundle of confounds: funding and teacher experience plausibly drive scores. The others are tangential.`,
  },
  {
    id: 'lsat_t0_030',
    topicId: 0,
    subtopic: 'lr_weaken',
    difficulty: 1,
    question: `Bookstore owner: Our weekly author talks must be driving sales, because monthly revenue is higher in months with at least one author talk than in months without.

Which of the following, if true, most weakens the owner's argument?`,
    options: [
      `Author talks are scheduled to coincide with major book releases, which independently drive substantial spikes in monthly sales.`,
      `The bookstore has loyal long-time customers.`,
      `Author talks are usually held in the evening.`,
      `Many customers browse without buying.`,
      `Some authors decline invitations.`,
    ],
    correct: 0,
    explanation: `(A) is the alternative cause — release months would have driven revenue regardless of talks. The others are tangential.`,
  },
  {
    id: 'lsat_t0_031',
    topicId: 0,
    subtopic: 'lr_weaken',
    difficulty: 2,
    question: `Animal trainer: My training method must be more effective than my competitor's. In trials, dogs trained with my method learned five basic commands an average of two weeks faster than dogs trained with my competitor's method.

Which of the following, if true, most weakens the trainer's argument?`,
    options: [
      `The trainer's trials used purebred herding dogs known for fast learning, while the competitor's trials used a mix of breeds, some not known for trainability.`,
      `The trainer charges slightly more than the competitor.`,
      `Most dog owners eventually train multiple commands.`,
      `Some commands are harder to teach than others.`,
      `Training equipment varies in price.`,
    ],
    correct: 0,
    explanation: `(A) makes the comparison apples-to-oranges. The others are tangential.`,
  },

  // --- lr_necessary_assumption (14) ---
  {
    id: 'lsat_t0_032',
    topicId: 0,
    subtopic: 'lr_necessary_assumption',
    difficulty: 1,
    question: `Consultant: Switching our office to LED lighting will save the company money. The new bulbs use 60 percent less electricity than the bulbs we currently use.

Which of the following is an assumption required by the consultant's argument?`,
    options: [
      `LED bulbs last longer than incandescent bulbs.`,
      `The savings from reduced electricity use will not be offset by the cost of purchasing and installing the new bulbs.`,
      `LED lighting is widely available.`,
      `Employees prefer brighter offices.`,
      `Electricity rates will rise in the future.`,
    ],
    correct: 1,
    explanation: `Negate (B): if savings are offset, the argument collapses. (A), (C), (D), (E) are not required — the argument can survive without them.`,
  },
  {
    id: 'lsat_t0_033',
    topicId: 0,
    subtopic: 'lr_necessary_assumption',
    difficulty: 1,
    question: `Editor: This manuscript should not be published, because it contains numerous factual errors that the author refuses to correct.

Which one of the following is an assumption required by the editor's argument?`,
    options: [
      `Every manuscript with factual errors is poorly written.`,
      `A manuscript that contains numerous uncorrected factual errors should not be published.`,
      `The author is unwilling to discuss the manuscript further.`,
      `All published manuscripts are error-free.`,
      `Editors are responsible for proofreading.`,
    ],
    correct: 1,
    explanation: `(B) is the bridge from the premise to the conclusion. (A) is too strong. (D) is too strong (over-promise). (C) and (E) are tangential.`,
  },
  {
    id: 'lsat_t0_034',
    topicId: 0,
    subtopic: 'lr_necessary_assumption',
    difficulty: 2,
    question: `Trainer: My new fitness program will help our recruits pass the physical exam, because the program improves cardiovascular endurance more rapidly than the standard program.

Which of the following is an assumption required by the trainer's argument?`,
    options: [
      `The physical exam tests cardiovascular endurance, at least in part.`,
      `The standard program has been used for many years.`,
      `Recruits enjoy the new program.`,
      `Cardiovascular endurance is the only factor in fitness.`,
      `All recruits begin in poor shape.`,
    ],
    correct: 0,
    explanation: `Negate (A) — if the exam does not test endurance, faster endurance gains do not help. (D) is too strong; the argument needs endurance to matter, not to be the only thing. (B), (C), (E) are not required.`,
  },
  {
    id: 'lsat_t0_035',
    topicId: 0,
    subtopic: 'lr_necessary_assumption',
    difficulty: 2,
    question: `Engineer: Adding solar panels to our warehouse roof will reduce our facility's energy costs. The panels will generate at least 30 percent of the warehouse's annual energy consumption.

Which one of the following is an assumption required by the engineer's argument?`,
    options: [
      `Solar technology has improved in recent years.`,
      `The cost of installing and maintaining the panels will not exceed the value of the energy they generate over the panels' lifetime.`,
      `The warehouse roof is in good condition.`,
      `Solar panels are environmentally friendly.`,
      `Energy prices will increase.`,
    ],
    correct: 1,
    explanation: `Negate (B): if costs exceed savings, the conclusion fails. (A), (C), (D), (E) are not strictly required.`,
  },
  {
    id: 'lsat_t0_036',
    topicId: 0,
    subtopic: 'lr_necessary_assumption',
    difficulty: 2,
    question: `Critic: The novel cannot be considered great literature, because it relies on stock characters and avoids serious moral questions.

Which of the following is an assumption required by the critic's argument?`,
    options: [
      `Great literature must engage with serious moral questions or avoid stock characters.`,
      `Every novel that contains stock characters fails as literature.`,
      `Most readers prefer original characters.`,
      `Moral questions are the only subject of great literature.`,
      `The novel sold poorly.`,
    ],
    correct: 0,
    explanation: `(A) is a minimal bridge — at least one of the listed conditions disqualifies the work. (B) is too strong (a universal). (D) is too strong. (C) and (E) are tangential.`,
  },
  {
    id: 'lsat_t0_037',
    topicId: 0,
    subtopic: 'lr_necessary_assumption',
    difficulty: 2,
    question: `Coach: We should hire Maria as our pitching coach. Three teams she has coached previously had winning seasons.

Which of the following is an assumption required by the coach's argument?`,
    options: [
      `Maria's coaching contributed to at least some of those teams' winning records.`,
      `Maria has coached only three teams in her career.`,
      `No other candidate has more experience than Maria.`,
      `Maria is willing to relocate.`,
      `Pitching is the most important aspect of baseball.`,
    ],
    correct: 0,
    explanation: `Negate (A): if she contributed nothing, her record is empty noise. The argument minimally requires that her past success was at least partly her doing. The other options are not strictly required.`,
  },
  {
    id: 'lsat_t0_038',
    topicId: 0,
    subtopic: 'lr_necessary_assumption',
    difficulty: 1,
    question: `Parent: Our son needs more sleep. Recently he has been irritable in the morning and has had difficulty focusing on schoolwork.

Which one of the following is an assumption required by the parent's argument?`,
    options: [
      `Insufficient sleep can plausibly contribute to morning irritability or difficulty focusing.`,
      `Children require ten hours of sleep per night.`,
      `Their son enjoys school.`,
      `Most children are irritable in the morning.`,
      `Their son's symptoms are visible to teachers.`,
    ],
    correct: 0,
    explanation: `Without (A), the symptoms have no plausible link to sleep. (B) is too strong (specific number). (C), (D), (E) are tangential.`,
  },
  {
    id: 'lsat_t0_039',
    topicId: 0,
    subtopic: 'lr_necessary_assumption',
    difficulty: 2,
    question: `Investor: This start-up is a sound investment. Its product addresses a large unmet market need, and its founders have technical expertise in the relevant field.

Which of the following is an assumption required by the investor's argument?`,
    options: [
      `Addressing a large unmet need and having technically expert founders are at least sometimes sufficient indicators of a sound investment.`,
      `The start-up will become the largest in its industry.`,
      `The founders have never failed before.`,
      `Investing always involves some risk.`,
      `The start-up's product has no competitors.`,
    ],
    correct: 0,
    explanation: `Negate (A) — if those indicators never matter, the conclusion has no support. (B), (C), (E) are too strong. (D) is tangential.`,
  },
  {
    id: 'lsat_t0_040',
    topicId: 0,
    subtopic: 'lr_necessary_assumption',
    difficulty: 2,
    question: `Architect: Our city should not approve the proposed skyscraper. The building's reflective glass would significantly increase glare in neighboring residential areas.

Which one of the following is an assumption required by the architect's argument?`,
    options: [
      `Significantly increasing glare in neighboring residential areas is a sufficient ground to deny approval, absent overriding considerations.`,
      `The proposed building is the tallest ever planned for the city.`,
      `Reflective glass cannot be modified after construction.`,
      `All residential areas should have low glare.`,
      `The city has never approved a reflective-glass building before.`,
    ],
    correct: 0,
    explanation: `(A) connects the harm to the recommendation. (B), (C), (E) are not required. (D) is too strong.`,
  },
  {
    id: 'lsat_t0_041',
    topicId: 0,
    subtopic: 'lr_necessary_assumption',
    difficulty: 2,
    question: `Botanist: The newly discovered fern species is unlikely to survive long in the wild. It depends on a particular fungus for nutrient uptake, and that fungus is found in only one small region.

Which of the following is an assumption required by the botanist's argument?`,
    options: [
      `The fern cannot reliably obtain its nutrients from another source within the small region.`,
      `The fungus is the most important component of forest ecosystems.`,
      `The fern has been studied by other botanists.`,
      `Most fern species are widespread.`,
      `The small region is protected by law.`,
    ],
    correct: 0,
    explanation: `Actually we need the dependence to threaten survival. (A) Negate: if the fern can get nutrients elsewhere within the same region, the dependence becomes unproblematic, and the argument needs survival to be at risk specifically due to this dependence — so the assumption is that no easy substitute exists. (B), (C), (D), (E) are not required.`,
  },
  {
    id: 'lsat_t0_042',
    topicId: 0,
    subtopic: 'lr_necessary_assumption',
    difficulty: 3,
    question: `Philosopher: A moral theory worth taking seriously must offer guidance in real situations. Pure consequentialism fails this test, because in practice no one can reliably calculate the long-term consequences of their actions.

Which of the following is an assumption required by the philosopher's argument?`,
    options: [
      `A theory that requires calculations no one can reliably perform fails to offer guidance in real situations.`,
      `Consequentialists never disagree with one another.`,
      `Calculating consequences is the only feature of consequentialism.`,
      `Most people prefer rules-based ethics.`,
      `Pure consequentialism is the dominant moral theory.`,
    ],
    correct: 0,
    explanation: `Negate (A): if a theory requiring impossible calculations still offers guidance, the conclusion collapses. (B) is irrelevant. (C) is too strong. (D), (E) are tangential.`,
  },
  {
    id: 'lsat_t0_043',
    topicId: 0,
    subtopic: 'lr_necessary_assumption',
    difficulty: 2,
    question: `Doctor: This patient's chronic fatigue is not caused by anemia. Her blood work shows normal red blood cell counts and hemoglobin levels.

Which one of the following is an assumption required by the doctor's argument?`,
    options: [
      `Anemia can be reliably ruled out when red blood cell counts and hemoglobin levels are normal.`,
      `Chronic fatigue has only one cause.`,
      `The patient has never been anemic before.`,
      `Anemia is the most common cause of chronic fatigue.`,
      `The patient is exercising regularly.`,
    ],
    correct: 0,
    explanation: `Negate (A): if normal RBC/hemoglobin can coexist with anemia, the inference fails. (B), (C), (D), (E) are not required.`,
  },
  {
    id: 'lsat_t0_044',
    topicId: 0,
    subtopic: 'lr_necessary_assumption',
    difficulty: 2,
    question: `Manager: Switching our team to a four-day work week will not reduce productivity. A pilot program found that the team's weekly output was unchanged after the switch.

Which of the following is an assumption required by the manager's argument?`,
    options: [
      `The conditions of the pilot program are sufficiently similar to ongoing conditions that its results will not significantly diverge over time.`,
      `Four-day work weeks are popular among employees.`,
      `The team produces only one type of output.`,
      `Productivity should be measured weekly.`,
      `No other companies are running similar pilots.`,
    ],
    correct: 0,
    explanation: `Negate (A): if conditions differ in ways that erode the result over time, the conclusion fails. (B), (C), (E) are not required. (D) is too narrow.`,
  },
  {
    id: 'lsat_t0_045',
    topicId: 0,
    subtopic: 'lr_necessary_assumption',
    difficulty: 1,
    question: `Tour guide: This sculpture must be from the early Hellenistic period, because it exhibits the dramatic emotional intensity characteristic of that period.

Which one of the following is an assumption required by the guide's argument?`,
    options: [
      `Dramatic emotional intensity is characteristic of the early Hellenistic period to a significantly greater degree than of any other plausibly relevant period.`,
      `All sculptures of the early Hellenistic period exhibit dramatic emotional intensity.`,
      `The sculpture is in good condition.`,
      `The sculpture is made of marble.`,
      `Hellenistic sculptors signed their works.`,
    ],
    correct: 0,
    explanation: `(A) is the differentiating claim — needed for the trait to distinguish the period. (B) is too strong (universal). (C), (D), (E) are irrelevant.`,
  },

  // --- lr_inference (14) ---
  {
    id: 'lsat_t0_046',
    topicId: 0,
    subtopic: 'lr_inference',
    difficulty: 1,
    question: `Every botanist on the field expedition is also a published author. Every published author at the institute receives a stipend. Some botanists on the field expedition work at the institute.

If the statements above are true, which of the following must also be true?`,
    options: [
      `Every botanist on the field expedition receives a stipend.`,
      `Every published author works at the institute.`,
      `Some botanists on the field expedition receive a stipend.`,
      `No one on the field expedition is unpublished.`,
      `Most stipends go to botanists.`,
    ],
    correct: 2,
    explanation: `From the three premises, the some-botanists who work at the institute are published (premise 1) and therefore get the stipend (premise 2). (A) is too strong — only those at the institute receive it. (B) reverses scope. (D) is true but is a restatement of premise 1, framed broadly — yet "no one on the field expedition is unpublished" follows only for botanists; we don't know there aren't non-botanists on the expedition. (E) is unsupported.`,
  },
  {
    id: 'lsat_t0_047',
    topicId: 0,
    subtopic: 'lr_inference',
    difficulty: 1,
    question: `In the city's bike-share program, members can rent bicycles for up to 30 minutes at no charge. Rentals longer than 30 minutes incur a per-minute fee. Last month, more than half of all rentals exceeded 30 minutes.

If the statements above are true, which one of the following must also be true?`,
    options: [
      `Most members are charged at least one fee per month.`,
      `Last month, more than half of all rentals were charged a per-minute fee.`,
      `The program lost money last month.`,
      `Members prefer longer rentals.`,
      `Per-minute fees were higher than usual last month.`,
    ],
    correct: 1,
    explanation: `Anything over 30 minutes incurs the fee; over half exceeded 30 minutes; hence (B). (A) shifts unit from rentals to members. (C), (D), (E) are unsupported.`,
  },
  {
    id: 'lsat_t0_048',
    topicId: 0,
    subtopic: 'lr_inference',
    difficulty: 2,
    question: `All employees who have completed the safety certification are eligible for the night shift. Some employees on the night shift have not completed the safety certification.

Which of the following must be true?`,
    options: [
      `Some employees are eligible for the night shift but have not completed the safety certification.`,
      `Some employees on the night shift are not eligible for the night shift.`,
      `Not every employee on the night shift has completed the safety certification.`,
      `Most employees have completed the safety certification.`,
      `Some employees who completed the certification are not on the night shift.`,
    ],
    correct: 2,
    explanation: `(C) is a near-restatement of the second premise, which is exactly what must follow. (A) confuses eligibility with assignment. (B) is unsupported. (D), (E) are unsupported.`,
  },
  {
    id: 'lsat_t0_049',
    topicId: 0,
    subtopic: 'lr_inference',
    difficulty: 2,
    question: `Every novel shortlisted for the Mercer Prize is over 200 pages long. No novel published in the past year that is set in the 19th century has been shortlisted for the Mercer Prize. The novel "Bramble Lane" is set in the 19th century, was published last year, and is 350 pages long.

Which of the following must be true?`,
    options: [
      `"Bramble Lane" was not shortlisted for the Mercer Prize.`,
      `Every novel shortlisted for the Mercer Prize is set in the 19th century.`,
      `Most novels published last year are set in the 19th century.`,
      `"Bramble Lane" will receive a different award.`,
      `Most short novels are not shortlisted for major prizes.`,
    ],
    correct: 0,
    explanation: `From premise 2 plus the description of the novel: it is excluded from the shortlist. (B) reverses scope. (C), (D), (E) are unsupported.`,
  },
  {
    id: 'lsat_t0_050',
    topicId: 0,
    subtopic: 'lr_inference',
    difficulty: 2,
    question: `In a survey of 500 commuters, 60 percent reported using public transit at least three days per week. Among those who reported using public transit at least three days per week, 70 percent also reported owning a car.

If the statements above are true, which of the following must also be true?`,
    options: [
      `At least 42 percent of all surveyed commuters use public transit at least three days per week and own a car.`,
      `Most car-owning commuters use public transit.`,
      `Public transit is overcrowded.`,
      `Fewer than 30 percent of commuters own a car.`,
      `Public transit users own cars at higher rates than the general population.`,
    ],
    correct: 0,
    explanation: `60% × 70% = 42% — straightforward arithmetic. (B), (D), (E) require comparisons not supported by the data. (C) is unsupported.`,
  },
  {
    id: 'lsat_t0_051',
    topicId: 0,
    subtopic: 'lr_inference',
    difficulty: 2,
    question: `Anyone who has completed two years of fieldwork is qualified to lead a research team. Some graduate students have completed two years of fieldwork. No first-year graduate student has completed two years of fieldwork.

Which of the following must be true?`,
    options: [
      `Some graduate students are qualified to lead a research team.`,
      `Every graduate student qualified to lead a team has completed two years of fieldwork.`,
      `First-year graduate students cannot lead research teams.`,
      `Most fieldwork is done by graduate students.`,
      `Anyone qualified to lead a research team is a graduate student.`,
    ],
    correct: 0,
    explanation: `Some grad students have two years; therefore they are qualified. (B) reverses — fieldwork is one path, not necessarily the only path. (C) goes further than the stimulus (qualification may have other routes). (D), (E) unsupported.`,
  },
  {
    id: 'lsat_t0_052',
    topicId: 0,
    subtopic: 'lr_inference',
    difficulty: 2,
    question: `The orchestra performs only works by composers who are either dead or who have given written permission for their works to be played. No work composed in the past five years has been performed by the orchestra.

If the statements above are true, which one of the following must also be true?`,
    options: [
      `No living composer has given permission to the orchestra.`,
      `The orchestra has not performed any work whose composer is both living and has not given written permission.`,
      `Most works performed by the orchestra were composed more than five years ago.`,
      `The orchestra prefers older works.`,
      `Composers seeking exposure should consider this orchestra.`,
    ],
    correct: 1,
    explanation: `(B) is a clean restatement of premise 1. (A) overshoots — living composers may have given permission; the orchestra simply has not chosen them. (C) is suggested but not entailed. (D), (E) editorialize.`,
  },
  {
    id: 'lsat_t0_053',
    topicId: 0,
    subtopic: 'lr_inference',
    difficulty: 3,
    question: `If a chemical reaction in this laboratory is exothermic, then the reaction vessel must be cooled. The reaction in vessel A is currently being cooled. The reaction in vessel B is not exothermic.

Which of the following must be true?`,
    options: [
      `The reaction in vessel A is exothermic.`,
      `The reaction in vessel B is not being cooled.`,
      `The reaction in vessel A is endothermic.`,
      `Cooling indicates an exothermic reaction.`,
      `It is possible that the reaction in vessel A is not exothermic.`,
    ],
    correct: 4,
    explanation: `Exothermic implies cooling, not the converse. So cooling does not entail exothermic — vessel A may be cooled for another reason. (A) and (D) commit the converse error. (B) commits the inverse error. (C) is unsupported.`,
  },
  {
    id: 'lsat_t0_054',
    topicId: 0,
    subtopic: 'lr_inference',
    difficulty: 2,
    question: `Every novel by Sarah Vance is set in either Edinburgh or Lisbon. No novel by Sarah Vance set in Lisbon contains a courtroom scene. "The Hollow Cantilever," a novel by Sarah Vance, contains a courtroom scene.

Which of the following must be true?`,
    options: [
      `"The Hollow Cantilever" is set in Edinburgh.`,
      `Most novels by Sarah Vance are set in Edinburgh.`,
      `Sarah Vance prefers Edinburgh.`,
      `Most courtroom scenes in fiction are set in Edinburgh.`,
      `"The Hollow Cantilever" is Sarah Vance's most recent novel.`,
    ],
    correct: 0,
    explanation: `Eliminate Lisbon (no courtroom scenes there); Edinburgh is the only remaining setting per premise 1. (B), (C), (D), (E) unsupported.`,
  },
  {
    id: 'lsat_t0_055',
    topicId: 0,
    subtopic: 'lr_inference',
    difficulty: 2,
    question: `Whenever the fire alarm in Building C is triggered, the security gate locks automatically. The security gate in Building C is currently unlocked.

Which of the following must be true?`,
    options: [
      `The fire alarm in Building C has not been triggered.`,
      `The fire alarm in Building C is currently broken.`,
      `Someone has tampered with the security gate.`,
      `The fire alarm in Building C has never been triggered.`,
      `Building C has multiple security gates.`,
    ],
    correct: 0,
    explanation: `Contrapositive: not-locked → not-triggered. (B), (C), (E) are unsupported. (D) is too strong — past triggers are consistent with the gate being unlocked now.`,
  },
  {
    id: 'lsat_t0_056',
    topicId: 0,
    subtopic: 'lr_inference',
    difficulty: 1,
    question: `The library is open Monday through Friday. On any day the library is open, the children's section opens at 10 a.m. The library is closed on weekends.

If the statements above are true, which one of the following must also be true?`,
    options: [
      `On Tuesdays, the children's section opens at 10 a.m.`,
      `The children's section is the most popular area of the library.`,
      `The library opens at 10 a.m.`,
      `The children's section is closed on Saturdays.`,
      `The library is closed on national holidays.`,
    ],
    correct: 0,
    explanation: `Tuesday is M–F, so library is open, so children's section opens at 10. (B) editorializes. (C) is unsupported — library might open earlier. (D) is unsupported — the library is just closed (the children's section status follows but is not the focus). (E) is unsupported.`,
  },
  {
    id: 'lsat_t0_057',
    topicId: 0,
    subtopic: 'lr_inference',
    difficulty: 2,
    question: `Wherever the lake's pH falls below 6, populations of native trout decline within two years. The lake's pH has fallen below 6 in three different bays this year.

Which of the following must be true?`,
    options: [
      `Within two years, native trout populations in those three bays will have declined.`,
      `Native trout in all other bays will also decline.`,
      `Acidification is the only threat to native trout.`,
      `Most native trout live in the three affected bays.`,
      `pH levels will continue to fall.`,
    ],
    correct: 0,
    explanation: `Direct application of the conditional. (B), (D), (E) are unsupported. (C) is too strong.`,
  },
  {
    id: 'lsat_t0_058',
    topicId: 0,
    subtopic: 'lr_inference',
    difficulty: 2,
    question: `A study found that among adults in the region, the higher a person's level of formal education, the more likely they are to read a newspaper at least three times a week. Among adults who did not complete secondary school, only 20 percent read a newspaper that often.

If the statements above are true, which of the following must also be true?`,
    options: [
      `Among adults who completed secondary school, more than 20 percent read a newspaper at least three times a week.`,
      `Most adults in the region read newspapers.`,
      `Higher education causes increased newspaper readership.`,
      `Newspaper readership is higher in this region than elsewhere.`,
      `Adults without secondary school read other media instead.`,
    ],
    correct: 0,
    explanation: `If education monotonically increases readership, the next group up must be higher than 20%. (B) is unsupported. (C) is causal overreach. (D), (E) are unsupported.`,
  },
  {
    id: 'lsat_t0_059',
    topicId: 0,
    subtopic: 'lr_inference',
    difficulty: 3,
    question: `Any musician whose primary instrument is the oboe must purchase a custom reed. No musician at the conservatory who purchases a custom reed also studies under Professor Alarcón. Some musicians at the conservatory who study under Professor Alarcón perform in the youth ensemble.

Which one of the following must be true?`,
    options: [
      `No oboist at the conservatory studies under Professor Alarcón.`,
      `Every oboist at the conservatory performs in the youth ensemble.`,
      `Every musician in the youth ensemble studies under Professor Alarcón.`,
      `Most oboists buy custom reeds.`,
      `Professor Alarcón does not teach oboe.`,
    ],
    correct: 0,
    explanation: `Oboists must buy custom reeds (premise 1); no custom-reed-buyer at the conservatory studies under Alarcón (premise 2); hence no oboist at the conservatory studies under Alarcón. (B), (C) overgeneralize. (D) is true but not the strongest claim — and (D) is implied generally, but (A) is the entailment from the given premises. (E) is suggested but not strictly entailed (Alarcón could teach oboe outside the conservatory).`,
  },

  // --- lr_flaw (14) ---
  {
    id: 'lsat_t0_060',
    topicId: 0,
    subtopic: 'lr_flaw',
    difficulty: 1,
    question: `Politician: My opponent claims that our city's roads need more repair funding. But my opponent is wealthy and rarely uses public roads. We should therefore reject his proposal.

The politician's reasoning is flawed because it`,
    options: [
      `attacks the opponent's personal characteristics rather than the substance of his proposal`,
      `relies on a small sample size`,
      `confuses correlation with causation`,
      `assumes what it sets out to prove`,
      `appeals to an irrelevant authority`,
    ],
    correct: 0,
    explanation: `Classic ad hominem. (B), (C), (D) describe different fallacies. (E) is appeal to authority, not present.`,
  },
  {
    id: 'lsat_t0_061',
    topicId: 0,
    subtopic: 'lr_flaw',
    difficulty: 1,
    question: `Coach: Either our team needs a new strategy or we should accept that we will never win the championship. We have hired a new strategist. Therefore, we will win the championship.

Which one of the following best describes the flaw in the coach's reasoning?`,
    options: [
      `It treats a necessary condition for winning as if it were sufficient.`,
      `It attacks the opposing team.`,
      `It generalizes from too few examples.`,
      `It assumes there are only two strategies.`,
      `It confuses cause with effect.`,
    ],
    correct: 0,
    explanation: `A new strategy may be required but does not guarantee a championship. (B), (C), (E) are absent. (D) misreads the disjunction.`,
  },
  {
    id: 'lsat_t0_062',
    topicId: 0,
    subtopic: 'lr_flaw',
    difficulty: 2,
    question: `Critic: Heavy metal music must cause anti-social behavior. A survey of teenagers who report frequent anti-social behavior also reports that they listen to heavy metal more than the average teenager.

The critic's argument is most vulnerable to the criticism that it`,
    options: [
      `infers causation from a correlation without ruling out alternative explanations`,
      `relies on testimony from unqualified sources`,
      `confuses sufficient with necessary conditions`,
      `attacks the character of the survey respondents`,
      `assumes what it sets out to prove`,
    ],
    correct: 0,
    explanation: `Standard correlation-vs-causation flaw. (B), (C), (D), (E) describe other fallacies.`,
  },
  {
    id: 'lsat_t0_063',
    topicId: 0,
    subtopic: 'lr_flaw',
    difficulty: 2,
    question: `Manager: Our company's average productivity has improved each year for the past five years. Therefore, every employee in the company has become more productive over that period.

The manager's reasoning is flawed because it`,
    options: [
      `assumes that what is true of a group is true of every member of that group`,
      `relies on outdated data`,
      `treats productivity as the only measure of company performance`,
      `confuses correlation with causation`,
      `generalizes from a small sample`,
    ],
    correct: 0,
    explanation: `Whole-to-part fallacy. (B), (C), (D), (E) describe other issues.`,
  },
  {
    id: 'lsat_t0_064',
    topicId: 0,
    subtopic: 'lr_flaw',
    difficulty: 2,
    question: `Patient: Acupuncture must work, because after my acupuncture sessions, my back pain improved within a week.

Which one of the following best describes a flaw in the patient's reasoning?`,
    options: [
      `It mistakes a temporal sequence for evidence of causation.`,
      `It attacks the credentials of the acupuncturist.`,
      `It generalizes from a single case but mentions multiple sessions.`,
      `It confuses necessary with sufficient conditions.`,
      `It appeals to popular opinion.`,
    ],
    correct: 0,
    explanation: `Post hoc ergo propter hoc. (B), (D), (E) are absent. (C) is partially true but the deeper flaw is post hoc.`,
  },
  {
    id: 'lsat_t0_065',
    topicId: 0,
    subtopic: 'lr_flaw',
    difficulty: 2,
    question: `Editor: Anyone who reads our newspaper regularly is well informed. Yolanda is well informed. Therefore, Yolanda reads our newspaper regularly.

The editor's reasoning is flawed because it`,
    options: [
      `treats a sufficient condition as if it were necessary`,
      `relies on circular reasoning`,
      `attacks Yolanda's credibility`,
      `confuses correlation with causation`,
      `assumes there are only two newspapers`,
    ],
    correct: 0,
    explanation: `Affirming the consequent: regular reading is one path to being well informed, not the only one. The others are not on point.`,
  },
  {
    id: 'lsat_t0_066',
    topicId: 0,
    subtopic: 'lr_flaw',
    difficulty: 2,
    question: `Advocate: My opponent has argued that the new tax should be repealed. But the new tax is essential for funding our schools. Therefore, my opponent's argument is wrong.

Which one of the following best describes the flaw in the advocate's reasoning?`,
    options: [
      `It rejects the opponent's argument without engaging with its content.`,
      `It generalizes from atypical examples.`,
      `It appeals to an irrelevant authority.`,
      `It confuses cause with effect.`,
      `It assumes that taxes always succeed in their goals.`,
    ],
    correct: 0,
    explanation: `The advocate restates her own position rather than addressing the opponent's reasoning — classic ignoring the issue / non-responsive flaw. The others are tangential.`,
  },
  {
    id: 'lsat_t0_067',
    topicId: 0,
    subtopic: 'lr_flaw',
    difficulty: 3,
    question: `Scientist: There is no compelling evidence that the chemical compound in question causes harm. Therefore, the compound is safe.

The scientist's reasoning is flawed because it`,
    options: [
      `treats the absence of evidence as evidence of absence`,
      `relies on an unrepresentative sample`,
      `confuses necessary with sufficient conditions`,
      `attacks the credentials of the researchers`,
      `assumes that all compounds are equally safe`,
    ],
    correct: 0,
    explanation: `Argument from ignorance. (B), (C), (D), (E) are absent.`,
  },
  {
    id: 'lsat_t0_068',
    topicId: 0,
    subtopic: 'lr_flaw',
    difficulty: 2,
    question: `Parent: Most children who own pets read more than children who don't. So if I want my son to read more, I should buy him a pet.

The parent's reasoning is most vulnerable to the criticism that it`,
    options: [
      `mistakes a correlation for a causal relationship that supports an intervention`,
      `generalizes from a single case`,
      `relies on circular reasoning`,
      `assumes there are only two types of pets`,
      `attacks the credibility of his son`,
    ],
    correct: 0,
    explanation: `Buying a pet may not produce the same effect as having parents who chose to buy a pet (confounding). The others are absent.`,
  },
  {
    id: 'lsat_t0_069',
    topicId: 0,
    subtopic: 'lr_flaw',
    difficulty: 2,
    question: `Pundit: Every politician who has been honest about her past has lost the next election. Therefore, no politician should be honest about her past.

Which one of the following best describes a flaw in the pundit's reasoning?`,
    options: [
      `It treats winning elections as the only relevant consideration.`,
      `It relies on a sample that is too small.`,
      `It confuses cause with effect.`,
      `It appeals to authority.`,
      `It assumes that honesty is impossible.`,
    ],
    correct: 0,
    explanation: `The argument elides the normative dimension — there might be reasons to be honest beyond electability. The others are not the principal flaw.`,
  },
  {
    id: 'lsat_t0_070',
    topicId: 0,
    subtopic: 'lr_flaw',
    difficulty: 2,
    question: `Restaurant critic: This restaurant must serve excellent food. I have eaten there once, and the meal I had was outstanding.

The critic's reasoning is flawed because it`,
    options: [
      `draws a sweeping conclusion from a single instance`,
      `treats a sufficient condition as necessary`,
      `appeals to popularity`,
      `relies on biased testimony`,
      `confuses cause with effect`,
    ],
    correct: 0,
    explanation: `Hasty generalization. The others are not on point.`,
  },
  {
    id: 'lsat_t0_071',
    topicId: 0,
    subtopic: 'lr_flaw',
    difficulty: 3,
    question: `Activist: Either we adopt strict rent controls, or housing in this city will become permanently unaffordable. Anyone who opposes strict rent controls is therefore in favor of making housing permanently unaffordable.

Which one of the following best describes a flaw in the activist's reasoning?`,
    options: [
      `It presents only two alternatives when other reasonable options exist.`,
      `It attacks the personal motives of its opponents.`,
      `It relies on an unrepresentative sample.`,
      `It treats a necessary condition as if it were sufficient.`,
      `It confuses cause with effect.`,
    ],
    correct: 0,
    explanation: `False dichotomy. (B) is tempting but the structure of the flaw is the false binary itself, not personal attack.`,
  },
  {
    id: 'lsat_t0_072',
    topicId: 0,
    subtopic: 'lr_flaw',
    difficulty: 2,
    question: `Consultant: Our consulting firm must be doing well. Just yesterday, three new clients signed up.

The consultant's reasoning is most vulnerable to the criticism that it`,
    options: [
      `generalizes about overall performance based on a single, possibly atypical day`,
      `confuses sufficient with necessary conditions`,
      `attacks the credibility of competitors`,
      `assumes what it sets out to prove`,
      `treats correlation as causation`,
    ],
    correct: 0,
    explanation: `One day does not establish a trend. The others are absent.`,
  },
  {
    id: 'lsat_t0_073',
    topicId: 0,
    subtopic: 'lr_flaw',
    difficulty: 2,
    question: `Researcher: The new vaccine is effective. In our trial, the rate of infection among vaccinated participants was 30 percent lower than the rate in a separate, much smaller observational study of unvaccinated people from a different region two years earlier.

The researcher's reasoning is flawed primarily because it`,
    options: [
      `compares groups that differ in time, location, and study design, undermining the comparison`,
      `assumes vaccines always have side effects`,
      `treats correlation as causation`,
      `relies on an appeal to authority`,
      `generalizes from a sample of one`,
    ],
    correct: 0,
    explanation: `Different study designs and populations make the comparison non-informative. The others are not the principal flaw.`,
  },

  // --- lr_principle (10) ---
  {
    id: 'lsat_t0_074',
    topicId: 0,
    subtopic: 'lr_principle',
    difficulty: 2,
    question: `Principle: A scientist should refuse a grant whenever the funding source has a financial stake in the outcome of the research and the scientist would have difficulty designing the study so as to neutralize that stake.

Which of the following actions most closely conforms to the principle above?`,
    options: [
      `Dr. Liu refuses a grant from a pharmaceutical company to study the company's drug, since any plausible study design would still leave the company with substantial influence over the outcome.`,
      `Dr. Patel accepts a grant from a manufacturer of farm equipment to study soil composition in a region where the manufacturer does not sell its products.`,
      `Dr. Sato refuses a grant from a university because his department head dislikes the funding source.`,
      `Dr. Mokoena accepts a grant from a foundation whose mission is to support pure mathematics research, with no commercial product involved.`,
      `Dr. Werner refuses a grant from a city government even though no conflict of interest exists.`,
    ],
    correct: 0,
    explanation: `(A) matches: financial stake exists AND can't be neutralized. (B), (D) lack the financial stake. (C), (E) refuse for non-principle reasons.`,
  },
  {
    id: 'lsat_t0_075',
    topicId: 0,
    subtopic: 'lr_principle',
    difficulty: 2,
    question: `Principle: A journalist should disclose any personal relationship with a subject of an article she writes whenever that relationship could reasonably be thought to affect her reporting.

Which of the following journalists' actions best conforms to the principle?`,
    options: [
      `A reporter discloses in her article that the company she profiles is run by her sister-in-law.`,
      `A reporter refuses to write any article involving family members.`,
      `A reporter discloses that the company she profiles is in the same industry as her husband's employer.`,
      `A reporter writes an article without disclosure about a public official she has never met.`,
      `A reporter conceals a financial stake in a stock she covers because she believes her judgment is unaffected.`,
    ],
    correct: 0,
    explanation: `(A) involves a personal relationship that could reasonably affect reporting and is disclosed. (B) is over-restrictive. (C) is industry overlap, not a personal relationship with the subject. (D) is a non-relationship. (E) violates the principle.`,
  },
  {
    id: 'lsat_t0_076',
    topicId: 0,
    subtopic: 'lr_principle',
    difficulty: 1,
    question: `Principle: A teacher should accommodate a student's missed deadline whenever the cause was a genuine emergency outside the student's control.

Which of the following best conforms to the principle?`,
    options: [
      `Ms. Adler grants an extension to a student who missed a deadline because her family home flooded.`,
      `Ms. Adler grants an extension to a student who simply forgot the assignment.`,
      `Ms. Adler denies an extension to a student hospitalized overnight on the due date.`,
      `Ms. Adler grants an extension to any student who asks.`,
      `Ms. Adler refuses all extensions to be fair.`,
    ],
    correct: 0,
    explanation: `(A) fits a genuine, uncontrollable emergency. (B), (D) are too lenient. (C) violates. (E) is too strict.`,
  },
  {
    id: 'lsat_t0_077',
    topicId: 0,
    subtopic: 'lr_principle',
    difficulty: 2,
    question: `Principle: Government regulators should impose new restrictions on an industry only when the expected benefits to the public clearly exceed the burdens those restrictions place on legitimate business activity.

Which of the following actions most clearly conforms to the principle?`,
    options: [
      `A regulator declines to impose new packaging rules when the expected reduction in consumer harm is small and compliance costs would force many small producers out of business.`,
      `A regulator imposes new rules even though the projected public benefit is modest, because the affected industry is unpopular.`,
      `A regulator imposes new rules with substantial costs to legitimate firms despite uncertainty about whether benefits will materialize.`,
      `A regulator imposes rules that fall heavily on industries unrelated to the harm.`,
      `A regulator refuses to act even when public benefits clearly outweigh costs.`,
    ],
    correct: 0,
    explanation: `(A) matches the cost–benefit standard. (B), (C), (D) violate. (E) violates in the opposite direction.`,
  },
  {
    id: 'lsat_t0_078',
    topicId: 0,
    subtopic: 'lr_principle',
    difficulty: 2,
    question: `Principle: A historian should not draw definitive conclusions about a culture's practices solely from artifacts whose original context is unknown.

Which of the following most clearly conforms to the principle?`,
    options: [
      `A historian declines to claim that a society practiced ritual feasting based on bowls of unknown provenance, instead listing the claim as plausible but unresolved.`,
      `A historian definitively asserts ritual practices based on bowls whose original use site is unknown.`,
      `A historian ignores all artifacts because context is always incomplete.`,
      `A historian draws conclusions from artifacts and disregards documentary evidence.`,
      `A historian refuses to study artifacts with known provenance.`,
    ],
    correct: 0,
    explanation: `(A) acknowledges uncertainty appropriately. (B) violates. (C), (D), (E) overshoot.`,
  },
  {
    id: 'lsat_t0_079',
    topicId: 0,
    subtopic: 'lr_principle',
    difficulty: 2,
    question: `Principle: An auditor should issue a qualified opinion whenever there is material uncertainty about an entity's ability to continue as a going concern.

Which of the following actions conforms to the principle?`,
    options: [
      `An auditor issues a qualified opinion for a company whose largest customer has filed for bankruptcy and whose own cash reserves are nearly exhausted.`,
      `An auditor issues an unqualified opinion despite material going-concern doubt.`,
      `An auditor issues a qualified opinion solely because the auditor disagrees with management's stylistic choices.`,
      `An auditor refuses to issue any opinion.`,
      `An auditor reissues a prior year opinion without analysis.`,
    ],
    correct: 0,
    explanation: `(A) matches material going-concern doubt. (B) violates. (C), (D), (E) are off-principle.`,
  },
  {
    id: 'lsat_t0_080',
    topicId: 0,
    subtopic: 'lr_principle',
    difficulty: 3,
    question: `Principle: A scholar should retract a published claim whenever subsequent evidence makes that claim significantly more likely to be false than true.

Which one of the following actions most closely conforms to the principle above?`,
    options: [
      `After new excavations strongly suggest that the date she previously assigned to a temple was off by two centuries, Professor Wei publishes a retraction.`,
      `Professor Wei retracts a claim because a single colleague disagreed.`,
      `Professor Wei refuses to retract a claim despite extensive new evidence undermining it.`,
      `Professor Wei retracts a claim purely to advance her career.`,
      `Professor Wei publishes a new claim without retracting the old one despite their inconsistency.`,
    ],
    correct: 0,
    explanation: `(A) matches: subsequent evidence makes the claim significantly more likely false. (B) is under-threshold. (C) and (E) violate. (D) is off-principle.`,
  },
  {
    id: 'lsat_t0_081',
    topicId: 0,
    subtopic: 'lr_principle',
    difficulty: 2,
    question: `Principle: A physician should recommend a screening test only when the benefits of early detection clearly outweigh the risks of false positives, overdiagnosis, and unnecessary follow-up procedures.

Which of the following conforms to the principle?`,
    options: [
      `Dr. Chen recommends against routine PSA screening for an asymptomatic low-risk patient, citing high false-positive rates and a low likelihood that detected cancers would shorten life.`,
      `Dr. Chen recommends every test available to every patient.`,
      `Dr. Chen recommends screening solely to satisfy patient anxiety.`,
      `Dr. Chen refuses all screening regardless of benefit profile.`,
      `Dr. Chen recommends screening only for patients who request it.`,
    ],
    correct: 0,
    explanation: `(A) reflects the harm-benefit weighing. (B), (C), (D), (E) violate.`,
  },
  {
    id: 'lsat_t0_082',
    topicId: 0,
    subtopic: 'lr_principle',
    difficulty: 2,
    question: `Principle: An employer should provide reasonable accommodation to an employee whenever the accommodation does not impose an undue hardship on the business.

Which of the following actions best conforms to the principle?`,
    options: [
      `A small employer grants an employee's request to work from home two days per week, since the work can be done remotely without disrupting operations.`,
      `A small employer denies an accommodation request that would cost almost nothing to implement.`,
      `A small employer grants an extreme accommodation that would force layoffs of half the staff.`,
      `A small employer refuses accommodations across the board.`,
      `A small employer grants accommodations only to senior staff.`,
    ],
    correct: 0,
    explanation: `(A) matches the standard. (B), (D), (E) violate. (C) fails the undue-hardship test.`,
  },
  {
    id: 'lsat_t0_083',
    topicId: 0,
    subtopic: 'lr_principle',
    difficulty: 2,
    question: `Principle: A reviewer should recuse herself from evaluating any submission by a former student with whom she had a substantial mentoring relationship.

Which of the following actions best conforms to the principle?`,
    options: [
      `Professor Núñez declines to review a paper authored by a former PhD student whose dissertation she advised five years earlier.`,
      `Professor Núñez declines to review every paper from her field.`,
      `Professor Núñez reviews a paper by a former undergraduate she taught briefly in a survey course many years ago.`,
      `Professor Núñez reviews a former student's paper as long as she gives it a positive evaluation.`,
      `Professor Núñez reviews a paper authored by her current PhD student.`,
    ],
    correct: 0,
    explanation: `(A) is a substantial mentoring relationship. (B) is over-restrictive. (C) is below the substantial threshold. (D), (E) violate.`,
  },

  // --- lr_main_point (9) ---
  {
    id: 'lsat_t0_084',
    topicId: 0,
    subtopic: 'lr_main_point',
    difficulty: 1,
    question: `Critics argue that the city should not fund a new concert hall because the existing hall is rarely sold out. But the existing hall is too small to attract major touring acts and lacks the acoustics those acts require. Without a new hall, the city will continue to lose touring revenue to neighboring cities. The city should therefore fund a new concert hall.

Which of the following most accurately expresses the main conclusion of the argument?`,
    options: [
      `The city should fund a new concert hall.`,
      `The existing hall is too small.`,
      `Touring revenue is going to neighboring cities.`,
      `Critics are wrong about most things.`,
      `Acoustics matter to touring acts.`,
    ],
    correct: 0,
    explanation: `The "therefore" sentence is the main point. The others are supporting premises.`,
  },
  {
    id: 'lsat_t0_085',
    topicId: 0,
    subtopic: 'lr_main_point',
    difficulty: 1,
    question: `Some scholars believe the 14th-century plague caused the wage gains seen in late medieval Europe. While the plague did create labor shortages, those shortages were short-lived, and wages remained elevated for over a century. Other factors — including changes in land tenure and the gradual emergence of urban guilds — were therefore the more lasting drivers of medieval wage gains.

The main conclusion of the argument is that`,
    options: [
      `factors other than the plague were the more lasting drivers of medieval wage gains`,
      `the plague caused short-term labor shortages`,
      `wages remained elevated for over a century`,
      `urban guilds emerged gradually`,
      `scholars often disagree about medieval economics`,
    ],
    correct: 0,
    explanation: `The third sentence is the conclusion. The others are premises or background.`,
  },
  {
    id: 'lsat_t0_086',
    topicId: 0,
    subtopic: 'lr_main_point',
    difficulty: 2,
    question: `Although standardized tests are widely criticized, they remain useful tools when used appropriately. Tests reveal information that other measures often miss, particularly when comparing students from different schools. The criticism of standardized tests is largely misdirected: the problem is not the tests themselves, but the high-stakes contexts in which they are sometimes used.

The main point of the argument is that`,
    options: [
      `criticism of standardized tests is largely misdirected — the problem lies in high-stakes contexts of use, not the tests themselves`,
      `standardized tests are useful`,
      `tests reveal information other measures miss`,
      `tests should never be used in high-stakes contexts`,
      `critics of standardized tests are uninformed`,
    ],
    correct: 0,
    explanation: `The final sentence states the central claim. (B), (C) are supporting. (D) is too strong. (E) is unsupported.`,
  },
  {
    id: 'lsat_t0_087',
    topicId: 0,
    subtopic: 'lr_main_point',
    difficulty: 2,
    question: `A common assumption is that great athletes are born with exceptional physical gifts. But studies of top performers across many sports reveal that what most distinguishes them is the deliberate structure of their training, not raw talent. The myth of innate athletic genius therefore underestimates the role of practice.

The main conclusion is that`,
    options: [
      `the myth of innate athletic genius underestimates the role of practice`,
      `top athletes are born with exceptional gifts`,
      `studies have examined many sports`,
      `deliberate practice produces talent`,
      `most assumptions about athletes are wrong`,
    ],
    correct: 0,
    explanation: `(A) follows "therefore." The others are premises or overgeneralizations.`,
  },
  {
    id: 'lsat_t0_088',
    topicId: 0,
    subtopic: 'lr_main_point',
    difficulty: 2,
    question: `Many observers blame the decline of independent bookstores on online retailers. While online retailers have intensified competition, the decisive blow came from rising commercial rents in the neighborhoods where independent bookstores had clustered. The principal driver of bookstore decline has therefore been real estate, not online competition.

Which of the following most accurately expresses the main point?`,
    options: [
      `Rising commercial rents, not online retailers, have been the principal driver of independent bookstore decline.`,
      `Online retailers have intensified competition.`,
      `Independent bookstores cluster in particular neighborhoods.`,
      `Real estate markets vary geographically.`,
      `Observers often blame the wrong cause.`,
    ],
    correct: 0,
    explanation: `(A) is the conclusion. Others are premises or generalities.`,
  },
  {
    id: 'lsat_t0_089',
    topicId: 0,
    subtopic: 'lr_main_point',
    difficulty: 1,
    question: `Some commentators predict that artificial intelligence will eliminate most knowledge work within a decade. But knowledge workers have always adapted to new technologies, taking on tasks the technologies cannot perform. Predictions of widespread elimination are therefore likely overstated.

The main point of the argument is that`,
    options: [
      `predictions that AI will eliminate most knowledge work within a decade are likely overstated`,
      `knowledge workers adapt to new technologies`,
      `commentators often make confident predictions`,
      `AI will replace some workers`,
      `technology and labor markets are linked`,
    ],
    correct: 0,
    explanation: `(A) follows "therefore." Others are premises or background.`,
  },
  {
    id: 'lsat_t0_090',
    topicId: 0,
    subtopic: 'lr_main_point',
    difficulty: 2,
    question: `Critics of nuclear power often cite the high cost of new reactors. But the costs cited reflect first-of-a-kind engineering and one-off regulatory negotiation, not the steady-state costs of a mature build program. The high cost figures, in short, exaggerate the long-run cost of nuclear power.

The main conclusion is that`,
    options: [
      `the cited cost figures exaggerate the long-run cost of nuclear power`,
      `nuclear power is the cheapest source of energy`,
      `critics are biased against nuclear power`,
      `engineering becomes cheaper with experience`,
      `regulation is the largest cost driver`,
    ],
    correct: 0,
    explanation: `(A) is the explicit conclusion ("in short"). The others overshoot or are premises.`,
  },
  {
    id: 'lsat_t0_091',
    topicId: 0,
    subtopic: 'lr_main_point',
    difficulty: 2,
    question: `Public funding for the arts is often defended on economic grounds — that arts spending stimulates tourism and downtown commerce. While these effects exist, they are modest compared to the cultural and educational benefits the arts provide. The strongest case for public arts funding therefore rests not on its economic returns but on its civic and educational value.

The main point is that`,
    options: [
      `the strongest case for public arts funding rests on civic and educational value, not on economic returns`,
      `arts spending stimulates tourism`,
      `arts funding is sometimes opposed`,
      `arts education benefits children`,
      `cultural value cannot be measured`,
    ],
    correct: 0,
    explanation: `(A) follows the second "therefore." Others are premises or unsupported.`,
  },
  {
    id: 'lsat_t0_092',
    topicId: 0,
    subtopic: 'lr_main_point',
    difficulty: 2,
    question: `Many people assume that an organic label guarantees a more nutritious food. But independent reviews have repeatedly found that nutrient differences between organic and conventional versions of most foods are very small. Consumers seeking better nutrition from organic labeling are therefore likely to be disappointed.

The main conclusion is that`,
    options: [
      `consumers seeking better nutrition from organic labeling are likely to be disappointed`,
      `organic foods are exactly as nutritious as conventional foods`,
      `organic labeling should be banned`,
      `nutrient differences across foods are mostly small`,
      `consumers should ignore food labels`,
    ],
    correct: 0,
    explanation: `(A) follows "therefore." (B) is too strong (small differences, not zero). (C), (E) overshoot. (D) is a premise.`,
  },

  // --- lr_role (7) ---
  {
    id: 'lsat_t0_093',
    topicId: 0,
    subtopic: 'lr_role',
    difficulty: 2,
    question: `Critics complain that the new bridge is over budget. The bridge is indeed over its initial budget. However, almost every major infrastructure project in this country exceeds its initial budget by similar margins. The new bridge is therefore not unusually over budget.

The claim that "almost every major infrastructure project in this country exceeds its initial budget by similar margins" plays which of the following roles in the argument?`,
    options: [
      `It is a premise offered in support of the argument's main conclusion.`,
      `It is the main conclusion.`,
      `It is a position the author rejects.`,
      `It is an illustration that contradicts the conclusion.`,
      `It is a background statement irrelevant to the conclusion.`,
    ],
    correct: 0,
    explanation: `It supports the conclusion that the bridge is not unusual. (B), (C), (D), (E) misidentify the role.`,
  },
  {
    id: 'lsat_t0_094',
    topicId: 0,
    subtopic: 'lr_role',
    difficulty: 2,
    question: `Some argue that minimum wage increases hurt employment. While employment has fallen in some industries after wage increases, those same industries were already experiencing automation-driven declines. The wage increase is therefore unlikely to be the main cause of those employment declines.

The statement that "those same industries were already experiencing automation-driven declines" functions in the argument as`,
    options: [
      `evidence offered to defeat an alternative causal explanation`,
      `the main conclusion`,
      `a background concession the argument later abandons`,
      `evidence that minimum wage increases cause unemployment`,
      `a claim the argument is committed to refuting`,
    ],
    correct: 0,
    explanation: `It defeats the rival cause (wage increases). The others misidentify the role.`,
  },
  {
    id: 'lsat_t0_095',
    topicId: 0,
    subtopic: 'lr_role',
    difficulty: 2,
    question: `Some commentators predict that remote work will collapse downtown economies. While many workers have indeed left downtowns, the new mix of residents and visitors is reshaping rather than eliminating downtown commerce. Downtowns are therefore not collapsing — they are transforming.

The claim that "many workers have indeed left downtowns" plays which role?`,
    options: [
      `It is a concession granted before the main conclusion is established.`,
      `It is the main conclusion.`,
      `It is a claim the argument's overall position contradicts.`,
      `It is the principle the argument applies.`,
      `It is a counter-example the argument cannot accommodate.`,
    ],
    correct: 0,
    explanation: `A concession noted before the contrast pivot. (B), (C), (D), (E) misidentify.`,
  },
  {
    id: 'lsat_t0_096',
    topicId: 0,
    subtopic: 'lr_role',
    difficulty: 3,
    question: `Defenders of free trade argue that it lowers consumer prices. While prices do fall on many imported goods, those savings are concentrated among already-affluent consumers, and they are offset for many workers by losses in wages and employment. Free trade therefore does less to benefit ordinary consumers than its defenders claim.

The statement that "those savings are concentrated among already-affluent consumers, and they are offset for many workers by losses in wages and employment" plays which role?`,
    options: [
      `It is the principal evidence offered for the conclusion.`,
      `It is a position the author concedes for the sake of argument.`,
      `It is the conclusion of the argument.`,
      `It is a counter-example the argument later rebuts.`,
      `It is a definition of "free trade."`,
    ],
    correct: 0,
    explanation: `It directly supports the conclusion that free trade benefits ordinary consumers less than claimed. The other options misidentify the role.`,
  },
  {
    id: 'lsat_t0_097',
    topicId: 0,
    subtopic: 'lr_role',
    difficulty: 2,
    question: `Critics claim that streaming services have made musicians poorer. Yet musicians today reach larger audiences and earn more from live performance, where most of their income now originates, than musicians did before streaming. Streaming therefore has not made musicians poorer; it has rearranged how they earn.

The claim that "where most of their income now originates" functions as`,
    options: [
      `supporting evidence that defuses the criticism by highlighting the income source the criticism overlooks`,
      `the main conclusion`,
      `a claim the argument later refutes`,
      `a definition`,
      `a hypothetical example`,
    ],
    correct: 0,
    explanation: `It is supporting evidence that strengthens the rebuttal of the criticism. The others misidentify.`,
  },
  {
    id: 'lsat_t0_098',
    topicId: 0,
    subtopic: 'lr_role',
    difficulty: 2,
    question: `Skeptics claim that vegetarian diets cannot provide enough protein. But surveys of long-term vegetarians find protein deficiencies no more common than in the general population. The skeptical claim is therefore not supported by evidence.

The claim that "protein deficiencies are no more common in long-term vegetarians than in the general population" functions as`,
    options: [
      `evidence offered to undermine the skeptical claim`,
      `the main conclusion`,
      `a principle the argument applies`,
      `a definition`,
      `a position the argument concedes`,
    ],
    correct: 0,
    explanation: `It supplies the empirical ground for rejecting the skeptical claim. The others misidentify.`,
  },
  {
    id: 'lsat_t0_099',
    topicId: 0,
    subtopic: 'lr_role',
    difficulty: 2,
    question: `Some argue that high-rise housing is unhealthy. Although early high-rise complexes built without adequate light or ventilation produced documented health problems, modern designs incorporate features that eliminate these defects. Therefore, the claim that high-rise housing is inherently unhealthy is unfounded.

The statement that "early high-rise complexes built without adequate light or ventilation produced documented health problems" plays which role?`,
    options: [
      `It is a concession that contextualizes but does not establish the conclusion.`,
      `It is the main conclusion.`,
      `It is the central premise on which the conclusion rests.`,
      `It is a definition.`,
      `It is a counter-example the argument cannot answer.`,
    ],
    correct: 0,
    explanation: `It is conceded but distinguished from the modern designs at issue. The others misidentify.`,
  },

  // --- lr_resolve_paradox (7) ---
  {
    id: 'lsat_t0_100',
    topicId: 0,
    subtopic: 'lr_resolve_paradox',
    difficulty: 1,
    question: `Although the city has built more bike lanes every year for the past decade, the number of reported bicycle accidents in the city has also increased every year.

Which of the following, if true, best resolves the apparent paradox?`,
    options: [
      `The number of cyclists in the city has grown faster than the rate at which accidents have grown, so the per-cyclist accident rate has actually fallen.`,
      `Bike lanes are sometimes obstructed by parked cars.`,
      `Many cyclists do not wear helmets.`,
      `City planners are reviewing safety policies annually.`,
      `Some cyclists prefer streets without bike lanes.`,
    ],
    correct: 0,
    explanation: `Per-capita rate fell even as totals rose. (B), (C), (D), (E) do not explain the totals/safety mismatch.`,
  },
  {
    id: 'lsat_t0_101',
    topicId: 0,
    subtopic: 'lr_resolve_paradox',
    difficulty: 2,
    question: `Despite cutting its prices by 20 percent, a regional supermarket chain saw its total revenue rise rather than fall last year.

Which one of the following, if true, best resolves the paradox?`,
    options: [
      `The price cut attracted a large enough increase in foot traffic and basket sizes to more than offset the lower per-item price.`,
      `Customers prefer brand-name products to store brands.`,
      `Some competitors also cut prices.`,
      `The chain hired more cashiers.`,
      `Inflation was negligible last year.`,
    ],
    correct: 0,
    explanation: `Demand elasticity: more units sold more than compensates for the lower price. The others fail to reconcile the gap.`,
  },
  {
    id: 'lsat_t0_102',
    topicId: 0,
    subtopic: 'lr_resolve_paradox',
    difficulty: 2,
    question: `A pharmaceutical company's flu vaccine has been shown in clinical trials to be 65 percent effective. Yet in a recent flu season, hospitals reported that the proportion of vaccinated patients among those admitted with severe flu was much higher than the proportion of unvaccinated patients.

Which of the following, if true, best resolves the apparent contradiction?`,
    options: [
      `Vaccinated patients in the population were predominantly elderly and immunocompromised — groups already at high risk of severe flu and far more likely to be hospitalized than vaccinated young adults.`,
      `The clinical trial included only adults.`,
      `Vaccine distribution varied across regions.`,
      `Some hospitals report more accurately than others.`,
      `Flu strains change from year to year.`,
    ],
    correct: 0,
    explanation: `Selection bias by underlying risk: high-risk groups are both more often vaccinated and more often hospitalized. The others do not resolve the gap.`,
  },
  {
    id: 'lsat_t0_103',
    topicId: 0,
    subtopic: 'lr_resolve_paradox',
    difficulty: 2,
    question: `A factory adopted a new quality-control system that cut defect rates by 40 percent. Yet customer complaints about defective products doubled in the year after the new system was adopted.

Which of the following, if true, best resolves the paradox?`,
    options: [
      `The factory's sales volume tripled during the same year, so total units produced — and hence total defective units — rose despite the lower defect rate.`,
      `Quality control inspectors received additional training.`,
      `The factory had a smaller workforce in the prior year.`,
      `Some customers complain about non-defective products.`,
      `Complaints are filed through a website.`,
    ],
    correct: 0,
    explanation: `A smaller percentage of a much larger base can still be a bigger absolute number. The others are tangential.`,
  },
  {
    id: 'lsat_t0_104',
    topicId: 0,
    subtopic: 'lr_resolve_paradox',
    difficulty: 2,
    question: `In a recent national survey, most people reported preferring locally produced food. Yet sales of locally produced food at supermarkets nationally have declined.

Which of the following, if true, best resolves the paradox?`,
    options: [
      `Most consumers who prefer locally produced food now buy it directly from farmers' markets and community-supported agriculture, not from supermarkets.`,
      `Locally produced food costs more than imported food.`,
      `Survey respondents do not always tell the truth.`,
      `Some supermarkets carry no locally produced food.`,
      `Local farmers vary in productivity.`,
    ],
    correct: 0,
    explanation: `Channel shift: demand is real, but supermarket sales miss the action. The others fail to reconcile.`,
  },
  {
    id: 'lsat_t0_105',
    topicId: 0,
    subtopic: 'lr_resolve_paradox',
    difficulty: 1,
    question: `A local museum has dramatically increased its outreach budget but has seen no increase in attendance.

Which one of the following, if true, best resolves the paradox?`,
    options: [
      `Most of the new outreach budget was spent on web infrastructure that improves online engagement rather than driving in-person visits.`,
      `The museum hired new curators.`,
      `Outreach budgets often grow slowly.`,
      `The museum's neighborhood is well known.`,
      `Some visitors come from neighboring towns.`,
    ],
    correct: 0,
    explanation: `Outreach spending went to a different output. The others are off-target.`,
  },
  {
    id: 'lsat_t0_106',
    topicId: 0,
    subtopic: 'lr_resolve_paradox',
    difficulty: 3,
    question: `A city raised its tobacco tax with the goal of reducing smoking. Smoking rates in the city did decline. However, hospital admissions for smoking-related illness in the city rose during the same period.

Which of the following, if true, best resolves the paradox?`,
    options: [
      `Smoking-related illnesses typically take many years of cumulative exposure to develop, so admissions in any given year reflect smoking habits from one to three decades earlier — when smoking rates were significantly higher.`,
      `Some smokers switched to smokeless tobacco.`,
      `Hospitals expanded their capacity during the period.`,
      `Cigarette taxes vary across regions.`,
      `Some residents traveled to neighboring cities to buy cheaper cigarettes.`,
    ],
    correct: 0,
    explanation: `Long latency: present admissions reflect past exposure, not present smoking rates. The others are off-target.`,
  },

  // --- lr_method (7) ---
  {
    id: 'lsat_t0_107',
    topicId: 0,
    subtopic: 'lr_method',
    difficulty: 2,
    question: `Diego: The new transit pass cannot succeed, since previous attempts at restructuring fares in this city have all failed.
Marisol: But none of those previous attempts involved off-peak discounts comparable to those in the current proposal, so the prior failures do not apply.

Marisol responds to Diego's argument by`,
    options: [
      `arguing that the cases on which Diego relies are not relevantly similar to the case at issue`,
      `attacking Diego's motives`,
      `appealing to expert authority`,
      `pointing out a self-contradiction in Diego's argument`,
      `accepting Diego's conclusion but rejecting his reasons`,
    ],
    correct: 0,
    explanation: `Disanalogy. The others are not what Marisol does.`,
  },
  {
    id: 'lsat_t0_108',
    topicId: 0,
    subtopic: 'lr_method',
    difficulty: 2,
    question: `Some claim that the new safety regulation will hurt small farms. The regulation does add paperwork, but small farms are exempt from its costliest requirements. The claim is therefore overstated.

The argument proceeds by`,
    options: [
      `acknowledging a concern and then narrowing its scope by introducing an exemption that defuses the concern's main force`,
      `attacking the credentials of those who raised the concern`,
      `appealing to popularity`,
      `relying on an analogy to a comparable industry`,
      `presenting two competing principles and choosing between them`,
    ],
    correct: 0,
    explanation: `Concede-and-narrow. The others are absent.`,
  },
  {
    id: 'lsat_t0_109',
    topicId: 0,
    subtopic: 'lr_method',
    difficulty: 2,
    question: `Aaliyah: Charging for plastic bags reduces waste.
Owen: Yes, but only because shoppers shift to reusable bags, which require many uses to break even environmentally. Those break-even points are often not reached.

Owen responds to Aaliyah's claim by`,
    options: [
      `accepting the claim's surface result but raising a deeper consideration that complicates its environmental verdict`,
      `denying the empirical premise underlying her claim`,
      `attacking her motives for making the claim`,
      `restating her claim in different words`,
      `claiming that her conclusion is irrelevant`,
    ],
    correct: 0,
    explanation: `Concede-and-complicate. The others are not what he does.`,
  },
  {
    id: 'lsat_t0_110',
    topicId: 0,
    subtopic: 'lr_method',
    difficulty: 2,
    question: `Critic: The novel is racist.
Author: Many readers from the very community the novel depicts have praised it for treating that community with care and nuance.

The author responds to the critic by`,
    options: [
      `offering testimonial evidence that runs contrary to the critic's characterization`,
      `attacking the critic's personal motives`,
      `redefining the term "racism"`,
      `conceding the critic's claim while resisting its implications`,
      `appealing to an irrelevant authority`,
    ],
    correct: 0,
    explanation: `Counter-evidence from a relevant source. The others mischaracterize.`,
  },
  {
    id: 'lsat_t0_111',
    topicId: 0,
    subtopic: 'lr_method',
    difficulty: 3,
    question: `Some economists argue that consumer confidence drives consumer spending. But careful studies show that month-to-month changes in spending consistently precede, rather than follow, changes in consumer confidence indices. The supposed causal direction is therefore reversed.

The argument proceeds by`,
    options: [
      `using empirical timing data to argue that the proposed cause and effect are reversed`,
      `attacking the credentials of the economists`,
      `appealing to a moral principle`,
      `presenting a hypothetical scenario to undercut the conclusion`,
      `arguing from analogy to a comparable economic question`,
    ],
    correct: 0,
    explanation: `Temporal-order reversal — a classic causal-direction challenge. The others are absent.`,
  },
  {
    id: 'lsat_t0_112',
    topicId: 0,
    subtopic: 'lr_method',
    difficulty: 2,
    question: `Defenders of standardized testing point to the tests' reliability. But reliability — consistency of results — says nothing about whether tests measure what we actually care about. Defenders therefore mistake one virtue for another.

The argument's strategy is to`,
    options: [
      `distinguish between two concepts that are easily confused and show that the defense relies on the wrong one`,
      `attack the defenders' motives`,
      `argue from analogy to a different testing context`,
      `present a counter-example to the defenders' claim`,
      `appeal to popular opinion`,
    ],
    correct: 0,
    explanation: `Conceptual disambiguation (reliability vs validity). The others are absent.`,
  },
  {
    id: 'lsat_t0_113',
    topicId: 0,
    subtopic: 'lr_method',
    difficulty: 2,
    question: `Soraya: The fastest route to the airport is highway 9.
Levi: That cannot be right. Highway 9 was closed for resurfacing last week.

Levi responds to Soraya by`,
    options: [
      `presenting a factual claim intended to undermine the premise on which Soraya's claim relies`,
      `attacking Soraya's character`,
      `restating Soraya's claim with mocking emphasis`,
      `appealing to a general principle about routes`,
      `presenting a counter-example involving a different airport`,
    ],
    correct: 0,
    explanation: `Factual rebuttal. The others mischaracterize.`,
  },

  // --- lr_sufficient_assumption (7) ---
  {
    id: 'lsat_t0_114',
    topicId: 0,
    subtopic: 'lr_sufficient_assumption',
    difficulty: 2,
    question: `Every employee who completes the leadership program is promoted within a year. Jonas completed the leadership program last month. Therefore, Jonas will be promoted within a year.

The argument's conclusion follows logically if which of the following is assumed?`,
    options: [
      `(No assumption is required — already valid.)`,
      `Only employees who complete the leadership program are promoted within a year.`,
      `Most employees in the program are promoted.`,
      `Jonas is well qualified.`,
      `Promotions occur every year.`,
    ],
    correct: 0,
    explanation: `The argument is already deductively valid as written — the premises directly entail the conclusion. (B) is the converse and unneeded. (C), (D), (E) are unneeded.`,
  },
  {
    id: 'lsat_t0_115',
    topicId: 0,
    subtopic: 'lr_sufficient_assumption',
    difficulty: 2,
    question: `Any building taller than 80 meters in this district requires special foundation reinforcement. This building has special foundation reinforcement. Therefore, this building is taller than 80 meters.

The argument's conclusion follows logically if which of the following is assumed?`,
    options: [
      `Only buildings taller than 80 meters in this district have special foundation reinforcement.`,
      `All buildings have some form of foundation.`,
      `Most buildings in the district are tall.`,
      `Special reinforcement is expensive.`,
      `Reinforcement is required for all foundations.`,
    ],
    correct: 0,
    explanation: `Closing the converse: only tall buildings have reinforcement, so reinforcement implies tall. (B), (C), (D), (E) are insufficient.`,
  },
  {
    id: 'lsat_t0_116',
    topicId: 0,
    subtopic: 'lr_sufficient_assumption',
    difficulty: 2,
    question: `If a paper is accepted to the conference, it has passed peer review. This paper has passed peer review. Therefore, this paper has been accepted to the conference.

Which of the following, if assumed, allows the conclusion to be properly drawn?`,
    options: [
      `Any paper that passes peer review is accepted to the conference.`,
      `Most accepted papers pass peer review.`,
      `Some peer-reviewed papers are rejected.`,
      `The conference rejects most submissions.`,
      `Peer review is a long process.`,
    ],
    correct: 0,
    explanation: `Adds the converse, making the inference valid. (B), (C), (D), (E) are insufficient.`,
  },
  {
    id: 'lsat_t0_117',
    topicId: 0,
    subtopic: 'lr_sufficient_assumption',
    difficulty: 2,
    question: `Every member of the symphony has a music degree. The symphony's new percussionist has a music degree. Therefore, the new percussionist is a member of the symphony.

Which one of the following, if assumed, allows the conclusion to be properly drawn?`,
    options: [
      `Only members of the symphony have a music degree.`,
      `Most percussionists join symphonies.`,
      `Music degrees are widely available.`,
      `The symphony has at least one percussionist.`,
      `Members of the symphony work full-time.`,
    ],
    correct: 0,
    explanation: `Closes the converse. (B), (C), (D), (E) are insufficient.`,
  },
  {
    id: 'lsat_t0_118',
    topicId: 0,
    subtopic: 'lr_sufficient_assumption',
    difficulty: 3,
    question: `Whenever the river's flow exceeds 200 cubic meters per second, the spillway opens. The spillway is currently open. Therefore, the river's flow currently exceeds 200 cubic meters per second.

Which of the following, if assumed, allows the conclusion to be properly drawn?`,
    options: [
      `The spillway opens only when the river's flow exceeds 200 cubic meters per second.`,
      `The spillway closes automatically at low flows.`,
      `Operators check the spillway twice daily.`,
      `Some rivers never reach 200 cubic meters per second.`,
      `Spillways can be tested manually.`,
    ],
    correct: 0,
    explanation: `Adds the only-condition. (B), (C), (D), (E) are insufficient.`,
  },
  {
    id: 'lsat_t0_119',
    topicId: 0,
    subtopic: 'lr_sufficient_assumption',
    difficulty: 2,
    question: `Every employee who works on weekends earns overtime pay. Diana earns overtime pay. Therefore, Diana works on weekends.

Which one of the following, if assumed, allows the conclusion to be properly drawn?`,
    options: [
      `Only employees who work on weekends earn overtime pay.`,
      `Most overtime work is done on weekends.`,
      `Diana is a full-time employee.`,
      `Some employees work on weekends without overtime.`,
      `Overtime pay is higher than regular pay.`,
    ],
    correct: 0,
    explanation: `Closes the converse. (B), (C), (D), (E) are insufficient.`,
  },
  {
    id: 'lsat_t0_120',
    topicId: 0,
    subtopic: 'lr_sufficient_assumption',
    difficulty: 2,
    question: `If a film wins the festival's top prize, its director receives an honorary medal. This film's director has received an honorary medal. Therefore, the film has won the festival's top prize.

Which of the following, if assumed, allows the conclusion to be properly drawn?`,
    options: [
      `Only directors of films that win the festival's top prize receive honorary medals.`,
      `Most prize-winning directors receive medals.`,
      `Honorary medals are rarely awarded.`,
      `This year's festival had many entries.`,
      `Some directors have received multiple medals.`,
    ],
    correct: 0,
    explanation: `Closes the converse. (B), (C), (D), (E) are insufficient.`,
  },

  // --- lr_parallel (6) ---
  {
    id: 'lsat_t0_121',
    topicId: 0,
    subtopic: 'lr_parallel',
    difficulty: 2,
    question: `Every member of the orchestra plays at least one stringed instrument. Yuki is a member of the orchestra. Therefore, Yuki plays at least one stringed instrument.

Which of the following arguments has reasoning most similar to the argument above?`,
    options: [
      `Every employee at the firm has a law degree. Marco is an employee at the firm. So Marco has a law degree.`,
      `Most employees at the firm have a law degree. Marco is an employee. So Marco probably has a law degree.`,
      `Every employee at the firm has a law degree. Marco has a law degree. So Marco is an employee at the firm.`,
      `If you have a law degree, you can work at the firm. Marco has a law degree. So Marco works at the firm.`,
      `Some employees have law degrees. Marco is one. So Marco has a law degree.`,
    ],
    correct: 0,
    explanation: `(A) mirrors universal-instantiation with the same valid structure. (B) weakens to "most/probably." (C) reverses. (D) misuses conditional. (E) uses "some," not "all."`,
  },
  {
    id: 'lsat_t0_122',
    topicId: 0,
    subtopic: 'lr_parallel',
    difficulty: 2,
    question: `If the museum is open, the gift shop is open. The museum is open today. Therefore, the gift shop is open today.

Which of the following arguments most closely parallels the reasoning above?`,
    options: [
      `If the library is open, the printing room is staffed. The library is open today. So the printing room is staffed today.`,
      `If the library is open, the printing room is staffed. The printing room is staffed. So the library is open.`,
      `Every library has a printing room. This printing room is staffed. So this is a library.`,
      `The library is open today. Therefore, the printing room is also open.`,
      `Libraries usually have printing rooms.`,
    ],
    correct: 0,
    explanation: `Modus ponens. (B) is affirming the consequent. (C) is misclassified. (D) and (E) lack the conditional structure.`,
  },
  {
    id: 'lsat_t0_123',
    topicId: 0,
    subtopic: 'lr_parallel',
    difficulty: 2,
    question: `No reptiles are warm-blooded. Some pets are reptiles. Therefore, some pets are not warm-blooded.

Which of the following most closely parallels the structure of the argument above?`,
    options: [
      `No clarinets are brass instruments. Some school instruments are clarinets. So some school instruments are not brass instruments.`,
      `No clarinets are brass instruments. Some brass instruments are loud. So some clarinets are loud.`,
      `Every clarinet is a wind instrument. Some wind instruments are loud. So some clarinets are loud.`,
      `Most clarinets are wooden. Some woods are dense. So some clarinets are dense.`,
      `If a clarinet is in tune, it is well maintained. Some clarinets are well maintained. So some clarinets are in tune.`,
    ],
    correct: 0,
    explanation: `(A) replicates: no-X-are-Y + some-Z-are-X → some-Z-are-not-Y. The others use different forms.`,
  },
  {
    id: 'lsat_t0_124',
    topicId: 0,
    subtopic: 'lr_parallel',
    difficulty: 3,
    question: `Whenever a lecture is canceled, students receive a refund. Whenever students receive a refund, the registrar processes paperwork. Therefore, whenever a lecture is canceled, the registrar processes paperwork.

Which of the following has reasoning most similar to the argument above?`,
    options: [
      `Whenever it rains, the courtyard is wet. Whenever the courtyard is wet, the floor mats are replaced. Therefore, whenever it rains, the floor mats are replaced.`,
      `Whenever it rains, the courtyard is wet. The floor mats are replaced. Therefore, it rained.`,
      `Whenever the courtyard is wet, it has rained. The floor mats are replaced. Therefore, it has rained.`,
      `Whenever it rains, the courtyard might be wet. The mats may be replaced. So rain might have occurred.`,
      `Sometimes it rains. The courtyard is wet. So the mats are replaced.`,
    ],
    correct: 0,
    explanation: `(A) chains two conditionals identically. The others diverge structurally.`,
  },
  {
    id: 'lsat_t0_125',
    topicId: 0,
    subtopic: 'lr_parallel',
    difficulty: 2,
    question: `Every voting member of the council must reside in the city. Robert is a voting member of the council. Therefore, Robert resides in the city.

Which one of the following arguments has reasoning most similar to that above?`,
    options: [
      `Every certified plumber must have liability insurance. Mia is a certified plumber. So Mia has liability insurance.`,
      `Most certified plumbers have liability insurance. Mia is a certified plumber. So Mia probably has insurance.`,
      `Every certified plumber has insurance. Mia has insurance. So Mia is a certified plumber.`,
      `If a plumber is certified, the plumber must be licensed. Mia is licensed. So Mia is certified.`,
      `Some plumbers are certified. Mia is a plumber. So Mia is certified.`,
    ],
    correct: 0,
    explanation: `Same universal-instantiation pattern. (B), (C), (D), (E) diverge.`,
  },
  {
    id: 'lsat_t0_126',
    topicId: 0,
    subtopic: 'lr_parallel',
    difficulty: 2,
    question: `If it freezes overnight, the path becomes icy. If the path becomes icy, the morning run is canceled. Tomorrow morning's run was not canceled. Therefore, it did not freeze overnight.

Which of the following has reasoning most similar?`,
    options: [
      `If the alarm is set, the door is locked. If the door is locked, the dog stays inside. The dog did not stay inside. So the alarm was not set.`,
      `If the alarm is set, the door is locked. The alarm was set. So the door is locked.`,
      `If the alarm is set, the door is locked. The door is locked. So the alarm was set.`,
      `The alarm is sometimes set. The door is sometimes locked. So sometimes both.`,
      `The alarm is set whenever the door is locked. The alarm is not set. So the door is not locked.`,
    ],
    correct: 0,
    explanation: `Both chains forward then contrapose. (B) is modus ponens. (C) affirms the consequent. (D) and (E) diverge.`,
  },

  // --- lr_parallel_flaw (4) ---
  {
    id: 'lsat_t0_127',
    topicId: 0,
    subtopic: 'lr_parallel_flaw',
    difficulty: 2,
    question: `If a student studies for the exam, the student passes. Inez passed. Therefore, Inez studied for the exam.

Which of the following arguments contains a flaw most similar to the one in the argument above?`,
    options: [
      `If a film is shown at the festival, it has been reviewed. This film has been reviewed. So this film was shown at the festival.`,
      `Every student who passes has studied. Inez studied. So Inez passed.`,
      `Most students who study pass. Inez studied. So Inez probably passed.`,
      `If a student studies, the student passes. Inez did not pass. So Inez did not study.`,
      `Either Inez studied or she did not pass. Inez did not study. So she did not pass.`,
    ],
    correct: 0,
    explanation: `(A) affirms the consequent, mirroring the original flaw. (B) is valid in a different direction. (C) qualifies "most/probably." (D) is modus tollens, valid. (E) is a different fallacy.`,
  },
  {
    id: 'lsat_t0_128',
    topicId: 0,
    subtopic: 'lr_parallel_flaw',
    difficulty: 2,
    question: `Whenever the smoke detector is triggered, the sprinkler activates. The smoke detector was not triggered. Therefore, the sprinkler did not activate.

Which of the following arguments contains a flaw most similar?`,
    options: [
      `If the gate is locked, the alarm is armed. The gate is not locked. So the alarm is not armed.`,
      `If the gate is locked, the alarm is armed. The alarm is not armed. So the gate is not locked.`,
      `Whenever the gate is locked, the alarm is armed. The gate is locked. So the alarm is armed.`,
      `Most locked gates have armed alarms. The gate is locked. So the alarm is probably armed.`,
      `If the gate is locked, the alarm may be armed.`,
    ],
    correct: 0,
    explanation: `Denying the antecedent in both. (B) is valid contrapositive. (C) is valid modus ponens. (D) is "most/probably." (E) is hedged.`,
  },
  {
    id: 'lsat_t0_129',
    topicId: 0,
    subtopic: 'lr_parallel_flaw',
    difficulty: 3,
    question: `Every champion has trained hard. Maya trains hard. Therefore, Maya is a champion.

Which of the following has a flaw most similar?`,
    options: [
      `Every doctor has studied biology. Reza has studied biology. So Reza is a doctor.`,
      `Most doctors have studied biology. Reza studied biology. So Reza is probably a doctor.`,
      `Every doctor has studied biology. Reza is a doctor. So Reza has studied biology.`,
      `If Reza is a doctor, Reza has studied biology. Reza has not studied biology. So Reza is not a doctor.`,
      `Some who study biology become doctors. Reza studies biology. So Reza will become a doctor.`,
    ],
    correct: 0,
    explanation: `Both treat a necessary condition as sufficient. (B) hedges. (C) is valid. (D) is modus tollens. (E) is a different fallacy.`,
  },
  {
    id: 'lsat_t0_130',
    topicId: 0,
    subtopic: 'lr_parallel_flaw',
    difficulty: 2,
    question: `If the film is excellent, the theater is full. The theater is full. Therefore, the film is excellent.

Which of the following has a flaw most similar?`,
    options: [
      `If the restaurant is excellent, the line is long. The line is long. So the restaurant is excellent.`,
      `The new film is widely advertised. So the film must be excellent.`,
      `Many film critics praised the new film. So the film must be excellent.`,
      `The new film must be excellent. The director is famous.`,
      `If the film is excellent, the theater is full. The film is excellent. So the theater is full.`,
    ],
    correct: 0,
    explanation: `Both affirm the consequent. (B), (C), (D) are different fallacies. (E) is valid modus ponens.`,
  },

  // --- lr_point_at_issue (4) ---
  {
    id: 'lsat_t0_131',
    topicId: 0,
    subtopic: 'lr_point_at_issue',
    difficulty: 2,
    question: `Hana: Free public transit would reduce traffic congestion and benefit the city.
Owen: Free public transit would erode farebox revenue and force cuts to service quality, ultimately worsening transit for the riders who need it most.

Hana and Owen disagree about whether`,
    options: [
      `free public transit would, on balance, benefit the city`,
      `traffic congestion is a problem`,
      `farebox revenue funds transit operations`,
      `public transit serves many riders`,
      `service quality affects ridership`,
    ],
    correct: 0,
    explanation: `(A) is the disagreement. (B), (C), (D), (E) are not directly contested.`,
  },
  {
    id: 'lsat_t0_132',
    topicId: 0,
    subtopic: 'lr_point_at_issue',
    difficulty: 2,
    question: `Lila: Public museums should be free, because their educational benefit is greatest when access is universal.
Theo: Free admission sounds appealing, but in practice it tends to crowd out school groups and disabled visitors who benefit from quieter, scheduled visits.

Lila and Theo disagree about whether`,
    options: [
      `eliminating museum admission fees would, on balance, advance the educational mission of museums`,
      `museums have an educational mission`,
      `school groups attend museums`,
      `disabled visitors need accommodations`,
      `museums charge admission`,
    ],
    correct: 0,
    explanation: `(A) is the disagreement. (B), (C), (D), (E) are not directly disputed.`,
  },
  {
    id: 'lsat_t0_133',
    topicId: 0,
    subtopic: 'lr_point_at_issue',
    difficulty: 2,
    question: `Carmen: Cities should plant more street trees to reduce summer heat.
Devon: Most of the heat reduction from trees comes from shade. Where shade falls on parked cars rather than people, the public health benefit is small.

Carmen and Devon disagree about whether`,
    options: [
      `planting more street trees in general would significantly reduce summer heat exposure for residents`,
      `street trees provide shade`,
      `cars are common in urban areas`,
      `street trees are aesthetically pleasing`,
      `summer heat is a public health concern`,
    ],
    correct: 0,
    explanation: `Carmen advocates planting for residents' heat benefit; Devon argues the benefit is often misallocated. (B), (C), (D), (E) are not points of disagreement.`,
  },
  {
    id: 'lsat_t0_134',
    topicId: 0,
    subtopic: 'lr_point_at_issue',
    difficulty: 3,
    question: `Sasha: Universities should weight a strong essay heavily in admissions, since essays reveal qualities standardized tests cannot measure.
Bernard: Essays disproportionately reflect access to coaching, so weighting them heavily simply reproduces existing inequalities under a different label.

Sasha and Bernard disagree about whether`,
    options: [
      `heavy reliance on essays in admissions is a sound way to measure the qualities universities should care about`,
      `essays measure qualities that standardized tests do not`,
      `coaching is widely available`,
      `inequality is a concern in higher education`,
      `standardized tests are flawed`,
    ],
    correct: 0,
    explanation: `(A) is the core dispute. (B), (C), (D), (E) are not the direct disagreement.`,
  },

  // --- lr_eval_argument (3) ---
  {
    id: 'lsat_t0_135',
    topicId: 0,
    subtopic: 'lr_eval_argument',
    difficulty: 2,
    question: `City planner: Our new bus-only lane will reduce average commute times. After installation, average commute times on this corridor fell by 15 percent.

The answer to which of the following questions would be most useful in evaluating the planner's argument?`,
    options: [
      `Did average commute times on comparable corridors without bus-only lanes fall by a similar amount over the same period?`,
      `Were buses comfortable for riders?`,
      `Did the lane construction take longer than scheduled?`,
      `How many riders use the bus daily?`,
      `Does the city plan more bus lanes in the future?`,
    ],
    correct: 0,
    explanation: `(A) addresses the key counterfactual. The others are tangential.`,
  },
  {
    id: 'lsat_t0_136',
    topicId: 0,
    subtopic: 'lr_eval_argument',
    difficulty: 2,
    question: `Researcher: Our new fertilizer increases crop yield. Plots treated with the fertilizer produced 25 percent more crop than untreated plots.

The answer to which of the following questions would be most useful in evaluating the researcher's argument?`,
    options: [
      `Were the treated and untreated plots randomly assigned and otherwise comparable in soil, water, and management?`,
      `Is the fertilizer expensive?`,
      `What is the chemical composition of the fertilizer?`,
      `Did the researcher have prior publications?`,
      `How long did the experiment last?`,
    ],
    correct: 0,
    explanation: `(A) addresses confounding. (E) is partly relevant but secondary. The others are tangential.`,
  },
  {
    id: 'lsat_t0_137',
    topicId: 0,
    subtopic: 'lr_eval_argument',
    difficulty: 3,
    question: `Manager: Our new workplace wellness program has reduced sick days. Employees who enrolled took 30 percent fewer sick days last year than employees who did not enroll.

The answer to which of the following questions would be most useful in evaluating the manager's argument?`,
    options: [
      `Are employees who self-select into the wellness program already healthier than those who do not?`,
      `Does the program include exercise classes?`,
      `What is the program's annual budget?`,
      `Do other companies offer similar programs?`,
      `Are sick days policy-limited?`,
    ],
    correct: 0,
    explanation: `(A) targets self-selection bias. The others are tangential.`,
  },

  // --- lr_complete (3) ---
  {
    id: 'lsat_t0_138',
    topicId: 0,
    subtopic: 'lr_complete',
    difficulty: 2,
    question: `The new lecture hall has been criticized for its difficult-to-read signage. While reading distance is an important consideration, signage is most often read by people who are already familiar with the layout of the building. The signage in the lecture hall is therefore _____.

Which of the following most logically completes the argument?`,
    options: [
      `serving less of a wayfinding function than the criticism assumes, and the criticism may overstate the design flaw`,
      `entirely useless`,
      `the most important feature of the hall`,
      `widely admired by visitors`,
      `produced by a famous designer`,
    ],
    correct: 0,
    explanation: `(A) follows naturally from the qualifier about familiar readers. (B) is too strong. (C), (D), (E) are unsupported.`,
  },
  {
    id: 'lsat_t0_139',
    topicId: 0,
    subtopic: 'lr_complete',
    difficulty: 2,
    question: `Students often complain about textbook prices. New editions are released every two or three years, even though the underlying material in most introductory textbooks has changed little over decades. The publishers' practice of issuing frequent new editions appears designed primarily to _____.

Which of the following most logically completes the argument?`,
    options: [
      `disrupt the secondhand market for older editions and force students to buy new copies`,
      `reflect the rapid pace of scientific progress in the field`,
      `train students to think critically about sources`,
      `reduce the price of new editions`,
      `improve the durability of textbooks`,
    ],
    correct: 0,
    explanation: `(A) matches the economic logic of frequent editions. (B) is contradicted by the premise. (C), (D), (E) are unsupported.`,
  },
  {
    id: 'lsat_t0_140',
    topicId: 0,
    subtopic: 'lr_complete',
    difficulty: 1,
    question: `The new community center attracts visitors of all ages. Its programs serve children, teens, working adults, and retirees alike. Anyone who plans new community programs in the city should therefore _____.

Which of the following most logically completes the argument?`,
    options: [
      `consider whether the program will reach across age groups as the community center does`,
      `prefer programs that target only retirees`,
      `avoid copying the community center's hours`,
      `lower the fees of competing programs`,
      `relocate to the same neighborhood as the community center`,
    ],
    correct: 0,
    explanation: `(A) generalizes the lesson. The others do not follow.`,
  },

  // ============================================================
  // TOPIC 1 — READING COMPREHENSION (60 questions)
  // ============================================================

  // ----- Passage A (Qs 1–4): Paleontology of feathered dinosaurs -----
  {
    id: 'lsat_t1_001',
    topicId: 1,
    subtopic: 'rc_main_point',
    difficulty: 2,
    question: `Questions 1–4 refer to the following passage:

Until the 1990s, most paleontologists treated feathers as a unique mark of birds. Then a series of Chinese fossils from the Yixian Formation revealed small theropod dinosaurs whose bodies bore filaments arranged in patterns indistinguishable from those of modern down. Some specimens preserved branching structures that could only be interpreted as true feathers. The conclusion — that feathers evolved well before the origin of birds — overturned a century of textbook claims. It also reframed the question of feathers' function. Since these dinosaurs were almost certainly flightless, feathers must have served other purposes first: insulation, display, perhaps brooding. Flight, in this revised picture, was a later co-option of an existing structure.

Which of the following most accurately expresses the main point of the passage?`,
    options: [
      `Fossils from the Yixian Formation show that feathers predated birds and originally served non-flight functions, requiring revision of earlier views.`,
      `Theropod dinosaurs were the direct ancestors of all modern birds.`,
      `Chinese paleontology surpassed Western paleontology in the 1990s.`,
      `Feathers must have evolved primarily for display purposes.`,
      `The Yixian Formation contains the oldest fossils known.`,
    ],
    correct: 0,
    explanation: `(A) captures both halves of the passage. (B) overstates ancestry. (C) injects a comparison not in the text. (D) cherry-picks one possible function. (E) is unsupported.`,
  },
  {
    id: 'lsat_t1_002',
    topicId: 1,
    subtopic: 'rc_detail',
    difficulty: 1,
    question: `According to the passage, the Yixian fossils included structures interpreted as`,
    options: [
      `true feathers as well as simpler filaments`,
      `only down filaments without branching`,
      `evidence of powered flight in small theropods`,
      `skeletal remains identical to those of modern birds`,
      `nests with preserved eggs`,
    ],
    correct: 0,
    explanation: `The passage states that "some specimens preserved branching structures that could only be interpreted as true feathers," in addition to down-like filaments. (B) ignores the branching evidence. (C), (D), (E) are unsupported.`,
  },
  {
    id: 'lsat_t1_003',
    topicId: 1,
    subtopic: 'rc_function',
    difficulty: 2,
    question: `The author mentions "insulation, display, perhaps brooding" most likely in order to`,
    options: [
      `illustrate alternative functions that feathers might have served before flight`,
      `argue that brooding is the original function of feathers`,
      `defend the textbook claim about feathers and birds`,
      `imply that all dinosaurs incubated eggs`,
      `criticize earlier paleontological methods`,
    ],
    correct: 0,
    explanation: `The list serves as candidate non-flight functions. (B) overstates "perhaps." (C), (D), (E) misread.`,
  },
  {
    id: 'lsat_t1_004',
    topicId: 1,
    subtopic: 'rc_inference',
    difficulty: 2,
    question: `It can be inferred from the passage that the author would most likely agree with which of the following?`,
    options: [
      `A trait that ultimately enables flight may originate for entirely unrelated reasons.`,
      `Feathers are unique to species capable of powered flight.`,
      `Textbook claims should rarely be revised.`,
      `Paleontologists rarely change their views.`,
      `Birds did not evolve from theropod dinosaurs.`,
    ],
    correct: 0,
    explanation: `(A) restates the co-option idea — the central inference. (B) is the discarded textbook claim. (C), (D), (E) are unsupported.`,
  },

  // ----- Passage B (Qs 5–8): Curator essay on the still life -----
  {
    id: 'lsat_t1_005',
    topicId: 1,
    subtopic: 'rc_main_point',
    difficulty: 2,
    question: `Questions 5–8 refer to the following passage:

The still life was long considered the least ambitious of painterly genres — beneath history painting, beneath portraiture, sometimes barely above mere decoration. Yet recent scholarship has begun to recover the still life as a form of philosophical reflection. The Dutch and Flemish painters of the 17th century arranged fruits, glassware, and game animals not simply as displays of skill but as quiet meditations on time, decay, and the conditions of perception. To read a 17th-century still life is therefore to read a kind of essay — one whose argument is composed of light, surface, and arrangement. The genre's perceived modesty was itself a rhetorical strategy.

The primary purpose of the passage is to`,
    options: [
      `argue that the 17th-century still life was a vehicle for philosophical reflection rather than mere decoration`,
      `compare Dutch and Flemish painters`,
      `criticize earlier scholarship for ignoring portraiture`,
      `describe how to identify a still life`,
      `trace the still life's influence on modern art`,
    ],
    correct: 0,
    explanation: `(A) matches the passage's main move. (B), (C), (D), (E) are tangential.`,
  },
  {
    id: 'lsat_t1_006',
    topicId: 1,
    subtopic: 'rc_attitude',
    difficulty: 2,
    question: `The author's attitude toward earlier rankings of the still life is best described as`,
    options: [
      `politely revisionist`,
      `enthusiastically defensive`,
      `openly hostile`,
      `indifferent`,
      `nostalgic`,
    ],
    correct: 0,
    explanation: `The author neither rages nor sentimentalizes; she calmly proposes a revision. (B) is too strong. (C), (D), (E) miss the tone.`,
  },
  {
    id: 'lsat_t1_007',
    topicId: 1,
    subtopic: 'rc_function',
    difficulty: 2,
    question: `The phrase "one whose argument is composed of light, surface, and arrangement" functions in the passage to`,
    options: [
      `extend the analogy between still life and written essay by identifying the visual elements that carry the argument`,
      `summarize the materials available to 17th-century painters`,
      `criticize painters who prioritized arrangement`,
      `define the term "still life"`,
      `dismiss recent scholarship`,
    ],
    correct: 0,
    explanation: `It develops the essay-analogy by listing what corresponds to verbal argument. The others misread.`,
  },
  {
    id: 'lsat_t1_008',
    topicId: 1,
    subtopic: 'rc_inference',
    difficulty: 2,
    question: `It can be inferred from the passage that the author considers the still life's traditional ranking to be`,
    options: [
      `a misreading of the genre's actual ambitions, perhaps even one the genre itself encouraged`,
      `an accurate appraisal that recent scholarship overcorrects`,
      `the result of a conspiracy among portraitists`,
      `irrelevant to current museum practice`,
      `evidence of declining artistic standards`,
    ],
    correct: 0,
    explanation: `The last sentence — modesty as rhetorical strategy — supports (A). The others are unsupported.`,
  },

  // ----- Passage C (Qs 9–12): Historiography of the Black Death -----
  {
    id: 'lsat_t1_009',
    topicId: 1,
    subtopic: 'rc_main_point',
    difficulty: 2,
    question: `Questions 9–12 refer to the following passage:

For most of the 20th century, historians of the Black Death treated the demographic catastrophe of the 14th century as a sufficient explanation for the social and economic upheavals that followed. Population collapse, on this view, mechanically generated labor shortages, wage gains, and weakening of feudal obligations. Recent work has complicated the story. Detailed regional studies show that comparable mortality often produced very different outcomes, depending on prior land-tenure arrangements, the local strength of guilds, and the legal codes that governed inheritance and tenancy. The plague was a powerful shock; what it produced depended on the structures it struck.

The main idea of the passage is that`,
    options: [
      `local institutional structures, more than the plague's mortality, shaped the social and economic outcomes that followed`,
      `historians have abandoned all earlier accounts of the Black Death`,
      `wages always rise after population collapse`,
      `the Black Death affected most of Europe identically`,
      `guilds were the primary beneficiaries of the plague`,
    ],
    correct: 0,
    explanation: `(A) is the passage's pivot. (B) overstates. (C), (D) are contradicted. (E) is unsupported.`,
  },
  {
    id: 'lsat_t1_010',
    topicId: 1,
    subtopic: 'rc_detail',
    difficulty: 1,
    question: `According to the passage, the older view of the Black Death held that`,
    options: [
      `mortality alone mechanically drove the subsequent social and economic changes`,
      `local institutions were the principal cause of post-plague changes`,
      `wages did not rise after the plague`,
      `feudal obligations strengthened after the plague`,
      `mortality varied significantly by region`,
    ],
    correct: 0,
    explanation: `Directly stated. The others either reverse the view or are details not aligned with the older view.`,
  },
  {
    id: 'lsat_t1_011',
    topicId: 1,
    subtopic: 'rc_function',
    difficulty: 2,
    question: `The clause "what it produced depended on the structures it struck" serves to`,
    options: [
      `summarize the passage's central revision of the older view in a single image`,
      `defend the older view by emphasizing mortality`,
      `argue that the plague had no effect in some regions`,
      `dismiss regional studies as inconclusive`,
      `propose a new method for studying epidemics`,
    ],
    correct: 0,
    explanation: `The closing line distills the revision. The others misread.`,
  },
  {
    id: 'lsat_t1_012',
    topicId: 1,
    subtopic: 'rc_inference',
    difficulty: 3,
    question: `It can be inferred from the passage that two regions experiencing the same plague mortality might`,
    options: [
      `have ended up with substantially different wage and tenancy outcomes depending on their pre-existing institutions`,
      `have inevitably experienced the same outcomes`,
      `have had identical guild structures`,
      `have abandoned feudalism at the same rate`,
      `have rejected all changes to inheritance law`,
    ],
    correct: 0,
    explanation: `Direct consequence of the passage. The others contradict.`,
  },

  // ----- Passage D (Qs 13–16): Materials science of self-healing concrete -----
  {
    id: 'lsat_t1_013',
    topicId: 1,
    subtopic: 'rc_main_point',
    difficulty: 2,
    question: `Questions 13–16 refer to the following passage:

Conventional concrete cracks as it ages. Once a crack penetrates to the reinforcing steel, corrosion accelerates and structural integrity declines. Self-healing concretes attempt to interrupt this process by embedding agents — bacterial spores, encapsulated polymers, or reactive minerals — that activate when a crack admits water. The bacteria precipitate calcium carbonate; the polymers swell and bind; the minerals form additional hydrates. Each approach is partial: bacterial systems are limited by the depth at which spores remain viable; polymers are sensitive to temperature; mineral systems work only for narrow crack widths. The technology will likely advance through hybridization rather than the dominance of any single mechanism.

The main point of the passage is that`,
    options: [
      `self-healing concretes use multiple chemical mechanisms, each with limitations, and progress will likely come from combining them`,
      `bacterial spores are the most promising approach`,
      `concrete cannot be made fully self-healing`,
      `polymer-based systems will dominate the market`,
      `corrosion of reinforcing steel is unavoidable`,
    ],
    correct: 0,
    explanation: `(A) tracks both halves. The others are too narrow or contradicted.`,
  },
  {
    id: 'lsat_t1_014',
    topicId: 1,
    subtopic: 'rc_detail',
    difficulty: 1,
    question: `According to the passage, the bacterial approach to self-healing concrete is limited by`,
    options: [
      `the depth at which bacterial spores remain viable`,
      `the cost of producing the spores`,
      `interference with the reinforcing steel`,
      `low temperatures at the surface`,
      `the narrowness of cracks at which it works`,
    ],
    correct: 0,
    explanation: `Directly stated. (B) and (D) are not mentioned as limits on the bacterial approach. (E) is the mineral-system limit. (C) is unsupported.`,
  },
  {
    id: 'lsat_t1_015',
    topicId: 1,
    subtopic: 'rc_function',
    difficulty: 2,
    question: `The passage's discussion of each approach's limitations primarily serves to`,
    options: [
      `motivate the closing claim that hybrid systems are the most promising path forward`,
      `argue that self-healing concrete is impractical`,
      `compare costs across the three mechanisms`,
      `defend the use of conventional concrete`,
      `criticize researchers who favor polymers`,
    ],
    correct: 0,
    explanation: `The limits set up the hybridization conclusion. The others misread.`,
  },
  {
    id: 'lsat_t1_016',
    topicId: 1,
    subtopic: 'rc_application',
    difficulty: 3,
    question: `Based on the passage, which of the following research directions would be most consistent with the author's outlook?`,
    options: [
      `Combining encapsulated polymers with reactive minerals to extend healing across a wider range of crack widths and temperatures`,
      `Abandoning self-healing research in favor of more frequent inspections`,
      `Selecting a single agent and optimizing it to the exclusion of others`,
      `Reducing the use of reinforcing steel`,
      `Treating cracks only after they reach the steel`,
    ],
    correct: 0,
    explanation: `(A) is a hybrid combining complementary mechanisms — directly in line with the closing claim. The others contradict.`,
  },

  // ----- Passage E (Qs 17–20): Cognitive science of mental imagery -----
  {
    id: 'lsat_t1_017',
    topicId: 1,
    subtopic: 'rc_main_point',
    difficulty: 2,
    question: `Questions 17–20 refer to the following passage:

For most of the 20th century, psychologists assumed that nearly everyone could form a vivid mental image — could "see" an apple in the mind's eye. In the early 2010s, however, careful surveys revealed a small but consistent fraction of people who report no visual imagery whatsoever; the condition has come to be called aphantasia. Critics initially suspected reporting artifact: perhaps these participants simply used the language of imagery less freely. But subsequent objective tests — pupillary responses to imagined bright light, performance on mental-rotation tasks — confirmed that the difference is real, not merely verbal. The discovery has prompted a broader question: how much of what we take to be universal cognition rests on assumptions never tested?

The author's main point is that`,
    options: [
      `the discovery of aphantasia exposes how much "universal" cognitive variation has been assumed rather than tested`,
      `aphantasia is more common than once believed`,
      `mental imagery is the central feature of human cognition`,
      `pupillary responses are the best test of mental imagery`,
      `psychology in the 20th century was generally unreliable`,
    ],
    correct: 0,
    explanation: `(A) tracks the closing reframing. (B) and (C) overstate. (D) cherry-picks. (E) is too broad.`,
  },
  {
    id: 'lsat_t1_018',
    topicId: 1,
    subtopic: 'rc_detail',
    difficulty: 1,
    question: `According to the passage, early critics of aphantasia research suspected that`,
    options: [
      `participants who reported no imagery were simply using imagery language less freely`,
      `the condition was caused by neurological damage`,
      `pupillary responses were unreliable`,
      `mental rotation tasks were too easy`,
      `aphantasia was common only in older adults`,
    ],
    correct: 0,
    explanation: `Directly stated. (B), (C), (D), (E) are unsupported.`,
  },
  {
    id: 'lsat_t1_019',
    topicId: 1,
    subtopic: 'rc_function',
    difficulty: 2,
    question: `The mention of "pupillary responses to imagined bright light" functions in the passage to`,
    options: [
      `provide an example of an objective test that supported the reality of aphantasia`,
      `describe a treatment for aphantasia`,
      `argue against subjective survey methods generally`,
      `define the term "imagery"`,
      `criticize earlier neuroscience research`,
    ],
    correct: 0,
    explanation: `It is an example of objective corroboration. The others misread.`,
  },
  {
    id: 'lsat_t1_020',
    topicId: 1,
    subtopic: 'rc_inference',
    difficulty: 2,
    question: `It can be inferred from the passage that the author would most likely agree with which of the following?`,
    options: [
      `Aspects of cognition long treated as universal may reflect untested assumptions about variability across individuals.`,
      `Aphantasia is the most important discovery in cognitive science.`,
      `Imagery plays no causal role in cognition.`,
      `Pupillary tests should replace surveys in psychology.`,
      `Cognitive variation is largely cultural.`,
    ],
    correct: 0,
    explanation: `(A) generalizes the closing question. (B), (C), (D), (E) overstate or go beyond the text.`,
  },

  // ----- Passage F (Qs 21–24): Constitutional interpretation -----
  {
    id: 'lsat_t1_021',
    topicId: 1,
    subtopic: 'rc_structure',
    difficulty: 2,
    question: `Questions 21–24 refer to the following passage:

Two broad approaches to constitutional interpretation dominate contemporary legal theory. Originalism holds that the meaning of a constitutional provision is fixed at the time of its ratification and that judges should apply that meaning unchanged. Living constitutionalism, by contrast, treats the document as a framework whose application evolves with the polity it governs. Each approach is often defended in terms of legitimacy: originalists argue that fixed meanings constrain unelected judges, while living constitutionalists argue that responsiveness to changing circumstances preserves the document's claim on a society that did not draft it. The deeper disagreement is not about texts but about who counts as the document's ongoing author.

The passage is primarily organized around`,
    options: [
      `presenting two interpretive approaches, their legitimacy arguments, and then locating the underlying disagreement`,
      `defending originalism against living constitutionalism`,
      `tracing the history of constitutional interpretation`,
      `summarizing recent Supreme Court cases`,
      `defining technical legal terms`,
    ],
    correct: 0,
    explanation: `Structure: definitions → legitimacy arguments → identification of root issue. The others mischaracterize.`,
  },
  {
    id: 'lsat_t1_022',
    topicId: 1,
    subtopic: 'rc_detail',
    difficulty: 1,
    question: `According to the passage, living constitutionalists defend their approach on the ground that`,
    options: [
      `responsiveness to changing circumstances preserves the document's claim on a society that did not draft it`,
      `fixed meanings constrain unelected judges`,
      `the Constitution lacks coherent meaning`,
      `judges should defer to current public opinion polls`,
      `older interpretations were undemocratic`,
    ],
    correct: 0,
    explanation: `Directly stated. (B) is the originalist argument. (C), (D), (E) are unsupported.`,
  },
  {
    id: 'lsat_t1_023',
    topicId: 1,
    subtopic: 'rc_function',
    difficulty: 2,
    question: `The final sentence ("The deeper disagreement is not about texts but about who counts as the document's ongoing author") functions in the passage to`,
    options: [
      `reframe the dispute at a more fundamental level than the legitimacy arguments suggest`,
      `take sides between originalism and living constitutionalism`,
      `define the term "constitution"`,
      `dismiss both approaches as unworkable`,
      `summarize a Supreme Court holding`,
    ],
    correct: 0,
    explanation: `It is the author's reframing move. The others misread.`,
  },
  {
    id: 'lsat_t1_024',
    topicId: 1,
    subtopic: 'rc_attitude',
    difficulty: 2,
    question: `The author's attitude toward the two approaches presented in the passage is best described as`,
    options: [
      `analytically balanced, treating each as defensible while pointing to a deeper underlying dispute`,
      `firmly partisan in favor of originalism`,
      `firmly partisan in favor of living constitutionalism`,
      `dismissive of both`,
      `nostalgic for an earlier consensus`,
    ],
    correct: 0,
    explanation: `(A) matches the even-handed treatment. The others are off.`,
  },

  // ----- Passage G (Qs 25–28): Marine biology of coral resilience -----
  {
    id: 'lsat_t1_025',
    topicId: 1,
    subtopic: 'rc_main_point',
    difficulty: 2,
    question: `Questions 25–28 refer to the following passage:

Coral bleaching is often described as the breakdown of a partnership: under heat stress, corals expel the symbiotic algae that supply most of their nutrition. Whether the partnership can be repaired depends on factors that vary across both species and individual reefs. Some corals harbor algal strains that tolerate warmer temperatures; some sit in waters with sufficient currents to dissipate heat; some reefs include patches whose microclimates remain cooler. A reef's overall resilience reflects this mosaic — local refuges from which recovery can begin once temperatures return to typical ranges.

The main point of the passage is that`,
    options: [
      `coral reef resilience to bleaching depends on a mosaic of species, symbiont, and microclimate factors that vary within and across reefs`,
      `coral bleaching is caused only by heat`,
      `all coral species are equally vulnerable to bleaching`,
      `algal symbionts are unimportant to coral nutrition`,
      `current speeds determine reef survival`,
    ],
    correct: 0,
    explanation: `(A) captures the mosaic claim. The others overgeneralize, simplify, or focus on one factor.`,
  },
  {
    id: 'lsat_t1_026',
    topicId: 1,
    subtopic: 'rc_detail',
    difficulty: 1,
    question: `According to the passage, factors contributing to a reef's resilience include`,
    options: [
      `species composition, heat-tolerant symbionts, and cooler microclimates`,
      `chemical pollution and predator levels`,
      `sediment loads and salinity changes`,
      `wave heights and ocean acidification`,
      `the proximity of human settlements`,
    ],
    correct: 0,
    explanation: `Directly listed. (B), (C), (D), (E) are not in the passage.`,
  },
  {
    id: 'lsat_t1_027',
    topicId: 1,
    subtopic: 'rc_function',
    difficulty: 2,
    question: `The word "mosaic" functions in the passage to`,
    options: [
      `convey that resilience depends on patchy, variable local conditions rather than uniform reef-wide factors`,
      `evoke the visual beauty of reefs`,
      `argue that reefs are made of tiles`,
      `describe a kind of algal symbiont`,
      `compare reefs to ancient artworks`,
    ],
    correct: 0,
    explanation: `It's a metaphor for patchy local heterogeneity. The others miss the function.`,
  },
  {
    id: 'lsat_t1_028',
    topicId: 1,
    subtopic: 'rc_inference',
    difficulty: 2,
    question: `It can be inferred from the passage that two reefs of similar size and species composition could differ significantly in resilience because`,
    options: [
      `their currents, microclimates, or symbiont strains may differ`,
      `their water depth is always different`,
      `bleaching affects only certain reefs`,
      `algal symbionts are absent from one`,
      `currents are unimportant to coral biology`,
    ],
    correct: 0,
    explanation: `The other listed factors can independently vary. The others contradict.`,
  },

  // ----- Passage H (Qs 29–32): Music history of recorded sound -----
  {
    id: 'lsat_t1_029',
    topicId: 1,
    subtopic: 'rc_main_point',
    difficulty: 2,
    question: `Questions 29–32 refer to the following passage:

Recorded sound altered not only how music reached listeners but how music itself was made. Performers who once tailored each performance to the room before them now had to consider, additionally, the abstract listener at home. Composers gradually internalized the timing and dynamic constraints of recording media, writing works that fit the available formats. The three-minute popular song, no less than the modernist work composed to fit an LP side, bears the trace of the technology that delivered it. Recording is not a transparent window onto musical practice; it is part of musical practice.

The author's main point is that`,
    options: [
      `recording technologies have shaped the music itself, not merely its delivery`,
      `live performance is superior to recorded music`,
      `LP-length compositions are inferior to shorter works`,
      `composers should ignore recording constraints`,
      `recording is irrelevant to musical history`,
    ],
    correct: 0,
    explanation: `(A) restates the closing claim. The others contradict or distort.`,
  },
  {
    id: 'lsat_t1_030',
    topicId: 1,
    subtopic: 'rc_detail',
    difficulty: 1,
    question: `According to the passage, the three-minute popular song is`,
    options: [
      `partly a product of the constraints of recording media`,
      `the only durable format for popular music`,
      `unaffected by recording technologies`,
      `older than recorded sound`,
      `derived from modernist composition`,
    ],
    correct: 0,
    explanation: `Directly stated. The others contradict or are unsupported.`,
  },
  {
    id: 'lsat_t1_031',
    topicId: 1,
    subtopic: 'rc_function',
    difficulty: 2,
    question: `The sentence "Recording is not a transparent window onto musical practice; it is part of musical practice" functions in the passage to`,
    options: [
      `summarize the passage's claim about recording's constitutive role in music`,
      `acknowledge that recordings can mislead listeners`,
      `defend live performance against recorded music`,
      `propose a new method for studying music`,
      `criticize recording engineers`,
    ],
    correct: 0,
    explanation: `It is the passage's distillation. The others misread.`,
  },
  {
    id: 'lsat_t1_032',
    topicId: 1,
    subtopic: 'rc_inference',
    difficulty: 2,
    question: `It can be inferred from the passage that a music historian who studies a 1960s popular song would best understand it by`,
    options: [
      `attending to the constraints of the recording media on which it was made`,
      `ignoring the recording medium and focusing on the score`,
      `comparing it only to live performances of earlier centuries`,
      `treating recording as merely a delivery mechanism`,
      `dismissing all technological influences as superficial`,
    ],
    correct: 0,
    explanation: `Directly implied. The others contradict.`,
  },

  // ----- Passage I (Qs 33–36): Linguistic study of small languages -----
  {
    id: 'lsat_t1_033',
    topicId: 1,
    subtopic: 'rc_main_point',
    difficulty: 2,
    question: `Questions 33–36 refer to the following passage:

Endangered languages are sometimes treated as if their loss were principally a cultural matter — a loss of identity for the communities that spoke them. The loss is that, but it is also, less visibly, a loss for linguistic science. Each language tested against the inventory of possible human grammars constrains general theory; languages with rare features carry more inferential weight than languages whose features are widely shared. When a small language with an unusual evidentiality system or sound inventory falls out of daily use, the working sample of human grammars contracts.

The main point of the passage is that`,
    options: [
      `loss of small languages narrows the sample available for testing linguistic theory, in addition to its cultural costs`,
      `endangered languages are primarily a cultural concern`,
      `linguistic theory is more important than community identity`,
      `evidentiality systems are the most important grammatical feature`,
      `all languages are equally important to science`,
    ],
    correct: 0,
    explanation: `(A) captures both the addition and the scientific stake. The others overstate or contradict.`,
  },
  {
    id: 'lsat_t1_034',
    topicId: 1,
    subtopic: 'rc_detail',
    difficulty: 1,
    question: `According to the passage, languages with rare features`,
    options: [
      `carry more inferential weight in linguistic theory than languages whose features are widely shared`,
      `are more easily preserved than common languages`,
      `are spoken only by isolated communities`,
      `tend to be replaced by majority languages`,
      `are inherently more complex than common languages`,
    ],
    correct: 0,
    explanation: `Directly stated. (B), (C), (D), (E) are unsupported.`,
  },
  {
    id: 'lsat_t1_035',
    topicId: 1,
    subtopic: 'rc_attitude',
    difficulty: 2,
    question: `The author's attitude toward purely cultural framings of language loss is best described as`,
    options: [
      `respectful but supplemental — not denying the cultural loss but adding a scientific dimension`,
      `dismissive`,
      `nostalgic`,
      `enthusiastically embracing`,
      `hostile`,
    ],
    correct: 0,
    explanation: `"The loss is that, but it is also…" signals respectful supplementation. The others misread.`,
  },
  {
    id: 'lsat_t1_036',
    topicId: 1,
    subtopic: 'rc_application',
    difficulty: 3,
    question: `Which of the following research efforts would the author of the passage most likely support?`,
    options: [
      `Documenting the grammar of a small language with an unusual sound inventory before its last fluent speakers retire`,
      `Standardizing all languages around a small set of grammatical features`,
      `Restricting linguistic theory to majority languages`,
      `Dismissing small languages as marginal to theory`,
      `Reducing fieldwork in favor of corpus studies only`,
    ],
    correct: 0,
    explanation: `(A) tracks the central claim. The others contradict.`,
  },

  // ----- Passage J (Qs 37–40): History of public libraries -----
  {
    id: 'lsat_t1_037',
    topicId: 1,
    subtopic: 'rc_main_point',
    difficulty: 2,
    question: `Questions 37–40 refer to the following passage:

The public library, as a tax-funded institution open to all residents, is a 19th-century invention often credited to industrial philanthropists. The historical record is more complicated. The model emerged from older municipal subscription libraries that had already established the principle of community-funded reading rooms. The philanthropists' contribution was less the invention of a new institution than the scaling of an existing one. To treat the public library as a single founder's gift is to flatten a longer process of civic experimentation.

The main point of the passage is that`,
    options: [
      `the public library was not invented by 19th-century philanthropists but scaled from older municipal models through a longer civic process`,
      `industrial philanthropists deserve no credit for libraries`,
      `subscription libraries were superior to modern public libraries`,
      `taxation is the most important feature of public libraries`,
      `public libraries should be privately funded`,
    ],
    correct: 0,
    explanation: `(A) captures the corrective. (B) overshoots. (C), (D), (E) are unsupported.`,
  },
  {
    id: 'lsat_t1_038',
    topicId: 1,
    subtopic: 'rc_detail',
    difficulty: 1,
    question: `According to the passage, the contribution of 19th-century philanthropists to the public library was`,
    options: [
      `the scaling of an existing institutional model`,
      `the invention of a wholly new kind of institution`,
      `the abolition of subscription fees`,
      `the standardization of cataloging`,
      `the founding of the first reading rooms`,
    ],
    correct: 0,
    explanation: `Directly stated. (B) is the view the author rejects. (C), (D), (E) are not mentioned.`,
  },
  {
    id: 'lsat_t1_039',
    topicId: 1,
    subtopic: 'rc_function',
    difficulty: 2,
    question: `The phrase "to flatten a longer process of civic experimentation" functions in the passage to`,
    options: [
      `criticize the over-simplification of attributing the public library to a single founder`,
      `argue that civic experimentation should be avoided`,
      `define the term "public library"`,
      `praise industrial philanthropy`,
      `claim that subscription libraries were experiments`,
    ],
    correct: 0,
    explanation: `It tags the simplification as a flattening. The others misread.`,
  },
  {
    id: 'lsat_t1_040',
    topicId: 1,
    subtopic: 'rc_inference',
    difficulty: 2,
    question: `It can be inferred from the passage that the author would likely view a similar single-founder narrative about another civic institution with`,
    options: [
      `comparable skepticism, suspecting it elides earlier community-driven precursors`,
      `enthusiastic agreement`,
      `indifference, since each institution differs`,
      `outright hostility toward all philanthropy`,
      `careful endorsement, since founders deserve credit`,
    ],
    correct: 0,
    explanation: `The passage models a skeptical reading of single-founder narratives. The others misread.`,
  },

  // ----- Passage K (Qs 41–43): Astronomy of stellar nurseries -----
  {
    id: 'lsat_t1_041',
    topicId: 1,
    subtopic: 'rc_main_point',
    difficulty: 2,
    question: `Questions 41–43 refer to the following passage:

Stars form in dense, cold pockets of molecular gas. Once gravitational collapse begins in such a pocket, the cloud heats and emits primarily in the infrared — light invisible to the naked eye but easily detected by satellites equipped with cooled detectors. Recent infrared surveys have mapped thousands of these stellar nurseries across our galaxy, revealing that they cluster along spiral arms and that the rate of new star formation varies dramatically over the galaxy's history. The picture that emerges is less one of steady production and more one of episodic surges separated by quieter intervals.

The main point of the passage is that`,
    options: [
      `infrared surveys reveal that galactic star formation has been episodic, with surges and lulls, rather than steady`,
      `infrared light is undetectable to the human eye`,
      `spiral arms are the only locations of star formation`,
      `the galaxy is younger than once believed`,
      `cooled detectors are difficult to manufacture`,
    ],
    correct: 0,
    explanation: `(A) tracks the closing claim. The others are details or unsupported.`,
  },
  {
    id: 'lsat_t1_042',
    topicId: 1,
    subtopic: 'rc_detail',
    difficulty: 1,
    question: `According to the passage, infrared surveys have revealed that stellar nurseries`,
    options: [
      `cluster along the galaxy's spiral arms`,
      `are evenly distributed throughout the galaxy`,
      `are absent from the galactic disk`,
      `are visible to the naked eye`,
      `are colder than interstellar space generally`,
    ],
    correct: 0,
    explanation: `Directly stated. (B), (C), (D) contradict. (E) is unsupported.`,
  },
  {
    id: 'lsat_t1_043',
    topicId: 1,
    subtopic: 'rc_inference',
    difficulty: 2,
    question: `It can be inferred from the passage that earlier views of galactic star formation`,
    options: [
      `treated star formation as more uniform across time than recent infrared evidence suggests`,
      `predicted episodic surges`,
      `relied primarily on infrared data`,
      `restricted star formation to the galactic core`,
      `ignored spiral arms`,
    ],
    correct: 0,
    explanation: `The closing contrast implies a uniform-rate predecessor view. The others are unsupported.`,
  },

  // ----- Passage L (Qs 44–46): Architecture of medieval cathedrals -----
  {
    id: 'lsat_t1_044',
    topicId: 1,
    subtopic: 'rc_main_point',
    difficulty: 2,
    question: `Questions 44–46 refer to the following passage:

The medieval cathedral is often praised as a feat of religious devotion, and so it was. But it was also a feat of municipal coordination. The decades-long construction of a cathedral required quarry contracts, payroll arrangements for itinerant masons, dispute resolution among guilds, and durable taxation. A city without functioning institutions could not build a cathedral, however fervent its piety. The cathedrals therefore stand as evidence of administrative capacity as much as of belief — physical monuments to the bureaucracies that made them possible.

The main point of the passage is that`,
    options: [
      `medieval cathedrals were monuments not only to faith but to the administrative capacity that made their construction possible`,
      `medieval piety has been overstated by historians`,
      `municipal taxation is the principal feature of medieval cities`,
      `guilds were uniformly hostile to cathedral construction`,
      `cathedrals were built primarily for civic display`,
    ],
    correct: 0,
    explanation: `(A) tracks the closing claim. (B), (D), (E) overstate. (C) cherry-picks.`,
  },
  {
    id: 'lsat_t1_045',
    topicId: 1,
    subtopic: 'rc_function',
    difficulty: 2,
    question: `The phrase "physical monuments to the bureaucracies that made them possible" functions in the passage to`,
    options: [
      `crystallize the author's reframing of cathedrals as administrative achievements as well as religious ones`,
      `criticize medieval bureaucracies`,
      `define the term "cathedral"`,
      `dismiss the role of religious devotion`,
      `argue that bureaucracies were universally efficient`,
    ],
    correct: 0,
    explanation: `It is the author's reframing image. The others misread.`,
  },
  {
    id: 'lsat_t1_046',
    topicId: 1,
    subtopic: 'rc_detail',
    difficulty: 1,
    question: `According to the passage, requirements for building a cathedral included`,
    options: [
      `quarry contracts, payroll for itinerant masons, dispute resolution, and durable taxation`,
      `imported architects from outside the region`,
      `royal sponsorship`,
      `papal financial support`,
      `the absence of guilds`,
    ],
    correct: 0,
    explanation: `Directly listed. (B), (C), (D), (E) are unsupported or contradicted.`,
  },

  // ----- Passage M comparative (Qs 47–50): Two views on AI -----
  {
    id: 'lsat_t1_047',
    topicId: 1,
    subtopic: 'rc_comparative',
    difficulty: 3,
    question: `Questions 47–50 refer to the following two passages:

Passage A: Recent progress in artificial intelligence demands a precautionary approach. Systems that can produce fluent text, code, and images at scale can also amplify misinformation, automate fraud, and concentrate economic power. Voluntary self-regulation by developers has historically been inadequate; formal rules with teeth are needed before harms become entrenched.

Passage B: The case for pre-emptive AI regulation tends to underestimate how much we still do not know about these systems. Rules drafted now will reflect today's incomplete understanding and may foreclose research directions that turn out to matter. Better to invest in measurement and oversight infrastructure — auditing capacity, incident reporting, sandbox environments — than to legislate against capabilities we do not yet understand.

The two passages most clearly disagree about whether`,
    options: [
      `formal pre-emptive rules with teeth are the appropriate response to current AI risks`,
      `AI poses any risks at all`,
      `developers should ever be regulated`,
      `misinformation is undesirable`,
      `auditing infrastructure should be built`,
    ],
    correct: 0,
    explanation: `(A) is the direct disagreement. (B), (C), (D), (E) are points both agree on or are not contested.`,
  },
  {
    id: 'lsat_t1_048',
    topicId: 1,
    subtopic: 'rc_comparative',
    difficulty: 2,
    question: `Which of the following best characterizes the relationship between the two passages?`,
    options: [
      `Passage B accepts that AI poses risks but argues that the policy response Passage A favors is premature`,
      `Passage B denies all risks claimed by Passage A`,
      `Passage A and Passage B disagree about whether AI exists`,
      `Passage B endorses Passage A's prescription`,
      `Passage A criticizes voluntary self-regulation, while Passage B defends it`,
    ],
    correct: 0,
    explanation: `(A) tracks the actual disagreement: both grant risks; the dispute is about timing and form. (B), (C), (D) misread. (E) — neither defends self-regulation.`,
  },
  {
    id: 'lsat_t1_049',
    topicId: 1,
    subtopic: 'rc_inference',
    difficulty: 2,
    question: `The author of Passage B would most likely respond to Passage A's argument by`,
    options: [
      `conceding the existence of risks but contending that the proposed rules will be drafted under conditions of insufficient understanding`,
      `denying that any AI risks exist`,
      `endorsing voluntary self-regulation`,
      `recommending an outright ban on AI research`,
      `proposing only voluntary developer codes`,
    ],
    correct: 0,
    explanation: `(A) matches Passage B's actual move. (B), (C), (D), (E) misread.`,
  },
  {
    id: 'lsat_t1_050',
    topicId: 1,
    subtopic: 'rc_comparative',
    difficulty: 2,
    question: `Both passages would most likely agree that`,
    options: [
      `AI systems present genuine risks that warrant some form of public response`,
      `formal pre-emptive rules are the only appropriate response`,
      `voluntary self-regulation has been adequate`,
      `auditing infrastructure is unnecessary`,
      `misinformation poses no special concern`,
    ],
    correct: 0,
    explanation: `Both grant risks and reject pure laissez-faire. (B), (C), (D), (E) are positions only one passage holds, or neither.`,
  },

  // ----- Passage N (Qs 51–54): Sociology of urban anonymity -----
  {
    id: 'lsat_t1_051',
    topicId: 1,
    subtopic: 'rc_main_point',
    difficulty: 2,
    question: `Questions 51–54 refer to the following passage:

Urban anonymity is sometimes mourned as a loss of community. Yet the anonymity of the modern city is, for many residents, a precondition of personal freedom: a space in which one's identity is not fixed by birth, religion, or family standing. Critics who romanticize the close-knit village often forget how relentlessly it could enforce conformity on those who deviated from local norms. The exchange of community surveillance for urban anonymity has costs, but it also enables forms of self-fashioning that are difficult to achieve elsewhere.

The author's main point is that`,
    options: [
      `urban anonymity, though often mourned, also enables personal freedom and self-fashioning that village communities tend to suppress`,
      `urban life is uniformly superior to village life`,
      `villages have no genuine community`,
      `anonymity has no real costs`,
      `personal freedom is unrelated to community structure`,
    ],
    correct: 0,
    explanation: `(A) tracks the balanced reframing. The others overstate or contradict.`,
  },
  {
    id: 'lsat_t1_052',
    topicId: 1,
    subtopic: 'rc_detail',
    difficulty: 1,
    question: `According to the passage, critics who romanticize close-knit villages tend to forget`,
    options: [
      `how relentlessly such villages could enforce conformity on those who deviated`,
      `that villages were often very small`,
      `that urban migration was difficult`,
      `that religion was widespread`,
      `that personal identity was unimportant in villages`,
    ],
    correct: 0,
    explanation: `Directly stated. The others are unsupported.`,
  },
  {
    id: 'lsat_t1_053',
    topicId: 1,
    subtopic: 'rc_attitude',
    difficulty: 2,
    question: `The author's attitude toward urban anonymity is best described as`,
    options: [
      `qualified appreciation — recognizing costs but emphasizing the freedoms it enables`,
      `unreserved celebration`,
      `mournful nostalgia for villages`,
      `hostile rejection`,
      `clinical indifference`,
    ],
    correct: 0,
    explanation: `The phrase "has costs, but it also enables" captures qualified appreciation. The others overstate.`,
  },
  {
    id: 'lsat_t1_054',
    topicId: 1,
    subtopic: 'rc_function',
    difficulty: 2,
    question: `The reference to "those who deviated from local norms" functions in the passage to`,
    options: [
      `give a concrete reason for the constraint imposed by close-knit village communities`,
      `argue that deviation is always desirable`,
      `define the term "anonymity"`,
      `criticize sociologists`,
      `propose a typology of village residents`,
    ],
    correct: 0,
    explanation: `It supplies the substance behind "enforce conformity." The others misread.`,
  },

  // ----- Passage O (Qs 55–60): Philosophy of scientific explanation -----
  {
    id: 'lsat_t1_055',
    topicId: 1,
    subtopic: 'rc_main_point',
    difficulty: 2,
    question: `Questions 55–60 refer to the following passage:

What counts as a scientific explanation? Logical positivists once proposed that an event is explained when it can be derived from a general law together with statements about initial conditions. The model captured something real — the way that physics, especially, weaves explanations from laws — but it captured less of biology, geology, or history, where explanations often take the form of narratives that no general law alone could support. Recent philosophers of science have therefore loosened the framework: causal mechanisms, statistical regularities, and historical narratives are now widely recognized as legitimate explanatory forms. The result is a less unified picture of science but a more accurate one.

The primary purpose of the passage is to`,
    options: [
      `describe the loosening of the once-dominant deductive model of scientific explanation in favor of a pluralistic picture`,
      `argue that biology and geology cannot be sciences`,
      `defend the logical positivist model against critics`,
      `summarize a single recent paper in the philosophy of science`,
      `criticize physics for being too narrowly focused`,
    ],
    correct: 0,
    explanation: `(A) tracks the passage's arc. The others misread.`,
  },
  {
    id: 'lsat_t1_056',
    topicId: 1,
    subtopic: 'rc_detail',
    difficulty: 1,
    question: `According to the passage, the logical positivist model of explanation worked best for`,
    options: [
      `physics`,
      `biology`,
      `geology`,
      `history`,
      `philosophy`,
    ],
    correct: 0,
    explanation: `Directly stated. The others are areas the model captured less well, per the passage.`,
  },
  {
    id: 'lsat_t1_057',
    topicId: 1,
    subtopic: 'rc_function',
    difficulty: 2,
    question: `The clause "a less unified picture of science but a more accurate one" functions in the passage to`,
    options: [
      `acknowledge a cost of the pluralistic view while endorsing it as truer to scientific practice`,
      `argue that scientific unity is impossible`,
      `criticize philosophers who seek unity`,
      `define the term "explanation"`,
      `dismiss the positivist project as worthless`,
    ],
    correct: 0,
    explanation: `It concedes loss-of-unity to argue gain-of-accuracy. The others overstate.`,
  },
  {
    id: 'lsat_t1_058',
    topicId: 1,
    subtopic: 'rc_inference',
    difficulty: 2,
    question: `It can be inferred from the passage that a geological explanation of a particular mountain range would most likely`,
    options: [
      `take the form of a narrative drawing on causal mechanisms and historical events rather than derivation from general laws alone`,
      `be expressed entirely as derivation from physical laws`,
      `be considered unscientific by the author`,
      `be rejected by recent philosophers of science`,
      `be classified as biology rather than geology`,
    ],
    correct: 0,
    explanation: `Directly implied. The others contradict.`,
  },
  {
    id: 'lsat_t1_059',
    topicId: 1,
    subtopic: 'rc_attitude',
    difficulty: 2,
    question: `The author's attitude toward the pluralistic view of explanation is best described as`,
    options: [
      `endorsing, while acknowledging it sacrifices some theoretical neatness`,
      `hostile, treating it as a retreat from rigor`,
      `indifferent`,
      `enthusiastically defending it against all critics`,
      `nostalgic for the unity of the older model`,
    ],
    correct: 0,
    explanation: `Concede-cost, endorse: classic measured endorsement. The others overstate.`,
  },
  {
    id: 'lsat_t1_060',
    topicId: 1,
    subtopic: 'rc_application',
    difficulty: 3,
    question: `Which of the following research approaches would most closely align with the passage's outlook?`,
    options: [
      `Treating historical contingency and causal mechanism as legitimate components of explanations in evolutionary biology, alongside any applicable general laws`,
      `Requiring every explanation in biology to be a derivation from a general law plus initial conditions`,
      `Rejecting narrative explanations as inherently unscientific`,
      `Restricting "scientific" to physics alone`,
      `Treating statistical regularities as insufficient for any genuine explanation`,
    ],
    correct: 0,
    explanation: `(A) matches the pluralistic outlook. (B), (C), (D), (E) revert to the rejected unified picture.`,
  },
];