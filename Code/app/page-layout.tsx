"use client"

import { AuthProvider } from "@/lib/auth-context"
import type { ReactNode } from "react"

export function PageLayout({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}

export default PageLayout
