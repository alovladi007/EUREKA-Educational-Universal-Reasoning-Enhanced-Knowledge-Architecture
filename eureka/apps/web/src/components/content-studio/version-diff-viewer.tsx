'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { GitCompare, ArrowLeftRight, List, CheckCircle, XCircle, Edit } from 'lucide-react';

interface DiffChange {
  added: boolean;
  removed: boolean;
  value: string;
  count: number;
}

interface DiffSummary {
  additions: number;
  deletions: number;
  unchanged: number;
  totalChanges: number;
}

interface VersionComparisonData {
  contentId: string;
  version1: {
    version: number;
    content: string;
    createdAt: string;
    author: string;
  };
  version2: {
    version: number;
    content: string;
    createdAt: string;
    author: string;
  };
  contentDiff: {
    changes: DiffChange[];
    summary: DiffSummary;
    hasChanges: boolean;
  };
}

interface VersionDiffViewerProps {
  contentId: string;
  version1: number;
  version2: number;
}

export function VersionDiffViewer({ contentId, version1, version2 }: VersionDiffViewerProps) {
  const [diffData, setDiffData] = useState<VersionComparisonData | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'inline' | 'side-by-side'>('inline');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (contentId && version1 && version2) {
      fetchDiff();
    }
  }, [contentId, version1, version2]);

  const fetchDiff = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:8030/api/v1/content/${contentId}/versions/compare?v1=${version1}&v2=${version2}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch version comparison');
      }

      const data = await response.json();
      setDiffData(data);
    } catch (err) {
      console.error('Error fetching diff:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const renderInlineDiff = () => {
    if (!diffData) return null;

    return (
      <div className="space-y-2">
        <div className="font-mono text-sm bg-gray-50 p-4 rounded-md overflow-x-auto">
          {diffData.contentDiff.changes.map((change, index) => {
            if (change.added) {
              return (
                <span key={index} className="bg-green-100 text-green-800 px-1">
                  {change.value}
                </span>
              );
            } else if (change.removed) {
              return (
                <span key={index} className="bg-red-100 text-red-800 line-through px-1">
                  {change.value}
                </span>
              );
            } else {
              return <span key={index}>{change.value}</span>;
            }
          })}
        </div>
      </div>
    );
  };

  const renderSideBySideDiff = () => {
    if (!diffData) return null;

    // Group changes for side-by-side view
    const leftContent: JSX.Element[] = [];
    const rightContent: JSX.Element[] = [];

    diffData.contentDiff.changes.forEach((change, index) => {
      if (change.removed) {
        leftContent.push(
          <div key={`left-${index}`} className="bg-red-50 px-2 py-1 border-l-4 border-red-400">
            <span className="text-red-800">{change.value}</span>
          </div>
        );
      } else if (change.added) {
        rightContent.push(
          <div key={`right-${index}`} className="bg-green-50 px-2 py-1 border-l-4 border-green-400">
            <span className="text-green-800">{change.value}</span>
          </div>
        );
      } else {
        const unchangedElement = (
          <div className="px-2 py-1 text-gray-600">
            <span>{change.value}</span>
          </div>
        );
        leftContent.push(<div key={`left-${index}`}>{unchangedElement}</div>);
        rightContent.push(<div key={`right-${index}`}>{unchangedElement}</div>);
      }
    });

    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded-md overflow-hidden">
          <div className="bg-red-100 border-b px-4 py-2 font-semibold text-sm">
            Version {diffData.version1.version} (Old)
          </div>
          <div className="font-mono text-sm max-h-96 overflow-y-auto">
            {leftContent}
          </div>
        </div>
        <div className="border rounded-md overflow-hidden">
          <div className="bg-green-100 border-b px-4 py-2 font-semibold text-sm">
            Version {diffData.version2.version} (New)
          </div>
          <div className="font-mono text-sm max-h-96 overflow-y-auto">
            {rightContent}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <div className="flex items-center justify-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-muted-foreground">Loading version comparison...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center border-red-200">
        <XCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
        <p className="text-red-600 font-semibold mb-2">Failed to load version comparison</p>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button onClick={fetchDiff} variant="outline">
          Try Again
        </Button>
      </Card>
    );
  }

  if (!diffData) {
    return (
      <Card className="p-8 text-center">
        <GitCompare className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="text-muted-foreground">Select two versions to compare</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Version Info */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <GitCompare className="h-5 w-5" />
              Version Comparison
            </h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Badge variant="outline">v{diffData.version1.version}</Badge>
                <span>{new Date(diffData.version1.createdAt).toLocaleDateString()}</span>
                <span className="text-xs">by {diffData.version1.author}</span>
              </div>
              <ArrowLeftRight className="h-4 w-4" />
              <div className="flex items-center gap-2">
                <Badge variant="outline">v{diffData.version2.version}</Badge>
                <span>{new Date(diffData.version2.createdAt).toLocaleDateString()}</span>
                <span className="text-xs">by {diffData.version2.author}</span>
              </div>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'inline' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('inline')}
            >
              <List className="h-4 w-4 mr-2" />
              Inline
            </Button>
            <Button
              variant={viewMode === 'side-by-side' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('side-by-side')}
            >
              <ArrowLeftRight className="h-4 w-4 mr-2" />
              Side by Side
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        {diffData.contentDiff.hasChanges ? (
          <div className="flex gap-6 bg-gray-50 p-4 rounded-md">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-sm">
                <span className="font-semibold">{diffData.contentDiff.summary.additions}</span> additions
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-sm">
                <span className="font-semibold">{diffData.contentDiff.summary.deletions}</span> deletions
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Edit className="h-4 w-4 text-blue-600" />
              <span className="text-sm">
                <span className="font-semibold">{diffData.contentDiff.summary.totalChanges}</span> total changes
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-md text-muted-foreground">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm">No changes between these versions</span>
          </div>
        )}
      </Card>

      {/* Diff Content */}
      {diffData.contentDiff.hasChanges && (
        <Card className="p-6">
          <div className="mb-4">
            <Label className="text-base font-semibold">Content Changes</Label>
          </div>
          {viewMode === 'inline' ? renderInlineDiff() : renderSideBySideDiff()}
        </Card>
      )}

      {/* Legend */}
      <Card className="p-4 bg-gray-50">
        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Added text</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded line-through">Removed text</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 px-2 py-1">Unchanged text</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
