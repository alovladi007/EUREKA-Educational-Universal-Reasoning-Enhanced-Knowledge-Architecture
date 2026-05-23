'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Clock, BookOpen, Play, Pause, Volume2, VolumeX, Maximize, StickyNote, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Note {
  id: string;
  note_text: string;
  timestamp_seconds: number;
  tags: string[];
  is_important: boolean;
  color_code?: string;
  created_at: string;
}

interface ContentItem {
  id: string;
  title: string;
  description: string;
  duration_seconds: number;
  file_url: string;
}

export default function VideoPlayerPage() {
  const params = useParams();
  const contentId = params.contentId as string;

  const videoRef = useRef<HTMLVideoElement>(null);

  const [content, setContent] = useState<ContentItem | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (contentId) {
      fetchContent();
      fetchNotes();
    }
  }, [contentId]);

  const fetchContent = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3010/api/packages/${contentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setContent(data.package);
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3010/api/videos/${contentId}/notes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotes(data.notes || []);
      }
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    }
  };

  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleMuteToggle = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const time = parseFloat(e.target.value);
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleSaveNote = async () => {
    if (!currentNote.trim()) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3010/api/videos/${contentId}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          note_text: currentNote,
          timestamp_seconds: currentTime,
          is_important: false,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setNotes([...notes, data.note]);
        setCurrentNote('');
      }
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3010/api/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setNotes(notes.filter(n => n.id !== noteId));
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const jumpToTimestamp = (timestamp: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = timestamp;
    setCurrentTime(timestamp);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Content Not Found</h2>
          <p className="text-muted-foreground">The requested video could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Video Player Section */}
      <div className="flex-1 flex flex-col">
        {/* Video Container */}
        <div className="flex-1 bg-black flex items-center justify-center relative">
          <video
            ref={videoRef}
            className="w-full h-full"
            src={content.file_url || 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4'}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* Video Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            {/* Progress Bar */}
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full mb-2 cursor-pointer"
            />

            {/* Control Buttons */}
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handlePlayPause}
                  className="text-white hover:text-white"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleMuteToggle}
                  className="text-white hover:text-white"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>

                <span className="text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <Button
                size="sm"
                variant="ghost"
                onClick={handleFullscreen}
                className="text-white hover:text-white"
              >
                <Maximize className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Video Info */}
        <div className="p-6 border-t">
          <h1 className="text-2xl font-bold mb-2">{content.title}</h1>
          <p className="text-muted-foreground mb-4">{content.description}</p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatTime(content.duration_seconds || 0)}</span>
            </div>
            <div className="flex items-center gap-1">
              <StickyNote className="w-4 h-4" />
              <span>{notes.length} Notes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Sidebar */}
      <div className="w-96 border-l flex flex-col bg-muted/10">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Study Notes
          </h2>
        </div>

        <Tabs defaultValue="notes" className="flex-1 flex flex-col">
          <TabsList className="mx-4 mt-2">
            <TabsTrigger value="notes" className="flex-1">My Notes</TabsTrigger>
            <TabsTrigger value="add" className="flex-1">Add Note</TabsTrigger>
          </TabsList>

          <TabsContent value="notes" className="flex-1 m-0">
            <ScrollArea className="h-full p-4">
              {notes.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <StickyNote className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No notes yet</p>
                  <p className="text-sm">Start taking notes while watching!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notes
                    .sort((a, b) => a.timestamp_seconds - b.timestamp_seconds)
                    .map((note) => (
                      <Card key={note.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between mb-2">
                            <Badge
                              variant="secondary"
                              className="cursor-pointer"
                              onClick={() => jumpToTimestamp(note.timestamp_seconds)}
                            >
                              <Clock className="w-3 h-3 mr-1" />
                              {formatTime(note.timestamp_seconds)}
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteNote(note.id)}
                              className="h-6 w-6 p-0"
                            >
                              <Trash2 className="w-3 h-3 text-red-500" />
                            </Button>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{note.note_text}</p>
                          {note.tags && note.tags.length > 0 && (
                            <div className="flex gap-1 mt-2">
                              {note.tags.map((tag, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="add" className="flex-1 m-0 p-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Current Timestamp: {formatTime(currentTime)}
                </label>
                <Textarea
                  placeholder="Type your notes here..."
                  value={currentNote}
                  onChange={(e) => setCurrentNote(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>

              <Button
                onClick={handleSaveNote}
                className="w-full"
                disabled={!currentNote.trim()}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Note
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Your note will be saved at {formatTime(currentTime)}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
