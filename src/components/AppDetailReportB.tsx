import { useState, useMemo, useCallback } from "react"

import { motion } from "framer-motion"

import { useWellbeingLogic } from "@/hooks/useWellbeingLogic"

import { ArrowLeftIcon, ClockIcon, CheckIcon } from "@phosphor-icons/react"

export const AppDetailReportB = () => {
  const {
    activeAppDetail,
    setActiveAppDetailId,
    updateAppLimit,
    togglePersonalManualLock,
    addToast,
  } = useWellbeingLogic()

  // Safeguard: Lock the last non-null app detail state so it stays visible during exit animations
  const [savedAppDetail, setSavedAppDetail] = useState(activeAppDetail)

  if (activeAppDetail && activeAppDetail.id !== savedAppDetail?.id) {
    setSavedAppDetail(activeAppDetail)
  }

  const appToShow = activeAppDetail || savedAppDetail

  const [prevAppId, setPrevAppId] = useState<string | null>(null)

  const defaultLimit = 60
  const [editingLimit, setEditingLimit] = useState(defaultLimit)

  if (appToShow && appToShow.id !== prevAppId) {
    setPrevAppId(appToShow.id)
    setEditingLimit(appToShow.limitMinutes || 60)
  }

  // Generate hourly points dynamically scaled based on timeSpent
  const totalMins = appToShow?.timeSpent || 60

  const hourlyMins = useMemo(
    () => [
      Math.round(totalMins * 0.12),
      Math.round(totalMins * 0.28),
      Math.round(totalMins * 0.08),
      Math.round(totalMins * 0.38),
      Math.round(totalMins * 0.14),
    ],
    [totalMins]
  )

  const mockHourlyPoints = useMemo(
    () => [
      { hour: "9 AM", mins: hourlyMins[0] },
      { hour: "12 PM", mins: hourlyMins[1] },
      { hour: "3 PM", mins: hourlyMins[2] },
      { hour: "6 PM", mins: hourlyMins[3] },
      { hour: "9 PM", mins: hourlyMins[4] },
    ],
    [hourlyMins]
  )

  // Spline points for SVG path (Adjusted to span full-width beautifully)
  const chartWidth = 320
  const chartHeight = 100

  const maxVal = useMemo(() => Math.max(...hourlyMins, 15), [hourlyMins])

  const splinePoints = useMemo(() => {
    return mockHourlyPoints.map((data, index) => {
      const x = (index * (chartWidth - 24)) / 4 + 12
      const y = chartHeight - 20 - (data.mins / maxVal) * (chartHeight - 36)
      return { x, y }
    })
  }, [mockHourlyPoints, maxVal])

  const splinePath = useMemo(() => {
    if (splinePoints.length === 0) return ""
    let d = `M ${splinePoints[0].x} ${splinePoints[0].y}`
    for (let i = 0; i < splinePoints.length - 1; i++) {
      const p0 = splinePoints[i]
      const p1 = splinePoints[i + 1]
      const cpX1 = p0.x + (p1.x - p0.x) / 2
      const cpY1 = p0.y
      const cpX2 = p0.x + (p1.x - p0.x) / 2
      const cpY2 = p1.y
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`
    }
    return d
  }, [splinePoints])

  const fillPath = useMemo(() => {
    if (splinePath === "") return ""
    return `${splinePath} L ${splinePoints[splinePoints.length - 1].x} ${chartHeight - 4} L ${splinePoints[0].x} ${chartHeight - 4} Z`
  }, [splinePath, splinePoints])

  const handleBackClick = useCallback(() => {
    setActiveAppDetailId(null)
  }, [setActiveAppDetailId])

  const handleSave = useCallback(() => {
    if (!appToShow) return
    updateAppLimit(appToShow.id, editingLimit)
    addToast(
      `Updated daily limit for ${appToShow.name} to ${editingLimit}m`,
      "success"
    )
  }, [appToShow, editingLimit, updateAppLimit, addToast])

  const handleToggleManualLock = useCallback(() => {
    if (!appToShow) return
    togglePersonalManualLock(appToShow.id)
    const nextState = !appToShow.isLockedManually
    addToast(
      nextState
        ? `Manually locked ${appToShow.name}`
        : `Unlocked ${appToShow.name}`,
      nextState ? "warning" : "success"
    )
  }, [appToShow, togglePersonalManualLock, addToast])

  if (!appToShow) return null

  const isLocked =
    appToShow.isLockedManually ||
    (appToShow.limitMinutes && appToShow.timeSpent >= appToShow.limitMinutes)

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingLimit(parseInt(e.target.value))
  }

  return (
    <section className="absolute inset-0 z-40 flex scrollbar-none flex-col overflow-y-auto rounded-[38px] bg-gradient-to-b from-orange-50/95 via-rose-50/95 to-amber-50/95 text-foreground backdrop-blur-3xl select-none dark:from-slate-950/95 dark:via-slate-900/95 dark:to-purple-950/95">
      <div className="sticky top-0 z-10 flex items-center justify-between px-5 pt-5 pb-3 backdrop-blur-md">
        <button
          onClick={handleBackClick}
          className="dark:hover:bg-slate-850 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border/80 bg-white/50 text-foreground shadow-sm transition-colors hover:bg-white active:scale-95 dark:bg-slate-800/50"
        >
          <ArrowLeftIcon size={18} weight="bold" />
        </button>

        <span className="font-heading text-sm font-bold text-foreground/80">
          Detailed Report
        </span>

        <div className="h-10 w-10 shrink-0" />
      </div>

      <div className="mx-5 my-2 flex items-center justify-between rounded-2xl border border-border/40 bg-white/40 p-4.5 shadow-sm dark:bg-slate-900/40">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/10 bg-white text-primary shadow-inner dark:bg-slate-800">
            <ClockIcon size={24} weight="duotone" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-base font-bold tracking-tight text-foreground">
                {appToShow.name}
              </h2>

              {isLocked && (
                <span className="flex h-4 items-center gap-0.5 rounded-full bg-rose-100 px-1.5 text-[9px] font-bold tracking-wider text-rose-600 uppercase dark:bg-rose-950/45 dark:text-rose-400">
                  <span>Locked</span>
                </span>
              )}
            </div>

            <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              {appToShow.category}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-5 grid grid-cols-2 gap-3.5 py-2">
        <div className="flex flex-col rounded-2xl border border-border/40 bg-white/40 p-4 shadow-sm backdrop-blur-xl dark:bg-slate-900/40">
          <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
            Usage Today
          </span>

          <span className="mt-1.5 font-heading text-xl font-black text-foreground">
            {Math.floor(appToShow.timeSpent / 60)}h {appToShow.timeSpent % 60}m
          </span>

          <span className="mt-1 text-[9px] font-semibold text-muted-foreground/60">
            Elapsed screen time
          </span>
        </div>

        <div className="flex flex-col rounded-2xl border border-border/40 bg-white/40 p-4 shadow-sm backdrop-blur-xl dark:bg-slate-900/40">
          <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
            App Limit
          </span>

          <span className="mt-1.5 font-heading text-xl font-black text-foreground">
            {appToShow.limitMinutes ? `${appToShow.limitMinutes}m` : "None"}
          </span>

          <span className="mt-1 text-[9px] font-semibold text-muted-foreground/60">
            Daily threshold
          </span>
        </div>

        <div className="flex flex-col rounded-2xl border border-border/40 bg-white/40 p-4 shadow-sm backdrop-blur-xl dark:bg-slate-900/40">
          <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
            Unlocks
          </span>

          <span className="mt-1.5 font-heading text-xl font-black text-foreground">
            {appToShow.pickups}
          </span>

          <span className="mt-1 text-[9px] font-semibold text-muted-foreground/60">
            Application sessions
          </span>
        </div>

        <div className="flex flex-col rounded-2xl border border-border/40 bg-white/40 p-4 shadow-sm backdrop-blur-xl dark:bg-slate-900/40">
          <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
            Alerts
          </span>

          <span className="mt-1.5 font-heading text-xl font-black text-foreground">
            {appToShow.notifications}
          </span>

          <span className="mt-1 text-[9px] font-semibold text-muted-foreground/60">
            Push notifications
          </span>
        </div>
      </div>

      <div className="mx-5 my-2.5 rounded-2xl border border-border/40 bg-white/40 p-4.5 shadow-sm backdrop-blur-xl dark:bg-slate-900/40">
        <h3 className="mb-4 font-heading text-xs font-bold tracking-wider text-muted-foreground uppercase">
          Hourly Usage Spline
        </h3>

        <div className="relative h-28 w-full select-none">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="h-full w-full overflow-visible"
          >
            <defs>
              <linearGradient
                id="detailAreaGradB"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.35" />

                <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
              </linearGradient>

              <linearGradient
                id="detailStrokeGradB"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#C084FC" />

                <stop offset="100%" stopColor="#818CF8" />
              </linearGradient>
            </defs>

            <path d={fillPath} fill="url(#detailAreaGradB)" />

            <path
              d={splinePath}
              fill="none"
              stroke="url(#detailStrokeGradB)"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {splinePoints.map((pt, idx) => (
              <g key={idx}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="3.5"
                  fill="#FFFFFF"
                  stroke="#818CF8"
                  strokeWidth="2"
                />

                <text
                  x={pt.x}
                  y={chartHeight - 2}
                  textAnchor="middle"
                  className="fill-muted-foreground/80 text-[8px] font-black"
                >
                  {mockHourlyPoints[idx].hour}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      <div className="mx-5 mt-2.5 mb-6 flex flex-col gap-4 rounded-2xl border border-border/40 bg-white/40 p-4.5 shadow-sm backdrop-blur-xl dark:bg-slate-900/40">
        <h3 className="font-heading text-xs font-bold tracking-wider text-muted-foreground uppercase">
          Active Rules & Lock overrides
        </h3>

        <div className="flex items-center justify-between rounded-xl border border-border/30 bg-white/30 p-3 transition-colors active:bg-secondary/45 dark:bg-slate-800/30">
          <div>
            <span className="text-xs font-semibold text-foreground/90">
              Manual Force Block
            </span>

            <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">
              Locks this application instantly
            </p>
          </div>

          <button
            onClick={handleToggleManualLock}
            className={`relative flex h-6 w-11 cursor-pointer items-center rounded-full border-none transition-colors outline-none ${
              appToShow.isLockedManually
                ? "justify-end bg-rose-500"
                : "justify-start bg-muted"
            }`}
          >
            <motion.div
              layout
              className="mx-0.5 h-5 w-5 rounded-full bg-white shadow-sm"
            />
          </button>
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-border/30 bg-white/30 p-3.5 dark:bg-slate-800/30">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span>Set App Limit</span>

            <span className="font-black text-primary">
              {editingLimit} Minutes
            </span>
          </div>

          <input
            type="range"
            min="15"
            max="180"
            step="15"
            value={editingLimit}
            onChange={handleLimitChange}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted/40 accent-primary"
          />

          <div className="mt-1 flex justify-end gap-2">
            {appToShow.limitMinutes && (
              <button
                onClick={() => {
                  updateAppLimit(appToShow.id, 0)
                  addToast(`Removed limit for ${appToShow.name}`, "info")
                }}
                className="h-8.5 rounded-xl border border-rose-100 bg-rose-50 px-3 text-[11px] font-bold text-rose-600 transition-colors active:scale-95 dark:border-rose-900/30 dark:bg-rose-950/20 dark:text-rose-400"
              >
                Disable Limit
              </button>
            )}

            <button
              onClick={handleSave}
              className="flex h-8.5 items-center gap-1.5 rounded-xl bg-primary px-4 text-[11px] font-bold text-primary-foreground shadow-sm transition-colors active:scale-95"
            >
              <CheckIcon size={12} weight="bold" />

              <span>Apply Limit</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AppDetailReportB
