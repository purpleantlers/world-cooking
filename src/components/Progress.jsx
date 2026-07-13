function Progress({ tasted, total, nextCountry = null, compact = false }) {
  const percentage = total > 0 ? Math.round((tasted / total) * 100) : 0

  return (
    <div
      className={`w-full ${compact ? '' : 'bg-surface border border-border rounded-lg px-6 py-5 shadow-lg shadow-primary/30'}`}
    >
      {!compact && (
        <div className='flex items-start justify-between gap-4 mb-4'>
          <div>
            <h2 className='text-xl font-display font-bold text-text'>
              Your Culinary Passport
            </h2>
            <p className='text-sm text-text-muted mt-0.5'>
              The road begins with a single bite.
            </p>
          </div>
        </div>
      )}

      <div
        className='w-full h-2 bg-primary-100 rounded-full overflow-hidden'
        role='progressbar'
        aria-valuenow={tasted}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label='Countries tasted progress'
      >
        <div
          className='h-full bg-secondary rounded-full transition-all duration-300'
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className='flex justify-between items-center mt-2 text-[11px] text-text-muted'>
        <div className='flex items-center gap-3'>
          {tasted > 0 && (
            <span className='flex items-center gap-1'>
              <span className='w-2 h-2 rounded-full bg-secondary inline-block' />
              Completed: {tasted}
            </span>
          )}
          {nextCountry && (
            <span className='flex items-center gap-1'>
              <span className='w-2 h-2 rounded-full border border-border inline-block' />
              Next: {nextCountry}
            </span>
          )}
        </div>
        <span>Goal: {total}</span>
      </div>
    </div>
  )
}

export default Progress
