"use client"

import { useMemo } from "react"
import { Joyride, type Step } from "react-joyride"

interface DemoJoyrideProps {
  isDarkMode: boolean
  isRouteReady: boolean
  stepIndex: number
  steps: Step[]
}

export function DemoJoyride({ isDarkMode, isRouteReady, stepIndex, steps }: DemoJoyrideProps) {
  const joyrideStyles = useMemo(
    () => ({
      tooltip: {
        backgroundColor: isDarkMode ? "oklch(0.18 0.008 55)" : "oklch(0.99 0.004 70)",
        border: isDarkMode ? "1px solid oklch(0.38 0.02 55)" : "1px solid oklch(0.78 0.035 70)",
        borderRadius: 8,
        boxShadow: isDarkMode ? "0 16px 40px rgb(0 0 0 / 0.42)" : "0 16px 40px rgb(35 24 12 / 0.2)",
        color: isDarkMode ? "oklch(0.97 0.008 70)" : "oklch(0.18 0.02 55)",
        opacity: 1,
        padding: 16,
        zIndex: 10002,
      },
      tooltipTitle: {
        color: isDarkMode ? "oklch(0.98 0.006 70)" : "oklch(0.16 0.018 55)",
        fontSize: 15,
        fontWeight: 700,
      },
      tooltipContent: {
        color: isDarkMode ? "oklch(0.84 0.02 70)" : "oklch(0.28 0.025 55)",
        fontSize: 13,
        lineHeight: 1.5,
        padding: "8px 0 12px",
      },
      buttonNext: {
        borderRadius: 8,
        fontWeight: 700,
      },
      buttonPrimary: {
        borderRadius: 8,
        fontWeight: 700,
      },
      buttonBack: {
        color: "var(--muted-foreground)",
        marginRight: 8,
      },
      buttonClose: {
        color: "var(--muted-foreground)",
      },
    }),
    [isDarkMode],
  )

  return (
    <Joyride
      continuous
      options={{
        arrowColor: "var(--dashboard-surface-raised)",
        backgroundColor: isDarkMode ? "oklch(0.18 0.008 55)" : "oklch(0.99 0.004 70)",
        blockTargetInteraction: true,
        buttons: [],
        dismissKeyAction: false,
        overlayClickAction: false,
        overlayColor: "rgb(0 0 0 / 0.58)",
        primaryColor: "var(--primary)",
        scrollOffset: 96,
        showProgress: false,
        skipBeacon: true,
        textColor: isDarkMode ? "oklch(0.97 0.008 70)" : "oklch(0.18 0.02 55)",
        width: 360,
        zIndex: 10003,
      }}
      run={isRouteReady}
      scrollToFirstStep
      stepIndex={stepIndex}
      steps={steps}
      styles={joyrideStyles}
    />
  )
}
