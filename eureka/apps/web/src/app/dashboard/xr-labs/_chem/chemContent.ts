// GENERATED FILE - do not edit by hand.
//
// Produced by scripts/gen_chem_content.py from OCTET's authored
// content. Triangle views, simulation scenarios and POE items are
// exported as written; every derived quantity (titration curves,
// equilibrium outcomes, proton environments, degrees of
// unsaturation, molecular ion masses) is computed by chem_core or
// RDKit at export time rather than retyped.
//
// Every POE item's answer key was checked against its own
// simulation before export. An item whose key disagreed with the
// physics would have failed the build rather than shipped.
//
// IR band positions are CITED, not computed: chem_core has no
// vibrational model, and inventing wavenumbers is exactly what the
// rest of this pipeline exists to prevent. Source is named in the
// script.

import type { PoeItem, Scenario, SpectrumSubject, TriangleView } from './contentTypes';

export const TRIANGLE_REVIEW_STATUS = 'pending';

export const TRIANGLE_VIEWS: TriangleView[] = [
  {
    node: 'GEN1.NOMENIONIC',
    course: 'GEN1',
    title: 'A formula that names a ratio, not a particle',
    macroscopic: 'A grain of table salt is a hard, brittle, colourless cube that melts at 801 degrees Celsius. Dry, it does not conduct electricity. Melt it or dissolve it in water and it conducts well. Strike the crystal and it cleaves along flat planes instead of denting.',
    particulate: 'There are no NaCl molecules in the grain. There is a repeating three dimensional grid in which every sodium ion is surrounded by six chloride ions and every chloride ion by six sodium ions, held by electrostatic attraction reaching out in every direction. The ions cannot move while the grid holds, which is why the dry solid does not conduct. Melting or dissolving frees them, and then it does.',
    symbolic: 'NaCl. Chemists call this a formula unit rather than a molecule, because it reports the ratio one sodium ion to one chloride ion in the lattice rather than the contents of any single particle. Polyatomic ions such as sulfate and nitrate are the exception inside this system: those really are groups of atoms bonded together that travel intact.',
    connector: 'The one to one ratio is the same ratio at all three levels: it is what a chemical analysis of the grain on the bench returns, it is what you would count in any large block of the grid, and it is exactly what the formula NaCl states.',
    pitfall: 'The specific confusion is reading NaCl as the description of one particle, so the learner pictures a sodium bonded to one particular chlorine and calls it a molecule of salt. There is no such pair to point at in the crystal. This is the one place early in the course where a formula does not name a particle, and the symbolic level actively encourages the wrong particulate picture because NaCl and CO2 look like the same kind of statement.',
    katex: '\\ce{NaCl(s) -> Na+(aq) + Cl-(aq)}',
    caption: 'Picture a checkerboard extended into three dimensions: larger chloride ions and smaller sodium ions alternating at every corner of a stack of cubes, with no line you could draw around any two of them to make a pair.'
  },
  {
    node: 'GEN1.MOLE',
    course: 'GEN1',
    title: 'Counting by weighing',
    macroscopic: 'A balance reads 18.02 grams of water in a weighing boat. That is a little over a tablespoon, something you could tip into your palm, and a balance is the only instrument in the room.',
    particulate: 'That sample holds about 6.022 x 10^23 individual water molecules. No instrument counted them. The count follows from the mass, because the average mass of one water molecule is known, and dividing the sample mass by it gives the number of particles. This is the same move a hardware store makes when it weighs 5000 washers rather than counting them.',
    symbolic: 'n = m / M, so n = 18.02 g divided by 18.02 g/mol = 1.000 mol. The mole is a fixed count, defined since 2019 as exactly 6.02214076 x 10^23 entities, and the molar mass M is the conversion factor between the balance reading and that count.',
    connector: 'The number 6.022 x 10^23 is one single count appearing three times: it is how many particles are sitting on the balance pan, it is how many objects a complete particulate drawing would have to show, and it is exactly what the symbol 1.000 mol stands for.',
    pitfall: 'The specific confusion is treating equal masses as equal counts, which quietly lets the symbol mol mean gram. 1.00 g of hydrogen gas is 1.00 / 2.016 = 0.496 mol and 1.00 g of oxygen gas is 1.00 / 32.00 = 0.0313 mol, so the same balance reading covers about sixteen times as many hydrogen molecules. The balance works at the macroscopic level, the mole counts at the particulate level, and molar mass is the only thing that connects them.',
    katex: '\\ce{H2O}:\\quad n = \\frac{m}{M} = \\frac{18.02\\ \\mathrm{g}}{18.02\\ \\mathrm{g/mol}} = 1.000\\ \\mathrm{mol}',
    caption: 'Picture the puddle magnified until single molecules show: bent three atom units, one oxygen with two hydrogens, tumbling past each other. Now imagine that picture repeated until there are six hundred thousand billion billion of them.'
  },
  {
    node: 'GEN1.EMPIRICAL',
    course: 'GEN1',
    title: 'What a formula counts, and what it leaves out',
    macroscopic: 'A bottle of acetic acid on the bench holds a clear liquid with a sharp smell that boils at 118 degrees Celsius and freezes at 16.6 degrees Celsius. Combustion analysis of a weighed sample returns the mass of carbon, hydrogen and oxygen it contained, and nothing else about it.',
    particulate: 'One molecule of that liquid holds exactly 2 carbon atoms, 4 hydrogen atoms and 2 oxygen atoms, joined in one specific arrangement: a methyl carbon carrying three hydrogens, bonded to a second carbon that carries two oxygens, one of which holds the fourth hydrogen. Every molecule in the bottle has that same count and that same arrangement.',
    symbolic: 'The molecular formula is C2H4O2, and the subscripts are the atom counts in one molecule. Divide those counts by their common factor of 2 and you get the empirical formula, CH2O, which reports only the ratio 1 carbon to 2 hydrogen to 1 oxygen.',
    connector: 'The count 2 carbon, 4 hydrogen and 2 oxygen is one count appearing three times: it is what combustion analysis of the liquid returns as mass fractions, it is what a single particle in the bottle actually holds, and it is what the subscripts in C2H4O2 state.',
    pitfall: 'The specific confusion is reading the empirical formula as the identity of a substance, which promotes a symbolic ratio into a macroscopic thing. CH2O is not a substance you can pour. Glucose, C6H12O6, reduces to CH2O as well, and it is a sweet white solid rather than a sharp smelling liquid. The formula does not fix the arrangement either: C2H6O is ethanol, a liquid boiling at 78 degrees Celsius, and it is also dimethyl ether, a gas at room temperature.',
    katex: '\\ce{C2H4O2}\\ \\text{(molecular)}\\quad \\ce{CH2O}\\ \\text{(empirical)}',
    caption: 'Picture one molecule as eight balls: a two carbon backbone, three hydrogens on the left carbon, and on the right carbon two oxygens with the last hydrogen attached to one of them.'
  },
  {
    node: 'GEN1.CONSERVATION',
    course: 'GEN1',
    title: 'The mass that seems to vanish',
    macroscopic: 'Heat 100.0 g of calcium carbonate in an open dish. The white solid left behind weighs 56.0 g, so the balance says 44.0 g has gone. Run the identical decomposition in a sealed flask on the same balance and the reading does not move at all.',
    particulate: 'Nothing was created or destroyed in either run. Every calcium, carbon and oxygen atom that started is still present at the end. In the open dish the carbon dioxide molecules drifted out of the dish and into the room, taking their share of the mass off the pan. In the sealed flask those same molecules are still inside, bouncing around above the solid, so the pan still carries them.',
    symbolic: 'CaCO3(s) -> CaO(s) + CO2(g). One calcium, one carbon and three oxygens on the left, and the same one, one and three on the right. The state labels (s) and (g) are the part of the notation that predicts which product can leave an open dish.',
    connector: 'The three oxygen atoms are the same three oxygen atoms in all three descriptions: they are part of the 100.0 g you weighed out, they are the particles that end up split between the solid residue and the escaping gas, and they are what the subscript 3 on the left and the 1 plus 2 on the right both count.',
    pitfall: 'The specific confusion is reading the drop from 100.0 g to 56.0 g as mass being destroyed. That is a macroscopic observation with no particulate event behind it. What happened is that a product crossed the boundary of the system you were weighing. Seal the system and the observation changes while the chemistry does not, which is the whole content of the demonstration.',
    katex: '\\ce{CaCO3(s) -> CaO(s) + CO2(g)}',
    caption: 'Picture the solid as a repeating grid of calcium ions and carbonate ions. On heating, each carbonate ion breaks into a linear CO2 molecule that leaves and an oxide ion that stays, and what remains is a tighter grid of calcium and oxide ions.'
  },
  {
    node: 'GEN1.BALANCE',
    course: 'GEN1',
    title: 'Coefficients count, subscripts identify',
    macroscopic: 'Burn hydrogen in oxygen and you get water, in a fixed ratio every time: 4.03 g of hydrogen gas consumes 32.00 g of oxygen gas and produces 36.03 g of water. Supply more hydrogen than that and the surplus is still hydrogen gas at the end.',
    particulate: 'Two hydrogen molecules and one oxygen molecule rearrange into two water molecules. The four hydrogen atoms and two oxygen atoms present at the start are the same six atoms present at the end, redistributed among different partners. No atom is added and none is removed, which is why the mass ratio cannot be negotiated.',
    symbolic: '2 H2 + O2 -> 2 H2O. The coefficients 2, 1 and 2 count how many of each substance take part. The subscript 2 inside H2 and inside H2O is part of what those substances are, and it is not adjustable.',
    connector: 'The four hydrogen atoms are the same four atoms in all three places: they arrive in the 4.03 g you weighed out, the particulate picture shows them changing partners, and the coefficient 2 in front of H2O is what makes the equation report the same four.',
    pitfall: 'The specific confusion is fixing a shortage by editing a subscript. The edit looks purely symbolic, one character on a page, but it silently swaps the particulate entity for a different one: writing H2O2 instead of H2O balances the oxygen count and changes the product from drinking water into hydrogen peroxide, which would sting a cut rather than quench thirst. A coefficient changes how many. A subscript changes what.',
    katex: '\\ce{2H2 + O2 -> 2H2O}',
    caption: 'Picture six balls in three pairs on the left: two dumbbells of paired hydrogen and one dumbbell of paired oxygen. On the right the same six balls are regrouped as two bent three atom units. Count either picture and you get four hydrogen and two oxygen.'
  },
  {
    node: 'GEN1.SOLUBILITY',
    course: 'GEN1',
    title: 'The solid that appears on mixing',
    macroscopic: 'Two clear colourless solutions are poured together and a bright yellow solid appears at once and settles. Filter it, dry it, and it weighs something. The liquid through the filter is clear again, and evaporating it leaves a different white solid behind.',
    particulate: 'Before mixing, each beaker holds ions moving independently through the water: lead(II) and nitrate ions in one, potassium and iodide ions in the other. On mixing, lead and iodide ions that collide stay together, because the attraction between them beats what the water can offer, and further ions dock onto that seed until the stack is large enough to fall. The potassium and nitrate ions never join anything and are still moving freely in the filtrate.',
    symbolic: 'Pb(NO3)2(aq) + 2 KI(aq) -> PbI2(s) + 2 KNO3(aq). The net ionic equation strips out the ions that did nothing and leaves only the event: Pb2+(aq) + 2 I-(aq) -> PbI2(s).',
    connector: 'The yellow solid on the filter paper, the growing lattice of alternating lead and iodide ions, and the (s) label on PbI2 are one event described three ways.',
    pitfall: 'The specific confusion is attributing the yellow solid to something the potassium or the nitrate did, because those ions are visible in the full symbolic equation and so look like participants. Swap potassium iodide for sodium iodide and the same yellow solid appears in the same amount, which is the test that shows they were only along for the ride. A second, purely symbolic slip is swapping partners and copying the old subscripts across, which gives PbI when lead\'s 2+ charge requires two iodides.',
    katex: '\\ce{Pb^2+(aq) + 2I^-(aq) -> PbI2(s)}',
    caption: 'Picture the moment of mixing as two clouds of separately drifting ions running into each other. Most collisions bounce apart. When a lead ion meets two iodide ions they stay together, and more ions stack onto that seed until the flake is heavy enough to sink.'
  },
  {
    node: 'GEN1.QUANTUMNUMBERS',
    course: 'GEN1',
    title: 'Sharp spectral lines from allowed states',
    macroscopic: 'Run an electric discharge through a tube of low pressure hydrogen and it glows pink. Send that light through a prism and it does not spread into a rainbow. It separates into a few sharp coloured lines at fixed wavelengths, including red at 656.3 nm and blue green at 486.1 nm, and the pattern is identical in every hydrogen tube ever built.',
    particulate: 'An electron in an atom cannot take any energy it likes. It occupies one of a discrete set of states, each addressed by four numbers: n sets the shell and most of the energy, l sets the shape, m_l sets the orientation of that shape in space, and m_s is one of two spin values, which is why an orbital holds exactly two electrons. An orbital is not a track the electron runs along. It is a region with a stated probability of containing the electron, and the familiar sphere and lobe drawings are surfaces enclosing roughly 90 percent of that probability, not pictures of an object.',
    symbolic: 'A state is written as the set (n, l, m_l, m_s), for example (2, 1, 0, +1/2) for one electron in a 2p orbital, with the letters s, p and d standing in for l = 0, 1 and 2. A line in the spectrum is the energy difference between two such states, and that difference fixes its wavelength.',
    connector: 'One energy gap is the same quantity in all three: the 656.3 nm red line you can see through the prism, the drop of an electron from the n = 3 state to the n = 2 state, and the difference between two allowed (n, l, m_l, m_s) addresses.',
    pitfall: 'The specific confusion is picturing the orbital as an orbit, a path the electron travels like a planet, which imports a macroscopic image into the particulate level where it does not hold. A 2p orbital has a flat plane through the nucleus where the probability of finding the electron is exactly zero, yet the electron is found in both lobes, which no continuous path could manage. The related error is reading the lobe drawing as the surface of a physical object rather than a probability boundary drawn at a conventional cutoff.',
    katex: '',
    caption: 'Picture a fog around the nucleus that is dense where the electron is likely and thin where it is not. For a 2s state the fog is spherical. For a 2p state it is two lobes on opposite sides of the nucleus with a plane of exactly zero density between them.'
  },
  {
    node: 'GEN1.IONICBOND',
    course: 'GEN1',
    title: 'Three solids, three ways of holding together',
    macroscopic: 'Three solids on a bench. Table salt is a brittle white crystal melting at 801 degrees Celsius that does not conduct dry and conducts once molten. Paraffin wax is soft, melts below 60 degrees Celsius and never conducts. A copper wire is malleable, melts at 1085 degrees Celsius and conducts cold.',
    particulate: 'In salt, the electronegativity gap between sodium (0.93) and chlorine (3.16) is large enough that the valence electron ends up essentially on the chlorine, and the resulting ions attract in every direction through a lattice. Complete transfer is a simplification: real ionic bonds keep some covalent character and the charge on each ion falls a little short of a whole unit. In wax, carbon and hydrogen differ by only 0.35, so electrons are shared inside discrete molecules and only weak forces hold one molecule to the next. In copper, the atoms release valence electrons into states spread over the whole piece of metal, so charge flows while the positive cores stay put.',
    symbolic: 'NaCl, a typical paraffin chain such as C25H52, and Cu. The three look like the same kind of statement and are not: only the middle one names a particle, the first names a lattice ratio and the last names a repeating array of atoms sharing one electron sea.',
    connector: 'The valence electron is the same electron in all three descriptions of the salt: its transfer is why the crystal is brittle and conducts only when molten, its new home on the chlorine is what the particulate picture shows, and its departure is what the plus and minus in Na+ and Cl- record.',
    pitfall: 'The specific confusion is reading NaCl as a molecule, because the symbolic level looks identical for salt and for wax while the particulate level does not. NaCl states a ratio in a lattice and C25H52 states the contents of one particle. The second confusion is treating the octet as the motive for the transfer, as though the sodium atom wanted a full shell. Sulfur hexafluoride is stable with twelve electrons around sulfur, so the octet is a pattern energetics summarise, not a desire particles have.',
    katex: '\\ce{NaCl(s)}\\quad \\ce{C25H52(s)}\\quad \\ce{Cu(s)}',
    caption: 'Picture three blocks. In the first, alternating charged spheres locked in a grid. In the second, long tangled chains lying loosely against each other with clear gaps between them. In the third, fixed positive cores sitting in a haze of electrons free to drift through the whole block.'
  },
  {
    node: 'GEN1.LEWIS',
    course: 'GEN1',
    title: 'An electron budget on paper',
    macroscopic: 'Water is a liquid at 25 degrees Celsius, boils at 100 degrees Celsius and dissolves table salt. Spectroscopy measures two identical O-H bonds 95.8 pm long with 104.5 degrees between them, and the two bonds are identical no matter how the sample was made.',
    particulate: 'Oxygen brings 6 valence electrons and each hydrogen brings 1, so eight electrons in four pairs have to be accounted for. Two pairs are shared, one with each hydrogen, and two pairs stay on the oxygen alone. Sharing is not literal joint ownership: the electrons are spread over both nuclei and are not evenly spread, and the Lewis pair is a bookkeeping model that gets the connectivity and the electron count right while saying nothing quantitative about where the density actually sits.',
    symbolic: 'H-O-H with two pairs of dots drawn on the oxygen. The budget is 2(1) + 6 = 8 valence electrons, spent as 4 in the two bonds and 4 in the two lone pairs. Exactly 8 in, exactly 8 out.',
    connector: 'The two lone pairs are the same two pairs in every description: they are why the measured H-O-H angle is 104.5 rather than 109.5 degrees, they are the two unshared pairs on the real particle, and they are the two pairs of dots you draw on the oxygen.',
    pitfall: 'The specific confusion is giving hydrogen an octet, because the rule was stated symbolically without its scope. Hydrogen has only a 1s orbital and is complete at two electrons, so lone pairs on the hydrogens in water would spend 12 electrons when the molecule has 8 to give. The deeper level error is treating the octet as the reason atoms bond rather than a pattern that energy accounting summarises: sulfur hexafluoride is a stable substance with twelve electrons around sulfur.',
    katex: '\\ce{H2O}:\\quad 2(1) + 6 = 8\\ \\text{valence electrons}',
    caption: 'Picture the oxygen at the centre with four clouds of charge around it pointing toward the corners of a tetrahedron. Two of those clouds end at a hydrogen nucleus. The other two end in nothing you could see, and those two take up the most room.'
  },
  {
    node: 'GEN1.VSEPR',
    course: 'GEN1',
    title: 'The domains you cannot see set the shape',
    macroscopic: 'Carbon dioxide and water are both a central atom with two atoms attached, and they behave nothing alike. CO2 is a gas that sublimes at -78.5 degrees Celsius and shows no dipole moment at all. Water is a liquid at room temperature that dissolves salt. Spectroscopy measures the O-C-O angle at 180 degrees and the H-O-H angle at 104.5 degrees.',
    particulate: 'The central atom\'s electron domains repel each other and settle as far apart as they can, where a domain is any group of electrons on that atom: one lone pair, one single bond, one double bond or one triple bond each count as exactly one. Carbon in CO2 has two domains and no lone pairs, so they point in opposite directions. Oxygen in water has four domains, two of them lone pairs, spread toward the corners of a tetrahedron. A lone pair is held by one nucleus instead of two, so it takes up more angular room and squeezes the remaining bond angles.',
    symbolic: 'AX2 for CO2, which gives linear at 180 degrees. AX2E2 for water, which gives bent, with the ideal tetrahedral 109.5 degrees compressed to the measured 104.5.',
    connector: 'The two lone pairs on oxygen are one and the same thing in all three: they are why water is a bent liquid that dissolves salt while CO2 is a linear gas, they are the two unshared domains in the particulate picture, and they are the E2 in the label AX2E2.',
    pitfall: 'The specific confusion is counting attached atoms instead of electron domains, which reads the shape off the symbolic formula rather than off the electron count. CO2 and H2O both show two attached atoms, so that count predicts one shape for both, and the measured angles are 180 and 104.5 degrees. The domains that decide the answer are the ones no formula shows.',
    katex: '\\ce{CO2}:\\ \\mathrm{AX_2}\\quad \\ce{H2O}:\\ \\mathrm{AX_2E_2}',
    caption: 'Picture balloons tied together at their necks. Two balloons point straight away from each other. Four splay to the corners of a tripod plus one, and if two of the four are fatter than the rest the two thin ones get pushed closer together.'
  },
  {
    node: 'GEN1.POLARITY',
    course: 'GEN1',
    title: 'Polar bonds that add to nothing',
    macroscopic: 'Water dissolves table salt and mixes with ethanol in any proportion. Hexane does neither. Water is a liquid boiling at 100 degrees Celsius, while carbon dioxide, with more than twice the molar mass, sublimes at -78.5 degrees Celsius. A dipole moment measurement returns 1.85 debye for water and exactly zero for carbon dioxide.',
    particulate: 'Each bond between different elements pulls electron density toward the more electronegative atom. In CO2 the gap is 3.44 - 2.55 = 0.89, so each C=O bond is genuinely polar, but the molecule is linear and the two pulls point in exactly opposite directions with equal size, so they sum to nothing. In water the gap is 3.44 - 2.20 = 1.24 and the molecule is bent at 104.5 degrees, so both pulls lie on the same side of the molecule and reinforce, leaving one net direction across the whole particle.',
    symbolic: 'An arrow along each polar bond, pointing at the more electronegative atom, and then the vector sum of those arrows. The sum is the dipole moment, written mu and measured in debye: 0 D for CO2 and 1.85 D for water.',
    connector: 'The vector sum is one quantity in all three: it is the 1.85 debye a measurement returns for water, it is the leftover pull once the two bond dipoles in the bent particle are added, and it is the resultant arrow you draw on the page.',
    pitfall: 'The specific confusion is deciding polarity from bond polarity alone, which reads the answer off the symbolic formula and skips the particulate geometry entirely. Every C=O bond in CO2 is more polar than a C-H bond, and the molecule still has a dipole moment of exactly zero, because linear geometry makes the two arrows cancel. Polar bonds are necessary for a polar molecule and are not sufficient.',
    katex: '\\ce{CO2}:\\ \\mu = 0\\ \\mathrm{D}\\quad \\ce{H2O}:\\ \\mu = 1.85\\ \\mathrm{D}',
    caption: 'Picture an arrow drawn along each bond. On the linear molecule they point away from the centre in exactly opposite directions and match in length, so the pair goes nowhere. On the bent molecule both point from a hydrogen up toward the oxygen and add into one longer arrow along the axis that bisects the angle.'
  },
  {
    node: 'GEN1.IDEALGAS',
    course: 'GEN1',
    title: 'Pressure as the drumming of particles',
    macroscopic: 'A sealed rigid steel cylinder of nitrogen sits on a bench with a gauge reading 1.00 atm at 25 degrees Celsius. Stand it in a boiling water bath at 100 degrees Celsius and the needle climbs to 1.25 atm. Nothing entered or left and the cylinder did not change size.',
    particulate: 'The gas particles fly in straight lines between collisions, and pressure is the summed force of their impacts on the wall divided by the wall area. Heating adds no particles. It makes each one faster, because average kinetic energy is proportional to absolute temperature, so impacts land harder and more often. The ideal gas model treats the particles as having no volume of their own and no attraction for each other, which is a good approximation at ordinary pressures and a poor one near condensation.',
    symbolic: 'PV = nRT, with R = 0.08206 L*atm/(mol*K). With V and n fixed, P/T is constant, so P2 = P1 x T2 / T1 = 1.00 atm x 373.15 K / 298.15 K = 1.25 atm.',
    connector: 'The absolute temperature is one quantity in all three: it is what the bath thermometer reports once converted to kelvin, it is proportional to the average kinetic energy of the particles striking the wall, and it is the T the equation multiplies.',
    pitfall: 'The specific confusion is putting the Celsius reading into the equation, which treats a scale with an arbitrary zero as though it measured the particulate quantity directly. At 0 degrees Celsius the law would then predict zero volume, meaning a balloon in a freezer collapses to nothing. Particle motion does not stop at 0 degrees Celsius. Only the kelvin scale puts its zero where the particulate picture puts it, 273.15 degrees lower.',
    katex: '',
    caption: 'Picture a box of tiny hard spheres, far apart compared with their own size, each moving in a straight line until it hits a wall or another sphere and bounces. Warming the box adds no spheres and changes no walls. It speeds every sphere up, so the drumming on the walls gets harder and more frequent.'
  },
  {
    node: 'GEN1.IMF',
    course: 'GEN1',
    title: 'What boiling actually breaks',
    macroscopic: 'Water boils at 100 degrees Celsius. Hydrogen sulfide, a heavier molecule from the same group of the periodic table, boils at -60 degrees Celsius. Turning one gram of water at 100 degrees Celsius into steam takes about seven times the energy it took to heat that gram from room temperature up to boiling.',
    particulate: 'Boiling separates whole molecules from one another and does not touch the bonds inside them. In water each molecule has a hydrogen bonded directly to oxygen, and that hydrogen is attracted strongly to a lone pair on a neighbouring molecule\'s oxygen, so each molecule is held by three or four such links at once on average. Hydrogen sulfide is polar too, but sulfur is much less electronegative and its lone pairs are more diffuse, so no comparable link forms and only weaker dipole and dispersion attractions remain.',
    symbolic: 'H2O(l) -> H2O(g), with an enthalpy of vaporisation of +40.7 kJ/mol. The formula H2O is unchanged across the arrow, and that is the notation stating that nothing inside the molecule changed.',
    connector: 'The intermolecular attraction is one quantity in all three: it is the 40.7 kJ/mol the kettle has to supply, it is the set of hydrogen bonds a molecule must be pulled out of, and it is the entire content of the arrow in H2O(l) -> H2O(g), because both sides of that arrow read the same.',
    pitfall: 'The specific confusion is thinking that boiling breaks the covalent bonds inside the molecule, which merges the intramolecular and intermolecular levels into one. Steam is still made of intact H2O molecules, not loose H and O atoms. Vaporising water costs about 41 kJ/mol while breaking one O-H bond costs about 463 kJ/mol, more than ten times as much, and the symbolic level says so plainly: the formula on both sides of the arrow is identical.',
    katex: '\\ce{H2O(l) -> H2O(g)}\\quad \\Delta H_{\\mathrm{vap}} = +40.7\\ \\mathrm{kJ/mol}',
    caption: 'Picture the liquid as molecules packed close, each tethered to three or four neighbours by a short link running from one of its hydrogens to a lone pair on a neighbouring oxygen. Boiling is one molecule getting enough speed to snap all its tethers at once and leave, with the network intact behind it.'
  },
  {
    node: 'GEN2.EQUILIBRIUM',
    course: 'GEN2',
    title: 'Constant reading, running reaction',
    macroscopic: 'Seal hydrogen and iodine vapour in a flask at 448 degrees Celsius. The purple colour fades over some minutes and then stops changing. Leave the flask a day and it looks the same. A colorimeter and a pressure gauge both hold steady, and the flask is neither cooling nor leaking.',
    particulate: 'Nothing has stopped. Hydrogen and iodine molecules are still colliding and forming HI, and HI molecules are still coming apart, at exactly matched rates, so the number of each species stays constant while individual molecules keep changing identity. Replace some of the iodine with a heavier isotope and it turns up distributed across both I2 and HI, which is the experiment showing the traffic never stopped.',
    symbolic: 'H2(g) + I2(g) <=> 2 HI(g), where the double arrow carries the whole idea, and K = [HI]^2 / ([H2][I2]) = 50.5 at 448 degrees Celsius. K is fixed at a given temperature no matter what amounts you started with.',
    connector: 'The constant colour is the same fact as the matched rates and the same fact as K: the colorimeter reading stops moving because iodine is consumed exactly as fast as it is produced, and that equality of rates is what pins the concentration ratio the number 50.5 reports.',
    pitfall: 'The specific confusion is reading the constant macroscopic reading as a stopped reaction, which replaces a dynamic particulate picture with a static one. Both directions are still running, at equal rates. A symbolic error follows from the same root: dropping an exponent when the stoichiometry is not one to one. That exponent is a particulate count of how many molecules take part, not a decoration on the formula.',
    katex: '\\ce{H2(g) + I2(g) <=> 2HI(g)}\\quad K = \\frac{[\\ce{HI}]^2}{[\\ce{H2}][\\ce{I2}]} = 50.5',
    caption: 'Picture the flask as a crowd where pairs keep forming and breaking. At any instant some collisions are making HI and others are tearing it apart, and the two counts per second are equal, so a snapshot an hour later holds the same mix of species but not the same individual molecules in them.'
  },
  {
    node: 'GEN2.LECHATELIER',
    course: 'GEN2',
    title: 'A colour that moves with temperature',
    macroscopic: 'Two sealed glass tubes hold the same mixture of nitrogen dioxide and dinitrogen tetroxide. Stand one in ice water and it fades to nearly colourless. Stand the other in hot water and it darkens to deep brown. Return both to room temperature and the colours go back to where they started.',
    particulate: 'Brown NO2 molecules pair up into colourless N2O4, and the pairs come apart again. Pairing releases about 57 kJ for every mole of N2O4 formed. Warming supplies the energy the reverse step needs, so more pairs break than form until the two rates match again at a mixture holding more single molecules. Cooling does the opposite. Neither particle changed. Only how many of each there are changed.',
    symbolic: '2 NO2(g) <=> N2O4(g), with a reaction enthalpy of -57.2 kJ/mol, and K = [N2O4] / [NO2]^2. Temperature is the one stress that changes the value of K rather than only the position.',
    connector: 'The proportion of paired to unpaired molecules is one quantity in all three: it is the depth of the brown your eye reads, it is the ratio of N2O4 to NO2 particles in the tube, and it is what the number K reports at that temperature.',
    pitfall: 'The specific confusion is believing that any stress which shifts the position also changes K. Injecting more NO2 darkens the tube at first and then drives the pairing forward, and Q settles back at precisely the same K. The reason is particulate: temperature changes the energy available to each step, while adding a reactant only changes how many particles are present. The related error is expecting a catalyst to shift the mixture. A catalyst lowers the barrier in both directions equally, so the tube reaches the same colour sooner rather than a different colour.',
    katex: '\\ce{2NO2(g) <=> N2O4(g)}\\quad \\Delta H = -57.2\\ \\mathrm{kJ/mol}',
    caption: 'Picture the tube as a mix of single bent three atom molecules that absorb blue light and so look brown, and paired ones joined nitrogen to nitrogen that absorb nothing visible. Warming changes neither particle. It changes the headcount of each.'
  },
  {
    node: 'GEN2.TITRATIONWEAK',
    course: 'GEN2',
    title: 'Where the curve goes vertical',
    macroscopic: 'Put 25.00 mL of 0.100 M acetic acid in a flask with a pH meter and add 0.100 M sodium hydroxide from a burette. For the first 20 mL the meter climbs slowly. Between about 24.9 and 25.1 mL it jumps several pH units in two drops. After that it flattens again. At 12.50 mL added the meter reads 4.76, and at 25.00 mL it reads about 8.7.',
    particulate: 'Each added hydroxide ion takes a proton from an acetic acid molecule and turns it into an acetate ion. Early on the flask holds plenty of both forms, and any added base is absorbed by converting one form into the other, which is why the pH barely moves. Half way, exactly half the acid molecules have been converted, so acid and conjugate base are present in equal numbers. Once the last acetic acid molecule is gone there is nothing left to absorb the next hydroxide, so the next drop moves the pH a long way.',
    symbolic: 'CH3COOH(aq) + OH-(aq) -> CH3COO-(aq) + H2O(l), one to one. At half equivalence [A-] = [HA], so the log term in pH = pKa + log([A-]/[HA]) is zero and pH = pKa = 4.76.',
    connector: 'The count of acetic acid molecules converted is one quantity in all three: it is what the burette measures out drop by drop, it is how many particles have handed over their proton, and it is what the one to one ratio in the balanced equation fixes.',
    pitfall: 'The specific confusion is equating the equivalence point with pH 7, which swaps a stoichiometric condition for a macroscopic reading. Equivalence means the moles of added base equal the moles of acid originally present. For acetic acid with sodium hydroxide that lands near pH 8.7, because what remains in the flask is acetate, a weak base sitting in water. The related error is thinking the indicator creates the equivalence point. Run the same titration with a different indicator and the equivalence volume is identical, and only the endpoint your eye catches moves.',
    katex: '\\ce{CH3COOH(aq) + OH^-(aq) -> CH3COO^-(aq) + H2O(l)}',
    caption: 'Picture the flask at four moments: all acid molecules and almost no acetate; then a roughly even mixture of the two at half way; then all acetate and no acid at equivalence; then acetate plus a growing surplus of free hydroxide. The vertical part of the curve is the narrow window between the third and fourth pictures.'
  },
  {
    node: 'GEN2.ENTROPY',
    course: 'GEN2',
    title: 'Heat that does not raise the temperature',
    macroscopic: 'An ice cube in a room at 20 degrees Celsius melts, and it never re-forms on its own. Melting one mole of ice absorbs 6.01 kJ from the surroundings, and a thermometer in the ice water holds at 0 degrees Celsius the entire time it is melting even though heat is flowing in.',
    particulate: 'In ice, each water molecule sits at a fixed site in an open hydrogen bonded framework and can only vibrate in place. In liquid water the molecules keep their hydrogen bonds but constantly break and remake them, so they translate and rotate as well. The number of distinguishable arrangements open to the same molecules at the same energy is vastly larger in the liquid. Entropy measures that spread of energy and matter over available arrangements. It is not untidiness in the everyday sense, and it carries units of J/(mol*K).',
    symbolic: 'H2O(s) -> H2O(l), for which delta S = 6010 J/mol divided by 273.15 K = +22.0 J/(mol*K). The second law is written for the universe: delta S(universe) = delta S(system) + delta S(surroundings) is positive for any spontaneous process.',
    connector: 'The 6.01 kJ per mole is one quantity read three ways: it is the heat the room loses while the thermometer refuses to show a temperature rise, it is the energy that lets each molecule leave its fixed site in the framework, and it is the numerator of the delta S you compute.',
    pitfall: 'The specific confusion is treating entropy as untidiness, a macroscopic visual impression, in place of a measured dispersal of energy and matter with units. A second confusion follows from the same root: assuming the system\'s own entropy must increase for a process to be spontaneous. Water freezing at -10 degrees Celsius has a negative delta S for the system and happens anyway, because the heat it dumps raises the entropy of the surroundings by more. The second law constrains the universe, not the beaker.',
    katex: '\\ce{H2O(s) -> H2O(l)}\\quad \\Delta S = \\frac{6010\\ \\mathrm{J/mol}}{273.15\\ \\mathrm{K}} = +22.0\\ \\mathrm{J/(mol\\cdot K)}',
    caption: 'Picture ice as molecules pinned at the corners of an open hexagonal cage, each jiggling in place and never swapping neighbours. Picture liquid water as the same molecules at almost the same spacing, still linked, but constantly trading partners and sliding past one another.'
  },
  {
    node: 'GEN2.GALVANIC',
    course: 'GEN2',
    title: 'Sending the electrons the long way round',
    macroscopic: 'Drop a zinc strip into blue copper sulfate solution and it goes dark as copper plates onto it, the blue fades, and the beaker warms. Now split the same reaction into two beakers joined by a wire and a salt bridge. A voltmeter across the metals reads 1.10 V, the zinc strip loses mass, the copper strip gains it, and a small motor in the circuit turns.',
    particulate: 'The same electron transfer happens in both setups. In the single beaker a zinc atom at the surface hands two electrons straight to a copper ion that has drifted against it, and the transfer is over within one collision, so the energy leaves as heat. In the cell the two half reactions sit in different beakers, so those two electrons cannot reach a copper ion except through the wire. Electrons never cross the salt bridge. Ions move through it instead, cancelling the charge that would otherwise build up as zinc ions enter one beaker and copper ions leave the other.',
    symbolic: 'Zn(s) + Cu2+(aq) -> Zn2+(aq) + Cu(s), split into Zn(s) -> Zn2+(aq) + 2 e- at the anode and Cu2+(aq) + 2 e- -> Cu(s) at the cathode. E(cell) = E(cathode) - E(anode) = 0.34 - (-0.76) = 1.10 V, and delta G = -nFE with n = 2 and F = 96485 C/mol.',
    connector: 'The two electrons are the same two electrons in all three descriptions: they are the current the voltmeter and the motor respond to, they are what one zinc atom hands to one copper ion, and they are the 2 e- that appear on opposite sides of the two half equations and cancel when the halves are added.',
    pitfall: 'The specific confusion is thinking electrons travel through the salt bridge, which puts a particulate flow in the wrong place while the macroscopic reading still appears to make sense. Remove the wire and the current stops even though the salt bridge is still there, so the wire is the electron path. Remove the salt bridge and the cell stops too, because charge builds up in each beaker within moments, which is what the bridge is actually for.',
    katex: '\\ce{Zn(s) + Cu^2+(aq) -> Zn^2+(aq) + Cu(s)}\\quad E^\\circ_{\\mathrm{cell}} = +1.10\\ \\mathrm{V}',
    caption: 'Picture the two beakers side by side. On the left, zinc atoms peel off the strip as ions into solution and leave two electrons behind in the metal. Those electrons run along the wire to the right, where copper ions meet them at the copper surface and stick as neutral atoms. In the tube joining the solutions, negative ions drift left and positive ions drift right, and no electron enters that tube.'
  },
  {
    node: 'ORG1.ORBITALS',
    course: 'ORG1',
    title: 'One bond that turns, one that cannot',
    macroscopic: 'Cis and trans alkenes are separable compounds. You can put them in two bottles, they have different physical properties, and warming one gently does not convert it into the other. Alkanes do not behave that way: nothing separates one rotational form of ethane from another, however carefully you try. And when an alkene reacts, the reaction happens at the double bond while the rest of the carbon and hydrogen framework comes through the reaction unchanged.',
    particulate: 'Two orbitals that overlap combine into two molecular orbitals, one bonding and lower in energy with density piled between the nuclei, one antibonding and higher with a node there. Head-on overlap along the line joining the nuclei gives a sigma bond, which is cylindrically symmetric about that line, so turning one end relative to the other leaves the overlap untouched. Sideways overlap of two parallel p orbitals gives a pi bond, with density above and below that line and a nodal plane containing it, and turning about the bond tears that overlap apart. Building molecular orbitals by adding and subtracting atomic orbitals is an approximation rather than a claim about the molecule: it is used because it is tractable and because it gets the count and the ordering of the levels right, not because the electrons remember which atom they came from.',
    symbolic: 'Every line in a structure is one sigma bond. The second line of a double bond is a pi bond and the third line of a triple bond is a second pi bond perpendicular to the first. Degrees of unsaturation counts rings plus pi bonds, so a formula fixes how many of those second and third lines the drawing has to carry.',
    connector: 'The pi bond is the same object in all three: it is why cis and trans alkenes sit in separate bottles, it is the sideways overlap of two parallel p orbitals that rotation would destroy, and it is the second line in C=C and one unit of the degrees of unsaturation.',
    pitfall: 'The specific confusion is reading the second line of the drawing as another copy of the first, because notation draws them identically: two parallel strokes of a pen, so two of the same thing. The particulate level does not agree. One component is cylindrically symmetric and the other has a nodal plane, and they differ in shape, in strength and in what they permit. A learner holding the two-identical-strokes picture predicts free rotation about a double bond and so cannot account for separable cis and trans alkenes, and expects both components to break with equal difficulty and so cannot account for an alkene reacting at the double bond while its sigma framework survives.',
    katex: '\\ce{H2C=CH2}:\\ 1\\,\\sigma + 1\\,\\pi \\qquad \\ce{HC#CH}:\\ 1\\,\\sigma + 2\\,\\pi',
    caption: 'Picture two carbons joined along the line between them by a sleeve of electron density that wraps that line all the way round. Above and below it sits a second, separate cloud in two lobes, with nothing at all in the plane holding the two nuclei and the four hydrogens. Turn one carbon against the other and the sleeve is unaffected while the two lobes pull apart.'
  },
  {
    node: 'ORG1.HYBRIDORG',
    course: 'ORG1',
    title: 'A count on paper that fixes a shape in space',
    macroscopic: 'Instruments return lengths and angles. Across ethane, ethene and ethyne the carbon to carbon distance falls from roughly 154 picometres to 134 to 120, and the angles at carbon go from near 109.5 degrees to near 120 to 180. Ethane\'s six hydrogens are all equivalent and give one 1H NMR signal, and so do ethene\'s four and acetone\'s six methyl hydrogens. No instrument returns a hybrid orbital.',
    particulate: 'A carbon mixes its 2s orbital with as many 2p orbitals as it needs sigma bonds, and whatever p orbitals are left over stay unhybridised and are available for pi bonding. Four sigma bonds gives sp3 and a tetrahedron with nothing left over; three gives sp2, trigonal planar, with one p orbital standing perpendicular to the plane; two gives sp, linear, with two. This is bookkeeping rather than an event. No carbon atom prepares its orbitals and then bonds. Hybridisation is a way of writing the same electron distribution in a set of directions that matches the geometry the molecule has, and it earns its place because the count of sigma bonds then predicts the shape and the number of leftover p orbitals at once.',
    symbolic: 'sp3, sp2 and sp, where the superscript is how many p orbitals went into the mix. The count you perform is short: add the atoms bonded to the carbon and any lone pairs on it, and four means sp3, three means sp2, two means sp. Bond angle and the number of available pi bonds follow from the label rather than being separate facts, and so does s character, one quarter for sp3, about one third for sp2 and one half for sp.',
    connector: 'The number of groups around the carbon is one number in all three: it is what sets the angle an instrument measures, it is how many hybrid directions the model has to build, and it is what you count off a drawing before writing sp3, sp2 or sp.',
    pitfall: 'The specific confusion is treating hybridisation as a physical event at the particulate level that causes the geometry, when it is symbolic bookkeeping read off the geometry. A learner in that position asks what makes an atom decide to hybridise and waits for an answer the model does not owe. The same confusion runs in the other direction when the label gets read off the appearance of the page: a ring drawn as a flat polygon is taken for a flat ring, and a carbon is called sp2 because its neighbours include an oxygen. Neither the drawing nor the elements decide it. The count of attached groups decides it.',
    katex: '\\ce{C2H6}:\\ \\mathrm{sp^3}\\quad \\ce{C2H4}:\\ \\mathrm{sp^2}\\quad \\ce{C2H2}:\\ \\mathrm{sp}',
    caption: 'Picture the same carbon three times over. With four attachments its bonds point at the corners of a tetrahedron and nothing is left over. With three they lie flat at about 120 degrees, and one dumbbell shaped cloud stands above and below that plane. With two they point in opposite directions along a line, with two such dumbbells around it at right angles to each other.'
  },
  {
    node: 'ORG1.RESONANCEORG',
    course: 'ORG1',
    title: 'One ion, several drawings',
    macroscopic: 'The two carbon to oxygen bonds of the acetate ion measure the same length, and that length lies between a carbon to oxygen single bond and a double bond. The six carbon to carbon bonds of benzene measure the same as each other in the same way, and benzene\'s six hydrogens give a single 1H NMR signal. Nobody has cooled such a sample and caught one contributor on its own, and the attempt has been made.',
    particulate: 'There is one ion with one electron distribution. In acetate the pi density is spread over the O-C-O unit and half a negative charge sits on each oxygen at all times. The several drawings are a repair to Lewis notation rather than a description of anything happening in time: Lewis notation can put a pair in one bond or on one atom and has no way to write a pair spread across three atoms, so chemists write the possibilities down and take the truth to be a weighted blend of them. The nuclei sit in the same places in every contributor, and only pi electrons and lone pairs are redrawn.',
    symbolic: 'Two or more Lewis drawings joined by a double headed arrow, which is a different sign from the double arrow of equilibrium and makes a different claim. A contributor is legal when the atoms are the same and in the same positions, the total charge is unchanged, the number of unpaired electrons is unchanged, and no second row atom exceeds eight valence electrons. Among the legal ones, a contributor counts for more when it has more bonds and more complete octets and separates charge less.',
    connector: 'The half negative charge on each oxygen is one thing in all three: it is why the two carbon to oxygen bonds measure alike, it is the single electron distribution the ion actually has, and it is what the pair of equally weighted drawings joined by a double headed arrow exists to write down.',
    pitfall: 'The specific confusion is reading the double headed arrow as motion in time, so the ion is pictured flickering between its contributors and spending part of its life as each. That promotes a symbol into a particulate event. There is one species, and if the contributors were separate species you could in principle cool the sample and catch one. The practical cost is that a flickering picture quietly licenses moving atoms, because shifting a hydrogen then looks like the same sort of move as shifting a pi bond. Move a hydrogen and you have drawn a different compound in a different bottle.',
    katex: '\\ce{CH3CO2^-}:\\ \\text{bond order } 1.5 \\text{ at each carbon to oxygen bond}',
    caption: 'Picture the acetate ion as an O-C-O unit over which one cloud of pi density is spread, heavier at the two ends than in the middle, with the methyl group hanging off to one side. There is no instant at which one end holds a double bond and the other holds a single bond.'
  },
  {
    node: 'ORG1.FUNCTIONALGROUPS',
    course: 'ORG1',
    title: 'Same formula, different bottle',
    macroscopic: 'Two bottles both labelled C2H6O. One holds a liquid that mixes with water in any proportion. The other holds a gas at room temperature. Two more bottles both labelled C2H4O2: one holds an acid whose proton a mild base removes, and the other holds a substance with no acidic hydrogen in it anywhere. The formula distinguishes none of this and the bench distinguishes all of it.',
    particulate: 'Most of a typical organic molecule is unreactive C-C and C-H sigma bonds, and reactivity concentrates where a heteroatom or a pi bond breaks that pattern. In ethanol an oxygen at the end of the chain still carries a hydrogen, and that polarised O-H can be donated to a hydrogen bond with a neighbour. In dimethyl ether the same three heavy atoms are rearranged so the oxygen bridges two carbons, with no O-H to donate. Treating a molecule as a group bolted onto an inert skeleton is a working approximation rather than the truth: the skeleton shifts the group\'s behaviour, which is why one alcohol is not exactly as acidic as another. The approximation holds well enough that a group\'s chemistry transfers between skeletons, and that is what makes the subject learnable.',
    symbolic: 'A skeletal drawing in which the carbons and their hydrogens go unwritten while heteroatoms and their hydrogens are always shown, so the groups are what stands out. OH is an alcohol, an oxygen bridging two carbons is an ether, C=O with a hydrogen on the carbonyl carbon is an aldehyde and with carbons on both sides a ketone, C=O plus OH is a carboxylic acid, and the same carbonyl with OR or with nitrogen is an ester or an amide. Each is a connectivity pattern, so it stays the same group whatever way round it is drawn.',
    connector: 'The O-H group is one thing in all three: it is why one C2H6O isomer pours and mixes with water while the other is a gas, it is the polarised bond a neighbouring molecule can hydrogen bond to, and it is the two letters that make CH3CH2OH an alcohol where CH3OCH3 is an ether.',
    pitfall: 'The specific confusion is carrying over from general chemistry the rule that a formula names a substance. Writing NaCl or H2SO4 does name one substance, so C2H6O looks like the same kind of statement and is not: it names a set of isomers that may share no useful property. The learner still reaching for the formula first is answering a question the field has stopped asking. The second half of the same error treats the drawing as a picture rather than a code, so a carbonyl drawn pointing up goes unrecognised by someone who first met one pointing down, and an ester with its carbonyl on the left is missed entirely.',
    katex: '\\ce{C2H6O}:\\ \\ce{CH3CH2OH}\\ \\text{(alcohol)}\\quad \\ce{CH3OCH3}\\ \\text{(ether)}',
    caption: 'Picture the two C2H6O isomers side by side. In one, the oxygen sits at the end of the chain still holding a hydrogen, which can reach across and hook onto the oxygen of a neighbouring molecule. In the other, the same oxygen sits between the two carbons with no hydrogen of its own, and there is nothing on it for a neighbour to hook onto.'
  },
  {
    node: 'ORG1.ARROWS',
    course: 'ORG1',
    title: 'An arrow that tracks the pair, not the atom',
    macroscopic: 'Nothing here is observed. Mix acetic acid with hydroxide and the acid is consumed: a pH meter moves, and what you can recover is acetate rather than anything with a broken C-H bond, which agrees with the O-H being the acidic site at a pKa of 4.76 while the methyl hydrogens are not. But no instrument has ever returned a curved arrow. What a chemist can actually measure is which products form, how fast they form, and where a labelled atom ends up, and a set of arrows earns its keep by predicting all three across many reactions rather than by being seen once.',
    particulate: 'A pair of electrons leaves a lone pair on the hydroxide oxygen and becomes a bond to the acidic hydrogen, while the pair that had been holding that hydrogen collapses back onto the oxygen it was attached to. The hydrogen itself moves as a bare nucleus between two electron pairs and carries none of its own. The arrow is a discrete summary of something continuous: it names a start point and an end point and says nothing about the path, the timing, or whether the two pairs move in step. Real steps are every nucleus and every electron moving at once, and the notation is chosen because it makes the bookkeeping checkable, not because it is a film of the event.',
    symbolic: 'A full-headed curved arrow moves two electrons and a single-headed fishhook moves one. The tail sits on an electron pair that exists in the starting structure, a lone pair or a bond, and never on an atom, never on a positive charge and never where the electrons are going. The head lands between two atoms when a bond forms, or on an atom when the pair becomes a lone pair. Two checks follow: formal charge balances across the step, and no second row atom finishes with more than eight electrons.',
    connector: 'The lone pair on the hydroxide oxygen is the same pair in all three: it is why hydroxide is the species in the flask that takes the proton, it is what ends up as the new O-H bond of water, and it is where the tail of the first arrow has to be placed.',
    pitfall: 'The specific confusion is drawing the arrow from the hydrogen toward the base, because the hydrogen is the thing that visibly changes address and the arrow is read as tracking whatever moves. That imports an everyday picture of motion into a notation that tracks electron pairs. The tail then sits where the electrons are not, and the step becomes uncheckable even when the products drawn happen to be right. The test takes a second: look at the tail of each arrow and name the pair it sits on out loud, as a lone pair on a stated atom or as a stated bond. If you cannot name it, the arrow is wrong.',
    katex: '\\ce{CH3COOH + OH^- -> CH3COO^- + H2O}',
    caption: 'Picture the hydroxide oxygen bringing its lone pairs up to the acidic hydrogen of acetic acid. One pair reaches out and closes on that hydrogen. At the same moment the pair that had held the hydrogen to the acetic acid oxygen falls back onto that oxygen as a new lone pair. The hydrogen nucleus passes from one pair to the other with nothing of its own.'
  },
  {
    node: 'ORG1.CHAIR',
    course: 'ORG1',
    title: 'The signal that splits when the sample gets cold',
    macroscopic: 'Cyclohexane gives one 1H NMR signal at room temperature, as though all twelve of its hydrogens were the same. Cool the sample well below room temperature and that one signal separates into two. Variable temperature NMR turns that change into a number: the free energy barrier to ring inversion is on the order of 45 kJ/mol, near 10.8 kcal/mol, low enough that the flip is fast at room temperature and high enough that cooling freezes it out.',
    particulate: 'The ring is puckered into a chair, with three carbons slightly above the mean plane and three slightly below, and each carbon carries one axial bond parallel to the ring axis and one equatorial bond around the rim. It inverts to the other chair through a half-chair transition state and a twist-boat intermediate, and that inversion exchanges axial and equatorial at every carbon while moving nothing from one face of the ring to the other. Saying the molecule sits in one chair and then jumps to the other is a summary. The ring is in continuous motion, and a chair names a shallow region it spends most of its time in rather than a pose it holds.',
    symbolic: 'Axial and equatorial are labels for positions in a conformation, and no formula and no SMILES string distinguishes one chair from the other, because they are one compound. Cis and trans do appear in a name, because those are different compounds. The drawing convention carries the geometry: axial bonds strictly vertical and alternating up, down, up, down around the ring, with each equatorial bond tilted the opposite way from its own carbon\'s axial bond.',
    connector: 'The ring flip is one event in all three: it is what averages twelve hydrogens into a single signal at room temperature and stops averaging them when the sample is cold, it is the pucker inverting so that every axial bond becomes equatorial, and it is the reason no notation names one chair rather than the other.',
    pitfall: 'The specific confusion is that a drawn chair looks like a fixed object, so a conformation gets treated as a compound and the learner expects a ring flip to turn a cis compound into a trans one. It cannot. Axial against equatorial is conformation, reached by rotation, and the two chairs are one substance that no separation could resolve. Cis against trans is configuration, reached only by breaking a bond, and those are two substances that can be put in two bottles. The single averaged NMR signal is the macroscopic statement of the same point: at room temperature the sample does not contain two isolable species.',
    katex: '',
    caption: 'Picture the six carbons alternating up, down, up, down around the ring. At each one, a bond runs straight up or straight down parallel to the ring\'s axis while the other points outward around the rim. Now invert the pucker: every carbon that was up is down, so every straight bond becomes a rim bond and every rim bond becomes a straight one, and nothing has crossed from the top face of the ring to the bottom.'
  },
  {
    node: 'ORG1.CHIRALITY',
    course: 'ORG1',
    title: 'Two compounds a balance cannot tell apart',
    macroscopic: 'Two enantiomers have the same melting point, the same boiling point, the same density and the same 1H NMR spectrum in an ordinary solvent. A balance, a thermometer and a spectrometer report no difference at all. A polarimeter does: one rotates plane polarised light in one direction and the other by the same amount in the opposite direction, and a 50:50 mixture of the two rotates it not at all. They also behave differently toward anything else that is itself chiral, which is how they get separated in the first place.',
    particulate: 'A carbon with four single bonds sits at the centre of a tetrahedron, and when the four things at its corners are all different, the molecule and its mirror image cannot be laid onto each other however they are turned. Counting stereocentres is a shortcut rather than the definition, and it fails on meso compounds; the definition is whether the mirror image is superimposable, which is what looking for an internal mirror plane tests. One further point the drawing hides: the molecule is vibrating and tumbling the whole time. What is fixed is the arrangement, and no vibration or rotation changes it without a bond breaking.',
    symbolic: 'Wedges and dashes on a flat page to stand for bonds coming toward you and going away, and then R or S in front of the name. Those letters come from ranking the four groups by atomic number at the first point of difference and reading the rotation with the lowest priority pointing away, so they are the output of a procedure applied to the drawing rather than a property read off an instrument.',
    connector: 'The handedness of the arrangement at C2 of butan-2-ol is one thing in all three: it is what a polarimeter responds to, it is which of the two non-superimposable arrangements the four groups occupy in space, and it is the letter R or S that goes in front of the name.',
    pitfall: 'The specific confusion is treating R and S as the physical fact rather than as labels produced by a ranking rule, which shows up as the belief that R rotates light one way and S the other. The letter comes from a priority ordering that can be reshuffled by changing one substituent, while the direction of rotation comes from the molecule interacting with light, and the two are not linked by any rule you can apply on paper. The related error lives one level down: counting stereocentres on the drawing instead of testing the molecule for an internal mirror plane, which gets meso compounds wrong every time.',
    katex: '',
    caption: 'Picture your two hands held palm to palm. Every finger meets its partner across the mirror, and no turning of one hand lays it onto the other. Now replace each hand with a carbon at the centre of a tetrahedron whose four corners hold an OH, an H, a methyl and an ethyl, and the same thing is true of them.'
  },
  {
    node: 'ORG1.ENERGYDIAGRAM',
    course: 'ORG1',
    title: 'A curve nobody has plotted directly',
    macroscopic: 'No instrument draws this curve. Two ordinary and quite separate measurements stand behind it. Measure how fast the reaction goes at several temperatures and you recover the height of the highest barrier. Measure how far it goes, meaning where it stops, and you recover the difference in level between reactants and products. A third kind of evidence supports the shape in between: whether anything can be detected, trapped or diverted part way through tells you whether there is a well in the middle. That the two measurements are independent is something you can see without any instrument at all, because diamond turning into graphite is downhill and nobody is watching it happen.',
    particulate: 'A transition state is the arrangement at the instant bonds are half made and half broken. It is not a substance, it has no lifetime and it cannot be isolated. An intermediate sits in a well with all its bonds fully formed and exists for a finite time, even when that time is very short. Two things about the picture are simplifications worth naming. The horizontal axis is neither time nor distance: it is a chosen coordinate summarising the many bond lengths and angles that change together, so the curve is a one dimensional slice through a many dimensional energy surface. And a single line implies a single path, where a flask full of molecules crosses by a spread of related routes.',
    symbolic: 'Energy up the page against reaction progress across it. Every maximum is a step and every minimum lying between the two ends is an intermediate, so counting maxima counts steps. A transition state is written in brackets with a double dagger for the reason above. The activation energy is measured from the reactant level up to the highest peak, and the reactant to product gap is a different number answering a different question.',
    connector: 'The height of the highest peak above the reactant level is one quantity in all three: it is what the change of rate with temperature reports, it is how much energy a colliding pair has to muster before the arrangement can get over the top, and it is the vertical gap the diagram labels as the activation energy.',
    pitfall: 'The specific confusion is promoting a point on a drawn curve into a species in a flask, so a transition state and an intermediate become the same kind of object at two heights. The diagnostic is the shape and not the label: a well is a species and a peak is not, and no amount of care will let you bottle a peak. The second confusion runs between the two numbers the diagram shows at once. A large drop from reactants to products is read as a fast reaction, which merges a thermodynamic quantity with a kinetic one. A reaction can be strongly downhill and sit unchanged for years behind a tall barrier.',
    katex: 'k = A\\,e^{-E_a/(RT)}',
    caption: 'Picture a walker crossing a ridge between two valleys. The starting valley is the reactants and the far one the products. The top of the ridge is the transition state: the walker is over it for no time at all and cannot stand there. If the ridge has a hollow part way across, the walker can rest in it, and that hollow is an intermediate. How long the crossing takes is set by how high the highest point stands above the starting valley, not by how much lower the far valley lies.'
  },
  {
    node: 'ORG1.CARBOCATION',
    course: 'ORG1',
    title: 'A species you read off what comes out of the flask',
    macroscopic: 'An ordinary carbocation is far too short lived to be bottled, so the evidence is what the flask returns. A tertiary bromide is converted at a measurable rate in a protic solvent while its primary isomer of the same formula essentially is not, and benzyl bromide, primary by every count, reacts readily. The product can come out with a rearranged carbon skeleton: 2-bromo-3-methylbutane gives mostly 2-methylbutan-2-ol rather than the 3-methylbutan-2-ol its connectivity would suggest, and those two alcohols are constitutional isomers you can tell apart. One direct observation exists: long lived alkyl cations can be generated and observed in superacid media, where the tert-butyl cation is planar at the cationic carbon.',
    particulate: 'A carbocation is a carbon with three bonds, no lone pair and therefore six valence electrons. The three bonding pairs push as far apart as they can, so the carbon is trigonal planar at about 120 degrees with an empty p orbital standing perpendicular to that plane. Everything about stability is about getting density into that orbital: alkyl neighbours do it weakly by hyperconjugation, an adjacent pi system strongly by resonance. Drawing hyperconjugation as one C-H bond donating into the empty orbital is a picture that makes the counting work; the fuller account is that those sigma bonds and the empty orbital form one set of levels together. And the free, fully separated cation is an idealisation, since in solution it is wrapped in solvent and often still close to the group it has lost.',
    symbolic: 'A plus sign on a carbon carrying three lines. It states two things at once: six valence electrons rather than eight, and one empty p orbital. Methyl, primary, secondary and tertiary count the carbons attached to the charged centre, which is a proxy for how much hyperconjugation is available, and the proxy is overridden whenever an adjacent double bond or ring can delocalise the charge.',
    connector: 'The empty p orbital is one thing in all three: it is why a tertiary or benzylic substrate is converted while a plain primary one sits there, it is what neighbouring C-H bonds and neighbouring pi systems feed density into, and it is what the plus sign on a three bonded carbon records.',
    pitfall: 'The specific confusion is reading the plus sign as a charge added on top of an otherwise ordinary carbon, rather than as the record of a missing electron pair. A learner holding the first reading has no empty orbital anywhere in the particulate picture, so there is nothing for hyperconjugation or resonance to fill, and every stability argument at this node turns into a list to memorise. The related error is counting hydrogens on the cationic carbon instead of the carbons attached to it, which does not blur the ordering so much as reverse it.',
    katex: '\\ce{(CH3)3C+}:\\ \\text{six valence electrons at the cationic carbon}',
    caption: 'Picture the cationic carbon lying flat, its three groups splayed at about 120 degrees in one plane, and an empty dumbbell shaped orbital standing above and below that plane with nothing in it. Every neighbouring C-H bond that can line up with the dumbbell leans its pair toward it, and an adjacent double bond or aromatic ring spreads its pi density into it outright.'
  },
  {
    node: 'ORG1.SN2',
    course: 'ORG1',
    title: 'A rate that answers when you change the nucleophile',
    macroscopic: 'Four observations, none of which shows the mechanism and all of which constrain it. Change the concentration of the nucleophile and the rate changes in proportion; change the concentration of the substrate and it changes in proportion again, so the reaction is second order overall. Start from a single enantiomer of substrate and the product sample is optically active on a polarimeter rather than showing zero rotation. Put a tertiary bromide and its primary isomer of the same formula under the same conditions and the primary one is displaced readily while the tertiary gives no product at any useful rate. Swap a polar protic solvent for a polar aprotic one and the reaction speeds up, often by orders of magnitude.',
    particulate: 'One step. The nucleophile\'s lone pair reaches the antibonding orbital of the carbon to leaving group bond from the face opposite that bond, which is the only direction of approach that does not run into the bonding electrons already there, and the three retained groups fold back past the carbon as the new bond forms. Nothing is made and then destroyed along the way. The backside attack cartoon should be read as a cartoon: it draws a straight line trajectory into the back of the carbon, where in the flask the two species are tumbling and arrive over a range of angles. What the cartoon gets right, and what the evidence supports, is that the geometry which works puts the two groups on opposite sides and that no intermediate exists between the two ends. The transition state itself has never been observed.',
    symbolic: 'The rate law is first order in substrate and first order in nucleophile, so both concentrations appear and one rate constant multiplies them. The transition state is drawn in brackets with a double dagger, partial bonds as dashed lines to the incoming and departing groups and the three retained groups flat between them. Inversion is written by redrawing the wedges and dashes, and R may or may not become S depending on how the priorities fall out.',
    connector: 'The single step is one fact in all three: it is why the rate answers to both concentrations at once, it is why there is no intermediate in which the substrate could lose its arrangement, and it is why one rate constant with two concentrations beside it is the whole rate law.',
    pitfall: 'The specific confusion is reading inversion of configuration, which is a statement about where the atoms are, off the CIP letter, which is a statement about how you chose to rank them. In the standard examples the letter does flip, so the belief gets reinforced. Then take (S)-ethyl 2-bromopropanoate and displace the bromide with cyanide: the geometry inverts as it always does, and the product is still (S), because the nitrile carbon reads as three nitrogens while the ester carbon reads as three oxygens, so the incoming group arrives at rank 2 where the leaving group held rank 1. One transposition of labels reverses the reading and the inversion reverses it again.',
    katex: '\\text{rate} = k[\\ce{RX}][\\ce{Nu^-}]',
    caption: 'Picture the carbon with three groups fanned around it and the leaving group on one side. The nucleophile comes in on the far side, and as its bond begins to form the three groups swing back past the carbon like an umbrella turning inside out in wind. Halfway through they lie flat in one plane with a partial bond ahead and a partial bond behind, and then the leaving group is gone and the umbrella has finished turning.'
  },
  {
    node: 'ORG1.SN1',
    course: 'ORG1',
    title: 'A rate that ignores the nucleophile',
    macroscopic: 'Change the concentration of the nucleophile and the rate does not move, while changing the substrate concentration changes it in proportion: first order in substrate, zero order in nucleophile. Start from a single enantiomer of substrate and the product sample reads zero rotation on a polarimeter. Run the same substrate in solvents of increasing ionizing power and it goes faster, which is the opposite of the solvent preference that speeds up the bimolecular route. And the product can arrive with a carbon skeleton that is not the skeleton you started with, as a constitutional isomer of the expected alcohol.',
    particulate: 'Two steps with an intermediate between them. The carbon to halogen bond breaks on its own, with the solvent assisting, giving a carbocation and a halide, and that step is slow and sets the rate with the nucleophile taking no part in it. Then the nucleophile bonds to the cation, which is fast. The cation is trigonal planar with an empty p orbital perpendicular to its three substituents, so the nucleophile can arrive into either lobe. The clean picture of a free cation fully surrounded by solvent is an idealisation: real ionizations pass through ion pairs in which the halide has not diffused away and partly shields the face it left, which is why real products often show a small excess of the inverted one rather than an exact even split.',
    symbolic: 'The rate law contains the substrate concentration and one rate constant, and the nucleophile does not appear in it at all. That absence is the content of the notation rather than an omission. The mechanism is written as two arrow-pushing steps with the carbocation written out in between as a species in its own right, because it is one.',
    connector: 'The rate determining ionization is one event in all three: it is why adding more nucleophile leaves the rate alone, it is the carbon to halogen bond breaking before anything arrives, and it is why the nucleophile is missing from the rate law.',
    pitfall: 'The specific confusion is reading racemization, which is a statement about the sample the polarimeter measures, as a statement about the molecule, so the learner concludes the product is achiral or that the stereocentre has been lost. Every molecule in that flask is chiral and every one has a stereocentre. What is true of the sample is that it holds equal numbers of two enantiomers whose rotations cancel, and a polarimeter can report only the sum. The second half of the same confusion expects an exact fifty fifty split every time, which the ion pair account says is a limit rather than a rule.',
    katex: '\\text{rate} = k[\\ce{RX}]',
    caption: 'Picture the halide letting go first, with nothing else nearby, leaving a flat carbon whose three groups splay at about 120 degrees and an empty orbital standing above and below that plane. Solvent closes around both ions. Then a water molecule arrives, and there is nothing to make the top of the plane different from the bottom, so it arrives above about as often as it arrives below.'
  },
  {
    node: 'ORG1.E2',
    course: 'ORG1',
    title: 'Two substrates, one base, two different alkenes',
    macroscopic: 'Change the base concentration and the rate changes in proportion, and the same holds for the substrate, so the reaction is second order overall. The sharper observation is stereochemical and needs no kinetics at all. Take two diastereomeric bromides, put them through the same base under the same conditions, and they give two different alkenes: one returns the E isomer and the other the Z isomer, and those are separable substances with different properties. Take instead two enantiomeric bromides and they give the same alkene, because the product is achiral and cannot record which one it came from.',
    particulate: 'One step. The base takes a hydrogen from the carbon next to the one bearing the leaving group, the electrons of that C-H bond swing over to become the pi bond, and the leaving group departs, all at once. For the electrons to move that way the C-H bond and the carbon to leaving group bond have to lie in one plane, and the anti arrangement at 180 degrees is strongly preferred over syn at 0, because anti is staggered rather than eclipsed and keeps the base and the leaving group out of each other\'s way. Only one conformation reacts, but the molecule is not stuck in it: rotation about that bond is fast and the reacting conformation is one the molecule visits often. Drawing it alone is a summary of a population rather than a claim that the molecule sits still, and as with any one step reaction the transition state is not observed.',
    symbolic: 'The rate law carries both the substrate and the base. The geometry is written as a Newman projection sighted along the bond that is about to become the double bond, with the beta hydrogen at one end and the leaving group at the other, 180 degrees apart. The alkene is then labelled E or Z from CIP priorities rather than from what the drawing looks like, so two methyl groups ending up on the same side can read out as E.',
    connector: 'The one reacting conformation is the same thing in all three: it is why two diastereomers of substrate give two different, separable alkenes under identical conditions, it is the anti-periplanar arrangement of the beta hydrogen and the leaving group in the particle that reacts, and it is what a Newman projection along that bond puts on the page.',
    pitfall: 'The specific confusion is reading a flat structure as a picture of the arrangement in space, so the learner picks whichever beta hydrogen looks convenient on the page and draws whichever alkene is easier to draw. The belief underneath is that the reaction chooses its product. What it chooses is a conformation, and the product follows from that with no further freedom, so the rotation has to be done on paper before anything is written down. The related error treats stereospecific and stereoselective as synonyms: selective means one product is preferred from one starting material, specific means each stereoisomer of starting material is channelled to its own product, and E2 is the second.',
    katex: '\\text{rate} = k[\\ce{RX}][\\ce{B^-}]',
    caption: 'Picture sighting straight down the bond between the carbon carrying the leaving group and the carbon next to it. Turn the back carbon until its hydrogen sits directly opposite the leaving group, one pointing up at the front and the other down at the back. Whatever the remaining four groups are doing at that moment is what they will still be doing when the two carbons flatten and the double bond appears between them.'
  },
  {
    node: 'ORG1.NMRTHEORY',
    course: 'ORG1',
    title: 'Position on a chart, electron density around a nucleus',
    macroscopic: 'Put a sample in the magnet and the chart comes back with peaks at particular positions. Toluene gives two clusters: three hydrogens at the small shift end and five at the large shift end, in a 3 to 5 relationship, with the five resolving into 2:2:1 on an instrument that can separate them. Correlation charts put alkyl hydrogens at about 0.8 to 1.8 ppm and aromatic hydrogens at about 6.5 to 8.5 ppm. The same compound returns the same ppm values on a stronger or a weaker instrument, which is the whole reason the scale is defined the way it is.',
    particulate: 'A hydrogen nucleus in a magnetic field has two spin states whose energy separation is proportional to the field the nucleus actually experiences, which is not the field the instrument supplies. Electrons near the nucleus respond to the applied field and set up a small field opposing it, so the nucleus feels a little less. That is shielding. Pull density away, with an electronegative atom a bond or two off, and the nucleus feels more. An aromatic ring does something further: its pi electrons produce a field that reinforces the applied one at positions outside the ring. Describing those electrons as circulating and throwing off a field of their own is a classical stand-in for a quantum calculation. It gets the direction and roughly the size right for these cases and is not a picture of electrons running in loops.',
    symbolic: 'The chemical shift is the difference between the resonance frequency of the nucleus and that of a reference, divided by the operating frequency, which makes it a ratio and so a number in parts per million that does not depend on the instrument. Tetramethylsilane is the conventional reference and is assigned zero. More shielding means a smaller shift, which is the upfield end of the chart.',
    connector: 'The electron density around one hydrogen is one thing in all three: it is what fixes where that hydrogen\'s peak lands on the chart, it is what shields the nucleus from part of the applied field, and it is what the ppm value on the shift scale reports.',
    pitfall: 'The specific confusion is reading a position on the chart, which is an instrument reading, as a statement about how the molecule behaves. A hydrogen far downfield gets called more acidic or more reactive, and neither follows. Aromatic hydrogens are strongly deshielded and are not acidic at all. The chart position reports local electron density and the field of a nearby pi system, and nothing else. The second confusion is reversing upfield and downfield, which happens because the words come from an older experiment in which the field was swept rather than the frequency. Anchor them on shielding: more shielded means smaller shift means upfield, and the reference at zero is the most shielded thing on the chart.',
    katex: '\\delta = \\frac{\\nu_{\\text{sample}} - \\nu_{\\text{ref}}}{\\nu_0} \\times 10^6\\ \\text{ppm}',
    caption: 'Picture one hydrogen nucleus inside the instrument\'s field with a cloud of electrons around it. The cloud responds to that field and throws off a small field of its own pointing the other way, so the nucleus feels a little less than the instrument supplies. Thin the cloud by putting an electronegative atom a bond or two away and the nucleus feels more, and the peak shifts along the chart.'
  },
  {
    node: 'ORG2.CONJUGATION',
    course: 'ORG2',
    title: 'Two double bonds that share, and two that do not',
    macroscopic: 'Penta-1,3-diene and penta-1,4-diene are both C5H8, so combustion analysis returns the same answer for each and cannot separate them. Two measurements can. Hydrogenate both double bonds of each and the conjugated 1,3-isomer gives out less heat than the isolated 1,4-isomer; for buta-1,3-diene that shortfall is of the order of 15 kJ/mol. Put each in an ultraviolet spectrometer and the conjugated isomer absorbs at a longer wavelength than the isolated one.',
    particulate: 'The single bond between two double bonds is not a gap. Each of the four carbons carries a p orbital standing perpendicular to the plane of the molecule, and those four overlap end to end into one continuous system, so the four pi electrons are spread across all four carbons rather than trapped two by two. Put an sp3 CH2 in the middle, as penta-1,4-diene does, and that carbon has no p orbital to continue the overlap, so the two alkenes are separate. The drawing of double, single, double is a bookkeeping device and not a picture of the real bonding: the central bond of a conjugated diene is shorter than an ordinary single bond, and the real molecule holds one delocalised pi system rather than the two isolated ones the drawing shows.',
    symbolic: 'CH2=CH-CH=CH2 against CH2=CH-CH2-CH=CH2. The pattern to read is double, single, double, and what sits between the double bonds is the whole of it. The molecular formula is silent here: both pentadienes are C5H8 with two degrees of unsaturation, so the formula distinguishes nothing and the constitution decides everything. The s-cis and s-trans labels are rotations about that central single bond, not configurations, so they carry no descriptor.',
    connector: 'The delocalisation of the four pi electrons is one thing seen three ways: it is the heat missing from the calorimeter and the shift of the absorption to longer wavelength, it is the continuous overlap of four p orbitals in the particulate picture, and it is what the double, single, double pattern on the page announces.',
    pitfall: 'The specific confusion is counting double bonds in the formula and calling any diene conjugated, which reads a particulate condition off a symbolic count. Conjugation is not about how many double bonds there are but about what sits between them, and no formula shows that: C5H8 covers both pentadienes, and only one of them has electrons spread over four carbons. The second half of the same error is treating s-cis and s-trans as two substances you could put in two bottles. They are rotations about one bond in one compound, interconverting without anything breaking, and no separation could ever hand you a bottle of either.',
    katex: '\\ce{CH2=CH-CH=CH2}\\ \\text{(conjugated)}\\qquad \\ce{CH2=CH-CH2-CH=CH2}\\ \\text{(isolated)}',
    caption: 'Picture four carbons in a row, each with a dumbbell shaped p orbital standing above and below the plane, all four parallel and touching their neighbours, so the electron density runs the whole length like one long cloud. Now slot an sp3 carbon into the middle: it has no dumbbell, and the cloud stops dead on each side of it.'
  },
  {
    node: 'ORG2.DIELSALDER',
    course: 'ORG2',
    title: 'The geometry of the starting alkene, read out of the product',
    macroscopic: 'Run the same diene twice, changing one thing: the cis diester in one flask and the trans diester in the other. Both runs deliver an adduct of formula C10H14O4, so combustion analysis and the mass cannot tell the two runs apart. Everything else can. The two products are different substances with different melting points and different proton spectra, and they separate from one another. In both runs the diene\'s ultraviolet absorption is lost as it is consumed, because the conjugated system it had does not survive into the adduct.',
    particulate: 'The four pi electrons of the diene and the two of the dienophile reorganise together, and two new carbon to carbon sigma bonds form in the same step, so there is no intermediate to trap and no moment at which one end is bonded and the other is not. That is why the geometry present in the dienophile is carried into the ring: neither end gets a chance to rotate. The circle of curly arrows drawn round the six-membered transition state is a bookkeeping device for one continuous reorganisation of electron density. It does not mean the bonds form in the order the circle is drawn, and drawing the circle the other way round names the same event.',
    symbolic: 'C4H6 + C2H4 gives C6H10, one ring and one retained double bond. The stereochemistry is written as descriptors on the product: the adduct from the cis diester reads (R,S) and is a meso compound, one achiral substance, while the adduct from the trans diester is the (R,R) and (S,S) pair of enantiomers.',
    connector: 'The relative arrangement of the two ester groups is one fact in all three: it is what makes the two runs give substances with different melting points, it is the geometry the concerted step cannot scramble, and it is what the descriptors (R,S) against (R,R) and (S,S) record.',
    pitfall: 'The specific confusion is promoting a symbolic count into a macroscopic prediction: two stereocentres on the page reads as two bottles of enantiomers, so the cis adduct gets written as an enantiomeric pair like the trans one. The bench says otherwise. The cis adduct has an internal mirror plane, so it is one achiral compound with one melting point, and there is no second substance to isolate. Count stereocentres to bound the possibilities on paper, then look for the mirror plane before you claim anything about what is in the flask.',
    katex: '\\ce{C4H6 + C2H4 -> C6H10}',
    caption: 'Picture the diene lying with both its ends curled toward the same side, and the dienophile floating parallel beneath it like a rung under a horseshoe. As they close, both gaps shut at once and the two groups on the dienophile keep the sides they started on, because nothing ever swings free.'
  },
  {
    node: 'ORG2.BENZENE',
    course: 'ORG2',
    title: 'Three drawn double bonds that will not behave like double bonds',
    macroscopic: 'Shake cyclohexene with bromine water and the colour goes fast. Shake benzene, which is drawn with three double bonds, with the same bromine water under the same mild conditions and the colour stands. The calorimeter says the same thing in numbers: hydrogenating the one double bond of cyclohexene releases about 120 kJ/mol, so three separate double bonds would predict near 360 kJ/mol, and the measured value for benzene is about 208 kJ/mol. Benzene starts roughly 150 kJ/mol lower than the drawing predicts.',
    particulate: 'All six carbons are in one plane, each carrying a p orbital, and the overlap runs the whole way round the ring with no beginning and no end, so six pi electrons belong to the ring rather than to three bonds. Every carbon to carbon bond in the ring is the same length, between a single and a double bond, and all six hydrogens are one environment. The two Kekule drawings with their alternating long and short bonds are not two structures the molecule flips between, and the molecule does not spend half its time in each. They are two pictures of one delocalised structure, which is why the measured bond lengths are all equal rather than averaging out over time.',
    symbolic: 'C6H6, four degrees of unsaturation, drawn either as a hexagon with three double bonds or as a hexagon with a circle inside. The three drawn double bonds are a bookkeeping device for six delocalised electrons, and the circle is the notation that refuses to place them. The gap between the measured heat of hydrogenation and three times the cyclohexene value is written as the delocalization or resonance energy.',
    connector: 'The delocalization energy is one quantity in all three: it is the roughly 150 kJ/mol of heat that never appears in the calorimeter and the reason the bromine water stays coloured, it is what the ring-wide overlap of six p orbitals buys, and it is what the circle in the symbol stands for.',
    pitfall: 'The specific confusion is reading three double bonds off the drawing and predicting alkene behaviour at the bench, which lets a bookkeeping symbol dictate a macroscopic expectation. A learner holding that picture predicts alternating bond lengths, predicts that bromine water will decolourise, and is surprised by every reaction in the chapter. The structural evidence against it is that all six ring bonds are equal and all six hydrogens are one environment, which no static triene can show, and the energetic evidence is the heat of hydrogenation deficit.',
    katex: '\\ce{C6H6 + 3H2 -> C6H12}\\quad \\Delta H \\approx -208\\ \\mathrm{kJ/mol}',
    caption: 'Picture a flat hexagon of carbons with a doughnut of electron density lying above the ring and a matching one below, both unbroken all the way round. There is no place on the rim where the density thickens into a double bond and no place where it thins into a single one.'
  },
  {
    node: 'ORG2.EASMECH',
    course: 'ORG2',
    title: 'A ring that is broken and handed back',
    macroscopic: 'Two observations settle what happened. First the composition of what you recover: after an electrophilic substitution the isolated product carries one new group per ring and one hydrogen fewer, analysing as C6H5E, where an addition across two carbons would have given C6H6E2 and a heavier mass. Second, an acid is released, so a damp indicator held over the flask turns. Then test the recovered product the way you would test an alkene: it leaves bromine water coloured, exactly as benzene did. Whatever the ring passed through, it is aromatic again at the end.',
    particulate: 'The electrophile bonds to one ring carbon, which goes tetrahedral and drops out of the pi system, leaving four electrons shared over the remaining five carbons in an arenium ion. That ion is not aromatic, so it is high in energy and short-lived, and it recovers by throwing off the proton from the carbon that was attacked, whose carbon to hydrogen bonding electrons drop back into the ring. The three or four resonance structures usually drawn for the arenium ion, each parking the plus sign on a different carbon, are not species in equilibrium and the ion does not take turns being each of them. They are pictures of one ion whose positive charge sits over five carbons at once.',
    symbolic: 'Benzene plus an electrophile gives the arenium ion, which loses a proton to give the substituted ring: C6H6 plus E+ to [C6H6E]+ to C6H5E plus H+. Both benzene and the product carry four degrees of unsaturation, and that unchanged count is the notation stating that the ring survived. A substituent with a pi bond of its own, such as nitro, raises the molecular total without touching the ring\'s four.',
    connector: 'The aromatic sextet is the same six electrons throughout: it is what the recovered product\'s refusal to decolourise bromine water reports, it is the closed loop the arenium ion has lost and gets back when the proton leaves, and it is what the unchanged four degrees of unsaturation in C6H5E state.',
    pitfall: 'The specific confusion is treating the arenium ion, an intermediate that exists on the page, as though it were something you could isolate and weigh. The symbolic level draws a cation with a plus sign on it, which looks like a finished species, so the learner either stops the mechanism there or hangs a nucleophile on it and predicts a saturated addition product. No such product turns up on the bench, and the composition of what does turn up, one group per ring and one hydrogen fewer, is the measurement that rules it out. The reaction is not over until aromaticity is back.',
    katex: '\\ce{C6H6 + E+ -> [C6H6E]+ -> C6H5E + H+}',
    caption: 'Picture the unbroken doughnut of electron density above and below the ring. The electrophile lands on one carbon, that carbon pulls up out of the plane, and the doughnut breaks into an arc spread over the five carbons that remain. The proton then drops off the raised carbon, it falls back into the plane, and the arc closes into a doughnut again.'
  },
  {
    node: 'ORG2.EPOXIDE',
    course: 'ORG2',
    title: 'One epoxide, one nucleophile, two products',
    macroscopic: 'Take one epoxide and one nucleophile and run them under acidic conditions in one flask and basic conditions in the other. Combustion analysis of both products returns the same formula, C5H12O2 for the methanol opening of 2,2-dimethyloxirane, and the mass spectrometer returns the same mass. Chromatography still shows two different substances, and their proton spectra differ. The same split shows in the diol from cyclohexene oxide: the trans and cis 1,2-cyclohexanediols are separate substances with different melting points, and anti opening delivers one of them and not the other.',
    particulate: 'The three-membered ring is strained, and the nucleophile relieves that strain by attacking a ring carbon from the face opposite the carbon to oxygen bond, so that carbon inverts and the two new groups end up on opposite faces. Which carbon it attacks is a separate question from how it attacks. Under basic conditions a strong nucleophile goes to the less hindered carbon. Under acidic conditions the ring oxygen is protonated first and positive charge builds on the more substituted carbon, which draws the nucleophile there instead. Describing that acidic case as a carbocation at the more substituted carbon is a model: the bond to oxygen is not fully broken before the nucleophile arrives, and the transition state sits between a clean backside displacement and a free cation, which is why the regiochemistry flips while the inversion does not.',
    symbolic: 'C4H8O plus CH4O gives C5H12O2 either way, and the two answers are constitutional isomers: 1-methoxy-2-methylpropan-2-ol from the basic opening and 2-methoxy-2-methylpropan-1-ol from the acidic one. The stereochemical outcome is written as descriptors: the trans diol from cyclohexene oxide is the (R,R) and (S,S) pair, and the cis diol is the single (R,S) meso compound.',
    connector: 'Which of the two ring carbons the nucleophile bonded to is one fact in all three: it is what separates the two spots on the chromatogram, it is where the incoming group sits in the particulate picture, and it is the difference between the two names and the two locants on the page.',
    pitfall: 'The specific confusion is reading the word trans off a drawing and treating it as the identity of a substance. Trans names a relationship between two groups in one picture; whether the bottle holds one achiral compound or a fifty-fifty pair of enantiomers is a symmetry question about the whole molecule, and for cyclohexene oxide the answer runs opposite to the guess. The trans diol is the chiral pair, formed as a racemate, and the cis diol is the single meso compound. The related slip fixes regiochemistry once and applies it to both conditions, when acid and base attack opposite carbons and the products are two substances the formula cannot separate.',
    katex: '\\ce{C4H8O + CH4O -> C5H12O2}',
    caption: 'Picture a triangle of two carbons and an oxygen, the bond angles squeezed far below what carbon wants. The nucleophile comes in on the far side of one carbon, directly opposite the oxygen, and as the new bond forms the three other groups on that carbon sweep backward like an umbrella in the wind while the oxygen swings away on the other carbon.'
  },
  {
    node: 'ORG2.CARBONYLSTRUCTURE',
    course: 'ORG2',
    title: 'A formula that names three substances',
    macroscopic: 'Put a carbonyl compound in an infrared spectrometer and a strong band appears near 1700 cm-1 that a comparable alcohol or alkane does not show. Now take two bottles that combustion analysis cannot separate: propanal and propanone are both C3H6O. Their proton spectra separate them at a glance. Propanone gives one signal. Propanal gives three, in the ratio 3:2:1, and one of those three sits far downfield of the rest.',
    particulate: 'A carbonyl is a carbon doubly bonded to an oxygen. The carbon is sp2 and trigonal planar with bond angles near 120 degrees, and the pi bond is pulled hard toward the oxygen because oxygen is far more electronegative than carbon. Saying that the carbonyl carbon is partially positive is a model, not a measurement: there is no fraction of an electron parked on it that an instrument counts. The delta plus and delta minus symbols record the direction in which the electron density is uneven, and the useful consequence is chemical rather than numerical, that an electron rich reagent goes to the carbon and a proton or a metal goes to the oxygen.',
    symbolic: 'CH3CH2CHO against CH3COCH3. The suffix -al puts the carbonyl at the end of a chain with a hydrogen on it, and the suffix -one puts it between two carbons and needs a locant. Both are C3H6O with one degree of unsaturation, so the formula fixes the atom count and the number of rings plus pi bonds and fixes nothing else.',
    connector: 'The polarised carbon to oxygen double bond is one object in all three: it is what puts the strong band near 1700 cm-1 into the infrared spectrum, it is the trigonal sp2 carbon with its electron density pulled toward oxygen, and it is what both the -al and the -one suffix name.',
    pitfall: 'The specific confusion is treating the molecular formula as an identity, which promotes a symbolic atom count into a macroscopic substance. C3H6O names propanal, propanone and prop-2-en-1-ol among others, all with one degree of unsaturation, and those are three different bottles with three different spectra. The formula counts atoms; the constitution says which atom is bonded to which; and only the constitution corresponds one to one with a substance on the shelf.',
    katex: '\\ce{CH3CH2CHO}\\quad \\ce{CH3COCH3}\\quad \\text{both } \\ce{C3H6O}',
    caption: 'Picture the carbonyl carbon at the centre of a flat three-spoked wheel, its three bonds splayed at about 120 degrees in one plane, with the pi cloud above and below the carbon to oxygen axis bunched toward the oxygen end and thin over the carbon.'
  },
  {
    node: 'ORG2.NUCADDITION',
    course: 'ORG2',
    title: 'Nothing leaves, so nothing is subtracted',
    macroscopic: 'Combine a carbonyl compound with water or with hydrogen cyanide and weigh what you isolate. The product\'s mass is the sum of the two starting masses: nothing bubbles out of the flask and no water collects anywhere. The infrared says the same thing from the other side, because the strong carbonyl band near 1700 cm-1 is gone from the product and a broad O-H band has taken its place. Under matched conditions an aldehyde reaches that state faster than a comparable ketone, an ordering the lessons carry from a textbook rather than derive.',
    particulate: 'The nucleophile comes at the electron-poor carbon from above or below the plane of the three bonds, and as the new bond forms the pi electrons move onto the oxygen. The carbon goes from trigonal with three bonds to tetrahedral with four, and the oxygen, now an alkoxide, takes a proton. Describing this as attack first and protonation second is a teaching order rather than a stopwatch reading: proton transfers in a protic medium are fast, they can accompany the addition rather than follow it, and the tetrahedral alkoxide is usually too short-lived to be caught as a separate species. What survives the simplification is the geometry change and the fact that no fragment is expelled.',
    symbolic: 'C2H4O plus H2O gives C2H6O2, the hydrate. C2H4O plus CHN gives C3H5NO, the cyanohydrin. Both product formulas are the exact sum of the two reactant formulas, and that exactness is the notation that distinguishes an addition from a condensation.',
    connector: 'The carbonyl pi bond is one thing in all three: it is the band near 1700 cm-1 that vanishes from the spectrum, it is the pair of electrons that moves onto oxygen as the carbon goes tetrahedral, and it is the one degree of unsaturation that disappears from the product formula.',
    pitfall: 'The specific confusion is importing the arithmetic of a condensation into an addition, so a water that never left gets subtracted on the page. That is a symbolic habit, the sense that carbonyl reactions lose water, and two other levels contradict it: the balance says the product weighs the exact sum of the two reactants, and the particulate event expels no fragment at all, because one pi bond became two sigma bonds and every atom stayed. Losing water is the signature of the acetal and imine condensations, not of a hydrate or a cyanohydrin.',
    katex: '\\ce{C2H4O + H2O -> C2H6O2}\\qquad \\ce{C2H4O + CHN -> C3H5NO}',
    caption: 'Picture the flat three-spoked carbonyl carbon with the nucleophile approaching from directly above the plane. As it arrives the three original bonds fold down away from it like the ribs of a closing umbrella, the carbon becomes a tetrahedron, and the oxygen, now holding both of the old pi electrons, swings down to collect a proton.'
  },
  {
    node: 'ORG2.DERIVATIVEREACTIVITY',
    course: 'ORG2',
    title: 'A ladder you can read off an infrared spectrum',
    macroscopic: 'Run the four acetyl compounds through an infrared spectrometer and the carbonyl band climbs the ladder in step with the reactivity: the amide lowest, near 1630 to 1690 cm-1, the ester near 1735 to 1750 cm-1, the anhydride as a pair of bands near 1760 and 1820 cm-1, and the acid chloride highest, near 1790 to 1815 cm-1. The bench reports the same ordering more coarsely. The compound at the top of the ladder is consumed by traces of moisture in the air, and the one at the bottom can be kept in a bottle indefinitely.',
    particulate: 'Each of the four is the same acyl group attached to a different heteroatom, and that atom does two things at once. A lone pair on it pushes into the carbonyl pi system, which weakens the carbon to oxygen double bond and leaves the carbon less electron poor; nitrogen does this hardest, oxygen less, chlorine barely at all. And it has to leave when a nucleophile completes the substitution, which it does in the reverse order. The resonance structure with a formal positive on nitrogen and a negative on oxygen is not a species the molecule visits some fraction of the time. It is one picture of a single delocalised distribution, and how much the nitrogen donates is a statement about that one distribution.',
    symbolic: 'The ladder is written as an ordering and not as a set of rates: acid chloride, then anhydride, then ester, then amide, most reactive first. Its predictive content is directional. You can write any derivative going to one below it, because the incoming nucleophile brings a worse leaving group than the one being expelled, and the reverse arrow is the one the notation refuses.',
    connector: 'The strength of the carbon to oxygen double bond is one quantity in all three: it is where the infrared band falls, it is how much of the neighbouring atom\'s lone pair has pushed into the pi system, and it is what the four rungs of the ladder are ordered by.',
    pitfall: 'The specific confusion is reading reactivity off a property you can look up for a single atom, its electronegativity, when the particulate cause is a property of the whole group. Nitrogen is more electronegative than carbon and the amide is the least reactive of the four, because that nitrogen\'s lone pair is spent donating into the carbonyl and its anion is a terrible leaving group. The infrared makes the point at the macroscopic level: the amide\'s band sits lowest precisely because its carbon to oxygen bond is the most weakened, and that same donation is what leaves its carbonyl carbon least electrophilic.',
    katex: '',
    caption: 'Picture the same acyl group four times, with a different atom sitting to its left each time and a lone pair on that atom leaning into the carbon to oxygen bond. Under nitrogen the lean is heavy and the double bond is visibly loosened; under oxygen it is lighter; under chlorine the lone pair stays home and the double bond keeps its full strength.'
  },
  {
    node: 'ORG2.POLYMERS',
    course: 'ORG2',
    title: 'The n in the bracket hides a distribution',
    macroscopic: 'Where two difunctional monomer solutions meet at the boundary between two liquid layers, a film forms at that boundary and can be lifted and drawn out as one continuous thread for as long as the boundary keeps feeding it. No small-molecule ester or amide does anything of the kind. The finished material behaves like a polymer in a second way too: it softens over a range of temperature rather than melting sharply at one temperature the way a pure small molecule does. A batch stopped short of complete conversion draws no thread at all.',
    particulate: 'Every link in the chain is the ordinary acyl substitution you already know, an alcohol or an amine adding to a carbonyl and a leaving group departing, and it repeats because each monomer carries two reactive ends, so every new bond still leaves one free at each end of the growing chain. What a sample holds is not one length repeated. It holds a distribution of chain lengths, which is why the material softens over a range instead of melting at a point. The bracketed repeat unit with its subscript n suggests otherwise and is a model: n is an average over that distribution, not the size of a molecule.',
    symbolic: 'n of the diamine plus n of the diacid gives one chain plus 2n water, written with the repeat unit in brackets and n outside them. Ethylene glycol, C2H6O2, with terephthalic acid, C8H6O4, gives a polyester; hexane-1,6-diamine, C6H16N2, with adipic acid, C6H10O4, gives a polyamide. The small molecule lost at each link is what makes these condensation polymers.',
    connector: 'The number of links actually formed per chain is one quantity in all three: it is whether the material draws into a thread or crumbles, it is how many monomers are strung together in the particulate picture, and it is the n written outside the bracket.',
    pitfall: 'The specific confusion is reading the bracketed formula with its n as though it described a single molecule of a fixed size, which makes 95 percent conversion sound like ninety-five percent of the way to that molecule. At the macroscopic level 90 or 95 percent conversion gives chains that are still far too short to be a material, and the average length climbs steeply only in the last few percent. An imbalance in the amounts of the two monomers caps the chains for the same reason. The symbol n hides both the distribution and the steepness, and near-complete is not close enough.',
    katex: 'n\\,\\ce{H2N(CH2)6NH2} + n\\,\\ce{HO2C(CH2)4CO2H} \\longrightarrow \\text{chain} + 2n\\,\\ce{H2O}',
    caption: 'Picture a heap of two-handed monomers, each shaking hands with the next and releasing a small molecule as it does. Some heaps run to a hundred linked units, some stop at three, and the sample is all of those lengths at once rather than a hundred copies of any one of them.'
  },
  {
    node: 'ORG2.ALDOL',
    course: 'ORG2',
    title: 'Two events, two mass balances',
    macroscopic: 'Combine two carbonyl compounds and isolate the first product. Its mass and its combustion analysis say the exact sum: two molecules of C2H4O give one of C4H8O2, with nothing lost. Warm the same flask and a second substance appears whose analysis is C4H6O, lighter by exactly one water. That second substance also absorbs ultraviolet light at a longer wavelength than either partner did, because its new carbon to carbon double bond is conjugated with the carbonyl.',
    particulate: 'Base removes a hydrogen from the carbon next to a carbonyl, leaving an anion whose extra electron density is shared between that carbon and the oxygen. That carbon then attacks the carbonyl carbon of a second molecule, and a new carbon to carbon bond is made. The two drawings of the enolate, one with the charge on carbon and one with it on oxygen, are not two species and the anion does not alternate between them; they are two pictures of one delocalised anion. That it reacts at carbon here is a fact about where the new bond forms, not evidence that the carbon-charged picture is the real one.',
    symbolic: 'Addition first: 2 C2H4O gives C4H8O2, the sum. Dehydration second, and separately: C4H8O2 gives C4H6O plus H2O, one water and no more. Where the carbon that was attacked ends up carrying four different groups it is a stereocentre, so the aldol is written as a racemic pair, and where the alpha carbon becomes one too the product is a set of diastereomers, each a pair of enantiomers.',
    connector: 'The new carbon to carbon bond is one bond in all three: it is why the isolated product weighs the sum of the two partners, it is what the enolate carbon made when it reached the second carbonyl, and it is the bond the formula C4H8O2 accounts for that neither C2H4O had.',
    pitfall: 'The specific confusion is collapsing two particulate events into one symbolic step, writing the enone straight from the two partners and subtracting a water that the addition never lost. The balance is the check: the addition product weighs the exact sum, and only the separate dehydration takes one water off. Skipping the intermediate on paper also hides the stereocentre that was set at the carbon the enolate attacked, so a step that looks like tidy bookkeeping quietly deletes a stereochemical outcome that a real sample would show.',
    katex: '\\ce{2C2H4O -> C4H8O2}\\qquad \\ce{C4H8O2 -> C4H6O + H2O}',
    caption: 'Picture one molecule losing a hydrogen from the carbon beside its carbonyl and the leftover electron density smearing across that carbon and the oxygen. That carbon then reaches out and bonds to the carbonyl carbon of a neighbour, whose oxygen swings down to pick up a proton, leaving a hydroxyl three atoms from a carbonyl.'
  },
  {
    node: 'ORG2.CARBOHYDRATES',
    course: 'ORG2',
    title: 'A label on a molecule, not on the bottle',
    macroscopic: 'Two different solids can be isolated from glucose, and they are genuinely two substances. Dissolve either one fresh in water and watch a polarimeter: the reading drifts and then settles at a steady value and stops moving, and both solids drift to the same steady value. That drift is mutarotation. Combustion analysis of each solid returns C6H12O6, and the settled solution is C6H12O6 as well, so nothing has been added or removed while the reading moved.',
    particulate: 'The C5 hydroxyl of the open-chain sugar adds across the C1 aldehyde, closing a six-membered hemiacetal ring and turning the flat carbonyl carbon into a tetrahedral stereocentre. The carbonyl has two faces, so the ring closes two ways and the anomers are the two results. In water the ring keeps opening back to the free aldehyde and reclosing, so a molecule that was alpha a moment ago may be beta next. The flat hexagon usually drawn, with hydroxyls sticking straight up and down, is a convention chosen to make those up and down relationships readable. The real pyranose ring is puckered, not flat.',
    symbolic: 'The alpha form, the open chain and the beta form are written on one line joined by equilibrium arrows, all three C6H12O6, because forming a hemiacetal rearranges bonds without adding or removing an atom. The alpha and beta labels name the configuration at one carbon, the anomeric one, relative to the reference centre that fixes the D or L series; every other centre is identical between them, which is why they are diastereomers.',
    connector: 'The configuration at the anomeric carbon is one thing in all three: it is what the polarimeter reading is tracking as it drifts, it is the face the C5 oxygen happened to attack from when the ring closed, and it is what the letters alpha and beta name.',
    pitfall: 'The specific confusion is reading alpha and beta as labels on the bottle rather than on a molecule at an instant. Dissolve the pure alpha solid and within a while the solution holds both, which is what the drifting polarimeter reading is reporting, so the label describes a molecule now and not a sample over time. The second half of the same mistake is concluding from a ring drawing with no carbonyl in it that the aldehyde is gone for good. A small fraction of open chain is always present, and that is why glucose still gives the reactions of an aldehyde.',
    katex: '\\text{alpha-D-glucopyranose} \\rightleftharpoons \\text{open chain} \\rightleftharpoons \\text{beta-D-glucopyranose},\\quad \\ce{C6H12O6}\\ \\text{throughout}',
    caption: 'Picture a puckered six-membered ring with one oxygen in it and a new hydroxyl on the carbon beside that oxygen, pointing down. Now picture the ring springing open into a straight chain with a carbonyl at one end, and closing again with that hydroxyl pointing up. Both pictures are in the same glass at the same time.'
  },
  {
    node: 'ORG2.AMINOACIDS',
    course: 'ORG2',
    title: 'Net zero is two charges, not none',
    macroscopic: 'An amino acid is a crystalline solid that dissolves in water and not in a nonpolar solvent, which is how a salt behaves rather than how a small molecule carrying an amine and an acid group would. Titrate a solution and the pH resists change over two separate stretches, not one. Vary the pH and the solubility passes through a minimum, and at that same pH the molecule stops migrating toward either electrode in an electric field. For glycine and alanine that pH falls near 6, a tabulated value rather than one derived here.',
    particulate: 'A carboxylic acid is a better proton donor than an ammonium ion is, so the carboxyl hands its proton to the amine on its own molecule and the particle carries a positive ammonium at one end and a negative carboxylate at the other. It is one neutral particle with two full charges on it, an internal salt. Writing the neutral molecule as H2N-CHR-COOH is a drawing convention carried over from treating the two functional groups separately; in the solid and in water near neutral pH essentially every particle is the zwitterion, and the uncharged form is a minor contributor rather than the normal state.',
    symbolic: 'H2NCH2CO2H and the zwitterion H3N+CH2CO2- are written as one equilibrium, and both are C2H5NO2, because moving a proton within a molecule changes no atom count. The isoelectric point is written as the pH at which the average net charge is zero, computed for a neutral side chain as the average of the two pKa values that flank the zwitterion.',
    connector: 'The pair of opposite charges on one particle is the same fact in all three: it is why the solid behaves like a salt and why solubility bottoms out and migration stops at one particular pH, it is the proton that moved from the carboxyl to the amine, and it is what the plus and the minus in the zwitterion formula record while the net charge reads zero.',
    pitfall: 'The specific confusion is reading net charge zero off the symbol as an absence of charge. The zwitterion carries two full charges; zero is their sum, not their absence, and that distinction is exactly what the macroscopic behaviour turns on, because a particle with no charges would not be a water-soluble crystalline salt and would not stand still in an electric field at one specific pH. The related slip treats the isoelectric point as a property of the solution, a pH it adopts by itself, when it is a property of the molecule: the pH you would have to impose for its charges to balance.',
    katex: '\\ce{H2NCH2CO2H <=> H3N^+CH2CO2^-}\\quad \\text{both } \\ce{C2H5NO2}',
    caption: 'Picture one small molecule with a nitrogen at one end wearing three hydrogens and a full positive charge, and an oxygen pair at the other end sharing a full negative charge, the proton having walked from one end to the other. Nothing entered and nothing left, and the particle as a whole is neutral.'
  },
  {
    node: 'ORG2.RETROSYNTHESIS',
    course: 'ORG2',
    title: 'A plan that is scored on the balance',
    macroscopic: 'The target is a real substance. 2-phenylpropan-2-ol, C9H12O, is something you can isolate, weigh and put in a bottle, and at the end of a route either that material is there and its spectrum matches or it is not. That is the whole of how a route is judged. The pieces the analysis names are substances too: acetophenone, C8H8O, and a methyl organometallic are things you can obtain, which is what makes the plan runnable rather than decorative.',
    particulate: 'The bond being disconnected is one shared pair of electrons between two carbons, and the analysis asks which of the two fragments brought that pair. The synthons it produces, a methyl anion and an oxygen-stabilised cation, are bookkeeping devices rather than particles: no flask holds a free methyl anion. The real particulate event in the forward direction is a nucleophilic carbon, held on a metal, meeting the electron-poor carbon of a carbonyl, and the synthon notation is a way of recording which side of that meeting supplied the electrons.',
    symbolic: 'A double-lined retrosynthetic arrow, read from the target backward, with the two synthons on its right: C9H12O gives the acetophenone-derived cation and a methyl anion. Each synthon is then paired with its synthetic equivalent, the real compound that plays that role forward, and the degrees of unsaturation track the change, four for the ring in the target and five for the ring plus the carbonyl in acetophenone.',
    connector: 'One carbon to carbon bond is the same bond in all three: it is the bond that has to be made for the material to appear on the balance, it is the pair of electrons one fragment brings to the other, and it is the line the retrosynthetic arrow cuts.',
    pitfall: 'The specific confusion is treating a synthon as a reagent, which promotes a piece of notation into a bottle on a shelf. A methyl anion is a way of recording which fragment brought the electrons; the thing you can obtain is a methyl organometallic. The macroscopic test is whether the piece has a supplier. The wider version of the same error scores a route by how tidy the arrows look on the page: the paper level is where the plan is built, and the only place it is settled is the balance at the end, where a route that names fragments no forward reaction can supply returns nothing.',
    katex: '\\ce{C9H12O} \\Longrightarrow \\ce{C8H8O} + \\ce{CH3^-}\\ \\text{(synthon)}',
    caption: 'Picture the target molecule with one line through a single carbon to carbon bond, and the two halves drawn apart with the electrons of that bond given entirely to one of them. One half is left electron rich and negative, the other electron poor and positive, and neither of those halves is a thing you could pour.'
  }
];

