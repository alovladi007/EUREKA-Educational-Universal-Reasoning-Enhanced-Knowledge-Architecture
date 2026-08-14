/**
 * The MCAT's seven subjects - the axis students actually study on.
 *
 * The AAMC organises the exam into four SECTIONS (Chem/Phys, CARS,
 * Bio/Biochem, Psych/Soc) and `exam-curriculum.ts` follows that, because
 * that is how the test is administered. But nobody studies that way: you
 * study biochemistry, then physics, then sociology. Every serious prep
 * course is organised by subject, and the section only reappears on test
 * day.
 *
 * So this file is a second view over the SAME 45 topics - not new content,
 * not a copy. Every id below is a real topic id in `exam-curriculum.ts`
 * with real long-form content behind it in `mcat-course-data.ts`. If a
 * topic were listed here twice, or missed, `assertSubjectCoverage()` would
 * say so; it is called from the study page in development.
 *
 * CARS is kept separate from the seven and labelled as a skill rather than
 * a subject, because that is what it is: no content to learn, only a way
 * of reading. Calling it an eighth subject would imply a body of knowledge
 * that does not exist.
 */

import { getCurriculum } from '@/lib/exam-curriculum';

export interface McatSubject {
  id: string;
  name: string;
  /** One line on what this subject covers, in the student's terms. */
  blurb: string;
  /** Roughly how much of the exam this subject carries, per the AAMC
   *  content outline. Stated as the outline states it - a share of the
   *  exam, not a predicted score contribution. */
  examShare: string;
  /** Tailwind accent, used for the rail and section headers. */
  accent: string;
  /** Topic ids, in teaching order. Every one exists in exam-curriculum. */
  topicIds: string[];
  /** Which AAMC section(s) these topics are tested in. */
  sections: string[];
  kind: 'subject' | 'skill';
}

export const MCAT_SUBJECTS: McatSubject[] = [
  {
    id: 'biology',
    name: 'Biology',
    blurb: 'Cells, molecular biology, genetics, and the organ systems.',
    examShare: '~25% of the Bio/Biochem section',
    accent: 'emerald',
    kind: 'subject',
    sections: ['Biological & Biochemical Foundations'],
    topicIds: [
      'bb_cell_bio',
      'bb_molecular',
      'bb_organ_systems',
      'bb_neuron_action_potential',
      'bb_cardio_physiology',
      'bb_genetics',
      'bb_hardy_weinberg',
    ],
  },
  {
    id: 'biochemistry',
    name: 'Biochemistry',
    blurb: 'Amino acids and proteins, enzyme kinetics, and metabolism.',
    examShare: 'Heavily tested across Bio/Biochem and Chem/Phys',
    accent: 'teal',
    kind: 'subject',
    sections: [
      'Biological & Biochemical Foundations',
      'Chemical & Physical Foundations',
    ],
    topicIds: [
      'cpb1_water',
      'cpb1_amino_acids',
      'cpb1_protein_structure',
      'cpb1_protein_binding',
      'cpb1_enzymes',
      'cpb1_kinetics',
      'cpb1_enzyme_control',
      'cpb1_carbohydrates',
      'cpb1_lipids',
      'cpb1_membranes',
      'cpb1_nucleotides',
      'bb2_bioenergetics',
      'bb2_glycolysis',
      'bb2_glycogen_ppp',
      'bb2_tca',
      'bb2_oxphos',
      'bb2_lipid_metabolism',
      'bb2_nitrogen',
      'bb2_integration',
    ],
  },
  {
    id: 'general_chemistry',
    name: 'General Chemistry',
    blurb: 'Atomic structure, bonding, equilibrium, acids and bases, thermodynamics.',
    examShare: 'Core of the Chem/Phys section',
    accent: 'sky',
    kind: 'subject',
    sections: ['Chemical & Physical Foundations'],
    topicIds: [
      'cp_gen_chem',
      'cp_acid_base_titration',
      'cp_thermodynamics_deep',
    ],
  },
  {
    id: 'organic_chemistry',
    name: 'Organic Chemistry',
    blurb: 'Functional groups, reaction mechanisms, stereochemistry, spectroscopy.',
    examShare: 'Chem/Phys, with carbonyl and separations emphasis',
    accent: 'amber',
    kind: 'subject',
    sections: ['Chemical & Physical Foundations'],
    topicIds: ['cp_organic'],
  },
  {
    id: 'physics',
    name: 'Physics',
    blurb: 'Kinematics, forces, fluids, circuits, waves, and optics.',
    examShare: 'Chem/Phys, applied to living systems',
    accent: 'indigo',
    kind: 'subject',
    sections: ['Chemical & Physical Foundations'],
    topicIds: ['cp_physics', 'cp_kinematics_full', 'cp_electrostatics_circuits'],
  },
  {
    id: 'psychology',
    name: 'Psychology',
    blurb: 'Learning, memory, cognition, perception, identity, and research methods.',
    examShare: 'Majority of the Psych/Soc section',
    accent: 'violet',
    kind: 'subject',
    sections: ['Psychological, Social & Biological Foundations'],
    topicIds: [
      'ps_behavior',
      'ps_perception',
      'ps_social',
      'ps_social_psych_advanced',
      'ps_identity',
      'ps_research_methods',
    ],
  },
  {
    id: 'sociology',
    name: 'Sociology',
    blurb: 'Social structures, stratification, institutions, and health disparities.',
    examShare: 'Psych/Soc, roughly a third of its content',
    accent: 'rose',
    kind: 'subject',
    sections: ['Psychological, Social & Biological Foundations'],
    topicIds: ['ps_sociology', 'ps_health'],
  },
  {
    id: 'cars',
    name: 'CARS',
    blurb:
      'Not a subject - a reading skill. No outside knowledge is tested, so this is strategy and practice.',
    examShare: '~23% of the exam, its own scored section',
    accent: 'slate',
    kind: 'skill',
    sections: ['Critical Analysis & Reasoning (CARS)'],
    topicIds: [
      'cars_strategy',
      'cars_question_types',
      'cars_humanities',
      'cars_social',
    ],
  },
];

/** Flat topicId -> subject lookup. */
export const SUBJECT_BY_TOPIC: Record<string, McatSubject> = Object.fromEntries(
  MCAT_SUBJECTS.flatMap((s) => s.topicIds.map((t) => [t, s] as const)),
);

/**
 * Every MCAT topic must appear in exactly one subject. Returns the
 * problems rather than throwing, so the caller can decide whether to warn
 * or fail - a missing topic is a content bug, not a crash.
 */
export function assertSubjectCoverage(): {
  missing: string[];
  duplicated: string[];
  unknown: string[];
} {
  const curriculum = getCurriculum('MCAT');
  const real = new Set(
    curriculum.flatMap((section) => section.topics.map((t) => t.id)),
  );
  const seen = new Map<string, number>();
  for (const s of MCAT_SUBJECTS) {
    for (const id of s.topicIds) seen.set(id, (seen.get(id) ?? 0) + 1);
  }
  return {
    missing: [...real].filter((id) => !seen.has(id)),
    duplicated: [...seen].filter(([, n]) => n > 1).map(([id]) => id),
    unknown: [...seen.keys()].filter((id) => !real.has(id)),
  };
}
