import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, afterEach } from 'vitest'
import ResetBtn from './ResetBtn'

describe('ResetBtn', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calls handleReset when the confirmation is accepted', async () => {
    const user = userEvent.setup()
    const handleReset = vi.fn()
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    render(<ResetBtn handleReset={handleReset} />)
    await user.click(screen.getByRole('button', { name: 'Reset all' }))

    expect(handleReset).toHaveBeenCalled()
  })

  it('does not call handleReset when the confirmation is dismissed', async () => {
    const user = userEvent.setup()
    const handleReset = vi.fn()
    vi.spyOn(window, 'confirm').mockReturnValue(false)

    render(<ResetBtn handleReset={handleReset} />)
    await user.click(screen.getByRole('button', { name: 'Reset all' }))

    expect(handleReset).not.toHaveBeenCalled()
  })
})
