'use client';


import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AcademicCapIcon,
  ClockIcon,
  LightBulbIcon,
  ChartBarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
  SparklesIcon,
  BeakerIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';
import Confetti from 'react-confetti';
import { useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { EXAM_TYPE_LIST, getSectionsForExam, getExamConfig } from '@/lib/exam-config';
import { useActiveExam } from '@/hooks/use-active-exam';
import { ExamSelector } from '@/components/test-prep/ExamSelector';

interface AdaptiveSession {
  session_id: string;
  user_id: string;
  exam_type: string;
  target_questions: number;
  questions_answered: number;
  current_ability: number;
  ability_se: number;
  is_complete: boolean;
}

function PracticeModePageInner() {
  // The active-exam hook unifies the source of truth (URL > localStorage > default).
  // The Practice page used to read `?exam=` directly and fall back to GRE, which
  // ignored the user's persisted selection across navigation.
  const { examType: activeExam, examConfig: activeExamConfig, setActiveExam } = useActiveExam();
  const searchParams = useSearchParams();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<AdaptiveSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    totalQuestions: 0,
    correctAnswers: 0,
    currentStreak: 0,
    timeSpent: 0,
    userAbility: 0,
    abilitySE: 0
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [questionTimer, setQuestionTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [hintUsed, setHintUsed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSetup, setShowSetup] = useState(true);
  // Honor ?section= on first mount so deep links (e.g. from the LSAT/MCAT
  // frequency heatmap cells) land directly on the correct topic.
  const initialSectionFromUrl = (() => {
    const raw = searchParams.get('section') || '';
    if (!raw) return '';
    return getSectionsForExam(activeExam).some((s) => s.id === raw) ? raw : '';
  })();
  const initialQuestionsFromUrl = (() => {
    const raw = Number(searchParams.get('q'));
    if (!raw || Number.isNaN(raw)) return 20;
    return Math.max(10, Math.min(50, Math.round(raw)));
  })();
  const [sessionConfig, setSessionConfig] = useState({
    examType: activeExam,
    section: initialSectionFromUrl || getSectionsForExam(activeExam)[0]?.id || '',
    targetQuestions: initialQuestionsFromUrl,
  });

  // Resync session config when the active exam changes (e.g. user picks a new
  // exam in the layout pill or on another page, then navigates here).
  useEffect(() => {
    setSessionConfig((prev) => {
      if (prev.examType === activeExam) return prev;
      return {
        ...prev,
        examType: activeExam,
        section: getSectionsForExam(activeExam)[0]?.id || '',
      };
    });
  }, [activeExam]);

  const currentSections = getSectionsForExam(sessionConfig.examType);

  // Start timer when new question loads
  useEffect(() => {
    if (currentQuestion && !showExplanation) {
      const interval = setInterval(() => {
        setQuestionTimer(prev => prev + 1);
      }, 1000);
      setTimerInterval(interval);
      return () => clearInterval(interval);
    } else if (timerInterval) {
      clearInterval(timerInterval);
    }
  }, [currentQuestion, showExplanation]);

  // Start new adaptive session
  const startSession = async () => {
    setLoading(true);
    try {
      const response = await apiClient.startAdaptiveSession({
        user_id: 'current_user', // Will be populated by auth
        exam_type: sessionConfig.examType,
        section: sessionConfig.section,
        target_questions: sessionConfig.targetQuestions
      });

      setSessionId(response.session_id);
      setSessionData(response);
      setShowSetup(false);
      toast.success('Adaptive session started!');

      // Load first question
      await loadNextQuestion(response.session_id);
    } catch (error) {
      console.error('Failed to start session:', error);
      toast.error('Failed to start adaptive session');
    } finally {
      setLoading(false);
    }
  };

  // Load next question from session
  const loadNextQuestion = async (sid?: string) => {
    const activeSessionId = sid || sessionId;
    if (!activeSessionId) return;

    setLoading(true);
    try {
      const response = await apiClient.getAdaptiveSessionStatus(activeSessionId);

      if (response.is_complete) {
        toast.success('Session complete! View your results below.');
        setSessionData(response);
        return;
      }

      // The next question is included in the session status
      if (response.next_question) {
        setCurrentQuestion(response.next_question);
        setSessionData(response);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setQuestionTimer(0);
        setHintUsed(false);
        setShowHint(false);

        // Update session stats
        setSessionStats(prev => ({
          ...prev,
          totalQuestions: response.questions_answered || prev.totalQuestions,
          userAbility: response.current_ability || prev.userAbility,
          abilitySE: response.ability_se || prev.abilitySE
        }));
      }
    } catch (error) {
      console.error('Failed to load question:', error);
      toast.error('Failed to load next question');
    } finally {
      setLoading(false);
    }
  };

  // Submit answer to session
  const submitAnswer = async () => {
    if (selectedAnswer === null) {
      toast.error('Please select an answer');
      return;
    }

    if (!sessionId || !currentQuestion) return;

    setLoading(true);
    try {
      const response = await apiClient.submitAdaptiveResponse({
        session_id: sessionId,
        question_id: currentQuestion.id,
        answer_index: selectedAnswer,
        time_spent: questionTimer
      });

      const is_correct = response.is_correct || response.correct || false;
      const new_ability = response.new_ability || response.ability_estimate || sessionStats.userAbility;

      // Update session stats
      setSessionStats(prev => ({
        totalQuestions: prev.totalQuestions + 1,
        correctAnswers: prev.correctAnswers + (is_correct ? 1 : 0),
        currentStreak: is_correct ? prev.currentStreak + 1 : 0,
        timeSpent: prev.timeSpent + questionTimer,
        userAbility: new_ability,
        abilitySE: response.ability_se || prev.abilitySE
      }));

      // Show confetti for streaks
      if (is_correct && sessionStats.currentStreak >= 2) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }

      setShowExplanation(true);

      // Show feedback toast
      if (is_correct) {
        toast.success('Correct! Great job! 🎉');
      } else {
        toast.error('Not quite right. Let\'s review the explanation.');
      }

      // Update session data
      if (response.session) {
        setSessionData(response.session);
      }
    } catch (error) {
      console.error('Failed to submit answer:', error);
      toast.error('Failed to submit answer');
    } finally {
      setLoading(false);
    }
  };

  // End session
  const endSession = async () => {
    if (!sessionId) return;

    try {
      await apiClient.endAdaptiveSession(sessionId);
      toast.success('Session ended. Great work!');

      // Reset state
      setSessionId(null);
      setCurrentQuestion(null);
      setSessionData(null);
      setShowSetup(true);
      setSessionStats({
        totalQuestions: 0,
        correctAnswers: 0,
        currentStreak: 0,
        timeSpent: 0,
        userAbility: 0,
        abilitySE: 0
      });
    } catch (error) {
      console.error('Failed to end session:', error);
      toast.error('Failed to end session');
    }
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= -1) return 'text-green-600 bg-green-100';
    if (difficulty <= 0.5) return 'text-yellow-600 bg-yellow-100';
    if (difficulty <= 1.5) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  // Get ability level label
  const getAbilityLabel = (ability: number) => {
    if (ability <= -1) return { label: 'Beginner', color: 'text-blue-600' };
    if (ability <= 0) return { label: 'Intermediate', color: 'text-green-600' };
    if (ability <= 1) return { label: 'Advanced', color: 'text-purple-600' };
    return { label: 'Expert', color: 'text-red-600' };
  };

  const abilityInfo = getAbilityLabel(sessionStats.userAbility);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <Toaster position="top-right" />
      {showConfetti && <Confetti />}

      {/* Session Setup Modal */}
      {showSetup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-lg w-full m-4"
          >
            <div className="flex items-center mb-6">
              <BeakerIcon className="h-8 w-8 text-indigo-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Start Adaptive Practice</h2>
            </div>

            <p className="text-gray-600 mb-6">
              Configure your IRT-based adaptive testing session. Questions will dynamically adjust to your ability level.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exam Type
                </label>
                <select
                  value={sessionConfig.examType}
                  onChange={(e) => {
                    const newExam = e.target.value;
                    const newSections = getSectionsForExam(newExam);
                    setSessionConfig({
                      ...sessionConfig,
                      examType: newExam,
                      section: newSections[0]?.id || '',
                    });
                    // Sync into the global active-exam state so other tabs see it.
                    setActiveExam(newExam);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {EXAM_TYPE_LIST.map((exam) => (
                    <option key={exam.id} value={exam.id}>{exam.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section
                </label>
                <select
                  value={sessionConfig.section}
                  onChange={(e) => setSessionConfig({...sessionConfig, section: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {currentSections.map((section) => (
                    <option key={section.id} value={section.id}>{section.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Questions: {sessionConfig.targetQuestions}
                </label>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={sessionConfig.targetQuestions}
                  onChange={(e) => setSessionConfig({...sessionConfig, targetQuestions: parseInt(e.target.value)})}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>10</span>
                  <span>30</span>
                  <span>50</span>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-indigo-50 rounded-lg p-4">
              <h3 className="font-semibold text-indigo-900 mb-2 flex items-center">
                <SparklesIcon className="h-5 w-5 mr-2" />
                How It Works
              </h3>
              <ul className="text-sm text-indigo-800 space-y-1">
                <li>• Questions adapt to your performance in real-time</li>
                <li>• 3PL IRT model estimates your ability level</li>
                <li>• Optimal question selection maximizes learning</li>
                <li>• Confidence intervals track measurement precision</li>
              </ul>
            </div>

            <button
              onClick={startSession}
              disabled={loading}
              className="w-full mt-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium"
            >
              {loading ? 'Starting Session...' : 'Start Adaptive Session'}
            </button>
          </motion.div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Active exam card — visible behind the modal too */}
        <ExamSelector variant="card" />

        {/* Header Stats */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Questions</p>
                <p className="text-2xl font-bold text-gray-900">{sessionStats.totalQuestions}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Accuracy</p>
                <p className="text-2xl font-bold text-green-600">
                  {sessionStats.totalQuestions > 0
                    ? Math.round((sessionStats.correctAnswers / sessionStats.totalQuestions) * 100)
                    : 0}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Streak</p>
                <p className="text-2xl font-bold text-orange-600">🔥 {sessionStats.currentStreak}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Your Level</p>
                <p className={`text-xl font-bold ${abilityInfo.color}`}>
                  {abilityInfo.label}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Ability Score</p>
                <p className="text-xl font-bold text-indigo-600">
                  {sessionStats.userAbility.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Question Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Question Panel */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {currentQuestion && (
                <motion.div
                  key={currentQuestion.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-2xl shadow-lg p-8"
                >
                  {/* Question Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(currentQuestion.difficulty || 0)}`}>
                        {currentQuestion.difficulty_label || 'Medium'}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                        {currentQuestion.topic}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <ClockIcon className="h-5 w-5 mr-1" />
                      <span className="font-mono">{formatTime(questionTimer)}</span>
                    </div>
                  </div>

                  {/* Question Text */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {currentQuestion.question_text}
                    </h3>

                    {/* Show hint if requested */}
                    {showHint && currentQuestion.hint && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4"
                      >
                        <div className="flex items-start">
                          <LightBulbIcon className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
                          <p className="text-sm text-yellow-800">{currentQuestion.hint}</p>
                        </div>
                      </motion.div>
                    )}

                    {/* Image if present */}
                    {currentQuestion.image_url && (
                      <img
                        src={currentQuestion.image_url}
                        alt="Question"
                        className="max-w-full h-auto rounded-lg mb-4"
                      />
                    )}
                  </div>

                  {/* Answer Options */}
                  {currentQuestion.question_type === 'multiple_choice' && (
                    <div className="space-y-3 mb-8">
                      {currentQuestion.options?.map((option: any, index: number) => {
                        const isCorrect = index === currentQuestion.correct_answer_index || index === currentQuestion.correct_answer;
                        const isSelected = selectedAnswer === index;

                        return (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => !showExplanation && setSelectedAnswer(index)}
                            disabled={showExplanation}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                              showExplanation
                                ? isCorrect
                                  ? 'border-green-500 bg-green-50'
                                  : isSelected
                                  ? 'border-red-500 bg-red-50'
                                  : 'border-gray-200'
                                : isSelected
                                ? 'border-indigo-500 bg-indigo-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center">
                              <span className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-semibold text-sm">
                                {String.fromCharCode(65 + index)}
                              </span>
                              <span className="ml-3 text-gray-900">{option.text || option}</span>
                              {showExplanation && (
                                <span className="ml-auto">
                                  {isCorrect ? (
                                    <CheckCircleIcon className="h-6 w-6 text-green-500" />
                                  ) : isSelected ? (
                                    <XCircleIcon className="h-6 w-6 text-red-500" />
                                  ) : null}
                                </span>
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}

                  {/* Explanation */}
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6"
                    >
                      <h4 className="font-semibold text-blue-900 mb-2">Explanation:</h4>
                      <p className="text-blue-800">{currentQuestion.explanation || 'No explanation available.'}</p>
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-between">
                    {!showExplanation ? (
                      <>
                        <button
                          onClick={() => {
                            setShowHint(true);
                            setHintUsed(true);
                          }}
                          disabled={showHint || !currentQuestion.hint}
                          className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <LightBulbIcon className="h-5 w-5 inline mr-2" />
                          Get Hint
                        </button>
                        <button
                          onClick={submitAnswer}
                          disabled={!selectedAnswer || loading}
                          className="px-8 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Submit Answer
                        </button>
                      </>
                    ) : (
                      <button
                        // Wrap loadNextQuestion in an arrow — the function
                        // expects an optional sid string, but the button's
                        // onClick passes a MouseEvent.
                        onClick={() => loadNextQuestion()}
                        disabled={loading}
                        className="ml-auto px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                      >
                        Next Question
                        <ArrowRightIcon className="h-5 w-5 ml-2" />
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {loading && !currentQuestion && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
              </div>
            )}
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Adaptive Engine Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center mb-4">
                <SparklesIcon className="h-6 w-6 text-purple-600 mr-2" />
                <h3 className="text-lg font-semibold">AI Adaptation</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Question Selection</p>
                  <p className="text-sm font-medium text-gray-900">
                    Optimized for your current ability level
                  </p>
                </div>

                {currentQuestion && (
                  <>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Success Probability</p>
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full"
                            style={{ width: `${(currentQuestion.probability_correct || 0.5) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {Math.round((currentQuestion.probability_correct || 0.5) * 100)}%
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1">Learning Impact</p>
                      <p className="text-sm font-medium text-indigo-600">
                        High information gain
                      </p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>

            {/* Session Progress */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center mb-4">
                <ChartBarIcon className="h-6 w-6 text-indigo-600 mr-2" />
                <h3 className="text-lg font-semibold">Session Progress</h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Time</span>
                  <span className="text-sm font-medium">
                    {Math.floor(sessionStats.timeSpent / 60)} min
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Avg. Time/Question</span>
                  <span className="text-sm font-medium">
                    {sessionStats.totalQuestions > 0
                      ? Math.round(sessionStats.timeSpent / sessionStats.totalQuestions)
                      : 0} sec
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Best Streak</span>
                  <span className="text-sm font-medium text-orange-600">
                    🔥 {sessionStats.currentStreak}
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                <button
                  onClick={endSession}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  End Session & View Report
                </button>
                {sessionData && (
                  <div className="text-xs text-gray-500 text-center">
                    {sessionData.questions_answered} / {sessionData.target_questions} questions
                  </div>
                )}
              </div>
            </motion.div>

            {/* IRT Model Info */}
            {sessionStats.userAbility !== 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center mb-4">
                  <BeakerIcon className="h-6 w-6 text-purple-600 mr-2" />
                  <h3 className="text-lg font-semibold">IRT Model Stats</h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Ability Estimate (θ)</p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-indigo-600">
                        {sessionStats.userAbility.toFixed(2)}
                      </p>
                      <span className={`text-sm font-medium ${abilityInfo.color}`}>
                        {abilityInfo.label}
                      </span>
                    </div>
                  </div>

                  {sessionStats.abilitySE > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Standard Error (SE)</p>
                      <p className="text-sm font-medium">±{sessionStats.abilitySE.toFixed(2)}</p>
                      <div className="mt-2 bg-gray-100 rounded-lg p-2">
                        <p className="text-xs text-gray-600">
                          95% CI: [{(sessionStats.userAbility - 1.96 * sessionStats.abilitySE).toFixed(2)}, {(sessionStats.userAbility + 1.96 * sessionStats.abilitySE).toFixed(2)}]
                        </p>
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Measurement Precision</p>
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full"
                          style={{ width: `${Math.min(100, (1 / Math.max(0.1, sessionStats.abilitySE)) * 20)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {sessionStats.abilitySE < 0.3 ? 'High' : sessionStats.abilitySE < 0.5 ? 'Medium' : 'Low'}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Study Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-purple-900 mb-3">
                💡 Study Tip
              </h3>
              <p className="text-sm text-purple-800">
                Focus on understanding the explanation for incorrect answers.
                This helps identify knowledge gaps and improves long-term retention.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}


// Wrap the page that calls useSearchParams() in a Suspense boundary
// so Next 14 static export doesn't bail out. (Session 3.6, 2026-05.)
import { Suspense } from 'react';
export default function PracticeModePage() {
  return (
    <Suspense fallback={null}>
      <PracticeModePageInner />
    </Suspense>
  );
}
