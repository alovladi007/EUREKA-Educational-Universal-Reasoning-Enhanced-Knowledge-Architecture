/**
 * Patent Bar (USPTO Registration Exam) — Question Bank
 * 400 questions across 8 sections.
 * AI-generated. Requires SME review.
 * Stub — agent generating full content.
 */

export interface PatentBarQuestion {
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
  0: 'patentability',
  1: 'application_prep',
  2: 'filing_prosecution',
  3: 'office_responses',
  4: 'pct_international',
  5: 'post_issuance',
  6: 'design_plant',
  7: 'ethics_conduct',
};

export function getPatentBarTopicSectionId(numericId: number): string {
  return TOPIC_ID_MAP[numericId] || 'patentability';
}

export const PATENT_BAR_QUESTIONS: PatentBarQuestion[] = [];
