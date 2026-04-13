'use client';

import React, { useState } from 'react';
import {
  CheckCircle2, XCircle, ChevronDown, ChevronRight,
  Brain, Trophy, RotateCcw, Sparkles, Zap
} from 'lucide-react';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface LessonQuizProps {
  questions: QuizQuestion[];
  title?: string;
}

export function LessonQuiz({ questions, title = 'Practice Questions' }: LessonQuizProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [expanded, setExpanded] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);

  const handleSelect = (qIdx: number, optIdx: number) => {
    if (revealed[qIdx]) return;
    setAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleReveal = (qIdx: number) => {
    setRevealed(prev => ({ ...prev, [qIdx]: true }));
  };

  const handleReset = () => {
    setAnswers({});
    setRevealed({});
    setCurrentQ(0);
  };

  const answeredCount = Object.keys(revealed).length;
  const correctCount = Object.entries(revealed).filter(
    ([qIdx]) => answers[Number(qIdx)] === questions[Number(qIdx)]?.correctIndex
  ).length;
  const progress = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

  return (
    <div className="my-8 rounded-2xl overflow-hidden shadow-lg border-2 border-indigo-200 dark:border-indigo-800 bg-gradient-to-br from-indigo-50/80 to-purple-50/80 dark:from-indigo-950/50 dark:to-purple-950/50">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 hover:bg-indigo-100/50 dark:hover:bg-indigo-900/30 transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div className="text-left">
            <span className="text-base font-bold text-indigo-900 dark:text-indigo-100 block">{title}</span>
            <span className="text-xs text-indigo-600 dark:text-indigo-300">
              {questions.length} questions
              {answeredCount > 0 && ` \u00B7 ${correctCount}/${answeredCount} correct`}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {answeredCount > 0 && (
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-24 h-2 bg-indigo-200 dark:bg-indigo-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs font-medium text-indigo-600 dark:text-indigo-300">{progress}%</span>
            </div>
          )}
          <div className={`h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
            <ChevronDown className="h-4 w-4 text-indigo-600" />
          </div>
        </div>
      </button>

      {/* Quiz Body */}
      {expanded && (
        <div className="px-5 pb-5">
          {/* Progress bar */}
          <div className="flex items-center gap-2 mb-5">
            <div className="flex-1 h-1.5 bg-indigo-200/50 dark:bg-indigo-800/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            {answeredCount > 0 && (
              <button onClick={handleReset} className="text-xs text-indigo-500 hover:text-indigo-700 flex items-center gap-1 transition-colors">
                <RotateCcw className="h-3 w-3" /> Reset
              </button>
            )}
          </div>

          {/* Questions */}
          <div className="space-y-5">
            {questions.map((q, qIdx) => {
              const selected = answers[qIdx];
              const isRevealed = revealed[qIdx];
              const isCorrect = selected === q.correctIndex;

              return (
                <div
                  key={qIdx}
                  className={`rounded-xl border-2 transition-all duration-300 ${
                    isRevealed
                      ? isCorrect
                        ? 'border-green-300 dark:border-green-700 bg-green-50/50 dark:bg-green-950/30'
                        : 'border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/30'
                      : 'border-white/60 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80'
                  } shadow-sm hover:shadow-md`}
                >
                  <div className="p-4 sm:p-5">
                    {/* Question header */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shadow-sm transition-all duration-300 ${
                        isRevealed
                          ? isCorrect
                            ? 'bg-green-500 text-white'
                            : 'bg-amber-500 text-white'
                          : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                      }`}>
                        {isRevealed ? (isCorrect ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />) : qIdx + 1}
                      </div>
                      <p className="text-sm font-medium leading-relaxed pt-1.5">{q.question}</p>
                    </div>

                    {/* Options */}
                    <div className="space-y-2.5 ml-0 sm:ml-12">
                      {q.options.map((opt, optIdx) => {
                        const letter = String.fromCharCode(65 + optIdx);
                        const isSelected = optIdx === selected;
                        const isCorrectOpt = optIdx === q.correctIndex;

                        let baseClass = 'group relative flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200 text-sm';

                        if (isRevealed) {
                          if (isCorrectOpt) {
                            baseClass += ' border-green-400 bg-green-50 dark:bg-green-950/50 dark:border-green-600';
                          } else if (isSelected && !isCorrect) {
                            baseClass += ' border-red-400 bg-red-50 dark:bg-red-950/50 dark:border-red-600';
                          } else {
                            baseClass += ' border-gray-200 dark:border-gray-700 opacity-40';
                          }
                        } else if (isSelected) {
                          baseClass += ' border-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 dark:border-indigo-500 shadow-sm ring-2 ring-indigo-200 dark:ring-indigo-800';
                        } else {
                          baseClass += ' border-gray-200 dark:border-gray-700 hover:border-indigo-300 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 hover:shadow-sm';
                        }

                        return (
                          <div
                            key={optIdx}
                            className={baseClass}
                            onClick={() => handleSelect(qIdx, optIdx)}
                          >
                            <span className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                              isRevealed && isCorrectOpt
                                ? 'bg-green-500 text-white'
                                : isRevealed && isSelected && !isCorrect
                                ? 'bg-red-500 text-white'
                                : isSelected
                                ? 'bg-indigo-500 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900'
                            }`}>
                              {letter}
                            </span>
                            <span className="pt-0.5 flex-1">{opt}</span>
                            {isRevealed && isCorrectOpt && (
                              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            )}
                            {isRevealed && isSelected && !isCorrect && optIdx !== q.correctIndex && (
                              <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Check Answer button */}
                    {!isRevealed && selected !== undefined && (
                      <div className="ml-0 sm:ml-12 mt-4">
                        <button
                          onClick={() => handleReveal(qIdx)}
                          className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] flex items-center gap-2"
                        >
                          <Zap className="h-4 w-4" />
                          Check Answer
                        </button>
                      </div>
                    )}

                    {/* Explanation */}
                    {isRevealed && (
                      <div className={`ml-0 sm:ml-12 mt-4 p-4 rounded-xl text-sm border transition-all duration-300 ${
                        isCorrect
                          ? 'bg-green-50 border-green-200 dark:bg-green-950/50 dark:border-green-800'
                          : 'bg-amber-50 border-amber-200 dark:bg-amber-950/50 dark:border-amber-800'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          {isCorrect ? (
                            <>
                              <div className="h-6 w-6 rounded-lg bg-green-500 flex items-center justify-center">
                                <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                              </div>
                              <span className="font-bold text-green-800 dark:text-green-200">Correct!</span>
                            </>
                          ) : (
                            <>
                              <div className="h-6 w-6 rounded-lg bg-amber-500 flex items-center justify-center">
                                <XCircle className="h-3.5 w-3.5 text-white" />
                              </div>
                              <span className="font-bold text-amber-800 dark:text-amber-200">
                                Incorrect — Answer: {String.fromCharCode(65 + q.correctIndex)}
                              </span>
                            </>
                          )}
                        </div>
                        <p className="text-muted-foreground leading-relaxed pl-8">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Final Score */}
          {answeredCount === questions.length && questions.length > 0 && (
            <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white text-center shadow-xl">
              <div className="flex justify-center mb-3">
                <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Trophy className="h-7 w-7" />
                </div>
              </div>
              <p className="text-3xl font-black mb-1">
                {correctCount}/{questions.length}
              </p>
              <p className="text-white/80 text-sm mb-3">
                {Math.round((correctCount / questions.length) * 100)}% Score
              </p>
              <p className="text-sm text-white/90">
                {correctCount === questions.length
                  ? 'Perfect! You\'ve mastered this section.'
                  : correctCount >= questions.length * 0.7
                  ? 'Great job! Review explanations for missed questions.'
                  : 'Keep studying — review the material and try again.'}
              </p>
              <button
                onClick={handleReset}
                className="mt-4 px-5 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition-colors backdrop-blur-sm flex items-center gap-2 mx-auto"
              >
                <RotateCcw className="h-4 w-4" /> Try Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
