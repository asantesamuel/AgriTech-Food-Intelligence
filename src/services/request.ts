import type { z } from 'zod'
import { appConfig } from '@/config/env'

export class ApiError extends Error {
  constructor(readonly status: number, message: string, readonly details?: unknown) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function requestJson<T>(path: string, schema: z.ZodType<T>, init?: RequestInit): Promise<T> {
  const base = typeof window === 'undefined' ? 'http://localhost' : window.location.origin
  const response = await fetch(new URL(`${appConfig.apiBaseUrl}${path}`, base), init)
  const payload: unknown = await response.json().catch(() => null)
  if (!response.ok) {
    const message = typeof payload === 'object' && payload && 'message' in payload && typeof payload.message === 'string' ? payload.message : `Request failed with status ${response.status}`
    throw new ApiError(response.status, message, payload)
  }
  return schema.parse(payload)
}
