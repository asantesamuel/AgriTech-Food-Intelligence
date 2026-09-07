import { appConfig } from '@/config/env'

export async function enableMocking() {
  if (appConfig.dataMode !== 'mock' || typeof window === 'undefined') return
  const { worker } = await import('./browser')
  await worker.start({ onUnhandledRequest: 'bypass', serviceWorker: { url: '/mockServiceWorker.js' } })
}
