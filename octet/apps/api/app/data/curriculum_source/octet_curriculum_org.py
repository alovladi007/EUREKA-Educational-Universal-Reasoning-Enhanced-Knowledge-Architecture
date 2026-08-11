"""OCTET curriculum, organic chemistry (ORG1 and ORG2).

Completes the two year sequence:

  ORG1  Organic Chemistry I    10 units   70 nodes
  ORG2  Organic Chemistry II   10 units   76 nodes

Unit order follows the standard chapter sequence (OpenStax Organic
Chemistry chapter numbers given per unit). Merges with the general
chemistry courses from octet_curriculum_gen and emits the combined
octet_full_curriculum.json.

Spectroscopy sits in ORG1 Unit 10 deliberately, not at the end of ORG2:
it is a tool the rest of the sequence uses, and the elucidation game
needs it live before the reaction load gets heavy.
"""

from __future__ import annotations

import json

from app.data.org_rechapter_map import ORG1_CHAPTERS, ORG2_CHAPTERS
from octet_curriculum_gen import (
    M, N, U, _course, build as build_gen, check, generate_edges, summarize,
)

# ===========================================================================
# ORG1: Organic Chemistry I
# ===========================================================================

_LEGACY_ORG1_UNITS = [
    U("ORG1-U1", "Structure and Bonding", "Ch 1", [
        N("ORG1.ORBITALS", "concept", "Atomic and molecular orbitals in carbon",
          "Why carbon forms four bonds and what shape they take.", "tri"),
        N("ORG1.HYBRIDORG", "computational", "Hybridization and organic geometry",
          "sp3, sp2 and sp centres, and the geometry each one forces.", "tri"),
        N("ORG1.DRAWING", "computational", "Drawing conventions",
          "Lewis, condensed and skeletal structures as the same information."),
        N("ORG1.FORMALCHARGEORG", "computational", "Formal charge in organic structures",
          "Counting electrons on an atom to assign charge correctly."),
        N("ORG1.RESONANCEORG", "computational", "Resonance and resonance rules",
          "Which structures are legal, and which contributor dominates.", "tri"),
        N("ORG1.INDUCTIVE", "concept", "Inductive effects and bond polarity",
          "Electron withdrawal through sigma bonds, and how far it reaches."),
        N("ORG1.FUNCTIONALGROUPS", "concept", "Functional group recognition",
          "The vocabulary the whole course is written in.", "tri"),
    ]),
    U("ORG1-U2", "Acids and Bases in Organic Chemistry", "Ch 2", [
        N("ORG1.PKA", "computational", "Bronsted acidity, pKa and equilibrium direction",
          "Which way a proton transfer goes, from two pKa values."),
        N("ORG1.ACIDITYFACTORS", "concept", "Structural factors controlling acidity",
          "Atom, resonance, induction and orbital, applied in that order."),
        N("ORG1.NUCELEC", "concept", "Nucleophiles, electrophiles and Lewis acids",
          "The electron rich and electron poor labelling that drives every mechanism."),
        N("ORG1.ARROWS", "computational", "Curved arrow formalism",
          "Arrows show electron movement, always from source to sink.", "tri"),
    ]),
    U("ORG1-U3", "Alkanes and Conformational Analysis", "Ch 3-4", [
        N("ORG1.ALKANENOMEN", "computational", "Alkane nomenclature",
          "IUPAC naming, substituents and numbering rules."),
        N("ORG1.ISOMERS", "computational", "Constitutional isomers and degrees of unsaturation",
          "Counting isomers, and reading rings and pi bonds off a formula."),
        N("ORG1.NEWMAN", "computational", "Conformational analysis of acyclic alkanes",
          "Newman projections, torsional strain and energy diagrams."),
        N("ORG1.RINGSTRAIN", "concept", "Cycloalkane strain",
          "Angle, torsional and steric strain across ring sizes."),
        N("ORG1.CHAIR", "computational", "Cyclohexane chair conformations",
          "Axial and equatorial positions, and the ring flip.", "tri"),
        N("ORG1.AVALUES", "computational", "Substituted cyclohexanes and A values",
          "Predicting the favoured chair from substituent size."),
        N("ORG1.CISTRANSRING", "computational", "Cis and trans isomerism in rings",
          "Which substituent combinations can both be equatorial."),
    ]),
    U("ORG1-U4", "Stereochemistry", "Ch 5", [
        N("ORG1.CHIRALITY", "concept", "Chirality and stereocentres",
          "Mirror images that do not superimpose.", "tri"),
        N("ORG1.RS", "computational", "R and S configuration",
          "Cahn Ingold Prelog priority rules applied carefully."),
        N("ORG1.ENANTIODIA", "concept", "Enantiomers, diastereomers and meso compounds",
          "The three relationships, and how to tell them apart."),
        N("ORG1.OPTICALACTIVITY", "computational", "Optical activity and specific rotation",
          "What a polarimeter measures and what it cannot tell you.", "lab"),
        N("ORG1.FISCHER", "computational", "Fischer projections",
          "A flat convention for a three dimensional arrangement."),
        N("ORG1.MULTIPLESTEREO", "computational", "Multiple stereocentres",
          "Counting stereoisomers and spotting internal symmetry."),
        N("ORG1.RESOLUTION", "concept", "Racemic mixtures and resolution",
          "Why enantiomers are hard to separate, and how it is done.", "lab"),
    ]),
    U("ORG1-U5", "Understanding Organic Reactions", "Ch 6", [
        N("ORG1.REACTIONTYPES", "concept", "Reaction types",
          "Addition, elimination, substitution and rearrangement."),
        N("ORG1.HOMOHETERO", "concept", "Homolysis, heterolysis, radicals and polar reactions",
          "Two ways a bond can break, and the arrows each one uses."),
        N("ORG1.ENERGYDIAGRAM", "computational", "Energy diagrams, transition states and intermediates",
          "Reading a mechanism off a reaction coordinate.", "tri"),
        N("ORG1.KINETICTHERMO", "concept", "Kinetic versus thermodynamic control",
          "Fastest product is not always the most stable one."),
        N("ORG1.CARBOCATION", "concept", "Carbocation structure and stability",
          "Hyperconjugation and resonance ranking every cation you will meet.", "tri"),
        N("ORG1.REARRANGEMENT", "computational", "Carbocation rearrangements",
          "Hydride and alkyl shifts, and when to expect them."),
    ]),
    U("ORG1-U6", "Alkenes: Structure and Reactions", "Ch 7-8", [
        N("ORG1.ALKENENOMEN", "computational", "Alkene nomenclature and E Z designation",
          "Naming, and assigning configuration across a double bond."),
        N("ORG1.ALKENESTABILITY", "concept", "Alkene stability",
          "Substitution and hyperconjugation ranking isomeric alkenes."),
        N("ORG1.HXADDITION", "computational", "Electrophilic addition of HX and Markovnikov",
          "The cation forms where it is most stable, and the rule follows."),
        N("ORG1.HYDRATION", "computational", "Hydration: acid catalysed, oxymercuration, hydroboration",
          "Three routes to an alcohol with two different regiochemistries."),
        N("ORG1.HALOGENATION", "computational", "Halogenation and halohydrin formation",
          "Bromonium ion intermediates and anti addition."),
        N("ORG1.HYDROGENATION", "computational", "Catalytic hydrogenation",
          "Syn addition of hydrogen across the double bond."),
        N("ORG1.EPOXIDATION", "computational", "Epoxidation and dihydroxylation",
          "Syn and anti diols, and the reagent that gives each."),
        N("ORG1.OZONOLYSIS", "computational", "Ozonolysis and oxidative cleavage",
          "Cutting the double bond, and working backwards from the fragments."),
        N("ORG1.RADICALHBR", "computational", "Radical addition of HBr",
          "Anti Markovnikov addition, and the peroxide condition that causes it."),
        N("ORG1.ALKENESYNTH", "computational", "Synthesis of alkenes",
          "Elimination routes, previewing the substitution and elimination unit."),
    ]),
    U("ORG1-U7", "Alkynes", "Ch 9", [
        N("ORG1.ALKYNENOMEN", "computational", "Alkyne nomenclature and structure",
          "Linear geometry and sp hybridized carbon."),
        N("ORG1.ACETYLIDE", "computational", "Alkyne acidity and acetylide anions",
          "Terminal alkynes as the only weakly acidic hydrocarbons."),
        N("ORG1.ALKYNEADDITION", "computational", "Addition reactions of alkynes",
          "Adding once or twice, and controlling which."),
        N("ORG1.TAUTOMER", "computational", "Hydration and keto enol tautomerization",
          "Enols that convert to carbonyls, with regiochemistry to choose."),
        N("ORG1.ALKYNEREDUCTION", "computational", "Reduction to cis and trans alkenes",
          "Lindlar and dissolving metal, two stereochemical outcomes."),
        N("ORG1.ALKYNESYNTH", "computational", "Alkyne synthesis and alkylation",
          "Building carbon chains with acetylide nucleophiles."),
    ]),
    U("ORG1-U8", "Organohalides and Radical Reactions", "Ch 10", [
        N("ORG1.HALIDENOMEN", "computational", "Alkyl halide nomenclature and structure",
          "Naming, and the polarity of the carbon halogen bond."),
        N("ORG1.RADICALHALOGEN", "computational", "Radical halogenation of alkanes",
          "Initiation, propagation, termination, and bromine selectivity."),
        N("ORG1.ALLYLIC", "computational", "Allylic bromination",
          "NBS and the resonance stabilized allylic radical."),
        N("ORG1.GRIGNARD", "computational", "Grignard and organolithium reagents",
          "Carbon nucleophiles, and why they cannot meet acidic protons."),
        N("ORG1.COUPLING", "concept", "Organometallic coupling reactions",
          "Gilman reagents and palladium coupling in overview."),
    ]),
    U("ORG1-U9", "Substitution and Elimination", "Ch 11", [
        N("ORG1.SN2", "computational", "The SN2 mechanism",
          "Backside attack, inversion, and second order kinetics.", "tri"),
        N("ORG1.SN2FACTORS", "computational", "SN2 substrate, nucleophile, leaving group and solvent",
          "Four variables that decide whether SN2 runs."),
        N("ORG1.SN1", "computational", "The SN1 mechanism",
          "Rate determining ionization, racemization, first order kinetics.", "tri"),
        N("ORG1.SN1FACTORS", "computational", "SN1 substrate and solvent effects",
          "Cation stability and polar protic solvents."),
        N("ORG1.E2", "computational", "The E2 mechanism",
          "Concerted elimination and the anti periplanar requirement.", "tri"),
        N("ORG1.ZAITSEV", "computational", "Zaitsev and Hofmann regiochemistry",
          "Which alkene forms, and the base that changes the answer."),
        N("ORG1.E2RINGS", "computational", "E2 in cyclohexane rings",
          "Only axial leaving groups eliminate, which constrains the product."),
        N("ORG1.E1", "computational", "The E1 mechanism",
          "Same cation as SN1, different fate."),
        N("ORG1.COMPETITION", "computational", "Predicting substitution versus elimination",
          "A decision procedure over substrate, nucleophile, base and temperature."),
    ]),
    U("ORG1-U10", "Structure Determination", "Ch 12-13", [
        N("ORG1.MSBASICS", "computational", "Mass spectrometry: molecular ion and isotopes",
          "Reading molecular mass and halogen patterns off a spectrum.", "lab"),
        N("ORG1.MSFRAGMENT", "computational", "Mass spectrometry fragmentation",
          "Common cleavages, and what a fragment mass tells you.", "lab"),
        N("ORG1.IRREGIONS", "computational", "Infrared spectroscopy: functional group regions",
          "The four regions, and the bands that are actually diagnostic.", "lab"),
        N("ORG1.IRINTERPRET", "computational", "IR interpretation",
          "Deciding what is present and what is absent.", "lab"),
        N("ORG1.NMRTHEORY", "concept", "NMR theory: shielding and chemical shift",
          "Why different protons resonate at different frequencies.", "tri"),
        N("ORG1.NMRINTEGRATION", "computational", "1H NMR integration",
          "Relative areas as relative proton counts, not absolute ones.", "lab"),
        N("ORG1.NMRSPLITTING", "computational", "1H NMR spin spin splitting",
          "The n plus 1 rule, coupling constants and common patterns.", "lab"),
        N("ORG1.CARBONNMR", "computational", "13C NMR and DEPT",
          "Counting unique carbons and assigning their substitution.", "lab"),
        N("ORG1.ELUCIDATION", "computational", "Combined structure elucidation",
          "Assembling a structure from MS, IR and NMR together.", "lab"),
    ]),
]

