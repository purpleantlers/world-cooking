function Progress({ tasted, total }) {
  const percentage = total > 0 ? Math.round((tasted / total) * 100) : 0

  return (
    <div className='flex flex-col gap-1 w-90 md:w-180 sm:w-130'>
      <div className='flex justify-between text-sm font-semibold tracking-wide'>
        <span>
          {tasted} / {total} countries tasted
        </span>
        <span>{percentage}%</span>
      </div>
      <div
        className='w-full h-2 bg-primary-100 rounded-full overflow-hidden'
        role='progressbar'
        aria-valuenow={tasted}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label='Countries tasted progress'
      >
        <div
          className='h-full bg-primary rounded-full duration-500'
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default Progress
