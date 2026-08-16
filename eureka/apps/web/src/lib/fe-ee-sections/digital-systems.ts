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
- D1 = Q1'*Q0*X' + Q1*Q0'*X (next state MSB)
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
      importantNote: 'Moore outputs change only on clock edges (glitch-free). Mealy outputs can change mid-cycle when inputs change. For synchronous designs, register Mealy outputs to prevent glitches.',
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
