/**
 * GMAT course content for the "Read Lessons" tab of the exam-prep app.
 * Reflects the GMAT Focus Edition structure (Quantitative Reasoning,
 * Verbal Reasoning, Data Insights). Sentence Correction is retained as a
 * grammar lesson to match this app's existing curriculum.
 *
 * 13 topics across three sections. All content is original teaching material.
 */

import type { TopicLesson, LessonSection } from '@/lib/cissp-course-data';
// TopicLesson = { topicId: string; title: string; domainWeight: string; overview: string; sections: LessonSection[]; keyTakeaways?: string[] }
// LessonSection = { id: string; title: string; content: string; examTip?: string; importantNote?: string }

export const GMAT_COURSE: Record<string, TopicLesson> = {

gq_problem_solving: {
  topicId: 'gq_problem_solving',
  title: `Problem Solving`,
  domainWeight: 'Quantitative Reasoning',
  overview: `Problem Solving questions present a standard multiple-choice math problem with five answer choices. They test arithmetic, algebra, and reasoning under time pressure using only the concepts taught through secondary school. Success depends less on advanced math and more on efficient methods, estimation, and avoiding careless errors. The Focus Edition Quant section is calculator-free, so mental arithmetic and smart shortcuts matter.`,
  sections: [
    {
      id: 'ps-approach-framework',
      title: `1. A Repeatable Approach to Every Problem`,
      content: `Every Problem Solving question rewards a consistent process rather than raw computation. Read the entire question first and identify exactly what is asked; the most common error is solving for the wrong quantity (finding x when the question wants 2x+1).

## The four-step loop

- **Understand**: Restate the goal in one phrase. "Find the percent increase," not "do something with these numbers."
- **Plan**: Choose a method. Sometimes algebra is cleanest; sometimes plugging in numbers or testing the answer choices is faster.
- **Execute**: Do the arithmetic carefully, writing each step. The section has no calculator, so keep numbers small.
- **Check**: Confirm the answer matches what was asked and is in the right units.

## Worked example

A shirt is marked up 25 percent over cost, then sold at a 20 percent discount off the marked price. If it sold for \$60, what was the cost?

Let cost be C. Marked price = 1.25C. Sale price = 0.80 * 1.25C = 1.00C. So the sale price equals the cost, meaning C = \$60. The two percentages happened to cancel exactly, which you only see if you set up the relationship rather than grabbing numbers. This is why planning before computing saves time.`,
      examTip: `Underline or note the exact quantity requested before you compute. Reread it after you get a number to make sure you answered the actual question.`,
    },
    {
      id: 'ps-backsolving',
      title: `2. Backsolving From the Answer Choices`,
      content: `Because answers are multiple choice and usually numeric and ordered, you can often test choices instead of solving algebraically. This is called backsolving.

## When to backsolve

Use it when the question asks for a single unknown value and plugging a number back into the problem is easy to verify. Since the five choices are typically listed in increasing order, start with the middle choice (C). If C is too big, you only need to test the smaller choices; if too small, only the larger ones.

## Worked example

A number of coins are split among 3 people so that the second gets twice the first and the third gets three times the first. If the total is 90 coins, how many does the first person get?

Choices: (A) 10 (B) 12 (C) 15 (D) 18 (E) 20.

Test C = 15: shares are 15, 30, 45, total 90. That works, so the answer is C on the first try. Backsolving turned an algebra setup into one addition.

## The trade-off

Backsolving is powerful but not always fastest. If the algebra is a clean one-liner, solve directly. Reserve backsolving for messy setups, "which of the following could be" questions, and cases where you are unsure how to build the equation.`,
      importantNote: `Backsolving only works when a choice can be plugged back in and checked. It does not work well when the question asks for the number of solutions or a general expression.`,
    },
    {
      id: 'ps-estimation',
      title: `3. Estimation and Smart Number Sense`,
      content: `Many Problem Solving questions can be answered by estimation, especially when the answer choices are spread far apart. Since the section is calculator-free, estimating protects you from arithmetic slips and saves time.

## Rounding to bracket the answer

Suppose you must compute 48 * 5.1 / 12. Round: 48/12 = 4, times about 5.1 gives roughly 20. If the choices are 12, 16, 20.4, 25, and 31, the answer is clearly 20.4 without exact work.

## Percentages and fractions

Convert awkward percentages to friendly fractions: 25% = 1/4, 33.3% = 1/3, 12.5% = 1/8, 20% = 1/5. Computing 37.5% of 240 is faster as 3/8 of 240 = 90.

## Order of magnitude

Before finalizing, sanity-check the scale. If a problem about a monthly budget yields \$4, something is wrong. Estimation is not just a shortcut; it is a built-in error check.

## Worked example

A car travels 297 miles on 10.9 gallons. Approximate miles per gallon. Round to 300/11, which is about 27. If choices cluster near 25 to 30, you are done. Only compute precisely when choices are close together.`,
      examTip: `Scan the answer choices before computing. Widely spaced choices signal that estimation will get you there faster than exact arithmetic.`,
    },
    {
      id: 'ps-common-traps',
      title: `4. Common Traps and Time Management`,
      content: `The test writers design wrong answers to match predictable mistakes. Knowing the traps lets you avoid them.

## Frequent traps

- **Answering the wrong quantity**: solving for x when the question wants x squared or x+2.
- **Percent-of-percent errors**: a 20% rise followed by a 20% fall does not return to the start; it leaves you at 96% of the original.
- **Average vs. weighted average**: the average speed of a round trip is not the simple mean of the two speeds; it is total distance over total time.
- **Off-by-one counting**: the number of integers from 20 to 50 inclusive is 50 - 20 + 1 = 31, not 30.

## Time budget

You have roughly two minutes per Quant question. If you are stuck after about 30 seconds with no plan, either switch to backsolving or make an educated guess and move on. The Focus Edition lets you flag and revisit questions within a section, so a smart guess now preserves time for questions you can nail later.

## Worked example of a trap

If the price of an item rises 20% then falls 20%, and the final price is \$96, what was the original? Final = original * 1.2 * 0.8 = 0.96 * original. So original = 96 / 0.96 = \$100. The trap answer is \$96 itself, offered to anyone who assumes the percentages cancel.`,
      importantNote: `Successive percentage changes multiply; they never simply add or cancel. Always chain the factors.`,
    },
  ],
  keyTakeaways: [
    `Restate exactly what the question asks before computing, and recheck it after.`,
    `Backsolve from the middle answer choice when an unknown value can be plugged back in.`,
    `Convert ugly percentages to friendly fractions and estimate when choices are spread apart.`,
    `Successive percentage changes multiply, so a 20% up then 20% down leaves you at 96%.`,
    `Budget about two minutes per question; flag and move on rather than sinking time.`,
  ],
},

gq_number_props: {
  topicId: 'gq_number_props',
  title: `Number Properties`,
  domainWeight: 'Quantitative Reasoning',
  overview: `Number Properties covers integers, factors, multiples, primes, divisibility, odd and even behavior, and remainders. These questions reward pattern recognition rather than heavy calculation, and they appear constantly in both Problem Solving and Data Sufficiency. Mastering the rules for even/odd and positive/negative combinations turns many hard-looking questions into quick logic.`,
  sections: [
    {
      id: 'np-divisibility',
      title: `1. Factors, Multiples, and Divisibility Rules`,
      content: `A factor (or divisor) of n divides n with no remainder; a multiple of n is n times an integer. Every integer greater than 1 has a unique prime factorization, which is the foundation for most Number Properties reasoning.

## Divisibility shortcuts

- **2**: last digit is even.
- **3**: digit sum is divisible by 3 (e.g., 372 -> 3+7+2 = 12, divisible by 3).
- **4**: last two digits form a number divisible by 4.
- **5**: last digit is 0 or 5.
- **6**: divisible by both 2 and 3.
- **9**: digit sum divisible by 9.

## Prime factorization in action

Write 72 = 2^3 * 3^2. The number of positive factors equals the product of (each exponent + 1): (3+1)(2+1) = 12 factors. This formula appears often.

## Worked example

How many positive divisors does 60 have? Factor: 60 = 2^2 * 3^1 * 5^1. Divisor count = (2+1)(1+1)(1+1) = 3 * 2 * 2 = 12. Listing them by hand would be slow and error-prone; the exponent formula is instant.`,
      examTip: `When a question mentions divisibility, factors, or "greatest common," start by writing the prime factorization. It unlocks factor counts, GCF, and LCM at once.`,
    },
    {
      id: 'np-even-odd',
      title: `2. Even, Odd, Positive, and Negative Behavior`,
      content: `The GMAT loves questions that hinge on parity (even/odd) and sign rules because they can be answered with logic instead of arithmetic.

## Parity rules

- even + even = even; odd + odd = even; even + odd = odd.
- even * anything = even; odd * odd = odd.
- Only odd times odd stays odd; a single even factor makes the product even.

## Sign rules

- A product or quotient is positive if it has an even number of negative factors, negative if odd.
- Squaring any nonzero number gives a positive result, which is why x^2 = 9 has two solutions (3 and -3) but x^2 >= 0 always holds.

## Worked example

If n is an integer and n^2 + n is computed, is the result always even? Factor: n^2 + n = n(n+1). Any two consecutive integers include exactly one even number, so the product is always even. No matter what n is, the answer is yes. This kind of consecutive-integer insight is a recurring theme.

## Zero and one

Remember the edge cases: 0 is even, 0 is neither positive nor negative, and 1 is not prime. These exceptions are frequently the key to a tricky Data Sufficiency statement.`,
      importantNote: `Zero is even and is a multiple of every integer, but it is neither positive nor negative. One is neither prime nor composite. These edge cases decide many questions.`,
    },
    {
      id: 'np-remainders',
      title: `3. Remainders and Modular Thinking`,
      content: `When an integer is divided, the remainder is what is left over. Formally, dividend = divisor * quotient + remainder, where 0 <= remainder < divisor.

## Setting up remainder problems

If n leaves remainder 3 when divided by 7, then n = 7k + 3 for some integer k. Listing values (3, 10, 17, 24, ...) often reveals the pattern faster than pure algebra.

## Cyclic patterns

Units digits and remainders cycle. The units digit of powers of 3 cycles 3, 9, 7, 1 with period 4. To find the units digit of 3^23, note 23 divided by 4 leaves remainder 3, so the units digit matches 3^3 = 27, giving 7.

## Worked example

What is the remainder when 7^100 is divided by 5? The units digits of powers of 7 cycle 7, 9, 3, 1 (period 4). Since 100 is a multiple of 4, the units digit is 1, so 7^100 ends in 1 and leaves remainder 1 when divided by 5.

## Combining remainders

If a leaves remainder 2 mod 5 and b leaves remainder 3 mod 5, then a + b leaves remainder 2 + 3 = 5, which is 0 mod 5. You can add, subtract, and multiply remainders directly, then reduce.`,
      examTip: `Rewrite "leaves remainder r when divided by d" as the equation n = dk + r. Testing a few values of k usually exposes the pattern quickly.`,
    },
    {
      id: 'np-primes-lcm-gcf',
      title: `4. Primes, LCM, and GCF`,
      content: `Prime numbers have exactly two positive divisors: 1 and themselves. The primes begin 2, 3, 5, 7, 11, 13, 17, 19, 23. Note that 2 is the only even prime, a fact that resolves many parity traps.

## GCF and LCM from prime factors

- **Greatest Common Factor (GCF)**: take the lowest power of each shared prime.
- **Least Common Multiple (LCM)**: take the highest power of every prime that appears.

For 12 = 2^2 * 3 and 18 = 2 * 3^2: GCF = 2^1 * 3^1 = 6; LCM = 2^2 * 3^2 = 36.

## The useful identity

GCF(a, b) * LCM(a, b) = a * b. Check: 6 * 36 = 216 = 12 * 18. If a question gives you three of these four quantities, solve for the fourth.

## Worked example

Two lighthouses flash every 12 and 18 seconds. If they flash together now, when do they flash together again? That is the LCM of 12 and 18, which is 36 seconds. LCM answers "when do repeating events line up," while GCF answers "largest equal groups you can form."

## Testing primality

To check whether a number under 100 is prime, test divisibility only by primes up to its square root. For 91, test 2, 3, 5, 7: 91 = 7 * 13, so it is not prime. Many test-takers wrongly assume 91 is prime.`,
      importantNote: `Use LCM for "events coinciding" or common denominators, and GCF for "largest equal groups." The identity GCF * LCM = product of the two numbers is a fast shortcut.`,
    },
  ],
  keyTakeaways: [
    `Prime factorization drives factor counts, GCF, and LCM; write it first.`,
    `Parity and sign rules let you answer many questions with logic, not arithmetic.`,
    `Zero is even and neither positive nor negative; one and zero are not prime.`,
    `Model remainders as n = dk + r and exploit cyclic units-digit patterns.`,
    `GCF times LCM equals the product of the two numbers.`,
    `2 is the only even prime, which resolves many parity traps.`,
  ],
},

gq_algebra: {
  topicId: 'gq_algebra',
  title: `Algebra & Inequalities`,
  domainWeight: 'Quantitative Reasoning',
  overview: `Algebra questions cover linear and quadratic equations, systems, exponents, and inequalities. The GMAT emphasizes manipulation skill and recognizing structure over rote computation. Inequalities add a crucial twist: multiplying or dividing by a negative flips the sign, and absolute value creates two cases. Fluency with factoring patterns and exponent rules unlocks many otherwise slow problems.`,
  sections: [
    {
      id: 'alg-linear-systems',
      title: `1. Linear Equations and Systems`,
      content: `A linear equation solves for a single unknown; a system of equations solves for several unknowns using multiple relationships. As a rule, you need as many independent equations as unknowns to pin down a unique solution.

## Solving a system

Two clean methods: substitution (solve one equation for a variable and plug in) and elimination (add or subtract equations to cancel a variable).

## Worked example

Solve: 3x + 2y = 16 and x - y = 3.

From the second equation, x = y + 3. Substitute: 3(y + 3) + 2y = 16, so 3y + 9 + 2y = 16, giving 5y = 7... let us instead use cleaner numbers. Use elimination: multiply the second equation by 2 to get 2x - 2y = 6, then add to the first: 5x = 22, so x = 22/5. Substitution and elimination both work; pick whichever avoids fractions longest.

## Recognizing when a system is unsolvable

If two equations are really the same line (one is a multiple of the other), they give infinitely many solutions, not a unique answer. This idea is central to Data Sufficiency: two equations that look different but are proportional do not actually determine the variables.`,
      examTip: `Count unknowns versus independent equations. Two distinct linear equations in two unknowns give one solution; two proportional ones do not.`,
    },
    {
      id: 'alg-quadratics',
      title: `2. Quadratics and Factoring Patterns`,
      content: `A quadratic has the form ax^2 + bx + c = 0. On the GMAT most quadratics factor cleanly, so recognizing patterns beats the quadratic formula.

## Must-know factoring identities

- Difference of squares: a^2 - b^2 = (a + b)(a - b).
- Perfect square: a^2 + 2ab + b^2 = (a + b)^2.
- Perfect square: a^2 - 2ab + b^2 = (a - b)^2.

## Factoring to solve

To solve x^2 - 5x + 6 = 0, find two numbers that multiply to 6 and add to -5: those are -2 and -3. So (x - 2)(x - 3) = 0, giving x = 2 or x = 3. Set each factor to zero because a product equals zero only if a factor is zero.

## Worked example using difference of squares

Compute 51^2 - 49^2 without multiplying. Recognize the pattern: (51 + 49)(51 - 49) = 100 * 2 = 200. What looked like heavy arithmetic becomes trivial once you see the structure. The GMAT rewards spotting a^2 - b^2 in disguise.

## Watch for hidden quadratics

An equation like x + 6/x = 5 becomes x^2 - 5x + 6 = 0 after multiplying through by x, which factors as above.`,
      importantNote: `Memorize the three factoring identities. Recognizing a^2 - b^2 = (a+b)(a-b) converts many "impossible" arithmetic problems into one-line solutions.`,
    },
    {
      id: 'alg-exponents-roots',
      title: `3. Exponents and Roots`,
      content: `Exponent rules let you combine and simplify powers. The GMAT tests these constantly, often mixing bases that can be rewritten with a common base.

## Core rules

- x^a * x^b = x^(a+b)
- x^a / x^b = x^(a-b)
- (x^a)^b = x^(ab)
- x^0 = 1 for any nonzero x
- x^(-a) = 1 / x^a
- x^(1/2) = sqrt(x)

## Common base trick

To solve 4^x = 8, rewrite both sides in base 2: (2^2)^x = 2^3, so 2^(2x) = 2^3, meaning 2x = 3 and x = 3/2. When bases match, you can equate the exponents.

## Worked example

Simplify (2^5 * 2^3) / 2^6. Add exponents on top: 2^8. Then subtract: 2^(8-6) = 2^2 = 4. Do not multiply out 32 * 8 = 256 and then divide; keep everything in exponent form to stay fast and calculator-free.

## Roots as fractional exponents

Since sqrt(x) = x^(1/2), the cube root of x is x^(1/3). To simplify sqrt(50), factor out a perfect square: sqrt(50) = sqrt(25 * 2) = 5 * sqrt(2). Pulling out perfect squares is the standard way to simplify radicals.`,
      examTip: `When exponential equations have different bases, rewrite them with the smallest common base. Once bases match, set the exponents equal.`,
    },
    {
      id: 'alg-inequalities',
      title: `4. Inequalities and Absolute Value`,
      content: `Inequalities work like equations with one vital exception: multiplying or dividing both sides by a negative number reverses the inequality sign.

## The sign-flip rule

To solve -2x < 6, divide by -2 and flip: x > -3. Forgetting to flip is the single most common inequality error on the test.

## Combining inequalities

If you know 2 < x < 5 and 1 < y < 3, then for x + y add the bounds: 3 < x + y < 8. For x - y, subtract the extremes carefully: the smallest x - y uses smallest x and largest y (2 - 3 = -1), and the largest uses largest x and smallest y (5 - 1 = 4), so -1 < x - y < 4.

## Absolute value creates two cases

The equation |x - 4| = 3 means x - 4 = 3 or x - 4 = -3, so x = 7 or x = 1. The inequality |x - 4| < 3 means -3 < x - 4 < 3, which gives 1 < x < 7 (a range around 4). Reading absolute value as "distance from a point" makes this intuitive: |x - 4| < 3 is all points within 3 of 4.

## Worked example

Solve |2x + 1| >= 5. Split: 2x + 1 >= 5 gives x >= 2; or 2x + 1 <= -5 gives x <= -3. So the solution is x <= -3 or x >= 2, two rays pointing outward.`,
      importantNote: `Always flip the inequality when multiplying or dividing by a negative. Absolute value equations and inequalities each split into two cases, so never solve only one.`,
    },
  ],
  keyTakeaways: [
    `Match independent equations to unknowns; proportional equations do not determine a unique solution.`,
    `Memorize difference-of-squares and perfect-square identities to shortcut arithmetic and solve quadratics.`,
    `Rewrite exponentials with a common base, then equate exponents; keep answers in exponent form.`,
    `Flip the inequality sign when multiplying or dividing by a negative.`,
    `Absolute value splits into two cases; interpret it as distance on the number line.`,
  ],
},

gq_word_problems: {
  topicId: 'gq_word_problems',
  title: `Word Problems`,
  domainWeight: 'Quantitative Reasoning',
  overview: `Word problems translate a real-world scenario into equations covering rates, work, mixtures, ratios, percents, and interest. The core skill is translation: turning English phrases into precise algebra while tracking units. Once the setup is right, the arithmetic is usually straightforward. Recurring templates such as distance = rate * time and the combined-work formula appear again and again.`,
  sections: [
    {
      id: 'wp-translation',
      title: `1. Translating Words Into Equations`,
      content: `The hardest part of a word problem is usually the setup, not the math. A reliable habit is to define every variable in words before writing a single equation.

## Translation cheat sheet

- "is" means equals
- "of" means multiply
- "percent" means divide by 100
- "more than" means addition; "less than" reverses order (5 less than x is x - 5, not 5 - x)
- "per" signals a rate (division)

## Define variables explicitly

Write "let J = John's current age" rather than a bare J. When a problem involves ages, times, or before/after states, label each clearly to avoid mixing them.

## Worked example

The sum of two numbers is 30, and one is 4 more than twice the other. Find them. Let the smaller be x. The larger is 2x + 4. Then x + (2x + 4) = 30, so 3x + 4 = 30, giving 3x = 26... choose cleaner numbers: if the larger is 4 more than twice the smaller and the sum is 34, then 3x + 4 = 34, x = 10, larger = 24. The lesson stands: name the variable, translate each clause, then solve. Rushing to symbols without definitions is where errors creep in.`,
      examTip: `Write a one-line definition for every variable in plain words. Well-defined variables prevent the classic mistake of subtracting in the wrong order.`,
    },
    {
      id: 'wp-rates-work',
      title: `2. Rate, Distance, and Work Problems`,
      content: `Rate problems all flow from one relationship: distance = rate * time (often written d = rt). Work problems are the same idea with "job done" replacing distance.

## Distance basics

If a train covers 180 miles in 3 hours, its rate is 60 mph. When two objects move, decide whether they approach (add rates) or chase (subtract rates).

## Average speed trap

Average speed for a round trip is total distance divided by total time, not the average of the two speeds. Driving 60 mph out and 40 mph back over the same distance gives an average below 50 because more time is spent at the slower speed.

## Combined work formula

If one worker finishes a job in a hours and another in b hours, together they take ab/(a + b) hours. Two painters taking 4 and 6 hours alone finish together in (4 * 6)/(4 + 6) = 24/10 = 2.4 hours.

## Worked example

Pipe A fills a tank in 3 hours; pipe B in 6 hours. How long together? Rates add: 1/3 + 1/6 = 2/6 + 1/6 = 3/6 = 1/2 tank per hour, so the tank fills in 2 hours. Adding rates (not times) is the key move.`,
      importantNote: `Rates add; times do not. For average speed always use total distance over total time, never the plain average of the speeds.`,
    },
    {
      id: 'wp-ratios-mixtures',
      title: `3. Ratios, Proportions, and Mixtures`,
      content: `A ratio compares quantities; a proportion sets two ratios equal. Mixture problems blend ratios with weighted averages.

## Working with ratios

If boys to girls is 3 to 5 and there are 40 students total, split into 3 + 5 = 8 parts. Each part is 40/8 = 5 students, so there are 15 boys and 25 girls. Turning a ratio into "parts" is the fastest approach.

## Proportions and scaling

If 4 machines make 240 units in an hour, how many do 7 machines make? Set up 4/240 = 7/x, or reason directly: each machine makes 60 per hour, so 7 make 420.

## Mixtures

To mix a 10% salt solution with a 30% solution to get 20%, use the weighted-average idea. Equal parts of 10% and 30% average to 20%, so mix them 1 to 1. If the target were 15%, it is closer to 10%, so you would use more of the 10% solution.

## Worked example

How many liters of pure water must be added to 10 liters of 40% acid to dilute it to 25%? The acid amount stays fixed at 4 liters. After adding w liters, total volume is 10 + w and 4/(10 + w) = 0.25. So 4 = 0.25(10 + w), giving 16 = 10 + w, w = 6 liters. Tracking the unchanged quantity (the acid) is the core technique.`,
      examTip: `Convert ratios into "parts" to find actual amounts. In mixtures, anchor on the quantity that does not change, usually the pure substance.`,
    },
    {
      id: 'wp-percent-interest',
      title: `4. Percents, Profit, and Interest`,
      content: `Percent problems appear everywhere on the GMAT: discounts, markups, profit margins, and interest. The unifying idea is the multiplier.

## Percent change as a multiplier

A 30% increase multiplies by 1.30; a 30% decrease multiplies by 0.70. Chaining changes means multiplying the factors, as covered in Problem Solving.

## Profit and cost

Profit = revenue - cost. Percent profit is usually taken on cost: if an item costing \$80 sells for \$100, the profit is \$20, which is 20/80 = 25% of cost.

## Simple vs. compound interest

Simple interest: I = P * r * t, where the interest each period is on the original principal only. Compound interest: final = P * (1 + r)^t, where interest earns interest.

## Worked example

You invest \$1,000 at 10% annual interest for 2 years. Simple interest gives 1000 * 0.10 * 2 = \$200, for a total of \$1,200. Compound interest gives 1000 * (1.10)^2 = 1000 * 1.21 = \$1,210. The extra \$10 is interest earned on the first year's interest. On the GMAT, note whether interest is simple or compound before computing; the wording tells you which formula to use.`,
      importantNote: `Percent profit is normally computed on cost, not on selling price. Read carefully to see whether interest is simple (on principal only) or compound (interest on interest).`,
    },
  ],
  keyTakeaways: [
    `Define every variable in words before writing equations to avoid reversed subtractions.`,
    `All motion problems reduce to distance = rate * time; rates add, times do not.`,
    `Average speed is total distance over total time, never the mean of two speeds.`,
    `Solve ratios by splitting into parts; solve mixtures by tracking the unchanged quantity.`,
    `Percent changes are multipliers; percent profit is usually on cost.`,
    `Distinguish simple interest (P*r*t) from compound interest (P*(1+r)^t).`,
  ],
},

gq_geometry: {
  topicId: 'gq_geometry',
  title: `Geometry`,
  domainWeight: 'Quantitative Reasoning',
  overview: `GMAT geometry covers lines and angles, triangles, quadrilaterals, circles, and coordinate geometry. The test focuses on a compact set of formulas and relationships, so memorizing them and knowing when to apply each is decisive. Figures are often not drawn to scale, so reasoning from given facts beats eyeballing. Triangles, especially right triangles, appear most frequently.`,
  sections: [
    {
      id: 'geo-angles-lines',
      title: `1. Lines, Angles, and Parallel Lines`,
      content: `Angle relationships are the vocabulary of geometry problems. Learning them makes multi-step figures solvable.

## Core angle facts

- Angles on a straight line sum to 180 degrees.
- Angles around a point sum to 360 degrees.
- Vertical (opposite) angles are equal.
- A triangle's interior angles sum to 180 degrees.

## Parallel lines cut by a transversal

When a line crosses two parallel lines, corresponding angles are equal, alternate interior angles are equal, and co-interior (same-side) angles sum to 180. Recognizing which pair you have lets you chase an unknown angle across the figure.

## Worked example

Two parallel lines are cut by a transversal. One angle is 65 degrees. The alternate interior angle is also 65 degrees, and the co-interior angle is 180 - 65 = 115 degrees. From one angle you can label the entire figure. The angle straight across (vertical) is 65 as well.

## Not to scale

GMAT figures warn "not drawn to scale" for a reason. Never measure with your eye; derive every value from the stated relationships. A figure may look like a right angle without being one unless the problem says so.`,
      examTip: `Treat any figure as not to scale unless told otherwise. Use stated angle relationships to label the diagram rather than estimating from appearance.`,
    },
    {
      id: 'geo-triangles',
      title: `2. Triangles and the Pythagorean Theorem`,
      content: `Triangles dominate GMAT geometry. Know the angle sum, the area formula, and the right-triangle relationships cold.

## Essential facts

- Interior angles sum to 180 degrees.
- Area = (1/2) * base * height.
- In any triangle, the longest side faces the largest angle.
- Triangle inequality: each side is less than the sum of the other two.

## Right triangles

The Pythagorean theorem states a^2 + b^2 = c^2, where c is the hypotenuse. Memorize common triples so you can skip computation: 3-4-5, 5-12-13, 8-15-17, and their multiples (6-8-10, etc.).

## Special right triangles

- 45-45-90: sides are in ratio 1 : 1 : sqrt(2).
- 30-60-90: sides are in ratio 1 : sqrt(3) : 2.

## Worked example

A right triangle has legs 6 and 8. The hypotenuse is a 6-8-10 triple, so it is 10, and the area is (1/2)(6)(8) = 24. Recognizing the triple avoids computing sqrt(36 + 64) = sqrt(100). For a 45-45-90 triangle with legs of 5, the hypotenuse is 5 * sqrt(2) immediately, no theorem needed.`,
      importantNote: `Memorize the Pythagorean triples (3-4-5, 5-12-13, 8-15-17) and the special-triangle ratios. They convert many problems into instant recall.`,
    },
    {
      id: 'geo-circles-quads',
      title: `3. Circles and Quadrilaterals`,
      content: `Circles and four-sided figures each carry a small set of formulas that recur constantly.

## Circle formulas

- Circumference = 2 * pi * r (or pi * d).
- Area = pi * r^2.
- A full circle is 360 degrees; an arc or sector is a proportional slice.

## Sectors and arcs

A sector with central angle 90 degrees is one quarter of the circle, so its area is (1/4) * pi * r^2 and its arc length is (1/4) of the circumference. Set up the fraction (central angle)/360 and multiply.

## Quadrilateral areas

- Rectangle: length * width.
- Square: side^2.
- Parallelogram: base * height.
- Triangle inside: recall area = (1/2) base * height.

## Worked example

A circle has radius 6. Its area is pi * 36 = 36 pi, and its circumference is 12 pi. A 60-degree sector is 60/360 = 1/6 of the circle, so its area is (1/6)(36 pi) = 6 pi and its arc length is (1/6)(12 pi) = 2 pi. Every sector question reduces to the same fraction of the whole. For a rectangle with a diagonal, the diagonal splits it into two right triangles, so the Pythagorean theorem gives its length.`,
      examTip: `For any arc or sector, set up the fraction (central angle)/360 and multiply by the full circumference or area. This single idea handles all partial-circle questions.`,
    },
    {
      id: 'geo-coordinate',
      title: `4. Coordinate Geometry`,
      content: `Coordinate geometry places shapes on the x-y plane, blending algebra with geometry.

## Key formulas

- Distance between (x1, y1) and (x2, y2): sqrt((x2 - x1)^2 + (y2 - y1)^2).
- Midpoint: ((x1 + x2)/2, (y1 + y2)/2).
- Slope: (y2 - y1)/(x2 - x1), the rise over run.

## Lines

The slope-intercept form is y = mx + b, where m is slope and b is the y-intercept. Parallel lines share the same slope; perpendicular lines have slopes that are negative reciprocals (their product is -1).

## Worked example

Find the distance between (1, 2) and (4, 6). Horizontal change is 3, vertical change is 4, so the distance is sqrt(3^2 + 4^2) = sqrt(9 + 16) = sqrt(25) = 5. This is just the Pythagorean theorem in disguise, and the 3-4-5 triple appears again.

## Slopes and perpendicularity

A line with slope 2 is perpendicular to a line with slope -1/2, since 2 * (-1/2) = -1. If a question asks for a line perpendicular to y = 2x + 3 through a point, the new slope is -1/2 and you solve for b using the point.`,
      importantNote: `The distance formula is the Pythagorean theorem on the coordinate plane. Parallel lines share slopes; perpendicular slopes multiply to -1.`,
    },
  ],
  keyTakeaways: [
    `Treat figures as not to scale; derive values from stated relationships, not appearance.`,
    `Memorize Pythagorean triples and the 45-45-90 and 30-60-90 ratios for instant answers.`,
    `Circle area is pi*r^2 and circumference is 2*pi*r; handle sectors with (angle)/360.`,
    `The coordinate distance formula is the Pythagorean theorem in disguise.`,
    `Parallel lines share slope; perpendicular slopes have a product of -1.`,
  ],
},

gq_data_sufficiency: {
  topicId: 'gq_data_sufficiency',
  title: `Data Sufficiency`,
  domainWeight: 'Quantitative Reasoning',
  overview: `Data Sufficiency is a uniquely GMAT format that asks not for the answer to a problem but whether you have enough information to answer it. Each question gives a prompt and two statements, and you choose from five fixed answer choices. The skill is disciplined logic: you must judge sufficiency without wasting time computing the actual value. This format appears in Quant and, in a data-focused form, in Data Insights.`,
  sections: [
    {
      id: 'ds-five-choices',
      title: `1. The Five Answer Choices`,
      content: `Every Data Sufficiency question uses the identical five answer choices, so memorizing them is the first step to speed.

## The choices (always in this order)

- **(A)** Statement 1 ALONE is sufficient, but statement 2 alone is not.
- **(B)** Statement 2 ALONE is sufficient, but statement 1 alone is not.
- **(C)** BOTH statements TOGETHER are sufficient, but NEITHER alone is sufficient.
- **(D)** EACH statement ALONE is sufficient.
- **(E)** The two statements TOGETHER are still NOT sufficient.

A memory aid is "1-2-TEN": test statement 1 alone, statement 2 alone, then Together, Either, or Neither.

## What "sufficient" means

A statement is sufficient if it lets you determine a single, definite answer. For a value question, that means one exact number. For a yes/no question, a definite "always yes" or "always no" is sufficient; "sometimes yes, sometimes no" is not.

## Worked example of the framework

Question: What is the value of x? Statement 1: x^2 = 16. Statement 2: x > 0. Statement 1 alone gives x = 4 or x = -4, two values, so not sufficient. Statement 2 alone says only x is positive, not sufficient. Together, x^2 = 16 and x > 0 force x = 4, a single value, so both together are sufficient but neither alone is. The answer is (C).`,
      examTip: `Memorize the five choices verbatim. The wording never changes, so you should never spend test time reading them.`,
    },
    {
      id: 'ds-avoid-computing',
      title: `2. Judging Sufficiency Without Solving`,
      content: `The central discipline of Data Sufficiency is deciding whether you could answer, not actually answering. Computing the final value wastes time you do not have.

## The independence rule

Evaluate statement 1 completely on its own, ignoring statement 2. Then, crucially, wipe statement 1 from your mind and evaluate statement 2 fresh. A common error is letting information from statement 1 leak into your judgment of statement 2.

## Counting equations

Often you can judge sufficiency by structure alone. To find two unknowns you generally need two independent linear equations. If a statement provides only one equation for two unknowns, it is usually insufficient by itself.

## Worked example

Question: What is the value of 2a + 3b? Statement 1: a + b = 5. Statement 2: a = 2b - 1. Rather than solving, notice statement 1 alone is one equation with two unknowns, so 2a + 3b is not fixed; insufficient. Statement 2 alone is also one equation, insufficient. Together you have two independent equations in two unknowns, which pins down a and b and therefore 2a + 3b. The answer is (C). You reached (C) without computing a or b, which is the whole point.

## The exception

Sometimes an expression is determined even when individual variables are not. If the question asked for a + b directly and statement 1 said a + b = 5, that single statement is sufficient. Always check whether the question wants a combination that the statement already gives.`,
      importantNote: `Evaluate each statement in complete isolation before combining. Never let statement 1 influence your read of statement 2. And stop the moment you know sufficiency; do not compute the value.`,
    },
    {
      id: 'ds-yes-no',
      title: `3. Yes/No Data Sufficiency`,
      content: `Many DS questions ask a yes/no question rather than for a value. The sufficiency rule shifts slightly: a statement is sufficient if it always yields the same answer, whether that answer is yes or no.

## The rule

- Always yes: sufficient.
- Always no: sufficient.
- Sometimes yes, sometimes no: NOT sufficient.

Beginners often think that answering "no" means insufficient. A definite "no" is a complete answer and is fully sufficient.

## Testing with cases

For yes/no questions, plug in numbers to try to break the statement. If you can find one case that gives yes and another that gives no, the statement is insufficient. If every case you try gives the same answer, it is likely sufficient.

## Worked example

Question: Is the integer n even? Statement 1: n^2 is even. Statement 2: 3n is even. For statement 1, if n^2 is even then n must be even (an odd number squared is odd), so the answer is always yes; sufficient. For statement 2, 3n even means n must be even (3 is odd, so n carries the evenness), also always yes; sufficient. Since each statement alone answers the question, the answer is (D).

## Deliberate case selection

Test strategic values: try 0, 1, a negative, and a fraction. These edge cases often expose a statement that seemed sufficient for ordinary numbers but fails for a boundary case.`,
      examTip: `A definite "no" is just as sufficient as a definite "yes." Try to break a statement by finding one yes case and one no case; if you cannot, it is sufficient.`,
    },
    {
      id: 'ds-common-traps',
      title: `4. Traps and the C-Trap`,
      content: `Data Sufficiency wrong answers are engineered around predictable reasoning errors. Two traps dominate.

## The C-trap

The C-trap tempts you to pick (C) because combining the statements feels safe, when in fact one statement alone was already sufficient (making the answer A, B, or D). Always fully test each statement alone before you allow yourself to combine them. If you jump straight to "together," you will overpick (C).

## The illusion of sufficiency

The opposite trap: a statement looks sufficient but hides multiple cases. If x^2 = 25, remember x could be 5 or -5. If told "x is a factor of 12," there are several possibilities. Whenever squares, absolute values, or "factors of" appear, deliberately hunt for a second case.

## Worked example

Question: Is x greater than 0? Statement 1: x^2 > 4. Statement 2: x^3 > 0. Statement 1 gives x > 2 or x < -2, so x could be positive or negative; insufficient. Statement 2 says x^3 > 0, and a cube is positive only when the base is positive, so x > 0 always; sufficient alone. The answer is (B). A test-taker rushing to combine would wrongly pick (C), the classic C-trap, missing that statement 2 alone settles it.

## Discipline checklist

Test 1 alone. Test 2 alone. Only if both fail do you combine. This order prevents both the C-trap and premature elimination.`,
      importantNote: `Beware the C-trap: always confirm neither statement works alone before choosing (C). Whenever you see squares, absolute values, or "factor of," look for a hidden second case.`,
    },
  ],
  keyTakeaways: [
    `The five DS choices are fixed; memorize them so you never reread them.`,
    `Judge sufficiency, do not compute the value; stop as soon as you know.`,
    `Evaluate each statement in total isolation before combining them.`,
    `For yes/no questions, a definite "no" is as sufficient as a definite "yes."`,
    `Beware the C-trap: verify neither statement works alone before picking (C).`,
    `Squares, absolute values, and "factor of" often hide a second case that breaks sufficiency.`,
  ],
},

gv_reading_comp: {
  topicId: 'gv_reading_comp',
  title: `Reading Comprehension`,
  domainWeight: 'Verbal Reasoning',
  overview: `Reading Comprehension presents a passage of roughly 200 to 350 words followed by several questions about its content, structure, and purpose. Passages cover business, science, and social science, but no outside knowledge is required; every answer is supported by the text. The skill is efficient reading for structure and returning to the passage to verify each answer rather than relying on memory.`,
  sections: [
    {
      id: 'rc-active-reading',
      title: `1. Reading for Structure, Not Detail`,
      content: `On a first read, chase the architecture of the passage, not every fact. You can always return for details; you cannot easily reconstruct the logic if you missed it.

## What to track

- **Main point**: the author's central claim in one sentence.
- **Purpose of each paragraph**: does it introduce, support, contrast, or qualify?
- **The author's attitude**: neutral, critical, supportive, skeptical?
- **Structural signals**: words like however, therefore, in contrast, and for example mark shifts in the argument.

## The mental map

After reading, you should be able to say, "Paragraph 1 introduces a theory, paragraph 2 gives evidence for it, paragraph 3 raises an objection." That skeleton answers most structure and main-idea questions directly.

## Worked example of structural reading

Imagine a passage where paragraph 1 describes a long-held view that a certain species migrates for warmth, and paragraph 2 opens with "Recent studies, however, suggest food availability drives the migration." The word "however" tells you the passage's purpose is to challenge the old view. You now anticipate the main point before reading the details. Marking that pivot is worth more than memorizing any single statistic.

## Reading pace

Spend the bulk of your time on the first read building this map; then answer questions quickly by returning to the relevant lines.`,
      examTip: `Note transition words like however, therefore, and in contrast. They mark the logical turns that main-idea and structure questions test.`,
    },
    {
      id: 'rc-question-types',
      title: `2. Recognizing Question Types`,
      content: `Each RC question type calls for a different approach. Identifying the type tells you where to look and what kind of answer is correct.

## The main types

- **Main idea / primary purpose**: asks for the passage's overall point. The answer must cover the whole passage, not one paragraph.
- **Detail / supporting idea**: asks what the passage states. The answer is directly supported by specific lines.
- **Inference**: asks what must be true based on the passage, though not stated outright. Stay close to the text; do not add outside logic.
- **Function / structure**: asks why the author included something, such as an example or a quotation.
- **Tone / attitude**: asks how the author feels about the subject.

## Matching approach to type

For a detail question, go back and find the exact line. For an inference question, choose the answer that the passage makes unavoidable, not merely plausible. GMAT inferences are conservative; the right answer is a small logical step, never a big leap.

## Worked example

If a passage says "the policy reduced costs but lowered morale," a valid inference is that the policy had mixed effects. An invalid inference is that the company should abandon the policy; the passage never evaluates that. The correct answer stays inside the boundary of what the text guarantees.`,
      importantNote: `GMAT inferences are conservative. The correct inference is something the passage forces to be true, never a broad conclusion the author did not commit to.`,
    },
    {
      id: 'rc-go-back',
      title: `3. Returning to the Passage`,
      content: `The single most reliable RC habit is to verify every answer against the text rather than trusting your memory of it.

## Predict, then match

Before reading the answer choices, form your own answer in your head based on the passage. Then find the choice that matches your prediction. This shields you from persuasive but wrong choices designed to sound like the passage.

## Line references

Detail and function questions often point to a specific part of the passage. Reread not just the cited line but a sentence or two around it for context; the reason for a statement is usually in the neighboring sentences.

## Worked example

Suppose a question asks, "The author mentions the 2005 drought primarily to..." Go back to where the drought appears. If the surrounding text reads "Even during the 2005 drought, yields held steady, showing the resilience of the new crop," then the drought is mentioned to illustrate resilience. The correct answer will paraphrase "to give an example of the crop's resilience," which you find only by rereading the context, not by recalling the fact.

## Why memory fails

Passages are dense and you read them once. Trap answers exploit fuzzy recall by combining real passage words into a false claim. Returning to the text is the antidote.`,
      examTip: `Predict your own answer from the passage before reading the choices, then verify by rereading the relevant lines with their surrounding context.`,
    },
    {
      id: 'rc-wrong-answers',
      title: `4. Eliminating Trap Answers`,
      content: `RC wrong answers follow recognizable patterns. Learning to name the flaw speeds elimination.

## Common wrong-answer types

- **Out of scope**: introduces an idea the passage never discusses. Tempting but unsupported.
- **Too extreme**: uses absolute words like always, never, all, or only that overstate a measured passage.
- **Distortion**: twists a real passage statement into something slightly but crucially different.
- **Half right**: the first half matches the passage; the second half contradicts it. Read the entire choice.
- **True but irrelevant**: a factually reasonable statement that does not answer the specific question asked.

## The extreme-language filter

Because most GMAT passages are cautious and qualified, answers with sweeping absolutes are usually wrong. An answer saying "the author proves that solar power will replace all fossil fuels" is far too strong for a balanced passage.

## Worked example

A passage notes that a policy "may have contributed to" lower emissions. A trap answer claims the policy "caused" the reduction; that upgrades "may have contributed" into certainty, a distortion. The correct answer preserves the passage's hedged language. Matching the strength of the wording, not just the topic, is essential.

## Elimination discipline

When two answers remain, find the specific word that makes one wrong. There is always a concrete flaw, not a matter of taste.`,
      importantNote: `Match the strength of an answer to the passage. Cautious passages rarely support answers containing always, never, all, or proves.`,
    },
  ],
  keyTakeaways: [
    `Read for structure and the author's purpose first; return for details later.`,
    `Identify the question type to know where to look and what answer form is correct.`,
    `GMAT inferences are conservative; pick what the text forces, not what it suggests.`,
    `Predict your own answer, then verify against the passage rather than memory.`,
    `Eliminate out-of-scope, extreme, distorted, and half-right choices; match the wording's strength.`,
  ],
},

gv_critical_reasoning: {
  topicId: 'gv_critical_reasoning',
  title: `Critical Reasoning`,
  domainWeight: 'Verbal Reasoning',
  overview: `Critical Reasoning presents a short argument, usually two to four sentences, followed by a question about that argument's logic. You must identify the conclusion, the evidence, and the assumption connecting them, then strengthen, weaken, or otherwise analyze the reasoning. This tests logical precision, and the same argument structures recur across questions once you learn to dissect them.`,
  sections: [
    {
      id: 'cr-argument-structure',
      title: `1. Deconstructing the Argument`,
      content: `Every Critical Reasoning argument has a conclusion (the main claim) and premises (the evidence). Separating them is the foundation for every question type.

## Finding the conclusion

The conclusion is what the author wants you to accept; the premises are why. Conclusion signals include therefore, thus, so, and hence. Premise signals include because, since, and given that. When no signal exists, ask "what is the author trying to convince me of?" That is the conclusion.

## The assumption

An assumption is an unstated premise the argument needs to hold together. It is the bridge between the evidence and the conclusion. Most CR questions revolve around this gap.

## Worked example

Argument: "The new cafe on Main Street will succeed because it serves the best coffee in town." Conclusion: the cafe will succeed. Premise: it serves the best coffee. The unstated assumption is that serving the best coffee is enough to make a cafe succeed, ignoring factors like price, location, or foot traffic. Spotting that gap is the key to strengthening or weakening the argument.

## Why structure matters

Once you can point to the conclusion, the evidence, and the gap between them, most question types become straightforward: you either reinforce the bridge, attack it, or identify it.`,
      examTip: `Always locate the conclusion first, then the premises, then the gap between them. Nearly every CR question is really about that gap.`,
    },
    {
      id: 'cr-assumptions',
      title: `2. Assumption and the Negation Test`,
      content: `Assumption questions ask for the unstated premise the argument depends on. The right answer is something that must be true for the conclusion to follow.

## The negation test

To check an answer to an assumption question, negate it. If negating the answer destroys the argument, it is a necessary assumption and the correct choice. If negating it leaves the argument intact, it is not required.

## Worked example

Argument: "Sales rose after we lowered prices, so the price cut caused the increase." A candidate assumption: "No other factor, such as a new advertising campaign, caused the rise." Negate it: "Another factor did cause the rise." If that negation is true, the price cut is no longer the cause, and the argument collapses. Because the negation destroys the argument, the assumption is necessary; it is the answer.

## Necessary vs. sufficient

Assumption questions want a necessary assumption, the minimum the argument needs, not a grand claim that would guarantee the conclusion. Answers that are too strong ("the price cut is the only thing that ever affects sales") overshoot and are usually wrong.

## Common assumption gaps

Watch for arguments that assume a correlation is causation, that a sample represents the whole, or that nothing has changed between two time periods. These recurring gaps point straight to the assumption.`,
      importantNote: `The negation test is the decisive tool for assumption questions: if negating an answer wrecks the argument, that answer is the necessary assumption.`,
    },
    {
      id: 'cr-strengthen-weaken',
      title: `3. Strengthen and Weaken Questions`,
      content: `Strengthen and weaken questions are the most common CR types. Both work on the assumption gap: strengthen supports the bridge, weaken attacks it.

## The mechanism

- **Weaken**: find the answer that makes the conclusion less likely, usually by showing the assumption is false or offering an alternative explanation.
- **Strengthen**: find the answer that makes the conclusion more likely, often by ruling out an alternative or confirming the assumption.

You are not proving or disproving the conclusion, merely shifting its likelihood. The best answer moves the needle most.

## Worked example (weaken)

Argument: "Ice cream sales and drowning deaths both rise in summer, so eating ice cream causes drowning." To weaken, introduce the real cause: "Hot weather independently increases both ice cream sales and swimming, which raises drownings." This alternative explanation (a lurking third factor) dismantles the causal claim. Alternative-cause answers are the classic way to weaken a causal argument.

## Worked example (strengthen)

For the same argument, a strengthener would rule out the alternative: "Even on identical-temperature days, higher ice cream consumption is followed by more drownings." That closes the gap the weakener exploited.

## Avoiding out-of-scope choices

The correct answer must bear directly on the conclusion. A choice that discusses a related but different claim, however interesting, does not affect this argument's logic.`,
      examTip: `For causal arguments, the strongest weakener supplies an alternative cause, and the strongest strengthener rules one out. Focus on the specific conclusion.`,
    },
    {
      id: 'cr-other-types',
      title: `4. Inference, Flaw, and Boldface Questions`,
      content: `Beyond strengthen and weaken, several other CR formats appear regularly, each with its own logic.

## Inference (must be true)

Here you pick the statement that must follow from the premises. Unlike strengthen/weaken, you accept the stimulus as fact and draw a conservative conclusion. Avoid choices that go beyond the given information, even slightly.

## Flaw and evaluate

- **Flaw** questions ask you to name the reasoning error, such as confusing correlation with causation, attacking the person instead of the argument, or generalizing from a biased sample.
- **Evaluate** questions ask which piece of information would most help judge the argument. The right answer is a question whose two possible answers would strengthen or weaken the argument in opposite directions.

## Boldface (describe the role)

In some arguments two sentences are in boldface, and you must describe each one's role, for instance "the first is the conclusion the author opposes; the second is evidence for the author's own view." Track whether each boldface part supports or opposes the author's ultimate position.

## Worked example (flaw)

Argument: "Our best salesperson uses the new software, so the software must be why she is the best." The flaw is assuming correlation implies causation; her success may cause her to adopt tools, or be due to experience. Naming the flaw precisely is the answer. Recognizing these standard fallacies makes flaw questions quick.`,
      importantNote: `Inference answers must be conservative and fully supported. Flaw questions usually name a standard fallacy such as correlation-causation or biased sampling.`,
    },
  ],
  keyTakeaways: [
    `Separate conclusion from premises; the argument's weak point is the gap between them.`,
    `Use the negation test to confirm a necessary assumption.`,
    `Weaken with an alternative cause; strengthen by ruling one out.`,
    `Inference answers must be conservative and fully supported by the stimulus.`,
    `Flaw questions typically name standard fallacies like correlation-causation or biased sampling.`,
  ],
},

gv_sentence_correction: {
  topicId: 'gv_sentence_correction',
  title: `Sentence Correction`,
  domainWeight: 'Verbal Reasoning',
  overview: `Sentence Correction tests standard written English: grammar, sentence structure, and clarity. A sentence is given with an underlined portion, and you choose the best version among five options. The Focus Edition of the GMAT removed this format from the live exam, but it remains an excellent way to sharpen grammar and precise writing, which supports the Verbal section overall. Focus on error patterns rather than obscure rules.`,
  sections: [
    {
      id: 'sc-subject-verb',
      title: `1. Subject-Verb Agreement`,
      content: `A verb must agree in number with its subject: singular subjects take singular verbs, plural subjects take plural verbs. Test writers hide the true subject to make agreement hard to see.

## Locating the real subject

Ignore words between the subject and the verb. In "The box of chocolates is on the table," the subject is box (singular), not chocolates, so the verb is "is." The prepositional phrase "of chocolates" is a distractor.

## Tricky subjects

- Phrases like "along with," "as well as," and "in addition to" do not make a singular subject plural. "The manager, along with her team, is attending" stays singular.
- "Each," "every," "neither," and "either" are singular. "Each of the students is ready."
- Collective nouns (team, company, jury) are usually singular in American English.

## Worked example

"The list of ingredients (are / is) printed on the label." Strip the middle phrase: the subject is "list," which is singular, so the correct verb is "is." Underlining the true subject and crossing out the intervening phrase is the reliable technique. Errors in these sentences almost always come from agreeing the verb with a nearby noun instead of the actual subject.`,
      examTip: `Cross out the phrase between the subject and verb, then check agreement. Words like "along with" never change the number of the subject.`,
    },
    {
      id: 'sc-modifiers',
      title: `2. Modifiers and Placement`,
      content: `A modifier describes another part of the sentence and must sit next to the word it modifies. Misplaced and dangling modifiers are among the most tested errors.

## The rule

An introductory modifying phrase must be followed immediately by the noun it describes. If it is not, the modifier "dangles" and the sentence says something unintended.

## Worked example of a dangling modifier

"Walking to school, the rain soaked my jacket." As written, this says the rain was walking to school. The introductory phrase "walking to school" must be followed by the person walking. Correct it to "Walking to school, I got my jacket soaked by the rain." Now the modifier attaches to "I," the actual walker.

## Misplaced modifiers

"She almost drove her kids to school every day" differs from "She drove her kids to school almost every day." The position of "almost" changes the meaning entirely. Place modifiers precisely so they attach to the intended word.

## Detecting the error

Whenever a sentence opens with a descriptive phrase followed by a comma, immediately check the word right after the comma. If that word cannot logically perform the action in the phrase, you have a dangling modifier and should look for the choice that fixes it.`,
      importantNote: `When a sentence starts with a comma-separated descriptive phrase, the noun right after the comma must be what the phrase describes. If not, the modifier dangles.`,
    },
    {
      id: 'sc-parallelism',
      title: `3. Parallelism and Comparisons`,
      content: `Items in a list or joined by conjunctions must share the same grammatical form. Comparisons must pair logically comparable things.

## Parallel structure

In a series, keep each element in the same form. "She likes running, swimming, and to bike" is faulty because "to bike" breaks the pattern. Correct: "She likes running, swimming, and biking." All three are now gerunds.

## Correlative conjunctions

Pairs like "not only ... but also," "either ... or," and "both ... and" require parallel structures on each side. "He is not only smart but also works hard" is unbalanced. Correct: "He not only is smart but also works hard," or "He is not only smart but also hardworking."

## Logical comparisons

Compare like with like. "The population of China is larger than India" wrongly compares a population to a country. Correct: "The population of China is larger than that of India," where "that of" supplies the missing population.

## Worked example

"The company's profits grew faster than its competitors." This compares profits to competitors. The fix is "faster than those of its competitors" or "faster than its competitors' profits." Whenever you see "than" or "like," verify the two things being compared are genuinely parallel in kind.`,
      examTip: `In any list or after "not only," "either," "than," or "like," check that the compared or listed items share the same grammatical form and are logically comparable.`,
    },
    {
      id: 'sc-pronouns-tense',
      title: `4. Pronouns, Verb Tense, and Idioms`,
      content: `Three more high-frequency areas round out Sentence Correction: pronoun clarity, verb tense consistency, and idiomatic usage.

## Pronoun agreement and clarity

A pronoun must agree in number with its antecedent and refer to it unambiguously. "When the managers met the clients, they were nervous" is ambiguous; who was nervous? Rewrite to specify. Also, "the company ... they" is a number error, since company is singular and needs "it."

## Verb tense consistency

Keep tenses logical across a sentence. Use the past perfect (had + verb) for an action completed before another past action: "By the time she arrived, the meeting had ended." The meeting ending happened first, so it takes the earlier "had ended."

## Idioms

English idioms are fixed word pairings the GMAT tests directly. Common correct forms: "different from" (not different than), "prohibit from," "responsible for," "prefer X to Y," "not only ... but also," and "so ... that." Idiom errors are memorization, not logic.

## Worked example

"The results are different than we expected" should be "different from what we expected." And "She is responsible to manage the budget" should be "responsible for managing the budget." Recognizing the correct idiom often eliminates two or three answer choices instantly, since idiom errors are easy to spot once you know the standard form.`,
      importantNote: `Pronouns must agree with and clearly point to one antecedent; a singular company takes "it," not "they." Past perfect marks the earlier of two past events.`,
    },
  ],
  keyTakeaways: [
    `Find the true subject by crossing out intervening phrases before checking the verb.`,
    `The noun after an introductory comma phrase must be what the phrase describes.`,
    `Keep lists and correlative pairs parallel, and compare only logically comparable things.`,
    `Pronouns need clear, number-matched antecedents; a company is singular ("it").`,
    `Use past perfect for the earlier of two past actions, and learn common idioms by memory.`,
  ],
},

gd_graphs_tables: {
  topicId: 'gd_graphs_tables',
  title: `Graphs & Table Interpretation`,
  domainWeight: 'Data Insights',
  overview: `Graphics Interpretation and Table Analysis questions in the Data Insights section present a chart, graph, or sortable table and ask you to draw conclusions from it. Success requires reading axes and legends carefully, spotting trends, and resisting misleading visual impressions. These questions blend basic data literacy with the percent and ratio math from Quant.`,
  sections: [
    {
      id: 'gt-read-carefully',
      title: `1. Reading Axes, Legends, and Scales`,
      content: `The most common errors on graphics questions come from misreading the setup, not the data. Before analyzing, orient yourself to what the graphic shows.

## Orientation checklist

- Read both axis labels and their units. Is the y-axis in dollars, thousands of dollars, or a percentage?
- Check the scale. Does it start at zero, or is it truncated to exaggerate differences? A bar chart starting at 90 makes small changes look huge.
- Read the legend for multi-series charts so you know which line or color is which.
- Note whether the data is cumulative or period-by-period.

## Worked example

Suppose a line chart's y-axis is labeled "Revenue (in millions)" and a point sits at 4. That is \$4 million, not \$4. A question asking for total revenue over three years labeled 4, 5, and 6 would sum to \$15 million. Misreading the unit is the classic trap, and the wrong answers are built around forgetting the "in millions" label.

## Truncated axes

If a bar chart's vertical axis runs from 95 to 100, two bars at 96 and 98 look dramatically different, but the real difference is only 2 units. Always read the actual numbers rather than trusting the visual size. The GMAT deliberately uses truncated scales to test whether you check the values.`,
      examTip: `Before doing any math, read every axis label, unit, and legend, and check whether the scale starts at zero. Most graphics errors are reading errors.`,
    },
    {
      id: 'gt-trends',
      title: `2. Identifying Trends and Relationships`,
      content: `Once oriented, look for the story the data tells: increases, decreases, peaks, correlations, and outliers.

## Kinds of trends

- **Monotonic**: values steadily rise or fall across the whole range.
- **Peak or trough**: values rise then fall (or vice versa), with a clear high or low point.
- **Correlation**: two variables move together (positive) or in opposite directions (negative). A scatterplot sloping up-right shows positive correlation.

## Rate of change

Distinguish "increasing" from "increasing faster." Sales can rise every year while the rate of growth slows. On a line graph, a curve that flattens is still going up but with a smaller slope.

## Worked example

A scatterplot shows study hours on the x-axis and test scores on the y-axis, with points trending upward from lower-left to upper-right. This indicates a positive correlation: more study hours tend to accompany higher scores. But a question asking whether studying "causes" higher scores goes too far; the graph shows correlation, not causation. That distinction, borrowed from Critical Reasoning, is frequently tested in Data Insights.

## Outliers

A single point far from the trend is an outlier. Note whether the question wants you to include or discount it, since one extreme value can distort an average significantly.`,
      importantNote: `A correlation in a chart is not proof of causation. Also distinguish "still increasing" from "increasing at a faster rate"; a flattening curve still rises.`,
    },
    {
      id: 'gt-table-analysis',
      title: `3. Sortable Tables and Filtering`,
      content: `Table Analysis questions give a spreadsheet-style table you can sort by any column, followed by several yes/no or true/false statements to evaluate.

## Using the sort

Sorting is your main tool. To find the largest value, sort that column descending and read the top row. To find how many entries exceed a threshold, sort and count from the top until values drop below it. Let the sort do the searching so you do not scan manually.

## Evaluating multiple statements

Each statement is judged independently as true or false based only on the table. Do not let one statement's answer influence another. Read each statement precisely; words like "at least," "more than," and "median" change what you must check.

## Worked example

A table lists 10 products with columns for price and units sold. A statement reads, "More than half of the products priced above \$20 sold fewer than 100 units." Sort by price, identify the products above \$20, then among just those check how many sold under 100 units, and compare to half of that subset. The two-step filtering (first by price, then by units) is the essence of table analysis. Work with only the relevant subset, not the whole table.

## Median vs. mean

Tables often test the median, the middle value when sorted. For an even count, the median is the average of the two middle values. Sorting the column makes the median easy to read off directly.`,
      examTip: `Sort the column relevant to each statement, then evaluate a filtered subset rather than scanning the full table. Judge each statement independently.`,
    },
    {
      id: 'gt-percent-math',
      title: `4. Applying Percent and Ratio Math`,
      content: `Graphics and table questions frequently require quick percent, ratio, and proportion calculations on the values you read off.

## Percent change from a chart

If revenue goes from 40 to 50 (in millions), the percent increase is (50 - 40)/40 = 10/40 = 25%. Always divide the change by the original value, not the new one. Reading the two numbers correctly and dividing by the starting point is the whole task.

## Share of total

To find what fraction one category is of the whole, divide its value by the sum of all categories. If four segments are 20, 30, 10, and 40, the total is 100, so the 30 segment is 30% of the total.

## Worked example

A bar chart shows quarterly profits of 8, 12, 6, and 14 (in thousands). The question asks the percent increase from Q3 to Q4. Read Q3 = 6 and Q4 = 14. Percent increase = (14 - 6)/6 = 8/6 = about 133%. Note this is more than 100%, since the value more than doubled. Test-takers who divide by 14 instead of 6, or who forget percentages can exceed 100, get trapped.

## Approximation

Because Data Insights is timed tightly, estimate when choices are far apart. Rounding 8/6 to "a bit more than 1" instantly signals an answer near 130%, letting you match the choice without exact division.`,
      importantNote: `Percent change always divides by the original (starting) value, and it can exceed 100% when a quantity more than doubles.`,
    },
  ],
  keyTakeaways: [
    `Read axes, units, legends, and scale before any calculation; most errors are reading errors.`,
    `Correlation in a chart does not prove causation.`,
    `Sort tables by the relevant column and evaluate a filtered subset, judging each statement alone.`,
    `Percent change divides by the original value and can exceed 100%.`,
    `Estimate when answer choices are widely spaced to save time.`,
  ],
},

gd_multi_source: {
  topicId: 'gd_multi_source',
  title: `Multi-Source Reasoning`,
  domainWeight: 'Data Insights',
  overview: `Multi-Source Reasoning presents information spread across two or three tabbed sources, which may mix text, tables, and charts. Questions require you to locate, combine, and synthesize data from more than one tab. The challenge is navigation and integration under time pressure: knowing which tab holds each fact and how the pieces fit together.`,
  sections: [
    {
      id: 'ms-organizing',
      title: `1. Organizing Information Across Tabs`,
      content: `Multi-Source Reasoning puts data behind two or three tabs so no single screen tells the whole story. Your first job is to build a mental (or scratch-paper) map of what each tab contains.

## Survey before solving

Skim each tab briefly before reading any question. You do not need to absorb every number; you need to know where each type of information lives. For example: "Tab 1 is a memo describing the project timeline, Tab 2 is a budget table, Tab 3 is an email about staffing."

## Note the connections

Sources are linked. The memo in Tab 1 might reference figures detailed in the Tab 2 table. Identify these cross-references early, because most questions require pulling from at least two tabs.

## Worked example

Imagine Tab 1 says a shipment must arrive before the launch date, Tab 2 gives shipping times from three suppliers, and Tab 3 lists supplier prices. A question asking for the cheapest supplier that still meets the deadline forces you to combine Tab 2 (timing) and Tab 3 (price) while applying the constraint from Tab 1 (deadline). Knowing in advance which tab holds which fact lets you jump straight to the relevant data instead of hunting mid-question. That navigation efficiency is what the format rewards.`,
      examTip: `Spend your first 30 to 60 seconds surveying every tab so you know where each kind of information lives before you read the questions.`,
    },
    {
      id: 'ms-synthesizing',
      title: `2. Synthesizing Data From Multiple Sources`,
      content: `The defining skill of Multi-Source Reasoning is combining facts that individually mean little but together answer the question.

## The synthesis move

A question rarely restates where the data is. You must recognize that answering it requires a value from one tab and a rule or figure from another, then join them.

## Worked example

Tab 1 (a policy memo) states that any project over \$50,000 needs executive approval. Tab 2 (a budget table) lists five projects with their costs. A question asks how many projects require executive approval. You apply the \$50,000 rule from Tab 1 to the cost column in Tab 2 and count the projects exceeding it. Neither tab alone answers the question; the rule lives in one place and the data in another. Recognizing that you must carry the rule to the data is the whole task.

## Watch for units and definitions

Different tabs may express things differently, one in units and another in dollars, or one monthly and another annually. Reconcile these before combining. A staffing tab giving weekly hours and a budget tab giving hourly rates must be aligned to compute a monthly cost.

## Chains of reasoning

Some questions need three steps: find a value in Tab 2, adjust it by a rule in Tab 1, then compare the result to a figure in Tab 3. Work methodically, writing intermediate results so you do not lose track across tabs.`,
      importantNote: `Most questions require joining a rule or definition from one tab with data from another. Reconcile differing units and time periods before you combine values.`,
    },
    {
      id: 'ms-inference',
      title: `3. Drawing Inferences and Testing Statements`,
      content: `Many Multi-Source questions use a table of statements you mark as "yes/no," "true/false," or "inferable/not inferable" based on the combined sources.

## The inference standard

As in Reading Comprehension and Critical Reasoning, an inference must be fully supported by the sources. If the tabs do not contain enough to confirm a statement, the answer is "cannot be determined" or "not inferable," even if the statement seems plausible.

## Evaluate each statement independently

Each row is judged on its own against all the sources. Treat every statement as a mini-question: which tabs bear on it, and do they jointly prove it?

## Worked example

Sources describe a company's three regional offices with revenue and headcount. A statement reads, "The office with the highest revenue also has the most employees." You must check both the revenue figures and the headcount figures, then see whether the same office tops both. If the highest-revenue office is not the largest by headcount, the statement is false. If the sources do not give headcount for one office, you cannot confirm it, so the answer is "cannot be determined." Distinguishing "false" from "cannot be determined" is a key subtlety here.

## Beware plausible but unsupported claims

A statement can sound reasonable and align with real-world expectations yet lack support in the sources. Judge strictly by what the tabs establish, never by outside assumptions.`,
      examTip: `A statement that is plausible but not backed by the sources is "cannot be determined," which is different from "false." Judge only from the given tabs.`,
    },
    {
      id: 'ms-efficiency',
      title: `4. Time Management and Navigation`,
      content: `Multi-Source Reasoning is time-intensive because of the reading and tab-switching. Efficient navigation separates strong scorers from those who run out of time.

## Read the question first, then dig

After your initial survey of the tabs, read each question before rereading the sources in depth. The question tells you exactly which data to retrieve, so you avoid reprocessing everything. Targeted retrieval beats rereading whole tabs.

## Do not re-read unnecessarily

Because several questions attach to one source set, you can reuse your understanding. Once you know Tab 2 holds the budget, you return only to the relevant row, not the whole table.

## Worked example of efficient flow

For a three-question set: survey all tabs once (about 45 seconds), then for question 1 jump to the two relevant tabs, for question 2 reuse what you learned plus one new figure, and for question 3 apply a rule you already located. By question 3 you barely reread anything. This compounding familiarity is why surveying first pays off.

## When to move on

If one statement in a multi-part question is genuinely ambiguous, resolve the others confidently and make a reasoned choice on the hard one. Do not let a single tricky row consume the time budget for the entire set.`,
      importantNote: `Survey once, then let each question direct your retrieval. Familiarity with the tabs compounds across the question set, so early investment pays off.`,
    },
  ],
  keyTakeaways: [
    `Survey all tabs first to map where each type of information lives.`,
    `Most questions require joining a rule from one tab with data from another.`,
    `Reconcile differing units and time periods before combining values.`,
    `Unsupported-but-plausible statements are "cannot be determined," not "false."`,
    `Let each question direct targeted retrieval; familiarity compounds across the set.`,
  ],
},

gd_two_part: {
  topicId: 'gd_two_part',
  title: `Two-Part Analysis`,
  domainWeight: 'Data Insights',
  overview: `Two-Part Analysis presents a scenario and asks you to select two related answers, one for each column, from a shared list of options. The two parts are often connected, such as a minimum and maximum, or two variables that must jointly satisfy a condition. These questions can be quantitative or verbal and reward systematic testing of the shared answer pool.`,
  sections: [
    {
      id: 'tp-format',
      title: `1. Understanding the Two-Column Format`,
      content: `Two-Part Analysis questions have a distinctive layout: a prompt, then a table with two columns of checkboxes or radio buttons and a single shared list of answer options. You pick exactly one option for each column.

## What makes it different

Unlike standard multiple choice, both selections come from the same pool of options, and the two answers are usually related by a constraint. The column headers tell you what each answer represents, for example "Value of x" and "Value of y," or "Amount invested by Investor A" and "by Investor B."

## Read the headers carefully

The entire question hinges on correctly interpreting the two column headers and the relationship the prompt states between them. Misreading which column is which is a frequent and costly error.

## Worked example

Suppose the prompt says two people together contributed \$100, and the columns are "Person A's contribution" and "Person B's contribution," with options 20, 30, 40, 60, 70, 80. You need two options that sum to 100: 20 and 80, 30 and 70, or 40 and 60 all qualify arithmetically, so you rely on an additional constraint in the prompt (perhaps A gave more than B) to choose the single correct pair. Recognizing that the two columns are linked by the sum is the first step; the extra condition then narrows it to one answer per column.`,
      examTip: `Read both column headers and the relationship between them before touching the options. The two answers are almost always linked by a stated constraint.`,
    },
    {
      id: 'tp-systematic',
      title: `2. Testing Options Systematically`,
      content: `Because both columns draw from one shared list, a systematic approach beats guessing. Often you can test options against the constraints rather than solving from scratch.

## Set up the constraints

Translate the prompt into one or two equations or conditions relating the two columns. Then scan the option list for the pair that satisfies them.

## Worked example

A prompt states: the sum of two numbers is 15 and their difference is 3. Columns are "Larger number" and "Smaller number." Options: 3, 6, 9, 12, 15. Solve quickly: the two numbers are 9 and 6 (sum 15, difference 3). So the larger column is 9 and the smaller is 6. Here algebra is fast, but if the setup were messier you would instead test pairs from the list: does any pair sum to 15 and differ by 3? Only 9 and 6, so you are done.

## Testing when algebra is hard

For word-heavy or constraint-heavy prompts, plug each candidate into the conditions. Because the option list is short (usually five or six), testing is manageable. Eliminate options that cannot work in either column to shrink the search.

## Independent or dependent columns

Determine whether the two answers must be different values or could be the same. Some questions allow the same option in both columns; others do not. Read whether the columns are constrained to differ.`,
      importantNote: `Translate the prompt into constraints relating the two columns, then test the shared option list. The short list makes systematic testing efficient.`,
    },
    {
      id: 'tp-quant-examples',
      title: `3. Quantitative Two-Part Problems`,
      content: `Many Two-Part questions are quantitative, involving rates, ratios, budgets, or optimization across two linked quantities.

## Common quantitative setups

- **Two-variable systems**: the columns are two unknowns satisfying two equations.
- **Min and max**: one column is the least possible value, the other the greatest, under some constraint.
- **Before and after**: the columns are a starting and ending amount.

## Worked example (min and max)

A store sells items for \$3 and \$5. A customer spends exactly \$29 buying at least one of each. The columns ask for the minimum and maximum possible number of \$3 items. Set up 3a + 5b = 29 with a, b at least 1. Test: if b = 1, 3a = 24, a = 8; if b = 4, 3a = 9, a = 3; if b = 5, 3a = 4, no integer. So a ranges among valid solutions. The maximum a is 8 (b = 1) and the minimum a is 3 (b = 4). The min column is 3 and the max column is 8. Working through the integer solutions systematically yields both answers at once.

## Keep the two answers consistent

Because the columns are linked, verify that your chosen pair jointly satisfies every condition, not just one column in isolation. A pair that makes column 1 correct but violates the overall constraint is wrong.`,
      examTip: `For min/max questions, list all valid integer combinations first; the smallest and largest values of the target quantity give both columns directly.`,
    },
    {
      id: 'tp-verbal-examples',
      title: `4. Verbal and Logical Two-Part Problems`,
      content: `Two-Part Analysis also appears in verbal form, asking you to identify, for instance, a strengthening statement and a weakening statement, or a cause and an effect, from a shared list.

## Common verbal setups

- **Assumption and conclusion**: one column marks the conclusion of an argument, the other an assumption it relies on.
- **Support and oppose**: one column selects a fact that supports a plan, the other a fact that undermines it.
- **Cause and effect**: identify which option is the cause and which is the result.

## Worked example

A prompt describes a company deciding whether to launch a product, followed by six statements. The columns are "Best supports launching" and "Best argues against launching." You evaluate each statement's effect on the decision. A statement like "demand for similar products is rising" supports launching, while "a competitor just released an identical product" argues against it. You place each in the correct column. This mirrors the strengthen/weaken logic from Critical Reasoning, applied to two columns at once.

## Avoiding column swaps

The most common error is putting the right statements in the wrong columns. After selecting, reread each header and confirm the statement genuinely plays that role. A statement that supports the plan must go in the support column, not the oppose column.

## Cross-checking

Because the two answers come from one list, eliminating an option for one column can help confirm it belongs in the other. Use the shared pool to your advantage.`,
      importantNote: `Verbal Two-Part questions apply Critical Reasoning logic across two columns. After choosing, reread the headers to ensure you did not swap the two answers.`,
    },
  ],
  keyTakeaways: [
    `Both answers come from one shared list and are usually linked by a stated constraint.`,
    `Translate the prompt into constraints, then systematically test the short option list.`,
    `For min/max quant questions, enumerate valid integer solutions to read off both columns.`,
    `Verbal Two-Part questions apply strengthen/weaken logic across two columns.`,
    `Reread the column headers after selecting to avoid swapping the two answers.`,
  ],
},

gd_data_sufficiency_di: {
  topicId: 'gd_data_sufficiency_di',
  title: `Data Sufficiency (DI)`,
  domainWeight: 'Data Insights',
  overview: `Data Sufficiency appears in the Data Insights section as well as Quant. The format and five answer choices are identical to Quant Data Sufficiency, but the content leans toward data interpretation, statistics, and real-world reasoning rather than pure algebra. You still decide whether the statements provide enough information, applying the same disciplined framework to data-driven prompts.`,
  sections: [
    {
      id: 'ds-di-framework',
      title: `1. The DS Framework in a Data Context`,
      content: `Data Insights Data Sufficiency uses exactly the same five answer choices as Quant DS, so the framework carries over completely.

## The five choices (unchanged)

- **(A)** Statement 1 alone is sufficient, statement 2 alone is not.
- **(B)** Statement 2 alone is sufficient, statement 1 alone is not.
- **(C)** Both together are sufficient, but neither alone is.
- **(D)** Each statement alone is sufficient.
- **(E)** Together they are still not sufficient.

## The same discipline

Evaluate statement 1 in isolation, then statement 2 in isolation, then together only if both fail alone. Judge sufficiency; do not compute the final answer. The only change is that the prompts involve data scenarios, rates, and statistics rather than abstract algebra.

## Worked example

Question: A store's average (mean) sale on Monday was how much? Statement 1: The store made 20 sales totaling \$1,000 on Monday. Statement 2: The store's largest sale on Monday was \$200. Statement 1 gives the mean directly: 1000/20 = \$50, sufficient. Statement 2 tells you only the maximum, not the average, insufficient. Since statement 1 alone works and statement 2 alone does not, the answer is (A). The reasoning is identical to Quant DS; only the flavor of the data changed.`,
      examTip: `The five DS choices are identical in Data Insights and Quant. Reuse the same isolation-then-combine discipline; only the subject matter shifts toward data.`,
    },
    {
      id: 'ds-di-statistics',
      title: `2. Sufficiency With Averages, Medians, and Ranges`,
      content: `Data Insights DS frequently hinges on statistics. Knowing exactly what each statistic requires is the key to judging sufficiency.

## What each statistic needs

- **Mean** requires the sum and the count. Either alone is not enough.
- **Median** requires knowing the middle value(s) when data is ordered, which often needs the full ordered list or at least the middle positions.
- **Range** requires only the maximum and minimum.
- **Mode** requires knowing which value repeats most.

## Worked example

Question: What is the median of five numbers? Statement 1: The mean of the five numbers is 10. Statement 2: The five numbers are 4, 6, 8, 12, and 20. Statement 1 gives the mean, which says nothing about the middle value; a set can have mean 10 with many different medians, so insufficient. Statement 2 lists all five numbers; ordered, the middle (third) value is 8, so the median is 8; sufficient. The answer is (B). Recognizing that the mean does not determine the median is the crucial insight.

## Traps with statistics

The mean and median are independent; knowing one rarely gives the other. Knowing the range (max minus min) tells you nothing about the middle. Match the statistic asked to exactly the information a statement provides, and reject statements that supply a different statistic.`,
      importantNote: `Mean needs sum and count; median needs the ordered middle; range needs only max and min. Knowing one statistic almost never determines another.`,
    },
    {
      id: 'ds-di-yes-no',
      title: `3. Yes/No Sufficiency With Data`,
      content: `As in Quant, many DI Data Sufficiency questions are yes/no. The rule is the same: a statement is sufficient if it forces a single definite answer, yes or no.

## Applying it to data claims

Yes/no DI questions often ask whether a quantity exceeds a threshold, whether one group outperformed another, or whether a trend holds. You need the statements to settle the question definitively.

## Worked example

Question: Did Product X generate more revenue than Product Y last quarter? Statement 1: Product X sold 500 units at \$20 each. Statement 2: Product Y sold 400 units at \$30 each. Statement 1 alone gives X's revenue (500 * 20 = \$10,000) but nothing about Y, insufficient. Statement 2 alone gives Y's revenue (400 * 30 = \$12,000) but nothing about X, insufficient. Together, X made \$10,000 and Y made \$12,000, so X did NOT make more; the answer is a definite "no," which is sufficient. Because both statements are needed and neither alone works, the answer is (C). A definite "no" from the combined statements is fully sufficient.

## Watch for hidden insufficiency

A statement can give a number that feels useful but does not answer the comparison. Always ask whether the specific yes/no question is settled, not merely whether you learned something.`,
      examTip: `In yes/no DI questions, a definite "no" from the statements is just as sufficient as a definite "yes." Confirm the specific question is settled, not just that you gained data.`,
    },
    {
      id: 'ds-di-traps',
      title: `4. Data-Specific Traps`,
      content: `Data Insights DS adds traps rooted in data interpretation on top of the standard C-trap and hidden-case errors.

## Percent vs. absolute

A statement giving a percentage without a base, or a base without a percentage, is often insufficient. "Sales grew 20%" does not tell you the dollar amount unless you also know the starting figure. Watch for questions that ask for an absolute value when a statement gives only a rate.

## Rates without totals

"Company A's profit margin is higher than Company B's" does not mean A earned more total profit, since B could have far greater revenue. Do not confuse a ratio or rate with an absolute quantity.

## Worked example (the C-trap in data)

Question: What was the total revenue? Statement 1: Revenue grew 25% from last year. Statement 2: Last year's revenue was \$4 million. Statement 1 alone gives only a growth rate, insufficient. Statement 2 alone gives only last year's figure, not this year's, insufficient. Together, this year's revenue is 4 million * 1.25 = \$5 million, sufficient; the answer is (C). Notice neither statement alone worked, so (C) is genuinely correct here, unlike the false C-trap where one statement secretly sufficed. Always verify each statement alone before combining.

## Missing base rates

Be alert to questions where a statement provides a proportion but the question needs a count, or vice versa. The mismatch between rate and absolute number is the signature Data Insights DS trap.`,
      importantNote: `A rate or percentage without a base value is usually insufficient for an absolute answer. Distinguish ratios and margins from total amounts; higher margin does not mean higher total.`,
    },
  ],
  keyTakeaways: [
    `DI Data Sufficiency uses the same five choices and isolation-then-combine discipline as Quant DS.`,
    `Mean needs sum and count; median needs the ordered middle; range needs only max and min.`,
    `A definite "no" from the statements is as sufficient as a definite "yes."`,
    `A percentage without a base (or a base without a percentage) is usually insufficient for an absolute value.`,
    `A higher rate or margin does not imply a higher total; distinguish ratios from absolute amounts.`,
    `Still verify each statement alone before choosing (C) to avoid the C-trap.`,
  ],
},

};

export function getGMATCourseContent(topicId: string): TopicLesson | null {
  return GMAT_COURSE[topicId] ?? null;
}

export function hasGMATCourseContent(topicId: string): boolean {
  return topicId in GMAT_COURSE;
}
