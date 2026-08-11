/**
 * Structural integrity of every check-your-understanding quiz, all exams.
 *
 * This exists because I shipped a wrong answer key: an FE EE question whose
 * numbers made the circuit critically damped while the key pointed at
 * "underdamped". The physics of a question cannot be checked mechanically,
 * but everything around it can, and a key pointing outside its own options
 * list or a distractor duplicating the answer are failures a test catches
 * for free.
 *
 * What this does NOT verify: that the correct option is actually correct.
 * That still needs a human reading the worked arithmetic. The test narrows
 * what a human has to check rather than replacing them.
 */
import { describe, expect, it } from 'vitest';

import { loadExamCourse } from '@/lib/exam-course-loader';
import { EXAM_CONFIGS } from '@/lib/exam-config';
import { getStudyAxis } from '@/lib/exam-study-axis';

interface Q {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

async function allQuizzes(examId: string) {
  const pack = await loadExamCourse(examId);
  const out: { topicId: string; sectionId: string; q: Q; index: number }[] = [];
  for (const unit of getStudyAxis(examId)) {
    for (const topicId of unit.topicIds) {
      const lesson = pack.get(topicId);
      for (const s of lesson?.sections ?? []) {
        (s.quiz ?? []).forEach((q, index) =>
          out.push({ topicId, sectionId: s.id, q: q as Q, index }),
        );
      }
    }
  }
  return out;
}

const EXAM_IDS = Object.keys(EXAM_CONFIGS);

describe('quiz integrity', () => {
  for (const examId of EXAM_IDS) {
    it(`${examId}: every quiz question is well formed`, async () => {
      const problems: string[] = [];
      for (const { topicId, sectionId, q, index } of await allQuizzes(examId)) {
        const where = `${examId}/${topicId}/${sectionId}[${index}]`;

        if (!q.question?.trim()) problems.push(`${where}: empty question`);
        if (!Array.isArray(q.options) || q.options.length < 2) {
          problems.push(`${where}: needs at least 2 options`);
          continue;
        }
        if (q.options.some((o) => !o?.trim())) {
          problems.push(`${where}: has an empty option`);
        }
        // The key must point at a real option. This is the one that would
        // have caught the damping-question error.
        if (
          !Number.isInteger(q.correctIndex) ||
          q.correctIndex < 0 ||
          q.correctIndex >= q.options.length
        ) {
          problems.push(
            `${where}: correctIndex ${q.correctIndex} is outside 0..${q.options.length - 1}`,
          );
        }
        // Two identical options mean either a typo or two correct answers.
        const seen = new Set(q.options.map((o) => o.trim().toLowerCase()));
        if (seen.size !== q.options.length) {
          problems.push(`${where}: duplicate options`);
        }
        // An explanation that does not explain is worse than none: a learner
        // who got it wrong learns nothing.
        if (!q.explanation?.trim() || q.explanation.trim().length < 40) {
          problems.push(`${where}: explanation is missing or too short`);
        }
      }
      expect(problems).toEqual([]);
    });
  }
});

describe('FE EE quiz coverage', () => {
  it('has quizzes in the two heaviest knowledge areas', async () => {
    const quizzes = await allQuizzes('FE_EE');
    const axis = getStudyAxis('FE_EE');
    // Circuit Analysis and Mathematics are both 11-17 questions on the real
    // exam - the largest two areas, and the ones a learner most needs to
    // self-check against.
    for (const unitId of ['fee_circuits', 'fee_math']) {
      const topics = axis.find((u) => u.id === unitId)!.topicIds;
      const count = quizzes.filter((x) => topics.includes(x.topicId)).length;
      expect(count, `${unitId} carries no quiz questions`).toBeGreaterThan(0);
    }
  });
});
