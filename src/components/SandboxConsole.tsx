import { useWellbeingLogic } from '@/hooks/useWellbeingLogic'

import { 
  GearIcon, 
  UserIcon, 
  UsersIcon, 
  BookIcon, 
  ShieldCheckIcon,
  MoonIcon,
  SunIcon,
  FlameIcon,
  HeartIcon
} from '@phosphor-icons/react'

import type { LayoutType } from '@/stores/useWellbeingStore'

export const SandboxConsole = () => {
  const {
    activeLayout,
    activeTheme,
    setActiveLayout,
    setActiveTheme,
    simulateActivityTick,
    updateChildLimit
  } = useWellbeingLogic()

  const handleToggleTheme = () => {
    setActiveTheme(activeTheme === 'light' ? 'dark' : 'light')
  }

  const handleInjectLimitHit = () => {
    // Exceed limit for Emma
    updateChildLimit('emma', 'weekday', 30)
    // Tigger update cycles
    simulateActivityTick()
  }

  const layoutOptions: { id: LayoutType; name: string; icon: React.ReactNode; desc: string }[] = [
    { 
      id: 'personal', 
      name: 'Layout A: Personal Wellbeing', 
      icon: <UserIcon size={18} weight="duotone" />, 
      desc: 'Self wellbeing stats & limits adjustment' 
    },
    { 
      id: 'parental', 
      name: 'Layout B: Parental Portal', 
      icon: <UsersIcon size={18} weight="duotone" />, 
      desc: 'Manage schedules & filters for child profiles' 
    },
    { 
      id: 'child', 
      name: 'Layout C: Child Dashboard', 
      icon: <BookIcon size={18} weight="duotone" />, 
      desc: 'Simplified dials with secure lockout screens' 
    },
    { 
      id: 'adblocker', 
      name: 'Layout D: Adblocker Shield', 
      icon: <ShieldCheckIcon size={18} weight="duotone" />, 
      desc: 'Privacy counters & domain Whitelisting' 
    }
  ]

  return (
    <section className="w-full max-w-sm rounded-[32px] bg-card/65 p-6 border border-border shadow-[0_20px_40px_rgba(0,0,0,0.05)] backdrop-blur-2xl flex flex-col gap-6 select-none">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/10">
          <GearIcon size={22} weight="duotone" />
        </div>

        <div>
          <h2 className="font-heading text-lg font-bold tracking-tight">POC Control Panel</h2>
          <p className="text-[11px] font-medium text-muted-foreground mt-0.5">Simulate layout structures & filters</p>
        </div>
      </div>

      {/* Layout Selection list */}
      <div className="flex flex-col gap-2.5">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider pl-1">Select Active Layout</span>

        <div className="flex flex-col gap-2">
          {layoutOptions.map((option) => {
            const isSelected = activeLayout === option.id
            return (
              <button
                key={option.id}
                onClick={() => setActiveLayout(option.id)}
                className={`w-full p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex items-start gap-3.5 ${
                  isSelected 
                    ? 'bg-primary/5 border-primary/30 text-foreground' 
                    : 'bg-secondary/40 border-border/40 text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                }`}
              >
                <div className={`mt-0.5 p-2 rounded-xl border ${
                  isSelected ? 'bg-primary text-primary-foreground border-primary/20' : 'bg-card text-muted-foreground border-border/60'
                }`}>
                  {option.icon}
                </div>

                <div className="min-w-0">
                  <span className="text-xs font-bold block text-foreground">{option.name}</span>
                  <span className="text-[10px] font-medium text-muted-foreground block mt-0.5">{option.desc}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Global Utilities */}
      <div className="flex flex-col gap-2.5">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider pl-1">Global Configuration</span>

        <div className="grid grid-cols-2 gap-3">
          {/* Theme control */}
          <button
            onClick={handleToggleTheme}
            className="p-3.5 rounded-2xl bg-secondary/40 hover:bg-secondary/60 border border-border/60 text-xs font-bold flex flex-col gap-2 items-start text-left cursor-pointer"
          >
            <div className="p-2 rounded-xl bg-card border border-border/80 text-foreground">
              {activeTheme === 'light' ? (
                <MoonIcon size={16} weight="regular" />
              ) : (
                <SunIcon size={16} weight="regular" />
              )}
            </div>
            <div>
              <span className="block text-foreground">Toggle Theme</span>
              <span className="text-[9px] text-muted-foreground font-medium block mt-0.5">Press 'd' as shortcut</span>
            </div>
          </button>

          {/* Activity pulse */}
          <button
            onClick={simulateActivityTick}
            className="p-3.5 rounded-2xl bg-secondary/40 hover:bg-secondary/60 border border-border/60 text-xs font-bold flex flex-col gap-2 items-start text-left cursor-pointer"
          >
            <div className="p-2 rounded-xl bg-card border border-border/80 text-foreground">
              <FlameIcon size={16} weight="duotone" className="text-amber-500" />
            </div>
            <div>
              <span className="block text-foreground">Inject Activity</span>
              <span className="text-[9px] text-muted-foreground font-medium block mt-0.5">Simulate active ticking</span>
            </div>
          </button>
        </div>
      </div>

      {/* Trigger Event Injector */}
      <div className="flex flex-col gap-2.5">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider pl-1">Event Injections</span>

        <button
          onClick={handleInjectLimitHit}
          className="w-full py-3 px-4 rounded-2xl bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-2"
        >
          <ShieldCheckIcon size={18} weight="fill" />
          <span>Trigger Child App Lock Limit</span>
        </button>
      </div>

      {/* Design notes */}
      <div className="border-t border-border/60 pt-4 flex gap-2 text-[10px] font-medium text-muted-foreground">
        <HeartIcon size={14} className="text-rose-500 shrink-0 mt-0.5" />
        <span>Designed for Aura Wellbeing. Supports fluid spring animations, custom radial charts, and automatic dark modes.</span>
      </div>
    </section>
  )
}
export default SandboxConsole
