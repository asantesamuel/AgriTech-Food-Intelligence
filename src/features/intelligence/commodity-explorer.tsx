import { FormEvent, useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight, ChevronLeft, ChevronRight, Search, SlidersHorizontal, TrendingDown, TrendingUp } from 'lucide-react'

import type { CommodityExplorerItem, CommodityExplorerQuery } from '@/domain'
import { Badge, Button, Input, PageHeader, SemanticBadge, Skeleton, StatePanel, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from '@/shared/ui'
import { useCommodityExplorer } from './intelligence-hooks'

interface CommodityExplorerProps {
  query: CommodityExplorerQuery
  onQueryChange: (changes: Partial<CommodityExplorerQuery>) => void
}

const selectClass = 'h-10 min-w-0 rounded-md border border-input bg-card px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

export function CommodityExplorer({ query, onQueryChange }: Readonly<CommodityExplorerProps>) {
  const result = useCommodityExplorer(query)
  const [search, setSearch] = useState(query.q)
  useEffect(() => setSearch(query.q), [query.q])

  function submitSearch(event: FormEvent) {
    event.preventDefault()
    onQueryChange({ q: search.trim(), page: 1 })
  }

  if (result.isPending) return <Page><Skeleton className="h-32" /><Skeleton className="h-44" /><Skeleton className="h-[32rem]" /></Page>
  if (result.isError) return <Page><PageHeader eyebrow="Intelligence · Commodities" title="Commodity explorer" description="Compare the market signals that shape near-term purchasing decisions." /><StatePanel kind="error" title="Commodity intelligence is unavailable" description="Retry the request or return the Demo condition to Ready." action={{ label: 'Retry', onClick: () => void result.refetch() }} /></Page>

  const { items, pageInfo, state } = result.data
  const filtered = Boolean(query.q || query.category || query.region || query.direction || query.risk || query.confidence)

  return <Page>
    <PageHeader
      eyebrow="Intelligence · Commodities"
      title="Which commodities need procurement attention?"
      description="Compare current prices, modeled direction, volatility and financial exposure before choosing where to investigate."
      meta={<div className="flex flex-wrap gap-2"><Badge tone="info">30-day forecast</Badge><Badge>{pageInfo.totalItems} commodities</Badge><Badge>Ghana market network</Badge></div>}
    />

    <StateNotice state={state} />

    <section className="panel rounded-lg p-4 sm:p-5" aria-labelledby="commodity-filters-title">
      <div className="mb-4 flex items-center gap-2"><SlidersHorizontal className="size-4 text-primary" /><h2 id="commodity-filters-title" className="font-semibold">Refine the portfolio</h2></div>
      <form onSubmit={submitSearch} className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(14rem,1.5fr)_repeat(5,minmax(8rem,1fr))]">
        <label className="relative"><span className="sr-only">Search commodities</span><Search className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search commodity" className="pl-9 pr-20" /><Button type="submit" size="sm" variant="ghost" className="absolute right-1 top-0.5">Search</Button></label>
        <Filter label="Category" value={query.category ?? ''} onChange={(value) => onQueryChange({ category: value as CommodityExplorerQuery['category'] || undefined, page: 1 })} options={[['', 'All categories'], ['cereal', 'Cereals'], ['vegetable', 'Vegetables'], ['fruit', 'Fruit'], ['tuber', 'Tubers'], ['legume', 'Legumes']]} />
        <Filter label="Region" value={query.region ?? ''} onChange={(value) => onQueryChange({ region: value || undefined, page: 1 })} options={[['', 'All regions'], ['region-greater-accra', 'Greater Accra'], ['region-ashanti', 'Ashanti']]} />
        <Filter label="Direction" value={query.direction ?? ''} onChange={(value) => onQueryChange({ direction: value as CommodityExplorerQuery['direction'] || undefined, page: 1 })} options={[['', 'All directions'], ['rising', 'Rising'], ['falling', 'Falling'], ['stable', 'Stable']]} />
        <Filter label="Waste risk" value={query.risk ?? ''} onChange={(value) => onQueryChange({ risk: value as CommodityExplorerQuery['risk'] || undefined, page: 1 })} options={[['', 'All risk levels'], ['critical', 'Critical'], ['high', 'High'], ['medium', 'Medium'], ['low', 'Low']]} />
        <Filter label="Model confidence" value={query.confidence ?? ''} onChange={(value) => onQueryChange({ confidence: value as CommodityExplorerQuery['confidence'] || undefined, page: 1 })} options={[['', 'All confidence'], ['high', 'High'], ['medium', 'Medium'], ['low', 'Low']]} />
      </form>
      <div className="mt-3 flex flex-wrap items-center gap-3 border-t pt-3">
        <Filter label="Sort" value={query.sort} onChange={(value) => onQueryChange({ sort: value as CommodityExplorerQuery['sort'], page: 1 })} options={[['attention', 'Procurement attention'], ['increase', 'Price increase'], ['decrease', 'Price decrease'], ['volatility', 'Volatility'], ['risk', 'Waste risk'], ['freshness', 'Freshness'], ['name', 'Commodity name']]} compact />
        <Filter label="Order" value={query.order} onChange={(value) => onQueryChange({ order: value as CommodityExplorerQuery['order'], page: 1 })} options={[['desc', 'Highest first'], ['asc', 'Lowest first']]} compact />
        {filtered ? <Button type="button" variant="ghost" size="sm" onClick={() => { setSearch(''); onQueryChange({ q: '', category: undefined, region: undefined, direction: undefined, risk: undefined, confidence: undefined, page: 1 }) }}>Clear filters</Button> : null}
      </div>
    </section>

    {!items.length ? <StatePanel kind="empty" title={filtered ? 'No commodities match these filters' : 'No commodity intelligence is available'} description={filtered ? 'Clear or broaden the portfolio filters to continue.' : 'The current dataset contains no commodity observations.'} /> : <>
      <div className="hidden lg:block"><CommodityTable items={items} /></div>
      <div className="grid gap-4 lg:hidden">{items.map((item) => <CommodityCard key={item.commodity.id} item={item} />)}</div>
      <Pagination page={pageInfo.page} pageSize={pageInfo.pageSize} totalItems={pageInfo.totalItems} totalPages={pageInfo.totalPages} onQueryChange={onQueryChange} />
    </>}
  </Page>
}

