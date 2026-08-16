/**
 * Read-time estimates derived from the lesson itself.
 *
 * WHY THIS EXISTS. Every curriculum topic used to inherit `readTimeMin = 12`
 * from a default parameter in `exam-curriculum.ts`, so every chapter card in
 * the app claimed "12 min read" no matter how long the chapter actually was.
 * That was roughly harmless while chapters were uniformly short. It stopped
 * being harmless once the depth programmes ran: FE EE chapters now span 238
 * words (IP Subnetting) to 2,702 (Motors & Generators), and 29 of its 93
 * chapters were claiming 12 minutes for five minutes or less of reading.
 *
 * A stated number that is not true is the thing the project's no-invented-data
 * rule exists to prevent, so the estimate is now COMPUTED from the shipped
 * prose and cannot go stale as content grows.
 *
 * WPM. 200 words per minute is the conventional silent-reading rate for adult
 * non-fiction. Technical prose with equations reads slower, so treat the
 * result as a floor; it is deliberately not padded, because a number the
 * reader can check is worth more than a flattering one.
 */

import type { TopicLesson } from '@/lib/cissp-course-data';

const WORDS_PER_MINUTE = 200;

/** Words in a markdown blob, ignoring image URLs, table pipes and math delimiters. */
function countWords(markdown: string): number {
  const prose = markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // image markup: the alt text is a caption, not body prose
    .replace(/\$\$[\s\S]*?\$\$/g, ' ') // display math
    .replace(/\$[^$\n]*\$/g, ' '); // inline math
  return (prose.match(/[A-Za-z][A-Za-z'-]*/g) ?? []).length;
}

/**
 * Minutes to read a lesson, from its overview plus every section body.
 * Returns at least 1 so a short chapter never advertises "0 min".
 */
export function readMinutesForLesson(lesson: TopicLesson): number {
  let words = countWords(lesson.overview ?? '');
  for (const section of lesson.sections ?? []) words += countWords(section.content ?? '');
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/**
 * The number to show on a chapter card. Prefers the measured value; falls back
 * to the curriculum's declared estimate only while the lesson bundle is still
 * loading, or for a topic that has no authored lesson yet.
 */
export function displayReadMinutes(
  lesson: TopicLesson | null | undefined,
  declaredMin: number | undefined,
): number | undefined {
  if (lesson) return readMinutesForLesson(lesson);
  return declaredMin;
}
