import { z } from 'zod'
import { entityIdSchema, isoDateSchema, isoDateTimeSchema, locationSchema, moneySchema, quantityUnitSchema } from './primitives'

export const procurementLineSchema = z.object({ commodityId: entityIdSchema, quantity: z.number().positive(), unit: quantityUnitSchema, targetUnitPrice: moneySchema, deliveryDate: isoDateSchema })
export const procurementPlanSchema = z.object({ id: entityIdSchema, organizationId: entityIdSchema, name: z.string().min(3), status: z.enum(['draft', 'active', 'completed', 'cancelled']), lines: z.array(procurementLineSchema).min(1), createdAt: isoDateTimeSchema })
export const logisticsRouteSchema = z.object({ id: entityIdSchema, organizationId: entityIdSchema, origin: locationSchema, destination: locationSchema, distanceKm: z.number().positive(), durationMinutes: z.number().int().positive(), coldChainRequired: z.boolean(), status: z.enum(['planned', 'active', 'completed', 'disrupted']) })
export const facilitySchema = z.object({ id: entityIdSchema, organizationId: entityIdSchema.optional(), name: z.string().min(2), type: z.enum(['warehouse', 'cold-storage', 'processing-plant']), location: locationSchema, capacity: z.number().nonnegative(), capacityUnit: quantityUnitSchema, utilizationPercent: z.number().min(0).max(100), active: z.boolean() })
export const optimisationScenarioSchema = z.object({ id: entityIdSchema, organizationId: entityIdSchema, name: z.string().min(3), objective: z.enum(['minimize-cost', 'minimize-waste', 'maximize-availability', 'balance']), status: z.enum(['draft', 'running', 'complete', 'failed']), inputSnapshotId: entityIdSchema, resultSummary: z.string().optional(), createdAt: isoDateTimeSchema })
export const reportSchema = z.object({ id: entityIdSchema, organizationId: entityIdSchema, title: z.string().min(3), type: z.enum(['market-brief', 'risk', 'procurement', 'scenario', 'executive']), status: z.enum(['generating', 'ready', 'failed']), periodStart: isoDateSchema, periodEnd: isoDateSchema, generatedAt: isoDateTimeSchema.optional(), downloadUrl: z.url().optional() })

export type ProcurementPlan = z.infer<typeof procurementPlanSchema>
export type LogisticsRoute = z.infer<typeof logisticsRouteSchema>
export type Facility = z.infer<typeof facilitySchema>
export type OptimisationScenario = z.infer<typeof optimisationScenarioSchema>
export type Report = z.infer<typeof reportSchema>
