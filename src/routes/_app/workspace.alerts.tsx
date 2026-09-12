import { createFileRoute } from '@tanstack/react-router'
import { AlertsPage } from '@/features/workspace'

export const Route = createFileRoute('/_app/workspace/alerts')({ component: AlertsPage })
