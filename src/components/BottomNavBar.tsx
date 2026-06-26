import { motion } from 'framer-motion'

import { useWellbeingLogic } from '@/hooks/useWellbeingLogic'

import { 
  ClockIcon, 
  UsersIcon, 
  ShieldCheckIcon, 
  UserIcon 
} from '@phosphor-icons/react'

import type { TabType } from '@/stores/useWellbeingStore'

export const BottomNavBar = () => {
  const { activeTab, setActiveTab } = useWellbeingLogic()

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Wellbeing', icon: <ClockIcon size={20} weight="regular" /> },
    { id: 'parental', label: 'Parental', icon: <UsersIcon size={20} weight="regular" /> },
    { id: 'shield', label: 'Shield', icon: <ShieldCheckIcon size={20} weight="regular" /> },
    { id: 'profile', label: 'Profiles', icon: <UserIcon size={20} weight="regular" /> }
  ]

  return (
    <div className="sticky bottom-0 left-0 right-0 z-30 border-t border-border/80 bg-card/85 py-2.5 px-4 backdrop-blur-lg flex justify-between items-center rounded-b-[38px] select-none">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex flex-col items-center gap-1 flex-1 py-1.5 transition-colors cursor-pointer ${
              isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute -top-2.5 h-[3px] w-8 rounded-full bg-primary"
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              />
            )}
            
            <div className={`p-1 rounded-xl transition-all ${isActive ? 'scale-110' : ''}`}>
              {tab.icon}
            </div>

            <span className="text-[10px] font-bold tracking-tight">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
export default BottomNavBar
