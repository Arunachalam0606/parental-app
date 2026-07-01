import { useEffect, useState } from "react"

import { AnimatePresence, motion } from "framer-motion"

import { useWellbeingLogic } from "@/hooks/useWellbeingLogic"

import { MobileFrame } from "@/components/MobileFrame"
import { BottomNavBar } from "@/components/BottomNavBar"
import { BottomNavBarB } from "@/components/BottomNavBarB"
import { BottomNavBarC } from "@/components/BottomNavBarC"
import { AppDetailReport } from "@/components/AppDetailReport"
import { AppDetailReportB } from "@/components/AppDetailReportB"
import { AppDetailReportC } from "@/components/AppDetailReportC"
import { LayoutPersonal } from "@/components/LayoutPersonal"
import { LayoutPersonalB } from "@/components/LayoutPersonalB"
import { LayoutPersonalC } from "@/components/LayoutPersonalC"
import { LayoutParental } from "@/components/LayoutParental"
import { LayoutParentalB } from "@/components/LayoutParentalB"
import { LayoutParentalC } from "@/components/LayoutParentalC"
import { LayoutChild } from "@/components/LayoutChild"
import { LayoutChildB } from "@/components/LayoutChildB"
import { LayoutChildC } from "@/components/LayoutChildC"
import { LayoutAdblocker } from "@/components/LayoutAdblocker"
import { LayoutAdblockerB } from "@/components/LayoutAdblockerB"
import { LayoutAdblockerC } from "@/components/LayoutAdblockerC"
import { LayoutProfile } from "@/components/LayoutProfile"
import { LayoutProfileB } from "@/components/LayoutProfileB"
import { LayoutProfileC } from "@/components/LayoutProfileC"
import { SandboxConsole } from "@/components/SandboxConsole"

import {
  SparkleIcon,
  MoonIcon,
  SunIcon,
  CheckCircleIcon,
  WarningCircleIcon,
  InfoIcon,
  XIcon,
} from "@phosphor-icons/react"

