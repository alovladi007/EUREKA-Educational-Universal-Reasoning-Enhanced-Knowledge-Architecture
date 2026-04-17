"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Users, ThumbsUp, Plus, Search, Clock, ArrowLeft, Send, Pin, Trash2 } from 'lucide-react';

interface Reply {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  likes: number;
}

interface Discussion {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  replies: Reply[];
  likes: number;
  views: number;
  createdAt: string;
  isPinned?: boolean;
}

const CATEGORIES = ['General', 'MCAT', 'CISSP', 'FE/PE Engineering', 'Patent Bar', 'Security+', 'Study Tips', 'Resources'];

const STORAGE_KEY = 'eureka_community_discussions';

const SEED_DISCUSSIONS: Discussion[] = [
  {
    id: 'seed-1', title: 'Tips for MCAT CARS section?', content: 'I\'m struggling with the CARS section timing. Any strategies for reading passages faster while still maintaining comprehension? I keep running out of time with 2-3 passages left.',
    author: 'PreMedStudent', category: 'MCAT', tags: ['CARS', 'timing', 'strategy'],
    replies: [
      { id: 'r1', author: 'MCATVeteran', content: 'Focus on reading the first and last sentence of each paragraph first to get the structure, then do a full read. Also, don\'t go back to the passage for every question — trust your initial read for main idea questions.', createdAt: new Date(Date.now() - 86400000).toISOString(), likes: 5 },
      { id: 'r2', author: 'ScoreImprover', content: 'I improved from 124 to 129 by doing 1 passage per day timed at 10 minutes. Consistency > cramming for CARS.', createdAt: new Date(Date.now() - 43200000).toISOString(), likes: 3 },
    ],
    likes: 12, views: 89, createdAt: new Date(Date.now() - 172800000).toISOString(), isPinned: true,
  },
  {
    id: 'seed-2', title: 'CISSP Domain 1 vs Domain 3 — which to study first?',
    content: 'I\'m starting my CISSP prep. Should I follow the domain order (start with Security & Risk Management) or jump to Security Architecture first since I have a technical background?',
    author: 'CyberProf', category: 'CISSP', tags: ['study-plan', 'domains'],
    replies: [
      { id: 'r3', author: 'CISSPHolder', content: 'Start with Domain 1. The exam thinks like a manager, not an engineer. Domain 1 sets the governance mindset you need for the entire exam.', createdAt: new Date(Date.now() - 7200000).toISOString(), likes: 8 },
    ],
    likes: 7, views: 45, createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: 'seed-3', title: 'FE EE — Best calculator for the exam?',
    content: 'What calculator are you all using for the FE exam? I want one that handles complex numbers well for circuit analysis.',
    author: 'FutureEngineer', category: 'FE/PE Engineering', tags: ['calculator', 'preparation'],
    replies: [
      { id: 'r4', author: 'PELicensed', content: 'Casio fx-115 ES Plus is the gold standard. It handles complex numbers, matrix operations, and is NCEES-approved. Practice with it before exam day.', createdAt: new Date(Date.now() - 3600000).toISOString(), likes: 6 },
    ],
    likes: 9, views: 67, createdAt: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    id: 'seed-4', title: 'Study group for Patent Bar — January exam',
    content: 'Looking for 2-3 people to form a study group for the Patent Bar. Planning to take it in January. We could meet weekly on Zoom to discuss MPEP chapters and quiz each other.',
    author: 'PatentHopeful', category: 'Patent Bar', tags: ['study-group', 'MPEP'],
    replies: [], likes: 4, views: 23, createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'seed-5', title: 'How I scored 520 on the MCAT — study schedule breakdown',
    content: 'Just got my score back: 520 (130/128/131/131). Here\'s my 3-month study plan:\n\nMonth 1: Content review using EUREKA lessons + Flashcards (2-3 hours/day)\nMonth 2: QBank practice (200+ questions/week) + full-length every Saturday\nMonth 3: Full-lengths only + targeted review of weak areas from analytics\n\nThe analytics dashboard was clutch for identifying my weak spots in Psych/Soc.',
    author: 'MedSchoolBound', category: 'MCAT', tags: ['score-report', 'study-plan', 'success'],
    replies: [
      { id: 'r5', author: 'Aspiring520', content: 'This is incredibly helpful. Did you use any other resources besides EUREKA?', createdAt: new Date(Date.now() - 1800000).toISOString(), likes: 2 },
    ],
    likes: 24, views: 156, createdAt: new Date(Date.now() - 432000000).toISOString(), isPinned: true,
  },
];

