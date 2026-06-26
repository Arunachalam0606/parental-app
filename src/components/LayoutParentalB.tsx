import { useState } from "react"

import { motion, AnimatePresence } from "framer-motion"

import { useWellbeingLogic } from "@/hooks/useWellbeingLogic"

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
  LockOpenIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react"

export const LayoutParentalB = () => {
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
    getChildAppTimeSpent,
    addChildProfile,
    addToast,
    demoEmpty,
  } = useWellbeingLogic()

  // Tabs for whitelist vs blacklist
  const [activeListTab, setActiveListTab] = useState<"whitelist" | "blacklist">(
    "blacklist"
  )

  // Modal states for adding child profile
  const [showAddModal, setShowAddModal] = useState<boolean>(false)
  const [newChildName, setNewChildName] = useState<string>("")
  const [newChildAge, setNewChildAge] = useState<number>(10)
  const [newChildColor, setNewChildColor] = useState<string>("#818CF8")

  const handleOpenAddChild = () => {
    setNewChildName("")
    setNewChildAge(10)
    setNewChildColor("#818CF8")
    setShowAddModal(true)
  }

  const handleCloseAddChild = () => {
    setShowAddModal(false)
  }

  const handleCreateChild = () => {
    if (!newChildName.trim()) {
      addToast("Please enter a name", "warning")
      return
    }
    addChildProfile(newChildName, newChildAge, newChildColor)
    addToast(`Added profile for ${newChildName}`, "success")
    setShowAddModal(false)
  }

  // Edit app-limit drawer state
  const [editingAppId, setEditingAppId] = useState<string | null>(null)
  const [editingLimitVal, setEditingLimitVal] = useState<number>(60)

  // Edit weekday/weekend scheduler
  const [editingScheduleType, setEditingScheduleType] = useState<
    "weekday" | "weekend" | null
  >(null)
  const [scheduleLimitVal, setScheduleLimitVal] = useState<number>(90)

  // Filter pending requests for this child or overall
  const pendingRequests = demoEmpty
    ? []
    : extraTimeRequests.filter((r) => r.status === "pending")

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

  const handleOpenScheduleEditor = (
    type: "weekday" | "weekend",
    currentLimit: number
  ) => {
    setEditingScheduleType(type)
    setScheduleLimitVal(currentLimit)
  }

  const handleSaveSchedule = () => {
    if (!editingScheduleType) return
    updateChildLimit(selectedChildId, editingScheduleType, scheduleLimitVal)
    setEditingScheduleType(null)
  }

  // Ring calculations
  const limitToday = demoEmpty ? 0 : activeChildProfile.timeSpentToday
  const maxLimitToday = activeChildProfile.weekdayLimitMinutes
  const percentage = Math.min(limitToday / maxLimitToday, 1)

  return (
    <section className="flex flex-col gap-4 select-none">
      <div>
        <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
          Parent Portal
        </span>

        <h1 className="mt-0.5 font-heading text-2xl font-bold tracking-tight text-foreground/90">
          Family Hub
        </h1>
      </div>

      <div className="flex items-center rounded-xl border border-border/40 bg-white/40 p-1 backdrop-blur-md dark:bg-slate-800/40">
        {childProfiles.map((child) => {
          const isSelected = child.id === selectedChildId

          return (
            <button
              key={child.id}
              onClick={() => setSelectedChildId(child.id)}
              className={`relative flex-1 cursor-pointer rounded-lg py-2 text-xs font-bold transition-colors active:scale-95`}
            >
              {isSelected && (
                <motion.div
                  layoutId="activeChildTabB"
                  className="absolute inset-0 rounded-lg bg-primary shadow-sm"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}

              <span
                className={`relative z-10 flex items-center justify-center gap-1.5 ${isSelected ? "text-primary-foreground" : "text-muted-foreground"}`}
              >
                <span
                  className="h-2 w-2 animate-pulse rounded-full shadow-sm"
                  style={{ backgroundColor: child.avatarColor }}
                />
                {child.name}
              </span>
            </button>
          )
        })}

        <button
          onClick={handleOpenAddChild}
          className="mr-1 ml-1 flex shrink-0 cursor-pointer items-center justify-center rounded-lg p-2 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
          title="Add new child profile"
        >
          <PlusIcon size={15} weight="bold" />
        </button>
      </div>

      <AnimatePresence mode="popLayout">
        {!demoEmpty && pendingRequests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="flex flex-col gap-3 rounded-2xl border border-amber-500/20 bg-gradient-to-tr from-amber-500/10 to-orange-500/5 p-4.5 shadow-sm backdrop-blur-xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-1.5 font-heading text-xs font-bold tracking-wider text-amber-700 uppercase dark:text-amber-400">
                <HourglassIcon
                  size={16}
                  weight="fill"
                  className="animate-spin-slow"
                />

                <span>Pending Approvals ({pendingRequests.length})</span>
              </h3>

              <span className="h-2 w-2 animate-ping rounded-full bg-amber-500" />
            </div>

            <div className="flex flex-col gap-2.5">
              {pendingRequests.map((req) => {
                const requester =
                  childProfiles.find((c) => c.id === req.childId)?.name ||
                  "Child"
                const targetAppName =
                  appStats.find((a) => a.id === req.appId)?.name || "App"

                return (
                  <motion.div
                    key={req.id}
                    layout
                    className="flex flex-col gap-3 rounded-xl border border-border/40 bg-white/60 p-3.5 shadow-sm dark:bg-slate-800/60"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold tracking-wide text-amber-600 uppercase">
                          {requester} requested time
                        </span>

                        <h4 className="mt-0.5 text-sm font-extrabold text-foreground">
                          {targetAppName}
                        </h4>

                        <p className="mt-1 text-[10px] font-semibold text-muted-foreground">
                          wants{" "}
                          <span className="font-bold text-primary">
                            +{req.minutesRequested} mins
                          </span>{" "}
                          allowance for today
                        </p>
                      </div>

                      <span className="rounded-full border border-border/30 bg-secondary/80 px-2 py-0.5 text-[9px] font-bold text-muted-foreground/80">
                        {req.timestamp}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2 border-t border-border/40 pt-3">
                      <button
                        onClick={() => handleExtraTimeRequest(req.id, "reject")}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-border/80 bg-secondary text-muted-foreground transition-colors hover:bg-muted hover:text-rose-500 active:scale-95"
                      >
                        <XIcon size={14} weight="bold" />
                      </button>

                      <button
                        onClick={() =>
                          handleExtraTimeRequest(req.id, "approve")
                        }
                        className="flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-emerald-600/20 bg-emerald-500 px-3 text-xs font-bold text-white shadow-md transition-colors hover:bg-emerald-600 active:scale-95"
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

      <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-gradient-to-tr from-white/60 to-purple-50/50 p-4.5 shadow-sm backdrop-blur-xl dark:from-slate-900/60 dark:to-purple-950/20">
        <div className="flex flex-col gap-1.5">
          <span className="text-[9px] font-bold tracking-wider text-muted-foreground uppercase">
            Screen Time Today
          </span>

          <h3 className="font-heading text-3xl font-black tracking-tight text-foreground/90">
            {demoEmpty ? "0m" : childScreenTimeFormatted}
          </h3>

          <p className="text-[10px] font-semibold text-muted-foreground">
            Limit: Max {activeChildProfile.weekdayLimitMinutes}m on weekdays
          </p>
        </div>

        <div className="relative h-[80px] w-[80px]">
          <svg className="h-full w-full -rotate-90">
            <defs>
              <linearGradient
                id="childRingGradB"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor={activeChildProfile.avatarColor} />

                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>

            <circle
              cx="40"
              cy="40"
              r="32"
              fill="none"
              stroke="currentColor"
              className="text-muted/10 dark:text-muted/5"
              strokeWidth="5.5"
            />

            <motion.circle
              cx="40"
              cy="40"
              r="32"
              fill="none"
              stroke="url(#childRingGradB)"
              strokeWidth="5.5"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 32}
              initial={{ strokeDashoffset: 2 * Math.PI * 32 }}
              animate={{
                strokeDashoffset: 2 * Math.PI * 32 * (1 - percentage),
              }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-extrabold text-white shadow-md"
              style={{ backgroundColor: activeChildProfile.avatarColor }}
            >
              {activeChildProfile.name.charAt(0)}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-gradient-to-tr from-white/60 to-purple-50/50 p-4.5 shadow-sm backdrop-blur-xl dark:from-slate-900/60 dark:to-purple-950/20">
        <h3 className="mb-4 flex items-center gap-1.5 font-heading text-xs font-bold tracking-wider text-muted-foreground uppercase">
          <CalendarBlankIcon
            size={18}
            weight="duotone"
            className="text-primary"
          />

          <span>Bedtime Routines allowance</span>
        </h3>

        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between rounded-xl border border-border/30 bg-white/40 p-3 dark:bg-slate-800/40">
            <div>
              <span className="text-xs font-semibold text-foreground/90">
                Weekday Limit
              </span>

              <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">
                Monday–Friday allowance limit
              </p>
            </div>

            <button
              onClick={() =>
                handleOpenScheduleEditor(
                  "weekday",
                  activeChildProfile.weekdayLimitMinutes
                )
              }
              className="flex h-9 cursor-pointer items-center gap-1 rounded-xl border border-border bg-secondary/80 px-3 text-xs font-bold text-foreground/80 transition-colors active:scale-95"
            >
              <span>{activeChildProfile.weekdayLimitMinutes}m</span>

              <ClockIcon size={14} />
            </button>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border/30 bg-white/40 p-3 dark:bg-slate-800/40">
            <div>
              <span className="text-xs font-semibold text-foreground/90">
                Weekend Limit
              </span>

              <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">
                Saturday–Sunday allowance limit
              </p>
            </div>

            <button
              onClick={() =>
                handleOpenScheduleEditor(
                  "weekend",
                  activeChildProfile.weekendLimitMinutes
                )
              }
              className="flex h-9 cursor-pointer items-center gap-1 rounded-xl border border-border bg-secondary/80 px-3 text-xs font-bold text-foreground/80 transition-colors active:scale-95"
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
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 overflow-hidden"
            >
              <div className="flex flex-col gap-3.5 rounded-xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="capitalize">
                    {editingScheduleType} limit duration:
                  </span>

                  <span className="font-black text-primary">
                    {scheduleLimitVal} mins
                  </span>
                </div>

                <input
                  type="range"
                  min="30"
                  max="300"
                  step="15"
                  value={scheduleLimitVal}
                  onChange={(e) =>
                    setScheduleLimitVal(parseInt(e.target.value))
                  }
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted/40 accent-primary"
                />

                <div className="mt-1.5 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setEditingScheduleType(null)}
                    className="h-8 cursor-pointer rounded-lg px-3 text-xs font-semibold text-muted-foreground hover:bg-secondary"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSaveSchedule}
                    className="h-8 cursor-pointer rounded-lg bg-primary px-3.5 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-95"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="rounded-2xl border border-border/80 bg-gradient-to-tr from-white/60 to-purple-50/50 p-4.5 shadow-sm backdrop-blur-xl dark:from-slate-900/60 dark:to-purple-950/20">
        <h3 className="mb-4 font-heading text-xs font-bold tracking-wider text-muted-foreground uppercase">
          App-Specific Rules
        </h3>

        <div className="flex flex-col gap-2.5">
          {appStats
            .filter((a) => {
              if (selectedChildId === "alex") {
                return ["minecraft", "yt", "insta"].includes(a.id)
              }
              return ["tiktok", "yt", "insta"].includes(a.id)
            })
            .map((app) => {
              const childLimits = childAppLimits[selectedChildId] || {}
              const currentLimit = childLimits[app.id]
              const lockedApps = childManualLocks[selectedChildId] || []
              const isManualLocked = lockedApps.includes(app.id)
              const timeSpent = demoEmpty
                ? 0
                : getChildAppTimeSpent(selectedChildId, app.id)
              const isExpanded = editingAppId === app.id

              return (
                <div
                  key={app.id}
                  className="flex flex-col gap-3 rounded-xl border border-border/30 bg-white/40 p-3 dark:bg-slate-800/40"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-extrabold text-foreground/90">
                        {app.name}
                      </span>

                      <p className="mt-0.5 text-[10px] font-semibold text-muted-foreground">
                        Usage: {timeSpent}m of{" "}
                        {currentLimit !== undefined
                          ? `${currentLimit}m`
                          : "no limit"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          toggleChildManualLock(selectedChildId, app.id)
                        }
                        className={`cursor-pointer rounded-lg border p-2 transition-all active:scale-90 ${
                          isManualLocked
                            ? "border-rose-100 bg-rose-50 text-rose-600 dark:border-rose-900/30 dark:bg-rose-950/20 dark:text-rose-400"
                            : "border-border/80 bg-secondary text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {isManualLocked ? (
                          <LockIcon size={14} weight="fill" />
                        ) : (
                          <LockOpenIcon size={14} weight="regular" />
                        )}
                      </button>

                      <button
                        onClick={() =>
                          handleOpenAppLimitEditor(app.id, currentLimit)
                        }
                        className="h-8.5 cursor-pointer rounded-lg border border-border/80 bg-secondary px-3 text-[11px] font-bold text-foreground/80 transition-colors hover:bg-muted active:scale-95"
                      >
                        {currentLimit !== undefined
                          ? `${currentLimit}m`
                          : "Set Limit"}
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-1 flex flex-col gap-3 rounded-lg border border-border/60 bg-secondary/80 p-3">
                          <div className="flex items-center justify-between text-[11px] font-semibold">
                            <span>
                              {activeChildProfile.name} daily {app.name} limit:
                            </span>

                            <span className="font-black text-primary">
                              {editingLimitVal} Mins
                            </span>
                          </div>

                          <input
                            type="range"
                            min="15"
                            max="180"
                            step="15"
                            value={editingLimitVal}
                            onChange={(e) =>
                              setEditingLimitVal(parseInt(e.target.value))
                            }
                            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted/40 accent-primary"
                          />

                          <div className="mt-1 flex justify-end gap-2">
                            {currentLimit !== undefined && (
                              <button
                                onClick={() => handleRemoveAppLimit(app.id)}
                                className="h-8 cursor-pointer rounded-lg border border-rose-100 bg-rose-50 px-3 text-[11px] font-bold text-rose-600 transition-colors"
                              >
                                Disable
                              </button>
                            )}

                            <button
                              onClick={() => handleSaveAppLimit(app.id)}
                              className="h-8 cursor-pointer rounded-lg bg-primary px-3 text-[11px] font-bold text-primary-foreground shadow-sm transition-colors hover:opacity-90"
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

      <div className="rounded-2xl border border-border/80 bg-gradient-to-tr from-white/60 to-purple-50/50 p-4.5 shadow-sm backdrop-blur-xl dark:from-slate-900/60 dark:to-purple-950/20">
        <h3 className="mb-3.5 flex items-center gap-1.5 font-heading text-xs font-bold tracking-wider text-muted-foreground uppercase">
          <GlobeIcon size={18} weight="duotone" className="text-purple-500" />

          <span>Web Filter Policies</span>
        </h3>

        <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl border border-border/30 bg-white/40 p-1 dark:bg-slate-800/40">
          <button
            onClick={() => setActiveListTab("blacklist")}
            className={`cursor-pointer rounded-lg py-2 text-xs font-bold transition-all ${
              activeListTab === "blacklist"
                ? "bg-background font-extrabold text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            Blocked Domains
          </button>

          <button
            onClick={() => setActiveListTab("whitelist")}
            className={`cursor-pointer rounded-lg py-2 text-xs font-bold transition-all ${
              activeListTab === "whitelist"
                ? "bg-background font-extrabold text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            Whitelisted
          </button>
        </div>

        <div className="mb-3.5 flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="e.g. roblox.com"
              value={childDomainInput}
              onChange={(e) => setChildDomainInput(e.target.value)}
              className="dark:bg-slate-850/40 h-11 flex-1 rounded-xl border border-border bg-white/40 px-4 text-sm text-foreground focus:border-primary/50 focus:outline-none"
            />

            {/* Added distinct direct actions for "Block" and "Whitelist" */}
            <div className="flex shrink-0 gap-1.5">
              {activeListTab === "blacklist" ? (
                <button
                  onClick={handleAddChildBlacklist}
                  className="flex h-11 cursor-pointer items-center justify-center gap-1 rounded-xl border border-rose-600/20 bg-rose-500 px-3 text-xs font-bold text-white shadow-sm transition-colors hover:bg-rose-600 active:scale-95"
                >
                  <WarningCircleIcon size={14} weight="bold" />

                  <span>Block Site</span>
                </button>
              ) : (
                <button
                  onClick={handleAddChildWhitelist}
                  className="flex h-11 cursor-pointer items-center justify-center gap-1 rounded-xl border border-emerald-600/20 bg-emerald-500 px-3 text-xs font-bold text-white shadow-sm transition-colors hover:bg-emerald-600 active:scale-95"
                >
                  <CheckIcon size={14} weight="bold" />

                  <span>Allow Site</span>
                </button>
              )}
            </div>
          </div>

          {childDomainError && (
            <span className="pl-1 text-[11px] font-medium text-rose-500">
              {childDomainError}
            </span>
          )}
        </div>

        <div className="flex max-h-36 flex-col gap-2 overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {demoEmpty ? (
              <div className="py-5 text-center text-xs text-muted-foreground">
                List empty (demo state)
              </div>
            ) : activeListTab === "blacklist" ? (
              activeChildProfile.blacklist.length === 0 ? (
                <div className="py-5 text-center text-xs text-muted-foreground">
                  All domains allowed
                </div>
              ) : (
                activeChildProfile.blacklist.map((domain) => (
                  <motion.div
                    key={domain}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center justify-between rounded-xl border border-rose-500/10 bg-rose-500/5 p-2.5 text-xs font-semibold text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400"
                  >
                    <span>{domain}</span>

                    <button
                      onClick={() =>
                        removeChildBlacklist(selectedChildId, domain)
                      }
                      className="text-rose-650 dark:text-rose-450 cursor-pointer rounded-lg p-1 hover:bg-rose-500/10 active:scale-90"
                    >
                      <TrashIcon size={14} />
                    </button>
                  </motion.div>
                ))
              )
            ) : activeChildProfile.whitelist.length === 0 ? (
              <div className="py-5 text-center text-xs text-muted-foreground">
                No whitelists defined
              </div>
            ) : (
              activeChildProfile.whitelist.map((domain) => (
                <motion.div
                  key={domain}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center justify-between rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-2.5 text-xs font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
                >
                  <span>{domain}</span>

                  <button
                    onClick={() =>
                      removeChildWhitelist(selectedChildId, domain)
                    }
                    className="text-emerald-650 dark:text-emerald-450 cursor-pointer rounded-lg p-1 hover:bg-emerald-500/10 active:scale-90"
                  >
                    <TrashIcon size={14} />
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-border/80 bg-gradient-to-tr from-white/60 to-purple-50/50 p-4.5 shadow-sm backdrop-blur-xl dark:from-slate-900/60 dark:to-purple-950/20">
        <h3 className="mb-3.5 flex items-center gap-1.5 font-heading text-xs font-bold tracking-wider text-muted-foreground uppercase">
          <CameraIcon size={18} weight="duotone" className="text-blue-500" />

          <span>Screen Monitoring Logs</span>
        </h3>

        <div className="flex flex-col gap-2.5">
          {demoEmpty ? (
            <div className="py-5 text-center text-xs text-muted-foreground">
              No screen snapshots logged today
            </div>
          ) : (
            [
              {
                id: "s1",
                time: "17:15",
                app: "Notion",
                desc: "Working on school notes",
              },
              {
                id: "s2",
                time: "16:45",
                app: "Duolingo",
                desc: "Spanish lesson streak active",
              },
            ].map((snap) => (
              <div
                key={snap.id}
                className="flex items-center gap-3 rounded-xl border border-border/30 bg-white/40 p-3 transition-colors hover:bg-secondary/45 dark:bg-slate-800/40"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-200/20 bg-gradient-to-tr from-blue-100 to-indigo-100 text-blue-600 dark:from-blue-950/40 dark:to-indigo-950/40 dark:text-blue-400">
                  <CameraIcon size={22} weight="regular" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 flex items-center justify-between text-xs font-semibold">
                    <span className="text-foreground">{snap.app}</span>

                    <span className="text-muted-foreground">{snap.time}</span>
                  </div>

                  <p className="truncate text-[10px] font-medium text-muted-foreground">
                    {snap.desc}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal / Dialog for Add Child */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-border bg-card p-6 text-foreground shadow-xl select-none"
            >
              <h3 className="font-heading text-base font-bold tracking-tight text-foreground/90">
                Add child profile
              </h3>

              <div className="flex flex-col gap-1.5">
                <span className="pl-1 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                  Child's Name
                </span>

                <input
                  type="text"
                  placeholder="e.g. Liam"
                  value={newChildName}
                  onChange={(e) => setNewChildName(e.target.value)}
                  className="h-10 rounded-xl border border-border bg-secondary/40 px-3.5 text-xs font-bold text-foreground focus:border-primary/50 focus:outline-none"
                  maxLength={15}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="pl-1 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                  Age
                </span>

                <div className="flex items-center gap-2">
                  {[6, 8, 10, 12, 14, 16].map((ageVal) => (
                    <button
                      key={ageVal}
                      onClick={() => setNewChildAge(ageVal)}
                      className={`h-8 flex-1 cursor-pointer rounded-lg border text-[10px] font-black transition-all ${
                        newChildAge === ageVal
                          ? "border-primary/20 bg-primary text-primary-foreground shadow-sm"
                          : "border-border/50 bg-secondary/60 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {ageVal} y/o
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="pl-1 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                  Avatar Color
                </span>

                <div className="flex justify-center gap-3 py-1">
                  {["#818CF8", "#F472B6", "#34D399", "#FB923C", "#C084FC"].map(
                    (color) => (
                      <button
                        key={color}
                        onClick={() => setNewChildColor(color)}
                        className={`h-7 w-7 cursor-pointer rounded-full border-2 transition-all ${
                          newChildColor === color
                            ? "scale-110 border-primary"
                            : "border-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    )
                  )}
                </div>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-3 border-t border-border/40 pt-4">
                <button
                  onClick={handleCloseAddChild}
                  className="h-10 cursor-pointer rounded-xl border border-border bg-secondary text-xs font-bold text-foreground/80 transition-all hover:bg-muted active:scale-95"
                >
                  Cancel
                </button>

                <button
                  onClick={handleCreateChild}
                  className="h-10 cursor-pointer rounded-xl bg-primary text-xs font-black text-primary-foreground shadow-md transition-all active:scale-95"
                >
                  Create Profile
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default LayoutParentalB
