import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Challenge from './Challenge'

// Helper to create a recipe object with a given name
const makeRecipe = (name) => ({
  name,
  intro: '',
  ingredients: '',
  method: '',
  photo_url: '',
  entry_number: null,
  cookedAt: null,
})

const defaultProps = {
  countryChallenge: 'Italy',
  challengeRecipes: [],
  addRecipe: () => {},
  removeRecipe: () => {},
  updateChallengeRecipe: () => {},
  done: () => {},
  cancel: () => {},
}

// Helper to render the Challenge component with default props and optional overrides
const renderChallenge = (props = {}) =>
  render(
    <MemoryRouter>
      <Challenge {...defaultProps} {...props} />
    </MemoryRouter>,
  )

describe('Challenge', () => {
  it('disables Done when no recipes have been added yet', () => {
    renderChallenge({ challengeRecipes: [] })
    expect(screen.getByRole('button', { name: 'Done' })).toBeDisabled()
  })

  it('enables Done once at least one recipe exists', () => {
    renderChallenge({ challengeRecipes: [makeRecipe('Carbonara')] })
    expect(screen.getByRole('button', { name: 'Done' })).toBeEnabled()
  })

  it('calls addRecipe with a recipe object when Add is clicked', async () => {
    const user = userEvent.setup()
    const addRecipe = vi.fn()

    renderChallenge({ addRecipe })

    await user.type(
      screen.getByPlaceholderText('e.g., Homemade Wiener Schnitzel'),
      'Carbonara',
    )
    await user.click(screen.getByRole('button', { name: 'Add recipe' }))

    expect(addRecipe).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Carbonara' }),
    )
  })

  it('calls removeRecipe with the recipe name when a chip is removed', async () => {
    const user = userEvent.setup()
    const removeRecipe = vi.fn()

    renderChallenge({
      challengeRecipes: [makeRecipe('Carbonara')],
      removeRecipe,
    })

    await user.click(screen.getByRole('button', { name: 'Remove Carbonara' }))

    expect(removeRecipe).toHaveBeenCalledWith('Carbonara')
  })

  it('shows Done confirmation modal when Done is clicked', async () => {
    const user = userEvent.setup()

    renderChallenge({ challengeRecipes: [makeRecipe('Carbonara')] })

    await user.click(screen.getByRole('button', { name: 'Done' }))

    expect(screen.getByText('Mark this challenge as done?')).toBeInTheDocument()
  })

  it('calls done only after confirming in the modal', async () => {
    const user = userEvent.setup()
    const done = vi.fn()

    renderChallenge({ challengeRecipes: [makeRecipe('Carbonara')], done })

    await user.click(screen.getByRole('button', { name: 'Done' }))
    await user.click(screen.getByRole('button', { name: "Yes, I'm done" }))

    expect(done).toHaveBeenCalled()
  })

  it('shows Cancel confirmation modal when Cancel is clicked', async () => {
    const user = userEvent.setup()

    renderChallenge()

    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(screen.getByText('Cancel this challenge?')).toBeInTheDocument()
  })

  it('does not call cancel when the modal is dismissed', async () => {
    const user = userEvent.setup()
    const cancel = vi.fn()

    renderChallenge({ cancel })

    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    await user.click(screen.getByRole('button', { name: 'Keep cooking' }))

    expect(cancel).not.toHaveBeenCalled()
  })
})
