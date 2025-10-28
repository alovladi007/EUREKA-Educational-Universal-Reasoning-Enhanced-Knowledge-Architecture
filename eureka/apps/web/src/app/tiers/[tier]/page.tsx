"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  GraduationCap,
  Brain,
  BookOpen,
  Award,
  Clock,
  Users,
  TrendingUp,
  CheckCircle2,
  ArrowLeft,
  PlayCircle
} from "lucide-react"

const tierInfo = {
  hs: {
    name: "High School",
    tagline: "Building Strong Foundations",
    description: "Gamified, standards-aligned learning for high school students with CCSS, NGSS, and AP curriculum support.",
    features: [
      {
        icon: Award,
        title: "Gamification",
        desc: "Earn XP, badges, and achievements as you learn"
      },
      {
        icon: BookOpen,
        title: "Standards-Aligned",
        desc: "Mapped to CCSS, NGSS, and AP standards"
      },
      {
        icon: Brain,
        title: "Adaptive Practice",
        desc: "Problems that adjust to your skill level"
      },
      {
        icon: Users,
        title: "Safe Environment",
        desc: "COPPA compliant with content filtering"
      }
    ],
    subjects: ["Algebra I & II", "Geometry", "Pre-Calculus", "Biology", "Chemistry", "Physics", "US History", "English Literature"],
    color: "bg-blue-500"
  },
  ug: {
    name: "Undergraduate",
    tagline: "Professional Preparation",
    description: "Lab-based learning with ABET/ACM/IEEE standards, LTI integration, and real-world project experience.",
    features: [
      {
        icon: BookOpen,
        title: "Lab Simulations",
        desc: "Virtual labs for sciences and engineering"
      },
      {
        icon: TrendingUp,
        title: "Project-Based",
        desc: "Build portfolios with real projects"
      },
      {
        icon: CheckCircle2,
        title: "Code Autograder",
        desc: "Instant feedback on programming assignments"
      },
      {
        icon: Users,
        title: "LMS Integration",
        desc: "Works with Canvas, Blackboard, Moodle"
      }
    ],
    subjects: ["Calculus", "Linear Algebra", "Data Structures", "Algorithms", "Computer Architecture", "Organic Chemistry", "Thermodynamics", "Electromagnetics"],
    color: "bg-green-500"
  },
  grad: {
    name: "Graduate",
    tagline: "Research Excellence",
    description: "Comprehensive research tools, thesis support, literature review assistance, and IRB-compliant workflows.",
    features: [
      {
        icon: BookOpen,
        title: "Literature Review",
        desc: "AI-powered paper synthesis and analysis"
      },
      {
        icon: Brain,
        title: "Research Methods",
        desc: "Statistical analysis and methodology planning"
      },
      {
        icon: Award,
        title: "Thesis Coach",
        desc: "Chapter-by-chapter guidance and LaTeX export"
      },
      {
        icon: CheckCircle2,
        title: "IRB Support",
        desc: "Ethics review preparation assistance"
      }
    ],
    subjects: ["Advanced Statistics", "Research Methods", "Machine Learning", "Quantum Computing", "Computational Biology", "Dissertation Writing"],
    color: "bg-purple-500"
  },
  med: {
    name: "Medical School",
    tagline: "Clinical Excellence",
    description: "Clinical reasoning, OSCE simulations, diagnostic skills, and USMLE/COMLEX board exam preparation.",
    features: [
      {
        icon: Brain,
        title: "Clinical Reasoning",
        desc: "Case-based learning with differential diagnosis"
      },
      {
        icon: Users,
        title: "OSCE Practice",
        desc: "Virtual patient simulations"
      },
      {
        icon: Award,
        title: "Board Prep",
        desc: "USMLE Step 1, 2, 3 preparation"
      },
      {
        icon: CheckCircle2,
        title: "HIPAA Compliant",
        desc: "Secure, privacy-preserving platform"
      }
    ],
    subjects: ["Anatomy", "Physiology", "Pathology", "Pharmacology", "Clinical Medicine", "Surgery", "Pediatrics", "Internal Medicine"],
    color: "bg-red-500"
  },
  law: {
    name: "Law School",
    tagline: "Legal Mastery",
    description: "Case analysis, legal writing, moot court practice, and bar exam preparation with Bluebook citations.",
    features: [
      {
        icon: BookOpen,
        title: "Case Analysis",
        desc: "IRAC method training with real cases"
      },
      {
        icon: Brain,
        title: "Legal Writing",
        desc: "Briefs, memos, and motions with feedback"
      },
      {
        icon: Users,
        title: "Moot Court",
        desc: "Oral argument simulations"
      },
      {
        icon: Award,
        title: "Bar Prep",
        desc: "MBE, MEE, and MPT practice"
      }
    ],
    subjects: ["Constitutional Law", "Contracts", "Torts", "Property", "Criminal Law", "Civil Procedure", "Evidence", "Professional Responsibility"],
    color: "bg-amber-500"
  },
  mba: {
    name: "MBA Programs",
    tagline: "Business Leadership",
    description: "Case method teaching, financial modeling, strategy simulations, and executive decision-making practice.",
    features: [
      {
        icon: TrendingUp,
        title: "Case Studies",
        desc: "Harvard Business School methodology"
      },
      {
        icon: Brain,
        title: "Financial Modeling",
        desc: "Excel-based valuation and analysis"
      },
      {
        icon: Users,
        title: "Team Projects",
        desc: "Collaborative business simulations"
      },
      {
        icon: Award,
        title: "Leadership Dev",
        desc: "Executive coaching and feedback"
      }
    ],
    subjects: ["Strategy", "Finance", "Marketing", "Operations", "Organizational Behavior", "Accounting", "Economics", "Business Analytics"],
    color: "bg-cyan-500"
  },
  eng: {
    name: "Engineering Programs",
    tagline: "Technical Mastery",
    description: "FE/PE exam preparation, specialized labs, circuit analysis, control systems, and professional licensure support.",
    features: [
      {
        icon: Brain,
        title: "FE/PE Prep",
        desc: "Fundamentals and Professional Engineer exams"
      },
      {
        icon: BookOpen,
        title: "Virtual Labs",
        desc: "Circuit, control, and thermal simulations"
      },
      {
        icon: TrendingUp,
        title: "Design Projects",
        desc: "Capstone and portfolio development"
      },
      {
        icon: CheckCircle2,
        title: "ABET Aligned",
        desc: "Meets accreditation standards"
      }
    ],
    subjects: ["Circuit Analysis", "Control Systems", "Thermodynamics", "Fluid Mechanics", "Materials Science", "Power Systems", "Signal Processing", "Embedded Systems"],
    color: "bg-orange-500"
  }
}

