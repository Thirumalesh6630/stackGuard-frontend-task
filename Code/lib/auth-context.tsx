"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  user: { email: string; firstName: string; lastName: string } | null
  isConfigured: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>
  setConfiguration: (key: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ email: string; firstName: string; lastName: string } | null>(null)
  const [isConfigured, setIsConfigured] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedAuth = localStorage.getItem("stackguard_auth")
    const storedUser = localStorage.getItem("stackguard_user")
    const storedConfig = localStorage.getItem("stackguard_config")

    if (storedAuth && storedUser) {
      setIsAuthenticated(true)
      setUser(JSON.parse(storedUser))
    }

    if (storedConfig) {
      setIsConfigured(true)
    }

    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Simulate API call
    if (!email || !password) throw new Error("Email and password required")

    const user = { email, firstName: "", lastName: "" }
    localStorage.setItem("stackguard_auth", "true")
    localStorage.setItem("stackguard_user", JSON.stringify(user))
    setIsAuthenticated(true)
    setUser(user)
  }

  const signup = async (email: string, password: string, firstName: string, lastName: string) => {
    // Simulate API call
    if (!email || !password) throw new Error("Email and password required")
    if (!firstName.trim()) throw new Error("First name is required")
    if (!lastName.trim()) throw new Error("Last name is required")

    const user = { email, firstName, lastName }
    localStorage.setItem("stackguard_auth", "true")
    localStorage.setItem("stackguard_user", JSON.stringify(user))
    setIsAuthenticated(true)
    setUser(user)
  }

  const setConfiguration = (key: string) => {
    if (key.length < 100 || key.length > 1000) {
      throw new Error("Configuration key must be between 100-1000 characters")
    }
    localStorage.setItem("stackguard_config", key)
    localStorage.setItem("stackguard_config_key", key)
    setIsConfigured(true)
  }

  const logout = () => {
    localStorage.removeItem("stackguard_auth")
    localStorage.removeItem("stackguard_user")
    localStorage.removeItem("stackguard_config")
    localStorage.removeItem("stackguard_config_key")
    setIsAuthenticated(false)
    setUser(null)
    setIsConfigured(false)
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isConfigured, login, signup, setConfiguration, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
