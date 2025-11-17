'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarIcon,
  ClockIcon,
  ChartBarIcon,
  LightBulbIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  SparklesIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';
import { apiClient } from '@/lib/api-client';

interface Task {
  time: string;
  duration: number;
  topic: string;
  type: 'practice' | 'review' | 'ai_generated';
  completed: boolean;
  question_count?: number;
  difficulty?: string;
}

interface DaySchedule {
  day: string;
  tasks: Task[];
  total_time: number;
}

interface Recommendation {
  id?: string;
  topic: string;
  priority: string;
  recommended_questions: number;
  title?: string;
  description?: string;
  estimated_impact?: string;
  time_required?: string;
}

interface NewPlan {
  examType: string;
  targetDate: string;
  targetScore: string;
  studyHoursPerDay: number;
  studyDaysPerWeek: number;
}

interface StudyPlan {
  id?: string;
  exam_type: string;
  target_date: string;
  target_score: number;
  current_score: number;
  days_until_exam: number;
  progress: number;
  estimated_score?: number;
  weekly_schedule?: any;
}

export default function StudyPlanPage() {
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [weeklySchedule, setWeeklySchedule] = useState<DaySchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<any>(null);
  const [examType, setExamType] = useState('GRE');
  const [newPlan, setNewPlan] = useState<NewPlan>({
    examType: '',
    targetDate: '',
    targetScore: '',
    studyHoursPerDay: 2,
    studyDaysPerWeek: 5
  });

  useEffect(() => {
    fetchStudyPlan();
  }, [examType]);

  const fetchStudyPlan = async () => {
    setLoading(true);
    try {
      // Use working endpoints with proper error handling
      const [learningPathRes, statsRes, progressRes] = await Promise.all([
        apiClient.getAdaptiveLearningPath(examType).catch(e => {
          console.error('Learning path error:', e);
          return { focus_areas: [] };
        }),
        apiClient.getUserStats().catch(e => {
          console.error('Stats error:', e);
          return {};
        }),
        apiClient.getUserProgress().catch(e => {
          console.error('Progress error:', e);
          return { data: {} };
        })
      ]);

      // Try to get AI recommendations (new endpoint - may fail)
      let aiRecommendations: Recommendation[] = [];
      try {
        const recRes = await apiClient.getRecommendations(examType);
        aiRecommendations = (recRes.recommendations || []).map((rec: any) => ({
          id: rec.id,
          topic: rec.title || rec.topic,
          priority: rec.priority || 'medium',
          recommended_questions: 20,
          title: rec.title,
          description: rec.description,
          estimated_impact: rec.estimated_impact,
          time_required: rec.time_required
        }));
      } catch (error) {
        console.log('AI recommendations not available, using learning path');
      }

      // Set recommendations from AI or learning path
      const focusAreas = learningPathRes.data?.focus_areas || learningPathRes.focus_areas || [];
      if (aiRecommendations.length > 0) {
        setRecommendations(aiRecommendations);
      } else if (focusAreas.length > 0) {
        setRecommendations(focusAreas.map((area: any) => ({
          topic: area.topic || 'Practice',
          priority: area.priority || 'medium',
          recommended_questions: area.recommended_questions || 20
        })));
      } else {
        setRecommendations([
          { topic: 'Quantitative Reasoning', priority: 'high', recommended_questions: 30 },
          { topic: 'Verbal Reasoning', priority: 'high', recommended_questions: 25 },
          { topic: 'Analytical Writing', priority: 'medium', recommended_questions: 15 }
        ]);
      }

      // Try to get predictions for estimated score
      try {
        const predRes = await apiClient.getPredictions(examType);
        setPredictions(predRes);

        setStudyPlan({
          exam_type: examType,
          target_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
          target_score: 320,
          current_score: statsRes.overall_accuracy ? Math.round(statsRes.overall_accuracy * 340) : 300,
          days_until_exam: 45,
          progress: progressRes.data?.overall_progress || 32,
          estimated_score: predRes.exam_score?.expected || 315
        });
      } catch (error) {
        console.log('Predictions not available, using defaults');
        setStudyPlan({
          exam_type: examType,
          target_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
          target_score: 320,
          current_score: statsRes.overall_accuracy ? Math.round(statsRes.overall_accuracy * 340) : 300,
          days_until_exam: 45,
          progress: progressRes.data?.overall_progress || 32,
          estimated_score: 315
        });
      }

      // Try to get AI insights
      try {
        const insightsRes = await apiClient.getInsights(examType);
        setAiInsights((insightsRes.insights || []).slice(0, 3));
      } catch (error) {
        console.log('AI insights not available');
      }

      // Generate weekly schedule based on recommendations
      generateAIWeeklySchedule(focusAreas.length > 0 ? focusAreas : recommendations);
    } catch (error) {
      console.error('Failed to fetch study plan:', error);

      // Set default values on error
      setStudyPlan({
        exam_type: examType,
        target_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        target_score: 320,
        current_score: 300,
        days_until_exam: 45,
        progress: 0,
        estimated_score: 300
      });

      setRecommendations([
        { topic: 'Quantitative Reasoning', priority: 'high', recommended_questions: 30 },
        { topic: 'Verbal Reasoning', priority: 'high', recommended_questions: 25 }
      ]);

      generateAIWeeklySchedule([]);
    } finally {
      setLoading(false);
    }
  };

  const generateAIWeeklySchedule = (focusAreas: any[]) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // Create AI-generated schedule based on focus areas and priorities
    const schedule = days.map((day, dayIndex) => {
      const tasks: Task[] = [];
      const isDayOff = dayIndex === 6; // Sunday off

      if (!isDayOff) {
        // Morning session - High priority topics
        const highPriorityTopics = focusAreas.filter((area: any) => area.priority === 'high');
        if (highPriorityTopics.length > 0) {
          const topic = highPriorityTopics[dayIndex % highPriorityTopics.length];
          tasks.push({
            time: '9:00 AM',
            duration: 60,
            topic: topic.topic || 'Practice',
            type: 'practice' as const,
            completed: dayIndex < 2, // Mark past days as completed
            question_count: Math.min(topic.recommended_questions || 20, 25),
            difficulty: 'medium'
          });
        }

        // Mid-day review
        if (dayIndex % 2 === 0) {
          tasks.push({
            time: '1:00 PM',
            duration: 30,
            topic: 'Mixed Review',
            type: 'review' as const,
            completed: dayIndex < 2,
            question_count: 10
          });
        }

        // Evening session - Medium/Low priority
        const otherTopics = focusAreas.filter((area: any) => area.priority !== 'high');
        if (otherTopics.length > 0 && dayIndex < 5) {
          const topic = otherTopics[dayIndex % otherTopics.length];
          tasks.push({
            time: '6:00 PM',
            duration: 45,
            topic: topic.topic || 'Practice',
            type: dayIndex % 3 === 0 ? 'ai_generated' : 'practice',
            completed: dayIndex < 2,
            question_count: topic.recommended_questions || 15,
            difficulty: 'adaptive'
          });
        }
      }

      return {
        day,
        tasks,
        total_time: tasks.reduce((sum, task) => sum + task.duration, 0)
      };
    });

    setWeeklySchedule(schedule);
  };

  const createStudyPlan = async () => {
    if (!newPlan.examType || !newPlan.targetDate || !newPlan.targetScore) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const toastId = toast.loading('Generating AI-powered study plan...');

      // Call AI study plan generation
      const response = await apiClient.generateStudyPlan({
        exam_type: newPlan.examType,
        target_date: newPlan.targetDate,
        target_score: parseInt(newPlan.targetScore),
        current_score: studyPlan?.current_score || 0,
        weak_areas: recommendations.filter(r => r.priority === 'high').map(r => r.topic),
        available_hours: newPlan.studyHoursPerDay * newPlan.studyDaysPerWeek
      });

      toast.success('AI study plan created successfully!', { id: toastId });
      setShowCreatePlan(false);
      setExamType(newPlan.examType);
      fetchStudyPlan();
    } catch (error) {
      console.error('Failed to create study plan:', error);
      toast.error('Failed to create study plan. Using default plan.');
      setShowCreatePlan(false);
    }
  };

  const TaskCard: React.FC<{ task: Task }> = ({ task }) => (
    <div className={`flex items-center justify-between p-3 rounded-lg ${
      task.completed ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
    }`}>
      <div className="flex items-center flex-1">
        {task.completed ? (
          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
        ) : (
          <div className="h-5 w-5 rounded-full border-2 border-gray-300 mr-3" />
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-900">{task.topic}</p>
            {task.type === 'ai_generated' && (
              <SparklesIcon className="h-4 w-4 text-purple-500" title="AI Generated" />
            )}
          </div>
          <p className="text-xs text-gray-600">
            {task.time} • {task.duration} min
            {task.question_count && ` • ${task.question_count} questions`}
          </p>
        </div>
      </div>
      <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
        task.type === 'practice' ? 'bg-blue-100 text-blue-700' :
        task.type === 'ai_generated' ? 'bg-purple-100 text-purple-700' :
        'bg-indigo-100 text-indigo-700'
      }`}>
        {task.type === 'ai_generated' ? 'AI' : task.type}
      </span>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">Your AI Study Plan</h1>
              <SparklesIcon className="h-8 w-8 text-yellow-300" />
            </div>
            <p className="text-indigo-100">AI-powered personalized learning path to achieve your goals</p>
          </div>
          <button
            onClick={() => setShowCreatePlan(true)}
            className="bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 flex items-center transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create New Plan
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-indigo-100 text-sm">Target Exam</p>
            <p className="text-xl font-semibold">{studyPlan?.exam_type || examType}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-indigo-100 text-sm">Days Until Exam</p>
            <p className="text-xl font-semibold">{studyPlan?.days_until_exam || 45}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-indigo-100 text-sm">Progress</p>
            <div className="flex items-center gap-2">
              <p className="text-xl font-semibold">{studyPlan?.progress || 0}%</p>
              {studyPlan && studyPlan.progress > 0 && (
                <ArrowTrendingUpIcon className="h-5 w-5 text-green-300" />
              )}
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-indigo-100 text-sm">Estimated Score</p>
            <div className="flex items-center gap-2">
              <p className="text-xl font-semibold">{studyPlan?.estimated_score || 300}</p>
              {predictions && (
                <span className="text-xs text-indigo-200">
                  Target: {studyPlan?.target_score || 320}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* AI Insights Row */}
        {aiInsights.length > 0 && (
          <div className="mt-4 flex gap-3 overflow-x-auto">
            {aiInsights.map((insight, idx) => (
              <div
                key={idx}
                className="bg-white/10 rounded-lg p-3 min-w-[250px] backdrop-blur-sm"
              >
                <div className="flex items-center gap-2 mb-1">
                  <LightBulbIcon className="h-4 w-4 text-yellow-300" />
                  <p className="text-sm font-medium">{insight.title}</p>
                </div>
                <p className="text-xs text-indigo-100">{insight.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Today's Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Today's Tasks</h2>
              <span className="text-sm text-gray-600">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </span>
            </div>

            {(() => {
              const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
              const todaySchedule = weeklySchedule.find(day => day.day === today);
              const tasks = todaySchedule?.tasks || [];
              const morningTasks = tasks.filter(t => parseInt(t.time) < 12);
              const eveningTasks = tasks.filter(t => parseInt(t.time) >= 12);
              const completedCount = tasks.filter(t => t.completed).length;
              const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

              return (
                <>
                  <div className="space-y-4">
                    {morningTasks.length > 0 && (
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-medium text-blue-900">Morning Session</h3>
                          <ClockIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="space-y-2">
                          {morningTasks.map((task, idx) => (
                            <TaskCard key={idx} task={task} />
                          ))}
                        </div>
                      </div>
                    )}

                    {eveningTasks.length > 0 && (
                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-medium text-purple-900">Afternoon/Evening Session</h3>
                          <ClockIcon className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="space-y-2">
                          {eveningTasks.map((task, idx) => (
                            <TaskCard key={idx} task={task} />
                          ))}
                        </div>
                      </div>
                    )}

                    {tasks.length === 0 && (
                      <div className="p-8 text-center text-gray-500">
                        <CalendarIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                        <p>No tasks scheduled for today. Enjoy your rest day!</p>
                      </div>
                    )}
                  </div>

                  {tasks.length > 0 && (
                    <div className="mt-6 p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CheckCircleIcon className="h-6 w-6 text-green-600 mr-3" />
                          <div>
                            <p className="font-medium text-green-900">Today's Progress</p>
                            <p className="text-sm text-green-700">
                              {completedCount} of {tasks.length} tasks completed
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-32 bg-green-200 rounded-full h-2 mr-3">
                            <div
                              className="bg-green-600 h-2 rounded-full transition-all"
                              style={{ width: `${progressPercent}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-green-900">{progressPercent}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </motion.div>
        </div>

        {/* Focus Areas */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center mb-4">
            <LightBulbIcon className="h-6 w-6 text-yellow-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">AI Focus Areas</h2>
          </div>

          <div className="space-y-3">
            {recommendations.length > 0 ? (
              recommendations.slice(0, 5).map((rec, index) => (
                <div key={rec.id || index} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{rec.topic}</p>
                      {rec.title && rec.title !== rec.topic && (
                        <SparklesIcon className="h-4 w-4 text-purple-500" title="AI Recommendation" />
                      )}
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      rec.priority === 'high'
                        ? 'bg-red-100 text-red-700'
                        : rec.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : rec.priority === 'maintenance'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {rec.priority}
                    </span>
                  </div>

                  {rec.description && (
                    <p className="text-xs text-gray-600 mb-2">{rec.description}</p>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                    <span>{rec.recommended_questions} questions</span>
                    {rec.estimated_impact && (
                      <span className="text-green-600 font-medium">+{rec.estimated_impact}</span>
                    )}
                  </div>

                  {rec.time_required && (
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <ClockIcon className="h-3 w-3 mr-1" />
                      <span>{rec.time_required}</span>
                    </div>
                  )}

                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        rec.priority === 'high' ? 'bg-red-600' :
                        rec.priority === 'medium' ? 'bg-yellow-600' :
                        'bg-indigo-600'
                      }`}
                      style={{ width: `${rec.priority === 'high' ? 80 : rec.priority === 'medium' ? 50 : 30}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-gray-500">
                <LightBulbIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p className="text-sm">Complete practice sessions to get AI-powered personalized recommendations</p>
              </div>
            )}
          </div>

          {recommendations.length > 5 && (
            <button className="w-full mt-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 text-sm font-medium transition-colors">
              View All {recommendations.length} Recommendations
            </button>
          )}
        </motion.div>
      </div>

      {/* Weekly Schedule */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Weekly Schedule</h2>
          <div className="text-sm text-gray-600">
            Total: {weeklySchedule.reduce((sum, day) => sum + day.total_time, 0)} minutes/week
          </div>
        </div>

        <div className="grid grid-cols-7 gap-4">
          {weeklySchedule.map((day, index) => {
            const isToday = day.day === new Date().toLocaleDateString('en-US', { weekday: 'long' });
            const completedTasks = day.tasks.filter(t => t.completed).length;
            const totalTasks = day.tasks.length;

            return (
              <div
                key={index}
                className={`border rounded-lg p-3 ${
                  isToday
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="mb-3">
                  <h3 className={`font-medium text-center ${
                    isToday ? 'text-indigo-900' : 'text-gray-900'
                  }`}>
                    {day.day}
                  </h3>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <ClockIcon className="h-3 w-3 text-gray-500" />
                    <p className="text-xs text-gray-600">{day.total_time}min</p>
                  </div>
                  {totalTasks > 0 && (
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                      <div
                        className="bg-green-600 h-1 rounded-full transition-all"
                        style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {day.tasks.length > 0 ? (
                    day.tasks.map((task, taskIndex) => (
                      <div
                        key={taskIndex}
                        className={`p-2 rounded text-xs relative ${
                          task.completed ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                        }`}
                      >
                        {task.type === 'ai_generated' && (
                          <SparklesIcon className="h-3 w-3 text-purple-500 absolute top-1 right-1" />
                        )}
                        <p className="font-medium text-gray-900 truncate pr-4">{task.topic}</p>
                        <p className="text-gray-600">{task.duration}min</p>
                        {task.question_count && (
                          <p className="text-gray-500 text-xs">{task.question_count} Qs</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-400">
                      <p className="text-xs">Rest Day</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Study Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-6"
        >
          <ChartBarIcon className="h-8 w-8 text-purple-600 mb-3" />
          <h3 className="font-semibold text-purple-900 mb-2">Track Progress</h3>
          <p className="text-sm text-purple-800">
            Review your performance analytics weekly to identify improvement areas.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl p-6"
        >
          <AcademicCapIcon className="h-8 w-8 text-blue-600 mb-3" />
          <h3 className="font-semibold text-blue-900 mb-2">Practice Daily</h3>
          <p className="text-sm text-blue-800">
            Consistency is key. Even 30 minutes daily is better than weekend cramming.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl p-6"
        >
          <LightBulbIcon className="h-8 w-8 text-green-600 mb-3" />
          <h3 className="font-semibold text-green-900 mb-2">Review Mistakes</h3>
          <p className="text-sm text-green-800">
            Learn from incorrect answers. Understanding why is more important than the score.
          </p>
        </motion.div>
      </div>

      {/* Create Plan Modal */}
      {showCreatePlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full m-4"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Create Study Plan</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Exam
                </label>
                <select
                  value={newPlan.examType}
                  onChange={(e) => setNewPlan({...newPlan, examType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select exam</option>
                  <option value="GRE">GRE</option>
                  <option value="GMAT">GMAT</option>
                  <option value="SAT">SAT</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Date
                </label>
                <input
                  type="date"
                  value={newPlan.targetDate}
                  onChange={(e) => setNewPlan({...newPlan, targetDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Score
                </label>
                <input
                  type="number"
                  value={newPlan.targetScore}
                  onChange={(e) => setNewPlan({...newPlan, targetScore: e.target.value})}
                  placeholder="e.g., 320 for GRE"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Study Hours per Day
                </label>
                <input
                  type="number"
                  value={newPlan.studyHoursPerDay}
                  onChange={(e) => setNewPlan({...newPlan, studyHoursPerDay: parseInt(e.target.value)})}
                  min="1"
                  max="8"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={createStudyPlan}
                  className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Create Plan
                </button>
                <button
                  onClick={() => setShowCreatePlan(false)}
                  className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
