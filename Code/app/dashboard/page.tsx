"use client"

import { useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProtectedRoute } from "@/components/protected-route"

export default function DashboardPage() {
  const router = useRouter()
  const { isAuthenticated, isConfigured, user, logout } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
      return
    }

    if (!isConfigured) {
      router.push("/configuration")
    }
  }, [isAuthenticated, isConfigured, router])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <ProtectedRoute requireConfiguration>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
        <nav className="border-b border-border bg-card">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm">
                ⊞
              </div>
              <span className="font-semibold text-lg">StackGuard</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{user?.email}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">Hello user!</CardTitle>
                <CardDescription>Welcome to your secure dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground mb-2">Account Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground mb-2">Configuration Status</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="font-medium">Verified and Active</span>
                    </div>
                  </div>

                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-2">System Status</p>
                    <p className="font-medium text-primary">✓ All systems operational</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">View Settings</Button>
                  <Button variant="outline">Documentation</Button>
                  <Button variant="outline">Support</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
