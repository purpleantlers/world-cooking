function Tasted({ countriesTasted, deleteCountry }) {
  return (
    <>
      {countriesTasted.length <= 0 ? (
        <></>
      ) : (
        <section className='flex flex-col gap-5'>
          <h3 className='text-xl'>Countries Tasted</h3>
          <article className='grid grid-cols-1 w-full gap-5 justify-start xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2'>
            {countriesTasted.map((country) => (
              <div
                className='w-82 h-40 flex flex-col bg-primary-100 rounded shadow-lg shadow-primary md:w-67'
                key={country}
              >
                <div className='rounded-t w-full p-2'>
                  <h3 className='font-semibold'>{country}</h3>
                </div>
                <div className='drop-shadow-md drop-shadow-primary border border-primary w-full'></div>

                <div className='flex flex-col gap-2 p-2'>
                  <a
                    className='flex gap-1 w-fit items-center hover:tracking-wider duration-300'
                    href={`https://www.google.com/search?q=${country}+food+culture`}
                    target='_blank'
                  >
                    Food Culture
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
                  </a>
                  <a
                    className='flex gap-1 w-fit items-center hover:tracking-wider duration-300'
                    href={`https://www.google.com/search?q=${country}+top+5+typical+dishes`}
                    target='_blank'
                  >
                    Top Dishes
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
                  </a>
                </div>

                <div className='drop-shadow-md drop-shadow-primary border border-primary w-full'></div>

                <div className='w-full flex h-full justify-center rounded-b p-2 bg-background'>
                  <button
                    onClick={() => deleteCountry(country)}
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
            ))}
          </article>
        </section>
      )}
    </>
  )
}

export default Tasted
