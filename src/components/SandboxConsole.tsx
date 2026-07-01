import { useWellbeingLogic } from "@/hooks/useWellbeingLogic"

import { motion } from "framer-motion"

import {
  GearIcon,
  UserIcon,
  UsersIcon,
  MoonIcon,
  SunIcon,
  FlameIcon,
  HeartIcon,
  HourglassIcon,
  ArrowsClockwiseIcon,
} from "@phosphor-icons/react"

export const SandboxConsole = () => {
  const {
    activeProfileMode,
    setActiveProfileMode,
    activeTheme,
    setActiveTheme,
    simulateActivityTick,
    submitExtraTimeRequest,
    reset,
    addToast,
    layoutMode,
    setLayoutMode,
    demoEmpty,
    setDemoEmpty,
  } = useWellbeingLogic()

  const handleToggleTheme = () => {
    setActiveTheme(activeTheme === "light" ? "dark" : "light")
  }

  const handleToggleProfileMode = (mode: "parent" | "child") => {
    setActiveProfileMode(mode)
    addToast(
      mode === "child" ? "Entered Child Mode" : "Returned to Parent Mode",
      "info"
    )
  }

  const handleInjectRequest = () => {
    // Generate a random extra time request from Alex or Lily
    const isAlex = Math.random() > 0.5
    const childId = isAlex ? "alex" : "lily"
    const childName = isAlex ? "Alex" : "Lily"
    const appId = isAlex ? "minecraft" : "tiktok"
    const appName = isAlex ? "Minecraft" : "TikTok"
    const minutes = Math.random() > 0.5 ? 15 : 30

    submitExtraTimeRequest(childId, appId, minutes)
    addToast(
      `Injected pending request: ${childName} asks +${minutes}m for ${appName}`,
      "info"
    )
  }

  return (
    <section className="flex w-full max-w-sm flex-col gap-4.5 rounded-[24px] border border-border bg-card/65 p-5 text-foreground shadow-[0_20px_40px_rgba(0,0,0,0.05)] backdrop-blur-2xl select-none">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/10 bg-primary/10 text-primary">
          <GearIcon size={20} weight="duotone" />
        </div>

        <div>
          <h2 className="font-heading text-base font-bold tracking-tight">
            POC Control Panel
          </h2>
          <p className="mt-0.5 text-[10px] font-semibold text-muted-foreground">
            Simulate layouts, limits, and requests
          </p>
        </div>
      </div>

      {/* Layout switcher */}
      <div className="flex flex-col gap-2">
        <span className="pl-1 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
          Active App Layout
        </span>

        <div className="grid grid-cols-3 gap-2 rounded-xl bg-secondary/55 p-1">
          {(["A", "B", "C"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setLayoutMode(mode)
                addToast(
                  `Switched to Layout ${mode} (${
                    mode === "A"
                      ? "Classic"
                      : mode === "B"
                        ? "Redesigned"
                        : "Cosmic AI"
                  })`,
                  mode === "A" ? "info" : "success"
                )
              }}
              className={`flex cursor-pointer items-center justify-center rounded-lg py-2.5 text-xs font-bold transition-all ${
                layoutMode === mode
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground active:scale-95"
              }`}
            >
              <span>Layout {mode}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Profile mode switches */}
      <div className="flex flex-col gap-2">
        <span className="pl-1 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
          Active User Role
        </span>

        <div className="grid grid-cols-2 gap-2 rounded-xl bg-secondary/55 p-1">
          <button
            onClick={() => handleToggleProfileMode("parent")}
            className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-bold transition-all ${
              activeProfileMode === "parent"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground active:scale-95"
            }`}
          >
            <UsersIcon size={16} />
            <span>Parent Mode</span>
          </button>

          <button
            onClick={() => handleToggleProfileMode("child")}
            className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-bold transition-all ${
              activeProfileMode === "child"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground active:scale-95"
            }`}
          >
            <UserIcon size={16} />
            <span>Child Mode</span>
          </button>
        </div>
      </div>

      {/* Demo Empty State Toggle */}
      <div className="flex flex-col gap-2">
        <span className="pl-1 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
          Demo States
        </span>

        <div className="flex items-center justify-between rounded-xl border border-border/60 bg-secondary/40 p-3">
          <div>
            <span className="block text-xs font-bold text-foreground">
              Demo: Empty Feed
            </span>
            <span className="mt-0.5 block text-[9px] font-semibold text-muted-foreground">
              Showcase zero wellbeing states
            </span>
          </div>

          <button
            onClick={() => {
              setDemoEmpty(!demoEmpty)
              addToast(
                !demoEmpty
                  ? "Toggled empty feed states ON"
                  : "Returned to active demo data",
                "info"
              )
            }}
            className={`relative flex h-6 w-11 cursor-pointer items-center rounded-full border-none transition-colors outline-none ${
              demoEmpty ? "justify-end bg-primary" : "justify-start bg-muted"
            }`}
          >
            <motion.div
              layout
              className="mx-0.5 h-5 w-5 rounded-full bg-white shadow-sm"
            />
          </button>
        </div>
      </div>

      {/* Global Utilities */}
      <div className="flex flex-col gap-2">
        <span className="pl-1 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
          Global Configuration
        </span>

        <div className="grid grid-cols-2 gap-3">
          {/* Theme control */}
          <button
            onClick={handleToggleTheme}
            className="flex cursor-pointer flex-col items-start gap-1.5 rounded-xl border border-border/60 bg-secondary/40 p-3 text-left text-xs font-bold hover:bg-secondary/60 active:scale-95"
          >
            <div className="rounded-lg border border-border/80 bg-card p-1.5 text-foreground">
              {activeTheme === "light" ? (
                <MoonIcon size={14} weight="regular" />
              ) : (
                <SunIcon size={14} weight="regular" />
              )}
            </div>
            <div>
              <span className="block text-[11px] font-bold text-foreground">
                Toggle Theme
              </span>
              <span className="mt-0.5 block text-[8px] font-semibold text-muted-foreground">
                Light / Dark
              </span>
            </div>
          </button>

          {/* Activity pulse */}
          <button
            onClick={simulateActivityTick}
            className="flex cursor-pointer flex-col items-start gap-1.5 rounded-xl border border-border/60 bg-secondary/40 p-3 text-left text-xs font-bold hover:bg-secondary/60 active:scale-95"
          >
            <div className="rounded-lg border border-border/80 bg-card p-1.5 text-foreground">
              <FlameIcon
                size={14}
                weight="duotone"
                className="text-amber-500"
              />
            </div>
            <div>
              <span className="block text-[11px] font-bold text-foreground">
                Tick Activity
              </span>
              <span className="mt-0.5 block text-[8px] font-semibold text-muted-foreground">
                Simulate active ticking
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Injections & Overrides */}
      <div className="flex flex-col gap-2">
        <span className="pl-1 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
          Event Injections
        </span>

        <div className="flex flex-col gap-2">
          {/* Inject request */}
          <button
            onClick={handleInjectRequest}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs font-bold text-amber-700 transition-colors hover:bg-amber-500/10 active:scale-95 dark:text-amber-400"
          >
            <HourglassIcon size={16} weight="fill" />
            <span>Inject Extra Time Request</span>
          </button>

          {/* Reset button */}
          <button
            onClick={reset}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-border/60 bg-secondary/40 px-4 py-3 text-xs font-bold text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground active:scale-95"
          >
            <ArrowsClockwiseIcon size={16} weight="bold" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Design notes */}
      <div className="flex gap-2 border-t border-border/60 pt-3 text-[9px] font-medium text-muted-foreground">
        <HeartIcon size={12} className="mt-0.5 shrink-0 text-rose-500" />
        <span>
          Designed for Aura Wellbeing. Supports dynamic child locks, extra time
          approvals, and custom spline reports.
        </span>
      </div>
    </section>
  )
}

export default SandboxConsole
