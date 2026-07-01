import { useState, useMemo, useCallback } from "react"

import { useWellbeingLogic } from "@/hooks/useWellbeingLogic"

import { ArrowLeftIcon, SparkleIcon, LockIcon } from "@phosphor-icons/react"

export const AppDetailReportC = () => {
  const {
    activeAppDetail,
    setActiveAppDetailId,
    updateAppLimit,
    togglePersonalManualLock,
    addToast,
  } = useWellbeingLogic()

  // Last non-null state lock
  const [savedAppDetail, setSavedAppDetail] = useState(activeAppDetail)

  if (activeAppDetail && activeAppDetail.id !== savedAppDetail?.id) {
    setSavedAppDetail(activeAppDetail)
  }

  const appToShow = activeAppDetail || savedAppDetail

  const [prevAppId, setPrevAppId] = useState<string | null>(null)
  const [editingLimit, setEditingLimit] = useState(60)

  if (appToShow && appToShow.id !== prevAppId) {
    setPrevAppId(appToShow.id)
    setEditingLimit(appToShow.limitMinutes || 60)
  }

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
    addToast(`Timer calibrated for ${appToShow.name}`, "success")
  }, [appToShow, editingLimit, updateAppLimit, addToast])

  const handleToggleManualLock = useCallback(() => {
    if (!appToShow) return
    togglePersonalManualLock(appToShow.id)
    const nextState = !appToShow.isLockedManually
    addToast(
      nextState
        ? `Deactivated ${appToShow.name}`
        : `Reconnected ${appToShow.name}`,
      nextState ? "warning" : "success"
    )
  }, [appToShow, togglePersonalManualLock, addToast])

  if (!appToShow) return null

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingLimit(parseInt(e.target.value))
  }

  const isLocked =
    appToShow.isLockedManually ||
    (appToShow.limitMinutes && appToShow.timeSpent >= appToShow.limitMinutes)

  return (
    <section className="absolute inset-0 z-40 flex scrollbar-none flex-col overflow-y-auto rounded-[38px] bg-gradient-to-b from-slate-900 via-indigo-950 to-purple-950 text-white backdrop-blur-3xl select-none">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between bg-slate-900/40 px-5 pt-5 pb-3 backdrop-blur-md">
        <button
          onClick={handleBackClick}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white active:scale-95"
        >
          <ArrowLeftIcon size={18} weight="bold" />
        </button>

        <span className="flex items-center gap-1 font-heading text-xs font-black tracking-widest text-amber-500 uppercase">
          <SparkleIcon size={11} weight="fill" className="animate-pulse" />
          <span>Sync telemetry</span>
        </span>

        <div className="h-10 w-10 shrink-0" />
      </div>

      {/* App Summary Card */}
      <div className="mx-5 my-2 flex items-center justify-between rounded-3xl border border-purple-300/20 bg-white/5 p-4.5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white shadow-md">
            {appToShow.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-base font-black text-white">
                {appToShow.name}
              </h2>
              {isLocked && (
                <span className="flex h-4 items-center gap-0.5 rounded-lg bg-rose-500/20 px-2 text-[8px] font-black tracking-widest text-rose-400 uppercase">
                  <span>Locked</span>
                </span>
              )}
            </div>
            <span className="text-[9px] font-black tracking-widest text-purple-300 uppercase">
              {appToShow.category} Node
            </span>
          </div>
        </div>
      </div>

      {/* Detailed statistics grid */}
      <div className="mx-5 grid grid-cols-2 gap-3.5 py-2">
        {[
          {
            label: "Spent Today",
            val: `${Math.floor(appToShow.timeSpent / 60)}h ${appToShow.timeSpent % 60}m`,
            desc: "Elapsed time",
          },
          {
            label: "Limit Threshold",
            val: appToShow.limitMinutes ? `${appToShow.limitMinutes}m` : "None",
            desc: "Daily cap allowance",
          },
          {
            label: "Screen Pickups",
            val: appToShow.pickups,
            desc: "Total sessions",
          },
          {
            label: "Alert Sent",
            val: appToShow.notifications,
            desc: "Notification triggers",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col rounded-3xl border border-purple-300/10 bg-white/5 p-4 shadow-sm backdrop-blur-xl"
          >
            <span className="text-[9px] font-black tracking-widest text-muted-foreground uppercase">
              {item.label}
            </span>
            <span className="mt-1 font-heading text-lg font-black text-white">
              {item.val}
            </span>
            <span className="mt-0.5 text-[8px] font-semibold text-muted-foreground/60">
              {item.desc}
            </span>
          </div>
        ))}
      </div>

      {/* Spline Chart */}
      <div className="mx-5 my-2.5 rounded-3xl border border-purple-300/10 bg-white/5 p-4.5 shadow-sm backdrop-blur-xl">
        <h3 className="mb-4 font-heading text-xs font-black tracking-wider text-purple-300 uppercase">
          Neural activity spline
        </h3>

        <div className="relative h-28 w-full select-none">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="h-full w-full overflow-visible"
          >
            <defs>
              <linearGradient
                id="detailAreaGradC"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid helper lines */}
            <line
              x1="0"
              y1={chartHeight - 20}
              x2={chartWidth}
              y2={chartHeight - 20}
              stroke="rgba(255,255,255,0.05)"
              strokeDasharray="3 3"
            />
            <line
              x1="0"
              y1={chartHeight - 60}
              x2={chartWidth}
              y2={chartHeight - 60}
              stroke="rgba(255,255,255,0.05)"
              strokeDasharray="3 3"
            />

            {/* Spline path area */}
            {fillPath && <path d={fillPath} fill="url(#detailAreaGradC)" />}
            {splinePath && (
              <path
                d={splinePath}
                fill="none"
                stroke="url(#auraGoalGrad)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            )}

            {/* Points */}
            {splinePoints.map((pt, i) => (
              <g key={i}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="4.5"
                  className="fill-purple-950 stroke-rose-400"
                  strokeWidth="2.5"
                />
                <text
                  x={pt.x}
                  y={chartHeight - 4}
                  textAnchor="middle"
                  className="fill-white/60 text-[8px] font-bold"
                >
                  {mockHourlyPoints[i].hour}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Adjuster Limit Card */}
      <div className="mx-5 my-2.5 rounded-3xl border border-purple-300/10 bg-white/5 p-5 shadow-sm backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <h3 className="font-heading text-xs font-black tracking-wider text-purple-300 uppercase">
            Threshold Calibration
          </h3>
          <span className="text-xs font-black text-amber-500">
            {editingLimit}m
          </span>
        </div>

        <div className="py-4">
          <input
            type="range"
            min="15"
            max="180"
            step="15"
            value={editingLimit}
            onChange={handleLimitChange}
            className="w-full cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between pt-1 text-[8px] font-bold text-muted-foreground uppercase">
            <span>15m</span>
            <span>90m</span>
            <span>180m</span>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleToggleManualLock}
            className="flex h-10 flex-1 cursor-pointer items-center justify-center gap-1 rounded-2xl border border-white/10 bg-white/5 px-4 text-xs font-black text-rose-400 active:scale-95"
          >
            <LockIcon size={14} weight="bold" />
            <span>
              {appToShow.isLockedManually ? "Reconnect" : "Lock Node"}
            </span>
          </button>
          <button
            onClick={handleSave}
            className="h-10 flex-1 cursor-pointer rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 font-black text-white shadow-md active:scale-95"
          >
            Calibrate
          </button>
        </div>
      </div>
    </section>
  )
}

export default AppDetailReportC