_LEGACY_ORG1_UNIT_PREREQS = {
    "ORG1-U1": ["GEN1.HYBRIDIZATION", "GEN1.RESONANCE", "GEN1.VSEPR"],
    "ORG1-U2": ["ORG1.INDUCTIVE", "GEN2.LEWISACID", "GEN2.WEAKACID"],
    "ORG1-U3": ["ORG1.FUNCTIONALGROUPS"],
    "ORG1-U4": ["ORG1.CHAIR"],
    "ORG1-U5": ["ORG1.ARROWS", "GEN2.RDS"],
    "ORG1-U6": ["ORG1.CARBOCATION", "ORG1.ENANTIODIA"],
    "ORG1-U7": ["ORG1.ALKENESYNTH"],
    "ORG1-U8": ["ORG1.HOMOHETERO", "ORG1.ALKYNESYNTH"],
    "ORG1-U9": ["ORG1.GRIGNARD", "ORG1.REARRANGEMENT"],
    "ORG1-U10": ["ORG1.FUNCTIONALGROUPS", "GEN1.LIGHT"],
}

ORG1_EXTRA_EDGES = [
    ("ORG1.PKA", "ORG1.ACETYLIDE"),
    ("ORG1.RS", "ORG1.SN2"),
    ("ORG1.CHAIR", "ORG1.E2RINGS"),
    ("ORG1.E2", "ORG1.E2RINGS"),
    ("ORG1.KINETICTHERMO", "ORG1.ZAITSEV"),
    ("ORG1.TAUTOMER", "ORG1.ALKYNEREDUCTION"),
    ("ORG1.NMRTHEORY", "ORG1.CARBONNMR"),
    ("ORG1.IRINTERPRET", "ORG1.ELUCIDATION"),
    ("ORG1.MSFRAGMENT", "ORG1.ELUCIDATION"),
]

