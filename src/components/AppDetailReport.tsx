import { useState } from 'react'

import { useWellbeingLogic } from '@/hooks/useWellbeingLogic'

import { 
  ArrowLeftIcon,
  ClockIcon,
  CheckIcon
} from '@phosphor-icons/react'

export const AppDetailReport = () => {
  const {
    activeAppDetail,
    setActiveAppDetailId,
    updateAppLimit,
    togglePersonalManualLock,
    addToast
  } = useWellbeingLogic()

  if (!activeAppDetail) return null

  // Local state for limit editing
  const [editingLimit, setEditingLimit] = useState(activeAppDetail.limitMinutes || 60)
  const isLocked = activeAppDetail.isLockedManually || (activeAppDetail.limitMinutes && activeAppDetail.timeSpent >= activeAppDetail.limitMinutes)

  const handleSave = () => {
    updateAppLimit(activeAppDetail.id, editingLimit)
    addToast(`Updated daily limit for ${activeAppDetail.name} to ${editingLimit}m`, 'success')
  }

  const handleToggleManualLock = () => {
    togglePersonalManualLock(activeAppDetail.id)
    const nextState = !activeAppDetail.isLockedManually
    addToast(
      nextState ? `Manually locked ${activeAppDetail.name}` : `Unlocked ${activeAppDetail.name}`,
      nextState ? 'warning' : 'success'
    )
  }

  // Generate hourly points for smooth SVG curve
  // App usage coordinates: [x, y]
  const mockHourlyPoints = [
    { hour: '9 AM', mins: 12 },
    { hour: '12 PM', mins: 25 },
    { hour: '3 PM', mins: 8 },
    { hour: '6 PM', mins: 42 },
    { hour: '9 PM', mins: 20 }
  ]

  // Spline points for SVG path
  const pathD = "M 15 110 Q 55 50 95 80 T 175 30 T 255 70 T 300 110"
  const areaD = `${pathD} L 300 120 L 15 120 Z`

  return (
    <section className="absolute inset-0 z-40 rounded-[38px] bg-background text-foreground flex flex-col overflow-y-auto scrollbar-none select-none">
      {/* Top Header navbar */}
      <div className="flex items-center justify-between px-6 pt-5 pb-3 bg-background/80 sticky top-0 z-10 backdrop-blur-md">
        <button
          onClick={() => setActiveAppDetailId(null)}
          className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary hover:bg-muted border border-border/80 text-foreground cursor-pointer"
        >
          <ArrowLeftIcon size={18} weight="bold" />
        </button>

        <span className="font-heading text-sm font-bold text-foreground/80">Detailed Report</span>

        <div className="h-10 w-10 shrink-0" />
      </div>

      {/* App Main Header card */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-border/40">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary shadow-inner text-primary">
            <ClockIcon size={28} weight="duotone" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-lg font-bold tracking-tight text-foreground">{activeAppDetail.name}</h2>
              {isLocked && (
                <span className="flex h-4 items-center gap-0.5 rounded-full bg-rose-100 dark:bg-rose-950/40 px-1.5 text-[9px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                  <span>Locked</span>
                </span>
              )}
            </div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{activeAppDetail.category}</span>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="px-6 py-6 grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-card/65 p-4 border border-border shadow-[0_8px_16px_rgba(0,0,0,0.02)] backdrop-blur-xl flex flex-col">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Usage Today</span>
          <span className="font-heading text-2xl font-extrabold text-foreground mt-1.5">
            {Math.floor(activeAppDetail.timeSpent / 60)}h {activeAppDetail.timeSpent % 60}m
          </span>
          <span className="text-[9px] font-semibold text-muted-foreground/60 mt-1">Simulated time elapsed</span>
        </div>

        <div className="rounded-2xl bg-card/65 p-4 border border-border shadow-[0_8px_16px_rgba(0,0,0,0.02)] backdrop-blur-xl flex flex-col">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">App Limit</span>
          <span className="font-heading text-2xl font-extrabold text-foreground mt-1.5">
            {activeAppDetail.limitMinutes ? `${activeAppDetail.limitMinutes}m` : 'None'}
          </span>
          <span className="text-[9px] font-semibold text-muted-foreground/60 mt-1">Daily allowance threshold</span>
        </div>

        <div className="rounded-2xl bg-card/65 p-4 border border-border shadow-[0_8px_16px_rgba(0,0,0,0.02)] backdrop-blur-xl flex flex-col">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Unlocks</span>
          <span className="font-heading text-2xl font-extrabold text-foreground mt-1.5">
            {activeAppDetail.pickups}
          </span>
          <span className="text-[9px] font-semibold text-muted-foreground/60 mt-1">Total application sessions</span>
        </div>

        <div className="rounded-2xl bg-card/65 p-4 border border-border shadow-[0_8px_16px_rgba(0,0,0,0.02)] backdrop-blur-xl flex flex-col">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Alerts</span>
          <span className="font-heading text-2xl font-extrabold text-foreground mt-1.5">
            {activeAppDetail.notifications}
          </span>
          <span className="text-[9px] font-semibold text-muted-foreground/60 mt-1">Push notifications received</span>
        </div>
      </div>

      {/* Hourly Active Usage Spline Chart */}
      <div className="mx-6 p-5 rounded-3xl bg-card/65 border border-border backdrop-blur-xl shadow-sm">
        <h3 className="font-heading text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Hourly usage spline</h3>
        
        <div className="relative h-32 w-full pt-2">
          <svg className="w-full h-24 overflow-visible" viewBox="0 0 300 120">
            {/* Area Fill */}
            <path d={areaD} fill="url(#blue-gradient)" className="opacity-20 text-primary" />
            
            {/* Curved Path */}
            <path d={pathD} fill="none" stroke="currentColor" className="text-primary" strokeWidth="3" />
            
            {/* Spline nodes */}
            <circle cx="95" cy="80" r="4.5" fill="var(--background)" stroke="currentColor" className="text-primary" strokeWidth="2.5" />
            <circle cx="175" cy="30" r="4.5" fill="var(--background)" stroke="currentColor" className="text-primary" strokeWidth="2.5" />

            <defs>
              <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="currentColor" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* Time axis label */}
          <div className="flex justify-between px-1 text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">
            {mockHourlyPoints.map((p) => (
              <span key={p.hour}>{p.hour}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Active Rules & Lock Actions */}
      <div className="mx-6 mt-6 p-5 rounded-3xl bg-card/65 border border-border backdrop-blur-xl shadow-sm mb-6 flex flex-col gap-5">
        <h3 className="font-heading text-xs font-bold text-muted-foreground uppercase tracking-wider">Active Rules & Lock overrides</h3>

        {/* Force Lock toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/35 border border-border/40">
          <div>
            <span className="text-xs font-semibold text-foreground/90">Manual Force Block</span>
            <p className="text-[10px] font-medium text-muted-foreground mt-0.5">Locks this application instantly</p>
          </div>
          
          <button
            onClick={handleToggleManualLock}
            className={`relative h-6 w-11 rounded-full transition-colors flex items-center ${
              activeAppDetail.isLockedManually ? 'bg-rose-500 justify-end' : 'bg-muted justify-start'
            }`}
          >
            <div className="h-5 w-5 rounded-full bg-white shadow-sm mx-0.5" />
          </button>
        </div>

        {/* Limit Slider */}
        <div className="flex flex-col gap-4 p-4 rounded-2xl bg-secondary/35 border border-border/40">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span>Set App Limit</span>
            <span className="text-primary font-bold">{editingLimit} Minutes</span>
          </div>

          <input
            type="range"
            min="15"
            max="180"
            step="15"
            value={editingLimit}
            onChange={(e) => setEditingLimit(parseInt(e.target.value))}
            className="w-full h-1.5 bg-muted/40 rounded-full appearance-none accent-primary cursor-pointer"
          />

          <div className="flex justify-end gap-2">
            {activeAppDetail.limitMinutes && (
              <button
                onClick={() => {
                  updateAppLimit(activeAppDetail.id, 0)
                  addToast(`Removed limit for ${activeAppDetail.name}`, 'info')
                }}
                className="h-8.5 px-3 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 text-[11px] font-bold dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30"
              >
                Disable Limit
              </button>
            )}

            <button
              onClick={handleSave}
              className="h-8.5 px-3 rounded-xl bg-primary text-primary-foreground text-[11px] font-bold shadow-sm hover:opacity-90 flex items-center gap-1"
            >
              <CheckIcon size={12} weight="bold" />
              <span>Apply</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
export default AppDetailReport