function Filter({ label, value, options, onChange, compact = false }: Readonly<{ label: string; value: string; options: readonly (readonly [string, string])[]; onChange: (value: string) => void; compact?: boolean }>) {
  return <label className={compact ? 'flex items-center gap-2 text-sm' : 'grid gap-1'}><span className={compact ? 'text-muted-foreground' : 'sr-only'}>{label}</span><select aria-label={label} value={value} onChange={(event) => onChange(event.target.value)} className={selectClass}>{options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}</select></label>
}

function CommodityTable({ items }: Readonly<{ items: CommodityExplorerItem[] }>) {
  return <TableContainer className="bg-card"><Table><caption className="sr-only">Commodity price, forecast, volatility and waste-risk intelligence</caption><TableHeader><TableRow><TableHead>Commodity</TableHead><TableHead>Current market</TableHead><TableHead>30-day forecast</TableHead><TableHead>Volatility</TableHead><TableHead>Waste risk</TableHead><TableHead><span className="sr-only">Action</span></TableHead></TableRow></TableHeader><TableBody>{items.map((item) => <TableRow key={item.commodity.id}><TableCell><CommodityIdentity item={item} /></TableCell><TableCell><CurrentMarket item={item} /></TableCell><TableCell><Forecast item={item} /></TableCell><TableCell><p className="font-mono font-semibold">{item.volatilityPercent.toFixed(1)}%</p><Badge className="mt-1">{item.volatilityBand}</Badge></TableCell><TableCell><Risk item={item} /></TableCell><TableCell className="text-right"><Button asChild variant="outline" size="sm"><Link to="/intelligence/commodities/$commodityId" params={{ commodityId: item.commodity.id }}>Open <ArrowRight /></Link></Button></TableCell></TableRow>)}</TableBody></Table></TableContainer>
}

function CommodityCard({ item }: Readonly<{ item: CommodityExplorerItem }>) {
  return <article className="panel rounded-lg p-5"><div className="flex items-start justify-between gap-3"><CommodityIdentity item={item} /><Direction direction={item.direction} value={item.movementPercent} /></div><dl className="mt-5 grid grid-cols-2 gap-4 border-y py-4"><div><dt className="data-label">Current market</dt><dd className="mt-2"><CurrentMarket item={item} /></dd></div><div><dt className="data-label">30-day forecast</dt><dd className="mt-2"><Forecast item={item} /></dd></div><div><dt className="data-label">Volatility</dt><dd className="mt-2 font-mono font-semibold">{item.volatilityPercent.toFixed(1)}% · {item.volatilityBand}</dd></div><div><dt className="data-label">Waste risk</dt><dd className="mt-2"><Risk item={item} /></dd></div></dl><Button asChild className="mt-4 w-full"><Link to="/intelligence/commodities/$commodityId" params={{ commodityId: item.commodity.id }}>Open intelligence <ArrowRight /></Link></Button></article>
}

