# Semiconductor Technology: Doping and the Junction

<!-- covers: 4.1 -->

## Making silicon useful

Pure silicon is a mediocre conductor: each atom shares its four valence
electrons with four neighbors, leaving few carriers free. **Doping** changes
everything. Add a five-valent impurity (phosphorus) and the spare electron
wanders freely - **n-type** material, electrons as majority carriers. Add a
three-valent impurity (boron) and the missing bond becomes a **hole**, a
mobile positive vacancy - **p-type**. Both remain electrically neutral;
doping changes who carries, not net charge. Parts per million of dopant
change conductivity by orders of magnitude, which is the whole trick of the
industry: conductivity you can pattern.

Temperature matters oppositely to metals, as Module 2 flagged: heat frees
more carriers, resistance falls, and a hot semiconductor conducts more - the
root of thermal runaway in bipolar parts.

## The pn junction

Join p to n and the story of all semiconductor devices begins. Electrons
near the junction diffuse into the p side and annihilate holes; what remains
is a thin **depletion region** stripped of carriers, with fixed ionized
dopants creating a built-in field - about 0.6 to 0.7 V of barrier in
silicon.

**Forward bias** (p positive) shrinks the barrier; past the threshold,
current grows exponentially with voltage. **Reverse bias** widens the
depletion region and only a tiny leakage flows - until **breakdown**, where
current avalanches. Breakdown is destructive only if power is; controlled,
it becomes the Zener diode's feature.

That asymmetry - conduct one way, block the other - is the primitive from
which diodes, transistors, and every chip are built. The depletion region
also behaves as a voltage-controlled capacitance, which matters in fast
circuits and gives the varactor its job.

## Reading a junction's limits

Every junction device shares a datasheet vocabulary: forward voltage at a
stated current, maximum reverse voltage, maximum current set by heat, and
junction temperature limits (silicon's ~150 C, from Module 2's thermal
resistance arithmetic). Power devices tie their tab to the die precisely so
that arithmetic can be improved with a heat sink.
