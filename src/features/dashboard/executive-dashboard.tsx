import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Clock3, DatabaseZap, MapPin, RefreshCw, ShieldAlert } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import type { CatalogSnapshot, DashboardSnapshot } from '@/domain'
import { ForecastChart } from '@/features/intelligence'
import { useAuth } from '@/features/platform/auth/auth-context'
import { useDemo } from '@/features/platform/demo/demo-context'
import type { DashboardFilters } from '@/services'
import { catalogService, dashboardService } from '@/services'
import { Badge, Button, SemanticBadge, Skeleton, StatePanel } from '@/shared/ui'
import { defaultDashboardFilters, namePriceMovers } from './dashboard-model'

const selectClass = 'h-10 min-w-0 rounded-md border border-input bg-card px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
const formatMoney = (amount: number) => new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS', maximumFractionDigits: 0 }).format(amount)

export function ExecutiveDashboard() {
  const { organization, user } = useAuth()
  const { scenario } = useDemo()
  const initial = useMemo(() => defaultDashboardFilters(typeof window === 'undefined' ? null : window.localStorage, organization?.id ?? ''), [organization?.id])
  const [filters, setFilters] = useState<Required<DashboardFilters>>(initial)
  useEffect(() => setFilters(initial), [initial])
  const catalogQuery = useQuery({ queryKey: ['catalog'], queryFn: () => catalogService.getCatalog() })
  const dashboardQuery = useQuery({ queryKey: ['dashboard', filters, scenario], queryFn: () => dashboardService.getSnapshot(filters, { scenario }) })

  function updateFilter<Key extends keyof Required<DashboardFilters>>(key: Key, value: Required<DashboardFilters>[Key]) {
    setFilters((current) => ({ ...current, [key]: value }))
  }

  return <div className="mx-auto grid w-full max-w-[100rem] gap-7 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
    <header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
      <div>
        <p className="text-sm font-medium text-primary">Procurement brief · {organization?.name}</p>
        <h1 className="mt-2 max-w-3xl text-balance text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Good morning, {user?.name.split(' ')[0] ?? 'team'}. One purchase decision needs attention.</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">Review where tomato supply, price pressure and timing could affect your next purchasing window.</p>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground"><Clock3 className="size-4" /><span>Illustrative dataset · 7 Sep 2026</span></div>
    </header>

    <section className="panel grid gap-4 rounded-lg p-4 lg:grid-cols-[repeat(3,minmax(0,1fr))_auto] lg:items-end" aria-label="Intelligence scope">
      <Filter label="Commodity" value={filters.commodityId} onChange={(value) => updateFilter('commodityId', value)} options={catalogQuery.data?.commodities.map((item) => ({ value: item.id, label: item.name })) ?? []} />
      <Filter label="Region" value={filters.regionId} onChange={(value) => updateFilter('regionId', value)} options={catalogQuery.data?.regions.map((item) => ({ value: item.id, label: item.name })) ?? []} />
      <Filter label="Decision horizon" value={filters.horizon} onChange={(value) => updateFilter('horizon', value as Required<DashboardFilters>['horizon'])} options={[{ value: '7d', label: 'Next 7 days' }, { value: '30d', label: 'Next 30 days' }, { value: '90d', label: 'Next 90 days' }]} />
      <Button variant="outline" onClick={() => void dashboardQuery.refetch()}><RefreshCw />Refresh</Button>
    </section>

    {dashboardQuery.isPending || catalogQuery.isPending ? <DashboardSkeleton /> : null}
    {dashboardQuery.isError || catalogQuery.isError ? <StatePanel kind="error" title="Intelligence is temporarily unavailable" description="Open Demo controls to return the application condition to Ready, or retry the request." action={{ label: 'Retry', onClick: () => { void catalogQuery.refetch(); void dashboardQuery.refetch() } }} /> : null}
    {dashboardQuery.data && dashboardQuery.data.kpis.length === 0 ? <StatePanel kind="empty" title="No decisions need attention" description="No tomato signals match the active procurement scope." /> : null}
    {dashboardQuery.data && dashboardQuery.data.kpis.length > 0 && catalogQuery.data ? <DashboardContent snapshot={dashboardQuery.data} catalog={catalogQuery.data} horizon={filters.horizon} /> : null}
  </div>
}

