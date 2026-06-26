import { useWellbeingLogic } from '@/hooks/useWellbeingLogic'

import { 
  GearIcon, 
  UserIcon, 
  UsersIcon, 
  MoonIcon, 
  SunIcon,
  FlameIcon,
  HeartIcon,
  HourglassIcon,
  ArrowsClockwiseIcon
} from '@phosphor-icons/react'

export const SandboxConsole = () => {
  const {
    activeProfileMode,
    setActiveProfileMode,
    activeTheme,
    setActiveTheme,
    simulateActivityTick,
    submitExtraTimeRequest,
    reset,
    addToast
  } = useWellbeingLogic()

  const handleToggleTheme = () => {
    setActiveTheme(activeTheme === 'light' ? 'dark' : 'light')
  }

  const handleToggleProfileMode = (mode: 'parent' | 'child') => {
    setActiveProfileMode(mode)
    addToast(mode === 'child' ? "Entered Child Mode" : "Returned to Parent Mode", 'info')
  }

  const handleInjectRequest = () => {
    // Generate a random extra time request from Alex or Emma
    const isAlex = Math.random() > 0.5
    const childId = isAlex ? 'alex' : 'emma'
    const childName = isAlex ? 'Alex' : 'Emma'
    const appId = isAlex ? 'minecraft' : 'tiktok'
    const appName = isAlex ? 'Minecraft' : 'TikTok'
    const minutes = Math.random() > 0.5 ? 15 : 30

    submitExtraTimeRequest(childId, appId, minutes)
    addToast(`Injected pending request: ${childName} asks +${minutes}m for ${appName}`, 'info')
  }

  return (
    <section className="w-full max-w-sm rounded-[32px] bg-card/65 p-6 border border-border shadow-[0_20px_40px_rgba(0,0,0,0.05)] backdrop-blur-2xl flex flex-col gap-6 select-none text-foreground">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/10">
          <GearIcon size={22} weight="duotone" />
        </div>

        <div>
          <h2 className="font-heading text-lg font-bold tracking-tight">POC Control Panel</h2>
          <p className="text-[10px] font-semibold text-muted-foreground mt-0.5">Simulate layouts, limits, and requests</p>
        </div>
      </div>

      {/* Profile mode switches */}
      <div className="flex flex-col gap-2.5">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider pl-1">Active User Role</span>

        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-secondary/55">
          <button
            onClick={() => handleToggleProfileMode('parent')}
            className={`py-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeProfileMode === 'parent' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <UsersIcon size={16} />
            <span>Parent Mode</span>
          </button>
          
          <button
            onClick={() => handleToggleProfileMode('child')}
            className={`py-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeProfileMode === 'child' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <UserIcon size={16} />
            <span>Child Mode</span>
          </button>
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
              <span className="block text-foreground text-xs font-bold">Toggle Theme</span>
              <span className="text-[9px] text-muted-foreground font-semibold block mt-0.5">Press 'd' as shortcut</span>
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
              <span className="block text-foreground text-xs font-bold">Tick Activity</span>
              <span className="text-[9px] text-muted-foreground font-semibold block mt-0.5">Simulate active ticking</span>
            </div>
          </button>
        </div>
      </div>

      {/* Injections & Overrides */}
      <div className="flex flex-col gap-2.5">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider pl-1">Event Injections</span>

        <div className="flex flex-col gap-2">
          {/* Inject request */}
          <button
            onClick={handleInjectRequest}
            className="w-full py-3.5 px-4 rounded-2xl bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-2"
          >
            <HourglassIcon size={18} weight="fill" />
            <span>Inject Extra Time Request</span>
          </button>

          {/* Reset button */}
          <button
            onClick={reset}
            className="w-full py-3.5 px-4 rounded-2xl bg-secondary/40 hover:bg-secondary/60 border border-border/60 text-muted-foreground hover:text-foreground text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-2"
          >
            <ArrowsClockwiseIcon size={18} weight="bold" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Design notes */}
      <div className="border-t border-border/60 pt-4 flex gap-2 text-[10px] font-medium text-muted-foreground">
        <HeartIcon size={14} className="text-rose-500 shrink-0 mt-0.5" />
        <span>Designed for Aura Wellbeing. Supports dynamic child locks, extra time approvals, and custom spline reports.</span>
      </div>
    </section>
  )
}
export default SandboxConsole
