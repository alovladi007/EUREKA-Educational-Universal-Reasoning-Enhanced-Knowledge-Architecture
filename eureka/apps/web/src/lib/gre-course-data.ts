/**
 * GRE General Test course content for the "Read Lessons" tab.
 * 18 topics across Quantitative Reasoning, Verbal Reasoning, and Analytical Writing.
 * Content is original and illustrative; no copyrighted GRE questions are reproduced.
 */

import type { TopicLesson, LessonSection } from '@/lib/cissp-course-data';
// TopicLesson = { topicId: string; title: string; domainWeight: string; overview: string; sections: LessonSection[]; keyTakeaways?: string[] }
// LessonSection = { id: string; title: string; content: string; examTip?: string; importantNote?: string }

export const GRE_COURSE: Record<string, TopicLesson> = {

  quant_arithmetic: {
    topicId: 'quant_arithmetic',
    title: `Arithmetic & Number Properties`,
    domainWeight: 'Quantitative Reasoning',
    overview: `Arithmetic and number properties are the foundation of GRE Quant. This topic covers integers, factors and multiples, divisibility, primes, even/odd and positive/negative behavior, exponents, roots, and fractions. Mastering these rules lets you simplify problems quickly and avoid calculator-dependent traps.`,
    sections: [
      {
        id: 'arith-1-integers-divisibility',
        title: `1. Integers, Factors, and Divisibility`,
        content: `## Core definitions

An **integer** is a whole number: ..., -2, -1, 0, 1, 2, ... A **factor** (or divisor) of n divides n with no remainder. A **multiple** of n is any product n * k where k is an integer.

## Divisibility rules worth memorizing

- Divisible by 2: last digit is even.
- Divisible by 3: digit sum is divisible by 3. Example: 4,317 -> 4+3+1+7 = 15, so it is divisible by 3.
- Divisible by 4: last two digits form a number divisible by 4. Example: 1,932 -> 32 is divisible by 4.
- Divisible by 5: ends in 0 or 5.
- Divisible by 6: divisible by 2 and 3.
- Divisible by 9: digit sum divisible by 9.

## Worked example

How many positive integers less than 50 are divisible by both 4 and 6? A number divisible by both is divisible by their least common multiple, LCM(4, 6) = 12. Multiples of 12 below 50 are 12, 24, 36, 48, so the answer is **4**.

## Remainders

When a is divided by b, you can write a = b * q + r where 0 <= r < b. If 23 is divided by 5, then 23 = 5 * 4 + 3, so the remainder is 3. Remainder questions often hide a pattern: powers, sequences, or cyclic behavior. Always test small cases first.`,
        examTip: `The GRE calculator does not show remainders directly. To find the remainder of 23/5, compute 23 - 5 * floor(23/5) = 23 - 20 = 3.`,
      },
      {
        id: 'arith-2-primes-factorization',
        title: `2. Prime Numbers and Prime Factorization`,
        content: `## What is a prime?

A **prime** number has exactly two distinct positive divisors: 1 and itself. The first primes are 2, 3, 5, 7, 11, 13, 17, 19, 23, 29. Note that **2 is the only even prime**, and **1 is not prime**.

## Prime factorization

Every integer greater than 1 can be written uniquely as a product of primes. Example: 360 = 2^3 * 3^2 * 5. This factorization is the key to counting factors, finding LCM and GCF, and simplifying radicals.

## Counting factors

If n = p^a * q^b * r^c, the number of positive divisors is (a+1)(b+1)(c+1). For 360 = 2^3 * 3^2 * 5^1, the count is (3+1)(2+1)(1+1) = 4 * 3 * 2 = **24 factors**.

## GCF and LCM from factorizations

- GCF: take the lowest power of each shared prime.
- LCM: take the highest power of every prime that appears.

For 12 = 2^2 * 3 and 18 = 2 * 3^2: GCF = 2^1 * 3^1 = 6, LCM = 2^2 * 3^2 = 36. Notice that GCF * LCM = 6 * 36 = 216 = 12 * 18, a useful check.`,
        importantNote: `The identity GCF(a,b) * LCM(a,b) = a * b holds for any two positive integers and is a fast way to find one when you know the other.`,
      },
      {
        id: 'arith-3-even-odd-signs',
        title: `3. Even/Odd and Positive/Negative Rules`,
        content: `## Even and odd behavior

- even +/- even = even; odd +/- odd = even; even +/- odd = odd.
- even * anything = even; odd * odd = odd.

There is no simple rule for division, so avoid assuming an odd/even result there.

## Sign rules

- A positive times a negative is negative; two negatives multiply to a positive.
- An even power of a nonzero number is always positive: (-3)^2 = 9. An odd power keeps the sign: (-3)^3 = -27.

## Worked example

If x is negative and y is positive, what is the sign of x^3 * y^2? Here x^3 is negative (odd power of a negative) and y^2 is positive, so the product is **negative**.

## Zero is special

Zero is even, neither positive nor negative, and any nonzero number to the zero power equals 1. Watch for the phrase "positive integer," which excludes 0, versus "nonnegative integer," which includes 0.`,
        examTip: `On Quantitative Comparison problems, always test a negative number, a fraction between 0 and 1, and zero. These three cases break most careless assumptions.`,
      },
      {
        id: 'arith-4-exponents-roots',
        title: `4. Exponents, Roots, and Fractions`,
        content: `## Exponent rules

- x^a * x^b = x^(a+b)
- x^a / x^b = x^(a-b)
- (x^a)^b = x^(a*b)
- x^(-a) = 1 / x^a
- x^(1/2) = sqrt(x)

## Worked example

Simplify (2^5 * 2^3) / 2^6. Combine the top: 2^(5+3) = 2^8. Then 2^8 / 2^6 = 2^(8-6) = 2^2 = **4**.

## Roots

sqrt(a * b) = sqrt(a) * sqrt(b). To simplify sqrt(72), factor out a perfect square: 72 = 36 * 2, so sqrt(72) = 6 * sqrt(2). To rationalize a denominator like 1/sqrt(2), multiply top and bottom by sqrt(2) to get sqrt(2)/2.

## Fractions

To add fractions, find a common denominator: 1/3 + 1/4 = 4/12 + 3/12 = 7/12. To divide by a fraction, multiply by its reciprocal: (2/3) / (4/5) = (2/3) * (5/4) = 10/12 = 5/6. Comparing fractions is fast with cross-multiplication: to compare 3/7 and 4/9, compare 3 * 9 = 27 with 4 * 7 = 28. Since 27 < 28, we get 3/7 < 4/9.`,
        importantNote: `A number raised to a fractional exponent equals a root: x^(2/3) = (cube root of x)^2. Negative exponents flip to the denominator but never make the value negative.`,
      },
    ],
    keyTakeaways: [
      `Memorize divisibility rules for 2, 3, 4, 5, 6, and 9 to skip long division.`,
      `Prime factorization unlocks factor counting, GCF, LCM, and radical simplification.`,
      `2 is the only even prime and 1 is not prime.`,
      `GCF * LCM = product of the two numbers.`,
      `Test negatives, fractions, and zero to catch number-property traps.`,
    ],
  },

  quant_algebra: {
    topicId: 'quant_algebra',
    title: `Algebra & Equations`,
    domainWeight: 'Quantitative Reasoning',
    overview: `GRE algebra tests your ability to manipulate expressions, solve linear and quadratic equations, work with inequalities and absolute values, and handle systems of equations. The goal is fluency: recognizing structure so you can substitute, factor, or eliminate quickly rather than grinding through arithmetic.`,
    sections: [
      {
        id: 'alg-1-linear-equations',
        title: `1. Linear Equations and Expressions`,
        content: `## Solving a linear equation

Isolate the variable using inverse operations, keeping the equation balanced. Solve 3(x - 4) = 2x + 5. Distribute: 3x - 12 = 2x + 5. Subtract 2x: x - 12 = 5. Add 12: x = **17**.

## Working with expressions

Combine like terms and factor common pieces. For example, 6x + 9 = 3(2x + 3). Factoring often reveals cancellations later.

## Substitution

When a problem gives a value, substitute immediately. If x = 2 and y = -1, then 3x^2 - 2y = 3(4) - 2(-1) = 12 + 2 = **14**.

## FOIL and special products

- (a + b)^2 = a^2 + 2ab + b^2
- (a - b)^2 = a^2 - 2ab + b^2
- (a + b)(a - b) = a^2 - b^2

These three patterns appear constantly. Recognizing a^2 - b^2 lets you factor 49 - x^2 instantly as (7 - x)(7 + x).`,
        examTip: `If an equation looks messy, scan for a special-product pattern before expanding. Spotting a^2 - b^2 or a perfect square can save half a minute.`,
      },
      {
        id: 'alg-2-quadratics',
        title: `2. Quadratic Equations`,
        content: `## Standard form and factoring

A quadratic has the form ax^2 + bx + c = 0. To solve x^2 + 5x + 6 = 0, find two numbers that multiply to 6 and add to 5: 2 and 3. So (x + 2)(x + 3) = 0, giving x = -2 or x = -3.

## The quadratic formula

When factoring is hard, use x = (-b +/- sqrt(b^2 - 4ac)) / (2a). For x^2 - 4x + 1 = 0: x = (4 +/- sqrt(16 - 4)) / 2 = (4 +/- sqrt(12)) / 2 = 2 +/- sqrt(3).

## The discriminant

The expression b^2 - 4ac tells you the number of real solutions:
- positive: two real solutions
- zero: one repeated solution
- negative: no real solutions

## Worked example

For what value of k does x^2 + kx + 9 = 0 have exactly one solution? Set the discriminant to zero: k^2 - 4(1)(9) = 0, so k^2 = 36 and k = 6 or k = -6.`,
        importantNote: `A product equals zero only when one of its factors is zero. This zero-product principle is why factoring solves quadratics.`,
      },
      {
        id: 'alg-3-inequalities-absolute',
        title: `3. Inequalities and Absolute Value`,
        content: `## Solving inequalities

Treat inequalities like equations with one critical exception: **flip the inequality sign when you multiply or divide by a negative number**. Solve -2x + 3 > 7. Subtract 3: -2x > 4. Divide by -2 and flip: x < -2.

## Compound inequalities

For 3 < x + 1 < 7, subtract 1 from all three parts: 2 < x < 6.

## Absolute value

|x| means distance from zero, so |x - 2| = 5 splits into two cases: x - 2 = 5 or x - 2 = -5, giving x = 7 or x = -3.

## Absolute value inequalities

- |x| < a becomes -a < x < a.
- |x| > a becomes x < -a or x > a.

Solve |x - 3| < 4: this means -4 < x - 3 < 4, so -1 < x < 7. Absolute value inequalities are really statements about distance on the number line, which is the fastest way to picture them.`,
        examTip: `The single most common algebra mistake on the GRE is forgetting to flip the inequality sign when dividing by a negative. Circle every negative coefficient before you divide.`,
      },
      {
        id: 'alg-4-systems',
        title: `4. Systems of Equations`,
        content: `## Two methods

**Substitution** works when one variable is already isolated. **Elimination** works when you can add or subtract equations to cancel a variable.

## Elimination example

Solve the system:
2x + 3y = 12
2x - y = 4

Subtract the second from the first: 4y = 8, so y = 2. Substitute back: 2x - 2 = 4, so x = 3. The solution is (3, 2).

## Substitution example

If y = 2x - 1 and 3x + y = 14, replace y: 3x + (2x - 1) = 14, so 5x = 15 and x = 3, giving y = 5.

## Special cases

A system can have no solution (parallel lines, contradictory equations) or infinitely many (the same line written twice). If eliminating variables produces something false like 0 = 5, there is no solution; if it produces 0 = 0, there are infinitely many.`,
        importantNote: `Scale an equation before eliminating when coefficients do not match. To cancel x in 3x + 2y = 8 and 2x - y = 3, multiply the second by 2 and the first by nothing? Better: multiply the second by 1.5 or multiply to make matching coefficients, then subtract.`,
      },
    ],
    keyTakeaways: [
      `Memorize the three special products; recognizing a^2 - b^2 saves time.`,
      `Factor quadratics by finding numbers that multiply to c and add to b.`,
      `Use the discriminant b^2 - 4ac to count real solutions.`,
      `Flip the inequality sign only when multiplying or dividing by a negative.`,
      `Absolute value equations and inequalities split into two cases.`,
      `Choose substitution or elimination based on which is faster for the given system.`,
    ],
  },

  quant_word: {
    topicId: 'quant_word',
    title: `Word Problems & Translations`,
    domainWeight: 'Quantitative Reasoning',
    overview: `Word problems test whether you can translate English into algebra. This topic covers translation phrases, percent and ratio problems, rate/time/distance and work problems, and mixtures/averages. The winning approach is to define variables clearly, write one equation per relationship, and sanity-check the answer against the story.`,
    sections: [
      {
        id: 'word-1-translation',
        title: `1. Translating Words into Equations`,
        content: `## Key translation phrases

| English | Math |
| --- | --- |
| is, was, will be | = |
| of | multiply |
| percent | / 100 |
| more than | + |
| less than | - (and reverse order) |
| per | division / rate |

## Worked example

"Five less than twice a number is 11." Let the number be n. "Twice a number" is 2n; "five less than" that is 2n - 5. So 2n - 5 = 11, giving 2n = 16 and n = 8.

## Defining variables

Always write down what each variable stands for, including units. If a problem mixes ages, let the youngest be x and express others relative to x. Consistent variables prevent sign errors.

## Consecutive integers

Consecutive integers are x, x + 1, x + 2. Consecutive even or odd integers are x, x + 2, x + 4. If three consecutive integers sum to 72, then x + (x+1) + (x+2) = 72, so 3x + 3 = 72 and x = 23. The integers are 23, 24, 25.`,
        examTip: `"Less than" reverses the order: "5 less than x" is x - 5, not 5 - x. This reversal trips up many test takers.`,
      },
      {
        id: 'word-2-percent-ratio',
        title: `2. Percents and Ratios`,
        content: `## Percent basics

Percent change = (new - old) / old * 100. A price rising from 40 to 50 is a change of (50 - 40)/40 = 0.25 = 25% increase.

## Successive percent changes

Percent changes do not simply add. A 20% increase followed by a 20% decrease gives 1.20 * 0.80 = 0.96, a net **4% decrease**. Multiply the factors rather than adding the percents.

## Ratios

A ratio a : b can be scaled by a common factor. If a recipe uses flour to sugar in a 3 : 2 ratio and you use 12 cups of flour, then each "part" is 12/3 = 4 cups, so sugar is 2 * 4 = 8 cups.

## Combining ratios

To combine 2 : 3 (a to b) and 6 : 5 (b to c), scale so b matches: multiply the first by 2 to get 4 : 6, giving a : b : c = 4 : 6 : 5. This lets you compare all three quantities at once.`,
        importantNote: `To increase a value by p percent, multiply by (1 + p/100). To decrease, multiply by (1 - p/100). Chaining these factors handles any sequence of changes.`,
      },
      {
        id: 'word-3-rate-work',
        title: `3. Rate, Distance, and Work`,
        content: `## Distance formula

Distance = rate * time. If a car travels 180 miles in 3 hours, its rate is 180/3 = 60 mph.

## Combined and average speed

For a round trip, average speed is total distance over total time, not the average of the two speeds. Driving 60 miles at 30 mph (2 hours) then back at 60 mph (1 hour) covers 120 miles in 3 hours, so average speed is 40 mph, not 45.

## Work problems

If one worker finishes a job in a hours and another in b hours, their combined rate is 1/a + 1/b jobs per hour. Together they take 1 / (1/a + 1/b) hours. If pipe A fills a tank in 4 hours and pipe B in 6 hours, combined rate is 1/4 + 1/6 = 3/12 + 2/12 = 5/12 tank per hour, so they finish in 12/5 = 2.4 hours.

## Meeting and gap problems

When two objects move toward each other, add their rates. When one chases another, subtract the rates to get the closing speed.`,
        examTip: `Average speed is total distance divided by total time. Never average the two speeds directly unless the time spent at each speed is equal.`,
      },
      {
        id: 'word-4-mixtures-averages',
        title: `4. Mixtures and Averages`,
        content: `## Averages

Average = sum / count. If the sum is what you need, rearrange: sum = average * count. Five test scores averaging 82 have a total of 5 * 82 = 410.

## Weighted averages

When groups have different sizes, weight by count. A class of 10 students averaging 70 and 20 students averaging 85 has a combined average of (10 * 70 + 20 * 85) / 30 = (700 + 1700)/30 = 2400/30 = 80. The result leans toward the larger group.

## Mixture problems

Track the amount of the pure component. Mixing 3 liters of 20% salt solution with 2 liters of 45% salt solution gives total salt = 0.20 * 3 + 0.45 * 2 = 0.6 + 0.9 = 1.5 liters of salt in 5 liters, a concentration of 1.5/5 = 30%.

## Missing value from an average

If four numbers average 15 and three of them are 10, 12, and 20, the total is 60, so the fourth number is 60 - (10 + 12 + 20) = 60 - 42 = 18.`,
        importantNote: `A weighted average always falls between the group averages and lands closer to the group with more members. Use this to sanity-check your arithmetic.`,
      },
    ],
    keyTakeaways: [
      `Define each variable with units before writing equations.`,
      `Percent changes multiply, not add; convert p percent to the factor (1 +/- p/100).`,
      `Scale ratios by matching the shared term to combine three quantities.`,
      `Average speed is total distance over total time.`,
      `Combined work rate is the sum of individual rates: 1/a + 1/b.`,
      `Weighted averages lean toward the larger group.`,
    ],
  },

  quant_geometry: {
    topicId: 'quant_geometry',
    title: `Geometry`,
    domainWeight: 'Quantitative Reasoning',
    overview: `GRE geometry covers lines and angles, triangles (including special right triangles), quadrilaterals and polygons, circles, and basic solids. Figures are not drawn to scale, so rely on given values and theorems rather than appearance. Knowing a handful of formulas and the special triangle ratios handles most questions.`,
    sections: [
      {
        id: 'geo-1-lines-angles',
        title: `1. Lines and Angles`,
        content: `## Angle basics

Angles on a straight line sum to 180 degrees; angles around a point sum to 360 degrees. Vertical angles (opposite angles formed by two crossing lines) are equal.

## Parallel lines cut by a transversal

When a transversal crosses two parallel lines:
- Corresponding angles are equal.
- Alternate interior angles are equal.
- Co-interior (same-side interior) angles sum to 180 degrees.

## Worked example

Two parallel lines are cut by a transversal. One angle measures 3x and the co-interior angle measures 2x. Since they sum to 180, 3x + 2x = 180, so x = 36 and the angles are 108 and 72 degrees.

## Complementary and supplementary

Complementary angles sum to 90 degrees; supplementary angles sum to 180. If an angle is 25 degrees, its complement is 65 and its supplement is 155.`,
        examTip: `GRE figures may look misleading because they are not to scale. Trust the labeled measures and the theorems, never the visual proportions.`,
      },
      {
        id: 'geo-2-triangles',
        title: `2. Triangles`,
        content: `## Angle and side rules

The interior angles of any triangle sum to 180 degrees. The largest angle is opposite the longest side. The triangle inequality says any side is shorter than the sum of the other two: for sides 4 and 9, the third side x satisfies 5 < x < 13.

## Area

Area = (1/2) * base * height. A triangle with base 10 and height 6 has area 30.

## Special right triangles

- 45-45-90: sides are in ratio 1 : 1 : sqrt(2). A leg of 5 gives a hypotenuse of 5 * sqrt(2).
- 30-60-90: sides are in ratio 1 : sqrt(3) : 2. The side opposite 30 is half the hypotenuse.

## Pythagorean theorem and triples

For a right triangle, a^2 + b^2 = c^2. Memorize the triples 3-4-5, 5-12-13, and 8-15-17 (and their multiples like 6-8-10). If the legs are 9 and 12, recognize 3 * (3-4-5) so the hypotenuse is 15 without computing.

## Similar triangles

Similar triangles have equal angles and proportional sides. If two triangles are similar with a side ratio of 2 : 3, their areas are in ratio 4 : 9 (the square of the side ratio).`,
        importantNote: `Area ratios of similar figures equal the square of the length ratio, and volume ratios equal the cube. This shortcut appears often in scaling problems.`,
      },
      {
        id: 'geo-3-quadrilaterals-polygons',
        title: `3. Quadrilaterals and Polygons`,
        content: `## Key quadrilaterals

- Rectangle: area = length * width; diagonals are equal.
- Square: area = side^2; a special rectangle and rhombus.
- Parallelogram: area = base * height; opposite sides and angles equal.
- Trapezoid: area = (1/2)(b1 + b2) * height.

## Worked example

A trapezoid has parallel sides of 8 and 12 and a height of 5. Its area is (1/2)(8 + 12)(5) = (1/2)(20)(5) = 50.

## Polygon angle sums

The interior angles of an n-sided polygon sum to (n - 2) * 180 degrees. A pentagon (n = 5) sums to 540 degrees. A regular polygon's each interior angle is that sum divided by n; for a regular hexagon, 720/6 = 120 degrees.

## Perimeter versus area

Two shapes can share a perimeter but differ wildly in area. Among rectangles with a fixed perimeter, the square encloses the most area. Keep perimeter (a length) and area (a squared quantity) mentally separate.`,
        examTip: `For any polygon, interior angle sum is (n - 2) * 180. Divide by n for a regular polygon's single interior angle.`,
      },
      {
        id: 'geo-4-circles-solids',
        title: `4. Circles and Solids`,
        content: `## Circle formulas

- Circumference = 2 * pi * r
- Area = pi * r^2

A circle with radius 5 has circumference 10 * pi and area 25 * pi.

## Arcs and sectors

A central angle of theta degrees defines an arc and sector that are theta/360 of the whole. A 90-degree sector of a circle with radius 6 has area (90/360) * pi * 36 = 9 * pi.

## Solids

- Rectangular box: volume = length * width * height; surface area = 2(lw + lh + wh).
- Cylinder: volume = pi * r^2 * h.
- Cube: volume = side^3.

## Worked example

A cylinder has radius 3 and height 10. Its volume is pi * 3^2 * 10 = 90 * pi. If you unroll its curved surface, it is a rectangle of height 10 and width equal to the circumference 6 * pi, so the lateral surface area is 60 * pi.

## Inscribed shapes

A common setup places a circle inside a square (or vice versa). If a circle of radius r is inscribed in a square, the square's side equals the diameter 2r, so its area is (2r)^2 = 4r^2.`,
        importantNote: `Keep answers in terms of pi unless the problem asks for a decimal. Most GRE circle answer choices are written with pi, so avoid multiplying it out.`,
      },
    ],
    keyTakeaways: [
      `Figures are not to scale; rely on labeled values and theorems.`,
      `Memorize the 45-45-90 and 30-60-90 side ratios and common Pythagorean triples.`,
      `Interior angles of an n-gon sum to (n - 2) * 180 degrees.`,
      `Similar figures scale area by the square and volume by the cube of the length ratio.`,
      `A sector or arc is theta/360 of the full circle.`,
      `Leave answers in terms of pi when the choices do.`,
    ],
  },

  quant_coordinate: {
    topicId: 'quant_coordinate',
    title: `Coordinate Geometry`,
    domainWeight: 'Quantitative Reasoning',
    overview: `Coordinate geometry connects algebra and geometry on the xy-plane. You will use the slope, distance, and midpoint formulas, write and interpret line equations, understand parallel and perpendicular relationships, and read graphs of lines, parabolas, and circles. Sketching quickly on scratch paper prevents sign mistakes.`,
    sections: [
      {
        id: 'coord-1-plane-slope',
        title: `1. The Coordinate Plane and Slope`,
        content: `## Quadrants and signs

The plane is divided into four quadrants. Quadrant I has (+, +), II has (-, +), III has (-, -), and IV has (+, -). Knowing signs by quadrant helps you eliminate answer choices fast.

## Slope

Slope m = (y2 - y1) / (x2 - x1), the "rise over run." For points (1, 2) and (4, 8): m = (8 - 2)/(4 - 1) = 6/3 = 2.

## Reading slope

- Positive slope rises left to right.
- Negative slope falls left to right.
- Zero slope is a horizontal line.
- Undefined slope is a vertical line (division by zero in the run).

## Worked example

A line passes through (0, 3) and (2, -1). Its slope is (-1 - 3)/(2 - 0) = -4/2 = -2, so the line falls steeply from left to right.`,
        examTip: `A vertical line has an undefined slope, not a slope of zero. Horizontal lines have slope zero. Confusing these is a frequent error.`,
      },
      {
        id: 'coord-2-line-equations',
        title: `2. Equations of Lines`,
        content: `## Slope-intercept form

y = mx + b, where m is the slope and b is the y-intercept (where the line crosses the y-axis). The line y = 2x + 3 has slope 2 and crosses the y-axis at (0, 3).

## Point-slope form

y - y1 = m(x - x1) lets you build a line from a slope and one point. With slope 4 through (1, 5): y - 5 = 4(x - 1), which simplifies to y = 4x + 1.

## Finding intercepts

Set y = 0 for the x-intercept and x = 0 for the y-intercept. For y = 2x - 6, the x-intercept is where 0 = 2x - 6, so x = 3, giving (3, 0); the y-intercept is (0, -6).

## Worked example

Write the equation of the line through (2, 1) and (6, 9). Slope = (9 - 1)/(6 - 2) = 8/4 = 2. Using point-slope with (2, 1): y - 1 = 2(x - 2), so y = 2x - 3.`,
        importantNote: `From y = mx + b you can read the slope and y-intercept instantly. Rewriting any line into this form is usually the fastest first step.`,
      },
      {
        id: 'coord-3-distance-midpoint',
        title: `3. Distance, Midpoint, and Parallel/Perpendicular`,
        content: `## Distance formula

The distance between (x1, y1) and (x2, y2) is sqrt((x2 - x1)^2 + (y2 - y1)^2), a direct application of the Pythagorean theorem. Between (1, 2) and (4, 6): sqrt(3^2 + 4^2) = sqrt(25) = 5.

## Midpoint formula

The midpoint is the average of the coordinates: ((x1 + x2)/2, (y1 + y2)/2). The midpoint of (2, 4) and (8, 10) is (5, 7).

## Parallel and perpendicular

- Parallel lines have equal slopes.
- Perpendicular lines have slopes that are negative reciprocals; their product is -1.

## Worked example

A line has slope 3. A line perpendicular to it has slope -1/3, because 3 * (-1/3) = -1. If a line is parallel to y = -2x + 5, it also has slope -2 but a different intercept.`,
        examTip: `Perpendicular slopes multiply to -1. To get the perpendicular slope, flip the fraction and change the sign: the perpendicular of 2/3 is -3/2.`,
      },
      {
        id: 'coord-4-graphs-curves',
        title: `4. Graphs of Curves`,
        content: `## Parabolas

The graph of y = ax^2 + bx + c is a parabola. If a > 0 it opens upward with a minimum; if a < 0 it opens downward with a maximum. The vertex x-coordinate is -b/(2a). For y = x^2 - 4x + 1, the vertex is at x = 4/2 = 2, and y = 4 - 8 + 1 = -3, so the vertex is (2, -3).

## Circles

The equation (x - h)^2 + (y - k)^2 = r^2 describes a circle centered at (h, k) with radius r. The equation (x - 3)^2 + (y + 1)^2 = 16 is a circle centered at (3, -1) with radius 4.

## Reflections and shifts

- Replacing x with -x reflects across the y-axis.
- Replacing y with -y reflects across the x-axis.
- y = f(x) + k shifts the graph up by k; y = f(x - h) shifts right by h.

## Worked example

The point (2, 5) reflected across the x-axis becomes (2, -5); reflected across the y-axis it becomes (-2, 5); reflected through the origin it becomes (-2, -5).`,
        importantNote: `A quick sketch of the axes and one or two points often reveals the answer faster than manipulating equations, especially for reflection and intercept questions.`,
      },
    ],
    keyTakeaways: [
      `Slope is rise over run; vertical lines have undefined slope, horizontal lines slope zero.`,
      `Rewrite lines into y = mx + b to read slope and intercept instantly.`,
      `Distance uses the Pythagorean theorem; midpoint is the coordinate average.`,
      `Parallel lines share a slope; perpendicular slopes are negative reciprocals.`,
      `A parabola's vertex is at x = -b/(2a); a circle's center and radius come from (x-h)^2 + (y-k)^2 = r^2.`,
    ],
  },

  quant_data: {
    topicId: 'quant_data',
    title: `Data Analysis & Statistics`,
    domainWeight: 'Quantitative Reasoning',
    overview: `Data analysis on the GRE includes measures of central tendency and spread, interpreting graphs and tables, working with the normal distribution and percentiles, and reading data across linked charts. These questions reward careful reading over heavy computation, so track units and axes closely.`,
    sections: [
      {
        id: 'data-1-central-tendency',
        title: `1. Mean, Median, Mode, and Range`,
        content: `## Definitions

- Mean: sum divided by count.
- Median: the middle value when data is ordered (average of the two middle values if the count is even).
- Mode: the most frequent value.
- Range: maximum minus minimum.

## Worked example

For the data set 4, 8, 8, 10, 15: the mean is (4 + 8 + 8 + 10 + 15)/5 = 45/5 = 9; the median is the middle value 8; the mode is 8; the range is 15 - 4 = 11.

## Mean versus median

The mean is sensitive to outliers; the median is not. If you add the value 100 to the set above, the mean jumps but the median barely moves. When a distribution is skewed by extreme values, the median describes the "typical" value better.

## Changing a data set

Adding a constant c to every value raises the mean, median, and each individual value by c but leaves the range and standard deviation unchanged. Multiplying every value by c scales the mean, median, and range by c.`,
        examTip: `If a set is symmetric, the mean equals the median. A mean pulled above the median signals right-skew (a high outlier); a mean below the median signals left-skew.`,
      },
      {
        id: 'data-2-spread-sd',
        title: `2. Standard Deviation and Spread`,
        content: `## What standard deviation measures

Standard deviation (SD) measures how spread out values are around the mean. A larger SD means more dispersion. The GRE rarely asks you to compute SD from scratch; instead it tests conceptual comparison.

## Comparing spreads

The set {10, 10, 10, 10} has SD 0 because every value equals the mean. The set {5, 10, 10, 15} has the same mean, 10, but a positive SD because values deviate. Between {8, 9, 11, 12} and {2, 6, 14, 18}, the second is more spread out and has the larger SD.

## Effect of transformations

Adding a constant to every value does not change the SD, because it shifts the whole set without changing how spread out it is. Multiplying every value by k multiplies the SD by |k|.

## Interquartile range

The interquartile range (IQR) is the third quartile minus the first quartile, capturing the middle 50 percent of data. Like SD, it is unaffected by adding a constant. IQR is more resistant to outliers than the range.`,
        importantNote: `Adding a constant shifts a data set without changing its spread, so SD and IQR stay the same. Only multiplication (scaling) changes the spread.`,
      },
      {
        id: 'data-3-graphs-tables',
        title: `3. Reading Graphs and Tables`,
        content: `## Chart types

- Bar graphs compare discrete categories.
- Line graphs show change over time.
- Pie charts show parts of a whole; each slice is a percent of 360 degrees.
- Scatterplots show the relationship between two variables.

## Pie chart math

If a category is 25 percent of a pie chart, its slice spans 0.25 * 360 = 90 degrees. To find the actual count, multiply the percent by the total. If 25 percent of 800 survey respondents chose an option, that is 0.25 * 800 = 200 people.

## Multi-chart data sets

The GRE often pairs two or three linked charts. A typical question requires you to pull a percent from one chart and a total from another, then combine them. Read the titles, axis labels, and units before computing; a common trap is mixing thousands with raw counts.

## Worked example

A bar graph shows a company earned \$4 million in Q1 and \$5 million in Q2. A pie chart shows North America is 40 percent of Q2 revenue. North America's Q2 revenue is 0.40 * 5 = \$2 million.`,
        examTip: `Before any calculation, read the axis labels and units. Chart questions punish careless reading far more than weak arithmetic.`,
      },
      {
        id: 'data-4-normal-percentiles',
        title: `4. Normal Distribution and Percentiles`,
        content: `## The normal curve

A normal distribution is symmetric and bell-shaped, centered on its mean. The empirical rule (the 68-95-99.7 rule) states that about 68 percent of data lies within one standard deviation of the mean, about 95 percent within two, and about 99.7 percent within three.

## Applying the rule

Suppose test scores are normally distributed with mean 500 and SD 100. About 68 percent of scores fall between 400 and 600. About 95 percent fall between 300 and 700. A score of 700 is two SDs above the mean, placing it near the 97.5th percentile.

## Percentiles

A value at the p-th percentile is greater than or equal to p percent of the data. The median is the 50th percentile. If you score in the 90th percentile, you outperformed about 90 percent of test takers.

## Z-scores

A z-score tells how many standard deviations a value sits from the mean: z = (value - mean) / SD. A score of 620 with mean 500 and SD 100 has z = (620 - 500)/100 = 1.2.`,
        importantNote: `The 68-95-99.7 rule is the single most tested fact about the normal distribution. Memorize those three percentages and the symmetry of the curve.`,
      },
    ],
    keyTakeaways: [
      `Mean is outlier-sensitive; median is resistant. Symmetric data has mean = median.`,
      `Adding a constant leaves range, SD, and IQR unchanged; multiplying scales them.`,
      `Read axis labels and units before computing on any chart.`,
      `A pie slice's angle is percent times 360 degrees.`,
      `The normal distribution follows the 68-95-99.7 empirical rule.`,
      `A z-score counts standard deviations from the mean.`,
    ],
  },

  quant_probability: {
    topicId: 'quant_probability',
    title: `Counting & Probability`,
    domainWeight: 'Quantitative Reasoning',
    overview: `This topic covers the fundamental counting principle, permutations and combinations, basic probability, and the rules for combining events. The key skill is deciding whether order matters (permutation) or not (combination), and whether events are independent or mutually exclusive.`,
    sections: [
      {
        id: 'prob-1-counting',
        title: `1. The Fundamental Counting Principle`,
        content: `## Multiplying choices

If one decision has m outcomes and an independent second decision has n outcomes, together they have m * n outcomes. Choosing from 4 shirts and 3 pairs of pants yields 4 * 3 = 12 outfits.

## Slots method

Break a problem into slots and multiply the options per slot. A 3-digit code where each digit is 0-9 and digits can repeat has 10 * 10 * 10 = 1000 possibilities. If digits cannot repeat, it is 10 * 9 * 8 = 720.

## Worked example

A license plate has 2 letters followed by 3 digits, with repetition allowed. The count is 26 * 26 * 10 * 10 * 10 = 676 * 1000 = 676,000.

## Handling restrictions

Deal with the most restricted slot first. If the first digit of a code cannot be zero, fill that slot with 9 options before filling the rest.`,
        examTip: `Ask "does order matter?" before choosing a method. If arrangements like AB and BA count separately, order matters (permutation); if they are the same selection, it does not (combination).`,
      },
      {
        id: 'prob-2-permutations-combinations',
        title: `2. Permutations and Combinations`,
        content: `## Permutations (order matters)

The number of ways to arrange r items from n is nPr = n! / (n - r)!. Arranging 3 books from 5 on a shelf: 5P3 = 5 * 4 * 3 = 60.

## Combinations (order does not matter)

The number of ways to choose r items from n is nCr = n! / (r! * (n - r)!). Choosing 3 people from 5 for a committee: 5C3 = (5 * 4 * 3) / (3 * 2 * 1) = 10.

## Recognizing the difference

A committee of 3 (no roles) is a combination. Assigning president, vice president, and treasurer to 3 of 5 people is a permutation, because the roles make order matter: 5P3 = 60.

## Worked example

From a group of 7 students, how many ways can you form a 2-person team? Since a team has no internal order, use 7C2 = (7 * 6)/(2 * 1) = 21.`,
        importantNote: `nCr = nPr / r!. Every combination corresponds to r! permutations, so dividing the permutation count by r! removes the ordering.`,
      },
      {
        id: 'prob-3-basic-probability',
        title: `3. Basic Probability`,
        content: `## The probability formula

Probability = favorable outcomes / total equally likely outcomes. A probability is always between 0 and 1.

## Worked example

A bag holds 3 red and 5 blue marbles. The probability of drawing red is 3 / (3 + 5) = 3/8.

## Complement rule

The probability an event does not happen is 1 minus the probability it does. If the chance of rain is 0.3, the chance of no rain is 0.7. The complement is often the fastest path: "at least one" problems are usually easiest as 1 minus "none."

## Worked example

Two fair coins are flipped. The probability of at least one head equals 1 minus the probability of no heads. No heads (both tails) is (1/2)(1/2) = 1/4, so at least one head is 1 - 1/4 = 3/4.`,
        examTip: `For "at least one" questions, compute 1 minus the probability of "none." This shortcut avoids adding many separate cases.`,
      },
      {
        id: 'prob-4-combined-events',
        title: `4. Combining Events`,
        content: `## The AND rule (independent events)

For independent events, P(A and B) = P(A) * P(B). Rolling a 6 on a die and flipping heads: (1/6)(1/2) = 1/12.

## The OR rule (mutually exclusive events)

For mutually exclusive events, P(A or B) = P(A) + P(B). The general rule subtracts the overlap: P(A or B) = P(A) + P(B) - P(A and B).

## Dependent events

When outcomes affect each other, adjust after the first draw. Drawing 2 red marbles in a row from 3 red and 5 blue without replacement: (3/8) * (2/7) = 6/56 = 3/28. The denominator shrinks because a marble was removed.

## Worked example

A standard deck has 52 cards. The probability of drawing a heart or a king is P(heart) + P(king) - P(heart and king) = 13/52 + 4/52 - 1/52 = 16/52 = 4/13. The overlap (the king of hearts) is subtracted so it is not double counted.`,
        importantNote: `Multiply probabilities for AND (both happen), add for OR (either happens), and subtract the overlap in the general OR rule to avoid double counting.`,
      },
    ],
    keyTakeaways: [
      `Decide whether order matters: permutations for arrangements, combinations for selections.`,
      `nCr = nPr / r! removes the ordering from a permutation count.`,
      `Probability is favorable over total, always between 0 and 1.`,
      `Use the complement (1 minus) for "at least one" problems.`,
      `Multiply for AND, add for OR, and subtract the overlap in the general OR rule.`,
      `For dependent events, update the counts after each draw.`,
    ],
  },

  quant_comparison: {
    topicId: 'quant_comparison',
    title: `Quantitative Comparison Strategies`,
    domainWeight: 'Quantitative Reasoning',
    overview: `Quantitative Comparison (QC) questions ask you to compare Quantity A and Quantity B and choose one of four fixed answers. They reward strategy over raw computation: manipulate both quantities in parallel, plug in strategic numbers, and stay alert for cases where the relationship changes. This section teaches the recurring techniques.`,
    sections: [
      {
        id: 'qc-1-format-answers',
        title: `1. The QC Format and Four Answers`,
        content: `## The four answer choices

Every QC question has the same four options:
- A: Quantity A is greater.
- B: Quantity B is greater.
- C: The two quantities are equal.
- D: The relationship cannot be determined from the information given.

## What "cannot be determined" means

Choice D is correct only when the relationship changes depending on allowable values. If you can find one case where A > B and another where A < B (or A = B), the answer is D.

## Worked example

Quantity A: x. Quantity B: x^2. Testing x = 2 gives A = 2, B = 4, so B is greater. But testing x = 1/2 gives A = 0.5, B = 0.25, so A is greater. Because the relationship flips, the answer is D.

## When D is impossible

If both quantities are specific numbers with no variables, D can never be correct; the answer must be A, B, or C. Recognizing this eliminates one choice instantly on purely numeric problems.`,
        examTip: `On a purely numeric QC problem (no variables), choice D is automatically wrong. The relationship is fixed, so cross it out immediately.`,
      },
      {
        id: 'qc-2-parallel-manipulation',
        title: `2. Manipulate Both Sides in Parallel`,
        content: `## Simplify like an inequality

Treat the comparison as an unknown inequality and simplify both quantities with legal moves: add or subtract the same amount from both, or multiply/divide both by the same positive number.

## Worked example

Quantity A: 3x + 7. Quantity B: 3x + 4. Subtract 3x from both sides: A becomes 7, B becomes 4. So A is always greater regardless of x, and the answer is A.

## The negative-number caution

You may add or subtract anything from both sides freely, but you may only multiply or divide both sides by a value you know is positive. If a variable could be negative, dividing by it can flip the relationship, so do not divide by a variable of unknown sign.

## Cancel common structure

Quantity A: (x + 5)/2. Quantity B: (x + 3)/2. Multiply both by 2: A becomes x + 5, B becomes x + 3. Subtract x: A is 5, B is 3, so A is greater. Stripping away shared structure reveals the comparison quickly.`,
        importantNote: `Adding or subtracting the same quantity from both sides is always safe. Multiplying or dividing by a variable is only safe when you are certain of its sign.`,
      },
      {
        id: 'qc-3-plug-in-numbers',
        title: `3. Plugging In Strategic Numbers`,
        content: `## Choose revealing values

When variables are involved, test numbers that often change relationships:
- 0
- 1
- a negative number
- a fraction between 0 and 1
- a large number

These "FROZEN" categories (Fractions, Radicals/One, Zero, Extremes, Negatives) expose hidden behavior.

## Worked example

Quantity A: x^2. Quantity B: x^3. Test x = 2: A = 4, B = 8, so B is greater. Test x = 1/2: A = 0.25, B = 0.125, so A is greater. The relationship flips, so the answer is D.

## Confirm before committing

If your first test suggests A is greater, deliberately try to find a case where B is greater or they are equal. If you cannot after testing the tricky values, you can be confident in A. If you can, the answer is D.`,
        examTip: `Never conclude after a single plug-in. Always try to break your answer with a fraction, a negative, and zero before locking in A, B, or C.`,
      },
      {
        id: 'qc-4-common-traps',
        title: `4. Common Traps and Time Management`,
        content: `## Watch for hidden constraints

Read any given conditions carefully. "x is a positive integer" removes fractions and negatives from consideration, which can turn a D into a definite answer. Always incorporate stated constraints before plugging in.

## The "looks obvious" trap

QC problems often bait you toward a quick answer. If a comparison seems too easy, check whether a fraction or negative could flip it. Geometry QC figures are especially deceptive because they are not to scale.

## Avoid unnecessary computation

You rarely need exact values, only the direction of the comparison. If both quantities share a positive common factor, drop it. If you can tell one is clearly larger by estimation, you are done.

## Worked example

Quantity A: 17 * 23. Quantity B: 18 * 22. Instead of multiplying, note both are near 18 * 22 = 396; 17 * 23 = 391. So B is greater by 5. Even faster, products of numbers with a fixed sum are larger when the numbers are closer together, so 18 * 22 exceeds 17 * 23.`,
        importantNote: `For two products whose factors have the same sum, the pair that is closer together gives the larger product. This lets you compare 18 * 22 versus 17 * 23 without multiplying.`,
      },
    ],
    keyTakeaways: [
      `Memorize the four fixed QC answers; D means the relationship truly varies.`,
      `On purely numeric QC problems, D is always wrong.`,
      `Simplify both quantities in parallel using safe inequality moves.`,
      `Only multiply or divide both sides by a value of known positive sign.`,
      `Plug in 0, 1, a negative, and a fraction to test whether the relationship flips.`,
      `Respect stated constraints and avoid computing exact values you do not need.`,
    ],
  },

  verb_text_completion: {
    topicId: 'verb_text_completion',
    title: `Text Completion`,
    domainWeight: 'Verbal Reasoning',
    overview: `Text Completion presents a short passage with one, two, or three blanks; you select one answer per blank from separate columns, with no partial credit. Success depends on finding textual clues, predicting the meaning before reading choices, and tracking the logical direction signaled by transition words.`,
    sections: [
      {
        id: 'tc-1-format-strategy',
        title: `1. Format and Core Strategy`,
        content: `## The format

Text Completion has one blank (five choices), or two or three blanks (three choices each). Multi-blank questions require every blank correct for any credit, so precision matters.

## The predict-first method

Before looking at the answer choices, read the whole sentence and predict a word or short phrase for the blank in your own terms. Then match your prediction to the closest choice. This prevents attractive but wrong words from swaying you.

## Worked example

"Although the critic was known for her harsh reviews, her assessment of the young pianist was surprisingly ______." The word "although" signals contrast with "harsh," so predict a positive word like "kind" or "generous." A choice such as "laudatory" fits; a choice like "scathing" is a trap that ignores the contrast.

## Attack multi-blank in the easiest order

You do not have to fill blanks left to right. Start with the blank that has the strongest clue, lock it in, and use it to constrain the others.`,
        examTip: `Cover the answer choices with your hand or scratch paper and predict the blank first. Reading the choices too early lets tempting wrong words hijack your reasoning.`,
      },
      {
        id: 'tc-2-context-clues',
        title: `2. Finding Context Clues`,
        content: `## Clues live in the sentence

The correct answer is always supported by evidence in the text. Look for restatements, examples, contrasts, and descriptive details that point to the blank's meaning.

## Definition and restatement clues

Sometimes the sentence defines the missing word. "Her ______ nature meant she rarely spoke, preferring silence to conversation." The second half restates the blank, so predict "reticent" or "taciturn."

## Example clues

"The museum displayed ______ artifacts, including a 3,000-year-old vase and an ancient scroll." The examples signal age, so predict "ancient" or "antique."

## Contrast clues

"Unlike his ______ brother, Marco was thrifty and saved every dollar." "Unlike" and "thrifty" signal the opposite, so the brother is "extravagant" or "profligate." Identify the pivot word to know whether the blank agrees with or opposes the surrounding idea.`,
        importantNote: `The support for the answer is always inside the passage. If you cannot point to specific words that justify your choice, you are guessing rather than reasoning.`,
      },
      {
        id: 'tc-3-transition-words',
        title: `3. Transition Words and Logical Direction`,
        content: `## Continuation versus contrast

Transition words tell you whether the sentence continues an idea or reverses it.

| Continuation | Contrast |
| --- | --- |
| moreover, furthermore | however, although |
| indeed, in fact | but, yet, despite |
| similarly, likewise | on the contrary, whereas |

## Using direction to predict

"The senator was famous for candor; ______, she never dodged a difficult question." The semicolon and continuation mean the blank agrees with candor, so predict "accordingly" leading to a supporting idea.

## Reversal example

"The plan seemed foolproof; nevertheless, it ______ at the first obstacle." "Nevertheless" reverses "foolproof," so predict a failure word like "collapsed" or "faltered."

## Cause and effect

Words like "because," "since," "therefore," and "consequently" chain a cause to an effect. Track that chain to predict whether the blank is the cause or the result.`,
        examTip: `Circle every transition word first. A single "however" or "although" can flip the meaning of the blank and turn a right answer into a wrong one.`,
      },
      {
        id: 'tc-4-eliminate-verify',
        title: `4. Eliminating and Verifying`,
        content: `## Eliminate against your prediction

Compare each choice to your prediction. Cross out words that carry the wrong tone or direction, even if they sound sophisticated. Do not fall for a hard word just because you recognize it.

## Plug back in and reread

After selecting answers for all blanks, reread the complete sentence with your words inserted. It should read smoothly and preserve the intended logic. If any blank sounds off, reconsider it.

## Worked example

"The findings were far from ______; in fact, several later studies overturned them entirely." "Far from" plus "overturned" signal the results were not reliable, so predict "conclusive" or "definitive." Reading it back, "far from conclusive" fits perfectly.

## Two-blank verification

For multi-blank questions, confirm the blanks are consistent with each other. A common trap offers a choice that works for one blank in isolation but contradicts the logic once the second blank is filled.`,
        importantNote: `Always reread the full completed sentence. Multi-blank questions give no partial credit, so a single mismatched blank sinks the entire answer.`,
      },
    ],
    keyTakeaways: [
      `Predict the blank in your own words before reading the choices.`,
      `Every correct answer is justified by specific clues in the passage.`,
      `Transition words reveal whether the blank continues or contrasts the idea.`,
      `Start multi-blank questions with the most clued blank, not left to right.`,
      `Reread the completed sentence; multi-blank items give no partial credit.`,
    ],
  },

  verb_sentence_equiv: {
    topicId: 'verb_sentence_equiv',
    title: `Sentence Equivalence`,
    domainWeight: 'Verbal Reasoning',
    overview: `Sentence Equivalence gives one sentence with a single blank and six answer choices; you must pick the two words that both complete the sentence and produce sentences with the same meaning. It blends vocabulary with logic, since the right pair must be roughly synonymous in that context.`,
    sections: [
      {
        id: 'se-1-format',
        title: `1. Format and the Two-Answer Rule`,
        content: `## The unique format

Sentence Equivalence always has exactly six choices and requires exactly two correct answers, with no partial credit. The two correct words must do two things: fit the sentence logically and create two sentences that mean essentially the same thing.

## Not just any two synonyms

A common trap includes two words that are synonyms of each other but do not fit the sentence, or two words that both fit but mean different things. Both conditions, fit and equivalent meaning, must hold.

## Worked example

"The novel's plot was so ______ that readers struggled to follow it." Predict "confusing." Among the choices, "convoluted" and "labyrinthine" both mean tangled and complex, fit the sentence, and match each other, so they form the pair.

## Strategy overview

Predict the meaning first, then hunt for two choices that match your prediction and each other. If only one word fits your prediction, widen your prediction rather than forcing an odd pair.`,
        examTip: `The answer is a matched pair, not two independently good words. If a candidate word has no near-synonym among the other choices, it is almost certainly wrong.`,
      },
      {
        id: 'se-2-predict-pair',
        title: `2. Predict, Then Find the Pair`,
        content: `## Predict before scanning

As with Text Completion, read the sentence and predict a word for the blank in your own language. Then look for two choices that both express that idea.

## Look for synonym pairs

Scan the six choices and mentally group any that are near-synonyms. The correct answer is usually a pair you can pre-identify, then test against the sentence.

## Worked example

"Despite the team's ______ preparation, they lost the match badly." "Despite" signals contrast with losing, so predict "thorough" or "meticulous." The choices "scrupulous" and "diligent" both mean careful and thorough, forming the pair, while a lone word like "hasty" fits neither the prediction nor a partner.

## Avoid the singleton trap

If you find a word that perfectly fits but has no synonym among the other five, reconsider. The GRE guarantees the correct answers come in a matched pair, so a perfect fit with no partner signals a trap or a missed second word.`,
        importantNote: `Two correct answers must be near-synonyms in context. Use that to your advantage: eliminate any choice that lacks a plausible partner among the six.`,
      },
      {
        id: 'se-3-clues-tone',
        title: `3. Clues, Tone, and Direction`,
        content: `## Same clues as Text Completion

Restatement, example, and contrast clues drive Sentence Equivalence just as they do Text Completion. Identify the pivot words to set the blank's direction.

## Tone and connotation

Two words can be dictionary synonyms yet differ in tone. "Frugal" and "stingy" both describe not spending, but "frugal" is positive and "stingy" is negative. The sentence's tone decides which connotation fits, and the correct pair must share it.

## Worked example

"The mentor's ______ advice guided the young scientist to several breakthroughs." The positive result ("breakthroughs") calls for positive words, so "sage" and "judicious" (both meaning wise) fit, while "meddlesome" carries the wrong connotation despite relating to advice.

## Watch the contrast pivots

"Although," "despite," "yet," and "however" reverse direction. Miss one and you may pick a well-matched pair with exactly the wrong meaning.`,
        examTip: `Match connotation, not just definition. A positive-context blank needs two positively toned words; a pair split between positive and negative tone cannot both be correct.`,
      },
      {
        id: 'se-4-vocab-elimination',
        title: `4. Vocabulary and Elimination`,
        content: `## Leverage roots when stuck

If you do not know a word, break it into roots and affixes. "Benevolent" contains "bene" (good) and "vol" (wish), so it means well-meaning. "Malinger" contains "mal" (bad). Root knowledge often reveals tone even when the exact meaning is fuzzy.

## Eliminate to a pair

Cross out any word that clearly does not fit the sentence, then look for the matched pair among what remains. Even if you are unsure of one word, if the other five leave only one plausible partner, you can deduce the answer.

## Worked example

"The critic dismissed the film as ______, arguing it offered nothing audiences had not seen many times before." Predict "unoriginal." Among choices, "derivative" and "hackneyed" both mean unoriginal and overused, forming the pair, while "innovative" is the opposite and "lengthy" is irrelevant.

## Use process of elimination confidently

Because there are six choices and two answers, eliminating three or four words often forces the correct pair. Combine partial vocabulary knowledge with the pairing requirement to close the gap.`,
        importantNote: `When vocabulary fails you, combine root analysis with the two-answer structure. Eliminating obvious misfits frequently narrows six choices to the one valid pair.`,
      },
    ],
    keyTakeaways: [
      `Pick two words that both fit and produce sentences with the same meaning.`,
      `The correct answers are near-synonyms; a word with no partner is usually wrong.`,
      `Predict the blank first, then locate a matched pair among the six choices.`,
      `Match connotation and tone, not just dictionary definition.`,
      `Use word roots and elimination to deduce the pair when vocabulary is uncertain.`,
    ],
  },

  verb_reading_comp: {
    topicId: 'verb_reading_comp',
    title: `Reading Comprehension`,
    domainWeight: 'Verbal Reasoning',
    overview: `Reading Comprehension passages range from one paragraph to several, drawn from the sciences, social sciences, humanities, and business. Question types include main idea, detail, inference, purpose, and vocabulary in context. The goal is to read for structure and argument, then return to the text for evidence rather than relying on memory.`,
    sections: [
      {
        id: 'rc-1-active-reading',
        title: `1. Active Reading for Structure`,
        content: `## Read for the map, not the details

On a first pass, focus on the passage's structure: the main point, how each paragraph functions, and where the author's opinion appears. Do not memorize facts; you can return for those.

## Track the author's voice

Notice signal words that reveal the author's stance: "surprisingly," "unfortunately," "critics argue," "however." These mark where the author agrees, disagrees, or shifts.

## Paragraph roles

Ask what each paragraph does: introduce a theory, raise an objection, give an example, or conclude. A three-paragraph passage might present a claim, offer counterevidence, and then qualify the claim.

## Worked example

If paragraph one describes a long-held scientific belief and paragraph two opens with "Recent studies, however, suggest otherwise," you can predict the passage will challenge the original belief. Anticipating structure makes the questions faster to answer.`,
        examTip: `Spend your first read building a mental map of the argument, not absorbing every detail. Details are easy to relocate; structure is what the questions test.`,
      },
      {
        id: 'rc-2-question-types',
        title: `2. Recognizing Question Types`,
        content: `## Main idea questions

These ask for the central point or best title. The answer covers the whole passage, not one paragraph. Eliminate choices that are too narrow (a single detail) or too broad (beyond the passage's scope).

## Detail questions

These ask what the passage states directly. Return to the relevant lines and confirm the answer is supported almost verbatim, not merely plausible.

## Inference questions

These ask what must be true based on the passage, even if unstated. A valid inference follows necessarily from the text; avoid choices that require outside assumptions.

## Purpose and function questions

These ask why the author included something: "The author mentions the 1990 study primarily to ______." Answer by identifying the role that detail plays in the argument, such as providing a counterexample or supporting a claim.

## Worked example

If a passage says "many economists once assumed markets were fully rational, but behavioral research revealed systematic biases," an inference question could correctly conclude that human decisions are not always rational, a claim the text logically supports.`,
        importantNote: `Match your approach to the question type. Detail questions need textual proof; inference questions need logical necessity; main idea questions need whole-passage scope.`,
      },
      {
        id: 'rc-3-inference-evidence',
        title: `3. Inference and Evidence`,
        content: `## Inferences stay close to the text

A GRE inference is a small, safe step beyond what is stated, not a leap. If a passage says a policy "reduced but did not eliminate" a problem, you can infer the problem still exists, but not that the policy failed overall.

## Avoid extreme language

Wrong inference choices often use absolute words like "always," "never," "all," or "impossible." The passage rarely supports such strong claims, so treat extreme wording with suspicion.

## Use the text as proof

For every answer, especially inferences, point to the specific sentence that justifies it. If you cannot, the choice is likely an unsupported assumption.

## Worked example

A passage states, "The treatment improved symptoms in most patients, though a minority saw no change." A supported inference is that the treatment was not universally effective. An unsupported (and wrong) inference is that the treatment was ineffective, which contradicts "most patients improved."`,
        examTip: `Distrust answer choices with absolute words. Passages usually hedge, so an inference stated too strongly is probably a trap.`,
      },
      {
        id: 'rc-4-traps-vocab-context',
        title: `4. Common Traps and Vocabulary in Context`,
        content: `## Frequent trap types

- Out-of-scope: introduces information the passage never discusses.
- Distortion: twists a detail slightly, reversing or exaggerating it.
- Half-right: the first half matches the text but the second half does not.
- Extreme: overstates a hedged claim.

## Vocabulary in context

These questions ask what a word means as used in the passage, not its most common definition. Substitute each choice into the sentence and see which preserves the meaning.

## Worked example

If a passage says an argument was "novel," a vocabulary-in-context question might ask its meaning. Here "novel" means new or original, not a work of fiction. Plugging "new" into the sentence confirms the fit.

## Manage the whole passage set

Multi-question passages reward reading once carefully, then answering all questions from that single strong understanding. Resist rereading the whole passage for each question; instead reread only the lines a specific question targets.`,
        importantNote: `For vocabulary-in-context questions, the answer is often not the word's most familiar meaning. Test each choice by substitution to find the one that keeps the sentence's sense intact.`,
      },
    ],
    keyTakeaways: [
      `Read first for structure and argument, not for every detail.`,
      `Identify the question type and answer accordingly: proof, necessity, or scope.`,
      `Keep inferences small and close to the text; distrust extreme wording.`,
      `Return to the passage for evidence rather than relying on memory.`,
      `Vocabulary-in-context often means a secondary sense; test by substitution.`,
    ],
  },

  verb_critical_reasoning: {
    topicId: 'verb_critical_reasoning',
    title: `Critical Reasoning`,
    domainWeight: 'Verbal Reasoning',
    overview: `Critical Reasoning questions present a short argument and ask you to analyze its logic: strengthen it, weaken it, identify an assumption, or find a flaw. The core skill is separating premises from the conclusion and pinpointing the unstated assumption that bridges them. These skills also power the Analyze an Argument essay.`,
    sections: [
      {
        id: 'cr-1-argument-anatomy',
        title: `1. Anatomy of an Argument`,
        content: `## Premises and conclusion

An argument has premises (stated evidence) and a conclusion (the claim the evidence is meant to support). Your first job is to identify which is which.

## Conclusion signals

Words like "therefore," "thus," "hence," "so," and "consequently" often introduce the conclusion. Premise signals include "because," "since," and "given that."

## Worked example

"Sales rose 20 percent after we launched the ad campaign. Therefore, the campaign caused the increase." The premise is the 20 percent rise; the conclusion is that the campaign caused it. Notice the leap from correlation to causation.

## Isolate the core

Strip away background and restate the argument as "Evidence, therefore conclusion." Once you can state the argument in one line, its weak points become visible. Most GRE arguments rest on a single questionable assumption.`,
        examTip: `Always find the conclusion first, then the premises. Every strengthen, weaken, and assumption question turns on the gap between them.`,
      },
      {
        id: 'cr-2-assumptions',
        title: `2. Identifying Assumptions`,
        content: `## The assumption bridges the gap

An assumption is an unstated premise the argument needs to be valid. It links the evidence to the conclusion. If the assumption is false, the argument falls apart.

## The negation test

To test whether a statement is a necessary assumption, negate it. If negating it destroys the argument, it is a required assumption. If the argument survives the negation, it is not necessary.

## Worked example

"The new fertilizer increased crop yields in the trial, so farmers should adopt it." A necessary assumption is that the trial conditions resemble typical farms. Negate it: if the trial conditions were nothing like real farms, the recommendation collapses, confirming the assumption is required.

## Common hidden assumptions

- No alternative cause explains the result.
- The sample represents the whole population.
- Conditions will stay the same over time.
- A correlation reflects causation.`,
        importantNote: `Use the negation test to distinguish necessary assumptions from merely helpful statements. If negating a choice does not damage the argument, that choice is not the assumption the argument depends on.`,
      },
      {
        id: 'cr-3-strengthen-weaken',
        title: `3. Strengthening and Weakening`,
        content: `## Strengthen

A strengthener adds support, often by confirming an assumption or ruling out an alternative explanation. It does not have to prove the conclusion, only make it more likely.

## Weaken

A weakener attacks the logic, usually by offering an alternative cause, a counterexample, or evidence that the sample was unrepresentative. It does not need to disprove the conclusion, only cast doubt.

## Worked example

Argument: "City A introduced a curfew and crime fell, so the curfew reduced crime." A weakener: "Crime also fell in neighboring cities with no curfew," which suggests an outside cause. A strengthener: "Neighboring cities without curfews saw no change in crime," which rules out that alternative.

## Focus on the conclusion

Both strengtheners and weakeners target the specific conclusion, not a side detail. A choice that discusses an unrelated point, however true, is irrelevant to the argument's validity.`,
        examTip: `The best weakener usually introduces an alternative cause for the observed result. Ask "what else could explain this?" and look for the choice that supplies it.`,
      },
      {
        id: 'cr-4-flaws-evaluate',
        title: `4. Flaws and Evaluating Arguments`,
        content: `## Common logical flaws

- Correlation mistaken for causation: two events occur together, so one is assumed to cause the other.
- Unrepresentative sample: a small or biased group is generalized to everyone.
- Ambiguous terms: a word shifts meaning between premise and conclusion.
- False dichotomy: only two options are presented when others exist.

## Worked example

"Students who study late at night get lower grades, so studying late causes poor grades." This confuses correlation with causation; perhaps struggling students study late because they are already behind. Naming the flaw exposes the argument's weakness.

## Evaluate questions

Some questions ask what information would most help evaluate the argument. The answer is a question whose two possible answers would push the argument in opposite directions, such as "Did the two groups differ in any other relevant way?"

## Practice for the essay

Analyze an Argument in the Writing section rewards exactly these skills: naming assumptions, alternative explanations, and flaws. Treat Critical Reasoning practice as direct essay preparation.`,
        importantNote: `Correlation-to-causation is the most common GRE argument flaw. When an argument concludes that one thing caused another because they occurred together, an alternative explanation is usually the key.`,
      },
    ],
    keyTakeaways: [
      `Separate premises from the conclusion before analyzing any argument.`,
      `An assumption bridges evidence to conclusion; test necessity by negation.`,
      `Strengthen by confirming assumptions; weaken by offering alternative causes.`,
      `Correlation-versus-causation is the most common flaw to spot.`,
      `Evaluate questions seek information whose answer would swing the argument either way.`,
      `These skills transfer directly to the Analyze an Argument essay.`,
    ],
  },

  verb_vocabulary: {
    topicId: 'verb_vocabulary',
    title: `High-Frequency Vocabulary`,
    domainWeight: 'Verbal Reasoning',
    overview: `Strong vocabulary underpins Text Completion and Sentence Equivalence. Rather than memorizing endless word lists, focus on high-frequency GRE words, learn Greek and Latin roots that unlock families of words, and study words in context. This section builds an efficient, durable system for growing your vocabulary.`,
    sections: [
      {
        id: 'vocab-1-roots-affixes',
        title: `1. Roots, Prefixes, and Suffixes`,
        content: `## Why roots matter

Thousands of English words share Greek and Latin roots. Learning a root unlocks a whole family, letting you decode unfamiliar words on test day.

## High-yield roots

| Root/Affix | Meaning | Example |
| --- | --- | --- |
| bene | good | benevolent, benefactor |
| mal | bad | malevolent, malign |
| loqu / loc | speak | eloquent, loquacious |
| voc / vok | call | equivocate, evoke |
| ambi / amphi | both | ambivalent, ambiguous |

## Prefixes flip meaning

Prefixes like "a-/an-" (without), "in-/im-" (not), and "circum-" (around) change a root's sense. "Amoral" means without morals; "circumspect" means looking around, hence cautious.

## Worked example

Faced with "loquacious," recognize "loqu" (speak) plus the suffix "-acious" (tending toward). The word means tending to talk a lot, that is, talkative. Even without prior exposure, roots reveal the meaning and often the tone.`,
        examTip: `When a word is unfamiliar, break it into roots and affixes. Even partial decoding usually reveals whether the tone is positive or negative, which is often enough to answer.`,
      },
      {
        id: 'vocab-2-connotation',
        title: `2. Connotation and Tone`,
        content: `## Beyond the dictionary

Two words with similar definitions can carry opposite feelings. "Confident" is positive; "arrogant" is negative, yet both describe self-assurance. GRE questions frequently hinge on this difference.

## Positive, negative, or neutral

For each new word, tag it as positive, negative, or neutral. When you cannot recall an exact meaning, this tag alone often lets you match the sentence's tone.

## Worked example

"Frugal," "thrifty," and "economical" are positive words for careful spending, while "miserly," "stingy," and "penurious" are negative words for the same behavior. In a sentence praising someone's money management, only the positive set fits.

## Groups of near-synonyms

Study words in tone-tagged clusters. A cluster for "talkative" includes garrulous, loquacious, and voluble; a cluster for "stubborn" includes obstinate, intransigent, and recalcitrant. Learning clusters strengthens Sentence Equivalence, where you must find matched pairs.`,
        importantNote: `Tag every vocabulary word as positive, negative, or neutral. On Sentence Equivalence especially, tone often decides between two otherwise similar choices.`,
      },
      {
        id: 'vocab-3-context-learning',
        title: `3. Learning Words in Context`,
        content: `## Context beats rote memorization

Words learned inside sentences stick far better than isolated flashcards. Reading challenging material such as quality journalism and academic essays exposes you to GRE-level vocabulary naturally.

## Make your own example sentences

For each new word, write a short sentence that captures its meaning and tone. Producing the word actively cements it more than passive review.

## Worked example

To learn "ephemeral" (short-lived), write: "The fashion trend proved ephemeral, popular for a season and forgotten by winter." The sentence encodes both the definition and a vivid image, aiding recall.

## Spaced repetition

Review words at increasing intervals: one day, three days, a week, two weeks. Spaced repetition moves words into long-term memory far more efficiently than cramming, which fades within days.`,
        examTip: `Learn and review words in sentences, not as bare definitions. Context and self-authored examples produce recall that survives the pressure of test day.`,
      },
      {
        id: 'vocab-4-strategic-list',
        title: `4. Building a Strategic Word List`,
        content: `## Prioritize high-frequency words

Focus your energy on words that appear often on the GRE rather than obscure vocabulary. High-frequency lists concentrate the words most likely to earn points.

## Track the words you miss

Keep a personal list of words you got wrong in practice. These are your true weak spots and deserve the most review, more than a generic list you already half know.

## Handle unfamiliar words on test day

If a word is entirely new, use every clue: roots, tone from context, and elimination. Cross out choices whose tone clearly clashes with the sentence, then choose among the rest.

## Worked example

Suppose you meet "perfunctory" for the first time in "The clerk gave the documents only a perfunctory glance before stamping them." The context (a quick glance before stamping) suggests careless and superficial, which is the correct meaning. Even a wholly new word yields to careful reading of its context.`,
        importantNote: `Your missed-word list is your most valuable study tool. Reviewing the specific words you got wrong closes gaps faster than working through a generic list front to back.`,
      },
    ],
    keyTakeaways: [
      `Learn Greek and Latin roots to decode whole families of words.`,
      `Tag each word as positive, negative, or neutral; tone often decides the answer.`,
      `Study words in context and write your own example sentences.`,
      `Use spaced repetition to move words into long-term memory.`,
      `Prioritize high-frequency words and maintain a personal missed-word list.`,
    ],
  },

  verb_passage_types: {
    topicId: 'verb_passage_types',
    title: `Passage Types & Strategies`,
    domainWeight: 'Verbal Reasoning',
    overview: `GRE Reading Comprehension draws passages from the physical and biological sciences, social sciences, humanities, and business, plus special formats like argument passages and paired viewpoints. Each type has predictable structures and question patterns. Recognizing the type early lets you read with the right expectations and manage your time.`,
    sections: [
      {
        id: 'pt-1-science',
        title: `1. Science Passages`,
        content: `## What to expect

Science passages describe experiments, theories, or natural phenomena. They are often dense with detail but logically organized, moving from a question or problem to evidence and a conclusion.

## Read for the logical thread

Do not try to master every technical term. Focus on the main claim, the evidence for it, and any competing hypothesis. You can look up specific details when a question requires them.

## Worked example

A biology passage might describe a hypothesis about why a species migrates, present two studies, and note an unresolved tension. Track the hypothesis and how each study supports or complicates it, rather than memorizing species names.

## Handle unfamiliar terms

When you hit a term like a specific enzyme or particle, treat it as a labeled placeholder. The passage will tell you what role it plays; you rarely need outside knowledge. GRE science passages are self-contained.`,
        examTip: `In science passages, do not get bogged down in jargon. Label technical terms as placeholders and follow the argument's logic; the questions test reasoning, not prior science knowledge.`,
      },
      {
        id: 'pt-2-humanities-social',
        title: `2. Humanities and Social Science Passages`,
        content: `## Humanities passages

These discuss literature, art, history, or philosophy and often center on the author's interpretation or critique. The author's opinion is usually more prominent than in science passages, so track their stance closely.

## Social science passages

These cover economics, psychology, sociology, and political science, frequently presenting competing theories or interpretations of data. Watch for how the author positions one view against another.

## Worked example

A humanities passage might argue that a poet's later work marked a break from tradition, cite critics who disagree, and then defend the author's own reading. Note where the author agrees with or rebuts each critic.

## Attitude and tone questions

These passages often ask about the author's attitude toward a subject: approving, skeptical, ambivalent, or critical. Anchor your answer in evaluative words the author used, and prefer moderate descriptions over extreme ones.`,
        importantNote: `In humanities and social science passages, the author usually takes a position. Identify that stance early, because attitude and purpose questions depend on it.`,
      },
      {
        id: 'pt-3-argument-passages',
        title: `3. Argument and Logic-Based Passages`,
        content: `## Short argument passages

Some Reading Comprehension items are single-paragraph arguments followed by one logic question, closely resembling Critical Reasoning. Treat them the same way: find the conclusion and the assumption.

## Question types

These passages ask you to strengthen, weaken, identify an assumption, or find the answer that most logically completes the argument. The focus is reasoning, not recalling detail.

## Worked example

A short passage claims a city's new bike lanes reduced traffic accidents, then asks which statement would most weaken the conclusion. The best weakener offers an alternative cause, such as a simultaneous drop in overall traffic that better explains fewer accidents.

## Select-in-passage questions

Occasionally a question asks you to click the sentence in the passage that performs a specific role, such as stating the main conclusion or providing evidence. Reread each candidate sentence and match its function precisely to what the question asks.`,
        examTip: `Treat single-paragraph argument passages like Critical Reasoning: isolate the conclusion, spot the assumption, and answer with logic. Detail memory is not what these test.`,
      },
      {
        id: 'pt-4-strategy-timing',
        title: `4. Overall Strategy and Timing`,
        content: `## Read once, read well

For multi-question passages, invest in one careful read that builds a solid map, then answer all questions from it. Rereading the entire passage for each question wastes time.

## Return for evidence

Detail and vocabulary-in-context questions require you to revisit the specific lines they reference. Answer from the text, not from memory, to avoid distortion traps.

## Prioritize by length and difficulty

Long passages carry several questions, so their reading time pays off across multiple points. If you are short on time, a long passage's questions may offer more return than a lone short passage.

## Worked example

Given a four-paragraph passage with three questions and a one-paragraph passage with a single question, reading the long passage carefully yields three chances to score from one investment of reading time, making it a high-value target when triaging.

## Manage the section clock

The Verbal section is timed, so set a rough pace and do not let one hard question consume minutes. Mark it, move on, and return if time allows.`,
        importantNote: `Read a multi-question passage once thoroughly, then answer every question from that single strong understanding, returning to the text only for evidence a specific question demands.`,
      },
    ],
    keyTakeaways: [
      `Identify the passage type early to read with the right expectations.`,
      `In science passages, follow the logic and treat jargon as placeholders.`,
      `In humanities and social science passages, pin down the author's stance.`,
      `Treat short argument passages like Critical Reasoning problems.`,
      `Read multi-question passages once well, then return to the text for evidence.`,
      `Pace yourself and mark hard questions rather than stalling.`,
    ],
  },

  aw_issue: {
    topicId: 'aw_issue',
    title: `Analyze an Issue`,
    domainWeight: 'Analytical Writing',
    overview: `The Analyze an Issue task gives you a claim and asks you to develop your own position on it, following specific instructions. Over 30 minutes you must take a clear stance, support it with relevant reasons and examples, and consider complexity. Graders reward focused, well-organized reasoning far more than length or vocabulary.`,
    sections: [
      {
        id: 'issue-1-prompt-instructions',
        title: `1. Understanding the Prompt and Instructions`,
        content: `## The claim plus a task instruction

An Issue prompt states a general claim, then adds a specific instruction that shapes your essay. Common instructions ask you to discuss the extent to which you agree or disagree, to address the most compelling counterarguments, or to consider circumstances in which the claim does or does not hold.

## Read the instruction carefully

The instruction is not optional flavor; it defines what a strong response must do. If it says "discuss circumstances in which adopting the policy would be advantageous and disadvantageous," an essay that only argues one side will lose points for ignoring the task.

## Worked example

For the claim "Governments should prioritize funding for the sciences over the arts," an instruction might ask you to address the most compelling reasons someone could hold the opposite view. Your essay must therefore engage the arts-funding side seriously, not dismiss it.

## Restate the task in your own words

Before writing, paraphrase both the claim and the instruction on scratch paper. This ensures your essay actually answers the specific question rather than a general version of the topic.`,
        examTip: `The specific instruction line, not just the claim, determines what graders expect. Read it twice and let it structure your essay directly.`,
      },
      {
        id: 'issue-2-position',
        title: `2. Developing a Clear Position`,
        content: `## Take a definite stance

A strong Issue essay commits to a clear position and states it in the introduction. Graders reward a focused thesis; a wishy-washy "there are good points on both sides" without a stance reads as indecisive.

## Nuanced does not mean vague

You can qualify your position ("I largely agree, except in cases where...") while still being clear. A qualified thesis often shows more sophistication than an absolute one, as long as your overall stance is unmistakable.

## Worked example

Thesis for a technology-and-education claim: "While technology enhances access to education, it cannot replace the mentorship and accountability of a human teacher; therefore, schools should integrate technology as a supplement, not a substitute." This states a clear, qualified position the essay can defend.

## Avoid straddling

Do not spend the essay listing pros and cons without deciding. Even when the instruction asks you to weigh both sides, conclude with where you land. A clear verdict frames all your evidence.`,
        importantNote: `A clear thesis is the backbone of a high-scoring Issue essay. State your position in the introduction and make every body paragraph serve it.`,
      },
      {
        id: 'issue-3-support-examples',
        title: `3. Supporting Your Position with Examples`,
        content: `## Reasons and examples

Each body paragraph should give a reason for your position and support it with a specific example. General examples from history, current events, science, literature, or personal experience all work if they are concrete and clearly connected.

## Specific beats generic

"Many countries have benefited from investing in education" is weak. "Post-war investment in universal education helped drive rapid economic growth in several East Asian economies during the late twentieth century" is stronger because it is specific and analyzable, even without exact statistics.

## Explain the connection

Do not just drop an example; explain how it supports your reason. State the example, then spell out the logical link back to your thesis. The explanation, not the example alone, earns the points.

## Worked example

To support "technology should supplement teachers," describe how online lectures let a student review material at their own pace, then explain that the technology enabled self-paced learning while the teacher still provided feedback and motivation, showing supplement rather than replacement.`,
        examTip: `Invented but plausible examples are acceptable; graders do not fact-check. What matters is that the example is specific, relevant, and clearly tied to your reasoning.`,
      },
      {
        id: 'issue-4-complexity-counter',
        title: `4. Addressing Complexity and Counterarguments`,
        content: `## Acknowledge the other side

Top-scoring essays consider objections to their own position and respond to them. This demonstrates the critical thinking graders reward and strengthens your argument by preempting doubts.

## Concede then rebut

Grant a legitimate point to the opposing view, then explain why your position still holds. "Critics rightly note that technology can distract students; however, this risk argues for better-designed tools and teacher oversight, not for abandoning technology altogether."

## Explore conditions

Many instructions invite you to explore when the claim holds and when it does not. Identifying the boundary conditions shows nuance: perhaps a policy works well in wealthy districts but fails where infrastructure is lacking.

## Worked example

For a claim that competition always improves performance, concede that competition can motivate, then show a condition where it backfires, such as environments where cooperation produces better collective results, demonstrating the claim is true only under certain conditions.`,
        importantNote: `Engaging counterarguments and conditions raises your score. Concede a real point to the other side, then rebut it, showing you have considered the issue's full complexity.`,
      },
    ],
    keyTakeaways: [
      `The specific instruction, not just the claim, defines the task.`,
      `Commit to a clear, possibly qualified, thesis in the introduction.`,
      `Support each reason with a specific, well-explained example.`,
      `Invented examples are fine if concrete, relevant, and clearly connected.`,
      `Address counterarguments and boundary conditions to show complexity.`,
    ],
  },

  aw_argument: {
    topicId: 'aw_argument',
    title: `Analyze an Argument`,
    domainWeight: 'Analytical Writing',
    overview: `The Analyze an Argument task presents someone else's argument and asks you to critique its reasoning, not to give your own opinion on the topic. Your job is to identify unstated assumptions, logical flaws, and what evidence would strengthen or weaken the argument. This directly applies Critical Reasoning skills in essay form.`,
    sections: [
      {
        id: 'arg-1-critique-not-agree',
        title: `1. Critique the Reasoning, Not the Topic`,
        content: `## The central misunderstanding to avoid

The most common mistake on this task is arguing whether the conclusion is true. That is not the assignment. Your job is to evaluate how well the argument is reasoned, regardless of whether you happen to agree with it.

## Stay neutral on the conclusion

Do not offer your own view on the subject. Instead, expose the gaps between the evidence and the conclusion. A perfect essay could critique an argument whose conclusion you personally believe.

## Worked example

If the argument claims a store should extend its hours because a competitor did so and saw higher sales, do not argue about whether long hours are good. Instead, point out the argument assumes the two stores are comparable and that the competitor's higher sales came from the hours rather than some other factor.

## Follow the instruction

Argument prompts include an instruction, such as "identify the assumptions and explain how the argument depends on them" or "describe the evidence needed to evaluate the argument." Tailor your critique to that specific instruction.`,
        examTip: `Never argue whether the conclusion is right. The grader rewards analysis of the reasoning's flaws, and a well-reasoned essay could even critique an argument you agree with.`,
      },
      {
        id: 'arg-2-assumptions',
        title: `2. Identifying Unstated Assumptions`,
        content: `## Find the gaps

Every flawed argument rests on assumptions that connect evidence to conclusion. Your essay should surface these and show why each is questionable.

## Recurring assumption types

- Representativeness: assumes a sample or survey reflects the whole population.
- Comparability: assumes two situations are alike enough to transfer conclusions.
- No alternative cause: assumes the stated cause, not another, produced the result.
- Stability: assumes past conditions will persist into the future.

## Worked example

An argument states that because a diet worked for a small volunteer group, the whole company should adopt it. Assumptions include that the volunteers represent all employees and that no other factor (such as the volunteers already being health-conscious) caused the results. Each assumption, if false, undermines the recommendation.

## Explain the consequence

For each assumption, state it clearly and then explain what happens to the argument if the assumption is wrong. This "if the assumption fails, then the argument collapses" structure is what earns credit.`,
        importantNote: `For every assumption you name, explain how the argument depends on it. Merely listing assumptions is weak; showing that the conclusion crumbles if each fails is what graders reward.`,
      },
      {
        id: 'arg-3-flaws-alternatives',
        title: `3. Logical Flaws and Alternative Explanations`,
        content: `## Common flaws to attack

- Correlation treated as causation.
- Small or biased samples generalized too broadly.
- Vague or shifting terms that mean different things in different sentences.
- Surveys with leading questions or low response rates.
- Statistics missing context, such as percentages without base numbers.

## Offer alternative explanations

A powerful move is to propose a plausible alternative cause for the argument's evidence. If profits rose after a new manager arrived, perhaps a broader economic recovery, not the manager, drove the gain.

## Worked example

An argument concludes that a town's new streetlights reduced crime because crime fell after installation. Point out the correlation-causation flaw and offer alternatives: crime may have fallen everywhere that year, or increased police patrols may have coincided with the lights. These alternatives show the evidence does not prove the conclusion.

## Question the evidence itself

Beyond the logic, scrutinize the data. Ask whether a survey was representative, whether a statistic is defined clearly, and whether the sample size supports a sweeping claim.`,
        examTip: `Proposing a specific alternative explanation for the evidence is one of the strongest critique moves. It directly shows the argument's cause-and-effect leap is unjustified.`,
      },
      {
        id: 'arg-4-evidence-organization',
        title: `4. Needed Evidence and Organization`,
        content: `## Describe what would help

Many prompts ask what evidence would strengthen or weaken the argument, or what questions must be answered to evaluate it. For each flaw, state the specific information that would resolve it.

## Worked example

For the streetlight argument, needed evidence includes crime data from comparable towns without new lights, crime trends before installation, and whether other changes occurred at the same time. Explaining that this evidence is required, and how each piece would confirm or undermine the conclusion, demonstrates rigorous analysis.

## Organize by flaw

A clean structure devotes each body paragraph to one assumption or flaw: state it, explain why it weakens the argument, and describe evidence that would test it. This one-flaw-per-paragraph approach keeps the essay focused and easy to follow.

## Keep your own opinion out

End by summarizing that the argument, as written, is unconvincing until its assumptions are verified, without asserting whether the conclusion is ultimately true. The essay judges the reasoning, and your conclusion should reflect that scope.`,
        importantNote: `Structure the essay one flaw per paragraph: name the assumption, show why it weakens the argument, and specify the evidence that would test it. This mirrors exactly what the grading rubric rewards.`,
      },
    ],
    keyTakeaways: [
      `Critique the reasoning, never argue whether the conclusion is true.`,
      `Surface unstated assumptions and show the argument depends on each.`,
      `Attack flaws like correlation-causation and unrepresentative samples.`,
      `Propose specific alternative explanations for the evidence.`,
      `Describe the evidence that would strengthen, weaken, or evaluate the argument.`,
      `Organize one assumption or flaw per body paragraph.`,
    ],
  },

  aw_structure: {
    topicId: 'aw_structure',
    title: `Essay Structure & Templates`,
    domainWeight: 'Analytical Writing',
    overview: `A clear, predictable structure frees your attention for content and helps graders follow your reasoning. This section provides reusable templates for the introduction, body, and conclusion of both Analytical Writing tasks, along with transition language and time-management guidance for the 30-minute clock.`,
    sections: [
      {
        id: 'struct-1-intro',
        title: `1. The Introduction`,
        content: `## Three jobs of an introduction

A strong introduction (1) shows you understand the prompt, (2) states your thesis or, for the Argument task, your overall assessment of the reasoning, and (3) previews your main points. Keep it to two to four sentences; graders want to reach your argument quickly.

## Issue introduction template

Acknowledge the issue, state your position, and preview reasons. For example: "Although [claim] has intuitive appeal, [position] because [reason one] and [reason two]. This essay will argue that [restated position]."

## Argument introduction template

Summarize the argument's conclusion and evidence, then assert that the reasoning is flawed: "The author concludes that [conclusion] based on [evidence]. However, this argument relies on several unwarranted assumptions that, if unfounded, seriously undermine its conclusion."

## Worked example

For an Argument prompt about a company boosting sales by cutting prices, an opener might read: "The author argues that the company should cut prices further because a past price cut raised sales. This reasoning rests on questionable assumptions about causation and market conditions." This immediately frames the critique.`,
        examTip: `Do not spend more than four sentences on the introduction. Graders reward a quick, clear thesis and want to see your reasoning develop in the body paragraphs.`,
      },
      {
        id: 'struct-2-body',
        title: `2. Body Paragraphs`,
        content: `## One idea per paragraph

Each body paragraph should develop a single reason (Issue) or a single assumption or flaw (Argument). This keeps your essay organized and easy to grade.

## The PEEL structure

A reliable paragraph pattern:
- Point: state the reason or flaw.
- Evidence/Example: give a specific supporting example (Issue) or identify the assumption and its role (Argument).
- Explanation: connect the evidence back to your thesis.
- Link: transition to the next paragraph.

## Worked example (Issue)

"First, technology broadens access to education (Point). Online courses let students in remote areas attend lectures from top universities (Example). This access directly serves the claim that technology improves learning by removing geographic barriers (Explanation). Yet access alone is not sufficient, which leads to the question of quality (Link)."

## Aim for two to four body paragraphs

Two well-developed body paragraphs beat four thin ones. Depth of analysis matters more than the number of points. Fully explain each idea before moving on.`,
        importantNote: `Develop each point fully with the PEEL pattern. A high score comes from depth, explaining why your evidence matters, not from stacking many shallow points.`,
      },
      {
        id: 'struct-3-conclusion-transitions',
        title: `3. Conclusions and Transitions`,
        content: `## The conclusion's role

A conclusion restates your thesis in fresh words and, ideally, adds a final thought: a broader implication (Issue) or a summary of what evidence would settle the argument (Argument). Two to three sentences suffice.

## Issue conclusion template

"In sum, while [opposing consideration] has merit, [restated position] because [brief recap of reasons]. Ultimately, [broader implication]."

## Argument conclusion template

"In conclusion, the argument is unpersuasive as written. Without evidence addressing [key assumptions], the conclusion that [conclusion] remains unsupported."

## Transition language

Use transitions to guide the reader:
- Adding: moreover, furthermore, in addition.
- Contrasting: however, nevertheless, on the other hand.
- Concluding: therefore, in sum, ultimately.

## Worked example

An Argument conclusion might read: "Until the author provides data from comparable companies and rules out other causes of the sales increase, the recommendation to cut prices further rests on unproven assumptions and cannot be accepted." This closes the critique without introducing new claims.`,
        examTip: `Never introduce a brand-new argument in the conclusion. Restate your thesis in different words and, if space allows, add one broader implication or a final note on needed evidence.`,
      },
      {
        id: 'struct-4-time-management',
        title: `4. Time Management and Templates`,
        content: `## Budget your 30 minutes

A workable split:
- 3 to 5 minutes: read the prompt carefully and outline.
- 20 to 22 minutes: write the essay.
- 3 to 5 minutes: proofread for clarity and errors.

## Outline before writing

Jot your thesis and one phrase per body paragraph before you type. A brief outline prevents you from wandering and ensures each paragraph has a clear purpose. Two minutes of planning saves far more time later.

## Reusable templates are legitimate

Preparing sentence frames in advance is smart, as long as you fill them with content specific to the prompt. Memorized transitions and paragraph structures let you focus your thinking on the actual argument.

## Worked example

A pre-built body-paragraph frame: "A further assumption underlying the argument is that ______. If this assumption is unfounded, because ______, then the conclusion that ______ collapses." On test day you drop the prompt's specifics into the blanks, saving time while ensuring a rigorous structure.`,
        importantNote: `Prepared templates are only useful when filled with prompt-specific content. Graders quickly spot generic essays, so use your frames to organize genuine, tailored analysis.`,
      },
    ],
    keyTakeaways: [
      `Keep the introduction short: understanding, thesis, and preview in a few sentences.`,
      `Use one idea per body paragraph with the PEEL pattern.`,
      `Favor two to four deeply developed paragraphs over many shallow ones.`,
      `Restate the thesis in the conclusion; never add a new argument there.`,
      `Budget time for outlining and proofreading, not just writing.`,
      `Templates help only when filled with prompt-specific content.`,
    ],
  },

  aw_scoring: {
    topicId: 'aw_scoring',
    title: `Scoring Rubric & Sample Essays`,
    domainWeight: 'Analytical Writing',
    overview: `The Analytical Writing measure is scored from 0 to 6 in half-point increments by a combination of a trained human reader and an automated scoring engine. Understanding what distinguishes a 6 from a 4 lets you target the qualities graders reward: clear reasoning, strong support, logical organization, and controlled language.`,
    sections: [
      {
        id: 'score-1-rubric',
        title: `1. How the Rubric Works`,
        content: `## The scale and process

Each essay receives a score from 0 to 6 in half-point steps. It is read by one trained human rater and an automated engine; if they disagree substantially, a second human adjudicates. On the current single-essay Analytical Writing section, that score is reported directly.

## What graders reward

The rubric emphasizes:
- Quality and clarity of critical thinking.
- Relevance and development of support.
- Logical organization and coherence.
- Control of standard written English.

## Score band overview

| Score | Description |
| --- | --- |
| 6 | Outstanding: insightful, well-developed, fluent |
| 5 | Strong: clear analysis, well-supported, few errors |
| 4 | Adequate: competent but less developed |
| 3 | Limited: unclear or poorly supported reasoning |
| 2 or below | Seriously flawed or off-topic |

## Holistic scoring

Graders judge the essay as a whole, not by counting errors. A few minor grammar slips will not sink a strong argument, and flawless grammar cannot rescue weak reasoning.`,
        examTip: `Graders read holistically and quickly. Clear organization and a strong thesis create a favorable first impression that carries through the whole essay.`,
      },
      {
        id: 'score-2-six-vs-four',
        title: `2. What Separates a 6 from a 4`,
        content: `## Depth of analysis

A 4 essay identifies relevant points but develops them thinly. A 6 essay digs deeper: it explains why each reason matters, anticipates objections, and explores nuance. The difference is depth and insight, not length alone.

## Support quality

A 4 uses general or loosely connected examples. A 6 uses specific, well-chosen examples and clearly explains how each supports the thesis. The explanation, not just the example, elevates the score.

## Worked example contrast

On an Argument task, a 4 might note "the argument assumes the two stores are similar." A 6 would add "the argument assumes the two stores serve comparable customer bases and markets; if the competitor operates in a wealthier area, its sales gains from longer hours would not transfer, and the recommendation would be unfounded." The 6 explains the assumption's consequence in detail.

## Coherence

A 6 essay flows logically with clear transitions, each paragraph building on the last. A 4 may feel like a list of disconnected points. Strong connective reasoning signals mature analysis.`,
        importantNote: `The leap from 4 to 6 is depth and explanation, not vocabulary or length. Fully developing two insightful points beats mentioning five points superficially.`,
      },
      {
        id: 'score-3-sample-analysis',
        title: `3. Analyzing Sample Responses`,
        content: `## Studying a strong Issue paragraph

Consider this body paragraph for a claim that public funding should favor practical over theoretical research: "While practical research yields visible short-term benefits, history shows that theoretical work often enables the greatest breakthroughs. For instance, abstract mathematical research into number theory, long considered useless, later became the foundation of modern encryption that secures global commerce. Defunding theoretical work risks eliminating tomorrow's transformative technologies for the sake of today's incremental gains." This paragraph states a reason, gives a specific developed example, and explains the stakes, hallmarks of a high score.

## Studying a weaker paragraph

Compare: "Theoretical research is also important and has helped society in many ways over the years." This is vague, unsupported, and undeveloped, the kind of thin claim that caps an essay at a 4.

## The takeaway

Strong sample essays consistently pair specific evidence with explicit reasoning. As you review models, mark where each paragraph names its point, supplies concrete support, and explains the connection.`,
        examTip: `When you study sample essays, do not just read the top scorers; compare them to mid-range ones. The contrast reveals exactly which sentences add depth versus which merely fill space.`,
      },
      {
        id: 'score-4-final-tips',
        title: `4. Final Tips and Common Pitfalls`,
        content: `## Pitfalls that lower scores

- Restating the prompt without adding analysis.
- Listing many points without developing any.
- On the Argument task, giving your own opinion instead of critiquing the reasoning.
- Ignoring the specific instruction in the prompt.
- Weak organization with no clear thesis.

## Habits that raise scores

- State a clear thesis or assessment up front.
- Develop each point fully with specific support.
- Use varied sentence structure and precise, controlled language.
- Address counterarguments (Issue) or explain each assumption's consequence (Argument).
- Leave two to three minutes to proofread.

## Language matters, in moderation

Graders reward controlled, precise language, not showy vocabulary. A clear sentence beats a convoluted one stuffed with big words. Fix major errors in proofreading, but do not obsess over a single typo.

## Worked example of a strong close

"Ultimately, the strength of any research policy lies not in choosing practical over theoretical work, but in recognizing that today's abstractions frequently become tomorrow's necessities." This sentence restates the thesis with a memorable, forward-looking insight, the kind of finish that leaves a strong final impression.`,
        importantNote: `The two biggest score killers are undeveloped points and, on the Argument task, arguing your own opinion instead of critiquing the reasoning. Avoid both to stay in the upper score bands.`,
      },
    ],
    keyTakeaways: [
      `Essays are scored 0 to 6 in half points by a human rater and an automated engine.`,
      `Graders reward critical thinking, developed support, organization, and language control.`,
      `The 4-to-6 gap is depth and explanation, not length or fancy words.`,
      `Strong essays pair specific evidence with explicit reasoning.`,
      `Avoid restating the prompt, listing undeveloped points, and (on Argument) giving opinions.`,
      `Leave time to proofread, but grading is holistic, so one typo will not sink you.`,
    ],
  },

};

export function getGRECourseContent(topicId: string): TopicLesson | null {
  return GRE_COURSE[topicId] ?? null;
}

export function hasGRECourseContent(topicId: string): boolean {
  return topicId in GRE_COURSE;
}
