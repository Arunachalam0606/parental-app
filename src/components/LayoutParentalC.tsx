import { useState } from "react"

import { motion, AnimatePresence } from "framer-motion"

import { useWellbeingLogic } from "@/hooks/useWellbeingLogic"

import {
  TrashIcon,
  ClockIcon,
  XIcon,
  HourglassIcon,
  LockIcon,
  LockOpenIcon,
  WarningCircleIcon,
  UserPlusIcon,
} from "@phosphor-icons/react"

export const LayoutParentalC = () => {
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
  const [newChildColor, setNewChildColor] = useState<string>("#f59e0b")

  const handleOpenAddChild = () => {
    setNewChildName("")
    setNewChildAge(10)
    setNewChildColor("#f59e0b")
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

  // Ring progress
  const limitToday = demoEmpty ? 0 : activeChildProfile.timeSpentToday
  const maxLimitToday = activeChildProfile.weekdayLimitMinutes
  const percentage = Math.min(limitToday / maxLimitToday, 1)

  return (
    <section className="flex flex-col gap-5 p-4 select-none">
      {/* Title */}
      <div>
        <span className="flex items-center gap-1 text-[10px] font-black tracking-widest text-amber-500 uppercase dark:text-amber-400">
          <ClockIcon size={12} weight="fill" className="animate-pulse" />
          <span>Cosmic Command</span>
        </span>
        <h1 className="mt-1 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 bg-clip-text font-heading text-2xl font-black tracking-tight text-transparent dark:from-amber-400 dark:via-rose-400 dark:to-indigo-300">
          Family Center
        </h1>
      </div>

      {/* Children Selectors */}
      <div className="flex items-center rounded-2xl border border-purple-200/50 bg-white/20 p-1 dark:border-purple-900/30 dark:bg-slate-900/40">
        {childProfiles.map((child) => {
          const isSelected = child.id === selectedChildId

          return (
            <button
              key={child.id}
              onClick={() => setSelectedChildId(child.id)}
              className="relative flex-1 cursor-pointer rounded-xl border-none py-2 text-xs font-black transition-colors outline-none active:scale-95"
            >
              {isSelected && (
                <motion.div
                  layoutId="activeChildTabC"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md shadow-indigo-500/10"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}

              <span
                className={`relative z-10 flex items-center justify-center gap-1.5 ${isSelected ? "text-white" : "text-muted-foreground"}`}
              >
                <span
                  className="h-2 w-2 rounded-full shadow-sm"
                  style={{ backgroundColor: child.avatarColor }}
                />
                {child.name}
              </span>
            </button>
          )
        })}

        <button
          onClick={handleOpenAddChild}
          className="mr-1 ml-1 flex shrink-0 cursor-pointer items-center justify-center rounded-xl p-2 text-muted-foreground hover:text-primary active:scale-90"
        >
          <UserPlusIcon size={16} weight="bold" />
        </button>
      </div>

      {/* Real-time Time Request Alerts */}
      <AnimatePresence mode="popLayout">
        {!demoEmpty && pendingRequests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="flex flex-col gap-3 rounded-3xl border border-rose-300/30 bg-gradient-to-r from-amber-500/5 via-rose-500/5 to-purple-500/5 p-4 shadow-[0_8px_32px_rgba(244,63,94,0.06)] backdrop-blur-xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-1.5 font-heading text-xs font-black tracking-wider text-rose-600 uppercase dark:text-rose-400">
                <HourglassIcon
                  size={16}
                  weight="fill"
                  className="animate-spin-slow text-amber-500"
                />
                <span>Pending Approvals ({pendingRequests.length})</span>
              </h3>
              <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
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
                    className="flex flex-col gap-3 rounded-2xl border border-purple-200/50 bg-white/40 p-4 shadow-sm dark:border-purple-900/25 dark:bg-slate-900/40"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[9px] font-black tracking-widest text-amber-500 uppercase">
                          {requester} requests time
                        </span>
                        <h4 className="mt-0.5 text-sm font-black text-foreground">
                          {targetAppName}
                        </h4>
                        <p className="mt-1 text-[10px] font-semibold text-muted-foreground">
                          Needs{" "}
                          <span className="font-bold text-rose-500">
                            +{req.minutesRequested} mins
                          </span>{" "}
                          today
                        </p>
                      </div>

                      <span className="rounded-lg border border-purple-200/30 bg-purple-500/5 px-2 py-0.5 text-[9px] font-bold text-purple-600 dark:text-purple-400">
                        {req.timestamp}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2 border-t border-purple-200/30 pt-3 dark:border-purple-900/20">
                      <button
                        onClick={() => handleExtraTimeRequest(req.id, "reject")}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-purple-200/40 bg-white/60 text-muted-foreground/80 hover:text-rose-500 active:scale-90 dark:border-purple-900/30 dark:bg-slate-900/30"
                      >
                        <XIcon size={14} weight="bold" />
                      </button>
                      <button
                        onClick={() =>
                          handleExtraTimeRequest(req.id, "approve")
                        }
                        className="flex h-8 cursor-pointer items-center justify-center rounded-lg bg-gradient-to-r from-amber-500 to-rose-500 px-4 text-[10px] font-black text-white shadow-sm active:scale-95"
                      >
                        Approve
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Child usage dashboard overview */}
      <div className="flex flex-col gap-4 rounded-3xl border border-purple-300/30 bg-white/30 p-5 shadow-[0_12px_30px_rgba(147,51,234,0.08)] backdrop-blur-xl dark:border-purple-950/20 dark:bg-slate-950/30">
        <div className="flex items-center justify-between border-b border-purple-200/40 pb-2 dark:border-purple-900/20">
          <div>
            <span className="text-[9px] font-bold tracking-widest text-muted-foreground uppercase">
              Allowance node
            </span>
            <h3 className="mt-0.5 font-heading text-base font-black text-foreground">
              {activeChildProfile.name} Stats
            </h3>
          </div>
          <div className="text-right">
            <span className="text-xs font-black text-foreground">
              {childScreenTimeFormatted}
            </span>
            <p className="text-[9px] font-semibold text-muted-foreground">
              Used of {maxLimitToday}m limit
            </p>
          </div>
        </div>

        {/* Circular radial gauge representing child's time usage */}
        <div className="flex items-center justify-around gap-4 py-2">
          <div className="relative flex h-[95px] w-[95px] items-center justify-center">
            <svg className="absolute inset-0 h-full w-full -rotate-90">
              <circle
                cx="47.5"
                cy="47.5"
                r="40"
                className="fill-none stroke-purple-100 dark:stroke-purple-950/20"
                strokeWidth="7"
              />
              <motion.circle
                cx="47.5"
                cy="47.5"
                r="40"
                className="fill-none stroke-purple-500 dark:stroke-purple-400"
                strokeWidth="7"
                strokeDasharray="251"
                initial={{ strokeDashoffset: 251 }}
                animate={{ strokeDashoffset: 251 - 251 * percentage }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>
            <div className="text-center">
              <span className="font-heading text-base font-black text-foreground">
                {Math.round(percentage * 100)}%
              </span>
              <span className="block text-[8px] font-semibold text-muted-foreground uppercase">
                Used
              </span>
            </div>
          </div>

          {/* Schedulers */}
          <div className="flex flex-1 flex-col gap-2.5">
            <div
              onClick={() =>
                handleOpenScheduleEditor(
                  "weekday",
                  activeChildProfile.weekdayLimitMinutes
                )
              }
              className="flex cursor-pointer items-center justify-between rounded-xl border border-purple-200/50 bg-white/20 p-2.5 hover:bg-white/40 active:scale-98 dark:border-purple-900/30 dark:bg-slate-900/40"
            >
              <div>
                <span className="text-[10px] font-black text-foreground">
                  Weekdays
                </span>
                <p className="mt-0.5 text-[9px] text-muted-foreground">
                  Mon - Fri allowance
                </p>
              </div>
              <span className="text-xs font-black text-purple-600 dark:text-purple-400">
                {activeChildProfile.weekdayLimitMinutes}m
              </span>
            </div>

            <div
              onClick={() =>
                handleOpenScheduleEditor(
                  "weekend",
                  activeChildProfile.weekendLimitMinutes
                )
              }
              className="flex cursor-pointer items-center justify-between rounded-xl border border-purple-200/50 bg-white/20 p-2.5 hover:bg-white/40 active:scale-98 dark:border-purple-900/30 dark:bg-slate-900/40"
            >
              <div>
                <span className="text-[10px] font-black text-foreground">
                  Weekends
                </span>
                <p className="mt-0.5 text-[9px] text-muted-foreground">
                  Sat - Sun allowance
                </p>
              </div>
              <span className="text-xs font-black text-purple-600 dark:text-purple-400">
                {activeChildProfile.weekendLimitMinutes}m
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Whitelist / Blacklist with direct site blocking */}
      <div className="flex flex-col gap-4 rounded-3xl border border-purple-300/30 bg-white/30 p-5 shadow-[0_12px_30px_rgba(147,51,234,0.08)] backdrop-blur-xl dark:border-purple-950/20 dark:bg-slate-950/30">
        <div className="flex border-b border-purple-200/40 pb-2.5 dark:border-purple-900/20">
          <button
            onClick={() => setActiveListTab("blacklist")}
            className={`flex-1 border-b-2 pb-2 text-center text-xs font-black transition-all ${
              activeListTab === "blacklist"
                ? "border-rose-500 text-foreground"
                : "border-transparent text-muted-foreground"
            }`}
          >
            Blocked Sites
          </button>
          <button
            onClick={() => setActiveListTab("whitelist")}
            className={`flex-1 border-b-2 pb-2 text-center text-xs font-black transition-all ${
              activeListTab === "whitelist"
                ? "border-emerald-500 text-foreground"
                : "border-transparent text-muted-foreground"
            }`}
          >
            Approved Sites
          </button>
        </div>

        {/* Input */}
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. reddit.com"
              value={childDomainInput}
              onChange={(e) => setChildDomainInput(e.target.value)}
              className="h-10 flex-1 rounded-xl border border-purple-200/60 bg-white/20 px-3 text-xs text-foreground placeholder-muted-foreground/60 focus:border-rose-500/50 focus:outline-none dark:border-purple-900/30 dark:bg-slate-900/40"
            />
            <button
              onClick={
                activeListTab === "blacklist"
                  ? handleAddChildBlacklist
                  : handleAddChildWhitelist
              }
              className={`h-10 cursor-pointer rounded-xl px-4 text-xs font-black text-white shadow-sm active:scale-95 ${
                activeListTab === "blacklist" ? "bg-rose-500" : "bg-emerald-500"
              }`}
            >
              Add
            </button>
          </div>
          {childDomainError && (
            <span className="flex items-center gap-1 pl-1 text-[10px] font-bold text-rose-500">
              <WarningCircleIcon size={12} />
              {childDomainError}
            </span>
          )}
        </div>

        {/* List items with direct Action */}
        <div className="flex max-h-36 flex-col gap-2 overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {activeListTab === "blacklist" ? (
              activeChildProfile.blacklist.length === 0 ? (
                <div className="py-4 text-center text-xs text-muted-foreground/80">
                  No blocked sites
                </div>
              ) : (
                activeChildProfile.blacklist.map((domain) => (
                  <motion.div
                    key={domain}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center justify-between rounded-xl border border-purple-200/50 bg-white/20 p-2.5 text-xs font-medium text-foreground/85 dark:border-purple-900/25 dark:bg-slate-900/30"
                  >
                    <span className="dark:text-rose-450 flex items-center gap-1.5 text-xs font-bold text-rose-600">
                      <LockIcon size={12} />
                      {domain}
                    </span>
                    <button
                      onClick={() =>
                        removeChildBlacklist(selectedChildId, domain)
                      }
                      className="cursor-pointer rounded-lg p-1 text-muted-foreground/60 hover:bg-white/50 hover:text-foreground active:scale-90"
                    >
                      <TrashIcon size={14} />
                    </button>
                  </motion.div>
                ))
              )
            ) : activeChildProfile.whitelist.length === 0 ? (
              <div className="py-4 text-center text-xs text-muted-foreground/80">
                No approved sites
              </div>
            ) : (
              activeChildProfile.whitelist.map((domain) => (
                <motion.div
                  key={domain}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center justify-between rounded-xl border border-purple-200/50 bg-white/20 p-2.5 text-xs font-medium text-foreground/85 dark:border-purple-900/25 dark:bg-slate-900/30"
                >
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <LockOpenIcon size={12} />
                    {domain}
                  </span>
                  <button
                    onClick={() =>
                      removeChildWhitelist(selectedChildId, domain)
                    }
                    className="cursor-pointer rounded-lg p-1 text-muted-foreground/60 hover:bg-white/50 hover:text-foreground active:scale-90"
                  >
                    <TrashIcon size={14} />
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* App Schedules & locks */}
      <div className="flex flex-col gap-4 rounded-3xl border border-purple-300/30 bg-white/30 p-5 shadow-[0_12px_30px_rgba(147,51,234,0.08)] backdrop-blur-xl dark:border-purple-950/20 dark:bg-slate-950/30">
        <h3 className="font-heading text-xs font-bold tracking-wider text-muted-foreground uppercase">
          App Constraints
        </h3>

        <div className="flex flex-col gap-3">
          {appStats
            .filter((a) => a.id !== "notion" && a.id !== "chase") // Social / Entertainment
            .map((app) => {
              const childLimits = childAppLimits[selectedChildId] || {}
              const limitMins = childLimits[app.id] || 0
              const timeSpent = getChildAppTimeSpent(selectedChildId, app.id)
              const locks = childManualLocks[selectedChildId] || []
              const isLocked = locks.includes(app.id)

              return (
                <div
                  key={app.id}
                  className="flex items-center justify-between rounded-2xl border border-purple-200/50 bg-white/35 p-3.5 dark:border-purple-900/20 dark:bg-slate-900/35"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-xs font-black text-purple-600">
                      {app.name.charAt(0)}
                    </div>
                    <div>
                      <span className="text-xs font-black text-foreground/85">
                        {app.name}
                      </span>
                      <p className="mt-0.5 text-[9px] font-semibold text-muted-foreground">
                        Spent: {demoEmpty ? "0m" : `${timeSpent}m`} • Limit:{" "}
                        {limitMins ? `${limitMins}m` : "None"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleOpenAppLimitEditor(app.id, limitMins)
                      }
                      className="h-8 cursor-pointer rounded-xl bg-purple-500/10 px-3 text-[10px] font-black text-purple-600 hover:bg-purple-500/20 active:scale-95 dark:text-purple-300"
                    >
                      Limit
                    </button>
                    <button
                      onClick={() =>
                        toggleChildManualLock(selectedChildId, app.id)
                      }
                      className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl active:scale-95 ${
                        isLocked
                          ? "bg-rose-500 text-white"
                          : "bg-purple-100 text-muted-foreground dark:bg-purple-950/40"
                      }`}
                    >
                      <LockIcon size={14} weight="bold" />
                    </button>
                  </div>
                </div>
              )
            })}
        </div>
      </div>

      {/* Edit schedule Modal */}
      <AnimatePresence>
        {editingScheduleType !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-5 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="w-full max-w-[270px] rounded-3xl border border-purple-300/30 bg-card p-5 text-foreground shadow-2xl dark:border-purple-900/35"
            >
              <h4 className="font-heading text-sm font-black text-foreground capitalize">
                Adjust {editingScheduleType}
              </h4>
              <p className="mt-1 text-[9px] font-semibold text-muted-foreground">
                Adjust child daily screen allowance
              </p>

              <div className="my-5 flex items-center justify-center gap-5">
                <button
                  onClick={() =>
                    setScheduleLimitVal((m) => Math.max(15, m - 15))
                  }
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 active:scale-90"
                >
                  -
                </button>
                <span className="text-xl font-black">{scheduleLimitVal}m</span>
                <button
                  onClick={() =>
                    setScheduleLimitVal((m) => Math.min(360, m + 15))
                  }
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 active:scale-90"
                >
                  +
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setEditingScheduleType(null)}
                  className="h-9 flex-1 cursor-pointer rounded-xl border border-purple-200/50 bg-secondary px-3 text-[10px] font-bold text-foreground"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSchedule}
                  className="h-9 flex-1 cursor-pointer rounded-xl bg-purple-600 text-[10px] font-black text-white"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit App Limit Modal */}
      <AnimatePresence>
        {editingAppId !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-5 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="w-full max-w-[270px] rounded-3xl border border-purple-300/30 bg-card p-5 text-foreground shadow-2xl dark:border-purple-900/35"
            >
              <h4 className="font-heading text-sm font-black text-foreground">
                Set App Limit
              </h4>
              <p className="mt-1 text-[9px] font-semibold text-muted-foreground">
                Adjust specific app maximum daily allowance
              </p>

              <div className="my-5 flex items-center justify-center gap-5">
                <button
                  onClick={() =>
                    setEditingLimitVal((m) => Math.max(15, m - 15))
                  }
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 active:scale-90"
                >
                  -
                </button>
                <span className="text-xl font-black">{editingLimitVal}m</span>
                <button
                  onClick={() =>
                    setEditingLimitVal((m) => Math.min(240, m + 15))
                  }
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 active:scale-90"
                >
                  +
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingAppId(null)}
                    className="h-9 flex-1 cursor-pointer rounded-xl border border-purple-200/50 bg-secondary px-3 text-[10px] font-bold text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveAppLimit(editingAppId)}
                    className="h-9 flex-1 cursor-pointer rounded-xl bg-purple-600 text-[10px] font-black text-white"
                  >
                    Save
                  </button>
                </div>
                {childAppLimits[selectedChildId]?.[editingAppId] > 0 && (
                  <button
                    onClick={() => handleRemoveAppLimit(editingAppId)}
                    className="h-9 w-full cursor-pointer rounded-xl border border-rose-500/30 bg-rose-500/10 text-[10px] font-black text-rose-500 active:scale-95"
                  >
                    Remove Limit
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Child Profile Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-5 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="w-full max-w-[270px] rounded-3xl border border-purple-300/30 bg-card p-5 text-foreground shadow-2xl dark:border-purple-900/35"
            >
              <h4 className="font-heading text-sm font-black text-foreground">
                Add Child Profile
              </h4>

              <div className="my-4 flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newChildName}
                    onChange={(e) => setNewChildName(e.target.value)}
                    placeholder="e.g. Liam"
                    className="h-9 rounded-xl border border-purple-200/50 bg-white/20 px-3 text-xs text-foreground focus:outline-none dark:border-purple-900/30 dark:bg-slate-900/40"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase">
                    Age ({newChildAge})
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="17"
                    value={newChildAge}
                    onChange={(e) => setNewChildAge(parseInt(e.target.value))}
                    className="accent-purple-650 w-full"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase">
                    Avatar Color
                  </label>
                  <div className="flex justify-between gap-1.5 pt-1">
                    {[
                      "#f59e0b",
                      "#ec4899",
                      "#8b5cf6",
                      "#3b82f6",
                      "#10b981",
                    ].map((c) => (
                      <button
                        key={c}
                        onClick={() => setNewChildColor(c)}
                        className={`h-6 w-6 cursor-pointer rounded-lg transition-transform ${
                          newChildColor === c
                            ? "ring-purple-650 scale-110 ring-2"
                            : ""
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={handleCloseAddChild}
                  className="h-9 flex-1 cursor-pointer rounded-xl border border-purple-200/50 bg-secondary px-3 text-[10px] font-bold text-foreground"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateChild}
                  className="h-9 flex-1 cursor-pointer rounded-xl bg-purple-600 text-[10px] font-black text-white"
                >
                  Create
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default LayoutParentalC