ORG1_MISCONCEPTIONS = [
    M("ORG1M01", "Arrows drawn from atoms",
      "Draws curved arrows starting at an atom instead of an electron pair or bond.",
      "ORG1.ARROWS"),
    M("ORG1M02", "Arrows show atom movement",
      "Reads a curved arrow as an atom moving rather than electrons moving.",
      "ORG1.ARROWS"),
    M("ORG1M03", "Resonance structures interconvert",
      "Treats resonance contributors as species in equilibrium.",
      "ORG1.RESONANCEORG"),
    M("ORG1M04", "Resonance moves atoms",
      "Relocates atoms rather than only pi and lone pair electrons.",
      "ORG1.RESONANCEORG"),
    M("ORG1M05", "Chirality equals four different groups only",
      "Applies the rule mechanically and misses rings and internal symmetry.",
      "ORG1.CHIRALITY"),
    M("ORG1M06", "Meso compounds called chiral",
      "Counts stereocentres without checking for an internal mirror plane.",
      "ORG1.ENANTIODIA"),
    M("ORG1M07", "CIP priority by size",
      "Ranks substituents by mass or bulk instead of atomic number at first difference.",
      "ORG1.RS"),
    M("ORG1M08", "Markovnikov as a rule without a reason",
      "Memorizes the outcome instead of deriving it from cation stability.",
      "ORG1.HXADDITION"),
    M("ORG1M09", "Rearrangement never considered",
      "Reports a product from an unrearranged cation when a shift was available.",
      "ORG1.REARRANGEMENT"),
    M("ORG1M10", "SN1 gives one enantiomer",
      "Forgets that a planar cation is attacked from both faces.",
      "ORG1.SN1"),
    M("ORG1M11", "Strong nucleophile equals strong base",
      "Conflates the two properties, so substitution and elimination are not separated.",
      "ORG1.COMPETITION"),
    M("ORG1M12", "E2 without geometry",
      "Ignores the anti periplanar requirement, especially in rings.",
      "ORG1.E2"),
    M("ORG1M13", "Integration read as absolute count",
      "Reads NMR integration as the number of protons rather than a ratio.",
      "ORG1.NMRINTEGRATION"),
    M("ORG1M14", "Splitting counts neighbours directly",
      "Reports the peak multiplicity as the neighbour count, off by one.",
      "ORG1.NMRSPLITTING"),
    M("ORG1M15", "IR absence ignored",
      "Uses only the bands present and never reasons from the bands missing.",
      "ORG1.IRINTERPRET"),
]

