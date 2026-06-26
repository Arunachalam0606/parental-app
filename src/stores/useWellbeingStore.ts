import { create } from 'zustand'

export type TabType = 'dashboard' | 'parental' | 'shield' | 'profile'
export type ProfileModeType = 'parent' | 'child'

export interface AppStat {
  id: string
  name: string
  category: string
  timeSpent: number // in minutes
  notifications: number
  pickups: number
  limitMinutes?: number
  isLockedManually?: boolean
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
  whitelist: string[]
  blacklist: string[]
}

export interface ExtraTimeRequest {
  id: string
  childId: string
  appId: string
  minutesRequested: number
  status: 'pending' | 'approved' | 'rejected'
  timestamp: string
}

export interface ToastItem {
  id: string
  message: string
  type: 'success' | 'info' | 'warning'
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
  activeTab: TabType
  activeProfileMode: ProfileModeType
  activeAppDetailId: string | null
  appStats: AppStat[]
  categories: CategoryStat[]
  weeklyUsage: DayUsage[]
  childProfiles: ChildProfile[]
  selectedChildId: string
  childAppLimits: Record<string, Record<string, number>> // childId -> appId -> limitMinutes
  childManualLocks: Record<string, string[]> // childId -> lockedAppIds
  extraTimeRequests: ExtraTimeRequest[]
  toasts: ToastItem[]
  blockerStats: BlockerStats
  blockerToggles: BlockerToggles
  blockerHistory: BlockerHistoryItem[]
  whitelist: string[]
  blacklist: string[]
}

interface WellbeingActions {
  setActiveTab: (tab: TabType) => void
  setActiveProfileMode: (mode: ProfileModeType) => void
  setActiveAppDetailId: (appId: string | null) => void
  updateAppLimit: (appId: string, limitMinutes: number) => void
  togglePersonalManualLock: (appId: string) => void
  updateChildLimit: (childId: string, type: 'weekday' | 'weekend', limitMinutes: number) => void
  setChildAppLimit: (childId: string, appId: string, limitMinutes: number) => void
  toggleChildManualLock: (childId: string, appId: string) => void
  submitExtraTimeRequest: (childId: string, appId: string, minutes: number) => void
  handleExtraTimeRequest: (requestId: string, action: 'approve' | 'reject') => void
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
  addToast: (message: string, type?: 'success' | 'info' | 'warning') => void
  removeToast: (id: string) => void
  simulateActivityTick: () => void
  reset: () => void
}

const initialAppStats: AppStat[] = [
  { id: 'insta', name: 'Instagram', category: 'Social', timeSpent: 110, notifications: 84, pickups: 32, limitMinutes: 120, isLockedManually: false },
  { id: 'tiktok', name: 'TikTok', category: 'Social', timeSpent: 85, notifications: 124, pickups: 45, limitMinutes: 90, isLockedManually: false },
  { id: 'yt', name: 'YouTube', category: 'Entertainment', timeSpent: 70, notifications: 24, pickups: 15, limitMinutes: 120, isLockedManually: false },
  { id: 'notion', name: 'Notion', category: 'Productivity', timeSpent: 45, notifications: 4, pickups: 8, isLockedManually: false },
  { id: 'chase', name: 'Chase Mobile', category: 'Finance', timeSpent: 15, notifications: 12, pickups: 4, isLockedManually: false },
  { id: 'minecraft', name: 'Minecraft', category: 'Gaming', timeSpent: 55, notifications: 0, pickups: 2, limitMinutes: 60, isLockedManually: false },
  { id: 'whatsapp', name: 'WhatsApp', category: 'Communication', timeSpent: 40, notifications: 68, pickups: 28, isLockedManually: false }
]

const initialCategories: CategoryStat[] = [
  { name: 'Social', timeSpent: 195, color: '#C084FC' },
  { name: 'Entertainment', timeSpent: 70, color: '#818CF8' },
  { name: 'Gaming', timeSpent: 55, color: '#F87171' },
  { name: 'Communication', timeSpent: 40, color: '#34D399' },
  { name: 'Productivity', timeSpent: 45, color: '#60A5FA' },
  { name: 'Finance', timeSpent: 15, color: '#FBBF24' }
]

const initialWeeklyUsage: DayUsage[] = [
  { day: 'Sun', minutes: 190, goalMinutes: 240 },
  { day: 'Mon', minutes: 280, goalMinutes: 240 },
  { day: 'Tue', minutes: 180, goalMinutes: 240 },
  { day: 'Wed', minutes: 220, goalMinutes: 240 },
  { day: 'Thu', minutes: 250, goalMinutes: 240 },
  { day: 'Fri', minutes: 150, goalMinutes: 240 },
  { day: 'Sat', minutes: 310, goalMinutes: 240 }
]

