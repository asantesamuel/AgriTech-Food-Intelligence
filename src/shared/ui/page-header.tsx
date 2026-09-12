import type { ReactNode } from 'react'

export function PageHeader({ eyebrow, title, description, meta, action }: Readonly<{ eyebrow?: string; title: string; description?: string; meta?: ReactNode; action?: ReactNode }>) {
  return <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
    <div className="max-w-4xl">{eyebrow ? <p className="text-sm font-medium text-primary">{eyebrow}</p> : null}<h1 className="mt-2 text-balance text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">{title}</h1>{description ? <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">{description}</p> : null}{meta ? <div className="mt-4">{meta}</div> : null}</div>
    {action ? <div className="flex shrink-0 flex-wrap gap-2">{action}</div> : null}
  </header>
}
