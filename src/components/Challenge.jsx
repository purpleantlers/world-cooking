import { useState, useRef, useEffect } from 'react'
import { getCountrySearchUrl } from '../utils/links'
import { uploadRecipePhoto, deleteRecipePhoto } from '../hooks/useChallengeData'
import ConfirmModal from './ConfirmModal'
import PhotoCropModal from './PhotoCropModal'
import { readFileAsDataUrl, getCroppedImageFile } from '../utils/imageCrop'

// Icons
function BookIcon() {
  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='currentColor'
      xmlns='http://www.w3.org/2000/svg'
      className='w-5 h-5'
    >
      <path
        d='M17.2529 3.87498C16.2726 3.86742 15.3007 4.05665 14.3948 4.43148C13.489 4.8063 12.6675 5.35909 11.9792 6.0571C11.2908 5.35909 10.4694 4.8063 9.56349 4.43148C8.65763 4.05665 7.68577 3.86742 6.70545 3.87498C5.64158 3.86556 4.58878 4.09143 3.6224 4.53643C2.65602 4.98143 1.79996 5.63456 1.11549 6.44906C1.01133 6.58432 0.955947 6.75082 0.958325 6.92152V19.9453C0.959826 20.0991 1.00576 20.2493 1.0906 20.3776C1.17544 20.506 1.29557 20.6071 1.43653 20.6688C1.57182 20.7296 1.72057 20.7542 1.86823 20.7403C2.01588 20.7263 2.15739 20.6743 2.27891 20.5893C3.58602 19.7041 5.12973 19.2339 6.70833 19.2399C8.51301 19.2152 10.2662 19.8415 11.6466 21.0042L11.9437 21.3444L12.3117 21.0042C13.6923 19.8419 15.4454 19.2159 17.25 19.2409C18.8295 19.2349 20.3739 19.7058 21.6813 20.5921C21.8029 20.6754 21.9438 20.7263 22.0905 20.7398C22.2373 20.7534 22.3851 20.7293 22.5199 20.6698C22.6611 20.6083 22.7816 20.5073 22.8668 20.3789C22.9519 20.2505 22.9982 20.1003 23 19.9462V6.92152C23.0025 6.75214 22.9482 6.58679 22.8457 6.45194C22.161 5.63674 21.3046 4.98299 20.3377 4.53748C19.3708 4.09198 18.3174 3.86575 17.2529 3.87498ZM1.91666 19.6779V6.97998C2.51187 6.29681 3.24834 5.75105 4.07516 5.38041C4.90198 5.00977 5.79942 4.82311 6.70545 4.83331C7.61237 4.82518 8.51034 5.01313 9.33787 5.3843C10.1654 5.75547 10.9029 6.3011 11.5 6.98381V19.6846C10.0722 18.763 8.40768 18.2756 6.70833 18.2816C5.01056 18.2791 3.34765 18.7643 1.91666 19.6779ZM22.0417 19.6779C20.6109 18.7637 18.9479 18.2792 17.25 18.2816C15.5506 18.2756 13.8861 18.763 12.4583 19.6846V6.98381C13.0601 6.30783 13.798 5.76675 14.6236 5.39609C15.4492 5.02543 16.3439 4.83358 17.2489 4.83313C18.1539 4.83268 19.0488 5.02363 19.8748 5.39346C20.7008 5.76329 21.4392 6.30364 22.0417 6.97902V19.6779Z'
        fill='black'
      />
    </svg>
  )
}

function UtensilsIcon() {
  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className='w-5 h-5'
    >
      <path
        d='M1 17.2622H23M10.6655 6.47863C10.6655 5.64912 11.3147 4.99994 12.1442 4.99994C12.9737 4.99994 13.6229 5.64912 13.6229 6.47863M21.918 16.1442C21.918 10.8065 17.2295 6.44257 12 6.44257C6.7705 6.44257 2.08198 10.7704 2.08198 16.1442C2.08198 16.5409 2.11804 16.9016 2.15411 17.2622H21.8459C21.882 16.9016 21.918 16.5409 21.918 16.1442ZM21.5574 17.9835C21.5574 18.1999 21.3771 18.3442 21.1968 18.3442H3.20003C2.98364 18.3442 2.83937 18.1639 2.83937 17.9835V17.6229C2.83937 17.4065 3.0197 17.2622 3.20003 17.2622H21.1968C21.4131 17.2622 21.5574 17.4426 21.5574 17.6229V17.9835Z'
        stroke='currentColor'
      />
    </svg>
  )
}

function BulbIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='currentColor'
      className='w-5 h-5'
    >
      <path d='M12 .75a8.25 8.25 0 00-4.135 15.39c.686.398 1.115 1.008 1.134 1.623a.75.75 0 00.577.706c.352.083.71.148 1.074.195.323.041.6-.218.6-.544v-4.661a6.714 6.714 0 01-.937-.171.75.75 0 11.374-1.453 5.261 5.261 0 002.626 0 .75.75 0 11.374 1.452 6.712 6.712 0 01-.937.172v4.66c0 .327.277.586.6.545.364-.047.722-.112 1.074-.195a.75.75 0 00.577-.706c.02-.615.448-1.225 1.134-1.623A8.25 8.25 0 0012 .75z' />
      <path
        fillRule='evenodd'
        d='M9.013 19.9a.75.75 0 01.877-.597 11.319 11.319 0 004.22 0 .75.75 0 11.28 1.473 12.819 12.819 0 01-4.78 0 .75.75 0 01-.597-.876zM9.754 22.344a.75.75 0 01.824-.668 13.682 13.682 0 002.844 0 .75.75 0 11.156 1.492 15.156 15.156 0 01-3.156 0 .75.75 0 01-.668-.824z'
        clipRule='evenodd'
      />
    </svg>
  )
}

