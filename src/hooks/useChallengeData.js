import { useEffect, useState } from 'react'
import imageCompression from 'browser-image-compression'
import { world } from '../db'
import { supabase } from '../lib/supabaseClient'

// Recipe
const emptyRecipe = (name = '') => ({
  id: null,
  name,
  intro: '',
  ingredients: '',
  method: '',
  photo_url: '',
  entry_number: null,
  cookedAt: null,
})

// Legacy migration
const migrateCountriesTasted = (storedValue) => {
  if (!Array.isArray(storedValue)) return []
  return storedValue.map((item) =>
    typeof item === 'string' ? { country: item, recipes: [] } : item,
  )
}

const readLegacyLocalData = () => {
  try {
    const rawChallenge = localStorage.getItem('countryChallenge')
    const rawTasted = localStorage.getItem('countriesTasted')
    const rawRecipes = localStorage.getItem('challengeRecipes')
    return {
      countryChallenge: rawChallenge ? JSON.parse(rawChallenge) : '',
      countriesTasted: migrateCountriesTasted(
        rawTasted ? JSON.parse(rawTasted) : [],
      ),
      challengeRecipes: rawRecipes ? JSON.parse(rawRecipes) : [],
    }
  } catch (error) {
    console.warn('Could not read legacy local data:', error)
    return { countryChallenge: '', countriesTasted: [], challengeRecipes: [] }
  }
}

// Supabase helpers
const recipeSelect =
  'id, name, intro, ingredients, method, photo_url, entry_number, created_at'

const fetchTastedCountries = async (userId) => {
  const { data, error } = await supabase
    .from('tasted_countries')
    .select(`country, created_at, recipes(${recipeSelect})`)
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .order('created_at', { ascending: true, foreignTable: 'recipes' })

  if (error) {
    console.warn('Could not load tasted countries:', error)
    return []
  }

  return data.map((row) => ({
    country: row.country,
    tastedAt: row.created_at,
    // Flat name array kept for backwards compat with Passport/StampDetail
    recipes: row.recipes.map((r) => r.name),
    // Full detail objects used by Journal and Challenge
    recipeDetails: row.recipes.map((r) => ({
      id: r.id,
      name: r.name,
      intro: r.intro ?? '',
      ingredients: r.ingredients ?? '',
      method: r.method ?? '',
      photo_url: r.photo_url ?? '',
      entry_number: r.entry_number,
      cookedAt: r.created_at,
    })),
  }))
}

const fetchCurrentChallenge = async (userId) => {
  const { data, error } = await supabase
    .from('current_challenge')
    .select('country, recipes')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    console.warn('Could not load current challenge:', error)
    return null
  }

  return data
}

// File signature validation
// Magic bytes for PNG and JPEG files. Used to validate the real file type
const FILE_SIGNATURES = {
  png: [0x89, 0x50, 0x4e, 0x47], // \x89 P N G
  jpeg: [0xff, 0xd8, 0xff], // JPEG always starts this way
}

const detectImageType = async (file) => {
  const buffer = await file.slice(0, 4).arrayBuffer()
  const bytes = new Uint8Array(buffer)

  const matches = (signature) => signature.every((byte, i) => bytes[i] === byte)

  if (matches(FILE_SIGNATURES.png)) return 'png'
  if (matches(FILE_SIGNATURES.jpeg)) return 'jpeg'
  return null
}

const MAX_RAW_FILE_SIZE = 15 * 1024 * 1024 // 15MB

// Photo upload helpers
const compressPhoto = async (file) => {
  try {
    return await imageCompression(file, {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
      fileType: 'image/jpeg',
    })
  } catch (error) {
    console.warn('Could not compress photo, uploading original:', error)
    return file
  }
}

// Upload a recipe photo to Supabase Storage. Returns the public URL
export const uploadRecipePhoto = async (userId, file) => {
  if (!file) return { url: null, error: 'No file selected.' }

  if (file.size > MAX_RAW_FILE_SIZE) {
    return { url: null, error: 'Image is too large (max 15MB).' }
  }

  const detectedType = await detectImageType(file)
  if (!detectedType) {
    return { url: null, error: 'Only PNG or JPEG images are allowed.' }
  }

  const compressed = await compressPhoto(file)
  const path = `${userId}/${Date.now()}.jpg`

  const { error } = await supabase.storage
    .from('recipe-photos')
    .upload(path, compressed, {
      upsert: false,
      contentType: 'image/jpeg',
    })

  if (error) {
    console.warn('Could not upload photo:', error)
    return { url: null, error: 'Upload failed. Please try again.' }
  }

  const { data } = supabase.storage.from('recipe-photos').getPublicUrl(path)

  return { url: data.publicUrl, error: null }
}

