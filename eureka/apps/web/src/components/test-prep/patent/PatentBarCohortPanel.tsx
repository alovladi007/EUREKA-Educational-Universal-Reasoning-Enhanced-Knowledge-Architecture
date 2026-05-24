'use client';

/**
 * Patent Bar cohort UI (v2): real test-prep API only — no demo roster or offline placeholders.
 * If you still see "Offline preview" or Alex/Jordan/Sam, the app is serving a stale bundle;
 * delete `.next`, restart `npm run dev`, hard-refresh (Cmd+Shift+R).
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users, MessageCircle, Layers, Loader2, Send, UserPlus } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { getInitials, getUserDisplayName, getUserInitials } from '@/lib/utils';
import { useAuthStore, useAuthHasHydrated } from '@/stores/auth';

const EXAM = 'PATENT_BAR';

type Learner = {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  tagline: string | null;
};

type GroupRow = {
  id: string;
  name: string;
  description: string | null;
  member_count: number;
  is_member: boolean;
};

type Msg = {
  id: string;
  user_id: string;
  display_name: string | null;
  body: string;
  created_at: string | null;
};

export function PatentBarCohortPanel() {
  const hydrated = useAuthHasHydrated();
  // Until the zustand persist middleware has merged localStorage state into the
  // store, treat authUser as null on BOTH server and client. This makes the
  // initial render deterministic and avoids React error #418/#423 hydration
  // mismatch when the persisted auth state arrives a tick later.
  const authUserRaw = useAuthStore((s) => s.user);
  const authUser = hydrated ? authUserRaw : null;
  const [loading, setLoading] = useState(true);
  const [learners, setLearners] = useState<Learner[]>([]);
  const [groups, setGroups] = useState<GroupRow[]>([]);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [chatScope, setChatScope] = useState<'course' | 'group'>('course');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [composer, setComposer] = useState('');
  const [sending, setSending] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [tab, setTab] = useState('classmates');

  const uid = authUser?.id || '';
  const myName = useMemo(() => (authUser ? getUserDisplayName(authUser) : ''), [authUser]);

  const refreshGroups = useCallback(async () => {
    if (!uid) {
      setGroups([]);
      return;
    }
    const g = await apiClient.getPatentStudyGroups(EXAM, uid).catch(() => ({ groups: [] }));
    setGroups(g.groups || []);
  }, [uid]);

  const refreshMessages = useCallback(async () => {
    const gid = chatScope === 'group' ? selectedGroupId : null;
    if (chatScope === 'group' && !gid) {
      setMessages([]);
      return;
    }
    const m = await apiClient
      .getPatentCommunityMessages({
        exam_type: EXAM,
        group_id: gid,
        limit: 100,
      })
      .catch(() => ({ messages: [] }));
    setMessages(m.messages || []);
  }, [chatScope, selectedGroupId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        if (authUser?.id && myName) {
          await apiClient
            .upsertPatentCommunityProfile({
              exam_type: EXAM,
              user_id: authUser.id,
              display_name: myName,
              avatar_url: authUser.avatar_url || undefined,
            })
            .catch(() => {});
        }
        if (cancelled) return;
        const [r, g] = await Promise.all([
          apiClient.getPatentCommunityRoster(EXAM).catch(() => ({ learners: [] })),
          uid ? apiClient.getPatentStudyGroups(EXAM, uid).catch(() => ({ groups: [] })) : Promise.resolve({ groups: [] }),
        ]);
        if (cancelled) return;
        setLearners(r.learners || []);
        setGroups(g.groups || []);
        const m = await apiClient
          .getPatentCommunityMessages({ exam_type: EXAM, group_id: null, limit: 100 })
          .catch(() => ({ messages: [] }));
        if (!cancelled) setMessages(m.messages || []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [authUser?.id, authUser?.avatar_url, myName, uid]);

  useEffect(() => {
    refreshMessages();
  }, [chatScope, selectedGroupId, refreshMessages]);

  useEffect(() => {
    refreshGroups();
  }, [uid, refreshGroups]);

  const sendMessage = async () => {
    const body = composer.trim();
    if (!body || !uid) return;
    setSending(true);
    try {
      await apiClient.postPatentCommunityMessage({
        exam_type: EXAM,
        user_id: uid,
        display_name: myName,
        body,
        group_id: chatScope === 'group' ? selectedGroupId : null,
      });
      setComposer('');
      await refreshMessages();
    } finally {
      setSending(false);
    }
  };

  const createGroup = async () => {
    const name = newGroupName.trim();
    if (!name || !uid) return;
    setCreatingGroup(true);
    try {
      await apiClient.createPatentStudyGroup({
        exam_type: EXAM,
        name,
        description: newGroupDesc.trim() || undefined,
        created_by: uid,
      });
      setNewGroupName('');
      setNewGroupDesc('');
      await refreshGroups();
    } finally {
      setCreatingGroup(false);
    }
  };

  const joinGroup = async (id: string) => {
    if (!uid) return;
    await apiClient.joinPatentStudyGroup(id, uid);
    await refreshGroups();
  };

  const openGroupChat = (id: string) => {
    setSelectedGroupId(id);
    setChatScope('group');
    setTab('chat');
  };

  const mentionPeer = (name: string) => {
    setComposer((c) => (c ? `${c} @${name.replace(/\s+/g, '')} ` : `@${name.replace(/\s+/g, '')} `));
    setTab('chat');
    setChatScope('course');
    setSelectedGroupId(null);
  };

  const others = learners.filter((L) => L.user_id !== uid);

  return (
    <Card className="p-0 overflow-hidden border-primary/15 shadow-sm" data-testid="patent-bar-cohort-v2">
      <div className="px-5 py-4 border-b bg-muted/40">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2 flex-wrap">
              <Users className="h-5 w-5 text-primary" />
              Cohort &amp; study groups
              <span className="text-xs font-normal text-muted-foreground border rounded px-1.5 py-0.5">v2 · API roster</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Classmates who have joined this exam roster in the test-prep service. Your name and photo come from{' '}
              <Link href="/dashboard/profile" className="text-primary underline font-medium">
                My Profile
              </Link>{' '}
              (same image as the header and sidebar).
            </p>
          </div>
          {loading && (
            <Badge variant="secondary" className="gap-1">
              <Loader2 className="h-3 w-3 animate-spin" /> Loading
            </Badge>
          )}
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="p-4 pt-2">
        <TabsList className="grid w-full max-w-lg grid-cols-3">
          <TabsTrigger value="classmates" className="gap-1.5">
            <Users className="h-3.5 w-3.5" /> Classmates
          </TabsTrigger>
          <TabsTrigger value="groups" className="gap-1.5">
            <Layers className="h-3.5 w-3.5" /> Groups
          </TabsTrigger>
          <TabsTrigger value="chat" className="gap-1.5">
            <MessageCircle className="h-3.5 w-3.5" /> Chat
          </TabsTrigger>
        </TabsList>

        <TabsContent value="classmates" className="mt-4 space-y-6">
          {authUser && (
            <div className="rounded-lg border bg-card p-4 flex flex-wrap items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarImage src={authUser.avatar_url} alt={myName} />
                <AvatarFallback>{getUserInitials(authUser)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="font-medium">You</p>
                <p className="text-sm text-muted-foreground">
                  Photo and display name:{' '}
                  <Link href="/dashboard/profile" className="text-primary underline">
                    edit in My Profile
                  </Link>
                  .
                </p>
              </div>
            </div>
          )}

          {!authUser && (
            <p className="text-sm text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900 rounded-md px-3 py-2">
              Sign in and load your account so your name and photo can appear in the cohort directory.
            </p>
          )}

          <div>
            <p className="text-sm font-medium mb-3">Other learners</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((L) => (
                <div
                  key={L.user_id}
                  className="flex items-start gap-3 rounded-lg border p-3 bg-background/80"
                >
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={L.avatar_url || undefined} alt={L.display_name} />
                    <AvatarFallback>{getInitials(L.display_name, undefined)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{L.display_name}</p>
                    {L.tagline && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{L.tagline}</p>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-1 h-7 px-2 text-xs"
                      onClick={() => mentionPeer(L.display_name)}
                    >
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Mention in chat
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {others.length === 0 && !loading && (
              <p className="text-sm text-muted-foreground">
                No other learners on the roster yet. When others enroll in Patent Bar and open this hub, they appear
                here.
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="groups" className="mt-4 space-y-4">
          <div className="rounded-lg border p-4 space-y-3 bg-muted/20">
            <p className="text-sm font-medium">Create a study group</p>
            <Input
              placeholder="Group name (e.g. Weekend MPEP sprints)"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              disabled={!uid}
            />
            <Textarea
              placeholder="Optional description — topics, meeting cadence, etc."
              value={newGroupDesc}
              onChange={(e) => setNewGroupDesc(e.target.value)}
              rows={2}
              disabled={!uid}
            />
            <Button onClick={createGroup} disabled={creatingGroup || !newGroupName.trim() || !uid}>
              {creatingGroup ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4 mr-2" />}
              Create group
            </Button>
            {!uid && (
              <p className="text-xs text-muted-foreground">Sign in to create or join groups.</p>
            )}
          </div>

          <div className="space-y-2">
            {groups.map((g) => (
              <div
                key={g.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3"
              >
                <div>
                  <p className="font-medium">{g.name}</p>
                  {g.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">{g.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {g.member_count} member{g.member_count === 1 ? '' : 's'}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!g.is_member && (
                    <Button size="sm" variant="secondary" onClick={() => joinGroup(g.id)} disabled={!uid}>
                      Join
                    </Button>
                  )}
                  <Button size="sm" variant="default" onClick={() => openGroupChat(g.id)} disabled={!g.is_member}>
                    Open chat
                  </Button>
                </div>
              </div>
            ))}
            {groups.length === 0 && !loading && (
              <p className="text-sm text-muted-foreground">No groups yet — create one above.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="chat" className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-medium text-muted-foreground">Channel</span>
            <Button
              size="sm"
              variant={chatScope === 'course' ? 'default' : 'outline'}
              onClick={() => {
                setChatScope('course');
                setSelectedGroupId(null);
              }}
            >
              Course-wide
            </Button>
            <select
              className="text-sm border rounded-md px-2 py-1.5 bg-background"
              value={selectedGroupId || ''}
              onChange={(e) => {
                const v = e.target.value;
                if (!v) {
                  setChatScope('course');
                  setSelectedGroupId(null);
                } else {
                  setChatScope('group');
                  setSelectedGroupId(v);
                }
              }}
            >
              <option value="">— Group thread —</option>
              {groups.filter((g) => g.is_member).map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
          {chatScope === 'group' && !selectedGroupId && (
            <p className="text-xs text-amber-700 dark:text-amber-300">Join a group first, then pick it here.</p>
          )}

          <div className="h-56 overflow-y-auto rounded-md border bg-muted/20 p-3 space-y-3">
            {messages.map((m) => {
              const mine = m.user_id === uid;
              return (
                <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                      mine ? 'bg-primary text-primary-foreground' : 'bg-background border'
                    }`}
                  >
                    {!mine && (
                      <p className="text-[10px] uppercase tracking-wide opacity-80 mb-1">
                        {m.display_name || m.user_id}
                      </p>
                    )}
                    <p className="whitespace-pre-wrap break-words">{m.body}</p>
                  </div>
                </div>
              );
            })}
            {messages.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                No messages yet — say hello to your cohort.
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Textarea
              placeholder={
                !uid
                  ? 'Sign in to post…'
                  : chatScope === 'group' && !selectedGroupId
                    ? 'Select a group channel…'
                    : 'Write a message…'
              }
              value={composer}
              onChange={(e) => setComposer(e.target.value)}
              rows={2}
              disabled={!uid || (chatScope === 'group' && !selectedGroupId)}
              className="flex-1 min-h-[72px]"
            />
            <Button
              className="self-end"
              onClick={sendMessage}
              disabled={
                sending ||
                !uid ||
                !composer.trim() ||
                (chatScope === 'group' && !selectedGroupId)
              }
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
