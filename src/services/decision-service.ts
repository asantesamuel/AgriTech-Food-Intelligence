import { decisionQueueSnapshotSchema, decisionSchema, type Decision, type DecisionQueueSnapshot, type DecisionTransitionInput } from '@/domain'
import type { MockRequestOptions } from './mock-options'
import { withMockOptions } from './mock-options'
import { requestJson } from './request'

const json = (body: unknown): RequestInit => ({ method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })

export interface DecisionService {
  list(options?: MockRequestOptions): Promise<DecisionQueueSnapshot>
  get(decisionId: string, options?: MockRequestOptions): Promise<Decision>
  transition(decisionId: string, input: DecisionTransitionInput, options?: MockRequestOptions): Promise<Decision>
}

export const decisionService: DecisionService = {
  list: (options) => requestJson(withMockOptions('/decisions', options), decisionQueueSnapshotSchema),
  get: (decisionId, options) => requestJson(withMockOptions(`/decisions/${decisionId}`, options), decisionSchema),
  transition: (decisionId, input, options) => requestJson(withMockOptions(`/decisions/${decisionId}`, options), decisionSchema, json(input)),
}
