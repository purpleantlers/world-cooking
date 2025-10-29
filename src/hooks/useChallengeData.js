import { useState, useEffect, useCallback } from 'react'
import { world } from '../db'

// LocalStorage
const COUNTRY_CHALLENGE = 'countryChallenge'
const COUNTRIES_TASTED = 'countriesTasted'

export const useChallengeData = () => {
  const [ongoingChallenge, setOngoingChallenge] = useState()
  const [selectCountry, setSelectCountry] = useState('none')
  const [countryChallenge, setCountryChallenge] = useState(() => {
    const storedData = localStorage.getItem(COUNTRY_CHALLENGE)

    return storedData ? JSON.parse(storedData) : ''
  })
  const [countriesTasted, setCountriesTasted] = useState(() => {
    const storedData = localStorage.getItem(COUNTRIES_TASTED)

    return storedData ? JSON.parse(storedData) : []
  })

  useEffect(() => {
    localStorage.setItem(COUNTRIES_TASTED, JSON.stringify(countriesTasted))
  }, [countriesTasted])

  useEffect(() => {
    localStorage.setItem(COUNTRY_CHALLENGE, JSON.stringify(countryChallenge))
    const ongoingChallenge = !!countryChallenge

    setOngoingChallenge(ongoingChallenge)
  }, [countryChallenge])

  const handleSelectChange = useCallback((e) => {
    const newCountry = e.target.value

    if (newCountry !== 'none' && !countriesTasted.includes(newCountry)) {
      setCountryChallenge(newCountry)
      setSelectCountry('none')
      setOngoingChallenge(true)
    }
  })

  const randomCountry = useCallback(() => {
    const randomNumber = Math.floor(Math.random() * world.length)
    const newCountry = world[randomNumber]

    if (!countriesTasted.includes(newCountry)) {
      setCountryChallenge(newCountry)
      setOngoingChallenge(true)
    } else {
      randomCountry()
    }
  })

  const handleDone = useCallback(() => {
    setCountriesTasted((prevCountries) => [...prevCountries, countryChallenge])

    setCountryChallenge('')
  })

  const handleCancel = useCallback(() => {
    setCountryChallenge('')
    setOngoingChallenge(false)
  })

  const handleReset = useCallback(() => {
    localStorage.removeItem(COUNTRIES_TASTED)
    localStorage.removeItem(COUNTRY_CHALLENGE)

    setCountriesTasted([])
    setCountryChallenge('')
    setSelectCountry('none')
  }, [])

  const deleteCountry = useCallback((countryToRemove) => {
    setCountriesTasted((prevCountries) =>
      prevCountries.filter((country) => country !== countryToRemove)
    )
  })

  return {
    countryChallenge,
    countriesTasted,
    ongoingChallenge,
    selectCountry,
    handleSelectChange,
    handleDone,
    handleCancel,
    handleReset,
    deleteCountry,
    randomCountry,
    world,
  }
}
