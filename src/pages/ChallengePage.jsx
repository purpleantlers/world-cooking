import { Link, useNavigate } from 'react-router-dom'
import Challenge from '../components/Challenge'
import { useAuth } from '../context/AuthContext'
import { useCountryInfo } from '../hooks/useCountryInfo'

function ChallengePage({ challengeData }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const {
    countryChallenge,
    challengeRecipes,
    addRecipe,
    removeRecipe,
    updateChallengeRecipe,
    handleDone,
    handleCancel,
  } = challengeData

  const { countryInfo } = useCountryInfo(countryChallenge)

  const handleDoneAndGo = async () => {
    await handleDone()
    navigate('/passport')
  }

  const handleCancelAndGo = async () => {
    await handleCancel()
    navigate('/')
  }

  if (!countryChallenge) {
    return (
      <div className='max-w-6xl mx-auto w-full px-6 py-20 flex flex-col items-center gap-4'>
        <p className='text-text-muted text-sm'>No challenge in progress.</p>
        <Link
          to='/'
          className='bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-primary/90 transition-colors duration-300'
        >
          Pick a country
        </Link>
      </div>
    )
  }

  return (
    <Challenge
      countryChallenge={countryChallenge}
      challengeRecipes={challengeRecipes}
      addRecipe={addRecipe}
      removeRecipe={removeRecipe}
      updateChallengeRecipe={updateChallengeRecipe}
      done={handleDoneAndGo}
      cancel={handleCancelAndGo}
      countryInfo={countryInfo}
      userId={user?.id}
    />
  )
}

export default ChallengePage
