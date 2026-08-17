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
| Future given present | (F/P, i, n) | (1+i)^n | 1.6105100 |
| Present given future | (P/F, i, n) | (1+i)^(−n) | 0.6209213 |
| Future given annual | (F/A, i, n) | [(1+i)^n − 1]/i | 6.1051000 |
| Present given annual | (P/A, i, n) | [(1+i)^n − 1]/[i(1+i)^n] | 3.7907868 |
| Annual given present | (A/P, i, n) | i(1+i)^n/[(1+i)^n − 1] | 0.2637975 |
| Annual given future | (A/F, i, n) | i/[(1+i)^n − 1] | 0.1637975 |

Three identities hold in that column, and each is a free error check on exam
day:

1. **(P/A)(A/P) = 1.** Here 3.7907868 × 0.2637975 = 1.000000. Any reciprocal
   pair must multiply to one.
2. **(A/P) − (A/F) = i.** Here 0.2637975 − 0.1637975 = 0.100000 exactly. A loan
   payment is the sinking-fund deposit plus the interest on the whole
   principal — which is what that subtraction says in words.
3. **(F/A)(P/F) = (P/A).** Here 6.1051000 × 0.6209213 = 3.790787. Pushing a
   series to the end and then discounting the lump back is the same as
   discounting the series directly.

Carry seven decimals, not six, whenever you intend to multiply a factor by a
five-figure amount. Six-decimal factors are fine for choosing between options
but will disagree with the exact answer in the last cent, and a table of
options spaced a cent apart is a table you should be suspicious of anyway.

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
(A/P, 6%, 5) = 0.06(1.06)^5/[(1.06)^5 − 1] = 0.2373964.

**Step 3 — apply it.** A = 25,000 × 0.2373964 = **5,934.91 per year**. Over five
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
  P = 40,000(P/F, 8%, 10) = 40,000 × 0.4631935 = **18,527.74**.

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
(A/P, 19.5618%, 4) = 0.3830856, so A = 30,000 × 0.3830856 = **11,492.57 per
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
A = 2,000 + 300(A/G, 8%, 8) = 2,000 + 300 × 3.0985239 = **2,929.56**, and
carrying that level amount back with 2,929.5572 × 5.7466389 = 16,835.11
returns the same present worth.

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
(A/F, 5%, 8) = 0.05/[(1.05)^8 − 1] = 0.104721814, so the equivalent annual cost
is 400,000 × 0.104721814 = **41,888.73**.

