import { onboardingPreferencesSchema, type OnboardingPreferences } from '@/domain'

const keyFor = (organizationId: string) => `food-intelligence.onboarding.v1.${organizationId}`

export function readOnboardingPreferences(storage: Pick<Storage, 'getItem'>, organizationId: string) {
  try {
    const value = storage.getItem(keyFor(organizationId))
    return value ? onboardingPreferencesSchema.parse(JSON.parse(value)) : null
  } catch {
    return null
  }
}

export function writeOnboardingPreferences(storage: Pick<Storage, 'setItem'>, preferences: OnboardingPreferences) {
  storage.setItem(keyFor(preferences.organizationId), JSON.stringify(onboardingPreferencesSchema.parse(preferences)))
}
