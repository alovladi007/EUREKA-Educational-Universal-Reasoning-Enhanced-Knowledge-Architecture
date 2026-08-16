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
| 32 | $-2^31 to +2^31-1$ | — | — |

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

**Groups**: (1) cells 0,1,8,9 = group of 4 -> **B'D'** wait — let me group properly:
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
returns one of the two neighbouring positions and never a wild value. The same
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
minterm m5 for four variables is A'B'CD' — read the index 0101 and complement
the variables that carry a 0. Maxterm M5 is the *complement* of that, A + B +
C' + D — read the same index but complement the variables that carry a 1, and
join them with OR. Our function is false at the nine indices its minterm list
omits, so

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

| A | B | Cin | Sum | Cout |
|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 |
| 0 | 1 | 1 | 0 | 1 |
| 1 | 1 | 0 | 0 | 1 |
| 1 | 1 | 1 | 1 | 1 |

## 2.3 Adder Types

| Type | Delay | Notes |
|---|---|---|
| **Ripple-carry** | O(n) | Simple, slow |
| **Carry-lookahead** | O(log n) | Fast, uses G=AB, P=A XOR B |

## 2.4 Subtraction

**$A - B = A + (~B) + 1$** (2's complement). Same adder with invert path.`,
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
bits, lookahead saves 8 tau against 4 tau — a factor of two, for a lot of extra
silicon. At sixty-four bits the same structure saves 128 tau against 12, a
factor of more than ten, and the ripple design has stopped being usable at all.
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