const initialChildProfiles: ChildProfile[] = [
  {
    id: 'alex',
    name: 'Alex',
    age: 9,
    avatarColor: '#818CF8',
    weekdayLimitMinutes: 90,
    weekendLimitMinutes: 180,
    timeSpentToday: 78,
    whitelist: ['khanacademy.org', 'wikipedia.org', 'duolingo.com'],
    blacklist: ['tiktok.com', 'roblox.com']
  },
  {
    id: 'emma',
    name: 'Emma',
    age: 14,
    avatarColor: '#F472B6',
    weekdayLimitMinutes: 180,
    weekendLimitMinutes: 240,
    timeSpentToday: 155,
    whitelist: ['wikipedia.org', 'quizlet.com', 'spotify.com'],
    blacklist: ['reddit.com']
  }
]

const initialBlockerHistory: BlockerHistoryItem[] = [
  { id: 'b1', domain: 'doubleclick.net', type: 'ad', time: '17:58:10' },
  { id: 'b2', domain: 'google-analytics.com', type: 'tracker', time: '17:58:05' },
  { id: 'b3', domain: 'connect.facebook.net', type: 'social', time: '17:57:54' },
  { id: 'b4', domain: 'adnxs.com', type: 'ad', time: '17:57:12' },
  { id: 'b5', domain: 'hotjar.com', type: 'tracker', time: '17:56:40' }
]

const initialChildAppLimits = {
  alex: { minecraft: 60, yt: 30 },
  emma: { tiktok: 60, yt: 45 }
}

const initialChildManualLocks = {
  alex: [] as string[],
  emma: [] as string[]
}

const initialExtraTimeRequests: ExtraTimeRequest[] = [
  {
    id: 'req1',
    childId: 'alex',
    appId: 'minecraft',
    minutesRequested: 15,
    status: 'pending',
    timestamp: '17:55'
  }
]

