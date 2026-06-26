import { motion, AnimatePresence } from 'framer-motion'

import { useWellbeingLogic } from '@/hooks/useWellbeingLogic'

import { 
  PlusIcon,
  TrashIcon,
  ShieldCheckIcon,
  ShieldWarningIcon,
  GlobeIcon,
  HardDrivesIcon,
  CheckIcon
} from '@phosphor-icons/react'

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
    formattedDataSaved
  } = useWellbeingLogic()

  const isShieldActive = blockerToggles.blockAds || blockerToggles.blockTrackers

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDomainInput(e.target.value)
  }

  const handleToggleClick = (optionKey: 'blockAds' | 'blockTrackers' | 'blockSocialWidgets') => {
    toggleBlockerOption(optionKey)
  }

  return (
    <section className="flex flex-col gap-6 select-none">
      <div>
        <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Adblock Shield</span>

        <h1 className="font-heading text-2xl font-bold tracking-tight mt-0.5 text-foreground/90">Privacy Center</h1>
      </div>

      <div className="relative flex flex-col items-center justify-center rounded-3xl bg-card/50 p-6 shadow-lg shadow-black/5 border border-border/80 backdrop-blur-xl">
        <div className="relative flex h-[160px] w-[160px] items-center justify-center">
          {isShieldActive && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full bg-primary/10 border border-primary/20"
                animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />

              <motion.div
                className="absolute inset-0 rounded-full bg-primary/5 border border-primary/10"
                animate={{ scale: [1, 1.45, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 3, delay: 0.8, repeat: Infinity, ease: 'easeInOut' }}
              />
            </>
          )}

          <div className="z-10 flex h-[130px] w-[130px] flex-col items-center justify-center rounded-full bg-card shadow-lg border border-border/80 text-center relative overflow-hidden">
            {isShieldActive && (
              <motion.div
                className="absolute inset-0 border-2 border-dashed border-primary/30 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              />
            )}

            <span className="font-heading text-3xl font-black tracking-tight text-primary z-10">
              {blockerStats.adsBlocked + blockerStats.trackersBlocked}
            </span>

            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5 z-10">Blocked Requests</span>
          </div>
        </div>

        <div className="mt-6 grid w-full grid-cols-2 gap-4 border-t border-border/60 pt-4 text-center">
          <div className="flex flex-col items-center border-r border-border/60">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
              <ShieldCheckIcon size={14} className="text-primary" />

              <span>Trackers Blocked</span>
            </div>

            <span className="text-base font-extrabold mt-1 text-foreground/90">{blockerStats.trackersBlocked}</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
              <HardDrivesIcon size={14} className="text-emerald-500" />

              <span>Data Saved</span>
            </div>

            <span className="text-base font-extrabold mt-1 text-emerald-600 dark:text-emerald-400">{formattedDataSaved}</span>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-card/50 p-5 shadow-lg shadow-black/5 border border-border/80 backdrop-blur-xl">
        <h3 className="font-heading text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Shield Controls</h3>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/35 border border-border/40 hover:bg-secondary/45 transition-colors">
            <div>
              <span className="text-xs font-semibold text-foreground/90">Block Advertisements</span>

              <p className="text-[10px] font-medium text-muted-foreground mt-0.5">Filters scripts, banners, and video ads</p>
            </div>
            
            <button
              onClick={() => handleToggleClick('blockAds')}
              className={`relative h-6 w-11 rounded-full transition-colors flex items-center cursor-pointer ${
                blockerToggles.blockAds ? 'bg-primary justify-end' : 'bg-muted justify-start'
              }`}
            >
              <motion.div layout className="h-5 w-5 rounded-full bg-white shadow-sm mx-0.5" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/35 border border-border/40 hover:bg-secondary/45 transition-colors">
            <div>
              <span className="text-xs font-semibold text-foreground/90">Block Analytics & Trackers</span>

              <p className="text-[10px] font-medium text-muted-foreground mt-0.5">Stops network trackers and telemetry scripts</p>
            </div>
            
            <button
              onClick={() => handleToggleClick('blockTrackers')}
              className={`relative h-6 w-11 rounded-full transition-colors flex items-center cursor-pointer ${
                blockerToggles.blockTrackers ? 'bg-primary justify-end' : 'bg-muted justify-start'
              }`}
            >
              <motion.div layout className="h-5 w-5 rounded-full bg-white shadow-sm mx-0.5" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/35 border border-border/40 hover:bg-secondary/45 transition-colors">
            <div>
              <span className="text-xs font-semibold text-foreground/90">Block Social Media Elements</span>

              <p className="text-[10px] font-medium text-muted-foreground mt-0.5">Hides FB/Twitter login dialogs and widgets</p>
            </div>
            
            <button
              onClick={() => handleToggleClick('blockSocialWidgets')}
              className={`relative h-6 w-11 rounded-full transition-colors flex items-center cursor-pointer ${
                blockerToggles.blockSocialWidgets ? 'bg-primary justify-end' : 'bg-muted justify-start'
              }`}
            >
              <motion.div layout className="h-5 w-5 rounded-full bg-white shadow-sm mx-0.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-card/50 p-5 shadow-lg shadow-black/5 border border-border/80 backdrop-blur-xl">
        <h3 className="font-heading text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
          <GlobeIcon size={18} weight="duotone" className="text-primary" />

          <span>Bypass Filter Rules</span>
        </h3>

        <div className="flex flex-col gap-1.5 mb-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="e.g. google.com"
              value={domainInput}
              onChange={handleDomainChange}
              className="flex-1 h-11 px-4 rounded-xl border border-border bg-secondary/40 text-sm focus:outline-none focus:border-primary/50 text-foreground"
            />
            
            <button
              onClick={handleAddWhitelist}
              className="h-11 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-sm hover:opacity-90 flex items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <PlusIcon size={16} weight="bold" />

              <span>Allow</span>
            </button>
          </div>

          {domainError && (
            <span className="text-[11px] font-medium text-rose-500 pl-1">{domainError}</span>
          )}
        </div>

        <div className="flex flex-col gap-2 max-h-36 overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {whitelist.length === 0 ? (
              <div className="text-center py-5 text-xs text-muted-foreground">All domains are filtered</div>
            ) : (
              whitelist.map((domain) => (
                <motion.div
                  key={domain}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-secondary/40 border border-border/40 text-xs text-foreground/80 font-medium hover:bg-secondary/50 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <CheckIcon size={12} className="text-emerald-500 font-bold animate-pulse" />
                    {domain}
                  </span>

                  <button
                    onClick={() => removeWhitelistDomain(domain)}
                    className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <TrashIcon size={14} />
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="rounded-3xl bg-card/50 p-5 shadow-lg shadow-black/5 border border-border/80 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="font-heading text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <ShieldWarningIcon size={18} weight="duotone" className="text-rose-500 animate-pulse" />

            <span>Real-time Shield Events</span>
          </h3>

          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        <div className="flex flex-col gap-2.5 max-h-48 overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {blockerHistory.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="flex items-center justify-between text-[11px] p-2.5 rounded-xl bg-secondary/35 border border-border/30 hover:bg-secondary/45 transition-colors"
              >
                <div className="min-w-0 flex-1 pr-3">
                  <span className="font-bold text-foreground truncate block">{item.domain}</span>

                  <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">{item.type} blocked</span>
                </div>

                <span className="text-muted-foreground font-medium whitespace-nowrap">{item.time}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

export default LayoutAdblocker
