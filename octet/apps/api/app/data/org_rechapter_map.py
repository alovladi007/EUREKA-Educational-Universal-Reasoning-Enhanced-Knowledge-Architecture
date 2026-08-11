"""Requested organic chapter structure, mapped onto the existing node graph.

The chapter list is the user's. This file is the MAPPING from that list onto
the 146 organic nodes already in curriculum.json, and it exists so the remap
can be audited before anything is rewritten.

The rule this file enforces is the one the Patent Bar rebuild taught: content
already authored gets moved into the right place, never dropped. Every
existing ORG1/ORG2 node id must appear exactly once below, or be listed in
HOMELESS with a reason. `audit_org_rechapter.py` fails if that is not true,
so a node cannot go missing by being forgotten.

Node ids are unchanged. They are the stable key for lessons, items,
prerequisites and the MCAT mapping table; renaming them to match a new
chapter number would break all four.
"""

# --------------------------------------------------------------------------
# Organic Chemistry I - 9 chapters
# --------------------------------------------------------------------------
ORG1_CHAPTERS = [
    (1, "Chemical Bonding and Structure", None, [
        "ORG1.ORBITALS", "ORG1.HYBRIDORG", "ORG1.DRAWING",
        "ORG1.FORMALCHARGEORG", "ORG1.RESONANCEORG", "ORG1.INDUCTIVE",
        "ORG1.FUNCTIONALGROUPS",
    ]),
    (2, "Alkanes", None, [
        "ORG1.ALKANENOMEN", "ORG1.ISOMERS", "ORG1.NEWMAN",
    ]),
    (3, "Acids and Bases", None, [
        "ORG1.PKA", "ORG1.ACIDITYFACTORS", "ORG1.NUCELEC", "ORG1.ARROWS",
    ]),

    # Chapter 4 carries the requested A-F parts. E and F are why the old
    # "Understanding Organic Reactions" unit disappears as a unit: rate and
    # catalysis are taught here, against a reaction the learner has just met,
    # rather than as six abstract nodes before any reaction exists.
    (4, "Alkenes: Structure", "A", ["ORG1.ALKENEBONDING"]),
    (4, "Alkenes: Structure", "B", ["ORG1.ALKENENOMEN"]),
    (4, "Alkenes: Structure", "C", ["ORG1.ALKENESTABILITY"]),
    (4, "Alkenes: Structure", "D", [
        "ORG1.HXADDITION", "ORG1.CARBOCATION", "ORG1.REARRANGEMENT",
        "ORG1.REACTIONTYPES", "ORG1.HOMOHETERO",
    ]),
    (4, "Alkenes: Structure", "E", [
        "ORG1.ENERGYDIAGRAM", "ORG1.KINETICTHERMO",
    ]),
    (4, "Alkenes: Structure", "F", [
        "ORG1.HYDROGENATION", "ORG1.CATALYSIS",
    ]),

    (5, "Addition Reactions of Alkenes", "A", ["ORG1.HALOGENATION"]),
    (5, "Addition Reactions of Alkenes", "B", [
        "ORG1.HYDRATION", "ORG1.EPOXIDATION",
    ]),
    (5, "Addition Reactions of Alkenes", "C", ["ORG1.OZONOLYSIS"]),
    (5, "Addition Reactions of Alkenes", None, [
        "ORG1.RADICALHBR", "ORG1.ALKENESYNTH",
    ]),

    (6, "Stereochemistry", None, [
        "ORG1.CHIRALITY", "ORG1.RS", "ORG1.ENANTIODIA",
        "ORG1.OPTICALACTIVITY", "ORG1.FISCHER", "ORG1.MULTIPLESTEREO",
        "ORG1.RESOLUTION",
    ]),
    (7, "Cyclic Compounds", None, [
        "ORG1.RINGSTRAIN", "ORG1.CHAIR", "ORG1.AVALUES", "ORG1.CISTRANSRING",
    ]),

    # Wholly new chapter. Nothing in the organic graph covered it: the general
    # chemistry course teaches intermolecular forces, but the organic reading
    # of them - why boiling point tracks chain length, why an amide is planar
    # and hydrogen bonded, why a drug candidate has to be soluble in both a
    # membrane and blood - was not taught anywhere in ORG1 or ORG2.
    (8, "Noncovalent Intermolecular Interactions", None, [
        "ORG1.IMFTYPES", "ORG1.DISPERSION", "ORG1.DIPOLE",
        "ORG1.HBONDING", "ORG1.IMFPROPERTIES", "ORG1.SOLUBILITY",
    ]),

    (9, "Alkyl Halides", None, [
        "ORG1.HALIDENOMEN", "ORG1.RADICALHALOGEN", "ORG1.GRIGNARD",
        "ORG1.SN2", "ORG1.SN2FACTORS", "ORG1.SN1", "ORG1.SN1FACTORS",
        "ORG1.E2", "ORG1.ZAITSEV", "ORG1.E2RINGS", "ORG1.E1",
        "ORG1.COMPETITION",
    ]),
]

