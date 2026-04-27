"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Eye, EyeOff, Wine } from "lucide-react"
import { toast } from "sonner"

import { useAuth } from "@/components/auth/auth-provider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated, login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(searchParams.get("redirect") ?? "/dashboard")
    }
  }, [isAuthenticated, router, searchParams])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!login(username, password)) {
      setError("Incorrect credentials. Use your assigned manager account.")
      toast.error("Login failed", {
        description: "Use the assigned SonsieAdmin credentials.",
      })
      return
    }

    toast.success("Logged in", {
      description: "Manager session started.",
    })
    router.replace(searchParams.get("redirect") ?? "/dashboard")
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-chart-2/5 to-background" />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 20px,
            oklch(0.3 0 0) 20px,
            oklch(0.3 0 0) 21px
          )`,
        }}
      />

      <Card className="relative w-full max-w-md border-border bg-gradient-to-br from-card via-card to-secondary/30 shadow-2xl shadow-black/40">
        <CardHeader className="space-y-6 pb-4 text-center">
          <div className="mx-auto flex flex-col items-center gap-3">
            <div className="relative h-20 w-28 overflow-hidden rounded-lg bg-transparent p-2">
              <Image
                src="/images/sonsie-logo.png"
                alt="Sonsie logo"
                width={112}
                height={80}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex items-center gap-2">
              <Wine className="h-5 w-5 text-primary" />
              <span className="text-xs font-semibold uppercase text-primary">
                Sonsie Inventory
              </span>
              <Wine className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
              Manager Access
            </CardTitle>
            <CardDescription className="mt-2 text-muted-foreground">
              Internal access for Sonsie service, bar, and private event operations.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground">
                Username
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="SonsieAdmin"
                className="border-border bg-secondary focus:border-primary focus:ring-primary"
                autoComplete="username"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="SONSIE"
                  className="border-border bg-secondary pr-10 focus:border-primary focus:ring-primary"
                  autoComplete="current-password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
          <p className="mt-5 text-center text-xs text-muted-foreground">
            Authorized Sonsie demo operations users only.
          </p>
        </CardContent>
      </Card>
      <div className="absolute bottom-4 text-center text-xs text-muted-foreground">
        <p>Sonsie Mock Inventory System</p>
      </div>
    </div>
  )
}
