import { useEffect, useState } from 'react'

import { WifiHighIcon, BatteryChargingIcon, CellSignalHighIcon } from '@phosphor-icons/react'

interface MobileFrameProps {
  children: React.ReactNode
}

export const MobileFrame = (props: MobileFrameProps) => {
  const { children } = props

  const defaultTime = '12:00'
  const [time, setTime] = useState(defaultTime)

  useEffect(() => {
    const updateTime = () => {
      const date = new Date()
      let hours = date.getHours()
      const minutes = date.getMinutes()
      const ampm = hours >= 12 ? 'PM' : 'AM'
      hours = hours % 12
      hours = hours ? hours : 12 // the hour '0' should be '12'
      const minutesStr = minutes < 10 ? `0${minutes}` : minutes
      setTime(`${hours}:${minutesStr} ${ampm}`)
    }

    updateTime()
    const interval = setInterval(updateTime, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative aspect-[9/19.2] h-[88vh] min-h-[640px] max-h-[850px] w-auto rounded-[48px] border-[12px] border-slate-900 bg-background text-foreground shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] outline-none ring-4 ring-slate-900/10 transition-all duration-300 dark:border-slate-800 dark:ring-white/5">
      <div className="absolute top-0 left-1/2 z-50 h-7 w-32 -translate-x-1/2 rounded-b-2xl bg-slate-900 dark:bg-slate-800">
        <div className="mx-auto mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-800 dark:bg-slate-700" />
      </div>

      <div className="absolute top-3 z-40 flex w-full justify-between px-7 text-[11px] font-medium tracking-tight text-foreground/80">
        <span>{time}</span>

        <div className="flex items-center gap-1.5">
          <CellSignalHighIcon size={14} weight="bold" />

          <WifiHighIcon size={14} weight="bold" />

          <BatteryChargingIcon size={16} weight="bold" className="text-emerald-500 dark:text-emerald-400" />
        </div>
      </div>

      <div className="h-full w-full overflow-y-auto px-5 pt-12 pb-6 scrollbar-none">
        {children}
      </div>

      <div className="absolute bottom-1.5 left-1/2 z-40 h-1.5 w-32 -translate-x-1/2 rounded-full bg-slate-900/40 dark:bg-white/20" />
    </section>
  )
}
