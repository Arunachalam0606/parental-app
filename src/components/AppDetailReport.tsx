import { useState, useMemo } from 'react'

import { motion } from 'framer-motion'

import { useWellbeingLogic } from '@/hooks/useWellbeingLogic'

import { 
  ArrowLeftIcon,
  ClockIcon,
  CheckIcon
} from '@phosphor-icons/react'

export const AppDetailReport = () => {
  const {
    activeAppDetail,
    setActiveAppDetailId,
    updateAppLimit,
    togglePersonalManualLock,
    addToast
  } = useWellbeingLogic()

  // Guard/Safeguard: Lock the last non-null app detail state so it stays visible during exit animations
  const [savedAppDetail, setSavedAppDetail] = useState(activeAppDetail)

  if (activeAppDetail && activeAppDetail.id !== savedAppDetail?.id) {
    setSavedAppDetail(activeAppDetail)
  }

  const appToShow = activeAppDetail || savedAppDetail

  if (!appToShow) return null

  // Local state for limit editing
  const [editingLimit, setEditingLimit] = useState(appToShow.limitMinutes || 60)
  const isLocked = appToShow.isLockedManually || (appToShow.limitMinutes && appToShow.timeSpent >= appToShow.limitMinutes)

  const handleSave = () => {
    updateAppLimit(appToShow.id, editingLimit)
    addToast(`Updated daily limit for ${appToShow.name} to ${editingLimit}m`, 'success')
  }

  const handleToggleManualLock = () => {
    togglePersonalManualLock(appToShow.id)
    const nextState = !appToShow.isLockedManually
    addToast(
      nextState ? `Manually locked ${appToShow.name}` : `Unlocked ${appToShow.name}`,
      nextState ? 'warning' : 'success'
    )
  }

  // Generate hourly points dynamically scaled based on timeSpent
  const totalMins = appToShow.timeSpent || 60
  const hourlyMins = [
    Math.round(totalMins * 0.12),
    Math.round(totalMins * 0.28),
    Math.round(totalMins * 0.08),
    Math.round(totalMins * 0.38),
    Math.round(totalMins * 0.14)
  ]

  const mockHourlyPoints = [
    { hour: '9 AM', mins: hourlyMins[0] },
    { hour: '12 PM', mins: hourlyMins[1] },
    { hour: '3 PM', mins: hourlyMins[2] },
    { hour: '6 PM', mins: hourlyMins[3] },
    { hour: '9 PM', mins: hourlyMins[4] }
  ]

  // Spline points for SVG path
  const chartWidth = 280
  const chartHeight = 90
  const maxVal = Math.max(...hourlyMins, 15)

  const splinePoints = useMemo(() => {
    return mockHourlyPoints.map((data, index) => {
      const x = (index * (chartWidth - 24)) / 4 + 12
      const y = chartHeight - 16 - (data.mins / maxVal) * (chartHeight - 32)
      return { x, y }
    })
  }, [hourlyMins, maxVal])

  const splinePath = useMemo(() => {
    if (splinePoints.length === 0) return ''
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
    if (splinePath === '') return ''
    return `${splinePath} L ${splinePoints[splinePoints.length - 1].x} ${chartHeight - 4} L ${splinePoints[0].x} ${chartHeight - 4} Z`
  }, [splinePath, splinePoints])

  const handleBackClick = () => {
    setActiveAppDetailId(null)
  }

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingLimit(parseInt(e.target.value))
  }

  return (
    <section className="absolute inset-0 z-40 rounded-[38px] bg-background/95 backdrop-blur-3xl text-foreground flex flex-col overflow-y-auto scrollbar-none select-none">
      <div className="flex items-center justify-between px-6 pt-5 pb-3 bg-background/80 sticky top-0 z-10 backdrop-blur-md">
        <button
          onClick={handleBackClick}
          className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary hover:bg-muted border border-border/80 text-foreground cursor-pointer transition-colors"
        >
          <ArrowLeftIcon size={18} weight="bold" />
        </button>

        <span className="font-heading text-sm font-bold text-foreground/80">Detailed Report</span>

        <div className="h-10 w-10 shrink-0" />
      </div>

      <div className="px-6 py-4 flex items-center justify-between border-b border-border/40">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary shadow-inner border border-border/10 text-primary">
            <ClockIcon size={28} weight="duotone" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-lg font-bold tracking-tight text-foreground">{appToShow.name}</h2>

              {isLocked && (
                <span className="flex h-4 items-center gap-0.5 rounded-full bg-rose-100 dark:bg-rose-950/40 px-1.5 text-[9px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                  <span>Locked</span>
                </span>
              )}
            </div>

            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{appToShow.category}</span>
          </div>
        </div>
      </div>

      <div className="px-6 py-5 grid grid-cols-2 gap-3.5">
        <div className="rounded-2xl bg-card/50 p-4 border border-border/80 shadow-md shadow-black/2 backdrop-blur-xl flex flex-col">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Usage Today</span>

          <span className="font-heading text-2xl font-black text-foreground mt-1.5">
            {Math.floor(appToShow.timeSpent / 60)}h {appToShow.timeSpent % 60}m
          </span>

          <span className="text-[9px] font-semibold text-muted-foreground/60 mt-1">Simulated time elapsed</span>
        </div>

        <div className="rounded-2xl bg-card/50 p-4 border border-border/80 shadow-md shadow-black/2 backdrop-blur-xl flex flex-col">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">App Limit</span>

          <span className="font-heading text-2xl font-black text-foreground mt-1.5">
            {appToShow.limitMinutes ? `${appToShow.limitMinutes}m` : 'None'}
          </span>

          <span className="text-[9px] font-semibold text-muted-foreground/60 mt-1">Daily allowance threshold</span>
        </div>

        <div className="rounded-2xl bg-card/50 p-4 border border-border/80 shadow-md shadow-black/2 backdrop-blur-xl flex flex-col">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Unlocks</span>

          <span className="font-heading text-2xl font-black text-foreground mt-1.5">
            {appToShow.pickups}
          </span>

          <span className="text-[9px] font-semibold text-muted-foreground/60 mt-1">Total application sessions</span>
        </div>

        <div className="rounded-2xl bg-card/50 p-4 border border-border/80 shadow-md shadow-black/2 backdrop-blur-xl flex flex-col">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Alerts</span>

          <span className="font-heading text-2xl font-black text-foreground mt-1.5">
            {appToShow.notifications}
          </span>

          <span className="text-[9px] font-semibold text-muted-foreground/60 mt-1">Push notifications received</span>
        </div>
      </div>

      <div className="mx-6 p-5 rounded-3xl bg-card/50 border border-border/80 backdrop-blur-xl shadow-lg shadow-black/5">
        <h3 className="font-heading text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Hourly Usage Spline</h3>
        
        <div className="relative h-28 w-full">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-full w-full overflow-visible">
            <defs>
              <linearGradient id="detailAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
              </linearGradient>

              <linearGradient id="detailStrokeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#C084FC" />
                <stop offset="100%" stopColor="#818CF8" />
              </linearGradient>
            </defs>

            <path d={fillPath} fill="url(#detailAreaGrad)" />

            <path d={splinePath} fill="none" stroke="url(#detailStrokeGrad)" strokeWidth="3" strokeLinecap="round" />

            {splinePoints.map((pt, idx) => (
              <g key={idx}>
                <circle cx={pt.x} cy={pt.y} r="3.5" fill="#FFFFFF" stroke="#818CF8" strokeWidth="2" />

                <text
                  x={pt.x}
                  y={chartHeight - 2}
                  textAnchor="middle"
                  className="text-[8px] font-bold fill-muted-foreground/80"
                >
                  {mockHourlyPoints[idx].hour}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      <div className="mx-6 mt-6 p-5 rounded-3xl bg-card/50 border border-border/80 backdrop-blur-xl shadow-lg shadow-black/5 mb-6 flex flex-col gap-5">
        <h3 className="font-heading text-xs font-bold text-muted-foreground uppercase tracking-wider">Active Rules & Lock overrides</h3>

        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/35 border border-border/40 hover:bg-secondary/45 transition-colors">
          <div>
            <span className="text-xs font-semibold text-foreground/90">Manual Force Block</span>

            <p className="text-[10px] font-medium text-muted-foreground mt-0.5">Locks this application instantly</p>
          </div>
          
          <button
            onClick={handleToggleManualLock}
            className={`relative h-6 w-11 rounded-full transition-colors flex items-center cursor-pointer ${
              appToShow.isLockedManually ? 'bg-rose-500 justify-end' : 'bg-muted justify-start'
            }`}
          >
            <motion.div layout className="h-5 w-5 rounded-full bg-white shadow-sm mx-0.5" />
          </button>
        </div>

        <div className="flex flex-col gap-4 p-4 rounded-2xl bg-secondary/35 border border-border/40">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span>Set App Limit</span>

            <span className="text-primary font-black">{editingLimit} Minutes</span>
          </div>

          <input
            type="range"
            min="15"
            max="180"
            step="15"
            value={editingLimit}
            onChange={handleLimitChange}
            className="w-full h-1.5 bg-muted/40 rounded-full appearance-none accent-primary cursor-pointer"
          />

          <div className="flex justify-end gap-2 mt-1">
            {appToShow.limitMinutes && (
              <button
                onClick={() => {
                  updateAppLimit(appToShow.id, 0)
                  addToast(`Removed limit for ${appToShow.name}`, 'info')
                }}
                className="h-8.5 px-3 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 text-[11px] font-bold dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30 transition-colors"
              >
                Disable Limit
              </button>
            )}

            <button
              onClick={handleSave}
              className="h-8.5 px-4 rounded-xl bg-primary text-primary-foreground text-[11px] font-bold shadow-sm hover:opacity-90 flex items-center gap-1.5 transition-colors"
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

export default AppDetailReport
