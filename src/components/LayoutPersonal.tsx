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

  const defaultTimerApp = 'insta'
  const defaultWheelHours = 2
  const defaultWheelMinutes = 15
  const defaultShowGoalModal = false
  const defaultTempGoalMins = 360
  const defaultEmptyState = false
  const defaultConsoleTab = 'apps'

  const [selectedTimerApp, setSelectedTimerApp] = useState<string>(defaultTimerApp)
  const [wheelHours, setWheelHours] = useState<number>(defaultWheelHours)
  const [wheelMinutes, setWheelMinutes] = useState<number>(defaultWheelMinutes)
  const [showGoalModal, setShowGoalModal] = useState<boolean>(defaultShowGoalModal)
  const [tempGoalMins, setTempGoalMins] = useState<number>(defaultTempGoalMins)
  const [showEmptyState, setShowEmptyState] = useState<boolean>(defaultEmptyState)
  const [consoleTab, setConsoleTab] = useState<'apps' | 'categories' | 'timers'>(defaultConsoleTab)

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
    addToast(`Goal updated to ${Math.floor(tempGoalMins / 60)}h`, 'success')
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

  const handleToggleEmptyState = useCallback(() => {
    setShowEmptyState((prev) => !prev)
  }, [])

  const handleConsoleTabSelect = useCallback((tab: 'apps' | 'categories' | 'timers') => () => {
    setConsoleTab(tab)
  }, [])

  const handleAppLimitSelect = useCallback((appId: string) => () => {
    handleOpenSetTimer(appId)
  }, [handleOpenSetTimer])

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

  // Selected date details for Goal History screen
  const activeGoalDetail = useMemo(() => {
    if (!goalDetailDate) {
      return { date: '26', used: totalScreenTimeMinutes, goal: screenTimeGoal, status: totalScreenTimeMinutes > screenTimeGoal ? 'over' : 'used' }
    }
    const match = calendarDays.find((d) => d.date === goalDetailDate && d.month === 'June')
    if (match) return match
    return { date: '26', used: totalScreenTimeMinutes, goal: screenTimeGoal, status: totalScreenTimeMinutes > screenTimeGoal ? 'over' : 'used' }
  }, [goalDetailDate, calendarDays, totalScreenTimeMinutes, screenTimeGoal])

  // Heatmap hourly grid array (7 days x 24 hours scaled)
  const heatmapData = useMemo(() => {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    
    return days.map((day, d) => {
      const hourlyVals = Array.from({ length: 24 }, (_, h) => {
        let density = 0
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
  }, [])

  // Weekly Report stacked bar details
  const maxWeeklyMins = Math.max(...weeklyUsage.map((d) => d.minutes), 360)

  // --- Sub-Page JSX Structure computation (Logic Isolation) ---
  const subPageContent = useMemo(() => {
    // 1. WELLBEING HOME PAGE VIEW
    if (wellbeingSubPage === 'home') {
      const summaryTime = showEmptyState ? '0m' : formattedTotalScreenTime
      const summaryPickups = showEmptyState ? 0 : totalPickups
      const summaryNotifications = showEmptyState ? 0 : totalNotifications

      const splinePoints = showEmptyState 
        ? [
            { x: 20, y: 80 },
            { x: 75, y: 80 },
            { x: 130, y: 80 },
            { x: 185, y: 80 },
            { x: 240, y: 80 }
          ]
        : [
            { x: 20, y: 70 },
            { x: 75, y: 40 },
            { x: 130, y: 75 },
            { x: 185, y: 15 },
            { x: 240, y: 65 }
          ]

      let splinePath = `M ${splinePoints[0].x} ${splinePoints[0].y}`
      for (let i = 0; i < splinePoints.length - 1; i++) {
        const p0 = splinePoints[i]
        const p1 = splinePoints[i + 1]
        const cpX1 = p0.x + (p1.x - p0.x) / 2
        const cpY1 = p0.y
        const cpX2 = p0.x + (p1.x - p0.x) / 2
        const cpY2 = p1.y
        splinePath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`
      }

      const activeAppsList = showEmptyState ? [] : [
        { id: 'insta', name: 'Instagram', timeSpent: 110, limitMinutes: 120, category: 'Social' },
        { id: 'tiktok', name: 'TikTok', timeSpent: 85, limitMinutes: 90, category: 'Social' },
        { id: 'yt', name: 'YouTube', timeSpent: 70, limitMinutes: 120, category: 'Entertainment' },
        { id: 'notion', name: 'Notion', timeSpent: 45, limitMinutes: 60, category: 'Productivity' }
      ]

      const activeCategoriesList = showEmptyState ? [] : [
        { name: 'Social', timeSpent: 195, icon: ChatCircleIcon, color: 'text-purple-600 dark:text-purple-400 bg-purple-500/10' },
        { name: 'Entertainment', timeSpent: 70, icon: VideoIcon, color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10' },
        { name: 'Productive', timeSpent: 45, icon: BookOpenIcon, color: 'text-blue-600 dark:text-blue-400 bg-blue-500/10' }
      ]

      const activeTimersList = showEmptyState ? [] : [
        { id: 'insta', name: 'Instagram', limitMinutes: 120, timeSpent: 110 },
        { id: 'social', name: 'Social Apps', limitMinutes: 195, timeSpent: 195 }
      ]

      const currentGoalLimit = 360
      const goalRemaining = showEmptyState ? 360 : Math.max(currentGoalLimit - totalScreenTimeMinutes, 0)
      const goalHoursRemaining = Math.floor(goalRemaining / 60)
      const goalMinutesRemaining = goalRemaining % 60
      const goalUsagePercent = showEmptyState ? 0 : Math.min(totalScreenTimeMinutes / currentGoalLimit, 1)

      const splineWidget = (
        <div className="rounded-2xl bg-card p-4.5 border border-border flex flex-col gap-2 shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Today's Usage Trend
            </span>

            <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {showEmptyState ? 'No Log' : 'Peak: 6 PM'}
            </span>
          </div>

          <div className="h-[90px] w-full flex items-end justify-center mt-1">
            <svg className="h-[90px] w-full" viewBox="0 0 260 90" preserveAspectRatio="none">
              <defs>
                <linearGradient id="parentSplineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                </linearGradient>
              </defs>

              <line x1="20" y1="10" x2="240" y2="10" stroke="currentColor" className="text-muted/10" strokeDasharray="3 3" />
              <line x1="20" y1="45" x2="240" y2="45" stroke="currentColor" className="text-muted/10" strokeDasharray="3 3" />
              <line x1="20" y1="80" x2="240" y2="80" stroke="currentColor" className="text-muted/10" strokeDasharray="3 3" />

              <path d={splinePath} fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" />
              
              <path d={`${splinePath} L 240 80 L 20 80 Z`} fill="url(#parentSplineGrad)" />

              {splinePoints.map((pt, idx) => (
                <circle
                  key={idx}
                  cx={pt.x}
                  cy={pt.y}
                  r="3.5"
                  fill="var(--background)"
                  stroke="var(--primary)"
                  strokeWidth="2"
                />
              ))}
            </svg>
          </div>

          <div className="flex justify-between text-[8px] font-bold text-muted-foreground mt-0.5 px-2">
            <span>9 AM</span>
            <span>12 PM</span>
            <span>3 PM</span>
            <span>6 PM</span>
            <span>9 PM</span>
          </div>
        </div>
      )

      const consoleTabsElement = (
        <div className="flex bg-secondary/60 rounded-xl p-1 w-full">
          <button
            onClick={handleConsoleTabSelect('apps')}
            className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold text-center cursor-pointer transition-colors active:scale-95 ${
              consoleTab === 'apps' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            <span>Apps</span>
          </button>

          <button
            onClick={handleConsoleTabSelect('categories')}
            className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold text-center cursor-pointer transition-colors active:scale-95 ${
              consoleTab === 'categories' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            <span>Categories</span>
          </button>

          <button
            onClick={handleConsoleTabSelect('timers')}
            className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold text-center cursor-pointer transition-colors active:scale-95 ${
              consoleTab === 'timers' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            <span>Timers</span>
          </button>
        </div>
      )

      const appsListContent = activeAppsList.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-6 text-center rounded-xl bg-secondary/20 border border-dashed border-border/80">
          <span className="text-xl mb-1">📱</span>

          <span className="text-xs font-bold text-foreground/80 block">No active app tracking</span>

          <p className="text-[9px] text-muted-foreground mt-0.5 max-w-[200px]">
            Start using your device or unlock locked apps to view tracking telemetry.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {activeAppsList.map((app) => {
            const limit = app.limitMinutes || 60
            const time = app.timeSpent
            const usePercentage = Math.min(time / limit, 1)
            const isLocked = time >= limit

            return (
              <div 
                key={app.id}
                onClick={handleAppLimitSelect(app.id)}
                className="p-3 rounded-xl bg-secondary/35 border border-border/30 flex flex-col justify-between cursor-pointer active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-foreground/80">{app.name}</span>
                    <span className="text-[9px] text-muted-foreground">({app.category})</span>
                  </div>

                  <div className="flex items-center">
                    <span className="text-[9px] font-bold text-foreground/75">
                      {time}m / {limit}m
                    </span>
                  </div>
                </div>

                <div className="flex gap-1 mt-2 w-full">
                  {[0, 1, 2, 3].map((step) => {
                    const isFilled = usePercentage > (step / 4)
                    return (
                      <div 
                        key={step} 
                        className={`h-1.5 flex-1 rounded-sm transition-colors duration-200 ${
                          isFilled 
                            ? (isLocked ? 'bg-rose-500' : 'bg-primary') 
                            : 'bg-secondary/70'
                        }`}
                      />
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )

      const categoriesListContent = activeCategoriesList.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-6 text-center rounded-xl bg-secondary/20 border border-dashed border-border/80">
          <span className="text-xl mb-1">📁</span>

          <span className="text-xs font-bold text-foreground/80 block">No categories logged</span>

          <p className="text-[9px] text-muted-foreground mt-0.5 max-w-[200px]">
            Usage data categorized by App Store ratings will compile here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {activeCategoriesList.map((cat) => {
            const Icon = cat.icon
            const hours = Math.floor(cat.timeSpent / 60)
            const minutes = cat.timeSpent % 60

            return (
              <div 
                key={cat.name}
                className="rounded-xl bg-secondary/35 p-3 border border-border/30 flex flex-col justify-between min-h-[85px] cursor-pointer active:scale-[0.98] transition-transform"
              >
                <div className={`h-7 w-7 rounded-lg ${cat.color} flex items-center justify-center`}>
                  <Icon size={14} weight="fill" />
                </div>

                <div>
                  <span className="text-[9px] font-bold text-muted-foreground block">{cat.name}</span>
                  <span className="text-[10px] font-extrabold text-foreground/90 mt-0.5 block">
                    {hours > 0 ? `${hours}h ` : ''}{minutes}m
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )

      const timersListContent = activeTimersList.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-6 text-center rounded-xl bg-secondary/20 border border-dashed border-border/80">
          <span className="text-xl mb-1">⏱️</span>

          <span className="text-xs font-bold text-foreground/80 block">No timers configured</span>

          <p className="text-[9px] text-muted-foreground mt-0.5 max-w-[200px]">
            Create daily lockout thresholds to self-manage time budgets.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {activeTimersList.map((timer) => (
            <div 
              key={timer.id}
              className="flex items-center justify-between p-3 rounded-xl bg-secondary/35 border border-border/30 cursor-pointer active:scale-[0.98] transition-transform"
            >
              <div>
                <span className="text-xs font-bold text-foreground/80 block">{timer.name}</span>
                <span className="text-[9px] text-muted-foreground">Threshold: {timer.limitMinutes}m</span>
              </div>

              <button 
                onClick={handleAppLimitSelect(timer.id)}
                className="h-7 px-3 rounded-lg bg-secondary border border-border text-[9px] font-bold text-foreground/80 cursor-pointer active:scale-95"
              >
                Adjust
              </button>
            </div>
          ))}
        </div>
      )

      const consoleWidget = (
        <div className="rounded-2xl bg-card p-4 border border-border flex flex-col gap-3.5 shadow-sm">
          {consoleTabsElement}

          {consoleTab === 'apps' && appsListContent}

          {consoleTab === 'categories' && categoriesListContent}

          {consoleTab === 'timers' && timersListContent}
        </div>
      )

      const goalWidget = (
        <div className="rounded-2xl bg-card p-4 border border-border flex flex-col gap-3.5 shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Daily screen time goal
            </span>

            <button 
              onClick={handleGoToGoal}
              className="text-[9px] font-bold text-primary active:underline cursor-pointer"
            >
              Target: 6h
            </button>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <span className="font-heading text-2xl font-black text-foreground/90 block">
                {goalHoursRemaining}h {goalMinutesRemaining}m
              </span>

              <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5 block">
                Time Remaining
              </span>
            </div>

            <div className="flex gap-1 w-24 shrink-0 justify-end">
              {[0, 1, 2, 3].map((step) => {
                const isFilled = goalUsagePercent > (step / 4)
                return (
                  <div 
                    key={step} 
                    className={`h-4.5 w-1.5 rounded-sm transition-colors duration-200 ${
                      isFilled ? 'bg-primary' : 'bg-secondary/80'
                    }`}
                  />
                )
              })}
            </div>
          </div>
        </div>
      )

      const parentalShortcutWidget = (
        <div 
          onClick={() => setActiveTab('parental')}
          className="rounded-2xl bg-card p-4 border border-border flex flex-col gap-1 shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
        >
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
            Content restrictions
          </span>

          <p className="text-[10.5px] font-semibold text-foreground/80 leading-relaxed">
            Manage school schedules, approved whitelist links, and toggle adblocks remotely.
          </p>
        </div>
      )

      return (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                Aura Portal
              </span>

              <h1 className="font-heading text-xl font-bold tracking-tight text-foreground/90 mt-0.5">
                Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-2">
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

          <div className="grid grid-cols-3 gap-2.5">
            <div className="rounded-xl bg-card p-3 border border-border flex flex-col justify-between shadow-sm min-h-[75px]">
              <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider block">
                Screen Time
              </span>

              <div>
                <span className="font-heading text-base font-extrabold text-foreground/90 block">
                  {summaryTime}
                </span>

                <span className="text-[7.5px] font-semibold text-muted-foreground">
                  {showEmptyState ? 'No activity' : 'Limit: 6h'}
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-card p-3 border border-border flex flex-col justify-between shadow-sm min-h-[75px]">
              <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider block">
                Device Pickups
              </span>

              <div>
                <span className="font-heading text-base font-extrabold text-foreground/90 block">
                  {summaryPickups}
                </span>

                <span className="text-[7.5px] font-semibold text-muted-foreground">
                  {showEmptyState ? 'No pickups' : '32 avg/day'}
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-card p-3 border border-border flex flex-col justify-between shadow-sm min-h-[75px]">
              <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider block">
                Alerts Recd
              </span>

              <div>
                <span className="font-heading text-base font-extrabold text-foreground/90 block">
                  {summaryNotifications}
                </span>

                <span className="text-[7.5px] font-semibold text-muted-foreground">
                  {showEmptyState ? 'No alerts' : '85 received'}
                </span>
              </div>
            </div>
          </div>

          {splineWidget}

          {consoleWidget}

          {goalWidget}

          {parentalShortcutWidget}
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
                        <div className="flex gap-0.5 ml-2 shrink-0">
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

            <div className="flex gap-1.5 w-full mt-1">
              <div className="flex-1 bg-primary/10 border border-primary/20 rounded-xl p-2.5 flex items-center justify-between">
                <span className="text-[10px] font-bold text-primary">Screen On</span>
                <span className="text-xs font-extrabold text-primary">{showEmptyState ? '0%' : '33%'}</span>
              </div>
              <div className="flex-1 bg-secondary/80 border border-border/80 rounded-xl p-2.5 flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted-foreground">Screen Off</span>
                <span className="text-xs font-extrabold text-foreground">{showEmptyState ? '100%' : '67%'}</span>
              </div>
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
    weeklyUsage,
    selectedDate,
    setSelectedDate,
    dashboardViewMode,
    setDashboardViewMode,
    wheelMinutes,
    selectedTimerApp,
    showEmptyState,
    consoleTab,
    calendarDays,
    activeGoalDetail,
    heatmapData,
    maxWeeklyMins,
    handleGoToDashboard,
    handleGoToGoal,
    handleGoToReport,
    handleGoToHome,
    handleOpenSetTimer,
    handleOpenGoalPicker,
    handleCloseGoalPicker,
    handleSaveGoal,
    handleSaveTimer,
    handleToggleEmptyState,
    handleConsoleTabSelect,
    handleAppLimitSelect,
    handleSelectDay,
    handleSelectGoalDate,
    handleAppDetailSelect,
    handleGoalHourSelect,
    handleResetGoalToDefault
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
