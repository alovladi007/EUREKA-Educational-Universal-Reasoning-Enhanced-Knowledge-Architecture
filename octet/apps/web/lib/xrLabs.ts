// Deep links from an OCTET lesson to the EUREKA XR chemistry labs.
//
// The link between the two products ran one way until now. The labs name OCTET
// node codes on screen and link back to the lesson, and a learner reading the
// lesson for ORG1.CHAIR had no route to the ring inversion they could run in
// 3D. This is the return leg.
//
// Two rules hold this file honest.
//
// 1. Coverage is data, and it is short. Thirty six of the program's 312 nodes
//    have a lab mode built for them. Every other node returns null and
//    the lesson renders nothing, because a link that opens a lab with nothing
//    in it for the node the learner came from is worse than no link.
// 2. Every entry below was checked against the lab source in the EUREKA app
//    (apps/web/src/app/dashboard/xr-labs) rather than assumed. Where the two
//    disagreed the lab won: ORG1.ORBITALS has its own mode there rather than
//    living in Explore, and ORG1.NMRSPLITTING is absent because the Spectra
//    mode shows signal count, integration, IR bands and MS fragments and has
//    no multiplicity surface to send anyone to.
//
// THE URL CONTRACT. A link is the lab route plus one query parameter:
//
//   {EUREKA}/dashboard/xr-labs/molecules?node=ORG1.CHAIR
//   {EUREKA}/dashboard/xr-labs/general-chemistry?node=GEN2.BUFFER
//
// The mode is NOT in the URL. Each node resolves to exactly one mode, so the
// receiving side can map node to mode with the same table this file holds, and
// a link cannot ask for a mode that does not cover the node it names. That
// constraint is why at most one link is offered per node: see labLinkForLesson
// for the precedence rule the receiving side has to match.
//
// The labs consume the parameter. The receiving table lives at
// _chem/deepLink.ts in the EUREKA app and a test asserts the two agree in both
// directions: same 36 nodes, no node in one and not the other, no mode
// mismatches. Verified live on GEN2.CATALYSIS, which lands in Bench with the
// catalyst scenario already selected.
//
// This comment said the opposite until 2026-07-30, because the sending side
// shipped one commit ahead of the receiving side and the note was not revisited
// when the other half landed. If you change one table, run that test.

export type LabId = 'organic' | 'general';

export interface LabLink {
  href: string;
  lab: LabId;
  mode: string;
  blurb: string;
}

// EUREKA runs on 4040 in development. The fallback keeps a local checkout
// working with no configuration, and the variable is what makes any other
// deployment possible.
const RAW_EUREKA_URL =
  process.env.NEXT_PUBLIC_EUREKA_URL ?? 'http://localhost:4040';

// A trailing slash would build a double slash into every href. An empty value,
// which is what an unset variable in a Docker build looks like, would build a
// path relative to OCTET and 404 instead of reaching EUREKA.
export const EUREKA_BASE_URL =
  RAW_EUREKA_URL.trim().replace(/\/+$/, '') || 'http://localhost:4040';

const LAB_PATHS: Record<LabId, string> = {
  organic: '/dashboard/xr-labs/molecules',
  general: '/dashboard/xr-labs/general-chemistry',
};

// The names the labs give themselves on screen, so the link says where it goes
// in the words the learner reads when they arrive.
export const LAB_NAMES: Record<LabId, string> = {
  organic: 'Organic Chemistry 3D',
  general: 'General Chemistry 3D',
};

// Mode ids are the labs' own, and the labels are copied from their mode
// switchers, so the link text names the tab the learner lands on. Both labs
// have modes called orbitals and triangle that show different things, which is
// why this is keyed by lab first.
export const MODE_LABELS: Record<LabId, Record<string, string>> = {
  organic: {
    explore: 'Explore',
    orbitals: 'Sigma and pi',
    conformers: 'Conformations',
    chair: 'Chair flip',
    stereo: 'Stereochemistry',
    spectra: 'Spectra',
    triangle: 'Triangle',
  },
  general: {
    vsepr: 'VSEPR shapes',
    polarity: 'Polarity',
    lattice: 'Ionic lattice',
    orbitals: 'Orbitals',
    forces: 'Forces between',
    bench: 'Bench',
    triangle: 'Triangle',
  },
};

interface Coverage {
  lab: LabId;
  mode: string;
  // What the lab does for THIS node. Written per node rather than per mode,
  // because a mode that carries four nodes does something different for each
  // of them and one shared sentence would be true of none.
  blurb: string;
}