# ===========================================================================
# ORG2: Organic Chemistry II
# ===========================================================================

_LEGACY_ORG2_UNITS = [
    U("ORG2-U1", "Conjugation and Dienes", "Ch 14", [
        N("ORG2.CONJUGATION", "concept", "Conjugated dienes: structure and stability",
          "Overlap across the system, and the stability it buys.", "tri"),
        N("ORG2.ALLYLIC", "concept", "Allylic and conjugated cation stability",
          "Resonance delocalization ranked against alkyl substitution."),
        N("ORG2.CONJUGATEADD", "computational", "1,2 versus 1,4 addition",
          "Kinetic and thermodynamic control made concrete."),
        N("ORG2.DIELSALDER", "computational", "The Diels Alder reaction",
          "Concerted cycloaddition, stereospecific and predictable.", "tri"),
        N("ORG2.DAREQUIREMENTS", "computational", "Diene and dienophile requirements",
          "s cis geometry, electron demand, and endo selectivity."),
        N("ORG2.UVVIS", "computational", "UV visible spectroscopy and conjugation",
          "Absorption wavelength as a report on the conjugated system.", "lab"),
    ]),
    U("ORG2-U2", "Aromaticity", "Ch 15", [
        N("ORG2.BENZENE", "concept", "Benzene structure and stability",
          "Delocalization energy and why benzene does not add.", "tri"),
        N("ORG2.HUCKEL", "computational", "Huckel's rule and the aromaticity criteria",
          "Cyclic, planar, fully conjugated, and 4n plus 2 electrons."),
        N("ORG2.AROMATICIONS", "computational", "Aromatic ions and heterocycles",
          "Cyclopentadienyl, tropylium, pyrrole and pyridine."),
        N("ORG2.ANTIAROMATIC", "concept", "Antiaromatic and nonaromatic systems",
          "Why 4n electrons in a ring is destabilizing."),
        N("ORG2.BENZENENOMEN", "computational", "Nomenclature of benzene derivatives",
          "Ortho, meta, para and the retained common names."),
        N("ORG2.AROMATICSPECTRA", "computational", "Spectroscopy of aromatic compounds",
          "Aromatic shifts and substitution patterns in NMR.", "lab"),
    ]),
    U("ORG2-U3", "Reactions of Aromatic Compounds", "Ch 16", [
        N("ORG2.EASMECH", "computational", "Electrophilic aromatic substitution mechanism",
          "Addition then elimination, restoring aromaticity.", "tri"),
        N("ORG2.EASREACTIONS", "computational", "Halogenation, nitration and sulfonation",
          "Generating the electrophile in each case."),
        N("ORG2.FRIEDELCRAFTS", "computational", "Friedel Crafts alkylation and acylation",
          "Two carbon carbon bond formations, and the limits of each."),
        N("ORG2.ACTIVATING", "concept", "Activating and deactivating substituents",
          "How a substituent changes the ring's reactivity."),
        N("ORG2.DIRECTING", "computational", "Ortho, para and meta directing effects",
          "Resonance and induction deciding where the next group lands."),
        N("ORG2.MULTIPLESUB", "computational", "Multiple substituents and directing conflicts",
          "Which group wins, and where sterics intervene."),
        N("ORG2.NAS", "computational", "Nucleophilic aromatic substitution and benzyne",
          "Two routes to substitution on an electron poor or forced ring."),
        N("ORG2.SIDECHAIN", "computational", "Side chain reactions and ring reduction",
          "Benzylic oxidation, reduction, and the Birch reaction."),
        N("ORG2.AROMATICSYNTH", "computational", "Synthesis strategy on aromatic rings",
          "Order of operations decides whether a target is reachable."),
    ]),
    U("ORG2-U4", "Alcohols, Ethers and Epoxides", "Ch 17-18", [
        N("ORG2.ALCOHOLPROPS", "computational", "Alcohol nomenclature, properties and acidity",
          "Hydrogen bonding, and substituent effects on acidity."),
        N("ORG2.ALCOHOLREDUCTION", "computational", "Alcohols by reduction of carbonyls",
          "Hydride reagents and their relative reactivity."),
        N("ORG2.ALCOHOLGRIGNARD", "computational", "Alcohols from organometallic addition",
          "Building the carbon skeleton and the alcohol in one step."),
        N("ORG2.ALCOHOLSUB", "computational", "Substitution and dehydration of alcohols",
          "Converting a bad leaving group into a good one."),
        N("ORG2.OXIDATION", "computational", "Oxidation of alcohols",
          "Primary to aldehyde or acid, secondary to ketone, and reagent choice."),
        N("ORG2.PROTECTING", "computational", "Protecting groups for alcohols",
          "Silyl ethers, and why a synthesis sometimes needs them."),
        N("ORG2.PHENOLS", "computational", "Phenol chemistry",
          "Enhanced acidity and oxidation to quinones."),
        N("ORG2.WILLIAMSON", "computational", "Ether synthesis and cleavage",
          "The Williamson synthesis as an SN2, with its substrate limits."),
        N("ORG2.EPOXIDE", "computational", "Epoxide synthesis and ring opening",
          "Acidic and basic conditions open at opposite carbons.", "tri"),
        N("ORG2.THIOLS", "concept", "Thiols and sulfides",
          "Sulfur analogues, better nucleophiles and weaker hydrogen bonders."),
    ]),
    U("ORG2-U5", "Aldehydes and Ketones", "Ch 19", [
        N("ORG2.CARBONYLSTRUCTURE", "concept", "Carbonyl structure and nomenclature",
          "The polarized pi bond that organizes the rest of the course.", "tri"),
        N("ORG2.CARBONYLPREP", "computational", "Preparation of aldehydes and ketones",
          "Routes back from alcohols, alkenes, alkynes and acid derivatives."),
        N("ORG2.NUCADDITION", "computational", "Nucleophilic addition",
          "Mechanism, and the steric and electronic reactivity trend.", "tri"),
        N("ORG2.HYDRATEACETAL", "computational", "Hydrates, hemiacetals and acetals",
          "Reversible addition of oxygen nucleophiles."),
        N("ORG2.ACETALPROTECT", "computational", "Acetals as protecting groups",
          "Masking a carbonyl through a basic step."),
        N("ORG2.IMINEENAMINE", "computational", "Imines and enamines",
          "Addition of nitrogen nucleophiles, and the pH dependence."),
        N("ORG2.WITTIG", "computational", "The Wittig reaction",
          "Carbonyl to alkene with unambiguous regiochemistry."),
        N("ORG2.REDUCTIVEAMINATION", "computational", "Reduction and reductive amination",
          "Two of the most used transformations in medicinal chemistry."),
        N("ORG2.CONJUGATEADDITION", "computational", "Conjugate addition to enones",
          "1,2 versus 1,4 addition decided by the nucleophile."),
        N("ORG2.CARBONYLSPECTRA", "computational", "Spectroscopy of carbonyl compounds",
          "The carbonyl stretch, and the aldehyde proton.", "lab"),
    ]),
    U("ORG2-U6", "Carboxylic Acids and Nitriles", "Ch 20", [
        N("ORG2.ACIDPROPS", "computational", "Carboxylic acid structure, nomenclature and acidity",
          "Resonance stabilized conjugate base, and the pKa that follows."),
        N("ORG2.ACIDSUBSTITUENT", "computational", "Substituent effects on acidity",
          "Inductive withdrawal quantified across a series."),
        N("ORG2.ACIDSYNTH", "computational", "Synthesis of carboxylic acids",
          "Oxidation, carboxylation and nitrile hydrolysis."),
        N("ORG2.NITRILES", "computational", "Nitriles: synthesis and reactions",
          "A carbon nucleophile that becomes an acid, ketone or amine."),
        N("ORG2.ACIDSPECTRA", "computational", "Spectroscopy of acids and nitriles",
          "The broad hydroxyl band and the sharp nitrile stretch.", "lab"),
    ]),
    U("ORG2-U7", "Carboxylic Acid Derivatives", "Ch 21", [
        N("ORG2.DERIVATIVEREACTIVITY", "concept", "Structure and relative reactivity of derivatives",
          "One reactivity ladder that predicts every interconversion.", "tri"),
        N("ORG2.ACYLSUB", "computational", "Nucleophilic acyl substitution mechanism",
          "Addition then elimination of the leaving group."),
        N("ORG2.ACIDCHLORIDE", "computational", "Acid chlorides and anhydrides",
          "The most reactive derivatives and what they make."),
        N("ORG2.ESTERS", "computational", "Esters: Fischer esterification and hydrolysis",
          "Equilibrium control, and saponification as the irreversible route."),
        N("ORG2.AMIDES", "computational", "Amides: synthesis and hydrolysis",
          "The least reactive derivative, and the peptide bond."),
        N("ORG2.DERIVATIVEREDUCTION", "computational", "Reduction of acid derivatives",
          "Choosing a reagent that stops at the aldehyde or goes to the alcohol."),
        N("ORG2.DERIVATIVEORGANOMETALLIC", "computational", "Organometallic addition to derivatives",
          "Why esters give tertiary alcohols and acid chlorides can be stopped."),
        N("ORG2.POLYMERS", "concept", "Polyamides and polyesters",
          "Step growth polymerization from the same chemistry.", "tri"),
    ]),
    U("ORG2-U8", "Enols, Enolates and Condensations", "Ch 22-23", [
        N("ORG2.TAUTOMERISM", "computational", "Keto enol tautomerism",
          "Acid and base catalysed interconversion, and where the equilibrium sits."),
        N("ORG2.ENOLATE", "computational", "Enolate formation and acidity",
          "Alpha protons, the base that removes them, and regioselectivity."),
        N("ORG2.ALPHAHALOGEN", "computational", "Alpha halogenation",
          "Acidic and basic conditions, and the haloform reaction."),
        N("ORG2.ALKYLATION", "computational", "Alkylation of enolates and malonic ester synthesis",
          "Making a substituted acetic acid with controlled carbon count."),
        N("ORG2.ACETOACETIC", "computational", "Acetoacetic ester synthesis",
          "The ketone counterpart of the malonic ester route."),
        N("ORG2.ALDOL", "computational", "The aldol reaction and condensation",
          "Enolate plus carbonyl, and the dehydration that follows.", "tri"),
        N("ORG2.CROSSEDALDOL", "computational", "Crossed and intramolecular aldol",
          "Controlling which partner enolizes, and ring formation."),
        N("ORG2.CLAISEN", "computational", "The Claisen and Dieckmann condensations",
          "The ester version, and why it needs a full equivalent of base."),
        N("ORG2.MICHAEL", "computational", "Michael addition and Robinson annulation",
          "Conjugate addition followed by aldol, building a ring."),
    ]),
    U("ORG2-U9", "Amines and Heterocycles", "Ch 24", [
        N("ORG2.AMINEPROPS", "computational", "Amine nomenclature, structure and basicity",
          "What raises and lowers basicity across aliphatic and aromatic amines."),
        N("ORG2.AMINESYNTH", "computational", "Synthesis of amines",
          "Reduction, reductive amination, Gabriel and Hofmann routes."),
        N("ORG2.AMINEREACTIONS", "computational", "Reactions of amines",
          "Hofmann elimination and diazonium chemistry."),
        N("ORG2.HETEROCYCLES", "computational", "Aromatic heterocycles",
          "Pyrrole, furan, pyridine and their contrasting reactivity."),
        N("ORG2.AMINESPECTRA", "computational", "Spectroscopy of amines",
          "N-H stretches and the nitrogen rule in mass spectrometry.", "lab"),
    ]),
    U("ORG2-U10", "Biomolecules and Synthesis Strategy", "Ch 25-26", [
        N("ORG2.CARBOHYDRATES", "computational", "Carbohydrates: structure and anomers",
          "Cyclic forms, anomeric carbon and mutarotation.", "tri"),
        N("ORG2.CARBREACTIONS", "computational", "Carbohydrate reactions and glycosides",
          "Reduction, oxidation and glycoside formation."),
        N("ORG2.AMINOACIDS", "computational", "Amino acids and isoelectric point",
          "Zwitterions, and the pH at which charge cancels.", "tri"),
        N("ORG2.PEPTIDES", "computational", "Peptides, proteins and peptide synthesis",
          "Sequencing, and protecting group strategy on the solid phase."),
        N("ORG2.LIPIDS", "concept", "Lipids and terpenes",
          "Fatty acids, triglycerides and isoprene assembly."),
        N("ORG2.NUCLEICACIDS", "concept", "Nucleic acids",
          "Nucleotides, base pairing and the phosphodiester backbone."),
        N("ORG2.RETROSYNTHESIS", "computational", "Retrosynthetic analysis",
          "Disconnections, synthons and reagent equivalents.", "tri"),
        N("ORG2.MULTISTEP", "computational", "Multistep synthesis design",
          "Functional group interconversion, order of operations, protecting groups."),
    ]),
]

