# Active and Integrated Filters

<!-- covers: 9.8, 9.9 -->

## Why active

Add an op-amp and filters shed their passive limitations: no inductors at
audio frequencies, gain instead of loss, complex poles on demand, and an
output that drives the next stage without the loading negotiations of the
passive lesson. The costs are a supply, the op-amp's bandwidth budget
(GBW from Module 8 must comfortably exceed the filter's needs), and noise.

## The standard topologies

**Sallen-Key**: one op-amp (often as follower), two Rs, two Cs per
second-order section - simple, low sensitivity at low Q, the default for
Butterworth and Bessel stages. Equal-component designs set gain to fix Q;
unity-gain designs set component ratios instead.

**Multiple-feedback (MFB)**: inverting, one op-amp per section, better
behaved at higher Q and for band-pass sections; component spreads grow
with Q.

**State-variable**: three op-amps integrating and summing, delivering
low-pass, band-pass, and high-pass outputs simultaneously, with frequency
and Q tuned nearly independently - the flexible choice, and the biquad its
close cousin.

Higher-order filters cascade second-order sections (plus one first-order
for odd orders), each section carrying its assigned pole pair from the
design tables - in practice from filter-design software, which emits
component values for a chosen family, order, and cutoff. Build with the
capacitor classes that hold their value (C0G, film - the Module 3
lesson), because a filter is only as accurate as its parts.

## Integrated and sampled filters

**Switched-capacitor** filter ICs implement resistors as capacitors
toggled at a clock frequency: the filter's cutoff scales with the clock,
tunable over decades by changing one frequency. The price is clock
feedthrough and aliasing - they are sampled systems, so band-limit what
enters. Universal active-filter ICs package state-variable sections with
programmable everything; integrated anti-aliasing filters precede ADCs.
And increasingly, the honest answer is **digital**: sample cleanly (an
analog low-pass remains mandatory in front of the converter - aliasing
cannot be undone), then filter in firmware where poles cost multiply-
accumulates instead of matched capacitors. The analog module's role
narrows to the parts digital cannot reach: before the converter, after
the DAC, and wherever microvolts meet megohms.
