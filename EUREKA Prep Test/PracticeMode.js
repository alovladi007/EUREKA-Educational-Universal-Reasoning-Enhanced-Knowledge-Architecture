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
  SparklesIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { axios } from '../../store/authStore';
import Confetti from 'react-confetti';

const PracticeMode = () => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    totalQuestions: 0,
    correctAnswers: 0,
    currentStreak: 0,
    timeSpent: 0,
    userAbility: 0
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [questionTimer, setQuestionTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [hintUsed, setHintUsed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [filters, setFilters] = useState({
    examType: 'GRE',
    subject: null,
    topic: null
  });

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

  // Load next question
  const loadNextQuestion = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/adaptive/next-question', {
        exam_type: filters.examType,
        subject: filters.subject,
        topic: filters.topic
      });
      
      setCurrentQuestion(response.data.question);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setQuestionTimer(0);
      setHintUsed(false);
      setShowHint(false);
      
      // Update user ability in session stats
      if (response.data.metadata) {
        setSessionStats(prev => ({
          ...prev,
          userAbility: response.data.metadata.user_ability
        }));
      }
    } catch (error) {
      toast.error('Failed to load question');
    } finally {
      setLoading(false);
    }
  };

  // Submit answer
  const submitAnswer = async () => {
    if (!selectedAnswer) {
      toast.error('Please select an answer');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/adaptive/submit-answer', {
        question_id: currentQuestion.id,
        user_answer: { selected: selectedAnswer },
        time_spent_seconds: questionTimer,
        hint_used: hintUsed,
        confidence_level: 3 // Can add confidence selector
      });

      const { is_correct, explanation, new_ability, performance } = response.data;
      
      // Update session stats
      setSessionStats(prev => ({
        totalQuestions: prev.totalQuestions + 1,
        correctAnswers: prev.correctAnswers + (is_correct ? 1 : 0),
        currentStreak: is_correct ? prev.currentStreak + 1 : 0,
        timeSpent: prev.timeSpent + questionTimer,
        userAbility: new_ability
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
    } catch (error) {
      toast.error('Failed to submit answer');
    } finally {
      setLoading(false);
    }
  };

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    if (difficulty <= -1) return 'text-green-600 bg-green-100';
    if (difficulty <= 0.5) return 'text-yellow-600 bg-yellow-100';
    if (difficulty <= 1.5) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  // Get ability level label
  const getAbilityLabel = (ability) => {
    if (ability <= -1) return { label: 'Beginner', color: 'text-blue-600' };
    if (ability <= 0) return { label: 'Intermediate', color: 'text-green-600' };
    if (ability <= 1) return { label: 'Advanced', color: 'text-purple-600' };
    return { label: 'Expert', color: 'text-red-600' };
  };

  // Load initial question on mount
  useEffect(() => {
    loadNextQuestion();
  }, []);

  const abilityInfo = getAbilityLabel(sessionStats.userAbility);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      {showConfetti && <Confetti />}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                      {currentQuestion.options?.map((option, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => !showExplanation && setSelectedAnswer(option.value)}
                          disabled={showExplanation}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                            showExplanation
                              ? option.value === currentQuestion.correct_answer
                                ? 'border-green-500 bg-green-50'
                                : option.value === selectedAnswer
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-200'
                              : selectedAnswer === option.value
                              ? 'border-indigo-500 bg-indigo-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center">
                            <span className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-semibold text-sm">
                              {String.fromCharCode(65 + index)}
                            </span>
                            <span className="ml-3 text-gray-900">{option.text}</span>
                            {showExplanation && (
                              <span className="ml-auto">
                                {option.value === currentQuestion.correct_answer ? (
                                  <CheckCircleIcon className="h-6 w-6 text-green-500" />
                                ) : option.value === selectedAnswer ? (
                                  <XCircleIcon className="h-6 w-6 text-red-500" />
                                ) : null}
                              </span>
                            )}
                          </div>
                        </motion.button>
                      ))}
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
                        onClick={loadNextQuestion}
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
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                  End Session & View Report
                </button>
              </div>
            </motion.div>

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
};

export default PracticeMode;
