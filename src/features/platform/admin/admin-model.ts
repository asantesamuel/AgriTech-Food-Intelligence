import type { Role, User } from '@/domain'

export function filterMembers(users: User[], organizationId: string, query: string, status: 'all' | User['status']) {
  const normalized = query.trim().toLowerCase()
  return users.filter((user) => user.organizationId === organizationId)
    .filter((user) => status === 'all' || user.status === status)
    .filter((user) => !normalized || [user.name, user.email, user.title].some((value) => value.toLowerCase().includes(normalized)))
}

export function summarizePermissions(role: Role) {
  return role.permissions.flatMap((permission) => permission.actions.map((action) => `${action} ${permission.resource}`))
}

export function canManageWorkspace(role: Role | null) {
  return role?.permissions.some((permission) => permission.resource === 'workspace' && permission.actions.includes('manage')) ?? false
}
