export const featureModuleIds = [
  'markets',
  'forecasts',
  'waste',
  'recommendations',
  'procurement',
  'optimisation',
  'scenarios',
  'reports',
  'platform',
] as const

export type FeatureModuleId = (typeof featureModuleIds)[number]
