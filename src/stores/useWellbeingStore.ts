import { create } from 'zustand'

export type LayoutType = 'personal' | 'parental' | 'child' | 'adblocker'
export type ThemeType = 'light' | 'dark'

export interface AppStat {
  id: string
  name: string
  category: string
  timeSpent: number // in minutes
  notifications: number
  pickups: number
  limitMinutes?: number
}

export interface CategoryStat {
  name: string
  timeSpent: number // in minutes
  color: string
}

export interface DayUsage {
  day: string
  minutes: number
  goalMinutes: number
}

export interface ChildProfile {
  id: string
  name: string
  age: number
  avatarColor: string
  weekdayLimitMinutes: number
  weekendLimitMinutes: number
  timeSpentToday: number
  lockedApps: string[]
  whitelist: string[]
  blacklist: string[]
}

interface BlockerStats {
  adsBlocked: number
  trackersBlocked: number
  dataSavedMb: number
}

interface BlockerToggles {
  blockAds: boolean
  blockTrackers: boolean
  blockSocialWidgets: boolean
  blockAnnoyances: boolean
}

interface BlockerHistoryItem {
  id: string
  domain: string
  type: 'ad' | 'tracker' | 'social' | 'annoyance'
  time: string
}

interface WellbeingState {
  activeLayout: LayoutType
  appStats: AppStat[]
  categories: CategoryStat[]
  weeklyUsage: DayUsage[]
  childProfiles: ChildProfile[]
  selectedChildId: string
  blockerStats: BlockerStats
  blockerToggles: BlockerToggles
  blockerHistory: BlockerHistoryItem[]
  whitelist: string[]
  blacklist: string[]
}

interface WellbeingActions {
  setActiveLayout: (layout: LayoutType) => void
  updateAppLimit: (appId: string, limitMinutes: number) => void
  toggleAppLock: (appId: string, childId?: string) => void
  updateChildLimit: (childId: string, type: 'weekday' | 'weekend', limitMinutes: number) => void
  addChildWhitelist: (childId: string, domain: string) => void
  removeChildWhitelist: (childId: string, domain: string) => void
  addChildBlacklist: (childId: string, domain: string) => void
  removeChildBlacklist: (childId: string, domain: string) => void
  setSelectedChildId: (childId: string) => void
  toggleBlockerOption: (key: keyof BlockerToggles) => void
  addWhitelistDomain: (domain: string) => void
  removeWhitelistDomain: (domain: string) => void
  addBlacklistDomain: (domain: string) => void
  removeBlacklistDomain: (domain: string) => void
  simulateActivityTick: () => void
  reset: () => void
}

const initialAppStats: AppStat[] = [
  { id: 'insta', name: 'Instagram', category: 'Social', timeSpent: 110, notifications: 84, pickups: 32, limitMinutes: 120 },
  { id: 'tiktok', name: 'TikTok', category: 'Social', timeSpent: 85, notifications: 124, pickups: 45, limitMinutes: 90 },
  { id: 'yt', name: 'YouTube', category: 'Entertainment', timeSpent: 70, notifications: 24, pickups: 15, limitMinutes: 120 },
  { id: 'notion', name: 'Notion', category: 'Productivity', timeSpent: 45, notifications: 4, pickups: 8 },
  { id: 'chase', name: 'Chase Mobile', category: 'Finance', timeSpent: 15, notifications: 12, pickups: 4 },
  { id: 'minecraft', name: 'Minecraft', category: 'Gaming', timeSpent: 55, notifications: 0, pickups: 2, limitMinutes: 60 },
  { id: 'whatsapp', name: 'WhatsApp', category: 'Communication', timeSpent: 40, notifications: 68, pickups: 28 }
]

const initialCategories: CategoryStat[] = [
  { name: 'Social', timeSpent: 195, color: '#C084FC' }, // lavender
  { name: 'Entertainment', timeSpent: 70, color: '#818CF8' }, // indigo
  { name: 'Gaming', timeSpent: 55, color: '#F87171' }, // coral-red
  { name: 'Communication', timeSpent: 40, color: '#34D399' }, // sage emerald
  { name: 'Productivity', timeSpent: 45, color: '#60A5FA' }, // sky-blue
  { name: 'Finance', timeSpent: 15, color: '#FBBF24' } // soft amber
]

const initialWeeklyUsage: DayUsage[] = [
  { day: 'Sun', minutes: 190, goalMinutes: 240 },
  { day: 'Mon', minutes: 280, goalMinutes: 240 }, // Exceeded
  { day: 'Tue', minutes: 180, goalMinutes: 240 },
  { day: 'Wed', minutes: 220, goalMinutes: 240 },
  { day: 'Thu', minutes: 250, goalMinutes: 240 }, // Exceeded slightly
  { day: 'Fri', minutes: 150, goalMinutes: 240 },
  { day: 'Sat', minutes: 310, goalMinutes: 240 }  // Exceeded
]

