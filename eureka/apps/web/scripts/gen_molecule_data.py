#!/usr/bin/env python3
"""Generate the XR chemistry labs' molecule library from SMILES.

Why this exists
---------------
The previous molecules portal carried hand-typed Cartesian coordinates. Hand
typing 3D geometry is the same category of mistake OCTET's claim system was
built to stop: it looks right on review and is wrong in ways nobody catches.
Everything structural here is instead derived from the SMILES by RDKit --
coordinates, molecular formula, aromaticity, hybridisation, CIP descriptors,
lone-pair counts and steric numbers. Editing the SMILES is the only way to
change the chemistry.

What is derived vs what is authored
-----------------------------------
Derived (RDKit, never typed): coordinates, formula, per-atom hybridisation,
aromatic flags, formal charge, CIP R/S, lone pairs, steric number.
Authored (human, carries teaching intent): the molecule's display name, which
OCTET curriculum nodes it serves, the geometry and polarity descriptions, and
the teaching facts.

Honesty
-------
Coordinates are COMPUTED, not measured. ETKDGv3 embedding followed by MMFF94
optimisation gives a plausible low-energy conformer, not a crystal structure.
The labs say so on screen. Where the course cites an experimental number -- the
154/134/120 pm C-C bond-length trend, the 45 kJ/mol ring-inversion barrier, the
A values -- that cited number stays authoritative and is shown as such; the
geometry here is only the picture.

Running it
----------
RDKit lives in the OCTET api image, not in this app. From the octet directory:

    docker compose exec -T api python - < \
      ../eureka/apps/web/scripts/gen_molecule_data.py > /tmp/out.ts

or use the wrapper documented in the labs' README. The output is written to
stdout as a TypeScript module; redirect it to
src/app/dashboard/xr-labs/_chem/moleculeData.ts.

A fixed random seed makes the embedding reproducible, so regenerating without
changing a SMILES produces a byte-identical file.
"""

from __future__ import annotations

import sys

from rdkit import Chem, RDLogger
from rdkit.Chem import AllChem, Descriptors, rdCIPLabeler, rdMolDescriptors

RDLogger.DisableLog("rdApp.*")

SEED = 0xC0FFEE

# Valence electrons for the main-group elements the labs use. Lone pairs are
# computed from this rather than looked up per molecule, so a new molecule
# cannot arrive with a wrong hand-entered count.
VALENCE_ELECTRONS = {
    "H": 1, "B": 3, "C": 4, "N": 5, "O": 6, "F": 7,
    "Si": 4, "P": 5, "S": 6, "Cl": 7,
    "Br": 7, "I": 7, "Xe": 8, "Se": 6, "Na": 1, "Mg": 2, "Al": 3, "K": 1,
}

# ---------------------------------------------------------------------------
# The library. (key, name, smiles, geometry, polarity, teaches, facts)
#
# `teaches` holds OCTET curriculum node codes. They are what makes this a
# course-aligned lab rather than a molecule zoo: the UI shows a learner which
# lesson each molecule belongs to, and the set was chosen by walking ORG1/ORG2
# unit by unit rather than by picking familiar names.
# ---------------------------------------------------------------------------

