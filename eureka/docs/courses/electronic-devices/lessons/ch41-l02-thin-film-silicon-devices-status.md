# Thin-Film Silicon: Devices, Material Developments and Current Status

<!-- covers: 41.4, 41.5, 41.6 -->

## Device applications of thin-film silicon

Thin-film silicon carries several large industries, and in most of them the
consumer has never heard of it.

**Thin-film transistors for displays.** This is by far the largest application
by area of semiconductor ever manufactured. Every active-matrix liquid crystal
display has one amorphous silicon transistor per subpixel acting as a switch
that holds the pixel voltage between refreshes. The requirements suit the
material exactly: the transistor needs to switch a small capacitance, so a
mobility around 1 cm^2/(V s) is sufficient; it needs very low off-current, which
a wide-gap, midgap-Fermi-level material provides naturally; and it must be
manufacturable over square metres of glass at low temperature and low cost,
which plasma deposition does better than anything else.

The material's limits appear when the requirements rise. OLED displays drive
each pixel with a *current* rather than switching a voltage, which needs higher
mobility and, more importantly, a threshold voltage that does not drift under
continuous bias. Amorphous silicon's bias-stress instability (module 40) makes
that difficult, so OLED and high-refresh backplanes moved to **low-temperature
polycrystalline silicon**, made by laser-crystallizing an amorphous film, which
gives mobility above 100 cm^2/(V s) at the cost of grain-boundary-driven
non-uniformity, or to **amorphous oxide semiconductors** such as indium gallium
zinc oxide, which give around 10 cm^2/(V s) with excellent uniformity and very
low off-current. The oxide route now dominates large high-resolution panels, and
it is covered in module 56.

**Photovoltaics.** Amorphous silicon cells are built as p-i-n structures, with
carriers collected by drift across the intrinsic absorber rather than by
diffusion, because diffusion lengths are short. Single-junction stabilized
efficiencies reach roughly 10 percent, tandem and triple-junction structures
using germanium alloying or microcrystalline bottom cells reach the low to
mid teens. The advantages are very low material usage, deposition on flexible
and lightweight substrates, better temperature coefficient than crystalline
silicon, and better performance in diffuse light.

The honest commercial position is that thin-film silicon photovoltaics **lost**.
Crystalline silicon module prices fell far faster than anyone forecast, driven
by scale and by manufacturing improvement, and the efficiency gap plus the
Staebler-Wronski penalty left thin-film silicon without a cost advantage. Most
production lines closed. The technology survives in niches where flexibility,
weight or low-light performance matter, and its ideas persist inside crystalline
technology, which is the next point.

**Heterojunction solar cells.** This is where amorphous silicon is genuinely
winning right now, and it is a nice reversal. Deposit a very thin, few-nanometre
intrinsic amorphous silicon layer on a crystalline silicon wafer before the
doped contact layer. The amorphous layer passivates the crystalline surface
superbly, because it satisfies the surface bonds without introducing a
recombination-active interface. Surface recombination velocity drops
dramatically, open-circuit voltage rises above 740 mV, and cell efficiencies
exceed 26 percent. The silicon heterojunction cell, and its relatives using
passivating contacts, is among the highest-efficiency commercial silicon
technology. The role of the amorphous material here is not as an absorber but as
a passivation layer, and it is very good at it.

**Image sensors and detectors.** Amorphous silicon photodiodes deposited over a
readout array give large-area x-ray detectors for medical and industrial
imaging, usually with a scintillator converting x-rays to visible light. The
material's ability to cover large areas uniformly is the deciding property.

**Other roles**: the drum coatings in some laser printers, position sensors,
and a range of large-area sensing applications.

## Recent material developments

Several developments have kept this field moving, and they cluster around the
two persistent problems: light-induced degradation and low mobility.

**Microcrystalline and nanocrystalline silicon.** Grown at high hydrogen
dilution, it has higher mobility, absorbs further into the red because its gap is
closer to crystalline silicon's, and shows little Staebler-Wronski degradation.
It became the bottom cell of the micromorph tandem, pairing an amorphous top
cell for blue light with a microcrystalline bottom cell for red. The costs are a
much lower absorption coefficient, requiring layers of a micrometre or more and
therefore much longer deposition, and sensitivity to oxygen contamination through
its porous grain boundaries.

**Protocrystalline growth**, at the edge of the amorphous-to-microcrystalline
transition, giving amorphous material with measurably better light stability.

**Very-high-frequency and other high-rate deposition** methods, aimed at the
rate-versus-quality trade described in the previous lesson.

**Hot-wire (catalytic) CVD**, which decomposes silane on a hot filament rather
than in a plasma, avoiding ion bombardment entirely and producing films with
lower hydrogen content and, in some reports, better stability.

**Alloys** with germanium to narrow the gap and with carbon or oxygen to widen
it, used for the graded and tandem structures.

**Passivating contact stacks** built on the heterojunction idea, including thin
tunnelling oxide with doped polysilicon, which have become the mainstream
high-efficiency crystalline silicon technology.

**Amorphous oxide semiconductors**, which are not silicon but are the direct
successor in the thin-film transistor role and which inherited the deposition
infrastructure. Their advantage is a fundamentally different conduction band,
made of spherically symmetric metal s orbitals that overlap well even in a
disordered arrangement, so mobility does not collapse with disorder the way it
does in a covalent tetrahedral network. That is a genuinely different physical
mechanism and it is why the oxides broke through the mobility ceiling that
amorphous silicon could not.

## Where thin-film silicon stands

An honest assessment, since this is a technology whose trajectory reversed.

**Won and holds.** The switching transistor in liquid crystal displays, by area
the largest semiconductor application in existence, though it is being eroded at
the high end by oxide semiconductors. Large-area x-ray imaging panels. Surface
passivation in high-efficiency crystalline silicon cells, which is a growing
role rather than a declining one.

**Lost.** Thin-film photovoltaics as a mainstream module technology, to
crystalline silicon on cost. This was not a technical failure of the material;
it was a competitor improving faster.

**Being displaced.** High-performance display backplanes, to
low-temperature polysilicon and to amorphous oxides.

**The lasting intellectual contributions** are worth naming, because they outlive
the applications:

- That a **disordered semiconductor can be a usable electronic material** at all,
  once its coordination defects are passivated. That was not obvious and it
  opened the whole field of large-area electronics.
- **Hydrogen passivation** as a general principle, now applied from MOS
  interfaces to polycrystalline solar cells to defect engineering in
  crystalline silicon.
- **Plasma deposition** as a route to high-temperature chemistry on
  low-temperature substrates, which underpins essentially all large-area and
  flexible electronics (module 46).
- The **characterization toolkit** of module 23, developed largely for this
  material and now applied to organic semiconductors, perovskites and every
  other disordered system.
- **Metastability** as a phenomenon to be measured under operating stress rather
  than assumed away, a lesson that the perovskite photovoltaic field has been
  relearning.

The pattern is one this course has seen before: a material that fails to hold its
headline application can leave behind methods and understanding that matter more
than the application did.
