'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, FileText, BookOpen, Target, Eye } from 'lucide-react';

interface SearchFilters {
  type?: 'module' | 'lesson' | 'objective';
  status?: 'draft' | 'in_review' | 'approved' | 'published' | 'archived';
  tags?: string[];
  specialty?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

interface Content {
  id: string;
  type: string;
  title: string;
  slug: string;
  status: string;
  content: string;
  metadata: {
    tags: string[];
    specialty?: string;
    difficulty?: string;
    estimatedDuration?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export function ContentSearch() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [results, setResults] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      // Build query params
      const params = new URLSearchParams();
      if (query.trim()) params.append('q', query);
      if (filters.type) params.append('type', filters.type);
      if (filters.status) params.append('status', filters.status);
      if (filters.specialty) params.append('specialty', filters.specialty);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.tags) {
        filters.tags.forEach(tag => params.append('tags', tag));
      }

      const response = await fetch(`http://localhost:8030/api/v1/content/search?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({});
    setQuery('');
  };

  const removeFilter = (key: keyof SearchFilters) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'module':
        return <BookOpen className="h-4 w-4" />;
      case 'lesson':
        return <FileText className="h-4 w-4" />;
      case 'objective':
        return <Target className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'in_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'published':
        return 'bg-blue-100 text-blue-800';
      case 'archived':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Auto-search when filters change
  useEffect(() => {
    if (query || Object.keys(filters).length > 0) {
      handleSearch();
    }
  }, [filters]);

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Search content by title, keywords, or tags..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full"
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="h-4 w-4 mr-2" />
              {loading ? 'Searching...' : 'Search'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Active Filters Display */}
          {Object.keys(filters).length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {filters.type && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => removeFilter('type')}>
                  Type: {filters.type} <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
              {filters.status && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => removeFilter('status')}>
                  Status: {filters.status} <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
              {filters.specialty && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => removeFilter('specialty')}>
                  Specialty: {filters.specialty} <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
              {filters.difficulty && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => removeFilter('difficulty')}>
                  Difficulty: {filters.difficulty} <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear all
              </Button>
            </div>
          )}

          {/* Filter Panel */}
          {showFilters && (
            <Card className="p-4 bg-gray-50 border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Content Type Filter */}
                <div>
                  <Label htmlFor="filter-type">Content Type</Label>
                  <select
                    id="filter-type"
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md bg-white"
                    value={filters.type || ''}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value as any || undefined })}
                  >
                    <option value="">All Types</option>
                    <option value="module">Module</option>
                    <option value="lesson">Lesson</option>
                    <option value="objective">Objective</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <Label htmlFor="filter-status">Status</Label>
                  <select
                    id="filter-status"
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md bg-white"
                    value={filters.status || ''}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value as any || undefined })}
                  >
                    <option value="">All Statuses</option>
                    <option value="draft">Draft</option>
                    <option value="in_review">In Review</option>
                    <option value="approved">Approved</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                {/* Specialty Filter */}
                <div>
                  <Label htmlFor="filter-specialty">Specialty</Label>
                  <Input
                    id="filter-specialty"
                    placeholder="e.g., Cardiology"
                    className="mt-2"
                    value={filters.specialty || ''}
                    onChange={(e) => setFilters({ ...filters, specialty: e.target.value || undefined })}
                  />
                </div>

                {/* Difficulty Filter */}
                <div>
                  <Label htmlFor="filter-difficulty">Difficulty</Label>
                  <select
                    id="filter-difficulty"
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md bg-white"
                    value={filters.difficulty || ''}
                    onChange={(e) => setFilters({ ...filters, difficulty: e.target.value as any || undefined })}
                  >
                    <option value="">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </Card>
          )}
        </div>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        {results.length === 0 && !loading && (
          <Card className="p-8 text-center text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No results found. Try adjusting your search or filters.</p>
          </Card>
        )}

        {results.map((item) => (
          <Card key={item.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(item.type)}
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                  </div>
                  <Badge className={getStatusColor(item.status)}>
                    {item.status.replace('_', ' ')}
                  </Badge>
                </div>

                <div
                  className="text-sm text-muted-foreground mb-3 line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: item.content.substring(0, 200) + '...' }}
                />

                <div className="flex flex-wrap gap-2 items-center text-sm">
                  {item.metadata.tags.length > 0 && (
                    <div className="flex gap-1">
                      {item.metadata.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {item.metadata.specialty && (
                    <span className="text-muted-foreground">
                      • {item.metadata.specialty}
                    </span>
                  )}
                  {item.metadata.difficulty && (
                    <span className="text-muted-foreground capitalize">
                      • {item.metadata.difficulty}
                    </span>
                  )}
                  {item.metadata.estimatedDuration && (
                    <span className="text-muted-foreground">
                      • {item.metadata.estimatedDuration} min
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