const initialChildProfiles: ChildProfile[] = [
  {
    id: 'alex',
    name: 'Alex',
    age: 9,
    avatarColor: '#818CF8', // Indigo
    weekdayLimitMinutes: 90,
    weekendLimitMinutes: 180,
    timeSpentToday: 78,
    lockedApps: [],
    whitelist: ['khanacademy.org', 'wikipedia.org', 'duolingo.com'],
    blacklist: ['tiktok.com', 'roblox.com']
  },
  {
    id: 'emma',
    name: 'Emma',
    age: 14,
    avatarColor: '#F472B6', // Pink
    weekdayLimitMinutes: 180,
    weekendLimitMinutes: 240,
    timeSpentToday: 195,
    lockedApps: ['tiktok'], // TikTok limit hit and locked
    whitelist: ['wikipedia.org', 'quizlet.com', 'spotify.com'],
    blacklist: ['reddit.com']
  }
]

const initialBlockerHistory: BlockerHistoryItem[] = [
  { id: 'b1', domain: 'doubleclick.net', type: 'ad', time: '17:28:10' },
  { id: 'b2', domain: 'google-analytics.com', type: 'tracker', time: '17:28:05' },
  { id: 'b3', domain: 'connect.facebook.net', type: 'social', time: '17:27:54' },
  { id: 'b4', domain: 'adnxs.com', type: 'ad', time: '17:27:12' },
  { id: 'b5', domain: 'hotjar.com', type: 'tracker', time: '17:26:40' }
]

const initialState: WellbeingState = {
  activeLayout: 'personal',
  appStats: initialAppStats,
  categories: initialCategories,
  weeklyUsage: initialWeeklyUsage,
  childProfiles: initialChildProfiles,
  selectedChildId: 'alex',
  blockerStats: {
    adsBlocked: 14382,
    trackersBlocked: 4291,
    dataSavedMb: 824.5
  },
  blockerToggles: {
    blockAds: true,
    blockTrackers: true,
    blockSocialWidgets: false,
    blockAnnoyances: true
  },
  blockerHistory: initialBlockerHistory,
  whitelist: ['youtube.com', 'notion.so', 'google.com'],
  blacklist: ['facebook.com', 'pinterest.com']
}

