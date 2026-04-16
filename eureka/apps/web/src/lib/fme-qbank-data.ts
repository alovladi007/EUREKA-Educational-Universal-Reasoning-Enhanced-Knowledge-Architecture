/**
 * FE Mechanical Engineering — Question Bank (stub, full content loading)
 */
export interface FMEQuestion { id: string; topicId: number; subtopic: string; difficulty: number; question: string; options: string[]; correct: number; explanation: string; }

export const FME_QUESTIONS: FMEQuestion[] = [];
export const FME_QUESTION_COUNT = 0;

export function getFMEQuestions(topicId?: number, difficulty?: number): FMEQuestion[] {
  let filtered = FME_QUESTIONS;
  if (topicId !== undefined) filtered = filtered.filter(q => q.topicId === topicId);
  if (difficulty !== undefined) filtered = filtered.filter(q => q.difficulty === difficulty);
  return filtered;
}
