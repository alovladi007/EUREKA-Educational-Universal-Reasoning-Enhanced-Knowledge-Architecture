# The Electronics Laboratory

<!-- covers: 7.5 -->

## Instruments beyond the first two

A working lab grows in a known order. The **bench power supply** comes
first: adjustable voltage with an adjustable current limit, which turns
mistakes from smoke into a limit light - set the limit just above expected
draw before first power-up, always. Dual supplies serve op-amp work's
split rails; isolated channels stack in series safely.

The **function generator** provides stimuli: sine for frequency response
(the Bode habits from Module 2), square for testing edges and rise times,
triangle for linearity, plus DC offset and duty control. Its 50 ohm output
impedance is a Thevenin fact - into a 50 ohm load the displayed amplitude
halves, and the generator's menu setting for load impedance exists to keep
the numbers honest.

**Frequency counters**, **LCR meters** (measuring the real R, L, C and ESR
of Module 3's parts at stated test frequencies), **logic analyzers** for
many digital lines at once (the affordable USB class decodes I2C, SPI, and
serial - indispensable by Module 13), and a **thermal camera or IR
thermometer** for finding the hot part complete the shelf. The scope
remains the centerpiece; everything else feeds or checks it.

## The bench itself

Lay the bench out for the loop you actually run: build zone, test zone,
instruments within reach and their probes hanging strain-free. Anti-static
mat and wrist strap ground the handling area. Lighting and magnification
(a head visor or stereo microscope for surface-mount) prevent more faults
than any instrument finds. Storage discipline - labeled drawers for the
Module 3 component taxonomy, a spreadsheet or inventory app once drawers
multiply - converts a parts pile into a lab.

## Method

Instruments do not debug; the loop does. Predict what a node should show
(estimate first, from the theory module), measure it, and pursue the first
disagreement upstream - power rails before signals, DC before AC. Change
one thing at a time; write down what you changed. The lab notebook -
paper or digital - records schematics as-built, measurements, and the
dead ends, because the second time you meet a fault it should already be
solved. When a reading makes no sense, suspect the measurement before the
circuit: probe ground, meter mode, range, and the observer effect from the
sensors module apply at the bench daily. This method, plus Appendix B's
uncertainty honesty, is what turns a room of instruments into results.
