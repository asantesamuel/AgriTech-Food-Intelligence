import { ChevronDown, LogOut, UserRound } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui'
import { useAuth } from '../auth/auth-context'

export function AccountSwitcher({ compact = false }: Readonly<{ compact?: boolean }>) {
  const { organization, role, signOut, user } = useAuth()
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function close(event: MouseEvent) { if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false) }
    function escape(event: KeyboardEvent) { if (event.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', escape)
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', escape) }
  }, [open])

  if (!organization || !user || !role) return null

  return <div className="relative" ref={wrapperRef}>
    <button type="button" aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen((current) => !current)} className={cn('flex min-h-11 w-full items-center gap-3 rounded-md px-2 text-left transition-colors hover:bg-muted', compact && 'justify-center xl:justify-start')}>
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent text-primary"><UserRound className="size-4" /></span>
      <span className={cn('min-w-0', compact && 'hidden xl:block')}><strong className="block truncate text-sm">{user.name}</strong><span className="block truncate text-xs text-muted-foreground">{organization.name}</span></span>
      <ChevronDown className={cn('ml-auto size-3.5 text-muted-foreground', compact && 'hidden xl:block')} />
    </button>
    {open ? <div role="menu" className={cn('absolute z-50 w-72 rounded-lg border bg-card p-2 shadow-xl', compact ? 'bottom-0 left-full ml-2' : 'right-0 top-full mt-2')}><div className="border-b px-3 py-3"><strong className="block text-sm">{user.name}</strong><span className="mt-1 block text-sm text-muted-foreground">{user.title}</span><span className="mt-2 block text-xs text-muted-foreground">{role.name} · {organization.name}</span></div><Button role="menuitem" variant="ghost" className="mt-2 w-full justify-start" onClick={signOut}><LogOut />Sign out</Button></div> : null}
  </div>
}
