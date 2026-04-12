'use client';

import React, { useState } from 'react';
import { CheckCircle2, XCircle, ChevronDown, ChevronRight } from 'lucide-react';

interface QuizOption {
  text: string;
}

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
  const [expanded, setExpanded] = useState(true);

  const handleSelect = (qIdx: number, optIdx: number) => {
    if (revealed[qIdx]) return; // Already answered
    setAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleReveal = (qIdx: number) => {
    setRevealed(prev => ({ ...prev, [qIdx]: true }));
  };

  const answeredCount = Object.keys(revealed).length;
  const correctCount = Object.entries(revealed).filter(
    ([qIdx]) => answers[Number(qIdx)] === questions[Number(qIdx)]?.correctIndex
  ).length;

  return (
    <div className="my-6 border rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-blue-900 dark:text-blue-100">{title}</span>
          <span className="text-sm text-blue-600 dark:text-blue-300">
            ({questions.length} questions)
          </span>
          {answeredCount > 0 && (
            <span className="text-sm text-blue-600 dark:text-blue-300 ml-2">
              {correctCount}/{answeredCount} correct
            </span>
          )}
        </div>
        {expanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
      </button>

      {expanded && (
        <div className="p-4 space-y-6">
          {questions.map((q, qIdx) => {
            const selected = answers[qIdx];
            const isRevealed = revealed[qIdx];
            const isCorrect = selected === q.correctIndex;

            return (
              <div key={qIdx} className="border rounded-lg p-4">
                <div className="flex items-start gap-2 mb-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {qIdx + 1}
                  </span>
                  <p className="text-sm font-medium leading-relaxed">{q.question}</p>
                </div>

                <div className="space-y-2 ml-10">
                  {q.options.map((opt, optIdx) => {
                    const letter = String.fromCharCode(65 + optIdx);
                    let optionClass = 'border rounded-lg p-3 cursor-pointer transition-colors text-sm';

                    if (isRevealed) {
                      if (optIdx === q.correctIndex) {
                        optionClass += ' bg-green-50 border-green-300 dark:bg-green-950 dark:border-green-700';
                      } else if (optIdx === selected && !isCorrect) {
                        optionClass += ' bg-red-50 border-red-300 dark:bg-red-950 dark:border-red-700';
                      } else {
                        optionClass += ' opacity-50';
                      }
                    } else if (optIdx === selected) {
                      optionClass += ' border-primary bg-primary/5';
                    } else {
                      optionClass += ' hover:bg-accent/50';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={optionClass}
                        onClick={() => handleSelect(qIdx, optIdx)}
                      >
                        <div className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold">
                            {letter}
                          </span>
                          <span>{opt}</span>
                          {isRevealed && optIdx === q.correctIndex && (
                            <CheckCircle2 className="h-5 w-5 text-green-500 ml-auto flex-shrink-0" />
                          )}
                          {isRevealed && optIdx === selected && !isCorrect && optIdx !== q.correctIndex && (
                            <XCircle className="h-5 w-5 text-red-500 ml-auto flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Submit / Result */}
                <div className="ml-10 mt-3">
                  {!isRevealed && selected !== undefined && (
                    <button
                      onClick={() => handleReveal(qIdx)}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      Check Answer
                    </button>
                  )}

                  {isRevealed && (
                    <div className={`mt-3 p-3 rounded-lg text-sm ${
                      isCorrect
                        ? 'bg-green-50 border border-green-200 dark:bg-green-950 dark:border-green-800'
                        : 'bg-amber-50 border border-amber-200 dark:bg-amber-950 dark:border-amber-800'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        {isCorrect ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-amber-600" />
                        )}
                        <span className="font-semibold">
                          {isCorrect ? 'Correct!' : `Incorrect — Answer: ${String.fromCharCode(65 + q.correctIndex)}`}
                        </span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{q.explanation}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Summary */}
          {answeredCount === questions.length && (
            <div className="p-4 bg-primary/5 rounded-lg text-center">
              <p className="text-lg font-bold">
                Score: {correctCount}/{questions.length} ({Math.round((correctCount / questions.length) * 100)}%)
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {correctCount === questions.length
                  ? 'Perfect score! You have mastered this section.'
                  : correctCount >= questions.length * 0.7
                  ? 'Good job! Review the explanations for missed questions.'
                  : 'Review the material and try again.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
