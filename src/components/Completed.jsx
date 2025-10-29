import ResetBtn from './ResetBtn'

function Completed({ handleReset }) {
  return (
    <section className='flex flex-col gap-10 items-center justify-center h-screen -mt-20'>
      <h1 className='text-2xl font-semibold tracking-wider'>Well done!</h1>
      <h3>😋 All countries have been tasted 😋</h3>

      <ResetBtn handleReset={handleReset} />
    </section>
  )
}

export default Completed
