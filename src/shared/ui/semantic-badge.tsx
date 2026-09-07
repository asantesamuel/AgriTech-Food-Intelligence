import { Badge, type BadgeProps } from './badge'

type Signal = 'risk' | 'confidence' | 'freshness' | 'status'
type Level = 'low' | 'medium' | 'high' | 'critical' | 'fresh' | 'stale' | 'active' | 'inactive'
const toneByLevel: Record<Level, BadgeProps['tone']> = { low: 'success', medium: 'warning', high: 'danger', critical: 'danger', fresh: 'success', stale: 'warning', active: 'success', inactive: 'neutral' }

export function SemanticBadge({ signal, level }: Readonly<{ signal: Signal; level: Level }>) {
  return <Badge tone={toneByLevel[level]} aria-label={`${signal}: ${level}`}><span aria-hidden className="size-1.5 rounded-full bg-current" />{level}</Badge>
}
