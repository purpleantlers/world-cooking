import { useState, useEffect } from 'react'

/**
 * useState backed by localStorage. Falls back to `initialValue` and never
 * throws if the stored data is missing, corrupted, or unparsable - this
 * keeps a bad localStorage value from crashing the whole app on load.
 *
 * An optional `migrate` function can be passed to transform a successfully
 * parsed value (e.g. upgrading an older stored shape to a newer one) before
 * it's used as the initial state. It runs synchronously during the lazy
 * state initializer, so the very first render already sees the migrated
 * shape - unlike a useEffect-based migration, which only fixes things up
 * after a first render that may already have crashed on the old shape.
 */
export const useLocalStorageState = (key, initialValue, migrate) => {
  const [value, setValue] = useState(() => {
    try {
      const storedData = localStorage.getItem(key)
      const parsedValue = storedData ? JSON.parse(storedData) : initialValue

      return migrate ? migrate(parsedValue) : parsedValue
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
