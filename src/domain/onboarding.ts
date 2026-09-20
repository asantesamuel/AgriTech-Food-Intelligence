import { z } from 'zod'
import { entityIdSchema, isoDateTimeSchema } from './primitives'

export const organizationTypeSchema = z.enum(['processor', 'wholesaler', 'retailer', 'logistics', 'government', 'investor', 'development', 'research', 'other'])
export const workspaceGoalSchema = z.enum(['procurement', 'waste-reduction', 'market-monitoring', 'logistics', 'strategic-planning'])
export const onboardingPreferencesSchema = z.object({ organizationId: entityIdSchema, organizationType: organizationTypeSchema, commodityIds: z.array(entityIdSchema).min(1), regionIds: z.array(entityIdSchema).min(1), marketIds: z.array(entityIdSchema), goals: z.array(workspaceGoalSchema).min(1), completedAt: isoDateTimeSchema })

export type OrganizationType = z.infer<typeof organizationTypeSchema>
export type WorkspaceGoal = z.infer<typeof workspaceGoalSchema>
export type OnboardingPreferences = z.infer<typeof onboardingPreferencesSchema>
