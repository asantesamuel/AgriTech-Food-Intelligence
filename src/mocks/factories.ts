import { catalogSnapshotSchema, dashboardSnapshotSchema, platformSnapshotSchema, type CatalogSnapshot, type DashboardSnapshot, type PlatformSnapshot } from '@/domain'
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
      { id: 'market-agbogbloshie', name: 'Agbogbloshie Wholesale', type: 'wholesale', location: { regionId: 'region-greater-accra', district: 'Accra' }, active: true },
      { id: 'market-kejetia', name: 'Kejetia Market', type: 'wholesale', location: { regionId: 'region-ashanti', district: 'Kumasi' }, active: true },
    ],
    commodities: [
      { id: 'commodity-maize', name: 'Maize', category: 'cereal', defaultUnit: 'kg', aliases: ['corn'] },
      { id: 'commodity-tomato', name: 'Tomato', category: 'vegetable', defaultUnit: 'crate', aliases: [] },
      { id: 'commodity-yam', name: 'Yam', category: 'tuber', defaultUnit: 'kg', aliases: [] },
    ].sort(() => random() - 0.5),
  })
}

export function createPlatform(seed = 42): PlatformSnapshot {
  const suffix = Math.floor(seeded(seed)() * 900 + 100)
  const primaryOrganization = { id: 'org-akwaaba-foods', name: 'Akwaaba Foods Group', slug: 'akwaaba-foods', industry: 'Food processing and distribution', regionIds: ['region-greater-accra', 'region-ashanti'], status: 'active', createdAt: NOW } as const
  const publicOrganization = { id: 'org-food-security', name: 'Ghana Food Security Unit', slug: 'ghana-food-security', industry: 'Public food-system planning', regionIds: ['region-greater-accra', 'region-ashanti', 'region-northern'], status: 'trial', createdAt: NOW } as const
  return platformSnapshotSchema.parse({
    organization: primaryOrganization,
    organizations: [primaryOrganization, publicOrganization],
    roles: [
      { id: 'role-admin', name: 'Organization administrator', description: 'Manages workspace access and configuration.', persona: 'organization-admin', permissions: [{ id: 'permission-manage-workspace', label: 'Manage workspace', resource: 'workspace', actions: ['view', 'manage'] }] },
      { id: 'role-analyst', name: 'Market intelligence analyst', description: 'Reviews market signals and recommendations.', persona: 'retail-analyst', permissions: [{ id: 'permission-view-intelligence', label: 'View intelligence', resource: 'intelligence', actions: ['view'] }] },
    ],
    users: [
      { id: 'user-ama-mensah', organizationId: 'org-akwaaba-foods', name: 'Ama Mensah', email: 'ama@example.test', title: 'Head of Market Intelligence', status: 'active', roleIds: ['role-admin'], lastActiveAt: NOW },
      { id: `user-kwame-${suffix}`, organizationId: 'org-akwaaba-foods', name: 'Kwame Owusu', email: 'kwame@example.test', title: 'Procurement Manager', status: 'active', roleIds: ['role-analyst'], lastActiveAt: '2026-09-07T09:45:00+00:00' },
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
    forecasts: [{ id: 'forecast-maize-accra', commodityId: 'commodity-maize', marketId: 'market-agbogbloshie', metric: 'price', horizonDays: 30, unitLabel: 'GHS/kg', points: [{ date: '2026-09-14', value: 8.4, lowerBound: 7.6, upperBound: 9.2 }, { date: '2026-09-21', value: 8.9, lowerBound: 7.9, upperBound: 9.8 }], confidence, freshness: { observedAt: NOW, receivedAt: NOW, status: 'fresh' }, modelId: 'model-price-v1' }],
    risks,
    alerts: [
      { id: 'alert-tomato-glut', organizationId: 'org-akwaaba-foods', title: 'Tomato glut risk increasing', message: 'Expected arrivals exceed near-term demand in Greater Accra.', category: 'glut', severity: scenario === 'critical-risk' ? 'critical' : 'high', status: 'new', commodityId: 'commodity-tomato', regionId: 'region-greater-accra', createdAt: NOW },
      { id: 'alert-maize-shortage', organizationId: 'org-akwaaba-foods', title: 'Maize availability tightening', message: 'Northern inflows are below the four-week seasonal baseline.', category: 'shortage', severity: 'medium', status: 'new', commodityId: 'commodity-maize', regionId: 'region-northern', createdAt: NOW },
    ],
    recommendations: [
      { id: 'recommendation-tomato-route', organizationId: 'org-akwaaba-foods', title: 'Redirect tomato volume to Kumasi processors', action: 'Reserve processing capacity and reroute 80 tonnes.', rationale: 'Processing demand and available capacity reduce projected spoilage.', category: 'redistribution', priority: 'high', expectedImpactPercent: 24, confidence, status: 'new', createdAt: NOW },
      { id: 'recommendation-maize-contract', organizationId: 'org-akwaaba-foods', title: 'Secure near-term maize supply', action: 'Open a 30-day purchase window with Northern aggregators.', rationale: 'Early contracting reduces exposure to the forecast supply gap.', category: 'procurement', priority: 'medium', expectedImpactPercent: 11, confidence, status: 'new', createdAt: NOW },
    ],
    unavailableSections: scenario === 'partial' ? ['supply-demand'] : [],
  }
  if (scenario === 'empty') Object.assign(snapshot, { kpis: [], prices: [], forecasts: [], risks: [], alerts: [], recommendations: [] })
  return dashboardSnapshotSchema.parse(snapshot)
}