export const useWellbeingStore = create<WellbeingState & WellbeingActions>((set) => ({
  ...initialState,

  setActiveLayout: (layout) => set({ activeLayout: layout }),

  updateAppLimit: (appId, limitMinutes) =>
    set((state) => {
      const updatedStats = state.appStats.map((app) =>
        app.id === appId ? { ...app, limitMinutes: limitMinutes === 0 ? undefined : limitMinutes } : app
      )

      return { appStats: updatedStats }
    }),

  toggleAppLock: (appId, childId) =>
    set((state) => {
      if (childId) {
        const updatedProfiles = state.childProfiles.map((p) => {
          if (p.id !== childId) return p
          const exists = p.lockedApps.includes(appId)
          const lockedApps = exists
            ? p.lockedApps.filter((id) => id !== appId)
            : [...p.lockedApps, appId]
          return { ...p, lockedApps }
        })
        return { childProfiles: updatedProfiles }
      } else {
        // Personal mode app locks
        const updatedStats = state.appStats.map((app) => {
          if (app.id !== appId) return app
          return app
        })
        return { appStats: updatedStats }
      }
    }),

  updateChildLimit: (childId, type, limitMinutes) =>
    set((state) => {
      const updatedProfiles = state.childProfiles.map((p) => {
        if (p.id !== childId) return p
        return {
          ...p,
          weekdayLimitMinutes: type === 'weekday' ? limitMinutes : p.weekdayLimitMinutes,
          weekendLimitMinutes: type === 'weekend' ? limitMinutes : p.weekendLimitMinutes
        }
      })
      return { childProfiles: updatedProfiles }
    }),

  addChildWhitelist: (childId, domain) =>
    set((state) => {
      const updatedProfiles = state.childProfiles.map((p) => {
        if (p.id !== childId) return p
        if (p.whitelist.includes(domain)) return p
        return {
          ...p,
          whitelist: [...p.whitelist, domain],
          blacklist: p.blacklist.filter((d) => d !== domain)
        }
      })
      return { childProfiles: updatedProfiles }
    }),

  removeChildWhitelist: (childId, domain) =>
    set((state) => {
      const updatedProfiles = state.childProfiles.map((p) => {
        if (p.id !== childId) return p
        return { ...p, whitelist: p.whitelist.filter((d) => d !== domain) }
      })
      return { childProfiles: updatedProfiles }
    }),

  addChildBlacklist: (childId, domain) =>
    set((state) => {
      const updatedProfiles = state.childProfiles.map((p) => {
        if (p.id !== childId) return p
        if (p.blacklist.includes(domain)) return p
        return {
          ...p,
          blacklist: [...p.blacklist, domain],
          whitelist: p.whitelist.filter((d) => d !== domain)
        }
      })
      return { childProfiles: updatedProfiles }
    }),

  removeChildBlacklist: (childId, domain) =>
    set((state) => {
      const updatedProfiles = state.childProfiles.map((p) => {
        if (p.id !== childId) return p
        return { ...p, blacklist: p.blacklist.filter((d) => d !== domain) }
      })
      return { childProfiles: updatedProfiles }
    }),

  setSelectedChildId: (childId) => set({ selectedChildId: childId }),

  toggleBlockerOption: (key) =>
    set((state) => ({
      blockerToggles: {
        ...state.blockerToggles,
        [key]: !state.blockerToggles[key]
      }
    })),

  addWhitelistDomain: (domain) =>
    set((state) => {
      if (state.whitelist.includes(domain)) return {}
      return {
        whitelist: [...state.whitelist, domain],
        blacklist: state.blacklist.filter((d) => d !== domain)
      }
    }),

  removeWhitelistDomain: (domain) =>
    set((state) => ({
      whitelist: state.whitelist.filter((d) => d !== domain)
    })),

  addBlacklistDomain: (domain) =>
    set((state) => {
      if (state.blacklist.includes(domain)) return {}
      return {
        blacklist: [...state.blacklist, domain],
        whitelist: state.whitelist.filter((d) => d !== domain)
      }
    }),

  removeBlacklistDomain: (domain) =>
    set((state) => ({
      blacklist: state.blacklist.filter((d) => d !== domain)
    })),

  simulateActivityTick: () =>
    set((state) => {
      // 1. Tick personal screen times
      const activeAppIndex = Math.floor(Math.random() * state.appStats.length)
      const updatedAppStats = state.appStats.map((app, index) => {
        if (index !== activeAppIndex) return app
        const newTime = app.timeSpent + 1
        return {
          ...app,
          timeSpent: newTime,
          // Occasionally increment pickups and notifications
          pickups: app.pickups + (Math.random() > 0.8 ? 1 : 0),
          notifications: app.notifications + (Math.random() > 0.9 ? 1 : 0)
        }
      })

      // Update category totals
      const updatedCategories = state.categories.map((cat) => {
        const matchingApps = updatedAppStats.filter((a) => a.category === cat.name)
        const totalTime = matchingApps.reduce((acc, a) => acc + a.timeSpent, 0)
        return { ...cat, timeSpent: totalTime }
      })

      // Update child stats
      const updatedProfiles = state.childProfiles.map((p) => {
        const newTime = p.timeSpentToday + (Math.random() > 0.6 ? 1 : 0)
        
        // Auto-lock TikTok if limit (180 for Emma) hit
        const lockedApps = [...p.lockedApps]
        if (p.id === 'emma' && newTime >= 200 && !lockedApps.includes('tiktok')) {
          lockedApps.push('tiktok')
        }
        if (p.id === 'alex' && newTime >= 90 && !lockedApps.includes('minecraft')) {
          lockedApps.push('minecraft')
        }

        return { ...p, timeSpentToday: newTime, lockedApps }
      })

      // 2. Tick Adblocker stats if shields are up
      const blockRate = (state.blockerToggles.blockAds ? 2 : 0) + (state.blockerToggles.blockTrackers ? 1 : 0)
      const shouldBlock = Math.random() > 0.7
      let updatedStats = state.blockerStats
      let updatedHistory = state.blockerHistory

      if (shouldBlock && blockRate > 0) {
        const mockDomains = [
          'ads.twitter.com', 'tracking.tiktok.com', 'pixel.facebook.com', 
          'analytics.yahoo.com', 'adservice.google.com', 'telemetry.roblox.com'
        ]
        const randomDomain = mockDomains[Math.floor(Math.random() * mockDomains.length)]
        const randomType: 'ad' | 'tracker' | 'social' | 'annoyance' = 
          randomDomain.includes('ads') ? 'ad' : randomDomain.includes('tracking') ? 'tracker' : 'social'

        const date = new Date()
        const timeStr = date.toTimeString().split(' ')[0]

        const newBlock = {
          id: Math.random().toString(),
          domain: randomDomain,
          type: randomType,
          time: timeStr
        }

        updatedStats = {
          adsBlocked: state.blockerStats.adsBlocked + (randomType === 'ad' ? 1 : 0),
          trackersBlocked: state.blockerStats.trackersBlocked + (randomType === 'tracker' ? 1 : 0),
          dataSavedMb: parseFloat((state.blockerStats.dataSavedMb + Math.random() * 0.4).toFixed(2))
        }

        updatedHistory = [newBlock, ...state.blockerHistory.slice(0, 19)]
      }

      return {
        appStats: updatedAppStats,
        categories: updatedCategories,
        childProfiles: updatedProfiles,
        blockerStats: updatedStats,
        blockerHistory: updatedHistory
      }
    }),

  reset: () => set(initialState)
}))
