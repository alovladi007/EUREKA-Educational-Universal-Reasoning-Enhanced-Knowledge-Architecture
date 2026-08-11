'use client';

import { useState } from 'react';
import {
  Brain, CheckCircle2, ChevronDown, RotateCcw, XCircle, Zap,
} from 'lucide-react';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

/**
 * Two skins, one quiz.
 *
 * `vivid` is the original: gradient chrome, filled badges, a trophy
 * banner. It is what the exam reader tab has always shown, so it stays the
 * default and CISSP is untouched.
 *
 * `book` is for the MCAT course page, where the quiz sits inside a long
 * serif reading column. There the gradients fought the page - a purple
 * card in the middle of a textbook reads as an advertisement - so this
 * skin uses the same hairline borders, mono numbering and border-plus-soft
 * -fill verdicts as the rest of that page. Only the classes differ; the
 * logic below is shared, so the two can never drift apart in behaviour.
 */
export type QuizVariant = 'vivid' | 'book';

interface LessonQuizProps {
  questions: QuizQuestion[];
  title?: string;
  variant?: QuizVariant;
}

interface Skin {
  shell: string;
  header: string;
  iconWrap: string;
  iconClass: string;
  titleText: string;
  subText: string;
  track: string;
  fill: string;
  pctText: string;
  chevWrap: string;
  body: string;
  card: (revealed: boolean, correct: boolean) => string;
  qNum: (revealed: boolean, correct: boolean) => string;
  qText: string;
  option: (state: 'idle' | 'selected' | 'right' | 'wrong' | 'muted') => string;
  letter: (state: 'idle' | 'selected' | 'right' | 'wrong' | 'muted') => string;
  checkBtn: string;
  explain: (correct: boolean) => string;
  explainHead: (correct: boolean) => string;
  explainBody: string;
  score: string;
  scoreNum: string;
  scoreSub: string;
  resetBtn: string;
  indent: string;
}