_LEGACY_ORG2_UNIT_PREREQS = {
    "ORG2-U1": ["ORG1.ELUCIDATION", "ORG1.ALKENESTABILITY"],
    "ORG2-U2": ["ORG2.CONJUGATION"],
    "ORG2-U3": ["ORG2.HUCKEL", "ORG1.ARROWS"],
    "ORG2-U4": ["ORG1.COMPETITION", "ORG1.GRIGNARD"],
    "ORG2-U5": ["ORG2.OXIDATION", "ORG1.TAUTOMER"],
    "ORG2-U6": ["ORG2.NUCADDITION", "ORG1.PKA"],
    "ORG2-U7": ["ORG2.ACIDPROPS"],
    "ORG2-U8": ["ORG2.DERIVATIVEREACTIVITY", "ORG2.CARBONYLSTRUCTURE"],
    "ORG2-U9": ["ORG2.REDUCTIVEAMINATION", "ORG2.AMIDES"],
    "ORG2-U10": ["ORG2.MICHAEL", "ORG2.AMINESYNTH", "ORG1.ELUCIDATION"],
}

ORG2_EXTRA_EDGES = [
    ("ORG1.CARBOCATION", "ORG2.ALLYLIC"),
    ("ORG1.KINETICTHERMO", "ORG2.CONJUGATEADD"),
    ("ORG1.ENANTIODIA", "ORG2.DIELSALDER"),
    ("ORG2.EASMECH", "ORG2.DIRECTING"),
    ("ORG2.ACTIVATING", "ORG2.DIRECTING"),
    ("ORG2.DIRECTING", "ORG2.AROMATICSYNTH"),
    ("ORG2.FRIEDELCRAFTS", "ORG2.AROMATICSYNTH"),
    ("ORG1.SN2", "ORG2.WILLIAMSON"),
    ("ORG1.SN2", "ORG2.EPOXIDE"),
    ("ORG2.ENOLATE", "ORG2.MICHAEL"),
    ("ORG2.ALDOL", "ORG2.MICHAEL"),
    ("ORG2.ESTERS", "ORG2.CLAISEN"),
    ("ORG2.ACETALPROTECT", "ORG2.MULTISTEP"),
    ("ORG2.PROTECTING", "ORG2.PEPTIDES"),
    ("ORG2.HYDRATEACETAL", "ORG2.CARBOHYDRATES"),
    ("ORG2.AMINEPROPS", "ORG2.AMINOACIDS"),
    ("ORG2.AROMATICSYNTH", "ORG2.MULTISTEP"),
]

