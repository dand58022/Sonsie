"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { Play } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DEMO_STEP_DELAY_MS, demoSteps } from "./demo-steps"

const DemoJoyride = dynamic(
  () => import("./demo-joyride").then((mod) => mod.DemoJoyride),
  { ssr: false },
)

const ROUTE_SETTLE_DELAY_MS = 600
const CLICK_RIPPLE_MS = 280
const PRE_CLICK_PAUSE_MS = 400
const PAGE_READY_TIMEOUT_MS = 8000
const TARGET_READY_TIMEOUT_MS = 6000
const POLL_INTERVAL_MS = 100

type DemoStatus = "idle" | "running"

interface DemoClickRipple {
  id: number
  x: number
  y: number
}

interface DemoModeContextValue {
  status: DemoStatus
  isRunning: boolean
  startDemo: () => void
  exitDemo: () => void
}

const DemoModeContext = createContext<DemoModeContextValue | null>(null)

export function useDemoMode() {
  const context = useContext(DemoModeContext)

  if (!context) {
    throw new Error("useDemoMode must be used within DemoModeProvider")
  }

  return context
}

export function DemoModeProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [status, setStatus] = useState<DemoStatus>("idle")
  const [stepIndex, setStepIndex] = useState(0)
  const [isRouteReady, setIsRouteReady] = useState(false)
  const [clickRipples, setClickRipples] = useState<DemoClickRipple[]>([])

  const isRunning = status === "running"
  const isDarkMode = typeof document !== "undefined" && document.documentElement.classList.contains("dark")

  const startDemo = useCallback(() => {
    setStepIndex(0)
    setStatus("running")
    setIsRouteReady(false)
  }, [])

  const exitDemo = useCallback(() => {
    setStatus("idle")
    setStepIndex(0)
    setIsRouteReady(false)
  }, [])

  const contextValue = useMemo<DemoModeContextValue>(
    () => ({
      status,
      isRunning,
      startDemo,
      exitDemo,
    }),
    [exitDemo, isRunning, startDemo, status],
  )

  useEffect(() => {
    if (!isRunning) {
      return
    }

    const abortController = new AbortController()
    const { signal } = abortController

    const sleep = (delay: number) =>
      new Promise<void>((resolve, reject) => {
        const timer = window.setTimeout(resolve, delay)

        signal.addEventListener(
          "abort",
          () => {
            window.clearTimeout(timer)
            reject(signal.reason)
          },
          { once: true },
        )
      })

    const waitForRoute = async (route: string) => {
      const startedAt = window.performance.now()

      while (window.location.pathname !== route) {
        if (signal.aborted) {
          return
        }

        if (window.performance.now() - startedAt > PAGE_READY_TIMEOUT_MS) {
          return
        }

        await sleep(POLL_INTERVAL_MS)
      }

      await sleep(ROUTE_SETTLE_DELAY_MS)
    }

    const waitForElement = async (selector: unknown, timeout = TARGET_READY_TIMEOUT_MS) => {
      const startedAt = window.performance.now()

      while (!signal.aborted && window.performance.now() - startedAt <= timeout) {
        const target = document.querySelector<HTMLElement>(String(selector))

        if (target) {
          return target
        }

        await sleep(POLL_INTERVAL_MS)
      }

      return null
    }

    const getTargetCenter = (target: HTMLElement) => {
      const rect = target.getBoundingClientRect()

      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      }
    }

    const playClickRipple = async (target: HTMLElement) => {
      const rippleId = window.Date.now()
      setClickRipples((current) => [...current, { id: rippleId, ...getTargetCenter(target) }])
      await sleep(CLICK_RIPPLE_MS)
      setClickRipples((current) => current.filter((ripple) => ripple.id !== rippleId))
    }

    const navigateToStepRoute = async (route: string) => {
      if (window.location.pathname === route) {
        await sleep(ROUTE_SETTLE_DELAY_MS)
        return
      }

      setIsRouteReady(false)
      const navTarget = document.querySelector<HTMLElement>(`[data-demo-nav-route="${route}"]`)

      if (navTarget) {
        navTarget.scrollIntoView({ behavior: "smooth", block: "nearest" })
        await sleep(PRE_CLICK_PAUSE_MS)
        await playClickRipple(navTarget)
      }

      router.push(route)
      await waitForRoute(route)
    }

    const runStep = async (step: typeof demoSteps[number], index: number) => {
      setStepIndex(index)
      setIsRouteReady(false)

      await navigateToStepRoute(step.route)

      if (step.action === "click") {
        const actionTarget = await waitForElement(step.actionTarget ?? step.target)

        if (actionTarget) {
          actionTarget.scrollIntoView({ behavior: "smooth", block: "center" })
          await sleep(PRE_CLICK_PAUSE_MS)
          await playClickRipple(actionTarget)
          actionTarget.click()
          await sleep(ROUTE_SETTLE_DELAY_MS)
        }
      }

      const tooltipTarget = await waitForElement(step.target)

      if (tooltipTarget) {
        tooltipTarget.scrollIntoView({ behavior: "smooth", block: "center" })
      }

      setIsRouteReady(true)
      await sleep(step.delay ?? DEMO_STEP_DELAY_MS)
      setIsRouteReady(false)
    }

    const runDemo = async () => {
      try {
        for (let index = 0; index < demoSteps.length; index += 1) {
          if (signal.aborted) {
            return
          }

          await runStep(demoSteps[index], index)
        }

        exitDemo()
      } catch {
        if (!signal.aborted) {
          exitDemo()
        }
      }
    }

    void runDemo()

    return () => abortController.abort()
  }, [exitDemo, isRunning, router])

  return (
    <DemoModeContext.Provider value={contextValue}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex items-center gap-2 rounded-lg border border-dashboard-border-strong/70 bg-dashboard-surface-raised p-2 shadow-lg shadow-black/10 dark:shadow-black/30">
        <span className="px-2 text-xs font-semibold text-muted-foreground">
          Walkthrough
        </span>
        {isRunning ? (
          <Button size="sm" variant="outline" className="h-8" onClick={exitDemo}>
            End Walkthrough
          </Button>
        ) : (
          <Button size="sm" className="h-8" onClick={startDemo}>
            <Play className="mr-1.5 h-3.5 w-3.5" />
            Start Walkthrough
          </Button>
        )}
      </div>
      <DemoClickRippleLayer clickRipples={clickRipples} />
      {isRunning && (
        <DemoJoyride
          isDarkMode={isDarkMode}
          isRouteReady={isRouteReady}
          stepIndex={stepIndex}
          steps={demoSteps}
        />
      )}
    </DemoModeContext.Provider>
  )
}

function DemoClickRippleLayer({ clickRipples }: { clickRipples: DemoClickRipple[] }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[10001]">
      {clickRipples.map((ripple) => (
        <DemoClickRipple key={ripple.id} ripple={ripple} />
      ))}
    </div>
  )
}

function DemoClickRipple({ ripple }: { ripple: DemoClickRipple }) {
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => setIsActive(true))

    return () => window.cancelAnimationFrame(animationFrame)
  }, [])

  return (
    <span
      aria-hidden="true"
      className="absolute h-10 w-10 rounded-full border-2 border-primary/80 bg-primary/15 shadow-[0_0_0_1px_rgb(255_255_255_/_0.35)] transition-[opacity,transform]"
      style={{
        left: ripple.x,
        top: ripple.y,
        opacity: isActive ? 0 : 0.65,
        transform: `translate(-50%, -50%) scale(${isActive ? 1.8 : 0.35})`,
        transitionDuration: `${CLICK_RIPPLE_MS}ms`,
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    />
  )
}
