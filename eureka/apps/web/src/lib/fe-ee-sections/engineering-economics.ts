// FE EE course content — Engineering Economics (3 topics).
// Split byte-identically from fe-ee-course-data.ts so section waves
// can be authored in parallel; spread back into FE_EE_COURSE there.
import type { TopicLesson } from '../fe-ee-course-data';

export const FE_EE_ENGINEERING_ECONOMICS: Record<string, TopicLesson> = {
fee_tvm: {
  topicId: 'fee_tvm',
  title: 'Time Value of Money & Financial Factors',
  domainWeight: 'Engineering Economics · 3–5%',
  overview: 'The time value of money principle — a dollar today is worth more than a dollar tomorrow — underlies all engineering economic analysis. Standard cash flow factors convert between present, future, and annuity values.',
  sections: [
    {
      id: 'tvm-factors',
      title: '1. Compound Interest and Standard Factors',
      content: `## 1.1 Compound Interest

**$F = P(1+i)^n$** — future value of present amount P at interest rate i for n periods

**$P = F/(1+i)^n$** — present value of future amount F

## 1.2 The Six Standard Cash Flow Factors

| Factor | Symbol | Formula | Converts |
|---|---|---|---|
| Future Worth | (F/P, i, n) | $(1+i)^n$ | $P \\to F$ |
| Present Worth | (P/F, i, n) | $1/(1+i)^n$ | $F \\to P$ |
| Annuity to Future | (F/A, i, n) | $[(1+i)^n - 1]/i$ | $A \\to F$ |
| Annuity to Present | (P/A, i, n) | $[(1+i)^n - 1]/[i(1+i)^n]$ | $A \\to P$ |
| Capital Recovery | (A/P, i, n) | $i(1+i)^n/[(1+i)^n - 1]$ | $P \\to A$ |
| Sinking Fund | (A/F, i, n) | $i/[(1+i)^n - 1]$ | $F \\to A$ |

## 1.3 Effective Annual Rate

For nominal rate r compounded m times per year:

**$EAR = (1 + r/m)^m - 1$**

For continuous compounding: **$EAR = e^r - 1$** and **$F = P\\cdot e^{rt}$**`,
      examTip: 'The FE reference handbook includes factor tables. Know which factor to use: P/F for single future payment, P/A for uniform annual series, A/P for loan payments. The most common mistake is using the wrong factor — draw a cash flow diagram first to clarify.',
      importantNote: 'When comparing alternatives with different lifespans, use Annual Worth (AW) method or find the least common multiple of lifespans. Do NOT directly compare NPV of projects with different durations.',
    },
    {
      id: 'tvm-rates',
      title: '2. Nominal vs Effective Rates and Cash Flow Diagrams',
      content: `## 2.1 Nominal vs Effective Interest Rates

- **Nominal rate** r: stated annual rate (e.g., "12% compounded monthly")
- **Effective rate**: actual rate after compounding

Example: 12% compounded monthly → i_monthly = 1%/month → EAR = (1.01)^12 - 1 = 12.68%

### Continuous Compounding

When compounding frequency approaches infinity: **$F = P\\cdot e^{rt}$**

## 2.2 Cash Flow Diagrams

A cash flow diagram is essential for setting up economic problems:
- Horizontal axis represents time periods
- Upward arrows represent cash **inflows** (benefits)
- Downward arrows represent cash **outflows** (costs)
- Time 0 is "now" (present)

### Gradient Series

Sometimes cash flows increase by a constant amount G each period:
- **$P = G \\cdot (P/G, i, n)$** where (P/G, i, n) = [(1+i)^n - in - 1] / [i²(1+i)^n]

Or by a constant percentage g each period (geometric gradient):
- **$P = A_{1} \\cdot [(1 - (1+g)^n\\cdot (1+i)^{-n}) / (i - g)]$** when i ≠ g`,
      examTip: 'Always draw the cash flow diagram before selecting factors. Mark every payment with its correct time period. A common error is off-by-one timing — the first payment of an annuity occurs at the END of period 1, not at time 0.',
    },
    {
      id: 'tvm-factor-family',
      title: '3. The Six Factors Are One Family — Derive Them, Then Check Them',
      content: `## 3.1 Why the handbook tables are a trap for the unprepared

Engineering economics is the one exam section where the reference handbook
hands you the answers as tabulated numbers — and where candidates still lose
points, because they look up the wrong row. The cure is to know that all six
factors come from a single idea, so that when the table and your instinct
disagree you can settle it in fifteen seconds with the closed form.

The single idea is that money one period later is worth (1 + i) times money
now. Everything else is bookkeeping on that one multiplication.

- **Single amounts.** Apply the multiplier n times: (F/P, i, n) = (1+i)^n. Undo
  it and you have (P/F, i, n) = (1+i)^(-n). These two are reciprocals, always.
- **Uniform series.** Add n single amounts, each pushed forward a different
  number of periods. The sum is geometric, and the closed form is
  (F/A, i, n) = [(1+i)^n − 1]/i. Discount that back n periods and you get
  (P/A, i, n) = [(1+i)^n − 1]/[i(1+i)^n].
- **The other two are reciprocals of those.** (A/P, i, n) = 1/(P/A, i, n) is
  capital recovery, the loan-payment factor. (A/F, i, n) = 1/(F/A, i, n) is the
  sinking fund, the save-up factor.

## 3.2 The whole family at one rate, computed

At i = 10% and n = 5, evaluated from the closed forms above rather than read
off any page:

| Factor | NCEES notation | Closed form | Value at 10%, n = 5 |
|---|---|---|---|
| Future given present | (F/P, i, n) | (1+i)^n | 1.610510 |
| Present given future | (P/F, i, n) | (1+i)^(−n) | 0.620921 |
| Future given annual | (F/A, i, n) | [(1+i)^n − 1]/i | 6.105100 |
| Present given annual | (P/A, i, n) | [(1+i)^n − 1]/[i(1+i)^n] | 3.790787 |
| Annual given present | (A/P, i, n) | i(1+i)^n/[(1+i)^n − 1] | 0.263797 |
| Annual given future | (A/F, i, n) | i/[(1+i)^n − 1] | 0.163797 |

Three identities hold in that column, and each is a free error check on exam
day:

1. **(P/A)(A/P) = 1.** Here 3.790787 × 0.263797 = 1.000000. Any reciprocal pair
   must multiply to one.
2. **(A/P) − (A/F) = i.** Here 0.263797 − 0.163797 = 0.100000 exactly. A loan
   payment is the sinking-fund deposit plus the interest on the whole
   principal — which is what that subtraction says in words.
3. **(F/A)(P/F) = (P/A).** Here 6.105100 × 0.620921 = 3.790787. Pushing a
   series to the end and then discounting the lump back is the same as
   discounting the series directly.

If a looked-up value fails identity 1 or 2, you read the wrong row. Checking
takes one calculator entry and has saved more points than any mnemonic.

## 3.3 Worked problem: a five-year loan, payment and split

**Given**: 25,000 borrowed at 6% per year, repaid in five equal end-of-year
payments.

**Find**: the payment, the total interest, and how the third payment divides
between interest and principal.

**Step 1 — pick the factor from the diagram.** You have a present amount and
you want an annual amount: capital recovery, (A/P, 6%, 5).

**Step 2 — compute the factor.**
(A/P, 6%, 5) = 0.06(1.06)^5/[(1.06)^5 − 1] = 0.237396.

**Step 3 — apply it.** A = 25,000 × 0.237396 = **5,934.91 per year**. Over five
years that is 29,674.55 paid against 25,000 borrowed, so the total interest is
**4,674.55**.

**Step 4 — split any payment you like.** Interest each year is 6% of the
balance at the start of that year; principal is whatever the payment has left
over.

| Year | Interest at 6% of balance | Principal repaid | Balance after |
|---|---|---|---|
| 1 | 1,500.00 | 4,434.91 | 20,565.09 |
| 2 | 1,233.91 | 4,701.00 | 15,864.09 |
| 3 | 951.85 | 4,983.06 | 10,881.02 |
| 4 | 652.86 | 5,282.05 | 5,598.97 |
| 5 | 335.94 | 5,598.97 | 0.00 |

The third payment is 951.85 interest and 4,983.06 principal. Notice the closing
balance: it lands on zero to the cent, which is the strongest possible check
that the factor was right. Notice also that the interest column falls while the
principal column rises — every early payment is mostly rent on money, and that
is why prepaying a loan early saves so much more than prepaying it late.

![Cash-flow diagram of a 25,000 loan at 6% repaid in five equal end-of-year payments of 5,934.91, with every arrow drawn to scale and the interest portion of each payment shaded. The upward arrow at time zero is the money received; the five downward arrows are the payments, each computed from the capital-recovery factor rather than read from a table.](/courses/fe-ee/figures/econ-cashflow-anatomy.svg)

Draw this diagram before you touch the calculator on every economics question.
The picture answers the only question that matters for factor selection: which
side of the factor name is what you have, and which side is what you want. One
arrow at time zero and a row of equal arrows afterwards is a P and an A, so the
factor has P and A in its name; the direction of the conversion picks which of
the two you use. Problems that look intimidating in prose almost always
collapse into one of four diagrams — a single arrow, a level row of arrows, a
row that grows by a constant step, or a row that grows by a constant
percentage — and each diagram has exactly one factor waiting for it.

## 3.4 Two single-sum drills

- Deposit 5,000 at 7% for twelve years:
  F = 5,000(F/P, 7%, 12) = 5,000(1.07)^12 = 5,000 × 2.252192 = **11,260.96**.
- A payment of 40,000 falls due in ten years; at 8% its present worth is
  P = 40,000(P/F, 8%, 10) = 40,000 × 0.463193 = **18,527.74**.

Both are one multiplication once the diagram is drawn. If you find yourself
doing three, you have picked the wrong factor.`,
      examTip: 'Before you use a looked-up factor, spend one calculator entry checking (A/P) − (A/F) = i, or that a reciprocal pair multiplies to 1.000. Reading the wrong column of a factor table is the single most common way to lose an economics question that you fully understand.',
      importantNote: 'End-of-period convention: unless the problem says otherwise, an annual amount A occurs at the END of each period, and the first one occurs at the end of period 1. A payment made at time zero is not part of the series — handle it separately and add it in.',
    },
    {
      id: 'tvm-effective-rates',
      title: '4. Nominal, Effective, and the Period You Actually Have',
      content: `## 4.1 The rule that decides every interest-rate question

A factor's i and its n must belong to the **same period**. That is the whole
rule. Every nominal-versus-effective question on the exam is testing whether
you will convert the rate to match the period of the cash flows, or convert the
periods to match the rate.

A **nominal** annual rate r compounded m times a year is not a rate at all — it
is a shorthand for the periodic rate r/m. The **effective annual rate** is what
actually accrues over a year:

**$EAR = (1 + r/m)^{m} - 1$**

As m grows without bound the expression converges to the continuous form
**$EAR = e^{r} - 1$**, and F = P·e^(rt).

## 4.2 What compounding frequency is actually worth

For a nominal 12%, computed from the formula above:

| Compounding | m | Periodic rate | Effective annual rate |
|---|---|---|---|
| Annually | 1 | 12.0000% | 12.0000% |
| Semiannually | 2 | 6.0000% | 12.3600% |
| Quarterly | 4 | 3.0000% | 12.5509% |
| Monthly | 12 | 1.0000% | 12.6825% |
| Weekly | 52 | 0.230769% | 12.7341% |
| Daily | 365 | 0.032877% | 12.7475% |
| Continuously | — | — | 12.7497% |

![Effective annual rate against compounding frequency for a nominal 12%, with the continuous-compounding limit drawn as a dashed asymptote at 12.7497% and the nominal 12% as a dotted floor. Each plotted point is the formula evaluated at that m; the circled point is the monthly case at 12.6825%.](/courses/fe-ee/figures/econ-effective-rate.svg)

Two exam-relevant facts are visible at once. First, the gap between nominal and
effective opens fast and then stops: going from annual to monthly buys 0.68
percentage points, while going from monthly all the way to continuous buys only
0.067 more. Continuous compounding is mathematically tidy and practically
almost irrelevant, which is why a question that offers "compounded
continuously" as a distractor to "compounded monthly" is usually testing
whether you panic. Second, the curve touches the nominal rate only at m = 1 —
at every other frequency, quoting the nominal rate understates the cost.

## 4.3 Worked problem: matching the period two different ways

**Given**: 8,000 deposited at a nominal 9% compounded quarterly, held three
years.

**Method 1 — move to the quarterly period.** The quarterly rate is
0.09/4 = 2.25%, and three years is n = 12 quarters:

F = 8,000(1.0225)^12 = 8,000 × 1.306050 = **10,448.40**.

**Method 2 — move to the annual period.** EAR = (1.0225)^4 − 1 = 9.308332%,
and n = 3 years:

F = 8,000(1.09308332)^3 = **10,448.40**.

The same number, because they are the same computation written two ways. Use
whichever period the *cash flows* live in. That is the practical reason the
rule matters: if your payments are monthly, work monthly; if your payments are
annual but the bank compounds monthly, you must convert the rate to an EAR
first, because there is no series factor that mixes periods.

## 4.4 The mixed-period trap, worked

**Given**: 30,000 financed at a nominal 18% compounded monthly, repaid in four
equal ANNUAL payments.

The tempting move is (A/P, 18%, 4), or its slightly better-informed cousin
(A/P, 1.5%, 48). Both are wrong: the first ignores the monthly compounding, the
second produces a monthly payment when the problem asked for an annual one.

**Correct sequence.** Convert first: EAR = (1 + 0.18/12)^12 − 1 = 19.5618%.
Then apply the annual factor at that rate:
(A/P, 19.5618%, 4) = 0.383086, so A = 30,000 × 0.383086 = **11,492.57 per
year**.

## 4.5 What to do when the exam gives you a rate you cannot look up

A converted rate like 19.5618% will never appear in a printed factor table, and
it does not need to. Every factor in this section is a closed form that your
approved calculator evaluates directly. Practise entering
i(1+i)^n/[(1+i)^n − 1] as a single expression; it turns "the table does not have
my rate" from a dead end into a ten-second computation, and it is the same
skill you need for the rate-of-return problems in the next topic, where the
unknown IS the rate and no table can help you at all.`,
      examTip: 'Read the compounding phrase before anything else. "12% compounded monthly" means i = 1% per month, and the answer depends entirely on whether the cash flows are monthly (use 1% directly) or annual (convert to EAR = 12.6825% first).',
    },
    {
      id: 'tvm-gradients-inflation',
      title: '5. Gradients, Capitalized Cost, and Inflation',
      content: `## 5.1 Arithmetic gradients: a series that grows by a constant amount

Maintenance costs rarely stay level; they climb by roughly the same amount each
year. A series that is A₁ in year 1 and grows by G each year afterwards is
handled by splitting it into a uniform part and a gradient part:

- **$P = A_{1}(P/A, i, n) + G(P/G, i, n)$**
- **$(P/G, i, n) = [(1+i)^{n} - in - 1]/[i^{2}(1+i)^{n}]$**
- **$(A/G, i, n) = 1/i - n/[(1+i)^{n} - 1]$**

The gradient factors are linked to the others exactly as you would hope:
(P/G, i, n) = (A/G, i, n)(P/A, i, n). At 10% and n = 5, (A/G) = 1.810126 and
(P/A) = 3.790787, whose product is 6.861802 — the same (P/G) the closed form
gives.

**Worked problem.** Maintenance is 2,000 in year 1 and rises by 300 a year for
eight years; i = 8%. Find the present worth.

**Step 1 — split the series.** The uniform part is 2,000 every year; the
gradient part is 0, 300, 600, ... 2,100.

**Step 2 — compute both factors.** (P/A, 8%, 8) = 5.746639 and
(P/G, 8%, 8) = 17.806098.

**Step 3 — combine.**
P = 2,000(5.746639) + 300(17.806098) = 11,493.28 + 5,341.83 = **16,835.11**.

**Step 4 — check by brute force.** Discounting all eight actual amounts one at
a time gives 16,835.11 as well. The equivalent level annual cost is
A = 2,000 + 300(A/G, 8%, 8) = 2,000 + 300 × 3.098524 = **2,929.56**, and
2,929.56 × 5.746639 returns the same present worth.

The single most common gradient error is starting the gradient in year 1. It
does not: the gradient contributes **zero** in year 1, G in year 2, and (n−1)G
in year n. Write the series out for three years before you commit.

## 5.2 Geometric gradients: growth by a constant percentage

When a series grows by a fixed **percentage** g each year — wages, energy
prices, anything indexed to inflation — the closed form is

**$P = A_{1}\\cdot [1 - (1+g)^{n}(1+i)^{-n}]/(i - g)$** for i ≠ g

**Worked problem.** A₁ = 5,000, g = 4%, i = 9%, n = 10.
P = 5,000[1 − (1.04)^10(1.09)^(−10)]/(0.05) = **37,472.88**, which the
year-by-year discounted sum confirms to the cent.

The formula obviously fails when i = g, because the denominator vanishes. The
correct limit is P = nA₁/(1+i): with A₁ = 5,000, n = 10 and i = g = 9%,
P = 10 × 5,000/1.09 = **45,871.56**, again confirmed term by term. Exams like
this case precisely because the general formula breaks.

## 5.3 Capitalized cost: the series that never ends

A perpetual series is the limit of (P/A, i, n) as n grows without bound, and it
collapses to something you can do in your head:

**$P = A/i$**

Perpetual maintenance of 12,000 a year at 6% has a present worth of
12,000/0.06 = **200,000**. That is the capitalized cost: the endowment that
would fund the obligation forever.

**Worked problem — a public works capitalized cost.** A bridge costs 2,400,000
to build, 90,000 a year to maintain, and needs 400,000 of resurfacing every
eight years. At 5%, find the capitalized cost.

**Step 1 — turn the recurring lump into an annual amount.** A deposit that
accumulates to 400,000 every eight years is a sinking fund:
(A/F, 5%, 8) = 0.104722, so the equivalent annual cost is
400,000 × 0.104722 = **41,888.73**.

**Step 2 — capitalize the total annual cost and add the first cost.**
CC = 2,400,000 + (90,000 + 41,888.73)/0.05 = **5,037,774.51**.

The step candidates skip is the first one. Recurring renewals must be converted
to an annual equivalent with (A/F) *before* dividing by i, because A/i assumes
the amount arrives every single period.

## 5.4 Inflation: two rates, and which one goes with which dollars

Inflation forces you to keep two rate systems straight.

- **Real (constant-dollar) rate** i_r: growth in purchasing power.
- **Inflation rate** f.
- **Market (then-current, combined) rate** i: what a bank quotes.

They are related multiplicatively, never additively:

**$i = (1+i_{r})(1+f) - 1 = i_{r} + f + i_{r}f$**

With a 4% real rate and 3% inflation, i = (1.04)(1.03) − 1 = **7.12%**. Adding
the two gives 7.00% and understates the rate by 0.12 percentage points — small
here, and not small at the double-digit inflation rates these problems like to
use. Running it backwards: a quoted market rate of 9.5% with inflation at 3.2%
is a real rate of 1.095/1.032 − 1 = **6.1047%**.

The rule for applying them is short. **Then-current (actual) dollars are
discounted at the market rate; constant (today's) dollars are discounted at the
real rate.** Mixing them is the error the question is built around. As a feel
for the magnitudes: 10,000 received six years from now, with 3% inflation, buys
what 10,000/(1.03)^6 = **8,374.84** buys today.`,
      examTip: 'Gradient problems: the arithmetic gradient contributes nothing in year 1, so a "rises by G starting in year 2" series is the plain (P/G) case. If the problem says the increase starts in year 1, the series has n−1 gradient steps and you must shift the timeline.',
      importantNote: 'Capitalized cost P = A/i needs A to occur every period. Convert any renewal that recurs every k periods into an annual equivalent with (A/F, i, k) first, then divide by i.',
    },
  ],
  keyTakeaways: [
    'F = P(1+i)^n converts present to future; P = F/(1+i)^n converts future to present.',
    'Six standard factors cover all conversions: P/F, F/P, P/A, A/P, F/A, A/F.',
    'EAR = (1+r/m)^m - 1 converts nominal rate to effective annual rate.',
    'Draw cash flow diagrams before selecting factors to avoid timing errors.',
    'Use Annual Worth for comparing projects with different lifespans.',
  ],
},

fee_cost_analysis: {
  topicId: 'fee_cost_analysis',
  title: 'NPV, Rate of Return, & Investment Analysis',
  domainWeight: 'Engineering Economics · 3–5%',
  overview: 'Net Present Value (NPV), Internal Rate of Return (IRR), and Benefit-Cost analysis are the primary methods for evaluating engineering investments. Each method has strengths depending on the decision context.',
  sections: [
    {
      id: 'ca-npv-irr',
      title: '1. NPV and Internal Rate of Return',
      content: `## 1.1 Net Present Value (NPV)

**$NPV = -C_{0} + \\Sigma [B_{t}/(1+i)^t]$**

Where $C_{0}$ is initial cost, Bₜ is net benefit in year t, and i is discount rate.

- **$NPV > 0$**: project adds value — accept
- **$NPV < 0$**: project destroys value — reject
- **$NPV = 0$**: project breaks even at the discount rate

For mutually exclusive alternatives, choose the one with **highest NPV**.

## 1.2 Internal Rate of Return (IRR)

IRR is the discount rate that makes NPV = 0:

**$0 = -C_{0} + \\Sigma [B_{t}/(1+IRR)^t]$**

Decision rule: **accept if IRR > MARR** (Minimum Acceptable Rate of Return)

### IRR vs NPV

| Situation | Use NPV | Use IRR |
|---|---|---|
| Different project sizes | Preferred | Misleading |
| Multiple sign changes in cash flow | Works correctly | May give multiple IRRs |
| Simple accept/reject | Either works | Either works |
| Ranking alternatives | Preferred | Need incremental analysis |`,
      examTip: 'NPV is generally the safer method on the FE exam because it always gives a correct ranking. IRR can be misleading when comparing projects of different sizes or when cash flows change sign multiple times (creating multiple IRR solutions).',
    },
    {
      id: 'ca-bc-payback',
      title: '2. Benefit-Cost Ratio and Payback Period',
      content: `## 2.1 Benefit-Cost Ratio

**B/C = PV(benefits) / PV(costs)**

- **$B/C > 1$**: project justified — accept
- **$B/C < 1$**: costs exceed benefits — reject
- Standard for **public sector** projects (government, infrastructure)

For incremental analysis of two alternatives: accept the more expensive if incremental B/C > 1.

## 2.2 Annual Worth

**$AW = NPV \\times (A/P, i, n)$**

Converts NPV to equivalent annual amount. Positive AW means the project is worthwhile. Particularly useful for comparing alternatives with **different lifespans**.

## 2.3 Payback Period

**Payback = Initial investment / Annual net benefit**

- Simple to calculate but **ignores time value of money**
- Ignores cash flows after payback
- Use only for **screening**, not for final decisions

### Profitability Index

**PI = PV(benefits) / PV(costs) = 1 + NPV/PV(costs)**

PI > 1 is acceptable. Useful for **capital rationing** when budget is limited.`,
      examTip: 'On the FE exam, B/C analysis is common for public project evaluation. Remember: for incremental analysis between alternatives, compute incremental B/C = (ΔBenefits)/(ΔCosts). Accept the more expensive alternative only if incremental B/C > 1.',
    },
    {
      id: 'ca-pw-profile-irr',
      title: '3. The Present-Worth Profile, the IRR, and Why Ranking Needs Increments',
      content: `## 3.1 One project, one curve

Net present value is not a number; it is a **function of the discount rate**.
Plotting NPV against i turns almost every rate-of-return question into
something you can see, and it is worth twenty seconds of sketching whenever a
problem mentions more than one rate.

Take a project that costs 100,000 now and returns 28,000 a year for six years.
Its net present value at any rate is

NPV(i) = −100,000 + 28,000(P/A, i, 6)

and evaluating the closed form at three rates gives:

| Discount rate | (P/A, i, 6) | NPV |
|---|---|---|
| 10% | 4.355261 | +21,947.30 |
| 15% | 3.784483 | +5,965.52 |
| 17% | 3.589185 | +497.17 |
| 18% | 3.497603 | −2,067.13 |
| 20% | 3.325510 | −6,885.72 |

The curve falls monotonically and crosses zero once. That crossing is the
**internal rate of return**.

## 3.2 Finding the IRR without a table

Setting NPV = 0 and solving for the factor is the move that makes IRR problems
tractable:

0 = −100,000 + 28,000(P/A, i*, 6) ⟹ (P/A, i*, 6) = 100,000/28,000 = 3.571429

Now find the rate whose (P/A, i, 6) equals 3.571429. Solving the closed form
numerically gives **i\\* = 17.1906%**, and substituting back returns NPV = 0.00 —
the check you should always run.

On a timed exam you interpolate between two bracketing rates instead:

i ≈ 17% + (18% − 17%) × 497.17/[497.17 − (−2,067.13)] = **17.1939%**

That is 0.0033 percentage points from the exact answer, which is far inside any
multiple-choice spacing. Linear interpolation slightly **overestimates** the
IRR because the NPV curve is convex, and knowing the direction of the bias is
occasionally enough to break a tie between two close options.

Notice a small elegance: the required factor value, 3.571429, is numerically
identical to the simple payback period of 100,000/28,000 = 3.5714 years. That
is not a coincidence — both are the ratio of first cost to annual receipt — and
it is a fast way to start an IRR problem from a payback figure the question has
already given you.

## 3.3 Payback, discounted payback, and profitability index

Screening measures answer different questions and should never be used to
choose between alternatives.

- **Simple payback**: 100,000/28,000 = **3.57 years**. Ignores the time value
  of money entirely.
- **Discounted payback** at 10%: cumulative present worth reaches 88,756.23 by
  year 4 and 106,142.03 by year 5, so the investment is recovered at
  **4.65 years**. Always longer than simple payback — the difference is exactly
  the interest the naive measure forgets.
- **Profitability index**: PV of receipts over PV of costs =
  121,947.30/100,000 = **1.2195**. Equivalent to NPV > 0, and useful only when
  capital is rationed and you must rank by value per dollar committed.
- **Annual worth**: NPV converted to a level annual amount,
  21,947.30 × (A/P, 10%, 6) = 21,947.30 × 0.229607 = **+5,039.26 per year**.

## 3.4 Two alternatives: the mistake that ranking IRRs makes

**Given**, at a MARR of 12% and eight-year lives:

- Alternative A: costs 50,000, returns 15,000 a year.
- Alternative B: costs 80,000, returns 21,500 a year.

**Individual measures.** With (P/A, 12%, 8) = 4.967640:

| | First cost | Annual receipt | NPV at 12% | IRR |
|---|---|---|---|---|
| A | 50,000 | 15,000 | +24,514.60 | 24.951% |
| B | 80,000 | 21,500 | +26,804.25 | 21.043% |

A has the higher rate of return; B has the higher net present value. Both are
acceptable against the 12% MARR, and they disagree about which is better.

**The resolution is the increment.** Choosing B instead of A means spending an
extra 30,000 to receive an extra 6,500 a year. Analyse *that* project:

- Incremental NPV at 12% = −30,000 + 6,500(4.967640) = **+2,289.66**
- Incremental IRR = **14.1515%**

The extra 30,000 earns 14.15%, which beats the 12% MARR, so the extra spending
is justified and **B is correct**. Note that the incremental NPV, 2,289.66, is
exactly the difference between the two NPVs — the two methods were never in
conflict, because NPV already answers the incremental question automatically.

![Present-worth profiles of the two alternatives, each computed as NPV(i) = −C0 + A(P/A, i, 8) and drawn from 0.5% to 30%. Alternative A crosses zero at 24.95% and alternative B at 21.04%, while the two curves cross each other at 14.15% — which is exactly the incremental internal rate of return.](/courses/fe-ee/figures/econ-pw-profile.svg)

The crossing point in the figure is the whole lesson. To the left of 14.15% the
higher-NPV choice is B; to the right of it, A. Since the crossing IS the
incremental IRR, the rule "accept the increment when its IRR exceeds the MARR"
and the rule "take the higher NPV at the MARR" are the same rule seen from two
directions. A MARR of 12% sits left of the crossing, so B wins on both — and if
the problem had set the MARR at 16%, both would have chosen A. The one method
that is simply wrong is ranking projects by their own IRRs, which would pick A
at every MARR and would be right only by accident.

## 3.5 When IRR misbehaves

Two failure modes appear on exams and both are visible in the profile picture.

- **Multiple roots.** If the cash-flow signs change more than once — an
  investment, receipts, then a large end-of-life cleanup cost — the NPV curve
  can cross zero more than once. Descartes' rule bounds the number of positive
  roots by the number of sign changes. When it can happen, use NPV.
- **Scale blindness.** IRR is a ratio, so a tiny project with a spectacular
  return outranks a large project with a merely good one. Increments fix this;
  raw IRR rankings do not.`,
      examTip: 'When two alternatives disagree — one wins on IRR, the other on NPV — the answer is always found by analysing the increment between them, and the answer always agrees with NPV at the stated MARR. Never rank mutually exclusive alternatives by their individual IRRs.',
      importantNote: 'IRR is defined by NPV(i*) = 0, so it does not depend on the MARR at all. The MARR enters only in the accept/reject comparison. A question that asks for "the rate of return" wants i*; a question that asks "should we invest" wants i* compared with the MARR.',
    },
    {
      id: 'ca-bc-annual-worth',
      title: '4. Benefit–Cost Ratios and Alternatives With Unequal Lives',
      content: `## 4.1 Two benefit–cost ratios, both legitimate, different numbers

Public-sector work is evaluated with a ratio rather than a difference, and the
exam expects you to know that the ratio depends on where you put the operating
costs. Both conventions are in use:

- **Conventional B/C** puts annual operating and maintenance costs in the
  denominator with the capital cost:
  B/C = PW(benefits) / [first cost + PW(O&M)]
- **Modified B/C** subtracts operating costs from the benefits instead:
  B/C = [PW(benefits) − PW(O&M)] / first cost

**Worked problem.** A flood-control project costs 1,800,000 to build, 120,000 a
year to operate, and produces benefits valued at 460,000 a year over a 25-year
life. At 6%, (P/A, 6%, 25) = 12.783356, so:

- PW(benefits) = 460,000 × 12.783356 = 5,880,343.83
- PW(O&M) = 120,000 × 12.783356 = 1,534,002.74

| Measure | Computation | Result |
|---|---|---|
| Conventional B/C | 5,880,343.83 / (1,800,000 + 1,534,002.74) | **1.7637** |
| Modified B/C | (5,880,343.83 − 1,534,002.74) / 1,800,000 | **2.4146** |
| Net present value | 5,880,343.83 − 1,534,002.74 − 1,800,000 | **+2,546,341.09** |

The two ratios differ by a lot — 1.76 against 2.41 — and they agree on the only
thing that matters: both exceed 1.0 exactly when NPV is positive. That
equivalence is worth remembering as a check. If you compute a B/C above 1 and a
negative NPV for the same project, you have made an arithmetic error, not
discovered a paradox.

**Disbenefits** are a third wrinkle: consequences that harm the public, such as
farmland lost to a reservoir. The usual convention subtracts them from
benefits, which lowers the ratio more than adding them to costs would; the
exam will tell you which convention it wants, and the honest answer is that the
number is convention-dependent while the accept/reject decision is not.

## 4.2 Unequal lives: annual worth is the shortcut, and it is exact

Present worth compares alternatives only over the **same** period of service.
When lives differ you have two correct options: repeat each alternative to the
least common multiple of the lives, or convert each to an annual worth. Annual
worth is faster, and it is not an approximation — it gives an identical ranking.

**Worked problem.** At 10%:

- Machine X: 40,000 first cost, 9,000 a year to run, 6,000 salvage, 5-year life
- Machine Y: 65,000 first cost, 6,000 a year to run, 10,000 salvage, 10-year
  life

The annual worth of an ownership cost is

**$AW = -P(A/P, i, n) + S(A/F, i, n) - (\\mathrm{annual\\ cost})$**

| | (A/P, 10%, n) | (A/F, 10%, n) | Capital recovery | Annual worth |
|---|---|---|---|---|
| X, n = 5 | 0.263797 | 0.163797 | −40,000(0.263797) + 6,000(0.163797) = −9,569.11 | **−18,569.11** |
| Y, n = 10 | 0.162745 | 0.062745 | −65,000(0.162745) + 10,000(0.062745) = −9,951.00 | **−15,951.00** |

Machine Y costs **2,618.11 less per year**, so Y wins.

**The long way, as a check.** Over the least common multiple of ten years — X
purchased twice, Y once — the present worths are −114,099.17 for X and
−98,011.97 for Y. Multiply each by (A/P, 10%, 10) = 0.162745 and you recover
−18,569.11 and −15,951.00 exactly. The two methods are algebraically the same
computation, which is why annual worth is safe to use and why comparing raw
present worths over *different* lives is not.

## 4.3 Capital recovery is the number that matters

Notice how close the two capital-recovery figures are: 9,569.11 a year for X
and 9,951.00 for Y. The purchase prices differ by 25,000, but spread over their
service lives that difference nearly vanishes, and the decision is driven
almost entirely by the 3,000-a-year gap in running cost. This is the practical
lesson buried in every unequal-lives problem: first cost is the number
everybody argues about, and operating cost is usually the number that decides.

A useful reading of capital recovery: −P(A/P) + S(A/F) is the annual cost of
owning the asset, and it can be rewritten as
−(P − S)(A/P, i, n) − S·i, which says the same thing in words you can defend in
a meeting — you recover the amount you will actually lose, and you pay interest
on the salvage you have tied up in the meantime.`,
      examTip: 'When lives differ, never compare present worths directly. Convert both to annual worth, or repeat both to the least common multiple. The AW method is exact, not an approximation, and it is faster than building a 30-year timeline for 5-year and 6-year alternatives.',
    },
    {
      id: 'ca-breakeven-trees',
      title: '5. Break-Even Analysis and Decision Trees',
      content: `## 5.1 Break-even against volume

Break-even analysis asks the one question a present-worth calculation cannot:
**how wrong can my forecast be before the decision changes?** The mechanics are
simple linear algebra; the value is in what it does to a shaky assumption.

**Single product.** Fixed cost F, variable cost v per unit, price p per unit.
Profit is zero when revenue equals total cost:

**$pQ = F + vQ \\Rightarrow Q^{*} = F/(p - v)$**

The denominator p − v is the **contribution margin** — the amount each unit
contributes toward covering fixed cost.

**Worked problem.** F = 120,000 a year, v = 14.00 per unit, p = 26.00 per unit.

Q\\* = 120,000/(26.00 − 14.00) = **10,000 units a year**. At that volume revenue
is 260,000 and total cost is 120,000 + 14 × 10,000 = 260,000, which closes.
At 14,000 units the profit is (26 − 14)(14,000) − 120,000 = **48,000**.

## 5.2 Break-even between two processes

The more common exam form compares two ways of doing the same job, one with
high fixed cost and low variable cost, the other the reverse. Setting the total
costs equal:

**$Q^{*} = (F_{2} - F_{1})/(v_{1} - v_{2})$**

**Worked problem.** Process 1 has 50,000 fixed cost and 8.00 per unit; process
2 has 90,000 fixed and 5.20 per unit.

Q\\* = (90,000 − 50,000)/(8.00 − 5.20) = 40,000/2.80 = **14,285.71 units**.

Check: at that volume process 1 costs 50,000 + 8.00(14,285.71) = 164,285.71 and
process 2 costs 90,000 + 5.20(14,285.71) = 164,285.71. Identical, as required.

At an expected 20,000 units a year, process 1 costs 210,000 and process 2 costs
194,000, so the capital-heavy process saves **16,000 a year**. Below 14,286
units the ranking reverses.

![Total annual cost of two processes against volume, each line drawn from the stated fixed cost and per-unit variable cost. The lines cross at 14,286 units, where both cost 164,286; above that volume the process with the higher fixed cost and lower slope is the cheaper one.](/courses/fe-ee/figures/econ-breakeven.svg)

The figure is the argument for doing break-even analysis at all. A point
estimate of "20,000 units" makes process 2 look like an easy call worth 16,000
a year. The crossing at 14,286 tells you how much of that comfort is real: a
30% shortfall in demand erases the advantage entirely, and anything below that
makes the decision actively wrong. Whenever an exam question gives you a
forecast and asks what volume justifies an investment, it is asking you to find
this intersection.

## 5.3 Decision trees: folding back an expected value

When the future is uncertain but you can put probabilities on the outcomes, the
tool is a decision tree. The rule is mechanical: **compute the expected value at
each chance node, then choose the branch with the best expected value at each
decision node**, working backwards from the leaves.

**Worked problem.** A firm can build a full production line for 500,000 or a
small line for 250,000. Present worths of the receipts, and their
probabilities:

| Alternative | Outcome | Probability | PW of receipts |
|---|---|---|---|
| Full line | strong demand | 0.45 | 1,400,000 |
| Full line | moderate demand | 0.35 | 700,000 |
| Full line | weak demand | 0.20 | 200,000 |
| Small line | strong or moderate | 0.60 | 620,000 |
| Small line | weak | 0.40 | 380,000 |

**Step 1 — check the probabilities.** Each set sums to 1.00. A tree whose
branch probabilities do not sum to one is a misread problem.

**Step 2 — expected value at each chance node.**
Full line: 0.45(1,400,000) + 0.35(700,000) + 0.20(200,000) =
630,000 + 245,000 + 40,000 = **915,000**.
Small line: 0.60(620,000) + 0.40(380,000) = 372,000 + 152,000 = **524,000**.

**Step 3 — subtract the investment at the decision node.**
Full line: 915,000 − 500,000 = **+415,000**.
Small line: 524,000 − 250,000 = **+274,000**.

**Step 4 — decide.** The full line has the higher expected net present worth by
**141,000**, so it is preferred on expected value.

Two cautions the exam likes. First, expected value is an average over
repetitions, and it says nothing about the risk of the weak-demand branch,
where the full line returns 200,000 against a 500,000 outlay — a real loss.
Expected-value analysis is the correct answer to the question asked, not a
statement that the outcome is safe. Second, every branch value must already be
a present worth at the same date; discounting some branches and not others is
the most common way these problems are botched.

## 5.4 Sensitivity: the question behind all of this

Break-even and decision trees are two answers to the same underlying question —
which assumption is the decision actually resting on? A quick sensitivity pass
varies one input at a time and reports the value at which the preferred
alternative changes. On the two-process problem above, the decision rests on
volume and flips at 14,286 units. On the tree, it rests on the probability of
weak demand; the arithmetic that finds the flipping probability is the same
expected-value fold, solved for p instead of evaluated at it.`,
      examTip: 'Break-even between two alternatives: set the two total-cost expressions equal and solve for the single unknown. Do not compute each alternative separately and hunt for where they match — the algebra is one line and immune to arithmetic slips.',
      importantNote: 'In a decision tree, probabilities on branches leaving a chance node must sum to 1.0, and every payoff must be expressed at the same point in time (usually present worth) before the expected value is taken.',
    },
  ],
  keyTakeaways: [
    'NPV = -C₀ + Σ[Bₜ/(1+i)^t]; positive NPV means the project adds value.',
    'IRR is the rate making NPV = 0; accept if IRR > MARR.',
    'B/C ratio > 1 means justified; standard for public sector analysis.',
    'Annual Worth (AW) is best for comparing alternatives with different lifespans.',
    'Payback period ignores time value of money — use only for initial screening.',
  ],
},

fee_depreciation: {
  topicId: 'fee_depreciation',
  title: 'Depreciation & Book Value',
  domainWeight: 'Engineering Economics · 3–5%',
  overview: 'Depreciation allocates an asset\'s cost over its useful life for accounting and tax purposes. Straight-line, MACRS, and sum-of-years-digits are the methods tested on the FE exam.',
  sections: [
    {
      id: 'dep-methods',
      title: '1. Depreciation Methods',
      content: `## 1.1 Straight-Line Depreciation

**D = (Cost - Salvage) / Useful Life**

- Equal annual depreciation
- **Book value**: BV_t = Cost - t·D
- Simplest method; used for financial reporting

## 1.2 MACRS (Modified Accelerated Cost Recovery System)

- U.S. tax standard for depreciation
- **Ignores salvage value** (depreciates full cost)
- Uses IRS-defined recovery periods (3, 5, 7, 10, 15, 20 years)
- Front-loads deductions (higher depreciation in early years)
- Specific percentages from IRS tables

### MACRS Advantage

Accelerated depreciation reduces taxes earlier → better cash flow due to **time value of money**.

## 1.3 Sum-of-Years-Digits (SYD)

**D_t = (Remaining useful life / Sum of all years) × (Cost - Salvage)**

Sum of years for n-year life: SYD = n(n+1)/2

Example: 5-year life → SYD = 15
- Year 1: $D_{1}$ = (5/15)(Cost-Salvage) = 33.3%
- Year 2: $D_{2}$ = (4/15)(Cost-Salvage) = 26.7%
- Year 3: $D_{3}$ = (3/15)(Cost-Salvage) = 20.0%

| Method | Pattern | Salvage Value | Tax Use |
|---|---|---|---|
| Straight-line | Equal annual | Subtracted | Financial reporting |
| MACRS | Accelerated | Ignored | U.S. tax calculations |
| SYD | Accelerated | Subtracted | Some accounting |`,
      examTip: 'The FE exam may ask you to compare depreciation methods. Straight-line is simplest; MACRS gives the best tax benefit early (time value advantage). For MACRS, you need the IRS recovery period table — the FE reference handbook provides these percentages.',
    },
    {
      id: 'dep-bookvalue',
      title: '2. Book Value, Market Value, and Tax Effects',
      content: `## 2.1 Book Value vs Market Value

- **Book value**: Cost minus accumulated depreciation (accounting value)
- **Market value**: what the asset could actually sell for

These diverge over time:
- Well-maintained equipment may have market value > book value
- Rapidly obsolete technology may have market value < book value

## 2.2 Tax Shield from Depreciation

Depreciation reduces taxable income, creating a **tax shield**:

**Tax savings = D × Tax rate**

Example: \\$10,000 depreciation at 30% tax rate \\rightarrow  \\$3,000 tax savings

### After-Tax Cash Flow

**ATCF = Before-tax cash flow - Taxes + Depreciation tax shield**

Or equivalently: ATCF = Revenue - Expenses - Taxes

Where Taxes = (Revenue - Expenses - Depreciation) × Tax rate

## 2.3 Disposal and Capital Gains

When selling an asset:
- If sale price > book value: **capital gain** (taxable)
- If sale price < book value: **capital loss** (tax deduction)
- If sale price = book value: no tax consequence`,
      examTip: 'Depreciation is a non-cash expense — it does not involve actual money leaving the company. It reduces taxable income, which reduces taxes paid (a real cash savings). This tax shield effect must be included in after-tax NPV analysis.',
    },
    {
      id: 'dep-four-schedules',
      title: '3. Four Schedules on One Asset, Computed Line by Line',
      content: `## 3.1 The setup every method shares

Take one asset and run all four methods on it, so the differences are about the
method and nothing else.

- First cost (basis) B = 90,000
- Estimated salvage value S = 10,000
- Useful life n = 5 years, and it is 5-year property for tax purposes

Depreciation never changes what the asset cost or what it will sell for. It
only changes **which year** the deduction lands in, and because deductions are
worth money and money has a time value, that timing has a computable value —
which section 4 works out in dollars.

## 3.2 Straight line

**D = (B − S)/n = (90,000 − 10,000)/5 = 16,000 per year**, every year.

Book value falls in equal steps: 74,000, 58,000, 42,000, 26,000, and finally
10,000, which is the salvage value exactly. That last equality is the check for
every book method: **BV at the end of the life must equal the salvage value**.

## 3.3 Declining balance

Declining balance takes a fixed **percentage of the remaining book value**, so
the deduction shrinks each year. Double declining balance uses twice the
straight-line rate, 2/n = 0.40 here:

**$D_{t} = BV_{t-1} \\times 2/n$**

| Year | Computation | Depreciation | Book value after |
|---|---|---|---|
| 1 | 0.40 × 90,000 | 36,000.00 | 54,000.00 |
| 2 | 0.40 × 54,000 | 21,600.00 | 32,400.00 |
| 3 | 0.40 × 32,400 | 12,960.00 | 19,440.00 |
| 4 | 0.40 × 19,440 | 7,776.00 | 11,664.00 |
| 5 | limited by the salvage floor | 1,664.00 | 10,000.00 |

Year 5 is the trap. Unrestrained, 0.40 × 11,664 would be 4,665.60 and would
push book value to 6,998.40 — **below the salvage value, which is not
allowed**. The deduction is cut to whatever brings book value exactly to
10,000, namely 1,664.00. The five deductions sum to 80,000, which is B − S, as
they must.

Two structural facts about declining balance are worth carrying into the exam.
It never reaches zero on its own, because a fixed fraction of something
positive is always positive; and unlike every other method here, the salvage
value does not appear in the formula at all — it appears only as a floor.

## 3.4 Sum-of-years-digits

SYD spreads the depreciable amount B − S in proportion to the years of life
remaining. For n = 5 the digits sum to n(n+1)/2 = 15.

| Year | Fraction | Depreciation | Book value after |
|---|---|---|---|
| 1 | 5/15 | 26,666.67 | 63,333.33 |
| 2 | 4/15 | 21,333.33 | 42,000.00 |
| 3 | 3/15 | 16,000.00 | 26,000.00 |
| 4 | 2/15 | 10,666.67 | 15,333.33 |
| 5 | 1/15 | 5,333.33 | 10,000.00 |

Again the final book value is the salvage value. Notice year 3: SYD's middle
deduction is 16,000, identical to the straight-line amount. That is not a
coincidence — the fractions are symmetric about the middle year — and it is a
handy check on any odd-lived SYD schedule.

## 3.5 MACRS, and where the percentages actually come from

MACRS is the U.S. tax system, and it differs from the book methods in three
ways that the exam tests directly:

1. It **ignores salvage value** and depreciates the entire basis to zero.
2. It uses IRS **recovery periods** (3, 5, 7, 10, 15, 20 years for personal
   property), which need not match the asset's real service life.
3. It applies the **half-year convention**: property is treated as placed in
   service at mid-year, so a 5-year class spreads over **six** tax years.

The published percentages are not arbitrary. They are 200% declining balance,
switching to straight line over the remaining recovery period in whichever year
straight line gives the larger deduction, with half-year timing in the first
and last years. Running that algorithm for the 5-year class reproduces the
published column exactly:

| Year | Derived from the algorithm | Applied to 90,000 | Book value after |
|---|---|---|---|
| 1 | 20.00% | 18,000.00 | 72,000.00 |
| 2 | 32.00% | 28,800.00 | 43,200.00 |
| 3 | 19.20% | 17,280.00 | 25,920.00 |
| 4 | 11.52% | 10,368.00 | 15,552.00 |
| 5 | 11.52% | 10,368.00 | 5,184.00 |
| 6 | 5.76% | 5,184.00 | 0.00 |

The switch happens in year 4: declining balance would give 11.52% and straight
line over the remaining period gives 11.52% as well, after which straight line
is larger, which is why years 4 and 5 are equal. The percentages sum to
100.00%, and the asset depreciates to **zero** — the 10,000 of expected salvage
plays no part whatsoever.

The same derivation reproduces the 3-year column as 33.33, 44.44, 14.81, 7.41
and the 7-year column as 14.29, 24.49, 17.49, 12.49, 8.92, 8.92, 8.92, 4.46;
the published IRS tables differ from these in the last digit of a few entries
(44.45 rather than 44.44 in the 3-year class, for instance), because the
published values are rounded to two decimals in a way that forces the column to
total exactly 100%. Use the published table when one is given; the derivation
is there so the table is never mysterious.

![Book value of one 90,000 asset against time under straight line, sum-of-years-digits, and five-year MACRS. All three start at 90,000; the two book methods land exactly on the 10,000 salvage value at the end of year 5, while MACRS ignores salvage, runs a sixth year under the half-year convention, and finishes at zero.](/courses/fe-ee/figures/econ-depreciation-book-value.svg)

The figure shows what "accelerated" actually buys. Sum-of-years-digits and
MACRS track each other closely through the middle years — at the end of year 3
they stand at 26,000 and 25,920, a difference of 80 on a 90,000 asset — so if
an exam question hands you one and asks about the other, your intuition about
magnitude will not mislead you. The real divergence is at the ends: MACRS
starts slower than SYD in year 1, because of the half-year convention, and then
keeps going for a sixth year after every book method has stopped. Double
declining balance, whose schedule is tabulated in section 3.3 above, would run
below all three until its salvage floor catches it in year 5.

## 3.6 Choosing a method on the exam

| Method | Pattern | Uses salvage? | Ends at | Typical use |
|---|---|---|---|---|
| Straight line | Equal amounts | Yes | Salvage | Financial reporting |
| Declining balance | Fixed % of book value | As a floor only | Salvage (by limiting) | Book, and inside MACRS |
| Sum-of-years-digits | Decreasing fractions | Yes | Salvage | Book, accelerated |
| MACRS | IRS percentages | No | Zero | U.S. tax computation |

If a question says "for tax purposes" or names a recovery period, it wants
MACRS and salvage is a distractor. If it gives a salvage value and a useful
life, it wants a book method and the schedule must end on that salvage value.`,
      examTip: 'Two checks catch most depreciation errors. For any book method, the final book value must equal the salvage value. For MACRS, the percentages must sum to 100% and the final book value must be zero — if your MACRS answer stops at the salvage value, you have mixed the two systems.',
      importantNote: 'The half-year convention is why 5-year MACRS property is written off over six tax years, and why the year-1 percentage (20.00%) is smaller than the year-2 percentage (32.00%). An answer choice showing a 5-year MACRS schedule with only five entries is wrong on its face.',
    },
    {
      id: 'dep-aftertax-disposal',
      title: '4. After-Tax Cash Flow, the Value of the Shield, and Disposal',
      content: `## 4.1 The after-tax cash flow equation, two ways

Depreciation is a **non-cash** expense: no money leaves the company when a
schedule is posted. It still changes cash, because it lowers taxable income and
therefore lowers the tax paid. The bookkeeping is:

Taxable income = Revenue − Expenses − Depreciation
Taxes = Taxable income × t
**$ATCF = \\mathrm{Revenue} - \\mathrm{Expenses} - \\mathrm{Taxes}$**

**Worked problem.** A machine produces 60,000 a year of revenue against 22,000
of cash operating expenses. It is 5-year MACRS property with a basis of 90,000,
and the tax rate is 21%. Find the after-tax cash flow in year 1.

**Step 1 — depreciation.** 20.00% of 90,000 = 18,000.
**Step 2 — taxable income.** 60,000 − 22,000 − 18,000 = 20,000.
**Step 3 — tax.** 20,000 × 0.21 = 4,200.
**Step 4 — cash flow.** 60,000 − 22,000 − 4,200 = **33,800**.

The same answer arrives from the form that separates the shield explicitly:

**$ATCF = (R - E)(1 - t) + D\\cdot t$**

= 38,000(0.79) + 18,000(0.21) = 30,020 + 3,780 = **33,800**

The second form is the more useful one because it isolates **D·t**, the
depreciation tax shield: 3,780 of the year-1 cash flow exists only because a
deduction was taken. Depreciation never adds cash by itself; it protects cash
from tax.

## 4.2 What acceleration is actually worth, in dollars

Textbooks say accelerated depreciation "improves cash flow." Here is the size
of the improvement, computed rather than asserted, at a 10% discount rate and a
21% tax rate on the same 90,000 basis.

| Schedule | Nominal total shield | Present worth of the shield at 10% |
|---|---|---|
| MACRS, 5-year class | 18,900.00 | **14,614.62** |
| Straight line over 5 years on the full 90,000 basis | 18,900.00 | 14,329.17 |
| Straight line on (90,000 − 10,000 salvage) | 16,800.00 | 12,737.04 |

Two honest conclusions come out of that table, and only the first is the one
students expect.

**First**, comparing like with like — the same 90,000 written off, only the
timing differing — acceleration is worth **285.45**, about 2% of the shield's
value. Real, computable, and modest. It grows with the discount rate and with
longer recovery periods, and it is the entire legitimate content of "MACRS
improves cash flow."

**Second**, the much larger gap in that table, 14,614.62 against 12,737.04, is
**1,877.58**, and most of it has nothing to do with timing at all. It comes
from MACRS depreciating the full basis while the book method removes the
expected salvage first. That is a difference in the *amount* deducted, not in
its schedule. Confusing the two is the standard misreading of this comparison,
and it is worth being precise about: acceleration shifts a fixed shield
earlier; ignoring salvage makes the shield bigger.

## 4.3 Disposal: book value decides the tax, not the purchase price

When an asset is sold, the tax consequence depends on the sale price relative
to the **current book value under the schedule actually used**.

- Sale price > book value → the excess is **depreciation recapture**, taxed as
  ordinary income (up to the original basis)
- Sale price < book value → a **loss**, generally deductible
- Sale price = book value → no tax consequence

**Worked problem.** The 90,000 machine is sold at the end of year 4 for 25,000.
Under 5-year MACRS the accumulated depreciation is
20.00 + 32.00 + 19.20 + 11.52 = 82.72% of the basis, so the book value is
90,000 × 0.1728 = **15,552.00**.

- Recapture = 25,000 − 15,552.00 = **9,448.00**
- Tax at 21% = **1,984.08**
- Net after-tax proceeds = 25,000 − 1,984.08 = **23,015.92**

Note what happened: the machine sold for well under its 90,000 cost — a
"loss" in ordinary language — and still produced a tax bill, because MACRS had
already deducted more than the asset's real decline in value. That is the point
of recapture, and it is why after-tax replacement studies must use book value
rather than either purchase price or market intuition.

## 4.4 Book value against market value

The two numbers answer different questions and routinely disagree:

| | What it is | Set by |
|---|---|---|
| Book value | Basis minus accumulated depreciation | The schedule you chose |
| Market value | What a buyer would pay today | Condition, demand, obsolescence |

Well-maintained machine tools often hold market value far above an accelerated
book value; specialised electronics frequently fall below any book value the
moment a new generation ships. Neither divergence is an error. Book value is an
accounting allocation, and its only claims are the ones the schedule makes.

## 4.5 Putting it together in an after-tax present worth

An after-tax study for a capital purchase runs on one table with a row per year
and these columns: before-tax cash flow, depreciation, taxable income, tax,
after-tax cash flow, and the discount factor. Two rules keep it straight.
Depreciation appears in the **taxable income** column but never in the
**cash flow** column — it is not a payment. And the disposal year carries two
extra entries: the sale proceeds, and the tax on any recapture computed from
that year's book value. Every after-tax problem the FE exam sets is that table
with a small number of rows.`,
      examTip: 'Use ATCF = (R − E)(1 − t) + D·t when the question asks about the effect of depreciation, because it shows the shield D·t as its own term. Use ATCF = R − E − taxes when the question just wants the cash number. They always agree.',
      importantNote: 'On disposal, the gain that gets taxed is measured against BOOK value under the schedule in use, not against the original purchase price. Selling an asset for less than you paid can still create taxable recapture if depreciation has already been deducted below the sale price.',
    },
  ],
  keyTakeaways: [
    'Straight-line: D = (Cost-Salvage)/Life; produces equal annual deductions.',
    'MACRS is accelerated and ignores salvage; used for U.S. tax calculations.',
    'SYD: D_t = (Remaining years/SYD)×(Cost-Salvage); SYD = n(n+1)/2.',
    'Book value = Cost - Accumulated depreciation; differs from market value.',
    'Depreciation creates tax shield: tax savings = D × tax rate.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
 * TOPIC 4 — PROPERTIES OF ELECTRICAL MATERIALS  (4 curriculum IDs)  ·  3–5 %
 * ══════════════════════════════════════════════════════════════════ */

};
