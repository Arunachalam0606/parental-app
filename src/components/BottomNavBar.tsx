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

  const handleTabClick = (tabId: TabType) => () => {
    setActiveTab(tabId)
  }

  const tabContainer = (
    <div className="flex justify-between items-center max-w-sm mx-auto px-2">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        const IconComponent = tab.icon

        return (
          <button
            key={tab.id}
            onClick={handleTabClick(tab.id)}
            className="relative flex items-center justify-center transition-all duration-200 cursor-pointer rounded-full p-2"
          >
            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 rounded-full bg-primary -z-10"
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              />
            )}

            <div className={`transition-all duration-200 relative z-10 flex items-center justify-center ${isActive ? 'scale-105 px-3 py-1 text-primary-foreground' : 'text-muted-foreground active:text-foreground'}`}>
              <IconComponent size={18} weight={isActive ? 'fill' : 'regular'} />

              {isActive && (
                <motion.span 
                  initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                  animate={{ opacity: 1, width: 'auto', marginLeft: 5 }}
                  exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-[10px] font-bold tracking-tight whitespace-nowrap overflow-hidden relative z-10"
                >
                  {tab.label}
                </motion.span>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )

  return (
    <section className="w-full select-none shrink-0 border-t border-border/50 bg-card/85 backdrop-blur-md py-2.5 pb-6">
      {tabContainer}
    </section>
  )
}

export default BottomNavBar