function ChevronIcon({ open }) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      className={`w-4 h-4 text-text-muted transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M19.5 8.25l-7.5 7.5-7.5-7.5'
      />
    </svg>
  )
}

function SkeletonBlock({ className }) {
  return <div className={`bg-primary-100 rounded animate-pulse ${className}`} />
}

// Recipe Card
function RecipeCard({ recipe, userId, onUpdate, onRemove }) {
  const [open, setOpen] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef()

  // Local state so typing is instant. onBlur flushes to parent which persists to Supabase
  const [intro, setIntro] = useState(recipe.intro ?? '')
  const [ingredients, setIngredients] = useState(recipe.ingredients ?? '')
  const [method, setMethod] = useState(recipe.method ?? '')

  const flush = (key, value) => onUpdate(recipe.name, { [key]: value })

  // Keep a ref to the current photo URL so we can compare against it when uploading a new one or removing
  const photoUrlRef = useRef(recipe.photo_url ?? '')
  useEffect(() => {
    photoUrlRef.current = recipe.photo_url ?? ''
  }, [recipe.photo_url])

  // Pending file being cropped before upload: { src, fileName } | null
  const [cropTarget, setCropTarget] = useState(null)

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0]
    // Reset the input so selecting the same file again still fires onChange
    e.target.value = ''
    if (!file || !userId) return
    try {
      const src = await readFileAsDataUrl(file)
      setCropTarget({ src, fileName: file.name || 'photo.jpg' })
    } catch {
      alert('Could not read that image, please try another file.')
    }
  }

  // Re-open the cropper on the photo that's already set, without needing to pick a new file first
  const handleAdjustCrop = () => {
    if (!photoUrlRef.current) return
    setCropTarget({ src: photoUrlRef.current, fileName: 'photo.jpg' })
  }

  const handleCropCancel = () => setCropTarget(null)

  const handleCropConfirm = async (croppedAreaPixels) => {
    if (!cropTarget || !userId) return
    setUploading(true)
    try {
      const croppedFile = await getCroppedImageFile(
        cropTarget.src,
        croppedAreaPixels,
        cropTarget.fileName,
      )
      const { url, error } = await uploadRecipePhoto(userId, croppedFile)
      if (url) {
        const previousUrl = photoUrlRef.current
        // Update the ref immediately so if the user removes the photo before the parent re-renders, we still know what to delete
        photoUrlRef.current = url
        await onUpdate(recipe.name, { photo_url: url })
        if (previousUrl && previousUrl !== url) {
          await deleteRecipePhoto(previousUrl)
        }
      } else if (error) {
        alert(error)
      }
    } catch {
      alert('Could not crop that image, please try again.')
    } finally {
      setUploading(false)
      setCropTarget(null)
    }
  }

  const handleRemovePhoto = async () => {
    const previousUrl = photoUrlRef.current
    photoUrlRef.current = ''
    await onUpdate(recipe.name, { photo_url: '' })
    // Clean up the now-unreferenced file in Storage.
    if (previousUrl) await deleteRecipePhoto(previousUrl)
  }

  return (
    <div className='border border-border rounded-xl overflow-hidden bg-background'>
      {/* Card header */}
      <div className='flex items-center justify-between px-4 py-3'>
        <button
          type='button'
          onClick={() => setOpen((o) => !o)}
          className='flex items-center gap-2 flex-1 text-left cursor-pointer'
        >
          <span className='text-sm font-semibold text-text truncate'>
            {recipe.name}
          </span>
          <ChevronIcon open={open} />
        </button>
        <button
          type='button'
          onClick={() => onRemove(recipe.name)}
          aria-label={`Remove ${recipe.name}`}
          className='ml-2 text-text-muted hover:text-primary transition-colors duration-300 cursor-pointer text-lg leading-none font-bold shrink-0'
        >
          ×
        </button>
      </div>

      {/* Expanded fields */}
      {open && (
        <div className='flex flex-col gap-3 px-4 pb-4 border-t border-border pt-3'>
          {/* Photo upload */}
          <div className='flex flex-col gap-1.5'>
            <span className='text-[10px] font-bold tracking-widest uppercase text-text-muted'>
              Photo
            </span>
            {recipe.photo_url ? (
              <div className='relative w-full h-36 rounded-lg overflow-hidden group'>
                <img
                  src={recipe.photo_url}
                  alt={recipe.name}
                  className='w-full h-full object-cover'
                />
                <div className='absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                  <button
                    type='button'
                    onClick={handleAdjustCrop}
                    disabled={uploading}
                    className='bg-black/50 text-white text-xs px-2 py-1 rounded-lg cursor-pointer disabled:opacity-50'
                  >
                    {uploading ? 'Uploading…' : 'Adjust crop'}
                  </button>
                  <button
                    type='button'
                    onClick={handleRemovePhoto}
                    disabled={uploading}
                    className='bg-black/50 text-white text-xs px-2 py-1 rounded-lg cursor-pointer disabled:opacity-50'
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                type='button'
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className='w-full h-24 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-1 text-text-muted hover:border-primary hover:text-primary transition-colors duration-300 cursor-pointer disabled:opacity-50'
              >
                {uploading ? (
                  <span className='text-xs'>Uploading…</span>
                ) : (
                  <>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='currentColor'
                      className='w-5 h-5'
                    >
                      <path
                        fillRule='evenodd'
                        d='M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z'
                        clipRule='evenodd'
                      />
                    </svg>
                    <span className='text-xs font-medium'>Upload photo</span>
                  </>
                )}
              </button>
            )}
            <input
              ref={fileRef}
              type='file'
              accept='image/*'
              className='hidden'
              onChange={handlePhotoChange}
            />
          </div>

          {/* Intro */}
          <div className='flex flex-col gap-1.5'>
            <div className='flex items-center justify-between'>
              <label className='text-[10px] font-bold tracking-widest uppercase text-text-muted'>
                Introduction
              </label>
              <span className='text-[10px] text-text-muted'>
                {intro.length}/500
              </span>
            </div>
            <textarea
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              onBlur={() => flush('intro', intro)}
              placeholder='What is this dish? Where does it come from?'
              rows={2}
              maxLength={500}
              className='border border-border bg-surface rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors duration-300 resize-none'
            />
          </div>

          {/* Ingredients */}
          <div className='flex flex-col gap-1.5'>
            <div className='flex items-center justify-between'>
              <label className='text-[10px] font-bold tracking-widest uppercase text-text-muted'>
                Ingredients
              </label>
              <span className='text-[10px] text-text-muted'>
                {ingredients.length}/2000
              </span>
            </div>
            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              onBlur={() => flush('ingredients', ingredients)}
              placeholder={'500g flour\n2 eggs\n…'}
              rows={3}
              maxLength={2000}
              className='border border-border bg-surface rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors duration-300 resize-none font-mono'
            />
          </div>

          {/* Method */}
          <div className='flex flex-col gap-1.5'>
            <div className='flex items-center justify-between'>
              <label className='text-[10px] font-bold tracking-widest uppercase text-text-muted'>
                Method
              </label>
              <span className='text-[10px] text-text-muted'>
                {method.length}/5000
              </span>
            </div>
            <textarea
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              onBlur={() => flush('method', method)}
              placeholder={'1. Preheat the oven…\n2. Mix the…'}
              rows={4}
              maxLength={5000}
              className='border border-border bg-surface rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors duration-300 resize-none'
            />
          </div>
        </div>
      )}

      {cropTarget && (
        <PhotoCropModal
          imageSrc={cropTarget.src}
          onCancel={handleCropCancel}
          onConfirm={handleCropConfirm}
        />
      )}
    </div>
  )
}

// ── Main Challenge component ─────────
function Challenge({
  countryChallenge,
  challengeRecipes,
  addRecipe,
  removeRecipe,
  updateChallengeRecipe,
  done,
  cancel,
  countryInfo = null,
  userId = null,
}) {
  const [recipeInput, setRecipeInput] = useState('')
  const [showDoneConfirm, setShowDoneConfirm] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  const handleDoneConfirmed = () => {
    setShowDoneConfirm(false)
    done()
  }

  const handleCancelConfirmed = () => {
    setShowCancelConfirm(false)
    cancel()
  }

  const handleAddRecipe = () => {
    const name = recipeInput.trim()
    if (!name) return
    addRecipe({ name, intro: '', ingredients: '', method: '', photo_url: '' })
    setRecipeInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddRecipe()
    }
  }

  return (
    <div className='max-w-6xl mx-auto w-full px-6 py-10'>
      <div className='grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start'>
        {/* Left column */}
        <div className='flex flex-col gap-6'>
          {/* Country hero */}
          <div className='relative rounded-xl overflow-hidden bg-text h-56 flex items-end'>
            {/* Background image */}
            {countryInfo?.image_url && (
              <img
                src={countryInfo.image_url}
                alt={countryChallenge}
                className='absolute inset-0 w-full h-full object-cover'
              />
            )}
            {/* Gradient overlay */}
            <div className='absolute inset-0 bg-linear-to-t from-black via-black/5 to-transparent z-10' />
            <div className='relative z-20 p-6'>
              <h2 className='text-4xl font-bold text-white'>
                {countryChallenge}
              </h2>
            </div>
          </div>

          {/* Food Culture */}
          <div className='bg-surface border border-border rounded-xl p-6 flex flex-col gap-3'>
            <h3 className='flex items-center gap-2 text-base font-bold text-secondary'>
              <BookIcon /> Food Culture
            </h3>
            {countryInfo ? (
              <p className='text-sm text-text-muted leading-7'>
                {countryInfo.food_culture}
              </p>
            ) : (
              <div className='flex flex-col gap-2'>
                <SkeletonBlock className='h-4 w-full' />
                <SkeletonBlock className='h-4 w-5/6' />
                <SkeletonBlock className='h-4 w-4/6' />
                <a
                  href={getCountrySearchUrl(countryChallenge, 'food culture')}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-xs text-primary underline underline-offset-2 mt-1 self-start'
                >
                  Search on Google →
                </a>
              </div>
            )}
          </div>

          {/* Top 5 Dishes */}
          <div className='bg-surface border border-border rounded-xl p-6 flex flex-col gap-4'>
            <h3 className='flex items-center gap-2 text-base font-bold text-secondary'>
              <UtensilsIcon /> Top 5 Must-Try Dishes
            </h3>
            {countryInfo ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                {countryInfo.top_dishes.map((dish, i) => (
                  <a
                    key={dish.name}
                    href={`https://www.google.com/search?q=${encodeURIComponent(`${countryChallenge} ${dish.name} recipes`)}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex gap-3 bg-background rounded-lg p-3 hover:bg-primary-100 hover:shadow-sm transition-all duration-300 group'
                  >
                    <span className='text-xs font-mono font-bold text-text-muted shrink-0 mt-0.5 group-hover:text-primary transition-colors duration-300'>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className='flex-1'>
                      <p className='text-sm font-semibold text-text group-hover:text-primary transition-colors duration-300'>
                        {dish.name}
                      </p>
                      <p className='text-xs text-text-muted mt-0.5 leading-5'>
                        {dish.description}
                      </p>
                    </div>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      className='w-3 h-3 text-text-muted group-hover:text-primary shrink-0 mt-1 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3'
                      />
                    </svg>
                  </a>
                ))}
              </div>
            ) : (
              <div className='flex flex-col gap-2'>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className='flex gap-3 bg-background rounded-lg p-3'
                  >
                    <SkeletonBlock className='h-4 w-6 shrink-0' />
                    <div className='flex flex-col gap-1.5 flex-1'>
                      <SkeletonBlock className='h-4 w-1/3' />
                      <SkeletonBlock className='h-3 w-2/3' />
                    </div>
                  </div>
                ))}
                <a
                  href={getCountrySearchUrl(
                    countryChallenge,
                    'top 5 typical dishes',
                  )}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-xs text-primary underline underline-offset-2 mt-1 self-start'
                >
                  Search on Google →
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className='flex flex-col gap-4'>
          {/* Cook & Document card */}
          <div className='bg-surface border border-border rounded-xl p-6 flex flex-col gap-4'>
            <div>
              <h3 className='text-lg font-bold text-primary'>
                Cook & Document
              </h3>
              <p className='text-xs text-text-muted mt-1'>
                Add each dish you cooked. Expand a recipe to log ingredients,
                method, and a photo.
              </p>
            </div>

            {/* Add recipe input */}
            <div className='flex flex-col gap-1.5'>
              <label
                htmlFor='recipe-input'
                className='text-[10px] font-bold tracking-widest uppercase text-text-muted'
              >
                What did you cook?
              </label>
              <div className='flex gap-2'>
                <input
                  id='recipe-input'
                  type='text'
                  value={recipeInput}
                  onChange={(e) => setRecipeInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder='e.g., Homemade Wiener Schnitzel'
                  maxLength={100}
                  className='flex-1 min-w-0 border border-border bg-background rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors duration-300'
                />
                <button
                  type='button'
                  onClick={handleAddRecipe}
                  disabled={!recipeInput.trim()}
                  aria-label='Add recipe'
                  className='w-9 h-9 flex items-center justify-center bg-primary text-white rounded-lg text-xl font-bold cursor-pointer hover:bg-primary/90 transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed shrink-0'
                >
                  +
                </button>
              </div>
            </div>

            {/* Recipe cards */}
            {challengeRecipes.length > 0 && (
              <div className='flex flex-col gap-3'>
                {challengeRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.name}
                    recipe={recipe}
                    userId={userId}
                    onUpdate={updateChallengeRecipe}
                    onRemove={removeRecipe}
                  />
                ))}
              </div>
            )}

            {/* Hint */}
            <p className='text-xs text-text-muted italic'>
              {challengeRecipes.length > 0
                ? "Add more dishes, or click Done when you're finished."
                : 'Add at least one dish to mark this country as Done.'}
            </p>

            {/* Done / Cancel */}
            <div className='flex gap-3 pt-1'>
              <button
                onClick={() => setShowDoneConfirm(true)}
                disabled={challengeRecipes.length === 0}
                className='flex-1 bg-primary text-white text-sm font-semibold py-2.5 rounded-lg cursor-pointer hover:bg-primary/90 transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed'
              >
                Done
              </button>
              <button
                onClick={() => setShowCancelConfirm(true)}
                className='flex-1 border border-border text-sm font-semibold py-2.5 rounded-lg cursor-pointer hover:bg-primary-100 transition-colors duration-300'
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Explore Other Recipes */}
          <div className='bg-surface border border-border rounded-xl p-5 flex flex-col gap-3'>
            <p className='text-[10px] font-bold tracking-widest uppercase text-text-muted'>
              Explore Other Recipes
            </p>
            <a
              href={getCountrySearchUrl(
                countryChallenge,
                'traditional recipes',
              )}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center justify-between group'
            >
              <div>
                <p className='font-bold text-text'>{countryChallenge}</p>
                <p className='text-xs text-text-muted mt-0.5'>
                  {countryInfo
                    ? `The Symphony of ${countryChallenge} Cuisine`
                    : 'Search traditional recipes'}
                </p>
              </div>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                className='w-4 h-4 text-text-muted group-hover:text-primary transition-colors duration-300'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3'
                />
              </svg>
            </a>
          </div>

          {/* Chef's Tip */}
          <div className='bg-secondary text-white rounded-xl p-5 flex flex-col gap-2'>
            <p className='flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-white/60'>
              <BulbIcon /> Chef's Tip
            </p>
            {countryInfo ? (
              <p className='text-sm italic leading-6'>
                "{countryInfo.chefs_tip}"
              </p>
            ) : (
              <div className='flex flex-col gap-2'>
                <SkeletonBlock className='h-3 w-full bg-white/20' />
                <SkeletonBlock className='h-3 w-4/5 bg-white/20' />
                <SkeletonBlock className='h-3 w-3/5 bg-white/20' />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirm marking the challenge as done */}
      <ConfirmModal
        open={showDoneConfirm}
        title='Mark this challenge as done?'
        description="This will save your logged recipes and add a new stamp to your passport. You can still add another recipe first if you're not finished."
        confirmLabel="Yes, I'm done"
        cancelLabel='Add another recipe'
        onConfirm={handleDoneConfirmed}
        onCancel={() => setShowDoneConfirm(false)}
        tone='primary'
      />

      {/* Confirm cancelling the challenge */}
      <ConfirmModal
        open={showCancelConfirm}
        title='Cancel this challenge?'
        description={`This will discard ${countryChallenge} and everything you've logged so far. This can't be undone.`}
        confirmLabel='Yes, cancel'
        cancelLabel='Keep cooking'
        onConfirm={handleCancelConfirmed}
        onCancel={() => setShowCancelConfirm(false)}
        tone='danger'
      />
    </div>
  )
}

export default Challenge