ORGANIC = [
    # --- ORG1-U1 Structure and bonding: the hybridisation counting rule -----
    ("methane", "Methane", "C", "Tetrahedral - 109.5 deg", "Nonpolar",
     ["ORG1.HYBRIDORG", "ORG1.ORBITALS"],
     ["Four attached groups, zero lone pairs: steric number 4, so sp3, tetrahedral, 109.5 degrees.",
      "25 percent s character. No leftover p orbital, so no pi bond is possible here.",
      "Four identical C-H dipoles pointing at the vertices of a tetrahedron cancel exactly."]),
    ("ethane", "Ethane", "CC", "Tetrahedral at each carbon", "Nonpolar",
     ["ORG1.HYBRIDORG", "ORG1.NEWMAN"],
     ["Both carbons are sp3. The C-C bond is a sigma bond, cylindrically symmetric about its axis.",
      "Because sigma overlap does not change as the ends turn, rotation is nearly free.",
      "C-C length 154 pm - the long end of the bond-order trend. Cited, not measured here."]),
    ("ethene", "Ethene (ethylene)", "C=C", "Trigonal planar - 120 deg", "Nonpolar",
     ["ORG1.HYBRIDORG", "ORG1.ORBITALS", "ORG1.ALKENENOMEN"],
     ["Three attached groups, no lone pairs: steric number 3, so sp2, trigonal planar, 120 degrees.",
      "One p orbital is left over on each carbon. Side-on overlap makes the pi bond.",
      "The pi bond has a nodal plane through the molecule. Twisting the ends tears the overlap, so this bond does not rotate - which is exactly why cis and trans exist.",
      "C=C length 134 pm."]),
    ("ethyne", "Ethyne (acetylene)", "C#C", "Linear - 180 deg", "Nonpolar",
     ["ORG1.HYBRIDORG", "ORG1.ALKYNENOMEN", "ORG1.ACETYLIDE"],
     ["Two attached groups: steric number 2, so sp, linear, 180 degrees.",
      "Two leftover p orbitals per carbon make two perpendicular pi bonds around one sigma.",
      "50 percent s character holds the bonding electrons close to carbon, which is why the terminal C-H is acidic enough (pKa about 25) to deprotonate with NaNH2.",
      "C#C length 120 pm - the short end of the trend."]),
    ("propene", "Propene", "CC=C", "sp2 alkene plus sp3 methyl", "Very weakly polar",
     ["ORG1.HYBRIDORG", "ORG1.ALKENESTABILITY", "ORG1.HXADDITION"],
     ["One molecule showing both hybridisations: count at each carbon separately.",
      "The allylic C-H bonds hyperconjugate into the pi system, which is where alkene stability trends come from."]),
    ("benzene", "Benzene", "c1ccccc1", "Planar hexagon - 120 deg", "Nonpolar",
     ["ORG2.BENZENE", "ORG2.HUCKEL", "ORG1.RESONANCEORG"],
     ["Every carbon sp2, every angle 120 degrees, the whole ring rigidly planar.",
      "Cyclic, planar, fully conjugated, 4n+2 pi electrons with n=1: aromatic by all four Huckel criteria.",
      "All six C-C bonds are the same length (139 pm), between a single and a double bond. The alternating-bond drawing is a convention, not a claim about the structure.",
      "Aromatic stabilisation is why benzene substitutes rather than adds."]),

    # --- ORG1-U3 Conformational analysis -----------------------------------
    ("butane", "Butane", "CCCC", "Tetrahedral chain, anti conformer", "Nonpolar",
     ["ORG1.NEWMAN", "ORG1.ALKANENOMEN"],
     ["Shown in the anti conformer, the global minimum, with the two methyls 180 degrees apart.",
      "Gauche sits about 3.8 kJ/mol above anti from steric strain; methyl-methyl eclipsed about 19 kJ/mol above. Use the Conformations mode to walk the curve.",
      "Three minima and three maxima per full turn, and they are not all the same height."]),
    ("cyclohexane", "Cyclohexane", "C1CCCCC1", "Chair - essentially strain free", "Nonpolar",
     ["ORG1.CHAIR", "ORG1.RINGSTRAIN", "ORG1.AVALUES"],
     ["The chair puckers three carbons above the mean plane and three below, which lets every angle sit near 109.5 with all bonds staggered.",
      "Each carbon carries one axial bond parallel to the ring axis and one equatorial around the rim.",
      "Ring inversion swaps axial and equatorial everywhere at once, over a barrier of about 45 kJ/mol. It does not move a group between faces - a flip cannot turn cis into trans.",
      "Use the Chair mode to run the inversion and watch which bonds trade places."]),
    ("methylcyclohexane", "Methylcyclohexane", "CC1CCCCC1", "Chair, methyl equatorial", "Nonpolar",
     ["ORG1.AVALUES", "ORG1.CHAIR"],
     ["Drawn with the methyl equatorial, which is the favoured chair by about 7.3 kJ/mol (its A value).",
      "Axial methyl suffers 1,3-diaxial crowding against the two axial hydrogens on the same face.",
      "K = exp(dG/RT) with RT about 2.48 kJ/mol at 298 K puts roughly 95 percent of molecules in the equatorial chair."]),

    # --- ORG1-U4 Stereochemistry -------------------------------------------
    ("butan2ol_r", "(R)-Butan-2-ol", "CC[C@@H](C)O", "Tetrahedral stereocentre", "Polar (-OH)",
     ["ORG1.CHIRALITY", "ORG1.RS", "ORG1.ENANTIODIA"],
     ["C2 carries four different groups (OH, ethyl, methyl, H), so it is a stereocentre.",
      "CIP priorities: O beats the ethyl carbon, which beats methyl, which beats H. Lowest priority points back; O to Et to Me traces clockwise, hence R.",
      "Use Stereochemistry mode to build the mirror image and try to superimpose it."]),
    ("butan2ol_s", "(S)-Butan-2-ol", "CC[C@H](C)O", "Tetrahedral stereocentre", "Polar (-OH)",
     ["ORG1.CHIRALITY", "ORG1.RS", "ORG1.ENANTIODIA"],
     ["The non-superimposable mirror image of the R enantiomer. Same connectivity, same formula, same melting point.",
      "Enantiomers differ only where the environment is itself chiral: a chiral reagent, a chiral column, or plane-polarised light.",
      "Rotating a model does not change R to S. If turning it makes the descriptor change, the descriptor was assigned wrong."]),
    ("tartaric_meso", "meso-Tartaric acid", "O[C@H](C(=O)O)[C@@H](O)C(=O)O",
     "Two stereocentres, internal mirror plane", "Polar",
     ["ORG1.ENANTIODIA", "ORG1.MULTIPLESTEREO"],
     ["Two stereocentres, one R and one S, with a mirror plane running between them.",
      "The molecule is superimposable on its own mirror image, so it is achiral despite having stereocentres. This is meso.",
      "Optically inactive: the two halves rotate light in opposite senses and cancel. Having stereocentres is not the same as being chiral."]),

    # --- ORG1-U6/U9 Reaction-relevant geometry ------------------------------
    ("tbu_cation", "tert-Butyl cation", "C[C+](C)C", "Trigonal planar carbocation", "Cation",
     ["ORG1.CARBOCATION", "ORG1.SN1"],
     ["Three groups, no lone pairs on the cationic carbon: sp2, trigonal planar, 120 degrees.",
      "The empty p orbital sits perpendicular to that plane, open on both faces.",
      "That is the structural reason SN1 at a stereocentre gives both configurations: a nucleophile can attack either face of a flat cation.",
      "Nine C-H bonds hyperconjugate into the empty p orbital, which is why tertiary cations are the stable ones."]),

    # --- ORG1-U1/U2 Polarity and functional groups --------------------------
    ("water", "Water", "O", "Bent - 104.5 deg", "Strongly polar",
     ["GEN1.VSEPR", "GEN1.POLARITY", "ORG1.INDUCTIVE"],
     ["Two bonds plus two lone pairs: steric number 4, so the electron geometry is tetrahedral.",
      "Lone pairs take more angular room than bonds, squeezing H-O-H to 104.5 rather than 109.5.",
      "The molecular shape is bent because shape names where the atoms are, not where the lone pairs are.",
      "Bent plus polar bonds means the dipoles cannot cancel. 1.85 D."]),
    ("ammonia", "Ammonia", "N", "Trigonal pyramidal - 107 deg", "Polar",
     ["GEN1.VSEPR", "GEN1.POLARITY"],
     ["Three bonds plus one lone pair: steric number 4, electron geometry tetrahedral, molecular shape pyramidal.",
      "One lone pair compresses the angle to about 107 - less squeeze than water's two.",
      "That lone pair is the base and the nucleophile. 1.47 D."]),
    ("ethanol", "Ethanol", "CCO", "Tetrahedral carbons, bent at oxygen", "Polar (-OH)",
     ["ORG1.FUNCTIONALGROUPS", "ORG2.ALCOHOLPROPS"],
     ["The hydroxyl dominates the chemistry: hydrogen bond donor and acceptor at once.",
      "Hydrogen bonding is why ethanol boils at 78 C while propane, of similar mass, boils at -42 C.",
      "Oxidation ladder: ethanol to acetaldehyde to acetic acid."]),
    ("acetone", "Acetone", "CC(C)=O", "Trigonal planar at the carbonyl", "Polar (C=O)",
     ["ORG2.CARBONYLSTRUCTURE", "ORG1.HYBRIDORG"],
     ["The carbonyl carbon has three attached groups and no lone pairs: sp2, trigonal planar, about 120 degrees.",
      "Oxygen is far more electronegative, so the C=O is strongly polarised - carbon partially positive and open to nucleophiles.",
      "That polarisation, plus a p orbital perpendicular to the plane, is the whole basis of nucleophilic addition.",
      "The two methyls are equivalent by symmetry: one 1H signal."]),
    ("acetic_acid", "Acetic acid", "CC(=O)O", "Trigonal planar carboxyl", "Polar (carboxylic acid)",
     ["ORG2.ACIDPROPS", "ORG1.PKA"],
     ["One sp2 carbon carrying both C=O and C-OH - the carboxyl group.",
      "pKa 4.76. Acidic because acetate spreads the negative charge over two equivalent oxygens.",
      "In acetate the two C-O bonds become identical, which is the structural signature of real delocalisation."]),
    ("chloromethane", "Chloromethane", "CCl", "Tetrahedral", "Polar",
     ["ORG1.INDUCTIVE", "ORG1.SN2", "GEN1.POLARITY"],
     ["A single polar bond with nothing to cancel it, so the molecular dipole is just the bond dipole. 1.90 D.",
      "Chlorine pulls sigma density toward itself, leaving carbon partially positive - the electrophilic carbon SN2 attacks.",
      "The nucleophile comes in on the face opposite the leaving group, which is why SN2 inverts configuration."]),

    # --- ORG2 Conjugation, carbonyl chemistry, biomolecules -----------------
    ("butadiene", "1,3-Butadiene", "C=CC=C", "Planar, s-trans conformer", "Nonpolar",
     ["ORG2.CONJUGATION", "ORG2.DIELSALDER"],
     ["Four sp2 carbons in a row with four aligned p orbitals: the pi system spans all four.",
      "The central C-C is shorter than an ordinary single bond because it carries partial double-bond character.",
      "Shown s-trans, the favoured conformer. Diels-Alder needs s-cis, which is why the diene must be able to reach that shape."]),
    ("pyridine", "Pyridine", "c1ccncc1", "Planar aromatic ring", "Polar",
     ["ORG2.AROMATICIONS", "ORG2.HETEROCYCLES", "ORG2.HUCKEL"],
     ["Aromatic with six pi electrons, like benzene, but the nitrogen lone pair is NOT in the pi system.",
      "That lone pair sits in an sp2 orbital in the ring plane, pointing outward, so it is available to act as a base.",
      "Contrast pyrrole, where the nitrogen lone pair is needed to reach six pi electrons and so is not basic."]),
    ("glycine_zwitterion", "Glycine (zwitterion)", "[NH3+]CC(=O)[O-]",
     "Tetrahedral N, trigonal planar carboxylate", "Zwitterionic - very polar",
     ["ORG2.AMINOACIDS"],
     ["At physiological pH the amine is protonated and the acid deprotonated at the same time.",
      "Net charge zero, but with full formal charges separated inside one molecule.",
      "Those charges are why amino acids are high-melting solids rather than oils.",
      "Glycine is the only proteinogenic amino acid that is achiral: its alpha carbon carries two hydrogens."]),
    ("l_alanine", "L-Alanine", "C[C@@H](C(=O)O)N", "Tetrahedral stereocentre", "Polar",
     ["ORG2.AMINOACIDS", "ORG1.RS"],
     ["The alpha carbon carries four different groups: methyl, carboxyl, amino, hydrogen.",
      "L-alanine is (S). Nearly every proteinogenic amino acid is L, and cysteine is (R) only because sulfur outranks the carboxyl carbon in CIP, not because its shape differs.",
      "The naming convention and the CIP descriptor answer different questions - do not expect them to agree."]),
    ("glucose_beta", "beta-D-Glucopyranose", "OC[C@H]1O[C@@H](O)[C@H](O)[C@@H](O)[C@@H]1O",
     "Chair pyranose, all substituents equatorial", "Polar",
     ["ORG2.CARBOHYDRATES"],
     ["Five stereocentres on a six-membered ring, and in the beta anomer every OH and the CH2OH can sit equatorial at once.",
      "That unusually comfortable chair is part of why glucose is the sugar biology settled on.",
      "Alpha and beta differ only at the anomeric carbon (C1). They are diastereomers, not enantiomers - an alpha/beta pair differs at one centre out of five.",
      "Anomers interconvert in solution through the open-chain aldehyde: mutarotation."]),
    ("caffeine", "Caffeine", "Cn1cnc2c1c(=O)n(C)c(=O)n2C", "Planar fused bicycle", "Polar",
     ["ORG2.HETEROCYCLES", "ORG2.AMIDES"],
     ["A xanthine alkaloid: a fused six- and five-membered ring system, essentially planar.",
      "Three N-methyl groups are the only sp3 carbons in the molecule - find them by looking for the tetrahedral centres.",
      "Two amide carbonyls make the core strongly polar even though there is no O-H.",
      "It blocks adenosine receptors, which is why it delays the feeling of tiredness rather than supplying energy."]),
]


