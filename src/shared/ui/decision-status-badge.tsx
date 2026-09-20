import type { DecisionStatus } from '@/domain'
import { Badge } from './badge'

const tone: Record<DecisionStatus, 'neutral' | 'success' | 'warning' | 'danger' | 'info'> = {
  recommended: 'warning', accepted: 'info', dismissed: 'neutral', modified: 'info', assigned: 'info', approved: 'success', 'in-progress': 'warning', completed: 'success',
}

const label: Record<DecisionStatus, string> = {
  recommended: 'Recommended', accepted: 'Accepted', dismissed: 'Dismissed', modified: 'Modified', assigned: 'Assigned', approved: 'Approved', 'in-progress': 'In progress', completed: 'Completed',
}

export function DecisionStatusBadge({ status }: Readonly<{ status: DecisionStatus }>) { return <Badge tone={tone[status]}>{label[status]}</Badge> }
