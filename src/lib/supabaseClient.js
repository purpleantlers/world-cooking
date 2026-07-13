import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase env vars. Copy .env.example to .env and fill in your project URL and anon key.',
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Keeps the session in localStorage so the user stays logged in
    // across page reloads and browser restarts.
    persistSession: true,
    // Silently refreshes the JWT before it expires, so the session
    // never quietly dies while the tab is open.
    autoRefreshToken: true,
    // Required for the Google OAuth redirect flow to pick up the
    // session token from the URL when it bounces back to the app.
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
})
