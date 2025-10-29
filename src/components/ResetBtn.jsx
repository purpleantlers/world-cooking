function ResetBtn({ handleReset }) {
  return (
    <button
      className='font-semibold bg-accent w-45 p-2 tracking-wider rounded hover:tracking-normal duration-300 cursor-pointer'
      onClick={handleReset}
    >
      Reset all
    </button>
  )
}

export default ResetBtn
