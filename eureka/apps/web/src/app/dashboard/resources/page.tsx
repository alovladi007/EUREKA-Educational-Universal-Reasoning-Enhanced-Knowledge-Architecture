"use client";
/**
 * EUREKA - Resources Page
 * Complete learning resources library with search, filters, and categories
 */

import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, BookOpen, Video, FileText, Headphones, Star, Clock } from 'lucide-react';

// Types
interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'audio' | 'interactive';
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration?: string;
  fileSize?: string;
  rating: number;
  downloads: number;
  url: string;
  thumbnail?: string;
  tags: string[];
  createdAt: string;
}

interface ResourceFilters {
  search: string;
  type: string;
  category: string;
  difficulty: string;
}

const ResourcesPage: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ResourceFilters>({
    search: '',
    type: 'all',
    category: 'all',
    difficulty: 'all'
  });

  // Fetch resources
  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      // In production: const response = await fetch('/api/v1/resources');
      // Mock data for now
      const mockResources: Resource[] = [
        {
          id: '1',
          title: 'Introduction to Calculus',
          description: 'Complete guide to calculus fundamentals covering limits, derivatives, and integrals.',
          type: 'document',
          category: 'Mathematics',
          difficulty: 'beginner',
          duration: '45 min read',
          fileSize: '2.3 MB',
          rating: 4.8,
          downloads: 1243,
          url: '/resources/calculus-intro.pdf',
          tags: ['calculus', 'mathematics', 'derivatives'],
          createdAt: '2024-10-15'
        },
        {
          id: '2',
          title: 'Physics 101: Newton\'s Laws',
          description: 'Video series explaining Newton\'s three laws of motion with real-world examples.',
          type: 'video',
          category: 'Physics',
          difficulty: 'beginner',
          duration: '28 min',
          rating: 4.9,
          downloads: 2156,
          url: '/resources/newtons-laws.mp4',
          thumbnail: '/thumbnails/physics-laws.jpg',
          tags: ['physics', 'mechanics', 'newton'],
          createdAt: '2024-10-20'
        },
        {
          id: '3',
          title: 'Advanced Organic Chemistry',
          description: 'Comprehensive study guide for organic chemistry reactions and mechanisms.',
          type: 'document',
          category: 'Chemistry',
          difficulty: 'advanced',
          duration: '90 min read',
          fileSize: '8.7 MB',
          rating: 4.7,
          downloads: 892,
          url: '/resources/organic-chem.pdf',
          tags: ['chemistry', 'organic', 'reactions'],
          createdAt: '2024-10-25'
        },
        {
          id: '4',
          title: 'Spanish Pronunciation Guide',
          description: 'Audio lessons for mastering Spanish pronunciation and accent.',
          type: 'audio',
          category: 'Languages',
          difficulty: 'intermediate',
          duration: '45 min',
          rating: 4.6,
          downloads: 1567,
          url: '/resources/spanish-pronunciation.mp3',
          tags: ['spanish', 'pronunciation', 'speaking'],
          createdAt: '2024-11-01'
        }
      ];
      
      setResources(mockResources);
      setFilteredResources(mockResources);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  useEffect(() => {
    let filtered = resources;

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        r =>
          r.title.toLowerCase().includes(searchLower) ||
          r.description.toLowerCase().includes(searchLower) ||
          r.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(r => r.type === filters.type);
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(r => r.category === filters.category);
    }

    // Difficulty filter
    if (filters.difficulty !== 'all') {
      filtered = filtered.filter(r => r.difficulty === filters.difficulty);
    }

    setFilteredResources(filtered);
  }, [filters, resources]);

  const getTypeIcon = (type: Resource['type']) => {
    switch (type) {
      case 'document':
        return <FileText className="w-5 h-5" />;
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'audio':
        return <Headphones className="w-5 h-5" />;
      case 'interactive':
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const getDifficultyColor = (difficulty: Resource['difficulty']) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
    }
  };

  const handleDownload = (resource: Resource) => {
    // In production: trigger actual download
    console.log('Downloading:', resource.title);
    // window.open(resource.url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Resources</h1>
          <p className="text-gray-600">Browse our comprehensive library of educational materials</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.search}
                  onChange={e => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
            </div>

            {/* Type Filter */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.type}
              onChange={e => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="all">All Types</option>
              <option value="document">Documents</option>
              <option value="video">Videos</option>
              <option value="audio">Audio</option>
              <option value="interactive">Interactive</option>
            </select>

            {/* Difficulty Filter */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.difficulty}
              onChange={e => setFilters({ ...filters, difficulty: e.target.value })}
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredResources.length}</span> of{' '}
            <span className="font-semibold">{resources.length}</span> resources
          </p>
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(resource => (
              <div
                key={resource.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Thumbnail */}
                {resource.thumbnail && (
                  <div className="h-48 bg-gray-200">
                    <img
                      src={resource.thumbnail}
                      alt={resource.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        {getTypeIcon(resource.type)}
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${getDifficultyColor(
                          resource.difficulty
                        )}`}
                      >
                        {resource.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{resource.description}</p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      {resource.duration && (
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{resource.duration}</span>
                        </div>
                      )}
                      {resource.fileSize && <span>{resource.fileSize}</span>}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{resource.rating}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {resource.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{resource.downloads} downloads</span>
                    <button
                      onClick={() => handleDownload(resource)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Popular Categories */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Languages', 'Computer Science', 'History', 'Literature'].map(
              category => (
                <button
                  key={category}
                  onClick={() => setFilters({ ...filters, category })}
                  className="px-6 py-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
                >
                  <h3 className="font-semibold text-gray-900">{category}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {Math.floor(Math.random() * 50) + 10} resources
                  </p>
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;
