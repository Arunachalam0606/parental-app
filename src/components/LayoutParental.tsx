import { useState } from 'react'

import { motion, AnimatePresence } from 'framer-motion'

import { useWellbeingLogic } from '@/hooks/useWellbeingLogic'

import { 
  PlusIcon,
  TrashIcon,
  ClockIcon,
  GlobeIcon,
  CalendarBlankIcon,
  UserIcon,
  CameraIcon
} from '@phosphor-icons/react'

export const LayoutParental = () => {
  const {
    childProfiles,
    selectedChildId,
    activeChildProfile,
    childScreenTimeFormatted,
    childDomainInput,
    childDomainError,
    setSelectedChildId,
    setChildDomainInput,
    updateChildLimit,
    removeChildWhitelist,
    removeChildBlacklist,
    handleAddChildWhitelist,
    handleAddChildBlacklist
  } = useWellbeingLogic()

  // Tabs for managing Whitelist vs Blacklist view
  const [activeListTab, setActiveListTab] = useState<'whitelist' | 'blacklist'>('blacklist')

  // UI state for schedule editing
  const [editingLimitType, setEditingLimitType] = useState<'weekday' | 'weekend' | null>(null)
  const [scheduleSliderVal, setScheduleSliderVal] = useState<number>(120)

  const handleOpenLimitEditor = (type: 'weekday' | 'weekend', currentMinutes: number) => {
    setEditingLimitType(type)
    setScheduleSliderVal(currentMinutes)
  }

  const handleSaveChildLimit = () => {
    if (!editingLimitType) return
    updateChildLimit(selectedChildId, editingLimitType, scheduleSliderVal)
    setEditingLimitType(null)
  }

  // Simulated screenshot logs
  const mockScreenshots = [
    { id: 's1', time: '17:15', app: 'Notion', desc: 'Working on school notes' },
    { id: 's2', time: '16:45', app: 'Duolingo', desc: 'Spanish lesson streak active' }
  ]

  // Rings calculations
  const limit = activeChildProfile.timeSpentToday
  const maxLimit = activeChildProfile.weekdayLimitMinutes
  const percentage = Math.min(limit / maxLimit, 1)

  return (
    <section className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">Parent Portal</span>
        <h1 className="font-heading text-2xl font-bold tracking-tight mt-0.5">Family Guard</h1>
      </div>

      {/* Child Switcher Tabs */}
      <div className="flex rounded-2xl bg-secondary/60 p-1 backdrop-blur-md">
        {childProfiles.map((child) => {
          const isSelected = child.id === selectedChildId
          return (
            <button
              key={child.id}
              onClick={() => setSelectedChildId(child.id)}
              className={`relative flex-1 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                isSelected ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="activeChildTab"
                  className="absolute inset-0 rounded-xl bg-primary shadow-sm"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center justify-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: child.avatarColor }} />
                {child.name} ({child.age}yo)
              </span>
            </button>
          )
        })}
      </div>

      {/* Child Usage Card */}
      <div className="relative rounded-3xl bg-card/60 p-6 shadow-sm border border-border backdrop-blur-xl flex items-center justify-between">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Today's Screen Time</span>
          
          <h3 className="font-heading text-3xl font-extrabold tracking-tight text-foreground/90">
            {childScreenTimeFormatted}
          </h3>

          <p className="text-[11px] font-medium text-muted-foreground">
            Goal: Max {activeChildProfile.weekdayLimitMinutes} mins on weekdays
          </p>
        </div>

        {/* Circular gauge instead of progress bar */}
        <div className="relative h-20 w-20">
          <svg className="h-full w-full -rotate-90">
            <circle cx="40" cy="40" r="32" fill="none" stroke="currentColor" className="text-muted/10" strokeWidth="6" />
            <motion.circle
              cx="40"
              cy="40"
              r="32"
              fill="none"
              stroke={activeChildProfile.avatarColor}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 32}
              initial={{ strokeDashoffset: 2 * Math.PI * 32 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 32 * (1 - percentage) }}
              transition={{ duration: 1 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <UserIcon size={24} className="text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* App Lock & Schedule configuration */}
      <div className="rounded-3xl bg-card/60 p-5 shadow-sm border border-border backdrop-blur-xl">
        <h3 className="font-heading text-sm font-semibold tracking-tight mb-4 flex items-center gap-1.5">
          <CalendarBlankIcon size={18} weight="duotone" className="text-primary" />
          <span>Schedules & Bedtime</span>
        </h3>

        <div className="flex flex-col gap-3">
          {/* Weekday limit */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/35 border border-border/40">
            <div>
              <span className="text-xs font-semibold text-foreground/90">Weekday Limit</span>
              <p className="text-[11px] font-medium text-muted-foreground mt-0.5">Monday–Friday allowance</p>
            </div>
            
            <button
              onClick={() => handleOpenLimitEditor('weekday', activeChildProfile.weekdayLimitMinutes)}
              className="h-9 px-3.5 rounded-xl bg-secondary hover:bg-muted border border-border text-xs font-bold text-foreground/80 flex items-center gap-1"
            >
              <span>{activeChildProfile.weekdayLimitMinutes}m</span>
              <ClockIcon size={14} />
            </button>
          </div>

          {/* Weekend limit */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/35 border border-border/40">
            <div>
              <span className="text-xs font-semibold text-foreground/90">Weekend Limit</span>
              <p className="text-[11px] font-medium text-muted-foreground mt-0.5">Saturday–Sunday allowance</p>
            </div>
            
            <button
              onClick={() => handleOpenLimitEditor('weekend', activeChildProfile.weekendLimitMinutes)}
              className="h-9 px-3.5 rounded-xl bg-secondary hover:bg-muted border border-border text-xs font-bold text-foreground/80 flex items-center gap-1"
            >
              <span>{activeChildProfile.weekendLimitMinutes}m</span>
              <ClockIcon size={14} />
            </button>
          </div>
        </div>

        {/* Limit slider editor overlay */}
        <AnimatePresence>
          {editingLimitType && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden"
            >
              <div className="rounded-2xl bg-primary/5 p-4 border border-primary/20 flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="capitalize">{editingLimitType} limit minutes:</span>
                  <span className="text-primary font-bold">{scheduleSliderVal} mins</span>
                </div>

                <input
                  type="range"
                  min="30"
                  max="300"
                  step="15"
                  value={scheduleSliderVal}
                  onChange={(e) => setScheduleSliderVal(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-muted/40 rounded-full appearance-none accent-primary cursor-pointer"
                />

                <div className="flex items-center gap-2 justify-end mt-2">
                  <button
                    onClick={() => setEditingLimitType(null)}
                    className="h-8 px-3 rounded-lg text-xs font-semibold text-muted-foreground hover:bg-secondary"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSaveChildLimit}
                    className="h-8 px-3.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:opacity-95"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Web blocking: Whitelist & Blacklist manager */}
      <div className="rounded-3xl bg-card/60 p-5 shadow-sm border border-border backdrop-blur-xl">
        <h3 className="font-heading text-sm font-semibold tracking-tight mb-3.5 flex items-center gap-1.5">
          <GlobeIcon size={18} weight="duotone" className="text-purple-500" />
          <span>Web Filter Policies</span>
        </h3>

        {/* Toggle List Tabs */}
        <div className="grid grid-cols-2 gap-2 mb-4 p-1 rounded-xl bg-secondary/50">
          <button
            onClick={() => setActiveListTab('blacklist')}
            className={`py-2 rounded-lg text-xs font-bold transition-all ${
              activeListTab === 'blacklist' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            Blocked Domains
          </button>
          
          <button
            onClick={() => setActiveListTab('whitelist')}
            className={`py-2 rounded-lg text-xs font-bold transition-all ${
              activeListTab === 'whitelist' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            Whitelisted
          </button>
        </div>

        {/* Add domain form */}
        <div className="flex flex-col gap-1.5 mb-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="e.g. facebook.com"
              value={childDomainInput}
              onChange={(e) => setChildDomainInput(e.target.value)}
              className="flex-1 h-11 px-4 rounded-xl border border-border bg-secondary/40 text-sm focus:outline-none focus:border-primary/50 text-foreground"
            />
            
            <button
              onClick={activeListTab === 'whitelist' ? handleAddChildWhitelist : handleAddChildBlacklist}
              className="h-11 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-sm hover:opacity-90 flex items-center justify-center gap-1"
            >
              <PlusIcon size={16} weight="bold" />
              <span>Add</span>
            </button>
          </div>
          {childDomainError && (
            <span className="text-[11px] font-medium text-rose-500 pl-1">{childDomainError}</span>
          )}
        </div>

        {/* List of active domain items */}
        <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {activeListTab === 'blacklist' ? (
              activeChildProfile.blacklist.length === 0 ? (
                <div className="text-center py-6 text-xs text-muted-foreground">No blocked domains</div>
              ) : (
                activeChildProfile.blacklist.map((domain) => (
                  <motion.div
                    key={domain}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/10 dark:border-rose-500/20 text-xs text-rose-700 dark:text-rose-400 font-semibold"
                  >
                    <span>{domain}</span>
                    <button
                      onClick={() => removeChildBlacklist(selectedChildId, domain)}
                      className="p-1 rounded-lg hover:bg-rose-500/10 text-rose-600 dark:text-rose-400"
                    >
                      <TrashIcon size={14} />
                    </button>
                  </motion.div>
                ))
              )
            ) : (
              activeChildProfile.whitelist.length === 0 ? (
                <div className="text-center py-6 text-xs text-muted-foreground">No whitelisted domains</div>
              ) : (
                activeChildProfile.whitelist.map((domain) => (
                  <motion.div
                    key={domain}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 dark:border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-400 font-semibold"
                  >
                    <span>{domain}</span>
                    <button
                      onClick={() => removeChildWhitelist(selectedChildId, domain)}
                      className="p-1 rounded-lg hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    >
                      <TrashIcon size={14} />
                    </button>
                  </motion.div>
                ))
              )
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Simulated Device snapshot logs */}
      <div className="rounded-3xl bg-card/60 p-5 shadow-sm border border-border backdrop-blur-xl">
        <h3 className="font-heading text-sm font-semibold tracking-tight mb-3.5 flex items-center gap-1.5">
          <CameraIcon size={18} weight="duotone" className="text-blue-500" />
          <span>Screen Monitoring Logs</span>
        </h3>

        <div className="flex flex-col gap-3">
          {mockScreenshots.map((snap) => (
            <div key={snap.id} className="flex gap-3 items-center rounded-2xl bg-secondary/35 border border-border/40 p-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/40">
                <CameraIcon size={24} weight="regular" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-xs font-semibold mb-0.5">
                  <span className="text-foreground">{snap.app}</span>
                  <span className="text-muted-foreground">{snap.time}</span>
                </div>
                <p className="text-[10px] font-medium text-muted-foreground truncate">{snap.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
export default LayoutParental
