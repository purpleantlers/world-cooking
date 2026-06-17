import { useState, useEffect } from 'react'

/**
 * useState backed by localStorage. Falls back to `initialValue` and never
 * throws if the stored data is missing, corrupted, or unparsable - this
 * keeps a bad localStorage value from crashing the whole app on load.
 */
export const useLocalStorageState = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const storedData = localStorage.getItem(key)

      return storedData ? JSON.parse(storedData) : initialValue
    } catch (error) {
      console.warn(`Could not read "${key}" from localStorage:`, error)

      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn(`Could not save "${key}" to localStorage:`, error)
    }
  }, [key, value])

  return [value, setValue]
}
