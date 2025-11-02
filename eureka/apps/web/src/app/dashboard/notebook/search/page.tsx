'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { notebookAPI } from '@/lib/notebook/api-client';
import {
  Search,
  FolderOpen,
  CheckSquare,
  FileText,
  ArrowRight,
} from 'lucide-react';

interface SearchResults {
  projects: any[];
  tasks: any[];
  files: any[];
}

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      const response = await notebookAPI.search(query);
      setResults(response.data.results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalResults = results
    ? results.projects.length + results.tasks.length + results.files.length
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Search</h1>
        <p className="mt-2 text-sm text-gray-600">
          Search across projects, tasks, and files
        </p>
      </div>

      {/* Search Bar */}
      <Card className="p-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for anything..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 text-lg"
              />
            </div>
          </div>
          <Button onClick={handleSearch} disabled={loading} size="lg">
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </Card>

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Summary */}
          <Card className="p-4">
            <p className="text-sm text-gray-600">
              Found {totalResults} results for "{query}"
            </p>
          </Card>

          {/* Projects */}
          {results.projects.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Projects ({results.projects.length})
              </h2>
              <div className="space-y-3">
                {results.projects.map((project) => (
                  <Card
                    key={project.id}
                    className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => router.push(`/dashboard/notebook/projects/${project.id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{project.name}</h3>
                        {project.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {project.description}
                          </p>
                        )}
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Tasks */}
          {results.tasks.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckSquare className="h-5 w-5" />
                Tasks ({results.tasks.length})
              </h2>
              <div className="space-y-3">
                {results.tasks.map((task) => (
                  <Card
                    key={task.id}
                    className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => router.push(`/dashboard/notebook/tasks/${task.id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{task.title}</h3>
                        {task.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-500">
                            {task.status.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">{task.priority}</span>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Files */}
          {results.files.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Files ({results.files.length})
              </h2>
              <div className="space-y-3">
                {results.files.map((file) => (
                  <Card key={file.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <h3 className="font-medium text-gray-900">{file.original_name}</h3>
                          <p className="text-xs text-gray-500">
                            {(file.file_size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`http://localhost:8120/api/files/${file.id}/download`)}
                      >
                        Download
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {totalResults === 0 && (
            <Card className="p-12 text-center">
              <Search className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-500">
                Try searching with different keywords
              </p>
            </Card>
          )}
        </div>
      )}

      {/* Initial State */}
      {!results && !loading && (
        <Card className="p-12 text-center">
          <Search className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Search Notebook</h3>
          <p className="text-gray-500">
            Enter a search term to find projects, tasks, and files
          </p>
        </Card>
      )}
    </div>
  );
}
