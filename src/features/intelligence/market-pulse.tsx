import { Link } from '@tanstack/react-router'
import { ArrowRight, CircleAlert, MapPinned, TrendingUp } from 'lucide-react'

import { Badge, Button, PageHeader, SemanticBadge, Skeleton, StatePanel } from '@/shared/ui'
import { useMarketPulse } from './intelligence-hooks'

export function MarketPulse() {
  const query = useMarketPulse()
  if (query.isPending) return <Loading />
  if (query.isError) return <Page><StatePanel kind="error" title="Market pulse unavailable" description="Return the Demo condition to Ready or retry this intelligence request." action={{ label: 'Retry', onClick: () => void query.refetch() }} /></Page>
  if (!query.data.signals.length) return <Page><StatePanel kind="empty" title="No market signals match this scope" description="The active demo condition contains no priority intelligence." /></Page>

  const tomato = query.data.signals.find((signal) => signal.commodityId === 'commodity-tomato')!
  return <Page>
    <PageHeader eyebrow="Intelligence · Market pulse" title="Where is food-market pressure forming?" description="Monitor price movement, supply pressure and model signals before they become procurement disruption." meta={<div className="flex flex-wrap gap-2"><Badge tone="info">Tomato focus</Badge><Badge>Greater Accra + Ashanti</Badge><Badge>30-day horizon</Badge></div>} />

    <section className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)]">
      <Link to="/intelligence/commodities/$commodityId" params={{ commodityId: 'commodity-tomato' }} className="group overflow-hidden rounded-xl bg-[linear-gradient(135deg,#173f35,#1d6450)] p-6 text-white shadow-[0_18px_40px_rgba(23,63,53,0.15)] sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3"><Badge className="border-white/20 bg-white/10 text-white">Priority signal</Badge><SemanticBadge signal="risk" level={tomato.severity} /></div>
        <h2 className="mt-8 max-w-2xl text-2xl font-semibold sm:text-3xl">{tomato.title}</h2><p className="mt-3 max-w-2xl text-base leading-7 text-white/75">{tomato.summary}</p>
        <div className="mt-8 flex items-center justify-between border-t border-white/15 pt-5"><div><span className="text-sm text-white/65">Modeled movement</span><strong className="ml-3 font-mono text-lg">+{tomato.changePercent}%</strong></div><span className="flex items-center gap-2 font-semibold">Open tomato intelligence <ArrowRight className="transition-transform group-hover:translate-x-1" /></span></div>
      </Link>
      <aside className="panel rounded-lg p-5 sm:p-6"><p className="data-label">Coverage</p><h2 className="mt-2 text-xl font-semibold">Operational view</h2><div className="mt-6 grid gap-5"><Summary icon={MapPinned} label="Regions monitored" value="3" detail="Greater Accra, Ashanti, Northern" /><Summary icon={TrendingUp} label="Active price forecasts" value={String(query.data.forecasts.length)} detail="Model-backed outlooks" /><Summary icon={CircleAlert} label="Open alerts" value={String(query.data.alerts.length)} detail="Supply and market conditions" /></div></aside>
    </section>

    <section className="panel overflow-hidden rounded-lg"><header className="border-b px-5 py-5 sm:px-6"><p className="data-label">Signal register</p><h2 className="mt-2 text-xl font-semibold">Signals across the network</h2></header><div className="divide-y">{query.data.signals.map((signal) => <div key={signal.id} className="grid gap-3 px-5 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-6"><div><div className="flex flex-wrap items-center gap-2"><strong>{signal.title}</strong><SemanticBadge signal="risk" level={signal.severity} /></div><p className="mt-1 text-sm text-muted-foreground">{signal.summary}</p></div>{signal.commodityId === 'commodity-tomato' ? <Button asChild variant="outline" size="sm"><Link to="/intelligence/commodities/$commodityId" params={{ commodityId: 'commodity-tomato' }}>Investigate <ArrowRight /></Link></Button> : <Badge>{signal.direction}</Badge>}</div>)}</div></section>
  </Page>
}

function Page({ children }: Readonly<{ children: React.ReactNode }>) { return <div className="mx-auto grid w-full max-w-[100rem] gap-7 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div> }
function Summary({ icon: Icon, label, value, detail }: Readonly<{ icon: typeof MapPinned; label: string; value: string; detail: string }>) { return <div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent text-primary"><Icon className="size-4" /></span><div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-1 text-xl font-semibold">{value}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></div></div> }
function Loading() { return <Page><Skeleton className="h-28" /><div className="grid gap-5 lg:grid-cols-3"><Skeleton className="h-80 lg:col-span-2" /><Skeleton className="h-80" /></div><Skeleton className="h-72" /></Page> }
