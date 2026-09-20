import { catalogSnapshotSchema, commodityExplorerQuerySchema, commodityExplorerSnapshotSchema, commodityIntelligenceSnapshotSchema, dashboardSnapshotSchema, decisionQueueSnapshotSchema, decisionSchema, marketExplorerQuerySchema, marketExplorerSnapshotSchema, marketPulseSnapshotSchema, platformSnapshotSchema, type CatalogSnapshot, type CommodityExplorerQueryInput, type CommodityExplorerSnapshot, type CommodityIntelligenceSnapshot, type DashboardSnapshot, type Decision, type DecisionQueueSnapshot, type MarketExplorerQueryInput, type MarketExplorerSnapshot, type MarketPulseSnapshot, type PlatformSnapshot } from '@/domain'
import type { MockScenario } from './scenarios'

const NOW = '2026-09-07T12:00:00+00:00'
const STALE = '2026-09-04T06:00:00+00:00'

function seeded(seed: number) {
  let state = seed >>> 0
  return () => ((state = (state * 1_664_525 + 1_013_904_223) >>> 0) / 4_294_967_296)
}

export function createCatalog(seed = 42): CatalogSnapshot {
  const random = seeded(seed)
  return catalogSnapshotSchema.parse({
    regions: [
      { id: 'region-greater-accra', name: 'Greater Accra', countryCode: 'GH', centroid: { latitude: 5.6037, longitude: -0.187 } },
      { id: 'region-ashanti', name: 'Ashanti', countryCode: 'GH', centroid: { latitude: 6.6885, longitude: -1.6244 } },
      { id: 'region-northern', name: 'Northern', countryCode: 'GH', centroid: { latitude: 9.4034, longitude: -0.8424 } },
    ],
    markets: [
      { id: 'market-agbogbloshie', name: 'Agbogbloshie Wholesale', type: 'wholesale', location: { regionId: 'region-greater-accra', district: 'Accra', point: { latitude: 5.5504, longitude: -0.2208 } }, active: true },
      { id: 'market-kejetia', name: 'Kejetia Market', type: 'wholesale', location: { regionId: 'region-ashanti', district: 'Kumasi', point: { latitude: 6.6962, longitude: -1.6244 } }, active: true },
      { id: 'market-tamale-central', name: 'Tamale Central Market', type: 'wholesale', location: { regionId: 'region-northern', district: 'Tamale', point: { latitude: 9.4008, longitude: -0.8393 } }, active: true },
    ],
    commodities: [
      { id: 'commodity-maize', name: 'Maize', category: 'cereal', defaultUnit: 'kg', aliases: ['corn'] },
      { id: 'commodity-tomato', name: 'Tomato', category: 'vegetable', defaultUnit: 'crate', aliases: [] },
      { id: 'commodity-yam', name: 'Yam', category: 'tuber', defaultUnit: 'kg', aliases: [] },
      { id: 'commodity-cassava', name: 'Cassava', category: 'tuber', defaultUnit: 'kg', aliases: ['manioc'] },
      { id: 'commodity-plantain', name: 'Plantain', category: 'fruit', defaultUnit: 'kg', aliases: [] },
      { id: 'commodity-rice', name: 'Rice', category: 'cereal', defaultUnit: 'bag', aliases: [] },
      { id: 'commodity-onion', name: 'Onion', category: 'vegetable', defaultUnit: 'bag', aliases: ['onions'] },
      { id: 'commodity-pepper', name: 'Pepper', category: 'vegetable', defaultUnit: 'crate', aliases: ['chilli'] },
      { id: 'commodity-cowpea', name: 'Cowpea', category: 'legume', defaultUnit: 'bag', aliases: ['black-eyed pea'] },
      { id: 'commodity-groundnut', name: 'Groundnut', category: 'legume', defaultUnit: 'bag', aliases: ['peanut'] },
      { id: 'commodity-mango', name: 'Mango', category: 'fruit', defaultUnit: 'crate', aliases: [] },
      { id: 'commodity-pineapple', name: 'Pineapple', category: 'fruit', defaultUnit: 'crate', aliases: [] },
    ].sort(() => random() - 0.5),
  })
}

