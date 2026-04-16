/**
 * FE Mechanical Engineering — Flashcard Deck (stub, full content loading)
 */
export interface FMEFlashcard { id: number; front: string; back: string; domain: string; domainName: string; category: string; topics: string[]; }

export const FME_FLASHCARD_DOMAINS = [
  { id: 'topic0', label: 'T0', name: 'Mathematics', count: 0 },
  { id: 'topic1', label: 'T1', name: 'Probability & Statistics', count: 0 },
  { id: 'topic2', label: 'T2', name: 'Computational Tools', count: 0 },
  { id: 'topic3', label: 'T3', name: 'Ethics & Professional Practice', count: 0 },
  { id: 'topic4', label: 'T4', name: 'Engineering Economics', count: 0 },
  { id: 'topic5', label: 'T5', name: 'Statics', count: 0 },
  { id: 'topic6', label: 'T6', name: 'Dynamics & Vibrations', count: 0 },
  { id: 'topic7', label: 'T7', name: 'Mechanics of Materials', count: 0 },
  { id: 'topic8', label: 'T8', name: 'Material Science', count: 0 },
  { id: 'topic9', label: 'T9', name: 'Fluid Mechanics', count: 0 },
  { id: 'topic10', label: 'T10', name: 'Thermodynamics', count: 0 },
  { id: 'topic11', label: 'T11', name: 'Heat Transfer', count: 0 },
  { id: 'topic12', label: 'T12', name: 'Measurements & Controls', count: 0 },
  { id: 'topic13', label: 'T13', name: 'Mechanical Design', count: 0 },
  { id: 'topic14', label: 'T14', name: 'Manufacturing', count: 0 },
  { id: 'topic15', label: 'T15', name: 'Engineering Management', count: 0 },
] as const;

export const FME_FLASHCARD_CATEGORIES = ["concept", "definition", "formula", "comparison", "tip"] as const;
export let FME_FLASHCARD_COUNT = 0;
export const FME_FLASHCARDS: FMEFlashcard[] = [];

export function getFMEFlashcards(domain?: string): FMEFlashcard[] {
  if (!domain) return FME_FLASHCARDS;
  return FME_FLASHCARDS.filter(c => c.domain === domain);
}
