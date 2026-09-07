import type { LucideIcon } from 'lucide-react'
import { Badge, Card, CardContent, StatePanel } from '@/shared/ui'

export function SectionPlaceholder({ eyebrow, title, description, icon: Icon, capabilities }: Readonly<{ eyebrow: string; title: string; description: string; icon: LucideIcon; capabilities: string[] }>) {
  return (
    <div className="surface-grid px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <div className="mx-auto grid max-w-7xl gap-8">
        <header className="max-w-3xl"><Badge tone="info">{eyebrow}</Badge><h1 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">{title}</h1><p className="mt-4 text-base leading-7 text-muted-foreground">{description}</p></header>
        <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
          <StatePanel kind="loading" title="Preparing intelligence surface" description="This route is available in the shell and will connect to its feature service in a scoped ticket." />
          <Card><CardContent className="grid gap-4 pt-5 sm:pt-6"><span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="size-5" aria-hidden /></span><div><h2 className="font-semibold">Section capabilities</h2><ul className="mt-3 grid gap-2 text-sm text-muted-foreground">{capabilities.map((capability) => <li key={capability} className="flex gap-2"><span className="mt-2 size-1 rounded-full bg-primary" aria-hidden />{capability}</li>)}</ul></div></CardContent></Card>
        </div>
      </div>
    </div>
  )
}