export function createPlatform(seed = 42): PlatformSnapshot {
  void seed
  const primaryOrganization = { id: 'org-akwaaba-foods', name: 'Akwaaba Foods Group', slug: 'akwaaba-foods', industry: 'Food processing and distribution', regionIds: ['region-greater-accra', 'region-ashanti'], status: 'active', createdAt: NOW } as const
  const publicOrganization = { id: 'org-food-security', name: 'Ghana Food Security Unit', slug: 'ghana-food-security', industry: 'Public food-system planning', regionIds: ['region-greater-accra', 'region-ashanti', 'region-northern'], status: 'trial', createdAt: NOW } as const
  return platformSnapshotSchema.parse({
    organization: primaryOrganization,
    organizations: [primaryOrganization, publicOrganization],
    roles: [
      { id: 'role-admin', name: 'Organization administrator', description: 'Manages workspace access and configuration.', persona: 'organization-admin', permissions: [{ id: 'permission-manage-workspace', label: 'Manage workspace', resource: 'workspace', actions: ['view', 'manage'] }] },
      { id: 'role-analyst', name: 'Procurement manager', description: 'Reviews market intelligence and makes purchasing decisions.', persona: 'procurement-manager', permissions: [{ id: 'permission-view-intelligence', label: 'View intelligence', resource: 'intelligence', actions: ['view'] }] },
    ],
    users: [
      { id: 'user-ama-mensah', organizationId: 'org-akwaaba-foods', name: 'Ama Mensah', email: 'ama@example.test', title: 'Head of Market Intelligence', status: 'active', roleIds: ['role-admin'], lastActiveAt: NOW },
      { id: 'user-kwame-owusu', organizationId: 'org-akwaaba-foods', name: 'Kwame Owusu', email: 'kwame@example.test', title: 'Procurement Manager', status: 'active', roleIds: ['role-analyst'], lastActiveAt: '2026-09-07T09:45:00+00:00' },
      { id: 'user-abena-asare', organizationId: 'org-food-security', name: 'Abena Asare', email: 'abena@example.test', title: 'Food Security Analyst', status: 'active', roleIds: ['role-analyst'], lastActiveAt: NOW },
    ],
    invitations: [{ id: 'invite-efua', organizationId: 'org-akwaaba-foods', email: 'efua@example.test', roleId: 'role-analyst', status: 'pending', invitedAt: '2026-09-06T10:15:00+00:00' }],
  })
}

