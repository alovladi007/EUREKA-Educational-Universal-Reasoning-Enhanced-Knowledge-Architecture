// Groups the flat skill-graph into pedagogically-ordered subject sections for
// the Learn page. The cleanest grouping signal is the node CODE prefix (the
// tier/track fields are too coarse — all of calculus, discrete, probability,
// etc. share tier 2). Each group lists its whole-course "overview" nodes
// (rendered first as course cards) and a `test` that claims its member codes.

import type { GraphNode } from '@/lib/api';

export interface CurriculumGroup {
  key: string;
  label: string;
  blurb: string;
  overviews: string[];
  test: (code: string) => boolean;
}

// Order here is the order sections appear on the page (a rough learning path).
export const CURRICULUM_GROUPS: CurriculumGroup[] = [
  {
    key: 'foundations',
    label: 'Foundations & Pre-Calculus',
    blurb: 'Arithmetic, elementary algebra, geometry, trigonometry, and precalculus.',
    overviews: ['PREALG', 'ALG1', 'ALG2', 'GEO', 'TRIG', 'PRECALC'],
    test: (c) => /^(PREALG|ALG1|ALG2|GEO|TRIG|PRECALC)$/.test(c) || /^ALG\./.test(c),
  },
  {
    key: 'proof',
    label: 'Proof & Logic',
    blurb: 'The craft of mathematical reasoning and the standard proof techniques.',
    overviews: ['INTROPROOF'],
    test: (c) => c === 'INTROPROOF' || /^PT\./.test(c),
  },
  {
    key: 'calc1',
    label: 'Calculus I — Limits & Derivatives',
    blurb: 'Limits, continuity, differentiation, and the fundamental theorem of calculus.',
    overviews: ['CALC1'],
    test: (c) => c === 'CALC1' || /^C1\d\d$/.test(c),
  },
  {
    key: 'calc2',
    label: 'Calculus II — Integration & Series',
    blurb: 'Integration techniques, applications, sequences, series, and Taylor series.',
    overviews: ['CALC2'],
    test: (c) => c === 'CALC2' || /^C2\d\d$/.test(c),
  },
  {
    key: 'calc3',
    label: 'Calculus III — Multivariable & Vector',
    blurb: 'Vectors, partial derivatives, multiple integrals, and vector calculus.',
    overviews: ['CALC3'],
    test: (c) => c === 'CALC3' || /^C3\d\d$/.test(c),
  },
  {
    key: 'linalg',
    label: 'Linear Algebra',
    blurb: 'Vectors, matrices, linear systems, subspaces, eigenvalues, and decompositions.',
    overviews: ['LINALG'],
    test: (c) => c === 'LINALG' || /^LA\./.test(c),
  },
  {
    key: 'discrete',
    label: 'Discrete Mathematics',
    blurb: 'Logic, proof, counting, recurrences, modular arithmetic, graphs, and Big-O.',
    overviews: ['DISC'],
    test: (c) => c === 'DISC' || /^DM\d\d$/.test(c),
  },
  {
    key: 'probstat',
    label: 'Probability & Statistics',
    blurb: 'Probability models, random variables, distributions, and statistical inference.',
    overviews: ['PROB'],
    test: (c) => c === 'PROB' || /^PS\d\d$/.test(c),
  },
  {
    key: 'ode',
    label: 'Differential Equations',
    blurb: 'First- and higher-order ODEs, systems, Laplace transforms, and phase planes.',
    overviews: ['ODE'],
    test: (c) => c === 'ODE' || /^ODE\./.test(c),
  },
  {
    key: 'fourierpde',
    label: 'Fourier Analysis & PDEs',
    blurb: 'Fourier series and transforms, and the heat, wave, and Laplace equations.',
    overviews: ['PDEM', 'PDET'],
    test: (c) => /^(PDEM|PDET)$/.test(c) || /^PF\./.test(c),
  },
  {
    key: 'advanced',
    label: 'Advanced & Graduate Topics',
    blurb: 'Analysis, abstract algebra, topology, geometry, and numerical methods.',
    overviews: [
      'REALAN',
      'ABSALG',
      'TOPO',
      'COMPLEXAN',
      'DIFFGEO',
      'FUNCAN',
      'MEASURE',
      'NUMTHEORY',
      'NUMERICS',
      'CALCVAR',
    ],
    test: (c) =>
      /^(REALAN|ABSALG|TOPO|COMPLEXAN|DIFFGEO|FUNCAN|MEASURE|NUMTHEORY|NUMERICS|CALCVAR)$/.test(c),
  },
];

export interface GroupedSection {
  group: CurriculumGroup;
  overviews: GraphNode[]; // whole-course nodes, in the group's listed order
  skills: GraphNode[]; // atomic skill nodes, natural-sorted by code
}

// Assign every node to the first group whose test matches; anything unmatched
// falls into a trailing "Other topics" catch-all so nothing is ever hidden.
export function groupCurriculum(nodes: GraphNode[]): GroupedSection[] {
  const buckets = new Map<string, GraphNode[]>();
  const other: GraphNode[] = [];

  for (const node of nodes) {
    const group = CURRICULUM_GROUPS.find((g) => g.test(node.code));
    if (!group) {
      other.push(node);
      continue;
    }
    const list = buckets.get(group.key) ?? [];
    list.push(node);
    buckets.set(group.key, list);
  }

  const naturalByCode = (a: GraphNode, b: GraphNode) =>
    a.code.localeCompare(b.code, undefined, { numeric: true, sensitivity: 'base' });

  const sections: GroupedSection[] = [];
  for (const group of CURRICULUM_GROUPS) {
    const members = buckets.get(group.key);
    if (!members || members.length === 0) {
      continue;
    }
    const overviewSet = new Set(group.overviews);
    const overviews = group.overviews
      .map((code) => members.find((n) => n.code === code))
      .filter((n): n is GraphNode => Boolean(n));
    const skills = members.filter((n) => !overviewSet.has(n.code)).sort(naturalByCode);
    sections.push({ group, overviews, skills });
  }

  if (other.length > 0) {
    sections.push({
      group: {
        key: 'other',
        label: 'Other topics',
        blurb: 'Skills not yet assigned to a subject group.',
        overviews: [],
        test: () => false,
      },
      overviews: [],
      skills: other.slice().sort(naturalByCode),
    });
  }

  return sections;
}