const SKINS: Record<QuizVariant, Skin> = {
  vivid: {
    shell:
      'my-8 rounded-2xl overflow-hidden shadow-lg border-2 border-indigo-200 dark:border-indigo-800 bg-gradient-to-br from-indigo-50/80 to-purple-50/80 dark:from-indigo-950/50 dark:to-purple-950/50',
    header:
      'w-full flex items-center justify-between p-5 hover:bg-indigo-100/50 dark:hover:bg-indigo-900/30 transition-all duration-200',
    iconWrap:
      'flex-shrink-0 h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md',
    iconClass: 'h-5 w-5 text-white',
    titleText: 'text-base font-bold text-indigo-900 dark:text-indigo-100 block',
    subText: 'text-xs text-indigo-600 dark:text-indigo-300',
    track: 'w-24 h-2 bg-indigo-200 dark:bg-indigo-800 rounded-full overflow-hidden',
    fill: 'h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500',
    pctText: 'text-xs font-medium text-indigo-600 dark:text-indigo-300',
    chevWrap:
      'h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center transition-transform duration-200',
    body: 'px-5 pb-5',
    card: (revealed, correct) =>
      `rounded-xl border-2 transition-all duration-300 shadow-sm ${
        revealed
          ? correct
            ? 'border-green-300 dark:border-green-700 bg-green-50/50 dark:bg-green-950/30'
            : 'border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/30'
          : 'border-white/60 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80'
      }`,
    qNum: (revealed, correct) =>
      `flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shadow-sm ${
        revealed
          ? correct
            ? 'bg-green-500 text-white'
            : 'bg-amber-500 text-white'
          : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
      }`,
    qText: 'text-sm font-medium leading-relaxed pt-1.5',
    option: (state) =>
      `group relative flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200 text-sm ${
        {
          right: 'border-green-400 bg-green-50 dark:bg-green-950/50 dark:border-green-600',
          wrong: 'border-red-400 bg-red-50 dark:bg-red-950/50 dark:border-red-600',
          muted: 'border-gray-200 dark:border-gray-700 opacity-40',
          selected:
            'border-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 dark:border-indigo-500 shadow-sm ring-2 ring-indigo-200 dark:ring-indigo-800',
          idle:
            'border-gray-200 dark:border-gray-700 hover:border-indigo-300 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30',
        }[state]
      }`,
    letter: (state) =>
      `flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
        {
          right: 'bg-green-500 text-white',
          wrong: 'bg-red-500 text-white',
          selected: 'bg-indigo-500 text-white',
          muted: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
          idle: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
        }[state]
      }`,
    checkBtn:
      'px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-semibold hover:from-indigo-600 hover:to-purple-700 shadow-md flex items-center gap-2',
    explain: (correct) =>
      `mt-4 p-4 rounded-xl text-sm border ${
        correct
          ? 'bg-green-50 border-green-200 dark:bg-green-950/50 dark:border-green-800'
          : 'bg-amber-50 border-amber-200 dark:bg-amber-950/50 dark:border-amber-800'
      }`,
    explainHead: (correct) =>
      `font-bold ${correct ? 'text-green-800 dark:text-green-200' : 'text-amber-800 dark:text-amber-200'}`,
    explainBody: 'text-muted-foreground leading-relaxed pl-8',
    score:
      'mt-6 p-6 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white text-center shadow-xl',
    scoreNum: 'text-3xl font-black mb-1',
    scoreSub: 'text-white/80 text-sm mb-3',
    resetBtn:
      'mt-4 px-5 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium flex items-center gap-2 mx-auto',
    indent: 'ml-0 sm:ml-12',
  },

  book: {
    shell: 'my-6 rounded-xl border bg-card overflow-hidden',
    header:
      'w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors',
    iconWrap: 'flex-shrink-0 h-7 w-7 rounded-lg bg-muted flex items-center justify-center',
    iconClass: 'h-3.5 w-3.5 text-muted-foreground',
    titleText: 'text-sm font-semibold block',
    subText: 'text-[11px] text-muted-foreground',
    track: 'w-20 h-1.5 bg-muted rounded-full overflow-hidden',
    fill: 'h-full bg-primary rounded-full transition-all duration-500',
    pctText: 'text-[11px] font-mono tabular-nums text-muted-foreground',
    chevWrap: 'h-6 w-6 flex items-center justify-center text-muted-foreground transition-transform duration-200',
    body: 'px-4 pb-4',
    card: (revealed, correct) =>
      `rounded-lg border transition-colors ${
        revealed
          ? correct
            ? 'border-green-600/40 bg-green-500/5'
            : 'border-amber-500/40 bg-amber-500/5'
          : 'border-border'
      }`,
    qNum: (revealed, correct) =>
      `flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-mono ${
        revealed
          ? correct
            ? 'text-green-600 dark:text-green-500'
            : 'text-amber-600 dark:text-amber-500'
          : 'bg-muted text-muted-foreground'
      }`,
    qText: 'text-sm font-medium leading-relaxed',
    option: (state) =>
      `w-full text-left flex items-start gap-2 rounded-md border px-3 py-2 text-sm cursor-pointer transition-colors ${
        {
          right: 'border-green-600 bg-green-50 dark:bg-green-950/30',
          wrong: 'border-red-500 bg-red-50 dark:bg-red-950/30',
          muted: 'border-border opacity-50',
          selected: 'border-primary bg-primary/10',
          idle: 'border-border hover:border-primary/60 hover:bg-primary/5',
        }[state]
      }`,
    letter: (state) =>
      `flex-shrink-0 font-mono text-xs pt-0.5 ${
        {
          right: 'text-green-700 dark:text-green-500',
          wrong: 'text-red-600 dark:text-red-400',
          selected: 'text-primary',
          muted: 'text-muted-foreground',
          idle: 'text-muted-foreground',
        }[state]
      }`,
    checkBtn:
      'px-3.5 py-1.5 rounded-md bg-primary text-primary-foreground text-[13px] font-medium hover:opacity-90 flex items-center gap-1.5',
    explain: (correct) =>
      `mt-3 rounded-r-md border-l-2 px-3.5 py-2.5 text-[13px] ${
        correct ? 'border-green-600 bg-green-500/5' : 'border-amber-500 bg-amber-500/5'
      }`,
    explainHead: (correct) =>
      `font-semibold text-[11px] uppercase tracking-wide ${
        correct ? 'text-green-700 dark:text-green-500' : 'text-amber-700 dark:text-amber-500'
      }`,
    explainBody: 'text-muted-foreground leading-relaxed mt-1',
    score: 'mt-4 rounded-lg border p-4 text-center',
    scoreNum: 'text-2xl font-bold font-mono tabular-nums',
    scoreSub: 'text-xs text-muted-foreground mt-0.5',
    resetBtn:
      'mt-3 px-3 py-1.5 rounded-md border text-[13px] hover:bg-muted flex items-center gap-1.5 mx-auto',
    indent: 'ml-0 sm:ml-8',
  },
};

