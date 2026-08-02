# The Hall Effect, High-Field Transport, and Impact Ionization

<!-- covers: 18.9, 18.10, 18.11 -->

## The Hall effect: carrier sign and carrier density

Conductivity gives you the product n*mu. To design anything you need the two
factors separately, and the Hall effect is how you get them.

Pass a current I along a bar in the x direction and apply a magnetic field B
perpendicular to it, in z. Each moving carrier feels a Lorentz force
q(v x B), which pushes it sideways in y. Charge piles up on one side of the
bar until the transverse electric field it creates exactly balances the
magnetic force. That transverse voltage is the **Hall voltage**:

    V_H = I * B / (n * q * t)

where t is the sample thickness. Rearranged, the **Hall coefficient**
R_H = 1/(n q) gives the carrier density directly. Measure the conductivity on
the same sample and you get mobility from mu = sigma * R_H.

Two things make this measurement uniquely valuable.

**The sign of V_H gives the sign of the carrier.** Electrons and holes are
deflected to the same side of the bar (they move in opposite directions *and*
carry opposite charge, and the two sign flips cancel in the deflection but not
in the accumulated charge), so the polarity of the Hall voltage tells you
whether conduction is by electrons or by holes. Historically this was the
decisive experimental evidence that positive carriers are real in some
materials, and it remains the routine way to confirm that a doped layer came
out n-type or p-type.

**It does not require knowing the geometry precisely** if you use the van der
Pauw configuration, which works on an arbitrarily shaped flat sample with four
contacts on its perimeter. That is why Hall measurement is the default
characterization of a new semiconductor film. Module 36 covers the practical
measurement, including the artefacts.

Two honest caveats. First, the simple formula assumes a single carrier type
with a single mobility. When both electrons and holes conduct, their
contributions partly cancel and R_H becomes a weighted combination that can
even change sign with temperature; interpreting it then requires a two-carrier
model. Second, the mobility you extract this way, the **Hall mobility**,
differs from the conductivity mobility by a Hall scattering factor of order
one (typically 1.0 to 2.0), because the two average over the energy-dependent
scattering time differently. Reporting a Hall mobility as though it were the
drift mobility is a common and quietly wrong habit.

## Transport in high electric fields

Everything so far assumed drift velocity is proportional to field. That holds
only while the energy a carrier gains between collisions stays small compared
to its thermal energy. Push the field up and it stops holding, which matters
because a 1 V supply across a 20 nm channel is a field of 5 x 10^7 V/m.

As the field rises, carriers gain enough energy between collisions that their
average energy exceeds the lattice temperature. They become **hot carriers**,
with an effective temperature above that of the crystal. Once a carrier's
energy reaches the optical phonon energy (about 63 meV in silicon), it can
shed energy by emitting an optical phonon, and this channel is very efficient.
The result is that additional field energy goes into phonon emission rather
than into more drift, and the drift velocity **saturates**:

    v_sat is about 10^5 m/s in silicon

Mobility, defined as v/E, therefore falls at high field. This is not a defect
of the material; it is a hard ceiling. Velocity saturation is why transistor
current stops rising linearly with gate overdrive in short channels, why
device speed does not improve as fast as gate length shrinks, and why the
saturation velocity of a material is quoted alongside its mobility as a figure
of merit.

Some materials do something more dramatic. In gallium arsenide and several
other III-V compounds the conduction band has a low-energy valley with light,
fast electrons and a higher-energy valley with heavy, slow ones. At low field
electrons sit in the light valley. Raise the field past a threshold and they
gain enough energy to transfer into the heavy valley, where they move more
slowly. Average drift velocity therefore *decreases* as field increases over
that range: **negative differential mobility**. A material with a region of
negative differential resistance is unstable against forming travelling
high-field domains, which is the Gunn effect, and it is used deliberately to
build microwave oscillators with no resonant circuit at all.

Hot carriers also cause reliability problems. A carrier with several
electron-volts of energy that reaches the gate dielectric of a transistor can
be injected into it and trapped, shifting the threshold voltage permanently.
Hot-carrier degradation was one of the main reasons supply voltages were
scaled down alongside dimensions.

## Impact ionization and avalanche multiplication

Push the field higher still and a carrier can accumulate more than the bandgap
energy before it scatters. When it then collides with the lattice, it can
promote a valence electron across the gap, creating a new electron-hole pair
and losing that energy itself. This is **impact ionization**.

The new carriers are themselves accelerated by the same field, so they can
ionize in turn. One carrier becomes two, two become four: **avalanche
multiplication**. The multiplication factor M rises steeply with field and
diverges at the breakdown field, which is where the device can no longer
sustain the voltage.

The rate is described by an ionization coefficient, the number of pairs
generated per unit distance travelled, which depends roughly exponentially on
the inverse of the field. Electrons and holes generally have different
coefficients, and the ratio between them matters: when one carrier ionizes far
more readily than the other, the avalanche is better behaved and quieter, and
when both ionize equally the feedback loop between them makes the process
noisy. This ratio is a primary material selection criterion for avalanche
photodiodes, where you want gain without excess noise.

Impact ionization appears in three guises across electronics, and it is worth
recognizing all three as the same physics:

- **A failure mechanism.** Avalanche breakdown sets the maximum reverse
  voltage of a diode and the maximum drain voltage of a transistor. Wide-gap
  materials such as silicon carbide and gallium nitride have much higher
  breakdown fields, roughly ten times silicon's, because it takes more energy
  to create a pair across a wider gap. That single fact is why a 1200 V SiC
  device can be about a hundred times thinner than a silicon one of the same
  rating, and therefore much lower in on-resistance. This is the physical
  basis of the wide-bandgap power electronics discussed in module 39 and in
  the earlier power-supply module.
- **A designed function.** Avalanche and Zener diodes clamp voltage on
  purpose. Avalanche photodiodes and single-photon avalanche detectors use
  the multiplication as internal gain, turning one absorbed photon into a
  measurable pulse. Impact-ionization avalanche transit-time diodes generate
  microwave power.
- **A parasitic in ordinary operation.** Even below breakdown, modest
  multiplication in the high-field drain region of a transistor generates a
  substrate current. That current is routinely used as a monitor of hot
  carrier stress during reliability testing, because it tracks the same
  energetic-carrier population that damages the gate dielectric.

Note the tension that runs through the whole subject: a narrow bandgap gives
you a sensitive infrared detector and a low turn-on voltage, and it also gives
you low breakdown voltage and high leakage. A wide gap gives you high voltage
and hot operation, and it costs you carrier density and easy doping. There is
no free choice, only a choice matched to the job.
