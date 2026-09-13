import { Link, Outlet, useLocation } from '@tanstack/react-router'
import { Bell, ChevronRight, Database, Menu, SlidersHorizontal, X } from 'lucide-react'
import { useCallback, useState, type ReactNode } from 'react'

import { cn } from '@/shared/lib/cn'
import { Badge, Button } from '@/shared/ui'
import { DemoControls } from '../demo/demo-controls'
import { useDemo } from '../demo/demo-context'
import { getBreadcrumbs, primaryNavigation, type NavigationItem } from '../navigation'
import { AccountSwitcher } from './account-switcher'

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [demoOpen, setDemoOpen] = useState(false)
  const closeDemo = useCallback(() => setDemoOpen(false), [])
  const pathname = useLocation({ select: (location) => location.pathname })
  const breadcrumbs = getBreadcrumbs(pathname)
  const { scenario } = useDemo()

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[4.5rem] flex-col border-r bg-card md:flex xl:w-[15.5rem]">
        <Brand />
        <nav className="grid gap-1 px-2 py-5 xl:px-3" aria-label="Primary navigation">
          {primaryNavigation.map((item) => <NavigationLink key={item.href} item={item} active={isActive(pathname, item.href)} />)}
        </nav>
        <div className="mt-auto grid gap-1 border-t p-2 xl:p-3">
          <Button variant="ghost" className="justify-center xl:justify-start" onClick={() => setDemoOpen(true)}><SlidersHorizontal /><span className="hidden xl:inline">Demo controls</span>{scenario !== 'success' ? <span className="size-2 rounded-full bg-warning xl:ml-auto" aria-label="Demo scenario active" /> : null}</Button>
          <AccountSwitcher compact />
        </div>
      </aside>

      {mobileOpen ? <MobileMore onClose={() => setMobileOpen(false)} onDemo={() => { setMobileOpen(false); setDemoOpen(true) }} /> : null}

      <div className="min-w-0 md:pl-[4.5rem] xl:pl-[15.5rem]">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-card/95 px-4 backdrop-blur sm:px-6">
          <div className="md:hidden"><Brand compact /></div>
          <nav className="hidden min-w-0 items-center gap-1.5 text-sm sm:flex" aria-label="Breadcrumb">
            <Link to="/" className="text-muted-foreground transition-colors hover:text-foreground">Food Intelligence</Link>
            {breadcrumbs.map((crumb) => <span key={crumb} className="flex min-w-0 items-center gap-1.5"><ChevronRight className="size-3.5 shrink-0 text-muted-foreground" aria-hidden /><span className="truncate font-medium">{crumb}</span></span>)}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Link to="/intelligence" className="hidden items-center gap-2 rounded-md border bg-background px-3 py-2 text-xs text-muted-foreground lg:flex"><Database className="size-3.5 text-success" /><span>Demo dataset · 7 Sep 2026</span></Link>
            <Button asChild variant="ghost" size="icon"><Link to="/workspace/alerts" aria-label="Open alerts"><Bell /></Link></Button>
            <Button variant="outline" size="sm" className="hidden sm:inline-flex" onClick={() => setDemoOpen(true)}><SlidersHorizontal />Demo{scenario !== 'success' ? <Badge tone="warning" className="ml-1 px-1.5 py-0">Active</Badge> : null}</Button>
            <div className="hidden md:block"><AccountSwitcher /></div>
          </div>
        </header>
        <SectionNavigation pathname={pathname} />
        <main className="min-h-[calc(100vh-7rem)] min-w-0 pb-20 md:pb-0"><Outlet /></main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t bg-card px-1.5 py-1.5 shadow-[0_-8px_24px_rgba(20,32,27,0.06)] md:hidden" aria-label="Quick navigation">
        {primaryNavigation.slice(0, 3).map((item) => <MobileNavigationLink key={item.href} item={item} active={isActive(pathname, item.href)} />)}
        <button type="button" onClick={() => setMobileOpen(true)} className={cn('grid min-h-12 justify-items-center gap-1 rounded-md px-2 py-1.5 text-xs text-muted-foreground', mobileOpen && 'bg-accent text-primary')}><Menu className="size-4" /><span>More</span></button>
      </nav>

      <DemoControls open={demoOpen} onClose={closeDemo} />
    </div>
  )
}

function Brand({ compact = false }: Readonly<{ compact?: boolean }>) {
  return <Link to="/" className={cn('flex h-16 items-center gap-3 px-3 text-foreground xl:px-4', compact && 'h-auto p-0')}><span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary font-mono text-sm font-bold text-primary-foreground">FI</span><span className={cn('hidden xl:block', compact && 'hidden')}><strong className="block text-sm tracking-tight">Food Intelligence</strong><span className="text-xs text-muted-foreground">Decision workspace</span></span></Link>
}