export const SCENARIOS: Scenario[] = [
  {
    id: 'sim.titr.weak',
    kind: 'titration',
    engineKey: 'titr.weak.acetic-naoh',
    title: 'Acetic acid titrated with sodium hydroxide',
    description: '25.00 mL of 0.100 M acetic acid in the flask, 0.100 M sodium hydroxide from the burette.',
    stress: {},
    node: 'GEN2.TITRATIONWEAK',
    derived: {
      kind: 'titration',
      curve: [
        {
          v: 0.0,
          ph: 2.8814
        },
        {
          v: 0.312,
          ph: 3.0848
        },
        {
          v: 0.625,
          ph: 3.2572
        },
        {
          v: 0.938,
          ph: 3.3953
        },
        {
          v: 1.25,
          ph: 3.5072
        },
        {
          v: 1.562,
          ph: 3.6003
        },
        {
          v: 1.875,
          ph: 3.6798
        },
        {
          v: 2.188,
          ph: 3.7492
        },
        {
          v: 2.5,
          ph: 3.8109
        },
        {
          v: 2.812,
          ph: 3.8665
        },
        {
          v: 3.125,
          ph: 3.9172
        },
        {
          v: 3.438,
          ph: 3.964
        },
        {
          v: 3.75,
          ph: 4.0075
        },
        {
          v: 4.062,
          ph: 4.0481
        },
        {
          v: 4.375,
          ph: 4.0864
        },
        {
          v: 4.688,
          ph: 4.1227
        },
        {
          v: 5.0,
          ph: 4.1572
        },
        {
          v: 5.312,
          ph: 4.1901
        },
        {
          v: 5.625,
          ph: 4.2217
        },
        {
          v: 5.938,
          ph: 4.252
        },
        {
          v: 6.25,
          ph: 4.2814
        },
        {
          v: 6.562,
          ph: 4.3097
        },
        {
          v: 6.875,
          ph: 4.3372
        },
        {
          v: 7.188,
          ph: 4.364
        },
        {
          v: 7.5,
          ph: 4.3901
        },
        {
          v: 7.812,
          ph: 4.4156
        },
        {
          v: 8.125,
          ph: 4.4405
        },
        {
          v: 8.438,
          ph: 4.4649
        },
        {
          v: 8.75,
          ph: 4.489
        },
        {
          v: 9.062,
          ph: 4.5126
        },
        {
          v: 9.375,
          ph: 4.5359
        },
        {
          v: 9.688,
          ph: 4.5588
        },
        {
          v: 10.0,
          ph: 4.5815
        },
        {
          v: 10.312,
          ph: 4.604
        },
        {
          v: 10.625,
          ph: 4.6263
        },
        {
          v: 10.938,
          ph: 4.6484
        },
        {
          v: 11.25,
          ph: 4.6704
        },
        {
          v: 11.562,
          ph: 4.6922
        },
        {
          v: 11.875,
          ph: 4.714
        },
        {
          v: 12.188,
          ph: 4.7357
        },
        {
          v: 12.5,
          ph: 4.7574
        },
        {
          v: 12.812,
          ph: 4.7791
        },
        {
          v: 13.125,
          ph: 4.8008
        },
        {
          v: 13.438,
          ph: 4.8226
        },
        {
          v: 13.75,
          ph: 4.8445
        },
        {
          v: 14.062,
          ph: 4.8665
        },
        {
          v: 14.375,
          ph: 4.8886
        },
        {
          v: 14.688,
          ph: 4.9109
        },
        {
          v: 15.0,
          ph: 4.9334
        },
        {
          v: 15.312,
          ph: 4.9561
        },
        {
          v: 15.625,
          ph: 4.9791
        },
        {
          v: 15.938,
          ph: 5.0024
        },
        {
          v: 16.25,
          ph: 5.0261
        },
        {
          v: 16.562,
          ph: 5.0502
        },
        {
          v: 16.875,
          ph: 5.0747
        },
        {
          v: 17.188,
          ph: 5.0997
        },
        {
          v: 17.5,
          ph: 5.1252
        },
        {
          v: 17.812,
          ph: 5.1514
        },
        {
          v: 18.125,
          ph: 5.1782
        },
        {
          v: 18.438,
          ph: 5.2058
        },
        {
          v: 18.75,
          ph: 5.2343
        },
        {
          v: 19.062,
          ph: 5.2638
        },
        {
          v: 19.375,
          ph: 5.2943
        },
        {
          v: 19.688,
          ph: 5.3261
        },
        {
          v: 20.0,
          ph: 5.3592
        },
        {
          v: 20.312,
          ph: 5.394
        },
        {
          v: 20.625,
          ph: 5.4306
        },
        {
          v: 20.938,
          ph: 5.4693
        },
        {
          v: 21.25,
          ph: 5.5105
        },
        {
          v: 21.562,
          ph: 5.5546
        },
        {
          v: 21.875,
          ph: 5.6022
        },
        {
          v: 22.188,
          ph: 5.6542
        },
        {
          v: 22.5,
          ph: 5.7114
        },
        {
          v: 22.812,
          ph: 5.7754
        },
        {
          v: 23.125,
          ph: 5.8482
        },
        {
          v: 23.438,
          ph: 5.9332
        },
        {
          v: 23.75,
          ph: 6.0359
        },
        {
          v: 24.062,
          ph: 6.1665
        },
        {
          v: 24.375,
          ph: 6.3482
        },
        {
          v: 24.688,
          ph: 6.6547
        },
        {
          v: 25.0,
          ph: 8.728
        },
        {
          v: 25.312,
          ph: 10.7932
        },
        {
          v: 25.625,
          ph: 11.0915
        },
        {
          v: 25.938,
          ph: 11.2649
        },
        {
          v: 26.25,
          ph: 11.3872
        },
        {
          v: 26.562,
          ph: 11.4815
        },
        {
          v: 26.875,
          ph: 11.558
        },
        {
          v: 27.188,
          ph: 11.6224
        },
        {
          v: 27.5,
          ph: 11.6778
        },
        {
          v: 27.812,
          ph: 11.7264
        },
        {
          v: 28.125,
          ph: 11.7696
        },
        {
          v: 28.438,
          ph: 11.8084
        },
        {
          v: 28.75,
          ph: 11.8437
        },
        {
          v: 29.062,
          ph: 11.8759
        },
        {
          v: 29.375,
          ph: 11.9056
        },
        {
          v: 29.688,
          ph: 11.9331
        },
        {
          v: 30.0,
          ph: 11.9586
        },
        {
          v: 30.312,
          ph: 11.9825
        },
        {
          v: 30.625,
          ph: 12.0049
        },
        {
          v: 30.938,
          ph: 12.0259
        },
        {
          v: 31.25,
          ph: 12.0458
        },
        {
          v: 31.562,
          ph: 12.0645
        },
        {
          v: 31.875,
          ph: 12.0824
        },
        {
          v: 32.188,
          ph: 12.0993
        },
        {
          v: 32.5,
          ph: 12.1154
        },
        {
          v: 32.812,
          ph: 12.1308
        },
        {
          v: 33.125,
          ph: 12.1455
        },
        {
          v: 33.438,
          ph: 12.1595
        },
        {
          v: 33.75,
          ph: 12.173
        },
        {
          v: 34.062,
          ph: 12.1859
        },
        {
          v: 34.375,
          ph: 12.1984
        },
        {
          v: 34.688,
          ph: 12.2103
        },
        {
          v: 35.0,
          ph: 12.2218
        },
        {
          v: 35.312,
          ph: 12.233
        },
        {
          v: 35.625,
          ph: 12.2437
        },
        {
          v: 35.938,
          ph: 12.254
        },
        {
          v: 36.25,
          ph: 12.264
        },
        {
          v: 36.562,
          ph: 12.2737
        },
        {
          v: 36.875,
          ph: 12.2831
        },
        {
          v: 37.188,
          ph: 12.2922
        },
        {
          v: 37.5,
          ph: 12.301
        },
        {
          v: 37.812,
          ph: 12.3096
        },
        {
          v: 38.125,
          ph: 12.3179
        },
        {
          v: 38.438,
          ph: 12.326
        },
        {
          v: 38.75,
          ph: 12.3338
        },
        {
          v: 39.062,
          ph: 12.3415
        },
        {
          v: 39.375,
          ph: 12.3489
        },
        {
          v: 39.688,
          ph: 12.3561
        },
        {
          v: 40.0,
          ph: 12.3632
        },
        {
          v: 40.312,
          ph: 12.37
        },
        {
          v: 40.625,
          ph: 12.3768
        },
        {
          v: 40.938,
          ph: 12.3833
        },
        {
          v: 41.25,
          ph: 12.3897
        },
        {
          v: 41.562,
          ph: 12.3959
        },
        {
          v: 41.875,
          ph: 12.402
        },
        {
          v: 42.188,
          ph: 12.4079
        },
        {
          v: 42.5,
          ph: 12.4137
        },
        {
          v: 42.812,
          ph: 12.4194
        },
        {
          v: 43.125,
          ph: 12.425
        },
        {
          v: 43.438,
          ph: 12.4304
        },
        {
          v: 43.75,
          ph: 12.4357
        },
        {
          v: 44.062,
          ph: 12.4409
        },
        {
          v: 44.375,
          ph: 12.446
        },
        {
          v: 44.688,
          ph: 12.451
        },
        {
          v: 45.0,
          ph: 12.4559
        },
        {
          v: 45.312,
          ph: 12.4607
        },
        {
          v: 45.625,
          ph: 12.4654
        },
        {
          v: 45.938,
          ph: 12.47
        },
        {
          v: 46.25,
          ph: 12.4746
        },
        {
          v: 46.562,
          ph: 12.479
        },
        {
          v: 46.875,
          ph: 12.4834
        },
        {
          v: 47.188,
          ph: 12.4876
        },
        {
          v: 47.5,
          ph: 12.4918
        },
        {
          v: 47.812,
          ph: 12.496
        },
        {
          v: 48.125,
          ph: 12.5
        },
        {
          v: 48.438,
          ph: 12.504
        },
        {
          v: 48.75,
          ph: 12.5079
        },
        {
          v: 49.062,
          ph: 12.5117
        },
        {
          v: 49.375,
          ph: 12.5155
        },
        {
          v: 49.688,
          ph: 12.5192
        },
        {
          v: 50.0,
          ph: 12.5229
        }
      ],
      landmarks: {
        initial_pH: 2.8814,
        half_equivalence_pH: 4.7574,
        equivalence_pH: 8.728,
        equivalence_volume_mL: 25.0,
        past_equivalence_pH: 12.301
      }
    }
  },
  {
    id: 'sim.titr.strong',
    kind: 'titration',
    engineKey: 'titr.strong.hcl-naoh',
    title: 'Hydrochloric acid titrated with sodium hydroxide',
    description: '25.00 mL of 0.100 M hydrochloric acid in the flask, 0.100 M sodium hydroxide from the burette.',
    stress: {},
    node: 'GEN2.TITRATIONSTRONG',
    derived: {
      kind: 'titration',
      curve: [
        {
          v: 0.0,
          ph: 1.0
        },
        {
          v: 0.312,
          ph: 1.0109
        },
        {
          v: 0.625,
          ph: 1.0217
        },
        {
          v: 0.938,
          ph: 1.0326
        },
        {
          v: 1.25,
          ph: 1.0435
        },
        {
          v: 1.562,
          ph: 1.0544
        },
        {
          v: 1.875,
          ph: 1.0653
        },
        {
          v: 2.188,
          ph: 1.0762
        },
        {
          v: 2.5,
          ph: 1.0872
        },
        {
          v: 2.812,
          ph: 1.0981
        },
        {
          v: 3.125,
          ph: 1.1091
        },
        {
          v: 3.438,
          ph: 1.1202
        },
        {
          v: 3.75,
          ph: 1.1313
        },
        {
          v: 4.062,
          ph: 1.1424
        },
        {
          v: 4.375,
          ph: 1.1536
        },
        {
          v: 4.688,
          ph: 1.1648
        },
        {
          v: 5.0,
          ph: 1.1761
        },
        {
          v: 5.312,
          ph: 1.1874
        },
        {
          v: 5.625,
          ph: 1.1988
        },
        {
          v: 5.938,
          ph: 1.2103
        },
        {
          v: 6.25,
          ph: 1.2218
        },
        {
          v: 6.562,
          ph: 1.2335
        },
        {
          v: 6.875,
          ph: 1.2452
        },
        {
          v: 7.188,
          ph: 1.257
        },
        {
          v: 7.5,
          ph: 1.2688
        },
        {
          v: 7.812,
          ph: 1.2808
        },
        {
          v: 8.125,
          ph: 1.2929
        },
        {
          v: 8.438,
          ph: 1.3051
        },
        {
          v: 8.75,
          ph: 1.3174
        },
        {
          v: 9.062,
          ph: 1.3299
        },
        {
          v: 9.375,
          ph: 1.3424
        },
        {
          v: 9.688,
          ph: 1.3551
        },
        {
          v: 10.0,
          ph: 1.368
        },
        {
          v: 10.312,
          ph: 1.381
        },
        {
          v: 10.625,
          ph: 1.3941
        },
        {
          v: 10.938,
          ph: 1.4075
        },
        {
          v: 11.25,
          ph: 1.421
        },
        {
          v: 11.562,
          ph: 1.4347
        },
        {
          v: 11.875,
          ph: 1.4486
        },
        {
          v: 12.188,
          ph: 1.4628
        },
        {
          v: 12.5,
          ph: 1.4771
        },
        {
          v: 12.812,
          ph: 1.4917
        },
        {
          v: 13.125,
          ph: 1.5066
        },
        {
          v: 13.438,
          ph: 1.5217
        },
        {
          v: 13.75,
          ph: 1.5371
        },
        {
          v: 14.062,
          ph: 1.5528
        },
        {
          v: 14.375,
          ph: 1.5689
        },
        {
          v: 14.688,
          ph: 1.5853
        },
        {
          v: 15.0,
          ph: 1.6021
        },
        {
          v: 15.312,
          ph: 1.6192
        },
        {
          v: 15.625,
          ph: 1.6368
        },
        {
          v: 15.938,
          ph: 1.6549
        },
        {
          v: 16.25,
          ph: 1.6734
        },
        {
          v: 16.562,
          ph: 1.6925
        },
        {
          v: 16.875,
          ph: 1.7121
        },
        {
          v: 17.188,
          ph: 1.7324
        },
        {
          v: 17.5,
          ph: 1.7533
        },
        {
          v: 17.812,
          ph: 1.775
        },
        {
          v: 18.125,
          ph: 1.7975
        },
        {
          v: 18.438,
          ph: 1.8208
        },
        {
          v: 18.75,
          ph: 1.8451
        },
        {
          v: 19.062,
          ph: 1.8705
        },
        {
          v: 19.375,
          ph: 1.897
        },
        {
          v: 19.688,
          ph: 1.9249
        },
        {
          v: 20.0,
          ph: 1.9542
        },
        {
          v: 20.312,
          ph: 1.9853
        },
        {
          v: 20.625,
          ph: 2.0182
        },
        {
          v: 20.938,
          ph: 2.0534
        },
        {
          v: 21.25,
          ph: 2.0911
        },
        {
          v: 21.562,
          ph: 2.1318
        },
        {
          v: 21.875,
          ph: 2.1761
        },
        {
          v: 22.188,
          ph: 2.2247
        },
        {
          v: 22.5,
          ph: 2.2788
        },
        {
          v: 22.812,
          ph: 2.3396
        },
        {
          v: 23.125,
          ph: 2.4094
        },
        {
          v: 23.438,
          ph: 2.4914
        },
        {
          v: 23.75,
          ph: 2.5911
        },
        {
          v: 24.062,
          ph: 2.7188
        },
        {
          v: 24.375,
          ph: 2.8976
        },
        {
          v: 24.688,
          ph: 3.2014
        },
        {
          v: 25.0,
          ph: 7.0
        },
        {
          v: 25.312,
          ph: 10.7932
        },
        {
          v: 25.625,
          ph: 11.0915
        },
        {
          v: 25.938,
          ph: 11.2649
        },
        {
          v: 26.25,
          ph: 11.3872
        },
        {
          v: 26.562,
          ph: 11.4815
        },
        {
          v: 26.875,
          ph: 11.558
        },
        {
          v: 27.188,
          ph: 11.6224
        },
        {
          v: 27.5,
          ph: 11.6778
        },
        {
          v: 27.812,
          ph: 11.7264
        },
        {
          v: 28.125,
          ph: 11.7696
        },
        {
          v: 28.438,
          ph: 11.8084
        },
        {
          v: 28.75,
          ph: 11.8437
        },
        {
          v: 29.062,
          ph: 11.8759
        },
        {
          v: 29.375,
          ph: 11.9056
        },
        {
          v: 29.688,
          ph: 11.9331
        },
        {
          v: 30.0,
          ph: 11.9586
        },
        {
          v: 30.312,
          ph: 11.9825
        },
        {
          v: 30.625,
          ph: 12.0049
        },
        {
          v: 30.938,
          ph: 12.0259
        },
        {
          v: 31.25,
          ph: 12.0458
        },
        {
          v: 31.562,
          ph: 12.0645
        },
        {
          v: 31.875,
          ph: 12.0824
        },
        {
          v: 32.188,
          ph: 12.0993
        },
        {
          v: 32.5,
          ph: 12.1154
        },
        {
          v: 32.812,
          ph: 12.1308
        },
        {
          v: 33.125,
          ph: 12.1455
        },
        {
          v: 33.438,
          ph: 12.1595
        },
        {
          v: 33.75,
          ph: 12.173
        },
        {
          v: 34.062,
          ph: 12.1859
        },
        {
          v: 34.375,
          ph: 12.1984
        },
        {
          v: 34.688,
          ph: 12.2103
        },
        {
          v: 35.0,
          ph: 12.2218
        },
        {
          v: 35.312,
          ph: 12.233
        },
        {
          v: 35.625,
          ph: 12.2437
        },
        {
          v: 35.938,
          ph: 12.254
        },
        {
          v: 36.25,
          ph: 12.264
        },
        {
          v: 36.562,
          ph: 12.2737
        },
        {
          v: 36.875,
          ph: 12.2831
        },
        {
          v: 37.188,
          ph: 12.2922
        },
        {
          v: 37.5,
          ph: 12.301
        },
        {
          v: 37.812,
          ph: 12.3096
        },
        {
          v: 38.125,
          ph: 12.3179
        },
        {
          v: 38.438,
          ph: 12.326
        },
        {
          v: 38.75,
          ph: 12.3338
        },
        {
          v: 39.062,
          ph: 12.3415
        },
        {
          v: 39.375,
          ph: 12.3489
        },
        {
          v: 39.688,
          ph: 12.3561
        },
        {
          v: 40.0,
          ph: 12.3632
        },
        {
          v: 40.312,
          ph: 12.37
        },
        {
          v: 40.625,
          ph: 12.3768
        },
        {
          v: 40.938,
          ph: 12.3833
        },
        {
          v: 41.25,
          ph: 12.3897
        },
        {
          v: 41.562,
          ph: 12.3959
        },
        {
          v: 41.875,
          ph: 12.402
        },
        {
          v: 42.188,
          ph: 12.4079
        },
        {
          v: 42.5,
          ph: 12.4137
        },
        {
          v: 42.812,
          ph: 12.4194
        },
        {
          v: 43.125,
          ph: 12.425
        },
        {
          v: 43.438,
          ph: 12.4304
        },
        {
          v: 43.75,
          ph: 12.4357
        },
        {
          v: 44.062,
          ph: 12.4409
        },
        {
          v: 44.375,
          ph: 12.446
        },
        {
          v: 44.688,
          ph: 12.451
        },
        {
          v: 45.0,
          ph: 12.4559
        },
        {
          v: 45.312,
          ph: 12.4607
        },
        {
          v: 45.625,
          ph: 12.4654
        },
        {
          v: 45.938,
          ph: 12.47
        },
        {
          v: 46.25,
          ph: 12.4746
        },
        {
          v: 46.562,
          ph: 12.479
        },
        {
          v: 46.875,
          ph: 12.4834
        },
        {
          v: 47.188,
          ph: 12.4876
        },
        {
          v: 47.5,
          ph: 12.4918
        },
        {
          v: 47.812,
          ph: 12.496
        },
        {
          v: 48.125,
          ph: 12.5
        },
        {
          v: 48.438,
          ph: 12.504
        },
        {
          v: 48.75,
          ph: 12.5079
        },
        {
          v: 49.062,
          ph: 12.5117
        },
        {
          v: 49.375,
          ph: 12.5155
        },
        {
          v: 49.688,
          ph: 12.5192
        },
        {
          v: 50.0,
          ph: 12.5229
        }
      ],
      landmarks: {
        initial_pH: 1.0,
        half_equivalence_pH: 1.4771,
        equivalence_pH: 7.0,
        equivalence_volume_mL: 25.0,
        past_equivalence_pH: 12.301
      }
    }
  },
  {
    id: 'sim.eq.add-h2',
    kind: 'equilibrium',
    engineKey: 'eq.hi.448c',
    title: 'Adding hydrogen to an equilibrium mixture',
    description: 'The hydrogen iodide system has settled at equilibrium at 448 degrees Celsius. A further 0.050 M of hydrogen is injected.',
    stress: {
      H2: 0.05
    },
    node: 'GEN2.LECHATELIER',
    derived: {
      kind: 'equilibrium',
      result: {
        direction: 'forward',
        extent: 0.011472,
        q_before: 15.412394,
        q_after: 50.5,
        k: 50.5,
        stressed: {
          H2: 0.071963,
          I2: 0.021963,
          HI: 0.156075
        },
        final: {
          H2: 0.060491,
          I2: 0.010491,
          HI: 0.179018
        }
      }
    }
  },
  {
    id: 'sim.eq.catalyst',
    kind: 'equilibrium',
    engineKey: 'eq.hi.448c',
    title: 'Adding a catalyst to an equilibrium mixture',
    description: 'The same system at equilibrium. A catalyst is introduced. A catalyst changes no concentration, so the stress applied here is empty, which is exactly what a catalyst is.',
    stress: {},
    node: 'GEN2.LECHATELIER',
    derived: {
      kind: 'equilibrium',
      result: {
        direction: 'none',
        extent: -0.0,
        q_before: 50.5,
        q_after: 50.5,
        k: 50.5,
        stressed: {
          H2: 0.021963,
          I2: 0.021963,
          HI: 0.156075
        },
        final: {
          H2: 0.021963,
          I2: 0.021963,
          HI: 0.156075
        }
      }
    }
  }
];

