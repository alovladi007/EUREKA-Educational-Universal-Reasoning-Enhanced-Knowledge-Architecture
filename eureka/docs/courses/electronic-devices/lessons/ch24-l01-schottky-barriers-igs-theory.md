# Schottky Barriers: What Is Measured, and Why the Simple Theory Fails

<!-- covers: 24.1, 24.2, 24.3 -->

Every semiconductor device reaches the outside world through a metal contact.
Whether that contact rectifies or conducts freely is decided at the interface,
by physics that took decades to sort out and that still limits contact
resistance in advanced devices. This module is about what actually happens
when a metal meets a semiconductor.

## What the measured barrier database shows

The textbook prediction is the **Schottky-Mott rule**. Bring a metal of work
function phi_m against an n-type semiconductor of electron affinity chi, let
the Fermi levels line up, and the barrier to electron flow should be

    phi_B = phi_m - chi

This has an appealing corollary: choose a metal with a high work function and
you get a high barrier; choose a low one and you get an ohmic contact. Barrier
height should vary one-for-one with metal work function, giving a slope of 1
when the two are plotted against each other.

The measured database says otherwise, and the discrepancy is the whole subject.

Across dozens of metals on silicon, barrier heights vary by only a few tenths
of an electron-volt while metal work functions span more than 2 eV. The slope
is roughly 0.05 to 0.1 instead of 1. The Fermi level at the interface sits
nearly fixed regardless of which metal is used: it is **pinned**. On gallium
arsenide the pinning is even stronger, with barriers clustering near 0.8 eV for
almost any metal, which for many years made a simple ohmic contact to n-type
GaAs a genuine engineering problem.

The pinning is not universal, and where it varies it varies systematically.
Define the slope parameter S as the derivative of barrier height with respect
to metal work function. Then:

- **Covalent semiconductors** (silicon, germanium, gallium arsenide) have small
  S, meaning strong pinning.
- **Ionic wide-gap compounds** (many oxides, some II-VI materials) have S
  approaching 1, meaning the simple rule works reasonably well.
- The transition between the two correlates with the **electronegativity
  difference** between the constituent atoms, and therefore with the ionicity
  of the bonding.

There is a second regularity worth noting. For a given semiconductor, the sum
of the n-type barrier and the p-type barrier for the same metal is close to
the bandgap. That is what you expect if the Fermi level sits at one particular
energy in the gap and the two barriers are measured from opposite band edges.
It is strong evidence that pinning is a property of the semiconductor's
interface states rather than a property of the metal.

A methodological caution that matters when reading the literature: barrier
heights are measured in several ways (current-voltage fitting,
capacitance-voltage extrapolation, internal photoemission, and photoelectron
spectroscopy), and the methods do not always agree on the same sample.
Current-voltage fitting is biased low by any lateral inhomogeneity, because the
current preferentially flows through the lowest-barrier patches, so it reports
the minimum rather than the mean. Capacitance methods average over the area and
report something closer to the mean. A quoted barrier without a stated method
is only approximately meaningful, and disagreements between methods on the same
sample are direct evidence of an inhomogeneous interface.

## Interface-induced gap states and electronegativity

The explanation that organizes this data is that the interface has its own
electronic states, and those states hold the Fermi level.

The physical origin is clean. Inside the semiconductor's bandgap there are no
propagating states. At the interface with a metal, however, the metal's
electron wavefunctions do not stop abruptly at the last atomic plane; they
decay into the semiconductor over a few tenths of a nanometre. Those
evanescent tails constitute a continuum of states at energies inside the
semiconductor's gap, localized at the interface: **interface-induced gap
states**. They are an intrinsic consequence of putting the two materials in
contact, not a consequence of contamination or damage, which is why they cannot
be cleaned away.

These states have a mixed character. Deep in the gap near the valence band they
are bonding-like and behave as donors; near the conduction band they are
antibonding-like and behave as acceptors. The energy where the character
changes over is the **branch point** or charge neutrality level. If the Fermi
level sits above the branch point, the acceptor-like states fill and acquire
negative charge; below it, the donor-like states empty and acquire positive
charge. Either way, the resulting interface charge produces a dipole that
pushes the Fermi level back toward the branch point.

That negative feedback is the pinning. The interface behaves like a very large
capacitance in the band-lineup problem: changing the metal changes the applied
"voltage" but the interface charge absorbs it, and the band positions barely
move.

The theory then makes a quantitative prediction. Write the barrier as

    phi_B = phi_CNL + S * (X_m - X_s)

where phi_CNL is the barrier that would result with the Fermi level exactly at
the branch point, X denotes electronegativity, and S is the slope parameter.
The claim is that S is not a free parameter but is determined by the dielectric
response of the semiconductor. A material that screens strongly, meaning one
with a high dielectric constant and a narrow gap, allows the interface dipole
to do more work and gives a small S. A material that screens weakly, meaning
one that is ionic and wide-gap, gives S near 1. Empirically S correlates with
the optical dielectric constant in exactly this way.

The picture is therefore: **the branch point sets where the Fermi level wants
to sit, and the dielectric screening sets how firmly it is held there**. The
metal's identity contributes a correction whose size is S.

## Testing the theory against experiment

Three independent tests are worth knowing, because they are what raised this
from a plausible story to the standard account.

**Barrier heights against branch-point energies.** Branch points can be
computed from band structure alone, with no reference to any metal. Plotting
measured pinning positions against calculated branch points across many
semiconductors gives a good correlation over a wide range of materials. That
the correlation uses a purely bulk-computed quantity to predict an interface
property is the strongest single piece of evidence.

**Slope parameters against dielectric screening.** The predicted relation
between S and the optical dielectric constant is borne out across covalent and
ionic semiconductors, capturing the transition from strongly pinned to
Schottky-Mott-like behaviour.

**Heterojunction band offsets.** The same branch-point idea predicts band
line-ups between two *semiconductors*, not only between a metal and a
semiconductor: align the two branch points and the offsets follow. Those
predictions agree reasonably with measured offsets, which is a demanding test
because it is a different class of interface entirely.

Where the theory is incomplete, and it is worth being straight about this:

- **Real interfaces are not abrupt.** Metals react with semiconductors, forming
  silicides, arsenides or intermixed layers, sometimes at room temperature.
  The relevant interface is then between the semiconductor and the reaction
  product, not the deposited metal, and predicting which phase forms is a
  separate materials problem.
- **Inhomogeneity is common.** Real barriers vary laterally by a hundred
  millivolts or more across an interface, from grain-to-grain variation in
  metal orientation, from local strain, or from patchy reaction. Since current
  depends exponentially on barrier height, a small low-barrier patch carries a
  disproportionate share, producing the ideality factors above 1 and the
  apparent temperature dependence of barrier height that are routinely observed.
- **Defects contribute too.** Interface defect states from damage during
  deposition, from lattice mismatch, or from unsatisfied bonds add to the
  intrinsic gap states. On a well-prepared interface they are a correction; on
  a damaged one they can dominate.
- **Fermi-level pinning is not literally absolute.** Careful interface
  engineering does move barriers, which is the entire content of the next
  lesson.

The honest summary is that the intrinsic-gap-state picture explains the broad
regularities (why pinning happens at all, why it correlates with ionicity, why
the branch point predicts it) while the last few tenths of an electron-volt on
any specific interface depend on chemistry, reaction and morphology that must
be measured rather than predicted. That is a normal state of affairs for
interface science, and it is why module 34 on surface analysis sits where it
does in this course.
