# FE EE Coverage Audit — Third-Party Study-Guide Outline vs. Our 93-Topic Course

**Date:** 2026-08-15
**Course under audit:** `eureka/apps/web/src/lib/fe-ee-sections/*.ts` — 93 topics in 19 sections.
**Benchmark:** the chapter/problem-set OUTLINE of a commercial FE Electrical & Computer study guide (17 chapters, 85 problem sets, aligned to NCEES® FE Reference Handbook 10.0.1), used purely as a structural checklist.

## Method and copyright rule

- The guide was used **only for its coverage structure**: chapter list, problem-set list, and the NCEES handbook page ranges each set points at. Where a set's name alone was ambiguous, its problems were skimmed solely to identify which **concepts** they exercise. **No wording, problem, solution, or explanatory text from the guide is reproduced anywhere in this document or in our course.** All concept names below are our own phrasing.
- Verdicts were **verified against the actual lesson prose** (the `content:` template literals), not inferred from topic titles. Every topic body was programmatically scanned for concept-level evidence, and ambiguous hits were inspected in context.
- Verdict scale:
  - **COVERED** — the set's main concepts are demonstrably taught (formula/derivation/worked usage present) in the named topic(s).
  - **THIN** — part of the set is taught, but a significant slice of its concepts is absent or below exam-usable level.
  - **MISSING** — essentially nothing in the course teaches the set's concepts.
- Coverage is independent of the depth programme (`check_fe_ee_depth.py`: 15/93 topics currently at the ≥2000-word standard). A short topic can still be COVERED for a concept; depth expansion is a separate, already-tracked effort.

**Bottom line: 64 / 85 sets COVERED, 18 THIN, 3 MISSING. No guide set requires a brand-new topic; every gap can be absorbed into an existing topic (one borderline case noted).**

---

## Chapter-by-chapter mapping

### Guide Ch. 1 — Mathematics (handbook pp. 34–62) → our `mathematics.ts`

| Set | Concepts exercised (our wording) | Our topic(s) | Verdict |
|---|---|---|---|
| 1.1 | Solving logarithmic equations, log identities and base change, trig-identity simplification, solving triangles via the sine and cosine rules | `fee_algebra_trig` | **THIN** — quadratics, trig identities, polar/rect conversion, and dB-centred logarithm rules are taught; the sine/cosine laws for triangle solution are absent and log-equation manipulation is taught only through the decibel lens |
| 1.2 | Rectangular/polar forms, conversions, complex arithmetic, Euler identity | `fee_complex` | **COVERED** |
| 1.3 | Set operations, counting, mapping, graph basics, arithmetic & geometric progressions | `fee_discrete_math` | **THIN** — sets, De Morgan, permutations/combinations, binomial theorem, and graph basics (vertices/edges/degree) are taught; arithmetic/geometric progressions and their sum formulas appear nowhere in the course |
| 1.4 | Straight lines, distance/midpoint, conic sections, mensuration of areas and volumes | `fee_analytic_geom` | **THIN** — lines, conics, polar coordinates, and plane areas (circle, ellipse) are taught; solid mensuration (sphere/cylinder/cone volumes and surface areas) is absent |
| 1.5 | Derivatives, local max/min and inflection, limits incl. L'Hôpital, indefinite and definite integrals | `fee_diff_calc`, `fee_int_calc` | **COVERED** — L'Hôpital, critical points, inflection, definite integrals, average/RMS integrals all verified |
| 1.6 | First-order ODE solution methods, second-order ODEs via characteristic equation | `fee_diffeq` | **COVERED** — first-order linear (constant-coefficient) and separation of variables plus full second-order treatment; the general integrating-factor method for variable coefficients is a minor sub-gap (see notes) |
| 1.7 | Matrix arithmetic, determinant, transpose, inverse; dot and cross products | `fee_linear_algebra`, `fee_vector_analysis` | **COVERED** |

### Guide Ch. 2 — Probability & Statistics (pp. 63–84) → our `probability-statistics.ts`

