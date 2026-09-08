import { delay, http, HttpResponse } from 'msw'
import { inviteMemberInputSchema, updateMemberInputSchema, updateOrganizationInputSchema } from '@/domain'
import { createCatalog, createDashboard, createPlatform } from './factories'
import { readMockLatency, readMockScenario } from './scenarios'

async function prepare(url: URL) {
  await delay(readMockLatency(url))
  return readMockScenario(url)
}

let platformState = createPlatform()
export function resetMockPlatformState() { platformState = createPlatform() }

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
    const commodityId = url.searchParams.get('commodityId')
    const regionId = url.searchParams.get('regionId')
    if (commodityId) {
      snapshot.prices = snapshot.prices.filter((item) => item.commodityId === commodityId)
      snapshot.forecasts = snapshot.forecasts.filter((item) => item.commodityId === commodityId)
      snapshot.risks = snapshot.risks.filter((item) => item.commodityId === commodityId)
      snapshot.alerts = snapshot.alerts.filter((item) => !item.commodityId || item.commodityId === commodityId)
    }
    if (regionId) {
      snapshot.risks = snapshot.risks.filter((item) => item.regionId === regionId)
      snapshot.alerts = snapshot.alerts.filter((item) => !item.regionId || item.regionId === regionId)
    }
    const horizon = url.searchParams.get('horizon')
    const horizonDays = horizon === '7d' ? 7 : horizon === '90d' ? 90 : 30
    snapshot.forecasts = snapshot.forecasts.map((forecast) => ({ ...forecast, horizonDays }))
    return HttpResponse.json(snapshot)
  }),
]
