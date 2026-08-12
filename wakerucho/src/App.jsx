import { useEffect, useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import OverviewPage from './pages/OverviewPage'
import OrdersPage from './pages/OrdersPage'
import WalletsPage from './pages/WalletsPage'
import ReportsPage from './pages/ReportsPage'
import { supabase } from './lib/supabase'

const navItems = [
  { label: 'Overview' },
  { label: 'Orders' },
  { label: 'Wallets' },
  { label: 'Reports' },
]

function App() {
  const [user, setUser] = useState(null)
  const [activePage, setActivePage] = useState('Overview')
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authMessage, setAuthMessage] = useState('')

  useEffect(() => {
    let mounted = true

    const loadUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (mounted) {
        setUser(session?.user ?? null)
      }
    }

    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const displayName =
    user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'My Account'
  const initials = displayName.slice(0, 2).toUpperCase()

  const renderPage = () => {
    switch (activePage) {
      case 'Overview':
        return <OverviewPage />
      case 'Orders':
        return <OrdersPage />
      case 'Wallets':
        return <WalletsPage />
      case 'Reports':
        return <ReportsPage />
      default:
        return <OverviewPage />
    }
  }

  const openAuthModal = (mode) => {
    setAuthMode(mode)
    setAuthMessage('')
    setAuthModalOpen(true)
  }

  const closeAuthModal = () => {
    setAuthModalOpen(false)
    setAuthMessage('')
    setFormData({ fullName: '', email: '', password: '' })
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleAuthSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setAuthMessage('')

    try {
      if (authMode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
            },
          },
        })

        if (error) throw error

        if (data.user && !data.session) {
          setAuthMessage('Account created. Check your email to confirm your account, then log in.')
          setFormData({ fullName: '', email: '', password: '' })
        } else {
          setUser(data.user)
          closeAuthModal()
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })

        if (error) throw error

        setUser(data.user)
        closeAuthModal()
      }
    } catch (error) {
      setAuthMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <img src="/WakeruCho-Logo.png" alt="WakeruCho logo" className="brand-logo" />
          <div className="brand-name">WakeruCho</div>
        </div>

        <div className="search-wrap">
          <div className="search-box">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="search-icon">
              <circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <path d="M16 16L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <span>Search</span>
          </div>
        </div>

        <div className="profile-area">
          <button className="icon-button" aria-label="Notifications">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10 20a2 2 0 0 0 4 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>

          {user ? (
            <div className="logged-user-pill" aria-label="Logged in user profile">
              <div className="logged-user-avatar">{initials}</div>
              <span className="logged-user-name">{displayName}</span>
              <button type="button" className="sign-out-button" onClick={handleSignOut}>Sign out</button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="auth-button secondary" type="button" onClick={() => openAuthModal('login')}>Login</button>
              <button className="auth-button primary" type="button" onClick={() => openAuthModal('signup')}>Sign Up</button>
            </div>
          )}
        </div>
      </header>

      <main className="dashboard-shell">
        <Sidebar items={navItems} activeItem={activePage} onSelect={setActivePage} />
        <section className="content-panel">{renderPage()}</section>
      </main>

      {authModalOpen && (
        <div className="auth-modal-backdrop" role="dialog" aria-modal="true">
          <div className="auth-modal-card">
            <button type="button" className="close-modal" aria-label="Close modal" onClick={closeAuthModal}>×</button>

            <div className="auth-brand">
              <img src="/WakeruCho-Logo.png" alt="WakeruCho logo" className="auth-brand-logo" />
              <span>WakeruCho</span>
            </div>

            <h2>{authMode === 'login' ? 'Welcome back' : 'Create account'}</h2>

            <form className="auth-form" onSubmit={handleAuthSubmit}>
              {authMode === 'signup' && (
                <label className="field-wrap">
                  <span>Full name</span>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                  />
                </label>
              )}

              <label className="field-wrap">
                <span>Email</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label className="field-wrap">
                <span>Password</span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  minLength="6"
                  required
                />
              </label>

              {authMessage && <p className="auth-message">{authMessage}</p>}

              <button type="submit" className="auth-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Please wait...' : authMode === 'login' ? 'Login' : 'Sign Up'}
              </button>
            </form>

            <div className="auth-switcher">
              <span>{authMode === 'login' ? 'New here?' : 'Already have an account?'}</span>
              <button type="button" onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}>
                {authMode === 'login' ? 'Create account' : 'Login'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