export function createDashboard(scenario: Exclude<MockScenario, 'error'> = 'success', seed = 42): DashboardSnapshot {
  const random = seeded(seed)
  const catalog = createCatalog(seed)
  const isStale = scenario === 'stale'
  const confidence = scenario === 'low-confidence' ? { score: 0.38, band: 'low' as const } : { score: 0.87, band: 'high' as const }
  const risks = [
    { id: 'risk-tomato-accra', commodityId: 'commodity-tomato', regionId: 'region-greater-accra', probability: scenario === 'critical-risk' ? 0.96 : 0.78, severity: scenario === 'critical-risk' ? 'critical' : 'high', volumeAtRisk: 126, unit: 'tonne', valueAtRisk: { amount: 684_000, currency: 'GHS' }, drivers: ['Peak arrivals', 'Limited cold storage'], confidence, forecastDate: '2026-09-14' },
    { id: 'risk-yam-ashanti', commodityId: 'commodity-yam', regionId: 'region-ashanti', probability: 0.51, severity: 'medium', volumeAtRisk: 48, unit: 'tonne', valueAtRisk: { amount: 192_000, currency: 'GHS' }, drivers: ['Uneven market arrivals', 'Transport delays'], confidence, forecastDate: '2026-09-18' },
  ]
  const snapshot = {
    state: scenario,
    generatedAt: NOW,
    freshness: { observedAt: isStale ? STALE : NOW, receivedAt: NOW, status: isStale ? 'stale' : 'fresh' },
    kpis: [
      { id: 'kpi-markets', label: 'Markets monitored', value: 24, displayValue: '24', trendPercent: 8, tone: 'info' },
      { id: 'kpi-risk', label: 'Value at risk', value: 1_840_000, displayValue: 'GHS 1.84m', trendPercent: 14.2, tone: 'danger' },
      { id: 'kpi-opportunity', label: 'Avoidable waste', value: 312, displayValue: '312 t', trendPercent: -6.4, tone: 'warning' },
    ],
    prices: catalog.commodities.map((commodity, index) => ({ id: `price-${commodity.id}`, commodityId: commodity.id, marketId: index % 2 ? 'market-kejetia' : 'market-agbogbloshie', price: Math.round((4 + random() * 18) * 100) / 100, priceUnit: { currency: 'GHS', per: commodity.defaultUnit }, observedAt: isStale ? STALE : NOW, changePercent: Math.round((-6 + random() * 18) * 10) / 10, sourceId: 'source-market-network', freshness: { observedAt: isStale ? STALE : NOW, receivedAt: NOW, status: isStale ? 'stale' : 'fresh' } })),
    forecasts: [
      { id: 'forecast-tomato-accra', commodityId: 'commodity-tomato', marketId: 'market-agbogbloshie', metric: 'price', horizonDays: 30, unitLabel: 'GHS/crate', points: [{ date: '2026-09-14', value: 9.1, lowerBound: 8.3, upperBound: 10.1 }, { date: '2026-09-21', value: 10.4, lowerBound: 9.1, upperBound: 11.8 }, { date: '2026-10-07', value: 12.2, lowerBound: 10.4, upperBound: 14.1 }], confidence, freshness: { observedAt: NOW, receivedAt: NOW, status: 'fresh' }, modelId: 'model-tomato-price-v1' },
      { id: 'forecast-maize-accra', commodityId: 'commodity-maize', marketId: 'market-agbogbloshie', metric: 'price', horizonDays: 30, unitLabel: 'GHS/kg', points: [{ date: '2026-09-14', value: 8.4, lowerBound: 7.6, upperBound: 9.2 }, { date: '2026-09-21', value: 8.9, lowerBound: 7.9, upperBound: 9.8 }], confidence, freshness: { observedAt: NOW, receivedAt: NOW, status: 'fresh' }, modelId: 'model-price-v1' },
    ],
    risks,
    alerts: [
      { id: 'alert-tomato-glut', organizationId: 'org-akwaaba-foods', title: 'Tomato glut risk increasing', message: 'Expected arrivals exceed near-term demand in Greater Accra.', category: 'glut', severity: scenario === 'critical-risk' ? 'critical' : 'high', status: 'new', commodityId: 'commodity-tomato', regionId: 'region-greater-accra', createdAt: NOW },
      { id: 'alert-maize-shortage', organizationId: 'org-akwaaba-foods', title: 'Maize availability tightening', message: 'Northern inflows are below the four-week seasonal baseline.', category: 'shortage', severity: 'medium', status: 'new', commodityId: 'commodity-maize', regionId: 'region-northern', createdAt: NOW },
    ],
    recommendations: [
      { id: 'recommendation-tomato-purchase', organizationId: 'org-akwaaba-foods', commodityId: 'commodity-tomato', regionIds: ['region-greater-accra', 'region-ashanti'], title: 'Advance the next tomato purchase window', action: 'Secure 80 tonnes from Ashanti source markets within seven days.', rationale: 'Prices are modeled to rise as Greater Accra demand tightens after peak arrivals.', category: 'procurement', priority: 'high', expectedImpactPercent: 24, expectedFinancialValueProtected: { amount: 684_000, currency: 'GHS' }, decisionBy: '2026-09-07T16:00:00+00:00', confidence, status: 'new', createdAt: NOW },
      { id: 'recommendation-maize-contract', organizationId: 'org-akwaaba-foods', commodityId: 'commodity-maize', regionIds: ['region-northern'], title: 'Secure near-term maize supply', action: 'Open a 30-day purchase window with Northern aggregators.', rationale: 'Early contracting reduces exposure to the forecast supply gap.', category: 'procurement', priority: 'medium', expectedImpactPercent: 11, expectedFinancialValueProtected: { amount: 202_000, currency: 'GHS' }, decisionBy: '2026-09-09T12:00:00+00:00', confidence, status: 'new', createdAt: NOW },
    ],
    unavailableSections: scenario === 'partial' ? ['supply-demand'] : [],
  }
  if (scenario === 'empty') Object.assign(snapshot, { kpis: [], prices: [], forecasts: [], risks: [], alerts: [], recommendations: [] })
  return dashboardSnapshotSchema.parse(snapshot)
}

