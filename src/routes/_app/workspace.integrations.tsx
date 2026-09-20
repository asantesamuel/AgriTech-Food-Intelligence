import { createFileRoute } from '@tanstack/react-router'
import { IntegrationsPage } from '@/features/workspace'

export const Route = createFileRoute('/_app/workspace/integrations')({ component: IntegrationsPage })
