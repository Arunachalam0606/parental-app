import { useState, useMemo } from 'react'

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

  const handleRequestTime = (minutes: number) => {
    if (!selectedLockedAppId) return
    submitExtraTimeRequest(selectedChildId, selectedLockedAppId, minutes)
    addToast(`Requested +${minutes}m for ${selectedLockedApp?.name}`, 'info')
  }

  const handleExitChildMode = () => {
    setActiveProfileMode('parent')
    setActiveTab('profile')
    addToast('Returned to Parent Portal', 'info')
  }

  const handleUnlockDeviceOverride = () => {
    updateChildLimit(selectedChildId, 'weekday', activeChildProfile.weekdayLimitMinutes + 60)
    addToast('Device temporarily unlocked (+60m parent override)', 'success')
  }

  const handleUnlockAppOverride = () => {
    if (!selectedLockedAppId) return
    const currentAppLimit = childLimits[selectedLockedAppId] || 60
    setChildAppLimit(selectedChildId, selectedLockedAppId, currentAppLimit + 60)
    addToast(`Unlocked ${selectedLockedApp?.name} (+60m parent override)`, 'success')
    setSelectedLockedAppId(null)
  }

  const handleAppClick = (appId: string, isLocked: boolean) => () => {
    if (isLocked) {
      setSelectedLockedAppId(appId)
    }
  }

  const handleRequestTimeClick = (minutes: number) => () => {
    handleRequestTime(minutes)
  }

  const handleCloseLockedAppModal = () => {
    setSelectedLockedAppId(null)
  }

  const handleToggleEmptyState = () => {
    setShowEmptyState((prev) => !prev)
  }

  const handleSiteClick = (siteName: string) => () => {
    addToast(`Launching safe browser: ${siteName}`, 'info')
  }

  const getAppEmoji = (appId: string) => {
    if (appId === 'minecraft') return '🎮'
    if (appId === 'yt') return '📺'
    if (appId === 'insta') return '📸'
    if (appId === 'tiktok') return '🎵'
    return '📱'
  }

  const headerElement = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div 
          className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold" 
          style={{ backgroundColor: activeChildProfile.avatarColor }}
        >
          <span>{activeChildProfile.name.charAt(0)}</span>
        </div>

        <div>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
            Child Space
          </span>

          <h1 className="font-heading text-lg font-bold tracking-tight text-foreground/90">
            {activeChildProfile.name}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleToggleEmptyState}
          className="px-2.5 py-1.5 text-[9px] font-bold rounded-lg bg-secondary/80 border border-border text-foreground/75 cursor-pointer uppercase tracking-wider active:scale-95"
        >
          <span>{showEmptyState ? 'Demo: Pinned' : 'Demo: Empty'}</span>
        </button>

        <button
          onClick={handleExitChildMode}
          className="h-9 w-9 flex items-center justify-center rounded-lg bg-secondary border border-border/80 text-foreground cursor-pointer active:scale-95"
          title="Exit Child Mode"
        >
          <SignOutIcon size={16} weight="bold" />
        </button>
      </div>
    </div>
  )

  const circleRadius = 50
  const strokeWidth = 8
  const circleLength = 2 * Math.PI * circleRadius
  const percentageUsed = Math.min(limitToday / maxLimitToday, 1)

  const clockWidget = (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-card p-4.5 border border-border">
      <div className="flex items-start gap-4 w-full">
        <div className="relative h-[120px] w-[120px] shrink-0">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
            <circle 
              cx="60" 
              cy="60" 
              r={circleRadius} 
              fill="none" 
              stroke="currentColor" 
              className="text-muted/10" 
              strokeWidth={strokeWidth} 
            />

            <motion.circle
              cx="60"
              cy="60"
              r={circleRadius}
              fill="none"
              stroke={timeRemaining === 0 ? 'oklch(0.60 0.12 25)' : activeChildProfile.avatarColor}
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
                  Remaining
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <span className="font-heading text-lg font-extrabold text-rose-500 tracking-tight">
                  Time's Up
                </span>

                <span className="text-[8px] font-bold text-rose-400 uppercase tracking-wider mt-0.5">
                  Locked
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center min-h-[120px]">
          <span className="text-2xl block mb-1">
            {welcomeText.emoji}
          </span>

          <span className="text-sm font-bold text-foreground/90 block">
            {welcomeText.title}
          </span>

          <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
            {welcomeText.subtitle}
          </p>

          {timeRemaining === 0 && (
            <button
              onClick={handleUnlockDeviceOverride}
              className="mt-3.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-[10px] font-bold self-start cursor-pointer active:scale-95 shadow-sm"
            >
              <span>Parent Override: Unlock</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )

  const appsSection = (
    <div className="rounded-2xl bg-card p-4 border border-border flex flex-col gap-3">
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
        <div className="flex flex-col gap-2.5">
          {displayedApps.map((app) => {
            const isLocked = isChildAppLocked(selectedChildId, app.id)
            const appLimit = childLimits[app.id] || 60
            const appTime = getChildAppTimeSpent(selectedChildId, app.id)
            const remainingMins = Math.max(appLimit - appTime, 0)
            const usePercentage = Math.min(appTime / appLimit, 1)

            return (
              <div 
                key={app.id} 
                className="p-3 rounded-xl bg-secondary/35 border border-border/30 flex flex-col justify-between cursor-pointer active:scale-[0.98] transition-transform"
                onClick={handleAppClick(app.id, isLocked)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg leading-none">
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

                <div className="flex gap-1 mt-2.5 w-full">
                  {[0, 1, 2, 3].map((step) => {
                    const isFilled = usePercentage > (step / 4)
                    return (
                      <div 
                        key={step} 
                        className="h-1 flex-1 rounded-sm transition-colors duration-200"
                        style={{ 
                          backgroundColor: isFilled 
                            ? (isLocked ? 'oklch(0.60 0.12 25)' : activeChildProfile.avatarColor) 
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
  )

  const whitelistSection = (
    <div className="rounded-2xl bg-card p-4 border border-border flex flex-col gap-3">
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
        <div className="grid grid-cols-2 gap-2">
          {displayedWhitelist.map((site) => {
            const siteName = site.replace('.org', '').replace('.com', '').replace('.edu', '')
            const capitalizedName = siteName.charAt(0).toUpperCase() + siteName.slice(1)

            return (
              <div 
                key={site}
                className="p-2.5 rounded-xl bg-secondary/35 border border-border/30 flex items-center gap-2.5 cursor-pointer active:scale-[0.98] transition-transform"
                onClick={handleSiteClick(site)}
              >
                <div className="h-7.5 w-7.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <GlobeIcon size={14} weight="bold" />
                </div>

                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-foreground/90 block truncate">
                    {capitalizedName}
                  </span>

                  <span className="text-[8px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                    Safe Link
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )

  const modalOverlay = (
    <AnimatePresence>
      {selectedLockedAppId && selectedLockedApp && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 rounded-[38px] bg-slate-950/95 text-white flex flex-col items-center justify-center p-6 text-center backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 15 }}
            className="flex flex-col items-center gap-4.5 w-full"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-500 shadow-lg shadow-rose-500/10 animate-bounce">
              <LockIcon size={28} weight="fill" />
            </div>

            <div>
              <h2 className="font-heading text-lg font-bold tracking-tight text-white/95">
                Time's Up for {selectedLockedApp.name}
              </h2>

              <p className="text-[10px] text-slate-400 mt-1 max-w-xs mx-auto">
                You have reached your daily limit of <span className="text-rose-400 font-bold">{appLimitVal} minutes</span> set by your parents.
              </p>
            </div>

            <div className="w-full max-w-xs rounded-xl bg-white/5 border border-white/10 p-4 flex flex-col gap-3">
              {activePendingRequest ? (
                <div className="flex items-start gap-2 text-left text-[10px] text-amber-400">
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
                  <div className="flex items-start gap-2 text-left text-[10px] text-slate-300">
                    <ShieldWarningIcon size={14} className="text-rose-400 shrink-0 mt-0.5" />

                    <div>
                      <span className="font-bold text-white block">
                        Request Extra Screen Time
                      </span>
                      Submit a request to extend this app's allowance for today.
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={handleRequestTimeClick(15)}
                      className="py-1.5 px-0.5 rounded-lg bg-white/10 border border-white/10 text-[9px] font-bold cursor-pointer active:scale-95"
                    >
                      <span>+15 min</span>
                    </button>

                    <button
                      onClick={handleRequestTimeClick(30)}
                      className="py-1.5 px-0.5 rounded-lg bg-white/10 border border-white/10 text-[9px] font-bold cursor-pointer active:scale-95"
                    >
                      <span>+30 min</span>
                    </button>

                    <button
                      onClick={handleRequestTimeClick(60)}
                      className="py-1.5 px-0.5 rounded-lg bg-white/10 border border-white/10 text-[9px] font-bold cursor-pointer active:scale-95"
                    >
                      <span>+1 hour</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 w-full max-w-xs mt-2">
              <button
                onClick={handleCloseLockedAppModal}
                className="flex-1 h-9 rounded-lg bg-white/15 border border-white/10 text-white text-[10px] font-bold shadow-sm transition-opacity active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeftIcon size={12} weight="bold" />

                <span>Go Back</span>
              </button>

              <button
                onClick={handleUnlockAppOverride}
                className="flex-1 h-9 rounded-lg bg-white text-slate-950 text-[10px] font-bold shadow-sm transition-opacity active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LockIcon size={12} weight="fill" />

                <span>Parent Bypass</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <section className="flex flex-col gap-4 relative h-full select-none">
      {headerElement}

      {clockWidget}

      {appsSection}

      {whitelistSection}

      {modalOverlay}
    </section>
  )
}

export default LayoutChild