| Set | Concepts | Our topic(s) | Verdict |
|---|---|---|---|
| 2.1 | Mean, median, mode, standard deviation, sample variance, sample range, geometric mean, RMS of a data set | `fee_expected_values` | **THIN** — mean/median/mode/variance/std-dev are taught well; geometric mean, RMS-of-data, and sample range are absent |
| 2.2 | Permutations vs. combinations; joint, conditional, and total probability; Bayes | `fee_discrete_math` (counting), `fee_prob_dist` (probability laws, Bayes) | **COVERED** |
| 2.3 | Discrete/continuous distributions: binomial, normal, etc. | `fee_prob_dist` | **COVERED** — binomial, Poisson, normal, exponential all taught |
| 2.4 | Expected value and variance from mass/density functions; cumulative distribution | `fee_expected_values` | **THIN** — E[X] and variance are taught; the PDF/PMF/CDF formalism (definitions, unit total area, computing E[X] from a given density) appears nowhere by name |

### Guide Ch. 3 — Ethics & Professional Practice (pp. 4–33) → our `ethics-professional-practice.ts`

| Set | Concepts | Our topic(s) | Verdict |
|---|---|---|---|
| 3.1 | Codes of ethics, NCEES Model Law/Model Rules, licensee obligations, disciplinary grounds | `fee_codes_ethics` (+`fee_licensure`, `fee_liability`) | **COVERED** |
| 3.2 | Intellectual-property categories: patent, trademark, copyright, industrial design, trade secret | — | **MISSING** — no topic mentions any IP concept |
| 3.3 | Electrical workplace safety: NEC/NFPA 70E context, safety grounding, PPE/arc-flash categories, safety data sheets, shock-current thresholds | — | **MISSING** — grounding appears in our power topics only as a fault-analysis concept, never as workplace-safety material; no NEC/OSHA/PPE/SDS content anywhere |

### Guide Ch. 4 — Engineering Economics (pp. 230–237) → our `engineering-economics.ts`

| Set | Concepts | Our topic(s) | Verdict |
|---|---|---|---|
| 4.1 | Compound-interest factors (single payment, uniform series, sinking fund, capital recovery), gradient series | `fee_tvm` | **COVERED** — includes arithmetic and geometric gradient forms |
| 4.2 | Inflation-adjusted rates, depreciation methods incl. MACRS, book value, capitalized cost | `fee_depreciation` (+`fee_tvm`) | **THIN** — straight-line/MACRS/book value taught; inflation-adjusted interest and capitalized cost absent |
| 4.3 | Rate of return, break-even, benefit–cost comparison, decision trees | `fee_cost_analysis` | **THIN** — NPV/IRR/benefit-cost taught; break-even analysis and decision trees absent |

### Guide Ch. 5 — Properties of Electrical Materials (pp. 95, 104–105, 355–359) → our `properties-of-electrical-materials.ts` (+ engineering sciences)

| Set | Concepts | Our topic(s) | Verdict |
|---|---|---|---|
| 5.1 | Resistivity/conductivity, parallel-plate capacitance, stored energy, permeability, inductance, charge/current relationships | `fee_conductors`, `fee_dielectrics`, `fee_electrostatics`, `fee_magnetic_mat`, `fee_work_energy`, `fee_charge_current` | **COVERED** — resistivity + temperature coefficient, C = εA/d, ½CV²/½LI², permeability and B–H behaviour all verified (photoelectric effect is a minor sub-gap) |
| 5.2 | Thermal expansion, specific heat, temperature coefficient of resistance | `fee_conductors` (partial) | **THIN** — temperature coefficient of resistance is taught; thermal-expansion strain and specific-heat calculations appear nowhere |

### Guide Ch. 6 — Circuit Analysis (pp. 357–361) → our `circuit-analysis.ts`

| Set | Concepts | Our topic(s) | Verdict |
|---|---|---|---|
| 6.1 | KCL, KVL, node/loop analysis | `fee_dc_fundamentals` | **COVERED** |
| 6.2 | Series/parallel reduction, voltage/current dividers | `fee_dc_fundamentals` | **COVERED** |
| 6.3 | Thévenin/Norton equivalents, source transformation, maximum power transfer | `fee_network_theorems` | **COVERED** |
| 6.4 | Average/effective (RMS) values, rectified-waveform values, sinusoid parameters and addition | `fee_ac_phasors`, `fee_int_calc` | **COVERED** — includes an RMS table for half- and full-wave rectified sinusoids |
| 6.5 | Phasor representation and arithmetic | `fee_ac_phasors` (+`fee_complex`) | **COVERED** |
| 6.6 | Impedance of R/L/C, series/parallel impedance | `fee_ac_phasors` | **COVERED** |