export const App = () => {
  const {
    activeTab,
    activeProfileMode,
    activeAppDetailId,
    activeTheme,
    setActiveTheme,
    toasts,
    removeToast,
    addToast,
    wellbeingSubPage,
    layoutMode,
    setLayoutMode,
  } = useWellbeingLogic()

  const [showLayoutDrawer, setShowLayoutDrawer] = useState(false)

  // Auto-remove toasts after 3.5s
  useEffect(() => {
    if (toasts.length === 0) return
    const latestToast = toasts[toasts.length - 1]
    const timer = setTimeout(() => {
      removeToast(latestToast.id)
    }, 3500)
    return () => clearTimeout(timer)
  }, [toasts, removeToast])

  const handleToggleTheme = () => {
    setActiveTheme(activeTheme === "light" ? "dark" : "light")
  }

  // Page Routing inside mockup
  const renderLayoutContent = () => {
    // If Child Mode is active, lockout screen takes precedence
    if (activeProfileMode === "child") {
      return layoutMode === "C" ? (
        <LayoutChildC />
      ) : layoutMode === "B" ? (
        <LayoutChildB />
      ) : (
        <LayoutChild />
      )
    }

    if (activeTab === "dashboard") {
      return layoutMode === "C" ? (
        <LayoutPersonalC />
      ) : layoutMode === "B" ? (
        <LayoutPersonalB />
      ) : (
        <LayoutPersonal />
      )
    }

    if (activeTab === "parental") {
      return layoutMode === "C" ? (
        <LayoutParentalC />
      ) : layoutMode === "B" ? (
        <LayoutParentalB />
      ) : (
        <LayoutParental />
      )
    }

    if (activeTab === "shield") {
      return layoutMode === "C" ? (
        <LayoutAdblockerC />
      ) : layoutMode === "B" ? (
        <LayoutAdblockerB />
      ) : (
        <LayoutAdblocker />
      )
    }

    if (activeTab === "profile") {
      return layoutMode === "C" ? (
        <LayoutProfileC />
      ) : layoutMode === "B" ? (
        <LayoutProfileB />
      ) : (
        <LayoutProfile onOpenDrawer={() => setShowLayoutDrawer(true)} />
      )
    }

    return layoutMode === "C" ? (
      <LayoutPersonalC />
    ) : layoutMode === "B" ? (
      <LayoutPersonalB />
    ) : (
      <LayoutPersonal />
    )
  }

  const getToastIcon = (type: string) => {
    if (type === "success")
      return (
        <CheckCircleIcon size={16} weight="fill" className="text-emerald-500" />
      )
    if (type === "warning")
      return (
        <WarningCircleIcon size={16} weight="fill" className="text-rose-500" />
      )
    return <InfoIcon size={16} weight="fill" className="text-blue-500" />
  }

  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-x-hidden bg-gradient-to-tr from-slate-100 via-slate-50 to-purple-50/50 p-4 font-sans transition-all duration-300 select-none dark:from-slate-950 dark:via-slate-900 dark:to-purple-950/20">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute top-1/4 left-1/4 -z-10 h-96 w-96 rounded-full bg-purple-300/25 blur-[120px] dark:bg-purple-900/10" />
      <div className="pointer-events-none absolute right-1/4 bottom-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-indigo-300/30 blur-[140px] dark:bg-indigo-900/10" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-200/15 blur-[150px] dark:bg-pink-950/5" />

      {/* Toast Notifications Overlay (Inside mock or global) */}
      <div className="fixed top-6 right-6 z-[100] flex max-w-sm flex-col gap-2 select-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-xs font-semibold text-foreground shadow-[0_12px_24px_-4px_rgba(0,0,0,0.06)] backdrop-blur-xl"
            >
              <div className="flex items-center gap-2">
                {getToastIcon(toast.type)}
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="cursor-pointer rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <XIcon size={12} weight="bold" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Top Navbar */}
      <div className="mb-6 flex w-full max-w-5xl shrink-0 items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <SparkleIcon size={18} weight="fill" />
          </div>

          <div>
            <h1 className="font-heading text-sm font-bold tracking-tight text-foreground">
              Aura Wellbeing
            </h1>
            <span className="-mt-0.5 block text-[10px] font-semibold text-muted-foreground">
              POC Sandbox
            </span>
          </div>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-3">
          {/* Quick theme toggler */}
          <button
            onClick={handleToggleTheme}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-sm transition-colors hover:bg-secondary"
          >
            {activeTheme === "light" ? (
              <MoonIcon size={18} weight="regular" />
            ) : (
              <SunIcon size={18} weight="regular" />
            )}
          </button>
        </div>
      </div>

      {/* Main Workspace Frame container */}
      <div className="flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-8 md:flex-row md:gap-12">
        {/* Mockup screen */}
        <div className="flex flex-1 justify-center py-4">
          <MobileFrame layoutMode={layoutMode}>
            <div
              className={`relative flex h-full w-full flex-col overflow-hidden ${layoutMode === "B" ? "justify-end" : "justify-between"}`}
            >
              {/* Active Layout area */}
              <div
                className={
                  layoutMode === "A"
                    ? "flex-1 scrollbar-none overflow-y-auto pt-1 pr-1 pb-4"
                    : "absolute inset-x-0 top-0 bottom-0 scrollbar-none overflow-y-auto px-4 pt-1 pb-36"
                }
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={
                      activeProfileMode === "child"
                        ? "child"
                        : `tab_${activeTab}`
                    }
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="h-full w-full"
                  >
                    {renderLayoutContent()}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* Interactive bottom bar (hidden in Child Mode / App Details / sub-pages) */}
              {activeProfileMode !== "child" &&
                activeAppDetailId === null &&
                (activeTab !== "dashboard" || wellbeingSubPage === "home") &&
                (layoutMode === "C" ? (
                  <BottomNavBarC />
                ) : layoutMode === "B" ? (
                  <BottomNavBarB />
                ) : (
                  <BottomNavBar />
                ))}

              {/* Sliding App Detail Report Overlay */}
              <AnimatePresence>
                {activeAppDetailId !== null && (
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 26, stiffness: 220 }}
                    className="absolute inset-0 z-40 overflow-hidden rounded-[38px] bg-background"
                  >
                    {layoutMode === "C" ? (
                      <AppDetailReportC />
                    ) : layoutMode === "B" ? (
                      <AppDetailReportB />
                    ) : (
                      <AppDetailReport />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Sliding Layout Selector Drawer inside phone screen */}
              <AnimatePresence>
                {showLayoutDrawer && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-[60] flex items-end justify-center rounded-[38px] bg-slate-950/85 backdrop-blur-md"
                  >
                    <motion.div
                      initial={{ y: 150 }}
                      animate={{ y: 0 }}
                      exit={{ y: 150 }}
                      transition={{
                        type: "spring",
                        damping: 25,
                        stiffness: 220,
                      }}
                      className="flex w-full flex-col gap-4 rounded-t-2xl border-t border-border bg-card p-5 text-foreground shadow-xl"
                    >
                      <div className="flex items-center justify-between border-b border-border/40 pb-2">
                        <h3 className="font-heading text-sm font-bold tracking-tight">
                          Select UI Layout
                        </h3>
                        <button
                          onClick={() => setShowLayoutDrawer(false)}
                          className="p-1 text-xs font-bold text-muted-foreground hover:text-foreground"
                        >
                          Close
                        </button>
                      </div>

                      <div className="my-2 flex flex-col gap-3.5">
                        <button
                          onClick={() => {
                            setLayoutMode("A")
                            setShowLayoutDrawer(false)
                            addToast("Switched to Layout A (Classic)", "info")
                          }}
                          className={`flex cursor-pointer flex-col gap-1 rounded-xl border p-4 text-left ${
                            layoutMode === "A"
                              ? "border-primary bg-primary/5 shadow-sm"
                              : "border-border bg-secondary/35 hover:bg-secondary/60"
                          }`}
                        >
                          <span className="text-xs font-bold text-foreground">
                            Layout A (Classic)
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            Original One UI 8.5 Digital Wellbeing style with
                            linear progress bars.
                          </span>
                        </button>

                        <button
                          onClick={() => {
                            setLayoutMode("B")
                            setShowLayoutDrawer(false)
                            addToast(
                              "Switched to Layout B (Redesigned)",
                              "success"
                            )
                          }}
                          className={`flex cursor-pointer flex-col gap-1 rounded-xl border p-4 text-left ${
                            layoutMode === "B"
                              ? "border-primary bg-primary/5 shadow-sm"
                              : "border-border bg-secondary/35 hover:bg-secondary/60"
                          }`}
                        >
                          <span className="text-xs font-bold text-foreground">
                            Layout B (Redesigned Premium)
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            Softer sand/ivory pastel gradients, circular
                            indicators, and non-boxy beveled cards.
                          </span>
                        </button>

                        <button
                          onClick={() => {
                            setLayoutMode("C")
                            setShowLayoutDrawer(false)
                            addToast(
                              "Switched to Layout C (Cosmic AI)",
                              "success"
                            )
                          }}
                          className={`flex cursor-pointer flex-col gap-1 rounded-xl border p-4 text-left ${
                            layoutMode === "C"
                              ? "border-primary bg-primary/5 shadow-sm"
                              : "border-border bg-secondary/35 hover:bg-secondary/60"
                          }`}
                        >
                          <span className="text-xs font-bold text-foreground">
                            Layout C (Cosmic AI Aura)
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            AI-powered neural telemetry dashboard. Features warm
                            cosmic gradients, radial insight dials, and
                            futuristic rocket details.
                          </span>
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </MobileFrame>
        </div>

        {/* Interactive control panel sidebar */}
        <div className="shrink-0 pb-8 md:pb-0">
          <SandboxConsole />
        </div>
      </div>
    </section>
  )
}

export default App
