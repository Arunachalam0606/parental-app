import { useEffect, useState, useMemo } from "react"

import { domainSchema } from "@/schemas/wellbeing"

import { useWellbeingStore } from "@/stores/useWellbeingStore"

import { useTheme } from "@/components/theme-provider"

export const useWellbeingLogic = () => {
  const { theme, setTheme } = useTheme()

  // Zustand State
  const activeTab = useWellbeingStore((state) => state.activeTab)
  const activeProfileMode = useWellbeingStore(
    (state) => state.activeProfileMode
  )
  const activeAppDetailId = useWellbeingStore(
    (state) => state.activeAppDetailId
  )
  const appStats = useWellbeingStore((state) => state.appStats)
  const categories = useWellbeingStore((state) => state.categories)
  const weeklyUsage = useWellbeingStore((state) => state.weeklyUsage)
  const childProfiles = useWellbeingStore((state) => state.childProfiles)
  const selectedChildId = useWellbeingStore((state) => state.selectedChildId)
  const childAppLimits = useWellbeingStore((state) => state.childAppLimits)
  const childManualLocks = useWellbeingStore((state) => state.childManualLocks)
  const extraTimeRequests = useWellbeingStore(
    (state) => state.extraTimeRequests
  )
  const toasts = useWellbeingStore((state) => state.toasts)
  const blockerStats = useWellbeingStore((state) => state.blockerStats)
  const blockerToggles = useWellbeingStore((state) => state.blockerToggles)
  const blockerHistory = useWellbeingStore((state) => state.blockerHistory)
  const whitelist = useWellbeingStore((state) => state.whitelist)
  const blacklist = useWellbeingStore((state) => state.blacklist)
  const wellbeingSubPage = useWellbeingStore((state) => state.wellbeingSubPage)
  const selectedDate = useWellbeingStore((state) => state.selectedDate)
  const dashboardViewMode = useWellbeingStore(
    (state) => state.dashboardViewMode
  )
  const goalDetailDate = useWellbeingStore((state) => state.goalDetailDate)
  const screenTimeGoal = useWellbeingStore((state) => state.screenTimeGoal)
  const timerAppId = useWellbeingStore((state) => state.timerAppId)
  const timerDuration = useWellbeingStore((state) => state.timerDuration)
  const layoutMode = useWellbeingStore((state) => state.layoutMode)
  const demoEmpty = useWellbeingStore((state) => state.demoEmpty)

  // Zustand Actions
  const setActiveTab = useWellbeingStore((state) => state.setActiveTab)
  const setActiveProfileMode = useWellbeingStore(
    (state) => state.setActiveProfileMode
  )
  const setActiveAppDetailId = useWellbeingStore(
    (state) => state.setActiveAppDetailId
  )
  const updateAppLimit = useWellbeingStore((state) => state.updateAppLimit)
  const togglePersonalManualLock = useWellbeingStore(
    (state) => state.togglePersonalManualLock
  )
  const updateChildLimit = useWellbeingStore((state) => state.updateChildLimit)
  const setChildAppLimit = useWellbeingStore((state) => state.setChildAppLimit)
  const toggleChildManualLock = useWellbeingStore(
    (state) => state.toggleChildManualLock
  )
  const submitExtraTimeRequest = useWellbeingStore(
    (state) => state.submitExtraTimeRequest
  )
  const handleExtraTimeRequest = useWellbeingStore(
    (state) => state.handleExtraTimeRequest
  )
  const addChildWhitelist = useWellbeingStore(
    (state) => state.addChildWhitelist
  )
  const removeChildWhitelist = useWellbeingStore(
    (state) => state.removeChildWhitelist
  )
  const addChildBlacklist = useWellbeingStore(
    (state) => state.addChildBlacklist
  )
  const removeChildBlacklist = useWellbeingStore(
    (state) => state.removeChildBlacklist
  )
  const setSelectedChildId = useWellbeingStore(
    (state) => state.setSelectedChildId
  )
  const addChildProfile = useWellbeingStore((state) => state.addChildProfile)
  const toggleBlockerOption = useWellbeingStore(
    (state) => state.toggleBlockerOption
  )
  const addWhitelistDomain = useWellbeingStore(
    (state) => state.addWhitelistDomain
  )
  const removeWhitelistDomain = useWellbeingStore(
    (state) => state.removeWhitelistDomain
  )
  const addBlacklistDomain = useWellbeingStore(
    (state) => state.addBlacklistDomain
  )
  const removeBlacklistDomain = useWellbeingStore(
    (state) => state.removeBlacklistDomain
  )
  const removeToast = useWellbeingStore((state) => state.removeToast)
  const addToast = useWellbeingStore((state) => state.addToast)
  const reset = useWellbeingStore((state) => state.reset)
  const simulateActivityTick = useWellbeingStore(
    (state) => state.simulateActivityTick
  )
  const setWellbeingSubPage = useWellbeingStore(
    (state) => state.setWellbeingSubPage
  )
  const setSelectedDate = useWellbeingStore((state) => state.setSelectedDate)
  const setDashboardViewMode = useWellbeingStore(
    (state) => state.setDashboardViewMode
  )
  const setGoalDetailDate = useWellbeingStore(
    (state) => state.setGoalDetailDate
  )
  const setScreenTimeGoal = useWellbeingStore(
    (state) => state.setScreenTimeGoal
  )
  const setTimerAppId = useWellbeingStore((state) => state.setTimerAppId)
  const setTimerDuration = useWellbeingStore((state) => state.setTimerDuration)
  const setLayoutMode = useWellbeingStore((state) => state.setLayoutMode)
  const setDemoEmpty = useWellbeingStore((state) => state.setDemoEmpty)

  // Local inputs
  const defaultDomainInput = ""
  const [domainInput, setDomainInput] = useState(defaultDomainInput)
  const [domainError, setDomainError] = useState("")

  const [childDomainInput, setChildDomainInput] = useState(defaultDomainInput)
  const [childDomainError, setChildDomainError] = useState("")

  // 1. Calculated Personal metrics
  const totalScreenTimeMinutes = useMemo(() => {
    return appStats.reduce((accumulator, app) => accumulator + app.timeSpent, 0)
  }, [appStats])

  const formattedTotalScreenTime = useMemo(() => {
    const hours = Math.floor(totalScreenTimeMinutes / 60)
    const minutes = totalScreenTimeMinutes % 60
    if (hours === 0) {
      return `${minutes}m`
    }
    return `${hours}h ${minutes}m`
  }, [totalScreenTimeMinutes])

  const topApps = useMemo(() => {
    return [...appStats].sort((a, b) => b.timeSpent - a.timeSpent).slice(0, 3)
  }, [appStats])

  const topCategories = useMemo(() => {
    return [...categories].sort((a, b) => b.timeSpent - a.timeSpent).slice(0, 3)
  }, [categories])

  const weeklyBestDay = useMemo(() => {
    if (weeklyUsage.length === 0) return null
    return [...weeklyUsage].sort((a, b) => a.minutes - b.minutes)[0]
  }, [weeklyUsage])

  const totalPickups = useMemo(() => {
    return appStats.reduce((accumulator, app) => accumulator + app.pickups, 0)
  }, [appStats])

  const totalNotifications = useMemo(() => {
    return appStats.reduce(
      (accumulator, app) => accumulator + app.notifications,
      0
    )
  }, [appStats])

  // Selected child profile helper
  const activeChildProfile = useMemo(() => {
    return (
      childProfiles.find((child) => child.id === selectedChildId) ||
      childProfiles[0]
    )
  }, [childProfiles, selectedChildId])

  const childScreenTimeFormatted = useMemo(() => {
    const timeSpent = activeChildProfile.timeSpentToday
    const hours = Math.floor(timeSpent / 60)
    const minutes = timeSpent % 60
    if (hours === 0) {
      return `${minutes}m`
    }
    return `${hours}h ${minutes}m`
  }, [activeChildProfile])

  const formattedDataSaved = useMemo(() => {
    if (blockerStats.dataSavedMb < 1024) {
      return `${blockerStats.dataSavedMb.toFixed(1)} MB`
    }
    return `${(blockerStats.dataSavedMb / 1024).toFixed(2)} GB`
  }, [blockerStats])

  // Get active App details
  const activeAppDetail = useMemo(() => {
    if (!activeAppDetailId) return null
    return appStats.find((app) => app.id === activeAppDetailId) || null
  }, [appStats, activeAppDetailId])

  // Helper: Child app specific time spent simulation
  const getChildAppTimeSpent = (childId: string, appId: string): number => {
    // Distribute time spent proportionally based on profile total time spent
    const baseProfile = childProfiles.find((c) => c.id === childId)
    if (!baseProfile) return 0

    const totalTime = baseProfile.timeSpentToday
    if (childId === "alex") {
      if (appId === "minecraft")
        return Math.min(Math.round(totalTime * 0.7), 60)
      if (appId === "yt") return Math.min(Math.round(totalTime * 0.25), 35)
      return Math.round(totalTime * 0.05)
    } else {
      // Lily
      if (appId === "tiktok") return Math.min(Math.round(totalTime * 0.45), 75)
      if (appId === "yt") return Math.min(Math.round(totalTime * 0.3), 50)
      if (appId === "insta") return Math.min(Math.round(totalTime * 0.2), 40)
      return Math.round(totalTime * 0.05)
    }
  }

  // Helper: check if a child's app is locked
  const isChildAppLocked = (childId: string, appId: string): boolean => {
    // 1. Check parent manual override
    const locks = childManualLocks[childId] || []
    if (locks.includes(appId)) return true

    // 2. Check daily app limit duration
    const limits = childAppLimits[childId] || {}
    if (limits[appId] !== undefined) {
      const timeSpent = getChildAppTimeSpent(childId, appId)
      if (timeSpent >= limits[appId]) return true
    }

    return false
  }

  // Handlers
  const handleAddWhitelist = () => {
    const validationResult = domainSchema.safeParse({ domain: domainInput })
    if (!validationResult.success) {
      setDomainError(validationResult.error.issues[0].message)
      return
    }
    addWhitelistDomain(validationResult.data.domain)
    setDomainInput(defaultDomainInput)
    setDomainError("")
  }

  const handleAddBlacklist = () => {
    const validationResult = domainSchema.safeParse({ domain: domainInput })
    if (!validationResult.success) {
      setDomainError(validationResult.error.issues[0].message)
      return
    }
    addBlacklistDomain(validationResult.data.domain)
    setDomainInput(defaultDomainInput)
    setDomainError("")
  }

  const handleAddChildWhitelist = () => {
    const validationResult = domainSchema.safeParse({
      domain: childDomainInput,
    })
    if (!validationResult.success) {
      setChildDomainError(validationResult.error.issues[0].message)
      return
    }
    addChildWhitelist(selectedChildId, validationResult.data.domain)
    setChildDomainInput(defaultDomainInput)
    setChildDomainError("")
  }

  const handleAddChildBlacklist = () => {
    const validationResult = domainSchema.safeParse({
      domain: childDomainInput,
    })
    if (!validationResult.success) {
      setChildDomainError(validationResult.error.issues[0].message)
      return
    }
    addChildBlacklist(selectedChildId, validationResult.data.domain)
    setChildDomainInput(defaultDomainInput)
    setChildDomainError("")
  }

  // Ticking effect loop
  useEffect(() => {
    const interval = setInterval(() => {
      simulateActivityTick()
    }, 4500)

    return () => clearInterval(interval)
  }, [simulateActivityTick])

  // Setup theme in root document element
  useEffect(() => {
    const rootElement = document.documentElement
    rootElement.classList.remove("light", "dark")
    rootElement.classList.add(theme)
  }, [theme])

  return {
    // State
    activeTab,
    activeProfileMode,
    activeAppDetailId,
    activeTheme: theme,
    appStats,
    categories,
    weeklyUsage,
    childProfiles,
    selectedChildId,
    childAppLimits,
    childManualLocks,
    extraTimeRequests,
    toasts,
    blockerStats,
    blockerToggles,
    blockerHistory,
    whitelist,
    blacklist,
    domainInput,
    domainError,
    childDomainInput,
    childDomainError,
    activeChildProfile,
    activeAppDetail,
    wellbeingSubPage,
    selectedDate,
    dashboardViewMode,
    goalDetailDate,
    screenTimeGoal,
    timerAppId,
    timerDuration,
    layoutMode,
    demoEmpty,

    // Calculated fields
    totalScreenTimeMinutes,
    formattedTotalScreenTime,
    topApps,
    topCategories,
    weeklyBestDay,
    totalPickups,
    totalNotifications,
    childScreenTimeFormatted,
    formattedDataSaved,

    // Helper functions
    getChildAppTimeSpent,
    isChildAppLocked,

    // Setters / Actions
    setDomainInput,
    setChildDomainInput,
    setActiveTab,
    setActiveProfileMode,
    setActiveAppDetailId,
    setActiveTheme: setTheme,
    updateAppLimit,
    togglePersonalManualLock,
    updateChildLimit,
    setChildAppLimit,
    toggleChildManualLock,
    submitExtraTimeRequest,
    handleExtraTimeRequest,
    removeChildWhitelist,
    removeChildBlacklist,
    setSelectedChildId,
    addChildProfile,
    toggleBlockerOption,
    removeWhitelistDomain,
    removeBlacklistDomain,
    removeToast,
    addToast,
    reset,
    simulateActivityTick,
    setWellbeingSubPage,
    setSelectedDate,
    setDashboardViewMode,
    setGoalDetailDate,
    setScreenTimeGoal,
    setTimerAppId,
    setTimerDuration,
    setLayoutMode,
    setDemoEmpty,

    // Custom handlers
    handleAddWhitelist,
    handleAddBlacklist,
    handleAddChildWhitelist,
    handleAddChildBlacklist,
  }
}
