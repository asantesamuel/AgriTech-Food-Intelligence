import { z } from 'zod'
import { alertSchema, decisionSchema, forecastSchema, recommendationSchema, wasteRiskSchema } from './intelligence'
import { commodityCategorySchema, commoditySchema, marketSchema, priceObservationSchema, regionSchema } from './markets'
import { invitationSchema, organizationSchema, roleSchema, userSchema } from './platform'
import { confidenceSchema, entityIdSchema, freshnessSchema, isoDateTimeSchema, moneySchema, priceUnitSchema, probabilitySchema, severitySchema } from './primitives'

export const dashboardKpiSchema = z.object({ id: z.string().min(1), label: z.string().min(2), value: z.number().finite(), displayValue: z.string().min(1), trendPercent: z.number().min(-100).max(100).optional(), tone: z.enum(['neutral', 'success', 'warning', 'danger', 'info']) })
export const dashboardSnapshotSchema = z.object({ state: z.enum(['success', 'empty', 'stale', 'low-confidence', 'partial', 'critical-risk']), generatedAt: isoDateTimeSchema, freshness: freshnessSchema, kpis: z.array(dashboardKpiSchema), prices: z.array(priceObservationSchema), forecasts: z.array(forecastSchema), risks: z.array(wasteRiskSchema), alerts: z.array(alertSchema), recommendations: z.array(recommendationSchema), unavailableSections: z.array(z.string()).default([]) })
export const catalogSnapshotSchema = z.object({ regions: z.array(regionSchema), markets: z.array(marketSchema), commodities: z.array(commoditySchema) })
export const platformSnapshotSchema = z.object({ organization: organizationSchema, organizations: z.array(organizationSchema).min(1), users: z.array(userSchema), roles: z.array(roleSchema), invitations: z.array(invitationSchema) })
export const marketPulseSignalSchema = z.object({ id: z.string().min(1), commodityId: z.string().min(1), title: z.string().min(3), summary: z.string().min(3), severity: z.enum(['low', 'medium', 'high', 'critical']), regionIds: z.array(z.string().min(1)), direction: z.enum(['rising', 'falling', 'stable']), changePercent: z.number().finite(), decisionId: z.string().min(1).optional() })
export const marketPulseSnapshotSchema = z.object({ generatedAt: isoDateTimeSchema, state: dashboardSnapshotSchema.shape.state, signals: z.array(marketPulseSignalSchema), prices: z.array(priceObservationSchema), forecasts: z.array(forecastSchema), alerts: z.array(alertSchema) })
export const flowCorridorSchema = z.object({ id: z.string().min(1), commodityId: z.string().min(1), sourceRegionId: z.string().min(1), destinationRegionId: z.string().min(1), availableVolume: z.number().nonnegative(), committedVolume: z.number().nonnegative(), unit: z.string().min(1), leadTimeHours: z.number().positive(), pressure: z.enum(['balanced', 'tightening', 'surplus']), summary: z.string().min(3) })
export const commodityIntelligenceSnapshotSchema = z.object({ generatedAt: isoDateTimeSchema, state: dashboardSnapshotSchema.shape.state, commodity: commoditySchema, markets: z.array(marketSchema).min(1), prices: z.array(priceObservationSchema), forecast: forecastSchema.optional(), risks: z.array(wasteRiskSchema), alerts: z.array(alertSchema), recommendations: z.array(recommendationSchema), corridor: flowCorridorSchema })
export const commodityExplorerDirectionSchema = z.enum(['rising', 'falling', 'stable'])
export const commodityExplorerSortSchema = z.enum(['attention', 'increase', 'decrease', 'volatility', 'risk', 'freshness', 'name'])
export const commodityExplorerOrderSchema = z.enum(['asc', 'desc'])
export const commodityExplorerQuerySchema = z.object({
  q: z.string().trim().max(80).default(''),
  category: commodityCategorySchema.optional(),
  region: entityIdSchema.optional(),
  direction: commodityExplorerDirectionSchema.optional(),
  risk: severitySchema.optional(),
  confidence: confidenceSchema.shape.band.optional(),
  sort: commodityExplorerSortSchema.default('attention'),
  order: commodityExplorerOrderSchema.default('desc'),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().pipe(z.union([z.literal(10), z.literal(25), z.literal(50)])).default(10),
})
export const commodityExplorerItemSchema = z.object({
  attentionRank: z.number().int().nonnegative(),
  commodity: commoditySchema,
  market: marketSchema,
  referenceRegionId: entityIdSchema,
  currentPrice: z.object({ value: z.number().nonnegative(), unit: priceUnitSchema, observedAt: isoDateTimeSchema, freshness: freshnessSchema }),
  movementPercent: z.number().min(-100).max(100),
  direction: commodityExplorerDirectionSchema,
  volatilityPercent: z.number().min(0).max(100),
  volatilityBand: z.enum(['low', 'medium', 'high']),
  forecastSummary: z.object({ horizonDays: z.number().int().positive(), projectedValue: z.number().nonnegative(), unitLabel: z.string().min(1), lowerBound: z.number().nonnegative(), upperBound: z.number().nonnegative(), changePercent: z.number().min(-100).max(100), direction: z.enum(['rising', 'falling', 'stable']), confidence: confidenceSchema, freshness: freshnessSchema, modelId: z.string().min(1) }).refine((value) => value.lowerBound <= value.projectedValue && value.projectedValue <= value.upperBound, 'Projected value must be inside its interval').nullable(),
  riskSummary: z.object({ regionId: z.string().min(1), severity: severitySchema, probability: probabilitySchema, valueAtRisk: moneySchema }).nullable(),
})
export const commodityExplorerSnapshotSchema = z.object({
  generatedAt: isoDateTimeSchema,
  state: dashboardSnapshotSchema.shape.state,
  query: commodityExplorerQuerySchema,
  pageInfo: z.object({ page: z.number().int().positive(), pageSize: z.number().int().positive(), totalItems: z.number().int().nonnegative(), totalPages: z.number().int().nonnegative() }),
  items: z.array(commodityExplorerItemSchema),
})
export const decisionQueueSnapshotSchema = z.object({ generatedAt: isoDateTimeSchema, decisions: z.array(decisionSchema) })

export type DashboardKpi = z.infer<typeof dashboardKpiSchema>
export type DashboardSnapshot = z.infer<typeof dashboardSnapshotSchema>
export type CatalogSnapshot = z.infer<typeof catalogSnapshotSchema>
export type PlatformSnapshot = z.infer<typeof platformSnapshotSchema>
export type MarketPulseSignal = z.infer<typeof marketPulseSignalSchema>
export type MarketPulseSnapshot = z.infer<typeof marketPulseSnapshotSchema>
export type FlowCorridor = z.infer<typeof flowCorridorSchema>
export type CommodityIntelligenceSnapshot = z.infer<typeof commodityIntelligenceSnapshotSchema>
export type CommodityExplorerSort = z.infer<typeof commodityExplorerSortSchema>
export type CommodityExplorerQuery = z.infer<typeof commodityExplorerQuerySchema>
export type CommodityExplorerQueryInput = z.input<typeof commodityExplorerQuerySchema>
export type CommodityExplorerItem = z.infer<typeof commodityExplorerItemSchema>
export type CommodityExplorerSnapshot = z.infer<typeof commodityExplorerSnapshotSchema>
export type DecisionQueueSnapshot = z.infer<typeof decisionQueueSnapshotSchema>
