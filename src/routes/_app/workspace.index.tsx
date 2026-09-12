import { createFileRoute } from '@tanstack/react-router'
import { WorkspaceOverview } from '@/features/workspace'

export const Route = createFileRoute('/_app/workspace/')({ component: WorkspaceOverview })
