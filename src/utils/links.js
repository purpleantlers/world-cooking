const GOOGLE_SEARCH_URL = 'https://www.google.com/search'

/**
 * Builds a Google search URL for a country + topic, e.g. countries with
 * accents or apostrophes (Côte d'Ivoire, São Tomé and Príncipe) are encoded
 * correctly instead of being interpolated raw into the URL.
 */
export const getCountrySearchUrl = (country, topic) => {
  const query = `${country} ${topic}`

  return `${GOOGLE_SEARCH_URL}?q=${encodeURIComponent(query)}`
}
