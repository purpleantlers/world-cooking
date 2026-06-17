import { useState, useEffect } from 'react'
import { world } from '../db'
import { useLocalStorageState } from './useLocalStorageState'

// LocalStorage keys
const COUNTRY_CHALLENGE = 'countryChallenge'
const COUNTRIES_TASTED = 'countriesTasted'
const CHALLENGE_RECIPES = 'challengeRecipes'

const migrateCountriesTasted = (storedValue) => {
  if (!Array.isArray(storedValue)) return []

  return storedValue.map((item) =>
    typeof item === 'string' ? { country: item, recipes: [] } : item,
  )
}

export const useChallengeData = () => {
  const [selectCountry, setSelectCountry] = useState('none')
  const [countryChallenge, setCountryChallenge] = useLocalStorageState(
    COUNTRY_CHALLENGE,
    '',
  )
  const [countriesTasted, setCountriesTasted] = useLocalStorageState(
    COUNTRIES_TASTED,
    [],
  )
  const [challengeRecipes, setChallengeRecipes] = useLocalStorageState(
    CHALLENGE_RECIPES,
    [],
  )

  const ongoingChallenge = !!countryChallenge

  useEffect(() => {
    setCountriesTasted((prev) => {
      const needsMigration = prev.some((item) => typeof item === 'string')

      return needsMigration ? migrateCountriesTasted(prev) : prev
    })
  }, [setCountriesTasted])

  const handleSelectChange = (e) => {
    const newCountry = e.target.value
    const alreadyTasted = countriesTasted.some(
      (tasted) => tasted.country === newCountry,
    )

    if (newCountry !== 'none' && !alreadyTasted) {
      setCountryChallenge(newCountry)
      setSelectCountry('none')
    }
  }

  const randomCountry = () => {
    const untastedCountries = world.filter(
      (country) =>
        !countriesTasted.some((tasted) => tasted.country === country),
    )

    if (untastedCountries.length === 0) return

    const randomIndex = Math.floor(Math.random() * untastedCountries.length)

    setCountryChallenge(untastedCountries[randomIndex])
  }

  const addRecipe = (recipeName) => {
    const trimmedName = recipeName.trim()

    if (!trimmedName) return

    setChallengeRecipes((prevRecipes) => {
      const alreadyAdded = prevRecipes.some(
        (recipe) => recipe.toLowerCase() === trimmedName.toLowerCase(),
      )

      return alreadyAdded ? prevRecipes : [...prevRecipes, trimmedName]
    })
  }

  const removeRecipe = (recipeToRemove) => {
    setChallengeRecipes((prevRecipes) =>
      prevRecipes.filter((recipe) => recipe !== recipeToRemove),
    )
  }

  const handleDone = () => {
    setCountriesTasted((prevCountries) => [
      ...prevCountries,
      { country: countryChallenge, recipes: challengeRecipes },
    ])

    setCountryChallenge('')
    setChallengeRecipes([])
  }

  const handleCancel = () => {
    setCountryChallenge('')
    setChallengeRecipes([])
  }

  const handleReset = () => {
    setCountriesTasted([])
    setCountryChallenge('')
    setChallengeRecipes([])
    setSelectCountry('none')
  }

  const deleteCountry = (countryToRemove) => {
    setCountriesTasted((prevCountries) =>
      prevCountries.filter((tasted) => tasted.country !== countryToRemove),
    )
  }

  const addRecipeToTastedCountry = (country, recipeName) => {
    const trimmedName = recipeName.trim()

    if (!trimmedName) return

    setCountriesTasted((prevCountries) =>
      prevCountries.map((tasted) => {
        if (tasted.country !== country) return tasted

        const alreadyAdded = tasted.recipes.some(
          (recipe) => recipe.toLowerCase() === trimmedName.toLowerCase(),
        )

        return alreadyAdded
          ? tasted
          : { ...tasted, recipes: [...tasted.recipes, trimmedName] }
      }),
    )
  }

  const removeRecipeFromTastedCountry = (country, recipeToRemove) => {
    setCountriesTasted((prevCountries) =>
      prevCountries.map((tasted) =>
        tasted.country !== country
          ? tasted
          : {
              ...tasted,
              recipes: tasted.recipes.filter(
                (recipe) => recipe !== recipeToRemove,
              ),
            },
      ),
    )
  }

  return {
    countryChallenge,
    countriesTasted,
    challengeRecipes,
    ongoingChallenge,
    selectCountry,
    handleSelectChange,
    handleDone,
    handleCancel,
    handleReset,
    deleteCountry,
    addRecipe,
    removeRecipe,
    addRecipeToTastedCountry,
    removeRecipeFromTastedCountry,
    randomCountry,
    world,
  }
}
