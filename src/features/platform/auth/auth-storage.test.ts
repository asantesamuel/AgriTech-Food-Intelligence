import { describe, expect, it } from 'vitest'
import { clearStoredSession, readStoredSession, writeStoredSession } from './auth-storage'

describe('mock session persistence', () => {
  it('round-trips a valid session in local storage', () => {
    const session = { userId: 'user-ama', organizationId: 'org-akwaaba', roleId: 'role-admin' }
    writeStoredSession(localStorage, session)
    expect(readStoredSession(localStorage)).toEqual(session)
    clearStoredSession(localStorage)
    expect(readStoredSession(localStorage)).toBeNull()
  })

  it('fails closed for malformed persisted data', () => {
    localStorage.setItem('food-intelligence.auth.v1', '{broken')
    expect(readStoredSession(localStorage)).toBeNull()
  })
})