ORG2_MISCONCEPTIONS = [
    M("ORG2M01", "Aromaticity by ring alone",
      "Calls any cyclic conjugated ring aromatic without applying all four criteria.",
      "ORG2.HUCKEL"),
    M("ORG2M02", "Benzene undergoes addition",
      "Applies alkene addition chemistry to an aromatic ring.",
      "ORG2.BENZENE"),
    M("ORG2M03", "Directing effects from electronegativity alone",
      "Predicts orientation from induction and ignores resonance donation.",
      "ORG2.DIRECTING"),
    M("ORG2M04", "Friedel Crafts on any ring",
      "Attempts alkylation on strongly deactivated rings or with rearranging substrates.",
      "ORG2.FRIEDELCRAFTS"),
    M("ORG2M05", "Epoxide opening regiochemistry ignored",
      "Uses the same attack position under acidic and basic conditions.",
      "ORG2.EPOXIDE"),
    M("ORG2M06", "Carbonyl reactivity ladder inverted",
      "Attempts to make an acid chloride from an amide directly.",
      "ORG2.DERIVATIVEREACTIVITY"),
    M("ORG2M07", "Grignard with acidic protons present",
      "Uses an organometallic reagent alongside an alcohol, acid or amine.",
      "ORG2.ALCOHOLGRIGNARD"),
    M("ORG2M08", "Ester Grignard stops at the ketone",
      "Forgets the second addition that gives a tertiary alcohol.",
      "ORG2.DERIVATIVEORGANOMETALLIC"),
    M("ORG2M09", "Wrong alpha carbon enolized",
      "Deprotonates a non alpha position, or ignores thermodynamic and kinetic control.",
      "ORG2.ENOLATE"),
    M("ORG2M10", "Aldol without dehydration",
      "Stops at the beta hydroxy carbonyl when conditions force condensation.",
      "ORG2.ALDOL"),
    M("ORG2M11", "Claisen run with catalytic base",
      "Uses substoichiometric base, so the driving deprotonation never happens.",
      "ORG2.CLAISEN"),
    M("ORG2M12", "Amine basicity by substitution count only",
      "Ignores resonance delocalization in anilines and amides.",
      "ORG2.AMINEPROPS"),
    M("ORG2M13", "Retrosynthesis run forwards",
      "Proposes reagents instead of disconnections, so the analysis never simplifies.",
      "ORG2.RETROSYNTHESIS"),
    M("ORG2M14", "Protecting groups omitted",
      "Designs a route in which a reagent destroys a functional group elsewhere.",
      "ORG2.MULTISTEP"),
    M("ORG2M15", "Anomers called enantiomers",
      "Misclassifies alpha and beta anomers, which are diastereomers.",
      "ORG2.CARBOHYDRATES"),
]


