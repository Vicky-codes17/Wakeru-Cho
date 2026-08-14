import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const navigate = useNavigate()
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState('login')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  })
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      if (mode === 'signup') {
        const data = await signUp(formData.fullName, formData.email, formData.password)

        if (data.user && !data.session) {
          setMessage('Account created. Check your email to confirm your account before logging in.')
          setFormData({ fullName: '', email: '', password: '' })
          return
        }
      } else {
        await signIn(formData.email, formData.password)
      }

      navigate('/')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <img src="/WakeruCho-Logo.png" alt="WakeruCho logo" className="login-brand-logo" />
          <span>WakeruCho</span>
        </div>

        <h1>{mode === 'login' ? 'Welcome back' : 'Create account'}</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <label className="field-wrap">
              <span>Full name</span>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
              placeholder="••••••••"
              minLength="6"
              required
            />
          </label>

          {message && <p className="login-message">{message}</p>}

          <button type="submit" className="login-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-switcher">
          <span>{mode === 'login' ? 'New here?' : 'Already have an account?'}</span>
          <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
            {mode === 'login' ? 'Create account' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  )
}
