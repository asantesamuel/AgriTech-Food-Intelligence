import { Link } from '@tanstack/react-router'
import { ArrowRight, Beaker, CircleDollarSign, Clock3, Save } from 'lucide-react'
import { useMemo, useState } from 'react'

import { useCommodityIntelligence } from '@/features/intelligence/intelligence-hooks'
import { Badge, Button, PageHeader, Skeleton, StatePanel } from '@/shared/ui'

const money = (amount: number) => new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS', maximumFractionDigits: 0 }).format(amount)

export function ScenarioLab() {
  const query = useCommodityIntelligence('commodity-tomato')
  const [delayDays, setDelayDays] = useState(7)
  const [quantity, setQuantity] = useState(80)
  const [growth, setGrowth] = useState(18)
  const [saved, setSaved] = useState(false)
  const result = useMemo(() => {
    const expectedPrice = 8.54 * (1 + (growth / 100) * (delayDays / 30))
    const costOfWaiting = Math.max(0, (expectedPrice - 8.54) * quantity * 1000)
    return { expectedPrice, costOfWaiting, valueProtected: Math.max(0, 684_000 - costOfWaiting) }
  }, [delayDays, growth, quantity])

  if (query.isPending) return <Page><Skeleton className="h-28" /><Skeleton className="h-[32rem]" /></Page>
  if (query.isError) return <Page><StatePanel kind="error" title="Scenario baseline unavailable" description="A current intelligence baseline is required before a simulation can run." /></Page>

  return <Page>
    <PageHeader eyebrow="Planning · Scenario lab" title="Compare purchase timing before committing." description="Change assumptions around tomato timing and volume, then compare the simulated outcome with the current model forecast." meta={<div className="flex flex-wrap gap-2"><Badge tone="info">Baseline forecast</Badge><Badge className="border-[var(--forecast)]/30 bg-[var(--forecast)]/10 text-[var(--forecast)]">Simulation</Badge><Badge>Tomato · Greater Accra</Badge></div>} />
    <div className="rounded-lg border border-[var(--forecast)]/25 bg-[var(--forecast)]/5 p-4 text-sm"><strong>Simulation—not forecast.</strong><span className="ml-2 text-muted-foreground">These results change only the planning scenario and do not alter live intelligence.</span></div>
    <section className="grid gap-6 xl:grid-cols-[minmax(20rem,0.75fr)_minmax(0,1.25fr)]">
      <div className="panel rounded-lg p-5 sm:p-6"><p className="data-label">Scenario assumptions</p><h2 className="mt-2 text-xl font-semibold">When should we buy?</h2><div className="mt-7 grid gap-7"><Range label="Delay after today" value={delayDays} min={0} max={21} suffix="days" onChange={setDelayDays} /><Range label="Purchase volume" value={quantity} min={40} max={120} suffix="tonnes" onChange={setQuantity} /><Range label="30-day price growth" value={growth} min={0} max={30} suffix="%" onChange={setGrowth} /></div><div className="mt-8 border-t pt-5"><Button className="w-full" onClick={() => setSaved(true)}><Save />Save scenario</Button>{saved ? <p className="mt-3 text-center text-sm text-success" role="status">Scenario saved for this session.</p> : null}</div></div>
      <div className="overflow-hidden rounded-xl bg-[#171633] text-white"><div className="border-b border-white/10 p-6"><div className="flex items-center gap-2 text-sm text-indigo-200"><Beaker className="size-4" />Simulated outcome</div><h2 className="mt-3 text-2xl font-semibold">Buying in {delayDays} days</h2><p className="mt-2 text-sm leading-6 text-white/65">Modeled from the selected assumptions. Confirm against the live forecast before creating a decision.</p></div><div className="grid divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0"><Result icon={Clock3} label="Modeled unit price" value={`GHS ${result.expectedPrice.toFixed(2)}`} /><Result icon={CircleDollarSign} label="Cost of waiting" value={money(result.costOfWaiting)} /><Result icon={CircleDollarSign} label="Value protected" value={money(result.valueProtected)} /></div><div className="p-6"><div className="grid gap-4 rounded-lg bg-white/7 p-5 sm:grid-cols-[1fr_auto] sm:items-center"><div><strong>Team lead recommendation</strong><p className="mt-1 text-sm leading-6 text-white/65">Keep the purchase inside the seven-day window. Longer delays increase modeled acquisition cost.</p></div><Button asChild className="bg-white text-[#171633] hover:bg-white/90"><Link to="/decisions/$decisionId" params={{ decisionId: 'decision-tomato-purchase' }}>Open decision <ArrowRight /></Link></Button></div></div></div>
    </section>
  </Page>
}

function Page({ children }: Readonly<{ children: React.ReactNode }>) { return <div className="mx-auto grid w-full max-w-[100rem] gap-7 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div> }
function Range({ label, value, min, max, suffix, onChange }: Readonly<{ label: string; value: number; min: number; max: number; suffix: string; onChange: (value: number) => void }>) { return <label className="grid gap-3"><span className="flex items-center justify-between gap-3 text-sm font-medium"><span>{label}</span><strong className="font-mono">{value} {suffix}</strong></span><input type="range" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} className="accent-[var(--forecast)]" /></label> }
function Result({ icon: Icon, label, value }: Readonly<{ icon: typeof Clock3; label: string; value: string }>) { return <div className="p-6"><Icon className="size-4 text-indigo-300" /><p className="mt-4 text-sm text-white/55">{label}</p><p className="mt-2 font-mono text-xl font-semibold">{value}</p></div> }
