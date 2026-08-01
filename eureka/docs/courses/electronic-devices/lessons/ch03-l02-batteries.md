# Batteries

<!-- covers: 3.2 -->

## How a cell works

A cell is a chemical charge pump: two electrodes of different materials in an
electrolyte, with reactions that push electrons out of one terminal and
accept them at the other. The chemistry pair fixes the cell voltage - about
1.5 V for alkaline, 1.2 V for NiMH, 3.0 V for lithium primary coin cells,
and 3.6 to 3.7 V nominal for lithium-ion. No construction trick changes a
chemistry's voltage; capacity and current capability are what construction
buys. A battery is cells in series (voltages add), parallel (capacity adds),
or both.

## Primary cells

Primary (single-use) chemistries trade shelf life against cost. Alkaline is
the general-purpose default: cheap, safe, good capacity, but its voltage
slopes downward through discharge and its internal resistance climbs in the
cold. Lithium primaries hold a flat voltage, weigh less, and keep for a
decade, which is why they back up real-time clocks and live in smoke alarms.
Zinc-carbon persists only because it is the cheapest thing that works.
Comparing primaries is a three-way trade: capacity for the size, flatness of
the discharge curve, and behavior at temperature extremes.

## Secondary cells

Rechargeables move the cost from replacement to charging discipline.

- **NiMH**: tolerant, moderate energy density, self-discharges (low-self-
  discharge variants fixed most of this), happiest charged gently.
- **Lead-acid**: heavy, cheap per watt-hour, delivers brutal currents, and
  wants to live fully charged - deep discharge is what kills it.
- **Lithium-ion / LiPo**: the energy-density winner, and the chemistry that
  demands respect. It must be charged with a proper constant-current,
  constant-voltage profile, never over-discharged, never punctured, and in
  any product it belongs behind a protection circuit. Use manufactured
  charger and protection modules; this course does not improvise them.

## Capacity and the honest datasheet

Capacity is quoted in ampere-hours: a 2 Ah cell notionally delivers 2 A for
an hour. Reality discounts that number - capacity shrinks at high discharge
rates, at low temperatures, and with age, which is why datasheets quote
capacity at a stated rate. Estimate runtime by dividing capacity by average
current, then take a healthy margin; a device that sleeps at microamps and
wakes at milliamps is sized by its duty cycle arithmetic, not its peak.

## Internal resistance, again

Module 2's model - an ideal source behind a small series resistance - is the
working tool for every battery question. Terminal voltage sags by I times r
under load; sag grows as the cell depletes; a battery tester is just a
voltmeter with a load resistor. Internal resistance also sets the ceiling on
deliverable current and turns into heat when you approach it, which is one
more reason high-rate packs specify their limits and protection circuits
enforce them.
