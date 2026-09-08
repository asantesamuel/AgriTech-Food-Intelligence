import { useQuery } from '@tanstack/react-query'
import { ArrowDownRight, ArrowUpRight, Clock3, DatabaseZap, Lightbulb, RefreshCw, ShieldAlert, TrendingUp, Wheat } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { CatalogSnapshot, DashboardSnapshot } from '@/domain'
import type { DashboardFilters } from '@/services'
import { catalogService, dashboardService } from '@/services'
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, SemanticBadge, Skeleton, StatePanel, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '@/shared/ui'
import { useAuth } from '@/features/platform/auth/auth-context'
import { mockScenarios, type MockScenario } from '@/mocks/scenarios'
import { defaultDashboardFilters, namePriceMovers } from './dashboard-model'

const selectClass = 'h-10 min-w-36 rounded-md border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
const formatMoney = (amount: number) => new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS', maximumFractionDigits: 0 }).format(amount)

export function ExecutiveDashboard() {
  const { organization } = useAuth()
  const initial = useMemo(() => defaultDashboardFilters(typeof window === 'undefined' ? null : window.localStorage, organization?.id ?? ''), [organization?.id])
  const [filters, setFilters] = useState<Required<DashboardFilters>>(initial)
  const [scenario, setScenario] = useState<MockScenario>('success')
  useEffect(() => setFilters(initial), [initial])
  const catalogQuery = useQuery({ queryKey: ['catalog'], queryFn: () => catalogService.getCatalog() })
  const dashboardQuery = useQuery({
    queryKey: ['dashboard', filters, scenario],
    queryFn: () => dashboardService.getSnapshot({ commodityId: filters.commodityId || undefined, regionId: filters.regionId || undefined, horizon: filters.horizon }, { scenario }),
  })
  const snapshot = dashboardQuery.data
  const catalog = catalogQuery.data
  const movers = useMemo(() => snapshot && catalog ? namePriceMovers(snapshot, catalog) : [], [snapshot, catalog])

  function updateFilter<Key extends keyof Required<DashboardFilters>>(key: Key, value: Required<DashboardFilters>[Key]) {
    setFilters((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="grid min-w-0 gap-6 overflow-x-hidden px-4 py-6 sm:p-6">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <Badge tone="info">Executive overview</Badge>
          <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Signals that need a decision.</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">Market movement, supply pressure and preventable waste—prioritized for {organization?.name ?? 'your workspace'}.</p>
        </div>
        {snapshot ? <div className="flex items-center gap-2 text-xs text-muted-foreground"><Clock3 className="size-4" /><span>Snapshot {new Date(snapshot.generatedAt).toLocaleString('en-GH', { dateStyle: 'medium', timeStyle: 'short' })}</span><SemanticBadge signal="freshness" level={snapshot.freshness.status === 'stale' ? 'stale' : 'fresh'} /></div> : null}
      </header>

      <Card>
        <CardContent className="flex flex-col gap-4 pt-5 sm:pt-6 lg:flex-row lg:items-end">
          <Filter label="Commodity" value={filters.commodityId} onChange={(value) => updateFilter('commodityId', value)} options={catalog?.commodities.map((item) => ({ value: item.id, label: item.name })) ?? []} allLabel="All commodities" />
          <Filter label="Region" value={filters.regionId} onChange={(value) => updateFilter('regionId', value)} options={catalog?.regions.map((item) => ({ value: item.id, label: item.name })) ?? []} allLabel="All regions" />
          <Filter label="Time horizon" value={filters.horizon} onChange={(value) => updateFilter('horizon', value as Required<DashboardFilters>['horizon'])} options={[{ value: '7d', label: 'Next 7 days' }, { value: '30d', label: 'Next 30 days' }, { value: '90d', label: 'Next 90 days' }]} />
          <Filter label="Prototype state" value={scenario} onChange={(value) => setScenario(value as MockScenario)} options={mockScenarios.map((item) => ({ value: item, label: item.replace('-', ' ') }))} />
          <Button className="lg:ml-auto" variant="outline" onClick={() => void dashboardQuery.refetch()}><RefreshCw />Refresh</Button>
        </CardContent>
      </Card>

      {dashboardQuery.isPending || catalogQuery.isPending ? <DashboardSkeleton /> : null}
      {dashboardQuery.isError || catalogQuery.isError ? <StatePanel kind="error" title="Intelligence is temporarily unavailable" description="The mock service could not assemble this dashboard. Try the request again." action={{ label: 'Retry', onClick: () => { void catalogQuery.refetch(); void dashboardQuery.refetch() } }} /> : null}
      {snapshot && snapshot.kpis.length === 0 ? <StatePanel kind="empty" title="No signals match these filters" description="Broaden the commodity or region selection, or return the prototype state to success." /> : null}
      {snapshot && snapshot.kpis.length > 0 && catalog ? <DashboardContent snapshot={snapshot} movers={movers} horizon={filters.horizon} catalog={catalog} /> : null}
    </div>
  )
}

function Filter({ label, value, onChange, options, allLabel }: Readonly<{ label: string; value: string; onChange: (value: string) => void; options: Array<{ value: string; label: string }>; allLabel?: string }>) {
  return <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}<select className={selectClass} value={value} onChange={(event) => onChange(event.target.value)}>{allLabel ? <option value="">{allLabel}</option> : null}{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
}

function DashboardSkeleton() {
  return <section aria-label="Loading executive intelligence" aria-busy="true" className="grid gap-4"><div className="grid gap-4 sm:grid-cols-3">{[1, 2, 3].map((item) => <Skeleton key={item} className="h-32" />)}</div><div className="grid gap-4 xl:grid-cols-5"><Skeleton className="h-80 xl:col-span-3" /><Skeleton className="h-80 xl:col-span-2" /></div></section>
}

function DashboardContent({ snapshot, movers, horizon, catalog }: Readonly<{ snapshot: DashboardSnapshot; movers: ReturnType<typeof namePriceMovers>; horizon: string; catalog: CatalogSnapshot }>) {
  const commodityName = (id: string) => catalog.commodities.find((item) => item.id === id)?.name ?? 'Commodity'
  const regionName = (id: string) => catalog.regions.find((item) => item.id === id)?.name ?? 'Region'
  return <>
    {snapshot.state === 'stale' ? <SignalBanner icon={DatabaseZap} title="Stale market observations" message="The latest observation is outside the freshness window. Use the figures directionally until the next refresh." /> : null}
    {snapshot.state === 'partial' ? <SignalBanner icon={ShieldAlert} title="Partial intelligence" message={`Unavailable section: ${snapshot.unavailableSections.join(', ')}. Available signals remain visible.`} /> : null}
    <section className="grid gap-4 sm:grid-cols-3" aria-label="Core market and risk indicators">
      {snapshot.kpis.map((kpi) => <Card key={kpi.id} className="relative overflow-hidden"><div className={`absolute inset-x-0 top-0 h-0.5 ${kpi.tone === 'danger' ? 'bg-danger' : kpi.tone === 'warning' ? 'bg-warning' : 'bg-info'}`} /><CardHeader className="pb-2"><CardDescription>{kpi.label}</CardDescription><CardTitle className="font-mono text-2xl sm:text-3xl">{kpi.displayValue}</CardTitle></CardHeader><CardContent className="flex items-center gap-2 text-xs text-muted-foreground">{(kpi.trendPercent ?? 0) >= 0 ? <ArrowUpRight className="size-4 text-danger" /> : <ArrowDownRight className="size-4 text-success" />}<span>{Math.abs(kpi.trendPercent ?? 0)}% vs prior period</span></CardContent></Card>)}
    </section>
    <section className="grid min-w-0 gap-4 xl:grid-cols-5">
      <Card className="min-w-0 xl:col-span-3"><CardHeader className="flex-row items-start justify-between"><div><CardTitle className="flex items-center gap-2"><TrendingUp className="size-4 text-primary" />Top price movers</CardTitle><CardDescription>Largest absolute changes across observed markets.</CardDescription></div><Badge>{horizon}</Badge></CardHeader><CardContent><TableContainer><Table><TableHeader><TableRow><TableHead>Commodity</TableHead><TableHead>Market</TableHead><TableHead>Price</TableHead><TableHead>Change</TableHead></TableRow></TableHeader><TableBody>{movers.map((item) => <TableRow key={item.id}><TableCell className="font-semibold">{item.commodityName}</TableCell><TableCell className="text-muted-foreground">{item.marketName}</TableCell><TableCell className="font-mono">GHS {item.price.toFixed(2)}/{item.priceUnit.per}</TableCell><TableCell><span className={(item.changePercent ?? 0) >= 0 ? 'text-danger' : 'text-success'}>{(item.changePercent ?? 0) > 0 ? '+' : ''}{item.changePercent ?? 0}%</span></TableCell></TableRow>)}</TableBody></Table></TableContainer></CardContent></Card>
      <Card className="xl:col-span-2"><CardHeader><CardTitle className="flex items-center gap-2"><ShieldAlert className="size-4 text-warning" />Supply pressure</CardTitle><CardDescription>Shortage and glut alerts that may affect availability.</CardDescription></CardHeader><CardContent className="grid gap-3">{snapshot.alerts.filter((item) => item.category === 'shortage' || item.category === 'glut').map((alert) => <article key={alert.id} className="rounded-lg border bg-background/40 p-4"><div className="flex items-start justify-between gap-3"><strong className="text-sm">{alert.title}</strong><SemanticBadge signal="risk" level={alert.severity} /></div><p className="mt-2 text-sm leading-5 text-muted-foreground">{alert.message}</p><Badge className="mt-3">{alert.category}</Badge></article>)}</CardContent></Card>
    </section>
    <section className="grid gap-4 lg:grid-cols-2">
      <Card><CardHeader><CardTitle className="flex items-center gap-2"><Wheat className="size-4 text-danger" />Commodities at risk</CardTitle><CardDescription>Waste exposure ranked by severity and value.</CardDescription></CardHeader><CardContent className="grid gap-3">{snapshot.risks.length ? snapshot.risks.map((risk) => <article key={risk.id} className="rounded-lg border p-4"><div className="flex flex-wrap items-center justify-between gap-2"><strong>{commodityName(risk.commodityId)} · {regionName(risk.regionId)}</strong><SemanticBadge signal="risk" level={risk.severity} /></div><div className="mt-4 grid grid-cols-3 gap-3 text-sm"><Metric label="Probability" value={`${Math.round(risk.probability * 100)}%`} /><Metric label="Volume" value={`${risk.volumeAtRisk} ${risk.unit}`} /><Metric label="Value" value={formatMoney(risk.valueAtRisk.amount)} /></div><p className="mt-3 text-xs text-muted-foreground">Drivers: {risk.drivers.join(' · ')}</p></article>) : <p className="text-sm text-muted-foreground">No waste risks match this coverage.</p>}</CardContent></Card>
      <Card><CardHeader><CardTitle className="flex items-center gap-2"><Lightbulb className="size-4 text-primary" />Recommended action</CardTitle><CardDescription>Interventions with modeled impact and confidence.</CardDescription></CardHeader><CardContent className="grid gap-3">{snapshot.recommendations.map((recommendation) => <article key={recommendation.id} className="rounded-lg border p-4"><div className="flex flex-wrap items-start justify-between gap-2"><strong>{recommendation.title}</strong><SemanticBadge signal="confidence" level={recommendation.confidence.band} /></div><p className="mt-2 text-sm font-medium text-primary">{recommendation.action}</p><p className="mt-2 text-sm leading-5 text-muted-foreground">{recommendation.rationale}</p><div className="mt-3 flex items-center gap-2"><Badge tone="success">{recommendation.expectedImpactPercent}% modeled impact</Badge><Badge>{recommendation.category}</Badge></div></article>)}</CardContent></Card>
    </section>
  </>
}

function SignalBanner({ icon: Icon, title, message }: Readonly<{ icon: typeof ShieldAlert; title: string; message: string }>) { return <section className="flex gap-3 rounded-xl border border-warning/30 bg-warning/10 p-4" role="status"><Icon className="mt-0.5 size-5 shrink-0 text-warning" /><div><strong className="text-sm">{title}</strong><p className="mt-1 text-sm text-muted-foreground">{message}</p></div></section> }
function Metric({ label, value }: Readonly<{ label: string; value: string }>) { return <div><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 font-mono font-semibold">{value}</p></div> }
