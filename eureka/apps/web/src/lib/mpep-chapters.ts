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

// USPTO portals:
//   1. The SPA reader (PRIMARY): https://mpep.uspto.gov/RDMS/MPEP/current#/current/ch700.html
//      The official eMPEP. The actual Patent Bar exam uses this app, so
//      practicing with it is the most realistic preparation. Also the only
//      portal with deep section anchors (e.g. .../d0e34301.html for an
//      individual numbered section).
//   2. The static HTML mirror: https://www.uspto.gov/web/offices/pac/mpep/mpep-0700.html
//      Loads instantly, no JS. Kept as a fallback when the SPA is slow.
const EMPEP_STATIC_BASE = 'https://www.uspto.gov/web/offices/pac/mpep';
const EMPEP_SPA_BASE = 'https://mpep.uspto.gov/RDMS/MPEP/current';

/**
 * Official eMPEP SPA URL for a chapter. Matches what the live Patent Bar exam
 * uses, so candidates practice with the real interface.
 *   Input  '700'  -> .../#/current/ch700.html
 *   Input  '2100' -> .../#/current/ch2100.html
 *   Input  ''     -> index
 */
export function eMpepChapterUrl(chapterNum: string): string {
  const digits = chapterNum.replace(/\D/g, '');
  if (!digits) return eMpepIndexUrl();
  return `${EMPEP_SPA_BASE}#/current/ch${digits}.html`;
}

/**
 * Official eMPEP SPA URL for a deep section anchor.
 * The MPEP SPA assigns each numbered section a `d0e####` id (e.g. the
 * URL ../#/current/d0e34301.html jumps directly to one specific subsection).
 * Pass the bare id ("d0e34301") or the full ".html" form; both work.
 */
export function eMpepSectionUrl(anchor: string): string {
  const a = anchor.replace(/\.html$/i, '').trim();
  if (!a) return eMpepIndexUrl();
  return `${EMPEP_SPA_BASE}#/current/${a}.html`;
}

/** eMPEP SPA index. */
export function eMpepIndexUrl(): string {
  return `${EMPEP_SPA_BASE}#/current/index.html`;
}

/** Static HTML mirror URL — fast fallback when the SPA is slow or unavailable. */
export function eMpepStaticChapterUrl(chapterNum: string): string {
  const digits = chapterNum.replace(/\D/g, '');
  if (!digits) return `${EMPEP_STATIC_BASE}/mpep.html`;
  return `${EMPEP_STATIC_BASE}/mpep-${digits.padStart(4, '0')}.html`;
}

/** Full-text search on the eMPEP SPA (search exists only on the SPA portal). */
export function eMpepSearchUrl(query: string): string {
  const q = encodeURIComponent(query.trim());
  return `${EMPEP_SPA_BASE}#/search?q=${q}`;
}
