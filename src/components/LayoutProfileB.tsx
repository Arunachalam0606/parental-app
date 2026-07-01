import { useWellbeingLogic } from "@/hooks/useWellbeingLogic"

import { LockIcon, KeyIcon } from "@phosphor-icons/react"

export const LayoutProfileB = () => {
  const {
    childProfiles,
    setSelectedChildId,
    setActiveProfileMode,
    setActiveTab,
    addToast,
    layoutMode,
    setLayoutMode,
  } = useWellbeingLogic()

  return (
    <section className="flex flex-col gap-5 p-4 select-none">
      {/* Title Header */}
      <div>
        <span className="text-[10px] font-bold tracking-wider text-muted-foreground/80 uppercase">
          Profile Settings
        </span>
        <h1 className="mt-1 font-heading text-2xl font-black tracking-tight text-foreground/95">
          Account Center
        </h1>
      </div>

      {/* Active Profiles Section */}
      <div className="flex flex-col gap-3.5 rounded-2xl border border-white/50 bg-white/40 p-5 shadow-[0_8px_32px_-4px_rgba(0,0,0,0.04)] backdrop-blur-xl dark:border-white/10 dark:bg-black/25">
        <h3 className="font-heading text-xs font-bold tracking-wider text-muted-foreground uppercase">
          Active Family Members
        </h3>

        <div className="flex flex-col gap-3">
          {/* Adult Profile */}
          <div className="flex items-center justify-between rounded-xl border border-white/60 bg-white/20 p-3.5 dark:border-white/5 dark:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 font-extrabold text-purple-600 dark:bg-purple-400/20 dark:text-purple-300">
                PA
              </div>
              <div>
                <span className="text-xs font-black text-foreground/90">
                  Parent Account
                </span>
                <p className="mt-0.5 text-[9px] font-medium text-muted-foreground">
                  Unrestricted access & controls
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveProfileMode("parent")
                setActiveTab("dashboard")
                addToast("Entered Parent Mode", "success")
              }}
              className="h-8 cursor-pointer rounded-lg bg-purple-600 px-3.5 text-[10px] font-bold text-white shadow-sm transition-all hover:bg-purple-700 active:scale-95"
            >
              Enter
            </button>
          </div>

          {/* Child Profiles */}
          {childProfiles.map((child) => (
            <div
              key={child.id}
              className="flex items-center justify-between rounded-xl border border-white/60 bg-white/20 p-3.5 dark:border-white/5 dark:bg-white/5"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-sm font-black text-white"
                  style={{
                    backgroundColor: child.avatarColor,
                    boxShadow: `0 4px 12px ${child.avatarColor}35`,
                  }}
                >
                  {child.name.charAt(0)}
                </div>
                <div>
                  <span className="text-xs font-black text-foreground/90">
                    {child.name} Space
                  </span>
                  <p className="mt-0.5 text-[9px] font-medium text-muted-foreground">
                    Age {child.age} • Subject to schedules
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedChildId(child.id)
                  setActiveProfileMode("child")
                  addToast(`Locked screen for ${child.name}`, "info")
                }}
                className="flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-white/80 bg-white/50 px-3 text-[10px] font-black text-foreground/80 shadow-sm transition-all hover:bg-white/90 active:scale-95 dark:border-white/10 dark:bg-white/10"
              >
                <LockIcon
                  size={12}
                  weight="fill"
                  className="text-purple-600 dark:text-purple-400"
                />
                <span>Lock Screen</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* App Layout Mode Selection */}
      <div className="flex flex-col gap-3 rounded-2xl border border-white/50 bg-white/40 p-5 shadow-[0_8px_32px_-4px_rgba(0,0,0,0.04)] backdrop-blur-xl dark:border-white/10 dark:bg-black/25">
        <h3 className="font-heading text-xs font-bold tracking-wider text-muted-foreground uppercase">
          Display & Styling
        </h3>

        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-black text-foreground/90">
            UI Theme Layout
          </span>

          <div className="grid grid-cols-3 gap-2">
            {(["A", "B", "C"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setLayoutMode(mode)
                  addToast(`Switched to Layout ${mode}`, "success")
                }}
                className={`cursor-pointer rounded-xl px-1 py-2 text-center text-xs font-bold transition-all active:scale-95 ${
                  layoutMode === mode
                    ? "bg-purple-600 text-white shadow-md shadow-purple-500/10"
                    : "border border-white/60 bg-white/20 hover:bg-white/40 dark:border-white/10 dark:bg-white/5"
                }`}
              >
                Layout {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Security Override Settings */}
      <div className="flex flex-col gap-3.5 rounded-2xl border border-white/50 bg-white/40 p-5 shadow-[0_8px_32px_-4px_rgba(0,0,0,0.04)] backdrop-blur-xl dark:border-white/10 dark:bg-black/25">
        <h3 className="font-heading text-xs font-bold tracking-wider text-muted-foreground uppercase">
          Security Configuration
        </h3>

        <div className="flex items-center justify-between rounded-xl border border-white/60 bg-white/20 p-3.5 dark:border-white/5 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:bg-amber-400/20 dark:text-amber-300">
              <KeyIcon size={18} weight="bold" />
            </div>
            <div>
              <span className="text-xs font-black text-foreground/90">
                Parent PIN Control
              </span>
              <p className="mt-0.5 text-[9px] font-medium text-muted-foreground">
                Override child block settings
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
            Active
          </span>
        </div>
      </div>
    </section>
  )
}

export default LayoutProfileB