// Delete a recipe photo from Supabase Storage given its public URL
export const deleteRecipePhoto = async (publicUrl) => {
  if (!publicUrl) return
  // Extract the path after '/recipe-photos/'
  const marker = '/recipe-photos/'
  const idx = publicUrl.indexOf(marker)
  if (idx === -1) return
  const path = publicUrl.slice(idx + marker.length)
  await supabase.storage.from('recipe-photos').remove([path])
}

// Legacy import
const importLegacyData = async (userId) => {
  const legacy = readLegacyLocalData()
  const hasLegacyData =
    legacy.countriesTasted.length > 0 || !!legacy.countryChallenge

  if (!hasLegacyData) return null

  for (const { country, recipes } of legacy.countriesTasted) {
    const { data: countryRow, error } = await supabase
      .from('tasted_countries')
      .insert({ user_id: userId, country })
      .select('id')
      .single()

    if (error || !countryRow) continue

    if (recipes.length > 0) {
      await supabase.from('recipes').insert(
        recipes.map((name) => ({
          user_id: userId,
          tasted_country_id: countryRow.id,
          name,
        })),
      )
    }
  }

  if (legacy.countryChallenge) {
    await supabase.from('current_challenge').upsert({
      user_id: userId,
      country: legacy.countryChallenge,
      recipes: legacy.challengeRecipes,
    })
  }

  localStorage.removeItem('countryChallenge')
  localStorage.removeItem('countriesTasted')
  localStorage.removeItem('challengeRecipes')

  return legacy
}

