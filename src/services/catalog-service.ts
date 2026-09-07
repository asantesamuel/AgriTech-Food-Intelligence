import { catalogSnapshotSchema, type CatalogSnapshot } from '@/domain'
import type { MockRequestOptions } from './mock-options'
import { withMockOptions } from './mock-options'
import { requestJson } from './request'

export interface CatalogService { getCatalog(options?: MockRequestOptions): Promise<CatalogSnapshot> }
export const catalogService: CatalogService = { getCatalog: (options) => requestJson(withMockOptions('/catalog', options), catalogSnapshotSchema) }
