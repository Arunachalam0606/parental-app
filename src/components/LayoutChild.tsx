import { useState } from 'react'

import { motion, AnimatePresence } from 'framer-motion'

import { useWellbeingLogic } from '@/hooks/useWellbeingLogic'

import { 
  LockIcon, 
  HourglassIcon,
  HourglassHighIcon,
  SmileyIcon, 
  CaretRightIcon,
  ShieldWarningIcon,
  ArrowLeftIcon,
  SignOutIcon
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
    addToast
  } = useWellbeingLogic()

  // Selected app lock override details modal
  const [selectedLockedAppId, setSelectedLockedAppId] = useState<string | null>(null)

  const limitToday = activeChildProfile.timeSpentToday
  const maxLimitToday = activeChildProfile.weekdayLimitMinutes
  const timeRemaining = Math.max(maxLimitToday - limitToday, 0)
  
  const hoursRemaining = Math.floor(timeRemaining / 60)
  const minutesRemaining = timeRemaining % 60
  const isCloseToLimit = timeRemaining <= 15

  // List of apps with limits on this child
  const childApps = appStats.filter((app) => {
    if (selectedChildId === 'alex') {
      return ['minecraft', 'yt', 'insta'].includes(app.id)
    }
    return ['tiktok', 'yt', 'insta'].includes(app.id)
  })

  // Selected locked app info
  const selectedLockedApp = appStats.find((a) => a.id === selectedLockedAppId)
  const childLimits = childAppLimits[selectedChildId] || {}
  const appLimitVal = selectedLockedApp ? childLimits[selectedLockedApp.id] || 60 : 60

  // Check if there is an active pending request for this app
  const activePendingRequest = extraTimeRequests.find(
    (r) => r.childId === selectedChildId && r.appId === selectedLockedAppId && r.status === 'pending'
  )

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

  const getStrokeDasharray = (radius: number) => 2 * Math.PI * radius
  const circleRadius = 60
  const percentageUsed = Math.min(limitToday / maxLimitToday, 1)

  return (
    <section className="flex flex-col gap-6 relative h-full select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: activeChildProfile.avatarColor }}>
            {activeChildProfile.name.charAt(0)}
          </div>
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Child mode active</span>
            <h1 className="font-heading text-xl font-bold tracking-tight text-foreground/90">{activeChildProfile.name}'s Space</h1>
          </div>
        </div>

        {/* Exit child mode bypass button for sandbox */}
        <button
          onClick={handleExitChildMode}
          className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary hover:bg-muted border border-border/80 text-foreground cursor-pointer"
          title="Exit Child Mode"
        >
          <SignOutIcon size={18} weight="bold" />
        </button>
      </div>

      {/* Screen time allowance clock dials */}
      <div className="flex flex-col items-center justify-center rounded-3xl bg-card/60 p-6 shadow-sm border border-border backdrop-blur-xl">
        <div className="relative h-[160px] w-[160px]">
          <svg className="h-full w-full -rotate-90">
            <circle cx="80" cy="80" r={circleRadius} fill="none" stroke="currentColor" className="text-muted/10" strokeWidth="10" />
            <motion.circle
              cx="80"
              cy="80"
              r={circleRadius}
              fill="none"
              stroke={isCloseToLimit ? 'oklch(0.60 0.18 25)' : activeChildProfile.avatarColor}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={getStrokeDasharray(circleRadius)}
              initial={{ strokeDashoffset: getStrokeDasharray(circleRadius) }}
              animate={{ strokeDashoffset: getStrokeDasharray(circleRadius) * (1 - percentageUsed) }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            {timeRemaining > 0 ? (
              <>
                <span className="font-heading text-3xl font-extrabold tracking-tight">
                  {hoursRemaining > 0 ? `${hoursRemaining}h ` : ''}{minutesRemaining}m
                </span>
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">Remaining</span>
              </>
            ) : (
              <>
                <span className="font-heading text-2xl font-extrabold text-rose-500 tracking-tight">
                  Time's Up
                </span>
                <span className="text-[9px] font-bold text-rose-400 uppercase tracking-wider mt-0.5">Device Locked</span>
              </>
            )}
          </div>
        </div>

        {/* Warning cards */}
        {timeRemaining > 0 && isCloseToLimit && (
          <div className="mt-5 w-full flex items-center gap-3 p-3.5 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400">
            <HourglassHighIcon size={20} weight="duotone" />
            <span className="text-xs font-semibold">Only {timeRemaining} minutes left! Wrap up your tasks.</span>
          </div>
        )}

        {timeRemaining === 0 && (
          <div className="mt-5 w-full flex items-center gap-3 p-3.5 rounded-2xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400">
            <LockIcon size={20} weight="fill" />
            <span className="text-xs font-semibold">Your device is now locked for the day.</span>
          </div>
        )}
      </div>

      {/* Child app allowance list */}
      <div className="rounded-3xl bg-card/60 p-5 shadow-sm border border-border backdrop-blur-xl flex-1">
        <h3 className="font-heading text-sm font-semibold tracking-tight mb-4">My Apps allowance</h3>

        <div className="flex flex-col divide-y divide-border/60">
          {childApps.map((app) => {
            const isLocked = isChildAppLocked(selectedChildId, app.id)
            const appLimit = childLimits[app.id] || 60
            const appTime = getChildAppTimeSpent(selectedChildId, app.id)
            const remainingMins = Math.max(appLimit - appTime, 0)
            
            return (
              <div 
                key={app.id} 
                className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between cursor-pointer group"
                onClick={() => {
                  if (isLocked) {
                    setSelectedLockedAppId(app.id)
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-secondary shadow-inner">
                    {isLocked ? (
                      <LockIcon size={20} weight="fill" className="text-rose-500" />
                    ) : (
                      <SmileyIcon size={20} weight="duotone" className="text-emerald-500" />
                    )}
                  </div>

                  <div>
                    <span className="text-sm font-bold text-foreground/90">{app.name}</span>
                    <p className="text-[10px] font-semibold text-muted-foreground mt-0.5">Used: {appTime}m of {appLimit}m</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {isLocked ? (
                    <span className="text-xs font-bold text-rose-500 dark:text-rose-400">Locked</span>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{remainingMins}m left</span>
                  )}
                  <CaretRightIcon size={14} className="text-muted-foreground/60" />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Lock Override request Overlay */}
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
              className="flex flex-col items-center gap-5 w-full"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-500 shadow-lg shadow-rose-500/10 animate-bounce">
                <LockIcon size={32} weight="fill" />
              </div>

              <div>
                <h2 className="font-heading text-xl font-bold tracking-tight">Time's Up for {selectedLockedApp.name}</h2>
                <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto">
                  You have reached your daily limit of <span className="text-rose-400 font-bold">{appLimitVal} minutes</span> set by your parents.
                </p>
              </div>

              {/* Approval status / options */}
              <div className="w-full max-w-xs rounded-2xl bg-white/5 border border-white/10 p-5 mt-2 flex flex-col gap-4">
                {activePendingRequest ? (
                  <div className="flex items-start gap-2.5 text-left text-[11px] text-amber-400">
                    <HourglassIcon size={16} className="shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Request Pending Approval</span>
                      Requested +{activePendingRequest.minutesRequested} mins allowance. Waiting for parental response...
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start gap-2.5 text-left text-[11px] text-slate-300">
                      <ShieldWarningIcon size={16} className="text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-white block">Request Extra Screen Time</span>
                        Submit a request to extend this app's allowance for today.
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleRequestTime(15)}
                        className="py-2 px-1 rounded-xl bg-white/10 border border-white/10 text-[10px] font-bold hover:bg-white/20 cursor-pointer"
                      >
                        +15 min
                      </button>
                      <button
                        onClick={() => handleRequestTime(30)}
                        className="py-2 px-1 rounded-xl bg-white/10 border border-white/10 text-[10px] font-bold hover:bg-white/20 cursor-pointer"
                      >
                        +30 min
                      </button>
                      <button
                        onClick={() => handleRequestTime(60)}
                        className="py-2 px-1 rounded-xl bg-white/10 border border-white/10 text-[10px] font-bold hover:bg-white/20 cursor-pointer"
                      >
                        +1 hour
                      </button>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={() => setSelectedLockedAppId(null)}
                className="mt-4 h-11 px-6 rounded-xl bg-white text-slate-950 text-xs font-bold shadow-sm transition-opacity hover:opacity-90 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeftIcon size={14} weight="bold" />
                <span>Go Back</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
export default LayoutChild
