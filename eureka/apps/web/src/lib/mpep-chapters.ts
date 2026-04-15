/**
 * MPEP chapter list (9th ed.) + eMPEP URL helpers — Patent Bar practice browser.
 * Official eMPEP: https://mpep.uspto.gov/RDMS/MPEP/current
 */

export const MPEP_CHAPTER_LIST = [
  { num: '100', title: 'Secrecy, Access, National Security, and Foreign Filing' },
  { num: '200', title: 'Types and Status of Application; Naming of Inventor' },
  { num: '300', title: 'Ownership and Assignment' },
  { num: '400', title: 'Representative of Inventor or Owner' },
  { num: '500', title: 'Receipt and Handling of Mail and Papers' },
  { num: '600', title: 'Parts, Form, and Content of Application' },
  { num: '700', title: 'Examination of Applications' },
  { num: '800', title: 'Restriction in Applications Filed Under 35 U.S.C. 111; Double Patenting' },
  { num: '900', title: 'Prior Art, Classification, and Search' },
  { num: '1000', title: 'Matters Decided by Various U.S. Patent and Trademark Office Officials' },
  { num: '1100', title: 'Statutory Invention Registration (Rescinded) and Pre-Grant Publication' },
  { num: '1200', title: 'Appeal' },
  { num: '1300', title: 'Allowance and Issue' },
  { num: '1400', title: 'Correction of Patents' },
  { num: '1500', title: 'Design Patents' },
  { num: '1600', title: 'Plant Patents' },
  { num: '1700', title: 'Miscellaneous' },
  { num: '1800', title: 'Patent Cooperation Treaty' },
  { num: '1900', title: 'Protest' },
  { num: '2000', title: 'Duty of Disclosure, Candor, and Good Faith' },
  { num: '2100', title: 'Patentability' },
  { num: '2200', title: 'Citation of Prior Art and Ex Parte Reexamination' },
  { num: '2300', title: 'Inter Partes Reexamination' },
  { num: '2400', title: 'Biotechnology' },
  { num: '2500', title: 'Maintenance Fees' },
  { num: '2600', title: 'Optional Inter Partes Reexamination' },
  { num: '2700', title: 'Patent Terms and Extensions' },
  { num: '2800', title: 'Supplemental Examination' },
  { num: '2900', title: 'International Design Applications' },
] as const;

const EMPEP_BASE = 'https://mpep.uspto.gov/RDMS/MPEP/current';

/** Hash route used by USPTO eMPEP for a chapter HTML file (e.g. ch2100.html). */
export function eMpepChapterUrl(chapterNum: string): string {
  const digits = chapterNum.replace(/\D/g, '') || 'index';
  return `${EMPEP_BASE}#/current/ch${digits}.html`;
}

export function eMpepIndexUrl(): string {
  return `${EMPEP_BASE}#/current/index.html`;
}

/** Opens USPTO search in a new tab (full search matches the live exam search experience). */
export function eMpepSearchUrl(query: string): string {
  const q = encodeURIComponent(query.trim());
  return `${EMPEP_BASE}#/search?q=${q}`;
}
