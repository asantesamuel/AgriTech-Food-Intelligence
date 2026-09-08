import { useNavigate } from '@tanstack/react-router'
import { Building2, Check, ChevronLeft, ChevronRight, MapPinned, Target, Wheat } from 'lucide-react'
import { useEffect, useState } from 'react'

import type { CatalogSnapshot, OrganizationType, WorkspaceGoal } from '@/domain'
import { catalogService } from '@/services'
import { cn } from '@/shared/lib/cn'
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, StatePanel } from '@/shared/ui'
import { useAuth } from '../auth/auth-context'
import { readOnboardingPreferences, writeOnboardingPreferences } from './onboarding-storage'

const organizationTypes: Array<{ id: OrganizationType; label: string; description: string }> = [
  { id: 'processor', label: 'Food processor', description: 'Secure raw material and plan capacity.' },
  { id: 'wholesaler', label: 'Wholesaler / aggregator', description: 'Coordinate volume across markets.' },
  { id: 'retailer', label: 'Supermarket / retail', description: 'Monitor price and availability.' },
  { id: 'logistics', label: 'Logistics / cold chain', description: 'Plan movement and storage.' },
  { id: 'government', label: 'Government / food security', description: 'Track system-level pressure.' },
  { id: 'investor', label: 'Infrastructure investor', description: 'Identify capacity gaps.' },
  { id: 'development', label: 'Development organization', description: 'Target resilient interventions.' },
]

const goals: Array<{ id: WorkspaceGoal; label: string }> = [
  { id: 'procurement', label: 'Improve procurement' }, { id: 'waste-reduction', label: 'Reduce food waste' },
  { id: 'market-monitoring', label: 'Monitor markets' }, { id: 'logistics', label: 'Optimize logistics' },
  { id: 'strategic-planning', label: 'Strategic planning' },
]

