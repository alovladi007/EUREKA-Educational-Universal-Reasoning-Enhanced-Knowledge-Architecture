"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MessageCircle,
  Send,
  Plus,
  Bot,
  User,
  Trash2,
  BarChart3,
  Loader2,
  Book,
  Stethoscope,
  Brain,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";

const API_BASE_URL = "http://localhost:8030/ai-tutor";

interface Message {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
  metadata?: any;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  context_type?: string;
}

interface ConversationStats {
  total_messages: number;
  user_messages: number;
  assistant_messages: number;
  total_tokens: number;
  created_at: string;
  last_message_at: string;
}

export default function AITutorPage() {
  const queryClient = useQueryClient();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [showStats, setShowStats] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations list
  const { data: conversations = [] } = useQuery<Conversation[]>({
    queryKey: ["conversations"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/conversations`);
      if (!response.ok) throw new Error("Failed to fetch conversations");
      return response.json();
    },
  });

  // Fetch messages for selected conversation
  const { data: messages = [], isLoading: loadingMessages } = useQuery<Message[]>({
    queryKey: ["messages", selectedConversationId],
    queryFn: async () => {
      if (!selectedConversationId) return [];
      const response = await fetch(
        `${API_BASE_URL}/conversations/${selectedConversationId}/messages`
      );
      if (!response.ok) throw new Error("Failed to fetch messages");
      return response.json();
    },
    enabled: !!selectedConversationId,
  });

  // Fetch conversation stats
  const { data: stats } = useQuery<ConversationStats>({
    queryKey: ["stats", selectedConversationId],
    queryFn: async () => {
      if (!selectedConversationId) return null;
      const response = await fetch(
        `${API_BASE_URL}/conversations/${selectedConversationId}/stats`
      );
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json();
    },
    enabled: !!selectedConversationId && showStats,
  });

  // Create new conversation
  const createConversationMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${API_BASE_URL}/conversations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "New Medical Conversation",
          context_type: "general",
        }),
      });
      if (!response.ok) throw new Error("Failed to create conversation");
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      setSelectedConversationId(data.id);
    },
  });

  // Send message
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_id: selectedConversationId,
          message,
        }),
      });
      if (!response.ok) throw new Error("Failed to send message");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", selectedConversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      setInputMessage("");
    },
  });

  // Delete conversation
  const deleteConversationMutation = useMutation({
    mutationFn: async (conversationId: string) => {
      const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete conversation");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      if (selectedConversationId === deleteConversationMutation.variables) {
        setSelectedConversationId(null);
      }
    },
  });

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !selectedConversationId) return;
    sendMessageMutation.mutate(inputMessage);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">AI Medical Tutor</h1>
        <p className="text-muted-foreground mt-2">
          Get personalized help with medical concepts using evidence-based explanations
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6 h-[calc(100%-5rem)]">
        {/* Sidebar - Conversations List */}
        <div className="col-span-3">
          <Card className="h-full flex flex-col">
            <CardHeader className="flex-none">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Conversations</CardTitle>
                <Button
                  size="sm"
                  onClick={() => createConversationMutation.mutate()}
                  disabled={createConversationMutation.isPending}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
              <div className="h-full overflow-y-auto">
                <div className="space-y-2 p-4">
                  {conversations.length === 0 && (
                    <div className="text-center text-muted-foreground text-sm py-8">
                      <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No conversations yet</p>
                      <p className="text-xs mt-1">Click + to start</p>
                    </div>
                  )}

                  {conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversationId(conv.id)}
                      className={cn(
                        "w-full text-left p-3 rounded-lg border transition-colors",
                        selectedConversationId === conv.id
                          ? "bg-primary/10 border-primary"
                          : "hover:bg-accent border-transparent"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{conv.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(conv.updated_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteConversationMutation.mutate(conv.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Chat Area */}
        <div className="col-span-9">
          <Card className="h-full flex flex-col">
            {!selectedConversationId ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center max-w-md">
                  <Bot className="w-16 h-16 mx-auto mb-4 text-primary" />
                  <h2 className="text-2xl font-bold mb-2">Welcome to AI Medical Tutor</h2>
                  <p className="text-muted-foreground mb-6">
                    Your intelligent learning companion for medical education. Get personalized
                    explanations, ask questions, and deepen your understanding.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 rounded-lg bg-accent">
                      <Stethoscope className="w-6 h-6 mb-2 text-primary" />
                      <p className="text-sm font-medium">Clinical Concepts</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Pathophysiology, diagnosis, treatment
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-accent">
                      <Brain className="w-6 h-6 mb-2 text-primary" />
                      <p className="text-sm font-medium">Basic Sciences</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Anatomy, physiology, biochemistry
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-accent">
                      <Book className="w-6 h-6 mb-2 text-primary" />
                      <p className="text-sm font-medium">Exam Preparation</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        USMLE-style explanations
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-accent">
                      <Heart className="w-6 h-6 mb-2 text-primary" />
                      <p className="text-sm font-medium">Clinical Reasoning</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        DDx, diagnostic approach
                      </p>
                    </div>
                  </div>
                  <Button
                    size="lg"
                    onClick={() => createConversationMutation.mutate()}
                    disabled={createConversationMutation.isPending}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Start New Conversation
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <CardHeader className="flex-none border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>
                        {conversations.find((c) => c.id === selectedConversationId)?.title ||
                          "Conversation"}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Evidence-based medical education assistance
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowStats(!showStats)}
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        {showStats ? "Hide" : "Show"} Stats
                      </Button>
                    </div>
                  </div>

                  {/* Stats Panel */}
                  {showStats && stats && (
                    <div className="mt-4 grid grid-cols-4 gap-4">
                      <div className="p-3 rounded-lg bg-accent">
                        <p className="text-xs text-muted-foreground">Total Messages</p>
                        <p className="text-2xl font-bold">{stats.total_messages}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-accent">
                        <p className="text-xs text-muted-foreground">Your Messages</p>
                        <p className="text-2xl font-bold">{stats.user_messages}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-accent">
                        <p className="text-xs text-muted-foreground">AI Responses</p>
                        <p className="text-2xl font-bold">{stats.assistant_messages}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-accent">
                        <p className="text-xs text-muted-foreground">Tokens Used</p>
                        <p className="text-2xl font-bold">{stats.total_tokens.toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                </CardHeader>

                {/* Messages Area */}
                <CardContent className="flex-1 overflow-hidden p-0">
                  <div className="h-full overflow-y-auto p-6">
                    {loadingMessages && (
                      <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                      </div>
                    )}

                    {!loadingMessages && messages.length === 0 && (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center text-muted-foreground">
                          <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p className="text-lg font-medium">Start the conversation</p>
                          <p className="text-sm mt-1">
                            Ask a question about any medical topic
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-6">
                      {messages.map((message, index) => (
                        <div
                          key={message.id}
                          className={cn(
                            "flex gap-3",
                            message.role === "user" ? "justify-end" : "justify-start"
                          )}
                        >
                          {message.role === "assistant" && (
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <Bot className="w-5 h-5 text-primary" />
                              </div>
                            </div>
                          )}

                          <div
                            className={cn(
                              "max-w-[80%] rounded-lg p-4",
                              message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-accent"
                            )}
                          >
                            <div className="whitespace-pre-wrap text-sm leading-relaxed">
                              {message.content}
                            </div>
                            <div
                              className={cn(
                                "text-xs mt-2",
                                message.role === "user"
                                  ? "text-primary-foreground/70"
                                  : "text-muted-foreground"
                              )}
                            >
                              {new Date(message.created_at).toLocaleTimeString()}
                            </div>
                          </div>

                          {message.role === "user" && (
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                                <User className="w-5 h-5 text-primary-foreground" />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>
                </CardContent>

                {/* Input Area */}
                <div className="flex-none border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask about pathophysiology, clinical reasoning, exam questions..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={sendMessageMutation.isPending}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={
                        !inputMessage.trim() ||
                        sendMessageMutation.isPending ||
                        !selectedConversationId
                      }
                      size="lg"
                    >
                      {sendMessageMutation.isPending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground mt-2">
                    Powered by Claude Sonnet 4. Press Enter to send, Shift+Enter for new line.
                  </p>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
