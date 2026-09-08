import { z } from 'zod'
import { entityIdSchema, isoDateTimeSchema } from './primitives'

export const personaSchema = z.enum([
  'procurement-manager', 'food-processor', 'wholesaler-aggregator', 'retail-analyst',
  'logistics-operator', 'government-analyst', 'infrastructure-investor', 'organization-admin',
])
export const permissionSchema = z.object({ id: entityIdSchema, label: z.string().min(1), resource: z.string().min(1), actions: z.array(z.enum(['view', 'create', 'update', 'delete', 'manage'])).min(1) })
export const roleSchema = z.object({ id: entityIdSchema, name: z.string().min(2), description: z.string().min(1), persona: personaSchema, permissions: z.array(permissionSchema) })
export const organizationSchema = z.object({ id: entityIdSchema, name: z.string().min(2), slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), industry: z.string().min(2), regionIds: z.array(entityIdSchema), status: z.enum(['active', 'trial', 'inactive']), createdAt: isoDateTimeSchema })
export const userSchema = z.object({ id: entityIdSchema, organizationId: entityIdSchema, name: z.string().min(2), email: z.email(), title: z.string().min(2), avatarUrl: z.url().optional(), status: z.enum(['invited', 'active', 'inactive']), roleIds: z.array(entityIdSchema).min(1), lastActiveAt: isoDateTimeSchema.optional() })
export const invitationSchema = z.object({ id: entityIdSchema, organizationId: entityIdSchema, email: z.email(), roleId: entityIdSchema, status: z.enum(['pending', 'accepted', 'expired', 'revoked']), invitedAt: isoDateTimeSchema })
export const inviteMemberInputSchema = z.object({ organizationId: entityIdSchema, email: z.email(), roleId: entityIdSchema })
export const updateMemberInputSchema = z.object({ roleId: entityIdSchema.optional(), status: z.enum(['active', 'inactive']).optional() }).refine((value) => value.roleId || value.status, 'At least one member field is required')
export const updateOrganizationInputSchema = z.object({ name: z.string().trim().min(2), industry: z.string().trim().min(2), regionIds: z.array(entityIdSchema).min(1) })

export type Persona = z.infer<typeof personaSchema>
export type Permission = z.infer<typeof permissionSchema>
export type Role = z.infer<typeof roleSchema>
export type Organization = z.infer<typeof organizationSchema>
export type User = z.infer<typeof userSchema>
export type Invitation = z.infer<typeof invitationSchema>
export type InviteMemberInput = z.infer<typeof inviteMemberInputSchema>
export type UpdateMemberInput = z.infer<typeof updateMemberInputSchema>
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationInputSchema>
