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

// USPTO offers TWO portals for the MPEP:
//   1. The SPA reader: https://mpep.uspto.gov/RDMS/MPEP/current#/current/ch700.html
//      — this is the "official eMPEP" but it's a heavy JS app that frequently
//      hangs ("loading and never stops") for many users / network conditions.
//   2. The static HTML mirror: https://www.uspto.gov/web/offices/pac/mpep/mpep-0700.html
//      — same content, loads instantly, no SPA. This is what we link to for
//      chapter/index navigation. Search still uses the SPA (it's the only one
//      with full-text search), and we keep eMpepReaderUrl() as an escape hatch
//      for users who want the SPA reader.
const EMPEP_STATIC_BASE = 'https://www.uspto.gov/web/offices/pac/mpep';
const EMPEP_SPA_BASE = 'https://mpep.uspto.gov/RDMS/MPEP/current';

/** Static HTML mirror URL for a chapter (preferred — loads instantly). */
export function eMpepChapterUrl(chapterNum: string): string {
  const digits = chapterNum.replace(/\D/g, '');
  if (!digits) return eMpepIndexUrl();
  // USPTO static files are 4-digit zero-padded: mpep-0100.html, mpep-2100.html.
  const padded = digits.padStart(4, '0');
  return `${EMPEP_STATIC_BASE}/mpep-${padded}.html`;
}

/** Static MPEP table-of-contents page. */
export function eMpepIndexUrl(): string {
  return `${EMPEP_STATIC_BASE}/mpep.html`;
}

/** SPA reader URL — kept as escape hatch for users who prefer the official eMPEP. */
export function eMpepReaderUrl(chapterNum?: string): string {
  if (!chapterNum) return `${EMPEP_SPA_BASE}#/current/index.html`;
  const digits = chapterNum.replace(/\D/g, '') || 'index';
  return `${EMPEP_SPA_BASE}#/current/ch${digits}.html`;
}

/** Full-text search across the eMPEP SPA (search only exists on the SPA portal). */
export function eMpepSearchUrl(query: string): string {
  const q = encodeURIComponent(query.trim());
  return `${EMPEP_SPA_BASE}#/search?q=${q}`;
}
