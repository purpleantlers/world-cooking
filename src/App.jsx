import Hero from './components/Hero'
import Challenge from './components/Challenge'
import Tasted from './components/Tasted'
import ResetBtn from './components/ResetBtn'
import Completed from './components/Completed'
import { useChallengeData } from './hooks/useChallengeData'

function App() {
  const {
    countryChallenge,
    countriesTasted,
    ongoingChallenge,
    world,
    deleteCountry,
    selectCountry,
    handleSelectChange,
    handleDone,
    handleCancel,
    handleReset,
    randomCountry,
  } = useChallengeData()

  return (
    <section className='flex flex-col items-center gap-10 min-h-screen h-full py-10 px-10'>
      {countriesTasted.length >= world.length ? (
        <Completed handleReset={handleReset} />
      ) : (
        <>
          <Hero
            selectCountry={selectCountry}
            handleSelectChange={handleSelectChange}
            ongoingChallenge={ongoingChallenge}
            countriesTasted={countriesTasted}
            randomCountry={randomCountry}
            world={world}
          />

          <Challenge
            countryChallenge={countryChallenge}
            done={handleDone}
            cancel={handleCancel}
          />

          <Tasted
            countriesTasted={countriesTasted}
            deleteCountry={deleteCountry}
          />

          {countriesTasted.length > 0 && <ResetBtn handleReset={handleReset} />}
        </>
      )}
    </section>
  )
}

export default App
