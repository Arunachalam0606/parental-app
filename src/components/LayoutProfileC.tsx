import { useWellbeingLogic } from "@/hooks/useWellbeingLogic"

import {
  LockIcon,
  SparkleIcon,
  FingerprintIcon,
  CpuIcon,
} from "@phosphor-icons/react"

export const LayoutProfileC = () => {
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
    <section className="flex flex-col gap-6 p-4 select-none">
      {/* Title Header with a soft warm AI glow */}
      <div className="relative">
        <span className="flex items-center gap-1 text-[10px] font-black tracking-widest text-amber-500/90 uppercase dark:text-amber-400">
          <SparkleIcon size={10} weight="fill" className="animate-pulse" />
          <span>Aura Identity</span>
        </span>
        <h1 className="mt-1 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 bg-clip-text font-heading text-2xl font-black tracking-tight text-foreground/95 text-transparent dark:from-amber-400 dark:via-rose-400 dark:to-indigo-300">
          Neural accounts
        </h1>
        {/* Soft glowing ambient circle behind header */}
        <div className="absolute -top-3 -left-3 -z-10 h-14 w-14 animate-pulse rounded-full bg-amber-500/10 blur-xl" />
      </div>

      {/* Profile selection card */}
      <div className="relative flex flex-col gap-4 rounded-3xl border border-purple-300/30 bg-white/30 p-5 shadow-[0_12px_30px_rgba(147,51,234,0.08)] backdrop-blur-xl dark:border-purple-950/20 dark:bg-slate-950/30">
        <h3 className="font-heading text-xs font-bold tracking-wider text-muted-foreground/80 uppercase">
          Synopses Profiles
        </h3>

        <div className="flex flex-col gap-3.5">
          {/* Parent Mode */}
          <div className="flex items-center justify-between rounded-2xl border border-purple-200/50 bg-white/20 p-4 transition-all hover:bg-white/40 dark:border-purple-900/30 dark:bg-slate-900/40">
            <div className="flex items-center gap-3">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-400 to-rose-400 text-sm font-extrabold text-white shadow-[0_4px_12px_rgba(245,158,11,0.25)]">
                AI
              </div>
              <div>
                <span className="text-xs font-black text-foreground">
                  Guardian Node
                </span>
                <p className="mt-0.5 text-[9px] font-semibold text-muted-foreground/80">
                  Full admin override active
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveProfileMode("parent")
                setActiveTab("dashboard")
                addToast("Guardian mode authorized", "success")
              }}
              className="h-8 cursor-pointer rounded-lg bg-gradient-to-r from-amber-500 to-rose-500 px-4 text-[10px] font-black text-white shadow-[0_4px_12px_rgba(244,63,94,0.2)] transition-all hover:from-amber-600 hover:to-rose-600 active:scale-95"
            >
              Enter
            </button>
          </div>

          {/* Child Mode */}
          {childProfiles.map((child) => (
            <div
              key={child.id}
              className="flex items-center justify-between rounded-2xl border border-purple-200/50 bg-white/20 p-4 transition-all hover:bg-white/40 dark:border-purple-900/30 dark:bg-slate-900/40"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-sm font-black text-white"
                  style={{
                    backgroundColor: child.avatarColor,
                    boxShadow: `0 6px 16px ${child.avatarColor}40`,
                  }}
                >
                  {child.name.charAt(0)}
                </div>
                <div>
                  <span className="text-xs font-black text-foreground">
                    {child.name} Space
                  </span>
                  <p className="mt-0.5 text-[9px] font-semibold text-muted-foreground/80">
                    Age {child.age} • Cosmic Theme active
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedChildId(child.id)
                  setActiveProfileMode("child")
                  addToast(`Cosmic lock activated for ${child.name}`, "info")
                }}
                className="flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-purple-200/60 bg-white/50 px-3 text-[10px] font-black text-foreground/80 shadow-[0_4px_12px_rgba(0,0,0,0.02)] transition-all hover:bg-white/90 active:scale-95 dark:border-purple-900/40 dark:bg-slate-900/50"
              >
                <LockIcon size={12} weight="fill" className="text-rose-500" />
                <span>Lock Node</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* AI Display Settings Card switcher */}
      <div className="flex flex-col gap-4 rounded-3xl border border-purple-300/30 bg-white/30 p-5 shadow-[0_12px_30px_rgba(147,51,234,0.08)] backdrop-blur-xl dark:border-purple-950/20 dark:bg-slate-950/30">
        <h3 className="font-heading text-xs font-bold tracking-wider text-muted-foreground/80 uppercase">
          Display Settings
        </h3>

        <div className="flex flex-col gap-3">
          <span className="text-xs font-black text-foreground">
            Current Layout Interface
          </span>

          <div className="grid grid-cols-3 gap-2">
            {(["A", "B", "C"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setLayoutMode(mode)
                  addToast(`UI updated to Layout ${mode}`, "success")
                }}
                className={`cursor-pointer rounded-xl px-1 py-2 text-center text-xs font-black transition-all active:scale-95 ${
                  layoutMode === mode
                    ? "border-none bg-gradient-to-r from-purple-500 via-rose-500 to-amber-500 text-white shadow-md shadow-purple-500/20"
                    : "border border-purple-200/60 bg-white/20 text-muted-foreground hover:bg-white/40 hover:text-foreground dark:border-purple-900/30 dark:bg-slate-900/40"
                }`}
              >
                Layout {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Engine Status (Futuristic design detail) */}
      <div className="flex flex-col gap-3.5 rounded-3xl border border-purple-300/30 bg-white/30 p-5 shadow-[0_12px_30px_rgba(147,51,234,0.08)] backdrop-blur-xl dark:border-purple-950/20 dark:bg-slate-950/30">
        <h3 className="font-heading text-xs font-bold tracking-wider text-muted-foreground/80 uppercase">
          Security Matrix & Health
        </h3>

        <div className="flex flex-col gap-3">
          {/* Health Row */}
          <div className="flex items-center justify-between rounded-xl border border-purple-200/50 bg-white/10 p-3.5 dark:border-purple-900/20 dark:bg-slate-900/20">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:bg-indigo-400/20 dark:text-indigo-300">
                <CpuIcon
                  size={18}
                  weight="fill"
                  className="animate-spin-slow"
                />
              </div>
              <div>
                <span className="text-xs font-black text-foreground">
                  Neural Filter Core
                </span>
                <p className="mt-0.5 text-[9px] font-semibold text-muted-foreground/75">
                  AI heuristic blocker active
                </p>
              </div>
            </div>
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          </div>

          {/* Parental PIN Override */}
          <div className="flex items-center justify-between rounded-xl border border-purple-200/50 bg-white/10 p-3.5 dark:border-purple-900/20 dark:bg-slate-900/20">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:bg-rose-400/20 dark:text-rose-300">
                <FingerprintIcon size={18} weight="bold" />
              </div>
              <div>
                <span className="text-xs font-black text-foreground">
                  Biometric Override
                </span>
                <p className="mt-0.5 text-[9px] font-semibold text-muted-foreground/75">
                  FaceID / TouchID backup active
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-amber-500 dark:text-amber-400">
              Verified
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LayoutProfileC
