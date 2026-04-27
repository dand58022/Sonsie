"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Flame } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate authentication delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      {/* Background Gradient - warm tones */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-chart-2/5 to-background" />
      
      {/* Subtle grill texture overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 20px,
          oklch(0.3 0 0) 20px,
          oklch(0.3 0 0) 21px
        )`
      }} />

      <Card className="relative w-full max-w-md border-border bg-gradient-to-br from-card via-card to-secondary/30 shadow-2xl shadow-black/40">
        <CardHeader className="space-y-6 text-center pb-4">
          {/* Logo */}
          <div className="mx-auto flex flex-col items-center gap-3">
            <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-foreground/10 p-2 shadow-lg shadow-black/20">
              <Image
                src="/images/gen-logo.png"
                alt="GEN Korean BBQ"
                width={80}
                height={80}
                className="h-full w-full object-contain invert"
              />
            </div>
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">Shell Reference</span>
              <Flame className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground">Welcome Back</CardTitle>
            <CardDescription className="mt-2 text-muted-foreground">
              Reference login shell for UI review
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@genbbq.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-secondary border-border focus:border-primary focus:ring-primary"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-secondary border-border pr-10 focus:border-primary focus:ring-primary"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {"Forgot your password? "}
              <button className="text-primary hover:underline">Contact IT Support</button>
            </p>
          </div>
        </CardContent>
      </Card>
      <div className="absolute bottom-4 text-center text-xs text-muted-foreground">
        <p>GEN Korean BBQ - Reference Shell Only</p>
      </div>
    </div>
  )
}