// The coverage table. One entry per node, flat and greppable, so it can be
// read against the labs' mode lists without reconstructing anything.
const COVERAGE: Record<string, Coverage> = {
  // Organic Chemistry 3D
  'ORG1.HYBRIDORG': {
    lab: 'organic',
    mode: 'explore',
    blurb:
      'Click an atom and the panel counts its electron domains, so the hybridisation comes from the count on the model rather than a lookup on the element.',
  },
  'ORG1.FUNCTIONALGROUPS': {
    lab: 'organic',
    mode: 'explore',
    blurb:
      'The organic library in 3D, one compound at a time, with the group that decides its chemistry sitting in real geometry.',
  },
  'ORG1.ORBITALS': {
    lab: 'organic',
    mode: 'orbitals',
    blurb:
      'Try to rotate a double bond and watch the pi overlap break, next to a single bond that turns freely.',
  },
  'ORG1.NEWMAN': {
    lab: 'organic',
    mode: 'conformers',
    blurb:
      'A Newman projection with the dihedral angle on a slider and the energy curve tracking it as you turn the bond.',
  },
  'ORG1.CHAIR': {
    lab: 'organic',
    mode: 'chair',
    blurb:
      'Run a ring inversion and watch every axial bond become equatorial. You commit to a prediction before the ring moves.',
  },
  'ORG1.AVALUES': {
    lab: 'organic',
    mode: 'chair',
    blurb:
      'Run the inversion on a substituted ring and read the equatorial preference beside it, with the A value that produced the number.',
  },
  'ORG1.CHIRALITY': {
    lab: 'organic',
    mode: 'stereo',
    blurb:
      'Build the mirror image and try to superimpose it, which is the test the definition actually asks for.',
  },
  'ORG1.RS': {
    lab: 'organic',
    mode: 'stereo',
    blurb:
      'The R and S forms of one compound side by side, so the pair can be turned rather than held in your head.',
  },
  'ORG1.ENANTIODIA': {
    lab: 'organic',
    mode: 'stereo',
    blurb:
      'Compare a meso compound with its mirror image and see two stereocentres land on the same compound.',
  },
  'ORG1.NMRTHEORY': {
    lab: 'organic',
    mode: 'spectra',
    blurb:
      'The structure and its 1H NMR side by side, with the number of signals derived from the symmetry of the molecule on screen.',
  },
  'ORG1.NMRINTEGRATION': {
    lab: 'organic',
    mode: 'spectra',
    blurb:
      'Signal bars whose heights are the derived proton ratio, next to the structure that ratio came from.',
  },
  'ORG1.IRREGIONS': {
    lab: 'organic',
    mode: 'spectra',
    blurb:
      'The IR bands cited for the compound on screen, listed against the correlation regions they fall in.',
  },
  'ORG1.IRINTERPRET': {
    lab: 'organic',
    mode: 'spectra',
    blurb:
      'Switch between the structure and its IR bands to work out which band belongs to which bond.',
  },
  'ORG1.MSBASICS': {
    lab: 'organic',
    mode: 'spectra',
    blurb:
      'The molecular ion for the compound on screen, with its mass taken from the formula.',
  },
  'ORG1.MSFRAGMENT': {
    lab: 'organic',
    mode: 'spectra',
    blurb:
      'Labelled fragments for the compound on screen, each one naming the piece that broke off.',
  },

  // General Chemistry 3D
  'GEN1.VSEPR': {
    lab: 'general',
    mode: 'vsepr',
    blurb:
      'The panel counts electron domains on the model and derives the shape from that count, so the answer visibly comes from the electrons and not the formula.',
  },
  'GEN1.LEWIS': {
    lab: 'general',
    mode: 'vsepr',
    blurb:
      'Lone pairs drawn as an overlay you can switch off, which is the part of the structure a shape has to account for and a drawing tends to lose.',
  },
  'GEN1.OCTETEXCEPTIONS': {
    lab: 'general',
    mode: 'vsepr',
    blurb:
      'BF3, PCl5 and SF6 are in the case list with their angles built exactly, so a centre that is not obeying the octet can be turned around.',
  },
  'GEN1.POLARITY': {
    lab: 'general',
    mode: 'polarity',
    blurb:
      'Bond dipoles drawn on the model with their sum, so four polar bonds cancelling to nothing can be watched instead of asserted.',
  },
  'GEN1.COVALENTBOND': {
    lab: 'general',
    mode: 'polarity',
    blurb:
      'Each atom reports its electronegativity, so the sharing across a bond is read off the two ends rather than named.',
  },
  'GEN1.IONICBOND': {
    lab: 'general',
    mode: 'lattice',
    blurb:
      'Ions packed in a lattice with no sticks drawn at all, because a bond line would put molecules back into a picture whose point is that there are none.',
  },
  'GEN1.NOMENIONIC': {
    lab: 'general',
    mode: 'lattice',
    blurb:
      'The formula beside the lattice it names, stating a ratio of ions rather than a count of atoms in a particle.',
  },
  'GEN1.SOLIDTYPES': {
    lab: 'general',
    mode: 'lattice',
    blurb:
      'Rock salt and caesium chloride packings built from cited ionic radii, so two ways of filling space can be compared directly.',
  },
  'GEN1.UNITCELLS': {
    lab: 'general',
    mode: 'lattice',
    blurb:
      'The cell repeated along each axis at its real lattice constant, which is what separates the cell from the pattern it repeats.',
  },
  'GEN1.QUANTUMMODEL': {
    lab: 'general',
    mode: 'orbitals',
    blurb:
      'A cloud of sampled points rather than a path, with nodes where the probability is actually zero.',
  },
  'GEN1.QUANTUMNUMBERS': {
    lab: 'general',
    mode: 'orbitals',
    blurb:
      'The s, p and d shapes selected by their quantum numbers, so the numbers pick the picture in front of you.',
  },
  'GEN1.IMF': {
    lab: 'general',
    mode: 'forces',
    blurb:
      'A water dimer with the hydrogen bond drawn apart from the covalent bonds, because they are two different things at two different strengths.',
  },
  'GEN1.IMFPROPERTIES': {
    lab: 'general',
    mode: 'forces',
    blurb:
      'What gives way when a liquid boils: the forces between molecules, with the bonds inside them left intact.',
  },
  'GEN2.RATELAW': {
    lab: 'general',
    mode: 'bench',
    blurb:
      'Doubling the concentration of a second order reactant, with the rate withheld until you commit to what it will do.',
  },
  'GEN2.CATALYSIS': {
    lab: 'general',
    mode: 'bench',
    blurb:
      'A catalyst lowering the barrier by 20 kJ/mol at constant temperature, with the factor withheld until you predict it.',
  },
  'GEN1.SIMPLEGASLAWS': {
    lab: 'general',
    mode: 'bench',
    blurb:
      'Halving the volume of a gas at constant temperature, with the gauge withheld until you say what the pressure does.',
  },
  'GEN1.KMT': {
    lab: 'general',
    mode: 'bench',
    blurb:
      'Helium and xenon at one temperature, compared on both average kinetic energy and molecular speed.',
  },
  'GEN2.TITRATIONSTRONG': {
    lab: 'general',
    mode: 'bench',
    blurb:
      'A burette over hydrochloric acid, with the curve locked until you record what you think the pH at equivalence will be.',
  },
  'GEN2.TITRATIONWEAK': {
    lab: 'general',
    mode: 'bench',
    blurb:
      'The acetic acid titration, with the curve locked until you record what you think happens at equivalence.',
  },
  'GEN2.BUFFER': {
    lab: 'general',
    mode: 'bench',
    blurb:
      'The buffer region of the acetic acid titration, entered by predicting what the pH does there before the curve is shown.',
  },
  'GEN2.LECHATELIER': {
    lab: 'general',
    mode: 'bench',
    blurb:
      'Stress an equilibrium mixture and watch which way it shifts, after committing to a direction first.',
  },
};

