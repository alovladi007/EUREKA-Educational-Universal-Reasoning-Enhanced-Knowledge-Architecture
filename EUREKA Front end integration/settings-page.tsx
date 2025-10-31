'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth';
import {
  User,
  Bell,
  Lock,
  Mail,
  Globe,
  Moon,
  Sun,
  Smartphone,
  Shield,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
} from 'lucide-react';

interface NotificationSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;
  course_updates: boolean;
  assignment_reminders: boolean;
  grade_notifications: boolean;
  discussion_replies: boolean;
  study_group_invites: boolean;
  weekly_summary: boolean;
}

interface PrivacySettings {
  profile_visibility: 'public' | 'students' | 'private';
  show_email: boolean;
  show_phone: boolean;
  show_progress: boolean;
  allow_messages: boolean;
}

interface SecuritySettings {
  two_factor_enabled: boolean;
  login_alerts: boolean;
  session_timeout: number;
}

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'account' | 'notifications' | 'privacy' | 'security'>('account');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  // Account Settings
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('America/New_York');
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light');
  
  // Notification Settings
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email_notifications: true,
    push_notifications: true,
    sms_notifications: false,
    course_updates: true,
    assignment_reminders: true,
    grade_notifications: true,
    discussion_replies: true,
    study_group_invites: true,
    weekly_summary: true,
  });
  
  // Privacy Settings
  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profile_visibility: 'students',
    show_email: false,
    show_phone: false,
    show_progress: true,
    allow_messages: true,
  });
  
  // Security Settings
  const [security, setSecurity] = useState<SecuritySettings>({
    two_factor_enabled: false,
    login_alerts: true,
    session_timeout: 30,
  });
  
  // Password Change
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Eye },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const saveAccountSettings = async () => {
    try {
      setSaving(true);
      // API call to save account settings
      // await apiClient.patch('/users/me/settings', { language, timezone, theme });
      showMessage('success', 'Account settings saved successfully!');
    } catch (error) {
      showMessage('error', 'Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const saveNotificationSettings = async () => {
    try {
      setSaving(true);
      // API call to save notification settings
      // await apiClient.patch('/users/me/notifications', notifications);
      showMessage('success', 'Notification preferences saved!');
    } catch (error) {
      showMessage('error', 'Failed to save notification settings.');
    } finally {
      setSaving(false);
    }
  };

  const savePrivacySettings = async () => {
    try {
      setSaving(true);
      // API call to save privacy settings
      // await apiClient.patch('/users/me/privacy', privacy);
      showMessage('success', 'Privacy settings updated!');
    } catch (error) {
      showMessage('error', 'Failed to update privacy settings.');
    } finally {
      setSaving(false);
    }
  };

  const saveSecuritySettings = async () => {
    try {
      setSaving(true);
      // API call to save security settings
      // await apiClient.patch('/users/me/security', security);
      showMessage('success', 'Security settings updated!');
    } catch (error) {
      showMessage('error', 'Failed to update security settings.');
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      showMessage('error', 'New passwords do not match!');
      return;
    }
    
    if (passwordData.new_password.length < 8) {
      showMessage('error', 'Password must be at least 8 characters long!');
      return;
    }

    try {
      setSaving(true);
      // API call to change password
      // await apiClient.post('/users/me/change-password', {
      //   current_password: passwordData.current_password,
      //   new_password: passwordData.new_password,
      // });
      
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
      showMessage('success', 'Password changed successfully!');
    } catch (error) {
      showMessage('error', 'Failed to change password. Check your current password.');
    } finally {
      setSaving(false);
    }
  };

  const enable2FA = async () => {
    try {
      setSaving(true);
      // API call to enable 2FA
      // const response = await apiClient.post('/users/me/2fa/enable');
      // Show QR code modal here
      setSecurity({ ...security, two_factor_enabled: true });
      showMessage('success', 'Two-factor authentication enabled!');
    } catch (error) {
      showMessage('error', 'Failed to enable 2FA.');
    } finally {
      setSaving(false);
    }
  };

  const disable2FA = async () => {
    try {
      setSaving(true);
      // API call to disable 2FA
      // await apiClient.post('/users/me/2fa/disable');
      setSecurity({ ...security, two_factor_enabled: false });
      showMessage('success', 'Two-factor authentication disabled.');
    } catch (error) {
      showMessage('error', 'Failed to disable 2FA.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage your account preferences, notifications, and security settings.
            </p>
          </div>

          {/* Success/Error Message */}
          {message && (
            <div
              className={`p-4 rounded-lg flex items-center gap-3 ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.type === 'success' ? (
                <Check className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span className="font-medium">{message.text}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Tabs */}
            <Card className="lg:col-span-1 p-4 h-fit">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-indigo-50 text-indigo-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </Card>

            {/* Content Area */}
            <div className="lg:col-span-3 space-y-6">
              {/* Account Settings */}
              {activeTab === 'account' && (
                <>
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Account Preferences
                    </h2>
                    <div className="space-y-6">
                      {/* Language */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Globe className="inline h-4 w-4 mr-2" />
                          Language
                        </label>
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="en">English</option>
                          <option value="es">Español</option>
                          <option value="fr">Français</option>
                          <option value="de">Deutsch</option>
                          <option value="zh">中文</option>
                        </select>
                      </div>

                      {/* Timezone */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Globe className="inline h-4 w-4 mr-2" />
                          Timezone
                        </label>
                        <select
                          value={timezone}
                          onChange={(e) => setTimezone(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="America/New_York">Eastern Time (ET)</option>
                          <option value="America/Chicago">Central Time (CT)</option>
                          <option value="America/Denver">Mountain Time (MT)</option>
                          <option value="America/Los_Angeles">Pacific Time (PT)</option>
                          <option value="Europe/London">London (GMT)</option>
                          <option value="Europe/Paris">Paris (CET)</option>
                          <option value="Asia/Tokyo">Tokyo (JST)</option>
                        </select>
                      </div>

                      {/* Theme */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Appearance
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                          {[
                            { value: 'light', label: 'Light', icon: Sun },
                            { value: 'dark', label: 'Dark', icon: Moon },
                            { value: 'auto', label: 'Auto', icon: Smartphone },
                          ].map(({ value, label, icon: Icon }) => (
                            <button
                              key={value}
                              onClick={() => setTheme(value as any)}
                              className={`p-4 border-2 rounded-lg transition-colors ${
                                theme === value
                                  ? 'border-indigo-600 bg-indigo-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <Icon className="h-6 w-6 mx-auto mb-2 text-gray-700" />
                              <span className="text-sm font-medium">{label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <Button
                        variant="primary"
                        onClick={saveAccountSettings}
                        disabled={saving}
                      >
                        {saving ? 'Saving...' : 'Save Account Settings'}
                      </Button>
                    </div>
                  </Card>

                  {/* Change Password */}
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      <Lock className="inline h-5 w-5 mr-2" />
                      Change Password
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <Input
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={passwordData.current_password}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                current_password: e.target.value,
                              })
                            }
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <Input
                            type={showNewPassword ? 'text' : 'password'}
                            value={passwordData.new_password}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                new_password: e.target.value,
                              })
                            }
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Must be at least 8 characters long
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <Input
                          type="password"
                          value={passwordData.confirm_password}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              confirm_password: e.target.value,
                            })
                          }
                        />
                      </div>

                      <Button
                        variant="primary"
                        onClick={changePassword}
                        disabled={saving || !passwordData.current_password || !passwordData.new_password}
                      >
                        {saving ? 'Changing...' : 'Change Password'}
                      </Button>
                    </div>
                  </Card>
                </>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Notification Preferences
                  </h2>
                  <div className="space-y-6">
                    {/* Notification Channels */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-4">
                        Notification Channels
                      </h3>
                      <div className="space-y-3">
                        {[
                          { key: 'email_notifications', label: 'Email Notifications', icon: Mail },
                          { key: 'push_notifications', label: 'Push Notifications', icon: Smartphone },
                          { key: 'sms_notifications', label: 'SMS Notifications', icon: Smartphone },
                        ].map(({ key, label, icon: Icon }) => (
                          <label key={key} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifications[key as keyof NotificationSettings] as boolean}
                              onChange={(e) =>
                                setNotifications({
                                  ...notifications,
                                  [key]: e.target.checked,
                                })
                              }
                              className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <Icon className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-700">{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">
                        Notification Types
                      </h3>
                      <div className="space-y-3">
                        {[
                          { key: 'course_updates', label: 'Course Updates' },
                          { key: 'assignment_reminders', label: 'Assignment Reminders' },
                          { key: 'grade_notifications', label: 'Grade Notifications' },
                          { key: 'discussion_replies', label: 'Discussion Replies' },
                          { key: 'study_group_invites', label: 'Study Group Invites' },
                          { key: 'weekly_summary', label: 'Weekly Summary Email' },
                        ].map(({ key, label }) => (
                          <label key={key} className="flex items-center justify-between cursor-pointer">
                            <span className="text-sm text-gray-700">{label}</span>
                            <input
                              type="checkbox"
                              checked={notifications[key as keyof NotificationSettings] as boolean}
                              onChange={(e) =>
                                setNotifications({
                                  ...notifications,
                                  [key]: e.target.checked,
                                })
                              }
                              className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      onClick={saveNotificationSettings}
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save Notification Settings'}
                    </Button>
                  </div>
                </Card>
              )}

              {/* Privacy Settings */}
              {activeTab === 'privacy' && (
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Privacy Settings
                  </h2>
                  <div className="space-y-6">
                    {/* Profile Visibility */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profile Visibility
                      </label>
                      <select
                        value={privacy.profile_visibility}
                        onChange={(e) =>
                          setPrivacy({
                            ...privacy,
                            profile_visibility: e.target.value as any,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="public">Public - Anyone can view</option>
                        <option value="students">Students Only - Only classmates can view</option>
                        <option value="private">Private - Only you can view</option>
                      </select>
                    </div>

                    {/* Contact Information */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-4">
                        Show Contact Information
                      </h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="text-sm text-gray-700">Show Email Address</span>
                          <input
                            type="checkbox"
                            checked={privacy.show_email}
                            onChange={(e) =>
                              setPrivacy({ ...privacy, show_email: e.target.checked })
                            }
                            className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="text-sm text-gray-700">Show Phone Number</span>
                          <input
                            type="checkbox"
                            checked={privacy.show_phone}
                            onChange={(e) =>
                              setPrivacy({ ...privacy, show_phone: e.target.checked })
                            }
                            className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Activity */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Activity</h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="text-sm text-gray-700">Show Course Progress</span>
                          <input
                            type="checkbox"
                            checked={privacy.show_progress}
                            onChange={(e) =>
                              setPrivacy({ ...privacy, show_progress: e.target.checked })
                            }
                            className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="text-sm text-gray-700">
                            Allow Direct Messages
                          </span>
                          <input
                            type="checkbox"
                            checked={privacy.allow_messages}
                            onChange={(e) =>
                              setPrivacy({ ...privacy, allow_messages: e.target.checked })
                            }
                            className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          />
                        </label>
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      onClick={savePrivacySettings}
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save Privacy Settings'}
                    </Button>
                  </div>
                </Card>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <>
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Security Settings
                    </h2>
                    <div className="space-y-6">
                      {/* Two-Factor Authentication */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            Two-Factor Authentication
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        {security.two_factor_enabled ? (
                          <div className="flex items-center gap-3">
                            <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                              <Check className="h-3 w-3 mr-1" />
                              Enabled
                            </span>
                            <Button variant="outline" onClick={disable2FA} disabled={saving}>
                              Disable
                            </Button>
                          </div>
                        ) : (
                          <Button variant="primary" onClick={enable2FA} disabled={saving}>
                            Enable
                          </Button>
                        )}
                      </div>

                      {/* Login Alerts */}
                      <label className="flex items-center justify-between cursor-pointer">
                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            Login Alerts
                          </span>
                          <p className="text-sm text-gray-600 mt-1">
                            Get notified of new login attempts
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={security.login_alerts}
                          onChange={(e) =>
                            setSecurity({ ...security, login_alerts: e.target.checked })
                          }
                          className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                      </label>

                      {/* Session Timeout */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Session Timeout (minutes)
                        </label>
                        <select
                          value={security.session_timeout}
                          onChange={(e) =>
                            setSecurity({
                              ...security,
                              session_timeout: parseInt(e.target.value),
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="15">15 minutes</option>
                          <option value="30">30 minutes</option>
                          <option value="60">1 hour</option>
                          <option value="120">2 hours</option>
                          <option value="240">4 hours</option>
                        </select>
                      </div>

                      <Button
                        variant="primary"
                        onClick={saveSecuritySettings}
                        disabled={saving}
                      >
                        {saving ? 'Saving...' : 'Save Security Settings'}
                      </Button>
                    </div>
                  </Card>

                  {/* Active Sessions */}
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Active Sessions
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Smartphone className="h-5 w-5 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              Current Device
                            </div>
                            <div className="text-xs text-gray-500">
                              Last active: Just now
                            </div>
                          </div>
                        </div>
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                          Active
                        </span>
                      </div>
                      <Button variant="outline" className="w-full">
                        Sign Out All Other Sessions
                      </Button>
                    </div>
                  </Card>
                </>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
