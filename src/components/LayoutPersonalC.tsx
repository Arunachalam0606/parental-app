import { useState, useMemo, useCallback } from "react"

import { motion, AnimatePresence } from "framer-motion"

import { useWellbeingLogic } from "@/hooks/useWellbeingLogic"

import {
  CaretRightIcon,
  VideoIcon,
  ChatCircleIcon,
  BookOpenIcon,
  ArrowLeftIcon,
  ChartBarIcon,
  DotsThreeVerticalIcon,
  DeviceMobileIcon,
  SparkleIcon,
  BellIcon,
  PlusIcon,
  MinusIcon,
} from "@phosphor-icons/react"

export const LayoutPersonalC = () => {
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
    updateAppLimit,
    setActiveAppDetailId,
    demoEmpty,
  } = useWellbeingLogic()

  // Local state for wheel pickers and modals
  const [selectedTimerApp, setSelectedTimerApp] = useState<string>("insta")
  const [wheelHours, setWheelHours] = useState<number>(1)
  const [wheelMinutes, setWheelMinutes] = useState<number>(30)
  const [showGoalModal, setShowGoalModal] = useState<boolean>(false)
  const [tempGoalMins, setTempGoalMins] = useState<number>(360)

  // Navigate handlers
  const handleGoToDashboard = useCallback(
    () => setWellbeingSubPage("dashboard"),
    [setWellbeingSubPage]
  )
  const handleGoToGoal = useCallback(
    () => setWellbeingSubPage("goal"),
    [setWellbeingSubPage]
  )
  const handleGoToReport = useCallback(
    () => setWellbeingSubPage("report"),
    [setWellbeingSubPage]
  )
  const handleGoToHome = useCallback(
    () => setWellbeingSubPage("home"),
    [setWellbeingSubPage]
  )

  const handleOpenSetTimer = useCallback(
    (appId: string) => {
      setSelectedTimerApp(appId)
      const app = appStats.find((a) => a.id === appId)
      const currentLimit = app?.limitMinutes || 60
      setWheelHours(Math.floor(currentLimit / 60))
      setWheelMinutes(currentLimit % 60)
      setWellbeingSubPage("set-timer")
    },
    [appStats, setWellbeingSubPage]
  )

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
    addToast(`Goal locked at ${Math.floor(tempGoalMins / 60)}h`, "success")
  }, [tempGoalMins, setScreenTimeGoal, addToast])

  const handleSaveTimer = useCallback(() => {
    const totalMins = wheelHours * 60 + wheelMinutes
    const targetApp = appStats.find((a) => a.id === selectedTimerApp)
    if (targetApp) {
      updateAppLimit(selectedTimerApp, totalMins)
      addToast(
        `Timer for ${targetApp.name} calibrated: ${wheelHours}h ${wheelMinutes}m`,
        "success"
      )
    }
    setWellbeingSubPage("home")
  }, [
    wheelHours,
    wheelMinutes,
    appStats,
    selectedTimerApp,
    updateAppLimit,
    addToast,
    setWellbeingSubPage,
  ])

  const handleCategoriesCardClick = useCallback(() => {
    setWellbeingSubPage("dashboard")
    setDashboardViewMode("categories")
  }, [setWellbeingSubPage, setDashboardViewMode])

  const handleTimersCardClick = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest("button")) return
      setWellbeingSubPage("set-timer")
    },
    [setWellbeingSubPage]
  )

  // Circular calculations
  const ringCenter = 45
  const donutRadius = 31
  const circumference = 2 * Math.PI * donutRadius

  const effectiveTotalScreenTimeMinutes = demoEmpty ? 0 : totalScreenTimeMinutes
  const effectiveFormattedTotalScreenTime = demoEmpty
    ? "0m"
    : formattedTotalScreenTime
  const effectiveTotalPickups = demoEmpty ? 0 : totalPickups
  const effectiveTotalNotifications = demoEmpty ? 0 : totalNotifications

  // Compute donut segments
  const donutSegments = useMemo(() => {
    if (demoEmpty) return []
    const sortedApps = [...appStats]
      .sort((a, b) => b.timeSpent - a.timeSpent)
      .slice(0, 3)

    return sortedApps.map((app, index) => {
      const share = app.timeSpent / (effectiveTotalScreenTimeMinutes || 1)
      const strokeDasharray = `${circumference * share} ${circumference}`

      const previousShareSum = sortedApps
        .slice(0, index)
        .reduce(
          (sum, prevApp) =>
            sum + prevApp.timeSpent / (effectiveTotalScreenTimeMinutes || 1),
          0
        )

      const rotation = previousShareSum * 360 - 90

      // Warm Soft AI gradients
      const colors = [
        "stroke-amber-400 dark:stroke-amber-300",
        "stroke-rose-400 dark:stroke-rose-350",
        "stroke-purple-400 dark:stroke-purple-300",
      ]

      return {
        id: app.id,
        name: app.name,
        time: app.timeSpent,
        dashArray: strokeDasharray,
        rotation,
        colorClass: colors[index % colors.length],
      }
    })
  }, [appStats, effectiveTotalScreenTimeMinutes, circumference, demoEmpty])

  // June Calendar Selector
  const calendarDays = useMemo(() => {
    const daysArr = []
    daysArr.push({
      date: "30",
      month: "May",
      used: demoEmpty ? 0 : 190,
      goal: 240,
      status: demoEmpty ? "remaining" : "used",
    })
    daysArr.push({
      date: "31",
      month: "May",
      used: demoEmpty ? 0 : 260,
      goal: 240,
      status: demoEmpty ? "remaining" : "over",
    })

    const mockUsages = demoEmpty
      ? Array.from({ length: 27 }, () => 0)
      : [
          120, 180, 210, 150, 250, 310, 140, 190, 220, 290, 180, 230, 295, 170,
          210, 110, 160, 240, 215, 230, 190, 250, 180, 220, 250, 150, 0, 0,
        ]

    for (let i = 1; i <= 27; i++) {
      const dateStr = i.toString().padStart(2, "0")
      const used = mockUsages[i - 1]
      const goal = 240
      let status = "remaining"
      if (used > 0) {
        status = used > goal ? "over" : "used"
      }
      daysArr.push({ date: dateStr, month: "June", used, goal, status })
    }
    return daysArr
  }, [demoEmpty])

  const semiRadius = 50
  const semiCircumference = Math.PI * semiRadius
  const todayRemaining = Math.max(
    screenTimeGoal - effectiveTotalScreenTimeMinutes,
    0
  )
  const todayProgress = Math.min(
    effectiveTotalScreenTimeMinutes / screenTimeGoal,
    1
  )

  const activeGoalDetail = useMemo(() => {
    if (demoEmpty) {
      return { date: "26", used: 0, goal: screenTimeGoal, status: "remaining" }
    }
    if (!goalDetailDate) {
      return {
        date: "26",
        used: effectiveTotalScreenTimeMinutes,
        goal: screenTimeGoal,
        status:
          effectiveTotalScreenTimeMinutes > screenTimeGoal ? "over" : "used",
      }
    }
    const match = calendarDays.find(
      (d) => d.date === goalDetailDate && d.month === "June"
    )
    if (match) return match
    return {
      date: "26",
      used: effectiveTotalScreenTimeMinutes,
      goal: screenTimeGoal,
      status:
        effectiveTotalScreenTimeMinutes > screenTimeGoal ? "over" : "used",
    }
  }, [
    goalDetailDate,
    calendarDays,
    effectiveTotalScreenTimeMinutes,
    screenTimeGoal,
    demoEmpty,
  ])

  // Heatmap grids
  const heatmapData = useMemo(() => {
    const days = ["S", "M", "T", "W", "T", "F", "S"]
    return days.map((day, d) => {
      const hourlyVals = Array.from({ length: 24 }, (_, h) => {
        if (demoEmpty) return 0
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
  }, [demoEmpty])

  const maxWeeklyMins = useMemo(() => {
    if (demoEmpty) return 360
    return Math.max(...weeklyUsage.map((d) => d.minutes), 360)
  }, [weeklyUsage, demoEmpty])

  const handleSelectDay = useCallback(
    (day: string) => {
      setSelectedDate(day)
      addToast(`Analyzing data for June ${day}`, "info")
    },
    [setSelectedDate, addToast]
  )

  const handleSelectGoalDate = useCallback(
    (date: string) => {
      setGoalDetailDate(date)
    },
    [setGoalDetailDate]
  )

  // AI-generated suggestions
  const aiInsightText = useMemo(() => {
    if (demoEmpty) return "Calibration active. No logs recorded."
    if (totalScreenTimeMinutes > 240) {
      return "Alert: Screen time is elevated today. Consider locking social apps in 30 mins to restore focus balance."
    }
    return "Optimize: Screen usage looks well balanced today. You have saved 45 MB bandwidth with Shield active."
  }, [totalScreenTimeMinutes, demoEmpty])

  const subPageContent = useMemo(() => {
    // 1. WELLBEING HOME PAGE VIEW
    if (wellbeingSubPage === "home") {
      return (
        <div className="flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-center justify-between px-1.5">
            <div>
              <span className="flex items-center gap-1 text-[10px] font-black tracking-widest text-amber-500 uppercase dark:text-amber-400">
                <SparkleIcon
                  size={11}
                  weight="fill"
                  className="animate-pulse"
                />
                <span>Neural telemetry</span>
              </span>
              <h1 className="mt-1 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 bg-clip-text font-heading text-2xl font-black tracking-tight text-transparent dark:from-amber-400 dark:via-rose-400 dark:to-indigo-300">
                Aura Wellbeing
              </h1>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleGoToReport}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-purple-200/50 bg-white/20 text-foreground transition-all duration-200 active:scale-[0.95] dark:border-purple-900/30 dark:bg-slate-900/40"
              >
                <ChartBarIcon size={20} weight="regular" />
              </button>
              <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-purple-200/50 bg-white/20 text-foreground transition-all duration-200 active:scale-[0.95] dark:border-purple-900/30 dark:bg-slate-900/40">
                <DotsThreeVerticalIcon size={20} weight="bold" />
              </button>
            </div>
          </div>

          {/* AI Insights Panel Card */}
          <div className="relative rounded-3xl border border-rose-300/30 bg-gradient-to-r from-amber-500/5 via-rose-500/5 to-purple-500/5 p-4 shadow-[0_8px_32px_rgba(244,63,94,0.06)] backdrop-blur-xl">
            <div className="absolute -inset-px -z-10 rounded-3xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-purple-500/10" />
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-400 to-rose-400 text-white shadow-md shadow-rose-500/10">
                <SparkleIcon
                  size={18}
                  weight="fill"
                  className="animate-spin-slow"
                />
              </div>
              <div className="flex-1">
                <span className="text-[9px] font-black tracking-widest text-rose-500 uppercase">
                  Aura Insights
                </span>
                <p className="mt-1 text-xs leading-relaxed font-semibold text-foreground/90">
                  {aiInsightText}
                </p>
              </div>
            </div>
          </div>

          {/* Total Screen Time Card */}
          <div
            onClick={handleGoToDashboard}
            className="group relative flex cursor-pointer flex-col gap-4 rounded-3xl border border-purple-300/30 bg-white/30 p-5 shadow-[0_12px_30px_rgba(147,51,234,0.08)] backdrop-blur-xl transition-all duration-300 active:scale-[0.98] dark:border-purple-950/20 dark:bg-slate-950/30"
          >
            <div>
              <span className="text-[9px] font-bold tracking-widest text-muted-foreground uppercase">
                Activity Sync today
              </span>

              <div className="mt-1 flex items-baseline justify-between">
                <h3 className="bg-gradient-to-r from-amber-600 via-rose-500 to-purple-600 bg-clip-text font-heading text-3xl font-black text-transparent dark:from-amber-400 dark:via-rose-400 dark:to-purple-400">
                  {effectiveFormattedTotalScreenTime}
                </h3>
                <CaretRightIcon
                  size={14}
                  className="text-muted-foreground/60 transition-transform group-hover:translate-x-1"
                />
              </div>
            </div>

            {demoEmpty ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <DeviceMobileIcon
                  size={32}
                  className="animate-pulse text-purple-400/50"
                />
                <span className="mt-2 text-xs font-bold text-foreground/80">
                  No Screen Activity
                </span>
                <p className="mt-1 max-w-[200px] text-[10px] text-muted-foreground/80">
                  Logs will appear as soon as neural sync is enabled.
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2.5">
                <div className="flex flex-col gap-2.5">
                  {donutSegments.map((seg, idx) => (
                    <div key={seg.id} className="flex items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          idx === 0
                            ? "bg-amber-400 dark:bg-amber-300"
                            : idx === 1
                              ? "dark:bg-rose-450 bg-rose-400"
                              : "bg-purple-400 dark:bg-purple-300"
                        }`}
                      />
                      <span className="text-xs font-bold text-foreground/85">
                        {seg.name}
                      </span>
                      <span className="text-[10px] font-semibold text-muted-foreground">
                        {Math.floor(seg.time / 60)}h {seg.time % 60}m
                      </span>
                    </div>
                  ))}
                </div>

                <div className="relative h-[95px] w-[95px]">
                  <svg className="h-full w-full">
                    <circle
                      cx={ringCenter}
                      cy={ringCenter}
                      r={donutRadius}
                      fill="none"
                      stroke="currentColor"
                      className="text-purple-100 dark:text-purple-950/20"
                      strokeWidth="8"
                    />

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
                          transformOrigin: "45px 45px",
                          transform: `rotate(${seg.rotation}deg)`,
                        }}
                      />
                    ))}
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Categories Card */}
          <div
            onClick={handleCategoriesCardClick}
            className="flex cursor-pointer flex-col gap-3.5 rounded-3xl border border-purple-300/30 bg-white/30 p-5 shadow-[0_12px_30px_rgba(147,51,234,0.08)] backdrop-blur-xl transition-all duration-300 active:scale-[0.98] dark:border-purple-950/20 dark:bg-slate-950/30"
          >
            <div className="flex items-center justify-between pr-1">
              <span className="text-[9px] font-bold tracking-widest text-muted-foreground uppercase">
                App classification
              </span>
              <CaretRightIcon size={12} className="text-muted-foreground/60" />
            </div>

            {demoEmpty ? (
              <div className="py-4 text-center text-xs font-bold text-muted-foreground/80">
                Zero category logs
              </div>
            ) : (
              <div className="flex scrollbar-none gap-3 overflow-x-auto pb-1">
                <div className="flex gap-3 px-0.5">
                  <div className="flex h-[110px] w-[115px] shrink-0 flex-col justify-between rounded-2xl border border-purple-200/50 bg-white/35 p-4 dark:border-purple-900/20 dark:bg-slate-900/35">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:bg-amber-400/20 dark:text-amber-300">
                      <ChatCircleIcon size={18} weight="fill" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground">
                        Social
                      </span>
                      <h4 className="mt-0.5 text-xs font-black text-foreground/90">
                        1h 28m
                      </h4>
                    </div>
                  </div>

                  <div className="flex h-[110px] w-[115px] shrink-0 flex-col justify-between rounded-2xl border border-purple-200/50 bg-white/35 p-4 dark:border-purple-900/20 dark:bg-slate-900/35">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:bg-rose-400/20 dark:text-rose-300">
                      <VideoIcon size={18} weight="fill" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground">
                        Videos
                      </span>
                      <h4 className="mt-0.5 text-xs font-black text-foreground/90">
                        36m
                      </h4>
                    </div>
                  </div>

                  <div className="flex h-[110px] w-[115px] shrink-0 flex-col justify-between rounded-2xl border border-purple-200/50 bg-white/35 p-4 dark:border-purple-900/20 dark:bg-slate-900/35">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:bg-purple-400/20 dark:text-purple-300">
                      <BookOpenIcon size={18} weight="fill" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground">
                        Study
                      </span>
                      <h4 className="mt-0.5 text-xs font-black text-foreground/90">
                        9m
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* App Timers setup */}
          <div
            onClick={handleTimersCardClick}
            className="flex cursor-pointer flex-col gap-4 rounded-3xl border border-purple-300/30 bg-white/30 p-5 shadow-[0_12px_30px_rgba(147,51,234,0.08)] backdrop-blur-xl transition-all duration-300 active:scale-[0.98] dark:border-purple-950/20 dark:bg-slate-950/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-sm font-black text-foreground/95">
                  App Timers
                </h3>
                <p className="mt-1 text-[10px] leading-normal font-semibold text-muted-foreground">
                  Lock specific applications when daily usage is exceeded.
                </p>
              </div>
              <CaretRightIcon
                size={12}
                className="shrink-0 text-muted-foreground/60"
              />
            </div>

            <div className="flex flex-col gap-3">
              {[
                {
                  id: "insta",
                  name: "Instagram",
                  grad: "from-amber-400 to-rose-400",
                  time: "1h 50m",
                },
                {
                  id: "social",
                  name: "Social Apps",
                  grad: "from-rose-400 to-purple-500",
                  time: "3h 15m",
                },
              ].map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border border-purple-200/50 bg-white/35 p-3.5 dark:border-purple-900/20 dark:bg-slate-900/35"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr ${item.grad} text-xs font-black text-white shadow-sm`}
                    >
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <span className="text-xs font-black text-foreground/85">
                        {item.name}
                      </span>
                      <p className="mt-0.5 text-[9px] font-semibold text-muted-foreground">
                        Limit: {demoEmpty ? "0m" : item.time}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenSetTimer(item.id)}
                    className="h-8 cursor-pointer rounded-xl bg-purple-600 px-3 text-[10px] font-black text-white shadow-sm hover:bg-purple-700 active:scale-95"
                  >
                    Calibrate
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Screen Time Goal */}
          <div
            onClick={handleGoToGoal}
            className="flex cursor-pointer flex-col gap-4 rounded-3xl border border-purple-300/30 bg-white/30 p-5 shadow-[0_12px_30px_rgba(147,51,234,0.08)] backdrop-blur-xl transition-all duration-300 active:scale-[0.98] dark:border-purple-950/20 dark:bg-slate-950/30"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-sm font-black text-foreground/95">
                Dynamic Goal
              </h3>
              <CaretRightIcon size={12} className="text-muted-foreground/60" />
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="relative flex h-[90px] w-[180px] items-end justify-center overflow-hidden">
                <svg className="absolute top-0 left-0 h-[100px] w-[180px]">
                  <defs>
                    <linearGradient
                      id="auraGoalGrad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 20 80 A 70 70 0 0 1 160 80"
                    fill="none"
                    stroke="currentColor"
                    className="text-purple-100 dark:text-purple-950/20"
                    strokeWidth="9"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 20 80 A 70 70 0 0 1 160 80"
                    fill="none"
                    stroke="url(#auraGoalGrad)"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray={semiCircumference}
                    strokeDashoffset={semiCircumference * (1 - todayProgress)}
                  />
                </svg>

                <div className="flex flex-col items-center pb-2 text-center">
                  <span className="font-heading text-2xl font-black text-foreground">
                    {Math.floor(todayRemaining / 60)}h {todayRemaining % 60}m
                  </span>
                  <span className="mt-0.5 text-[9px] font-black tracking-widest text-muted-foreground uppercase">
                    Remaining
                  </span>
                </div>
              </div>

              <button
                onClick={handleGoToGoal}
                className="h-8.5 cursor-pointer rounded-xl border border-purple-200/50 bg-white/40 px-4 text-xs font-black text-foreground shadow-sm active:scale-95 dark:border-purple-900/30 dark:bg-slate-900/40"
              >
                Goal: {Math.floor(screenTimeGoal / 60)}h
              </button>
            </div>
          </div>
        </div>
      )
    }

    // 2. DASHBOARD DETAILED VIEW
    if (wellbeingSubPage === "dashboard") {
      const toggleViewMode = () =>
        setDashboardViewMode(
          dashboardViewMode === "apps" ? "categories" : "apps"
        )

      return (
        <div className="flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-center justify-between px-1">
            <button
              onClick={handleGoToHome}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-purple-200/50 bg-white/20 text-foreground transition-all duration-200 active:scale-[0.95] dark:border-purple-900/30 dark:bg-slate-900/40"
            >
              <ArrowLeftIcon size={16} weight="bold" />
            </button>
            <h2 className="font-heading text-lg font-black tracking-tight text-foreground/95">
              Dashboard Logs
            </h2>
            <button
              onClick={toggleViewMode}
              className="cursor-pointer text-xs font-black text-amber-500 hover:underline active:scale-95"
            >
              {dashboardViewMode === "apps" ? "Categories" : "Apps"}
            </button>
          </div>

          {/* Calendar Selector */}
          <div className="flex items-center justify-between rounded-2xl border border-purple-200/50 bg-white/30 px-2 py-1.5 dark:border-purple-900/30 dark:bg-slate-950/30">
            {["21", "22", "23", "24", "25", "26", "27"].map((day) => {
              const isSelected = selectedDate === day
              return (
                <button
                  key={day}
                  onClick={() => handleSelectDay(day)}
                  className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-xs font-extrabold transition-all ${
                    isSelected
                      ? "scale-105 bg-purple-600 text-white shadow-md shadow-purple-500/25"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {day}
                </button>
              )
            })}
          </div>

          {/* Weekly chart and list */}
          <div className="flex flex-col gap-4 rounded-3xl border border-purple-300/30 bg-white/30 p-5 shadow-[0_12px_30px_rgba(147,51,234,0.08)] backdrop-blur-xl dark:border-purple-950/20 dark:bg-slate-950/30">
            <div>
              <span className="text-[9px] font-bold tracking-widest text-muted-foreground uppercase">
                June {selectedDate} Sync
              </span>
              <h3 className="mt-1 font-heading text-2xl font-black text-foreground">
                {effectiveFormattedTotalScreenTime}
              </h3>
            </div>

            {/* Smooth glowing area wave chart */}
            <div className="flex h-32 w-full items-end justify-between px-1.5 pt-4">
              {weeklyUsage.map((val) => {
                const heightPercent = demoEmpty
                  ? 0
                  : (val.minutes / maxWeeklyMins) * 100
                const isSelected =
                  !demoEmpty && selectedDate === "26" && val.day === "Fri"

                return (
                  <div
                    key={val.day}
                    className="flex flex-1 flex-col items-center gap-1.5"
                  >
                    <div className="flex h-24 w-3.5 items-end overflow-hidden rounded-full bg-purple-100/50 dark:bg-purple-950/35">
                      <div
                        className={`w-full rounded-full transition-all duration-500 ${
                          isSelected
                            ? "bg-gradient-to-t from-amber-500 to-rose-500"
                            : "bg-purple-600/35 dark:bg-purple-400/25"
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span
                      className={`text-[10px] font-bold ${isSelected ? "font-black text-rose-500" : "text-muted-foreground"}`}
                    >
                      {val.day.charAt(0)}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Apps stats list */}
            <div className="flex flex-col gap-2.5 border-t border-purple-200/50 pt-4 dark:border-purple-900/30">
              {demoEmpty ? (
                <div className="py-6 text-center text-xs font-bold text-muted-foreground/80">
                  No device activity logged
                </div>
              ) : (
                appStats.map((app, idx) => {
                  const strokeColors = [
                    "#f59e0b", // Amber
                    "#ec4899", // Pink
                    "#8b5cf6", // Purple
                    "#3b82f6", // Blue
                    "#10b981", // Emerald
                  ]
                  const strokeColor = strokeColors[idx % strokeColors.length]
                  const sharePercent = Math.round(
                    (app.timeSpent / (effectiveTotalScreenTimeMinutes || 1)) *
                      100
                  )

                  return (
                    <button
                      key={app.id}
                      onClick={() => setActiveAppDetailId(app.id)}
                      className="flex cursor-pointer items-center justify-between rounded-2xl border border-purple-200/40 bg-white/20 p-3 text-left transition-all hover:bg-white/40 active:scale-[0.98] dark:border-purple-900/20 dark:bg-slate-900/30"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold text-white"
                          style={{
                            backgroundColor: strokeColor,
                            boxShadow: `0 4px 10px ${strokeColor}30`,
                          }}
                        >
                          {app.name.charAt(0)}
                        </div>
                        <div>
                          <span className="text-xs font-black text-foreground/90">
                            {app.name}
                          </span>
                          <p className="mt-0.5 text-[9px] font-semibold text-muted-foreground">
                            {app.pickups} Pickups • {app.notifications} Alerts
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <span className="text-xs font-black text-foreground/90">
                            {Math.floor(app.timeSpent / 60)}h{" "}
                            {app.timeSpent % 60}m
                          </span>
                          <p className="text-[9px] font-bold text-muted-foreground">
                            {sharePercent}% share
                          </p>
                        </div>
                        <CaretRightIcon
                          size={12}
                          className="text-muted-foreground/45"
                        />
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

    // 3. GOAL SETTING HISTORY
    if (wellbeingSubPage === "goal") {
      return (
        <div className="flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-center justify-between px-1">
            <button
              onClick={handleGoToHome}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-purple-200/50 bg-white/20 text-foreground transition-colors active:scale-[0.95] dark:bg-slate-800/40"
            >
              <ArrowLeftIcon size={16} weight="bold" />
            </button>
            <h2 className="font-heading text-lg font-black tracking-tight text-foreground/95">
              Goal Manager
            </h2>
            <button
              onClick={handleOpenGoalPicker}
              className="h-8 cursor-pointer rounded-xl bg-purple-600 px-3 text-[10px] font-black text-white active:scale-95"
            >
              Adjust
            </button>
          </div>

          {/* Goal Gauge */}
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-purple-300/30 bg-white/30 p-5 shadow-[0_12px_30px_rgba(147,51,234,0.08)] backdrop-blur-xl dark:border-purple-950/20 dark:bg-slate-950/30">
            <div className="relative flex h-[140px] w-[260px] items-end justify-center overflow-hidden">
              <svg className="absolute top-0 left-10 h-[150px] w-[180px]">
                <path
                  d="M 20 100 A 70 70 0 0 1 160 100"
                  fill="none"
                  stroke="currentColor"
                  className="text-purple-100 dark:text-purple-950/20"
                  strokeWidth="11"
                  strokeLinecap="round"
                />
                <path
                  d="M 20 100 A 70 70 0 0 1 160 100"
                  fill="none"
                  stroke="url(#auraGoalGrad)"
                  strokeWidth="11"
                  strokeLinecap="round"
                  strokeDasharray={semiCircumference}
                  strokeDashoffset={semiCircumference * (1 - todayProgress)}
                />
              </svg>

              <div className="flex flex-col items-center pb-2 text-center">
                <span className="font-heading text-3xl font-black text-foreground">
                  {Math.floor(effectiveTotalScreenTimeMinutes / 60)}h{" "}
                  {effectiveTotalScreenTimeMinutes % 60}m
                </span>
                <p className="mt-0.5 text-[9px] font-bold text-muted-foreground">
                  Goal limit: {Math.floor(screenTimeGoal / 60)}h
                </p>
              </div>
            </div>
          </div>

          {/* Monthly grid */}
          <div className="flex flex-col gap-3 rounded-3xl border border-purple-300/30 bg-white/30 p-4.5 shadow-[0_12px_30px_rgba(147,51,234,0.08)] backdrop-blur-xl dark:border-purple-950/20 dark:bg-slate-950/30">
            <div className="flex items-center justify-between border-b border-purple-200/50 pb-2 dark:border-purple-900/30">
              <span className="text-xs font-black text-foreground">
                June Calibration History
              </span>
              <span className="text-[10px] font-semibold text-muted-foreground">
                Select date to detail
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 pt-1 text-center">
              {["S", "M", "T", "W", "T", "F", "S"].map((w, idx) => (
                <span
                  key={idx}
                  className="text-[9px] font-black text-muted-foreground/60"
                >
                  {w}
                </span>
              ))}

              {calendarDays.map((d, index) => {
                const isSelected =
                  goalDetailDate === d.date ||
                  (!goalDetailDate && d.date === "26" && d.month === "June")
                const isOver = d.status === "over"
                const isUsed = d.status === "used"

                return (
                  <button
                    key={index}
                    onClick={() => handleSelectGoalDate(d.date)}
                    className={`relative flex h-[34px] w-full cursor-pointer flex-col items-center justify-center rounded-lg text-[10px] font-bold transition-all active:scale-95 ${
                      isSelected
                        ? "bg-purple-600 font-black text-white shadow-sm"
                        : isOver
                          ? "border border-rose-500/25 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                          : isUsed
                            ? "border border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "border border-purple-200/30 bg-purple-50/20 text-muted-foreground dark:border-purple-900/20"
                    }`}
                  >
                    <span>{d.date}</span>
                    {d.used > 0 && !isSelected && (
                      <span
                        className={`absolute bottom-1 h-1 w-1 rounded-full ${isOver ? "bg-rose-500" : "bg-emerald-500"}`}
                      />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Goal details */}
            <div className="mt-2.5 rounded-2xl border border-purple-200/50 bg-white/20 p-3.5 dark:border-purple-900/20 dark:bg-slate-900/40">
              <span className="text-[9px] font-black tracking-widest text-rose-500 uppercase">
                Selected Log Info
              </span>
              <div className="mt-1.5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-foreground">
                    June {activeGoalDetail.date}
                  </span>
                  <p className="mt-0.5 text-[9px] font-semibold text-muted-foreground">
                    Limit Goal: {Math.floor(activeGoalDetail.goal / 60)}h
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs font-black ${activeGoalDetail.status === "over" ? "text-rose-500" : "text-emerald-500"}`}
                  >
                    {Math.floor(activeGoalDetail.used / 60)}h{" "}
                    {activeGoalDetail.used % 60}m
                  </span>
                  <p className="text-[9px] font-semibold text-muted-foreground">
                    {activeGoalDetail.status === "over"
                      ? "Goal exceeded"
                      : "Inside limit"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // 4. REPORT: PICKUPS & HEATMAP DENSITY GRID
    if (wellbeingSubPage === "report") {
      return (
        <div className="flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-center justify-between px-1">
            <button
              onClick={handleGoToHome}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-purple-200/50 bg-white/20 text-foreground transition-colors active:scale-[0.95] dark:bg-slate-800/40"
            >
              <ArrowLeftIcon size={16} weight="bold" />
            </button>
            <h2 className="font-heading text-lg font-black tracking-tight text-foreground/95">
              Sync Reports
            </h2>
            <div className="w-10" />
          </div>

          {/* Quick stats counter */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col justify-between rounded-3xl border border-purple-300/30 bg-white/30 p-4.5 shadow-[0_12px_30px_rgba(147,51,234,0.08)] backdrop-blur-xl dark:border-purple-950/20 dark:bg-slate-950/30">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:bg-amber-400/20 dark:text-amber-300">
                <DeviceMobileIcon size={16} weight="bold" />
              </div>
              <div className="mt-4">
                <span className="text-[10px] font-bold text-muted-foreground">
                  Pickups
                </span>
                <h4 className="text-xl font-black text-foreground">
                  {effectiveTotalPickups}
                </h4>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-3xl border border-purple-300/30 bg-white/30 p-4.5 shadow-[0_12px_30px_rgba(147,51,234,0.08)] backdrop-blur-xl dark:border-purple-950/20 dark:bg-slate-950/30">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:bg-purple-400/20 dark:text-purple-300">
                <BellIcon size={16} weight="bold" />
              </div>
              <div className="mt-4">
                <span className="text-[10px] font-bold text-muted-foreground">
                  Alerts
                </span>
                <h4 className="text-xl font-black text-foreground">
                  {effectiveTotalNotifications}
                </h4>
              </div>
            </div>
          </div>

          {/* Hourly Heatmap Density Grid */}
          <div className="flex flex-col gap-3 rounded-3xl border border-purple-300/30 bg-white/30 p-4.5 shadow-[0_12px_30px_rgba(147,51,234,0.08)] backdrop-blur-xl dark:border-purple-950/20 dark:bg-slate-950/30">
            <div className="border-b border-purple-200/50 pb-2 dark:border-purple-900/30">
              <span className="text-xs font-black text-foreground">
                Sync Heatmap
              </span>
              <p className="mt-0.5 text-[9px] font-semibold text-muted-foreground">
                Hourly density patterns (S-S)
              </p>
            </div>

            <div className="flex flex-col gap-1.5 pt-1">
              {heatmapData.map((row) => (
                <div key={row.day} className="flex items-center gap-1.5">
                  <span className="w-3 text-[9px] font-black text-muted-foreground/60">
                    {row.day}
                  </span>
                  <div className="flex flex-1 justify-between gap-0.5">
                    {row.values.map((v, h) => {
                      const colors = [
                        "bg-purple-100/30 dark:bg-purple-950/20 border border-purple-200/10", // Empty
                        "bg-amber-400/25", // Low
                        "bg-rose-450/50", // Mid
                        "bg-gradient-to-tr from-amber-500 to-rose-500 shadow-sm", // High
                      ]
                      const colorClass = colors[v]
                      return (
                        <div
                          key={h}
                          className={`h-2.5 flex-1 rounded-sm ${colorClass}`}
                          title={`Hour ${h}: density ${v}`}
                        />
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between border-t border-purple-200/50 pt-2.5 text-[8.5px] font-black tracking-wider text-muted-foreground uppercase dark:border-purple-900/30">
              <span>00:00</span>
              <span>12:00</span>
              <span>23:00</span>
            </div>
          </div>
        </div>
      )
    }

    // 5. SET APP TIMER VIEW (Interactive holographic picker slider)
    if (wellbeingSubPage === "set-timer") {
      const activeApp =
        appStats.find((a) => a.id === selectedTimerApp) || appStats[0]

      const adjustHours = (val: number) => {
        setWheelHours((h) => Math.max(0, Math.min(23, h + val)))
      }

      const adjustMinutes = (val: number) => {
        setWheelMinutes((m) => {
          let nextM = m + val
          if (nextM >= 60) nextM = 0
          if (nextM < 0) nextM = 45
          return nextM
        })
      }

      return (
        <div className="flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-center justify-between px-1">
            <button
              onClick={handleGoToHome}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-purple-200/50 bg-white/20 text-foreground transition-colors active:scale-[0.95] dark:bg-slate-800/40"
            >
              <ArrowLeftIcon size={16} weight="bold" />
            </button>
            <h2 className="font-heading text-lg font-black tracking-tight text-foreground/95">
              Timer setup
            </h2>
            <div className="w-10" />
          </div>

          <div className="flex flex-col items-center gap-5 rounded-3xl border border-purple-300/30 bg-white/30 p-5 shadow-[0_12px_30px_rgba(147,51,234,0.08)] backdrop-blur-xl dark:border-purple-950/20 dark:bg-slate-950/30">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-base font-black text-white shadow-md">
                {activeApp.name.charAt(0)}
              </div>
              <h3 className="mt-3 font-heading text-base font-black text-foreground">
                {activeApp.name}
              </h3>
              <p className="mt-0.5 text-[9px] font-semibold text-muted-foreground">
                Set screen allowance limit
              </p>
            </div>

            {/* Dynamic adjuster dial buttons */}
            <div className="flex items-center gap-8 py-4">
              {/* Hours selector */}
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => adjustHours(1)}
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-purple-200/50 bg-white/40 text-foreground active:scale-90"
                >
                  <PlusIcon size={12} weight="bold" />
                </button>
                <div className="text-center">
                  <span className="text-2xl font-black text-foreground">
                    {wheelHours}
                  </span>
                  <span className="block text-[8px] font-bold text-muted-foreground uppercase">
                    Hours
                  </span>
                </div>
                <button
                  onClick={() => adjustHours(-1)}
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-purple-200/50 bg-white/40 text-foreground active:scale-90"
                >
                  <MinusIcon size={12} weight="bold" />
                </button>
              </div>

              <span className="text-2xl font-black text-muted-foreground/60">
                :
              </span>

              {/* Minutes selector */}
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => adjustMinutes(15)}
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-purple-200/50 bg-white/40 text-foreground active:scale-90"
                >
                  <PlusIcon size={12} weight="bold" />
                </button>
                <div className="text-center">
                  <span className="text-2xl font-black text-foreground">
                    {wheelMinutes.toString().padStart(2, "0")}
                  </span>
                  <span className="block text-[8px] font-bold text-muted-foreground uppercase">
                    Mins
                  </span>
                </div>
                <button
                  onClick={() => adjustMinutes(-15)}
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-purple-200/50 bg-white/40 text-foreground active:scale-90"
                >
                  <MinusIcon size={12} weight="bold" />
                </button>
              </div>
            </div>

            <button
              onClick={handleSaveTimer}
              className="h-11 w-full cursor-pointer rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 font-black text-white shadow-md active:scale-95"
            >
              Lock Limit Duration
            </button>
          </div>
        </div>
      )
    }

    return null
  }, [
    wellbeingSubPage,
    effectiveFormattedTotalScreenTime,
    effectiveTotalScreenTimeMinutes,
    effectiveTotalPickups,
    effectiveTotalNotifications,
    donutSegments,
    aiInsightText,
    demoEmpty,
    dashboardViewMode,
    appStats,
    weeklyUsage,
    selectedDate,
    maxWeeklyMins,
    activeGoalDetail,
    calendarDays,
    heatmapData,
    wheelHours,
    wheelMinutes,
    selectedTimerApp,
    todayProgress,
    todayRemaining,
    handleCategoriesCardClick,
    handleSaveTimer,
    handleSaveGoal,
    handleOpenSetTimer,
    handleOpenGoalPicker,
    handleSelectDay,
    handleSelectGoalDate,
    handleGoToDashboard,
    handleGoToGoal,
    handleGoToReport,
    handleGoToHome,
  ])

  return (
    <section className="h-full w-full select-none">
      {subPageContent}

      {/* Goal Adjustment Modal */}
      <AnimatePresence>
        {showGoalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-5 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="w-full max-w-[270px] rounded-3xl border border-purple-300/30 bg-card p-5 text-foreground shadow-2xl dark:border-purple-900/35"
            >
              <h4 className="font-heading text-sm font-black text-foreground">
                Adjust Goal Limit
              </h4>
              <p className="mt-1 text-[9px] font-semibold text-muted-foreground">
                Adjust daily wellbeing target
              </p>

              <div className="my-5 flex items-center justify-center gap-5">
                <button
                  onClick={() => setTempGoalMins((m) => Math.max(60, m - 30))}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 active:scale-90"
                >
                  <MinusIcon size={14} weight="bold" />
                </button>
                <span className="text-xl font-black">
                  {Math.floor(tempGoalMins / 60)}h {tempGoalMins % 60}m
                </span>
                <button
                  onClick={() => setTempGoalMins((m) => Math.min(720, m + 30))}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 active:scale-90"
                >
                  <PlusIcon size={14} weight="bold" />
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCloseGoalPicker}
                  className="h-9 flex-1 cursor-pointer rounded-xl border border-purple-200/50 bg-secondary px-3 text-[10px] font-bold text-foreground"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveGoal}
                  className="h-9 flex-1 cursor-pointer rounded-xl bg-purple-600 text-[10px] font-black text-white"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default LayoutPersonalC
