'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getUserDisplayName, getUserInitials } from '@/lib/utils';
import { Mail, Phone, MapPin, Calendar, Save, Edit2, Camera } from 'lucide-react';

interface ProfileData {
  first_name: string;
  last_name: string;
  display_name: string;
  email: string;
  avatar_url: string;
  phone?: string;
  bio?: string;
  location?: string;
  date_of_birth?: string;
}

export default function ProfilePage() {
  const { user, setUser, refreshUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    first_name: '',
    last_name: '',
    display_name: '',
    email: '',
    avatar_url: '',
    phone: '',
    bio: '',
    location: '',
    date_of_birth: '',
  });

  useEffect(() => {
    refreshUser().catch(() => {});
  }, [refreshUser]);

  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name,
        last_name: user.last_name,
        display_name: user.display_name || '',
        email: user.email,
        avatar_url: user.avatar_url || '',
        phone: (user as { phone?: string }).phone || '',
        bio: (user as { bio?: string }).bio || '',
        location: (user as { location?: string }).location || '',
        date_of_birth: (user as { date_of_birth?: string }).date_of_birth || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const updated = await apiClient.updateMyProfile({
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        display_name: profileData.display_name?.trim() || undefined,
        avatar_url: profileData.avatar_url?.trim() || undefined,
      });
      setUser(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(updated));
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setProfileData({
        first_name: user.first_name,
        last_name: user.last_name,
        display_name: user.display_name || '',
        email: user.email,
        avatar_url: user.avatar_url || '',
        phone: (user as { phone?: string }).phone || '',
        bio: (user as { bio?: string }).bio || '',
        location: (user as { location?: string }).location || '',
        date_of_birth: (user as { date_of_birth?: string }).date_of_birth || '',
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="mt-2 text-sm text-gray-600">
                Manage your account information and preferences.
              </p>
              <p className="mt-2 text-sm text-indigo-700 dark:text-indigo-300">
                Your profile photo appears in the <strong>dashboard header</strong> (top right), in the{' '}
                <strong>sidebar</strong> account area, and for classmates when you use Patent Bar cohort features.
              </p>
            </div>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)}>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>

          {/* Profile photo — persisted via api-core PATCH /users/me (avatar_url) */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Profile photo
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              <Avatar className="h-28 w-28 border-2 border-indigo-100 dark:border-indigo-900">
                <AvatarImage src={profileData.avatar_url || user?.avatar_url} alt={user ? getUserDisplayName(user) : 'Profile'} />
                <AvatarFallback className="text-2xl bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-100">
                  {user ? getUserInitials(user) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3 min-w-0">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {user ? getUserDisplayName(user) : '—'}
                  </h3>
                  <p className="text-sm text-gray-600 capitalize">{user?.role}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Photo URL
                  </label>
                  <Input
                    type="url"
                    placeholder="https://example.com/your-photo.jpg"
                    value={profileData.avatar_url}
                    onChange={(e) => setProfileData({ ...profileData, avatar_url: e.target.value })}
                    disabled={!isEditing}
                    className={!isEditing ? 'bg-gray-50' : ''}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Use a direct HTTPS link to an image file. This is stored on your account and shown across the dashboard.
                  </p>
                </div>
                {!isEditing && (
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit photo URL
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Personal Information */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <Input
                  value={profileData.first_name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, first_name: e.target.value })
                  }
                  disabled={!isEditing}
                  className={!isEditing ? 'bg-gray-50' : ''}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <Input
                  value={profileData.last_name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, last_name: e.target.value })
                  }
                  disabled={!isEditing}
                  className={!isEditing ? 'bg-gray-50' : ''}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display name <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <Input
                  value={profileData.display_name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, display_name: e.target.value })
                  }
                  disabled={!isEditing}
                  className={!isEditing ? 'bg-gray-50' : ''}
                  placeholder="Shown in the header and cohort if set"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="pl-10 bg-gray-50"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Email cannot be changed. Contact support if needed.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    disabled={!isEditing}
                    className={`pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    value={profileData.location}
                    onChange={(e) =>
                      setProfileData({ ...profileData, location: e.target.value })
                    }
                    disabled={!isEditing}
                    className={`pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                    placeholder="City, State"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="date"
                    value={profileData.date_of_birth}
                    onChange={(e) =>
                      setProfileData({ ...profileData, date_of_birth: e.target.value })
                    }
                    disabled={!isEditing}
                    className={`pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) =>
                    setProfileData({ ...profileData, bio: e.target.value })
                  }
                  disabled={!isEditing}
                  rows={4}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    !isEditing ? 'bg-gray-50' : ''
                  }`}
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t">
                <Button variant="outline" onClick={handleCancel} disabled={saving}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            )}
          </Card>

          {/* Account Stats */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Account Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="text-lg font-semibold text-gray-900">
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })
                    : 'Unknown'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Login</p>
                <p className="text-lg font-semibold text-gray-900">
                  {user?.last_login_at
                    ? new Date(user.last_login_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'Unknown'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Account Status</p>
                <p className="text-lg font-semibold text-green-600">Active</p>
              </div>
            </div>
          </Card>
    </div>
  );
}
