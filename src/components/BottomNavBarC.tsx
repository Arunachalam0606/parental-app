import { motion } from "framer-motion"

import type { TabType } from "@/stores/useWellbeingStore"

import { useWellbeingLogic } from "@/hooks/useWellbeingLogic"

import {
  ClockIcon,
  UsersIcon,
  ShieldCheckIcon,
  UserIcon,
} from "@phosphor-icons/react"

export const BottomNavBarC = () => {
  const { activeTab, setActiveTab } = useWellbeingLogic()

  const tabs: {
    id: TabType
    label: string
    icon: React.ComponentType<{
      size?: number
      weight?: "fill" | "regular" | "thin" | "light" | "bold" | "duotone"
    }>
  }[] = [
    { id: "dashboard", label: "Aura AI", icon: ClockIcon },
    { id: "parental", label: "Command", icon: UsersIcon },
    { id: "shield", label: "Matrix", icon: ShieldCheckIcon },
    { id: "profile", label: "Identity", icon: UserIcon },
  ]

  return (
    <section className="pointer-events-none absolute inset-x-0 bottom-0 z-30 select-none">
      {/* Soft blur, black shade behind the bottombar */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-20 bg-gradient-to-t from-slate-950/45 via-slate-950/15 to-transparent backdrop-blur-[3px]" />

      {/* Floating iridescent navbar for Layout C */}
      <div className="pointer-events-auto relative z-10 mx-5 mb-5 flex items-center justify-between rounded-2xl border border-purple-300/30 bg-white/20 px-2 py-1.5 shadow-[0_12px_40px_-6px_rgba(147,51,234,0.15)] backdrop-blur-xl dark:border-purple-950/30 dark:bg-slate-900/40">
        {/* Soft glowing aura indicator */}
        <div className="absolute -inset-1 -z-10 rounded-3xl bg-gradient-to-r from-pink-500/10 via-purple-500/5 to-cyan-500/10 opacity-75 blur-xl" />

        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const IconComponent = tab.icon

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-none py-2 transition-all duration-300 ease-out outline-none active:scale-[0.9]"
              style={{ flex: isActive ? "1.4 1 0%" : "1 1 0%" }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabPillC"
                  className="absolute inset-x-1.5 inset-y-1 rounded-xl border border-amber-500/25 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 dark:border-amber-400/30 dark:from-amber-400/20 dark:via-rose-400/15 dark:to-indigo-400/20"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}

              <div
                className={`relative z-10 flex items-center justify-center gap-1.5 px-2.5 transition-all duration-300 ${
                  isActive
                    ? "font-bold text-amber-600 dark:text-amber-300"
                    : "text-muted-foreground/80 hover:text-foreground"
                }`}
              >
                <IconComponent
                  size={19}
                  weight={isActive ? "fill" : "regular"}
                />

                {isActive && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    className="text-[10px] font-bold tracking-tight whitespace-nowrap"
                  >
                    {tab.label}
                  </motion.span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default BottomNavBarC
