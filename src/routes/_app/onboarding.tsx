import { createFileRoute } from '@tanstack/react-router'
import { OnboardingFlow } from '@/features/platform/onboarding/onboarding-flow'

export const Route = createFileRoute('/_app/onboarding')({ component: OnboardingFlow })
