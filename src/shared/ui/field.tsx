import type { HTMLAttributes, LabelHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

export function Field({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={cn('grid gap-2', className)} {...props} /> }
export function FieldLabel({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) { return <label className={cn('text-sm font-medium', className)} {...props} /> }
export function FieldMessage({ error, children }: Readonly<{ error?: boolean; children: ReactNode }>) { return <p className={cn('text-xs text-muted-foreground', error && 'text-danger')} role={error ? 'alert' : undefined}>{children}</p> }