# ===========================================================================
# Chapter structure
#
# The unit literals above are now a NODE REGISTRY, not the chapter order. The
# order comes from app.data.org_rechapter_map, which is a plain declaration of
# which node belongs to which chapter and is gated by audit_org_rechapter.py:
# that audit fails if any authored node appears in no chapter, so a curriculum
# reorganisation cannot quietly shrink the course.
#
# Editing the literals above still works for node WORDING. To move a node
# between chapters, edit the map.
# ===========================================================================

_NEW_NODES = [
    N("ORG1.ALKENEBONDING", "concept", "Alkene bonding and restricted rotation",
      "The pi bond, why it blocks rotation, and what that does to isomerism.", "tri"),
    N("ORG1.CATALYSIS", "concept", "Catalysis",
      "A catalyst lowers the barrier and is regenerated; it never moves the equilibrium.", "tri"),
    N("ORG1.IMFTYPES", "concept", "The noncovalent interactions",
      "Dispersion, dipole-dipole and hydrogen bonding, and their relative strengths.", "tri"),
    N("ORG1.DISPERSION", "concept", "London dispersion and molecular shape",
      "Why surface area, not just mass, sets the strength of dispersion.", "tri"),
    N("ORG1.DIPOLE", "concept", "Dipole-dipole interactions and molecular polarity",
      "Adding bond dipoles as vectors, and when symmetry cancels them.", "tri"),
    N("ORG1.HBONDING", "concept", "Hydrogen bonding: donors and acceptors",
      "Which groups donate, which accept, and why N, O and F are the condition.", "tri"),
    N("ORG1.IMFPROPERTIES", "computational", "Predicting boiling and melting points",
      "Ranking compounds by the interactions their structures allow.", "tri"),
    N("ORG1.SOLUBILITY", "computational", "Solubility and like dissolves like",
      "Reading a structure for the balance of polar and nonpolar surface.", "tri lab"),
    N("ORG2.GLYCOLS", "concept", "Glycols: formation and cleavage",
      "1,2-diols from dihydroxylation, and their oxidative cleavage.", "tri"),
    N("ORG2.SULFIDES", "concept", "Sulfides, sulfoxides and sulfones",
      "Sulfur as a soft nucleophile, and the oxidation ladder above it.", "tri"),
    N("ORG2.BENZYLIC", "concept", "Benzylic reactivity",
      "Why the ring stabilises a benzylic radical, cation and anion alike.", "tri"),
    N("ORG2.ARYLVINYLIC", "concept", "Aryl and vinylic halides",
      "Why sp2 carbon resists both SN1 and SN2, and what does react.", "tri"),
    N("ORG2.CROSSCOUPLING", "concept", "Transition metal catalysed cross coupling",
      "The oxidative addition, transmetalation and reductive elimination cycle.", "tri"),
]

