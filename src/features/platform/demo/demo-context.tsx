import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

import { mockScenarios, type MockScenario } from '@/mocks/scenarios'

interface DemoContextValue {
  scenario: MockScenario
  scenarios: readonly MockScenario[]
  setScenario: (scenario: MockScenario) => void
  reset: () => void
}

const DemoContext = createContext<DemoContextValue | null>(null)
const STORAGE_KEY = 'food-intelligence.demo-scenario'

export function DemoProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [scenario, setScenarioState] = useState<MockScenario>('success')

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (mockScenarios.includes(stored as MockScenario)) setScenarioState(stored as MockScenario)
  }, [])

  const value = useMemo<DemoContextValue>(() => ({
    scenario,
    scenarios: mockScenarios,
    setScenario(next) {
      setScenarioState(next)
      window.localStorage.setItem(STORAGE_KEY, next)
    },
    reset() {
      setScenarioState('success')
      window.localStorage.removeItem(STORAGE_KEY)
    },
  }), [scenario])

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo() {
  const value = useContext(DemoContext)
  if (!value) throw new Error('useDemo must be used within DemoProvider')
  return value
}