### Guide Ch. 7 — Linear Systems (pp. 56, 361–362) → our `circuit-analysis.ts` + `linear-systems.ts`

| Set | Concepts | Our topic(s) | Verdict |
|---|---|---|---|
| 7.1 | RC/RL switched transients, time constants, initial/final conditions | `fee_transients` | **COVERED** |
| 7.2 | Series/parallel RLC resonance, quality factor, bandwidth | `fee_resonance` | **COVERED** |
| 7.3 | Laplace pairs, inverse transform via partial fractions | `fee_vector_analysis` (Laplace half), `fee_freq_domain` | **COVERED** |
| 7.4 | Transfer functions: standard form, gain, poles/zeros | `fee_transfer_func` (+`fee_pzmap_analysis`) | **COVERED** |

### Guide Ch. 8 — Signal Processing (pp. 369–371, 376, 379–380) → our `signal-processing.ts` + `linear-systems.ts`

| Set | Concepts | Our topic(s) | Verdict |
|---|---|---|---|
| 8.1 | Sampling theorem, Nyquist rate, aliasing and recovered-frequency prediction | `fee_sampling`, `fee_signal_nyquist` | **COVERED** |
| 8.2 | Analog filter identification, cutoff frequencies, standard responses | `fee_filters` | **COVERED** — first/second-order transfer functions, Butterworth/Chebyshev |
| 8.3 | Z-transforms (forward/inverse), difference equations, digital-filter classes | `fee_z_transforms` | **THIN** — z-transform pairs, inverse via partial fractions, and difference equations are taught; FIR-vs-IIR (non-recursive vs. recursive) classification is never introduced |
| 8.4 | Continuous-time convolution | `fee_time_domain` | **COVERED** — integral definition + properties (graphical-evaluation drill would strengthen it) |
| 8.5 | Discrete-time convolution | `fee_time_domain` | **COVERED** |

### Guide Ch. 9 — Electronics (pp. 220–225, 381–388) → our `electronics.ts` (+ materials, engineering sciences)

| Set | Concepts | Our topic(s) | Verdict |
|---|---|---|---|
| 9.1 | Doping, carrier types, drift/diffusion, conductivity, junction built-in potential | `fee_semiconductors` | **COVERED** |
| 9.2 | Diode models (ideal, constant-drop, exponential), Zener regulation, thyristor-controlled rectification | `fee_diodes`, `fee_power_elec` (SCR firing angle) | **COVERED** |
| 9.3 | BJT operating point, regions, amplifier configurations | `fee_bjt` | **COVERED** |
| 9.4 | JFET structure, operating regions, biasing | — | **MISSING** — the string "JFET" (or any junction-FET treatment) appears nowhere in the course |
| 9.5 | MOSFET regions, biasing, amplification in saturation | `fee_mosfet` | **COVERED** |
| 9.6 | Ideal op-amp analysis, standard configurations, common-mode rejection | `fee_opamp` | **COVERED** — CMRR is defined; a quantitative CMRR formula is a minor sub-gap |
| 9.7 | DC-DC converters (buck/boost/buck-boost), multi-pulse rectifiers, PWM inverters | `fee_power_elec` | **COVERED** |
| 9.8 | Transducers (RTD/thermistor/thermocouple/strain gauge), Wheatstone bridge, meter loading | `fee_electromech` | **THIN** — sensor table, gauge factor, and Wheatstone balance are taught; voltmeter/ammeter loading-error analysis is absent and RTD gets only a passing mention |

### Guide Ch. 10 — Power Systems (pp. 363–368) → our `power-systems.ts` + `circuit-analysis.ts`