function CommodityIdentity({ item }: Readonly<{ item: CommodityExplorerItem }>) { return <div><div className="flex flex-wrap items-center gap-2"><strong className="text-base">{item.commodity.name}</strong>{item.attentionRank === 100 ? <Badge tone="info">Priority</Badge> : null}</div><p className="mt-1 text-xs capitalize text-muted-foreground">{item.commodity.category} · {item.market.location.district}</p></div> }
function CurrentMarket({ item }: Readonly<{ item: CommodityExplorerItem }>) { const freshness = item.currentPrice.freshness.status; const observed = new Intl.DateTimeFormat('en-GH', { day: 'numeric', month: 'short' }).format(new Date(item.currentPrice.observedAt)); return <div><p className="font-mono font-semibold">GHS {item.currentPrice.value.toFixed(2)}/{item.currentPrice.unit.per}</p><div className="mt-1 flex flex-wrap items-center gap-2"><Direction direction={item.direction} value={item.movementPercent} />{freshness === 'unknown' ? <Badge>freshness unknown</Badge> : <SemanticBadge signal="freshness" level={freshness} />}<span className="text-xs text-muted-foreground">Observed {observed}</span></div></div> }
function Forecast({ item }: Readonly<{ item: CommodityExplorerItem }>) { const forecast = item.forecastSummary; return forecast ? <div><p className="font-mono font-semibold">GHS {forecast.lowerBound.toFixed(2)}–{forecast.upperBound.toFixed(2)}</p><div className="mt-1 flex items-center gap-2"><Direction direction={forecast.direction} value={forecast.changePercent} /><SemanticBadge signal="confidence" level={forecast.confidence.band} /></div></div> : <span className="text-sm text-muted-foreground">Forecast unavailable</span> }
function Risk({ item }: Readonly<{ item: CommodityExplorerItem }>) { const risk = item.riskSummary; return risk ? <div><SemanticBadge signal="risk" level={risk.severity} /><p className="mt-1 font-mono text-xs">GHS {risk.valueAtRisk.amount.toLocaleString('en-GH')} at risk</p></div> : <span className="text-sm text-muted-foreground">Risk unavailable</span> }
function Direction({ direction, value }: Readonly<{ direction: CommodityExplorerItem['direction']; value: number }>) { const Icon = direction === 'falling' ? TrendingDown : TrendingUp; return <span className="inline-flex items-center gap-1 text-xs font-semibold"><Icon className="size-3.5" aria-hidden />{value > 0 ? '+' : ''}{value.toFixed(1)}% <span className="sr-only">{direction}</span></span> }

function Pagination({ page, pageSize, totalItems, totalPages, onQueryChange }: Readonly<{ page: number; pageSize: number; totalItems: number; totalPages: number; onQueryChange: CommodityExplorerProps['onQueryChange'] }>) {
  const first = totalItems ? (page - 1) * pageSize + 1 : 0
  const last = Math.min(page * pageSize, totalItems)
  return <nav className="flex flex-col gap-3 rounded-lg border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between" aria-label="Commodity pages"><p className="text-sm text-muted-foreground">Showing {first}–{last} of {totalItems}</p><div className="flex items-center gap-2"><label className="flex items-center gap-2 text-sm text-muted-foreground">Rows <select aria-label="Rows per page" value={pageSize} onChange={(event) => onQueryChange({ pageSize: Number(event.target.value) as 10 | 25 | 50, page: 1 })} className={selectClass}><option value="10">10</option><option value="25">25</option><option value="50">50</option></select></label><Button variant="outline" size="icon" disabled={page <= 1} onClick={() => onQueryChange({ page: page - 1 })} aria-label="Previous page"><ChevronLeft /></Button><span className="min-w-20 text-center text-sm">Page {page} of {Math.max(totalPages, 1)}</span><Button variant="outline" size="icon" disabled={page >= totalPages} onClick={() => onQueryChange({ page: page + 1 })} aria-label="Next page"><ChevronRight /></Button></div></nav>
}

function StateNotice({ state }: Readonly<{ state: 'success' | 'empty' | 'stale' | 'low-confidence' | 'partial' | 'critical-risk' }>) {
  if (state === 'success' || state === 'empty') return null
  const messages = { stale: 'Market observations are stale. Check collection times before acting.', 'low-confidence': 'Model confidence is low. Use the ranges as directional evidence, not certainty.', partial: 'Some forecasts or risk estimates are unavailable; available fields remain visible.', 'critical-risk': 'A critical waste-risk signal is present in this portfolio.' } as const
  return <div role="status" className="rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning">{messages[state]}</div>
}

function Page({ children }: Readonly<{ children: React.ReactNode }>) { return <div className="mx-auto grid w-full max-w-[100rem] gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div> }
