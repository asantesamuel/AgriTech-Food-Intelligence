export const mockScenarios = ['success', 'empty', 'stale', 'low-confidence', 'partial', 'critical-risk', 'error'] as const
export type MockScenario = (typeof mockScenarios)[number]

export function isMockScenario(value: string | null): value is MockScenario {
  return mockScenarios.includes(value as MockScenario)
}

export function readMockScenario(url: URL): MockScenario {
  const scenario = url.searchParams.get('scenario')
  return isMockScenario(scenario) ? scenario : 'success'
}

export function readMockLatency(url: URL): number {
  const candidate = Number(url.searchParams.get('latency'))
  return Number.isFinite(candidate) ? Math.min(Math.max(candidate, 0), 5_000) : 350
}
