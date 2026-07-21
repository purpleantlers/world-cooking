import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'

// Aspect ratio used across the app for recipe photo crops
export const PHOTO_ASPECT = 1 / 1

// Modal for cropping a photo before saving it
function PhotoCropModal({ imageSrc, onCancel, onConfirm }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [processing, setProcessing] = useState(false)

  const onCropComplete = useCallback((_croppedArea, croppedAreaPixelsValue) => {
    setCroppedAreaPixels(croppedAreaPixelsValue)
  }, [])

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return
    setProcessing(true)
    try {
      await onConfirm(croppedAreaPixels)
    } finally {
      setProcessing(false)
    }
  }

  return (
    // Modal overlay
    <div
      className='fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-60'
      onClick={(e) => e.stopPropagation()}
    >
      <div className='relative bg-background rounded w-full max-w-lg flex flex-col overflow-hidden shadow-2xl'>
        {/* Cropper viewport */}
        <div className='relative w-full h-80 bg-black'>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={PHOTO_ASPECT}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Controls */}
        <div className='flex flex-col gap-4 p-5'>
          <div className='flex items-center gap-3'>
            <span className='text-[10px] font-bold tracking-widest uppercase text-text-muted shrink-0'>
              Zoom
            </span>
            <input
              type='range'
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className='w-full accent-primary cursor-pointer'
            />
          </div>

          <div className='flex items-center justify-between pt-1 border-t border-border'>
            <button
              type='button'
              onClick={handleConfirm}
              disabled={processing || !croppedAreaPixels}
              className='bg-primary text-white text-sm font-semibold px-5 py-2 rounded hover:bg-primary/90 transition-colors duration-300 disabled:opacity-50 cursor-pointer'
            >
              {processing ? 'Applying…' : 'Apply Crop'}
            </button>
            <button
              type='button'
              onClick={onCancel}
              disabled={processing}
              className='text-sm text-text-muted cursor-pointer hover:text-text disabled:opacity-50'
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PhotoCropModal
