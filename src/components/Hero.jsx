function Hero({
  selectCountry,
  handleSelectChange,
  ongoingChallenge,
  countriesTasted,
  randomCountry,
  world,
}) {
  return (
    <main className='flex flex-col gap-10'>
      <header className='flex flex-col gap-3'>
        <h1 className='text-3xl font-medium tracking-wide text-center'>
          Taste the World
        </h1>

        <p className='tracking-wide leading-7 mt-2 text-pretty w-90 md:w-180 md:text-lg md:leading-9 sm:w-130 sm:leading-8'>
          World Cooking is your passport to an exciting culinary journey! Get
          ready to explore the{' '}
          <span className='font-semibold'>
            culture and cuisine of countries worldwide
          </span>{' '}
          and bring a new dish to life right in your kitchen.
        </p>
        <p className='text-start tracking-wide leading-7 text-pretty w-90 md:w-180 md:text-lg md:leading-9 sm:w-130 sm:leading-8'>
          Ready for a specific challenge?{' '}
          <span className='font-semibold'>Select country</span> and start
          cooking!
          <br />
          Feeling adventurous? Hit{' '}
          <span className='font-semibold'>Discover country</span> and see where
          the world takes you.
        </p>
      </header>
      <section className='flex flex-row gap-2 justify-center'>
        <select
          className='font-semibold border-2 outline-primary border-primary text-center w-40 p-2 tracking-wide rounded hover:tracking-tight duration-300 appearance-none cursor-pointer disabled:bg-gray-300 disabled:border-none disabled:blur-[1.7px] disabled:hover:tracking-wide disabled:cursor-not-allowed'
          value={selectCountry}
          onChange={handleSelectChange}
          disabled={ongoingChallenge}
        >
          <option
            className='text-sm bg-primary-100 disabled:font-semibold'
            value='none'
          >
            Select country
          </option>
          {world.map((country) => {
            return (
              <option
                className='text-sm bg-primary-100 disabled:font-semibold'
                key={country}
                value={country}
                disabled={countriesTasted.includes(country)}
              >
                {country}
                {countriesTasted.includes(country) ? ' (Tasted)' : ''}
              </option>
            )
          })}
        </select>
        <button
          className='font-semibold bg-primary text-white text-center w-40 p-2 tracking-wide rounded hover:tracking-tight duration-300 cursor-pointer disabled:bg-gray-300 
          disabled:text-text disabled:blur-[1.7px] disabled:hover:tracking-wide disabled:cursor-not-allowed'
          onClick={randomCountry}
          disabled={ongoingChallenge}
        >
          Discover country
        </button>
      </section>
    </main>
  )
}

export default Hero
