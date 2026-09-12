import { Link } from '@tanstack/react-router'
import { ArrowRight, CircleDollarSign, Clock3, UserRound } from 'lucide-react'

import { Badge, DecisionStatusBadge, PageHeader, Skeleton, StatePanel } from '@/shared/ui'
import { useDecisionQueue } from './decision-hooks'

const money = (amount: number) => new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS', maximumFractionDigits: 0 }).format(amount)

export function DecisionQueue() {
  const query = useDecisionQueue()
  if (query.isPending) return <Page><Skeleton className="h-28" /><Skeleton className="h-80" /></Page>
  if (query.isError) return <Page><StatePanel kind="error" title="Decision queue unavailable" description="Return the Demo condition to Ready or retry the request." action={{ label: 'Retry', onClick: () => void query.refetch() }} /></Page>
  return <Page>
    <PageHeader eyebrow="Decisions · Action queue" title="What needs a procurement decision?" description="Review recommendations, assign ownership, approve action and track the value ultimately protected." meta={<div className="flex flex-wrap gap-2"><Badge tone="warning">1 due today</Badge><Badge>Tomato procurement</Badge><Badge>Greater Accra + Ashanti</Badge></div>} />
    {!query.data.decisions.length ? <StatePanel kind="empty" title="No decisions need attention" description="The active demo condition contains no purchase recommendations." /> : <section className="panel overflow-hidden rounded-lg"><header className="grid gap-3 border-b px-5 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:px-6"><div><p className="data-label">Priority order</p><h2 className="mt-2 text-xl font-semibold">Purchase decisions</h2></div><p className="text-sm text-muted-foreground">Sorted by urgency and expected financial value</p></header><div className="divide-y">{query.data.decisions.map((decision) => <Link key={decision.id} to="/decisions/$decisionId" params={{ decisionId: decision.id }} className="group grid gap-4 px-5 py-5 transition-colors hover:bg-muted/60 sm:px-6 lg:grid-cols-[minmax(0,1fr)_auto_auto_auto] lg:items-center"><div><div className="flex flex-wrap items-center gap-2"><strong className="text-base">{decision.title}</strong><DecisionStatusBadge status={decision.status} /></div><p className="mt-2 text-sm text-muted-foreground">Secure {decision.purchaseTiming.quantity} {decision.purchaseTiming.unit} · {decision.purchaseTiming.windowStart} to {decision.purchaseTiming.windowEnd}</p></div><QueueMeta icon={CircleDollarSign} label="Expected value" value={money(decision.impact.expectedFinancialValueProtected.amount)} /><QueueMeta icon={UserRound} label="Owner" value="Kwame Owusu" /><div className="flex items-center justify-between gap-3 lg:justify-end"><QueueMeta icon={Clock3} label="Decision by" value="Today, 16:00" /><ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" /></div></Link>)}</div></section>}
    <section className="grid gap-5 md:grid-cols-3"><Summary label="Awaiting review" value="1" detail="Recommendation ready" /><Summary label="In execution" value="0" detail="No approved purchases" /><Summary label="Value measured" value="—" detail="Recorded after completion" /></section>
  </Page>
}

function Page({ children }: Readonly<{ children: React.ReactNode }>) { return <div className="mx-auto grid w-full max-w-[100rem] gap-7 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div> }
function QueueMeta({ icon: Icon, label, value }: Readonly<{ icon: typeof Clock3; label: string; value: string }>) { return <div className="flex items-start gap-2 text-sm"><Icon className="mt-0.5 size-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 font-medium">{value}</p></div></div> }
function Summary({ label, value, detail }: Readonly<{ label: string; value: string; detail: string }>) { return <div className="panel rounded-lg p-5"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 font-mono text-2xl font-semibold">{value}</p><p className="mt-2 text-xs text-muted-foreground">{detail}</p></div> }
