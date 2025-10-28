"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Brain, Send, Sparkles, BookOpen, FileText, Code, Calculator } from "lucide-react"
import { tutorApi } from "@/lib/api"
import { toast } from "sonner"
import type { TutorMessage } from "@/types"

export default function AITutorPage() {
  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI tutor. I can help you with:\n\n• Explaining complex concepts\n• Solving problems step-by-step\n• Answering questions about your coursework\n• Providing additional practice problems\n\nWhat would you like to learn about today?",
      timestamp: new Date().toISOString(),
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: TutorMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const response = await tutorApi.post('/chat', {
        message: input,
        context: {
          previousMessages: messages.slice(-5),
        },
      })

      const assistantMessage: TutorMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.data.response,
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      toast.error("Failed to get response from AI tutor")
      const errorMessage: TutorMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const quickPrompts = [
    { icon: Calculator, text: "Help me solve a math problem", category: "Math" },
    { icon: Code, text: "Explain this code concept", category: "Programming" },
    { icon: BookOpen, text: "Summarize a chapter", category: "Reading" },
    { icon: FileText, text: "Review my essay", category: "Writing" },
  ]

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Main Chat */}
      <div className="flex flex-1 flex-col">
        <Card className="flex flex-1 flex-col">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-primary" />
                <CardTitle>AI Tutor</CardTitle>
              </div>
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="h-3 w-3" />
                Powered by Claude
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                  <span className="mt-1 block text-xs opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg bg-muted px-4 py-2">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/40 [animation-delay:-0.3s]"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/40 [animation-delay:-0.15s]"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/40"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          <div className="border-t p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex gap-2"
            >
              <Input
                placeholder="Ask me anything about your coursework..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
              <Button type="submit" disabled={loading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="w-80 space-y-4">
        {/* Quick Prompts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Quick Prompts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickPrompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start gap-2 h-auto py-3"
                onClick={() => setInput(prompt.text)}
              >
                <prompt.icon className="h-4 w-4" />
                <div className="flex flex-col items-start">
                  <span className="text-sm">{prompt.text}</span>
                  <span className="text-xs text-muted-foreground">{prompt.category}</span>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tutor Capabilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary"></div>
              <p className="text-muted-foreground">Step-by-step problem solving</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary"></div>
              <p className="text-muted-foreground">Concept explanations with examples</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary"></div>
              <p className="text-muted-foreground">Practice problem generation</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary"></div>
              <p className="text-muted-foreground">Study guidance and tips</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary"></div>
              <p className="text-muted-foreground">Multi-subject support</p>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Pro Tip
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Be specific with your questions! The more context you provide, the better I can help you learn.
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
