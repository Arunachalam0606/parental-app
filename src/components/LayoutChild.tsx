import { useState } from 'react'

import { motion, AnimatePresence } from 'framer-motion'

import { useWellbeingLogic } from '@/hooks/useWellbeingLogic'

import { 
  LockIcon, 
  HourglassHighIcon,
  SmileyIcon, 
  CaretRightIcon,
  ShieldWarningIcon,
  ArrowLeftIcon
} from '@phosphor-icons/react'

export const LayoutChild = () => {
  const {
    activeChildProfile,
    appStats
  } = useWellbeingLogic()

  // Lock overlay state details
  const [selectedLockedApp, setSelectedLockedApp] = useState<{ name: string; limit: number } | null>(null)

  const limit = activeChildProfile.timeSpentToday
  const maxLimit = activeChildProfile.weekdayLimitMinutes
  const timeRemaining = Math.max(maxLimit - limit, 0)
  
  const hoursRemaining = Math.floor(timeRemaining / 60)
  const minutesRemaining = timeRemaining % 60
  const isCloseToLimit = timeRemaining <= 15

  // Filter apps that have limits set for child layout
  const childAppsWithLimits = appStats.filter((app) => {
    // Mimic specific apps for Alex/Emma
    if (activeChildProfile.id === 'alex') {
      return ['minecraft', 'yt', 'insta'].includes(app.id)
    }
    return ['tiktok', 'yt', 'insta'].includes(app.id)
  })

  const getStrokeDasharray = (radius: number) => 2 * Math.PI * radius
  const circleRadius = 60
  const percentageUsed = Math.min(limit / maxLimit, 1)

  return (
    <section className="flex flex-col gap-6 relative h-full">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: activeChildProfile.avatarColor }}>
          {activeChildProfile.name.charAt(0)}
        </div>
        <div>
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Hello, {activeChildProfile.name}!</span>
          <h1 className="font-heading text-xl font-bold tracking-tight text-foreground/90">Your Screen Time</h1>
        </div>
      </div>

      {/* Radial Time Indicator */}
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
                  Locked Out
                </span>
                <span className="text-[9px] font-bold text-rose-400 uppercase tracking-wider mt-0.5">Time's Up!</span>
              </>
            )}
          </div>
        </div>

        {/* Warning card when limits are close */}
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

      {/* List of limited apps */}
      <div className="rounded-3xl bg-card/60 p-5 shadow-sm border border-border backdrop-blur-xl flex-1">
        <h3 className="font-heading text-sm font-semibold tracking-tight mb-4">My Apps Allowance</h3>

        <div className="flex flex-col divide-y divide-border/60">
          {childAppsWithLimits.map((app) => {
            const childLimit = activeChildProfile.id === 'alex' ? 60 : 90 // mock limit durations
            const isLocked = activeChildProfile.lockedApps.includes(app.id)
            const remainingMins = Math.max(childLimit - app.timeSpent, 0)
            
            return (
              <div 
                key={app.id} 
                className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between cursor-pointer group"
                onClick={() => {
                  if (isLocked) {
                    setSelectedLockedApp({ name: app.name, limit: childLimit })
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/80">
                    {isLocked ? (
                      <LockIcon size={20} weight="fill" className="text-rose-500" />
                    ) : (
                      <SmileyIcon size={20} weight="duotone" className="text-emerald-500" />
                    )}
                  </div>

                  <div>
                    <span className="text-sm font-bold text-foreground/90">{app.name}</span>
                    <p className="text-[10px] font-medium text-muted-foreground mt-0.5">Used: {app.timeSpent}m of {childLimit}m</p>
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

      {/* Lock screen overlay (no passcode override allowed) */}
      <AnimatePresence>
        {selectedLockedApp && (
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
              className="flex flex-col items-center gap-5"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-500 shadow-lg shadow-rose-500/10 animate-bounce">
                <LockIcon size={32} weight="fill" />
              </div>

              <div>
                <h2 className="font-heading text-xl font-bold tracking-tight">Time's Up for {selectedLockedApp.name}</h2>
                <p className="text-xs text-slate-400 mt-2 max-w-xs">
                  You have reached your daily limit of <span className="text-rose-400 font-bold">{selectedLockedApp.limit} minutes</span> set by your parents.
                </p>
              </div>

              <div className="w-full max-w-xs rounded-2xl bg-white/5 border border-white/10 p-4 mt-2">
                <div className="flex items-start gap-2.5 text-left text-[11px] text-slate-300">
                  <ShieldWarningIcon size={16} className="text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Device Security Policy</span>
                    No passcode override or extensions are active for child locks. Limits are reset automatically tomorrow.
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedLockedApp(null)}
                className="mt-4 h-11 px-6 rounded-xl bg-white text-slate-950 text-xs font-bold shadow-sm transition-opacity hover:opacity-90 flex items-center gap-1.5"
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
