import { describe, expect, it } from 'vitest'
import { getBreadcrumbs, primaryNavigation } from './navigation'

describe('application navigation', () => {
  it('represents the five information architecture areas', () => {
    expect(primaryNavigation.map((item) => item.label)).toEqual(['Overview', 'Intelligence', 'Decisions', 'Planning', 'Workspace'])
  })

  it('creates readable route breadcrumbs', () => {
    expect(getBreadcrumbs('/')).toEqual(['Overview'])
    expect(getBreadcrumbs('/workspace/users-and-roles')).toEqual(['Workspace', 'Users And Roles'])
  })
})
