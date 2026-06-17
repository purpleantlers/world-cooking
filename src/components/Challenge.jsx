import { useState } from 'react'
import { getCountrySearchUrl } from '../utils/links'

function Challenge({
  countryChallenge,
  challengeRecipes,
  addRecipe,
  removeRecipe,
  done,
  cancel,
}) {
  const [recipeInput, setRecipeInput] = useState('')

  const handleAddRecipe = () => {
    if (!recipeInput.trim()) return

    addRecipe(recipeInput)
    setRecipeInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddRecipe()
    }
  }

  const handleDoneClick = () => {
    done()
    setRecipeInput('')
  }

  const handleCancelClick = () => {
    cancel()
    setRecipeInput('')
  }

  return (
    <>
      {countryChallenge && (
        <section className='flex flex-col justify-around items-center border-2 p-3 w-82 gap-3 rounded border-primary shadow-lg shadow-primary'>
          <h1 className='text-xl font-bold tracking-widest'>Challenge</h1>
          <h3 className='bg-accent w-full rounded-br-lg rounded-tl-lg text-center text-sm font-bold tracking-widest p-2'>
            {countryChallenge}
          </h3>

          <p className='border-t border-b w-full py-1 text-center text-pretty leading-7'>
            <span className='tracking-widest italic'>
              Ready for the challenge?
            </span>{' '}
            <br /> Explore the country's{' '}
            <a
              className='italic font-semibold tracking-wide underline decoration-accent hover:bg-accent hover:rounded-tl-lg hover:rounded-br-lg duration-700'
              href={getCountrySearchUrl(countryChallenge, 'food culture')}
              target='_blank'
              rel='noopener noreferrer'
            >
              food culture
            </a>{' '}
            and discover its{' '}
            <a
              className='italic font-semibold tracking-wide underline decoration-accent hover:bg-accent hover:rounded-tl-lg hover:rounded-br-lg duration-700'
              href={getCountrySearchUrl(
                countryChallenge,
                'top 5 typical dishes',
              )}
              target='_blank'
              rel='noopener noreferrer'
            >
              top 5 must-try dishes
            </a>
            .
          </p>

          <div className='flex flex-col gap-2 w-full'>
            <label
              htmlFor='recipe-input'
              className='text-sm font-semibold tracking-wide'
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
                placeholder='Recipe name'
                className='flex-1 min-w-0 border-2 border-primary-100 outline-none focus:border-primary rounded p-2 text-sm'
              />
              <button
                type='button'
                onClick={handleAddRecipe}
                disabled={!recipeInput.trim()}
                className='font-semibold bg-primary text-white px-4 rounded tracking-wide cursor-pointer hover:bg-primary/80 transition-all duration-300 disabled:bg-gray-300 disabled:text-text disabled:cursor-not-allowed'
              >
                Add
              </button>
            </div>

            {challengeRecipes.length > 0 && (
              <ul className='flex flex-wrap gap-2'>
                {challengeRecipes.map((recipe) => (
                  <li
                    key={recipe}
                    className='flex items-center gap-2 bg-primary-100 rounded-full pl-3 pr-2 py-1 text-sm'
                  >
                    {recipe}
                    <button
                      type='button'
                      onClick={() => removeRecipe(recipe)}
                      aria-label={`Remove ${recipe}`}
                      className='font-bold leading-none cursor-pointer hover:text-secondary'
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <span className='text-xs italic'>
              {challengeRecipes.length > 0 ? (
                <>
                  Add more recipes, or click{' '}
                  <span className='font-semibold'>Done</span> when you're
                  finished.
                </>
              ) : (
                <>
                  Add at least one recipe to mark this country as{' '}
                  <span className='font-semibold'>Done</span>.
                </>
              )}
            </span>
          </div>

          <div className='flex gap-10 w-full justify-center'>
            <button
              className='border-2 border-accent font-semibold w-25 py-1 rounded tracking-widest cursor-pointer hover:bg-accent/20 hover:border-white duration-300 disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:font-normal'
              onClick={handleDoneClick}
              disabled={challengeRecipes.length === 0}
            >
              Done
            </button>
            <button
              className='bg-secondary w-25 py-1 rounded tracking-widest font-semibold cursor-pointer hover:bg-secondary/80 transition-all duration-300'
              onClick={handleCancelClick}
            >
              Cancel
            </button>
          </div>
        </section>
      )}
    </>
  )
}

export default Challenge
