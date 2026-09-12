import { createFileRoute } from '@tanstack/react-router'
import { DecisionQueue } from '@/features/decisions'

export const Route = createFileRoute('/_app/decisions/')({ component: DecisionQueue })