function loadDiscussions(): Discussion[] {
  if (typeof window === 'undefined') return SEED_DISCUSSIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) { localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DISCUSSIONS)); return SEED_DISCUSSIONS; }
    return JSON.parse(raw);
  } catch { return SEED_DISCUSSIONS; }
}

function saveDiscussions(discussions: Discussion[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(discussions));
}

export default function CommunityPage() {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [view, setView] = useState<'list' | 'thread' | 'new'>('list');
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // New discussion form
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [newTags, setNewTags] = useState('');

  // Reply form
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => { setDiscussions(loadDiscussions()); setMounted(true); }, []);

  const updateDiscussions = (updated: Discussion[]) => {
    setDiscussions(updated);
    saveDiscussions(updated);
  };

  const createDiscussion = () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    const disc: Discussion = {
      id: `d-${Date.now()}`, title: newTitle.trim(), content: newContent.trim(),
      author: 'You', category: newCategory,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
      replies: [], likes: 0, views: 0,
      createdAt: new Date().toISOString(),
    };
    updateDiscussions([disc, ...discussions]);
    setNewTitle(''); setNewContent(''); setNewTags('');
    setView('list');
  };

  const addReply = (discussionId: string) => {
    if (!replyContent.trim()) return;
    const reply: Reply = {
      id: `r-${Date.now()}`, author: 'You', content: replyContent.trim(),
      createdAt: new Date().toISOString(), likes: 0,
    };
    const updated = discussions.map(d =>
      d.id === discussionId ? { ...d, replies: [...d.replies, reply] } : d
    );
    updateDiscussions(updated);
    setReplyContent('');
  };

  const likeDiscussion = (id: string) => {
    updateDiscussions(discussions.map(d => d.id === id ? { ...d, likes: d.likes + 1 } : d));
  };

  const likeReply = (discussionId: string, replyId: string) => {
    updateDiscussions(discussions.map(d =>
      d.id === discussionId ? { ...d, replies: d.replies.map(r => r.id === replyId ? { ...r, likes: r.likes + 1 } : r) } : d
    ));
  };

  const deleteDiscussion = (id: string) => {
    if (confirm('Delete this discussion?')) {
      updateDiscussions(discussions.filter(d => d.id !== id));
      if (activeThread === id) { setView('list'); setActiveThread(null); }
    }
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const min = Math.floor(diff / 60000);
    if (min < 60) return `${min}m ago`;
    const hrs = Math.floor(min / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  const filtered = discussions
    .filter(d => !activeCategory || d.category === activeCategory)
    .filter(d => !searchQuery || d.title.toLowerCase().includes(searchQuery.toLowerCase()) || d.content.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const thread = activeThread ? discussions.find(d => d.id === activeThread) : null;

  if (!mounted) return <div className="space-y-6"><div className="h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" /></div>;

  // Thread view
  if (view === 'thread' && thread) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => { setView('list'); setActiveThread(null); }}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              {thread.isPinned && <Badge variant="secondary"><Pin className="h-3 w-3 mr-1" />Pinned</Badge>}
              <Badge>{thread.category}</Badge>
              {thread.tags.map(t => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}
            </div>
            <CardTitle className="text-xl">{thread.title}</CardTitle>
            <CardDescription className="flex items-center gap-3">
              <span className="font-medium">{thread.author}</span>
              <span>{timeAgo(thread.createdAt)}</span>
              <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" />{thread.likes}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap mb-4">{thread.content}</p>
            <Button variant="ghost" size="sm" onClick={() => likeDiscussion(thread.id)} className="gap-1">
              <ThumbsUp className="h-4 w-4" /> Like ({thread.likes})
            </Button>
          </CardContent>
        </Card>

        {/* Replies */}
        <div className="space-y-3">
          <h3 className="font-semibold">{thread.replies.length} Replies</h3>
          {thread.replies.map(reply => (
            <Card key={reply.id} className="bg-gray-50 dark:bg-gray-900/50">
              <CardContent className="pt-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{reply.author}</span>
                    <span className="text-muted-foreground">{timeAgo(reply.createdAt)}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => likeReply(thread.id, reply.id)} className="gap-1 text-xs">
                    <ThumbsUp className="h-3 w-3" /> {reply.likes}
                  </Button>
                </div>
                <p className="text-sm whitespace-pre-wrap">{reply.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reply form */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex gap-2">
              <textarea
                className="flex-1 min-h-[80px] p-3 rounded-lg border bg-background text-sm resize-none"
                placeholder="Write a reply..."
                value={replyContent}
                onChange={e => setReplyContent(e.target.value)}
              />
            </div>
            <div className="flex justify-end mt-2">
              <Button size="sm" onClick={() => addReply(thread.id)} disabled={!replyContent.trim()} className="gap-1">
                <Send className="h-4 w-4" /> Reply
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // New discussion form
  if (view === 'new') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setView('list')}><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
          <h2 className="text-xl font-bold">New Discussion</h2>
        </div>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Title</label>
              <Input placeholder="What's your question or topic?" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Category</label>
              <select className="w-full p-2 rounded-lg border bg-background text-sm" value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Content</label>
              <textarea
                className="w-full min-h-[150px] p-3 rounded-lg border bg-background text-sm resize-none"
                placeholder="Share your thoughts, ask a question, or start a discussion..."
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Tags (comma-separated)</label>
              <Input placeholder="e.g., study-tips, MCAT, biochem" value={newTags} onChange={e => setNewTags(e.target.value)} />
            </div>
            <Button onClick={createDiscussion} disabled={!newTitle.trim() || !newContent.trim()} className="w-full gap-1">
              <Plus className="h-4 w-4" /> Post Discussion
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Discussion list
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Community</h1>
          <p className="text-muted-foreground">Discussion forums, study tips, and peer support</p>
        </div>
        <Button onClick={() => setView('new')} className="gap-1"><Plus className="h-4 w-4" /> New Discussion</Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-4 flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-blue-500" />
            <div><p className="text-2xl font-bold">{discussions.length}</p><p className="text-xs text-muted-foreground">Discussions</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 flex items-center gap-3">
            <Users className="h-8 w-8 text-green-500" />
            <div><p className="text-2xl font-bold">{new Set(discussions.flatMap(d => [d.author, ...d.replies.map(r => r.author)])).size}</p><p className="text-xs text-muted-foreground">Contributors</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 flex items-center gap-3">
            <ThumbsUp className="h-8 w-8 text-purple-500" />
            <div><p className="text-2xl font-bold">{discussions.reduce((s, d) => s + d.replies.length, 0)}</p><p className="text-xs text-muted-foreground">Replies</p></div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search discussions..." className="pl-9" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setActiveCategory(null)} className={`px-3 py-1 rounded-full text-xs font-medium transition ${!activeCategory ? 'bg-primary text-primary-foreground' : 'bg-gray-100 dark:bg-gray-800 text-muted-foreground hover:bg-gray-200'}`}>All</button>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(activeCategory === cat ? null : cat)} className={`px-3 py-1 rounded-full text-xs font-medium transition ${activeCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-gray-100 dark:bg-gray-800 text-muted-foreground hover:bg-gray-200'}`}>{cat}</button>
        ))}
      </div>

      {/* Discussion List */}
      <div className="space-y-3">
        {filtered.map(disc => (
          <Card key={disc.id} className="cursor-pointer hover:shadow-md transition-all" onClick={() => { setActiveThread(disc.id); setView('thread'); }}>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {disc.isPinned && <Pin className="h-3 w-3 text-amber-500" />}
                    <h3 className="font-semibold text-sm hover:text-primary transition">{disc.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{disc.content}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{disc.author}</span>
                    <Badge variant="outline" className="text-[10px]">{disc.category}</Badge>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{timeAgo(disc.createdAt)}</span>
                    <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" />{disc.replies.length}</span>
                    <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" />{disc.likes}</span>
                  </div>
                </div>
                {disc.author === 'You' && (
                  <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); deleteDiscussion(disc.id); }}>
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No discussions found. Start the conversation!</p>
          </div>
        )}
      </div>
    </div>
  );
}
