import { useQuery } from '@tanstack/react-query'

import { useDemo } from '@/features/platform/demo/demo-context'
import { useAuth } from '@/features/platform/auth/auth-context'
import type { CommodityExplorerQueryInput } from '@/domain'
import { intelligenceService } from '@/services'

export function useMarketPulse() {
  const { scenario } = useDemo()
  return useQuery({ queryKey: ['market-pulse', scenario], queryFn: () => intelligenceService.getMarketPulse({ scenario }) })
}

export function useCommodityExplorer(query: CommodityExplorerQueryInput) {
  const { scenario } = useDemo()
  const { organization } = useAuth()
  return useQuery({
    queryKey: ['commodity-explorer', organization?.id, query, scenario],
    queryFn: () => intelligenceService.getCommodityExplorer(query, { scenario }),
  })
}

export function useCommodityIntelligence(commodityId: string) {
  const { scenario } = useDemo()
  return useQuery({ queryKey: ['commodity-intelligence', commodityId, scenario], queryFn: () => intelligenceService.getCommodityIntelligence(commodityId, { scenario }) })
}
