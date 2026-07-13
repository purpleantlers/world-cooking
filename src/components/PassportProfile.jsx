import { useState, useEffect } from 'react'
import AvatarFace, { AVATAR_IDS } from './Avatars'

const formatIssueDate = (isoString) =>
  isoString
    ? new Date(isoString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—'

const formatBirthDate = (dateString) => {
  if (!dateString) return 'Not set'
  const date = new Date(`${dateString}T00:00:00`)
  return isNaN(date.getTime())
    ? 'Not set'
    : date.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
}

// Converts YYYY-MM-DD database format to DD/MM/YYYY input view
const isoToInputView = (isoString) => {
  if (!isoString) return ''
  const parts = isoString.split('-') // [YYYY, MM, DD]
  if (parts.length !== 3) return ''
  return `${parts[2]}/${parts[1]}/${parts[0]}`
}

// Converts DD/MM/YYYY input view to YYYY-MM-DD database format
const inputViewToIso = (viewString) => {
  const parts = viewString.split('/') // [DD, MM, YYYY]
  if (parts.length !== 3) return null
  const [day, month, year] = parts
  if (!day || !month || !year || year.length !== 4) return null
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

function PassportProfile({ profile, issueDate, onUpdate, onEditingChange }) {
  const [editing, setEditing] = useState(false)
  const [firstName, setFirstName] = useState(profile.first_name)
  const [lastName, setLastName] = useState(profile.last_name)

  // Keep input date string tracked as DD/MM/YYYY
  const [dateOfBirthInput, setDateOfBirthInput] = useState('')
  const [avatarId, setAvatarId] = useState(profile.avatar_id)
  const [saving, setSaving] = useState(false)

  // Bubble state changes upwards to lock the parent layout
  useEffect(() => {
    if (onEditingChange) onEditingChange(editing)
  }, [editing, onEditingChange])

  const startEditing = () => {
    setFirstName(profile.first_name)
    setLastName(profile.last_name)
    setDateOfBirthInput(isoToInputView(profile.date_of_birth))
    setAvatarId(profile.avatar_id)
    setEditing(true)
  }

  // Auto-formats the input values with slashes seamlessly
  const handleDateInputChange = (e) => {
    let value = e.target.value.replace(/\D/g, '') // Extract only digits
    if (value.length > 8) value = value.slice(0, 8) // Constraint length

    let formatted = ''
    if (value.length > 0) {
      formatted = value.slice(0, 2)
    }
    if (value.length > 2) {
      formatted += '/' + value.slice(2, 4)
    }
    if (value.length > 4) {
      formatted += '/' + value.slice(4, 8)
    }
    setDateOfBirthInput(formatted)
  }

  const handleSave = async () => {
    setSaving(true)
    const isoDbDate = inputViewToIso(dateOfBirthInput)

    await onUpdate({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      date_of_birth: isoDbDate, // Validated ISO payload
      avatar_id: avatarId,
    })
    setSaving(false)
    setEditing(false)
  }

  return (
    <div className='flex flex-col gap-6 w-full max-w-md rounded p-6 relative group'>
      {!editing && (
        <button
          type='button'
          onClick={startEditing}
          aria-label='Edit passport details'
          title='Edit details'
          className='absolute top-0 right-0 p-2 text-black/60 hover:text-black transition-colors duration-300 cursor-pointer'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1}
            stroke='currentColor'
            className='w-5 h-5'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125'
            />
          </svg>
        </button>
      )}

      <div className='flex gap-4'>
        <div className='w-18 h-18 overflow-hidden shrink-0'>
          <AvatarFace id={avatarId} className='w-full h-full' />
        </div>

        <div className='flex flex-col gap-1 text-sm justify-center'>
          {editing ? (
            <>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder='Name'
                className='border-l-3 indent-1 border-primary outline-none focus:border-primary text-sm p-1'
              />
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder='Surname'
                className='border-l-3 indent-1 border-primary outline-none focus:border-primary text-sm p-1'
              />
            </>
          ) : (
            <>
              <span className='font-semibold text-base sm:text-lg'>
                {profile.first_name || 'Add your name'}
              </span>
              <span className='text-text/70 text-xs sm:text-base'>
                {profile.last_name}
              </span>
            </>
          )}
        </div>
      </div>

      <dl className='grid grid-cols-2 gap-x-4 gap-y-2 text-sm'>
        <dt className='font-semibold tracking-wide'>Passport No.</dt>
        <dd className='font-mono'>{profile.passport_number}</dd>

        <dt className='font-semibold tracking-wide'>Date of Issue</dt>
        <dd>{formatIssueDate(issueDate)}</dd>

        <dt className='font-semibold tracking-wide'>Date of Birth</dt>
        <dd>
          {editing ? (
            <input
              type='text'
              maxLength={10}
              placeholder='DD/MM/YYYY'
              value={dateOfBirthInput}
              onChange={handleDateInputChange}
              className='border-l-3 indent-1 border-primary outline-none focus:border-primary text-sm font-mono'
            />
          ) : (
            formatBirthDate(profile.date_of_birth)
          )}
        </dd>
      </dl>

      {editing && (
        <div className='flex flex-col gap-2'>
          <span className='text-xs font-semibold tracking-widest'>
            Choose a photo
          </span>
          <div className='flex flex-wrap gap-2'>
            {AVATAR_IDS.map((id) => (
              <button
                key={id}
                type='button'
                onClick={() => setAvatarId(id)}
                aria-label={`Choose avatar ${id}`}
                className={`w-10 h-10 rounded overflow-hidden border-2 cursor-pointer ${
                  avatarId === id ? 'border-primary' : 'border-transparent'
                }`}
              >
                <AvatarFace id={id} className='w-full h-full' />
              </button>
            ))}
          </div>
        </div>
      )}

      {editing && (
        <div className='flex justify-between gap-3 border-t border-primary-100 px-2 -mt-5 sm:mt-0 pt-3'>
          <button
            onClick={handleSave}
            disabled={saving}
            className='bg-primary text-white text-sm font-semibold px-5 py-2 rounded hover:bg-primary/90 transition-colors duration-300 disabled:opacity-50 cursor-pointer'
          >
            Save
          </button>
          <button
            onClick={() => setEditing(false)}
            className='text-sm text-text-muted cursor-pointer hover:text-text'
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}

export default PassportProfile
