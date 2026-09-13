import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { createCommodityExplorer, createDashboard, createPlatform } from '@/mocks/factories'
import { resetMockPlatformState } from '@/mocks/handlers'
import { mockServer } from '@/mocks/server'
import { ApiError, dashboardService, decisionService, intelligenceService, platformService } from '@/services'

beforeAll(() => mockServer.listen({ onUnhandledRequest: 'error' }))
afterEach(() => { mockServer.resetHandlers(); resetMockPlatformState() })
afterAll(() => mockServer.close())

describe('mock data and service boundary', () => {
  it('is deterministic for the same seed', () => {
    expect(createDashboard('success', 17)).toEqual(createDashboard('success', 17))
    expect(createPlatform(17)).toEqual(createPlatform(17))
  })

  it('intercepts service requests and returns validated scenario data', async () => {
    const snapshot = await dashboardService.getSnapshot({}, { scenario: 'critical-risk', latencyMs: 0 })
    expect(snapshot.state).toBe('critical-risk')
    expect(snapshot.risks[0]?.severity).toBe('critical')
    expect((await platformService.getPlatform({ latencyMs: 0 })).organization.name).toBe('Akwaaba Foods Group')
  })

  it('represents empty, stale, low-confidence, and partial states', () => {
    expect(createDashboard('empty').kpis).toHaveLength(0)
    expect(createDashboard('stale').freshness.status).toBe('stale')
    expect(createDashboard('low-confidence').forecasts[0]?.confidence.band).toBe('low')
    expect(createDashboard('partial').unavailableSections).toContain('supply-demand')
  })

  it('surfaces configured service failures', async () => {
    await expect(dashboardService.getSnapshot({}, { scenario: 'error', latencyMs: 0 })).rejects.toBeInstanceOf(ApiError)
  })

  it('applies onboarding-aligned commodity and region filters', async () => {
    const snapshot = await dashboardService.getSnapshot({ commodityId: 'commodity-tomato', regionId: 'region-greater-accra' }, { latencyMs: 0 })
    expect(snapshot.risks.every((risk) => risk.commodityId === 'commodity-tomato' && risk.regionId === 'region-greater-accra')).toBe(true)
    expect(snapshot.prices.every((price) => price.commodityId === 'commodity-tomato')).toBe(true)
  })

  it('applies the selected forecast horizon', async () => {
    const snapshot = await dashboardService.getSnapshot({ horizon: '90d' }, { latencyMs: 0 })
    expect(snapshot.forecasts.every((forecast) => forecast.horizonDays === 90)).toBe(true)
  })

  it('supports mock organization administration mutations', async () => {
    const initial = await platformService.getPlatform({ latencyMs: 0 })
    const member = initial.users.find((user) => user.name === 'Kwame Owusu')!
    const invitation = await platformService.inviteMember({ organizationId: initial.organization.id, email: 'new.member@example.test', roleId: 'role-analyst' }, { latencyMs: 0 })
    expect(invitation.status).toBe('pending')
    expect((await platformService.updateMember(member.id, { status: 'inactive' }, { latencyMs: 0 })).status).toBe('inactive')
    expect((await platformService.updateOrganization(initial.organization.id, { name: 'Akwaaba Intelligence Foods', industry: initial.organization.industry, regionIds: initial.organization.regionIds }, { latencyMs: 0 })).name).toBe('Akwaaba Intelligence Foods')
    await platformService.removeMember(member.id, { latencyMs: 0 })
    expect((await platformService.getPlatform({ latencyMs: 0 })).users.some((user) => user.id === member.id)).toBe(false)
  })

  it('serves linked tomato intelligence through replaceable service contracts', async () => {
    const pulse = await intelligenceService.getMarketPulse({ latencyMs: 0 })
    const tomato = await intelligenceService.getCommodityIntelligence('commodity-tomato', { latencyMs: 0 })
    expect(pulse.signals[0]?.decisionId).toBe('decision-tomato-purchase')
    expect(tomato.commodity.id).toBe('commodity-tomato')
    expect(tomato.forecast?.confidence.band).toBe('high')
  })

  it('serves a ranked, paginated commodity explorer through the service boundary', async () => {
    const snapshot = await intelligenceService.getCommodityExplorer({ pageSize: 10 }, { latencyMs: 0 })
    expect(snapshot.items[0]?.commodity.id).toBe('commodity-tomato')
    expect(snapshot.items).toHaveLength(10)
    expect(snapshot.pageInfo).toMatchObject({ page: 1, pageSize: 10, totalItems: 12, totalPages: 2 })
  })

  it('combines commodity explorer filters and supports alias search', async () => {
    const aliasMatch = await intelligenceService.getCommodityExplorer({ q: 'MANIOC' }, { latencyMs: 0 })
    expect(aliasMatch.items.map((item) => item.commodity.id)).toEqual(['commodity-cassava'])

    const filtered = await intelligenceService.getCommodityExplorer({ category: 'vegetable', region: 'region-greater-accra', direction: 'rising', risk: 'high' }, { latencyMs: 0 })
    expect(filtered.items.every((item) => item.commodity.category === 'vegetable' && item.referenceRegionId === 'region-greater-accra' && item.direction === 'rising' && item.riskSummary?.severity === 'high')).toBe(true)
  })

  it('keeps explorer scenarios explicit and deterministic', () => {
    expect(createCommodityExplorer({}, 'success', 17)).toEqual(createCommodityExplorer({}, 'success', 17))
    expect(createCommodityExplorer({}, 'empty').items).toHaveLength(0)
    expect(createCommodityExplorer({}, 'stale').items.every((item) => item.currentPrice.freshness.status === 'stale')).toBe(true)
    expect(createCommodityExplorer({}, 'low-confidence').items.every((item) => item.forecastSummary?.confidence.band === 'low')).toBe(true)
    expect(createCommodityExplorer({}, 'partial').items.some((item) => !item.forecastSummary || !item.riskSummary)).toBe(true)
  })

  it('enforces and records the complete decision lifecycle', async () => {
    const decisionId = 'decision-tomato-purchase'
    const base = { actorId: 'user-kwame-owusu', organizationId: 'org-akwaaba-foods' }
    await decisionService.transition(decisionId, { ...base, status: 'accepted', notes: 'Purchase timing accepted.' }, { latencyMs: 0 })
    await decisionService.transition(decisionId, { ...base, status: 'approved', notes: 'Procurement approval recorded.' }, { latencyMs: 0 })
    await decisionService.transition(decisionId, { ...base, status: 'in-progress', notes: 'Supplier engagement started.' }, { latencyMs: 0 })
    const completed = await decisionService.transition(decisionId, { ...base, status: 'completed', notes: 'Purchase completed and outcome measured.', actualFinancialValueProtected: { amount: 641000, currency: 'GHS' } }, { latencyMs: 0 })
    expect(completed.status).toBe('completed')
    expect(completed.impact.actualFinancialValueProtected?.amount).toBe(641000)
    expect(completed.history.map((entry) => entry.status)).toEqual(['recommended', 'accepted', 'approved', 'in-progress', 'completed'])
  })

  it('rejects invalid decision state transitions', async () => {
    await expect(decisionService.transition('decision-tomato-purchase', { actorId: 'user-kwame-owusu', organizationId: 'org-akwaaba-foods', status: 'completed', actualFinancialValueProtected: { amount: 100, currency: 'GHS' } }, { latencyMs: 0 })).rejects.toMatchObject({ status: 409 })
  })
})
