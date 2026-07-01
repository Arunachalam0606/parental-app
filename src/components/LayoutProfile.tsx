import { useWellbeingLogic } from "@/hooks/useWellbeingLogic"

import { LockIcon, CaretRightIcon } from "@phosphor-icons/react"

interface LayoutProfileProps {
  onOpenDrawer: () => void
}

export const LayoutProfile = (props: LayoutProfileProps) => {
  const { onOpenDrawer } = props

  const {
    childProfiles,
    setSelectedChildId,
    setActiveProfileMode,
    setActiveTab,
    addToast,
    layoutMode,
  } = useWellbeingLogic()

  return (
    <div className="flex flex-col gap-4 select-none">
      <div>
        <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
          Profile Center
        </span>
        <h1 className="mt-0.5 font-heading text-2xl font-bold tracking-tight text-foreground/90">
          Aura Accounts
        </h1>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card/65 p-4.5 shadow-sm backdrop-blur-xl">
        <h3 className="font-heading text-sm font-semibold tracking-tight">
          Active Profiles
        </h3>

        <div className="flex flex-col gap-2.5">
          {/* Adult Profile */}
          <div className="flex items-center justify-between rounded-xl border border-border/40 bg-secondary/35 p-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 font-bold text-purple-600 dark:text-purple-400">
                A
              </div>
              <div>
                <span className="text-xs font-bold text-foreground">
                  Adult Mode (Personal)
                </span>
                <p className="mt-0.5 text-[9px] font-medium text-muted-foreground">
                  Full stats, bypass filters, no blocks
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveProfileMode("parent")
                setActiveTab("dashboard")
                addToast("Switched to Personal Adult Mode", "success")
              }}
              className="h-8 cursor-pointer rounded-lg bg-primary px-3 text-[10px] font-bold text-primary-foreground shadow-sm active:scale-95"
            >
              Enter
            </button>
          </div>

          {/* Child Profiles list */}
          {childProfiles.map((child) => (
            <div
              key={child.id}
              className="flex items-center justify-between rounded-xl border border-border/40 bg-secondary/35 p-3.5"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl font-bold text-white"
                  style={{ backgroundColor: child.avatarColor }}
                >
                  {child.name.charAt(0)}
                </div>
                <div>
                  <span className="text-xs font-bold text-foreground">
                    {child.name} ({child.age}yo)
                  </span>
                  <p className="mt-0.5 text-[9px] font-medium text-muted-foreground">
                    Subject to daily app schedules & timers
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedChildId(child.id)
                  setActiveProfileMode("child")
                  addToast(`Entered ${child.name}'s locked space`, "info")
                }}
                className="flex h-8 cursor-pointer items-center gap-1 rounded-lg border border-border bg-secondary px-3 text-[10px] font-bold text-foreground/80 hover:bg-muted active:scale-95"
              >
                <LockIcon
                  size={12}
                  weight="fill"
                  className="mr-1 inline-block"
                />
                <span>Lock Screen</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Display Settings Card switcher */}
      <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card/65 p-4.5 shadow-sm backdrop-blur-xl">
        <h3 className="mb-1 font-heading text-xs font-bold tracking-wider text-muted-foreground uppercase">
          Display Settings
        </h3>

        <div
          onClick={onOpenDrawer}
          className="flex cursor-pointer items-center justify-between rounded-xl border border-border/40 bg-secondary/35 p-3.5 transition-all hover:bg-secondary/60 active:scale-95"
        >
          <div>
            <span className="text-xs font-bold font-semibold text-foreground/90">
              App Layout Theme
            </span>
            <p className="mt-0.5 text-[9px] font-medium text-muted-foreground">
              Choose classic A or premium redesigned B layout
            </p>
          </div>

          <span className="flex items-center gap-1 text-xs font-black text-primary">
            {layoutMode === "B"
              ? "Layout B"
              : layoutMode === "C"
                ? "Layout C"
                : "Layout A"}
            <CaretRightIcon size={12} />
          </span>
        </div>
      </div>

      {/* Security configuration */}
      <div className="rounded-2xl border border-border bg-card/65 p-4.5 shadow-sm backdrop-blur-xl">
        <h3 className="mb-2 font-heading text-xs font-bold tracking-wider text-muted-foreground uppercase">
          Security Override Settings
        </h3>
        <div className="flex items-center justify-between rounded-xl border border-border/40 bg-secondary/35 p-3.5">
          <div>
            <span className="text-xs font-semibold text-foreground/90">
              Parent PIN protection
            </span>
            <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">
              Required to unlock children lockout layers
            </p>
          </div>
          <span className="text-xs font-bold text-primary">•••• Active</span>
        </div>
      </div>
    </div>
  )
}

export default LayoutProfile
