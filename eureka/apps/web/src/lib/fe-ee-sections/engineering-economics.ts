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

Example: \\$10,000 depreciation at 30% tax rate → \\$3,000 tax savings

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
