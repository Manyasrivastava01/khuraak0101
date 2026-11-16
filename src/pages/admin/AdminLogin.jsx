import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn }            = useAuth()
  const navigate              = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) { toast.error('Enter email and password'); return }
    setLoading(true)
    const { error } = await signIn(email, password)
    if (error) {
      toast.error('Invalid credentials. Try again.')
      setLoading(false)
    } else {
      navigate('/admin')
    }
  }

  return (
    <>
      <Helmet><title>Admin Login — Khuraak</title></Helmet>

      <div className="min-h-screen bg-charcoal flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <img
              src="/khuraak-logo.png"
              alt="Khuraak"
              className="h-20 w-auto object-contain mx-auto mb-3"
            />
            <p className="text-white/40 text-sm font-sans mt-1">Secure staff login</p>
          </div>

          <form onSubmit={handleSubmit}
            className="bg-white rounded-3xl p-8 shadow-2xl">
            <h2 className="font-serif text-xl font-bold text-charcoal mb-2">Manager Sign In</h2>
            <p className="text-gray-400 text-xs font-sans mb-6">Access Menu Editor and Website Photo Manager</p>
            <div className="space-y-4">
              <div>
                <label htmlFor="admin-email" className="form-label">Email</label>
                <input id="admin-email" type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@khuraak.com"
                  className="form-input" autoComplete="email" />
              </div>
              <div>
                <label htmlFor="admin-pass" className="form-label">Password</label>
                <input id="admin-pass" type="password" value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="form-input" autoComplete="current-password" />
              </div>
              <button id="admin-login-btn" type="submit" disabled={loading}
                className="btn-primary w-full !py-4 disabled:opacity-60 mt-2">
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Signing in...</>
                  : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
