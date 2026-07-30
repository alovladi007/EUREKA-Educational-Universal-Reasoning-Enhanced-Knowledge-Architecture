// GENERATED FILE - do not edit by hand.
//
// Produced by scripts/gen_molecule_data.py, which derives every
// structural field from the SMILES using RDKit: coordinates
// (ETKDGv3 embedding then MMFF94 optimisation), molecular formula,
// hybridisation, aromaticity, formal charge, CIP descriptors, lone
// pairs and steric numbers. To change the chemistry, change the
// SMILES in that script and regenerate.
//
// Coordinates are COMPUTED, not measured. They are a plausible
// low-energy conformer, good for reading shape, hybridisation and
// polarity; they are not crystallographic data, and the labs say so
// on screen. Experimental numbers the course cites (bond-length
// trends, inversion barriers, A values) stay authoritative and are
// shown as cited text, not read off this geometry.

import type { Molecule } from './types';

export const ORGANIC_MOLECULES: Molecule[] = [
  {
    key: 'methane',
    name: 'Methane',
    smiles: 'C',
    formula: 'CH4',
    mass: 16.04,
    geometry: 'Tetrahedral - 109.5 deg',
    polarity: 'Nonpolar',
    teaches: [
      'ORG1.HYBRIDORG',
      'ORG1.ORBITALS'
    ],
    facts: [
      'Four attached groups, zero lone pairs: steric number 4, so sp3, tetrahedral, 109.5 degrees.',
      '25 percent s character. No leftover p orbital, so no pi bond is possible here.',
      'Four identical C-H dipoles pointing at the vertices of a tetrahedron cancel exactly.'
    ],
    atoms: [
      {
        el: 'C',
        pos: [0.0, -0.0, 0.0],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'H',
        pos: [-0.675, 0.346, 0.786],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-0.487, -0.789, -0.577],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [0.915, -0.39, 0.451],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [0.247, 0.834, -0.661],
        lp: 0,
        sn: 1
      }
    ],
    bonds: [
      {
        a: 0,
        b: 1,
        order: 1.0
      },
      {
        a: 0,
        b: 2,
        order: 1.0
      },
      {
        a: 0,
        b: 3,
        order: 1.0
      },
      {
        a: 0,
        b: 4,
        order: 1.0
      }
    ]
  },
  {
    key: 'ethane',
    name: 'Ethane',
    smiles: 'CC',
    formula: 'C2H6',
    mass: 30.07,
    geometry: 'Tetrahedral at each carbon',
    polarity: 'Nonpolar',
    teaches: [
      'ORG1.HYBRIDORG',
      'ORG1.NEWMAN'
    ],
    facts: [
      'Both carbons are sp3. The C-C bond is a sigma bond, cylindrically symmetric about its axis.',
      'Because sigma overlap does not change as the ends turn, rotation is nearly free.',
      'C-C length 154 pm - the long end of the bond-order trend. Cited, not measured here.'
    ],
    atoms: [
      {
        el: 'C',
        pos: [0.752, -0.071, 0.03],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'C',
        pos: [-0.752, 0.071, -0.03],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'H',
        pos: [1.236, 0.733, -0.533],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [1.066, -1.028, -0.397],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [1.101, -0.024, 1.066],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-1.101, 0.024, -1.066],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-1.066, 1.028, 0.397],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-1.236, -0.733, 0.533],
        lp: 0,
        sn: 1
      }
    ],
    bonds: [
      {
        a: 0,
        b: 1,
        order: 1.0
      },
      {
        a: 0,
        b: 2,
        order: 1.0
      },
      {
        a: 0,
        b: 3,
        order: 1.0
      },
      {
        a: 0,
        b: 4,
        order: 1.0
      },
      {
        a: 1,
        b: 5,
        order: 1.0
      },
      {
        a: 1,
        b: 6,
        order: 1.0
      },
      {
        a: 1,
        b: 7,
        order: 1.0
      }
    ]
  },
  {
    key: 'ethene',
    name: 'Ethene (ethylene)',
    smiles: 'C=C',
    formula: 'C2H4',
    mass: 28.05,
    geometry: 'Trigonal planar - 120 deg',
    polarity: 'Nonpolar',
    teaches: [
      'ORG1.HYBRIDORG',
      'ORG1.ORBITALS',
      'ORG1.ALKENENOMEN'
    ],
    facts: [
      'Three attached groups, no lone pairs: steric number 3, so sp2, trigonal planar, 120 degrees.',
      'One p orbital is left over on each carbon. Side-on overlap makes the pi bond.',
      'The pi bond has a nodal plane through the molecule. Twisting the ends tears the overlap, so this bond does not rotate - which is exactly why cis and trans exist.',
      'C=C length 134 pm.'
    ],
    atoms: [
      {
        el: 'C',
        pos: [0.645, 0.172, 0.013],
        lp: 0,
        sn: 3,
        hyb: 'sp2'
      },
      {
        el: 'C',
        pos: [-0.645, -0.172, -0.013],
        lp: 0,
        sn: 3,
        hyb: 'sp2'
      },
      {
        el: 'H',
        pos: [1.423, -0.561, -0.176],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [0.949, 1.192, 0.225],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-0.949, -1.192, -0.225],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-1.423, 0.561, 0.176],
        lp: 0,
        sn: 1
      }
    ],
    bonds: [
      {
        a: 0,
        b: 1,
        order: 2.0
      },
      {
        a: 0,
        b: 2,
        order: 1.0
      },
      {
        a: 0,
        b: 3,
        order: 1.0
      },
      {
        a: 1,
        b: 4,
        order: 1.0
      },
      {
        a: 1,
        b: 5,
        order: 1.0
      }
    ]
  },
  {
    key: 'ethyne',
    name: 'Ethyne (acetylene)',
    smiles: 'C#C',
    formula: 'C2H2',
    mass: 26.04,
    geometry: 'Linear - 180 deg',
    polarity: 'Nonpolar',
    teaches: [
      'ORG1.HYBRIDORG',
      'ORG1.ALKYNENOMEN',
      'ORG1.ACETYLIDE'
    ],
    facts: [
      'Two attached groups: steric number 2, so sp, linear, 180 degrees.',
      'Two leftover p orbitals per carbon make two perpendicular pi bonds around one sigma.',
      '50 percent s character holds the bonding electrons close to carbon, which is why the terminal C-H is acidic enough (pKa about 25) to deprotonate with NaNH2.',
      'C#C length 120 pm - the short end of the trend.'
    ],
    atoms: [
      {
        el: 'C',
        pos: [-0.596, -0.068, 0.007],
        lp: 0,
        sn: 2,
        hyb: 'sp'
      },
      {
        el: 'C',
        pos: [0.596, 0.068, -0.007],
        lp: 0,
        sn: 2,
        hyb: 'sp'
      },
      {
        el: 'H',
        pos: [-1.655, -0.188, 0.018],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [1.655, 0.188, -0.018],
        lp: 0,
        sn: 1
      }
    ],
    bonds: [
      {
        a: 0,
        b: 1,
        order: 3.0
      },
      {
        a: 0,
        b: 2,
        order: 1.0
      },
      {
        a: 1,
        b: 3,
        order: 1.0
      }
    ]
  },
  {
    key: 'propene',
    name: 'Propene',
    smiles: 'CC=C',
    formula: 'C3H6',
    mass: 42.08,
    geometry: 'sp2 alkene plus sp3 methyl',
    polarity: 'Very weakly polar',
    teaches: [
      'ORG1.HYBRIDORG',
      'ORG1.ALKENESTABILITY',
      'ORG1.HXADDITION'
    ],
    facts: [
      'One molecule showing both hybridisations: count at each carbon separately.',
      'The allylic C-H bonds hyperconjugate into the pi system, which is where alkene stability trends come from.'
    ],
    atoms: [
      {
        el: 'C',
        pos: [-1.112, 0.037, 0.231],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'C',
        pos: [0.305, 0.459, 0.016],
        lp: 0,
        sn: 3,
        hyb: 'sp2'
      },
      {
        el: 'C',
        pos: [1.294, -0.376, -0.325],
        lp: 0,
        sn: 3,
        hyb: 'sp2'
      },
      {
        el: 'H',
        pos: [-1.768, 0.569, -0.464],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-1.422, 0.279, 1.252],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-1.251, -1.038, 0.077],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [0.526, 1.516, 0.15],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [1.121, -1.438, -0.469],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [2.306, -0.009, -0.467],
        lp: 0,
        sn: 1
      }
    ],
    bonds: [
      {
        a: 0,
        b: 1,
        order: 1.0
      },
      {
        a: 1,
        b: 2,
        order: 2.0
      },
      {
        a: 0,
        b: 3,
        order: 1.0
      },
      {
        a: 0,
        b: 4,
        order: 1.0
      },
      {
        a: 0,
        b: 5,
        order: 1.0
      },
      {
        a: 1,
        b: 6,
        order: 1.0
      },
      {
        a: 2,
        b: 7,
        order: 1.0
      },
      {
        a: 2,
        b: 8,
        order: 1.0
      }
    ]
  },
  {
    key: 'benzene',
    name: 'Benzene',
    smiles: 'c1ccccc1',
    formula: 'C6H6',
    mass: 78.11,
    geometry: 'Planar hexagon - 120 deg',
    polarity: 'Nonpolar',
    teaches: [
      'ORG2.BENZENE',
      'ORG2.HUCKEL',
      'ORG1.RESONANCEORG'
    ],
    facts: [
      'Every carbon sp2, every angle 120 degrees, the whole ring rigidly planar.',
      'Cyclic, planar, fully conjugated, 4n+2 pi electrons with n=1: aromatic by all four Huckel criteria.',
      'All six C-C bonds are the same length (139 pm), between a single and a double bond. The alternating-bond drawing is a convention, not a claim about the structure.',
      'Aromatic stabilisation is why benzene substitutes rather than adds.'
    ],
    atoms: [
      {
        el: 'C',
        pos: [1.07, -0.891, 0.082],
        lp: 0,
        sn: 3,
        hyb: 'sp2',
        aromatic: true
      },
      {
        el: 'C',
        pos: [-0.239, -1.374, 0.042],
        lp: 0,
        sn: 3,
        hyb: 'sp2',
        aromatic: true
      },
      {
        el: 'C',
        pos: [-1.308, -0.482, -0.039],
        lp: 0,
        sn: 3,
        hyb: 'sp2',
        aromatic: true
      },
      {
        el: 'C',
        pos: [-1.07, 0.891, -0.082],
        lp: 0,
        sn: 3,
        hyb: 'sp2',
        aromatic: true
      },
      {
        el: 'C',
        pos: [0.239, 1.374, -0.042],
        lp: 0,
        sn: 3,
        hyb: 'sp2',
        aromatic: true
      },
      {
        el: 'C',
        pos: [1.308, 0.482, 0.039],
        lp: 0,
        sn: 3,
        hyb: 'sp2',
        aromatic: true
      },
      {
        el: 'H',
        pos: [1.903, -1.586, 0.145],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-0.424, -2.444, 0.075],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-2.327, -0.858, -0.07],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-1.903, 1.586, -0.145],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [0.424, 2.444, -0.075],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [2.327, 0.858, 0.07],
        lp: 0,
        sn: 1
      }
    ],
    bonds: [
      {
        a: 0,
        b: 1,
        order: 1.5
      },
      {
        a: 1,
        b: 2,
        order: 1.5
      },
      {
        a: 2,
        b: 3,
        order: 1.5
      },
      {
        a: 3,
        b: 4,
        order: 1.5
      },
      {
        a: 4,
        b: 5,
        order: 1.5
      },
      {
        a: 5,
        b: 0,
        order: 1.5
      },
      {
        a: 0,
        b: 6,
        order: 1.0
      },
      {
        a: 1,
        b: 7,
        order: 1.0
      },
      {
        a: 2,
        b: 8,
        order: 1.0
      },
      {
        a: 3,
        b: 9,
        order: 1.0
      },
      {
        a: 4,
        b: 10,
        order: 1.0
      },
      {
        a: 5,
        b: 11,
        order: 1.0
      }
    ]
  },
  {
    key: 'butane',
    name: 'Butane',
    smiles: 'CCCC',
    formula: 'C4H10',
    mass: 58.12,
    geometry: 'Tetrahedral chain, anti conformer',
    polarity: 'Nonpolar',
    teaches: [
      'ORG1.NEWMAN',
      'ORG1.ALKANENOMEN'
    ],
    facts: [
      'Shown in the anti conformer, the global minimum, with the two methyls 180 degrees apart.',
      'Gauche sits about 3.8 kJ/mol above anti from steric strain; methyl-methyl eclipsed about 19 kJ/mol above. Use the Conformations mode to walk the curve.',
      'Three minima and three maxima per full turn, and they are not all the same height.'
    ],
    atoms: [
      {
        el: 'C',
        pos: [-1.925, 0.178, 0.1],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'C',
        pos: [-0.565, -0.502, 0.108],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'C',
        pos: [0.565, 0.502, -0.108],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'C',
        pos: [1.925, -0.178, -0.1],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'H',
        pos: [-1.994, 0.925, 0.896],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-2.108, 0.676, -0.857],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-2.718, -0.56, 0.256],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-0.426, -1.018, 1.066],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-0.54, -1.266, -0.678],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [0.426, 1.018, -1.066],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [0.54, 1.266, 0.678],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [1.994, -0.925, -0.896],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [2.718, 0.56, -0.256],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [2.108, -0.676, 0.857],
        lp: 0,
        sn: 1
      }
    ],
    bonds: [
      {
        a: 0,
        b: 1,
        order: 1.0
      },
      {
        a: 1,
        b: 2,
        order: 1.0
      },
      {
        a: 2,
        b: 3,
        order: 1.0
      },
      {
        a: 0,
        b: 4,
        order: 1.0
      },
      {
        a: 0,
        b: 5,
        order: 1.0
      },
      {
        a: 0,
        b: 6,
        order: 1.0
      },
      {
        a: 1,
        b: 7,
        order: 1.0
      },
      {
        a: 1,
        b: 8,
        order: 1.0
      },
      {
        a: 2,
        b: 9,
        order: 1.0
      },
      {
        a: 2,
        b: 10,
        order: 1.0
      },
      {
        a: 3,
        b: 11,
        order: 1.0
      },
      {
        a: 3,
        b: 12,
        order: 1.0
      },
      {
        a: 3,
        b: 13,
        order: 1.0
      }
    ]
  },
  {
    key: 'cyclohexane',
    name: 'Cyclohexane',
    smiles: 'C1CCCCC1',
    formula: 'C6H12',
    mass: 84.16,
    geometry: 'Chair - essentially strain free',
    polarity: 'Nonpolar',
    teaches: [
      'ORG1.CHAIR',
      'ORG1.RINGSTRAIN',
      'ORG1.AVALUES'
    ],
    facts: [
      'The chair puckers three carbons above the mean plane and three below, which lets every angle sit near 109.5 with all bonds staggered.',
      'Each carbon carries one axial bond parallel to the ring axis and one equatorial around the rim.',
      'Ring inversion swaps axial and equatorial everywhere at once, over a barrier of about 45 kJ/mol. It does not move a group between faces - a flip cannot turn cis into trans.',
      'Use the Chair mode to run the inversion and watch which bonds trade places.'
    ],
    atoms: [
      {
        el: 'C',
        pos: [-0.692, -1.278, 0.255],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'C',
        pos: [-1.384, -0.14, -0.492],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'C',
        pos: [-0.824, 1.221, -0.087],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'C',
        pos: [0.692, 1.278, -0.255],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'C',
        pos: [1.384, 0.14, 0.492],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'C',
        pos: [0.824, -1.221, 0.087],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'H',
        pos: [-1.068, -2.241, -0.11],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-0.943, -1.22, 1.321],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-2.461, -0.17, -0.293],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-1.254, -0.281, -1.572],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-1.292, 2.006, -0.691],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-1.083, 1.425, 0.959],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [0.943, 1.22, -1.321],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [1.068, 2.241, 0.11],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [1.254, 0.281, 1.572],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [2.461, 0.17, 0.293],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [1.083, -1.425, -0.959],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [1.292, -2.006, 0.691],
        lp: 0,
        sn: 1
      }
    ],
    bonds: [
      {
        a: 0,
        b: 1,
        order: 1.0
      },
      {
        a: 1,
        b: 2,
        order: 1.0
      },
      {
        a: 2,
        b: 3,
        order: 1.0
      },
      {
        a: 3,
        b: 4,
        order: 1.0
      },
      {
        a: 4,
        b: 5,
        order: 1.0
      },
      {
        a: 5,
        b: 0,
        order: 1.0
      },
      {
        a: 0,
        b: 6,
        order: 1.0
      },
      {
        a: 0,
        b: 7,
        order: 1.0
      },
      {
        a: 1,
        b: 8,
        order: 1.0
      },
      {
        a: 1,
        b: 9,
        order: 1.0
      },
      {
        a: 2,
        b: 10,
        order: 1.0
      },
      {
        a: 2,
        b: 11,
        order: 1.0
      },
      {
        a: 3,
        b: 12,
        order: 1.0
      },
      {
        a: 3,
        b: 13,
        order: 1.0
      },
      {
        a: 4,
        b: 14,
        order: 1.0
      },
      {
        a: 4,
        b: 15,
        order: 1.0
      },
      {
        a: 5,
        b: 16,
        order: 1.0
      },
      {
        a: 5,
        b: 17,
        order: 1.0
      }
    ]
  },
  {
    key: 'methylcyclohexane',
    name: 'Methylcyclohexane',
    smiles: 'CC1CCCCC1',
    formula: 'C7H14',
    mass: 98.19,
    geometry: 'Chair, methyl equatorial',
    polarity: 'Nonpolar',
    teaches: [
      'ORG1.AVALUES',
      'ORG1.CHAIR'
    ],
    facts: [
      'Drawn with the methyl equatorial, which is the favoured chair by about 7.3 kJ/mol (its A value).',
      'Axial methyl suffers 1,3-diaxial crowding against the two axial hydrogens on the same face.',
      'K = exp(dG/RT) with RT about 2.48 kJ/mol at 298 K puts roughly 95 percent of molecules in the equatorial chair.'
    ],
    atoms: [
      {
        el: 'C',
        pos: [-1.929, 0.115, 0.714],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'C',
        pos: [-1.082, 0.01, -0.558],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'C',
        pos: [-0.169, 1.232, -0.733],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'C',
        pos: [1.012, 1.241, 0.237],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'C',
        pos: [1.805, -0.06, 0.17],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'C',
        pos: [0.915, -1.28, 0.38],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'C',
        pos: [-0.266, -1.29, -0.59],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'H',
        pos: [-2.54, 1.023, 0.694],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-1.318, 0.143, 1.621],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-2.608, -0.74, 0.794],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-1.782, -0.011, -1.404],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-0.746, 2.157, -0.619],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [0.222, 1.234, -1.759],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [1.672, 2.084, 0.0],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [0.654, 1.402, 1.26],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [2.598, -0.048, 0.927],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [2.299, -0.134, -0.806],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [1.507, -2.193, 0.243],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [0.55, -1.296, 1.413],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [0.119, -1.438, -1.608],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-0.912, -2.15, -0.375],
        lp: 0,
        sn: 1
      }
    ],
    bonds: [
      {
        a: 0,
        b: 1,
        order: 1.0
      },
      {
        a: 1,
        b: 2,
        order: 1.0
      },
      {
        a: 2,
        b: 3,
        order: 1.0
      },
      {
        a: 3,
        b: 4,
        order: 1.0
      },
      {
        a: 4,
        b: 5,
        order: 1.0
      },
      {
        a: 5,
        b: 6,
        order: 1.0
      },
      {
        a: 6,
        b: 1,
        order: 1.0
      },
      {
        a: 0,
        b: 7,
        order: 1.0
      },
      {
        a: 0,
        b: 8,
        order: 1.0
      },
      {
        a: 0,
        b: 9,
        order: 1.0
      },
      {
        a: 1,
        b: 10,
        order: 1.0
      },
      {
        a: 2,
        b: 11,
        order: 1.0
      },
      {
        a: 2,
        b: 12,
        order: 1.0
      },
      {
        a: 3,
        b: 13,
        order: 1.0
      },
      {
        a: 3,
        b: 14,
        order: 1.0
      },
      {
        a: 4,
        b: 15,
        order: 1.0
      },
      {
        a: 4,
        b: 16,
        order: 1.0
      },
      {
        a: 5,
        b: 17,
        order: 1.0
      },
      {
        a: 5,
        b: 18,
        order: 1.0
      },
      {
        a: 6,
        b: 19,
        order: 1.0
      },
      {
        a: 6,
        b: 20,
        order: 1.0
      }
    ]
  },
  {
    key: 'butan2ol_r',
    name: '(R)-Butan-2-ol',
    smiles: 'CC[C@@H](C)O',
    formula: 'C4H10O',
    mass: 74.12,
    geometry: 'Tetrahedral stereocentre',
    polarity: 'Polar (-OH)',
    teaches: [
      'ORG1.CHIRALITY',
      'ORG1.RS',
      'ORG1.ENANTIODIA'
    ],
    facts: [
      'C2 carries four different groups (OH, ethyl, methyl, H), so it is a stereocentre.',
      'CIP priorities: O beats the ethyl carbon, which beats methyl, which beats H. Lowest priority points back; O to Et to Me traces clockwise, hence R.',
      'Use Stereochemistry mode to build the mirror image and try to superimpose it.'
    ],
    atoms: [
      {
        el: 'C',
        pos: [-1.625, 0.297, -0.649],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'C',
        pos: [-0.778, -0.106, 0.547],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'C',
        pos: [0.651, -0.514, 0.178],
        lp: 0,
        sn: 4,
        hyb: 'sp3',
        cip: 'R'
      },
      {
        el: 'C',
        pos: [1.467, 0.622, -0.421],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'O',
        pos: [1.322, -0.947, 1.361],
        lp: 2,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'H',
        pos: [-1.644, -0.497, -1.402],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-2.655, 0.488, -0.333],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-1.249, 1.211, -1.118],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-0.756, 0.713, 1.277],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-1.266, -0.943, 1.061],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [0.637, -1.358, -0.521],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [1.498, 1.482, 0.257],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [1.066, 0.949, -1.384],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [2.505, 0.306, -0.573],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [0.826, -1.703, 1.72],
        lp: 0,
        sn: 1
      }
    ],
    bonds: [
      {
        a: 0,
        b: 1,
        order: 1.0
      },
      {
        a: 1,
        b: 2,
        order: 1.0
      },
      {
        a: 2,
        b: 3,
        order: 1.0
      },
      {
        a: 2,
        b: 4,
        order: 1.0
      },
      {
        a: 0,
        b: 5,
        order: 1.0
      },
      {
        a: 0,
        b: 6,
        order: 1.0
      },
      {
        a: 0,
        b: 7,
        order: 1.0
      },
      {
        a: 1,
        b: 8,
        order: 1.0
      },
      {
        a: 1,
        b: 9,
        order: 1.0
      },
      {
        a: 2,
        b: 10,
        order: 1.0
      },
      {
        a: 3,
        b: 11,
        order: 1.0
      },
      {
        a: 3,
        b: 12,
        order: 1.0
      },
      {
        a: 3,
        b: 13,
        order: 1.0
      },
      {
        a: 4,
        b: 14,
        order: 1.0
      }
    ]
  },
  {
    key: 'butan2ol_s',
    name: '(S)-Butan-2-ol',
    smiles: 'CC[C@H](C)O',
    formula: 'C4H10O',
    mass: 74.12,
    geometry: 'Tetrahedral stereocentre',
    polarity: 'Polar (-OH)',
    teaches: [
      'ORG1.CHIRALITY',
      'ORG1.RS',
      'ORG1.ENANTIODIA'
    ],
    facts: [
      'The non-superimposable mirror image of the R enantiomer. Same connectivity, same formula, same melting point.',
      'Enantiomers differ only where the environment is itself chiral: a chiral reagent, a chiral column, or plane-polarised light.',
      'Rotating a model does not change R to S. If turning it makes the descriptor change, the descriptor was assigned wrong.'
    ],
    atoms: [
      {
        el: 'C',
        pos: [-1.507, 0.038, -0.741],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'C',
        pos: [-0.811, 0.079, 0.614],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'C',
        pos: [0.684, -0.256, 0.565],
        lp: 0,
        sn: 4,
        hyb: 'sp3',
        cip: 'S'
      },
      {
        el: 'C',
        pos: [1.496, 0.725, -0.268],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'O',
        pos: [0.881, -1.562, 0.033],
        lp: 2,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'H',
        pos: [-1.392, -0.938, -1.221],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-2.579, 0.225, -0.615],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-1.116, 0.806, -1.415],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-0.953, 1.068, 1.063],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-1.311, -0.647, 1.266],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [1.079, -0.255, 1.588],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [1.352, 1.754, 0.075],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [1.237, 0.663, -1.33],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [2.563, 0.484, -0.2],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [0.376, -2.183, 0.585],
        lp: 0,
        sn: 1
      }
    ],
    bonds: [
      {
        a: 0,
        b: 1,
        order: 1.0
      },
      {
        a: 1,
        b: 2,
        order: 1.0
      },
      {
        a: 2,
        b: 3,
        order: 1.0
      },
      {
        a: 2,
        b: 4,
        order: 1.0
      },
      {
        a: 0,
        b: 5,
        order: 1.0
      },
      {
        a: 0,
        b: 6,
        order: 1.0
      },
      {
        a: 0,
        b: 7,
        order: 1.0
      },
      {
        a: 1,
        b: 8,
        order: 1.0
      },
      {
        a: 1,
        b: 9,
        order: 1.0
      },
      {
        a: 2,
        b: 10,
        order: 1.0
      },
      {
        a: 3,
        b: 11,
        order: 1.0
      },
      {
        a: 3,
        b: 12,
        order: 1.0
      },
      {
        a: 3,
        b: 13,
        order: 1.0
      },
      {
        a: 4,
        b: 14,
        order: 1.0
      }
    ]
  },
  {
    key: 'tartaric_meso',
    name: 'meso-Tartaric acid',
    smiles: 'O[C@H](C(=O)O)[C@@H](O)C(=O)O',
    formula: 'C4H6O6',
    mass: 150.09,
    geometry: 'Two stereocentres, internal mirror plane',
    polarity: 'Polar',
    teaches: [
      'ORG1.ENANTIODIA',
      'ORG1.MULTIPLESTEREO'
    ],
    facts: [
      'Two stereocentres, one R and one S, with a mirror plane running between them.',
      'The molecule is superimposable on its own mirror image, so it is achiral despite having stereocentres. This is meso.',
      'Optically inactive: the two halves rotate light in opposite senses and cancel. Having stereocentres is not the same as being chiral.'
    ],
    atoms: [
      {
        el: 'O',
        pos: [-0.5, 1.631, 0.913],
        lp: 2,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'C',
        pos: [-0.485, 0.593, -0.077],
        lp: 0,
        sn: 4,
        hyb: 'sp3',
        cip: 'S'
      },
      {
        el: 'C',
        pos: [-1.903, 0.07, -0.233],
        lp: 0,
        sn: 3,
        hyb: 'sp2'
      },
      {
        el: 'O',
        pos: [-2.746, 0.063, 0.654],
        lp: 2,
        sn: 3,
        hyb: 'sp2'
      },
      {
        el: 'O',
        pos: [-2.19, -0.383, -1.466],
        lp: 2,
        sn: 4,
        hyb: 'sp2'
      },
      {
        el: 'C',
        pos: [0.429, -0.557, 0.342],
        lp: 0,
        sn: 4,
        hyb: 'sp3',
        cip: 'R'
      },
      {
        el: 'O',
        pos: [0.488, -1.582, -0.659],
        lp: 2,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'C',
        pos: [1.834, -0.023, 0.587],
        lp: 0,
        sn: 3,
        hyb: 'sp2'
      },
      {
        el: 'O',
        pos: [2.325, 0.308, 1.652],
        lp: 2,
        sn: 3,
        hyb: 'sp2'
      },
      {
        el: 'O',
        pos: [2.556, 0.052, -0.558],
        lp: 2,
        sn: 4,
        hyb: 'sp2'
      },
      {
        el: 'H',
        pos: [-1.121, 1.352, 1.616],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-0.17, 1.047, -1.023],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-3.117, -0.697, -1.408],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [0.087, -1.026, 1.271],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [1.093, -1.252, -1.354],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [3.422, 0.404, -0.257],
        lp: 0,
        sn: 1
      }
    ],
    bonds: [
      {
        a: 0,
        b: 1,
        order: 1.0
      },
      {
        a: 1,
        b: 2,
        order: 1.0
      },
      {
        a: 2,
        b: 3,
        order: 2.0
      },
      {
        a: 2,
        b: 4,
        order: 1.0
      },
      {
        a: 1,
        b: 5,
        order: 1.0
      },
      {
        a: 5,
        b: 6,
        order: 1.0
      },
      {
        a: 5,
        b: 7,
        order: 1.0
      },
      {
        a: 7,
        b: 8,
        order: 2.0
      },
      {
        a: 7,
        b: 9,
        order: 1.0
      },
      {
        a: 0,
        b: 10,
        order: 1.0
      },
      {
        a: 1,
        b: 11,
        order: 1.0
      },
      {
        a: 4,
        b: 12,
        order: 1.0
      },
      {
        a: 5,
        b: 13,
        order: 1.0
      },
      {
        a: 6,
        b: 14,
        order: 1.0
      },
      {
        a: 9,
        b: 15,
        order: 1.0
      }
    ]
  },
  {
    key: 'tbu_cation',
    name: 'tert-Butyl cation',
    smiles: 'C[C+](C)C',
    formula: 'C4H9+',
    mass: 57.12,
    geometry: 'Trigonal planar carbocation',
    polarity: 'Cation',
    teaches: [
      'ORG1.CARBOCATION',
      'ORG1.SN1'
    ],
    facts: [
      'Three groups, no lone pairs on the cationic carbon: sp2, trigonal planar, 120 degrees.',
      'The empty p orbital sits perpendicular to that plane, open on both faces.',
      'That is the structural reason SN1 at a stereocentre gives both configurations: a nucleophile can attack either face of a flat cation.',
      'Nine C-H bonds hyperconjugate into the empty p orbital, which is why tertiary cations are the stable ones.'
    ],
    atoms: [
      {
        el: 'C',
        pos: [-0.238, 1.457, -0.141],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'C',
        pos: [-0.048, 0.012, 0.183],
        lp: 0,
        sn: 3,
        hyb: 'sp2',
        charge: 1
      },
      {
        el: 'C',
        pos: [1.34, -0.497, 0.397],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'C',
        pos: [-1.113, -0.957, -0.21],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'H',
        pos: [-0.013, 1.644, -1.195],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [0.417, 2.083, 0.472],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-1.269, 1.767, 0.055],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [1.326, -1.447, 0.94],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [1.842, -0.652, -0.562],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [1.928, 0.212, 0.988],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-1.023, -1.888, 0.359],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-1.041, -1.192, -1.276],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-2.107, -0.544, -0.011],
        lp: 0,
        sn: 1
      }
    ],
    bonds: [
      {
        a: 0,
        b: 1,
        order: 1.0
      },
      {
        a: 1,
        b: 2,
        order: 1.0
      },
      {
        a: 1,
        b: 3,
        order: 1.0
      },
      {
        a: 0,
        b: 4,
        order: 1.0
      },
      {
        a: 0,
        b: 5,
        order: 1.0
      },
      {
        a: 0,
        b: 6,
        order: 1.0
      },
      {
        a: 2,
        b: 7,
        order: 1.0
      },
      {
        a: 2,
        b: 8,
        order: 1.0
      },
      {
        a: 2,
        b: 9,
        order: 1.0
      },
      {
        a: 3,
        b: 10,
        order: 1.0
      },
      {
        a: 3,
        b: 11,
        order: 1.0
      },
      {
        a: 3,
        b: 12,
        order: 1.0
      }
    ]
  },
  {
    key: 'water',
    name: 'Water',
    smiles: 'O',
    formula: 'H2O',
    mass: 18.02,
    geometry: 'Bent - 104.5 deg',
    polarity: 'Strongly polar',
    teaches: [
      'GEN1.VSEPR',
      'GEN1.POLARITY',
      'ORG1.INDUCTIVE'
    ],
    facts: [
      'Two bonds plus two lone pairs: steric number 4, so the electron geometry is tetrahedral.',
      'Lone pairs take more angular room than bonds, squeezing H-O-H to 104.5 rather than 109.5.',
      'The molecular shape is bent because shape names where the atoms are, not where the lone pairs are.',
      'Bent plus polar bonds means the dipoles cannot cancel. 1.85 D.'
    ],
    atoms: [
      {
        el: 'O',
        pos: [0.005, 0.398, 0.0],
        lp: 2,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'H',
        pos: [-0.766, -0.189, 0.0],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [0.761, -0.209, 0.0],
        lp: 0,
        sn: 1
      }
    ],
    bonds: [
      {
        a: 0,
        b: 1,
        order: 1.0
      },
      {
        a: 0,
        b: 2,
        order: 1.0
      }
    ]
  },
  {
    key: 'ammonia',
    name: 'Ammonia',
    smiles: 'N',
    formula: 'H3N',
    mass: 17.03,
    geometry: 'Trigonal pyramidal - 107 deg',
    polarity: 'Polar',
    teaches: [
      'GEN1.VSEPR',
      'GEN1.POLARITY'
    ],
    facts: [
      'Three bonds plus one lone pair: steric number 4, electron geometry tetrahedral, molecular shape pyramidal.',
      'One lone pair compresses the angle to about 107 - less squeeze than water\'s two.',
      'That lone pair is the base and the nucleophile. 1.47 D.'
    ],
    atoms: [
      {
        el: 'N',
        pos: [0.002, 0.005, 0.296],
        lp: 1,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'H',
        pos: [0.928, -0.143, -0.103],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-0.588, -0.735, -0.081],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-0.343, 0.873, -0.111],
        lp: 0,
        sn: 1
      }
    ],
    bonds: [
      {
        a: 0,
        b: 1,
        order: 1.0
      },
      {
        a: 0,
        b: 2,
        order: 1.0
      },
      {
        a: 0,
        b: 3,
        order: 1.0
      }
    ]
  },
  {
    key: 'ethanol',
    name: 'Ethanol',
    smiles: 'CCO',
    formula: 'C2H6O',
    mass: 46.07,
    geometry: 'Tetrahedral carbons, bent at oxygen',
    polarity: 'Polar (-OH)',
    teaches: [
      'ORG1.FUNCTIONALGROUPS',
      'ORG2.ALCOHOLPROPS'
    ],
    facts: [
      'The hydroxyl dominates the chemistry: hydrogen bond donor and acceptor at once.',
      'Hydrogen bonding is why ethanol boils at 78 C while propane, of similar mass, boils at -42 C.',
      'Oxidation ladder: ethanol to acetaldehyde to acetic acid.'
    ],
    atoms: [
      {
        el: 'C',
        pos: [-0.836, -0.314, -0.139],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'C',
        pos: [0.359, 0.583, 0.105],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'O',
        pos: [1.434, -0.176, 0.641],
        lp: 2,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'H',
        pos: [-1.679, 0.259, -0.537],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-0.585, -1.109, -0.849],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-1.147, -0.803, 0.789],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [0.692, 1.056, -0.824],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [0.107, 1.37, 0.822],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [1.657, -0.866, -0.007],
        lp: 0,
        sn: 1
      }
    ],
    bonds: [
      {
        a: 0,
        b: 1,
        order: 1.0
      },
      {
        a: 1,
        b: 2,
        order: 1.0
      },
      {
        a: 0,
        b: 3,
        order: 1.0
      },
      {
        a: 0,
        b: 4,
        order: 1.0
      },
      {
        a: 0,
        b: 5,
        order: 1.0
      },
      {
        a: 1,
        b: 6,
        order: 1.0
      },
      {
        a: 1,
        b: 7,
        order: 1.0
      },
      {
        a: 2,
        b: 8,
        order: 1.0
      }
    ]
  },
  {
    key: 'acetone',
    name: 'Acetone',
    smiles: 'CC(C)=O',
    formula: 'C3H6O',
    mass: 58.08,
    geometry: 'Trigonal planar at the carbonyl',
    polarity: 'Polar (C=O)',
    teaches: [
      'ORG2.CARBONYLSTRUCTURE',
      'ORG1.HYBRIDORG'
    ],
    facts: [
      'The carbonyl carbon has three attached groups and no lone pairs: sp2, trigonal planar, about 120 degrees.',
      'Oxygen is far more electronegative, so the C=O is strongly polarised - carbon partially positive and open to nucleophiles.',
      'That polarisation, plus a p orbital perpendicular to the plane, is the whole basis of nucleophilic addition.',
      'The two methyls are equivalent by symmetry: one 1H signal.'
    ],
    atoms: [
      {
        el: 'C',
        pos: [-1.265, -0.0, -0.265],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'C',
        pos: [-0.044, -0.14, 0.604],
        lp: 0,
        sn: 3,
        hyb: 'sp2'
      },
      {
        el: 'C',
        pos: [1.288, 0.076, -0.062],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'O',
        pos: [-0.131, -0.416, 1.799],
        lp: 2,
        sn: 3,
        hyb: 'sp2'
      },
      {
        el: 'H',
        pos: [-1.308, 1.011, -0.676],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-1.225, -0.734, -1.073],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-2.164, -0.179, 0.331],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [1.337, 1.09, -0.465],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [1.42, -0.656, -0.862],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [2.091, -0.052, 0.67],
        lp: 0,
        sn: 1
      }
    ],
    bonds: [
      {
        a: 0,
        b: 1,
        order: 1.0
      },
      {
        a: 1,
        b: 2,
        order: 1.0
      },
      {
        a: 1,
        b: 3,
        order: 2.0
      },
      {
        a: 0,
        b: 4,
        order: 1.0
      },
      {
        a: 0,
        b: 5,
        order: 1.0
      },
      {
        a: 0,
        b: 6,
        order: 1.0
      },
      {
        a: 2,
        b: 7,
        order: 1.0
      },
      {
        a: 2,
        b: 8,
        order: 1.0
      },
      {
        a: 2,
        b: 9,
        order: 1.0
      }
    ]
  },
  {
    key: 'acetic_acid',
    name: 'Acetic acid',
    smiles: 'CC(=O)O',
    formula: 'C2H4O2',
    mass: 60.05,
    geometry: 'Trigonal planar carboxyl',
    polarity: 'Polar (carboxylic acid)',
    teaches: [
      'ORG2.ACIDPROPS',
      'ORG1.PKA'
    ],
    facts: [
      'One sp2 carbon carrying both C=O and C-OH - the carboxyl group.',
      'pKa 4.76. Acidic because acetate spreads the negative charge over two equivalent oxygens.',
      'In acetate the two C-O bonds become identical, which is the structural signature of real delocalisation.'
    ],
    atoms: [
      {
        el: 'C',
        pos: [-0.941, -0.197, -0.068],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'C',
        pos: [0.466, 0.3, -0.129],
        lp: 0,
        sn: 3,
        hyb: 'sp2'
      },
      {
        el: 'O',
        pos: [0.875, 1.24, -0.788],
        lp: 2,
        sn: 3,
        hyb: 'sp2'
      },
      {
        el: 'O',
        pos: [1.298, -0.417, 0.649],
        lp: 2,
        sn: 4,
        hyb: 'sp2'
      },
      {
        el: 'H',
        pos: [-1.57, 0.419, -0.716],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-0.984, -1.231, -0.42],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-1.316, -0.123, 0.955],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [2.171, 0.008, 0.517],
        lp: 0,
        sn: 1
      }
    ],
    bonds: [
      {
        a: 0,
        b: 1,
        order: 1.0
      },
      {
        a: 1,
        b: 2,
        order: 2.0
      },
      {
        a: 1,
        b: 3,
        order: 1.0
      },
      {
        a: 0,
        b: 4,
        order: 1.0
      },
      {
        a: 0,
        b: 5,
        order: 1.0
      },
      {
        a: 0,
        b: 6,
        order: 1.0
      },
      {
        a: 3,
        b: 7,
        order: 1.0
      }
    ]
  },
  {
    key: 'chloromethane',
    name: 'Chloromethane',
    smiles: 'CCl',
    formula: 'CH3Cl',
    mass: 50.49,
    geometry: 'Tetrahedral',
    polarity: 'Polar',
    teaches: [
      'ORG1.INDUCTIVE',
      'ORG1.SN2',
      'GEN1.POLARITY'
    ],
    facts: [
      'A single polar bond with nothing to cancel it, so the molecular dipole is just the bond dipole. 1.90 D.',
      'Chlorine pulls sigma density toward itself, leaving carbon partially positive - the electrophilic carbon SN2 attacks.',
      'The nucleophile comes in on the face opposite the leaving group, which is why SN2 inverts configuration.'
    ],
    atoms: [
      {
        el: 'C',
        pos: [-0.139, 0.002, -0.005],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'Cl',
        pos: [1.627, -0.018, 0.056],
        lp: 3,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'H',
        pos: [-0.473, -0.582, -0.866],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-0.533, -0.436, 0.915],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-0.481, 1.034, -0.101],
        lp: 0,
        sn: 1
      }
    ],
    bonds: [
      {
        a: 0,
        b: 1,
        order: 1.0
      },
      {
        a: 0,
        b: 2,
        order: 1.0
      },
      {
        a: 0,
        b: 3,
        order: 1.0
      },
      {
        a: 0,
        b: 4,
        order: 1.0
      }
    ]
  },
  {
    key: 'butadiene',
    name: '1,3-Butadiene',
    smiles: 'C=CC=C',
    formula: 'C4H6',
    mass: 54.09,
    geometry: 'Planar, s-trans conformer',
    polarity: 'Nonpolar',
    teaches: [
      'ORG2.CONJUGATION',
      'ORG2.DIELSALDER'
    ],
    facts: [
      'Four sp2 carbons in a row with four aligned p orbitals: the pi system spans all four.',
      'The central C-C is shorter than an ordinary single bond because it carries partial double-bond character.',
      'Shown s-trans, the favoured conformer. Diels-Alder needs s-cis, which is why the diene must be able to reach that shape.'
    ],
    atoms: [
      {
        el: 'C',
        pos: [-1.813, -0.254, -0.085],
        lp: 0,
        sn: 3,
        hyb: 'sp2'
      },
      {
        el: 'C',
        pos: [-0.508, -0.509, 0.058],
        lp: 0,
        sn: 3,
        hyb: 'sp2'
      },
      {
        el: 'C',
        pos: [0.508, 0.509, -0.058],
        lp: 0,
        sn: 3,
        hyb: 'sp2'
      },
      {
        el: 'C',
        pos: [1.813, 0.254, 0.085],
        lp: 0,
        sn: 3,
        hyb: 'sp2'
      },
      {
        el: 'H',
        pos: [-2.543, -1.051, 0.01],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-2.188, 0.742, -0.299],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-0.188, -1.526, 0.271],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [0.188, 1.526, -0.271],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [2.188, -0.742, 0.299],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [2.543, 1.051, -0.01],
        lp: 0,
        sn: 1
      }
    ],
    bonds: [
      {
        a: 0,
        b: 1,
        order: 2.0
      },
      {
        a: 1,
        b: 2,
        order: 1.0
      },
      {
        a: 2,
        b: 3,
        order: 2.0
      },
      {
        a: 0,
        b: 4,
        order: 1.0
      },
      {
        a: 0,
        b: 5,
        order: 1.0
      },
      {
        a: 1,
        b: 6,
        order: 1.0
      },
      {
        a: 2,
        b: 7,
        order: 1.0
      },
      {
        a: 3,
        b: 8,
        order: 1.0
      },
      {
        a: 3,
        b: 9,
        order: 1.0
      }
    ]
  },
  {
    key: 'pyridine',
    name: 'Pyridine',
    smiles: 'c1ccncc1',
    formula: 'C5H5N',
    mass: 79.1,
    geometry: 'Planar aromatic ring',
    polarity: 'Polar',
    teaches: [
      'ORG2.AROMATICIONS',
      'ORG2.HETEROCYCLES',
      'ORG2.HUCKEL'
    ],
    facts: [
      'Aromatic with six pi electrons, like benzene, but the nitrogen lone pair is NOT in the pi system.',
      'That lone pair sits in an sp2 orbital in the ring plane, pointing outward, so it is available to act as a base.',
      'Contrast pyrrole, where the nitrogen lone pair is needed to reach six pi electrons and so is not basic.'
    ],
    atoms: [
      {
        el: 'C',
        pos: [-0.098, 1.179, 0.047],
        lp: 0,
        sn: 3,
        hyb: 'sp2',
        aromatic: true
      },
      {
        el: 'C',
        pos: [1.156, 0.58, -0.008],
        lp: 0,
        sn: 3,
        hyb: 'sp2',
        aromatic: true
      },
      {
        el: 'C',
        pos: [1.22, -0.803, -0.061],
        lp: 0,
        sn: 3,
        hyb: 'sp2',
        aromatic: true
      },
      {
        el: 'N',
        pos: [0.134, -1.606, -0.064],
        lp: 1,
        sn: 3,
        hyb: 'sp2',
        aromatic: true
      },
      {
        el: 'C',
        pos: [-1.07, -0.996, -0.01],
        lp: 0,
        sn: 3,
        hyb: 'sp2',
        aromatic: true
      },
      {
        el: 'C',
        pos: [-1.236, 0.378, 0.046],
        lp: 0,
        sn: 3,
        hyb: 'sp2',
        aromatic: true
      },
      {
        el: 'H',
        pos: [-0.189, 2.26, 0.089],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [2.062, 1.176, -0.008],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [2.176, -1.318, -0.105],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-1.927, -1.664, -0.013],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-2.228, 0.814, 0.087],
        lp: 0,
        sn: 1
      }
    ],
    bonds: [
      {
        a: 0,
        b: 1,
        order: 1.5
      },
      {
        a: 1,
        b: 2,
        order: 1.5
      },
      {
        a: 2,
        b: 3,
        order: 1.5
      },
      {
        a: 3,
        b: 4,
        order: 1.5
      },
      {
        a: 4,
        b: 5,
        order: 1.5
      },
      {
        a: 5,
        b: 0,
        order: 1.5
      },
      {
        a: 0,
        b: 6,
        order: 1.0
      },
      {
        a: 1,
        b: 7,
        order: 1.0
      },
      {
        a: 2,
        b: 8,
        order: 1.0
      },
      {
        a: 4,
        b: 9,
        order: 1.0
      },
      {
        a: 5,
        b: 10,
        order: 1.0
      }
    ]
  },
  {
    key: 'glycine_zwitterion',
    name: 'Glycine (zwitterion)',
    smiles: '[NH3+]CC(=O)[O-]',
    formula: 'C2H5NO2',
    mass: 75.07,
    geometry: 'Tetrahedral N, trigonal planar carboxylate',
    polarity: 'Zwitterionic - very polar',
    teaches: [
      'ORG2.AMINOACIDS'
    ],
    facts: [
      'At physiological pH the amine is protonated and the acid deprotonated at the same time.',
      'Net charge zero, but with full formal charges separated inside one molecule.',
      'Those charges are why amino acids are high-melting solids rather than oils.',
      'Glycine is the only proteinogenic amino acid that is achiral: its alpha carbon carries two hydrogens.'
    ],
    atoms: [
      {
        el: 'N',
        pos: [-1.013, -0.472, 0.242],
        lp: 0,
        sn: 4,
        hyb: 'sp3',
        charge: 1
      },
      {
        el: 'C',
        pos: [-0.068, 0.57, -0.317],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'C',
        pos: [1.389, 0.129, -0.045],
        lp: 0,
        sn: 3,
        hyb: 'sp2'
      },
      {
        el: 'O',
        pos: [2.301, 0.88, -0.443],
        lp: 2,
        sn: 3,
        hyb: 'sp2'
      },
      {
        el: 'O',
        pos: [1.38, -0.988, 0.572],
        lp: 3,
        sn: 4,
        hyb: 'sp2',
        charge: -1
      },
      {
        el: 'H',
        pos: [-1.541, -0.973, -0.472],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-0.312, -1.157, 0.633],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-1.569, -0.143, 1.029],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-0.299, 1.512, 0.188],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-0.269, 0.641, -1.388],
        lp: 0,
        sn: 1
      }
    ],
    bonds: [
      {
        a: 0,
        b: 1,
        order: 1.0
      },
      {
        a: 1,
        b: 2,
        order: 1.0
      },
      {
        a: 2,
        b: 3,
        order: 2.0
      },
      {
        a: 2,
        b: 4,
        order: 1.0
      },
      {
        a: 0,
        b: 5,
        order: 1.0
      },
      {
        a: 0,
        b: 6,
        order: 1.0
      },
      {
        a: 0,
        b: 7,
        order: 1.0
      },
      {
        a: 1,
        b: 8,
        order: 1.0
      },
      {
        a: 1,
        b: 9,
        order: 1.0
      }
    ]
  },
  {
    key: 'l_alanine',
    name: 'L-Alanine',
    smiles: 'C[C@@H](C(=O)O)N',
    formula: 'C3H7NO2',
    mass: 89.09,
    geometry: 'Tetrahedral stereocentre',
    polarity: 'Polar',
    teaches: [
      'ORG2.AMINOACIDS',
      'ORG1.RS'
    ],
    facts: [
      'The alpha carbon carries four different groups: methyl, carboxyl, amino, hydrogen.',
      'L-alanine is (S). Nearly every proteinogenic amino acid is L, and cysteine is (R) only because sulfur outranks the carboxyl carbon in CIP, not because its shape differs.',
      'The naming convention and the CIP descriptor answer different questions - do not expect them to agree.'
    ],
    atoms: [
      {
        el: 'C',
        pos: [-1.162, -0.818, 0.09],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'C',
        pos: [-0.174, 0.333, 0.228],
        lp: 0,
        sn: 4,
        hyb: 'sp3',
        cip: 'S'
      },
      {
        el: 'C',
        pos: [1.277, -0.098, -0.027],
        lp: 0,
        sn: 3,
        hyb: 'sp2'
      },
      {
        el: 'O',
        pos: [2.153, 0.586, -0.537],
        lp: 2,
        sn: 3,
        hyb: 'sp2'
      },
      {
        el: 'O',
        pos: [1.58, -1.319, 0.458],
        lp: 2,
        sn: 4,
        hyb: 'sp2'
      },
      {
        el: 'N',
        pos: [-0.556, 1.396, -0.724],
        lp: 1,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'H',
        pos: [-0.968, -1.593, 0.839],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-2.193, -0.476, 0.233],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-1.091, -1.29, -0.897],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-0.211, 0.739, 1.245],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [2.527, -1.426, 0.231],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-1.38, 1.882, -0.378],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [0.2, 2.084, -0.76],
        lp: 0,
        sn: 1
      }
    ],
    bonds: [
      {
        a: 0,
        b: 1,
        order: 1.0
      },
      {
        a: 1,
        b: 2,
        order: 1.0
      },
      {
        a: 2,
        b: 3,
        order: 2.0
      },
      {
        a: 2,
        b: 4,
        order: 1.0
      },
      {
        a: 1,
        b: 5,
        order: 1.0
      },
      {
        a: 0,
        b: 6,
        order: 1.0
      },
      {
        a: 0,
        b: 7,
        order: 1.0
      },
      {
        a: 0,
        b: 8,
        order: 1.0
      },
      {
        a: 1,
        b: 9,
        order: 1.0
      },
      {
        a: 4,
        b: 10,
        order: 1.0
      },
      {
        a: 5,
        b: 11,
        order: 1.0
      },
      {
        a: 5,
        b: 12,
        order: 1.0
      }
    ]
  },
  {
    key: 'glucose_beta',
    name: 'beta-D-Glucopyranose',
    smiles: 'OC[C@H]1O[C@@H](O)[C@H](O)[C@@H](O)[C@@H]1O',
    formula: 'C6H12O6',
    mass: 180.16,
    geometry: 'Chair pyranose, all substituents equatorial',
    polarity: 'Polar',
    teaches: [
      'ORG2.CARBOHYDRATES'
    ],
    facts: [
      'Five stereocentres on a six-membered ring, and in the beta anomer every OH and the CH2OH can sit equatorial at once.',
      'That unusually comfortable chair is part of why glucose is the sugar biology settled on.',
      'Alpha and beta differ only at the anomeric carbon (C1). They are diastereomers, not enantiomers - an alpha/beta pair differs at one centre out of five.',
      'Anomers interconvert in solution through the open-chain aldehyde: mutarotation.'
    ],
    atoms: [
      {
        el: 'O',
        pos: [3.118, -0.762, 0.368],
        lp: 2,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'C',
        pos: [2.391, 0.415, 0.028],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'C',
        pos: [0.9, 0.289, 0.385],
        lp: 0,
        sn: 4,
        hyb: 'sp3',
        cip: 'R'
      },
      {
        el: 'O',
        pos: [0.281, 1.52, -0.008],
        lp: 2,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'C',
        pos: [-1.119, 1.457, -0.249],
        lp: 0,
        sn: 4,
        hyb: 'sp3',
        cip: 'R'
      },
      {
        el: 'O',
        pos: [-1.303, 1.3, -1.652],
        lp: 2,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'C',
        pos: [-1.846, 0.321, 0.492],
        lp: 0,
        sn: 4,
        hyb: 'sp3',
        cip: 'R'
      },
      {
        el: 'O',
        pos: [-1.756, 0.517, 1.909],
        lp: 2,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'C',
        pos: [-1.249, -1.036, 0.085],
        lp: 0,
        sn: 4,
        hyb: 'sp3',
        cip: 'S'
      },
      {
        el: 'O',
        pos: [-1.978, -1.557, -1.042],
        lp: 2,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'C',
        pos: [0.254, -0.952, -0.262],
        lp: 0,
        sn: 4,
        hyb: 'sp3',
        cip: 'S'
      },
      {
        el: 'O',
        pos: [0.879, -2.171, 0.162],
        lp: 2,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'H',
        pos: [4.06, -0.559, 0.22],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [2.83, 1.267, 0.559],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [2.513, 0.603, -1.045],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [0.836, 0.192, 1.476],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-1.544, 2.421, 0.051],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-1.059, 2.165, -2.027],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-2.91, 0.349, 0.226],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-2.256, -0.206, 2.33],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-1.4, -1.76, 0.894],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-1.861, -0.918, -1.773],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [0.378, -0.901, -1.351],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [1.842, -1.994, 0.224],
        lp: 0,
        sn: 1
      }
    ],
    bonds: [
      {
        a: 0,
        b: 1,
        order: 1.0
      },
      {
        a: 1,
        b: 2,
        order: 1.0
      },
      {
        a: 2,
        b: 3,
        order: 1.0
      },
      {
        a: 3,
        b: 4,
        order: 1.0
      },
      {
        a: 4,
        b: 5,
        order: 1.0
      },
      {
        a: 4,
        b: 6,
        order: 1.0
      },
      {
        a: 6,
        b: 7,
        order: 1.0
      },
      {
        a: 6,
        b: 8,
        order: 1.0
      },
      {
        a: 8,
        b: 9,
        order: 1.0
      },
      {
        a: 8,
        b: 10,
        order: 1.0
      },
      {
        a: 10,
        b: 11,
        order: 1.0
      },
      {
        a: 10,
        b: 2,
        order: 1.0
      },
      {
        a: 0,
        b: 12,
        order: 1.0
      },
      {
        a: 1,
        b: 13,
        order: 1.0
      },
      {
        a: 1,
        b: 14,
        order: 1.0
      },
      {
        a: 2,
        b: 15,
        order: 1.0
      },
      {
        a: 4,
        b: 16,
        order: 1.0
      },
      {
        a: 5,
        b: 17,
        order: 1.0
      },
      {
        a: 6,
        b: 18,
        order: 1.0
      },
      {
        a: 7,
        b: 19,
        order: 1.0
      },
      {
        a: 8,
        b: 20,
        order: 1.0
      },
      {
        a: 9,
        b: 21,
        order: 1.0
      },
      {
        a: 10,
        b: 22,
        order: 1.0
      },
      {
        a: 11,
        b: 23,
        order: 1.0
      }
    ]
  },
  {
    key: 'caffeine',
    name: 'Caffeine',
    smiles: 'Cn1cnc2c1c(=O)n(C)c(=O)n2C',
    formula: 'C8H10N4O2',
    mass: 194.19,
    geometry: 'Planar fused bicycle',
    polarity: 'Polar',
    teaches: [
      'ORG2.HETEROCYCLES',
      'ORG2.AMIDES'
    ],
    facts: [
      'A xanthine alkaloid: a fused six- and five-membered ring system, essentially planar.',
      'Three N-methyl groups are the only sp3 carbons in the molecule - find them by looking for the tetrahedral centres.',
      'Two amide carbonyls make the core strongly polar even though there is no O-H.',
      'It blocks adenosine receptors, which is why it delays the feeling of tiredness rather than supplying energy.'
    ],
    atoms: [
      {
        el: 'C',
        pos: [3.243, 0.675, 0.362],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'N',
        pos: [2.129, -0.234, 0.277],
        lp: 0,
        sn: 3,
        hyb: 'sp2',
        aromatic: true
      },
      {
        el: 'C',
        pos: [2.191, -1.6, 0.364],
        lp: 0,
        sn: 3,
        hyb: 'sp2',
        aromatic: true
      },
      {
        el: 'N',
        pos: [0.998, -2.149, 0.248],
        lp: 1,
        sn: 3,
        hyb: 'sp2',
        aromatic: true
      },
      {
        el: 'C',
        pos: [0.153, -1.093, 0.083],
        lp: 0,
        sn: 3,
        hyb: 'sp2',
        aromatic: true
      },
      {
        el: 'C',
        pos: [0.817, 0.097, 0.095],
        lp: 0,
        sn: 3,
        hyb: 'sp2',
        aromatic: true
      },
      {
        el: 'C',
        pos: [0.169, 1.352, -0.058],
        lp: 0,
        sn: 3,
        hyb: 'sp2'
      },
      {
        el: 'O',
        pos: [0.776, 2.418, -0.045],
        lp: 2,
        sn: 3,
        hyb: 'sp2'
      },
      {
        el: 'N',
        pos: [-1.214, 1.23, -0.222],
        lp: 1,
        sn: 4,
        hyb: 'sp2'
      },
      {
        el: 'C',
        pos: [-1.992, 2.442, -0.389],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'C',
        pos: [-1.937, 0.019, -0.241],
        lp: 0,
        sn: 3,
        hyb: 'sp2'
      },
      {
        el: 'O',
        pos: [-3.163, 0.013, -0.392],
        lp: 2,
        sn: 3,
        hyb: 'sp2'
      },
      {
        el: 'N',
        pos: [-1.209, -1.161, -0.082],
        lp: 1,
        sn: 4,
        hyb: 'sp2'
      },
      {
        el: 'C',
        pos: [-1.877, -2.45, -0.09],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'H',
        pos: [3.304, 1.241, -0.571],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [4.166, 0.108, 0.509],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [3.083, 1.344, 1.211],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [3.118, -2.139, 0.51],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-2.737, 2.5, 0.412],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-1.376, 3.344, -0.365],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-2.519, 2.398, -1.348],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-2.956, -2.349, -0.229],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-1.474, -3.056, -0.907],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-1.693, -2.953, 0.865],
        lp: 0,
        sn: 1
      }
    ],
    bonds: [
      {
        a: 0,
        b: 1,
        order: 1.0
      },
      {
        a: 1,
        b: 2,
        order: 1.5
      },
      {
        a: 2,
        b: 3,
        order: 1.5
      },
      {
        a: 3,
        b: 4,
        order: 1.5
      },
      {
        a: 4,
        b: 5,
        order: 1.5
      },
      {
        a: 5,
        b: 6,
        order: 1.0
      },
      {
        a: 6,
        b: 7,
        order: 2.0
      },
      {
        a: 6,
        b: 8,
        order: 1.0
      },
      {
        a: 8,
        b: 9,
        order: 1.0
      },
      {
        a: 8,
        b: 10,
        order: 1.0
      },
      {
        a: 10,
        b: 11,
        order: 2.0
      },
      {
        a: 10,
        b: 12,
        order: 1.0
      },
      {
        a: 12,
        b: 13,
        order: 1.0
      },
      {
        a: 5,
        b: 1,
        order: 1.5
      },
      {
        a: 12,
        b: 4,
        order: 1.0
      },
      {
        a: 0,
        b: 14,
        order: 1.0
      },
      {
        a: 0,
        b: 15,
        order: 1.0
      },
      {
        a: 0,
        b: 16,
        order: 1.0
      },
      {
        a: 2,
        b: 17,
        order: 1.0
      },
      {
        a: 9,
        b: 18,
        order: 1.0
      },
      {
        a: 9,
        b: 19,
        order: 1.0
      },
      {
        a: 9,
        b: 20,
        order: 1.0
      },
      {
        a: 13,
        b: 21,
        order: 1.0
      },
      {
        a: 13,
        b: 22,
        order: 1.0
      },
      {
        a: 13,
        b: 23,
        order: 1.0
      }
    ]
  }
];

