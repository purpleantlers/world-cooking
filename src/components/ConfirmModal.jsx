function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  tone = 'primary',
}) {
  if (!open) return null

  const confirmClasses =
    tone === 'danger'
      ? 'bg-red-600 hover:bg-red-700'
      : 'bg-primary hover:bg-primary/90'

  return (
    <div
      className='fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-60'
      onClick={onCancel}
    >
      <div
        className='bg-background rounded-2xl w-full max-w-sm p-6 flex flex-col gap-4 shadow-2xl'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex flex-col gap-2'>
          <h3 className='text-lg font-bold text-text'>{title}</h3>
          {description && (
            <p className='text-sm text-text-muted leading-6'>{description}</p>
          )}
        </div>

        <div className='flex gap-3 mt-2'>
          <button
            type='button'
            onClick={onConfirm}
            className={`flex-1 text-white text-sm font-semibold py-2.5 rounded-full transition-colors duration-300 cursor-pointer ${confirmClasses}`}
          >
            {confirmLabel}
          </button>
          <button
            type='button'
            onClick={onCancel}
            className='flex-1 border border-border text-sm font-semibold py-2.5 rounded-full hover:bg-primary-100 transition-colors duration-300 cursor-pointer'
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