function DashboardContent({ snapshot, catalog, horizon }: Readonly<{ snapshot: DashboardSnapshot; catalog: CatalogSnapshot; horizon: string }>) {
  const movers = namePriceMovers(snapshot, catalog)
  const primaryRisk = snapshot.risks.find((risk) => risk.commodityId === 'commodity-tomato') ?? snapshot.risks[0]
  const primaryRecommendation = snapshot.recommendations.find((recommendation) => recommendation.title.toLowerCase().includes('tomato')) ?? snapshot.recommendations[0]
  const forecast = snapshot.forecasts.find((item) => item.commodityId === 'commodity-tomato') ?? snapshot.forecasts[0]
  const valueProtected = primaryRisk?.valueAtRisk.amount ?? 0

  return <>
    {snapshot.state === 'stale' ? <SignalBanner icon={DatabaseZap} title="The latest market observations are stale" message="Treat the purchase window as directional until market reporting catches up." /> : null}
    {snapshot.state === 'partial' ? <SignalBanner icon={ShieldAlert} title="The brief has partial coverage" message={`Unavailable evidence: ${snapshot.unavailableSections.join(', ')}. Available intelligence remains visible.`} /> : null}
    {snapshot.state === 'low-confidence' ? <SignalBanner icon={ShieldAlert} title="Model confidence is low" message="Review the wider forecast range and confirm market conditions before committing volume." /> : null}

    <section className="overflow-hidden rounded-xl bg-[linear-gradient(120deg,#123c31,#1a5746)] text-white shadow-[0_18px_45px_rgba(18,60,49,0.16)]" aria-labelledby="priority-decision-title">
      <div className="grid lg:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.55fr)]">
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2"><Badge className="border-white/20 bg-white/10 text-white">Priority decision</Badge><Badge className="border-amber-200/30 bg-amber-200/10 text-amber-100">Review today</Badge></div>
          <h2 id="priority-decision-title" className="mt-5 max-w-3xl text-2xl font-semibold tracking-tight sm:text-3xl">Move the next tomato purchase window forward.</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-white/75">{primaryRecommendation?.rationale ?? 'Rising demand pressure and a tightening price outlook favor earlier purchasing.'}</p>
          <p className="mt-5 text-lg font-semibold">{primaryRecommendation?.action ?? 'Secure the required tomato volume before the forecast price rise.'}</p>
          <div className="mt-7 flex flex-wrap gap-3"><Button asChild className="bg-white text-[#153e33] hover:bg-white/90"><Link to="/decisions">Review recommendation <ArrowRight /></Link></Button><Button asChild variant="outline" className="border-white/25 bg-transparent text-white hover:bg-white/10"><Link to="/intelligence">View supporting intelligence</Link></Button></div>
        </div>
        <aside className="grid content-center gap-5 border-t border-white/15 bg-black/10 p-6 sm:p-8 lg:border-l lg:border-t-0" aria-label="Expected decision impact">
          <div><p className="text-sm text-white/65">Financial value protected</p><p className="mt-1 font-mono text-3xl font-semibold">{formatMoney(valueProtected)}</p></div>
          <div className="grid grid-cols-2 gap-5"><div><p className="text-sm text-white/65">Model confidence</p><p className="mt-1 text-lg font-semibold capitalize">{forecast?.confidence.band ?? '—'}</p></div><div><p className="text-sm text-white/65">Decision by</p><p className="mt-1 text-lg font-semibold">Today, 16:00</p></div></div>
        </aside>
      </div>
    </section>

    <section className="panel grid divide-y rounded-lg sm:grid-cols-2 sm:divide-x sm:divide-y-0 xl:grid-cols-4" aria-label="Operating pulse">
      <PulseMetric label="Value currently exposed" value={formatMoney(primaryRisk?.valueAtRisk.amount ?? 0)} detail="Tomato · Greater Accra" />
      <PulseMetric label="Purchase decisions due" value={String(snapshot.recommendations.length)} detail="1 requires review today" />
      <PulseMetric label="Markets under pressure" value={String(snapshot.alerts.length)} detail="Glut and shortage signals" />
      <PulseMetric label="Model confidence" value={`${Math.round((forecast?.confidence.score ?? 0) * 100)}%`} detail={`${horizon.toUpperCase()} price outlook`} />
    </section>

    <section className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(18rem,0.75fr)]">
      <div className="panel min-w-0 rounded-lg p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><p className="data-label">Tomato market outlook</p><h2 className="mt-2 text-xl font-semibold">Observed price and 30-day forecast</h2><p className="mt-1 text-sm text-muted-foreground">Agbogbloshie Wholesale · GHS per crate</p></div><div className="flex items-center gap-2"><span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="size-2 rounded-full bg-[var(--observed)]" />Observed</span><span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="size-2 rounded-full bg-[var(--forecast)]" />Forecast</span></div></div>
        {forecast ? <ForecastChart forecast={forecast} observedValue={movers.find((item) => item.commodityId === 'commodity-tomato')?.price ?? 8.54} /> : <p className="mt-8 text-sm text-muted-foreground">Forecast evidence is unavailable for this scope.</p>}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-sm"><p className="text-muted-foreground">Peak arrivals and limited cold storage widen the downside risk of waiting.</p><Button asChild variant="ghost" size="sm"><Link to="/intelligence">Explore forecast <ArrowRight /></Link></Button></div>
      </div>

      <div className="panel rounded-lg p-5 sm:p-6">
        <p className="data-label">Flow pressure</p><h2 className="mt-2 text-xl font-semibold">Tomato corridor</h2><p className="mt-1 text-sm text-muted-foreground">Supply movement and destination demand.</p>
        <div className="mt-7 grid gap-5"><CorridorStop place="Ashanti source markets" detail="80 t available" status="Supply available" /><div className="ml-4 h-8 border-l border-dashed border-primary/40" /><CorridorStop place="Greater Accra demand" detail="Price pressure rising" status="Purchase earlier" emphasis /></div>
        <div className="mt-7 rounded-lg bg-muted p-4"><div className="flex items-center gap-2 text-sm font-semibold"><MapPin className="size-4 text-primary" />Timing window</div><p className="mt-2 text-sm leading-6 text-muted-foreground">Secure volume within seven days before the modeled price increase accelerates.</p></div>
      </div>
    </section>

    <section className="panel overflow-hidden rounded-lg" aria-labelledby="action-queue-title">
      <header className="flex flex-col gap-2 border-b px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-6"><div><p className="data-label">Next actions</p><h2 id="action-queue-title" className="mt-2 text-xl font-semibold">Procurement action queue</h2></div><Button asChild variant="ghost" size="sm"><Link to="/decisions">View all decisions <ArrowRight /></Link></Button></header>
      <div className="divide-y">{snapshot.recommendations.map((recommendation, index) => <Link key={recommendation.id} to="/decisions" className="grid gap-3 px-5 py-4 transition-colors hover:bg-muted/60 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center sm:px-6"><div><div className="flex flex-wrap items-center gap-2"><strong>{recommendation.title}</strong><SemanticBadge signal="risk" level={recommendation.priority} /></div><p className="mt-1 text-sm text-muted-foreground">{recommendation.action}</p></div><div className="sm:text-right"><p className="text-xs text-muted-foreground">Expected value protected</p><p className="mt-1 font-mono font-semibold">{index === 0 ? formatMoney(valueProtected) : 'GHS 202,000'}</p></div><ArrowRight className="hidden size-4 text-muted-foreground sm:block" /></Link>)}</div>
    </section>
  </>
}