**Step 2 — capitalize the total annual cost and add the first cost.** Carrying
the annual equivalent unrounded, at 41,888.7255,
CC = 2,400,000 + 131,888.7255/0.05 = **5,037,774.51**. Summing the actual
renewals — 400,000 at year 8, at year 16, at year 24 and onward — reproduces
the same capitalized cost, which is the check that the sinking-fund step was
the right one.

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
    {
      id: 'tvm-simple-compound-diagram',
      title: '6. Simple Interest, Compound Interest, and the Diagram That Prevents Sign Errors',
      content: `## 6.1 Two ways a lender can charge for time

Interest is rent on money, and there are only two ways to charge it. **Simple
interest** charges rent on the original principal alone, so the debt grows by
the same absolute amount every period:

$$F = P(1 + i n)$$

**Compound interest** charges rent on everything currently owed — principal and
accrued interest together. That one sentence is enough to derive the rest of
this chapter. Write the balance at the end of period k as F_k. Then

$$F_{1} = P + iP = P(1+i)$$

$$F_{2} = F_{1} + iF_{1} = F_{1}(1+i) = P(1+i)^{2}$$

$$F_{k} = F_{k-1}(1+i)$$

and that recursion unwinds in one line into the multiplier every other formula
here is assembled from:

$$F = P(1+i)^{n} \\equiv P(F/P,\\, i,\\, n)$$

Running it backwards costs nothing, because multiplying by a nonzero number is
reversible:

$$P = F(1+i)^{-n} \\equiv F(P/F,\\, i,\\, n)$$

$$(F/P,\\, i,\\, n)\\,(P/F,\\, i,\\, n) = 1$$

Simple interest survives on the exam mostly as a distractor, and in practice
only in short-dated commercial instruments. Loans, bonds, sinking funds and
every project evaluation you will ever be asked about use compounding. Where a
problem is silent, assume compounding.

## 6.2 Worked Example — what interest on interest is actually worth

**Given**: 10,000 placed at 7% per year for twenty years.
**Find**: the ending balance under each convention, and the gap.

Simple interest pays 700 a year forever and never more:

$$F_{\\mathrm{simple}} = 10000\\left[1 + 0.07(20)\\right] = 10000 \\times 2.4 = 24000.00$$

Compound interest pays 7% of a balance that keeps climbing:

$$F_{\\mathrm{compound}} = 10000(1.07)^{20} = 10000 \\times 3.86968446 = 38696.84$$

$$38696.84 - 24000.00 = 14696.84$$

The gap, 14,696.84, is larger than the entire 14,000 of simple interest. That
is not a rhetorical flourish; it is the reason engineering economics exists as
a subject. Here is the same result built one period at a time, which is the
only check that cannot be fooled by a mis-keyed exponent.

| Year | Opening balance | Interest at 7% | Closing balance | Simple-interest balance |
|---|---|---|---|---|
| 1 | 10,000.00 | 700.00 | 10,700.00 | 10,700.00 |
| 2 | 10,700.00 | 749.00 | 11,449.00 | 11,400.00 |
| 3 | 11,449.00 | 801.43 | 12,250.43 | 12,100.00 |
| 10 | 18,384.59 | 1,286.92 | 19,671.51 | 17,000.00 |
| 19 | 33,799.32 | 2,365.95 | 36,165.28 | 23,300.00 |
| 20 | 36,165.28 | 2,531.57 | 38,696.84 | 24,000.00 |

Two features of that ledger are worth carrying into the exam. The interest
column under compounding is itself growing at 7% a year, which is why the
balance curve bends upward instead of running straight. And the two
conventions agree exactly through the end of period 1 and never again — a
one-period problem cannot distinguish them, so a question that hinges on the
distinction always spans several periods.

![Balance of 10,000 at 7% over thirty years, drawn twice: the straight line is simple interest P(1 + i n) and the rising curve is compound interest P(1 + i)^n, both evaluated from those closed forms. The marked pair at twenty years is 24,000 against 38,696.84, a gap of 14,696.84 that exceeds the whole simple-interest earnings of 14,000.](/courses/fe-ee/figures/econ2-simple-vs-compound.svg)

## 6.3 The diagram is the error-control mechanism

Almost every wrong answer in this section is a sign error or a timing error,
and almost every one of those is prevented by thirty seconds of drawing. The
convention is fixed and worth stating precisely, because it is the convention
that makes the arithmetic self-checking.

| Element | Convention | What goes wrong without it |
|---|---|---|
| Horizontal axis | time, marked at the END of each period | payments get shifted one period, changing the answer by a factor of (1+i) |
| Upward arrow | money arriving (receipt, salvage, loan proceeds) | receipts and outlays get added rather than netted |
| Downward arrow | money leaving (first cost, operating cost, payment) | a cleanup cost is credited instead of charged |
| Time 0 | now, the instant the decision is made | a first cost gets discounted as though it were a year away |
| Viewpoint | ONE party, held fixed for the whole diagram | the borrower's payment and the lender's receipt appear on the same side |

The last row is the one candidates skip. A loan is a positive arrow at time
zero and negative arrows afterwards **to the borrower**, and exactly the
reverse to the lender. Both diagrams are correct; a diagram that mixes them is
not. Pick the party whose decision the question is about, and never switch.

The end-of-period convention deserves the same emphasis. An annual amount A
starting in year 1 arrives at the end of year 1, one full period after time
zero. Money paid at time zero is not part of that series at all. It is added
separately, and forgetting to do so is the single commonest arithmetic slip in
lease and rent problems, where payments genuinely are made in advance.

## 6.4 Worked Example — a diagram with four different kinds of flow

**Given**: a machine costs 18,000 now, saves 5,200 a year for five years,
requires a 4,000 overhaul at the end of year 3, and is sold for 3,000 at the
end of year 5. The interest rate is 9%.
**Find**: the present worth.

**Step 1 — draw it.** One down arrow of 18,000 at time zero. Five up arrows of
5,200 at the ends of years 1 through 5. One extra down arrow of 4,000 at the
end of year 3. One extra up arrow of 3,000 at the end of year 5. Four
distinct shapes, four factors.

**Step 2 — attach a factor to each shape.** The five equal arrows are a uniform
series, so they take (P/A). The two single arrows each take (P/F) at their own
year:

$$PW = -18000 + 5200(P/A,\\, 9\\%,\\, 5) - 4000(P/F,\\, 9\\%,\\, 3) + 3000(P/F,\\, 9\\%,\\, 5)$$

**Step 3 — evaluate the factors from their closed forms.**

$$(P/A,\\, 9\\%,\\, 5) = \\frac{(1.09)^{5} - 1}{0.09(1.09)^{5}} = 3.8896513$$

$$(P/F,\\, 9\\%,\\, 3) = (1.09)^{-3} = 0.7721835 \\qquad (P/F,\\, 9\\%,\\, 5) = (1.09)^{-5} = 0.6499314$$

**Step 4 — combine, keeping the signs the diagram assigned.**

$$5200 \\times 3.8896513 = 20226.19$$

$$4000 \\times 0.7721835 = 3088.73 \\qquad 3000 \\times 0.6499314 = 1949.79$$

$$-18000 + 20226.19 - 3088.73 + 1949.79 = 1087.25$$

The present worth is **+1,087.25**, so the machine clears a 9% hurdle, though
not by much.

**The trap.** Add the overhaul instead of subtracting it and the answer becomes
7,264.71 — a number that looks perfectly plausible, sits comfortably among
multiple-choice options, and is wrong by a factor of nearly seven. Nothing in
the algebra warns you. The diagram does: an overhaul is money leaving, so its
arrow points down, so it enters the sum with a minus sign.

**Independent check.** Discounting all seven individual amounts one at a time —
5,200 in years 1, 2, 4; 1,200 net in year 3; 8,200 net in year 5 — reproduces
1,087.25 to the cent. Whenever a problem is small enough for that, it is worth
doing, because the factor route and the flow-by-flow route fail in different
ways and agreeing is strong evidence that neither did.`,
      examTip: 'Draw the diagram before touching the calculator, and fix the viewpoint in the first stroke. Roughly half of all lost points in this section are a sign that should have been negative or a payment placed one period from where it belongs, and both are visible on a sketch that takes half a minute.',
      importantNote: 'Simple interest and compound interest agree only through the first period. If a problem gives you a single period, the distinction cannot matter; if it gives you many, assume compounding unless the words "simple interest" appear.',
    },
    {
      id: 'tvm-single-payment-rates',
      title: '7. Single-Payment Factors, Doubling Time, and the Continuous Limit',
      content: `## 7.1 Everything a single amount can be asked to do

With (F/P) and (P/F) in hand, three questions can be posed about one lump sum,
and each is the same equation solved for a different unknown.

$$F = P(1+i)^{n} \\qquad P = \\frac{F}{(1+i)^{n}} \\qquad i = \\left(\\frac{F}{P}\\right)^{1/n} - 1 \\qquad n = \\frac{\\ln(F/P)}{\\ln(1+i)}$$

The last two are the ones candidates forget they can do. A question that gives
you a starting amount, an ending amount and a horizon is asking for a rate, and
the closed form above answers it in one calculator entry — no table, no
interpolation, no guessing.

## 7.2 Doubling time, and the shortcut that lies at the ends

Setting F/P equal to 2 gives the most useful special case in the subject:

$$n_{\\mathrm{double}} = \\frac{\\ln 2}{\\ln(1+i)}$$

The familiar shortcut divides 72 by the rate expressed in percentage points.
It is a first-order approximation of the exact expression, tuned so that it is
right somewhere near 8%, and it drifts in both directions away from there.

$$\\frac{0.6931472}{0.0769610} = 9.0065 \\qquad \\text{against } 72/8 = 9$$

$$\\frac{0.6931472}{0.1133287} = 6.1163 \\qquad \\text{against } 72/12 = 6$$

At 4% the exact answer is 17.67 periods and the shortcut says 18.0; at 12% the
exact answer is 6.12 and the shortcut says 6.0. Both errors are around 2%,
which is fine for mental arithmetic and not fine for a multiple-choice option
spaced 1% apart. Use the shortcut to sanity-check a keyed calculation, never to
produce an answer.

![Periods required to double against interest rate, from 1% to 25%. The solid curve is the exact n = ln2/ln(1+i) and the dashed curve is the rule of 72; they cross near 7.9% and separate at both ends, the shortcut running long at low rates and short at high rates. Marked points show 4%, 8% and 12%.](/courses/fe-ee/figures/econ2-doubling-time.svg)

## 7.3 Nominal against effective, derived rather than asserted

A nominal annual rate r compounded m times a year is not a rate; it is an
instruction to charge r/m every compounding period. After one year the
principal has been multiplied m times, so

$$F_{1\\,\\mathrm{yr}} = P\\left(1 + \\frac{r}{m}\\right)^{m} \\qquad \\Longrightarrow \\qquad i_{\\mathrm{eff}} = \\left(1 + \\frac{r}{m}\\right)^{m} - 1$$

Push m without bound and the bracket becomes the definition of the exponential:

$$\\lim_{m \\to \\infty}\\left(1 + \\frac{r}{m}\\right)^{m} = e^{r} \\qquad \\Longrightarrow \\qquad i_{\\mathrm{eff}} = e^{r} - 1$$

$$F = P\\,e^{rn}$$

Two consequences are worth memorising as facts rather than rederiving under
time pressure. The effective rate always meets or exceeds the nominal rate,
with equality only at m equal to 1. And the whole continuous-compounding limit
is worth very little: for a nominal 6%, moving from annual to monthly buys
0.1678 percentage points and moving from monthly all the way to continuous
buys a further 0.0159.

| Compounding of a nominal 6% | m | Periodic rate | Effective annual rate |
|---|---|---|---|
| Annually | 1 | 6.000000% | 6.000000% |
| Semiannually | 2 | 3.000000% | 6.090000% |
| Quarterly | 4 | 1.500000% | 6.136355% |
| Monthly | 12 | 0.500000% | 6.167781% |
| Continuously | unbounded | infinitesimal | 6.183655% |

## 7.4 Worked Example — the same deposit reached two ways

**Given**: 15,000 deposited at a nominal 6% compounded quarterly, held seven
years.
**Find**: the ending balance, computed both in quarterly periods and in annual
periods.

**Quarterly.** The periodic rate is 0.06/4 = 1.5% and seven years is 28
quarters:

$$F = 15000(1.015)^{28} = 15000 \\times 1.51722218 = 22758.33$$

**Annually.** The effective annual rate is

$$i_{\\mathrm{eff}} = (1.015)^{4} - 1 = 0.06136355$$

and seven annual periods at that rate give 22,758.33 again — identical to the
last cent, because they are the same 28 multiplications regrouped. A ledger
that steps through all 28 quarters lands on the same figure, which is the
check worth running once so that you trust the shortcut forever after.

The practical rule this establishes: **work in whatever period the cash flows
occupy.** If deposits are quarterly, use the quarterly rate. If deposits are
annual while the bank compounds monthly, convert to an effective annual rate
first, because no series factor exists that mixes two period lengths.

## 7.5 Worked Example — running the conversion backwards

**Given**: a lender must advertise an effective annual rate of exactly 10%.
**Find**: the nominal rate it should quote as "compounded monthly".

Set the effective rate equal to the target and solve for the periodic rate:

$$\\left(1 + i_{m}\\right)^{12} - 1 = 0.10 \\qquad \\Longrightarrow \\qquad i_{m} = (1.10)^{1/12} - 1 = 0.00797414$$

$$r = 12\\,i_{m} = 12 \\times 0.00797414 = 0.09568968$$

The quoted nominal rate is **9.5690%**. Substituting back, (1.00797414) raised
to the twelfth is 1.100000 exactly, which is the check.

**The trap.** Quoting 10% as the nominal monthly-compounded rate produces an
effective 10.4713%, which overstates the true cost by almost half a percentage
point. Nominal and effective are never interchangeable, and the gap widens with
both the rate and the compounding frequency.

## 7.6 Worked Example — continuous compounding end to end

**Given**: 25,000 at 5.5% compounded continuously for twelve years.
**Find**: the ending balance and the equivalent effective annual rate.

$$F = 25000\\,e^{(0.055)(12)} = 25000\\,e^{0.66} = 25000 \\times 1.93479233 = 48369.81$$

$$i_{\\mathrm{eff}} = e^{0.055} - 1 = 0.05654061$$

Twelve years at 5.654061% per year returns the same 48,369.81, as it must.
For comparison, the same nominal 5.5% compounded monthly reaches only
48,296.93 — a difference of 72.88 on a 48,000 balance, or about 0.15%. That
number is the honest measure of how much continuous compounding is worth, and
it explains why the convention survives in analysis but rarely in contracts.

## 7.7 Practice Problems — single amounts and rate conversion

**Problem 7A.** Deposit 5,000 at 9% compounded annually for seven years. Find
the balance.

*Answer.* (F/P, 9%, 7) = (1.09)^7 = 1.82803912, so
5000 × 1.82803912 = **9,140.20**. **The trap** is treating the 9% as simple
interest, giving 5000[1 + 0.09(7)] = 8,150.00 — short by 990.20, and the size
of that shortfall is exactly the interest-on-interest the naive route ignores.

**Problem 7B.** A nominal 8% is compounded daily. Find the effective annual
rate, and compare it with continuous compounding.

*Answer.* (1 + 0.08/365) raised to the 365th, minus 1, gives **8.327757%**;
continuous gives e^0.08 − 1 = **8.328707%**. The two differ by 0.00095
percentage points. Daily compounding is continuous compounding for every
practical purpose, which is why exam problems that offer both as options are
testing recognition rather than calculation.

**Problem 7C.** An investment triples in eleven years. Find the annual rate.

*Answer.* Solve the rate form directly:

$$i = 3^{1/11} - 1 = 0.10503$$

so the rate is **10.503%**. **The trap** is dividing: a naive 200% total gain
over eleven years reads as 18.18% a year, which double-counts every year of
compounding and is wrong by nearly eight percentage points.`,
      examTip: 'Read the compounding phrase before the numbers. "Nominal" is an instruction about what to charge each sub-period; "effective" is what actually accrues over a year. The conversion is one keystroke, and the exam reliably offers both the converted and the unconverted answer as options.',
      importantNote: 'Continuous compounding is the m going to infinity limit of the discrete formula, not a separate theory. If you can evaluate (1 + r/m)^m you can always sanity-check an e^r answer by taking m large, and the two should agree to three or four figures by m = 365.',
    },
    {
      id: 'tvm-uniform-series-derived',
      title: '8. The Uniform Series Factors, Derived as Geometric Series',
      content: `## 8.1 Deriving (F/A) instead of quoting it

A uniform series is n equal end-of-period amounts A. Carry each one forward to
the end of period n with the single-payment factor. The payment at the end of
period 1 has n − 1 periods left to grow; the payment at the end of period n has
none. The future worth is therefore a sum of powers:

$$F = A\\left[(1+i)^{n-1} + (1+i)^{n-2} + \\cdots + (1+i)^{1} + 1\\right] = A\\sum_{k=0}^{n-1}(1+i)^{k}$$

That is a geometric series with ratio (1+i), and the standard trick collapses
it. Multiply the whole sum by (1+i) and subtract the original:

$$(1+i)\\sum_{k=0}^{n-1}(1+i)^{k} - \\sum_{k=0}^{n-1}(1+i)^{k} = (1+i)^{n} - 1$$

The left side is i times the sum, because every interior term cancels. Divide:

$$\\sum_{k=0}^{n-1}(1+i)^{k} = \\frac{(1+i)^{n} - 1}{i} \\qquad \\Longrightarrow \\qquad (F/A,\\, i,\\, n) = \\frac{(1+i)^{n} - 1}{i}$$

Nothing was assumed except that (1+i) is not 1. When i is zero the factor
degenerates to n, which is the sensible answer — with no interest, n deposits
of A are worth nA.

## 8.2 The other three follow immediately

Discount that future worth back n periods and you have the present-worth
version:

$$(P/A,\\, i,\\, n) = (F/A,\\, i,\\, n)(P/F,\\, i,\\, n) = \\frac{(1+i)^{n} - 1}{i(1+i)^{n}}$$

An equivalent and often faster form drops out by dividing numerator and
denominator by the same power:

$$(P/A,\\, i,\\, n) = \\frac{1 - (1+i)^{-n}}{i}$$

Invert each of the two and the remaining pair appears without any new work:

$$(A/P,\\, i,\\, n) = \\frac{i(1+i)^{n}}{(1+i)^{n} - 1} \\qquad (A/F,\\, i,\\, n) = \\frac{i}{(1+i)^{n} - 1}$$

The identity that makes these self-checking also drops out of the algebra
rather than having to be memorised:

$$(A/P,\\, i,\\, n) - (A/F,\\, i,\\, n) = \\frac{i(1+i)^{n} - i}{(1+i)^{n} - 1} = \\frac{i\\left[(1+i)^{n} - 1\\right]}{(1+i)^{n} - 1} = i$$

In words: a loan payment is the sinking-fund deposit that retires the principal
plus the interest on the whole principal. That reading is worth having, because
it turns an abstract identity into a sentence you can defend.

![The uniform-series present-worth factor (P/A, i, n) against the number of payments at 5%, 10% and 15%, each computed from the closed form. Every curve is bounded above by the perpetuity ceiling 1/i, drawn as a dashed asymptote at 20, 10 and 6.667; at 10% a thirty-year series already captures 94.3% of what an endless one would be worth.](/courses/fe-ee/figures/econ2-series-saturation.svg)

The saturation the figure shows is worth absorbing. Because each additional
payment is discounted harder than the last, (P/A) climbs toward a ceiling of
1/i and never reaches it. At 10%, thirty years of payments are worth 9.4269
times the annual amount and an eternity of them is worth 10. That single fact
explains why long-lived infrastructure is evaluated with capitalized cost, why
the difference between a 40-year and a 50-year assumption rarely changes a
decision, and why perpetuity formulas are respectable approximations rather
than mathematical curiosities.

## 8.3 Worked Example — a sinking fund, checked against a passbook

**Given**: a plant must accumulate 250,000 over fifteen years to replace a
transformer bank. Deposits are equal, made at the end of each year, and earn
6%.
**Find**: the deposit, the total deposited, and the interest earned.

$$(A/F,\\, 6\\%,\\, 15) = \\frac{0.06}{(1.06)^{15} - 1} = \\frac{0.06}{1.39655819} = 0.04296276$$

$$A = 250000 \\times 0.04296276 = 10740.69$$

$$15 \\times 10740.69 = 161110.35 \\qquad 250000 - 161110.35 = 88889.65$$

So the plant deposits **10,740.69 a year**, puts in 161,110.35 of its own money
and lets the account earn the remaining **88,889.65**. Roughly 36% of the
target is supplied by interest, which is the argument for starting a sinking
fund early rather than large.

**Independent check by ledger.** Start at zero, and for fifteen years multiply
the balance by 1.06 and add 10,740.69:

| Year | Balance after the deposit |
|---|---|
| 1 | 10,740.69 |
| 2 | 22,125.82 |
| 3 | 34,194.06 |
| 14 | 225,716.33 |
| 15 | 250,000.00 |

Landing on 250,000.00 is not a coincidence and not a rounding accident; it is
the factor doing exactly what it claims. Any sinking-fund answer can be checked
this way in under a minute on a calculator with a memory register, and a
closing balance that misses by more than a few cents means the wrong factor was
used.

## 8.4 Worked Example — a thirty-year mortgage, and where the money goes

**Given**: 320,000 borrowed at a nominal 5.4% compounded monthly, repaid in 360
equal monthly payments.
**Find**: the payment, the total interest, the split of the first payment, and
the balance after ten years.

**Match the period first.** Payments are monthly, so work monthly:
i = 0.054/12 = 0.45% per month, n = 360.

$$(A/P,\\, 0.45\\%,\\, 360) = \\frac{0.0045(1.0045)^{360}}{(1.0045)^{360} - 1} = \\frac{0.0045 \\times 5.03476020}{4.03476020} = 0.00561531$$

$$A = 320000 \\times 0.00561531 = 1796.90$$

$$360 \\times 1796.90 = 646884.00 \\qquad 646884.00 - 320000 = 326884.00$$

The payment is **1,796.90 a month** and the borrower pays **326,884.00** in
interest — slightly more than the house. The first payment splits as

$$320000 \\times 0.0045 = 1440.00 \\qquad 1796.90 - 1440.00 = 356.90$$

so 1,440.00 is interest and only **356.90** touches the principal. The
remaining balance after any number of payments has its own closed form, the
original balance grown forward less the payments accumulated forward:

$$B_{m} = P(1+i)^{m} - A(F/A,\\, i,\\, m)$$

After 120 payments that gives **263,377.47**, meaning ten years of payments —
215,628 of cash — has retired under 57,000 of debt. A month-by-month ledger of
120 rows reproduces the same balance, which is how the closed form was checked
here.

| Payments made | Years elapsed | Balance remaining |
|---|---|---|
| 60 | 5 | 295,479.28 |
| 120 | 10 | 263,377.47 |
| 180 | 15 | 221,350.69 |
| 240 | 20 | 166,330.44 |
| 300 | 25 | 94,299.51 |
| 360 | 30 | 0.00 |

Those balances are computed from the payment as it would actually be billed,
rounded to 1,796.90. Carrying that rounded figure through all 360 periods
overshoots by 1.31, which is why a lender trims the final instalment; it is
also a reminder that a schedule built on a rounded payment does not close on
zero by itself.

**The trap.** Converting to an effective annual rate of 5.535675% and applying
(A/P) over thirty years gives 22,104.55 a year, which is a perfectly correct
answer to a different question — annual payments. It is not twelve times the
monthly payment, and it is not what the problem asked. Convert the rate only
when the cash flows force you to.

## 8.5 Worked Example — payments in advance

**Given**: twelve deposits of 2,000, made at the BEGINNING of each year, earning
5%. **Find**: the balance immediately after the twelfth year.

An annuity due is an ordinary annuity whose every payment sits one period
earlier, so every payment earns one extra period of interest:

$$F_{\\mathrm{due}} = A(F/A,\\, i,\\, n)(1+i)$$

$$(F/A,\\, 5\\%,\\, 12) = \\frac{(1.05)^{12} - 1}{0.05} = 15.9171265$$

$$2000 \\times 15.9171265 = 31834.25 \\qquad 31834.2530 \\times 1.05 = 33425.97$$

The advance schedule is worth **33,425.97** against 31,834.25 for the ordinary
one — an advantage of 1,591.71, which is exactly 5% of the ordinary total, as
the derivation promised. Summing the twelve deposits individually, each carried
forward by its own exponent, confirms 33,425.97 to the cent.

Leases, insurance premiums and rent are annuity-due problems. The exam signals
them with the words "beginning of each period", "payable in advance", or a
first payment stated as occurring at time zero, and the fix is always the same
single multiplication by (1+i).`,
      examTip: 'Every series factor is a geometric sum, so if you forget one you can rebuild it in twenty seconds: write the sum, multiply by (1+i), subtract, and divide by i. That recovery is faster and safer than hunting for the right row of a table under time pressure.',
      importantNote: 'The identity (A/P, i, n) = (A/F, i, n) + i is free error-checking that costs one subtraction. If a factor pair you have written down fails it, you have mis-keyed an exponent or read the wrong column, and you have caught it before it propagates.',
    },
    {
      id: 'tvm-gradients-derived',
      title: '9. Gradient Series, Derived From Their Definitions',
      content: `## 9.1 The arithmetic gradient factor, derived

An arithmetic gradient is a series that is zero in year 1, G in year 2, 2G in
year 3, and (n−1)G in year n. Note the zero: the gradient is the INCREASE, not
the amount. Its present worth is a sum of discounted multiples:

$$P = G\\sum_{k=1}^{n}(k-1)(1+i)^{-k}$$

Write the sum out and apply the same multiply-and-subtract manoeuvre used for
the uniform series. Multiplying by (1+i) shifts every exponent by one, and
subtracting leaves a plain uniform series minus a lump at the end:

$$i\\sum_{k=1}^{n}(k-1)(1+i)^{-k} = \\sum_{k=1}^{n}(1+i)^{-k} - n(1+i)^{-n}$$

The remaining sum is (P/A), which is already known, so

$$(P/G,\\, i,\\, n) = \\frac{1}{i}\\left[\\frac{1 - (1+i)^{-n}}{i} - n(1+i)^{-n}\\right] = \\frac{(1+i)^{n} - i n - 1}{i^{2}(1+i)^{n}}$$

Converting that present worth into an equivalent level amount gives the
gradient-to-annual factor:

$$(A/G,\\, i,\\, n) = (P/G,\\, i,\\, n)(A/P,\\, i,\\, n) = \\frac{1}{i} - \\frac{n}{(1+i)^{n} - 1}$$

A gradient series is therefore always handled as a SUM of two pieces: a level
part carrying the year-1 amount, and a gradient part carrying the increases.

$$P = A_{1}(P/A,\\, i,\\, n) \\pm G(P/G,\\, i,\\, n) \\qquad A_{\\mathrm{eq}} = A_{1} \\pm G(A/G,\\, i,\\, n)$$

The plus-or-minus is not decoration. Costs that fall — a warranty that covers
less each year, a subsidy that tapers — are handled with the same factors and a
minus sign, and the exam likes declining series precisely because the sign is
where people slip.

![Three eight-year series that all begin at 6,000: a level series, an arithmetic gradient adding 600 a year, and a geometric gradient growing 5% a year, drawn as the actual annual amounts. All three coincide in year 1, which is the visual statement that an arithmetic gradient contributes nothing in its first year; by year 8 the arithmetic series reaches 10,200 and the geometric only 8,442.60.](/courses/fe-ee/figures/econ2-gradient-shapes.svg)

## 9.2 Worked Example — a declining maintenance series

**Given**: a subsidised service contract pays 9,000 in year 1 and 750 less each
year thereafter, for seven years. The rate is 7%.
**Find**: the present worth and the equivalent level annual amount.

**Step 1 — write out the actual amounts.** 9,000; 8,250; 7,500; 6,750; 6,000;
5,250; 4,500. Seven terms, six decrements, last term still positive. Doing
this before reaching for a factor is what prevents the off-by-one.

**Step 2 — evaluate the two factors.**

$$(P/A,\\, 7\\%,\\, 7) = \\frac{1 - (1.07)^{-7}}{0.07} = 5.3892894$$

$$(P/G,\\, 7\\%,\\, 7) = \\frac{(1.07)^{7} - 0.07(7) - 1}{(0.07)^{2}(1.07)^{7}} = 14.7148744$$

**Step 3 — combine with a minus sign, because the series declines.**

$$9000 \\times 5.3892894 = 48503.60 \\qquad 750 \\times 14.7148744 = 11036.16$$

$$48503.6046 - 11036.1558 = 37467.4488$$

The present worth is **37,467.45**.

**Step 4 — check by the annual route.**

$$(A/G,\\, 7\\%,\\, 7) = \\frac{1}{0.07} - \\frac{7}{(1.07)^{7} - 1} = 2.7303923$$

$$750 \\times 2.7303923 = 2047.79 \\qquad 9000 - 2047.79 = 6952.21$$

$$6952.2058 \\times 5.3892894 = 37467.45$$

The level equivalent is 6,952.21 a year, and multiplying it by (P/A) returns
the same present worth. **Third check**: discounting the seven stated amounts
one at a time gives 37,467.4488 as well.

| Year | Amount | Present worth of that amount at 7% |
|---|---|---|
| 1 | 9,000 | 8,411.2150 |
| 2 | 8,250 | 7,205.8695 |
| 3 | 7,500 | 6,122.2341 |
| 4 | 6,750 | 5,149.5427 |
| 5 | 6,000 | 4,277.9171 |
| 6 | 5,250 | 3,498.2967 |
| 7 | 4,500 | 2,802.3738 |
| Total | 47,250 | 37,467.4489 |

**The trap.** Start the decrement in year 1 — that is, take the amounts as
8,250 down to 3,750 — and the present worth falls to 33,425.48, low by more
than 4,000. The gradient's first contribution is in year 2. Always.

## 9.3 The geometric gradient, derived

When a series grows by a fixed PERCENTAGE g rather than a fixed amount, the
year-k cash flow is A_1 multiplied by (1+g) k−1 times. Its present worth is
another geometric sum, this time with ratio (1+g)/(1+i):

$$P = \\sum_{k=1}^{n} A_{1}(1+g)^{k-1}(1+i)^{-k} = \\frac{A_{1}}{1+g}\\sum_{k=1}^{n}\\left(\\frac{1+g}{1+i}\\right)^{k}$$

Summing the finite geometric series and simplifying gives the form the exam
expects:

$$P = A_{1}\\,\\frac{1 - (1+g)^{n}(1+i)^{-n}}{i - g} \\qquad (i \\neq g)$$

The restriction is real: at i = g the ratio is exactly 1, every term of the sum
is identical, and the closed form divides by zero. Take the limit instead —
each of the n terms equals A_1/(1+i) — and the answer is embarrassingly simple:

$$P = \\frac{n A_{1}}{1+i} \\qquad (i = g)$$

## 9.4 Worked Example — an escalating labour contract

**Given**: labour costs 24,000 in year 1 and escalates 5% a year for fifteen
years. The discount rate is 11%.
**Find**: the present worth.

$$\\left(\\frac{1.05}{1.11}\\right)^{15} = 0.43450503$$

$$P = 24000 \\times \\frac{1 - 0.43450503}{0.11 - 0.05} = 24000 \\times 0.56549497/0.06 = 226197.99$$

The present worth is **226,197.99**. Summing all fifteen escalating amounts
individually confirms it to the cent.

| Year | Cash flow | Present worth at 11% |
|---|---|---|
| 1 | 24,000.00 | 21,621.62 |
| 2 | 25,200.00 | 20,452.89 |
| 3 | 26,460.00 | 19,347.32 |
| 14 | 45,255.58 | 10,499.06 |
| 15 | 47,518.36 | 9,931.54 |

**The trap.** Subtracting percentage points as though they were the numbers
themselves — writing 11 − 5 = 6 in the denominator instead of 0.06 — divides
the answer by 100 and yields 2,261.98. It is a distinctive wrong answer and it
appears on exams for exactly that reason.

## 9.5 Worked Example — the case the formula cannot handle

**Given**: the same 24,000 escalating at 11% a year for fifteen years, now
discounted at 11%.
**Find**: the present worth.

Growth and discounting cancel term by term, so every year contributes the same
present worth of 24,000/1.11:

$$P = \\frac{15 \\times 24000}{1.11} = 324324.32$$

The answer is **324,324.32**, confirmed term by term. Note what it is not: it
is not 15 × 24,000 = 360,000, because the first payment still arrives a year
away and must still be discounted once. That one discounting is the entire
difference between the right answer and the tempting one, and it is worth
360,000 − 324,324.32 = 35,675.68.

## 9.6 Practice Problems — gradients

**Problem 9A.** Operating cost is 4,000 in year 1 and rises 600 a year for ten
years. At 9%, find the present worth.

*Answer.* (P/A, 9%, 10) = 6.4176577 and (P/G, 9%, 10) = 24.3727737, so

$$4000 \\times 6.4176577 = 25670.63 \\qquad 600 \\times 24.3727737 = 14623.66$$

$$25670.63 + 14623.66 = 40294.29$$

The present worth is **40,294.29**, matching a year-by-year sum. **The trap** is
averaging the series into a level 4,600 a year, which gives
4600 × 6.4176577 = 29,521.23 — low by 10,773, because averaging a rising series
throws away the fact that the large amounts are the ones being discounted
least aggressively relative to their size.

**Problem 9B.** A twelve-year royalty starts at 18,000 and grows 6% a year. The
discount rate is also 6%. Find the present worth.

*Answer.* This is the degenerate case, so use the limit form:

$$P = \\frac{12 \\times 18000}{1.06} = 203773.58$$

The present worth is **203,773.58**. **The trap** is either dividing by zero and
concluding the problem is defective, or reporting the undiscounted
12 × 18,000 = 216,000. The gap between the trap and the answer, 12,226.42, is
precisely one year of discounting on the whole stream.`,
      examTip: 'Write out the first three cash flows of any gradient before choosing a factor. An arithmetic gradient reads 0, G, 2G and a geometric one reads A, A(1+g), A(1+g)^2; if what you wrote does not match the series in the problem, you need a shift, not a different factor.',
      importantNote: 'The geometric gradient formula divides by i minus g, so it fails exactly when growth equals the discount rate. That case has its own closed form, P = nA1/(1+i), and it is on the exam far more often than its rarity in practice would suggest.',
    },
    {
      id: 'tvm-deferred-perpetuity-equivalence',
      title: '10. Deferred Series, Perpetuities, and Equivalence Proved Three Ways',
      content: `## 10.1 Deferred annuities: two factors, one timing rule

A deferred annuity is a uniform series whose first payment arrives later than
the end of period 1. The mechanics are two steps and the entire difficulty is
in the exponent of the second.

Apply (P/A) first. It does not produce a value at time zero; it produces a
value **one period before the first payment**. If the first payment lands at
the end of period d+1, then (P/A) lands the value at the end of period d, and
that lump must then be brought back d periods:

$$P_{0} = A\\,(P/A,\\, i,\\, n)\\,(P/F,\\, i,\\, d)$$

An equivalent route avoids the timing question altogether by subtracting one
uniform series from another:

$$P_{0} = A\\left[(P/A,\\, i,\\, d+n) - (P/A,\\, i,\\, d)\\right]$$

Both are correct and they agree exactly. The second is slower but immune to the
off-by-one, so it is the one to use when the deferral period is stated
ambiguously.

## 10.2 Worked Example — a deferred annuity, both ways

**Given**: ten annual payments of 6,000, the first at the END of year 5 and the
last at the end of year 14. The rate is 8%.
**Find**: the present worth at time zero.

**Route 1 — factor pair.** Ten payments starting at the end of year 5 means
(P/A) places its answer at the end of year 4, so d = 4:

$$(P/A,\\, 8\\%,\\, 10) = 6.7100814 \\qquad (P/F,\\, 8\\%,\\, 4) = 0.7350299$$

$$6000 \\times 6.7100814 = 40260.49$$

$$40260.4884 \\times 0.7350299 = 29592.66$$

**Route 2 — difference of two series.** (P/A, 8%, 14) = 8.2442370 and
(P/A, 8%, 4) = 3.3121268, so the present worth is
6,000(8.2442370 − 3.3121268) = **29,592.66**. Identical, as promised, and a
term-by-term discount of the ten actual payments gives 29,592.66 as well.

**The trap.** Discounting five periods instead of four — reasoning that the
first payment is in year 5, so discount by 5 — gives 27,400.61, low by
2,192.05. The rule to hold onto: **(P/A) reaches back exactly one period before
the first payment, never to time zero by itself.**

## 10.3 Perpetuities, derived as a limit

Let n grow without bound in the uniform-series present-worth factor. The term
(1+i)^(−n) vanishes for any positive i, and what remains is one division:

$$\\lim_{n \\to \\infty}(P/A,\\, i,\\, n) = \\lim_{n \\to \\infty}\\frac{1 - (1+i)^{-n}}{i} = \\frac{1}{i} \\qquad \\Longrightarrow \\qquad P = \\frac{A}{i}$$

This is capitalized cost: the endowment whose interest alone funds the
obligation forever, leaving the principal untouched. The convergence is fast
enough to be useful as an approximation long before "forever" arrives.

| Number of payments of 45,000 at 4.5% | Present worth |
|---|---|
| 20 | 585,357.14 |
| 50 | 889,290.35 |
| 100 | 987,743.37 |
| 200 | 999,849.78 |
| unbounded | 1,000,000.00 |

Two variants show up often enough to be worth deriving once. A perpetuity that
does not begin until period d+1 is just the perpetuity value discounted back:

$$P_{0} = \\frac{A}{i}(1+i)^{-d}$$

And a perpetuity that GROWS at a rate g below i is the geometric formula with
n unbounded, since the ratio (1+g)/(1+i) is then less than 1 and its powers
vanish:

$$P = \\frac{A_{1}}{i - g} \\qquad (g < i)$$

## 10.4 Worked Example — an endowment, immediate, deferred and growing

**Given**: a scholarship pays 45,000 a year forever. The fund earns 4.5%.
**Find**: (a) the endowment required if payments start at the end of year 1;
(b) the endowment required today if the first payment is at the end of year 11;
(c) the endowment required if instead the award is 30,000 growing 2% a year
forever and the fund earns 7%.

**(a)** Straight capitalized cost:

$$P = \\frac{45000}{0.045} = 1000000.00$$

**(b)** The same perpetuity, seen from ten years earlier:

$$(P/F,\\, 4.5\\%,\\, 10) = (1.045)^{-10} = 0.64392768$$

$$1000000 \\times 0.64392768 = 643927.68$$

Deferring the first award by ten years cuts the required gift by more than a
third, from 1,000,000 to **643,927.68**. Summing the actual tail of payments
from year 11 outward confirms that figure.

**(c)** The growing perpetuity:

$$P = \\frac{30000}{0.07 - 0.02} = 600000.00$$

**The trap** in part (c) is using 30,000/0.07 = 428,571, which funds a level
award and leaves the scholarship losing purchasing power every year. The extra
171,429 is the price of the escalation clause, and the formula makes that price
explicit.

## 10.5 Equivalence, demonstrated at three different dates

Equivalence is the claim that a set of cash flows has ONE worth, and that the
date you choose to measure it changes the number but not the conclusion. It is
worth proving to yourself once, because every comparison method in the next
chapter rests on it.

**The set**: 20,000 paid out at time zero; 7,000 received at the end of year 2;
9,000 at the end of year 5; 12,000 at the end of year 8. The rate is 6%.

**Measured at time zero.** Discount each flow to now:

$$7000 \\times 0.88999644 = 6229.98 \\qquad 9000 \\times 0.74725817 = 6725.32$$

$$12000 \\times 0.62741237 = 7528.95$$

$$-20000 + 6229.98 + 6725.32 + 7528.95 = 484.25$$

**Measured at the end of year 5.** Now the first two flows are carried forward
and the last is brought back:

$$-20000 \\times 1.33822558 = -26764.51 \\qquad 7000 \\times 1.19101600 = 8337.11$$

$$12000 \\times 0.83961928 = 10075.43$$

$$-26764.51 + 8337.11 + 9000 + 10075.43 = 648.03$$

**Measured at the end of year 8.** Everything is carried forward:

$$-20000 \\times 1.59384807 = -31876.96 \\qquad 7000 \\times 1.41851911 = 9929.63$$

$$9000 \\times 1.19101600 = 10719.14$$

$$-31876.96 + 9929.63 + 10719.14 + 12000 = 771.81$$

**The three answers are the same answer.** Discount the year-5 figure back five
periods and the year-8 figure back eight:

$$648.03 \\times 0.74725817 = 484.25 \\qquad 771.82 \\times 0.62741237 = 484.25$$

| Valuation date | Worth of the whole set | Discounted to time zero |
|---|---|---|
| End of year 0 | 484.25 | 484.25 |
| End of year 5 | 648.03 | 484.25 |
| End of year 8 | 771.82 | 484.25 |

![The same four cash flows shown twice: the upper panel is the cash-flow diagram, with 20,000 leaving at time zero and 7,000, 9,000 and 12,000 arriving at years 2, 5 and 8; the lower panel plots the worth of the whole set measured at every date, W(t) = PW(1.06)^t, marked at 484.25, 648.03 and 771.82. One quantity, three vantage points, one conclusion.](/courses/fe-ee/figures/econ2-equivalence-three-dates.svg)

Since all three are positive, the project clears 6% no matter where you stand
to look at it, and only by a little — a present worth of 484.25 against a
20,000 outlay corresponds to an internal rate of return of 6.4910%. That
narrowness is itself informative, and it is the subject the next chapter opens
with.

## 10.6 Practice Problems — deferrals, perpetuities and equivalence

**Problem 10A.** A trust must pay 8,400 a year forever starting at the end of
year 1, and must also fund a 60,000 refurbishment every five years, the first
at the end of year 5. The fund earns 7%. Find the capitalized cost.

*Answer.* The level payment capitalizes directly: 8,400/0.07 = 120,000.00. The
refurbishment recurs every five years, so convert it to an annual equivalent
FIRST with a sinking fund:

$$(A/F,\\, 7\\%,\\, 5) = \\frac{0.07}{(1.07)^{5} - 1} = 0.17389069$$

$$60000 \\times 0.17389069 = 10433.44$$

$$\\frac{8400 + 10433.44}{0.07} = 269049.14$$

The capitalized cost is **269,049.14**. **The trap** is dividing the 60,000 by
0.07 as though it arrived every year, which gives 857,142.86 for that component
alone and a total of 977,142.86 — nearly four times too large. The formula
P = A/i requires A in every single period.

**Problem 10B.** A payment of 15,000 falls due at the end of year 3. At 5%,
what single payment at the end of year 7 is equivalent?

*Answer.* Four periods of growth, not four of discounting:

$$15000 \\times (1.05)^{4} = 15000 \\times 1.21550625 = 18232.59$$

The equivalent amount is **18,232.59**. **The trap** is discounting instead of
compounding, giving 12,340.54; moving money LATER always makes the equivalent
amount larger, and the direction of the exponent is the only thing that decides
it.

**Problem 10C.** Twelve payments of 3,000 are made at the end of each year at
6%. Find the accumulated amount, then find it again if the payments are made at
the beginning of each year.

*Answer.* (F/A, 6%, 25) is not what is wanted here; the correct factor is over
twelve periods. Working from the closed form,
(F/A, 6%, 12) = 16.8699412, so the ordinary annuity accumulates
3,000 × 16.8699412 = **50,609.82**. In advance, every deposit earns one more
period: 50,609.82 × 1.06 = **53,646.41**. **The trap** is applying the (1+i)
correction to the wrong convention, which turns an advantage of 3,036.59 into a
penalty of the same size.`,
      examTip: 'For a deferred series, name the period in which the FIRST payment falls, subtract one, and that is the exponent on (P/F). Writing that sentence down before computing is worth more than any mnemonic, because the off-by-one is the only real difficulty deferred annuities contain.',
      importantNote: 'Equivalence means the comparison date is arbitrary, not that the number is. Present worth, the worth at year 5 and the worth at year 8 are all different numbers describing one quantity, and any of them ranks alternatives identically as long as EVERY alternative is measured at the SAME date.',
    },
    {
      id: 'tvm-problem-sets',
      title: '11. Problem Sets: Factors End to End',
      content: `## 11.1 Problem Set A — factor selection and rate handling

Work each one from the closed forms rather than from a table. Answers follow
each problem, with the distractor named and the wrong number it produces.

**A1.** A machine costs 45,000 and will be paid for in twenty equal annual
instalments at 7%. Find the payment.

*Answer.* Present amount, annual unknown, so capital recovery:

$$(A/P,\\, 7\\%,\\, 20) = \\frac{0.07(1.07)^{20}}{(1.07)^{20} - 1} = 0.09439293$$

$$45000 \\times 0.09439293 = 4247.68$$

The payment is **4,247.68 a year**. **The trap** is the sinking-fund factor,
(A/F, 7%, 20) = 0.02439293, which gives 1,097.68. Notice that the two factors
differ by exactly 0.07 — the identity derived in Section 8 — so the trap answer
is short by exactly one year's interest on the whole 45,000, or 3,150.00.

**A2.** Deposit 3,000 at the end of each year for twenty-five years at 6%. Find
the accumulated amount, and then find it for deposits made in advance.

*Answer.* (F/A, 6%, 25) = 54.8645120, so

$$3000 \\times 54.8645120 = 164593.54$$

$$164593.54 \\times 1.06 = 174469.15$$

Ordinary: **164,593.54**. In advance: **174,469.15**. **The trap** is applying
(P/A) instead of (F/A) — a present-worth factor answering a future-worth
question — which gives 3,000 × 12.78335616 = 38,350.07 and is low by a factor
of more than four.

**A3.** A bond will pay 40,000 at the end of year 10. At 8%, what is it worth
today? What rate would make it worth 20,000 today?

*Answer.* The present worth is 40,000(1.08)^(−10) = 40,000 × 0.4631935 =
**18,527.74**. For the second part, solve the rate form:

$$i = \\left(\\frac{40000}{20000}\\right)^{1/10} - 1 = 2^{0.1} - 1 = 0.07177$$

so **7.177%**. **The trap** is reading the second part as "the rate that halves
the value", reaching for a doubling shortcut, and answering 7.2% by the rule of
72 — which is right to two figures here by luck and would not be at 4% or 15%.

**A4.** A nominal 8% is compounded quarterly. Deposits of 1,000 are made
QUARTERLY for six years. Find the accumulated amount.

*Answer.* Cash flows are quarterly, so no conversion is needed at all: the
periodic rate is 2% and n is 24.

$$(F/A,\\, 2\\%,\\, 24) = \\frac{(1.02)^{24} - 1}{0.02} = 30.4218625$$

$$1000 \\times 30.4218625 = 30421.86$$

The accumulation is **30,421.86**. **The trap** is converting to an effective
annual 8.243216% and using n = 6 with 4,000 a year, which gives
4,000 × 7.3810664 = 29,524.27. That answer would be right if the 4,000 arrived
in one lump at each year end; it is short by 897.59 because it denies the first
three quarterly deposits of every year their interest.

**A5.** Maintenance runs 2,500 in year 1 and increases 400 a year for twelve
years. At 10%, find the equivalent level annual cost.

*Answer.* Use the gradient-to-annual factor directly:

$$(A/G,\\, 10\\%,\\, 12) = \\frac{1}{0.10} - \\frac{12}{(1.10)^{12} - 1} = 4.3884$$

$$2500 + 400 \\times 4.3884 = 4255.36$$

The level equivalent is **4,255.36 a year**. **The trap** is averaging the first
and last amounts — 2,500 and 6,900 — to get 4,700, which ignores discounting
entirely and overstates the cost by 444.64.

**A6.** An investment promises 1,200 a year forever, starting at the end of
year 1. At 6%, what is it worth? What if the first payment is at the end of
year 4 instead?

*Answer.* Immediate: 1,200/0.06 = **20,000.00**. Deferred by three years:
20,000(1.06)^(−3) = 20,000 × 0.8396193 = **16,792.39**. **The trap** is
discounting by four periods because the first payment is in year 4, giving
15,841.87. A perpetuity's A/i value already sits one period before its first
payment, exactly as (P/A) does.

## 11.2 Problem Set B — mixed and multi-step

**B1.** 12,000 is borrowed at a nominal 12% compounded monthly and repaid in
three equal ANNUAL payments. Find the payment.

*Answer.* The cash flows are annual and the compounding is monthly, so convert
first:

$$i_{\\mathrm{eff}} = (1.01)^{12} - 1 = 0.12682503$$

$$(A/P,\\, 12.682503\\%,\\, 3) = 0.4212406$$

$$12000 \\times 0.4212406 = 5054.89$$

The payment is **5,054.89 a year**. **The trap** is using 12% flat, which gives
(A/P, 12%, 3) = 0.4163490 and a payment of 12,000 × 0.4163490 = 4,996.19 —
short by 58.70 a year, because it silently forgives the intra-year
compounding.

**B2.** An asset earns 7,000 a year for the first five years and 11,000 a year
for the next five. At 9%, find the present worth.

*Answer.* Treat it as a level 7,000 for ten years plus an extra 4,000 for
years 6 through 10:

$$P = 7000(P/A,\\, 9\\%,\\, 10) + 4000(P/A,\\, 9\\%,\\, 5)(P/F,\\, 9\\%,\\, 5)$$

With (P/A, 9%, 10) = 6.4176577, (P/A, 9%, 5) = 3.8896513 and
(P/F, 9%, 5) = 0.6499314:

$$7000 \\times 6.4176577 = 44923.60 \\qquad 4000 \\times 3.8896513 \\times 0.6499314 = 10112.03$$

$$44923.60 + 10112.03 = 55035.63$$

The present worth is **55,035.63**, and a term-by-term discount of all ten
receipts confirms it. **The trap** is handling only the deferred block —
11,000 × 3.8896513 × 0.6499314 = 27,808.07 — and forgetting that years 1
through 5 contribute at all.

**B3.** A fund earns 5%. How much must be on deposit today to withdraw 10,000
at the end of each year for eight years and leave exactly 25,000 in the
account?

*Answer.* Two obligations, added:

$$P = 10000(P/A,\\, 5\\%,\\, 8) + 25000(P/F,\\, 5\\%,\\, 8)$$

$$10000 \\times 6.4632128 = 64632.13 \\qquad 25000 \\times 0.67683936 = 16920.98$$

$$64632.13 + 16920.98 = 81553.11$$

The deposit is **81,553.11**. **The trap** is adding the 25,000 undiscounted,
giving 89,632.13 — an error of 8,079.02, which is precisely the interest the
25,000 earns while it sits there.

**B4.** Inflation runs 3.5% a year and an investor requires a 4% REAL return.
Find the market rate that must be quoted, and the purchasing power of 50,000
received eight years from now.

*Answer.* Rates combine multiplicatively, never by addition:

$$i = (1.04)(1.035) - 1 = 0.0774$$

so **7.74%**, not 7.5%. The purchasing power of the future 50,000, expressed in
today's money, is

$$\\frac{50000}{(1.035)^{8}} = \\frac{50000}{1.31680904} = 37970.58$$

so **37,970.58**. **The trap** on the first part is adding to get 7.50%, which
understates the required return by 0.24 percentage points; on the second it is
discounting at 7.74% rather than at inflation, which answers a different
question entirely and gives 27,539.38.

**B5.** A loan of 60,000 at 8% is repaid in six equal annual payments. Find the
payment, the interest paid in year 1, and the outstanding balance immediately
after the third payment.

*Answer.* (A/P, 8%, 6) = 0.2163154, so the payment is

$$60000 \\times 0.2163154 = 12978.92$$

Year-1 interest is 8% of the opening balance, 60,000 × 0.08 = **4,800.00**. The
balance after any payment is the present worth of the payments that remain, so
after three payments three remain:

$$B_{3} = 12978.92 \\times 2.5770970 = 33447.94$$

The balance is **33,447.94**, and a six-row amortisation ledger reaches the
same figure before closing on zero. **The trap** is halving the loan because
half the payments have been made, giving 30,000 — low by 3,447.94, because the
early payments were mostly interest and retired well under half the
principal.

**B6.** A 30,000 machine is expected to have a market value of 6,000 after
seven years. At 12%, find the equivalent annual cost of ownership.

*Answer.* Capital recovery, in either of its two equivalent forms:

$$CR = -30000(A/P,\\, 12\\%,\\, 7) + 6000(A/F,\\, 12\\%,\\, 7)$$

With (A/P, 12%, 7) = 0.21911774 and (A/F, 12%, 7) = 0.09911774:

$$-30000 \\times 0.21911774 + 6000 \\times 0.09911774 = -5978.83$$

The equivalent annual cost of ownership is **−5,978.83 a year**. The other
legitimate form of capital recovery gives the identical number:

$$-24000 \\times 0.21911774 - 6000 \\times 0.12 = -5978.83$$

and it reads more naturally — you recover the value you actually lose, and you
pay interest on the value still tied up. **The trap** is subtracting the
salvage from the first cost and stopping there, giving −5,258.83 a year and
forgetting the 720.00 of interest on capital not yet released.`,
      examTip: 'When a problem mixes compounding frequency with cash-flow frequency, decide the working period in the first ten seconds and write it at the top of your scratch work. Every subsequent factor must use that period for both i and n, and the majority of lost marks in this section come from a factor whose i and n belong to different clocks.',
      importantNote: 'A loan balance at any moment equals the present worth of the payments that have not yet been made, discounted at the loan rate. That single sentence answers every remaining-balance, refinancing and early-payoff question without building an amortisation table.',
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

**$NPV = -C_{0} + \\sum_{t=1}^{n} B_{t}(1+i)^{-t}$**

Where $C_{0}$ is initial cost, Bₜ is net benefit in year t, and i is discount rate.

- **$NPV > 0$**: project adds value — accept
- **$NPV < 0$**: project destroys value — reject
- **$NPV = 0$**: project breaks even at the discount rate

For mutually exclusive alternatives, choose the one with **highest NPV**.

## 1.2 Internal Rate of Return (IRR)

IRR is the discount rate that makes NPV = 0:

**$0 = -C_{0} + \\sum_{t=1}^{n} B_{t}(1+i^{*})^{-t}$** where $i^{*}$ is the IRR

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
| 10% | 4.3552607 | +21,947.30 |
| 15% | 3.7844827 | +5,965.52 |
| 17% | 3.5891848 | +497.17 |
| 18% | 3.4976026 | −2,067.13 |
| 20% | 3.3255101 | −6,885.72 |

Seven decimals, not six: at 28,000 a year a factor rounded at the sixth place
shifts the net present value by about a cent, and a reader checking the table
on a calculator should land on the printed figure exactly.

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
  21,947.2996 × (A/P, 10%, 6) = 21,947.2996 × 0.2296074 = **+5,039.26 per year**.

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
life. At 6%, (P/A, 6%, 25) = 12.78335616, so:

- PW(benefits) = 460,000 × 12.78335616 = 5,880,343.83
- PW(O&M) = 120,000 × 12.78335616 = 1,534,002.74

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
| X, n = 5 | 0.26379748 | 0.16379748 | −40,000(0.26379748) + 6,000(0.16379748) = −9,569.11 | **−18,569.11** |
| Y, n = 10 | 0.16274539 | 0.06274539 | −65,000(0.16274539) + 10,000(0.06274539) = −9,951.00 | **−15,951.00** |

Machine Y costs **2,618.11 less per year**, so Y wins.

**The long way, as a check.** Over the least common multiple of ten years — X
purchased twice, Y once — the present worths are −114,099.17 for X and
−98,011.97 for Y. Multiply each by (A/P, 10%, 10) = 0.16274539 and you recover
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

The break-even volume is exactly 100,000/7, and carrying that extra digit
matters when it is multiplied back: at 14,285.714 units process 1 costs
50,000 + 8.00(14,285.714) = 164,285.71 and process 2 costs
90,000 + 5.20(14,285.714) = 164,285.71. Identical, as required.

At an expected 20,000 units a year, process 1 costs 210,000 and process 2 costs
194,000, so the capital-heavy process saves **16,000 a year**. Below 14,286
units the ranking reverses.

![Total annual cost of two processes against volume, each line drawn from the stated fixed cost and per-unit variable cost. The lines cross at 14,286 units, where both cost 164,286; above that volume the process with the higher fixed cost and lower slope is the cheaper one.](/courses/fe-ee/figures/econ-breakeven.svg)

The figure is the argument for doing break-even analysis at all. A point
estimate of "20,000 units" makes process 2 look like an easy call worth 16,000
a year. The crossing at 14,286 tells you how much of that comfort is real: a
28.6% shortfall in demand erases the advantage exactly, and anything below that
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
    {
      id: 'ca-three-views',
      title: '6. Present Worth, Annual Worth and Future Worth Are One Comparison',
      content: `## 6.1 Three measures, one ranking, and the proof of it

Candidates treat present worth, annual worth and future worth as three
competing methods. They are not. Each is the same quantity carried to a
different date, and the algebra that connects them is a single multiplication:

$$AW = PW\\,(A/P,\\, i,\\, n) \\qquad FW = PW\\,(F/P,\\, i,\\, n) \\qquad FW = AW\\,(F/A,\\, i,\\, n)$$

Both multipliers are strictly positive for any positive i and n. Multiplying
every alternative's score by the same positive number cannot reorder them, so
**the three measures always agree on the ranking**. Where they differ is in
convenience: annual worth reads naturally when lives differ or when the answer
must be quoted as a budget line; future worth reads naturally for accumulation
problems; present worth reads naturally when a capital budget is being set
today.

Two conditions have to hold before that guarantee applies, and they are exactly
what exam questions attack. Every alternative must be evaluated **at the same
interest rate**, and every alternative must be evaluated **over the same span of
service**. Violate either and the comparison is meaningless no matter which
measure you compute.

## 6.2 Worked Example — three alternatives scored three ways

**Given**, all with twelve-year lives at a 10% MARR:

| Alternative | First cost | Net annual receipt | Salvage at year 12 |
|---|---|---|---|
| M | 120,000 | 26,000 | 15,000 |
| N | 165,000 | 33,500 | 25,000 |
| O | 210,000 | 41,000 | 30,000 |

**Find**: present worth, annual worth and future worth for each, and the
preferred alternative.

The four factors, all at 10% and twelve years, computed from their closed
forms:

$$(P/A) = 6.81369182 \\quad (P/F) = 0.31863082 \\quad (A/P) = 0.14676332 \\quad (F/P) = 3.13842838$$

**Present worth of each**, first cost negative, receipts and salvage positive:

$$-120000 + 26000 \\times 6.81369182 + 15000 \\times 0.31863082 = 61935.45$$

$$-165000 + 33500 \\times 6.81369182 + 25000 \\times 0.31863082 = 71224.45$$

$$-210000 + 41000 \\times 6.81369182 + 30000 \\times 0.31863082 = 78920.29$$

**Annual worth**, obtained by multiplying each present worth by (A/P):

$$61935.4497 \\times 0.14676332 = 9089.85$$

$$71224.4465 \\times 0.14676332 = 10453.14$$

$$78920.2893 \\times 0.14676332 = 11582.60$$

**Future worth**, obtained by multiplying each present worth by (F/P):

$$61935.4497 \\times 3.13842838 = 194379.97$$

$$71224.4465 \\times 3.13842838 = 223532.82$$

$$78920.2893 \\times 3.13842838 = 247685.68$$

| Alternative | Present worth | Annual worth | Future worth | Rank |
|---|---|---|---|---|
| M | 61,935.45 | 9,089.85 | 194,379.97 | 3 |
| N | 71,224.45 | 10,453.14 | 223,532.82 | 2 |
| O | 78,920.29 | 11,582.60 | 247,685.68 | 1 |

**Alternative O wins under all three measures**, as it must. Notice also that
the annual worth can be built directly from the cash flows without computing a
present worth at all:

$$AW_{M} = -120000 \\times 0.14676332 + 26000 + 15000 \\times 0.04676332 = 9089.85$$

That direct route is the faster one in practice, and it is the route to use
when a problem asks only for an annual figure.

![Equivalent worth of the three alternatives measured at every date from year 0 to year 12, each curve being that alternative's present worth carried forward at 10%. Alternative O is above N and N above M at every date, which is the geometric statement that present worth, annual worth and future worth cannot disagree about a ranking.](/courses/fe-ee/figures/econ2-pw-aw-fw.svg)

## 6.3 What the ranking does not tell you

O has the highest present worth, so O is preferred — provided the capital is
available and there is nothing better to do with the extra 90,000 that O costs
over M. That proviso is the whole content of the next two sections. Present
worth answers "which of these should we do"; it does not by itself answer "is
the extra spending earning its keep", which is the question an incremental
analysis is built to settle and the question a bare rate of return answers
wrongly.

## 6.4 Practice Problems — the three measures

**Problem 6A.** A project costs 140,000 and returns 31,000 a year for eight
years with no salvage. At an 11% MARR, find the present worth and the rate of
return.

*Answer.* (P/A, 11%, 8) = 5.14612276, so

$$31000 \\times 5.14612276 - 140000 = 19529.81$$

The present worth is **+19,529.81**, so accept. The rate of return solves
(P/A, i, 8) = 140,000/31,000 = 4.516129, which gives **14.8058%** — comfortably
above the 11% hurdle, as the positive present worth already implied. **The
trap** is comparing 19,529.81 against the 140,000 outlay as a percentage and
calling the return 13.95%; a present worth is not a rate, and converting one
into the other requires the whole factor equation, not a division.

**Problem 6B.** The same project, scored as an annual worth instead.

*Answer.* (A/P, 11%, 8) = 0.19432105, so the annual worth is

$$19529.81 \\times 0.19432105 = 3795.05$$

The identical figure comes straight from the cash flows, with no present worth
in between:

$$31000 - 140000 \\times 0.19432105 = 3795.05$$

The annual worth is **+3,795.05 a year**. **The trap** is to divide the present
worth by eight, giving 2,441.23, which ignores the interest the recovered
capital earns along the way and understates the annual benefit by more than a
third.`,
      examTip: 'If a question gives every alternative the same life and the same rate, compute whichever of PW, AW or FW is fastest — they cannot disagree. Reach for annual worth specifically when lives differ, because it is the only one of the three that handles unequal lives without extra construction.',
      importantNote: 'AW = PW(A/P) and FW = PW(F/P) are multiplications by strictly positive numbers, so ranking is preserved exactly. Any exam answer claiming that PW and AW prefer different alternatives with equal lives and equal rates contains an arithmetic error somewhere.',
    },
    {
      id: 'ca-unequal-lives-study-period',
      title: '7. Unequal Lives: Least Common Multiple and Study Period, Both Worked',
      content: `## 7.1 Why lives must be reconciled at all

Present worth measures the value of a service over the period it is provided.
An alternative that provides four years of service and one that provides six
are not comparable as they stand, because the cheaper number may simply be
buying less. Two conventions repair this, and the exam expects both.

**Least common multiple (repeated-life) convention.** Assume each alternative
is repeated identically until all alternatives span the same number of years.
Four-year and six-year lives are both repeated to twelve. The assumption being
made — that a replacement will cost and perform exactly what the original did
— is strong, and it is worth naming when you use it.

**Study-period convention.** Fix a horizon that reflects how long the service
is actually needed, and give any alternative that outlives it an estimated
market value at the horizon. This convention makes no repetition assumption but
requires a number the problem must supply.

Annual worth handles the first convention automatically, and that is its main
practical claim:

$$AW = -P(A/P,\\, i,\\, n) + S(A/F,\\, i,\\, n) - C_{\\mathrm{annual}}$$

Because the factors already spread a single life over its own n, comparing
annual worths compares equal one-year slices of service, whatever n was.

## 7.2 Worked Example — four years against six, by both conventions

**Given**, at a 10% MARR:

| Alternative | Life | First cost | Annual operating cost | Salvage |
|---|---|---|---|---|
| P | 4 years | 28,000 | 9,500 | 5,000 |
| Q | 6 years | 42,000 | 7,200 | 6,000 |

**Find**: the preferred alternative under the repeated-life convention.

**Annual worth, directly.** With (A/P, 10%, 4) = 0.31547080,
(A/F, 10%, 4) = 0.21547080, (A/P, 10%, 6) = 0.22960738 and
(A/F, 10%, 6) = 0.12960738:

$$-28000 \\times 0.31547080 - 9500 + 5000 \\times 0.21547080 = -17255.83$$

$$-42000 \\times 0.22960738 - 7200 + 6000 \\times 0.12960738 = -16065.87$$

Q costs **1,189.96 less per year**, so Q is preferred.

**The long way, as the check.** Over the least common multiple of twelve years,
P is bought at time zero and again at years 4 and 8, each purchase preceded by
the sale of the old unit for 5,000; Q is bought at time zero and again at year
6. Discounting every one of those flows at 10% gives present worths of
−117,575.90 for P and −109,467.86 for Q. Converting each to an annual figure:

$$-117575.8974 \\times 0.14676332 = -17255.83$$

$$-109467.8577 \\times 0.14676332 = -16065.87$$

The two routes agree to the cent, which is the demonstration that annual worth
is not an approximation to the repeated-life comparison — it **is** the
repeated-life comparison, done with fewer keystrokes.

## 7.3 Worked Example — the same pair over a four-year study period

**Given**: the service is genuinely needed for only four years. Alternative Q
would be two years old at that point and could be sold for an estimated 12,000.
**Find**: the preferred alternative now.

**P over four years** is unchanged, since four years is its own life:

$$-28000 - 9500 \\times 3.16986545 + 5000 \\times 0.68301346 = -54698.65$$

$$-54698.6545 \\times 0.31547080 = -17255.83$$

**Q over four years** is truncated, with the imputed market value standing in
for the salvage:

$$-42000 - 7200 \\times 3.16986545 + 12000 \\times 0.68301346 = -56626.87$$

$$-56626.8697 \\times 0.31547080 = -17864.12$$

**The ranking has reversed.** P now costs 608.29 a year less than Q. Nothing
was miscalculated in either analysis; the two answer different questions. Over
twelve years of service, Q's lower running cost has time to repay its higher
purchase price. Over four, it does not, and the unrecovered capital shows up as
a market value well below what the repeated-life convention implicitly credited
it with.

This reversal is the reason the exam insists you state which convention you are
using. A problem that supplies an estimated market value at a stated horizon is
telling you to use the study period; a problem that supplies neither is telling
you to repeat the lives.

## 7.4 The trap that produces the wrong answer twice

The error is to compare present worths over each alternative's own life:
−54,698.65 for P over four years against −69,971.03 for Q over six. That makes
P look cheaper by more than 15,000, and it is nonsense: the two numbers buy
different amounts of service. Worse, the error is stable — it will reliably
select the shortest-lived alternative, because a short life simply has fewer
costs in it — so it produces a confident wrong answer rather than an obviously
absurd one. Whenever you see two present worths built over different numbers of
years, stop and convert.

## 7.5 Practice Problems — unequal lives

**Problem 7A.** At 11%, machine G costs 34,000, runs for 8,800 a year, lasts
five years and salvages at 4,000. Machine H costs 52,000, runs for 6,900 a
year, lasts eight years and salvages at 7,000. Choose.

*Answer.* With (A/P, 11%, 5) = 0.27057031, (A/F, 11%, 5) = 0.16057031,
(A/P, 11%, 8) = 0.19432105 and (A/F, 11%, 8) = 0.08432105:

$$-34000 \\times 0.27057031 - 8800 + 4000 \\times 0.16057031 = -17357.11$$

$$-52000 \\times 0.19432105 - 6900 + 7000 \\times 0.08432105 = -16414.45$$

**H wins by 942.66 a year.** **The trap** is comparing raw present worths over
each machine's own life — −64,150.09 for G over five years against −84,470.76
for H over eight — which picks G by more than 20,000 and is simply the
unequal-lives error in its purest form.

**Problem 7B.** A pump with a six-year life is being compared against one with a
nine-year life. What is the least common multiple horizon, and how many times
is each purchased?

*Answer.* The least common multiple of 6 and 9 is **18 years**. The six-year
pump is purchased three times, the nine-year pump twice. **The trap** is
multiplying the lives to get 54 years, which is a valid common horizon but
needlessly triples the arithmetic, and in a timed exam that is the same as
getting it wrong.`,
      examTip: 'Annual worth is the default tool for unequal lives. Reach for the least-common-multiple timeline only when the question explicitly asks for a present worth over the repeated horizon, or when replacements are stated to cost something different from the original.',
      importantNote: 'A study-period analysis needs an estimated market value for any alternative that outlives the horizon. If the problem supplies one, it wants the study period; if it does not, it wants repeated lives. Choosing the wrong convention can and does reverse the answer.',
    },
    {
      id: 'ca-incremental-and-multiple-roots',
      title: '8. Incremental Rate of Return, and the Honest Treatment of Multiple Roots',
      content: `## 8.1 Why ranking by rate of return fails

A rate of return is a ratio, and ratios discard scale. A 2,000 investment
returning 40% and a 200,000 investment returning 18% cannot be ranked by those
numbers, because the second earns vastly more money. The repair is to stop
asking which project has the better rate and start asking whether each
additional increment of spending earns at least the MARR.

The procedure is mechanical and worth memorising as a sequence.

1. **Discard any alternative whose own rate of return is below the MARR.** It
   cannot be justified even against doing nothing.
2. **Order the survivors by increasing first cost.**
3. **Take the cheapest survivor as the current defender.**
4. **Compute the incremental cash flow** challenger minus defender, and its
   incremental rate of return.
5. **If that incremental return exceeds the MARR, the challenger becomes the
   new defender**; otherwise the defender stands and the challenger is
   discarded.
6. **Repeat** until the list is exhausted. The surviving defender is the answer.

Step 1 is a comparison against the do-nothing alternative, which is itself an
increment — from spending zero to spending the first cost. Recognising that
makes the whole procedure one rule applied repeatedly rather than two rules
bolted together.

## 8.2 Worked Example — three alternatives where the bare rates mislead

**Given**, all with ten-year lives at a 10% MARR:

| Alternative | First cost | Net annual benefit | Required (P/A) | Own rate of return |
|---|---|---|---|---|
| D1 | 25,000 | 5,000 | 5.000000 | 15.0984% |
| D2 | 40,000 | 7,900 | 5.063291 | 14.7689% |
| D3 | 60,000 | 10,300 | 5.825243 | 11.2614% |

Each own rate solves (P/A, i, 10) equal to the first cost over the annual
benefit, and each was confirmed by bisection on the net present value as well
as by the factor equation.

**Every alternative beats the MARR**, so none is eliminated at step 1, and the
bare rates rank them D1, D2, D3. That ranking is wrong.

**Increment D1 to D2.** Spend 15,000 more to receive 2,900 more a year:

$$(P/A,\\, i,\\, 10) = \\frac{15000}{2900} = 5.172414 \\qquad \\Longrightarrow \\qquad i_{\\Delta} = 14.2161\\%$$

$$2900 \\times 6.14456711 - 15000 = 2819.24$$

The extra 15,000 earns 14.22%, which beats 10%, so **D2 replaces D1** as the
defender.

**Increment D2 to D3.** Spend 20,000 more to receive 2,400 more a year:

$$(P/A,\\, i,\\, 10) = \\frac{20000}{2400} = 8.333333 \\qquad \\Longrightarrow \\qquad i_{\\Delta} = 3.4602\\%$$

$$2400 \\times 6.14456711 - 20000 = -5253.04$$

The extra 20,000 earns 3.46%, far below the MARR, so **D3 is rejected** and D2
survives.

**The answer is D2**, and the net present values confirm it independently:

$$5000 \\times 6.14456711 - 25000 = 5722.84$$

$$7900 \\times 6.14456711 - 40000 = 8542.08$$

$$10300 \\times 6.14456711 - 60000 = 3289.04$$

D2 has the largest present worth. It also has neither the highest own rate of
return nor the lowest first cost, which is exactly why the incremental
procedure exists.

![Present-worth profiles of D1, D2 and D3 against the discount rate from 3% to 18%, each computed as NPV(i) = −C + A(P/A, i, 10). D1 and D2 cross at 14.22%, which is the D1-to-D2 incremental rate of return; D3 reaches zero first, at 11.26%, despite costing the most. At the marked 10% MARR the highest curve is D2.](/courses/fe-ee/figures/econ2-incremental-ladder.svg)

The figure supplies the geometry behind the rule. The crossing of two
present-worth profiles IS the incremental rate of return between those two
alternatives: at that rate the two have equal present worth, which is precisely
what a zero incremental present worth means. To the left of a crossing the
more expensive alternative is ahead; to the right the cheaper one is. Since
"accept the increment when its rate beats the MARR" and "take the highest
present worth at the MARR" both amount to asking which side of the crossing
the MARR falls on, the two rules are one rule.

## 8.3 The trap, stated precisely

Ranking by own rate of return picks D1 at every MARR, because D1's rate is
highest at every MARR — it is a property of D1's cash flows and does not depend
on the MARR at all. That is the tell. **A decision rule that never changes with
the MARR cannot be answering a question that depends on the MARR**, and choosing
between mutually exclusive alternatives certainly does: at a 15% MARR the right
answer here really is D1, and at 10% it really is D2. Only the incremental
procedure and present worth track that change.

## 8.4 When the rate of return does not exist uniquely

A conventional cash flow — some outlays followed by receipts, with exactly one
sign change — has exactly one positive rate of return. When the sign changes
more than once, more than one rate can satisfy the equation, and Descartes' rule
of signs bounds the number of positive roots by the number of sign changes.

### 8.4.1 Worked Example — a cash flow with two rates of return

Consider 1,000 paid out now, 5,000 received at the end of
year 1, and 6,000 paid out at the end of year 2 for decommissioning. Two sign
changes, so up to two roots. Substituting x = 1/(1+i) turns the defining
equation into a quadratic:

$$-1000 + 5000x - 6000x^{2} = 0 \\qquad \\Longrightarrow \\qquad 6x^{2} - 5x + 1 = 0$$

$$x = \\frac{5 \\pm \\sqrt{25 - 24}}{12} = \\frac{1}{2} \\text{ and } \\frac{1}{3}$$

Inverting, i = 100% and i = 200%. Both are genuine sign changes of the net
present value function, confirmed by bisection on each side:

| Discount rate | Net present value |
|---|---|
| 0% | −2,000.00 |
| 50% | −333.33 |
| 100% | 0.00 |
| 150% | +40.00 |
| 200% | 0.00 |
| 300% | −125.00 |

![Net present value of the cash flows −1,000, +5,000, −6,000 plotted from 0% to 400%. The curve begins at −2,000, rises through zero at 100%, peaks at only +40 near 150%, returns to zero at 200% and falls away after that. Two sign changes in the cash flows produce two genuine roots and no usable internal rate of return.](/courses/fe-ee/figures/econ2-multiple-irr.svg)

**Neither root is the rate of return**, because there is no such thing here.
Reporting 100% would be indefensible and reporting 200% equally so. The correct
professional answer is to abandon the rate and use present worth at the stated
MARR. At a 15% MARR:

$$-1000 + \\frac{5000}{1.15} - \\frac{6000}{1.3225} = -1189.04$$

The project is rejected, decisively and without ambiguity. **The trap** on this
question type is reporting the first root your calculator happens to converge
on, which is determined by the seed value rather than by the economics.

## 8.5 Practice Problems — increments and roots

**Problem 8A.** At a 9% MARR and twelve-year lives, alternative E costs 90,000
and returns 17,500 a year; alternative F costs 130,000 and returns 24,000 a
year. Choose, and show why the bare rates are not decisive.

*Answer.* With (P/A, 9%, 12) = 7.16072528:

$$17500 \\times 7.16072528 - 90000 = 35312.69$$

$$24000 \\times 7.16072528 - 130000 = 41857.41$$

Own rates of return are **16.2535%** for E and **15.0171%** for F, so E leads on
rate while F leads on present worth. The increment settles it: 40,000 more buys
6,500 more a year, giving an incremental present worth of

$$6500 \\times 7.16072528 - 40000 = 6544.71$$

and an incremental rate of return of **12.1419%**, which clears the 9% MARR.
**F is correct.** Note that the incremental present worth, 6,544.71, is exactly
the difference between the two present worths — present worth was answering the
incremental question all along. **The trap** is picking E on its higher rate,
which forgoes 6,544.71 of value to protect a ratio.

**Problem 8B.** A cash flow runs −5,000, +14,000, −9,500. How many rates of
return can it have, and what should be reported at a 12% MARR?

*Answer.* Two sign changes, so up to two positive roots — and here there are
exactly two. Substituting x = 1/(1+i) gives

$$9500x^{2} - 14000x + 5000 = 0 \\qquad \\text{with discriminant } 14000^{2} - 4(9500)(5000) = 6000000$$

$$x = \\frac{14000 \\pm 2449.4897}{19000} = 0.865763 \\text{ and } 0.607922$$

Inverting each gives **15.5051%** and **64.4949%**, and bisection on the net
present value confirms both as genuine sign changes. At a 12% MARR:

$$-5000 + \\frac{14000}{1.12} - \\frac{9500}{1.2544} = -73.34$$

The present worth is **−73.34**, so **reject**. That is the whole lesson of this
problem type: both roots sit above the 12% MARR, so a candidate who reports
either one and applies the usual accept rule reaches the opposite of the
correct decision. **The trap** is quoting 64.49% as "the return" and calling the
project outstanding; at the stated MARR the project destroys value, and only
present worth says so.`,
      examTip: 'Order alternatives by first cost before doing anything else, and analyse increments in that order. An incremental analysis performed on an unordered list gives negative increments whose rates of return mean nothing, and it is one of the few errors that produces answers no sanity check will catch.',
      importantNote: 'Count the sign changes in the cash flow before computing any rate of return. One change guarantees a unique positive rate; more than one means you must verify the root is unique or abandon the rate and decide on present worth at the MARR.',
    },
    {
      id: 'ca-bc-payback-sensitivity',
      title: '9. Incremental Benefit–Cost, the Blindness of Payback, and Sensitivity',
      content: `## 9.1 Benefit–cost ratios must be taken incrementally too

Everything Section 8 says about rates of return applies unchanged to
benefit–cost ratios, and for the same reason: a ratio discards scale. A small
project with a ratio of 1.9 and a large one with a ratio of 1.2 cannot be
ranked by those numbers. The procedure is identical — order by cost, test each
increment, keep the increment when its ratio exceeds 1.0.

An annual-worth form of the ratio keeps the arithmetic small and is standard in
public work. Because both numerator and denominator would be multiplied by the
same (P/A) to become present worths, the ratio is unchanged:

$$B/C = \\frac{B_{\\mathrm{annual}}}{P(A/P,\\, i,\\, n) + C_{\\mathrm{annual}}}$$

## 9.2 Worked Example — three public alternatives

**Given**: three flood-mitigation schemes, each with a twenty-year life,
evaluated at a 5% social discount rate.

| Scheme | Capital cost | Annual benefits | Annual operating cost |
|---|---|---|---|
| R1 | 3,000,000 | 340,000 | 45,000 |
| R2 | 4,500,000 | 505,000 | 70,000 |
| R3 | 6,200,000 | 640,000 | 95,000 |

**Find**: the scheme to build.

With (A/P, 5%, 20) = 0.0802425872, the equivalent annual cost of each is the
capital recovery plus the operating cost:

$$3000000 \\times 0.0802425872 + 45000 = 285727.76$$

$$4500000 \\times 0.0802425872 + 70000 = 431091.64$$

$$6200000 \\times 0.0802425872 + 95000 = 592504.04$$

| Scheme | Equivalent annual cost | Annual benefits | Conventional B/C |
|---|---|---|---|
| R1 | 285,727.76 | 340,000 | 1.1899 |
| R2 | 431,091.64 | 505,000 | 1.1714 |
| R3 | 592,504.04 | 640,000 | 1.0802 |

All three exceed 1.0, so all three are individually worth doing and none is
eliminated. The bare ratios rank them R1, R2, R3 — and, as with rates of
return, that ranking is not the answer.

**Increment R1 to R2.** Extra annual cost 431,091.64 − 285,727.76 = 145,363.88;
extra annual benefit 505,000 − 340,000 = 165,000:

$$\\frac{165000}{145363.88} = 1.1351$$

Above 1.0, so **R2 replaces R1**.

**Increment R2 to R3.** Extra annual cost 592,504.04 − 431,091.64 = 161,412.40;
extra annual benefit 640,000 − 505,000 = 135,000:

$$\\frac{135000}{161412.40} = 0.8364$$

Below 1.0, so **R3 is rejected**. Build **R2**.

The net present values agree, as they always do: converting each annual surplus
at (P/A, 5%, 20) = 12.46221034 gives roughly 676,000 for R1, 921,000 for R2 and
592,000 for R3, and R2 is the largest. Whenever a benefit–cost answer and a present
worth answer disagree, the benefit–cost work was not done incrementally.

## 9.3 Payback period, and what it cannot see

Payback is the time for cumulative net receipts to recover the first cost. Its
appeal is that it needs no discount rate; its defect is that it therefore
measures nothing about value.

$$\\mathrm{payback} = \\frac{P}{A} \\qquad \\text{(uniform receipts, undiscounted)}$$

### 9.3.1 Worked Example — two projects payback cannot distinguish

Project S costs
60,000 and returns 20,000 a year for four years. Project T costs 60,000 and
returns 20,000 a year for twelve years. Both have a simple payback of exactly
3.0 years, and both have a discounted payback at 10% of 3.7513 years. By either
payback measure they are identical.

$$20000 \\times 3.16986545 - 60000 = 3397.31$$

$$20000 \\times 6.81369182 - 60000 = 76273.84$$

Project T is worth **twenty-two times** as much. Payback is blind to everything
after the cutoff, and everything after the cutoff is where T's entire advantage
lives. Use payback as a liquidity screen — how long is capital exposed — and
never as a ranking rule.

Discounted payback repairs one of payback's two defects and not the other. It
charges interest during the recovery period, so it is always the longer of the
two measures, but it still ignores every receipt after recovery.

## 9.4 Sensitivity analysis: which assumption is the decision resting on?

A present worth is a single number computed from five or six estimates, some of
which are far better known than others. Sensitivity analysis varies one input
at a time, holding the rest at their base values, and reports how the answer
moves. The input whose line is steepest is the one worth spending effort to
estimate better.

### 9.4.1 Worked Example — sensitivity on a single alternative

Take alternative N from Section 6: 165,000 first cost,
33,500 a year, 25,000 salvage, twelve-year life, 10% MARR, base present worth
71,224.45.

| Driver | At −20% | Base | At +20% |
|---|---|---|---|
| First cost | 104,224.45 | 71,224.45 | 38,224.45 |
| Annual benefit | 25,572.71 | 71,224.45 | 116,876.18 |
| Salvage | 69,631.29 | 71,224.45 | 72,817.60 |
| MARR | 97,386.46 | 71,224.45 | 48,928.41 |
| Life | 50,481.58 | 71,224.45 | 88,367.31 |

![Present worth of alternative N against a proportional change in three drivers, each swept from −30% to +30% with the others held at base. The annual-benefit line is the steepest, the first-cost line next, and the MARR line shallower still; all three pass through the base case of 71,224 at zero change.](/courses/fe-ee/figures/econ2-sensitivity-spider.svg)

The ordering is the finding. Annual benefit is the steepest driver by a wide
margin, first cost next, and salvage is nearly irrelevant — a 20% error in the
year-12 salvage moves the answer by 1,593, which no decision would turn on.
That is a general result rather than a quirk of this example: a salvage value
twelve years out is discounted by a factor of 0.3186, so a fifth of it is a
sixteenth of a percent of the decision.

**Break-even values** are the sharper form of the same question — how far can
one estimate be wrong before the decision changes? Solving present worth equal
to zero for each driver in turn:

- First cost could rise to **236,224.45**, a 43.2% overrun, before N stops
  paying.
- Annual benefit could fall to **23,046.86**, a 31.2% shortfall.
- The MARR could rise to **17.8514%** — which is simply the rate of return.

That last equivalence is worth noticing: **the break-even discount rate IS the
internal rate of return**, so every rate-of-return calculation you have ever
done was already a sensitivity analysis on the discount rate.

## 9.5 Practice Problems — ratios, payback and sensitivity

**Problem 9A.** A public works project costs 2,600,000, produces annual
benefits of 295,000 and costs 38,000 a year to operate over thirty years at 4%.
Find the conventional and modified benefit–cost ratios and the net present
worth.

*Answer.* (P/A, 4%, 30) = 17.29203330, so present worths are

$$295000 \\times 17.29203330 = 5101149.82 \\qquad 38000 \\times 17.29203330 = 657097.27$$

Conventional puts operating cost in the denominator; modified subtracts it from
benefits:

$$\\frac{5101149.82}{2600000 + 657097.27} = 1.5662 \\qquad \\frac{5101149.82 - 657097.27}{2600000} = 1.7093$$

$$295000 \\times 17.29203330 - 38000 \\times 17.29203330 - 2600000 = 1844053$$

Both ratios exceed 1.0 and the net present worth is **+1,844,053**, so the
project is justified. **The trap** is quoting one convention's ratio as though
it were the other's; the numbers differ by 0.143 here, and a specification that
sets a threshold of 1.6 would be met under one convention and missed under the
other. The accept-or-reject decision, notably, is identical either way.

**Problem 9B.** Two production processes are available. Process 1 has 210,000
of fixed cost and 46.00 per unit; process 2 has 320,000 of fixed cost and 31.50
per unit. Find the break-even volume, and say which process suits an expected
volume of 12,000 units.

*Answer.* Set total costs equal and solve:

$$Q^{*} = \\frac{320000 - 210000}{46.00 - 31.50} = \\frac{110000}{14.5} = 7586.21$$

Check by substitution, which must give the same total both ways:

$$210000 + 46 \\times 7586.2069 = 558965.52 \\qquad 320000 + 31.5 \\times 7586.2069 = 558965.52$$

At 12,000 units, process 1 costs 762,000 and process 2 costs 698,000, so
**process 2 saves 64,000 a year**. **The trap** is dividing the fixed-cost
difference by the wrong variable-cost difference — using 31.50 − 46.00 = −14.50
— which returns a negative volume and, if the sign is quietly dropped, the
right magnitude for the wrong reason.

**Problem 9C.** A 90,000 investment returns 25,500 a year for five years at a
12% MARR. Find the simple payback and the net present worth, and reconcile
them.

*Answer.* Simple payback is 90,000/25,500 = **3.53 years**, which sounds
uncomfortably close to the five-year life. The present worth tells the fuller
story: with (P/A, 12%, 5) = 3.60477620,

$$25500 \\times 3.60477620 - 90000 = 1921.79$$

The project is acceptable, but only just — **+1,921.79** on a 90,000 outlay is a
margin of about 2%. Here payback and present worth happen to point the same
way, and the payback figure was the more legible warning. **The trap** is
treating a payback comfortably inside the asset life as proof of a good
investment; had the life been five years and the receipts 22,000, payback would
still land at 4.09 years while the present worth turns negative at −10,694.92.`,
      examTip: 'Benefit-cost ratios and rates of return are both ratios, so both must be applied incrementally to mutually exclusive alternatives and both must be checked against the do-nothing option first. If a question gives three public alternatives and asks which to build, it is testing the increment, not the ratio.',
      importantNote: 'The break-even discount rate is the internal rate of return, and the break-even first cost is the initial outlay at which present worth vanishes. Both come from setting present worth to zero and solving for one variable, so sensitivity analysis and rate-of-return analysis are the same calculation asked in different directions.',
    },
    {
      id: 'ca-replacement-and-after-tax',
      title: '10. Replacement Analysis, Sunk Cost, and After-Tax Cash Flow',
      content: `## 10.1 The sunk-cost rule, stated so it cannot be misapplied

A replacement study compares the asset in service, the **defender**, against the
best available **challenger**. The single hardest thing about it is not the
arithmetic; it is refusing to let the defender's history into the analysis.

The defender's first cost in the study is its **current market value** — what
you would receive by selling it today, which is exactly what you give up by
keeping it. Its original purchase price is gone and its book value is an
accounting construct with no cash consequence. The difference between what was
paid and what the asset is now worth is a **sunk cost**, and sunk costs are
irrelevant to every forward-looking decision.

$$\\mathrm{sunk\\ cost} = \\mathrm{original\\ cost} - \\mathrm{current\\ market\\ value}$$

This is the rule that feels wrong and is right. Money already spent cannot be
recovered by any choice now available, so it cannot distinguish between the
choices.

## 10.2 Worked Example — defender against challenger

**Given**, at a 12% MARR: a machine bought five years ago for 90,000 now has a
book value of 30,000 and a market value of 22,000. It will run four more years
at 19,000 a year and then be worth 4,000. The challenger costs 70,000, runs for
11,500 a year over an eight-year life and salvages at 12,000.
**Find**: whether to replace.

**The defender**, entered at its market value:

$$-22000 \\times 0.32923444 - 19000 + 4000 \\times 0.20923444 = -25406.22$$

**The challenger**:

$$-70000 \\times 0.20130284 - 11500 + 12000 \\times 0.08130284 = -24615.56$$

$$25406.22 - 24615.56 = 790.66$$

The challenger costs **790.66 less per year**, so **replace**. The sunk cost is
90,000 − 22,000 = **68,000**, and it appears nowhere in either calculation.

**The traps, and the numbers they produce.**

| Error | Defender first cost used | Defender annual worth | Decision reached |
|---|---|---|---|
| Correct analysis | 22,000 market value | −25,406.22 | replace |
| Book value used | 30,000 | −28,040 | replace, for the wrong reason |
| Original cost used | 90,000 | −47,794.16 | replace, wildly overstated |
| Sunk cost added to the challenger | 70,000 plus 68,000 | not meaningful | keep, incorrectly |

The third row is the instructive one. Loading the defender with its original
90,000 makes replacement look overwhelming when it is in fact marginal, and a
candidate who reaches the right decision that way has not understood anything
and will get the next question wrong. The fourth row is the error people make
when they feel that the 68,000 loss ought to be "recognised somewhere" — it
punishes the challenger for the defender's history and reverses the answer.

## 10.3 Economic service life

A defender or challenger does not have one cost; it has a different equivalent
annual cost for every retention period. Capital recovery falls as the asset is
held longer, because the purchase price spreads over more years; operating cost
rises as the asset ages. The sum has a minimum, and that minimum is the
**economic service life**.

$$\\mathrm{EUAC}(k) = \\left[P + \\sum_{t=1}^{k} C_{t}(1+i)^{-t} - S_{k}(1+i)^{-k}\\right](A/P,\\, i,\\, k)$$

### 10.3.1 Worked Example — the economic service life of a 48,000 asset

An asset costs 48,000 at 10%. Its market value falls by a
quarter each year, so S_k = 48,000(0.75)^k. Operating cost is 6,000 in year 1
and rises 3,500 a year.

| Years kept | Salvage | Capital recovery | Operating equivalent | Total EUAC |
|---|---|---|---|---|
| 1 | 36,000.00 | 16,800.00 | 6,000.00 | 22,800.00 |
| 2 | 27,000.00 | 14,800.00 | 7,666.67 | 22,466.67 |
| 3 | 20,250.00 | 13,183.69 | 9,277.95 | 22,461.63 |
| 4 | 15,187.50 | 11,870.14 | 10,834.09 | 22,704.22 |
| 5 | 11,390.62 | 10,796.52 | 12,335.44 | 23,131.96 |
| 6 | 8,542.97 | 9,913.92 | 13,782.45 | 23,696.37 |
| 7 | 6,407.23 | 9,184.11 | 15,175.65 | 24,359.76 |
| 8 | 4,805.42 | 8,577.11 | 16,515.68 | 25,092.78 |

The minimum is at **three years, 22,461.63 a year**.

![Equivalent uniform annual cost of a 48,000 asset at 10% against the number of years it is kept, split into its two parts. Capital recovery falls from 16,800 to 8,577 as the purchase spreads over more years; the operating equivalent rises from 6,000 to 16,516 as the asset ages. Their sum reaches a shallow minimum of 22,461.63 at three years.](/courses/fe-ee/figures/econ2-service-life.svg)

Two things about that table matter more than the answer. The minimum is
**shallow** — years 2, 3 and 4 differ by less than 250 a year on a cost of
22,500, or about 1% — so the exact optimum is far less important than knowing
that keeping the asset eight years costs an unmistakable 2,631 a year more than
keeping it three. And the two components genuinely trade off: neither alone has
an interior minimum, and it is only their sum that does.

## 10.4 Depreciation, taxes, and after-tax cash flow

Depreciation moves no money. Its whole economic effect is that it reduces
taxable income, and therefore reduces tax, and tax is cash. That is the link
between the depreciation chapter and this one, and it is the only link.

$$\\mathrm{taxable\\ income} = \\mathrm{BTCF} - D_{k}$$

$$\\mathrm{tax} = t\\left(\\mathrm{BTCF} - D_{k}\\right)$$

$$\\mathrm{ATCF} = \\mathrm{BTCF} - t\\left(\\mathrm{BTCF} - D_{k}\\right) = \\mathrm{BTCF}(1-t) + t\\,D_{k}$$

The final rearrangement is worth committing to memory. After-tax cash flow is
the before-tax flow reduced by tax **plus** a term t·D_k that depends only on
the depreciation charge. That term is the **depreciation tax shield**, and its
present worth is what a faster write-off is worth.

### 10.4.1 Worked Example — after-tax cash flow and the depreciation shield

An asset costing 100,000 is depreciated straight-line over
five years to zero salvage. It generates 38,000 a year before tax, the tax rate
is 25%, and the after-tax MARR is 8%.

The annual depreciation is 100,000/5 = 20,000, so taxable income is
38,000 − 20,000 = 18,000, tax is 0.25 × 18,000 = 4,500 and after-tax cash flow
is 38,000 − 4,500 = 33,500. With (P/A, 8%, 5) = 3.99271004:

$$38000 \\times 3.99271004 - 100000 = 51722.98$$

$$33500 \\times 3.99271004 - 100000 = 33755.79$$

The project is worth **+33,755.79** after tax against **+51,722.98** before, and
the internal rate of return falls from 26.0656% to 20.0843%. Taxes take about a
third of the value, which is why an evaluation done before tax and compared
against an after-tax MARR is meaningless.

**What the shield is worth.** Suppose the asset could not be depreciated at
all. Then the whole 38,000 would be taxable, after-tax cash flow would be
38,000 × 0.75 = 28,500, and the present worth would be

$$28500 \\times 3.99271004 - 100000 = 13792.24$$

The difference between the two after-tax present worths is

$$0.25 \\times 20000 \\times 3.99271004 = 19963.55$$

exactly the present worth of the tax shield, as the ATCF rearrangement
predicted. This is the whole argument for accelerated depreciation: the total
shield over the asset's life is the same t times the depreciable base whatever
schedule is used, but taking it earlier makes it worth more, and the difference
is worth real money.

## 10.5 Practice Problems — replacement and after-tax

**Problem 10A.** A defender bought for 40,000 has a current market value of
15,000, three years of life left at 12,500 a year, and a salvage of 2,000. The
challenger costs 55,000, lasts ten years at 7,000 a year, and salvages at
9,000. At 10%, decide.

*Answer.* With (A/P, 10%, 3) = 0.4021148, (A/F, 10%, 3) = 0.3021148,
(A/P, 10%, 10) = 0.1627454 and (A/F, 10%, 10) = 0.0627454:

$$-15000 \\times 0.4021148 - 12500 + 2000 \\times 0.3021148 = -17927.49$$

$$-55000 \\times 0.1627454 - 7000 + 9000 \\times 0.0627454 = -15386.29$$

The challenger costs 2,541.20 less per year, so **replace**. **The trap** is
using the 40,000 original cost for the defender, giving −27,980.36 a year; that
still says replace, but it overstates the advantage by more than four times and
would give the wrong answer to any question about how much the replacement is
worth.

**Problem 10B.** An 80,000 asset is depreciated straight-line over eight years
to zero. It produces 21,000 a year before tax, the tax rate is 21%, and the
after-tax MARR is 7%. Find the after-tax present worth.

*Answer.* Depreciation is 80,000/8 = 10,000 a year, so taxable income is
11,000, tax is 2,310 and after-tax cash flow is 18,690. With
(P/A, 7%, 8) = 5.97129851:

$$18690 \\times 5.97129851 = 111603.57$$

$$111603.57 - 80000 = 31603.57$$

The after-tax present worth is **+31,603.57**. **The trap** is applying the tax
rate to the whole 21,000 and ignoring the depreciation shield, which gives an
after-tax flow of 16,590 and a present worth of **19,063.84** — understating the
project by 12,539.73, which is precisely the present worth of the shield.

**Problem 10C.** Why does the economic service life of an asset with rising
maintenance and falling salvage exist at all, and what would make it infinite?

*Answer.* It exists because two annual quantities move in opposite directions
with the retention period: capital recovery falls as the purchase price spreads
over more years, and the operating equivalent rises as maintenance grows. The
sum of a decreasing and an increasing function has an interior minimum whenever
the increasing one eventually dominates. If operating cost were **constant**
rather than rising, only the falling component would vary and the equivalent
annual cost would decrease forever — the economic life would be the physical
life, and the right answer would be to keep the asset until it fails. **The
trap** is assuming an asset should always be replaced at the end of its
depreciation schedule; depreciation life is a tax convention and has no
necessary relationship to economic service life.`,
      examTip: 'In any replacement problem, write down the defender first cost as its market value in the first line of your work, and write the sunk cost separately with a note that it is excluded. Doing that explicitly is faster than resisting the pull of the original purchase price on every subsequent line.',
      importantNote: 'ATCF = BTCF(1 − t) + t·D isolates the depreciation tax shield as a separate term. The total shield across an asset life is the same for every schedule, so accelerated methods add value only through timing — but timing is worth real money at any realistic discount rate.',
    },
    {
      id: 'ca-problem-sets',
      title: '11. Problem Sets: Choosing Between Alternatives',
      content: `## 11.1 Problem Set A — method selection

**A1.** A project costs 250,000 and returns 46,000 a year for ten years with no
salvage. At a 12% MARR, should it be accepted?

*Answer.* (P/A, 12%, 10) = 5.65022302, so

$$46000 \\times 5.65022302 - 250000 = 9910.26$$

The present worth is **+9,910.26**, so accept. Equivalently, the rate of return
solves (P/A, i, 10) = 250,000/46,000 = 5.434783, giving **12.9607%**, above the
MARR. **The trap** is comparing total undiscounted receipts of 460,000 against
250,000 and declaring an 84% return; that number ignores every discounting
effect and would approve projects with negative present worth whenever the life
is long enough.

**A2.** Two alternatives have equal ten-year lives at a 10% MARR. J costs
30,000 and saves 6,200 a year; K costs 46,000 and saves 8,900 a year. Choose by
increments.

*Answer.* Both clear the MARR individually: J's present worth is
6,200 × 6.14456711 − 30,000 = **8,096.32** and K's is
8,900 × 6.14456711 − 46,000 = **8,686.65**. The increment is 16,000 for 2,700 a
year:

$$2700 \\times 6.14456711 - 16000 = 590.33$$

The increment is positive, so **K is preferred** — and 590.33 is exactly the
difference between the two present worths, as it always is. **The trap** is
comparing the savings-to-cost ratios, 0.2067 for J against 0.1935 for K, and
picking J; those ratios are undiscounted payback rates in disguise and rank by
scale-blindness.

**A3.** A municipality is choosing between a 25-year bridge costing 8,000,000
with 60,000 a year of maintenance and a 50-year bridge costing 12,500,000 with
40,000 a year of maintenance. At 4%, compare on a capitalized-cost basis.

*Answer.* Capitalized cost is the perpetual equivalent, so convert each first
cost into a perpetual renewal with a sinking fund and then capitalize
everything. With (A/F, 4%, 25) = 0.02401196 and (A/F, 4%, 50) = 0.00655020:

$$\\frac{8000000 \\times 0.0240119628 + 60000}{0.04} = 6302393$$

$$\\frac{12500000 \\times 0.0065502004 + 40000}{0.04} = 3046938$$

The fifty-year bridge has the lower capitalized cost, **3,046,938** against
**6,302,393**, so it is preferred by a wide margin. **The trap** is dividing
each first cost by 0.04 directly, which treats the entire construction cost as
recurring every single year and produces 201,500,000 and 313,500,000 — numbers
so large they should trigger suspicion, but which have been reported on exams.

**A4.** Which method should be used to compare a five-year alternative with a
seven-year one, and what must be true for the answer to be valid?

*Answer.* **Annual worth**, which handles unequal lives directly, or a present
worth over the least common multiple of **35 years**. Either is valid only if
the repeated-life assumption holds — that each alternative can be replaced at
the same cost and performance. If it cannot, the problem must supply a study
period and an estimated market value at its end. **The trap** is comparing the
five-year and seven-year present worths as they stand, which systematically
favours the shorter-lived alternative because it simply contains fewer years of
cost.

## 11.2 Problem Set B — full comparisons

**B1.** At a 10% MARR, alternative V costs 100,000 and returns 24,000 a year for
eight years; alternative W costs 145,000 and returns 32,000 a year for eight
years. Both have zero salvage. Choose, and give the incremental rate of return.

*Answer.* (P/A, 10%, 8) = 5.33492620, so

$$24000 \\times 5.33492620 - 100000 = 28038.23$$

$$32000 \\times 5.33492620 - 145000 = 25717.64$$

V has the higher present worth. The increment is 45,000 for 8,000 a year, whose
required factor is 45,000/8,000 = 5.625000, giving an incremental rate of return
of **8.5671%** — below the 10% MARR — so the extra spending is not justified and
**V is correct**. The incremental present worth confirms it:

$$8000 \\times 5.33492620 - 45000 = -2320.59$$

**The trap** is noticing that W returns more money in total and choosing it;
W does return 256,000 against V's 192,000, but it costs 45,000 more to get an
extra 64,000 spread over eight years, and at 10% that trade loses value.

**B2.** A 120,000 asset is kept for six years, generates 34,000 a year before
tax, is depreciated straight-line over six years to zero salvage, and is taxed
at 30%. The after-tax MARR is 9%. Find the after-tax present worth.

*Answer.* Depreciation is 120,000/6 = 20,000, so taxable income is 14,000, tax
is 4,200 and after-tax cash flow is 29,800. With (P/A, 9%, 6) = 4.48591859:

$$29800 \\times 4.48591859 - 120000 = 13680.37$$

The after-tax present worth is **+13,680.37**, so accept. **The trap** is taxing
the full 34,000, giving an after-tax flow of 23,800 and a present worth of

$$23800 \\times 4.48591859 - 120000 = -13235.14$$

a rejection where the correct answer is acceptance. The 6,000-a-year shield is
the entire difference, and its present worth,
0.30 × 20,000 × 4.48591859 = **26,915.51**, is precisely the gap between the two
answers.

**B3.** A cash flow runs −40,000 at time zero, +18,000 at the end of each of
years 1 through 3, and −6,000 at the end of year 4 for site restoration. At a
10% MARR, evaluate it.

*Answer.* Two sign changes, so a rate of return may not be unique and present
worth is the right tool. With (P/A, 10%, 3) = 2.48685199 and
(P/F, 10%, 4) = 0.68301346:

$$18000 \\times 2.48685199 - 6000 \\times 0.68301346 - 40000 = 665.26$$

The present worth is **+665.26**, so accept — marginally, and a flow-by-flow
discount of all five amounts gives the same figure. **The trap** is netting the
year-4 restoration against the year-3 receipt to force a conventional cash flow
and then reporting a single rate of return; that manipulation moves 6,000 a
full year earlier, lifts the apparent present worth to only 255.45, and is
worth 409.81 of error on a decision whose entire margin is 665.26.

**B4.** Three mutually exclusive alternatives at a 15% MARR have present worths
of +12,000, +18,500 and +16,200 and first costs of 40,000, 75,000 and 60,000.
Which should be chosen, and what would change the answer?

*Answer.* The one with the highest present worth at the stated MARR: the
75,000 alternative, at **+18,500**. Nothing further is needed, because present
worth already embeds every increment. What would change the answer is a
**capital constraint**: if only 65,000 were available, the 75,000 option is
infeasible and the 60,000 one at +16,200 wins. **The trap** is ranking by
present worth per unit of first cost — 0.300, 0.247 and 0.270 — and choosing the
40,000 alternative; that ratio is the right tool only when capital is rationed
across independent projects, never for mutually exclusive ones.

**B5.** An asset costing 64,000 has annual operating costs of 5,000 growing by
2,000 a year, and a salvage value that halves annually from 32,000 after the
first year. At 10%, is the economic service life longer or shorter than it
would be with constant 5,000 operating costs, and why?

*Answer.* **Shorter.** A rising operating cost is the only force pushing the
equivalent annual cost up with age; with it, the total has an interior minimum.
With a constant operating cost, the operating equivalent is flat at 5,000 for
every retention period, only capital recovery varies, and capital recovery
falls monotonically — so the equivalent annual cost keeps falling and the
economic life extends to the physical life. **The trap** is assuming the
halving salvage alone creates the minimum; a falling salvage raises capital
recovery in the early years but capital recovery still declines overall, so
salvage shapes the curve without creating the turning point.`,
      examTip: 'When a question names a MARR and asks you to choose among mutually exclusive alternatives, present worth at that MARR is always a correct answer and is usually the fastest. Reach for incremental rates of return only when the question asks for a rate, or when it supplies rates and asks you to reconcile them.',
      importantNote: 'Present worth per unit of first cost ranks correctly only for INDEPENDENT projects competing for a limited budget. For mutually exclusive alternatives it is scale-blindness in another costume, and it will pick the smallest acceptable project every time.',
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
