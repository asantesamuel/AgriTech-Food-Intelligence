import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { DecisionTransitionInput } from '@/domain'
import { useDemo } from '@/features/platform/demo/demo-context'
import { decisionService } from '@/services'

export function useDecisionQueue() {
  const { scenario } = useDemo()
  return useQuery({ queryKey: ['decisions', scenario], queryFn: () => decisionService.list({ scenario }) })
}

export function useDecision(decisionId: string) {
  const queryClient = useQueryClient()
  const { scenario } = useDemo()
  const query = useQuery({ queryKey: ['decision', decisionId, scenario], queryFn: () => decisionService.get(decisionId, { scenario }) })
  const transition = useMutation({ mutationFn: (input: DecisionTransitionInput) => decisionService.transition(decisionId, input, { scenario }), onSuccess: (decision) => { queryClient.setQueryData(['decision', decisionId, scenario], decision); void queryClient.invalidateQueries({ queryKey: ['decisions'] }) } })
  return { ...query, transition }
}
