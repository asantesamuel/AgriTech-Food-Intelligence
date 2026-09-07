import { createFileRoute } from '@tanstack/react-router'

import { appConfig } from '@/config/env'

export const Route = createFileRoute('/')({
  component: ArchitectureLanding,
})

function ArchitectureLanding() {
  return (
    <main className="foundation-page">
      <p className="foundation-page__eyebrow">Frontend foundation</p>
      <h1>{appConfig.name}</h1>
      <p>
        The application architecture is ready for feature delivery through typed
        domain, service, and route boundaries.
      </p>
    </main>
  )
}
