import { useState, useMemo, useCallback } from 'react'

import { motion, AnimatePresence } from 'framer-motion'

import { useWellbeingLogic } from '@/hooks/useWellbeingLogic'

import { 
  LockIcon, 
  HourglassIcon,
  ShieldWarningIcon,
  ArrowLeftIcon,
  SignOutIcon,
  GlobeIcon
} from '@phosphor-icons/react'

export const LayoutChild = () => {
  const {
    activeChildProfile,
    appStats,
    isChildAppLocked,
    getChildAppTimeSpent,
    childAppLimits,
    submitExtraTimeRequest,
    extraTimeRequests,
    selectedChildId,
    setActiveProfileMode,
    setActiveTab,
    addToast,
    updateChildLimit,
    setChildAppLimit
  } = useWellbeingLogic()

  const defaultLockedAppId = null
  const defaultEmptyState = false

  const [selectedLockedAppId, setSelectedLockedAppId] = useState<string | null>(defaultLockedAppId)
  const [showEmptyState, setShowEmptyState] = useState<boolean>(defaultEmptyState)

  const limitToday = activeChildProfile.timeSpentToday
  const maxLimitToday = activeChildProfile.weekdayLimitMinutes
  const timeRemaining = Math.max(maxLimitToday - limitToday, 0)
  
  const hoursRemaining = Math.floor(timeRemaining / 60)
  const minutesRemaining = timeRemaining % 60

  const childApps = useMemo(() => {
    return appStats.filter((app) => {
      if (selectedChildId === 'alex') {
        return ['minecraft', 'yt', 'insta'].includes(app.id)
      }
      return ['tiktok', 'yt', 'insta'].includes(app.id)
    })
  }, [appStats, selectedChildId])

  const selectedLockedApp = useMemo(() => {
    return appStats.find((a) => a.id === selectedLockedAppId) || null
  }, [appStats, selectedLockedAppId])

  const childLimits = useMemo(() => {
    return childAppLimits[selectedChildId] || {}
  }, [childAppLimits, selectedChildId])

  const appLimitVal = useMemo(() => {
    return selectedLockedApp ? childLimits[selectedLockedApp.id] || 60 : 60
  }, [selectedLockedApp, childLimits])

  const activePendingRequest = useMemo(() => {
    return extraTimeRequests.find(
      (r) => r.childId === selectedChildId && r.appId === selectedLockedAppId && r.status === 'pending'
    ) || null
  }, [extraTimeRequests, selectedChildId, selectedLockedAppId])

  const welcomeText = useMemo(() => {
    if (timeRemaining === 0) {
      return {
        emoji: '🛑',
        title: "Screen Time's Up",
        subtitle: "Your device is locked. Rest your eyes or request more time!"
      }
    }
    if (timeRemaining <= 60) {
      return {
        emoji: '⏰',
        title: "Almost Done",
        subtitle: `Only ${timeRemaining}m remaining today. Wrap up your active apps!`
      }
    }
    return {
      emoji: '🌟',
      title: "Hey there!",
      subtitle: `You have ${hoursRemaining > 0 ? `${hoursRemaining}h ` : ''}${minutesRemaining}m left today.`
    }
  }, [timeRemaining, hoursRemaining, minutesRemaining])

  const displayedApps = useMemo(() => {
    return showEmptyState ? [] : childApps
  }, [showEmptyState, childApps])

  const displayedWhitelist = useMemo(() => {
    return showEmptyState ? [] : activeChildProfile.whitelist
  }, [showEmptyState, activeChildProfile])

  const clockCardBg = useMemo(() => {
    if (selectedChildId === 'alex') {
      return 'bg-gradient-to-br from-sky-100/70 via-indigo-50/50 to-purple-100/60 dark:from-slate-900/90 dark:via-indigo-950/20 dark:to-slate-900/90 border-sky-100/20 dark:border-sky-900/10'
    }
    return 'bg-gradient-to-br from-orange-50/80 via-rose-50/50 to-amber-100/60 dark:from-slate-900/90 dark:via-rose-950/20 dark:to-slate-900/90 border-orange-100/20 dark:border-rose-950/10'
  }, [selectedChildId])

  const handleRequestTime = useCallback((minutes: number) => {
    if (!selectedLockedAppId) return
    submitExtraTimeRequest(selectedChildId, selectedLockedAppId, minutes)
    addToast(`Requested +${minutes}m for ${selectedLockedApp?.name}`, 'info')
  }, [selectedChildId, selectedLockedAppId, submitExtraTimeRequest, addToast, selectedLockedApp])

  const handleExitChildMode = useCallback(() => {
    setActiveProfileMode('parent')
    setActiveTab('profile')
    addToast('Returned to Parent Portal', 'info')
  }, [setActiveProfileMode, setActiveTab, addToast])

  const handleUnlockDeviceOverride = useCallback(() => {
    updateChildLimit(selectedChildId, 'weekday', activeChildProfile.weekdayLimitMinutes + 60)
    addToast('Device temporarily unlocked (+60m parent override)', 'success')
  }, [selectedChildId, activeChildProfile.weekdayLimitMinutes, updateChildLimit, addToast])

  const handleUnlockAppOverride = useCallback(() => {
    if (!selectedLockedAppId) return
    const currentAppLimit = childLimits[selectedLockedAppId] || 60
    setChildAppLimit(selectedChildId, selectedLockedAppId, currentAppLimit + 60)
    addToast(`Unlocked ${selectedLockedApp?.name} (+60m parent override)`, 'success')
    setSelectedLockedAppId(null)
  }, [selectedChildId, selectedLockedAppId, childLimits, setChildAppLimit, selectedLockedApp, addToast])

  const handleAppClick = useCallback((appId: string, isLocked: boolean) => () => {
    if (isLocked) {
      setSelectedLockedAppId(appId)
    }
  }, [])

  const handleRequestTimeClick = useCallback((minutes: number) => () => {
    handleRequestTime(minutes)
  }, [handleRequestTime])

  const handleCloseLockedAppModal = useCallback(() => {
    setSelectedLockedAppId(null)
  }, [])

  const handleToggleEmptyState = useCallback(() => {
    setShowEmptyState((prev) => !prev)
  }, [])

  const handleSiteClick = useCallback((siteName: string) => () => {
    addToast(`Launching safe browser: ${siteName}`, 'info')
  }, [addToast])

  const getAppEmoji = useCallback((appId: string) => {
    if (appId === 'minecraft') return '🎮'
    if (appId === 'yt') return '📺'
    if (appId === 'insta') return '📸'
    if (appId === 'tiktok') return '🎵'
    return '📱'
  }, [])

  const circleRadius = 50
  const strokeWidth = 8
  const circleLength = 2 * Math.PI * circleRadius
  const percentageUsed = Math.min(limitToday / maxLimitToday, 1)

  return (
    <section className="flex flex-col gap-4 relative h-full select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold shadow-sm" 
            style={{ backgroundColor: activeChildProfile.avatarColor }}
          >
            <span>{activeChildProfile.name.charAt(0)}</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              {selectedChildId === 'alex' ? '🚀 Space Cadet' : '🌸 Cozy Space'}
            </span>

            <h1 className="font-heading text-lg font-bold tracking-tight text-foreground/90">
              {activeChildProfile.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleEmptyState}
            className="px-2.5 py-1.5 text-[9px] font-bold rounded-lg bg-secondary/80 border border-border text-foreground/75 cursor-pointer uppercase tracking-wider active:scale-95 transition-transform"
          >
            <span>{showEmptyState ? 'Demo: Pinned' : 'Demo: Empty'}</span>
          </button>

          <button
            onClick={handleExitChildMode}
            className="h-9 w-9 flex items-center justify-center rounded-lg bg-secondary border border-border/80 text-foreground cursor-pointer active:scale-95 transition-transform"
            title="Exit Child Mode"
          >
            <SignOutIcon size={16} weight="bold" />
          </button>
        </div>
      </div>

      <div className={`flex flex-col items-center justify-center rounded-2xl p-5 border shadow-[0_8px_30px_rgb(0,0,0,0.02)] backdrop-blur-xl ${clockCardBg}`}>
        <div className="flex items-start gap-4.5 w-full">
          <div className="relative h-[115px] w-[115px] shrink-0">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
              <defs>
                <linearGradient id="alexCircleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>

                <linearGradient id="lilyCircleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>

              <circle 
                cx="60" 
                cy="60" 
                r={circleRadius} 
                fill="none" 
                stroke="currentColor" 
                className="text-muted/10 dark:text-white/5" 
                strokeWidth={strokeWidth} 
              />

              <motion.circle
                cx="60"
                cy="60"
                r={circleRadius}
                fill="none"
                stroke={timeRemaining === 0 ? 'oklch(0.60 0.12 25)' : `url(#${selectedChildId === 'alex' ? 'alexCircleGrad' : 'lilyCircleGrad'})`}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circleLength}
                initial={{ strokeDashoffset: circleLength }}
                animate={{ strokeDashoffset: circleLength * (1 - percentageUsed) }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              {timeRemaining > 0 ? (
                <div className="flex flex-col items-center">
                  <span className="font-heading text-2xl font-extrabold tracking-tight text-foreground/90">
                    {hoursRemaining > 0 ? `${hoursRemaining}h ` : ''}{minutesRemaining}m
                  </span>

                  <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
                    Left Today
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="font-heading text-base font-extrabold text-rose-500 tracking-tight">
                    Time's Up
                  </span>

                  <span className="text-[8px] font-bold text-rose-400 uppercase tracking-wider mt-0.5">
                    Locked
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center min-h-[115px]">
            <span className="text-2xl block mb-1">
              {welcomeText.emoji}
            </span>

            <span className="text-xs font-extrabold text-foreground/90 block">
              {welcomeText.title}
            </span>

            <p className="text-[10px] text-muted-foreground/80 mt-1 leading-relaxed">
              {welcomeText.subtitle}
            </p>

            {timeRemaining === 0 && (
              <button
                onClick={handleUnlockDeviceOverride}
                className="mt-3 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-[9px] font-bold self-start cursor-pointer active:scale-95 transition-transform shadow-sm"
              >
                <span>Bypass: Add 1 hr</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-card p-4 border border-border flex flex-col gap-3.5 shadow-sm">
        <span className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Apps allowance
        </span>

        {displayedApps.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center rounded-xl bg-secondary/20 border border-dashed border-border/80">
            <span className="text-2xl mb-1.5">🌟</span>

            <span className="text-xs font-bold text-foreground/80 block">
              All Apps Available
            </span>

            <p className="text-[10px] text-muted-foreground mt-1 max-w-[200px]">
              Your parents haven't set any app limits for today. Feel free to explore!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {displayedApps.map((app) => {
              const isLocked = isChildAppLocked(selectedChildId, app.id)
              const appLimit = childLimits[app.id] || 60
              const appTime = getChildAppTimeSpent(selectedChildId, app.id)
              const remainingMins = Math.max(appLimit - appTime, 0)
              const usePercentage = Math.min(appTime / appLimit, 1)

              let appCardBg = 'from-amber-50/90 via-orange-50/60 to-amber-50/80 dark:from-amber-950/20 dark:via-slate-900/40 dark:to-slate-950/30 border-amber-100/20 dark:border-amber-900/10'
              let appAccentColor = '#f59e0b'
              
              if (app.id === 'minecraft') {
                appCardBg = 'from-emerald-50/90 via-green-50/60 to-emerald-50/80 dark:from-emerald-950/20 dark:via-slate-900/40 dark:to-slate-950/30 border-emerald-100/20 dark:border-emerald-950/10'
                appAccentColor = '#10b981'
              } else if (app.id === 'yt') {
                appCardBg = 'from-rose-50/90 via-red-50/60 to-rose-50/80 dark:from-rose-950/20 dark:via-slate-900/40 dark:to-slate-950/30 border-rose-100/20 dark:border-rose-950/10'
                appAccentColor = '#f43f5e'
              } else if (app.id === 'insta') {
                appCardBg = 'from-purple-50/90 via-pink-50/60 to-rose-50/80 dark:from-purple-950/20 dark:via-slate-900/40 dark:to-slate-950/30 border-purple-100/20 dark:border-purple-950/10'
                appAccentColor = '#ec4899'
              } else if (app.id === 'tiktok') {
                appCardBg = 'from-sky-50/90 via-teal-50/60 to-emerald-50/80 dark:from-sky-950/20 dark:via-slate-900/40 dark:to-slate-950/30 border-sky-100/20 dark:border-sky-950/10'
                appAccentColor = '#06b6d4'
              }

              return (
                <div 
                  key={app.id} 
                  className={`p-3.5 rounded-xl bg-gradient-to-br border flex flex-col justify-between cursor-pointer active:scale-[0.98] transition-transform shadow-[0_4px_16px_rgba(0,0,0,0.01)] ${appCardBg}`}
                  onClick={handleAppClick(app.id, isLocked)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl leading-none">
                        {getAppEmoji(app.id)}
                      </span>

                      <div>
                        <span className="text-xs font-bold text-foreground/90 block">
                          {app.name}
                        </span>

                        <span className="text-[9px] font-semibold text-muted-foreground">
                          Used: {appTime}m / {appLimit}m
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center">
                      {isLocked ? (
                        <span className="text-[9px] font-bold text-rose-500 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full">
                          Locked
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          {remainingMins}m left
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-1.5 mt-3 w-full">
                    {[0, 1, 2, 3].map((step) => {
                      const isFilled = usePercentage > (step / 4)
                      return (
                        <div 
                          key={step} 
                          className="h-1.5 flex-1 rounded-full transition-colors duration-200"
                          style={{ 
                            backgroundColor: isFilled 
                              ? (isLocked ? 'oklch(0.60 0.12 25)' : appAccentColor) 
                              : 'var(--secondary)'
                          }}
                        />
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-card p-4 border border-border flex flex-col gap-3.5 shadow-sm">
        <span className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Approved websites
        </span>

        {displayedWhitelist.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center rounded-xl bg-secondary/20 border border-dashed border-border/80">
            <span className="text-2xl mb-1.5">🌐</span>

            <span className="text-xs font-bold text-foreground/80 block">
              General Web Access
            </span>

            <p className="text-[10px] text-muted-foreground mt-1 max-w-[200px]">
              No specific educational sites are restricted or pinned. Ask your parents to add links here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            {displayedWhitelist.map((site) => {
              const siteName = site.replace('.org', '').replace('.com', '').replace('.edu', '')
              const capitalizedName = siteName.charAt(0).toUpperCase() + siteName.slice(1)

              return (
                <div 
                  key={site}
                  className="p-3 rounded-xl bg-gradient-to-br from-teal-50/70 via-emerald-50/50 to-teal-50/60 dark:from-slate-900/80 dark:to-emerald-950/10 border border-teal-100/10 dark:border-emerald-950/5 flex items-center gap-2.5 cursor-pointer active:scale-[0.97] transition-transform shadow-sm"
                  onClick={handleSiteClick(site)}
                >
                  <div className="h-7.5 w-7.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 border border-teal-200/20">
                    <GlobeIcon size={14} weight="bold" />
                  </div>

                  <div className="min-w-0">
                    <span className="text-[10.5px] font-extrabold text-foreground/90 block truncate">
                      {capitalizedName}
                    </span>

                    <span className="text-[8px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider block mt-0.5">
                      Safe Link
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedLockedAppId && selectedLockedApp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 rounded-[38px] bg-slate-950/90 text-white flex flex-col items-center justify-center p-6 text-center backdrop-blur-xl overflow-hidden"
          >
            <div className="absolute top-1/4 left-1/4 h-36 w-36 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

            <div className="absolute bottom-1/4 right-1/4 h-36 w-36 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="flex flex-col items-center gap-5 w-full relative z-10"
            >
              <div className="flex h-15 w-15 items-center justify-center rounded-full bg-gradient-to-tr from-rose-500/20 to-orange-500/20 border border-rose-500/30 text-rose-500 shadow-lg shadow-rose-500/10 animate-bounce">
                <LockIcon size={26} weight="fill" />
              </div>

              <div>
                <h2 className="font-heading text-base font-bold tracking-tight text-white/95">
                  Time's Up for {selectedLockedApp.name}
                </h2>

                <p className="text-[10px] text-slate-400 mt-1.5 max-w-[220px] mx-auto leading-relaxed">
                  You have reached your daily limit of <span className="text-rose-400 font-bold">{appLimitVal} minutes</span> set by your parents.
                </p>
              </div>

              <div className="w-full max-w-[240px] rounded-xl bg-white/5 border border-white/10 p-4 flex flex-col gap-3">
                {activePendingRequest ? (
                  <div className="flex items-start gap-2.5 text-left text-[10px] text-amber-400 leading-relaxed">
                    <HourglassIcon size={14} className="shrink-0 mt-0.5" />

                    <div>
                      <span className="font-bold text-white block">
                        Request Pending Approval
                      </span>
                      Requested +{activePendingRequest.minutesRequested} mins allowance. Waiting for parental response...
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start gap-2 text-left text-[10px] text-slate-300 leading-relaxed">
                      <ShieldWarningIcon size={14} className="text-rose-400 shrink-0 mt-0.5" />

                      <div>
                        <span className="font-bold text-white block">
                          Request Extra Screen Time
                        </span>
                        Submit a request to extend this app's allowance for today.
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-1">
                      <button
                        onClick={handleRequestTimeClick(15)}
                        className="py-2 px-0.5 rounded-lg bg-white/10 border border-white/10 text-[9px] font-bold cursor-pointer active:scale-95 transition-transform"
                      >
                        <span>+15 min</span>
                      </button>

                      <button
                        onClick={handleRequestTimeClick(30)}
                        className="py-2 px-0.5 rounded-lg bg-white/10 border border-white/10 text-[9px] font-bold cursor-pointer active:scale-95 transition-transform"
                      >
                        <span>+30 min</span>
                      </button>

                      <button
                        onClick={handleRequestTimeClick(60)}
                        className="py-2 px-0.5 rounded-lg bg-white/10 border border-white/10 text-[9px] font-bold cursor-pointer active:scale-95 transition-transform"
                      >
                        <span>+1 hour</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 w-full max-w-[240px] mt-2">
                <button
                  onClick={handleCloseLockedAppModal}
                  className="flex-1 h-9.5 rounded-lg bg-white/15 border border-white/10 text-white text-[10px] font-bold shadow-sm transition-opacity active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeftIcon size={12} weight="bold" />

                  <span>Go Back</span>
                </button>

                <button
                  onClick={handleUnlockAppOverride}
                  className="flex-1 h-9.5 rounded-lg bg-white text-slate-950 text-[10px] font-bold shadow-sm transition-opacity active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LockIcon size={12} weight="fill" />

                  <span>Parent Bypass</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default LayoutChild
