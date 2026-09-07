import { dashboardSnapshotSchema, type DashboardSnapshot } from '@/domain'
import type { MockRequestOptions } from './mock-options'
import { withMockOptions } from './mock-options'
import { requestJson } from './request'

export interface DashboardFilters { commodityId?: string; regionId?: string; horizon?: '7d' | '30d' | '90d' }
export interface DashboardService { getSnapshot(filters?: DashboardFilters, options?: MockRequestOptions): Promise<DashboardSnapshot> }

export const dashboardService: DashboardService = {
  getSnapshot(filters, options) {
    const path = new URL(withMockOptions('/dashboard', options), 'http://local')
    if (filters?.commodityId) path.searchParams.set('commodityId', filters.commodityId)
    if (filters?.regionId) path.searchParams.set('regionId', filters.regionId)
    if (filters?.horizon) path.searchParams.set('horizon', filters.horizon)
    return requestJson(`${path.pathname}${path.search}`, dashboardSnapshotSchema)
  },
}
