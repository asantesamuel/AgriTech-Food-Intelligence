import { z } from 'zod'

export const authSessionSchema = z.object({ userId: z.string().min(3), organizationId: z.string().min(3), roleId: z.string().min(3) })
export type AuthSession = z.infer<typeof authSessionSchema>

const STORAGE_KEY = 'food-intelligence.auth.v1'

export function readStoredSession(storage: Pick<Storage, 'getItem'>): AuthSession | null {
  try {
    const value = storage.getItem(STORAGE_KEY)
    return value ? authSessionSchema.parse(JSON.parse(value)) : null
  } catch {
    return null
  }
}

export function writeStoredSession(storage: Pick<Storage, 'setItem'>, session: AuthSession) {
  storage.setItem(STORAGE_KEY, JSON.stringify(authSessionSchema.parse(session)))
}

export function clearStoredSession(storage: Pick<Storage, 'removeItem'>) {
  storage.removeItem(STORAGE_KEY)
}
