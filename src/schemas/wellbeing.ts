import { z } from 'zod'

export const limitSchema = z.object({
  appId: z.string().min(1, 'App identification is required'),
  minutesLimit: z.number().min(0, 'Limit must be positive').max(1440, 'Limit cannot exceed a day')
})

export const domainSchema = z.object({
  domain: z.string().regex(
    /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i,
    'Please enter a valid domain address (e.g., example.com)'
  )
})

export const childProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  avatarColor: z.string().startsWith('#', 'Must be a valid hex color'),
  weekdayLimit: z.number().min(0).max(1440),
  weekendLimit: z.number().min(0).max(1440),
  isActive: z.boolean()
})

export type LimitData = z.infer<typeof limitSchema>
export type DomainData = z.infer<typeof domainSchema>
export type ChildProfileData = z.infer<typeof childProfileSchema>