| Set | Concepts | Our topic(s) | Verdict |
|---|---|---|---|
| 10.1 | Real/reactive/apparent power, power triangle, single-phase power | `fee_ac_power` | **COVERED** |
| 10.2 | Three-phase line/phase relations, Δ–Y conversion, losses and efficiency in T&D | `fee_three_phase`, `fee_3phase_power`, `fee_tx_lines` | **COVERED** |
| 10.3 | Power-factor correction and capacitor sizing | `fee_pf_correction` (+`fee_ac_power`) | **COVERED** |
| 10.4 | Transformer voltage regulation; feeder voltage drop | `fee_transformers` (VR incl. worked example), `fee_tx_lines` (ΔV ≈ (RP+XQ)/V) | **COVERED** |
| 10.5 | Turns ratio, impedance referral, transformer efficiency | `fee_transformers` (+`fee_per_unit`) | **COVERED** |
| 10.6 | Synchronous speed, slip and operating regimes, synchronous-machine voltage behaviour, DC-machine power/torque/armature relations | `fee_motors` | **COVERED** |

### Guide Ch. 11 — Electromagnetics (pp. 59–60, 355–356, 368–369) → our `electromagnetics.ts`

| Set | Concepts | Our topic(s) | Verdict |
|---|---|---|---|
| 11.1 | Coulomb force, E-fields, Gauss's law, capacitance geometries | `fee_electrostatics` (+`fee_charge_current`) | **COVERED** |
| 11.2 | Biot–Savart, Ampère's law, magnetic forces | `fee_magnetostatics` | **COVERED** |
| 11.3 | Maxwell's equations in differential form; divergence/curl fluency | `fee_maxwell` (+`fee_vector_analysis`) | **COVERED** |
| 11.4 | Plane-wave propagation, phase velocity, skin depth, Poynting vector | `fee_wave_prop` | **COVERED** |
| 11.5 | Characteristic impedance, reflection coefficient, standing-wave ratio | `fee_em_tx_lines` | **COVERED** |

### Guide Ch. 12 — Control Systems (pp. 226–229, 373–374) → our `control-systems.ts` + `linear-systems.ts`

| Set | Concepts | Our topic(s) | Verdict |
|---|---|---|---|
| 12.1 | Block-diagram reduction, open- vs. closed-loop response, standard feedback form | `fee_block_diagrams` | **COVERED** |
| 12.2 | Bode magnitude/phase construction and reading | `fee_bode_sketching`, `fee_bode_nyquist` | **COVERED** |
| 12.3 | Routh–Hurwitz stability, gain/phase margins | `fee_stability`, `fee_bode_nyquist` | **COVERED** |
| 12.4 | System type and steady-state error, damping ratio, overshoot, peak/settling times | `fee_time_specs` (+`fee_pid`, `fee_pzmap_analysis`) | **COVERED** — system-type error table and all second-order time-domain specs verified (logarithmic decrement and damped resonant frequency are minor sub-gaps) |

### Guide Ch. 13 — Communications (pp. 52–55, 372–377) → our `communications.ts` + `signal-processing.ts` + `linear-systems.ts`

| Set | Concepts | Our topic(s) | Verdict |
|---|---|---|---|
| 13.1 | Signal models and operations: step/impulse scaling and shifting, rectangular/triangular pulses, even/odd symmetry, signal energy | `fee_time_domain`, `fee_fourier` | **THIN** — impulse/step responses, even/odd symmetry, and Parseval energy are taught; the signal-operations toolkit (time scaling/shifting of pulse models, impulse-scaling identity) is not taught anywhere |
| 13.2 | AM: modulation index, carrier/sideband power split, efficiency, variants | `fee_am_fm` | **COVERED** |
| 13.3 | FM/PM: deviation, modulation index, Carson-rule bandwidth | `fee_am_fm` | **COVERED** |
| 13.4 | Fourier series and transform pairs, table-driven evaluation | `fee_fourier`, `fee_freq_domain` | **COVERED** |
| 13.5 | Digital transmission: quantization levels, PCM/PAM bandwidth, capacity limits, parity and CRC error detection | `fee_channel_cap`, `fee_comms_shannon` (capacity only) | **THIN** — Shannon capacity is taught thoroughly; PCM/PAM and quantization-level reasoning are absent (quantization appears only as a noise source), and parity/CRC error-detection coding is not taught |
| 13.6 | TDM/FDM (and modern variants) | `fee_multiplexing` | **COVERED** |

### Guide Ch. 14 — Computer Networks (pp. 392–407, 413–416) → our `computer-networks.ts`

