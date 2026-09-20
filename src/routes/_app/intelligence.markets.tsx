import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { marketExplorerQuerySchema, type MarketExplorerQuery } from '@/domain'
import { MarketExplorer } from '@/features/intelligence'

function normalize(search: Record<string, unknown>): MarketExplorerQuery { const parsed = marketExplorerQuerySchema.safeParse(search); return parsed.success ? parsed.data : marketExplorerQuerySchema.parse({}) }
export const Route = createFileRoute('/_app/intelligence/markets')({ validateSearch: normalize, component: MarketExplorerPage })
function MarketExplorerPage() { const query = Route.useSearch(); const navigate = useNavigate({ from: Route.fullPath }); return <MarketExplorer query={query} onQueryChange={(changes) => void navigate({ search: (current) => ({ ...current, ...changes }), replace: true })} /> }
