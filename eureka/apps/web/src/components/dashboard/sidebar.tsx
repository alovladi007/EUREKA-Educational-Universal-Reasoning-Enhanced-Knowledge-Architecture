"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, getUserDisplayName, getUserInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EurekaMark } from "@/components/eureka-logo";
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
  Sparkles,
  Glasses,
  Lock,
  Database,
  Rocket,
  FolderKanban,
  Trophy,
  BookCheck,
  FileEdit,
  Home,
  Calculator,
} from "lucide-react";

// /dashboard sidebar = ORIGINAL learner-oriented surface only.
// Institutions, Marketplace, My training, Settings (subscription), and the new
// Admin console all live under their own routes (/institutions, /marketplace,
// /training, /settings, /admin) with their own shells — accessible from the
// home page (/), NOT cross-linked here.
const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "High School", href: "/dashboard/high-school", icon: School },
  { name: "Test Prep", href: "/dashboard/test-prep", icon: Trophy },
  { name: "Undergraduate", href: "/dashboard/undergraduate", icon: GraduationCap },
  { name: "Graduate", href: "/dashboard/graduate", icon: GraduationCap },
  { name: "Medical Education", href: "/dashboard/medical", icon: Stethoscope },
  // AXIOM, the mathematics vertical, runs as its own app. This entry opens it
  // with the current EUREKA token handed over so the user arrives signed in.
  { name: "Mathematics", href: "axiom://open", icon: Calculator },
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
  { name: "Ethics & Security", href: "/dashboard/ethics-security", icon: Lock },
  { name: "Data Fabric", href: "/dashboard/data-fabric", icon: Database },
  { name: "Futures", href: "/dashboard/futures", icon: Rocket },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Admin", href: "/dashboard/admin", icon: Shield },
];

export function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const display = user ? getUserDisplayName(user) : "Account";

  // Open AXIOM (the mathematics vertical) in a new tab, handing over the
  // current EUREKA JWT in the URL hash so the user lands signed in. The hash
  // is client-only (never sent to a server), and AXIOM strips it on arrival.
  const AXIOM_WEB_URL =
    process.env.NEXT_PUBLIC_AXIOM_WEB_URL || "http://localhost:4100";
  const openAxiom = () => {
    try {
      const token =
        typeof window !== "undefined"
          ? window.localStorage.getItem("access_token")
          : null;
      const base = `${AXIOM_WEB_URL}/dashboard`;
      const url = token
        ? `${base}#access_token=${encodeURIComponent(token)}`
        : base;
      window.open(url, "_blank", "noopener");
    } catch {
      window.open(AXIOM_WEB_URL, "_blank", "noopener");
    }
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-card">
      <div className="flex h-16 shrink-0 items-center border-b px-6 bg-card">
        <Link
          href="/"
          aria-label="EUREKA home"
          className="flex items-center gap-2 rounded-md transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <EurekaMark className="h-8 w-8 shrink-0" />
          <span className="flex flex-col leading-none">
            <span className="text-xl font-bold">EUREKA</span>
            <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Learn. Discover. Master.
            </span>
          </span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-scroll min-h-0">
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            // The Mathematics entry opens the separate AXIOM app with a token
            // handoff, so it is a button rather than an in-app Link.
            if (item.href === "axiom://open") {
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={openAxiom}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                  <span className="ml-auto rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-primary">
                    New
                  </span>
                </button>
              );
            }
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
      <div className="shrink-0 border-t p-4 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Home className="h-3.5 w-3.5" />
          Back to home
        </Link>
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