export function LessonQuiz({
  questions,
  title = 'Practice Questions',
  variant = 'vivid',
}: LessonQuizProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [expanded, setExpanded] = useState(false);
  const s = SKINS[variant];

  const handleSelect = (qIdx: number, optIdx: number) => {
    if (revealed[qIdx]) return;
    setAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };
  const handleReveal = (qIdx: number) => setRevealed((prev) => ({ ...prev, [qIdx]: true }));
  const handleReset = () => {
    setAnswers({});
    setRevealed({});
  };

  const answeredCount = Object.keys(revealed).length;
  const correctCount = Object.entries(revealed).filter(
    ([qIdx]) => answers[Number(qIdx)] === questions[Number(qIdx)]?.correctIndex,
  ).length;
  const progress = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

  return (
    <div className={s.shell}>
      <button onClick={() => setExpanded(!expanded)} className={s.header}>
        <div className="flex items-center gap-3">
          <div className={s.iconWrap}>
            <Brain className={s.iconClass} />
          </div>
          <div className="text-left">
            <span className={s.titleText}>{title}</span>
            <span className={s.subText}>
              {questions.length} question{questions.length === 1 ? '' : 's'}
              {answeredCount > 0 && ` · ${correctCount}/${answeredCount} correct`}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {answeredCount > 0 && (
            <div className="hidden sm:flex items-center gap-2">
              <div className={s.track}>
                <div className={s.fill} style={{ width: `${progress}%` }} />
              </div>
              <span className={s.pctText}>{progress}%</span>
            </div>
          )}
          <div className={`${s.chevWrap} ${expanded ? 'rotate-180' : ''}`}>
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </button>

      {expanded && (
        <div className={s.body}>
          {answeredCount > 0 && (
            <div className="flex justify-end mb-3">
              <button
                onClick={handleReset}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="h-3 w-3" /> Reset
              </button>
            </div>
          )}

          <div className={variant === 'book' ? 'space-y-3' : 'space-y-5'}>
            {questions.map((q, qIdx) => {
              const selected = answers[qIdx];
              const isRevealed = revealed[qIdx];
              const isCorrect = selected === q.correctIndex;

              return (
                <div key={qIdx} className={s.card(!!isRevealed, isCorrect)}>
                  <div className={variant === 'book' ? 'p-3.5' : 'p-4 sm:p-5'}>
                    <div className="flex items-start gap-3 mb-3">
                      <div className={s.qNum(!!isRevealed, isCorrect)}>
                        {isRevealed ? (
                          isCorrect ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />
                        ) : (
                          qIdx + 1
                        )}
                      </div>
                      <p className={s.qText}>{q.question}</p>
                    </div>

                    <div className={`space-y-2 ${s.indent}`}>
                      {q.options.map((opt, optIdx) => {
                        const letter = String.fromCharCode(65 + optIdx);
                        const isSelected = optIdx === selected;
                        const isCorrectOpt = optIdx === q.correctIndex;

                        const state: 'idle' | 'selected' | 'right' | 'wrong' | 'muted' =
                          isRevealed
                            ? isCorrectOpt
                              ? 'right'
                              : isSelected
                                ? 'wrong'
                                : 'muted'
                            : isSelected
                              ? 'selected'
                              : 'idle';

                        return (
                          <div
                            key={optIdx}
                            className={s.option(state)}
                            onClick={() => handleSelect(qIdx, optIdx)}
                          >
                            <span className={s.letter(state)}>
                              {variant === 'book' ? `${letter}.` : letter}
                            </span>
                            <span className={variant === 'book' ? 'flex-1' : 'pt-0.5 flex-1'}>{opt}</span>
                            {isRevealed && isCorrectOpt && (
                              <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                            )}
                            {isRevealed && isSelected && !isCorrectOpt && (
                              <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {!isRevealed && selected !== undefined && (
                      <div className={`${s.indent} mt-3`}>
                        <button onClick={() => handleReveal(qIdx)} className={s.checkBtn}>
                          <Zap className={variant === 'book' ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
                          Check answer
                        </button>
                      </div>
                    )}

                    {isRevealed && (
                      <div className={`${s.indent} ${s.explain(isCorrect)}`}>
                        {variant === 'book' ? (
                          <>
                            <div className={s.explainHead(isCorrect)}>
                              {isCorrect
                                ? 'Correct'
                                : `Answer: ${String.fromCharCode(65 + q.correctIndex)}`}
                            </div>
                            <p className={s.explainBody}>{q.explanation}</p>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 mb-2">
                              <div
                                className={`h-6 w-6 rounded-lg flex items-center justify-center ${
                                  isCorrect ? 'bg-green-500' : 'bg-amber-500'
                                }`}
                              >
                                {isCorrect ? (
                                  <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                                ) : (
                                  <XCircle className="h-3.5 w-3.5 text-white" />
                                )}
                              </div>
                              <span className={s.explainHead(isCorrect)}>
                                {isCorrect
                                  ? 'Correct!'
                                  : `Incorrect — Answer: ${String.fromCharCode(65 + q.correctIndex)}`}
                              </span>
                            </div>
                            <p className={s.explainBody}>{q.explanation}</p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {answeredCount === questions.length && questions.length > 0 && (
            <div className={s.score}>
              {variant === 'vivid' && (
                <div className="flex justify-center mb-3">
                  <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                </div>
              )}
              <p className={s.scoreNum}>
                {correctCount}/{questions.length}
              </p>
              <p className={s.scoreSub}>
                {correctCount === questions.length
                  ? 'All correct.'
                  : correctCount >= questions.length * 0.7
                    ? 'Review the explanations for what you missed.'
                    : 'Worth re-reading this section before moving on.'}
              </p>
              <button onClick={handleReset} className={s.resetBtn}>
                <RotateCcw className={variant === 'book' ? 'h-3.5 w-3.5' : 'h-4 w-4'} /> Try again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
