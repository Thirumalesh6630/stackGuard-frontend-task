"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProtectedRoute } from "@/components/protected-route"

export default function ConfigurationPage() {
  const router = useRouter()
  const { isAuthenticated, user, isConfigured, setConfiguration, logout } = useAuth()
  const [configKey, setConfigKey] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [charCount, setCharCount] = useState(0)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (isConfigured) {
      router.push("/dashboard")
    }
  }, [isConfigured, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (!configKey.trim()) {
        throw new Error("Configuration key is required")
      }

      if (configKey.length < 100) {
        throw new Error(`Configuration key must be at least 100 characters (${charCount}/100)`)
      }

      if (configKey.length > 1000) {
        throw new Error(`Configuration key must not exceed 1000 characters (${charCount}/1000)`)
      }

      setConfiguration(configKey)
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm">
                  ⊞
                </div>
                <CardTitle className="text-2xl">Verify your public key</CardTitle>
              </div>
              <CardDescription>Enter your configuration key to complete the setup</CardDescription>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              Logout
            </Button>
          </CardHeader>

          <CardContent>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Logged in as: <span className="font-medium text-foreground">{user?.email}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="config-key" className="text-sm font-medium">
                  Configuration Key
                </label>
                <p className="text-xs text-muted-foreground">Must be between 100-1000 characters</p>
                <Textarea
                  id="config-key"
                  placeholder="Paste your configuration key here..."
                  value={configKey}
                  onChange={(e) => {
                    setConfigKey(e.target.value)
                    setCharCount(e.target.value.length)
                  }}
                  disabled={isLoading}
                  className="min-h-[200px] font-mono text-sm border-input resize-none"
                />
                <div className="flex justify-between items-center">
                  <span
                    className={`text-xs ${charCount < 100 || charCount > 1000 ? "text-destructive" : "text-muted-foreground"}`}
                  >
                    {charCount} characters
                  </span>
                  {charCount >= 100 && charCount <= 1000 && (
                    <span className="text-xs text-green-600">✓ Valid length</span>
                  )}
                </div>
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm p-3 rounded">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isLoading || charCount < 100 || charCount > 1000}
              >
                {isLoading ? "Verifying..." : "Proceed to Dashboard"}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground mt-4">
              Your configuration key will be securely stored and used to access your dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
