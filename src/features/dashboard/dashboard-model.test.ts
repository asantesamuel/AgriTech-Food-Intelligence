import { describe, expect, it } from 'vitest'
import { createCatalog, createDashboard } from '@/mocks/factories'
import { defaultDashboardFilters, namePriceMovers } from './dashboard-model'

describe('dashboard model', () => {
  it('resolves labels and sorts movers by absolute change', () => {
    const result = namePriceMovers(createDashboard(), createCatalog())
    expect(result[0]?.commodityName).not.toBe('Unknown commodity')
    expect(Math.abs(result[0]?.changePercent ?? 0)).toBeGreaterThanOrEqual(Math.abs(result.at(-1)?.changePercent ?? 0))
  })

  it('uses the first onboarding commodity and region', () => {
    const storage = { getItem: () => JSON.stringify({ commodityIds: ['commodity-tomato'], regionIds: ['region-greater-accra'] }) }
    expect(defaultDashboardFilters(storage, 'org-akwaaba-foods')).toEqual({ commodityId: 'commodity-tomato', regionId: 'region-greater-accra', horizon: '30d' })
  })

  it('fails closed when onboarding storage is malformed', () => {
    expect(defaultDashboardFilters({ getItem: () => '{bad' }, 'org')).toEqual({ commodityId: 'commodity-tomato', regionId: 'region-greater-accra', horizon: '30d' })
  })
})
