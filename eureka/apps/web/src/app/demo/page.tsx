"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  GraduationCap,
  Brain,
  PlayCircle,
  CheckCircle2,
  ArrowLeft
} from "lucide-react"

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">EUREKA</span>
          </div>
          <Link href="/">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <div className="container px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="mb-4">Interactive Demo</Badge>
          <h1 className="text-4xl font-bold mb-4">Experience EUREKA in Action</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our AI-powered educational platform with these interactive demonstrations
          </p>
        </div>

        {/* Demo Features */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Brain className="h-10 w-10 text-primary mb-2" />
              <CardTitle>AI Tutor Demo</CardTitle>
              <CardDescription>
                See how our AI tutor provides personalized, Socratic-method guidance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full gap-2">
                <PlayCircle className="h-4 w-4" />
                Try AI Tutor
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CheckCircle2 className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Adaptive Learning</CardTitle>
              <CardDescription>
                Experience how the platform adapts to your learning pace and style
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full gap-2">
                <PlayCircle className="h-4 w-4" />
                Start Learning Path
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <GraduationCap className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Assessment System</CardTitle>
              <CardDescription>
                Take a sample quiz with instant feedback and detailed explanations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full gap-2">
                <PlayCircle className="h-4 w-4" />
                Take Sample Quiz
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Video Demo Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Platform Overview</CardTitle>
            <CardDescription>Watch this 3-minute overview of EUREKA's key features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center">
              <div className="text-center">
                <PlayCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Demo video coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Educational Tiers Demo */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Try Different Educational Levels</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "High School", tier: "hs", desc: "Gamified learning with CCSS standards" },
              { name: "Undergraduate", tier: "ug", desc: "Lab-based learning and projects" },
              { name: "Graduate", tier: "grad", desc: "Research tools and thesis support" },
              { name: "Medical School", tier: "med", desc: "Clinical reasoning and USMLE prep" },
              { name: "Law School", tier: "law", desc: "Case analysis and bar exam prep" },
              { name: "MBA", tier: "mba", desc: "Case studies and simulations" },
              { name: "Engineering", tier: "eng", desc: "FE/PE exam preparation" },
            ].map((tier) => (
              <Card key={tier.tier} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{tier.name}</CardTitle>
                  <CardDescription>{tier.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={`/tiers/${tier.tier}`}>
                    <Button variant="outline" className="w-full">
                      Explore {tier.name}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-2xl">Ready to Get Started?</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Create your free account and start your personalized learning journey today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Link href="/auth/register">
                <Button size="lg" variant="secondary">
                  Create Free Account
                </Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                  Learn More
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t">
        <div className="container px-4 py-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 EUREKA Platform. Built with AI for educators and learners worldwide.</p>
        </div>
      </footer>
    </div>
  )
}
