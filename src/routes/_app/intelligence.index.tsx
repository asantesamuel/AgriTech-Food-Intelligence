import { createFileRoute } from '@tanstack/react-router'
import { MarketPulse } from '@/features/intelligence'

export const Route = createFileRoute('/_app/intelligence/')({ component: MarketPulse })
