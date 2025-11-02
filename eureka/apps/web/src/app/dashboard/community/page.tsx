"use client";
/**
 * EUREKA - Community Page
 * Discussion forums, study groups, and peer collaboration
 */

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Users,
  TrendingUp,
  Clock,
  ThumbsUp,
  MessageCircle,
  Plus,
  Search,
  Filter
} from 'lucide-react';

// Types
interface Discussion {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  category: string;
  tags: string[];
  replies: number;
  likes: number;
  views: number;
  createdAt: string;
  lastActivity: string;
  isPinned?: boolean;
  isSolved?: boolean;
}

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  category: string;
  members: number;
  maxMembers: number;
  isPublic: boolean;
  meetingTime?: string;
  nextMeeting?: string;
}

const CommunityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'discussions' | 'study-groups'>('discussions');
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchCommunityData();
  }, []);

  const fetchCommunityData = async () => {
    try {
      setLoading(true);
      // Mock data
      const mockDiscussions: Discussion[] = [
        {
          id: '1',
          title: 'Need help with calculus derivatives',
          content: 'I\'m struggling to understand the chain rule. Can someone explain it with examples?',
          author: {
            id: 'user1',
            name: 'Sarah Johnson',
            avatar: '/avatars/user1.jpg',
            role: 'Student'
          },
          category: 'Mathematics',
          tags: ['calculus', 'derivatives', 'help'],
          replies: 12,
          likes: 24,
          views: 156,
          createdAt: '2024-11-01T10:30:00Z',
          lastActivity: '2024-11-02T14:20:00Z',
          isSolved: false
        },
        {
          id: '2',
          title: 'Study group for Physics final exam',
          content: 'Looking for students to form a study group for the upcoming Physics final. Let\'s meet twice a week!',
          author: {
            id: 'user2',
            name: 'Michael Chen',
            avatar: '/avatars/user2.jpg',
            role: 'Student'
          },
          category: 'Physics',
          tags: ['study-group', 'exam-prep'],
          replies: 8,
          likes: 15,
          views: 89,
          createdAt: '2024-11-01T15:45:00Z',
          lastActivity: '2024-11-02T09:10:00Z',
          isPinned: true
        },
        {
          id: '3',
          title: 'Best resources for organic chemistry?',
          content: 'What are the best online resources for learning organic chemistry reactions?',
          author: {
            id: 'user3',
            name: 'Emily Rodriguez',
            avatar: '/avatars/user3.jpg',
            role: 'Student'
          },
          category: 'Chemistry',
          tags: ['resources', 'organic-chemistry'],
          replies: 25,
          likes: 42,
          views: 234,
          createdAt: '2024-10-31T08:15:00Z',
          lastActivity: '2024-11-02T11:30:00Z',
          isSolved: true
        }
      ];

      const mockStudyGroups: StudyGroup[] = [
        {
          id: '1',
          name: 'Calculus Warriors',
          description: 'Daily problem-solving sessions for Calculus I and II',
          category: 'Mathematics',
          members: 15,
          maxMembers: 20,
          isPublic: true,
          meetingTime: 'Mon/Wed 7PM EST',
          nextMeeting: '2024-11-04T19:00:00Z'
        },
        {
          id: '2',
          name: 'Physics Study Squad',
          description: 'Preparing for AP Physics exams together',
          category: 'Physics',
          members: 8,
          maxMembers: 12,
          isPublic: true,
          meetingTime: 'Tue/Thu 6PM EST'
        },
        {
          id: '3',
          name: 'Spanish Conversation Club',
          description: 'Practice Spanish speaking skills with peers',
          category: 'Languages',
          members: 22,
          maxMembers: 25,
          isPublic: true,
          meetingTime: 'Every Friday 5PM EST',
          nextMeeting: '2024-11-06T17:00:00Z'
        }
      ];

      setDiscussions(mockDiscussions);
      setStudyGroups(mockStudyGroups);
    } catch (error) {
      console.error('Failed to fetch community data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const DiscussionsTab = () => (
    <div>
      {/* New Discussion Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Discussions</h2>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span>New Discussion</span>
        </button>
      </div>

      {/* Discussions List */}
      <div className="space-y-4">
        {discussions.map(discussion => (
          <div
            key={discussion.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
          >
            <div className="flex items-start space-x-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {discussion.author.name.charAt(0)}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    {discussion.isPinned && (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded mr-2">
                        Pinned
                      </span>
                    )}
                    {discussion.isSolved && (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded mr-2">
                        Solved
                      </span>
                    )}
                    <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                      {discussion.title}
                    </h3>
                  </div>
                </div>

                {/* Author & Time */}
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                  <span className="font-medium">{discussion.author.name}</span>
                  <span>•</span>
                  <span>{discussion.author.role}</span>
                  <span>•</span>
                  <span>{formatTimeAgo(discussion.createdAt)}</span>
                </div>

                {/* Content Preview */}
                <p className="text-gray-700 mb-3 line-clamp-2">{discussion.content}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {discussion.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{discussion.replies} replies</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{discussion.likes} likes</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>{discussion.views} views</span>
                  </div>
                  <div className="flex items-center space-x-1 ml-auto">
                    <Clock className="w-4 h-4" />
                    <span>Last activity {formatTimeAgo(discussion.lastActivity)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const StudyGroupsTab = () => (
    <div>
      {/* New Study Group Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Study Groups</h2>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Create Group</span>
        </button>
      </div>

      {/* Study Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {studyGroups.map(group => (
          <div key={group.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                  {group.category}
                </span>
              </div>
              {group.isPublic && (
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                  Public
                </span>
              )}
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">{group.name}</h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{group.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Members</span>
                <span className="font-medium">
                  {group.members}/{group.maxMembers}
                </span>
              </div>
              {group.meetingTime && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Meetings</span>
                  <span className="font-medium">{group.meetingTime}</span>
                </div>
              )}
              {group.nextMeeting && (
                <div className="flex items-center space-x-1 text-sm text-blue-600">
                  <Clock className="w-4 h-4" />
                  <span>Next: {new Date(group.nextMeeting).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Join Group
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Community</h1>
          <p className="text-gray-600">Connect with fellow students, ask questions, and collaborate</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('discussions')}
                className={`py-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'discussions'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Discussions</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('study-groups')}
                className={`py-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'study-groups'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Study Groups</span>
                </div>
              </button>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab === 'discussions' ? 'discussions' : 'study groups'}...`}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="all">All Categories</option>
                <option value="mathematics">Mathematics</option>
                <option value="physics">Physics</option>
                <option value="chemistry">Chemistry</option>
                <option value="biology">Biology</option>
                <option value="languages">Languages</option>
              </select>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        ) : (
          <div>{activeTab === 'discussions' ? <DiscussionsTab /> : <StudyGroupsTab />}</div>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;
