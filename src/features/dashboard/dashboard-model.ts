import type { CatalogSnapshot, DashboardSnapshot, PriceObservation } from '@/domain'

export type NamedPriceMover = PriceObservation & { commodityName: string; marketName: string }

export function namePriceMovers(snapshot: DashboardSnapshot, catalog: CatalogSnapshot): NamedPriceMover[] {
  const commodities = new Map(catalog.commodities.map((item) => [item.id, item.name]))
  const markets = new Map(catalog.markets.map((item) => [item.id, item.name]))
  return snapshot.prices
    .map((item) => ({
      ...item,
      commodityName: commodities.get(item.commodityId) ?? 'Unknown commodity',
      marketName: markets.get(item.marketId) ?? 'Unknown market',
    }))
    .sort((left, right) => Math.abs(right.changePercent ?? 0) - Math.abs(left.changePercent ?? 0))
}

export function defaultDashboardFilters(storage: Pick<Storage, 'getItem'> | null, organizationId: string) {
  const procurementDefault = { commodityId: 'commodity-tomato', regionId: 'region-greater-accra', horizon: '30d' as const }
  if (!storage) return procurementDefault
  try {
    const raw = storage.getItem(`food-intelligence.onboarding.v1.${organizationId}`)
    const parsed = raw ? JSON.parse(raw) as { commodityIds?: string[]; regionIds?: string[] } : null
    return { commodityId: parsed?.commodityIds?.[0] ?? procurementDefault.commodityId, regionId: parsed?.regionIds?.[0] ?? procurementDefault.regionId, horizon: '30d' as const }
  } catch {
    return procurementDefault
  }
}
