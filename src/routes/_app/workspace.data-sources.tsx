import { createFileRoute } from '@tanstack/react-router'
import { DataSourcesPage } from '@/features/workspace'

export const Route = createFileRoute('/_app/workspace/data-sources')({ component: DataSourcesPage })