| Set | Concepts | Our topic(s) | Verdict |
|---|---|---|---|
| 14.1 | Routing vs. switching, device layers, MAC vs. IP forwarding, routing tables | `fee_osi_tcpip` (+`fee_topologies`) | **COVERED** — L1/L2/L3 device table, MAC-vs-IP forwarding, routing-table concept (a shortest-path table-building drill would strengthen it) |
| 14.2 | Topologies, network types, OSI vs. TCP/IP models | `fee_topologies`, `fee_osi_tcpip` | **COVERED** |
| 14.3 | IPv4 addressing/subnetting; IPv6 format | `fee_ip_subnetting` | **COVERED** |
| 14.4 | TCP vs. UDP, connection establishment, ICMP roles | `fee_osi_tcpip` | **COVERED** |
| 14.5 | Firewalls, IDS/IPS, scanning/reconnaissance, RSA and Diffie–Hellman, complexity metric | `fee_net_security` | **THIN** — firewalls, signature/anomaly IDS, RSA, Diffie–Hellman, and hashes are taught; port-scanning/reconnaissance basics are absent, and McCabe's cyclomatic complexity (which this set folds in) appears nowhere in the course |

### Guide Ch. 15 — Digital Systems (pp. 34, 389–392) → our `digital-systems.ts`

| Set | Concepts | Our topic(s) | Verdict |
|---|---|---|---|
| 15.1 | Base conversion, signed representations, complements | `fee_number_sys` | **COVERED** |
| 15.2 | Boolean identities, De Morgan | `fee_number_sys` (+`fee_discrete_math`) | **COVERED** |
| 15.3 | Gate truth tables incl. XOR/XNOR, universal gates | `fee_comb_logic`, `fee_number_sys` | **COVERED** |
| 15.4 | K-map grouping, minterm/SOP minimization, don't-cares | `fee_number_sys` | **COVERED** — includes a 4-variable worked K-map (POS/maxterm form is a minor sub-gap) |
| 15.5 | Flip-flop characteristic behaviour, counters, registers | `fee_seq_logic` | **COVERED** |
| 15.6 | MUX, decoders, encoders, adders | `fee_comb_logic` | **COVERED** |
| 15.7 | Programmable logic: PLA/PAL/ROM plane structures, gate arrays, FPGA | `fee_memory` (FPGA only) | **THIN** — FPGA architecture is taught; PLA-vs-PAL-vs-ROM AND/OR-plane structure and reading outputs from a programmed plane are absent |
| 15.8 | State diagrams/tables, Mealy vs. Moore design | `fee_state_machines` | **COVERED** |
| 15.9 | Timing: propagation delay from diagrams, glitches/hazards, flip-flop race behaviour | `fee_seq_logic` (partial), `fee_state_machines` (glitch mentions) | **THIN** — setup/hold, clock-to-Q, f_max, and metastability are taught; combinational hazard classification (static-1/static-0/dynamic), JK race-around and its master–slave remedy, and timing-diagram delay reading are absent |

### Guide Ch. 16 — Computer Systems (pp. 408–410) → our `computer-systems.ts` + `digital-systems.ts`

| Set | Concepts | Our topic(s) | Verdict |
|---|---|---|---|
| 16.1 | Microprocessor registers, RISC vs. CISC, addressing modes, multithreading | `fee_architecture` | **THIN** — RISC/CISC, instruction cycle, pipelining/hazards, and multithreading are taught; the CPU register set (program counter, address/instruction registers) and instruction addressing modes are absent |
| 16.2 | Memory technologies (RAM/ROM families), cache organization and address-field sizing, average access time | `fee_memory`, `fee_mem_hierarchy` | **THIN** — ROM/RAM families, mapping styles (direct/fully/N-way), hit rate and effective access time are taught; cache address decomposition (tag/index/block-offset bit calculations) is absent — our only bit-field decomposition worked example is for virtual-memory pages |
| 16.3 | CPU building blocks, buses, interfacing, stored-program architectures | `fee_architecture`, `fee_io_interfacing`, `fee_memory` | **COVERED** — Von Neumann/Harvard, interrupts/DMA, serial buses, address/data bus widths (BIOS boot role is a trivial sub-gap) |

### Guide Ch. 17 — Software Engineering (pp. 410–413) → our `software-development.ts`

