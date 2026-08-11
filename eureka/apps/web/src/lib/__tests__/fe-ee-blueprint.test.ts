/**
 * FE Electrical and Computer against the NCEES published specification.
 *
 * Source: NCEES FE Electrical and Computer CBT Exam Specifications,
 * effective beginning with the July 2020 examinations. 17 knowledge areas,
 * 110 questions, 6-hour appointment (5 h 20 min of testing).
 *
 * The numbers below are transcribed from that document. They exist as a
 * test rather than a comment because the previous set was invented: four
 * areas sat below the published minimum (Mathematics carried 8 against a
 * real 11-17) and the section counts summed to 106 rather than 110. A
 * weight nobody checks is a weight that drifts.
 *
 * `fee_eng_sci` is deliberately ours and not NCEES's - Engineering Sciences
 * is a knowledge area in other FE disciplines but not in Electrical and
 * Computer. It is kept as background and must stay marked untested.
 */
import { describe, expect, it } from 'vitest';

import { EXAM_CONFIGS } from '@/lib/exam-config';
import { getStudyAxis } from '@/lib/exam-study-axis';

/** id -> [min, max] questions, exactly as NCEES prints them. */
const NCEES: Record<string, [number, number]> = {
  fee_math: [11, 17],
  fee_prob_stats: [4, 6],
  fee_ethics: [4, 6],
  fee_eng_econ: [5, 8],
  fee_materials: [4, 6],
  fee_circuits: [11, 17],
  fee_linear_sys: [5, 8],
  fee_signal_proc: [5, 8],
  fee_electronics: [7, 11],
  fee_power_sys: [8, 12],
  fee_electromagnetics: [4, 6],
  fee_control: [6, 9],
  fee_comms: [5, 8],
  fee_networks: [4, 6],
  fee_digital: [8, 12],
  fee_comp_sys: [5, 8],
  fee_software: [4, 6],
};

const cfg = EXAM_CONFIGS.FE_EE;

describe('FE EE blueprint', () => {
  it('states 110 questions', () => {
    expect(cfg.totalQuestions).toBe(110);
  });

  it('carries all 17 NCEES knowledge areas', () => {
    const tested = cfg.sections.filter((s) => s.tested !== false).map((s) => s.id);
    expect(tested.sort()).toEqual(Object.keys(NCEES).sort());
  });

  it('keeps Engineering Sciences as untested background', () => {
    const s = cfg.sections.find((x) => x.id === 'fee_eng_sci');
    expect(s, 'the background section was removed').toBeDefined();
    expect(s!.tested).toBe(false);
    // It must never claim exam questions.
    expect(s!.questionRange).toBeUndefined();
    expect(s!.questionCount).toBeUndefined();
  });

  for (const [id, range] of Object.entries(NCEES)) {
    it(`${id}: matches the published range ${range[0]}-${range[1]}`, () => {
      const s = cfg.sections.find((x) => x.id === id);
      expect(s, `${id} missing from the config`).toBeDefined();
      expect(s!.questionRange).toEqual(range);
      // The single-number midpoint used for arithmetic must sit inside it.
      expect(s!.questionCount).toBeGreaterThanOrEqual(range[0]);
      expect(s!.questionCount).toBeLessThanOrEqual(range[1]);
    });
  }

  it('has midpoints that bracket the 110-question total', () => {
    const sum = cfg.sections.reduce((n, s) => n + (s.questionCount ?? 0), 0);
    const lo = Object.values(NCEES).reduce((n, r) => n + r[0], 0);
    const hi = Object.values(NCEES).reduce((n, r) => n + r[1], 0);
    expect(lo).toBeLessThanOrEqual(110);
    expect(hi).toBeGreaterThanOrEqual(110);
    // Our midpoints should land near the real total rather than 4 short of
    // it, which is what the invented numbers did.
    expect(Math.abs(sum - 110)).toBeLessThanOrEqual(15);
  });
});

describe('FE EE rail', () => {
  const axis = getStudyAxis('FE_EE');

  it('uses the NCEES wording for each area', () => {
    const byId = new Map(axis.map((u) => [u.id, u.name]));
    expect(byId.get('fee_materials')).toBe('Properties of Electrical Materials');
    expect(byId.get('fee_circuits')).toBe('Circuit Analysis (DC & AC Steady State)');
    expect(byId.get('fee_software')).toBe('Software Engineering');
  });

  it('states a question range for every tested area', () => {
    for (const u of axis) {
      if (u.id === 'fee_eng_sci') continue;
      expect(u.examShare, `${u.id} states no weight`).toMatch(
        /^\d+-\d+ questions on the exam$/,
      );
    }
  });

  it('says background rather than a weight for the untested section', () => {
    const bg = axis.find((u) => u.id === 'fee_eng_sci');
    expect(bg?.examShare).toBe('Background - not a tested area on this exam');
  });

  it('never repeats a percentage in a section label', () => {
    for (const u of axis) expect(u.name).not.toMatch(/\d+%/);
  });
});
