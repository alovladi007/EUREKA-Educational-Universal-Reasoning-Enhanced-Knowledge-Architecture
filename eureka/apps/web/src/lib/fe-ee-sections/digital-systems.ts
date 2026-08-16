// FE EE course content — Digital Systems (5 topics).
// Split byte-identically from fe-ee-course-data.ts so section waves
// can be authored in parallel; spread back into FE_EE_COURSE there.
import type { TopicLesson } from '../fe-ee-course-data';

export const FE_EE_DIGITAL_SYSTEMS: Record<string, TopicLesson> = {
fee_number_sys: { topicId: 'fee_number_sys', title: 'Number Systems and Boolean Algebra', domainWeight: 'Digital Systems · 7–11%',
  overview: 'Number systems (binary, octal, hex) and Boolean algebra form the mathematical foundation of digital design. Base conversions, DeMorgan\'s laws, and Karnaugh map simplification appear frequently on the FE exam. Digital Systems is one of the highest-weighted topics (7-11%).',
  sections: [
    { id: 'numsys-conv', title: '1. Number Systems and Conversions',
      content: `## 1.1 Positional Systems

| Base | Name | Grouping |
|---|---|---|
| 2 | Binary | Native |
| 8 | Octal | 3 binary bits |
| 16 | Hex | 4 binary bits |

## 1.2 Conversions

- **Binary->Decimal**: 1010 = 1*8+0+1*2+0 = **10**
- **Decimal->Binary**: divide by 2 repeatedly, read remainders bottom-up
- **Binary->Hex**: group 4 bits: 10101100 = **AC**
- **Hex->Decimal**: 2A = 2*16+10 = **42**

## 1.3 Signed Numbers (2's Complement)

| Method | -3 (4 bits) | Notes |
|---|---|---|
| Sign-magnitude | 1011 | Two zeros |
| 1's complement | 1100 | Invert bits |
| **2's complement** | **1101** | Invert + add 1; ONE zero; **standard** |

**Range (n bits): -2^(n-1) to +2^(n-1)-1**
- 8 bits: -128 to +127
- To negate: invert all bits, add 1`,
      examTip: '2\'s complement: invert + add 1. Range is asymmetric: 8 bits = -128 to +127 (not -127). This asymmetry is a common exam trap.',
      importantNote: 'The 2\'s complement range has one extra negative value because there is only one representation of zero. 8 bits: -128 exists but +128 does not.',
    },
    { id: 'numsys-bool', title: '2. Boolean Algebra and K-Maps',
      content: `## 2.1 Boolean Laws

- **DeMorgan's**: **(A*B)' = A'+B'** and **(A+B)' = A'*B'**
- Identity: A+0=A, A*1=A
- Complement: A+A'=1, A*A'=0
- Absorption: A+A*B=A

**NAND and NOR** are universal gates -- any function from either alone.

## 2.2 Karnaugh Maps

1. Fill cells from truth table
2. Group adjacent 1s in powers of 2 (1, 2, 4, 8)
3. Groups wrap around edges
4. Variables that change in a group are eliminated
5. OR all product terms

| Variables | K-map |
|---|---|
| 2 | 2x2 |
| 3 | 2x4 |
| 4 | 4x4 |

**Don't-care** (X) conditions can be 0 or 1 to make larger groups.`,
      examTip: 'DeMorgan: break the bar, change the operator. K-maps: make groups as LARGE as possible. Groups must be powers of 2.',
    },
    { id: 'numsys-exam', title: '3. Number System & Boolean Exam Problems',
      content: `## 3.1 Base Conversion with Fractional Parts

**Convert 26.625 (decimal) to binary:**

**Integer part** (divide by 2): 26 = 11010
- 26/2 = 13 R0, 13/2 = 6 R1, 6/2 = 3 R0, 3/2 = 1 R1, 1/2 = 0 R1
- Read bottom-up: **11010**

**Fractional part** (multiply by 2): 0.625
- 0.625 * 2 = **1**.250, 0.250 * 2 = **0**.500, 0.500 * 2 = **1**.000
- Read top-down: **.101**

**Result**: 26.625 (decimal) = **11010.101** (binary)

**Verify**: 16 + 8 + 2 + 0.5 + 0.125 = 26.625

## 3.2 Two's Complement Range for n Bits

| Bits (n) | Range | Min | Max |
|---|---|---|---|
| 4 | -8 to +7 | 1000 | 0111 |
| 8 | **-128 to +127** | 10000000 | 01111111 |
| 16 | -32768 to +32767 | — | — |
| 32 | $-2^{31}$ to $+2^{31}-1$ | — | — |

**Negate -45 in 8-bit two's complement:**
- +45 = 00101101
- Invert: 11010010
- Add 1: **11010011** = -45

**Verify**: 11010011 -> invert = 00101100 -> +1 = 00101101 = 45. Correct.

## 3.3 K-Map Simplification — 4-Variable Worked Example

**Given**: F(A,B,C,D) = sum of minterms(0,1,2,5,8,9,10)

**4x4 K-map** (Gray code order AB vs CD):

|  | $CD=00$ | $CD=01$ | $CD=11$ | $CD=10$ |
|---|---|---|---|---|
| $AB=00$ | **1** | **1** | 0 | **1** |
| $AB=01$ | 0 | **1** | 0 | 0 |
| $AB=11$ | 0 | 0 | 0 | 0 |
| $AB=10$ | **1** | **1** | 0 | **1** |

**Groups** — three, each as large as the 1s allow:
- Group 1: m(0,2,8,10) -> corners wrap: **B'D'**
- Group 2: m(0,1,8,9) -> left column wrap: **B'C'**
- Group 3: m(1,5) -> **A'C'D**

**Simplified**: F = **B'D' + B'C' + A'C'D**

**Exam strategy**: For fractional conversions, integer part divides, fraction part multiplies. For 2's complement, always verify by converting back. For K-maps, wrap around ALL edges and make the largest possible groups.`,
      examTip: 'K-map edge wrapping is the most common mistake. The top row IS adjacent to the bottom row. The left column IS adjacent to the right column. Always check wrap-around groups.',
      importantNote: 'Some FE problems give minterms; others give maxterms (POS form). For minterms, place 1s in the K-map. For maxterms, place 0s and group the 0s to get POS.',
    },
    { id: 'numsys-arith', title: '4. Arithmetic in Any Base, and the Two Flags That Watch It',
      content: `## 4.1 Hexadecimal addition is column addition with a different roll-over

Changing base does not change the mechanics of column arithmetic. It changes
one number only: how much a column can hold before it has to hand something to
its neighbour. Ten in decimal, sixteen in hexadecimal, two in binary. Work
0x3A7 + 0x1DC from the right, writing the carry above the next column exactly
as you were taught to in primary school.

| Column | Digits added | Value in decimal | Digit written | Carry out |
|---|---|---|---|---|
| units, 16^0 | 7 + C | 7 + 12 = 19 | 19 - 16 = **3** | 1 |
| sixteens, 16^1 | A + D + carry | 10 + 13 + 1 = 24 | 24 - 16 = **8** | 1 |
| 256s, 16^2 | 3 + 1 + carry | 5 | **5** | 0 |

The result is **0x583**. Confirm it by a completely different route: 0x3A7 is
935, 0x1DC is 476, their decimal sum is 1411, and 0x583 is 5(256) + 8(16) + 3 =
1411. Two independent procedures landing on one number is what a check means.

Subtraction borrows sixteen rather than ten, and a run of zeros makes the
borrow travel. In 0x1000 - 0x3AB the units column has nothing to take from, so
it reaches through two empty columns before it finds a digit to break.

| Column | After the borrow arrives | Difference | Digit |
|---|---|---|---|
| units | 16 - B | 16 - 11 | **5** |
| sixteens | 15 - A | 15 - 10 | **5** |
| 256s | 15 - 3 | 15 - 3 | **C** |
| 4096s | 1 spent on the borrow | — | — |

So 0x1000 - 0x3AB = **0xC55**, and in decimal 4096 - 939 = 3157, which is
12(256) + 5(16) + 5. The digits agree.

## 4.2 Binary multiplication is only shifting and adding

Because the only multiplier digits are 0 and 1, every partial product is either
zero or the multiplicand shifted left. Multiply 1011 by 1101:

| Multiplier bit | Weight | Partial product |
|---|---|---|
| bit 0 = 1 | 1 | 1011 |
| bit 1 = 0 | 2 | 0000 |
| bit 2 = 1 | 4 | 101100 |
| bit 3 = 1 | 8 | 1011000 |

Adding the three nonzero rows gives **10001111**. In decimal that reads
11 x 13 = 143, and 10001111 is 128 + 8 + 4 + 2 + 1 = 143. This is exactly the
hardware algorithm: a shift register, an adder, and one control bit per cycle.

## 4.3 Carry and overflow are different flags asking different questions

A processor's adder does not know whether you meant the bits as unsigned
magnitudes or as two's-complement signed values, so it reports both verdicts
and lets your program pick.

- **Carry (C)** is simply the carry out of the most significant column. It says
  the *unsigned* result did not fit.
- **Overflow (V)** is the carry *into* the most significant column exclusive-ORed
  with the carry *out* of it. It says the *signed* result did not fit.

Three 8-bit additions show that the two flags are genuinely independent:

| Operation | Bit result | Read as signed | C | V |
|---|---|---|---|---|
| 100 + 35 | 10000111 | **-121** (wrong) | 0 | **1** |
| (-100) + (-45) | 01101111 | **+111** (wrong) | 1 | **1** |
| 100 + (-45) | 00110111 | **+55** (right) | 1 | 0 |

The middle row is the one that catches people: a carry came out, yet the signed
answer is the broken one; the bottom row has a carry out and is perfectly
correct. A carry out of the top column is normal and expected whenever you add
a negative number. The rule was checked here against all 65,536 possible pairs
of 8-bit operands: V equals 1 exactly when the true signed sum falls outside
-128 to +127, and never otherwise. A shortcut worth carrying into the exam room
follows from the same rule — signed overflow is only possible when the two
operands share a sign, and it always shows up as a result whose sign disagrees
with both of them.

## 4.4 Two codes that are not positional at all

**Packed BCD** stores one decimal digit per nibble, so 0x59 means fifty-nine
rather than eighty-nine. A plain binary adder gets BCD wrong whenever a digit
column exceeds nine, because binary rolls over at sixteen and decimal rolls
over at ten — a gap of exactly six. Adding 0x59 + 0x28 in raw binary yields
0x81, which is not the answer. The correction is to add six to any digit that
overflowed:

| Digit column | Raw sum | Above 9? | Correction | Final digit | Carry |
|---|---|---|---|---|---|
| low | 9 + 8 = 17 | yes | +6 | **7** | 1 |
| high | 5 + 2 + 1 = 8 | no | none | **8** | 0 |

giving **0x87**, which reads as eighty-seven. The plus-six rule was checked
here against all one hundred single-digit BCD sums. BCD survives in metering,
instrument displays and financial hardware because converting binary to decimal
for a seven-segment display costs more than the storage inefficiency does.

![Grid of all one hundred single-digit BCD sums, with each square marked according to whether the plus-six correction is required. Fifty-five pairs sum to nine or less and need no correction; thirty-nine sum between ten and fifteen and need the correction with a carry out; six sum to sixteen or more, so the nibble has already carried and still needs the correction.](/courses/fe-ee/figures/dig2-bcd-plus6.svg)

The grid separates two situations that the same correction covers, which is why
hardware detects them with two conditions ORed together. In the thirty-nine
sums between ten and fifteen the nibble has not overflowed on its own, so only
a magnitude comparison against nine catches them. In the six sums of sixteen or
more the nibble has already produced a carry, and that carry is the detection.
A decimal adjust unit that tests only one of the two conditions gets ninety-four
of the hundred cases right, which is exactly the kind of bug that survives
casual testing.

**Gray code** changes exactly one bit between consecutive values. Convert from
binary by exclusive-ORing each bit with the bit above it, so 1011 becomes
**1110**; convert back by running a cumulative exclusive-OR from the top.

| Decimal | Binary | **Gray** | Bit that changed |
|---|---|---|---|
| zero | 000 | **000** | — |
| one | 001 | **001** | bit 0 |
| two | 010 | **011** | bit 1 |
| three | 011 | **010** | bit 0 |
| four | 100 | **110** | bit 2 |
| five | 101 | **111** | bit 0 |
| six | 110 | **101** | bit 1 |
| seven | 111 | **100** | bit 0 |

The single-bit property is not decoration. A shaft encoder using plain binary
can be read mid-transition between 011 and 100 and return anything from 000 to
111, because three tracks switch at once and no two switch at precisely the
same instant. In Gray code only one track switches, so a mid-transition read
returns one of the two neighbouring positions and never a wild value.

![Number of bits that change at each increment of a 4-bit counter, plain binary against Gray code, over a full sixteen-step revolution including the wrap from fifteen back to zero. Binary changes up to four bits at once and thirty in total; Gray changes exactly one bit at every step, sixteen in total.](/courses/fe-ee/figures/dig2-gray-changes.svg)

Count the crossings and the case makes itself. A 4-bit binary disc switches a
track thirty times per revolution, spiking to four simultaneous switches twice —
at the halfway mark and at the wrap. A Gray disc switches exactly sixteen times,
one per step, with no spikes at all. The total is not the point; the peak is.
A single transition where four tracks move together is a single opportunity for
the reading electronics to sample four disagreeing edges, and that one
opportunity is enough to report position 0 when the shaft is at position 8. The
same
property is why the rows and columns of a Karnaugh map are labelled in Gray
order: physical adjacency on the map then means logical adjacency in the
variables.

**How the exam asks this.** Base arithmetic problems are usually solved fastest
by converting to decimal, working there, and converting back — unless the
question is specifically about the carry or overflow flag, in which case you
must stay in binary and watch the top two carries. Gray-code questions are
almost always the conversion in one direction or the single-bit-change
property. BCD questions are almost always the plus-six correction.`,
      examTip: 'Carry answers the unsigned question, overflow answers the signed one, and a problem can set either flag without the other. Signed overflow needs two operands of the same sign; if the signs differ, V is always 0 no matter what the carry does.',
      importantNote: 'Gray-to-binary and binary-to-Gray are not the same operation. Binary to Gray XORs each bit with its left neighbour and can be done bit by bit in any order; Gray to binary is a running XOR that must start at the most significant bit and work down.',
    },
    { id: 'numsys-pos', title: '5. Reading the Map the Other Way: Maxterms and POS',
      content: `## 5.1 Every truth table has a zero side

Section 3 minimised F(A,B,C,D) = sum of minterms(0,1,2,5,8,9,10) by grouping
its 1s, which produces a **sum of products**. The same function can be
described entirely by where it is *false*, and that description produces a
**product of sums**. The two are equally valid readings of one truth table, and
the FE exam asks for both.

A **minterm** is a product term that is true for exactly one input combination.
A **maxterm** is a sum term that is false for exactly one input combination.
The indexing convention is the part people get backwards, so write it out once:
minterm m5 for four variables is A'BC'D — read the index as the bit string
0101 and complement the variables that carry a 0, which here are A and C.
Maxterm M5 is the *complement* of that, A + B' + C + D' — read the same index
but complement the variables that carry a 1, which here are B and D, and join
them with OR. Check the pair against each other rather than against your
memory: M5 must be false only at 0101, and A + B' + C + D' is indeed 0 exactly
when A is 0, B is 1, C is 0 and D is 1. Our function is false at the nine
indices its minterm list omits, so

**F = product of maxterms M(3, 4, 6, 7, 11, 12, 13, 14, 15)**

is an exact restatement of the same function, with nine terms.

## 5.2 Minimise by grouping the zeros

Nine maxterms is not a circuit anyone would build. The efficient route is
mechanical: fill the map, group the **0s** exactly as you would group 1s, read
off the minimal sum-of-products for the complement F', then apply De Morgan
once to the whole expression. Grouping the zeros of our function gives three
groups — the full CD column, the four cells with B true and D false, and the
whole AB = 11 row:

**F' = CD + BD' + AB**

Complementing both sides and pushing the bar inward turns each product into a
sum and each sum into a product:

**F = (C' + D')(B' + D)(A' + B')**

![Two Karnaugh maps of the same four-variable function side by side. The left map highlights the three groups of 1s that give the sum-of-products reading; the right map highlights the three groups of 0s that give the product-of-sums reading. Both readings were checked against the truth table over all sixteen input combinations before the figure was drawn.](/courses/fe-ee/figures/dig-kmap-groups.svg)

The figure is worth studying because it makes a point that a formula cannot:
the two readings use the same map, the same adjacency rules and the same
wrap-around, and they differ only in which cells you are allowed to circle.
Notice also that the group shapes are unrelated. The 1s want a corner group and
a wrapping pair; the 0s want a clean column and a clean row. There is no way to
guess one grouping from the other, which is why an exam question asking for POS
must be answered by actually grouping the zeros rather than by algebraically
mangling the SOP answer.

## 5.3 Which form should you build?

For this function the POS form is genuinely cheaper:

| Form | Expression | Terms | Literals | Gate structure |
|---|---|---|---|---|
| SOP | B'D' + B'C' + A'C'D | 3 | 7 | 3 AND gates into 1 OR |
| **POS** | (C'+D')(B'+D)(A'+B') | 3 | **6** | 3 OR gates into 1 AND |

Both need four gates, so the saving is one gate input, not one gate — which is
the honest scale of the difference and worth saying plainly. The real reason to
know both forms is technology mapping. A two-level SOP network converts to
**NAND-NAND** by simply replacing every gate with a NAND, and a two-level POS
network converts to **NOR-NOR** the same way. Since CMOS builds NAND and NOR
natively and builds AND and OR as a NAND or NOR followed by an inverter, the
form you choose decides how many inverters end up in the final circuit.

| Starting form | Direct mapping | Why it works |
|---|---|---|
| Sum of products | NAND-NAND | Two inversions on each path cancel |
| Product of sums | NOR-NOR | Same argument with the dual gate |

## 5.4 Don't-cares belong to both readings

If the specification leaves some input combinations unused, those cells may be
grouped as 1s while grouping 1s and as 0s while grouping 0s — whichever makes
that particular pass produce larger groups. A cell used as a 1 in the SOP pass
and as a 0 in the POS pass creates no contradiction, because you will build
only one of the two circuits. What you may not do is assume the two passes will
then produce logically identical circuits: they will agree on every specified
input and may disagree on the unused ones, which is exactly what a don't-care
licenses.

**How the exam asks this.** The giveaway words are "product of sums",
"maxterm", or a symbol list introduced with a capital pi rather than a capital
sigma. When you see them, do not minimise the 1s and then try to convert.
Group the zeros, write the minimal SOP of the complement, apply De Morgan once,
and stop. If the question instead hands you a POS expression and asks for the
minterm list, expand it: each sum term rules out exactly one row, so the
maxterm indices it names are the rows where F is 0 and every other row is a
minterm.`,
      examTip: 'Maxterm M(k) is the complement of minterm m(k): read the index bits, then complement the variables that carry a 1 and OR them. A quick sanity check is that the minterm list and the maxterm list of the same function are complementary sets whose sizes add to 2^n.',
      importantNote: 'Grouping the 0s gives you the minimal expression for F prime, not for F. The De Morgan step at the end is not optional bookkeeping — skipping it inverts the whole function, which is the single most common way this problem is failed.',
    },
    { id: 'numsys-positional', title: '6. Positional Notation Derived, and Conversion as an Algorithm',
      content: `## 6.1 One equation generates every base

Base ten is a habit, not a mathematical fact. Strip the habit away and what
remains is a single statement: a numeral is a list of digits, and the list is
shorthand for a weighted sum in which the weights are consecutive powers of one
chosen number. Write that down for an arbitrary base and every conversion rule
in this chapter becomes a consequence rather than a recipe to memorise.

$$N = \\sum_{i=-m}^{\\,n-1} d_i\\,b^{\\,i}, \\qquad 0 \\le d_i \\le b-1$$

Two conditions are doing all the work. The first is that the weights are powers
of a single base, which is what makes a column carry into its neighbour rather
than somewhere unpredictable. The second is that a digit is bounded by one less
than the base, which is what makes the representation unique. Drop the second
condition and 12 could be written as a "1" and a "2" or as a single digit worth
twelve; keeping it means one integer has exactly one numeral.

The number of integer digits follows immediately, because the largest value a
list of $n$ digits can hold is one short of the next power:

$$b^{\\,n-1} \\le N < b^{\\,n} \\quad \\Longleftrightarrow \\quad n = \\lfloor \\log_b N \\rfloor + 1$$

$$\\log_b N = \\frac{\\log_{10} N}{\\log_{10} b}$$

That change-of-base line is the one to carry into the exam room, because most
calculators offer only base-ten and natural logarithms.

### Worked Example 6.1 — how wide is a million?

**Given.** Store the decimal value 1,000,000 as an unsigned integer. How many
hexadecimal digits does it need, and how many bits?

**Hexadecimal.** Apply the digit-count formula with base 16.

$$\\log_{16} 1000000 = \\frac{6}{1.20412} = 4.983$$

$$n_{16} = \\lfloor 4.983 \\rfloor + 1 = 5$$

**Binary.** The same formula with base 2 gives a logarithm of 19.93, so twenty
bits, which agrees with the hexadecimal answer because five hex digits are
exactly twenty bits.

$$\\log_{2} 1000000 = \\frac{6}{0.30103} = 19.93$$

**The digits themselves**, by repeated division: 1000000 in hexadecimal is
F4240. Confirm it by expanding the positional sum, which is an independent
route back to the starting value rather than a re-reading of the divisions:

$$15 \\times 65536 + 4 \\times 4096 + 2 \\times 256 + 4 \\times 16 = 1000000$$

**Trap.** Answering "six digits, because a million has seven decimal digits and
hex is shorter" is guessing. The formula is two keystrokes and it is exact.

## 6.2 Repeated division, and a proof that it terminates

The conversion algorithm everybody learns as a rule falls straight out of the
positional sum once you factor a single $b$ out of every term except the
last one:

$$N = d_0 + b\\left(d_1 + d_2\\,b + \\cdots + d_{n-1}\\,b^{\\,n-2}\\right)$$

The bracket is an integer and $d_0$ is smaller than $b$, so the two
pieces are exactly the remainder and the quotient of dividing by the base:

$$d_0 = N \\bmod b, \\qquad N_1 = \\left\\lfloor \\frac{N}{b} \\right\\rfloor$$

Repeat on $N_1$ and the same argument peels off $d_1$, and so on. The
digits therefore emerge least significant first, which is why the remainders
are read from the bottom of the column upwards.

Termination is not an article of faith either. Each quotient is at most the
previous one divided by the base, and the base is at least two, so the sequence
strictly decreases until it reaches zero:

$$N_{k} \\le \\frac{N}{b^{\\,k}} \\quad \\Longrightarrow \\quad k_{\\max} = \\lfloor \\log_b N \\rfloor + 1$$

An integer conversion can never run away. A fractional one can, and section 6.3
explains exactly when.

### Worked Example 6.2 — 3,571 into three bases

**Given.** Convert the decimal integer 3,571 to hexadecimal, to octal, and to
binary, and cross-check the three answers against one another.

**Hexadecimal**, dividing by 16:

| Step | Dividend | Quotient | Remainder | Digit |
|---|---|---|---|---|
| 1 | 3571 | 223 | 3 | 3 |
| 2 | 223 | 13 | 15 | F |
| 3 | 13 | 0 | 13 | D |

Reading upwards, 3571 decimal is **0xDF3**. Check by expansion:

$$13 \\times 256 + 15 \\times 16 + 3 = 3571$$

**Octal**, dividing by 8:

| Step | Dividend | Quotient | Remainder | Digit |
|---|---|---|---|---|
| 1 | 3571 | 446 | 3 | 3 |
| 2 | 446 | 55 | 6 | 6 |
| 3 | 55 | 6 | 7 | 7 |
| 4 | 6 | 0 | 6 | 6 |

So 3571 decimal is **0o6763**, and expanding gives the same starting value:

$$6 \\times 512 + 7 \\times 64 + 6 \\times 8 + 3 = 3571$$

**Binary**, read off the hexadecimal without dividing again: D is 1101, F is
1111, 3 is 0011, so the value is 1101 1111 0011. Now regroup those same twelve
bits in threes from the right — 110 111 110 011 — and the octal digits 6, 7, 6,
3 appear. Two conversions carried out by different arithmetic have agreed on
one bit string, which is a real check and not a restatement.

## 6.3 Fractions multiply, and sometimes never finish

Below the radix point the same derivation runs with the powers going the other
way. Multiplying the fraction by the base moves one digit across the point:

$$F = \\sum_{k=1}^{\\infty} f_k\\,b^{-k}, \\qquad b\\,F = f_1 + \\sum_{k=2}^{\\infty} f_k\\,b^{-(k-1)}$$

$$f_1 = \\lfloor b\\,F \\rfloor, \\qquad F_1 = b\\,F - f_1$$

So the algorithm is: multiply, write down the integer part that pops out, keep
the fraction, repeat. Digits emerge **most** significant first, the opposite of
the integer case, which is the single most common place students reverse a
digit string.

Whether it ever stops is a question about arithmetic, not about patience.
Suppose the fraction in lowest terms is $p/q$. The expansion terminates
after $K$ digits exactly when $b^{K}p/q$ is an integer, which forces
every prime factor of $q$ to be a factor of $b$:

$$\\frac{p}{q} \\text{ terminates in base } b \\iff \\text{every prime dividing } q \\text{ also divides } b$$

In binary that reduces to a one-line test: the denominator must be a power of
two. When it is not, the algorithm's internal state is a remainder drawn from a
finite set, so a state must recur, and from that point the digits repeat
forever. Strip the factors of two out of $q$ to leave an odd $q'$; the
length of the repeating block is the smallest power of the base that is one
more than a multiple of $q'$:

$$L = \\min \\left\\lbrace \\, k \\ge 1 \\; : \\; b^{\\,k} \\equiv 1 \\pmod{q'} \\, \\right\\rbrace$$

$$0 \\;\\le\\; F - \\sum_{k=1}^{K} f_k\\,2^{-k} \\;<\\; 2^{-K}$$

The last line is the error you accept by stopping after $K$ bits, and it is
the reason a fixed-point sensor reading has a floor on its accuracy that no
amount of averaging removes.

### Worked Example 6.3 — one fraction that stops and one that cannot

**Given.** Convert 0.625 and 0.7 to binary. Predict the behaviour of each
before computing anything.

**Prediction.** 0.625 is 5/8 in lowest terms; the denominator is a power of
two, so the expansion terminates, and it terminates in three bits because
$8 = 2^3$. 0.7 is 7/10; the denominator carries a factor of five, which does
not divide two, so the expansion repeats forever. Removing the single factor of
two leaves $q' = 5$, and the powers of two modulo five run 2, 4, 3, 1, so the
repeating block is four bits long.

**0.625**, by repeated multiplication:

| Step | Value | Doubled | Digit emitted | Remainder |
|---|---|---|---|---|
| 1 | 0.625 | 1.250 | **1** | 0.250 |
| 2 | 0.250 | 0.500 | **0** | 0.500 |
| 3 | 0.500 | 1.000 | **1** | 0.000 |

The remainder reaches zero, so the answer is exactly **0.101** and nothing
follows it. Check by expansion:

$$0.5 + 0.125 = 0.625$$

**0.7**, the same procedure:

| Step | Value | Doubled | Digit emitted | Remainder |
|---|---|---|---|---|
| 1 | 0.7 | 1.4 | **1** | 0.4 |
| 2 | 0.4 | 0.8 | **0** | 0.8 |
| 3 | 0.8 | 1.6 | **1** | 0.6 |
| 4 | 0.6 | 1.2 | **1** | 0.2 |
| 5 | 0.2 | 0.4 | **0** | 0.4 |

Row 5 hands back the remainder that row 2 started with, so rows 2 through 5
repeat without end. The expansion is 0.1 followed by 0110 forever, exactly the
four-bit period the prediction promised. Truncating after eight bits keeps
0.10110011, which is 179/256, and the error left behind is

$$\\frac{7}{10} - \\frac{179}{256} = \\frac{896 - 895}{1280} = \\frac{1}{1280}$$

or 7.8125e-4, comfortably inside the 2^-8 bound of 3.90625e-3.

![Truncation error against the number of binary fraction bits kept, for the decimal fractions 0.7 and 0.1, plotted on a logarithmic scale against the bound 2 to the minus k. Neither error ever reaches zero because neither denominator is a power of two; the marked point shows that eight bits of 0.7 leave an error of exactly 1/1280, which is 7.8125e-4.](/courses/fe-ee/figures/dig2-frac-binary.svg)

The staircase in the figure is worth a second look. The error does not fall
smoothly; it falls whenever the next emitted bit is a 1 and stalls whenever it
is a 0, so the curve tracks the repeating block. That is the visual signature
of a periodic expansion, and it is why the two decimal fractions in the figure
have curves of the same shape shifted against one another: 0.1 is 0.7 divided
by seven, but in binary they share the same four-bit cycle because they share
the same odd part of the denominator.

### Worked Example 6.4 — a mixed number into octal and hexadecimal

**Given.** Convert 1011011110.0110 in binary to hexadecimal, to octal, and to
decimal.

**Why grouping works.** When the base is itself a power of two, say
$b = 2^k$, the positional sum can be re-bracketed $k$ bits at a time
without any arithmetic at all, because each bracket is worth exactly one digit
of the larger base:

$$\\sum_i d_i\\,2^{\\,i} \\;=\\; \\sum_j \\left(\\text{the } k \\text{ bits of group } j\\right) \\left(2^{\\,k}\\right)^{j}$$

**Hexadecimal**, four bits per digit, padding the integer part on the **left**
and the fraction on the **right**:

| Part | Padded bits | Groups | Digits |
|---|---|---|---|
| integer | 001011011110 | 0010 1101 1110 | 2 D E |
| fraction | 0110 | 0110 | 6 |

So the value is **0x2DE.6**.

**Octal**, three bits per digit, with the padding redone for the new group size:

| Part | Padded bits | Groups | Digits |
|---|---|---|---|
| integer | 001011011110 | 001 011 011 110 | 1 3 3 6 |
| fraction | 011000 | 011 000 | 3 0 |

So the value is **0o1336.30**.

**Decimal**, from the hexadecimal, which is the least error-prone route:

$$2 \\times 256 + 13 \\times 16 + 14 = 734$$

$$6 / 16 = 0.375$$

The value is **734.375**. Cross-check from the octal instead and the same
number appears:

$$1 \\times 512 + 3 \\times 64 + 3 \\times 8 + 6 = 734$$

**Trap.** Padding the fraction on the left instead of the right. Writing the
fraction bits 0110 as 000110 for octal gives 0.06 rather than 0.30 — a value of
0.09375 instead of 0.375, wrong by a factor of four. The integer part pads
towards the high end and the fraction pads towards the low end, because in both
cases you are adding zeros **away** from the radix point.`,
      examTip: 'Integer parts divide and are read bottom-up; fractional parts multiply and are read top-down. Reversing one of those two is the most common conversion error, and it is easy to catch: expand your answer back and see whether the original number reappears.',
      importantNote: 'A decimal fraction has an exact binary form only when its lowest-terms denominator is a power of two. 0.5, 0.25 and 0.625 are exact; 0.1, 0.2 and 0.7 are not, and no number of bits will make them so.',
    },
    { id: 'numsys-signed', title: '7. Signed Representations Compared, and the Overflow Rule Proved',
      content: `## 7.1 Three conventions, one set of patterns

An $n$-bit word is $2^n$ patterns and nothing more. A signed convention is
a decision about which value each pattern names, and three such decisions have
been used in real hardware. Each is a positional sum with one weight altered:

$$\\text{sign-magnitude:} \\quad V = (-1)^{d_{n-1}} \\sum_{i=0}^{n-2} d_i\\,2^{\\,i}$$

$$\\text{one's complement:} \\quad V = \\sum_{i=0}^{n-2} d_i\\,2^{\\,i} - d_{n-1}\\left(2^{\\,n-1} - 1\\right)$$

$$\\text{two's complement:} \\quad V = -\\,d_{n-1}\\,2^{\\,n-1} + \\sum_{i=0}^{n-2} d_i\\,2^{\\,i}$$

Only the third gives the top bit an ordinary positional weight, merely a
negative one. That single difference is why two's complement addition needs no
special hardware: the weights still add columnwise, so the same ripple adder
that handles unsigned words handles signed ones untouched.

![Value assigned to each of the sixteen 4-bit patterns by sign-magnitude, one's complement and two's complement, plotted against the pattern read as an unsigned integer. The first two conventions each map two patterns to zero and span -7 to +7; two's complement is one-to-one and spans -8 to +7, with the marked point showing that 1000 names -8.](/courses/fe-ee/figures/dig2-signed-maps.svg)

| Property | Sign-magnitude | One's complement | Two's complement |
|---|---|---|---|
| Patterns for zero | 2 | 2 | **1** |
| Distinct values in 4 bits | 15 | 15 | **16** |
| Range in n bits | -(2^(n-1)-1) to +(2^(n-1)-1) | same | -2^(n-1) to +2^(n-1)-1 |
| Negate by | flip the top bit | invert all bits | invert all bits, add 1 |
| Adder | needs magnitude compare | needs end-around carry | plain binary adder |
| Unsigned compare orders values | no, negatives run backwards | no, negatives run backwards | no, negatives sort above positives |

## 7.2 Where the asymmetry comes from

The asymmetric range is often presented as a quirk to memorise. It is a
counting result. There are $2^n$ patterns; sign-magnitude and one's
complement each spend two of them on zero, leaving $2^n - 1$ distinct
values, an odd count that splits evenly either side of zero. Two's complement
spends one pattern on zero, leaving an even count $2^n - 1$ of nonzero
values that cannot split evenly — one side must get an extra member, and the
negative side gets it.

$$-2^{\\,n-1} \\;\\le\\; V \\;\\le\\; 2^{\\,n-1} - 1$$

The negation rule comes from the same place. Inverting every bit of $x$
gives the pattern whose unsigned value is $2^n - 1 - x$, because a bit and
its complement always sum to one in every column:

$$x + \\overline{x} = 2^{\\,n} - 1 \\quad \\Longrightarrow \\quad \\overline{x} + 1 = 2^{\\,n} - x$$

So "invert and add one" is arithmetic modulo $2^n$, and every two's
complement operation is that arithmetic. It also predicts the one pattern where
negation fails, namely the fixed point of $x \\mapsto 2^n - x$:

$$2^{\\,n} - 2^{\\,n-1} = 2^{\\,n-1}$$

### Worked Example 7.1 — negating the most negative number

**Given.** In 8-bit two's complement, negate -128.

**The value.** -128 is 10000000, since the top weight is -128 and every other
weight contributes nothing.

**Apply the rule.** Invert: 01111111. Add one: 10000000. The pattern is
unchanged, so the machine reports -128 as the negation of -128.

**Why.** The true answer +128 needs a range that stops at +127, so it does not
exist in eight bits. The hardware does not silently pick something close; it
returns the modular answer and sets the overflow flag, because 128 and -128 are
the same residue modulo 256.

$$-(-128) \\equiv 128 \\equiv -128 \\pmod{256}$$

**Trap.** Answering +128 and writing it as 10000000. That is the same bit
pattern as -128, so the "answer" is the input. Any signed operation whose
result you can write only by leaving the range has overflowed, and this is the
single case where negation alone can do it.

## 7.3 The overflow rule, proved rather than asserted

Section 4.3 stated the working rule — overflow is the exclusive-OR of the carry
into the top column with the carry out of it — and verified it by enumeration.
Here is why it is true, which is worth twenty minutes because the proof is
short and the rule is otherwise pure memorisation.

Split each operand into its sign bit and its lower part, with
$A_L$ and $B_L$ both in the range 0 to $2^{n-1}-1$:

$$a = -a_{n-1}2^{\\,n-1} + A_L, \\qquad b = -b_{n-1}2^{\\,n-1} + B_L$$

The lower columns add first and produce the carry into the top column:

$$A_L + B_L = c_{n-1}\\,2^{\\,n-1} + R, \\qquad 0 \\le R < 2^{\\,n-1}$$

so the true mathematical sum is

$$a + b = 2^{\\,n-1}\\left(c_{n-1} - a_{n-1} - b_{n-1}\\right) + R$$

The stored result keeps the same lower bits $R$ and a top bit produced by
the top full adder, so its value is

$$s = -s_{n-1}\\,2^{\\,n-1} + R, \\qquad s_{n-1} = a_{n-1} \\oplus b_{n-1} \\oplus c_{n-1}$$

Subtract, and the $R$ terms cancel:

$$a + b - s = 2^{\\,n-1}\\left(c_{n-1} - a_{n-1} - b_{n-1} + s_{n-1}\\right)$$

Now use the identity every full adder satisfies — three input bits sum to the
sum bit plus twice the carry out:

$$a_{n-1} + b_{n-1} + c_{n-1} = s_{n-1} + 2\\,c_{n}$$

Substituting and collecting terms leaves a single clean statement:

$$a + b - s = 2^{\\,n}\\left(c_{n-1} - c_{n}\\right)$$

The stored result equals the true sum **exactly** when $c_{n-1} = c_n$, and
misses it by a full $2^n$ otherwise. That is the rule:

$$V = c_{n-1} \\oplus c_{n}$$

An equivalent form drops the internal carry and looks only at signs, which is
the version usable when a problem shows you operands and a result but no carry
chain:

$$V = a_{n-1}b_{n-1}\\overline{s_{n-1}} + \\overline{a_{n-1}}\\,\\overline{b_{n-1}}\\,s_{n-1}$$

Read it in words: overflow happens when two negatives produce a positive, or
two positives produce a negative, and in no other case. Both expressions were
checked against each other over all eight combinations of the three carry-chain
bits, and the flag itself was checked against its meaning over all 256 pairs of
4-bit operands.

![All 256 pairs of 4-bit two's complement operands, each square coloured by which flags the addition raises. Sixty-four pairs set the overflow flag, one hundred and twenty set the carry flag, and thirty-six set both, so neither region contains the other. The overflow region is two rectangles in the same-sign quadrants and is empty wherever the operand signs differ.](/courses/fe-ee/figures/dig2-overflow-map.svg)

The picture makes the independence concrete. The overflow squares sit only in
the two same-sign quadrants, exactly as the sign form of the rule predicts, and
the whole lower-left block of both-negative pairs raises **both** flags, which
is why "the carry came out, so it overflowed" is a wrong reading that
nevertheless gets the right answer a third of the time.

### Worked Example 7.2 — reading both flags off a 16-bit add

**Given.** An 8-bit machine adds 0x7F and 0x01. Report the result, the carry
flag, the overflow flag, and the correct interpretation under each reading.

**The addition.** 0x7F is 01111111 and 0x01 is 00000001. Adding columnwise,
every column from bit 0 up to bit 6 generates a carry, so the carry into the
top column is 1. The top column adds 0, 0 and 1, giving a sum bit of 1 and a
carry out of 0.

**The flags.** $c_{n-1} = 1$ and $c_n = 0$, so $V = 1$ and $C = 0$.

**The result.** 10000000, which is 128 unsigned and -128 signed.

$$127 + 1 = 128$$

**Interpretation.** Read as unsigned, 128 is correct and the cleared carry
confirms it. Read as signed, the answer should be +128, the range stops at
+127, and the set overflow flag says so. One addition, two verdicts, both
right, which is precisely why processors keep two flags.

**Trap.** Concluding "no carry, therefore no problem". The carry flag answers
only the unsigned question. This example has the cleanest possible unsigned
result and a broken signed one.

## 7.4 Sign extension, truncation, and where they bite

Widening a two's complement number means replicating the sign bit, not padding
with zeros, because the top weight must remain the most negative one:

$$-2^{\\,n-1} + \\sum_{i=k}^{n-2} 2^{\\,i} = -2^{\\,k}$$

That identity is the whole justification: a run of ones from bit $k$ upwards
in a wider word carries exactly the value the narrower word's sign bit carried.

### Worked Example 7.3 — 0xF3 widened and narrowed

**Given.** The 8-bit two's complement byte 0xF3. Extend it to sixteen bits, and
then truncate the original to four bits. Report both values.

**Reading the byte.** 0xF3 is 11110011. The top bit is 1, so the value is

$$-128 + 64 + 32 + 16 + 2 + 1 = -13$$

**Sign extension.** Replicate the 1 across the new high byte: 0xFFF3. Check by
reading the wider word directly, which is an independent route:

$$65523 - 65536 = -13$$

**Truncation to four bits.** Keep 0011, which is +3. The value has changed,
because the discarded bits were not all copies of the new sign bit — they were
1111 while the new sign bit is 0.

**The safe condition.** Truncating from $n$ bits to $k$ preserves the
value if and only if every discarded bit equals the retained top bit:

$$d_{n-1} = d_{n-2} = \\cdots = d_{k-1}$$

**Trap.** Zero-extending 0xF3 to 0x00F3, which is +243. That is the correct
answer for an *unsigned* byte and the wrong one for a signed byte, and the two
differ by 256. Compilers get this right only because the type says which one
you meant.

## 7.5 One's complement, and the carry that comes back round

One's complement is obsolete as an arithmetic format but survives in the
Internet checksum, so its addition rule still appears. Because the negative of
$x$ is $2^n - 1 - x$ rather than $2^n - x$, a sum computed modulo
$2^n$ lands one short whenever it wraps. The fix is to add the carry-out
back into the least significant bit:

$$s = \\left(a + b\\right) \\bmod 2^{\\,n} + \\left\\lfloor \\frac{a+b}{2^{\\,n}} \\right\\rfloor$$

### Worked Example 7.4 — end-around carry in four bits

**Given.** Compute 5 + (-3) in 4-bit one's complement.

**Encode.** +5 is 0101. +3 is 0011, so -3 is its bitwise inverse, 1100.

**Add.** 0101 + 1100 = 1 0001. A carry has come out of the top column.

**End-around.** Add that carry back into the bottom: 0001 + 1 = 0010, which is
+2.

$$5 - 3 = 2$$

**Trap.** Stopping at 0001 and answering +1. The end-around carry is not
optional bookkeeping; without it every one's complement sum that wraps is low
by exactly one. In two's complement the same addition needs no correction,
which is the practical reason the format won.`,
      examTip: 'Two facts settle most signed-number questions: the range is -2^(n-1) to +2^(n-1)-1, and overflow requires operands of the same sign. If a problem adds a positive to a negative and asks about overflow, the answer is no, whatever the carry does.',
      importantNote: 'Sign extension replicates the sign bit; zero extension does not. Applying the wrong one to a byte such as 0xF3 gives -13 or +243, and both are legitimate answers to different questions. The type of the variable decides, not the bits.',
    },
    { id: 'numsys-ieee', title: '8. IEEE-754 Single Precision, Field by Field',
      content: `## 8.1 Three fields and one convention that ties them together

Fixed-point formats spend their bits on a fixed range and a fixed resolution.
Floating point spends them on a fixed number of *significant* digits and lets
the range follow. The single-precision format packs that idea into 32 bits:

$$x = (-1)^{s}\\left(1 + f\\right)2^{\\,E - 127}, \\qquad f = \\frac{M}{2^{\\,23}}, \\qquad 1 \\le E \\le 254$$

| Field | Bits | Position | Holds |
|---|---|---|---|
| sign, s | 1 | 31 | 0 for positive, 1 for negative |
| biased exponent, E | 8 | 30 down to 23 | the true exponent plus 127 |
| stored fraction, M | 23 | 22 down to 0 | the bits after the implicit leading 1 |

Two design choices deserve more than a mention. The first is the **implicit
leading one**. Normalising a nonzero binary number always puts a single 1
immediately left of the point, so storing that bit would waste it; the format
omits it and gets 24 bits of precision out of 23 bits of storage. The second is
the **bias**, chosen as one less than half the exponent field's span:

$$\\text{bias} = 2^{\\,k-1} - 1 = 2^{7} - 1 = 127$$

Bias rather than two's complement, because a biased exponent makes the whole
32-bit word sort correctly as an unsigned integer for positive values. Hardware
that compares floats can then reuse the integer comparator, and a sort routine
can order an array of positive floats by treating them as integers.

## 8.2 Encoding, worked all the way to the hexadecimal

### Worked Example 8.1 — encode -13.625

**Given.** Represent the decimal value -13.625 in IEEE-754 single precision and
report the 32-bit word in hexadecimal.

**Step 1, the binary value.** The integer part 13 is 1101. The fraction 0.625
terminates in three bits, as section 6.3 predicted, giving 101. So the number is
1101.101 in binary. Check:

$$8 + 4 + 1 + 0.5 + 0.125 = 13.625$$

**Step 2, normalise.** Move the point three places left so exactly one 1 sits
in front of it:

$$13.625 = 1.703125 \\times 2^{3}$$

**Step 3, the fields.** The sign bit is 1. The true exponent is 3, so the
biased exponent is

$$3 + 127 = 130$$

which is 10000010 in binary. The stored fraction is everything after the
leading 1, namely 101101, padded on the right to 23 bits:

$$M = 0.703125 \\times 8388608 = 5898240$$

and 5898240 in hexadecimal is 0x5A0000.

**Step 4, assemble.** Concatenating 1, 10000010 and 10110100000000000000000
gives the word **0xC15A0000**.

![The 32 bits of the IEEE-754 single precision encoding of -13.625, drawn as one sign bit, an eight-bit biased exponent holding 130, and a twenty-three bit stored fraction holding 0x5A0000, with the assembled word 0xC15A0000 and the decoding arithmetic printed underneath.](/courses/fe-ee/figures/dig2-ieee754-fields.svg)

**Check, by the opposite route.** Decode the word without looking at the
working above. The sign bit is 1. The exponent field 10000010 is 130, so the
true exponent is 3. The fraction field gives 5898240/8388608 = 0.703125, and
the significand is therefore 1.703125.

$$1.703125 \\times 8 = 13.625$$

**Trap.** Storing the leading 1 in the fraction field. Writing 1101101 into the
top of the fraction instead of 101101 yields the word 0xC16D0000, which decodes
to -14.8125 rather than -13.625. The leading 1 is implied by a nonzero exponent
field and must never appear in the stored bits.

### Worked Example 8.2 — decode 0x41C80000

**Given.** Interpret the 32-bit word 0x41C80000 as a single-precision float.

**Split the word.** In binary, 0x41C80000 is
01000001110010000000000000000000. Take the fields in order: the sign is 0, the
next eight bits 10000011 form the exponent field, and the remaining
twenty-three bits 10010000000000000000000 form the fraction.

| Field | Bits | Value |
|---|---|---|
| s | 0 | positive |
| E | 10000011 | 131 |
| M | 100 1000 0000 0000 0000 0000 | 4718592 |

**Assemble the value.** The true exponent is

$$131 - 127 = 4$$

and the significand is one plus the stored fraction, where only two fraction
bits are set, worth one half and one sixteenth:

$$1 + 0.5 + 0.0625 = 1.5625$$

$$1.5625 \\times 16 = 25$$

The value is **+25.0**.

**Check, independently.** 25 in binary is 11001, which normalises to
1.1001 x 2^4. The exponent 4 biased by 127 gives 131, and the fraction bits
after the leading 1 are 1001, matching the field read off the word. Two routes,
one answer.

**Trap.** Forgetting the bias and reporting 2^131, or subtracting 128 instead
of 127 and landing on 2^3, which would make the answer 12.5 — exactly half the
truth, which is what an off-by-one in a binary exponent always costs.

## 8.3 The five classes of encoding

The formula in section 8.1 applies only while the exponent field is in its
normal range. The two extreme exponent fields are reserved, which is what buys
the format its zeros, its infinities and its error signals:

| E | M | Meaning | Value |
|---|---|---|---|
| 0 | 0 | signed zero | +0 or -0 |
| 0 | nonzero | subnormal | (-1)^s times M/2^23 times 2^-126 |
| 1 to 254 | any | normal | (-1)^s times (1+f) times 2^(E-127) |
| 255 | 0 | infinity | +inf or -inf |
| 255 | nonzero | not a number | NaN |

Subnormals exist so that subtraction of two nearby numbers cannot round to zero
while the operands differ, a property called gradual underflow. They pay for it
with precision: a subnormal has no implicit leading 1, so its significand
carries fewer than 24 meaningful bits, and the smallest of them carries one.

$$x_{\\min,\\text{normal}} = 2^{-126} = 1.1754944 \\times 10^{-38}$$

$$x_{\\min,\\text{subnormal}} = 2^{-149} = 1.4012985 \\times 10^{-45}$$

$$x_{\\max} = \\left(2 - 2^{-23}\\right)2^{127} = 3.4028235 \\times 10^{38}$$

## 8.4 Resolution: what 24 bits actually buys

Precision in a floating-point format is relative, not absolute. Within one
binade — one interval between consecutive powers of two — the representable
values are evenly spaced, and that spacing doubles at every power of two:

$$\\operatorname{ulp}(x) = 2^{\\,\\lfloor \\log_2 \\lvert x \\rvert \\rfloor - 23}$$

$$\\varepsilon = 2^{-23} = 1.1920929 \\times 10^{-7}$$

Round-to-nearest can never miss by more than half a spacing, which bounds the
relative error of storing any real number in range:

$$\\left\\lvert \\frac{\\hat{x} - x}{x} \\right\\rvert \\le 2^{-24} = 5.9604645 \\times 10^{-8}$$

In decimal terms that is between seven and eight significant digits, since

$$23 \\times 0.30103 = 6.924$$

![Spacing between neighbouring single-precision values against magnitude, on logarithmic axes over thirty-one binades. The spacing is a straight line of unit slope: it is 2 to the minus 23 at a magnitude of 1.0, and reaches 2.0 at a magnitude of 2 to the 24th, which is 16777216, the point beyond which odd integers cease to be representable.](/courses/fe-ee/figures/dig2-ulp-spacing.svg)

The right-hand end of that figure carries a fact worth remembering for its own
sake. Integers are represented exactly only while the spacing is at most one,
which holds up to $2^{24}$:

$$2^{24} = 16777216$$

Past that point the spacing is 2, so 16777217 does not exist as a
single-precision value. Counters and identifiers stored in a 32-bit float
therefore stop counting at about sixteen million while still appearing to have
plenty of range, which is a real and recurring defect in instrument firmware.

### Worked Example 8.3 — how wrong is 0.1?

**Given.** Encode the decimal value 0.1 in single precision and quantify the
error.

**Normalise.** Section 6.3 established that 0.1 in binary is 0.0 followed by
0011 repeating. Shifting to put one 1 in front of the point moves the point
four places right:

$$0.1 = 1.6 \\times 2^{-4}$$

**The fields.** The sign is 0. The biased exponent is

$$-4 + 127 = 123$$

which is 01111011. The stored fraction must hold 0.6, and 0.6 is not
representable either, so the hardware rounds:

$$0.6 \\times 8388608 = 5033164.8$$

Round to nearest gives $M = 5033165$, which is 0x4CCCCD. Notice the final
digit: the repeating pattern CCCC ends in D because the rounding went **up**.
The assembled word is **0x3DCCCCCD**.

**The stored value, exactly.** Rebuild the rational number the bits name:

$$\\hat{x} = \\frac{8388608 + 5033165}{8388608} \\times 2^{-4} = \\frac{13421773}{134217728}$$

which is 0.10000000149011612 in decimal. The absolute error is about
1.4901161e-9 and the relative error about 1.4901161e-8, comfortably inside the
5.9604645e-8 bound from section 8.4.

**Trap.** Assuming the stored value is slightly *less* than 0.1 because
truncation is the usual failure mode. It is slightly greater, because IEEE-754
specifies round-to-nearest rather than truncation, and here the discarded tail
0.8 was above half. Which direction the error goes matters whenever a loop
accumulates it.

### Worked Example 8.4 — the smallest addition that changes nothing

**Given.** In single precision, what is the smallest positive value that can be
added to 1000.0 and still change it?

**Find the binade.** 1000 lies between $2^9 = 512$ and $2^{10} = 1024$,
so its exponent is 9 and the spacing is

$$\\operatorname{ulp}(1000) = 2^{\\,9 - 23} = 2^{-14} = 6.1035156 \\times 10^{-5}$$

**Apply round-to-nearest.** Anything strictly greater than half a spacing
rounds the result up to the next representable value; anything less rounds back
to 1000.0. Half a spacing is

$$2^{-15} = 3.0517578 \\times 10^{-5}$$

**Answer.** Additions above about 3.05e-5 change the stored value; additions
below it vanish. Accumulating a hundred thousand increments of 1e-5 into a
single-precision total near 1000 therefore adds nothing at all, while the same
loop in double precision behaves.

**Trap.** Quoting the machine epsilon 1.1920929e-7 as the answer. Epsilon is
the spacing at 1.0; at 1000 the spacing is 512 times larger, because floating
point resolution scales with magnitude.`,
      examTip: 'Single precision: 1 sign bit, 8 exponent bits with bias 127, 23 stored fraction bits and one implicit leading 1. Encode by normalising to a significand between 1 and 2; decode by adding the leading 1 back before scaling. Both directions live or die on the bias.',
      importantNote: 'The exponent fields 0 and 255 are reserved and do not follow the normal formula. E of 0 means zero or subnormal, E of 255 means infinity or NaN. A decode that produces 2^128 or 2^-127 from a normal formula has almost certainly walked into a reserved field.',
    },
    { id: 'numsys-problems', title: '9. Problem Sets: Bases, Signs and Floats',
      content: `## 9.1 How to use these

Each problem below has a full solution, and each solution names the distractor
that the question is built around and states the wrong number that distractor
produces. Work the problem before reading on; the value is in finding out which
trap you personally fall into, and the wrong answers listed are the ones that
appear as options on real exams.

## Problem Set 1 — Conversions and codes

**P1.1.** Convert 0.8125 decimal to binary, and state whether the expansion
terminates.

**P1.2.** Add 0x9E and 0x7F as unsigned bytes. Give the result in hexadecimal
and state the carry.

**P1.3.** A 4-bit Gray-coded shaft encoder reads 1011. What angular position
does that represent, expressed as a count from zero?

**P1.4.** Add the packed BCD bytes 0x47 and 0x38. Give the corrected result.

**P1.5.** Convert 0o457 to hexadecimal without passing through decimal.

### Solutions to Problem Set 1

**P1.1.** 0.8125 is 13/16 in lowest terms. The denominator is a power of two,
so the expansion terminates, and it terminates in four bits. Repeated
multiplication gives 1, then 1, then 0, then 1:

$$0.5 + 0.25 + 0.0625 = 0.8125$$

The answer is **0.1101**. *Distractor:* reading the emitted digits bottom-up as
you would for an integer conversion, giving 0.1011, which is 0.6875 — wrong by
0.125 and in the wrong direction.

**P1.2.** 0x9E is 158 and 0x7F is 127.

$$158 + 127 = 285$$

285 exceeds 255, so a carry leaves the byte, and the retained result is

$$285 - 256 = 29$$

The answer is **0x1D with the carry flag set**. *Distractor:* reporting 0x11D
as an eight-bit result. A byte cannot hold nine bits; the ninth bit is the
carry flag, not a digit of the answer.

**P1.3.** Decode Gray to binary with a running exclusive-OR from the top. The
first bit copies: 1. The second is 1 XOR 0 = 1. The third is that result XOR 1
= 0. The fourth is that result XOR 1 = 1. The binary value is 1101, which is
**13**. *Distractor:* reading 1011 as ordinary binary and answering 11. Gray
1011 and binary 1011 are different positions, and mistaking one for the other
is exactly the failure the code exists to prevent elsewhere.

**P1.4.** Add the low digits: 7 + 8 = 15, which exceeds 9, so add six to get 21
— that is a digit of 5 with a carry of 1. Add the high digits with that carry:
4 + 3 + 1 = 8, which is within range and needs no correction. The answer is
**0x85**, read as eighty-five.

$$47 + 38 = 85$$

*Distractor:* reporting the raw binary sum 0x7F. In BCD that byte is not even a
legal number, since F is not a decimal digit — a useful self-check, because any
BCD result containing A through F is definitionally wrong.

**P1.5.** Expand each octal digit to three bits: 4 is 100, 5 is 101, 7 is 111,
giving 100101111. Regroup the same nine bits in fours from the right, padding
the left with zeros: 0001 0010 1111. The answer is **0x12F**. Confirm through
decimal as an independent route:

$$4 \\times 64 + 5 \\times 8 + 7 = 303$$

$$1 \\times 256 + 2 \\times 16 + 15 = 303$$

*Distractor:* regrouping from the left instead of the right, which gives 1001
0111 1 and an answer of 0x97 with a bit left over. Grouping always starts at
the radix point and works outward.

## Problem Set 2 — Signed arithmetic and floating point

**P2.1.** An 8-bit ALU computes 0xC0 + 0xA0 with both operands read as two's
complement. Give the result, the carry flag and the overflow flag.

**P2.2.** What decimal value does the single-precision word 0xBF000000
represent?

**P2.3.** A 12-bit two's complement ADC reports 0xF38. What signed value is
that, and what is it after sign extension to sixteen bits?

**P2.4.** Encode +6.75 in single precision and give the hexadecimal word.

**P2.5.** A 16-bit counter is stored in a single-precision float and
incremented by one each tick. At what count does the increment stop having any
effect, and why is 16 bits safe?

### Solutions to Problem Set 2

**P2.1.** 0xC0 is 11000000, which as a signed byte is

$$-128 + 64 = -64$$

0xA0 is 10100000, which is

$$-128 + 32 = -96$$

The true sum is -160, which is below -128 and therefore out of range. In bits,
11000000 + 10100000 = 1 01100000, so the stored byte is **0x60** — that is
+96 read as signed — with **C = 1** and **V = 1**. The carry into the top column
was 0 and the carry out was 1, and their exclusive-OR is the overflow flag.
*Distractor:* answering "no overflow, because a carry came out and carries are
normal for negative numbers". That reasoning is right for a mixed-sign
addition, and these operands are both negative, where a carry out is expected
and the overflow flag is the only one that says anything.

**P2.2.** 0xBF000000 in binary is 1 01111110 00000000000000000000000. The sign
is negative. The exponent field is 126, so the true exponent is

$$126 - 127 = -1$$

The fraction field is all zeros, so the significand is exactly 1.0, and the
value is **-0.5**.

$$1 \\times 0.5 = 0.5$$

*Distractor:* reading the all-zero fraction as a significand of 0.0 and
answering -0.0. The leading 1 is implicit whenever the exponent field is
nonzero; only an exponent field of zero drops it.

**P2.3.** 0xF38 is 1111 0011 1000 in twelve bits. The top bit is set, so the
value is negative. Its magnitude is the two's complement: invert to 0000 1100
0111 and add one to get 0000 1100 1000, which is 0xC8, or 200. The value is
**-200**. Sign-extending to sixteen bits replicates the leading 1, giving
**0xFF38**. Check the wider word directly:

$$65336 - 65536 = -200$$

*Distractor:* zero-extending to 0x0F38 and answering +3896. That is the correct
reading of an unsigned 12-bit sample and the wrong reading of a signed one; a
bipolar ADC needs the sign extension, a unipolar one does not.

**P2.4.** 6.75 is 110.11 in binary, since

$$4 + 2 + 0.5 + 0.25 = 6.75$$

Normalising moves the point two places left: 1.1011 x 2^2. The sign is 0, the
biased exponent is

$$2 + 127 = 129$$

which is 10000001, and the stored fraction is 1011 followed by nineteen zeros.
Assembling gives 0 10000001 10110000000000000000000, which is **0x40D80000**.
*Distractor:* biasing with 128 rather than 127 and producing 0x41580000, which
decodes to 13.5 — double the intended value, the standard cost of an off-by-one
in the exponent.

**P2.5.** Increments of one keep working while the spacing between neighbouring
floats is at most one, which holds up to

$$2^{24} = 16777216$$

Past that the spacing is 2 and adding 1 rounds straight back to where it
started, so the counter freezes. A 16-bit counter tops out at 65535, far below
16777216, so every one of its values is exact and the storage is **safe**.
*Distractor:* assuming a 32-bit float safely holds any 32-bit integer because
both are four bytes wide. They are the same size and not the same set: the
float spends eight bits on an exponent and therefore represents only about
sixteen million consecutive integers, not four billion.

## Practice Problems 3 — Rapid checks

Short items to run against a clock. Target ninety seconds each.

**P3.1.** How many bits does an unsigned counter need to reach 5,000?

**P3.2.** Is 0x80000000 a positive or negative float, and what is its value?

**P3.3.** In 6-bit two's complement, what is the range?

**P3.4.** Convert 100 decimal to Gray code.

### Solutions to Practice Problems 3

**P3.1.** Solve for the width from the positional bound:

$$\\log_{2} 5000 = \\frac{3.69897}{0.30103} = 12.288$$

Twelve bits reach 4095 and thirteen reach 8191, so **13 bits**. *Distractor:*
taking the floor of the logarithm and answering 12. The count of bits is the
floor plus one, and 5000 sits above the 12-bit ceiling.

**P3.2.** The sign bit is 1 and every other bit is 0, so the exponent field is
0 and the fraction field is 0. That is the reserved encoding for **negative
zero**, not a huge negative number. *Distractor:* reading it as the most
negative float by analogy with two's complement integers, where 0x80000000 is
indeed the most negative value. Floating point is sign-magnitude, so the same
pattern means something entirely different.

**P3.3.** Substitute n = 6 into the two's complement range:

$$-32 \\le V \\le 31$$

*Distractor:* answering -31 to +31 by assuming symmetry. There is one extra
negative value because there is only one zero.

**P3.4.** 100 in binary is 1100100. Exclusive-OR each bit with its left
neighbour, treating the neighbour of the top bit as 0: the Gray code is
**1010110**. Check by decoding with a running exclusive-OR: 1, then 1 XOR 0 = 1,
then 1 XOR 1 = 0, then 0 XOR 0 = 0, then 0 XOR 1 = 1, then 1 XOR 1 = 0, then
0 XOR 0 = 0, giving 1100100, the value we started from. *Distractor:* shifting
right and forgetting to exclusive-OR, which merely halves the number.`,
      examTip: 'When a problem gives you a bit pattern and no context, ask what it is being read as before you compute anything. The byte 0xF3 is 243, -13, or a BCD value that is simply illegal, and the same 32 bits are a large integer or a small float depending only on the question.',
      importantNote: 'Every worked answer here was checked by an independent route: conversions were expanded back to the starting value, flag claims were checked against the range test rather than the carry rule, and the floating-point encodings were decoded with the defining formula rather than re-read from the working.',
    },
  ],
  keyTakeaways: [
    'Binary/octal/hex: group binary by 3 (octal) or 4 (hex).',
    '2\'s complement: invert+add 1; range -2^(n-1) to +2^(n-1)-1.',
    'DeMorgan: (A*B)\'=A\'+B\'; (A+B)\'=A\'*B\'.',
    'K-map: group adjacent 1s in powers of 2; larger = simpler.',
    'NAND/NOR are universal gates.',
    'Don\'t-cares maximize group size for simpler expressions.',
  ],
},

fee_comb_logic: { topicId: 'fee_comb_logic', title: 'Combinational Logic: MUX, Decoders, Adders', domainWeight: 'Digital Systems · 7–11%',
  overview: 'Combinational circuits have outputs depending solely on current inputs (no memory). MUX, decoders, and adders are fundamental building blocks. Their truth tables and Boolean equations are essential for FE exam digital design questions.',
  sections: [
    { id: 'comblog-mux', title: '1. MUX and Decoders',
      content: `## 1.1 Multiplexer (MUX)

Selects 1 of 2^n inputs via n select lines:

| MUX | Inputs | Select Lines |
|---|---|---|
| 2-to-1 | 2 | 1 |
| 4-to-1 | 4 | 2 |
| 8-to-1 | 8 | 3 |

**Any n-variable Boolean function** implementable with a 2^n-to-1 MUX.

## 1.2 Decoder

n inputs -> 2^n outputs (one active per input pattern):
- 2-to-4: outputs are minterms A'B', A'B, AB', AB
- **Any function = decoder + OR gate** (OR the minterm outputs)

## 1.3 Priority Encoder

Multiple active inputs -> encodes highest-priority one. Used in interrupt systems.`,
      examTip: 'MUX: 2^n inputs need n select lines. Decoder: n inputs produce 2^n minterms. Do not confuse MUX data inputs with select lines.',
      importantNote: '4-to-1 MUX has 2 select lines and 4 data inputs. The number of data inputs = 2^(select lines).',
    },
    { id: 'comblog-adder', title: '2. Adders and Subtractors',
      content: `## 2.1 Half-Adder

- **Sum = A XOR B**
- **Carry = A AND B**

## 2.2 Full-Adder

**Sum = A XOR B XOR C_in**
**C_out = A*B + C_in*(A XOR B)**

All eight rows, because a truth table with rows missing is not a truth table
and cannot be checked:

| A | B | Cin | Sum | Cout |
|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 1 | 0 |
| 0 | 1 | 0 | 1 | 0 |
| 0 | 1 | 1 | 0 | 1 |
| 1 | 0 | 0 | 1 | 0 |
| 1 | 0 | 1 | 0 | 1 |
| 1 | 1 | 0 | 0 | 1 |
| 1 | 1 | 1 | 1 | 1 |

Read the two output columns together as a two-bit number and every row says the
same thing: the count of 1s among A, B and Cin, written in binary. That reading
is the fastest way to reconstruct the table under exam pressure, and it is also
the fastest way to check one you have just written down.

## 2.3 Adder Types

| Type | Delay | Notes |
|---|---|---|
| **Ripple-carry** | O(n) | Simple, slow |
| **Carry-lookahead** | O(log n) | Fast, uses G=AB, P=A XOR B |

## 2.4 Subtraction

$$A - B = A + \\overline{B} + 1$$

The same adder does both jobs: XOR every B bit with a mode line and drive that
same line into the carry-in, so mode 0 gives A + B and mode 1 gives A - B.`,
      examTip: 'Full-adder: Sum = A XOR B XOR Cin, Cout = AB + Cin(A XOR B). Most tested combinational equations. A - B = A + NOT(B) + 1.',
    },
    { id: 'comblog-exam', title: '3. Combinational Circuit Design',
      content: `## 3.1 Design a 4-Bit Priority Encoder

A priority encoder outputs the **binary code of the highest-priority active input**.

**Truth table** (4-input, highest = I3):

| I3 | I2 | I1 | I0 | Y1 | Y0 | Valid |
|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | X | X | 0 |
| 0 | 0 | 0 | 1 | 0 | 0 | 1 |
| 0 | 0 | 1 | X | 0 | 1 | 1 |
| 0 | 1 | X | X | 1 | 0 | 1 |
| 1 | X | X | X | 1 | 1 | 1 |

**Boolean equations**:
- Y1 = I3 + I2
- Y0 = I3 + I1*I2'
- Valid = I3 + I2 + I1 + I0

## 3.2 Full Adder from Half Adders

**Half-adder**: Sum = A XOR B, Carry = A AND B

**Full-adder from two half-adders + OR gate**:
1. HA1: Sum1 = A XOR B, Carry1 = A AND B
2. HA2: Sum = Sum1 XOR Cin, Carry2 = Sum1 AND Cin
3. **Cout = Carry1 OR Carry2**

| Component | Gate Count |
|---|---|
| Half-adder | 1 XOR + 1 AND |
| Full-adder (from HAs) | 2 XOR + 2 AND + 1 OR = **5 gates** |

## 3.3 BCD to Excess-3 Converter

**Excess-3** = BCD + 3 (binary). Input: BCD digits 0-9 (A,B,C,D). Output: W,X,Y,Z.

| Decimal | BCD (ABCD) | Excess-3 (WXYZ) |
|---|---|---|
| 0 | 0000 | 0011 |
| 1 | 0001 | 0100 |
| 2 | 0010 | 0101 |
| 3 | 0011 | 0110 |
| 4 | 0100 | 0111 |
| 5 | 0101 | 1000 |
| 6 | 0110 | 1001 |
| 7 | 0111 | 1010 |
| 8 | 1000 | 1011 |
| 9 | 1001 | 1100 |

Inputs 10-15 are **don't-cares** (invalid BCD). Use K-maps with don't-cares for each output bit to get minimized gate equations. This is a classic FE exam design problem.

**Exam strategy**: For combinational design, always start with the truth table. Then use K-maps to minimize. Priority encoders use X (don't-care) in lower-priority positions. BCD converters have 6 don't-care inputs (10-15) — use them to simplify.`,
      examTip: 'BCD has only 10 valid inputs (0-9), giving 6 don\'t-cares. ALWAYS include don\'t-cares in your K-map groups — they can significantly simplify the logic.',
      importantNote: 'A 4-bit priority encoder is NOT the same as a regular encoder. In a regular encoder, only one input should be active. In a priority encoder, multiple can be active and the highest wins.',
    },
    { id: 'comblog-shannon', title: '4. Shannon Expansion: Any Function from a MUX, a Decoder, or a Comparator',
      content: `## 4.1 The identity that makes a multiplexer universal

Pick any variable in any Boolean function and split the function on it:

**F(A, B, C) = A' · F(0, B, C) + A · F(1, B, C)**

This is **Shannon's expansion**, and it is true for every function without
exception, because A is either 0 or 1 and one of the two terms is always
switched off. The two pieces F(0,...) and F(1,...) are called the **residues**
of F with respect to A, and each has one fewer variable than F did.

Read that identity as hardware and a multiplexer appears on its own. A 2-to-1
MUX computes exactly S'·I0 + S·I1. So if you drive the select line with A and
put the two residues on the data inputs, the MUX computes F. Expand on two
variables instead of one and you get a 4-to-1 MUX with four residues; expand on
all n and every residue collapses to a constant 0 or 1, which is the familiar
statement that a 2^n-to-1 MUX realises any n-variable function.

## 4.2 A worked realisation

Take **F(A, B, C) = sum of minterms(1, 2, 4, 7)**. Before doing anything, look
at those indices: 1, 2, 4 and 7 are exactly the input patterns with an odd
number of 1s, so this function is the three-input **odd parity** function. That
recognition alone answers many exam questions.

Build it on a 4-to-1 MUX with A and B on the select lines. Expand on both, and
each residue is a function of C alone — meaning each residue must be one of
only four things: 0, 1, C, or C'.

| Select A B | Rows of the truth table | F values (C = 0, then 1) | Residue on that input |
|---|---|---|---|
| 0 0 | m0, m1 | 0, 1 | **C** |
| 0 1 | m2, m3 | 1, 0 | **C'** |
| 1 0 | m4, m5 | 1, 0 | **C'** |
| 1 1 | m6, m7 | 0, 1 | **C** |

So the circuit is one 4-to-1 MUX, one inverter, and no other gates: tie I0 and
I3 to C, tie I1 and I2 to the inverter output. That is the whole design, and it
was verified here against the truth table for all eight input patterns. The
same function on an 8-to-1 MUX needs no inverter at all — you simply strap each
data input to logic 0 or logic 1 according to the truth table column — but it
costs a bigger part and three select lines instead of two.

## 4.3 The decoder route, and why the OR gate does the work

A decoder asserts exactly one output per input pattern, so its outputs *are*
the minterms. Feed the minterms your function needs into an OR gate and you
have the function:

**F = D1 + D2 + D4 + D7**

with a 3-to-8 decoder supplying D0 through D7. This route shines when several
functions share the same inputs, because the one decoder is shared and each
extra function costs only its own OR gate. It is the cheaper structure whenever
the number of outputs is large relative to the number of inputs.

One practical wrinkle the exam likes: most catalogue decoders have
**active-low** outputs, meaning the selected line goes to 0 and the rest stay
at 1. With active-low outputs you must collect the minterms with a **NAND**
gate rather than an OR gate. The De Morgan reasoning is one line — a NAND of
complemented signals is an OR of the true ones — but it is a reliable source of
wrong answers under time pressure.

| Realisation | Parts for one function | Best when |
|---|---|---|
| 2^n-to-1 MUX | 1 MUX | one function, few variables |
| 2^(n-1)-to-1 MUX plus residues | 1 MUX + 1 inverter | one function, saves a part size |
| Decoder + OR (or NAND) | 1 decoder shared + 1 gate each | several functions, same inputs |
| Minimised gates from a K-map | AND/OR network | fixed function, lowest gate count |

## 4.4 Comparators: another block you can derive rather than memorise

A magnitude comparator answers three questions about two words: greater, equal,
less. Derive the two-bit case from the way you compare numbers by hand — look
at the most significant bit first, and only consult the next bit if that one
ties:

- **A > B** when A1 is 1 and B1 is 0, or when A1 and B1 agree and A0 is 1 while B0 is 0
- **A = B** when A1 equals B1 and A0 equals B0
- **A < B** in every remaining case

In gate form the "agree" condition is an XNOR, so the greater-than output is
A1·B1' + (A1 XNOR B1)·A0·B0'. These three equations were checked here against
all sixteen pairs of two-bit values and are exact. The structure generalises
directly: comparators cascade by feeding the equal output of the more
significant stage into the enable of the next, which is the same
priority-from-the-top idea that drives a priority encoder.

**How the exam asks this.** The commonest form gives a function and a MUX of a
stated size and asks what to connect to the data inputs. Put the highest-order
variables on the selects, tabulate the remaining variable, and read each
residue off as 0, 1, the variable, or its complement. If the MUX is large
enough to consume every variable, the answer is a column of constants copied
straight out of the truth table.`,
      examTip: 'To realise an n-variable function on a 2^(n-1)-to-1 MUX, put the n-1 most significant variables on the select lines and let each data input carry the last variable, its complement, 0, or 1. Those four options are the only possibilities, which makes the answer a four-way choice per input rather than a derivation.',
      importantNote: 'Catalogue decoders usually have active-low outputs. Collecting active-low minterms requires a NAND, not an OR. If a problem shows bubbles on the decoder outputs, the gate that follows must change with them.',
    },
    { id: 'comblog-carry', title: '5. The Carry Is the Critical Path',
      content: `## 5.1 Counting delay in gates, not nanoseconds

Adder questions are timing questions in disguise, and they are almost always
posed in units of **gate delay**, written here as tau, so that the answer does
not depend on a process technology. Adopt one explicit model and stay in it:
every gate, including XOR, contributes one tau, and all bits of both operands
arrive at time zero.

Inside one full adder stage, write the carry in its factored form:

**G_i = A_i · B_i**  (this stage *generates* a carry)
**P_i = A_i XOR B_i**  (this stage *propagates* an incoming carry)
**C_(i+1) = G_i + P_i · C_i**, and **S_i = P_i XOR C_i**

All the P and G signals for every bit are computed simultaneously, so they are
ready at 1 tau. After that, each carry costs one AND plus one OR, which is
2 tau per stage, and the final sum bit costs one more XOR.

## 5.2 Ripple carry: the delay you get for free

If each stage simply waits for its neighbour, carry C_i is ready at 1 + 2i tau
and the last sum bit lands at

**t_ripple = 1 + 2(n - 1) + 1 = 2n tau**

Linear in the word width. Every bit you add to the adder costs two more gate
delays, forever.

## 5.3 Carry lookahead: solve the whole chain at once

Expanding the carry recurrence removes the sequential dependence entirely. For
four bits,

**C_4 = G_3 + P_3 G_2 + P_3 P_2 G_1 + P_3 P_2 P_1 G_0 + P_3 P_2 P_1 P_0 C_0**

which is a two-level expression: one level of ANDs, one OR. That is 2 tau
regardless of how wide the block is — the price is fan-in, which is why real
lookahead is built in 4-bit blocks and then repeated one level up. A 16-bit
lookahead adder costs, stage by stage:

| Step | What is produced | Cost |
|---|---|---|
| 1 | every P_i and G_i | 1 tau |
| 2 | block P* and G* for each 4-bit block | 2 tau |
| 3 | the block carries C_4, C_8, C_12 from a second-level unit | 2 tau |
| 4 | the individual carries inside each block | 2 tau |
| 5 | every sum bit | 1 tau |
| | **total** | **8 tau** |

Generalising, a lookahead adder built from 4-bit blocks needs
**4 x ceil(log4 n)** gate delays — logarithmic, not linear.

![Worst-case adder delay in gate delays against word width, from 2 to 64 bits. The ripple-carry curve is the straight line 2n; the carry-lookahead curve is the staircase 4 times ceiling of log base 4 of n. At 16 bits the two are marked at 32 and 8 gate delays.](/courses/fe-ee/figures/dig-adder-delay.svg)

The figure shows why this argument only becomes interesting at width. At four
bits, lookahead costs 4 tau where ripple costs 8 — it saves 4 tau, a factor of
two, for a lot of extra silicon. At sixty-four bits the same structure costs
12 tau where ripple costs 128, a factor of more than ten, and the ripple design
has stopped being usable at all.
The staircase shape matters too: the lookahead cost is constant between powers
of four, so widening a 17-bit datapath to 32 bits costs nothing in carry delay.

## 5.4 Putting a clock on it

Set tau = 0.5 ns, a plausible figure for a modest CMOS library, and the models
turn into frequencies:

| Width n | Ripple delay | Ripple limit | Lookahead delay | Lookahead limit |
|---|---|---|---|---|
| 4 | 8 tau = 4 ns | 250 MHz | 4 tau = 2 ns | 500 MHz |
| 16 | 32 tau = **16 ns** | **62.5 MHz** | 8 tau = **4 ns** | **250 MHz** |
| 64 | 128 tau = 64 ns | 15.6 MHz | 12 tau = 6 ns | 167 MHz |

These are the adder's own limits with nothing else in the path; a real datapath
must also pay the register clock-to-output and setup times covered in the
sequential-logic topic, so the achievable clock is always lower than the column
above suggests.

**Two other ways to spend the same idea.** A **carry-select** adder computes
each block twice, once assuming a carry-in of 0 and once assuming 1, then uses
the real carry to pick — trading roughly double the area for a delay that grows
as the square root of the width. A **carry-save** adder does not propagate at
all; it reduces three operands to two and defers a single propagating add to
the end, which is why multipliers are built from trees of them.

**How the exam asks this.** Either it states a per-stage delay and a width and
asks for the total, or it asks which structure is appropriate at a given speed.
Both are one substitution once you have written down which model you are using.
State the model explicitly in your working — the same adder has different
published delays under different gate-counting conventions, and an examiner
grading the method wants to see which one you chose.`,
      examTip: 'Ripple-carry delay grows as 2n gate delays; lookahead built from 4-bit blocks grows as 4 times ceil(log4 n). Memorise the 16-bit pair, 32 tau against 8 tau, and you can reconstruct both models from one remembered point.',
      importantNote: 'Carry-lookahead does not remove the carry chain, it flattens it into wide AND-OR logic. The cost reappears as gate fan-in, which is why lookahead is built hierarchically in 4-bit blocks instead of as one enormous expression across the whole word.',
    },
    { id: 'comblog-axioms', title: '6. From the Axioms to De Morgan, Proved by Enumeration',
      content: `## 6.1 The algebra has three axiom pairs and nothing else

Switching algebra is small enough to state completely. Everything a designer
ever uses is derived from three pairs of axioms plus the observation that the
variables take only two values. Each pair comes in two forms that are exact
mirrors of one another, swapping AND for OR and 0 for 1.

$$A + 0 = A, \\qquad A \\cdot 1 = A$$

$$A + \\overline{A} = 1, \\qquad A \\cdot \\overline{A} = 0$$

$$A + B = B + A, \\qquad A \\cdot B = B \\cdot A$$

$$A\\,(B + C) = A B + A C, \\qquad A + B C = (A + B)(A + C)$$

The mirroring is the **duality principle**: exchange every AND with every OR
and every 0 with every 1 in a true statement, and the result is also true.
Duality is not a proof technique for a specific circuit — it does not tell you
that two expressions are equal — but it halves the number of identities you
have to remember, and it is why every result in this chapter arrives in pairs.

The second distributive law is the one that surprises people, because its
arithmetic analogue is false: $a + bc$ is certainly not $(a+b)(a+c)$ in
ordinary numbers. It holds here because idempotence makes $A \\cdot A = A$,
so expanding the right-hand side gives $A + AC + AB + BC$, and the first
term absorbs the two middle ones.

From the axioms, a working set of theorems follows:

| Name | AND form | OR form |
|---|---|---|
| Idempotence | A . A = A | A + A = A |
| Null element | A . 0 = 0 | A + 1 = 1 |
| Involution | (A')' = A | (A')' = A |
| Absorption | A . (A + B) = A | A + A . B = A |
| Simplification | A . (A' + B) = A . B | A + A' . B = A + B |
| Consensus | (A+B)(A'+C)(B+C) = (A+B)(A'+C) | A.B + A'.C + B.C = A.B + A'.C |

### Worked Example 6.1 — proving the simplification theorem two ways

**Given.** Show that $A + \\overline{A}B = A + B$.

**By algebra.** Insert a factor of one, which is always legal because
$B + \\overline{B} = 1$ is an axiom, then regroup:

$$A + \\overline{A}B = A(1 + B) + \\overline{A}B = A + AB + \\overline{A}B = A + B(A + \\overline{A}) = A + B$$

**By enumeration**, which is the proof that cannot be fooled by a slip in the
algebra. Four rows, and both sides evaluated independently from A and B:

| A | B | A' . B | A + A' . B | A + B | Agree? |
|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 | yes |
| 0 | 1 | 1 | 1 | 1 | yes |
| 1 | 0 | 0 | 1 | 1 | yes |
| 1 | 1 | 0 | 1 | 1 | yes |

**Why it matters.** This theorem is the reason a term whose only extra literal
is the complement of another term's literal can shed that complement. It shows
up constantly in the middle of a minimisation, and getting it backwards
produces $AB$ instead of $A + B$, which is wrong on two of the four rows.

### Worked Example 6.2 — the consensus theorem, and why it earns its name

**Given.** Show that $AB + \\overline{A}C + BC = AB + \\overline{A}C$, so the
third term is redundant.

**The idea.** The term $BC$ is the **consensus** of the other two with
respect to A: strike A from the first term and $\\overline{A}$ from the
second, and multiply what is left. Whenever B and C are both true, one of the
first two terms is already true regardless of A, so $BC$ can never be the
only term asserting the output.

**By algebra**, expanding $BC$ against a factor of one:

$$BC = BC\\left(A + \\overline{A}\\right) = ABC + \\overline{A}BC$$

The first piece is absorbed by $AB$ and the second by $\\overline{A}C$,
so nothing is lost by deleting $BC$.

**By enumeration**, all eight rows:

| A | B | C | A.B | A'.C | B.C | Left side | Right side |
|---|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 0 | 1 | 0 | 1 | 1 |
| 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 1 | 1 | 0 | 1 | 1 | 1 | 1 |
| 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 1 | 0 | 1 | 0 | 0 | 0 | 0 | 0 |
| 1 | 1 | 0 | 1 | 0 | 0 | 1 | 1 |
| 1 | 1 | 1 | 1 | 0 | 1 | 1 | 1 |

The two output columns are identical on every row, so the terms are logically
equal. Look at rows four and eight, where $BC$ is the only 1 in its column
that is not already matched — in both cases another term is also 1, which is
the whole content of the theorem.

**Hold on to this result.** Section 8 shows that the redundant term you have
just proved you can delete is precisely the term you must **add** to stop the
circuit glitching. The algebra says it changes nothing; the timing says it
changes everything.

## 6.2 De Morgan for any number of variables

The two-variable laws generalise to any width, and the general statement is the
one worth carrying because real gates have more than two inputs:

$$\\overline{x_1 x_2 \\cdots x_n} = \\overline{x_1} + \\overline{x_2} + \\cdots + \\overline{x_n}$$

$$\\overline{x_1 + x_2 + \\cdots + x_n} = \\overline{x_1}\\,\\overline{x_2}\\cdots \\overline{x_n}$$

**Proof by induction.** The two-variable case is verified by enumeration below.
Assume the law holds for $n$ terms. Then group the first $n$ as a single
variable $Y$ and apply the two-variable case once:

$$\\overline{Y \\cdot x_{n+1}} = \\overline{Y} + \\overline{x_{n+1}} = \\left(\\overline{x_1} + \\cdots + \\overline{x_n}\\right) + \\overline{x_{n+1}}$$

which is the law for $n+1$ terms. The OR form follows by duality.

![Truth table grid comparing both De Morgan forms across all eight combinations of three variables. The complement of the three-way AND is shown beside the three-way OR of the complements, and the complement of the three-way OR beside the AND of the complements; each highlighted pair of columns is identical on every one of the eight rows.](/courses/fe-ee/figures/dig2-demorgan-grid.svg)

The practical form of the law is **bubble pushing**. A bubble on a gate's
output can be moved to bubbles on all of its inputs provided the gate changes
type, AND becoming OR and OR becoming AND. Two bubbles meeting on the same wire
cancel, by involution. That single manipulation converts between gate-level
drawings and expressions faster than any algebra.

### Worked Example 6.3 — simplify a complemented sum of products

**Given.** Simplify $F = \\overline{\\overline{A}B + A\\overline{C}}$ to a
minimal sum of products.

**Step 1, push the outer bar in.** De Morgan turns the OR into an AND of
complemented terms:

$$F = \\overline{\\overline{A}B} \\cdot \\overline{A\\overline{C}}$$

**Step 2, push each inner bar in.** Each product becomes a sum:

$$F = \\left(A + \\overline{B}\\right)\\left(\\overline{A} + C\\right)$$

**Step 3, multiply out.** Four products appear, and one of them dies
immediately because $A\\overline{A} = 0$:

$$F = A\\overline{A} + AC + \\overline{A}\\,\\overline{B} + \\overline{B}C = AC + \\overline{A}\\,\\overline{B} + \\overline{B}C$$

**Step 4, delete the consensus.** The term $\\overline{B}C$ is the consensus
of $AC$ and $\\overline{A}\\,\\overline{B}$ with respect to A, so by
worked example 6.2 it is redundant:

$$F = AC + \\overline{A}\\,\\overline{B}$$

**Check by enumeration.** Evaluate the original and the answer on all eight
rows, from the variables rather than from the intermediate steps:

| A | B | C | A'B + AC' | F original | A.C + A'.B' | Agree? |
|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 1 | 1 | yes |
| 0 | 0 | 1 | 0 | 1 | 1 | yes |
| 0 | 1 | 0 | 1 | 0 | 0 | yes |
| 0 | 1 | 1 | 1 | 0 | 0 | yes |
| 1 | 0 | 0 | 1 | 0 | 0 | yes |
| 1 | 0 | 1 | 0 | 1 | 1 | yes |
| 1 | 1 | 0 | 1 | 0 | 0 | yes |
| 1 | 1 | 1 | 0 | 1 | 1 | yes |

**Trap.** Complementing term by term and writing $A\\overline{B} + \\overline{A}C$.
That inverts each literal but leaves both operators alone, and it disagrees with
the truth on four of the eight rows — 000, 011, 100 and 111. De Morgan changes
the operator; that is the whole content of the law, and a transformation that
leaves the operators untouched is not De Morgan at all.

## 6.3 Canonical forms come free with the truth table

Any function of $n$ variables can be written as the OR of the minterms where
it is 1, or as the AND of the maxterms where it is 0. Neither form is minimal,
and neither is meant to be — they exist because they are **unique**, so they are
what you compare two designs against.

$$F = \\sum_{k \\,:\\, F(k) = 1} m_k, \\qquad F = \\prod_{k \\,:\\, F(k) = 0} M_k$$

$$m_j \\cdot m_k = 0 \\;\\; (j \\ne k), \\qquad \\sum_{k=0}^{2^{\\,n}-1} m_k = 1$$

Those two properties say the minterms partition the input space: exactly one is
true for any input. That is why a decoder, which asserts exactly one output per
input pattern, is a minterm generator.

The number of distinct functions grows brutally, which is worth seeing once
because it explains why minimisation is done with algorithms rather than by
inspection past four variables:

$$N_{\\text{functions}}(n) = 2^{\\,2^{\\,n}}$$

| Variables | Rows | Distinct functions |
|---|---|---|
| 2 | 4 | 16 |
| 3 | 8 | 256 |
| 4 | 16 | 65,536 |
| 5 | 32 | 4,294,967,296 |

### Worked Example 6.4 — both canonical forms from one table

**Given.** $F(A,B,C)$ is 1 for the input patterns 001, 011, 110 and 111, and
0 otherwise. Write both canonical forms and confirm they describe one function.

**Index the rows.** Reading each pattern as a binary number, the 1s sit at
indices 1, 3, 6 and 7, so the 0s sit at 0, 2, 4 and 5.

**Canonical SOP.** Each minterm complements the variables carrying a 0:

$$F = \\overline{A}\\,\\overline{B}C + \\overline{A}BC + AB\\overline{C} + ABC$$

**Canonical POS.** Each maxterm complements the variables carrying a 1 and
joins them with OR:

$$F = (A + B + C)(A + \\overline{B} + C)(\\overline{A} + B + C)(\\overline{A} + B + \\overline{C})$$

**Confirm the pairing.** The two index lists are complementary and their sizes
add to the number of rows:

$$4 + 4 = 8$$

**Minimise for comparison.** Grouping the 1s gives $\\overline{A}C + AB$,
which is two terms and four literals against the canonical form's four terms
and twelve. That ratio is the ordinary payoff of minimisation and the reason
canonical forms are a starting point rather than a design.

**Trap.** Building the maxterm from the same literals as the minterm of the
same index. Maxterm 5 is not the OR of minterm 5's literals; it is the
complement of minterm 5, so every literal flips as well as the operator.`,
      examTip: 'Two identities do most of the algebraic work on this exam: A + A prime B equals A + B, and the consensus term in AB + A prime C + BC is redundant. Both are four or eight rows to verify, so when a minimisation feels uncertain, enumerate rather than push symbols.',
      importantNote: 'Duality and complementation are different operations. The dual of an expression swaps AND with OR and 0 with 1 but leaves the literals alone; the complement does that AND inverts every literal. Applying duality where De Morgan was wanted produces an expression that is true, but true about a different function.',
    },
    { id: 'comblog-kmap', title: '7. Karnaugh Maps: the Grouping Rules and Where They Come From',
      content: `## 7.1 Every rule is one theorem in disguise

The map is a lookup table redrawn so that cells which differ in exactly one
variable sit next to each other. That is the only property it has, and every
grouping rule is a restatement of a single theorem:

$$X\\,Y + X\\,\\overline{Y} = X\\left(Y + \\overline{Y}\\right) = X$$

Combining two cells that differ in one variable deletes that variable. Combine
two such pairs and a second variable goes. In general a group of $2^k$ cells
that is a rectangle in the map's adjacency structure deletes exactly $k$
variables:

$$\\text{literals in the resulting term} = n - k$$

$$\\text{group size} = 2^{\\,k}, \\qquad k = 0, 1, \\ldots, n$$

Three consequences follow, and they are exactly the rules students are told to
memorise:

- **Groups must be powers of two.** A group of three cells is not of the form
  $2^k$, so no variable cancels cleanly and the group names no single
  product term.
- **Groups must be rectangular** in the Gray-labelled grid. An L-shape contains
  a pair that differs in two variables, and that pair does not combine.
- **The map wraps.** Gray labelling makes the first and last rows differ in one
  variable, and likewise the first and last columns, so those edges are
  genuinely adjacent. Missing a wrap-around group is the single most common
  cause of a non-minimal answer.

![Three-variable Karnaugh map of the function that is one at minterms 0, 2, 4, 5 and 6, showing a wrap-around group of four spanning the leftmost and rightmost columns and a plain pair. The two groups give the minimal expression C prime plus A B prime, which is two terms and three literals.](/courses/fe-ee/figures/dig2-kmap3.svg)

The figure's group of four is the one that gets missed. Columns 00 and 10 look
as far apart as any two columns on the page, but in Gray order they differ only
in B, so the four cells they contain are a legitimate group and they name the
single literal $\\overline{C}$. Read the map as a cylinder and the shape is
obvious; read it as a rectangle and it is invisible.

## 7.2 Prime implicants, essential ones, and the minimal cover

The vocabulary matters because the exam uses it. An **implicant** is any product
term that implies the function — every input it covers is a 1 of the function. A
**prime implicant** is an implicant that cannot be made larger by deleting a
literal. An **essential prime implicant** is one that is the only prime
implicant covering some particular minterm.

The minimisation procedure is then mechanical:

1. Find every prime implicant, by growing each group until it cannot grow.
2. Take every essential prime implicant; you have no choice about them.
3. Cover whatever minterms remain with the fewest further prime implicants.

Step 3 is where minimal solutions stop being unique. Two different covers can
have the same term count and the same literal count, and both are correct
answers.

### Worked Example 7.1 — a full prime-implicant analysis

**Given.** Minimise $F(A,B,C,D) = \\sum m(0,1,2,5,6,7,8,9,10,14)$.

**Step 1, the prime implicants.** Growing every group as far as it will go
produces six:

| Prime implicant | Cells covered | Literals |
|---|---|---|
| B'C' | 0, 1, 8, 9 | 2 |
| B'D' | 0, 2, 8, 10 | 2 |
| CD' | 2, 6, 10, 14 | 2 |
| A'C'D | 1, 5 | 3 |
| A'BD | 5, 7 | 3 |
| A'BC | 6, 7 | 3 |

**Step 2, the essential ones.** Look for minterms covered by exactly one prime
implicant. Minterm 9 appears only in B'C', and minterm 14 appears only in CD',
so both of those are essential. No other minterm is covered uniquely.

**Step 3, what is left.** The two essentials together cover 0, 1, 2, 6, 8, 9,
10 and 14. The minterms 5 and 7 are still uncovered, and exactly one prime
implicant covers both of them, namely A'BD.

$$F = \\overline{B}\\,\\overline{C} + C\\overline{D} + \\overline{A}BD$$

Three terms, seven literals. Verified against the minterm list on all sixteen
rows.

**The instructive part.** B'D' is a perfectly valid prime implicant — a maximal
group of four — and it appears in **no** minimal solution, because everything it
covers is already covered by the two essentials. A large group is not
automatically part of the answer. That is why step 2 exists: essentiality, not
size, decides what you are obliged to take.

**Trap.** Covering 5 and 7 with A'C'D and A'BC instead of the single term A'BD.
That yields four terms and ten literals — a correct function and a
non-minimal answer, which on a multiple-choice paper is simply wrong.

## 7.3 Don't-cares are free variables, not zeros

When a specification leaves some input combinations impossible, the value of
the function there is unconstrained. Marking those cells X and treating each as
whichever value makes the current group larger costs nothing, because the
circuit's behaviour on an impossible input is not observable.

$$F_{\\text{on}} \\;\\subseteq\\; F_{\\text{built}} \\;\\subseteq\\; F_{\\text{on}} \\cup F_{\\text{dc}}$$

Any function satisfying that sandwich is a legal implementation. The freedom is
real: below, it removes four literals from a five-input design.

### Worked Example 7.2 — a BCD threshold detector, minimised twice

**Given.** Inputs A, B, C, D carry a BCD digit, so only 0 through 9 occur.
Output F is 1 when the digit is 5 or more. Minimise with and without exploiting
the six impossible inputs.

**The on-set.** Digits 5, 6, 7, 8 and 9 are minterms 5, 6, 7, 8 and 9. Digits
10 through 15 cannot occur, so minterms 10 through 15 are don't-cares.

**Without don't-cares**, treating 10 through 15 as 0. No group of four is
available anywhere in the on-set, so the answer is three pairs:

$$F = A\\overline{B}\\,\\overline{C} + \\overline{A}BD + \\overline{A}BC$$

Three terms, nine literals.

**With don't-cares.** Now the whole A = 1 half of the map is 1s and Xs, giving a
group of eight; and both pairs in the B = 1 region extend downward through the
don't-care rows into groups of four:

$$F = A + BD + BC$$

Three terms, five literals — the same term count, four fewer literals, and one
gate input saved on each of two gates.

![Two Karnaugh maps of the same BCD threshold function side by side. The left map treats the six impossible inputs as zeros and needs three pairs, giving nine literals; the right map treats them as don't-cares, which extends one group to eight cells and two groups to four cells, giving five literals.](/courses/fe-ee/figures/dig2-kmap-dontcare.svg)

**Check.** The don't-care version was evaluated on the ten legal rows and
matches the specification on every one; the strict version was evaluated on all
sixteen and matches there too. The two circuits disagree — deliberately — on all
six impossible inputs, which is exactly the licence a don't-care grants.

**Trap.** Treating an X as a 1 that must be covered. A don't-care cell may be
included in a group, but a group is never created solely to cover one. Doing so
here adds the term A'CD to no purpose and costs a gate.

## 7.4 Five variables: two maps, stacked

Beyond four variables the map becomes two four-variable maps, one for the fifth
variable low and one for it high. Cells in the same position on the two maps
are adjacent, because they differ only in that fifth variable.

$$F(A,B,C,D,E) = \\overline{A}\\,F(0,B,C,D,E) + A\\,F(1,B,C,D,E)$$

That is Shannon expansion again, and it says the stacking is not a trick but
the same decomposition section 4 used to justify a multiplexer.

### Worked Example 7.3 — a group that spans both sheets

**Given.** A five-variable function is 1 at minterms 4, 5, 6, 7, 20, 21, 22 and
23, among others. Show what those eight cells contribute.

**Locate them.** Write each index in five bits with A as the most significant.
Minterms 4 through 7 are 00100 through 00111, so A = 0 and B = 0 and C = 1 with
D and E free. Minterms 20 through 23 are 10100 through 10111, so A = 1 and
B = 0 and C = 1 with D and E free.

**Combine.** The two blocks of four sit at the same position on the two sheets,
so they merge into a group of eight, and the merge deletes A:

$$\\text{eight cells} = 2^{3} \\;\\Longrightarrow\\; 5 - 3 = 2 \\text{ literals}$$

$$\\text{term} = \\overline{B}C$$

**Check.** $\\overline{B}C$ is 1 exactly when B is 0 and C is 1, and the
eight minterms listed are precisely the eight ways to fill A, D and E under that
condition.

$$2^{3} = 8$$

**Trap.** Treating the two sheets as unrelated and reporting
$\\overline{A}\\,\\overline{B}C + A\\overline{B}C$. That is the same function
written with two terms and six literals instead of one term and two, which is
the entire cost of forgetting that the sheets are adjacent.`,
      examTip: 'Work the map in a fixed order: circle every group that cannot grow, mark the minterms covered only once, take those groups, then cover the rest. Jumping straight to "circle the biggest thing you see" produces a valid function and a non-minimal expression, and non-minimal is marked wrong.',
      importantNote: 'A don\'t-care may be used as a 1 in one pass and as a 0 in another; the two passes then build circuits that differ on the impossible inputs. That is legal and expected. What is not legal is creating a group whose only purpose is to cover a don\'t-care cell.',
    },
    { id: 'comblog-hazards', title: '8. Hazards: When a Correct Equation Builds a Wrong Circuit',
      content: `## 8.1 A static-1 hazard, in a circuit whose algebra is perfect

Every expression in section 7 is correct as algebra: given stable inputs and
enough time, the output is right. A **hazard** is what happens in between. When
one input changes and the output ought to hold still, the output can
nevertheless produce a brief pulse to the opposite value, because two paths
from that input to the output have different delays.

Take the smallest example that shows it:

$$F = AB + \\overline{A}C$$

Hold B = 1 and C = 1. Then $F = A + \\overline{A} = 1$ whatever A does, so the
output should be a flat line. Now count delays with the unit model, one tau per
gate:

| Time | Event |
|---|---|
| 0 | A is 1, so AB is 1 and A'C is 0; F is 1 |
| 5 | A falls |
| 6 | AB falls to 0; A' rises |
| 7 | A'C rises to 1, but the OR gate has already seen both inputs at 0 |
| 7 | F falls to 0 |
| 8 | F rises back to 1 |

The AND gate on the $AB$ path sees A directly. The AND gate on the
$\\overline{A}C$ path sees A through an inverter, one tau later. For one tau
neither product term is asserted, and the OR gate faithfully reports what it is
given.

![Unit-delay simulation of the static-1 hazard in F equals A B plus A prime C with B and C held high and A falling at time five. The upper panel shows the two product terms crossing one gate delay apart, leaving the output low for exactly one gate delay; the lower panel shows the same circuit with the consensus term B C added, where the output never leaves the high level.](/courses/fe-ee/figures/dig2-hazard-timing.svg)

The glitch in the upper panel is exactly one tau wide, measured from the
simulated waveform rather than asserted. It is not an artefact of the model
either: any gate ordering that puts an inverter on one path and not the other
produces the same crossing, and real gates have unequal rise and fall times
that make it worse rather than better.

## 8.2 The map shows the hazard before the scope does

A static-1 hazard is visible on the Karnaugh map as a **transition between two
prime implicants that share no cell**. The input change walks from a cell
covered only by one group to a cell covered only by the other, and for the
moment in between, no group is asserting.

![Three-variable Karnaugh map of A B plus A prime C, showing the two prime implicants as adjacent but non-overlapping groups, with the arrow marking the transition from minterm seven to minterm three that crosses between them, and the consensus term B C drawn as a dashed group covering exactly the two cells the crossing passes through.](/courses/fe-ee/figures/dig2-hazard-kmap.svg)

The cure is to add a group that spans the boundary, so that some term stays
asserted throughout the crossing. That group is the consensus term:

$$AB + \\overline{A}C \\;=\\; AB + \\overline{A}C + BC$$

Worked example 6.2 proved that this changes nothing about the function. What it
changes is the timing: $BC$ does not involve A at all, so it is unaffected
by A's transition and holds the OR gate's output up while the other two terms
swap over. The lower panel of the timing figure shows the result — a flat line.

The general rule for a two-level SOP network:

$$\\text{hazard-free} \\iff \\text{every pair of adjacent 1-cells is covered by a common product term}$$

That is stronger than minimality, and it costs gates. A minimal expression and
a hazard-free expression are different design goals, and you cannot have both
in general.

### Worked Example 8.1 — find and cure the hazards in a four-variable function

**Given.** $F(A,B,C,D) = \\overline{A}\\,\\overline{C} + AB + BC$. Identify
any static-1 hazard and give a hazard-free realisation.

**Look for uncovered adjacencies.** Consider the pair of inputs
$A=0, B=1, C=0, D=0$ and $A=1, B=1, C=0, D=0$, which differ only in A.
The first is covered by $\\overline{A}\\,\\overline{C}$ and not by $AB$;
the second is covered by $AB$ and not by $\\overline{A}\\,\\overline{C}$.
Is any single term true for both? $BC$ requires C = 1 and C is 0 here. So no
term spans the crossing, and A changing with B = 1 and C = 0 will glitch.

**Compute the consensus.** Strike A from $AB$ and $\\overline{A}$ from
$\\overline{A}\\,\\overline{C}$, then multiply the remains:

$$\\text{consensus}\\left(AB,\\; \\overline{A}\\,\\overline{C}\\right) = B\\overline{C}$$

**The hazard-free form.**

$$F = \\overline{A}\\,\\overline{C} + AB + BC + B\\overline{C}$$

**Check the function is unchanged.** $B\\overline{C}$ is 1 only when B = 1
and C = 0; in that case $AB$ covers A = 1 and $\\overline{A}\\,\\overline{C}$
covers A = 0, so every input the new term asserts was already asserted. Nothing
new is covered, on any of the sixteen rows.

**Note the cost.** The circuit grows by one AND gate and one OR input. Also note
that $BC + B\\overline{C} = B$, so a designer aiming purely at gate count
would collapse those two terms — and reintroduce the hazard, because the
collapsed term is built by a *different* gate whose own delay reopens the
window. Hazard-free design resists tidying.

**Trap.** Checking only the transitions that appear in the original problem
statement. Hazards are properties of pairs of adjacent inputs, and a
four-variable function has 32 such pairs; the one that bites in the lab is
usually not the one in the question.

## 8.3 The static-0 hazard is the exact dual

Everything above has a mirror image in product-of-sums form. A **static-0
hazard** is a brief 1 on an output that should stay at 0, and it appears in a
two-level OR-AND network for the same reason:

$$G = \\left(A + B\\right)\\left(\\overline{A} + C\\right)$$

Hold B = 0 and C = 0. Then $G = A \\cdot \\overline{A} = 0$ for all A, so the
output should be flat at 0. Now watch A **rise**. The term $(A+B)$ is fed by A
directly, so it climbs to 1 after one gate delay. The term
$(\\overline{A}+C)$ is fed through an inverter, so it does not drop to 0 until
two gate delays have passed. For the tau in between, both sum terms are 1 and
the AND gate obediently outputs a 1 that should not exist.

Note which edge does it, because the duality is exact and easy to get
backwards: the static-1 hazard in section 8.1 fires when A **falls**, and this
static-0 hazard fires when A **rises**. Both were confirmed by unit-delay
simulation on both edges, and in each case the opposite edge produces no glitch
at all — the lagging term arrives on the safe side of the transition.

The cure is the dual consensus, a **sum** term rather than a product term:

$$\\left(A + B\\right)\\left(\\overline{A} + C\\right) = \\left(A + B\\right)\\left(\\overline{A} + C\\right)\\left(B + C\\right)$$

### Worked Example 8.2 — verifying the dual consensus by enumeration

**Given.** Show that adding $(B+C)$ to the product above leaves the function
unchanged.

**All eight rows**, each side evaluated from the variables:

| A | B | C | A+B | A'+C | B+C | Two factors | Three factors |
|---|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 |
| 0 | 0 | 1 | 0 | 1 | 1 | 0 | 0 |
| 0 | 1 | 0 | 1 | 1 | 1 | 1 | 1 |
| 0 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| 1 | 0 | 0 | 1 | 0 | 0 | 0 | 0 |
| 1 | 0 | 1 | 1 | 1 | 1 | 1 | 1 |
| 1 | 1 | 0 | 1 | 0 | 1 | 0 | 0 |
| 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |

The last two columns agree on every row, so the third factor is redundant as
algebra and load-bearing as timing — the same double life the product consensus
leads.

**Trap.** Curing a static-0 hazard by adding a product term, or a static-1
hazard by adding a sum term. The cure has to live in the same two-level
structure as the disease: products for SOP, sums for POS.

## 8.4 Dynamic and function hazards, and when none of this matters

Two further categories exist and neither is fixed by adding terms.

A **dynamic hazard** is an output that changes, changes back, and changes again
on a single input transition — three or more edges where one was wanted. It
requires at least three levels of logic with at least three differently delayed
paths, so a properly built two-level network cannot have one.

A **function hazard** occurs when two or more inputs change at once. Because the
inputs cannot be guaranteed to arrive together, the circuit may traverse
intermediate input combinations where the function genuinely is the opposite
value. No amount of redundant logic removes it, because the fault is in the
sequence of inputs rather than in the implementation. The only cures are to
change one input at a time, which is exactly why control state machines are
encoded in Gray code, or to sample the output only when it is known settled.

### Worked Example 8.3 — when a one-tau glitch is harmless

**Given.** A combinational block with a 1 tau hazard feeds the D input of a
flip-flop clocked at 200 MHz. The block's settling delay is 8 tau, the setup
time is 3 tau, and tau is 0.15 ns. Does the glitch matter?

**The clock period.**

$$T = \\frac{1}{200 \\times 10^{6}} = 5 \\text{ ns}$$

**The budget in tau.**

$$\\frac{5}{0.15} = 33.3$$

so the period is about 33 tau.

**The requirement.** The data must be stable by 3 tau before the edge, so the
logic has from 0 to 30 tau to do whatever it likes. It settles at 8 tau, and
the glitch happens well inside the settling window.

$$8 + 3 = 11$$

Eleven tau of the thirty-three are used, so the glitch is long gone when the
flip-flop samples. **It does not matter.**

**Where it would matter.** Route the same signal to a clock input, an
asynchronous reset, a latch enable, or a write strobe, and the glitch is
sampled by nothing at all — it *is* the event. The distinction is not the
glitch's size but what listens to it.

**Trap.** Concluding that hazards never matter in synchronous designs. That is
true for data paths and false for every asynchronous control input on the
chip, and those inputs are exactly where a spurious pulse causes a fault that
reproduces once a week.`,
      examTip: 'A static-1 hazard lives on the boundary between two prime implicants that share no cell; the cure is the consensus term that spans the boundary. Static-0 is the dual, in a POS network, cured by a consensus sum term. Both cures add redundant logic on purpose.',
      importantNote: 'The minimal expression and the hazard-free expression are usually different. If a question asks for a minimal form, do not add consensus terms; if it asks for a glitch-free form, do not remove them. Answering the wrong one of those two questions is the most common way this topic is failed.',
    },
    { id: 'comblog-msi', title: '9. Universality, MSI Blocks and What They Cost',
      content: `## 9.1 One gate type is enough

NAND alone, or NOR alone, is **functionally complete**: any Boolean function can
be built from copies of either. The proof is a construction, because building
NOT, AND and OR from the candidate gate suffices — every function has a
sum-of-products form using only those three.

$$\\overline{A} = \\overline{A \\cdot A}$$

$$A \\cdot B = \\overline{\\overline{A \\cdot B}}$$

$$A + B = \\overline{\\overline{A}\\cdot\\overline{B}}$$

The third line is De Morgan read as a wiring diagram: invert both inputs with
one NAND each, then NAND the results. The NOR constructions are the duals.

| Function | From NAND | From NOR |
|---|---|---|
| NOT | 1 gate | 1 gate |
| AND | 2 gates | 3 gates |
| OR | 3 gates | 2 gates |
| XOR | 4 gates | 5 gates |

The asymmetry in the table is the practical point: NAND builds AND cheaply and
OR dearly, NOR the reverse. Choose the family that matches the form of your
expression and the gate count falls out on its own.

## 9.2 Two-level networks map to one gate type with no work at all

A two-level AND-OR network becomes a NAND-NAND network by replacing every gate
with a NAND and changing nothing else. The reason is double negation: putting a
bubble on each AND output and a matching bubble on each OR input inserts two
inversions on every path, which cancel.

$$\\sum_i P_i = \\overline{\\overline{\\sum_i P_i}} = \\overline{\\prod_i \\overline{P_i}}$$

The right-hand side is literally a NAND of NANDs. The dual statement converts a
two-level OR-AND network to NOR-NOR.

| Starting form | Target | Level 1 | Level 2 |
|---|---|---|---|
| Sum of products | NAND-NAND | NAND per product term | NAND collecting them |
| Product of sums | NOR-NOR | NOR per sum term | NOR collecting them |

### Worked Example 9.1 — map a three-term SOP onto NAND gates

**Given.** Realise $F = \\overline{B}\\,\\overline{C} + C\\overline{D} + \\overline{A}BD$
— the minimal form from worked example 7.1 — using only NAND gates and
inverters, and count the parts.

**Level 1.** One NAND per product term, with the literals as inputs:
$\\overline{\\overline{B}\\,\\overline{C}}$, $\\overline{C\\overline{D}}$,
$\\overline{\\overline{A}BD}$. Three gates.

**Level 2.** One NAND collecting the three level-one outputs. One gate.

**Verify the algebra.** By De Morgan, the level-two gate computes

$$\\overline{\\overline{P_1} \\cdot \\overline{P_2} \\cdot \\overline{P_3}} = P_1 + P_2 + P_3$$

which is the original OR. The transformation is exact, not approximate.

**Inverters.** The literals $\\overline{A}$, $\\overline{B}$,
$\\overline{C}$ and $\\overline{D}$ are needed. Assuming only true inputs
are available, that is four more gates.

$$3 + 1 + 4 = 8$$

**Answer: 8 NAND gates, 2 levels of logic**, so the delay is 2 tau after the
inverters, or 3 tau from the true inputs.

**Trap.** Replacing the OR gate with a NOR instead of a NAND. That inverts the
whole output, giving $\\overline{F}$, and the error is invisible in a gate
count — the circuit has the right shape and the wrong sense.

## 9.3 A decoder is only worth its silicon in bulk

Section 4.3 gave the decoder-plus-OR construction. The question a designer
actually faces is when it beats simply minimising each function on its own, and
that is arithmetic once the model is stated.

**Stated model.** A 3-to-8 decoder is 8 three-input AND gates and 3 inverters,
so 11 gates, shared by every function. Each function then costs one OR gate. A
standalone two-level network costs, per function, one AND per product term plus
one OR; take three product terms as the working average, so 4 gates each, over
3 shared inverters.

$$G_{\\text{decoder}}(k) = 11 + k, \\qquad G_{\\text{separate}}(k) = 3 + 4k$$

### Worked Example 9.2 — where the two lines cross

**Given.** Find the number of functions at which sharing a decoder becomes
cheaper.

**Set them equal.**

$$11 + k = 3 + 4k$$

$$8 = 3k$$

$$8 / 3 = 2.667$$

Gate counts are integers, so sharing wins from **three functions onward**.
Check at k = 8:

$$11 + 8 = 19$$

$$3 + 4 \\times 8 = 35$$

Nineteen against thirty-five, a saving of sixteen gates.

![Gate count against the number of Boolean functions built on the same three inputs, comparing one shared three-to-eight decoder plus one OR gate per function against separate two-level networks. The lines cross between two and three functions, and at eight functions the shared decoder costs nineteen gates against thirty-five.](/courses/fe-ee/figures/dig2-decoder-share.svg)

**Trap.** Reading the crossover as "the decoder is always better" from the
picture's right-hand side. For one or two functions it is strictly worse, and
single-function problems are the common case in a datapath. Read the left edge
as carefully as the right.

## 9.4 The multiplexer route, seen as a wiring table

Section 4 derived Shannon expansion. The mechanical version worth drilling is
this: put the high-order variables on the select lines, list the remaining
variable's two rows for each select combination, and read off which of the four
possible residues you have.

$$F = \\overline{S}\\,I_0 + S\\,I_1 \\quad \\text{is what a 2-to-1 MUX computes}$$

$$I_j \\in \\lbrace\\, 0,\\; 1,\\; C,\\; \\overline{C} \\,\\rbrace \\quad \\text{are the only options for a one-variable residue}$$

![A four-to-one multiplexer wired to compute three-input odd parity, with the select lines carrying A and B and the four data inputs carrying C, C complement, C complement and C in order, so the whole realisation is one multiplexer and one inverter.](/courses/fe-ee/figures/dig2-mux-residues.svg)

### Worked Example 9.3 — check a MUX wiring by re-evaluation

**Given.** The figure claims that a 4-to-1 MUX with A and B on the selects and
data inputs C, C', C', C computes three-input odd parity. Verify it.

**Re-evaluate the wired circuit.** For each select combination, the MUX passes
the named residue, so the output is:

| A B | Residue passed | Output at C = 0 | Output at C = 1 |
|---|---|---|---|
| 0 0 | C | 0 | 1 |
| 0 1 | C' | 1 | 0 |
| 1 0 | C' | 1 | 0 |
| 1 1 | C | 0 | 1 |

**Compare with the specification.** Odd parity is 1 when an odd number of
inputs is 1. Reading the eight cells above in minterm order gives 1s at indices
1, 2, 4 and 7, which is exactly $\\sum m(1,2,4,7)$ — and those four indices
are the patterns 001, 010, 100 and 111, each with an odd population count.
Exactly half the patterns have odd parity, which is the count the minterm list
shows:

$$8 / 2 = 4$$

**Trap.** Wiring the residues in the wrong order, tying I0 and I3 to
$\\overline{C}$ and I1 and I2 to C. That builds even parity — the exact
complement, wrong on all eight rows. Note that swapping which variable sits on
which select line is *not* an error here, because parity is symmetric in its
inputs; the order of the data inputs is what matters, and it is the thing
easiest to get backwards.

## 9.5 Choosing an adder against a clock

Section 5 gave the two delay models. Carry-select sits between them, and its
delay depends on the block size $k$, which is a design variable rather than
a constant:

$$t_{\\text{select}}(n,k) = 1 + 2k + \\left(\\left\\lceil n/k \\right\\rceil - 1\\right) + 1$$

The first term is P and G, the second is a ripple through one block, the third
is one multiplexer per block boundary, and the last is the final sum XOR.
Minimising over $k$ trades the two middle terms against each other.

### Worked Example 9.4 — pick an adder for a 300 MHz datapath

**Given.** A 32-bit adder must complete inside one cycle at 300 MHz. The gate
delay is 0.15 ns, and the surrounding registers consume 1.0 ns of the period in
clock-to-output and setup time. Which structures qualify?

**The budget.**

$$T = \\frac{1}{300 \\times 10^{6}} = 3.333 \\text{ ns}$$

$$3.333 - 1.0 = 2.333$$

so the adder has 2.333 ns, which in gate delays is

$$2.333 / 0.15 = 15.55$$

Fifteen gate delays, rounding down because you cannot have a fraction of one.

**Ripple carry.**

$$t = 2 \\times 32 = 64$$

Sixty-four tau, which is 9.6 ns. **Fails**, by a factor of four.

**Carry-lookahead**, in 4-bit blocks, needing three levels since
$4^3 = 64 \\ge 32$:

$$t = 4 \\times 3 = 12$$

Twelve tau, or 1.8 ns. **Passes**, with three tau of margin.

**Carry-select**, minimised over the block size:

| k | 2k | blocks | MUX chain | total tau |
|---|---|---|---|---|
| 2 | 4 | 16 | 15 | 21 |
| 4 | 8 | 8 | 7 | 17 |
| 5 | 10 | 7 | 6 | 18 |
| 8 | 16 | 4 | 3 | 21 |

The best block size is 4, giving 17 tau, or 2.55 ns. **Fails** the 15 tau
budget, though only just. Add back the 1.0 ns of register overhead and its
shortest workable period is 3.55 ns, so the same design clears any clock below

$$1 / 3.55 = 0.2817$$

gigahertz — about 282 MHz, close enough to the target to be tempting and still
not enough.

**Answer: carry-lookahead**, and it is the only one of the three that clears the
budget.

![Two stacked panels against adder width from two to sixty-four bits. The upper panel plots worst-case delay in gate delays for ripple carry at two n, for carry-select minimised over block size, and for four-bit-block lookahead at four times the ceiling of log base four of n, with the sixteen-bit pair marked at thirty-two and eight. The lower panel plots the widest AND fan-in required, which grows as n plus one for a flat lookahead and stays fixed at five for the hierarchical version.](/courses/fe-ee/figures/dig2-adder-tradeoff.svg)

The lower panel is the part that is usually left out of the comparison. A flat
lookahead across a whole 64-bit word would need a 65-input AND gate, which no
library provides and no sensible designer would build; hierarchy exists to keep
every gate at five inputs, and it is the reason the delay curve is a staircase
rather than a smooth logarithm.

**Trap.** Comparing raw adder delays without subtracting the register overhead.
Here the overhead is 30 percent of the period, and forgetting it would have let
carry-select through at 17 tau against a full 22 tau period.`,
      examTip: 'Two-level SOP maps to NAND-NAND and two-level POS maps to NOR-NOR by simple substitution, with no change to the wiring. If you find yourself doing algebra to convert a two-level network to NAND gates, you have missed the substitution.',
      importantNote: 'Delay comparisons are meaningless without the model stated. Ripple carry is quoted here as 2n gate delays under a one-tau-per-gate convention with P and G precomputed; other textbooks quote 3n or 2n+1 under different conventions. Write down which model you are using before you substitute.',
    },
    { id: 'comblog-problems', title: '10. Problem Sets: Minimisation, Hazards and Blocks',
      content: `## 10.1 How to use these

Every solution below names the distractor the problem is built around and
states the wrong number or expression that distractor produces. Attempt each
problem before reading on, and when your answer differs from the solution, find
out whether you fell into the named trap or into a different one.

## Problem Set 1 — Minimisation

**P1.1.** Minimise $F(A,B,C) = \\sum m(0,1,2,3,6)$.

**P1.2.** A three-variable function is 1 only when exactly two of its inputs are
1. Write the minimal sum of products.

**P1.3.** Minimise $F(A,B,C,D) = \\sum m(0,4,8,12)$.

**P1.4.** For $F(A,B,C,D) = \\sum m(1,3,5,7,9,11)$, how many prime implicants
are there and how many appear in the minimal cover?

### Solutions to Problem Set 1

**P1.1.** Minterms 0 through 3 all have A = 0, so they form a group of four
naming $\\overline{A}$. Minterm 6 is 110, which pairs with minterm 2 at 010
since they differ only in A, naming $B\\overline{C}$.

$$F = \\overline{A} + B\\overline{C}$$

Two terms, three literals. *Distractor:* pairing 6 with 7 to get $AB$ —
which is not an implicant here, because minterm 7 is 0 in this function. Only
cells that are 1 may be grouped.

**P1.2.** "Exactly two" means the patterns 011, 101 and 110, which are minterms
3, 5 and 6. No two of those are adjacent — each pair differs in two bits — so no
grouping is possible and the canonical form is already minimal:

$$F = \\overline{A}BC + A\\overline{B}C + AB\\overline{C}$$

Three terms, nine literals. *Distractor:* answering $AB + BC + AC$, which is
the "**at least** two" function and is additionally 1 at minterm 7. Reading
"exactly" as "at least" changes one row out of eight and the whole answer.

**P1.3.** Minterms 0, 4, 8 and 12 are 0000, 0100, 1000 and 1100 — every
combination of A and B with C = 0 and D = 0. That is a group of four deleting
both A and B:

$$F = \\overline{C}\\,\\overline{D}$$

One term, two literals. *Distractor:* reporting four separate terms because the
cells are not visually contiguous in a map drawn with the wrong axis order. The
group is real; the drawing was inconvenient.

**P1.4.** Every listed minterm is odd, so D = 1 throughout. The set is every odd
index except 13 and 15, which are the ones with A and B both 1. Growing groups
gives two prime implicants: $\\overline{A}D$ covering 1, 3, 5, 7 and
$\\overline{B}D$ covering 1, 3, 9, 11. Minterms 5 and 7 force the first;
minterms 9 and 11 force the second; both are therefore essential.

$$F = \\overline{A}D + \\overline{B}D$$

**Two prime implicants, both in the cover.** *Distractor:* writing
$D\\left(\\overline{A} + \\overline{B}\\right)$ and calling it a sum of
products. That is a factored form with the same literal count and it is not two
levels; if the question asks for SOP, the factored version is a different
answer.

## Problem Set 2 — Hazards and blocks

**P2.1.** Does $F = AC + \\overline{A}D$ have a static-1 hazard? If so, give
the input conditions and the cure.

**P2.2.** How many 2-to-1 multiplexers are needed to build an 8-to-1
multiplexer, and what is the delay in multiplexer delays?

**P2.3.** A 4-to-16 decoder is built from two 3-to-8 decoders. How is the fourth
input used?

**P2.4.** An 8-bit ripple-carry adder is built from full adders whose carry path
is 2 tau and whose sum path is 3 tau from the carry input. What is the total
worst-case delay?

### Solutions to Problem Set 2

**P2.1.** Hold C = 1 and D = 1, so $F = A + \\overline{A} = 1$ and the output
should not move. When A changes, the $AC$ term and the $\\overline{A}D$
term swap, and no other term is asserted in between, so **yes, there is a
static-1 hazard** at C = D = 1 on any change of A. The consensus of the two
terms with respect to A is the product of what remains:

$$F = AC + \\overline{A}D + CD$$

*Distractor:* answering that there is no hazard because the expression is
already minimal. Minimality is precisely what causes the hazard; a minimal
two-level SOP never contains a redundant spanning term, because minimisation
deletes exactly those.

**P2.2.** A 2-to-1 MUX halves the input count, so eight inputs need three
halvings. The tree is 4 gates in the first rank, 2 in the second and 1 in the
third:

$$4 + 2 + 1 = 7$$

**Seven multiplexers, three multiplexer delays.** *Distractor:* answering four,
by counting only the first rank. The first rank reduces eight inputs to four,
and those four still need selecting.

**P2.3.** The three low-order inputs go to both decoders in parallel. The fourth
and most significant input drives the **enable** inputs — directly to one
decoder and through an inverter to the other — so exactly one of the two
decoders is active and the sixteen outputs are asserted one at a time.
*Distractor:* ORing the fourth input into the address lines of both decoders,
which asserts two outputs at once and destroys the one-hot property that makes
a decoder useful.

**P2.4.** The carry must ripple through all eight stages, but the last stage's
sum is what completes the addition, and the last stage's sum is measured from
its own carry input. So seven carry hops feed the eighth stage's sum path:

$$7 \\times 2 + 3 = 17$$

**17 tau.** *Distractor:* multiplying the full-stage delay by eight to get 40
tau. Only the carry chain is serial; the final sum is one path, not eight, and
the earlier stages' sum outputs settle in parallel with the carry moving past
them.

## Practice Problems 3 — Rapid checks

**P3.1.** How many select lines does a 32-to-1 multiplexer need?

**P3.2.** Simplify $\\overline{A + \\overline{B}}$.

**P3.3.** A function of four variables has 11 minterms. How many maxterms does
it have?

**P3.4.** Which is faster for a 4-bit adder, ripple carry or lookahead, under
the 2n and 4 ceil(log4 n) models, and by how much?

### Solutions to Practice Problems 3

**P3.1.** The data input count is two raised to the number of selects:

$$2^{5} = 32$$

**Five.** *Distractor:* answering 32 by confusing data inputs with selects, or 4
by an arithmetic slip; 2 to the 4th is 16, not 32.

**P3.2.** De Morgan turns the complemented sum into a product of complements,
and the double bar on B cancels by involution:

$$\\overline{A + \\overline{B}} = \\overline{A} \\cdot B$$

*Distractor:* answering $\\overline{A} + B$, which keeps the operator
unchanged. That expression is 1 on three of the four rows while the correct
answer is 1 on one.

**P3.3.** Every row is either a minterm or a maxterm and the two lists are
complementary sets:

$$16 - 11 = 5$$

**Five.** *Distractor:* answering 11 by assuming the counts match, or 16 by
assuming every row contributes a maxterm.

**P3.4.** Substitute n = 4 into both models. Ripple gives $2 \\times 4$; the
lookahead exponent is 1 because $4^1 = 4$:

$$2 \\times 4 = 8$$

$$4 \\times 1 = 4$$

**Lookahead, by 4 tau — a factor of two.** *Distractor:* claiming lookahead is
always dramatically faster. At four bits it halves the delay for a large area
cost; the dramatic wins arrive at 32 and 64 bits, where the ratio reaches ten.`,
      examTip: 'When a combinational question gives you a specification in words, write the truth table before anything else. "Exactly two inputs high" and "at least two inputs high" differ by one row, and the minimal expressions look nothing alike.',
      importantNote: 'Every Boolean claim in these solutions was checked by evaluating both sides on every input combination — four rows for two variables, eight for three, sixteen for four. Where an expression is claimed minimal, the prime implicants were enumerated rather than assumed.',
    },
  ],
  keyTakeaways: [
    'MUX: 2^n inputs, n select; implements any n-variable function.',
    'Decoder: n inputs, 2^n minterms; any function = decoder + OR.',
    'Full-adder: Sum = A XOR B XOR Cin; Cout = AB + Cin(A XOR B).',
    'Ripple-carry O(n); carry-lookahead O(log n).',
    'Subtraction: A - B = A + (~B) + 1 via 2\'s complement.',
    'Priority encoder: encodes highest-priority active input.',
  ],
},

fee_seq_logic: { topicId: 'fee_seq_logic', title: 'Sequential Logic: Flip-Flops & Counters', domainWeight: 'Digital Systems · 7–11%',
  overview: 'Sequential circuits have memory -- outputs depend on current inputs and past state. Flip-flops store bits, counters count pulses. Understanding FF types, timing (setup/hold), and synchronous design is critical for the FE exam.',
  sections: [
    { id: 'seqlog-ff', title: '1. Flip-Flop Types and Timing',
      content: `## 1.1 Flip-Flop Types

| Type | Equation | Key Property |
|---|---|---|
| **SR** | $Q+ = S+R'Q (S*R=0)$ | S=R=1 **forbidden** |
| **D** | **$Q+ = D$** | Captures input on edge |
| **JK** | $Q+ = JQ'+K'Q$ | J=K=1 toggles; universal |
| **T** | $Q+ = T XOR Q$ | T=1 toggles, T=0 holds |

## 1.2 Timing Constraints

| Parameter | Definition |
|---|---|
| **Setup time (t_su)** | Data stable BEFORE clock edge |
| **Hold time (t_h)** | Data stable AFTER clock edge |
| **Clock-to-Q (t_cq)** | Delay from edge to output |

Violations cause **metastability** (unpredictable state).

**Max frequency**: **$f_{\\max} = 1 / (t_{cq} + t_{comb} + t_{su})$**`,
      examTip: 'D FF: Q+ = D (most common and most tested). f_max = 1/(t_cq + t_comb + t_su). Setup/hold violations cause metastability.',
      importantNote: 'SR with S=R=1 is forbidden (indeterminate). JK solves this: J=K=1 = toggle. This is why JK is called "universal."',
    },
    { id: 'seqlog-counters', title: '2. Counters and Registers',
      content: `## 2.1 Counter Types

| Type | Clocking | Speed |
|---|---|---|
| **Asynchronous (ripple)** | Each FF by previous | Slow (cumulative) |
| **Synchronous** | All FFs same clock | Fast |
| **Mod-N** | Counts 0 to N-1 | ceil(log_2(N)) FFs |
| **BCD** | Mod-10 (0-9) | 4 FFs + reset |

## 2.2 Shift Registers

- **SISO**: serial delay element
- **SIPO**: serial-to-parallel
- **PISO**: parallel-to-serial
- **LFSR**: feedback for pseudo-random / CRC

## 2.3 Synchronous vs. Asynchronous

| | Synchronous | Asynchronous |
|---|---|---|
| Clock | Shared | Cascaded |
| Speed | Fast | Slow |
| Glitches | None | Possible |`,
      examTip: 'Synchronous always preferred (fast, reliable). Mod-N counter: ceil(log_2(N)) flip-flops with reset at N.',
    },
    { id: 'seqlog-exam', title: '3. Sequential Circuit Analysis',
      content: `## 3.1 Trace JK Flip-Flop Sequence

**Given**: JK flip-flop, initial Q = 0. Input sequence: J=1,K=0 / J=1,K=1 / J=0,K=1 / J=1,K=1.

| Clock | J | K | Action | Q+ |
|---|---|---|---|---|
| 1 | 1 | 0 | **Set** | **1** |
| 2 | 1 | 1 | **Toggle** | **0** |
| 3 | 0 | 1 | **Reset** | **0** |
| 4 | 1 | 1 | **Toggle** | **1** |

**JK rules**: J=0,K=0 -> Hold; J=1,K=0 -> Set; J=0,K=1 -> Reset; J=1,K=1 -> Toggle.

## 3.2 Design Mod-6 Counter State Table

**Mod-6**: counts 0,1,2,3,4,5 then resets to 0. Needs ceil(log_2(6)) = **3 flip-flops** (Q2,Q1,Q0).

| Current (Q2Q1Q0) | Next | Q2+ | Q1+ | Q0+ |
|---|---|---|---|---|
| 000 (0) | 001 (1) | 0 | 0 | 1 |
| 001 (1) | 010 (2) | 0 | 1 | 0 |
| 010 (2) | 011 (3) | 0 | 1 | 1 |
| 011 (3) | 100 (4) | 1 | 0 | 0 |
| 100 (4) | 101 (5) | 1 | 0 | 1 |
| 101 (5) | 000 (0) | 0 | 0 | 0 |
| 110 (6) | XXX | X | X | X |
| 111 (7) | XXX | X | X | X |

States 6 and 7 are **don't-cares** (never reached in normal operation). Use D flip-flops: D_i = Q_i+ from the table. K-map each output for minimal logic.

## 3.3 Shift Register LFSR Analysis

**4-bit LFSR** with feedback: new_bit = Q3 XOR Q2. Seed = 1000.

| Clock | Q3 | Q2 | Q1 | Q0 | Feedback (Q3 XOR Q2) |
|---|---|---|---|---|---|
| 0 | 1 | 0 | 0 | 0 | $1 XOR 0 = 1$ |
| 1 | 1 | 1 | 0 | 0 | $1 XOR 1 = 0$ |
| 2 | 0 | 1 | 1 | 0 | $0 XOR 1 = 1$ |
| 3 | 1 | 0 | 1 | 1 | $1 XOR 0 = 1$ |
| 4 | 1 | 1 | 0 | 1 | $1 XOR 1 = 0$ |

The LFSR cycles through a **pseudo-random sequence**. With proper tap selection, a maximal-length LFSR of n bits produces 2^n - 1 states before repeating (all states except all-zeros).

**Exam strategy**: For JK flip-flop tracing, apply the rules at each clock edge in order. For counter design, write the state table first, mark unused states as don't-cares, then derive excitation equations with K-maps.`,
      examTip: 'JK: J=K=1 means TOGGLE (not set, not reset). This is the most commonly confused JK condition. For counters, unused states are don\'t-cares — use them to simplify.',
      importantNote: 'Mod-N counter with N not a power of 2 requires external reset logic. The counter reaches state N-1, then the next clock edge forces it back to 0 via combinational decode.',
    },
    { id: 'seqlog-timing', title: '4. Timing Closure: Setup, Hold, Skew, and Slack',
      content: `## 4.1 Two constraints, and only one of them cares about the clock period

Every register-to-register path in a synchronous design has to satisfy two
separate inequalities, and confusing them is the most expensive mistake in
digital timing.

The **setup constraint** says the data launched by one edge must be settled
before the next edge arrives:

**t_cq + t_comb,max + t_su <= T**

The **hold constraint** says the newly launched data must not race ahead and
overwrite the value the capture flip-flop is still sampling:

**t_cq + t_comb,min >= t_h + t_skew**

The clock period T appears in the first inequality and not in the second. That
single structural fact carries a consequence worth committing to memory: a
setup failure can always be fixed by slowing the clock down, and a hold failure
never can. Hold violations are fixed by adding delay to the data path or by
repairing the clock distribution, and a chip that fails hold is a chip that
does not work at any speed.

## 4.2 A worked path

Take t_cq = 2 ns, worst-case combinational delay 5 ns, and t_su = 1 ns. The
path needs

**T_min = 2 + 5 + 1 = 8 ns**, so **f_max = 1/8 ns = 125 MHz**

Run that same logic at 100 MHz, where T = 10 ns, and the surplus is the
**slack**:

**slack = T - (t_cq + t_comb + t_su) = 10 - 8 = 2 ns**

Slack is the number a timing tool actually reports, and its sign is the whole
verdict: positive means the path closes, zero means it closes with nothing to
spare, negative means it does not close at all.

![One clock period of a flip-flop to flip-flop path drawn to scale at 100 megahertz. The launch edge is followed by two nanoseconds of clock-to-output delay and five nanoseconds of combinational delay, leaving the data valid at seven nanoseconds; the setup window opens at nine nanoseconds, so two nanoseconds of slack remain.](/courses/fe-ee/figures/dig-timing-slack.svg)

The picture makes the arithmetic geometric. The period is a fixed-length ruler.
Clock-to-output, combinational delay and setup time are three segments laid end
to end along it, and slack is whatever length of ruler is left over. Raise the
frequency and the ruler shortens while the three segments do not — which is why
the same circuit that closes comfortably at 100 MHz has exactly zero slack at
125 MHz and is 1.33 ns short at 150 MHz.

| Combinational delay | T_min | f_max | Slack at 100 MHz |
|---|---|---|---|
| 2 ns | 5 ns | 200 MHz | 5 ns |
| 5 ns | 8 ns | **125 MHz** | **2 ns** |
| 9 ns | 12 ns | 83.3 MHz | -2 ns (fails) |
| 12 ns | 15 ns | 66.7 MHz | -5 ns (fails) |
| 17 ns | 20 ns | 50 MHz | -10 ns (fails) |

## 4.3 Hold, skew, and the direction skew pushes

Check the hold constraint on the same path, taking the fastest possible
combinational route as 1 ns, a hold requirement of 0.5 ns, and 0.8 ns of clock
skew in the direction that hurts:

**margin = (t_cq + t_comb,min) - (t_h + t_skew) = (2 + 1) - (0.5 + 0.8) = 1.7 ns**

Comfortable. Notice what made it comfortable: t_cq is large and the shortest
path is not zero. A design full of directly cascaded flip-flops with no logic
between them has t_comb,min = 0 and lives entirely on its clock-to-output time,
which is why hold problems cluster in shift registers and scan chains rather
than in deep arithmetic.

Skew has opposite signs in the two constraints. If the capture clock arrives
*late*, the setup constraint relaxes (there is more time to settle) while the
hold constraint tightens. Deliberately skewing a clock to steal time for a slow
path is a real technique, and it always spends hold margin to buy setup margin.

## 4.4 Metastability is a probability, not a state

When setup or hold is violated, the flip-flop may enter a **metastable**
condition in which its output hovers between levels before resolving in an
unpredictable direction. Two properties matter for the exam. First, resolution
time is not bounded — it is exponentially distributed, so you can make failure
arbitrarily unlikely but never impossible. Second, the standard mitigation for
a genuinely asynchronous input is a **two-flip-flop synchroniser**: the first
flip-flop may go metastable, and the second gives it a full clock period to
settle before anything downstream sees the value. Adding stages lengthens the
mean time between failures dramatically at the cost of one cycle of latency
each.

**How the exam asks this.** Almost always as f_max from a delay list. Add
clock-to-output, the worst-case logic, and setup; invert; done. The trap is an
extra delay in the list that belongs to neither the path nor the constraint —
hold time, for instance, is never part of the setup sum.`,
      examTip: 'Setup failures are fixed by a slower clock; hold failures are not fixed by any clock. If a question offers "reduce the clock frequency" as a remedy for a hold violation, that option is wrong by construction.',
      importantNote: 'Slack is defined as available time minus required time, so positive slack is good. A reported slack of -1.33 ns at 150 MHz means the path needs 1.33 ns more than the period provides, not that it has 1.33 ns to spare.',
    },
    { id: 'seqlog-hazards', title: '5. Hazards, Races, and Reading Delays off a Timing Diagram',
      content: `## 5.1 A circuit that is right on paper and wrong in time

Consider **F = A·C' + B·C** with A and B both held at 1. Substituting, F =
C' + C = 1: the output should be a constant, no matter what C does. Now give
every gate one gate delay and drop C from 1 to 0.

The inverter takes one tau to raise C', and the AND gate above it takes another
tau to raise A·C'. Meanwhile B·C falls only one tau after C falls. For a window
of exactly one tau, the falling term has already let go and the rising term has
not yet taken hold, and the OR gate has nothing to hold the output up.

![A unit-delay simulation of F equal to A and not-C, or B and C, with A and B held at one and C falling at five gate delays. The traces show the inverter and both product terms, then the output dropping to zero for exactly one gate delay before recovering, and finally the same output with the consensus term A and B added, which never drops.](/courses/fe-ee/figures/dig-hazard-glitch.svg)

The trace was produced by simulating the gates, not by drawing what a glitch
looks like, which is why the width and position of the hole are trustworthy:
the output falls at 7 tau and recovers at 8 tau. This is a **static-1 hazard**
— an output that should stay at 1 momentarily dips to 0 because of unequal path
delays.

## 5.2 Naming and curing hazards

| Type | Intended behaviour | What actually happens |
|---|---|---|
| **Static-1** | output stays at 1 | one or more brief dips to 0 |
| **Static-0** | output stays at 0 | one or more brief spikes to 1 |
| **Dynamic** | output changes once | it changes three or more times before settling |

The cure for the static-1 case is visible on a Karnaugh map. Plot the function
and you find two groups of 1s that are adjacent but do not overlap; the
transition walks from one group to the other, and for an instant neither is
holding the output. Adding a **consensus term** — a redundant group that bridges
the two — gives the output something to hold onto throughout. Here the bridging
group is A·B, and the second trace in the figure shows the hole gone. The term
is logically redundant, which is exactly why a minimiser removes it and why a
hazard-free design must be built with minimisation deliberately restrained.

Static-0 hazards are the dual and are removed by adding a redundant sum term to
a product-of-sums implementation.

## 5.3 When a glitch matters and when it does not

In a fully synchronous design a hazard is usually harmless: the glitch happens
early in the cycle and the output has long settled by the time the clock edge
samples it. That is the deepest reason synchronous design dominates. Glitches
become real faults in exactly the places where something looks at the signal
between edges:

- a signal used as a **clock**, an asynchronous **reset**, or a flip-flop enable
- a signal leaving the clock domain to something that is not clocked
- any **clock-gating** network, where a spurious pulse is a spurious clock

## 5.4 Race-around, and why edge triggering exists

A JK **latch** — level-triggered rather than edge-triggered — has a defect that
the flip-flop version does not. With J = K = 1, the latch toggles. But if the
clock stays high longer than the feedback loop takes to travel, it toggles
again, and again, for as long as the level persists. With a clock pulse 100 ns
wide and a loop delay of 15 ns, the output toggles

**100 ns / 15 ns = 6 times**

within one pulse, and the final state depends on whether the count is even or
odd — which is to say it depends on manufacturing tolerances. This is
**race-around**. The classical remedy is the **master-slave** arrangement, in
which one latch samples while the clock is high and a second passes the value
on when the clock goes low, so exactly one change occurs per clock cycle no
matter how wide the pulse is. Modern parts use edge-triggered flip-flops that
achieve the same guarantee directly, which is why race-around is a question
about latches and never about a properly specified flip-flop.

## 5.5 Reading a counter's delay off the diagram

Ripple counters make the delay visible. Each flip-flop clocks the next, so in a
4-bit ripple counter with 10 ns of propagation delay per stage, the transition
from 0111 to 1000 has to walk through all four stages:

**t_settle = 4 x 10 ns = 40 ns**, so the usable rate is **25 MHz**

and during those 40 ns the output bus shows a succession of wrong intermediate
values, which is why decoding a ripple counter's state combinationally produces
decoding spikes. A synchronous counter clocks every stage together, so its
period is one flip-flop delay plus the setup time of the next-state logic:

**T = 10 + 5 = 15 ns**, giving **66.7 MHz** — about 2.7 times faster

and the width does not matter, because adding stages adds gate levels to the
next-state logic rather than links to a delay chain.

| Counter | Settling model | 4-bit rate | Intermediate states? |
|---|---|---|---|
| Ripple (asynchronous) | n x t_pd | 25 MHz | yes, all wrong values |
| **Synchronous** | t_pd + t_su | **66.7 MHz** | no |

**How the exam asks this.** Timing-diagram questions give per-gate or per-stage
delays and ask when an output changes; count the levels a signal must traverse
and multiply. Hazard questions usually give a two-level expression and ask
which redundant term removes the glitch — find the two adjacent, non-overlapping
groups on the map and name the group that bridges them.`,
      examTip: 'A hazard is a delay artefact, not a logic error: the truth table is already correct. The fix is a redundant consensus term, which means the hazard-free circuit deliberately uses more gates than the minimal one.',
      importantNote: 'Race-around belongs to level-triggered JK latches, not to edge-triggered JK flip-flops. If a question mentions master-slave construction or a narrow clock pulse requirement, it is testing this distinction.',
    },
  ],
  keyTakeaways: [
    'D FF: Q+=D (most common). JK: universal (J=K=1 toggles). T: toggles when T=1.',
    'SR S=R=1 forbidden. JK resolves this.',
    'Setup/hold violations -> metastability. f_max = 1/(t_cq + t_comb + t_su).',
    'Synchronous counters: fast, reliable (shared clock). Asynchronous: slow, glitchy.',
    'Mod-N: ceil(log_2(N)) FFs with reset logic.',
    'Shift registers: SISO, SIPO, PISO, PIPO; LFSR for pseudo-random.',
  ],
},

fee_state_machines: { topicId: 'fee_state_machines', title: 'Finite State Machines', domainWeight: 'Digital Systems · 7–11%',
  overview: 'A Finite State Machine (FSM) is defined by states, transitions on inputs, and outputs. Moore and Mealy are the two architectures. FSM design from word description to implementation is a core FE exam skill.',
  sections: [
    { id: 'fsm-types', title: '1. Moore and Mealy Machines',
      content: `## 1.1 FSM Components

- **States**: circles in diagrams
- **Transitions**: arrows labeled with inputs
- **Outputs**: on states (Moore) or transitions (Mealy)

## 1.2 Moore vs. Mealy

| Feature | Moore | Mealy |
|---|---|---|
| Output depends on | State only | State AND input |
| Glitch behavior | Glitch-free | May glitch |
| States needed | More | Fewer |
| Response time | 1 clock slower | Within same cycle |

## 1.3 Conversion

- **Moore -> Mealy**: move output labels from states to incoming transitions
- **Mealy -> Moore**: split states with different transition outputs`,
      examTip: 'Moore = f(state); Mealy = f(state, input). Moore needs more states but glitch-free. FE exam may ask you to trace a state diagram given inputs.',
    },
    { id: 'fsm-design', title: '2. FSM Design Process',
      content: `## 2.1 Design Steps

1. **State diagram** from problem description
2. **State table**: current state, input, next state, output
3. **State assignment**: binary codes (n states need ceil(log_2(n)) FFs)
4. **Excitation equations**: next-state logic for chosen FF type
5. **Output equations**: derive output logic
6. **Implementation**: FFs + combinational logic

## 2.2 State Minimization

Two states are **equivalent** if for ALL inputs they produce same output and go to equivalent next states. Combining equivalent states reduces hardware.

## 2.3 State Assignment

| Strategy | FFs | Best For |
|---|---|---|
| **Binary** | ceil(log_2(n)) | Minimum FFs |
| **Gray code** | ceil(log_2(n)) | Fewer glitches |
| **One-hot** | n (one per state) | Fast logic, FPGAs |

Counters are special-case FSMs with fixed state sequences.`,
      examTip: 'One-hot uses n FFs for n states -- more FFs but simpler logic. Preferred in FPGAs where FFs are abundant.',
      importantNote: 'State minimization combines EQUIVALENT states. Do not confuse with state encoding (choosing binary codes for states).',
    },
    { id: 'fsm-exam', title: '3. FSM Design Walkthrough',
      content: `## 3.1 Design Sequence Detector for "101"

**Specification**: Detect the pattern "101" in a serial bit stream. Output = 1 when "101" detected. Allow overlapping sequences.

**States** (Moore machine):
- **S0**: no bits matched (output 0)
- **S1**: matched "1" (output 0)
- **S2**: matched "10" (output 0)
- **S3**: matched "101" (output 1)

## 3.2 Complete State Table and Transition Diagram

| Current State | Input = 0 | Input = 1 | Output |
|---|---|---|---|
| **S0** | S0 | S1 | 0 |
| **S1** | S2 | S1 | 0 |
| **S2** | S0 | **S3** | 0 |
| **S3** | S2 | S1 | **1** |

**Key transitions**:
- S2 + input 1 -> S3 (pattern "101" complete)
- S3 + input 0 -> S2 (overlap: the "1" from "101" starts a new "10")
- S3 + input 1 -> S1 (the last "1" starts a new potential match)

**Flip-flop equations** (2 D flip-flops, binary encoding S0=00, S1=01, S2=10, S3=11):
- D1 = Q0*X' + Q1*Q0'*X (next state MSB — see Section 4.2 for the full K-map derivation; note the first term is Q0*X', not Q1'*Q0*X', because BOTH states with Q0 = 1 go to S2 on a 0)
- D0 = X (next state LSB)
- Output = Q1 AND Q0

## 3.3 Moore vs Mealy Comparison for Same Problem

| Feature | Moore "101" Detector | Mealy "101" Detector |
|---|---|---|
| States | **4** (S0-S3) | **3** (S0-S2) |
| Output timing | 1 clock after pattern | Same clock as last bit |
| Glitches | None | Possible on input change |
| Output depends on | State only | State AND input |

**Mealy version** (3 states): S2 + input 1 -> S0 with output **1** on the transition. The output appears one clock cycle earlier but may glitch if input changes asynchronously.

**Exam strategy**: For FSM design, always: (1) identify states by what has been matched so far, (2) handle overlapping by reusing partial matches, (3) Moore needs one extra state vs Mealy for the output. The state table is the most important step — get it right and the implementation follows mechanically.`,
      examTip: 'Sequence detectors are the #1 FSM exam problem. Always consider overlapping detection — after detecting "101", the final "1" can start a new match. Moore needs 4 states; Mealy needs 3.',
      importantNote: 'Moore outputs change only on clock edges (glitch-free). Mealy outputs can change mid-cycle when inputs change. For synchronous designs, register Mealy outputs to prevent glitches. Note on the D1 equation above: the minimal next-state expression for this encoding is D1 = Q0*X\' + Q1*Q0\'*X, derived in full in Section 4.2 below. The first product term must be Q0*X\' rather than Q1\'*Q0*X\', because BOTH states with Q0 = 1 (S1 and S3) move to S2 on a 0 input.',
    },
    { id: 'fsm-synthesis', title: '4. From State Table to Gates: Encoding, Excitation, and One-Hot',
      content: `## 4.1 Synthesis is mechanical once the table is right

The state table is the creative step. Everything after it is bookkeeping that a
careful person cannot get wrong:

1. assign a binary code to each state
2. write the next-state columns as functions of the state bits and the inputs
3. convert those functions into flip-flop inputs using the chosen device's
   excitation rules
4. minimise each flip-flop input expression, and the output expression, on its
   own map

Step 3 is the only place the flip-flop type appears. For a D flip-flop it is
free — D is the next state, by definition — which is why nearly all modern
synthesis targets D flip-flops.

## 4.2 D-flip-flop excitation for the "101" detector

Use the encoding from Section 3: S0 = 00, S1 = 01, S2 = 10, S3 = 11, with
Q1 as the high bit. Copy the state table into next-state bits:

| Q1 Q0 (state) | X | Next state | Q1+ | Q0+ |
|---|---|---|---|---|
| 00 (S0) | 0 | S0 = 00 | 0 | 0 |
| 00 (S0) | 1 | S1 = 01 | 0 | 1 |
| 01 (S1) | 0 | S2 = 10 | **1** | 0 |
| 01 (S1) | 1 | S1 = 01 | 0 | 1 |
| 10 (S2) | 0 | S0 = 00 | 0 | 0 |
| 10 (S2) | 1 | S3 = 11 | **1** | 1 |
| 11 (S3) | 0 | S2 = 10 | **1** | 0 |
| 11 (S3) | 1 | S1 = 01 | 0 | 1 |

Read the Q0+ column: it is a copy of X in every row, so **D0 = X**. That is not
a coincidence — the low state bit was assigned to mean "the last bit seen was a
1", so of course it equals the input.

Now Q1+, which is 1 in three rows: (Q1 Q0 X) = 010, 101 and 110. Grouping 010
with 110 eliminates Q1 and leaves Q0·X'; the remaining cell 101 gives
Q1·Q0'·X. So

**D1 = Q0 · X' + Q1 · Q0' · X**

An exhaustive machine check confirms this expression matches the table on all
eight combinations, and confirms that it is minimal. The grouping that people
miss is the first one. Both S1 and S3 have Q0 = 1, and both go to S2 on a 0
input — the pair covers two rows, so the term must be Q0·X' with the Q1
variable eliminated, not a three-literal term that names only one of them. If
you circle a single cell there instead of the pair, the machine silently fails
to detect the second of two back-to-back patterns.

The output is a plain state decode: **Y = Q1 · Q0**.

## 4.3 The same machine on JK flip-flops

JK excitation trades one gate input for don't-cares. The rules are worth
memorising because they are short:

| Present Q | Next Q | J | K |
|---|---|---|---|
| 0 | 0 | 0 | X |
| 0 | 1 | 1 | X |
| 1 | 0 | X | 1 |
| 1 | 1 | X | 0 |

Half of every column is a don't-care, which is what makes JK maps minimise so
well. Applying these rules to the Q1 column of the table above and minimising
with the don't-cares gives

**J1 = Q0 · X'** and **K1 = Q0' · X' + Q0 · X**

The second expression is the exclusive-NOR of Q0 and X, so the K input is a
single XNOR gate. Substituting these back through the JK characteristic
equation reproduces the state table exactly on all eight combinations, which
was verified here rather than asserted.

## 4.4 One-hot encoding

One-hot spends one flip-flop per state and holds exactly one of them at 1. The
next-state equation for each state is then a direct transcription of the
incoming arrows on the diagram — no map, no minimisation:

**S0+ = X' · (S0 + S2)**
**S1+ = X · (S0 + S1 + S3)**
**S2+ = X' · (S1 + S3)**
**S3+ = X · S2**, and the output is simply **Y = S3**

Running this network and the two-bit encoded version side by side on 500
randomly generated input streams produced identical outputs on every stream,
which is the practical form of the claim that the two are the same machine.

| Encoding | Flip-flops for n states | Next-state logic | Output decode | Typical home |
|---|---|---|---|---|
| Binary | ceil(log2 n) | deepest | needs a decoder | ASIC, tight area |
| Gray | ceil(log2 n) | similar to binary | needs a decoder | fewer switching glitches |
| **One-hot** | n | shallowest | one wire per state | **FPGA** |

The FPGA preference has a concrete cause: a fabric's flip-flops come free
alongside its lookup tables, so spending flip-flops to shorten logic depth
raises the clock rate at no real cost.

## 4.5 State minimisation, worked

Two states are **equivalent** when they produce the same output and, for every
input, move to states that are themselves equivalent. The standard procedure
starts by splitting the states by output and refines until nothing changes.
Take a five-state machine:

| State | Next on 0 | Next on 1 | Output |
|---|---|---|---|
| A | B | C | 0 |
| B | D | E | 0 |
| C | D | E | 0 |
| D | A | A | **1** |
| E | B | C | 0 |

The first split separates D (output 1) from the rest. Refining, B and C have
identical rows and merge immediately; A and E also have identical rows and
merge. The machine collapses to three states, {A, E}, {B, C}, and {D}. Note
what this does and does not save: three states still need two flip-flops, so
the register count is unchanged, but the next-state logic now has two unused
codes available as don't-cares, and the smaller table is easier to verify.

**How the exam asks this.** Either "how many flip-flops does this machine
need", which is ceil(log2 n) for binary and n for one-hot, or "write the
excitation equations", which is the table-plus-map procedure above. A question
that asks you to minimise states is asking you to run the output split and then
compare rows.`,
      examTip: 'With D flip-flops the excitation table is the next-state table, so there is nothing to convert. Reach for JK excitation only when the problem hands you JK devices; its advantage is the column of don\'t-cares, which usually yields simpler input equations than the D form of the same machine.',
      importantNote: 'State minimisation reduces the number of states, not necessarily the number of flip-flops. Five states and three states both require two flip-flops in binary encoding, so the saving shows up in the combinational logic and the unused-state don\'t-cares, not in the register count.',
    },
    { id: 'fsm-trace-hdl', title: '5. Moore and Mealy on the Same Stream, and How FSMs Are Coded',
      content: `## 5.1 One input stream, two answers, one cycle apart

Arguments about Moore against Mealy become concrete the moment both machines
run on the same data. Feed the ten-bit stream **1010110101** into both
detectors from Section 3. The pattern "101" completes at bit positions 2, 4, 7
and 9, counting from zero and allowing overlaps.

![A trace of the same ten-bit input stream through both detectors. The input bits, the Moore machine's state each cycle, the Mealy output and the Moore output are drawn on a common cycle axis, with the four cycles in which the pattern completes shaded and arrows connecting each Mealy pulse to the corresponding Moore pulse one cycle later.](/courses/fe-ee/figures/dig-fsm-trace.svg)

Both machines were simulated from their state tables to produce this trace, and
the alignment claim was asserted before the figure was drawn: the Mealy output
pulses in cycles 2, 4, 7 and 9, and the Moore output pulses in cycles 3, 5, 8
and 10. Same four detections, same order, one cycle of latency between them.

The reason is structural rather than accidental. A Mealy output is combinational
logic on the current state and the current input, so it can respond within the
cycle in which the deciding bit arrives. A Moore output is combinational logic
on the state alone, and the state does not become S3 until the clock edge at
the end of that cycle — so its answer appears in the following cycle. Read the
state row in the figure and this is visible directly: S3 is entered by the edge
that closes each shaded cycle.

## 5.2 What that costs and buys

| Property | Moore | Mealy |
|---|---|---|
| Output latency | one cycle after the deciding input | same cycle |
| Output during a cycle | constant | follows the input, so it can glitch |
| States for this detector | 4 | 3 |
| Safe to use as a clock or enable | yes | only if registered |

Registering a Mealy output — passing it through one flip-flop — removes the
glitch exposure and makes it appear one cycle later, which is to say it turns
it into the Moore behaviour. That equivalence is the practical resolution of
the debate: choose Mealy when the cycle of latency genuinely matters, and
register the output whenever anything downstream is sensitive to a mid-cycle
transition.

## 5.3 How a state machine is actually written

The FE exam does not test hardware description language syntax, but it does
expect awareness of how these machines are described, and the structure of that
description mirrors the theory closely enough to be worth knowing. The standard
template in either VHDL or Verilog splits the machine into distinct blocks:

- a **clocked block** containing only the state register, whose entire body is
  "on the active clock edge, the current state becomes the next state"
- a **combinational block** computing the next state from the current state and
  the inputs, which is the state table transcribed as a case statement
- an **output block**, which reads only the state for a Moore machine and reads
  the state and the inputs for a Mealy machine

Keeping the three separate is not a style preference. It guarantees that
exactly the flip-flops you intended are inferred, and it makes the Moore or
Mealy character of the machine a property of one block that anyone can read.

Two practical points come up repeatedly. First, **reset**: a synchronous reset
is one more entry in the clocked block and costs nothing but a term in the
next-state logic, while an asynchronous reset takes effect without a clock and
therefore needs care about when it is released. Second, a combinational block
that fails to assign the next state on every path implies that the value must
be remembered, and the synthesis tool will honour that by inferring a
**latch** — an unintended, level-sensitive storage element that breaks the
synchronous timing model described in the sequential-logic topic. The defence is
to give the next-state variable a default assignment before the case statement.

Encoding, meanwhile, is usually left to the tool, which is why the one-hot
equations in Section 4.4 rarely get written by hand: the designer states the
state names, and the tool picks binary, Gray, or one-hot according to the target
and the optimisation goal.

## 5.4 Reading a state diagram under exam conditions

Nearly all FSM questions are one of four things.

| Question form | Method |
|---|---|
| Trace a diagram given an input string | walk it one bit at a time, writing the state after each bit |
| How many flip-flops | ceil(log2 n) for binary, n for one-hot |
| Moore or Mealy | look at where the output label sits: inside a state, or on an arrow |
| Design a detector | name each state by what has been matched so far, then handle overlap |

The overlap rule is the one that separates a correct sequence detector from a
plausible-looking wrong one. After a successful match, do not return to the
start state by reflex. Ask what the tail of the just-matched pattern could
begin, and go to the state representing that partial match — which for "101"
means the final 1 is also a valid first bit, so the machine leaves S3 into the
same states S1 and S2 that it would from anywhere else.`,
      examTip: 'On a trace question, write the state after every input bit in a single row and read the outputs off underneath. For a Moore machine the output belongs to the state you have just entered, so it is reported one column to the right of the Mealy answer for the same stream.',
      importantNote: 'A Mealy output registered through one flip-flop behaves exactly like the Moore output of the same machine. If a design needs the early answer, use Mealy unregistered and accept the glitch risk; if it needs a clean signal, the extra state or the extra register is the price.',
    },
  ],
  keyTakeaways: [
    'Moore: output = f(state), glitch-free, more states. Mealy: f(state,input), fewer states, faster.',
    'Design: state diagram -> table -> assignment -> excitation equations -> implement.',
    'State minimization: combine equivalent states (same output, equivalent next states).',
    'Binary (min FFs), Gray (min glitches), one-hot (fast logic, n FFs for n states).',
    'n states need ceil(log_2(n)) FFs in binary, or n in one-hot.',
    'Counters = FSMs with fixed sequences.',
  ],
},

fee_memory: { topicId: 'fee_memory', title: 'Memory Systems: ROM, RAM, Cache, FPGA', domainWeight: 'Digital Systems · 7–11%',
  overview: 'Memory systems store data across a hierarchy trading speed for capacity. ROM is permanent, RAM is volatile, cache bridges the speed gap, and FPGAs offer reconfigurable logic. Cache hit-rate formula and the speed-capacity tradeoff are essential FE exam topics.',
  sections: [
    { id: 'mem-types', title: '1. ROM and RAM Technologies',
      content: `## 1.1 ROM (Nonvolatile)

| Type | Erase |
|---|---|
| ROM | Never |
| PROM | Never (one-time) |
| EPROM | UV light |
| EEPROM | Electrically (byte) |
| **Flash** | Electrically (block) |

## 1.2 RAM (Volatile)

| Type | Cell | Speed | Density | Refresh |
|---|---|---|---|---|
| **SRAM** | 6 transistors | Fast (~1-10 ns) | Low | No |
| **DRAM** | 1T + 1C | Slower (~50-100 ns) | High | Yes |

## 1.3 Memory Addressing

- **Capacity** = 2^(address_bits) locations
- n address lines, m bits/location: total = 2^n * m bits

## 1.4 Memory Hierarchy

| Level | Size | Access |
|---|---|---|
| Registers | $< 1 KB$ | ~0.5 ns |
| L1 Cache | 32-64 KB | ~1-4 ns |
| L2 Cache | 256 KB-1 MB | ~4-10 ns |
| RAM | 4-64 GB | ~50-100 ns |
| SSD | 256 GB-4 TB | ~50-100 us |
| HDD | 1-20 TB | ~5-10 ms |

Each level: ~10x larger, ~10x slower, ~10x cheaper.`,
      examTip: 'Memory capacity = 2^(address_bits). "How many lines for 64K locations?" = 16 (2^16 = 65536). SRAM = cache; DRAM = main memory.',
      importantNote: 'DRAM needs refresh every few ms (unavailable during refresh). SRAM has no refresh -- one reason it is used for cache.',
    },
    { id: 'mem-cache-fpga', title: '2. Cache and FPGA',
      content: `## 2.1 Cache Performance

**Hit rate**: h = hits / (hits + misses)

**Average access time**: **t_avg = h * t_cache + (1-h) * t_memory**

### Cache Organization

| Type | Description | Hit Time | Miss Rate |
|---|---|---|---|
| **Direct-mapped** | 1 location per block | Fastest | Highest |
| **Fully associative** | Any location | Slowest | Lowest |
| **N-way set-assoc** | N locations | Balanced | Balanced |

### Write Policies

- **Write-through**: writes to cache AND memory (simple, slow)
- **Write-back**: cache only, dirty bit (fast, complex)

## 2.2 FPGA

- **CLBs**: configurable logic blocks
- **Programmable interconnects**: route signals
- **Reconfigurable**: reprogram without hardware change

| | FPGA | ASIC |
|---|---|---|
| Reconfigurable | Yes | No |
| Dev cost | Low | Very high |
| Performance | Good | Best |
| Best for | Prototyping, low volume | High volume |`,
      examTip: 'Cache: t_avg = h*t_cache + (1-h)*t_memory. With h=0.95, t_cache=5ns, t_memory=100ns: t_avg = 9.75 ns -- 10x improvement.',
    },
    { id: 'mem-exam', title: '3. Memory System Calculations',
      content: `## 3.1 Address Lines for 256 KB Memory

**Capacity** = 256 KB = 256 * 1024 = 262,144 bytes = 2^18 bytes

**Address lines needed**: log_2(2^18) = **18 address lines**

| Memory Size | Bytes | Address Lines |
|---|---|---|
| 1 KB | $2^10$ | 10 |
| 64 KB | $2^16$ | 16 |
| **256 KB** | **$2^18$** | **18** |
| 1 MB | $2^20$ | 20 |
| 4 GB | $2^32$ | 32 |

If each location stores W bits (word width), total bits = 2^n * W. Data bus width = W bits; address bus = n bits.

## 3.2 Cache Hit Rate Impact on EMAT

**Effective Memory Access Time**: t_avg = h * t_cache + (1-h) * t_memory

| Hit Rate (h) | $t_{cache} = 5\\ \\mathrm{ns}$ | $t_{memory} = 100\\ \\mathrm{ns}$ | **t_avg** |
|---|---|---|---|
| 80% | $0.80 * 5 = 4.0$ | $0.20 * 100 = 20.0$ | **24.0 ns** |
| 90% | $0.90 * 5 = 4.5$ | $0.10 * 100 = 10.0$ | **14.5 ns** |
| 95% | $0.95 * 5 = 4.75$ | $0.05 * 100 = 5.0$ | **9.75 ns** |
| 99% | $0.99 * 5 = 4.95$ | $0.01 * 100 = 1.0$ | **5.95 ns** |

Going from 90% to 95% hit rate improves EMAT by 33%. Going from 95% to 99% improves by another 39%. **Every percentage point matters more at higher hit rates.**

## 3.3 DRAM Refresh Overhead Calculation

**Given**: 4096-row DRAM, refresh interval = 64 ms, each refresh takes 50 ns.

- **Refreshes per interval**: 4096 rows
- **Total refresh time**: 4096 * 50 ns = 204.8 us
- **Overhead**: 204.8 us / 64 ms = **0.32%** of time spent refreshing

| DRAM Rows | Refresh Time | Overhead |
|---|---|---|
| 2048 | 102.4 us | 0.16% |
| **4096** | **204.8 us** | **0.32%** |
| 8192 | 409.6 us | 0.64% |

During refresh, that row is **unavailable** for read/write. Modern DRAM controllers schedule refreshes during idle periods to minimize impact.

**Exam strategy**: Address lines = log_2(total locations). For EMAT, just plug into h*t_fast + (1-h)*t_slow. For multi-level cache, chain: EMAT = h1*t_L1 + (1-h1)*h2*t_L2 + (1-h1)*(1-h2)*t_mem. DRAM refresh overhead = (rows * t_refresh) / refresh_interval.`,
      examTip: 'Address lines = log_2(locations). Memorize: 2^10 = 1K, 2^16 = 64K, 2^20 = 1M, 2^30 = 1G, 2^32 = 4G. These powers of 2 appear on every memory problem.',
      importantNote: 'EMAT formula assumes miss penalty includes the full memory access time. Some problems separate it: t_avg = t_cache + (1-h) * t_miss_penalty. Read the problem carefully to determine which model is used.',
    },
    { id: 'mem-planes', title: '4. Programmable Logic Planes: ROM, PLA, PAL, and the LUT',
      content: `## 4.1 Every two-level function is one plane feeding another

A sum-of-products expression has exactly two levels: a set of AND gates
producing product terms, and an OR gate collecting them. Draw that as an array
and the whole family of programmable logic devices falls out of a single
picture — an **AND plane** that manufactures product terms from the inputs and
their complements, and an **OR plane** that sums selected terms into outputs.
The three classical device types differ only in which plane the customer is
allowed to program.

| Device | AND plane | OR plane | Consequence |
|---|---|---|---|
| **ROM** | fixed: a full decoder, all 2^n minterms | programmable | any function of n inputs, but size doubles per input |
| **PLA** | programmable | programmable | terms can be shared between outputs; most flexible |
| **PAL** | programmable | fixed: a set number of terms per output | faster and cheaper, but a hard term limit per output |

## 4.2 A ROM is a truth table you can buy

Because the ROM's AND plane is a complete decoder, every one of the 2^n input
combinations activates its own word line, and the stored word is the output for
that row. In other words a ROM stores the truth table literally, and no
minimisation is required or possible.

Sizing is therefore pure counting. A block implementing four inputs and three
outputs needs

**2^4 words x 3 bits = 16 x 3 = 48 bits**

and that number is unaffected by how simple or complicated the three functions
are. That indifference is the ROM's charm and its curse: it always works, and
it always costs 2^n words.

## 4.3 A PLA shares its product terms

Take two functions of three variables, **F1 = A'B + AB'** (which is A XOR B)
and **F2 = AB' + BC**. Between them they use only three distinct product terms:

| Product term | Feeds F1? | Feeds F2? |
|---|---|---|
| A'B | yes | no |
| **AB'** | **yes** | **yes** |
| BC | no | yes |

The middle row is the point of a PLA. AB' is manufactured once in the AND plane
and connected to both outputs in the OR plane. This programmed pair was checked
here against the truth tables of both functions for all eight input patterns.

Count the programmable connections. Each product term needs a choice for each
of the three inputs in true or complemented form, which is six positions, plus
one position per output in the OR plane, which is two. Three terms therefore
cost 3 x (6 + 2) = **24** programmable positions, against **16 bits** for the
equivalent ROM. For three inputs the ROM wins, and it is worth saying so
plainly rather than pretending otherwise. The comparison inverts as the input
count grows, because the ROM's cost doubles with every added input while the
PLA's cost grows only with the number of product terms the functions actually
use. At sixteen inputs the ROM needs 65,536 words whether the function has four
terms or four thousand.

## 4.4 A PAL trades flexibility for speed

The PAL fixes the OR plane: each output is hard-wired to a fixed group of
product terms, commonly seven or eight. Nothing is shared between outputs, so a
term needed by two functions must be generated twice. In exchange, the fixed
plane is a plain wire instead of a programmable connection, which removes a
level of programmable delay and a lot of silicon.

The design consequence is a hard constraint rather than a cost curve: if a
minimised function needs nine product terms and each output can reach eight,
that function does not fit, and the fix is either a different device or
restructuring the logic to route one term through a second output and back in.

## 4.5 The LUT is the same idea, shrunk

An FPGA's **lookup table** is a small ROM addressed by the logic signals. A
4-input LUT holds

**2^4 = 16 configuration bits**

and can therefore realise **2^16 = 65,536** different functions of its four
inputs — every function of four variables that exists. This is why FPGA
capacity is quoted in LUTs rather than gates, and why the number of *gates* in
a function barely predicts how much of an FPGA it will occupy. What predicts
occupancy is how the function partitions into four-input or six-input pieces.

| Structure | Configuration storage | Functions realisable |
|---|---|---|
| 4-input LUT | 16 bits | 65,536 (all of them) |
| 6-input LUT | 64 bits | 2^64 (all of them) |
| ROM, 4 in / 3 out | 48 bits | any 3 functions of those 4 inputs |

**How the exam asks this.** Two forms dominate. The first is sizing: given the
input and output counts, compute the ROM bit count as 2^inputs x outputs. The
second shows a programmed plane as a grid of dots and asks what the outputs
are; read each row of the AND plane as a product term over the marked
variables, then read each column of the OR plane as the sum of the terms marked
in it.`,
      examTip: 'ROM sizing is 2^(address inputs) times the word width, independent of the logic complexity. PLA cost scales with product terms instead, which is why a ROM is the cheaper answer for very few inputs and the impossible answer for many.',
      importantNote: 'A PAL has a fixed OR plane, so its product terms cannot be shared between outputs and each output has a hard maximum term count. A function that minimises to more terms than that limit simply will not fit, regardless of how many unused outputs the part has.',
    },
    { id: 'mem-expansion', title: '5. Building Bigger Memories, and the Ladder They Sit On',
      content: `## 5.1 Two directions to grow a memory

Catalogue memory parts rarely match the size a system needs, so memories are
assembled from arrays of smaller devices in two independent directions.

**Width expansion** puts chips side by side. Their address and control lines are
tied in parallel, and each chip supplies a different slice of the data word.
Two 16K x 4 devices wired this way behave as one 16K x 8 device.

**Depth expansion** stacks banks. All chips see the same low address bits, and
the high address bits drive a decoder whose outputs are the chip-select lines,
so exactly one bank responds to any address.

Work a full example: build **64K x 8** from **16K x 4** parts.

| Quantity | Calculation | Result |
|---|---|---|
| Chips for width | 8 bits / 4 bits | 2 |
| Banks for depth | 64K / 16K | 4 |
| Total chips | 2 x 4 | **8** |
| Address lines per chip | log2(16,384) | **14** (A13 to A0) |
| System address lines | log2(65,536) | **16** (A15 to A0) |
| Decoder needed | 2 spare high bits | **2-to-4**, driven by A15 and A14 |

So A13 through A0 go to every chip in parallel; A15 and A14 go to a 2-to-4
decoder; each decoder output enables one bank of two chips; and the two chips in
a bank drive data bits 7 to 4 and 3 to 0. The organisation is the answer to
"how many chips" and "how wide is the decoder" in one diagram.

## 5.2 The ladder the whole hierarchy sits on

The reason a memory system needs several technologies rather than one is that
capacity and latency are not independently purchasable. Plot the representative
figures from the hierarchy table in Section 1.4 on logarithmic axes and the
trade appears as a line rather than a set of anecdotes.

![Access latency against capacity for seven levels of the memory hierarchy, from the register file to a hard disk, on logarithmic axes. A least-squares fit through the seven points has a slope of about 0.64, meaning each decade of extra capacity costs roughly two thirds of a decade of extra latency.](/courses/fe-ee/figures/dig-memory-ladder.svg)

The fitted slope, computed in the figure's own code rather than estimated by
eye, is about **0.64**: every tenfold increase in capacity has historically cost
roughly two-thirds of a tenfold increase in access time. Across the whole
ladder that is about ten decades of capacity bought with about seven decades of
latency. Three features of the plot are worth reading carefully:

- The cache levels sit close to the fitted line. Within the on-chip world the
  trade is smooth, which is why adding a level is usually worth it.
- **DRAM sits below the line** and the disk sits far above it. Main memory is a
  better bargain than the trend predicts; rotating storage is far worse,
  because its latency is mechanical and no amount of density improves it.
- The vertical jump from DRAM to SSD to disk is where the five-order-of-magnitude
  cliff lives. A cache miss costs tens of nanoseconds; a page fault costs
  milliseconds. That is the same ratio as a second against a fortnight.

## 5.3 Why a hierarchy works at all

None of this would help if programs touched addresses at random, because a
small fast level would then hold the wrong data essentially always. Programs do
not behave that way. **Temporal locality** means an address touched now is
likely to be touched again soon — loop counters, stack frames, hot data
structures. **Spatial locality** means an address near one just touched is
likely to be needed shortly — sequential instructions, array traversals, struct
fields. The first justifies keeping recent data; the second justifies moving
data in blocks rather than single bytes, which is why a cache line is 32 or 64
bytes and a disk transfer is a whole page.

| Locality | Statement | Hardware that exploits it |
|---|---|---|
| Temporal | recently used will be used again | keeping the block; LRU replacement |
| Spatial | neighbours will be used next | multi-byte blocks; prefetching |

**How the exam asks this.** Expansion problems are pure division: chips for
width, banks for depth, multiply for the total, and the decoder width is the
count of address bits left over after the per-chip lines are assigned. Ladder
questions ask you to identify which technology fits a stated speed or capacity,
or to compute an effective access time from a hit rate — the formula from
Section 2.1 applied to whichever pair of levels the question names.`,
      examTip: 'For memory expansion, compute the two factors separately: data-bus width divided by chip width gives chips per bank, and total depth divided by chip depth gives the number of banks. Multiply for the chip count; the decoder needs log2(banks) inputs.',
      importantNote: 'Chip-select decoding uses the HIGH address bits and the chip\'s own address pins take the LOW bits. Wiring it the other way round scatters consecutive addresses across banks, which still stores data correctly but destroys the spatial locality every cache and prefetcher depends on.',
    },
  ],
  keyTakeaways: [
    'ROM nonvolatile (PROM, EPROM, Flash). RAM volatile (SRAM fast, DRAM dense/refresh).',
    'Capacity = 2^(address_bits) locations.',
    'Hierarchy: registers > cache > RAM > SSD > HDD (speed vs. capacity).',
    'Cache: t_avg = h*t_cache + (1-h)*t_memory; hit rate h is key.',
    'Direct-mapped (fast) vs. fully associative (flexible) vs. N-way (balanced).',
    'FPGA: reconfigurable, low dev cost; ASIC: best performance, high dev cost.',
  ],
},

  /* ══════════════════════════════════════════════════════════════════
   * TOPIC 16 — COMPUTER SYSTEMS  (4 curriculum IDs)  ·  3–5 %
   * ══════════════════════════════════════════════════════════════════ */

};