export const POE_ITEMS: PoeItem[] = [
  {
    id: 'poe.titr.weak-equivalence',
    node: 'GEN2.TITRATIONWEAK',
    scenario: 'sim.titr.weak',
    scenarioTitle: 'Acetic acid titrated with sodium hydroxide',
    predictPrompt: 'Before the titration runs, commit to a prediction. At the equivalence point, where exactly enough sodium hydroxide has been added to react with all the acetic acid, what will the pH be?',
    predictOptions: [
      {
        id: 'below7',
        text: 'Below 7, because the flask started with an acid',
        misconception: 'EQUIV-IS-NEUTRAL',
        feedback: 'The flask did start acidic, but the question is what is left at equivalence, not what was there at the start.'
      },
      {
        id: 'equals7',
        text: 'Exactly 7, because the acid and base have exactly cancelled',
        misconception: 'EQUIV-IS-NEUTRAL',
        feedback: 'Equivalence is a statement about amounts, not about pH. The two are the same only when what remains is inert.'
      },
      {
        id: 'above7',
        text: 'Above 7, because of what the neutralization leaves behind',
        misconception: null,
        feedback: 'Correct. The acetate ion left behind is a weak base.'
      }
    ],
    predictKey: 'above7',
    observePrompt: 'Read the equivalence point off the curve and record the pH you see there.',
    explainPrompt: 'You have seen the curve. Which account explains the pH at equivalence?',
    explainOptions: [
      {
        id: 'acetate-base',
        text: 'Every acetic acid molecule has become acetate, and acetate takes a proton from water, releasing hydroxide',
        misconception: null,
        feedback: 'Correct. The conjugate base of a weak acid is itself a weak base, so the solution at equivalence is basic.'
      },
      {
        id: 'excess-base',
        text: 'Extra sodium hydroxide has been added beyond what was needed',
        misconception: 'EQUIV-IS-NEUTRAL',
        feedback: 'No extra base is present. Equivalence is defined as the point where the amounts match exactly.'
      },
      {
        id: 'sodium-basic',
        text: 'Sodium ions from the base make the solution basic',
        misconception: 'SPECTATOR-ACTIVE',
        feedback: 'Sodium is a spectator. It does not accept or donate protons, so it cannot move the pH.'
      },
      {
        id: 'indicator',
        text: 'The indicator shifted the pH as it changed colour',
        misconception: 'INDICATOR-SETS-EQUIV',
        feedback: 'An indicator reports pH, it does not set it. The amount present is far too small to matter.'
      }
    ],
    explainKey: 'acetate-base',
    reflectionPrompt: 'In your own words, what would have to be true of the acid for the equivalence point to land at pH 7?',
    keyVerified: true,
    keyVerdict: 'simulated equivalence pH is 8.728, which is above7'
  },
  {
    id: 'poe.titr.buffer-region',
    node: 'GEN2.BUFFER',
    scenario: 'sim.titr.weak',
    scenarioTitle: 'Acetic acid titrated with sodium hydroxide',
    predictPrompt: 'Between 5 mL and 20 mL of added base, three quarters of the way through the first half of the titration, how much does the pH change over that 15 mL?',
    predictOptions: [
      {
        id: 'large',
        text: 'Three units or more, since a lot of base is going in',
        misconception: 'STRONG-IS-CONCENTRATED',
        feedback: 'The amount of base added is not what sets the pH change. What is in the flask to absorb it is.'
      },
      {
        id: 'small',
        text: 'Less than about one and a half units',
        misconception: null,
        feedback: 'Correct. This region resists pH change.'
      },
      {
        id: 'falls',
        text: 'The pH falls, because more solution means more dilution',
        misconception: 'STRONG-IS-CONCENTRATED',
        feedback: 'Adding base cannot lower the pH. Dilution moves pH toward 7, it does not reverse the direction of a titration.'
      }
    ],
    predictKey: 'small',
    observePrompt: 'Read the pH at 5 mL and at 20 mL off the curve and record both.',
    explainPrompt: 'Why does the pH move so little across this stretch?',
    explainOptions: [
      {
        id: 'buffer-pair',
        text: 'Both acetic acid and acetate are present in comparable amounts, so added hydroxide is consumed by the acid rather than accumulating',
        misconception: null,
        feedback: 'Correct. This is the buffer region, and it is centred on the half equivalence point where pH equals pKa.'
      },
      {
        id: 'weak-nothing',
        text: 'A weak acid barely reacts, so little happens either way',
        misconception: 'STRONG-IS-CONCENTRATED',
        feedback: 'The acid reacts completely with the added hydroxide. Weak describes how far it dissociates on its own, not whether it reacts with a strong base.'
      },
      {
        id: 'dilution',
        text: 'The added volume dilutes everything, which flattens the curve',
        misconception: 'SPECTATOR-ACTIVE',
        feedback: 'Dilution alone would flatten the strong acid curve too, and it does not. Compare the two curves in this region.'
      }
    ],
    explainKey: 'buffer-pair',
    reflectionPrompt: '',
    keyVerified: true,
    keyVerdict: 'pH moves 0.95 units across the middle half of the buffer region, which is small'
  },
  {
    id: 'poe.lechat.add-h2',
    node: 'GEN2.LECHATELIER',
    scenario: 'sim.eq.add-h2',
    scenarioTitle: 'Adding hydrogen to an equilibrium mixture',
    predictPrompt: 'The hydrogen iodide system sits at equilibrium. More hydrogen is injected. Predict what happens to the position of equilibrium.',
    predictOptions: [
      {
        id: 'forward',
        text: 'It moves toward products, making more hydrogen iodide',
        misconception: null,
        feedback: 'Correct.'
      },
      {
        id: 'reverse',
        text: 'It moves toward reactants, since there is now more reactant',
        misconception: 'LECHAT-AMOUNT',
        feedback: 'The system relieves the stress rather than amplifying it. Adding a reactant drives it away, not further in.'
      },
      {
        id: 'noshift',
        text: 'Nothing shifts, but K rises to accommodate the extra hydrogen',
        misconception: 'LECHAT-AMOUNT',
        feedback: 'K depends only on temperature. Adding a species changes where the system sits, not the constant it sits at.'
      }
    ],
    predictKey: 'forward',
    observePrompt: 'Record the reaction quotient immediately after the injection and the value it returns to.',
    explainPrompt: 'Which account explains what you observed?',
    explainOptions: [
      {
        id: 'q-below-k',
        text: 'The injection dropped Q below K, and the reaction ran forward until Q climbed back to K',
        misconception: null,
        feedback: 'Correct. Q against K is the quantitative statement behind Le Chatelier\'s qualitative rule.'
      },
      {
        id: 'k-changed',
        text: 'K increased because there is now more material in the vessel',
        misconception: 'LECHAT-AMOUNT',
        feedback: 'Check the values you recorded. Q returned to the same K it started at.'
      },
      {
        id: 'collisions',
        text: 'More hydrogen means more collisions, which speeds the forward reaction permanently',
        misconception: 'CATALYST-SHIFTS',
        feedback: 'Rates do rise, but they rise until forward and reverse match again. A permanently faster forward reaction would consume the vessel.'
      }
    ],
    explainKey: 'q-below-k',
    reflectionPrompt: '',
    keyVerified: true,
    keyVerdict: 'engine reports direction forward, read as forward'
  },
  {
    id: 'poe.lechat.catalyst',
    node: 'GEN2.LECHATELIER',
    scenario: 'sim.eq.catalyst',
    scenarioTitle: 'Adding a catalyst to an equilibrium mixture',
    predictPrompt: 'The same system at equilibrium. A catalyst is added. Predict what happens to the amount of hydrogen iodide present once the system has settled again.',
    predictOptions: [
      {
        id: 'more',
        text: 'More hydrogen iodide, since the catalyst speeds the reaction up',
        misconception: 'CATALYST-SHIFTS',
        feedback: 'The catalyst does speed things up. Consider whether it speeds up only one direction.'
      },
      {
        id: 'less',
        text: 'Less hydrogen iodide, since the reverse reaction is favoured',
        misconception: 'CATALYST-SHIFTS',
        feedback: 'A catalyst has no preferred direction, so it cannot favour the reverse reaction either.'
      },
      {
        id: 'unchanged',
        text: 'The same amount, reached sooner',
        misconception: null,
        feedback: 'Correct. A catalyst changes the rate of arrival, not the destination.'
      }
    ],
    predictKey: 'unchanged',
    observePrompt: 'Record the composition before and after. Note the stress the simulation applied.',
    explainPrompt: 'Which account explains the result?',
    explainOptions: [
      {
        id: 'both-directions',
        text: 'The catalyst lowers the activation barrier by the same amount in both directions, so forward and reverse rates rise together and balance at the same composition',
        misconception: null,
        feedback: 'Correct. This is why a catalyst appears nowhere in the equilibrium expression.'
      },
      {
        id: 'used-up',
        text: 'The catalyst was consumed before it could shift anything',
        misconception: 'CATALYST-SHIFTS',
        feedback: 'A catalyst is regenerated. If it were consumed it would be a reactant, and it would appear in the equation.'
      },
      {
        id: 'too-little',
        text: 'Too little catalyst was added to move the position measurably',
        misconception: 'CATALYST-SHIFTS',
        feedback: 'Adding more would speed things further and still land in the same place. The amount is not what is doing the work.'
      }
    ],
    explainKey: 'both-directions',
    reflectionPrompt: '',
    keyVerified: true,
    keyVerdict: 'engine reports direction none, read as unchanged'
  }
];

