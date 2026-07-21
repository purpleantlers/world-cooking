const GOOGLE_SEARCH_URL = 'https://www.google.com/search'

export const getCountrySearchUrl = (country, topic) => {
  const query = `${country} ${topic}`

  return `${GOOGLE_SEARCH_URL}?q=${encodeURIComponent(query)}`
}