# --------------------------------------------------------------------------
# Organic Chemistry II - 15 chapters
#
# Two numbering slips in the request are resolved here and flagged in the
# report rather than silently absorbed:
#   - Spectroscopy and NMR were both numbered 3. NMR is given its own chapter,
#     since IR and MS are lettered A and B beneath Spectroscopy while NMR was
#     written on its own line, and NMR is large enough to stand alone.
#   - "Aromatic Heterocycles, nucleic acids" carried no number, between 12 and
#     13. It is treated as its own chapter.
# --------------------------------------------------------------------------
ORG2_CHAPTERS = [
    (1, "Alcohols and Thiols", None, [
        "ORG2.ALCOHOLPROPS", "ORG2.ALCOHOLREDUCTION", "ORG2.ALCOHOLGRIGNARD",
        "ORG2.ALCOHOLSUB", "ORG2.OXIDATION", "ORG2.PROTECTING",
        "ORG2.THIOLS",
    ]),
    (2, "Ethers, Epoxides, Glycols and Sulfides", None, [
        "ORG2.WILLIAMSON", "ORG2.EPOXIDE", "ORG2.GLYCOLS", "ORG2.SULFIDES",
    ]),

    (3, "Spectroscopy", "A", ["ORG1.IRREGIONS", "ORG1.IRINTERPRET"]),
    (3, "Spectroscopy", "B", ["ORG1.MSBASICS", "ORG1.MSFRAGMENT"]),
    (3, "Spectroscopy", None, ["ORG2.UVVIS"]),

    (4, "Nuclear Magnetic Resonance Spectroscopy", None, [
        "ORG1.NMRTHEORY", "ORG1.NMRINTEGRATION", "ORG1.NMRSPLITTING",
        "ORG1.CARBONNMR", "ORG1.ELUCIDATION",
    ]),
    (5, "Alkynes", None, [
        "ORG1.ALKYNENOMEN", "ORG1.ACETYLIDE", "ORG1.ALKYNEADDITION",
        "ORG1.TAUTOMER", "ORG1.ALKYNEREDUCTION", "ORG1.ALKYNESYNTH",
    ]),
    (6, "Dienes, Resonance and Aromaticity", None, [
        "ORG2.CONJUGATION", "ORG2.CONJUGATEADD", "ORG2.DIELSALDER",
        "ORG2.DAREQUIREMENTS", "ORG2.BENZENE", "ORG2.HUCKEL",
        "ORG2.ANTIAROMATIC",
    ]),
    (7, "Benzene and its Derivatives", None, [
        "ORG2.BENZENENOMEN", "ORG2.AROMATICSPECTRA", "ORG2.EASMECH",
        "ORG2.EASREACTIONS", "ORG2.FRIEDELCRAFTS", "ORG2.ACTIVATING",
        "ORG2.DIRECTING", "ORG2.MULTIPLESUB", "ORG2.AROMATICSYNTH",
    ]),
    (8, "Allylic and Benzylic Reactivity", None, [
        "ORG2.ALLYLIC", "ORG1.ALLYLIC", "ORG2.SIDECHAIN", "ORG2.BENZYLIC",
    ]),
    (9, "Aryl and Vinylic Halides, Phenols, Transition Metal Catalysis", None, [
        "ORG2.NAS", "ORG2.PHENOLS", "ORG1.COUPLING",
        "ORG2.ARYLVINYLIC", "ORG2.CROSSCOUPLING",
    ]),
    (10, "Aldehydes, Ketones and Carbonyl Addition Reactions", None, [
        "ORG2.CARBONYLSTRUCTURE", "ORG2.CARBONYLPREP", "ORG2.NUCADDITION",
        "ORG2.HYDRATEACETAL", "ORG2.ACETALPROTECT", "ORG2.IMINEENAMINE",
        "ORG2.WITTIG", "ORG2.REDUCTIVEAMINATION", "ORG2.CONJUGATEADDITION",
        "ORG2.CARBONYLSPECTRA",
    ]),
    (11, "Carboxylic Acids and Derivatives", None, [
        "ORG2.ACIDPROPS", "ORG2.ACIDSUBSTITUENT", "ORG2.ACIDSYNTH",
        "ORG2.NITRILES", "ORG2.ACIDSPECTRA", "ORG2.DERIVATIVEREACTIVITY",
        "ORG2.ACYLSUB", "ORG2.ACIDCHLORIDE", "ORG2.ESTERS", "ORG2.AMIDES",
        "ORG2.DERIVATIVEREDUCTION", "ORG2.DERIVATIVEORGANOMETALLIC",
        "ORG2.POLYMERS",
    ]),
    # Chapter 12 is not in the requested list. It holds nine already-authored
    # nodes the list had no slot for, kept together because aldol, Claisen and
    # Michael are one idea - an enolate attacking a carbonyl - and splitting
    # them across chapters 10 and 11 teaches the mechanism twice.
    (12, "Enols, Enolates and Condensations", None, [
        "ORG2.TAUTOMERISM", "ORG2.ENOLATE", "ORG2.ALPHAHALOGEN",
        "ORG2.ALKYLATION", "ORG2.ACETOACETIC", "ORG2.ALDOL",
        "ORG2.CROSSEDALDOL", "ORG2.CLAISEN", "ORG2.MICHAEL",
    ]),
    (13, "Amines", None, [
        "ORG2.AMINEPROPS", "ORG2.AMINESYNTH", "ORG2.AMINEREACTIONS",
        "ORG2.AMINESPECTRA",
    ]),
    (14, "Carbohydrates", None, [
        "ORG2.CARBOHYDRATES", "ORG2.CARBREACTIONS",
    ]),
    (15, "Aromatic Heterocycles and Nucleic Acids", None, [
        "ORG2.AROMATICIONS", "ORG2.HETEROCYCLES", "ORG2.NUCLEICACIDS",
    ]),
    (16, "Amino Acids, Peptides and Proteins", None, [
        "ORG2.AMINOACIDS", "ORG2.PEPTIDES",
    ]),
    # Capstone. Retrosynthesis only becomes teachable once every reaction in
    # the two courses is available to plan with, so it goes last by design
    # rather than by leftover.
    (17, "Lipids and Synthesis Strategy", None, [
        "ORG2.LIPIDS", "ORG2.RETROSYNTHESIS", "ORG2.MULTISTEP",
    ]),
]

