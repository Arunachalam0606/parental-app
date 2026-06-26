import { useEffect } from 'react'

import { AnimatePresence, motion } from 'framer-motion'

import { useWellbeingLogic } from '@/hooks/useWellbeingLogic'

import { MobileFrame } from '@/components/MobileFrame'
import { BottomNavBar } from '@/components/BottomNavBar'
import { AppDetailReport } from '@/components/AppDetailReport'
import { LayoutPersonal } from '@/components/LayoutPersonal'
import { LayoutParental } from '@/components/LayoutParental'
import { LayoutChild } from '@/components/LayoutChild'
import { LayoutAdblocker } from '@/components/LayoutAdblocker'
import { SandboxConsole } from '@/components/SandboxConsole'

import { 
  SparkleIcon, 
  MoonIcon, 
  SunIcon, 
  CheckCircleIcon,
  WarningCircleIcon,
  InfoIcon,
  XIcon,
  LockIcon
} from '@phosphor-icons/react'

export const App = () => {
  const {
    activeTab,
    activeProfileMode,
    activeAppDetailId,
    activeTheme,
    setActiveTheme,
    toasts,
    removeToast,
    childProfiles,
    setSelectedChildId,
    setActiveProfileMode,
    setActiveTab,
    addToast,
    wellbeingSubPage
  } = useWellbeingLogic()

  // Auto-remove toasts after 3.5s
  useEffect(() => {
    if (toasts.length === 0) return
    const latestToast = toasts[toasts.length - 1]
    const timer = setTimeout(() => {
      removeToast(latestToast.id)
    }, 3500)
    return () => clearTimeout(timer)
  }, [toasts, removeToast])

  const handleToggleTheme = () => {
    setActiveTheme(activeTheme === 'light' ? 'dark' : 'light')
  }

  // Simple profile tab layout component inside App.tsx
  const LayoutProfile = () => {
    return (
      <div className="flex flex-col gap-6 select-none">
        <div>
          <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Profile Center</span>
          <h1 className="font-heading text-2xl font-bold tracking-tight mt-0.5 text-foreground/90">Aura Accounts</h1>
        </div>

        <div className="rounded-3xl bg-card/60 p-5 shadow-sm border border-border backdrop-blur-xl flex flex-col gap-4">
          <h3 className="font-heading text-sm font-semibold tracking-tight">Active Profiles</h3>
          
          <div className="flex flex-col gap-3">
            {/* Adult Profile */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/35 border border-border/40">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                  A
                </div>
                <div>
                  <span className="text-xs font-bold text-foreground">Adult Mode (Personal)</span>
                  <p className="text-[9px] font-medium text-muted-foreground mt-0.5">Full stats, bypass filters, no blocks</p>
                </div>
              </div>
              
              <button 
                onClick={() => {
                  setActiveProfileMode('parent')
                  setActiveTab('dashboard')
                  addToast('Switched to Personal Adult Mode', 'success')
                }}
                className="h-8.5 px-3.5 rounded-xl bg-primary text-primary-foreground text-[10px] font-bold shadow-sm hover:opacity-90 cursor-pointer"
              >
                Enter
              </button>
            </div>

            {/* Child Profiles list */}
            {childProfiles.map((child) => (
              <div key={child.id} className="flex items-center justify-between p-4 rounded-2xl bg-secondary/35 border border-border/40">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: child.avatarColor }}>
                    {child.name.charAt(0)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-foreground">{child.name} ({child.age}yo)</span>
                    <p className="text-[9px] font-medium text-muted-foreground mt-0.5">Subject to daily app schedules & timers</p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setSelectedChildId(child.id)
                    setActiveProfileMode('child')
                    addToast(`Entered ${child.name}'s locked space`, 'info')
                  }}
                  className="h-8.5 px-3.5 rounded-xl bg-secondary hover:bg-muted border border-border text-[10px] font-bold text-foreground/80 cursor-pointer flex items-center gap-1"
                >
                  <LockIcon size={12} weight="fill" />
                  <span>Lock Screen</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security configuration */}
        <div className="rounded-3xl bg-card/60 p-5 shadow-sm border border-border backdrop-blur-xl">
          <h3 className="font-heading text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3.5">Security Override Settings</h3>
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/35 border border-border/40">
            <div>
              <span className="text-xs font-semibold text-foreground/90">Parent PIN protection</span>
              <p className="text-[10px] font-medium text-muted-foreground mt-0.5">Required to unlock children lockout layers</p>
            </div>
            <span className="text-xs font-bold text-primary">•••• Active</span>
          </div>
        </div>
      </div>
    )
  }

  // Page Routing inside mockup
  const renderLayoutContent = () => {
    // If Child Mode is active, lockout screen takes precedence
    if (activeProfileMode === 'child') {
      return <LayoutChild />
    }

    if (activeTab === 'dashboard') {
      return <LayoutPersonal />
    }

    if (activeTab === 'parental') {
      return <LayoutParental />
    }

    if (activeTab === 'shield') {
      return <LayoutAdblocker />
    }

    if (activeTab === 'profile') {
      return <LayoutProfile />
    }

    return <LayoutPersonal />
  }

  const getToastIcon = (type: string) => {
    if (type === 'success') return <CheckCircleIcon size={16} weight="fill" className="text-emerald-500" />
    if (type === 'warning') return <WarningCircleIcon size={16} weight="fill" className="text-rose-500" />
    return <InfoIcon size={16} weight="fill" className="text-blue-500" />
  }

  return (
    <section className="min-h-screen w-full bg-gradient-to-tr from-slate-100 via-slate-50 to-purple-50/50 p-4 transition-all duration-300 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950/20 flex flex-col items-center justify-center select-none font-sans overflow-x-hidden relative">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-96 w-96 rounded-full bg-purple-300/25 blur-[120px] dark:bg-purple-900/10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-indigo-300/30 blur-[140px] dark:bg-indigo-900/10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[500px] w-[500px] rounded-full bg-pink-200/15 blur-[150px] dark:bg-pink-950/5 pointer-events-none" />

      {/* Toast Notifications Overlay (Inside mock or global) */}
      <div className="fixed top-6 right-6 z-[100] flex flex-col gap-2 max-w-sm select-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-card border border-border shadow-[0_12px_24px_-4px_rgba(0,0,0,0.06)] text-xs text-foreground font-semibold backdrop-blur-xl"
            >
              <div className="flex items-center gap-2">
                {getToastIcon(toast.type)}
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <XIcon size={12} weight="bold" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Top Navbar */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-6 px-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <SparkleIcon size={18} weight="fill" />
          </div>

          <div>
            <h1 className="font-heading text-sm font-bold tracking-tight text-foreground">Aura Wellbeing</h1>
            <span className="text-[10px] text-muted-foreground font-semibold block -mt-0.5">POC Sandbox</span>
          </div>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-3">
          {/* Quick theme toggler */}
          <button
            onClick={handleToggleTheme}
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-card border border-border shadow-sm text-foreground hover:bg-secondary transition-colors cursor-pointer"
          >
            {activeTheme === 'light' ? (
              <MoonIcon size={18} weight="regular" />
            ) : (
              <SunIcon size={18} weight="regular" />
            )}
          </button>
        </div>
      </div>

      {/* Main Workspace Frame container */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 flex-1">
        {/* Mockup screen */}
        <div className="flex-1 flex justify-center py-4">
          <MobileFrame>
            <div className="h-full w-full flex flex-col justify-between relative overflow-hidden">
              {/* Active Layout area */}
              <div className="flex-1 overflow-y-auto pr-1 pt-1 pb-4 scrollbar-none">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeProfileMode === 'child' ? 'child' : `tab_${activeTab}`}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="h-full w-full"
                  >
                    {renderLayoutContent()}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Interactive bottom bar (hidden in Child Mode / App Details / sub-pages) */}
              {activeProfileMode !== 'child' && activeAppDetailId === null && (activeTab !== 'dashboard' || wellbeingSubPage === 'home') && (
                <BottomNavBar />
              )}

              {/* Sliding App Detail Report Overlay */}
              <AnimatePresence>
                {activeAppDetailId !== null && (
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 26, stiffness: 220 }}
                    className="absolute inset-0 z-40 bg-background rounded-[38px] overflow-hidden"
                  >
                    <AppDetailReport />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </MobileFrame>
        </div>

        {/* Interactive control panel sidebar */}
        <div className="shrink-0 pb-8 md:pb-0">
          <SandboxConsole />
        </div>
      </div>
    </section>
  )
}

export default App
