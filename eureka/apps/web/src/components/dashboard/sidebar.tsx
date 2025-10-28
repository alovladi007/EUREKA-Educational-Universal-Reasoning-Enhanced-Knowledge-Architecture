"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  BookOpen,
  Brain,
  ClipboardList,
  LineChart,
  Users,
  Settings,
  GraduationCap,
  Target,
  FileText,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Courses", href: "/dashboard/courses", icon: BookOpen },
  { name: "AI Tutor", href: "/dashboard/tutor", icon: Brain },
  { name: "Assessments", href: "/dashboard/assessments", icon: ClipboardList },
  { name: "Learning Path", href: "/dashboard/learning-path", icon: Target },
  { name: "Analytics", href: "/dashboard/analytics", icon: LineChart },
  { name: "Resources", href: "/dashboard/resources", icon: FileText },
  { name: "Community", href: "/dashboard/community", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <GraduationCap className="h-8 w-8 text-primary" />
        <span className="text-xl font-bold">EUREKA</span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
