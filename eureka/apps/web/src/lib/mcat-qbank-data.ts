/**
 * MCAT — Question Bank
 * 500 questions across 4 sections.
 * AI-generated. Requires SME review.
 * Stub file — agents generating full content.
 */

export interface MCATQuestion {
  id: string;
  topicId: number;
  subtopic: string;
  difficulty: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const TOPIC_ID_MAP: Record<number, string> = {
  0: 'mcat_chem_phys',
  1: 'mcat_cars',
  2: 'mcat_bio_biochem',
  3: 'mcat_psych_soc',
};

export function getMCATTopicSectionId(numericId: number): string {
  return TOPIC_ID_MAP[numericId] || 'mcat_chem_phys';
}

export const MCAT_QUESTIONS: MCATQuestion[] = [];
