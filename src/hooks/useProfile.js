import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

// 2 letters + 8 digits, e.g. "AB12345678" -- styled like a passport number.
// Not guaranteed globally unique, but collision odds are astronomically
// low for a hobby app, and it's purely decorative (not a real ID).
const generatePassportNumber = () => {
  const letters = Array.from(
    { length: 2 },
    () => LETTERS[Math.floor(Math.random() * LETTERS.length)],
  ).join('')
  const digits = Array.from({ length: 8 }, () =>
    Math.floor(Math.random() * 10),
  ).join('')

  return `${letters}${digits}`
}

export const AVATAR_OPTIONS = [
  'avatar-1',
  'avatar-2',
  'avatar-3',
  'avatar-4',
  'avatar-5',
  'avatar-6',
]

export const useProfile = (user) => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    let isMounted = true
    setLoading(true)

    const load = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (error) {
        console.warn('Could not load profile:', error)
        if (isMounted) setLoading(false)
        return
      }

      if (data) {
        if (isMounted) {
          setProfile(data)
          setLoading(false)
        }
        return
      }

      // First time this account has ever loaded the Passport: create
      // their profile row now, with a freshly generated passport number.
      const { data: created, error: createError } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          passport_number: generatePassportNumber(),
          avatar_id: AVATAR_OPTIONS[0],
        })
        .select('*')
        .single()

      if (createError) {
        console.warn('Could not create profile:', createError)
        if (isMounted) setLoading(false)
        return
      }

      if (isMounted) {
        setProfile(created)
        setLoading(false)
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [user])

  const updateProfile = async (updates) => {
    if (!user) return

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', user.id)
      .select('*')
      .single()

    if (error) {
      console.warn('Could not update profile:', error)
      return
    }

    setProfile(data)
  }

  return { profile, loading, updateProfile }
}