export function createMarketPulse(scenario: Exclude<MockScenario, 'error'> = 'success'): MarketPulseSnapshot {
  const dashboard = createDashboard(scenario)
  return marketPulseSnapshotSchema.parse({
    generatedAt: dashboard.generatedAt,
    state: dashboard.state,
    signals: scenario === 'empty' ? [] : [
      { id: 'signal-tomato-purchase', commodityId: 'commodity-tomato', title: 'Tomato purchase window is narrowing', summary: 'Greater Accra prices are modeled to rise as available Ashanti volume is absorbed.', severity: scenario === 'critical-risk' ? 'critical' : 'high', regionIds: ['region-greater-accra', 'region-ashanti'], direction: 'rising', changePercent: 18.6, decisionId: 'decision-tomato-purchase' },
      { id: 'signal-maize-tightening', commodityId: 'commodity-maize', title: 'Maize availability is tightening', summary: 'Northern inflows remain below the four-week seasonal baseline.', severity: 'medium', regionIds: ['region-northern'], direction: 'rising', changePercent: 7.4 },
    ],
    prices: dashboard.prices,
    forecasts: dashboard.forecasts,
    alerts: dashboard.alerts,
  })
}

export function createCommodityExplorer(queryInput: CommodityExplorerQueryInput = {}, scenario: Exclude<MockScenario, 'error'> = 'success', seed = 42): CommodityExplorerSnapshot {
  const query = commodityExplorerQuerySchema.parse(queryInput)
  const catalog = createCatalog(seed)
  const random = seeded(seed)
  const isStale = scenario === 'stale'
  const freshness = { observedAt: isStale ? STALE : NOW, receivedAt: NOW, status: isStale ? 'stale' as const : 'fresh' as const }
  const confidence = scenario === 'low-confidence' ? { score: 0.38, band: 'low' as const } : { score: 0.84, band: 'high' as const }
  const severities = ['high', 'medium', 'low', 'medium'] as const
  const commodities = [...catalog.commodities].sort((left, right) => left.name.localeCompare(right.name))
  let items = commodities.map((commodity, index) => {
    const market = catalog.markets[index % catalog.markets.length]!
    const value = Math.round((4.25 + index * 1.31 + random()) * 100) / 100
    const movementPercent = Math.round((-5.5 + (index % 7) * 2.7) * 10) / 10
    const volatilityPercent = Math.round((5.8 + (index % 5) * 3.4) * 10) / 10
    const forecastChange = Math.round((movementPercent * 0.7 + 4.8) * 10) / 10
    const direction = forecastChange > 1 ? 'rising' as const : forecastChange < -1 ? 'falling' as const : 'stable' as const
    const projectedValue = Math.max(0, Math.round((value * (1 + forecastChange / 100)) * 100) / 100)
    const intervalWidth = Math.round((0.65 + index * 0.04) * 100) / 100
    const severity = scenario === 'critical-risk' && index === 0 ? 'critical' as const : severities[index % severities.length]!
    const riskSummary = scenario === 'partial' && index % 4 === 0 ? null : { regionId: market.location.regionId, severity, probability: Math.min(0.95, 0.36 + (3 - (index % 4)) * 0.13), valueAtRisk: { amount: 82_000 + index * 47_500, currency: 'GHS' as const } }
    const forecastSummary = scenario === 'partial' && index % 5 === 0 ? null : { horizonDays: 30, projectedValue, unitLabel: `GHS/${commodity.defaultUnit}`, lowerBound: Math.max(0, Math.round((projectedValue - intervalWidth) * 100) / 100), upperBound: Math.round((projectedValue + intervalWidth) * 100) / 100, changePercent: forecastChange, direction, confidence, freshness, modelId: `model-${commodity.id.replace('commodity-', '')}-price-v1` }
    const attentionRank = commodity.id === 'commodity-tomato' ? 100 : Math.round((riskSummary?.probability ?? 0) * 55 + Math.abs(forecastChange) * 2 + volatilityPercent)
    const volatilityBand = volatilityPercent >= 16 ? 'high' as const : volatilityPercent >= 10 ? 'medium' as const : 'low' as const
    return { attentionRank, commodity, market, referenceRegionId: market.location.regionId, currentPrice: { value, unit: { currency: 'GHS' as const, per: commodity.defaultUnit }, observedAt: freshness.observedAt, freshness }, movementPercent, direction, volatilityPercent, volatilityBand, forecastSummary, riskSummary }
  })

  const normalizedSearch = query.q.toLocaleLowerCase('en-GH')
  if (normalizedSearch) items = items.filter(({ commodity }) => [commodity.name, ...commodity.aliases].some((value) => value.toLocaleLowerCase('en-GH').includes(normalizedSearch)))
  if (query.category) items = items.filter(({ commodity }) => commodity.category === query.category)
  if (query.region) items = items.filter(({ referenceRegionId }) => referenceRegionId === query.region)
  if (query.direction) items = items.filter(({ direction }) => direction === query.direction)
  if (query.risk) items = items.filter(({ riskSummary }) => riskSummary?.severity === query.risk)
  if (query.confidence) items = items.filter(({ forecastSummary }) => forecastSummary?.confidence.band === query.confidence)

  const riskRank = { low: 1, medium: 2, high: 3, critical: 4 } as const
  const freshnessRank = { stale: 0, fresh: 1 } as const
  items.sort((left, right) => {
    let comparison = 0
    switch (query.sort) {
      case 'attention': comparison = left.attentionRank - right.attentionRank; break
      case 'increase': comparison = left.movementPercent - right.movementPercent; break
      case 'decrease': comparison = right.movementPercent - left.movementPercent; break
      case 'volatility': comparison = left.volatilityPercent - right.volatilityPercent; break
      case 'risk': comparison = (left.riskSummary ? riskRank[left.riskSummary.severity] : 0) - (right.riskSummary ? riskRank[right.riskSummary.severity] : 0); break
      case 'freshness': comparison = freshnessRank[left.currentPrice.freshness.status] - freshnessRank[right.currentPrice.freshness.status]; break
      case 'name': comparison = left.commodity.name.localeCompare(right.commodity.name); break
    }
    return (query.order === 'desc' ? -comparison : comparison) || left.commodity.name.localeCompare(right.commodity.name)
  })

  if (scenario === 'empty') items = []
  const totalItems = items.length
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / query.pageSize)
  const start = (query.page - 1) * query.pageSize
  return commodityExplorerSnapshotSchema.parse({ generatedAt: NOW, state: scenario, query, pageInfo: { page: query.page, pageSize: query.pageSize, totalItems, totalPages }, items: items.slice(start, start + query.pageSize) })
}