| Set | Concepts | Our topic(s) | Verdict |
|---|---|---|---|
| 17.1 | Complexity classes, Big-O reasoning | `fee_algorithms` | **COVERED** |
| 17.2 | Sorting algorithms, binary search, hashing | `fee_algorithms` (+`fee_data_structures` hashing) | **COVERED** |
| 17.3 | Arrays, linked lists, stacks, queues | `fee_data_structures` | **COVERED** |
| 17.4 | Tree traversal orders, graph search | `fee_data_structures` | **THIN** — BST operations are taught, and BFS/DFS are name-checked as stack/queue applications; in-order/pre-order/post-order traversal and BFS/DFS as actual algorithms are never taught |
| 17.5 | Lifecycle models, testing levels, box-testing terminology | `fee_sdlc` | **COVERED** — waterfall/V-model/spiral/Agile plus unit→acceptance testing and black/white-box terms (flowchart-symbol/pseudocode-tracing drill is a sub-gap, see notes) |

---

## Gap list (every MISSING and THIN item, with its home)

All gaps below absorb into **existing** topics per the "build on top of what we have" directive. No new topic id is strictly required (one borderline case flagged at the end).

### MISSING (3)

| # | Gap | Absorb into | What to add |
|---|---|---|---|
| G1 | Intellectual property (patent / trademark / copyright / industrial design / trade secret — which protects what) | `fee_licensure` (ethics-professional-practice.ts) | One section: the five IP categories, what each protects, typical engineering examples, registration symbols |
| G2 | Electrical workplace safety (NEC & NFPA 70E roles, safety grounding rationale, PPE / arc-flash categories, safety data sheets, physiological shock-current thresholds) | `fee_liability` (ethics-professional-practice.ts) | One safety section; distinguish safety grounding from the fault-analysis grounding already in `fee_power_faults` |
| G3 | JFET operation and biasing (structure, pinch-off, operating regions, bias calculations) | `fee_mosfet` (electronics.ts) — broaden scope to "FET circuits: JFET & MOSFET" | JFET section parallel to the existing MOSFET treatment |

### THIN (18 sets, 19 gap items — set 14.5 contributes two)

| # | Guide set | Gap (what's absent) | Absorb into |
|---|---|---|---|
| G4 | 1.1 | Law of sines / law of cosines; solving general logarithmic equations (beyond dB usage) | `fee_algebra_trig` |
| G5 | 1.3 | Arithmetic & geometric progressions and series-sum formulas | `fee_discrete_math` |
| G6 | 1.4 | Solid mensuration: sphere/cylinder/cone volumes and surface areas | `fee_analytic_geom` |
| G7 | 2.1 | Geometric mean, RMS of a data set, sample range | `fee_expected_values` |
| G8 | 2.4 | PDF/PMF/CDF formalism: definitions, total-area property, computing E[X]/Var from a given density or mass function | `fee_prob_dist` |
| G9 | 4.2 | Inflation-adjusted interest rate; capitalized cost (perpetual A/i) | `fee_tvm` |
| G10 | 4.3 | Break-even analysis; decision trees | `fee_cost_analysis` |
| G11 | 5.2 | Thermal-expansion strain calculations; specific heat / heat capacity | `fee_conductors` |
| G12 | 8.3 | FIR vs. IIR (non-recursive vs. recursive) digital-filter classification | `fee_z_transforms` |
| G13 | 9.8 | Voltmeter/ammeter loading-error analysis; explicit RTD linear model R(T) | `fee_electromech` |
| G14 | 13.1 | Signal-operations toolkit: time scaling/shifting of step, rectangular and triangular pulse models; impulse-scaling identity | `fee_time_domain` |
| G15 | 13.5 | PCM/PAM: quantization levels vs. word length, minimum bandwidth/clock reasoning; parity-bit and CRC error detection | `fee_digital_mod` |
| G16 | 14.5 | Port-scanning/reconnaissance basics (what a scan reveals) | `fee_net_security` |
| G17 | 14.5 | McCabe's cyclomatic complexity (control-flow graph nodes/edges metric) | `fee_sdlc` |
| G18 | 15.7 | PLA vs. PAL vs. ROM AND/OR-plane structure; reading outputs from a programmed plane | `fee_memory` |
| G19 | 15.9 | Combinational hazard classification (static-1 / static-0 / dynamic), JK race-around and master–slave remedy, propagation delay from a timing diagram | `fee_seq_logic` |
| G20 | 16.1 | CPU register set (program counter, memory-address register, instruction register, accumulator); instruction addressing modes | `fee_architecture` |
| G21 | 16.2 | Cache address decomposition: tag / index / block-offset bit calculations for direct-mapped and set-associative caches | `fee_mem_hierarchy` |
| G22 | 17.4 | Tree traversals (in-order / pre-order / post-order); BFS and DFS taught as algorithms | `fee_data_structures` |

