/**
 * FE Electrical & Computer Engineering — Course Content
 * 87 curriculum topics with detailed study content, key points, and formulas.
 * Every curriculum topic ID has real, substantial, CISSP-quality content.
 */

import type { QuizQuestion } from '@/components/test-prep/cissp/LessonQuiz';

export interface LessonSection {
  id: string;
  title: string;
  content: string;
  examTip?: string;
  importantNote?: string;
  quiz?: QuizQuestion[];
}

export interface TopicLesson {
  topicId: string;
  title: string;
  domainWeight: string;
  overview: string;
  sections: LessonSection[];
  keyTakeaways?: string[];
}

import { FE_EE_MATHEMATICS } from './fe-ee-sections/mathematics';
import { FE_EE_PROBABILITY_STATISTICS } from './fe-ee-sections/probability-statistics';
import { FE_EE_ETHICS_PROFESSIONAL_PRACTICE } from './fe-ee-sections/ethics-professional-practice';
import { FE_EE_ENGINEERING_ECONOMICS } from './fe-ee-sections/engineering-economics';
import { FE_EE_PROPERTIES_OF_ELECTRICAL_MATERIALS } from './fe-ee-sections/properties-of-electrical-materials';
import { FE_EE_ENGINEERING_SCIENCES } from './fe-ee-sections/engineering-sciences';
import { FE_EE_CIRCUIT_ANALYSIS } from './fe-ee-sections/circuit-analysis';
import { FE_EE_LINEAR_SYSTEMS } from './fe-ee-sections/linear-systems';
import { FE_EE_SIGNAL_PROCESSING } from './fe-ee-sections/signal-processing';
import { FE_EE_ELECTRONICS } from './fe-ee-sections/electronics';
import { FE_EE_POWER_SYSTEMS } from './fe-ee-sections/power-systems';
import { FE_EE_ELECTROMAGNETICS } from './fe-ee-sections/electromagnetics';
import { FE_EE_CONTROL_SYSTEMS } from './fe-ee-sections/control-systems';
import { FE_EE_COMMUNICATIONS } from './fe-ee-sections/communications';
import { FE_EE_COMPUTER_NETWORKS } from './fe-ee-sections/computer-networks';
import { FE_EE_DIGITAL_SYSTEMS } from './fe-ee-sections/digital-systems';
import { FE_EE_COMPUTER_SYSTEMS } from './fe-ee-sections/computer-systems';
import { FE_EE_SOFTWARE_DEVELOPMENT } from './fe-ee-sections/software-development';
import { FE_EE_EXAM_STRATEGY } from './fe-ee-sections/exam-strategy';

export const FE_EE_COURSE: Record<string, TopicLesson> = {

/* ══════════════════════════════════════════════════════════════════
 * TOPIC 0 — MATHEMATICS  (9 curriculum IDs)  ·  7–11 %
 * ══════════════════════════════════════════════════════════════════ */

  ...FE_EE_MATHEMATICS,
  ...FE_EE_PROBABILITY_STATISTICS,
  ...FE_EE_ETHICS_PROFESSIONAL_PRACTICE,
  ...FE_EE_ENGINEERING_ECONOMICS,
  ...FE_EE_PROPERTIES_OF_ELECTRICAL_MATERIALS,
  ...FE_EE_ENGINEERING_SCIENCES,
  ...FE_EE_CIRCUIT_ANALYSIS,
  ...FE_EE_LINEAR_SYSTEMS,
  ...FE_EE_SIGNAL_PROCESSING,
  ...FE_EE_ELECTRONICS,
  ...FE_EE_POWER_SYSTEMS,
  ...FE_EE_ELECTROMAGNETICS,
  ...FE_EE_CONTROL_SYSTEMS,
  ...FE_EE_COMMUNICATIONS,
  ...FE_EE_COMPUTER_NETWORKS,
  ...FE_EE_DIGITAL_SYSTEMS,
  ...FE_EE_COMPUTER_SYSTEMS,
  ...FE_EE_SOFTWARE_DEVELOPMENT,
  ...FE_EE_EXAM_STRATEGY,
};

export function hasFEEECourseContent(topicId: string): boolean {
  return topicId in FE_EE_COURSE;
}

export function getFEEECourseContent(topicId: string): TopicLesson | null {
  return FE_EE_COURSE[topicId] || null;
}
