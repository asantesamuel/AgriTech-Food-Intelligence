import { createFileRoute, Link } from '@tanstack/react-router'
import { Activity } from 'lucide-react'
import { SectionPlaceholder } from '@/features/platform'
import { Button } from '@/shared/ui'

export const Route = createFileRoute('/_app/')({ component: OverviewPage })
function OverviewPage() { return <SectionPlaceholder eyebrow="Overview" title="Executive intelligence, at a glance." description="A prioritized view of market movements, supply pressure, waste exposure, and recommended action." icon={Activity} capabilities={['Executive dashboard', 'Watchlist', 'Recent intelligence activity']} action={<Button asChild variant="outline"><Link to="/onboarding">Configure workspace</Link></Button>} /> }
