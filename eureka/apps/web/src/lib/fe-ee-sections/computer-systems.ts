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

**Speed order**: I2C < SPI < UART < USB < PCIe

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
