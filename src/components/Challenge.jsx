function Challenge({ countryChallenge, done, cancel }) {
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
              href={`https://www.google.com/search?q=${countryChallenge}+food+culture`}
              target='_blank'
            >
              food culture
            </a>{' '}
            and discover its{' '}
            <a
              className='italic font-semibold tracking-wide underline decoration-accent hover:bg-accent hover:rounded-tl-lg hover:rounded-br-lg duration-700'
              href={`https://www.google.com/search?q=${countryChallenge}+top+5+typical+dishes`}
              target='_blank'
            >
              top 5 must-try dishes
            </a>
            .
            <br />
            <br />
            <span className='text-sm'>
              Once cooked, click{' '}
              <span className='font-semibold italic'>Done</span>, or choose{' '}
              <span className='font-semibold italic'>Cancel</span> to select a
              different challenge.
            </span>
          </p>

          <div className='flex gap-10 w-full justify-center'>
            <button
              className='border-2 border-accent w-25 py-1 rounded tracking-widest cursor-pointer hover:tracking-normal hover:font-semibold duration-300'
              onClick={done}
            >
              Done
            </button>
            <button
              className='bg-secondary w-25 py-1 rounded tracking-widest cursor-pointer hover:tracking-normal hover:font-semibold duration-300'
              onClick={cancel}
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
