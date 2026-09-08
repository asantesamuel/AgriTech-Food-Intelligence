import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowRight, Building2, ShieldCheck } from 'lucide-react'
import { z } from 'zod'

import { useAuth } from '@/features/platform/auth/auth-context'
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, StatePanel } from '@/shared/ui'

const protectedPathSchema = z.enum(['/', '/intelligence', '/decisions', '/planning', '/workspace', '/onboarding'])

export const Route = createFileRoute('/sign-in')({
  validateSearch: (search) => ({ redirect: protectedPathSchema.catch('/').parse(search.redirect) }),
  component: SignInPage,
})

function SignInPage() {
  const { platform, signIn, status, reload } = useAuth()
  const { redirect } = Route.useSearch()
  const navigate = useNavigate()

  if (status === 'loading') return <main className="grid min-h-screen place-items-center p-6"><StatePanel kind="loading" title="Loading demo identities" description="Preparing organization and persona options." className="w-full max-w-xl" /></main>
  if (status === 'error' || !platform) return <main className="grid min-h-screen place-items-center p-6"><StatePanel kind="error" title="Demo sign-in unavailable" description="The mock identity service could not be loaded." action={{ label: 'Try again', onClick: reload }} className="w-full max-w-xl" /></main>

  function enterWorkspace(userId: string) {
    signIn(userId)
    void navigate({ to: redirect })
  }

  return (
    <main className="surface-grid min-h-screen px-5 py-10 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <section className="py-6">
          <Badge tone="success">Secure prototype</Badge>
          <h1 className="mt-5 text-balance text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">Enter an intelligence workspace.</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">Choose a demonstration persona. Sessions are stored only in this browser and can be replaced by a production identity provider later.</p>
          <div className="mt-8 grid gap-3 text-sm text-muted-foreground"><p className="flex items-center gap-2"><ShieldCheck className="size-4 text-primary" aria-hidden />Protected application routes</p><p className="flex items-center gap-2"><Building2 className="size-4 text-primary" aria-hidden />Organization and role context</p></div>
        </section>
        <section className="grid gap-3" aria-label="Demo identities">
          {platform.users.filter((user) => user.status === 'active').map((user) => {
            const organization = platform.organizations.find((item) => item.id === user.organizationId)
            const role = platform.roles.find((item) => item.id === user.roleIds[0])
            return (
              <Card key={user.id} className="transition-colors hover:border-primary/50">
                <CardHeader><div className="flex items-start justify-between gap-3"><div><CardTitle>{user.name}</CardTitle><CardDescription>{user.title}</CardDescription></div><Badge>{role?.persona.replaceAll('-', ' ')}</Badge></div></CardHeader>
                <CardContent className="flex items-center justify-between gap-4"><p className="text-sm text-muted-foreground">{organization?.name}</p><Button onClick={() => enterWorkspace(user.id)}>Continue <ArrowRight /></Button></CardContent>
              </Card>
            )
          })}
        </section>
      </div>
    </main>
  )
}
