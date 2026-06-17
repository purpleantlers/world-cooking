import { useState } from 'react'
import { getCountrySearchUrl } from '../utils/links'

function ExternalLinkIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth='1.5'
      stroke='currentColor'
      className='size-4'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25'
      />
    </svg>
  )
}

function TastedCard({
  country,
  recipes,
  onDelete,
  onAddRecipe,
  onRemoveRecipe,
}) {
  const [recipeInput, setRecipeInput] = useState('')

  const handleAddRecipe = () => {
    if (!recipeInput.trim()) return

    onAddRecipe(country, recipeInput)
    setRecipeInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddRecipe()
    }
  }

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Remove ${country} from your tasted countries? This also deletes its saved recipes.`
    )

    if (confirmed) onDelete(country)
  }

  return (
    <div className='w-82 min-h-40 flex flex-col bg-primary-100 rounded shadow-lg shadow-primary md:w-67'>
      <div className='rounded-t w-full p-2'>
        <h3 className='font-semibold'>{country}</h3>
      </div>
      <div className='drop-shadow-md drop-shadow-primary border border-primary w-full'></div>

      <div className='flex flex-col gap-2 p-2'>
        <a
          className='flex gap-1 w-fit items-center hover:tracking-wider duration-300'
          href={getCountrySearchUrl(country, 'food culture')}
          target='_blank'
          rel='noopener noreferrer'
        >
          Food Culture
          <ExternalLinkIcon />
        </a>
        <a
          className='flex gap-1 w-fit items-center hover:tracking-wider duration-300'
          href={getCountrySearchUrl(country, 'top 5 typical dishes')}
          target='_blank'
          rel='noopener noreferrer'
        >
          Top Dishes
          <ExternalLinkIcon />
        </a>
      </div>

      <div className='drop-shadow-md drop-shadow-primary border border-primary w-full'></div>

      <div className='flex flex-col gap-2 p-2'>
        <span className='text-xs font-semibold tracking-widest'>
          Recipes cooked
        </span>

        {recipes.length > 0 && (
          <ul className='flex flex-wrap gap-1'>
            {recipes.map((recipe) => (
              <li
                key={recipe}
                className='flex items-center gap-1 bg-background text-xs rounded-full pl-2 pr-1 py-1'
              >
                {recipe}
                <button
                  type='button'
                  onClick={() => onRemoveRecipe(country, recipe)}
                  aria-label={`Remove ${recipe} from ${country}`}
                  className='font-bold leading-none cursor-pointer hover:text-secondary'
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className='flex gap-2'>
          <input
            type='text'
            value={recipeInput}
            onChange={(e) => setRecipeInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Add another recipe'
            aria-label={`Add a recipe to ${country}`}
            className='flex-1 min-w-0 border border-primary outline-none focus:border-2 rounded p-1 text-xs bg-background'
          />
          <button
            type='button'
            onClick={handleAddRecipe}
            disabled={!recipeInput.trim()}
            aria-label={`Add recipe to ${country}`}
            className='font-semibold bg-primary text-white px-4 text-xs rounded tracking-wide cursor-pointer hover:bg-primary/80 transition-all duration-300 disabled:bg-gray-300 disabled:text-text disabled:cursor-not-allowed'
          >
            Add
          </button>
        </div>
      </div>

      <div className='drop-shadow-md drop-shadow-primary border border-primary w-full'></div>

      <div className='w-full flex h-full justify-center rounded-b p-2 bg-background'>
        <button
          onClick={handleDelete}
          className='flex items-center justify-center gap-2 border bg-secondary rounded w-40 font-semibold hover:tracking-tight duration-300 cursor-pointer'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='2'
            stroke='currentColor'
            className='size-4'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0'
            />
          </svg>
          Delete country
        </button>
      </div>
    </div>
  )
}

export default TastedCard
