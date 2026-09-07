type DataMode = 'mock' | 'api'

function readDataMode(value: string | undefined): DataMode {
  return value === 'api' ? 'api' : 'mock'
}

export const appConfig = Object.freeze({
  name: import.meta.env.VITE_APP_NAME ?? 'Food Intelligence',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
  dataMode: readDataMode(import.meta.env.VITE_DATA_MODE),
})
