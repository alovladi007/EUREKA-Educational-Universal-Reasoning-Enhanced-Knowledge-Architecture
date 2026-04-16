/**
 * FE Mechanical Engineering — Course Content (stub, full content loading)
 */
import type { QuizQuestion } from '@/components/test-prep/cissp/LessonQuiz';

export interface LessonSection { id: string; title: string; content: string; examTip?: string; importantNote?: string; quiz?: QuizQuestion[]; }
export interface TopicLesson { topicId: string; title: string; domainWeight: string; overview: string; sections: LessonSection[]; keyTakeaways?: string[]; }

export const FME_COURSE: Record<string, TopicLesson> = {};

export function hasFMECourseContent(topicId: string): boolean { return topicId in FME_COURSE; }
export function getFMECourseContent(topicId: string): TopicLesson | null { return FME_COURSE[topicId] || null; }
