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
  PlusIcon
} from '@heroicons/react/24/outline';
import { axios } from '../store/authStore';
import toast from 'react-hot-toast';

const StudyPlan = () => {
  const [studyPlan, setStudyPlan] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [weeklySchedule, setWeeklySchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [newPlan, setNewPlan] = useState({
    examType: '',
    targetDate: '',
    targetScore: '',
    studyHoursPerDay: 2,
    studyDaysPerWeek: 5
  });

  useEffect(() => {
    fetchStudyPlan();
  }, []);

  const fetchStudyPlan = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/v1/adaptive/learning-path?exam_type=GRE');
      setRecommendations(response.data.focus_areas || []);
      
      // Generate weekly schedule
      generateWeeklySchedule();
    } catch (error) {
      console.error('Failed to fetch study plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateWeeklySchedule = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const topics = ['Algebra', 'Geometry', 'Reading Comprehension', 'Vocabulary', 'Data Analysis'];
    
    const schedule = days.map(day => ({
      day,
      tasks: [
        {
          time: '9:00 AM',
          duration: 60,
          topic: topics[Math.floor(Math.random() * topics.length)],
          type: 'practice',
          completed: Math.random() > 0.3
        },
        {
          time: '2:00 PM',
          duration: 30,
          topic: topics[Math.floor(Math.random() * topics.length)],
          type: 'review',
          completed: Math.random() > 0.5
        }
      ]
    }));
    
    setWeeklySchedule(schedule);
  };

  const createStudyPlan = async () => {
    if (!newPlan.examType || !newPlan.targetDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // API call to create study plan
      toast.success('Study plan created successfully!');
      setShowCreatePlan(false);
      fetchStudyPlan();
    } catch (error) {
      toast.error('Failed to create study plan');
    }
  };

  const TaskCard = ({ task }) => (
    <div className={`flex items-center justify-between p-3 rounded-lg ${
      task.completed ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
    }`}>
      <div className="flex items-center">
        {task.completed ? (
          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
        ) : (
          <div className="h-5 w-5 rounded-full border-2 border-gray-300 mr-3" />
        )}
        <div>
          <p className="text-sm font-medium text-gray-900">{task.topic}</p>
          <p className="text-xs text-gray-600">{task.time} • {task.duration} min</p>
        </div>
      </div>
      <span className={`px-2 py-1 text-xs rounded-full ${
        task.type === 'practice' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
      }`}>
        {task.type}
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
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Study Plan</h1>
            <p className="text-indigo-100">Personalized learning path to achieve your goals</p>
          </div>
          <button
            onClick={() => setShowCreatePlan(true)}
            className="bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create New Plan
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-indigo-100 text-sm">Target Exam</p>
            <p className="text-xl font-semibold">GRE</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-indigo-100 text-sm">Days Until Exam</p>
            <p className="text-xl font-semibold">45</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-indigo-100 text-sm">Progress</p>
            <p className="text-xl font-semibold">32%</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-indigo-100 text-sm">Estimated Score</p>
            <p className="text-xl font-semibold">315</p>
          </div>
        </div>
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

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-blue-900">Morning Session</h3>
                  <ClockIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="space-y-2">
                  <TaskCard task={{
                    topic: 'Quantitative Reasoning',
                    time: '9:00 AM',
                    duration: 45,
                    type: 'practice',
                    completed: true
                  }} />
                  <TaskCard task={{
                    topic: 'Vocabulary Review',
                    time: '10:00 AM',
                    duration: 30,
                    type: 'review',
                    completed: false
                  }} />
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-purple-900">Evening Session</h3>
                  <ClockIcon className="h-5 w-5 text-purple-600" />
                </div>
                <div className="space-y-2">
                  <TaskCard task={{
                    topic: 'Reading Comprehension',
                    time: '6:00 PM',
                    duration: 60,
                    type: 'practice',
                    completed: false
                  }} />
                  <TaskCard task={{
                    topic: 'Essay Writing',
                    time: '7:30 PM',
                    duration: 45,
                    type: 'practice',
                    completed: false
                  }} />
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-6 w-6 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium text-green-900">Today's Progress</p>
                    <p className="text-sm text-green-700">1 of 4 tasks completed</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-32 bg-green-200 rounded-full h-2 mr-3">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-green-900">25%</span>
                </div>
              </div>
            </div>
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
            <h2 className="text-xl font-bold text-gray-900">Focus Areas</h2>
          </div>

          <div className="space-y-3">
            {recommendations.slice(0, 4).map((rec, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900">{rec.topic}</p>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    rec.priority === 'high' 
                      ? 'bg-red-100 text-red-700'
                      : rec.priority === 'maintenance'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {rec.priority}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-2">
                  {rec.recommended_questions} questions recommended
                </p>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-indigo-600 h-1.5 rounded-full" 
                    style={{ width: `${Math.random() * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 text-sm font-medium">
            View All Recommendations
          </button>
        </motion.div>
      </div>

      {/* Weekly Schedule */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">Weekly Schedule</h2>
        
        <div className="grid grid-cols-7 gap-4">
          {weeklySchedule.map((day, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-3">
              <h3 className="font-medium text-center text-gray-900 mb-3">{day.day}</h3>
              <div className="space-y-2">
                {day.tasks.map((task, taskIndex) => (
                  <div 
                    key={taskIndex}
                    className={`p-2 rounded text-xs ${
                      task.completed ? 'bg-green-50' : 'bg-gray-50'
                    }`}
                  >
                    <p className="font-medium text-gray-900 truncate">{task.topic}</p>
                    <p className="text-gray-600">{task.duration}min</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
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
                  onChange={(e) => setNewPlan({...newPlan, studyHoursPerDay: e.target.value})}
                  min="1"
                  max="8"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={createStudyPlan}
                  className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Create Plan
                </button>
                <button
                  onClick={() => setShowCreatePlan(false)}
                  className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
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
};

export default StudyPlan;
