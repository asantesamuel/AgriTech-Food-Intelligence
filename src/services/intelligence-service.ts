import { commodityIntelligenceSnapshotSchema, marketPulseSnapshotSchema, type CommodityIntelligenceSnapshot, type MarketPulseSnapshot } from '@/domain'
import type { MockRequestOptions } from './mock-options'
import { withMockOptions } from './mock-options'
import { requestJson } from './request'

export interface IntelligenceService {
  getMarketPulse(options?: MockRequestOptions): Promise<MarketPulseSnapshot>
  getCommodityIntelligence(commodityId: string, options?: MockRequestOptions): Promise<CommodityIntelligenceSnapshot>
}

export const intelligenceService: IntelligenceService = {
  getMarketPulse: (options) => requestJson(withMockOptions('/intelligence/market-pulse', options), marketPulseSnapshotSchema),
  getCommodityIntelligence: (commodityId, options) => requestJson(withMockOptions(`/intelligence/commodities/${commodityId}`, options), commodityIntelligenceSnapshotSchema),
}
