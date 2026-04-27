"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

const AUTH_STORAGE_KEY = "sonsie.mock-auth"
const MOCK_USER = {
  username: "SonsieAdmin",
  displayName: "SonsieAdmin",
  role: "Admin",
}
const MOCK_PASSWORD = "SONSIE"

export interface MockUser {
  username: string
  displayName: string
  role: string
}

interface AuthContextValue {
  user: MockUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = window.localStorage.getItem(AUTH_STORAGE_KEY)

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser) as MockUser)
      } catch {
        window.localStorage.removeItem(AUTH_STORAGE_KEY)
      }
    }

    setIsLoading(false)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login: (username, password) => {
        const validCredentials =
          username.trim() === MOCK_USER.username && password === MOCK_PASSWORD

        if (!validCredentials) {
          return false
        }

        setUser(MOCK_USER)
        window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(MOCK_USER))
        return true
      },
      logout: () => {
        setUser(null)
        window.localStorage.removeItem(AUTH_STORAGE_KEY)
      },
    }),
    [isLoading, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }

  return context
}
