import { createFileRoute } from '@tanstack/react-router'
import { ArrowUpRight, DatabaseZap } from 'lucide-react'

import { appConfig } from '@/config/env'
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, SemanticBadge, StatePanel } from '@/shared/ui'

export const Route = createFileRoute('/')({ component: DesignSystemLanding })

const signals = [
  { label: 'Supply risk', value: 'Elevated', signal: 'risk' as const, level: 'high' as const },
  { label: 'Model confidence', value: '87%', signal: 'confidence' as const, level: 'low' as const },
  { label: 'Data freshness', value: '12 min ago', signal: 'freshness' as const, level: 'fresh' as const },
]

function DesignSystemLanding() {
  return (
    <main className="surface-grid min-h-screen px-5 py-12 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-6xl gap-10">
        <header className="grid gap-5 border-b pb-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <Badge tone="success">System online</Badge>
            <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">Intelligence infrastructure for Ghana&apos;s food system.</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{appConfig.name} turns fragmented market signals into decision-ready insight for institutional operators.</p>
          </div>
          <Button size="lg">Explore platform <ArrowUpRight aria-hidden /></Button>
        </header>

        <section className="grid gap-4 md:grid-cols-3" aria-label="Signal preview">
          {signals.map((signal) => (
            <Card key={signal.label}>
              <CardHeader>
                <CardDescription>{signal.label}</CardDescription>
                <div className="flex items-end justify-between gap-4">
                  <CardTitle className="font-mono text-2xl">{signal.value}</CardTitle>
                  <SemanticBadge signal={signal.signal} level={signal.level} />
                </div>
              </CardHeader>
            </Card>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary"><DatabaseZap className="size-4" aria-hidden /></span>
                <div><CardTitle>Shared intelligence surface</CardTitle><CardDescription>Reusable visual language for data-heavy workflows.</CardDescription></div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2"><Button variant="secondary">Secondary action</Button><Button variant="outline">Review methodology</Button></CardContent>
          </Card>
          <StatePanel kind="success" title="Foundation ready" description="Tokens, primitives, semantic states, and responsive surfaces are configured." />
        </section>
      </div>
    </main>
  )
}
