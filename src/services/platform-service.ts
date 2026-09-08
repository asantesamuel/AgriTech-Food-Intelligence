import { invitationSchema, organizationSchema, platformSnapshotSchema, userSchema, type Invitation, type InviteMemberInput, type Organization, type PlatformSnapshot, type UpdateMemberInput, type UpdateOrganizationInput, type User } from '@/domain'
import type { MockRequestOptions } from './mock-options'
import { withMockOptions } from './mock-options'
import { requestJson } from './request'

const json = (method: string, body?: unknown): RequestInit => ({ method, headers: body ? { 'Content-Type': 'application/json' } : undefined, body: body ? JSON.stringify(body) : undefined })

export interface PlatformService {
  getPlatform(options?: MockRequestOptions): Promise<PlatformSnapshot>
  inviteMember(input: InviteMemberInput, options?: MockRequestOptions): Promise<Invitation>
  updateMember(userId: string, input: UpdateMemberInput, options?: MockRequestOptions): Promise<User>
  removeMember(userId: string, options?: MockRequestOptions): Promise<{ id: string }>
  updateOrganization(organizationId: string, input: UpdateOrganizationInput, options?: MockRequestOptions): Promise<Organization>
}

export const platformService: PlatformService = {
  getPlatform: (options) => requestJson(withMockOptions('/platform', options), platformSnapshotSchema),
  inviteMember: (input, options) => requestJson(withMockOptions('/platform/invitations', options), invitationSchema, json('POST', input)),
  updateMember: (userId, input, options) => requestJson(withMockOptions(`/platform/users/${userId}`, options), userSchema, json('PATCH', input)),
  removeMember: (userId, options) => requestJson(withMockOptions(`/platform/users/${userId}`, options), userSchema.pick({ id: true }), json('DELETE')),
  updateOrganization: (organizationId, input, options) => requestJson(withMockOptions(`/platform/organizations/${organizationId}`, options), organizationSchema, json('PATCH', input)),
}
