import { AnimatePresence, motion } from 'framer-motion'

import { useWellbeingLogic } from '@/hooks/useWellbeingLogic'

import { MobileFrame } from '@/components/MobileFrame'
import { LayoutPersonal } from '@/components/LayoutPersonal'
import { LayoutParental } from '@/components/LayoutParental'
import { LayoutChild } from '@/components/LayoutChild'
import { LayoutAdblocker } from '@/components/LayoutAdblocker'
import { SandboxConsole } from '@/components/SandboxConsole'

import { SparkleIcon, MoonIcon, SunIcon } from '@phosphor-icons/react'

export const App = () => {
  const {
    activeLayout,
    activeTheme,
    setActiveTheme
  } = useWellbeingLogic()

  // Layout screen matching
  const renderLayoutContent = () => {
    if (activeLayout === 'personal') {
      return <LayoutPersonal />
    }
    if (activeLayout === 'parental') {
      return <LayoutParental />
    }
    if (activeLayout === 'child') {
      return <LayoutChild />
    }
    if (activeLayout === 'adblocker') {
      return <LayoutAdblocker />
    }
    return <LayoutPersonal />
  }

  const handleToggleTheme = () => {
    setActiveTheme(activeTheme === 'light' ? 'dark' : 'light')
  }

  return (
    <section className="min-h-screen w-full bg-gradient-to-tr from-slate-100 via-slate-50 to-purple-50/50 p-4 transition-all duration-300 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950/20 flex flex-col items-center justify-center select-none font-sans overflow-x-hidden">
      {/* Top Navbar */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-6 px-4 shrink-0">
        <div className="flex items-center gap-2">
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
            <AnimatePresence mode="wait">
              <motion.div
                key={activeLayout}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="h-full w-full"
              >
                {renderLayoutContent()}
              </motion.div>
            </AnimatePresence>
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
