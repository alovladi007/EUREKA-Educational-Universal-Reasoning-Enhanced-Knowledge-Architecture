import { describe, it, expect } from 'vitest';
import { readMinutesForLesson, displayReadMinutes } from '../read-time';
import { FE_EE_COURSE } from '../fe-ee-course-data';
import type { TopicLesson } from '../cissp-course-data';

const lesson = (overview: string, ...bodies: string[]): TopicLesson => ({
  topicId: 't', title: 'T', domainWeight: 'D', overview,
  sections: bodies.map((content, i) => ({ id: `s${i}`, title: `S${i}`, content })),
});

describe('read-time estimates are derived from the lesson, not declared', () => {
  it('scales with actual word count at 200 wpm', () => {
    expect(readMinutesForLesson(lesson('', 'word '.repeat(200)))).toBe(1);
    expect(readMinutesForLesson(lesson('', 'word '.repeat(2000)))).toBe(10);
  });

  it('never advertises 0 min for a short chapter', () => {
    expect(readMinutesForLesson(lesson('', 'three words only'))).toBe(1);
  });

  it('counts the overview as well as every section body', () => {
    const split = readMinutesForLesson(lesson('word '.repeat(600), 'word '.repeat(600)));
    expect(split).toBe(6);
  });

  it('excludes image markup and math from the prose count', () => {
    const withFigure = lesson('', `![a very long alt text describing the figure in detail](/x.svg)
$$E = mc^2 + \\sum_{i=1}^{n} x_i$$
${'word '.repeat(400)}`);
    expect(readMinutesForLesson(withFigure)).toBe(2);
  });

  it('falls back to the declared estimate only when no lesson is loaded', () => {
    expect(displayReadMinutes(null, 12)).toBe(12);
    expect(displayReadMinutes(undefined, undefined)).toBeUndefined();
    expect(displayReadMinutes(lesson('', 'word '.repeat(1000)), 12)).toBe(5);
  });

  it('reports a spread across the real course, not one constant for every chapter', () => {
    // The defect this replaces: `readTimeMin = 12` was a default parameter, so
    // all 93 FE EE chapters advertised the same 12 minutes. The invariant worth
    // pinning is not any particular pair of chapters — an earlier version of
    // this test compared the then-shortest and then-longest and went stale the
    // moment the short one was expanded. What must hold is that the estimate
    // TRACKS CONTENT: distinct chapters of distinct lengths report distinct
    // times, and each chapter's number follows from its own word count.
    const lessons = Object.values(FE_EE_COURSE);
    expect(lessons.length).toBeGreaterThan(50);

    const minutes = lessons.map(readMinutesForLesson);
    expect(new Set(minutes).size).toBeGreaterThan(3);
    expect(Math.max(...minutes)).toBeGreaterThan(Math.min(...minutes));

    // No single value may cover the whole course — that is the old bug's shape.
    const commonest = Math.max(
      ...[...new Set(minutes)].map((m) => minutes.filter((x) => x === m).length),
    );
    expect(commonest).toBeLessThan(minutes.length);

    // Every chapter reports a sane positive figure.
    for (const m of minutes) expect(m).toBeGreaterThan(0);
  });
});