export default function TierPage() {
  const params = useParams()
  const tier = params?.tier as string
  const info = tierInfo[tier as keyof typeof tierInfo]

  if (!info) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Tier Not Found</h1>
          <p className="text-muted-foreground mb-8">The educational tier you're looking for doesn't exist.</p>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">EUREKA</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={`${info.color} text-white`}>
        <div className="container px-4 py-16 text-center">
          <Badge variant="secondary" className="mb-4">{tier.toUpperCase()} Tier</Badge>
          <h1 className="text-5xl font-bold mb-4">{info.name}</h1>
          <p className="text-2xl mb-2 font-semibold">{info.tagline}</p>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            {info.description}
          </p>
        </div>
      </section>

      <div className="container px-4 py-12">
        {/* Features Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Key Features</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {info.features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Icon className="h-10 w-10 text-primary mb-2" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.desc}</CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Subjects */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Available Subjects & Topics</CardTitle>
              <CardDescription>Comprehensive coverage across the curriculum</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {info.subjects.map((subject, index) => (
                  <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                    {subject}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Sample Curriculum */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-bold mb-2">
                  1
                </div>
                <CardTitle>Personalized Assessment</CardTitle>
                <CardDescription>
                  We evaluate your current knowledge level and learning goals
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-bold mb-2">
                  2
                </div>
                <CardTitle>Adaptive Learning Path</CardTitle>
                <CardDescription>
                  AI creates a customized curriculum that adapts to your progress
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-bold mb-2">
                  3
                </div>
                <CardTitle>Master the Material</CardTitle>
                <CardDescription>
                  Get instant feedback, practice, and support until you achieve mastery
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-3xl">Ready to Start Your Journey?</CardTitle>
            <CardDescription className="text-primary-foreground/80 text-lg">
              Join thousands of students already learning with EUREKA's {info.name} tier
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/register">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Create Free Account
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Try Demo
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                  View Dashboard
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