function NavigationLink({ item, active }: Readonly<{ item: NavigationItem; active: boolean }>) {
  const Icon = item.icon
  return <Link to={item.href} aria-current={active ? 'page' : undefined} title={item.label} className={cn('group relative flex min-h-11 items-center justify-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground xl:justify-start', active && 'bg-accent text-primary before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:rounded-full before:bg-primary')}><Icon className="size-[1.1rem] shrink-0" aria-hidden /><span className="hidden xl:block">{item.label}</span></Link>
}

function MobileNavigationLink({ item, active }: Readonly<{ item: NavigationItem; active: boolean }>) {
  const Icon = item.icon
  return <Link to={item.href} className={cn('grid min-h-12 min-w-0 justify-items-center gap-1 rounded-md px-2 py-1.5 text-xs text-muted-foreground', active && 'bg-accent font-semibold text-primary')} aria-current={active ? 'page' : undefined}><Icon className="size-4" aria-hidden /><span>{item.label}</span></Link>
}

function MobileMore({ onClose, onDemo }: Readonly<{ onClose: () => void; onDemo: () => void }>) {
  return <div className="fixed inset-0 z-50 md:hidden"><button className="absolute inset-0 bg-foreground/25 backdrop-blur-[2px]" aria-label="Close more navigation" onClick={onClose} /><aside role="dialog" aria-modal="true" aria-label="More navigation" className="absolute inset-x-0 bottom-0 rounded-t-xl border-t bg-card p-4 shadow-2xl"><div className="mb-3 flex items-center justify-between"><strong>More</strong><Button variant="ghost" size="icon" aria-label="Close more navigation" onClick={onClose}><X /></Button></div><nav className="grid gap-1" aria-label="More destinations">{primaryNavigation.slice(3).map((item) => { const Icon = item.icon; return <Link key={item.href} to={item.href} onClick={onClose} className="flex min-h-12 items-center gap-3 rounded-md px-3 text-sm font-medium hover:bg-muted"><Icon className="size-4 text-primary" />{item.label}</Link> })}<button type="button" onClick={onDemo} className="flex min-h-12 items-center gap-3 rounded-md px-3 text-left text-sm font-medium hover:bg-muted"><SlidersHorizontal className="size-4 text-primary" />Demo controls</button></nav><div className="mt-3 border-t pt-3"><AccountSwitcher /></div></aside></div>
}

function SectionNavigation({ pathname }: Readonly<{ pathname: string }>) {
  const linkClass = (href: string) => cn('whitespace-nowrap border-b-2 border-transparent px-1 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground', (pathname === href || (href !== '/' && pathname.startsWith(`${href}/`))) && 'border-primary text-primary')
  let links: ReactNode = null

  if (pathname.startsWith('/intelligence')) links = <><Link to="/intelligence" className={linkClass('/intelligence')}>Market pulse</Link><Link to="/intelligence/commodities" search={{ q: '', sort: 'attention', order: 'desc', page: 1, pageSize: 10 }} className={linkClass('/intelligence/commodities')}>Commodities</Link></>
  if (pathname.startsWith('/decisions')) links = <><Link to="/decisions" className={linkClass('/decisions')}>Action queue</Link><Link to="/decisions/$decisionId" params={{ decisionId: 'decision-tomato-purchase' }} className={linkClass('/decisions/decision-tomato-purchase')}>Priority decision</Link></>
  if (pathname.startsWith('/planning')) links = <Link to="/planning" className={linkClass('/planning')}>Scenario lab</Link>
  if (pathname.startsWith('/workspace')) links = <><Link to="/workspace" className={linkClass('/workspace')}>Overview</Link><Link to="/workspace/alerts" className={linkClass('/workspace/alerts')}>Alerts</Link><Link to="/workspace/data-sources" className={linkClass('/workspace/data-sources')}>Data sources</Link><Link to="/workspace/integrations" className={linkClass('/workspace/integrations')}>Integrations</Link><Link to="/workspace/organization" className={linkClass('/workspace/organization')}>Organization</Link><Link to="/workspace/people" className={linkClass('/workspace/people')}>People & roles</Link><Link to="/workspace/settings" className={linkClass('/workspace/settings')}>Settings</Link></>
  if (!links) return null

  return <nav className="sticky top-16 z-20 flex h-12 items-center gap-5 overflow-x-auto border-b bg-card/95 px-4 backdrop-blur sm:px-6" aria-label="Section navigation">{links}</nav>
}

function isActive(pathname: string, href: NavigationItem['href']) { return pathname === href || (href !== '/' && pathname.startsWith(href)) }
