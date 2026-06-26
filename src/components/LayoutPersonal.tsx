import { useState } from 'react'

import { motion, AnimatePresence } from 'framer-motion'

import { useWellbeingLogic } from '@/hooks/useWellbeingLogic'

import { 
  ClockIcon, 
  BellIcon, 
  TrophyIcon, 
  GearIcon,
  CaretRightIcon,
  CaretDownIcon,
  GameControllerIcon,
  VideoIcon,
  ChatCircleIcon,
  BookOpenIcon,
  ShieldCheckIcon,
  HourglassIcon,
  CheckIcon
} from '@phosphor-icons/react'

export const LayoutPersonal = () => {
  const {
    appStats,
    weeklyUsage,
    weeklyBestDay,
    totalScreenTimeMinutes,
    formattedTotalScreenTime,
    totalPickups,
    totalNotifications,
    topCategories,
    updateAppLimit
  } = useWellbeingLogic()

  // App drawer limit control state
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null)
  const [customLimit, setCustomLimit] = useState<number>(60)

  // Chart active tooltip index state
  const [activeBarIndex, setActiveBarIndex] = useState<number | null>(null)

  const toggleAppExpand = (appId: string, currentLimit?: number) => {
    if (expandedAppId === appId) {
      setExpandedAppId(null)
      return
    }
    setExpandedAppId(appId)
    setCustomLimit(currentLimit || 60)
  }

  const handleSaveLimit = (appId: string) => {
    updateAppLimit(appId, customLimit)
    setExpandedAppId(null)
  }

  const handleRemoveLimit = (appId: string) => {
    updateAppLimit(appId, 0)
    setExpandedAppId(null)
  }

  // Get matching category icon
  const getCategoryIcon = (category: string) => {
    if (category === 'Social') return <ChatCircleIcon size={18} weight="duotone" className="text-purple-500" />
    if (category === 'Entertainment') return <VideoIcon size={18} weight="duotone" className="text-indigo-500" />
    if (category === 'Gaming') return <GameControllerIcon size={18} weight="duotone" className="text-rose-500" />
    if (category === 'Communication') return <BellIcon size={18} weight="duotone" className="text-emerald-500" />
    if (category === 'Productivity') return <BookOpenIcon size={18} weight="duotone" className="text-blue-500" />
    return <ClockIcon size={18} weight="duotone" className="text-amber-500" />
  }

  // Rings parameters
  const ringCenter = 70
  const outerRadius = 55
  const middleRadius = 42
  const innerRadius = 29
  const strokeWidth = 9

  const getStrokeDasharray = (radius: number) => 2 * Math.PI * radius

  // Target goals
  const timeGoal = 360 // 6 hours
  const pickupsGoal = 80
  const notificationsGoal = 200

  const timePercentage = Math.min(totalScreenTimeMinutes / timeGoal, 1)
  const pickupsPercentage = Math.min(totalPickups / pickupsGoal, 1)
  const notificationsPercentage = Math.min(totalNotifications / notificationsGoal, 1)

  return (
    <section className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">Wellbeing</span>
          <h1 className="font-heading text-2xl font-bold tracking-tight mt-0.5">Your Day</h1>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary/80 text-foreground backdrop-blur-md transition-colors hover:bg-secondary">
          <GearIcon size={22} weight="regular" />
        </div>
      </div>

      {/* Radial Telemetry rings */}
      <div className="flex flex-col items-center justify-center rounded-3xl bg-card/60 p-6 shadow-sm border border-border backdrop-blur-xl">
        <div className="relative h-[150px] w-[150px]">
          <svg className="h-full w-full -rotate-90">
            {/* Background Rings */}
            <circle cx={ringCenter} cy={ringCenter} r={outerRadius} fill="none" stroke="currentColor" className="text-muted/10 dark:text-muted/5" strokeWidth={strokeWidth} />
            <circle cx={ringCenter} cy={ringCenter} r={middleRadius} fill="none" stroke="currentColor" className="text-muted/10 dark:text-muted/5" strokeWidth={strokeWidth} />
            <circle cx={ringCenter} cy={ringCenter} r={innerRadius} fill="none" stroke="currentColor" className="text-muted/10 dark:text-muted/5" strokeWidth={strokeWidth} />

            {/* Foreground Progress Rings */}
            <motion.circle
              cx={ringCenter}
              cy={ringCenter}
              r={outerRadius}
              fill="none"
              stroke="oklch(0.58 0.14 290)" // Soft Lavender
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={getStrokeDasharray(outerRadius)}
              initial={{ strokeDashoffset: getStrokeDasharray(outerRadius) }}
              animate={{ strokeDashoffset: getStrokeDasharray(outerRadius) * (1 - timePercentage) }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />

            <motion.circle
              cx={ringCenter}
              cy={ringCenter}
              r={middleRadius}
              fill="none"
              stroke="oklch(0.55 0.12 140)" // Soft Sage
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={getStrokeDasharray(middleRadius)}
              initial={{ strokeDashoffset: getStrokeDasharray(middleRadius) }}
              animate={{ strokeDashoffset: getStrokeDasharray(middleRadius) * (1 - pickupsPercentage) }}
              transition={{ duration: 1.2, delay: 0.1, ease: 'easeOut' }}
            />

            <motion.circle
              cx={ringCenter}
              cy={ringCenter}
              r={innerRadius}
              fill="none"
              stroke="oklch(0.58 0.13 230)" // Soft Blue
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={getStrokeDasharray(innerRadius)}
              initial={{ strokeDashoffset: getStrokeDasharray(innerRadius) }}
              animate={{ strokeDashoffset: getStrokeDasharray(innerRadius) * (1 - notificationsPercentage) }}
              transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
            />
          </svg>

          {/* Center Info */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-heading text-2xl font-bold tracking-tight">{formattedTotalScreenTime}</span>
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Today</span>
          </div>
        </div>

        {/* Ring legend stats */}
        <div className="mt-6 grid w-full grid-cols-3 gap-4 border-t border-border/60 pt-4 text-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-[11px] font-medium text-purple-600 dark:text-purple-400">
              <span className="h-2 w-2 rounded-full bg-purple-500" />
              <span>Usage</span>
            </div>
            <span className="text-sm font-semibold mt-1">{formattedTotalScreenTime}</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Pickups</span>
            </div>
            <span className="text-sm font-semibold mt-1">{totalPickups}</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-[11px] font-medium text-blue-600 dark:text-blue-400">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              <span>Alerts</span>
            </div>
            <span className="text-sm font-semibold mt-1">{totalNotifications}</span>
          </div>
        </div>
      </div>

      {/* Quick Weekly best and Goals state */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 rounded-2xl bg-card/60 p-4 shadow-sm border border-border/80 backdrop-blur-xl">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
            <TrophyIcon size={20} weight="duotone" />
          </div>
          <div>
            <span className="text-[10px] font-medium text-muted-foreground uppercase">Best Day</span>
            <p className="text-sm font-semibold mt-0.5">{weeklyBestDay ? `${weeklyBestDay.day} (${Math.floor(weeklyBestDay.minutes / 60)}h)` : 'N/A'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-card/60 p-4 shadow-sm border border-border/80 backdrop-blur-xl">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <ShieldCheckIcon size={20} weight="duotone" />
          </div>
          <div>
            <span className="text-[10px] font-medium text-muted-foreground uppercase">Limits Status</span>
            <p className="text-sm font-semibold mt-0.5">Healthy</p>
          </div>
        </div>
      </div>

      {/* Samsung One UI scrollable weekly bar chart */}
      <div className="rounded-3xl bg-card/60 p-5 shadow-sm border border-border backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-sm font-semibold tracking-tight">Weekly Activity</h3>
          <span className="text-[11px] font-medium text-muted-foreground">Mon–Sun</span>
        </div>

        {/* Weekly chart SVG bar graph */}
        <div className="relative flex h-36 items-end justify-between px-2 pt-6">
          <AnimatePresence>
            {activeBarIndex !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-0 left-1/2 z-30 -translate-x-1/2 rounded-lg bg-slate-900/90 text-white px-2.5 py-1 text-xs font-medium dark:bg-slate-800/90"
              >
                <span>{weeklyUsage[activeBarIndex].day}: </span>
                <span>{Math.floor(weeklyUsage[activeBarIndex].minutes / 60)}h {weeklyUsage[activeBarIndex].minutes % 60}m</span>
              </motion.div>
            )}
          </AnimatePresence>

          {weeklyUsage.map((data, index) => {
            const maxMinutes = Math.max(...weeklyUsage.map((d) => d.minutes))
            const barHeight = Math.max((data.minutes / maxMinutes) * 80, 8) // in percentage/px
            const isExceeded = data.minutes > data.goalMinutes

            return (
              <div
                key={data.day}
                className="flex flex-col items-center gap-2 cursor-pointer flex-1 group"
                onTouchStart={() => setActiveBarIndex(index)}
                onMouseEnter={() => setActiveBarIndex(index)}
                onMouseLeave={() => setActiveBarIndex(null)}
              >
                <div className="relative w-7 flex justify-center items-end h-[90px]">
                  {/* Goal limit line indicator */}
                  <div className="absolute left-0 right-0 border-t border-dashed border-muted-foreground/30 z-10" style={{ bottom: `${(data.goalMinutes / maxMinutes) * 80}px` }} />

                  <motion.div
                    className={`w-4.5 rounded-t-full transition-colors ${
                      isExceeded 
                        ? 'bg-rose-400 dark:bg-rose-500/80 group-hover:bg-rose-500' 
                        : 'bg-indigo-300 dark:bg-indigo-400/70 group-hover:bg-indigo-400'
                    }`}
                    style={{ height: `${barHeight}px` }}
                    initial={{ height: 0 }}
                    animate={{ height: barHeight }}
                    transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                  />
                </div>

                <span className="text-[10px] font-semibold text-muted-foreground">{data.day}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Top 3 App Categories */}
      <div className="rounded-3xl bg-card/60 p-5 shadow-sm border border-border backdrop-blur-xl">
        <h3 className="font-heading text-sm font-semibold tracking-tight mb-3">Top Categories</h3>
        
        <div className="flex flex-col gap-3">
          {topCategories.map((cat) => {
            const percentage = Math.min((cat.timeSpent / 240) * 100, 100) // normalized to 4 hours max

            return (
              <div key={cat.name} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-foreground/90">{cat.name}</span>
                  <span className="text-muted-foreground font-semibold">{Math.floor(cat.timeSpent / 60)}h {cat.timeSpent % 60}m</span>
                </div>
                
                {/* Custom circular bubble segment instead of linear progress bar */}
                <div className="h-2.5 w-full rounded-full bg-secondary/80 overflow-hidden relative border border-border/20">
                  <motion.div 
                    className="h-full rounded-full" 
                    style={{ backgroundColor: cat.color, width: `${percentage}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* All Apps Breakdown List */}
      <div className="rounded-3xl bg-card/60 p-5 shadow-sm border border-border backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-sm font-semibold tracking-tight">App Usage Limits</h3>
          <span className="text-[11px] font-medium text-muted-foreground">Adjust Limits</span>
        </div>

        <div className="flex flex-col divide-y divide-border/60">
          {appStats.map((app) => {
            const isExpanded = expandedAppId === app.id
            const isLocked = app.limitMinutes && app.timeSpent >= app.limitMinutes
            const limitPercentage = app.limitMinutes ? Math.min((app.timeSpent / app.limitMinutes) * 100, 100) : 0

            return (
              <div key={app.id} className="py-3.5 first:pt-0 last:pb-0 flex flex-col">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleAppExpand(app.id, app.limitMinutes)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/80 shadow-inner">
                      {getCategoryIcon(app.category)}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-foreground/90">{app.name}</span>
                        {isLocked && (
                          <span className="flex h-4 items-center gap-0.5 rounded-full bg-rose-100 dark:bg-rose-950/40 px-1.5 text-[9px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                            <HourglassIcon size={9} weight="fill" />
                            <span>Locked</span>
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground mt-0.5">
                        <span>{app.category}</span>
                        <span>•</span>
                        <span>{app.pickups} pickups</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-right">
                    <div>
                      <p className="text-sm font-bold text-foreground/90">{Math.floor(app.timeSpent / 60)}h {app.timeSpent % 60}m</p>
                      {app.limitMinutes ? (
                        <p className="text-[10px] font-medium text-muted-foreground mt-0.5">Limit: {app.limitMinutes}m</p>
                      ) : (
                        <p className="text-[10px] font-medium text-muted-foreground/60 mt-0.5">No Limit</p>
                      )}
                    </div>

                    {isExpanded ? (
                      <CaretDownIcon size={16} className="text-muted-foreground" />
                    ) : (
                      <CaretRightIcon size={16} className="text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* SVG-based circular progress allowance info if limit set */}
                {app.limitMinutes && !isExpanded && (
                  <div className="mt-2.5 flex items-center justify-between rounded-xl bg-secondary/30 p-2 text-[11px] font-medium text-muted-foreground border border-border/30">
                    <span>Allowance used:</span>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 rounded-full bg-muted/20 overflow-hidden">
                        <div className={`h-full rounded-full ${isLocked ? 'bg-rose-400' : 'bg-purple-400'}`} style={{ width: `${limitPercentage}%` }} />
                      </div>
                      <span className="font-bold text-foreground/80">{Math.round(limitPercentage)}%</span>
                    </div>
                  </div>
                )}

                {/* Expandable limit configuration drawer */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-3"
                    >
                      <div className="rounded-2xl bg-secondary/40 p-4 border border-border/80 flex flex-col gap-4">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span>Set Daily Limit</span>
                          <span className="text-primary font-bold">{customLimit} Minutes</span>
                        </div>

                        {/* Slider touch-target friendly control */}
                        <div className="flex items-center gap-4">
                          <input
                            type="range"
                            min="15"
                            max="240"
                            step="15"
                            value={customLimit}
                            onChange={(e) => setCustomLimit(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-muted/30 rounded-full appearance-none cursor-pointer accent-primary"
                          />
                        </div>

                        <div className="flex items-center gap-2.5 justify-end">
                          {app.limitMinutes && (
                            <button
                              onClick={() => handleRemoveLimit(app.id)}
                              className="h-9 px-3 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 text-xs font-bold transition-colors hover:bg-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30"
                            >
                              Remove
                            </button>
                          )}

                          <button
                            onClick={() => handleSaveLimit(app.id)}
                            className="h-9 px-3 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm transition-opacity hover:opacity-90 flex items-center gap-1"
                          >
                            <CheckIcon size={14} weight="bold" />
                            <span>Save</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
export default LayoutPersonal
