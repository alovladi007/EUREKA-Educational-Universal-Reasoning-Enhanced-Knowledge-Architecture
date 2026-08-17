// FE EE course content — Computer Systems (4 topics).
// Split byte-identically from fe-ee-course-data.ts so section waves
// can be authored in parallel; spread back into FE_EE_COURSE there.
import type { TopicLesson } from '../fe-ee-course-data';

export const FE_EE_COMPUTER_SYSTEMS: Record<string, TopicLesson> = {
fee_architecture: { topicId: 'fee_architecture', title: 'Computer Architecture', domainWeight: 'Computer Systems · 3–5%',
  overview: 'Computer architecture defines how a processor fetches, decodes, and executes instructions. Von Neumann vs. Harvard, RISC vs. CISC, and pipelining with hazard handling are the core concepts tested on the FE exam.',
  sections: [
    { id: 'arch-models', title: '1. Architectural Models and ISA',
      content: `## 1.1 Von Neumann vs. Harvard

| Feature | Von Neumann | Harvard |
|---|---|---|
| Memory | Single (code + data) | Separate instruction/data |
| Bus | Shared (bottleneck) | Independent (parallel) |
| Modern use | Main memory | L1 cache (separate I$/D$) |

**Modified Harvard**: separate L1 caches, unified L2/L3 and main memory.

## 1.2 RISC vs. CISC

| | RISC | CISC |
|---|---|---|
| Instructions | Simple, fixed-length | Complex, variable |
| CPI | ~1 (pipelined) | Variable |
| Registers | Many (32-64) | Few (8-16) |
| Pipelining | Efficient | Harder |
| Examples | ARM, MIPS, RISC-V | x86 |

## 1.3 Instruction Cycle

IF (Fetch) -> ID (Decode) -> EX (Execute) -> MEM (Memory) -> WB (Writeback)`,
      examTip: 'Von Neumann = shared memory (bottleneck). Harvard = separate (faster). Modern = Modified Harvard. RISC = simple, pipelinable. CISC = complex, variable.',
    },
    { id: 'arch-pipeline', title: '2. Pipelining and Hazards',
      content: `## 2.1 Pipeline

Multiple instructions overlap in different stages simultaneously.

**Ideal throughput**: 1 instruction/cycle. **Ideal speedup**: = number of stages.

## 2.2 Hazards

| Type | Cause | Solution |
|---|---|---|
| **Data** | Needs result from in-progress instr | **Forwarding**, stalling |
| **Control** | Branch changes flow | **Branch prediction** |
| **Structural** | Two instrs need same resource | **Duplication** |

## 2.3 Advanced

- **Superscalar**: multiple pipelines, multiple instrs/cycle
- **Out-of-order**: execute when operands ready
- **Branch prediction**: >95% accurate in modern CPUs

**CPI_real = 1 + stall_cycles_per_instr**`,
      examTip: 'Three hazards: data (forwarding), control (prediction), structural (duplication). Ideal pipeline CPI = 1; real > 1 due to stalls.',
      importantNote: 'Deeper pipelines increase branch misprediction penalty. This is why modern CPUs invest heavily in branch prediction.',
    },
    { id: 'arch-exam', title: '3. Architecture Comparison Problems',
      content: `## 3.1 RISC Pipeline vs CISC Multi-Cycle

**Problem**: Execute 1000 instructions. RISC: 5-stage pipeline, 1 GHz clock, CPI = 1.2 (with stalls). CISC: multi-cycle, 2 GHz clock, CPI = 3.5.

**RISC execution time**:
$$T_{RISC} = IC * CPI / f = 1000 * 1.2 / 10^9 = 1.2\\ \\mathrm{us}$$

**CISC execution time**:
$$T_{CISC} = IC * CPI / f = 1000 * 3.5 / (2 * 10^9) = 1.75\\ \\mathrm{us}$$

| Metric | RISC (1 GHz) | CISC (2 GHz) |
|---|---|---|
| CPI | 1.2 | 3.5 |
| Execution time | **1.2 us** | 1.75 us |
| MIPS | 833 | 571 |

RISC wins despite lower clock speed because its pipeline achieves much lower CPI.

## 3.2 Pipeline Speedup with 20% Branch Penalty

**Given**: 5-stage pipeline, 20% branch instructions, branch misprediction rate = 30%, penalty = 2 cycles.

**Effective CPI**:
CPI = 1 + (branch_fraction * mispredict_rate * penalty)
$$CPI = 1 + (0.20 * 0.30 * 2) = 1 + 0.12 = 1.12$$

**Speedup vs non-pipelined** (5 cycles/instr):
Speedup = 5 / 1.12 = **4.46x** (vs ideal 5x)

| Branch Prediction Accuracy | Misprediction Rate | CPI | Speedup |
|---|---|---|---|
| 70% | 30% | 1.12 | 4.46x |
| 90% | 10% | 1.04 | 4.81x |
| 95% | 5% | 1.02 | 4.90x |

Better branch prediction approaches the ideal 5x speedup.

## 3.3 Harvard vs Von Neumann Throughput

**Von Neumann** (shared bus): cannot fetch instruction and data simultaneously.
- IF takes 1 cycle, MEM takes 1 cycle, both use same bus
- Pipeline stall when IF and MEM overlap: **structural hazard**

**Harvard** (separate buses): instruction fetch and data access proceed in parallel.
- No IF/MEM conflict -> removes that whole hazard class, which can otherwise arise on the 20-30% of instructions that reference data
- Modern CPUs: separate L1 I-cache and D-cache (Modified Harvard)

| Architecture | Structural Hazards | Throughput Impact |
|---|---|---|
| Von Neumann | IF/MEM conflicts | CPI penalty up to 0.2-0.3; 0.125 stepped in Section 6.2 |
| **Harvard** | No IF/MEM conflicts | Near-ideal CPI |
| Modified Harvard | L1 split, L2+ unified | Best of both |

**Exam strategy**: Performance = IC * CPI / f. Compare systems by execution time on the SAME program, not by clock speed or MIPS alone. For pipeline problems, compute effective CPI = 1 + stall_contributions.`,
      examTip: 'Never compare processors by clock speed alone. A 1 GHz RISC with CPI=1 beats a 2 GHz CISC with CPI=4. Always compute execution time = IC * CPI / f.',
      importantNote: 'Pipeline speedup is limited by the SLOWEST stage. If one stage takes 2x longer than others, it becomes the bottleneck. Balance stage delays for maximum throughput.',
    },
    { id: 'arch-registers', title: '4. Inside the Datapath: Registers, the Fetch Cycle, and Addressing Modes',
      content: `## 4.1 The registers that make the fetch cycle possible

The five-stage sequence in Section 1.3 is usually presented as a list of verbs.
It becomes concrete once you name the storage each verb touches. A minimal
stored-program processor carries these:

| Register | Full name | What it holds |
|---|---|---|
| **PC** | program counter | address of the next instruction to fetch |
| **MAR** | memory address register | address currently presented to the memory bus |
| **MDR** | memory data register | data just read from, or about to be written to, memory |
| **IR** | instruction register | the instruction being decoded and executed now |
| **ACC** | accumulator | one implicit operand and the destination of arithmetic |
| **SP** | stack pointer | address of the current top of stack |
| **PSW** | status word / flags | carry, zero, sign, overflow, and interrupt-enable bits |

Two of these deserve a note. The **MAR and MDR pair is the entire interface to
memory**: MAR width equals the address bus width and therefore sets how much
memory the machine can address, while MDR width equals the data bus width and
sets how much moves per transfer. They can differ, and on many machines they
do. The **PSW** is where the carry and overflow flags of two's-complement
arithmetic live, which is what makes conditional branching possible at all.

## 4.2 The fetch cycle written as register transfers

Every instruction begins the same way, and writing it as transfers makes the
role of each register unmistakable:

1. **MAR <- PC** — put the address of the next instruction on the bus
2. **MDR <- memory[MAR]**, and **PC <- PC + instruction length** — read it, and
   point at the one after
3. **IR <- MDR** — move the fetched word into the instruction register
4. decode the IR, compute any effective address, and execute

Step 2 is worth pausing on. The program counter is incremented **during the
fetch**, before the instruction has even been decoded, which is why a
PC-relative displacement is measured from the address of the *following*
instruction rather than from the branch itself. That convention is the source
of most off-by-one errors on branch-target problems.

## 4.3 Addressing modes are answers to "where is the operand?"

An instruction has to say where its data lives, and the ways of saying so are
the addressing modes. The quantity each mode computes is the **effective
address**, EA.

| Mode | How the operand is found | Effective address |
|---|---|---|
| Immediate | the operand is inside the instruction | none; the value is the field |
| Direct (absolute) | the instruction holds the address | EA = address field |
| Indirect | the instruction holds the address of the address | EA = memory[address field] |
| Register | the operand is in a named register | none |
| Register indirect | a register holds the address | EA = contents of the register |
| **Indexed / displacement** | base plus a displacement | EA = base + displacement |
| **PC-relative** | displacement from the next instruction | EA = PC_next + signed displacement |
| Stack | implicit, at the stack pointer | EA = SP, with SP adjusted |

Work two of them with real numbers.

**Indexed.** A base register holds 0x2400 and the index register holds 0x0032.
The effective address is

**EA = 0x2400 + 0x0032 = 0x2432**

This mode is why array access is a single instruction: the base names the array
and the index names the element.

**PC-relative.** A branch instruction sits at 0x2000, occupies four bytes, and
carries the 8-bit displacement 0xF4. First interpret the displacement as a
signed value — the high bit is set, so 0xF4 is 244 - 256 = **-12**. Then apply
it to the *incremented* PC:

**EA = 0x2004 + (-12) = 0x1FF8**

a backward branch of twelve bytes, which is the shape of a short loop. Had you
measured from 0x2000 instead of 0x2004 the answer would have been 0x1FF4,
wrong by exactly the instruction length. Every step here was machine-checked
before it was written down.

## 4.4 Why the machine bothers with so many modes

Each mode exists because some common program shape becomes expensive without
it:

- **Immediate** removes a memory access for constants, which are everywhere.
- **Register indirect** is the pointer, and therefore every linked structure.
- **Indexed** is the array subscript, and it is why one instruction can walk a
  loop body that would otherwise need address arithmetic.
- **PC-relative** makes code **position independent**: because every branch is
  expressed as a distance rather than an absolute address, the whole program can
  be loaded anywhere in memory without rewriting its branches. Shared libraries
  depend on this.

The RISC and CISC split of Section 1.2 is partly a disagreement about this
table. A CISC design offers many modes and lets one instruction do address
arithmetic and a memory access and an operation; a RISC design offers few,
usually register, immediate and displacement only, and requires loads and
stores to be the only memory-touching instructions. Fewer modes means a fixed
instruction length and a predictable pipeline, which is the trade Section 1.2
described from the other side.

**How the exam asks this.** The standard item gives a small register dump and a
memory dump and asks for the effective address or the value fetched under a
named mode. Write down which quantity the mode adds, do the addition in hex,
and for PC-relative remember to use the incremented PC and to sign-extend the
displacement first.`,
      examTip: 'PC-relative displacements are measured from the address of the NEXT instruction, because the program counter is incremented during fetch. Sign-extend the displacement before adding: a high bit of 1 means a backward branch.',
      importantNote: 'The MAR width sets the addressable memory size and the MDR width sets the data-bus width; they are independent. A machine with a 32-bit MAR and a 16-bit MDR addresses 4 GB but moves only two bytes per memory cycle.',
    },
    { id: 'arch-pipe-count', title: '5. Pipeline Bookkeeping: Cycles, Stalls, and Flushes',
      content: `## 5.1 The formula that counts cycles

For k stages and n instructions with no hazards, the first instruction takes k
cycles to emerge and every instruction after it emerges one cycle later:

**cycles = k + (n - 1)**

Add the disturbances and the bookkeeping stays just as simple:

**cycles = k + (n - 1) + (stall cycles) + (flushed cycles)**

Speedup against a non-pipelined machine that takes k cycles per instruction is
then

**speedup = n x k / cycles**, which approaches **k** as n grows large

The approach to k is why pipelining is a throughput technique and not a latency
technique: a single instruction still takes k cycles from fetch to writeback,
and it is only the *rate* of completion that improves.

## 5.2 A schedule with real interference

Six instructions, five stages, and two ordinary complications: instruction 2 is
a load whose result instruction 3 needs immediately, and instruction 4 is a
branch that turns out to be taken.

![A space-time chart of six instructions through a five-stage pipeline, produced by a scheduler rather than drawn by hand. One bubble is inserted for the load-use dependence, the branch resolves in the execute stage, and the two instructions fetched behind it on the wrong path are discarded, so the sequence finishes in thirteen cycles.](/courses/fe-ee/figures/csys-pipeline-spacetime.svg)

Read the chart as a bill:

| Item | Cycles |
|---|---|
| Fill the pipeline plus one per instruction, 5 + (6 - 1) | 10 |
| Load-use bubble before I3 can execute | +1 |
| Two wrong-path fetches discarded when the branch resolves | +2 |
| **Total** | **13** |

Which gives

**CPI = 13 / 6 = 2.17**

and at a 2 GHz clock, 13 cycles is **6.5 ns**. The same six instructions on a
non-pipelined machine would need 6 x 5 = 30 cycles, or 15 ns, so the pipeline
is still **2.31 times faster** despite paying three penalty cycles on six
instructions. That number is deliberately unflattering — a six-instruction
sequence is nearly all pipeline fill. Run ten thousand instructions through the
same machine and the fill cost vanishes into the average, which is why real CPI
figures cluster near 1 rather than near 2.

## 5.3 Forwarding fixes most data hazards, and cannot fix one

A data hazard exists whenever an instruction needs a result that is still
inside the pipeline. Usually the value physically exists somewhere — at the
output of the execute stage, say — and the fix is **forwarding**: route it
directly to the input of the stage that needs it instead of waiting for it to
be written to the register file and read back. Forwarding costs
multiplexers and comparators, not cycles.

The exception is the **load-use hazard** in the schedule above. A load's value
is not available until the memory stage completes, which is *after* the moment
the next instruction's execute stage needs it. No wire can move data backwards
in time, so this case costs one real stall cycle no matter what hardware is
added. A compiler avoids it by scheduling an unrelated instruction into the
gap, which is one of the concrete reasons instruction scheduling exists.

| Hazard | Cause | Cheapest cure | Cycles lost |
|---|---|---|---|
| Data, arithmetic result | value still in the pipeline | forwarding | 0 |
| **Data, load-use** | value not produced until MEM | stall, or compiler scheduling | 1 |
| Control, taken branch | fetches after the branch are wrong | prediction; resolve earlier | 1 to 2 per misprediction |
| Structural | two stages want one resource | duplicate the resource | 0 once duplicated |

## 5.4 Where the branch is resolved decides the penalty

The two flushed fetches in the chart are a direct consequence of the branch
being resolved in the execute stage: everything fetched after the branch and
before that resolution is on the wrong path. Resolve the branch one stage
earlier and the penalty falls to one; resolve it later, as a deeply pipelined
machine must, and the penalty grows with the depth. This is the quantitative
form of the warning in Section 2: a deeper pipeline raises the clock rate and
raises the misprediction penalty at the same time, and the second effect can
overwhelm the first.

The effective CPI from branching alone, using the worked figures of Section
3.2, is

**CPI = 1 + (branch fraction) x (misprediction rate) x (penalty)
= 1 + 0.20 x 0.30 x 2 = 1.12**

so a 70 percent accurate predictor costs 12 percent of the machine's throughput
on this workload. Raise accuracy to 95 percent and the same expression gives
1.02. That is why a modern processor spends a serious silicon budget on
prediction tables: the return is measured against the whole pipeline, not
against the branch instructions alone.

**How the exam asks this.** Nearly always: given stages, instruction count, and
a list of stalls, compute the cycle count and the CPI. Use the formula, add the
penalties explicitly, and divide by the instruction count. If the question asks
for speedup, be careful which baseline it wants — a non-pipelined machine at k
cycles per instruction, or an ideal pipeline at CPI 1.`,
      examTip: 'Cycles = stages + instructions - 1 + stalls + flushes. Almost every pipeline question is that one line plus arithmetic; the marks are lost by forgetting the fill term or by counting a two-cycle flush as one.',
      importantNote: 'Forwarding eliminates arithmetic data hazards at zero cycle cost, but a load-use hazard always costs at least one stall because the loaded value simply does not exist yet when the next instruction needs it.',
    },
    { id: 'arch-stored-program', title: '6. The Stored-Program Machine and the Price of One Bus',
      content: `## 6.1 One store, two kinds of content

Section 1.1 named the shared memory of a von Neumann machine and called its bus
a bottleneck. That word is doing a great deal of unpaid work, so this section
pays it: the bottleneck is a number, the number follows from the instruction
mix, and once it is on the page it explains why the rest of this chapter and
the whole of the next one exist.

The stored-program commitment is that instructions and data occupy the same
addressable store, and that nothing in the store marks which is which — the
processor decides by how it chooses to use a word. Every convenience of a
general-purpose computer descends from that decision. A program becomes a file
that can be copied, relocated, generated at run time by another program, or
patched while it sits in memory. So does every cost. One store implies one
port, and the fetch of the next instruction must then queue behind the operand
of the last one.

Because the two chapters that follow all quote the same machine, its parameters
are fixed once here and never quietly changed:

| Parameter of the model machine | Symbol | Value |
|---|---|---|
| core clock | f | 2 GHz |
| memory bus transfer width | — | 4 bytes, one word |
| memory bus transfer rate | B | 500 million words per second |
| instructions that also touch data | f_d | 0.35 of the mix |
| stage delays, IF through WB | — | 200, 100, 150, 200, 100 ps |
| pipeline latch overhead | delta | 20 ps |

Everything numeric below is derived from that table and stated equations. When
a later section needs a quantity the table does not contain, it states the new
assumption in the sentence that introduces it.

## 6.2 The bottleneck, expressed as instructions per second

Let f_d be the fraction of executed instructions that also make a data
reference. Each instruction then costs one memory word for its own fetch plus,
on average, f_d words of operand traffic:

$$W = 1 + f_d$$

A bus delivering B words per second can therefore sustain no more than

$$R_{shared} = B \\,/\\, (1 + f_d)$$

instructions per second, whatever the core is capable of. For the model
machine,

$$W = 1 + 0.35 = 1.35$$

$$R_{shared} = 500 / 1.35 = 370.37$$

million instructions per second. Set that against what the core wants. A 2 GHz
processor with an ideal CPI of one would like to retire 2000 million
instructions per second, so the ratio of appetite to supply is

$$2000 / 370.37 = 5.40$$

The core is starved by a factor of 5.4. No amount of extra execution hardware
changes that figure, because the limit is not in the core at all. This is the
whole argument for caches in one line, and it is why the next chapter is not an
optional extra.

![Sustainable instruction rate against the fraction of instructions that also touch data. The upper curve is a split instruction and data bus, whose ceiling is the instruction stream alone at 500 million per second; the lower curve is one shared bus at B divided by one plus f, which falls to 370 million per second at the model mix of f equal to 0.35, against the 2000 million a 2 GHz core could retire.](/courses/fe-ee/figures/sys2-arch-bottleneck.svg)

## Worked example 6.1 — how much bus does a target rate need?

**Given.** The same mix, f_d = 0.35, and a required sustained rate of 800
million instructions per second. What bus rate B is needed, and what data
bandwidth does that represent in bytes?

**Work.** Invert the ceiling expression:

$$B = R \\times (1 + f_d)$$

$$B = 800 \\times 1.35 = 1080$$

million words per second. At four bytes per word that is

$$1080 \\times 4 = 4320$$

megabytes per second. **Answer: 1080 million transfers per second, about 4.32
GB/s.** Notice that the answer is more than the instruction rate by exactly the
factor 1.35, which is the only thing the mix contributes.

## 6.3 What a second bus buys

Give the machine separate instruction and data paths, as Section 1.1's Harvard
column describes. The two streams no longer compete, so the ceiling becomes
whichever stream is busier, and the instruction stream always is while f_d is
below one:

$$R_{split} = B$$

$$R_{split} \\,/\\, R_{shared} = 1 + f_d = 1.35$$

A 35 percent gain for a duplicated bus. That is the honest size of the Harvard
advantage at the bus level, and it is worth noticing that it is a bandwidth
argument rather than a latency argument: nothing got faster, two things simply
stopped waiting for each other.

## Worked example 6.2 — the same loop on one port and on two

**Given.** The eight-instruction dot-product loop body of Section 10.2, run for
100 passes, on a five-stage pipeline. In the Harvard version instruction fetch
and data access use separate ports. In the von Neumann version they share one,
so no instruction can be fetched in a cycle that a load or a store is using
memory.

**Work.** Both machines were stepped cycle by cycle rather than estimated. The
split-port machine finishes the 800 instructions in 1102 cycles:

$$CPI_{split} = 1102 / 800 = 1.3775$$

The single-port machine finishes them in 1202 cycles:

$$CPI_{shared} = 1202 / 800 = 1.5025$$

so the structural hazard costs

$$1.5025 - 1.3775 = 0.125$$

cycles per instruction, and the whole loop takes

$$1202 / 1102 = 1.091$$

times as long, 9.1 percent more. **Answer: 0.125 CPI, or 9.1 percent of the
run time.**

The interesting part is why the answer is not 0.25. There are two loads per
pass, so a naive count expects two lost fetch cycles per pass; the stepper
reports one. The second conflict lands inside the bubble the machine was
already paying for the load-use hazard, and a cycle you have already lost
cannot be lost twice. Estimating structural hazards by counting the offending
instructions therefore overstates the damage whenever the pipeline is already
stalled, which is exactly when structural hazards are most likely.

## 6.4 Why modern machines are neither, quite

A pure Harvard machine cannot execute a program it has just written, because
the instruction port cannot see what the data port stored. That is intolerable
for anything with a compiler, a loader, or a just-in-time translator. So real
processors split only the level closest to the core — separate first-level
instruction and data caches, giving two ports where the traffic is heaviest —
and unify everything below, preserving the single address space the software
depends on. The label for that arrangement is **modified Harvard**, and it is
an engineering compromise rather than a third idea: Harvard bandwidth at the
top, von Neumann semantics everywhere else.

**How the exam asks this.** Either qualitatively, naming which architecture
shares a bus and which does not, or quantitatively, giving a bus rate and an
instruction mix and asking for the sustainable instruction rate. For the second
kind, count the memory words one instruction costs — always one for the fetch,
plus the data references — and divide the bus rate by that.`,
      examTip: 'The sustainable instruction rate on a shared bus is B/(1 + f_d), not B. The single most common error is to forget that the instruction fetch is itself a memory reference, which makes every data-reference fraction look one whole word too generous.',
      importantNote: 'A split bus is worth exactly the factor 1 + f_d at the bus level, which is 1.35 for a mix with 35 percent data references — not the two times that "twice the buses" suggests. The instruction stream is present on every instruction and the data stream is not.',
    },
    { id: 'arch-encoding', title: '7. Instruction Formats: What Fits in Thirty-Two Bits',
      content: `## 7.1 An instruction is a fixed budget of bits

Section 4.3 asked where the operand lives. This section asks the harder
question that decides the answer: how many bits are there to say it in? On a
machine with fixed 32-bit instructions the budget is exactly 32, every field
competes with every other field, and every architectural nicety — more
registers, longer immediates, further branches — is paid for out of the same
purse.

Start with the register file. Naming one register out of R takes

$$b_{reg} = \\log_2 R$$

bits, so a machine with 32 registers spends

$$b_{reg} = \\log_2 32 = 5$$

bits per register name. Reserve six bits for the opcode, which distinguishes
64 basic operations, and the three-register arithmetic format lays out like
this:

| Field | Purpose | Width |
|---|---|---|
| opcode | which operation | 6 |
| rs | first source register | 5 |
| rt | second source register | 5 |
| rd | destination register | 5 |
| extra | shift amount, function select | 11 |

The three register fields cost

$$3 \\times 5 = 15$$

bits, and what remains for everything else is

$$32 - 6 - 15 = 11$$

bits. Those eleven bits are not spare: they are what lets one opcode value
cover a family of related operations, which is how a six-bit opcode field ends
up naming far more than 64 instructions.

## 7.2 Trading a register field for a constant

Immediate and load-store instructions need a number rather than a third
register, so they give up one register field and merge the leftovers:

$$32 - 6 - 10 = 16$$

bits of immediate. Sixteen bits signed spans

$$-32768 \\;\\text{to}\\; +32767$$

which covers ordinary constants and ordinary structure offsets, and misses
large addresses entirely. That miss is the reason such machines have an
instruction whose only job is to load a constant into the upper half of a
register: two instructions build a 32-bit constant out of two 16-bit fields,
and the compiler emits the pair only when it must.

## Worked example 7.1 — what a branch can reach

**Given.** A conditional branch carries the 16-bit signed immediate above,
counted in instruction words of four bytes, applied to the incremented program
counter as Section 4.2 established.

**Work.** The displacement spans plus or minus 2 to the fifteenth words:

$$2^{15} = 32768$$

words in each direction, which in bytes is

$$32768 \\times 4 = 131072$$

**Answer: plus or minus 128 KB.** A loop or an if-else inside one function is
always well within that, which is why the format spends only sixteen bits on
it. A call to a distant function is not, which is why calls use a different
format.

## Worked example 7.2 — what a jump can reach

**Given.** The jump format spends six bits on the opcode and gives everything
else to the target field, again counted in four-byte words.

**Work.** The target field is

$$32 - 6 = 26$$

bits wide, so it names 2 to the twenty-sixth words:

$$2^{26} = 67108864$$

words, and in bytes

$$67108864 \\times 4 = 268435456$$

**Answer: 256 MB of reach.** The usual exam trap is to report 64 MB by
forgetting that the field counts words rather than bytes, and word addressing
is exactly what buys the missing factor of four. The remaining bits of the
program counter are not supplied by the instruction at all: they are inherited
from wherever the jump itself sits, which is why a jump cannot leave its own
256 MB region and a long call needs a register-indirect form.

## Worked example 7.3 — can the format afford a fused three-input operation?

**Given.** A proposed multiply-add reads three registers and writes a fourth,
so it needs four register fields inside the same 32-bit word with a six-bit
opcode.

**Work.** The bits available for register names are

$$32 - 6 = 26$$

and four equal fields must each fit in

$$26 / 4 = 6.5$$

bits, so each field can be at most 6 bits, naming 64 registers. Four six-bit
fields consume 24 bits, leaving

$$32 - 6 - 24 = 2$$

bits for everything else. **Answer: yes, but only with a register file of 64 or
fewer and almost no room for sub-opcodes.** This is a real design pressure and
not a curiosity: it is why fixed-length machines that want fused operations
either raise the instruction width, shrink the opcode, or make the destination
implicitly one of the sources.

## 7.3 Why variable length is the other answer

A CISC design refuses the budget instead of balancing it. Instructions run from
one byte to fifteen, a short common operation costs a short encoding, and a
rare operation with an enormous immediate is allowed to be enormous. The
program gets smaller, which mattered enormously when memory was the scarcest
thing in the machine.

What it costs is the ability to know where the next instruction starts without
decoding this one. Fetching four instructions at once requires finding four
boundaries in a byte stream, and finding a boundary means partly decoding.
A fixed-length machine finds the next instruction by adding a constant to the
program counter — Section 4.2's step 2, which is why that step could be written
so simply. That single property is what makes a wide pipeline cheap, and it is
the technical core of the RISC and CISC argument that Section 12 settles
numerically.

| Property | Fixed 32-bit encoding | Variable-length encoding |
|---|---|---|
| Next instruction address | PC plus a constant | known only after decoding |
| Decoding several at once | trivial | requires boundary search |
| Code size | larger | smaller |
| Immediate range | capped by the field | unlimited, at a size cost |
| Addressing modes reachable | few | many |

**How the exam asks this.** Give a word width, an opcode width and a register
count, then ask for a field width or a reach. Compute the register field from
the register count first, subtract everything known from the word width, and
check whether the remaining field counts bytes or words before converting.`,
      examTip: 'Branch and jump displacements are counted in instruction words, not bytes, so multiply the field reach by the instruction length at the end. A 26-bit word-counted jump field reaches 256 MB, not 64 MB.',
      importantNote: 'Register file size and instruction format are not independent choices. Doubling the register count adds one bit to every register field, so a three-address format loses three bits of function space for each doubling — which is why 32 registers is such a common landing point on 32-bit encodings.',
    },
    { id: 'arch-datapath', title: '8. The Datapath, the Control Unit, and Three Ways to Clock Them',
      content: `## 8.1 The datapath is the plumbing, the control unit is the valve

The registers of Section 4.1 and the stages of Section 1.3 describe two halves
of one machine. The **datapath** is everything that holds or moves a value: the
register file, the arithmetic and logic unit, the memory ports, the adders that
compute the next program counter, and the multiplexers that choose among their
inputs. The **control unit** holds no data at all. It reads the opcode sitting
in the instruction register, together with the condition flags in the status
word, and emits the select and enable lines that tell every multiplexer which
input to pass and every register whether to load this cycle.

The division matters because it explains where an instruction set actually
lives in the hardware. Adding an instruction that needs no new datapath — some
new combination of existing paths — costs only control. Adding one that needs a
second adder or a third register-file read port costs datapath, which is
silicon and time. The first is nearly free and the second is not, and that
asymmetry shapes real instruction sets more than any philosophy about
simplicity.

## 8.2 Three ways to clock the same datapath

The stage delays in the model machine of Section 6.1 sum to

$$T_{total} = 200 + 100 + 150 + 200 + 100 = 750$$

picoseconds. That one number can be clocked three ways.

**Single-cycle.** Every instruction completes in one clock, so the clock period
must cover the longest possible path, all 750 ps. CPI is exactly 1 and the
clock rate is

$$1000 / 750 = 1.333$$

GHz, taking picoseconds to gigahertz. Simple, and wasteful: an instruction that
never touches memory still waits out the memory stage.

**Multicycle.** Break the instruction into steps of one stage each, clock at the
slowest single stage, 200 ps, and let each instruction take only the steps it
needs. Now CPI is a weighted average over the instruction mix,

$$CPI = \\sum_i f_i \\; CPI_i$$

which for the mix below evaluates to exactly 4.

| Class | Fraction f_i | Cycles CPI_i | Contribution |
|---|---|---|---|
| ALU | 0.45 | 4 | 1.80 |
| Load | 0.22 | 5 | 1.10 |
| Store | 0.11 | 4 | 0.44 |
| Branch | 0.18 | 3 | 0.54 |
| Jump | 0.04 | 3 | 0.12 |
| **Total** | **1.00** | | **4.00** |

$$CPI_{multi} = 1.80 + 1.10 + 0.44 + 0.54 + 0.12 = 4.00$$

$$T_{multi} = 4.00 \\times 200 = 800$$

picoseconds per instruction — which is **worse** than the single-cycle machine.
That result is not a mistake and it is worth sitting with. Multicycle wins only
when the stage delays are badly unbalanced or when the hardware saved by
reusing one adder across steps matters more than the time. Here the stages are
reasonably even, so slicing gains nothing and the extra cycles cost.

**Pipelined.** Keep the 200 ps period, add the latch overhead of 20 ps that the
stage registers cost, and overlap the instructions so one finishes per cycle:

$$T_{pipe} = 200 + 20 = 220$$

picoseconds per instruction at an ideal CPI of 1, for a speedup over the
single-cycle machine of

$$750 / 220 = 3.409$$

![Cycles per instruction as a weighted average over the instruction mix, swept against the fraction of the mix that is a load. The multicycle curve, the sum of f i times CPI i, passes through 4.00 at the model mix of 22 percent loads; the pipelined curve, one plus the load-use stalls, passes through 1.11 at the same mix and rises far more slowly.](/courses/fe-ee/figures/sys2-arch-cpi-mix.svg)

The figure sweeps the load fraction because that is the parameter a program
controls. The multicycle CPI moves steeply with it, since loads are the
expensive class; the pipelined CPI barely moves, because a pipelined machine
charges for a load only when the very next instruction wants the loaded value.
Two machines, one weighted-average formula, opposite sensitivities.

## Worked example 8.1 — the same mix on a machine with a slow memory

**Given.** The multicycle machine above, except that memory has become slower
and a load now takes 7 cycles instead of 5 while a store takes 6 instead of 4.
Recompute CPI and the time per instruction.

**Work.** Only two terms change:

$$CPI = 1.80 + 1.54 + 0.66 + 0.54 + 0.12 = 4.66$$

taking the load term as 0.22 times 7 and the store term as 0.11 times 6. At the
same 200 ps clock,

$$T = 4.66 \\times 200 = 932$$

picoseconds. **Answer: CPI 4.66, 932 ps per instruction, 16.5 percent slower.**
The check worth running is that the untouched classes contributed 1.80, 0.54
and 0.12 before and after; if a recomputed weighted average moves a term you
did not change, the mix has been renormalised by mistake.

## 8.3 Hardwired control against microprogrammed control

The control unit can be built two ways, and the choice is the oldest
performance-versus-flexibility trade in the field.

A **hardwired** control unit is a finite state machine in gates. It is fast,
because a signal is one or two gate delays from the opcode bits, and it is
rigid, because changing the instruction set means changing the logic.

A **microprogrammed** control unit stores the control signals in a small fast
memory. Each entry — a microword — holds one cycle's worth of control lines
plus the address of the next microword. Executing a machine instruction means
running a short program out of that store. It is slower by the access time of
the control store and endlessly flexible, since a new instruction is a new
sequence of microwords rather than new gates.

## Worked example 8.2 — sizing a control store

**Given.** A microprogrammed unit that drives 32 control signals, uses a 6-bit
next-address field, and holds 512 microwords. How large is the control store?

**Work.** Each microword is

$$32 + 6 = 38$$

bits wide, so the store holds

$$512 \\times 38 = 19456$$

bits, which is

$$19456 / 8 = 2432$$

bytes. **Answer: 2432 bytes, under 2.4 KB.** The trap is to give the
next-address field its own separate memory and add the two sizes; it is part of
the same word, read in the same access, because it must be available in the
same cycle as the signals it accompanies.

| | Hardwired control | Microprogrammed control |
|---|---|---|
| Implementation | combinational logic and a state register | a control store plus a sequencer |
| Speed | fastest available | limited by the control store access |
| Changing the instruction set | redesign the logic | rewrite the microcode |
| Natural fit | simple, regular instruction sets | complex, variable instruction sets |
| Where it dominates | RISC pipelines | CISC decoders, and patchable microcode today |

**How the exam asks this.** Most often as a matching question — which control
style suits which instruction set — and occasionally as the control-store
arithmetic of Worked example 8.2. For the arithmetic, count the bits of one
microword first, then multiply by the number of microwords, then divide by
eight only at the very end.`,
      examTip: 'Multicycle is not automatically faster than single-cycle. Compute CPI times the clock period for both: if the stage delays are nearly equal, slicing the instruction into steps costs more in cycles than it recovers in clock rate.',
      importantNote: 'A weighted-average CPI is only valid when the class fractions sum to one. If a problem changes the mix, renormalise before weighting; if it changes only the cycle counts, the untouched contributions must come out identical, which is the fastest available check on the arithmetic.',
    },
    { id: 'arch-perf-equation', title: '9. The Performance Equation, One Factor at a Time',
      content: `## 9.1 Where the three factors come from

Section 3 used execution time as a formula. It is worth deriving, because the
derivation is the reason the formula cannot be argued with. Execution time is
cycles times the length of a cycle:

$$T = C \\times \\tau$$

and the cycle count is the instruction count times the average cycles each
instruction takes:

$$C = IC \\times CPI$$

Substituting, and writing the clock period as the reciprocal of the frequency,

$$T = IC \\times CPI \\times \\tau$$

$$T = \\frac{IC \\times CPI}{f}$$

Three factors, and each is owned by a different part of the system. The
**instruction count** belongs to the algorithm, the compiler and the
instruction set. The **CPI** belongs to the microarchitecture and to the
program's own behaviour. The **clock frequency** belongs to the circuit design
and the process technology. Nothing else can change the run time, which is what
makes the equation useful: any claimed improvement has to enter through one of
these three doors, and asking which one is often enough to deflate it.

## 9.2 Moving one factor at a time

Take a base machine running a program with 2 billion instructions at a CPI of
2.5 on a 2 GHz clock. Its run time is

$$T = 2 \\times 2.5 / 2 = 2.5$$

seconds, working in units of 10 to the ninth for the count and gigahertz for
the clock. Now improve exactly one factor by 20 percent, three times over.

**Better compiler, 20 percent fewer instructions:**

$$T = 1.6 \\times 2.5 / 2 = 2.0$$

**Better microarchitecture, CPI down 20 percent to 2.0:**

$$T = 2 \\times 2.0 / 2 = 2.0$$

**Better process, clock period down 20 percent so the frequency is 2.5 GHz:**

$$T = 2 \\times 2.5 / 2.5 = 2.0$$

All three give the same answer, and the same speedup:

$$2.5 / 2.0 = 1.25$$

| Change | IC (billions) | CPI | Clock (GHz) | Time (s) | Speedup |
|---|---|---|---|---|---|
| Base machine | 2.0 | 2.5 | 2.0 | 2.50 | 1.00 |
| 20% fewer instructions | 1.6 | 2.5 | 2.0 | 2.00 | 1.25 |
| CPI 20% lower | 2.0 | 2.0 | 2.0 | 2.00 | 1.25 |
| Clock period 20% shorter | 2.0 | 2.5 | 2.5 | 2.00 | 1.25 |

The symmetry is not a coincidence. Time is a product of three factors, so a
proportional change in any one of them scales the product identically. This is
worth remembering under exam pressure, because it means a question asking which
of three improvements helps most is either asking for arithmetic on unequal
percentages, or is a trick.

## Worked example 9.1 — the improvement that argues with itself

**Given.** A compiler option removes 400 million instructions from the 2 billion
above, and every instruction it removes is a simple one that took a single
cycle. What is the real speedup?

**Work.** Count cycles, not instructions. The base machine spends

$$C = 2 \\times 2.5 = 5.0$$

billion cycles. Removing 400 million single-cycle instructions removes 400
million cycles:

$$C = 5.0 - 0.4 = 4.6$$

billion. The new instruction count is 1.6 billion, so the new CPI is

$$CPI = 4.6 / 1.6 = 2.875$$

which has gone **up**, and the new run time at 2 GHz is

$$T = 4.6 / 2 = 2.3$$

seconds, for a speedup of

$$2.5 / 2.3 = 1.087$$

**Answer: 1.087, not the 1.25 that the 20 percent instruction reduction
suggests.** The trap is treating the three factors as independent. They are
independent in the algebra and coupled in reality: removing the cheapest
instructions raises the average cost of the ones that remain. Anyone who
applies the 1.25 from Section 9.2 here has assumed CPI stayed at 2.5, which
would require the removed instructions to have been exactly average.

## Worked example 9.2 — why MIPS ranks machines wrongly

**Given.** Machine A runs at 2 GHz with a CPI of 2.5 on this program. Machine B
runs at 1.5 GHz with a CPI of 1.5, but its instruction set is simpler, so the
same program takes 1.3 times as many instructions. Which machine wins, and what
does the MIPS rating say?

**Work.** Millions of instructions per second is the clock in megahertz divided
by the CPI:

$$MIPS_A = 2000 / 2.5 = 800$$

$$MIPS_B = 1500 / 1.5 = 1000$$

so B looks 25 percent faster. Now compute run time, taking A's instruction
count as one unit:

$$T_A = 1.0 \\times 2.5 / 2.0 = 1.25$$

$$T_B = 1.3 \\times 1.5 / 1.5 = 1.30$$

in the same arbitrary units, so

$$T_B / T_A = 1.3 / 1.25 = 1.04$$

**Answer: A is faster by 4 percent, despite a MIPS rating 25 percent lower.**
The distractor is the MIPS number itself. It divides out the instruction count,
which is precisely the factor that differs between the two instruction sets, so
it can only compare machines that execute the same instructions. A rate whose
unit is "instructions" is meaningless across machines whose instructions do
different amounts of work.

## Worked example 9.3 — recovering an unknown factor

**Given.** A program of 800 million instructions runs in 0.40 s on a 1.6 GHz
machine. What is its CPI, and what clock rate would be needed to reach 0.25 s
with the same binary and the same microarchitecture?

**Work.** Rearranging the performance equation for CPI,

$$CPI = \\frac{T \\times f}{IC}$$

$$CPI = 0.40 \\times 1600 / 800 = 0.80$$

taking the clock in megahertz and the count in millions. A CPI below one means
the machine retires more than one instruction per cycle, so it is superscalar.
For the target time, rearrange for frequency:

$$f = \\frac{IC \\times CPI}{T}$$

$$f = 800 \\times 0.80 / 0.25 = 2560$$

megahertz. **Answer: CPI 0.80, and 2.56 GHz.** The trap is to scale the clock
by the time ratio in the wrong direction; the sanity check is that a shorter
target time must demand a higher frequency, and 2560 is above 1600.

**How the exam asks this.** Almost always as a comparison between two machines
on one program, or as a single-factor improvement. Write the equation, fill in
what is given, and never compare clock rates or MIPS ratings directly.`,
      examTip: 'Execution time is the only honest comparison. Clock rate ignores CPI, MIPS ignores instruction count, and both can rank two machines in the opposite order to the one a stopwatch would give.',
      importantNote: 'The three factors are algebraically independent and physically coupled. A change that moves instruction count almost always moves CPI as well, so a problem that supplies the new cycle count instead of the new CPI is telling you it expects the coupling to be honoured.',
    },
    { id: 'arch-pipe-derive', title: '10. Pipelining: the Speedup Derived, the Depth Optimised',
      content: `## 10.1 The speedup expression, and what limits it

A non-pipelined machine whose work divides into k stages of tau each takes k
tau per instruction, so n instructions cost

$$T_{seq} = n \\, k \\, \\tau$$

A pipelined machine issues one instruction per cycle after the first has filled
the pipe, so it needs the fill plus one cycle each thereafter, as Section 5.1
established:

$$C_{pipe} = k + (n - 1)$$

$$T_{pipe} = [k + (n - 1)] \\, (\\tau + \\delta)$$

where delta is the latch overhead the stage registers impose. The speedup is
the ratio:

$$S = \\frac{n \\, k \\, \\tau}{[k + (n - 1)](\\tau + \\delta)}$$

Two limits are worth reading off. With no latch overhead and a very large n,
the bracket approaches n and the speedup approaches k — the familiar claim that
a k-stage pipeline is k times faster. With a realistic delta it approaches

$$S_{\\infty} = \\frac{k \\, \\tau}{\\tau + \\delta}$$

which is strictly less than k and falls further behind as the stages get
shorter, because delta does not shrink with them. Latch overhead is the reason
pipelines cannot be made arbitrarily deep, and Section 10.4 turns that into a
number.

## 10.2 A real loop body, stepped rather than estimated

Estimating stalls by inspection is where marks are lost, so this section
counts them by stepping the machine. The body is an ordinary dot-product
kernel: load an element from each of two arrays, multiply, accumulate, bump
both pointers, decrement the counter, branch back.

![Space-time chart of one dot-product loop body through a five-stage pipeline, produced by stepping the pipeline cycle by cycle rather than drawn by hand. The multiply waits one bubble for the second load to leave the memory stage, and the taken branch resolves in the execute stage, so the two instructions fetched behind it are squashed and the next pass is fetched two cycles late.](/courses/fe-ee/figures/sys2-arch-pipe-schedule.svg)

Two disturbances appear, and only two. The multiply needs the value the second
load is fetching, and a load's value does not exist until its memory stage
ends, so one bubble is unavoidable — the load-use hazard of Section 5.3. The
branch is resolved in the execute stage and is taken, so the two instructions
fetched behind it are on the wrong path and are squashed.

Run the loop 100 times. The stepped machine reports 1102 cycles for 800
instructions, which the closed form reproduces exactly:

$$C = 5 + 799 + 100 + 198 = 1102$$

reading the terms as fill, the remaining instructions, one bubble per pass, and
two squashed fetches on each of the 99 taken branches. The last pass falls
through, so it costs no flush. Hence

$$CPI = 1102 / 800 = 1.3775$$

## Worked example 10.1 — what the compiler can remove for free

**Given.** The same loop, but the compiler lifts one pointer increment into the
slot between the second load and the multiply, so the multiply no longer sits
immediately behind the load it depends on. Nothing is added or removed; one
instruction moves.

**Work.** Stepping the reordered trace gives 1002 cycles for the same 800
instructions:

$$CPI = 1002 / 800 = 1.2525$$

$$1102 / 1002 = 1.0998$$

**Answer: 10.0 percent faster, from moving a single instruction.** The bubble
count went from 100 to zero; the 198 flush cycles did not move, because
scheduling cannot help a branch that is genuinely taken. The distractor here is
to expect the whole 1.3775 to collapse toward 1.0: it cannot, because the
control cost is untouched and it is twice the size of the data cost.

## Worked example 10.2 — putting a perfect predictor on top

**Given.** The scheduled loop again, now with a branch predictor that is right
every time, so a taken branch costs nothing.

**Work.** Stepping this configuration gives 804 cycles:

$$CPI = 804 / 800 = 1.005$$

**Answer: CPI 1.005, within half a percent of the ideal.** The four cycles above
800 are the pipeline fill, which never goes away and is invisible in any real
program. Compare the three configurations:

| Configuration | Cycles for 800 instructions | CPI | Bubbles | Flushes |
|---|---|---|---|---|
| Unscheduled, no prediction | 1102 | 1.3775 | 100 | 198 |
| Scheduled, no prediction | 1002 | 1.2525 | 0 | 198 |
| Scheduled, perfect prediction | 804 | 1.005 | 0 | 0 |

Reading down the flush column tells the design story of the last thirty years:
once the compiler has removed the data stalls, essentially all the remaining
loss is control, and that is why branch prediction rather than scheduling is
where the silicon went.

## Worked example 10.3 — what forwarding is worth

**Given.** One pass of the unscheduled loop, eight instructions, with and
without forwarding. Without it, a dependent instruction must wait until its
producer has written the register file.

**Work.** Stepped both ways, the pass takes 13 cycles with forwarding and 18
without:

$$18 / 13 = 1.385$$

**Answer: forwarding is worth 38.5 percent on this body, and it costs no
cycles at all — only wires, multiplexers and comparators.** The trap is to
assume forwarding removes every data stall; it removes the ones whose value
already exists somewhere in the pipeline, and the surviving 13 cycles still
contain the load-use bubble that no wire can remove, because that value has not
been read from memory yet.

## 10.3 The three hazard classes, priced

| Hazard | What causes it | Cure | Cost after the cure |
|---|---|---|---|
| Structural | two stages want one resource | duplicate the resource | 0, and 0.125 CPI if not duplicated, from Worked example 6.2 |
| Data, arithmetic | operand still inside the pipeline | forwarding | 0 |
| Data, load-use | operand not yet out of memory | schedule an instruction into the gap | 1 cycle if the gap cannot be filled |
| Control | fetches behind a branch are wrong | prediction, or resolve earlier | penalty times misprediction rate |

## 10.4 How deep should the pipeline be?

Splitting a fixed 750 ps of logic into k stages gives a period of

$$\\tau_k = 750 / k + 20$$

picoseconds, which falls as k rises. But a branch is resolved roughly halfway
down the pipe, so the misprediction penalty grows with depth as

$$P(k) = k / 2 - 1$$

stages. With 20 percent branches at 90 percent prediction accuracy, the cycles
per instruction become

$$CPI(k) = 1 + 0.02 \\, P(k)$$

and the time per instruction is the product of the two, which has a genuine
minimum.

![Time per instruction against pipeline depth. The dashed curve is the clock period alone, 750 over k plus 20 picoseconds, which falls monotonically; the solid curve multiplies it by the cycles per instruction that the growing misprediction penalty causes, and it reaches a minimum of 51.35 picoseconds at 61 stages before rising again. The classic five-stage machine sits at 175.1 picoseconds.](/courses/fe-ee/figures/sys2-arch-pipe-depth.svg)

At five stages the period is 170 ps and the CPI is 1.03, so

$$t(5) = 1.03 \\times 170 = 175.1$$

picoseconds per instruction. At 61 stages the period has fallen to 32.295 ps
while the CPI has risen to 1.59, and the product is

$$t(61) = 1.59 \\times 32.295 = 51.35$$

picoseconds — the minimum. Past that point each extra stage buys less period
than it costs in mispredictions, and the curve turns upward. Real processors
stop well short of 61 for reasons this model omits, chiefly power and the cost
of the recovery logic, but the shape is right and it is the shape that matters:
depth is an optimum, not a direction.

## 10.5 The branch penalty as a design knob

Section 3.2 computed the effective CPI for a 70 percent accurate predictor with
a two-cycle penalty. Generalising,

$$CPI = 1 + f_{br} \\, (1 - a) \\, P$$

with f_br the branch fraction, a the accuracy and P the penalty in cycles.

![Cycles per instruction against branch prediction accuracy for penalties of two, five and ten cycles, with twenty percent of instructions being branches. The lines share the point of one at perfect accuracy and fan out as accuracy falls, the slope being the penalty; a ten-cycle machine at 95 percent accuracy lands on exactly the same CPI as a two-cycle machine at 75 percent.](/courses/fe-ee/figures/sys2-arch-branch-penalty.svg)

The figure carries one lesson that the algebra hides. Accuracy and penalty
trade against each other exactly, because they appear only as a product:

$$CPI = 1 + 0.20 \\times 0.05 \\times 10 = 1.10$$

$$CPI = 1 + 0.20 \\times 0.25 \\times 2 = 1.10$$

A deep machine with an excellent predictor and a shallow machine with a poor
one land on the same throughput. Whether the deep machine is nonetheless
better depends entirely on how much clock rate its depth bought, which is the
question Section 10.4 answered.

**How the exam asks this.** Give stages, instruction count and a list of
disturbances, then ask for cycles, CPI or speedup. Use fill plus instructions
minus one, add the stalls and the flushes explicitly, and read the question
twice to see which baseline the speedup is against.`,
      examTip: 'Count flushes per taken branch, not per branch. A loop that iterates 100 times executes the branch 100 times but takes it only 99, and the fall-through pass costs nothing — an off-by-one that changes the flush total by the whole penalty.',
      importantNote: 'Deeper pipelines raise the clock and raise the misprediction penalty together, so time per instruction has a minimum rather than falling forever. On the model machine of Section 6.1 that minimum sits at 61 stages and 51.35 ps, and beyond it every extra stage is a net loss.',
    },
    { id: 'arch-amdahl-limits', title: '11. Amdahl\'s Law, Derived and Applied',
      content: `## 11.1 The derivation is three lines

Split a program's run time into the part that can be sped up and the part that
cannot. Let p be the fraction of the original time spent in the improvable
part, so 1 minus p is spent in the rest. Speed the improvable part by a factor
N and leave the rest alone:

$$T(N) = (1 - p) \\, T_1 + \\frac{p \\, T_1}{N}$$

Divide the original time by the new one to get the speedup:

$$S(N) = \\frac{1}{(1 - p) + p/N}$$

and let N grow without bound. The second term vanishes and what is left is the
ceiling:

$$S_{\\infty} = \\frac{1}{1 - p}$$

The whole of Amdahl's law is that last line. Whatever you do to part of a
program, the part you did not touch survives, and eventually it is all that is
left. Note that p is a fraction of **time**, not of code: a loop that is three
lines of a thousand-line program can easily be 95 percent of its run time, and
a thousand lines of setup can easily be 1 percent.

![Speedup against the number of workers for parallel fractions of 0.50, 0.90 and 0.95, with each curve flattening against its own dashed ceiling at two, ten and twenty times. Eight workers on a program that is 90 percent parallel return 4.71 times, not eight.](/courses/fe-ee/figures/sys2-arch-amdahl.svg)

## Worked example 11.1 — eight workers on a mostly parallel program

**Given.** A program is 90 percent parallel by time. What speedup do eight
processors give, and what is the ceiling?

**Work.** The serial remainder is 0.10 and the parallel part is divided by 8:

$$0.10 + 0.90 / 8 = 0.2125$$

$$S(8) = 1 / 0.2125 = 4.71$$

and the ceiling is

$$S_{\\infty} = 1 / 0.10 = 10$$

**Answer: 4.71 times on eight processors, against a ceiling of 10.** Two
distractors sit close by. The first is answering 8, which assumes the whole
program parallelises. The second is answering 7.2, which is 0.90 times 8 —
scaling the speedup by the parallel fraction instead of scaling the time. That
second error is the common one and it always overstates, because it forgets
that the serial part still has to run.

This result was confirmed a second way, by list-scheduling ten thousand equal
parallel tasks onto eight workers and measuring the makespan rather than
evaluating the formula; the simulated speedup agrees with 4.7058823 to nine
decimal places.

| Parallel fraction p | S on 8 workers | S on 64 workers | Ceiling |
|---|---|---|---|
| 0.50 | 1.78 | 1.97 | 2 |
| 0.90 | 4.71 | 8.77 | 10 |
| 0.95 | 5.93 | 15.42 | 20 |
| 0.99 | 7.48 | 39.26 | 100 |

Read across the p = 0.90 row: going from 8 workers to 64, an eightfold increase
in hardware, buys 1.86 times more speed. Read down the last column to see why
the industry cares so much about the last few percent of parallelism.

## Worked example 11.2 — the inverse question

**Given.** A budget allows 16 processors and the target is a speedup of 8. How
parallel must the program be?

**Work.** Set the speedup expression equal to 8 and solve for p:

$$\\frac{1}{8} = (1 - p) + \\frac{p}{16}$$

$$0.125 = 1 - p + 0.0625 \\, p$$

$$p = 0.875 / 0.9375 = 0.9333$$

**Answer: 93.33 percent parallel.** Half the machine's processors are being
bought to overcome the last 6.7 percent of serial code, which is the practical
reading. The trap is to answer 0.50, reasoning that a speedup of 8 out of 16 is
"half" — the relationship is not linear anywhere.

## 11.2 Amdahl applied to a component, not to a parallel machine

The law is usually taught about processors, but nothing in the derivation
mentions them. p is any fraction of run time and N is any speedup of that
fraction, so the same three lines price a cache, a floating-point unit or a
faster disk.

Take the model machine's CPI of 2.5, of which 1.2 cycles per instruction are
memory stalls. The fraction of time spent stalled is

$$1.2 / 2.5 = 0.48$$

so a perfect memory system, one that never stalls at all, would give

$$S = 1 / 0.52 = 1.923$$

**Under twice as fast, for a memory system that cannot be built.** That is the
most useful thing Amdahl's law does: it prices the best possible version of an
improvement before anyone spends a year building a mediocre one. If 1.92 is not
worth having, the project is finished before it starts.

## 11.3 Where the law is quietly wrong

Amdahl's law holds the problem size fixed. That is the right assumption when
you have one job and want it done sooner, and the wrong one when more machine
means a bigger job — a finer mesh, a longer simulation, a larger training set.
When the serial part stays roughly constant while the parallel part grows with
the machine, the achievable speedup grows nearly linearly with N instead of
flattening. That observation is Gustafson's rescaling of the same algebra, and
it is not a refutation: it answers a different question. Amdahl asks how much
sooner a fixed job finishes; Gustafson asks how much bigger a job can be
attempted in a fixed time. An exam question that mentions a fixed workload
wants Amdahl.

**How the exam asks this.** A fraction and a speedup factor, then the resulting
overall speedup, or the ceiling. Put the improved fraction over N and leave the
rest alone; if the question gives a fraction of instructions rather than a
fraction of time, convert it first, because the law only knows about time.`,
      examTip: 'p is a fraction of time, never of code or of instructions. If a question gives "40 percent of the instructions", convert to a time fraction using the cycle counts before applying the law, or the answer will be wrong in the optimistic direction.',
      importantNote: 'Amdahl bounds an enhancement before it is built. If the ideal, infinitely fast version of a subsystem gives an overall speedup that is not worth having, no achievable version of it is worth having either, and the analysis costs one line.',
    },
    { id: 'arch-risc-cisc-memory', title: '12. RISC against CISC as Arithmetic, and Where the Cycles Go Next',
      content: `## 12.1 The argument is a trade between two factors of one product

Section 1.2 tabulated RISC against CISC as a list of adjectives. The
performance equation turns the same comparison into arithmetic, because the two
designs move different factors of the same product in opposite directions.

A CISC instruction does more, so a program needs fewer of them: the instruction
count is low. Each one does more, and the decoding is harder, so the cycles per
instruction are high. A RISC design takes the opposite side on both. The clock
usually favours RISC as well, since a simple fixed-length decode is a shorter
critical path.

Put numbers on it. Normalise the CISC instruction count to one unit and take a
CPI of 3.6 at 2.0 GHz. Give the RISC machine a CPI of 1.15 at 2.4 GHz, and
charge it 1.45 times the instructions for the same work:

$$T_{CISC} = 1.0 \\times 3.6 / 2.0 = 1.80$$

$$T_{RISC} = 1.45 \\times 1.15 / 2.4 = 0.6948$$

nanoseconds per unit of work, so

$$1.80 / 0.6948 = 2.591$$

**The RISC machine is 2.59 times faster while executing 45 percent more
instructions.** Anyone comparing the two by instruction count alone gets the
answer exactly backwards.

## Worked example 12.1 — how much code expansion could RISC survive?

**Given.** The same two machines. At what code expansion factor e would the
RISC machine lose its advantage entirely?

**Work.** Set the two run times equal, with e as the unknown instruction ratio:

$$e \\times \\frac{1.15}{2.4} = \\frac{3.6}{2.0}$$

$$e = 1.80 \\times 2.4 / 1.15 = 3.7565$$

**Answer: about 3.76 times.** The RISC compiler could emit nearly four times as
many instructions as the CISC compiler and the two machines would still finish
together.

![Execution time of the RISC machine relative to the CISC machine, against the code expansion factor. The line rises from 0.386 at an expansion of 1.45 and crosses equal execution time at an expansion of 3.76, so the RISC design would have to emit nearly four times the instructions before losing.](/courses/fe-ee/figures/sys2-arch-risc-cisc.svg)

The figure is the whole argument in one line, and its slope is the point: the
break-even is far to the right of any real code expansion, which is why the
industry stopped arguing about instruction counts. What actually settled the
question was that a fixed-length encoding is what makes a deep pipeline and a
wide issue affordable — Section 7.3's boundary problem — while modern CISC
processors translate their variable-length instructions into fixed-length
internal operations and pipeline those. The visible instruction set became a
compatibility interface, and the machine underneath it is a RISC.

## Worked example 12.2 — the CISC instruction that is not worth having

**Given.** A CISC machine offers a single string-copy instruction taking 40
cycles. The equivalent RISC sequence is a 4-instruction loop body at a CPI of
1.2, iterated once per byte, copying 8 bytes.

**Work.** The RISC sequence executes

$$4 \\times 8 = 32$$

instructions, costing

$$32 \\times 1.2 = 38.4$$

cycles. **Answer: 38.4 cycles against 40, so the complex instruction is
slightly slower.** This is the empirical finding that started the RISC
argument: measured against real compiler output, a good fraction of the complex
instructions were slower than the simple sequences they replaced, and compilers
were not emitting them anyway. The distractor is to compare 1 instruction with
32 and declare the CISC version 32 times better.

## 12.2 Where the remaining cycles actually are

Everything so far has assumed memory answers instantly. Restoring the cost is
what motivates the next chapter, and it takes one term. Add to the ideal CPI
the stalls caused by memory:

$$CPI = CPI_{exec} + m_{refs} \\times r_{miss} \\times P_{miss}$$

where m_refs is memory references per instruction, r_miss the miss rate and
P_miss the miss penalty in cycles. For the model machine — one instruction
fetch plus 0.35 data references, a 2 percent miss rate, and a 100-cycle penalty
to main memory:

$$CPI = 1 + 1.35 \\times 0.02 \\times 100 = 3.70$$

against an ideal of 1. The fraction of cycles that are memory stalls is

$$2.7 / 3.7 = 0.730$$

**Seventy-three percent of the machine's cycles are spent waiting**, and the
speedup a perfect cache would give is 3.7. Every technique in this chapter —
forwarding, scheduling, prediction, depth — has been fighting over the other
twenty-seven percent.

## Worked example 12.3 — why doubling the clock barely helps

**Given.** The same machine, with the clock doubled. Memory does not get
faster, so the 100-cycle penalty becomes 200 cycles.

**Work.** The new CPI is

$$CPI = 1 + 1.35 \\times 0.02 \\times 200 = 6.40$$

Each cycle is now half as long, so in the old machine's cycle units the time
per instruction is

$$6.40 / 2 = 3.20$$

against 3.70 before, a speedup of

$$3.70 / 3.20 = 1.156$$

**Answer: 15.6 percent, for twice the clock.** This is the memory wall stated
in the cleanest available way: an improvement that does not touch memory is
throttled by the fraction of time memory owns, exactly as Amdahl's law in
Section 11.2 predicted. The trap is to answer 2.0, which assumes the miss
penalty is measured in nanoseconds rather than in cycles.

**How the exam asks this.** Either a direct comparison of two machines on one
program, which is the performance equation again, or a CPI-with-stalls
calculation. For the second, be careful that memory references per instruction
includes the instruction fetch itself, and that the penalty is in cycles.`,
      examTip: 'RISC and CISC differ in which factor of IC times CPI over f they optimise, so neither instruction count nor CPI alone decides anything. Multiply the three factors out before answering.',
      importantNote: 'Memory references per instruction is 1 plus the data-reference fraction, because every instruction is itself fetched from memory. Dropping the fetch term understates the stall CPI by roughly three quarters on a typical mix.',
    },
    { id: 'arch-problems', title: '13. Problem Sets',
      content: `## Problem Set A — the performance equation and instruction formats

**A1.** A program executes 1.5 billion instructions with a CPI of 1.8 on a
3 GHz processor. Find the execution time.

*Answer.* Apply the equation directly:

$$T = 1.5 \\times 1.8 / 3 = 0.90$$

seconds, working in billions and gigahertz. **0.90 s.** The distractor is
1.5 divided by 3, giving 0.50 s, which is the answer for a machine with a CPI
of one and simply forgets to charge for the 1.8.

**A2.** The same program is recompiled and now executes 1.2 billion
instructions, but the removed instructions were all single-cycle. Find the new
CPI and the new time.

*Answer.* The original cycle count is

$$C = 1.5 \\times 1.8 = 2.70$$

billion. Removing 300 million single-cycle instructions removes 0.30 billion
cycles:

$$C = 2.70 - 0.30 = 2.40$$

$$CPI = 2.40 / 1.2 = 2.00$$

$$T = 2.40 / 3 = 0.80$$

seconds. **CPI 2.00, time 0.80 s.** The trap is holding CPI at 1.8 and
reporting 1.2 times 1.8 over 3, which gives 0.72 s — a 25 percent gain claimed
where the real gain is 12.5 percent.

**A3.** Machine P runs at 2.5 GHz with a CPI of 1.6. Machine Q runs at 3.2 GHz
with a CPI of 2.4. Which has the higher MIPS rating, and which runs a given
program faster if both execute the same instructions?

*Answer.* The MIPS ratings are

$$MIPS_P = 2500 / 1.6 = 1562.5$$

$$MIPS_Q = 3200 / 2.4 = 1333.3$$

Since the instruction counts are identical, MIPS and speed agree here and P
wins on both. **P, on both counts.** The point of the problem is that this
agreement is a special case: it holds only because the instruction counts are
equal, and Worked example 9.2 shows what happens when they are not.

**A4.** A 32-bit fixed-length instruction set has 64 registers and needs to
encode 100 distinct operations. How many bits remain in a three-register format
after the opcode and the register fields?

*Answer.* Naming 64 registers takes

$$\\log_2 64 = 6$$

bits, so three fields cost

$$3 \\times 6 = 18$$

bits. Encoding 100 operations needs 7 bits, since 6 bits reach only 64.
What remains is

$$32 - 7 - 18 = 7$$

bits. **7 bits.** The distractor is using 6 opcode bits because "64 registers,
so 6 bits", carrying the register arithmetic into the opcode field and
answering 8; 100 operations do not fit in 64 encodings.

**A5.** A branch instruction at address 0x4000 carries a signed 8-bit
displacement of 0x2C, and instructions are 4 bytes long. Where does it branch
to?

*Answer.* The displacement 0x2C has a clear high bit, so it is positive and
equals 44 in decimal. Counting in instruction words, that is

$$44 \\times 4 = 176$$

bytes, applied to the incremented program counter at 0x4004:

$$16388 + 176 = 16564$$

which is 0x40B4. **0x40B4.** Two traps live here. Measuring from 0x4000
instead of 0x4004 gives 0x40B0, wrong by one instruction; treating the
displacement as bytes rather than words gives 0x4030, wrong by a factor of
four.

**A6.** On the model machine of Section 6.1, a workload has 25 percent of its
instructions touching data instead of 35 percent. What sustainable instruction
rate does the shared bus allow, and by what factor does that beat the 35
percent case?

*Answer.* The words per instruction fall to 1.25, so

$$R = 500 / 1.25 = 400$$

million instructions per second, against 370.37 before, a ratio of

$$400 / 370.37 = 1.080$$

**400 million per second, 8.0 percent better.** The distractor is to expect a
10 point drop in the data fraction to give a 10 percent gain; the gain is the
ratio of 1.35 to 1.25, not the difference of the fractions.

## Problem Set B — pipelines, hazards and Amdahl

**B1.** A 6-stage pipeline executes 500 instructions with no hazards. How many
cycles, and what is the speedup over a non-pipelined machine taking 6 cycles
per instruction?

*Answer.* Fill plus one per remaining instruction:

$$C = 6 + 499 = 505$$

cycles, against

$$C_{seq} = 500 \\times 6 = 3000$$

so the speedup is

$$3000 / 505 = 5.94$$

**505 cycles, 5.94 times.** The trap is answering 6.00 by using the asymptotic
speedup; with only 500 instructions the fill is still visible, and quoting the
limit overstates by one percent.

**B2.** The same pipeline now runs 500 instructions with 40 stall cycles and 30
flush cycles. Find the cycle count and the CPI.

*Answer.* Add the disturbances to the same base:

$$C = 6 + 499 + 40 + 30 = 575$$

$$CPI = 575 / 500 = 1.15$$

**575 cycles, CPI 1.15.** The distractor is to compute 1 plus 40 plus 30 over
500, giving 1.14, which quietly drops the fill term. On short instruction
counts that term is not negligible.

**B3.** A machine has 22 percent branch instructions, a predictor that is 88
percent accurate, and a 4-cycle misprediction penalty. Find the effective CPI
assuming an ideal CPI of 1.

*Answer.* Only the mispredicted fraction pays:

$$CPI = 1 + 0.22 \\times 0.12 \\times 4 = 1.1056$$

**CPI 1.1056.** The common error is to charge every branch rather than every
misprediction, computing 1 plus 0.22 times 4 and answering 1.88 — more than eight
times the true penalty.

**B4.** A loop body of 5 instructions contains one load-use hazard and ends in
a branch that is taken on every pass but the last, with a 2-cycle penalty. The
loop runs 50 times on a 5-stage pipeline. How many cycles?

*Answer.* The dynamic instruction count is 250, so

$$C = 5 + 249 + 50 + 98 = 402$$

taking one bubble on each of the 50 passes and two flush cycles on each of the
49 taken branches. **402 cycles, CPI 1.608.** The trap is charging the flush 50
times for 100 cycles and answering 404; the final pass falls through, and that
off-by-one is worth the entire penalty.

**B5.** A program spends 60 percent of its time in a routine that a coprocessor
can run 10 times faster. Find the overall speedup, and the speedup if the
coprocessor were infinitely fast.

*Answer.* The unimproved fraction is 0.40 and the improved one is divided by 10:

$$0.40 + 0.60 / 10 = 0.46$$

$$S = 1 / 0.46 = 2.174$$

and with an infinite coprocessor,

$$S_{\\infty} = 1 / 0.40 = 2.5$$

**2.174 times, against a ceiling of 2.5.** The distractor is answering 6.0,
which is 0.6 times 10 — scaling the speedup by the fraction rather than
scaling the time by it. Notice also how little the step from a tenfold
coprocessor to an infinitely fast one is worth: it adds 0.33 to the speedup.

**B6.** On the model machine, an ideal CPI of 1.0 is degraded by memory stalls
at 1.35 references per instruction, a 3 percent miss rate and a 90-cycle
penalty. Find the CPI, the share of cycles lost to memory, and the speedup a
perfect cache would give.

*Answer.* The stall term is

$$1.35 \\times 0.03 \\times 90 = 3.645$$

so

$$CPI = 1 + 3.645 = 4.645$$

The share of cycles that are stalls is

$$3.645 / 4.645 = 0.785$$

and a perfect cache removes exactly those, for a speedup of 4.645. **CPI 4.645,
78.5 percent of cycles lost, speedup 4.645.** The trap is using 1.0 references
per instruction instead of 1.35, which gives a CPI of 3.70 and understates the
stall share by five and a half points; the instruction fetch is a memory
reference too.

## Practice Problems C — mixed short answers

**C1.** A 4-way set-associative cache is described in the next chapter, but the
architectural question comes first: why does adding associativity lengthen the
hit time?

*Answer.* Because the tags of every way in the selected set must be compared in
parallel, and the multiplexer that selects the winning way sits in the path
between the tag comparison and the data output. A direct-mapped cache needs one
comparator and no way-select multiplexer, so its data can be read speculatively
while the single tag is compared. **More ways means more comparators and one
more level of selection logic on the critical path.**

**C2.** A multicycle machine has a CPI of 4.2 and a 250 ps clock. A pipelined
version of the same datapath has a CPI of 1.25 and a 280 ps clock. Which is
faster, and by how much?

*Answer.* Time per instruction is CPI times the period:

$$T_{multi} = 4.2 \\times 250 = 1050$$

$$T_{pipe} = 1.25 \\times 280 = 350$$

picoseconds, so

$$1050 / 350 = 3.00$$

**The pipelined machine, by exactly 3.0 times.** The distractor is to prefer the
multicycle machine for its faster clock; the clock is faster and it needs more
than three times as many cycles.

**C3.** A processor is quoted at 1200 MIPS. The vendor's next model is quoted at
1500 MIPS but its compiler emits 30 percent more instructions for the same
programs. Which is faster on real work?

*Answer.* Time per unit of work is instruction count over rate. Take the first
machine's count as one unit and scale both times by 1200 so the first comes out
at exactly 1:

$$T_1 = 1200 / 1200 = 1.00$$

$$T_2 = 1.3 \\times 1200 / 1500 = 1.04$$

so the older machine is faster by 4 percent.

**The 1200 MIPS machine, by 4 percent.** The trap is the MIPS rating itself,
which cannot see the instruction count and therefore cannot compare two
machines whose instructions differ in what they accomplish.

**C4.** On the model machine of Section 6.1, is the single-cycle or the
multicycle implementation faster, and what would have to change for the answer
to flip?

*Answer.* From Section 8.2 the single-cycle machine takes 750 ps per
instruction and the multicycle machine takes 800 ps, so single-cycle wins by

$$800 / 750 = 1.067$$

**Single-cycle, by 6.7 percent.** It flips when the stage delays become
unbalanced. If one stage dominated — say a 500 ps memory stage against four
stages of 60 ps each — the single-cycle period would be pinned at 740 ps while
the multicycle period would be 500 ps and the average instruction would use
fewer than 1.48 stages of it, which is where the multicycle design earns its
keep.`,
      examTip: 'Every pipeline problem is the same line: cycles = stages + instructions - 1 + stalls + flushes. Write it down before reading the numbers, then fill the four terms from the question and take particular care that the last pass of a loop does not pay a flush.',
      importantNote: 'When an answer disagrees with intuition, check which quantity the question actually scaled. Amdahl problems are almost always missed by scaling the speedup instead of the time, and MIPS problems by comparing rates whose unit does not mean the same thing on both machines.',
    },
  ],
  keyTakeaways: [
    'Von Neumann: single memory. Harvard: separate. Modern: Modified Harvard (split L1 cache).',
    'RISC: simple, pipelinable (ARM, MIPS). CISC: complex, variable (x86).',
    'Pipeline: IF-ID-EX-MEM-WB; ideal = 1 instr/cycle.',
    'Hazards: data (forwarding), control (branch prediction), structural (duplication).',
    'Superscalar: multiple instrs/cycle. Out-of-order: execute when ready.',
  ],
},

fee_mem_hierarchy: { topicId: 'fee_mem_hierarchy', title: 'Memory Hierarchy and Virtual Memory', domainWeight: 'Computer Systems · 3–5%',
  overview: 'The memory hierarchy bridges the processor-memory speed gap through caching and virtual memory. Average access time, cache write policies, page tables, and TLB are core FE exam topics.',
  sections: [
    { id: 'memh-cache', title: '1. Cache Performance and Write Policies',
      content: `## 1.1 Hierarchy Levels

| Level | Size | Access |
|---|---|---|
| Registers | $< 1 KB$ | ~0.5 ns |
| L1 Cache | 32-64 KB | ~1-4 ns |
| L2 Cache | 256 KB-1 MB | ~10 ns |
| RAM | GBs | ~100 ns |
| Disk | TBs | ~10 ms |

## 1.2 Average Access Time

**t_avg = h * t_cache + (1-h) * t_memory**

Multi-level: t_avg = h_1*t_L1 + (1-h_1)*h_2*t_L2 + (1-h_1)(1-h_2)*t_mem

## 1.3 Write Policies

| Policy | Mechanism | Tradeoff |
|---|---|---|
| **Write-through** | Cache + memory | Simple, slow |
| **Write-back** | Cache only, dirty bit | Fast, complex |`,
      examTip: 't_avg = h*t_cache + (1-h)*t_memory is the most-tested cache formula. Multi-level: work from L1 outward.',
      importantNote: 'Miss rate = 1-h. L1 miss 10%, L2 miss 5% -> combined miss to RAM = 0.10*0.05 = 0.5%. Multi-level caches are multiplicatively effective.',
    },
    { id: 'memh-virtual', title: '2. Virtual Memory',
      content: `## 2.1 Concept

Programs use **virtual addresses**; page table maps to **physical addresses**.

- Virtual address = **VPN + page offset**
- Physical address = **PFN + page offset** (offset unchanged)
- Page offset bits = log_2(page_size)
- VPN bits = address_bits - offset_bits

Example: 32-bit address, 4 KB page -> 12 offset bits, 20 VPN bits, 2^20 page table entries.

## 2.2 TLB

Small fast cache of recent translations. Hit: ~1 ns. Miss: page table access (~100 ns).

## 2.3 Page Faults

Page not in RAM -> fetch from disk: **~10 ms** (millions of cycles).

Replacement: LRU (good), FIFO (simple), Optimal (theoretical best).`,
      examTip: 'Offset bits = log_2(page_size). VPN = remaining bits. Page faults cost ~10 ms -- catastrophically slow.',
    },
    { id: 'memh-exam', title: '3. Cache & Memory Worked Examples',
      content: `## 3.1 Two-Level Cache EMAT

**Given**: L1 hit rate = 95%, t_L1 = 1 ns. L2 hit rate = 80% (of L1 misses), t_L2 = 10 ns. Memory t_mem = 100 ns.

**EMAT = h1*t_L1 + (1-h1)*h2*t_L2 + (1-h1)*(1-h2)*t_mem**

$$EMAT = 0.95 * 1 + 0.05 * 0.80 * 10 + 0.05 * 0.20 * 100$$

$$EMAT = 0.95 + 0.40 + 1.00 = 2.35\\ \\mathrm{ns}$$

| Component | Probability | Time | Contribution |
|---|---|---|---|
| L1 hit | 95% | 1 ns | 0.95 ns |
| L1 miss, L2 hit | 4% | 10 ns | 0.40 ns |
| Both miss | 1% | 100 ns | 1.00 ns |
| **Total EMAT** | | | **2.35 ns** |

Only 1% of accesses reach main memory, yet that 1% contributes 43% of the average access time. This shows why minimizing misses matters enormously.

## 3.2 Page Table Walk Latency

**Given**: 32-bit virtual address, 4 KB pages, 2-level page table. TLB miss rate = 5%. Each table access = 100 ns.

- Page offset = log_2(4096) = **12 bits**
- VPN = 32 - 12 = 20 bits -> split into two 10-bit indices
- **2-level walk**: 2 memory accesses * 100 ns = **200 ns per TLB miss**

**Effective translation time**:
$$t_{translate} = h_{TLB} * t_{TLB} + (1 - h_{TLB}) * t_{walk}$$
$$t_{translate} = 0.95 * 1 + 0.05 * 200 = 0.95 + 10 = 10.95\\ \\mathrm{ns}$$

Without a TLB every access pays the full 200 ns walk. The TLB brings the average down to 10.95 ns, a reduction of

$$1 - 10.95 / 200 = 0.945$$

or **94.5%** — close to the 95% hit rate, but not equal to it, and the two are different quantities.

## 3.3 TLB Hit Rate Impact

| TLB Hit Rate | Translation Time | Impact on Memory Access |
|---|---|---|
| 99% | $0.99 + 2.0 = 2.99\\ \\mathrm{ns}$ | Negligible overhead |
| 95% | $0.95 + 10.0 = 10.95\\ \\mathrm{ns}$ | Moderate |
| 90% | $0.90 + 20.0 = 20.90\\ \\mathrm{ns}$ | Significant |
| 80% | $0.80 + 40.0 = 40.80\\ \\mathrm{ns}$ | Severe — redesign needed |

**Working set**: if a program's actively-used pages fit in the TLB, hit rate stays > 99%. Large, scattered data structures (e.g., pointer-chasing) cause TLB thrashing.

**Exam strategy**: For multi-level cache, chain probabilities: EMAT = sum of (probability of reaching level i) * (access time at level i). For page tables, TLB miss penalty = number of levels * memory access time. A 4-level page table (64-bit systems) costs 400 ns per TLB miss.`,
      examTip: 'Multi-level EMAT: probability of reaching each level multiplied by its access time, summed. L1 miss, L2 hit probability = (1-h1)*h2. Both miss = (1-h1)*(1-h2).',
      importantNote: 'L2 hit rate is measured as a fraction of L1 MISSES, not total accesses. If the problem says "L2 hit rate = 80%," that means 80% of accesses that missed L1 are found in L2.',
    },
    { id: 'memh-fields', title: '4. Cutting Up an Address: Tag, Index, and Block Offset',
      content: `## 4.1 A cache asks three questions of every address

When the processor presents an address, the cache must decide where such a
block would live, whether the block sitting there is the right one, and which
byte within it was wanted. Those three questions map onto three contiguous
fields of the address, read from the bottom up:

| Field | Question it answers | Width |
|---|---|---|
| **Block offset** | which byte inside the block? | log2(bytes per block) |
| **Index** | which line, or which set, would hold it? | log2(number of lines or sets) |
| **Tag** | is the block sitting there the one I want? | everything left over |

The widths are forced, not chosen: **tag + index + offset = address width**,
always. That identity is the check to run before writing an answer down.

## 4.2 A direct-mapped cache, worked

Take a **64 KB direct-mapped cache with 64-byte blocks** on a machine with
32-bit addresses.

| Quantity | Calculation | Result |
|---|---|---|
| Lines | 65,536 / 64 | 1024 |
| Offset bits | log2(64) | **6** |
| Index bits | log2(1024) | **10** |
| Tag bits | 32 - 10 - 6 | **16** |

Now decompose the address **0x1234ABCD**. Write it in binary if that helps, or
shift and mask:

- **offset** = the low 6 bits = 0x0D = byte **13** of its block
- **index** = the next 10 bits = 0x2AF = line **687** of 1024
- **tag** = the top 16 bits = **0x1234**

which reassembles to the original address exactly, a check the figure below
performs in code before drawing anything.

## 4.3 Associativity moves the boundary, not the total

Keep the same 64 KB and the same 64-byte blocks but make the cache **4-way set
associative**. Capacity is unchanged, so the number of blocks is unchanged; what
changes is that they are now grouped four to a set:

**sets = 65,536 / (64 x 4) = 256**, so the index shrinks to log2(256) = **8
bits** and the tag grows to 32 - 8 - 6 = **18 bits**

The same address 0x1234ABCD now selects **set 0xAF (175)** and carries the tag
**0x48D2**. The offset is untouched, because the block size did not change.

![The same 32-bit address cut two ways. The upper bar shows a direct-mapped 64 KB cache with 64-byte blocks splitting the address into a 16-bit tag, a 10-bit index and a 6-bit offset; the lower bar shows the same capacity as a 4-way set-associative cache, where two index bits move into the tag. The hexadecimal value of each field for address 0x1234ABCD is printed underneath it.](/courses/fe-ee/figures/csys-cache-fields.svg)

The figure makes the conservation law visible: the bar has a fixed length, and
raising associativity simply slides the tag-index boundary to the left. Each
doubling of the ways halves the number of sets, removes one index bit, and adds
one tag bit.

## 4.4 Associativity is not free

Tags are storage that holds no data. In the direct-mapped case above there are
1024 lines, each needing 16 tag bits plus a valid bit:

**1024 x 17 = 17,408 bits = 2176 bytes**, about 3.3 percent on top of the 64 KB
of data

The four-way version stores the same 1024 tags but each is 18 bits, and it must
also compare four tags in parallel on every access rather than one. That is the
real cost of associativity: comparator hardware in the critical path, which
shows up as a longer hit time. What it buys is the elimination of **conflict
misses** — the case where two hot addresses map to the same line and evict each
other repeatedly even though the rest of the cache is idle. A direct-mapped
cache has exactly one home for each block and is therefore vulnerable to this;
a fully associative cache has none at all, and pays for it with a comparison
against every line.

| Organisation | Index bits | Tag bits | Comparators | Conflict misses |
|---|---|---|---|---|
| Direct-mapped, 1024 lines | 10 | 16 | 1 | worst |
| 4-way, 256 sets | 8 | 18 | 4 | much reduced |
| Fully associative, 1 set | 0 | 26 | 1024 | none |

**How the exam asks this.** Nearly always as a bit-field question: given
capacity, block size, associativity and address width, state the three field
widths, or decompose one address. Work bottom-up — offset first from the block
size, index next from the set count, tag last as the remainder — and confirm
that the three widths sum to the address width before you commit.`,
      examTip: 'Offset comes from block size, index from the number of SETS (not lines) once the cache is associative, and the tag is whatever remains. Doubling associativity at fixed capacity always moves exactly one bit from the index to the tag.',
      importantNote: 'The index selects a set, and within that set the block can sit in any way, so the index width uses the set count. A common error is to use the total line count for a set-associative cache, which produces an index that is too wide by log2(ways).',
    },
    { id: 'memh-penalty', title: '5. Miss Penalties, Multi-Level AMAT, and What a Page Table Costs',
      content: `## 5.1 Two ways to write the same average, and why the difference is small

Section 1.2 wrote the average access time as a probability-weighted sum of the
two outcomes. Textbook cache analysis usually writes it in the **miss-penalty**
form instead, because that is how a designer thinks about it:

**AMAT = t_hit + (miss rate) x (miss penalty)**

The two differ by a term that is easy to explain. With a 1 ns hit time, a 5
percent miss rate and a 100 ns memory:

- weighted form: 0.95 x 1 + 0.05 x 100 = **5.95 ns**
- miss-penalty form: 1 + 0.05 x 100 = **6.00 ns**

The 0.05 ns gap is the hit time charged on the misses too, which is exactly what
the second model assumes: the cache is probed first on every access, and on a
miss the memory time is added on top. That is what real hardware does, so the
miss-penalty form is the physically honest one. Either is accepted; what is not
accepted is mixing them inside one problem.

## 5.2 Adding a second level

Now give the same machine an L2 cache with a 10 ns access time that catches 80
percent of what L1 misses. The miss penalty of L1 is no longer the memory time
— it is the *L2 experience*:

**miss penalty of L1 = t_L2 + (L2 miss rate) x t_mem = 10 + 0.20 x 100 = 30 ns**

**AMAT = 1 + 0.05 x 30 = 2.5 ns**

Adding one level cut the average from 6.0 ns to 2.5 ns, a **58 percent**
reduction, without changing L1 at all.

Two rates are in play here and they must be kept apart.

| Rate | Definition | Value here |
|---|---|---|
| L1 local miss rate | L1 misses / all accesses | 5% |
| L2 **local** miss rate | L2 misses / accesses that reached L2 | 20% |
| L2 **global** miss rate | L2 misses / all accesses | 0.05 x 0.20 = **1%** |

Only the global rate tells you how often main memory is actually disturbed.
Quoting an L2 local miss rate of 20 percent sounds alarming and means almost
nothing; the same cache has a global miss rate of 1 percent, which is the
number that matters.

## 5.3 Where misses come from

Misses classify into three causes, and each has its own remedy — which is why
the classification is worth knowing rather than just the total.

| Cause | Why it happens | What reduces it |
|---|---|---|
| **Compulsory** | first ever reference to a block | larger blocks; prefetching |
| **Capacity** | working set exceeds the cache | a larger cache |
| **Conflict** | too many hot blocks map to one set | more associativity |

Note that the three remedies pull against one another. Larger blocks cut
compulsory misses but raise the miss penalty and can waste bandwidth; more
associativity cuts conflicts but lengthens the hit time. There is no setting
that minimises all three.

## 5.4 A flat page table is unaffordable, and that is why they are layered

Section 2.1 established that a 32-bit address with 4 KB pages needs 12 offset
bits and 20 virtual page number bits. Take that seriously as a storage
requirement. A flat table needs one entry per virtual page:

**2^20 entries x 4 bytes = 4 MB, per process**

Ten processes would spend 40 MB on translation tables alone, most of it
describing address space that no process has ever touched. A **two-level**
table fixes this by splitting the 20-bit page number into two 10-bit indices
and allocating second-level tables only where the address space is actually
populated. For a process with a 12 MB working set:

| Quantity | Calculation | Result |
|---|---|---|
| Pages in use | 12 MB / 4 KB | 3072 |
| Second-level tables needed | ceil(3072 / 1024) | 3 |
| Tables in total, plus the directory | (3 + 1) x 4 KB | **16 KB** |
| Saving against the flat table | 4 MB / 16 KB | **256x** |

The price is paid on every TLB miss: a two-level walk is two memory accesses,
so at 100 ns each it costs **200 ns**, and a four-level table on a 64-bit
machine costs **400 ns**. This is why the TLB is not an optimisation but a
requirement.

## 5.5 TLB reach

The useful figure of merit for a TLB is its **reach** — the amount of memory
its entries cover at once:

**reach = entries x page size = 64 x 4 KB = 256 KB**

A program whose active data fits inside the reach essentially never takes a TLB
miss. A program that strides through a data structure much larger than the
reach takes one on nearly every access, and no amount of cache helps, because
the *translation* is what is missing rather than the data. Two standard cures
follow directly from the formula: reduce the footprint, or increase the page
size. Large pages of 2 MB raise the reach of the same 64 entries from 256 KB to
128 MB, which is why database and scientific workloads ask for them.

**How the exam asks this.** Multi-level AMAT questions are a chain of
probabilities — write each level's contribution as (probability of reaching it)
x (its time) and sum. Page-table questions are a division: offset bits from the
page size, page-number bits from what is left, entries from two to that power,
and bytes from entries times the entry size.`,
      examTip: 'When a problem gives an L2 hit rate, it is nearly always a LOCAL rate, measured over accesses that already missed L1. Multiply the miss rates together to get the global rate before comparing anything against main-memory traffic.',
      importantNote: 'The two AMAT conventions differ by (miss rate) x (hit time), which is small but not zero. Pick the miss-penalty form when the problem states a hit time and a penalty, and the weighted form when it states two absolute access times; never combine a hit time from one with a penalty from the other.',
    },
    { id: 'memh-ladder', title: '6. What the Hierarchy Costs: Capacity, Latency, and One Transistor Count',
      content: `## 6.1 Why there is a hierarchy at all

A memory that was both large and fast would make this chapter unnecessary. The
reason none exists is not economics in the first instance but circuit
structure. A static RAM cell — the kind used for registers and caches — is a
cross-coupled pair of inverters plus two access transistors, six transistors in
all, and it holds its value as long as power is applied. A dynamic RAM cell is
one transistor and one capacitor, and it forgets in a few milliseconds unless
something rewrites it. The ratio of those two cell sizes is the whole reason
for the ladder:

| Storage technology | Cell structure | Consequence |
|---|---|---|
| Static RAM | 6 transistors, no refresh | fast, large per bit, power-hungry at rest |
| Dynamic RAM | 1 transistor, 1 capacitor, refreshed | dense, slower, needs refresh cycles |
| Flash | 1 floating-gate transistor, no power to hold | denser still, slow to write, wears out |
| Magnetic disk | no per-bit circuit at all | densest, mechanical, milliseconds |

Six transistors against one is roughly a sixfold density penalty at the cell
before wiring, and the wiring makes it worse. So the designer cannot have one
memory; the designer must have several and arrange them so that the fast small
one answers most of the questions.

## 6.2 The model ladder used from here on

Every latency quoted in the rest of this chapter comes from this table, and the
cycle column assumes the 2 GHz clock of the architecture chapter's model
machine.

| Level | Capacity | Latency | Latency in 2 GHz cycles |
|---|---|---|---|
| Registers | 1 KB | 0.3 ns | 0.6 |
| L1 cache | 32 KB | 1.0 ns | 2 |
| L2 cache | 512 KB | 8.0 ns | 16 |
| L3 cache | 16 MB | 25 ns | 50 |
| DRAM | 16 GB | 80 ns | 160 |
| Flash SSD | 1 TB | 80 us | 160,000 |
| Magnetic disk | 8 TB | 8 ms | 16,000,000 |

Two ratios in that table matter more than the individual entries. The first is
the gap the caches exist to bridge:

$$80 / 1.0 = 80$$

DRAM is eighty times slower than L1. The second is the gap that makes a page
fault a catastrophe rather than a delay:

$$8000000 / 80 = 100000$$

disk is a hundred thousand times slower than DRAM. Section 13 shows what that
second ratio does to a page fault budget.

![Access latency against capacity for the seven levels of the model ladder, both axes logarithmic. The points climb from one kilobyte at 0.3 nanoseconds to eight terabytes at eight milliseconds, and a double-headed arrow marks the eighty-fold step from L1 cache to DRAM.](/courses/fe-ee/figures/sys2-mem-ladder.svg)

Plotted logarithmically the ladder is nearly a straight line, which is the
useful observation: each level is roughly an order of magnitude larger and an
order of magnitude slower than the one above it. That regularity is what makes
the average-access-time algebra of Section 9 work out to sensible numbers
rather than being dominated by one level.

## Worked example 6.1 — what a DRAM access costs in cycles

**Given.** The model machine's 2 GHz clock and the ladder's 80 ns DRAM latency.
Express the DRAM access as cycles, and say what a processor could otherwise
have done with them.

**Work.** Cycles are the latency times the frequency:

$$n_{cycles} = 80 \\times 2 = 160$$

**Answer: 160 cycles.** On a machine that can retire two instructions per
cycle, that is 320 instructions of lost work for one miss that reaches main
memory. This single figure justifies everything in the rest of the chapter: it
is why a 3 percent miss rate can dominate a machine that hits 97 percent of the
time, and it is why the exam asks about miss rates rather than hit rates.

## Worked example 6.2 — how many misses must be in flight at once

**Given.** A memory system with an 80 ns latency, 64-byte cache lines, and a
requirement to sustain 12.8 GB/s. How many misses must be outstanding
simultaneously?

**Work.** This is Little's law, which says the number in a system is the
arrival rate times the time each one spends there. Convert the bandwidth into a
request rate first:

$$\\lambda = 12800 / 64 = 200$$

requests per microsecond: 12.8 GB/s is 12800 bytes per microsecond, and at 64
bytes each that is 200 requests in every microsecond. The number in flight is
the rate times the time each request spends in the system,

$$L = 200 \\times 0.080 = 16$$

**Answer: 16 outstanding misses.** That is why a cache has miss-status holding
registers and why their count is a published parameter: a cache that can track
only one miss at a time cannot use the bandwidth it was sold. Run the argument
backwards for a cache with ten of them:

$$10 / 0.080 = 125$$

requests per microsecond, or

$$125 \\times 64 = 8000$$

megabytes per second — **8 GB/s, well short of the 12.8 the memory could
deliver.** The occupancy figure of 16 was also confirmed by simulation rather
than by re-applying the formula: a clock was advanced in 10 ps steps, a request
issued every 5 ns and retired 80 ns later, and the time-averaged count of
requests in flight came out at 16.00.

**How the exam asks this.** Usually as an ordering question — put these storage
types in order of speed, or of cost per bit — and occasionally as a cycle
conversion like Worked example 6.1. For the conversion, multiply nanoseconds by
gigahertz and the units cancel to cycles.`,
      examTip: 'Convert every memory latency into cycles before reasoning about it. Eighty nanoseconds sounds small until it is written as 160 cycles on a 2 GHz machine, at which point the cost of a miss becomes obvious without any further arithmetic.',
      importantNote: 'The hierarchy exists because of cell structure, not because of pricing policy. A six-transistor static cell cannot be made as dense as a one-transistor dynamic cell, so no process improvement will ever collapse the levels into one.',
    },
    { id: 'memh-locality', title: '7. Locality Made Concrete: One Loop, Counted Reference by Reference',
      content: `## 7.1 The two localities, defined by what they predict

A cache is a bet that the near future resembles the recent past. The bet comes
in two forms, and they are worth stating as predictions rather than as
definitions, because a prediction can be checked.

**Temporal locality** predicts that an address just referenced will be
referenced again soon. It is why a cache keeps a block after using it rather
than discarding it.

**Spatial locality** predicts that addresses near one just referenced will be
referenced soon. It is why a cache fetches a whole block of 32 or 64 bytes
rather than the four bytes actually asked for.

Every design parameter in a cache serves one or the other. Capacity and
replacement policy serve temporal locality; block size and prefetching serve
spatial locality.

## 7.2 A loop, and the references it actually makes

Take the simplest possible loop, summing an array of 64 four-byte integers
starting at address 0x1000, on a 1 KB direct-mapped cache with 32-byte blocks.
The accumulator lives in a register, so the loop makes exactly 64 data
references. Each block holds

$$32 / 4 = 8$$

integers, so the 64 elements occupy

$$64 / 8 = 8$$

blocks. Every block misses on its first element and hits on the remaining
seven, which gives

$$64 - 8 = 56$$

hits and a hit rate of

$$56 / 64 = 0.875$$

That is the prediction. Pushing the 64 real byte addresses through a tag array
and counting produces 56 hits and 8 misses — the same numbers, arrived at by a
route that knows nothing about the formula.

![Two panels of the same 64-reference loop pushed through a 1 KB direct-mapped cache with 32-byte blocks. The upper panel walks the array at unit stride and records 56 hits against 8 misses, one miss per block; the lower panel walks it at a 32-byte stride, touching a new block on every reference, and records no hits at all.](/courses/fe-ee/figures/sys2-mem-locality.svg)

The lower panel changes exactly one thing: the loop now steps 32 bytes at a
time instead of 4. Every reference lands in a different block, so spatial
locality has nothing to work with, and the simulator counts 64 misses in 64
references. The cache is identical; the program is not.

## Worked example 7.1 — hit rate as a function of block size

**Given.** A unit-stride walk over elements of s bytes, in a cache with blocks
of B bytes, in a cache large enough that nothing is evicted. Derive the hit
rate, then evaluate it for 4-byte elements in 32-byte and 64-byte blocks.

**Work.** One miss occurs per block, and a block holds B over s elements, so
the miss rate is s over B and the hit rate is

$$h = 1 - \\frac{s}{B}$$

For 32-byte blocks,

$$1 - 4 / 32 = 0.875$$

and for 64-byte blocks,

$$1 - 4 / 64 = 0.9375$$

**Answer: 87.5 percent and 93.75 percent.** Doubling the block halves the miss
rate on a sequential walk, which looks like an argument for enormous blocks.
It is not, for two reasons that Section 10 develops: a bigger block takes longer
to fetch, raising the miss penalty, and a bigger block means fewer blocks at
fixed capacity, which raises conflict misses.

## Worked example 7.2 — the second pass is free

**Given.** An array of 128 four-byte integers, so 512 bytes, walked twice in
the same 1 KB direct-mapped cache with 32-byte blocks.

**Work.** The array occupies

$$512 / 32 = 16$$

blocks, which fit comfortably in the 32 the cache holds, so the second pass
finds everything resident. Misses are the 16 compulsory ones and nothing else,
in

$$128 \\times 2 = 256$$

references, giving

$$256 - 16 = 240$$

hits and a hit rate of

$$240 / 256 = 0.9375$$

**Answer: 240 hits, 16 misses, 93.75 percent.** Simulating the 256 addresses
gives exactly 240 and 16. The second pass contributes 128 hits and zero misses,
which is temporal locality doing all of the work — and it is what disappears
the moment the array grows past the cache, as Section 10 shows.

## Worked example 7.3 — the same arithmetic, one loop order apart

**Given.** A 64 by 64 array of four-byte integers, 16 KB in total, traversed
completely in row-major order and then in column-major order, on the same 1 KB
direct-mapped cache with 32-byte blocks. The array is stored row-major, so
consecutive elements of a row are adjacent in memory.

**Work.** Both orders make the same 4096 references and perform the same
arithmetic. Row-major traversal is a unit-stride walk over

$$16384 / 32 = 512$$

blocks, so by Worked example 7.1 it misses 512 times and hits 3584, a hit rate
of 0.875 — and the simulator counts exactly that.

Column-major traversal steps by a whole row between references:

$$64 \\times 4 = 256$$

bytes, which is

$$256 / 32 = 8$$

blocks. One column therefore touches 64 distinct blocks, one per row. The
cache holds

$$1024 / 32 = 32$$

blocks. Sixty-four does not fit in thirty-two, so by the time the next column
comes round every block it needs has been evicted. The simulator counts **4096
misses and zero hits.**

| Traversal | Cache | Hits | Misses | Hit rate |
|---|---|---|---|---|
| Row-major | 1 KB direct-mapped | 3584 | 512 | 0.875 |
| Column-major | 1 KB direct-mapped | 0 | 4096 | 0.000 |
| Column-major | 1 KB two-way | 0 | 4096 | 0.000 |
| Column-major | 1 KB fully associative | 0 | 4096 | 0.000 |
| Column-major | 64 KB direct-mapped | 3584 | 512 | 0.875 |

**Answer: 87.5 percent one way round and 0 percent the other.** The three
middle rows are the part worth remembering. Raising associativity does nothing
here, not even full associativity, because the problem is not that blocks
collide — it is that a single column needs 64 blocks and the cache holds 32.
The diagnostic is exactly that: if full associativity does not fix it, it was
never a conflict. Enlarging the cache to 64 KB does fix it, because then the
entire 16 KB array is resident and the second column finds the first column's
blocks still there.

**How the exam asks this.** Give a loop and a cache and ask for the hit rate.
Work out how many elements share a block, decide whether the working set fits,
and only then count. If the stride is larger than the block, the answer is
almost always zero hits and the question is testing whether you noticed.`,
      examTip: 'Compare the stride against the block size first. A stride at least as large as the block destroys spatial locality completely, and no amount of capacity or associativity will restore it — only changing the traversal order or the data layout will.',
      importantNote: 'Full associativity is the diagnostic for conflict misses. If a pathological miss rate survives a fully associative cache of the same capacity, the working set is simply too big, and the cure is a larger cache or a restructured loop rather than more ways.',
    },
    { id: 'memh-placement', title: '8. Placement: Where a Block Is Allowed to Live',
      content: `## 8.1 Three placement rules, and the one number that separates them

Section 4 derived the tag, index and offset widths. This section asks the prior
question those widths answer: how many places in the cache is a given block
allowed to occupy? The three standard answers are one place, a few places, and
anywhere, and every other property follows from the choice.

| Organisation | Places a block may go | Index width | Comparators | Replacement choice |
|---|---|---|---|---|
| Direct-mapped | exactly 1 | log2(lines) | 1 | none needed |
| n-way set associative | n, within one set | log2(sets) | n | within the set |
| Fully associative | any line | 0 | one per line | across the whole cache |

Note the last column, because it is the one that connects this section to
Section 11. A direct-mapped cache needs no replacement policy at all: a new
block has exactly one home and whatever is there is evicted. The policy
question only exists once there is a choice.

## 8.2 The conflict catastrophe, and how little it takes

Take a 1 KB direct-mapped cache with 32-byte blocks, so

$$1024 / 32 = 32$$

lines. Two arrays of 512 bytes each sit at addresses 0x0000 and 0x0400, and a
loop reads one element from each on every pass, 128 passes in all. Address
0x0400 is 1024 bytes above 0x0000 — exactly the cache size — so the two arrays
map onto exactly the same 16 lines, element for element.

The simulator counts **256 misses in 256 references, and zero hits.** Every
access evicts the block the next access wants. The two arrays together are 1 KB
and the cache is 1 KB, so nothing about the capacity is wrong; the failure is
entirely one of placement.

Now change one thing at a time.

![Misses in the same 256-reference interleaved trace as associativity rises from one way to thirty-two, with capacity held at 1 KB. One way takes 256 misses; every higher associativity takes 32, which is the compulsory floor of one miss per block touched.](/courses/fe-ee/figures/sys2-mem-assoc.svg)

**Add one way.** A two-way cache of the same capacity has

$$1024 / 64 = 16$$

sets, and both arrays still map to the same sets — but now each set holds two
blocks, so both can be resident. The simulator counts 32 misses and 224 hits:

$$224 / 256 = 0.875$$

and those 32 misses are exactly the number of distinct blocks touched,

$$512 / 32 = 16$$

blocks per array times two arrays, which is the compulsory floor. Not one
avoidable miss remains.

**Or move one array.** Leave the cache direct-mapped and place the second array
at 0x0420 instead of 0x0400, a shift of one block. Now the two arrays are
offset by one line and never collide. The simulator counts 32 misses and 224
hits — **identical to the two-way result, at no hardware cost at all.** This is
why array padding is a real optimisation and why library allocators avoid
handing out buffers at exact powers of two.

## Worked example 8.1 — field widths for the conflicting cache

**Given.** The 1 KB direct-mapped cache above, 32-byte blocks, 32-bit
addresses. State the three field widths and check them.

**Work.** Offset comes from the block size, index from the line count, tag from
what is left:

$$b_{offset} = \\log_2 32 = 5$$

$$b_{index} = \\log_2 32 = 5$$

$$b_{tag} = 32 - 5 - 5 = 22$$

and the check that the three sum correctly:

$$5 + 5 + 22 = 32$$

**Answer: 5, 5 and 22.** Now the collision is visible in the arithmetic.
Address 0x0000 has index 0; address 0x0400 is 1024 bytes higher, and 1024 is
2 to the tenth, which is exactly the offset and index fields combined — so
0x0400 has index 0 as well, and differs only in the tag. Two blocks with the
same index and different tags cannot coexist in a direct-mapped cache. Any
address distance that is a multiple of the cache size produces this, which is
the rule worth carrying into the exam.

## Worked example 8.2 — the same cache built three ways

**Given.** A 32 KB cache with 512-byte blocks on a machine whose main memory is
256 KB, so the address is however many bits main memory requires. Give the
field widths for direct-mapped, four-way set associative and fully associative.

**Work.** Main memory of 256 KB needs 18 address bits, since 256 KB is 2 to the
eighteenth bytes. The block offset is set by the block size alone and is the
same in all three cases:

$$b_{offset} = \\log_2 512 = 9$$

**Direct-mapped.** The number of lines is

$$32768 / 512 = 64$$

so the index is 6 bits and the tag is

$$18 - 6 - 9 = 3$$

**Four-way.** The number of sets is

$$32768 / 2048 = 16$$

so the index is 4 bits and the tag is

$$18 - 4 - 9 = 5$$

**Fully associative.** There is one set, so the index is 0 bits and the tag is

$$18 - 0 - 9 = 9$$

| Organisation | Offset | Index | Tag | Sets |
|---|---|---|---|---|
| Direct-mapped | 9 | 6 | 3 | 64 |
| Four-way | 9 | 4 | 5 | 16 |
| Fully associative | 9 | 0 | 9 | 1 |

**Answer: as tabulated.** Two traps sit in this problem. The first is taking
the address width from the processor's word size rather than from the memory
size the question specifies — reading 32 bits here would inflate every tag by
14. The second is computing the index from the line count in the associative
cases; four-way has 64 lines but only 16 sets, and it is the sets that the
index names.

## 8.3 What associativity costs

Every extra way is another tag comparator running in parallel and one more
input on the multiplexer that selects the winning way's data. Both sit directly
in the path between presenting an address and returning a word, so associativity
lengthens the hit time. A direct-mapped cache can start reading the data at the
same moment it starts comparing the single tag, and simply discard the result
if the tag misses; an associative cache cannot know which way's data to forward
until the comparison finishes.

That is the trade, and it explains a persistent design pattern: first-level
caches stay at low associativity because their hit time is on the critical
path, while second and third levels go to eight or sixteen ways because their
hit time is already hidden behind the level above them.

**How the exam asks this.** Field widths, almost always. Take the address width
from whatever the question says determines it, compute the offset from the
block size, compute the index from the set count — dividing capacity by block
size and then by ways — and take the tag as the remainder.`,
      examTip: 'Index bits come from the number of SETS, and sets equal capacity divided by block size divided by ways. Using the line count for an n-way cache makes the index log2(n) bits too wide and the tag log2(n) bits too narrow, and the two errors do not cancel.',
      importantNote: 'Two addresses collide in a direct-mapped cache whenever they differ by a multiple of the cache size. That is why array dimensions and buffer alignments at exact powers of two are dangerous, and why shifting one array by a single block can convert a 0 percent hit rate into 87.5 percent.',
    },
    { id: 'memh-amat-chain', title: '9. Average Access Time, Derived and Then Used',
      content: `## 9.1 The derivation, and why two forms exist

An access either hits or misses. Weighting each outcome by its probability
gives the form Section 1.2 used:

$$t_{avg} = h \\, t_{hit} + (1 - h) \\, t_{miss}$$

Real hardware does something slightly different. It probes the cache on every
access, and only when that probe fails does it start the memory access, so the
hit time is paid always and the miss time is paid on top:

$$AMAT = t_{hit} + m \\, P$$

with m the miss rate and P the miss penalty. Section 5.1 showed the two differ
by m times t_hit, which is small but not zero. The second form is the one to
use whenever a problem states a hit time and a penalty, and it is the one that
generalises cleanly to more levels, which is why it dominates from here on.

Applying it to the model ladder with a 3 percent miss rate and DRAM as the only
thing below L1:

$$AMAT = 1 + 0.03 \\times 80 = 3.40$$

nanoseconds. A cache that hits 97 times out of 100 still runs at less than a
third of its hit speed, because the three misses each cost eighty times a hit.

## 9.2 More levels, from the inside out

Adding levels does not change the equation; it changes what P means. The
penalty of a level is the average time experienced at the level below it, which
is itself an AMAT. So the chain is written from the bottom up.

Give the machine an L2 at 8 ns that misses 25 percent of what reaches it, and
an L3 at 25 ns that misses 40 percent of what reaches it, with DRAM at 80 ns.
Start at L3:

$$P_{L2} = 25 + 0.40 \\times 80 = 57$$

nanoseconds is what an L2 miss costs. Then L2 is the penalty for L1:

$$P_{L1} = 8 + 0.25 \\times 57 = 22.25$$

and finally

$$AMAT = 1 + 0.03 \\times 22.25 = 1.6675$$

nanoseconds, against 3.40 with no intermediate levels:

$$3.40 / 1.6675 = 2.0390$$

**Two extra levels roughly halved the average access time without changing L1
or the miss rate at all.** That is the point of the figure below: levels are
bought to shrink the penalty, since the miss rate belongs to the program.

![Average memory access time against L1 miss rate for two machines. The steeper line is L1 backed directly by DRAM, with a penalty of 80 nanoseconds; the shallower line is L1 backed by L2, L3 and then DRAM, whose combined penalty is 22.25 nanoseconds. At a 3 percent miss rate the two read 3.40 and 1.67 nanoseconds.](/courses/fe-ee/figures/sys2-mem-amat.svg)

## 9.3 Local against global miss rates, kept apart

Section 5.2 introduced the distinction. With three levels it becomes essential,
because two of the three numbers a datasheet quotes are local and only one of
them tells you how often main memory is disturbed.

| Level | Local miss rate | Meaning | Global miss rate |
|---|---|---|---|
| L1 | 3% | of all accesses | 3% |
| L2 | 25% | of accesses that reached L2 | 0.75% |
| L3 | 40% | of accesses that reached L3 | 0.30% |

The global rates are running products:

$$m_{L2}^{global} = 0.03 \\times 0.25 = 0.0075$$

$$m_{L3}^{global} = 0.03 \\times 0.25 \\times 0.40 = 0.003$$

A 40 percent local miss rate at L3 sounds like a failed design. Globally it is
three accesses per thousand reaching DRAM, which is an excellent design. The
two statements describe the same cache. Whenever a problem quotes a miss rate
for a level below the first, assume it is local unless the words say otherwise,
and multiply before comparing it with anything.

## Worked example 9.1 — turning AMAT into CPI

**Given.** The model machine at 2 GHz makes 1.35 memory references per
instruction, as the architecture chapter established. Convert both AMAT figures
above into a CPI, taking the ideal CPI as 1 and charging only the time above
the L1 hit as stall.

**Work.** For the single-level machine the stall per reference is 3.40 minus
1.00 nanoseconds, which in cycles is

$$2.40 \\times 2 = 4.80$$

so

$$CPI = 1 + 1.35 \\times 4.80 = 7.48$$

For the three-level machine the stall per reference is 0.6675 ns, or

$$0.6675 \\times 2 = 1.335$$

cycles, so

$$CPI = 1 + 1.35 \\times 1.335 = 2.802$$

**Answer: CPI 7.48 against 2.802, a factor of**

$$7.48 / 2.802 = 2.6695$$

The speedup in CPI is larger than the 2.039 speedup in AMAT, and the reason is
worth seeing. Both expressions carry a fixed term that neither machine can
avoid — the L1 hit time in AMAT, the ideal cycle in CPI — and any ratio is
dragged toward 1 by whatever the two sides share. That fixed term is 29 percent
of the single-level AMAT and only 13 percent of the single-level CPI, so the
CPI ratio sits closer to the ratio of the stalls alone,

$$2.40 / 0.6675 = 3.5955$$

which is the number both ratios are really approaching. Whenever a question
asks for a speedup, check which quantity it wants the ratio of.

## Worked example 9.2 — is the L2 worth its silicon?

**Given.** The three-level machine above. A designer proposes deleting L3 and
letting L2 miss straight to DRAM. What happens to AMAT?

**Work.** Without L3 the L1 penalty becomes L2's own experience against DRAM:

$$P_{L1} = 8 + 0.25 \\times 80 = 28$$

$$AMAT = 1 + 0.03 \\times 28 = 1.84$$

nanoseconds, against 1.6675 with L3 present, a degradation of

$$1.84 / 1.6675 = 1.103$$

**Answer: 10.3 percent slower.** Ten percent for a 16 MB cache is a real but
unspectacular return, which is exactly the kind of judgement the AMAT chain
exists to support. Note that the L3 looked much more impressive in Section 9.2,
where it was credited with part of a factor of two — because there the
comparison was against no intermediate levels at all. Attributing a gain to a
component requires removing only that component.

**How the exam asks this.** A chain of levels with hit times and miss rates,
then AMAT. Work from the bottom level upward, treating each level's penalty as
the level below's AMAT, and read every miss rate below the first as local.`,
      examTip: 'Build the AMAT chain from the bottom up. The penalty of level k is the hit time of level k+1 plus that level miss rate times its own penalty, and writing it downward instead is the fastest way to double-count a level.',
      importantNote: 'A local miss rate and a global miss rate can differ by more than an order of magnitude for the same cache. Only the global rate predicts main-memory traffic, and it is the product of every local rate above and including that level.',
    },
    { id: 'memh-three-cs', title: '10. The Three Causes of a Miss, Separated by Experiment',
      content: `## 10.1 A classification is only useful if you can measure it

Section 5.3 named the three causes. Naming them is easy; deciding which one a
given miss belongs to is the part that has practical value, because each has a
different cure and two of the cures actively harm the third.

The standard separation is an experiment rather than an argument, and it takes
three simulations of the same address trace:

1. Run the trace through an **infinite** cache. Every miss it takes is a first
   reference to a block, so every miss is **compulsory**.
2. Run the trace through a **fully associative** cache of the target capacity.
   Its misses minus the compulsory ones are **capacity** misses: blocks that
   were evicted only because the cache was too small.
3. Run the trace through the **actual** cache. Its misses minus the fully
   associative count are **conflict** misses: blocks that were evicted despite
   there being room elsewhere in the cache.

## Worked example 10.1 — a working set that does not fit

**Given.** A 2 KB array of four-byte integers, 512 elements, walked twice, in a
1 KB cache with 32-byte blocks. Separate the misses.

**Work.** The array occupies

$$2048 / 32 = 64$$

blocks, so 64 compulsory misses are unavoidable. Simulating the fully
associative 1 KB cache gives 128 misses, so the capacity component is

$$128 - 64 = 64$$

Simulating the direct-mapped 1 KB cache also gives 128 misses, so the conflict
component is

$$128 - 128 = 0$$

**Answer: 64 compulsory, 64 capacity, 0 conflict.** The second pass finds
nothing, because a cyclic walk over 64 blocks in a 32-block cache evicts each
block just before it is needed again — the worst case for least-recently-used
replacement, and the reason associativity is powerless here. Enlarging the
cache to 4 KB drops the total to 64, exactly the compulsory floor, which
confirms that every avoidable miss was a capacity miss.

## Worked example 10.2 — the same experiment on the conflicting trace

**Given.** The two interleaved arrays of Section 8.2 in the 1 KB
direct-mapped cache: 256 misses in 256 references.

**Work.** The trace touches 32 distinct blocks, so 32 misses are compulsory.
The fully associative 1 KB cache holds all 32 blocks with room to spare, so it
takes 32 misses and the capacity component is zero. The conflict component is
therefore

$$256 - 32 = 224$$

**Answer: 32 compulsory, 0 capacity, 224 conflict.** Set this beside Worked
example 10.1: identical cache, identical miss count in the associative case,
and completely opposite diagnoses. Only the experiment distinguishes them, and
the cure differs accordingly — associativity or padding fixes this one and does
nothing for the other.

| Cause | Test that identifies it | Cure | What the cure costs |
|---|---|---|---|
| Compulsory | misses an infinite cache still takes | larger blocks, prefetching | bandwidth; wasted fetch if the guess is wrong |
| Capacity | fully associative misses minus compulsory | a larger cache | hit time, area, power |
| Conflict | actual misses minus fully associative | more ways, or padding the data | comparators in the critical path |

## 10.2 The cures pull against one another

Larger blocks reduce compulsory misses, because one fetch brings in more of
what will be needed. They also raise the miss penalty, since more bytes must be
moved, and they reduce the number of blocks at fixed capacity, which raises
conflict misses. Past some block size the curve turns around, and where it
turns depends on the program.

More associativity reduces conflict misses and lengthens the hit time, as
Section 8.3 described. A larger cache reduces capacity misses and lengthens the
hit time as well, since a bigger array takes longer to index and drive.

There is no setting that minimises all three, which is why cache design is
reported as a set of measured curves rather than derived from a formula. The
useful exam skill is not choosing the optimum but recognising which of the
three causes a described symptom belongs to.

## Worked example 10.3 — diagnosing from symptoms alone

**Given.** Three reported symptoms. Name the cause of each.

*Symptom A: the miss rate does not improve when the cache is doubled, but
falls to almost nothing when associativity is doubled at the same capacity.*
The capacity was never the constraint and the placement was. **Conflict.**

*Symptom B: the miss rate falls steadily as the cache grows, and full
associativity at the original size gives the same improvement as doubling the
capacity did.* The blocks were being evicted for want of room. **Capacity.**

*Symptom C: the miss rate is unchanged by capacity, associativity and
replacement policy alike, and falls only when the block size is raised.* Every
miss is a first touch. **Compulsory.**

**Answer: conflict, capacity, compulsory.** The trap in this style of question
is symptom A: doubling capacity in a direct-mapped cache also doubles the
number of lines, which changes the index width and can accidentally relieve a
conflict. That is why the associativity test rather than the capacity test is
the reliable one.

**How the exam asks this.** Usually as a matching question between a cause and
its remedy. Remember which direction each remedy pushes, and that only one of
the three — compulsory — survives an infinitely large, infinitely associative
cache.`,
      examTip: 'Full associativity at the same capacity is the single diagnostic that separates conflict from capacity. If the misses vanish it was conflict; if they do not it was capacity, and no rearrangement of the cache will help.',
      importantNote: 'A larger block cuts compulsory misses and simultaneously raises both the miss penalty and the conflict rate, because fewer blocks fit. Any answer that treats block size as monotonically good has ignored two of its three effects.',
    },
    { id: 'memh-replacement', title: '11. Replacement Policies, Compared on One Reference String',
      content: `## 11.1 The question only exists when there is a choice

A direct-mapped cache never asks which block to evict, because the incoming
block has exactly one legal home. Every associative organisation must choose,
and the rule it uses is the replacement policy. Four are worth knowing.

| Policy | Rule | Cost to implement | Typical quality |
|---|---|---|---|
| FIFO | evict the block resident longest | one counter per set | mediocre, occasionally anomalous |
| LRU | evict the block unused longest | order bits per set, n log n for n ways | good, the usual reference point |
| Random | evict any block | a pseudo-random generator | close to LRU at high associativity |
| OPT | evict the block needed farthest ahead | impossible; needs the future | the unbeatable lower bound |

OPT is not implementable and is not meant to be. It exists as a yardstick: if
LRU is within a few percent of OPT on a workload, no better policy is worth
building for that workload.

## 11.2 One string, three policies, two sizes

Everything below uses the reference string

**1 2 3 4 1 2 5 1 2 3 4 5**

twelve references to five distinct blocks, run against a fully associative
cache of three and then four frames. Every count that follows was produced by
simulating the string, not by a formula.

| Policy | 3 frames | 4 frames | 5 frames |
|---|---|---|---|
| FIFO | 9 misses | 10 misses | 5 misses |
| LRU | 10 misses | 8 misses | 5 misses |
| OPT | 7 misses | 6 misses | 5 misses |

Two entries in that table are meant to be surprising, and both are correct.

## Worked example 11.1 — the case where LRU loses to FIFO

**Given.** The string above on three frames.

**Work.** FIFO takes 9 misses and 3 hits:

$$12 - 9 = 3$$

$$9 / 12 = 0.750$$

LRU takes 10 misses and 2 hits:

$$12 - 10 = 2$$

$$10 / 12 = 0.833$$

**Answer: FIFO wins, 9 misses against 10.** Following both policies past
reference 7 shows why. After the seventh reference both hold blocks 1, 2 and 5,
and both hit on references 8 and 9. The divergence is at reference 10, which
asks for block 3:

| Reference | FIFO resident set | FIFO result | LRU resident set | LRU result |
|---|---|---|---|---|
| 7: block 5 | 1 2 5 | miss, evicts 4 | 1 2 5 | miss, evicts 4 |
| 8: block 1 | 1 2 5 | hit | 2 5 1 | hit |
| 9: block 2 | 1 2 5 | hit | 5 1 2 | hit |
| 10: block 3 | 2 5 3 | miss, evicts 1 | 1 2 3 | miss, evicts 5 |
| 11: block 4 | 5 3 4 | miss, evicts 2 | 2 3 4 | miss, evicts 1 |
| 12: block 5 | 5 3 4 | **hit** | 3 4 5 | miss, evicts 2 |

The hits at references 8 and 9 reordered LRU's queue and left block 5 as the
least recently used, so LRU threw away the one block the string ends with.
FIFO ignored those hits, kept 5, and collected the final reference. **The
distractor here is the belief that LRU is optimal.** It is not; it is a good
heuristic that fails whenever recency is a poor predictor of the future, and a
reference string with a long reuse distance is exactly that case.

## Worked example 11.2 — Belady's anomaly

**Given.** The same string on FIFO with three frames and then four.

**Work.** FIFO takes 9 misses with three frames and 10 with four. **More memory
produced more misses.**

![Misses on the twelve-reference string against the number of frames available, for FIFO, LRU and OPT. FIFO rises from nine misses at three frames to ten at four, which is Belady's anomaly; LRU falls from ten to eight over the same step, and OPT lies below both at seven and six.](/courses/fe-ee/figures/sys2-mem-belady.svg)

**Answer: 9 against 10, an anomaly.** The reason is structural rather than
accidental. With three frames FIFO's resident set at a given moment is not
necessarily a subset of what it would hold with four, because the eviction
order depends on arrival order and the arrival order changes when the capacity
changes. Policies for which the smaller cache's contents are always a subset of
the larger one's are called stack policies, and they cannot show this
behaviour. LRU is a stack policy, which is the one thing it is guaranteed
better at than FIFO. Its 10 to 8 improvement over the same step is what a
well-behaved policy looks like.

## Worked example 11.3 — how good is good?

**Given.** OPT on three frames takes 7 misses. Compare LRU and FIFO against it.

**Work.** OPT achieves

$$12 - 7 = 5$$

hits, a hit rate of

$$5 / 12 = 0.417$$

against FIFO's 3 hits and LRU's 2. Expressed as excess misses over the optimum,
FIFO is 2 above and LRU is 3 above.

**Answer: both are well short of OPT on this string.** That is expected on a
string this short and this adversarial. On real traces of millions of
references LRU typically lands within a few percent of OPT, which is why the
industry builds approximations of LRU rather than approximations of anything
else. The practical policies in real caches are those approximations —
tree-based pseudo-LRU, or a single not-recently-used bit — because exact LRU
needs an ordering of every way in every set and the bookkeeping grows faster
than the associativity does.

**How the exam asks this.** A short reference string, a frame count and a
policy, then the miss count. Draw the resident set after every reference; do
not try to do it in your head, and remember that a hit reorders the set under
LRU and leaves it untouched under FIFO.`,
      examTip: 'Under LRU a hit changes the eviction order; under FIFO it does not. Half the marks lost on replacement questions come from reordering the queue on a FIFO hit, which turns FIFO into LRU and gives whichever answer the other policy deserves.',
      importantNote: 'FIFO can take more misses with more frames — Belady\'s anomaly — because it is not a stack policy. LRU and OPT are stack policies and are immune, so an answer showing LRU getting worse with more frames contains an arithmetic error.',
    },
    { id: 'memh-write', title: '12. Write Policies and the Traffic They Generate',
      content: `## 12.1 Four decisions, not one

Section 1.3 tabulated write-through against write-back. There are actually two
independent choices, and problems routinely combine them.

The first is **what happens on a write hit**. Write-through sends the word to
the next level as well as into the cache, so memory is always current.
Write-back marks the block dirty and defers, so memory is stale until the block
is evicted.

The second is **what happens on a write miss**. Write-allocate fetches the
block first and then writes into it; no-write-allocate sends the word onward
and leaves the cache untouched. The natural pairings are write-back with
write-allocate, and write-through with no-write-allocate, because each
combination avoids doing work the other half would undo.

| Policy pair | On a write hit | On a write miss | Memory contents |
|---|---|---|---|
| Write-through, no allocate | write both | write memory only | always current |
| Write-back, write allocate | mark dirty | fetch, then mark dirty | stale until eviction |

## 12.2 Traffic, computed rather than asserted

Assertions about which policy is cheaper are worth nothing without a workload,
so take one: one million references, 25 percent of them writes, 32-byte blocks,
a 4 percent miss rate, and 30 percent of evicted blocks dirty.

**Write-through with no allocate.** Every write goes to memory as a word, and
every read miss fetches a block. Writes number

$$1000000 \\times 0.25 = 250000$$

so reads number

$$1000000 - 250000 = 750000$$

of which the misses are

$$750000 \\times 0.04 = 30000$$

Each fetches a block:

$$30000 \\times 32 = 960000$$

bytes. The writes themselves move four bytes each:

$$250000 \\times 4 = 1000000$$

bytes. The total is

$$960000 + 1000000 = 1960000$$

bytes.

**Write-back with write allocate.** Every miss, read or write, fetches a block:

$$1000000 \\times 0.04 = 40000$$

misses, moving

$$40000 \\times 32 = 1280000$$

bytes in. Dirty evictions write a block back:

$$0.30 \\times 40000 = 12000$$

evictions, moving

$$12000 \\times 32 = 384000$$

bytes out. The total is

$$1280000 + 384000 = 1664000$$

bytes, so write-back moves less by a factor of

$$1960000 / 1664000 = 1.178$$

**Answer: write-back moves 15.1 percent less traffic on this workload.**

![Megabytes moved to memory per million references against the fraction of evicted blocks that are dirty. Write-through is a flat line at 1.960 megabytes because it does not care how often a block is rewritten; write-back rises from 1.280 to 2.560 and crosses write-through at a dirty fraction of 0.531.](/courses/fe-ee/figures/sys2-mem-write-traffic.svg)

## Worked example 12.1 — where the two policies change places

**Given.** The same workload, with the dirty fraction d left free. At what d do
the two policies move equal traffic?

**Work.** Write-back traffic is the fetch traffic times one plus d, so setting
it equal to the write-through total,

$$1280000 \\, (1 + d) = 1960000$$

$$1 + d = 1960000 / 1280000 = 1.53125$$

$$d = 1.53125 - 1 = 0.53125$$

**Answer: d = 0.531.** Above that, more than half of all evicted blocks being
dirty, write-back actually moves more bytes than write-through, because it
pays a full 32-byte block for what write-through would have sent as scattered
four-byte words. The distractor is the flat claim that write-back always moves
less; it moves less when blocks are written repeatedly before eviction, which
is usually but not always true.

## Worked example 12.2 — the write buffer changes the question

**Given.** A write-through cache whose writes are absorbed by a four-entry
write buffer that drains to memory. The processor stalls only when the buffer
is full. Writes arrive at 250,000 per million references over a run of 0.5 ms,
and memory accepts one write every 80 ns. Does the buffer keep up on average?

**Work.** The run lasts 0.5 ms, which is 500 microseconds, so the writes arrive
at

$$250000 / 500 = 500$$

per microsecond. Memory accepts one every 80 ns, which is

$$1000 / 80 = 12.5$$

per microsecond, so demand exceeds drain by

$$500 / 12.5 = 40$$

**Answer: no — the buffer is overwhelmed by a factor of 40, saturates within a
few writes, and thereafter the machine runs at memory speed.** Four entries buy
nothing against a mismatch of that size; a write buffer smooths bursts, it does
not raise average bandwidth. This is exactly why a write-through cache is never
placed next to a fast core without a write-back cache beneath it to absorb the
traffic, and why the pairings in Section 12.1 are the ones that exist.

## 12.3 What write-back costs besides bytes

Deferring a write buys traffic and sells three things. Memory is no longer
authoritative, so anything else that reads memory — another processor, a DMA
engine, a debugger — can see stale data unless a coherence mechanism intervenes.
An eviction can now take twice as long, because a dirty block must be written
out before the incoming block can be read in, unless the cache holds it in a
write-back buffer and defers again. And a power failure loses whatever was
dirty, which is why systems that care about durability force write-backs at
defined points rather than trusting the cache.

**How the exam asks this.** Give a reference count, a write fraction, a miss
rate, a block size and often a dirty fraction, then ask for bytes moved. Count
the two directions separately — fills coming in, write-backs or write-throughs
going out — and be careful that write-through moves a word while write-back
moves a whole block.`,
      examTip: 'Write-through moves a WORD per write; write-back moves a BLOCK per dirty eviction. Mixing the two units is the standard error and it changes the answer by the ratio of block size to word size, which is eight on a 32-byte block.',
      importantNote: 'Whether write-back moves less traffic depends on the dirty fraction. On the standard workload here the crossover is at 0.531, and above it the block-sized write-backs cost more than the word-sized write-throughs they replaced.',
    },
    { id: 'memh-vm-endtoend', title: '13. Virtual Memory Worked End to End',
      content: `## 13.1 What a translation actually is

Section 2.1 gave the shape: a virtual address splits into a page number and an
offset, the page number is translated and the offset is carried through
untouched. This section does the arithmetic on a machine of the size actually
in use, which is where the difficulties appear.

Take a 48-bit virtual address with 4 KB pages. The offset takes

$$\\log_2 4096 = 12$$

bits, leaving

$$48 - 12 = 36$$

bits of virtual page number. A flat table with one 8-byte entry per page would
need

$$68719476736 \\times 8 = 549755813888$$

bytes, which is

$$549755813888 / 1073741824 = 512$$

gigabytes — **per process.** The flat table is not merely wasteful here, it is
larger than the memory it describes, so it is not a design that can be repaired
by buying more RAM. Layering is not an optimisation on this machine; it is the
only option.

## 13.2 The four-level table, and one address through it

Split the 36-bit page number into four 9-bit indices, one per level:

$$4 \\times 9 + 12 = 48$$

Each level's table then has 512 entries of 8 bytes,

$$512 \\times 8 = 4096$$

bytes — exactly one page, which is not a coincidence: making a page table fit
in a page is what lets the operating system allocate table pages from the same
pool as everything else.

## Worked example 13.1 — decompose a virtual address completely

**Given.** The virtual address 0x7F3A2B4C1D08 on the machine above. Give the
four table indices and the offset, then form the physical address assuming the
final entry contains frame number 0x1A2B3.

**Work.** Take the fields from the bottom. The offset is the low 12 bits:

**offset = 0xD08 = 3336**

Then four 9-bit fields, read from the top of the address downward because that
is the order the walk uses:

| Field | Bits | Value | Hex |
|---|---|---|---|
| Level-4 index | 47 to 39 | 254 | 0x0FE |
| Level-3 index | 38 to 30 | 232 | 0x0E8 |
| Level-2 index | 29 to 21 | 346 | 0x15A |
| Level-1 index | 20 to 12 | 193 | 0x0C1 |
| Page offset | 11 to 0 | 3336 | 0xD08 |

Reassembling those five fields reproduces 0x7F3A2B4C1D08 exactly, which is the
check to run before going further. The walk reads the level-4 table at entry
254, follows it to a level-3 table and reads entry 232, and so on down to entry
193 of the level-1 table, which holds the frame number. The physical address is
the frame number shifted up by the offset width, with the offset dropped in:

**physical address = 0x1A2B3D08**

and the frame itself begins at

$$107187 \\times 4096 = 439037952$$

**Answer: indices 254, 232, 346 and 193, offset 3336, physical address
0x1A2B3D08.** The trap is reversing the index order — reading the low nine bits
above the offset as the top-level index. The reassembly check catches it
immediately, which is why it is worth doing.

## Worked example 13.2 — what the walk costs

**Given.** Four levels, each read costing one DRAM access at 80 ns, and a TLB
that hits in 0.5 ns. Compute the average translation time for TLB hit rates of
98, 99.5 and 99.9 percent.

**Work.** A complete walk is four dependent memory accesses:

$$t_{walk} = 4 \\times 80 = 320$$

nanoseconds. Then the average is the usual weighted sum:

$$0.98 \\times 0.5 + 0.02 \\times 320 = 6.89$$

$$0.995 \\times 0.5 + 0.005 \\times 320 = 2.0975$$

$$0.999 \\times 0.5 + 0.001 \\times 320 = 0.8195$$

**Answer: 6.89, 2.0975 and 0.8195 nanoseconds.** Two percent of accesses
missing the TLB costs more than thirteen times the hit time itself, and the
whole of that cost is translation — the data has not been fetched yet. This is
why the last fraction of a percent of TLB hit rate is worth chasing, and why
the walk itself is cached in the ordinary data caches on real machines, which
this model deliberately does not assume.

## 13.3 Reach, not size, is the figure of merit

Section 5.5 introduced reach. Restated as a design rule: a TLB is large enough
when its reach covers the program's active footprint, and its entry count alone
says nothing.

$$reach = N_{entries} \\times S_{page}$$

For a 1024-entry TLB with 4 KB pages,

$$1024 \\times 4096 = 4194304$$

bytes — 4 MB. The same TLB with 2 MB pages reaches

$$1024 \\times 2097152 = 2147483648$$

bytes, 2 GB, a factor of

$$2147483648 / 4194304 = 512$$

![Average translation time against resident footprint for a 1024-entry TLB, on logarithmic footprint axes. With 4 KB pages the curve rises out of the sub-nanosecond region once the footprint passes the 4 MB reach and saturates near the 320 nanosecond walk cost; with 2 MB pages the same rise is deferred until 2 GB.](/courses/fe-ee/figures/sys2-mem-tlb-reach.svg)

The figure shows why large pages are requested by databases and scientific
codes and ignored by everything else. Below the reach the translation cost is
invisible; above it the cost climbs to the full walk time within about two
decades of footprint. A workload that sits below 4 MB gains nothing from large
pages; one that sits at 1 GB gains almost everything.

## Worked example 13.3 — a page fault budget

**Given.** Main memory answers in 100 ns and a page fault costs 5 ms of disk
service. What page fault rate keeps the average access within 10 percent of the
memory time?

**Work.** The average access time is

$$t_{avg} = (1 - p) \\times 100 + p \\times 5000000$$

nanoseconds. Setting it to 110 and solving,

$$10 = p \\, (5000000 - 100)$$

$$5000000 - 100 = 4999900$$

$$p = 10 / 4999900 = 0.000002$$

which is one fault in

$$1 / 0.000002 = 500000$$

accesses. **Answer: about two faults per million accesses, one in five hundred
thousand.** The distractor is a rate that sounds reassuringly small, such as one
in a thousand: at that rate the average access is 100 nanoseconds plus five
microseconds of fault, which is fifty times slower rather than ten percent
slower. When one outcome is five million times more expensive than the other,
intuition about "rare" is worthless and the arithmetic is compulsory.

## 13.4 Where the cache and the page table meet

One question remains: does the cache index with virtual or physical addresses?
Indexing with virtual addresses lets the cache lookup start before the
translation finishes, which is fast, but two processes using the same virtual
address for different data will collide. Indexing with physical addresses is
correct and serialises the TLB lookup in front of the cache lookup.

The standard resolution is to arrange that the index bits lie entirely inside
the page offset, which translation does not change. Then the set can be
selected from the untranslated bits while the TLB produces the tag to compare —
virtually indexed, physically tagged, with both lookups in parallel. The
constraint this imposes is exact:

$$C \\le S_{page} \\times n_{ways}$$

With 4 KB pages a direct-mapped cache of this kind cannot exceed 4 KB, an
eight-way one cannot exceed 32 KB, and that inequality is a large part of why
first-level caches are so often exactly 32 KB and eight-way.

**How the exam asks this.** Offset bits from the page size, page-number bits
from what remains, entries from two to that power, table size from entries
times entry width. Then either a reach calculation or a weighted average over
TLB hit and miss.`,
      examTip: 'Page offset bits come from the PAGE size and cache offset bits from the BLOCK size. They are different quantities in the same address and a question that supplies both is usually checking that you kept them apart.',
      importantNote: 'A four-level walk is four dependent memory accesses, so its cost is four times the memory latency and cannot be overlapped: each level supplies the address of the next. That serial dependence is why TLB hit rate matters far more than any other translation parameter.',
    },
    { id: 'memh-problems', title: '14. Problem Sets',
      content: `## Problem Set A — caches, fields and hit rates

**A1.** A 16 KB direct-mapped cache has 64-byte blocks and 32-bit addresses.
Give the three field widths.

*Answer.* Lines number

$$16384 / 64 = 256$$

so the offset is 6 bits, the index is 8 bits, and the tag is

$$32 - 8 - 6 = 18$$

**6, 8 and 18.** Check the sum: 6 plus 8 plus 18 is 32. The distractor is
taking the index from the capacity in bytes rather than from the line count,
which gives 14 index bits and a tag of 12.

**A2.** The same 16 KB capacity is rebuilt as eight-way set associative with
the same 64-byte blocks. Give the new field widths.

*Answer.* Sets number

$$16384 / 512 = 32$$

so the index is 5 bits, the offset is unchanged at 6, and the tag is

$$32 - 5 - 6 = 21$$

**6, 5 and 21.** Three index bits moved into the tag, which is exactly log2 of
the eight ways. The trap is leaving the index at 8 because there are still 256
lines; the index names sets, not lines.

**A3.** A program walks an array of 8-byte doubles at unit stride through a
cache with 64-byte blocks, large enough that nothing is evicted. What is the
hit rate?

*Answer.* Elements per block are

$$64 / 8 = 8$$

so one miss occurs per eight references and the hit rate is

$$1 - 8 / 64 = 0.875$$

**87.5 percent.** The distractor is 64 over 8 giving a hit rate of 8, which is
not a probability; if a hit rate comes out above one, the ratio has been
inverted.

**A4.** The same array is walked at a stride of 64 bytes. What is the hit rate,
and what changes if the block size is raised to 128 bytes?

*Answer.* At a 64-byte stride every reference lands in a new block, so the hit
rate is **zero**. Raising the block to 128 bytes puts two consecutive strided
elements in one block, giving one hit for every two references:

$$1 - 64 / 128 = 0.500$$

**0 percent, then 50 percent.** The lesson is that the hit rate on a strided
walk depends on the ratio of block size to stride and on nothing else, until
the working set stops fitting.

**A5.** Two 4 KB arrays are accessed alternately in a 4 KB direct-mapped cache
with 64-byte blocks. Predict the hit rate, then say what a two-way cache of the
same capacity would give.

*Answer.* Take the arrays to hold 4-byte integers, so each holds

$$4096 / 4 = 1024$$

elements and walking both once makes

$$1024 \\times 2 = 2048$$

references. Direct-mapped, each element of the second array maps to the same
line as the corresponding element of the first, so every access evicts what the
next one needs and the hit rate is **zero**. A two-way cache of the same
capacity holds both blocks in one set, so only the compulsory misses survive.
The two arrays span

$$8192 / 64 = 128$$

blocks, so the two-way hit rate is

$$1 - 128 / 2048 = 0.9375$$

**0 percent direct-mapped, 93.75 percent two-way.** This is Section 8.2's
experiment at a different size, and the simulated version of that experiment
gave exactly the analogous result: 0 hits in 256 direct-mapped, 224 in 256
two-way.

**A6.** A cache reports a 2 percent miss rate with a 1 ns hit time and an 80 ns
penalty. What is the AMAT, and what miss rate would be needed to bring AMAT
below 2 ns?

*Answer.* The AMAT is

$$AMAT = 1 + 0.02 \\times 80 = 2.60$$

nanoseconds. For AMAT below 2, the stall term must be below 1 ns:

$$m = 1 / 80 = 0.0125$$

**2.60 ns, and a miss rate below 1.25 percent.** The distractor is halving the
miss rate to 1 percent and expecting AMAT to halve; it falls to 1.80, because
the hit time is a floor that no miss rate can go under.

## Problem Set B — hierarchy, replacement and writes

**B1.** A two-level cache has a 1 ns L1 with a 4 percent miss rate and a 10 ns
L2 with a 30 percent local miss rate, over an 80 ns memory. Find the AMAT and
the global L2 miss rate.

*Answer.* Build from the bottom:

$$P_{L1} = 10 + 0.30 \\times 80 = 34$$

$$AMAT = 1 + 0.04 \\times 34 = 2.36$$

nanoseconds, and the global rate is

$$0.04 \\times 0.30 = 0.012$$

**2.36 ns and 1.2 percent global.** The trap is reporting 30 percent as the rate
at which DRAM is disturbed. Only 4 percent of accesses reach L2 at all, so the
DRAM rate is the product, 1.2 percent, and quoting the local figure overstates
main-memory traffic twenty-five fold.

**B2.** The reference string 1 2 3 4 1 2 5 1 2 3 4 5 is run on four frames with
FIFO and with LRU. Give both miss counts and say which is anomalous.

*Answer.* Simulating the string gives FIFO 10 misses and LRU 8. FIFO took 9 on
three frames, so **FIFO is anomalous: adding a frame added a miss.** LRU went
from 10 to 8, as a stack policy must. The distractor is assuming the larger
cache is always at least as good, which is true for LRU and OPT and false for
FIFO.

**B3.** A write-back cache with 64-byte blocks sees 2 million references, a
5 percent miss rate and 40 percent of evictions dirty. How many bytes move?

*Answer.* Misses number

$$2000000 \\times 0.05 = 100000$$

fetching

$$100000 \\times 64 = 6400000$$

bytes, and dirty write-backs number

$$0.40 \\times 100000 = 40000$$

moving

$$40000 \\times 64 = 2560000$$

bytes, for a total of

$$6400000 + 2560000 = 8960000$$

**8.96 MB.** The trap is charging the write-back for every eviction rather than
for the dirty fraction, giving 12.8 MB — a 43 percent overstatement.

**B4.** A 32-entry TLB with 8 KB pages serves a program whose active data is
1 MB. Is the TLB adequate?

*Answer.* Its reach is

$$32 \\times 8192 = 262144$$

bytes, 256 KB, against a 1 MB footprint, so it covers

$$262144 / 1048576 = 0.25$$

of the working set. **No — three quarters of the footprint is outside the
reach, and the program will miss the TLB constantly.** The distractor is
comparing the entry count with anything; 32 entries is neither large nor small
until it is multiplied by the page size.

**B5.** A four-level page table walk costs 4 memory accesses of 60 ns. With a
TLB hit rate of 99 percent and a 1 ns TLB, what is the average translation time,
and what does raising the hit rate to 99.9 percent give?

*Answer.* The walk costs

$$4 \\times 60 = 240$$

nanoseconds. Then

$$0.99 \\times 1 + 0.01 \\times 240 = 3.39$$

and

$$0.999 \\times 1 + 0.001 \\times 240 = 1.239$$

**3.39 ns, falling to 1.239 ns.** A tenfold reduction in miss rate bought a
2.7-fold reduction in translation time, not tenfold, because the hit time
becomes the floor — the same structure as problem A6.

**B6.** Separate the misses for a trace that takes 400 misses in the real
cache, 250 in a fully associative cache of the same capacity, and 90 in an
infinite cache.

*Answer.* Compulsory misses are the infinite-cache count, 90. Capacity misses
are

$$250 - 90 = 160$$

and conflict misses are

$$400 - 250 = 150$$

**90 compulsory, 160 capacity, 150 conflict.** Check that the three sum to 400.
The distractor is subtracting in the wrong order and reporting a negative
count; the infinite cache always misses least and the real cache always misses
most, so the two differences are both non-negative.

## Practice Problems C — mixed, and the traps that go with them

**C1.** A machine has a 4 GB physical memory and 4 KB pages. How many frames
are there, and how wide is a frame number?

*Answer.* Frames number

$$4294967296 / 4096 = 1048576$$

which is 2 to the twentieth, so the frame number is **20 bits, and there are
1,048,576 frames.** The trap is answering 32 bits because the machine is
32-bit; the frame number is the physical address minus the offset bits.

**C2.** Why does raising associativity from one way to two typically help far
more than raising it from eight ways to sixteen?

*Answer.* Because conflict misses are what associativity removes, and the first
extra way removes most of them: a direct-mapped cache fails whenever two hot
blocks share a set, and two ways is enough for the overwhelmingly common case
of exactly two. By eight ways there is almost nothing left to remove, so the
extra comparators buy a diminishing fraction of an already small quantity while
still lengthening the hit time. **The gain is concentrated in the first
doubling.** Section 8.2's simulation is the extreme case: one way to two took
the misses from 256 to 32, and every further doubling to thirty-two ways left
them at 32.

**C3.** A cache has a 95 percent hit rate. A colleague proposes to describe it
as "twenty times more hits than misses" and concludes the misses are
negligible. Assess this using the model ladder.

*Answer.* The ratio is right and the conclusion is wrong. With a 1 ns hit and
an 80 ns penalty the time split is

$$0.95 \\times 1 = 0.95$$

nanoseconds of hit time against

$$0.05 \\times 80 = 4.00$$

nanoseconds of miss time, so

$$4.00 / 4.95 = 0.808$$

**Over 80 percent of the total access time is spent on 5 percent of the
accesses.** The trap is reasoning about frequencies when the two outcomes have
wildly different costs, which is the same error as the page-fault problem in
Worked example 13.3.

**C4.** A processor is virtually indexed and physically tagged with 4 KB pages.
What is the largest four-way cache it can have without an aliasing problem, and
what would allow a larger one?

*Answer.* The index and offset together must fit inside the page offset, so

$$4096 \\times 4 = 16384$$

bytes — **16 KB.** Growing beyond it requires either more ways, since the limit
scales with associativity, or larger pages, or hardware that detects and
resolves aliases. The distractor is to treat the limit as depending on the
block size; the block size cancels, because it appears in the offset on one
side and in the set count on the other.`,
      examTip: 'Every cache problem starts with three divisions: capacity over block size gives lines, lines over ways gives sets, block size gives the offset. Do all three before touching the address, and the field widths follow without further thought.',
      importantNote: 'Frequencies and costs must be multiplied before they are compared. A 5 percent miss rate against an 80-fold penalty owns more than 80 percent of the access time, and a one-in-a-thousand page fault against a fifty-thousand-fold penalty owns almost all of it.',
    },
  ],
  keyTakeaways: [
    'Hierarchy: each level ~10x larger/slower. t_avg = h*t_cache + (1-h)*t_memory.',
    'Write-through: simple. Write-back: fast (dirty bit).',
    'Virtual memory: page table maps VPN -> PFN. Offset unchanged.',
    'Page offset = log_2(page_size); VPN = address_bits - offset_bits.',
    'TLB caches translations (~1 ns hit vs ~100 ns miss).',
    'Page faults ~10 ms; minimizing faults is critical.',
  ],
},

fee_io_interfacing: { topicId: 'fee_io_interfacing', title: 'I/O and Interfacing', domainWeight: 'Computer Systems · 3–5%',
  overview: 'I/O interfacing connects CPU to peripherals via programmed I/O, interrupts, or DMA. Serial protocols (I2C, SPI, USB, PCIe) offer different speed/complexity tradeoffs.',
  sections: [
    { id: 'io-methods', title: '1. I/O Methods',
      content: `## 1.1 Three I/O Approaches

| Method | CPU Usage | Throughput | Complexity |
|---|---|---|---|
| **Programmed (polling)** | 100% busy-wait | Lowest | Simplest |
| **Interrupt-driven** | Low (ISR only) | Moderate | Moderate |
| **DMA** | Minimal (setup only) | Highest | Most complex |

## 1.2 Interrupts

| Type | Property |
|---|---|
| Maskable | Can be disabled |
| Non-maskable (NMI) | Cannot disable (power fail) |
| Vectored | Device provides ISR address |

**Interrupt latency**: time from request to ISR execution.

## 1.3 DMA

DMA controller transfers data directly between device and memory. CPU only handles setup and completion interrupt. Essential for disk/network.`,
      examTip: 'Efficiency: Programmed < Interrupt < DMA. DMA frees CPU during transfer -- essential for high-speed devices.',
      importantNote: 'DMA and CPU share the memory bus. DMA may temporarily block CPU memory access (cycle stealing).',
    },
    { id: 'io-protocols', title: '2. Serial Protocols',
      content: `## 2.1 Common Interfaces

| Protocol | Wires | Speed | Topology |
|---|---|---|---|
| **I2C** | 2 (SDA, SCL) | Up to 3.4 Mbps | Multi-master/slave |
| **SPI** | 4 (MOSI, MISO, CLK, CS) | 50+ Mbps | Single master |
| **UART** | 2 (TX, RX) | ~1 Mbps | Point-to-point |
| **USB 2.0** | 4 | 480 Mbps | Host-device |
| **USB 3.0** | 9 | 5 Gbps | Host-device |
| **PCIe 4.0** | Lanes | 16 GT/s/lane | Point-to-point |

**Speed order**, reading the table above: UART < I2C < SPI < USB < PCIe. UART is
the slowest of the group in practice — 115200 baud is the common default,
about 11.5 kB/s of payload once start and stop bits are counted — while SPI's
tens of megabits put it an order above I2C. Rank from the numbers, not from
how familiar the name sounds.

## 2.2 I2C vs. SPI

- I2C: 2 wires, addressing, multi-device, slower
- SPI: 4 wires (+ 1 CS per slave), no addressing, faster, full-duplex`,
      examTip: 'Speed: I2C < SPI < USB < PCIe. I2C uses 2 wires (simplest). SPI: 4 wires, faster. USB: hot-plug. PCIe: fastest.',
    },
    { id: 'io-exam', title: '3. I/O & Bus Problems',
      content: `## 3.1 DMA Transfer Time for 1 MB at 100 MB/s

**Given**: Transfer size = 1 MB, bus speed = 100 MB/s, DMA setup = 5 us, interrupt latency = 2 us.

**Transfer time**: t_transfer = size / rate = 10^6 / (100 * 10^6) = **10 ms**

**Total DMA time**: t_total = t_setup + t_transfer + t_interrupt = 5 us + 10 ms + 2 us = **10.007 ms**

| Phase | Time | CPU Busy? |
|---|---|---|
| DMA setup | 5 us | Yes |
| Data transfer | 10 ms | **No (CPU free)** |
| Completion interrupt | 2 us | Yes |
| **Total** | **10.007 ms** | **7 us (0.07%)** |

**CPU utilization**: 7 us / 10007 us = **0.07%** — DMA frees the CPU for 99.93% of the transfer.

**Compare with programmed I/O**: CPU busy for entire 10 ms = 100% utilization. DMA is ~1400x more CPU-efficient.

## 3.2 Interrupt Service Routine Timing

**Given**: Clock = 1 GHz, interrupt latency = 50 cycles, ISR = 200 instructions at CPI = 1.5, context save/restore = 30 cycles each.

- Interrupt latency: 50 / 10^9 = 50 ns
- Context save: 30 / 10^9 = 30 ns
- ISR execution: 200 * 1.5 / 10^9 = 300 ns
- Context restore: 30 / 10^9 = 30 ns
- **Total**: 50 + 30 + 300 + 30 = **410 ns**

**Maximum interrupt rate**: 1 / 410 ns = **2.44 MHz** (before CPU is fully consumed)

## 3.3 I2C vs SPI Throughput Comparison

| Feature | I2C (Fast Mode) | SPI |
|---|---|---|
| Clock speed | 400 kHz | 10 MHz |
| Data lines | 1 (SDA) | 2 (MOSI + MISO) |
| Overhead per byte | ~9 bits (8 data + ACK) | 8 bits (pure data) |
| **Effective throughput** | $400k/9 = 44.4 kB/s$ | $10M * 2 / 8 = 2.5 MB/s$ |
| Duplex | Half | **Full** |

SPI is **~56x faster** than I2C Fast Mode. But I2C uses only 2 wires and supports multi-master with built-in addressing — better for low-speed sensor networks.

**Exam strategy**: For DMA, total time = setup + transfer + interrupt. CPU is free during transfer. For interrupt timing, sum all phases: latency + save + ISR + restore. For protocol comparison, compute effective throughput including overhead bits.`,
      examTip: 'DMA total = setup + transfer + interrupt. The key insight: CPU utilization during DMA is nearly 0%. Compare this to 100% for polled I/O — a dramatic difference.',
      importantNote: 'DMA uses cycle stealing or burst mode. In cycle stealing, DMA takes one bus cycle at a time (minimal CPU disruption). In burst mode, DMA holds the bus for the entire transfer (faster but blocks CPU memory access).',
    },
    { id: 'io-framing', title: '4. Serial Framing: What a Baud Rate Actually Buys You',
      content: `## 4.1 Baud is not bit rate, and bit rate is not data rate

Three quantities get collapsed into one in casual speech, and separating them
is the entire content of several exam questions.

| Quantity | Definition | Units |
|---|---|---|
| **Baud** | signalling events per second on the line | symbols/s |
| **Bit rate** | bits carried per second | bit/s |
| **Data rate** | payload bytes delivered per second | byte/s |

Baud and bit rate coincide only when each symbol carries one bit, which is true
for a plain two-level UART line and false for the multi-level and quadrature
schemes used by modems and by high-speed links. Bit rate and data rate never
coincide on an asynchronous link, because framing bits ride along with every
character and carry no payload.

## 4.2 The 8N1 frame

The classic asynchronous format is written **8N1**: eight data bits, no parity,
one stop bit. Add the mandatory start bit and the frame is

**1 start + 8 data + 1 stop = 10 bits per character**

At 115,200 baud that gives

**115,200 / 10 = 11,520 characters per second**, an efficiency of **8/10 = 80
percent**

The start bit is not waste for its own sake. The receiver has no clock from the
transmitter, so it needs an edge to synchronise on; the falling edge into the
start bit is that trigger, after which the receiver samples at the middle of
each expected bit time using its own oscillator. The stop bit guarantees the
line returns to idle so the next start edge is unambiguous. That mechanism only
has to hold for ten bit times, which is why a UART tolerates a percent or two of
clock error while a synchronous link does not.

## 4.3 Adding parity costs a bit and buys a little

Switch to **8E1** — eight data bits, even parity, one stop bit — and the frame
grows to eleven bits:

**115,200 / 11 = 10,473 characters per second**, an efficiency of **8/11 = 72.7
percent**

So parity costs about 9 percent of the throughput. What does it buy? Take the
byte **0x5A**, which is 01011010 and contains **four** 1 bits. Even parity sets
the parity bit so the total count of 1s is even; four is already even, so the
parity bit is **0**. Odd parity would need the total to be odd, so its parity
bit is **1**.

The limits of the scheme are strict and are the usual examinable point:

| Errors in the frame | Detected by parity? |
|---|---|
| One bit flipped | **yes** |
| Two bits flipped | no — the count is even again |
| Three bits flipped | yes |
| Any even number | no |

Parity therefore detects all odd-numbered error patterns and corrects nothing.
For a channel where errors arrive in bursts, which flips several adjacent bits
at once, parity is close to useless and a cyclic redundancy check is used
instead.

## 4.4 Putting the numbers in perspective

It is worth attaching these figures to the protocol table in Section 2, because
the arithmetic reframes it. A UART running at 115,200 baud delivers about
**11.5 kilobytes per second**. That is a modest rate — three orders of magnitude
below what a 50 MHz SPI link moves, and five below a PCIe lane. The UART
survives because it needs two wires, no shared clock, no addressing and almost
no software, which is exactly the right trade for a console port or a sensor
that reports once a second.

| Format | Bits per character | Characters/s at 115.2 kbaud | Payload efficiency |
|---|---|---|---|
| **8N1** | 10 | **11,520** | **80.0%** |
| 8E1 | 11 | 10,473 | 72.7% |
| 7E1 | 10 | 11,520 | 70.0% |
| 8N2 | 11 | 10,473 | 72.7% |

Note the third row: seven data bits with parity and one stop bit is still a
ten-bit frame, so it delivers the same number of characters per second while
carrying one bit less of payload in each.

**How the exam asks this.** Compute characters or bytes per second from a baud
rate by dividing by the frame length, and be sure to count the start bit — it
is the one people forget. If a question asks for efficiency, it wants data bits
divided by total frame bits.`,
      examTip: 'Always count the start bit. An 8N1 frame is ten bits, not nine, so 115200 baud gives 11,520 bytes per second and not 12,800. Efficiency is data bits over frame bits: 80 percent for 8N1, 72.7 percent for 8E1.',
      importantNote: 'Parity detects any odd number of bit errors and corrects none. Two flipped bits leave the parity unchanged and pass undetected, which is why block protocols use a CRC rather than a parity bit.',
    },
    { id: 'io-ownership', title: '5. Who Pays for the Transfer: Polling, Interrupts, DMA, and the Address Map',
      content: `## 5.1 Put a cost on each byte

Section 1 ranked the three transfer methods qualitatively. Attach a cost model
to each and the ranking becomes a quantity you can compute for any device.

| Method | Processor cost | Per what |
|---|---|---|
| Programmed I/O (polling) | 0.4 microseconds | every byte |
| Interrupt-driven | 5 microseconds | every 16-byte FIFO block |
| DMA | 8 microseconds | every 4 KiB block (setup plus completion) |

These are representative figures for a small embedded processor, and the point
is the *shape* of each expression rather than the exact constant. Polling scales
with bytes. Interrupt service scales with bytes divided by the FIFO depth. DMA
scales with bytes divided by the transfer size, which is enormous.

## 5.2 What that costs at a real data rate

Evaluate all three at **1 MB/s**, a perfectly ordinary rate for a serial link or
a modest sensor stream:

| Method | Calculation | Processor time spent |
|---|---|---|
| Polling | 10^6 x 0.4 us | **40%** |
| Interrupt-driven | (10^6 / 16) x 5 us | **31.25%** |
| **DMA** | (10^6 / 4096) x 8 us | **0.195%** |

The first surprise is how little interrupts help. A 16-byte FIFO amortises the
5 microsecond service cost over only sixteen bytes, which comes to 0.3125
microseconds each — barely better than polling's 0.4. Interrupts win on
*responsiveness*, because the processor is free to do other work between
blocks, but on raw overhead they are the same order of magnitude as polling
until the FIFO gets deep. DMA is in a different regime entirely: **205 times**
cheaper than polling at this rate.

![Processor time spent moving data against the data rate, on logarithmic axes, for polling, interrupt-driven service and DMA. Each curve is the stated per-byte cost model evaluated and then clipped at one hundred percent, and the knees mark the saturation rates of 2.5, 3.2 and 512 megabytes per second.](/courses/fe-ee/figures/csys-io-utilization.svg)

Every curve is a straight line on these axes because every model is linear in
the data rate, and the flat tops are where the processor runs out of time
altogether:

| Method | Saturation rate | Meaning |
|---|---|---|
| Polling | 2.5 MB/s | at this rate the processor does nothing else |
| Interrupt per 16-byte block | 3.2 MB/s | only 28 percent better than polling |
| **DMA per 4 KiB block** | **512 MB/s** | two orders of magnitude of headroom |

Read across the figure at any rate and the design rule falls out: below roughly
100 kB/s any method works and the simplest one wins; between there and a few
MB/s the choice matters; above a few MB/s only DMA is possible at all.

## 5.3 Where the device lives in the address space

Two schemes exist for reaching a peripheral's registers.

**Memory-mapped I/O** places device registers in the ordinary address space, so
loads and stores reach them and no special instructions are needed. **Port-mapped
I/O** gives the machine a separate I/O address space with its own instructions,
which keeps the memory map clean at the cost of a second addressing mechanism.
Nearly all modern designs use the memory-mapped scheme.

Address decoding is then a comparison. Suppose a peripheral occupies a
**256-byte block starting at 0xFFFF0000** on a 32-bit machine. A 256-byte block
needs 8 bits of offset, so the decoder must compare the remaining

**32 - 8 = 24 address bits** against 0xFFFF00

and assert the device's chip select when they match, letting the low 8 bits
select the register. If the registers are 32 bits wide, the register at byte
offset **0x10** is word index **0x10 / 4 = 4** — the fifth register in the block.
Confusing byte offsets with word indices is the standard way to read the wrong
register from a datasheet.

One consequence deserves a note: memory-mapped registers must not be cached,
because reading the same device address twice can legitimately return different
values and writing to it has side effects. Marking those pages uncacheable, or
using explicitly volatile accesses in software, is what keeps the compiler and
the cache from optimising the I/O away.

## 5.4 What runs before anything else

At power-on the processor's program counter is set to a fixed **reset vector**
in nonvolatile memory, because RAM contains nothing. The firmware there — the
BIOS or its modern equivalent — initialises the memory controller and the
clocks, enumerates and configures buses so that devices acquire their address
ranges and interrupt assignments, runs a self-test, and finally loads the first
sector of a boot device into RAM and jumps to it. Everything in this topic
depends on that sequence having happened: DMA channels, interrupt vectors and
memory-mapped register windows are all set up during it.

**How the exam asks this.** Either a utilisation calculation — multiply the
per-transfer cost by the number of transfers per second — or a comparison
question asking which method suits a stated data rate. For DMA timing problems,
remember that the processor pays only the setup and the completion interrupt;
the transfer itself is free to it, though it does consume bus bandwidth.`,
      examTip: 'Interrupt-driven I/O costs the service time divided by the FIFO depth per byte, which is why a shallow FIFO makes interrupts barely cheaper than polling. Compute overhead as (bytes per second / block size) times (time per block) and compare against 100 percent.',
      importantNote: 'Memory-mapped device registers must be excluded from the cache and treated as volatile. A cached read of a status register returns a stale value forever, which is a failure mode no amount of correct logic elsewhere can recover from.',
    },
    { id: 'io-addrmap', title: '6. The Address Map, and What Decoding One Costs',
      content: `## 6.1 The choice is about the instruction set, not the wires

Section 5.3 introduced the two ways of reaching a peripheral register. The
distinction is worth pressing on, because it is not really a distinction about
hardware — the wires that select a device are the same either way — but about
whether the processor has a second addressing mechanism in its instruction set.

Under **memory-mapped** addressing the register is an address like any other, so
every addressing mode, every load and store, and every pointer idiom in a
high-level language reaches it. Under **port-mapped** addressing there is a
separate I/O address space with its own instructions and its own control line
telling the bus which space a transaction belongs to.

| Property | Memory-mapped | Port-mapped |
|---|---|---|
| Instructions needed | the ordinary loads and stores | a dedicated input and output pair |
| Addressing modes available | all of them | usually one, a bare port number |
| Address space consumed | some of the memory map | none of it |
| Bus signals | address and data only | plus a space-select line |
| Reachable from a compiled pointer | yes | no, needs assembly or an intrinsic |

The cost column is the one to keep. Port-mapped addressing spends no memory
addresses, and on a machine with a 16-bit address bus that mattered enormously.
On a 32-bit machine it does not. Give a peripheral window one mebibyte of a
four-gibibyte space and the fraction spent is

$$1048576 / 4294967296 = 0.000244$$

which is 0.0244 percent of the map. That is why the memory-mapped scheme won:
the resource it consumes stopped being scarce, and in exchange every pointer,
array and structure in the language reaches a device register directly.

## 6.2 Decoding is a comparison, and its width is arithmetic

A device occupying a block of $2^{k}$ bytes uses the low $k$ address bits to
select a register inside itself, and the decoder must compare the remaining bits
against the block's base. On an $n$-bit address bus,

$$b = n - k$$

bits must be compared. Nothing else about the decode is free to choose: making
$b$ smaller is not a simplification, it is a decision to build **aliases**.

### Worked example 6A — a decoder that is too narrow

**Given.** A 32-bit machine. A peripheral occupies a 1 KiB block based at
0x40020000. To save gates the designer compares only the top 12 address bits.
Find the correct comparison width, the number of aliases created, and the total
address footprint the peripheral actually occupies.

**Offset bits.** A 1 KiB block holds 1024 byte addresses, so

$$\\log_{2} 1024 = 10$$

and $k = 10$.

**Correct comparison width.** From the relation above,

$$32 - 10 = 22$$

so 22 bits must be compared for the block to appear exactly once.

**Bits left undecoded.** Comparing only 12 of those 22 leaves

$$22 - 12 = 10$$

address bits that the decoder ignores. Every combination of those ten bits
selects the same physical registers, so the number of images is

$$2^{10} = 1024$$

**Footprint.** Those 1024 images each span 1 KiB, so the peripheral answers
across

$$1024 \\times 1024 = 1048576$$

bytes, one full mebibyte. **22 bits are required, 12 were compared, 1024 aliases
result, and the device occupies 1 MiB instead of 1 KiB.**

The failure this produces is not a wrong read. Every alias works perfectly.
What breaks is the *next* peripheral, which is assigned an address inside the
alias region, and then two devices answer the same cycle and drive the data bus
against each other. Incomplete decoding is a defect that tests clean and fails
during integration.

## 6.3 Byte offsets are not register indices

Datasheets list registers by **byte offset**. Code reaches them through a
pointer to a word. Confusing the two is the most common way to read the wrong
register, and the error is silent because the wrong register usually exists.

### Worked example 6B — offset against index

**Given.** A peripheral with sixteen 32-bit registers. The datasheet places the
status register at byte offset 28. Find its index in a word-pointer array, and
find which register is reached if the offset is used as the index directly.

**Correct index.** Each register spans four bytes, so

$$28 / 4 = 7$$

and the status register is element seven of the array.

**The mistake.** Using 28 as an index multiplies by the element size again:

$$28 \\times 4 = 112$$

bytes past the base, which is register

$$112 / 4 = 28$$

The block has only sixteen registers, numbered zero to fifteen, so register 28
lies

$$28 - 16 = 12$$

registers beyond the end of the block — inside whatever the map places next.
**Element 7 is correct; the naive version reaches byte offset 112, which is
outside the device entirely.**

## 6.4 A device register is not memory, and the cache must be told

The consequence flagged at the end of Section 5 deserves a number. A status
register has two properties ordinary memory does not: reading it twice can
legitimately give different answers, and reading it can have side effects, such
as clearing the flag that was just reported.

Put that register on a cacheable page with a 32-byte line. The first read misses
and pulls in

$$32 / 4 = 8$$

words, the status register among them. Every subsequent read hits in the cache
and returns the value captured at fill time. The polled loop of the next section
executes fifteen status tests for every byte it moves; on a cached register,
fourteen of every fifteen — and in fact all of them after the first — see a
frozen value, so the loop that waits for a ready flag either exits immediately
on a stale one or never exits at all. There is no intermediate behaviour and no
amount of correct logic elsewhere recovers from it.

Two mechanisms prevent this, and both are needed. The **page attribute** marks
the region uncacheable and unbufferable so the hardware never keeps a copy. The
**volatile qualifier** in the source tells the compiler it may not cache the
value in a register, may not reorder the access against other volatile accesses,
and may not delete a read whose result is discarded. The first stops the
hardware from optimising the access away; the second stops the compiler. A
driver that has one and not the other fails on exactly the machines where the
missing half was doing the work.

**How the exam asks this.** Almost always as a decode-width calculation: given a
block size and an address width, how many bits must be compared. Take the base-2
logarithm of the block size for the offset bits and subtract from the address
width. If the question supplies a comparison narrower than that, it is asking
for the alias count, which is two raised to the difference.`,
      examTip: 'Decode width is address bits minus the base-2 logarithm of the block size. If the question decodes fewer bits than that, the number of aliases is two raised to the shortfall, and the footprint is the alias count times the block size. Take the logarithm first; every other number in the problem follows from it.',
      importantNote: 'A device register needs both an uncacheable page attribute and a volatile qualifier. The attribute stops the cache from keeping a copy, the qualifier stops the compiler from keeping one in a register, and a driver with only one of them fails on the machines where the other was doing the work.',
    },
    { id: 'io-polled', title: '7. Programmed I/O, Counted Cycle by Cycle',
      content: `## 7.1 A machine to count on

The rest of this chapter compares the three transfer methods on one machine, so
the machine has to be pinned down first. Call it **M**: a 100 MHz processor, so

$$1000 / 100 = 10$$

nanoseconds per clock, with a single bus on which one transaction occupies one
clock. Attached to it is a byte-wide device that presents a new byte every 100
clocks, which is

$$100 \\times 10 = 1000$$

nanoseconds per byte, or one megabyte per second.

The polled input loop is eight instructions. Three of them test the status,
five move the byte:

| Instruction | Purpose | Cycles |
|---|---|---|
| load status register | read the flag word | 3 |
| and with ready mask | isolate the flag | 1 |
| branch if zero | go back and test again | 2 |
| load data register | take the byte | 3 |
| store to buffer | put it away | 3 |
| add to pointer | advance the destination | 1 |
| subtract from count | one fewer to go | 1 |
| branch if not zero | round again | 2 |

The two halves cost

$$3 + 1 + 2 = 6$$

cycles for one status test and

$$3 + 3 + 1 + 1 + 2 = 10$$

cycles to move a byte once the flag is set.

## 7.2 What the loop actually does, one clock at a time

The figure below is a stepped run of this loop, of the interrupt path of Section
8 and of a DMA channel, over the first two thousand clocks of the same transfer.
Nothing in it was produced by dividing bytes by a rate; the loop was executed
one clock at a time and its phases recorded.

![Processor activity over the first two thousand clock cycles of one transfer, drawn as three lanes. The polled lane is almost entirely status testing with a short move every hundred cycles, the interrupt lane is empty until the sixteen-byte buffer fills at cycle sixteen hundred and then shows one two-hundred-and-forty-four-cycle service burst, and the DMA lane shows one stolen bus cycle per byte.](/courses/fe-ee/figures/sys3-io-timeline.svg)

In the steady state the loop settles into a fixed pattern per byte: fifteen
status tests and one move, which is

$$15 \\times 6 + 10 = 100$$

cycles, exactly the device period. That is the defining property of polling —
the loop runs at whatever rate the device sets, because it has nothing else to
do. Of those hundred cycles the ones that accomplish anything are the ten of the
move, a useful fraction of

$$10 / 100 = 0.1$$

or ten percent. **Ninety percent of a fully occupied processor is spent
discovering that the device is not ready yet.**

### Worked example 7A — count a 512-byte transfer and check the total

**Given.** Machine M, the loop above, a device period of 100 cycles, and a
transfer of 512 bytes. Predict the total, then account for the difference
against a stepped run that reports 51,218 cycles, 7,683 status tests and 5,120
cycles of byte movement.

**Prediction from the steady state.** At one byte per device period,

$$512 \\times 100 = 51200$$

cycles.

**Check the stepped run against itself first.** The reported tests should
account for all the spin cycles:

$$7683 \\times 6 = 46098$$

and the moves for the rest:

$$512 \\times 10 = 5120$$

Their sum is

$$46098 + 5120 = 51218$$

which is the reported total, so the run is internally consistent. The tests per
byte come to

$$7683 / 512 = 15.006$$

confirming the fifteen-per-byte steady state.

**The difference.** The stepped total exceeds the prediction by

$$51218 - 51200 = 18$$

cycles. The last byte arrives at cycle 51,200 with a status test already part
way through; that test must finish, a fresh test must sample and confirm, and
the move must run. The confirming test and the move are

$$6 + 10 = 16$$

cycles, so the test that was in flight had

$$18 - 16 = 2$$

cycles left to run. **51,200 cycles of steady state plus an 18-cycle tail, for
51,218 — and the prediction is short by exactly the tail.**

## 7.3 Two limits, and they are different questions

Polling has a *speed* limit and an *efficiency* limit, and they behave nothing
alike.

The **speed** limit is set by the shortest path through one iteration, one test
plus one move:

$$6 + 10 = 16$$

cycles. A device that presents bytes faster than that overruns the loop no
matter how the code is arranged. On machine M that is

$$100000000 / 16 = 6250000$$

bytes per second, 6.25 MB/s.

The **efficiency** limit is the useful fraction, ten cycles of work in every
device period $D$:

$$\\eta = 10 / D$$

| Device period $D$ | Byte rate | Useful fraction |
|---|---|---|
| 16 cycles | 6.25 MB/s | $10 / 16 = 0.625$ |
| 100 cycles | 1 MB/s | $10 / 100 = 0.1$ |
| 1000 cycles | 100 kB/s | $10 / 1000 = 0.01$ |

The table reads backwards from intuition, and that is the point. Polling is at
its *most* efficient against a device that is nearly too fast for it, and at its
worst against a slow one. A console port that delivers a character every few
milliseconds is the worst possible case for a polled loop: the processor is
fully occupied and essentially all of it is wasted.

## 7.4 Latency, and what happens if you poll too slowly

Two timings matter besides throughput. The **detection latency** is the gap
between the byte becoming available and the move beginning. The loop samples the
status once at the start of each six-cycle test, so a byte arriving just after a
sample waits nearly a full test period, and the test that finally sees it still
runs to completion before the move starts. The latency therefore lies between

$$6 \\times 10 = 60$$

and

$$12 \\times 10 = 120$$

nanoseconds. That tight bound is polling's one genuine advantage: it is the
lowest-latency method available, because there is no entry sequence to run.

The second timing is what happens when other work is interleaved between polls.

### Worked example 7B — polling too slowly loses data in proportion

**Given.** The same device, one byte every 100 cycles, but the loop now shares
the processor and manages a status test only every 120 cycles. The device
overwrites its data register when a new byte arrives. Find the fraction of bytes
lost.

**Reasoning.** Each test captures at most one byte, so bytes are captured at one
per 120 cycles while they are produced at one per 100. The captured fraction is
the ratio of the production period to the test period, and the lost fraction is
what remains:

$$1 - 100 / 120 = 0.16667$$

**16.7 percent of the bytes are lost.** Note what the answer does *not* depend
on: the size of the transfer, the speed of the move, or the processor clock.
A polled interface that is even slightly too slow does not run slightly late, it
discards data at a steady rate forever, and the rate is fixed by the ratio of
the two periods alone.

**How the exam asks this.** Either for the useful fraction, which is the move
cost over the device period, or for the maximum rate, which is the clock over
the sum of one test and one move. Read the question for which of the two it
wants; they differ by more than an order of magnitude on the same hardware.`,
      examTip: 'Separate the two polling limits. Maximum rate is the clock divided by (one test plus one move). Useful fraction is the move cost divided by the device period. A slow device makes polling less efficient, not more, because the spin grows while the useful work stays the same.',
      importantNote: 'A polled loop that cannot test often enough does not fall behind gracefully. It loses bytes at a fixed fraction set by the ratio of the device period to the test period, and it loses them silently unless the device reports overrun.',
    },
    { id: 'io-interrupts', title: '8. Interrupts: the Service Budget, Nesting and Priority',
      content: `## 8.1 The path an interrupt takes, phase by phase

Section 1 named interrupt latency without measuring it. On machine M the path
from the device asserting its request to the handler returning is six phases,
and only one of them is the handler:

| Phase | What happens | Cycles |
|---|---|---|
| recognition | the instruction in flight is finished | 8 |
| vectoring | the pipeline is flushed, the vector fetched | 6 |
| context save | twelve registers pushed, two cycles each | 24 |
| handler body | the fixed part of the service routine | 18 |
| context restore | twelve registers popped | 24 |
| return | the interrupted state resumed | 4 |

Two different totals come out of this table, and confusing them is the standard
error. The **latency** — the delay before the handler's first useful
instruction — is only the first three phases:

$$8 + 6 + 24 = 38$$

cycles, which on machine M is

$$38 \\times 10 = 380$$

nanoseconds. The **service cost** — what the transfer charges the processor —
is all six:

$$8 + 6 + 24 + 18 + 24 + 4 = 84$$

cycles, plus whatever the handler does with the data. A question asking how
quickly the machine can *respond* wants 38; a question asking what the interface
*costs* wants 84 and more.

## 8.2 Why the buffer depth decides everything

If the device interrupts for every byte, the handler moves one byte at the ten
cycles established in Section 7, and the whole 84-cycle path is charged against
it. Give the device a FIFO of depth $F$ and it interrupts once per full buffer,
so the fixed cost is shared:

$$C = 84 + 10F$$

cycles per interrupt, and per byte

$$c = 84 / F + 10$$

| FIFO depth $F$ | Cycles per interrupt | Cycles per byte | Maximum byte rate |
|---|---|---|---|
| 1 | $84 + 10 = 94$ | 94 | 1.06 MB/s |
| 4 | $84 + 40 = 124$ | 31 | 3.23 MB/s |
| 16 | $84 + 160 = 244$ | 15.25 | 6.56 MB/s |
| 64 | $84 + 640 = 724$ | 11.3125 | 8.84 MB/s |
| infinite | — | 10 | 10 MB/s |

The amortised fixed cost at a depth of sixteen is

$$84 / 16 = 5.25$$

cycles per byte, so the total is

$$5.25 + 10 = 15.25$$

and the maximum rate the path can sustain is

$$100000000 / 15.25 = 6557377$$

bytes per second. Compare that with polling's 6.25 MB/s from Section 7 and the
first surprise of this chapter appears: **interrupts and polling have almost the
same peak rate.** Interrupts do not make the interface faster. What they change
is the cost at rates *below* the peak, because between requests the processor is
free, and that is a different quantity entirely.

### Worked example 8A — the service budget at one megabyte per second

**Given.** Machine M, the device of Section 7 at one byte per 100 cycles, and a
16-deep FIFO. Find the processor time the interface consumes, the number of
interrupts per second, and what a one-byte FIFO would cost instead.

**Cost per byte.** From the table, 15.25 cycles. Against a device period of 100
cycles the processor fraction is

$$15.25 / 100 = 0.1525$$

**15.25 percent.**

**Interrupt rate.** One request per sixteen bytes at one byte per microsecond is

$$1000000 / 16 = 62500$$

requests per second, each costing 2,440 nanoseconds, which is

$$62500 \\times 0.00000244 = 0.1525$$

of a second per second — the same 15.25 percent by a second route.

**With a one-byte FIFO.** The cost per byte becomes 94 cycles, so

$$94 / 100 = 0.94$$

**94 percent of the processor**, against polling's 100 percent. A shallow FIFO
turns interrupt-driven I/O into polling with extra steps. **15.25 percent at
depth sixteen, 94 percent at depth one; the buffer, not the mechanism, is what
buys the processor its time back.**

## 8.3 Masking, priority and the two triggering styles

An interrupt is **maskable** if software can defer it and **non-maskable** if it
cannot — a power-fail warning must not be deferrable, because the deferral would
outlive the supply. **Vectored** interrupts have the device supply the handler
address, so dispatch is one indirect jump; the alternative is a polled dispatch
in software, which reintroduces the cost the interrupt was meant to avoid.

Priority is resolved either by a **daisy chain**, where the acknowledge signal
passes down a physical line and the first device holding a request captures it,
or by a **priority encoder**, which resolves in parallel. The chain needs no
per-device wires but its resolution time grows with the number of devices; the
encoder resolves in constant time but needs a request line each.

The triggering style is examinable and easy to get backwards:

| Style | Request asserted | Missed if | Shared line |
|---|---|---|---|
| **Edge-triggered** | for one transition | two devices assert together | poorly |
| **Level-triggered** | until the handler clears it | never, while it is held | well |

Edge triggering loses a second request that arrives while the first edge is
still being processed, because there is no state left asserted to notice. Level
triggering cannot lose one, which is why shared lines are level-triggered — but
it will re-enter the handler forever if the handler returns without clearing the
device's flag.

## 8.4 Nesting: who waits, and for how long

Allowing a high-priority request to preempt a running handler is **nesting**.
Its effect is not that latency improves; it is that latency is *redistributed*,
and the redistribution can be computed.

Take three sources on machine M, with periods $T$ and handler costs $C$ in
microseconds, and a 15-microsecond region in which interrupts are disabled
altogether:

| Source | Period $T$ | Cost $C$ | Priority |
|---|---|---|---|
| A | 200 | 20 | highest |
| B | 500 | 60 | middle |
| C | 2000 | 200 | lowest |

The processor time these consume is

$$20 / 200 + 60 / 500 + 200 / 2000 = 0.32$$

so 32 percent, leaving plenty of headroom — and headroom says nothing about
whether the deadlines are met.

### Worked example 8B — worst-case response with nesting and without

**Given.** The three sources above and a 15-microsecond non-preemptable region.
Find the worst-case response of each source when handlers may nest, and when
they may not.

**With nesting.** A source waits for the blocking region and for every
higher-priority handler that can run while it is waiting. For A, nothing outranks
it, so

$$15 + 20 = 35$$

microseconds. For B, one release of A can intervene:

$$60 + 15 + 20 = 95$$

microseconds, and since 95 is under A's 200-microsecond period no second release
of A can fit, so the value is stable. For C, releases of both A and B intervene;
starting from

$$200 + 15 = 215$$

microseconds, two releases of A and one of B fit inside that window, giving

$$200 + 15 + 40 + 60 = 315$$

microseconds — and 315 still admits exactly two releases of A and one of B, so
it is the answer.

**Without nesting.** Once a handler starts it runs to completion, so the only
thing a source waits for is the longest handler that can already be running,
plus any handler that starts ahead of it. For A that is C:

$$200 + 20 = 220$$

microseconds. For B it is C plus one A:

$$200 + 20 + 60 = 280$$

microseconds. For C, everything runs first but nothing preempts it afterwards:

$$15 + 20 + 60 + 200 = 295$$

microseconds.

![Worst-case response time for three interrupt sources, drawn as pairs of bars. With nesting allowed the responses are thirty-five, ninety-five and three hundred and fifteen microseconds; with handlers non-preemptable they are two hundred and nineteen, two hundred and seventy-nine and two hundred and ninety-five.](/courses/fe-ee/figures/sys3-io-priority.svg)

**The trade.** Nesting improves the urgent source by

$$219 / 35 = 6.257$$

and costs the patient one

$$315 / 295 = 1.0678$$

**a factor of 6.26 gained at the top, 6.8 percent lost at the bottom.** That is
the whole argument for nesting in one pair of numbers: it is nearly free for the
source that can afford to wait and transformative for the one that cannot.

A note on the two hundred and nineteen. The blocking bound says 220 — the full
200-microsecond handler plus A's own 20 — but a run of the actual schedule never
reaches it, because A must arrive *strictly after* C begins for the full block
to apply. The bound is a supremum the system approaches and does not attain, and
the gap is exactly one unit of release-time resolution. Design to 220; expect to
measure 219.

**How the exam asks this.** For latency, sum only the phases before the handler
body. For cost, sum all of them and add the data movement. For a nested
worst case, add the blocking to the source's own cost and then add every
higher-priority handler that fits in the window, iterating until the window
stops growing.`,
      examTip: 'Interrupt latency and interrupt cost are different sums over the same table. Latency stops at the first instruction of the handler; cost includes the body, the restore and the return. A question about real-time response wants the first, a question about processor utilisation wants the second.',
      importantNote: 'Interrupts do not raise the peak transfer rate much above polling on the same machine — 6.56 against 6.25 MB/s here. What they buy is the processor time between requests, and how much they buy is set almost entirely by the depth of the device FIFO.',
    },
    { id: 'io-dma', title: '9. DMA: Burst, Cycle Steal, Transparent, and the Bus Arithmetic',
      content: `## 9.1 What the processor still pays for

A DMA controller moves the bytes, so the processor's charged work is only the
setup and the completion. On machine M the driver writes five controller
registers and does its bookkeeping in 220 cycles, and the completion interrupt
costs the 84 cycles of Section 8 with no data movement in the body:

$$220 + 84 = 304$$

cycles, or

$$304 \\times 10 = 3040$$

nanoseconds, **regardless of how many bytes the transfer moves.** That constant
is the entire reason DMA exists, and Section 10 turns it into a crossover.

But 304 is not the whole bill. The controller and the processor share one bus,
and every byte the controller moves is a cycle the processor cannot use for its
own references. How much that costs depends on the arbitration policy, and the
three policies are genuinely different.

## 9.2 Three policies, one bus, the same 4096 bytes

Machine M's processor needs the bus on one of every three cycles it executes —
roughly 1.35 memory references per instruction over about four cycles per
instruction. Its cycles that do not touch the bus proceed happily while the
controller owns it; only a reference collides.

The three policies were run cycle by cycle against that processor, moving the
same 4096 bytes each time.

| Policy | The controller… | Elapsed cycles | Processor cycles lost |
|---|---|---|---|
| **Burst** | holds the bus until the block is done | 4,096 | 4,096 |
| **Cycle steal** | takes one cycle, releases, re-arbitrates | 8,191 | 2,048 |
| **Transparent** | takes only cycles the processor did not want | 6,144 | 0 |

![Burst, cycle-steal and transparent DMA compared for the same four-thousand-and-ninety-six-byte block, as two stacked panels sharing an x-axis. The upper panel gives elapsed cycles, the lower gives processor cycles lost, and the two orderings are opposite.](/courses/fe-ee/figures/sys3-io-dma-modes.svg)

**Burst** is fastest and brutal. The bus is held for 4,096 consecutive cycles, so
the processor gets through whatever non-reference cycles it has queued and then
stalls until the burst ends. In the run above it made no progress at all,
because its first cycle wanted the bus.

**Cycle steal** takes one cycle in two, so the transfer stretches to

$$8191 / 4096 = 2.0$$

times the burst duration, but the processor keeps running between steals. It
lost 2,048 cycles, which is

$$2048 / 4096 = 0.5$$

of a cycle per byte moved — a quarter of the elapsed time rather than all of it.

**Transparent** never wins an arbitration. With the processor asking for the bus
one cycle in three, two cycles in three are free, so the controller needs

$$4096 / 0.66667 = 6144$$

cycles to find 4,096 of them, and it stalls the processor exactly zero times.

## 9.3 The bus is conserved, and that is the arithmetic

The three policies move identical numbers of bytes over identical numbers of bus
cycles. What differs is how those cycles are distributed, and the cleanest way to
see it is to add up who used the bus during the transfer.

| Policy | Controller's share | Processor's share | Bus idle |
|---|---|---|---|
| Burst | $4096 / 4096 = 1$ | 0 | 0 |
| Cycle steal | $4096 / 8191 = 0.50006$ | $2048 / 8191 = 0.25003$ | 0.24991 |
| Transparent | $4096 / 6144 = 0.66667$ | $2048 / 6144 = 0.33333$ | 0 |

For cycle steal the two shares come to

$$0.50006 + 0.25003 = 0.75009$$

leaving

$$1 - 0.75009 = 0.24991$$

of the bus doing nothing — a quarter of the bus wasted, because the policy
releases cycles on a fixed rhythm rather than on demand. Transparent mode's
shares come to exactly one: **it is the only one of the three that wastes no bus
cycle at all**, which is why it finishes sooner than cycle stealing here despite
never winning an arbitration.

That last sentence contradicts the usual ordering, and the contradiction is
instructive rather than a mistake. Transparent mode's duration depends entirely
on how bus-hungry the processor is. Run the same block against a processor that
wants the bus on seven cycles in ten and the free fraction drops to 0.3, so the
controller needs

$$4096 / 0.3 = 13653$$

cycles — the stepped run gives 13,658 once the pattern's alignment is counted,
which is

$$13658 / 4096 = 3.334$$

times the burst duration. **Transparent DMA has no bounded transfer time.** It is
the right choice when the deadline is loose and the processor's work is not, and
the wrong choice for anything with a completion deadline.

### Worked example 9A — pick a policy against a deadline

**Given.** Machine M must move a 4,096-byte block and cannot lose more than
2,500 processor cycles to it, while the block must complete within 7,000 cycles.
Which policies qualify?

**Burst.** Elapsed 4,096 — inside the deadline. Lost 4,096 cycles, which exceeds
the budget by

$$4096 - 2500 = 1596$$

cycles. **Fails the processor budget.**

**Cycle steal.** Elapsed 8,191, which exceeds the deadline by

$$8191 - 7000 = 1191$$

cycles. **Fails the completion deadline**, though its 2,048 lost cycles are
comfortably inside the budget.

**Transparent.** Elapsed 6,144, inside 7,000; lost 0, inside 2,500. **Transparent
is the only policy that meets both** — but only because this processor leaves two
cycles in three free. The margin on the deadline is

$$7000 - 6144 = 856$$

cycles, and a processor even slightly hungrier for the bus consumes it.

## 9.4 What stepping the arbiter revealed about the stolen cycle

There is a tempting shortcut for the cost of a paced transfer: the controller
steals one bus cycle per byte, the processor wants the bus a fraction $m$ of the
time, so it loses $m$ cycles per byte. On machine M that would be a third of a
cycle per byte.

Running the arbiter one clock at a time says otherwise, and the reason is worth
the space.

### Worked example 9B — why a periodic processor loses every stolen cycle

**Given.** Machine M, a device paced at one byte every 100 cycles, DMA in
cycle-steal mode, and a processor whose bus references fall on a strictly
periodic one-in-three pattern. Predict the stall count for 4,096 bytes from the
density argument, then compare it against the stepped run.

**The density prediction.** One stolen cycle per byte, collision probability
one-third:

$$4096 / 3 = 1365.3$$

cycles.

**The stepped run.** 4,096 stalls — one for every byte, three times the
prediction.

**Why.** When a reference collides, the processor loses exactly one cycle and
its whole reference schedule shifts by one. The device period is 100 cycles and
the processor advanced 99 of them, so its phase relative to the next stolen
cycle is

$$99 - 33 \\times 3 = 0$$

unchanged. The stall re-synchronises the processor onto the stolen cycle, and
once locked it never escapes. **A strictly periodic reference pattern converges
on the worst case: every stolen cycle costs a stall.**

Break the periodicity — keep the density at exactly one in three but arrange the
references irregularly, as real instruction mixes do — and the same stepped run
gives 1,393 stalls, which is

$$1393 / 4096 = 0.3401$$

per byte, within four percent of the density argument. **The truth is bracketed:
between 0.34 and 1.0 stall cycles per byte depending on a phase relationship
nobody controls.** Design to one cycle per byte; a formula that assumes the
average is quoting the best case as though it were the answer.

**How the exam asks this.** Usually for the processor's share of the bus, or for
the transfer duration given a policy. Bus cycles moved divided by elapsed cycles
is the controller's share; one minus the total share is idle bus. For transparent
mode, elapsed is the block size divided by the free-cycle fraction.`,
      examTip: 'All three DMA policies occupy the same number of bus cycles, so they never differ in bus bandwidth consumed. They differ in duration and in processor cycles lost, and the two orderings are opposite: burst is quickest and costliest, transparent is free to the processor and unbounded in time.',
      importantNote: 'Do not price a stolen bus cycle at the processor bus density. A periodic reference pattern re-synchronises onto the stolen cycle after the first collision and then pays for every one, so the true cost lies between the density and one full cycle per byte. Budget the upper end.',
    },
    { id: 'io-crossover', title: '10. One Transfer, Three Methods: Where the Crossover Is',
      content: `## 10.1 Three cost functions on one machine

Sections 7, 8 and 9 each priced one method on machine M against the same device.
Put them side by side as functions of the transfer size $N$ in bytes and the
comparison stops being a matter of opinion.

**Polling** holds the processor for the whole transfer, so it costs the device
period per byte:

$$P(N) = 100N$$

**Interrupt-driven** service costs the 84-cycle path once per full FIFO and ten
cycles per byte:

$$I(N) = 84 \\lceil N / 16 \\rceil + 10N$$

**DMA** costs the 304-cycle setup and completion once, plus the worst-case one
stall cycle per byte established in Section 9:

$$D(N) = 304 + N$$

The shapes are what matter. Polling is steeply linear with no fixed cost.
Interrupt service is gently linear with a small staircase. DMA is nearly flat
with a large fixed cost. Two lines that differ in both slope and intercept cross
exactly once, so there are two crossovers to find.

![Processor cycles consumed against transfer size on logarithmic axes for polling, interrupt-driven service and DMA, with dashed lines marking the crossovers at four bytes and seventeen bytes.](/courses/fe-ee/figures/sys3-io-crossover.svg)

## 10.2 The first crossover: DMA against polling

Setting $P(N) = D(N)$ gives

$$304 / 99 = 3.0707$$

so DMA is cheaper from four bytes upward. Checking the two integers either side
confirms it: at three bytes polling costs 300 and DMA costs 307; at four bytes
polling costs 400 and DMA costs 308. **Four bytes.** A DMA channel repays its
entire setup on a transfer smaller than one machine word on a 64-bit system,
which is another way of saying that polling a millisecond-scale device is almost
never defensible on a machine that has a controller available.

## 10.3 The second crossover, and why the smooth answer is wrong

Setting $I(N) = D(N)$ and ignoring the ceiling gives a per-byte interrupt cost
of

$$84 / 16 + 10 - 1 = 14.25$$

against DMA's fixed 304, so

$$304 / 14.25 = 21.333$$

and the smooth answer is twenty-two bytes. **That answer is wrong**, and the
reason is the ceiling it discarded.

### Worked example 10A — evaluate both functions instead of solving them

**Given.** $I(N)$ and $D(N)$ above. Find the smallest $N$ at which DMA is
cheaper, by evaluating rather than by solving.

**At sixteen bytes.** One interrupt serves the whole transfer:

$$84 + 160 = 244$$

cycles, against DMA's

$$304 + 16 = 320$$

Interrupts win, by 76 cycles.

**At seventeen bytes.** The seventeenth byte does not fit the FIFO, so a second
interrupt is taken for it and the full 84-cycle path is charged for one byte:

$$168 + 170 = 338$$

cycles, against DMA's

$$304 + 17 = 321$$

DMA wins, by 17 cycles.

**The crossover is seventeen bytes, not twenty-two.** The smooth model
overshoots by

$$22 - 17 = 5$$

bytes because it spreads the 84-cycle entry evenly over sixteen bytes when in
fact it arrives all at once at every multiple of the depth. **Whenever a cost
function contains a ceiling, evaluate it at integers; solving the smoothed
version answers a question about a machine that does not exist.**

## 10.4 What the gap looks like at a realistic size

Crossovers at four and seventeen bytes sound like a technicality until the
functions are read at a size anybody actually transfers. For a 4 KiB block:

| Method | Cycles | Time at 100 MHz | Relative to DMA |
|---|---|---|---|
| Polling | 409,600 | 4.096 ms | $409600 / 4400 = 93.09$ |
| Interrupt, 16-deep FIFO | 62,464 | 624.6 us | $62464 / 4400 = 14.196$ |
| **DMA** | **4,400** | **44.0 us** | 1 |

The interrupt figure decomposes as

$$256 \\times 84 = 21504$$

cycles of entry and exit plus

$$4096 \\times 10 = 40960$$

cycles of data movement, for

$$21504 + 40960 = 62464$$

and the DMA figure is the fixed 304 plus one stall per byte:

$$304 + 4096 = 4400$$

**Ninety-three times cheaper than polling, fourteen times cheaper than
interrupts**, and the ratio keeps growing with the block because DMA's cost is
almost all fixed.

## 10.5 The summary the exam wants

| Question | Polling | Interrupt | DMA |
|---|---|---|---|
| Peak byte rate on M | 6.25 MB/s | 6.56 MB/s | 100 MB/s |
| Processor cost per byte | 100 cycles | 15.25 cycles | 1 cycle |
| Fixed cost per transfer | 0 | 0 | 304 cycles |
| Response latency | 60 to 120 ns | 380 ns | setup, then none |
| Best when | latency dominates, transfer is tiny | moderate rate, processor has other work | anything above seventeen bytes |

Read the peak-rate row and the cost row together. Polling and interrupts differ
by five percent in peak rate and by a factor of

$$100 / 15.25 = 6.557$$

in cost per byte. That asymmetry is the single most useful fact in this chapter:
**changing from polling to interrupts does not make the interface faster, it
makes it cheaper**, and only DMA changes what the interface can do.

**How the exam asks this.** Give each method a cost per byte and a cost per
transfer, then compare totals at the stated size. If a FIFO depth is quoted,
divide the interrupt entry cost by it before adding the per-byte cost — and take
the ceiling if the size is not a multiple of the depth.`,
      examTip: 'Write each method as a fixed cost plus a per-byte cost before touching the numbers. Polling has no fixed cost and a huge slope, DMA has a large fixed cost and almost no slope, and the crossover is the fixed-cost difference divided by the slope difference. Then check the integers either side, because a FIFO ceiling moves the answer.',
      importantNote: 'Polling and interrupt-driven I/O reach nearly the same maximum rate on the same machine. The difference between them is cost per byte, not speed. Only DMA raises the ceiling, because only DMA takes the processor out of the data path.',
    },
    { id: 'io-bus', title: '11. Bus Protocols and the Timing Budget',
      content: `## 11.1 The same five delays, counted twice

Every read on any bus spends time in the same five places, and the protocol only
decides how they are assembled.

| Symbol | Delay | Value on machine M |
|---|---|---|
| $t_{a}$ | address driven and valid | 4 ns |
| $t_{d}$ | decode, chip select asserted | 6 ns |
| $t_{acc}$ | the device's own access time | device-dependent |
| $t_{su}$ | data setup at the receiving latch | 2 ns |
| $t_{sk}$ | one-way propagation and skew on the backplane | 4 ns |

A **synchronous** bus samples on a clock edge. Everything must be ready before
the edge, so the requirement is

$$t_{req} = t_{a} + t_{d} + t_{acc} + t_{su} + t_{sk}$$

and the cycle is then rounded *up* to a whole number of clock periods, the extra
periods being **wait states**.

An **asynchronous** bus has no clock. The master drives the address and asserts
a request; the slave responds when it is genuinely ready and asserts an
acknowledge; the master drops the request; the slave drops the acknowledge. That
is the **four-phase** or full handshake, and each of the four transitions has to
propagate across the backplane, so the protocol pays

$$4 \\times 4 = 16$$

nanoseconds of interconnect delay in place of the single $t_{sk}$ the clocked
bus needs.

## 11.2 The budget, for three devices

### Worked example 11A — wait states on a 50 MHz synchronous bus

**Given.** Machine M's numbers above, a 20-nanosecond bus period, and three
memories with access times of 12, 34 and 90 nanoseconds. Find the wait states
and the cycle length for each.

**Fast device.** The requirement is

$$4 + 6 + 12 + 2 + 4 = 28$$

nanoseconds. One period supplies 20, leaving

$$28 - 20 = 8$$

nanoseconds to find, which takes one more whole period. Two periods:

$$2 \\times 20 = 40$$

nanoseconds, **one wait state**.

**Typical device.** The requirement is

$$4 + 6 + 34 + 2 + 4 = 50$$

nanoseconds, so three periods:

$$3 \\times 20 = 60$$

nanoseconds, **two wait states**.

**Slow device.** The requirement is

$$4 + 6 + 90 + 2 + 4 = 106$$

nanoseconds, so six periods:

$$6 \\times 20 = 120$$

nanoseconds, **five wait states**.

**The rounding is the cost.** The fraction of each cycle that exists only because
the clock quantises is

$$1 - 28 / 40 = 0.3$$

for the fast device,

$$1 - 50 / 60 = 0.16667$$

for the typical one and

$$1 - 106 / 120 = 0.11667$$

for the slow one. **The faster the device, the larger the share of its cycle that
is pure rounding** — 30 percent for the fastest of the three. A clocked bus
punishes exactly the devices it should be rewarding.

## 11.3 What the handshake buys and what it costs

The asynchronous cycle for the same three devices is $t_{acc}$ plus the fixed 28
nanoseconds. For the typical device,

$$4 + 6 + 34 + 2 + 16 = 62$$

nanoseconds, and for the slow one

$$4 + 6 + 90 + 2 + 16 = 118$$

nanoseconds.

![Bus cycle length for three device speeds under a twenty-nanosecond synchronous clock and under a four-phase asynchronous handshake, as paired bars. The clocked bus is quicker for the fast and typical devices and slower for the slow one.](/courses/fe-ee/figures/sys3-io-handshake.svg)

| Device | Synchronous | Asynchronous | Winner |
|---|---|---|---|
| Fast, 12 ns | 40 ns | 40 ns | tie |
| Typical, 34 ns | 60 ns | 62 ns | synchronous |
| Slow, 90 ns | 120 ns | 118 ns | asynchronous |

The handshake loses on the typical device by

$$62 / 60 = 1.0333$$

and wins on the slow one by

$$1 - 118 / 120 = 0.016667$$

Neither margin is dramatic, and that is the honest answer: **on a bus whose
devices are reasonably matched to its clock, the two protocols are within a few
percent of each other.** The real distinction is elsewhere.

| Property | Synchronous | Asynchronous |
|---|---|---|
| Cycle length | quantised to the clock | exactly what the device needs |
| Mixed device speeds | each needs a wait-state count configured | handled automatically |
| A device that never answers | the cycle ends anyway | the bus hangs without a timeout |
| Maximum length | limited by skew against the period | limited by round-trip delay |
| Control logic | simple counter | request and acknowledge state machine |

The third row is the one that bites. An asynchronous master waiting for an
acknowledge that will never arrive waits forever, so every asynchronous bus needs
a **bus timeout** — a watchdog that abandons the cycle and raises an error after
a fixed interval. That error is the mechanism by which a read from an unpopulated
address becomes a fault rather than a hang.

### Worked example 11B — bandwidth, and where the clock ceiling comes from

**Given.** A 32-bit data path, the typical device above, and the two protocols.
Find the sustained bandwidth of each, and the highest clock the synchronous bus
can run given its 4-nanosecond skew and a rule that skew may not exceed a fifth
of the period.

**Bandwidth.** Four bytes per cycle at 60 nanoseconds is

$$4 / 60 = 0.066667$$

bytes per nanosecond, which is 66.67 MB/s. The handshake at 62 nanoseconds gives

$$4 / 62 = 0.064516$$

bytes per nanosecond, 64.52 MB/s, or

$$1 - 64.52 / 66.67 = 0.03225$$

**about 3.2 percent less.**

**Clock ceiling.** The rule requires

$$4 \\times 5 = 20$$

nanoseconds of period at minimum, which is

$$1000 / 20 = 50$$

megahertz. **The bus cannot be clocked above 50 MHz without shortening the
backplane**, and that — not the memory — is what fixes the period at 20
nanoseconds in the first place. This is why fast wide buses became short
point-to-point serial links: skew does not scale, so the only way to keep raising
the rate is to stop sharing the wires.

**How the exam asks this.** Sum the five delays, compare against the period, and
take the ceiling of the shortfall divided by the period to get the wait states.
The total cycle is one period more than the wait-state count. For bandwidth,
divide the bytes per transfer by the cycle time.`,
      examTip: 'Wait states are the ceiling of (required time minus one period) divided by the period, and the cycle is one plus that many periods. Do not forget the setup and skew terms: leaving them out typically removes one wait state and produces an answer that is exactly one period short.',
      importantNote: 'An asynchronous bus with no timeout hangs forever on a device that never acknowledges. The timeout is not an optional refinement; it is what turns a read from an empty address into a reportable fault instead of a dead machine.',
    },
    { id: 'io-buffering', title: '12. Buffering, Framing Overhead, and Errors on the Interface',
      content: `## 12.1 One buffer forces the producer to wait for the consumer

A device fills a buffer; the processor empties it. With a **single** buffer the
two cannot overlap, because the processor is reading the same storage the device
would be writing. The device must therefore stop while the processor works, and
the cycle time is the sum

$$T_{single} = T_{f} + T_{c}$$

of the fill time and the consume time. With **two** buffers the device fills one
while the processor drains the other, and the cycle time is the larger of the
two:

$$T_{double} = \\max(T_{f}, T_{c})$$

That is the whole of double buffering, and the consequence is the
**producer-consumer condition**: the arrangement keeps up if and only if

$$T_{c} \\le T_{f}$$

### Worked example 12A — a 256-byte buffer on a one-megabyte-per-second device

**Given.** Buffers of 256 bytes, a device delivering one megabyte per second so
each buffer fills in 256 microseconds, and a processing routine that takes 180
microseconds per buffer. Find the delivered rate with one buffer and with two,
and the processor slack in each case. Then repeat with a routine that takes 300
microseconds.

**One buffer.** The cycle is

$$256 + 180 = 436$$

microseconds per 256 bytes, so the delivered rate is

$$256 / 436 = 0.58716$$

bytes per microseconds — **587 kB/s, or 58.7 percent of what the device offers.**
The missing 41.3 percent is not delayed, it is destroyed: the device has nowhere
to put the bytes it produces during those 180 microseconds.

**Two buffers.** The condition holds, since 180 is under 256, so the cycle is 256
microseconds and the delivered rate is the full **1 MB/s**. The processor is idle
for

$$256 - 180 = 76$$

microseconds of every cycle, a slack of

$$76 / 256 = 0.29688$$

**29.7 percent.** The improvement over single buffering is

$$436 / 256 = 1.7031$$

**times.**

**A slower routine.** At 300 microseconds the condition fails, and now the second
buffer cannot save it. The cycle becomes 300 microseconds and the delivered rate
falls to

$$256 / 300 = 0.85333$$

bytes per microsecond, losing

$$1 - 256 / 300 = 0.14667$$

**14.7 percent of the data.**

![Buffer occupancy against time for a single buffer with a fast consumer, two buffers with the same consumer, and two buffers with a consumer that is too slow. Only the middle case keeps the device running without pause.](/courses/fe-ee/figures/sys3-io-buffering.svg)

The stepped run behind that figure counts delivered and lost bytes rather than
applying either formula, and it lands on 0.5884, 0.9998 and 0.8531 bytes per
microsecond against the predicted 0.5872, 1.0000 and 0.8533 — agreement to
within a fifth of a percent, the residue being the partial buffer in flight when
the run ends.

**The lesson is the third case.** Buffering converts a *rate* mismatch into a
*loss* and a *jitter* problem into nothing at all. Adding buffers absorbs bursts;
it never adds throughput. If the consumer is slower than the producer on average,
no number of buffers is enough, because the queue grows without bound and
something must eventually be discarded.

## 12.2 Framing: what a bit rate is not

Section 4 counted the start and stop bits of an asynchronous character. Block
protocols have the same problem in a different shape: every frame carries
addressing, acknowledgement and check bits that are not payload.

### Worked example 12B — the real cost of an I2C write

**Given.** An I2C master writing 16 data bytes to one device at 400 kHz. The
frame is a start condition, an address byte followed by an acknowledge bit, then
each data byte followed by an acknowledge bit, then a stop condition. Take the
start and stop as one bit time each. Find the framing efficiency and the payload
throughput.

**Bit times.** The address costs eight bits plus its acknowledge, so nine. Each
data byte costs the same nine, so

$$16 \\times 9 = 144$$

and the total is

$$1 + 9 + 144 + 1 = 155$$

bit times. The payload is

$$16 \\times 8 = 128$$

bits, so the framing efficiency is

$$128 / 155 = 0.82581$$

**82.6 percent.**

**Throughput.** At 400 kHz a bit time is 2.5 microseconds, so the transfer takes

$$155 / 0.4 = 387.5$$

microseconds, and the payload rate is

$$16 / 387.5 = 0.041290$$

bytes per microsecond, **41.3 kB/s** — not the 50 kB/s that dividing 400 kHz by
eight would suggest. **The acknowledge bit alone costs an eighth of the link.**

## 12.3 Line coding takes its cut before the protocol does

High-speed serial links have a second overhead below the frame: the line code
that keeps the receiver's clock recovered and the line DC-balanced.

| Link | Line code | Payload fraction | Raw rate | Payload rate |
|---|---|---|---|---|
| USB 3.0, PCIe gen 1 and 2 | 8b/10b | $8 / 10 = 0.8$ | 5 Gb/s | 500 MB/s |
| PCIe gen 3 and later | 128b/130b | $128 / 130 = 0.98462$ | 8 GT/s | 984.6 MB/s |

For the 8b/10b link,

$$5 \\times 0.8 = 4$$

gigabits per second of payload, which is

$$4000 / 8 = 500$$

megabytes per second. The later scheme carries

$$8 \\times 0.98462 = 7.877$$

gigabits per second, or

$$7877 / 8 = 984.6$$

megabytes per second. Notice that the raw rate rose by 60 percent from 5 to 8
while the payload rate almost doubled: **changing the line code was worth more
than most of the frequency increase.** Overhead that sits under everything else
is the most valuable kind to remove.

## 12.4 Detecting errors, and what happens after

Parity, from Section 4, detects any odd number of flipped bits and corrects
nothing. A **cyclic redundancy check** appended to a block detects all burst
errors shorter than the check itself and all odd-weight patterns, which is why
block protocols use one. Neither corrects; both trigger a **retransmission**, and
retransmission has a throughput cost of its own.

### Worked example 12C — framing plus retries

**Given.** Frames of 512 payload bytes with an 8-byte header and a 4-byte CRC,
on a link with a bit error rate of one in a million. Errors are independent.
Find the framing efficiency, the frame error probability, and the effective
payload efficiency once retransmissions are counted.

**Framing.** The frame is 524 bytes, so

$$512 / 524 = 0.97710$$

**97.7 percent** before any error.

**Frame error probability.** The frame is

$$524 \\times 8 = 4192$$

bits. A first estimate treats the errors as additive:

$$4192 \\times 0.000001 = 0.004192$$

The exact value is one minus the probability that all 4,192 bits survive, which
is 0.004183 — slightly less, because the additive estimate double-counts frames
carrying two errors. Use 0.004183.

**Retries.** A frame succeeds with probability

$$1 - 0.004183 = 0.995817$$

so the mean number of transmissions per delivered frame is

$$1 / 0.995817 = 1.0042$$

**Effective efficiency.** Multiply the framing efficiency by the success
probability:

$$0.9771 \\times 0.995817 = 0.97301$$

**97.3 percent.** The retransmissions cost only 0.4 percentage points here — but
the cost scales with frame length twice over, because a longer frame is both more
likely to be hit and more expensive to resend. That is the whole design tension
in frame sizing: long frames amortise the header, short frames survive a noisy
line.

Three more mechanisms belong on the interface and are examinable by name.
**Timeouts** bound how long a master waits, converting a hang into a reportable
error. **Sequence numbers** let the receiver discard a duplicate created when an
acknowledgement was lost rather than the data. **Flow control**, whether a
hardware ready line or a software pause character, lets a receiver stop a sender
before its buffer overruns — which is the mechanism that turns the 14.7 percent
data loss of Worked example 12A into a slowdown instead.

**How the exam asks this.** For buffering, compare the fill time and the consume
time: their sum is the single-buffer period, their maximum is the double-buffer
period. For framing, put payload bits over total bits including every
acknowledge, header and check bit; for a coded link, multiply by the code's
payload fraction as well.`,
      examTip: 'Double buffering changes the period from the sum of fill and consume times to the larger of the two, and nothing else. If the consumer is slower than the producer on average, extra buffers only delay the moment data starts being discarded.',
      importantNote: 'Payload throughput is the raw rate multiplied by every overhead fraction in the stack: the line code, then the frame, then the retransmission rate. Divide a signalling rate by eight and you have counted none of them.',
    },
    { id: 'io-problems', title: '13. Practice Problems',
      content: `Machine M throughout: 100 MHz, one bus transaction per clock, a polled loop
costing 6 cycles per status test and 10 cycles per byte moved, an interrupt path
costing 84 cycles plus 10 per byte handled, and a DMA channel costing 220 cycles
of setup, an 84-cycle completion interrupt, and one stall cycle per byte.

## Problem Set D — polled and interrupt-driven transfer

**D1.** The device now presents a byte every 250 cycles. Find the number of
status tests per byte in the steady state, the useful fraction of the processor,
and the maximum byte rate the loop could sustain.

*Answer.* One move accounts for ten of the 250 cycles, leaving

$$250 - 10 = 240$$

cycles of spinning, which at six cycles a test is

$$240 / 6 = 40$$

tests per byte. The useful fraction is

$$10 / 250 = 0.04$$

**40 tests, 4 percent useful.** The maximum rate is unchanged at 6.25 MB/s,
because it depends on the loop, not the device. **The trap is assuming a slower
device makes polling cheaper; it makes it worse**, since the wasted cycles grow
while the useful ones do not.

**D2.** What FIFO depth brings the interrupt path's cost down to 12 cycles per
byte?

*Answer.* The per-byte cost is the fixed 84 divided by the depth plus the ten
cycles of movement, so the amortised part must be two cycles:

$$12 - 10 = 2$$

and therefore

$$84 / 2 = 42$$

**A depth of 42.** The distractor is 84 over 12, which is seven, and forgets that
the ten cycles of data movement can never be amortised away — they are paid per
byte by definition, so no depth reaches a cost below ten.

**D3.** A revised processor pushes twenty registers instead of twelve, at two
cycles each. Find the new interrupt latency and the new per-byte cost at a depth
of sixteen.

*Answer.* The save grows from 24 to 40 cycles, so the latency is

$$8 + 6 + 40 = 54$$

cycles. Both the save and the restore grow by sixteen, so the fixed path becomes

$$84 + 32 = 116$$

cycles. Amortised over sixteen bytes,

$$116 / 16 = 7.25$$

and the total per byte is

$$7.25 + 10 = 17.25$$

cycles, which against the original is

$$17.25 / 15.25 = 1.1311$$

**Latency 540 ns, cost 17.25 cycles per byte, 13.1 percent worse.** Note that
only *one* of the two extra costs appears in the latency, because the restore
happens after the handler has already run.

**D4.** Two interrupt sources: A with a 100-microsecond period and a
10-microsecond handler, B with a 400-microsecond period and a 50-microsecond
handler, plus an 8-microsecond region with interrupts disabled. Nesting is
allowed. Find B's worst-case response and the processor utilisation.

*Answer.* B waits for the blocking region, runs its own handler, and is preempted
by any release of A that fits in the window. Starting from 58 microseconds, one
release of A fits, giving

$$50 + 8 + 10 = 68$$

microseconds; 68 still admits exactly one release of A, so the iteration has
converged. Utilisation is

$$10 / 100 + 50 / 400 = 0.225$$

**68 microseconds and 22.5 percent.** The utilisation figure is deliberately
comfortable: it is included to show that low utilisation is no evidence at all
that a deadline is met.

**D5.** A polled loop manages one status test every 75 cycles against a device
presenting a byte every 60. What fraction of the data is lost?

*Answer.* Captured bytes go as the ratio of the periods, so

$$1 - 60 / 75 = 0.2$$

**20 percent, lost silently and forever.** The size of the transfer does not
enter; a polled interface that is too slow does not finish late, it discards a
fixed share of everything.

## Problem Set E — DMA, buses and crossovers

**E1.** At what transfer size does the DMA channel become cheaper than the polled
loop against the 100-cycle device?

*Answer.* Polling costs 100 cycles a byte with no fixed cost, DMA costs 304 plus
one, so the difference in slope is 99 and

$$304 / 99 = 3.0707$$

**Four bytes.** Checking either side: three bytes costs 300 polled against 307 by
DMA, four bytes costs 400 against 308.

**E2.** A transparent DMA channel moves 8,192 bytes on a machine whose processor
requests the bus on 45 percent of its cycles. Find the elapsed time and the
processor cycles lost.

*Answer.* The free fraction is

$$1 - 0.45 = 0.55$$

and the channel needs 8,192 free cycles, so

$$8192 / 0.55 = 14895$$

cycles elapse and **the processor loses none.** The trap is to divide by 0.45
instead of by the free fraction, which reports 18,204 cycles — a transfer time
that assumes the channel uses the cycles the processor wanted, which is precisely
what transparent mode does not do.

**E3.** A burst channel moves 2,048 bytes at one byte per cycle inside a
one-millisecond window on machine M. Give the channel's share of the bus averaged
over the window and during the burst itself.

*Answer.* A millisecond is 100,000 cycles, so the average share is

$$2048 / 100000 = 0.02048$$

**2.05 percent averaged, 100 percent during the burst.** Both numbers are
correct and they answer different questions: the first says the bus has ample
capacity, the second says any processor reference issued during those 20.5
microseconds waits. **Average bus utilisation never bounds worst-case latency.**

**E4.** A memory with a 55-nanosecond access time sits on a synchronous bus with
25-nanosecond periods and 16 nanoseconds of address, decode, setup and skew
combined. Find the wait states, the cycle length and the rounding waste.

*Answer.* The requirement is

$$55 + 16 = 71$$

nanoseconds. One period supplies 25, leaving

$$71 - 25 = 46$$

nanoseconds, which needs two more whole periods. The cycle is

$$3 \\times 25 = 75$$

nanoseconds with **two wait states**, and the waste is

$$1 - 71 / 75 = 0.053333$$

**5.3 percent.**

**E5.** Repeat the interrupt-against-DMA crossover of Section 10 with a FIFO
depth of eight, and say whether the smoothed answer survives.

*Answer.* The amortised entry is

$$84 / 8 = 10.5$$

cycles, so the slope difference is

$$10.5 + 10 - 1 = 19.5$$

and the smoothed crossover is

$$304 / 19.5 = 15.590$$

suggesting sixteen bytes. Checking the integers: at fifteen bytes the interrupt
path takes two requests,

$$2 \\times 84 = 168$$

plus the movement,

$$168 + 150 = 318$$

cycles, against DMA's

$$304 + 15 = 319$$

so interrupts still win by one cycle; at sixteen bytes interrupts cost 328
against DMA's 320. **Sixteen bytes, and here the smoothed answer does survive.**
Compare Section 10, where a depth of sixteen made the smoothed answer wrong by
five bytes. The rule is that rounding a smoothed crossover is a guess, not a
derivation, and the only way to know is to evaluate both functions at integers.

## Problem Set F — buffering, framing and errors

**F1.** Buffers of 1,024 bytes, a device delivering 2 MB/s, and a routine taking
400 microseconds per buffer. Find the delivered rate with one buffer and with
two, and the processor slack in the double-buffered case.

*Answer.* Each buffer fills in

$$1024 / 2 = 512$$

microseconds. With one buffer the period is

$$512 + 400 = 912$$

microseconds, giving

$$1024 / 912 = 1.1228$$

bytes per microsecond — **1.12 MB/s, 56 percent of the device.** With two, the
condition holds because 400 is under 512, so the full **2 MB/s** is delivered and
the slack is

$$512 - 400 = 112$$

microseconds of every 512, or

$$112 / 512 = 0.21875$$

**21.9 percent.**

**F2.** A UART runs 8E2 — eight data bits, even parity, two stop bits — at 57,600
baud. Find the frame length, the character rate and the payload efficiency.

*Answer.* The frame is

$$1 + 8 + 1 + 2 = 12$$

bits, so the character rate is

$$57600 / 12 = 4800$$

per second and the efficiency is

$$8 / 12 = 0.66667$$

**12 bits, 4,800 characters per second, 66.7 percent.** A third of the line is
framing — the price of needing no shared clock.

**F3.** An I2C master reads four bytes from one device at 100 kHz. Find the
transfer time and the payload rate.

*Answer.* Start, an address byte with its acknowledge, four data bytes each with
an acknowledge, and a stop:

$$1 + 9 + 36 + 1 = 47$$

bit times. At 100 kHz each is 10 microseconds, so

$$47 \\times 10 = 470$$

microseconds, and the payload rate is

$$4 / 470 = 0.0085106$$

bytes per microsecond, **8.51 kB/s.** Against the 12.5 kB/s that dividing the
clock by eight would give, the short transfer has lost nearly a third to framing
— overhead hurts small transfers far more than large ones.

**F4.** Frames carry 128 payload bytes with 12 bytes of header and check, on a
link with a bit error rate of one in one hundred thousand. Find the framing
efficiency, the mean number of transmissions per delivered frame, and the
effective efficiency.

*Answer.* The frame is 140 bytes, so

$$128 / 140 = 0.91429$$

and its length in bits is

$$140 \\times 8 = 1120$$

The probability that every bit survives is 0.988863, so a frame needs on average

$$1 / 0.988863 = 1.0113$$

transmissions, and the effective efficiency is

$$0.91429 \\times 0.988863 = 0.90411$$

**91.4 percent framing, 1.011 transmissions, 90.4 percent effective.** Note that
the additive estimate of the frame error rate, 1,120 times one in a hundred
thousand, gives 0.0112 against the true 0.011137; the additive form always
overstates, because it counts frames with two errors twice.

**F5.** A parity bit protects an eight-bit character. Which numbers of flipped
bits does it detect?

*Answer.* **All odd numbers — one, three, five, seven — and none of the even
ones.** Parity fixes the total count of ones to a chosen parity, so any even
number of flips restores it. It corrects nothing in any case: knowing a character
is wrong does not say which bit is wrong. On a channel whose errors arrive in
bursts, adjacent bits flip together and roughly half of all bursts pass
undetected, which is the argument for a cyclic redundancy check on anything
longer than a character.`,
      examTip: 'Almost every problem in this chapter is one of three shapes: cycles per byte times bytes, a fixed cost plus a per-byte cost compared against another, or a ratio of two periods. Identify which shape before substituting, and write down whether the question wants latency, cost or peak rate — the same table answers all three and gives different numbers.',
      importantNote: 'When a cost function contains a ceiling — a FIFO depth, a wait-state count, a whole number of buffers — solve nothing. Evaluate both sides at the integers near the smoothed root and compare. The smoothed answer was wrong by five bytes at a depth of sixteen and exactly right at a depth of eight, and there is no way to tell which case you are in without checking.',
    },
  ],
  keyTakeaways: [
    'Programmed I/O (busy-wait) < Interrupt < DMA (highest throughput).',
    'Interrupts: maskable vs. NMI. Interrupt latency critical for real-time.',
    'DMA: direct device-to-memory; CPU free during transfer.',
    'I2C: 2 wires, slow. SPI: 4 wires, faster. USB: hot-plug. PCIe: fastest.',
    'Speed hierarchy: I2C < SPI < USB < PCIe.',
  ],
},

fee_performance: { topicId: 'fee_performance', title: 'Performance Metrics: CPI, MIPS, Amdahl\'s Law', domainWeight: 'Computer Systems · 3–5%',
  overview: 'CPU performance is quantified by execution time, CPI, and MIPS. Amdahl\'s Law governs speedup limits when improving part of a system. These are among the most frequently tested computer systems formulas on the FE exam.',
  sections: [
    { id: 'perf-cpi', title: '1. Execution Time, CPI, MIPS',
      content: `## 1.1 CPU Execution Time

**Execution time = IC * CPI / f**

| Term | Definition |
|---|---|
| IC | Instruction count |
| CPI | Cycles per instruction |
| f | Clock frequency (Hz) |

## 1.2 Weighted CPI

**CPI_avg = SUM(CPI_i * fraction_i)**

Example: ALU (CPI=1, 40%), Load (CPI=3, 30%), Branch (CPI=2, 30%):
$$CPI = 0.4 + 0.9 + 0.6 = 1.9$$

## 1.3 MIPS

**$MIPS = f(MHz) / CPI$**

Execution time is the ONLY reliable metric. MIPS can be misleading (ignores instruction complexity).`,
      examTip: 'Time = IC*CPI/f. CPI is often weighted. MIPS = f(MHz)/CPI. Lower execution time = better. When comparing CPUs, use execution time on the SAME program.',
      importantNote: 'Clock speed alone does NOT determine performance. 2 GHz with CPI=2 equals 4 GHz with CPI=4 (same instruction count).',
    },
    { id: 'perf-amdahl', title: '2. Amdahl\'s Law and Power',
      content: `## 2.1 Amdahl's Law

**Speedup = 1 / [(1-f) + f/S]**

f = fraction improved, S = improvement factor.

**Max speedup = 1/(1-f)** (when S -> infinity)

| f | Max Speedup |
|---|---|
| 50% | 2x |
| 90% | 10x |
| 95% | 20x |
| 99% | 100x |

Example: 50% parallelizable, S=10: speedup = 1/(0.5+0.05) = **1.82x** (not 5x!)

## 2.2 Power

**Dynamic power: P = C * V^2 * f**

- Power linear with frequency
- Power quadratic with voltage
- Reducing voltage most effective

**Energy per op: E = C * V^2** (independent of frequency)`,
      examTip: 'Amdahl: speedup = 1/[(1-f)+f/S]. Max = 1/(1-f). If 90% parallelizable, max speedup = 10x regardless of processor count. The sequential fraction dominates.',
    },
    { id: 'perf-exam', title: '3. Performance Analysis Walkthrough',
      content: `## 3.1 Amdahl's Law: 40% Parallelizable, 8 Cores

**Given**: f = 0.40 (parallelizable fraction), S = 8 (8 cores for parallel portion).

**Speedup** = 1 / [(1-f) + f/S] = 1 / [0.60 + 0.40/8] = 1 / [0.60 + 0.05] = 1 / 0.65 = **1.538x**

**Max speedup** (infinite cores): 1 / (1-f) = 1 / 0.60 = **1.667x**

| Cores | f/S | Speedup | % of Max |
|---|---|---|---|
| 2 | 0.200 | 1.25x | 75% |
| 4 | 0.100 | 1.43x | 86% |
| **8** | **0.050** | **1.54x** | **92%** |
| 16 | 0.025 | 1.60x | 96% |
| infinity | 0 | 1.67x | 100% |

Going from 8 to 16 cores gains only 0.06x — diminishing returns. The 60% sequential portion fundamentally limits speedup.

## 3.2 CPI for Instruction Mix

**Given**: ALU (40%, CPI=1), Load (30%, CPI=3), Store (20%, CPI=2), Branch (10%, CPI=4).

**CPI_avg = SUM(fraction_i * CPI_i)**

$$CPI = 0.40*1 + 0.30*3 + 0.20*2 + 0.10*4$$
$$CPI = 0.40 + 0.90 + 0.40 + 0.40 = 2.10$$

| Instruction | Fraction | CPI | Contribution |
|---|---|---|---|
| ALU | 40% | 1 | 0.40 |
| Load | 30% | 3 | 0.90 |
| Store | 20% | 2 | 0.40 |
| Branch | 10% | 4 | 0.40 |
| **Weighted CPI** | | | **2.10** |

**Load instructions dominate** (0.90 of 2.10 = 43%) despite being only 30% of instructions. Optimizing load latency (cache) has the biggest impact.

## 3.3 MIPS Calculation

**Given**: Clock frequency = 2 GHz, CPI = 2.10.

**$MIPS = f(MHz) / CPI = 2000 / 2.10 = 952.4 MIPS$**

**Execution time for 10^6 instructions**:
$$T = IC * CPI / f = 10^6 * 2.10 / (2 * 10^9) = 1.05\\ \\mathrm{ms}$$

**Caution**: MIPS is misleading for cross-architecture comparison. A CISC processor might accomplish in 1 instruction what RISC needs 3 for. Always compare **execution time for the same task**.

| Metric | Value | Reliable? |
|---|---|---|
| Clock speed | 2 GHz | No (ignores CPI) |
| MIPS | 952 | No (ignores instruction complexity) |
| **Execution time** | **1.05 ms** | **Yes (only reliable metric)** |

**Exam strategy**: Amdahl's law: identify f (parallelizable fraction) and S (speedup factor). For CPI, multiply each type's fraction by its CPI and sum. MIPS = f(MHz)/CPI. Always prefer execution time for comparison.`,
      examTip: 'Amdahl\'s law trap: 40% parallelizable does NOT mean 8 cores give 40% improvement. The sequential 60% limits speedup to 1.67x maximum. Always compute the denominator carefully.',
      importantNote: 'CPI contributions reveal optimization priorities. If loads contribute 43% of CPI, improving cache hit rate has more impact than reducing branch mispredictions (19% contribution).',
    },
    { id: 'perf-scaling', title: '4. Amdahl in Practice: Scaling, Multiple Enhancements, and Where to Spend',
      content: `## 4.1 The law is a statement about what you did not improve

Written once more, with f the fraction of the original runtime that the
enhancement touches and S the factor by which it speeds that fraction:

**speedup = 1 / [(1 - f) + f/S]**

The term that survives as S grows without bound is (1 - f), and it alone fixes
the ceiling:

**maximum speedup = 1 / (1 - f)**

Every practical consequence of the law is a restatement of that observation.
The enhancement is not what limits you; the part you left alone is.

| Fraction improved f | Ceiling | Half the ceiling reached at |
|---|---|---|
| 50% | 2x | S = 2 |
| 90% | 10x | S = 2 |
| 95% | 20x | S = 2 |
| 99% | 100x | S = 2 |

The right-hand column is not a misprint. Whatever f is, doubling the speed of
the improved part gets you to half the ceiling; the entire remaining half of
the theoretical benefit costs an infinite amount of further improvement.

## 4.2 Scaling with processor count

Substituting S = N, the number of processors, turns the law into a scaling
curve.

![Speedup against processor count on logarithmic axes for parallel fractions of 0.5, 0.9 and 0.99, with each curve's ceiling drawn as a dashed line at 2, 10 and 100. The marked point is a parallel fraction of 0.9 on eight processors, which reaches 4.71 times.](/courses/fe-ee/figures/csys-amdahl.svg)

Read three specific numbers off the middle curve:

| Processors N | Speedup at f = 0.9 | Efficiency, speedup / N |
|---|---|---|
| 4 | 3.08x | 77% |
| **8** | **4.71x** | **59%** |
| 32 | 7.80x | 24% |
| 1024 | 9.91x | 1% |

The efficiency column is the one that decides purchasing. At eight processors
the machine converts 59 percent of the hardware into useful speed; at
thirty-two it converts 24 percent, and the last twenty-four processors have
bought 3.1 times of speedup between them where the first eight bought 4.7. Push
to a thousand and the hardware is 99 percent idle in the useful sense.

Comparing curves is just as instructive. At N = 32 a program that is 50 percent
parallel reaches **1.94x** while one that is 99 percent parallel reaches
**24.43x** — a factor of twelve between them on identical hardware. Buying
processors is not a strategy; changing f is.

## 4.3 Two enhancements at once

Amdahl generalises to any number of disjoint fractions. Suppose profiling shows
that 30 percent of the runtime is in a routine you can accelerate fourfold and
50 percent is in another you can accelerate by half again, leaving 20 percent
untouched:

**speedup = 1 / [0.20 + 0.30/4 + 0.50/1.5] = 1 / [0.20 + 0.075 + 0.3333] =
1 / 0.6083 = 1.64x**

Both enhancements together return less than 1.7 times, and the reason is
visible in the denominator: the untouched 20 percent contributes 0.20 all by
itself, so this machine cannot exceed **5x** no matter what happens to the other
80 percent. The exam-relevant reading is that the fraction you leave alone
should always be computed first, because it bounds the answer before any
enhancement is considered.

## 4.4 The honest counterpoint

Amdahl assumes the problem size is fixed. In practice people who buy a hundred
processors usually run a bigger problem on them, and the serial fraction of a
larger problem is often a smaller share of the total work — setup and I/O grow
more slowly than the computation does. The **scaled-speedup** view, associated
with Gustafson, takes the parallel work as growing with N and predicts speedup
that rises almost linearly.

Both are correct about different questions. Ask "how much faster will this
exact job finish?" and Amdahl answers. Ask "how much more work can I get done
in the same wall-clock time?" and the scaled view answers. FE questions
overwhelmingly ask the first, so use Amdahl unless the problem explicitly says
the workload grows.

**How the exam asks this.** Identify f and S, substitute, and be careful that f
is a fraction of *time*, not of code. A routine that is 5 percent of the source
lines and 90 percent of the runtime has f = 0.9. If the question asks for the
maximum possible benefit, it wants 1/(1 - f) and no other arithmetic.`,
      examTip: 'Compute the untouched fraction first: it is the whole denominator floor and therefore the ceiling on the answer. If (1 - f) is 0.2, no enhancement anywhere else can exceed 5x, which often eliminates three of the four multiple-choice options immediately.',
      importantNote: 'Amdahl assumes a fixed problem size. If a question describes a workload that grows with the machine, it is asking about scaled speedup instead, and the fixed-size ceiling 1/(1-f) no longer applies.',
    },
    { id: 'perf-honest', title: '5. Comparing Machines Honestly: Compilers, MIPS, Power, and Means',
      content: `## 5.1 A case where MIPS ranks two systems backwards

Nothing shows why execution time is the only trustworthy metric as clearly as a
worked contradiction. One processor at 2.5 GHz runs the same program compiled
two ways:

| | Compiler A | Compiler B |
|---|---|---|
| Instructions executed | 2.0 x 10^9 | 2.4 x 10^9 |
| CPI | 1.8 | 1.2 |
| **Execution time** | **1.44 s** | **1.152 s** |
| MIPS rating | 1389 | 2083 |

Compiler B is genuinely faster: 1.44 / 1.152 = **1.25 times**. But the MIPS
ratings say 2083 / 1389 = **1.5 times**, overstating the advantage by twenty
percent, because B achieves its lower CPI partly by issuing *more* instructions
— simpler ones that pipeline better. MIPS counts instructions per second and is
therefore blind to how much work an instruction does. Change the example so B
issues 3.5 x 10^9 instructions at CPI 1.0 and MIPS would rank B far ahead while
its execution time, 1.4 seconds, is barely better than A's.

## 5.2 The three factors, and who controls each

Execution time factorises into exactly three terms, and each is owned by a
different part of the stack:

**time = (instruction count) x (cycles per instruction) x (clock period)**

| Factor | Set mainly by | How you change it |
|---|---|---|
| Instruction count | algorithm, compiler, instruction set | better algorithm; better code generation |
| CPI | microarchitecture, memory system | caches, pipelining, forwarding, prediction |
| Clock period | circuit design, process, voltage | shorter critical path; higher voltage |

The factorisation is why single-number comparisons mislead so reliably. Clock
speed is one factor of three. MIPS folds two of them together and drops the
third. Only the product is the answer to the question anyone actually has.

## 5.3 Power and the voltage knob

Dynamic power in CMOS is

**P = C x V^2 x f**

which is linear in frequency and quadratic in voltage. Because a lower voltage
also forces a lower maximum frequency, the two are usually adjusted together —
this is **dynamic voltage and frequency scaling**. Take a processor down to 90
percent of its voltage and 80 percent of its frequency:

| Quantity | Ratio | Value |
|---|---|---|
| Power | 0.9^2 x 0.8 | **0.648**, a 35% cut |
| Energy per operation, C x V^2 | 0.9^2 | **0.81** |
| Runtime | 1 / 0.8 | **1.25x longer** |
| Total energy for the job | 0.648 x 1.25 | **0.81** |

The last row is the one that matters and the one people get wrong. Cutting
frequency alone saves power but not energy, because the job simply takes
proportionally longer and the integral is unchanged. Only the voltage reduction
saves energy — which is why the last two rows agree exactly at 0.81, the square
of the voltage ratio. On a battery-powered device, energy is the resource, so
the voltage is the knob that matters and the frequency change is what makes the
voltage change legal.

## 5.4 Summarising a benchmark suite

Suppose a new machine is 2.0 times faster on one benchmark, 1.25 on another and
3.2 on a third. What single number describes it?

**arithmetic mean = (2.0 + 1.25 + 3.2) / 3 = 2.15**
**geometric mean = cube root of (2.0 x 1.25 x 3.2) = 2.00**

The geometric mean is the correct summary for **ratios**, and the reason is a
consistency property rather than conservatism. Recompute all three speedups
relative to a different reference machine and the geometric mean of the new
ratios stands in the same relation as before, whereas the arithmetic mean can
reverse the ranking of two machines purely because the reference changed. A
summary that depends on an arbitrary choice of baseline is not a summary.

The arithmetic mean is correct for **times**, and only for times, and only when
each benchmark should count equally. If a workload runs one benchmark far more
often than another, the correct summary is a weighted arithmetic mean of times
with the usage frequencies as weights.

| Data being summarised | Correct mean |
|---|---|
| Execution times, equally weighted | arithmetic |
| Execution times, unequal usage | weighted arithmetic |
| **Speedup ratios** | **geometric** |
| Rates such as MIPS or throughput | harmonic |

**How the exam asks this.** Usually by offering a comparison that clock speed or
MIPS would decide one way and execution time decides the other. Compute
instruction count times CPI divided by frequency for each machine and compare
those two numbers, and treat every other statistic in the question as a
distractor unless it is asked for by name.`,
      examTip: 'Use the geometric mean for speedup ratios and the arithmetic mean for times. If a question gives per-benchmark speedups and asks for an overall figure, multiply and take the nth root; averaging them directly is the wrong-answer choice the question is testing for.',
      importantNote: 'Lowering clock frequency alone saves power but not energy, because the same job then runs proportionally longer. Energy per operation depends on voltage squared and not on frequency at all, so a DVFS problem is answered by tracking the voltage ratio.',
    },
    { id: 'perf-throughput', title: '6. Throughput Against Latency, and Why Improving One Hurts the Other',
      content: `## 6.1 Two questions that sound like one

"How fast is it?" hides two different measurements.

**Latency** is how long one item takes from arrival to completion. **Throughput**
is how many items complete per unit time. A pipeline raises throughput and
*raises* latency, because the registers between stages add delay to every item.
A batch process raises throughput and raises latency, because items wait for the
batch to fill. The two are not two views of the same quantity, and a design that
improves one usually pays in the other.

The clearest place to watch it happen is a server that pays a fixed cost per
batch and a variable cost per item.

## 6.2 A batch server, run event by event

Take a stage that costs 40 microseconds to set up and 5 microseconds per item,
fed by a stream of items arriving at random with a mean rate of 0.12 per
microsecond. It waits until $b$ items are present, then processes them together.
Its capacity is

$$c(b) = b / (40 + 5b)$$

items per microsecond, which rises with $b$ towards the ceiling

$$1 / 5 = 0.2$$

set by the per-item cost alone. Below a certain batch size it cannot keep up at
all:

| Batch $b$ | Capacity | Utilisation at 0.12/us | Mean item latency |
|---|---|---|---|
| 12 | $12 / 100 = 0.12$ | 1.00 | 1,006 us |
| **16** | $16 / 120 = 0.13333$ | 0.90 | **205 us** |
| 32 | $32 / 200 = 0.16$ | 0.75 | 331 us |
| 64 | $64 / 360 = 0.17778$ | 0.68 | 623 us |
| 256 | $256 / 1320 = 0.19394$ | 0.62 | 2,382 us |

The latency column comes from running the server event by event over hundreds of
thousands of items and timing each one from its own arrival, not from a formula.

![Batch server capacity and mean item latency against batch size, as two stacked panels sharing a logarithmic batch axis. Capacity rises monotonically towards a ceiling of 0.2 items per microsecond while latency falls to a minimum at a batch of sixteen and then rises steadily.](/courses/fe-ee/figures/sys3-perf-batching.svg)

## 6.3 Where the latency actually goes

### Worked example 6A — decompose the latency at two batch sizes

**Given.** The server above. Account for the measured 2,382 microseconds at a
batch of 256 and the measured 205 microseconds at a batch of 16.

**At 256.** An item that arrives must wait for the batch to fill. Averaged over
the batch, an item waits for half the fill interval, which for 256 arrivals at
0.12 per microsecond is

$$255 / 0.24 = 1062.5$$

microseconds. The service itself is

$$40 + 1280 = 1320$$

microseconds, and every item leaves when the batch does, so each pays the whole
of it. The total is

$$1062.5 + 1320 = 2382.5$$

microseconds against a measured 2,382.4 — **agreement to four parts in a hundred
thousand, with no queueing term at all**, because at 62 percent utilisation the
server is essentially never busy when a batch is ready.

**At 16.** The same two terms are

$$15 / 0.24 = 62.5$$

and

$$40 + 80 = 120$$

microseconds, totalling

$$62.5 + 120 = 182.5$$

The measurement is 205.3, so

$$205.3 - 182.5 = 22.8$$

microseconds are unaccounted for. That residue is **queueing**: at 90 percent
utilisation a batch sometimes arrives ready while the previous one is still in
service. **Small batches trade fill time for queueing time**, which is why the
latency curve turns around rather than falling forever.

## 6.4 The trade, in one pair of numbers

Moving from a batch of 16 to a batch of 256 changes capacity by

$$0.19394 / 0.13333 = 1.4546$$

and mean latency by

$$2382.4 / 205.3 = 11.6045$$

**Forty-five percent more throughput costs eleven and a half times the latency.**
Neither number is wrong and neither design is wrong; they answer different
questions. A batch job that must finish overnight should take the throughput. An
interactive request should not.

The general shape is worth memorising, because it recurs everywhere in this
chapter and in the machine:

| Mechanism | Throughput | Latency of one item |
|---|---|---|
| Deeper pipeline | up | up, by the added register delays |
| Larger batch or block | up | up, by the fill time |
| Wider issue | up | roughly unchanged |
| Caching | up | down |
| Higher utilisation | up | up sharply near the knee, as Section 11 shows |

Only two entries in that table improve both. Caching improves both because it
removes work rather than rearranging it. Wider issue improves throughput without
touching latency because it adds parallel capacity rather than serialising. Every
other mechanism on the list is a trade, and the exam's favourite version is the
pipeline: it multiplies throughput by the stage count and makes every individual
instruction slower.

### Worked example 6B — a pipeline does both things at once

**Given.** A unit with 12 nanoseconds of combinational logic. It is split into
four balanced stages with 0.6 nanoseconds of register delay per stage. Find the
latency and the throughput before and after.

**Before.** Latency is 12 nanoseconds and throughput is

$$1 / 12 = 0.083333$$

items per nanosecond.

**After.** Each stage takes

$$12 / 4 = 3$$

nanoseconds of logic plus 0.6 of register, so the clock period is

$$3 + 0.6 = 3.6$$

nanoseconds. Throughput is one item per period,

$$1 / 3.6 = 0.27778$$

items per nanosecond, and latency is four periods,

$$4 \\times 3.6 = 14.4$$

nanoseconds.

**The result.** Throughput improved by

$$0.27778 / 0.083333 = 3.3334$$

and latency worsened by

$$14.4 / 12 = 1.2$$

**3.33 times the throughput for 20 percent more latency per item** — and note
that the throughput gain is 3.33 rather than the 4 the stage count suggests,
because the register delay is charged in every stage. **The overhead that limits
pipelining is the same overhead that lengthens the latency.**

**How the exam asks this.** Give a stage count, a total logic delay and a
register overhead. The period is the logic per stage plus the overhead;
throughput is one over the period; latency is the stage count times the period.
Read which of the two the question wants, because the same three numbers give
opposite verdicts.`,
      examTip: 'Latency is one over throughput only for a machine that handles one item at a time. The moment anything is pipelined, batched or queued, they are independent numbers and must be computed separately: throughput from the bottleneck stage, latency from the sum of every stage the item passes through.',
      importantNote: 'A deeper pipeline multiplies throughput by less than the stage count and multiplies latency by more than one, both because of the same per-stage register overhead. Any question that reports a speedup exactly equal to the stage count has ignored it.',
    },
    { id: 'perf-equation', title: '7. The Performance Equation Applied to Real Comparisons',
      content: `## 7.1 Three factors, and none of them decides alone

Section 5.2 factorised execution time into instruction count, cycles per
instruction and clock period. Written with frequency,

$$T = IC \\times CPI / f$$

Every genuine performance question is this expression evaluated twice. The
difficulty is never the algebra; it is that each factor individually points the
wrong way often enough that reading any one of them is worse than useless.

### Worked example 7A — two machines, three factors, three verdicts

**Given.** Machine X runs a program with 3.2 billion instructions at a CPI of
1.4 and a 2.4 GHz clock. Machine Y runs the same program with 4.1 billion
instructions at a CPI of 0.9 and a 2.0 GHz clock. Which is faster?

**Machine X.** Counting in units of $10^{9}$,

$$3.2 \\times 1.4 / 2.4 = 1.8667$$

seconds.

**Machine Y.**

$$4.1 \\times 0.9 / 2.0 = 1.845$$

seconds.

**Verdict.**

$$1.8667 / 1.845 = 1.01176$$

**Machine Y, by 1.2 percent.** Now read the three factors individually. The clock
favours X by a factor of 1.2. The instruction count favours X, by 28 percent. The
CPI favours Y, by 56 percent. **Two of the three factors point at the losing
machine**, and any comparison based on one of them — including the clock speed
printed on the box — gets the answer backwards. Only the product is the answer,
and the margin it gives is so small that the honest conclusion is that these two
machines perform the same on this program.

## 7.2 An instruction-set change moves two factors at once

The reason the equation has to be evaluated rather than reasoned about is that
architectural changes rarely move one factor. Adding a powerful instruction
lowers the instruction count and raises the average CPI, and the two effects can
cancel exactly.

### Worked example 7B — an extension that gains nothing

**Given.** A baseline of 2.0 billion instructions at a CPI of 1.5 on a 3 GHz
clock. A proposed instruction replaces every four instructions in a loop that
accounts for 25 percent of the instruction count. The new instruction has a CPI
of 6; everything else keeps its CPI of 1.5. Find the new execution time, and the
CPI at which the change breaks even.

**Baseline.** In units of $10^{9}$,

$$2.0 \\times 1.5 / 3 = 1$$

second.

**New instruction count.** A quarter of the instructions, 0.5 billion, is
replaced. What remains untouched is

$$2.0 - 0.5 = 1.5$$

billion, and the replacement contributes

$$0.5 / 4 = 0.125$$

billion, for a total of

$$1.5 + 0.125 = 1.625$$

billion — an 18.75 percent reduction.

**New cycle count.** The untouched instructions need

$$1.5 \\times 1.5 = 2.25$$

billion cycles and the new ones need

$$0.125 \\times 6 = 0.75$$

billion, for

$$2.25 + 0.75 = 3$$

billion. The new CPI is therefore

$$3 / 1.625 = 1.8462$$

and the new execution time is

$$3 / 3 = 1$$

second. **Exactly the baseline.** The instruction count fell by nearly a fifth and
the machine got no faster, because the CPI rose by precisely enough to cancel it.

**Break-even.** The change is neutral when the new instructions consume the same
0.75 billion cycles the four they replaced did, so the break-even CPI is

$$0.75 / 0.125 = 6$$

At a CPI of 4 instead, the cycle count would be

$$0.125 \\times 4 = 0.5$$

billion for the new instructions,

$$2.25 + 0.5 = 2.75$$

billion in total,

$$2.75 / 3 = 0.91667$$

seconds, and a speedup of

$$1 / 0.91667 = 1.0909$$

**A CPI of 6 breaks even, a CPI of 4 wins 9.1 percent.** The general rule the
example demonstrates: **a complex instruction pays for itself only if its CPI is
below the total CPI of everything it replaces**, which here is four instructions
at 1.5.

## 7.3 Combining changes, and finding the one that matters

When several factors change together the speedup is the product of the
individual ratios, because the factors multiply.

### Worked example 7C — where a 42 percent gain came from

**Given.** A revised machine executes 10 percent more instructions, at 80 percent
of the old CPI, on a clock 25 percent faster. Find the speedup and attribute it.

**Speedup.** The new time relative to the old is

$$1.10 \\times 0.80 / 1.25 = 0.704$$

so the speedup is

$$1 / 0.704 = 1.4205$$

**Attribution.** Each factor's own contribution is its ratio inverted:

| Factor | Change | Contribution to speedup |
|---|---|---|
| Instruction count | up 10% | $1 / 1.10 = 0.90909$ |
| Cycles per instruction | down 20% | $1 / 0.80 = 1.25$ |
| Clock frequency | up 25% | 1.25 |

and the product is

$$0.90909 \\times 1.25 \\times 1.25 = 1.4205$$

**42.0 percent faster overall**, of which the CPI and the clock each contributed
25 percent and the instruction count gave back 9.1. **The compiler regression
cost roughly a fifth of the gain the hardware delivered** — which is exactly the
kind of accounting that a single headline number hides.

## 7.4 CPI is not a constant, and the memory system is why

The CPI in the equation is an *average over the actual run*, not a property of
the pipeline. Its largest component on most real programs is memory stalls:

$$CPI = CPI_{ideal} + r \\times m \\times p$$

where $r$ is memory references per instruction, $m$ the miss rate and $p$ the
miss penalty in cycles.

Take an ideal CPI of 1.0, 1.2 references per instruction, a 2 percent miss rate
and a 120-cycle penalty. The stall term is

$$1.2 \\times 0.02 \\times 120 = 2.88$$

so

$$1 + 2.88 = 3.88$$

and the fraction of all cycles spent waiting for memory is

$$2.88 / 3.88 = 0.74227$$

**Seventy-four percent of the machine's cycles are stalls**, on a memory system
that misses only one reference in fifty. Two consequences follow and both are
examinable. First, a perfect cache would speed this machine up by 3.88 times, so
the memory system is the whole story and the pipeline is a detail. Second, the
reference count $r$ must include the instruction fetch, which is one per
instruction before any data reference is counted; dropping it is the standard way
to understate the stall term by nearly half.

**How the exam asks this.** Compute instruction count times CPI divided by
frequency for each machine and compare the two times. If an instruction-set
change is described, recompute both the instruction count and the CPI, because it
will have moved both. If a memory system is described, build the CPI from the
ideal value plus the stall term before doing anything else.`,
      examTip: 'A new instruction is worth adding only if its CPI is lower than the summed CPI of the instructions it replaces. Compute that sum first: four instructions at CPI 1.5 give a budget of 6, so an instruction with CPI 6 changes nothing no matter how many instructions it eliminates.',
      importantNote: 'The CPI in the performance equation is measured over the whole run, not quoted from the pipeline. On a machine with a 2 percent miss rate and a 120-cycle penalty, three-quarters of all cycles are memory stalls, and any analysis using the ideal CPI is describing a different machine.',
    },
    { id: 'perf-rates', title: '8. MIPS and FLOPS: Rates That Rank Machines Backwards',
      content: `## 8.1 What a rate metric can and cannot see

MIPS counts instructions per second; FLOPS counts floating-point operations per
second. Both divide a count of *operations* by time. Both are therefore blind to
whether the operations were necessary, and that single blindness generates every
failure they have.

The blindness has a precise statement. Execution time is

$$T = W / R$$

where $W$ is the operations performed and $R$ the rate. A rate metric reports $R$
and drops $W$. Comparing two systems on $R$ alone is valid **only** when $W$ is
identical between them, and the whole art of making a machine faster consists of
changing $W$.

## 8.2 The MIPS failure that needs only one machine

The usual complaint about MIPS is that it cannot compare different instruction
sets, which Section 5.1 demonstrated. The sharper problem is that it does not
give a single answer for one machine.

Take a 2 GHz processor. On a kernel of register-to-register arithmetic with a CPI
of 1 it achieves

$$2000 / 1 = 2000$$

MIPS. On a pointer-chasing kernel with a CPI of 4 the same silicon achieves

$$2000 / 4 = 500$$

MIPS. **A factor of four, on one machine, with no hardware change at all.** MIPS
is therefore not a property of a processor; it is a property of a
processor-and-program pair, which is precisely what execution time already is,
except that execution time also tells you how much work got done.

| Quoted figure | What it actually means |
|---|---|
| Peak MIPS | the issue width times the clock, achieved by no real program |
| Native MIPS | measured on some unnamed program, unreproducible |
| Relative MIPS | this machine against a reference machine nobody has |

None of the three supports a comparison. The FE's position is the correct one:
**quote execution time on a named program, or quote nothing.**

## 8.3 The FLOPS failure: the faster algorithm scores lower

Floating-point rates fail in a more interesting way, because reducing the work is
exactly what a better algorithm does, and the metric punishes it.

### Worked example 8A — Strassen scores worse and finishes sooner

**Given.** A 1024 by 1024 matrix multiply. The classical algorithm performs
$2n^{3}$ floating-point operations and sustains 2.5 GFLOPS. One level of
Strassen's recursion replaces the eight half-size multiplies with seven, plus 18
half-size matrix additions, and sustains only 2.3 GFLOPS because the additions
are memory-bound. Which finishes first, and which scores higher?

**Classical work.**

$$2 \\times 1024 \\times 1024 \\times 1024 = 2147483648$$

operations.

**Strassen work.** Seven multiplies of size 512,

$$7 \\times 2 \\times 512 \\times 512 \\times 512 = 1879048192$$

operations, plus eighteen additions of 512 by 512,

$$18 \\times 512 \\times 512 = 4718592$$

for a total of

$$1879048192 + 4718592 = 1883766784$$

which is

$$1883766784 / 2147483648 = 0.877197$$

of the classical work, a 12.3 percent reduction.

**Times.**

$$2147483648 / 2500000000 = 0.858993$$

seconds classical, against

$$1883766784 / 2300000000 = 0.819029$$

seconds for Strassen — faster by

$$0.858993 / 0.819029 = 1.04879$$

**yet its rate is lower** by

$$2.3 / 2.5 = 0.92$$

![Two panels for the same matrix multiply. The left panel shows the classical algorithm at 2.5 GFLOPS against Strassen at 2.3, the right shows the classical algorithm taking 0.859 seconds against Strassen at 0.819. The two panels rank the algorithms in opposite orders.](/courses/fe-ee/figures/sys3-perf-flops.svg)

**Strassen is 4.9 percent faster and scores 8 percent lower.** A procurement rule
that selects on GFLOPS chooses the slower algorithm, every time, and the better
the algorithm the worse it looks. **A rate metric rewards doing unnecessary work
quickly.**

## 8.4 Two more ways a floating-point rate is inflated

**Counting conventions.** A fused multiply-add computes one result and is
conventionally counted as two operations. A machine retiring one such
instruction per cycle at 3 GHz reports

$$2 \\times 3 = 6$$

GFLOPS on that convention and 3 on the other. Neither is dishonest and they
differ by a factor of two, so a rate quoted without its counting convention
carries no information.

**Peak against achieved.** Peak is an arithmetic identity about the hardware, not
a measurement.

### Worked example 8B — why a real kernel reaches 6 percent of peak

**Given.** Eight cores, each retiring one 8-wide fused multiply-add per cycle at
3 GHz, with 100 GB/s of memory bandwidth. A kernel performs 0.25 floating-point
operations per byte it moves. Find the peak rate, the achieved rate and the
ratio.

**Peak.** Cores times lanes times operations per lane times frequency:

$$8 \\times 8 \\times 2 \\times 3 = 384$$

GFLOPS.

**Achieved.** The kernel is limited by how fast bytes arrive, so its rate is the
arithmetic intensity times the bandwidth:

$$0.25 \\times 100 = 25$$

GFLOPS.

**Ratio.**

$$25 / 384 = 0.065104$$

**6.5 percent of peak**, and no compiler flag recovers the rest, because the
missing 93.5 percent was never available to this kernel. The break-even
arithmetic intensity — the point at which the two limits meet — is the peak rate
over the bandwidth,

$$384 / 100 = 3.84$$

operations per byte. **Below that intensity the machine is a memory system with
some arithmetic attached**, and its floating-point rating describes hardware the
program cannot reach.

The three quantities in that example are the whole of what is usually drawn as a
roofline: a flat ceiling at the peak rate, a sloped ceiling at the bandwidth
times intensity, and a break-even intensity where they cross. A kernel's position
against that break-even says which of the two ceilings it is under, and therefore
which improvement is worth buying.

**How the exam asks this.** Usually by offering a rate comparison that reverses
when times are computed. Convert every rate to a time by dividing the work by the
rate, then compare the times. If the work differs between the two options — a
different algorithm, a different instruction set, a different compiler — the rate
comparison is not merely unreliable, it is meaningless.`,
      examTip: 'Convert every quoted rate into a time before comparing anything: time equals work divided by rate. If the two options do different amounts of work, the rate comparison cannot be repaired, only discarded. This is the single most reliable way to answer a MIPS or FLOPS question.',
      importantNote: 'Peak floating-point rate is an identity about the hardware — cores times lanes times operations times clock. A memory-bound kernel is limited instead by arithmetic intensity times bandwidth, and the two meet at an intensity of peak over bandwidth. Below that intensity, quoting the peak describes a machine the program never sees.',
    },
    { id: 'perf-means', title: '9. Summarising a Benchmark Suite, and Why the Geometric Mean',
      content: `## 9.1 A suite of benchmarks needs one number, and the choice is not free

Section 5.4 asserted that speedup ratios are summarised by the geometric mean.
That assertion can be *proved*, and the proof is short enough to be worth having,
because the alternative produces contradictions rather than merely imprecision.

Take two machines and three benchmarks, with times in seconds:

| Benchmark | Machine P | Machine Q |
|---|---|---|
| one | 20 | 10 |
| two | 10 | 40 |
| three | 40 | 20 |
| **Total** | **70** | **70** |

The totals are

$$20 + 10 + 40 = 70$$

and

$$10 + 40 + 20 = 70$$

so on the only measure that is unambiguously meaningful — how long it takes to
run all three — **the two machines are identical.** Any summary that says
otherwise is wrong, and that is what makes this pair a test case.

## 9.2 The arithmetic mean of ratios contradicts itself

### Worked example 9A — the same data, two references, two opposite verdicts

**Given.** The table above. Summarise Q against P and then P against Q, using
first the arithmetic and then the geometric mean of the per-benchmark speedups.

**Q measured against P.** The speedup of Q on each benchmark is P's time over
Q's:

$$20 / 10 = 2$$

$$10 / 40 = 0.25$$

$$40 / 20 = 2$$

Their sum is

$$2 + 0.25 + 2 = 4.25$$

so the arithmetic mean is

$$4.25 / 3 = 1.4167$$

**"Q is 42 percent faster."** The geometric mean is the cube root of

$$2 \\times 0.25 \\times 2 = 1$$

which is **1.000 — "the machines are equal."**

**P measured against Q.** Now the ratios are 0.5, 4 and 0.5, summing to

$$0.5 + 4 + 0.5 = 5$$

for an arithmetic mean of

$$5 / 3 = 1.6667$$

**"P is 67 percent faster"**, while the geometric mean is the cube root of

$$0.5 \\times 4 \\times 0.5 = 1$$

**again 1.000.**

![Two machines with equal total execution time summarised two ways, as paired bars. The arithmetic mean of ratios says Q is 1.4167 times faster when P is the reference and P is 1.6667 times faster when Q is the reference; the geometric mean gives exactly one in both directions.](/courses/fe-ee/figures/sys3-perf-means.svg)

**The contradiction.** The arithmetic mean says Q is faster *and* that P is
faster. A consistent summary must satisfy one condition above all: the speedup of
Q over P times the speedup of P over Q must be exactly 1. Here it is

$$1.4167 \\times 1.6667 = 2.3612$$

**A summary that claims a machine is 2.36 times faster than itself is not a
summary.** The geometric mean gives one times one, as it must.

## 9.3 Why the geometric mean is the one that works

The property that saves it is that the geometric mean of a quotient is the
quotient of the geometric means. For times $a_i$ normalised to a reference $r_i$,

$$\\left( \\prod_{i=1}^{n} \\frac{a_i}{r_i} \\right)^{1/n} = \\left( \\prod_{i=1}^{n} a_i \\right)^{1/n} \\left( \\prod_{i=1}^{n} r_i \\right)^{-1/n}$$

which is just the statement that a product of quotients is the quotient of the
products, with the same root taken of both. Write $G(x)$ for the geometric mean.
Then the summary for machine A relative to reference R is $G(a)/G(r)$, and
comparing two machines gives

$$\\frac{G(a) / G(r)}{G(b) / G(r)} = \\frac{G(a)}{G(b)}$$

**The reference cancels.** Whatever machine the suite is normalised to, the
ranking and the ratios between machines are unchanged. No such identity exists
for the arithmetic mean, because a sum of quotients is not the quotient of the
sums, and that is exactly why Worked example 9A comes apart.

## 9.4 Which mean for which quantity

The geometric mean is right for ratios and wrong for almost everything else. The
full rule follows from what is being conserved.

| Quantity being averaged | Correct mean | Because |
|---|---|---|
| Times, equally weighted | arithmetic | total time is a sum of times |
| Times, unequal usage | weighted arithmetic | total time weights by frequency |
| Normalised ratios | geometric | it is the only reference-independent one |
| Rates over equal work | harmonic | total time is a sum of reciprocals of rates |

### Worked example 9B — a rate average and a weighted time average

**Given.** A machine processes three equally sized files at 10, 20 and 40 MB/s.
Separately, benchmarks one, two and three from the table above are run 60, 30 and
10 percent of the time. Find the correct average rate, and the correct summary
time for each machine.

**Average rate.** Equal work at different rates means the *times* add, so the
average rate is the harmonic mean. Taking one megabyte of each file, the times
sum to

$$0.1 + 0.05 + 0.025 = 0.175$$

seconds for three megabytes, giving

$$3 / 0.175 = 17.143$$

MB/s. The arithmetic mean of the rates would be

$$10 + 20 + 40 = 70$$

over three, or

$$70 / 3 = 23.333$$

MB/s, overstating the truth by

$$23.333 / 17.143 = 1.3611$$

**36 percent.** The slow file dominates the time and therefore must dominate the
average, which is what taking reciprocals accomplishes.

**Weighted times.** For machine P,

$$0.6 \\times 20 = 12$$

$$0.3 \\times 10 = 3$$

$$0.1 \\times 40 = 4$$

summing to

$$12 + 3 + 4 = 19$$

seconds. For machine Q,

$$0.6 \\times 10 = 6$$

$$0.3 \\times 40 = 12$$

$$0.1 \\times 20 = 2$$

summing to

$$6 + 12 + 2 = 20$$

seconds. **P is faster by**

$$20 / 19 = 1.0526$$

**5.3 percent.** Note what has happened: the unweighted totals said the machines
were identical, and the weighted totals — which encode how the machine is
actually used — break the tie in P's favour. **That is not a contradiction of
Section 9.2; it is a different and better-posed question**, and it is the reason
real benchmark suites publish weights. The contradiction in 9A came from a
summary that changed its answer with an arbitrary reference; this one changes its
answer with a stated fact about the workload, which is what a summary is supposed
to do.

**How the exam asks this.** Given per-benchmark speedups and asked for an overall
figure, multiply them and take the $n$-th root. Given times, add them or take a
weighted sum. Given rates over equal work, take the harmonic mean. The wrong-answer
choice is nearly always the arithmetic mean of whatever was supplied.`,
      examTip: 'Ask what the quantity sums to. Times sum, so average them arithmetically. Rates over equal work do not sum but their reciprocals do, so average them harmonically. Ratios have no meaningful sum at all, so average them geometrically.',
      importantNote: 'The test of a summary statistic is that the speedup of A over B and the speedup of B over A must multiply to one. The geometric mean passes by construction; the arithmetic mean of ratios fails, and on the example here it claims a factor of 2.36 between a machine and itself.',
    },
    { id: 'perf-gustafson', title: '10. Amdahl and Gustafson on the Same Workload',
      content: `## 10.1 One workload, scheduled rather than assumed

Section 4 treated Amdahl's law as an expression to substitute into. Here the same
workload is built out of actual tasks and actually scheduled, which turns out to
disagree with the expression in an instructive way.

The workload is **1000 unit tasks**: 100 of them serial, in the sense that
nothing else may begin until they have all finished, and 900 that may run on any
processor. The parallel fraction is

$$900 / 1000 = 0.9$$

so this is the middle curve of Section 4.2, and the ceiling is

$$1 / 0.1 = 10$$

### Worked example 10A — schedule the tasks and read the makespan

**Given.** The workload above. Find the speedup on 4, 8 and 1024 processors by
assigning tasks to processors and reading the finishing time, then compare with
Amdahl's expression.

**Four processors.** The parallel phase begins at time 100 and 900 tasks divide
evenly:

$$900 / 4 = 225$$

so the makespan is

$$100 + 225 = 325$$

and the speedup is

$$1000 / 325 = 3.0769$$

Amdahl gives a denominator of

$$0.1 + 0.9 / 4 = 0.325$$

and therefore

$$1 / 0.325 = 3.0769$$

**Identical**, because 900 divides by 4.

**Eight processors.** Now

$$900 / 8 = 112.5$$

which is not a whole number of unit tasks. Four processors receive 113 tasks and
four receive 112, so the makespan is set by the busiest:

$$100 + 113 = 213$$

and the speedup is

$$1000 / 213 = 4.6948$$

Amdahl's denominator is

$$0.1 + 0.1125 = 0.2125$$

giving

$$1 / 0.2125 = 4.7059$$

The expression is optimistic by

$$4.7059 / 4.6948 = 1.0024$$

**0.24 percent** — small here, and the size is the point rather than the
direction. **Amdahl's law assumes the parallel work is infinitely divisible.**
With half a task left over the loss is a quarter of a percent; with tasks a tenth
of the parallel phase each it would be enormous. The law is an upper bound, and
what separates the bound from reality is granularity.

**A thousand and twenty-four processors.** Only 900 tasks exist, so 900
processors take one each and 124 idle:

$$100 + 1 = 101$$

is the makespan, for a speedup of

$$1000 / 101 = 9.901$$

against the ceiling of 10.

![Speedup against processor count on logarithmic axes for a workload that is ninety percent parallel. Amdahl's fixed-size curve flattens against a ceiling of ten with scheduled runs marked as circles on it, while Gustafson's scaled-size line rises almost linearly to over nine hundred.](/courses/fe-ee/figures/sys3-perf-scaling.svg)

## 10.2 Efficiency is the number that decides purchases

Speedup says how much faster. **Efficiency** says how much of the hardware was
converted into that speed:

$$E = S / P$$

From the scheduled runs,

$$4.6948 / 8 = 0.58685$$

and

$$9.901 / 1024 = 0.0096689$$

| Processors | Scheduled speedup | Efficiency |
|---|---|---|
| 4 | 3.077 | 76.9% |
| 8 | 4.695 | 58.7% |
| 1024 | 9.901 | **0.97%** |

**On 1024 processors, 99 percent of the machine is producing nothing.** The
speedup still rose — every column is faster than the one before — which is why
speedup alone never justifies a purchase. This behaviour, fixed problem size and
growing processor count, is **strong scaling**, and Amdahl's law is the statement
that strong scaling always ends this way.

## 10.3 Gustafson asks the other question

Amdahl fixes the problem and asks how much sooner it finishes. Gustafson fixes
the *time* and asks how much more work gets done — which is what people who buy a
thousand processors actually do with them.

### Worked example 10B — count the work instead of the time

**Given.** The same workload, but now the machine runs for the same wall-clock
duration on any number of processors: 100 time units of serial phase and 900 of
parallel phase, with the parallel phase filled to capacity.

**Eight processors.** During the serial phase one processor does one unit of work
per unit time, contributing 100. During the parallel phase all eight are busy for
900 time units, contributing

$$8 \\times 900 = 7200$$

so the work completed is

$$100 + 7200 = 7300$$

units. One processor would need 7,300 time units for that work and the machine
took 1,000, so the scaled speedup is

$$7300 / 1000 = 7.3$$

Gustafson's expression, with $s$ the serial share of the *scaled* run, is

$$S = P + (1 - P)s$$

which gives

$$8 - 7 \\times 0.1 = 7.3$$

**the same 7.3.**

**A thousand and twenty-four processors.**

$$100 + 1024 \\times 900 = 921700$$

units of work, so

$$921700 / 1000 = 921.7$$

**Against Amdahl's 9.901 on the same hardware and the same serial fraction.**

## 10.4 The two laws are not in conflict

Nothing has been contradicted. The workloads are different: Amdahl's problem
stayed the size it was, and Gustafson's grew with the machine. The efficiencies
make the distinction concrete:

| Regime | Problem size | Efficiency at 8 | Efficiency at 1024 |
|---|---|---|---|
| **Strong scaling** (Amdahl) | fixed | $4.6948 / 8 = 0.58685$ | 0.97% |
| **Weak scaling** (Gustafson) | grows with $P$ | $7.3 / 8 = 0.9125$ | $921.7 / 1024 = 0.90010$ |

Weak-scaling efficiency does not collapse; it settles towards the parallel
fraction itself, 0.9, and stays there. That is the whole reason large machines
are built at all — not to finish today's problem sooner, but to make tomorrow's
problem tractable.

Which law applies is decided by one question, and the exam almost always answers
it in the problem statement:

| The question is | Use | Because |
|---|---|---|
| "how much sooner does this job finish?" | Amdahl | the work is fixed |
| "how much more can I get done in an hour?" | Gustafson | the time is fixed |
| "should I buy more processors?" | efficiency | speedup rises even when it should not |

FE questions ask the first form overwhelmingly. Use Amdahl unless the problem
explicitly says the workload grows with the machine — and if it does say so, the
fixed-size ceiling $1/(1-f)$ does not apply and quoting it is the error being
tested.

**How the exam asks this.** Identify whether the problem size is fixed. If it is,
substitute into Amdahl and remember the ceiling. If it grows, the scaled speedup
is nearly linear and the serial fraction only shaves a little off it. Efficiency
is always speedup divided by processor count, whichever law produced the speedup.`,
      examTip: 'Amdahl and Gustafson describe the same machine answering different questions, so they never actually disagree. Read the problem for whether the work is fixed or the time is fixed; that single fact selects the law, and using the wrong one is the mistake the question is built around.',
      importantNote: 'Amdahl assumes the parallel work divides perfectly. Scheduling 900 unit tasks on 8 processors gives 4.695 against the formula 4.706, because 900 does not divide by 8. The formula is an upper bound and granularity is the gap; with coarse tasks the gap stops being negligible.',
    },
    { id: 'perf-queueing', title: '11. Little\'s Law, the Utilisation Knee, and Bottlenecks',
      content: `## 11.1 One relation that needs almost no assumptions

For any stable system in which items arrive, spend time, and leave,

$$L = \\lambda W$$

where $L$ is the mean number of items present, $\\lambda$ the arrival rate and $W$
the mean time each spends inside. **Little's law assumes nothing about the arrival
pattern, the service distribution, the queue discipline or the number of
servers.** It needs only that the system is stable, so that what goes in comes
out. That generality is what makes it the most useful single relation in
performance work.

Its most common use is not to compute $L$ but to expose a constraint that was
never stated.

### Worked example 11A — a thread pool nobody mentioned

**Given.** A service handles 2,000 requests per second with a mean response time
of 50 milliseconds. Find the mean number of requests in flight. Then find the
maximum throughput if the server runs a pool of 64 worker threads, each occupied
for the whole of a request.

**Concurrency.** By Little's law,

$$2000 \\times 0.05 = 100$$

**100 requests are inside the system at any instant**, which is a number nobody
measured and everybody needed.

**The constraint.** With 64 threads, $L$ cannot exceed 64. Rearranging the same
law, $\\lambda = L / W$, so

$$64 / 0.05 = 1280$$

requests per second. **The pool caps throughput at 1,280**, well below the 2,000
observed — so either the response time is shorter than reported, or requests are
spending part of their life outside a thread. Little's law does not resolve which;
it proves that one of the stated numbers is wrong, which is usually the more
valuable service.

## 11.2 Utilisation drives latency, and the shape is a knee

Throughput and utilisation say nothing about waiting on their own. For a single
server with random arrivals and exponentially distributed service times, the mean
time in the system is

$$W = 1 / (\\mu - \\lambda)$$

and, writing $\\rho = \\lambda / \\mu$ for the utilisation, the mean number present is

$$L = \\rho / (1 - \\rho)$$

Both denominators vanish as $\\rho$ approaches one, and that is the entire
behaviour.

![Mean response time against utilisation for exponential and for constant service times, in units of the service time, with discrete-event results marked as circles on the exponential curve. Both curves are almost flat below sixty percent and rise without bound approaching one.](/courses/fe-ee/figures/sys3-perf-queue.svg)

Discrete-event runs of six million customers each confirm the curve:

| Utilisation | Simulated $W$ | Closed form | Simulated $L$ | Closed form |
|---|---|---|---|---|
| 0.5 | 2.0004 | 2 | 0.9987 | 1 |
| 0.7 | 3.3301 | 3.3333 | 2.3310 | 2.3333 |
| 0.8 | 4.9964 | 5 | 3.9984 | 4 |
| 0.9 | 10.0191 | 10 | 9.0132 | 9 |

Agreement is within 0.19 percent everywhere, and the runs also check Little's law
against itself: at a utilisation of 0.9 the arrival rate times the measured
waiting time is

$$0.9 \\times 10.0191 = 9.0172$$

against a directly sampled 9.0132, a discrepancy of

$$9.0172 - 9.0132 = 0.004$$

or

$$0.004 / 9.0132 = 0.00044$$

**four parts in ten thousand** — with the number in the system counted by sampling
the queue, not by applying the law being tested.

**The knee.** Read the multiplier between two operating points. Going from half
loaded to ninety percent loaded raises utilisation by

$$0.9 / 0.5 = 1.8$$

and raises response time from

$$1 / 0.5 = 2$$

to

$$1 / 0.1 = 10$$

service times, a factor of

$$10 / 2 = 5$$

**Eighty percent more load costs four hundred percent more latency.** Worse, the
last step is the steepest: pushing from 0.90 to 0.95, a utilisation increase of

$$0.95 / 0.9 = 1.0556$$

takes the response time to

$$1 / 0.05 = 20$$

service times, which is

$$20 / 10 = 2$$

**double, for five and a half percent more work.** This is why systems with
latency requirements are provisioned at 60 or 70 percent and never at 95: the
capacity between them is real, and it is unusable.

## 11.3 Variability is half the waiting

The curve depends on how variable the service times are, not only on their mean.
For a single server with constant service time the mean wait in the queue is

$$W_{q} = \\rho / (2 \\mu (1 - \\rho))$$

which is exactly half the exponential case. At a utilisation of 0.8 the queueing
wait is

$$0.8 / 0.4 = 2$$

service times, so the total is

$$1 + 2 = 3$$

against the exponential case's 5 — and a run with constant service times gives
2.9997. The queueing component alone is

$$4 / 2 = 2$$

**times worse when service times are random than when they are fixed.**
Eliminating variability is worth as much as halving the load, and it is often far
cheaper.

## 11.4 Bottleneck analysis is Amdahl with a different vocabulary

A system of stages in series has a throughput equal to its slowest stage, and
nothing else about the other stages matters.

### Worked example 11B — improve the wrong stage and gain nothing

**Given.** Three stages in series with capacities of 1,200, 800 and 1,500 items
per second. Find the system throughput and each stage's utilisation. Then find
the throughput after stage two is improved to 1,400, and after it is improved to
2,000.

**Before.** The throughput is the minimum, **800 items per second.** The stages
run at

$$800 / 1200 = 0.66667$$

$$800 / 800 = 1$$

$$800 / 1500 = 0.53333$$

so only stage two is saturated. **A stage below 100 percent utilisation is not
the bottleneck and improving it changes nothing.**

**Improved to 1,400.** The minimum is now stage one at 1,200, so throughput is
**1,200**, a gain of

$$1200 / 800 = 1.5$$

**Improved to 2,000.** The minimum is still stage one at 1,200, so throughput is
**still 1,200 — the second half of that improvement bought nothing at all.**

The lesson is Amdahl's in another dress. The bottleneck is the part you did not
improve, the ceiling is set by it alone, and **the bottleneck moves**: every
successful optimisation relocates it, so the next improvement must be re-aimed
rather than continued. A programme of work that keeps optimising the stage it
optimised last is the commonest way to spend effort for no result.

**How the exam asks this.** For Little's law, identify which two of the three
quantities are given and solve for the third, watching the units — a response time
in milliseconds against a rate per second needs one of them converted. For
queueing, compute the utilisation first; every other quantity is a function of it.
For a bottleneck, take the minimum capacity and check which stages are saturated.`,
      examTip: 'Little\'s law works in any consistent unit set and needs no assumption about the arrival process, so it is safe on almost any problem. Convert the response time and the arrival rate to the same time unit before multiplying: a rate per second against a time in milliseconds is the error that produces answers wrong by a thousand.',
      importantNote: 'Response time depends on utilisation and on service-time variability, not on utilisation alone. Constant service times halve the queueing wait against exponential ones at the same load, so reducing variability can be worth as much as buying half again as much capacity.',
    },
    { id: 'perf-energy', title: '12. Power, Energy per Operation, and the Energy-Delay Product',
      content: `## 12.1 Power and energy answer different questions

Dynamic power in CMOS is

$$P = \\alpha C V^{2} f$$

and the energy spent on one operation is that power divided by the operation
rate, which removes the frequency:

$$E = \\alpha C V^{2}$$

**Power is a rate; energy is a total.** A cooling system is sized by power. A
battery is drained by energy. Section 5.3 established the key consequence —
lowering frequency alone cuts power and leaves energy untouched, because the job
runs proportionally longer. Everything below builds on that.

Real silicon adds a second term. Leakage flows whether or not anything is
switching, so the energy charged to one operation includes a share of the static
power proportional to how long the operation took:

$$E = \\alpha C V^{2} + P_{leak} / f$$

That second term is what makes running slowly expensive, and it is why the
question "what frequency should this run at?" has a non-trivial answer.

## 12.2 Voltage and frequency are not independent

A transistor switches more slowly at a lower supply, so a frequency reduction is
what *permits* a voltage reduction. The relation, in the alpha-power form with
$\\alpha = 2$, is

$$f = k (V - V_{th})^{2} / V$$

Take a threshold of 0.35 volts and calibrate $k$ so that one volt yields two
gigahertz. Then

$$1 - 0.35 = 0.65$$

$$0.65 \\times 0.65 = 0.4225$$

and

$$2 / 0.4225 = 4.7337$$

gigahertz per volt. Every other point on the curve now follows rather than being
chosen — which matters, because the shape of that curve is what produces the
result below.

## 12.3 Three metrics, three different answers

### Worked example 12A — find the optimum for energy, for delay, and for their product

**Given.** The voltage-frequency relation above, a switching energy of $V^{2}$
nanojoules per operation in units where the coefficient is one, and a leakage
contribution of 0.5 nanojoules times gigahertz per operation. Find the frequency
that minimises energy per operation, the one that minimises delay, and the one
that minimises their product, searching the curve rather than differentiating.

**Energy.** Sweeping the frequency and evaluating $V^{2} + 0.5 / f$ at each point
gives a minimum at **1.102 GHz**, where the supply is 0.775 volts and the energy
is **1.0538 nJ** per operation. Below that frequency the leakage term grows faster
than the switching term shrinks; above it the reverse.

**Delay.** Delay per operation is $1/f$, which falls monotonically, so it is
minimised at **the top of the achievable range** and nowhere else. Delay alone
never selects an interior point.

**The product.** The energy-delay product $E / f$ has its minimum at **3.412
GHz**, where the supply is 1.329 volts and the energy is **1.9118 nJ** per
operation.

![Energy per operation, delay and their product plotted against clock frequency, each normalised to its own minimum. Energy bottoms out near 1.1 gigahertz, the energy-delay product near 3.4, and delay only at the top of the range.](/courses/fe-ee/figures/sys3-perf-edp.svg)

**Three metrics on one curve pick three different operating points**, and they are
not close together: the energy optimum and the product optimum are a factor of

$$3.412 / 1.102 = 3.096$$

apart in frequency. Moving from the energy optimum to the product optimum costs

$$1.9118 / 1.0538 = 1.8142$$

in energy — **81 percent more per operation** — and buys a delay of

$$1.102 / 3.412 = 0.32298$$

of the old one, a saving of

$$1 - 0.32298 = 0.67702$$

**68 percent.** Whether that is a good trade is exactly the question the
energy-delay product exists to answer, and its answer here is yes.

## 12.4 Why a product, and which product

Minimising energy alone drives the design towards the slowest clock that leakage
permits, producing a machine nobody wants to use. Minimising delay alone drives
it to the highest voltage the silicon survives, producing a machine nobody can
cool. **The energy-delay product is the simplest statistic that refuses both
degenerate answers**, because each factor blows up where the other is minimised.

| Metric | Minimised by | Fails because |
|---|---|---|
| Power | idling | says nothing about work completed |
| Energy per operation | running slowly | ignores that time has value |
| Delay | running fast | ignores that energy has value |
| **Energy-delay product** | an interior point | weights the two equally |
| Energy times delay squared | a higher interior point | weights delay more, for servers |

The choice among the last two is a policy decision, not a physical one. A
battery-powered sensor that wakes once a minute should be judged on energy; a
processor in a datacentre where the machine is a fixed cost per hour should be
judged closer to energy times delay squared, because idle time is wasted capital.

## 12.5 Racing to idle, and why the answer depends on the platform

A recurring design question is whether to run slowly for a long time or quickly
and then idle. On the switching term alone, running slowly always wins, since
energy per operation falls with voltage. The platform changes the answer.

### Worked example 12B — a task of one billion operations

**Given.** The machine above, a task of $10^{9}$ operations, and a rest of the
platform — memory, interfaces, regulators — drawing a constant 2 watts while the
task runs and nothing afterwards. Compare running at the energy optimum with
running at the product optimum.

**At 1.102 GHz.** The processor spends 1.0538 joules on the billion operations,
and the task takes

$$1 / 1.102 = 0.9074$$

seconds. The platform adds

$$2 \\times 0.9074 = 1.8148$$

joules, for a total of

$$1.0538 + 1.8148 = 2.8686$$

joules.

**At 3.412 GHz.** The processor spends 1.9118 joules, and the task takes

$$1 / 3.412 = 0.29308$$

seconds. The platform adds

$$2 \\times 0.29308 = 0.58616$$

joules, for

$$1.9118 + 0.58616 = 2.49796$$

joules.

**The fast setting wins** by

$$2.8686 / 2.49796 = 1.1484$$

**14.8 percent**, despite spending 81 percent more energy inside the processor.
The platform draws power for as long as the task runs, so shortening the task
saves more than the processor loses. **Race-to-idle is right whenever the
constant platform draw exceeds the marginal energy cost of going faster**, and
wrong when the processor is the whole system. Neither is a general rule, and a
question that states a platform power is telling you which regime it is in.

**How the exam asks this.** Track the voltage ratio for energy questions and the
voltage-squared-times-frequency product for power questions. If a total energy for
a job is wanted, multiply the energy per operation by the operation count and add
any constant draw times the runtime — the second term is the one that gets left
out.`,
      examTip: 'Power is voltage squared times frequency; energy per operation is voltage squared alone. A DVFS question is answered by identifying which of the two it asks for, then tracking only the voltage ratio for energy and both ratios for power.',
      importantNote: 'Energy, delay and the energy-delay product select three different clock frequencies on the same silicon, here 1.10, the maximum, and 3.41 GHz. Quoting an optimum without naming the metric it optimises is meaningless, and the gap between them is a factor of three in frequency and nearly two in energy.',
    },
    { id: 'perf-problems', title: '13. Practice Problems',
      content: `## Problem Set D — the performance equation and rate metrics

**D1.** A program executes 5.0 billion instructions at a CPI of 2.2 on a 3.3 GHz
processor. Find the execution time and the MIPS rating, and confirm the two
against each other.

*Answer.* In units of $10^{9}$,

$$5.0 \\times 2.2 / 3.3 = 3.3333$$

seconds. The rating is the clock in megahertz over the CPI,

$$3300 / 2.2 = 1500$$

MIPS. Confirming: 5.0 billion instructions in 3.3333 seconds is 1.5 billion per
second, which is 1500 million per second. **3.33 seconds and 1500 MIPS.** The two
routes must agree because the rating is nothing more than the equation rearranged
— which is also why it adds no information.

**D2.** An instruction mix is 45 percent ALU at CPI 1, 22 percent load at CPI 4,
13 percent store at CPI 3 and 20 percent branch at CPI 2. Find the average CPI,
the share contributed by loads, and the speedup if load CPI is halved.

*Answer.* The contributions are

$$0.45 \\times 1 = 0.45$$

$$0.22 \\times 4 = 0.88$$

$$0.13 \\times 3 = 0.39$$

$$0.20 \\times 2 = 0.4$$

summing to

$$0.45 + 0.88 + 0.39 + 0.4 = 2.12$$

Loads contribute

$$0.88 / 2.12 = 0.41509$$

**41.5 percent of all cycles from 22 percent of the instructions.** Halving their
CPI to 2 gives a contribution of

$$0.22 \\times 2 = 0.44$$

and a new average of

$$0.45 + 0.44 + 0.39 + 0.4 = 1.68$$

for a speedup of

$$2.12 / 1.68 = 1.2619$$

**CPI 2.12, loads 41.5 percent, speedup 1.26.** The trap is ranking optimisation
targets by instruction frequency; rank them by their contribution to the CPI,
which is frequency times cost.

**D3.** Machine A sustains 1.8 GFLOPS and finishes a job in 40 seconds. Machine B
sustains 1.5 GFLOPS and finishes the same job in 30 seconds. Which is faster, and
what does the difference in rate tell you?

*Answer.* The work each performed is the rate times the time:

$$1.8 \\times 40 = 72$$

and

$$1.5 \\times 30 = 45$$

billion operations. **B is faster by a third and performs**

$$72 / 45 = 1.6$$

**times less work.** The rate difference does not indicate a slower machine; it
indicates that B is running a better algorithm, and the rate metric penalises it
for that. **The only correct comparison here is the 40 seconds against the 30.**

**D4.** A routine accounting for 65 percent of runtime is made five times faster.
Find the speedup, the ceiling, and how much of the ceiling was captured.

*Answer.* The improved portion shrinks to

$$0.65 / 5 = 0.13$$

so the denominator is

$$0.35 + 0.13 = 0.48$$

and the speedup is

$$1 / 0.48 = 2.0833$$

The ceiling is

$$1 / 0.35 = 2.8571$$

and the fraction captured is

$$2.0833 / 2.8571 = 0.729166$$

**2.08 times, against a ceiling of 2.86, capturing 72.9 percent of what is
available.** The remaining 27 percent would cost an infinitely fast routine, which
is the standard demonstration that a fivefold improvement is already most of the
benefit there is.

## Problem Set E — scaling, summaries and queueing

**E1.** A machine is 1.6, 0.8 and 3.0 times as fast as a reference on three
benchmarks. Summarise it correctly, and say how far the wrong summary is off.

*Answer.* These are ratios, so the geometric mean applies. The product is

$$1.6 \\times 0.8 \\times 3.0 = 3.84$$

whose cube root is **1.566**. The arithmetic mean would be

$$1.6 + 0.8 + 3.0 = 5.4$$

over three, or

$$5.4 / 3 = 1.8$$

overstating by

$$1.8 / 1.566 = 1.1494$$

**1.566 correct, 1.8 wrong, 15 percent overstated.** The arithmetic mean is pulled
up by the single benchmark on which the machine excels, which is precisely the
behaviour that makes it unusable for ratios.

**E2.** A disk subsystem is observed holding 12 requests on average while
receiving 350 requests per second. Its maximum rate is 400 per second. Find the
mean response time, and say what the number implies about service variability.

*Answer.* By Little's law,

$$12 / 350 = 0.034286$$

seconds, **34.3 milliseconds.** The utilisation is

$$350 / 400 = 0.875$$

and a single server with exponential service at that load would hold

$$0.875 / 0.125 = 7$$

requests. **The observed 12 is well above 7, so service times are more variable
than exponential** — bursty, or with occasional very long operations. Little's law
gave the response time with no distributional assumption at all; comparing its
answer against a model is what exposed the variability.

**E3.** At what utilisation does the mean response time of a single exponential
server reach eight service times?

*Answer.* Response time in service times is one over one minus the utilisation, so

$$1 / 8 = 0.125$$

and

$$1 - 0.125 = 0.875$$

**87.5 percent.** Note how little headroom that leaves: the same server at 75
percent responds in four service times, so **the last 12.5 points of utilisation
double the latency.**

**E4.** A workload is 5 percent serial. Find the strong-scaling speedup and
efficiency on 64 processors, and the weak-scaling speedup and efficiency on the
same machine.

*Answer.* For strong scaling the parallel part shrinks to

$$0.95 / 64 = 0.014844$$

so the denominator is

$$0.05 + 0.014844 = 0.064844$$

and the speedup is

$$1 / 0.064844 = 15.422$$

with efficiency

$$15.422 / 64 = 0.24097$$

For weak scaling the scaled speedup is the processor count less the serial share
of the extra processors,

$$63 \\times 0.05 = 3.15$$

$$64 - 3.15 = 60.85$$

with efficiency

$$60.85 / 64 = 0.95078$$

**15.4 times at 24 percent efficiency, or 60.9 times at 95 percent, on identical
hardware with an identical serial fraction.** The whole difference is whether the
problem grew.

**E5.** Four stages in series have capacities of 500, 900, 650 and 400 items per
second. Find the throughput, the effect of doubling the second stage, and the
best single improvement available.

*Answer.* Throughput is the minimum, **400 items per second**, set by the fourth
stage. Doubling the second stage to 1,800 leaves the minimum at 400: **no gain
whatever.** The only useful improvement is to the fourth stage, and its value is
capped by the next-slowest, so raising it above 500 is wasted. Taking it to 500
or beyond gives

$$500 / 400 = 1.25$$

**a 25 percent gain, and not one percent more until the first stage is also
improved.** The bottleneck moves the moment it is relieved, which is why
improvement programmes must be re-aimed after every success rather than continued.

## Problem Set F — power and energy

**F1.** A processor's supply is cut by 15 percent and its clock by 25 percent.
Find the ratios for power, energy per operation, runtime and total energy for a
fixed job.

*Answer.* Power goes as voltage squared times frequency:

$$0.85 \\times 0.85 = 0.7225$$

$$0.7225 \\times 0.75 = 0.541875$$

so power falls to **54.2 percent.** Energy per operation goes as voltage squared
alone, **72.25 percent.** The runtime stretches by

$$1 / 0.75 = 1.3333$$

and the total energy is power times runtime,

$$0.541875 \\times 1.3333 = 0.72248$$

**Total energy 72.25 percent — identical to the energy per operation**, as it must
be, because the frequency cancels between the power reduction and the longer run.
**Only the voltage saved energy; the frequency reduction saved power and made the
voltage reduction legal.**

**F2.** Design A uses 1.4 nJ per operation with a 0.5 ns delay. Design B uses 2.2
nJ with a 0.3 ns delay. Rank them on energy, on the energy-delay product, and on
energy times delay squared.

*Answer.* On energy alone A wins by

$$2.2 / 1.4 = 1.5714$$

On the product,

$$1.4 \\times 0.5 = 0.7$$

against

$$2.2 \\times 0.3 = 0.66$$

so **B wins** by

$$0.7 / 0.66 = 1.0606$$

On energy times delay squared,

$$0.5 \\times 0.5 = 0.25$$

$$1.4 \\times 0.25 = 0.35$$

against

$$0.3 \\times 0.3 = 0.09$$

$$2.2 \\times 0.09 = 0.198$$

so B wins by

$$0.35 / 0.198 = 1.7677$$

**A on energy, B on the product by 6 percent, B on the delay-weighted product by
77 percent.** Three metrics, two different winners, and the margin grows the more
delay is weighted. **Name the metric before ranking anything.**

**F3.** A task of 2 billion operations may run at 1.5 GHz costing 0.9 nJ per
operation, or at 3.0 GHz costing 1.6 nJ. The rest of the platform draws 1.5 watts
while the task runs. Which setting uses less total energy, and at what platform
power would the answer change?

*Answer.* **Slow setting.** The processor spends

$$2 \\times 0.9 = 1.8$$

joules over

$$2 / 1.5 = 1.3333$$

seconds, during which the platform adds

$$1.5 \\times 1.3333 = 2$$

joules, for

$$1.8 + 2 = 3.8$$

joules.

**Fast setting.** The processor spends

$$2 \\times 1.6 = 3.2$$

joules over

$$2 / 3 = 0.66667$$

seconds, and the platform adds

$$1.5 \\times 0.66667 = 1$$

joule, for

$$3.2 + 1 = 4.2$$

joules.

**The slow setting wins by**

$$4.2 / 3.8 = 1.1053$$

**10.5 percent.** The break-even platform power is where the extra 1.4 joules of
processor energy equals the platform energy saved by finishing 0.6667 seconds
sooner:

$$1.4 / 0.66667 = 2.1$$

**watts.** Above 2.1 W racing to idle wins; below it, running slowly does. Compare
Worked example 12B, where a 2 W platform and a steeper energy curve put the answer
the other way — **race-to-idle is a calculation, never a rule.**`,
      examTip: 'Every problem here reduces to writing the quantity as a product of factors and tracking each factor separately: time as instruction count times CPI over frequency, power as voltage squared times frequency, energy as power times time. Once the factorisation is on the page the arithmetic is trivial and the trap is disarmed.',
      importantNote: 'Rank optimisation targets by their contribution, not their frequency. Loads that are 22 percent of the instruction mix can be 41 percent of the cycles, and a bottleneck stage at 100 percent utilisation is the only stage whose improvement changes anything at all.',
    },
  ],
  keyTakeaways: [
    'Execution time = IC * CPI / f; only reliable performance metric.',
    'CPI_avg = SUM(CPI_i * fraction_i) for mixed workloads.',
    'MIPS = f(MHz)/CPI; can be misleading.',
    'Amdahl: speedup = 1/[(1-f)+f/S]; max = 1/(1-f).',
    'Power P = C*V^2*f; voltage reduction most effective.',
    'Sequential fraction fundamentally limits achievable speedup.',
  ],
},

  /* ══════════════════════════════════════════════════════════════════
   * TOPIC 17 — SOFTWARE DEVELOPMENT  (5 curriculum IDs)  ·  3–5 %
   * ══════════════════════════════════════════════════════════════════ */

};
