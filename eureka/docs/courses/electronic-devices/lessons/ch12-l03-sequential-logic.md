# Sequential Logic: Flip-Flops, Counters, and Registers

<!-- covers: 12.6, 12.7, 12.8, 12.9 -->

## Memory from feedback

Cross-couple two NOR or NAND gates and the pair holds a bit: the **SR
latch**, digital electronics discovering state. Gate it with an enable
and it becomes transparent (the D latch); make it respond only to a clock
**edge** and it is the **D flip-flop** - the atom of synchronous design.
At each rising edge, Q takes D and holds it. The **JK** generalizes set/
reset/toggle; the **T** toggles - a divide-by-two per stage.

Synchronous design's contract: all flip-flops share a clock, and
combinational logic between them must settle within the period - **setup**
and **hold** times at each D input are the fine print, and violating them
risks metastability, the older cousin of Module 3's switch bounce. Which
is why bouncing buttons feed debouncers (an SR latch across a changeover
switch, an RC plus Schmitt, or firmware) before touching a clock input.

## Counters

Chain toggling stages and you count. **Ripple (asynchronous)** counters
clock each stage from the previous output - minimal hardware, accumulating
delay, momentary false codes as the ripple propagates. **Synchronous**
counters clock all stages together, decoding cleanly at speed. The
packaged variety: decade and binary counters, up/down parts, presettable
ones that load a value, and cascade outputs for wider counts. Frequency
division falls out free: every stage halves - the watch crystal's 2^15
chain from Module 10 lands here. Modulo-N by resetting at N, with the
one-period glitch that trick implies.

## Registers and bus discipline

A **register** is D flip-flops sharing a clock - a word of state.
**Shift registers** chain them Q-to-D: serial-in parallel-out (74HC595)
turns three microcontroller pins into unlimited outputs; parallel-in
serial-out (74HC165) does the reverse for inputs - the port-expansion
idiom of Module 13. Shift-with-feedback makes ring counters and LFSR
pseudo-random sequences.

**Three-state buffers, latches, and transceivers** manage shared wiring:
buffers isolate and strengthen, latch ICs (373/374 class) capture a bus
when addressed, transceivers (245 class) drive either direction with a
direction pin. The bus rules recap: exactly one driver enabled at a time,
pull-ups or bus-holds so floating never happens, and everything
referenced to a common ground - rules that scale from two chips on a
breadboard to every backplane ever built.
