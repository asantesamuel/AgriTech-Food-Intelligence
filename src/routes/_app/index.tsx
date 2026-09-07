import { createFileRoute } from '@tanstack/react-router'
import { Activity } from 'lucide-react'
import { SectionPlaceholder } from '@/features/platform'

export const Route = createFileRoute('/_app/')({ component: OverviewPage })
function OverviewPage() { return <SectionPlaceholder eyebrow="Overview" title="Executive intelligence, at a glance." description="A prioritized view of market movements, supply pressure, waste exposure, and recommended action." icon={Activity} capabilities={['Executive dashboard', 'Watchlist', 'Recent intelligence activity']} /> }
