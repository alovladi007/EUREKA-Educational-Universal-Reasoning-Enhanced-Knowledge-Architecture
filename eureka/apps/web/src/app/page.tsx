import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  GraduationCap,
  Brain,
  LineChart,
  BookOpen,
  Users,
  Award,
  Sparkles,
  Target,
  Zap
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">EUREKA</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="container flex flex-col items-center justify-center gap-6 px-4 py-24 text-center">
        <div className="flex items-center gap-2 rounded-full border bg-secondary px-4 py-1.5 text-sm">
          <Sparkles className="h-4 w-4" />
          <span>AI-Powered Education Platform</span>
        </div>
        <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
          Educational Universal Reasoning & Enhanced Knowledge Architecture
        </h1>
        <p className="max-w-2xl text-xl text-muted-foreground">
          A comprehensive AI-powered learning ecosystem that adapts to learners across seven educational levels,
          from High School through Professional Schools.
        </p>
        <div className="flex gap-4">
          <Link href="/auth/register">
            <Button size="lg" className="gap-2">
              Start Learning <Zap className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/demo">
            <Button size="lg" variant="outline">
              View Demo
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Platform Features</h2>
          <p className="text-muted-foreground">Everything you need for personalized, AI-enhanced learning</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <Brain className="h-10 w-10 text-primary mb-2" />
              <CardTitle>AI Tutor</CardTitle>
              <CardDescription>
                Multimodal AI tutoring with Socratic methods and personalized guidance
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Target className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Adaptive Learning</CardTitle>
              <CardDescription>
                Knowledge tracing and mastery modeling to personalize your learning path
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <LineChart className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Comprehensive learning analytics with risk detection and insights
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <BookOpen className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Rich Content</CardTitle>
              <CardDescription>
                Interactive lessons, labs, simulations, and multimedia content
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Award className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Assessments</CardTitle>
              <CardDescription>
                Auto-graded quizzes, proctored exams, and project-based evaluations
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Collaboration</CardTitle>
              <CardDescription>
                Discussion forums, peer review, and group projects
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Tiers */}
      <section className="container px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Educational Tiers</h2>
          <p className="text-muted-foreground">Specialized learning experiences for every level</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { name: "High School", desc: "CCSS/NGSS/AP aligned, gamified learning", tier: "hs" },
            { name: "Undergraduate", desc: "ABET/ACM/IEEE standards, lab-based", tier: "ug" },
            { name: "Graduate", desc: "Research advisor, thesis tools", tier: "grad" },
            { name: "Medical School", desc: "Clinical reasoning, USMLE prep", tier: "med" },
            { name: "Law School", desc: "Case analysis, bar exam prep", tier: "law" },
            { name: "MBA", desc: "Case method, strategy simulations", tier: "mba" },
            { name: "Engineering", desc: "FE/PE prep, specialized labs", tier: "eng" },
          ].map((tier) => (
            <Card key={tier.tier} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{tier.name}</CardTitle>
                <CardDescription>{tier.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/tiers/${tier.tier}`}>
                  <Button variant="outline" className="w-full">Learn More</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-secondary/50">
        <div className="container px-4 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students, educators, and professionals using EUREKA to achieve their learning goals.
          </p>
          <Link href="/auth/register">
            <Button size="lg">Create Free Account</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container px-4 py-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 EUREKA Platform. Built with AI for educators and learners worldwide.</p>
        </div>
      </footer>
    </div>
  )
}
