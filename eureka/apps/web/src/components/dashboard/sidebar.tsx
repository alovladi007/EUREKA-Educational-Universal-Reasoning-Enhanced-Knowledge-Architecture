"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, getUserDisplayName, getUserInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/auth";
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
  Stethoscope,
  School,
  Shield,
  Lightbulb,
  ShoppingCart,
  Sparkles,
  Glasses,
  Lock,
  Database,
  Building2,
  Rocket,
  FolderKanban,
  Trophy,
  BookCheck,
  FileEdit,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "High School", href: "/dashboard/high-school", icon: School },
  { name: "Test Prep", href: "/dashboard/test-prep", icon: Trophy },
  { name: "Undergraduate", href: "/dashboard/undergraduate", icon: GraduationCap },
  { name: "Graduate", href: "/dashboard/graduate", icon: GraduationCap },
  { name: "Medical Education", href: "/dashboard/medical", icon: Stethoscope },
  { name: "My Courses", href: "/dashboard/courses", icon: BookOpen },
  { name: "Teacher Tools", href: "/dashboard/teacher", icon: BookCheck },
  { name: "AI Tutor", href: "/dashboard/tutor", icon: Brain },
  { name: "AI Research", href: "/dashboard/ai-research", icon: Sparkles },
  { name: "Assessments", href: "/dashboard/assessments", icon: ClipboardList },
  { name: "Learning Path", href: "/dashboard/learning-path", icon: Target },
  { name: "Analytics", href: "/dashboard/analytics", icon: LineChart },
  { name: "Notebook", href: "/dashboard/notebook", icon: FolderKanban },
  { name: "Pedagogy", href: "/dashboard/pedagogy", icon: Lightbulb },
  { name: "XR Labs", href: "/dashboard/xr-labs", icon: Glasses },
  { name: "Resume Builder", href: "/dashboard/resume-builder", icon: FileEdit },
  { name: "Resources", href: "/dashboard/resources", icon: FileText },
  { name: "Community", href: "/dashboard/community", icon: Users },
  { name: "Marketplace", href: "/dashboard/marketplace", icon: ShoppingCart },
  { name: "Ethics & Security", href: "/dashboard/ethics-security", icon: Lock },
  { name: "Data Fabric", href: "/dashboard/data-fabric", icon: Database },
  { name: "Institutions", href: "/dashboard/institutions", icon: Building2 },
  { name: "Futures", href: "/dashboard/futures", icon: Rocket },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Admin", href: "/dashboard/admin", icon: Shield },
];

export function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const display = user ? getUserDisplayName(user) : "Account";

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-card">
      <div className="flex h-16 shrink-0 items-center gap-2 border-b px-6 bg-card">
        <GraduationCap className="h-8 w-8 text-primary" />
        <span className="text-xl font-bold">EUREKA</span>
      </div>
      <div className="flex-1 overflow-y-scroll min-h-0">
        <nav className="p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
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
          );
        })}
        </nav>
      </div>
      <div className="shrink-0 border-t p-4">
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-3 rounded-lg p-2 -m-2 hover:bg-accent transition-colors"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.avatar_url} alt={display} />
            <AvatarFallback>{user ? getUserInitials(user) : "U"}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 text-left">
            <p className="text-sm font-medium truncate">{display}</p>
            <p className="text-xs text-muted-foreground capitalize truncate">
              {user?.role || "Student"}
            </p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
