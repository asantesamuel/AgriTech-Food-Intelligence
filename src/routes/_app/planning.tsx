import { createFileRoute } from '@tanstack/react-router'
import { ScenarioLab } from '@/features/planning'

export const Route = createFileRoute('/_app/planning')({ component: ScenarioLab })
