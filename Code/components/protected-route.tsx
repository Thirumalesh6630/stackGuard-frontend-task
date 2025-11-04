"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function ProtectedRoute({
  children,
  requireConfiguration = false,
}: {
  children: React.ReactNode
  requireConfiguration?: boolean
}) {
  const { isAuthenticated, isConfigured } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
      return
    }

    if (requireConfiguration && !isConfigured) {
      router.push("/configuration")
      return
    }
  }, [isAuthenticated, isConfigured, requireConfiguration, router])

  if (!isAuthenticated) {
    return null
  }

  if (requireConfiguration && !isConfigured) {
    return null
  }

  return <>{children}</>
}
