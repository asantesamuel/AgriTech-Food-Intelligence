export const protectedPaths = [
  '/',
  '/intelligence',
  '/intelligence/commodities/commodity-tomato',
  '/decisions',
  '/decisions/decision-tomato-purchase',
  '/planning',
  '/workspace',
  '/workspace/alerts',
  '/workspace/data-sources',
  '/workspace/integrations',
  '/workspace/organization',
  '/workspace/people',
  '/workspace/settings',
  '/onboarding',
] as const

export type ProtectedPath = (typeof protectedPaths)[number]

export function toProtectedPath(pathname: string): ProtectedPath {
  return protectedPaths.includes(pathname as ProtectedPath) ? pathname as ProtectedPath : '/'
}
