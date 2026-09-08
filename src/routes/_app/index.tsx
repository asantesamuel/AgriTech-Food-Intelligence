import { createFileRoute } from '@tanstack/react-router'
import { ExecutiveDashboard } from '@/features/dashboard'

export const Route = createFileRoute('/_app/')({ component: OverviewPage })
function OverviewPage() { return <ExecutiveDashboard /> }
