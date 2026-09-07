import { LogOut, UserRound } from 'lucide-react'
import { useAuth } from '../auth/auth-context'
import { Button } from '@/shared/ui'

export function AccountSwitcher() {
  const { organization, platform, role, signOut, switchOrganization, switchRole, user } = useAuth()
  if (!platform || !organization || !user || !role) return null
  return (
    <div className="flex items-center gap-2">
      <label className="sr-only" htmlFor="organization-switcher">Organization</label>
      <select id="organization-switcher" value={organization.id} onChange={(event) => switchOrganization(event.target.value)} className="hidden h-9 max-w-48 rounded-md border bg-background px-2 text-xs text-foreground lg:block">
        {platform.organizations.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
      </select>
      <label className="sr-only" htmlFor="role-switcher">Persona</label>
      <select id="role-switcher" value={role.id} onChange={(event) => switchRole(event.target.value)} className="hidden h-9 max-w-44 rounded-md border bg-background px-2 text-xs text-foreground xl:block">
        {platform.roles.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
      </select>
      <span className="hidden size-9 place-items-center rounded-full bg-primary/10 text-primary sm:grid" title={`${user.name} — ${role.name}`}><UserRound className="size-4" aria-hidden /><span className="sr-only">Signed in as {user.name}</span></span>
      <Button variant="ghost" size="icon" aria-label="Sign out" onClick={signOut}><LogOut /></Button>
    </div>
  )
}
