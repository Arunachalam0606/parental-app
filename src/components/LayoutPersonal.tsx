import { useState, useMemo, useCallback } from 'react'

import { motion, AnimatePresence } from 'framer-motion'

import { useWellbeingLogic } from '@/hooks/useWellbeingLogic'

import { 
  ClockIcon, 
  CaretRightIcon,
  VideoIcon,
  ChatCircleIcon,
  BookOpenIcon,
  HourglassIcon,
  ArrowLeftIcon,
  ChartBarIcon,
  DotsThreeVerticalIcon
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

  // Navigate handlers (Logic Isolation: no inline arrow functions in return)
  const handleGoToDashboard = useCallback(() => setWellbeingSubPage('dashboard'), [setWellbeingSubPage])
  const handleGoToGoal = useCallback(() => setWellbeingSubPage('goal'), [setWellbeingSubPage])
  const handleGoToReport = useCallback(() => setWellbeingSubPage('report'), [setWellbeingSubPage])
  const handleGoToHome = useCallback(() => setWellbeingSubPage('home'), [setWellbeingSubPage])
  
  const handleOpenSetTimer = useCallback((appId: string) => {
    setSelectedTimerApp(appId)
    const app = appStats.find(a => a.id === appId)
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
    addToast(`Screen time goal updated to ${Math.floor(tempGoalMins / 60)}h`, 'success')
  }, [tempGoalMins, setScreenTimeGoal, addToast])

  const handleSaveTimer = useCallback(() => {
    const totalMins = wheelHours * 60 + wheelMinutes
    const targetApp = appStats.find(a => a.id === selectedTimerApp)
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

  // Ring parameters
  const ringCenter = 45
  const donutRadius = 30
  const circumference = 2 * Math.PI * donutRadius

  // Compute donut segment values
  const donutSegments = useMemo(() => {
    const sortedApps = [...appStats].sort((a, b) => b.timeSpent - a.timeSpent).slice(0, 3)
    
    return sortedApps.map((app, index) => {
      const share = app.timeSpent / (totalScreenTimeMinutes || 1)
      const strokeDasharray = `${circumference * share} ${circumference}`
      
      const previousShareSum = sortedApps
        .slice(0, index)
        .reduce((sum, prevApp) => sum + (prevApp.timeSpent / (totalScreenTimeMinutes || 1)), 0)
      
      const rotation = (previousShareSum * 360) - 90

      const colors = [
        'stroke-[oklch(0.65_0.15_250)]', 
        'stroke-[oklch(0.68_0.14_170)]', 
        'stroke-[oklch(0.66_0.15_300)]'  
      ]

      return {
        id: app.id,
        name: app.name,
        time: app.timeSpent,
        dashArray: strokeDasharray,
        rotation,
        colorClass: colors[index % colors.length]
      }
    })
  }, [appStats, totalScreenTimeMinutes, circumference])

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
  const todayRemaining = Math.max(360 - totalScreenTimeMinutes, 0)
  const todayProgress = Math.min(totalScreenTimeMinutes / 360, 1)

  // Selected date details for Goal History screen
  const activeGoalDetail = useMemo(() => {
    if (!goalDetailDate) {
      return { date: '26', used: totalScreenTimeMinutes, goal: screenTimeGoal, status: totalScreenTimeMinutes > screenTimeGoal ? 'over' : 'used' }
    }
    const match = calendarDays.find(d => d.date === goalDetailDate && d.month === 'June')
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

  // Day click logic
  const handleSelectDay = useCallback((day: string) => {
    setSelectedDate(day)
    addToast(`Viewing data for June ${day}`, 'info')
  }, [setSelectedDate, addToast])

  // Goal Date click logic
  const handleSelectGoalDate = useCallback((date: string) => {
    setGoalDetailDate(date)
  }, [setGoalDetailDate])

  // --- Sub-Page JSX Structure computation (Logic Isolation) ---
  const subPageContent = useMemo(() => {
    // 1. WELLBEING HOME PAGE VIEW
    if (wellbeingSubPage === 'home') {
      return (
        <div className="flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-center justify-between px-1">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Samsung App Care</span>

              <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground/90 mt-0.5">Digital Wellbeing</h1>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={handleGoToReport}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary/80 text-foreground border border-border/40 hover:bg-secondary cursor-pointer transition-colors"
                title="Weekly report"
              >
                <ChartBarIcon size={20} weight="regular" />
              </button>

              <button className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary/80 text-foreground border border-border/40 hover:bg-secondary cursor-pointer transition-colors">
                <DotsThreeVerticalIcon size={20} weight="bold" />
              </button>
            </div>
          </div>

          {/* Habit Banner Card */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-950 dark:bg-slate-900/60 p-6 border border-white/5 shadow-md flex flex-col justify-between min-h-[120px]">
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-blue-500/20 blur-[50px]" />

            <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-purple-500/10 blur-[40px]" />

            <div className="relative z-10 flex flex-col gap-1.5 max-w-[80%]">
              <h2 className="font-heading text-lg font-bold tracking-tight text-sky-400 dark:text-sky-300">Build healthy digital habits</h2>

              <p className="text-[11px] font-medium leading-relaxed text-slate-300/80">You'll get feedback and help to keep you on track.</p>
            </div>
          </div>

          {/* Screen time today Card */}
          <div 
            onClick={handleGoToDashboard}
            className="flex flex-col gap-4 rounded-3xl bg-card/60 p-5 border border-border backdrop-blur-xl shadow-[0_8px_32px_-4px_rgba(0,0,0,0.02)] hover:bg-card/85 cursor-pointer transition-all duration-200"
          >
            <div>
              <span className="text-[9.5px] font-bold text-muted-foreground uppercase tracking-wider">Screen time today</span>

              <div className="flex items-baseline justify-between mt-1">
                <h3 className="font-heading text-3xl font-black text-foreground/90">{formattedTotalScreenTime}</h3>

                <CaretRightIcon size={14} className="text-muted-foreground/60" />
              </div>
            </div>

            <div className="flex items-center justify-between gap-2.5">
              {/* App list on left */}
              <div className="flex flex-col gap-2">
                {donutSegments.map((seg, idx) => (
                  <div key={seg.id} className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${
                      idx === 0 ? 'bg-[oklch(0.65_0.15_250)]' : idx === 1 ? 'bg-[oklch(0.68_0.14_170)]' : 'bg-[oklch(0.66_0.15_300)]'
                    }`} />
                    
                    <span className="text-xs font-bold text-foreground/80">{seg.name}</span>

                    <span className="text-[10px] text-muted-foreground font-medium">{Math.floor(seg.time / 60)}h {seg.time % 60}m</span>
                  </div>
                ))}
              </div>

              {/* Seg Donut Chart */}
              <div className="relative h-[90px] w-[90px]">
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
            className="flex flex-col gap-2.5 cursor-pointer hover:bg-card/85 hover:scale-[1.015] hover:shadow-sm p-4 rounded-3xl bg-card/60 border border-border backdrop-blur-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between pr-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider pl-1">Most used app categories</span>
              <CaretRightIcon size={12} className="text-muted-foreground/60" />
            </div>

            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
              <div className="flex gap-3 px-1">
                <div className="h-[105px] w-[110px] shrink-0 rounded-2xl bg-secondary/40 p-4 border border-border/80 flex flex-col justify-between">
                  <div className="h-8 w-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <ChatCircleIcon size={18} weight="fill" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground">Social</span>
                    <h4 className="text-xs font-extrabold text-foreground/90 mt-0.5">1 h 28 m</h4>
                  </div>
                </div>

                <div className="h-[105px] w-[110px] shrink-0 rounded-2xl bg-secondary/40 p-4 border border-border/80 flex flex-col justify-between">
                  <div className="h-8 w-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <VideoIcon size={18} weight="fill" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground">Shopping</span>
                    <h4 className="text-xs font-extrabold text-foreground/90 mt-0.5">36 m</h4>
                  </div>
                </div>

                <div className="h-[105px] w-[110px] shrink-0 rounded-2xl bg-secondary/40 p-4 border border-border/80 flex flex-col justify-between">
                  <div className="h-8 w-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <BookOpenIcon size={18} weight="fill" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground">Productive</span>
                    <h4 className="text-xs font-extrabold text-foreground/90 mt-0.5">9 m</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* App timers Section */}
          <div 
            onClick={handleTimersCardClick}
            className="rounded-3xl bg-card/60 p-5 border border-border backdrop-blur-xl flex flex-col gap-4 shadow-sm cursor-pointer hover:bg-card/85 hover:scale-[1.015] hover:shadow-sm transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-sm font-semibold tracking-tight text-foreground/90">App timers</h3>
                <p className="text-[10.5px] font-medium leading-relaxed text-muted-foreground mt-1">If you're using certain apps more than you'd like, set a timer.</p>
              </div>
              <CaretRightIcon size={12} className="text-muted-foreground/60 shrink-0" />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/30 border border-border/40 hover:bg-secondary/50">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold shadow-sm">
                    I
                  </div>
                  <div>
                    <span className="text-xs font-bold text-foreground/80">Instagram</span>
                    <p className="text-[10px] font-medium text-muted-foreground mt-0.5">Used: 1h 50m</p>
                  </div>
                </div>

                <button 
                  onClick={() => handleOpenSetTimer('insta')}
                  className="h-8 px-3.5 rounded-xl bg-secondary hover:bg-muted border border-border text-[10px] font-bold text-foreground/80 cursor-pointer"
                >
                  Set timer
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/30 border border-border/40 hover:bg-secondary/50">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-500 text-white flex items-center justify-center font-bold shadow-sm">
                    S
                  </div>
                  <div>
                    <span className="text-xs font-bold text-foreground/80">Social Apps</span>
                    <p className="text-[10px] font-medium text-muted-foreground mt-0.5">Used: 3h 15m</p>
                  </div>
                </div>

                <button 
                  onClick={() => handleOpenSetTimer('social')}
                  className="h-8 px-3.5 rounded-xl bg-secondary hover:bg-muted border border-border text-[10px] font-bold text-foreground/80 cursor-pointer"
                >
                  Set timer
                </button>
              </div>
            </div>
          </div>

          {/* Screen time goal Card */}
          <div 
            onClick={handleGoToGoal}
            className="rounded-3xl bg-card/60 p-5 border border-border backdrop-blur-xl flex flex-col gap-4 shadow-sm cursor-pointer hover:bg-card/85 hover:scale-[1.015] hover:shadow-sm transition-all duration-300"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-heading text-sm font-semibold tracking-tight text-foreground/90">Screen time goal</h3>
              <CaretRightIcon size={12} className="text-muted-foreground/60" />
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="relative h-[90px] w-[180px] overflow-hidden flex items-end justify-center">
                <svg className="absolute top-0 left-0 h-[100px] w-[180px]">
                  <defs>
                    <linearGradient id="usageRingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="oklch(0.68 0.14 170)" />
                      <stop offset="100%" stopColor="oklch(0.56 0.12 250)" />
                    </linearGradient>
                  </defs>

                  <path
                    d="M 20 80 A 70 70 0 0 1 160 80"
                    fill="none"
                    stroke="currentColor"
                    className="text-muted/10 dark:text-muted/5"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />

                  <path
                    d="M 20 80 A 70 70 0 0 1 160 80"
                    fill="none"
                    stroke="url(#usageRingGrad)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={semiCircumference}
                    strokeDashoffset={semiCircumference * (1 - todayProgress)}
                  />
                </svg>
                
                <div className="flex flex-col items-center text-center pb-2">
                  <span className="font-heading text-2xl font-black text-foreground/95">
                    {Math.floor(todayRemaining / 60)}h {todayRemaining % 60}m
                  </span>
                  
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">Remaining</span>
                </div>
              </div>

              <button 
                onClick={handleGoToGoal}
                className="h-9.5 px-4 rounded-xl bg-secondary hover:bg-muted border border-border text-xs font-bold text-foreground/80 cursor-pointer transition-colors"
              >
                Goal 6 h
              </button>
            </div>
          </div>

          {/* Parental controls Shortcut Card */}
          <div 
            onClick={() => setActiveTab('parental')}
            className="rounded-3xl bg-card/60 p-5 border border-border backdrop-blur-xl shadow-sm cursor-pointer hover:bg-card/85 hover:scale-[1.015] hover:shadow-sm transition-all duration-300 flex flex-col gap-2"
          >
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Parental controls</span>

            <p className="text-[11px] font-semibold text-foreground/80 leading-relaxed">Add content restrictions and set other limits to help your child balance screen time.</p>
          </div>

        </div>
      )
    }

    // 2. DASHBOARD DETAILED BAR CHARTS VIEW
    if (wellbeingSubPage === 'dashboard') {
      const toggleViewMode = () => setDashboardViewMode(dashboardViewMode === 'apps' ? 'categories' : 'apps')
      
      return (
        <div className="flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-center justify-between px-1">
            <button 
              onClick={handleGoToHome}
              className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary/80 text-foreground border border-border/40 hover:bg-secondary cursor-pointer transition-colors"
            >
              <ArrowLeftIcon size={16} weight="bold" />
            </button>

            <h2 className="font-heading text-lg font-bold tracking-tight text-foreground/95">Dashboard</h2>

            <button 
              onClick={toggleViewMode}
              className="text-xs font-extrabold text-primary hover:underline cursor-pointer"
            >
              {dashboardViewMode === 'apps' ? 'Show categories' : 'Show apps'}
            </button>
          </div>

          {/* Date calendar row */}
          <div className="flex justify-between items-center px-2 py-1.5 rounded-2xl bg-secondary/40 border border-border/40 select-none">
            {['21', '22', '23', '24', '25', '26', '27'].map((day) => {
              const isSelected = selectedDate === day
              return (
                <button
                  key={day}
                  onClick={() => handleSelectDay(day)}
                  className={`h-9 w-9 rounded-full text-xs font-extrabold flex items-center justify-center transition-all cursor-pointer ${
                    isSelected ? 'bg-primary text-primary-foreground shadow-sm scale-105' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {day}
                </button>
              )
            })}
          </div>

          {/* Card 1: Stacked screen time bar chart */}
          <div className="rounded-3xl bg-card/60 p-5 border border-border backdrop-blur-xl flex flex-col gap-4 shadow-sm">
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total screen time</span>

              <h3 className="font-heading text-2xl font-black text-foreground/90 mt-1">{formattedTotalScreenTime}</h3>
            </div>

            {/* Bars container */}
            <div className="h-32 w-full flex items-end justify-between px-2 pt-4">
              {weeklyUsage.map((val) => {
                const dayHeight = (val.minutes / maxWeeklyMins) * 100
                const isSelected = selectedDate === '26' && val.day === 'Fri' 
                
                return (
                  <div key={val.day} className="flex flex-col items-center gap-1.5 flex-1">
                    <div className="w-4.5 bg-secondary dark:bg-slate-800 rounded-full h-24 flex items-end overflow-hidden">
                      <div 
                        className={`w-full rounded-full transition-all duration-300 ${
                          isSelected ? 'bg-[oklch(0.56_0.12_250)]' : 'bg-primary/45'
                        }`} 
                        style={{ height: `${dayHeight}%` }}
                      />
                    </div>

                    <span className={`text-[10px] font-bold ${
                      isSelected ? 'text-primary font-black bg-primary/10 px-1.5 py-0.5 rounded-full' : 'text-muted-foreground'
                    }`}>
                      {val.day.charAt(0)}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Interactive app list */}
            <div className="border-t border-border/40 pt-3.5 flex flex-col gap-2.5">
              {appStats.map((app, idx) => {
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
                    onClick={() => setActiveAppDetailId(app.id)}
                    className="flex items-center justify-between py-1.5 px-2 rounded-xl hover:bg-secondary/55 cursor-pointer transition-all duration-200"
                  >
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${color}`} />
                      <span className="text-xs font-bold text-foreground/80 truncate">{app.name}</span>
                      <div className="flex-1 max-w-[80px] h-1.5 bg-muted/40 rounded-full overflow-hidden ml-2">
                        <div className={`h-full rounded-full ${color}`} style={{ width: `${sharePercent}%` }} />
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-muted-foreground font-extrabold">{Math.floor(app.timeSpent / 60)}h {app.timeSpent % 60}m</span>
                      <CaretRightIcon size={12} className="text-muted-foreground/55" />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Card 2: Notifications */}
          <div className="rounded-3xl bg-card/60 p-5 border border-border backdrop-blur-xl flex flex-col gap-4 shadow-sm">
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Notifications today</span>

              <h3 className="font-heading text-2xl font-black text-foreground/90 mt-1">{totalNotifications}</h3>
            </div>

            <div className="h-28 w-full flex items-end justify-between px-2">
              {weeklyUsage.map((val) => (
                <div key={val.day} className="flex flex-col items-center gap-1.5 flex-1">
                  <div className="w-3.5 bg-secondary dark:bg-slate-800 rounded-full h-20 flex items-end overflow-hidden">
                    <div 
                      className="w-full bg-[oklch(0.68_0.14_170)] rounded-full" 
                      style={{ height: `${(val.minutes / maxWeeklyMins) * 80}%` }}
                    />
                  </div>
                  <span className="text-[9px] font-bold text-muted-foreground">{val.day.charAt(0)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Unlocks */}
          <div className="rounded-3xl bg-card/60 p-5 border border-border backdrop-blur-xl flex flex-col gap-4 shadow-sm mb-4">
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Unlocks today</span>

              <h3 className="font-heading text-2xl font-black text-foreground/90 mt-1">{totalPickups}</h3>
            </div>

            <div className="h-28 w-full flex items-end justify-between px-2">
              {weeklyUsage.map((val) => (
                <div key={val.day} className="flex flex-col items-center gap-1.5 flex-1">
                  <div className="w-3.5 bg-secondary dark:bg-slate-800 rounded-full h-20 flex items-end overflow-hidden">
                    <div 
                      className="w-full bg-[oklch(0.66_0.15_300)] rounded-full" 
                      style={{ height: `${(val.minutes / maxWeeklyMins) * 90}%` }}
                    />
                  </div>
                  <span className="text-[9px] font-bold text-muted-foreground">{val.day.charAt(0)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }

    // 3. SCREEN TIME GOAL DATE CELL HISTORY VIEW
    if (wellbeingSubPage === 'goal') {
      const isOver = activeGoalDetail.status === 'over'
      
      return (
        <div className="flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-center justify-between px-1">
            <button 
              onClick={handleGoToHome}
              className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary/80 text-foreground border border-border/40 hover:bg-secondary cursor-pointer transition-colors"
            >
              <ArrowLeftIcon size={16} weight="bold" />
            </button>

            <h2 className="font-heading text-lg font-bold tracking-tight text-foreground/95">Screen time goal</h2>

            <div className="h-10 w-10 shrink-0" />
          </div>

          {/* Calendar Grid card */}
          <div className="rounded-3xl bg-card/60 p-5 border border-border backdrop-blur-xl flex flex-col gap-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-foreground/90">30 May – 26 June</span>
            </div>

            <div className="grid grid-cols-7 gap-2.5 text-center text-[10px] font-black text-muted-foreground/60 uppercase">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
            </div>

            <div className="grid grid-cols-7 gap-2.5">
              {calendarDays.map((d) => {
                const isSelected = goalDetailDate === d.date
                const isToday = d.date === '26' && d.month === 'June'
                
                return (
                  <button
                    key={`${d.month}_${d.date}`}
                    onClick={() => handleSelectGoalDate(d.date)}
                    className={`relative h-9.5 w-9.5 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                      isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
                    }`}
                  >
                    {d.status === 'used' && (
                      <span className="absolute inset-0 rounded-full border-2 border-primary/90" />
                    )}
                    {d.status === 'over' && (
                      <span className="absolute inset-0 rounded-full border-2 border-rose-500/90" />
                    )}
                    {d.status === 'remaining' && (
                      <span className="absolute inset-0 rounded-full border-2 border-dashed border-muted/20" />
                    )}

                    <span className={`text-[11px] font-extrabold relative z-10 ${
                      isToday ? 'text-primary font-black bg-primary/10 px-1.5 py-0.5 rounded-full' : 'text-foreground/90'
                    }`}>
                      {d.date}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground/80 mt-2 px-1">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span>Used</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
                <span>Remaining</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                <span>Over goal</span>
              </div>
            </div>
          </div>

          {/* Semicircular progress display */}
          <div className="rounded-3xl bg-card/60 p-6 border border-border backdrop-blur-xl flex flex-col items-center gap-4 shadow-sm">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {activeGoalDetail.date} June usage detail
            </h4>

            <div className="relative h-[90px] w-[180px] overflow-hidden flex items-end justify-center">
              <svg className="absolute top-0 left-0 h-[100px] w-[180px]">
                <path
                  d="M 20 80 A 70 70 0 0 1 160 80"
                  fill="none"
                  stroke="currentColor"
                  className="text-muted/10 dark:text-muted/5"
                  strokeWidth="10.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 20 80 A 70 70 0 0 1 160 80"
                  fill="none"
                  stroke={isOver ? 'oklch(0.58 0.10 25)' : 'oklch(0.56 0.12 250)'}
                  strokeWidth="10.5"
                  strokeLinecap="round"
                  strokeDasharray={semiCircumference}
                  strokeDashoffset={semiCircumference * (1 - Math.min(activeGoalDetail.used / activeGoalDetail.goal, 1))}
                />
              </svg>

              <div className="flex flex-col items-center text-center pb-2">
                {isOver ? (
                  <>
                    <span className="font-heading text-2xl font-black text-rose-500">
                      {Math.floor((activeGoalDetail.used - activeGoalDetail.goal) / 60)}h {(activeGoalDetail.used - activeGoalDetail.goal) % 60}m
                    </span>
                    <span className="text-[9px] font-bold text-rose-400 uppercase tracking-wider mt-0.5">Over goal</span>
                  </>
                ) : (
                  <>
                    <span className="font-heading text-2xl font-black text-foreground/95">
                      {Math.floor((activeGoalDetail.goal - activeGoalDetail.used) / 60)}h {(activeGoalDetail.goal - activeGoalDetail.used) % 60}m
                    </span>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">Remaining</span>
                  </>
                )}
              </div>
            </div>

            <button 
              onClick={handleOpenGoalPicker}
              className="h-10 px-5 rounded-xl bg-secondary hover:bg-muted border border-border text-xs font-bold text-foreground/80 cursor-pointer"
            >
              Goal {Math.floor(screenTimeGoal / 60)} h
            </button>
          </div>
        </div>
      )
    }

    // 4. WEEKLY REPORT SPLINE & HEATMAP VIEW
    if (wellbeingSubPage === 'report') {
      return (
        <div className="flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-center justify-between px-1">
            <button 
              onClick={handleGoToHome}
              className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary/80 text-foreground border border-border/40 hover:bg-secondary cursor-pointer transition-colors"
            >
              <ArrowLeftIcon size={16} weight="bold" />
            </button>

            <h2 className="font-heading text-lg font-bold tracking-tight text-foreground/95">Weekly report</h2>

            <button className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary/80 text-foreground border border-border/40 hover:bg-secondary cursor-pointer transition-colors">
              <DotsThreeVerticalIcon size={20} weight="bold" />
            </button>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-muted-foreground">14 June - 20 June (Week 25)</span>
            <div className="flex gap-1.5 select-none">
              {['W23', 'W24', 'W25'].map((w) => (
                <span 
                  key={w} 
                  className={`text-[9.5px] font-black px-2 py-0.5 rounded-md ${
                    w === 'W25' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  {w}
                </span>
              ))}
            </div>
          </div>

          {/* Card 1: Hatched weekly bars */}
          <div className="rounded-3xl bg-card/60 p-5 border border-border backdrop-blur-xl flex flex-col gap-4 shadow-sm">
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Screen time by week</span>

              <h3 className="font-heading text-2xl font-black text-foreground/95 mt-1">6 h 16 m</h3>

              <p className="text-[10px] font-semibold text-muted-foreground mt-0.5">Daily average screen time</p>
            </div>

            <div className="h-28 w-full flex items-end justify-between px-2 pt-2 select-none relative">
              <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-muted-foreground/30 z-0 flex justify-end">
                <span className="text-[8px] bg-card px-1 font-bold text-muted-foreground -mt-2">Avg. 5h</span>
              </div>
              
              {weeklyUsage.map((val) => {
                const heightPercent = (val.minutes / maxWeeklyMins) * 100
                const isOver = val.minutes > val.goalMinutes
                
                return (
                  <div key={val.day} className="flex flex-col items-center gap-1.5 flex-1 relative z-10">
                    <div className="w-3.5 bg-secondary dark:bg-slate-800 rounded-full h-20 flex items-end overflow-hidden relative shadow-inner">
                      <div 
                        className={`w-full rounded-full transition-all duration-300 ${
                          isOver ? 'bg-rose-500' : 'bg-emerald-500'
                        }`} 
                        style={{ 
                          height: `${heightPercent}%`,
                          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.15) 3px, rgba(255,255,255,0.15) 6px)'
                        }}
                      />
                    </div>

                    <span className="text-[9px] font-extrabold text-muted-foreground">{val.day.charAt(0)}</span>
                  </div>
                )
              })}
            </div>

            <div className="border-t border-border/40 pt-3 flex justify-between items-center text-[10px] font-bold">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="text-muted-foreground">Goal achieved:</span>
                <span className="text-foreground font-extrabold">4 days</span>
              </div>
            </div>
          </div>

          {/* Card 2: Screen time balance awake ratio */}
          <div className="rounded-3xl bg-card/60 p-5 border border-border backdrop-blur-xl flex flex-col gap-3 shadow-sm">
            <h3 className="font-heading text-xs font-bold text-muted-foreground uppercase tracking-wider">Screen time balance</h3>

            <p className="text-[10px] font-medium leading-relaxed text-muted-foreground">On average each day while you were awake, you spent 6 h 52 m more not using your phone than using it.</p>

            <div className="h-4.5 w-full bg-secondary dark:bg-slate-800 rounded-full overflow-hidden flex shadow-inner border border-border/10">
              <div className="bg-primary h-full" style={{ width: '33%' }} />
              <div className="bg-muted-foreground/30 h-full" style={{ width: '67%' }} />
            </div>

            <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground/90 px-1 mt-0.5">
              <span>Screen on: 6 h 15 m</span>
              <span>Screen off: 13 h 7 m</span>
            </div>
          </div>

          {/* Card 3: Top usage category changed */}
          <div className="rounded-3xl bg-card/60 p-5 border border-border backdrop-blur-xl flex flex-col gap-4 shadow-sm">
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Top usage category changed</span>

              <h3 className="font-heading text-2xl font-black text-foreground/95 mt-1">Social</h3>

              <p className="text-[10.5px] font-bold text-muted-foreground mt-0.5">33 h 47 m</p>

              <p className="text-[9.5px] font-medium text-muted-foreground/60 mt-1">23 h 13 m used on average for previous 3 weeks</p>
            </div>

            <div className="flex flex-col gap-2">
              {[
                { id: 'insta', name: 'Instagram', val: '16 h 38 m' },
                { id: 'wa', name: 'WhatsApp', val: '11 h 47 m' },
                { id: 'rd', name: 'Reddit', val: '1 h 41 m' }
              ].map((app) => (
                <div key={app.id} className="flex justify-between items-center text-xs font-semibold py-1">
                  <span className="text-foreground/90">{app.name}</span>
                  <span className="text-muted-foreground">{app.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Peak usage heatmap */}
          <div className="rounded-3xl bg-card/60 p-5 border border-border backdrop-blur-xl flex flex-col gap-4 shadow-sm mb-4">
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Peak usage times</span>

              <h3 className="font-heading text-sm font-semibold tracking-tight text-foreground/90 mt-1">Daily screen time pattern</h3>
            </div>

            <div className="flex flex-col gap-2.5 select-none pt-2">
              {heatmapData.map((row) => (
                <div key={row.day} className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold text-muted-foreground/75 w-3 text-center">{row.day}</span>
                  
                  <div className="flex-1 flex gap-1 justify-between">
                    {row.values.map((v, hIdx) => {
                      const colors = [
                        'bg-secondary/40 dark:bg-slate-800/40',
                        'bg-primary/20',
                        'bg-primary/50',
                        'bg-primary/95'
                      ]
                      return (
                        <div 
                          key={hIdx}
                          className={`h-2.5 flex-1 rounded-sm ${colors[v]}`}
                          title={`Hour ${hIdx}: level ${v}`}
                        />
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-[8.5px] font-black text-muted-foreground/50 px-5 mt-1">
              <span>0</span><span>6</span><span>12</span><span>18</span><span>24(h)</span>
            </div>
          </div>
        </div>
      )
    }

    // 5. SET APP TIMER VIEW
    if (wellbeingSubPage === 'set-timer') {
      const activeTimerApp = appStats.find(a => a.id === selectedTimerApp) || appStats[0]
      const handleSelectApp = (id: string) => setSelectedTimerApp(id)
      
      return (
        <div className="flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-center justify-between px-1">
            <h2 className="font-heading text-lg font-bold tracking-tight text-foreground/95">Set timer</h2>

            <div className="h-10 w-10 shrink-0" />
          </div>

          {/* Form details */}
          <div className="rounded-3xl bg-card/60 p-5 border border-border backdrop-blur-xl flex flex-col gap-4 shadow-sm">
            <div className="flex flex-col gap-1.5">
              <span className="text-[9.5px] font-bold text-muted-foreground uppercase tracking-wider pl-1">Apps and app categories</span>
              
              <div className="flex gap-2 overflow-x-auto pb-1 mb-1 scrollbar-none">
                {appStats.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => handleSelectApp(app.id)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold whitespace-nowrap border transition-all cursor-pointer ${
                      selectedTimerApp === app.id 
                        ? 'bg-primary border-primary/20 text-primary-foreground shadow-sm' 
                        : 'bg-secondary/60 border-border/50 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {app.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[9.5px] font-bold text-muted-foreground uppercase tracking-wider pl-1">App timer name</span>
              <div className="h-11 px-4 rounded-xl border border-border bg-secondary/40 flex items-center justify-between text-sm font-bold text-foreground">
                <span>{activeTimerApp.name} timer</span>
                <HourglassIcon size={16} className="text-primary" />
              </div>
            </div>

            <div className="flex flex-col gap-1 mt-1">
              <span className="text-[9.5px] font-bold text-muted-foreground uppercase tracking-wider pl-1">App timer alerts</span>
              <p className="text-xs font-semibold text-primary/80 pl-1">1 minute, 5 minutes, 10 minutes before limit</p>
            </div>
          </div>

          {/* Wheel Selector Schedule wrapper */}
          <div className="rounded-3xl bg-card/60 p-5 border border-border backdrop-blur-xl flex flex-col gap-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-foreground/90">Timer duration</span>
              <span className="text-xs font-black text-primary">{wheelHours}h {wheelMinutes}m</span>
            </div>

            <div className="flex gap-4 items-center justify-center py-4 border-t border-b border-border/40 my-1 bg-secondary/20 rounded-2xl relative overflow-hidden h-[120px]">
              <div className="absolute inset-x-0 top-0 h-9 bg-gradient-to-b from-card to-transparent pointer-events-none z-10" />
              <div className="absolute inset-x-0 bottom-0 h-9 bg-gradient-to-t from-card to-transparent pointer-events-none z-10" />

              <div className="flex-1 flex flex-col items-center overflow-y-auto h-24 scrollbar-none gap-2">
                {[0, 1, 2, 3, 4, 5].map((h) => {
                  const isSelected = h === wheelHours
                  return (
                    <button
                      key={h}
                      onClick={() => setWheelHours(h)}
                      className={`text-sm font-bold transition-all ${
                        isSelected ? 'text-primary font-black scale-125' : 'text-muted-foreground/60'
                      }`}
                    >
                      {h} h
                    </button>
                  )
                })}
              </div>

              <span className="text-xl font-bold text-muted-foreground/80">:</span>

              <div className="flex-1 flex flex-col items-center overflow-y-auto h-24 scrollbar-none gap-2">
                {[0, 15, 30, 45].map((m) => {
                  const isSelected = m === wheelMinutes
                  return (
                    <button
                      key={m}
                      onClick={() => setWheelMinutes(m)}
                      className={`text-sm font-bold transition-all ${
                        isSelected ? 'text-primary font-black scale-125' : 'text-muted-foreground/60'
                      }`}
                    >
                      {m} m
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Day initials */}
            <div className="flex justify-between items-center px-2 py-1 select-none">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                <span 
                  key={idx}
                  className="h-8.5 w-8.5 rounded-full border border-border bg-secondary/40 text-[10px] font-black flex items-center justify-center text-foreground/80"
                >
                  {day}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-center mb-6">
            <button
              onClick={handleGoToHome}
              className="h-11 px-6 rounded-full bg-secondary hover:bg-muted border border-border text-xs font-bold text-foreground/80 cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleSaveTimer}
              className="h-11 px-8 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-md hover:opacity-95 cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>
      )
    }

    return null
  }, [
    wellbeingSubPage, 
    formattedTotalScreenTime, 
    donutSegments, 
    weeklyUsage, 
    selectedDate,
    dashboardViewMode,
    goalDetailDate,
    activeGoalDetail,
    screenTimeGoal,
    selectedTimerApp,
    wheelHours,
    wheelMinutes,
    appStats,
    heatmapData,
    maxWeeklyMins,
    totalNotifications,
    totalPickups,
    semiCircumference,
    todayRemaining,
    todayProgress,
    calendarDays,
    handleGoToDashboard,
    handleGoToGoal,
    handleGoToHome,
    handleGoToReport,
    handleOpenGoalPicker,
    handleOpenSetTimer,
    handleSaveTimer,
    handleSelectDay,
    handleSelectGoalDate,
    setActiveTab,
    setDashboardViewMode,
    handleCategoriesCardClick,
    handleTimersCardClick,
    setActiveAppDetailId
  ])

  return (
    <section className="flex flex-col gap-6 relative select-none">
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
              className="w-full bg-card rounded-t-3xl border-t border-border p-5 flex flex-col gap-4 shadow-xl text-foreground"
            >
              <h3 className="font-heading text-sm font-bold tracking-tight text-center">Set screen time goal</h3>

              <div className="flex gap-4 items-center justify-center py-4 border-t border-b border-border/40 my-1 bg-secondary/30 rounded-2xl relative overflow-hidden h-[100px]">
                <div className="flex-1 flex flex-col items-center overflow-y-auto h-20 scrollbar-none gap-2">
                  {[2, 3, 4, 5, 6, 7, 8].map((h) => {
                    const isSelected = h === Math.floor(tempGoalMins / 60)
                    return (
                      <button
                        key={h}
                        onClick={() => setTempGoalMins(h * 60)}
                        className={`text-sm font-extrabold transition-all cursor-pointer ${
                          isSelected ? 'text-primary scale-125 font-black' : 'text-muted-foreground/60'
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
                  className="py-2.5 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Cancel
                </button>
                
                <button 
                  onClick={() => {
                    setScreenTimeGoal(360)
                    setShowGoalModal(false)
                    addToast("Reset goal to default 6h", "info")
                  }}
                  className="py-2.5 text-xs font-bold text-rose-500 hover:text-rose-600 cursor-pointer"
                >
                  Delete
                </button>

                <button 
                  onClick={handleSaveGoal}
                  className="py-2.5 text-xs font-bold text-primary hover:text-primary-dark cursor-pointer font-black"
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
