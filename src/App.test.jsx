import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders normally with no stored data', () => {
    render(<App />)

    expect(screen.getByText('Taste the World')).toBeInTheDocument()
  })

  it('does not crash on first render when countriesTasted was stored in the legacy string-array shape', () => {
    // Pre-recipes-feature shape: an array of plain country name strings,
    // instead of { country, recipes } objects.
    localStorage.setItem('countriesTasted', JSON.stringify(['Canada', 'Peru']))

    render(<App />)

    expect(screen.getByText('Taste the World')).toBeInTheDocument()
    expect(screen.getByText('Canada')).toBeInTheDocument()
    expect(screen.getByText('Peru')).toBeInTheDocument()
  })
})
