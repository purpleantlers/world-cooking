import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import App from './App'

// Mock Supabase — App requires a real client but tests shouldn't hit the network
vi.mock('./lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    }),
  },
}))

const renderApp = () =>
  render(
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>,
  )

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the auth screen when no user is logged in', async () => {
    renderApp()
    // With no session, App shows the Auth page
    expect(await screen.findByText('Taste the World')).toBeInTheDocument()
  })

  it('does not crash on first render when countriesTasted was stored in the legacy string-array shape', async () => {
    // Pre-recipes-feature shape: an array of plain country name strings.
    // The hook migrates this on load — we just check the app doesn't crash.
    localStorage.setItem('countriesTasted', JSON.stringify(['Canada', 'Peru']))

    renderApp()

    // Auth screen still shows since there's no logged-in user
    expect(await screen.findByText('Taste the World')).toBeInTheDocument()
  })
})
