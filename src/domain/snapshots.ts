import { z } from 'zod'
import { alertSchema, forecastSchema, recommendationSchema, wasteRiskSchema } from './intelligence'
import { commoditySchema, marketSchema, priceObservationSchema, regionSchema } from './markets'
import { invitationSchema, organizationSchema, roleSchema, userSchema } from './platform'
import { freshnessSchema, isoDateTimeSchema } from './primitives'

export const dashboardKpiSchema = z.object({ id: z.string().min(1), label: z.string().min(2), value: z.number().finite(), displayValue: z.string().min(1), trendPercent: z.number().min(-100).max(100).optional(), tone: z.enum(['neutral', 'success', 'warning', 'danger', 'info']) })
export const dashboardSnapshotSchema = z.object({ state: z.enum(['success', 'empty', 'stale', 'low-confidence', 'partial', 'critical-risk']), generatedAt: isoDateTimeSchema, freshness: freshnessSchema, kpis: z.array(dashboardKpiSchema), prices: z.array(priceObservationSchema), forecasts: z.array(forecastSchema), risks: z.array(wasteRiskSchema), alerts: z.array(alertSchema), recommendations: z.array(recommendationSchema), unavailableSections: z.array(z.string()).default([]) })
export const catalogSnapshotSchema = z.object({ regions: z.array(regionSchema), markets: z.array(marketSchema), commodities: z.array(commoditySchema) })
export const platformSnapshotSchema = z.object({ organization: organizationSchema, users: z.array(userSchema), roles: z.array(roleSchema), invitations: z.array(invitationSchema) })

export type DashboardKpi = z.infer<typeof dashboardKpiSchema>
export type DashboardSnapshot = z.infer<typeof dashboardSnapshotSchema>
export type CatalogSnapshot = z.infer<typeof catalogSnapshotSchema>
export type PlatformSnapshot = z.infer<typeof platformSnapshotSchema>
