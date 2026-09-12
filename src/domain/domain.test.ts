import { describe, expect, it } from 'vitest'
import { confidenceSchema, decisionImpactSchema, forecastPointSchema, locationSchema, moneySchema, purchaseTimingSchema, userSchema } from '@/domain'

describe('domain validation contracts', () => {
  it('accepts standardized money, confidence, and location values', () => {
    expect(moneySchema.parse({ amount: 42.5, currency: 'GHS' })).toEqual({ amount: 42.5, currency: 'GHS' })
    expect(confidenceSchema.parse({ score: 0.87, band: 'high' }).band).toBe('high')
    expect(locationSchema.parse({ regionId: 'region-greater-accra', point: { latitude: 5.6037, longitude: -0.187 } }).point?.latitude).toBe(5.6037)
  })

  it('rejects invalid external boundary values', () => {
    expect(() => confidenceSchema.parse({ score: 1.2, band: 'high' })).toThrow()
    expect(() => userSchema.parse({ id: 'user-001', organizationId: 'org-001', name: 'Ama Mensah', email: 'not-an-email', title: 'Analyst', status: 'active', roleIds: ['role-analyst'] })).toThrow()
  })

  it('requires forecast values to remain inside confidence intervals', () => {
    expect(() => forecastPointSchema.parse({ date: '2026-09-08', value: 12, lowerBound: 14, upperBound: 18 })).toThrow('Forecast value must be inside its interval')
  })

  it('validates purchase windows and measured financial impact', () => {
    expect(() => purchaseTimingSchema.parse({ windowStart: '2026-09-14', windowEnd: '2026-09-08', quantity: 80, unit: 'tonne', sourceMarketId: 'market-kejetia', destinationMarketId: 'market-agbogbloshie', targetUnitPrice: { amount: 9.4, currency: 'GHS' } })).toThrow('Purchase window must end on or after it starts')
    expect(() => decisionImpactSchema.parse({ expectedFinancialValueProtected: { amount: 684000, currency: 'GHS' }, actualFinancialValueProtected: { amount: 650000, currency: 'GHS' } })).toThrow('Measured outcomes require a measurement time')
  })
})
