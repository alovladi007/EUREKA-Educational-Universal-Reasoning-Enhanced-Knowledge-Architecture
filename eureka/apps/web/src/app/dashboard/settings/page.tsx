"use client";
/**
 * EUREKA - Settings Page
 * User preferences, notifications, privacy, and account settings.
 *
 * Data flow (P0-4):
 *   • Mount  → GET /users/me + GET /users/me/settings, seed local state
 *   • Change → debounce 800ms, then PATCH /users/me/settings (settings
 *              sections) and PATCH /users/me (profile fields).
 *   • UI     → toast on success/error, "Saved" indicator with last-saved
 *              timestamp.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth';
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

// Defaults applied when the API returns no persisted settings yet (new user).
const DEFAULT_SETTINGS: Settings = {
  profile: {
    email: '',
    emailVerified: false,
    phone: '',
    language: 'en',
    timezone: 'America/New_York',
  },
  notifications: {
    email: true,
    push: true,
    sms: false,
    assignmentReminders: true,
    gradeUpdates: true,
    discussionReplies: true,
    studyGroupInvites: true,
    weeklyDigest: false,
  },
  privacy: {
    profileVisibility: 'friends',
    showEmail: false,
    showProgress: true,
    allowMessages: true,
    dataSharing: false,
  },
  appearance: { theme: 'light', fontSize: 'medium', compactMode: false },
  accessibility: { highContrast: false, screenReader: false, captions: true, keyboardNav: false },
};

const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('profile');
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const refreshUser = useAuthStore((s) => s.refreshUser);
  const router = useRouter();

  // ── Change-password modal ─────────────────────────────────────────────
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pwCurrent, setPwCurrent] = useState('');
  const [pwNew, setPwNew] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [pwSubmitting, setPwSubmitting] = useState(false);

  // ── Delete-account modal ──────────────────────────────────────────────
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [delPassword, setDelPassword] = useState('');
  const [delConfirmText, setDelConfirmText] = useState('');
  const [delSubmitting, setDelSubmitting] = useState(false);

  const closePasswordModal = useCallback(() => {
    setShowPasswordModal(false);
    setPwCurrent('');
    setPwNew('');
    setPwConfirm('');
  }, []);

  const handleChangePassword = useCallback(async () => {
    if (pwNew !== pwConfirm) {
      toast.error('New password and confirmation do not match.');
      return;
    }
    // Mirror the backend policy so we fail fast with a clear message.
    const strong =
      pwNew.length >= 8 &&
      /[A-Z]/.test(pwNew) &&
      /[a-z]/.test(pwNew) &&
      /[0-9]/.test(pwNew);
    if (!strong) {
      toast.error('Password needs 8+ chars with upper, lower, and a number.');
      return;
    }
    setPwSubmitting(true);
    try {
      await apiClient.changePassword(pwCurrent, pwNew);
      toast.success('Password changed. Please sign in again.');
      closePasswordModal();
      // Backend revoked every session — send the user to login.
      await apiClient.logout().catch(() => {});
      router.push('/auth/login');
    } catch (err) {
      const detail =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        'Could not change your password.';
      toast.error(String(detail));
    } finally {
      setPwSubmitting(false);
    }
  }, [pwCurrent, pwNew, pwConfirm, closePasswordModal, router]);

  const handleDeactivate = useCallback(async () => {
    if (delConfirmText.trim().toUpperCase() !== 'DELETE') {
      toast.error('Type DELETE to confirm.');
      return;
    }
    setDelSubmitting(true);
    try {
      await apiClient.deactivateAccount(delPassword);
      toast.success('Your account has been deactivated.');
      router.push('/auth/login');
    } catch (err) {
      const detail =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        'Could not deactivate your account.';
      toast.error(String(detail));
    } finally {
      setDelSubmitting(false);
    }
  }, [delPassword, delConfirmText, router]);

  // ─── Load on mount ────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Profile data lives on the User row (email/phone/locale/timezone);
        // freeform UI prefs live in users.preferences.
        const [profile, prefs] = await Promise.all([
          apiClient.getMyProfile().catch(() => null),
          apiClient.getMySettings().catch(() => ({} as Record<string, unknown>)),
        ]);
        if (cancelled) return;
        setSettings((prev) => ({
          ...prev,
          profile: {
            email: profile?.email ?? prev.profile.email,
            emailVerified: (profile as { is_email_verified?: boolean })?.is_email_verified ?? prev.profile.emailVerified,
            phone: (prefs.phone as string) ?? (profile as { phone?: string })?.phone ?? prev.profile.phone,
            language: (profile as { locale?: string })?.locale?.split('-')[0] ?? prev.profile.language,
            timezone: (profile as { timezone?: string })?.timezone ?? prev.profile.timezone,
          },
          notifications: { ...prev.notifications, ...(prefs.notifications as object || {}) },
          privacy: { ...prev.privacy, ...(prefs.privacy as object || {}) },
          appearance: { ...prev.appearance, ...(prefs.appearance as object || {}) },
          accessibility: { ...prev.accessibility, ...(prefs.accessibility as object || {}) },
        }));
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Settings load failed:', err);
        toast.error('Could not load your settings — using defaults.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ─── Debounced save ───────────────────────────────────────────────────
  // We split the persisted payload into two requests because profile
  // fields (locale, timezone, etc.) live on the User row while the rest
  // lives in users.preferences (JSONB).
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const persist = useCallback(async (next: Settings) => {
    setSaveStatus('saving');
    try {
      await Promise.all([
        apiClient.updateMyProfile({
          locale: next.profile.language,
          timezone: next.profile.timezone,
        } as Partial<unknown> as never),
        apiClient.updateMySettings({
          notifications: next.notifications,
          privacy: next.privacy,
          appearance: next.appearance,
          accessibility: next.accessibility,
          phone: next.profile.phone,
        }),
      ]);
      setSaveStatus('saved');
      setLastSavedAt(new Date());
      // refresh auth store so header/sidebar pick up locale/timezone changes
      void refreshUser().catch(() => {});
      setTimeout(() => setSaveStatus('idle'), 1500);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Settings save failed:', err);
      toast.error('Could not save your settings — try again.');
      setSaveStatus('idle');
    }
  }, [refreshUser]);

  // Schedule a debounced save whenever `settings` changes after the
  // initial load. Cancel any in-flight timer first.
  useEffect(() => {
    if (loading) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => persist(settings), 800);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [settings, loading, persist]);

  // Manual save button still available (calls persist immediately).
  const handleSave = async () => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    await persist(settings);
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
              {/* Read-only: there is no change-email endpoint yet, and the
                  save path never sent email — an editable field silently
                  discarded edits. Kept read-only until a verified
                  change-email flow exists. */}
              <input
                type="email"
                value={settings.profile.email}
                readOnly
                aria-readonly="true"
                className="flex-1 px-4 py-2 border border-gray-300 bg-gray-50 text-gray-600 rounded-lg cursor-not-allowed"
              />
              {settings.profile.emailVerified && (
                <span className="px-3 py-2 bg-green-100 text-green-800 text-sm font-medium rounded-lg">
                  Verified
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              To change your email, contact support — email changes require
              re-verification and aren&apos;t self-service yet.
            </p>
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
        <button
          type="button"
          onClick={() => setShowPasswordModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Lock className="w-4 h-4" />
          <span>Change Password</span>
        </button>
      </div>

      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
        <p className="text-sm text-gray-600 mb-3 max-w-lg">
          Deactivating disables sign-in and hides your profile. Your record is
          retained (soft delete) so it can be restored by an administrator —
          contact support to fully erase your data.
        </p>
        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
        >
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

  // Initial-load skeleton — avoid flashing the seeded defaults to the user.
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="h-9 w-48 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-72 bg-gray-100 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-3 h-96 bg-white rounded-lg shadow-sm animate-pulse" />
            <div className="col-span-9 h-96 bg-white rounded-lg shadow-sm animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

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

              {/* Save status — autosaves on every change (debounced 800ms).
                  The button below is kept for a manual flush. */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm">
                  {saveStatus === 'saving' && (
                    <p className="text-blue-600">Saving…</p>
                  )}
                  {saveStatus === 'saved' && (
                    <p className="text-green-600">
                      ✓ Saved{lastSavedAt && ` at ${lastSavedAt.toLocaleTimeString()}`}
                    </p>
                  )}
                  {saveStatus === 'idle' && lastSavedAt && (
                    <p className="text-gray-500">
                      Last saved at {lastSavedAt.toLocaleTimeString()}
                    </p>
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

      {/* ── Change-password modal ─────────────────────────────────────── */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-gray-700" />
              <h3 className="text-lg font-semibold text-gray-900">Change password</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current password</label>
                <input
                  type="password"
                  autoComplete="current-password"
                  value={pwCurrent}
                  onChange={(e) => setPwCurrent(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={pwNew}
                  onChange={(e) => setPwNew(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">
                  At least 8 characters with an uppercase, a lowercase, and a number.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm new password</label>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={pwConfirm}
                  onChange={(e) => setPwConfirm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closePasswordModal}
                disabled={pwSubmitting}
                className="px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleChangePassword}
                disabled={pwSubmitting || !pwCurrent || !pwNew || !pwConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pwSubmitting ? 'Changing…' : 'Change password'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete-account modal ──────────────────────────────────────── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <Trash2 className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-semibold text-red-600">Deactivate account</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              This disables sign-in and hides your profile. Your data is retained
              (soft delete) and can be restored by an administrator. Enter your
              password and type <span className="font-mono font-semibold">DELETE</span> to confirm.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  autoComplete="current-password"
                  value={delPassword}
                  onChange={(e) => setDelPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type DELETE to confirm</label>
                <input
                  type="text"
                  value={delConfirmText}
                  onChange={(e) => setDelConfirmText(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="DELETE"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDelPassword('');
                  setDelConfirmText('');
                }}
                disabled={delSubmitting}
                className="px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeactivate}
                disabled={
                  delSubmitting ||
                  !delPassword ||
                  delConfirmText.trim().toUpperCase() !== 'DELETE'
                }
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {delSubmitting ? 'Deactivating…' : 'Deactivate account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
