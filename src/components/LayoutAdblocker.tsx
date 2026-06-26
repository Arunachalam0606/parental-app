import { motion, AnimatePresence } from "framer-motion"

import { useWellbeingLogic } from "@/hooks/useWellbeingLogic"

import {
  PlusIcon,
  TrashIcon,
  ShieldCheckIcon,
  ShieldWarningIcon,
  GlobeIcon,
  HardDrivesIcon,
  CheckIcon,
} from "@phosphor-icons/react"

export const LayoutAdblocker = () => {
  const {
    blockerStats,
    blockerToggles,
    blockerHistory,
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
    <section className="flex flex-col gap-6 select-none">
      <div>
        <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
          Adblock Shield
        </span>

        <h1 className="mt-0.5 font-heading text-2xl font-bold tracking-tight text-foreground/90">
          Privacy Center
        </h1>
      </div>

      <div className="relative flex flex-col items-center justify-center rounded-3xl border border-border/80 bg-card/50 p-6 shadow-lg shadow-black/5 backdrop-blur-xl">
        <div className="relative flex h-[160px] w-[160px] items-center justify-center">
          {isShieldActive && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full border border-primary/20 bg-primary/10"
                animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <motion.div
                className="absolute inset-0 rounded-full border border-primary/10 bg-primary/5"
                animate={{ scale: [1, 1.45, 1], opacity: [0.4, 0, 0.4] }}
                transition={{
                  duration: 3,
                  delay: 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </>
          )}

          <div className="relative z-10 flex h-[130px] w-[130px] flex-col items-center justify-center overflow-hidden rounded-full border border-border/80 bg-card text-center shadow-lg">
            {isShieldActive && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />
            )}

            <span className="z-10 font-heading text-3xl font-black tracking-tight text-primary">
              {blockerStats.adsBlocked + blockerStats.trackersBlocked}
            </span>

            <span className="z-10 mt-0.5 text-[9px] font-bold tracking-wider text-muted-foreground uppercase">
              Blocked Requests
            </span>
          </div>
        </div>

        <div className="mt-6 grid w-full grid-cols-2 gap-4 border-t border-border/60 pt-4 text-center">
          <div className="flex flex-col items-center border-r border-border/60">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
              <ShieldCheckIcon size={14} className="text-primary" />

              <span>Trackers Blocked</span>
            </div>

            <span className="mt-1 text-base font-extrabold text-foreground/90">
              {blockerStats.trackersBlocked}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
              <HardDrivesIcon size={14} className="text-emerald-500" />

              <span>Data Saved</span>
            </div>

            <span className="mt-1 text-base font-extrabold text-emerald-600 dark:text-emerald-400">
              {formattedDataSaved}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-border/80 bg-card/50 p-5 shadow-lg shadow-black/5 backdrop-blur-xl">
        <h3 className="mb-4 font-heading text-xs font-bold tracking-wider text-muted-foreground uppercase">
          Shield Controls
        </h3>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between rounded-2xl border border-border/40 bg-secondary/35 p-3.5 transition-colors hover:bg-secondary/45">
            <div>
              <span className="text-xs font-semibold text-foreground/90">
                Block Advertisements
              </span>

              <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">
                Filters scripts, banners, and video ads
              </p>
            </div>

            <button
              onClick={() => handleToggleClick("blockAds")}
              className={`relative flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors ${
                blockerToggles.blockAds
                  ? "justify-end bg-primary"
                  : "justify-start bg-muted"
              }`}
            >
              <motion.div
                layout
                className="mx-0.5 h-5 w-5 rounded-full bg-white shadow-sm"
              />
            </button>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-border/40 bg-secondary/35 p-3.5 transition-colors hover:bg-secondary/45">
            <div>
              <span className="text-xs font-semibold text-foreground/90">
                Block Analytics & Trackers
              </span>

              <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">
                Stops network trackers and telemetry scripts
              </p>
            </div>

            <button
              onClick={() => handleToggleClick("blockTrackers")}
              className={`relative flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors ${
                blockerToggles.blockTrackers
                  ? "justify-end bg-primary"
                  : "justify-start bg-muted"
              }`}
            >
              <motion.div
                layout
                className="mx-0.5 h-5 w-5 rounded-full bg-white shadow-sm"
              />
            </button>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-border/40 bg-secondary/35 p-3.5 transition-colors hover:bg-secondary/45">
            <div>
              <span className="text-xs font-semibold text-foreground/90">
                Block Social Media Elements
              </span>

              <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">
                Hides FB/Twitter login dialogs and widgets
              </p>
            </div>

            <button
              onClick={() => handleToggleClick("blockSocialWidgets")}
              className={`relative flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors ${
                blockerToggles.blockSocialWidgets
                  ? "justify-end bg-primary"
                  : "justify-start bg-muted"
              }`}
            >
              <motion.div
                layout
                className="mx-0.5 h-5 w-5 rounded-full bg-white shadow-sm"
              />
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-border/80 bg-card/50 p-5 shadow-lg shadow-black/5 backdrop-blur-xl">
        <h3 className="mb-3.5 flex items-center gap-1.5 font-heading text-xs font-bold tracking-wider text-muted-foreground uppercase">
          <GlobeIcon size={18} weight="duotone" className="text-primary" />

          <span>Bypass Filter Rules</span>
        </h3>

        <div className="mb-4 flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="e.g. google.com"
              value={domainInput}
              onChange={handleDomainChange}
              className="h-11 flex-1 rounded-xl border border-border bg-secondary/40 px-4 text-sm text-foreground focus:border-primary/50 focus:outline-none"
            />

            <button
              onClick={handleAddWhitelist}
              className="flex h-11 cursor-pointer items-center justify-center gap-1 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground shadow-sm transition-colors hover:opacity-90"
            >
              <PlusIcon size={16} weight="bold" />

              <span>Allow</span>
            </button>
          </div>

          {domainError && (
            <span className="pl-1 text-[11px] font-medium text-rose-500">
              {domainError}
            </span>
          )}
        </div>

        <div className="flex max-h-36 flex-col gap-2 overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {whitelist.length === 0 ? (
              <div className="py-5 text-center text-xs text-muted-foreground">
                All domains are filtered
              </div>
            ) : (
              whitelist.map((domain) => (
                <motion.div
                  key={domain}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center justify-between rounded-xl border border-border/40 bg-secondary/40 p-2.5 text-xs font-medium text-foreground/80 transition-colors hover:bg-secondary/50"
                >
                  <span className="flex items-center gap-1.5">
                    <CheckIcon
                      size={12}
                      className="animate-pulse font-bold text-emerald-500"
                    />
                    {domain}
                  </span>

                  <button
                    onClick={() => removeWhitelistDomain(domain)}
                    className="cursor-pointer rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <TrashIcon size={14} />
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="rounded-3xl border border-border/80 bg-card/50 p-5 shadow-lg shadow-black/5 backdrop-blur-xl">
        <div className="mb-3.5 flex items-center justify-between">
          <h3 className="flex items-center gap-1.5 font-heading text-xs font-bold tracking-wider text-muted-foreground uppercase">
            <ShieldWarningIcon
              size={18}
              weight="duotone"
              className="animate-pulse text-rose-500"
            />

            <span>Real-time Shield Events</span>
          </h3>

          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
        </div>

        <div className="flex max-h-48 flex-col gap-2.5 overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {blockerHistory.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="flex items-center justify-between rounded-xl border border-border/30 bg-secondary/35 p-2.5 text-[11px] transition-colors hover:bg-secondary/45"
              >
                <div className="min-w-0 flex-1 pr-3">
                  <span className="block truncate font-bold text-foreground">
                    {item.domain}
                  </span>

                  <span className="text-[9px] font-semibold tracking-wider text-muted-foreground uppercase">
                    {item.type} blocked
                  </span>
                </div>

                <span className="font-medium whitespace-nowrap text-muted-foreground">
                  {item.time}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

export default LayoutAdblocker
