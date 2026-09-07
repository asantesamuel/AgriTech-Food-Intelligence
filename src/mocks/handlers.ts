import { delay, http, HttpResponse } from 'msw'
import { createCatalog, createDashboard, createPlatform } from './factories'
import { readMockLatency, readMockScenario } from './scenarios'

async function prepare(url: URL) {
  await delay(readMockLatency(url))
  return readMockScenario(url)
}

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
    return HttpResponse.json(createPlatform())
  }),
  http.get('*/api/dashboard', async ({ request }) => {
    const url = new URL(request.url)
    const scenario = await prepare(url)
    if (scenario === 'error') return HttpResponse.json({ message: 'Mock intelligence unavailable' }, { status: 503 })
    return HttpResponse.json(createDashboard(scenario))
  }),
]
