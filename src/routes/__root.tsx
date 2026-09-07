import type { ReactNode } from 'react'
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'

import appStyles from '@/styles/app.css?url'
import { StatePanel } from '@/shared/ui'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        title: 'Food Intelligence',
      },
      {
        name: 'description',
        content: 'Decision intelligence for resilient food systems.',
      },
    ],
    links: [{ rel: 'stylesheet', href: appStyles }],
  }),
  notFoundComponent: NotFoundPage,
  component: RootComponent,
})

function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center p-6">
      <StatePanel
        kind="empty"
        title="Intelligence view unavailable"
        description="This route has not been added to the current product scope."
        className="w-full max-w-xl"
      />
    </main>
  )
}

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
