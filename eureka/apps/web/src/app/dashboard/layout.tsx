"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
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

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header user={user || undefined} />
        <main className="flex-1 overflow-y-auto bg-secondary/20 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
