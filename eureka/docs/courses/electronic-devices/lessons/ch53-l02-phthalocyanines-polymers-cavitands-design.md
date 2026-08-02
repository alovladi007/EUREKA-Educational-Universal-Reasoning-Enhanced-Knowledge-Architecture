# Phthalocyanines, Polymers, Cavitands, and Designing a Sensor Material

<!-- covers: 53.4, 53.5, 53.6, 53.7 -->

## Phthalocyanine and porphyrin sensors

Porphyrins and phthalocyanines are large planar aromatic macrocycles with a
central cavity that holds a metal ion. Nature uses this architecture for
haemoglobin and chlorophyll, which is a strong hint that it is good at binding
small molecules selectively.

**Why they work as sensors.** Three properties combine:

1. **The central metal is a specific binding site.** Small molecules with lone
   pairs, ammonia, nitrogen oxides, hydrogen sulphide, coordinate directly to the
   metal ion. Which molecules bind, and how strongly, depends on which metal is
   in the centre, so **changing the metal changes the selectivity** without
   changing anything else about the material. Cobalt, copper, zinc, iron, lead
   and free-base variants all give measurably different response spectra, and an
   array of them is an immediate route to pattern-based discrimination.
2. **The aromatic ring system is a semiconductor.** Binding an electron-accepting
   molecule such as nitrogen dioxide withdraws charge from the ring and increases
   the hole concentration, raising the conductivity of the p-type film by orders
   of magnitude. The recognition event is transduced directly by the same
   molecule that does the recognizing, with no separate transducer chemistry
   required.
3. **They are exceptionally stable.** Phthalocyanines are thermally stable above
   400 degrees C, chemically inert, and photostable, which is why they are also
   used as industrial pigments. That stability is unusual among organic
   electronic materials and it is why these are the organic sensing materials
   most likely to survive real deployment.

**How they are used.** Evaporated thin films, Langmuir-Blodgett films where
substituted derivatives are deposited as ordered monolayers, or solution-cast
films of soluble substituted variants. Transduction is usually chemiresistive,
sometimes by field effect in an organic transistor, sometimes optically since the
absorption spectrum shifts on binding.

**Their strongest performance** is against nitrogen dioxide and ozone at parts per
billion, which is a genuinely useful range for air quality, and against ammonia
and hydrogen sulphide.

**Their weaknesses**, stated honestly: response and especially recovery are slow
at room temperature, because the binding to the metal centre is strong, which is
the sensitivity-reversibility trade in its clearest form. Moderate heating, 50 to
150 degrees C, speeds recovery at the cost of sensitivity. Films are also prone
to baseline drift as the morphology changes and as strongly bound species
accumulate.

## Polymeric sensing layers

Polymers are the workhorses of organic sensing because they are cheap, easy to
deposit over any surface by spin or spray coating or printing, and endlessly
modifiable by chemistry.

**Conducting polymers** (module 52), principally polypyrrole, polyaniline and
polythiophenes. Their conductivity depends on their doping level, and analytes
change it: a reducing gas such as ammonia de-dopes polyaniline and lowers its
conductivity, an oxidizing gas does the reverse, and protonation changes
polyaniline's conductivity by orders of magnitude, making it an excellent pH and
acid-gas sensor. They work at room temperature, which is their main advantage
over metal oxides, and they drift and degrade with humidity and oxygen exposure,
which is their main disadvantage.

**Insulating polymers as sorbent layers**, used with a gravimetric or capacitive
transducer. Here the polymer does not conduct at all; it absorbs vapour and
swells, and the transducer reports the mass or permittivity change. Selectivity
comes from the polymer's **solubility parameter**: a vapour partitions into a
polymer of similar polarity and hydrogen-bonding character. Because polymers can
be chosen across a wide range of these parameters, an array of half a dozen
different polymers on a set of resonators gives a response pattern that
discriminates broad classes of vapours. This is the classic "electronic nose"
architecture, and it works reasonably for class discrimination and poorly for
identifying a specific compound in a complex mixture.

**Composite chemiresistors**, in which carbon black or metal nanoparticles are
dispersed in an insulating polymer just above the percolation threshold (module
18). When the polymer absorbs vapour it swells, the filler particles separate,
and the resistance rises steeply because conduction near percolation is
exponentially sensitive to particle separation. This turns a mechanical swelling
into a large electrical signal, works at room temperature, costs almost nothing,
and gives the same class-level selectivity as the sorbent polymer it is made
from. It is a good example of using a percolation transition as an amplifier.

