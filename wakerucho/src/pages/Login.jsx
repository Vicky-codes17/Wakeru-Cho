import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
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
      await signIn(formData.email, formData.password)
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

        <h1>Welcome back</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="field-wrap">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="vigneshr@gmail.com"
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
            {isSubmitting ? 'Please wait...' : 'Login'}
          </button>
        </form>

        <div className="auth-switcher">
          <span>New here?</span>
          <button type="button" onClick={() => navigate('/signup')}>Create account</button>
        </div>
      </div>
    </div>
  )
}
