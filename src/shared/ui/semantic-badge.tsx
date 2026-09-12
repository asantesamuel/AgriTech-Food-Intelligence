import { Badge, type BadgeProps } from './badge'

type Signal = 'risk' | 'confidence' | 'freshness' | 'status'
type Level = 'low' | 'medium' | 'high' | 'critical' | 'fresh' | 'stale' | 'active' | 'inactive'
const toneBySignal: Record<Signal, Partial<Record<Level, BadgeProps['tone']>>> = {
  risk: { low: 'success', medium: 'warning', high: 'danger', critical: 'danger' },
  confidence: { low: 'warning', medium: 'info', high: 'success' },
  freshness: { fresh: 'success', stale: 'warning' },
  status: { active: 'success', inactive: 'neutral' },
}

export function SemanticBadge({ signal, level }: Readonly<{ signal: Signal; level: Level }>) {
  return <Badge tone={toneBySignal[signal][level] ?? 'neutral'} aria-label={`${signal}: ${level}`}><span aria-hidden className="size-1.5 rounded-full bg-current" />{level}</Badge>
}
