import { useEffect, useState } from "react"

import { AnimatePresence, motion } from "framer-motion"

import { useWellbeingLogic } from "@/hooks/useWellbeingLogic"

import { MobileFrame } from "@/components/MobileFrame"
import { BottomNavBar } from "@/components/BottomNavBar"
import { BottomNavBarB } from "@/components/BottomNavBarB"
import { AppDetailReport } from "@/components/AppDetailReport"
import { AppDetailReportB } from "@/components/AppDetailReportB"
import { LayoutPersonal } from "@/components/LayoutPersonal"
import { LayoutPersonalB } from "@/components/LayoutPersonalB"
import { LayoutParental } from "@/components/LayoutParental"
import { LayoutParentalB } from "@/components/LayoutParentalB"
import { LayoutChild } from "@/components/LayoutChild"
import { LayoutChildB } from "@/components/LayoutChildB"
import { LayoutAdblocker } from "@/components/LayoutAdblocker"
import { SandboxConsole } from "@/components/SandboxConsole"

import {
  SparkleIcon,
  MoonIcon,
  SunIcon,
  CheckCircleIcon,
  WarningCircleIcon,
  InfoIcon,
  XIcon,
  LockIcon,
  CaretRightIcon,
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
    childProfiles,
    setSelectedChildId,
    setActiveProfileMode,
    setActiveTab,
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

  // Simple profile tab layout component inside App.tsx
  const LayoutProfile = () => {
    return (
      <div className="flex flex-col gap-4 select-none">
        <div>
          <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
            Profile Center
          </span>
          <h1 className="mt-0.5 font-heading text-2xl font-bold tracking-tight text-foreground/90">
            Aura Accounts
          </h1>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card/65 p-4.5 shadow-sm backdrop-blur-xl">
          <h3 className="font-heading text-sm font-semibold tracking-tight">
            Active Profiles
          </h3>

          <div className="flex flex-col gap-2.5">
            {/* Adult Profile */}
            <div className="flex items-center justify-between rounded-xl border border-border/40 bg-secondary/35 p-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 font-bold text-purple-600 dark:text-purple-400">
                  A
                </div>
                <div>
                  <span className="text-xs font-bold text-foreground">
                    Adult Mode (Personal)
                  </span>
                  <p className="mt-0.5 text-[9px] font-medium text-muted-foreground">
                    Full stats, bypass filters, no blocks
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveProfileMode("parent")
                  setActiveTab("dashboard")
                  addToast("Switched to Personal Adult Mode", "success")
                }}
                className="h-8 cursor-pointer rounded-lg bg-primary px-3 text-[10px] font-bold text-primary-foreground shadow-sm active:scale-95"
              >
                Enter
              </button>
            </div>

            {/* Child Profiles list */}
            {childProfiles.map((child) => (
              <div
                key={child.id}
                className="flex items-center justify-between rounded-xl border border-border/40 bg-secondary/35 p-3.5"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl font-bold text-white"
                    style={{ backgroundColor: child.avatarColor }}
                  >
                    {child.name.charAt(0)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-foreground">
                      {child.name} ({child.age}yo)
                    </span>
                    <p className="mt-0.5 text-[9px] font-medium text-muted-foreground">
                      Subject to daily app schedules & timers
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedChildId(child.id)
                    setActiveProfileMode("child")
                    addToast(`Entered ${child.name}'s locked space`, "info")
                  }}
                  className="flex h-8 cursor-pointer items-center gap-1 rounded-lg border border-border bg-secondary px-3 text-[10px] font-bold text-foreground/80 hover:bg-muted active:scale-95"
                >
                  <LockIcon size={12} weight="fill" />
                  <span>Lock Screen</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Display Settings Card switcher */}
        <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card/65 p-4.5 shadow-sm backdrop-blur-xl">
          <h3 className="mb-1 font-heading text-xs font-bold tracking-wider text-muted-foreground uppercase">
            Display Settings
          </h3>

          <div
            onClick={() => setShowLayoutDrawer(true)}
            className="flex cursor-pointer items-center justify-between rounded-xl border border-border/40 bg-secondary/35 p-3.5 transition-all hover:bg-secondary/60 active:scale-95"
          >
            <div>
              <span className="text-xs font-bold font-semibold text-foreground/90">
                App Layout Theme
              </span>
              <p className="mt-0.5 text-[9px] font-medium text-muted-foreground">
                Choose classic A or premium redesigned B layout
              </p>
            </div>

            <span className="flex items-center gap-1 text-xs font-black text-primary">
              {layoutMode === "B" ? "Layout B" : "Layout A"}
              <CaretRightIcon size={12} />
            </span>
          </div>
        </div>

        {/* Security configuration */}
        <div className="rounded-2xl border border-border bg-card/65 p-4.5 shadow-sm backdrop-blur-xl">
          <h3 className="mb-2 font-heading text-xs font-bold tracking-wider text-muted-foreground uppercase">
            Security Override Settings
          </h3>
          <div className="flex items-center justify-between rounded-xl border border-border/40 bg-secondary/35 p-3.5">
            <div>
              <span className="text-xs font-semibold text-foreground/90">
                Parent PIN protection
              </span>
              <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">
                Required to unlock children lockout layers
              </p>
            </div>
            <span className="text-xs font-bold text-primary">•••• Active</span>
          </div>
        </div>
      </div>
    )
  }

  // Page Routing inside mockup
  const renderLayoutContent = () => {
    // If Child Mode is active, lockout screen takes precedence
    if (activeProfileMode === "child") {
      return layoutMode === "B" ? <LayoutChildB /> : <LayoutChild />
    }

    if (activeTab === "dashboard") {
      return layoutMode === "B" ? <LayoutPersonalB /> : <LayoutPersonal />
    }

    if (activeTab === "parental") {
      return layoutMode === "B" ? <LayoutParentalB /> : <LayoutParental />
    }

    if (activeTab === "shield") {
      return <LayoutAdblocker />
    }

    if (activeTab === "profile") {
      return <LayoutProfile />
    }

    return layoutMode === "B" ? <LayoutPersonalB /> : <LayoutPersonal />
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
          <MobileFrame>
            <div className="relative flex h-full w-full flex-col justify-between overflow-hidden">
              {/* Active Layout area */}
              <div className="flex-1 scrollbar-none overflow-y-auto pt-1 pr-1 pb-4">
                <AnimatePresence mode="wait">
                  <motion.div
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
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Interactive bottom bar (hidden in Child Mode / App Details / sub-pages) */}
              {activeProfileMode !== "child" &&
                activeAppDetailId === null &&
                (activeTab !== "dashboard" || wellbeingSubPage === "home") &&
                (layoutMode === "B" ? <BottomNavBarB /> : <BottomNavBar />)}

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
                    {layoutMode === "B" ? (
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
