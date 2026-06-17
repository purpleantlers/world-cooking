import TastedCard from './TastedCard'

function Tasted({
  countriesTasted,
  deleteCountry,
  addRecipeToTastedCountry,
  removeRecipeFromTastedCountry,
}) {
  return (
    <>
      {countriesTasted.length <= 0 ? (
        <></>
      ) : (
        <section className='flex flex-col gap-5'>
          <h3 className='text-xl'>Countries Tasted</h3>
          <article className='grid grid-cols-1 w-full gap-5 justify-start xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2'>
            {countriesTasted.map(({ country, recipes }) => (
              <TastedCard
                key={country}
                country={country}
                recipes={recipes}
                onDelete={deleteCountry}
                onAddRecipe={addRecipeToTastedCountry}
                onRemoveRecipe={removeRecipeFromTastedCountry}
              />
            ))}
          </article>
        </section>
      )}
    </>
  )
}

export default Tasted
