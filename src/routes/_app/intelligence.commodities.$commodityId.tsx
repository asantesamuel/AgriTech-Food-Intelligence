import { createFileRoute } from '@tanstack/react-router'
import { CommodityIntelligence } from '@/features/intelligence'

export const Route = createFileRoute('/_app/intelligence/commodities/$commodityId')({ component: CommodityPage })
function CommodityPage() { const { commodityId } = Route.useParams(); return <CommodityIntelligence commodityId={commodityId} /> }
