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
- No IF/MEM conflict -> eliminates ~20-30% of structural hazards
- Modern CPUs: separate L1 I-cache and D-cache (Modified Harvard)

| Architecture | Structural Hazards | Throughput Impact |
|---|---|---|
| Von Neumann | IF/MEM conflicts | CPI penalty ~0.2-0.3 |
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

Without TLB: every access costs 200 ns extra. The TLB reduces average translation overhead by **95%**.

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
