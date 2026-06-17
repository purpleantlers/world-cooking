import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useLocalStorageState } from './useLocalStorageState'

describe('useLocalStorageState', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns the initial value when nothing is stored', () => {
    const { result } = renderHook(() =>
      useLocalStorageState('test-key', 'default')
    )

    expect(result.current[0]).toBe('default')
  })

  it('persists updates to localStorage', () => {
    const { result } = renderHook(() => useLocalStorageState('test-key', []))

    act(() => {
      result.current[1](['France'])
    })

    expect(result.current[0]).toEqual(['France'])
    expect(JSON.parse(localStorage.getItem('test-key'))).toEqual(['France'])
  })

  it('reads back a previously stored value on a fresh render', () => {
    localStorage.setItem('test-key', JSON.stringify({ foo: 'bar' }))

    const { result } = renderHook(() => useLocalStorageState('test-key', null))

    expect(result.current[0]).toEqual({ foo: 'bar' })
  })

  it('falls back to the initial value if stored data is corrupted', () => {
    localStorage.setItem('test-key', '{not valid json')
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const { result } = renderHook(() =>
      useLocalStorageState('test-key', 'fallback')
    )

    expect(result.current[0]).toBe('fallback')
    expect(warnSpy).toHaveBeenCalled()

    warnSpy.mockRestore()
  })
})
