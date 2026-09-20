import { createFileRoute } from '@tanstack/react-router'
import { DecisionDetail } from '@/features/decisions'

export const Route = createFileRoute('/_app/decisions/$decisionId')({ component: DecisionPage })
function DecisionPage() { const { decisionId } = Route.useParams(); return <DecisionDetail decisionId={decisionId} /> }
