import { createFileRoute } from '@tanstack/react-router'
import { Compass } from 'lucide-react'
import { SectionPlaceholder } from '@/features/platform'

export const Route = createFileRoute('/_app/decisions')({ component: DecisionsPage })
function DecisionsPage() { return <SectionPlaceholder eyebrow="Decisions" title="Turn intelligence into coordinated action." description="Review recommendations and future procurement, logistics, storage, processing, and optimisation workflows." icon={Compass} capabilities={['Recommendations', 'Procurement and redistribution', 'Optimisation workflows']} /> }
