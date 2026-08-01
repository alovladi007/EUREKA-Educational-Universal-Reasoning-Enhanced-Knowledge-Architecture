# Thyristors, Transient Suppressors, and Integrated Circuits

<!-- covers: 4.4, 4.5, 4.6 -->

## Thyristors: latching switches

A thyristor (SCR) is four alternating layers that behave like a switch with
commitment: a gate pulse turns it on, and it stays on - gate ignored -
until current falls below a holding level. On AC that reset arrives every
half-cycle, which is why SCRs and their bidirectional sibling the **triac**
own AC power control: fire later in each half-cycle, deliver less of it -
the lamp dimmer's principle (with di/dt snubbing and RFI filtering doing
the unglamorous work). A **diac** is a gateless breakover device used to
sharpen triac triggering. In DC circuits the latch is a liability -
nothing resets it - and MOSFETs won that territory. Vocabulary that
matters: holding current, gate trigger current, and dV/dt rating (a fast
edge can false-trigger a thyristor with no gate signal at all).

## Transient voltage suppressors

Real environments deliver spikes: kickback, static discharge, nearby
lightning. Suppressors are sacrificial specialists that clamp fast and
absorb the joules. **TVS diodes** are avalanche diodes built for surge -
picosecond response, chosen by standoff voltage just above the rail and by
peak pulse power; unidirectional for DC lines, bidirectional for signals
that swing. **MOVs** (metal-oxide varistors) absorb big mains-side surges
and age with each hit. **Gas discharge tubes** handle brutal energy but
fire slowly, so serious protection is layered: GDT or MOV takes the bulk,
series impedance slows the remnant, TVS clamps what reaches the
electronics. Placement rule: protect at the connector, before the fragile
parts, with a short fat path to ground - a suppressor behind long thin
traces protects mostly itself.

## Integrated circuits

An IC is transistors by the thousand to billion, patterned onto one die -
the doping story industrialized. What a designer needs is the packaging
and the conventions. Packages: DIP for breadboards; SOIC, QFP, QFN, BGA in
shrinking, less hand-solderable order - breakout boards exist precisely to
adapt them (Module 16). Pin 1 is marked by dot or notch and counting runs
counterclockwise from it, viewed from above.

Reading an IC datasheet is a skill: absolute maximum ratings are cliff
edges, not operating targets; recommended operating conditions are the
contract; electrical characteristics hold only under stated conditions.
Every supply pin gets its 100 nF ceramic neighbor - Module 3's decoupling
recipe becomes law here. Unused inputs get tied, never floated (CMOS
inputs drift and oscillate). Analog, digital, power, and mixed-signal
families all follow these same house rules, and the rest of this course is
largely a tour of what the families can do.
