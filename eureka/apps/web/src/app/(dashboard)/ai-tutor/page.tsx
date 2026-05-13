'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Send,
  BookOpen,
  Code,
  Calculator,
  Sparkles,
  Brain,
  Rocket,
  Lightbulb,
  Copy,
  Check,
  Play,
  Terminal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  contains_code?: boolean;
  contains_math?: boolean;
}

interface Session {
  id: string;
  subject_domain: string;
  topic?: string;
  difficulty_level: string;
  is_active: boolean;
  total_messages: number;
}

const subjectDomains = [
  { value: 'mathematics', label: 'Mathematics', icon: Calculator, color: 'blue' },
  { value: 'physics', label: 'Physics', icon: Rocket, color: 'purple' },
  { value: 'chemistry', label: 'Chemistry', icon: Sparkles, color: 'green' },
  { value: 'biology', label: 'Biology', icon: Lightbulb, color: 'emerald' },
  { value: 'computer_science', label: 'Computer Science', icon: Code, color: 'indigo' },
  { value: 'engineering', label: 'Engineering', icon: Brain, color: 'orange' },
];

const difficultyLevels = [
  { value: 'elementary', label: 'Elementary' },
  { value: 'middle_school', label: 'Middle School' },
  { value: 'high_school', label: 'High School' },
  { value: 'undergraduate', label: 'Undergraduate' },
  { value: 'graduate', label: 'Graduate' },
  { value: 'expert', label: 'Expert' },
];

