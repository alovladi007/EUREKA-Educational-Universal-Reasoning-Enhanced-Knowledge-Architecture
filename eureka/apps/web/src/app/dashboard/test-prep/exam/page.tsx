'use client';


import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ClockIcon,
  FlagIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  PauseIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { EXAM_TYPE_LIST, getExamConfig } from '@/lib/exam-config';
import { useActiveExam } from '@/hooks/use-active-exam';
import { ExamSelector } from '@/components/test-prep/ExamSelector';

interface ExamConfig {
  examType: string;
  duration: number;
  questionCount: number;
  sections: string[];
}

interface Question {
  id: number;
  question_text: string;
  subject: string;
  topic: string;
  options?: Array<{ value: string; text: string }>;
  correct_answer?: string;
}

interface ExamResults {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number;
  timeTaken: number;
  flaggedQuestions: number;
}

interface ExamType {
  id: string;
  name: string;
  duration: number;
  questions: number;
}

function ExamSimulatorPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Active-exam wins over the raw search param (it already merges URL + localStorage).
  const { examType: activeExam, setActiveExam } = useActiveExam();
  const initialExam = activeExam || searchParams.get('exam') || '';

  const [examConfig, setExamConfig] = useState<ExamConfig>(() => {
    if (initialExam) {
      const cfg = getExamConfig(initialExam);
      return {
        examType: cfg.id,
        duration: cfg.totalDuration,
        questionCount: cfg.totalQuestions,
        sections: cfg.sections.map(s => s.id),
      };
    }
    return { examType: '', duration: 180, questionCount: 50, sections: [] };
  });

  // Resync when the active exam changes (e.g. user picks one in the layout pill).
  useEffect(() => {
    if (!activeExam) return;
    setExamConfig((prev) => {
      if (prev.examType === activeExam) return prev;
      const cfg = getExamConfig(activeExam);
      return {
        examType: cfg.id,
        duration: cfg.totalDuration,
        questionCount: cfg.totalQuestions,
        sections: cfg.sections.map((s) => s.id),
      };
    });
  }, [activeExam]);
  const [examStarted, setExamStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const [results, setResults] = useState<ExamResults | null>(null);

  const examTypes: ExamType[] = EXAM_TYPE_LIST.map(cfg => ({
    id: cfg.id,
    name: cfg.name,
    duration: cfg.totalDuration,
    questions: cfg.totalQuestions,
  }));

  // Timer countdown effect
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (examStarted && !isPaused && timeRemaining > 0 && !examCompleted) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            submitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [examStarted, isPaused, timeRemaining, examCompleted]);

  const startExam = async () => {
    if (!examConfig.examType) {
      toast.error('Please select an exam type');
      return;
    }

    try {
      // Load questions for the exam
      const response = await apiClient.getTestPrepQuestions({
        exam_type: examConfig.examType,
        per_page: examConfig.questionCount
      });
      setQuestions(response.questions || []);
      setTimeRemaining(examConfig.duration * 60);
      setExamStarted(true);
      setCurrentQuestion(0);
      toast.success('Exam started! Good luck!');
    } catch (error) {
      console.error('Failed to load exam questions:', error);
      toast.error('Failed to load exam questions');
    }
  };

  const submitExam = async () => {
    setExamCompleted(true);
    setIsPaused(false);

    // Calculate results
    let correct = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correct_answer) {
        correct++;
      }
    });

    const score = Math.round((correct / questions.length) * 100);

    const examResults: ExamResults = {
      totalQuestions: questions.length,
      correctAnswers: correct,
      incorrectAnswers: questions.length - correct,
      score: score,
      timeTaken: (examConfig.duration * 60) - timeRemaining,
      flaggedQuestions: flaggedQuestions.size
    };

    setResults(examResults);

    // Save exam result to backend
    try {
      // submitExam expects an array of answer rows; `answers` here is a
      // Record<questionIdx, optionIdx>. Flatten it before sending.
      await apiClient.submitExam('temp-exam-id', Object.entries(answers).map(
        ([question_idx, option_idx]) => ({ question_idx: Number(question_idx), option_idx }),
      ));
    } catch (error) {
      console.error('Failed to save exam results:', error);
    }

    toast.success('Exam submitted successfully!');
  };

  const selectAnswer = (questionIndex: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const toggleFlag = (questionIndex: number) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionIndex)) {
        newSet.delete(questionIndex);
      } else {
        newSet.add(questionIndex);
      }
      return newSet;
    });
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getQuestionStatus = (index: number): 'answered' | 'flagged' | 'unanswered' => {
    if (answers[index]) return 'answered';
    if (flaggedQuestions.has(index)) return 'flagged';
    return 'unanswered';
  };

  // Results Screen
  if (examCompleted && results) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <Toaster position="top-right" />
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-8">
              <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Exam Completed!</h2>
              <p className="text-gray-600">Here are your results</p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6">
                <p className="text-blue-600 text-sm font-medium mb-1">Score</p>
                <p className="text-3xl font-bold text-blue-900">{results.score}%</p>
              </div>
              <div className="bg-green-50 rounded-lg p-6">
                <p className="text-green-600 text-sm font-medium mb-1">Correct Answers</p>
                <p className="text-3xl font-bold text-green-900">{results.correctAnswers}/{results.totalQuestions}</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-6">
                <p className="text-yellow-600 text-sm font-medium mb-1">Time Taken</p>
                <p className="text-3xl font-bold text-yellow-900">{formatTime(results.timeTaken)}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-6">
                <p className="text-purple-600 text-sm font-medium mb-1">Flagged Questions</p>
                <p className="text-3xl font-bold text-purple-900">{results.flaggedQuestions}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => router.push('/dashboard/test-prep/analytics')}
                className="flex-1 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
              >
                View Detailed Analytics
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition-colors"
              >
                Take Another Test
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Configuration Screen
  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <Toaster position="top-right" />
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <ExamSelector variant="card" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Configure Your Exam</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Exam Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {examTypes.map(exam => (
                    <button
                      key={exam.id}
                      onClick={() => {
                        const cfg = getExamConfig(exam.id);
                        setExamConfig({
                          examType: exam.id,
                          duration: exam.duration,
                          questionCount: exam.questions,
                          sections: cfg.sections.map(s => s.id),
                        });
                        setActiveExam(exam.id);
                      }}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        examConfig.examType === exam.id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-semibold text-gray-900">{exam.name}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {exam.questions} questions · {exam.duration} minutes
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {examConfig.examType && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-blue-50 rounded-lg p-6"
                >
                  <h3 className="font-semibold text-blue-900 mb-4">Exam Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Total Questions:</span>
                      <span className="font-medium text-blue-900">{examConfig.questionCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Time Limit:</span>
                      <span className="font-medium text-blue-900">{examConfig.duration} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Score Range:</span>
                      <span className="font-medium text-blue-900">{getExamConfig(examConfig.examType).scoreRange.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Question Navigation:</span>
                      <span className="font-medium text-blue-900">Allowed</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-blue-200">
                    <p className="text-xs font-medium text-blue-800 mb-2">Sections:</p>
                    <div className="space-y-1">
                      {getExamConfig(examConfig.examType).sections.map((s) => (
                        <div key={s.id} className="flex justify-between text-xs">
                          <span className="text-blue-700">{s.name}</span>
                          <span className="text-blue-900 font-medium">
                            {s.questionCount ? `${s.questionCount} Q` : ''}
                            {s.timeMinutes ? ` · ${s.timeMinutes} min` : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              <button
                onClick={startExam}
                disabled={!examConfig.examType}
                className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
              >
                Start Exam
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Main Exam Interface
  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Exam Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold text-gray-900">{examConfig.examType} Exam</h3>
            <span className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              title={isPaused ? 'Resume' : 'Pause'}
            >
              {isPaused ? <PlayIcon className="h-5 w-5" /> : <PauseIcon className="h-5 w-5" />}
            </button>

            <div className="flex items-center text-lg font-mono">
              <ClockIcon className="h-5 w-5 mr-2 text-gray-600" />
              <span className={timeRemaining < 300 ? 'text-red-600 font-bold' : 'text-gray-900'}>
                {formatTime(timeRemaining)}
              </span>
            </div>

            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to submit the exam?')) {
                  submitExam();
                }
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Submit Exam
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-4 gap-6">
        {/* Question Panel */}
        <div className="col-span-3">
          {currentQ && (
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {currentQ.subject} - {currentQ.topic}
                </span>
                <button
                  onClick={() => toggleFlag(currentQuestion)}
                  className={`p-2 rounded-lg transition-colors ${
                    flaggedQuestions.has(currentQuestion)
                      ? 'text-orange-600 bg-orange-50'
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                  }`}
                  title={flaggedQuestions.has(currentQuestion) ? 'Unflag question' : 'Flag for review'}
                >
                  <FlagIcon className="h-5 w-5" />
                </button>
              </div>

              <p className="text-lg text-gray-900 mb-6 leading-relaxed">{currentQ.question_text}</p>

              <div className="space-y-3">
                {currentQ.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => selectAnswer(currentQuestion, option.value)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      answers[currentQuestion] === option.value
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-medium mr-3">{option.value}.</span>
                    {option.text}
                  </button>
                ))}
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                  className="flex items-center px-4 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeftIcon className="h-5 w-5 mr-2" />
                  Previous
                </button>
                <button
                  onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
                  disabled={currentQuestion === questions.length - 1}
                  className="flex items-center px-4 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ArrowRightIcon className="h-5 w-5 ml-2" />
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Question Navigator */}
        <div className="col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
            <h4 className="font-semibold text-gray-900 mb-4">Question Navigator</h4>

            <div className="grid grid-cols-5 gap-2 mb-6">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`
                    aspect-square rounded text-sm font-medium transition-all
                    ${currentQuestion === index ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}
                    ${getQuestionStatus(index) === 'answered' ? 'bg-green-500 text-white hover:bg-green-600' : ''}
                    ${getQuestionStatus(index) === 'flagged' ? 'bg-orange-500 text-white hover:bg-orange-600' : ''}
                    ${getQuestionStatus(index) === 'unanswered' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : ''}
                  `}
                  title={`Question ${index + 1} - ${getQuestionStatus(index)}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                <span className="text-gray-700">Answered ({Object.keys(answers).length})</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-orange-500 rounded mr-2"></div>
                <span className="text-gray-700">Flagged ({flaggedQuestions.size})</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded mr-2"></div>
                <span className="text-gray-700">Unanswered ({questions.length - Object.keys(answers).length})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// Wrap the page that calls useSearchParams() in a Suspense boundary
// so Next 14 static export doesn't bail out. (Session 3.6, 2026-05.)
import { Suspense } from 'react';
export default function ExamSimulatorPage() {
  return (
    <Suspense fallback={null}>
      <ExamSimulatorPageInner />
    </Suspense>
  );
}
