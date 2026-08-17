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

| Type | Characteristic equation | Key Property |
|---|---|---|
| **SR** | $Q^{+} = S + \\overline{R}\\,Q$, legal only while $SR = 0$ | S=R=1 **forbidden** |
| **D** | **$Q^{+} = D$** | Captures input on edge |
| **JK** | $Q^{+} = J\\,\\overline{Q} + \\overline{K}\\,Q$ | J=K=1 toggles; universal |
| **T** | $Q^{+} = T \\oplus Q$ | T=1 toggles, T=0 holds |

Section 7 derives all four of these from the behaviour each device is specified
to have, and builds the excitation tables by inverting them.

## 1.2 Timing Constraints

| Parameter | Definition |
|---|---|
| **Setup time** $t_{\\text{su}}$ | Data stable BEFORE clock edge |
| **Hold time** $t_{\\text{h}}$ | Data stable AFTER clock edge |
| **Clock-to-Q** $t_{\\text{cq}}$ | Delay from edge to output |

Violations cause **metastability** (unpredictable state).

**Max frequency**:

$$f_{\\max} = \\frac{1}{t_{\\text{cq}} + t_{\\text{comb}} + t_{\\text{su}}}$$`,
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

| Clock | Q3 | Q2 | Q1 | Q0 | Feedback $Q_3 \\oplus Q_2$ |
|---|---|---|---|---|---|
| 0 | 1 | 0 | 0 | 0 | $1 \\oplus 0 = 1$ |
| 1 | 1 | 1 | 0 | 0 | $1 \\oplus 1 = 0$ |
| 2 | 0 | 1 | 1 | 0 | $0 \\oplus 1 = 1$ |
| 3 | 1 | 0 | 1 | 1 | $1 \\oplus 0 = 1$ |
| 4 | 1 | 1 | 0 | 1 | $1 \\oplus 1 = 0$ |

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

$$t_{\\text{cq}} + t_{\\text{comb,max}} + t_{\\text{su}} \\le T$$

The **hold constraint** says the newly launched data must not race ahead and
overwrite the value the capture flip-flop is still sampling:

$$t_{\\text{cq}} + t_{\\text{comb,min}} \\ge t_{\\text{h}} + t_{\\text{skew}}$$

The clock period T appears in the first inequality and not in the second. That
single structural fact carries a consequence worth committing to memory: a
setup failure can always be fixed by slowing the clock down, and a hold failure
never can. Hold violations are fixed by adding delay to the data path or by
repairing the clock distribution, and a chip that fails hold is a chip that
does not work at any speed.

## 4.2 A worked path

Take t_cq = 2 ns, worst-case combinational delay 5 ns, and t_su = 1 ns. The
path needs

$$T_{\\min} = 2 + 5 + 1 = 8\\ \\text{ns}, \\qquad f_{\\max} = \\frac{1}{8\\ \\text{ns}} = 125\\ \\text{MHz}$$

Run that same logic at 100 MHz, where T = 10 ns, and the surplus is the
**slack**:

$$\\text{slack} = T - (t_{\\text{cq}} + t_{\\text{comb}} + t_{\\text{su}}) = 10 - 8 = 2\\ \\text{ns}$$

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

$$\\text{margin} = (t_{\\text{cq}} + t_{\\text{comb,min}}) - (t_{\\text{h}} + t_{\\text{skew}}) = 3 - 1.3 = 1.7\\ \\text{ns}$$

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
wide and a loop delay of 15 ns, the loop is traversed

$$t_{\\text{high}} / t_{\\text{loop}} = 100 / 15 = 6.67$$

times, so six complete toggles fit inside one pulse and the seventh does not.
The final state therefore depends on whether that count is even or
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

$$t_{\\text{settle}} = 4 \\times 10 = 40\\ \\text{ns}, \\qquad f_{\\max} = 25\\ \\text{MHz}$$

and during those 40 ns the output bus shows a succession of wrong intermediate
values, which is why decoding a ripple counter's state combinationally produces
decoding spikes. A synchronous counter clocks every stage together, so its
period is one flip-flop delay plus the setup time of the next-state logic:

$$T = 10 + 5 = 15\\ \\text{ns}, \\qquad f_{\\max} = 66.7\\ \\text{MHz}$$

which is about 2.7 times the ripple counter's rate. The width does not matter
here, because adding stages adds gate levels to the next-state logic rather
than links to a delay chain.

| Counter | Settling model | 4-bit rate | Intermediate states? |
|---|---|---|---|
| Ripple (asynchronous) | $n \\cdot t_{\\text{pd}}$ | 25 MHz | yes, all wrong values |
| **Synchronous** | $t_{\\text{pd}} + t_{\\text{su}}$ | **66.7 MHz** | no |

**How the exam asks this.** Timing-diagram questions give per-gate or per-stage
delays and ask when an output changes; count the levels a signal must traverse
and multiply. Hazard questions usually give a two-level expression and ask
which redundant term removes the glitch — find the two adjacent, non-overlapping
groups on the map and name the group that bridges them.`,
      examTip: 'A hazard is a delay artefact, not a logic error: the truth table is already correct. The fix is a redundant consensus term, which means the hazard-free circuit deliberately uses more gates than the minimal one.',
      importantNote: 'Race-around belongs to level-triggered JK latches, not to edge-triggered JK flip-flops. If a question mentions master-slave construction or a narrow clock pulse requirement, it is testing this distinction.',
    },
    { id: 'seqlog-latch', title: '6. The Cross-Coupled Pair: How Two Gates Come to Remember',
      content: `## 6.1 A circuit with no yesterday, and what has to change

Every network in the combinational chapter answers one question: given these
input levels, right now, what should the outputs be? Such a circuit has no
yesterday. Draw its truth table and you have described it completely, because
nothing inside it survives a change of input.

Storage requires the opposite property. A stored bit must persist while the
thing that wrote it has gone away, which means the circuit must have at least
one state that inputs do not determine. There is exactly one structural trick
that produces this, and every latch, flip-flop and static memory cell in
existence is a variation on it: route an output back to an input so the circuit
helps to hold itself.

Take two inverters and connect each one's output to the other's input. Call the
node driving the first inverter Qbar and the node it drives Q. Nothing else is
attached. If Qbar sits low, the first inverter drives Q high; a high Q drives
the second inverter's output low, which is Qbar, which is where we started. The
arrangement is consistent with itself. It is equally consistent with Qbar high
and Q low. Two self-consistent conditions, no external input distinguishing
them: the pair remembers which one it was put into.

## 6.2 Why exactly two, and why the third is not usable

The consistency argument above finds two states, but a circuit's behaviour is
continuous, and continuity guarantees a third solution sitting between them.
Model each inverter with a smooth, monotonically falling transfer curve on a
supply $V_{DD}$:

$$V_{\\text{out}} = \\frac{V_{DD}}{2}\\left[1 - \\tanh\\!\\left(a\\left(V_{\\text{in}} - \\frac{V_{DD}}{2}\\right)\\right)\\right]$$

The gain of one stage at the midpoint follows by differentiating:

$$\\left.\\frac{dV_{\\text{out}}}{dV_{\\text{in}}}\\right|_{V_{\\text{in}} = V_{DD}/2} = -\\frac{a\\,V_{DD}}{2}$$

With $V_{DD} = 1.8$ V and $a = 3.0$ this gives $-2.7$ per stage, so going once
round the loop multiplies a disturbance by

$$A_{\\text{loop}} = A_1 A_2 = (-2.7)(-2.7) = 7.29$$

A fixed point of the loop is any voltage $v$ satisfying $f(f(v)) = v$, where
$f$ is the inverter curve. Solving that numerically on this model returns three
values: 0.009 V, 0.900 V and 1.791 V. The outer two have loop gain 0.003, so a
nudge away from either one shrinks on every pass and the circuit returns. The
middle one has loop gain 7.29, so a nudge grows by a factor of seven per pass
and the circuit leaves. That is the entire content of the word **bistable**:
three solutions exist, and only the two with loop gain below unity can be
occupied by a real circuit for any length of time.

![The loop transfer function of two cross-coupled inverters, plotted against the input voltage together with the forty-five degree line on which nothing changes. The curve crosses the line three times, at nine millivolts, at nine hundred millivolts and at one point seven nine volts. A staircase construction started fifty millivolts above the middle crossing walks away from it and lands on the upper crossing in five passes round the loop.](/courses/fe-ee/figures/dig3-latch-bistable.svg)

The staircase in the figure is the mechanism drawn out. Start the loop 50 mV
above the middle crossing, apply the loop function repeatedly, and the sequence
runs away from the unstable point and converges on the stored 1 in five passes.
Start 50 mV below it and the same construction lands on the stored 0. The
middle point is not a state the circuit refuses to enter; it is a state the
circuit cannot stay in. Section 9 gives that departure a time constant and turns
it into a failure rate.

## 6.3 Adding inputs: the NOR latch, settled rather than asserted

A pair of inverters remembers but cannot be written. Replace each inverter with
a two-input NOR gate and the spare input becomes a write port:

$$Q = \\overline{R + \\overline{Q}}, \\qquad \\overline{Q} = \\overline{S + Q}$$

A NOR gate with one input at 0 behaves as an inverter of the other, so with
$S = R = 0$ this is exactly the pair from Section 6.1 and the latch holds. A 1
on either input forces that gate's output to 0 regardless of the feedback, which
breaks the loop and writes the cell.

The table below was not written down from the symbol; it was produced by
starting the loop in a condition and iterating the two equations until they
stopped changing, for every input combination and every starting condition.

| S | R | Started at Q = 0 | Started at Q = 1 | Settles to |
|---|---|---|---|---|
| 0 | 0 | stays Q = 0 | stays Q = 1 | whatever it held: **hold** |
| 0 | 1 | Q = 0 | Q = 0 | **reset** |
| 1 | 0 | Q = 1 | Q = 1 | **set** |
| 1 | 1 | Q = 0 and Qbar = 0 | Q = 0 and Qbar = 0 | both outputs low |

Two facts in that table are worth more than the mnemonic usually offered for
them. First, the hold row is the only row whose settled value depends on where
the iteration started, and that dependence is the memory. Second, the last row
does settle: it is perfectly stable while both inputs are held high. What it
does not do is keep Q and Qbar complementary, and every downstream circuit that
uses the two outputs as a signal and its complement is now being lied to.

The genuine hazard arrives on release. Iterating the loop from $Q = \\overline{Q} = 0$
with both inputs returned to 0 does not converge at all — the pair oscillates,
because each gate keeps trying to invert the other from a symmetric starting
point. In silicon the symmetry is broken by whichever gate happens to be a few
picoseconds faster, so the final state is decided by manufacturing tolerance.
That is why $S = R = 1$ is called forbidden rather than merely useless.

Restricted to the six rows where $SR = 0$, the settled behaviour is captured
exactly by

$$Q^{+} = S + \\overline{R}\\,Q \\qquad (SR = 0)$$

and this was confirmed by comparing the expression against the settled loop on
all six of those rows, not by reading it off the table by eye.

## 6.4 The NAND version, and why its inputs are bars

Build the same structure from NAND gates instead and the algebra dualises:

$$Q = \\overline{\\overline{S} \\cdot \\overline{Q}}, \\qquad \\overline{Q} = \\overline{\\overline{R} \\cdot Q}$$

A NAND with one input at 1 inverts the other, so now the **idle** condition is
both inputs high and the **active** condition is a low. The inputs are therefore
drawn with bars over their names and the disallowed combination moves to both
inputs low. Nothing conceptual changes; only the polarity does. The reason it
matters on an exam is that a NAND latch drawn without input bubbles, driven from
two pushbuttons to ground, is the standard switch-debounce circuit, and reading
its idle state as "both inputs asserted" inverts every answer that follows.

### Worked example 6.1 — settling a NOR latch by hand

**Given.** A NOR latch currently holding Q = 1. The input sequence applied is
(S, R) = (0, 0), then (0, 1), then (0, 0), then (1, 0), then (0, 0).

**Work.** Apply $Q^{+} = S + \\overline{R}\\,Q$ at each step, carrying the
previous Q forward:

| Step | S | R | Previous Q | $S + \\overline{R}\\,Q$ | New Q |
|---|---|---|---|---|---|
| 1 | 0 | 0 | 1 | $0 + 1 \\cdot 1$ | 1 |
| 2 | 0 | 1 | 1 | $0 + 0 \\cdot 1$ | 0 |
| 3 | 0 | 0 | 0 | $0 + 1 \\cdot 0$ | 0 |
| 4 | 1 | 0 | 0 | $1 + 1 \\cdot 0$ | 1 |
| 5 | 0 | 0 | 1 | $0 + 1 \\cdot 1$ | 1 |

**Answer.** The output sequence is 1, 0, 0, 1, 1.

**The trap.** Candidates read the hold rows as "output is 0 because both inputs
are 0". A hold row has no value of its own; it copies the previous row. Answer
choices for this question almost always include the sequence 1, 0, 0, 1, 0,
which is what you get by treating the last hold as a reset.

### Worked example 6.2 — the gated latch and the width of its window

**Given.** A D latch built by gating a NOR latch with an enable, so that
$S = E \\cdot D$ and $R = E \\cdot \\overline{D}$. The enable is high for 3.0 ns.
The data line changes at 0.8 ns and again at 2.1 ns after the enable rises.

**Work.** Substituting the gating into the latch equation gives the
characteristic equation of a gated D latch:

$$Q^{+} = E\\,D + \\overline{E}\\,Q$$

With $E = 0$ this reduces to $Q^{+} = Q$, which is the hold. With $E = 1$ it
reduces to $Q^{+} = D$, and crucially this holds continuously, not at an
instant. Both data changes therefore occur while $E = 1$, so both reach the
output. The value captured when the enable falls is the value of D at 3.0 ns,
which is the one established by the second change.

**Answer.** The latch output follows D twice during the window and finally holds
the value D carried at the closing edge, not the value it carried at the
opening edge.

![One clock, one data line, and two outputs. The data line changes twice while the clock is high, and the transparent latch reproduces both changes at its output, while the edge-triggered flip-flop below it ignores both and changes only at the two rising edges of the clock.](/courses/fe-ee/figures/dig3-latch-transparency.svg)

**The trap.** The phrase "the latch stores D" invites the reading that it stores
the value present when the enable **rose**. It does not. A level-sensitive
device is a window, and everything that passes through the window arrives at the
far side. The flip-flop trace in the figure is the contrast: it changes only at
the two rising edges, and neither data change is ever visible on it.

## 6.5 Why this defect is fatal in a feedback loop

Transparency would be a curiosity if latches sat in isolation. They do not. The
standard use of a storage element is in a loop: state feeds combinational logic,
which feeds the state element again. With a transparent latch in that loop, the
new value computed by the logic arrives back at the latch input while the window
is still open, is passed through, is recomputed, and comes round again. One
enable pulse can advance the machine an unpredictable number of steps, decided
by how many circuits of the loop fit inside the pulse. Section 5 quantified this
for a JK latch and found six toggles in a 100 ns pulse; the same arithmetic
applies to any level-sensitive element in a loop.

The cure is to make the storage window infinitesimally short. Two latches in
series with opposite enable polarities achieve it — the master samples while the
clock is high and is isolated while it is low, and the slave does the reverse,
so a value crosses both exactly once per clock cycle. That is the master-slave
flip-flop, and the modern edge-triggered flip-flop delivers the same guarantee
with a different internal arrangement. Everything from Section 7 onwards assumes
edge triggering, which is why the timing model reduces to two numbers per
device: a delay after the edge and a window around it.`,
      examTip: 'A latch is level-sensitive and a flip-flop is edge-sensitive. If a question shows data changing while a clock is high and asks what the output does, the answer for a latch is "it follows" and for a flip-flop is "nothing until the next edge". Reading the device type off the symbol is the whole question.',
      importantNote: 'S = R = 1 on a NOR latch is stable while it is applied; it drives both outputs to 0, so Q and Qbar stop being complements. The unpredictability appears when both inputs are released together, because the symmetric starting point leaves the winner to gate mismatch rather than to logic.',
    },
    { id: 'seqlog-charac', title: '7. Characteristic Equations Derived, and Excitation Tables Built From Them',
      content: `## 7.1 Two tables that look alike and answer opposite questions

A flip-flop can be described from either end. The **characteristic equation**
answers a forward question — given the present state and the inputs, what will
the next state be — and it is what you use to analyse a circuit somebody else
built. The **excitation table** answers the reverse question — given the present
state and the state you want next, what must the inputs be — and it is what you
use to build one. Confusing them is the single most common source of wrong
counter designs, so it is worth deriving both rather than memorising either.

Every characteristic equation in this section was checked by enumerating all
combinations of inputs and present state and comparing the expression against
the behaviour the device is specified to have. Every excitation table was then
produced by inverting the corresponding characteristic equation
programmatically, which is why the don't-care entries below are derived rather
than asserted.

## 7.2 The four characteristic equations, each derived

**The D flip-flop.** Its specification is one line: the output after the edge is
the input before it. There is nothing to minimise.

$$Q^{+} = D$$

**The T flip-flop.** Its specification is that $T = 1$ inverts the state and
$T = 0$ preserves it. Writing the two rows that produce a 1 gives
$T\\overline{Q}$ and $\\overline{T}Q$, whose sum is the exclusive-OR:

$$Q^{+} = T\\,\\overline{Q} + \\overline{T}\\,Q = T \\oplus Q$$

**The JK flip-flop.** Its specification has four rows: hold, set, reset, toggle.
Expanding each row into the minterms of $(J, K, Q)$ that produce a 1 and
minimising gives

$$Q^{+} = J\\,\\overline{Q} + \\overline{K}\\,Q$$

Read the two terms as instructions rather than as algebra. The first says J can
only ever push the state up, and only from 0. The second says K can only ever
pull it down, and only from 1. That reading makes the toggle row obvious: with
both asserted, whichever direction the state is currently in, the other input is
the one that applies.

**The SR flip-flop.** With $SR = 0$ enforced, the same construction gives

$$Q^{+} = S + \\overline{R}\\,Q$$

which is the equation Section 6.3 obtained by settling the gate loop, now
recovered from the device specification instead of from the gates. Two
independent routes to the same expression is the strongest evidence available
that it is right.

| Device | Characteristic equation | Inputs | Restriction |
|---|---|---|---|
| D | $Q^{+} = D$ | 1 | none |
| T | $Q^{+} = T \\oplus Q$ | 1 | none |
| SR | $Q^{+} = S + \\overline{R}\\,Q$ | 2 | $SR = 0$ |
| JK | $Q^{+} = J\\,\\overline{Q} + \\overline{K}\\,Q$ | 2 | none |

![Four flip-flop outputs on a common clock, each driven by its own eight-cycle stimulus. The D output copies its input one cycle late, the T output inverts only where its input is one, and the JK and SR rows were given stimuli chosen so that both produce the same sequence, showing that the devices differ in their inputs rather than in what they can store.](/courses/fe-ee/figures/dig3-ff-waveforms.svg)

The figure applies each equation at every rising edge of one clock, with each
device given its own stimulus. The JK and SR stimuli were deliberately chosen to
produce identical output sequences, which makes the point that the four devices
differ in how you address them, not in what they can hold.

## 7.3 Excitation tables, obtained by inversion

Now run each equation backwards. For every pair of present state and desired
next state, ask which input vectors satisfy the characteristic equation. Where
more than one vector works, the unconstrained input is a don't-care.

| Q to Q+ | D | T | J, K | S, R |
|---|---|---|---|---|
| 0 to 0 | 0 | 0 | 0, X | 0, X |
| 0 to 1 | 1 | 1 | 1, X | 1, 0 |
| 1 to 0 | 0 | 1 | X, 1 | 0, 1 |
| 1 to 1 | 1 | 0 | X, 0 | X, 0 |

Three structural facts fall straight out of this table and are worth carrying
into every design problem.

The **D column is the next-state column**. There is no conversion step at all,
which is why synthesis tools target D flip-flops and why almost every modern
design has one D flip-flop per state bit and nothing else.

The **JK table carries a don't-care in every row**. Half of each map is free,
and free cells are the raw material of minimisation, so JK excitation equations
are typically simpler than the D equations for the same machine. That advantage
is paid for with two input wires per flip-flop instead of one.

The **SR table has don't-cares in only two of its four rows**. The set and reset
rows are fully determined, because SR is the only one of the four whose input
space is restricted. This is the concrete cost of the forbidden combination.

## 7.4 Converting one device into another

Any of these devices can be made to behave as any other by putting combinational
logic in front of it. The recipe is always the same: write the target device's
characteristic equation, then solve for the host device's inputs. Each of the
six conversions below was verified by enumeration over every combination of
inputs and present state.

$$\\text{JK behaviour on a D flip-flop:} \\quad D = J\\,\\overline{Q} + \\overline{K}\\,Q$$

$$\\text{T behaviour on a D flip-flop:} \\quad D = T \\oplus Q$$

$$\\text{D behaviour on a JK flip-flop:} \\quad J = D, \\quad K = \\overline{D}$$

$$\\text{T behaviour on a JK flip-flop:} \\quad J = K = T$$

$$\\text{SR inputs from JK inputs:} \\quad S = J\\,\\overline{Q}, \\quad R = K\\,Q$$

$$\\text{D behaviour on a T flip-flop:} \\quad T = D \\oplus Q$$

The first of these is worth staring at: converting a JK into a D costs nothing
but writing the JK characteristic equation into the D input, because the D input
**is** the next state. Every conversion into a D flip-flop is that easy, and no
conversion out of one is.

The last one contains the standard practical warning. Making a T flip-flop
behave as a D requires the present state as an input to the logic, so the
conversion is not a wire; it is an XOR gate in the feedback path, and that gate
sits inside the setup path of Section 8.

### Worked example 7.1 — build a T flip-flop from a JK, then check it

**Given.** A JK flip-flop and a requirement for toggle-on-1 behaviour.

**Work.** The target equation is $Q^{+} = T \\oplus Q = T\\overline{Q} + \\overline{T}Q$.
The host equation is $Q^{+} = J\\overline{Q} + \\overline{K}Q$. Matching the two
term by term gives $J = T$ from the first term and $\\overline{K} = \\overline{T}$,
hence $K = T$, from the second.

**Answer.** Tie J and K together and call the common wire T.

**Check.** Substituting $J = K = T$ into the host equation returns
$T\\overline{Q} + \\overline{T}Q$, which is the target on all four combinations of
$T$ and $Q$. This is the standard construction that makes a JK flip-flop into a
counter stage.

**The trap.** Distractors offer $J = T$ with $K = \\overline{T}$, which is the
D-flip-flop conversion. Feed that circuit $T = 0$ and it loads a 0 instead of
holding, so a counter built from it will not count.

### Worked example 7.2 — analyse a circuit somebody else drew

**Given.** A JK flip-flop wired with $J = \\overline{Q}$ and $K = Q$, clocked
continuously. Initial state Q = 0.

**Work.** Substitute the wiring into the characteristic equation:

$$Q^{+} = J\\,\\overline{Q} + \\overline{K}\\,Q = \\overline{Q}\\cdot\\overline{Q} + \\overline{Q}\\cdot Q = \\overline{Q}$$

using $\\overline{Q}\\cdot\\overline{Q} = \\overline{Q}$ and $\\overline{Q}\\cdot Q = 0$.

**Answer.** $Q^{+} = \\overline{Q}$, so the flip-flop toggles on every edge and
the output is a square wave at half the clock frequency. Starting from 0 the
sequence is 0, 1, 0, 1 and so on.

**The trap.** Reading $J = \\overline{Q}$, $K = Q$ as "set when the state is 0 and
reset when it is 1" suggests the state is being driven back to where it already
is. It is the opposite: J acts only from state 0, and $J = \\overline{Q}$ equals 1
exactly there.

### Worked example 7.3 — trace an SR flip-flop and spot the illegal input

**Given.** An edge-triggered SR flip-flop starting at Q = 0, with
(S, R) applied on successive edges as (1, 0), (0, 0), (0, 1), (1, 1), (1, 0).

**Work.** Apply $Q^{+} = S + \\overline{R}Q$ where it is legal:

| Edge | S | R | Q before | Result |
|---|---|---|---|---|
| 1 | 1 | 0 | 0 | set, Q = 1 |
| 2 | 0 | 0 | 1 | hold, Q = 1 |
| 3 | 0 | 1 | 1 | reset, Q = 0 |
| 4 | 1 | 1 | 0 | **illegal**, no defined answer |
| 5 | 1 | 0 | undefined | set, Q = 1 |

**Answer.** The correct response is that edge 4 has no defined next state, so
the sequence cannot be completed as stated. Edge 5 recovers, because a set
overrides whatever the previous condition left behind.

**The trap.** Every wrong answer to this question comes from applying
$Q^{+} = S + \\overline{R}Q$ at edge 4 anyway, which returns
$1 + 0 \\cdot 0 = 1$ and looks perfectly reasonable. The equation carries the
side condition $SR = 0$, and an equation applied outside its stated domain
produces a confident wrong number rather than an error message.`,
      examTip: 'Analysis uses the characteristic equation; design uses the excitation table. If the question hands you a wired-up circuit and asks for the output sequence, substitute the wiring into the characteristic equation first — the algebra usually collapses to something trivial such as Q+ = Qbar.',
      importantNote: 'The JK excitation table has a don\'t-care in all four rows and the SR table in only two. That asymmetry, not the forbidden input by itself, is the reason JK is preferred for hand design: half of every Karnaugh map is free.',
    },
    { id: 'seqlog-closure', title: '8. Setup, Hold and Skew Quantified Across Frequency',
      content: `## 8.1 The two inequalities, written with skew in both

Section 4 introduced the setup and hold constraints and the fact that only one
of them contains the clock period. Adding clock skew to both makes the
asymmetry sharper and gives the numbers a design can actually be signed off
against. Let $t_{\\text{skew}}$ be the arrival-time difference between the
capture clock and the launch clock, positive when the capture edge arrives late.

$$T \\ge t_{\\text{cq}} + t_{\\text{comb,max}} + t_{\\text{su}} - t_{\\text{skew}}$$

$$t_{\\text{cq}} + t_{\\text{comb,min}} \\ge t_{\\text{h}} + t_{\\text{skew}}$$

Skew enters the two with opposite signs. A late capture edge relaxes setup — the
data has longer to settle — and tightens hold, because the capture flip-flop is
still sampling when the next launched value arrives. Deliberately delaying a
capture clock to rescue a slow path is a real technique called useful skew, and
the inequalities above say exactly what it costs: every picosecond of setup
relief is a picosecond of hold margin spent.

For a signed-off number the worst case of the skew must be used in each
constraint, which means assuming an early capture edge for setup and a late one
for hold. That is the convention used throughout this section.

## 8.2 One path, carried through both constraints

Take a register-to-register path with these parameters, which are typical of a
mature CMOS process:

| Parameter | Symbol | Value |
|---|---|---|
| Clock-to-output | $t_{\\text{cq}}$ | 0.35 ns |
| Slowest combinational route | $t_{\\text{comb,max}}$ | 4.20 ns |
| Fastest combinational route | $t_{\\text{comb,min}}$ | 0.40 ns |
| Setup requirement | $t_{\\text{su}}$ | 0.15 ns |
| Hold requirement | $t_{\\text{h}}$ | 0.10 ns |
| Worst-case skew | $t_{\\text{skew}}$ | 0.12 ns |

The setup constraint fixes the shortest usable period:

$$T_{\\min} = 0.35 + 4.20 + 0.15 + 0.12 = 4.82\\ \\text{ns}$$

$$f_{\\max} = \\frac{1000}{4.82} = 207.47\\ \\text{MHz}$$

The hold constraint produces a margin with no period in it at all:

$$\\text{hold margin} = 0.35 + 0.40 - 0.10 - 0.12 = 0.53\\ \\text{ns}$$

That margin is positive, so this path is safe at every frequency, including
zero. Read those two results together and the entire discipline of timing
closure is visible: one number is a speed limit and the other is a yes or no.

## 8.3 Slack against frequency, plotted and tabulated

Slack is available time minus required time. For setup it is $T - T_{\\min}$, so
it falls as the frequency rises and crosses zero at $f_{\\max}$. For hold it is
the fixed 0.53 ns computed above.

| Clock | Period | Setup slack | Hold margin | Verdict |
|---|---|---|---|---|
| 100 MHz | 10.000 ns | $10 - 4.82 = 5.18$ ns | 0.53 ns | comfortable |
| 150 MHz | 6.667 ns | +1.85 ns | 0.53 ns | comfortable |
| 200 MHz | 5.000 ns | $5 - 4.82 = 0.18$ ns | 0.53 ns | marginal |
| 207.47 MHz | 4.820 ns | 0 ns | 0.53 ns | exactly at the limit |
| 250 MHz | 4.000 ns | negative, 0.82 ns short | 0.53 ns | setup fails |
| 300 MHz | 3.333 ns | negative, 1.49 ns short | 0.53 ns | setup fails |

![Setup slack and hold margin plotted against clock frequency for one register to register path. The setup slack falls as a reciprocal of frequency and crosses zero at two hundred and seven point four seven megahertz, while the hold margin is a horizontal line at zero point five three nanoseconds that the frequency axis does not touch.](/courses/fe-ee/figures/dig3-slack-vs-freq.svg)

The picture makes the argument unarguable. One curve slopes and one does not.
Every remedy that involves the clock generator moves the sloping one and leaves
the flat one exactly where it is.

## 8.4 Hold failures, and why no clock setting repairs them

Hold problems concentrate in paths with almost no logic, because
$t_{\\text{comb,min}}$ is what defends against them. A directly cascaded pair of
flip-flops — the building block of every shift register and every scan chain —
has $t_{\\text{comb,min}} = 0$ and survives on clock-to-output time alone.

Take a fast library cell in a badly balanced clock tree:

| Parameter | Value |
|---|---|
| $t_{\\text{cq}}$ | 0.20 ns |
| $t_{\\text{comb,min}}$ | 0.00 ns |
| $t_{\\text{h}}$ | 0.35 ns |
| $t_{\\text{skew}}$ | 0.10 ns |

The margin is $0.20 + 0.00 - 0.35 - 0.10$, which is negative by 0.25 ns. The
path fails at 500 MHz, at 50 MHz and at 5 MHz identically, because the period
never entered the calculation. There are exactly three repairs, and none of them
is a clock-frequency change:

- **lengthen the data path** by inserting buffers, which must add at least
  0.25 ns of delay to bring the margin to zero and rather more to leave a margin
- **repair the clock distribution** so the skew stops working against the path
- **use a slower launch cell**, raising $t_{\\text{cq}}$

The first is what an automated tool does by the thousand, and it is the reason a
placed-and-routed design contains buffers that compute nothing.

## 8.5 Pipelining: the one remedy that buys frequency

If a setup path is too slow, the clock can be slowed or the path can be
shortened. Cutting a long combinational path in half with an extra register
stage does the latter, and the arithmetic is worth doing once.

Take a path with $t_{\\text{cq}} = 0.9$ ns, 6.4 ns of logic and
$t_{\\text{su}} = 0.3$ ns:

$$T_{\\min} = 0.9 + 6.4 + 0.3 = 7.6\\ \\text{ns}, \\qquad f_{\\max} = \\frac{1000}{7.6} = 131.58\\ \\text{MHz}$$

Split the logic into two balanced halves of 3.2 ns each, separated by a
register:

$$T_{\\min} = 0.9 + 3.2 + 0.3 = 4.4\\ \\text{ns}, \\qquad f_{\\max} = \\frac{1000}{4.4} = 227.27\\ \\text{MHz}$$

The speed-up is 1.73, not 2, and the shortfall is the whole lesson. The fixed
overhead $t_{\\text{cq}} + t_{\\text{su}} = 1.2$ ns is paid once per stage, so it
occupies a larger fraction of the period as the stages get shorter. Pipelining
has diminishing returns that are entirely predictable from those two numbers,
and it also adds a cycle of latency for every stage inserted, which is a cost
that never appears in the frequency figure.

### Worked example 8.1 — maximum frequency and slack together

**Given.** $t_{\\text{cq}} = 1.2$ ns, worst-case logic 7.3 ns,
$t_{\\text{su}} = 0.5$ ns, skew negligible. The design is to run at 125 MHz.

**Work.**

$$T_{\\min} = 1.2 + 7.3 + 0.5 = 9.0\\ \\text{ns}, \\qquad f_{\\max} = \\frac{1000}{9.0} = 111.11\\ \\text{MHz}$$

At 125 MHz the period is 8.0 ns, so the slack is $8.0 - 9.0$, which is negative
by 1.0 ns.

**Answer.** The path closes only up to 111.11 MHz. At the required 125 MHz it is
1.0 ns short, so the design does not work as drawn.

**The trap.** A common distractor computes 125 MHz as achievable by omitting
$t_{\\text{su}}$ from the sum, which gives 8.5 ns and 117.6 MHz — still short,
but for the wrong reason — or by omitting $t_{\\text{cq}}$, which gives 7.8 ns
and 128.2 MHz and produces a confident, wrong "yes".

### Worked example 8.2 — a hold check, and the buffer it demands

**Given.** $t_{\\text{cq}} = 1.2$ ns, fastest logic 0.6 ns, $t_{\\text{h}} = 0.9$ ns,
skew 0.4 ns against the path.

**Work.**

$$\\text{hold margin} = 1.2 + 0.6 - 0.9 - 0.4 = 0.5\\ \\text{ns}$$

**Answer.** Positive, so hold is satisfied with 0.5 ns to spare, and it is
satisfied at every clock frequency.

**Follow-on.** If the same path were re-implemented with a faster cell whose
$t_{\\text{cq}}$ fell to 0.5 ns and no logic at all, the margin would become
$0.5 - 1.3$, negative by 0.8 ns, and at least 0.8 ns of buffering would have to
go back into the data path.

**The trap.** Skew is added on the requirement side of a hold check and
subtracted on the requirement side of a setup check. Getting the sign wrong here
turns a 0.5 ns pass into a 1.3 ns pass and hides a real failure.

### Worked example 8.3 — where to spend an engineering week

**Given.** A block that fails setup by 0.9 ns at its target frequency. Two
proposals: retime the logic to shorten the critical path by 1.1 ns, or add a
pipeline stage that splits the path into halves of 2.6 ns and 2.5 ns. Assume
$t_{\\text{cq}} = 0.4$ ns and $t_{\\text{su}} = 0.2$ ns, and that the current
worst path is 5.1 ns of logic.

**Work.** Present requirement: $0.4 + 5.1 + 0.2 = 5.7$ ns. Retiming to 4.0 ns of
logic gives $0.4 + 4.0 + 0.2 = 4.6$ ns. Pipelining to a 2.6 ns worst half gives
$0.4 + 2.6 + 0.2 = 3.2$ ns.

**Answer.** Retiming recovers 1.1 ns and pipelining recovers 2.5 ns, so
pipelining wins on frequency by a wide margin. Retiming wins on everything else:
it adds no latency, no registers and no verification of a new pipeline
boundary. Since the shortfall is only 0.9 ns, retiming is sufficient and is the
correct answer.

**The trap.** The largest frequency number is not automatically the right
engineering choice. A remedy that overshoots the requirement while adding a
cycle of latency is worse than one that just meets it.`,
      examTip: 'Write the setup sum as clock-to-output plus worst logic plus setup, then invert it. If the question also gives a hold time, it is almost always testing whether you add it to the setup sum — you must not. Hold appears only in the second inequality, and that inequality has no T in it.',
      importantNote: 'Skew has opposite signs in the two constraints, so a clock-tree change that rescues setup always erodes hold. When a question offers "increase the clock skew" as a fix, check which constraint is failing before accepting it.',
    },
    { id: 'seqlog-meta', title: '9. Metastability, Synchronisers and the MTBF Expression',
      content: `## 9.1 What actually happens when a window is violated

Section 6.2 found three fixed points in a cross-coupled pair and showed that the
middle one has loop gain above unity. Metastability is what happens when a
flip-flop is placed near that middle point and left to find its own way out.

Violating setup or hold means the internal loop is released while its two nodes
are at nearly the same voltage. The circuit is then in a valid physical state
that is not a valid logical one. It does not stay there — the loop gain drives
it away — but the time it takes to leave depends on how close to the balance
point it started, and that distance can be arbitrarily small.

The departure is exponential. Writing $\\Delta(0)$ for the initial voltage
imbalance and $\\tau$ for the loop's resolution time constant,

$$\\Delta(t) = \\Delta(0)\\,e^{t/\\tau}$$

so the time needed to grow the imbalance to a full logic level $\\Delta_{\\text{L}}$ is

$$t_{\\text{r}} = \\tau \\ln\\!\\left(\\frac{\\Delta_{\\text{L}}}{\\Delta(0)}\\right)$$

Two consequences follow immediately and are worth stating baldly. First,
$t_{\\text{r}}$ is unbounded: there is no resolution time you can wait that
guarantees an answer, because $\\Delta(0)$ has no lower bound. Second, the
dependence is logarithmic, so buying an extra factor of $e$ in confidence costs
only one more $\\tau$ of waiting. Metastability cannot be eliminated, and it can
be made as improbable as you like at very modest cost. Both halves of that
sentence matter.

## 9.2 The MTBF expression, term by term

The standard figure of merit is a mean time between failures:

$$\\text{MTBF} = \\frac{e^{t_{\\text{r}}/\\tau}}{T_0\\, f_{\\text{c}}\\, f_{\\text{d}}}$$

Each symbol earns its place:

- $t_{\\text{r}}$ is the **resolution time allowed** by the design. For a single
  capture flip-flop whose output is used in the next cycle, that is one clock
  period minus the setup requirement of whatever reads it.
- $\\tau$ is the **resolution time constant**, a property of the flip-flop and
  the process, and the same $\\tau$ as in the exponential above. Smaller is
  better and modern processes are in the tens of picoseconds.
- $T_0$ is the **metastability window**, the effective width of the aperture in
  which an arriving edge can leave the device balanced. It has units of time and
  is also a device property.
- $f_{\\text{c}}$ is the **clock frequency** of the receiving domain, because
  every clock edge is another opportunity.
- $f_{\\text{d}}$ is the **rate of asynchronous data changes**, because an edge
  that does not move cannot be caught mid-flight.

The product $T_0 f_{\\text{c}} f_{\\text{d}}$ is therefore a rate of
metastable events per second, and the exponential is the fraction of them that
have not resolved by the time somebody looks. The whole expression is
"opportunities per second, discounted by the odds of surviving the wait".

The single most important structural feature is that $t_{\\text{r}}$ sits in an
exponent while everything else is linear. Doubling the data rate halves the
MTBF. Adding one clock period of waiting multiplies it by $e^{T/\\tau}$, which
for realistic numbers is a factor of millions.

## 9.3 Synchroniser chains, costed

A synchroniser is a chain of flip-flops in the receiving clock domain with no
logic between them. The first may go metastable; each additional stage grants
one more full clock period of resolution time before the value is used.

Take a 200 MHz receiving clock, a device with $\\tau = 0.30$ ns and
$T_0 = 20$ ps, an asynchronous event rate of 10 MHz, and a setup requirement of
0.15 ns. The denominator is a rate of

$$T_0\\, f_{\\text{c}}\\, f_{\\text{d}} = 20\\ \\text{ps} \\times 200\\ \\text{MHz} \\times 10\\ \\text{MHz} = 4.0 \\times 10^{4}\\ \\text{s}^{-1}$$

and the resolution time granted by an $n$-stage chain is $nT - t_{\\text{su}}$.

| Stages | $t_{\\text{r}}$ | $t_{\\text{r}}/\\tau$ | MTBF | In human units |
|---|---|---|---|---|
| 1 | $5 - 0.15 = 4.85$ ns | $4.85 / 0.30 = 16.17$ | 262 s | four minutes |
| 2 | $2 \\times 5 - 0.15 = 9.85$ ns | $9.85 / 0.30 = 32.83$ | $4.54 \\times 10^{9}$ s | 144 years |
| 3 | $3 \\times 5 - 0.15 = 14.85$ ns | $14.85 / 0.30 = 49.50$ | $7.86 \\times 10^{16}$ s | 2.5 billion years |

![Mean time between failures on a logarithmic axis against clock frequency, for synchroniser chains of one, two and three flip-flops. The three curves fall steeply with frequency and are separated by a constant factor on the log axis, with horizontal guides marking one year and one century.](/courses/fe-ee/figures/dig3-mtbf-stages.svg)

A single flip-flop fails every four minutes and is useless. Two flip-flops fail
once in 144 years and are the industry default. The ratio between consecutive
rows is

$$e^{T/\\tau} = e^{5/0.30} = 1.73 \\times 10^{7}$$

which is where the rule of thumb "each stage buys about seven orders of
magnitude" comes from. It is not a constant of nature; it is $e^{T/\\tau}$, and
it collapses as the clock speeds up, which is exactly why very fast designs need
three stages where slow ones need two.

## 9.4 What a synchroniser does not fix

Two stages of flip-flop protect one bit. They do nothing for a multi-bit value
crossing a clock boundary, because each bit resolves independently and the
receiving domain can latch a mixture of old and new bits that was never a valid
word. The standard remedies are to cross a single bit and use it as a handshake,
or to cross a Gray-coded value in which only one bit changes per step, or to use
an asynchronous FIFO built for the purpose. Section 8 of the state-machine
chapter returns to Gray coding for a related reason.

The other thing a synchroniser does not fix is latency. Each stage delays the
signal by one full clock period of the receiving domain, so a two-stage
synchroniser on a 100 MHz clock adds 20 ns before anything downstream may act.

### Worked example 9.1 — sizing a synchroniser

**Given.** A 100 MHz receiver, $\\tau = 0.4$ ns, $T_0 = 10$ ps, asynchronous
event rate 2 MHz, setup 0.2 ns. Two flip-flops are proposed. Is that enough for
a service life of 20 years?

**Work.** The event rate in the denominator is
$10\\ \\text{ps} \\times 100\\ \\text{MHz} \\times 2\\ \\text{MHz} = 2.0 \\times 10^{3}\\ \\text{s}^{-1}$.
The period is 10 ns, so a two-stage chain grants

$$t_{\\text{r}} = 2 \\times 10 - 0.2 = 19.8\\ \\text{ns}, \\qquad \\frac{t_{\\text{r}}}{\\tau} = \\frac{19.8}{0.4} = 49.50$$

$$\\text{MTBF} = \\frac{e^{49.5}}{2.0 \\times 10^{3}} = 1.57 \\times 10^{18}\\ \\text{s}$$

which is about $5.0 \\times 10^{10}$ years.

**Answer.** Two stages are ample — the expected interval between failures
exceeds the age of the universe by a factor of a few, let alone a 20-year
service life.

**The trap.** The denominator is a product of three quantities, and dropping the
asynchronous event rate is the usual slip. It changes the answer by a factor of
two million here, which happens not to change the engineering conclusion but
would in a marginal case.

### Worked example 9.2 — the same part at four times the clock

**Given.** The device of Worked example 9.1 moved to a 400 MHz receiver, with
everything else unchanged.

**Work.** The period falls to 2.5 ns, so a two-stage chain now grants
$t_{\\text{r}} = 2 \\times 2.5 - 0.2 = 4.8$ ns and the exponent falls to
$4.8 / 0.4 = 12.0$. The denominator rises to
$10\\ \\text{ps} \\times 400\\ \\text{MHz} \\times 2\\ \\text{MHz} = 8.0 \\times 10^{3}\\ \\text{s}^{-1}$.

$$\\text{MTBF} = \\frac{e^{12.0}}{8.0 \\times 10^{3}} = 20.3\\ \\text{s}$$

**Answer.** Twenty seconds. The same two-flip-flop synchroniser that was safe
for geological time at 100 MHz is unusable at 400 MHz.

**The trap.** The intuition that a faster clock resolves metastability sooner is
backwards. A faster clock gives the flip-flop **less** time to resolve, and it
does so inside an exponent, so the penalty is savage. This is why synchroniser
depth is a per-design decision rather than a fixed number.`,
      examTip: 'MTBF questions want the exponent. Compute the resolution time first — number of stages times the period, minus the setup requirement — then divide by tau. The denominator is the product of three rates and is usually the easy part; the exponent is where the marks are.',
      importantNote: 'A synchroniser reduces the probability of a metastable value being used; it never reduces it to zero, and no number of stages does. Any claim that a circuit "eliminates metastability" is wrong on the physics, because the resolution time is unbounded.',
    },
    { id: 'seqlog-shift', title: '10. Registers, Shift Registers and the Sequences They Generate',
      content: `## 10.1 From one bit to a word

A register is $n$ flip-flops sharing a clock. It has no internal structure worth
discussing until something is put between the stages, at which point it becomes
the most versatile block in digital design.

The plain parallel-in, parallel-out register loads a whole word on one edge and
holds it. Adding an enable turns the load into a choice, and the enable is
implemented as a multiplexer in front of each D input rather than as a gate in
the clock line:

$$D_i = E\\,X_i + \\overline{E}\\,Q_i$$

That distinction is not stylistic. Gating the clock creates a signal that is
sometimes a clock and sometimes not, which is precisely the case in which a
combinational hazard becomes a real fault, as Section 5.3 established. Enabling
the data keeps every flip-flop on the same uninterrupted clock, and it is the
reason the two-input multiplexer is the most common cell in a synthesised
design.

## 10.2 Shift registers and the four ways in and out

Wire each flip-flop's output into the next one's input and the register shifts.
The four combinations of serial and parallel access have names worth knowing
because questions use them as shorthand:

| Type | In | Out | Clocks for an $n$-bit word | Typical use |
|---|---|---|---|---|
| SISO | serial | serial | $n$ in, $n$ out | a delay line of exactly $n$ cycles |
| SIPO | serial | parallel | $n$ in, 1 out | deserialising a link |
| PISO | parallel | serial | 1 in, $n$ out | serialising for a link |
| PIPO | parallel | parallel | 1 in, 1 out | an ordinary register |

The arithmetic that matters is the conversion time. An 8-bit PISO clocked at
50 MHz has a 20 ns period, so emitting a whole word takes

$$t_{\\text{word}} = 8 \\times 20 = 160\\ \\text{ns}$$

which is 0.16 microseconds, and the sustained word rate is 6.25 million words
per second. Turn that around and it is the standard link-budget question: a
serialiser can carry at most one bit per clock, so a link that must move
50 million bytes per second needs a serial clock of at least 400 MHz, whatever
the parallel side is doing.

A shift register is also the canonical hold-violation risk, for the reason
Section 8.4 gave: there is no logic between the stages, so
$t_{\\text{comb,min}} = 0$ and the hold constraint rests entirely on
clock-to-output time against clock skew.

## 10.3 Ring and Johnson counters: sequences from wiring alone

Feed the last stage's output back to the first and a shift register becomes a
counter with no combinational logic at all.

A **ring counter** feeds Q back unchanged. Seeded with a single 1, a four-bit
ring cycles through four states, verified by enumeration:

1000, 0100, 0010, 0001, and back to 1000.

It uses $n$ flip-flops for $n$ states, which is wasteful of registers and
extravagantly cheap in logic — the state is already one-hot, so decoding any
state costs one wire. That is the same trade the state-machine chapter discusses
under one-hot encoding.

A **Johnson counter**, also called a twisted ring, feeds back the complement.
Enumerating a four-bit version from all zeros gives eight states:

0000, 1000, 1100, 1110, 1111, 0111, 0011, 0001, and back to 0000.

So $n$ flip-flops give $2n$ states, twice the ring's yield, and decoding any one
of them needs only a two-input gate because each state is distinguished by an
adjacent pair of bits. The price is that the other $2^n - 2n$ codes are not part
of the sequence, and a four-bit Johnson counter that powers up in one of them
never joins the intended cycle at all. That failure is important enough to get
its own treatment in Section 10 of the state-machine chapter, where the
parasitic cycle is enumerated and repaired.

## 10.4 Linear feedback shift registers

Replace the plain feedback with the exclusive-OR of selected stages and the
sequence becomes long and statistically flat. For an $n$-bit register the
maximum achievable cycle length is

$$L_{\\max} = 2^{n} - 1$$

one short of the full code space, because the all-zero state maps to itself and
is therefore a fixed point outside the cycle.

Whether a given choice of taps achieves that maximum is not a matter of taste;
it depends on whether the corresponding polynomial is primitive. Two four-bit
examples, both enumerated exhaustively rather than quoted:

**Taps on stages 4 and 3.** Seeded with 1000, the register visits

1000, 0100, 0010, 1001, 1100, 0110, 1011, 0101, 1010, 1101, 1110, 1111, 0111,
0011, 0001

before repeating — 15 distinct states, which is $2^{4} - 1$, and the all-zero
code never appears. This is a maximal-length sequence.

**Taps on stages 4 and 2.** The same register with one tap moved does not visit
15 states from any seed. Enumerating all 15 non-zero seeds finds the code space
broken into cycles of length 3 and length 6: the three codes 0110, 1011 and 1101
form a short cycle among themselves, and the remaining twelve form two cycles of
six. A design that assumed 15 states would repeat after 3 in the worst case.

| Property | Ring | Johnson | Maximal LFSR |
|---|---|---|---|
| Flip-flops for $N$ states | $N$ | $N/2$ | $\\lceil \\log_2(N+1) \\rceil$ |
| States from 4 flip-flops | 4 | 8 | 15 |
| Feedback logic | a wire | an inverter | XOR gates on the taps |
| Decode cost per state | 1 wire | 2-input gate | full $n$-input decode |
| Self-starting from all zeros | no | yes | no, zero is a trap |

Because the sequence is deterministic and repeatable, an LFSR is not a random
number generator in any cryptographic sense; it is a **pseudo-random** sequence
generator, and the same structure computes cyclic redundancy checks, spreads
spectrum in direct-sequence radios, and provides test patterns in built-in
self-test.

### Worked example 10.1 — sizing an LFSR and picking its seed

**Given.** A built-in self-test block needs at least 60 000 distinct test
patterns before the sequence repeats, from a maximal-length LFSR.

**Work.** Require $2^{n} - 1 \\ge 60000$. Since $2^{15} = 32768$ and
$2^{16} = 65536$:

$$2^{16} - 1 = 65535 \\ge 60000$$

so $n = 16$ suffices and $n = 15$, giving 32 767, does not.

**Answer.** A 16-bit LFSR with primitive taps, seeded with any non-zero value.

**The trap.** Two distractors are standard. The first is answering 15 by
comparing $2^{15} = 32768$ against 60 000 carelessly, or by forgetting the minus
one. The second is seeding with zero: a maximal-length LFSR seeded with all
zeros produces all zeros forever, because the XOR of zeros is zero. The seed
must be non-zero, and any non-zero seed gives the same cycle entered at a
different point.

### Worked example 10.2 — counting flip-flops three ways

**Given.** A design needs a repeating sequence of exactly 8 distinct states, and
each state must be decoded to drive one output line.

**Work.** Three structures deliver 8 states:

- **Binary counter**: $\\lceil \\log_2 8 \\rceil = 3$ flip-flops, but each of the
  eight outputs needs a three-input AND gate, so eight gates of three inputs.
- **Johnson counter**: 4 flip-flops, and each state is decoded by a two-input
  gate, so eight gates of two inputs.
- **Ring counter**: 8 flip-flops, and each state is already a wire, so no decode
  logic at all.

**Answer.** The Johnson counter is usually the best compromise for an eight-phase
timing generator: one extra flip-flop over the binary counter buys a halving of
every decode gate and eliminates the decoding spikes that a binary counter's
simultaneous bit changes produce.

**The trap.** The question asks for total cost, not flip-flop count. Answering
"binary, because it uses the fewest flip-flops" ignores that the decode logic is
larger and, in a ripple implementation, glitches on every transition.`,
      examTip: 'A maximal LFSR of n bits has 2^n - 1 states, not 2^n. A ring counter of n bits has n states and a Johnson counter has 2n. These three numbers are the whole of most shift-register questions, and the minus one on the LFSR is the most commonly dropped term.',
      importantNote: 'Enable a register by multiplexing its data input, never by gating its clock. A gated clock carries every combinational hazard on the enable straight into the flip-flop as a spurious edge, which is the one situation where a glitch in a synchronous design is fatal.',
    },
    { id: 'seqlog-count2', title: '11. Counters: Ripple Against Synchronous, With the Delay Counted',
      content: `## 11.1 What a ripple counter actually does between edges

A ripple counter is a chain: the external clock drives stage 0, and each stage's
output clocks the next. It costs nothing but the flip-flops, which is why it
still appears in low-frequency dividers. What it costs instead is a settled
output.

Take a four-bit negative-edge ripple counter with 8 ns of propagation delay per
stage and follow the transition from 0111 to 1000, which is the worst one
because every bit changes. Simulating it stage by stage rather than assuming it:

| Time after the edge | Bus reads | Decimal | Why |
|---|---|---|---|
| 0 ns | 0111 | 7 | the starting state |
| 8 ns | 0110 | 6 | stage 0 has fallen |
| 16 ns | 0100 | 4 | stage 0's fall has clocked stage 1 down |
| 24 ns | 0000 | 0 | stage 1's fall has clocked stage 2 down |
| 32 ns | 1000 | 8 | stage 2's fall has finally clocked stage 3 up |

![A timing diagram of a four-bit ripple counter going from binary zero one one one to binary one zero zero zero, with each stage falling eight nanoseconds after the one below it. Below the four output traces a row of decimal values shows the bus reading seven, then six, then four, then zero, and only after thirty two nanoseconds the intended eight.](/courses/fe-ee/figures/dig3-ripple-codes.svg)

The counter passes through 6, 4 and 0 on its way from 7 to 8. Those are not
transient glitches on one wire; they are complete, well-formed, wrong states
that any decoder watching the bus will faithfully decode. A decoder output for
state 4 will produce a genuine pulse on this transition, and that is the origin
of **decoding spikes**.

The settling time is the full chain:

$$t_{\\text{settle}} = n \\cdot t_{\\text{pd}} = 4 \\times 8 = 32\\ \\text{ns}$$

$$f_{\\max} = \\frac{1000}{32} = 31.25\\ \\text{MHz}$$

## 11.2 The synchronous alternative, and how the two scale

A synchronous counter clocks every stage from the same edge and puts logic in
front of each one to decide whether it toggles. With T flip-flops the rule is
that stage $i$ toggles when all lower stages are 1:

$$T_i = Q_0 Q_1 \\cdots Q_{i-1}, \\qquad T_0 = 1$$

The period is one clock-to-output plus that enable logic plus a setup time.
Taking an 8 ns flip-flop, a 3 ns gate and a 2 ns setup:

$$T = 8 + 3 + 2 = 13\\ \\text{ns}, \\qquad f_{\\max} = \\frac{1000}{13} = 76.92\\ \\text{MHz}$$

which beats the four-bit ripple counter by a factor of

$$\\frac{76.92}{31.25} = 2.46$$

and, unlike the ripple counter, produces no intermediate codes at all, because
every bit changes on the same edge.

How the two scale with width is the more useful comparison. Ripple delay is
strictly proportional to the number of stages. A synchronous counter's delay
depends on how the enable term is built: with wide gates fanning out from all
lower bits it is constant with width; with a chain of two-input gates it grows
linearly but with the small gate delay rather than the large flip-flop delay.

| Width | Ripple | Synchronous, wide enable gates | Synchronous, chained enable |
|---|---|---|---|
| 2 bits | 62.50 MHz | 76.92 MHz | 76.92 MHz |
| 4 bits | 31.25 MHz | 76.92 MHz | 62.50 MHz |
| 8 bits | 15.62 MHz | 76.92 MHz | 35.71 MHz |
| 12 bits | 10.42 MHz | 76.92 MHz | 25.00 MHz |
| 16 bits | 7.81 MHz | 76.92 MHz | 19.23 MHz |

![Maximum count rate against counter width for three architectures. The ripple counter falls as the reciprocal of the width, the synchronous counter with chained enable gates falls more gently, and the synchronous counter with wide parallel enable gates is a horizontal line at seventy six point nine megahertz.](/courses/fe-ee/figures/dig3-counter-rate.svg)

At two bits the architectures are nearly equal and a ripple counter is a
reasonable choice. At sixteen bits the ripple counter is ten times slower than
the constant-rate synchronous one. That divergence, rather than any argument
about elegance, is why synchronous design won.

## 11.3 Designing a mod-10 counter, and checking where the spare codes go

A decade counter visits 0 through 9 and returns to 0. Four flip-flops give
sixteen codes, so six are unused and may be treated as don't-cares during
minimisation. Using T flip-flops and minimising each toggle function over the
ten used codes with the six spares free, the result is

$$T_0 = 1$$

$$T_1 = \\overline{Q_3}\\,Q_0$$

$$T_2 = Q_1 Q_0$$

$$T_3 = Q_2 Q_1 Q_0 + Q_3 Q_0$$

Read them as sentences. Bit 0 toggles every clock. Bit 1 toggles when bit 0 is
set, except when bit 3 is already set, which is what makes 9 return to 0 instead
of going to 10. Bit 2 toggles on the carry out of bits 1 and 0. Bit 3 toggles
either on the carry out of bits 2, 1 and 0, which takes 7 to 8, or when it is
already set and bit 0 is set, which takes 9 to 0.

These four expressions were checked by running them as a machine from each of
the ten valid codes and confirming the successor in every case. That is a
different operation from re-reading the maps that produced them, and it is the
one that catches transcription errors.

The don't-cares then have to be audited, because a don't-care is a promise that
the state never occurs, and power-up breaks that promise. Running the same
equations from each unused code gives:

| Unused code | Next | Then | Rejoined? |
|---|---|---|---|
| 1010 (10) | 1011 | 0110 | yes, in 2 clocks |
| 1011 (11) | 0110 | — | yes, in 1 clock |
| 1100 (12) | 1101 | 0100 | yes, in 2 clocks |
| 1101 (13) | 0100 | — | yes, in 1 clock |
| 1110 (14) | 1111 | 0010 | yes, in 2 clocks |
| 1111 (15) | 0010 | — | yes, in 1 clock |

Every unused code reaches the counting cycle within two clocks, so this
particular design is **self-correcting** by good fortune rather than by
construction. The important word is audit: the minimiser was free to send those
codes anywhere, and on a different machine it sends them into a loop of their
own. Section 10 of the state-machine chapter shows exactly that happening to a
Johnson counter and prices the repair.

### Worked example 11.1 — ripple delay and the usable clock

**Given.** A six-bit ripple counter built from flip-flops with 12 ns of
propagation delay.

**Work.** The worst transition propagates through all six stages:

$$t_{\\text{settle}} = 6 \\times 12 = 72\\ \\text{ns}, \\qquad f_{\\max} = \\frac{1000}{72} = 13.89\\ \\text{MHz}$$

**Answer.** About 13.9 MHz, and any decoder attached to this bus must be
strobed after the 72 ns has elapsed rather than driven combinationally.

**The trap.** Answering $1/12\\ \\text{ns} = 83.3$ MHz treats the counter as if the
stages worked in parallel. They do not; that is the definition of ripple. The
number of stages multiplies the delay, and the worst-case transition is the one
where every bit changes, which happens once per full count.

### Worked example 11.2 — how many flip-flops, and what closes the cycle

**Given.** A counter that repeats every 12 counts, 0 through 11.

**Work.** Twelve states need

$$\\lceil \\log_2 12 \\rceil = 4 \\text{ flip-flops}$$

because three give only eight codes and four give sixteen. Four unused codes
remain. The counter must be forced from 1011, which is 11, back to 0000 rather
than on to 1100, so a decode of state 11 is required. Checking the candidate
decodes against the twelve codes actually visited: $Q_3 Q_1$ matches both 1010
and 1011, and $Q_3 Q_0$ matches both 1001 and 1011, so neither is sufficient.
The three-literal term $Q_3 Q_1 Q_0$ matches 1011 alone.

**Answer.** Four flip-flops, with $Q_3 Q_1 Q_0$ decoded to reset the counter
synchronously on the next edge.

**The trap.** Two errors are common. The first is answering three flip-flops
because 12 is closer to 8 than to 16 — the ceiling is not a rounding. The second
is using an asynchronous reset driven by the decode of state 12, which does
count to 11 correctly but places a runt pulse of state 12 on the bus for one
gate delay before the reset takes effect. A synchronous reset decoded from state
11 never shows the illegal code at all.`,
      examTip: 'Ripple counter settling time is the number of stages times the per-stage delay, and the worst case is the all-bits-change transition. Synchronous counter period is one flip-flop delay plus the enable logic plus setup, and it does not grow with width when the enable gates are wide.',
      importantNote: 'Unused codes are don\'t-cares only while the machine is running as intended. Power-up, a glitch on an asynchronous input or a single-event upset can place the counter in one of them, so any design that treats spare codes as free must be run from each of them to confirm it returns.',
    },
    { id: 'seqlog-probs-a', title: '12. Problem Set A: Latches, Flip-Flops and Timing',
      content: `## Problem Set A

Work each problem before reading the solution. Every solution names the
distractor that the question is built around and states the wrong number it
produces.

**A1.** A NOR-based SR latch is holding Q = 0. The inputs (S, R) are applied in
the order (1, 0), (0, 0), (0, 1), (0, 0), (1, 0). What is the output sequence?

**A2.** A JK flip-flop is wired with $J = 1$ and $K = 1$ permanently, and clocked
at 24 MHz. What appears at Q?

**A3.** A register-to-register path has $t_{\\text{cq}} = 0.8$ ns, worst-case
logic 5.4 ns and $t_{\\text{su}} = 0.3$ ns. What is the maximum clock frequency,
and what is the slack at 140 MHz?

**A4.** The same path has a fastest logic route of 0.5 ns, a hold requirement of
0.6 ns and 0.4 ns of skew working against it. Does it pass hold, and would
halving the clock frequency change the answer?

**A5.** A D latch and a D flip-flop are both driven by the same clock, high for
4 ns. The data input rises 1 ns after the clock rises and falls 3 ns after the
clock rises. What does each output do?

**A6.** A two-flip-flop synchroniser runs at 250 MHz with $\\tau = 0.25$ ns,
$T_0 = 15$ ps, an asynchronous event rate of 5 MHz and a setup requirement of
0.1 ns. Estimate the MTBF.

---

### Worked solution A1

Apply $Q^{+} = S + \\overline{R}\\,Q$ in order, carrying Q forward:

| Step | S | R | Q before | Q after |
|---|---|---|---|---|
| 1 | 1 | 0 | 0 | 1 |
| 2 | 0 | 0 | 1 | 1 |
| 3 | 0 | 1 | 1 | 0 |
| 4 | 0 | 0 | 0 | 0 |
| 5 | 1 | 0 | 0 | 1 |

**Answer: 1, 1, 0, 0, 1.**

**Trap.** Treating a hold as a reset gives 1, 0, 0, 0, 1. The hold rows have no
value of their own; steps 2 and 4 simply repeat what came before them, and a
latch that produced 0 on step 2 would not be a memory at all.

### Worked solution A2

With $J = K = 1$ the characteristic equation becomes
$Q^{+} = 1 \\cdot \\overline{Q} + 0 \\cdot Q = \\overline{Q}$, so the flip-flop
toggles on every active edge. Two edges are needed for one complete output
cycle, so

$$f_{\\text{out}} = \\frac{24}{2} = 12\\ \\text{MHz}$$

**Answer: a square wave at 12 MHz, half the clock frequency.**

**Trap.** Answering 24 MHz treats each toggle as one output cycle. A toggle is
half a cycle — the output must go up and come back down — which is why a single
toggling flip-flop is the standard divide-by-two.

### Worked solution A3

$$T_{\\min} = 0.8 + 5.4 + 0.3 = 6.5\\ \\text{ns}, \\qquad f_{\\max} = \\frac{1000}{6.5} = 153.85\\ \\text{MHz}$$

At 140 MHz the period is $1000 / 140 = 7.14$ ns, so

$$\\text{slack} = 7.14 - 6.5 = 0.64\\ \\text{ns}$$

**Answer: 153.85 MHz maximum, with 0.64 ns of slack at 140 MHz.**

**Trap.** Omitting $t_{\\text{cq}}$ gives 5.7 ns and 175.4 MHz, which would
approve a design that cannot run. The clock-to-output delay is part of the path,
not part of the flip-flop's overhead to be ignored.

### Worked solution A4

$$\\text{hold margin} = 0.8 + 0.5 - 0.6 - 0.4 = 0.3\\ \\text{ns}$$

**Answer: it passes, with 0.3 ns to spare, and halving the clock frequency would
change nothing.**

**Trap.** The second half of the question is the whole question. The hold
inequality contains no period, so every answer of the form "it fails now but
passes at half speed" is wrong by construction. Distractors also invite adding
the skew to the launch side, which gives $0.8 + 0.5 + 0.4 - 0.6 = 1.1$ ns of
margin and hides how close the path really is.

### Worked solution A5

The latch is transparent for the whole 4 ns window, so its output rises at 1 ns
and falls at 3 ns, following the data exactly, and then holds the level D
carries when the clock falls — which is low.

The flip-flop samples only at the rising edge at time 0, when D is still low, so
its output does not change at all during this clock cycle.

**Answer: the latch produces a 2 ns pulse and settles low; the flip-flop
produces nothing.**

**Trap.** The usual wrong answer has the flip-flop capturing the 1 ns rise
because the rise happens "during" the clock pulse. Edge triggering means the
device looks at one instant, and 1 ns after the edge is not that instant.

### Worked solution A6

The period is 4 ns, so a two-stage chain grants

$$t_{\\text{r}} = 2 \\times 4 - 0.1 = 7.9\\ \\text{ns}, \\qquad \\frac{t_{\\text{r}}}{\\tau} = \\frac{7.9}{0.25} = 31.60$$

The denominator is
$15\\ \\text{ps} \\times 250\\ \\text{MHz} \\times 5\\ \\text{MHz} = 1.875 \\times 10^{4}\\ \\text{s}^{-1}$, so

$$\\text{MTBF} = \\frac{e^{31.6}}{1.875 \\times 10^{4}} = 2.82 \\times 10^{9}\\ \\text{s}$$

which is about 89 years.

**Answer: roughly $2.8 \\times 10^{9}$ seconds, or 89 years.**

**Trap.** Using one clock period of resolution time instead of two drops the
exponent to $4 - 0.1 = 3.9$ ns over 0.25 ns, which is 15.6, and the MTBF to
about 318 seconds — a factor of $e^{16}$, nearly nine million, out. The whole
point of the second flip-flop is that it grants a further **full** period, so an
$n$-stage chain grants $nT$ minus one setup time, not $T$.`,
      examTip: 'On any timing question, write the constraint symbolically before substituting. Most wrong answers in this set come from a term put on the wrong side of an inequality rather than from arithmetic.',
    },
    { id: 'seqlog-probs-b', title: '13. Problem Set B: Counters, Registers and Sequence Generators',
      content: `## Problem Set B

**B1.** A five-bit ripple counter uses flip-flops with 6 ns of propagation delay.
What is its maximum count rate, and how long after the clock edge may a decoder
output be trusted?

**B2.** How many flip-flops does a mod-20 counter need, and how many codes are
unused?

**B3.** A four-bit Johnson counter and a four-bit ring counter are both seeded
correctly. How many states does each produce, and how many gate inputs does it
take to decode one chosen state in each case?

**B4.** A maximal-length LFSR must produce at least a quarter of a million
distinct patterns. What is the smallest register that will do, and what seed is
forbidden?

**B5.** A 12-bit PISO shift register serialises data at 80 MHz. What is the word
rate, and what serial clock would be needed to sustain 10 million words per
second?

**B6.** In a synchronous mod-10 counter built with T flip-flops, the toggle
equation for the most significant bit is $T_3 = Q_2 Q_1 Q_0 + Q_3 Q_0$. Explain
what each term does, and state what goes wrong if the second term is omitted.

---

### Worked solution B1

$$t_{\\text{settle}} = 5 \\times 6 = 30\\ \\text{ns}, \\qquad f_{\\max} = \\frac{1000}{30} = 33.33\\ \\text{MHz}$$

**Answer: about 33.3 MHz, and a decoder output is trustworthy only after 30 ns
have elapsed from the clock edge.**

**Trap.** Answering 166.7 MHz from $1/6$ ns ignores the cascade. The second half
of the question is the practically important one: the count rate limit and the
decode-valid time are the same number, and a combinational decoder driven from a
ripple counter produces real pulses on wrong states during that interval.

### Worked solution B2

$$\\lceil \\log_2 20 \\rceil = 5 \\text{ flip-flops}, \\qquad 2^{5} - 20 = 12 \\text{ unused codes}$$

**Answer: five flip-flops, with twelve unused codes.**

**Trap.** Four flip-flops give sixteen codes, which is fewer than twenty, so the
answer is never four. The other slip is reporting the unused count as
$20 - 16 = 4$, which subtracts in the wrong direction.

### Worked solution B3

A four-bit ring counter has **4 states**, each already one-hot, so decoding a
chosen state costs **1 wire and no gate**.

A four-bit Johnson counter has **8 states**. Each is uniquely identified within
the sequence by an adjacent pair of bits — searching all two-literal products
against the eight states shows that $Q_2\\overline{Q_1}$ selects 1100 and nothing
else — so decoding a chosen state costs **one two-input gate**.

**Answer: 4 states and no decode gate for the ring, 8 states and a two-input
gate for the Johnson.**

**Trap.** Answering 16 states for the Johnson counter confuses $2n$ with $2^n$.
Four flip-flops have sixteen codes, but the twisted-ring feedback visits only
eight of them, and the other eight form a separate cycle the counter can be
stranded in.

### Worked solution B4

Require $2^{n} - 1 \\ge 250000$. Since $2^{17} = 131072$ and $2^{18} = 262144$:

$$2^{18} - 1 = 262143 \\ge 250000$$

**Answer: an 18-bit LFSR, and the all-zero seed is forbidden.**

**Trap.** The all-zero state is not merely a bad choice; it is a fixed point. The
XOR of any set of zeros is zero, so the register loads zero forever and the
circuit appears dead. The other trap is answering 17 by comparing 131 072
against 250 000 too quickly.

### Worked solution B5

At 80 MHz the serial period is 12.5 ns, so one 12-bit word takes

$$t_{\\text{word}} = 12 \\times 12.5 = 150\\ \\text{ns}$$

giving a word rate of $1 / 150$ ns, which is 6.67 million words per second. To
reach 10 million words per second the serial clock must supply 12 bits in 100 ns:

$$f_{\\text{serial}} = 12 \\times 10 = 120\\ \\text{MHz}$$

**Answer: 6.67 million words per second at 80 MHz; 120 MHz is needed for 10
million words per second.**

**Trap.** Answering 80 million words per second reads the clock frequency as a
word rate. A serialiser moves one bit per clock, so the word rate is always the
bit clock divided by the word width.

### Worked solution B6

The first term, $Q_2 Q_1 Q_0$, is the ordinary binary carry: bit 3 toggles when
all three lower bits are set, which is the transition from 0111 to 1000, that is
from 7 to 8.

The second term, $Q_3 Q_0$, is the decade wrap: with bit 3 already set the only
reachable state in the sequence is 1001, which is 9, and toggling bit 3 from
there returns the counter to 0000 as required.

Omitting $Q_3 Q_0$ leaves bit 3 set after state 9. The other equations take bits
2, 1 and 0 from 001 onwards, so the counter runs 8, 9, 10, 11 and beyond instead
of wrapping, and it becomes a mod-16 counter with an unusual start.

**Answer: the first term is the carry into bit 3, the second is the wrap out of
9; without the wrap term the counter runs to 15.**

**Trap.** The tempting simplification is that a decade counter merely needs to
"reset at 10", implemented by decoding 1010 and clearing asynchronously. That
does produce ten counts, but state 1010 appears on the bus for one gate delay
first, so any decoder sees a runt pulse on an illegal state. Building the wrap
into the toggle equations, as above, means the illegal state is never entered.`,
      examTip: 'Counter questions almost always reduce to one of three numbers: the flip-flop count from a ceiling of a logarithm, the settling time from stages times delay, or the sequence length from the structure. Identify which one is being asked before computing anything.',
      importantNote: 'A mod-N counter that resets asynchronously on the decode of state N does display state N briefly. A counter whose next-state equations wrap out of state N-1 never displays it. When a question offers both, the synchronous wrap is the correct engineering answer.',
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
    { id: 'fsm-both', title: '6. One Specification, Two Machines, Carried Through to Gates',
      content: `## 6.1 Naming states so the table writes itself

Section 3 built a detector for the pattern 101. This section takes a longer
pattern, **1101**, and carries it all the way from a sentence to a gate netlist
twice — once as a Moore machine and once as a Mealy machine — so that the
comparison is between two finished designs rather than between two descriptions.

The creative step in any detector is choosing what the states mean, and there is
a rule that removes the creativity entirely. Let each state stand for **the
length of the longest prefix of the pattern that is currently a suffix of
everything seen so far**. With that definition the transition out of any state
is mechanical: append the incoming bit to the prefix that state represents, then
find the longest prefix of the pattern that is a suffix of the result.

Applied to 1101, with S0 through S4 meaning zero through four characters
matched:

| Present | Meaning | Input 0 | Input 1 | Moore output |
|---|---|---|---|---|
| S0 | nothing matched | S0 | S1 | 0 |
| S1 | matched 1 | S0 | S2 | 0 |
| S2 | matched 11 | S3 | S2 | 0 |
| S3 | matched 110 | S0 | S4 | 0 |
| S4 | matched 1101 | S0 | S2 | **1** |

Three of those rows repay a second look, because they are where hand-built
detectors go wrong.

**S2 on a 1 stays in S2.** Having seen 11, another 1 leaves the last two
characters as 11, which is still exactly two characters of the pattern. Sending
this transition back to S1 is the single most common error in the whole topic,
and it makes the detector miss any occurrence preceded by extra ones.

**S3 on a 0 falls all the way to S0.** After 110, a 0 gives 1100, and none of
1, 11, 110 or 1101 is a suffix of that. There is nothing to salvage.

**S4 behaves exactly like S1.** After a successful match the last character seen
is a 1, which is one character of the pattern, so the machine leaves S4 for the
same destinations it would leave S1 for. That is the overlap rule, and Section 11
quantifies what it is worth.

## 6.2 The Mealy machine is the same table with the output moved

A Mealy machine puts the output on the transition rather than on the state,
which means the accepting state is no longer needed as a separate place to
stand. Delete S4, redirect the arrow that pointed at it to the state that
describes the situation after the match — which is S1 — and label that arrow
with an output of 1:

| Present | Input 0 | Output | Input 1 | Output |
|---|---|---|---|---|
| S0 | S0 | 0 | S1 | 0 |
| S1 | S0 | 0 | S2 | 0 |
| S2 | S3 | 0 | S2 | 0 |
| S3 | S0 | 0 | S1 | **1** |

Four states instead of five, which matters here because four states fit in two
flip-flops and five do not.

![Two state graphs of the same specification. Above, a five-state Moore machine for the pattern one one zero one laid out as a chain with the accepting state at the right and backward arcs beneath. Below, the four-state Mealy version of the same machine, in which the detection rides on the arrow leaving state three labelled one over one.](/courses/fe-ee/figures/dig3-fsm-graphs.svg)

Both machines were then checked against a plain substring scan on **every one of
the 4096 possible twelve-bit input streams**. The Mealy output matched the scan
in the same cycle and the Moore output matched it one cycle later, on all 4096
streams with no exceptions. That is a stronger statement than any argument from
the diagram, and it is the reason the transition table above can be trusted.

## 6.3 Synthesis of the Mealy machine, to gates

Assign $S_0 = 00$, $S_1 = 01$, $S_2 = 10$, $S_3 = 11$ with $Q_1$ as the high bit,
and let $X$ be the input. Copying the state table into next-state bits gives a
complete truth table on three variables:

| $Q_1$ | $Q_0$ | $X$ | State to state | $Q_1^{+}$ | $Q_0^{+}$ | $Y$ |
|---|---|---|---|---|---|---|
| 0 | 0 | 0 | S0 to S0 | 0 | 0 | 0 |
| 0 | 0 | 1 | S0 to S1 | 0 | 1 | 0 |
| 0 | 1 | 0 | S1 to S0 | 0 | 0 | 0 |
| 0 | 1 | 1 | S1 to S2 | **1** | 0 | 0 |
| 1 | 0 | 0 | S2 to S3 | **1** | **1** | 0 |
| 1 | 0 | 1 | S2 to S2 | **1** | 0 | 0 |
| 1 | 1 | 0 | S3 to S0 | 0 | 0 | 0 |
| 1 | 1 | 1 | S3 to S1 | 0 | **1** | **1** |

Minimising each output column exactly gives

$$Q_1^{+} = Q_1\\overline{Q_0} + \\overline{Q_1}\\,Q_0 X$$

$$Q_0^{+} = \\overline{Q_1}\\,\\overline{Q_0}\\,X + Q_1\\overline{Q_0}\\,\\overline{X} + Q_1 Q_0 X$$

$$Y = Q_1 Q_0 X$$

and because the flip-flops are D types, these next-state expressions **are** the
flip-flop input equations; no excitation step is required.

Each of the three was compared against the eight rows of the table by
enumeration. The output equation deserves a sentence of its own: $Y = Q_1 Q_0 X$
depends on the input as well as the state, and that dependence is what makes
this a Mealy machine. Delete the $X$ and the circuit is wrong, not merely
slower.

## 6.4 Synthesis of the Moore machine, on three flip-flops

Five states need three flip-flops. Assign $S_0 = 000$ up to $S_3 = 011$ and
$S_4 = 100$, leaving 101, 110 and 111 unused and available as don't-cares.
Minimising over the ten reachable rows with those three codes free gives

$$Q_2^{+} = Q_1 Q_0 X$$

$$Q_1^{+} = \\overline{Q_1}\\,Q_0 X + Q_1 \\overline{Q_0} + Q_2 X$$

$$Q_0^{+} = Q_1 \\overline{Q_0}\\,\\overline{X} + \\overline{Q_2}\\,\\overline{Q_1}\\,\\overline{Q_0}\\,X$$

$$Y = Q_2$$

The output equation is now a single wire, which is the Moore machine's
characteristic advantage: the output is a decode of state alone, so it cannot
respond to anything happening between clock edges.

The cost shows up in the next-state logic, which is 17 literals across three
equations against 14 across two for the Mealy version, plus an extra flip-flop.
That is the trade in its most concrete form: a Moore machine spends registers
and next-state logic to buy a clean output.

The three unused codes were audited rather than assumed. Running the equations
from each of them, with each input value, gives:

| Unused code | On input 0 | On input 1 | Rejoins? |
|---|---|---|---|
| 101 | 000 | 010 | immediately |
| 110 | 011 | 010 | immediately |
| 111 | 000 | 110 then 010 | within two clocks |

Every stray code returns to the intended state set within two clocks, so this
particular don't-care resolution happens to be self-correcting. Section 10 shows
a design where the same procedure produces a machine that never recovers.

### Worked example 6.1 — deriving one row of the state table from the rule

**Given.** The pattern 1101, and a machine currently in S2, meaning the last two
characters seen were 11. The next input is 0.

**Work.** Append the input to the prefix the state represents: 11 followed by 0
gives 110. Now find the longest prefix of 1101 that is a suffix of 110. The
candidates, longest first, are 110, 11 and 1. Is 110 a suffix of 110? Yes.

**Answer.** The machine goes to S3, the state meaning three characters matched.

**The trap.** Answering S0 comes from the reflex that a 0 breaks a run of ones.
It does not break anything here, because the pattern itself contains a 0 in that
position. The rule is mechanical precisely so that this reflex never gets a
chance to operate.

### Worked example 6.2 — the transition out of the accepting state

**Given.** The Moore machine has just entered S4, having matched 1101. The next
input is 1.

**Work.** The relevant history is the whole pattern, 1101, plus the new bit,
giving 11011. The longest prefix of 1101 that is a suffix of 11011 is 11, since
1101 is not a suffix, 110 is not, and 11 is.

**Answer.** S2.

**Check.** The same answer follows from noticing that S4's meaningful history is
just its final 1, which is what S1 means, and S1 on a 1 goes to S2.

**The trap.** Returning to S0 after a detection is the non-overlapping design. It
is a legitimate machine for a different specification, but on the stream
1101101 it reports one detection where the overlapping machine reports two.

### Worked example 6.3 — running the gate netlist against the specification

**Given.** The Mealy equations of Section 6.3 and the input stream
110110101101, fed one bit per clock from $Q_1 Q_0 = 00$.

**Work.** Evaluate $Y = Q_1 Q_0 X$ before each edge, then update the state with
the two next-state equations. Doing this for all twelve cycles gives the output
sequence 000100100001.

Comparing against a plain scan of the string for the substring 1101 gives the
same twelve bits, with matches ending at positions 3, 6 and 11 counting from
zero.

**Answer.** Detections in cycles 3, 6 and 11, and the netlist agrees with the
state table and with the substring scan bit for bit.

**The trap.** Positions 3 and 6 are only three cycles apart, which is shorter
than the pattern. That is the overlap at work — the stream contains 1101101, in
which the second match reuses the first match's final 1. A detector that resets
to S0 after a match reports only the first of them.`,
      examTip: 'Name the states after how much of the pattern has been matched and the transitions become mechanical: append the bit, then find the longest prefix of the pattern that is a suffix of the result. Almost every wrong sequence detector comes from sending a repeated character back to the start instead of holding.',
      importantNote: 'A Mealy output equation contains the input; a Moore output equation does not. If you derive an output equation for a machine you were told is Moore and the input appears in it, the state assignment or the table is wrong, not the algebra.',
    },
    { id: 'fsm-timing2', title: '7. The Output-Timing Difference, Shown on a Waveform',
      content: `## 7.1 Both machines on one stream

Arguments about Moore against Mealy stop being abstract the moment both machines
run on the same data. Feed the twelve-bit stream 110110101101 into the two
detectors of Section 6 and record the state and both outputs every cycle.

| Cycle | Input | Moore state after the edge | Mealy output | Moore output |
|---|---|---|---|---|
| 0 | 1 | S1 | 0 | 0 |
| 1 | 1 | S2 | 0 | 0 |
| 2 | 0 | S3 | 0 | 0 |
| 3 | 1 | **S4** | **1** | 0 |
| 4 | 1 | S2 | 0 | **1** |
| 5 | 0 | S3 | 0 | 0 |
| 6 | 1 | **S4** | **1** | 0 |
| 7 | 0 | S0 | 0 | **1** |
| 8 | 1 | S1 | 0 | 0 |
| 9 | 1 | S2 | 0 | 0 |
| 10 | 0 | S3 | 0 | 0 |
| 11 | 1 | **S4** | **1** | 0 |

The Mealy output pulses in cycles 3, 6 and 11. The Moore output pulses in cycles
4, 7 and 12. Same three detections, same order, one cycle of latency between
them.

![A twelve-cycle trace of the input stream, the Mealy output, the Moore output and the Moore state. The three cycles in which the pattern completes are shaded, and a curved arrow runs from each Mealy pulse to the corresponding Moore pulse one cycle later.](/courses/fe-ee/figures/dig3-mm-waveform.svg)

## 7.2 Why the offset is structural rather than accidental

The Mealy output is combinational logic on the present state and the present
input:

$$Y_{\\text{Mealy}} = g(\\text{state}, X)$$

so it can respond inside the cycle in which the deciding bit arrives. The Moore
output is combinational logic on the state alone:

$$Y_{\\text{Moore}} = h(\\text{state})$$

and the state does not become S4 until the clock edge that ends that cycle. The
one-cycle offset is therefore not a property of these two particular machines;
it is a property of the two architectures, and it appears wherever they are
compared.

Read the state row in the table above and the mechanism is visible directly:
every shaded cycle is a cycle in which the machine is still in S3 while the
deciding 1 is present at the input, and S4 is entered by the edge that closes
it.

## 7.3 The price of the earlier answer

Because a Mealy output follows the input within a cycle, it inherits whatever
the input does within that cycle. If the input is itself a registered signal
that settles early, nothing happens. If the input is a combinational signal with
a hazard on it, or an asynchronous signal from another clock domain, the output
carries that disturbance straight through.

| Property | Moore | Mealy |
|---|---|---|
| Output latency after the deciding bit | one cycle | none |
| Output during a cycle | constant | follows the input |
| States for this detector | 5 | 4 |
| Flip-flops for this detector | 3 | 2 |
| Output equation | state decode only | state and input |
| Safe to use directly as a clock or enable | yes | only if registered |

The last row is the practical rule. A Moore output changes only just after a
clock edge and is stable for the rest of the cycle, so it can drive a
flip-flop's enable or, with care, a clock. A Mealy output can change at any
moment within the cycle, so anything that samples it between edges may sample a
transient.

## 7.4 Registering a Mealy output turns it into a Moore output

Pass a Mealy output through one flip-flop and two things happen at once: the
glitch exposure disappears, because the flip-flop samples once per cycle, and
the output appears one cycle later, because the flip-flop delays it. That is
precisely the Moore behaviour.

$$Y_{\\text{registered Mealy}}(n+1) = Y_{\\text{Mealy}}(n) = Y_{\\text{Moore}}(n+1)$$

The equivalence is the practical resolution of the whole debate. Use an
unregistered Mealy output when the cycle of latency genuinely matters and you
control what reads it. Register it, or design a Moore machine in the first
place, whenever anything downstream is sensitive to a mid-cycle transition. The
choice is about where you want to pay, not about which architecture is better.

### Worked example 7.1 — reading a required latency off a specification

**Given.** A controller must assert a one-cycle strobe in the **same** cycle
that a start command arrives, and that strobe drives the clock enable of a
downstream register. The start command is itself the registered output of
another block in the same clock domain.

**Work.** The same-cycle requirement rules out a Moore output, which cannot
respond until the following cycle. So the strobe must be a Mealy output. The
concern with a Mealy output is that it follows the input within the cycle — but
here the input is a registered signal in the same clock domain, so it settles
shortly after the edge and is stable for the rest of the cycle. The strobe
therefore settles early too and is stable when the downstream register samples
it.

**Answer.** A Mealy output is correct and safe here, because the input is
registered in the same domain.

**The trap.** The advice "never use a Mealy output as an enable" is a
simplification of the real rule, which is that the danger comes from the input,
not from the architecture. Had the start command arrived from another clock
domain or straight out of a block of combinational logic, the same Mealy output
would have been unsafe and would have needed a register — at which point it
would have become a Moore output with a Moore output's latency, and the
specification could not have been met at all.`,
      examTip: 'On a trace question write the state after every input bit in one row and read the outputs underneath. A Moore output belongs to the state you have just entered, so it is reported one column to the right of the Mealy answer for the same stream.',
      importantNote: 'A Mealy output registered through one flip-flop behaves exactly like the Moore output of the same machine, latency included. There is therefore no design in which registering a Mealy output gives you both the early answer and the clean signal.',
    },
    { id: 'fsm-assign', title: '8. State Assignment: Binary, Gray and One-Hot, With the Logic Counted',
      content: `## 8.1 The choice nobody thinks is a choice

Once the state table is fixed, the number of flip-flops follows from the number
of states:

$$n_{\\text{binary}} = \\lceil \\log_2 N \\rceil, \\qquad n_{\\text{one-hot}} = N$$

What does not follow is which code goes with which state. For $N$ states in
$n$ bits there are $2^n$ codes to choose from and the number of distinct
assignments is large — for four states in two bits it is $4! = 24$ — and each
one produces different next-state equations. The equations are all correct; they
are not all the same size.

This is usually presented as a matter of taste. It is not. Taking the
four-state Mealy detector of Section 6, minimising exactly for **all 24**
assignments and counting the literals in the minimum sum of products for the
two next-state functions and the output gives a spread from 7 literals to 18.

![A bar chart of the literal cost of all twenty four ways of assigning two-bit codes to the four states of the detector, sorted cheapest first. Four assignments tie at seven literals, the Gray-coded assignment costs eight, and the obvious binary assignment costs seventeen, close to the worst.](/courses/fe-ee/figures/dig3-assign-cost.svg)

The obvious assignment — S0 through S3 as 00, 01, 10, 11 — costs 17 literals,
which is in the worst quarter of all 24. That is not bad luck; it is what
happens when the codes are chosen by counting rather than by looking at the
transitions.

## 8.2 Three assignments, compared as finished equations

**Straight binary**, S0 = 00, S1 = 01, S2 = 10, S3 = 11:

$$Q_1^{+} = Q_1\\overline{Q_0} + \\overline{Q_1}\\,Q_0 X$$

$$Q_0^{+} = \\overline{Q_1}\\,\\overline{Q_0}\\,X + Q_1\\overline{Q_0}\\,\\overline{X} + Q_1 Q_0 X$$

$$Y = Q_1 Q_0 X$$

Total: 17 literals, six product terms.

**Gray**, S0 = 00, S1 = 01, S2 = 11, S3 = 10:

$$Q_1^{+} = Q_0 X + Q_1 Q_0$$

$$Q_0^{+} = X$$

$$Y = Q_1 \\overline{Q_0}\\,X$$

Total: 8 literals, four product terms. The second equation has collapsed to a
wire, because the Gray assignment happens to make the low state bit equal the
input on every row.

**The cheapest of the 24**, S0 = 01, S1 = 11, S2 = 10, S3 = 00:

$$Q_1^{+} = X$$

$$Q_0^{+} = Q_0\\overline{X} + \\overline{Q_1}$$

$$Y = \\overline{Q_1}\\,\\overline{Q_0}\\,X$$

Total: 7 literals, four product terms — less than half the straight-binary cost
for exactly the same machine, verified against the same state table row by row.

The reason Gray does well here is the reason it does well generally: adjacent
states differ in one bit, so a transition changes one flip-flop instead of two,
which both simplifies the next-state functions and halves the switching noise on
a state bus. The reason the winner beats Gray is specific to this machine, and
finding it required searching, which is what a synthesis tool does and what a
person doing this by hand does not.

## 8.3 One-hot

One-hot spends one flip-flop per state and holds exactly one of them at 1. The
next-state equation for each state is then a transcription of the arrows
entering it — no map, no minimisation:

$$S_0^{+} = S_0\\overline{X} + S_1\\overline{X} + S_3\\overline{X}$$

$$S_1^{+} = S_0 X + S_3 X$$

$$S_2^{+} = S_1 X + S_2 X$$

$$S_3^{+} = S_2 \\overline{X}$$

$$Y = S_3 X$$

Sixteen literals of next-state logic across four equations, on four flip-flops
instead of two. The equations were checked against the state table on every
combination of one-hot state and input.

Read as a cost that looks bad, and as a structure it looks excellent. Every
product term has exactly two literals, so the logic depth is one gate level
regardless of how many states the machine has. In a binary encoding the depth
grows with $\\log_2 N$, and in a large machine that difference is the clock
period.

| Encoding | Flip-flops for $N$ states | Next-state depth | Output decode | Unused codes | Natural home |
|---|---|---|---|---|---|
| Binary | $\\lceil \\log_2 N \\rceil$ | deepest | needs a decoder | $2^{n} - N$ | ASIC, area-limited |
| Gray | $\\lceil \\log_2 N \\rceil$ | similar to binary | needs a decoder | $2^{n} - N$ | buses, fewer switching glitches |
| One-hot | $N$ | shallowest, one level | one wire per state | $2^{N} - N$ | FPGA, speed-limited |

The FPGA preference has a concrete cause rather than a stylistic one: a lookup
table in an FPGA fabric comes with a flip-flop attached whether you use it or
not, so spending flip-flops to shorten logic depth raises the clock rate at no
real cost in area.

The one-hot column also carries the warning. With $N$ flip-flops there are
$2^{N}$ codes and only $N$ of them are legal, so the overwhelming majority of the
state space is illegal — for a 10-state machine, 1014 codes out of 1024. Any
one-hot design in a system that can be disturbed needs either a reset that is
guaranteed to reach every flip-flop or explicit illegal-state detection.

### Worked example 8.1 — flip-flop counts three ways

**Given.** Machines with 5, 9, 17 and 33 states.

**Work.** Apply the ceiling of the base-2 logarithm for binary and the state
count itself for one-hot:

| States | Binary flip-flops | Unused binary codes | One-hot flip-flops |
|---|---|---|---|
| 5 | 3 | 3 | 5 |
| 9 | 4 | 7 | 9 |
| 17 | 5 | 15 | 17 |
| 33 | 6 | 31 | 33 |

**Answer.** As tabulated. Note how each of these sits just past a power of two,
so each wastes nearly half of its code space.

**The trap.** Every one of these four is a "just over" case, chosen because the
common error is to take the floor instead of the ceiling. Nine states in three
flip-flops is eight codes for nine states, which is impossible; the answer is
never obtained by rounding.

### Worked example 8.2 — choosing an encoding from a requirement

**Given.** A 12-state controller for an FPGA, required to run as fast as
possible. Area is not constrained.

**Work.** Binary needs $\\lceil \\log_2 12 \\rceil = 4$ flip-flops and leaves
$2^{4} - 12 = 4$ unused codes, with next-state logic several gate levels deep and
an output decoder on top. One-hot needs 12 flip-flops, gives one gate level of
next-state logic and makes every output decode a single wire.

**Answer.** One-hot, because the target is an FPGA where flip-flops are free
alongside the lookup tables and the requirement is speed.

**Follow-on.** Had the same machine been targeted at a small ASIC with a tight
area budget and a relaxed clock, binary would be the correct answer, and the
four unused codes would then have to be audited for the reasons Section 10
gives.

**The trap.** "One-hot uses more flip-flops, so it costs more" treats flip-flops
as the currency. On an FPGA they are not; the currency is lookup tables and
logic depth, and one-hot wins on both.`,
      examTip: 'n states need ceil(log2 n) flip-flops in binary and n in one-hot. Where a question asks which encoding to use, look for the word FPGA, which points to one-hot, or for an area or pin constraint, which points to binary.',
      importantNote: 'The obvious binary assignment is not a neutral default. On the four-state detector in this chapter it costs 17 literals against 7 for the best of the 24 possible assignments — the same machine, the same table, more than twice the logic.',
    },
    { id: 'fsm-minimise', title: '9. State Minimisation, Worked Two Ways on One Machine',
      content: `## 9.1 What equivalence means, precisely

Two states are **equivalent** when no experiment can tell them apart. Formally,
$S_i$ and $S_j$ are equivalent when, for every input, they produce the same
output and move to states that are themselves equivalent. The definition is
recursive, which is why it is applied by successive refinement rather than by
inspection.

Take this seven-state Moore machine:

| State | Next on 0 | Next on 1 | Output |
|---|---|---|---|
| A | B | C | 0 |
| B | D | E | 0 |
| C | D | F | 0 |
| D | G | A | **1** |
| E | G | A | **1** |
| F | D | E | 0 |
| G | B | C | 0 |

Nothing about it looks redundant. Seven states need three flip-flops.

## 9.2 Method one: partition refinement

Start by splitting the states on output alone, then repeatedly split any block
whose members send different inputs into different blocks. Stop when a pass
changes nothing.

**Round 0.** Split on output:

$$P_0 = \\{A, B, C, F, G\\},\\ \\{D, E\\}$$

**Round 1.** For each state, record which block it goes to on 0 and on 1. Within
the first block, A and G both go to (block 1, block 1); B and F both go to
(block 2, block 2); C goes to (block 2, block 1) and is alone. Within the second
block, D and E both go to (block 1, block 1), so it does not split.

$$P_1 = \\{A, G\\},\\ \\{B, F\\},\\ \\{C\\},\\ \\{D, E\\}$$

**Round 2.** Repeat with the finer partition. A and G both go to the (B, F)
block on 0 and to the (C) block on 1; B and F both go to the (D, E) block on
both inputs; D and E both go to the (A, G) block on both inputs. Nothing splits,
so the process has converged.

Seven states collapse to four, and the flip-flop count falls:

$$\\lceil \\log_2 7 \\rceil = 3 \\quad \\text{becomes} \\quad \\lceil \\log_2 4 \\rceil = 2$$

which is a real saving of a register, unlike the five-to-three example of
Section 4.5 where both counts rounded to two.

## 9.3 Method two: the implication chart

The chart lists every unordered pair of states in a triangular grid and crosses
out the pairs that can be shown to differ.

- Cross out at round 0 any pair whose outputs differ.
- Then repeatedly cross out any pair whose successors under some input form a
  pair that is already crossed out.
- Whatever survives is equivalent.

![An implication chart for the seven-state machine, drawn as a lower triangular grid of pairs. Most cells carry a cross marked zero or one, showing the round at which the pair was eliminated, and three cells are shaded to mark the surviving equivalent pairs A with G, B with F and D with E.](/courses/fe-ee/figures/dig3-implication-chart.svg)

Running it on this machine, every pair containing exactly one of D or E is
crossed at round 0, because those two are the only states with output 1. One
further round of successor implication crosses everything else except three
cells, and a second round changes nothing. The survivors are

$$A \\equiv G, \\qquad B \\equiv F, \\qquad D \\equiv E$$

which is the same answer as the partition method, obtained by a different
bookkeeping. Two independent routes agreeing is the check; either method alone
is easy to run carelessly.

## 9.4 The reduced machine

Rename the classes: $P = \\{A, G\\}$, $Q = \\{B, F\\}$, $R = \\{C\\}$, $T = \\{D, E\\}$.

| State | Next on 0 | Next on 1 | Output |
|---|---|---|---|
| P | Q | R | 0 |
| Q | T | T | **0** |
| R | T | Q | 0 |
| T | P | P | **1** |

Check one row against the original to be sure the renaming is faithful. State Q
stands for B and F. B goes to D on 0 and E on 1; both D and E are in class T, so
Q goes to T on both inputs, which is what the reduced table says. State R stands
for C, which goes to D on 0, giving T, and to F on 1, giving Q. Correct.

What the reduction bought: three flip-flops become two, seven rows of
next-state logic become four, and the two spare codes in the two-bit encoding
become don't-cares that will simplify the equations further. What it did not
buy: any change in behaviour. The reduced machine produces exactly the same
output stream as the original for every input stream, which is what equivalence
means.

### Worked example 9.1 — spotting the pair that is not equivalent

**Given.** In the machine above, are B and C equivalent? Both have output 0.

**Work.** On input 0, B goes to D and C goes to D — the same state, so that
input gives no distinction. On input 1, B goes to E and C goes to F. Are E and F
equivalent? E has output 1 and F has output 0, so no; they are distinguished at
round 0.

**Answer.** B and C are not equivalent, and one input string of length two
proves it: apply 1 then anything, and from B the machine is in an output-1 state
while from C it is not.

**The trap.** Identical entries in one column are seductive. Equivalence requires
agreement on **every** input, and the recursion means agreement all the way down.
Half of a matching row is not a partial result; it is nothing.

### Worked example 9.2 — how much a reduction is actually worth

**Given.** A machine reduced from 9 states to 5, and another reduced from 7
states to 4.

**Work.** For the first: $\\lceil \\log_2 9 \\rceil = 4$ and
$\\lceil \\log_2 5 \\rceil = 3$, so one flip-flop is saved. For the second:
$\\lceil \\log_2 7 \\rceil = 3$ and $\\lceil \\log_2 4 \\rceil = 2$, so one flip-flop
is saved.

Now a third: reduced from 6 states to 5. Then
$\\lceil \\log_2 6 \\rceil = 3$ and $\\lceil \\log_2 5 \\rceil = 3$ — no flip-flop is
saved at all.

**Answer.** A reduction saves a register only when it crosses a power of two.
Otherwise the saving is in the next-state logic and in the extra don't-cares,
which is real but smaller.

**The trap.** "State minimisation reduces hardware" is stated so often that
candidates answer "yes, one flip-flop" for any reduction. The count is a ceiling
of a logarithm, and a ceiling only moves at the boundaries.`,
      examTip: 'Split on output first, then refine. Any pair whose outputs differ is distinguishable immediately, and on most exam machines that first split does more than half the work.',
      importantNote: 'Minimisation reduces states, not necessarily flip-flops. Six states down to five still needs three flip-flops; seven down to four saves one. Check the ceiling of the logarithm before claiming a register has been saved.',
    },
    { id: 'fsm-unused', title: '10. Unused States, Lock-Up, and Self-Correcting Designs',
      content: `## 10.1 A don't-care is a promise, and power-up breaks it

Whenever the number of states is not a power of two, some codes are unused.
Treating them as don't-cares during minimisation is standard and produces smaller
logic. It also assigns them a behaviour, silently, chosen by whatever made the
maps smallest. That behaviour is invisible in the state diagram and is never
what the designer thought about.

The promise a don't-care makes is that the machine is never in that state. The
promise is broken by power-up before any reset has propagated, by a reset that
does not reach every flip-flop, by a single-event upset in a radiation
environment, and by a glitch on an asynchronous input. On any of those the
machine finds itself in a code whose successor nobody chose deliberately.

There are only two possible outcomes, and the difference between them is the
difference between a design that recovers and a design that is dead.

## 10.2 The lucky case: a mod-5 counter

Design a counter that visits 000 through 100 and returns, on three flip-flops,
leaving 101, 110 and 111 as don't-cares. Minimising with those three free gives

$$Q_2^{+} = Q_1 Q_0$$

$$Q_1^{+} = \\overline{Q_1}\\,Q_0 + Q_1\\overline{Q_0}$$

$$Q_0^{+} = \\overline{Q_2}\\,\\overline{Q_0}$$

for a total of 8 literals, and these were confirmed against the five counting
states by simulation.

Now run the same equations from each unused code:

| Unused code | Next state | In the cycle? |
|---|---|---|
| 101 | 010 | yes |
| 110 | 010 | yes |
| 111 | 100 | yes |

All three rejoin in a single clock. The design is self-correcting, and it is
self-correcting **by accident** — nothing in the procedure asked for it.

Forcing the issue instead, by specifying that all three unused codes go to 000
and minimising with no don't-cares at all, gives

$$Q_2^{+} = \\overline{Q_2}\\,Q_1 Q_0$$

$$Q_1^{+} = \\overline{Q_2}\\,\\overline{Q_1}\\,Q_0 + \\overline{Q_2}\\,Q_1\\overline{Q_0}$$

$$Q_0^{+} = \\overline{Q_2}\\,\\overline{Q_0}$$

for 11 literals. Guaranteed recovery costs 3 extra literals here. On this
machine that is a price worth paying for the guarantee, and the point of working
both versions is that the guarantee had to be bought — it was never free.

## 10.3 The unlucky case: a four-bit Johnson counter

Section 10 of the sequential-logic chapter introduced the Johnson counter: a
shift register whose complemented output feeds back to the input, giving $2n$
states from $n$ flip-flops. With four flip-flops the feedback is

$$Q_3^{+} = \\overline{Q_0}$$

and the intended sequence, enumerated from all zeros, is

0000, 1000, 1100, 1110, 1111, 0111, 0011, 0001, and back to 0000.

Eight states. Sixteen codes exist. Enumerating the other eight reveals that they
do not scatter into the main cycle at all — they form a **second, complete cycle
of their own**:

0010, 1001, 0100, 1010, 1101, 0110, 1011, 0101, and back to 0010.

The two cycles are disjoint. Every one of the eight stray codes leads only to
other stray codes, forever. A counter that powers up anywhere in the second ring
runs happily, produces a plausible-looking eight-state sequence, and never once
visits a state the designer intended.

![Sixteen four-bit codes drawn as two separate rings of eight. The left ring is the intended Johnson sequence and the right ring is the parasitic one, with no arrow joining them, and two dashed arrows showing the only transitions that the repaired feedback moves.](/courses/fe-ee/figures/dig3-johnson-lockup.svg)

This is **lock-up**, and it is the reason the topic exists. It is not a rare
pathological case invented for teaching; it is the default behaviour of the
textbook Johnson counter.

## 10.4 Repairing it, and what the repair costs

The feedback is pinned on the eight codes of the intended cycle and completely
free on the other eight, so there are $2^{8} = 256$ possible feedback functions
that all produce the correct sequence. Enumerating all 256 and testing each for
recovery from every one of the sixteen codes finds that **132 of them are
self-correcting** and 124 are not.

The cheapest self-correcting choice is

$$Q_3^{+} = \\overline{Q_0} + Q_2\\overline{Q_1}$$

at 3 literals against the original 1, and it recovers from any starting code
within at most 5 clocks. Comparing it with the original on the eight states of
the intended cycle confirms they agree everywhere, so the counter's specified
behaviour is untouched.

What is striking is how little changes. Of the eight transitions in the stray
ring, the repaired feedback moves only two: 0101 now goes to 1010 instead of
0010, and 1101 now goes to 1110, which is inside the intended cycle. That single
escape route is enough to drain the whole parasitic ring, because everything in
it eventually reaches 1101.

| Design | Feedback | Literals | Codes that never recover | Worst recovery |
|---|---|---|---|---|
| Textbook Johnson | $\\overline{Q_0}$ | 1 | 8 of 16 | never |
| Self-correcting | $\\overline{Q_0} + Q_2\\overline{Q_1}$ | 3 | 0 of 16 | 5 clocks |

## 10.5 The three ways to guarantee recovery

- **Force the unused states explicitly.** Specify a next state for every code
  rather than leaving don't-cares, as in the mod-5 example. Costs logic, gives a
  certain answer, and makes the intent visible in the equations.
- **Audit the don't-care result.** Minimise freely, then run the finished
  equations from every unused code and check that all of them return. Costs
  nothing but the check, and the check is the part people skip.
- **Guarantee the reset.** If reset provably reaches every flip-flop before the
  first clock edge, and nothing can disturb the state afterwards, unused states
  are genuinely unreachable. This is the usual answer in commercial synchronous
  logic and the wrong answer in anything exposed to radiation or to a
  brown-out.

### Worked example 10.1 — auditing a don't-care resolution

**Given.** A mod-6 counter on three D flip-flops counting 000 through 101, with
110 and 111 left as don't-cares. Minimising each next-state function over the
six used codes with the two spares free gives

$$Q_2^{+} = Q_1 Q_0 + Q_2\\overline{Q_0}$$

$$Q_1^{+} = Q_1\\overline{Q_0} + \\overline{Q_2}\\,\\overline{Q_1}\\,Q_0$$

$$Q_0^{+} = \\overline{Q_0}$$

**Work.** Evaluate the finished equations at each unused code.

At 110, where $Q_2 = 1$, $Q_1 = 1$, $Q_0 = 0$:
$Q_2^{+} = 1 \\cdot 0 + 1 \\cdot 1 = 1$, $Q_1^{+} = 1 \\cdot 1 + 0 = 1$ and
$Q_0^{+} = 1$. The successor is **111**, which is the other unused code.

At 111, where all three are 1:
$Q_2^{+} = 1 \\cdot 1 + 1 \\cdot 0 = 1$, $Q_1^{+} = 1 \\cdot 0 + 0 = 0$ and
$Q_0^{+} = 0$. The successor is **100**, which is state 4 of the counting
sequence.

**Answer.** Neither code loops. Code 111 rejoins in one clock and code 110
rejoins in two, by way of 111, so this don't-care resolution is self-correcting
and needs no extra logic.

**The trap.** Stopping the audit after one step would have condemned this design:
110 goes to another illegal code, which looks exactly like the first step of a
lock-up. An audit has to follow each stray code until it either reaches a legal
state or revisits a code it has already been in. It must also evaluate the
**finished, minimised** equations rather than the state table, because the table
says nothing about the unused codes by construction — only the equations know
where the minimiser sent them.

### Worked example 10.2 — deciding whether to pay for self-correction

**Given.** Two designs of the same 12-state controller on four flip-flops. Design
A leaves the four unused codes as don't-cares and, on audit, two of them form a
two-state loop that never rejoins. Design B forces all four to the reset state
and costs 6 more literals. The controller is in a mains-powered instrument with
a properly designed reset, but it drives a motor.

**Work.** The probability of entering the parasitic loop through a clean
power-up with a working reset is essentially zero. The probability through
supply glitches, brown-outs and electrically noisy motor switching is not. The
consequence is a controller stuck in an unspecified state driving a motor.

**Answer.** Design B. Six literals is a trivial price against an
unrecoverable-without-power-cycling failure in a machine with an actuator on it.

**The trap.** The argument "reset handles it" is correct about power-up and says
nothing at all about disturbance during operation. Where the consequence of a
lock-up is severe, or where a watchdog cannot recover it, the guarantee is worth
buying regardless of how unlikely the entry looks.`,
      examTip: 'A four-bit Johnson counter is the standard lock-up example: eight intended states, eight more that form a separate cycle, and no path between them. If a question asks whether a counter is self-correcting, run its equations from each unused code rather than reasoning from the diagram.',
      importantNote: 'Self-correction is a property of the finished equations, not of the design method. The mod-5 counter in this section self-corrects for free and the Johnson counter does not, and both came out of the same standard procedure.',
    },
    { id: 'fsm-overlap', title: '11. Sequence Detectors With and Without Overlap',
      content: `## 11.1 The one specification detail that changes the machine

"Detect the pattern 1101 in a serial bit stream" is an incomplete specification,
and the missing clause is what happens immediately after a match. Two readings
exist and they build different machines.

**Overlapping detection** allows the tail of a completed match to serve as the
head of the next one. After matching 1101 the machine keeps the final 1 and
continues from the state meaning "one character matched".

**Non-overlapping detection** discards everything after a match and restarts
from scratch, as if the stream began again.

The difference is one row of the state table. In the Moore machine of Section 6,
the accepting state S4 has transitions

$$\\text{overlapping:} \\quad S_4 \\xrightarrow{0} S_0, \\quad S_4 \\xrightarrow{1} S_2$$

$$\\text{non-overlapping:} \\quad S_4 \\xrightarrow{0} S_0, \\quad S_4 \\xrightarrow{1} S_1$$

Everything else is identical. One arrow decides the specification.

## 11.2 What the difference is worth, measured

Take the stream 1101101. Tracing both machines bit by bit:

| Position | Bit | Overlapping state | Non-overlapping state |
|---|---|---|---|
| 0 | 1 | S1 | S1 |
| 1 | 1 | S2 | S2 |
| 2 | 0 | S3 | S3 |
| 3 | 1 | **S4 detect** | **S4 detect** |
| 4 | 1 | S2 | S1 |
| 5 | 0 | S3 | S0 |
| 6 | 1 | **S4 detect** | S1 |

The overlapping machine reports two matches and the non-overlapping machine
reports one. Both are correct answers to their own specification, and only one
is correct for a given question.

Scaling that up, running both machines over **all 1024 ten-bit streams** counts
448 overlapping detections against 417 non-overlapping ones, so 31 detections
are lost to the restart. The loss is modest for this pattern because 1101
overlaps itself in only one character. For a pattern with a longer self-overlap
the gap widens sharply: 0101 overlaps itself in two characters, so the stream
010101 contains two overlapping occurrences and only one non-overlapping one.

The general rule is that the overlap available to a pattern is the length of its
longest proper prefix that is also a suffix — the same quantity that defines the
state transitions in the first place:

| Pattern | Longest prefix that is also a suffix | Overlap available |
|---|---|---|
| 1101 | 1 | one character |
| 0101 | 01 | two characters |
| 1111 | 111 | three characters |
| 1000 | none | none, the two designs coincide |

That last row is worth noticing. When a pattern has no self-overlap at all, the
overlapping and non-overlapping machines are the same machine, and the
specification detail stops mattering.

## 11.3 Where each is the right answer

Overlapping detection is the default for pattern matching in a data stream:
protocol framing, start-of-packet detection, and any search where every
occurrence matters.

Non-overlapping detection is right when a match **consumes** something. A
machine that dispenses one item per matched token, or that counts groups rather
than occurrences, must not count the same characters twice.

### Worked example 11.1 — counting matches both ways

**Given.** The pattern 1010 and the stream 101010101.

**Work.** 1010 has 10 as its longest prefix that is also a suffix, so it overlaps
itself in two characters. Scanning for occurrences ending at each position:

- ending at position 3: characters 0 to 3 are 1010, a match
- ending at position 5: characters 2 to 5 are 1010, a match
- ending at position 7: characters 4 to 7 are 1010, a match

giving three overlapping matches. Non-overlapping, the machine restarts after
each match: it matches at position 3, then begins again at position 4 with the
remaining stream 10101, which contains 1010 ending at position 7, and then only
one character remains.

**Answer.** Three matches with overlap, two without.

**The trap.** Restarting is not the same as skipping the matched characters and
carrying on — it is that, but candidates often restart from the wrong position,
either re-reading the last character of the match or dropping one too many. The
state machine gets this right automatically because S4 on a 1 goes to S1 in the
non-overlapping design, which is exactly "this character is now the first
character of a fresh attempt".

### Worked example 11.2 — reading the specification off the application

**Given.** Two requirements. (a) A receiver must raise a flag every time the
eight-bit sync word appears anywhere in the incoming bit stream, so the link can
be re-aligned. (b) A ticket machine must advance a counter every time it sees
the four-pulse pattern that means one complete ticket has passed a sensor.

**Work.** In (a), every appearance is evidence about alignment, including one
that shares bits with a previous appearance, and no resource is consumed by
reporting it. In (b), a ticket is a physical object; the four pulses that
recorded it cannot also record a second one.

**Answer.** (a) overlapping, (b) non-overlapping.

**The trap.** The word "every" in a specification does not settle the question.
Both machines fire on every occurrence — they simply disagree about what
counts as an occurrence once characters have been used. The deciding question is
always whether a match consumes the characters that produced it.`,
      examTip: 'Sequence detectors are the most common FSM exam problem, and the overlap clause is the most common thing left implicit. If the question says nothing, assume overlapping, and say so in your working.',
      importantNote: 'The overlap a pattern can have equals the length of its longest proper prefix that is also a suffix. For a pattern with no such prefix, the overlapping and non-overlapping machines are identical and the distinction disappears.',
    },
    { id: 'fsm-fulldesign', title: '12. A Full Design from Words to Gates, and Its Simulation',
      content: `## 12.1 The specification, in sentences

A coin controller accepts nickels and dimes. An item costs 20 cents. When the
accumulated total first reaches or exceeds 20 cents the controller asserts VEND
for one cycle and returns to empty. If the total reaches 25 cents — which can
only happen by dropping a dime on top of 15 cents — it asserts CHANGE at the
same time, returning a nickel. Coins arrive one per clock cycle at most, so the
two coin inputs are never both asserted together. No coin in a cycle means the
controller holds.

This is the shape of every controller question worth asking: a few sentences, an
implicit state that has to be discovered, and two outputs whose conditions differ.

## 12.2 Finding the states

The state is whatever the controller must remember, which is the amount already
paid. Because it always vends and empties at 20, the amount held can only be 0,
5, 10 or 15 cents — four states, two flip-flops.

That reasoning is the whole design step. Everything from here is bookkeeping.

Writing N for a nickel arriving and D for a dime arriving, and working out each
destination arithmetically:

| Held | Coin | Total | Next held | VEND | CHANGE |
|---|---|---|---|---|---|
| 0c | N | 5 | 5c | 0 | 0 |
| 0c | D | 10 | 10c | 0 | 0 |
| 5c | N | 10 | 10c | 0 | 0 |
| 5c | D | 15 | 15c | 0 | 0 |
| 10c | N | 15 | 15c | 0 | 0 |
| 10c | D | $10 + 10 = 20$ | 0c | **1** | 0 |
| 15c | N | $15 + 5 = 20$ | 0c | **1** | 0 |
| 15c | D | $15 + 10 = 25$ | 0c | **1** | **1** |

plus four rows in which no coin arrives and the state holds. The two coins
arriving together is impossible by specification, so those four rows are
don't-cares available to the minimiser.

![A state graph of the coin controller with four states holding zero, five, ten and fifteen cents laid out left to right. Nickel and dime arcs move rightwards along and across the chain, and three arcs return to the empty state carrying the vend output, one of them also carrying the change output.](/courses/fe-ee/figures/dig3-vending-graph.svg)

## 12.3 Encoding and synthesis

Assign $Q_1 Q_0 = 00, 01, 10, 11$ to 0c, 5c, 10c and 15c, so the state code is
the amount held divided by five in binary. Building the four-variable truth table
over $(Q_1, Q_0, N, D)$ with the four impossible rows as don't-cares and
minimising each output exactly gives

$$Q_1^{+} = \\overline{Q_1}\\,D + \\overline{Q_1}\\,Q_0 N + Q_1\\overline{N}\\,\\overline{D} + Q_1 \\overline{Q_0}\\,\\overline{D}$$

$$Q_0^{+} = \\overline{Q_0}\\,N + Q_0\\overline{N}\\,\\overline{D} + \\overline{Q_1}\\,Q_0 D$$

$$\\text{VEND} = Q_1 D + Q_1 Q_0 N$$

$$\\text{CHANGE} = Q_1 Q_0 D$$

Since the flip-flops are D types, the two next-state expressions are the
flip-flop input equations directly.

The output equations read as English. VEND fires when a dime lands on 10c or
15c, which is $Q_1 D$, or when a nickel lands on 15c, which is $Q_1 Q_0 N$.
CHANGE fires on exactly one condition: a dime landing on 15c. Both outputs
contain a coin input, so this is a Mealy machine, and the one-cycle-earlier
response is what lets the item drop in the same cycle the last coin is accepted.

All four expressions were compared against the twelve legal rows of the truth
table by enumeration, with zero mismatches.

## 12.4 Simulating the finished gates against the specification

Checking the equations against the table they came from catches transcription
errors and nothing else. The stronger check is to run the netlist against the
**words** of the specification.

The gates were driven with every possible coin sequence of length one to six —
1092 sequences in all, over the alphabet of nothing, nickel and dime — while an
independent counter tracked the true running total. Two properties were asserted
on every cycle of every sequence:

- the state code always equals the running total divided by five
- every cycle in which VEND is asserted is a cycle in which the true total has
  just reached exactly 20 or exactly 25, and CHANGE accompanies it in the 25
  case and only in the 25 case

Both held for all 1092 sequences. That is a different claim from "the equations
match the table", because the running total was computed by adding coins, not by
consulting the state machine.

### Worked example 12.1 — a trace through the netlist

**Given.** The coin sequence nickel, nickel, dime, nickel, dime, dime, starting
from empty.

**Work.** Evaluate the output equations before each edge, then update the state.

| Cycle | Coin | State before | VEND | CHANGE | State after | Total paid |
|---|---|---|---|---|---|---|
| 1 | N | 0c | 0 | 0 | 5c | 5 |
| 2 | N | 5c | 0 | 0 | 10c | 10 |
| 3 | D | 10c | **1** | 0 | 0c | 20, vended |
| 4 | N | 0c | 0 | 0 | 5c | 5 |
| 5 | D | 5c | 0 | 0 | 15c | 15 |
| 6 | D | 15c | **1** | **1** | 0c | 25, vended with change |

**Answer.** Two items dispensed, one of them with a nickel returned. The customer
paid 45 cents in total for two 20-cent items and received 5 cents back, which
balances.

**The trap.** In cycle 3 the machine is in state 10c and a dime arrives, so VEND
is asserted in that same cycle — before the state changes. That is Mealy
behaviour. Reading the VEND column as belonging to the state **after** the edge
shifts every output down one row and produces a machine that dispenses one cycle
late and, on the last row, appears to dispense from the empty state.

### Worked example 12.2 — extending the specification

**Given.** The same controller, now required to accept quarters as well, still
with a 20-cent price, returning a nickel of change on a 25-cent total as before.

**Work.** A quarter arriving on an empty machine gives 25 cents, so it must vend
with change. A quarter arriving on any non-empty state gives at least 30 cents,
which the machine cannot return correctly with a single nickel of change.

**Answer.** The specification is incomplete as stated. Either the machine must
refuse a quarter when it is not empty, which is one extra output and no extra
state, or the change mechanism must be able to return 10, 15 or 20 cents, which
means the change output becomes a multi-bit amount and the state must be
extended to hold what is owed.

**The trap.** Adding an input to a state machine is easy; adding one that
enlarges the range of the outputs is not. The instinct is to add more states,
but here the states are already sufficient — the total held before a quarter is
still one of four values. What overflows is the output, and no amount of extra
state fixes an output that cannot express the answer.`,
      examTip: 'Find the state by asking what the machine must remember, not by counting inputs. In a coin controller the memory is the amount already paid, and because the machine empties on every vend that amount can only take a few values.',
      importantNote: 'Checking equations against the table they were derived from proves only that the algebra was copied correctly. Running the finished logic against an independent model of the specification — here, a counter adding coins — is what catches an error in the table itself.',
    },
    { id: 'fsm-probs-a', title: '13. Problem Set A: Analysing and Tracing State Machines',
      content: `## Problem Set A

**A1.** A Moore machine has states P, Q, R with outputs 0, 0, 1 and transitions
P on 0 to P, P on 1 to Q, Q on 0 to R, Q on 1 to Q, R on 0 to P, R on 1 to Q.
Starting in P, what output sequence does the input 011011 produce?

**A2.** A machine's output equation is found to be $Y = Q_1\\overline{Q_0}X$. Is it
Moore or Mealy, and how many states does it have at least?

**A3.** How many flip-flops are needed for a 20-state machine in binary and in
one-hot, and how many codes are unused in each?

**A4.** A four-state Mealy detector for 1101 uses the assignment
S0 = 00, S1 = 01, S2 = 11, S3 = 10 and has $Q_0^{+} = X$. Verify that this is
correct on all four states.

**A5.** Two states of a Moore machine both have output 0, both go to state C on
a 0 and both go to state D on a 1. Are they equivalent?

**A6.** A synchronous machine's designer left three unused codes as don't-cares.
The finished equations send code 110 to 111 and code 111 to 110. What has
happened, and is a reset enough?

---

### Worked solution A1

Trace the state after each bit, then read the output of the state occupied.

| Bit | 0 | 1 | 1 | 0 | 1 | 1 |
|---|---|---|---|---|---|---|
| State after | P | Q | Q | R | Q | Q |
| Output | 0 | 0 | 0 | **1** | 0 | 0 |

**Answer: 000100.**

**Trap.** The Moore output belongs to the state the machine has just entered, so
it must be read after the transition, not before it. Reading the output of the
state occupied **before** each bit gives 000010, the same single pulse shifted
one place early, and that shifted answer is the distractor this question is
built around.

### Worked solution A2

The input $X$ appears in the output equation, so the output depends on the input
as well as the state: the machine is **Mealy**. Two state variables appear,
$Q_1$ and $Q_0$, so there are at least three states — two flip-flops can only be
justified by more than two states, and two flip-flops encode at most four.

**Answer: Mealy, with at least three and at most four states.**

**Trap.** Answering "four states" assumes all codes are used. Two flip-flops
encode up to four states but a three-state machine also needs two, so the
equation alone cannot distinguish them.

### Worked solution A3

$$\\lceil \\log_2 20 \\rceil = 5, \\qquad 2^{5} - 20 = 12$$

so binary needs 5 flip-flops with 12 unused codes. One-hot needs 20 flip-flops,
and of its $2^{20} = 1048576$ codes only 20 are legal, leaving 1 048 556 unused.

**Answer: 5 flip-flops and 12 unused codes in binary; 20 flip-flops and
1 048 556 unused codes in one-hot.**

**Trap.** The one-hot unused count surprises people, and it is the reason one-hot
machines in disturbance-prone environments carry explicit illegal-state
detection. Answering "no unused codes, because there is one per state" confuses
the number of states with the size of the code space.

### Worked solution A4

Under this assignment $Q_0$ is the low bit of 00, 01, 11, 10 for S0 to S3. Check
each transition's destination low bit against the input that caused it:

| From | On 0 goes to | Low bit | On 1 goes to | Low bit |
|---|---|---|---|---|
| S0 (00) | S0 = 00 | 0 | S1 = 01 | 1 |
| S1 (01) | S0 = 00 | 0 | S2 = 11 | 1 |
| S2 (11) | S3 = 10 | 0 | S2 = 11 | 1 |
| S3 (10) | S0 = 00 | 0 | S1 = 01 | 1 |

The low bit of the next state equals the input on all eight rows.

**Answer: correct, $Q_0^{+} = X$ on every row.**

**Trap.** This collapse is a property of the assignment, not of the machine. Move
to straight binary, with S2 = 10 and S3 = 11, and the same low bit needs three
product terms and nine literals. Quoting $Q_0^{+} = X$ for the wrong encoding is
a favourite distractor.

### Worked solution A5

Not yet. They agree on output and their successors are the same states, so they
are equivalent **provided** those successors do not distinguish them — and since
both go to the same C and the same D, no experiment can separate them at all.

**Answer: yes, they are equivalent.**

**Trap.** The recursion in the definition makes people hesitate here, and
hesitating is right in general. What settles it in this case is that the
successors are *identical*, not merely equivalent, so the recursion terminates
immediately. Had one gone to C and the other to some C-equivalent state, the
same conclusion would follow but only after checking that pair.

### Worked solution A6

Codes 110 and 111 map into each other, so a machine that enters either one
alternates between them forever and never reaches a legal state. This is a
two-state **lock-up cycle** created by the don't-care minimisation.

A reset is enough only if it provably reaches every flip-flop before the first
clock edge and nothing can disturb the state afterwards. It does not protect
against a supply glitch, a brown-out or an upset during operation.

**Answer: a parasitic cycle has been created; reset covers power-up only, and
the equations should be re-derived with the unused codes forced to a legal
state.**

**Trap.** "Those states can never occur" is the assumption the don't-care
encoded, and the audit exists precisely because that assumption is not
enforceable in hardware. The cost of forcing them is a few literals, as Section
10 measured.`,
      examTip: 'For a trace question build one table with a row for the state and a row for the output, and be explicit about whether the output belongs to the state before or after the edge. That single decision separates the Moore answer from the Mealy answer.',
    },
    { id: 'fsm-probs-b', title: '14. Problem Set B: Designing and Encoding State Machines',
      content: `## Problem Set B

**B1.** Design the state table for a Moore detector for the pattern 011 with
overlap, and say how many flip-flops it needs.

**B2.** The same detector without overlap. Which single entry changes?

**B3.** A machine has 6 states. After minimisation it has 5. How much hardware
was saved?

**B4.** A four-state machine is to be encoded in two bits. How many distinct
assignments exist, and why does it matter?

**B5.** A traffic controller has states GREEN, YELLOW, RED and holds each for a
fixed number of clocks driven by an external timer pulse T. Write the state
table, and say whether the output should be Moore or Mealy.

**B6.** A Mealy machine's output must drive the write-enable of a memory. What
must be checked before connecting it, and what is the fix if the check fails?

---

### Worked solution B1

Name states by how much of 011 has been matched.

| State | Meaning | On 0 | On 1 | Output |
|---|---|---|---|---|
| S0 | nothing | S1 | S0 | 0 |
| S1 | matched 0 | S1 | S2 | 0 |
| S2 | matched 01 | S1 | **S3** | 0 |
| S3 | matched 011 | S1 | S0 | **1** |

Check the two awkward rows. S1 on a 0 stays in S1, because the new 0 is itself a
valid first character. S3 on a 1 gives 0111, whose longest suffix that is a
prefix of 011 is nothing, so it goes to S0. S3 on a 0 gives 0110, whose last
character 0 is a valid first character, so it goes to S1.

Four states need $\\lceil \\log_2 4 \\rceil = 2$ flip-flops.

**Answer: as tabulated, two flip-flops.**

**Trap.** Sending S1 on a 0 back to S0 is the standard error. A repeated 0 does
not destroy the match in progress; it restarts it, and S1 is exactly the state
that means "one 0 seen".

### Worked solution B2

Without overlap the machine restarts from scratch after a detection, so the
transitions out of S3 must both behave as if the stream were beginning.

**Answer: only S3 on a 0 changes, from S1 to S1 — which is unchanged — and S3 on
a 1 stays S0, which is also unchanged.**

That is the real answer and it is worth the surprise: 011 has no proper prefix
that is also a suffix, so it cannot overlap itself, and the overlapping and
non-overlapping machines are identical.

**Trap.** The question invites you to change something. Checking the
prefix-suffix property first tells you there is nothing to change, and it takes
five seconds.

### Worked solution B3

$$\\lceil \\log_2 6 \\rceil = 3, \\qquad \\lceil \\log_2 5 \\rceil = 3$$

**Answer: no flip-flops are saved. The saving is one row of next-state logic and
one extra don't-care code, both of which shrink the combinational logic
slightly.**

**Trap.** "Minimisation saves hardware" is true in general and false for the
register count here. The flip-flop count is a ceiling of a logarithm, and a
ceiling only changes at a power of two.

### Worked solution B4

Four distinct codes assigned to four distinct states gives

$$4! = 24 \\text{ assignments}$$

It matters because the minimum sum-of-products cost varies across them. On the
1101 detector in this chapter the range is 7 to 18 literals, and the obvious
binary assignment lands at 17.

**Answer: 24 assignments, with more than a factor of two between the best and
the worst.**

**Trap.** Answering $2^{4} = 16$ counts subsets rather than assignments, and
answering 4 counts states. The count is a permutation because each state gets a
distinct code.

### Worked solution B5

| State | On T = 0 | On T = 1 | Output |
|---|---|---|---|
| GREEN | GREEN | YELLOW | green lamp |
| YELLOW | YELLOW | RED | yellow lamp |
| RED | RED | GREEN | red lamp |

The output should be **Moore**. The lamp is a function of the state alone, it
must be steady for the whole interval, and a Mealy output would flicker with the
timer pulse.

**Answer: as tabulated, with Moore outputs.**

**Trap.** Making the output Mealy so it "responds faster" is exactly wrong for
this application. There is nothing to respond to — the lamp should be constant
across the entire state, which is the definition of a Moore output.

### Worked solution B6

A Mealy output follows the input within a cycle, so it can move at any moment
during the cycle. A memory write-enable that moves mid-cycle can produce a write
that was never intended, or a write to an address that is itself still changing.

The check is on the **input** the Mealy output depends on. If that input is
registered in the same clock domain, it settles shortly after the edge and the
enable is stable in time for the memory. If it is combinational or from another
clock domain, it is not.

The fix is a register on the output, which removes the glitch and delays the
enable by one cycle — turning it into the Moore output of the same machine, so
the address and data must be delayed by one cycle to match.

**Answer: check whether the deciding input is registered in the same domain; if
not, register the output and delay the address and data with it.**

**Trap.** Registering only the enable and leaving the address and data
unregistered fixes the glitch and breaks the write, because the enable now
arrives a cycle after the values it was supposed to capture. Whatever pipeline
stage the enable moves into, its companions must move with it.`,
      examTip: 'Design questions almost always want the state table, not the gates. Name the states by what has been matched or accumulated, fill in every row, and only then worry about encoding — the marks are in the table.',
      importantNote: 'Before designing an overlapping and a non-overlapping detector separately, check whether the pattern has a proper prefix that is also a suffix. If it does not, the two machines are identical and there is no second design to do.',
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
| Registers | $<1\\ \\mathrm{KB}$ | ~0.5 ns |
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
| 1 KB | $2^{10}$ | 10 |
| 64 KB | $2^{16}$ | 16 |
| **256 KB** | **$2^{18}$** | **18** |
| 1 MB | $2^{20}$ | 20 |
| 4 GB | $2^{32}$ | 32 |

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
    { id: 'mem-taxonomy', title: '6. The Three Axes That Actually Sort Memory Devices',
      content: `## 6.1 Volatility is the first question, and it is the least interesting

Textbook taxonomies open with volatile against nonvolatile and then stop, which
is why so many candidates can recite that DRAM forgets and flash remembers and
still cannot choose a part. Volatility settles one thing only: whether the
contents survive a power cycle. Two further axes settle everything else, and
both of them appear on the exam disguised as arithmetic.

The second axis is **endurance**, the number of times a storage location may be
rewritten before it stops holding a value. SRAM and DRAM have no practical
limit; a bit can be flipped continuously for the life of the part. Every
floating-gate technology does have a limit, because each program-erase cycle
drives carriers through a thin oxide and leaves a little damage behind. That
single fact is why a design that would be trivial in RAM turns into a wear
budget in flash.

The third axis is **access mode**: what the smallest unit is that you may read,
the smallest you may write, and the smallest you may erase. In SRAM those three
are the same, a word. In DRAM a read moves a whole row. In NAND flash the read
unit is a page of a few kilobytes, the program unit is that same page, and the
erase unit is a block of dozens of pages. Whenever the write unit and the erase
unit differ, a controller has to relocate live data to free a block, and the
system acquires a whole layer of behaviour that has nothing to do with storing
bits.

Two secondary properties fall out of the three axes and deserve names because
questions turn on them. A read is **destructive** when the act of reading
disturbs the stored value, so the value must be written back before the cycle
ends; DRAM is the standard example and it is the reason its cycle time exceeds
its access time. And a technology is **read-write asymmetric** when writing
costs far more time or energy than reading; every nonvolatile memory in the
table below is asymmetric by at least three orders of magnitude.

| Technology | Volatile | Endurance | Read unit | Write unit | Erase unit | Read destructive |
|---|---|---|---|---|---|---|
| SRAM | yes | unlimited | word | word | none | no |
| DRAM | yes | unlimited | row | row | none | **yes** |
| Mask ROM | no | none (read only) | word | not writable | none | no |
| EPROM | no | ~100 cycles | word | word | whole chip (UV) | no |
| EEPROM | no | $10^{5}$ to $10^{6}$ | byte | byte | byte | no |
| NOR flash | no | $10^{4}$ to $10^{5}$ | byte | word or page | block | no |
| NAND flash | no | $10^{3}$ to $10^{5}$ | page | page | block | no |

## 6.2 Capacity arithmetic, stated once so it can be reused

Every sizing question in this chapter rests on three relations. A device with
$n$ address lines resolves

$$N = 2^{\\,n}$$

distinct locations. If each location holds $w$ bits, the part stores

$$B = N \\times w = 2^{\\,n}\\,w$$

bits, and the inverse question, how many address lines a required location
count demands, is

$$n = \\lceil \\log_{2} N \\rceil$$

with the ceiling because address lines come in whole numbers. The ceiling is
not decoration: a system needing 6,000 locations needs 13 lines, and the 2,192
locations it cannot use are the price of the ceiling.

### Worked Example 6.1 — pins and bits of a 512K x 16 part

**Given.** A memory device is catalogued as $512\\mathrm{K} \\times 16$.

**Find.** Address pins, data pins, and total stored bits.

**Work.** The location count is $512\\mathrm{K} = 512 \\times 1024 = 524288$, so

$$n = \\log_{2} 524288 = 19$$

address pins, and the organisation states 16 bits per location, so 16 data
pins. The bit count follows from the second relation:

$$B = 524288 \\times 16 = 8388608 \\text{ bits}$$

**Independent check.** Do it entirely in exponents instead of decimals:
$2^{19} \\times 2^{4} = 2^{23}$, and $2^{23} = 8388608$. The two routes agree,
which they must, and the exponent route is the one to use under time pressure.

**Answer: 19 address pins, 16 data pins, 8,388,608 bits, which is 1 MiB.**

**Trap.** The part is *not* a "512 K memory" in bytes. Organisation is quoted as
locations by width, and a $512\\mathrm{K} \\times 16$ device holds 1 MiB while a
$512\\mathrm{K} \\times 8$ device holds 512 KiB. Reading the first number as the
byte capacity is the single most common slip on organisation questions.

### Worked Example 6.2 — an endurance budget picks the technology

**Given.** A logger appends one 64-byte record every second for a 10-year
service life. Two candidate parts: an EEPROM with a 128-byte page and an
endurance of $10^{6}$ cycles per page, and a NAND flash with a 4 KiB page and
an endurance of $3 \\times 10^{3}$ cycles.

**Find.** Whether either part can survive, and what the EEPROM needs.

**Work.** First the write count. Ten years of seconds is

$$W = 3600 \\times 24 \\times 365 \\times 10 = 315360000$$

writes. If every record landed on the same EEPROM page, that page would take
315 million cycles against an allowance of one million, so it fails by a factor
of 315. Spread the traffic evenly over $P$ pages and each page takes $W/P$
cycles, so survival needs

$$P \\ge \\frac{W}{E} = \\frac{315360000}{1000000} = 315.36$$

which rounds up to 316 pages. At 128 bytes per page that is 40,448 bytes of
EEPROM devoted to rotation. A 64 KiB part holds $65536/128 = 512$ pages, giving
a total allowance of $512 \\times 10^{6}$ cycles against a demand of
$3.1536 \\times 10^{8}$, a margin of 1.62.

**Independent check.** Compute the margin the other way, as an allowance per
second of life. The 64 KiB part offers $5.12 \\times 10^{8}$ page writes over
$3.1536 \\times 10^{8}$ seconds, which is 1.62 writes per second against a
demand of one. Same number, different arithmetic.

**Answer: a 64 KiB EEPROM cycled round its 512 pages survives with 62 % margin;
a single page does not, and neither does un-levelled use of the NAND part.**

**Trap.** Endurance is quoted **per erase unit**, not per device. Dividing the
total write demand by the device capacity, rather than by the number of
independently erasable units, quietly assumes perfect wear levelling, which is
exactly the thing the question is asking you to specify.`,
      examTip: 'Sort every memory question onto the three axes before reaching for a formula. Volatility answers "does it survive power off", endurance answers "how many writes", access mode answers "what is the smallest unit I may touch". Most numeric memory problems are the third axis in disguise.',
      importantNote: 'Organisation is written locations by width. A 512K x 16 part has 19 address pins and holds 1 MiB, not 512 KiB. Read the second number before computing anything.',
    },
    { id: 'mem-sram-cell', title: '7. The SRAM Cell, and Why It Takes Six Transistors',
      content: `## 7.1 Four transistors to remember, two more to reach

A static cell stores its bit in a **latch**: two CMOS inverters wired output to
input, so each one holds the other in place. That is four transistors, and it
is the whole storage mechanism. The value persists with no clock and no
refresh, for as long as the supply holds, because the latch is sitting in one
of its two stable states and is actively driving both nodes.

Four transistors can remember but they cannot be reached. Two more, the
**access transistors**, connect the two internal nodes to a pair of bit lines
under control of a word line, which is why the cell is a **6T** cell and not a
4T one. The pair is not redundancy: the cell is read and written
**differentially**, one bit line carrying the value and the other its
complement, which halves the swing each line must make and rejects noise that
lands on both lines equally.

$$\\text{cells} = 2^{\\,n} \\times w, \\qquad \\text{transistors} = 6 \\times 2^{\\,n} \\times w$$

The two access transistors are also where the design tension lives, because the
same devices serve a read and a write and the two want opposite things. A read
wants weak access transistors, so that the pre-charged bit lines cannot
overpower the latch and flip it. A write wants strong access transistors, so
that the driven bit lines can overpower the latch on purpose. The cell is sized
to sit between those demands, and the sizing is quoted as ratios.

## 7.2 The cell ratio, and what happens when it is one

During a read both bit lines are pre-charged high and the word line rises. On
the side storing a zero, current flows from the bit line, through the access
transistor, into the internal node and down through the driver transistor to
ground. The two devices form a divider, and the internal node that is supposed
to be a solid zero is lifted to

$$V_{0} = V_{DD}\\,\\frac{R_{drv}}{R_{drv} + R_{acc}}$$

Model each transistor in its linear region as a resistance inversely
proportional to its aspect ratio, $R \\propto (W/L)^{-1}$, and define the **cell
ratio**

$$\\mathrm{CR} = \\frac{(W/L)_{drv}}{(W/L)_{acc}}$$

Substituting the resistances gives the form worth remembering:

$$V_{0} = \\frac{V_{DD}}{1 + \\mathrm{CR}}$$

The opposite inverter flips when its input passes its trip point, near
$V_{DD}/2$ for a balanced inverter. Setting $V_{0} = V_{DD}/2$ gives
$\\mathrm{CR} = 1$ exactly, so a cell whose driver and access devices are the
same size sits precisely on the edge of destroying its own contents every time
it is read. Real cells are built with $\\mathrm{CR}$ between 1.2 and 2.

| Cell ratio | $V_{0}/V_{DD}$ | $V_{0}$ at $V_{DD} = 1.0$ V | Read margin to the 0.5 V trip point |
|---|---|---|---|
| 1.0 | 0.500 | 0.500 V | **0 V — the cell flips** |
| 1.2 | 0.455 | 0.455 V | 0.045 V |
| 1.5 | 0.400 | 0.400 V | 0.100 V |
| 2.0 | 0.333 | 0.333 V | 0.167 V |
| 3.0 | 0.250 | 0.250 V | 0.250 V |

This is a first-order resistive model and it is presented as one. It gets the
shape right and the trend right, which is what a design rule needs, and it is
enough to explain why the rule exists at all.

### Worked Example 7.1 — the device count behind 32 KiB of cache

**Given.** A cache data array of 32 KiB, organised $32\\mathrm{K} \\times 8$, in
6T SRAM.

**Find.** Cells, transistors, and the comparison with a 1T1C DRAM array of the
same capacity.

**Work.** Locations and width give the cell count directly:

$$\\text{cells} = 32768 \\times 8 = 262144$$

and the 6T structure multiplies:

$$\\text{transistors} = 6 \\times 262144 = 1572864$$

A DRAM array of the same capacity needs one transistor and one capacitor per
cell, so 262,144 transistors and 262,144 capacitors.

**Independent check.** Work in powers of two: $2^{15} \\times 2^{3} = 2^{18}$
cells, and $6 \\times 2^{18} = 1.5 \\times 2^{20}$, which is 1,572,864. The
device-count ratio is 6 to 1, and because a DRAM cell also packs far tighter
than a latch the area ratio is larger still, roughly 120 $F^{2}$ against
6 $F^{2}$ in the same process generation.

**Answer: 262,144 cells and 1,572,864 transistors, against 262,144 transistors
plus 262,144 capacitors for DRAM.**

**Trap.** The 6T count is the *array* only. Row decoders, column multiplexers,
sense amplifiers and write drivers add to it, and in small arrays that
periphery can rival the array itself. Quoting six transistors per bit as the
whole chip is wrong in the direction that matters for small caches.

### Worked Example 7.2 — sizing a cell so a read cannot destroy it

**Given.** $V_{DD} = 1.0$ V, a balanced inverter with its trip point at 0.5 V,
and a required read margin of at least 0.10 V.

**Find.** The minimum cell ratio.

**Work.** The margin requirement is $0.5 - V_{0} \\ge 0.10$, so
$V_{0} \\le 0.40$ V. From the divider result,

$$\\frac{1.0}{1 + \\mathrm{CR}} \\le 0.40 \\;\\Longrightarrow\\; 1 + \\mathrm{CR} \\ge 2.5$$

so $\\mathrm{CR} \\ge 1.5$.

**Independent check.** Substitute back rather than trusting the rearrangement:
at $\\mathrm{CR} = 1.5$ the node sits at $1.0/2.5 = 0.400$ V, and
$0.500 - 0.400 = 0.100$ V, exactly the requirement. At $\\mathrm{CR} = 1.4$ it
sits at $1.0/2.4 = 0.4167$ V for a margin of 0.083 V, which fails.

**Answer: a cell ratio of at least 1.5, meaning the driver transistors are 1.5
times as wide as the access transistors.**

**Trap.** Raising the cell ratio without limit is not free. A wider driver makes
the cell larger and makes writing harder, because the write must now overpower
a stronger latch. That is why the write path is governed by a separate ratio,
between the access transistor and the load transistor, and why a cell can be
read-stable and write-broken at the same time.`,
      examTip: 'Six transistors decomposes as four for the cross-coupled latch and two for access. If a question asks why SRAM is faster than DRAM, the answer is that the latch is already driving both nodes hard, so no charge sharing and no sense amplifier stand between the cell and the output.',
      importantNote: 'A cell ratio of exactly 1 puts the internal zero node at the inverter trip point, so a read is as likely to flip the cell as to report it. Read stability is a sizing rule, not an afterthought, and it is the reason SRAM cells are not simply built from minimum-size devices.',
    },
    { id: 'mem-dram-cell', title: '8. One Transistor, One Capacitor, and the Price of Both',
      content: `## 8.1 The whole cell is a bucket and a tap

A dynamic cell is a capacitor holding charge and a single transistor connecting
it to a bit line. There is no latch, nothing drives the node, and nothing
restores it. The stored quantity is

$$Q = C_{s} V_{s}$$

and everything awkward about DRAM follows from that quantity being small,
isolated and slowly draining.

Reading works by **charge sharing**. The bit line is pre-charged to $V_{DD}/2$,
the word line rises, and the cell's charge redistributes between $C_{s}$ and
the far larger bit-line capacitance $C_{BL}$. The bit line moves by

$$\\Delta V = V_{s}\\,\\frac{C_{s}}{C_{s} + C_{BL}}$$

where $V_{s}$ is the cell's departure from the pre-charge level. With a cell of
25 fF on a bit line of 250 fF, only one part in eleven of the stored swing
reaches the sense amplifier, which is why a differential sense amplifier is
not an optimisation in DRAM but a requirement.

Charge sharing also empties the bucket. After the share, the cell node sits at
the bit-line voltage, not at its original level, so **the read has destroyed
the stored value**. Every DRAM read therefore ends with the sense amplifier
driving the sensed level back down the bit line into the cell, and that
restore is why the cycle time exceeds the access time:

$$t_{RC} = t_{RAS} + t_{RP}$$

The row-active time $t_{RAS}$ covers sensing and restoring; the pre-charge time
$t_{RP}$ returns the bit lines to $V_{DD}/2$ before the next row.

## 8.2 Leakage, retention, and the refresh interval

Even untouched, the cell drains through the access transistor's subthreshold
and junction leakage. Model the loss as a constant current $I_{leak}$ and the
node falls linearly:

$$V(t) = V_{s} - \\frac{I_{leak}}{C_{s}}\\,t$$

The cell stays readable until its remaining swing produces the sense
amplifier's minimum input. Inverting the charge-sharing relation for a minimum
detectable bit-line step $\\Delta V_{min}$ gives the floor,

$$V_{min} = \\Delta V_{min}\\,\\frac{C_{s} + C_{BL}}{C_{s}}$$

and the time to reach it is the **retention time**

$$t_{ret} = \\frac{C_{s}\\,(V_{s} - V_{min})}{I_{leak}}$$

The refresh interval must sit below $t_{ret}$ with margin, and refresh is
simply a read followed by the restore that a read performs anyway: the array
walks its rows, and each visit re-establishes full charge.

![Left: the fraction of bandwidth a 64 ms refresh window consumes, plotted against rows per bank for a 50 ns and a 350 ns row-refresh time, each point produced by stepping a distributed-refresh schedule and then checked against the closed form. Right: one cell discharging at 100 fA out of 25 fF, crossing the 0.275 V sense floor at 81.25 ms, with the 64 ms refresh point marked.](/courses/fe-ee/figures/dig4-refresh-budget.svg)

## 8.3 What refresh costs, as a fraction of bandwidth

Refreshing $R$ rows, each occupying the bank for $t_{RFC}$, inside a window
$t_{REF}$, blocks the array for $R\\,t_{RFC}$ out of every $t_{REF}$. The
fraction of time, and therefore of peak bandwidth, that never reaches the
processor is

$$f_{ov} = \\frac{R\\,t_{RFC}}{t_{REF}}$$

and the average spacing between refresh commands, the figure a controller
actually programs, is

$$t_{REFI} = \\frac{t_{REF}}{R}$$

The figure above plots $f_{ov}$ for two row-refresh times. Both curves were
produced by stepping a schedule one refresh command at a time across a 64 ms
window and totalling the blocked time, then comparing that total with the
closed form; the two agree to within $10^{-12}$ of each other at every point,
which is the only reason the formula is being offered as a shortcut.

### Worked Example 8.1 — how much signal reaches the sense amplifier

**Given.** $C_{s} = 25$ fF, $C_{BL} = 250$ fF, and a cell driven 0.60 V away
from the pre-charge level.

**Find.** The bit-line step.

**Work.**

$$\\Delta V = 0.60 \\times \\frac{25}{25 + 250} = 0.60 \\times \\frac{25}{275}$$

$$\\Delta V = 0.0545\\ \\mathrm{V} = 54.5\\ \\mathrm{mV}$$

**Independent check.** Conserve charge instead of using the ratio. Before the
share the cell holds $25 \\times 0.60 = 15$ fC of excess charge; after it, that
excess is spread over $25 + 250 = 275$ fF, giving $15/275 = 0.0545$ V. Same
answer from a conservation argument rather than a divider.

**Answer: 54.5 mV, about one eleventh of the stored swing.**

**Trap.** Bit-line capacitance grows with the number of cells on the line, so
making a column longer to save decoder area directly shrinks the sense signal.
That is why arrays are broken into sub-arrays with their own sense amplifiers
rather than built as one tall column.

### Worked Example 8.2 — retention time and the refresh margin

**Given.** The cell of Example 8.1, a sense amplifier needing 25 mV, and a
leakage current of 100 fA.

**Find.** The retention time and the margin over a 64 ms refresh interval.

**Work.** The voltage floor comes from inverting the charge-sharing relation:

$$V_{min} = 0.025 \\times \\frac{275}{25} = 0.275\\ \\mathrm{V}$$

so the usable swing is $0.600 - 0.275 = 0.325$ V and

$$t_{ret} = \\frac{25\\ \\mathrm{fF} \\times 0.325\\ \\mathrm{V}}{100\\ \\mathrm{fA}} = 81.25\\ \\mathrm{ms}$$

The margin over a 64 ms interval is $81.25/64 = 1.27$.

**Independent check.** Take the discharge slope instead. A current of 100 fA out
of 25 fF moves the node by $10^{-13} \\times 10^{-3} / (25 \\times 10^{-15})$
volts per millisecond, which is 4 mV/ms. Dividing the 325 mV budget by 4 mV/ms
gives 81.25 ms. The figure's right-hand panel is that straight line, and the
crossing was read off the plotted curve and compared with this closed form.

**Answer: 81.25 ms retention, a margin of 1.27 over the 64 ms interval.**

**Trap.** Leakage rises steeply with temperature, and the equation says the
retention time is inversely proportional to it. Double the leakage and the
retention halves to 40.6 ms, which is *below* the 64 ms interval — which is
exactly why parts specify a doubled refresh rate above a stated case
temperature rather than a single interval for all conditions.

### Worked Example 8.3 — refresh as a bandwidth tax

**Given.** A bank of 8,192 rows, $t_{RFC} = 350$ ns, a 64 ms refresh window, and
a channel whose peak rate is 12.8 GB/s.

**Find.** The refresh interval, the overhead fraction, and the delivered
bandwidth.

**Work.** The interval between refresh commands is

$$t_{REFI} = \\frac{64\\ \\mathrm{ms}}{8192} = 7.8125\\ \\mathrm{\\mu s}$$

and the blocked fraction is

$$f_{ov} = \\frac{8192 \\times 350\\ \\mathrm{ns}}{64\\ \\mathrm{ms}} = \\frac{2.8672\\ \\mathrm{ms}}{64\\ \\mathrm{ms}} = 0.0448$$

so 4.48 % of the array's time is unavailable. Delivered bandwidth is

$$12.8 \\times (1 - 0.0448) = 12.227\\ \\mathrm{GB/s}$$

**Independent check.** Compute the loss directly and subtract:
$12.8 \\times 0.0448 = 0.5734$ GB/s lost, and $12.8 - 0.5734 = 12.2266$ GB/s
delivered, agreeing to the printed precision.

**Answer: 7.8125 us between refreshes, 4.48 % overhead, 12.227 GB/s delivered.**

**Trap.** The overhead scales with the row count, so a denser part with twice
the rows pays twice the tax at the same $t_{RFC}$ — and $t_{RFC}$ itself grows
with density, which is why refresh overhead has crept up over successive
generations instead of shrinking. Assuming refresh is "a fraction of a percent,
so ignore it" was true at 4,096 rows and 50 ns, where the same formula gives
0.32 %, and is not true now.`,
      examTip: 'DRAM cycle time is access time plus recovery, because the read destroyed the data and the restore has to finish before the next row. Any question that quotes both an access time and a cycle time is testing whether you use the cycle time for throughput and the access time for latency.',
      importantNote: 'Refresh overhead is (rows x t_RFC) / t_REF and nothing else. The trap is using the number of refresh COMMANDS per second instead of the number of rows, or using the burst length instead of t_RFC; both give an answer that is wrong by a factor of the rows per command.',
    },
    { id: 'mem-nonvolatile', title: '9. ROM to Flash: What Each Technology Can Actually Do',
      content: `## 9.1 The family, ordered by who gets to write it and how often

The nonvolatile family is usually presented as a history lesson. It is more
useful as a sequence of answers to one question: at what point in the product's
life, and by what physical mechanism, does a bit get set?

- **Mask ROM.** The pattern is a photomask. Contents are fixed when the wafer is
  made, cost per bit is the lowest of any technology at volume, and the tooling
  charge and the several-week turnaround are paid whether the code is right or
  not.
- **PROM.** Shipped blank with a fusible link at every cell; a programmer blows
  the links for the required pattern. One time only, because a blown fuse does
  not grow back.
- **EPROM.** A floating gate is charged by hot-electron injection during
  programming and discharged by ultraviolet light through a quartz window.
  Erase is all-or-nothing across the whole die and takes minutes.
- **EEPROM.** The same floating gate, but charged and discharged by
  Fowler-Nordheim tunnelling through a thin oxide, which needs only a voltage
  and so can be done in circuit, one byte at a time.
- **Flash.** EEPROM economics with the byte-erase circuitry removed. Erase is
  performed on a whole block at once, which is what makes the cell small enough
  to be worth building in gigabytes.

The progression is a single trade repeated: each step gives up erase
granularity or endurance and buys density and in-system writability.

## 9.2 NAND against NOR: the array topology decides the operations

Both flash types use the same cell. They differ in how the cells are wired to
the bit line, and that one choice propagates into every operation the part
supports.

In **NOR** flash each cell hangs directly on the bit line, so any cell can be
pulled down individually and any address can be read on its own. That makes NOR
randomly addressable and lets a processor fetch instructions straight out of it,
the property normally called execute-in-place. The cost is the contact each cell
needs to the bit line, which is most of why a NOR cell occupies roughly ten
square feature sizes.

In **NAND** flash the cells are wired in series, thirty-two or more to a string,
with one contact at each end of the string. Cell area falls to roughly four
square feature sizes, but no cell can be read alone: the whole string must be
turned on, and the array is read a page at a time into an internal register and
then streamed out.

| Operation | NOR | NAND |
|---|---|---|
| Read one arbitrary byte | direct, one access | load the whole page first |
| Execute code in place | yes | no, must be copied to RAM |
| Program granularity | word or page | page |
| Erase granularity | block | block |
| Relative cell area | about 10 $F^{2}$ | about 4 $F^{2}$ |
| Typical role | boot code, small tables | bulk storage, file systems |

Put numbers on the read behaviour with a stated model. Reading $n$ bytes from
NOR costs one random access each,

$$t_{NOR}(n) = n\\,t_{acc}$$

while NAND pays a page-load penalty once and then streams,

$$t_{NAND}(n) = t_{R} + n\\,t_{ser}$$

Setting the two equal gives the burst length at which the page-oriented part
overtakes the byte-oriented one:

$$n^{*} = \\frac{t_{R}}{t_{acc} - t_{ser}}$$

![Time to deliver a burst of n bytes from NOR flash at 70 ns per random byte and from NAND flash with a 25 us page load followed by 25 ns per streamed byte. The lines cross at 556 bytes, the first integer at which the NAND expression is the smaller of the two.](/courses/fe-ee/figures/dig4-nand-nor.svg)

## 9.3 Endurance, write amplification and wear levelling

A block that has been erased three thousand times in a part rated for three
thousand cycles is finished, and if the file system happens to keep its
allocation table in that block, the whole device is finished with it. Two
mechanisms stand between the raw endurance number and the drive's service life.

**Write amplification** is the ratio of flash bytes actually written to host
bytes requested. It exceeds one because a partially valid block must have its
live pages copied elsewhere before it can be erased. Total host writes before
exhaustion are therefore

$$W_{host} = \\frac{C\\,E}{\\mathrm{WA}}$$

for capacity $C$, endurance $E$ and write amplification $\\mathrm{WA}$.

**Wear levelling** is the mapping layer that keeps the erase counts even. Its
value is not subtle, and it can be measured rather than asserted. Take a
thousand-block device in which nine writes out of ten land on a hundred hot
blocks. Under a static map the busiest block absorbs $0.9/100$ of every write
and reaches its limit while the other nine hundred blocks are barely touched.
Under levelling every erase is spent on the least-worn block, so the device
survives until the entire budget is gone. The gain is the ratio of the two
lifetimes,

$$G = \\frac{N_{blocks}\\,E}{E/p_{max}} = N_{blocks}\\,p_{max}$$

where $p_{max}$ is the largest per-write probability any single block carries.

![Erase counts across a thousand-block device at the instant a statically mapped drive loses its first block, after 333,223 host writes. The static map has spent its hundred hot blocks entirely while the nine hundred cold ones show 37 erases each; a wear-levelled map at the same instant shows 333 erases on every block, 11 percent of the budget.](/courses/fe-ee/figures/dig4-flash-wear.svg)

### Worked Example 9.1 — where NAND overtakes NOR

**Given.** NOR delivers a random byte in 70 ns. NAND loads a page in 25 us and
then streams at 25 ns per byte.

**Find.** The burst length at which NAND becomes the faster choice.

**Work.** Equate the two models:

$$70\\,n = 25000 + 25\\,n$$

$$45\\,n = 25000 \\;\\Longrightarrow\\; n^{*} = 555.6$$

so from 556 bytes onward NAND wins.

**Independent check.** Evaluate both expressions on either side of the boundary
rather than trusting the algebra. At $n = 555$: NOR needs
$70 \\times 555 = 38850$ ns and NAND needs $25000 + 25 \\times 555 = 38875$ ns,
so NOR is ahead by 25 ns. At $n = 556$: NOR needs
$70 \\times 556 = 38920$ ns and NAND needs $25000 + 25 \\times 556 = 38900$ ns,
so NAND is ahead by 20 ns. The crossing sits between them, as the algebra said.

**Answer: 556 bytes.**

**Trap.** The crossing point is a property of the *burst*, not of the part. A
processor fetching four-byte instructions at random addresses is on the far
left of that plot forever, which is why boot code lives in NOR even in a system
whose bulk storage is NAND.

### Worked Example 9.2 — the endurance life of a drive

**Given.** A 256 GB drive built from cells rated at 3,000 program-erase cycles,
with a write amplification of 1.4, in service at 20 GB of host writes per day.

**Find.** Total host writes and the service life.

**Work.** The endurance budget in flash bytes is
$256 \\times 10^{9} \\times 3000 = 7.68 \\times 10^{14}$, and dividing by the
amplification converts it to host bytes:

$$W_{host} = \\frac{7.68 \\times 10^{14}}{1.4} = 5.4857 \\times 10^{14}\\ \\text{bytes}$$

which is 548.6 TB. At $2 \\times 10^{10}$ bytes per day,

$$\\frac{5.4857 \\times 10^{14}}{2 \\times 10^{10}} = 27429\\ \\text{days} = 75.1\\ \\text{years}$$

**Independent check.** Go the other way and ask how many full-drive overwrites
that is: 548.6 TB divided by 256 GB is 2,143 drive fills, and multiplying by the
amplification of 1.4 returns $2143 \\times 1.4 = 3000$ cycles, the rated
endurance. The round trip closes.

**Answer: 548.6 TB written, about 75 years at 20 GB per day.**

**Trap.** That comfortable answer assumes perfect levelling. Remove it and the
life collapses by the concentration factor of the traffic, which the next
example measures.

### Worked Example 9.3 — what levelling is worth on skewed traffic

**Given.** A device of 1,000 blocks with an endurance of 3,000 cycles. Nine
writes in ten fall on a set of 100 hot blocks, evenly within that set; the
remaining one in ten spreads over the other 900.

**Find.** The lifetime with and without wear levelling.

**Work.** Each hot block carries $p_{max} = 0.9/100 = 0.009$ of the traffic, so
under a static map its limit arrives after

$$\\frac{E}{p_{max}} = \\frac{3000}{0.009} = 333333\\ \\text{writes}$$

Under levelling the whole budget is available:

$$N_{blocks}\\,E = 1000 \\times 3000 = 3000000\\ \\text{writes}$$

and the gain is

$$G = \\frac{3000000}{333333} = 9.0$$

**Independent check.** The traffic was also stepped one write at a time through
a round-robin schedule with exactly this distribution, and the first block
reached 3,000 erases at write 333,223 — 0.033 % below the closed form, the
difference being that a round robin cannot land exactly on the boundary. At
that instant the levelled map had used 333 of 3,000 cycles on every block,
11.1 % of its life, which is the figure above.

**Answer: 333,333 writes without levelling against 3,000,000 with it, a factor
of 9.**

**Trap.** The gain equals $N_{blocks}\\,p_{max}$, so it depends entirely on how
concentrated the traffic is. Uniform traffic already has $p_{max} = 1/N$ and
levelling buys nothing; the more skewed the workload, the more it buys. Quoting
"wear levelling multiplies life by the block count" ignores the $p_{max}$ term
and overstates the gain by a factor of ten here.`,
      examTip: 'NOR is random access and executes in place; NAND is page access and is cheaper per bit. If a question mentions booting, running code from the part, or reading a single byte, the answer is NOR. If it mentions files, pages, blocks or gigabytes, it is NAND.',
      importantNote: 'Endurance limits ERASE cycles per block, not writes per device. Converting a device-level write budget into a life expectancy requires both the write amplification and an assumption about levelling, and stating neither is the commonest way to get an answer that is off by an order of magnitude.',
    },
    { id: 'mem-decoding', title: '10. Address Decoding, Enumerated Rather Than Argued',
      content: `## 10.1 What a decode has to guarantee

A memory map is correct when every address in the processor's space is answered
by at most one device, and when every address the software expects to work is
answered by exactly one. Those are two separate failures — an **overlap**, where
two devices drive the bus at once, and a **hole**, where nothing responds — and
a design can contain both at the same time.

Address lines split into two groups. The low $d$ lines go to the device's own
address pins, where $d$ is fixed by the part's depth, $2^{d}$ locations. The
remaining high lines are available to the decode logic, and what happens to them
is the entire subject.

**Full decoding** uses every remaining high line. Each device's chip select is a
product term over all of them, so the device answers in exactly one window of
$2^{d}$ addresses and nowhere else. **Partial decoding** ignores one or more high
lines. The device then answers whenever the lines that *are* decoded match,
regardless of the ignored ones, so it appears repeatedly across the space.

The number of images is the ratio of the window the decode carves out to the
size of the part inside it:

$$M = \\frac{2^{\\,h}}{2^{\\,d}} = 2^{\\,h-d}$$

where $h$ counts the address lines the decode leaves free. Consecutive images
are separated by

$$\\text{stride} = 2^{\\,d}$$

![Top: a full decode of a 64 KiB space into four 16 KiB devices, plotted as the responding device against address, showing four contiguous blocks with no gap and no overlap. Bottom: a partial decode in which an 8 KiB ROM and a 2 KiB RAM each occupy a 32 KiB window, plotted as the offset reached inside each part, so the four ROM images and sixteen RAM images appear as repeated ramps.](/courses/fe-ee/figures/dig4-decode-aliasing.svg)

Both panels were produced by walking all 65,536 addresses and recording, for
each one, which devices asserted select and which internal offset was reached.
The full-decode map came back with zero holes, zero overlaps and 65,536
singly-served addresses, with block edges at 0x0000, 0x4000, 0x8000 and 0xC000.
The partial map also came back with zero holes and zero overlaps — partial
decoding is not in itself a fault — but the 8,192 ROM cells were each reachable
at exactly four addresses, on a stride of 0x2000, and the 2,048 RAM cells at
exactly sixteen, on a stride of 0x0800. Those multiplicities were counted from
the map, not deduced from the formula, and they match it.

## 10.2 Deriving a chip select from a required window

The mechanical procedure is to write the first and last address of the required
window in binary, keep the bits that are identical across both, and form a
product term from them. Everything that varies belongs to the device.

For a 4 KiB part placed at 0xE000 the window runs 0xE000 to 0xEFFF:

| Address | A15 A14 A13 A12 | A11 to A0 |
|---|---|---|
| 0xE000 | 1 1 1 0 | all zero |
| 0xEFFF | 1 1 1 0 | all one |

The top four bits are constant, the bottom twelve vary, and $2^{12} = 4096$ is
the part's depth, which confirms the split. The select is the product term over
the constant bits:

$$CS = A_{15}\\,A_{14}\\,A_{13}\\,\\overline{A_{12}}$$

Devices with an active-low select take the complement of that expression, which
by De Morgan is a NAND of the same four literals.

## 10.3 Auditing a map instead of trusting it

The audit is mechanical too: evaluate every device's select expression at every
address and count responders. Anything other than exactly one is a defect. The
figure below shows a decode that fails in both directions at once — a ROM
selected by $\\overline{A_{15}}$ and a RAM selected by $A_{14}$, which is the
shape a partial decode takes when the two devices' select expressions were
chosen independently.

![Top: an audit of a 64 KiB space in which the ROM is selected by A15 low and the RAM by A14 high, showing 32,768 addresses with a single responder, a 16 KiB region from 0x4000 where both respond, and a 16 KiB region from 0x8000 where neither does. Bottom: the address budget of a 1 MiB slot decode, in which a 256-byte UART occupies a whole 131,072-address slot and five slots totalling 655,360 addresses are unmapped.](/courses/fe-ee/figures/dig4-map-audit.svg)

### Worked Example 10.1 — a chip select for a 2 KiB device at 0x8800

**Given.** A 64 KiB address space, $A_{15}$ down to $A_{0}$, and a 2 KiB device
that must occupy 0x8800 through 0x8FFF, fully decoded.

**Find.** The device's own address lines and the select expression.

**Work.** A 2 KiB part has $\\log_{2} 2048 = 11$ address lines, $A_{10}$ down to
$A_{0}$. That leaves $A_{15}$ down to $A_{11}$, five lines, for the decode.
Write the window's endpoints in binary, low address first:

$$1000\\,1000\\,0000\\,0000 \\qquad \\text{and} \\qquad 1000\\,1111\\,1111\\,1111$$

The top five bits are 10001 in both, so

$$CS = A_{15}\\,\\overline{A_{14}}\\,\\overline{A_{13}}\\,\\overline{A_{12}}\\,A_{11}$$

**Independent check.** Count what the term selects. Five literals fixed out of
sixteen address bits leaves eleven free, so the term is true for $2^{11} = 2048$
addresses, which is the part's depth — a select that matched more or fewer
addresses than the part has locations would be wrong by construction. The same
count was also obtained by evaluating the expression at all 65,536 addresses,
where it was true 2,048 times and false everywhere else.

**Answer: 11 device address lines, and $CS = A_{15}\\overline{A_{14}}\\,\\overline{A_{13}}\\,\\overline{A_{12}}A_{11}$.**

**Trap.** Checking only that the expression is true at the first address is not
an audit. An expression that is true at 0x8800 but omits $A_{11}$ is also true
at 0x8000, and the resulting device answers a window twice its size — half of
which is somebody else's.

### Worked Example 10.2 — counting the aliases a lazy decode creates

**Given.** A 2 KiB RAM whose select is driven by $A_{15}$ alone, in a 64 KiB
space.

**Find.** How many addresses reach each RAM cell, and on what stride.

**Work.** The decode uses one line and the part uses eleven, so four lines,
$A_{14}$ down to $A_{11}$, are ignored. The window is
$2^{15} = 32768$ addresses and the part is $2^{11} = 2048$, so

$$M = \\frac{32768}{2048} = 16$$

images, separated by $2^{11} = 2048$ addresses, which is 0x0800.

**Independent check.** The full 64 KiB space was walked and every address's
internal offset recorded. Each of the 2,048 offsets appeared in exactly sixteen
addresses, and every gap between consecutive addresses reaching the same offset
was 0x0800 — a single stride value across all 2,048 cells, with no exceptions.

**Answer: 16 images per cell, on a 2 KiB stride, filling 0x8000 to 0xFFFF.**

**Trap.** Aliases are invisible until something else needs those addresses.
Writing at 0x8000 and reading back at 0x8000 works perfectly; the failure
arrives the day a second device is mapped at 0xA000 and the two silently
overlap. Partial decoding is a decision to spend address space to save gates,
and it has to be documented as one.

### Worked Example 10.3 — auditing a decode that both clashes and holes

**Given.** A 64 KiB space with a 16 KiB ROM selected whenever $A_{15} = 0$, and
a 16 KiB RAM selected whenever $A_{14} = 1$.

**Find.** The regions of contention and the regions with no responder.

**Work.** Both conditions hold when $A_{15} = 0$ and $A_{14} = 1$, which is the
address range with top bits 01, that is 0x4000 to 0x7FFF. Neither holds when
$A_{15} = 1$ and $A_{14} = 0$, top bits 10, that is 0x8000 to 0xBFFF. Each
region is

$$2^{14} = 16384\\ \\text{addresses}$$

**Independent check.** Every address in the space was evaluated against both
expressions and the responders counted. The result was 32,768 addresses with a
single responder, 16,384 with two, and 16,384 with none, and the two-responder
set ran from 0x4000 to 0x7FFF while the empty set ran from 0x8000 to 0xBFFF —
exactly the ranges the Boolean argument predicted, and the counts sum to 65,536.

**Answer: contention over 0x4000 to 0x7FFF and a hole over 0x8000 to 0xBFFF,
16,384 addresses each.**

**Trap.** Contention is not a soft failure. Two devices driving opposite levels
onto the same bus wire is a short between the supply rails through two output
stages, which is a thermal problem as well as a logical one. This is the defect
that a decode audit exists to catch, and it is why the audit is a walk of the
space rather than a reading of the schematic.`,
      examTip: 'Write the first and last address of the required window in binary, keep the bits that agree, and that product term is the chip select. The number of bits that vary must equal the log base two of the part depth; if it does not, one of the two numbers is wrong.',
      importantNote: 'Partial decoding is not a bug by itself; it is a deliberate trade of address space for gates. It becomes a bug the moment a second device is placed inside one of the alias windows, which is why any partially decoded map has to record the alias range, not just the base address.',
    },
    { id: 'mem-expand-2', title: '11. Expansion Arithmetic in Both Directions',
      content: `## 11.1 Two divisions and a multiplication

Section 5.1 built a 64K x 8 memory from 16K x 4 parts. The arithmetic behind it
generalises to three relations that answer every expansion question, and they
are worth writing down separately because candidates routinely merge them and
get a chip count that is off by the width factor.

Chips per bank, set by the data bus:

$$C = \\frac{D_{sys}}{D_{chip}}$$

Banks, set by the depth:

$$B = \\frac{N_{sys}}{N_{chip}}$$

Total parts:

$$T = C \\times B$$

The address lines divide in the same way the decode of Section 10 divides them.
Each chip receives $\\log_{2} N_{chip}$ low lines in parallel; the remaining
$\\log_{2} B$ high lines drive a decoder whose outputs are the bank selects.

$$\\log_{2} N_{sys} = \\log_{2} N_{chip} + \\log_{2} B$$

That identity is the check to run before wiring anything: if the low lines plus
the decoder inputs do not add up to the system's address width, one of the three
numbers is wrong.

| Direction | What it changes | What is shared | What differs |
|---|---|---|---|
| Width | bits per location | address lines, all control | data bits carried |
| Depth | number of locations | address lines below the split, data bus | chip select |

The 64K x 8 array of Section 5.1 was also checked by walking its whole address
space: each of the 65,536 addresses was mapped to a bank and an offset, and the
result was a bijection onto the 4 banks by 16,384 offsets, with exactly 16,384
addresses in each bank and both half-width chips participating at every address.
No address reached two banks and none reached none.

### Worked Example 11.1 — 256K x 16 from 64K x 8 parts

**Given.** A system needing 262,144 locations of 16 bits, built from parts
organised 65,536 locations of 8 bits.

**Find.** The chip count, the address split and the decoder width.

**Work.** Width first:

$$C = \\frac{16}{8} = 2$$

chips per bank. Then depth:

$$B = \\frac{262144}{65536} = 4$$

banks, so

$$T = 2 \\times 4 = 8$$

parts. Each chip has $\\log_{2} 65536 = 16$ address pins fed by $A_{15}$ down to
$A_{0}$; the system needs $\\log_{2} 262144 = 18$ lines, so $A_{17}$ and
$A_{16}$ are left over and drive a 2-to-4 decoder.

**Independent check.** Total the bits both ways. The system holds
$262144 \\times 16 = 4194304$ bits; the eight parts hold
$8 \\times 65536 \\times 8 = 4194304$ bits. They agree, so no part is unaccounted
for. The address identity closes too: $16 + 2 = 18$.

**Answer: 8 parts in 4 banks of 2, sixteen address lines to every chip, and a
2-to-4 decoder on A17 and A16.**

**Trap.** Dividing the system's total bit count by the chip's total bit count
gives 8 here and happens to be right, but only because the width factor divided
evenly. Ask for 256K x 12 from the same parts and the bit-count shortcut gives
6 chips, which cannot be arranged; the two-division method gives
$C = 1.5$, which correctly signals that the requirement cannot be met with 8-bit
parts without wasting bits.

### Worked Example 11.2 — the decoder is fixed by the bank count alone

**Given.** A 1 MiB byte-wide memory assembled from 128K x 8 parts.

**Find.** The organisation and the decoder.

**Work.** The data bus is 8 bits and so is the part, so $C = 1$: no width
expansion at all. Depth gives

$$B = \\frac{1048576}{131072} = 8$$

banks, so $T = 8$ parts. Each part takes $\\log_{2} 131072 = 17$ lines,
$A_{16}$ down to $A_{0}$, and the decoder takes $\\log_{2} 8 = 3$ lines,
$A_{19}$ down to $A_{17}$: a 3-to-8 decoder.

**Independent check.** The identity $17 + 3 = 20$ matches
$\\log_{2} 1048576 = 20$. The same map was then walked address by address in
Section 15, where the 3-to-8 slot decode produced exactly 131,072 addresses per
slot with no overlaps.

**Answer: 8 parts, no width expansion, 17 lines to each part, and a 3-to-8
decoder on A19 to A17.**

**Trap.** A decoder input count is $\\log_{2} B$, never $\\log_{2} T$. With width
expansion the two differ, and using the chip count gives a decoder that is one
or more bits too wide and a map with unreachable banks.`,
      examTip: 'Do the two divisions separately and label them: bus width over chip width gives chips per bank, system depth over chip depth gives banks. Multiply last. Then check that chip address lines plus decoder inputs equals the system address width before you answer.',
      importantNote: 'Width expansion shares every address and control line and splits only the data bus; depth expansion shares the data bus and splits only the chip select. Mixing the two up produces a memory that appears to work at low addresses and fails above the first bank boundary.',
    },
    { id: 'mem-timing', title: '12. Timing: Access, Cycle, Setup and Hold',
      content: `## 12.1 Four numbers, and why access time is the least useful

**Access time** is the delay from a stimulus to valid data. It is quoted from
several stimuli — from address valid, from chip enable, from output enable — and
the effective one is whichever finishes last.

**Cycle time** is the shortest interval between the starts of two consecutive
accesses. It is at least the access time, and exceeds it by whatever recovery
the array needs:

$$t_{cyc} \\ge t_{acc} + t_{rec}$$

In static memory the recovery is small; in DRAM it is the restore-and-precharge
of Section 8.1 and it is substantial. A part quoting a 50 ns access time and a
90 ns cycle time supports $1/90\\ \\mathrm{ns} = 11.1$ million accesses per
second, not the 20 million its access time suggests. Latency and throughput are
different questions and they read different numbers.

**Setup time** is how long data must be stable before the sampling edge;
**hold time** is how long it must remain stable after it. At a memory interface
those constraints run in both directions: the controller must satisfy the
memory's setup and hold on a write, and the memory must satisfy the
controller's on a read.

## 12.2 A read cycle, walked

Take an asynchronous static RAM with an address access time of 55 ns and an
output hold of 10 ns after the address changes, driven by a controller with a
10 ns input setup requirement and a 5 ns hold requirement, on a 100 ns bus
cycle.

![A read cycle and a write cycle drawn against a common time axis. In the read cycle the address goes valid at 0 ns, chip enable falls at 5 ns, output enable at 20 ns, data becomes valid at 55 ns and is latched at 90 ns, leaving a 35 ns setup margin. In the write cycle the write enable pulse runs from 25 ns to 90 ns against a 35 ns requirement and the data is driven from 30 ns to 100 ns, giving a 60 ns data setup against a 20 ns requirement.](/courses/fe-ee/figures/dig4-cycle-timing.svg)

Read the margins off the definitions rather than the picture. The controller
samples at the end of the cycle and needs data stable $t_{su}$ before that
instant, so the latest acceptable moment for data to become valid is
$T_{cyc} - t_{su}$, and the margin is

$$m_{su} = (T_{cyc} - t_{su}) - t_{AA} = (100 - 10) - 55 = 35\\ \\mathrm{ns}$$

The data survives $t_{OH}$ past the end of the cycle, while the controller needs
it for $t_{h}$ past the sampling edge, so

$$m_{h} = t_{OH} - t_{h} = 10 - 5 = 5\\ \\mathrm{ns}$$

Both are positive, so the cycle is legal — and both were also recomputed by
sampling the data-valid interval on a 0.05 ns grid and finding its first valid
point, which landed on 55 ns exactly.

## 12.3 A write cycle, walked

A write has more windows to satisfy because the memory latches on an edge and
needs the address, the data and the pulse itself to be in the right relationship
to that edge. Five requirements matter, and each is an actual duration compared
with a required minimum.

| Window | What it constrains | Required | Actual in this cycle | Margin |
|---|---|---|---|---|
| $t_{WP}$ | write pulse width | 35 ns | 65 ns | 30 ns |
| $t_{DW}$ | data setup to end of write | 20 ns | 60 ns | 40 ns |
| $t_{DH}$ | data hold after end of write | 0 ns | 10 ns | 10 ns |
| $t_{AW}$ | address valid to end of write | 40 ns | 90 ns | 50 ns |
| $t_{AS}$ | address setup before write starts | 0 ns | 25 ns | 25 ns |

Every one of those actual values is a difference between two edge times in the
figure, and all five margins were computed from those edge times and asserted
non-negative before the figure was drawn.

## 12.4 Wait states

A synchronous bus can only end a transfer on a clock edge, so a slow memory is
accommodated by inserting whole clock periods. If a transfer occupies a base of
$N_{0}$ clocks and $W$ wait states are added, the requirement is

$$(N_{0} + W)\\,T_{clk} - t_{su} \\ge t_{acc}$$

which rearranges to

$$W \\ge \\frac{t_{acc} + t_{su}}{T_{clk}} - N_{0}$$

with $W$ rounded up to an integer and floored at zero.

### Worked Example 12.1 — how many wait states

**Given.** A 50 MHz bus, a two-clock base transfer, a memory with
$t_{acc} = 55$ ns and a controller needing $t_{su} = 10$ ns.

**Find.** The minimum wait-state count and the resulting cycle time.

**Work.** The clock period is $T_{clk} = 1/50\\ \\mathrm{MHz} = 20$ ns. Then

$$W \\ge \\frac{55 + 10}{20} - 2 = 3.25 - 2 = 1.25$$

so $W = 2$, giving a four-clock transfer of 80 ns.

**Independent check.** Test the candidate rather than trusting the inequality.
With $W = 2$ the transfer is $4 \\times 20 = 80$ ns, data is needed by
$80 - 10 = 70$ ns and arrives at 55 ns, so it fits with 15 ns to spare. With
$W = 1$ the transfer is 60 ns, data is needed by 50 ns and arrives at 55 ns, so
it misses by 5 ns. Two wait states is the minimum.

**Answer: 2 wait states, an 80 ns bus cycle.**

**Trap.** The design in the figure uses three wait states and a 100 ns cycle,
which is not an error — it buys the 35 ns margin computed above instead of 15 ns.
The minimum wait-state count and the chosen wait-state count are different
questions, and a question that supplies a temperature range or a margin
requirement is asking the second one.

### Worked Example 12.2 — auditing a write cycle against five windows

**Given.** The write cycle drawn above: address valid from 0 to 100 ns, write
enable asserted from 25 to 90 ns, data driven from 30 to 100 ns. The part
requires $t_{WP} \\ge 35$, $t_{DW} \\ge 20$, $t_{DH} \\ge 0$, $t_{AW} \\ge 40$
and $t_{AS} \\ge 0$ nanoseconds.

**Find.** Whether the cycle is legal, and which window is tightest.

**Work.** Each actual value is a difference of edge times:

$$t_{WP} = 90 - 25 = 65, \\qquad t_{DW} = 90 - 30 = 60, \\qquad t_{DH} = 100 - 90 = 10$$

$$t_{AW} = 90 - 0 = 90, \\qquad t_{AS} = 25 - 0 = 25$$

Subtracting the requirements gives margins of 30, 40, 10, 50 and 25 ns. All are
positive, so the cycle is legal, and the tightest is the data hold at 10 ns.

**Independent check.** Ask what would break first if the whole data phase were
delayed. Delaying the data by 10 ns leaves $t_{DW}$ at 50 ns, still legal, but
pushes the data release to 110 ns, which extends $t_{DH}$ rather than shortening
it; delaying the *release* is what shortens nothing, whereas releasing the data
early is what kills $t_{DH}$. Releasing at 95 ns instead of 100 leaves
$t_{DH} = 5$ ns, and at 90 ns it is zero. So the hold window has 10 ns of slack
against early release, which is the sense in which it is tightest.

**Answer: legal on all five windows, with the 10 ns data hold the least
comfortable.**

**Trap.** Timing a write from the *falling* edge of write enable is the classic
error. The array latches on the rising edge, so $t_{DW}$ and $t_{AW}$ are both
measured to the end of the pulse; measuring them from the start makes a failing
cycle look comfortable.`,
      examTip: 'Use cycle time for throughput and access time for latency, and never the other way round. A part with a 50 ns access time and a 90 ns cycle time delivers 11.1 million accesses per second, and answering 20 million is the intended distractor.',
      importantNote: 'A write is latched on the RISING edge of write enable, so data setup and address setup are measured to the end of the pulse, not to its beginning. Every write-timing question is built on that one convention.',
    },
    { id: 'mem-interleave', title: '13. Interleaving and Banking',
      content: `## 13.1 Why more banks help, and where they stop helping

A single memory bank cannot start a new access until the previous one has fully
recovered, so its access rate is capped at $1/t_{RC}$ however wide the bus is.
Splitting the array into $B$ independent banks lets accesses to different banks
overlap, and the array rate rises to $B/t_{RC}$ — until the bus, which can only
carry one word every $t_{B}$, becomes the constraint. The steady-state rate is
therefore

$$r = \\min\\!\\left(\\frac{1}{t_{B}},\\ \\frac{B}{t_{RC}}\\right)$$

and the gain over a single bank is

$$G = \\frac{r}{1/t_{RC}} = \\min\\!\\left(B,\\ \\frac{t_{RC}}{t_{B}}\\right)$$

The saturation point is the bank count at which the two terms are equal:

$$B^{*} = \\frac{t_{RC}}{t_{B}}$$

![Measured throughput against bank count, relative to a single bank, for a 60 ns bank cycle time and a 10 ns bus transfer time. The measured curve follows the ideal one-bank-per-gap line up to six banks and is flat at a gain of six beyond it, because the bus rather than the array has become the limit.](/courses/fe-ee/figures/dig4-interleave-gain.svg)

Each point on that curve came from stepping an access schedule: banks were
issued round robin, each bank was marked busy for $t_{RC}$ after being started,
the bus was allowed one issue every $t_{B}$, and the steady-state issue spacing
was measured over a whole number of rounds. The measured spacing matched
$\\max(t_{B},\\,t_{RC}/B)$ to within $10^{-12}$ at every bank count, which is
what licenses the closed form above.

## 13.2 Which address bits choose the bank

Two placements exist and they behave completely differently.

**Low-order interleaving** takes the bank number from the least significant
$\\log_{2} B$ address bits. Consecutive addresses then land in consecutive banks,
so a sequential burst spreads across all of them and gets the full gain. This is
what an interleaved main memory does.

**High-order banking** takes the bank number from the most significant bits, so
each bank owns a contiguous region. A sequential burst stays inside one bank and
gets no gain at all — but the regions are contiguous, which is exactly what you
want when a bank is a separate device that must occupy a stated address range.

| Placement | Bank bits | Sequential burst | Natural use |
|---|---|---|---|
| Low-order interleave | least significant | spreads over all banks | bandwidth |
| High-order banking | most significant | stays in one bank | address mapping |

Both placements were checked by walking a 16-bit space with four banks. Each is
a bijection onto (bank, row) pairs, so neither loses or duplicates an address.
Under low-order interleaving no two consecutive addresses share a bank, at any
point in the space; under high-order banking 65,532 of the 65,535 consecutive
pairs share a bank, the three exceptions being the bank boundaries themselves.

### Worked Example 13.1 — banks needed for a bandwidth target

**Given.** A bank cycle time of 60 ns, a bus that carries one 8-byte word every
10 ns, and a target of 800 MB/s.

**Find.** The bank count required, and whether more would help.

**Work.** A single bank delivers 8 bytes per 60 ns:

$$\\frac{8}{60 \\times 10^{-9}} = 133.3\\ \\mathrm{MB/s}$$

so the target needs a gain of $800/133.3 = 6$. From the gain relation,
$G = \\min(B, 60/10) = \\min(B, 6)$, so $B = 6$ banks reach it and nothing
larger improves on it.

**Independent check.** Compute the bus ceiling independently: 8 bytes every
10 ns is $8/(10 \\times 10^{-9}) = 800$ MB/s, which is the target exactly. The
target is the bus limit, so six banks is both necessary and sufficient — and the
stepped schedule reported a gain of exactly 6.000 at six banks and again at
twelve, confirming the plateau.

**Answer: 6 banks; additional banks add nothing because the bus saturates.**

**Trap.** Reading the gain as $B$ without the minimum is the intended error. It
gives 12 banks for a 1600 MB/s target that the bus cannot deliver at any bank
count, and the correct answer to that question is that the target is
unreachable without a wider or faster bus.

### Worked Example 13.2 — assigning the bank-select bits

**Given.** A 64 KiB space, four banks, and a requirement that a sequential burst
use every bank.

**Find.** Which address bits select the bank, and how many rows each bank holds.

**Work.** Four banks need $\\log_{2} 4 = 2$ select bits, and the sequential
requirement forces low-order interleaving, so the bits are $A_{1}$ and $A_{0}$.
Each bank then holds

$$\\frac{65536}{4} = 16384\\ \\text{locations}$$

addressed by $A_{15}$ down to $A_{2}$.

**Independent check.** The mapping was enumerated over all 65,536 addresses.
Every (bank, row) pair occurred exactly once, so the assignment loses nothing,
and the bank index changed at every single one of the 65,535 steps from one
address to the next, which is the sequential-spread property the requirement
asked for.

**Answer: A1 and A0 select the bank; each bank holds 16,384 locations addressed
by A15 down to A2.**

**Trap.** Low-order interleaving and high-order banking are not interchangeable
even though both are bijections. Choosing the high bits here still stores every
byte correctly and still passes a memory test, and delivers a gain of one on
exactly the workload the design was meant to accelerate.`,
      examTip: 'Interleaving gain is the minimum of the bank count and the ratio of bank cycle time to bus transfer time. Compute both terms and take the smaller; the question is usually set so that the second term is the binding one.',
      importantNote: 'Low-order bits for bandwidth, high-order bits for address maps. Using high-order bits and then expecting interleaving gain is a design that tests clean and performs like a single bank.',
    },
    { id: 'mem-ecc', title: '14. Parity and ECC, Verified by Injecting Every Fault',
      content: `## 14.1 Parity buys one bit of assurance, and no more

A parity bit is the exclusive-or of the data bits,

$$p = d_{m-1} \\oplus d_{m-2} \\oplus \\cdots \\oplus d_{0}$$

appended so that the stored word always has even weight. Any single flip makes
the weight odd and is caught. Any two flips restore even weight and are not.
That is the whole of it, and the arithmetic of the guarantee is worth being
precise about: parity detects an **odd** number of errors and is blind to an
**even** number.

The blindness is not a theoretical corner. Every one of the 256 possible bytes
was encoded and then corrupted in all 9 single-bit positions and all 36
two-bit combinations. All 2,304 single-bit faults produced odd weight and were
caught; all 9,216 two-bit faults produced even weight and passed as clean data.
A parity bit is a smoke alarm, and it cannot put anything out.

## 14.2 The check-bit inequality, and why it is an inequality

To *correct* rather than merely detect, the check bits have to name the faulty
position. With $k$ check bits the syndrome takes $2^{k}$ values, and those
values must cover every one of the $m$ data positions, every one of the $k$
check positions, and the all-clear:

$$2^{k} \\ge m + k + 1$$

It is an inequality because $2^{k}$ jumps in powers of two while the right side
grows by one at a time, so most word widths leave syndrome values unused. For
$m = 8$ the search is short: $k = 3$ gives $8 \\ge 12$, which is false;
$k = 4$ gives $16 \\ge 13$, which holds. So an eight-bit word needs four check
bits and the codeword is twelve bits.

Adding one more bit, an overall parity over the whole codeword, upgrades the
code from single-error correcting to **single-error correcting, double-error
detecting**. That is the SEC-DED construction, and its width is $m + k + 1$.

| Data bits $m$ | Check bits $k$ | $2^{k}$ | $m+k+1$ | SEC-DED width | Overhead |
|---|---|---|---|---|---|
| 8 | 4 | 16 | 13 | 13 | 62.5 % |
| 16 | 5 | 32 | 22 | 22 | 37.5 % |
| 32 | 6 | 64 | 39 | 39 | 21.9 % |
| 64 | 7 | 128 | 72 | 72 | 12.5 % |
| 128 | 8 | 256 | 137 | 137 | 7.0 % |

Every row of that table was produced by searching upward for the smallest $k$
satisfying the inequality and then checking that $k-1$ fails it, so no row is a
remembered value. The 72-bit codeword over 64 data bits in the fourth row is the
width real server memory uses, and the table shows why: the overhead falls as
the word widens, because the check bits grow logarithmically while the data
grows linearly.

## 14.3 The construction, and how the syndrome names the bit

Number the codeword positions from 1. Put the check bits at the positions that
are powers of two — 1, 2, 4, 8 — and the data bits everywhere else. The check
bit at position $2^{j}$ covers every position whose binary representation has
bit $j$ set:

$$s_{j} = \\bigoplus_{q\\,:\\,q \\wedge 2^{j} \\ne 0} c_{q}$$

The payoff is that the syndrome, read as a binary number, **is** the index of the
failing position. If bit 9 flips, then 9 is 1001 in binary, so the checks at
positions 1 and 8 disagree and the checks at 2 and 4 agree, and the syndrome
reads 1001, which is 9.

## 14.4 What injection actually shows

Claims about error control are cheap and checkable, so they were checked. The
whole 256-word codebook was generated for three codes and every fault of the
stated weight was injected into every codeword, one at a time, and decoded.

![Outcome of every injected fault, as a share of the faults injected, for six cases: one-bit and two-bit faults in a plain parity code, in a 12-bit single-error-correcting Hamming code, and in the 13-bit SEC-DED code. Parity catches every single fault and misses every double one; the Hamming code corrects every single fault but turns 77.3 percent of double faults into a wrong answer; SEC-DED corrects every single fault and flags every double fault.](/courses/fe-ee/figures/dig4-ecc-injection.svg)

| Code | Fault weight | Faults injected | Corrected | Flagged | Silently wrong |
|---|---|---|---|---|---|
| Parity, 9 bits | 1 | 2,304 | 0 | 2,304 | 0 |
| Parity, 9 bits | 2 | 9,216 | 0 | 0 | **9,216** |
| Hamming SEC, 12 bits | 1 | 3,072 | 3,072 | 0 | 0 |
| Hamming SEC, 12 bits | 2 | 16,896 | 0 | 3,840 | **13,056** |
| SEC-DED, 13 bits | 1 | 3,328 | 3,328 | 0 | 0 |
| SEC-DED, 13 bits | 2 | 19,968 | 0 | 19,968 | 0 |

Three results in that table deserve reading twice.

The minimum distance of the 12-bit Hamming code is 3, computed as the smallest
weight of a nonzero codeword; adding the overall parity bit raises it to 4. That
jump from 3 to 4 is the entire difference between SEC and SEC-DED, because
correcting $t$ errors needs $d \\ge 2t+1$ and additionally detecting $t+1$ needs
$d \\ge 2t+2$.

The 13,056 silently wrong outcomes in row four are the reason SEC alone is not
enough. A double fault produces a syndrome equal to the exclusive-or of the two
single-fault syndromes, and for 51 of the 66 possible position pairs that value
happens to be a legal position index. The decoder then "corrects" a third,
innocent bit and hands back a word with three errors in it, reporting success.

The last row is the guarantee that makes SEC-DED worth its five extra bits: not
one of 19,968 double faults escaped, and not one was miscorrected. For
completeness, triple faults were injected too, and every one of them was
miscorrected — SEC-DED promises nothing at weight three, and it delivers exactly
what it promises.

### Worked Example 14.1 — check bits for a 32-bit word

**Given.** A 32-bit data word to be protected by SEC-DED.

**Find.** The check-bit count, the codeword width and the overhead.

**Work.** Search the inequality upward. For $k = 5$: $32 \\ge 38$ is false. For
$k = 6$:

$$2^{6} = 64 \\ge 32 + 6 + 1 = 39$$

which holds, so six Hamming check bits, plus one overall parity bit for
double-error detection:

$$n = 32 + 6 + 1 = 39\\ \\text{bits}$$

and the overhead is $7/32 = 21.9\\%$.

**Independent check.** Count what the syndrome must distinguish rather than
plugging into the formula. It must name any of 39 positions or say "clean",
which is 40 outcomes; six bits give 64 syndrome values, enough, and five give
32, not enough. Same conclusion from counting outcomes instead of manipulating
an inequality.

**Answer: 6 check bits plus 1 parity bit, a 39-bit codeword, 21.9 % overhead.**

**Trap.** The inequality includes the check bits themselves in the count of
things the syndrome must be able to name, because a check bit can fail too.
Solving $2^{k} \\ge m + 1$ instead gives $k = 5$ for 32 data bits, one short.

### Worked Example 14.2 — encode a byte

**Given.** The data bits $d_{1}$ through $d_{8}$ equal to 1, 0, 1, 1, 0, 1, 0, 1,
to be placed at positions 3, 5, 6, 7, 9, 10, 11, 12 of a 12-bit Hamming word.

**Find.** The four check bits and the full codeword.

**Work.** Each check bit is the parity of the positions whose index contains its
own bit.

$$p_{1} = c_{3} \\oplus c_{5} \\oplus c_{7} \\oplus c_{9} \\oplus c_{11} = 1 \\oplus 0 \\oplus 1 \\oplus 0 \\oplus 0 = 0$$

$$p_{2} = c_{3} \\oplus c_{6} \\oplus c_{7} \\oplus c_{10} \\oplus c_{11} = 1 \\oplus 1 \\oplus 1 \\oplus 1 \\oplus 0 = 0$$

$$p_{4} = c_{5} \\oplus c_{6} \\oplus c_{7} \\oplus c_{12} = 0 \\oplus 1 \\oplus 1 \\oplus 1 = 1$$

$$p_{8} = c_{9} \\oplus c_{10} \\oplus c_{11} \\oplus c_{12} = 0 \\oplus 1 \\oplus 0 \\oplus 1 = 0$$

so the codeword, positions 1 to 12, is 0 0 1 1 0 1 1 0 0 1 0 1.

**Independent check.** Re-derive the check bits by recomputing the syndrome of
the finished word: every group must now have even parity, and each of the four
groups does. As a second check the codeword weight is 6, an even number, so the
overall parity bit that turns this into a 13-bit SEC-DED word is 0.

**Answer: p1 = 0, p2 = 0, p4 = 1, p8 = 0; codeword 001101100101, with a
SEC-DED parity bit of 0.**

**Trap.** Position numbering starts at 1, not 0, because the syndrome has to be
able to say "position 1" with a nonzero value and reserve zero for "clean". A
zero-based layout puts a data bit where the all-clear syndrome lives and the
code stops working.

### Worked Example 14.3 — decode a word that has been hit

**Given.** The codeword of Example 14.2 with positions 5 and 9 both flipped, so
the received word is 0 0 1 1 1 1 1 0 1 1 0 1 in the 12-bit code, and the same
double fault applied to the 13-bit SEC-DED word.

**Find.** What each decoder does with it.

**Work.** A double fault's syndrome is the exclusive-or of the two single-fault
syndromes, and a single fault at position $q$ has syndrome $q$:

$$s = 5 \\oplus 9 = 0101 \\oplus 1001 = 1100 = 12$$

The 12-bit SEC decoder sees a nonzero syndrome of 12, concludes that position 12
is wrong, and flips it. Position 12 held $d_{8}$, so the decoder has just
corrupted a data bit that was fine, and it returns three errors while reporting
a successful correction.

The 13-bit SEC-DED decoder computes the same syndrome of 12 but also checks the
overall parity, which is **even** because an even number of bits flipped. A
nonzero syndrome with even overall parity is the signature of a double fault, so
the decoder reports an uncorrectable error and corrects nothing.

**Independent check.** This exact pair was among the 16,896 double faults
injected into the SEC code, where it fell in the 13,056 that miscorrect, and
among the 19,968 injected into the SEC-DED code, every one of which was flagged.
The general behaviour and this particular case agree.

**Answer: SEC miscorrects, flipping position 12 and returning bad data as good;
SEC-DED reports an uncorrectable double error.**

**Trap.** "Nonzero syndrome means correct that position" is the rule for SEC and
it is wrong for SEC-DED. The SEC-DED decision needs both the syndrome and the
overall parity: nonzero syndrome with odd parity is a correctable single fault;
nonzero syndrome with even parity is an uncorrectable double one.`,
      examTip: 'Solve 2^k >= m + k + 1 by trying k, not by rearranging it, and remember the plus k. For SEC-DED add one further bit. The memorable anchor is 64 data bits needing 8 extra bits for a 72-bit word, which is what server memory actually uses.',
      importantNote: 'A distance-3 code corrects one error; distance 4 corrects one AND detects two. The overall parity bit is what lifts the Hamming code from 3 to 4, and without it 77 % of double faults are silently miscorrected into triple faults.',
    },
    { id: 'mem-map', title: '15. A Memory Map for a Small System',
      content: `## 15.1 Memory-mapped against isolated

A processor that supports **isolated I/O** has separate instructions and a
separate address space for peripherals, selected by a control line rather than
by an address bit. A processor using **memory-mapped I/O** places peripheral
registers in the ordinary address space, so an ordinary load or store reaches
them and the decode logic that separates a UART from a RAM is the same decode
logic that separates one RAM from another.

Memory mapping is the dominant arrangement, and the reasons are all about the
rest of the system rather than about the peripheral: every addressing mode
works on a register, pointers to registers are ordinary pointers, and no
instruction-set extension is needed. The costs are equally concrete. Address
space is consumed, cacheing has to be suppressed for the mapped region because
a register read has side effects and must not be served from a cache line, and
a wild pointer can now reach hardware.

| Property | Memory mapped | Isolated |
|---|---|---|
| Instructions used | ordinary load and store | dedicated input and output |
| Address space consumed | yes | no |
| Addressing modes available | all of them | usually direct only |
| Cacheability | must be suppressed for the region | not applicable |

## 15.2 The map, worked

Take a 1 MiB space, $A_{19}$ down to $A_{0}$, decoded by a 3-to-8 decoder on
$A_{19}$ through $A_{17}$. Each slot is

$$\\frac{2^{20}}{8} = 2^{17} = 131072\\ \\text{addresses}$$

and the system populates three of the eight.

| Slot | Range | Contents | Device depth | Images of each cell |
|---|---|---|---|---|
| 0 | 0x00000 to 0x1FFFF | boot ROM, 128 KiB | $2^{17}$ | 1 |
| 1 | 0x20000 to 0x3FFFF | SRAM, 128 KiB | $2^{17}$ | 1 |
| 2 | 0x40000 to 0x5FFFF | UART, 256 bytes | $2^{8}$ | **512** |
| 3 to 7 | 0x60000 to 0xFFFFF | unmapped | — | — |

The interesting row is the UART. Its select comes from the slot decoder, which
uses only $A_{19}$ through $A_{17}$, and the part itself uses only $A_{7}$
through $A_{0}$. The nine lines in between, $A_{16}$ through $A_{8}$, go
nowhere, so by the alias relation of Section 10.1 each of the UART's 256
registers appears

$$M = 2^{\\,17-8} = 512$$

times inside its slot. That is the ordinary consequence of putting a small
peripheral behind a coarse decoder, and it is harmless as long as the map
records the whole slot as belonging to the UART rather than recording only the
first 256 bytes.

The map was walked address by address. Every one of the 1,048,576 addresses was
tested against all three select expressions: 393,216 had exactly one responder,
655,360 had none, and none at all had two. Inside slot 2, each of the UART's
256 offsets was reached from exactly 512 distinct addresses, while every ROM and
SRAM cell was reachable from exactly one.

### Worked Example 15.1 — placing a second peripheral safely

**Given.** The map above, and a new 1 KiB peripheral that must be added without
disturbing anything.

**Find.** Where it can go, and what its select expression is.

**Work.** Slots 3 through 7 are free, so put it at the base of slot 3, address
0x60000. Slot 3 is selected by $A_{19}A_{18}A_{17} = 011$, and a 1 KiB part uses
$\\log_{2} 1024 = 10$ lines, $A_{9}$ through $A_{0}$. The simplest select reuses
the existing decoder:

$$CS = \\overline{A_{19}}\\,A_{18}\\,A_{17}$$

which is one decoder output and nothing more.

**Independent check.** Count the images this creates. The slot is $2^{17}$
addresses and the part is $2^{10}$, so
$M = 2^{17-10} = 128$ images on a stride of 1,024 addresses. That is acceptable
only because nothing else is inside slot 3; the moment a second part is wanted
there, $A_{16}$ through $A_{10}$ must be brought into the decode.

**Answer: base 0x60000 in slot 3, selected by the decoder output for A19 A18
A17 = 011, with 128 aliases inside the slot.**

**Trap.** "It works, so the map is fine" is exactly the reasoning that ships the
overlap of Worked Example 10.3. The map is fine when the audit says every
address has at most one responder, and the audit is a walk, not a glance.

### Worked Example 15.2 — how much space a coarse decoder wastes

**Given.** The map above.

**Find.** The fraction of the address space that is unreachable or wasted.

**Work.** Five slots are unmapped:

$$5 \\times 131072 = 655360\\ \\text{addresses}$$

which is $655360/1048576 = 62.5\\%$ of the space. Within slot 2 the UART uses
256 of 131,072 addresses uniquely, so a further
$131072 - 256 = 130816$ addresses are aliases rather than distinct storage.
Distinct, usable locations total

$$131072 + 131072 + 256 = 262400$$

which is 25.0 % of the space.

**Independent check.** Add up the three categories and confirm they exhaust the
space: 262,400 distinct locations, 130,816 alias addresses and 655,360 unmapped
addresses sum to 1,048,576, the whole 1 MiB. The enumeration reported exactly
these counts, with 393,216 addresses answered by some device, which is
$262400 + 130816$.

**Answer: 62.5 % unmapped, 12.5 % alias images, 25.0 % distinct storage.**

**Trap.** Wasting address space is not automatically bad — the gates saved are
real and a 1 MiB space with 256 KiB of parts has space to waste. It becomes bad
when a later revision needs the space and the aliases have already been written
into driver code as if they were separate registers.`,
      examTip: 'On a memory-map question, list every device with its base address, its depth in address lines, and the lines the decode actually uses. The number of images is two to the power of the lines that are used by neither, and that single count answers most of what these questions ask.',
      importantNote: 'Memory-mapped peripheral regions must be marked non-cacheable. A status register read that is served from a cache line returns a stale value forever, and it is a defect that appears only after a cache is enabled, long after the map was reviewed.',
    },
    { id: 'mem-probs-a', title: '16. Problem Set A: Devices, Timing and Refresh',
      content: `## Problem Set A

**A1.** A part is organised $128\\mathrm{K} \\times 32$. How many address pins,
how many data pins, and how many bytes does it hold?

**A2.** A DRAM bank has 16,384 rows, a row-refresh time of 260 ns and a 32 ms
refresh window. What fraction of the bank's time goes to refresh, and what is
the interval between refresh commands?

**A3.** A DRAM cell of 30 fF sits on a 270 fF bit line and is charged 0.55 V
above the pre-charge level. The sense amplifier needs 30 mV. How much signal
does a read produce, and how far may the cell decay?

**A4.** A memory quotes a 45 ns access time and a 75 ns cycle time. What is the
maximum sustained access rate, and what is the recovery time?

**A5.** A 66 MHz synchronous bus uses a two-clock base transfer and a controller
setup requirement of 8 ns. How many wait states does a 70 ns memory need?

**A6.** An SRAM cell is built with $V_{DD} = 1.2$ V, a trip point at 0.6 V and a
cell ratio of 1.2. What is the read margin, and what cell ratio would double it?

---

### Worked solution A1

Locations are $128 \\times 1024 = 131072$, so

$$n = \\log_{2} 131072 = 17$$

address pins. The width is 32 bits, so 32 data pins, and the capacity is

$$131072 \\times 32 = 4194304\\ \\text{bits}$$

which is 524,288 bytes, or 512 KiB.

**Answer: 17 address pins, 32 data pins, 512 KiB.**

**Trap.** Converting bits to bytes at the end is where this one is lost. Four
million bits is not four million bytes, and the factor of eight turns a 512 KiB
part into a 4 MiB one on the answer sheet.

### Worked solution A2

$$f_{ov} = \\frac{16384 \\times 260\\ \\mathrm{ns}}{32\\ \\mathrm{ms}} = \\frac{4.25984\\ \\mathrm{ms}}{32\\ \\mathrm{ms}} = 0.1331$$

so 13.3 % of the bank's time is spent refreshing, and

$$t_{REFI} = \\frac{32\\ \\mathrm{ms}}{16384} = 1.953\\ \\mathrm{\\mu s}$$

**Answer: 13.3 % overhead, 1.953 us between commands.**

**Trap.** Both parameters here are worse than the 8,192-row, 64 ms case of
Worked Example 8.3 — twice the rows in half the window — and the overhead is
correspondingly about three times as large. Assuming refresh is always a
fraction of a percent, as it was in the 4,096-row example of Section 3.3, gives
an answer two orders of magnitude out.

### Worked solution A3

$$\\Delta V = 0.55 \\times \\frac{30}{30 + 270} = 0.55 \\times 0.1 = 0.055\\ \\mathrm{V}$$

so 55 mV reaches the amplifier. The floor is found by inverting the same
relation with the amplifier's 30 mV minimum:

$$V_{min} = 0.030 \\times \\frac{300}{30} = 0.30\\ \\mathrm{V}$$

so the cell may fall from 0.55 V to 0.30 V, a usable swing of 0.25 V.

**Answer: 55 mV of signal; the cell may decay by 0.25 V, to 0.30 V.**

**Trap.** The sense-amplifier minimum is specified at the **bit line**, not at
the cell. Comparing it directly with the cell voltage skips the divider and
suggests the cell may decay to 30 mV, which is nearly ten times too optimistic.

### Worked solution A4

Sustained rate is set by cycle time:

$$r = \\frac{1}{75 \\times 10^{-9}} = 13.3\\ \\text{million accesses per second}$$

and the recovery is the difference:

$$t_{rec} = 75 - 45 = 30\\ \\mathrm{ns}$$

**Answer: 13.3 M accesses/s and 30 ns of recovery.**

**Trap.** Answering 22.2 million, which is one over the access time, is the
intended distractor and it overstates the throughput by two thirds. Access time
governs how long one access takes; cycle time governs how often one may start.

### Worked solution A5

The clock period is $1/66\\ \\mathrm{MHz} = 15.15$ ns, so

$$W \\ge \\frac{70 + 8}{15.15} - 2 = 5.148 - 2 = 3.148$$

which rounds up to $W = 4$, a six-clock transfer of 90.9 ns.

**Answer: 4 wait states.**

**Trap.** Rounding 3.148 down to 3 gives a five-clock transfer of 75.8 ns, in
which data is needed by 67.8 ns and arrives at 70 ns. It misses by 2.2 ns, and
the failure is intermittent rather than absolute, which is the worst kind.

### Worked solution A6

$$V_{0} = \\frac{1.2}{1 + 1.2} = 0.5455\\ \\mathrm{V}$$

so the margin is $0.6000 - 0.5455 = 0.0545$ V, that is 54.5 mV. Doubling it to
0.1090 V needs $V_{0} \\le 0.4910$ V, so

$$\\frac{1.2}{1 + \\mathrm{CR}} \\le 0.4910 \\;\\Longrightarrow\\; 1 + \\mathrm{CR} \\ge 2.4440$$

giving $\\mathrm{CR} \\ge 1.4440$, so about 1.44.

**Answer: 54.5 mV of margin at a cell ratio of 1.2; a ratio of about 1.44
doubles it.**

**Trap.** The margin is not proportional to the cell ratio, because the ratio
appears in a denominator. Doubling the margin needed a ratio increase of only
20 %, and quadrupling it to 0.2180 V needs only
$\\mathrm{CR} \\ge 1.2/0.3820 - 1 = 2.1414$, nowhere near $4 \\times 1.2$.`,
      examTip: 'Every problem in this set is one substitution into a relation stated in the chapter. Write the relation before the numbers, and label which time is access and which is cycle, because half the distractors on memory questions are the other one of that pair.',
    },
    { id: 'mem-probs-b', title: '17. Problem Set B: Decoding, Expansion and Error Control',
      content: `## Problem Set B

**B1.** Build a 512K x 32 memory from 128K x 8 parts. How many parts, how many
banks, and how wide is the decoder?

**B2.** A 4 KiB device in a 64 KiB space is selected by $A_{15}A_{14}$ only. How
many images does each cell have, and on what stride?

**B3.** Derive the active-high chip select for an 8 KiB device occupying
0xA000 to 0xBFFF in a 64 KiB space.

**B4.** A 64-bit word is protected by SEC-DED. How many total bits are stored,
and what is the overhead?

**B5.** A memory system has a 50 ns bank cycle time and a bus that moves one
word every 12.5 ns. How many banks are worth building?

**B6.** A designer proposes protecting a 16-bit word with a single parity bit
and argues that since single-bit upsets dominate, the coverage is adequate.
What does the injection evidence say?

---

### Worked solution B1

Width and depth separately:

$$C = \\frac{32}{8} = 4, \\qquad B = \\frac{524288}{131072} = 4, \\qquad T = 4 \\times 4 = 16$$

Each part takes $\\log_{2} 131072 = 17$ address lines; the system needs
$\\log_{2} 524288 = 19$; the two left over drive a 2-to-4 decoder.

**Answer: 16 parts in 4 banks of 4, 17 lines per part, 2-to-4 decoder on A18 and
A17.**

**Trap.** The decoder is sized by the bank count, 4, not the part count, 16. A
4-to-16 decoder here would leave twelve outputs with nothing attached and would
place the four real banks in the wrong quarter of the space.

### Worked solution B2

A 4 KiB part uses $\\log_{2} 4096 = 12$ lines, $A_{11}$ through $A_{0}$. The
decode uses $A_{15}$ and $A_{14}$, so $A_{13}$ and $A_{12}$ are ignored:

$$M = 2^{2} = 4\\ \\text{images, stride } 2^{12} = 4096$$

**Answer: 4 images per cell, on a 4 KiB stride, filling the 16 KiB window the
two decoded lines select.**

**Trap.** The stride is the size of the **part**, not the size of the ignored
field. Answering 0x2000 because two lines were ignored confuses the number of
images with the distance between them.

### Worked solution B3

An 8 KiB part uses 13 lines, $A_{12}$ through $A_{0}$, leaving $A_{15}$,
$A_{14}$ and $A_{13}$ for the decode. The endpoints in binary are 1010 followed
by twelve zeros and 1011 followed by twelve ones, so the top three bits are 101
in both:

$$CS = A_{15}\\,\\overline{A_{14}}\\,A_{13}$$

**Answer: $CS = A_{15}\\overline{A_{14}}A_{13}$.**

**Trap.** Including $A_{12}$ in the term is the error to watch for, because the
two endpoint addresses differ in that bit. Only bits that are the SAME at both
ends belong in the select; a bit that changes across the window belongs to the
part.

### Worked solution B4

Search the inequality: $k = 6$ gives $64 \\ge 71$, false; $k = 7$ gives

$$2^{7} = 128 \\ge 64 + 7 + 1 = 72$$

true. Add the overall parity bit:

$$n = 64 + 7 + 1 = 72\\ \\text{bits}$$

and the overhead is $8/64 = 12.5\\%$.

**Answer: 72 bits stored, 12.5 % overhead.**

**Trap.** This is the one width worth memorising, because 72 over 64 is what
server DIMMs actually carry and it anchors the whole table. If a calculation
gives anything other than 72 for a 64-bit SEC-DED word, the arithmetic is wrong.

### Worked solution B5

$$B^{*} = \\frac{t_{RC}}{t_{B}} = \\frac{50}{12.5} = 4$$

so four banks reach the bus limit and the gain saturates there:
$G = \\min(B, 4)$.

**Answer: 4 banks; a fifth adds nothing.**

**Trap.** Building eight banks here is not merely wasteful, it is invisible. The
system tests identically to the four-bank version on every benchmark, so the
cost is discovered only in the bill of materials.

### Worked solution B6

The premise is right and the conclusion does not follow. Parity does detect
every single-bit upset — all 2,304 injected single faults were caught. But it
**cannot correct any of them**, so a system whose upsets are all single-bit
still halts on every one. And of the 9,216 injected double faults, every single
one passed as clean data, so the residual risk is not reduced, only ignored.

The alternative costs six bits. SEC-DED over 16 data bits needs $k = 5$ check
bits plus one overall parity, a 22-bit word at 37.5 % overhead, and it corrects
every single fault silently and flags every double one.

**Answer: parity detects but never corrects, and is blind to every even-weight
fault; SEC-DED over 16 bits costs six bits and removes both limitations.**

**Trap.** "Single-bit upsets dominate" is an argument for **correction**, not for
detection. If the dominant fault is one the code can only report, every
occurrence of the dominant fault becomes an outage.`,
      examTip: 'Decoding and expansion questions are all counting: lines used by the part, lines used by the decode, lines used by neither. Write those three numbers down first and every sub-question falls out of them, including the image count and the stride.',
      importantNote: 'The 72-bit codeword over 64 data bits is the anchor to carry into the exam. From it you can reconstruct the inequality, because 7 check bits and 1 parity bit over 64 data bits is the only combination that satisfies 2^k >= m + k + 1 with nothing to spare.',
    },
  ],
  keyTakeaways: [
    'ROM nonvolatile (PROM, EPROM, Flash). RAM volatile (SRAM fast, DRAM dense/refresh).',
    'Capacity = 2^(address_bits) locations.',
    'Hierarchy: registers > cache > RAM > SSD > HDD (speed vs. capacity).',
    'Cache: t_avg = h*t_cache + (1-h)*t_memory; hit rate h is key.',
    'Direct-mapped (fast) vs. fully associative (flexible) vs. N-way (balanced).',
    'FPGA: reconfigurable, low dev cost; ASIC: best performance, high dev cost.',
    'Sort every part on three axes: volatility, endurance, and access mode (read, write and erase granularity). Most numeric memory questions are the third axis in disguise.',
    'SRAM is 4 transistors of latch plus 2 of access; the cell ratio must exceed 1 or a read destroys the cell. DRAM is 1T + 1C, its read is destructive, and that restore is why cycle time exceeds access time.',
    'Charge sharing gives dV = V_s * C_s / (C_s + C_BL); retention is t = C_s (V_s - V_min) / I_leak; refresh overhead is (rows x t_RFC) / t_REF, taken straight off the bandwidth.',
    'NOR is randomly addressable and executes in place; NAND is page oriented and denser. Flash endurance is per erase block, and wear levelling multiplies life by N_blocks x p_max, not by N_blocks.',
    'Full decoding uses every spare high address line; partial decoding leaves h - d of them free and creates 2^(h-d) images on a stride of 2^d. Audit a map by counting responders at every address: two is contention, zero is a hole.',
    'Expansion: chips per bank = bus width / chip width, banks = system depth / chip depth, and the decoder has log2(banks) inputs -- never log2(total chips).',
    'Use cycle time for throughput and access time for latency. A write latches on the RISING edge of WE, so data and address setup are measured to the end of the pulse.',
    'Interleaving gain is min(banks, t_RC / t_B). Low-order address bits select the bank for bandwidth; high-order bits for a contiguous map.',
    'Parity detects odd numbers of errors and corrects none. SEC-DED needs 2^k >= m + k + 1 plus one overall parity bit: 8 data bits give 13, and 64 data bits give the familiar 72.',
  ],
},

  /* ══════════════════════════════════════════════════════════════════
   * TOPIC 16 — COMPUTER SYSTEMS  (4 curriculum IDs)  ·  3–5 %
   * ══════════════════════════════════════════════════════════════════ */

};
