import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { countryFlagCodes } from '../utils/countryFlagCodes'
import { uploadRecipePhoto } from '../hooks/useChallengeData'
import { useAuth } from '../context/AuthContext'
import { countryContinent, CONTINENTS } from '../utils/continents'

const ENTRIES_PER_PAGE = 6

const formatDate = (iso) => {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

const formatDateLong = (iso) => {
  if (!iso) return 'Unknown date'
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const entryLabel = (n) =>
  n != null ? `Journal Entry #${String(n).padStart(3, '0')}` : 'Journal Entry'

// Gradient placeholders when no photo uploaded
const GRADIENTS = [
  'from-primary/30 to-accent/20',
  'from-secondary/30 to-primary/20',
  'from-accent/30 to-secondary/20',
  'from-primary/20 to-secondary/30',
  'from-accent/20 to-primary/30',
]
const gradientFor = (index) => GRADIENTS[index % GRADIENTS.length]

// ── Entry card ────────────────────────────────────────────────────────────────
function EntryCard({ entry, index, onClick }) {
  const { country, recipe } = entry
  const flagCode = countryFlagCodes[country]

  return (
    <button
      type='button'
      onClick={() => onClick(entry)}
      className='group flex flex-col bg-surface border border-border rounded overflow-hidden text-left hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer'
    >
      {/* Photo */}
      <div className='relative w-full h-44 overflow-hidden shrink-0'>
        {recipe.photo_url ? (
          <img
            src={recipe.photo_url}
            alt={recipe.name}
            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
          />
        ) : (
          <div
            className={`w-full h-full bg-linear-to-br ${gradientFor(index)} flex items-center justify-center`}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-10 h-10 text-white/40'
            >
              <path
                fillRule='evenodd'
                d='M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z'
                clipRule='evenodd'
              />
            </svg>
          </div>
        )}
        {/* Date badge */}
        {recipe.cookedAt && (
          <span className='absolute top-3 right-3 bg-black/50 text-white text-[10px] font-mono px-2 py-0.5 rounded-full backdrop-blur-sm'>
            {formatDate(recipe.cookedAt)}
          </span>
        )}
      </div>

      {/* Content */}
      <div className='flex flex-col gap-2 p-4 flex-1'>
        <h3 className='font-bold text-text text-sm leading-snug line-clamp-2'>
          {recipe.name}
        </h3>

        {/* Country + flag */}
        <div className='flex items-center gap-1.5'>
          {flagCode ? (
            <span
              className={`fi fi-${flagCode} rounded-sm`}
              style={{ width: '1rem', height: '0.75rem' }}
            />
          ) : (
            <span className='w-2 h-2 rounded-full bg-secondary shrink-0' />
          )}
          <span className='text-xs text-text-muted'>{country}</span>
        </div>

        {/* Intro snippet */}
        {recipe.intro && (
          <p className='text-xs text-text-muted leading-5 line-clamp-2 mt-0.5'>
            {recipe.intro}
          </p>
        )}

        {/* Footer */}
        <div className='flex items-center justify-between mt-auto pt-2 border-t border-border'>
          <span className='text-[10px] font-mono font-bold tracking-widest text-primary/60 uppercase'>
            {entryLabel(recipe.entry_number)}
          </span>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            className='w-3.5 h-3.5 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-300'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3'
            />
          </svg>
        </div>
      </div>
    </button>
  )
}

// ── New Adventure CTA card ────────────────────────────────────────────────────
function NewAdventureCard() {
  return (
    <Link
      to='/'
      className='flex flex-col items-center justify-center gap-3 border-2 border-dashed border-border rounded p-8 text-center hover:border-primary hover:bg-primary/5 transition-all duration-300 min-h-[280px]'
    >
      <div className='w-12 h-12 rounded-full border-2 border-primary/30 flex items-center justify-center text-primary/50 hover:border-primary hover:text-primary transition-colors duration-300'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          className='w-6 h-6'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 4.5v15m7.5-7.5h-15'
          />
        </svg>
      </div>
      <div>
        <p className='font-bold text-text text-sm'>New Adventure?</p>
        <p className='text-xs text-text-muted mt-1'>
          Log a new dish and collect a country stamp in your passport.
        </p>
      </div>
      <span className='mt-1 text-xs font-semibold bg-primary text-white py-2.5 px-4 rounded'>
        Record Journey
      </span>
    </Link>
  )
}

// ── Detail / Edit modal ───────────────────────────────────────────────────────
function EntryModal({ entry, onClose, onUpdate, userId }) {
  const { country, recipe } = entry
  const flagCode = countryFlagCodes[country]

  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Edit form state
  const [name, setName] = useState(recipe.name)
  const [intro, setIntro] = useState(recipe.intro ?? '')
  const [ingredients, setIngredients] = useState(recipe.ingredients ?? '')
  const [method, setMethod] = useState(recipe.method ?? '')
  const [photoUrl, setPhotoUrl] = useState(recipe.photo_url ?? '')

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !userId) return
    setUploading(true)
    const { url, error } = await uploadRecipePhoto(userId, file)
    if (url) {
      setPhotoUrl(url)
    } else if (error) {
      alert(error)
    }
    setUploading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    await onUpdate(recipe.id, {
      name,
      intro,
      ingredients,
      method,
      photo_url: photoUrl,
    })
    setSaving(false)
    setEditing(false)
  }

  const handleCancel = () => {
    setName(recipe.name)
    setIntro(recipe.intro ?? '')
    setIngredients(recipe.ingredients ?? '')
    setMethod(recipe.method ?? '')
    setPhotoUrl(recipe.photo_url ?? '')
    setEditing(false)
  }

  return (
    <div
      className='fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50'
      onClick={onClose}
    >
      <div
        className='relative bg-background rounded w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button — pinned above everything, always reachable */}
        <button
          type='button'
          onClick={onClose}
          className='absolute top-3 right-3 sm:right-6 z-20 w-7 h-7 bg-black/50 text-white flex items-center justify-center rounded-full hover:bg-black/70 transition-colors duration-300 cursor-pointer'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='w-4 h-4'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        </button>

        {/* Scrollable content — photo + body scroll together inside the fixed-height modal */}
        <div className='overflow-y-auto'>
          {/* Photo header */}
          <div className='relative w-full h-56 bg-primary-100 shrink-0'>
            {(editing ? photoUrl : recipe.photo_url) ? (
              <img
                src={editing ? photoUrl : recipe.photo_url}
                alt={recipe.name}
                className='w-full h-full object-cover'
              />
            ) : (
              <div className='w-full h-full bg-linear-to-br from-primary/20 to-accent/10 flex items-center justify-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  className='w-12 h-12 text-white/30'
                >
                  <path
                    fillRule='evenodd'
                    d='M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
            )}

            {/* Upload button in edit mode */}
            {editing && (
              <label className='absolute bottom-3 right-3 bg-black/60 text-white text-xs font-semibold px-3 py-1.5 rounded cursor-pointer hover:bg-black/80 transition-colors duration-300'>
                {uploading ? 'Uploading…' : 'Change photo'}
                <input
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={handlePhotoChange}
                />
              </label>
            )}

            {/* Entry number badge */}
            <div className='absolute bottom-3 left-4'>
              <span className='text-[10px] font-mono font-bold tracking-widest text-white/70 uppercase bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm'>
                {entryLabel(recipe.entry_number)}
              </span>
            </div>
          </div>

          {/* Body */}
          <div className='flex flex-col gap-5 p-6'>
            {/* Title + country */}
            <div className='flex flex-col gap-2'>
              {editing ? (
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                  className='text-xl font-bold text-text border-b-2 border-primary bg-transparent outline-none pb-1'
                />
              ) : (
                <h2 className='text-xl font-bold text-text'>{recipe.name}</h2>
              )}

              <div className='flex items-center gap-2 text-sm text-text-muted'>
                {flagCode && (
                  <span
                    className={`fi fi-${flagCode} rounded-sm`}
                    style={{ width: '1.25rem', height: '0.9rem' }}
                  />
                )}
                <span>{country}</span>
                {recipe.cookedAt && (
                  <>
                    <span className='text-border'>·</span>
                    <span>{formatDateLong(recipe.cookedAt)}</span>
                  </>
                )}
              </div>
            </div>

            {/* Introduction */}
            <ModalSection
              label='Introduction'
              show={editing || !!recipe.intro}
              counter={editing ? `${intro.length}/500` : null}
            >
              {editing ? (
                <textarea
                  value={intro}
                  onChange={(e) => setIntro(e.target.value)}
                  rows={2}
                  maxLength={500}
                  className='w-full border border-border rounded-lg px-3 py-2 text-sm bg-surface outline-none focus:border-primary resize-none'
                />
              ) : (
                <p className='text-sm text-text-muted leading-6'>
                  {recipe.intro}
                </p>
              )}
            </ModalSection>

            {/* Ingredients */}
            <ModalSection
              label='Ingredients'
              show={editing || !!recipe.ingredients}
              counter={editing ? `${ingredients.length}/2000` : null}
            >
              {editing ? (
                <textarea
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  rows={4}
                  maxLength={2000}
                  className='w-full border border-border rounded-lg px-3 py-2 text-sm bg-surface outline-none focus:border-primary resize-none font-mono'
                />
              ) : (
                <pre className='text-sm text-text-muted leading-6 font-mono whitespace-pre-wrap'>
                  {recipe.ingredients}
                </pre>
              )}
            </ModalSection>

            {/* Method */}
            <ModalSection
              label='Method'
              show={editing || !!recipe.method}
              counter={editing ? `${method.length}/5000` : null}
            >
              {editing ? (
                <textarea
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  rows={5}
                  maxLength={5000}
                  className='w-full border border-border rounded-lg px-3 py-2 text-sm bg-surface outline-none focus:border-primary resize-none'
                />
              ) : (
                <pre className='text-sm text-text-muted leading-6 whitespace-pre-wrap'>
                  {recipe.method}
                </pre>
              )}
            </ModalSection>

            {/* Empty state when nothing filled in yet */}
            {!editing &&
              !recipe.intro &&
              !recipe.ingredients &&
              !recipe.method && (
                <p className='text-sm text-text-muted italic text-center py-2'>
                  No details logged yet. Click Edit to add them.
                </p>
              )}

            {/* Actions */}
            <div className='flex items-center justify-center pt-2 border-t border-border'>
              {editing ? (
                <div className='flex flex-row justify-between w-full px-2'>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className='bg-primary text-white text-sm font-semibold px-5 py-2 rounded hover:bg-primary/90 transition-colors duration-300 disabled:opacity-50 cursor-pointer'
                  >
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className='text-sm text-text-muted cursor-pointer hover:text-text'
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className='flex items-center justify-center gap-2 text-xs font-medium text-white bg-primary hover:bg-primary/80 py-2.5 px-4 rounded transition-colors cursor-pointer uppercase tracking-wider'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    className='w-4 h-4'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125'
                    />
                  </svg>
                  Edit Entry
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ModalSection({ label, show, counter = null, children }) {
  if (!show) return null
  return (
    <div className='flex flex-col gap-2'>
      <div className='flex items-center justify-between'>
        <span className='text-[10px] font-bold tracking-widest uppercase text-text-muted'>
          {label}
        </span>
        {counter && (
          <span className='text-[10px] text-text-muted'>{counter}</span>
        )}
      </div>
      {children}
    </div>
  )
}

// ── Main Journal component ────────────────────────────────────────────────────
function Journal({ challengeData }) {
  const { user } = useAuth()
  const { countriesTasted, updateRecipe } = challengeData

  const [page, setPage] = useState(0)
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [search, setSearch] = useState('')
  const [continent, setContinent] = useState('all')
  const [sortOrder, setSortOrder] = useState('recent')

  // Flatten all recipes into journal entries
  const allEntries = countriesTasted.flatMap(
    ({ country, recipeDetails = [] }) =>
      recipeDetails.map((recipe) => ({ country, recipe })),
  )

  // Filter by search and continent
  const filtered = allEntries.filter((entry) => {
    const q = search.trim().toLowerCase()
    const matchesSearch =
      q === '' ||
      entry.recipe.name.toLowerCase().includes(q) ||
      entry.country.toLowerCase().includes(q)
    const matchesContinent =
      continent === 'all' || countryContinent[entry.country] === continent
    return matchesSearch && matchesContinent
  })

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortOrder === 'recent')
      return new Date(b.recipe.cookedAt ?? 0) - new Date(a.recipe.cookedAt ?? 0)
    if (sortOrder === 'oldest')
      return new Date(a.recipe.cookedAt ?? 0) - new Date(b.recipe.cookedAt ?? 0)
    if (sortOrder === 'az') return a.recipe.name.localeCompare(b.recipe.name)
    if (sortOrder === 'za') return b.recipe.name.localeCompare(a.recipe.name)
    return 0
  })

  // Reset to page 0 when filters change
  useEffect(() => {
    setPage(0)
  }, [search, continent, sortOrder])

  const totalPages = Math.ceil((sorted.length + 1) / ENTRIES_PER_PAGE)
  const pageEntries = sorted.slice(
    page * ENTRIES_PER_PAGE,
    (page + 1) * ENTRIES_PER_PAGE,
  )
  const showCTA =
    sorted.length === 0 || (page + 1) * ENTRIES_PER_PAGE >= sorted.length

  // When navigating from Passport stamp → Journal, open the right entry
  useEffect(() => {
    const entryNumber = sessionStorage.getItem('journal_open_entry')
    if (!entryNumber || allEntries.length === 0) return
    sessionStorage.removeItem('journal_open_entry')
    const entryNum = parseInt(entryNumber, 10)
    const target = allEntries.find((e) => e.recipe.entry_number === entryNum)
    if (!target) return
    const targetIndex = sorted.findIndex(
      (e) => e.recipe.entry_number === entryNum,
    )
    if (targetIndex !== -1) setPage(Math.floor(targetIndex / ENTRIES_PER_PAGE))
    setSelectedEntry(target)
  }, [allEntries.length])

  const handleUpdate = async (recipeId, updates) => {
    await updateRecipe(recipeId, updates)
    setSelectedEntry((prev) => ({
      ...prev,
      recipe: { ...prev.recipe, ...updates },
    }))
  }

  const countryCount = countriesTasted.length
  const recipeCount = allEntries.length

  // Only show continent pills that have actual entries
  const availableContinents = CONTINENTS.filter((c) =>
    allEntries.some((e) => countryContinent[e.country] === c),
  )

  return (
    <div className='max-w-6xl mx-auto w-full px-6 py-10 flex flex-col gap-8'>
      {/* ── Header ── */}
      <div className='flex flex-col gap-6'>
        {allEntries.length > 0 && (
          <>
            {/* Stats */}
            <div className='flex items-center divide-x divide-border'>
              <div className='pr-5'>
                <p className='text-2xl font-bold text-text'>{countryCount}</p>
                <p className='text-[10px] font-bold tracking-widest uppercase text-text-muted'>
                  {countryCount === 1 ? 'Country' : 'Countries'}
                </p>
              </div>
              <div className='pl-5'>
                <p className='text-2xl font-bold text-text'>{recipeCount}</p>
                <p className='text-[10px] font-bold tracking-widest uppercase text-text-muted'>
                  {recipeCount === 1 ? 'Recipe' : 'Recipes'}
                </p>
              </div>
            </div>

            {/* Search bar */}
            <div className='relative'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
                />
              </svg>
              <input
                type='text'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search recipes or countries…'
                className='w-full border border-border bg-surface rounded-lg pl-9 pr-9 py-2.5 text-sm outline-none focus:border-primary transition-colors duration-200'
              />
              {search && (
                <button
                  type='button'
                  onClick={() => setSearch('')}
                  aria-label='Clear search'
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text cursor-pointer text-lg leading-none'
                >
                  ×
                </button>
              )}
            </div>

            {/* Continent pills + sort */}
            <div className='flex flex-wrap items-center gap-2'>
              <div className='flex flex-wrap gap-1.5 flex-1'>
                <button
                  type='button'
                  onClick={() => setContinent('all')}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors duration-200 cursor-pointer ${
                    continent === 'all'
                      ? 'bg-primary text-white border-primary'
                      : 'border-border hover:border-primary hover:text-primary'
                  }`}
                >
                  All Regions
                </button>
                {availableContinents.map((c) => (
                  <button
                    key={c}
                    type='button'
                    onClick={() => setContinent(c)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors duration-200 cursor-pointer ${
                      continent === c
                        ? 'bg-primary text-white border-primary'
                        : 'border-border hover:border-primary hover:text-primary'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className='text-xs font-semibold border border-border bg-surface rounded-full px-3 py-1.5 outline-none focus:border-primary cursor-pointer transition-colors duration-200 appearance-none'
              >
                <option value='recent'>Recent First</option>
                <option value='oldest'>Oldest First</option>
                <option value='az'>A → Z</option>
                <option value='za'>Z → A</option>
              </select>
            </div>

            {/* Active filter summary */}
            {(search || continent !== 'all') && (
              <p className='text-xs text-text-muted'>
                Showing {sorted.length}{' '}
                {sorted.length === 1 ? 'result' : 'results'}
                {search && (
                  <span>
                    {' '}
                    for "
                    <span className='font-semibold text-text'>{search}</span>"
                  </span>
                )}
                {continent !== 'all' && (
                  <span>
                    {' '}
                    in{' '}
                    <span className='font-semibold text-text'>{continent}</span>
                  </span>
                )}
                {' · '}
                <button
                  type='button'
                  onClick={() => {
                    setSearch('')
                    setContinent('all')
                  }}
                  className='text-primary underline underline-offset-2 cursor-pointer hover:text-primary/80'
                >
                  Clear all
                </button>
              </p>
            )}
          </>
        )}
      </div>

      {/* ── Grid ── */}
      {allEntries.length === 0 ? (
        <div className='flex flex-col items-center gap-6 py-20'>
          <p className='text-text-muted text-sm text-center'>
            No recipes logged yet — they'll show up here once you complete a
            challenge.
          </p>
          <NewAdventureCard />
        </div>
      ) : sorted.length === 0 ? (
        <div className='flex flex-col items-center gap-3 py-20'>
          <p className='text-text-muted text-sm text-center'>
            No recipes match your search or filters.
          </p>
          <button
            type='button'
            onClick={() => {
              setSearch('')
              setContinent('all')
            }}
            className='text-sm text-primary underline underline-offset-2 cursor-pointer'
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
            {pageEntries.map((entry, i) => (
              <EntryCard
                key={`${entry.country}-${entry.recipe.id ?? entry.recipe.name}-${i}`}
                entry={entry}
                index={page * ENTRIES_PER_PAGE + i}
                onClick={setSelectedEntry}
              />
            ))}
            {showCTA && <NewAdventureCard />}
          </div>

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className='flex items-center justify-center gap-3 pt-4'>
              <button
                type='button'
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                aria-label='Previous page'
                className='w-8 h-8 flex items-center justify-center rounded-full border border-border text-text-muted hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer text-lg font-semibold'
              >
                ‹
              </button>
              <div
                className='flex gap-2'
                role='tablist'
                aria-label='Journal pages'
              >
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    type='button'
                    role='tab'
                    aria-selected={i === page}
                    aria-label={`Page ${i + 1}`}
                    onClick={() => setPage(i)}
                    className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                      i === page
                        ? 'bg-primary w-4'
                        : 'bg-border w-2 hover:bg-primary/40'
                    }`}
                  />
                ))}
              </div>
              <button
                type='button'
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                aria-label='Next page'
                className='w-8 h-8 flex items-center justify-center rounded-full border border-border text-text-muted hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer text-lg font-semibold'
              >
                ›
              </button>
            </div>
          )}
        </>
      )}

      {/* ── Entry modal ── */}
      {selectedEntry && (
        <EntryModal
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
          onUpdate={handleUpdate}
          userId={user?.id}
        />
      )}
    </div>
  )
}

export default Journal