export function createCommodityIntelligence(commodityId = 'commodity-tomato', scenario: Exclude<MockScenario, 'error'> = 'success'): CommodityIntelligenceSnapshot {
  const catalog = createCatalog()
  const dashboard = createDashboard(scenario)
  const commodity = catalog.commodities.find((item) => item.id === commodityId) ?? catalog.commodities.find((item) => item.id === 'commodity-tomato')!
  const source = catalog.regions.find((item) => item.id === 'region-ashanti')!
  const destination = catalog.regions.find((item) => item.id === 'region-greater-accra')!
  const observed = dashboard.prices.find((item) => item.commodityId === commodity.id)
  const prices = observed ? [observed, { ...observed, id: `price-${commodity.id}-kejetia`, marketId: 'market-kejetia', price: Math.max(0, Math.round((observed.price - 0.83) * 100) / 100), changePercent: 2.8 }] : []
  return commodityIntelligenceSnapshotSchema.parse({
    generatedAt: dashboard.generatedAt,
    state: dashboard.state,
    commodity,
    markets: catalog.markets,
    prices,
    forecast: dashboard.forecasts.find((item) => item.commodityId === commodity.id),
    risks: dashboard.risks.filter((item) => item.commodityId === commodity.id),
    alerts: dashboard.alerts.filter((item) => !item.commodityId || item.commodityId === commodity.id),
    recommendations: dashboard.recommendations.filter((item) => !item.commodityId || item.commodityId === commodity.id),
    corridor: { id: 'corridor-tomato-ashanti-accra', commodityId: commodity.id, sourceRegionId: source.id, destinationRegionId: destination.id, availableVolume: 126, committedVolume: 46, unit: 'tonne', leadTimeHours: 7.5, pressure: 'tightening', summary: 'Available Ashanti tomato volume can cover the next Greater Accra purchasing window before modeled prices rise.' },
  })
}

