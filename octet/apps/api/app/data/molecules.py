"""The OCTET curated molecule library (Phase 2, v1).

Authoring rule that matters: each entry carries a name, a SMILES string, a
category and a real world note. It does NOT carry a formula or a molar mass.
Those are derived from the structure by RDKit in build_molecule_library(), so
a hand typed formula can never disagree with the structure it claims to
describe. That whole class of error is designed out.

What is still a human responsibility, and therefore still reviewed: that the
name matches the structure. RDKit will reject invalid SMILES but cannot know
that a structure labelled "caffeine" really is caffeine. Every entry reads
review="pending" until a subject matter expert confirms the name to structure
mapping. Nothing here may be presented as expert verified before then.

Safety policy (build prompt Section 18). This library is the ONLY pool the
generative surfaces draw from, including the retrosynthesis trainer targets
and the AI tutor's retrieval scope.

Two different ideas are deliberately kept in two different fields, because
collapsing them makes the library useless:

  hazard_notes   How dangerous the substance is to handle. Ethanol is
                 flammable, acetic acid is corrosive. This is teaching
                 information that lab adjacent content should surface, and it
                 restricts nothing. Gating on it would remove ethanol and
                 vinegar from a chemistry course.

  safety_flags   Policy exclusion. A non empty value keeps the entry out of
                 every generative surface via molecule_pool(). It is reserved
                 for the Section 18 categories: weapons, explosives, chemical
                 warfare agents, controlled substances, and precursors to any
                 of them. No entry in this file carries one, because nothing
                 in those categories was authored into it, and nothing in
                 those categories may be added.

Stereochemistry note. Sugars here are written without stereochemistry, so
glucose and galactose would be the same graph. Only one of each such pair is
listed rather than listing two names for one structure. Stereochemically
distinguished sugars arrive with the stereo aware structure grader in Phase 5.
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class MoleculeEntry:
    name: str
    smiles: str
    category: str
    real_world_note: str
    # Handling hazards. Teaching information only. Does NOT restrict use, or
    # ethanol and acetic acid could never appear in a question.
    hazard_notes: tuple[str, ...] = ()
    # Policy exclusion under build prompt Section 18. A non empty value keeps
    # the entry out of every generative surface. Nothing in this library
    # carries one, because nothing hazardous under that policy was authored
    # into it, and nothing may be added.
    safety_flags: tuple[str, ...] = ()
    review: str = "pending"


# Category vocabulary, used by the curriculum to pull era appropriate examples.
CATEGORIES = (
    "inorganic",
    "hydrocarbon",
    "alcohol_ether",
    "carbonyl",
    "acid_ester",
    "amine_amide",
    "amino_acid",
    "carbohydrate",
    "pharmaceutical",
    "natural_product",
)


MOLECULES: tuple[MoleculeEntry, ...] = (
    # ---------------- inorganic and small molecules (28) ----------------
    MoleculeEntry("water", "O", "inorganic", "The solvent of essentially all biology."),
    MoleculeEntry("hydrogen peroxide", "OO", "inorganic", "Antiseptic and bleaching agent, decomposes to water and oxygen.", ("oxidizer",)),
    MoleculeEntry("ammonia", "N", "inorganic", "Fertilizer feedstock and household cleaner.", hazard_notes=("corrosive", "toxic_inhalation")),
    MoleculeEntry("carbon dioxide", "O=C=O", "inorganic", "Product of respiration and combustion, and the main greenhouse gas humans emit."),
    MoleculeEntry("carbon monoxide", "[C-]#[O+]", "inorganic", "Odourless product of incomplete combustion that binds hemoglobin.", ("toxic_inhalation",)),
    MoleculeEntry("methane", "C", "hydrocarbon", "The main component of natural gas.", ("flammable",)),
    MoleculeEntry("sulfur dioxide", "O=S=O", "inorganic", "Volcanic gas and the precursor to acid rain.", ("toxic_inhalation",)),
    MoleculeEntry("sulfuric acid", "OS(=O)(=O)O", "inorganic", "The most produced industrial chemical in the world.", ("corrosive",)),
    MoleculeEntry("nitric acid", "O[N+](=O)[O-]", "inorganic", "Used in fertilizer production, a strong oxidizing acid.", hazard_notes=("corrosive", "oxidizer")),
    MoleculeEntry("phosphoric acid", "OP(=O)(O)O", "inorganic", "The tang in cola drinks.", ("corrosive",)),
    MoleculeEntry("hydrogen chloride", "Cl", "inorganic", "Dissolves in water to give hydrochloric acid, also your stomach acid.", ("corrosive",)),
    MoleculeEntry("hydrogen fluoride", "F", "inorganic", "Etches glass, and the classic weak acid that is still dangerous.", hazard_notes=("corrosive", "toxic_contact")),
    MoleculeEntry("hydrogen sulfide", "S", "inorganic", "The rotten egg smell, and it deadens your sense of smell as it poisons you.", hazard_notes=("toxic_inhalation", "flammable")),
    MoleculeEntry("hydrogen cyanide", "C#N", "inorganic", "Present in apple seeds in trace amounts as a glycoside.", ("toxic_inhalation",)),
    MoleculeEntry("sodium chloride", "[Na+].[Cl-]", "inorganic", "Table salt, and the standard example of an ionic lattice."),
    MoleculeEntry("sodium hydroxide", "[Na+].[OH-]", "inorganic", "Lye, used in soap making and drain cleaner.", ("corrosive",)),
    MoleculeEntry("sodium bicarbonate", "[Na+].OC([O-])=O", "inorganic", "Baking soda, the base in most chemical leavening."),
    MoleculeEntry("calcium carbonate", "[Ca+2].[O-]C([O-])=O", "inorganic", "Limestone, chalk, seashells and antacid tablets."),
    MoleculeEntry("calcium hydroxide", "[Ca+2].[OH-].[OH-]", "inorganic", "Slaked lime, used in mortar and to treat soil."),
    MoleculeEntry("magnesium sulfate", "[Mg+2].[O-]S(=O)(=O)[O-]", "inorganic", "Epsom salt."),
    MoleculeEntry("potassium permanganate", "[K+].[O-][Mn](=O)(=O)=O", "inorganic", "Deep purple oxidizing agent used in water treatment.", ("oxidizer",)),
    MoleculeEntry("silver nitrate", "[Ag+].[N+](=O)([O-])[O-]", "inorganic", "Used in the classic chloride precipitation test.", hazard_notes=("corrosive", "oxidizer")),
    MoleculeEntry("barium sulfate", "[Ba+2].[O-]S(=O)(=O)[O-]", "inorganic", "So insoluble it is safe to drink as an X ray contrast agent."),
    MoleculeEntry("ammonium chloride", "[NH4+].[Cl-]", "inorganic", "Salty liquorice flavouring and an electrolyte in dry cells."),
    MoleculeEntry("sodium carbonate", "[Na+].[Na+].[O-]C([O-])=O", "inorganic", "Washing soda, used to soften water."),
    MoleculeEntry("nitrous oxide", "[N-]=[N+]=O", "inorganic", "Dental anaesthetic and whipped cream propellant."),
    MoleculeEntry("ozone", "[O-][O+]=O", "inorganic", "Absorbs ultraviolet light in the stratosphere, a pollutant at ground level."),
    MoleculeEntry("sulfur hexafluoride", "FS(F)(F)(F)(F)F", "inorganic", "The classic exception to the octet rule, and a potent greenhouse gas."),

    # ---------------- hydrocarbons (30) ----------------
    MoleculeEntry("ethane", "CC", "hydrocarbon", "Second component of natural gas.", ("flammable",)),
    MoleculeEntry("propane", "CCC", "hydrocarbon", "Bottled fuel gas for grills and heaters.", ("flammable",)),
    MoleculeEntry("butane", "CCCC", "hydrocarbon", "Lighter fuel.", ("flammable",)),
    MoleculeEntry("isobutane", "CC(C)C", "hydrocarbon", "A structural isomer of butane, and a refrigerant.", ("flammable",)),
    MoleculeEntry("pentane", "CCCCC", "hydrocarbon", "The shortest alkane that is a liquid at room temperature.", ("flammable",)),
    MoleculeEntry("hexane", "CCCCCC", "hydrocarbon", "Solvent used to extract vegetable oils.", ("flammable",)),
    MoleculeEntry("heptane", "CCCCCCC", "hydrocarbon", "The zero point of the octane rating scale.", ("flammable",)),
    MoleculeEntry("octane", "CCCCCCCC", "hydrocarbon", "The reference hydrocarbon for fuel rating.", ("flammable",)),
    MoleculeEntry("isooctane", "CC(C)CC(C)(C)C", "hydrocarbon", "The 100 point of the octane rating scale.", ("flammable",)),
    MoleculeEntry("decane", "CCCCCCCCCC", "hydrocarbon", "A component of kerosene.", ("flammable",)),
    MoleculeEntry("cyclohexane", "C1CCCCC1", "hydrocarbon", "The ring whose chair flip explains conformational analysis.", ("flammable",)),
    MoleculeEntry("cyclopentane", "C1CCCC1", "hydrocarbon", "A five membered ring with slight puckering.", ("flammable",)),
    MoleculeEntry("cyclopropane", "C1CC1", "hydrocarbon", "Ring strain in its most extreme common form.", ("flammable",)),
    MoleculeEntry("ethene", "C=C", "hydrocarbon", "Ethylene, the plant hormone that ripens fruit and the feedstock for polyethylene.", ("flammable",)),
    MoleculeEntry("propene", "CC=C", "hydrocarbon", "Propylene, feedstock for polypropylene.", ("flammable",)),
    MoleculeEntry("1-butene", "CCC=C", "hydrocarbon", "A terminal alkene used in polymer production.", ("flammable",)),
    MoleculeEntry("2-butene", "CC=CC", "hydrocarbon", "Shows cis and trans isomerism about the double bond.", ("flammable",)),
    MoleculeEntry("1,3-butadiene", "C=CC=C", "hydrocarbon", "Conjugated diene used to make synthetic rubber.", ("flammable",)),
    MoleculeEntry("ethyne", "C#C", "hydrocarbon", "Acetylene, burns hot enough to weld steel.", ("flammable",)),
    MoleculeEntry("propyne", "CC#C", "hydrocarbon", "A terminal alkyne with an acidic hydrogen.", ("flammable",)),
    MoleculeEntry("benzene", "c1ccccc1", "hydrocarbon", "The parent aromatic ring.", hazard_notes=("flammable", "carcinogen")),
    MoleculeEntry("toluene", "Cc1ccccc1", "hydrocarbon", "A common industrial solvent.", ("flammable",)),
    MoleculeEntry("o-xylene", "Cc1ccccc1C", "hydrocarbon", "One of three xylene isomers, used to make phthalic anhydride.", ("flammable",)),
    MoleculeEntry("p-xylene", "Cc1ccc(C)cc1", "hydrocarbon", "Feedstock for PET plastic bottles.", ("flammable",)),
    MoleculeEntry("styrene", "C=Cc1ccccc1", "hydrocarbon", "The monomer of polystyrene.", ("flammable",)),
    MoleculeEntry("naphthalene", "c1ccc2ccccc2c1", "hydrocarbon", "Mothballs, and the simplest fused aromatic."),
    MoleculeEntry("anthracene", "c1ccc2cc3ccccc3cc2c1", "hydrocarbon", "Three linearly fused rings, used in dyes."),
    MoleculeEntry("phenanthrene", "c1ccc2c(c1)ccc1ccccc12", "hydrocarbon", "Three angularly fused rings, the steroid skeleton's ancestor."),
    MoleculeEntry("cyclohexene", "C1CCC=CC1", "hydrocarbon", "The standard substrate for addition reactions across a ring double bond.", ("flammable",)),
    MoleculeEntry("isoprene", "CC(=C)C=C", "hydrocarbon", "The five carbon unit that builds terpenes and natural rubber.", ("flammable",)),

    # ---------------- alcohols and ethers (18) ----------------
    MoleculeEntry("methanol", "CO", "alcohol_ether", "Wood alcohol, a fuel and solvent that is toxic to drink.", hazard_notes=("flammable", "toxic_ingestion")),
    MoleculeEntry("ethanol", "CCO", "alcohol_ether", "The alcohol in fermented drinks and a common lab solvent.", ("flammable",)),
    MoleculeEntry("1-propanol", "CCCO", "alcohol_ether", "A primary alcohol used as a solvent.", ("flammable",)),
    MoleculeEntry("2-propanol", "CC(C)O", "alcohol_ether", "Isopropyl alcohol, the rubbing alcohol in your cabinet.", ("flammable",)),
    MoleculeEntry("1-butanol", "CCCCO", "alcohol_ether", "Solvent and a fermentation product.", ("flammable",)),
    MoleculeEntry("tert-butanol", "CC(C)(C)O", "alcohol_ether", "A tertiary alcohol, which resists oxidation.", ("flammable",)),
    MoleculeEntry("ethylene glycol", "OCCO", "alcohol_ether", "Antifreeze, and sweet tasting but toxic.", ("toxic_ingestion",)),
    MoleculeEntry("propylene glycol", "CC(O)CO", "alcohol_ether", "Food safe humectant and fog machine fluid."),
    MoleculeEntry("glycerol", "OCC(O)CO", "alcohol_ether", "The three carbon backbone of every triglyceride."),
    MoleculeEntry("phenol", "Oc1ccccc1", "alcohol_ether", "The original surgical antiseptic, and an acid despite the OH.", hazard_notes=("corrosive", "toxic_contact")),
    MoleculeEntry("diethyl ether", "CCOCC", "alcohol_ether", "The first widely used surgical anaesthetic.", ("flammable",)),
    MoleculeEntry("tetrahydrofuran", "C1CCOC1", "alcohol_ether", "A cyclic ether solvent used for Grignard reactions.", ("flammable",)),
    MoleculeEntry("dimethyl ether", "COC", "alcohol_ether", "The structural isomer of ethanol that boils far lower.", ("flammable",)),
    MoleculeEntry("anisole", "COc1ccccc1", "alcohol_ether", "Methoxybenzene, an activated aromatic ring.", ("flammable",)),
    MoleculeEntry("menthol", "CC(C)C1CCC(C)CC1O", "alcohol_ether", "The cooling compound in mint, which triggers cold receptors."),
    MoleculeEntry("cholesterol", "CC(C)CCCC(C)C1CCC2C1(C)CCC1C2CC=C2CC(O)CCC12C", "alcohol_ether", "The steroid alcohol in every animal cell membrane."),
    MoleculeEntry("benzyl alcohol", "OCc1ccccc1", "alcohol_ether", "A preservative and fragrance ingredient."),
    MoleculeEntry("catechol", "Oc1ccccc1O", "alcohol_ether", "An ortho diol aromatic, the core of adrenaline and dopamine."),

    # ---------------- aldehydes and ketones (16) ----------------
    MoleculeEntry("formaldehyde", "C=O", "carbonyl", "Preservative and resin feedstock, the simplest aldehyde.", hazard_notes=("toxic_inhalation", "carcinogen")),
    MoleculeEntry("acetaldehyde", "CC=O", "carbonyl", "What your body makes from ethanol, and the cause of the hangover.", hazard_notes=("flammable", "carcinogen")),
    MoleculeEntry("propanal", "CCC=O", "carbonyl", "A three carbon aldehyde used in flavours.", ("flammable",)),
    MoleculeEntry("butanal", "CCCC=O", "carbonyl", "A four carbon aldehyde with a pungent smell.", ("flammable",)),
    MoleculeEntry("benzaldehyde", "O=Cc1ccccc1", "carbonyl", "The smell of almonds."),
    MoleculeEntry("cinnamaldehyde", "O=C/C=C/c1ccccc1", "carbonyl", "The smell and taste of cinnamon."),
    MoleculeEntry("vanillin", "COc1cc(C=O)ccc1O", "carbonyl", "The dominant flavour compound in vanilla."),
    MoleculeEntry("acetone", "CC(C)=O", "carbonyl", "Nail polish remover, and the simplest ketone.", ("flammable",)),
    MoleculeEntry("butanone", "CCC(C)=O", "carbonyl", "Methyl ethyl ketone, an industrial solvent.", ("flammable",)),
    MoleculeEntry("cyclohexanone", "O=C1CCCCC1", "carbonyl", "Precursor to nylon.", ("flammable",)),
    MoleculeEntry("acetophenone", "CC(=O)c1ccccc1", "carbonyl", "An aryl ketone used in fragrance."),
    MoleculeEntry("benzophenone", "O=C(c1ccccc1)c1ccccc1", "carbonyl", "A photoinitiator and UV blocker."),
    MoleculeEntry("camphor", "CC1(C)C2CCC1(C)C(=O)C2", "carbonyl", "The smell of medicated rubs, from the camphor tree."),
    MoleculeEntry("carvone", "CC(=C)C1CC=C(C)C(=O)C1", "carbonyl", "Two mirror image forms: one smells of spearmint, the other caraway."),
    MoleculeEntry("glyceraldehyde", "OCC(O)C=O", "carbonyl", "The simplest sugar, and the reference for D and L notation."),
    MoleculeEntry("pyruvic acid", "CC(=O)C(=O)O", "carbonyl", "The end product of glycolysis."),

    # ---------------- carboxylic acids and esters (24) ----------------
    MoleculeEntry("formic acid", "OC=O", "acid_ester", "The sting in an ant bite.", ("corrosive",)),
    MoleculeEntry("acetic acid", "CC(=O)O", "acid_ester", "What makes vinegar sour.", ("corrosive",)),
    MoleculeEntry("propanoic acid", "CCC(=O)O", "acid_ester", "A preservative that inhibits mould in bread.", ("corrosive",)),
    MoleculeEntry("butanoic acid", "CCCC(=O)O", "acid_ester", "The smell of rancid butter and human sweat.", ("corrosive",)),
    MoleculeEntry("hexanoic acid", "CCCCCC(=O)O", "acid_ester", "Caproic acid, contributes to the smell of goats.", ("corrosive",)),
    MoleculeEntry("palmitic acid", "CCCCCCCCCCCCCCCC(=O)O", "acid_ester", "The most common saturated fatty acid in your diet."),
    MoleculeEntry("stearic acid", "CCCCCCCCCCCCCCCCCC(=O)O", "acid_ester", "Saturated fatty acid used in candles and soap."),
    MoleculeEntry("oleic acid", "CCCCCCCC/C=C\\CCCCCCCC(=O)O", "acid_ester", "The cis monounsaturated fat that dominates olive oil."),
    MoleculeEntry("linoleic acid", "CCCCC/C=C\\C/C=C\\CCCCCCCC(=O)O", "acid_ester", "An essential omega 6 fatty acid."),
    MoleculeEntry("benzoic acid", "OC(=O)c1ccccc1", "acid_ester", "Food preservative, and the classic recrystallization exercise."),
    MoleculeEntry("salicylic acid", "OC(=O)c1ccccc1O", "acid_ester", "From willow bark, the starting material for aspirin.", ("irritant",)),
    MoleculeEntry("oxalic acid", "OC(=O)C(=O)O", "acid_ester", "Found in rhubarb leaves, and a diprotic acid.", ("toxic_ingestion",)),
    MoleculeEntry("malonic acid", "OC(=O)CC(=O)O", "acid_ester", "The three carbon diacid behind the malonic ester synthesis."),
    MoleculeEntry("succinic acid", "OC(=O)CCC(=O)O", "acid_ester", "An intermediate of the citric acid cycle."),
    MoleculeEntry("citric acid", "OC(=O)CC(O)(CC(=O)O)C(=O)O", "acid_ester", "The acid in citrus fruit and the namesake of the citric acid cycle."),
    MoleculeEntry("lactic acid", "CC(O)C(=O)O", "acid_ester", "Made by muscles and by the bacteria that sour milk."),
    MoleculeEntry("tartaric acid", "OC(=O)C(O)C(O)C(=O)O", "acid_ester", "From grapes, and the compound that let Pasteur discover chirality."),
    MoleculeEntry("methyl acetate", "COC(C)=O", "acid_ester", "A fast evaporating solvent.", ("flammable",)),
    MoleculeEntry("ethyl acetate", "CCOC(C)=O", "acid_ester", "The smell of nail polish remover and many fruits.", ("flammable",)),
    MoleculeEntry("isoamyl acetate", "CC(C)CCOC(C)=O", "acid_ester", "The banana ester.", ("flammable",)),
    MoleculeEntry("methyl salicylate", "COC(=O)c1ccccc1O", "acid_ester", "Oil of wintergreen, used in muscle rubs."),
    MoleculeEntry("aspirin", "CC(=O)Oc1ccccc1C(=O)O", "pharmaceutical", "Acetylsalicylic acid, the ester in the pill."),
    MoleculeEntry("ethyl butanoate", "CCCC(=O)OCC", "acid_ester", "The pineapple ester.", ("flammable",)),
    MoleculeEntry("acetic anhydride", "CC(=O)OC(C)=O", "acid_ester", "Used to acetylate alcohols, including in the aspirin synthesis.", ("corrosive",)),

    # ---------------- amines and amides (16) ----------------
    MoleculeEntry("methylamine", "CN", "amine_amide", "The smell of rotting fish, and a common building block.", hazard_notes=("flammable", "corrosive")),
    MoleculeEntry("dimethylamine", "CNC", "amine_amide", "A secondary amine used in surfactant manufacture.", hazard_notes=("flammable", "corrosive")),
    MoleculeEntry("trimethylamine", "CN(C)C", "amine_amide", "The compound behind the smell of spoiled fish.", ("flammable",)),
    MoleculeEntry("ethylamine", "CCN", "amine_amide", "A primary amine and a strong base for its size.", hazard_notes=("flammable", "corrosive")),
    MoleculeEntry("aniline", "Nc1ccccc1", "amine_amide", "The parent aromatic amine, the foundation of the dye industry.", ("toxic_contact",)),
    MoleculeEntry("pyridine", "c1ccncc1", "amine_amide", "An aromatic ring with a basic nitrogen, and a foul smelling solvent.", hazard_notes=("flammable", "toxic_inhalation")),
    MoleculeEntry("pyrrole", "c1cc[nH]c1", "amine_amide", "The five membered ring in hemoglobin and chlorophyll."),
    MoleculeEntry("imidazole", "c1cnc[nH]1", "amine_amide", "The side chain of histidine, and a superb buffer near pH 7."),
    MoleculeEntry("purine", "c1ncc2[nH]cnc2n1", "amine_amide", "The fused ring skeleton of adenine and guanine."),
    MoleculeEntry("urea", "NC(=O)N", "amine_amide", "The nitrogen waste mammals excrete, and the first organic compound synthesized from inorganic starting material."),
    MoleculeEntry("acetamide", "CC(N)=O", "amine_amide", "The simplest amide with a methyl group."),
    MoleculeEntry("formamide", "NC=O", "amine_amide", "A high boiling polar solvent."),
    MoleculeEntry("N,N-dimethylformamide", "CN(C)C=O", "amine_amide", "A polar aprotic solvent widely used in synthesis.", ("reproductive_toxin",)),
    MoleculeEntry("acetanilide", "CC(=O)Nc1ccccc1", "amine_amide", "An early fever reducer, now replaced by safer drugs."),
    MoleculeEntry("adenine", "Nc1ncnc2[nH]cnc12", "amine_amide", "One of the four DNA bases."),
    MoleculeEntry("cytosine", "Nc1cc[nH]c(=O)n1", "amine_amide", "A pyrimidine base of DNA and RNA."),

    # ---------------- amino acids (20) ----------------
    MoleculeEntry("glycine", "NCC(=O)O", "amino_acid", "The smallest amino acid, and the only achiral one."),
    MoleculeEntry("alanine", "CC(N)C(=O)O", "amino_acid", "The simplest chiral amino acid."),
    MoleculeEntry("valine", "CC(C)C(N)C(=O)O", "amino_acid", "Branched and hydrophobic, one of the essential amino acids."),
    MoleculeEntry("leucine", "CC(C)CC(N)C(=O)O", "amino_acid", "The most abundant amino acid in most proteins."),
    MoleculeEntry("isoleucine", "CCC(C)C(N)C(=O)O", "amino_acid", "Has two stereocentres rather than one."),
    MoleculeEntry("proline", "OC(=O)C1CCCN1", "amino_acid", "Its ring locks the backbone and breaks helices."),
    MoleculeEntry("phenylalanine", "NC(Cc1ccccc1)C(=O)O", "amino_acid", "The amino acid people with PKU must limit."),
    MoleculeEntry("tyrosine", "NC(Cc1ccc(O)cc1)C(=O)O", "amino_acid", "Precursor to dopamine, adrenaline and melanin."),
    MoleculeEntry("tryptophan", "NC(Cc1c[nH]c2ccccc12)C(=O)O", "amino_acid", "Precursor to serotonin, and the one blamed for post turkey sleepiness."),
    MoleculeEntry("serine", "NC(CO)C(=O)O", "amino_acid", "A hydroxyl side chain that enzymes use as a nucleophile."),
    MoleculeEntry("threonine", "CC(O)C(N)C(=O)O", "amino_acid", "A second hydroxyl amino acid, and a phosphorylation site."),
    MoleculeEntry("cysteine", "NC(CS)C(=O)O", "amino_acid", "Its thiol forms the disulfide bridges that hold proteins in shape."),
    MoleculeEntry("methionine", "CSCCC(N)C(=O)O", "amino_acid", "The start codon amino acid in every protein you make."),
    MoleculeEntry("asparagine", "NC(CC(N)=O)C(=O)O", "amino_acid", "First isolated from asparagus, hence the name."),
    MoleculeEntry("glutamine", "NC(CCC(N)=O)C(=O)O", "amino_acid", "The most abundant free amino acid in blood."),
    MoleculeEntry("aspartic acid", "NC(CC(=O)O)C(=O)O", "amino_acid", "An acidic side chain, and half of aspartame."),
    MoleculeEntry("glutamic acid", "NC(CCC(=O)O)C(=O)O", "amino_acid", "The savoury taste of umami, as monosodium glutamate."),
    MoleculeEntry("lysine", "NCCCCC(N)C(=O)O", "amino_acid", "A basic side chain that binds DNA in histones."),
    MoleculeEntry("arginine", "NC(CCCNC(N)=N)C(=O)O", "amino_acid", "The most basic amino acid, via its guanidinium group."),
    MoleculeEntry("histidine", "NC(Cc1c[nH]cn1)C(=O)O", "amino_acid", "The imidazole side chain that shuttles protons in enzymes."),

    # ---------------- carbohydrates (12) ----------------
    MoleculeEntry("glucose", "OCC1OC(O)C(O)C(O)C1O", "carbohydrate", "The sugar your cells run on."),
    MoleculeEntry("fructose", "OCC1OC(O)(CO)C(O)C1O", "carbohydrate", "The sweetest natural sugar, in fruit and honey."),
    MoleculeEntry("ribose", "OCC1OC(O)C(O)C1O", "carbohydrate", "The five carbon sugar in RNA."),
    MoleculeEntry("deoxyribose", "OCC1OC(O)CC1O", "carbohydrate", "The sugar in DNA, missing one oxygen from ribose."),
    MoleculeEntry("sucrose", "OCC1OC(OC2(CO)OC(CO)C(O)C2O)C(O)C(O)C1O", "carbohydrate", "Table sugar, a glucose and fructose joined together."),
    MoleculeEntry("lactose", "OCC1OC(OC2C(O)C(O)C(O)OC2CO)C(O)C(O)C1O", "carbohydrate", "Milk sugar, which many adults cannot digest."),
    MoleculeEntry("sorbitol", "OCC(O)C(O)C(O)C(O)CO", "carbohydrate", "A sugar alcohol used as a sweetener."),
    MoleculeEntry("erythritol", "OCC(O)C(O)CO", "carbohydrate", "A four carbon sugar alcohol used as a sweetener."),
    MoleculeEntry("glycolaldehyde", "OCC=O", "carbohydrate", "The simplest sugar like molecule, and a structural isomer of acetic acid."),
    MoleculeEntry("glyceric acid", "OCC(O)C(=O)O", "carbohydrate", "An oxidation product of glyceraldehyde."),
    MoleculeEntry("xylitol", "OCC(O)C(O)C(O)CO", "carbohydrate", "The sweetener that bacteria in your mouth cannot metabolise."),
    MoleculeEntry("ascorbic acid", "OCC(O)C1OC(=O)C(O)=C1O", "carbohydrate", "Vitamin C, whose absence causes scurvy."),

    # ---------------- pharmaceuticals (20) ----------------
    MoleculeEntry("ibuprofen", "CC(C)Cc1ccc(cc1)C(C)C(=O)O", "pharmaceutical", "A common anti inflammatory drug."),
    MoleculeEntry("paracetamol", "CC(=O)Nc1ccc(O)cc1", "pharmaceutical", "Acetaminophen, safe at dose and hepatotoxic above it."),
    MoleculeEntry("naproxen", "COc1ccc2cc(ccc2c1)C(C)C(=O)O", "pharmaceutical", "A longer acting anti inflammatory."),
    MoleculeEntry("caffeine", "Cn1cnc2c1c(=O)n(C)c(=O)n2C", "pharmaceutical", "The stimulant in coffee and tea."),
    MoleculeEntry("theobromine", "Cn1cnc2c1c(=O)[nH]c(=O)n2C", "pharmaceutical", "The stimulant in chocolate, and why chocolate harms dogs."),
    MoleculeEntry("theophylline", "Cn1c(=O)c2[nH]cnc2n(C)c1=O", "pharmaceutical", "An asthma drug closely related to caffeine."),
    MoleculeEntry("penicillin G", "CC1(C)SC2C(NC(=O)Cc3ccccc3)C(=O)N2C1C(=O)O", "pharmaceutical", "The first antibiotic, and its strained ring is the warhead."),
    MoleculeEntry("amoxicillin", "CC1(C)SC2C(NC(=O)C(N)c3ccc(O)cc3)C(=O)N2C1C(=O)O", "pharmaceutical", "A broad spectrum penicillin."),
    MoleculeEntry("ranitidine", "CNC(=C[N+](=O)[O-])NCCSCc1ccc(CN(C)C)o1", "pharmaceutical", "A histamine blocker once used for reflux."),
    MoleculeEntry("metformin", "CN(C)C(=N)NC(N)=N", "pharmaceutical", "First line treatment for type 2 diabetes."),
    MoleculeEntry("atorvastatin", "CC(C)c1c(C(=O)Nc2ccccc2)c(c3ccccc3)c(c4ccc(F)cc4)n1CCC(O)CC(O)CC(=O)O", "pharmaceutical", "A cholesterol lowering statin."),
    MoleculeEntry("omeprazole", "COc1ccc2[nH]c(S(=O)Cc3ncc(C)c(OC)c3C)nc2c1", "pharmaceutical", "A proton pump inhibitor for reflux."),
    MoleculeEntry("salbutamol", "CC(C)(C)NCC(O)c1ccc(O)c(CO)c1", "pharmaceutical", "The rescue inhaler for asthma."),
    MoleculeEntry("diphenhydramine", "CN(C)CCOC(c1ccccc1)c1ccccc1", "pharmaceutical", "An antihistamine that also causes drowsiness."),
    MoleculeEntry("lidocaine", "CCN(CC)CC(=O)Nc1c(C)cccc1C", "pharmaceutical", "A local anaesthetic used by dentists."),
    MoleculeEntry("warfarin", "CC(=O)CC(c1ccccc1)c1c(O)c2ccccc2oc1=O", "pharmaceutical", "An anticoagulant, and originally a rat poison.", ("toxic_ingestion",)),
    MoleculeEntry("levothyroxine", "NC(Cc1cc(I)c(Oc2cc(I)c(O)c(I)c2)c(I)c1)C(=O)O", "pharmaceutical", "Thyroid hormone replacement."),
    MoleculeEntry("sildenafil", "CCCc1nn(C)c2c1nc([nH]c2=O)c1cc(ccc1OCC)S(=O)(=O)N1CCN(C)CC1", "pharmaceutical", "Developed for angina, repurposed after an unexpected trial result."),
    MoleculeEntry("aspartame", "COC(=O)C(Cc1ccccc1)NC(=O)C(N)CC(=O)O", "pharmaceutical", "An artificial sweetener built from two amino acids."),
    MoleculeEntry("ibuprofen methyl ester", "COC(=O)C(C)c1ccc(CC(C)C)cc1", "pharmaceutical", "A prodrug style ester of ibuprofen, useful for teaching hydrolysis."),

    # ---------------- natural products and everyday compounds (16) ----------------
    MoleculeEntry("nicotine", "CN1CCCC1c1cccnc1", "natural_product", "The addictive alkaloid in tobacco.", ("toxic_ingestion",)),
    MoleculeEntry("capsaicin", "COc1cc(CNC(=O)CCCCC=CC(C)C)ccc1O", "natural_product", "The heat in chili peppers, which binds a heat receptor.", ("irritant",)),
    MoleculeEntry("limonene", "CC(=C)C1CCC(C)=CC1", "natural_product", "The smell of citrus peel, in two mirror image forms."),
    MoleculeEntry("alpha-pinene", "CC1=CCC2CC1C2(C)C", "natural_product", "The smell of pine forests."),
    MoleculeEntry("eugenol", "C=CCc1ccc(O)c(OC)c1", "natural_product", "Clove oil, used as a dental analgesic."),
    MoleculeEntry("thymol", "Cc1ccc(C(C)C)c(O)c1", "natural_product", "From thyme, an antiseptic in mouthwash."),
    MoleculeEntry("quercetin", "O=c1c(O)c(c2ccc(O)c(O)c2)oc2cc(O)cc(O)c12", "natural_product", "A flavonoid antioxidant in onions and apples."),
    MoleculeEntry("resveratrol", "Oc1ccc(/C=C/c2cc(O)cc(O)c2)cc1", "natural_product", "The compound in red wine that launched a thousand headlines."),
    MoleculeEntry("curcumin", "COc1cc(/C=C/C(=O)CC(=O)/C=C/c2ccc(O)c(OC)c2)ccc1O", "natural_product", "The yellow pigment of turmeric."),
    MoleculeEntry("beta-carotene", "CC1=C(C)C(/C=C/C(C)=C/C=C/C(C)=C/C=C/C=C(C)/C=C/C=C(C)/C=C/C2=C(C)CCCC2(C)C)C(C)(C)CC1", "natural_product", "The orange of carrots, and the precursor to vitamin A."),
    MoleculeEntry("lycopene", "CC(C)=CCC/C(C)=C/C=C/C(C)=C/C=C/C(C)=C/C=C/C=C(C)/C=C/C=C(C)/C=C/CC/C(C)=C/C", "natural_product", "The red of tomatoes."),
    MoleculeEntry("vanillic acid", "COc1cc(C(=O)O)ccc1O", "natural_product", "An oxidation product of vanillin."),
    MoleculeEntry("caffeic acid", "OC(=O)/C=C/c1ccc(O)c(O)c1", "natural_product", "Found in coffee, and unrelated to caffeine despite the name."),
    MoleculeEntry("salicin", "OCc1ccccc1OC1OC(CO)C(O)C(O)C1O", "natural_product", "The willow bark glycoside that the body converts toward salicylic acid."),
    MoleculeEntry("indigo", "O=C1Nc2ccccc2C1=C1C(=O)Nc2ccccc21", "natural_product", "The dye that makes blue jeans blue."),
    MoleculeEntry("melatonin", "COc1ccc2[nH]cc(CCNC(C)=O)c2c1", "natural_product", "The hormone that signals darkness to your body clock."),
)


def molecule_pool(*, include_flagged: bool = False) -> tuple[MoleculeEntry, ...]:
    """The pool every generative surface draws from.

    Safety gate. By default any entry carrying a safety flag is excluded, so a
    flagged species cannot become a retrosynthesis target, an item prompt or a
    tutor retrieval hit. Set include_flagged only for lesson content that
    explicitly teaches hazard literacy, never for generated items.
    """
    if include_flagged:
        return MOLECULES
    return tuple(m for m in MOLECULES if not m.safety_flags)


def hazardous_handling() -> tuple[MoleculeEntry, ...]:
    """Entries with a handling hazard. Still teachable, and lab framing should
    mention the hazard when one of these appears in lab adjacent content."""
    return tuple(m for m in MOLECULES if m.hazard_notes)


def by_category(category: str, *, include_flagged: bool = False) -> tuple[MoleculeEntry, ...]:
    return tuple(m for m in molecule_pool(include_flagged=include_flagged) if m.category == category)


def unreviewed() -> list[str]:
    return sorted(m.name for m in MOLECULES if m.review != "reviewed")