export const SPECTRA: SpectrumSubject[] = [
  {
    key: 'methane',
    name: 'Methane',
    smiles: 'C',
    environments: [4],
    signalCount: 1,
    degreesUnsaturation: 0.0,
    irBands: [
      'C-H (sp3)'
    ],
    msFragments: [
      {
        mz: 16.0,
        label: 'M+ (molecular ion)',
        note: 'The intact molecule minus one electron. Its mass is the molar mass.'
      }
    ]
  },
  {
    key: 'ethane',
    name: 'Ethane',
    smiles: 'CC',
    environments: [6],
    signalCount: 1,
    degreesUnsaturation: 0.0,
    irBands: [
      'C-H (sp3)'
    ],
    msFragments: [
      {
        mz: 30.1,
        label: 'M+ (molecular ion)',
        note: 'The intact molecule minus one electron. Its mass is the molar mass.'
      },
      {
        mz: 15.0,
        label: 'loss of CH3',
        note: 'A methyl radical breaks off.'
      }
    ]
  },
  {
    key: 'ethene',
    name: 'Ethene',
    smiles: 'C=C',
    environments: [4],
    signalCount: 1,
    degreesUnsaturation: 1.0,
    irBands: [
      'C=C'
    ],
    msFragments: [
      {
        mz: 28.1,
        label: 'M+ (molecular ion)',
        note: 'The intact molecule minus one electron. Its mass is the molar mass.'
      }
    ]
  },
  {
    key: 'ethyne',
    name: 'Ethyne',
    smiles: 'C#C',
    environments: [2],
    signalCount: 1,
    degreesUnsaturation: 2.0,
    irBands: [
      'C-H (sp, terminal alkyne)',
      'C#C'
    ],
    msFragments: [
      {
        mz: 26.0,
        label: 'M+ (molecular ion)',
        note: 'The intact molecule minus one electron. Its mass is the molar mass.'
      }
    ]
  },
  {
    key: 'benzene',
    name: 'Benzene',
    smiles: 'c1ccccc1',
    environments: [6],
    signalCount: 1,
    degreesUnsaturation: 4.0,
    irBands: [
      'C-H (sp2)',
      'aromatic C=C'
    ],
    msFragments: [
      {
        mz: 78.1,
        label: 'M+ (molecular ion)',
        note: 'The intact molecule minus one electron. Its mass is the molar mass.'
      }
    ]
  },
  {
    key: 'ethanol',
    name: 'Ethanol',
    smiles: 'CCO',
    environments: [3, 2, 1],
    signalCount: 3,
    degreesUnsaturation: 0.0,
    irBands: [
      'O-H (alcohol)',
      'C-H (sp3)'
    ],
    msFragments: [
      {
        mz: 46.1,
        label: 'M+ (molecular ion)',
        note: 'The intact molecule minus one electron. Its mass is the molar mass.'
      },
      {
        mz: 31.0,
        label: 'loss of CH3',
        note: 'A methyl radical breaks off.'
      },
      {
        mz: 29.1,
        label: 'loss of OH',
        note: 'The hydroxyl leaves as a radical.'
      },
      {
        mz: 28.1,
        label: 'loss of H2O',
        note: 'Alcohols very commonly lose water.'
      }
    ]
  },
  {
    key: 'acetone',
    name: 'Acetone',
    smiles: 'CC(C)=O',
    environments: [6],
    signalCount: 1,
    degreesUnsaturation: 1.0,
    irBands: [
      'C-H (sp3)',
      'C=O'
    ],
    msFragments: [
      {
        mz: 58.1,
        label: 'M+ (molecular ion)',
        note: 'The intact molecule minus one electron. Its mass is the molar mass.'
      },
      {
        mz: 43.1,
        label: 'loss of CH3',
        note: 'A methyl radical breaks off.'
      },
      {
        mz: 30.1,
        label: 'loss of CO',
        note: 'A carbonyl can lose carbon monoxide.'
      },
      {
        mz: 15.0,
        label: 'loss of CH3CO (acetyl)',
        note: 'Alpha cleavage next to the carbonyl gives the acylium ion.'
      }
    ]
  },
  {
    key: 'acetic_acid',
    name: 'Acetic acid',
    smiles: 'CC(=O)O',
    environments: [3, 1],
    signalCount: 2,
    degreesUnsaturation: 1.0,
    irBands: [
      'O-H (carboxylic acid)',
      'C-H (sp3)',
      'C=O'
    ],
    msFragments: [
      {
        mz: 60.1,
        label: 'M+ (molecular ion)',
        note: 'The intact molecule minus one electron. Its mass is the molar mass.'
      },
      {
        mz: 45.0,
        label: 'loss of CH3',
        note: 'A methyl radical breaks off.'
      },
      {
        mz: 43.0,
        label: 'loss of OH',
        note: 'The hydroxyl leaves as a radical.'
      },
      {
        mz: 32.0,
        label: 'loss of CO',
        note: 'A carbonyl can lose carbon monoxide.'
      },
      {
        mz: 17.0,
        label: 'loss of CH3CO (acetyl)',
        note: 'Alpha cleavage next to the carbonyl gives the acylium ion.'
      }
    ]
  },
  {
    key: 'propene',
    name: 'Propene',
    smiles: 'CC=C',
    environments: [3, 2, 1],
    signalCount: 3,
    degreesUnsaturation: 1.0,
    irBands: [
      'C-H (sp3)',
      'C-H (sp2)',
      'C=C'
    ],
    msFragments: [
      {
        mz: 42.1,
        label: 'M+ (molecular ion)',
        note: 'The intact molecule minus one electron. Its mass is the molar mass.'
      },
      {
        mz: 27.1,
        label: 'loss of CH3',
        note: 'A methyl radical breaks off.'
      }
    ]
  },
  {
    key: 'chloromethane',
    name: 'Chloromethane',
    smiles: 'CCl',
    environments: [3],
    signalCount: 1,
    degreesUnsaturation: 0.0,
    irBands: [
      'C-H (sp3)'
    ],
    msFragments: [
      {
        mz: 50.5,
        label: 'M+ (molecular ion)',
        note: 'The intact molecule minus one electron. Its mass is the molar mass.'
      },
      {
        mz: 35.5,
        label: 'loss of CH3',
        note: 'A methyl radical breaks off.'
      }
    ]
  }
];

