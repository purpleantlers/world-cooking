function ResetBtn({ handleReset }) {
  const handleClick = () => {
    const confirmed = window.confirm(
      'Reset all progress? This will clear every tasted country and recipe, and cannot be undone.',
    )

    if (confirmed) handleReset()
  }

  return (
    <button
      className='font-semibold bg-accent w-45 p-2 tracking-wider rounded hover:tracking-normal duration-300 cursor-pointer'
      onClick={handleClick}
    >
      Reset all
    </button>
  )
}

export default ResetBtn
