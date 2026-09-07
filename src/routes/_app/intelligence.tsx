import { createFileRoute } from '@tanstack/react-router'
import { BarChart3 } from 'lucide-react'
import { SectionPlaceholder } from '@/features/platform'

export const Route = createFileRoute('/_app/intelligence')({ component: IntelligencePage })
function IntelligencePage() { return <SectionPlaceholder eyebrow="Intelligence" title="See pressure forming before it becomes disruption." description="Explore market prices, commodity outlooks, forecasts, supply-demand balance, and waste risk." icon={BarChart3} capabilities={['Markets and commodities', 'Forecasts and supply-demand', 'Waste risk and regional signals']} /> }
