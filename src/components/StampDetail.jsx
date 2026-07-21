import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { countryFlagCodes } from '../utils/countryFlagCodes'
import ConfirmModal from './ConfirmModal'

const formatDate = (isoString) => {
  if (!isoString) return 'Unknown date'
  return new Date(isoString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function StampDetail({ tasted, onClose, onDelete }) {
  const navigate = useNavigate()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  if (!tasted) return null

  const flagCode = countryFlagCodes[tasted.country]
  const recipeDetails =
    tasted.recipeDetails?.length > 0
      ? tasted.recipeDetails
      : tasted.recipes.map((name) => ({
          name,
          cookedAt: null,
          entry_number: null,
        }))

  const handleDeleteConfirmed = async () => {
    setDeleting(true)
    try {
      await onDelete(tasted.country)
      setShowDeleteConfirm(false)
      onClose()
    } catch (error) {
      console.error('Failed to delete country:', error)
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const handleRecipeClick = (recipe) => {
    // Store the entry number in sessionStorage so that the journal page can open the correct entry
    if (recipe.entry_number) {
      sessionStorage.setItem('journal_open_entry', recipe.entry_number)
    }
    onClose()
    navigate('/journal')
  }

  return (
    <>
      <div
        className='fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50'
        onClick={onClose}
      >
        <div
          className='relative flex flex-col gap-5 bg-background rounded-xl p-6 w-90 sm:w-110 shadow-2xl'
          style={{ boxShadow: '0 20px 60px rgba(28,20,16,0.3)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className='flex items-center gap-4'>
            {flagCode && (
              <div className='stamp-ink-outer shrink-0'>
                <div className='stamp-ink-ring'>
                  <span
                    className={`fi fi-${flagCode} passport-stamp block`}
                    style={{ width: '3rem', height: '3rem' }}
                  />
                </div>
              </div>
            )}
            <div>
              <p
                className='text-[9px] font-mono font-bold tracking-[0.25em] uppercase mb-1'
                style={{ color: 'rgba(139,46,26,0.5)' }}
              >
                Visa Entry
              </p>
              <h2 className='text-xl font-bold text-text'>{tasted.country}</h2>
            </div>
            <button
              type='button'
              onClick={onClose}
              className='absolute top-3 right-3 z-20 w-7 h-7 bg-black/50 text-white flex items-center justify-center rounded-full hover:bg-black/70 transition-colors duration-300 cursor-pointer'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='w-4 h-4'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={2}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>

          {/* Date */}
          <p className='text-sm text-text-muted'>
            Tasted on{' '}
            <span className='font-semibold text-text'>
              {formatDate(tasted.tastedAt)}
            </span>
          </p>

          {/* Recipes */}
          <div className='flex flex-col gap-2'>
            <span className='text-[10px] font-bold tracking-widest uppercase text-text-muted'>
              Recipes Cooked
            </span>
            {recipeDetails.length === 0 ? (
              <p className='text-sm italic text-text-muted'>
                No recipes logged.
              </p>
            ) : (
              <ul className='flex flex-col gap-2'>
                {recipeDetails.map((recipe) => (
                  <li key={recipe.name}>
                    <button
                      type='button'
                      onClick={() => handleRecipeClick(recipe)}
                      className='w-full flex items-center justify-between bg-primary-100 hover:bg-primary-100/70 rounded-lg px-3 py-2 text-sm group transition-colors duration-300 cursor-pointer'
                    >
                      <span className='font-semibold text-text'>
                        {recipe.name}
                      </span>
                      <span className='flex items-center gap-1 text-[10px] font-mono text-primary/50 group-hover:text-primary transition-colors duration-300'>
                        {recipe.entry_number
                          ? `#${String(recipe.entry_number).padStart(3, '0')}`
                          : ''}
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'
                          className='w-3 h-3'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3'
                          />
                        </svg>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Actions */}
          <div className='flex items-center justify-center pt-3 border-t border-border'>
            <button
              type='button'
              onClick={() => setShowDeleteConfirm(true)}
              className='flex items-center justify-center gap-2 text-xs font-medium text-white bg-red-600 hover:bg-red-500 py-2.5 px-4 rounded transition-colors cursor-pointer uppercase tracking-wider'
            >
              Delete Stamp
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                className='w-4 h-4'
              >
                <path
                  d='M1.75 4C1.33579 4 1 4.33579 1 4.75C1 5.16421 1.33579 5.5 1.75 5.5V4ZM22.75 5.5C23.1642 5.5 23.5 5.16421 23.5 4.75C23.5 4.33579 23.1642 4 22.75 4V5.5ZM1.75 5.5H22.75V4H1.75V5.5Z'
                  fill='currentColor'
                />
                <path
                  d='M7.75 4.75C7.75 5.16421 8.08579 5.5 8.5 5.5C8.91421 5.5 9.25 5.16421 9.25 4.75H7.75ZM15.25 4.75C15.25 5.16421 15.5858 5.5 16 5.5C16.4142 5.5 16.75 5.16421 16.75 4.75H15.25ZM14.5 1H10V2.5H14.5V1ZM10 1C9.40326 1 8.83097 1.23705 8.40901 1.65901L9.46967 2.71967C9.61032 2.57902 9.80109 2.5 10 2.5V1ZM8.40901 1.65901C7.98705 2.08097 7.75 2.65326 7.75 3.25H9.25C9.25 3.05109 9.32902 2.86032 9.46967 2.71967L8.40901 1.65901ZM7.75 3.25V4.75H9.25V3.25H7.75ZM16.75 4.75V3.25H15.25V4.75H16.75ZM16.75 3.25C16.75 2.65326 16.5129 2.08097 16.091 1.65901L15.0303 2.71967C15.171 2.86032 15.25 3.05109 15.25 3.25H16.75ZM16.091 1.65901C15.669 1.23705 15.0967 1 14.5 1V2.5C14.6989 2.5 14.8897 2.57902 15.0303 2.71967L16.091 1.65901Z'
                  fill='currentColor'
                />
                <path
                  d='M9.25 17.5C9.25 17.9142 9.58579 18.25 10 18.25C10.4142 18.25 10.75 17.9142 10.75 17.5H9.25ZM10.75 10C10.75 9.58579 10.4142 9.25 10 9.25C9.58579 9.25 9.25 9.58579 9.25 10H10.75ZM10.75 17.5V10H9.25V17.5H10.75Z'
                  fill='currentColor'
                />
                <path
                  d='M13.75 17.5C13.75 17.9142 14.0858 18.25 14.5 18.25C14.9142 18.25 15.25 17.9142 15.25 17.5H13.75ZM15.25 10C15.25 9.58579 14.9142 9.25 14.5 9.25C14.0858 9.25 13.75 9.58579 13.75 10H15.25ZM15.25 17.5V10H13.75V17.5H15.25Z'
                  fill='currentColor'
                />
                <path
                  d='M4.74741 4.68769C4.71299 4.2749 4.35047 3.96818 3.93769 4.00259C3.5249 4.03701 3.21818 4.39953 3.25259 4.81231L4.74741 4.68769ZM21.2474 4.81227C21.2818 4.39949 20.9751 4.03698 20.5623 4.00259C20.1495 3.9682 19.787 4.27495 19.7526 4.68773L21.2474 4.81227ZM18.3676 21.3117C18.352 21.4992 18.2665 21.6744 18.128 21.8018L19.1439 22.9055C19.5593 22.5232 19.8158 21.9986 19.8624 21.436L18.3676 21.3117ZM18.128 21.8018C17.9896 21.9293 17.8083 22 17.6201 22L17.6199 23.5C18.1845 23.5 18.7285 23.2879 19.1439 22.9055L18.128 21.8018ZM17.6201 22H6.881V23.5H17.6199L17.6201 22ZM6.881 22C6.69281 22 6.51142 21.9293 6.37295 21.8018L5.35713 22.9055C5.77253 23.2879 6.31642 23.5 6.881 23.5V22ZM6.37295 21.8018C6.23449 21.6744 6.14899 21.4995 6.13343 21.312L4.63857 21.436C4.68524 21.9986 4.94172 22.5232 5.35713 22.9055L6.37295 21.8018ZM6.13343 21.312L4.74741 4.68769L3.25259 4.81231L4.63857 21.436L6.13343 21.312ZM19.7526 4.68773L18.3676 21.3117L19.8624 21.436L21.2474 4.81227L19.7526 4.68773Z'
                  fill='currentColor'
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <ConfirmModal
        open={showDeleteConfirm}
        title={`Remove ${tasted.country}?`}
        description='This will permanently delete this stamp and all its logged recipes. This cannot be undone.'
        confirmLabel={deleting ? 'Deleting…' : 'Yes, delete'}
        cancelLabel='Keep it'
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setShowDeleteConfirm(false)}
        tone='danger'
      />
    </>
  )
}

export default StampDetail
