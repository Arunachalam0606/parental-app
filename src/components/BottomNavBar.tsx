import { motion } from 'framer-motion'

import type { TabType } from '@/stores/useWellbeingStore'

import { useWellbeingLogic } from '@/hooks/useWellbeingLogic'

import { 
  ClockIcon, 
  UsersIcon, 
  ShieldCheckIcon, 
  UserIcon 
} from '@phosphor-icons/react'

export const BottomNavBar = () => {
  const { activeTab, setActiveTab } = useWellbeingLogic()

  const tabs: { id: TabType; label: string; icon: React.ComponentType<{ size?: number; weight?: 'fill' | 'regular' | 'thin' | 'light' | 'bold' | 'duotone' }> }[] = [
    { id: 'dashboard', label: 'Wellbeing', icon: ClockIcon },
    { id: 'parental', label: 'Parental', icon: UsersIcon },
    { id: 'shield', label: 'Shield', icon: ShieldCheckIcon },
    { id: 'profile', label: 'Profiles', icon: UserIcon }
  ]

  return (
    <section className="mx-6 mb-5 mt-1 select-none shrink-0">
      <div className="border border-border/40 bg-card/45 px-3 py-2 backdrop-blur-xl flex justify-between items-center rounded-full shadow-[0_8px_32px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_-4px_rgba(0,0,0,0.3)]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const IconComponent = tab.icon

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center justify-center transition-all duration-300 ease-out cursor-pointer rounded-full ${
                isActive 
                  ? 'px-4 py-2 bg-primary text-primary-foreground font-black shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)]' 
                  : 'p-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary/40'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 rounded-full bg-primary -z-10"
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                />
              )}

              <div className={`transition-all duration-300 relative z-10 flex items-center justify-center ${isActive ? 'scale-110' : ''}`}>
                <IconComponent size={20} weight={isActive ? 'fill' : 'regular'} />
              </div>

              {isActive && (
                <motion.span 
                  initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                  animate={{ opacity: 1, width: 'auto', marginLeft: 6 }}
                  exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-[11px] font-bold tracking-tight whitespace-nowrap overflow-hidden relative z-10"
                >
                  {tab.label}
                </motion.span>
              )}
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default BottomNavBar
