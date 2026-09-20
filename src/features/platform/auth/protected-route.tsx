import { Navigate, useLocation } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { StatePanel } from '@/shared/ui'
import { useAuth } from './auth-context'
import { toProtectedPath } from './redirects'

export function ProtectedRoute({ children }: Readonly<{ children: ReactNode }>) {
  const { status, reload } = useAuth()
  const pathname = useLocation({ select: (location) => location.pathname })
  const requestedPath = typeof window === 'undefined' ? pathname : window.location.pathname
  const redirect = toProtectedPath(requestedPath)
  if (status === 'loading') return <main className="grid min-h-screen place-items-center p-6"><StatePanel kind="loading" title="Opening workspace" description="Restoring your local session." className="w-full max-w-xl" /></main>
  if (status === 'error') return <main className="grid min-h-screen place-items-center p-6"><StatePanel kind="error" title="Workspace unavailable" description="The mock identity service could not be loaded." action={{ label: 'Try again', onClick: reload }} className="w-full max-w-xl" /></main>
  if (status === 'signed-out') return <Navigate to="/sign-in" search={{ redirect }} />
  return children
}
