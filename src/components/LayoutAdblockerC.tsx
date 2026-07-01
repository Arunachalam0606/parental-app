import { motion, AnimatePresence } from "framer-motion"

import { useWellbeingLogic } from "@/hooks/useWellbeingLogic"

import {
  TrashIcon,
  ShieldCheckIcon,
  HardDrivesIcon,
  GlobeIcon,
  CheckIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react"

export const LayoutAdblockerC = () => {
  const {
    blockerStats,
    blockerToggles,
    whitelist,
    domainInput,
    domainError,
    setDomainInput,
    toggleBlockerOption,
    removeWhitelistDomain,
    handleAddWhitelist,
    formattedDataSaved,
  } = useWellbeingLogic()

  const isShieldActive = blockerToggles.blockAds || blockerToggles.blockTrackers

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDomainInput(e.target.value)
  }

  const handleToggleClick = (
    optionKey: "blockAds" | "blockTrackers" | "blockSocialWidgets"
  ) => {
    toggleBlockerOption(optionKey)
  }

  return (
    <section className="flex flex-col gap-6 p-4 select-none">
      {/* Title Header with AI Glow */}
      <div className="relative">
        <span className="flex items-center gap-1 text-[10px] font-black tracking-widest text-amber-500 uppercase dark:text-amber-400">
          <ShieldCheckIcon size={12} weight="fill" className="animate-pulse" />
          <span>Security Matrix</span>
        </span>
        <h1 className="mt-1 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 bg-clip-text font-heading text-2xl font-black tracking-tight text-transparent dark:from-amber-400 dark:via-rose-400 dark:to-indigo-300">
          AI Privacy Shield
        </h1>
        {/* Soft glowing ambient circle behind header */}
        <div className="absolute -top-3 -left-3 -z-10 h-14 w-14 animate-pulse rounded-full bg-purple-500/10 blur-xl" />
      </div>

      {/* Hero Pulse Radar Scanner */}
      <div className="relative flex flex-col items-center justify-center rounded-3xl border border-purple-300/30 bg-white/30 p-6 shadow-[0_12px_30px_rgba(147,51,234,0.08)] backdrop-blur-xl dark:border-purple-950/20 dark:bg-slate-950/30">
        <div className="relative flex h-[160px] w-[160px] items-center justify-center">
          {isShieldActive && (
            <>
              {/* Outer pulsing ring */}
              <motion.div
                className="absolute inset-0 rounded-full border border-rose-500/20 bg-rose-500/5"
                animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              {/* Secondary pulsing ring */}
              <motion.div
                className="absolute inset-2 rounded-full border border-amber-500/20 bg-amber-500/5"
                animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0, 0.4] }}
                transition={{
                  duration: 3.5,
                  delay: 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </>
          )}

          {/* Central circular display */}
          <div className="relative z-10 flex h-[130px] w-[130px] flex-col items-center justify-center rounded-full border border-purple-200/50 bg-white/40 text-center shadow-lg dark:border-purple-900/30 dark:bg-slate-900/40">
            {isShieldActive && (
              <>
                {/* Rotating scanner sweep line */}
                <motion.div
                  className="absolute inset-0 rounded-full border border-dashed border-rose-500/30"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <motion.div
                  className="absolute inset-3 rounded-full border border-amber-500/10"
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </>
            )}

            <span className="z-10 bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text font-heading text-3xl font-black tracking-tight text-transparent dark:from-amber-400 dark:to-rose-400">
              {blockerStats.adsBlocked + blockerStats.trackersBlocked}
            </span>
            <span className="z-10 mt-0.5 text-[9px] font-bold tracking-wider text-muted-foreground uppercase">
              Threats Intercepted
            </span>
          </div>
        </div>

        {/* Quick statistics row */}
        <div className="mt-5 grid w-full grid-cols-2 gap-4 border-t border-purple-200/50 pt-4 text-center dark:border-purple-900/30">
          <div className="flex flex-col items-center border-r border-purple-200/50 dark:border-purple-900/30">
            <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase">
              <ShieldCheckIcon size={14} className="text-amber-500" />
              <span>Trackers</span>
            </div>
            <span className="mt-1 text-sm font-black text-foreground/95">
              {blockerStats.trackersBlocked}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase">
              <HardDrivesIcon size={14} className="text-rose-500" />
              <span>Cache Saved</span>
            </div>
            <span className="mt-1 text-sm font-black text-rose-500 dark:text-rose-400">
              {formattedDataSaved}
            </span>
          </div>
        </div>
      </div>

      {/* Controls switches */}
      <div className="flex flex-col gap-4 rounded-3xl border border-purple-300/30 bg-white/30 p-5 shadow-[0_12px_30px_rgba(147,51,234,0.08)] backdrop-blur-xl dark:border-purple-950/20 dark:bg-slate-950/30">
        <h3 className="font-heading text-xs font-bold tracking-wider text-muted-foreground uppercase">
          AI Filter Controls
        </h3>

        <div className="flex flex-col gap-3">
          {[
            {
              key: "blockAds" as const,
              label: "Bypass Ads & Trackers",
              desc: "Neutralizes banners, cookies, and trackers",
              active: blockerToggles.blockAds,
            },
            {
              key: "blockTrackers" as const,
              label: "Telemetry Core Blocker",
              desc: "Restricts background telemetry scripts",
              active: blockerToggles.blockTrackers,
            },
            {
              key: "blockSocialWidgets" as const,
              label: "Block Social Beacons",
              desc: "Suppresses social widgets & buttons",
              active: blockerToggles.blockSocialWidgets,
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between rounded-2xl border border-purple-200/50 bg-white/20 p-4 transition-all hover:bg-white/40 dark:border-purple-900/30 dark:bg-slate-900/40"
            >
              <div>
                <span className="text-xs font-black text-foreground">
                  {item.label}
                </span>
                <p className="mt-0.5 text-[9px] font-semibold text-muted-foreground/80">
                  {item.desc}
                </p>
              </div>

              <button
                onClick={() => handleToggleClick(item.key)}
                className={`relative flex h-6 w-11 cursor-pointer items-center rounded-full border border-purple-200/50 transition-colors active:scale-95 dark:border-purple-900/30 ${
                  item.active
                    ? "justify-end bg-gradient-to-r from-amber-500 to-rose-500"
                    : "justify-start bg-slate-200 dark:bg-slate-900"
                }`}
              >
                <motion.div
                  layout
                  className="mx-0.5 h-5 w-5 rounded-full bg-white shadow-sm"
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bypass Filter Whitelist */}
      <div className="flex flex-col gap-4 rounded-3xl border border-purple-300/30 bg-white/30 p-5 shadow-[0_12px_30px_rgba(147,51,234,0.08)] backdrop-blur-xl dark:border-purple-950/20 dark:bg-slate-950/30">
        <h3 className="flex items-center gap-1.5 font-heading text-xs font-bold tracking-wider text-muted-foreground uppercase">
          <GlobeIcon size={16} weight="fill" className="text-amber-500" />
          <span>Holographic Whitelist</span>
        </h3>

        <div className="flex flex-col gap-1.5">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. duolingo.com"
              value={domainInput}
              onChange={handleDomainChange}
              className="h-11 flex-1 rounded-xl border border-purple-200/60 bg-white/20 px-3 text-xs text-foreground placeholder-muted-foreground/60 focus:border-amber-500/50 focus:outline-none dark:border-purple-900/30 dark:bg-slate-900/40"
            />
            <button
              onClick={handleAddWhitelist}
              className="h-11 cursor-pointer rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 px-4 text-xs font-black text-white shadow-md active:scale-95"
            >
              Add Node
            </button>
          </div>
          {domainError && (
            <span className="flex items-center gap-1 pl-1 text-[10px] font-bold text-rose-500">
              <WarningCircleIcon size={12} />
              {domainError}
            </span>
          )}
        </div>

        <div className="flex max-h-32 flex-col gap-2 overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {whitelist.length === 0 ? (
              <div className="py-4 text-center text-xs text-muted-foreground/80">
                All domains are filtered
              </div>
            ) : (
              whitelist.map((domain) => (
                <motion.div
                  key={domain}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center justify-between rounded-xl border border-purple-200/50 bg-white/20 p-2.5 text-xs font-bold text-foreground/80 dark:border-purple-900/25 dark:bg-slate-900/30"
                >
                  <span className="flex items-center gap-1.5">
                    <CheckIcon
                      size={12}
                      className="font-bold text-emerald-500"
                    />
                    {domain}
                  </span>
                  <button
                    onClick={() => removeWhitelistDomain(domain)}
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
    </section>
  )
}

export default LayoutAdblockerC
