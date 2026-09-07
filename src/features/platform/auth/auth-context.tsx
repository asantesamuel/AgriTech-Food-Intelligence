import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Organization, PlatformSnapshot, Role, User } from '@/domain'
import { platformService } from '@/services'
import { clearStoredSession, readStoredSession, writeStoredSession, type AuthSession } from './auth-storage'

interface AuthContextValue {
  status: 'loading' | 'signed-out' | 'signed-in' | 'error'
  platform: PlatformSnapshot | null
  session: AuthSession | null
  user: User | null
  organization: Organization | null
  role: Role | null
  signIn: (userId: string) => void
  signOut: () => void
  switchOrganization: (organizationId: string) => void
  switchRole: (roleId: string) => void
  reload: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [platform, setPlatform] = useState<PlatformSnapshot | null>(null)
  const [session, setSession] = useState<AuthSession | null>(null)
  const [status, setStatus] = useState<AuthContextValue['status']>('loading')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true
    setStatus('loading')
    platformService.getPlatform().then((data) => {
      if (!active) return
      setPlatform(data)
      const stored = readStoredSession(window.localStorage)
      const isValid = stored && data.users.some((user) => user.id === stored.userId) && data.organizations.some((organization) => organization.id === stored.organizationId) && data.roles.some((role) => role.id === stored.roleId)
      setSession(isValid ? stored : null)
      setStatus(isValid ? 'signed-in' : 'signed-out')
    }).catch(() => { if (active) setStatus('error') })
    return () => { active = false }
  }, [reloadKey])

  function save(next: AuthSession | null) {
    setSession(next)
    setStatus(next ? 'signed-in' : 'signed-out')
    if (next) writeStoredSession(window.localStorage, next)
    else clearStoredSession(window.localStorage)
  }

  const value = useMemo<AuthContextValue>(() => {
    const user = platform?.users.find((candidate) => candidate.id === session?.userId) ?? null
    const organization = platform?.organizations.find((candidate) => candidate.id === session?.organizationId) ?? null
    const role = platform?.roles.find((candidate) => candidate.id === session?.roleId) ?? null
    return {
      status, platform, session, user, organization, role,
      signIn(userId) {
        if (!platform) return
        const selected = platform.users.find((candidate) => candidate.id === userId)
        const roleId = selected?.roleIds[0]
        if (selected && roleId) save({ userId: selected.id, organizationId: selected.organizationId, roleId })
      },
      signOut: () => save(null),
      switchOrganization(organizationId) {
        if (!platform || !session) return
        const user = platform.users.find((candidate) => candidate.organizationId === organizationId)
        if (user) save({ ...session, organizationId, userId: user.id, roleId: user.roleIds[0] ?? session.roleId })
      },
      switchRole(roleId) { if (session) save({ ...session, roleId }) },
      reload: () => setReloadKey((key) => key + 1),
    }
  }, [platform, session, status])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used within AuthProvider')
  return value
}