export const IR_BANDS = [
  {
    group: 'O-H (alcohol)',
    low: 3200,
    high: 3600,
    shape: 'broad, strong',
    smartsHint: 'hydroxyl'
  },
  {
    group: 'O-H (carboxylic acid)',
    low: 2500,
    high: 3300,
    shape: 'very broad',
    smartsHint: 'carboxyl'
  },
  {
    group: 'C-H (sp3)',
    low: 2850,
    high: 2960,
    shape: 'sharp, medium',
    smartsHint: 'sp3 C-H'
  },
  {
    group: 'C-H (sp2)',
    low: 3020,
    high: 3100,
    shape: 'sharp, medium',
    smartsHint: 'sp2 C-H'
  },
  {
    group: 'C-H (sp, terminal alkyne)',
    low: 3260,
    high: 3330,
    shape: 'sharp, strong',
    smartsHint: 'sp C-H'
  },
  {
    group: 'C=O',
    low: 1670,
    high: 1780,
    shape: 'sharp, very strong',
    smartsHint: 'carbonyl'
  },
  {
    group: 'C=C',
    low: 1620,
    high: 1680,
    shape: 'sharp, weak to medium',
    smartsHint: 'alkene'
  },
  {
    group: 'C#C',
    low: 2100,
    high: 2260,
    shape: 'sharp, weak',
    smartsHint: 'alkyne'
  },
  {
    group: 'aromatic C=C',
    low: 1450,
    high: 1600,
    shape: 'several sharp bands',
    smartsHint: 'aromatic'
  }
] as const;

// counts: 44 triangle views, 4 scenarios, 4 POE items, 10 spectra subjects