### Minor sub-gaps inside COVERED sets (optional polish, not counted above)

- Integrating-factor method for variable-coefficient first-order ODEs → `fee_diffeq`
- Photoelectric effect (materials context) → `fee_semiconductors`
- Quantitative CMRR formula → `fee_opamp`
- POS/maxterm minimization alongside the existing SOP treatment → `fee_number_sys`
- Logarithmic decrement; damped resonant frequency → `fee_time_specs`
- Graphical convolution evaluation drill → `fee_time_domain`
- Flowchart symbols and pseudocode dry-run practice → `fee_algorithms`
- Routing-table construction exercise → `fee_osi_tcpip`
- BIOS boot role → `fee_io_interfacing`

### Sets our structure cannot absorb without a new topic

**None strictly.** The one borderline case is guide set 3.3 (safety): it is a distinct NCEES knowledge cluster (handbook pp. 13–33) large enough that a dedicated topic (e.g., `fee_safety` in `ethics-professional-practice.ts`) would be defensible; the recommendation above absorbs it into `fee_liability` to preserve the 93-topic structure.

---

## Scoreboard

| Guide chapter | Sets | COVERED | THIN | MISSING | Main our-section(s) |
|---|---|---|---|---|---|
| 1 Mathematics | 7 | 4 | 3 | 0 | Mathematics |
| 2 Probability & Statistics | 4 | 2 | 2 | 0 | Probability & Statistics |
| 3 Ethics & Prof. Practice | 3 | 1 | 0 | 2 | Ethics & Professional Practice |
| 4 Engineering Economics | 3 | 1 | 2 | 0 | Engineering Economics |
| 5 Electrical Materials | 2 | 1 | 1 | 0 | Properties of Electrical Materials |
| 6 Circuit Analysis | 6 | 6 | 0 | 0 | Circuit Analysis |
| 7 Linear Systems | 4 | 4 | 0 | 0 | Circuit Analysis, Linear Systems |
| 8 Signal Processing | 5 | 4 | 1 | 0 | Signal Processing, Linear Systems |
| 9 Electronics | 8 | 6 | 1 | 1 | Electronics, Eng. Sciences |
| 10 Power Systems | 6 | 6 | 0 | 0 | Power Systems, Circuit Analysis |
| 11 Electromagnetics | 5 | 5 | 0 | 0 | Electromagnetics |
| 12 Control Systems | 4 | 4 | 0 | 0 | Control Systems |
| 13 Communications | 6 | 4 | 2 | 0 | Communications, Signal Processing |
| 14 Computer Networks | 5 | 4 | 1 | 0 | Computer Networks |
| 15 Digital Systems | 9 | 7 | 2 | 0 | Digital Systems |
| 16 Computer Systems | 3 | 1 | 2 | 0 | Computer Systems |
| 17 Software Engineering | 5 | 4 | 1 | 0 | Software Development |
| **Total** | **85** | **64 (75%)** | **18 (21%)** | **3 (4%)** | |

**Reading of the scoreboard:** the core EE spine (circuits, linear systems, power, EM, controls) is fully covered set-for-set. The gaps concentrate in (a) the "professional" chapters — IP, safety, cost-estimation extras — which are cheap prose additions, (b) a handful of named techniques the guide drills that we never introduce (JFETs, PCM/PAM + error-detection coding, PLA/PAL planes, cache bit-fields, tree traversals, hazards/race timing, CPU registers/addressing modes), and (c) small formalism holes in probability (PDF/PMF/CDF) and math (progressions, solid mensuration, sine/cosine laws). Closing all 22 numbered gaps (G1–G22) touches 22 existing topics and creates zero new ones — fully compatible with the depth-expansion programme, which can fold these concepts in as the affected topics get raised to the ≥2000-word standard.
