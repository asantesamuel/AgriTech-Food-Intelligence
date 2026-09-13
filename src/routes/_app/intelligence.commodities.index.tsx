import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { commodityExplorerQuerySchema, type CommodityExplorerQuery } from '@/domain'
import { CommodityExplorer } from '@/features/intelligence'

function normalizeSearch(search: Record<string, unknown>): CommodityExplorerQuery {
  const parsed = commodityExplorerQuerySchema.safeParse(search)
  return parsed.success ? parsed.data : commodityExplorerQuerySchema.parse({})
}

export const Route = createFileRoute('/_app/intelligence/commodities/')({
  validateSearch: normalizeSearch,
  component: CommodityExplorerPage,
})

function CommodityExplorerPage() {
  const query = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  return <CommodityExplorer query={query} onQueryChange={(changes) => void navigate({ search: (current) => ({ ...current, ...changes }), replace: true })} />
}