export const GENERAL_MOLECULES: Molecule[] = [
  {
    key: 'gc_water',
    name: 'Water',
    smiles: 'O',
    formula: 'H2O',
    mass: 18.02,
    geometry: 'Bent - 104.5 deg',
    polarity: 'Polar - 1.85 D',
    teaches: [
      'GEN1.VSEPR',
      'GEN1.POLARITY',
      'GEN1.LEWIS'
    ],
    facts: [
      'Oxygen carries four electron domains: two bonds and two lone pairs. AX2E2.',
      'The electron geometry is tetrahedral. The molecular shape is bent, because shape names where the ATOMS are.',
      'Lone pairs are held by one nucleus rather than two, so they take more angular room and squeeze the angle from 109.5 to 104.5 degrees.',
      'Two polar bonds at 104.5 degrees cannot cancel. The vector sum is 1.85 D, and that is why water dissolves salt.'
    ],
    atoms: [
      {
        el: 'O',
        pos: [0.005, 0.398, 0.0],
        lp: 2,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'H',
        pos: [-0.766, -0.189, 0.0],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [0.761, -0.209, 0.0],
        lp: 0,
        sn: 1
      }
    ],
    bonds: [
      {
        a: 0,
        b: 1,
        order: 1.0
      },
      {
        a: 0,
        b: 2,
        order: 1.0
      }
    ]
  },
  {
    key: 'gc_co2',
    name: 'Carbon dioxide',
    smiles: 'O=C=O',
    formula: 'CO2',
    mass: 44.01,
    geometry: 'Linear - 180 deg',
    polarity: 'Nonpolar - 0 D',
    teaches: [
      'GEN1.VSEPR',
      'GEN1.POLARITY'
    ],
    facts: [
      'Carbon carries two electron domains and no lone pairs. AX2, linear.',
      'A double bond counts as ONE domain. Domains are groups of electrons, not bonds.',
      'Each C=O is strongly polar, and the two point exactly opposite, so the vector sum is zero.',
      'Compare with water: same two attached atoms, completely different shape and behaviour. The lone pairs no formula shows are what decide it.'
    ],
    atoms: [
      {
        el: 'O',
        pos: [-1.405, -0.019, 0.0],
        lp: 2,
        sn: 3,
        hyb: 'sp2'
      },
      {
        el: 'C',
        pos: [0.0, -0.0, 0.0],
        lp: 0,
        sn: 2,
        hyb: 'sp'
      },
      {
        el: 'O',
        pos: [1.405, 0.019, 0.0],
        lp: 2,
        sn: 3,
        hyb: 'sp2'
      }
    ],
    bonds: [
      {
        a: 0,
        b: 1,
        order: 2.0
      },
      {
        a: 1,
        b: 2,
        order: 2.0
      }
    ]
  },
  {
    key: 'gc_ammonia',
    name: 'Ammonia',
    smiles: 'N',
    formula: 'H3N',
    mass: 17.03,
    geometry: 'Trigonal pyramidal - 107 deg',
    polarity: 'Polar - 1.47 D',
    teaches: [
      'GEN1.VSEPR',
      'GEN1.POLARITY',
      'GEN1.HYBRIDIZATION'
    ],
    facts: [
      'Four domains, one of them a lone pair. AX3E.',
      'Electron geometry tetrahedral, molecular shape trigonal pyramidal.',
      'One lone pair compresses the angle to about 107 degrees, less squeeze than water\'s two.',
      'The three N-H dipoles and the lone pair all point the same way, which is why ammonia is strongly polar and a good base.'
    ],
    atoms: [
      {
        el: 'N',
        pos: [0.002, 0.005, 0.296],
        lp: 1,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'H',
        pos: [0.928, -0.143, -0.103],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-0.588, -0.735, -0.081],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-0.343, 0.873, -0.111],
        lp: 0,
        sn: 1
      }
    ],
    bonds: [
      {
        a: 0,
        b: 1,
        order: 1.0
      },
      {
        a: 0,
        b: 2,
        order: 1.0
      },
      {
        a: 0,
        b: 3,
        order: 1.0
      }
    ]
  },
  {
    key: 'gc_methane',
    name: 'Methane',
    smiles: 'C',
    formula: 'CH4',
    mass: 16.04,
    geometry: 'Tetrahedral - 109.5 deg',
    polarity: 'Nonpolar - 0 D',
    teaches: [
      'GEN1.VSEPR',
      'GEN1.HYBRIDIZATION'
    ],
    facts: [
      'Four domains, no lone pairs. AX4, the undistorted tetrahedron at 109.5 degrees.',
      'C-H bonds are barely polar to begin with, and perfect symmetry cancels what little there is.'
    ],
    atoms: [
      {
        el: 'C',
        pos: [0.0, -0.0, 0.0],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'H',
        pos: [-0.675, 0.346, 0.786],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-0.487, -0.789, -0.577],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [0.915, -0.39, 0.451],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [0.247, 0.834, -0.661],
        lp: 0,
        sn: 1
      }
    ],
    bonds: [
      {
        a: 0,
        b: 1,
        order: 1.0
      },
      {
        a: 0,
        b: 2,
        order: 1.0
      },
      {
        a: 0,
        b: 3,
        order: 1.0
      },
      {
        a: 0,
        b: 4,
        order: 1.0
      }
    ]
  },
  {
    key: 'gc_ccl4',
    name: 'Carbon tetrachloride',
    smiles: 'ClC(Cl)(Cl)Cl',
    formula: 'CCl4',
    mass: 153.82,
    geometry: 'Tetrahedral - 109.5 deg',
    polarity: 'Nonpolar - 0 D',
    teaches: [
      'GEN1.POLARITY',
      'GEN1.VSEPR'
    ],
    facts: [
      'Four strongly polar C-Cl bonds, and a molecular dipole of exactly zero.',
      'This is the molecule that separates the two questions. Bond polarity asks about one bond; molecular polarity asks about the vector sum over the whole shape.',
      'Switch on the dipole overlay: four arrows pointing at the corners of a tetrahedron add to nothing.',
      'OCTET names this misconception GEN1M11, polar bonds mean polar molecule.'
    ],
    atoms: [
      {
        el: 'Cl',
        pos: [1.394, -1.109, -0.023],
        lp: 3,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'C',
        pos: [0.0, 0.0, -0.0],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'Cl',
        pos: [0.572, 1.677, -0.185],
        lp: 3,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'Cl',
        pos: [-1.102, -0.403, -1.341],
        lp: 3,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'Cl',
        pos: [-0.864, -0.165, 1.549],
        lp: 3,
        sn: 4,
        hyb: 'sp3'
      }
    ],
    bonds: [
      {
        a: 0,
        b: 1,
        order: 1.0
      },
      {
        a: 1,
        b: 2,
        order: 1.0
      },
      {
        a: 1,
        b: 3,
        order: 1.0
      },
      {
        a: 1,
        b: 4,
        order: 1.0
      }
    ]
  },
  {
    key: 'gc_chcl3',
    name: 'Chloroform',
    smiles: 'ClC(Cl)Cl',
    formula: 'CHCl3',
    mass: 119.38,
    geometry: 'Tetrahedral',
    polarity: 'Polar',
    teaches: [
      'GEN1.POLARITY'
    ],
    facts: [
      'Swap one chlorine of CCl4 for hydrogen and the cancellation is destroyed.',
      'Same shape, same bond types, and now a real molecular dipole. Symmetry, not bond polarity, was doing the work.'
    ],
    atoms: [
      {
        el: 'Cl',
        pos: [-0.892, -1.437, -0.405],
        lp: 3,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'C',
        pos: [0.001, 0.002, 0.116],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'Cl',
        pos: [-0.798, 1.474, -0.463],
        lp: 3,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'Cl',
        pos: [1.676, -0.063, -0.457],
        lp: 3,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'H',
        pos: [0.012, 0.024, 1.209],
        lp: 0,
        sn: 1
      }
    ],
    bonds: [
      {
        a: 0,
        b: 1,
        order: 1.0
      },
      {
        a: 1,
        b: 2,
        order: 1.0
      },
      {
        a: 1,
        b: 3,
        order: 1.0
      },
      {
        a: 1,
        b: 4,
        order: 1.0
      }
    ]
  },
  {
    key: 'gc_so2',
    name: 'Sulfur dioxide',
    smiles: 'O=S=O',
    formula: 'O2S',
    mass: 64.06,
    geometry: 'Bent',
    polarity: 'Polar',
    teaches: [
      'GEN1.VSEPR',
      'GEN1.RESONANCE'
    ],
    facts: [
      'Three domains on sulfur, one of them a lone pair: AX2E, bent, a little under 120 degrees.',
      'Bent like water but for a different reason: three domains rather than four.',
      'Contrast with CO2, which is also O-X-O and is linear. The lone pair is the difference.'
    ],
    atoms: [
      {
        el: 'O',
        pos: [-1.394, -0.245, 0.0],
        lp: 2,
        sn: 3,
        hyb: 'sp2'
      },
      {
        el: 'S',
        pos: [0.026, 0.609, 0.0],
        lp: 1,
        sn: 3,
        hyb: 'sp2'
      },
      {
        el: 'O',
        pos: [1.368, -0.365, 0.0],
        lp: 2,
        sn: 3,
        hyb: 'sp2'
      }
    ],
    bonds: [
      {
        a: 0,
        b: 1,
        order: 2.0
      },
      {
        a: 1,
        b: 2,
        order: 2.0
      }
    ]
  },
  {
    key: 'gc_nitrate',
    name: 'Nitrate ion',
    smiles: '[O-][N+](=O)[O-]',
    formula: 'NO3-',
    mass: 62.0,
    geometry: 'Trigonal planar - 120 deg',
    polarity: 'Anion, no net dipole',
    teaches: [
      'GEN1.RESONANCE',
      'GEN1.FORMALCHARGE'
    ],
    facts: [
      'Three equivalent resonance contributors. The real ion is the average of all three at once.',
      'All three N-O bonds are the same length, which no single contributor predicts. That equality is the evidence delocalisation is real.',
      'The molecule does NOT flip between structures. OCTET names that misconception GEN1M14, resonance as oscillation.',
      'Formal charges: nitrogen +1, and the negative charge spread evenly as one third on each oxygen.'
    ],
    atoms: [
      {
        el: 'O',
        pos: [-0.686, -1.035, 0.022],
        lp: 3,
        sn: 4,
        hyb: 'sp2',
        charge: -1
      },
      {
        el: 'N',
        pos: [-0.0, 0.0, -0.0],
        lp: 0,
        sn: 3,
        hyb: 'sp2',
        charge: 1
      },
      {
        el: 'O',
        pos: [-0.554, 1.112, -0.005],
        lp: 2,
        sn: 3,
        hyb: 'sp2'
      },
      {
        el: 'O',
        pos: [1.24, -0.077, -0.017],
        lp: 3,
        sn: 4,
        hyb: 'sp2',
        charge: -1
      }
    ],
    bonds: [
      {
        a: 0,
        b: 1,
        order: 1.0
      },
      {
        a: 1,
        b: 2,
        order: 2.0
      },
      {
        a: 1,
        b: 3,
        order: 1.0
      }
    ]
  },
  {
    key: 'gc_ethanol',
    name: 'Ethanol',
    smiles: 'CCO',
    formula: 'C2H6O',
    mass: 46.07,
    geometry: 'Bent at oxygen',
    polarity: 'Polar, hydrogen bonding',
    teaches: [
      'GEN1.IMF',
      'GEN1.IMFPROPERTIES'
    ],
    facts: [
      'An O-H bond means ethanol can both donate and accept a hydrogen bond.',
      'Boils at 78 C.',
      'Compare with dimethyl ether below: identical formula, and a 100 degree difference in boiling point.'
    ],
    atoms: [
      {
        el: 'C',
        pos: [-0.836, -0.314, -0.139],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'C',
        pos: [0.359, 0.583, 0.105],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'O',
        pos: [1.434, -0.176, 0.641],
        lp: 2,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'H',
        pos: [-1.679, 0.259, -0.537],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-0.585, -1.109, -0.849],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-1.147, -0.803, 0.789],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [0.692, 1.056, -0.824],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [0.107, 1.37, 0.822],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [1.657, -0.866, -0.007],
        lp: 0,
        sn: 1
      }
    ],
    bonds: [
      {
        a: 0,
        b: 1,
        order: 1.0
      },
      {
        a: 1,
        b: 2,
        order: 1.0
      },
      {
        a: 0,
        b: 3,
        order: 1.0
      },
      {
        a: 0,
        b: 4,
        order: 1.0
      },
      {
        a: 0,
        b: 5,
        order: 1.0
      },
      {
        a: 1,
        b: 6,
        order: 1.0
      },
      {
        a: 1,
        b: 7,
        order: 1.0
      },
      {
        a: 2,
        b: 8,
        order: 1.0
      }
    ]
  },
  {
    key: 'gc_dimethyl_ether',
    name: 'Dimethyl ether',
    smiles: 'COC',
    formula: 'C2H6O',
    mass: 46.07,
    geometry: 'Bent at oxygen',
    polarity: 'Polar, no O-H',
    teaches: [
      'GEN1.IMF',
      'GEN1.IMFPROPERTIES'
    ],
    facts: [
      'Same molecular formula as ethanol, C2H6O. A constitutional isomer.',
      'No O-H, so no hydrogen bond donor. Dipole-dipole and dispersion only.',
      'Boils at -24 C, about 100 degrees below ethanol. The difference is entirely intermolecular.',
      'Boiling breaks the forces BETWEEN molecules. It does not break C-O or C-H bonds, which is OCTET\'s misconception GEN1M13.'
    ],
    atoms: [
      {
        el: 'C',
        pos: [-1.117, 0.18, -0.32],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'O',
        pos: [0.182, -0.121, -0.812],
        lp: 2,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'C',
        pos: [1.135, -0.192, 0.24],
        lp: 0,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'H',
        pos: [-1.806, 0.222, -1.168],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-1.12, 1.153, 0.181],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [-1.457, -0.6, 0.368],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [1.204, 0.768, 0.76],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [0.868, -0.984, 0.946],
        lp: 0,
        sn: 1
      },
      {
        el: 'H',
        pos: [2.111, -0.425, -0.194],
        lp: 0,
        sn: 1
      }
    ],
    bonds: [
      {
        a: 0,
        b: 1,
        order: 1.0
      },
      {
        a: 1,
        b: 2,
        order: 1.0
      },
      {
        a: 0,
        b: 3,
        order: 1.0
      },
      {
        a: 0,
        b: 4,
        order: 1.0
      },
      {
        a: 0,
        b: 5,
        order: 1.0
      },
      {
        a: 2,
        b: 6,
        order: 1.0
      },
      {
        a: 2,
        b: 7,
        order: 1.0
      },
      {
        a: 2,
        b: 8,
        order: 1.0
      }
    ]
  },
  {
    key: 'gc_n2',
    name: 'Dinitrogen',
    smiles: 'N#N',
    formula: 'N2',
    mass: 28.01,
    geometry: 'Linear',
    polarity: 'Nonpolar',
    teaches: [
      'GEN1.MODIAGRAMS',
      'GEN1.BONDPROPERTIES'
    ],
    facts: [
      'A triple bond: bond order 3, the strongest bond in common chemistry.',
      'Identical atoms, so no electronegativity difference and no dipole at all.',
      'Diamagnetic, and that inertness is why the atmosphere is mostly nitrogen.'
    ],
    atoms: [
      {
        el: 'N',
        pos: [0.558, 0.0, 0.0],
        lp: 1,
        sn: 2,
        hyb: 'sp'
      },
      {
        el: 'N',
        pos: [-0.558, 0.0, 0.0],
        lp: 1,
        sn: 2,
        hyb: 'sp'
      }
    ],
    bonds: [
      {
        a: 0,
        b: 1,
        order: 3.0
      }
    ]
  },
  {
    key: 'gc_hcl',
    name: 'Hydrogen chloride',
    smiles: 'Cl',
    formula: 'HCl',
    mass: 36.46,
    geometry: 'Linear',
    polarity: 'Polar - 1.08 D',
    teaches: [
      'GEN1.COVALENTBOND',
      'GEN1.POLARITY'
    ],
    facts: [
      'One bond, so the molecular dipole is just the bond dipole. Nothing to cancel it.',
      'The electronegativity gap of about 0.96 makes this a clearly polar covalent bond, not an ionic one.',
      'In water it ionises completely, which is a different question from whether the gas-phase bond is ionic.'
    ],
    atoms: [
      {
        el: 'Cl',
        pos: [0.686, 0.0, 0.0],
        lp: 3,
        sn: 4,
        hyb: 'sp3'
      },
      {
        el: 'H',
        pos: [-0.686, 0.0, 0.0],
        lp: 0,
        sn: 1
      }
    ],
    bonds: [
      {
        a: 0,
        b: 1,
        order: 1.0
      }
    ]
  }
];

