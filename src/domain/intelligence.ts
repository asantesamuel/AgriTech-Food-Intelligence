import { z } from 'zod'
import { confidenceSchema, entityIdSchema, freshnessSchema, isoDateSchema, isoDateTimeSchema, moneySchema, percentageSchema, probabilitySchema, quantityUnitSchema, severitySchema } from './primitives'

export const forecastPointSchema = z.object({ date: isoDateSchema, value: z.number().finite(), lowerBound: z.number().finite(), upperBound: z.number().finite() }).refine((point) => point.lowerBound <= point.value && point.value <= point.upperBound, 'Forecast value must be inside its interval')
export const forecastSchema = z.object({ id: entityIdSchema, commodityId: entityIdSchema, marketId: entityIdSchema, metric: z.enum(['price', 'supply', 'demand']), horizonDays: z.number().int().positive(), unitLabel: z.string().min(1), points: z.array(forecastPointSchema).min(1), confidence: confidenceSchema, freshness: freshnessSchema, modelId: entityIdSchema })
export const wasteRiskSchema = z.object({ id: entityIdSchema, commodityId: entityIdSchema, regionId: entityIdSchema, probability: probabilitySchema, severity: severitySchema, volumeAtRisk: z.number().nonnegative(), unit: quantityUnitSchema, valueAtRisk: moneySchema, drivers: z.array(z.string().min(2)).min(1), confidence: confidenceSchema, forecastDate: isoDateSchema })
export const recommendationSchema = z.object({ id: entityIdSchema, organizationId: entityIdSchema, title: z.string().min(3), action: z.string().min(3), rationale: z.string().min(3), category: z.enum(['procurement', 'redistribution', 'logistics', 'storage', 'processing', 'monitor']), priority: severitySchema, expectedImpactPercent: percentageSchema.optional(), confidence: confidenceSchema, status: z.enum(['new', 'reviewed', 'accepted', 'dismissed']), createdAt: isoDateTimeSchema })
export const decisionSchema = z.object({ id: entityIdSchema, organizationId: entityIdSchema, recommendationId: entityIdSchema.optional(), title: z.string().min(3), status: z.enum(['draft', 'approved', 'in-progress', 'completed', 'cancelled']), ownerId: entityIdSchema, notes: z.string().optional(), createdAt: isoDateTimeSchema, updatedAt: isoDateTimeSchema })

export type ForecastPoint = z.infer<typeof forecastPointSchema>
export type Forecast = z.infer<typeof forecastSchema>
export type WasteRisk = z.infer<typeof wasteRiskSchema>
export type Recommendation = z.infer<typeof recommendationSchema>
export type Decision = z.infer<typeof decisionSchema>