const initialState: WellbeingState = {
  activeTab: 'dashboard',
  activeProfileMode: 'parent',
  activeAppDetailId: null,
  appStats: initialAppStats,
  categories: initialCategories,
  weeklyUsage: initialWeeklyUsage,
  childProfiles: initialChildProfiles,
  selectedChildId: 'alex',
  childAppLimits: initialChildAppLimits,
  childManualLocks: initialChildManualLocks,
  extraTimeRequests: initialExtraTimeRequests,
  toasts: [],
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

  setActiveTab: (tab) => set({ activeTab: tab }),

  setActiveProfileMode: (mode) => set({ activeProfileMode: mode }),

  setActiveAppDetailId: (appId) => set({ activeAppDetailId: appId }),

  updateAppLimit: (appId, limitMinutes) =>
    set((state) => ({
      appStats: state.appStats.map((app) =>
        app.id === appId ? { ...app, limitMinutes: limitMinutes === 0 ? undefined : limitMinutes } : app
      )
    })),

  togglePersonalManualLock: (appId) =>
    set((state) => ({
      appStats: state.appStats.map((app) =>
        app.id === appId ? { ...app, isLockedManually: !app.isLockedManually } : app
      )
    })),

  updateChildLimit: (childId, type, limitMinutes) =>
    set((state) => ({
      childProfiles: state.childProfiles.map((p) => {
        if (p.id !== childId) return p
        return {
          ...p,
          weekdayLimitMinutes: type === 'weekday' ? limitMinutes : p.weekdayLimitMinutes,
          weekendLimitMinutes: type === 'weekend' ? limitMinutes : p.weekendLimitMinutes
        }
      })
    })),

  setChildAppLimit: (childId, appId, limitMinutes) =>
    set((state) => {
      const childLimits = state.childAppLimits[childId] || {}
      return {
        childAppLimits: {
          ...state.childAppLimits,
          [childId]: {
            ...childLimits,
            [appId]: limitMinutes
          }
        }
      }
    }),

  toggleChildManualLock: (childId, appId) =>
    set((state) => {
      const lockedApps = state.childManualLocks[childId] || []
      const updatedLockedApps = lockedApps.includes(appId)
        ? lockedApps.filter((id) => id !== appId)
        : [...lockedApps, appId]

      return {
        childManualLocks: {
          ...state.childManualLocks,
          [childId]: updatedLockedApps
        }
      }
    }),

  submitExtraTimeRequest: (childId, appId, minutes) =>
    set((state) => {
      const date = new Date()
      const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
      const newRequest: ExtraTimeRequest = {
        id: `req_${Math.random().toString(36).substr(2, 9)}`,
        childId,
        appId,
        minutesRequested: minutes,
        status: 'pending',
        timestamp: timeStr
      }

      return {
        extraTimeRequests: [...state.extraTimeRequests, newRequest]
      }
    }),

  handleExtraTimeRequest: (requestId, action) =>
    set((state) => {
      const request = state.extraTimeRequests.find((r) => r.id === requestId)
      if (!request) return {}

      const updatedRequests = state.extraTimeRequests.map((r) =>
        r.id === requestId ? { ...r, status: action === 'approve' ? ('approved' as const) : ('rejected' as const) } : r
      )

      let updatedChildAppLimits = state.childAppLimits
      if (action === 'approve') {
        const childLimits = state.childAppLimits[request.childId] || {}
        const currentLimit = childLimits[request.appId] || 60
        updatedChildAppLimits = {
          ...state.childAppLimits,
          [request.childId]: {
            ...childLimits,
            [request.appId]: currentLimit + request.minutesRequested
          }
        }
      }

      const childName = state.childProfiles.find((c) => c.id === request.childId)?.name || 'Child'
      const appName = state.appStats.find((a) => a.id === request.appId)?.name || 'App'
      const toastMessage = action === 'approve' 
        ? `Approved +${request.minutesRequested}m for ${childName} on ${appName}` 
        : `Rejected request from ${childName} on ${appName}`

      const newToast: ToastItem = {
        id: Math.random().toString(),
        message: toastMessage,
        type: action === 'approve' ? 'success' : 'warning'
      }

      return {
        extraTimeRequests: updatedRequests,
        childAppLimits: updatedChildAppLimits,
        toasts: [...state.toasts, newToast]
      }
    }),

  addChildWhitelist: (childId, domain) =>
    set((state) => ({
      childProfiles: state.childProfiles.map((p) => {
        if (p.id !== childId) return p
        if (p.whitelist.includes(domain)) return p
        return {
          ...p,
          whitelist: [...p.whitelist, domain],
          blacklist: p.blacklist.filter((d) => d !== domain)
        }
      })
    })),

  removeChildWhitelist: (childId, domain) =>
    set((state) => ({
      childProfiles: state.childProfiles.map((p) => {
        if (p.id !== childId) return p
        return { ...p, whitelist: p.whitelist.filter((d) => d !== domain) }
      })
    })),

  addChildBlacklist: (childId, domain) =>
    set((state) => ({
      childProfiles: state.childProfiles.map((p) => {
        if (p.id !== childId) return p
        if (p.blacklist.includes(domain)) return p
        return {
          ...p,
          blacklist: [...p.blacklist, domain],
          whitelist: p.whitelist.filter((d) => d !== domain)
        }
      })
    })),

  removeChildBlacklist: (childId, domain) =>
    set((state) => ({
      childProfiles: state.childProfiles.map((p) => {
        if (p.id !== childId) return p
        return { ...p, blacklist: p.blacklist.filter((d) => d !== domain) }
      })
    })),

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

  addToast: (message, type = 'info') =>
    set((state) => ({
      toasts: [...state.toasts, { id: Math.random().toString(), message, type }]
    })),

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    })),

  simulateActivityTick: () =>
    set((state) => {
      // 1. Increment personal screen time of active random app
      const activeAppIndex = Math.floor(Math.random() * state.appStats.length)
      const updatedAppStats = state.appStats.map((app, index) => {
        if (index !== activeAppIndex) return app
        const newTime = app.timeSpent + 1
        return {
          ...app,
          timeSpent: newTime,
          pickups: app.pickups + (Math.random() > 0.8 ? 1 : 0),
          notifications: app.notifications + (Math.random() > 0.9 ? 1 : 0)
        }
      })

      // Update categories time spent
      const updatedCategories = state.categories.map((cat) => {
        const matchingApps = updatedAppStats.filter((a) => a.category === cat.name)
        const totalTime = matchingApps.reduce((acc, a) => acc + a.timeSpent, 0)
        return { ...cat, timeSpent: totalTime }
      })

      // 2. Increment active child screen time
      const updatedProfiles = state.childProfiles.map((p) => {
        const newTime = p.timeSpentToday + (Math.random() > 0.65 ? 1 : 0)
        return { ...p, timeSpentToday: newTime }
      })

      // 3. Increment adblock stats
      const blockRate = (state.blockerToggles.blockAds ? 2 : 0) + (state.blockerToggles.blockTrackers ? 1 : 0)
      const shouldBlock = Math.random() > 0.65
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
        const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`

        const newBlock = {
          id: Math.random().toString(),
          domain: randomDomain,
          type: randomType,
          time: timeStr
        }

        updatedStats = {
          adsBlocked: state.blockerStats.adsBlocked + (randomType === 'ad' ? 1 : 0),
          trackersBlocked: state.blockerStats.trackersBlocked + (randomType === 'tracker' ? 1 : 0),
          dataSavedMb: parseFloat((state.blockerStats.dataSavedMb + Math.random() * 0.35).toFixed(2))
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
