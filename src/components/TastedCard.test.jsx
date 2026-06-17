import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, afterEach } from 'vitest'
import TastedCard from './TastedCard'

describe('TastedCard', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calls onDelete when the deletion is confirmed', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    render(
      <TastedCard
        country='Italy'
        recipes={['Carbonara']}
        onDelete={onDelete}
        onAddRecipe={() => {}}
        onRemoveRecipe={() => {}}
      />
    )

    await user.click(screen.getByRole('button', { name: 'Delete country' }))

    expect(onDelete).toHaveBeenCalledWith('Italy')
  })

  it('does not call onDelete when the deletion is dismissed', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    vi.spyOn(window, 'confirm').mockReturnValue(false)

    render(
      <TastedCard
        country='Italy'
        recipes={['Carbonara']}
        onDelete={onDelete}
        onAddRecipe={() => {}}
        onRemoveRecipe={() => {}}
      />
    )

    await user.click(screen.getByRole('button', { name: 'Delete country' }))

    expect(onDelete).not.toHaveBeenCalled()
  })

  it('adds a recipe to this country only', async () => {
    const user = userEvent.setup()
    const onAddRecipe = vi.fn()

    render(
      <TastedCard
        country='Italy'
        recipes={[]}
        onDelete={() => {}}
        onAddRecipe={onAddRecipe}
        onRemoveRecipe={() => {}}
      />
    )

    await user.type(
      screen.getByPlaceholderText('Add another recipe'),
      'Risotto'
    )
    await user.click(screen.getByRole('button', { name: 'Add recipe to Italy' }))

    expect(onAddRecipe).toHaveBeenCalledWith('Italy', 'Risotto')
  })

  it('removes a recipe from this country only', async () => {
    const user = userEvent.setup()
    const onRemoveRecipe = vi.fn()

    render(
      <TastedCard
        country='Italy'
        recipes={['Carbonara']}
        onDelete={() => {}}
        onAddRecipe={() => {}}
        onRemoveRecipe={onRemoveRecipe}
      />
    )

    await user.click(
      screen.getByRole('button', { name: 'Remove Carbonara from Italy' })
    )

    expect(onRemoveRecipe).toHaveBeenCalledWith('Italy', 'Carbonara')
  })
})
