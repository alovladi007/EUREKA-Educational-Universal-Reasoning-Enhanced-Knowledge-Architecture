# The Op-Amp: Concept and Theory

<!-- covers: 8.1, 8.2, 8.3 -->

## What it is

An operational amplifier is a differential amplifier with absurd gain: it
outputs the difference between its + and - inputs multiplied by a hundred
thousand or more. Used raw, that gain is useless - microvolts of input
difference slam the output to a rail. Used inside feedback, it becomes the
most versatile analog building block there is.

The water analogy that helps some readers: imagine a valve whose opening is
controlled by the level difference between two small sensing tubes, driving
a huge pump. The tubes sip almost nothing; the pump moves whatever the pipe
allows; and any plumbing that routes output back to a sensing tube makes the
pump hold the levels equal. That routing is the whole subject.

## The ideal model

Three idealizations carry ninety percent of op-amp analysis:

1. Infinite gain.
2. Infinite input impedance - the inputs draw no current.
3. Zero output impedance - the output drives what it must.

From these plus negative feedback follow the **two golden rules**: no
current enters the inputs, and the output does whatever is needed to hold
the two inputs at the same voltage. Every classic circuit is two
applications of Ohm's law wrapped around those rules.

## Why the rules work

Inside, a differential input stage steers current by the input difference,
gain stages multiply, and a push-pull output drives the load. None of that
detail is needed at design time; what matters is that gain is so large that
a vanishing input difference suffices for any output in range. Feedback
closes the loop: if the - input drifts below the +, the output rises, and
the feedback network lifts the - input back. Equilibrium is equality.

**Open-loop** behavior (no feedback) is a comparator: output slammed to one
rail or the other by the sign of the input difference - useful, and treated
later in this module. **Closed-loop** behavior is set by the feedback
network alone, which is the miracle: the wildly imprecise open-loop gain
cancels out, and two resistors define the circuit to their own tolerance.
That exchange - huge sloppy gain traded for modest exact gain - is the
deepest idea in analog electronics, and the next lesson spends it.
