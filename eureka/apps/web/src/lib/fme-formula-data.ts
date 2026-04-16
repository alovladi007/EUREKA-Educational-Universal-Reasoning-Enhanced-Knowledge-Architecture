/**
 * FE Mechanical Engineering — Formula Sheets (stub, full content loading)
 */
export interface FormulaEntry { name: string; formula: string; notes: string; }
export interface FormulaSheet { topicId: number; title: string; formulas: FormulaEntry[]; }

export const FME_FORMULA_SHEETS: FormulaSheet[] = [];
export const FME_FORMULA_COUNT = 0;

export function getFMEFormulas(topicId?: number): FormulaSheet[] {
  if (topicId === undefined) return FME_FORMULA_SHEETS;
  return FME_FORMULA_SHEETS.filter(s => s.topicId === topicId);
}
