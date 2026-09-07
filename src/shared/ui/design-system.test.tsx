import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Button, SemanticBadge, StatePanel } from '@/shared/ui'

describe('design system primitives', () => {
  it('exposes accessible button behavior', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Review signals</Button>)
    fireEvent.click(screen.getByRole('button', { name: 'Review signals' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('labels semantic data states', () => {
    render(<SemanticBadge signal="risk" level="high" />)
    expect(screen.getByLabelText('risk: high')).toBeVisible()
  })

  it('announces loading state', () => {
    render(<StatePanel kind="loading" title="Loading intelligence" description="Refreshing market signals." />)
    expect(screen.getByRole('region')).toHaveAttribute('aria-busy', 'true')
  })
})
