import { describe, expect, it } from 'vitest'
import { readOnboardingPreferences, writeOnboardingPreferences } from './onboarding-storage'

describe('onboarding preferences', () => {
  it('persists validated preferences per organization', () => {
    const preferences = { organizationId: 'org-akwaaba', organizationType: 'processor' as const, commodityIds: ['commodity-maize'], regionIds: ['region-ashanti'], marketIds: ['market-kejetia'], goals: ['procurement' as const], completedAt: '2026-09-08T00:00:00Z' }
    writeOnboardingPreferences(localStorage, preferences)
    expect(readOnboardingPreferences(localStorage, 'org-akwaaba')).toEqual(preferences)
    expect(readOnboardingPreferences(localStorage, 'org-other')).toBeNull()
  })

  it('fails closed when persisted selections violate the domain schema', () => {
    localStorage.setItem('food-intelligence.onboarding.v1.org-invalid', JSON.stringify({ organizationId: 'org-invalid', commodityIds: [] }))
    expect(readOnboardingPreferences(localStorage, 'org-invalid')).toBeNull()
  })
})