# ---------------------------------------------------------------------------
# The general chemistry set.
#
# Chosen by walking GEN1 unit 7 (Chemical Bonding and Molecular Geometry) and
# unit 10 (Liquids and Solids) rather than by picking familiar names. The
# polarity contrast set in particular is built around OCTET's own worked
# examples and its named misconception GEN1M11, "polar bonds mean polar
# molecule": CCl4 and BF3 are here specifically because they have strongly
# polar bonds and no molecular dipole at all.
# ---------------------------------------------------------------------------

GENERAL = [
    # --- GEN1.VSEPR / GEN1.POLARITY: the shape-decides-polarity contrast ----
    ("gc_water", "Water", "O", "Bent - 104.5 deg", "Polar - 1.85 D",
     ["GEN1.VSEPR", "GEN1.POLARITY", "GEN1.LEWIS"],
     ["Oxygen carries four electron domains: two bonds and two lone pairs. AX2E2.",
      "The electron geometry is tetrahedral. The molecular shape is bent, because shape names where the ATOMS are.",
      "Lone pairs are held by one nucleus rather than two, so they take more angular room and squeeze the angle from 109.5 to 104.5 degrees.",
      "Two polar bonds at 104.5 degrees cannot cancel. The vector sum is 1.85 D, and that is why water dissolves salt."]),
    ("gc_co2", "Carbon dioxide", "O=C=O", "Linear - 180 deg", "Nonpolar - 0 D",
     ["GEN1.VSEPR", "GEN1.POLARITY"],
     ["Carbon carries two electron domains and no lone pairs. AX2, linear.",
      "A double bond counts as ONE domain. Domains are groups of electrons, not bonds.",
      "Each C=O is strongly polar, and the two point exactly opposite, so the vector sum is zero.",
      "Compare with water: same two attached atoms, completely different shape and behaviour. The lone pairs no formula shows are what decide it."]),
    ("gc_ammonia", "Ammonia", "N", "Trigonal pyramidal - 107 deg", "Polar - 1.47 D",
     ["GEN1.VSEPR", "GEN1.POLARITY", "GEN1.HYBRIDIZATION"],
     ["Four domains, one of them a lone pair. AX3E.",
      "Electron geometry tetrahedral, molecular shape trigonal pyramidal.",
      "One lone pair compresses the angle to about 107 degrees, less squeeze than water's two.",
      "The three N-H dipoles and the lone pair all point the same way, which is why ammonia is strongly polar and a good base."]),
    ("gc_methane", "Methane", "C", "Tetrahedral - 109.5 deg", "Nonpolar - 0 D",
     ["GEN1.VSEPR", "GEN1.HYBRIDIZATION"],
     ["Four domains, no lone pairs. AX4, the undistorted tetrahedron at 109.5 degrees.",
      "C-H bonds are barely polar to begin with, and perfect symmetry cancels what little there is."]),
    ("gc_ccl4", "Carbon tetrachloride", "ClC(Cl)(Cl)Cl", "Tetrahedral - 109.5 deg", "Nonpolar - 0 D",
     ["GEN1.POLARITY", "GEN1.VSEPR"],
     ["Four strongly polar C-Cl bonds, and a molecular dipole of exactly zero.",
      "This is the molecule that separates the two questions. Bond polarity asks about one bond; molecular polarity asks about the vector sum over the whole shape.",
      "Switch on the dipole overlay: four arrows pointing at the corners of a tetrahedron add to nothing.",
      "OCTET names this misconception GEN1M11, polar bonds mean polar molecule."]),
    # BF3 is absent for the same reason as SF6 and PCl5: MMFF94 has no boron
    # parameters. Its unoptimised angles came out 118.2 / 119.1 / 122.7, close
    # enough to 120 to pass a glance and not close enough to teach from. It is
    # built exactly in the lab instead.
    ("gc_chcl3", "Chloroform", "ClC(Cl)Cl", "Tetrahedral", "Polar",
     ["GEN1.POLARITY"],
     ["Swap one chlorine of CCl4 for hydrogen and the cancellation is destroyed.",
      "Same shape, same bond types, and now a real molecular dipole. Symmetry, not bond polarity, was doing the work."]),
    ("gc_so2", "Sulfur dioxide", "O=S=O", "Bent", "Polar",
     ["GEN1.VSEPR", "GEN1.RESONANCE"],
     ["Three domains on sulfur, one of them a lone pair: AX2E, bent, a little under 120 degrees.",
      "Bent like water but for a different reason: three domains rather than four.",
      "Contrast with CO2, which is also O-X-O and is linear. The lone pair is the difference."]),

    # NOTE on the expanded-octet molecules (SF6, PCl5, and the AX_nE_m series
    # generally): they are deliberately NOT in this list. MMFF94 has no
    # parameters for hypervalent sulfur or phosphorus, so RDKit leaves the raw
    # embedding untouched and returns something that is not octahedral or
    # trigonal bipyramidal at all. UFF is no better; it collapses PCl5 to
    # overlapping atoms. Since the whole teaching purpose of those molecules is
    # the ideal shape, the labs build them from exact VSEPR geometry in
    # _chem/procedural.ts, where the angles are exact by construction and
    # asserted in procedural.test.ts.

    # --- GEN1.RESONANCE: delocalisation, not oscillation ---------------------
    ("gc_nitrate", "Nitrate ion", "[O-][N+](=O)[O-]", "Trigonal planar - 120 deg",
     "Anion, no net dipole",
     ["GEN1.RESONANCE", "GEN1.FORMALCHARGE"],
     ["Three equivalent resonance contributors. The real ion is the average of all three at once.",
      "All three N-O bonds are the same length, which no single contributor predicts. That equality is the evidence delocalisation is real.",
      "The molecule does NOT flip between structures. OCTET names that misconception GEN1M14, resonance as oscillation.",
      "Formal charges: nitrogen +1, and the negative charge spread evenly as one third on each oxygen."]),
    # Ozone, [O-][O+]=O, is absent for the same reason: MMFF94 has no
    # parameters for the charge-separated oxygen. Nitrate carries the
    # resonance lesson here, and it is the example OCTET's own GEN1.RESONANCE
    # lesson uses.

    # --- GEN1.IMF: what boiling actually breaks ------------------------------
    ("gc_ethanol", "Ethanol", "CCO", "Bent at oxygen", "Polar, hydrogen bonding",
     ["GEN1.IMF", "GEN1.IMFPROPERTIES"],
     ["An O-H bond means ethanol can both donate and accept a hydrogen bond.",
      "Boils at 78 C.",
      "Compare with dimethyl ether below: identical formula, and a 100 degree difference in boiling point."]),
    ("gc_dimethyl_ether", "Dimethyl ether", "COC", "Bent at oxygen", "Polar, no O-H",
     ["GEN1.IMF", "GEN1.IMFPROPERTIES"],
     ["Same molecular formula as ethanol, C2H6O. A constitutional isomer.",
      "No O-H, so no hydrogen bond donor. Dipole-dipole and dispersion only.",
      "Boils at -24 C, about 100 degrees below ethanol. The difference is entirely intermolecular.",
      "Boiling breaks the forces BETWEEN molecules. It does not break C-O or C-H bonds, which is OCTET's misconception GEN1M13."]),

    # --- Diatomics for bond order and polarity contrast ----------------------
    ("gc_n2", "Dinitrogen", "N#N", "Linear", "Nonpolar",
     ["GEN1.MODIAGRAMS", "GEN1.BONDPROPERTIES"],
     ["A triple bond: bond order 3, the strongest bond in common chemistry.",
      "Identical atoms, so no electronegativity difference and no dipole at all.",
      "Diamagnetic, and that inertness is why the atmosphere is mostly nitrogen."]),
    ("gc_hcl", "Hydrogen chloride", "Cl", "Linear", "Polar - 1.08 D",
     ["GEN1.COVALENTBOND", "GEN1.POLARITY"],
     ["One bond, so the molecular dipole is just the bond dipole. Nothing to cancel it.",
      "The electronegativity gap of about 0.96 makes this a clearly polar covalent bond, not an ionic one.",
      "In water it ionises completely, which is a different question from whether the gas-phase bond is ionic."]),
]


