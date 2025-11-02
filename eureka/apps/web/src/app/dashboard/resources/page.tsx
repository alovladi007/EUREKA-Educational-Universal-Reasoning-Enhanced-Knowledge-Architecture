'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth';
import {
  FileText,
  Video,
  Headphones,
  BookOpen,
  Download,
  Search,
  Filter,
  Star,
  Clock,
  Eye,
  ExternalLink,
} from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'audio' | 'link' | 'book';
  subject: string;
  url: string;
  thumbnail_url?: string;
  duration?: string;
  views: number;
  rating: number;
  is_favorite: boolean;
  created_at: string;
}

const resourceTypes = [
  { value: 'all', label: 'All Resources', icon: FileText },
  { value: 'document', label: 'Documents', icon: FileText },
  { value: 'video', label: 'Videos', icon: Video },
  { value: 'audio', label: 'Audio', icon: Headphones },
  { value: 'book', label: 'Books', icon: BookOpen },
];

const subjects = [
  'All Subjects',
  'Mathematics',
  'Science',
  'English',
  'History',
  'Computer Science',
  'Languages',
  'Arts',
];

export default function ResourcesPage() {
  const { user } = useAuthStore();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    loadResources();
  }, [selectedType, selectedSubject, showFavorites]);

  const loadResources = async () => {
    try {
      setLoading(true);

      // Mock data for now - replace with actual API call
      const mockResources: Resource[] = [
        {
          id: '1',
          title: 'Introduction to Calculus',
          description: 'Comprehensive guide covering derivatives, integrals, and limits',
          type: 'document',
          subject: 'Mathematics',
          url: '/resources/calculus-intro.pdf',
          views: 1234,
          rating: 4.8,
          is_favorite: true,
          created_at: '2024-10-15T10:00:00Z',
        },
        {
          id: '2',
          title: 'Photosynthesis Explained',
          description: 'Video lecture on plant biology and energy conversion',
          type: 'video',
          subject: 'Science',
          url: 'https://youtube.com/watch?v=example',
          thumbnail_url: '/thumbnails/photosynthesis.jpg',
          duration: '15:30',
          views: 856,
          rating: 4.6,
          is_favorite: false,
          created_at: '2024-10-20T14:30:00Z',
        },
        {
          id: '3',
          title: 'Shakespeare Audio Collection',
          description: 'Complete works narrated by professional actors',
          type: 'audio',
          subject: 'English',
          url: '/audio/shakespeare-collection',
          duration: '45:00',
          views: 432,
          rating: 4.9,
          is_favorite: true,
          created_at: '2024-10-18T09:00:00Z',
        },
        {
          id: '4',
          title: 'World War II Interactive Timeline',
          description: 'Interactive resource with primary sources and multimedia',
          type: 'link',
          subject: 'History',
          url: 'https://timeline.ww2.edu',
          views: 2103,
          rating: 4.7,
          is_favorite: false,
          created_at: '2024-10-10T16:45:00Z',
        },
        {
          id: '5',
          title: 'Python Programming Fundamentals',
          description: 'Complete textbook with exercises and code examples',
          type: 'book',
          subject: 'Computer Science',
          url: '/books/python-fundamentals',
          views: 3421,
          rating: 4.9,
          is_favorite: true,
          created_at: '2024-09-25T11:20:00Z',
        },
      ];

      // Filter resources
      let filtered = mockResources;

      if (selectedType !== 'all') {
        filtered = filtered.filter(r => r.type === selectedType);
      }

      if (selectedSubject !== 'All Subjects') {
        filtered = filtered.filter(r => r.subject === selectedSubject);
      }

      if (showFavorites) {
        filtered = filtered.filter(r => r.is_favorite);
      }

      if (searchQuery) {
        filtered = filtered.filter(r =>
          r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setResources(filtered);
    } catch (error) {
      console.error('Failed to load resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (resourceId: string) => {
    try {
      // API call to toggle favorite
      // await apiClient.post(`/resources/${resourceId}/favorite`);

      setResources(resources.map(r =>
        r.id === resourceId ? { ...r, is_favorite: !r.is_favorite } : r
      ));
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'audio': return Headphones;
      case 'book': return BookOpen;
      case 'link': return ExternalLink;
      default: return FileText;
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Learning Resources</h1>
            <p className="mt-2 text-sm text-gray-600">
              Browse study materials, videos, and supplementary content for your courses.
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-4">
                {/* Resource Type Filter */}
                <div className="flex gap-2">
                  {resourceTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        onClick={() => setSelectedType(type.value)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedType === type.value
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {type.label}
                      </button>
                    );
                  })}
                </div>

                {/* Subject Filter */}
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>

                {/* Favorites Toggle */}
                <button
                  onClick={() => setShowFavorites(!showFavorites)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    showFavorites
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Star className={`h-4 w-4 ${showFavorites ? 'fill-current' : ''}`} />
                  Favorites Only
                </button>
              </div>
            </div>
          </Card>

          {/* Resources Grid */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
            </div>
          ) : resources.length === 0 ? (
            <Card className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
              <p className="text-gray-600">Try adjusting your filters or search query.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource) => {
                const Icon = getResourceIcon(resource.type);
                return (
                  <Card key={resource.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary-100 rounded-lg">
                            <Icon className="h-6 w-6 text-primary-600" />
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-500 uppercase">
                              {resource.type}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleFavorite(resource.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Star
                            className={`h-5 w-5 ${
                              resource.is_favorite
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-400'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Content */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {resource.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {resource.description}
                        </p>
                      </div>

                      {/* Meta */}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {resource.views.toLocaleString()}
                        </div>
                        {resource.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {resource.duration}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-current text-yellow-400" />
                          {resource.rating}
                        </div>
                      </div>

                      {/* Subject Badge */}
                      <div>
                        <span className="inline-block px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                          {resource.subject}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button variant="primary" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
