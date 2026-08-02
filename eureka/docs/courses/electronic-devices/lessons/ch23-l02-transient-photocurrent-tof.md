# Transients, Time-of-Flight, and the Rest of the Photoconductive Toolkit

<!-- covers: 23.5, 23.6, 23.7, 23.8 -->

## Switch-on and switch-off transients

Turn the light on and the photocurrent does not jump to its steady value; turn
it off and it does not vanish. Both transients are data.

**Switch-on.** The photocurrent rises toward its steady state on a timescale
set by how long it takes the trap distribution to fill. In a clean crystalline
material with few traps the rise is fast and roughly exponential with the
carrier lifetime. In a disordered material the rise is slow and stretched over
decades of time, because shallow traps fill first and progressively deeper ones
follow. The shape of the rise is therefore a map of the trap distribution
being filled from the top down.

**Switch-off.** The decay is usually the more informative half. A single
exponential decay indicates recombination through one dominant channel, and its
time constant is the lifetime. A **power-law decay**, straight on a
log-log plot and spanning many decades of time, is the signature of dispersive
transport through an exponential distribution of traps: carriers are being
released from progressively deeper states, so there is no single characteristic
time. The exponent of the power law relates directly to the width of the trap
distribution relative to kT.

Two practical uses:

- **Lifetime measurement** in device-quality material, where the decay
  constant after switch-off is the recombination lifetime that sets solar cell
  and detector performance.
- **Persistent photoconductivity**, where the conductivity stays elevated for
  minutes, hours or longer after illumination stops. This happens when there is
  a barrier separating the excited carriers from the states they must return
  to, either a spatial barrier at an interface or a lattice relaxation barrier
  as in the DX centres of aluminium gallium arsenide. It is a nuisance in
  detectors, because the device remembers its previous exposure, and it is a
  clear diagnostic of a specific defect physics.

The main experimental cautions are that the light source must switch faster
than the phenomenon you are studying, and that the measurement circuit's own RC
time constant must not be the thing you are measuring. Both traps are easy to
fall into and both produce clean-looking exponentials with no physical meaning.

## Transient photocurrent spectroscopy

Formalize the switch-off decay and it becomes a spectroscopy of gap states.

Excite the sample with a short light pulse, then record the current decay over
as many decades of time as the instrumentation allows, typically from
nanoseconds to seconds. Because thermal emission from a trap at energy E below
the band edge happens at a rate proportional to exp(-E/kT), each moment in the
decay corresponds to a particular trap depth. Time is energy, on a logarithmic
scale.

Analysis converts the current-against-time curve into a density of states
against energy, using the relation between observation time and the
corresponding demarcation energy. Repeating the experiment at several
temperatures shifts the accessible energy window and lets the spectra be
stitched together into a broad map of the gap.

The complementary relationship with modulated photocurrent from the previous
lesson is worth being explicit about. Modulated photocurrent works in the
frequency domain and is well suited to steady-state conditions and to moderate
depths; transient photocurrent works in the time domain and reaches the fast,
shallow states that the frequency method cannot follow. They are Fourier
counterparts of the same information, and where they disagree the disagreement
usually points at an assumption about capture cross-sections or about which
carrier dominates.

## Time-of-flight measurement of drift mobility

Of all the methods in this module, time-of-flight is the one that measures a
single quantity cleanly, and that quantity is the drift mobility.

The experiment is direct. Take a sandwich structure, semiconductor between two
electrodes, with at least one electrode transparent. Apply a bias. Fire a very
short, strongly absorbed light pulse at the transparent electrode, so all the
carriers are generated in a thin sheet near that surface. One carrier type is
immediately collected at the near electrode; the other drifts across the whole
thickness under the field. Record the current while it crosses.

For a non-dispersive material the current is roughly constant while the sheet
of carriers drifts, then drops when the sheet reaches the far electrode. That
drop time is the **transit time** t_T, and the mobility follows from geometry
alone:

    mu = d^2 / (V * t_T)

where d is the sample thickness and V the applied bias. No assumption about
carrier density, no calibration, no contact-injection subtleties. This is why
time-of-flight is the reference method for drift mobility in insulating and
low-mobility materials: amorphous semiconductors, organic semiconductors,
photoconductors for radiation detection, and the selenium and lead oxide layers
used in x-ray imaging plates.

For **dispersive transport**, common in disordered materials, the picture
changes in an instructive way. Carriers are repeatedly trapped and released,
so the sheet does not stay a sheet; it spreads enormously as it drifts. The
current then shows no plateau at all, only two power-law regimes on a log-log
plot with a change of slope at the transit time. Recognizing that kink is how
the transit time is extracted, and the two slopes give the dispersion
parameter, which relates to the width of the trap distribution. The resulting
mobility is field-dependent and thickness-dependent, which is not an artefact:
in dispersive transport the mobility genuinely is not a material constant, and
quoting it without the field and thickness is meaningless.

Requirements to get it right: the dielectric relaxation time of the material
must be longer than the transit time, otherwise the space charge redistributes
and screens the field; the generated charge must be small compared with the
charge on the electrodes, otherwise the carrier packet distorts its own field;
and the light pulse must be short compared with the transit.

## Related photoconductive techniques

Several further methods share the same underlying idea and are worth knowing
by what they add.

**Photomixing and dual-beam techniques** add a second light source, one steady
and one modulated, so that the trap occupancy is set by one beam and probed by
the other. This decouples the state-filling from the measurement and is what
makes the modulated and constant-photocurrent methods quantitative.

**Photo-Hall.** Perform a Hall measurement (module 18) under illumination. It
separates the photo-generated carrier density from the mobility, which
steady-state photoconductivity alone cannot do, since that measures only the
product. It is difficult in low-mobility materials because the Hall voltage
becomes very small, but where it works it is definitive.

**Surface photovoltage.** Measure the change in surface potential under
illumination, contactlessly, with a vibrating capacitive probe. The dependence
of the signal on photon energy gives the minority-carrier diffusion length and
the bandgap, and the technique is entirely non-destructive, so it is used for
in-line lifetime monitoring on production silicon wafers.

**Microwave photoconductance decay.** Instead of contacting the sample,
measure the reflected microwave power, which depends on conductivity. After a
laser pulse, the decay of reflected microwave power tracks the excess carrier
decay. This is the standard contactless lifetime measurement for silicon
wafers and solar cell precursors, precisely because it needs no contacts and
therefore does not perturb the surface it is measuring.

**Photocapacitance and optical deep-level spectroscopy**, which combine
illumination with the junction capacitance methods of module 36 to reach deep
states that thermal emission alone cannot empty on a practical timescale.

## How to choose among them

A short decision guide, since the value of this module is knowing which
instrument answers which question:

- Want the **mobility-lifetime product** of a film quickly, with contacts?
  Steady-state photoconductivity, and record the intensity exponent while you
  are there.
- Want the **defect density** of a thin film? Constant photocurrent method,
  cross-checked with photothermal deflection.
- Want the **minority-carrier diffusion length** in a thin film? Steady-state
  photocarrier grating.
- Want the **density of gap states against energy**? Modulated photocurrent for
  the deeper window, transient photocurrent for the shallower and faster one,
  and insist that they agree.
- Want the **drift mobility** of a low-mobility material? Time-of-flight, and
  state the field and thickness with the number.
- Want a **lifetime on a production wafer without touching it**? Microwave
  photoconductance decay or surface photovoltage.

The common thread is that photoconductive methods are the natural choice when
the material is too resistive, too thin or too disordered for the conventional
electrical methods of module 36, which is exactly the situation for the
amorphous and thin-film materials of modules 40, 41 and 46.
