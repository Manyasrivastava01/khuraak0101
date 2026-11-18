import { useState, useEffect } from 'react'

// Lazy-load Supabase only when actually needed (keeps it out of the initial bundle)
let _supabase = null
async function getSupabase() {
  if (_supabase) return _supabase
  const { supabase } = await import('../lib/supabase')
  _supabase = supabase
  return _supabase
}

export function useAuth() {
  const [user, setUser] = useState(() => {
    try {
      const local = localStorage.getItem('khuraak_admin_auth')
      if (local) return JSON.parse(local)
    } catch (e) {}
    // Default active session for manager
    const defaultUser = { email: 'admin@khuraak.com', role: 'owner', name: 'Khuraak Manager' }
    try {
      localStorage.setItem('khuraak_admin_auth', JSON.stringify(defaultUser))
    } catch (e) {}
    return defaultUser
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check Supabase session if configured with real keys
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
      getSupabase().then(sb => {
        sb.auth.getSession().then(({ data }) => {
          if (data?.session?.user) setUser(data.session.user)
        }).catch(() => {})

        const { data: listener } = sb.auth.onAuthStateChange((_event, session) => {
          if (session?.user) setUser(session.user)
        })

        return () => listener?.subscription?.unsubscribe?.()
      })
    }
  }, [])

  const signIn = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase()

    // 1. Direct owner authentication
    if (
      (cleanEmail === 'admin@khuraak.com' || cleanEmail === 'khuraaketawah@gmail.com' || cleanEmail === 'admin') &&
      (password === 'khuraak2026' || password === 'khuraak@123' || password === 'admin')
    ) {
      const adminUser = { email: cleanEmail, role: 'owner', name: 'Khuraak Manager' }
      localStorage.setItem('khuraak_admin_auth', JSON.stringify(adminUser))
      setUser(adminUser)
      return { data: { user: adminUser }, error: null }
    }

    // 2. Supabase auth fallback
    try {
      const sb = await getSupabase()
      const res = await sb.auth.signInWithPassword({ email, password })
      if (!res.error && res.data?.user) {
        localStorage.setItem('khuraak_admin_auth', JSON.stringify(res.data.user))
        setUser(res.data.user)
      }
      return res
    } catch (err) {
      return { error: err }
    }
  }

  const signOut = async () => {
    localStorage.removeItem('khuraak_admin_auth')
    setUser(null)
    try {
      const sb = await getSupabase()
      await sb.auth.signOut()
    } catch (e) {}
  }

  return { user, loading, signIn, signOut }
}
