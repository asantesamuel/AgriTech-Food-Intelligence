import { z } from 'zod'

export const entityIdSchema = z.string().trim().min(3).max(100).regex(/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/)
export const isoDateSchema = z.iso.date()
export const isoDateTimeSchema = z.iso.datetime({ offset: true })
export const percentageSchema = z.number().min(0).max(100)
export const probabilitySchema = z.number().min(0).max(1)
export const currencySchema = z.enum(['GHS', 'USD'])
export const quantityUnitSchema = z.enum(['kg', 'tonne', 'bag', 'crate', 'litre', 'unit'])
export const priceUnitSchema = z.object({ currency: currencySchema, per: quantityUnitSchema })
export const moneySchema = z.object({ amount: z.number().finite(), currency: currencySchema })
export const geoPointSchema = z.object({ latitude: z.number().min(-90).max(90), longitude: z.number().min(-180).max(180) })
export const locationSchema = z.object({ regionId: entityIdSchema, district: z.string().trim().min(1).optional(), point: geoPointSchema.optional() })
export const confidenceSchema = z.object({ score: probabilitySchema, band: z.enum(['low', 'medium', 'high']), methodology: z.string().trim().min(1).optional() })
export const freshnessSchema = z.object({ observedAt: isoDateTimeSchema, receivedAt: isoDateTimeSchema, status: z.enum(['fresh', 'stale', 'unknown']) })
export const severitySchema = z.enum(['low', 'medium', 'high', 'critical'])

export type EntityId = z.infer<typeof entityIdSchema>
export type IsoDate = z.infer<typeof isoDateSchema>
export type IsoDateTime = z.infer<typeof isoDateTimeSchema>
export type Money = z.infer<typeof moneySchema>
export type QuantityUnit = z.infer<typeof quantityUnitSchema>
export type Location = z.infer<typeof locationSchema>
export type Confidence = z.infer<typeof confidenceSchema>
export type Freshness = z.infer<typeof freshnessSchema>
export type Severity = z.infer<typeof severitySchema>
