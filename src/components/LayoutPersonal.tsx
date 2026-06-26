import { useState, useMemo, useCallback } from 'react'

import { motion, AnimatePresence } from 'framer-motion'

import { useWellbeingLogic } from '@/hooks/useWellbeingLogic'

import { 
  CaretRightIcon,
  VideoIcon,
  ChatCircleIcon,
  BookOpenIcon,
  ArrowLeftIcon,
  ChartBarIcon
} from '@phosphor-icons/react'

export const LayoutPersonal = () => {
  const {
    appStats,
    weeklyUsage,
    totalScreenTimeMinutes,
    formattedTotalScreenTime,
    totalPickups,
    totalNotifications,
    wellbeingSubPage,
    setWellbeingSubPage,
    selectedDate,
    setSelectedDate,
    dashboardViewMode,
    setDashboardViewMode,
    goalDetailDate,
    setGoalDetailDate,
    screenTimeGoal,
    setScreenTimeGoal,
    addToast,
    setActiveTab,
    updateAppLimit,
    setActiveAppDetailId
  } = useWellbeingLogic()

  // Local state for wheel pickers and toggle states
  const [selectedTimerApp, setSelectedTimerApp] = useState<string>('insta')
  const [wheelHours, setWheelHours] = useState<number>(2)
  const [wheelMinutes, setWheelMinutes] = useState<number>(15)
  const [showGoalModal, setShowGoalModal] = useState<boolean>(false)
  const [tempGoalMins, setTempGoalMins] = useState<number>(360)
  const [showEmptyState, setShowEmptyState] = useState<boolean>(false)

  // Navigate handlers (Logic Isolation: no inline arrow functions in return)
  const handleGoToDashboard = useCallback(() => setWellbeingSubPage('dashboard'), [setWellbeingSubPage])
  const handleGoToGoal = useCallback(() => setWellbeingSubPage('goal'), [setWellbeingSubPage])
  const handleGoToReport = useCallback(() => setWellbeingSubPage('report'), [setWellbeingSubPage])
  const handleGoToHome = useCallback(() => setWellbeingSubPage('home'), [setWellbeingSubPage])
  
  const handleOpenSetTimer = useCallback((appId: string) => {
    setSelectedTimerApp(appId)
    const app = appStats.find((a) => a.id === appId)
    const currentLimit = app?.limitMinutes || 60
    setWheelHours(Math.floor(currentLimit / 60))
    setWheelMinutes(currentLimit % 60)
    setWellbeingSubPage('set-timer')
  }, [appStats, setWellbeingSubPage])

  const handleOpenTimerForApp = useCallback((appId: string) => () => {
    handleOpenSetTimer(appId)
  }, [handleOpenSetTimer])

  const handleOpenGoalPicker = useCallback(() => {
    setTempGoalMins(screenTimeGoal)
    setShowGoalModal(true)
  }, [screenTimeGoal])

  const handleCloseGoalPicker = useCallback(() => {
    setShowGoalModal(false)
  }, [])

  const handleSaveGoal = useCallback(() => {
    setScreenTimeGoal(tempGoalMins)
    setShowGoalModal(false)
    addToast(`Screen time goal updated to ${Math.floor(tempGoalMins / 60)}h`, 'success')
  }, [tempGoalMins, setScreenTimeGoal, addToast])

  const handleSaveTimer = useCallback(() => {
    const totalMins = wheelHours * 60 + wheelMinutes
    const targetApp = appStats.find((a) => a.id === selectedTimerApp)
    if (targetApp) {
      updateAppLimit(selectedTimerApp, totalMins)
      addToast(`Set timer for ${targetApp.name} to ${wheelHours}h ${wheelMinutes}m`, 'success')
    }
    setWellbeingSubPage('home')
  }, [wheelHours, wheelMinutes, appStats, selectedTimerApp, updateAppLimit, addToast, setWellbeingSubPage])

  const handleCategoriesCardClick = useCallback(() => {
    setWellbeingSubPage('dashboard')
    setDashboardViewMode('categories')
  }, [setWellbeingSubPage, setDashboardViewMode])

  const handleTimersCardClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return
    setWellbeingSubPage('set-timer')
  }, [setWellbeingSubPage])

  const handleToggleEmptyState = useCallback(() => {
    setShowEmptyState((prev) => !prev)
  }, [])

  const handleSelectDay = useCallback((day: string) => () => {
    setSelectedDate(day)
    addToast(`Viewing data for June ${day}`, 'info')
  }, [setSelectedDate, addToast])

  const handleSelectGoalDate = useCallback((date: string) => () => {
    setGoalDetailDate(date)
  }, [setGoalDetailDate])

  const handleAppDetailSelect = useCallback((appId: string) => () => {
    setActiveAppDetailId(appId)
  }, [setActiveAppDetailId])

  const handleGoalHourSelect = useCallback((h: number) => () => {
    setTempGoalMins(h * 60)
  }, [])

  const handleResetGoalToDefault = useCallback(() => {
    setScreenTimeGoal(360)
    setShowGoalModal(false)
    addToast("Reset goal to default 6h", "info")
  }, [setScreenTimeGoal, addToast])

  // Ring parameters
  const ringCenter = 45
  const donutRadius = 30
  const circumference = 2 * Math.PI * donutRadius

  // Compute donut segment values
  const donutSegments = useMemo(() => {
    const sortedApps = [...appStats].sort((a, b) => b.timeSpent - a.timeSpent).slice(0, 3)
    
    return sortedApps.map((app, index) => {
      const share = showEmptyState ? 0 : app.timeSpent / (totalScreenTimeMinutes || 1)
      const strokeDasharray = `${circumference * share} ${circumference}`
      
      const previousShareSum = sortedApps
        .slice(0, index)
        .reduce((sum, prevApp) => sum + (showEmptyState ? 0 : prevApp.timeSpent / (totalScreenTimeMinutes || 1)), 0)
      
      const rotation = (previousShareSum * 360) - 90

      const colors = [
        'stroke-[oklch(0.65_0.15_250)]', 
        'stroke-[oklch(0.68_0.14_170)]', 
        'stroke-[oklch(0.66_0.15_300)]'  
      ]

      return {
        id: app.id,
        name: app.name,
        time: showEmptyState ? 0 : app.timeSpent,
        dashArray: strokeDasharray,
        rotation,
        colorClass: colors[index % colors.length]
      }
    })
  }, [appStats, totalScreenTimeMinutes, circumference, showEmptyState])

  // Monthly Calendar Date Rings for June (May 30 to June 26)
  const calendarDays = useMemo(() => {
    const daysArr = []
    daysArr.push({ date: '30', month: 'May', used: 190, goal: 240, status: 'used' })
    daysArr.push({ date: '31', month: 'May', used: 260, goal: 240, status: 'over' })
    
    const mockUsages = [
      120, 180, 210, 150, 250, 310, 140, 
      190, 220, 290, 180, 230, 295, 170, 
      210, 110, 160, 240, 215, 230, 190, 
      250, 180, 220, 250, 150, 0, 0      
    ]

    for (let i = 1; i <= 27; i++) {
      const dateStr = i.toString().padStart(2, '0')
      const used = mockUsages[i - 1]
      const goal = 240
      let status = 'remaining'
      if (used > 0) {
        status = used > goal ? 'over' : 'used'
      }
      daysArr.push({ date: dateStr, month: 'June', used, goal, status })
    }
    return daysArr
  }, [])

  // Semicircular progress calculations
  const semiRadius = 50
  const semiCircumference = Math.PI * semiRadius
  const activeTimeSpent = showEmptyState ? 0 : totalScreenTimeMinutes
  const todayRemaining = Math.max(360 - activeTimeSpent, 0)
  const todayProgress = Math.min(activeTimeSpent / 360, 1)

  // Selected date details for Goal History screen
  const activeGoalDetail = useMemo(() => {
    const defaultData = { date: '26', used: activeTimeSpent, goal: screenTimeGoal, status: activeTimeSpent > screenTimeGoal ? 'over' : 'used' }
    if (!goalDetailDate) {
      return defaultData
    }
    const match = calendarDays.find((d) => d.date === goalDetailDate && d.month === 'June')
    if (match) return showEmptyState ? { ...match, used: 0, status: 'remaining' } : match
    return defaultData
  }, [goalDetailDate, calendarDays, activeTimeSpent, screenTimeGoal, showEmptyState])

  // Heatmap hourly grid array (7 days x 24 hours scaled)
  const heatmapData = useMemo(() => {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    
    return days.map((day, d) => {
      const hourlyVals = Array.from({ length: 24 }, (_, h) => {
        let density = 0
        if (showEmptyState) return 0
        if (h >= 12 && h <= 14) {
          density = ((d * h) % 3) + 1
        } else if (h >= 19 && h <= 21) {
          density = 3
        } else if ((d * 7 + h) % 5 === 0) {
          density = 1
        }
        return density
      })

      return { day, values: hourlyVals }
    })
  }, [showEmptyState])

  // Weekly Report stacked bar details
  const maxWeeklyMins = Math.max(...weeklyUsage.map((d) => d.minutes), 360)

  // --- Sub-Page JSX Structure computation (Logic Isolation) ---
  const subPageContent = useMemo(() => {
    // 1. WELLBEING HOME PAGE VIEW
    if (wellbeingSubPage === 'home') {
      const screenTimeTodayText = showEmptyState ? '0m' : formattedTotalScreenTime
      const socialTimeVal = showEmptyState ? '0 m' : '1 h 28 m'
      const shoppingTimeVal = showEmptyState ? '0 m' : '36 m'
      const productiveTimeVal = showEmptyState ? '0 m' : '9 m'

      const timersList = showEmptyState 
        ? [
            { id: 'insta', name: 'Instagram', usedText: 'Used: 0m' },
            { id: 'social', name: 'Social Apps', usedText: 'Used: 0m' }
          ]
        : [
            { id: 'insta', name: 'Instagram', usedText: 'Used: 1h 50m' },
            { id: 'social', name: 'Social Apps', usedText: 'Used: 3h 15m' }
          ]

      return (
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center justify-between px-1">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                Samsung App Care
              </span>

              <h1 className="font-heading text-lg font-bold tracking-tight text-foreground/90 mt-0.5">
                Digital Wellbeing
              </h1>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleToggleEmptyState}
                className="px-2.5 py-1.5 text-[9px] font-bold rounded-lg bg-secondary/80 border border-border text-foreground/75 cursor-pointer uppercase tracking-wider active:scale-95"
              >
                <span>{showEmptyState ? 'Demo: Pinned' : 'Demo: Empty'}</span>
              </button>

              <button 
                onClick={handleGoToReport}
                className="h-9 w-9 flex items-center justify-center rounded-lg bg-secondary border border-border/80 text-foreground cursor-pointer active:scale-95"
                title="Weekly report"
              >
                <ChartBarIcon size={16} weight="regular" />
              </button>
            </div>
          </div>

          {/* Screen time today Card */}
          <div 
            onClick={handleGoToDashboard}
            className="flex flex-col gap-4 rounded-2xl bg-card p-4.5 border border-border backdrop-blur-xl shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
          >
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Screen time today
              </span>

              <div className="flex items-baseline justify-between mt-1">
                <h3 className="font-heading text-2xl font-black text-foreground/95">
                  {screenTimeTodayText}
                </h3>

                <CaretRightIcon size={12} className="text-muted-foreground/60" />
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col gap-2">
                {donutSegments.map((seg, idx) => (
                  <div key={seg.id} className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${
                      idx === 0 ? 'bg-[oklch(0.65_0.15_250)]' : idx === 1 ? 'bg-[oklch(0.68_0.14_170)]' : 'bg-[oklch(0.66_0.15_300)]'
                    }`} />
                    
                    <span className="text-[11px] font-bold text-foreground/80">
                      {seg.name}
                    </span>

                    <span className="text-[10px] text-muted-foreground font-medium">
                      {showEmptyState ? '0m' : `${Math.floor(seg.time / 60)}h ${seg.time % 60}m`}
                    </span>
                  </div>
                ))}
              </div>

              <div className="relative h-[85px] w-[85px] shrink-0">
                <svg className="h-full w-full">
                  <circle cx={ringCenter} cy={ringCenter} r={donutRadius} fill="none" stroke="currentColor" className="text-muted/10 dark:text-muted/5" strokeWidth="8" />

                  {donutSegments.map((seg) => (
                    <circle
                      key={seg.id}
                      cx={ringCenter}
                      cy={ringCenter}
                      r={donutRadius}
                      fill="none"
                      className={seg.colorClass}
                      strokeWidth="8"
                      strokeDasharray={seg.dashArray}
                      strokeLinecap="round"
                      style={{
                        transformOrigin: '45px 45px',
                        transform: `rotate(${seg.rotation}deg)`
                      }}
                    />
                  ))}
                </svg>
              </div>
            </div>
          </div>

          {/* Most used app categories Grid */}
          <div 
            onClick={handleCategoriesCardClick}
            className="flex flex-col gap-3 cursor-pointer p-4.5 rounded-2xl bg-card border border-border backdrop-blur-xl active:scale-[0.98] transition-transform shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider pl-0.5">
                Most used app categories
              </span>

              <CaretRightIcon size={12} className="text-muted-foreground/60" />
            </div>

            <div className="flex gap-2.5 overflow-x-auto pb-0.5 scrollbar-none">
              <div className="flex gap-2.5 px-0.5">
                <div className="h-[95px] w-[95px] shrink-0 rounded-xl bg-secondary/35 p-3 border border-border/30 flex flex-col justify-between">
                  <div className="h-7 w-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <ChatCircleIcon size={14} weight="fill" />
                  </div>

                  <div>
                    <span className="text-[9px] font-bold text-muted-foreground block">Social</span>
                    <span className="text-[10px] font-extrabold text-foreground/90 mt-0.5 block">{socialTimeVal}</span>
                  </div>
                </div>

                <div className="h-[95px] w-[95px] shrink-0 rounded-xl bg-secondary/35 p-3 border border-border/30 flex flex-col justify-between">
                  <div className="h-7 w-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <VideoIcon size={14} weight="fill" />
                  </div>

                  <div>
                    <span className="text-[9px] font-bold text-muted-foreground block">Shopping</span>
                    <span className="text-[10px] font-extrabold text-foreground/90 mt-0.5 block">{shoppingTimeVal}</span>
                  </div>
                </div>

                <div className="h-[95px] w-[95px] shrink-0 rounded-xl bg-secondary/35 p-3 border border-border/30 flex flex-col justify-between">
                  <div className="h-7 w-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <BookOpenIcon size={14} weight="fill" />
                  </div>

                  <div>
                    <span className="text-[9px] font-bold text-muted-foreground block">Productive</span>
                    <span className="text-[10px] font-extrabold text-foreground/90 mt-0.5 block">{productiveTimeVal}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* App timers Section */}
          <div 
            onClick={handleTimersCardClick}
            className="rounded-2xl bg-card p-4.5 border border-border backdrop-blur-xl flex flex-col gap-3.5 shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-sm font-semibold tracking-tight text-foreground/90">
                  App timers
                </h3>

                <p className="text-[10px] font-medium leading-relaxed text-muted-foreground mt-0.5">
                  Set daily caps on distracting apps.
                </p>
              </div>

              <CaretRightIcon size={12} className="text-muted-foreground/60 shrink-0" />
            </div>

            <div className="flex flex-col gap-2.5">
              {timersList.map((timer) => (
                <div 
                  key={timer.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/30"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-lg ${
                      timer.id === 'insta' ? 'bg-gradient-to-tr from-purple-500 to-pink-500' : 'bg-gradient-to-tr from-sky-400 to-indigo-500'
                    } text-white flex items-center justify-center font-bold text-xs shadow-sm`}>
                      <span>{timer.id === 'insta' ? 'I' : 'S'}</span>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-foreground/85 block">{timer.name}</span>
                      <span className="text-[9.5px] font-medium text-muted-foreground block mt-0.5">{timer.usedText}</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleOpenTimerForApp(timer.id)}
                    className="h-7 px-3.5 rounded-lg bg-secondary border border-border text-[9px] font-bold text-foreground/80 cursor-pointer active:scale-95"
                  >
                    Set timer
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Screen time goal Card */}
          <div 
            onClick={handleGoToGoal}
            className="rounded-2xl bg-card p-4.5 border border-border backdrop-blur-xl flex flex-col gap-3.5 shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-heading text-sm font-semibold tracking-tight text-foreground/90">
                Screen time goal
              </h3>

              <CaretRightIcon size={12} className="text-muted-foreground/60" />
            </div>

            <div className="flex flex-col items-center gap-3.5">
              <div className="relative h-[85px] w-[170px] overflow-hidden flex items-end justify-center">
                <svg className="absolute top-0 left-0 h-[90px] w-[170px]">
                  <defs>
                    <linearGradient id="usageRingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="oklch(0.68 0.14 170)" />
                      <stop offset="100%" stopColor="oklch(0.56 0.12 250)" />
                    </linearGradient>
                  </defs>

                  <path
                    d="M 20 80 A 65 65 0 0 1 150 80"
                    fill="none"
                    stroke="currentColor"
                    className="text-muted/10 dark:text-muted/5"
                    strokeWidth="9"
                    strokeLinecap="round"
                  />

                  <path
                    d="M 20 80 A 65 65 0 0 1 150 80"
                    fill="none"
                    stroke="url(#usageRingGrad)"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray={semiCircumference}
                    strokeDashoffset={semiCircumference * (1 - todayProgress)}
                  />
                </svg>
                
                <div className="flex flex-col items-center text-center pb-1">
                  <span className="font-heading text-xl font-black text-foreground/95">
                    {Math.floor(todayRemaining / 60)}h {todayRemaining % 60}m
                  </span>
                  
                  <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
                    Remaining
                  </span>
                </div>
              </div>

              <button 
                onClick={handleGoToGoal}
                className="h-8 px-4 rounded-lg bg-secondary border border-border text-[10px] font-bold text-foreground/80 cursor-pointer active:scale-95"
              >
                Goal 6 h
              </button>
            </div>
          </div>

          {/* Parental controls Shortcut Card */}
          <div 
            onClick={() => setActiveTab('parental')}
            className="rounded-2xl bg-card p-4.5 border border-border backdrop-blur-xl shadow-sm cursor-pointer active:scale-[0.98] transition-transform flex flex-col gap-1.5"
          >
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
              Parental controls
            </span>

            <p className="text-[10.5px] font-semibold text-foreground/80 leading-relaxed">
              Add content restrictions and set other limits to help your child balance screen time.
            </p>
          </div>
        </div>
      )
    }

    // 2. DASHBOARD DETAILED BAR CHARTS VIEW
    if (wellbeingSubPage === 'dashboard') {
      const displayTotalScreenTime = showEmptyState ? '0m' : formattedTotalScreenTime
      const displayPickups = showEmptyState ? 0 : totalPickups
      const displayNotifications = showEmptyState ? 0 : totalNotifications
      const displayAppStats = showEmptyState ? [] : appStats

      return (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <button 
              onClick={handleGoToHome}
              className="h-9 w-9 flex items-center justify-center rounded-lg bg-secondary border border-border/80 text-foreground cursor-pointer active:scale-95"
            >
              <ArrowLeftIcon size={16} weight="bold" />
            </button>
            <h1 className="font-heading text-sm font-bold text-foreground/90">Detailed Report</h1>
            <div className="h-9 w-9" />
          </div>

          <div className="rounded-2xl bg-card p-4.5 border border-border backdrop-blur-xl flex flex-col gap-3.5 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Screen time</span>
              <span className="text-xs font-black text-foreground">{displayTotalScreenTime}</span>
            </div>

            <div className="flex justify-between items-center text-[10.5px] font-bold text-muted-foreground/80 px-0.5">
              <div className="flex items-center gap-1">
                <span>Pickups:</span>
                <span className="text-foreground">{displayPickups}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>Notifications:</span>
                <span className="text-foreground">{displayNotifications}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-card p-4.5 border border-border backdrop-blur-xl flex flex-col gap-4 shadow-sm">
            <span className="font-heading text-xs font-bold text-muted-foreground uppercase tracking-wider">App breakdown</span>

            <div className="flex flex-col gap-2.5">
              {displayAppStats.length === 0 ? (
                <p className="text-[10px] text-muted-foreground text-center py-4">No application logs recorded.</p>
              ) : (
                displayAppStats.map((app, idx) => {
                  const colors = [
                    'bg-[oklch(0.65_0.15_250)]',
                    'bg-[oklch(0.68_0.14_170)]',
                    'bg-[oklch(0.66_0.15_300)]',
                    'bg-[oklch(0.60_0.10_120)]',
                    'bg-[oklch(0.70_0.08_80)]',
                    'bg-[oklch(0.62_0.12_25)]',
                    'bg-[oklch(0.64_0.10_145)]'
                  ]
                  const color = colors[idx % colors.length]
                  const sharePercent = Math.round((app.timeSpent / (totalScreenTimeMinutes || 1)) * 100)
                  
                  return (
                    <button
                      key={app.id}
                      onClick={handleAppDetailSelect(app.id)}
                      className="flex items-center justify-between py-2 px-2.5 rounded-xl active:bg-secondary/55 cursor-pointer transition-all duration-200"
                    >
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${color}`} />
                        <span className="text-xs font-bold text-foreground/80 truncate">{app.name}</span>
                        <div className="flex gap-0.5 ml-2.5 shrink-0">
                          {[0, 1, 2, 3].map((step) => {
                            const isFilled = sharePercent > (step * 25)
                            return (
                              <div 
                                key={step} 
                                className={`h-1.5 w-1.5 rounded-sm transition-colors duration-200 ${
                                  isFilled ? color : 'bg-secondary/70'
                                }`} 
                              />
                            )
                          })}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-muted-foreground font-extrabold">{Math.floor(app.timeSpent / 60)}h {app.timeSpent % 60}m</span>
                        <CaretRightIcon size={12} className="text-muted-foreground/55" />
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>
        </div>
      )
    }

    // 3. SCREEN TIME GOAL SETUP VIEW
    if (wellbeingSubPage === 'goal') {
      const displayTotalScreenTime = showEmptyState ? 0 : totalScreenTimeMinutes
      const isOver = displayTotalScreenTime > screenTimeGoal
      const displayRemaining = showEmptyState ? screenTimeGoal : Math.max(screenTimeGoal - displayTotalScreenTime, 0)
      const displayGoalProgress = showEmptyState ? 0 : Math.min(displayTotalScreenTime / screenTimeGoal, 1)

      const calendarDaysData = showEmptyState 
        ? calendarDays.map((d) => ({ ...d, used: 0, status: 'remaining' }))
        : calendarDays

      return (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <button 
              onClick={handleGoToHome}
              className="h-9 w-9 flex items-center justify-center rounded-lg bg-secondary border border-border/80 text-foreground cursor-pointer active:scale-95"
            >
              <ArrowLeftIcon size={16} weight="bold" />
            </button>
            <h1 className="font-heading text-sm font-bold text-foreground/90">Screen Time Goal</h1>
            <div className="h-9 w-9" />
          </div>

          <div className="rounded-2xl bg-card p-4.5 border border-border backdrop-blur-xl flex flex-col items-center gap-4 shadow-sm">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {activeGoalDetail.date} June usage detail
            </h4>

            <div className="flex flex-col items-center justify-center py-2 w-full">
              <span className="font-heading text-2xl font-black text-foreground/90">
                {Math.floor(displayRemaining / 60)}h {displayRemaining % 60}m
              </span>
              <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
                {isOver ? 'Over target' : 'Remaining'}
              </span>

              <div className="flex gap-1.5 mt-4 w-full max-w-[200px]">
                {[0, 1, 2, 3, 4, 5].map((step) => {
                  const isFilled = displayGoalProgress > (step / 6)
                  return (
                    <div 
                      key={step} 
                      className={`h-2 flex-1 rounded-sm transition-colors duration-200 ${
                        isFilled ? 'bg-primary' : 'bg-secondary/70'
                      }`}
                    />
                  )
                })}
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground border-t border-border/40 pt-3 w-full">
              <span>Goal: {Math.floor(screenTimeGoal / 60)}h</span>
              <button 
                onClick={handleOpenGoalPicker}
                className="text-primary active:underline cursor-pointer"
              >
                Change goal
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-card p-4.5 border border-border backdrop-blur-xl flex flex-col gap-3.5 shadow-sm">
            <span className="font-heading text-xs font-bold text-muted-foreground uppercase tracking-wider">June History</span>
            
            <div className="grid grid-cols-7 gap-2">
              {calendarDaysData.slice(-14).map((day) => {
                const isSelected = day.date === goalDetailDate
                return (
                  <button
                    key={day.date}
                    onClick={handleSelectGoalDate(day.date)}
                    className={`h-9 flex flex-col items-center justify-center rounded-lg border text-[10px] font-bold active:scale-95 transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : day.status === 'over' 
                          ? 'border-rose-300 bg-rose-500/5 text-rose-600'
                          : day.status === 'used'
                            ? 'border-emerald-300 bg-emerald-500/5 text-emerald-600'
                            : 'border-border bg-secondary/30 text-muted-foreground'
                    }`}
                  >
                    <span>{day.date}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )
    }

    // 4. WEEKLY REPORT DETAIL SCREEN
    if (wellbeingSubPage === 'report') {
      const displayWeeklyUsage = showEmptyState 
        ? weeklyUsage.map((d) => ({ ...d, minutes: 0 }))
        : weeklyUsage

      return (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <button 
              onClick={handleGoToHome}
              className="h-9 w-9 flex items-center justify-center rounded-lg bg-secondary border border-border/80 text-foreground cursor-pointer active:scale-95"
            >
              <ArrowLeftIcon size={16} weight="bold" />
            </button>
            <h1 className="font-heading text-sm font-bold text-foreground/90">Weekly Report</h1>
            <div className="h-9 w-9" />
          </div>

          <div className="rounded-2xl bg-card p-4.5 border border-border backdrop-blur-xl flex flex-col gap-4 shadow-sm">
            <span className="font-heading text-xs font-bold text-muted-foreground uppercase tracking-wider">June Screen Time</span>

            <div className="h-[120px] flex items-end justify-between px-2 pt-2 border-b border-border/40 pb-2">
              {displayWeeklyUsage.map((day) => {
                const heightPercent = Math.min((day.minutes / maxWeeklyMins) * 100, 100)
                const isSelected = selectedDate === day.day

                return (
                  <div key={day.day} className="flex flex-col items-center gap-1.5 flex-1 max-w-[28px]">
                    <div className="w-full relative h-[90px] flex items-end">
                      <div 
                        className={`w-full rounded-t-sm transition-all duration-300 ${
                          isSelected ? 'bg-primary' : 'bg-primary/30'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className={`text-[8.5px] font-bold ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>{day.day}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="rounded-2xl bg-card p-4.5 border border-border backdrop-blur-xl flex flex-col gap-3 shadow-sm">
            <span className="font-heading text-xs font-bold text-muted-foreground uppercase tracking-wider">Screen time balance</span>

            <p className="text-[10px] font-medium leading-relaxed text-muted-foreground">On average each day, you spent more time off your phone than active on it.</p>

            <div className="flex gap-0.5 w-full h-3 rounded-md overflow-hidden mt-1.5 shadow-inner">
              {[...Array(10)].map((_, i) => {
                const isFirstPart = showEmptyState ? false : i < 3
                return (
                  <div 
                    key={i} 
                    className={`h-full flex-1 ${
                      isFirstPart ? 'bg-primary' : 'bg-secondary-foreground/20'
                    }`} 
                  />
                )
              })}
            </div>

            <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground/90 px-1 mt-0.5">
              <span>Screen on: {showEmptyState ? '0h 0m' : '6 h 15 m'}</span>
              <span>Screen off: {showEmptyState ? '24h 0m' : '13 h 7 m'}</span>
            </div>
          </div>
        </div>
      )
    }

    // 5. TIMER SLIDER WHEEL PICKER VIEW
    if (wellbeingSubPage === 'set-timer') {
      const activeApp = appStats.find(a => a.id === selectedTimerApp)
      const appName = activeApp?.name || 'Social'

      return (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <button 
              onClick={handleGoToHome}
              className="h-9 w-9 flex items-center justify-center rounded-lg bg-secondary border border-border/80 text-foreground cursor-pointer active:scale-95"
            >
              <ArrowLeftIcon size={16} weight="bold" />
            </button>
            <h1 className="font-heading text-sm font-bold text-foreground/90">App Timer</h1>
            <div className="h-9 w-9" />
          </div>

          <div className="rounded-2xl bg-card p-4.5 border border-border backdrop-blur-xl flex flex-col gap-4 shadow-sm">
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Set Limit for</span>
              <h2 className="font-heading text-lg font-bold text-foreground/90 mt-0.5">{appName}</h2>
            </div>

            <div className="flex gap-4 items-center justify-center py-6 border-t border-b border-border/40 bg-secondary/35 rounded-xl relative overflow-hidden h-[120px]">
              <div className="flex-1 flex flex-col items-center overflow-y-auto h-24 scrollbar-none gap-2">
                {[0, 1, 2, 3, 4, 5, 6].map((h) => {
                  const isSelected = h === wheelHours
                  return (
                    <button
                      key={h}
                      onClick={() => setWheelHours(h)}
                      className={`text-sm font-extrabold transition-all cursor-pointer ${
                        isSelected ? 'text-primary scale-110 font-black' : 'text-muted-foreground/50'
                      }`}
                    >
                      {h} hours
                    </button>
                  )
                })}
              </div>

              <span className="text-xs font-bold text-muted-foreground/60">:</span>

              <div className="flex-1 flex flex-col items-center overflow-y-auto h-24 scrollbar-none gap-2">
                {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((m) => {
                  const isSelected = m === wheelMinutes
                  return (
                    <button
                      key={m}
                      onClick={() => setWheelMinutes(m)}
                      className={`text-sm font-extrabold transition-all cursor-pointer ${
                        isSelected ? 'text-primary scale-110 font-black' : 'text-muted-foreground/50'
                      }`}
                    >
                      {m} min
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full mt-2">
              <button 
                onClick={handleGoToHome}
                className="flex-1 h-10 px-6 rounded-xl bg-secondary border border-border text-xs font-bold text-foreground/80 cursor-pointer active:scale-95"
              >
                Cancel
              </button>
              
              <button 
                onClick={handleSaveTimer}
                className="flex-1 h-10 px-8 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm cursor-pointer active:scale-95"
              >
                Save timer
              </button>
            </div>
          </div>
        </div>
      )
    }

    return null
  }, [
    wellbeingSubPage,
    formattedTotalScreenTime,
    totalPickups,
    totalNotifications,
    donutSegments,
    weeklyUsage,
    selectedDate,
    setSelectedDate,
    dashboardViewMode,
    setDashboardViewMode,
    goalDetailDate,
    setGoalDetailDate,
    screenTimeGoal,
    setScreenTimeGoal,
    addToast,
    setActiveTab,
    updateAppLimit,
    setActiveAppDetailId,
    appStats,
    wheelHours,
    wheelMinutes,
    selectedTimerApp,
    showEmptyState,
    calendarDays,
    activeTimeSpent,
    todayRemaining,
    todayProgress,
    activeGoalDetail,
    heatmapData,
    maxWeeklyMins,
    handleGoToDashboard,
    handleGoToGoal,
    handleGoToReport,
    handleGoToHome,
    handleOpenSetTimer,
    handleOpenTimerForApp,
    handleOpenGoalPicker,
    handleCloseGoalPicker,
    handleSaveGoal,
    handleSaveTimer,
    handleCategoriesCardClick,
    handleTimersCardClick,
    handleToggleEmptyState,
    handleSelectDay,
    handleSelectGoalDate,
    handleAppDetailSelect,
    handleGoalHourSelect,
    handleResetGoalToDefault,
    circumference,
    semiCircumference
  ])

  return (
    <section className="flex flex-col gap-4 relative select-none">
      {subPageContent}

      <AnimatePresence>
        {showGoalModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[60] bg-slate-950/85 backdrop-blur-md rounded-[38px] flex items-end justify-center"
          >
            <motion.div 
              initial={{ y: 150 }}
              animate={{ y: 0 }}
              exit={{ y: 150 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-full bg-card rounded-t-2xl border-t border-border p-5 flex flex-col gap-4 shadow-xl text-foreground"
            >
              <h3 className="font-heading text-sm font-bold tracking-tight text-center">Set screen time goal</h3>

              <div className="flex gap-4 items-center justify-center py-4 border-t border-b border-border/40 my-1 bg-secondary/30 rounded-xl relative overflow-hidden h-[100px]">
                <div className="flex-1 flex flex-col items-center overflow-y-auto h-20 scrollbar-none gap-2">
                  {[2, 3, 4, 5, 6, 7, 8].map((h) => {
                    const isSelected = h === Math.floor(tempGoalMins / 60)
                    return (
                      <button
                        key={h}
                        onClick={handleGoalHourSelect(h)}
                        className={`text-sm font-extrabold transition-all cursor-pointer ${
                          isSelected ? 'text-primary scale-110 font-black' : 'text-muted-foreground/60'
                        }`}
                      >
                        {h} hours
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-3 divide-x divide-border/60 text-center border-t border-border/40 pt-4 mt-2">
                <button 
                  onClick={handleCloseGoalPicker}
                  className="py-2.5 text-xs font-bold text-muted-foreground active:text-foreground cursor-pointer"
                >
                  Cancel
                </button>
                
                <button 
                  onClick={handleResetGoalToDefault}
                  className="py-2.5 text-xs font-bold text-rose-500 active:text-rose-600 cursor-pointer"
                >
                  Delete
                </button>

                <button 
                  onClick={handleSaveGoal}
                  className="py-2.5 text-xs font-bold text-primary active:text-primary-dark cursor-pointer font-black"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default LayoutPersonal