#: Node ids the requested chapter list had no place for. The audit fails on a
#: non-empty value here, so an authored node cannot quietly stop being taught.
#: Twelve entries sat here during review - the nine enolate nodes plus lipids,
#: retrosynthesis and multistep design. Both groups were given chapters (12
#: and 17) rather than dropped.
HOMELESS: dict[str, str] = {}

#: Nodes the new structure needs that do not exist yet, with the reason the
#: chapter cannot be taught without them.
NEW_NODES = {
    "ORG1.ALKENEBONDING": "chapter 4A asks for alkene bonding; only stability existed",
    "ORG1.CATALYSIS": "chapter 4F asks for catalysis as a concept, not just catalytic hydrogenation",
    "ORG1.IMFTYPES": "chapter 8 is new in full",
    "ORG1.DISPERSION": "chapter 8",
    "ORG1.DIPOLE": "chapter 8",
    "ORG1.HBONDING": "chapter 8",
    "ORG1.IMFPROPERTIES": "chapter 8",
    "ORG1.SOLUBILITY": "chapter 8",
    "ORG2.GLYCOLS": "chapter 2 names glycols; only dihydroxylation existed, inside an alkene node",
    "ORG2.SULFIDES": "chapter 2 names sulfides separately from thiols",
    "ORG2.BENZYLIC": "chapter 8 names benzylic reactivity; only allylic existed",
    "ORG2.ARYLVINYLIC": "chapter 9 names aryl and vinylic halides as a class",
    "ORG2.CROSSCOUPLING": "chapter 9 names transition metal catalysis",
}


def all_mapped_ids() -> list[str]:
    out = []
    for table in (ORG1_CHAPTERS, ORG2_CHAPTERS):
        for _num, _title, _part, ids in table:
            out.extend(ids)
    return out