// Hook
export const useChallengeData = (user) => {
  const [selectCountry, setSelectCountry] = useState('none')
  const [countryChallenge, setCountryChallenge] = useState('')
  const [countriesTasted, setCountriesTasted] = useState([])

  // If the user has no data in Supabase, check localStorage for old data and migrate it to the new schema
  const [challengeRecipes, setChallengeRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setCountriesTasted([])
      setCountryChallenge('')
      setChallengeRecipes([])
      setSelectCountry('none')
      setLoading(false)
      return
    }

    let isMounted = true
    setLoading(true)

    const load = async () => {
      const [tastedRows, challengeRow] = await Promise.all([
        fetchTastedCountries(user.id),
        fetchCurrentChallenge(user.id),
      ])

      let tasted = tastedRows
      let challenge = challengeRow?.country ?? ''
      // Legacy current_challenge stored recipes as string[]; normalise to objects
      let recipes = (challengeRow?.recipes ?? []).map((r) =>
        typeof r === 'string' ? emptyRecipe(r) : r,
      )

      const hasServerData = tastedRows.length > 0 || !!challengeRow

      if (!hasServerData) {
        const imported = await importLegacyData(user.id)
        if (imported) {
          tasted = await fetchTastedCountries(user.id)
          challenge = imported.countryChallenge
          recipes = imported.challengeRecipes.map((r) =>
            typeof r === 'string' ? emptyRecipe(r) : r,
          )
        }
      }

      if (isMounted) {
        setCountriesTasted(tasted)
        setCountryChallenge(challenge)
        setChallengeRecipes(recipes)
        setLoading(false)
      }
    }

    load()
    return () => {
      isMounted = false
    }
  }, [user])

  const ongoingChallenge = !!countryChallenge

  // Country selection
  const handleSelectChange = async (e) => {
    const newCountry = e.target.value
    const alreadyTasted = countriesTasted.some((t) => t.country === newCountry)
    if (newCountry === 'none' || alreadyTasted) return

    const { error } = await supabase
      .from('current_challenge')
      .upsert({ user_id: user.id, country: newCountry, recipes: [] })

    if (error) {
      console.warn('Could not start challenge:', error)
      return
    }

    setCountryChallenge(newCountry)
    setSelectCountry('none')
  }

  const randomCountry = async () => {
    const untasted = world.filter(
      (c) => !countriesTasted.some((t) => t.country === c),
    )
    if (untasted.length === 0) return

    const chosen = untasted[Math.floor(Math.random() * untasted.length)]

    const { error } = await supabase
      .from('current_challenge')
      .upsert({ user_id: user.id, country: chosen, recipes: [] })

    if (error) {
      console.warn('Could not start challenge:', error)
      return
    }

    setCountryChallenge(chosen)
  }

  // In-progress recipe management
  // addRecipe now accepts a full recipe object or just a name string
  const addRecipe = async (recipeOrName) => {
    const recipe =
      typeof recipeOrName === 'string'
        ? emptyRecipe(recipeOrName)
        : recipeOrName

    const trimmedName = recipe.name.trim()
    if (!trimmedName) return

    const alreadyAdded = challengeRecipes.some(
      (r) => r.name.toLowerCase() === trimmedName.toLowerCase(),
    )
    if (alreadyAdded) return

    const updated = [...challengeRecipes, { ...recipe, name: trimmedName }]

    // Persist to current_challenge as plain objects (photo_url stored as URL string)
    const { error } = await supabase
      .from('current_challenge')
      .update({ recipes: updated })
      .eq('user_id', user.id)

    if (error) return
    setChallengeRecipes(updated)
  }

  // Update a recipe that's already in the in-progress list
  const updateChallengeRecipe = async (recipeName, updates) => {
    const updated = challengeRecipes.map((r) =>
      r.name === recipeName ? { ...r, ...updates } : r,
    )

    const { error } = await supabase
      .from('current_challenge')
      .update({ recipes: updated })
      .eq('user_id', user.id)

    if (error) return
    setChallengeRecipes(updated)
  }

  const removeRecipe = async (recipeName) => {
    const recipe = challengeRecipes.find((r) => r.name === recipeName)
    // Clean up any uploaded photo if one was attached
    if (recipe?.photo_url) await deleteRecipePhoto(recipe.photo_url)

    const updated = challengeRecipes.filter((r) => r.name !== recipeName)

    const { error } = await supabase
      .from('current_challenge')
      .update({ recipes: updated })
      .eq('user_id', user.id)

    if (error) return
    setChallengeRecipes(updated)
  }

  // Completing a challenge
  const handleDone = async () => {
    const { data: countryRow, error } = await supabase
      .from('tasted_countries')
      .insert({ user_id: user.id, country: countryChallenge })
      .select('id, created_at')
      .single()

    if (error) {
      console.warn('Could not save tasted country:', error)
      return
    }

    let recipeDetails = []

    if (challengeRecipes.length > 0) {
      const { data: insertedRecipes } = await supabase
        .from('recipes')
        .insert(
          challengeRecipes.map((r) => ({
            user_id: user.id,
            tasted_country_id: countryRow.id,
            name: r.name,
            intro: r.intro || null,
            ingredients: r.ingredients || null,
            method: r.method || null,
            photo_url: r.photo_url || null,
            // entry_number is assigned automatically by the DB trigger
          })),
        )
        .select(recipeSelect)

      recipeDetails = (insertedRecipes ?? []).map((r) => ({
        id: r.id,
        name: r.name,
        intro: r.intro ?? '',
        ingredients: r.ingredients ?? '',
        method: r.method ?? '',
        photo_url: r.photo_url ?? '',
        entry_number: r.entry_number,
        cookedAt: r.created_at,
      }))
    }

    await supabase.from('current_challenge').delete().eq('user_id', user.id)

    setCountriesTasted((prev) => [
      ...prev,
      {
        country: countryChallenge,
        recipes: challengeRecipes.map((r) => r.name),
        tastedAt: countryRow.created_at,
        recipeDetails,
      },
    ])
    setCountryChallenge('')
    setChallengeRecipes([])
  }

  const handleCancel = async () => {
    // Clean up any photos uploaded during the challenge
    for (const r of challengeRecipes) {
      if (r.photo_url) await deleteRecipePhoto(r.photo_url)
    }
    await supabase.from('current_challenge').delete().eq('user_id', user.id)
    setCountryChallenge('')
    setChallengeRecipes([])
  }

  const handleReset = async () => {
    // Fetch all photo_urls before deleting rows so we can clean up Storage
    const { data: allRecipes } = await supabase
      .from('recipes')
      .select('photo_url')
      .eq('user_id', user.id)

    for (const r of allRecipes ?? []) {
      if (r.photo_url) await deleteRecipePhoto(r.photo_url)
    }

    await supabase.from('tasted_countries').delete().eq('user_id', user.id)
    await supabase.from('current_challenge').delete().eq('user_id', user.id)

    setCountriesTasted([])
    setCountryChallenge('')
    setChallengeRecipes([])
    setSelectCountry('none')
  }

  // Post-challenge recipe management
  const getTastedCountryId = async (country) => {
    const { data } = await supabase
      .from('tasted_countries')
      .select('id')
      .eq('user_id', user.id)
      .eq('country', country)
      .single()
    return data?.id ?? null
  }

  const addRecipeToTastedCountry = async (country, recipeOrName) => {
    const recipe =
      typeof recipeOrName === 'string'
        ? emptyRecipe(recipeOrName)
        : recipeOrName

    const trimmedName = recipe.name.trim()
    if (!trimmedName) return

    const existing = countriesTasted.find((t) => t.country === country)
    if (!existing) return

    const alreadyAdded = existing.recipes.some(
      (r) => r.toLowerCase() === trimmedName.toLowerCase(),
    )
    if (alreadyAdded) return

    const countryId = await getTastedCountryId(country)
    if (!countryId) return

    const { data: inserted, error } = await supabase
      .from('recipes')
      .insert({
        user_id: user.id,
        tasted_country_id: countryId,
        name: trimmedName,
        intro: recipe.intro || null,
        ingredients: recipe.ingredients || null,
        method: recipe.method || null,
        photo_url: recipe.photo_url || null,
      })
      .select(recipeSelect)
      .single()

    if (error) return

    const detail = {
      id: inserted.id,
      name: inserted.name,
      intro: inserted.intro ?? '',
      ingredients: inserted.ingredients ?? '',
      method: inserted.method ?? '',
      photo_url: inserted.photo_url ?? '',
      entry_number: inserted.entry_number,
      cookedAt: inserted.created_at,
    }

    setCountriesTasted((prev) =>
      prev.map((t) =>
        t.country !== country
          ? t
          : {
              ...t,
              recipes: [...t.recipes, trimmedName],
              recipeDetails: [...(t.recipeDetails ?? []), detail],
            },
      ),
    )
  }

  const removeRecipeFromTastedCountry = async (country, recipeName) => {
    const countryEntry = countriesTasted.find((t) => t.country === country)
    const recipe = countryEntry?.recipeDetails?.find(
      (r) => r.name === recipeName,
    )
    if (recipe?.photo_url) await deleteRecipePhoto(recipe.photo_url)

    const countryId = await getTastedCountryId(country)
    if (!countryId) return

    await supabase
      .from('recipes')
      .delete()
      .eq('user_id', user.id)
      .eq('tasted_country_id', countryId)
      .eq('name', recipeName)

    setCountriesTasted((prev) =>
      prev.map((t) =>
        t.country !== country
          ? t
          : {
              ...t,
              recipes: t.recipes.filter((r) => r !== recipeName),
              recipeDetails: (t.recipeDetails ?? []).filter(
                (r) => r.name !== recipeName,
              ),
            },
      ),
    )
  }

  // Update a recipe that's already in the tasted country list
  const updateRecipe = async (recipeId, updates) => {
    const { intro, ingredients, method, photo_url, name } = updates

    const { data: updated, error } = await supabase
      .from('recipes')
      .update({
        ...(name !== undefined && { name }),
        ...(intro !== undefined && { intro }),
        ...(ingredients !== undefined && { ingredients }),
        ...(method !== undefined && { method }),
        ...(photo_url !== undefined && { photo_url }),
      })
      .eq('id', recipeId)
      .eq('user_id', user.id)
      .select(recipeSelect)
      .single()

    if (error) {
      console.warn('Could not update recipe:', error)
      return
    }

    // Reflect the update in local state without a full refetch
    setCountriesTasted((prev) =>
      prev.map((t) => ({
        ...t,
        recipes: t.recipeDetails
          ? t.recipeDetails.map((r) =>
              r.id === recipeId ? updated.name : r.name,
            )
          : t.recipes,
        recipeDetails: (t.recipeDetails ?? []).map((r) =>
          r.id !== recipeId
            ? r
            : {
                ...r,
                name: updated.name,
                intro: updated.intro ?? '',
                ingredients: updated.ingredients ?? '',
                method: updated.method ?? '',
                photo_url: updated.photo_url ?? '',
              },
        ),
      })),
    )
  }

  return {
    countryChallenge,
    countriesTasted,
    challengeRecipes,
    ongoingChallenge,
    selectCountry,
    loading,
    handleSelectChange,
    handleDone,
    handleCancel,
    handleReset,
    deleteCountry: async (countryToRemove) => {
      // Delete associated photos first
      const entry = countriesTasted.find((t) => t.country === countryToRemove)
      for (const r of entry?.recipeDetails ?? []) {
        if (r.photo_url) await deleteRecipePhoto(r.photo_url)
      }
      await supabase
        .from('tasted_countries')
        .delete()
        .eq('user_id', user.id)
        .eq('country', countryToRemove)
      setCountriesTasted((prev) =>
        prev.filter((t) => t.country !== countryToRemove),
      )
    },
    addRecipe,
    removeRecipe,
    updateChallengeRecipe,
    addRecipeToTastedCountry,
    removeRecipeFromTastedCountry,
    updateRecipe,
    uploadRecipePhoto,
    randomCountry,
    world,
  }
}
