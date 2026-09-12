import { useQuery } from '@tanstack/react-query'

import { useDemo } from '@/features/platform/demo/demo-context'
import { intelligenceService } from '@/services'

export function useMarketPulse() {
  const { scenario } = useDemo()
  return useQuery({ queryKey: ['market-pulse', scenario], queryFn: () => intelligenceService.getMarketPulse({ scenario }) })
}

export function useCommodityIntelligence(commodityId: string) {
  const { scenario } = useDemo()
  return useQuery({ queryKey: ['commodity-intelligence', commodityId, scenario], queryFn: () => intelligenceService.getCommodityIntelligence(commodityId, { scenario }) })
}
