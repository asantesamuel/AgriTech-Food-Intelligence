import { CheckCircle2, CircleAlert, Inbox, LoaderCircle } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Button } from './button'

type StateKind = 'loading' | 'empty' | 'error' | 'success'
const iconByKind = { loading: LoaderCircle, empty: Inbox, error: CircleAlert, success: CheckCircle2 } satisfies Record<StateKind, typeof CheckCircle2>

export function StatePanel({ kind, title, description, action, className }: Readonly<{ kind: StateKind; title: string; description: string; action?: { label: string; onClick: () => void }; className?: string }>) {
  const Icon = iconByKind[kind]
  return (
    <section className={cn('grid min-h-52 place-items-center rounded-xl border border-dashed bg-card/40 p-6 text-center', className)} aria-label={title} aria-busy={kind === 'loading'} aria-live="polite">
      <div className="grid max-w-sm justify-items-center gap-3">
        <span className={cn('grid size-10 place-items-center rounded-lg bg-secondary text-muted-foreground', kind === 'error' && 'text-danger', kind === 'success' && 'text-success')}>
          <Icon className={cn('size-5', kind === 'loading' && 'animate-spin')} aria-hidden />
        </span>
        <div><h3 className="font-semibold">{title}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p></div>
        {action ? <Button variant="outline" size="sm" onClick={action.onClick}>{action.label}</Button> : null}
      </div>
    </section>
  )
}
