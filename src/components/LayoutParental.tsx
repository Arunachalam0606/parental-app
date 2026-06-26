import { useState } from 'react'

import { motion, AnimatePresence } from 'framer-motion'

import { useWellbeingLogic } from '@/hooks/useWellbeingLogic'

import { 
  PlusIcon,
  TrashIcon,
  ClockIcon,
  GlobeIcon,
  CalendarBlankIcon,
  CameraIcon,
  CheckIcon,
  XIcon,
  HourglassIcon,
  LockIcon,
  LockOpenIcon
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
    handleAddChildBlacklist,
    extraTimeRequests,
    handleExtraTimeRequest,
    appStats,
    childAppLimits,
    setChildAppLimit,
    childManualLocks,
    toggleChildManualLock,
    getChildAppTimeSpent
  } = useWellbeingLogic()

  // Tabs for whitelist vs blacklist
  const [activeListTab, setActiveListTab] = useState<'whitelist' | 'blacklist'>('blacklist')

  // Edit app-limit drawer state
  const [editingAppId, setEditingAppId] = useState<string | null>(null)
  const [editingLimitVal, setEditingLimitVal] = useState<number>(60)

  // Edit weekday/weekend scheduler
  const [editingScheduleType, setEditingScheduleType] = useState<'weekday' | 'weekend' | null>(null)
  const [scheduleLimitVal, setScheduleLimitVal] = useState<number>(90)

  // Filter pending requests for this child or overall
  const pendingRequests = extraTimeRequests.filter((r) => r.status === 'pending')

  const handleOpenAppLimitEditor = (appId: string, currentLimit?: number) => {
    setEditingAppId(appId)
    setEditingLimitVal(currentLimit || 60)
  }

  const handleSaveAppLimit = (appId: string) => {
    setChildAppLimit(selectedChildId, appId, editingLimitVal)
    setEditingAppId(null)
  }

  const handleRemoveAppLimit = (appId: string) => {
    setChildAppLimit(selectedChildId, appId, 0)
    setEditingAppId(null)
  }

  const handleOpenScheduleEditor = (type: 'weekday' | 'weekend', currentLimit: number) => {
    setEditingScheduleType(type)
    setScheduleLimitVal(currentLimit)
  }

  const handleSaveSchedule = () => {
    if (!editingScheduleType) return
    updateChildLimit(selectedChildId, editingScheduleType, scheduleLimitVal)
    setEditingScheduleType(null)
  }

  // Ring calculations
  const limitToday = activeChildProfile.timeSpentToday
  const maxLimitToday = activeChildProfile.weekdayLimitMinutes
  const percentage = Math.min(limitToday / maxLimitToday, 1)

  return (
    <section className="flex flex-col gap-6 select-none">
      <div>
        <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Parent Portal</span>

        <h1 className="font-heading text-2xl font-bold tracking-tight mt-0.5 text-foreground/90">Family Hub</h1>
      </div>

      <div className="flex rounded-2xl bg-secondary/55 p-1 backdrop-blur-md border border-border/10">
        {childProfiles.map((child) => {
          const isSelected = child.id === selectedChildId

          return (
            <button
              key={child.id}
              onClick={() => setSelectedChildId(child.id)}
              className={`relative flex-1 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
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
                <span className="h-2 w-2 rounded-full shadow-sm animate-pulse" style={{ backgroundColor: child.avatarColor }} />
                {child.name} ({child.age}yo)
              </span>
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="popLayout">
        {pendingRequests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="rounded-3xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 p-5 backdrop-blur-xl flex flex-col gap-4 shadow-lg shadow-amber-500/5"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <HourglassIcon size={16} weight="fill" className="animate-spin-slow" />

                <span>Pending Approvals ({pendingRequests.length})</span>
              </h3>

              <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
            </div>

            <div className="flex flex-col gap-3">
              {pendingRequests.map((req) => {
                const requester = childProfiles.find((c) => c.id === req.childId)?.name || 'Child'
                const targetAppName = appStats.find((a) => a.id === req.appId)?.name || 'App'

                return (
                  <motion.div
                    key={req.id}
                    layout
                    className="flex flex-col gap-3 p-4 rounded-2xl bg-card border border-border/80 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wide">
                          {requester} requested time
                        </span>

                        <h4 className="text-sm font-extrabold text-foreground mt-0.5">{targetAppName}</h4>

                        <p className="text-[10px] font-semibold text-muted-foreground mt-1">
                          wants <span className="text-primary font-bold">+{req.minutesRequested} mins</span> allowance for today
                        </p>
                      </div>

                      <span className="text-[9px] font-bold text-muted-foreground/80 bg-secondary/80 px-2 py-0.5 rounded-full border border-border/30">
                        {req.timestamp}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2 border-t border-border/40 pt-3">
                      <button
                        onClick={() => handleExtraTimeRequest(req.id, 'reject')}
                        className="h-8.5 w-8.5 rounded-xl bg-secondary hover:bg-muted border border-border/80 text-muted-foreground hover:text-rose-500 cursor-pointer flex items-center justify-center transition-colors"
                      >
                        <XIcon size={14} weight="bold" />
                      </button>

                      <button
                        onClick={() => handleExtraTimeRequest(req.id, 'approve')}
                        className="h-8.5 px-4 rounded-xl bg-emerald-500 text-white shadow-md hover:bg-emerald-600 cursor-pointer text-xs font-bold flex items-center gap-1.5 transition-colors border border-emerald-600/20"
                      >
                        <CheckIcon size={12} weight="bold" />

                        <span>Approve</span>
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="rounded-3xl bg-card/50 p-5 shadow-lg shadow-black/5 border border-border/80 backdrop-blur-xl flex items-center justify-between">
        <div className="flex flex-col gap-1.5">
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Screen Time Today</span>
          
          <h3 className="font-heading text-3xl font-black tracking-tight text-foreground/90">
            {childScreenTimeFormatted}
          </h3>

          <p className="text-[10px] font-semibold text-muted-foreground">
            Limit: Max {activeChildProfile.weekdayLimitMinutes}m on weekdays
          </p>
        </div>

        <div className="relative h-[80px] w-[80px]">
          <svg className="h-full w-full -rotate-90">
            <defs>
              <linearGradient id="childRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={activeChildProfile.avatarColor} />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>

            <circle cx="40" cy="40" r="32" fill="none" stroke="currentColor" className="text-muted/10 dark:text-muted/5" strokeWidth="5.5" />

            <motion.circle
              cx="40"
              cy="40"
              r="32"
              fill="none"
              stroke="url(#childRingGrad)"
              strokeWidth="5.5"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 32}
              initial={{ strokeDashoffset: 2 * Math.PI * 32 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 32 * (1 - percentage) }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <span 
              className="h-10 w-10 rounded-full flex items-center justify-center text-white font-extrabold text-sm shadow-md"
              style={{ backgroundColor: activeChildProfile.avatarColor }}
            >
              {activeChildProfile.name.charAt(0)}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-card/50 p-5 shadow-lg shadow-black/5 border border-border/80 backdrop-blur-xl">
        <h3 className="font-heading text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <CalendarBlankIcon size={18} weight="duotone" className="text-primary" />

          <span>Bedtime Routines allowance</span>
        </h3>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/35 border border-border/40 hover:bg-secondary/50 transition-colors">
            <div>
              <span className="text-xs font-semibold text-foreground/90">Weekday Limit</span>

              <p className="text-[10px] font-medium text-muted-foreground mt-0.5">Monday–Friday allowance limit</p>
            </div>
            
            <button
              onClick={() => handleOpenScheduleEditor('weekday', activeChildProfile.weekdayLimitMinutes)}
              className="h-9 px-3 rounded-xl bg-secondary hover:bg-muted border border-border/80 text-xs font-bold text-foreground/80 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>{activeChildProfile.weekdayLimitMinutes}m</span>

              <ClockIcon size={14} />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/35 border border-border/40 hover:bg-secondary/50 transition-colors">
            <div>
              <span className="text-xs font-semibold text-foreground/90">Weekend Limit</span>

              <p className="text-[10px] font-medium text-muted-foreground mt-0.5">Saturday–Sunday allowance limit</p>
            </div>
            
            <button
              onClick={() => handleOpenScheduleEditor('weekend', activeChildProfile.weekendLimitMinutes)}
              className="h-9 px-3 rounded-xl bg-secondary hover:bg-muted border border-border/80 text-xs font-bold text-foreground/80 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>{activeChildProfile.weekendLimitMinutes}m</span>

              <ClockIcon size={14} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {editingScheduleType && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden"
            >
              <div className="rounded-2xl bg-primary/5 p-4 border border-primary/20 flex flex-col gap-3.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="capitalize">{editingScheduleType} limit duration:</span>

                  <span className="text-primary font-black">{scheduleLimitVal} mins</span>
                </div>

                <input
                  type="range"
                  min="30"
                  max="300"
                  step="15"
                  value={scheduleLimitVal}
                  onChange={(e) => setScheduleLimitVal(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-muted/40 rounded-full appearance-none accent-primary cursor-pointer"
                />

                <div className="flex items-center gap-2 justify-end mt-1.5">
                  <button
                    onClick={() => setEditingScheduleType(null)}
                    className="h-8 px-3 rounded-lg text-xs font-semibold text-muted-foreground hover:bg-secondary cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSaveSchedule}
                    className="h-8 px-3.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:opacity-95 cursor-pointer"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="rounded-3xl bg-card/50 p-5 shadow-lg shadow-black/5 border border-border/80 backdrop-blur-xl">
        <h3 className="font-heading text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">App-Specific Rules</h3>
        
        <div className="flex flex-col gap-3">
          {appStats.filter(a => ['minecraft', 'yt', 'tiktok', 'insta'].includes(a.id)).map((app) => {
            const childLimits = childAppLimits[selectedChildId] || {}
            const currentLimit = childLimits[app.id]
            const lockedApps = childManualLocks[selectedChildId] || []
            const isManualLocked = lockedApps.includes(app.id)
            const timeSpent = getChildAppTimeSpent(selectedChildId, app.id)
            const isExpanded = editingAppId === app.id

            return (
              <div key={app.id} className="p-3.5 rounded-2xl bg-secondary/35 border border-border/40 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-extrabold text-foreground/90">{app.name}</span>

                    <p className="text-[10px] font-semibold text-muted-foreground mt-0.5">
                      Usage: {timeSpent}m of {currentLimit !== undefined ? `${currentLimit}m` : 'no limit'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleChildManualLock(selectedChildId, app.id)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        isManualLocked 
                          ? 'bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30' 
                          : 'bg-secondary border-border/80 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {isManualLocked ? <LockIcon size={15} weight="fill" /> : <LockOpenIcon size={15} weight="regular" />}
                    </button>

                    <button
                      onClick={() => handleOpenAppLimitEditor(app.id, currentLimit)}
                      className="h-8.5 px-3 rounded-xl bg-secondary border border-border/80 text-[11px] font-bold text-foreground/80 hover:bg-muted cursor-pointer transition-colors"
                    >
                      {currentLimit !== undefined ? `${currentLimit}m` : 'Set Limit'}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="rounded-xl bg-secondary/80 p-3.5 border border-border/60 flex flex-col gap-3 mt-1">
                        <div className="flex items-center justify-between text-[11px] font-semibold">
                          <span>Alex daily {app.name} limit:</span>

                          <span className="text-primary font-black">{editingLimitVal} Mins</span>
                        </div>

                        <input
                          type="range"
                          min="15"
                          max="180"
                          step="15"
                          value={editingLimitVal}
                          onChange={(e) => setEditingLimitVal(parseInt(e.target.value))}
                          className="w-full h-1.5 bg-muted/40 rounded-full appearance-none accent-primary cursor-pointer"
                        />

                        <div className="flex justify-end gap-2 mt-1">
                          {currentLimit !== undefined && (
                            <button
                              onClick={() => handleRemoveAppLimit(app.id)}
                              className="h-8 px-3 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 text-[11px] font-bold cursor-pointer transition-colors"
                            >
                              Disable
                            </button>
                          )}

                          <button
                            onClick={() => handleSaveAppLimit(app.id)}
                            className="h-8 px-3 rounded-xl bg-primary text-primary-foreground text-[11px] font-bold shadow-sm hover:opacity-90 cursor-pointer transition-colors"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>

      <div className="rounded-3xl bg-card/50 p-5 shadow-lg shadow-black/5 border border-border/80 backdrop-blur-xl">
        <h3 className="font-heading text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
          <GlobeIcon size={18} weight="duotone" className="text-purple-500" />

          <span>Web Filter Policies</span>
        </h3>

        <div className="grid grid-cols-2 gap-2 mb-4 p-1 rounded-xl bg-secondary/50 border border-border/10">
          <button
            onClick={() => setActiveListTab('blacklist')}
            className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeListTab === 'blacklist' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            Blocked Domains
          </button>
          
          <button
            onClick={() => setActiveListTab('whitelist')}
            className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeListTab === 'whitelist' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            Whitelisted
          </button>
        </div>

        <div className="flex flex-col gap-1.5 mb-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="e.g. roblox.com"
              value={childDomainInput}
              onChange={(e) => setChildDomainInput(e.target.value)}
              className="flex-1 h-11 px-4 rounded-xl border border-border bg-secondary/40 text-sm focus:outline-none focus:border-primary/50 text-foreground"
            />
            
            <button
              onClick={activeListTab === 'whitelist' ? handleAddChildWhitelist : handleAddChildBlacklist}
              className="h-11 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-sm hover:opacity-90 flex items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <PlusIcon size={16} weight="bold" />

              <span>Add</span>
            </button>
          </div>

          {childDomainError && (
            <span className="text-[11px] font-medium text-rose-500 pl-1">{childDomainError}</span>
          )}
        </div>

        <div className="flex flex-col gap-2 max-h-36 overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {activeListTab === 'blacklist' ? (
              activeChildProfile.blacklist.length === 0 ? (
                <div className="text-center py-5 text-xs text-muted-foreground">All domains allowed</div>
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
                      className="p-1 rounded-lg hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 cursor-pointer"
                    >
                      <TrashIcon size={14} />
                    </button>
                  </motion.div>
                ))
              )
            ) : (
              activeChildProfile.whitelist.length === 0 ? (
                <div className="text-center py-5 text-xs text-muted-foreground">No whitelists defined</div>
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
                      className="p-1 rounded-lg hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 cursor-pointer"
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

      <div className="rounded-3xl bg-card/50 p-5 shadow-lg shadow-black/5 border border-border/80 backdrop-blur-xl">
        <h3 className="font-heading text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
          <CameraIcon size={18} weight="duotone" className="text-blue-500" />

          <span>Screen Monitoring Logs</span>
        </h3>

        <div className="flex flex-col gap-3">
          {[
            { id: 's1', time: '17:15', app: 'Notion', desc: 'Working on school notes' },
            { id: 's2', time: '16:45', app: 'Duolingo', desc: 'Spanish lesson streak active' }
          ].map((snap) => (
            <div key={snap.id} className="flex gap-3 items-center rounded-2xl bg-secondary/35 border border-border/40 p-3 hover:bg-secondary/45 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-100 to-indigo-100 dark:from-blue-950/40 dark:to-indigo-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/20">
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