export function OnboardingFlow() {
  const { organization } = useAuth()
  const navigate = useNavigate()
  const [catalog, setCatalog] = useState<CatalogSnapshot | null>(null)
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [step, setStep] = useState(0)
  const [organizationType, setOrganizationType] = useState<OrganizationType | null>(null)
  const [commodityIds, setCommodityIds] = useState<string[]>([])
  const [regionIds, setRegionIds] = useState<string[]>([])
  const [marketIds, setMarketIds] = useState<string[]>([])
  const [selectedGoals, setSelectedGoals] = useState<WorkspaceGoal[]>([])
  const [validationMessage, setValidationMessage] = useState('')

  useEffect(() => {
    if (!organization) return
    const organizationId = organization.id
    const saved = readOnboardingPreferences(window.localStorage, organizationId)
    if (saved) {
      setOrganizationType(saved.organizationType); setCommodityIds(saved.commodityIds); setRegionIds(saved.regionIds); setMarketIds(saved.marketIds); setSelectedGoals(saved.goals)
    }
    catalogService.getCatalog().then((data) => { setCatalog(data); setLoadState('ready') }).catch(() => setLoadState('error'))
  }, [organization])

  if (!organization || loadState === 'loading') return <StatePanel kind="loading" title="Preparing workspace setup" description="Loading available commodities, regions, and markets." />
  if (loadState === 'error' || !catalog) return <StatePanel kind="error" title="Setup data unavailable" description="The mock catalog could not be loaded. Refresh to try again." />

  const activeOrganizationId = organization.id
  const valid = [Boolean(organizationType), commodityIds.length > 0, regionIds.length > 0, selectedGoals.length > 0][step]
  const stepNames = ['Organization', 'Commodities', 'Coverage', 'Objectives']

  function next() {
    if (!valid) { setValidationMessage('Select at least one option to continue.'); return }
    setValidationMessage('')
    if (step < 3) { setStep((current) => current + 1); return }
    writeOnboardingPreferences(window.localStorage, { organizationId: activeOrganizationId, organizationType: organizationType!, commodityIds, regionIds, marketIds, goals: selectedGoals, completedAt: new Date().toISOString() })
    void navigate({ to: '/' })
  }

  return (
    <div className="surface-grid min-h-[calc(100vh-4rem)] px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-5xl gap-7">
        <header className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end"><div><Badge tone="info">Workspace setup</Badge><h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">Shape your intelligence lens.</h1><p className="mt-3 max-w-2xl text-muted-foreground">Configure what matters to {organization.name}. You can revise these prototype preferences at any time.</p></div><p className="font-mono text-sm text-muted-foreground">{step + 1} / {stepNames.length}</p></header>
        <ol className="grid grid-cols-4 gap-2" aria-label="Onboarding progress">{stepNames.map((name, index) => <li key={name} className={cn('border-t-2 pt-2 text-xs text-muted-foreground', index <= step && 'border-primary text-foreground')} aria-current={index === step ? 'step' : undefined}>{name}</li>)}</ol>
        <Card>
          <CardHeader><StepHeading step={step} /></CardHeader>
          <CardContent>
            {step === 0 ? <ChoiceGrid options={organizationTypes} selected={organizationType ? [organizationType] : []} onToggle={(value) => setOrganizationType(value as OrganizationType)} /> : null}
            {step === 1 ? <ChoiceGrid options={catalog.commodities.map((item) => ({ id: item.id, label: item.name, description: `${item.category} · ${item.defaultUnit}` }))} selected={commodityIds} onToggle={(value) => setCommodityIds(toggle(commodityIds, value))} multiple /> : null}
            {step === 2 ? <div className="grid gap-6"><div><h3 className="mb-3 text-sm font-semibold">Regions</h3><ChoiceGrid options={catalog.regions.map((item) => ({ id: item.id, label: item.name, description: 'Regional intelligence coverage' }))} selected={regionIds} onToggle={(value) => setRegionIds(toggle(regionIds, value))} multiple /></div><div><h3 className="mb-3 text-sm font-semibold">Priority markets <span className="font-normal text-muted-foreground">(optional)</span></h3><ChoiceGrid options={catalog.markets.map((item) => ({ id: item.id, label: item.name, description: item.location.district ?? 'Ghana' }))} selected={marketIds} onToggle={(value) => setMarketIds(toggle(marketIds, value))} multiple /></div></div> : null}
            {step === 3 ? <ChoiceGrid options={goals.map((item) => ({ ...item, description: 'Personalize dashboard signals and recommendations.' }))} selected={selectedGoals} onToggle={(value) => setSelectedGoals(toggle(selectedGoals, value as WorkspaceGoal))} multiple /> : null}
            {validationMessage ? <p className="mt-5 text-sm text-danger" role="alert">{validationMessage}</p> : null}
          </CardContent>
        </Card>
        <div className="flex justify-between"><Button variant="ghost" disabled={step === 0} onClick={() => { setStep((current) => Math.max(0, current - 1)); setValidationMessage('') }}><ChevronLeft />Back</Button><Button onClick={next}>{step === 3 ? 'Complete setup' : 'Continue'}{step === 3 ? <Check /> : <ChevronRight />}</Button></div>
      </div>
    </div>
  )
}

function StepHeading({ step }: Readonly<{ step: number }>) {
  const content = [
    { icon: Building2, title: 'What kind of organization are you?', description: 'This tunes language and decision priorities.' },
    { icon: Wheat, title: 'Which commodities matter most?', description: 'Choose one or more focus commodities.' },
    { icon: MapPinned, title: 'Where do you operate?', description: 'Select regions and optional priority markets.' },
    { icon: Target, title: 'What are your primary objectives?', description: 'These goals shape dashboard emphasis.' },
  ][step]!
  const Icon = content.icon
  return <div className="flex gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="size-5" aria-hidden /></span><div><CardTitle>{content.title}</CardTitle><CardDescription>{content.description}</CardDescription></div></div>
}

function ChoiceGrid({ options, selected, onToggle, multiple }: Readonly<{ options: Array<{ id: string; label: string; description: string }>; selected: string[]; onToggle: (value: string) => void; multiple?: boolean }>) {
  return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{options.map((option) => { const active = selected.includes(option.id); return <button key={option.id} type="button" aria-pressed={active} onClick={() => onToggle(option.id)} className={cn('rounded-lg border p-4 text-left transition-colors hover:border-primary/50 hover:bg-accent/40', active && 'border-primary bg-primary/10')}><span className="flex items-center justify-between gap-3 font-semibold">{option.label}{active ? <Check className="size-4 text-primary" aria-hidden /> : null}</span><span className="mt-1 block text-xs leading-5 text-muted-foreground">{option.description}</span><span className="sr-only">{multiple ? 'Toggle selection' : 'Select one'}</span></button> })}</div>
}

function toggle<T extends string>(items: T[], value: T) { return items.includes(value) ? items.filter((item) => item !== value) : [...items, value] }
