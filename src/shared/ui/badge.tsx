import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

const badgeVariants = cva('inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.68rem] font-bold tracking-wide uppercase', {
  variants: { tone: {
    neutral: 'border-border bg-secondary text-secondary-foreground', success: 'border-success/30 bg-success/10 text-success',
    warning: 'border-warning/30 bg-warning/10 text-warning', danger: 'border-danger/30 bg-danger/10 text-danger', info: 'border-info/30 bg-info/10 text-info',
  } }, defaultVariants: { tone: 'neutral' },
})

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}
export function Badge({ className, tone, ...props }: BadgeProps) { return <span className={cn(badgeVariants({ tone }), className)} {...props} /> }
export { badgeVariants }