// Node codes are upper case in the curriculum and in the route. Normalising
// means a link built from a hand-typed address still resolves, and the code
// that reaches the lab is always the canonical one.
function normalize(node: string): string {
  return node.trim().toUpperCase();
}

function buildHref(lab: LabId, node: string): string {
  return `${EUREKA_BASE_URL}${LAB_PATHS[lab]}?node=${encodeURIComponent(node)}`;
}

// The lab mode built for this node, or null. Null is the common answer: most
// of the program has no lab, and the caller must render nothing in that case
// rather than an empty state.
export function labForNode(node: string): LabLink | null {
  const code = normalize(node);
  const entry = COVERAGE[code];
  if (!entry) {
    return null;
  }
  return {
    href: buildHref(entry.lab, code),
    lab: entry.lab,
    mode: entry.mode,
    blurb: entry.blurb,
  };
}

// Triangle coverage, which is the labs' other route in: both labs carry a
// Triangle mode listing every Johnstone view for their courses, so any node
// with a view is viewable there.
//
// The list of those nodes is deliberately NOT copied here. OCTET's API owns it
// and reports it per node on the lesson payload as has_triangle_view, so the
// caller passes that flag in and this function decides only which lab holds
// the view. A copied list would be a snapshot that goes stale the first time a
// view is authored, and it would claim coverage the API had not confirmed.
//
// The two sets were compared when this was written: the API's 44 views and the
// labs' exported copy name the same 44 nodes.
export function triangleLabForNode(
  node: string,
  hasTriangleView: boolean,
): LabLink | null {
  if (!hasTriangleView) {
    return null;
  }
  const code = normalize(node);
  const lab: LabId | null = code.startsWith('ORG')
    ? 'organic'
    : code.startsWith('GEN')
      ? 'general'
      : null;
  if (!lab) {
    return null;
  }
  return {
    href: buildHref(lab, code),
    lab,
    mode: 'triangle',
    blurb:
      "The same idea at Johnstone's three levels, with the 3D model on screen throughout because it is the particulate level the panel is discussing.",
  };
}

// What a lesson page should link to, or null.
//
// PRECEDENCE, which the receiving side has to match: a node with a mode built
// for it opens in that mode, and Triangle is used only for nodes with no mode
// of their own. Without a fixed rule two links for one node would carry the
// same ?node= and the lab could not tell which was meant.
export function labLinkForLesson(
  node: string,
  hasTriangleView: boolean,
): LabLink | null {
  return labForNode(node) ?? triangleLabForNode(node, hasTriangleView);
}

// The label of the mode a link opens, for use in link text.
export function modeLabel(link: LabLink): string {
  return MODE_LABELS[link.lab][link.mode] ?? link.mode;
}