**Molecularly imprinted polymers**, where the polymer is cross-linked around a
template molecule which is then removed, leaving cavities complementary in shape
and functional group placement to the template. This is synthetic molecular
recognition, aiming at antibody-like selectivity with polymer robustness. It
works well for some targets and less well for others, the main difficulties being
heterogeneous binding site quality and slow mass transport into the rigid matrix.

**Hydrogels and ion-selective membranes**, which incorporate the ionophores of
the previous lesson into a plasticized polymer membrane. This is how commercial
ion-selective electrodes are actually constructed, and it is one of the largest
real applications of molecular recognition in analytical chemistry.

## Cavitand receptors

**Cavitands** are rigid, bowl-shaped or enclosed molecules with a permanent
cavity, designed so that the cavity's size, depth and chemical lining match a
target molecule. They are the most explicitly designed of the recognition
materials, and they represent the strongest form of the shape-selectivity idea.

The families include calixarene-derived cavitands with the rim bridged to make
the cavity rigid, resorcinarenes, cucurbiturils, and fully closed carcerands and
hemicarcerands that encapsulate a guest completely.

**What rigidity buys.** A flexible receptor pays an entropic penalty when it
organizes around a guest, and it can adapt its shape to accommodate the wrong
guest, which costs selectivity. A pre-organized rigid cavity pays that penalty
during synthesis rather than during binding, so binding is stronger and far more
discriminating. Cavitands can distinguish between molecules differing by a single
methyl group, and between isomers of the same molecular formula, which no
sorbent polymer can approach.

**Where they are used.** Coatings on gravimetric and optical transducers for
volatile organic compound detection, particularly where isomer discrimination
matters; recognition layers in sensor arrays where their sharp selectivity
complements the broad response of polymers; and in separation science more
broadly.

**Their limits.** Synthesis is elaborate and expensive, which is a genuine barrier
to any high-volume product. The binding-versus-recovery trade is at its most
acute here, since a deep enclosing cavity releases its guest slowly. And a
receptor optimized for a target in clean air can be swamped by an abundant
interferent that fits reasonably well, since selectivity is a ratio of binding
constants and a thousand-fold excess of a moderately-binding species defeats a
hundred-fold selectivity.

## Designing a sensor material

Bringing module 53 together as a design procedure.

**1. Specify the problem completely before choosing chemistry.** Target,
concentration range, matrix (what else is present, and at what concentration),
humidity and temperature range, required response time, required lifetime,
allowable power and cost. Most sensor failures in the field trace to a
specification that omitted the matrix or the humidity.

**2. Choose the recognition strategy from the selectivity requirement.**

- Broad class discrimination is enough: metal oxide or sorbent polymer array.
- A specific ion in solution: ionophore in a membrane, which is a solved problem.
- A specific small gas molecule: metallo-macrocycle with the metal chosen for
  that molecule, or an electrochemical cell, or an optical absorption
  measurement if size and cost allow.
- A specific organic molecule among structurally similar ones: cavitand or
  imprinted polymer, accepting cost and slow recovery.
- A biological target: biological recognition, meaning antibody, enzyme or
  aptamer, accepting the stability limitations that come with it.

**3. Choose the transducer to match the signal the recognition produces.** If
binding changes charge, use chemiresistive or field effect. If it changes mass,
use gravimetric. If it changes optical properties, use optical. Mismatching these
is a common source of insensitivity in otherwise good chemistry.

**4. Assume you will need an array.** Very few single sensors are selective
enough for a real matrix. An array of imperfectly selective elements with pattern
recognition routinely outperforms any one of its members, and it degrades
gracefully when one element drifts. Design for the array from the start rather
than trying to perfect a single element.

**5. Design the reference and the calibration in.** A sensor that drifts is
usable if it can be referenced; one that cannot be referenced is not. Common
approaches are a matched blind element that responds to temperature and humidity
but not the analyte, periodic zeroing against clean air, and modulating a
parameter such as temperature so the response is a pattern rather than a level.

**6. Test in the real matrix, at the real humidity, over the real duration.** A
sensor characterized only in dry nitrogen with a single analyte has not been
characterized. Humidity cross-sensitivity and long-term drift are the two
failure modes that dominate field deployments, and neither appears in a
short clean-gas test.

The connecting idea with the rest of the course is that sensing is where
**molecular chemistry meets solid-state transduction**, and the discipline that
matters most is honest characterization. A sensitivity figure without a
selectivity figure, a detection limit without a matrix, or a response without a
recovery time are all incomplete claims, and they are common ones.
