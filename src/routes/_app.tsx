import { createFileRoute } from '@tanstack/react-router'
import { AppShell } from '@/features/platform'
import { StatePanel } from '@/shared/ui'

export const Route = createFileRoute('/_app')({
  component: AppShell,
  pendingComponent: () => <div className="p-6"><StatePanel kind="loading" title="Loading workspace" description="Preparing your intelligence environment." /></div>,
})
