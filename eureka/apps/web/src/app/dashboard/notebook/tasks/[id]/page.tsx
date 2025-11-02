'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { notebookAPI } from '@/lib/notebook/api-client';
import { notebookSocket } from '@/lib/notebook/socket-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  project_id: number;
  project_name?: string;
  assigned_to: string | null;
  assigned_to_name?: string;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

interface Comment {
  id: number;
  content: string;
  user_id: string;
  user_name: string;
  created_at: string;
}

interface TaskFile {
  id: number;
  filename: string;
  original_name: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;
}

export default function TaskDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [taskId, setTaskId] = useState<number>(0);
  const [task, setTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [files, setFiles] = useState<TaskFile[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Task>>({});
  const [newComment, setNewComment] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(({ id }) => {
      const parsedId = parseInt(id);
      setTaskId(parsedId);
      loadTaskData(parsedId);
    });
  }, [params]);

  useEffect(() => {
    if (!taskId) return;

    // Connect WebSocket and join task room
    const token = localStorage.getItem('token');
    if (token) {
      notebookSocket.connect(token);

      // Listen for real-time updates
      notebookSocket.onTaskUpdated((data) => {
        if (data.taskId === taskId) {
          loadTaskData(taskId);
        }
      });

      notebookSocket.onCommentAdded((data) => {
        if (data.taskId === taskId) {
          setComments((prev) => [...prev, data.comment]);
        }
      });

      notebookSocket.onUserTyping((data) => {
        if (data.taskId === taskId) {
          setIsTyping(true);
          setTimeout(() => setIsTyping(false), 3000);
        }
      });
    }

    return () => {
      if (task?.project_id) {
        notebookSocket.leaveProject(task.project_id);
      }
    };
  }, [taskId, task?.project_id]);

  const loadTaskData = async (id: number) => {
    try {
      setLoading(true);

      // Load task details
      const taskResponse = await notebookAPI.tasks.getOne(id);
      const taskData = taskResponse.data.task;
      setTask(taskData);
      setEditForm(taskData);

      // Load comments
      const commentsResponse = await notebookAPI.tasks.getComments(id);
      setComments(commentsResponse.data.comments || []);

      // Load files
      const filesResponse = await notebookAPI.tasks.getFiles(id);
      setFiles(filesResponse.data.files || []);

      // Join project room for real-time updates
      if (taskData.project_id) {
        notebookSocket.joinProject(taskData.project_id);
      }
    } catch (error) {
      console.error('Failed to load task data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!task) return;

    try {
      await notebookAPI.tasks.update(taskId, editForm);
      setTask({ ...task, ...editForm } as Task);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDelete = async () => {
    if (!task) return;
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await notebookAPI.tasks.delete(taskId);
      router.push('/dashboard/notebook/tasks');
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await notebookAPI.tasks.addComment(taskId, newComment);
      setComments([...comments, response.data.comment]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    try {
      await notebookAPI.files.uploadToTask(taskId, selectedFile);
      setSelectedFile(null);
      setShowFileUpload(false);
      loadTaskData(taskId);
    } catch (error) {
      console.error('Failed to upload file:', error);
    }
  };

  const handleFileDownload = async (fileId: number, filename: string) => {
    try {
      const response = await notebookAPI.files.download(fileId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to download file:', error);
    }
  };

  const handleCommentTyping = () => {
    if (task?.project_id) {
      notebookSocket.emitTyping(task.project_id, taskId);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'todo':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading task details...</div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Task not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard/notebook/tasks')}
          >
            ← Back to Tasks
          </Button>
          <h1 className="text-3xl font-bold mt-2">Task Details</h1>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button onClick={() => setIsEditing(true)}>Edit Task</Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete Task
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleUpdate}>Save Changes</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Task Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? (
              <Input
                value={editForm.title || ''}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
                placeholder="Task Title"
              />
            ) : (
              task.title
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              {isEditing ? (
                <Select
                  value={editForm.status || task.status}
                  onValueChange={(value) =>
                    setEditForm({ ...editForm, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="mt-1">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Priority</label>
              {isEditing ? (
                <Select
                  value={editForm.priority || task.priority}
                  onValueChange={(value) =>
                    setEditForm({ ...editForm, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="mt-1">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityBadgeColor(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            {isEditing ? (
              <Textarea
                value={editForm.description || ''}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                placeholder="Task Description"
                rows={4}
              />
            ) : (
              <p className="mt-1 text-gray-600">{task.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Due Date</label>
              {isEditing ? (
                <Input
                  type="datetime-local"
                  value={
                    editForm.due_date
                      ? new Date(editForm.due_date).toISOString().slice(0, 16)
                      : ''
                  }
                  onChange={(e) =>
                    setEditForm({ ...editForm, due_date: e.target.value })
                  }
                />
              ) : (
                <p className="mt-1 text-gray-600">
                  {task.due_date
                    ? new Date(task.due_date).toLocaleString()
                    : 'No due date'}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Assigned To</label>
              <p className="mt-1 text-gray-600">
                {task.assigned_to_name || 'Unassigned'}
              </p>
            </div>
          </div>

          {task.project_name && (
            <div>
              <label className="text-sm font-medium text-gray-700">Project</label>
              <p className="mt-1 text-gray-600">{task.project_name}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Files Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Files ({files.length})</CardTitle>
            <Button onClick={() => setShowFileUpload(!showFileUpload)}>
              {showFileUpload ? 'Cancel' : 'Upload File'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showFileUpload && (
            <div className="mb-4 p-4 border-2 border-dashed border-gray-300 rounded-lg">
              <Input
                type="file"
                onChange={(e) =>
                  setSelectedFile(e.target.files?.[0] || null)
                }
              />
              {selectedFile && (
                <div className="mt-2 flex gap-2">
                  <Button onClick={handleFileUpload}>Upload</Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedFile(null);
                      setShowFileUpload(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          )}

          {files.length === 0 ? (
            <p className="text-gray-500">No files attached</p>
          ) : (
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium">{file.original_name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.file_size / 1024).toFixed(2)} KB •{' '}
                      {new Date(file.uploaded_at).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleFileDownload(file.id, file.original_name)
                    }
                  >
                    Download
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <CardTitle>Comments ({comments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Comment List */}
            {comments.map((comment) => (
              <div key={comment.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{comment.user_name}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))}

            {isTyping && (
              <div className="text-sm text-gray-500 italic">
                Someone is typing...
              </div>
            )}

            {/* New Comment Input */}
            <div className="pt-4 border-t">
              <Textarea
                value={newComment}
                onChange={(e) => {
                  setNewComment(e.target.value);
                  handleCommentTyping();
                }}
                placeholder="Add a comment..."
                rows={3}
              />
              <Button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="mt-2"
              >
                Add Comment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
