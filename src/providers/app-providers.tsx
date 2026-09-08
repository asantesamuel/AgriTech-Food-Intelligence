import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { AuthProvider } from '@/features/platform/auth/auth-context'

export function AppProviders({ children }: Readonly<{ children: ReactNode }>) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { retry: 1, staleTime: 30_000, refetchOnWindowFocus: false },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  )
}
