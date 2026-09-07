import type { MockScenario } from '@/mocks/scenarios'

export interface MockRequestOptions {
  scenario?: MockScenario
  latencyMs?: number
}

export function withMockOptions(path: string, options?: MockRequestOptions) {
  const params = new URLSearchParams()
  if (options?.scenario) params.set('scenario', options.scenario)
  if (options?.latencyMs !== undefined) params.set('latency', String(options.latencyMs))
  const query = params.toString()
  return query ? `${path}?${query}` : path
}
