"use client";
/**
 * EUREKA - Settings Page
 * User preferences, notifications, privacy, and account settings
 */

import React, { useState } from 'react';
import {
  User,
  Bell,
  Shield,
  Globe,
  Eye,
  Moon,
  Volume2,
  Mail,
  Smartphone,
  Lock,
  Trash2,
  Save
} from 'lucide-react';

interface Settings {
  profile: {
    email: string;
    emailVerified: boolean;
    phone: string;
    language: string;
    timezone: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    assignmentReminders: boolean;
    gradeUpdates: boolean;
    discussionReplies: boolean;
    studyGroupInvites: boolean;
    weeklyDigest: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private';
    showEmail: boolean;
    showProgress: boolean;
    allowMessages: boolean;
    dataSharing: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    fontSize: 'small' | 'medium' | 'large';
    compactMode: boolean;
  };
  accessibility: {
    highContrast: boolean;
    screenReader: boolean;
    captions: boolean;
    keyboardNav: boolean;
  };
}

const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('profile');
  const [settings, setSettings] = useState<Settings>({
    profile: {
      email: 'student@example.com',
      emailVerified: true,
      phone: '+1 (555) 123-4567',
      language: 'en',
      timezone: 'America/New_York'
    },
    notifications: {
      email: true,
      push: true,
      sms: false,
      assignmentReminders: true,
      gradeUpdates: true,
      discussionReplies: true,
      studyGroupInvites: true,
      weeklyDigest: false
    },
    privacy: {
      profileVisibility: 'friends',
      showEmail: false,
      showProgress: true,
      allowMessages: true,
      dataSharing: false
    },
    appearance: {
      theme: 'light',
      fontSize: 'medium',
      compactMode: false
    },
    accessibility: {
      highContrast: false,
      screenReader: false,
      captions: true,
      keyboardNav: false
    }
  });

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleSave = async () => {
    setSaveStatus('saving');
    
    try {
      // In production: await fetch('/api/v1/users/settings', { method: 'PUT', body: JSON.stringify(settings) });
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaveStatus('idle');
    }
  };

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Eye },
    { id: 'accessibility', label: 'Accessibility', icon: Globe }
  ];

  const ProfileSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="flex items-center space-x-2">
              <input
                type="email"
                value={settings.profile.email}
                onChange={e => setSettings({
                  ...settings,
                  profile: { ...settings.profile, email: e.target.value }
                })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {settings.profile.emailVerified && (
                <span className="px-3 py-2 bg-green-100 text-green-800 text-sm font-medium rounded-lg">
                  Verified
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={settings.profile.phone}
              onChange={e => setSettings({
                ...settings,
                profile: { ...settings.profile, phone: e.target.value }
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={settings.profile.language}
                onChange={e => setSettings({
                  ...settings,
                  profile: { ...settings.profile, language: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="zh">中文</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
              <select
                value={settings.profile.timezone}
                onChange={e => setSettings({
                  ...settings,
                  profile: { ...settings.profile, timezone: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">London</option>
                <option value="Europe/Paris">Paris</option>
                <option value="Asia/Tokyo">Tokyo</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Password</h3>
        <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
          <Lock className="w-4 h-4" />
          <span>Change Password</span>
        </button>
      </div>

      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
        <button className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
          <Trash2 className="w-4 h-4" />
          <span>Delete Account</span>
        </button>
      </div>
    </div>
  );

  const NotificationsSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Channels</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive notifications via email</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.email}
                onChange={e => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, email: e.target.checked }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Push Notifications</p>
                <p className="text-sm text-gray-600">Receive browser push notifications</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.push}
                onChange={e => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, push: e.target.checked }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">SMS Notifications</p>
                <p className="text-sm text-gray-600">Receive text message alerts</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.sms}
                onChange={e => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, sms: e.target.checked }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Types</h3>
        <div className="space-y-4">
          {[
            { key: 'assignmentReminders', label: 'Assignment Reminders', desc: 'Get reminded about upcoming assignments' },
            { key: 'gradeUpdates', label: 'Grade Updates', desc: 'Know when new grades are posted' },
            { key: 'discussionReplies', label: 'Discussion Replies', desc: 'New replies to your discussions' },
            { key: 'studyGroupInvites', label: 'Study Group Invites', desc: 'Invitations to join study groups' },
            { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Summary of your activity each week' }
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{item.label}</p>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications[item.key as keyof typeof settings.notifications] as boolean}
                  onChange={e => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, [item.key]: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const PrivacySection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Visibility</h3>
        <select
          value={settings.privacy.profileVisibility}
          onChange={e => setSettings({
            ...settings,
            privacy: { ...settings.privacy, profileVisibility: e.target.value as any }
          })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="public">Public - Anyone can view</option>
          <option value="friends">Friends Only</option>
          <option value="private">Private - Only me</option>
        </select>
      </div>

      <div className="space-y-4">
        {[
          { key: 'showEmail', label: 'Show Email Address', desc: 'Display email on your profile' },
          { key: 'showProgress', label: 'Show Learning Progress', desc: 'Let others see your progress' },
          { key: 'allowMessages', label: 'Allow Direct Messages', desc: 'Receive messages from other users' },
          { key: 'dataSharing', label: 'Data Sharing', desc: 'Share anonymized data for research' }
        ].map(item => (
          <div key={item.key} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{item.label}</p>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.privacy[item.key as keyof typeof settings.privacy] as boolean}
                onChange={e => setSettings({
                  ...settings,
                  privacy: { ...settings.privacy, [item.key]: e.target.checked }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const AppearanceSection = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
        <div className="grid grid-cols-3 gap-4">
          {['light', 'dark', 'auto'].map(theme => (
            <button
              key={theme}
              onClick={() => setSettings({
                ...settings,
                appearance: { ...settings.appearance, theme: theme as any }
              })}
              className={`p-4 border-2 rounded-lg transition-colors ${
                settings.appearance.theme === theme
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <Moon className="w-6 h-6 mx-auto mb-2" />
              <p className="text-sm font-medium capitalize">{theme}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
        <select
          value={settings.appearance.fontSize}
          onChange={e => setSettings({
            ...settings,
            appearance: { ...settings.appearance, fontSize: e.target.value as any }
          })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-gray-900">Compact Mode</p>
          <p className="text-sm text-gray-600">Reduce spacing between elements</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.appearance.compactMode}
            onChange={e => setSettings({
              ...settings,
              appearance: { ...settings.appearance, compactMode: e.target.checked }
            })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  );

  const AccessibilitySection = () => (
    <div className="space-y-4">
      {[
        { key: 'highContrast', label: 'High Contrast', desc: 'Increase color contrast for better visibility' },
        { key: 'screenReader', label: 'Screen Reader Support', desc: 'Optimize for screen reader use' },
        { key: 'captions', label: 'Video Captions', desc: 'Show captions on all videos' },
        { key: 'keyboardNav', label: 'Keyboard Navigation', desc: 'Enhanced keyboard shortcuts' }
      ].map(item => (
        <div key={item.key} className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">{item.label}</p>
            <p className="text-sm text-gray-600">{item.desc}</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.accessibility[item.key as keyof typeof settings.accessibility]}
              onChange={e => setSettings({
                ...settings,
                accessibility: { ...settings.accessibility, [item.key]: e.target.checked }
              })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      ))}
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection />;
      case 'notifications':
        return <NotificationsSection />;
      case 'privacy':
        return <PrivacySection />;
      case 'appearance':
        return <AppearanceSection />;
      case 'accessibility':
        return <AccessibilitySection />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <nav className="space-y-1">
                {sections.map(section => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        activeSection === section.id
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{section.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="col-span-9">
            <div className="bg-white rounded-lg shadow-sm p-8">
              {renderSection()}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
                <div>
                  {saveStatus === 'saved' && (
                    <p className="text-sm text-green-600">✓ Settings saved successfully</p>
                  )}
                </div>
                <button
                  onClick={handleSave}
                  disabled={saveStatus === 'saving'}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saveStatus === 'saving' ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
