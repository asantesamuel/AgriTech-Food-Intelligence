import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { createDashboard, createPlatform } from '@/mocks/factories'
import { mockServer } from '@/mocks/server'
import { ApiError, dashboardService, platformService } from '@/services'

beforeAll(() => mockServer.listen({ onUnhandledRequest: 'error' }))
afterEach(() => mockServer.resetHandlers())
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
})
