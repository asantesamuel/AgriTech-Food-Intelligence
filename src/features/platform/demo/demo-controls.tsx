import { RotateCcw, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useRef } from 'react'

import type { MockScenario } from '@/mocks/scenarios'
import { Badge, Button } from '@/shared/ui'
import { useAuth } from '../auth/auth-context'
import { useDemo } from './demo-context'

const scenarioCopy: Record<MockScenario, { label: string; description: string }> = {
  success: { label: 'Ready', description: 'Complete intelligence and decision data.' },
  empty: { label: 'No signals', description: 'No results for the active coverage.' },
  stale: { label: 'Stale data', description: 'Observations outside the freshness window.' },
  'low-confidence': { label: 'Low confidence', description: 'Reduced model confidence requires caution.' },
  partial: { label: 'Partial coverage', description: 'One or more intelligence sources are unavailable.' },
  'critical-risk': { label: 'Critical risk', description: 'Escalated tomato loss and price exposure.' },
  error: { label: 'Service error', description: 'Simulate an unavailable intelligence service.' },
}

export function DemoControls({ open, onClose }: Readonly<{ open: boolean; onClose: () => void }>) {
  const { organization, platform, role, switchOrganization, switchRole } = useAuth()
  const { reset, scenario, scenarios, setScenario } = useDemo()
  const panelRef = useRef<HTMLDivElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    previousFocus.current = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const panel = panelRef.current
    panel?.querySelector<HTMLElement>('button, select')?.focus()

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab' || !panel) return
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>('button:not([disabled]), select:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'))
      const first = focusable[0]
      const last = focusable.at(-1)
      if (!first || !last) return
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      previousFocus.current?.focus()
    }
  }, [onClose, open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <button className="absolute inset-0 bg-foreground/25 backdrop-blur-[2px]" aria-label="Close demo controls" onClick={onClose} />
      <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="demo-controls-title" className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l bg-card shadow-2xl">
        <header className="flex items-start justify-between border-b px-6 py-5">
          <div>
            <Badge tone="info"><SlidersHorizontal className="size-3.5" />Stakeholder demo</Badge>
            <h2 id="demo-controls-title" className="mt-3 text-xl font-semibold">Explore demo scenarios</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">Change simulated application conditions without changing customer filters.</p>
          </div>
          <Button variant="ghost" size="icon" aria-label="Close demo controls" onClick={onClose}><X /></Button>
        </header>

        <div className="grid flex-1 content-start gap-7 overflow-y-auto p-6">
          <section aria-labelledby="scenario-heading">
            <div className="flex items-center justify-between gap-3">
              <h3 id="scenario-heading" className="font-semibold">Application condition</h3>
              {scenario !== 'success' ? <Badge tone="warning">Scenario active</Badge> : null}
            </div>
            <div className="mt-3 grid gap-2">
              {scenarios.map((item) => (
                <button key={item} type="button" aria-pressed={scenario === item} onClick={() => setScenario(item)} className={`rounded-lg border p-3 text-left transition-colors ${scenario === item ? 'border-primary bg-accent' : 'border-border bg-card hover:border-primary/40'}`}>
                  <span className="block text-sm font-semibold">{scenarioCopy[item].label}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{scenarioCopy[item].description}</span>
                </button>
              ))}
            </div>
          </section>

          {platform && organization && role ? <section className="grid gap-4 border-t pt-6" aria-labelledby="persona-heading">
            <div><h3 id="persona-heading" className="font-semibold">Stakeholder perspective</h3><p className="mt-1 text-sm text-muted-foreground">Preview organization and role context. This is not production authorization.</p></div>
            <label className="grid gap-1.5 text-sm font-medium">Organization<select value={organization.id} onChange={(event) => switchOrganization(event.target.value)} className="h-11 rounded-md border border-input bg-card px-3 text-sm">{platform.organizations.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
            <label className="grid gap-1.5 text-sm font-medium">Persona<select value={role.id} onChange={(event) => switchRole(event.target.value)} className="h-11 rounded-md border border-input bg-card px-3 text-sm">{platform.roles.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
          </section> : null}
        </div>

        <footer className="border-t p-6"><Button variant="outline" className="w-full" onClick={reset}><RotateCcw />Reset demo</Button></footer>
      </div>
    </div>
  )
}
