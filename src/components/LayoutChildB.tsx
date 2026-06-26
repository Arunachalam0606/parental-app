import { useState, useMemo } from "react"

import { motion, AnimatePresence } from "framer-motion"

import { useWellbeingLogic } from "@/hooks/useWellbeingLogic"

import {
  LockIcon,
  HourglassIcon,
  HourglassHighIcon,
  SmileyIcon,
  ShieldWarningIcon,
  ArrowLeftIcon,
  SignOutIcon,
} from "@phosphor-icons/react"

export const LayoutChildB = () => {
  const {
    activeChildProfile,
    appStats,
    isChildAppLocked,
    getChildAppTimeSpent,
    childAppLimits,
    submitExtraTimeRequest,
    extraTimeRequests,
    selectedChildId,
    setActiveProfileMode,
    setActiveTab,
    addToast,
    demoEmpty,
  } = useWellbeingLogic()

  // Selected app lock override details modal
  const [selectedLockedAppId, setSelectedLockedAppId] = useState<string | null>(
    null
  )

  const limitToday = demoEmpty ? 0 : activeChildProfile.timeSpentToday
  const maxLimitToday = activeChildProfile.weekdayLimitMinutes
  const timeRemaining = Math.max(maxLimitToday - limitToday, 0)

  const hoursRemaining = Math.floor(timeRemaining / 60)
  const minutesRemaining = timeRemaining % 60
  const isCloseToLimit = timeRemaining <= 15

  const percentageUsed = Math.min(limitToday / maxLimitToday, 1)

  // List of apps with limits on this child
  const childApps = appStats.filter((app) => {
    if (selectedChildId === "alex") {
      return ["minecraft", "yt", "insta"].includes(app.id)
    }
    return ["tiktok", "yt", "insta"].includes(app.id)
  })

  // Selected locked app info
  const selectedLockedApp = appStats.find((a) => a.id === selectedLockedAppId)
  const childLimits = childAppLimits[selectedChildId] || {}
  const appLimitVal = selectedLockedApp
    ? childLimits[selectedLockedApp.id] || 60
    : 60

  // Check if there is an active pending request for this app
  const activePendingRequest = extraTimeRequests.find(
    (r) =>
      r.childId === selectedChildId &&
      r.appId === selectedLockedAppId &&
      r.status === "pending"
  )

  const handleRequestTime = (minutes: number) => {
    if (!selectedLockedAppId) return
    submitExtraTimeRequest(selectedChildId, selectedLockedAppId, minutes)
    addToast(`Requested +${minutes}m for ${selectedLockedApp?.name}`, "info")
  }

  const handleExitChildMode = () => {
    setActiveProfileMode("parent")
    setActiveTab("profile")
    addToast("Returned to Parent Portal", "info")
  }

  const getStrokeDasharray = (radius: number) => 2 * Math.PI * radius
  const circleRadius = 60

  // Determine Child Gradient Backdrop
  const backdropGradientClass = useMemo(() => {
    if (selectedChildId === "alex") {
      // Alex: Peaceful morning sky theme using lavender, indigo, and soft sky-blue gradients
      return "from-indigo-100/80 via-purple-50/80 to-sky-100/60 dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-sky-950/15"
    }
    // Lily (formerly Emma): Cozy warm evening sunset theme featuring soft peach, coral, and rose-gold gradients
    return "from-orange-100/80 via-rose-100/80 to-amber-100/60 dark:from-orange-950/30 dark:via-rose-950/20 dark:to-amber-950/15"
  }, [selectedChildId])

  // Helper for App specific light pastel gradients
  const getAppCardStyles = (appId: string) => {
    if (appId === "yt") {
      // YouTube: soft rose-red
      return "from-rose-100/80 to-red-50/60 dark:from-rose-950/40 dark:to-red-950/20 border-rose-200/50 dark:border-rose-900/30 text-rose-700 dark:text-rose-300"
    }
    if (appId === "insta") {
      // Instagram: soft pink-purple
      return "from-pink-100/80 to-purple-50/60 dark:from-pink-950/40 dark:to-purple-950/20 border-pink-200/50 dark:border-pink-900/30 text-pink-700 dark:text-pink-300"
    }
    if (appId === "minecraft") {
      // Minecraft: soft emerald-green
      return "from-emerald-100/80 to-green-50/60 dark:from-emerald-950/40 dark:to-green-950/20 border-emerald-200/50 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-300"
    }
    if (appId === "tiktok") {
      // TikTok: soft sky-blue
      return "from-sky-100/80 to-blue-50/60 dark:from-sky-950/40 dark:to-blue-950/20 border-sky-200/50 dark:border-sky-900/30 text-sky-700 dark:text-sky-300"
    }
    return "from-slate-100/80 to-zinc-50/60 dark:from-slate-800/40 dark:to-zinc-800/20 border-border/50 text-foreground"
  }

  // 4-segment visual fuel blocks component
  const SegmentedFuel = ({ value, max }: { value: number; max: number }) => {
    const percent = max > 0 ? value / max : 0
    const filledCount = Math.min(Math.max(Math.ceil(percent * 4), 0), 4)

    return (
      <div className="flex shrink-0 gap-0.5 rounded-lg border border-black/5 bg-black/5 p-1 select-none dark:border-white/5 dark:bg-white/5">
        {Array.from({ length: 4 }).map((_, i) => {
          const isFilled = i < filledCount

          let fillBg = "bg-black/10 dark:bg-white/10"
          if (isFilled) {
            if (filledCount <= 2) fillBg = "bg-emerald-500"
            else if (filledCount === 3) fillBg = "bg-amber-500"
            else fillBg = "bg-rose-500"
          }

          return (
            <div
              key={i}
              className={`h-2.5 w-2 rounded-[2px] transition-all duration-300 ${fillBg}`}
            />
          )
        })}
      </div>
    )
  }

  return (
    <section
      className={`relative flex h-full flex-col gap-4 bg-gradient-to-b ${backdropGradientClass} overflow-hidden rounded-2xl border border-border/40 p-4.5 select-none`}
    >
      {/* Header */}
      <div className="z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full font-extrabold text-white shadow-md"
            style={{ backgroundColor: activeChildProfile.avatarColor }}
          >
            {activeChildProfile.name.charAt(0)}
          </div>

          <div>
            <span className="block text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              Child mode active
            </span>

            <h1 className="font-heading text-xl font-bold tracking-tight text-foreground/90">
              {activeChildProfile.name}'s Space
            </h1>
          </div>
        </div>

        {/* Exit child mode bypass button for sandbox */}
        <button
          onClick={handleExitChildMode}
          className="dark:hover:bg-slate-850 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border/80 bg-white/50 text-foreground shadow-sm transition-all hover:bg-white active:scale-90 dark:bg-slate-800/50"
          title="Exit Child Mode"
        >
          <SignOutIcon size={18} weight="bold" />
        </button>
      </div>

      {/* Screen time allowance clock dials */}
      <div className="z-10 flex flex-col items-center justify-center rounded-2xl border border-border/50 bg-white/45 p-5 shadow-sm backdrop-blur-xl dark:bg-slate-900/40">
        <div className="relative h-[150px] w-[150px]">
          <svg className="h-full w-full -rotate-90">
            <circle
              cx="75"
              cy="75"
              r={circleRadius}
              fill="none"
              stroke="currentColor"
              className="text-muted/10"
              strokeWidth="9"
            />
            <motion.circle
              cx="75"
              cy="75"
              r={circleRadius}
              fill="none"
              stroke={
                isCloseToLimit
                  ? "oklch(0.60 0.18 25)"
                  : activeChildProfile.avatarColor
              }
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={getStrokeDasharray(circleRadius)}
              initial={{ strokeDashoffset: getStrokeDasharray(circleRadius) }}
              animate={{
                strokeDashoffset:
                  getStrokeDasharray(circleRadius) * (1 - percentageUsed),
              }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            {timeRemaining > 0 ? (
              <>
                <span className="font-heading text-2xl font-extrabold tracking-tight">
                  {hoursRemaining > 0 ? `${hoursRemaining}h ` : ""}
                  {minutesRemaining}m
                </span>

                <span className="mt-0.5 text-[9px] font-bold tracking-wider text-muted-foreground uppercase">
                  Remaining
                </span>
              </>
            ) : (
              <>
                <span className="font-heading text-xl font-extrabold tracking-tight text-rose-500">
                  Time's Up
                </span>

                <span className="mt-0.5 text-[9px] font-bold tracking-wider text-rose-400 uppercase">
                  Device Locked
                </span>
              </>
            )}
          </div>
        </div>

        {/* Warning cards */}
        {timeRemaining > 0 && isCloseToLimit && (
          <div className="mt-4 flex w-full items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-amber-700 dark:text-amber-400">
            <HourglassHighIcon
              size={18}
              weight="duotone"
              className="shrink-0"
            />

            <span className="text-[11px] leading-snug font-bold">
              Only {timeRemaining} minutes left! Wrap up your tasks.
            </span>
          </div>
        )}

        {timeRemaining === 0 && (
          <div className="dark:text-rose-450 mt-4 flex w-full items-center gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-rose-700">
            <LockIcon size={18} weight="fill" className="shrink-0" />

            <span className="text-[11px] leading-snug font-bold">
              Your device is now locked for the day.
            </span>
          </div>
        )}
      </div>

      {/* Child app allowance list redesigned as Tacit App Blocks */}
      <div className="z-10 flex flex-1 scrollbar-none flex-col gap-3 overflow-y-auto rounded-2xl border border-border/50 bg-white/45 p-4.5 shadow-sm backdrop-blur-xl dark:bg-slate-900/40">
        <h3 className="font-heading text-xs font-bold tracking-wider text-muted-foreground uppercase">
          My App Schedules
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {childApps.map((app) => {
            const isLocked = isChildAppLocked(selectedChildId, app.id)
            const appLimit = childLimits[app.id] || 60
            const appTime = demoEmpty
              ? 0
              : getChildAppTimeSpent(selectedChildId, app.id)
            const remainingMins = Math.max(appLimit - appTime, 0)
            const cardGrad = getAppCardStyles(app.id)

            return (
              <div
                key={app.id}
                className={`rounded-2xl bg-gradient-to-tr p-4.5 ${cardGrad} flex h-[120px] cursor-pointer flex-col justify-between border shadow-sm transition-all duration-200 active:scale-95`}
                onClick={() => {
                  if (isLocked) {
                    setSelectedLockedAppId(app.id)
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold">{app.name}</span>

                  {isLocked ? (
                    <LockIcon
                      size={14}
                      weight="fill"
                      className="text-rose-500 dark:text-rose-400"
                    />
                  ) : (
                    <SmileyIcon
                      size={15}
                      weight="duotone"
                      className="text-emerald-600 dark:text-emerald-400"
                    />
                  )}
                </div>

                <div className="mt-auto flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[9px] font-bold opacity-80">
                    <span>
                      {appTime}m / {appLimit}m
                    </span>

                    {isLocked ? (
                      <span className="text-rose-600 dark:text-rose-400">
                        Locked
                      </span>
                    ) : (
                      <span>{remainingMins}m left</span>
                    )}
                  </div>

                  {/* 4-segment visual fuel blocks */}
                  <SegmentedFuel value={appTime} max={appLimit} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Lock Override request Overlay: Glassmorphic with glowing floating decorative spheres */}
      <AnimatePresence>
        {selectedLockedAppId && selectedLockedApp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-slate-950/90 p-6 text-center text-white backdrop-blur-xl"
          >
            {/* Glowing, floating decorative play spheres */}
            <div className="pointer-events-none absolute top-10 left-10 h-32 w-32 animate-pulse rounded-full bg-purple-500/20 blur-[40px]" />

            <div
              className="pointer-events-none absolute right-10 bottom-20 h-40 w-40 animate-pulse rounded-full bg-rose-500/15 blur-[50px]"
              style={{ animationDelay: "1.5s" }}
            />

            <div
              className="pointer-events-none absolute top-1/2 right-1/3 h-24 w-24 animate-pulse rounded-full bg-blue-500/20 blur-[30px]"
              style={{ animationDelay: "3.0s" }}
            />

            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="relative z-10 flex w-full flex-col items-center gap-5"
            >
              <div className="flex h-16 w-16 animate-bounce items-center justify-center rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-500 shadow-lg shadow-rose-500/10">
                <LockIcon size={32} weight="fill" />
              </div>

              <div>
                <h2 className="font-heading text-xl font-bold tracking-tight">
                  Time's Up for {selectedLockedApp.name}
                </h2>

                <p className="mx-auto mt-2 max-w-xs text-xs text-slate-400">
                  You have reached your daily limit of{" "}
                  <span className="font-bold text-rose-400">
                    {appLimitVal} minutes
                  </span>{" "}
                  set by your parents.
                </p>
              </div>

              {/* Approval status / options */}
              <div className="mt-2 flex w-full max-w-xs flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                {activePendingRequest ? (
                  <div className="flex items-start gap-2.5 text-left text-[11px] text-amber-400">
                    <HourglassIcon size={16} className="mt-0.5 shrink-0" />

                    <div>
                      <span className="block font-bold text-white">
                        Request Pending Approval
                      </span>
                      Requested +{activePendingRequest.minutesRequested} mins
                      allowance. Waiting for parental response...
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-slate-355 flex items-start gap-2.5 text-left text-[11px]">
                      <ShieldWarningIcon
                        size={16}
                        className="mt-0.5 shrink-0 text-rose-400"
                      />

                      <div>
                        <span className="block font-bold text-white">
                          Request Extra Screen Time
                        </span>
                        Submit a request to extend this app's allowance for
                        today.
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleRequestTime(15)}
                        className="cursor-pointer rounded-xl border border-white/10 bg-white/10 px-1 py-2 text-[10px] font-bold transition-all hover:bg-white/20 active:scale-95"
                      >
                        +15 min
                      </button>

                      <button
                        onClick={() => handleRequestTime(30)}
                        className="cursor-pointer rounded-xl border border-white/10 bg-white/10 px-1 py-2 text-[10px] font-bold transition-all hover:bg-white/20 active:scale-95"
                      >
                        +30 min
                      </button>

                      <button
                        onClick={() => handleRequestTime(60)}
                        className="cursor-pointer rounded-xl border border-white/10 bg-white/10 px-1 py-2 text-[10px] font-bold transition-all hover:bg-white/20 active:scale-95"
                      >
                        +1 hour
                      </button>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={() => setSelectedLockedAppId(null)}
                className="mt-4 flex h-11 cursor-pointer items-center gap-1.5 rounded-xl bg-white px-6 text-xs font-bold text-slate-950 shadow-sm transition-all active:scale-95"
              >
                <ArrowLeftIcon size={14} weight="bold" />

                <span>Go Back</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default LayoutChildB
