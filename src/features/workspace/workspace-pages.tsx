import { Link } from '@tanstack/react-router'
import { BellRing, Building2, Cable, CheckCircle2, Database, Settings2, ShieldCheck, UsersRound } from 'lucide-react'
import type { ReactNode } from 'react'

import { useAuth } from '@/features/platform/auth/auth-context'
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, PageHeader, SemanticBadge } from '@/shared/ui'

const workspaceLinks = [
  { href: '/workspace/alerts', label: 'Alerts', description: 'Review market and model signals that require attention.', icon: BellRing },
  { href: '/workspace/data-sources', label: 'Data sources', description: 'Inspect freshness, coverage, and source health.', icon: Database },
  { href: '/workspace/integrations', label: 'Integrations', description: 'Manage replaceable data and workflow connections.', icon: Cable },
  { href: '/workspace/organization', label: 'Organization', description: 'Maintain workspace identity and coverage.', icon: Building2 },
  { href: '/workspace/people', label: 'People & roles', description: 'Manage members, roles, and access boundaries.', icon: UsersRound },
  { href: '/workspace/settings', label: 'Settings', description: 'Update intelligence scope and preferences.', icon: Settings2 },
] as const

export function WorkspaceOverview() {
  const { organization, role } = useAuth()
  return <WorkspaceFrame eyebrow="Workspace" title="Operate the intelligence environment." description={`Manage data, alerts, people, and configuration for ${organization?.name ?? 'your organization'}.`}>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{workspaceLinks.map((item) => { const Icon = item.icon; return <Card key={item.href} className="transition-colors hover:border-primary/40"><CardHeader><span className="mb-2 grid size-9 place-items-center rounded-md bg-accent text-primary"><Icon className="size-4" /></span><CardTitle>{item.label}</CardTitle><CardDescription>{item.description}</CardDescription></CardHeader><CardContent><Button asChild variant="outline" size="sm"><Link to={item.href}>Open {item.label}</Link></Button></CardContent></Card> })}</div>
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="size-4 text-primary" />Current access context</CardTitle><CardDescription>Access follows the active organization and persona.</CardDescription></CardHeader><CardContent className="flex flex-wrap gap-2"><Badge tone="success">{organization?.name ?? 'Organization'}</Badge><Badge>{role?.name ?? 'Role unavailable'}</Badge><Badge tone="info">Tenant-scoped</Badge></CardContent></Card>
  </WorkspaceFrame>
}

export function AlertsPage() {
  return <WorkspaceFrame eyebrow="Workspace / Alerts" title="Signals requiring attention." description="Prioritize operational exceptions without mixing them into the main decision queue.">
    <div className="grid gap-3">
      <AlertRow title="Tomato purchase window narrows in 48 hours" detail="Greater Accra · Purchase timing · linked to Decision D-1042" level="high" />
      <AlertRow title="Makola price feed is approaching freshness threshold" detail="Last verified 4 hours ago · source remains usable" level="medium" />
      <AlertRow title="Tomato forecast model refresh completed" detail="Model confidence 82% · 30-day horizon" level="low" />
    </div>
  </WorkspaceFrame>
}

export function DataSourcesPage() {
  return <WorkspaceFrame eyebrow="Workspace / Data sources" title="Know what the intelligence rests on." description="Freshness and coverage stay distinct from model confidence.">
    <div className="grid gap-4 md:grid-cols-3">
      <HealthCard title="Market prices" status="Fresh" detail="12 markets · refreshed 4 hours ago" />
      <HealthCard title="Market arrivals" status="Partial" detail="8 of 12 markets reporting" warning />
      <HealthCard title="Weather observations" status="Fresh" detail="Daily regional aggregation" />
    </div>
  </WorkspaceFrame>
}

export function IntegrationsPage() {
  return <WorkspaceFrame eyebrow="Workspace / Integrations" title="Connect data and decision workflows." description="Adapters keep the product independent from any single external system.">
    <div className="grid gap-4 md:grid-cols-2"><IntegrationCard title="Market data import" detail="CSV and API ingestion boundary" connected /><IntegrationCard title="Procurement system" detail="Decision export boundary ready for configuration" /><IntegrationCard title="Notification delivery" detail="Email and team workflow adapter" /><IntegrationCard title="Model service" detail="Forecast contract connected to demo adapter" connected /></div>
  </WorkspaceFrame>
}

export function SettingsPage() {
  return <WorkspaceFrame eyebrow="Workspace / Settings" title="Configure the procurement lens." description="Onboarding preferences remain editable as operating priorities change.">
    <Card><CardHeader><CardTitle>Intelligence scope</CardTitle><CardDescription>Default commodity, regions, markets, and objectives used across the workspace.</CardDescription></CardHeader><CardContent className="flex flex-wrap items-center justify-between gap-4"><div className="flex flex-wrap gap-2"><Badge tone="success">Tomato</Badge><Badge>Greater Accra</Badge><Badge>Procurement</Badge></div><Button asChild><Link to="/onboarding">Edit preferences</Link></Button></CardContent></Card>
  </WorkspaceFrame>
}

function WorkspaceFrame({ eyebrow, title, description, children }: Readonly<{ eyebrow: string; title: string; description: string; children: ReactNode }>) {
  return <div className="grid gap-6 px-4 py-6 sm:p-6 lg:p-8"><PageHeader eyebrow={eyebrow} title={title} description={description} />{children}</div>
}

function AlertRow({ title, detail, level }: Readonly<{ title: string; detail: string; level: 'high' | 'medium' | 'low' }>) {
  return <Card><CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center"><SemanticBadge signal="risk" level={level} /><div className="min-w-0 flex-1"><h2 className="font-semibold">{title}</h2><p className="mt-1 text-sm text-muted-foreground">{detail}</p></div><Button asChild variant="outline" size="sm">{level === 'high' ? <Link to="/decisions/$decisionId" params={{ decisionId: 'decision-tomato-purchase' }}>Review</Link> : <Link to="/intelligence/commodities/$commodityId" params={{ commodityId: 'commodity-tomato' }}>Review</Link>}</Button></CardContent></Card>
}

function HealthCard({ title, status, detail, warning = false }: Readonly<{ title: string; status: string; detail: string; warning?: boolean }>) {
  return <Card><CardHeader><CardTitle className="text-base">{title}</CardTitle><CardDescription>{detail}</CardDescription></CardHeader><CardContent><Badge tone={warning ? 'warning' : 'success'}>{status}</Badge></CardContent></Card>
}

function IntegrationCard({ title, detail, connected = false }: Readonly<{ title: string; detail: string; connected?: boolean }>) {
  return <Card><CardHeader><CardTitle className="text-base">{title}</CardTitle><CardDescription>{detail}</CardDescription></CardHeader><CardContent>{connected ? <span className="flex items-center gap-2 text-sm font-medium text-success"><CheckCircle2 className="size-4" />Connected</span> : <Button variant="outline" size="sm">Configure</Button>}</CardContent></Card>
}