_REGISTRY = {n["id"]: n for u in (_LEGACY_ORG1_UNITS + _LEGACY_ORG2_UNITS)
             for n in u["nodes"]}
_REGISTRY.update({n["id"]: n for n in _NEW_NODES})


def _chapters(course_id, table):
    """Build U() units from the chapter map, preserving lettered sub-parts."""
    grouped = []
    for num, title, part, ids in table:
        if grouped and grouped[-1][0] == num:
            grouped[-1][2].append((part, ids))
        else:
            grouped.append((num, title, [(part, ids)]))
    units = []
    for num, title, blocks in grouped:
        nodes, parts = [], []
        for part, ids in blocks:
            if part:
                parts.append({"part": part, "count": len(ids)})
            for nid in ids:
                node = dict(_REGISTRY[nid])
                if part:
                    node["part"] = part
                nodes.append(node)
        unit = U(f"{course_id}-U{num}", title, f"Ch {num}", nodes)
        if parts:
            unit["parts"] = parts
        units.append(unit)
    return units


ORG1_UNITS = _chapters("ORG1", ORG1_CHAPTERS)
ORG2_UNITS = _chapters("ORG2", ORG2_CHAPTERS)

#: Each chapter builds on the last node of the one before it. The first
#: chapter of each course keeps the cross course prerequisites it declared.
def _prereqs(course_id, units, legacy):
    # The first chapter keeps its CROSS COURSE prerequisites only. The legacy
    # list for ORG2-U1 named ORG1.ELUCIDATION - "start organic II once you can
    # elucidate a structure" - which was true while spectroscopy lived in ORG1.
    # Spectroscopy is now ORG2 chapter 4, so that entry became a prerequisite
    # pointing forwards inside the same course, and closed a cycle. Anything
    # that now lives in this course cannot be a prerequisite for entering it.
    here = {n["id"] for u in units for n in u["nodes"]}
    out = {units[0]["id"]: [n for n in legacy.get(f"{course_id}-U1", [])
                            if n not in here]}
    for prev, unit in zip(units, units[1:]):
        out[unit["id"]] = [prev["nodes"][-1]["id"]]
    return out


ORG1_UNIT_PREREQS = _prereqs("ORG1", ORG1_UNITS, _LEGACY_ORG1_UNIT_PREREQS)
ORG2_UNIT_PREREQS = _prereqs("ORG2", ORG2_UNITS, _LEGACY_ORG2_UNIT_PREREQS)


def build() -> dict:
    cur = build_gen()
    for cid, title, semester, units, prereqs, extra, misc in [
        ("ORG1", "Organic Chemistry I", "Year 2 semester 1",
         ORG1_UNITS, ORG1_UNIT_PREREQS, ORG1_EXTRA_EDGES, ORG1_MISCONCEPTIONS),
        ("ORG2", "Organic Chemistry II", "Year 2 semester 2",
         ORG2_UNITS, ORG2_UNIT_PREREQS, ORG2_EXTRA_EDGES, ORG2_MISCONCEPTIONS),
    ]:
        c = _course(cid, title, semester, units, prereqs, extra, misc)
        c["edges"] = generate_edges(c)
        cur["courses"].append(c)
    return cur


if __name__ == "__main__":
    cur = build()
    print("OCTET full sequence: two years, general chemistry through organic")
    summarize(cur)
    probs = check(cur)
    print(f"integrity problems: {len(probs)}")
    for p in probs:
        print("  PROBLEM:", p)
    with open("octet_full_curriculum.json", "w") as f:
        json.dump(cur, f, indent=2)
    print("wrote octet_full_curriculum.json")