def lone_pairs(atom: Chem.Atom) -> int:
    """Lone pairs from the valence-electron count, not from a lookup table."""
    ve = VALENCE_ELECTRONS.get(atom.GetSymbol())
    if ve is None:
        return 0
    used = sum(b.GetBondTypeAsDouble() for b in atom.GetBonds())
    # Implicit and explicit hydrogens both count as single bonds.
    used += atom.GetTotalNumHs()
    left = ve - atom.GetFormalCharge() - used
    if left < 0:
        return 0
    return int(left // 2)


HYB_LABEL = {
    Chem.HybridizationType.SP: "sp",
    Chem.HybridizationType.SP2: "sp2",
    Chem.HybridizationType.SP3: "sp3",
    Chem.HybridizationType.SP3D: "sp3d",
    Chem.HybridizationType.SP3D2: "sp3d2",
}


def build(entry) -> dict:
    key, name, smiles, geom, polarity, teaches, facts = entry
    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        raise SystemExit(f"{key}: SMILES did not parse: {smiles}")
    mol = Chem.AddHs(mol)

    params = AllChem.ETKDGv3()
    params.randomSeed = SEED
    if AllChem.EmbedMolecule(mol, params) != 0:
        raise SystemExit(f"{key}: embedding failed")

    # Refuse to emit a geometry no force field actually optimised.
    #
    # MMFFOptimizeMolecule returns -1 when the molecule has atoms the force
    # field has no parameters for, and in that case it does nothing at all --
    # the raw ETKDG embedding is left in place and looks like a finished
    # result. Hypervalent centres (SF6, PCl5) hit this, and the geometry that
    # came out was not remotely octahedral or trigonal bipyramidal. A lab that
    # shipped it would be teaching the wrong shape for the exact lesson it
    # claims to serve, so this is a hard failure rather than a warning. Those
    # molecules are built from exact VSEPR geometry instead.
    # Diatomics are exempt, and only diatomics. Two atoms are collinear
    # whatever the force field thinks, so there is no shape to get wrong; the
    # only quantity at risk is the bond length, and nothing in the labs is
    # taught from a diatomic bond length.
    diatomic = mol.GetNumAtoms() == 2
    if not diatomic:
        if not AllChem.MMFFHasAllMoleculeParams(mol):
            raise SystemExit(
                f"{key}: MMFF94 has no parameters for this molecule, so it "
                f"cannot be optimised. Build it from exact VSEPR geometry "
                f"instead of shipping an unoptimised embedding."
            )
        status = AllChem.MMFFOptimizeMolecule(mol, maxIters=2000)
        if status == 1:
            print(f"  warning: {key} did not converge in 2000 MMFF steps",
                  file=sys.stderr)

    Chem.AssignStereochemistry(mol, cleanIt=True, force=True)
    try:
        rdCIPLabeler.AssignCIPLabels(mol)
    except Exception:
        pass

    conf = mol.GetConformer()
    # Centre on the centroid so every molecule opens framed the same way.
    pts = [conf.GetAtomPosition(i) for i in range(mol.GetNumAtoms())]
    cx = sum(p.x for p in pts) / len(pts)
    cy = sum(p.y for p in pts) / len(pts)
    cz = sum(p.z for p in pts) / len(pts)

    atoms = []
    for a in mol.GetAtoms():
        p = conf.GetAtomPosition(a.GetIdx())
        rec = {
            "el": a.GetSymbol(),
            "pos": [round(p.x - cx, 3), round(p.y - cy, 3), round(p.z - cz, 3)],
            "lp": lone_pairs(a),
            "sn": a.GetDegree() + lone_pairs(a),
        }
        hyb = HYB_LABEL.get(a.GetHybridization())
        if hyb and a.GetSymbol() != "H":
            rec["hyb"] = hyb
        if a.GetIsAromatic():
            rec["aromatic"] = True
        if a.GetFormalCharge():
            rec["charge"] = a.GetFormalCharge()
        if a.HasProp("_CIPCode"):
            rec["cip"] = a.GetProp("_CIPCode")
        atoms.append(rec)

    bonds = []
    for b in mol.GetBonds():
        order = 1.5 if b.GetIsAromatic() else b.GetBondTypeAsDouble()
        bonds.append({"a": b.GetBeginAtomIdx(), "b": b.GetEndAtomIdx(),
                      "order": order})

    return {
        "key": key,
        "name": name,
        "smiles": smiles,
        "formula": rdMolDescriptors.CalcMolFormula(mol),
        "mass": round(Descriptors.MolWt(mol), 2),
        "geometry": geom,
        "polarity": polarity,
        "teaches": teaches,
        "facts": facts,
        "atoms": atoms,
        "bonds": bonds,
    }


def ts_value(v, indent: int = 0) -> str:
    pad = "  " * indent
    if isinstance(v, str):
        return "'" + v.replace("\\", "\\\\").replace("'", "\\'") + "'"
    if isinstance(v, bool):
        return "true" if v else "false"
    if isinstance(v, (int, float)):
        return repr(v)
    if isinstance(v, list):
        if v and all(isinstance(x, (int, float)) for x in v):
            return "[" + ", ".join(repr(x) for x in v) + "]"
        inner = ",\n".join(f"{pad}  {ts_value(x, indent + 1)}" for x in v)
        return "[\n" + inner + f"\n{pad}]"
    if isinstance(v, dict):
        inner = ",\n".join(
            f"{pad}  {k}: {ts_value(val, indent + 1)}" for k, val in v.items()
        )
        return "{\n" + inner + f"\n{pad}}}"
    raise TypeError(type(v))


def main() -> None:
    organic = [build(e) for e in ORGANIC]
    general = [build(e) for e in GENERAL]
    out = [
        "// GENERATED FILE - do not edit by hand.",
        "//",
        "// Produced by scripts/gen_molecule_data.py, which derives every",
        "// structural field from the SMILES using RDKit: coordinates",
        "// (ETKDGv3 embedding then MMFF94 optimisation), molecular formula,",
        "// hybridisation, aromaticity, formal charge, CIP descriptors, lone",
        "// pairs and steric numbers. To change the chemistry, change the",
        "// SMILES in that script and regenerate.",
        "//",
        "// Coordinates are COMPUTED, not measured. They are a plausible",
        "// low-energy conformer, good for reading shape, hybridisation and",
        "// polarity; they are not crystallographic data, and the labs say so",
        "// on screen. Experimental numbers the course cites (bond-length",
        "// trends, inversion barriers, A values) stay authoritative and are",
        "// shown as cited text, not read off this geometry.",
        "",
        "import type { Molecule } from './types';",
        "",
        f"export const ORGANIC_MOLECULES: Molecule[] = {ts_value(organic)};",
        "",
        f"export const GENERAL_MOLECULES: Molecule[] = {ts_value(general)};",
        "",
    ]
    print("\n".join(out))


if __name__ == "__main__":
    main()
