import type { z } from 'zod'
import { appConfig } from '@/config/env'

export class ApiError extends Error {
  constructor(readonly status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function requestJson<T>(path: string, schema: z.ZodType<T>, init?: RequestInit): Promise<T> {
  const base = typeof window === 'undefined' ? 'http://localhost' : window.location.origin
  const response = await fetch(new URL(`${appConfig.apiBaseUrl}${path}`, base), init)
  if (!response.ok) throw new ApiError(response.status, `Request failed with status ${response.status}`)
  return schema.parse(await response.json())
}
