import { z } from 'zod'
import { entityIdSchema, isoDateTimeSchema, locationSchema } from './primitives'

export const dataSourceSchema = z.object({ id: entityIdSchema, name: z.string().min(2), kind: z.enum(['market-feed', 'survey', 'government', 'weather', 'gis', 'sensor', 'partner']), status: z.enum(['connected', 'degraded', 'offline']), lastSyncAt: isoDateTimeSchema.optional(), coverage: z.string().min(2) })
export const modelMetadataSchema = z.object({ id: entityIdSchema, name: z.string().min(2), version: z.string().min(1), task: z.enum(['forecasting', 'classification', 'optimisation']), status: z.enum(['experimental', 'validated', 'production', 'retired']), trainedAt: isoDateTimeSchema, metrics: z.record(z.string(), z.number().finite()) })

// These entities describe upstream evidence. They are intentionally not top-level product modules.
export const farmSourceSchema = z.object({ id: entityIdSchema, externalId: z.string().optional(), name: z.string().min(2), location: locationSchema, sourceId: entityIdSchema })
export const fieldSourceSchema = z.object({ id: entityIdSchema, farmId: entityIdSchema, areaHectares: z.number().positive(), cropCommodityId: entityIdSchema.optional(), boundaryRef: z.string().optional() })
export const sensorSourceSchema = z.object({ id: entityIdSchema, fieldId: entityIdSchema.optional(), type: z.enum(['temperature', 'humidity', 'soil-moisture', 'storage', 'gps']), unit: z.string().min(1), status: z.enum(['online', 'offline', 'maintenance']), lastReadingAt: isoDateTimeSchema.optional() })

export type DataSource = z.infer<typeof dataSourceSchema>
export type ModelMetadata = z.infer<typeof modelMetadataSchema>
export type FarmSource = z.infer<typeof farmSourceSchema>
export type FieldSource = z.infer<typeof fieldSourceSchema>
export type SensorSource = z.infer<typeof sensorSourceSchema>
