'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth';
import {
  MessageSquare,
  Users,
  TrendingUp,
  Clock,
  ThumbsUp,
  MessageCircle,
  UserPlus,
  Search,
  Plus,
  BookOpen,
  Award,
  Star,
  Calendar,
} from 'lucide-react';

interface DiscussionThread {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  course?: string;
  replies: number;
  likes: number;
  views: number;
  is_pinned: boolean;
  is_resolved: boolean;
  created_at: string;
  last_activity: string;
}

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  subject: string;
  member_count: number;
  max_members: number;
  is_member: boolean;
  next_session?: string;
  meeting_schedule: string;
  created_at: string;
}

const categories = [
  { value: 'all', label: 'All Discussions' },
  { value: 'questions', label: 'Questions' },
  { value: 'announcements', label: 'Announcements' },
  { value: 'study-tips', label: 'Study Tips' },
  { value: 'resources', label: 'Resources' },
];

export default function CommunityPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'discussions' | 'groups'>('discussions');
  const [discussions, setDiscussions] = useState<DiscussionThread[]>([]);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadCommunityData();
  }, [activeTab]);

  const loadCommunityData = async () => {
    try {
      setLoading(true);

      // Mock data - replace with actual API calls
      const mockDiscussions: DiscussionThread[] = [
        {
          id: '1',
          title: 'How do I approach integration by parts?',
          content: 'I\'m struggling with the integration by parts formula. Can someone explain when to use it?',
          author: { name: 'Sarah Johnson' },
          course: 'Calculus II',
          replies: 12,
          likes: 23,
          views: 145,
          is_pinned: false,
          is_resolved: true,
          created_at: '2024-10-28T10:30:00Z',
          last_activity: '2024-10-28T15:45:00Z',
        },
        {
          id: '2',
          title: 'Study Group for Midterm Prep - Join Us!',
          content: 'Starting a study group for the upcoming midterm. We meet Tuesdays and Thursdays at 6 PM.',
          author: { name: 'Mike Chen' },
          course: 'Chemistry 101',
          replies: 8,
          likes: 34,
          views: 256,
          is_pinned: true,
          is_resolved: false,
          created_at: '2024-10-27T14:20:00Z',
          last_activity: '2024-10-28T16:10:00Z',
        },
        {
          id: '3',
          title: 'Best resources for learning Python?',
          content: 'I\'m new to programming. What are the best online resources for Python beginners?',
          author: { name: 'Emily Rodriguez' },
          course: 'Computer Science 101',
          replies: 45,
          likes: 67,
          views: 892,
          is_pinned: false,
          is_resolved: false,
          created_at: '2024-10-26T09:15:00Z',
          last_activity: '2024-10-28T14:30:00Z',
        },
      ];

      const mockStudyGroups: StudyGroup[] = [
        {
          id: '1',
          name: 'Calculus Study Squad',
          description: 'Weekly problem-solving sessions focusing on derivatives and integrals',
          subject: 'Mathematics',
          member_count: 8,
          max_members: 12,
          is_member: true,
          next_session: '2024-10-30T18:00:00Z',
          meeting_schedule: 'Tuesdays & Thursdays, 6:00 PM',
          created_at: '2024-09-15T10:00:00Z',
        },
        {
          id: '2',
          name: 'Biology Lab Partners',
          description: 'Collaborative group for lab reports and biology concepts',
          subject: 'Science',
          member_count: 6,
          max_members: 10,
          is_member: false,
          next_session: '2024-10-29T17:30:00Z',
          meeting_schedule: 'Mondays, 5:30 PM',
          created_at: '2024-09-20T14:30:00Z',
        },
        {
          id: '3',
          name: 'Python Programming Circle',
          description: 'Peer learning group for Python programming projects and debugging',
          subject: 'Computer Science',
          member_count: 10,
          max_members: 10,
          is_member: true,
          meeting_schedule: 'Wednesdays, 7:00 PM',
          created_at: '2024-09-10T11:00:00Z',
        },
      ];

      setDiscussions(mockDiscussions);
      setStudyGroups(mockStudyGroups);
    } catch (error) {
      console.error('Failed to load community data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const joinGroup = async (groupId: string) => {
    try {
      // API call to join group
      // await apiClient.post(`/study-groups/${groupId}/join`);
      
      setStudyGroups(studyGroups.map(g =>
        g.id === groupId
          ? { ...g, is_member: true, member_count: g.member_count + 1 }
          : g
      ));
    } catch (error) {
      console.error('Failed to join group:', error);
    }
  };

  const leaveGroup = async (groupId: string) => {
    try {
      // API call to leave group
      // await apiClient.post(`/study-groups/${groupId}/leave`);
      
      setStudyGroups(studyGroups.map(g =>
        g.id === groupId
          ? { ...g, is_member: false, member_count: g.member_count - 1 }
          : g
      ));
    } catch (error) {
      console.error('Failed to leave group:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Community</h1>
              <p className="mt-2 text-sm text-gray-600">
                Connect with classmates, join study groups, and participate in discussions.
              </p>
            </div>
            <Button variant="primary">
              <Plus className="h-4 w-4 mr-2" />
              {activeTab === 'discussions' ? 'New Discussion' : 'Create Group'}
            </Button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('discussions')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'discussions'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <MessageSquare className="inline h-5 w-5 mr-2" />
                Discussions
              </button>
              <button
                onClick={() => setActiveTab('groups')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'groups'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="inline h-5 w-5 mr-2" />
                Study Groups
              </button>
            </nav>
          </div>

          {/* Discussions Tab */}
          {activeTab === 'discussions' && (
            <>
              {/* Search and Filters */}
              <Card className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search discussions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </Card>

              {/* Discussion List */}
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
                </div>
              ) : (
                <div className="space-y-4">
                  {discussions.map((thread) => (
                    <Card key={thread.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {thread.is_pinned && (
                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                                  <Star className="h-3 w-3 mr-1" />
                                  Pinned
                                </span>
                              )}
                              {thread.is_resolved && (
                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                                  ✓ Resolved
                                </span>
                              )}
                              {thread.course && (
                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded">
                                  <BookOpen className="h-3 w-3 mr-1" />
                                  {thread.course}
                                </span>
                              )}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {thread.title}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {thread.content}
                            </p>
                          </div>
                        </div>

                        {/* Meta Info */}
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-4">
                            <span className="font-medium">{thread.author.name}</span>
                            <span>•</span>
                            <span>{formatTimeAgo(thread.created_at)}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="h-4 w-4" />
                              {thread.likes}
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4" />
                              {thread.replies}
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-4 w-4" />
                              {thread.views}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Study Groups Tab */}
          {activeTab === 'groups' && (
            <>
              {/* Search */}
              <Card className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search study groups..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </Card>

              {/* Groups Grid */}
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {studyGroups.map((group) => (
                    <Card key={group.id} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="space-y-4">
                        {/* Header */}
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <div className="p-2 bg-primary-100 rounded-lg">
                              <Users className="h-6 w-6 text-primary-600" />
                            </div>
                            {group.is_member && (
                              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                                <Award className="h-3 w-3 mr-1" />
                                Member
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            {group.name}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {group.description}
                          </p>
                        </div>

                        {/* Meta */}
                        <div className="space-y-2 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            <span>{group.subject}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>
                              {group.member_count}/{group.max_members} members
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{group.meeting_schedule}</span>
                          </div>
                          {group.next_session && (
                            <div className="flex items-center gap-2 text-primary-600 font-medium">
                              <Clock className="h-4 w-4" />
                              <span>Next: {formatTimeAgo(group.next_session)}</span>
                            </div>
                          )}
                        </div>

                        {/* Progress Bar */}
                        <div>
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Capacity</span>
                            <span>
                              {Math.round((group.member_count / group.max_members) * 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary-600 h-2 rounded-full transition-all"
                              style={{
                                width: `${(group.member_count / group.max_members) * 100}%`,
                              }}
                            />
                          </div>
                        </div>

                        {/* Actions */}
                        {group.is_member ? (
                          <div className="flex gap-2">
                            <Button variant="primary" className="flex-1">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => leaveGroup(group.id)}
                            >
                              Leave
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="primary"
                            className="w-full"
                            onClick={() => joinGroup(group.id)}
                            disabled={group.member_count >= group.max_members}
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            {group.member_count >= group.max_members ? 'Full' : 'Join Group'}
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
    </div>
  );
}