export function createMarketExplorer(queryInput: MarketExplorerQueryInput = {}, scenario: Exclude<MockScenario, 'error'> = 'success'): MarketExplorerSnapshot {
  const query = marketExplorerQuerySchema.parse(queryInput)
  const catalog = createCatalog()
  const commodity = catalog.commodities.find((item) => item.id === query.commodityId) ?? catalog.commodities.find((item) => item.id === 'commodity-tomato')!
  const riskLevels = ['high', 'medium', 'low'] as const
  const isStale = scenario === 'stale'
  const freshness = { observedAt: isStale ? STALE : NOW, receivedAt: NOW, status: isStale ? 'stale' as const : 'fresh' as const }
  let locations = catalog.markets.map((market, index) => {
    const region = catalog.regions.find((item) => item.id === market.location.regionId)!
    const severity = scenario === 'critical-risk' && index === 0 ? 'critical' as const : riskLevels[index]!
    const risk = scenario === 'partial' && index === 2 ? null : { severity, probability: 0.78 - index * 0.16, valueAtRisk: { amount: 684_000 - index * 181_000, currency: 'GHS' as const }, drivers: index === 0 ? ['Peak arrivals', 'Limited cold storage'] : ['Uneven arrivals', 'Transport pressure'] }
    return { market, region, currentPrice: { value: 9.4 + index * 1.85, unit: { currency: 'GHS' as const, per: commodity.defaultUnit }, changePercent: 18.6 - index * 9.2, freshness }, risk }
  })
  if (query.risk) locations = locations.filter((item) => item.risk?.severity === query.risk)
  if (scenario === 'empty') locations = []
  return marketExplorerSnapshotSchema.parse({ generatedAt: NOW, state: scenario, mapAvailable: scenario !== 'partial', query, commodity, commodities: catalog.commodities, locations })
}

export function createDecisions(): DecisionQueueSnapshot {
  const decision: Decision = decisionSchema.parse({
    id: 'decision-tomato-purchase', organizationId: 'org-akwaaba-foods', recommendationId: 'recommendation-tomato-purchase', commodityId: 'commodity-tomato', regionIds: ['region-greater-accra', 'region-ashanti'], forecastId: 'forecast-tomato-accra', riskIds: ['risk-tomato-accra'], alertIds: ['alert-tomato-glut'], title: 'Advance the next tomato purchase window', status: 'recommended', ownerId: 'user-kwame-owusu', purchaseTiming: { windowStart: '2026-09-08', windowEnd: '2026-09-14', quantity: 80, unit: 'tonne', sourceMarketId: 'market-kejetia', destinationMarketId: 'market-agbogbloshie', targetUnitPrice: { amount: 9.4, currency: 'GHS' } }, impact: { expectedFinancialValueProtected: { amount: 684_000, currency: 'GHS' } }, history: [{ id: 'history-decision-created', status: 'recommended', actorId: 'user-ama-mensah', at: NOW, notes: 'Generated from the tomato price and supply-pressure signal.' }], createdAt: NOW, updatedAt: NOW,
  })
  return decisionQueueSnapshotSchema.parse({ generatedAt: NOW, decisions: [decision] })
}
