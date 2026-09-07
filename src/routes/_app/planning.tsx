import { createFileRoute } from '@tanstack/react-router'
import { Blocks } from 'lucide-react'
import { SectionPlaceholder } from '@/features/platform'

export const Route = createFileRoute('/_app/planning')({ component: PlanningPage })
function PlanningPage() { return <SectionPlaceholder eyebrow="Planning" title="Test scenarios and allocate for resilience." description="A home for scenario modelling, infrastructure intelligence, reports, and model performance." icon={Blocks} capabilities={['Scenario lab', 'Infrastructure intelligence', 'Reports and model performance']} /> }
