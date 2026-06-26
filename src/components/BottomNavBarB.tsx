import { motion } from "framer-motion"

import type { TabType } from "@/stores/useWellbeingStore"

import { useWellbeingLogic } from "@/hooks/useWellbeingLogic"

import {
  ClockIcon,
  UsersIcon,
  ShieldCheckIcon,
  UserIcon,
} from "@phosphor-icons/react"

export const BottomNavBarB = () => {
  const { activeTab, setActiveTab } = useWellbeingLogic()

  const tabs: {
    id: TabType
    label: string
    icon: React.ComponentType<{
      size?: number
      weight?: "fill" | "regular" | "thin" | "light" | "bold" | "duotone"
    }>
  }[] = [
    { id: "dashboard", label: "Wellbeing", icon: ClockIcon },
    { id: "parental", label: "Family", icon: UsersIcon },
    { id: "shield", label: "Shield", icon: ShieldCheckIcon },
    { id: "profile", label: "Profiles", icon: UserIcon },
  ]

  return (
    <section className="relative z-30 mx-5 mt-0.5 mb-4 shrink-0 select-none">
      <div className="flex items-center justify-between rounded-2xl border border-white/50 bg-white/40 px-2 py-1.5 shadow-[0_12px_40px_-6px_rgba(0,0,0,0.04)] backdrop-blur-2xl dark:border-white/10 dark:bg-black/35">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const IconComponent = tab.icon

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border-none py-1.5 transition-all duration-300 ease-out outline-none active:scale-[0.9]"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabPillB"
                  className="absolute inset-x-2 inset-y-0.5 rounded-xl border border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 dark:border-purple-400/30 dark:from-purple-400/20 dark:to-indigo-400/20"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}

              <div
                className={`flex flex-col items-center gap-0.5 transition-all duration-300 ${isActive ? "scale-105 font-bold text-primary" : "text-muted-foreground/80 hover:text-foreground"}`}
              >
                <IconComponent
                  size={19}
                  weight={isActive ? "fill" : "regular"}
                />

                <span className="text-[8.5px] font-semibold tracking-wide uppercase">
                  {tab.label}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default BottomNavBarB
