import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserCircleIcon,
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  AcademicCapIcon,
  ChartBarIcon,
  TrophyIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
    username: user?.username || '',
    educationLevel: user?.education_level || '',
    targetExams: user?.target_exams || [],
    dailyGoal: user?.daily_goal_minutes || 30,
    bio: user?.bio || ''
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    dailyReminders: true,
    weeklyReports: true,
    achievementAlerts: true
  });

  const handleSaveProfile = async () => {
    const success = await updateProfile(profileData);
    if (success) {
      setEditMode(false);
      toast.success('Profile updated successfully!');
    }
  };

  const achievements = [
    { id: 1, name: 'First Steps', description: 'Complete your first question', icon: '🎯', unlocked: true },
    { id: 2, name: 'Week Warrior', description: '7-day streak', icon: '🔥', unlocked: true },
    { id: 3, name: 'Century Club', description: 'Answer 100 questions', icon: '💯', unlocked: true },
    { id: 4, name: 'Perfect Score', description: '100% accuracy in a session', icon: '⭐', unlocked: false },
    { id: 5, name: 'Speed Demon', description: 'Complete 50 questions in 30 minutes', icon: '⚡', unlocked: false },
    { id: 6, name: 'Master Mind', description: 'Reach Expert level', icon: '🧠', unlocked: false }
  ];

  const stats = {
    totalQuestions: user?.total_questions_answered || 0,
    accuracy: user?.overall_accuracy ? (user.overall_accuracy * 100).toFixed(1) : 0,
    streak: user?.current_streak_days || 0,
    studyTime: user?.total_study_time_minutes || 0,
    rank: '#1,234',
    percentile: '85th'
  };

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center px-4 py-2 rounded-lg transition-all ${
        activeTab === id
          ? 'bg-indigo-600 text-white'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon className="h-5 w-5 mr-2" />
      {label}
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-20 w-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
              {user?.full_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
            </div>
            <div className="ml-6">
              <h1 className="text-3xl font-bold">{user?.full_name || user?.username}</h1>
              <p className="text-indigo-100">@{user?.username}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  {user?.is_premium ? 'Premium' : 'Free'} Member
                </span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  Level: {user?.education_level || 'Not set'}
                </span>
              </div>
            </div>
          </div>
          {!user?.is_premium && (
            <button className="bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg hover:bg-yellow-400 font-semibold">
              Upgrade to Premium
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-md p-2 flex gap-2 overflow-x-auto">
        <TabButton id="profile" label="Profile" icon={UserCircleIcon} />
        <TabButton id="achievements" label="Achievements" icon={TrophyIcon} />
        <TabButton id="statistics" label="Statistics" icon={ChartBarIcon} />
        <TabButton id="settings" label="Settings" icon={CogIcon} />
        <TabButton id="security" label="Security" icon={ShieldCheckIcon} />
        <TabButton id="billing" label="Billing" icon={CreditCardIcon} />
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-8"
      >
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleSaveProfile}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                  disabled={!editMode}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={profileData.username}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Education Level
                </label>
                <select
                  value={profileData.educationLevel}
                  onChange={(e) => setProfileData({...profileData, educationLevel: e.target.value})}
                  disabled={!editMode}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                >
                  <option value="high_school">High School</option>
                  <option value="undergraduate">Undergraduate</option>
                  <option value="graduate">Graduate</option>
                  <option value="professional">Professional</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  disabled={!editMode}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Daily Study Goal (minutes)
                </label>
                <input
                  type="number"
                  value={profileData.dailyGoal}
                  onChange={(e) => setProfileData({...profileData, dailyGoal: e.target.value})}
                  disabled={!editMode}
                  min="10"
                  max="240"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Achievements</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map(achievement => (
                <motion.div
                  key={achievement.id}
                  whileHover={{ scale: 1.05 }}
                  className={`p-4 rounded-xl border-2 ${
                    achievement.unlocked
                      ? 'border-yellow-400 bg-yellow-50'
                      : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <span className="text-3xl mr-3">{achievement.icon}</span>
                    {achievement.unlocked && (
                      <CheckIcon className="h-5 w-5 text-green-600 ml-auto" />
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900">{achievement.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'statistics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Statistics</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <p className="text-3xl font-bold text-blue-600">{stats.totalQuestions}</p>
                <p className="text-sm text-gray-600 mt-1">Total Questions</p>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-xl">
                <p className="text-3xl font-bold text-green-600">{stats.accuracy}%</p>
                <p className="text-sm text-gray-600 mt-1">Accuracy</p>
              </div>
              <div className="text-center p-6 bg-orange-50 rounded-xl">
                <p className="text-3xl font-bold text-orange-600">{stats.streak} days</p>
                <p className="text-sm text-gray-600 mt-1">Current Streak</p>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-xl">
                <p className="text-3xl font-bold text-purple-600">{Math.round(stats.studyTime / 60)}h</p>
                <p className="text-sm text-gray-600 mt-1">Study Time</p>
              </div>
              <div className="text-center p-6 bg-indigo-50 rounded-xl">
                <p className="text-3xl font-bold text-indigo-600">{stats.rank}</p>
                <p className="text-sm text-gray-600 mt-1">Global Rank</p>
              </div>
              <div className="text-center p-6 bg-pink-50 rounded-xl">
                <p className="text-3xl font-bold text-pink-600">{stats.percentile}</p>
                <p className="text-sm text-gray-600 mt-1">Percentile</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Settings</h2>
            
            <div className="space-y-4">
              {Object.entries(preferences).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {key === 'emailNotifications' && 'Receive updates via email'}
                      {key === 'pushNotifications' && 'Browser push notifications'}
                      {key === 'dailyReminders' && 'Daily study reminders'}
                      {key === 'weeklyReports' && 'Weekly progress reports'}
                      {key === 'achievementAlerts' && 'Achievement unlock notifications'}
                    </p>
                  </div>
                  <button
                    onClick={() => setPreferences({...preferences, [key]: !value})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      value ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Change Password</h3>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  Update Password
                </button>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-600 mb-3">Add an extra layer of security to your account</p>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Enable 2FA
                </button>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Active Sessions</h3>
                <p className="text-sm text-gray-600 mb-3">Manage your active sessions across devices</p>
                <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                  View Sessions
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Billing & Subscription</h2>
            
            {user?.is_premium ? (
              <div className="p-6 bg-green-50 rounded-xl">
                <h3 className="text-xl font-semibold text-green-900 mb-2">Premium Subscription Active</h3>
                <p className="text-green-700 mb-4">Your premium subscription is active until December 31, 2024</p>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  Cancel Subscription
                </button>
              </div>
            ) : (
              <div className="p-6 bg-blue-50 rounded-xl">
                <h3 className="text-xl font-semibold text-blue-900 mb-2">Upgrade to Premium</h3>
                <p className="text-blue-700 mb-4">Get unlimited access to all questions and features</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-white rounded-lg border-2 border-blue-300">
                    <p className="font-semibold text-lg">Monthly</p>
                    <p className="text-2xl font-bold text-blue-600">$19.99</p>
                    <p className="text-sm text-gray-600">per month</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border-2 border-green-300">
                    <p className="font-semibold text-lg">Annual</p>
                    <p className="text-2xl font-bold text-green-600">$199.99</p>
                    <p className="text-sm text-gray-600">per year (save 20%)</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border-2 border-purple-300">
                    <p className="font-semibold text-lg">Lifetime</p>
                    <p className="text-2xl font-bold text-purple-600">$499.99</p>
                    <p className="text-sm text-gray-600">one-time payment</p>
                  </div>
                </div>
                <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold">
                  Choose Plan
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Profile;
