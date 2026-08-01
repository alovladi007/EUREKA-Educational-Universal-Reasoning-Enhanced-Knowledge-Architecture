# Photodetectors: From Photoresistors to Phototransistors

<!-- covers: 5.4, 5.5, 5.6, 5.7 -->

## Photoresistors

A photoresistor (LDR) is a semiconductor film whose carrier population -
and thus resistance - depends on illumination: megohms dark, kilohms in
light. Wired into a divider it turns light into voltage with two resistor
values and no subtlety. Its vices are slowness (tens of milliseconds),
loose tolerance, memory of recent light history, and cadmium chemistry
that regulation has chased out of new designs. For "is it dark yet" it
remains the one-line answer.

## Photodiodes

A photodiode is a junction run in reverse: absorbed photons create carrier
pairs, and the depletion field sweeps them out as a current proportional to
light over many decades - a linear, fast, calibratable sensor. Two
operating styles: **photovoltaic** (no bias, low noise, slower) and
**photoconductive** (reverse-biased, wider depletion, faster, at the price
of leakage called dark current). The photocurrent is microamps, so the
partner circuit is Module 8's transimpedance amplifier - current in,
voltage out, gain set by one resistor. PIN structures widen the depletion
layer for speed; that is the fiber-optic receiver's diode.

## Solar cells

A solar cell is a large-area photodiode operated as a source: photocurrent
through the junction's own barrier yields about 0.5-0.6 V per silicon
cell, stacked in series for useful voltages. Its I-V curve has a knee, and
usable power peaks at that knee - the maximum power point - which moves
with illumination and temperature; real installations track it
electronically (MPPT). Panel arithmetic is honest: open-circuit voltage
and short-circuit current bracket the curve, power is quoted at standard
illumination, and partial shade collapses a series string, which is why
bypass diodes ride across cell groups.

## Phototransistors

A phototransistor is a BJT whose base is driven by light instead of a
terminal: photocurrent gets multiplied by beta, trading the photodiode's
linearity and speed for hundreds of times more current - enough to drive
logic or a small load directly. Darlington versions push sensitivity
further and speed lower. Most opto sensor modules - slotted interrupters,
reflective object sensors, IR receiver front ends - are an LED and a
phototransistor in one housing, and the design work is optical: keep
ambient light out (filters, modulation at 38 kHz for remotes) and set the
load resistor for the current the light actually delivers.
