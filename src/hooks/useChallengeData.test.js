import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useChallengeData } from './useChallengeData'
import { world } from '../db'

describe('useChallengeData', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts with no challenge and no tasted countries', () => {
    const { result } = renderHook(() => useChallengeData())

    expect(result.current.countryChallenge).toBe('')
    expect(result.current.countriesTasted).toEqual([])
    expect(result.current.ongoingChallenge).toBe(false)
  })

  it('starts a challenge when a country is selected', () => {
    const { result } = renderHook(() => useChallengeData())

    act(() => {
      result.current.handleSelectChange({ target: { value: 'France' } })
    })

    expect(result.current.countryChallenge).toBe('France')
    expect(result.current.ongoingChallenge).toBe(true)
  })

  it('ignores the placeholder "none" option', () => {
    const { result } = renderHook(() => useChallengeData())

    act(() => {
      result.current.handleSelectChange({ target: { value: 'none' } })
    })

    expect(result.current.countryChallenge).toBe('')
  })

  it('adds and removes recipes for the current challenge', () => {
    const { result } = renderHook(() => useChallengeData())

    act(() => {
      result.current.addRecipe('Carbonara')
    })

    expect(result.current.challengeRecipes).toEqual(['Carbonara'])

    act(() => {
      result.current.removeRecipe('Carbonara')
    })

    expect(result.current.challengeRecipes).toEqual([])
  })

  it('does not add a duplicate recipe (case-insensitive, trimmed)', () => {
    const { result } = renderHook(() => useChallengeData())

    act(() => {
      result.current.addRecipe('Paella')
    })
    act(() => {
      result.current.addRecipe('  paella  ')
    })

    expect(result.current.challengeRecipes).toEqual(['Paella'])
  })

  it('marks a country as tasted with its recipes on Done', () => {
    const { result } = renderHook(() => useChallengeData())

    act(() => {
      result.current.handleSelectChange({ target: { value: 'Japan' } })
    })
    act(() => {
      result.current.addRecipe('Ramen')
    })
    act(() => {
      result.current.handleDone()
    })

    expect(result.current.countryChallenge).toBe('')
    expect(result.current.challengeRecipes).toEqual([])
    expect(result.current.countriesTasted).toEqual([
      { country: 'Japan', recipes: ['Ramen'] },
    ])
  })

  it('clears the challenge and any unsaved recipes on Cancel', () => {
    const { result } = renderHook(() => useChallengeData())

    act(() => {
      result.current.handleSelectChange({ target: { value: 'Mexico' } })
    })
    act(() => {
      result.current.addRecipe('Tacos')
    })
    act(() => {
      result.current.handleCancel()
    })

    expect(result.current.countryChallenge).toBe('')
    expect(result.current.challengeRecipes).toEqual([])
    expect(result.current.countriesTasted).toEqual([])
  })

  it('does not let an already-tasted country be selected again', () => {
    const { result } = renderHook(() => useChallengeData())

    act(() => {
      result.current.handleSelectChange({ target: { value: 'Spain' } })
    })
    act(() => {
      result.current.addRecipe('Tortilla')
    })
    act(() => {
      result.current.handleDone()
    })
    act(() => {
      result.current.handleSelectChange({ target: { value: 'Spain' } })
    })

    expect(result.current.countryChallenge).toBe('')
  })

  it('randomCountry only ever picks an untasted country', () => {
    const { result } = renderHook(() => useChallengeData())
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0)

    act(() => {
      result.current.randomCountry()
    })

    expect(result.current.countryChallenge).toBe(world[0])

    randomSpy.mockRestore()
  })

  it('deletes a tasted country', () => {
    const { result } = renderHook(() => useChallengeData())

    act(() => {
      result.current.handleSelectChange({ target: { value: 'Brazil' } })
    })
    act(() => {
      result.current.addRecipe('Feijoada')
    })
    act(() => {
      result.current.handleDone()
    })
    act(() => {
      result.current.deleteCountry('Brazil')
    })

    expect(result.current.countriesTasted).toEqual([])
  })

  it('adds and removes a recipe for an already-tasted country', () => {
    const { result } = renderHook(() => useChallengeData())

    act(() => {
      result.current.handleSelectChange({ target: { value: 'Thailand' } })
    })
    act(() => {
      result.current.addRecipe('Pad Thai')
    })
    act(() => {
      result.current.handleDone()
    })
    act(() => {
      result.current.addRecipeToTastedCountry('Thailand', 'Tom Yum')
    })

    expect(result.current.countriesTasted).toEqual([
      { country: 'Thailand', recipes: ['Pad Thai', 'Tom Yum'] },
    ])

    act(() => {
      result.current.removeRecipeFromTastedCountry('Thailand', 'Pad Thai')
    })

    expect(result.current.countriesTasted).toEqual([
      { country: 'Thailand', recipes: ['Tom Yum'] },
    ])
  })

  it('resets all progress', () => {
    const { result } = renderHook(() => useChallengeData())

    act(() => {
      result.current.handleSelectChange({ target: { value: 'Egypt' } })
    })
    act(() => {
      result.current.addRecipe('Koshari')
    })
    act(() => {
      result.current.handleDone()
    })
    act(() => {
      result.current.handleReset()
    })

    expect(result.current.countriesTasted).toEqual([])
    expect(result.current.countryChallenge).toBe('')
  })

  it('migrates legacy string-only tasted entries to the new shape', () => {
    localStorage.setItem(
      'countriesTasted',
      JSON.stringify(['Canada', 'Peru'])
    )

    const { result } = renderHook(() => useChallengeData())

    expect(result.current.countriesTasted).toEqual([
      { country: 'Canada', recipes: [] },
      { country: 'Peru', recipes: [] },
    ])
  })
})
