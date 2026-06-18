"use client"

import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { useEffect, useState } from "react"

export function DashboardLayout({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      window.location.href = "/login"
      return
    }

    setReady(true)
  }, [])

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050816]">
        <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Sidebar />

      <div className="ml-64 flex flex-col min-h-screen relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-transparent pointer-events-none" />

        <Header title={title} />

        <main className="flex-1 p-8 relative z-10">
          {children}
        </main>
      </div>
    </div>
  )
}