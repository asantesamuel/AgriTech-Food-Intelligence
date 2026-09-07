import { createFileRoute } from '@tanstack/react-router'
import { AppShell } from '@/features/platform'
import { ProtectedRoute } from '@/features/platform/auth/protected-route'
import { StatePanel } from '@/shared/ui'

export const Route = createFileRoute('/_app')({
  component: () => <ProtectedRoute><AppShell /></ProtectedRoute>,
  pendingComponent: () => <div className="p-6"><StatePanel kind="loading" title="Loading workspace" description="Preparing your intelligence environment." /></div>,
})
