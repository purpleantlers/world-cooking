import { useState, useEffect } from 'react'
import { world } from './db'

// LocalStorage
const STORAGE_KEY = 'pickedCountries'

function App() {
  const [country, setCountry] = useState('Next country...')
  const [pickedCountries, setPickedCountries] = useState(() => {
    const storedData = localStorage.getItem(STORAGE_KEY)

    return storedData ? JSON.parse(storedData) : []
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pickedCountries))
  }, [pickedCountries])

  const randomCountry = () => {
    if (pickedCountries.length >= world.length) {
      setCountry('All countries have been tasted!')
      return
    }

    const randomNumber = Math.floor(Math.random() * world.length)
    const newCountry = world[randomNumber]

    if (!pickedCountries.includes(newCountry)) {
      setCountry(newCountry)

      setPickedCountries((prevCountries) => [...prevCountries, newCountry])
    } else {
      randomCountry()
    }
  }

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY)

    location.reload()
  }

  return (
    <section className='bg-background flex flex-col items-center gap-10 h-screen'>
      <div className='flex flex-col items-center gap-2 mt-20'>
        <h2 className='text-3xl font-medium tracking-wide'>Taste the World</h2>
        <p className='tracking-wide'>
          Click the button to pick a random country.
        </p>
      </div>
      <button
        className='font-semibold bg-button text-white w-45 p-2 tracking-wide rounded hover:tracking-wider duration-300 cursor-pointer'
        onClick={randomCountry}
      >
        Discover a country
      </button>
      <h1 className='mt-10 text-lg font-bold tracking-widest'>{country}</h1>

      <div className='flex flex-col mt-10 pb-20 px-10 gap-5 w-full'>
        <h3 className='text-xl'>Countries Tasted</h3>
        <article className='flex flex-wrap w-full gap-1'>
          {pickedCountries.map((item) => (
            <div
              className='w-50 h-20 flex items-center justify-center text-center bg-card text-white rounded'
              key={item}
            >
              {item}
            </div>
          ))}
        </article>
      </div>
      <button
        className='font-semibold bg-button text-white w-45 p-2 tracking-wide rounded hover:tracking-wider duration-300 cursor-pointer'
        onClick={reset}
      >
        Reset list
      </button>
    </section>
  )
}

export default App
