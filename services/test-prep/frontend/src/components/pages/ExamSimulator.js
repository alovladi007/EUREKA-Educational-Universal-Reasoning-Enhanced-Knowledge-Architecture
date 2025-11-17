import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ClockIcon, 
  FlagIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  PauseIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { axios } from '../store/authStore';

const ExamSimulator = () => {
  const [examConfig, setExamConfig] = useState({
    examType: '',
    duration: 180,
    questionCount: 50,
    sections: []
  });
  const [examStarted, setExamStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const [results, setResults] = useState(null);

  const examTypes = [
    { id: 'GRE', name: 'GRE General Test', duration: 180, questions: 80 },
    { id: 'GMAT', name: 'GMAT', duration: 187, questions: 80 },
    { id: 'SAT', name: 'SAT', duration: 180, questions: 154 },
    { id: 'PRACTICE', name: 'Practice Test', duration: 60, questions: 30 }
  ];

  useEffect(() => {
    let timer;
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
    return () => clearInterval(timer);
  }, [examStarted, isPaused, timeRemaining, examCompleted]);

  const startExam = async () => {
    if (!examConfig.examType) {
      toast.error('Please select an exam type');
      return;
    }

    try {
      // Load questions for the exam
      const response = await axios.get(`/api/v1/questions?exam_type=${examConfig.examType}&per_page=${examConfig.questionCount}`);
      setQuestions(response.data.questions || []);
      setTimeRemaining(examConfig.duration * 60);
      setExamStarted(true);
      setCurrentQuestion(0);
      toast.success('Exam started! Good luck!');
    } catch (error) {
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
    
    setResults({
      totalQuestions: questions.length,
      correctAnswers: correct,
      incorrectAnswers: questions.length - correct,
      score: score,
      timeTaken: (examConfig.duration * 60) - timeRemaining,
      flaggedQuestions: flaggedQuestions.size
    });

    // Save exam result to backend
    try {
      await axios.post('/api/v1/exams/submit', {
        exam_type: examConfig.examType,
        answers: answers,
        time_taken: (examConfig.duration * 60) - timeRemaining
      });
    } catch (error) {
      console.error('Failed to save exam results');
    }

    toast.success('Exam submitted successfully!');
  };

  const selectAnswer = (questionIndex, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const toggleFlag = (questionIndex) => {
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

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getQuestionStatus = (index) => {
    if (answers[index]) return 'answered';
    if (flaggedQuestions.has(index)) return 'flagged';
    return 'unanswered';
  };

  if (examCompleted && results) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
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
                onClick={() => window.location.href = '/analytics'}
                className="flex-1 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
              >
                View Detailed Analytics
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
              >
                Take Another Test
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
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
                      onClick={() => setExamConfig({
                        examType: exam.id,
                        duration: exam.duration,
                        questionCount: exam.questions
                      })}
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
                      <span className="text-blue-700">Question Navigation:</span>
                      <span className="font-medium text-blue-900">Allowed</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <button
                onClick={startExam}
                disabled={!examConfig.examType}
                className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Start Exam
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Main exam interface
  const currentQ = questions[currentQuestion];
  
  return (
    <div className="min-h-screen bg-gray-50">
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
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              {isPaused ? <PlayIcon className="h-5 w-5" /> : <PauseIcon className="h-5 w-5" />}
            </button>
            
            <div className="flex items-center text-lg font-mono">
              <ClockIcon className="h-5 w-5 mr-2 text-gray-600" />
              <span className={timeRemaining < 300 ? 'text-red-600' : 'text-gray-900'}>
                {formatTime(timeRemaining)}
              </span>
            </div>
            
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to submit the exam?')) {
                  submitExam();
                }
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
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
                  className={`p-2 rounded-lg ${
                    flaggedQuestions.has(currentQuestion)
                      ? 'text-orange-600 bg-orange-50'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <FlagIcon className="h-5 w-5" />
                </button>
              </div>

              <p className="text-lg text-gray-900 mb-6">{currentQ.question_text}</p>

              <div className="space-y-3">
                {currentQ.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => selectAnswer(currentQuestion, option.value)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      answers[currentQuestion] === option.value
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
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
                  className="flex items-center px-4 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50"
                >
                  <ArrowLeftIcon className="h-5 w-5 mr-2" />
                  Previous
                </button>
                <button
                  onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
                  disabled={currentQuestion === questions.length - 1}
                  className="flex items-center px-4 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50"
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
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Question Navigator</h4>
            
            <div className="grid grid-cols-5 gap-2 mb-6">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`
                    aspect-square rounded text-sm font-medium transition-all
                    ${currentQuestion === index ? 'ring-2 ring-indigo-500' : ''}
                    ${getQuestionStatus(index) === 'answered' ? 'bg-green-500 text-white' : ''}
                    ${getQuestionStatus(index) === 'flagged' ? 'bg-orange-500 text-white' : ''}
                    ${getQuestionStatus(index) === 'unanswered' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : ''}
                  `}
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
};

export default ExamSimulator;
