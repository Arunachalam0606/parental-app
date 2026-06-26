import { useState, useMemo, useCallback } from "react"

import { motion, AnimatePresence } from "framer-motion"

import { useWellbeingLogic } from "@/hooks/useWellbeingLogic"

import {
  CaretRightIcon,
  VideoIcon,
  ChatCircleIcon,
  BookOpenIcon,
  HourglassIcon,
  ArrowLeftIcon,
  ChartBarIcon,
  DotsThreeVerticalIcon,
  DeviceMobileIcon,
} from "@phosphor-icons/react"

export const LayoutPersonalB = () => {
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
    setActiveAppDetailId,
    demoEmpty,
  } = useWellbeingLogic()

  // Local state for wheel pickers and toggle states
  const [selectedTimerApp, setSelectedTimerApp] = useState<string>("insta")
  const [wheelHours, setWheelHours] = useState<number>(2)
  const [wheelMinutes, setWheelMinutes] = useState<number>(15)
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
    addToast(
      `Screen time goal updated to ${Math.floor(tempGoalMins / 60)}h`,
      "success"
    )
  }, [tempGoalMins, setScreenTimeGoal, addToast])

  const handleSaveTimer = useCallback(() => {
    const totalMins = wheelHours * 60 + wheelMinutes
    const targetApp = appStats.find((a) => a.id === selectedTimerApp)
    if (targetApp) {
      updateAppLimit(selectedTimerApp, totalMins)
      addToast(
        `Set timer for ${targetApp.name} to ${wheelHours}h ${wheelMinutes}m`,
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

  // Ring parameters
  const ringCenter = 45
  const donutRadius = 30
  const circumference = 2 * Math.PI * donutRadius

  // Dynamic overrides for demoEmpty state
  const effectiveTotalScreenTimeMinutes = demoEmpty ? 0 : totalScreenTimeMinutes
  const effectiveFormattedTotalScreenTime = demoEmpty
    ? "0m"
    : formattedTotalScreenTime
  const effectiveTotalPickups = demoEmpty ? 0 : totalPickups
  const effectiveTotalNotifications = demoEmpty ? 0 : totalNotifications

  // Compute donut segment values
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

      const colors = [
        "stroke-[oklch(0.65_0.15_250)]",
        "stroke-[oklch(0.68_0.14_170)]",
        "stroke-[oklch(0.66_0.15_300)]",
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

  // Monthly Calendar Date Rings for June
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

  // Semicircular progress calculations
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

  // Selected date details for Goal History screen
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

  // Heatmap hourly grid array (7 days x 24 hours scaled)
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

  // Weekly Report stacked bar details
  const maxWeeklyMins = useMemo(() => {
    if (demoEmpty) return 360
    return Math.max(...weeklyUsage.map((d) => d.minutes), 360)
  }, [weeklyUsage, demoEmpty])

  // Day click logic
  const handleSelectDay = useCallback(
    (day: string) => {
      setSelectedDate(day)
      addToast(`Viewing data for June ${day}`, "info")
    },
    [setSelectedDate, addToast]
  )

  // Goal Date click logic
  const handleSelectGoalDate = useCallback(
    (date: string) => {
      setGoalDetailDate(date)
    },
    [setGoalDetailDate]
  )

  // --- Sub-Page JSX Structure computation (Logic Isolation) ---
  const subPageContent = useMemo(() => {
    // 1. WELLBEING HOME PAGE VIEW
    if (wellbeingSubPage === "home") {
      return (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                Digital Footprints
              </span>

              <h1 className="mt-0.5 font-heading text-2xl font-bold tracking-tight text-foreground/90">
                Digital Wellbeing
              </h1>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleGoToReport}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border/40 bg-white/40 text-foreground transition-all duration-200 active:scale-[0.95] dark:bg-slate-800/40"
                title="Weekly report"
              >
                <ChartBarIcon size={20} weight="regular" />
              </button>

              <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border/40 bg-white/40 text-foreground transition-all duration-200 active:scale-[0.95] dark:bg-slate-800/40">
                <DotsThreeVerticalIcon size={20} weight="bold" />
              </button>
            </div>
          </div>

          <div
            onClick={handleGoToDashboard}
            className="flex cursor-pointer flex-col gap-4 rounded-2xl border border-border bg-gradient-to-tr from-white/60 to-purple-50/60 p-4.5 shadow-sm backdrop-blur-xl transition-all duration-200 active:scale-[0.98] dark:from-slate-900/60 dark:to-purple-950/20"
          >
            <div>
              <span className="text-[9.5px] font-bold tracking-wider text-muted-foreground uppercase">
                Screen time today
              </span>

              <div className="mt-1 flex items-baseline justify-between">
                <h3 className="font-heading text-3xl font-black text-foreground/90">
                  {effectiveFormattedTotalScreenTime}
                </h3>

                <CaretRightIcon
                  size={14}
                  className="text-muted-foreground/60"
                />
              </div>
            </div>

            {demoEmpty ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <DeviceMobileIcon
                  size={32}
                  className="animate-pulse text-muted-foreground/45"
                />

                <span className="mt-2 text-xs font-bold text-foreground/80">
                  Zero Usage Today
                </span>

                <p className="mt-1 max-w-[200px] text-[10px] text-muted-foreground/80">
                  Spend time away from your device. Take a screen break.
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2.5">
                <div className="flex flex-col gap-2">
                  {donutSegments.map((seg, idx) => (
                    <div key={seg.id} className="flex items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          idx === 0
                            ? "bg-[oklch(0.65_0.15_250)]"
                            : idx === 1
                              ? "bg-[oklch(0.68_0.14_170)]"
                              : "bg-[oklch(0.66_0.15_300)]"
                        }`}
                      />

                      <span className="text-xs font-bold text-foreground/80">
                        {seg.name}
                      </span>

                      <span className="text-[10px] font-medium text-muted-foreground">
                        {Math.floor(seg.time / 60)}h {seg.time % 60}m
                      </span>
                    </div>
                  ))}
                </div>

                <div className="relative h-[90px] w-[90px]">
                  <svg className="h-full w-full">
                    <circle
                      cx={ringCenter}
                      cy={ringCenter}
                      r={donutRadius}
                      fill="none"
                      stroke="currentColor"
                      className="text-muted/10 dark:text-muted/5"
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

          <div
            onClick={handleCategoriesCardClick}
            className="flex cursor-pointer flex-col gap-3 rounded-2xl border border-border bg-gradient-to-tr from-white/60 to-indigo-50/30 p-4.5 backdrop-blur-xl transition-all duration-300 active:scale-[0.98] dark:from-slate-900/60 dark:to-indigo-950/20"
          >
            <div className="flex items-center justify-between pr-1">
              <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                Most used app categories
              </span>

              <CaretRightIcon size={12} className="text-muted-foreground/60" />
            </div>

            {demoEmpty ? (
              <div className="py-4 text-center text-xs font-bold text-muted-foreground/80">
                No categories tracked
              </div>
            ) : (
              <div className="flex scrollbar-none gap-3 overflow-x-auto pb-1">
                <div className="flex gap-3 px-1">
                  <div className="flex h-[105px] w-[110px] shrink-0 flex-col justify-between rounded-xl border border-border/80 bg-white/40 p-3.5 dark:bg-slate-800/40">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400">
                      <ChatCircleIcon size={16} weight="fill" />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground">
                        Social
                      </span>

                      <h4 className="mt-0.5 text-xs font-extrabold text-foreground/90">
                        1 h 28 m
                      </h4>
                    </div>
                  </div>

                  <div className="flex h-[105px] w-[110px] shrink-0 flex-col justify-between rounded-xl border border-border/80 bg-white/40 p-3.5 dark:bg-slate-800/40">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      <VideoIcon size={16} weight="fill" />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground">
                        Shopping
                      </span>

                      <h4 className="mt-0.5 text-xs font-extrabold text-foreground/90">
                        36 m
                      </h4>
                    </div>
                  </div>

                  <div className="flex h-[105px] w-[110px] shrink-0 flex-col justify-between rounded-xl border border-border/80 bg-white/40 p-3.5 dark:bg-slate-800/40">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border border-purple-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      <BookOpenIcon size={16} weight="fill" />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground">
                        Productive
                      </span>

                      <h4 className="mt-0.5 text-xs font-extrabold text-foreground/90">
                        9 m
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div
            onClick={handleTimersCardClick}
            className="flex cursor-pointer flex-col gap-4 rounded-2xl border border-border bg-gradient-to-tr from-white/60 to-purple-50/50 p-4.5 shadow-sm backdrop-blur-xl transition-all duration-300 active:scale-[0.98] dark:from-slate-900/60 dark:to-purple-950/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-sm font-semibold tracking-tight text-foreground/90">
                  App timers
                </h3>

                <p className="mt-1 text-[10.5px] leading-relaxed font-medium text-muted-foreground">
                  If you're using certain apps more than you'd like, set a
                  timer.
                </p>
              </div>

              <CaretRightIcon
                size={12}
                className="shrink-0 text-muted-foreground/60"
              />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between rounded-xl border border-border/40 bg-white/40 p-3 dark:bg-slate-800/40">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-500 to-pink-500 font-bold text-white shadow-sm">
                    I
                  </div>

                  <div>
                    <span className="text-xs font-bold text-foreground/80">
                      Instagram
                    </span>

                    <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">
                      Used: {demoEmpty ? "0m" : "1h 50m"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenSetTimer("insta")}
                  className="h-8 cursor-pointer rounded-xl border border-border bg-secondary/80 px-3 text-[10px] font-bold text-foreground/80 transition-all hover:bg-secondary active:scale-95"
                >
                  Set timer
                </button>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border/40 bg-white/40 p-3 dark:bg-slate-800/40">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-500 font-bold text-white shadow-sm">
                    S
                  </div>

                  <div>
                    <span className="text-xs font-bold text-foreground/80">
                      Social Apps
                    </span>

                    <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">
                      Used: {demoEmpty ? "0m" : "3h 15m"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenSetTimer("social")}
                  className="h-8 cursor-pointer rounded-xl border border-border bg-secondary/80 px-3 text-[10px] font-bold text-foreground/80 transition-all hover:bg-secondary active:scale-95"
                >
                  Set timer
                </button>
              </div>
            </div>
          </div>

          <div
            onClick={handleGoToGoal}
            className="to-sand-50/50 flex cursor-pointer flex-col gap-4 rounded-2xl border border-border bg-gradient-to-tr from-white/60 p-4.5 shadow-sm backdrop-blur-xl transition-all duration-300 active:scale-[0.98] dark:from-slate-900/60 dark:to-orange-950/10"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-sm font-semibold tracking-tight text-foreground/90">
                Screen time goal
              </h3>

              <CaretRightIcon size={12} className="text-muted-foreground/60" />
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="relative flex h-[90px] w-[180px] items-end justify-center overflow-hidden">
                <svg className="absolute top-0 left-0 h-[100px] w-[180px]">
                  <defs>
                    <linearGradient
                      id="usageRingGradB"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
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
                    stroke="url(#usageRingGradB)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={semiCircumference}
                    strokeDashoffset={semiCircumference * (1 - todayProgress)}
                  />
                </svg>

                <div className="flex flex-col items-center pb-2 text-center">
                  <span className="font-heading text-2xl font-black text-foreground/95">
                    {Math.floor(todayRemaining / 60)}h {todayRemaining % 60}m
                  </span>

                  <span className="mt-0.5 text-[9.5px] font-bold tracking-wider text-muted-foreground uppercase">
                    Remaining
                  </span>
                </div>
              </div>

              <button
                onClick={handleGoToGoal}
                className="h-9.5 cursor-pointer rounded-xl border border-border bg-white/60 px-4 text-xs font-bold text-foreground/80 transition-all active:scale-95 dark:bg-slate-800/60"
              >
                Goal {Math.floor(screenTimeGoal / 60)} h
              </button>
            </div>
          </div>

          <div
            onClick={() => setActiveTab("parental")}
            className="flex cursor-pointer flex-col gap-2 rounded-2xl border border-border bg-gradient-to-tr from-white/60 to-purple-50/50 p-4.5 shadow-sm backdrop-blur-xl transition-all duration-300 active:scale-[0.98] dark:from-slate-900/60 dark:to-purple-950/20"
          >
            <span className="text-[9px] font-bold tracking-wider text-muted-foreground uppercase">
              Parental controls
            </span>

            <p className="text-[11px] leading-relaxed font-semibold text-foreground/80">
              Add content restrictions and set other limits to help your child
              balance screen time.
            </p>
          </div>
        </div>
      )
    }

    // 2. DASHBOARD DETAILED BAR CHARTS VIEW
    if (wellbeingSubPage === "dashboard") {
      const toggleViewMode = () =>
        setDashboardViewMode(
          dashboardViewMode === "apps" ? "categories" : "apps"
        )

      return (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <button
              onClick={handleGoToHome}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border/40 bg-white/40 text-foreground transition-colors active:scale-[0.95] dark:bg-slate-800/40"
            >
              <ArrowLeftIcon size={16} weight="bold" />
            </button>

            <h2 className="font-heading text-lg font-bold tracking-tight text-foreground/95">
              Dashboard
            </h2>

            <button
              onClick={toggleViewMode}
              className="cursor-pointer text-xs font-extrabold text-primary hover:underline active:scale-95"
            >
              {dashboardViewMode === "apps" ? "Show categories" : "Show apps"}
            </button>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border/40 bg-white/40 px-2 py-1.5 select-none dark:bg-slate-800/40">
            {["21", "22", "23", "24", "25", "26", "27"].map((day) => {
              const isSelected = selectedDate === day
              return (
                <button
                  key={day}
                  onClick={() => handleSelectDay(day)}
                  className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-xs font-extrabold transition-all ${
                    isSelected
                      ? "scale-105 bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {day}
                </button>
              )
            })}
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-gradient-to-tr from-white/60 to-purple-50/50 p-4.5 shadow-sm backdrop-blur-xl dark:from-slate-900/60 dark:to-purple-950/20">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                Total screen time
              </span>

              <h3 className="mt-1 font-heading text-2xl font-black text-foreground/90">
                {effectiveFormattedTotalScreenTime}
              </h3>
            </div>

            {/* Bars container */}
            <div className="flex h-32 w-full items-end justify-between px-2 pt-4">
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
                    <div className="flex h-24 w-4 items-end overflow-hidden rounded-full border border-border/30 bg-white/60 dark:bg-slate-800/60">
                      <div
                        className={`w-full rounded-full transition-all duration-300 ${
                          isSelected
                            ? "bg-[oklch(0.56_0.12_250)]"
                            : "bg-primary/45"
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>

                    <span
                      className={`text-[10px] font-bold ${
                        isSelected
                          ? "rounded-full bg-primary/10 px-1.5 py-0.5 font-black text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      {val.day.charAt(0)}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="flex flex-col gap-2.5 border-t border-border/40 pt-3">
              {demoEmpty ? (
                <div className="py-6 text-center text-xs font-bold text-muted-foreground/80">
                  No application details recorded
                </div>
              ) : (
                appStats.map((app, idx) => {
                  const strokeColors = [
                    "oklch(0.65 0.15 250)",
                    "oklch(0.68 0.14 170)",
                    "oklch(0.66 0.15 300)",
                    "oklch(0.60 0.10 120)",
                    "oklch(0.70 0.08 80)",
                    "oklch(0.62 0.12 25)",
                    "oklch(0.64 0.10 145)",
                  ]

                  const strokeColor = strokeColors[idx % strokeColors.length]
                  const sharePercent = Math.round(
                    (app.timeSpent / (effectiveTotalScreenTimeMinutes || 1)) *
                      100
                  )

                  // Circular Progress math: radius = 7, circumference = 2 * PI * 7 = 43.98
                  const circleCirc = 43.98
                  const strokeOffset = circleCirc * (1 - sharePercent / 100)

                  return (
                    <button
                      key={app.id}
                      onClick={() => setActiveAppDetailId(app.id)}
                      className="flex cursor-pointer items-center justify-between rounded-xl border border-border/30 bg-white/30 px-2.5 py-2 transition-all duration-200 active:scale-[0.98] dark:bg-slate-800/30"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-2.5">
                        {/* Circular ring next to each app item instead of linear line */}
                        <div className="relative flex h-6 w-6 shrink-0 items-center justify-center">
                          <svg className="h-full w-full -rotate-90">
                            <circle
                              cx="12"
                              cy="12"
                              r="7"
                              fill="none"
                              stroke="currentColor"
                              className="text-muted/10 dark:text-muted/5"
                              strokeWidth="2.5"
                            />
                            <circle
                              cx="12"
                              cy="12"
                              r="7"
                              fill="none"
                              stroke={strokeColor}
                              strokeWidth="2.5"
                              strokeDasharray={circleCirc}
                              strokeDashoffset={strokeOffset}
                              strokeLinecap="round"
                            />
                          </svg>

                          <span className="absolute text-[7px] font-black text-foreground/80">
                            {sharePercent}%
                          </span>
                        </div>

                        <span className="truncate text-xs font-bold text-foreground/80">
                          {app.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-extrabold text-muted-foreground">
                          {Math.floor(app.timeSpent / 60)}h {app.timeSpent % 60}
                          m
                        </span>

                        <CaretRightIcon
                          size={12}
                          className="text-muted-foreground/55"
                        />
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-gradient-to-tr from-white/60 to-purple-50/50 p-4.5 shadow-sm backdrop-blur-xl dark:from-slate-900/60 dark:to-purple-950/20">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                Notifications today
              </span>

              <h3 className="mt-1 font-heading text-2xl font-black text-foreground/90">
                {effectiveTotalNotifications}
              </h3>
            </div>

            <div className="flex h-28 w-full items-end justify-between px-2">
              {weeklyUsage.map((val) => {
                const h = demoEmpty ? 0 : (val.minutes / maxWeeklyMins) * 80
                return (
                  <div
                    key={val.day}
                    className="flex flex-1 flex-col items-center gap-1.5"
                  >
                    <div className="flex h-20 w-3.5 items-end overflow-hidden rounded-full border border-border/30 bg-white/60 dark:bg-slate-800/60">
                      <div
                        className="w-full rounded-full bg-[oklch(0.68_0.14_170)]"
                        style={{ height: `${h}%` }}
                      />
                    </div>

                    <span className="text-[9px] font-bold text-muted-foreground">
                      {val.day.charAt(0)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mb-4 flex flex-col gap-4 rounded-2xl border border-border bg-gradient-to-tr from-white/60 to-purple-50/50 p-4.5 shadow-sm backdrop-blur-xl dark:from-slate-900/60 dark:to-purple-950/20">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                Unlocks today
              </span>

              <h3 className="mt-1 font-heading text-2xl font-black text-foreground/90">
                {effectiveTotalPickups}
              </h3>
            </div>

            <div className="flex h-28 w-full items-end justify-between px-2">
              {weeklyUsage.map((val) => {
                const h = demoEmpty ? 0 : (val.minutes / maxWeeklyMins) * 90
                return (
                  <div
                    key={val.day}
                    className="flex flex-1 flex-col items-center gap-1.5"
                  >
                    <div className="flex h-20 w-3.5 items-end overflow-hidden rounded-full border border-border/30 bg-white/60 dark:bg-slate-800/60">
                      <div
                        className="w-full rounded-full bg-[oklch(0.66_0.15_300)]"
                        style={{ height: `${h}%` }}
                      />
                    </div>

                    <span className="text-[9px] font-bold text-muted-foreground">
                      {val.day.charAt(0)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )
    }

    // 3. SCREEN TIME GOAL DATE CELL HISTORY VIEW
    if (wellbeingSubPage === "goal") {
      const isOver = activeGoalDetail.status === "over"

      return (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <button
              onClick={handleGoToHome}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border/40 bg-white/40 text-foreground transition-colors active:scale-[0.95] dark:bg-slate-800/40"
            >
              <ArrowLeftIcon size={16} weight="bold" />
            </button>

            <h2 className="font-heading text-lg font-bold tracking-tight text-foreground/95">
              Screen time goal
            </h2>

            <div className="h-10 w-10 shrink-0" />
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-gradient-to-tr from-white/60 to-purple-50/50 p-4.5 shadow-sm backdrop-blur-xl dark:from-slate-900/60 dark:to-purple-950/20">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-extrabold text-foreground/90">
                30 May – 26 June
              </span>
            </div>

            <div className="grid grid-cols-7 gap-2.5 text-center text-[10px] font-black text-muted-foreground/60 uppercase">
              <span>S</span>
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
            </div>

            <div className="grid grid-cols-7 gap-2.5">
              {calendarDays.map((d) => {
                const isSelected = goalDetailDate === d.date
                const isToday = d.date === "26" && d.month === "June"

                return (
                  <button
                    key={`${d.month}_${d.date}`}
                    onClick={() => handleSelectGoalDate(d.date)}
                    className={`relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-all ${
                      isSelected ? "ring-2 ring-primary ring-offset-2" : ""
                    }`}
                  >
                    {d.status === "used" && (
                      <span className="absolute inset-0 rounded-full border-2 border-primary/90" />
                    )}
                    {d.status === "over" && (
                      <span className="absolute inset-0 rounded-full border-2 border-rose-500/90" />
                    )}
                    {d.status === "remaining" && (
                      <span className="absolute inset-0 rounded-full border-2 border-dashed border-muted/20" />
                    )}

                    <span
                      className={`relative z-10 text-[11px] font-extrabold ${
                        isToday
                          ? "rounded-full bg-primary/10 px-1.5 py-0.5 font-black text-primary"
                          : "text-foreground/90"
                      }`}
                    >
                      {d.date}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="mt-2 flex items-center justify-between px-1 text-[10px] font-bold text-muted-foreground/80">
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

          <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-gradient-to-tr from-white/60 to-purple-50/50 p-6 shadow-sm backdrop-blur-xl dark:from-slate-900/60 dark:to-purple-950/20">
            <h4 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
              {activeGoalDetail.date} June usage detail
            </h4>

            <div className="relative flex h-[90px] w-[180px] items-end justify-center overflow-hidden">
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
                  stroke={
                    isOver ? "oklch(0.58 0.10 25)" : "oklch(0.56 0.12 250)"
                  }
                  strokeWidth="10.5"
                  strokeLinecap="round"
                  strokeDasharray={semiCircumference}
                  strokeDashoffset={
                    semiCircumference *
                    (1 -
                      Math.min(
                        activeGoalDetail.used / activeGoalDetail.goal,
                        1
                      ))
                  }
                />
              </svg>

              <div className="flex flex-col items-center pb-2 text-center">
                {isOver ? (
                  <>
                    <span className="font-heading text-2xl font-black text-rose-500">
                      {Math.floor(
                        (activeGoalDetail.used - activeGoalDetail.goal) / 60
                      )}
                      h {(activeGoalDetail.used - activeGoalDetail.goal) % 60}m
                    </span>

                    <span className="mt-0.5 text-[9px] font-bold tracking-wider text-rose-400 uppercase">
                      Over goal
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-heading text-2xl font-black text-foreground/95">
                      {Math.floor(
                        (activeGoalDetail.goal - activeGoalDetail.used) / 60
                      )}
                      h {(activeGoalDetail.goal - activeGoalDetail.used) % 60}m
                    </span>

                    <span className="mt-0.5 text-[9px] font-bold tracking-wider text-muted-foreground uppercase">
                      Remaining
                    </span>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={handleOpenGoalPicker}
              className="h-10 cursor-pointer rounded-xl border border-border bg-secondary px-5 text-xs font-bold text-foreground/80 transition-all hover:bg-muted active:scale-95"
            >
              Goal {Math.floor(screenTimeGoal / 60)} h
            </button>
          </div>
        </div>
      )
    }

    // 4. WEEKLY REPORT SPLINE & HEATMAP VIEW
    if (wellbeingSubPage === "report") {
      return (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <button
              onClick={handleGoToHome}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border/40 bg-white/40 text-foreground transition-colors active:scale-[0.95] dark:bg-slate-800/40"
            >
              <ArrowLeftIcon size={16} weight="bold" />
            </button>

            <h2 className="font-heading text-lg font-bold tracking-tight text-foreground/95">
              Weekly report
            </h2>

            <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border/40 bg-white/40 text-foreground active:scale-[0.95] dark:bg-slate-800/40">
              <DotsThreeVerticalIcon size={20} weight="bold" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">
              14 June - 20 June (Week 25)
            </span>

            <div className="flex gap-1.5 select-none">
              {["W23", "W24", "W25"].map((w) => (
                <span
                  key={w}
                  className={`rounded-md px-2 py-0.5 text-[9.5px] font-black ${
                    w === "W25"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-white/40 text-muted-foreground dark:bg-slate-800/40"
                  }`}
                >
                  {w}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-gradient-to-tr from-white/60 to-purple-50/50 p-4.5 shadow-sm backdrop-blur-xl dark:from-slate-900/60 dark:to-purple-950/20">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                Screen time by week
              </span>

              <h3 className="mt-1 font-heading text-2xl font-black text-foreground/95">
                {demoEmpty ? "0m" : "6 h 16 m"}
              </h3>

              <p className="mt-0.5 text-[10px] font-semibold text-muted-foreground">
                Daily average screen time
              </p>
            </div>

            <div className="relative flex h-28 w-full items-end justify-between px-2 pt-2 select-none">
              <div className="absolute top-1/2 right-0 left-0 z-0 flex justify-end border-t border-dashed border-muted-foreground/30">
                <span className="-mt-2 bg-card px-1 text-[8px] font-bold text-muted-foreground">
                  Avg. 5h
                </span>
              </div>

              {weeklyUsage.map((val) => {
                const heightPercent = demoEmpty
                  ? 0
                  : (val.minutes / maxWeeklyMins) * 100
                const isOver = !demoEmpty && val.minutes > val.goalMinutes

                return (
                  <div
                    key={val.day}
                    className="relative z-10 flex flex-1 flex-col items-center gap-1.5"
                  >
                    <div className="relative flex h-20 w-3.5 items-end overflow-hidden rounded-full border border-border/30 bg-white/60 shadow-inner dark:bg-slate-800/60">
                      <div
                        className={`w-full rounded-full transition-all duration-300 ${
                          isOver ? "bg-rose-500" : "bg-emerald-500"
                        }`}
                        style={{
                          height: `${heightPercent}%`,
                          backgroundImage:
                            "repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.15) 3px, rgba(255,255,255,0.15) 6px)",
                        }}
                      />
                    </div>

                    <span className="text-[9px] font-extrabold text-muted-foreground">
                      {val.day.charAt(0)}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="flex items-center justify-between border-t border-border/40 pt-3 text-[10px] font-bold">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

                <span className="text-muted-foreground">Goal achieved:</span>

                <span className="font-extrabold text-foreground">
                  {demoEmpty ? "0 days" : "4 days"}
                </span>
              </div>
            </div>
          </div>

          {/* Redesigned awake screen ratio to be side-by-side circular radial rings (NO horizontal bars) */}
          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-gradient-to-tr from-white/60 to-purple-50/50 p-4.5 shadow-sm backdrop-blur-xl dark:from-slate-900/60 dark:to-purple-950/20">
            <h3 className="font-heading text-xs font-bold tracking-wider text-muted-foreground uppercase">
              Screen time balance
            </h3>

            <p className="text-[10px] leading-relaxed font-medium text-muted-foreground">
              On average each day while you were awake, you spent 6 h 52 m more
              not using your phone than using it.
            </p>

            {/* Redesigned progress: Side-by-side circular progress gauges */}
            <div className="grid grid-cols-2 gap-4 border-t border-b border-border/30 py-1.5">
              <div className="flex items-center gap-2.5 rounded-xl border border-border/30 bg-white/30 p-2.5 dark:bg-slate-800/30">
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center">
                  <svg className="h-full w-full -rotate-90">
                    <circle
                      cx="22"
                      cy="22"
                      r="16"
                      fill="none"
                      stroke="currentColor"
                      className="text-muted/10 dark:text-muted/5"
                      strokeWidth="4.5"
                    />
                    <circle
                      cx="22"
                      cy="22"
                      r="16"
                      fill="none"
                      stroke="oklch(0.56 0.12 250)"
                      strokeWidth="4.5"
                      strokeDasharray={2 * Math.PI * 16}
                      strokeDashoffset={
                        2 * Math.PI * 16 * (1 - (demoEmpty ? 0 : 0.33))
                      }
                      strokeLinecap="round"
                    />
                  </svg>

                  <span className="absolute text-[8px] font-black text-foreground">
                    {demoEmpty ? "0%" : "33%"}
                  </span>
                </div>

                <div>
                  <span className="block text-[9.5px] leading-none font-bold text-muted-foreground uppercase">
                    Screen On
                  </span>
                  <span className="mt-1 block text-xs font-black text-foreground/90">
                    {demoEmpty ? "0m" : "6 h 15 m"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-xl border border-border/30 bg-white/30 p-2.5 dark:bg-slate-800/30">
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center">
                  <svg className="h-full w-full -rotate-90">
                    <circle
                      cx="22"
                      cy="22"
                      r="16"
                      fill="none"
                      stroke="currentColor"
                      className="text-muted/10 dark:text-muted/5"
                      strokeWidth="4.5"
                    />
                    <circle
                      cx="22"
                      cy="22"
                      r="16"
                      fill="none"
                      stroke="oklch(0.68 0.14 170)"
                      strokeWidth="4.5"
                      strokeDasharray={2 * Math.PI * 16}
                      strokeDashoffset={
                        2 * Math.PI * 16 * (1 - (demoEmpty ? 0 : 0.67))
                      }
                      strokeLinecap="round"
                    />
                  </svg>

                  <span className="absolute text-[8px] font-black text-foreground">
                    {demoEmpty ? "0%" : "67%"}
                  </span>
                </div>

                <div>
                  <span className="block text-[9.5px] leading-none font-bold text-muted-foreground uppercase">
                    Screen Off
                  </span>
                  <span className="mt-1 block text-xs font-black text-foreground/90">
                    {demoEmpty ? "0m" : "13 h 7 m"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-gradient-to-tr from-white/60 to-purple-50/50 p-4.5 shadow-sm backdrop-blur-xl dark:from-slate-900/60 dark:to-purple-950/20">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                Top usage category changed
              </span>

              <h3 className="mt-1 font-heading text-2xl font-black text-foreground/95">
                {demoEmpty ? "None" : "Social"}
              </h3>

              <p className="mt-0.5 text-[10.5px] font-bold text-muted-foreground">
                {demoEmpty ? "0m" : "33 h 47 m"}
              </p>

              <p className="mt-1 text-[9.5px] font-medium text-muted-foreground/60">
                23 h 13 m used on average for previous 3 weeks
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {demoEmpty ? (
                <div className="py-2 text-center text-xs text-muted-foreground/75">
                  No data available
                </div>
              ) : (
                [
                  { id: "insta", name: "Instagram", val: "16 h 38 m" },
                  { id: "wa", name: "WhatsApp", val: "11 h 47 m" },
                  { id: "rd", name: "Reddit", val: "1 h 41 m" },
                ].map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between py-1 text-xs font-semibold"
                  >
                    <span className="text-foreground/90">{app.name}</span>

                    <span className="text-muted-foreground">{app.val}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mb-4 flex flex-col gap-4 rounded-2xl border border-border bg-gradient-to-tr from-white/60 to-purple-50/50 p-4.5 shadow-sm backdrop-blur-xl dark:from-slate-900/60 dark:to-purple-950/20">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                Peak usage times
              </span>

              <h3 className="mt-1 font-heading text-sm font-semibold tracking-tight text-foreground/90">
                Daily screen time pattern
              </h3>
            </div>

            <div className="flex flex-col gap-2.5 pt-2 select-none">
              {heatmapData.map((row) => (
                <div key={row.day} className="flex items-center gap-2">
                  <span className="w-3 text-center text-[10px] font-extrabold text-muted-foreground/75">
                    {row.day}
                  </span>

                  <div className="flex flex-1 justify-between gap-1">
                    {row.values.map((v, hIdx) => {
                      const colors = [
                        "bg-white/40 dark:bg-slate-800/40 border border-border/10",
                        "bg-primary/20",
                        "bg-primary/50",
                        "bg-primary/95",
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

            <div className="mt-1 flex items-center justify-between px-5 text-[8.5px] font-black text-muted-foreground/50">
              <span>0</span>
              <span>6</span>
              <span>12</span>
              <span>18</span>
              <span>24(h)</span>
            </div>
          </div>
        </div>
      )
    }

    // 5. SET APP TIMER VIEW
    if (wellbeingSubPage === "set-timer") {
      const activeTimerApp =
        appStats.find((a) => a.id === selectedTimerApp) || appStats[0]
      const handleSelectApp = (id: string) => setSelectedTimerApp(id)

      return (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-heading text-lg font-bold tracking-tight text-foreground/95">
              Set timer
            </h2>

            <div className="h-10 w-10 shrink-0" />
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-gradient-to-tr from-white/60 to-purple-50/50 p-4.5 shadow-sm backdrop-blur-xl dark:from-slate-900/60 dark:to-purple-950/20">
            <div className="flex flex-col gap-1.5">
              <span className="pl-1 text-[9.5px] font-bold tracking-wider text-muted-foreground uppercase">
                Apps and app categories
              </span>

              <div className="mb-1 flex scrollbar-none gap-2 overflow-x-auto pb-1">
                {appStats.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => handleSelectApp(app.id)}
                    className={`cursor-pointer rounded-xl border px-3 py-1.5 text-[10px] font-extrabold whitespace-nowrap transition-all ${
                      selectedTimerApp === app.id
                        ? "scale-[1.03] border-primary/20 bg-primary text-primary-foreground shadow-sm"
                        : "border-border/55 bg-white/40 text-muted-foreground hover:text-foreground active:scale-95 dark:bg-slate-800/40"
                    }`}
                  >
                    {app.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="pl-1 text-[9.5px] font-bold tracking-wider text-muted-foreground uppercase">
                App timer name
              </span>

              <div className="flex h-11 items-center justify-between rounded-xl border border-border bg-white/40 px-4 text-sm font-bold text-foreground dark:bg-slate-800/40">
                <span>{activeTimerApp.name} timer</span>

                <HourglassIcon size={16} className="text-primary" />
              </div>
            </div>

            <div className="mt-1 flex flex-col gap-1">
              <span className="pl-1 text-[9.5px] font-bold tracking-wider text-muted-foreground uppercase">
                App timer alerts
              </span>

              <p className="pl-1 text-xs font-semibold text-primary/80">
                1 minute, 5 minutes, 10 minutes before limit
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-gradient-to-tr from-white/60 to-purple-50/50 p-4.5 shadow-sm backdrop-blur-xl dark:from-slate-900/60 dark:to-purple-950/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-foreground/90">
                Timer duration
              </span>

              <span className="text-xs font-black text-primary">
                {wheelHours}h {wheelMinutes}m
              </span>
            </div>

            <div className="relative my-1 flex h-[120px] items-center justify-center gap-4 overflow-hidden rounded-xl border border-border/40 bg-white/35 py-4 dark:bg-slate-900/45">
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-9 bg-gradient-to-b from-card to-transparent" />

              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-9 bg-gradient-to-t from-card to-transparent" />

              <div className="flex h-24 flex-1 scrollbar-none flex-col items-center gap-2 overflow-y-auto">
                {[0, 1, 2, 3, 4, 5].map((h) => {
                  const isSelected = h === wheelHours
                  return (
                    <button
                      key={h}
                      onClick={() => setWheelHours(h)}
                      className={`text-sm font-bold transition-all ${
                        isSelected
                          ? "scale-125 font-black text-primary"
                          : "text-muted-foreground/60"
                      }`}
                    >
                      {h} h
                    </button>
                  )
                })}
              </div>

              <span className="text-xl font-bold text-muted-foreground/80">
                :
              </span>

              <div className="flex h-24 flex-1 scrollbar-none flex-col items-center gap-2 overflow-y-auto">
                {[0, 15, 30, 45].map((m) => {
                  const isSelected = m === wheelMinutes
                  return (
                    <button
                      key={m}
                      onClick={() => setWheelMinutes(m)}
                      className={`text-sm font-bold transition-all ${
                        isSelected
                          ? "scale-125 font-black text-primary"
                          : "text-muted-foreground/60"
                      }`}
                    >
                      {m} m
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center justify-between px-2 py-1 select-none">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
                <span
                  key={idx}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white/40 text-[10px] font-black text-foreground/80 shadow-sm dark:bg-slate-800/40"
                >
                  {day}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6 flex justify-center gap-3">
            <button
              onClick={handleGoToHome}
              className="h-11 cursor-pointer rounded-full border border-border bg-white/50 px-6 text-xs font-bold text-foreground/80 transition-all hover:bg-white/80 active:scale-95 dark:bg-slate-800/50 dark:hover:bg-slate-800/80"
            >
              Cancel
            </button>

            <button
              onClick={handleSaveTimer}
              className="h-11 cursor-pointer rounded-full bg-primary px-8 text-xs font-bold text-primary-foreground shadow-md transition-all active:scale-95"
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
    effectiveFormattedTotalScreenTime,
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
    effectiveTotalNotifications,
    effectiveTotalPickups,
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
    setActiveAppDetailId,
    demoEmpty,
  ])

  return (
    <section className="relative flex flex-col gap-5 select-none">
      {subPageContent}

      <AnimatePresence>
        {showGoalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[60] flex items-end justify-center rounded-[38px] bg-slate-950/85 backdrop-blur-md"
          >
            <motion.div
              initial={{ y: 150 }}
              animate={{ y: 0 }}
              exit={{ y: 150 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="flex w-full flex-col gap-4 rounded-t-2xl border-t border-border bg-card p-5 text-foreground shadow-xl"
            >
              <h3 className="text-center font-heading text-sm font-bold tracking-tight">
                Set screen time goal
              </h3>

              <div className="relative my-1 flex h-[100px] items-center justify-center gap-4 overflow-hidden rounded-xl border-t border-b border-border/40 bg-secondary/35 py-4">
                <div className="flex h-20 flex-1 scrollbar-none flex-col items-center gap-2 overflow-y-auto">
                  {[2, 3, 4, 5, 6, 7, 8].map((h) => {
                    const isSelected = h === Math.floor(tempGoalMins / 60)
                    return (
                      <button
                        key={h}
                        onClick={() => setTempGoalMins(h * 60)}
                        className={`cursor-pointer text-sm font-extrabold transition-all ${
                          isSelected
                            ? "scale-125 font-black text-primary"
                            : "text-muted-foreground/60"
                        }`}
                      >
                        {h} hours
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="mt-2 grid grid-cols-3 divide-x divide-border/60 border-t border-border/40 pt-4 text-center">
                <button
                  onClick={handleCloseGoalPicker}
                  className="cursor-pointer py-2.5 text-xs font-bold text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    setScreenTimeGoal(360)
                    setShowGoalModal(false)
                    addToast("Reset goal to default 6h", "info")
                  }}
                  className="hover:text-rose-650 cursor-pointer py-2.5 text-xs font-bold text-rose-500"
                >
                  Delete
                </button>

                <button
                  onClick={handleSaveGoal}
                  className="hover:text-primary-dark cursor-pointer py-2.5 text-xs font-black font-bold text-primary"
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

export default LayoutPersonalB
