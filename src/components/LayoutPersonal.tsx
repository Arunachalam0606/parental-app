import { useState, useMemo } from 'react'

import { motion, AnimatePresence } from 'framer-motion'

import { useWellbeingLogic } from '@/hooks/useWellbeingLogic'

import { 
  ClockIcon, 
  BellIcon, 
  TrophyIcon, 
  GearIcon,
  CaretRightIcon,
  GameControllerIcon,
  VideoIcon,
  ChatCircleIcon,
  BookOpenIcon,
  HourglassIcon,
  LockIcon
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
    setActiveAppDetailId
  } = useWellbeingLogic()

  // Chart active tooltip index state
  const [activeBarIndex, setActiveBarIndex] = useState<number | null>(null)

  // Local state for app list category filtering
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All')

  // Get matching category icon
  const getCategoryIcon = (category: string) => {
    if (category === 'Social') return <ChatCircleIcon size={18} weight="duotone" className="text-purple-500" />
    if (category === 'Entertainment') return <VideoIcon size={18} weight="duotone" className="text-indigo-500" />
    if (category === 'Gaming') return <GameControllerIcon size={18} weight="duotone" className="text-rose-500" />
    if (category === 'Communication') return <BellIcon size={18} weight="duotone" className="text-emerald-500" />
    if (category === 'Productivity') return <BookOpenIcon size={18} weight="duotone" className="text-blue-500" />
    return <ClockIcon size={18} weight="duotone" className="text-amber-500" />
  }

  // Filtered Apps
  const filteredApps = appStats.filter((app) => {
    if (selectedCategoryFilter === 'All') return true
    return app.category === selectedCategoryFilter
  })

  // Categories list
  const categoryFilters = ['All', 'Social', 'Entertainment', 'Productivity', 'Gaming', 'Communication']

  // Rings parameters
  const ringCenter = 70
  const outerRadius = 55
  const middleRadius = 42
  const innerRadius = 29
  const strokeWidth = 8.5

  const getStrokeDasharray = (radius: number) => 2 * Math.PI * radius

  // Target goals
  const timeGoal = 360
  const pickupsGoal = 80
  const notificationsGoal = 200

  const timePercentage = Math.min(totalScreenTimeMinutes / timeGoal, 1)
  const pickupsPercentage = Math.min(totalPickups / pickupsGoal, 1)
  const notificationsPercentage = Math.min(totalNotifications / notificationsGoal, 1)

  // Bezier curve calculations for weekly trend spline
  const chartWidth = 280
  const chartHeight = 85
  const maxMinutes = Math.max(...weeklyUsage.map((d) => d.minutes), 240)
  
  const splinePoints = useMemo(() => {
    return weeklyUsage.map((data, index) => {
      const x = (index * (chartWidth - 24)) / 6 + 12
      const y = chartHeight - 16 - (data.minutes / maxMinutes) * (chartHeight - 32)
      return { x, y }
    })
  }, [weeklyUsage, maxMinutes])

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

  const goalY = chartHeight - 16 - (240 / maxMinutes) * (chartHeight - 32)

  // Split formatting helper for metrics
  const parseScreenTime = (timeStr: string) => {
    const parts = timeStr.split(' ')
    if (parts.length === 2) {
      return (
        <span className="font-heading text-3xl font-extrabold tracking-tight">
          {parts[0].replace('h', '')}<span className="text-sm text-muted-foreground font-normal ml-0.5">h</span>{' '}
          {parts[1].replace('m', '')}<span className="text-xs text-muted-foreground font-normal ml-0.5">m</span>
        </span>
      )
    }
    return <span className="font-heading text-3xl font-extrabold tracking-tight">{timeStr}</span>
  }

  // Category gradients mapping
  const getCategoryGradient = (catName: string) => {
    if (catName === 'Social') return 'bg-gradient-to-r from-purple-400 to-pink-500'
    if (catName === 'Entertainment') return 'bg-gradient-to-r from-indigo-400 to-blue-500'
    if (catName === 'Gaming') return 'bg-gradient-to-r from-rose-400 to-red-500'
    if (catName === 'Communication') return 'bg-gradient-to-r from-emerald-400 to-teal-500'
    if (catName === 'Productivity') return 'bg-gradient-to-r from-blue-400 to-sky-500'
    return 'bg-gradient-to-r from-amber-400 to-orange-500'
  }

  const handleAppClick = (appId: string) => {
    setActiveAppDetailId(appId)
  }

  return (
    <section className="flex flex-col gap-6 select-none">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Wellbeing</span>

          <h1 className="font-heading text-2xl font-bold tracking-tight mt-0.5 text-foreground/90">Aura Dashboard</h1>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary/80 text-foreground backdrop-blur-md transition-colors hover:bg-secondary">
          <GearIcon size={22} weight="regular" />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center rounded-3xl bg-card/50 p-6 shadow-lg shadow-black/5 border border-border/80 backdrop-blur-xl">
        <div className="relative h-[150px] w-[150px]">
          <svg className="h-full w-full -rotate-90">
            <defs>
              <linearGradient id="usageRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A78BFA" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>

              <linearGradient id="pickupsRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34D399" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>

              <linearGradient id="notifsRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="100%" stopColor="#2563EB" />
              </linearGradient>

              <filter id="ringGlow" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <circle cx={ringCenter} cy={ringCenter} r={outerRadius} fill="none" stroke="currentColor" className="text-muted/10 dark:text-muted/5" strokeWidth={strokeWidth} />

            <circle cx={ringCenter} cy={ringCenter} r={middleRadius} fill="none" stroke="currentColor" className="text-muted/10 dark:text-muted/5" strokeWidth={strokeWidth} />

            <circle cx={ringCenter} cy={ringCenter} r={innerRadius} fill="none" stroke="currentColor" className="text-muted/10 dark:text-muted/5" strokeWidth={strokeWidth} />

            <motion.circle
              cx={ringCenter}
              cy={ringCenter}
              r={outerRadius}
              fill="none"
              stroke="url(#usageRingGrad)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              filter="url(#ringGlow)"
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
              stroke="url(#pickupsRingGrad)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              filter="url(#ringGlow)"
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
              stroke="url(#notifsRingGrad)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              filter="url(#ringGlow)"
              strokeDasharray={getStrokeDasharray(innerRadius)}
              initial={{ strokeDashoffset: getStrokeDasharray(innerRadius) }}
              animate={{ strokeDashoffset: getStrokeDasharray(innerRadius) * (1 - notificationsPercentage) }}
              transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            {parseScreenTime(formattedTotalScreenTime)}

            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">Today</span>
          </div>
        </div>

        <div className="mt-6 grid w-full grid-cols-3 gap-4 border-t border-border/60 pt-4 text-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-purple-600 dark:text-purple-400">
              <span className="h-2 w-2 rounded-full bg-purple-500 shadow-sm" />

              <span>Usage</span>
            </div>

            <span className="text-xs font-bold mt-1 text-foreground/90">{formattedTotalScreenTime}</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm" />

              <span>Pickups</span>
            </div>

            <span className="text-xs font-bold mt-1 text-foreground/90">{totalPickups}</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
              <span className="h-2 w-2 rounded-full bg-blue-500 shadow-sm" />

              <span>Alerts</span>
            </div>

            <span className="text-xs font-bold mt-1 text-foreground/90">{totalNotifications}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl bg-card/50 p-4 border border-border/80 shadow-md shadow-black/2 backdrop-blur-xl">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-100 to-indigo-100 dark:from-purple-950/40 dark:to-indigo-950/40 text-purple-600 dark:text-purple-400 border border-purple-200/30">
          <TrophyIcon size={20} weight="duotone" />
        </div>

        <div>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Weekly Best Day</span>

          <p className="text-xs font-bold mt-0.5 text-foreground/90">
            {weeklyBestDay ? `${weeklyBestDay.day} (${Math.floor(weeklyBestDay.minutes / 60)}h ${weeklyBestDay.minutes % 60}m of usage)` : 'N/A'}
          </p>
        </div>
      </div>

      <div className="rounded-3xl bg-card/50 p-5 border border-border/80 backdrop-blur-xl shadow-lg shadow-black/5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading text-sm font-semibold tracking-tight">Weekly Trend</h3>

          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Sun–Sat</span>
        </div>

        <div className="relative h-28 w-full">
          <AnimatePresence>
            {activeBarIndex !== null && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                className="absolute -top-6 left-1/2 z-30 -translate-x-1/2 rounded-lg bg-slate-950/95 text-white px-2 py-0.5 text-[10px] font-bold shadow-md flex items-center gap-1.5"
              >
                <span>{weeklyUsage[activeBarIndex].day}:</span>

                <span className="text-purple-400 font-extrabold">{Math.floor(weeklyUsage[activeBarIndex].minutes / 60)}h {weeklyUsage[activeBarIndex].minutes % 60}m</span>
              </motion.div>
            )}
          </AnimatePresence>

          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-full w-full overflow-visible">
            <defs>
              <linearGradient id="trendAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
              </linearGradient>

              <linearGradient id="splineStrokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#C084FC" />
                <stop offset="50%" stopColor="#818CF8" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>

            <line x1="8" y1={goalY} x2={chartWidth - 8} y2={goalY} stroke="currentColor" className="text-muted-foreground/15" strokeDasharray="3 3" strokeWidth="1" />

            <path d={fillPath} fill="url(#trendAreaGradient)" />

            <motion.path
              d={splinePath}
              fill="none"
              stroke="url(#splineStrokeGradient)"
              strokeWidth="3.2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />

            {splinePoints.map((pt, idx) => {
              const isHovered = activeBarIndex === idx
              const dataVal = weeklyUsage[idx]
              const isExceeded = dataVal.minutes > dataVal.goalMinutes

              return (
                <g key={idx} className="cursor-pointer">
                  {isHovered && (
                    <circle cx={pt.x} cy={pt.y} r="8" fill={isExceeded ? '#EF4444' : '#818CF8'} className="opacity-20 animate-ping" />
                  )}

                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? "5" : "3.5"}
                    fill={isHovered ? (isExceeded ? "#EF4444" : "#EC4899") : "#FFFFFF"}
                    stroke={isExceeded ? "#EF4444" : "#818CF8"}
                    strokeWidth="2.2"
                    onMouseEnter={() => setActiveBarIndex(idx)}
                    onMouseLeave={() => setActiveBarIndex(null)}
                  />

                  <text
                    x={pt.x}
                    y={chartHeight - 2}
                    textAnchor="middle"
                    className={`text-[8.5px] font-bold ${isHovered ? 'fill-foreground font-black' : 'fill-muted-foreground/80'}`}
                  >
                    {dataVal.day}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>

      <div className="rounded-3xl bg-card/50 p-5 border border-border/80 backdrop-blur-xl shadow-lg shadow-black/5">
        <h3 className="font-heading text-sm font-semibold tracking-tight mb-4">Category Allocations</h3>

        <div className="flex flex-col gap-4">
          {topCategories.map((cat) => {
            const percentage = Math.min((cat.timeSpent / 240) * 100, 100)

            return (
              <div key={cat.name} className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-foreground/90">{cat.name}</span>

                  <span className="text-muted-foreground">{Math.floor(cat.timeSpent / 60)}h {cat.timeSpent % 60}m</span>
                </div>

                <div className="h-2 w-full rounded-full bg-secondary dark:bg-slate-800/80 overflow-hidden relative shadow-inner border border-border/10">
                  <motion.div 
                    className={`h-full rounded-full ${getCategoryGradient(cat.name)}`}
                    style={{ width: `${percentage}%` }}
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

      <div className="rounded-3xl bg-card/50 p-5 border border-border/80 backdrop-blur-xl shadow-lg shadow-black/5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-sm font-semibold tracking-tight">Installed Applications</h3>

          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Tap to configure</span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-3 mb-2 scrollbar-none">
          {categoryFilters.map((filter) => {
            const isSelected = selectedCategoryFilter === filter

            return (
              <button
                key={filter}
                onClick={() => setSelectedCategoryFilter(filter)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold whitespace-nowrap border transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-primary border-primary/20 text-primary-foreground shadow-sm' 
                    : 'bg-secondary/60 border-border/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                {filter}
              </button>
            )
          })}
        </div>

        <div className="flex flex-col gap-2.5">
          {filteredApps.map((app) => {
            const isLimitHit = app.limitMinutes && app.timeSpent >= app.limitMinutes
            const isLocked = app.isLockedManually || isLimitHit

            return (
              <motion.div 
                key={app.id} 
                className="py-3 px-3.5 flex items-center justify-between cursor-pointer rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm transition-all duration-200 hover:scale-[1.01] hover:bg-card/60 hover:border-border/80"
                onClick={() => handleAppClick(app.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary shadow-inner border border-border/10">
                    {getCategoryIcon(app.category)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground/90">{app.name}</span>

                      {isLocked && (
                        <span className="flex h-4 items-center gap-0.5 rounded-full bg-rose-100 dark:bg-rose-950/40 px-1.5 text-[9px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                          {app.isLockedManually ? <LockIcon size={9} weight="fill" /> : <HourglassIcon size={9} weight="fill" />}

                          <span>Blocked</span>
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
                    <p className="text-sm font-extrabold text-foreground/90">{Math.floor(app.timeSpent / 60)}h {app.timeSpent % 60}m</p>

                    {app.limitMinutes ? (
                      <p className="text-[10px] font-semibold text-muted-foreground mt-0.5">Limit: {app.limitMinutes}m</p>
                    ) : (
                      <p className="text-[10px] font-semibold text-muted-foreground/60 mt-0.5">No Limit</p>
                    )}
                  </div>

                  <CaretRightIcon size={16} className="text-muted-foreground/60 transition-transform group-hover:translate-x-0.5" />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default LayoutPersonal
