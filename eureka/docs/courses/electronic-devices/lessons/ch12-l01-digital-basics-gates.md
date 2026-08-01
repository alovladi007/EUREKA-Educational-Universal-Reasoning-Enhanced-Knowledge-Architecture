# Digital Basics and Logic Gates

<!-- covers: 12.1, 12.2 -->

## Two levels and why

Digital electronics quantizes voltage into two ranges - low and high, 0
and 1 - and buys noise immunity with the space between: anything below
Vil reads 0, above Vih reads 1, and the forbidden middle is crossed
quickly or not at all. Positive logic assigns high = 1; the assignment is
convention, and datasheets occasionally invert it (active-low pins wear
overbars or trailing #).

**Number systems** follow: binary for the machine, hexadecimal as its
human shorthand (one hex digit per four bits), BCD where decimal digits
travel separately. Signed integers use two's complement - negate by
inverting and adding one - so the same adder serves both signs. Serial
versus parallel transmission, and the bit/byte/word vocabulary, complete
the ground floor.

## The gate alphabet

Six shapes generate everything. **NOT** inverts. **AND** outputs 1 only
when all inputs are 1; **OR** when any is. **NAND** and **NOR** are their
inversions - and each is **universal**: any function builds from NANDs
alone (or NORs alone), which is why they are the cheapest and fastest
members of every family. **XOR** outputs 1 on difference - the parity and
addition primitive.

**Boolean algebra** manipulates them: De Morgan's laws (invert, swap
AND/OR) convert between forms and explain the bubble-pushing on
schematics; truth tables enumerate small functions exhaustively;
Karnaugh maps minimize by eye up to four variables. A function specified
as a truth table becomes hardware as sum-of-products - AND rows into an
OR - which is exactly the structure programmable logic industrializes.

Real gates come packaged (the 74-series quad NAND being the canonical
IC), with the house rules of Module 4 attached: decouple, tie unused
inputs, and note that a gate's unused sections still consume and must
still be terminated. Timing begins here too: **propagation delay**
(nanoseconds per gate) accumulates along paths, and glitches - momentary
wrong outputs while unequal path delays race - preview why the sequential
lesson adds a clock.
