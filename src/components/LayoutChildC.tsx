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
  RocketLaunchIcon,
  PlanetIcon,
} from "@phosphor-icons/react"

export const LayoutChildC = () => {
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

  const childApps = appStats.filter((app) => {
    if (selectedChildId === "alex") {
      return ["minecraft", "yt", "insta"].includes(app.id)
    }
    return ["tiktok", "yt", "insta"].includes(app.id)
  })

  const selectedLockedApp = appStats.find((a) => a.id === selectedLockedAppId)
  const childLimits = childAppLimits[selectedChildId] || {}
  const appLimitVal = selectedLockedApp
    ? childLimits[selectedLockedApp.id] || 60
    : 60

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

  // Soft Cosmic theme colors (Pastel Space look)
  const backdropGradientClass = useMemo(() => {
    if (selectedChildId === "alex") {
      // Alex: Rich celestial night sky (deep space indigo-violet)
      return "bg-gradient-to-b from-[#0c0620] via-[#160d32] to-[#06030c] text-white"
    }
    // Lily: Sunset cosmic nebula gradient
    return "bg-gradient-to-b from-[#200520] via-[#14081c] to-[#060209] text-white"
  }, [selectedChildId])

  const containerClass = useMemo(() => {
    if (selectedChildId === "alex") {
      return "border-indigo-500/15 bg-indigo-950/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.04),0_12px_32px_-4px_rgba(99,102,241,0.15)]"
    }
    return "border-rose-500/15 bg-rose-950/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.04),0_12px_32px_-4px_rgba(244,63,94,0.15)]"
  }, [selectedChildId])

  const getAppCardStyles = (appId: string) => {
    if (appId === "yt") {
      return "from-rose-500/20 via-rose-500/5 to-rose-950/20 border-rose-450/40 text-rose-200 shadow-[0_8px_20px_rgba(244,63,94,0.12)]"
    }
    if (appId === "insta") {
      return "from-pink-500/20 via-purple-500/5 to-purple-950/20 border-pink-450/40 text-pink-200 shadow-[0_8px_20px_rgba(236,72,153,0.12)]"
    }
    if (appId === "minecraft") {
      return "from-emerald-500/20 via-teal-500/5 to-green-950/20 border-emerald-400/40 text-emerald-200 shadow-[0_8px_20px_rgba(16,185,129,0.12)]"
    }
    if (appId === "tiktok") {
      return "from-sky-500/20 via-blue-500/5 to-blue-950/20 border-sky-400/40 text-sky-200 shadow-[0_8px_20px_rgba(56,189,248,0.12)]"
    }
    return "from-slate-800/35 to-slate-900/40 border-white/15 text-foreground"
  }

  const renderAppIconC = (appId: string) => {
    if (appId === "yt") {
      return (
        <svg
          className="h-4.5 w-4.5 text-rose-400"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <rect
            x="2"
            y="4"
            width="20"
            height="14"
            rx="3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <polygon points="10,8 15,11 10,14" fill="currentColor" />
          <path
            d="M 6,21 L 18,21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="12" cy="18" r="1" fill="currentColor" />
        </svg>
      )
    }
    if (appId === "insta") {
      return (
        <svg
          className="h-4.5 w-4.5 text-pink-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
          <path
            d="M 12,3 A 9,9 0 0 1 21,12"
            strokeWidth="1"
            strokeDasharray="2 2"
          />
        </svg>
      )
    }
    if (appId === "minecraft") {
      return (
        <svg
          className="h-4.5 w-4.5 text-emerald-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M 14.5,2.5 L 21.5,9.5 M 17,5 L 12,10 M 3,21 L 13,11"
            strokeLinecap="round"
          />
          <rect
            x="2"
            y="18"
            width="4"
            height="4"
            className="fill-emerald-450/40"
          />
          <path
            d="M 19,3 C 16,3 15,5 15,5 L 19,9 C 19,9 21,8 21,5 C 21,2.5 19.5,3 19,3 Z"
            fill="currentColor"
          />
        </svg>
      )
    }
    if (appId === "tiktok") {
      return (
        <svg
          className="h-4.5 w-4.5 text-sky-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M9 12V4h9v3h-6v9a4 4 0 1 1-3-3.87"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 7c2 0 3.5 1.5 3.5 3.5"
            strokeWidth="1"
            strokeDasharray="2 1"
          />
        </svg>
      )
    }
    return (
      <svg
        className="h-4.5 w-4.5 text-slate-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
      </svg>
    )
  }

  // 4-segment futuristic power cell component
  const SegmentedFuelC = ({ value, max }: { value: number; max: number }) => {
    const percent = max > 0 ? value / max : 0
    const filledCount = Math.min(Math.max(Math.ceil(percent * 4), 0), 4)

    return (
      <div className="flex w-full shrink-0 gap-1 rounded-xl border border-white/10 bg-white/5 p-1 select-none">
        {Array.from({ length: 4 }).map((_, i) => {
          const isFilled = i < filledCount

          let fillBg = "bg-white/10"
          if (isFilled) {
            if (filledCount <= 2)
              fillBg =
                "bg-gradient-to-tr from-emerald-400 to-green-450 shadow-sm shadow-emerald-400/20"
            else if (filledCount === 3)
              fillBg =
                "bg-gradient-to-tr from-amber-400 to-orange-450 shadow-sm shadow-amber-400/20"
            else
              fillBg =
                "bg-gradient-to-tr from-rose-500 to-red-650 shadow-sm shadow-rose-500/20"
          }

          return (
            <div
              key={i}
              className={`h-2.5 flex-1 rounded-md transition-all duration-300 ${fillBg}`}
            />
          )
        })}
      </div>
    )
  }

  return (
    <section
      className={`relative flex h-full w-full flex-col gap-4 overflow-hidden rounded-[38px] p-5 select-none ${backdropGradientClass}`}
    >
      {/* Dynamic Ambient Space Nebulae Glows */}
      <div className="absolute top-1/4 left-1/3 -z-10 h-32 w-32 animate-pulse rounded-full bg-amber-400/5 blur-[50px]" />
      <div
        className="absolute right-10 bottom-1/3 -z-10 h-40 w-40 animate-pulse rounded-full bg-purple-500/10 blur-[60px]"
        style={{ animationDelay: "2s" }}
      />

      {/* Scattered Cosmic SVG Stars and Constellations */}
      <svg
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-35 select-none"
        viewBox="0 0 320 568"
      >
        <circle cx="40" cy="120" r="1.5" className="fill-white/80" />
        <circle
          cx="280"
          cy="180"
          r="1"
          className="animate-pulse fill-white/60"
        />
        <circle cx="70" cy="320" r="1.2" className="fill-white/70" />
        <circle
          cx="250"
          cy="400"
          r="1.8"
          className="animate-pulse fill-white/90"
        />
        <circle cx="120" cy="450" r="1" className="fill-white/50" />
        <circle cx="90" cy="220" r="1.5" className="fill-indigo-300/40" />
        <circle cx="210" cy="100" r="2" className="fill-amber-300/50" />
        <circle cx="30" cy="480" r="1.2" className="fill-purple-300/40" />

        {/* Small constellation link */}
        <line
          x1="40"
          y1="120"
          x2="90"
          y2="220"
          className="stroke-white/5"
          strokeWidth="0.5"
          strokeDasharray="2 2"
        />
        <line
          x1="90"
          y1="220"
          x2="70"
          y2="320"
          className="stroke-white/5"
          strokeWidth="0.5"
          strokeDasharray="2 2"
        />
      </svg>

      {/* Floating Planet outline SVG in top-right */}
      <svg
        className="pointer-events-none absolute -top-12 -right-12 -z-10 h-36 w-36 opacity-15 select-none"
        viewBox="0 0 100 100"
      >
        <circle
          cx="50"
          cy="50"
          r="28"
          className="fill-none stroke-purple-400"
          strokeWidth="1"
        />
        <ellipse
          cx="50"
          cy="50"
          rx="38"
          ry="6"
          className="origin-center rotate-[-25deg] fill-none stroke-pink-400"
          strokeWidth="1.2"
        />
      </svg>

      {/* Floating Constellation diagram in bottom-left */}
      <svg
        className="pointer-events-none absolute -bottom-14 -left-14 -z-10 h-40 w-40 opacity-15 select-none"
        viewBox="0 0 100 100"
      >
        <path
          d="M 25,45 L 45,35 L 60,55 L 85,50"
          className="fill-none stroke-indigo-400"
          strokeWidth="0.75"
          strokeDasharray="3 3"
        />
        <circle cx="25" cy="45" r="2" className="fill-indigo-300" />
        <circle
          cx="45"
          cy="35"
          r="2.5"
          className="animate-pulse fill-purple-300"
        />
        <circle cx="60" cy="55" r="2" className="fill-indigo-300" />
        <circle
          cx="85"
          cy="50"
          r="3"
          className="animate-pulse fill-amber-300"
        />
      </svg>

      {/* Header */}
      <div className="z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-extrabold text-white shadow-md"
            style={{
              backgroundColor: activeChildProfile.avatarColor,
              boxShadow: `0 4px 12px ${activeChildProfile.avatarColor}50`,
            }}
          >
            {activeChildProfile.name.charAt(0)}
          </div>

          <div>
            <span className="block flex items-center gap-0.5 text-[8px] font-black tracking-widest text-amber-500 uppercase">
              <RocketLaunchIcon
                size={9}
                weight="fill"
                className="animate-bounce"
              />
              <span>Cosmic Explorer</span>
            </span>

            <h1 className="font-heading text-lg font-black tracking-tight text-white">
              {activeChildProfile.name}'s Space
            </h1>
          </div>
        </div>

        {/* Exit child mode */}
        <button
          onClick={handleExitChildMode}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white shadow-sm transition-all hover:bg-white/10 active:scale-90"
        >
          <SignOutIcon size={16} weight="bold" />
        </button>
      </div>

      {/* Screen Time Goal Indicator (Spaceship HUD style) */}
      <div
        className={`z-10 flex flex-col items-center justify-center rounded-3xl border p-5 shadow-sm backdrop-blur-xl ${containerClass}`}
      >
        <div className="relative flex h-[130px] w-[130px] items-center justify-center">
          {/* Custom cosmic background SVG inside dial */}
          <svg className="absolute inset-0 h-full w-full">
            {/* Soft planetary rings */}
            <ellipse
              cx="65"
              cy="65"
              rx="55"
              ry="12"
              className="origin-center rotate-[20deg] fill-none stroke-white/5"
              strokeWidth="1"
            />
            <ellipse
              cx="65"
              cy="65"
              rx="45"
              ry="8"
              className="origin-center rotate-[20deg] fill-none stroke-white/10"
              strokeWidth="1"
            />

            {/* Stars */}
            <circle cx="20" cy="30" r="1" className="fill-white/60" />
            <circle cx="110" cy="40" r="0.75" className="fill-white/80" />
            <circle cx="95" cy="110" r="1.25" className="fill-white/40" />
            <circle cx="35" cy="100" r="0.8" className="fill-white/90" />

            {/* Holographic planetary core radial glow */}
            <defs>
              <radialGradient id="planetGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#818cf8" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#312e81" stopOpacity="0.01" />
              </radialGradient>
            </defs>
            <circle cx="65" cy="65" r="24" fill="url(#planetGlow)" />
            <circle
              cx="65"
              cy="65"
              r="14"
              className="fill-indigo-500/10 stroke-indigo-400/20"
              strokeWidth="0.5"
            />
          </svg>

          <svg className="absolute inset-0 h-full w-full -rotate-90">
            <circle
              cx="65"
              cy="65"
              r="45"
              fill="none"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="6"
            />
            <motion.circle
              cx="65"
              cy="65"
              r="45"
              fill="none"
              stroke={
                isCloseToLimit ? "#f43f5e" : activeChildProfile.avatarColor
              }
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="283"
              initial={{ strokeDashoffset: 283 }}
              animate={{ strokeDashoffset: 283 * (1 - percentageUsed) }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            {timeRemaining > 0 ? (
              <>
                <span className="font-heading text-lg font-black tracking-tight text-white">
                  {hoursRemaining > 0 ? `${hoursRemaining}h ` : ""}
                  {minutesRemaining}m
                </span>
                <span className="mt-0.5 text-[8px] font-black tracking-widest text-white/50 uppercase">
                  Remaining
                </span>
              </>
            ) : (
              <>
                <span className="font-heading text-base font-black text-rose-500">
                  Locked
                </span>
                <span className="text-rose-450 mt-0.5 text-[8px] font-black tracking-widest uppercase">
                  Time's Up
                </span>
              </>
            )}
          </div>
        </div>

        {/* Dynamic warning banner */}
        {timeRemaining > 0 && isCloseToLimit && (
          <div className="mt-4 flex w-full items-center gap-2.5 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-3 text-amber-300">
            <HourglassHighIcon
              size={16}
              weight="duotone"
              className="shrink-0 animate-pulse"
            />
            <span className="text-[10px] leading-normal font-bold">
              Mission warning: Only {timeRemaining}m fuel left!
            </span>
          </div>
        )}

        {timeRemaining === 0 && (
          <div className="mt-4 flex w-full items-center gap-2.5 rounded-2xl border border-rose-500/25 bg-rose-500/10 p-3 text-rose-400">
            <LockIcon size={16} weight="fill" className="shrink-0" />
            <span className="text-[10px] leading-normal font-bold">
              Device locked: Returning to orbit deck.
            </span>
          </div>
        )}
      </div>

      {/* Apps capsules grid */}
      <div
        className={`z-10 flex flex-1 scrollbar-none flex-col gap-3 overflow-y-auto rounded-3xl border p-4.5 shadow-sm backdrop-blur-xl ${containerClass}`}
      >
        <h3 className="flex items-center gap-1.5 font-heading text-xs font-black tracking-wider text-purple-300 uppercase">
          <PlanetIcon size={12} weight="fill" />
          <span>My App Capsules</span>
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
                className={`rounded-2xl border bg-gradient-to-tr p-4 ${cardGrad} flex h-[120px] cursor-pointer flex-col justify-between shadow-sm transition-all duration-200 active:scale-95`}
                onClick={() => {
                  if (isLocked) {
                    setSelectedLockedAppId(app.id)
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7.5 w-7.5 items-center justify-center rounded-lg border border-white/10 bg-white/5 shadow-sm">
                      {renderAppIconC(app.id)}
                    </div>
                    <span className="text-xs font-black text-white">
                      {app.name}
                    </span>
                  </div>
                  {isLocked ? (
                    <span className="text-rose-450 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.3)]">
                      <LockIcon size={11} weight="fill" />
                    </span>
                  ) : (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                      <SmileyIcon size={12} weight="duotone" />
                    </span>
                  )}
                </div>

                <div className="mt-auto flex w-full flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[9px] font-bold text-white/80">
                    <span>
                      {appTime}m / {appLimit}m
                    </span>
                    {isLocked ? (
                      <span className="text-rose-450 font-black">Locked</span>
                    ) : (
                      <span>{remainingMins}m remaining</span>
                    )}
                  </div>

                  <SegmentedFuelC value={appTime} max={appLimit} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Lock screen dialog */}
      <AnimatePresence>
        {selectedLockedAppId && selectedLockedApp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-[38px] bg-slate-950/95 p-6 text-center text-white backdrop-blur-2xl"
          >
            {/* Animated glowing orbit ring path inside lock */}
            <div className="animate-spin-slow absolute top-10 left-10 h-36 w-36 rounded-full border border-purple-500/10" />
            <div
              className="animate-spin-slow absolute right-5 bottom-20 h-44 w-44 rounded-full border border-rose-500/10"
              style={{ animationDelay: "1s" }}
            />

            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="relative z-10 flex w-full flex-col items-center gap-5"
            >
              <div className="flex h-14 w-14 animate-bounce items-center justify-center rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-500 shadow-md">
                <LockIcon size={24} weight="fill" />
              </div>

              <div>
                <h2 className="font-heading text-lg font-black tracking-tight text-white">
                  App Capsule Locked
                </h2>
                <p className="mx-auto mt-2 max-w-[220px] text-[10.5px] leading-normal text-slate-400">
                  Your parents set a limit of{" "}
                  <span className="font-bold text-rose-400">
                    {appLimitVal}m
                  </span>{" "}
                  for {selectedLockedApp.name}.
                </p>
              </div>

              {/* Action options */}
              <div className="mt-2 flex w-full max-w-xs flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                {activePendingRequest ? (
                  <div className="flex items-start gap-2.5 text-left text-[10px] text-amber-400">
                    <HourglassIcon size={16} className="mt-0.5 shrink-0" />
                    <div>
                      <span className="block font-black text-white">
                        Request Broadcasted
                      </span>
                      Submitted +{activePendingRequest.minutesRequested}m.
                      Waiting for approval...
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-slate-350 flex items-start gap-2 text-left text-[10px]">
                      <ShieldWarningIcon
                        size={15}
                        className="mt-0.5 shrink-0 text-rose-400"
                      />
                      <div>
                        <span className="block font-black text-white">
                          Transmit request
                        </span>
                        Ask your parent for extra fuel time.
                      </div>
                    </div>

                    <div className="mt-1 grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleRequestTime(15)}
                        className="cursor-pointer rounded-xl border border-white/10 bg-white/10 px-1 py-2 text-[9px] font-black transition-all hover:bg-white/20 active:scale-95"
                      >
                        +15 min
                      </button>
                      <button
                        onClick={() => handleRequestTime(30)}
                        className="cursor-pointer rounded-xl border border-white/10 bg-white/10 px-1 py-2 text-[9px] font-black transition-all hover:bg-white/20 active:scale-95"
                      >
                        +30 min
                      </button>
                      <button
                        onClick={() => handleRequestTime(60)}
                        className="cursor-pointer rounded-xl border border-white/10 bg-white/10 px-1 py-2 text-[9px] font-black transition-all hover:bg-white/20 active:scale-95"
                      >
                        +1 hour
                      </button>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={() => setSelectedLockedAppId(null)}
                className="mt-4 flex h-10 cursor-pointer items-center gap-1.5 rounded-xl bg-white px-5 text-xs font-black text-slate-950 shadow-sm active:scale-95"
              >
                <ArrowLeftIcon size={12} weight="bold" />
                <span>Go Back</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default LayoutChildC
