import React from 'react'

// 10 distinct color palettes matching your requested profile style
const PALETTES = {
  'avatar-1': { head: '#8A2BE2', body: '#8A2BE2' },
  'avatar-2': { head: '#0070BB', body: '#0070BB' },
  'avatar-3': { head: '#FFBF00', body: '#FFBF00' },
  'avatar-4': { head: '#FF0800', body: '#FF0800' },
  'avatar-5': { head: '#FF4F00', body: '#FF4F00' },
  'avatar-6': { head: '#DE3163', body: '#DE3163' },
  'avatar-7': { head: '#3F6212', body: '#3F6212' },
  'avatar-8': { head: '#854D0E', body: '#854D0E' },
  'avatar-9': { head: '#000000', body: '#000000' },
  'avatar-10': { head: '#BEBFC5', body: '#BEBFC5' },
}

function AvatarFace({ id, className = '' }) {
  const { head, body } = PALETTES[id] ?? PALETTES['avatar-1']

  return (
    <svg
      viewBox='0 0 32 32'
      className={className}
      aria-hidden='true'
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      style={{ display: 'block', width: '100%', height: '100%' }}
    >
      {/* Body */}
      <path
        d='M28 27H4C4.00257 24.3486 5.0566 21.8066 6.9308 19.9318C8.805 18.057 11.3462 17.0026 13.9967 17H18.0032C20.6537 17.0026 23.195 18.057 25.0692 19.9318C26.9434 21.8066 27.9974 24.3486 28 27Z'
        fill={body}
      />

      {/* Head */}
      <path
        d='M16 16C18.7614 16 21 13.7614 21 11C21 8.23858 18.7614 6 16 6C13.2386 6 11 8.23858 11 11C11 13.7614 13.2386 16 16 16Z'
        fill={head}
        className='opacity-50'
      />
    </svg>
  )
}

export const AVATAR_IDS = Object.keys(PALETTES)

export default AvatarFace
