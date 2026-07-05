"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { useEffect } from "react"
import { useAuthStore } from "@/stores/auth"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = useAuthStore((s) => s.user)
  const refreshUser = useAuthStore((s) => s.refreshUser)

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
    if (token) {
      refreshUser().catch(() => {})
    }
  }, [refreshUser])

  useEffect(() => {
    if (user && typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user))
    }
  }, [user])

  // /dashboard/* is privileged surface — gate every page behind authentication.
  // ProtectedRoute handles the loading skeleton + redirect-to-login flow.
  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header user={user || undefined} />
          {/* pb-28 reserves space for fixed bottom-docked bars (cookie
              consent, offline banner) so they never cover the last
              interactive control — e.g. the QBank "Start"/"Submit" buttons,
              which otherwise sit under the bar and can't be clicked. */}
          <main className="flex-1 overflow-y-auto bg-secondary/20 p-6 pb-28">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
