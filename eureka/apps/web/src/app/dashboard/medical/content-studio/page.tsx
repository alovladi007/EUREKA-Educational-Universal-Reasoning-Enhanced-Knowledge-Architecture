'use client';

import { useState } from 'react';
import { RichTextEditor } from '@/components/content-studio/rich-text-editor';
import { WorkflowStatusComponent, WorkflowStatus } from '@/components/content-studio/workflow-status';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Eye, Send, FileText, BookOpen, Target, CheckCircle, FileDown } from 'lucide-react';

export default function ContentStudioPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState<'module' | 'lesson' | 'objective'>('lesson');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [contentId, setContentId] = useState<string | undefined>(undefined);
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus>(WorkflowStatus.DRAFT);
  const [specialty, setSpecialty] = useState('');
  const [difficulty, setDifficulty] = useState('beginner');
  const [duration, setDuration] = useState('45');
  const [isSaving, setIsSaving] = useState(false);
  const [moduleId, setModuleId] = useState('');
  const [sequence, setSequence] = useState('1');
  const [bloomLevel, setBloomLevel] = useState<'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create'>('understand');
  const [assessable, setAssessable] = useState(true);

  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSaveDraft = async () => {
    if (!title.trim()) {
      alert('Please enter a title for the content');
      return;
    }

    // Validate type-specific required fields
    if (contentType === 'lesson' && !moduleId.trim()) {
      alert('Please select or enter a Module ID for this lesson');
      return;
    }

    setIsSaving(true);
    try {
      const endpoint = contentType === 'lesson' ? '/api/v1/content/lessons' :
                       contentType === 'module' ? '/api/v1/content/modules' :
                       '/api/v1/content/objectives';

      // Base payload
      const basePayload = {
        type: contentType,
        title,
        content,
        status: WorkflowStatus.DRAFT,
        metadata: {
          tags,
          keywords: tags,
          learningObjectives: [],
          estimatedDuration: parseInt(duration) || 45,
          difficulty,
          specialty,
          systems: [],
        },
      };

      // Add type-specific fields
      let payload: any = { ...basePayload };

      if (contentType === 'module') {
        payload.sequence = parseInt(sequence) || 1;
      } else if (contentType === 'lesson') {
        payload.moduleId = moduleId;
        payload.sequence = parseInt(sequence) || 1;
      } else if (contentType === 'objective') {
        payload.bloomLevel = bloomLevel;
        payload.assessable = assessable;
      }

      const response = await fetch(`http://localhost:8030${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save content');
      }

      const savedContent = await response.json();
      setContentId(savedContent.id);
      setWorkflowStatus(savedContent.status);

      alert('✓ Content saved as draft successfully!');
    } catch (error) {
      console.error('Error saving content:', error);
      alert(`Failed to save content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitForReview = async () => {
    if (!contentId) {
      alert('Please save the content first before submitting for review');
      await handleSaveDraft();
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`http://localhost:8030/content/${contentId}/workflow`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: WorkflowStatus.IN_REVIEW }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit for review');
      }

      const updatedContent = await response.json();
      setWorkflowStatus(updatedContent.status);

      alert('✓ Content submitted for review successfully!');
    } catch (error) {
      console.error('Error submitting for review:', error);
      alert('Failed to submit for review. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleWorkflowStatusChange = (newStatus: WorkflowStatus) => {
    setWorkflowStatus(newStatus);
  };

  const handleExportPDF = async () => {
    if (!contentId) {
      alert('Please save the content first before exporting to PDF');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8030/api/v1/content/export/pdf/${contentId}`);

      if (!response.ok) {
        throw new Error('Failed to export PDF');
      }

      // Get the PDF blob and create a download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'content'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      alert('PDF exported successfully!');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Content Studio</h1>
        <p className="text-muted-foreground">Create and manage educational content with rich formatting and citations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              {/* Content Type Selection */}
              <div>
                <Label>Content Type</Label>
                <Tabs value={contentType} onValueChange={(v) => setContentType(v as any)} className="mt-2">
                  <TabsList>
                    <TabsTrigger value="module" className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Module
                    </TabsTrigger>
                    <TabsTrigger value="lesson" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Lesson
                    </TabsTrigger>
                    <TabsTrigger value="objective" className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Objective
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Title Input */}
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter content title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-2"
                />
              </div>

              {/* Rich Text Editor */}
              <div>
                <Label>Content</Label>
                <div className="mt-2">
                  <RichTextEditor
                    content={content}
                    onChange={setContent}
                    placeholder="Start writing your educational content..."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-between pt-4 border-t">
                <div className="flex gap-2">
                  <Button onClick={handleSaveDraft} variant="outline" disabled={isSaving}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Draft'}
                  </Button>
                  <Button variant="outline" disabled={!contentId}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button onClick={handleExportPDF} variant="outline" disabled={!contentId}>
                    <FileDown className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
                <Button onClick={handleSubmitForReview} disabled={isSaving}>
                  <Send className="h-4 w-4 mr-2" />
                  Submit for Review
                </Button>
              </div>

              {/* Success Indicator */}
              {contentId && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-800">Content saved successfully! ID: {contentId.substring(0, 8)}...</span>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar - Metadata & Citations */}
        <div className="space-y-6">
          {/* Workflow Status Card */}
          <WorkflowStatusComponent
            currentStatus={workflowStatus}
            contentId={contentId}
            onStatusChange={handleWorkflowStatusChange}
            disabled={!contentId}
          />

          {/* Metadata Card */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Metadata</h3>
            <div className="space-y-4">
              {/* Tags */}
              <div>
                <Label htmlFor="tags">Tags</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="tags"
                    placeholder="Add tag..."
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                  <Button size="sm" onClick={handleAddTag}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Type-specific fields */}
              {contentType === 'lesson' && (
                <div>
                  <Label htmlFor="moduleId">Module ID (Required)</Label>
                  <Input
                    id="moduleId"
                    placeholder="Enter module ID..."
                    className="mt-2"
                    value={moduleId}
                    onChange={(e) => setModuleId(e.target.value)}
                    required
                  />
                </div>
              )}

              {(contentType === 'module' || contentType === 'lesson') && (
                <div>
                  <Label htmlFor="sequence">Sequence Number</Label>
                  <Input
                    id="sequence"
                    type="number"
                    placeholder="1"
                    className="mt-2"
                    value={sequence}
                    onChange={(e) => setSequence(e.target.value)}
                  />
                </div>
              )}

              {contentType === 'objective' && (
                <>
                  <div>
                    <Label htmlFor="bloomLevel">Bloom's Taxonomy Level</Label>
                    <select
                      id="bloomLevel"
                      className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md"
                      value={bloomLevel}
                      onChange={(e) => setBloomLevel(e.target.value as any)}
                    >
                      <option value="remember">Remember</option>
                      <option value="understand">Understand</option>
                      <option value="apply">Apply</option>
                      <option value="analyze">Analyze</option>
                      <option value="evaluate">Evaluate</option>
                      <option value="create">Create</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id="assessable"
                      type="checkbox"
                      checked={assessable}
                      onChange={(e) => setAssessable(e.target.checked)}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="assessable">Assessable</Label>
                  </div>
                </>
              )}

              {/* Specialty */}
              <div>
                <Label htmlFor="specialty">Specialty</Label>
                <Input
                  id="specialty"
                  placeholder="e.g., Cardiology"
                  className="mt-2"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                />
              </div>

              {/* Difficulty */}
              <div>
                <Label htmlFor="difficulty">Difficulty</Label>
                <select
                  id="difficulty"
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              {/* Estimated Duration */}
              <div>
                <Label htmlFor="duration">Estimated Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="45"
                  className="mt-2"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Citations Card */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Citations</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full">
                Add Citation
              </Button>
              <div className="text-sm text-muted-foreground">
                No citations added yet
              </div>
            </div>
          </Card>

          {/* Learning Objectives Card */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Learning Objectives</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full">
                Add Objective
              </Button>
              <div className="text-sm text-muted-foreground">
                No objectives added yet
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