export default function AITutorPage() {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [selectedSubject, setSelectedSubject] = useState('mathematics');
  const [selectedDifficulty, setSelectedDifficulty] = useState('undergraduate');
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNewSessionDialog, setShowNewSessionDialog] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Code execution state
  const [codeToExecute, setCodeToExecute] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('python');
  const [codeOutput, setCodeOutput] = useState('');
  const [isExecutingCode, setIsExecutingCode] = useState(false);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const createSession = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3011/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject_domain: selectedSubject,
          difficulty_level: selectedDifficulty,
          session_type: 'concept_learning',
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCurrentSession(data.session);
        setShowNewSessionDialog(false);

        // Add welcome message
        const welcomeMessage: Message = {
          id: 'welcome',
          role: 'assistant',
          content: `Hello! I'm your AI tutor for ${getSubjectLabel(selectedSubject)}. I'm here to help you learn and understand concepts at the ${selectedDifficulty.replace('_', ' ')} level. What would you like to explore today?`,
          timestamp: new Date().toISOString(),
        };
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !currentSession) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3011/api/sessions/${currentSession.id}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: inputMessage,
        }),
      });

      const data = await response.json();
      if (data.success) {
        const aiMessage: Message = {
          id: data.message.id,
          role: 'assistant',
          content: data.message.content,
          timestamp: data.message.created_at,
          contains_code: data.message.contains_code,
          contains_math: data.message.contains_math,
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your message. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const executeCode = async () => {
    if (!codeToExecute.trim()) return;

    setIsExecutingCode(true);
    setCodeOutput('Executing code...');

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3011/api/code/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          language: codeLanguage,
          code: codeToExecute,
          session_id: currentSession?.id,
        }),
      });

      const data = await response.json();
      if (data.success) {
        const result = data.result;
        let output = '';

        if (result.success) {
          output = `✅ Execution successful!\n\n`;
          if (result.stdout) {
            output += `Output:\n${result.stdout}`;
          }
          if (result.execution_time_ms) {
            output += `\n\nExecution time: ${result.execution_time_ms}ms`;
          }
        } else {
          output = `❌ Execution failed\n\n`;
          if (result.stderr) {
            output += `Error:\n${result.stderr}`;
          }
          if (result.error) {
            output += `\n${result.error}`;
          }
        }

        setCodeOutput(output);
      }
    } catch (error) {
      console.error('Code execution error:', error);
      setCodeOutput('❌ Failed to execute code. Please try again.');
    } finally {
      setIsExecutingCode(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getSubjectLabel = (value: string) => {
    return subjectDomains.find(s => s.value === value)?.label || value;
  };

  const getSubjectIcon = (value: string) => {
    const subject = subjectDomains.find(s => s.value === value);
    return subject ? <subject.icon className="w-5 h-5" /> : null;
  };

  if (showNewSessionDialog) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Brain className="w-16 h-16 text-purple-600" />
              </div>
              <CardTitle className="text-3xl">AI Tutor</CardTitle>
              <CardDescription className="text-lg">
                Your personal expert in Math, Science, Engineering, and Technology
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Subject Selection */}
              <div>
                <label className="block text-sm font-medium mb-3">Select Subject</label>
                <div className="grid grid-cols-2 gap-3">
                  {subjectDomains.map((subject) => {
                    const Icon = subject.icon;
                    return (
                      <button
                        key={subject.value}
                        onClick={() => setSelectedSubject(subject.value)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          selectedSubject === subject.value
                            ? `border-${subject.color}-500 bg-${subject.color}-50`
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{subject.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Difficulty Level */}
              <div>
                <label className="block text-sm font-medium mb-2">Difficulty Level</label>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {difficultyLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Features List */}
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-medium mb-2">What I can help you with:</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Step-by-step problem solving with detailed explanations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Code execution and debugging for programming problems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Mathematical equation solving with symbolic math</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Conceptual explanations and real-world examples</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Adaptive learning tailored to your level</span>
                  </li>
                </ul>
              </div>

              <Button onClick={createSession} size="lg" className="w-full">
                <Sparkles className="w-4 h-4 mr-2" />
                Start Learning Session
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getSubjectIcon(selectedSubject)}
              <div>
                <h2 className="text-lg font-semibold">{getSubjectLabel(selectedSubject)} Tutor</h2>
                <p className="text-sm text-muted-foreground">
                  {difficultyLevels.find(d => d.value === selectedDifficulty)?.label} Level
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowNewSessionDialog(true);
                setMessages([]);
                setCurrentSession(null);
              }}
            >
              New Session
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown
                        components={{
                          code({ className, children, ...props }) {
                            // react-markdown 10 dropped the `inline` prop; the
                            // canonical replacement is to detect a `language-*`
                            // class on the element — block code blocks always
                            // carry it, inline `code` spans don't.
                            const match = /language-(\w+)/.exec(className || '');
                            const code = String(children).replace(/\n$/, '');
                            const isBlock = Boolean(match);

                            return isBlock ? (
                              <div className="relative">
                                <button
                                  onClick={() => copyCode(code)}
                                  className="absolute right-2 top-2 p-1 rounded bg-background/50 hover:bg-background"
                                >
                                  {copiedCode === code ? (
                                    <Check className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </button>
                                <SyntaxHighlighter
                                  // react-syntax-highlighter's TS types
                                  // declare `style` as Record<string, CSSProperties>
                                  // but the imported prism theme is exported as
                                  // a CSSProperties literal. Known typing gap.
                                  style={vscDarkPlus as unknown as Record<string, React.CSSProperties>}
                                  language={match![1]}
                                  PreTag="div"
                                >
                                  {code}
                                </SyntaxHighlighter>
                              </div>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                  <p className="text-xs mt-2 opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="max-w-4xl mx-auto flex gap-2">
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask a question or describe a problem..."
              className="min-h-[80px]"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
              size="lg"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>

      {/* Side Panel - Tools */}
      <div className="w-96 border-l bg-muted/10">
        <Tabs defaultValue="code" className="h-full flex flex-col">
          <TabsList className="m-4">
            <TabsTrigger value="code" className="flex-1">
              <Code className="w-4 h-4 mr-2" />
              Code
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="flex-1">
              <BookOpen className="w-4 h-4 mr-2" />
              Notes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="code" className="flex-1 m-4 mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Code Executor</CardTitle>
                <CardDescription className="text-xs">
                  Test code snippets safely
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Select value={codeLanguage} onValueChange={setCodeLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                  </SelectContent>
                </Select>

                <Textarea
                  value={codeToExecute}
                  onChange={(e) => setCodeToExecute(e.target.value)}
                  placeholder={`# Write your ${codeLanguage} code here...`}
                  className="font-mono text-sm min-h-[200px]"
                />

                <Button
                  onClick={executeCode}
                  disabled={isExecutingCode || !codeToExecute.trim()}
                  className="w-full"
                  size="sm"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isExecutingCode ? 'Running...' : 'Run Code'}
                </Button>

                {codeOutput && (
                  <Alert>
                    <Terminal className="h-4 w-4" />
                    <AlertDescription>
                      <pre className="text-xs whitespace-pre-wrap mt-2 font-mono">
                        {codeOutput}
                      </pre>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="knowledge" className="flex-1 m-4 mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Study Notes</CardTitle>
                <CardDescription className="text-xs">
                  Key concepts from this session
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Notes will appear here as you learn
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
