import { Link, Outlet, useLocation } from '@tanstack/react-router'
import { Bell, Bot, ChevronRight, Menu, X } from 'lucide-react'
import { useState } from 'react'

import { cn } from '@/shared/lib/cn'
import { Badge, Button } from '@/shared/ui'
import { AccountSwitcher } from './account-switcher'
import { getBreadcrumbs, primaryNavigation, type NavigationItem } from '../navigation'

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = useLocation({ select: (location) => location.pathname })
  const breadcrumbs = getBreadcrumbs(pathname)

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden border-r bg-card/95 backdrop-blur md:flex md:w-20 md:flex-col xl:w-64">
        <Brand />
        <nav className="grid gap-1 px-3 py-5" aria-label="Primary navigation">
          {primaryNavigation.map((item) => <NavigationLink key={item.href} item={item} active={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))} />)}
        </nav>
        <div className="mt-auto border-t p-3"><div className="hidden rounded-lg bg-muted/60 p-3 xl:block"><Badge tone="info">Prototype</Badge><p className="mt-2 text-xs leading-5 text-muted-foreground">Mock intelligence workspace</p></div></div>
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button className="absolute inset-0 bg-background/80 backdrop-blur-sm" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />
          <aside className="relative flex h-full w-[min(84vw,20rem)] flex-col border-r bg-card shadow-2xl">
            <div className="flex items-center justify-between"><Brand /><Button variant="ghost" size="icon" aria-label="Close menu" onClick={() => setMobileOpen(false)}><X /></Button></div>
            <nav className="grid gap-1 px-3 py-5" aria-label="Mobile navigation">
              {primaryNavigation.map((item) => <NavigationLink key={item.href} item={item} active={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))} onNavigate={() => setMobileOpen(false)} mobile />)}
            </nav>
          </aside>
        </div>
      ) : null}

      <div className="min-w-0 md:pl-20 xl:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur sm:px-6">
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu" onClick={() => setMobileOpen(true)}><Menu /></Button>
          <nav className="flex min-w-0 items-center gap-1.5 text-sm" aria-label="Breadcrumb">
            <Link to="/" className="text-muted-foreground hover:text-foreground">Food Intelligence</Link>
            {breadcrumbs.map((crumb) => <span key={crumb} className="flex min-w-0 items-center gap-1.5"><ChevronRight className="size-3.5 shrink-0 text-muted-foreground" aria-hidden /><span className="truncate font-medium">{crumb}</span></span>)}
          </nav>
          <div className="ml-auto flex items-center gap-1.5">
            <Button variant="ghost" size="icon" aria-label="Alerts"><Bell /><span className="sr-only">Alerts</span></Button>
            <Button variant="outline" size="sm" className="hidden sm:inline-flex"><Bot />AI copilot <Badge className="ml-1 px-1.5 py-0 text-[0.55rem]">Soon</Badge></Button>
            <AccountSwitcher />
          </div>
        </header>
        <main className="min-w-0 min-h-[calc(100vh-4rem)] pb-20 md:pb-0"><Outlet /></main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t bg-card/95 px-1 py-1.5 backdrop-blur md:hidden" aria-label="Quick navigation">
        {primaryNavigation.map((item) => {
          const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          const Icon = item.icon
          return <Link key={item.href} to={item.href} className={cn('grid min-w-0 justify-items-center gap-1 rounded-md py-1.5 text-[0.62rem] text-muted-foreground', active && 'bg-accent text-primary')} aria-current={active ? 'page' : undefined}><Icon className="size-4" aria-hidden /><span className="truncate">{item.label}</span></Link>
        })}
      </nav>
    </div>
  )
}

function Brand() {
  return <Link to="/" className="flex h-16 items-center gap-3 px-4 text-foreground"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary font-mono text-sm font-bold text-primary-foreground">FI</span><span className="hidden xl:block"><strong className="block text-sm">Food Intelligence</strong><span className="text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">Decision OS</span></span></Link>
}

function NavigationLink({ item, active, onNavigate, mobile }: Readonly<{ item: NavigationItem; active: boolean; onNavigate?: () => void; mobile?: boolean }>) {
  const Icon = item.icon
  return <Link to={item.href} onClick={onNavigate} aria-current={active ? 'page' : undefined} className={cn('group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground', active && 'bg-accent text-primary', !mobile && 'md:justify-center xl:justify-start')}><Icon className="size-4 shrink-0" aria-hidden /><span className={cn(!mobile && 'md:hidden xl:block')}>{item.label}</span></Link>
}
