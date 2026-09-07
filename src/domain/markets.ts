import { z } from 'zod'
import { confidenceSchema, entityIdSchema, freshnessSchema, isoDateSchema, isoDateTimeSchema, locationSchema, priceUnitSchema, quantityUnitSchema } from './primitives'

export const regionSchema = z.object({ id: entityIdSchema, name: z.string().min(2), countryCode: z.string().length(2).default('GH'), centroid: locationSchema.shape.point.optional() })
export const marketSchema = z.object({ id: entityIdSchema, name: z.string().min(2), type: z.enum(['wholesale', 'retail', 'farmgate', 'processor']), location: locationSchema, active: z.boolean() })
export const commoditySchema = z.object({ id: entityIdSchema, name: z.string().min(2), category: z.enum(['cereal', 'vegetable', 'fruit', 'tuber', 'legume', 'livestock', 'other']), defaultUnit: quantityUnitSchema, aliases: z.array(z.string()).default([]) })
export const priceObservationSchema = z.object({ id: entityIdSchema, commodityId: entityIdSchema, marketId: entityIdSchema, price: z.number().nonnegative(), priceUnit: priceUnitSchema, observedAt: isoDateTimeSchema, changePercent: z.number().min(-100).max(100).optional(), sourceId: entityIdSchema, freshness: freshnessSchema })
export const supplyDemandBalanceSchema = z.object({ id: entityIdSchema, commodityId: entityIdSchema, regionId: entityIdSchema, periodStart: isoDateSchema, periodEnd: isoDateSchema, supply: z.number().nonnegative(), demand: z.number().nonnegative(), unit: quantityUnitSchema, balancePercent: z.number().min(-100).max(100), confidence: confidenceSchema })

export type Region = z.infer<typeof regionSchema>
export type Market = z.infer<typeof marketSchema>
export type Commodity = z.infer<typeof commoditySchema>
export type PriceObservation = z.infer<typeof priceObservationSchema>
export type SupplyDemandBalance = z.infer<typeof supplyDemandBalanceSchema>
