import { useEffect, useState, useMemo } from 'react'

import { domainSchema } from '@/schemas/wellbeing'

import { useWellbeingStore } from '@/stores/useWellbeingStore'

import { useTheme } from '@/components/theme-provider'

export const useWellbeingLogic = () => {
  const { theme, setTheme } = useTheme()

  const activeLayout = useWellbeingStore((state) => state.activeLayout)
  const appStats = useWellbeingStore((state) => state.appStats)
  const categories = useWellbeingStore((state) => state.categories)
  const weeklyUsage = useWellbeingStore((state) => state.weeklyUsage)
  const childProfiles = useWellbeingStore((state) => state.childProfiles)
  const selectedChildId = useWellbeingStore((state) => state.selectedChildId)
  const blockerStats = useWellbeingStore((state) => state.blockerStats)
  const blockerToggles = useWellbeingStore((state) => state.blockerToggles)
  const blockerHistory = useWellbeingStore((state) => state.blockerHistory)
  const whitelist = useWellbeingStore((state) => state.whitelist)
  const blacklist = useWellbeingStore((state) => state.blacklist)

  const setActiveLayout = useWellbeingStore((state) => state.setActiveLayout)
  const updateAppLimit = useWellbeingStore((state) => state.updateAppLimit)
  const toggleAppLock = useWellbeingStore((state) => state.toggleAppLock)
  const updateChildLimit = useWellbeingStore((state) => state.updateChildLimit)
  const addChildWhitelist = useWellbeingStore((state) => state.addChildWhitelist)
  const removeChildWhitelist = useWellbeingStore((state) => state.removeChildWhitelist)
  const addChildBlacklist = useWellbeingStore((state) => state.addChildBlacklist)
  const removeChildBlacklist = useWellbeingStore((state) => state.removeChildBlacklist)
  const setSelectedChildId = useWellbeingStore((state) => state.setSelectedChildId)
  const toggleBlockerOption = useWellbeingStore((state) => state.toggleBlockerOption)
  const addWhitelistDomain = useWellbeingStore((state) => state.addWhitelistDomain)
  const removeWhitelistDomain = useWellbeingStore((state) => state.removeWhitelistDomain)
  const addBlacklistDomain = useWellbeingStore((state) => state.addBlacklistDomain)
  const removeBlacklistDomain = useWellbeingStore((state) => state.removeBlacklistDomain)
  const simulateActivityTick = useWellbeingStore((state) => state.simulateActivityTick)

  // Local state for Whitelist/Blacklist text inputs
  const defaultDomainInput = ''
  const [domainInput, setDomainInput] = useState(defaultDomainInput)
  const [domainError, setDomainError] = useState('')

  const [childDomainInput, setChildDomainInput] = useState(defaultDomainInput)
  const [childDomainError, setChildDomainError] = useState('')

  // 1. Calculate Personal Wellbeing metrics
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

  // Top 3 Apps
  const topApps = useMemo(() => {
    return [...appStats]
      .sort((a, b) => b.timeSpent - a.timeSpent)
      .slice(0, 3)
  }, [appStats])

  // Top 3 Categories
  const topCategories = useMemo(() => {
    return [...categories]
      .sort((a, b) => b.timeSpent - a.timeSpent)
      .slice(0, 3)
  }, [categories])

  // Weekly "Bests" (Day with the lowest usage)
  const weeklyBestDay = useMemo(() => {
    if (weeklyUsage.length === 0) return null
    return [...weeklyUsage].sort((a, b) => a.minutes - b.minutes)[0]
  }, [weeklyUsage])

  // Total pick ups count
  const totalPickups = useMemo(() => {
    return appStats.reduce((accumulator, app) => accumulator + app.pickups, 0)
  }, [appStats])

  // Total notification count
  const totalNotifications = useMemo(() => {
    return appStats.reduce((accumulator, app) => accumulator + app.notifications, 0)
  }, [appStats])

  // Active child profile data helper
  const activeChildProfile = useMemo(() => {
    return childProfiles.find((child) => child.id === selectedChildId) || childProfiles[0]
  }, [childProfiles, selectedChildId])

  // Total Child Screen Time Formatted
  const childScreenTimeFormatted = useMemo(() => {
    const timeSpent = activeChildProfile.timeSpentToday
    const hours = Math.floor(timeSpent / 60)
    const minutes = timeSpent % 60
    if (hours === 0) {
      return `${minutes}m`
    }
    return `${hours}h ${minutes}m`
  }, [activeChildProfile])

  // Adblocker saved data calculation details
  const formattedDataSaved = useMemo(() => {
    if (blockerStats.dataSavedMb < 1024) {
      return `${blockerStats.dataSavedMb.toFixed(1)} MB`
    }
    return `${(blockerStats.dataSavedMb / 1024).toFixed(2)} GB`
  }, [blockerStats])

  // Handlers with input validation
  const handleAddWhitelist = () => {
    const validationResult = domainSchema.safeParse({ domain: domainInput })
    if (!validationResult.success) {
      setDomainError(validationResult.error.issues[0].message)
      return
    }
    addWhitelistDomain(validationResult.data.domain)
    setDomainInput(defaultDomainInput)
    setDomainError('')
  }

  const handleAddBlacklist = () => {
    const validationResult = domainSchema.safeParse({ domain: domainInput })
    if (!validationResult.success) {
      setDomainError(validationResult.error.issues[0].message)
      return
    }
    addBlacklistDomain(validationResult.data.domain)
    setDomainInput(defaultDomainInput)
    setDomainError('')
  }

  const handleAddChildWhitelist = () => {
    const validationResult = domainSchema.safeParse({ domain: childDomainInput })
    if (!validationResult.success) {
      setChildDomainError(validationResult.error.issues[0].message)
      return
    }
    addChildWhitelist(selectedChildId, validationResult.data.domain)
    setChildDomainInput(defaultDomainInput)
    setChildDomainError('')
  }

  const handleAddChildBlacklist = () => {
    const validationResult = domainSchema.safeParse({ domain: childDomainInput })
    if (!validationResult.success) {
      setChildDomainError(validationResult.error.issues[0].message)
      return
    }
    addChildBlacklist(selectedChildId, validationResult.data.domain)
    setChildDomainInput(defaultDomainInput)
    setChildDomainError('')
  }

  // Periodic background simulation loop
  useEffect(() => {
    const interval = setInterval(() => {
      simulateActivityTick()
    }, 4500) // Ticks every 4.5 seconds

    return () => clearInterval(interval)
  }, [simulateActivityTick])

  return {
    // State
    activeLayout,
    activeTheme: theme,
    appStats,
    categories,
    weeklyUsage,
    childProfiles,
    selectedChildId,
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

    // Setters / Actions
    setDomainInput,
    setChildDomainInput,
    setActiveLayout,
    setActiveTheme: setTheme,
    updateAppLimit,
    toggleAppLock,
    updateChildLimit,
    removeChildWhitelist,
    removeChildBlacklist,
    setSelectedChildId,
    toggleBlockerOption,
    removeWhitelistDomain,
    removeBlacklistDomain,
    simulateActivityTick,

    // Custom handlers
    handleAddWhitelist,
    handleAddBlacklist,
    handleAddChildWhitelist,
    handleAddChildBlacklist
  }
}
