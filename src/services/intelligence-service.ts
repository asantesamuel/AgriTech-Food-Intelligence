import { commodityExplorerQuerySchema, commodityExplorerSnapshotSchema, commodityIntelligenceSnapshotSchema, marketExplorerQuerySchema, marketExplorerSnapshotSchema, marketPulseSnapshotSchema, type CommodityExplorerQueryInput, type CommodityExplorerSnapshot, type CommodityIntelligenceSnapshot, type MarketExplorerQueryInput, type MarketExplorerSnapshot, type MarketPulseSnapshot } from '@/domain'
import type { MockRequestOptions } from './mock-options'
import { withMockOptions } from './mock-options'
import { requestJson } from './request'

export interface IntelligenceService {
  getMarketPulse(options?: MockRequestOptions): Promise<MarketPulseSnapshot>
  getCommodityExplorer(query?: CommodityExplorerQueryInput, options?: MockRequestOptions): Promise<CommodityExplorerSnapshot>
  getMarketExplorer(query?: MarketExplorerQueryInput, options?: MockRequestOptions): Promise<MarketExplorerSnapshot>
  getCommodityIntelligence(commodityId: string, options?: MockRequestOptions): Promise<CommodityIntelligenceSnapshot>
}

export const intelligenceService: IntelligenceService = {
  getMarketPulse: (options) => requestJson(withMockOptions('/intelligence/market-pulse', options), marketPulseSnapshotSchema),
  getCommodityExplorer: (query, options) => {
    const parsed = commodityExplorerQuerySchema.parse(query ?? {})
    const params = new URLSearchParams({ sort: parsed.sort, order: parsed.order, page: String(parsed.page), pageSize: String(parsed.pageSize) })
    if (parsed.q) params.set('q', parsed.q)
    if (parsed.category) params.set('category', parsed.category)
    if (parsed.region) params.set('region', parsed.region)
    if (parsed.direction) params.set('direction', parsed.direction)
    if (parsed.risk) params.set('risk', parsed.risk)
    if (parsed.confidence) params.set('confidence', parsed.confidence)
    return requestJson(withMockOptions(`/intelligence/commodities?${params}`, options), commodityExplorerSnapshotSchema)
  },
  getMarketExplorer: (query, options) => {
    const parsed = marketExplorerQuerySchema.parse(query ?? {})
    const params = new URLSearchParams({ commodityId: parsed.commodityId })
    if (parsed.risk) params.set('risk', parsed.risk)
    if (parsed.marketId) params.set('marketId', parsed.marketId)
    return requestJson(withMockOptions(`/intelligence/markets?${params}`, options), marketExplorerSnapshotSchema)
  },
  getCommodityIntelligence: (commodityId, options) => requestJson(withMockOptions(`/intelligence/commodities/${commodityId}`, options), commodityIntelligenceSnapshotSchema),
}
