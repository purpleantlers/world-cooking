import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import Challenge from './Challenge'

describe('Challenge', () => {
  it('disables Done when no recipes have been added yet', () => {
    render(
      <Challenge
        countryChallenge='Italy'
        challengeRecipes={[]}
        addRecipe={() => {}}
        removeRecipe={() => {}}
        done={() => {}}
        cancel={() => {}}
      />
    )

    expect(screen.getByRole('button', { name: 'Done' })).toBeDisabled()
  })

  it('enables Done once at least one recipe exists', () => {
    render(
      <Challenge
        countryChallenge='Italy'
        challengeRecipes={['Carbonara']}
        addRecipe={() => {}}
        removeRecipe={() => {}}
        done={() => {}}
        cancel={() => {}}
      />
    )

    expect(screen.getByRole('button', { name: 'Done' })).toBeEnabled()
  })

  it('calls addRecipe with the typed value when Add is clicked', async () => {
    const user = userEvent.setup()
    const addRecipe = vi.fn()

    render(
      <Challenge
        countryChallenge='Italy'
        challengeRecipes={[]}
        addRecipe={addRecipe}
        removeRecipe={() => {}}
        done={() => {}}
        cancel={() => {}}
      />
    )

    await user.type(screen.getByPlaceholderText('Recipe name'), 'Carbonara')
    await user.click(screen.getByRole('button', { name: 'Add' }))

    expect(addRecipe).toHaveBeenCalledWith('Carbonara')
  })

  it('calls removeRecipe when a recipe chip is removed', async () => {
    const user = userEvent.setup()
    const removeRecipe = vi.fn()

    render(
      <Challenge
        countryChallenge='Italy'
        challengeRecipes={['Carbonara']}
        addRecipe={() => {}}
        removeRecipe={removeRecipe}
        done={() => {}}
        cancel={() => {}}
      />
    )

    await user.click(
      screen.getByRole('button', { name: 'Remove Carbonara' })
    )

    expect(removeRecipe).toHaveBeenCalledWith('Carbonara')
  })
})
