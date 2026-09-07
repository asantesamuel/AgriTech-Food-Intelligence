import { BarChart3, Blocks, Compass, LayoutDashboard, Settings2, type LucideIcon } from 'lucide-react'

export interface NavigationItem { label: string; href: '/' | '/intelligence' | '/decisions' | '/planning' | '/workspace'; icon: LucideIcon; description: string }

export const primaryNavigation: NavigationItem[] = [
  { label: 'Overview', href: '/', icon: LayoutDashboard, description: 'Executive signals and activity' },
  { label: 'Intelligence', href: '/intelligence', icon: BarChart3, description: 'Markets, forecasts, supply and risk' },
  { label: 'Decisions', href: '/decisions', icon: Compass, description: 'Recommendations and optimisation' },
  { label: 'Planning', href: '/planning', icon: Blocks, description: 'Scenarios, infrastructure and reports' },
  { label: 'Workspace', href: '/workspace', icon: Settings2, description: 'Alerts, data, people and settings' },
]

export function getBreadcrumbs(pathname: string) {
  if (pathname === '/') return ['Overview']
  const segments = pathname.split('/').filter(Boolean)
  return segments.map((segment) => segment.replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()))
}
