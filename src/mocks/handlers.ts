import { delay, http, HttpResponse } from 'msw'
import { decisionSchema, decisionTransitionInputSchema, inviteMemberInputSchema, updateMemberInputSchema, updateOrganizationInputSchema } from '@/domain'
import { createCatalog, createCommodityIntelligence, createDashboard, createDecisions, createMarketPulse, createPlatform } from './factories'
import { readMockLatency, readMockScenario } from './scenarios'

async function prepare(url: URL) {
  await delay(readMockLatency(url))
  return readMockScenario(url)
}

let platformState = createPlatform()
let decisionState = createDecisions()
export function resetMockPlatformState() { platformState = createPlatform(); decisionState = createDecisions() }

export const handlers = [
  http.get('*/api/catalog', async ({ request }) => {
    const url = new URL(request.url)
    const scenario = await prepare(url)
    if (scenario === 'error') return HttpResponse.json({ message: 'Mock catalog unavailable' }, { status: 503 })
    const catalog = createCatalog()
    return HttpResponse.json(scenario === 'empty' ? { regions: [], markets: [], commodities: [] } : catalog)
  }),
  http.get('*/api/platform', async ({ request }) => {
    const url = new URL(request.url)
    const scenario = await prepare(url)
    if (scenario === 'error') return HttpResponse.json({ message: 'Mock platform unavailable' }, { status: 503 })
    return HttpResponse.json(platformState)
  }),
  http.post('*/api/platform/invitations', async ({ request }) => {
    const scenario = await prepare(new URL(request.url))
    if (scenario === 'error') return HttpResponse.json({ message: 'Mock invitation unavailable' }, { status: 503 })
    const parsed = inviteMemberInputSchema.safeParse(await request.json())
    if (!parsed.success) return HttpResponse.json({ message: 'Invalid invitation' }, { status: 400 })
    const duplicate = platformState.users.some((user) => user.email === parsed.data.email) || platformState.invitations.some((invitation) => invitation.email === parsed.data.email && invitation.status === 'pending')
    if (duplicate) return HttpResponse.json({ message: 'Member or invitation already exists' }, { status: 409 })
    const invitation = { id: `invite-${platformState.invitations.length + 1}`, ...parsed.data, status: 'pending' as const, invitedAt: '2026-09-08T09:00:00+00:00' }
    platformState.invitations = [...platformState.invitations, invitation]
    return HttpResponse.json(invitation, { status: 201 })
  }),
  http.patch('*/api/platform/users/:userId', async ({ request, params }) => {
    const scenario = await prepare(new URL(request.url))
    if (scenario === 'error') return HttpResponse.json({ message: 'Mock member update unavailable' }, { status: 503 })
    const parsed = updateMemberInputSchema.safeParse(await request.json())
    const index = platformState.users.findIndex((user) => user.id === params.userId)
    if (!parsed.success) return HttpResponse.json({ message: 'Invalid member update' }, { status: 400 })
    if (index < 0) return HttpResponse.json({ message: 'Member not found' }, { status: 404 })
    const current = platformState.users[index]!
    const updated = { ...current, status: parsed.data.status ?? current.status, roleIds: parsed.data.roleId ? [parsed.data.roleId] : current.roleIds }
    platformState.users = platformState.users.map((user, userIndex) => userIndex === index ? updated : user)
    return HttpResponse.json(updated)
  }),
  http.delete('*/api/platform/users/:userId', async ({ request, params }) => {
    const scenario = await prepare(new URL(request.url))
    if (scenario === 'error') return HttpResponse.json({ message: 'Mock member removal unavailable' }, { status: 503 })
    const index = platformState.users.findIndex((user) => user.id === params.userId)
    if (index < 0) return HttpResponse.json({ message: 'Member not found' }, { status: 404 })
    const [removed] = platformState.users.splice(index, 1)
    return HttpResponse.json({ id: removed!.id })
  }),
  http.patch('*/api/platform/organizations/:organizationId', async ({ request, params }) => {
    const scenario = await prepare(new URL(request.url))
    if (scenario === 'error') return HttpResponse.json({ message: 'Mock workspace update unavailable' }, { status: 503 })
    const parsed = updateOrganizationInputSchema.safeParse(await request.json())
    const index = platformState.organizations.findIndex((organization) => organization.id === params.organizationId)
    if (!parsed.success) return HttpResponse.json({ message: 'Invalid workspace settings' }, { status: 400 })
    if (index < 0) return HttpResponse.json({ message: 'Organization not found' }, { status: 404 })
    const updated = { ...platformState.organizations[index]!, ...parsed.data }
    platformState.organizations = platformState.organizations.map((organization, organizationIndex) => organizationIndex === index ? updated : organization)
    if (platformState.organization.id === updated.id) platformState.organization = updated
    return HttpResponse.json(updated)
  }),
  http.get('*/api/dashboard', async ({ request }) => {
    const url = new URL(request.url)
    const scenario = await prepare(url)
    if (scenario === 'error') return HttpResponse.json({ message: 'Mock intelligence unavailable' }, { status: 503 })
    const snapshot = createDashboard(scenario)
    const catalog = createCatalog()
    const commodityId = url.searchParams.get('commodityId')
    const regionId = url.searchParams.get('regionId')
    if (commodityId) {
      snapshot.prices = snapshot.prices.filter((item) => item.commodityId === commodityId)
      snapshot.forecasts = snapshot.forecasts.filter((item) => item.commodityId === commodityId)
      snapshot.risks = snapshot.risks.filter((item) => item.commodityId === commodityId)
      snapshot.alerts = snapshot.alerts.filter((item) => !item.commodityId || item.commodityId === commodityId)
      snapshot.recommendations = snapshot.recommendations.filter((item) => !item.commodityId || item.commodityId === commodityId)
    }
    if (regionId) {
      const marketIds = new Set(catalog.markets.filter((item) => item.location.regionId === regionId).map((item) => item.id))
      snapshot.prices = snapshot.prices.filter((item) => marketIds.has(item.marketId))
      snapshot.forecasts = snapshot.forecasts.filter((item) => marketIds.has(item.marketId))
      snapshot.risks = snapshot.risks.filter((item) => item.regionId === regionId)
      snapshot.alerts = snapshot.alerts.filter((item) => !item.regionId || item.regionId === regionId)
      snapshot.recommendations = snapshot.recommendations.filter((item) => item.regionIds.length === 0 || item.regionIds.includes(regionId))
    }
    const horizon = url.searchParams.get('horizon')
    const horizonDays = horizon === '7d' ? 7 : horizon === '90d' ? 90 : 30
    snapshot.forecasts = snapshot.forecasts.map((forecast) => ({ ...forecast, horizonDays, points: horizonDays === 7 ? forecast.points.slice(0, 1) : horizonDays === 30 ? forecast.points.slice(0, 3) : forecast.points }))
    const riskValue = snapshot.risks.reduce((total, item) => total + item.valueAtRisk.amount, 0)
    const wasteVolume = snapshot.risks.reduce((total, item) => total + item.volumeAtRisk, 0)
    snapshot.kpis = snapshot.kpis.map((kpi) => kpi.id === 'kpi-markets' ? { ...kpi, value: new Set(snapshot.prices.map((item) => item.marketId)).size, displayValue: String(new Set(snapshot.prices.map((item) => item.marketId)).size) } : kpi.id === 'kpi-risk' ? { ...kpi, value: riskValue, displayValue: `GHS ${(riskValue / 1_000).toFixed(0)}k` } : kpi.id === 'kpi-opportunity' ? { ...kpi, value: wasteVolume, displayValue: `${wasteVolume} t` } : kpi)
    return HttpResponse.json(snapshot)
  }),
  http.get('*/api/intelligence/market-pulse', async ({ request }) => {
    const url = new URL(request.url)
    const scenario = await prepare(url)
    if (scenario === 'error') return HttpResponse.json({ message: 'Market pulse unavailable' }, { status: 503 })
    return HttpResponse.json(createMarketPulse(scenario))
  }),
  http.get('*/api/intelligence/commodities/:commodityId', async ({ request, params }) => {
    const url = new URL(request.url)
    const scenario = await prepare(url)
    if (scenario === 'error') return HttpResponse.json({ message: 'Commodity intelligence unavailable' }, { status: 503 })
    return HttpResponse.json(createCommodityIntelligence(String(params.commodityId), scenario))
  }),
  http.get('*/api/decisions', async ({ request }) => {
    const scenario = await prepare(new URL(request.url))
    if (scenario === 'error') return HttpResponse.json({ message: 'Decision queue unavailable' }, { status: 503 })
    return HttpResponse.json(scenario === 'empty' ? { ...decisionState, decisions: [] } : decisionState)
  }),
  http.get('*/api/decisions/:decisionId', async ({ request, params }) => {
    const scenario = await prepare(new URL(request.url))
    if (scenario === 'error') return HttpResponse.json({ message: 'Decision unavailable' }, { status: 503 })
    const decision = decisionState.decisions.find((item) => item.id === params.decisionId)
    return decision ? HttpResponse.json(decision) : HttpResponse.json({ message: 'Decision not found' }, { status: 404 })
  }),
  http.patch('*/api/decisions/:decisionId', async ({ request, params }) => {
    const scenario = await prepare(new URL(request.url))
    if (scenario === 'error') return HttpResponse.json({ message: 'Decision update unavailable' }, { status: 503 })
    const parsed = decisionTransitionInputSchema.safeParse(await request.json())
    if (!parsed.success) return HttpResponse.json({ message: 'Invalid decision transition' }, { status: 400 })
    const index = decisionState.decisions.findIndex((item) => item.id === params.decisionId)
    if (index < 0) return HttpResponse.json({ message: 'Decision not found' }, { status: 404 })
    const current = decisionState.decisions[index]!
    const actor = platformState.users.find((item) => item.id === parsed.data.actorId)
    if (!actor || actor.organizationId !== current.organizationId || parsed.data.organizationId !== current.organizationId) return HttpResponse.json({ message: 'Decision access denied' }, { status: 403 })
    const allowed: Record<typeof current.status, readonly typeof current.status[]> = {
      recommended: ['assigned', 'modified', 'accepted', 'dismissed'], assigned: ['modified', 'accepted', 'dismissed'], modified: ['assigned', 'accepted', 'dismissed'], accepted: ['assigned', 'approved'], approved: ['in-progress'], 'in-progress': ['completed'], dismissed: [], completed: [],
    }
    if (!allowed[current.status].includes(parsed.data.status)) return HttpResponse.json({ message: `Cannot move from ${current.status} to ${parsed.data.status}` }, { status: 409 })
    if (parsed.data.status === 'assigned' && !parsed.data.ownerId) return HttpResponse.json({ message: 'Assigned decisions require an owner' }, { status: 400 })
    if (parsed.data.ownerId && !platformState.users.some((item) => item.id === parsed.data.ownerId && item.organizationId === current.organizationId)) return HttpResponse.json({ message: 'Decision owner is outside this workspace' }, { status: 400 })
    if (parsed.data.status === 'completed' && !parsed.data.actualFinancialValueProtected) return HttpResponse.json({ message: 'Completed decisions require measured financial value protected' }, { status: 400 })
    const at = '2026-09-07T13:00:00+00:00'
    const updated = decisionSchema.parse({ ...current, status: parsed.data.status, ownerId: parsed.data.ownerId ?? current.ownerId, purchaseTiming: parsed.data.purchaseTiming ?? current.purchaseTiming, notes: parsed.data.notes ?? current.notes, impact: parsed.data.actualFinancialValueProtected ? { ...current.impact, actualFinancialValueProtected: parsed.data.actualFinancialValueProtected, measuredAt: at, notes: parsed.data.notes } : current.impact, history: [...current.history, { id: `history-${current.history.length + 1}`, status: parsed.data.status, actorId: parsed.data.actorId, at, notes: parsed.data.notes }], updatedAt: at })
    decisionState = { ...decisionState, decisions: decisionState.decisions.map((item, itemIndex) => itemIndex === index ? updated : item) }
    return HttpResponse.json(updated)
  }),
]
