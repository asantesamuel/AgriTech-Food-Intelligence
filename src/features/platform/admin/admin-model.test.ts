import { describe, expect, it } from 'vitest'
import { createPlatform } from '@/mocks/factories'
import { canManageWorkspace, filterMembers, summarizePermissions } from './admin-model'

describe('organization administration model', () => {
  const platform = createPlatform()

  it('scopes and filters members by organization, status and search', () => {
    const members = filterMembers(platform.users, platform.organization.id, 'kwame', 'active')
    expect(members).toHaveLength(1)
    expect(members[0]?.name).toBe('Kwame Owusu')
  })

  it('exposes reusable permission summaries', () => {
    const admin = platform.roles.find((role) => role.id === 'role-admin')!
    expect(summarizePermissions(admin)).toContain('manage workspace')
    expect(canManageWorkspace(admin)).toBe(true)
    expect(canManageWorkspace(platform.roles.find((role) => role.id === 'role-analyst')!)).toBe(false)
  })
})
