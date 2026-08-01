# Linear Voltage Regulators

<!-- covers: 11.1, 11.2 -->

## The idea

A linear regulator is an automatic series resistor: a pass transistor,
servoed by an internal error amplifier against a voltage reference, drops
exactly enough voltage to hold the output constant. It is Module 8's
feedback applied to power - clean, simple, and thermodynamically blunt: the
dropped voltage times the load current becomes heat. Efficiency is Vout /
Vin; regulating 12 V down to 3.3 V wastes 72 percent, and Module 2's
thermal arithmetic sizes the heat sink.

## The parts

**Fixed three-terminal regulators** - the 78xx (positive) and 79xx
(negative) families - are the classic: in, ground, out, plus the datasheet
capacitors on both sides for stability. **Adjustable** parts like the LM317
regulate 1.25 V between output and adjust pin, so two resistors program
any output: Vout = 1.25 (1 + R2/R1). All need **headroom** - dropout
voltage, ~2 V for classics - between input and output. **LDOs** (low-
dropout regulators) reduce that to tenths of a volt with a different pass
structure, at the price of pickier stability: many specify their output
capacitor's ESR range, so the Module 3 capacitor lesson becomes a
correctness issue, not a preference.

Ratings to read: maximum input voltage, dropout at your current, quiescent
current (what the regulator itself drinks - microamps for battery-friendly
LDOs, milliamps for classics), and the thermal limits that internal
protection (current limit, thermal shutdown) enforces when arithmetic is
ignored.

## Standard applications

The regulator application recipes recur everywhere. Post-regulation: a
switcher does the efficient bulk conversion, an LDO cleans its ripple for
analog and RF loads - the standard partnership. Local regulation: one
regulator per board section stops shared-supply coupling. Current source:
an LM317 with one resistor holds 1.25 V across it, sourcing a fixed
current - the LED driver of Module 5. Boosted regulators wrap a pass
transistor around a small regulator for more amps. Reverse-protection and
sequencing details - the input diode, the output that must not sit above
the input - come from the datasheet's application section, which for
regulators is unusually worth reading. When the waste heat offends, the
next lessons switch instead of drop.
