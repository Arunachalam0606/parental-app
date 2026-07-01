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

export const LayoutAdblockerB = () => {
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
    <section className="flex flex-col gap-5 p-1 select-none">
      {/* Title */}
      <div>
        <span className="text-[10px] font-bold tracking-wider text-muted-foreground/80 uppercase">
          Privacy Shield
        </span>
        <h1 className="mt-1 font-heading text-2xl font-black tracking-tight text-foreground/95">
          Adblock Center
        </h1>
      </div>

      {/* Hero Circular Counter Ring */}
      <div className="relative flex flex-col items-center justify-center rounded-2xl border border-white/50 bg-white/40 p-6 shadow-[0_8px_32px_-4px_rgba(0,0,0,0.04)] backdrop-blur-xl dark:border-white/10 dark:bg-black/25">
        <div className="relative flex h-[150px] w-[150px] items-center justify-center">
          {isShieldActive && (
            <>
              {/* Outer soft pulsing ring */}
              <motion.div
                className="absolute inset-0 rounded-full border border-purple-500/10 bg-purple-500/5"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </>
          )}

          <div className="relative z-10 flex h-[120px] w-[120px] flex-col items-center justify-center rounded-full border border-white/80 bg-white/60 text-center shadow-md dark:border-white/10 dark:bg-neutral-900/60">
            {isShieldActive && (
              <svg className="absolute inset-0 h-full w-full -rotate-95">
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  className="fill-none stroke-purple-200 dark:stroke-purple-950/40"
                  strokeWidth="6"
                />
                <motion.circle
                  cx="60"
                  cy="60"
                  r="52"
                  className="fill-none stroke-purple-600 dark:stroke-purple-400"
                  strokeWidth="6"
                  strokeDasharray="327"
                  initial={{ strokeDashoffset: 327 }}
                  animate={{ strokeDashoffset: 327 - 327 * 0.75 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>
            )}

            <span className="z-10 font-heading text-2xl font-black tracking-tight text-foreground/95">
              {blockerStats.adsBlocked + blockerStats.trackersBlocked}
            </span>
            <span className="z-10 text-[8px] font-bold tracking-wider text-muted-foreground uppercase">
              Blocked Today
            </span>
          </div>
        </div>

        {/* Circular quick stats grid */}
        <div className="mt-5 grid w-full grid-cols-2 gap-4 border-t border-white/60 pt-4 text-center dark:border-white/10">
          <div className="flex flex-col items-center border-r border-white/60 dark:border-white/10">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase">
              <ShieldCheckIcon
                size={14}
                className="text-purple-600 dark:text-purple-400"
              />
              <span>Trackers</span>
            </div>
            <span className="mt-1 text-sm font-black text-foreground/95">
              {blockerStats.trackersBlocked}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase">
              <HardDrivesIcon size={14} className="text-emerald-500" />
              <span>Data Saved</span>
            </div>
            <span className="mt-1 text-sm font-black text-emerald-600 dark:text-emerald-400">
              {formattedDataSaved}
            </span>
          </div>
        </div>
      </div>

      {/* Switches Panel */}
      <div className="flex flex-col gap-3 rounded-2xl border border-white/50 bg-white/40 p-4.5 shadow-[0_8px_32px_-4px_rgba(0,0,0,0.04)] backdrop-blur-xl dark:border-white/10 dark:bg-black/25">
        <h3 className="font-heading text-xs font-bold tracking-wider text-muted-foreground uppercase">
          Shield Switches
        </h3>

        <div className="flex flex-col gap-2.5">
          {[
            {
              key: "blockAds" as const,
              label: "Block Advertisements",
              desc: "Filters popups, banners, & video ads",
              active: blockerToggles.blockAds,
            },
            {
              key: "blockTrackers" as const,
              label: "Block Analytics & Telemetry",
              desc: "Restricts background web trackers",
              active: blockerToggles.blockTrackers,
            },
            {
              key: "blockSocialWidgets" as const,
              label: "Block Social Media Trackers",
              desc: "Hides Facebook/Twitter login beacons",
              active: blockerToggles.blockSocialWidgets,
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between rounded-xl border border-white/40 bg-white/20 p-3.5 dark:border-white/5 dark:bg-white/5"
            >
              <div>
                <span className="text-xs font-black text-foreground/90">
                  {item.label}
                </span>
                <p className="mt-0.5 text-[9px] font-medium text-muted-foreground">
                  {item.desc}
                </p>
              </div>

              <button
                onClick={() => handleToggleClick(item.key)}
                className={`relative flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors active:scale-95 ${
                  item.active
                    ? "justify-end bg-purple-600"
                    : "justify-start bg-slate-200 dark:bg-neutral-800"
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

      {/* Bypass Domain Whitelist */}
      <div className="flex flex-col gap-3 rounded-2xl border border-white/50 bg-white/40 p-4.5 shadow-[0_8px_32px_-4px_rgba(0,0,0,0.04)] backdrop-blur-xl dark:border-white/10 dark:bg-black/25">
        <h3 className="flex items-center gap-1.5 font-heading text-xs font-bold tracking-wider text-muted-foreground uppercase">
          <GlobeIcon
            size={16}
            weight="bold"
            className="text-purple-600 dark:text-purple-400"
          />
          <span>Bypass Filter Rules</span>
        </h3>

        <div className="flex flex-col gap-1.5">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. quizlet.com"
              value={domainInput}
              onChange={handleDomainChange}
              className="h-10 flex-1 rounded-xl border border-white/60 bg-white/20 px-3 text-xs text-foreground placeholder-muted-foreground/60 focus:border-purple-500/50 focus:outline-none dark:border-white/10 dark:bg-white/5"
            />
            <button
              onClick={handleAddWhitelist}
              className="h-10 cursor-pointer rounded-xl bg-purple-600 px-4 text-xs font-bold text-white shadow-sm hover:bg-purple-700 active:scale-95"
            >
              Add
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
                  className="flex items-center justify-between rounded-xl border border-white/40 bg-white/20 p-2.5 text-xs font-medium text-foreground/85 dark:border-white/5 dark:bg-white/5"
                >
                  <span className="flex items-center gap-1.5 text-xs font-bold">
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

export default LayoutAdblockerB
