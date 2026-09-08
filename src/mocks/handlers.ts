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
    const snapshot = createDashboard(scenario)
    const commodityId = url.searchParams.get('commodityId')
    const regionId = url.searchParams.get('regionId')
    if (commodityId) {
      snapshot.prices = snapshot.prices.filter((item) => item.commodityId === commodityId)
      snapshot.forecasts = snapshot.forecasts.filter((item) => item.commodityId === commodityId)
      snapshot.risks = snapshot.risks.filter((item) => item.commodityId === commodityId)
      snapshot.alerts = snapshot.alerts.filter((item) => !item.commodityId || item.commodityId === commodityId)
    }
    if (regionId) {
      snapshot.risks = snapshot.risks.filter((item) => item.regionId === regionId)
      snapshot.alerts = snapshot.alerts.filter((item) => !item.regionId || item.regionId === regionId)
    }
    const horizon = url.searchParams.get('horizon')
    const horizonDays = horizon === '7d' ? 7 : horizon === '90d' ? 90 : 30
    snapshot.forecasts = snapshot.forecasts.map((forecast) => ({ ...forecast, horizonDays }))
    return HttpResponse.json(snapshot)
  }),
]
