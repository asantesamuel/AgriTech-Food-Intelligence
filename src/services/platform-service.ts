import { platformSnapshotSchema, type PlatformSnapshot } from '@/domain'
import type { MockRequestOptions } from './mock-options'
import { withMockOptions } from './mock-options'
import { requestJson } from './request'

export interface PlatformService { getPlatform(options?: MockRequestOptions): Promise<PlatformSnapshot> }
export const platformService: PlatformService = { getPlatform: (options) => requestJson(withMockOptions('/platform', options), platformSnapshotSchema) }