function Filter({ label, value, onChange, options }: Readonly<{ label: string; value: string; onChange: (value: string) => void; options: Array<{ value: string; label: string }> }>) {
  return <label className="grid min-w-0 gap-1.5 text-sm font-medium">{label}<select className={selectClass} value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
}

function PulseMetric({ label, value, detail }: Readonly<{ label: string; value: string; detail: string }>) { return <div className="p-5 sm:p-6"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 font-mono text-2xl font-semibold tracking-tight">{value}</p><p className="mt-2 text-xs text-muted-foreground">{detail}</p></div> }

function CorridorStop({ place, detail, status, emphasis }: Readonly<{ place: string; detail: string; status: string; emphasis?: boolean }>) { return <div className="flex items-start gap-3"><span className={`mt-1 size-3 rounded-full border-2 ${emphasis ? 'border-warning bg-warning/20' : 'border-primary bg-primary/15'}`} /><div><strong className="block text-sm">{place}</strong><span className="mt-1 block text-sm text-muted-foreground">{detail}</span><Badge tone={emphasis ? 'warning' : 'success'} className="mt-2">{status}</Badge></div></div> }

function SignalBanner({ icon: Icon, title, message }: Readonly<{ icon: typeof ShieldAlert; title: string; message: string }>) { return <section className="flex gap-3 rounded-lg border border-warning/30 bg-warning/10 p-4" role="status"><Icon className="mt-0.5 size-5 shrink-0 text-warning" /><div><strong className="text-sm">{title}</strong><p className="mt-1 text-sm text-muted-foreground">{message}</p></div></section> }

function DashboardSkeleton() { return <section aria-label="Loading procurement brief" aria-busy="true" className="grid gap-5"><Skeleton className="h-72" /><Skeleton className="h-28" /><div className="grid gap-5 xl:grid-cols-3"><Skeleton className="h-96 xl:col-span-2" /><Skeleton className="h-96" /></div></section> }
