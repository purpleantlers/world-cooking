import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

/**
 * Fetches food culture content for a given country from the country_info table.
 *
 * Returns:
 * {
 *   countryInfo: {
 *     country:      string
 *     food_culture: string
 *     top_dishes:   { name: string, description: string }[]
 *     chefs_tip:    string
 *   } | null,
 *   loading: boolean,
 * }
 *
 * countryInfo is null while loading or if the country has no entry yet.
 */
export const useCountryInfo = (country) => {
  const [countryInfo, setCountryInfo] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!country) {
      setCountryInfo(null)
      return
    }

    let isMounted = true
    setLoading(true)
    setCountryInfo(null)

    const fetch = async () => {
      const { data, error } = await supabase
        .from('country_info')
        .select('country, food_culture, top_dishes, chefs_tip, image_url')
        .eq('country', country)
        .maybeSingle()

      if (!isMounted) return

      if (error) {
        console.warn(`Could not load country info for ${country}:`, error)
        setCountryInfo(null)
      } else {
        setCountryInfo(data ?? null)
      }

      setLoading(false)
    }

    fetch()

    return () => {
      isMounted = true
    }
  }, [country])

  return { countryInfo, loading }
}
